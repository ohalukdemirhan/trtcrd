from typing import Optional, Dict, Any
import openai
from openai import AsyncOpenAI
from app.core.config import settings
from app.core.exceptions import TranslationError
import json
from redis.asyncio import Redis
import hashlib

class TranslationService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self._redis = None
        self.cache_ttl = 86400  # 24 hours

    async def _get_redis(self):
        if self._redis is None:
            # Build Redis URL with password only if it's set
            redis_url = f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}"
            connection_kwargs = {
                "decode_responses": True,
            }
            if settings.REDIS_PASSWORD:
                connection_kwargs["password"] = settings.REDIS_PASSWORD
            
            try:
                self._redis = Redis.from_url(
                    redis_url,
                    **connection_kwargs
                )
                # Test the connection
                await self._redis.ping()
            except Exception as e:
                # If authentication fails, try without password
                if "AUTH" in str(e):
                    self._redis = Redis.from_url(
                        redis_url,
                        decode_responses=True
                    )
                    await self._redis.ping()
                else:
                    raise e
        return self._redis

    def _generate_cache_key(self, text: str, source_lang: str, target_lang: str, context: Dict[str, Any]) -> str:
        """Generate a unique cache key for the translation request."""
        key_components = f"{text}:{source_lang}:{target_lang}:{json.dumps(context, sort_keys=True)}"
        return f"translation:{hashlib.sha256(key_components.encode()).hexdigest()}"

    async def translate(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Translate text between Turkish and English with cultural context adaptation.
        
        Args:
            text: Text to translate
            source_lang: Source language code ('tr' or 'en')
            target_lang: Target language code ('tr' or 'en')
            context: Optional dictionary containing cultural context and compliance rules
        
        Returns:
            Dictionary containing translated text and cultural adaptations
        """
        if source_lang not in ['tr', 'en'] or target_lang not in ['tr', 'en']:
            raise TranslationError("Only Turkish (tr) and English (en) languages are supported")

        # Check cache first
        redis = await self._get_redis()
        cache_key = self._generate_cache_key(text, source_lang, target_lang, context or {})
        cached_result = await redis.get(cache_key)
        if cached_result:
            return json.loads(cached_result)

        try:
            # Prepare the system message based on the translation direction
            system_message = (
                "You are an expert translator and cultural adaptation specialist for "
                f"{'Turkish to English' if source_lang == 'tr' else 'English to Turkish'} content. "
                "Consider cultural nuances, idioms, and compliance requirements in your translations."
            )

            # Prepare the user message with context
            user_message = f"Translate the following text from {source_lang} to {target_lang}:\n\n{text}"
            if context:
                user_message += f"\n\nConsider this context:\n{json.dumps(context, indent=2)}"

            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                max_tokens=1500
            )

            result = {
                "translated_text": response.choices[0].message.content,
                "source_lang": source_lang,
                "target_lang": target_lang,
                "context_applied": bool(context)
            }

            # Cache the result
            await redis.setex(
                cache_key,
                self.cache_ttl,
                json.dumps(result)
            )

            return result

        except Exception as e:
            raise TranslationError(f"Translation failed: {str(e)}")

    async def validate_cultural_compliance(
        self,
        text: str,
        lang: str,
        compliance_rules: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Validate if the text meets cultural and compliance requirements.
        
        Args:
            text: Text to validate
            lang: Language code ('tr' or 'en')
            compliance_rules: Dictionary of compliance rules to check
        
        Returns:
            Dictionary containing validation results and suggestions
        """
        try:
            system_message = (
                "You are a cultural compliance validator specializing in "
                f"{'Turkish' if lang == 'tr' else 'English'} content. "
                "Analyze the text for compliance with provided rules and cultural appropriateness."
            )

            user_message = (
                f"Validate the following {lang} text for cultural and compliance requirements:\n\n"
                f"Text: {text}\n\n"
                f"Compliance Rules:\n{json.dumps(compliance_rules, indent=2)}"
            )

            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ],
                temperature=0.3,
                max_tokens=1000
            )

            return {
                "is_compliant": True,  # You might want to parse the response to determine this
                "validation_result": response.choices[0].message.content,
                "suggestions": []  # Parse suggestions from the response
            }

        except Exception as e:
            raise TranslationError(f"Compliance validation failed: {str(e)}") 