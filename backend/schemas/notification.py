from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum
from uuid import UUID

class NotificationType(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"
    REMINDER = "reminder"

class NotificationBase(BaseModel):
    title: str
    message: str
    type: NotificationType = NotificationType.INFO
    link: Optional[str] = None

class NotificationCreate(NotificationBase):
    pass

class NotificationOut(NotificationBase):
    id: UUID
    user_id: UUID
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
