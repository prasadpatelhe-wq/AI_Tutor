import logging
from typing import List
from langchain_core.embeddings import Embeddings
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class HuggingFaceEmbeddings(Embeddings):
    """Hugging Face embeddings for LangChain using sentence-transformers."""

    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        try:
            self.model = SentenceTransformer(model_name)
            logger.info(f"Hugging Face embeddings model '{model_name}' loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading HF embeddings model '{model_name}': {e}")
            raise e

    def _embed(self, text: str) -> List[float]:
        """Get embedding for a single text."""
        try:
            return self.model.encode(text).tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return []

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed multiple documents."""
        try:
            return self.model.encode(texts).tolist()
        except Exception as e:
            logger.error(f"Error generating embeddings for documents: {e}")
            return [[] for _ in texts]

    def embed_query(self, text: str) -> List[float]:
        """Embed a query (same as single document)."""
        return self._embed(text)
