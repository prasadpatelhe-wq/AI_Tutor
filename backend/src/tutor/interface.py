"""
Unified Interface for the AI Tutor System
Enhanced for grade-wise question type control.
"""

import os
import json
import logging
import uuid
import re
from dotenv import load_dotenv
from typing import Dict, List, Optional
from langchain_community.vectorstores import FAISS
from .framework import euriai_framework
from .registry import create_agent, AGENT_CONFIGS
from src.utils.euriai_embeddings import EuriaiEmbeddings

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_ENV_PATH = os.path.join(CURRENT_DIR, "..", "..", "..", ".env")

if os.path.exists(ROOT_ENV_PATH):
    load_dotenv(ROOT_ENV_PATH)
else:
    load_dotenv()  # fallback (in case .env is in working directory)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AI_Tutor:
    """Main interface for AI Tutor with grade-wise quiz type control."""

    def __init__(self, vector_store_path=None):
        print("🚀 Initializing AI Tutor Interface...")

        # Dynamically locate project root
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
        if vector_store_path is None:
            vector_store_path = os.path.join(project_root, "backend", "data", "vector_store", "faiss_index")


        self.api_key = os.environ.get("EURIAI_API_KEY")
        self.retriever = None
        self.model_framework = euriai_framework
        self.agents = {}

        print(f"🔑 EuriAI API Key found: {'✅ Yes' if self.api_key else '❌ No'}")
        print(f"📂 Checking FAISS path: {vector_store_path}")
        print(f"📂 FAISS Path exists: {'✅ Yes' if os.path.exists(vector_store_path) else '❌ No'}")

        # Load retriever if available
        if self.api_key and os.path.exists(vector_store_path):
            try:
                print("🧠 Attempting to load FAISS index...")
                embeddings = EuriaiEmbeddings(model="gemini-embedding-001")
                vector_store = FAISS.load_local(
                    vector_store_path,
                    embeddings,
                    allow_dangerous_deserialization=True
                )
                self.retriever = vector_store.as_retriever(search_kwargs={"k": 5})
                print("✅ FAISS retriever loaded successfully!")
            except Exception as e:
                print(f"❌ Error loading FAISS retriever: {e}")
        else:
            print("⚠️ Skipping FAISS load: Missing API key or invalid path.")

        # Initialize subject agents
        for agent_type in AGENT_CONFIGS.keys():
            self.agents[agent_type] = create_agent(agent_type, self.retriever)

        print("🎯 AI Tutor initialization complete.\n")

    # ----------------------------------------------------------
    # Agent selection
    # ----------------------------------------------------------
    def _get_agent_for_subject(self, subject: str) -> Optional[object]:
        subject_map = {
            "science": "science_tutor",
            "math": "math_tutor",
            "social studies": "social_tutor",
            "english": "english_tutor",
        }
        agent_key = subject_map.get(subject.lower(), "learning_coordinator")
        return self.agents.get(agent_key)

    # ----------------------------------------------------------
    # Grade-wise quiz configuration
    # ----------------------------------------------------------
    def _get_allowed_question_types(self, grade_band: str) -> List[str]:
        """Return allowed question types based on grade band."""
        if grade_band in ["1-2", "1-4"]:
            return ["mcq", "matching", "select_image", "spell_word", "pronunciation"]
        elif grade_band in ["5-7"]:
            return ["mcq", "true_false"]
        elif grade_band in ["8-10"]:
            return ["fill_in_the_blank", "short_answer"]
        else:
            # Default fallback
            return ["mcq", "true_false", "fill_in_the_blank"]

    # ----------------------------------------------------------
    # Quiz generation
    # ----------------------------------------------------------
    # ----------------------------------------------------------
    # Quiz generation
    # ----------------------------------------------------------
    def generate_quiz(
            self,
            grade_band: str,
            subject: str,
            chapter_id: str,
            chapter_title: str,
            chapter_summary: str,
            num_questions: int = 5,
            difficulty: str = "basic"
    ) -> Dict:
        """Generates quiz dynamically with grade-wise logic, difficulty variation, and pronunciation support."""

        allowed_types = self._get_allowed_question_types(grade_band)

        # Difficulty-based tone and depth
        if difficulty == "basic":
            tone = (
                "Use very simple words and direct questions. Focus on recognition, "
                "basic facts, and one-step thinking."
            )
        elif difficulty == "medium":
            tone = (
                "Ask questions that need short reasoning or 2-step thinking. "
                "Include small word problems or comparisons."
            )
        elif difficulty == "hard":
            tone = (
                "Ask higher-order thinking questions requiring analysis, application, "
                "or inference. Avoid repetition of basic questions."
            )
        else:
            tone = "Keep questions age-appropriate."

        # Special instructions for younger grades
        if grade_band in ["1-2", "1-4"]:
            tone += (
                " Use pictures, emojis, and simple sentences. "
                "If the question type is 'pronunciation', include a fun phonetic hint "
                "and a sample audio link (use a placeholder URL like 'https://example.com/audio/word.mp3'). "
                "Keep everything friendly and child-focused 🎵."
            )

        # Main generation prompt
        prompt = f"""
        You are an expert {subject} teacher.
        Generate exactly {num_questions} quiz questions for grade band {grade_band}.
        Chapter: "{chapter_title}"
        Summary: {chapter_summary}
        Difficulty: {difficulty.upper()}
        Allowed question types: {', '.join(allowed_types)}.
        {tone}

        ✅ IMPORTANT INSTRUCTIONS:
        - Every question MUST be a JSON object in a list.
        - Include fields: id, type, question_text, options (list), correct_option_index (integer), explanation, difficulty, interactive_element.
        - Even for fill-in-the-blank or short-answer, provide at least 4 options (one correct and a few distractors).
        - Example:
          {{
            "id": "Q1",
            "type": "fill_in_the_blank",
            "question_text": "5 + 3 = ___",
            "options": ["8", "6", "9","7"],
            "correct_option_index": 0,
            "explanation": "Adding 5 and 3 equals 8.",
            "difficulty": "BASIC",
            "interactive_element": "dropdown"
          }}
        - Avoid any fallback or example questions. Base questions strictly on the chapter summary.

        For pronunciation-type questions, always include:
        - phonetic_hint (e.g., "kuh-AHT" for "cat")
        - audio_url (e.g., "https://example.com/audio/cat.mp3")
        """

        response_data = self.model_framework.generate_response(
            prompt=prompt,
            task_type="quiz",
            complexity=difficulty,
            subject=subject,
            grade=grade_band
        )

        questions = self._try_parse_json(response_data.get("response", ""))

        # Retry if empty
        if not questions:
            retry_prompt = f"{prompt}\n\nMake sure to output valid JSON only."
            retry_response = self.model_framework.generate_response(
                prompt=retry_prompt,
                task_type="quiz",
                complexity=difficulty,
                subject=subject,
                grade=grade_band
            )
            questions = self._try_parse_json(retry_response.get("response", ""))

        # Final fallback
        if not questions:
            questions = [{
                "id": "fallback-1",
                "type": "mcq",
                "question_text": f"Placeholder question for {subject}, Grade {grade_band}.",
                "options": ["A", "B", "C", "D"],
                "correct_option_index": 0,
                "explanation": "Placeholder used when AI output failed.",
                "interactive_element": "Tap the correct answer.",
                "difficulty": difficulty,
            }]

        # Ensure IDs and add pronunciation defaults
        for i, q in enumerate(questions):
            q.setdefault("id", f"{difficulty[:1]}-{i + 1}")
            q.setdefault("difficulty", difficulty)
            if q.get("type") == "pronunciation":
                q.setdefault("phonetic_hint", "example-hint")
                q.setdefault("audio_url", "https://example.com/audio/sample.mp3")

        return {
            "quiz_id": str(uuid.uuid4()),
            "chapter_id": chapter_id,
            "grade_band": grade_band,
            "difficulty": difficulty,
            "questions": questions
        }

    # ----------------------------------------------------------
    # Generate all difficulty levels (ensures distinct outputs)
    # ----------------------------------------------------------
    def generate_all_quizzes(
            self,
            subject: str,
            grade_band: str,
            chapter_id: str,
            chapter_title: str,
            chapter_summary: str
    ) -> Dict:
        """Generates unique quizzes for basic, medium, and hard levels."""

        levels = ["basic", "medium", "hard"]
        quiz_set = {}

        for lvl in levels:
            quiz_set[lvl] = [
                self.generate_quiz(
                    grade_band=grade_band,
                    subject=subject,
                    chapter_id=chapter_id,
                    chapter_title=chapter_title,
                    chapter_summary=chapter_summary,
                    num_questions=5,
                    difficulty=lvl
                )
            ]

        return quiz_set

    # ----------------------------------------------------------
    # Helper: JSON extraction
    # ----------------------------------------------------------
    def _try_parse_json(self, text: str) -> List[Dict]:
        """Extract JSON list from model text output."""
        try:
            json_text = re.search(r"\[.*\]", text, re.DOTALL)
            if json_text:
                data = json.loads(json_text.group(0))
                if isinstance(data, list):
                    return data
        except Exception:
            pass
        return []

    # ----------------------------------------------------------
    # Chat
    # ----------------------------------------------------------
    def chat_with_tutor(self, message: str, subject: str, grade: str) -> str:
        """Handles chat with the correct tutor."""
        agent = self._get_agent_for_subject(subject)
        return agent.process_request(
            user_input=message,
            subject=subject,
            grade=grade,
            complexity="medium"
        )

# Global instance
tutor_interface = AI_Tutor()