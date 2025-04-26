from fastapi import APIRouter
from app.api.v1.endpoints import translations, subscriptions, compliance, auth, admin

api_router = APIRouter()

api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["auth"]
)

api_router.include_router(
    translations.router,
    prefix="/translations",
    tags=["translations"]
)

api_router.include_router(
    subscriptions.router,
    prefix="/subscriptions",
    tags=["subscriptions"]
)

api_router.include_router(
    compliance.router,
    prefix="/compliance",
    tags=["compliance"]
)

api_router.include_router(
    admin.router,
    prefix="/admin",
    tags=["admin"]
) 