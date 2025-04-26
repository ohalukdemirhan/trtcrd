from datetime import datetime, timedelta
from typing import Any, Union
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings
import redis.asyncio as redis

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(
    subject: Union[str, Any], expires_delta: timedelta = None
) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

class RateLimiter:
    def __init__(self):
        self._redis = None

    async def _get_redis(self):
        if self._redis is None:
            # Build Redis URL with password only if it's set
            redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
            connection_kwargs = {
                "decode_responses": True,
            }
            if settings.REDIS_PASSWORD:
                connection_kwargs["password"] = settings.REDIS_PASSWORD
            
            try:
                self._redis = redis.from_url(
                    redis_url,
                    **connection_kwargs
                )
                # Test the connection
                await self._redis.ping()
            except Exception as e:
                # If authentication fails, try without password
                if "AUTH" in str(e):
                    self._redis = redis.from_url(
                        redis_url,
                        decode_responses=True
                    )
                    await self._redis.ping()
                else:
                    raise
        return self._redis

    async def check_rate_limit(self, user_id: int, limit: int) -> bool:
        """
        Check if user has exceeded their rate limit
        """
        redis = await self._get_redis()
        key = f"rate_limit:{user_id}"
        current = await redis.get(key)
        
        if not current:
            await redis.set(key, 1, ex=86400)  # 24 hours
            return True
            
        current = int(current)
        if current >= limit:
            return False
            
        await redis.incr(key)
        return True

class SecurityScopes:
    """Security scopes for different API endpoints"""
    ADMIN = ["admin"]
    USER = ["user"]
    TRANSLATION = ["translation"]
    COMPLIANCE = ["compliance"]
    SUBSCRIPTION = ["subscription"]

    @staticmethod
    def get_required_scopes(user_role: str) -> list[str]:
        """Get required scopes based on user role"""
        if user_role == "admin":
            return SecurityScopes.ADMIN + SecurityScopes.USER
        return SecurityScopes.USER 