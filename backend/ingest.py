"""
Unified FAISS Indexing Script for AI Tutor
Ingests PDF documents and creates a FAISS vector store for RAG.

Usage:
    python ingest.py                         # Auto: ingest chapters or GRADE PDFs
    python ingest.py --source grade          # Ingest backend/data/GRADE PDFs
    python ingest.py --source grade --grade 8  # Ingest only grade 8 from GRADE
    python ingest.py --source all            # Ingest chapters + GRADE PDFs
    python ingest.py --hf                    # Use HuggingFace embeddings
"""
import os
import sys
import argparse
import re
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from dotenv import load_dotenv

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHAPTERS_DIR = os.path.join(BASE_DIR, "data", "chapters")
GRADE_DIR = os.path.join(BASE_DIR, "data", "GRADE")
VECTOR_STORE_PATH = os.path.join(BASE_DIR, "data", "vector_store", "faiss_index")


def get_embeddings(use_huggingface: bool = False):
    """Get the appropriate embedding model."""
    if use_huggingface:
        from langchain_community.embeddings import HuggingFaceEmbeddings
        print("🤗 Using HuggingFace embeddings (all-MiniLM-L6-v2)")
        return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    else:
        from src.utils.euriai_embeddings import EuriaiEmbeddings
        print("🧠 Using EuriAI embeddings (gemini-embedding-001)")
        return EuriaiEmbeddings(model="gemini-embedding-001")


