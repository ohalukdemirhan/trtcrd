from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session, joinedload
from app.core.config import settings
from app.core.security import RateLimiter
from app.db.session import SessionLocal
from app.models.models import User, Subscription, SubscriptionTier
import aioredis

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_db() -> Generator:
    """
    Database session dependency
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

async def get_redis() -> aioredis.Redis:
    """
    Redis client dependency
    """
    # Build Redis URL with password only if it's set
    redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
    connection_kwargs = {
        "decode_responses": True,
    }
    if settings.REDIS_PASSWORD:
        connection_kwargs["password"] = settings.REDIS_PASSWORD
    
    try:
        redis = await aioredis.from_url(
            redis_url,
            **connection_kwargs
        )
        # Test the connection
        await redis.ping()
    except Exception as e:
        # If authentication fails, try without password
        if "AUTH" in str(e):
            redis = await aioredis.from_url(
                redis_url,
                decode_responses=True
            )
            await redis.ping()
        else:
            raise
    try:
        yield redis
    finally:
        await redis.close()

def get_rate_limiter() -> RateLimiter:
    """
    Rate limiter dependency
    """
    return RateLimiter()

async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Get current authenticated user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Query user with subscription joined
    user = db.query(User).options(joinedload(User.subscription)).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )

    # Create default subscription if none exists
    if user.subscription is None:
        subscription = Subscription(
            user_id=user.id,
            tier=SubscriptionTier.FREE,
            monthly_requests_limit=100,  # Default limit for free tier
            current_requests_count=0,
            is_active=True
        )
        db.add(subscription)
        db.commit()
        db.refresh(user)

    return user

def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current authenticated superuser
    """
    if not current_user.role == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user 