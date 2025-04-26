import pytest
from app.services.translation import TranslationService
import asyncio
from unittest.mock import patch, MagicMock

@pytest.mark.asyncio
async def test_openai_connection():
    """Test OpenAI API connection by making a simple translation request."""
    translation_service = TranslationService()
    
    # Mock Redis client to bypass caching
    mock_redis = MagicMock()
    mock_redis.get.return_value = None
    translation_service.redis_client = mock_redis
    
    try:
        result = await translation_service.translate(
            text="Hello, how are you?",
            source_lang="en",
            target_lang="tr",
            context=None
        )
        print("Translation successful!")
        print(f"Translated text: {result['translated_text']}")
        assert result['translated_text'], "Translation should not be empty"
        assert result['source_lang'] == 'en'
        assert result['target_lang'] == 'tr'
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(test_openai_connection()) 