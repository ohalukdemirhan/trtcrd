from sqlalchemy import String, Integer, ForeignKey, JSON, Boolean, Enum, Text
from sqlalchemy.orm import relationship, Mapped, mapped_column
import enum
from typing import Optional, List
from .base import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class SubscriptionTier(str, enum.Enum):
    FREE = "free"
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.USER)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(255))
    
    # Relationships
    translations: Mapped[List["Translation"]] = relationship("Translation", back_populates="user")
    subscription: Mapped[Optional["Subscription"]] = relationship("Subscription", back_populates="user", uselist=False)

class Translation(Base):
    __tablename__ = "translations"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    source_text: Mapped[str] = mapped_column(Text, nullable=False)
    translated_text: Mapped[str] = mapped_column(Text, nullable=False)
    source_lang: Mapped[str] = mapped_column(String(2), nullable=False)
    target_lang: Mapped[str] = mapped_column(String(2), nullable=False)
    context: Mapped[Optional[dict]] = mapped_column(JSON)
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="translations")
    compliance_checks: Mapped[List["ComplianceCheck"]] = relationship("ComplianceCheck", back_populates="translation")

class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    id: Mapped[int] = mapped_column(primary_key=True)
    translation_id: Mapped[int] = mapped_column(ForeignKey("translations.id"))
    rule_set: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_compliant: Mapped[bool] = mapped_column(Boolean, default=False)
    validation_result: Mapped[Optional[dict]] = mapped_column(JSON)
    suggestions: Mapped[Optional[dict]] = mapped_column(JSON)
    
    # Relationships
    translation: Mapped["Translation"] = relationship("Translation", back_populates="compliance_checks")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    tier: Mapped[SubscriptionTier] = mapped_column(Enum(SubscriptionTier), default=SubscriptionTier.FREE)
    stripe_customer_id: Mapped[Optional[str]] = mapped_column(String(255))
    paddle_customer_id: Mapped[Optional[str]] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    monthly_requests_limit: Mapped[Optional[int]] = mapped_column(Integer)
    current_requests_count: Mapped[int] = mapped_column(Integer, default=0)
    payment_method: Mapped[Optional[str]] = mapped_column(String(50))
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="subscription")

class ComplianceTemplate(Base):
    __tablename__ = "compliance_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    rules: Mapped[dict] = mapped_column(JSON, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    category: Mapped[Optional[str]] = mapped_column(String(100))  # e.g., 'GDPR', 'KVKK'
    version: Mapped[Optional[str]] = mapped_column(String(50))
    meta_data: Mapped[Optional[dict]] = mapped_column(JSON) 