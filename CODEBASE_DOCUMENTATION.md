# AI Tutor - Complete Codebase Documentation

> Comprehensive technical documentation for the AI Tutor educational platform

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Project Structure Overview](#2-project-structure-overview)
3. [Data Model Hierarchy](#3-data-model-hierarchy)
4. [API Architecture](#4-api-architecture)
5. [AI Tutor System](#5-ai-tutor-system)
6. [Grade-Wise Question Types](#6-grade-wise-question-types)
7. [Frontend Component Flow](#7-frontend-component-flow)
8. [Theme System](#8-theme-system)
9. [Spaced Repetition Algorithm](#9-spaced-repetition-algorithm)
10. [Gamification System](#10-gamification-system)
11. [Authentication Flow](#11-authentication-flow)
12. [Quiz Generation Flow](#12-quiz-generation-flow)
13. [Key Design Patterns](#13-key-design-patterns)
14. [Data Flow Summary](#14-data-flow-summary)
15. [Key Files Reference](#15-key-files-reference)
16. [Environment Variables](#16-environment-variables)

---

## 1. High-Level Architecture

```mermaid
flowchart TB
    subgraph Frontend["Frontend (React)"]
        App[App.js]
        Views[Views Layer]
        Context[Context Providers]
        API[api.js]
    end

    subgraph Backend["Backend (FastAPI)"]
        Routes[Route Handlers]
        Services[Services Layer]
        AITutor[AI Tutor System]
        Models[ORM Models]
    end

    subgraph Database["Database"]
        SQLite[(SQLite/MySQL)]
        FAISS[(FAISS Vector Store)]
    end

    subgraph External["External APIs"]
        EuriAI[Euri AI API]
    end

    App --> Views
    App --> Context
    Views --> API
    API -->|HTTP REST| Routes
    Routes --> Services
    Routes --> AITutor
    Services --> Models
    AITutor --> Models
    Models --> SQLite
    AITutor --> FAISS
    AITutor --> EuriAI
```

### Architecture Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18+ | User interface, state management |
| **Backend** | FastAPI | REST API, business logic |
| **Database** | SQLite/MySQL | Persistent data storage |
| **Vector Store** | FAISS | Semantic search for RAG |
| **AI Provider** | Euri AI | LLM inference (GPT, Gemini, DeepSeek) |

---

## 2. Project Structure Overview

```
AI_Tutor/
├── backend/                        # FastAPI Backend
│   ├── api.py                      # Entry point (765 lines)
│   ├── database.py                 # SQLAlchemy setup
│   ├── schemas.py                  # Pydantic validation models
│   │
│   ├── models/                     # 20+ ORM models
│   │   ├── students.py             # Student account model
│   │   ├── board.py                # Educational board (CBSE, ICSE)
│   │   ├── grade.py                # Grade levels (1-10)
│   │   ├── subject.py              # Academic subjects
│   │   ├── chapter.py              # Chapters in subjects
│   │   ├── subchapter.py           # Subchapters/topics
│   │   ├── flashcard.py            # Study flashcards
│   │   ├── quiz.py                 # Quiz container
│   │   ├── question.py             # Quiz questions
│   │   ├── scorecard.py            # Quiz results
│   │   ├── student_progress.py     # Spaced repetition tracking
│   │   ├── student_game_state.py   # Gamification data
│   │   └── otp_code.py             # OTP authentication
│   │
│   ├── routes/                     # 7 API routers
│   │   ├── students_router.py      # Auth endpoints
│   │   ├── flashcards_router.py    # Flashcard CRUD
│   │   ├── chapters_router.py      # Chapter endpoints
│   │   ├── subjects_router.py      # Subject endpoints
│   │   ├── subchapters_router.py   # Subchapter endpoints
│   │   ├── meta_router.py          # Metadata (boards, grades)
│   │   └── chat_router.py          # AI chat endpoints
│   │
│   ├── services/                   # Business logic
│   │   ├── flashcard_service.py    # Flashcard operations
│   │   └── progress_service.py     # Spaced repetition logic
│   │
│   ├── utils/                      # Utilities
│   │   ├── security.py             # Password hashing, OTP
│   │   ├── auth.py                 # JWT token management
│   │   └── dependencies.py         # FastAPI dependencies
│   │
│   └── src/tutor/                  # AI Tutor core system
│       ├── interface.py            # Main AI_Tutor class
│       ├── framework.py            # Model selection logic
│       ├── registry.py             # Subject agent configs
│       ├── langchain_wrapper.py    # LangChain integration
│       ├── memory_service.py       # Conversation memory
│       ├── rag_pipeline.py         # RAG with query expansion
│       ├── enhanced_interface.py   # Enhanced tutor features
│       └── tracing.py              # LangSmith observability
│
├── frontend/src/                   # React Frontend
│   ├── App.js                      # Main component (705 lines)
│   ├── api.js                      # 150+ API functions
│   │
│   ├── views/                      # 24 view components
│   │   ├── AuthWelcomeView.js      # Welcome screen
│   │   ├── LoginView.js            # Login form
│   │   ├── RegisterView.js         # Registration form
│   │   ├── NewDashboardView.js     # Main dashboard
│   │   ├── LearnView.js            # Subject/chapter selection
│   │   ├── ChapterPageView.js      # Chapter details
│   │   ├── QuizView.js             # Quiz interface
│   │   ├── FlashcardView.js        # Flashcard review
│   │   ├── ReviewView.js           # Spaced repetition
│   │   ├── ChatView.js             # AI chat interface
│   │   ├── ProfileView.js          # User profile
│   │   ├── ParentEntryView.js      # Parent authentication
│   │   └── ...                     # Other views
│   │
│   ├── components/                 # Reusable UI components
│   │   ├── ui/                     # Basic UI elements
│   │   ├── AnimatedBackground.js
│   │   ├── ConfettiCelebration.js
│   │   └── PageTransition.js
│   │
│   ├── design/                     # Design system
│   │   ├── themes.js               # Grade-based themes
│   │   ├── tokens.js               # Design tokens
│   │   ├── designSystem.js         # Core design system
│   │   └── GlobalStyles.js         # Global CSS
│   │
│   ├── layouts/
│   │   └── MainLayout.js           # App shell with navigation
│   │
│   ├── SyllabusContext.js          # Curriculum state management
│   ├── ThemeContext.js             # Theme provider
│   └── meta.js                     # Metadata API calls
│
└── .env                            # Environment variables
```

---

## 3. Data Model Hierarchy

### Entity Relationship Diagram

```mermaid
erDiagram
    Board ||--o{ Syllabus : contains
    Syllabus ||--o{ Subject : has
    Subject ||--o{ Chapter : contains
    Chapter ||--o{ Subchapter : has

    Student ||--o{ Flashcard : creates
    Student ||--o{ Scorecard : earns
    Student ||--o{ StudentProgress : tracks
    Student ||--|| StudentGameState : has

    Student }o--|| Board : selects
    Student }o--|| Grade : enrolled_in
    Student }o--|| Language : prefers

    Quiz ||--o{ Question : contains
    Quiz ||--o{ Scorecard : generates

    Flashcard }o--|| Subject : belongs_to
    Flashcard }o--|| Chapter : belongs_to
```

### Core Models Reference

| Model | Table | Purpose | Key Fields |
|-------|-------|---------|------------|
| **Student** | `students` | User account | `id`, `name`, `email`, `password`, `board_id`, `grade_id`, `language_id` |
| **Board** | `boards` | Educational board | `id`, `name`, `code` (CBSE, ICSE, State) |
| **Grade** | `grades` | Grade level | `id`, `name`, `display_name` (Grade 1-10) |
| **Language** | `languages` | Language preference | `id`, `name`, `code` (en, hi, kn) |
| **Syllabus** | `syllabus` | Curriculum container | `id`, `name`, `board_id` |
| **Subject** | `subjects` | Academic subject | `id`, `name`, `syllabus_id`, `display_order` |
| **Chapter** | `chapters` | Chapter in subject | `id`, `chapter_no`, `title`, `description`, `subject_id` |
| **Subchapter** | `subchapters` | Topic in chapter | `id`, `title`, `summary`, `chapter_id` |
| **Flashcard** | `flashcard` | Study card | `id`, `question`, `answer`, `student_id`, `subject_id`, `chapter_id` |
| **Quiz** | `quiz` | Quiz container | `id`, `difficulty`, `created_at` |
| **Question** | `questions` | Quiz question | `id`, `type`, `question_text`, `options`, `correct_option_index`, `quiz_id` |
| **Scorecard** | `scorecard` | Quiz result | `id`, `score`, `total_questions`, `difficulty`, `student_id`, `quiz_id` |
| **StudentProgress** | `student_progress` | Spaced repetition | `id`, `flashcard_id`, `status`, `next_review`, `attempts` |
| **StudentGameState** | `student_game_state` | Gamification | `id`, `coins`, `current_streak`, `purchased_perks`, `student_id` |
| **OtpCode** | `otp_codes` | OTP tracking | `id`, `identifier`, `otp_hash`, `expires_at`, `attempts` |

### Model Relationships

```python
# Student model relationships (backend/models/students.py)
class Student(Base):
    # Foreign keys
    board_id = Column(String(36), ForeignKey("boards.id"))
    grade_id = Column(String(36), ForeignKey("grades.id"))
    language_id = Column(String(36), ForeignKey("languages.id"))

    # Relationships with cascade delete
    flashcards = relationship("Flashcard", cascade="all, delete-orphan")
    scorecards = relationship("Scorecard", cascade="all, delete-orphan")
    progress_records = relationship("StudentProgress", cascade="all, delete-orphan")
    game_state = relationship("StudentGameState", uselist=False, cascade="all, delete-orphan")
```

---

## 4. API Architecture

### Router Structure

```mermaid
flowchart LR
    subgraph Routers["API Routers"]
        SR["/students/*"]
        FR["/flashcards/*"]
        CR["/chapters/*"]
        SUB["/subjects/*"]
        MR["/meta/*"]
        SCR["/subchapters/*"]
        CHR["/chat/*"]
    end

    subgraph Direct["Direct Endpoints in api.py"]
        Auth["/verify_parent<br/>/parent/request_otp<br/>/parent/verify_otp"]
        Quiz["/generate_quiz<br/>/calculate_quiz_score"]
        Game["/game_state/{id}<br/>/buy_perk<br/>/leaderboard"]
        Video["/get_video_for_subject<br/>/complete_video_watching"]
        Health["/health"]
    end

    Client[React Frontend] --> Routers
    Client --> Direct
```

### Complete Endpoint Reference

#### Authentication (`/students/*`)
| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|--------------|
| `/students/register` | POST | Create account | `{name, email, password, board_id, grade_id}` |
| `/students/login` | POST | Login | `{email, password}` |
| `/students/request_otp` | POST | Request phone OTP | `{phone}` |
| `/students/verify_otp` | POST | Verify OTP | `{phone, otp}` |
| `/students/me` | GET | Get current user | JWT header |

#### Quiz (`/generate_quiz`, `/calculate_quiz_score`)
| Endpoint | Method | Purpose | Request Body |
|----------|--------|---------|--------------|
| `/generate_quiz` | POST | AI generates quiz | `{subject, grade_band, chapter_id, chapter_title}` |
| `/calculate_quiz_score` | POST | Score quiz | `{answers, correct_answers, student_id, difficulty}` |

#### Flashcards (`/flashcards/*`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/flashcards/get_flashcards_by_student` | GET | Get due flashcards |
| `/flashcards/update_progress` | POST | Update card mastery |
| `/flashcards/due_today/{student_id}` | GET | Cards due today |

#### Chat (`/chat/*`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/chat/` | POST | Chat with memory |
| `/chat/simple` | POST | Stateless chat |
| `/chat/query-curriculum` | POST | RAG curriculum query |
| `/chat/history/{student_id}/{subject}` | GET | Get history |
| `/chat/history/{student_id}` | DELETE | Clear history |

#### Gamification
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/game_state/{student_id}` | GET | Get full game state |
| `/coin_display` | GET | Get coin count |
| `/buy_perk` | POST | Purchase perk |
| `/perks_shop` | GET | List available perks |
| `/leaderboard` | GET | Get progress/leaderboard |
| `/parent_dashboard` | GET | Parent monitoring data |

#### Metadata (`/meta/*`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/meta/boards` | GET | List all boards |
| `/meta/grades` | GET | List all grades |
| `/meta/subjects` | GET | List all subjects |
| `/meta/languages` | GET | List all languages |

---

## 5. AI Tutor System

### System Architecture

```mermaid
flowchart TB
    subgraph Interface["AI_Tutor Class (interface.py)"]
        Init["__init__()"]
        GenQuiz["generate_quiz()"]
        GenAll["generate_all_quizzes()"]
        Chat["chat_with_tutor()"]
        GetAgent["_get_agent_for_subject()"]
        GetTypes["_get_allowed_question_types()"]
    end

    subgraph Framework["EuriaiModelFramework (framework.py)"]
        Select["select_optimal_model()"]
        Generate["generate_response()"]
        Adapt["_adapt_prompt_for_chat()"]
        Parse["_parse_completion_response()"]
        Track["_track_usage()"]
    end

    subgraph Models["Available AI Models"]
        GPT["gpt-4.1-nano<br/>gpt-4.1-mini"]
        Gemini["gemini-2.5-flash<br/>gemini-2.5-pro"]
        DeepSeek["deepseek-r1-distill-llama-70b"]
        Llama["llama-4-scout-17b"]
    end

    subgraph RAG["RAG Pipeline"]
        FAISS[(FAISS Index)]
        Embed["EuriaiEmbeddings<br/>(gemini-embedding-001)"]
        Retrieve["Retriever (k=5)"]
    end

    Init --> FAISS
    Init --> Embed
    Embed --> Retrieve

    GenQuiz --> GetTypes
    GenQuiz --> Framework
    GenAll --> GenQuiz

    Chat --> GetAgent
    GetAgent --> Framework
    Chat --> RAG

    Framework --> Select
    Select --> Models
    Framework --> Generate
    Generate --> Parse
    Generate --> Track
```

### Model Selection Matrix

The framework automatically selects the optimal model based on task type and complexity:

```python
# From backend/src/tutor/framework.py
selection_matrix = {
    "chat": {
        "simple": "gemini-2.5-flash",
        "medium": "gpt-4.1-nano",
        "complex": "gpt-4.1-mini"
    },
    "math": {
        "simple": "gpt-4.1-mini",
        "medium": "deepseek-r1-distill-llama-70b",
        "complex": "gemini-2.5-pro"
    },
    "science": {
        "simple": "gemini-2.5-flash",
        "medium": "gpt-4.1-mini",
        "complex": "gemini-2.5-pro"
    },
    "creative": {
        "simple": "gpt-4.1-nano",
        "medium": "gpt-4.1-mini",
        "complex": "gemini-2.5-pro"
    },
    "reasoning": {
        "simple": "gpt-4.1-mini",
        "medium": "llama-4-scout-17b-16e-instruct",
        "complex": "gemini-2.5-pro"
    }
}
```

### Subject Agent Registry

```python
# From backend/src/tutor/registry.py
AGENT_CONFIGS = {
    "math_tutor": {
        "name": "Math Tutor",
        "specialty": "Mathematics problem solving",
        "prompt_prefix": "You are an expert math tutor..."
    },
    "science_tutor": {
        "name": "Science Tutor",
        "specialty": "Science concepts and experiments",
        "prompt_prefix": "You are a science educator..."
    },
    "english_tutor": {
        "name": "English Tutor",
        "specialty": "Language and literature",
        "prompt_prefix": "You are an English language tutor..."
    },
    "social_tutor": {
        "name": "Social Studies Tutor",
        "specialty": "History and geography",
        "prompt_prefix": "You are a social studies expert..."
    },
    "learning_coordinator": {
        "name": "Learning Coordinator",
        "specialty": "General learning guidance",
        "prompt_prefix": "You are a helpful learning assistant..."
    }
}
```

---

## 6. Grade-Wise Question Types

### Question Type Distribution

```mermaid
flowchart LR
    subgraph Grades1_4["Grades 1-4 (Kids)"]
        MCQ1["MCQ"]
        Match["Matching"]
        Image["Select Image"]
        Spell["Spell Word"]
        Pronounce["Pronunciation"]
    end

    subgraph Grades5_7["Grades 5-7 (Tween)"]
        MCQ2["MCQ"]
        TF["True/False"]
    end

    subgraph Grades8_10["Grades 8-10 (Teen)"]
        FIB["Fill in Blank"]
        Short["Short Answer"]
    end

    Grade[Student Grade] --> |1-4| Grades1_4
    Grade --> |5-7| Grades5_7
    Grade --> |8-10| Grades8_10
```

### Implementation

```python
# From backend/src/tutor/interface.py
def _get_allowed_question_types(self, grade_band: str) -> List[str]:
    grade_num = parse_grade(grade_band)

    if grade_num <= 4:
        # Young learners - visual and interactive
        return ["mcq", "matching", "select_image", "spell_word", "pronunciation"]

    elif 5 <= grade_num <= 7:
        # Middle school - basic reasoning
        return ["mcq", "true_false"]

    elif 8 <= grade_num <= 10:
        # High school - written responses
        return ["fill_in_the_blank", "short_answer"]

    else:
        # Default fallback
        return ["mcq", "true_false", "fill_in_the_blank"]
```

### Difficulty Levels

Each quiz generates questions at three difficulty levels:

| Level | Tone | Cognitive Level |
|-------|------|-----------------|
| **Basic** | Simple words, direct questions | Recognition, basic facts, one-step thinking |
| **Medium** | Short reasoning required | 2-step thinking, comparisons, word problems |
| **Hard** | Higher-order thinking | Analysis, application, inference |

---

## 7. Frontend Component Flow

### Navigation Flow

```mermaid
flowchart TB
    subgraph Auth["Authentication Flow"]
        Welcome[WelcomeScreen]
        Login[LoginView]
        Register[RegisterView]
        Parent[ParentEntryView]
    end

    subgraph Main["Main Application"]
        App[App.js]
        Layout[MainLayout]
    end

    subgraph Tabs["Tab Navigation"]
        Home["Home<br/>(NewDashboardView)"]
        Learn["Learn<br/>(LearnView)"]
        Review["Review<br/>(ReviewView)"]
        Profile["Profile<br/>(ProfileView)"]
    end

    subgraph SubViews["Sub Views"]
        Chapter[ChapterPageView]
        Study[StudyTogetherView]
        Quiz[QuizView]
    end

    Welcome --> |"Sign In"| Login
    Welcome --> |"Register"| Register
    Welcome --> |"Guest Mode"| App
    Login --> |"Success"| App
    Register --> |"Success"| Login

    App --> Layout
    Layout --> Tabs

    Learn --> |"Select Chapter"| Chapter
    Chapter --> |"Study Mode"| Study
    Chapter --> |"Quiz Mode"| Quiz
```

### State Management

```javascript
// From frontend/src/App.js - Key state variables

// Authentication
const [currentStudent, setCurrentStudent] = useState(null);
const [authView, setAuthView] = useState('welcome');
const [isGuest, setIsGuest] = useState(false);

// Navigation
const [activeTab, setActiveTab] = useState('home');
const [subView, setSubView] = useState(null);

// Selection
const [selectedBoard, setSelectedBoard] = useState(null);
const [selectedGrade, setSelectedGrade] = useState(null);
const [selectedSubject, setSelectedSubject] = useState(null);
const [selectedChapter, setSelectedChapter] = useState(null);

// Game State
const [gameState, setGameState] = useState({
  coins: 100,
  total_score: 0,
  streak_days: 0,
  quizzes_completed: 0,
  current_level: 1,
});

// Data
const [flashcards, setFlashcards] = useState([]);
const [chatMessages, setChatMessages] = useState([]);
```

### Context Providers

```javascript
// SyllabusContext - Curriculum state
const SyllabusContext = {
  syllabus,
  currentChapter,
  dbChapters,
  selectedDbChapter,
  dbSubchapters,
  fetchChaptersFromDB(),
  fetchSubchaptersFromDB(),
  nextChapter(),
  loadSyllabus()
};

// ThemeContext - Grade-based theming
const ThemeContext = {
  theme,
  themeName,  // 'kids' | 'teen' | 'mature'
  setTheme(),
  isKidsTheme,
  isTeenTheme,
  isMatureTheme,
  getColor(),
  getFont(),
  getRadius()
};
```

---

## 8. Theme System

### Three Grade-Based Themes

```mermaid
flowchart LR
    subgraph Provider["ThemeProvider"]
        Hook["useTheme()"]
    end

    subgraph Kids["Kids Theme (Grades 1-4)"]
        K_Colors["Colors:<br/>Primary: #FF6B9D<br/>Secondary: #4ECDC4<br/>Accent: #FFE66D"]
        K_Style["Style:<br/>Bouncy animations<br/>Large elements<br/>Playful icons"]
    end

    subgraph Tween["Tween Theme (Grades 5-7)"]
        T_Colors["Colors:<br/>Primary: #1CB0F6<br/>Secondary: #8549BA<br/>Accent: #FF9600"]
        T_Style["Style:<br/>Smooth animations<br/>Balanced design<br/>Engaging icons"]
    end

    subgraph Teen["Teen Theme (Grades 8-10)"]
        Te_Colors["Colors:<br/>Primary: #1CB0F6<br/>Secondary: #58CC02<br/>Accent: #FF9600"]
        Te_Style["Style:<br/>Minimal animations<br/>Professional look<br/>Clean icons"]
    end

    Provider --> |"Grade 1-4"| Kids
    Provider --> |"Grade 5-7"| Tween
    Provider --> |"Grade 8-10"| Teen
```

### Theme Configuration

```javascript
// From frontend/src/design/themes.js

const kidsTheme = {
  colors: {
    primary: '#FF6B9D',
    secondary: '#4ECDC4',
    accent: '#FFE66D'
  },
  fonts: {
    primary: 'Fredoka One',
    secondary: 'Comic Neue'
  },
  borderRadius: {
    small: '15px',
    medium: '25px',
    large: '35px'
  },
  animations: {
    duration: '0.4s',
    timing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'  // Bouncy
  }
};

const tweenTheme = {
  colors: {
    primary: '#1CB0F6',
    secondary: '#8549BA',
    accent: '#FF9600'
  },
  fonts: {
    primary: 'Poppins',
    secondary: 'Segoe UI'
  },
  borderRadius: {
    small: '12px',
    medium: '16px',
    large: '20px'
  },
  animations: {
    duration: '0.3s',
    timing: 'ease-in-out'
  }
};

const teenTheme = {
  colors: {
    primary: '#1CB0F6',
    secondary: '#58CC02',
    accent: '#FF9600'
  },
  fonts: {
    primary: 'Inter',
    secondary: 'Roboto'
  },
  borderRadius: {
    small: '8px',
    medium: '12px',
    large: '16px'
  },
  animations: {
    duration: '0.25s',
    timing: 'cubic-bezier(0.2, 0, 0.8, 1)'  // Smooth
  }
};
```

---

## 9. Spaced Repetition Algorithm

### Algorithm Flow

```mermaid
flowchart TD
    Start[Card Reviewed] --> Correct{Correct?}

    Correct -->|Yes| Count{Attempt Count}
    Count -->|"< 3"| Review["Status: reviewing<br/>Next: +1 day × attempts"]
    Count -->|">= 3"| Master["Status: mastered<br/>Next: +2 × attempts days"]

    Correct -->|No| Again["Status: reviewing<br/>Next: +12 hours"]

    Review --> Update[Update Database]
    Master --> Update
    Again --> Update
```

### Status Progression

```
┌─────────────────────────────────────────┐
│                                         │
│   new ──────► reviewing ──────► mastered│
│                 ▲    │                  │
│                 │    │                  │
│                 └────┘                  │
│              (if incorrect)             │
│                                         │
└─────────────────────────────────────────┘
```

### Implementation

```python
# From backend/services/progress_service.py

def update_progress(flashcard_id: str, correct: bool, db: Session):
    progress = db.query(StudentProgress).filter(
        StudentProgress.flashcard_id == flashcard_id
    ).first()

    if correct:
        progress.attempts += 1

        if progress.attempts >= 3:
            progress.status = "mastered"
            progress.next_review = datetime.utcnow() + timedelta(days=2 * progress.attempts)
        else:
            progress.status = "reviewing"
            progress.next_review = datetime.utcnow() + timedelta(days=progress.attempts)
    else:
        progress.status = "reviewing"
        progress.next_review = datetime.utcnow() + timedelta(hours=12)

    db.commit()
```

---

## 10. Gamification System

### Rewards Flow

```mermaid
flowchart TB
    subgraph Actions["User Actions"]
        QuizComplete["Complete Quiz"]
        VideoWatch["Watch Video"]
        FlashcardReview["Review Flashcard"]
        DailyLogin["Daily Login"]
    end

    subgraph Rewards["Reward Types"]
        Coins["Coins<br/>+10 per correct answer<br/>+20 per video"]
        Streak["Streak<br/>Consecutive days"]
        XP["Experience Points"]
    end

    subgraph Shop["Perks Shop"]
        Badge["Golden Star Badge<br/>50 coins"]
        Avatar["Super Learner Avatar<br/>100 coins"]
        Boost["Speed Boost<br/>75 coins"]
        Hint["Hint Helper<br/>30 coins"]
        Theme["Rainbow Theme<br/>80 coins"]
        Music["Music Mode<br/>60 coins"]
    end

    QuizComplete --> Coins
    VideoWatch --> Coins
    FlashcardReview --> Streak
    DailyLogin --> Streak

    Coins --> Shop
```

### Game State Model

```python
# From backend/models/student_game_state.py

class StudentGameState(Base):
    __tablename__ = "student_game_state"

    id = Column(String(36), primary_key=True)
    student_id = Column(String(36), ForeignKey("students.id"))

    # Currency
    coins = Column(Integer, default=0)
    total_coins_earned = Column(Integer, default=0)

    # Streaks
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date)

    # Progress
    total_quizzes_completed = Column(Integer, default=0)
    total_flashcards_reviewed = Column(Integer, default=0)
    total_videos_watched = Column(Integer, default=0)
    total_time_spent_minutes = Column(Integer, default=0)

    # Purchases (JSON)
    purchased_perks = Column(Text, default="[]")
    daily_progress = Column(Text, default="{}")

    # Methods
    def add_coins(self, amount: int): ...
    def spend_coins(self, amount: int) -> bool: ...
    def add_perk(self, perk_id: str): ...
    def update_streak(self): ...
```

---

## 11. Authentication Flow

### Login Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Enter email & password
    F->>B: POST /students/login
    B->>DB: Query student by email
    DB-->>B: Student record
    B->>B: Verify password (Argon2)

    alt Password Valid
        B->>B: Generate JWT token
        B-->>F: {token, student_data}
        F->>F: Store token in state
        F-->>U: Redirect to Dashboard
    else Password Invalid
        B-->>F: 401 Unauthorized
        F-->>U: Show error message
    end
```

### OTP Authentication

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Enter phone number
    F->>B: POST /students/request_otp
    B->>B: Generate 6-digit OTP
    B->>B: Hash OTP (SHA256)
    B->>DB: Store OtpCode record
    B-->>F: {success: true}

    Note over B: OTP sent via SMS (or echoed in dev mode)

    U->>F: Enter OTP
    F->>B: POST /students/verify_otp
    B->>DB: Find valid OTP record
    B->>B: Verify OTP hash

    alt OTP Valid
        B->>DB: Mark OTP consumed
        B->>B: Generate JWT token
        B-->>F: {token, student_data}
    else OTP Invalid
        B->>DB: Increment attempts
        B-->>F: 400 Bad Request
    end
```

### JWT Token Structure

```python
# From backend/utils/auth.py

def create_access_token(student_id: str) -> str:
    payload = {
        "sub": student_id,
        "type": "student",
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
```

---

## 12. Quiz Generation Flow

### Complete Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI_Tutor
    participant FW as Framework
    participant E as Euri AI API
    participant DB as Database

    U->>F: Select chapter, click "Start Quiz"
    F->>B: POST /generate_quiz

    Note over B: Validate student & chapter

    B->>AI: generate_all_quizzes()

    loop For each difficulty (basic, medium, hard)
        AI->>AI: _get_allowed_question_types(grade)
        AI->>AI: Build prompt with context
        AI->>FW: generate_response()
        FW->>FW: select_optimal_model()
        FW->>E: API call with prompt
        E-->>FW: JSON response
        FW-->>AI: Parsed questions
        AI->>AI: Validate & add IDs
    end

    AI-->>B: {basic: [...], medium: [...], hard: [...]}

    B->>DB: save_flashcards_from_quiz()

    Note over DB: Store Quiz, Questions, Flashcards

    B-->>F: Quiz data
    F-->>U: Display quiz interface
```

### Quiz Request Schema

```python
# From backend/schemas.py

class QuizRequest(BaseModel):
    subject: str
    grade_band: str
    chapter_id: str
    chapter_title: str
    chapter_summary: Optional[str] = ""
    subchapter_id: Optional[str] = None
    subchapter_title: Optional[str] = None
    subchapter_summary: Optional[str] = None
    student_id: Optional[str] = None
```

### Quiz Response Structure

```json
{
  "basic": [{
    "quiz_id": "uuid",
    "chapter_id": "chapter-1",
    "grade_band": "Grade 5",
    "difficulty": "basic",
    "questions": [
      {
        "id": "Q1",
        "type": "mcq",
        "question_text": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correct_option_index": 1,
        "explanation": "2 + 2 equals 4",
        "difficulty": "basic"
      }
    ]
  }],
  "medium": [...],
  "hard": [...]
}
```

---

## 13. Key Design Patterns

### 1. Dependency Injection (FastAPI)

```python
# Database session injection
@app.post("/endpoint")
def handler(db: Session = Depends(get_db)):
    # db session automatically provided and cleaned up
    pass

# Authentication injection
@app.get("/protected")
def protected(student: Student = Depends(get_current_student)):
    # student automatically extracted from JWT
    pass
```

### 2. Lazy Loading

```python
# AI Tutor initialized only when first accessed
def get_tutor_interface():
    from src.tutor.interface import tutor_interface
    return tutor_interface

# Used in endpoints
@app.post("/generate_quiz")
def generate_quiz():
    tutor = get_tutor_interface()  # Lazy load
    return tutor.generate_all_quizzes(...)
```

### 3. Factory Pattern (Agent Creation)

```python
# From backend/src/tutor/registry.py
def create_agent(agent_type: str, retriever) -> Agent:
    config = AGENT_CONFIGS[agent_type]
    return Agent(
        name=config["name"],
        specialty=config["specialty"],
        prompt_prefix=config["prompt_prefix"],
        retriever=retriever
    )
```

### 4. Strategy Pattern (Model Selection)

```python
# From backend/src/tutor/framework.py
def select_optimal_model(self, task_type: str, complexity: str) -> str:
    selection_matrix = {
        "chat": {"simple": "gemini-2.5-flash", ...},
        "math": {"simple": "gpt-4.1-mini", ...},
        ...
    }
    return selection_matrix[task_type][complexity]
```

### 5. Context Manager (Database Sessions)

```python
# From backend/database.py
@contextmanager
def get_db_context():
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except:
        db.rollback()
        raise
    finally:
        db.close()

# Usage
with get_db_context() as db:
    db.add(new_record)
    # Auto-commit on success, rollback on exception
```

### 6. Cascade Deletes

```python
# Student deletion cascades to all related records
flashcards = relationship("Flashcard", cascade="all, delete-orphan")
scorecards = relationship("Scorecard", cascade="all, delete-orphan")
progress_records = relationship("StudentProgress", cascade="all, delete-orphan")
```

### 7. Singleton Pattern (Global Instances)

```python
# Global AI framework instance
euriai_framework = EuriaiModelFramework()

# Global tutor instance
tutor_interface = AI_Tutor()
```

---

## 14. Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                             │
│                    (Click, Type, Navigate)                           │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                                    │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │    App.js      │  │    Views/      │  │    api.js      │        │
│  │  (State Mgmt)  │◄─│  (UI Layer)    │──│  (HTTP Client) │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
│         │                                        │                   │
│         ▼                                        │                   │
│  ┌────────────────────────────────────┐         │                   │
│  │  Context Providers                  │         │                   │
│  │  • SyllabusContext (curriculum)     │         │                   │
│  │  • ThemeContext (grade themes)      │         │                   │
│  └────────────────────────────────────┘         │                   │
└─────────────────────────────────────────────────│───────────────────┘
                                                  │ REST API (JSON)
                                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BACKEND (FastAPI)                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │    Routes      │──│    Services    │──│    Models      │        │
│  │  (7 routers)   │  │  (Business)    │  │  (SQLAlchemy)  │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
│         │                    │                    │                  │
│         │                    │                    ▼                  │
│         │                    │           ┌────────────────┐         │
│         │                    │           │   Database     │         │
│         │                    │           │  (SQLite/MySQL)│         │
│         │                    │           └────────────────┘         │
│         │                    │                                       │
│         ▼                    │                                       │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  AI Tutor System                                          │      │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │      │
│  │  │  Interface   │──│  Framework   │──│  RAG/FAISS   │   │      │
│  │  │  (AI_Tutor)  │  │  (Models)    │  │  (Vectors)   │   │      │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │      │
│  │         │                 │                              │      │
│  │         │                 ▼                              │      │
│  │         │         ┌──────────────┐                      │      │
│  │         │         │  Euri AI API │                      │      │
│  │         │         │  (GPT/Gemini)│                      │      │
│  │         │         └──────────────┘                      │      │
│  └──────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 15. Key Files Reference

| File | Lines | Purpose |
|------|-------|---------|
| `backend/api.py` | 765 | FastAPI app, routes, migrations, main endpoints |
| `backend/database.py` | 133 | SQLAlchemy engine, session management |
| `backend/schemas.py` | ~150 | Pydantic request/response models |
| `backend/src/tutor/interface.py` | 323 | AI_Tutor class, quiz generation |
| `backend/src/tutor/framework.py` | 151 | Model selection, response generation |
| `backend/models/students.py` | 54 | Student ORM model |
| `backend/models/student_game_state.py` | ~100 | Gamification model |
| `backend/services/flashcard_service.py` | ~80 | Flashcard business logic |
| `backend/services/progress_service.py` | ~60 | Spaced repetition logic |
| `backend/utils/security.py` | ~100 | Password hashing, OTP |
| `backend/utils/auth.py` | ~80 | JWT token management |
| `frontend/src/App.js` | 705 | Main React component |
| `frontend/src/api.js` | ~400 | 150+ API functions |
| `frontend/src/SyllabusContext.js` | ~150 | Curriculum state |
| `frontend/src/ThemeContext.js` | ~200 | Grade-based theming |
| `frontend/src/design/themes.js` | ~100 | Theme configurations |

---

## 16. Environment Variables

### Required Variables

```bash
# AI Model Access (Required)
EURIAI_API_KEY=your_euriai_api_key_here

# Parent Authentication (Required for parent features)
PARENT_PIN=1234
PARENT_PHONE=+919876543210
```

### Optional Variables

```bash
# Database Configuration
DATABASE_URL=sqlite:///backend/tutor.db  # Default SQLite
# DATABASE_URL=postgresql://user:pass@host:5432/dbname  # Production

# Vector Store
FAISS_ALLOW_DANGEROUS_DESERIALIZATION=true  # Required for FAISS loading

# LangSmith Tracing (Optional - for observability)
LANGCHAIN_API_KEY=your_langsmith_key
LANGCHAIN_TRACING_V2=true
LANGCHAIN_PROJECT=ai-tutor

# Development Options
OTP_ECHO=true  # Echo OTP in response (dev only)
SQL_ECHO=false  # Log SQL queries

# Database Pool Settings (Production)
DB_POOL_SIZE=5
DB_MAX_OVERFLOW=10
DB_POOL_RECYCLE=3600
```

### Example `.env` File

```bash
# === Required ===
EURIAI_API_KEY=ek_xxxxxxxxxxxxxxxxxxxxxxxx
PARENT_PIN=1234

# === Database ===
DATABASE_URL=sqlite:///backend/tutor.db
FAISS_ALLOW_DANGEROUS_DESERIALIZATION=true

# === Optional: LangSmith ===
# LANGCHAIN_API_KEY=ls_xxxxxxxx
# LANGCHAIN_TRACING_V2=true
# LANGCHAIN_PROJECT=ai-tutor

# === Development ===
OTP_ECHO=true
SQL_ECHO=false
```

---

## Summary

**AI Tutor** is a production-ready educational platform featuring:

| Feature | Implementation |
|---------|----------------|
| **Clean Architecture** | Three-tier backend (Routes → Services → Models) |
| **Intelligent AI** | Dynamic model selection based on task/complexity |
| **Adaptive UI** | Grade-based themes (Kids/Tween/Teen) |
| **Gamification** | Coins, streaks, perks, leaderboards |
| **Spaced Repetition** | Scientific flashcard scheduling algorithm |
| **Parent Monitoring** | Secure PIN/OTP access to dashboard |
| **RAG Integration** | FAISS vector store for curriculum context |
| **Multi-Auth** | Email/password and phone OTP support |

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, Context API, Axios |
| **Backend** | FastAPI, SQLAlchemy, Pydantic |
| **Database** | SQLite (dev), PostgreSQL/MySQL (prod) |
| **AI/ML** | Euri AI (GPT, Gemini, DeepSeek), FAISS, LangChain |
| **Auth** | JWT, Argon2, OTP |

---

*Documentation generated for AI Tutor v2.0*