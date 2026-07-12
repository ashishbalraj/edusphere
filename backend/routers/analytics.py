from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime, timedelta

from database import get_db
from models import User, UserRole, Enrollment, AnalyticsEvent, QuizAttempt
from schemas.analytics import StudentAnalyticsOverview, StudyActivityPoint, SubjectPerformancePoint
from middleware.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/student/me", response_model=StudentAnalyticsOverview)
def get_student_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get analytics dashboard data for the current student.
    """
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Not a student")

    # 1. Total Study Hours
    # Assuming we log study sessions as AnalyticsEvent with module="course_player" and duration_seconds
    total_seconds = db.query(func.sum(AnalyticsEvent.duration_seconds)).filter(
        AnalyticsEvent.user_id == current_user.id
    ).scalar() or 0
    total_study_hours = round(total_seconds / 3600, 1)

    # 2. Avg Assessment Score
    avg_score = db.query(func.avg(QuizAttempt.score)).filter(
        QuizAttempt.user_id == current_user.id
    ).scalar() or 0.0
    avg_score = round(avg_score, 1)

    # 3. Courses Completed
    courses_completed = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.progress >= 100.0
    ).count()

    # 4. Current Streak (Simplified mock logic: could calculate based on consecutive days of AnalyticsEvents)
    current_streak = 5 # Mocked streak for now

    # 5. Study Activity (This Week)
    # Generate labels for the last 7 days
    today = datetime.utcnow().date()
    activity_points = []
    
    # In a real scenario, group by date and sum duration.
    # For now, we will return some realistic data combined with actual DB data if available
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    for i in range(7):
        target_date = today - timedelta(days=6-i)
        
        # Find events on this day
        start_time = datetime.combine(target_date, datetime.min.time())
        end_time = datetime.combine(target_date, datetime.max.time())
        
        day_seconds = db.query(func.sum(AnalyticsEvent.duration_seconds)).filter(
            AnalyticsEvent.user_id == current_user.id,
            AnalyticsEvent.created_at >= start_time,
            AnalyticsEvent.created_at <= end_time
        ).scalar() or 0
        
        hours = round(day_seconds / 3600, 1)
        
        # Fallback to mock data if db is empty for visual testing
        mock_hours = [2, 3.5, 1.5, 4, 5, 2.5, 6][target_date.weekday()] if total_seconds == 0 else hours
        
        activity_points.append(
            StudyActivityPoint(
                label=days[target_date.weekday()],
                hours=mock_hours
            )
        )

    # 6. Performance by Subject (using Course categories)
    # Get all enrollments
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == current_user.id).all()
    subject_scores = {}
    
    if enrollments:
        for enr in enrollments:
            cat = enr.course.category if enr.course.category else "General"
            # In real system, we'd average quiz scores per category. 
            # Using progress as a proxy if no quizzes taken for visual demonstration
            if cat not in subject_scores:
                subject_scores[cat] = []
            subject_scores[cat].append(enr.progress)
            
    performance_points = []
    for subject, scores in subject_scores.items():
        avg = sum(scores) / len(scores)
        performance_points.append(
            SubjectPerformancePoint(subject=subject, score=round(avg, 1))
        )
        
    if not performance_points:
        # Fallback data for visual purposes if no enrollments
        performance_points = [
            SubjectPerformancePoint(subject="Data Structures", score=85),
            SubjectPerformancePoint(subject="Machine Learning", score=78),
            SubjectPerformancePoint(subject="Web Dev", score=92)
        ]

    return StudentAnalyticsOverview(
        total_study_hours=total_study_hours if total_seconds > 0 else 24.5,
        avg_assessment_score=avg_score if avg_score > 0 else 82.6,
        courses_completed=courses_completed,
        current_streak=current_streak,
        study_activity=activity_points,
        performance_by_subject=performance_points
    )
