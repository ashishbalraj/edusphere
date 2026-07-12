import uuid
from datetime import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import (
    Column, String, Text, Boolean, Integer, Float,
    DateTime, ForeignKey, Enum as SAEnum, JSON, Index, UniqueConstraint
)
# pyrefly: ignore [missing-import]
from sqlalchemy.dialects.postgresql import UUID
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import relationship
from database import Base
import enum


# ──────────────────────────── Enums ────────────────────────────

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"
    ADMIN = "admin"


class Difficulty(str, enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class QuizQuestionType(str, enum.Enum):
    MCQ = "mcq"
    TRUE_FALSE = "true_false"
    SHORT_ANSWER = "short_answer"
    LONG_ANSWER = "long_answer"


class NoteStyle(str, enum.Enum):
    SUMMARY = "summary"
    DETAILED = "detailed"
    BULLET = "bullet"
    REVISION = "revision"


class FileType(str, enum.Enum):
    PDF = "pdf"
    DOCX = "docx"
    PPTX = "pptx"


class NotificationType(str, enum.Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    REMINDER = "reminder"


class AIModuleType(str, enum.Enum):
    TUTOR = "tutor"
    CHAT_PDF = "chat_pdf"
    NOTES = "notes"
    QUIZ = "quiz"
    FLASHCARD = "flashcard"
    STUDY_PLANNER = "study_planner"
    ASSIGNMENT = "assignment"
    CODING_MENTOR = "coding_mentor"
    RESUME = "resume"
    CAREER = "career"
    MOCK_INTERVIEW = "mock_interview"
    PROJECT_RECOMMENDATION = "project_recommendation"
    RESEARCH = "research"


class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"


class InterviewType(str, enum.Enum):
    TECHNICAL = "technical"
    HR = "hr"
    BEHAVIORAL = "behavioral"


class PlanType(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    EXAM = "exam"


class TaskPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


# ──────────────────────────── 1. Users ────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)
    full_name = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.STUDENT)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    google_id = Column(String(255), unique=True, nullable=True)
    otp_code = Column(String(6), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    courses_teaching = relationship("Course", back_populates="teacher", foreign_keys="Course.teacher_id")
    enrollments = relationship("Enrollment", back_populates="student", foreign_keys="Enrollment.student_id")
    assignments_created = relationship("Assignment", back_populates="teacher", foreign_keys="Assignment.teacher_id")
    submissions = relationship("AssignmentSubmission", back_populates="student")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")
    ai_conversations = relationship("AIConversation", back_populates="user", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="user", cascade="all, delete-orphan")
    generated_notes = relationship("GeneratedNote", back_populates="user")
    flashcard_decks = relationship("FlashcardDeck", back_populates="user", cascade="all, delete-orphan")
    study_plans = relationship("StudyPlan", back_populates="user", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    career_profile = relationship("CareerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    mock_interviews = relationship("MockInterview", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    analytics_events = relationship("AnalyticsEvent", back_populates="user", cascade="all, delete-orphan")
    feedback_given = relationship("Feedback", back_populates="user")


# ──────────────────────────── 2. User Profiles ────────────────────────────

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    phone = Column(String(20), nullable=True)
    bio = Column(Text, nullable=True)
    institution = Column(String(255), nullable=True)
    grade_level = Column(String(50), nullable=True)
    department = Column(String(255), nullable=True)
    subjects = Column(JSON, default=list)
    skills = Column(JSON, default=list)
    interests = Column(JSON, default=list)
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


# ──────────────────────────── 3. Courses ────────────────────────────

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True, index=True)
    difficulty = Column(SAEnum(Difficulty), default=Difficulty.BEGINNER)
    thumbnail_url = Column(String(500), nullable=True)
    syllabus = Column(Text, nullable=True)
    is_published = Column(Boolean, default=False)
    enrollment_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    teacher = relationship("User", back_populates="courses_teaching", foreign_keys=[teacher_id])
    enrollments = relationship("Enrollment", back_populates="course", cascade="all, delete-orphan")
    materials = relationship("CourseMaterial", back_populates="course", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="course", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="course")
    attendance_records = relationship("Attendance", back_populates="course")

    __table_args__ = (
        Index("ix_courses_category_published", "category", "is_published"),
    )


# ──────────────────────────── 4. Enrollments ────────────────────────────

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    progress = Column(Float, default=0.0)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    student = relationship("User", back_populates="enrollments", foreign_keys=[student_id])
    course = relationship("Course", back_populates="enrollments")

    __table_args__ = (
        UniqueConstraint("student_id", "course_id", name="uq_enrollment_student_course"),
    )


# ──────────────────────────── 5. Course Materials ────────────────────────────

class CourseMaterial(Base):
    __tablename__ = "course_materials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    file_type = Column(SAEnum(FileType), nullable=True)
    content = Column(Text, nullable=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="materials")


# ──────────────────────────── 6. Assignments ────────────────────────────

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    max_score = Column(Integer, default=100)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    course = relationship("Course", back_populates="assignments")
    teacher = relationship("User", back_populates="assignments_created", foreign_keys=[teacher_id])
    submissions = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


# ──────────────────────────── 7. Assignment Submissions ────────────────────────────

class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assignment_id = Column(UUID(as_uuid=True), ForeignKey("assignments.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    content = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    graded_at = Column(DateTime, nullable=True)

    assignment = relationship("Assignment", back_populates="submissions")
    student = relationship("User", back_populates="submissions")

    __table_args__ = (
        UniqueConstraint("assignment_id", "student_id", name="uq_submission_assignment_student"),
    )


# ──────────────────────────── 8. Quizzes ────────────────────────────

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id"), nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    difficulty = Column(SAEnum(Difficulty), default=Difficulty.BEGINNER)
    time_limit = Column(Integer, nullable=True)
    is_ai_generated = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="quizzes")
    creator = relationship("User", foreign_keys=[created_by])
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="quiz", cascade="all, delete-orphan")


# ──────────────────────────── 9. Quiz Questions ────────────────────────────

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    question_type = Column(SAEnum(QuizQuestionType), nullable=False)
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    points = Column(Integer, default=1)
    order = Column(Integer, default=0)

    quiz = relationship("Quiz", back_populates="questions")
    responses = relationship("QuizResponse", back_populates="question", cascade="all, delete-orphan")


# ──────────────────────────── 10. Quiz Attempts ────────────────────────────

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    quiz_id = Column(UUID(as_uuid=True), ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    score = Column(Float, default=0)
    total_points = Column(Integer, default=0)
    time_taken = Column(Integer, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    quiz = relationship("Quiz", back_populates="attempts")
    student = relationship("User", back_populates="quiz_attempts")
    responses = relationship("QuizResponse", back_populates="attempt", cascade="all, delete-orphan")


# ──────────────────────────── 11. Quiz Responses ────────────────────────────

class QuizResponse(Base):
    __tablename__ = "quiz_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    attempt_id = Column(UUID(as_uuid=True), ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(UUID(as_uuid=True), ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False)
    answer = Column(Text, nullable=True)
    is_correct = Column(Boolean, nullable=True)
    points_earned = Column(Float, default=0)

    attempt = relationship("QuizAttempt", back_populates="responses")
    question = relationship("QuizQuestion", back_populates="responses")


# ──────────────────────────── 12. AI Conversations ────────────────────────────

class AIConversation(Base):
    __tablename__ = "ai_conversations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_type = Column(SAEnum(AIModuleType), nullable=False)
    title = Column(String(255), default="New Conversation")
    subject = Column(String(100), nullable=True)
    context = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="ai_conversations")
    messages = relationship("AIMessage", back_populates="conversation", cascade="all, delete-orphan", order_by="AIMessage.created_at")

    __table_args__ = (
        Index("ix_ai_conversations_user_module", "user_id", "module_type"),
    )


# ──────────────────────────── 13. AI Messages ────────────────────────────

class AIMessage(Base):
    __tablename__ = "ai_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    message_metadata = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("AIConversation", back_populates="messages")


# ──────────────────────────── 14. Documents ────────────────────────────

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_type = Column(SAEnum(FileType), nullable=False)
    file_size = Column(Integer, default=0)
    extracted_text = Column(Text, nullable=True)
    vector_store_id = Column(String(255), nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")
    notes = relationship("GeneratedNote", back_populates="document", cascade="all, delete-orphan")


# ──────────────────────────── 15. Generated Notes ────────────────────────────

class GeneratedNote(Base):
    __tablename__ = "generated_notes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    style = Column(SAEnum(NoteStyle), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    document = relationship("Document", back_populates="notes")
    user = relationship("User", back_populates="generated_notes")


# ──────────────────────────── 16. Flashcard Decks ────────────────────────────

class FlashcardDeck(Base):
    __tablename__ = "flashcard_decks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), nullable=True)
    card_count = Column(Integer, default=0)
    mastered_count = Column(Integer, default=0)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="flashcard_decks")
    cards = relationship("Flashcard", back_populates="deck", cascade="all, delete-orphan")


# ──────────────────────────── 17. Flashcards ────────────────────────────

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deck_id = Column(UUID(as_uuid=True), ForeignKey("flashcard_decks.id", ondelete="CASCADE"), nullable=False, index=True)
    front = Column(Text, nullable=False)
    back = Column(Text, nullable=False)
    is_mastered = Column(Boolean, default=False)
    review_count = Column(Integer, default=0)
    last_reviewed = Column(DateTime, nullable=True)
    order = Column(Integer, default=0)

    deck = relationship("FlashcardDeck", back_populates="cards")


# ──────────────────────────── 18. Study Plans ────────────────────────────

class StudyPlan(Base):
    __tablename__ = "study_plans"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    plan_type = Column(SAEnum(PlanType), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="study_plans")
    tasks = relationship("StudyTask", back_populates="plan", cascade="all, delete-orphan")


# ──────────────────────────── 19. Study Tasks ────────────────────────────

class StudyTask(Base):
    __tablename__ = "study_tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("study_plans.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    subject = Column(String(100), nullable=True)
    scheduled_date = Column(DateTime, nullable=False)
    start_time = Column(String(10), nullable=True)
    end_time = Column(String(10), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    is_completed = Column(Boolean, default=False)
    priority = Column(SAEnum(TaskPriority), default=TaskPriority.MEDIUM)
    order = Column(Integer, default=0)

    plan = relationship("StudyPlan", back_populates="tasks")


# ──────────────────────────── 20. Resumes ────────────────────────────

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(JSON, nullable=False)
    ats_score = Column(Float, nullable=True)
    template = Column(String(50), default="professional")
    cover_letter = Column(Text, nullable=True)
    linkedin_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="resumes")


# ──────────────────────────── 21. Career Profiles ────────────────────────────

class CareerProfile(Base):
    __tablename__ = "career_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    current_skills = Column(JSON, default=list)
    target_role = Column(String(255), nullable=True)
    experience_level = Column(String(50), nullable=True)
    career_goals = Column(JSON, default=list)
    roadmap = Column(JSON, nullable=True)
    learning_path = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="career_profile")


# ──────────────────────────── 22. Mock Interviews ────────────────────────────

class MockInterview(Base):
    __tablename__ = "mock_interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    interview_type = Column(SAEnum(InterviewType), nullable=False)
    role = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True)
    questions = Column(JSON, nullable=True)
    answers = Column(JSON, nullable=True)
    score = Column(Float, nullable=True)
    feedback = Column(Text, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="mock_interviews")


# ──────────────────────────── 23. Notifications ────────────────────────────

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(SAEnum(NotificationType), default=NotificationType.INFO)
    is_read = Column(Boolean, default=False)
    link = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

    __table_args__ = (
        Index("ix_notifications_user_unread", "user_id", "is_read"),
    )


# ──────────────────────────── 24. Analytics Events ────────────────────────────

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    event_type = Column(String(100), nullable=False, index=True)
    module = Column(String(100), nullable=True)
    event_metadata = Column("metadata", JSON, nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analytics_events")

    __table_args__ = (
        Index("ix_analytics_user_event_date", "user_id", "event_type", "created_at"),
    )


# ──────────────────────────── 25. Attendance ────────────────────────────

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    date = Column(DateTime, nullable=False)
    status = Column(SAEnum(AttendanceStatus), nullable=False)
    marked_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    course = relationship("Course", back_populates="attendance_records")
    student = relationship("User", foreign_keys=[student_id])
    marker = relationship("User", foreign_keys=[marked_by])

    __table_args__ = (
        UniqueConstraint("course_id", "student_id", "date", name="uq_attendance_course_student_date"),
    )


# ──────────────────────────── 26. Parent-Student Links ────────────────────────────

class ParentStudentLink(Base):
    __tablename__ = "parent_student_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    parent = relationship("User", foreign_keys=[parent_id])
    student = relationship("User", foreign_keys=[student_id])

    __table_args__ = (
        UniqueConstraint("parent_id", "student_id", name="uq_parent_student_link"),
    )


# ──────────────────────────── 27. Feedback ────────────────────────────

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    category = Column(String(100), nullable=False)
    subject = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)
    status = Column(String(50), default="pending")
    admin_response = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedback_given")
