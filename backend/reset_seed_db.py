"""
Reset and seed database with proper education data for India:
- Boards: CBSE, ICSE, Karnataka State Board
- Languages: English Medium, Kannada Medium
- Grades: 1-10 individual grades
- Subjects: Based on CBSE/KSEEB curriculum
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine, Base
from backend.models.board import Board
from backend.models.grade import Grade
from backend.models.language import Language
from backend.models.syllabus import Syllabus
from backend.models.subject import Subject
from backend.models.chapter import Chapter
from backend.models.subchapter import Subchapter


def reset_and_seed():
    db = SessionLocal()
    try:
        print("🗑️  Clearing existing data...")
        
        # Clear in reverse dependency order
        db.query(Subchapter).delete()
        db.query(Chapter).delete()
        db.query(Subject).delete()
        db.query(Syllabus).delete()
        db.query(Language).delete()
        db.query(Grade).delete()
        db.query(Board).delete()
        db.commit()
        print("   ✅ Cleared all tables")

        # ========================
        # 1. SEED BOARDS
        # ========================
        print("\n🏫 Seeding Boards...")
        boards_data = [
            {"name": "CBSE", "description": "Central Board of Secondary Education - National curriculum"},
            {"name": "ICSE", "description": "Indian Certificate of Secondary Education - Private board"},
            {"name": "Karnataka State Board", "description": "Karnataka Secondary Education Examination Board (KSEEB)"},
        ]
        boards = {}
        for b_data in boards_data:
            board = Board(name=b_data["name"], description=b_data["description"])
            db.add(board)
            boards[b_data["name"]] = board
        db.flush()
        print(f"   Created {len(boards_data)} boards: {', '.join(boards.keys())}")

        # ========================
        # 2. SEED GRADES (Individual grades 1-10)
        # ========================
        print("\n📊 Seeding Grades...")
        grades_data = [
            {"name": "1", "display": "Grade 1 (Class 1)"},
            {"name": "2", "display": "Grade 2 (Class 2)"},
            {"name": "3", "display": "Grade 3 (Class 3)"},
            {"name": "4", "display": "Grade 4 (Class 4)"},
            {"name": "5", "display": "Grade 5 (Class 5)"},
            {"name": "6", "display": "Grade 6 (Class 6)"},
            {"name": "7", "display": "Grade 7 (Class 7)"},
            {"name": "8", "display": "Grade 8 (Class 8)"},
            {"name": "9", "display": "Grade 9 (Class 9)"},
            {"name": "10", "display": "Grade 10 (Class 10)"},
        ]
        for g in grades_data:
            db.add(Grade(grade_name=g["name"], display_name=g["display"]))
        db.flush()
        print(f"   Created {len(grades_data)} grades")

        # ========================
        # 3. SEED LANGUAGES (English Medium, Kannada Medium)
        # ========================
        print("\n🌍 Seeding Languages (Medium of Instruction)...")
        languages_data = [
            {"code": "en", "name": "English Medium", "script": "Latin", "direction": "ltr"},
            {"code": "kn", "name": "Kannada Medium", "script": "Kannada", "direction": "ltr"},
        ]
        for l in languages_data:
            db.add(Language(code=l["code"], name=l["name"], script=l["script"], direction=l["direction"]))
        db.flush()
        print(f"   Created {len(languages_data)} language mediums")

        # ========================
        # 4. SEED SYLLABI (One per board)
        # ========================
        print("\n📋 Seeding Syllabi...")
        syllabi = {}
        for board_name, board in boards.items():
            syllabus = Syllabus(
                board_id=board.id,
                class_grade=5,
                subject="General",
                academic_year="2024-25",
                is_active=True
            )
            db.add(syllabus)
            syllabi[board_name] = syllabus
        db.flush()
        print(f"   Created {len(syllabi)} syllabi")

        # ========================
        # 5. SEED SUBJECTS (Based on CBSE/KSEEB curriculum)
        # ========================
        print("\n📖 Seeding Subjects...")
        
        # Common subjects across all boards
        subject_names = [
            "Mathematics",
            "Science",
            "English",
            "Hindi",
            "Kannada",
            "Social Science",
            "Environmental Studies (EVS)",
            "Computer Science",
        ]
        
        subjects = []
        for i, subject_name in enumerate(subject_names):
            # Link to CBSE syllabus as primary
            cbse_syllabus = syllabi.get("CBSE")
            if cbse_syllabus:
                subject = Subject(
                    syllabus_id=cbse_syllabus.id,
                    name=subject_name,
                    code=subject_name[:3].upper(),
                    order_index=i
                )
                db.add(subject)
                subjects.append(subject)
        db.flush()
        print(f"   Created {len(subjects)} subjects")

        # ========================
        # 6. SEED CHAPTERS FOR EACH SUBJECT
        # ========================
        print("\n📚 Seeding Chapters...")
        
        chapter_data = {
            "Mathematics": [
                {"title": "Number Systems", "description": "Understanding natural, whole, integers, rational and irrational numbers"},
                {"title": "Algebra", "description": "Polynomials, linear equations, and algebraic expressions"},
                {"title": "Geometry", "description": "Lines, angles, triangles, quadrilaterals and circles"},
                {"title": "Mensuration", "description": "Area, perimeter, volume and surface area"},
                {"title": "Statistics and Probability", "description": "Data handling, mean, median, mode and probability"},
                {"title": "Trigonometry", "description": "Trigonometric ratios and identities"},
            ],
            "Science": [
                {"title": "Matter in Our Surroundings", "description": "States of matter, physical and chemical changes"},
                {"title": "Living World", "description": "Cell biology, tissues, and organ systems"},
                {"title": "Force and Laws of Motion", "description": "Newton's laws, friction, and momentum"},
                {"title": "Light and Sound", "description": "Reflection, refraction, and sound waves"},
                {"title": "Electricity and Magnetism", "description": "Electric circuits, current, and magnetic effects"},
                {"title": "Chemical Reactions", "description": "Types of reactions and balancing equations"},
            ],
            "English": [
                {"title": "Prose and Short Stories", "description": "Comprehension and analysis of prose passages"},
                {"title": "Poetry", "description": "Understanding poems, themes, and literary devices"},
                {"title": "Grammar", "description": "Tenses, voice, reported speech, and sentence structure"},
                {"title": "Writing Skills", "description": "Essays, letters, reports, and creative writing"},
                {"title": "Reading Comprehension", "description": "Understanding passages and answering questions"},
            ],
            "Hindi": [
                {"title": "Gadya (Prose)", "description": "गद्य पाठ - कहानियाँ और निबंध"},
                {"title": "Padya (Poetry)", "description": "पद्य पाठ - कविताएँ"},
                {"title": "Vyakaran (Grammar)", "description": "व्याकरण - संज्ञा, सर्वनाम, क्रिया"},
                {"title": "Lekhan (Writing)", "description": "पत्र लेखन, निबंध लेखन"},
            ],
            "Kannada": [
                {"title": "Gadya Bhaga (Prose)", "description": "ಗದ್ಯ ಭಾಗ - ಕಥೆಗಳು ಮತ್ತು ಪ್ರಬಂಧಗಳು"},
                {"title": "Padya Bhaga (Poetry)", "description": "ಪದ್ಯ ಭಾಗ - ಕವಿತೆಗಳು"},
                {"title": "Vyakarana (Grammar)", "description": "ವ್ಯಾಕರಣ - ನಾಮಪದ, ಕ್ರಿಯಾಪದ"},
                {"title": "Rachana (Composition)", "description": "ಪತ್ರ ಲೇಖನ, ಪ್ರಬಂಧ ಬರಹ"},
            ],
            "Social Science": [
                {"title": "History - Ancient India", "description": "Indus Valley Civilization, Vedic period, Maurya and Gupta empires"},
                {"title": "History - Medieval India", "description": "Delhi Sultanate, Mughal Empire, and regional kingdoms"},
                {"title": "History - Modern India", "description": "British rule, freedom struggle, and independence"},
                {"title": "Geography - Physical Geography", "description": "Land forms, climate, and natural resources"},
                {"title": "Geography - India", "description": "Physical features, rivers, and states of India"},
                {"title": "Civics", "description": "Constitution, democracy, and government structure"},
            ],
            "Environmental Studies (EVS)": [
                {"title": "Our Environment", "description": "Understanding our surroundings and ecosystems"},
                {"title": "Plants and Animals", "description": "Living things around us"},
                {"title": "Water and Air", "description": "Natural resources and conservation"},
                {"title": "Health and Hygiene", "description": "Personal hygiene and healthy habits"},
            ],
            "Computer Science": [
                {"title": "Introduction to Computers", "description": "Computer basics, hardware and software"},
                {"title": "Operating Systems", "description": "Understanding Windows/Linux basics"},
                {"title": "MS Office", "description": "Word, Excel, PowerPoint basics"},
                {"title": "Internet and Web", "description": "Browsing, email, and online safety"},
                {"title": "Programming Basics", "description": "Introduction to Scratch/Python programming"},
            ],
        }

        total_chapters = 0
        for subject in subjects:
            chapters = chapter_data.get(subject.name, [])
            for i, ch_data in enumerate(chapters):
                chapter = Chapter(
                    subject_id=subject.id,
                    title=ch_data["title"],
                    description=ch_data["description"],
                    chapter_no=i + 1,
                    order_index=i
                )
                db.add(chapter)
                total_chapters += 1
        db.flush()
        print(f"   Created {total_chapters} chapters")

        # ========================
        # 7. SEED SUBCHAPTERS
        # ========================
        print("\n📑 Seeding Subchapters...")
        chapters = db.query(Chapter).all()
        total_subchapters = 0
        for chapter in chapters:
            subchapter_titles = [
                f"Introduction to {chapter.title}",
                f"Concepts and Examples",
                f"Practice Problems",
            ]
            for i, title in enumerate(subchapter_titles):
                subchapter = Subchapter(
                    chapter_id=chapter.id,
                    title=title,
                    description=f"Learn about {chapter.title}",
                    subchapter_no=str(i + 1),
                    order_index=i
                )
                db.add(subchapter)
                total_subchapters += 1
        db.flush()
        print(f"   Created {total_subchapters} subchapters")

        db.commit()
        print("\n🎉 Database reset and seeding complete!")
        print("\n📊 Summary:")
        print(f"   • Boards:      {len(boards_data)} (CBSE, ICSE, Karnataka State Board)")
        print(f"   • Grades:      {len(grades_data)} (1-10)")
        print(f"   • Languages:   {len(languages_data)} (English Medium, Kannada Medium)")
        print(f"   • Subjects:    {len(subjects)}")
        print(f"   • Chapters:    {total_chapters}")
        print(f"   • Subchapters: {total_subchapters}")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    reset_and_seed()
