"""
Enhanced AI Tutor Interface with LangChain Integration.
Wraps the existing AI_Tutor with LangChain memory, RAG, and workflows.
"""

import os
import logging
from typing import Dict, List, Optional

from langchain_core.messages import HumanMessage

from .interface import AI_Tutor, tutor_interface
from .langchain_wrapper import ChatEuriai
from .memory_service import memory_manager, StudentMemoryManager
from .rag_pipeline import EnhancedRAGPipeline, create_rag_pipeline
from .langgraph_tutor import TutoringWorkflow, create_tutoring_workflow, LANGGRAPH_AVAILABLE

logger = logging.getLogger(__name__)


class EnhancedAITutor:
    """
    Enhanced AI Tutor with LangChain integration.

    Features:
    - Conversation memory per student
    - Enhanced RAG with query expansion
    - LangGraph workflow for multi-step tutoring
    - Backward compatible with existing AI_Tutor methods
    """

    def __init__(self, base_tutor: Optional[AI_Tutor] = None):
        """
        Initialize the enhanced tutor.

        Args:
            base_tutor: Existing AI_Tutor instance to wrap
        """
        logger.info("Initializing Enhanced AI Tutor with LangChain...")

        # Use existing tutor or create new one
        self.base_tutor = base_tutor or tutor_interface

        # Initialize LangChain components
        self.memory_manager = memory_manager
        self.llm = ChatEuriai(task_type="chat", complexity="medium")

        # Create enhanced RAG pipeline if retriever is available
        if self.base_tutor.retriever:
            self.rag_pipeline = create_rag_pipeline(self.base_tutor.retriever, self.llm)
            logger.info("Enhanced RAG pipeline initialized")
        else:
            self.rag_pipeline = None
            logger.warning("No retriever available - RAG pipeline disabled")

        # Create LangGraph workflow
        self.workflow = create_tutoring_workflow(self.rag_pipeline)
        logger.info(f"LangGraph workflow initialized (available: {LANGGRAPH_AVAILABLE})")

        logger.info("Enhanced AI Tutor ready!")

    # === Enhanced Chat Methods ===

    def chat(
        self,
        message: str,
        student_id: str,
        subject: str = "general",
        grade: str = "6th",
        use_memory: bool = True,
        use_rag: bool = True,
    ) -> Dict:
        """
        Enhanced chat with memory and RAG support.

        Args:
            message: Student's message
            student_id: Student identifier
            subject: Subject context
            grade: Grade level
            use_memory: Whether to use conversation memory
            use_rag: Whether to use RAG for context

        Returns:
            Dict with response and metadata
        """
        # Use LangGraph workflow for full experience
        result = self.workflow.invoke(
            message=message,
            student_id=student_id,
            subject=subject,
            grade=grade,
        )

        return {
            "response": result.get("response", ""),
            "intent": result.get("intent", ""),
            "has_context": result.get("has_context", False),
            "student_id": student_id,
            "subject": subject,
            "grade": grade,
        }

    def chat_simple(
        self,
        message: str,
        subject: str = "general",
        grade: str = "6th",
    ) -> str:
        """
        Simple chat without memory (backward compatible).

        Args:
            message: Student's message
            subject: Subject context
            grade: Grade level

        Returns:
            Response string
        """
        return self.base_tutor.chat_with_tutor(message, subject, grade)

    # === Quiz Generation (delegates to base) ===

    def generate_quiz(
        self,
        grade_band: str,
        subject: str,
        chapter_id: str,
        chapter_title: str,
        chapter_summary: str,
        num_questions: int = 5,
        difficulty: str = "basic",
    ) -> Dict:
        """Generate quiz using the base tutor."""
        return self.base_tutor.generate_quiz(
            grade_band=grade_band,
            subject=subject,
            chapter_id=chapter_id,
            chapter_title=chapter_title,
            chapter_summary=chapter_summary,
            num_questions=num_questions,
            difficulty=difficulty,
        )

    def generate_all_quizzes(
        self,
        subject: str,
        grade_band: str,
        chapter_id: str,
        chapter_title: str,
        chapter_summary: str,
    ) -> Dict:
        """Generate all difficulty quizzes using the base tutor."""
        return self.base_tutor.generate_all_quizzes(
            subject=subject,
            grade_band=grade_band,
            chapter_id=chapter_id,
            chapter_title=chapter_title,
            chapter_summary=chapter_summary,
        )

    # === RAG Methods ===

    def query_curriculum(
        self,
        question: str,
        subject: str = "general",
        grade: str = "6th",
        student_id: Optional[str] = None,
    ) -> Dict:
        """
        Query the curriculum with enhanced RAG.

        Args:
            question: The question to answer
            subject: Subject filter
            grade: Grade level
            student_id: Optional student ID for history context

        Returns:
            Dict with answer and sources
        """
        if not self.rag_pipeline:
            return {
                "answer": "Curriculum search is not available.",
                "sources": [],
                "error": "No RAG pipeline configured",
            }

        # Get conversation history if student_id provided
        history = ""
        if student_id:
            history = self.memory_manager.get_conversation_history(
                student_id, subject, as_string=True
            )

        return self.rag_pipeline.query(
            question=question,
            subject=subject,
            grade=grade,
            history=history,
        )

    # === Memory Management ===

    def get_conversation_history(
        self,
        student_id: str,
        subject: str,
    ) -> List:
        """Get conversation history for a student."""
        return self.memory_manager.get_conversation_history(student_id, subject)

    def clear_conversation(
        self,
        student_id: str,
        subject: Optional[str] = None,
    ):
        """Clear conversation history."""
        self.memory_manager.clear_memory(student_id, subject)

    def get_memory_stats(self) -> Dict:
        """Get memory manager statistics."""
        return self.memory_manager.get_stats()

    # === Utility Methods ===

    @property
    def retriever(self):
        """Access the base retriever."""
        return self.base_tutor.retriever

    @property
    def is_ready(self) -> bool:
        """Check if the tutor is ready."""
        return self.base_tutor.retriever is not None

    def health_check(self) -> Dict:
        """Return health status."""
        return {
            "status": "ok" if self.is_ready else "degraded",
            "retriever_ready": self.retriever is not None,
            "rag_pipeline_ready": self.rag_pipeline is not None,
            "langgraph_available": LANGGRAPH_AVAILABLE,
            "memory_stats": self.get_memory_stats(),
        }


# === Factory Function ===

def create_enhanced_tutor(base_tutor: Optional[AI_Tutor] = None) -> EnhancedAITutor:
    """Create an enhanced AI tutor instance."""
    return EnhancedAITutor(base_tutor)


# === Global Instance ===
# Lazy initialization to avoid import-time issues
_enhanced_tutor: Optional[EnhancedAITutor] = None


def get_enhanced_tutor() -> EnhancedAITutor:
    """Get or create the global enhanced tutor instance."""
    global _enhanced_tutor
    if _enhanced_tutor is None:
        _enhanced_tutor = create_enhanced_tutor()
    return _enhanced_tutor
