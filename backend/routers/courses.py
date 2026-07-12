from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from uuid import UUID
from datetime import datetime

from database import get_db
from models import User, Course, Enrollment, UserRole, CourseMaterial
from schemas.course import CourseOut, EnrollmentOut, ProgressUpdate, CourseCreate, CourseUpdate, CourseMaterialCreate, CourseMaterialOut
from middleware.auth import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.get("/", response_model=List[CourseOut])
def get_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all published courses.
    """
    courses = db.query(Course).filter(Course.is_published == True).offset(skip).limit(limit).all()
    return courses

@router.get("/me/enrollments", response_model=List[EnrollmentOut])
def get_my_enrollments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all enrollments for the current user.
    """
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    return enrollments

@router.get("/{course_id}", response_model=CourseOut)
def get_course(course_id: UUID, db: Session = Depends(get_db)):
    """
    Get a specific course by ID.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new course (Teacher/Admin only)
    """
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Not authorized to create courses")
        
    course = Course(
        teacher_id=current_user.id,
        title=course_data.title,
        description=course_data.description,
        category=course_data.category,
        difficulty=course_data.difficulty,
        syllabus=course_data.syllabus,
        is_published=course_data.is_published,
        thumbnail_url=course_data.thumbnail_url
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

@router.post("/{course_id}/enroll", response_model=EnrollmentOut)
def enroll_in_course(
    course_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Enroll the current user in a course.
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    enrollment = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == course_id
    ).first()
    
    if enrollment:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")
        
    new_enrollment = Enrollment(
        student_id=current_user.id,
        course_id=course_id,
        progress=0.0
    )
    
    course.enrollment_count += 1
    
    db.add(new_enrollment)
    try:
        db.commit()
        db.refresh(new_enrollment)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error creating enrollment")
        
    return new_enrollment

@router.put("/enrollments/{enrollment_id}/progress", response_model=EnrollmentOut)
def update_progress(
    enrollment_id: UUID,
    progress_update: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update progress for a specific enrollment.
    """
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.student_id == current_user.id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
        
    # Clamp progress between 0 and 100
    enrollment.progress = max(0.0, min(100.0, progress_update.progress))
    
    if enrollment.progress >= 100.0 and not enrollment.completed_at:
        enrollment.completed_at = datetime.utcnow()
        
    db.commit()
    db.refresh(enrollment)
    
    return enrollment

@router.put("/{course_id}", response_model=CourseOut)
def update_course(
    course_id: UUID,
    course_data: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a course's metadata (Teacher/Admin only)
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")
        
    for key, value in course_data.model_dump(exclude_unset=True).items():
        setattr(course, key, value)
        
    db.commit()
    db.refresh(course)
    return course

@router.post("/{course_id}/materials", response_model=CourseMaterialOut, status_code=status.HTTP_201_CREATED)
def create_material(
    course_id: UUID,
    material_data: CourseMaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Add a new lesson/material to a course (Teacher/Admin only)
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add lessons to this course")
        
    material = CourseMaterial(
        course_id=course_id,
        title=material_data.title,
        description=material_data.description,
        file_url=material_data.file_url,
        file_type=material_data.file_type,
        content=material_data.content,
        order=material_data.order
    )
    db.add(material)
    db.commit()
    db.refresh(material)
    return material

@router.delete("/materials/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(
    material_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a course material/lesson (Teacher/Admin only)
    """
    material = db.query(CourseMaterial).filter(CourseMaterial.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
        
    course = db.query(Course).filter(Course.id == material.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if current_user.role != UserRole.ADMIN and course.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete lessons from this course")
        
    db.delete(material)
    db.commit()
    return None
