from typing import List, Union, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "Translation API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000"
    CORS_METHODS: str = "GET,POST,PUT,DELETE,OPTIONS"
    CORS_HEADERS: str = "Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers"
    CORS_CREDENTIALS: bool = True
    CORS_MAX_AGE: int = 600  # 10 minutes

    # Database
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: dict) -> any:
        if isinstance(v, str):
            return v
        return f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}"

    # Redis
    REDIS_HOST: str
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Union[str, None] = None

    # OpenAI
    OPENAI_API_KEY: str

    # AWS
    AWS_ACCESS_KEY_ID: str
    AWS_SECRET_ACCESS_KEY: str
    AWS_REGION: str = "us-west-2"

    # Stripe
    STRIPE_API_KEY: str
    STRIPE_WEBHOOK_SECRET: str

    # Paddle
    PADDLE_API_KEY: str
    PADDLE_WEBHOOK_SECRET: str
    PADDLE_VENDOR_ID: str

    class Config:
        case_sensitive = True
        env_file = ".env"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.SQLALCHEMY_DATABASE_URI:
            self.SQLALCHEMY_DATABASE_URI = (
                f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
                f"@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
            )

settings = Settings() 