# AI Tutor Backend - Visual Explanation

A visual guide to understanding how the backend works.

---

## 🔬 Technology Deep Dive

This section explains **what each technology is**, **why we use it**, **its purpose in our project**, and **what alternatives exist**.

---

### 1. FAISS Vector Database

#### What is it?
**FAISS (Facebook AI Similarity Search)** is a library for efficient similarity search and clustering of dense vectors. It stores **embeddings** (numerical representations of text/data) and enables fast semantic search.

#### How it works:
```
Text: "What is photosynthesis?"
            │
            ▼
   ┌────────────────────┐
   │  Embedding Model   │  (Converts text to numbers)
   │  (Gemini/OpenAI)   │
   └─────────┬──────────┘
             │
             ▼
  [0.23, -0.45, 0.67, 0.12, ...]  ← 768-dimensional vector
             │
             ▼
   ┌────────────────────┐
   │   FAISS Index      │  (Stores millions of vectors)
   └─────────┬──────────┘
             │
             ▼
   Find similar vectors using cosine similarity
             │
             ▼
   Returns: Related content about photosynthesis
```

#### Why do we use it?
- **Semantic Search**: Find content by meaning, not just keywords
- **Fast Retrieval**: Search millions of documents in milliseconds
- **RAG (Retrieval-Augmented Generation)**: Provides context to AI for better answers
- **Offline Capable**: Works locally without internet

#### Where we use it in the project:
```python
# backend/src/tutor/interface.py
vector_store = FAISS.load_local(vector_store_path, embeddings)
self.retriever = vector_store.as_retriever(search_kwargs={"k": 5})
# Returns top 5 most relevant documents for any query
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **Pinecone** | Cloud-hosted vector DB | Need managed service, scalability |
| **Weaviate** | Open-source, GraphQL API | Need hybrid search (vector + keyword) |
| **Milvus** | Distributed vector DB | Large scale, production systems |
| **Chroma** | Lightweight, Python-native | Quick prototyping, small datasets |
| **Qdrant** | Rust-based, high performance | Need filtering + vector search |

---

### 2. FastAPI (Web Framework)

#### What is it?
**FastAPI** is a modern, high-performance Python web framework for building APIs. It uses Python type hints for automatic validation and documentation.

#### How it works:
```
HTTP Request                                  HTTP Response
     │                                              ▲
     ▼                                              │
┌─────────────────────────────────────────────────────────┐
│                     FASTAPI                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Routing   │→ │  Validation │→ │   Handler   │     │
│  │ /students/  │  │  Pydantic   │  │   Logic     │     │
│  │   login     │  │   Schema    │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

#### Why do we use it?
- **Automatic API Documentation**: Swagger UI at `/docs`
- **Type Validation**: Pydantic validates requests automatically
- **Async Support**: Handles thousands of concurrent requests
- **Fast**: One of the fastest Python frameworks (on par with Node.js)

#### Where we use it:
```python
# backend/api.py
app = FastAPI(title="Euri AI Tutor API", version="2.0")

@app.post("/generate_quiz")
def generate_quiz(request: QuizRequest):  # Auto-validated!
    ...
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **Flask** | Simple, minimal | Small projects, learning |
| **Django** | Batteries-included | Full web apps with admin |
| **Express.js** | Node.js framework | JavaScript ecosystem |
| **Spring Boot** | Java framework | Enterprise applications |
| **Gin** | Go framework | Maximum performance needed |

---

### 3. SQLAlchemy ORM

#### What is it?
**SQLAlchemy** is a Python SQL toolkit and Object-Relational Mapper (ORM). It lets you work with databases using Python objects instead of raw SQL.

#### How it works:
```
Python Object                           Database Table
┌─────────────────┐                    ┌─────────────────┐
│ class Student:  │    SQLAlchemy     │ students table  │
│   id = "abc"    │ ──────────────→   │ ┌────┬────────┐ │
│   name = "John" │                   │ │ id │ name   │ │
│   email = "..." │                   │ ├────┼────────┤ │
└─────────────────┘                   │ │abc │ John   │ │
                                      │ └────┴────────┘ │
                                      └─────────────────┘
