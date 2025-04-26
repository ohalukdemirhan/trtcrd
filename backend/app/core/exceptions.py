from fastapi import HTTPException
from typing import Any, Optional

class CustomException(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: Any = None,
        headers: Optional[dict[str, str]] = None,
    ) -> None:
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class TranslationError(CustomException):
    def __init__(self, detail: str = "Translation service error"):
        super().__init__(status_code=500, detail=detail)

class AuthenticationError(CustomException):
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(status_code=401, detail=detail)

class AuthorizationError(CustomException):
    def __init__(self, detail: str = "Not authorized"):
        super().__init__(status_code=403, detail=detail)

class ValidationError(CustomException):
    def __init__(self, detail: str = "Validation error"):
        super().__init__(status_code=422, detail=detail)

class RateLimitError(CustomException):
    def __init__(self, detail: str = "Rate limit exceeded"):
        super().__init__(status_code=429, detail=detail)

class PaymentError(CustomException):
    def __init__(self, detail: str = "Payment processing error"):
        super().__init__(status_code=402, detail=detail)

class ResourceNotFoundError(CustomException):
    def __init__(self, detail: str = "Resource not found"):
        super().__init__(status_code=404, detail=detail) 