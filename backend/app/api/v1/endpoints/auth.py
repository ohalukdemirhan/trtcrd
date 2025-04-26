from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api import deps
from app.core.config import settings
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.models import User, Subscription
from app.schemas.schemas import Token, UserCreate, UserResponse

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.post("/register", response_model=UserResponse)
async def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate
) -> Any:
    """
    Register a new user with a default free subscription
    """
    # Check if user already exists
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        company_name=user_in.company_name
    )
    db.add(user)
    db.flush()  # Get the user ID without committing
    
    # Create default free subscription
    subscription = Subscription(
        user_id=user.id,
        tier="FREE",
        monthly_requests_limit=100,  # Free tier limit
        current_requests_count=0,
        is_active=True
    )
    db.add(subscription)
    
    # Commit both user and subscription
    db.commit()
    db.refresh(user)
    
    return user

@router.post("/test-token", response_model=UserResponse)
async def test_token(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Test access token
    """
    return current_user

@router.get("/me", response_model=UserResponse)
async def read_current_user(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get current user information
    """
    return current_user 