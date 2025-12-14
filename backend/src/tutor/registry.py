
"""
Optimized Multi-Agent Configuration for Subject-Specific AI Tutors
Uses intelligent model selection from available EuriAI models.
"""

from typing import Dict
import re
from .framework import euriai_framework

# Optimized Agent Configurations with Available EuriAI Models
AGENT_CONFIGS = {
    "science_tutor": {
        "role": "Science Education Specialist",
        "goal": "Help students understand scientific concepts through clear explanations and real-world examples.",
        "task_type": "science",
    },
    "math_tutor": {
        "role": "Mathematics Learning Specialist",
        "goal": "Make mathematics intuitive and enjoyable through step-by-step problem solving.",
        "task_type": "math",
    },
    "social_tutor": {
        "role": "Social Studies & History Expert",
        "goal": "Bring history and social concepts to life through engaging storytelling and connections.",
        "task_type": "creative",
    },
    "english_tutor": {
        "role": "Language Arts & Communication Coach",
        "goal": "Develop students' reading, writing, and communication skills with creativity and precision.",
        "task_type": "creative",
    },
    "learning_coordinator": {
        "role": "Educational Coordinator & Learning Strategist",
        "goal": "Coordinate between subject experts and create comprehensive learning experiences.",
        "task_type": "reasoning",
    },
}

class SubjectExpert:
    """A streamlined agent that uses the EuriaiModelFramework for all AI interactions."""

    def __init__(self, agent_type: str, retriever=None):
        if agent_type not in AGENT_CONFIGS:
            raise ValueError(f"Unknown agent type: {agent_type}")

        self.config = AGENT_CONFIGS[agent_type]
        self.retriever = retriever

    def get_context(self, query: str, subject: str = None) -> str:
        """Gets relevant context from the retriever, if available."""
        if not self.retriever:
            return ""

        try:
            docs = self.retriever.invoke(query)
            if subject:
                def subject_key(value: str) -> str:
                    s = (value or "").strip().lower()
                    s = re.sub(r"\(.*?\)", "", s)
                    s = s.replace("&", "and")
                    s = re.sub(r"[^a-z0-9]+", " ", s)
                    return re.sub(r"\s+", " ", s).strip()

                requested = subject_key(subject)
                filtered = []
                for doc in docs:
                    doc_subject = subject_key(doc.metadata.get('subject', ''))
                    if not doc_subject:
                        continue
                    if doc_subject == requested or (requested and (requested in doc_subject or doc_subject in requested)):
                        filtered.append(doc)

                # If nothing matches, fall back to unfiltered docs (better than empty context)
                if filtered:
                    docs = filtered

            return "\n".join([doc.page_content for doc in docs[:3]])
        except Exception:
            return "" # Return empty string on error

    def process_request(self, user_input: str, context_query: str = None, subject: str = None, grade: str = "6th", complexity: str = "medium") -> str:
        """Processes a request using the Euriai framework with appropriate context and prompting."""

        context = self.get_context(context_query or user_input, subject) if self.retriever else ""

        # Construct a detailed prompt that guides the AI
        enhanced_prompt = f"""
        **Role:** {self.config['role']}
        **Goal:** {self.config['goal']}
        **Task:** Respond to the student's request below.
        
        **Syllabus Context (if relevant):**
        {context}
        
        **Student's Request:**
        {user_input}
        """

        result = euriai_framework.generate_response(
            prompt=enhanced_prompt,
            task_type=self.config.get("task_type", "chat"),
            complexity=complexity,
            subject=subject or self.config.get("task_type"),
            grade=grade
        )

        return result["response"]

def create_agent(agent_type: str, retriever=None) -> SubjectExpert:
    """Factory function to create subject expert agents."""
    return SubjectExpert(agent_type, retriever)
