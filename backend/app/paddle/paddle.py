import requests
from typing import Dict, Any, Optional
from app.core.config import settings

class PaddleClient:
    """
    A simple client for interacting with the Paddle API.
    For development purposes, this is a minimal implementation.
    """
    def __init__(
        self,
        api_key: Optional[str] = None,
        vendor_id: Optional[str] = None,
        sandbox: bool = False
    ):
        self.api_key = api_key or settings.PADDLE_API_KEY
        self.vendor_id = vendor_id or settings.PADDLE_VENDOR_ID
        self.sandbox = sandbox
        self.base_url = "https://sandbox-vendors.paddle.com/api" if sandbox else "https://vendors.paddle.com/api"
        
    async def verify_webhook(self, data: Dict[str, Any], signature: str) -> bool:
        """
        Verify webhook signature. For development, always return True.
        """
        return True
        
    async def get_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """
        Get subscription details. For development, return dummy data.
        """
        return {
            "subscription_id": subscription_id,
            "status": "active",
            "plan_id": "1",
            "next_payment": {
                "date": "2024-12-31",
                "amount": 10.00
            }
        }
        
    async def cancel_subscription(self, subscription_id: str) -> Dict[str, Any]:
        """
        Cancel a subscription. For development, return success.
        """
        return {
            "success": True,
            "subscription_id": subscription_id,
            "message": "Subscription cancelled successfully"
        }
        
    async def update_subscription(self, subscription_id: str, plan_id: str) -> Dict[str, Any]:
        """
        Update a subscription plan. For development, return success.
        """
        return {
            "success": True,
            "subscription_id": subscription_id,
            "plan_id": plan_id,
            "message": "Subscription updated successfully"
        }

    async def create_transaction(
        self,
        customer_id: str,
        items: list[Dict[str, Any]],
        custom_data: Optional[Dict[str, Any]] = None,
        success_url: Optional[str] = None,
        cancel_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create a transaction for subscription checkout.
        For development, return a dummy transaction.
        """
        return {
            "success": True,
            "id": "dummy-transaction-id",
            "url": success_url or "http://localhost:3000/subscription/success",
            "customer_id": customer_id,
            "items": items,
            "custom_data": custom_data
        } 