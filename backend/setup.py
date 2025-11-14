import os
import glob
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

def parse_pdf(file_path: str, board: str, grade: str, subject: str):
    """Parse PDF and add metadata to each chunk."""
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    loader = PyPDFLoader(file_path)
    documents = loader.load_and_split(text_splitter)

    for doc in documents:
        doc.metadata.update({
            'board': board,
            'grade': grade,
            'subject': subject
        })

    return documents


def main():
    """Setup PDFs and create FAISS index for the AI Tutor."""
    print("📘 Setting up AI Tutor data using Hugging Face Embeddings...")

    # Initialize Hugging Face embedding model
    try:
        embedding_function = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        print("✅ Loaded Hugging Face embedding model: all-MiniLM-L6-v2")
    except Exception as e:
        print(f"❌ Failed to load Hugging Face embeddings: {e}")
        return

    syllabus_dir = "data/syllabi"
    os.makedirs(syllabus_dir, exist_ok=True)

    pdf_files = glob.glob(os.path.join(syllabus_dir, "*.pdf"))
    if not pdf_files:
        print(f"📁 No PDFs found in {syllabus_dir}/")
        return

    print(f"📚 Processing {len(pdf_files)} PDF file(s)...")

    all_documents = []
    for pdf_path in pdf_files:
        file_name = os.path.basename(pdf_path)
        parts = file_name.replace('.pdf', '').split('_')

        if len(parts) < 3:
            print(f"⚠️ Skipping {file_name} (invalid name format). Expected format: <Board>_<Grade>_<Subject>.pdf")
            continue

        board, grade, subject = parts[0], parts[1], "_".join(parts[2:])
        print(f"   ➜ Processing {file_name}...")

        try:
            documents = parse_pdf(pdf_path, board, grade, subject)
            all_documents.extend(documents)
        except Exception as e:
            print(f"❌ Error while parsing {file_name}: {e}")

    if not all_documents:
        print("❌ No documents were parsed successfully.")
        return

    try:
        print("🧠 Creating FAISS vector store...")
        faiss_index = FAISS.from_documents(all_documents, embedding_function)

        index_path = "data/vector_store/faiss_index"
        os.makedirs(os.path.dirname(index_path), exist_ok=True)
        faiss_index.save_local(index_path)

        print("✅ Setup complete! FAISS index created successfully.")
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        print("   Check your internet connection or embeddings model.")

if __name__ == "__main__":
    main()
