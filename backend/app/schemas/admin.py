from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    subscription_stats: Dict[str, int]
    total_translations: int
    recent_translations: List[dict]

class SubscriptionUpdate(BaseModel):
    status: Optional[str]
    tier: Optional[str]
    end_date: Optional[datetime]

class ComplianceTemplateBase(BaseModel):
    name: str
    description: str
    content: str
    is_active: bool = True

class ComplianceTemplateCreate(ComplianceTemplateBase):
    pass

class ComplianceTemplateUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    content: Optional[str]
    is_active: Optional[bool]

class ComplianceTemplate(ComplianceTemplateBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 