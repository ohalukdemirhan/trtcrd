from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.models import UserRole, SubscriptionTier
from enum import Enum

# Base Schemas
class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

# Subscription Schemas
class SubscriptionBase(BaseSchema):
    tier: Optional[SubscriptionTier] = None
    monthly_requests_limit: Optional[int] = None
    is_active: Optional[bool] = None
    payment_method: Optional[str] = None

    @validator('tier')
    def validate_tier(cls, v):
        if v and not isinstance(v, SubscriptionTier):
            try:
                return SubscriptionTier(v)
            except ValueError:
                raise ValueError(f'Invalid subscription tier. Must be one of: {", ".join([t.value for t in SubscriptionTier])}')
        return v

class SubscriptionCreate(SubscriptionBase):
    user_id: int
    tier: SubscriptionTier

class SubscriptionUpdate(SubscriptionBase):
    pass

class Subscription(SubscriptionBase):
    id: int
    user_id: int
    current_requests_count: int
    stripe_customer_id: Optional[str] = None
    paddle_customer_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    meta_data: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)

# User Schemas
class UserBase(BaseSchema):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    company_name: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None

    @validator('role')
    def validate_role(cls, v):
        if v and not isinstance(v, UserRole):
            try:
                return UserRole(v)
            except ValueError:
                raise ValueError(f'Invalid user role. Must be one of: {", ".join([r.value for r in UserRole])}')
        return v

class UserCreate(UserBase):
    email: EmailStr
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    subscription: Optional[Subscription] = None

    model_config = ConfigDict(from_attributes=True)

class User(UserResponse):
    hashed_password: str

# Translation Schemas
class TranslationBase(BaseSchema):
    source_text: str
    source_lang: str
    target_lang: str
    context: Optional[Dict[str, Any]] = None

class TranslationCreate(TranslationBase):
    pass

class TranslationUpdate(BaseSchema):
    context: Optional[Dict[str, Any]] = None

class Translation(TranslationBase):
    id: int
    user_id: int
    translated_text: str
    created_at: datetime
    updated_at: datetime
    metadata: Optional[Dict[str, Any]] = None

# Compliance Schemas
class ComplianceRuleBase(BaseSchema):
    name: str
    description: Optional[str] = None
    rule_type: str
    parameters: Dict[str, Any]

class ComplianceTemplateBase(BaseSchema):
    name: str
    description: Optional[str] = None
    category: str
    rules: List[ComplianceRuleBase]
    version: str

class ComplianceTemplateCreate(ComplianceTemplateBase):
    pass

class ComplianceTemplate(ComplianceTemplateBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    metadata: Optional[Dict[str, Any]] = None

class ComplianceCheckResult(BaseSchema):
    is_compliant: bool
    validation_result: Dict[str, Any]
    suggestions: List[str]

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[int] = None

# API Response Schemas
class TranslationResponse(BaseSchema):
    translation: Translation
    compliance_check: Optional[ComplianceCheckResult] = None

class ErrorResponse(BaseSchema):
    detail: str
    error_code: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None 