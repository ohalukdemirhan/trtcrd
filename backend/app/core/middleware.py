from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import logging
import time
from app.core.config import settings
from app.core.exceptions import CustomException

logger = logging.getLogger(__name__)

def setup_middleware(app: FastAPI) -> None:
    """Configure all middleware for the application."""
    
    # Security middleware
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])  # Configure this in production
    app.add_middleware(GZipMiddleware, minimum_size=1000)

    # CORS middleware configuration
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=3600,
    )

    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        
        log_data = {
            "method": request.method,
            "path": request.url.path,
            "process_time_ms": round(process_time, 2),
            "status_code": response.status_code,
            "client_host": request.client.host if request.client else None,
        }
        logger.info(f"Request processed", extra=log_data)
        
        # Add CORS headers to all responses
        response.headers["Access-Control-Allow-Origin"] = settings.CORS_ORIGINS[0]
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response

    @app.exception_handler(CustomException)
    async def custom_exception_handler(request: Request, exc: CustomException):
        logger.error(f"Custom exception occurred", extra={
            "path": request.url.path,
            "detail": exc.detail,
            "status_code": exc.status_code
        })
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers={
                "Access-Control-Allow-Origin": settings.CORS_ORIGINS[0],
                "Access-Control-Allow-Credentials": "true",
            }
        ) 