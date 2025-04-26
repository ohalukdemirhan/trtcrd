from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Optional
from datetime import datetime, timedelta

from app.core.auth import get_current_active_user, get_current_admin_user
from app.core.database import get_db
from app.models.user import User
from app.models.subscription import Subscription
from app.models.translation import Translation
from app.models.compliance import ComplianceTemplate
from app.schemas.admin import (
    DashboardStats,
    SubscriptionUpdate,
    ComplianceTemplateCreate,
    ComplianceTemplateUpdate,
)

router = APIRouter()

@router.get("/dashboard/stats", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get dashboard statistics for admin panel."""
    # Get user statistics
    total_users = db.query(func.count(User.id)).scalar()
    active_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar()

    # Get subscription statistics
    subscription_stats = (
        db.query(
            Subscription.tier,
            func.count(Subscription.id).label('count')
        )
        .group_by(Subscription.tier)
        .all()
    )
    subscription_counts = {tier: count for tier, count in subscription_stats}

    # Get translation statistics
    total_translations = db.query(func.count(Translation.id)).scalar()
    recent_translations = (
        db.query(Translation)
        .order_by(Translation.created_at.desc())
        .limit(5)
        .all()
    )

    return {
        "total_users": total_users,
        "active_users": active_users,
        "subscription_stats": subscription_counts,
        "total_translations": total_translations,
        "recent_translations": recent_translations
    }

@router.get("/subscriptions")
async def get_subscriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all subscriptions with pagination."""
    subscriptions = (
        db.query(Subscription)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return subscriptions

@router.patch("/subscriptions/{subscription_id}")
async def update_subscription(
    subscription_id: str,
    update_data: SubscriptionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update subscription status."""
    subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(subscription, field, value)

    db.commit()
    db.refresh(subscription)
    return subscription

@router.get("/translations")
async def get_translations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user),
    skip: int = 0,
    limit: int = 100
):
    """Get all translations with pagination."""
    translations = (
        db.query(Translation)
        .order_by(Translation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    total = db.query(func.count(Translation.id)).scalar()
    
    return {
        "translations": translations,
        "total": total,
        "page": skip // limit + 1,
        "totalPages": (total + limit - 1) // limit
    }

@router.get("/compliance/templates")
async def get_compliance_templates(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all compliance templates."""
    templates = db.query(ComplianceTemplate).all()
    return templates

@router.post("/compliance/templates")
async def create_compliance_template(
    template: ComplianceTemplateCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new compliance template."""
    db_template = ComplianceTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.put("/compliance/templates/{template_id}")
async def update_compliance_template(
    template_id: str,
    template: ComplianceTemplateUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a compliance template."""
    db_template = db.query(ComplianceTemplate).filter(ComplianceTemplate.id == template_id).first()
    if not db_template:
        raise HTTPException(status_code=404, detail="Template not found")

    for field, value in template.dict(exclude_unset=True).items():
        setattr(db_template, field, value)

    db.commit()
    db.refresh(db_template)
    return db_template

@router.patch("/compliance/templates/{template_id}")
async def toggle_compliance_template(
    template_id: str,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Toggle a compliance template's active status."""
    db_template = db.query(ComplianceTemplate).filter(ComplianceTemplate.id == template_id).first()
    if not db_template:
        raise HTTPException(status_code=404, detail="Template not found")

    db_template.is_active = is_active
    db.commit()
    db.refresh(db_template)
    return db_template 