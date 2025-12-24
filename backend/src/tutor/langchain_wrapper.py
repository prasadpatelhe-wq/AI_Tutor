"""
LangChain-compatible wrapper for EuriaiModelFramework.
Enables using existing Euriai infrastructure with LangChain's ecosystem.
"""

import os
from typing import Any, Dict, Iterator, List, Optional

from langchain_core.callbacks import CallbackManagerForLLMRun
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
)
from langchain_core.outputs import ChatGeneration, ChatResult

from .framework import euriai_framework, EuriaiModelFramework


class ChatEuriai(BaseChatModel):
    """
    LangChain-compatible chat model wrapper for EuriaiModelFramework.

    This wrapper allows using the existing Euriai infrastructure with
    LangChain's memory, chains, and agent systems.

    Example:
        llm = ChatEuriai(task_type="math", complexity="medium")
        response = llm.invoke([HumanMessage(content="What is 2+2?")])
    """

    # Model configuration
    task_type: str = "chat"
    complexity: str = "medium"
    subject: str = "general"
    grade: str = "6th"
    temperature: float = 0.7
    max_tokens: int = 4096

    # Internal framework reference
    _framework: Optional[EuriaiModelFramework] = None

    class Config:
        arbitrary_types_allowed = True

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._framework = euriai_framework

    @property
    def _llm_type(self) -> str:
        """Return identifier for this LLM type."""
        return "euriai"

    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Return parameters that identify this model configuration."""
        return {
            "task_type": self.task_type,
            "complexity": self.complexity,
            "subject": self.subject,
            "grade": self.grade,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
        }

    def _convert_messages_to_prompt(self, messages: List[BaseMessage]) -> str:
        """Convert LangChain messages to a single prompt string."""
        prompt_parts = []

        for message in messages:
            if isinstance(message, SystemMessage):
                prompt_parts.append(f"System: {message.content}")
            elif isinstance(message, HumanMessage):
                prompt_parts.append(f"User: {message.content}")
            elif isinstance(message, AIMessage):
                prompt_parts.append(f"Assistant: {message.content}")
            else:
                prompt_parts.append(str(message.content))

        return "\n\n".join(prompt_parts)

    def _generate(
        self,
        messages: List[BaseMessage],
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> ChatResult:
        """Generate a response from the Euriai framework."""

        # Override params from kwargs if provided
        task_type = kwargs.get("task_type", self.task_type)
        complexity = kwargs.get("complexity", self.complexity)
        subject = kwargs.get("subject", self.subject)
        grade = kwargs.get("grade", self.grade)
        temperature = kwargs.get("temperature", self.temperature)
        max_tokens = kwargs.get("max_tokens", self.max_tokens)

        # Convert messages to prompt
        prompt = self._convert_messages_to_prompt(messages)

        # Call the Euriai framework
        result = self._framework.generate_response(
            prompt=prompt,
            task_type=task_type,
            complexity=complexity,
            subject=subject,
            grade=grade,
            temperature=temperature,
            max_tokens=max_tokens,
        )

        # Create ChatResult
        response_text = result.get("response", "")
        model_used = result.get("model_used", "unknown")

        generation = ChatGeneration(
            message=AIMessage(content=response_text),
            generation_info={
                "model_used": model_used,
                "response_time": result.get("response_time", 0),
                "success": result.get("success", False),
            },
        )

        return ChatResult(generations=[generation])

    def with_config(
        self,
        task_type: Optional[str] = None,
        complexity: Optional[str] = None,
        subject: Optional[str] = None,
        grade: Optional[str] = None,
    ) -> "ChatEuriai":
        """Return a new instance with updated configuration."""
        return ChatEuriai(
            task_type=task_type or self.task_type,
            complexity=complexity or self.complexity,
            subject=subject or self.subject,
            grade=grade or self.grade,
            temperature=self.temperature,
            max_tokens=self.max_tokens,
        )


# Pre-configured instances for common use cases
chat_euriai = ChatEuriai(task_type="chat", complexity="medium")
math_euriai = ChatEuriai(task_type="math", complexity="medium", subject="math")
science_euriai = ChatEuriai(task_type="science", complexity="medium", subject="science")
reasoning_euriai = ChatEuriai(task_type="reasoning", complexity="complex")