def ingest_documents(use_huggingface: bool = False, *, source: str = "auto", grade: int | None = None, limit: int | None = None):
    """
    Ingests PDF documents and creates a FAISS vector store.
    """
    # Ensure directories exist
    os.makedirs(CHAPTERS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(VECTOR_STORE_PATH), exist_ok=True)

    def extract_grade_number(text: str) -> str | None:
        m = re.search(r"\d+", text or "")
        if not m:
            return None
        try:
            return str(int(m.group(0)))
        except Exception:
            return None

    def guess_subject_from_filename(filename: str) -> str | None:
        base = os.path.splitext(os.path.basename(filename))[0].lower()
        base = re.sub(r"^\s*\d+(st|nd|rd|th)\s*", "", base).strip()

        # Prefer concrete subject tokens first (avoid 'Eng Maths' becoming English)
        if re.search(r"\bmath(s)?\b", base):
            return "Mathematics"
        if re.search(r"\bev\s*s\b", base) or "environmental" in base or "evs" in base:
            return "Environmental Studies (EVS)"
        if "science" in base:
            return "Science"
        if any(t in base for t in ["social", "history", "civics", "geography"]):
            return "Social Science"
        if "computer" in base:
            return "Computer Science"
        if "hindi" in base:
            return "Hindi"
        if re.search(r"\bkan\b", base) or "kannada" in base:
            return "Kannada"
        if re.search(r"\beng\b", base) or "english" in base:
            return "English"
        return None

    def find_chapters_pdfs() -> List[str]:
        if not os.path.isdir(CHAPTERS_DIR):
            return []
        return [
            os.path.join(CHAPTERS_DIR, f)
            for f in os.listdir(CHAPTERS_DIR)
            if f.lower().endswith(".pdf")
        ]

    def find_grade_pdfs(grade_filter: int | None = None) -> List[str]:
        if not os.path.isdir(GRADE_DIR):
            return []
        pdfs: List[str] = []
        for root, _, files in os.walk(GRADE_DIR):
            folder_grade = extract_grade_number(os.path.basename(root))
            if grade_filter is not None and folder_grade and int(folder_grade) != int(grade_filter):
                continue
            for f in files:
                if not f.lower().endswith(".pdf"):
                    continue
                path = os.path.join(root, f)
                if grade_filter is not None:
                    inferred = folder_grade or extract_grade_number(f)
                    if inferred and int(inferred) != int(grade_filter):
                        continue
                pdfs.append(path)
        return sorted(set(pdfs))

    def build_pdf_list(source: str, grade_filter: int | None = None) -> List[str]:
        source = (source or "auto").strip().lower()
        if source == "chapters":
            return find_chapters_pdfs()
        if source == "grade":
            return find_grade_pdfs(grade_filter=grade_filter)
        if source == "all":
            return sorted(set(find_chapters_pdfs() + find_grade_pdfs(grade_filter=grade_filter)))
        # auto: prefer chapters if present, else grade
        chapters = find_chapters_pdfs()
        if chapters:
            return chapters
        return find_grade_pdfs(grade_filter=grade_filter)

    pdf_paths = build_pdf_list(source, grade_filter=grade)
    if limit:
        pdf_paths = pdf_paths[: max(0, int(limit))]

    if not pdf_paths:
        print("⚠️ No PDF files found to ingest.")
        print(f"- Chapters dir: {CHAPTERS_DIR}")
        print(f"- Grade dir: {GRADE_DIR}")
        print("\nHints:")
        print("- Put curated PDFs in backend/data/chapters")
        print("- Or keep textbooks in backend/data/GRADE/<1st..10th>/")
        print("- Run: python ingest.py --source grade --grade 8")
        return

    print(f"📚 Found {len(pdf_paths)} PDF(s) to process...")

    all_splits = []

    # Process each PDF
    for pdf_path in pdf_paths:
        pdf_file = os.path.basename(pdf_path)
        print(f"   Processing: {pdf_file}")

        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()

            # Metadata from curated chapters PDFs (format: Board_Grade_Subject.pdf)
            if os.path.abspath(pdf_path).startswith(os.path.abspath(CHAPTERS_DIR) + os.sep):
                parts = pdf_file.replace('.pdf', '').split('_')
                if len(parts) >= 3:
                    board, grade, subject = parts[0], parts[1], "_".join(parts[2:])
                    for doc in documents:
                        doc.metadata.update({
                            'collection': 'chapters',
                            'board': board,
                            'grade': grade,
                            'subject': subject,
                            'source_file': pdf_file,
                            'source_path': os.path.relpath(pdf_path, BASE_DIR),
                        })
            else:
                # Metadata for backend/data/GRADE/<grade>/... PDFs
                folder_grade = extract_grade_number(os.path.basename(os.path.dirname(pdf_path)))
                inferred_grade = folder_grade or extract_grade_number(pdf_file)
                inferred_subject = guess_subject_from_filename(pdf_file)
                for doc in documents:
                    doc.metadata.update({
                        'collection': 'GRADE',
                        'grade': inferred_grade,
                        'subject': inferred_subject,
                        'source_file': pdf_file,
                        'source_path': os.path.relpath(pdf_path, BASE_DIR),
                    })

            # Split text into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", " ", ""]
            )
            splits = text_splitter.split_documents(documents)
            all_splits.extend(splits)
            print(f"   ✅ Processed {len(documents)} pages into {len(splits)} chunks.")

        except Exception as e:
            print(f"   ❌ Error processing {pdf_file}: {e}")

    if not all_splits:
        print("❌ No documents were successfully processed.")
        return

    print(f"\n🧩 Total chunks to embed: {len(all_splits)}")
    print("🧠 Generating embeddings and creating vector store...")

    try:
        embeddings = get_embeddings(use_huggingface)
        vector_store = FAISS.from_documents(all_splits, embeddings)
        vector_store.save_local(VECTOR_STORE_PATH)
        print(f"✅ Vector store saved to: {VECTOR_STORE_PATH}")
        print("🎉 Done! Restart the backend to load the new knowledge base.")

    except Exception as e:
        print(f"❌ Error creating vector store: {e}")
        if "API_KEY" in str(e) or "403" in str(e):
            print("\n⚠️ Hint: Check your EURIAI_API_KEY in the .env file.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest PDFs and create FAISS index")
    parser.add_argument("--hf", action="store_true", help="Use HuggingFace embeddings instead of EuriAI")
    parser.add_argument(
        "--source",
        choices=["auto", "chapters", "grade", "all"],
        default="auto",
        help="Which PDFs to ingest (default: auto)",
    )
    parser.add_argument("--grade", type=int, default=None, help="Restrict GRADE ingestion to a single grade (1-10)")
    parser.add_argument("--limit", type=int, default=None, help="Limit number of PDFs to ingest (debug)")
    args = parser.parse_args()

    ingest_documents(use_huggingface=args.hf, source=args.source, grade=args.grade, limit=args.limit)
