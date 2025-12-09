import os
import sys
from typing import List
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from src.utils.euriai_embeddings import EuriaiEmbeddings
from dotenv import load_dotenv

# Add the project root to the python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def ingest_documents():
    """
    Ingests PDF documents from the data/documents directory and creates a FAISS vector store.
    """
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(base_dir, "data", "documents")
    vector_store_path = os.path.join(base_dir, "data", "vector_store", "faiss_index")
    
    # Check if documents directory exists
    if not os.path.exists(docs_dir):
        print(f"❌ Documents directory not found at: {docs_dir}")
        print("Please create it and add your PDF files.")
        return

    # Find all PDF files
    pdf_files = [f for f in os.listdir(docs_dir) if f.lower().endswith('.pdf')]
    
    if not pdf_files:
        print(f"⚠️ No PDF files found in {docs_dir}")
        print("Please add some .pdf files to this directory and try again.")
        return

    print(f"📚 Found {len(pdf_files)} PDF(s) to process...")
    
    all_splits = []
    
    # Process each PDF
    for pdf_file in pdf_files:
        pdf_path = os.path.join(docs_dir, pdf_file)
        print(f"   Processing: {pdf_file}")
        
        try:
            loader = PyPDFLoader(pdf_path)
            documents = loader.load()
            
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
    print("🧠 Generating embeddings and creating vector store (this may take a moment)...")

    try:
        # Initialize embeddings
        embeddings = EuriaiEmbeddings(model="gemini-embedding-001")
        
        # Create vector store
        vector_store = FAISS.from_documents(all_splits, embeddings)
        
        # Save vector store
        vector_store.save_local(vector_store_path)
        print(f"✅ Vector store successfully saved to: {vector_store_path}")
        print("🎉 RAG setup complete! You can now restart the backend to load the new knowledge base.")
        
    except Exception as e:
        print(f"❌ Error creating vector store: {e}")
        # Check for common API key issue
        if "API_KEY" in str(e) or "403" in str(e):
             print("\n⚠️  Hint: Check if your EURIAI_API_KEY is correctly set in the .env file.")

if __name__ == "__main__":
    ingest_documents()
