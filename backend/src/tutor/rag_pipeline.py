"""
Enhanced RAG Pipeline for AI Tutor.
Provides better retrieval with query transformation and contextual filtering.
"""

import re
from typing import Dict, List, Optional

from langchain_core.documents import Document
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

from .langchain_wrapper import ChatEuriai


class EnhancedRAGPipeline:
    """
    Enhanced RAG pipeline with:
    - Multi-query retrieval for better coverage
    - Subject-aware filtering
    - Grade-appropriate response generation
    - Context compression for relevance
    """

    def __init__(self, retriever, llm: Optional[ChatEuriai] = None):
        """
        Initialize the RAG pipeline.

        Args:
            retriever: Base retriever (e.g., FAISS retriever)
            llm: LangChain-compatible LLM for query expansion
        """
        self.base_retriever = retriever
        self.llm = llm or ChatEuriai(task_type="chat", complexity="simple")

        # Query expansion prompt
        self.query_expansion_prompt = PromptTemplate.from_template(
            """You are an educational content search assistant.
Given a student's question, generate 3 alternative search queries that would help find relevant educational content.
Focus on key concepts, synonyms, and related topics.

Original question: {question}
Subject: {subject}
Grade level: {grade}

Generate exactly 3 alternative queries, one per line:"""
        )

        # Answer synthesis prompt
        self.answer_prompt = ChatPromptTemplate.from_template(
            """You are a helpful {subject} tutor for grade {grade} students.

Use the following context from the curriculum to answer the student's question.
If the context doesn't contain relevant information, use your knowledge but mention that.

Context from curriculum:
{context}

Student's question: {question}

Previous conversation:
{history}

Provide a clear, grade-appropriate explanation:"""
        )

    def _expand_query(self, question: str, subject: str, grade: str) -> List[str]:
        """Generate alternative queries for better retrieval."""
        try:
            prompt = self.query_expansion_prompt.format(
                question=question,
                subject=subject,
                grade=grade
            )
            response = self.llm.invoke([HumanMessage(content=prompt)])
            queries = [q.strip() for q in response.content.strip().split('\n') if q.strip()]
            # Include original query
            return [question] + queries[:3]
        except Exception:
            return [question]

    def _filter_by_subject(
        self,
        docs: List[Document],
        subject: str,
    ) -> List[Document]:
        """Filter documents to match the requested subject."""
        if not subject:
            return docs

        def normalize(s: str) -> str:
            s = (s or "").strip().lower()
            s = re.sub(r"\(.*?\)", "", s)
            s = s.replace("&", "and")
            s = re.sub(r"[^a-z0-9]+", " ", s)
            return re.sub(r"\s+", " ", s).strip()

        subject_normalized = normalize(subject)

        filtered = []
        for doc in docs:
            doc_subject = normalize(doc.metadata.get("subject", ""))
            if not doc_subject:
                # Include docs without subject metadata
                filtered.append(doc)
            elif subject_normalized in doc_subject or doc_subject in subject_normalized:
                filtered.append(doc)

        # If filtering removed everything, return original docs
        return filtered if filtered else docs

    def _deduplicate_docs(self, docs: List[Document]) -> List[Document]:
        """Remove duplicate documents based on content."""
        seen = set()
        unique = []
        for doc in docs:
            content_hash = hash(doc.page_content[:200])  # Hash first 200 chars
            if content_hash not in seen:
                seen.add(content_hash)
                unique.append(doc)
        return unique

    def retrieve(
        self,
        question: str,
        subject: str = "general",
        grade: str = "6th",
        k: int = 5,
        use_query_expansion: bool = True,
    ) -> List[Document]:
        """
        Retrieve relevant documents with optional query expansion.

        Args:
            question: The student's question
            subject: Subject filter
            grade: Grade level for context
            k: Number of documents to retrieve
            use_query_expansion: Whether to use multi-query retrieval

        Returns:
            List of relevant documents
        """
        if not self.base_retriever:
            return []

        all_docs = []

        if use_query_expansion:
            # Get expanded queries
            queries = self._expand_query(question, subject, grade)

            # Retrieve for each query
            for query in queries:
                try:
                    docs = self.base_retriever.invoke(query)
                    all_docs.extend(docs)
                except Exception:
                    continue
        else:
            try:
                all_docs = self.base_retriever.invoke(question)
            except Exception:
                return []

        # Filter and deduplicate
        filtered = self._filter_by_subject(all_docs, subject)
        unique = self._deduplicate_docs(filtered)

        return unique[:k]

    def get_context_string(self, docs: List[Document]) -> str:
        """Convert documents to a context string."""
        if not docs:
            return "No specific curriculum context available."

        context_parts = []
        for i, doc in enumerate(docs, 1):
            metadata = doc.metadata
            source_info = []
            if metadata.get("chapter"):
                source_info.append(f"Chapter: {metadata['chapter']}")
            if metadata.get("subject"):
                source_info.append(f"Subject: {metadata['subject']}")

            source = " | ".join(source_info) if source_info else f"Source {i}"
            context_parts.append(f"[{source}]\n{doc.page_content}")

        return "\n\n".join(context_parts)

    def query(
        self,
        question: str,
        subject: str = "general",
        grade: str = "6th",
        history: str = "",
        k: int = 5,
    ) -> Dict:
        """
        Full RAG query with retrieval and answer generation.

        Args:
            question: The student's question
            subject: Subject context
            grade: Grade level
            history: Previous conversation history
            k: Number of documents to retrieve

        Returns:
            Dict with answer, sources, and metadata
        """
        # Retrieve relevant documents
        docs = self.retrieve(question, subject, grade, k)
        context = self.get_context_string(docs)

        # Generate answer
        prompt = self.answer_prompt.format(
            subject=subject,
            grade=grade,
            context=context,
            question=question,
            history=history or "No previous conversation.",
        )

        try:
            # Use subject-appropriate LLM configuration
            llm = ChatEuriai(
                task_type=self._get_task_type(subject),
                complexity="medium",
                subject=subject,
                grade=grade,
            )
            response = llm.invoke([HumanMessage(content=prompt)])
            answer = response.content
        except Exception as e:
            answer = f"I encountered an issue generating a response. Please try again. Error: {str(e)}"

        return {
            "answer": answer,
            "sources": [
                {
                    "content": doc.page_content[:200] + "...",
                    "metadata": doc.metadata,
                }
                for doc in docs
            ],
            "num_sources": len(docs),
            "subject": subject,
            "grade": grade,
        }

    def _get_task_type(self, subject: str) -> str:
        """Map subject to task type for optimal model selection."""
        subject_lower = subject.lower()
        if "math" in subject_lower:
            return "math"
        elif "science" in subject_lower or "evs" in subject_lower:
            return "science"
        elif "social" in subject_lower or "history" in subject_lower:
            return "creative"
        else:
            return "chat"

    def create_chain(self, subject: str = "general", grade: str = "6th"):
        """
        Create a LangChain runnable chain for RAG.

        Returns:
            A runnable chain that takes a question and returns an answer
        """
        def retrieve_and_format(inputs: Dict) -> Dict:
            question = inputs.get("question", "")
            history = inputs.get("history", "")
            docs = self.retrieve(question, subject, grade)
            return {
                "context": self.get_context_string(docs),
                "question": question,
                "history": history,
                "subject": subject,
                "grade": grade,
            }

        llm = ChatEuriai(
            task_type=self._get_task_type(subject),
            complexity="medium",
            subject=subject,
            grade=grade,
        )

        chain = (
            RunnableLambda(retrieve_and_format)
            | self.answer_prompt
            | llm
            | StrOutputParser()
        )

        return chain


def create_rag_pipeline(retriever, llm: Optional[ChatEuriai] = None) -> EnhancedRAGPipeline:
    """Factory function to create an enhanced RAG pipeline."""
    return EnhancedRAGPipeline(retriever, llm)
