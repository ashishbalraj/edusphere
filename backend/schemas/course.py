from pydantic import BaseModel, UUID4
from typing import List, Optional
from datetime import datetime
from models import Difficulty, FileType

# -----------------------------
# Course Material Schemas
# -----------------------------
class CourseMaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    file_url: Optional[str] = None
    file_type: Optional[FileType] = None
    content: Optional[str] = None
    order: int = 0

class CourseMaterialCreate(CourseMaterialBase):
    pass

class CourseMaterialOut(CourseMaterialBase):
    id: UUID4
    course_id: UUID4
    created_at: datetime

    class Config:
        from_attributes = True

# -----------------------------
# Course Schemas
# -----------------------------
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Difficulty = Difficulty.BEGINNER
    thumbnail_url: Optional[str] = None
    syllabus: Optional[str] = None
    is_published: bool = False

class CourseCreate(CourseBase):
    pass

class CourseOut(CourseBase):
    id: UUID4
    teacher_id: UUID4
    teacher_name: Optional[str] = None
    enrollment_count: int
    created_at: datetime
    updated_at: datetime
    materials: List[CourseMaterialOut] = []

    @classmethod
    def from_orm(cls, obj):
        # Compute teacher_name from the relationship
        instance = super().from_orm(obj)
        if hasattr(obj, 'teacher') and obj.teacher:
            instance.teacher_name = obj.teacher.full_name
        return instance

    class Config:
        from_attributes = True

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    thumbnail_url: Optional[str] = None
    syllabus: Optional[str] = None
    is_published: Optional[bool] = None

# -----------------------------
# Enrollment Schemas
# -----------------------------
class EnrollmentBase(BaseModel):
    progress: float = 0.0

class EnrollmentCreate(BaseModel):
    course_id: UUID4

class EnrollmentOut(EnrollmentBase):
    id: UUID4
    student_id: UUID4
    course_id: UUID4
    course: CourseOut
    enrolled_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    progress: float
