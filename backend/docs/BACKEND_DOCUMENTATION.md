# AI Tutor Backend - Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [How It Runs](#how-it-runs)
6. [Database Layer](#database-layer)
7. [API Layer](#api-layer)
8. [Services Layer](#services-layer)
9. [AI Tutor Core](#ai-tutor-core)
10. [Workflow](#workflow)
11. [Code Walkthrough](#code-walkthrough)

---

## 1. Overview

The AI Tutor Backend is a **Python-based REST API server** that powers an educational platform for students. It provides:
- **User Authentication** (Student registration/login with bcrypt password hashing)
- **Content Management** (Boards, Grades, Subjects, Chapters, Subchapters)
- **AI-Powered Quiz Generation** (Using Euri AI with grade-appropriate question types)
- **Flashcard System** (Auto-generated from quiz questions with explanations)
- **Spaced Repetition Learning** (Tracking student progress for optimized review)
- **Gamification** (Coin rewards, perks, leaderboards)

---

## 2. Tech Stack

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Web Framework** | FastAPI | Latest | High-performance async REST API |
| **ORM** | SQLAlchemy | Latest | Database abstraction & models |
| **Database** | SQLite (dev) / MySQL (prod) | - | Data persistence |
| **Server** | Uvicorn | Latest | ASGI server for FastAPI |
| **AI Integration** | Euri AI SDK | ≥0.1.0 | LLM-powered content generation |
| **Vector Store** | FAISS | ≥1.7.4 | Semantic search & retrieval |
| **Embeddings** | LangChain | ≥0.1.0 | Vector embeddings for RAG |

### Supporting Libraries

| Library | Purpose |
|---------|---------|
| `python-dotenv` | Environment variable management |
| `bcrypt` | Secure password hashing |
| `pydantic` | Request/Response validation |
| `aiohttp` | Async HTTP support |
| `PyPDF2` | PDF processing for knowledge base |
| `requests` | External API calls |

### Requirements File (`requirements.txt`)
```
gradio>=4.0.0
langchain>=0.1.0
langchain-community>=0.0.20
python-dotenv>=1.0.0
requests>=2.31.0
euriai>=0.1.0
bcrypt>=4.1.2
PyPDF2>=3.0.0
faiss-cpu>=1.7.4
aiohttp>=3.8.0
tqdm>=4.65.0
pytest>=7.4.0
pytest-asyncio>=0.21.0
```

---

## 3. Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                                │
│                           http://localhost:3000                              │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ REST API Calls
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FASTAPI BACKEND (api.py)                             │
│                           http://127.0.0.1:8000                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Routes    │  │   Schemas   │  │  Middleware │  │   CORS      │        │
│  └──────┬──────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────┼───────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICES LAYER                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐                         │
│  │  Flashcard Service   │  │   Progress Service   │                         │
│  │  (flashcard_service) │  │  (progress_service)  │                         │
│  └──────────┬───────────┘  └──────────┬───────────┘                         │
└─────────────┼──────────────────────────┼────────────────────────────────────┘
              │                          │
              ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE LAYER                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                       │
│  │   Models     │  │  SQLAlchemy  │  │   SQLite/    │                       │
│  │  (16+ models)│  │    Engine    │  │    MySQL     │                       │
│  └──────────────┘  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AI TUTOR CORE (src/tutor/)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Interface   │  │  Framework   │  │   Registry   │  │    FAISS     │    │
│  │ (AI_Tutor)   │  │ (EuriAI)     │  │  (Agents)    │  │ VectorStore  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL AI SERVICES                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   GPT-4.1    │  │  Gemini 2.5  │  │  DeepSeek    │  │   Llama 4    │    │
│  │    Nano      │  │   Pro/Flash  │  │    R1        │  │    Scout     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Layered Architecture

The backend follows a **3-tier architecture**:

1. **Presentation Layer (Routes/API)** - Handles HTTP requests and responses
2. **Business Logic Layer (Services)** - Contains core business logic
3. **Data Access Layer (Models/Database)** - Database operations via SQLAlchemy ORM

---

## 4. Project Structure

```
backend/
├── api.py                    # Main FastAPI application entry point
├── database.py               # Database connection & session management
├── schemas.py                # Pydantic request/response schemas
├── seed_db.py                # Database seeding script
├── requirements.txt          # Python dependencies
├── tutor.db                  # SQLite database file (auto-created)
│
├── models/                   # SQLAlchemy ORM Models
│   ├── __init__.py           # Model registration
│   ├── students.py           # Student model
│   ├── board.py              # Education board model
│   ├── grade.py              # Grade level model
│   ├── subject.py            # Subject model
│   ├── chapter.py            # Chapter model
│   ├── subchapter.py         # Subchapter model
│   ├── flashcard.py          # Flashcard model
│   ├── quiz.py               # Quiz model
│   ├── question.py           # Question model
│   ├── scorecard.py          # Score tracking model
│   ├── student_progress.py   # Learning progress model
│   ├── language.py           # Language options model
│   └── syllabus.py           # Syllabus model
│
├── routes/                   # API Route Handlers
│   ├── __init__.py
│   ├── students_router.py    # Authentication endpoints
│   ├── flashcards_router.py  # Flashcard CRUD endpoints
│   ├── subjects_router.py    # Subject list endpoints
│   ├── chapters_router.py    # Chapter list endpoints
│   ├── subchapters_router.py # Subchapter list endpoints
│   ├── meta_router.py        # Metadata endpoints (boards, grades)
│   └── roadmap_router.py     # Learning roadmap endpoints
│
├── services/                 # Business Logic Services
│   ├── __init__.py
│   ├── flashcard_service.py  # Flashcard save/retrieve logic
│   └── progress_service.py   # Spaced repetition & progress tracking
│
└── src/                      # AI Tutor Core
    ├── tutor/
    │   ├── __init__.py
    │   ├── interface.py      # Main AI Tutor class
    │   ├── framework.py      # EuriAI model framework
    │   └── registry.py       # AI agent configurations
    │
    └── utils/
        └── euriai_embeddings.py  # Custom embeddings for FAISS
```

---

## 5. How It Runs

### Startup Sequence

```python
# api.py entry point
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting AI Tutor API...")
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=False)
```

### Initialization Flow

1. **Path Setup** - Configures Python path for imports
2. **Database Migrations** - `run_migrations()` ensures schema is up-to-date
3. **AI Tutor Initialization** - Loads FAISS vector store and creates subject agents
4. **Route Registration** - Mounts all API routers
5. **CORS Configuration** - Enables frontend access from localhost:3000
6. **Server Start** - Uvicorn starts listening on port 8000

### Running the Backend

```bash
# Option 1: Direct execution
cd backend
python api.py

# Option 2: Using virtual environment
cd backend
source .venv/bin/activate
python api.py

# Output:
# 🚀 Starting AI Tutor API...
# 🤖 AI Tutor System: ✅ Ready
# INFO: Uvicorn running on http://127.0.0.1:8000
```

---

## 6. Database Layer

### Connection Setup (`database.py`)

```python
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Database URL from .env or default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./tutor.db"

# Create engine with SQLite-specific settings
engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()
```

### Data Models

#### Core Entity Relationship Diagram

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  Board   │──<has>──│ Syllabus │──<has>──│ Subject  │──<has>──│ Chapter  │
└──────────┘       └──────────┘       └──────────┘       └──────────┘
                                                              │
                                                              │<has>
                                                              ▼
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│ Student  │──<has>──│Flashcard │       │   Quiz   │──<has>──│Question  │
└──────────┘       └──────────┘       └──────────┘       └──────────┘
     │                  │
     │<tracks>          │<has>
     ▼                  ▼
┌────────────────┐  ┌────────────────┐
│StudentProgress │  │  Subchapter    │
└────────────────┘  └────────────────┘
```

#### Key Models

**Student Model** (`models/students.py`):
```python
class Student(Base):
    __tablename__ = "students"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    password = Column(String(200))  # Bcrypt hashed
    grade_band = Column(String(20))  # "1-2", "3-4", "5-6", etc.
    board = Column(String(50))       # CBSE, ICSE, etc.
    medium = Column(String(50))      # Language of instruction
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

**Flashcard Model** (`models/flashcard.py`):
```python
class Flashcard(Base):
    __tablename__ = "flashcard"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    student_id = Column(String(36), ForeignKey("students.id"))
    subject_id = Column(String(36), ForeignKey("subjects.id"))
    chapter_id = Column(String(36), ForeignKey("chapters.id"))
    subchapter_id = Column(String(36), ForeignKey("subchapters.id"), nullable=True)
    question_text = Column(Text)
    correct_option = Column(String(255))
    explanation = Column(Text)
    difficulty = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
```

### Database Migrations

The `run_migrations()` function in `api.py` handles schema evolution:
- Checks for new columns (e.g., `name`, `board`, `grade_band`)
- Adds missing columns via `ALTER TABLE`
- Supports both SQLite and MySQL/MariaDB
- Uses idempotent operations (safe to run multiple times)

---

## 7. API Layer

### FastAPI Application (`api.py`)

```python
app = FastAPI(title="Euri AI Tutor API", version="2.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(flashcards_router)
app.include_router(chapters_router)
app.include_router(subjects_router)
app.include_router(meta_router)
app.include_router(students_router)
app.include_router(subchapters_router)
```

### API Endpoints

#### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/students/register` | Register new student |
| POST | `/students/login` | Student login with email/password |
| POST | `/students/{id}/toggle_active` | Enable/disable student account |

#### Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/meta/boards` | List all education boards |
| GET | `/meta/grades` | List all grade levels |
| GET | `/subjects?board={board}&grade={grade}` | Get subjects by board/grade |
| GET | `/chapters?subject_id={id}` | Get chapters for a subject |
| GET | `/subchapters/{chapter_id}` | Get subchapters for a chapter |

#### Quiz & Learning

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/generate_quiz` | Generate AI-powered quiz |
| POST | `/calculate_quiz_score` | Score a completed quiz |
| GET | `/student_score/{student_id}` | Get student's total score |

#### Flashcards

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/flashcards/save_flashcards_from_quiz` | Save quiz as flashcards |
| GET | `/flashcards/get_flashcards` | Get flashcards by subject/chapter |
| GET | `/flashcards/get_flashcards_by_student` | Get all student flashcards |
| POST | `/flashcards/update_progress` | Update flashcard review progress |
| GET | `/flashcards/due_flashcards` | Get cards due for spaced repetition |

#### Gamification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/coin_display` | Get current coin balance |
| POST | `/buy_perk` | Purchase a perk with coins |
| GET | `/leaderboard` | Get student progress summary |

### Request/Response Schemas (`schemas.py`)

```python
class StudentRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    grade_band: str
    board: str = "CBSE"
    medium: str | None = None

class StudentLoginRequest(BaseModel):
    email: str
    password: str

class QuizRequest(BaseModel):
    subject: str
    grade_band: str
    chapter_id: str
    chapter_title: str
    chapter_summary: str
    subchapter_id: str | None = None
    subchapter_title: str | None = None
    subchapter_summary: str | None = None
    num_questions: int = 5
    difficulty: str = "basic"
```

---

## 8. Services Layer

### Flashcard Service (`services/flashcard_service.py`)

**Purpose**: Manages flashcard creation and retrieval with student linking.

#### Key Functions:

```python
def save_flashcards_from_quiz(
    quiz_data: dict,
    subject_name: str,
    chapter_title: str,
    chapter_summary: str,
    db: Session,
    student_id: str | None = None,
    chapter_id: str | None = None,
    subchapter_id: str | None = None,
):
    """
    Saves quiz questions as flashcards.
    - Auto-detects student if not provided
    - Links to existing subjects/chapters (never creates new)
    - Stores question + explanation for review
    """
```

### Progress Service (`services/progress_service.py`)

**Purpose**: Implements spaced repetition algorithm for optimal learning.

#### Spaced Repetition Logic:

```python
def update_progress(student_id: str, flashcard_id: str, correct: bool, db: Session):
    """
    Updates flashcard review progress using SM-2 inspired algorithm:
    
    If CORRECT:
      - Status: "reviewing" → "mastered" (after 3+ attempts)
      - Next review: now + (2 × attempts) days
    
    If INCORRECT:
      - Status: stays "reviewing"
      - Next review: now + 12 hours
    """
```

#### Due Cards Retrieval:

```python
def get_due_flashcards(student_id: str, db: Session):
    """
    Returns flashcards where next_review <= now
    Used for daily study sessions
    """
```

---

## 9. AI Tutor Core

### Interface (`src/tutor/interface.py`)

The `AI_Tutor` class is the main orchestrator for AI-powered features.

#### Initialization:

```python
class AI_Tutor:
    def __init__(self, vector_store_path=None):
        # Load API key
        self.api_key = os.environ.get("EURIAI_API_KEY")
        
        # Load FAISS vector store for semantic search
        if self.api_key and os.path.exists(vector_store_path):
            embeddings = EuriaiEmbeddings(model="gemini-embedding-001")
            vector_store = FAISS.load_local(vector_store_path, embeddings)
            self.retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        
        # Initialize subject-specific agents
        for agent_type in AGENT_CONFIGS.keys():
            self.agents[agent_type] = create_agent(agent_type, self.retriever)
```

#### Grade-Wise Question Types:

```python
def _get_allowed_question_types(self, grade_band: str) -> List[str]:
    """
    Grade 1-4: mcq, matching, select_image, spell_word, pronunciation
    Grade 5-7: mcq, true_false
    Grade 8-10: fill_in_the_blank, short_answer
    """
```

#### Quiz Generation:

```python
def generate_quiz(self, grade_band, subject, chapter_id, chapter_title, 
                  chapter_summary, num_questions=5, difficulty="basic"):
    """
    Generates quiz with:
    - Grade-appropriate question types
    - Difficulty-based tone (basic/medium/hard)
    - JSON output parsing with retry logic
    - Fallback placeholder if AI fails
    """
```

### Framework (`src/tutor/framework.py`)

The `EuriaiModelFramework` handles intelligent model selection.

#### Model Selection Matrix:

```python
selection_matrix = {
    "chat":      {"simple": "gemini-2.5-flash", "medium": "gpt-4.1-nano", "complex": "gpt-4.1-mini"},
    "math":      {"simple": "gpt-4.1-mini", "medium": "deepseek-r1-distill-llama-70b", "complex": "gemini-2.5-pro"},
    "science":   {"simple": "gemini-2.5-flash", "medium": "gpt-4.1-mini", "complex": "gemini-2.5-pro"},
    "creative":  {"simple": "gpt-4.1-nano", "medium": "gpt-4.1-mini", "complex": "gemini-2.5-pro"},
    "reasoning": {"simple": "gpt-4.1-mini", "medium": "llama-4-scout-17b-16e-instruct", "complex": "gemini-2.5-pro"},
}
```

#### Response Generation:

```python
def generate_response(self, prompt, task_type="chat", complexity="medium",
                      speed_priority="balanced", subject="general", 
                      grade="6th", temperature=0.7, max_tokens=4096):
    """
    1. Select optimal model based on task/complexity/subject
    2. Adapt prompt for chat tasks (kid-friendly for lower grades)
    3. Call Euri AI SDK
    4. Parse and return response
    """
```

---

## 10. Workflow

### Complete Request Flow

```
1. Frontend Request
   └─► POST /generate_quiz
   
2. API Layer (api.py)
   └─► @app.post("/generate_quiz")
   └─► Validate request with Pydantic
   └─► Check student grade (if student_id provided)
   
3. AI Tutor Interface
   └─► AI_TUTOR.generate_all_quizzes()
   └─► Determine question types for grade
   └─► Build prompt with difficulty settings
   
4. Euri AI Framework
   └─► Select optimal model (GPT-4.1, Gemini, etc.)
   └─► Call Euri AI SDK
   └─► Parse JSON response
   
5. Flashcard Service
   └─► save_flashcards_from_quiz()
   └─► Create Quiz record
   └─► Create Question records
   └─► Create Flashcard records
   
6. Database
   └─► SQLAlchemy commits all records
   
7. Response
   └─► Return quiz data to frontend
```

### Database Seeding Workflow

```bash
# Reset and seed database
python reset_db.py       # Delete tutor.db
python seed_runner.py    # Run seed_db.py

# Creates:
# - 5 Boards (CBSE, ICSE, State Board, IGCSE, IB)
# - 5 Grades (1-2, 3-4, 5-6, 7-8, 9-10)
# - 4 Languages (English, Hindi, Spanish, French)
# - 4 Syllabi (one per subject)
# - 4 Subjects (Math, Science, English, Social Studies)
# - 16 Chapters (4 per subject)
# - 48 Subchapters (3 per chapter)
```

---

## 11. Code Walkthrough

### 1. Student Registration Flow

```python
# routes/students_router.py

@router.post("/register")
def register_student(req: StudentRegisterRequest, db: Session = Depends(get_db)):
    # 1. Check for existing email
    existing_student = db.query(Student).filter(Student.email == req.email).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 2. Create new student with hashed password
    new_student = Student(
        name=req.name,
        email=req.email,
        password=bcrypt.hashpw(req.password.encode(), bcrypt.gensalt()).decode(),
        grade_band=req.grade_band,
        board=req.board,
        medium=req.medium,
        is_active=1
    )
    
    # 3. Save and return
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    
    return {"message": "Registration successful", "student_id": new_student.id}
```

### 2. Quiz Generation Flow

```python
# api.py

@app.post("/generate_quiz")
def generate_quiz(request: QuizRequest, student_id: str = None):
    db = SessionLocal()
    try:
        # 1. Validate student grade if provided
        if student_id:
            student = db.query(Student).filter(Student.id == student_id).first()
            if student and student.grade_band != request.grade_band:
                request.grade_band = student.grade_band  # Use DB grade
        
        # 2. Generate quiz for all difficulty levels
        result = AI_TUTOR.generate_all_quizzes(
            subject=request.subject,
            grade_band=request.grade_band,
            chapter_id=request.subchapter_id or request.chapter_id,
            chapter_title=request.subchapter_title or request.chapter_title,
            chapter_summary=request.subchapter_summary or request.chapter_summary,
        )
        
        # 3. Auto-save flashcards for each difficulty
        for difficulty_level, quizzes in result.items():
            for quiz in quizzes:
                save_flashcards_from_quiz(
                    quiz_data=quiz,
                    subject_name=request.subject,
                    chapter_title=request.subchapter_title or request.chapter_title,
                    chapter_summary=request.subchapter_summary or request.chapter_summary,
                    db=db,
                    student_id=student_id,
                    chapter_id=request.chapter_id,
                    subchapter_id=request.subchapter_id,
                )
        
        return result
    finally:
        db.close()
```

### 3. Spaced Repetition Update

```python
# services/progress_service.py

def update_progress(student_id: str, flashcard_id: str, correct: bool, db: Session):
    record = db.query(StudentProgress).filter(
        StudentProgress.student_id == student_id,
        StudentProgress.flashcard_id == flashcard_id
    ).first()

    now = datetime.now()

    if not record:
        # First interaction - create new record
        record = StudentProgress(
            student_id=student_id,
            flashcard_id=flashcard_id,
            status="reviewing" if correct else "new",
            attempts=1,
            last_reviewed=now,
            next_review=now + timedelta(days=1 if correct else 0.5)
        )
        db.add(record)
    else:
        # Update existing - apply spaced repetition
        record.attempts += 1
        record.last_reviewed = now
        
        if correct:
            record.status = "mastered" if record.attempts >= 3 else "reviewing"
            record.next_review = now + timedelta(days=2 * record.attempts)
        else:
            record.status = "reviewing"
            record.next_review = now + timedelta(hours=12)

    db.commit()
    return {"status": record.status, "next_review": str(record.next_review)}
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=sqlite:///./tutor.db

# AI Services
EURIAI_API_KEY=your_euriai_api_key_here

# FAISS Vector Store (set to "true" if you trust the index)
FAISS_ALLOW_DANGEROUS_DESERIALIZATION=false

# Parental Controls
PARENT_PIN=1234
```

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r backend/requirements.txt

# 2. Set up environment
cp .env.example .env
# Edit .env with your EURIAI_API_KEY

# 3. Seed database
python seed_runner.py

# 4. Start backend
python backend/api.py

# Server runs at: http://127.0.0.1:8000
# API docs at: http://127.0.0.1:8000/docs
```

---

## Summary

The AI Tutor backend is a **well-structured FastAPI application** that:

1. **Handles Authentication** via bcrypt-secured student accounts
2. **Manages Educational Content** through a hierarchical data model (Board → Syllabus → Subject → Chapter → Subchapter)
3. **Generates AI-Powered Quizzes** using Euri AI with intelligent model selection and grade-appropriate question types
4. **Enables Adaptive Learning** through flashcards with spaced repetition tracking
5. **Gamifies Learning** with coins, perks, and progress tracking

The modular architecture (routes, services, models) ensures maintainability and testability while the AI integration provides intelligent, personalized educational content.
