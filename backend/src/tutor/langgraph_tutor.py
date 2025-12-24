"""
LangGraph-based Tutoring Workflow for AI Tutor.
Provides stateful, multi-step tutoring interactions with intelligent routing.
"""

import os
from typing import Annotated, Dict, List, Literal, Optional, TypedDict

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage

# Conditional import for LangGraph (graceful fallback if not installed)
try:
    from langgraph.graph import StateGraph, START, END
    from langgraph.graph.message import add_messages
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False
    # Fallback types
    def add_messages(left, right):
        return left + right

from .langchain_wrapper import ChatEuriai
from .memory_service import memory_manager
from .rag_pipeline import EnhancedRAGPipeline


# === State Definition ===

class TutorState(TypedDict):
    """State for the tutoring workflow."""
    messages: Annotated[List[BaseMessage], add_messages]
    student_id: str
    subject: str
    grade: str
    context: str  # Retrieved curriculum context
    intent: str   # Detected intent: question, help, quiz, explain, etc.
    response: str
    metadata: Dict


# === Intent Detection ===

INTENT_PROMPTS = {
    "detect": """Analyze the student's message and determine their intent.
Possible intents:
- question: Asking about a concept or topic
- help: Requesting help with homework or a problem
- explain: Wants explanation of something
- quiz: Wants to take a quiz or practice
- greeting: Just saying hello
- clarify: Asking for clarification on previous response
- other: Anything else

Student message: {message}
Subject context: {subject}

Respond with ONLY the intent word (e.g., "question"):"""
}


