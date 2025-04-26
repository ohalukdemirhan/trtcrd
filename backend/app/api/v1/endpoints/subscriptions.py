from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import Dict, Any
import stripe
from paddle_client import PaddleClient
from app.api import deps
from app.core.config import settings
from app.schemas.schemas import (
    Subscription,
    SubscriptionCreate,
    User
)
from app.models.models import SubscriptionTier

router = APIRouter()

# Configure payment providers
stripe.api_key = settings.STRIPE_API_KEY
paddle_client = PaddleClient(
    api_key=settings.PADDLE_API_KEY,
    vendor_id=settings.PADDLE_VENDOR_ID,
    sandbox=True  # Enable sandbox mode for testing
)

# Subscription tier configurations
TIER_CONFIGS = {
    SubscriptionTier.FREE: {
        "monthly_requests_limit": 100,
        "stripe_price_id": None,
        "paddle_plan_id": None,
    },
    SubscriptionTier.BASIC: {
        "monthly_requests_limit": 1000,
        "stripe_price_id": "price_basic_monthly",
        "paddle_plan_id": "plan_basic_monthly",
    },
    SubscriptionTier.PROFESSIONAL: {
        "monthly_requests_limit": 10000,
        "stripe_price_id": "price_pro_monthly",
        "paddle_plan_id": "plan_pro_monthly",
    },
    SubscriptionTier.ENTERPRISE: {
        "monthly_requests_limit": 100000,
        "stripe_price_id": "price_enterprise_monthly",
        "paddle_plan_id": "plan_enterprise_monthly",
    },
}

@router.post("/create-checkout-session")
async def create_checkout_session(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    tier: SubscriptionTier,
    payment_provider: str
) -> Dict[str, Any]:
    """
    Create a checkout session for subscription upgrade
    """
    if tier == SubscriptionTier.FREE:
        raise HTTPException(
            status_code=400,
            detail="Cannot create checkout session for free tier"
        )

    tier_config = TIER_CONFIGS[tier]
    
    try:
        if payment_provider == "stripe":
            session = stripe.checkout.Session.create(
                customer=current_user.subscription.stripe_customer_id,
                payment_method_types=["card"],
                line_items=[{
                    "price": tier_config["stripe_price_id"],
                    "quantity": 1,
                }],
                mode="subscription",
                success_url=f"{settings.FRONTEND_URL}/subscription/success",
                cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel",
                metadata={
                    "user_id": current_user.id,
                    "tier": tier.value
                }
            )
            return {"checkout_url": session.url, "session_id": session.id}
            
        elif payment_provider == "paddle":
            transaction = paddle_client.create_transaction(
                customer_id=current_user.subscription.paddle_customer_id,
                items=[{
                    "price_id": tier_config["paddle_plan_id"],
                    "quantity": 1
                }],
                custom_data={
                    "user_id": current_user.id,
                    "tier": tier.value
                },
                success_url=f"{settings.FRONTEND_URL}/subscription/success",
                cancel_url=f"{settings.FRONTEND_URL}/subscription/cancel"
            )
            return {"checkout_url": transaction.url, "transaction_id": transaction.id}
            
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid payment provider"
            )
            
    except (stripe.error.StripeError, paddle.PaddleError) as e:
        raise HTTPException(status_code=400, detail=str(e))

# Webhook handlers are commented out for MVP focus. TODO: Implement for production.
# async def handle_subscription_created(
#     db: Session,
#     subscription_data: Dict[str, Any]
# ) -> None:
#     """Handle subscription creation webhook"""
#     # Implementation depends on the payment provider's webhook format
#     pass

# async def handle_subscription_updated(
#     db: Session,
#     subscription_data: Dict[str, Any]
# ) -> None:
#     """Handle subscription update webhook"""
#     # Implementation depends on the payment provider's webhook format
#     pass

# async def handle_subscription_deleted(
#     db: Session,
#     subscription_data: Dict[str, Any]
# ) -> None:
#     """Handle subscription deletion webhook"""
#     # Implementation depends on the payment provider's webhook format
#     pass

# Comment out webhook endpoints for MVP
# @router.post("/webhook/stripe")
# async def stripe_webhook(
#     request: Request,
#     db: Session = Depends(deps.get_db)
# ) -> Dict[str, str]:
#     """
#     Handle Stripe webhook events
#     """
#     payload = await request.body()
#     sig_header = request.headers.get("stripe-signature")
#     try:
#         event = stripe.Webhook.construct_event(
#             payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
#         )
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail="Invalid payload")
#     except stripe.error.SignatureVerificationError as e:
#         raise HTTPException(status_code=400, detail="Invalid signature")
#     if event.type == "customer.subscription.created":
#         await handle_subscription_created(db, event.data.object)
#     elif event.type == "customer.subscription.updated":
#         await handle_subscription_updated(db, event.data.object)
#     elif event.type == "customer.subscription.deleted":
#         await handle_subscription_deleted(db, event.data.object)
#     return {"status": "success"}

# @router.post("/webhook/paddle")
# async def paddle_webhook(
#     request: Request,
#     db: Session = Depends(deps.get_db)
# ) -> Dict[str, str]:
#     """
#     Handle Paddle webhook events
#     """
#     payload = await request.json()
#     # Verify webhook signature
#     if not paddle_client.verify_webhook(payload, settings.PADDLE_WEBHOOK_SECRET):
#         raise HTTPException(status_code=400, detail="Invalid webhook signature")
#     event_type = payload.get("event_type")
#     if event_type == "subscription_created":
#         await handle_subscription_created(db, payload)
#     elif event_type == "subscription_updated":
#         await handle_subscription_updated(db, payload)
#     elif event_type == "subscription_cancelled":
#         await handle_subscription_deleted(db, payload)
#     return {"status": "success"}

@router.get("/current", response_model=Subscription)
async def get_current_subscription(
    current_user: User = Depends(deps.get_current_user),
) -> Subscription:
    """
    Get current user's subscription details
    """
    return current_user.subscription

@router.get("/usage")
async def get_usage_stats(
    current_user: User = Depends(deps.get_current_user),
) -> Dict[str, Any]:
    """
    Get current user's usage statistics
    """
    subscription = current_user.subscription
    return {
        "current_requests": subscription.current_requests_count,
        "monthly_limit": subscription.monthly_requests_limit,
        "remaining_requests": (
            subscription.monthly_requests_limit - subscription.current_requests_count
        ),
        "usage_percentage": (
            (subscription.current_requests_count / subscription.monthly_requests_limit)
            * 100
        )
    } 