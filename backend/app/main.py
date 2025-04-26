from fastapi import FastAPI
import logging
from app.core.config import settings
from app.api.v1.api import api_router
from app.core.middleware import setup_middleware

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-powered Turkish-English localization platform",
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)

# Setup middleware
setup_middleware(app)

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 