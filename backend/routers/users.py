from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from database import get_db
from models import User, UserRole
from schemas.user import UserResponse, UserUpdate, PaginatedResponse
from middleware.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=dict)
def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    role: UserRole = None,
    search: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    query = select(User)
    count_query = select(func.count(User.id))

    if role:
        query = query.where(User.role == role)
        count_query = count_query.where(User.role == role)
    if search:
        query = query.where(
            User.full_name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )
        count_query = count_query.where(
            User.full_name.ilike(f"%{search}%") | User.email.ilike(f"%{search}%")
        )

    total_result = db.execute(count_query)
    total = total_result.scalar()

    query = query.offset((page - 1) * per_page).limit(per_page).order_by(User.created_at.desc())
    result = db.execute(query)
    users = result.scalars().all()

    return {
        "items": [UserResponse.model_validate(u) for u in users],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page,
    }


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.patch("/me", response_model=UserResponse)
def update_profile(
    update_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if update_data.full_name is not None:
        current_user.full_name = update_data.full_name
    if update_data.avatar_url is not None:
        current_user.avatar_url = update_data.avatar_url
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin_user),
):
    result = db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.is_active = False
    db.commit()
