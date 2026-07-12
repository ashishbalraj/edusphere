from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
from models import Difficulty, QuizQuestionType, NoteStyle, FileType, AIModuleType


class CourseCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Difficulty = Difficulty.BEGINNER
    syllabus: Optional[str] = None


class CourseResponse(BaseModel):
    id: uuid.UUID
    teacher_id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Difficulty
    thumbnail_url: Optional[str] = None
    is_published: bool
    enrollment_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class CourseUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[Difficulty] = None
    syllabus: Optional[str] = None
    is_published: Optional[bool] = None


class AssignmentCreate(BaseModel):
    course_id: uuid.UUID
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    instructions: Optional[str] = None
    due_date: Optional[datetime] = None
    max_score: int = 100


class AssignmentResponse(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    teacher_id: uuid.UUID
    title: str
    description: Optional[str] = None
    due_date: Optional[datetime] = None
    max_score: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True


class QuizCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    course_id: Optional[uuid.UUID] = None
    difficulty: Difficulty = Difficulty.BEGINNER
    time_limit: Optional[int] = None


class QuizQuestionCreate(BaseModel):
    question_type: QuizQuestionType
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: str
    explanation: Optional[str] = None
    points: int = 1


class QuizResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    difficulty: Difficulty
    time_limit: Optional[int] = None
    is_ai_generated: bool
    created_at: datetime

    class Config:
        from_attributes = True


class AIConversationCreate(BaseModel):
    module_type: AIModuleType
    title: Optional[str] = "New Conversation"
    subject: Optional[str] = None


class AIConversationResponse(BaseModel):
    id: uuid.UUID
    module_type: AIModuleType
    title: str
    subject: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AIMessageCreate(BaseModel):
    content: str = Field(..., min_length=1)


class AIMessageResponse(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    role: str
    content: str
    message_metadata: Optional[dict] = Field(None, serialization_alias="metadata")
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentUploadResponse(BaseModel):
    id: uuid.UUID
    filename: str
    file_url: str
    file_type: FileType
    file_size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


class NoteGenerateRequest(BaseModel):
    document_id: uuid.UUID
    style: NoteStyle


class NoteResponse(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    style: NoteStyle
    title: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True


class FlashcardDeckCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    subject: Optional[str] = None


class FlashcardCreate(BaseModel):
    front: str = Field(..., min_length=1)
    back: str = Field(..., min_length=1)


class FlashcardDeckResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    card_count: int
    mastered_count: int
    is_ai_generated: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: uuid.UUID
    title: str
    message: str
    type: str
    is_read: bool
    link: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
