import os
import sys

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import User, UserRole
from core.security import get_password_hash

def fix_teacher():
    db = SessionLocal()
    try:
        # Find teacher@example.com
        teacher = db.query(User).filter(User.email == "teacher@example.com").first()
        hashed_password = get_password_hash("password123")
        
        if teacher:
            print("Updating existing teacher password hash...")
            teacher.password_hash = hashed_password
            teacher.role = UserRole.TEACHER
            db.commit()
            print("Teacher updated successfully!")
        else:
            print("Creating new teacher...")
            new_teacher = User(
                email="teacher@example.com",
                full_name="Dr. Smith",
                role=UserRole.TEACHER,
                password_hash=hashed_password
            )
            db.add(new_teacher)
            db.commit()
            print("Teacher created successfully!")
            
    except Exception as e:
        db.rollback()
        print(f"Error updating teacher: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fix_teacher()
