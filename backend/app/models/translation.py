from sqlalchemy import Column, String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base

class TranslationStatus(str, enum.Enum):
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    IN_PROGRESS = "IN_PROGRESS"

class Translation(Base):
    __tablename__ = "translations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    source_language = Column(String, nullable=False)
    target_language = Column(String, nullable=False)
    source_text = Column(Text, nullable=False)
    translated_text = Column(Text)
    status = Column(Enum(TranslationStatus), default=TranslationStatus.IN_PROGRESS)
    error_message = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="translations") 