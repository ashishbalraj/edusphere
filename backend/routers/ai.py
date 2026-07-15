from fastapi import APIRouter, Depends, HTTPException, status
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from sqlalchemy import select
from database import get_db
from models import AIConversation, AIMessage, User
from schemas.core import (
    AIConversationCreate, AIConversationResponse,
    AIMessageCreate, AIMessageResponse,
)
from middleware.auth import get_current_user
# pyrefly: ignore [missing-import]
import google.generativeai as genai
from config import settings

if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/conversations", response_model=AIConversationResponse, status_code=status.HTTP_201_CREATED)
def create_conversation(
    data: AIConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = AIConversation(
        user_id=current_user.id,
        module_type=data.module_type,
        title=data.title,
        subject=data.subject,
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("/conversations", response_model=list[AIConversationResponse])
def list_conversations(
    module_type: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = select(AIConversation).where(AIConversation.user_id == current_user.id)
    if module_type:
        query = query.where(AIConversation.module_type == module_type)
    query = query.order_by(AIConversation.updated_at.desc())
    result = db.execute(query)
    return result.scalars().all()


@router.get("/conversations/{conversation_id}/messages", response_model=list[AIMessageResponse])
def get_messages(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = db.execute(
        select(AIConversation).where(
            AIConversation.id == conversation_id,
            AIConversation.user_id == current_user.id,
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    messages_result = db.execute(
        select(AIMessage)
        .where(AIMessage.conversation_id == conversation_id)
        .order_by(AIMessage.created_at.asc())
    )
    return messages_result.scalars().all()


@router.post("/conversations/{conversation_id}/messages", response_model=AIMessageResponse)
def send_message(
    conversation_id: str,
    data: AIMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = db.execute(
        select(AIConversation).where(
            AIConversation.id == conversation_id,
            AIConversation.user_id == current_user.id,
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    user_message = AIMessage(
        conversation_id=conversation_id,
        role="user",
        content=data.content,
    )
    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    try:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured")
        
        # Get conversation history for Gemini
        messages_result = db.execute(
            select(AIMessage)
            .where(AIMessage.conversation_id == conversation_id)
            .order_by(AIMessage.created_at.asc())
        )
        history = messages_result.scalars().all()
        
        gemini_history = []
        for msg in history:
            if msg.id == user_message.id: continue # skip the one we just added because we send it below
            role = "user" if msg.role == "user" else "model"
            gemini_history.append({"role": role, "parts": [msg.content]})
            
        model = genai.GenerativeModel('gemini-3.1-flash-lite')
        chat = model.start_chat(history=gemini_history)
        
        system_prompt = f"You are an AI assistant in EduSphere, an intelligent learning platform. You are currently acting as a {conversation.module_type}. Context about the conversation: Title - {conversation.title}, Subject - {conversation.subject}. Be helpful, concise, and educational."
        
        response = chat.send_message(f"System Context: {system_prompt}\n\nUser Message: {data.content}")
        ai_response_text = response.text
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        ai_response_text = f"I'm sorry, but I encountered an error connecting to the AI: {str(e)}"

    ai_message = AIMessage(
        conversation_id=conversation_id,
        role="assistant",
        content=ai_response_text,
    )
    db.add(ai_message)
    db.commit()
    db.refresh(ai_message)

    return ai_message


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = db.execute(
        select(AIConversation).where(
            AIConversation.id == conversation_id,
            AIConversation.user_id == current_user.id,
        )
    )
    conversation = result.scalar_one_or_none()
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    db.delete(conversation)
    db.commit()
