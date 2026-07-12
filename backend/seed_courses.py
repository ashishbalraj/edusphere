import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Course, User, UserRole, Difficulty

def seed_courses():
    db = SessionLocal()
    try:
        # Create a mock teacher if one doesn't exist
        teacher = db.query(User).filter(User.role == UserRole.TEACHER).first()
        if not teacher:
            teacher = User(
                email="teacher@example.com",
                full_name="Dr. Smith",
                role=UserRole.TEACHER,
                password_hash="fakehash"
            )
            db.add(teacher)
            db.commit()
            db.refresh(teacher)

        # Check if courses already exist
        if db.query(Course).count() > 0:
            print("Courses already exist. Skipping seed.")
            return

        print("Seeding courses...")
        
        courses = [
            Course(
                teacher_id=teacher.id,
                title="Machine Learning Basics",
                description="An introduction to the fundamentals of Machine Learning, including regression, classification, and neural networks.",
                category="Computer Science",
                difficulty=Difficulty.BEGINNER,
                thumbnail_url="https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2940&auto=format&fit=crop",
                syllabus="Week 1: Introduction to ML\nWeek 2: Linear Regression\nWeek 3: Logistic Regression\nWeek 4: Neural Networks Basics",
                is_published=True
            ),
            Course(
                teacher_id=teacher.id,
                title="Advanced System Design",
                description="Learn how to design scalable and distributed systems for millions of users.",
                category="Engineering",
                difficulty=Difficulty.ADVANCED,
                thumbnail_url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop",
                syllabus="Module 1: Load Balancing\nModule 2: Caching\nModule 3: Database Sharding\nModule 4: Microservices Architecture",
                is_published=True
            ),
            Course(
                teacher_id=teacher.id,
                title="Data Structures & Algorithms",
                description="Master the core data structures and algorithms required to ace top tech interviews.",
                category="Computer Science",
                difficulty=Difficulty.INTERMEDIATE,
                thumbnail_url="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2938&auto=format&fit=crop",
                syllabus="1. Arrays & Strings\n2. Hash Tables\n3. Trees & Graphs\n4. Dynamic Programming",
                is_published=True
            )
        ]
        
        for course in courses:
            db.add(course)
            
        db.commit()
        print("Courses seeded successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_courses()
