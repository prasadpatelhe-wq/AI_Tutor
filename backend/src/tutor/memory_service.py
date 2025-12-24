"""
Conversation Memory Service for AI Tutor.
Manages per-student conversation history using LangChain memory systems.
"""

import os
import threading
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain.memory import ConversationBufferWindowMemory, ConversationSummaryBufferMemory
from langchain_core.chat_history import BaseChatMessageHistory, InMemoryChatMessageHistory

from .langchain_wrapper import ChatEuriai


class StudentMemoryManager:
    """
    Manages conversation memory for each student session.

    Features:
    - Per-student conversation history
    - Automatic session expiry (configurable TTL)
    - Subject-specific memory contexts
    - Memory summarization for long conversations
    """

    def __init__(
        self,
        max_messages: int = 10,
        session_ttl_minutes: int = 60,
        use_summarization: bool = False,
    ):
        """
        Initialize the memory manager.

        Args:
            max_messages: Maximum messages to keep in window memory
            session_ttl_minutes: Session expiry time in minutes
            use_summarization: Whether to summarize old messages
        """
        self.max_messages = max_messages
        self.session_ttl = timedelta(minutes=session_ttl_minutes)
        self.use_summarization = use_summarization

        # Storage: {student_id: {subject: (memory, last_access)}}
        self._memories: Dict[str, Dict[str, Tuple[BaseChatMessageHistory, datetime]]] = {}
        self._lock = threading.Lock()

        # LLM for summarization (only if enabled)
        self._summarizer_llm = ChatEuriai(task_type="chat", complexity="simple") if use_summarization else None

    def _get_session_key(self, student_id: str, subject: str) -> str:
        """Generate a unique session key."""
        return f"{student_id}:{subject.lower().strip()}"

    def _cleanup_expired_sessions(self):
        """Remove expired sessions."""
        now = datetime.utcnow()
        with self._lock:
            for student_id in list(self._memories.keys()):
                for subject in list(self._memories[student_id].keys()):
                    _, last_access = self._memories[student_id][subject]
                    if now - last_access > self.session_ttl:
                        del self._memories[student_id][subject]
                # Remove student entry if no subjects left
                if not self._memories[student_id]:
                    del self._memories[student_id]

    def get_memory(self, student_id: str, subject: str) -> BaseChatMessageHistory:
        """
        Get or create memory for a student-subject session.

        Args:
            student_id: The student's ID
            subject: The subject being studied

        Returns:
            Chat message history for the session
        """
        self._cleanup_expired_sessions()

        with self._lock:
            if student_id not in self._memories:
                self._memories[student_id] = {}

            subject_key = subject.lower().strip()
            now = datetime.utcnow()

            if subject_key not in self._memories[student_id]:
                # Create new memory
                memory = InMemoryChatMessageHistory()
                self._memories[student_id][subject_key] = (memory, now)
            else:
                # Update last access time
                memory, _ = self._memories[student_id][subject_key]
                self._memories[student_id][subject_key] = (memory, now)

            return self._memories[student_id][subject_key][0]

    def add_message(
        self,
        student_id: str,
        subject: str,
        message: str,
        is_human: bool = True,
    ):
        """
        Add a message to the student's conversation history.

        Args:
            student_id: The student's ID
            subject: The subject context
            message: The message content
            is_human: True if from student, False if from AI
        """
        memory = self.get_memory(student_id, subject)

        if is_human:
            memory.add_user_message(message)
        else:
            memory.add_ai_message(message)

        # Trim if exceeds max messages
        self._trim_memory(memory)

    def _trim_memory(self, memory: BaseChatMessageHistory):
        """Trim memory to max_messages, optionally summarizing."""
        messages = memory.messages

        if len(messages) <= self.max_messages * 2:  # Keep pairs
            return

        if self.use_summarization and self._summarizer_llm:
            # Summarize older messages
            messages_to_summarize = messages[:-self.max_messages]
            summary = self._summarize_messages(messages_to_summarize)

            # Clear and add summary + recent messages
            memory.clear()
            memory.add_message(SystemMessage(content=f"Previous conversation summary: {summary}"))
            for msg in messages[-self.max_messages:]:
                memory.add_message(msg)
        else:
            # Simple windowing - keep only recent messages
            recent = messages[-self.max_messages * 2:]
            memory.clear()
            for msg in recent:
                memory.add_message(msg)

    def _summarize_messages(self, messages: List[BaseMessage]) -> str:
        """Summarize a list of messages."""
        if not messages:
            return ""

        conversation_text = "\n".join([
            f"{'Student' if isinstance(m, HumanMessage) else 'Tutor'}: {m.content}"
            for m in messages
        ])

        summary_prompt = f"""Summarize this tutoring conversation briefly, focusing on:
- Topics discussed
- Key questions asked
- Important concepts explained

Conversation:
{conversation_text}

Summary:"""

        try:
            result = self._summarizer_llm.invoke([HumanMessage(content=summary_prompt)])
            return result.content
        except Exception:
            return "Previous topics discussed."

    def get_conversation_history(
        self,
        student_id: str,
        subject: str,
        as_string: bool = False,
    ) -> List[BaseMessage] | str:
        """
        Get conversation history for a student-subject session.

        Args:
            student_id: The student's ID
            subject: The subject context
            as_string: If True, return formatted string

        Returns:
            List of messages or formatted string
        """
        memory = self.get_memory(student_id, subject)
        messages = memory.messages

        if as_string:
            lines = []
            for msg in messages:
                role = "Student" if isinstance(msg, HumanMessage) else "Tutor"
                if isinstance(msg, SystemMessage):
                    role = "Context"
                lines.append(f"{role}: {msg.content}")
            return "\n".join(lines)

        return messages

    def clear_memory(self, student_id: str, subject: Optional[str] = None):
        """
        Clear memory for a student.

        Args:
            student_id: The student's ID
            subject: If provided, only clear for this subject
        """
        with self._lock:
            if student_id not in self._memories:
                return

            if subject:
                subject_key = subject.lower().strip()
                if subject_key in self._memories[student_id]:
                    del self._memories[student_id][subject_key]
            else:
                del self._memories[student_id]

    def get_context_messages(
        self,
        student_id: str,
        subject: str,
        include_system: bool = True,
    ) -> List[BaseMessage]:
        """
        Get messages formatted for LLM context.

        Args:
            student_id: The student's ID
            subject: The subject context
            include_system: Whether to include system messages

        Returns:
            List of messages ready for LLM input
        """
        messages = self.get_conversation_history(student_id, subject)

        if not include_system:
            messages = [m for m in messages if not isinstance(m, SystemMessage)]

        return messages

    def get_stats(self) -> Dict:
        """Get memory manager statistics."""
        with self._lock:
            total_sessions = sum(len(subjects) for subjects in self._memories.values())
            total_students = len(self._memories)

            return {
                "total_students": total_students,
                "total_sessions": total_sessions,
                "max_messages_per_session": self.max_messages,
                "session_ttl_minutes": self.session_ttl.total_seconds() / 60,
                "use_summarization": self.use_summarization,
            }


# Global instance with sensible defaults
memory_manager = StudentMemoryManager(
    max_messages=10,
    session_ttl_minutes=60,
    use_summarization=False,  # Enable if you want auto-summarization
)