```

#### Why do we use it?
- **Database Abstraction**: Switch between SQLite, MySQL, PostgreSQL easily
- **Object-Oriented**: Work with Python objects, not SQL strings
- **Relationships**: Handle foreign keys and joins naturally
- **Migrations**: Evolve schema over time safely

#### Where we use it:
```python
# backend/models/students.py
class Student(Base):
    __tablename__ = "students"
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)

# Usage: No SQL needed!
student = db.query(Student).filter(Student.email == "test@mail.com").first()
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **Raw SQL** | Direct SQL queries | Simple queries, full control |
| **Peewee** | Lightweight ORM | Small projects |
| **Django ORM** | Django's built-in | Using Django framework |
| **Tortoise ORM** | Async-first ORM | Async applications |
| **Prisma** | Modern ORM (TS/Python) | Type safety focus |

---

### 4. LangChain

#### What is it?
**LangChain** is a framework for developing applications powered by Large Language Models (LLMs). It provides tools for chaining together multiple AI operations.

#### How it works:
```
User Question: "Explain photosynthesis"
        │
        ▼
┌───────────────────────────────────────────────────────┐
│                    LANGCHAIN                           │
│                                                        │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐ │
│  │  Retriever  │ → │   Prompt    │ → │     LLM     │ │
│  │   (FAISS)   │   │  Template   │   │  (GPT/etc)  │ │
│  └─────────────┘   └─────────────┘   └─────────────┘ │
│        ↓                 ↓                  ↓         │
│  Get relevant      Combine with       Generate        │
│  documents         context            answer          │
└───────────────────────────────────────────────────────┘
        │
        ▼
"Photosynthesis is the process by which plants..."
```

#### Why do we use it?
- **Chain Operations**: Connect retrieval → formatting → generation
- **Multiple LLMs**: Easily switch between GPT, Gemini, Claude
- **Vector Store Integration**: Works with FAISS, Pinecone, etc.
- **Memory**: Maintain conversation context

#### Where we use it:
```python
# backend/src/tutor/interface.py
from langchain_community.vectorstores import FAISS
self.retriever = vector_store.as_retriever(search_kwargs={"k": 5})
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **LlamaIndex** | Data-focused LLM framework | Heavy document processing |
| **Haystack** | NLP pipeline framework | Search applications |
| **Semantic Kernel** | Microsoft's LLM framework | .NET/Enterprise |
| **Direct API Calls** | Raw OpenAI/Anthropic SDKs | Simple use cases |

---

### 5. Euri AI SDK

#### What is it?
**Euri AI** is an AI service provider that gives access to multiple LLM models (GPT-4, Gemini, DeepSeek, Llama) through a unified API.

#### How it works:
```
Your Application
       │
       ▼
┌──────────────────┐
│   Euri AI SDK    │  (Single API key)
└────────┬─────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│GPT-4.1│ │Gemini │ │DeepSeek│ │ Llama │
│ Nano  │ │2.5 Pro│ │  R1    │ │   4   │
└───────┘ └───────┘ └───────┘ └───────┘
```

#### Why do we use it?
- **Multiple Models**: Access 10+ AI models with one API key
- **Cost Optimization**: Choose cheaper models for simple tasks
- **Fallback**: If one model fails, try another
- **Unified Interface**: Same code for all models

#### Where we use it:
```python
# backend/src/tutor/framework.py
from euriai import EuriaiClient

client = EuriaiClient(api_key=os.environ.get("EURIAI_API_KEY"))
client.model = "gpt-4.1-nano"  # Or "gemini-2.5-pro", "deepseek-r1"
response = client.generate_completion(prompt=prompt)
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **OpenAI API** | Direct GPT access | Only need OpenAI models |
| **Anthropic API** | Claude models | Need Claude specifically |
| **Google AI API** | Gemini models | Google ecosystem |
| **Together AI** | Open-source model hosting | Open-source models |
| **Replicate** | Model marketplace | Variety of models |

---

### 6. bcrypt (Password Hashing)

#### What is it?
**bcrypt** is a password hashing function designed to be slow and computationally expensive, making it resistant to brute-force attacks.

#### How it works:
```
Password: "mypassword123"
              │
              ▼
┌─────────────────────────────────────────┐
│             bcrypt.hashpw()              │
│  • Add random salt                       │
│  • Run 10+ rounds of hashing             │
│  • Intentionally slow (100ms+)           │
└─────────────────────────────────────────┘
              │
              ▼
"$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4...." (60 chars)
```

