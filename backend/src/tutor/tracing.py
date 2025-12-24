"""
LangSmith Tracing Support for AI Tutor.
Provides observability and debugging capabilities.
"""

import os
import logging
from functools import wraps
from typing import Any, Callable, Dict, Optional

logger = logging.getLogger(__name__)

# Check if LangSmith is available and configured
LANGSMITH_AVAILABLE = False
LANGSMITH_ENABLED = False

try:
    from langsmith import Client, traceable
    from langsmith.run_helpers import get_current_run_tree

    # Check if API key is configured
    if os.environ.get("LANGCHAIN_API_KEY") or os.environ.get("LANGSMITH_API_KEY"):
        LANGSMITH_AVAILABLE = True
        LANGSMITH_ENABLED = os.environ.get("LANGCHAIN_TRACING_V2", "").lower() == "true"
        logger.info(f"LangSmith available: {LANGSMITH_AVAILABLE}, enabled: {LANGSMITH_ENABLED}")
except ImportError:
    logger.info("LangSmith not installed - tracing disabled")

    # Fallback decorator that does nothing
    def traceable(*args, **kwargs):
        def decorator(func):
            return func
        return decorator if not args or callable(args[0]) else decorator


def configure_tracing(
    project_name: str = "ai-tutor",
    enable: bool = True,
) -> bool:
    """
    Configure LangSmith tracing.

    Args:
        project_name: LangSmith project name
        enable: Whether to enable tracing

    Returns:
        True if tracing is enabled
    """
    global LANGSMITH_ENABLED

    if not LANGSMITH_AVAILABLE:
        logger.warning("LangSmith not available - install with: pip install langsmith")
        return False

    if enable:
        os.environ["LANGCHAIN_TRACING_V2"] = "true"
        os.environ["LANGCHAIN_PROJECT"] = project_name
        LANGSMITH_ENABLED = True
        logger.info(f"LangSmith tracing enabled for project: {project_name}")
    else:
        os.environ["LANGCHAIN_TRACING_V2"] = "false"
        LANGSMITH_ENABLED = False
        logger.info("LangSmith tracing disabled")

    return LANGSMITH_ENABLED


def trace_tutor_interaction(
    name: str = "tutor_interaction",
    run_type: str = "chain",
    metadata: Optional[Dict] = None,
):
    """
    Decorator to trace tutor interactions.

    Args:
        name: Name for the trace
        run_type: Type of run (chain, llm, tool, etc.)
        metadata: Additional metadata to include

    Usage:
        @trace_tutor_interaction(name="chat", metadata={"subject": "math"})
        def chat_with_student(message: str) -> str:
            ...
    """
    def decorator(func: Callable) -> Callable:
        if not LANGSMITH_AVAILABLE:
            return func

        @wraps(func)
        def wrapper(*args, **kwargs):
            # Add runtime metadata
            run_metadata = metadata.copy() if metadata else {}

            # Extract common parameters if present
            if "student_id" in kwargs:
                run_metadata["student_id"] = kwargs["student_id"]
            if "subject" in kwargs:
                run_metadata["subject"] = kwargs["subject"]
            if "grade" in kwargs:
                run_metadata["grade"] = kwargs["grade"]

            # Use LangSmith traceable
            traced_func = traceable(
                name=name,
                run_type=run_type,
                metadata=run_metadata,
            )(func)

            return traced_func(*args, **kwargs)

        return wrapper

    return decorator


def get_tracing_status() -> Dict:
    """Get current tracing status."""
    return {
        "langsmith_available": LANGSMITH_AVAILABLE,
        "tracing_enabled": LANGSMITH_ENABLED,
        "project": os.environ.get("LANGCHAIN_PROJECT", "default"),
        "api_key_configured": bool(
            os.environ.get("LANGCHAIN_API_KEY") or os.environ.get("LANGSMITH_API_KEY")
        ),
    }


class TracingContext:
    """
    Context manager for tracing blocks of code.

    Usage:
        with TracingContext("quiz_generation", metadata={"subject": "math"}):
            result = generate_quiz(...)
    """

    def __init__(
        self,
        name: str,
        run_type: str = "chain",
        metadata: Optional[Dict] = None,
    ):
        self.name = name
        self.run_type = run_type
        self.metadata = metadata or {}
        self._run = None

    def __enter__(self):
        if LANGSMITH_AVAILABLE and LANGSMITH_ENABLED:
            try:
                from langsmith.run_helpers import trace

                self._run = trace(
                    name=self.name,
                    run_type=self.run_type,
                    metadata=self.metadata,
                )
                self._run.__enter__()
            except Exception as e:
                logger.warning(f"Failed to start trace: {e}")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self._run:
            try:
                self._run.__exit__(exc_type, exc_val, exc_tb)
            except Exception as e:
                logger.warning(f"Failed to end trace: {e}")
        return False

    def log(self, key: str, value: Any):
        """Log additional data to the current trace."""
        if self._run:
            try:
                # Add to metadata
                self.metadata[key] = value
            except Exception:
                pass


# Export commonly used decorators
__all__ = [
    "traceable",
    "trace_tutor_interaction",
    "configure_tracing",
    "get_tracing_status",
    "TracingContext",
    "LANGSMITH_AVAILABLE",
    "LANGSMITH_ENABLED",
]
