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

def seed_data():
    db = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)

        # Seed Boards
        if db.query(Board).count() == 0:
            print("🌱 Seeding Boards...")
            boards = []
            for b_name in ["CBSE", "ICSE", "State Board", "IGCSE", "IB"]:
                board = Board(name=b_name)
                db.add(board)
                boards.append(board)
            db.flush()
            print(f"   Created {len(boards)} boards")
        else:
            boards = db.query(Board).all()
            print("✅ Boards already exist.")

        # Seed Grades
        if db.query(Grade).count() == 0:
            print("🌱 Seeding Grades...")
            grades_data = [
                {"name": "1-2", "display": "Grade 1-2 (Beginner)"},
                {"name": "3-4", "display": "Grade 3-4 (Elementary)"},
                {"name": "5-6", "display": "Grade 5-6 (Intermediate)"},
                {"name": "7-8", "display": "Grade 7-8 (Middle School)"},
                {"name": "9-10", "display": "Grade 9-10 (High School)"},
            ]
            for g in grades_data:
                db.add(Grade(grade_name=g["name"], display_name=g["display"]))
            print(f"   Created {len(grades_data)} grades")
        else:
            print("✅ Grades already exist.")

        # Seed Languages
        if db.query(Language).count() == 0:
            print("🌱 Seeding Languages...")
            for l_name in ["English", "Hindi", "Spanish", "French"]:
                db.add(Language(code=l_name[:2].lower(), name=l_name, direction="ltr"))
            print("   Created 4 languages")
        else:
            print("✅ Languages already exist.")

        # Seed Syllabi (one per subject - no duplicates)
        if db.query(Syllabus).count() == 0:
            print("🌱 Seeding Syllabi...")
            first_board = db.query(Board).first()
            if first_board:
                syllabi = []
                subject_names = ["Math", "Science", "English", "Social Studies"]
                for subject_name in subject_names:
                    syllabus = Syllabus(
                        board_id=first_board.id,
                        class_grade=5,  # Default grade level
                        subject=subject_name,
                        academic_year="2025-26",
                        is_active=True
                    )
                    db.add(syllabus)
                    syllabi.append(syllabus)
                db.flush()
                print(f"   Created {len(syllabi)} syllabi")
        else:
            print("✅ Syllabi already exist.")

        # Seed Subjects (only 4 unique subjects)
        if db.query(Subject).count() == 0:
            print("🌱 Seeding Subjects...")
            syllabi = db.query(Syllabus).all()
            subjects = []
            for syllabus in syllabi:
                subject = Subject(
                    syllabus_id=syllabus.id,
                    name=syllabus.subject,
                    code=syllabus.subject[:3].upper(),
                    order_index=0
                )
                db.add(subject)
                subjects.append(subject)
            db.flush()
            print(f"   Created {len(subjects)} subjects")
        else:
            print("✅ Subjects already exist.")

        # Seed Chapters for each subject
        if db.query(Chapter).count() == 0:
            print("🌱 Seeding Chapters...")
            subjects = db.query(Subject).all()
            chapter_data = {
                "Math": [
                    {"title": "Numbers and Counting", "description": "Learn about numbers, counting, and basic arithmetic"},
                    {"title": "Addition and Subtraction", "description": "Master adding and subtracting numbers"},
                    {"title": "Shapes and Geometry", "description": "Explore different shapes and their properties"},
                    {"title": "Multiplication Basics", "description": "Introduction to multiplication tables"},
                ],
                "Science": [
                    {"title": "Living Things", "description": "Learn about plants, animals, and living organisms"},
                    {"title": "Our Solar System", "description": "Explore planets, stars, and space"},
                    {"title": "Matter and Materials", "description": "Understanding solids, liquids, and gases"},
                    {"title": "Forces and Motion", "description": "How things move and why"},
                ],
                "English": [
                    {"title": "Alphabets and Phonics", "description": "Master letters and their sounds"},
                    {"title": "Reading Comprehension", "description": "Understanding stories and passages"},
                    {"title": "Grammar Basics", "description": "Nouns, verbs, and sentence structure"},
                    {"title": "Creative Writing", "description": "Express yourself through writing"},
                ],
                "Social Studies": [
                    {"title": "My Family and Community", "description": "Understanding families and neighborhoods"},
                    {"title": "Maps and Geography", "description": "Reading maps and understanding places"},
                    {"title": "History and Culture", "description": "Learning about the past and traditions"},
                    {"title": "Good Citizenship", "description": "Being a responsible member of society"},
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
        else:
            print("✅ Chapters already exist.")

        # Seed Subchapters for each chapter
        if db.query(Subchapter).count() == 0:
            print("🌱 Seeding Subchapters...")
            chapters = db.query(Chapter).all()
            total_subchapters = 0
            for chapter in chapters:
                # Create 2-3 subchapters per chapter
                subchapter_titles = [
                    f"Introduction to {chapter.title}",
                    f"Practice: {chapter.title}",
                    f"Quiz: {chapter.title}",
                ]
                for i, title in enumerate(subchapter_titles):
                    subchapter = Subchapter(
                        chapter_id=chapter.id,
                        title=title,
                        description=f"Practice exercises for {chapter.title}",
                        subchapter_no=str(i + 1),
                        order_index=i
                    )
                    db.add(subchapter)
                    total_subchapters += 1
            db.flush()
            print(f"   Created {total_subchapters} subchapters")
        else:
            print("✅ Subchapters already exist.")

        db.commit()
        print("🎉 Database seeding complete!")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