#### Why do we use it?
- **Secure**: Industry standard for passwords
- **Salt Included**: Each hash is unique (same password → different hash)
- **Slow by Design**: ~100ms per hash prevents brute force
- **Adjustable Difficulty**: Can increase rounds as computers get faster

#### Where we use it:
```python
# backend/routes/students_router.py
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, stored_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), stored_hash.encode())
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **Argon2** | Newer, memory-hard algorithm | Highest security needed |
| **scrypt** | Memory-hard hashing | Crypto applications |
| **PBKDF2** | NIST approved | Compliance requirements |
| **SHA-256** | ❌ Not for passwords! | Only for data integrity |

---

### 7. Pydantic (Data Validation)

#### What is it?
**Pydantic** is a data validation library using Python type hints. It validates incoming data and converts it to Python objects automatically.

#### How it works:
```
JSON Request                  Pydantic Model                Python Object
{                         →   class QuizRequest:        →   validated instance
  "subject": "Math",           subject: str
  "grade_band": "5-6",         grade_band: str              obj.subject = "Math"
  "num_questions": 5           num_questions: int           obj.grade_band = "5-6"
}                                                           obj.num_questions = 5
     │
     └── If invalid → HTTP 422 Error with details
```

#### Why do we use it?
- **Automatic Validation**: No manual if/else checks
- **Type Coercion**: Converts "5" string to 5 integer
- **Clear Error Messages**: Lists all validation errors
- **IDE Support**: Autocomplete from type hints

#### Where we use it:
```python
# backend/schemas.py
class StudentRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    grade_band: str
    board: str = "CBSE"  # Default value
    medium: str | None = None  # Optional
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **marshmallow** | Older validation library | Legacy projects |
| **cerberus** | Schema-based validation | Complex schemas |
| **attrs** | Class creation library | When not using FastAPI |
| **dataclasses** | Built-in Python | Simple data containers |

---

### 8. Uvicorn (ASGI Server)

#### What is it?
**Uvicorn** is a lightning-fast ASGI server implementation. ASGI (Asynchronous Server Gateway Interface) is a successor to WSGI that supports async operations.

#### How it works:
```
                    Internet
                        │
                        ▼
              ┌──────────────────┐
              │     Uvicorn      │  (Listens on port 8000)
              │   ASGI Server    │
              └────────┬─────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌────────┐        ┌────────┐        ┌────────┐
│Request1│        │Request2│        │Request3│
│(async) │        │(async) │        │(async) │
└────────┘        └────────┘        └────────┘
    │                  │                  │
    └──────────────────┼──────────────────┘
                       ▼
              ┌──────────────────┐
              │     FastAPI      │
              │   Application    │
              └──────────────────┘
```

#### Why do we use it?
- **Async Native**: Handles thousands of concurrent connections
- **Fast**: One of the fastest Python servers
- **Auto-reload**: Hot reload during development
- **HTTP/2 Support**: Modern protocol support

#### Where we use it:
```python
# backend/api.py
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.api:app", host="127.0.0.1", port=8000, reload=False)
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **Gunicorn** | WSGI server | Production, multiple workers |
| **Hypercorn** | ASGI server | HTTP/3 support needed |
| **Daphne** | Django ASGI server | Django Channels |
| **uWSGI** | Full-featured server | Complex deployments |

---

### 9. SQLite (Database)

#### What is it?
**SQLite** is a lightweight, file-based relational database. It stores the entire database in a single file (`tutor.db`).

#### How it works:
```
┌─────────────────────────────────────────┐
│           tutor.db (single file)        │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │students │ │chapters │ │flashcard│   │
│  ├─────────┤ ├─────────┤ ├─────────┤   │
│  │id       │ │id       │ │id       │   │
│  │name     │ │title    │ │question │   │
│  │email    │ │subject_id│ │answer   │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

#### Why do we use it?
- **Zero Configuration**: No server setup needed
- **Portable**: Just copy one file
- **Perfect for Development**: Easy to reset/seed
- **Good for Small Apps**: Handles thousands of users

#### Where we use it:
```python
# backend/database.py
DATABASE_URL = os.getenv("DATABASE_URL") or "sqlite:///./tutor.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
```