class TutoringWorkflow:
    """
    LangGraph-based tutoring workflow with:
    - Intent detection
    - Subject-specific routing
    - RAG-enhanced responses
    - Conversation memory
    """

    def __init__(self, rag_pipeline: Optional[EnhancedRAGPipeline] = None):
        """
        Initialize the tutoring workflow.

        Args:
            rag_pipeline: Optional RAG pipeline for context retrieval
        """
        self.rag_pipeline = rag_pipeline
        self.llm = ChatEuriai(task_type="chat", complexity="medium")

        if LANGGRAPH_AVAILABLE:
            self.graph = self._build_graph()
        else:
            self.graph = None

    def _build_graph(self) -> StateGraph:
        """Build the LangGraph state machine."""
        builder = StateGraph(TutorState)

        # Add nodes
        builder.add_node("detect_intent", self._detect_intent)
        builder.add_node("retrieve_context", self._retrieve_context)
        builder.add_node("generate_response", self._generate_response)
        builder.add_node("handle_greeting", self._handle_greeting)
        builder.add_node("handle_quiz_request", self._handle_quiz_request)

        # Add edges
        builder.add_edge(START, "detect_intent")
        builder.add_conditional_edges(
            "detect_intent",
            self._route_by_intent,
            {
                "greeting": "handle_greeting",
                "quiz": "handle_quiz_request",
                "default": "retrieve_context",
            }
        )
        builder.add_edge("retrieve_context", "generate_response")
        builder.add_edge("generate_response", END)
        builder.add_edge("handle_greeting", END)
        builder.add_edge("handle_quiz_request", END)

        return builder.compile()

    def _detect_intent(self, state: TutorState) -> Dict:
        """Detect the intent of the student's message."""
        messages = state.get("messages", [])
        if not messages:
            return {"intent": "other"}

        last_message = messages[-1].content if messages else ""

        prompt = INTENT_PROMPTS["detect"].format(
            message=last_message,
            subject=state.get("subject", "general")
        )

        try:
            response = self.llm.invoke([HumanMessage(content=prompt)])
            intent = response.content.strip().lower()

            # Validate intent
            valid_intents = ["question", "help", "explain", "quiz", "greeting", "clarify", "other"]
            if intent not in valid_intents:
                intent = "question"  # Default to question

            return {"intent": intent}
        except Exception:
            return {"intent": "question"}

    def _route_by_intent(self, state: TutorState) -> str:
        """Route to appropriate handler based on intent."""
        intent = state.get("intent", "question")

        if intent == "greeting":
            return "greeting"
        elif intent == "quiz":
            return "quiz"
        else:
            return "default"

    def _retrieve_context(self, state: TutorState) -> Dict:
        """Retrieve relevant context from RAG pipeline."""
        if not self.rag_pipeline:
            return {"context": ""}

        messages = state.get("messages", [])
        last_message = messages[-1].content if messages else ""

        try:
            docs = self.rag_pipeline.retrieve(
                question=last_message,
                subject=state.get("subject", "general"),
                grade=state.get("grade", "6th"),
                k=3,
            )
            context = self.rag_pipeline.get_context_string(docs)
            return {"context": context}
        except Exception:
            return {"context": ""}

    def _generate_response(self, state: TutorState) -> Dict:
        """Generate a tutoring response."""
        messages = state.get("messages", [])
        subject = state.get("subject", "general")
        grade = state.get("grade", "6th")
        context = state.get("context", "")
        intent = state.get("intent", "question")

        # Get conversation history
        student_id = state.get("student_id", "anonymous")
        history = memory_manager.get_conversation_history(student_id, subject, as_string=True)

        # Build the response prompt based on intent
        intent_instructions = {
            "question": "Answer the student's question clearly and thoroughly.",
            "help": "Help the student solve their problem step by step.",
            "explain": "Provide a clear, detailed explanation suitable for their grade level.",
            "clarify": "Clarify your previous response based on their follow-up.",
            "other": "Respond helpfully to the student's message.",
        }

        instruction = intent_instructions.get(intent, intent_instructions["other"])

        system_prompt = f"""You are an expert {subject} tutor for grade {grade} students.
{instruction}

Curriculum Context:
{context if context else "No specific curriculum context available."}

Previous Conversation:
{history if history else "This is the start of the conversation."}

Guidelines:
- Be encouraging and patient
- Use age-appropriate language for grade {grade}
- Include examples when helpful
- If you don't know something, say so honestly"""

        # Create message list for LLM
        llm_messages = [SystemMessage(content=system_prompt)]
        llm_messages.extend(messages)

        try:
            # Use subject-appropriate LLM
            task_type = self._get_task_type(subject)
            llm = ChatEuriai(
                task_type=task_type,
                complexity="medium",
                subject=subject,
                grade=grade,
            )
            response = llm.invoke(llm_messages)

            # Store in memory
            if messages:
                memory_manager.add_message(student_id, subject, messages[-1].content, is_human=True)
            memory_manager.add_message(student_id, subject, response.content, is_human=False)

            return {
                "response": response.content,
                "messages": [AIMessage(content=response.content)],
            }
        except Exception as e:
            error_msg = f"I'm having trouble generating a response. Please try again!"
            return {
                "response": error_msg,
                "messages": [AIMessage(content=error_msg)],
            }

    def _handle_greeting(self, state: TutorState) -> Dict:
        """Handle greeting messages."""
        subject = state.get("subject", "general")
        grade = state.get("grade", "6th")

        # Grade-appropriate greetings
        if grade in ["1st", "2nd", "3rd", "4th", "1", "2", "3", "4"]:
            greeting = f"Hi there! I'm your {subject} buddy! What would you like to learn today?"
        elif grade in ["5th", "6th", "7th", "5", "6", "7"]:
            greeting = f"Hey! I'm your {subject} tutor. What can I help you with today?"
        else:
            greeting = f"Hello! I'm here to help you with {subject}. What would you like to work on?"

        return {
            "response": greeting,
            "messages": [AIMessage(content=greeting)],
        }

    def _handle_quiz_request(self, state: TutorState) -> Dict:
        """Handle quiz requests (redirect to quiz generation)."""
        response = "I'd love to quiz you! Please use the Quiz section in the app to take a quiz on this topic. That way I can track your progress and award you coins!"

        return {
            "response": response,
            "messages": [AIMessage(content=response)],
        }

    def _get_task_type(self, subject: str) -> str:
        """Map subject to task type."""
        subject_lower = subject.lower()
        if "math" in subject_lower:
            return "math"
        elif "science" in subject_lower or "evs" in subject_lower:
            return "science"
        elif "social" in subject_lower or "history" in subject_lower:
            return "creative"
        else:
            return "chat"

    def invoke(
        self,
        message: str,
        student_id: str,
        subject: str = "general",
        grade: str = "6th",
    ) -> Dict:
        """
        Process a tutoring request.

        Args:
            message: The student's message
            student_id: Student identifier for memory
            subject: Subject context
            grade: Grade level

        Returns:
            Dict with response and metadata
        """
        initial_state = {
            "messages": [HumanMessage(content=message)],
            "student_id": student_id,
            "subject": subject,
            "grade": grade,
            "context": "",
            "intent": "",
            "response": "",
            "metadata": {},
        }

        if LANGGRAPH_AVAILABLE and self.graph:
            # Use LangGraph workflow
            result = self.graph.invoke(initial_state)
            return {
                "response": result.get("response", ""),
                "intent": result.get("intent", ""),
                "has_context": bool(result.get("context")),
            }
        else:
            # Fallback: Simple direct response
            return self._fallback_invoke(initial_state)

    def _fallback_invoke(self, state: Dict) -> Dict:
        """Fallback when LangGraph is not available."""
        # Simple flow: detect intent -> retrieve -> respond
        state = self._detect_intent(state)
        state = self._retrieve_context(state)
        state = self._generate_response(state)

        return {
            "response": state.get("response", ""),
            "intent": state.get("intent", ""),
            "has_context": bool(state.get("context")),
        }


# Factory function
def create_tutoring_workflow(rag_pipeline: Optional[EnhancedRAGPipeline] = None) -> TutoringWorkflow:
    """Create a tutoring workflow instance."""
    return TutoringWorkflow(rag_pipeline)
