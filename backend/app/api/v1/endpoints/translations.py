from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api import deps
from app.core.security import RateLimiter
from app.schemas.schemas import (
    TranslationCreate,
    TranslationResponse,
    ComplianceCheckResult,
    User
)
from app.models.models import User as UserModel, Translation as TranslationModel
from app.services.translation import TranslationService
from fastapi import status

router = APIRouter()
translation_service = TranslationService()

@router.post("/", response_model=TranslationResponse)
async def create_translation(
    *,
    db: Session = Depends(deps.get_db),
    translation_in: TranslationCreate,
    current_user: User = Depends(deps.get_current_user),
    background_tasks: BackgroundTasks,
    rate_limiter: RateLimiter = Depends(deps.get_rate_limiter)
) -> TranslationResponse:
    """
    Create new translation with optional compliance check.
    """
    # Ensure user has an active subscription
    if not current_user.subscription or not current_user.subscription.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active subscription found. Please subscribe to use the translation service."
        )

    # Check rate limit
    monthly_limit = current_user.subscription.monthly_requests_limit or 100  # Default to 100 if not set
    if not await rate_limiter.check_rate_limit(current_user.id, monthly_limit):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please upgrade your subscription."
        )

    # Perform translation
    try:
        translation_result = await translation_service.translate(
            text=translation_in.source_text,
            source_lang=translation_in.source_lang,
            target_lang=translation_in.target_lang,
            context=translation_in.context
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # Create translation record
    db_translation = TranslationModel(
        user_id=current_user.id,
        source_text=translation_in.source_text,
        translated_text=translation_result["translated_text"],
        source_lang=translation_in.source_lang,
        target_lang=translation_in.target_lang,
        context=translation_in.context,
        metadata={"gpt_model": "gpt-4-turbo-preview"}
    )
    db.add(db_translation)
    
    # Perform compliance check in background if context includes compliance rules
    compliance_result = None
    if translation_in.context and "compliance_rules" in translation_in.context:
        background_tasks.add_task(
            translation_service.validate_cultural_compliance,
            text=translation_result["translated_text"],
            lang=translation_in.target_lang,
            compliance_rules=translation_in.context["compliance_rules"]
        )

    # Update user's request count
    if current_user.subscription:
        current_user.subscription.current_requests_count += 1
        db.commit()
    db.refresh(db_translation)

    return TranslationResponse(
        translation=db_translation,
        compliance_check=compliance_result
    )

@router.get("/{translation_id}", response_model=TranslationResponse)
async def get_translation(
    translation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
) -> TranslationResponse:
    """
    Get a specific translation by ID.
    """
    translation = db.query(TranslationModel).filter(
        TranslationModel.id == translation_id,
        TranslationModel.user_id == current_user.id
    ).first()
    
    if not translation:
        raise HTTPException(status_code=404, detail="Translation not found")
    
    return TranslationResponse(translation=translation)

@router.get("/", response_model=List[TranslationResponse])
async def list_translations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
) -> List[TranslationResponse]:
    """
    Retrieve translations for current user.
    """
    translations = db.query(TranslationModel).filter(
        TranslationModel.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [TranslationResponse(translation=t) for t in translations]

@router.delete("/{translation_id}")
async def delete_translation(
    translation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: UserModel = Depends(deps.get_current_user)
):
    """
    Delete a translation.
    """
    translation = db.query(TranslationModel).filter(
        TranslationModel.id == translation_id,
        TranslationModel.user_id == current_user.id
    ).first()
    
    if not translation:
        raise HTTPException(status_code=404, detail="Translation not found")
    
    db.delete(translation)
    db.commit()
    
    return {"status": "success", "message": "Translation deleted"} 