#### Alternatives:
| Alternative | Description | When to use |
|------------|-------------|-------------|
| **PostgreSQL** | Enterprise-grade DB | Production, complex queries |
| **MySQL/MariaDB** | Popular open-source DB | High traffic, replication |
| **MongoDB** | Document database | Flexible schemas |
| **Redis** | In-memory DB | Caching, sessions |
| **DynamoDB** | AWS managed DB | Serverless, AWS apps |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    FRONTEND                                          │
│                              React App (Port 3000)                                   │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│   │  Login   │  │Dashboard │  │  Quiz    │  │Flashcard │  │  Score   │             │
│   │   View   │  │   View   │  │   View   │  │   View   │  │   View   │             │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
└────────┼─────────────┼─────────────┼─────────────┼─────────────┼────────────────────┘
         │             │             │             │             │
         └─────────────┴─────────────┼─────────────┴─────────────┘
                                     │
                            HTTP REST API
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              FASTAPI BACKEND                                         │
│                              (Port 8000)                                             │
│                                                                                      │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │                              ROUTES LAYER                                      │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │  │
│  │  │  /students  │ │ /flashcards │ │  /subjects  │ │  /chapters  │             │  │
│  │  │  register   │ │    save     │ │    list     │ │    list     │             │  │
│  │  │   login     │ │   fetch     │ │             │ │             │             │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                              │  │
│  │  │    /quiz    │ │   /meta     │ │   /score    │                              │  │
│  │  │  generate   │ │   boards    │ │  calculate  │                              │  │
│  │  │   submit    │ │   grades    │ │    fetch    │                              │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘                              │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                     │                                                │
│                                     ▼                                                │
│  ┌───────────────────────────────────────────────────────────────────────────────┐  │
│  │                            SERVICES LAYER                                      │  │
│  │  ┌─────────────────────────────┐  ┌─────────────────────────────┐            │  │
│  │  │    Flashcard Service        │  │    Progress Service         │            │  │
│  │  │  • save_flashcards_from_quiz│  │  • update_progress          │            │  │
│  │  │  • get_flashcards           │  │  • get_due_flashcards       │            │  │
│  │  │  • link to student          │  │  • spaced repetition algo   │            │  │
│  │  └─────────────────────────────┘  └─────────────────────────────┘            │  │
│  └───────────────────────────────────────────────────────────────────────────────┘  │
│                                     │                                                │
│                    ┌────────────────┴────────────────┐                              │
│                    ▼                                 ▼                              │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────────────┐   │
│  │      DATABASE LAYER          │  │           AI TUTOR CORE                   │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────────────┐  │   │
│  │  │      SQLAlchemy        │  │  │  │         AI_Tutor Class             │  │   │
│  │  │  ┌──────┐ ┌──────┐     │  │  │  │  • generate_quiz()                 │  │   │
│  │  │  │Models│ │Engine│     │  │  │  │  • chat_with_tutor()               │  │   │
│  │  │  └──────┘ └──────┘     │  │  │  │  • generate_roadmap()              │  │   │
│  │  └───────────┬────────────┘  │  │  └──────────────┬─────────────────────┘  │   │
│  │              ▼               │  │                 ▼                        │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────────────┐  │   │
│  │  │   SQLite / MySQL       │  │  │  │     EuriAI Framework               │  │   │
│  │  │   (tutor.db)           │  │  │  │  • Model selection                 │  │   │
│  │  └────────────────────────┘  │  │  │  • GPT-4.1, Gemini, DeepSeek       │  │   │
│  └──────────────────────────────┘  │  └────────────────────────────────────┘  │   │
│                                    └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE RELATIONSHIPS                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │   BOARDS    │────────▶│  SYLLABI    │────────▶│  SUBJECTS   │
    │             │   1:N   │             │   1:N   │             │
    │ • CBSE      │         │ • board_id  │         │ • syllabus_id│
    │ • ICSE      │         │ • grade     │         │ • Math       │
    │ • State     │         │ • year      │         │ • Science    │
    └─────────────┘         └─────────────┘         │ • English    │
                                                    └──────┬──────┘
                                                           │ 1:N
                                                           ▼
    ┌─────────────┐         ┌─────────────┐         ┌─────────────┐
    │  STUDENTS   │         │   QUIZZES   │◀────────│  CHAPTERS   │
    │             │         │             │   N:1   │             │
    │ • name      │         │ • subject_id│         │ • subject_id│
    │ • email     │         │ • chapter_id│         │ • title     │
    │ • password  │         │ • difficulty│         │ • chapter_no│
    │ • grade_band│         └──────┬──────┘         └──────┬──────┘
    │ • board     │                │ 1:N                   │ 1:N
    └──────┬──────┘                ▼                       ▼
           │           ┌─────────────┐              ┌─────────────┐
           │           │  QUESTIONS  │              │ SUBCHAPTERS │
           │           │             │              │             │
           │           │ • quiz_id   │              │ • chapter_id│
           │           │ • text      │              │ • title     │
           │           │ • options   │              │ • order     │
           │           │ • answer    │              └─────────────┘
           │           └─────────────┘
           │ 1:N
           ▼
    ┌─────────────┐         ┌──────────────────┐
    │ FLASHCARDS  │────────▶│ STUDENT_PROGRESS │
    │             │   1:1   │                  │
    │ • student_id│         │ • student_id     │
    │ • chapter_id│         │ • flashcard_id   │
    │ • question  │         │ • attempts       │
    │ • answer    │         │ • status         │
    │ • explain   │         │ • next_review    │
    └─────────────┘         └──────────────────┘
