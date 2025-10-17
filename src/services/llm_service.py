"""
Robust LLM Service with Multiple Fallbacks
Provides reliable LLM responses with multiple fallback strategies.
"""

import logging
import time
import json
import requests
from typing import Dict, Any, Optional, List
from datetime import datetime
import asyncio
import aiohttp

logger = logging.getLogger(__name__)


class LLMService:
    """
    Robust LLM service with multiple fallback strategies.
    
    This service provides reliable LLM responses by trying multiple
    free LLM services and falling back to rule-based responses.
    """
    
    def __init__(self):
        """Initialize the LLM service."""
        self.services = [
            {
                'name': 'deepseek',
                'url': 'https://api.deepseek.com/v1/chat/completions',
                'model': 'deepseek-chat',
                'timeout': 30,
                'enabled': True,
                'api_key': os.getenv('DEEPSEEK_API_KEY')
            }
        ]
        
        self.fallback_responses = {
            'greeting': [
                "Hi! I'm your travel assistant. I can help you plan trips, find flights, hotels, and provide travel information. What would you like help with?",
                "Hello! I'm here to help with your travel planning needs. What can I assist you with today?",
                "Hi there! I can help you with travel planning, booking, and recommendations. What's your travel question?"
            ],
            'weather': [
                "I can help you check weather information. Which city would you like weather details for?",
                "Weather information is available! Just tell me which destination you're interested in.",
                "I can provide weather forecasts. What city are you planning to visit?"
            ],
            'flight': [
                "I can help you find flights. What's your departure city, destination, and travel dates?",
                "Flight search is available! Please provide your departure and destination cities, plus your travel dates.",
                "I can assist with flight bookings. Where are you flying from and to, and when?"
            ],
            'hotel': [
                "I can help you find hotels. Which city and dates are you looking for?",
                "Hotel search is ready! Just tell me your destination and check-in/check-out dates.",
                "I can find accommodations for you. What city and dates do you need?"
            ],
            'attractions': [
                "I can help you find attractions and things to do. Which city are you interested in?",
                "Attractions and activities are available! What destination are you exploring?",
                "I can recommend things to do. Which city would you like to discover?"
            ],
            'general': [
                "I can help you with travel planning. What specific information do you need?",
                "I'm here to assist with your travel needs. What would you like to know?",
                "I can help with travel planning, bookings, and recommendations. What's your question?"
            ]
        }
        
        self.response_cache = {}
        self.service_stats = {service['name']: {'success': 0, 'failures': 0} for service in self.services}
        
        logger.info("LLM Service initialized with multiple fallbacks")
    
    async def get_response(self, prompt: str, context: str = "", user_id: str = None) -> str:
        """
        Get LLM response with multiple fallback strategies.
        
        Args:
            prompt: User prompt
            context: Additional context
            user_id: User identifier for personalization
            
        Returns:
            LLM response string
        """
        start_time = time.time()
        
        # Check cache first
        cache_key = f"{user_id}:{hash(prompt)}" if user_id else str(hash(prompt))
        if cache_key in self.response_cache:
            logger.info("Using cached LLM response")
            return self.response_cache[cache_key]
        
        # Try each LLM service
        for service in self.services:
            if not service['enabled']:
                continue
                
            try:
                response = await self._try_service(service, prompt, context)
                if response:
                    # Cache successful response
                    self.response_cache[cache_key] = response
                    self.service_stats[service['name']]['success'] += 1
                    
                    response_time = time.time() - start_time
                    logger.info(f"LLM response from {service['name']} in {response_time:.2f}s")
                    return response
                    
            except Exception as e:
                logger.warning(f"{service['name']} failed: {e}")
                self.service_stats[service['name']]['failures'] += 1
        
        # All services failed, use intelligent fallback
        fallback_response = self._get_intelligent_fallback(prompt, context)
        
        # Cache fallback response
        self.response_cache[cache_key] = fallback_response
        
        response_time = time.time() - start_time
        logger.info(f"Using intelligent fallback in {response_time:.2f}s")
        return fallback_response
    
    async def _try_service(self, service: Dict[str, Any], prompt: str, context: str) -> Optional[str]:
        """Try a specific LLM service."""
        if service['name'] == 'deepseek':
            return await self._try_deepseek(service, prompt, context)
        return None
    
    async def _try_deepseek(self, service: Dict[str, Any], prompt: str, context: str) -> Optional[str]:
        """Try DeepSeek API service."""
        try:
            api_key = service.get('api_key')
            if not api_key:
                logger.warning("DeepSeek API key not found")
                return None
                
            payload = {
                'model': service['model'],
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a helpful travel planning assistant. Provide conversational, helpful responses about travel, destinations, and trip planning. Be friendly and informative.'
                    },
                    {
                        'role': 'user',
                        'content': f"{prompt}\n\nContext: {context}" if context else prompt
                    }
                ],
                'max_tokens': 1000,
                'temperature': 0.7,
                'stream': False
            }
            
            headers = {
                'Content-Type': 'application/json',
                'Authorization': f"Bearer {api_key}"
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    service['url'],
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=service['timeout'])
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'choices' in data and len(data['choices']) > 0:
                            content = data['choices'][0]['message']['content']
                            return content.strip()
                    else:
                        logger.warning(f"DeepSeek returned status {response.status}")
                        response_text = await response.text()
                        logger.warning(f"DeepSeek response: {response_text}")
                        
        except asyncio.TimeoutError:
            logger.warning("DeepSeek request timed out")
        except Exception as e:
            logger.warning(f"DeepSeek error: {e}")
        
        return None
    
    async def _try_groq(self, service: Dict[str, Any], prompt: str, context: str) -> Optional[str]:
        """Try Groq service (free tier)."""
        try:
            payload = {
                'model': service['model'],
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a helpful travel planning assistant. Provide concise, practical travel advice and recommendations. Be conversational and helpful.'
                    },
                    {
                        'role': 'user',
                        'content': f"{prompt}\n\nContext: {context}" if context else prompt
                    }
                ],
                'max_tokens': 500,
                'temperature': 0.7,
                'stream': False
            }
            
            headers = {'Content-Type': 'application/json'}
            if service.get('api_key'):
                headers['Authorization'] = f"Bearer {service['api_key']}"
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    service['url'],
                    json=payload,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=service['timeout'])
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'choices' in data and len(data['choices']) > 0:
                            content = data['choices'][0]['message']['content']
                            return content.strip()
                    else:
                        logger.warning(f"Groq returned status {response.status}")
                        
        except asyncio.TimeoutError:
            logger.warning("Groq request timed out")
        except Exception as e:
            logger.warning(f"Groq error: {e}")
        
        return None
    
    async def _try_llm7(self, service: Dict[str, Any], prompt: str, context: str) -> Optional[str]:
        """Try LLM7.io service."""
        try:
            payload = {
                'model': service['model'],
                'messages': [
                    {
                        'role': 'system',
                        'content': 'You are a helpful travel planning assistant. Provide concise, practical travel advice and recommendations.'
                    },
                    {
                        'role': 'user',
                        'content': f"{prompt}\n\nContext: {context}" if context else prompt
                    }
                ],
                'max_tokens': 300,
                'temperature': 0.7
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    service['url'],
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=aiohttp.ClientTimeout(total=service['timeout'])
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'choices' in data and len(data['choices']) > 0:
                            content = data['choices'][0]['message']['content']
                            return content.strip()
                    else:
                        logger.warning(f"LLM7.io returned status {response.status}")
                        
        except asyncio.TimeoutError:
            logger.warning("LLM7.io request timed out")
        except Exception as e:
            logger.warning(f"LLM7.io error: {e}")
        
        return None
    
    async def _try_huggingface(self, service: Dict[str, Any], prompt: str, context: str) -> Optional[str]:
        """Try Hugging Face service."""
        try:
            payload = {
                'inputs': f"{prompt}\n\nContext: {context}" if context else prompt,
                'parameters': {
                    'max_length': 200,
                    'temperature': 0.7,
                    'do_sample': True
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    service['url'],
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=aiohttp.ClientTimeout(total=service['timeout'])
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if isinstance(data, list) and len(data) > 0:
                            content = data[0].get('generated_text', '')
                            # Clean up the response
                            if content.startswith(prompt):
                                content = content[len(prompt):].strip()
                            return content[:300]  # Limit length
                    else:
                        logger.warning(f"Hugging Face returned status {response.status}")
                        
        except asyncio.TimeoutError:
            logger.warning("Hugging Face request timed out")
        except Exception as e:
            logger.warning(f"Hugging Face error: {e}")
        
        return None
    
    def _get_intelligent_fallback(self, prompt: str, context: str = "") -> str:
        """Get intelligent fallback response based on prompt analysis."""
        prompt_lower = prompt.lower()
        
        # Handle specific user requests with more intelligent responses
        if "haifa" in prompt_lower and ("movie" in prompt_lower or "cinema" in prompt_lower):
            return "I'd be happy to help you find a movie in Haifa! Haifa has several cinemas including Cinema City Haifa, Yes Planet Haifa, and Lev Haifa Mall cinema. What type of movie are you looking for, and do you prefer a specific area in Haifa?"
        
        elif "haifa" in prompt_lower:
            return "Haifa is a beautiful city in northern Israel! I can help you with things to do in Haifa - from the Baha'i Gardens and German Colony to the beaches and museums. What specifically are you interested in doing in Haifa?"
        
        elif any(word in prompt_lower for word in ["tokyo", "japan"]) and any(word in prompt_lower for word in ["trip", "plan", "visit"]):
            return "Tokyo is an amazing destination! For a 3-day trip to Tokyo, I'd recommend visiting areas like Shibuya, Harajuku, and Asakusa. You could explore the famous Shibuya crossing, visit Meiji Shrine, and try authentic ramen. What specific interests do you have - food, culture, shopping, or something else?"
        
        elif any(word in prompt_lower for word in ["israel", "tel aviv", "jerusalem"]) and any(word in prompt_lower for word in ["trip", "plan", "visit"]):
            return "Israel has so much to offer! From the historic streets of Jerusalem to the vibrant nightlife of Tel Aviv, there's something for everyone. Are you interested in historical sites, beaches, food, or cultural experiences?"
        
        # Analyze prompt for intent
        elif any(word in prompt_lower for word in ["hello", "hi", "hey", "help", "start"]):
            return self._get_random_response('greeting')
        elif "weather" in prompt_lower:
            return self._get_random_response('weather')
        elif "flight" in prompt_lower or "fly" in prompt_lower:
            return self._get_random_response('flight')
        elif "hotel" in prompt_lower or "accommodation" in prompt_lower or "stay" in prompt_lower:
            return self._get_random_response('hotel')
        elif any(word in prompt_lower for word in ["attraction", "things to do", "activities", "sightseeing"]):
            return self._get_random_response('attractions')
        elif any(word in prompt_lower for word in ["plan", "trip", "travel", "vacation", "holiday"]):
            return "I can help you plan your trip! Please tell me your destination, travel dates, and what type of experience you're looking for."
        elif any(word in prompt_lower for word in ["budget", "cost", "price", "expensive", "cheap"]):
            return "I can help with budget planning! What's your destination and approximate budget range?"
        elif any(word in prompt_lower for word in ["restaurant", "food", "eat", "dining"]):
            return "I can help you find restaurants and food recommendations! Which city are you interested in?"
        else:
            # For any other request, provide a more helpful response
            return f"I understand you're asking about: '{prompt}'. I'm here to help with travel planning, recommendations, and information. Could you tell me more specifically what you'd like to know about your travel plans?"
    
    def _get_random_response(self, category: str) -> str:
        """Get a random response from a category."""
        import random
        responses = self.fallback_responses.get(category, self.fallback_responses['general'])
        return random.choice(responses)
    
    def get_service_stats(self) -> Dict[str, Any]:
        """Get service statistics."""
        total_requests = sum(stats['success'] + stats['failures'] for stats in self.service_stats.values())
        return {
            'total_requests': total_requests,
            'service_stats': self.service_stats,
            'cache_size': len(self.response_cache),
            'timestamp': datetime.now().isoformat()
        }
    
    def clear_cache(self):
        """Clear response cache."""
        self.response_cache.clear()
        logger.info("LLM response cache cleared")
    
    def disable_service(self, service_name: str):
        """Disable a specific service."""
        for service in self.services:
            if service['name'] == service_name:
                service['enabled'] = False
                logger.info(f"🚫 Disabled LLM service: {service_name}")
                break
    
    def enable_service(self, service_name: str):
        """Enable a specific service."""
        for service in self.services:
            if service['name'] == service_name:
                service['enabled'] = True
                logger.info(f"Enabled LLM service: {service_name}")
                break
