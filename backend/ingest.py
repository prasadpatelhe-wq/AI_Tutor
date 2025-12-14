"""
Unified FAISS Indexing Script for AI Tutor
Ingests PDF documents and creates a FAISS vector store for RAG.

Usage:
    python ingest.py                    # Use EuriAI embeddings (default)
    python ingest.py --hf               # Use HuggingFace embeddings
"""
import os
import sys
import argparse
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


def ingest_documents(use_huggingface: bool = False):
    """
    Ingests PDF documents from the data/chapters directory and creates a FAISS vector store.
    """
    # Ensure directories exist
    os.makedirs(CHAPTERS_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(VECTOR_STORE_PATH), exist_ok=True)

    # Find all PDF files
    pdf_files = [f for f in os.listdir(CHAPTERS_DIR) if f.lower().endswith('.pdf')]

    if not pdf_files:
        print(f"⚠️ No PDF files found in {CHAPTERS_DIR}")
        print("Please add .pdf files (chapters/curriculum) to this directory.")
        return

    print(f"📚 Found {len(pdf_files)} PDF(s) to process...")

    all_splits = []

    # Process each PDF
    for pdf_file in pdf_files:
        pdf_path = os.path.join(CHAPTERS_DIR, pdf_file)
        print(f"   Processing: {pdf_file}")

        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()

            # Extract metadata from filename (format: Board_Grade_Subject.pdf)
            parts = pdf_file.replace('.pdf', '').split('_')
            if len(parts) >= 3:
                board, grade, subject = parts[0], parts[1], "_".join(parts[2:])
                for doc in documents:
                    doc.metadata.update({
                        'board': board,
                        'grade': grade,
                        'subject': subject,
                        'source_file': pdf_file
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
    args = parser.parse_args()

    ingest_documents(use_huggingface=args.hf)
