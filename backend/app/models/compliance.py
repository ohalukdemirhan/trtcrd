from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
import uuid

from app.core.database import Base

class ComplianceTemplate(Base):
    __tablename__ = "compliance_templates"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(String)
    content = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now()) 