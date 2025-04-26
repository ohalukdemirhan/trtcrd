from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.api import deps
from app.core.security import SecurityScopes
from app.schemas.schemas import (
    ComplianceTemplate,
    ComplianceTemplateCreate,
    ComplianceCheckResult,
    User
)
from app.models.models import ComplianceTemplate as ComplianceTemplateModel

router = APIRouter()

# Pre-defined compliance templates
GDPR_TEMPLATE = {
    "name": "GDPR Compliance Template",
    "description": "General Data Protection Regulation compliance rules",
    "category": "GDPR",
    "version": "1.0",
    "rules": [
        {
            "name": "personal_data_processing",
            "description": "Check for personal data processing compliance",
            "rule_type": "content_check",
            "parameters": {
                "keywords": ["personal data", "private information", "sensitive data"],
                "requirements": [
                    "explicit consent",
                    "data minimization",
                    "purpose limitation"
                ]
            }
        },
        {
            "name": "data_subject_rights",
            "description": "Ensure data subject rights are respected",
            "rule_type": "rights_check",
            "parameters": {
                "rights": [
                    "right to access",
                    "right to rectification",
                    "right to erasure",
                    "right to data portability"
                ]
            }
        }
    ]
}

KVKK_TEMPLATE = {
    "name": "KVKK Compliance Template",
    "description": "Turkish Personal Data Protection Law compliance rules",
    "category": "KVKK",
    "version": "1.0",
    "rules": [
        {
            "name": "explicit_consent",
            "description": "Check for explicit consent requirements",
            "rule_type": "content_check",
            "parameters": {
                "keywords": ["kişisel veri", "özel nitelikli kişisel veri"],
                "requirements": [
                    "açık rıza",
                    "aydınlatma yükümlülüğü",
                    "veri işleme amacı"
                ]
            }
        },
        {
            "name": "data_transfer",
            "description": "Check for international data transfer compliance",
            "rule_type": "transfer_check",
            "parameters": {
                "transfer_requirements": [
                    "yeterli koruma",
                    "taahhütname",
                    "kurul izni"
                ]
            }
        }
    ]
}

@router.get("/templates", response_model=List[ComplianceTemplate])
async def list_compliance_templates(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[ComplianceTemplate]:
    """
    List all available compliance templates
    """
    templates = db.query(ComplianceTemplateModel).filter(
        ComplianceTemplateModel.is_active == True
    ).all()
    return templates

@router.get("/templates/{template_id}", response_model=ComplianceTemplate)
async def get_compliance_template(
    template_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> ComplianceTemplate:
    """
    Get a specific compliance template
    """
    template = db.query(ComplianceTemplateModel).filter(
        ComplianceTemplateModel.id == template_id,
        ComplianceTemplateModel.is_active == True
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return template

@router.post("/templates", response_model=ComplianceTemplate)
async def create_compliance_template(
    *,
    db: Session = Depends(deps.get_db),
    template_in: ComplianceTemplateCreate,
    current_user: User = Depends(deps.get_current_user)
) -> ComplianceTemplate:
    """
    Create a new compliance template (admin only)
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can create templates"
        )
    
    db_template = ComplianceTemplateModel(**template_in.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

@router.post("/check", response_model=ComplianceCheckResult)
async def check_compliance(
    *,
    db: Session = Depends(deps.get_db),
    text: str,
    template_id: int,
    current_user: User = Depends(deps.get_current_user)
) -> ComplianceCheckResult:
    """
    Check text compliance against a specific template
    """
    template = db.query(ComplianceTemplateModel).filter(
        ComplianceTemplateModel.id == template_id,
        ComplianceTemplateModel.is_active == True
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    # Here you would implement the actual compliance checking logic
    # For now, we'll return a mock result
    return ComplianceCheckResult(
        is_compliant=True,
        validation_result={
            "passed_rules": template.rules,
            "failed_rules": []
        },
        suggestions=[]
    )

@router.get("/presets/gdpr", response_model=Dict[str, Any])
async def get_gdpr_preset() -> Dict[str, Any]:
    """
    Get GDPR preset compliance template
    """
    return GDPR_TEMPLATE

@router.get("/presets/kvkk", response_model=Dict[str, Any])
async def get_kvkk_preset() -> Dict[str, Any]:
    """
    Get KVKK preset compliance template
    """
    return KVKK_TEMPLATE 