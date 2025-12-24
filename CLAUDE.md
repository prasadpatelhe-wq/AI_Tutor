# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Tutor is an educational platform for students (Grades 1-10) with AI-powered quiz generation, flashcards with spaced repetition, and gamification. It consists of a React frontend and a FastAPI backend using SQLite.

## Development Commands

### Backend
```bash
# Install dependencies
pip install -r backend/requirements.txt

# Start the API server (runs on http://127.0.0.1:8000)
python backend/api.py

# Reset and seed the database with sample curriculum data
python backend/scripts/reset_seed_db.py
```

### Frontend
```bash
cd frontend
npm install
npm start       # Development server on http://localhost:3000
npm run build   # Production build
npm test        # Run tests
```

### Environment Setup
Create a `.env` file in the project root:
```
EURIAI_API_KEY=your_key_here
PARENT_PIN=1234
FAISS_ALLOW_DANGEROUS_DESERIALIZATION=false

# Optional: LangSmith tracing (for observability)
LANGCHAIN_API_KEY=your_langsmith_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=ai-tutor
```

## Architecture

### Three-Tier Backend Structure
```
backend/
├── api.py                  # FastAPI entry point, route mounting, CORS, migrations
├── database.py             # SQLAlchemy engine and session management
├── schemas.py              # Pydantic request/response models
├── routes/                 # API route handlers (one router per domain)
├── services/               # Business logic (flashcard_service, progress_service)
├── models/                 # SQLAlchemy ORM models (20+ models)
└── src/tutor/              # AI Tutor core
    ├── interface.py        # Main AI_Tutor class with quiz generation
    ├── framework.py        # EuriaiModelFramework - intelligent model selection
    ├── registry.py         # Agent configurations for different subjects
    ├── langchain_wrapper.py # LangChain-compatible ChatEuriai wrapper
    ├── memory_service.py   # Conversation memory per student session
    ├── rag_pipeline.py     # Enhanced RAG with query expansion
    ├── langgraph_tutor.py  # LangGraph workflow for multi-step tutoring
    ├── enhanced_interface.py # Enhanced AI_Tutor with LangChain integration
    └── tracing.py          # LangSmith observability support
```

### Frontend Structure
```
frontend/src/
├── App.js                  # Main component with auth, routing, state management
├── api.js                  # Backend API calls
├── views/                  # Page components (LoginView, QuizView, DashboardView, etc.)
├── components/             # Reusable UI components
├── ThemeContext.js         # Grade-adaptive theming (kids/tween/teen themes)
└── SyllabusContext.js      # Chapter/subchapter state management
```

### Data Model Hierarchy
```
Board → Syllabus → Subject → Chapter → Subchapter
Student → Flashcard, StudentProgress, Scorecard
Quiz → Question
```

## Key Patterns

### AI Model Selection
The `EuriaiModelFramework` in `backend/src/tutor/framework.py` automatically selects models based on:
- Task type (chat, math, science, creative, reasoning)
- Complexity (simple, medium, complex)
- Uses Euri AI SDK with models: GPT-4.1-nano, Gemini 2.5 Flash/Pro, DeepSeek R1

### Grade-Wise Quiz Types
Defined in `backend/src/tutor/interface.py`:
- Grades 1-4: mcq, matching, select_image, spell_word, pronunciation
- Grades 5-7: mcq, true_false
- Grades 8-10: fill_in_the_blank, short_answer

### Theme System
Frontend adapts UI based on student grade:
- Kids (Grades 1-4): Playful, colorful, larger elements
- Tween (Grades 5-7): Balanced, engaging
- Teen (Grades 8-10): Professional, minimal

### Database Migrations
`api.py` contains `run_migrations()` which handles schema evolution at startup using idempotent ALTER TABLE statements for both SQLite and MySQL.

## API Endpoints

Key routes (all prefixed with http://127.0.0.1:8000):
- `POST /students/register`, `POST /students/login` - Authentication
- `GET /meta/boards`, `GET /meta/grades`, `GET /meta/languages` - Metadata
- `GET /subjects`, `GET /chapters`, `GET /subchapters/{chapter_id}` - Curriculum
- `POST /generate_quiz` - AI quiz generation (auto-saves flashcards)
- `POST /calculate_quiz_score` - Score and award coins
- `GET /flashcards/get_flashcards_by_student` - Spaced repetition cards
- `POST /flashcards/update_progress` - Update card mastery

Enhanced Chat (LangChain-powered):
- `POST /chat/` - Chat with memory and RAG support
- `POST /chat/simple` - Simple stateless chat (backward compatible)
- `POST /chat/query-curriculum` - RAG-powered curriculum queries
- `GET /chat/history/{student_id}/{subject}` - Get conversation history
- `DELETE /chat/history/{student_id}` - Clear conversation history
- `GET /chat/health` - Enhanced chat system health check

Interactive docs at: http://127.0.0.1:8000/docs

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```
