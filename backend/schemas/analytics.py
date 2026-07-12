from pydantic import BaseModel
from typing import List, Optional

class StudyActivityPoint(BaseModel):
    label: str
    hours: float

class SubjectPerformancePoint(BaseModel):
    subject: str
    score: float

class StudentAnalyticsOverview(BaseModel):
    total_study_hours: float
    avg_assessment_score: float
    courses_completed: int
    current_streak: int
    
    study_activity: List[StudyActivityPoint]
    performance_by_subject: List[SubjectPerformancePoint]