```

---

## 🔄 Request Flow Diagrams

### Student Registration

```
┌──────────┐    POST /students/register    ┌──────────┐    Query    ┌──────────┐
│  React   │──────────────────────────────▶│  FastAPI │────────────▶│ Database │
│ Frontend │                               │  Router  │             │          │
└──────────┘                               └──────────┘             └──────────┘
     │                                           │                        │
     │  {name, email, password,                  │  Check if email        │
     │   grade_band, board}                      │  already exists        │
     │                                           │◀───────────────────────│
     │                                           │                        │
     │                                           │  If exists → 400 Error │
     │                                           │                        │
     │                                           │  If not:               │
     │                                           │  1. Hash password      │
     │                                           │  2. Create Student     │
     │                                           │  3. INSERT record      │
     │                                           │───────────────────────▶│
     │                                           │                        │
     │   {message: "Success",                    │  Return new ID         │
     │    student_id: "uuid"}                    │◀───────────────────────│
     │◀──────────────────────────────────────────│                        │
```

### Quiz Generation

```
┌──────────┐                     ┌──────────┐                    ┌──────────┐
│  React   │  POST /generate_quiz│  FastAPI │                    │ AI Tutor │
│ Frontend │────────────────────▶│   API    │                    │  Core    │
└──────────┘                     └──────────┘                    └──────────┘
     │                                │                               │
     │  {subject: "Math",             │  1. Validate Request          │
     │   grade_band: "5-6",           │  2. Check student grade       │
     │   chapter_id: "...",           │                               │
     │   chapter_title: "...",        │  3. Call AI Tutor             │
     │   difficulty: "basic"}         │──────────────────────────────▶│
     │                                │                               │
     │                                │     4. Get allowed Q types    │
     │                                │        for grade_band         │
     │                                │                               │
     │                                │     5. Build AI prompt        │
     │                                │                               │
     │                                │     6. Select optimal model   │
     │                                │        ┌─────────────────┐    │
     │                                │        │  EuriAI Cloud   │    │
     │                                │        │  ┌───────────┐  │    │
     │                                │        │  │GPT-4.1    │  │    │
     │                                │        │  │Gemini 2.5 │  │◀───│
     │                                │        │  │DeepSeek   │  │    │
     │                                │        │  └───────────┘  │    │
     │                                │        └────────┬────────┘    │
     │                                │                 │             │
     │                                │     7. Parse JSON response    │
     │                                │◀──────────────────────────────│
     │                                │                               │
     │                                │  8. Save flashcards to DB     │
     │                                │  9. Save quiz questions       │
     │                                │                               │
     │  {basic: [...],                │                               │
     │   medium: [...],               │                               │
     │   hard: [...]}                 │                               │
     │◀───────────────────────────────│                               │
