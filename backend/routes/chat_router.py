"""
Enhanced Chat API Routes with LangChain Integration.
Provides stateful, memory-enabled chat endpoints.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])


# === Request/Response Models ===

class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    message: str = Field(..., description="The student's message")
    student_id: str = Field(..., description="Student identifier")
    subject: str = Field(default="general", description="Subject context")
    grade: str = Field(default="6th", description="Grade level")
    use_memory: bool = Field(default=True, description="Whether to use conversation memory")
    use_rag: bool = Field(default=True, description="Whether to use RAG for context")


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    response: str
    intent: str
    has_context: bool
    student_id: str
    subject: str
    grade: str


class CurriculumQueryRequest(BaseModel):
    """Request model for curriculum query."""
    question: str = Field(..., description="Question about the curriculum")
    subject: str = Field(default="general", description="Subject filter")
    grade: str = Field(default="6th", description="Grade level")
    student_id: Optional[str] = Field(default=None, description="Optional student ID for context")


class CurriculumQueryResponse(BaseModel):
    """Response model for curriculum query."""
    answer: str
    sources: List[Dict]
    num_sources: int
    subject: str
    grade: str


class ConversationHistoryResponse(BaseModel):
    """Response model for conversation history."""
    messages: List[Dict]
    student_id: str
    subject: str


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    retriever_ready: bool
    rag_pipeline_ready: bool
    langgraph_available: bool
    memory_stats: Dict


# === Dependency ===

def get_enhanced_tutor():
    """Lazy load the enhanced tutor to avoid circular imports."""
    try:
        from src.tutor.enhanced_interface import get_enhanced_tutor
        return get_enhanced_tutor()
    except Exception as e:
        logger.error(f"Failed to load enhanced tutor: {e}")
        raise HTTPException(status_code=503, detail="Enhanced tutor not available")


# === Routes ===

@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, tutor=Depends(get_enhanced_tutor)):
    """
    Enhanced chat endpoint with memory and RAG support.

    Features:
    - Conversation memory per student/subject
    - RAG-enhanced responses using curriculum
    - Intent detection for appropriate handling
    """
    try:
        result = tutor.chat(
            message=request.message,
            student_id=request.student_id,
            subject=request.subject,
            grade=request.grade,
            use_memory=request.use_memory,
            use_rag=request.use_rag,
        )
        return ChatResponse(**result)
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simple")
async def chat_simple(
    message: str,
    subject: str = "general",
    grade: str = "6th",
    tutor=Depends(get_enhanced_tutor),
):
    """
    Simple chat endpoint without memory (backward compatible).
    """
    try:
        response = tutor.chat_simple(message, subject, grade)
        return {"response": response}
    except Exception as e:
        logger.error(f"Simple chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/query-curriculum", response_model=CurriculumQueryResponse)
async def query_curriculum(
    request: CurriculumQueryRequest,
    tutor=Depends(get_enhanced_tutor),
):
    """
    Query the curriculum with enhanced RAG.

    Returns answers with source citations from the curriculum.
    """
    try:
        result = tutor.query_curriculum(
            question=request.question,
            subject=request.subject,
            grade=request.grade,
            student_id=request.student_id,
        )

        if "error" in result:
            raise HTTPException(status_code=503, detail=result["error"])

        return CurriculumQueryResponse(
            answer=result.get("answer", ""),
            sources=result.get("sources", []),
            num_sources=result.get("num_sources", 0),
            subject=result.get("subject", request.subject),
            grade=result.get("grade", request.grade),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Curriculum query error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{student_id}/{subject}")
async def get_conversation_history(
    student_id: str,
    subject: str,
    tutor=Depends(get_enhanced_tutor),
):
    """
    Get conversation history for a student/subject session.
    """
    try:
        messages = tutor.get_conversation_history(student_id, subject)

        # Convert to serializable format
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                "role": msg.__class__.__name__.replace("Message", "").lower(),
                "content": msg.content,
            })

        return ConversationHistoryResponse(
            messages=formatted_messages,
            student_id=student_id,
            subject=subject,
        )
    except Exception as e:
        logger.error(f"History retrieval error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/history/{student_id}")
async def clear_conversation_history(
    student_id: str,
    subject: Optional[str] = None,
    tutor=Depends(get_enhanced_tutor),
):
    """
    Clear conversation history for a student.

    If subject is provided, only clears that subject's history.
    """
    try:
        tutor.clear_conversation(student_id, subject)
        return {
            "status": "cleared",
            "student_id": student_id,
            "subject": subject or "all",
        }
    except Exception as e:
        logger.error(f"History clear error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=HealthResponse)
async def chat_health(tutor=Depends(get_enhanced_tutor)):
    """
    Health check for the enhanced chat system.
    """
    try:
        health = tutor.health_check()
        return HealthResponse(**health)
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return HealthResponse(
            status="error",
            retriever_ready=False,
            rag_pipeline_ready=False,
            langgraph_available=False,
            memory_stats={},
        )


@router.get("/memory-stats")
async def get_memory_stats(tutor=Depends(get_enhanced_tutor)):
    """
    Get memory manager statistics.
    """
    try:
        return tutor.get_memory_stats()
    except Exception as e:
        logger.error(f"Memory stats error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