```

---

## 🧠 AI Model Selection

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                         INTELLIGENT MODEL SELECTION                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  Incoming Task  │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
            ┌───────────┐      ┌───────────┐      ┌───────────┐
            │   CHAT    │      │   MATH    │      │  SCIENCE  │
            └─────┬─────┘      └─────┬─────┘      └─────┬─────┘
                  │                  │                  │
    ┌─────────────┼─────────────────┼─────────────────┼─────────────┐
    │             │                  │                  │            │
    ▼             ▼                  ▼                  ▼            ▼
┌───────┐    ┌────────┐         ┌────────┐         ┌────────┐  ┌────────┐
│Simple │    │ Medium │         │ Complex│         │ Complex│  │Creative│
└───┬───┘    └────┬───┘         └────┬───┘         └────┬───┘  └────┬───┘
    │             │                  │                  │           │
    ▼             ▼                  ▼                  ▼           ▼
┌─────────┐ ┌─────────┐       ┌─────────────┐   ┌─────────────┐ ┌─────────┐
│ Gemini  │ │ GPT-4.1 │       │  DeepSeek   │   │   Gemini    │ │ GPT-4.1 │
│ 2.5     │ │  Nano   │       │  R1-70B     │   │   2.5 Pro   │ │  Mini   │
│ Flash   │ │         │       │             │   │             │ │         │
└─────────┘ └─────────┘       └─────────────┘   └─────────────┘ └─────────┘
```

---

## 📚 Grade-Wise Question Types

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           QUESTION TYPES BY GRADE                                    │
└─────────────────────────────────────────────────────────────────────────────────────┘

 Grade 1-4 (Young Learners)
 ┌───────────────────────────────────────────────────────────────────────┐
 │  🎯 MCQ          │  🔗 Matching      │  🖼️ Select Image               │
 │  📝 Spell Word   │  🎵 Pronunciation │                                 │
 │                  │                   │  Features:                      │
 │  Simple, visual, │  Interactive      │  • Emojis                       │
 │  one-step thinking│  elements        │  • Pictures                     │
 │                  │                   │  • Audio hints                  │
 └───────────────────────────────────────────────────────────────────────┘

 Grade 5-7 (Intermediate)
 ┌───────────────────────────────────────────────────────────────────────┐
 │  🎯 MCQ          │  ✓/✗ True/False  │                                 │
 │                  │                   │  Features:                      │
 │  Standard format │  Logical thinking │  • Short reasoning              │
 │  with 4 options  │  with statements  │  • Comparisons                  │
 │                  │                   │  • Word problems                │
 └───────────────────────────────────────────────────────────────────────┘

 Grade 8-10 (Advanced)
 ┌───────────────────────────────────────────────────────────────────────┐
 │  📝 Fill in Blank│  ✍️ Short Answer  │                                 │
 │                  │                   │  Features:                      │
 │  Tests recall    │  Requires written │  • Analysis                     │
 │  and precision   │  explanations     │  • Application                  │
 │                  │                   │  • Inference                    │
 └───────────────────────────────────────────────────────────────────────┘
```

---

## 🔁 Spaced Repetition Algorithm

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                          SPACED REPETITION FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │  Review Card    │
                              └────────┬────────┘
                                       │
                      ┌────────────────┴────────────────┐
                      │                                 │
                      ▼                                 ▼
               ┌─────────────┐                   ┌─────────────┐
               │   CORRECT   │                   │  INCORRECT  │
               └──────┬──────┘                   └──────┬──────┘
                      │                                 │
                      ▼                                 ▼
         ┌────────────────────────┐         ┌────────────────────────┐
         │  Increase interval     │         │  Reduce interval       │
         │                        │         │                        │
         │  attempts += 1         │         │  next_review = +12 hrs │
         │  next = 2 × attempts   │         │  status = "reviewing"  │
         │        days            │         │                        │
         └───────────┬────────────┘         └────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
  ┌───────────┐            ┌───────────┐
  │attempts<3 │            │attempts≥3 │
  └─────┬─────┘            └─────┬─────┘
        │                        │
        ▼                        ▼
┌───────────────┐        ┌───────────────┐
│   REVIEWING   │        │   MASTERED    │
│               │        │               │
│ Card appears  │        │ Card rarely   │
│ regularly     │        │ appears       │
└───────────────┘        └───────────────┘


Timeline Example:
─────────────────────────────────────────────────────────────────────────────▶
Day 0        Day 2        Day 6        Day 14       Day 30
  │            │            │            │            │
  ▼            ▼            ▼            ▼            ▼
┌───┐        ┌───┐        ┌───┐        ┌───┐        ┌───┐
│ 1 │───────▶│ 2 │───────▶│ 3 │───────▶│ 4 │───────▶│ 5 │  → MASTERED
└───┘   ✓    └───┘   ✓    └───┘   ✓    └───┘   ✓    └───┘
 New       Reviewing    Reviewing    Reviewing    Mastered
```

---

## 🎮 Gamification System

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              COIN REWARD SYSTEM                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
  │  WATCH VIDEO    │      │  COMPLETE QUIZ  │      │   DAILY BONUS   │
  │                 │      │                 │      │                 │
  │   🪙 +20 coins  │      │  🪙 +10/correct │      │   🪙 +streak    │
  └─────────────────┘      └─────────────────┘      └─────────────────┘
           │                       │                       │
           └───────────────────────┼───────────────────────┘
                                   │
                                   ▼
                          ┌───────────────┐
                          │  COIN WALLET  │
                          │   🪙 Balance  │
                          └───────┬───────┘
                                  │
                                  ▼
                          ┌───────────────┐
                          │  PERKS SHOP   │
                          └───────────────┘
                                  │
        ┌──────────────┬──────────┼──────────┬──────────────┐
        ▼              ▼          ▼          ▼              ▼
   ┌─────────┐   ┌─────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐
   │ ⭐ Star │   │ 🦸 Avatar│ │ ⚡ Speed │ │ 💡 Hint │  │ 🌈 Theme│
   │ Badge   │   │ Unlock  │ │  Boost  │ │ Helper  │  │  Change │
   │  50 🪙  │   │  100 🪙 │ │  75 🪙  │ │  30 🪙  │  │  80 🪙  │
   └─────────┘   └─────────┘ └─────────┘ └─────────┘  └─────────┘
```

---

## 📁 File Structure Overview

```
backend/
│
├── 📄 api.py                 ← Main entry point (FastAPI app)
│   │
│   ├── run_migrations()      ← Auto-update DB schema
│   ├── GameState class       ← Coin/perk management
│   └── Endpoints             ← /quiz, /score, /chat, etc.
│
├── 📄 database.py            ← Database connection
│   │
│   ├── engine                ← SQLAlchemy engine
│   ├── SessionLocal          ← Session factory
│   └── Base                  ← ORM base class
│
├── 📁 models/                ← SQLAlchemy ORM models
│   ├── students.py           ← Student table
│   ├── chapter.py            ← Chapter table
│   ├── flashcard.py          ← Flashcard table
│   └── ...                   ← 16+ models
│
├── 📁 routes/                ← API route handlers
│   ├── students_router.py    ← /students/* endpoints
│   ├── flashcards_router.py  ← /flashcards/* endpoints
│   └── ...                   ← 7 routers
│
├── 📁 services/              ← Business logic
│   ├── flashcard_service.py  ← Save/fetch flashcards
│   └── progress_service.py   ← Spaced repetition logic
│
└── 📁 src/tutor/             ← AI integration
    ├── interface.py          ← AI_Tutor class
    ├── framework.py          ← EuriAI model selector
    └── registry.py           ← Subject-specific agents
```

---

## ⚡ Quick Reference

### Starting the Server

```bash
python backend/api.py
# → Server runs at http://127.0.0.1:8000
# → API docs at http://127.0.0.1:8000/docs
```

### Environment Variables

```env
DATABASE_URL=sqlite:///./tutor.db
EURIAI_API_KEY=your_api_key_here
PARENT_PIN=1234
```

### Key Endpoints

| Action | Method | Endpoint |
|--------|--------|----------|
| Register | POST | `/students/register` |
| Login | POST | `/students/login` |
| Get Quiz | POST | `/generate_quiz` |
| Submit Quiz | POST | `/calculate_quiz_score` |
| Get Flashcards | GET | `/flashcards/get_flashcards` |
| Review Flashcard | POST | `/flashcards/update_progress` |

---

## 📝 Summary

The AI Tutor backend is a **modular, scalable Python API** that:

1. **Authenticates users** with secure bcrypt hashing
2. **Generates AI quizzes** using multiple LLM models (GPT-4.1, Gemini, DeepSeek)
3. **Adapts to grade levels** with age-appropriate question types
4. **Tracks learning progress** with spaced repetition algorithms
5. **Gamifies education** with coins, perks, and achievements

All components work together to create a personalized, engaging learning experience.
