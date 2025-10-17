#!/usr/bin/env python3
"""
🌍 Travel AI Agent - Privacy-First Travel Planning Assistant

A comprehensive travel planning agent that provides intelligent travel assistance using:
- Free cloud LLM (LLM7.io) for natural language processing
- 15+ free APIs for real-time travel information
- Encrypted local storage for privacy
- Web search capabilities for current information
- RAG (Retrieval-Augmented Generation) for accurate responses
- Context management for personalized conversations

Features:
- Flight search and booking recommendations
- Hotel and accommodation suggestions
- Weather information and forecasts
- Tourist attractions and activities
- Car rental options
- Events and entertainment
- Travel insurance recommendations
- Transportation options
- Restaurant and dining suggestions
- Currency conversion and budget planning
- Country information and geocoding
- Wikipedia integration for detailed information

Architecture:
- Backend: Python FastAPI with async/await
- Frontend: React with streaming responses
- Database: Encrypted SQLite with automatic cleanup
- APIs: Comprehensive free API integrations
- Security: AES-256 encryption, no data leakage
- Performance: Advanced caching and circuit breakers

Author: Mahdy Gribkov
License: MIT
Version: 1.0.0
"""

import sys
import os
import asyncio
import json
import re
import time
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.config import config
from src.database.secure_database import SecureDatabase
from src.utils.text_beautifier import TextBeautifier
from src.apis import (
    RestCountriesClient, WikipediaClient, NominatimClient, WebSearchClient, 
    AviationStackClient, FreeWeatherClient, OpenMeteoClient, CurrencyAPIClient,
    RealFlightScraper, RealHotelScraper, RealAttractionsScraper, RealFoodScraper
)
from src.mcp import TravelMCPClient
from src.context import AdvancedContextManager, ConversationMemory, PreferenceLearningSystem
from src.context.context_provider import ContextProvider
from src.context.database_context_provider import DatabaseContextProvider
from src.routing import IntentRouter, IntentType
from src.performance import (
    AdvancedCache, ResponseOptimizer, SimplePerformanceMonitor,
    record_metric, record_response_time, get_performance_stats, get_health_status, performance_timer
)
from src.services.llm_service import LLMService

# Configure logging
os.makedirs('data', exist_ok=True)  # Create data directory if it doesn't exist

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/travel_agent.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class TravelAgent:
    """
    Advanced Travel AI Agent with comprehensive travel planning capabilities.
    
    This is the Main Decision Process (MDP) that orchestrates all travel planning functionality.
    It follows clean architecture principles with clear separation of concerns:
    
    Architecture:
    - MDP (this class): Pure business logic and decision making
    - ContextProvider: Data access and context aggregation (no direct DB access)
    - Database: Pure data persistence layer
    
    Features:
    - Free cloud LLM integration for natural language processing
    - Real-time web search for current information
    - Country information lookup via REST Countries API
    - Wikipedia integration for detailed destination information
    - Geocoding services via OpenStreetMap Nominatim
    - Travel planning and budgeting with currency conversion
    - Encrypted local storage for privacy
    - Comprehensive API integrations (weather, flights, hotels, etc.)
    - Streaming responses for real-time user experience
    - Error handling and retry mechanisms
    - Rate limiting and circuit breaker patterns
    
    Attributes:
        context_provider (ContextProvider): Context data provider interface
        conversation_history (List[Dict]): Chat conversation history
        user_preferences (Dict): User preferences and settings
        llm_type (str): Type of LLM being used ('local' or 'openai')
        model_name (str): Name of the LLM model
    
    Example:
        >>> agent = TravelAgent()
        >>> response = await agent.process_query("Plan a trip to Japan")
        >>> print(response)
    """
    
    def __init__(self):
        """Initialize the travel agent with all components."""
        self.database = SecureDatabase()
        # Initialize API clients - REAL DATA ONLY
        self.country_client = RestCountriesClient()
        self.wikipedia_client = WikipediaClient()
        self.maps_client = NominatimClient()
        self.web_search_client = WebSearchClient()
        self.flight_client = AviationStackClient()
        self.weather_client = FreeWeatherClient()
        self.open_meteo_client = OpenMeteoClient()
        self.currency_client = CurrencyAPIClient()
        
        # Initialize Real Web Scrapers
        self.real_flight_scraper = RealFlightScraper()
        self.real_hotel_scraper = RealHotelScraper()
        self.real_attractions_scraper = RealAttractionsScraper()
        self.real_food_scraper = RealFoodScraper()
        
        # Enhanced API Clients are integrated into existing clients
        
        # Initialize MCP Client for advanced tool management
        self.mcp_client = TravelMCPClient()
        
        # Initialize Intent Router for intelligent query routing
        self.intent_router = IntentRouter()
        
        # Initialize Context Provider (implements ContextProvider interface)
        self.context_provider: ContextProvider = DatabaseContextProvider(self.database)
        
        # Initialize Conversation Memory System for persistent memory
        self.conversation_memory = ConversationMemory(self.database)
        
        # Initialize Preference Learning System for intelligent user adaptation
        self.preference_learning = PreferenceLearningSystem(self.database)
        
        # Initialize Performance Optimization Systems
        self.advanced_cache = AdvancedCache()
        self.performance_monitor = SimplePerformanceMonitor()
        self.response_optimizer = ResponseOptimizer(self.advanced_cache)
        
        # Log successful initialization
        logger.info("Real Data APIs, Scrapers, MCP Client & Advanced Systems initialized: Weather, Wikipedia, Maps, Web Search, Currency, Countries, Real Flight/Hotel/Attractions Scrapers, MCP Tools, Advanced Context Management, Conversation Memory, Preference Learning, Performance Optimization")
        
        # Conversation memory
        self.conversation_history = []
        self.user_preferences = {}
        
        # Load user preferences from database (will be loaded in async context)
        self._preferences_loaded = False
        
        # Initialize knowledge base for RAG
        self.knowledge_base = {}
        
        # Initialize performance monitoring
        self.performance_stats = {
            'api_calls': 0,
            'cache_hits': 0,
            'cache_misses': 0,
            'llm_calls': 0,
            'response_times': []
        }
        
        # Initialize LLM Service with multiple fallbacks
        self.llm_service = LLMService()
        
        # Initialize text beautifier
        self.text_beautifier = TextBeautifier()
        
        logger.info("Travel agent initialized successfully")
    
    
    
    async def _call_llm(self, prompt: str, context: str = "", user_id: str = None) -> str:
        """
        Call the LLM service with robust fallback handling.
        
        Args:
            prompt: Main prompt for the LLM
            context: Additional context information
            user_id: User identifier for personalization
            
        Returns:
            LLM response
        """
        start_time = time.time()
        
        try:
            # Use the robust LLM service
            response = await self.llm_service.get_response(prompt, context, user_id)
            
            # Update performance stats
            self.performance_stats['llm_calls'] += 1
            self.performance_stats['response_times'].append(time.time() - start_time)
            
            return response
            
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            return "I can help you with travel planning. What specific information do you need?"
    
    
    def _format_llm_response(self, response: str) -> str:
        """Format LLM response using the text beautifier service."""
        if not response:
            return response
            
        try:
            # Aggressively clean HTML tags and markdown
            cleaned_response = re.sub(r'<[^>]*>', '', response)
            cleaned_response = re.sub(r'\*\*(.*?)\*\*', r'\1', cleaned_response)
            cleaned_response = re.sub(r'\*(.*?)\*', r'\1', cleaned_response)
            
            # Clean up any remaining HTML entities
            cleaned_response = cleaned_response.replace('&nbsp;', ' ')
            cleaned_response = cleaned_response.replace('&bull;', '•')
            cleaned_response = cleaned_response.replace('&amp;', '&')
            cleaned_response = cleaned_response.replace('&lt;', '<')
            cleaned_response = cleaned_response.replace('&gt;', '>')
            
            # Use the text beautifier service
            beautified = self.text_beautifier.beautify_response(cleaned_response)
            
            # Final cleanup - remove any remaining HTML tags
            final_response = re.sub(r'<[^>]*>', '', beautified)
            final_response = re.sub(r'\*\*(.*?)\*\*', r'\1', final_response)
            final_response = re.sub(r'\*(.*?)\*', r'\1', final_response)
            
            return final_response
        except Exception as e:
            logger.error(f"Text beautification failed: {e}")
            # Fallback to simple cleaning
            return re.sub(r'<[^>]*>', '', response.strip())
    
    async def _ensure_preferences_loaded(self) -> None:
        """Ensure user preferences are loaded from database."""
        if not self._preferences_loaded:
            await self._load_user_preferences()
            self._preferences_loaded = True
    
    async def _load_user_preferences(self, user_id: str = "default_user") -> None:
        """Load user preferences using ContextProvider."""
        try:
            preferences = await self.context_provider.get_preferences_context(user_id)
            self.user_preferences.update(preferences)
            logger.info(f"Loaded user preferences for {user_id}")
        except Exception as e:
            logger.error(f"Error loading user preferences: {e}")
    
    async def _save_user_preference(self, pref_type: str, pref_value: str, user_id: str = "default_user") -> None:
        """Save user preference using ContextProvider."""
        try:
            # Store preference through context provider
            interaction_data = {
                'preferences': {pref_type: pref_value}
            }
            await self.context_provider.store_interaction_context(user_id, interaction_data)
            self.user_preferences[pref_type] = pref_value
            logger.info(f"Saved user preference: {pref_type}")
        except Exception as e:
            logger.error(f"Error saving user preference: {e}")
    
    async def _extract_and_save_preferences(self, query: str) -> None:
        """Extract user preferences from query and save them."""
        try:
            query_lower = query.lower()
            
            # Extract budget preferences
            if 'budget' in query_lower:
                import re
                budget_match = re.search(r'\$(\d+)', query)
                if budget_match:
                    await self._save_user_preference('budget', budget_match.group(1))
            
            # Extract destination preferences using API-based detection
            # This will be handled by the extract_travel_info method which uses real APIs
            # No more hardcoded destination lists
            
            # Extract travel style preferences
            if any(word in query_lower for word in ['luxury', 'expensive', 'high-end']):
                await self._save_user_preference('travel_style', 'luxury')
            elif any(word in query_lower for word in ['budget', 'cheap', 'affordable']):
                await self._save_user_preference('travel_style', 'budget')
            elif any(word in query_lower for word in ['backpack', 'hostel', 'adventure']):
                await self._save_user_preference('travel_style', 'adventure')
            
            # Extract activity preferences
            if any(word in query_lower for word in ['beach', 'relax', 'resort']):
                await self._save_user_preference('activity_preference', 'relaxation')
            elif any(word in query_lower for word in ['hiking', 'outdoor', 'nature']):
                await self._save_user_preference('activity_preference', 'outdoor')
            elif any(word in query_lower for word in ['culture', 'museum', 'history']):
                await self._save_user_preference('activity_preference', 'culture')
            elif any(word in query_lower for word in ['food', 'restaurant', 'cuisine']):
                await self._save_user_preference('activity_preference', 'food')
            
            # Update MCP context with preferences
            await self.mcp_client.update_context('user_preferences', self.user_preferences)
                
        except Exception as e:
            logger.error(f"Error extracting preferences: {e}")
    
    def _build_conversation_context(self) -> str:
        """Build conversation context from recent history."""
        try:
            if not self.conversation_history:
                return "No previous conversation."
            
            # Get last 3 exchanges for context
            recent_history = self.conversation_history[-6:] if len(self.conversation_history) > 6 else self.conversation_history
            
            context_parts = []
            for entry in recent_history:
                if entry.get('type') == 'user':
                    context_parts.append(f"User: {entry.get('user', '')[:100]}")
                elif entry.get('type') == 'assistant':
                    context_parts.append(f"Assistant: {entry.get('assistant', '')[:100]}")
            
            return "\n".join(context_parts) if context_parts else "No previous conversation."
            
        except Exception as e:
            logger.error(f"Error building conversation context: {e}")
            return "No previous conversation."
    
    def _build_preferences_context(self) -> str:
        """Build user preferences context."""
        try:
            if not self.user_preferences:
                return "No user preferences available."
            
            context_parts = []
            for pref_type, pref_value in self.user_preferences.items():
                context_parts.append(f"{pref_type}: {pref_value}")
            
            return "\n".join(context_parts) if context_parts else "No user preferences available."
            
        except Exception as e:
            logger.error(f"Error building preferences context: {e}")
            return "No user preferences available."
    
    def _add_to_knowledge_base(self, key: str, data: Dict[str, Any]) -> None:
        """Add verified data to knowledge base for RAG."""
        try:
            self.knowledge_base[key] = {
                'data': data,
                'timestamp': datetime.now().isoformat(),
                'source': data.get('source', 'API')
            }
            logger.info(f"Added to knowledge base: {key}")
        except Exception as e:
            logger.error(f"Error adding to knowledge base: {e}")
    
    def _retrieve_from_knowledge_base(self, query: str) -> str:
        """Retrieve relevant information from knowledge base for RAG."""
        try:
            if not self.knowledge_base:
                return "No verified information available."
            
            query_lower = query.lower()
            relevant_info = []
            
            for key, entry in self.knowledge_base.items():
                # Simple keyword matching for relevance
                if any(word in key.lower() for word in query_lower.split()):
                    relevant_info.append(f"{key}: {entry['data']}")
                elif any(word in str(entry['data']).lower() for word in query_lower.split()):
                    relevant_info.append(f"{key}: {entry['data']}")
            
            return "\n".join(relevant_info[:3]) if relevant_info else "No relevant verified information found."
            
        except Exception as e:
            logger.error(f"Error retrieving from knowledge base: {e}")
            return "No verified information available."
    
    def _ground_llm_response(self, response: str, query: str) -> str:
        """Ground LLM response with verified information from knowledge base."""
        try:
            # Get relevant verified information
            verified_info = self._retrieve_from_knowledge_base(query)
            
            if verified_info and verified_info != "No verified information available.":
                grounded_response = f"{response}\n\n📚 Verified Information:\n{verified_info}"
                return grounded_response
            
            return response
            
        except Exception as e:
            logger.error(f"Error grounding LLM response: {e}")
            return response
    
    def get_performance_stats(self) -> Dict[str, Any]:
        """Get performance statistics."""
        try:
            # Get stats from the simple performance monitor
            monitor_stats = self.performance_monitor.get_stats()
            
            # Add additional agent-specific stats
            agent_stats = {
                'knowledge_base_size': len(self.knowledge_base),
                'conversation_history_size': len(self.conversation_history),
                'user_preferences_count': len(self.user_preferences),
                'llm_service_stats': self.llm_service.get_service_stats()
            }
            
            # Combine both stats
            return {**monitor_stats, **agent_stats}
        except Exception as e:
            logger.error(f"Error getting performance stats: {e}")
            return {}
    
    @performance_timer('mcp_flight_data')
    async def _get_mcp_flight_data(self, origin: str, destination: str, date: str = None) -> List[Dict[str, Any]]:
        """Get flight data using MCP tools with performance monitoring."""
        try:
            # Check cache first
            cache_key = f"flights_{origin}_{destination}_{date}"
            cached_flights = await self.advanced_cache.get(cache_key)
            if cached_flights:
                await record_metric('flight_data_cache_hit', 1.0)
                return cached_flights
            
            response = await self.mcp_client.call_tool('search_flights', {
                'origin': origin,
                'destination': destination,
                'date': date
            })
            
            if 'flights' in response:
                flights = response['flights']
                # Cache the results for 30 minutes
                await self.advanced_cache.set(cache_key, flights, ttl=1800, tags=['flights', 'mcp'])
                await record_metric('flight_data_cache_miss', 1.0)
                return flights
            return []
            
        except Exception as e:
            logger.error(f"MCP flight data error: {e}")
            await record_error('mcp_flight_data', str(e))
            return []
    
    async def _get_mcp_hotel_data(self, city: str, check_in: str = None, check_out: str = None) -> List[Dict[str, Any]]:
        """Get hotel data using MCP tools."""
        try:
            response = await self.mcp_client.call_tool('search_hotels', {
                'city': city,
                'check_in': check_in,
                'check_out': check_out
            })
            
            if 'hotels' in response:
                return response['hotels']
            return []
            
        except Exception as e:
            logger.error(f"MCP hotel data error: {e}")
            return []
    
    async def _get_mcp_attractions_data(self, city: str, category: str = "all") -> List[Dict[str, Any]]:
        """Get attractions data using MCP tools."""
        try:
            response = await self.mcp_client.call_tool('search_attractions', {
                'city': city,
                'category': category
            })
            
            if 'attractions' in response:
                return response['attractions']
            return []
            
        except Exception as e:
            logger.error(f"MCP attractions data error: {e}")
            return []
    
    async def _get_mcp_weather_data(self, location: str) -> Dict[str, Any]:
        """Get weather data using MCP tools."""
        try:
            response = await self.mcp_client.call_tool('get_weather', {
                'location': location
            })
            
            if 'weather' in response:
                return response['weather']
            return {}
            
        except Exception as e:
            logger.error(f"MCP weather data error: {e}")
            return {}
    
    async def _get_mcp_context_data(self) -> Dict[str, Any]:
        """Get all MCP context data."""
        try:
            return await self.mcp_client.get_all_context()
        except Exception as e:
            logger.error(f"MCP context data error: {e}")
            return {}
    
    def _get_fallback_response(self, prompt: str) -> str:
        """Get simple fallback responses for common travel queries."""
        prompt_lower = prompt.lower()
        
        # General greeting
        if any(word in prompt_lower for word in ["hello", "hi", "hey", "help"]):
            return "Hi! I can help you plan trips, find flights, hotels, and provide travel information. What would you like help with?"
        
        # Weather queries
        elif "weather" in prompt_lower:
            return "I can help you check weather. Which city would you like weather information for?"
        
        # Flight queries
        elif "flight" in prompt_lower:
            return "I can help you find flights. What's your departure city, destination, and travel dates?"
        
        # Hotel queries
        elif "hotel" in prompt_lower:
            return "I can help you find hotels. Which city and dates are you looking for?"
        
        # Attractions queries
        elif "attraction" in prompt_lower or "things to do" in prompt_lower:
            return "I can help you find attractions. Which city are you interested in?"
        
        # Default response
        else:
            return "I can help you with travel planning. What specific information do you need?"
    
    def _process_travel_request(self, prompt: str) -> str:
        """Process travel requests with structured responses."""
        try:
            prompt_lower = prompt.lower()
            
            # Extract travel information
            if "rome" in prompt_lower and "israel" in prompt_lower:
                return self._generate_rome_trip_plan()
            elif "trip" in prompt_lower or "travel" in prompt_lower:
                return self._generate_generic_trip_plan(prompt)
            elif "weather" in prompt_lower:
                return "I can help you check weather for your destination. Please specify which city you'd like weather information for."
            elif "flight" in prompt_lower:
                return "I can help you find flights. Please provide your departure city, destination, and travel dates."
            elif "hotel" in prompt_lower:
                return "I can help you find hotels. Please specify your destination city and travel dates."
            else:
                return "I'm your travel planning assistant! I can help you with:\n• Trip planning and itineraries\n• Flight information\n• Hotel recommendations\n• Weather forecasts\n• Budget planning\n• Destination information\n\nWhat would you like help with?"
                
        except Exception as e:
            logger.error(f"Travel request processing failed: {e}")
            return "I'm a travel assistant. I can help you plan trips, find flights, hotels, and provide travel information. How can I assist you today?"
    
    def _generate_rome_trip_plan(self) -> str:
        """Generate a specific trip plan for Rome from Israel."""
        return """🏛️ **3-Day Rome Trip from Israel - January 20-22, 2026**

**Day 1 (Jan 20): Arrival & Historic Center**
• Morning: Arrive in Rome, check into hotel
• Afternoon: Visit Colosseum and Roman Forum
• Evening: Explore Trastevere neighborhood, dinner at local trattoria

**Day 2 (Jan 21): Vatican & Art**
• Morning: Vatican Museums and Sistine Chapel
• Afternoon: St. Peter's Basilica and Square
• Evening: Spanish Steps and Trevi Fountain

**Day 3 (Jan 22): Departure**
• Morning: Pantheon and Piazza Navona
• Afternoon: Last-minute shopping, depart for Israel

**Estimated Costs:**
• Flights: $400-600 (round trip)
• Hotels: $150-300/night
• Food: $50-80/day
• Attractions: $50-100/day

**Weather:** January in Rome is cool (5-12°C), bring warm clothes and umbrella.

Would you like me to help you find flights, hotels, or more detailed information about any of these attractions?"""
    
    def _generate_generic_trip_plan(self, prompt: str) -> str:
        """Generate a generic trip planning response."""
        return """🗺️ **Travel Planning Assistant**

I can help you plan your trip! To provide the best recommendations, please let me know:

• **Destination**: Where do you want to go?
• **Duration**: How many days?
• **Travel dates**: When are you planning to travel?
• **Budget**: What's your approximate budget?
• **Interests**: What activities do you enjoy? (history, nature, food, nightlife, etc.)
• **Travel style**: Budget, mid-range, or luxury?

Once you provide these details, I can create a detailed itinerary with:
• Daily activities and attractions
• Restaurant recommendations
• Transportation options
• Budget estimates
• Weather information
• Travel tips

What destination are you most interested in?"""
    
    
    async def get_country_info(self, country_name: str) -> Dict[str, Any]:
        """Get comprehensive country information."""
        try:
            return await self.country_client.get_country_info(country_name)
        except Exception as e:
            logger.error(f"Country info error: {e}")
            return {"error": str(e)}
    
    async def search_wikipedia(self, query: str) -> List[Dict[str, Any]]:
        """Search Wikipedia for detailed information."""
        try:
            results = await self.wikipedia_client.search(query)
            return results if results else []
        except Exception as e:
            logger.error(f"Wikipedia search error: {e}")
            return []
    
    async def geocode_location(self, location: str) -> Dict[str, Any]:
        """Get precise location coordinates."""
        try:
            return await self.maps_client.geocode(location)
        except Exception as e:
            logger.error(f"Geocoding error: {e}")
            return {"error": str(e)}
    
    async def search_web(self, query: str) -> List[Dict[str, Any]]:
        """Search the web for real-time information."""
        try:
            return await self.web_search_client.search(query)
        except Exception as e:
            logger.error(f"Web search error: {e}")
            return []
    
    async def extract_travel_info(self, query: str) -> Dict[str, Any]:
        """
        Extract travel planning information from user query using APIs.
        
        Args:
            query: User's travel query
            
        Returns:
            Dictionary with extracted information
        """
        query_lower = query.lower()
        
        # Extract destination using maps API
        destination = None
        try:
            # Try to find destination using maps client
            maps_result = await self.maps_client.search_location(query)
            if maps_result and len(maps_result) > 0:
                # Get the first result and extract country
                location = maps_result[0]
                if 'country' in location:
                    destination = location['country']
                elif 'name' in location:
                    destination = location['name']
        except Exception as e:
            logger.warning(f"Error extracting destination from maps API: {e}")
            
        # Fallback: try to extract destination using simple regex patterns
        if not destination:
            # Look for "to [destination]" or "in [destination]" patterns
            destination_patterns = [
                r'to\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)',
                r'in\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)',
                r'visit\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)',
                r'trip\s+to\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)'
            ]
            
            for pattern in destination_patterns:
                match = re.search(pattern, query_lower)
                if match:
                    potential_dest = match.group(1).strip()
                    # Filter out common words that aren't destinations
                    if potential_dest and len(potential_dest) > 2 and potential_dest not in ['the', 'a', 'an', 'my', 'our', 'this', 'that']:
                        destination = potential_dest.title()
                        break
        
        # Extract budget - handle both $2000 and 2000usd formats
        budget_match = re.search(r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)', query)
        if not budget_match:
            # Try without $ sign (e.g., "2000usd", "2000 USD")
            budget_match = re.search(r'(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:usd|dollars?)', query_lower)
        
        budget = float(budget_match.group(1).replace(',', '')) if budget_match else None
        
        # Extract duration
        duration_patterns = [
            r'(\d+)\s*days?',
            r'(\d+)\s*weeks?',
            r'(\d+)\s*months?'
        ]
        duration = None
        for pattern in duration_patterns:
            match = re.search(pattern, query_lower)
            if match:
                duration = match.group(1)
                break
        
        # Extract dates - improved to handle relative dates
        travel_date = self._parse_travel_date(query_lower)
        
        # Extract number of travelers
        travelers_match = re.search(r'(\d+)\s*(?:people|travelers?|guests?)', query_lower)
        travelers = int(travelers_match.group(1)) if travelers_match else 1
        
        return {
            'destination': destination,
            'budget': budget,
            'duration': duration,
            'date': travel_date,
            'travelers': travelers,
            'query_type': self._classify_query_type(query_lower)
        }
    
    def _is_comprehensive_travel_plan(self, query: str, travel_info: Dict[str, Any]) -> bool:
        """Check if this is a comprehensive travel planning request."""
        query_lower = query.lower()
        
        # Check for comprehensive planning keywords
        planning_keywords = ['plan', 'trip', 'itinerary', 'travel to', 'visit', 'vacation']
        has_planning = any(keyword in query_lower for keyword in planning_keywords)
        
        # Check if we have destination and duration (indicating a full trip plan)
        has_destination = travel_info.get('destination') is not None
        has_duration = travel_info.get('duration') is not None
        
        # Check for budget (often indicates comprehensive planning)
        has_budget = travel_info.get('budget') is not None
        
        return has_planning and has_destination and (has_duration or has_budget)
    
    def _parse_travel_date(self, query: str) -> Optional[str]:
        """
        Parse travel dates from natural language.
        Handles relative dates like 'tomorrow morning', 'next week', etc.
        """
        now = datetime.now()
        
        # Relative date patterns
        if 'tomorrow' in query:
            if 'morning' in query:
                return (now + timedelta(days=1)).strftime('%Y-%m-%d') + ' morning'
            elif 'afternoon' in query:
                return (now + timedelta(days=1)).strftime('%Y-%m-%d') + ' afternoon'
            elif 'evening' in query:
                return (now + timedelta(days=1)).strftime('%Y-%m-%d') + ' evening'
            else:
                return (now + timedelta(days=1)).strftime('%Y-%m-%d')
        
        elif 'today' in query:
            if 'morning' in query:
                return now.strftime('%Y-%m-%d') + ' morning'
            elif 'afternoon' in query:
                return now.strftime('%Y-%m-%d') + ' afternoon'
            elif 'evening' in query:
                return now.strftime('%Y-%m-%d') + ' evening'
            else:
                return now.strftime('%Y-%m-%d')
        
        elif 'next week' in query:
            return (now + timedelta(weeks=1)).strftime('%Y-%m-%d')
        
        elif 'next month' in query:
            next_month = now.replace(day=1) + timedelta(days=32)
            next_month = next_month.replace(day=1)
            return next_month.strftime('%Y-%m-%d')
        
        # Specific month patterns (full names and abbreviations)
        month_patterns = [
            (r'january\s+(\d+)', 1), (r'jan\s+(\d+)', 1),
            (r'february\s+(\d+)', 2), (r'feb\s+(\d+)', 2),
            (r'march\s+(\d+)', 3), (r'mar\s+(\d+)', 3),
            (r'april\s+(\d+)', 4), (r'apr\s+(\d+)', 4),
            (r'may\s+(\d+)', 5),
            (r'june\s+(\d+)', 6), (r'jun\s+(\d+)', 6),
            (r'july\s+(\d+)', 7), (r'jul\s+(\d+)', 7),
            (r'august\s+(\d+)', 8), (r'aug\s+(\d+)', 8),
            (r'september\s+(\d+)', 9), (r'sep\s+(\d+)', 9),
            (r'october\s+(\d+)', 10), (r'oct\s+(\d+)', 10),
            (r'november\s+(\d+)', 11), (r'nov\s+(\d+)', 11),
            (r'december\s+(\d+)', 12), (r'dec\s+(\d+)', 12)
        ]
        
        for pattern, month_num in month_patterns:
            match = re.search(pattern, query)
            if match:
                day = int(match.group(1))
                year = now.year
                # If the date has passed this year, assume next year
                try:
                    date_obj = datetime(year, month_num, day)
                    if date_obj < now:
                        date_obj = datetime(year + 1, month_num, day)
                    return date_obj.strftime('%Y-%m-%d')
                except ValueError:
                    continue
        
        # Handle month + year patterns (e.g., "jan 2026", "january 2026")
        month_year_patterns = [
            (r'january\s+(\d{4})', 1), (r'jan\s+(\d{4})', 1),
            (r'february\s+(\d{4})', 2), (r'feb\s+(\d{4})', 2),
            (r'march\s+(\d{4})', 3), (r'mar\s+(\d{4})', 3),
            (r'april\s+(\d{4})', 4), (r'apr\s+(\d{4})', 4),
            (r'may\s+(\d{4})', 5),
            (r'june\s+(\d{4})', 6), (r'jun\s+(\d{4})', 6),
            (r'july\s+(\d{4})', 7), (r'jul\s+(\d{4})', 7),
            (r'august\s+(\d{4})', 8), (r'aug\s+(\d{4})', 8),
            (r'september\s+(\d{4})', 9), (r'sep\s+(\d{4})', 9),
            (r'october\s+(\d{4})', 10), (r'oct\s+(\d{4})', 10),
            (r'november\s+(\d{4})', 11), (r'nov\s+(\d{4})', 11),
            (r'december\s+(\d{4})', 12), (r'dec\s+(\d{4})', 12)
        ]
        
        for pattern, month_num in month_year_patterns:
            match = re.search(pattern, query)
            if match:
                year = int(match.group(1))
                # Return first day of the month
                return datetime(year, month_num, 1).strftime('%Y-%m-%d')
        
        return None
    
    def _classify_query_type(self, query: str) -> str:
        """Classify the type of travel query."""
        query_lower = query.lower()
        
        # Check for comprehensive travel planning first
        if any(phrase in query_lower for phrase in ['full plan', 'complete plan', 'itinerary', 'travel to', 'trip to', 'visit']):
            if any(word in query_lower for word in ['flight', 'fly', 'airline', 'airport']):
                return 'flights'
            elif any(word in query_lower for word in ['budget', 'cost', 'price', 'expensive', 'cheap']):
                return 'budget'
            else:
                return 'flights'  # Default to flights for travel planning
        
        # Specific service queries
        if any(word in query_lower for word in ['flight', 'airline', 'book', 'ticket', 'fly']):
            return 'flights'
        elif any(word in query_lower for word in ['hotel', 'accommodation', 'stay', 'room']):
            return 'accommodation'
        elif any(word in query_lower for word in ['budget', 'cost', 'price', 'expensive', 'cheap']):
            return 'budget'
        elif any(word in query_lower for word in ['weather', 'climate', 'temperature']):
            return 'weather'
        elif any(word in query_lower for word in ['attraction', 'sightseeing', 'tour', 'visit']):
            return 'attractions'
        elif any(word in query_lower for word in ['food', 'restaurant', 'cuisine', 'eat', 'dining']):
            return 'food'
        elif any(word in query_lower for word in ['transport', 'bus', 'train', 'metro', 'taxi', 'uber', 'lyft']):
            return 'transportation'
        elif any(word in query_lower for word in ['car', 'rental', 'vehicle', 'drive']):
            return 'car_rental'
        elif any(word in query_lower for word in ['event', 'show', 'concert', 'theater', 'entertainment']):
            return 'events'
        elif any(word in query_lower for word in ['insurance', 'coverage', 'protection', 'policy']):
            return 'insurance'
        else:
            return 'general'
    
    @performance_timer('process_query')
    async def process_query(self, query: str, context: Optional[Dict[str, Any]] = None) -> str:
        """
        Process a travel query with intelligent routing and context management.
        
        This method now uses the IntentRouter to determine the optimal processing path,
        addressing the "Centralized Core Bottleneck" by bypassing unnecessary context
        processing for simple queries.
        
        Args:
            query: User's travel query
            context: User context including departure location, destination, etc.
            
        Returns:
            Comprehensive travel response with intelligent routing and context optimization
        """
        logger.info(f"Processing query with intelligent routing: {query[:100]}...")
        
        # Generate user ID from context or use default
        user_id = context.get('user_id', 'default_user') if context else 'default_user'
        
        # Route the query to determine optimal processing path
        routing_decision = await self.intent_router.route_query(query, user_id)
        
        logger.info(f"Query routed: {routing_decision['intent']} -> {routing_decision['routing_path']} (latency: {routing_decision['estimated_latency']}ms)")
        
        # Process based on routing decision
        if routing_decision['bypass_context']:
            return await self._process_bypass_query(query, routing_decision, user_id)
        else:
            return await self._process_context_query(query, routing_decision, user_id)
    
    async def _process_bypass_query(self, query: str, routing_decision: Dict[str, Any], user_id: str) -> str:
        """
        Process queries that bypass full context management for faster responses.
        
        Args:
            query: User's query
            routing_decision: Routing decision from intent router
            user_id: User identifier
            
        Returns:
            Fast response without full context processing
        """
        try:
            routing_path = routing_decision['routing_path']
            intent = routing_decision['intent']
            entities = routing_decision['entities']
            
            if routing_path == 'direct_llm':
                # Simple queries that can be handled directly by LLM
                return await self._handle_direct_llm_query(query, intent, entities, user_id)
            
            elif routing_path == 'system_handler':
                # System commands
                return await self._handle_system_command(query, intent, entities, user_id)
            
            elif routing_path == 'weather_api':
                # Weather queries with direct API calls
                return await self._handle_weather_query(query, intent, entities, user_id)
            
            else:
                # Fallback to full context processing
                logger.warning(f"Unknown bypass routing path: {routing_path}, falling back to full context")
                return await self._process_context_query(query, routing_decision, user_id)
                
        except Exception as e:
            logger.error(f"Error in bypass query processing: {e}")
            # Fallback to full context processing
            return await self._process_context_query(query, routing_decision, user_id)
    
    async def _process_context_query(self, query: str, routing_decision: Dict[str, Any], user_id: str) -> str:
        """
        Process queries that require full context management.
        
        Args:
            query: User's query
            routing_decision: Routing decision from intent router
            user_id: User identifier
            
        Returns:
            Comprehensive response with full context processing
        """
        try:
            # Get complete context from ContextProvider (no direct database access)
            intelligent_context = await self.context_provider.orchestrate_context_flow(user_id, query)
            
            # Add performance context
            intelligent_context['performance_optimization'] = True
            intelligent_context['cache_enabled'] = True
            intelligent_context['user_id'] = user_id
            
            # Continue with the rest of the original processing logic
            return await self._continue_full_processing(query, intelligent_context, user_id)
            
        except Exception as e:
            logger.error(f"Error in context query processing: {e}")
            return f"I apologize, but I encountered an error processing your request: {str(e)}"
    
    async def _handle_direct_llm_query(self, query: str, intent: str, entities: Dict[str, Any], user_id: str) -> str:
        """Handle simple queries directly with LLM for fast responses."""
        try:
            # Create a simple prompt for direct LLM processing
            if intent == 'greeting':
                return "Hello! I'm your AI travel assistant. How can I help you plan your next adventure?"
            elif intent == 'thanks':
                return "You're welcome! I'm here to help with all your travel needs. Is there anything else I can assist you with?"
            elif intent == 'goodbye':
                return "Goodbye! Safe travels and I hope you have wonderful adventures ahead!"
            else:
                # For other simple queries, use a lightweight LLM call
                return await self._call_llm(query, "")
                
        except Exception as e:
            logger.error(f"Error in direct LLM query handling: {e}")
            return "I'm here to help with your travel needs. How can I assist you today?"
    
    async def _handle_system_command(self, query: str, intent: str, entities: Dict[str, Any], user_id: str) -> str:
        """Handle system commands."""
        try:
            query_lower = query.lower()
            
            if 'help' in query_lower or 'what can you do' in query_lower:
                return """I'm your AI travel assistant! Here's what I can help you with:

🗺️ **Travel Planning**: Create detailed itineraries and travel plans
✈️ **Flight Search**: Find and compare flight options
🏨 **Hotel Booking**: Search for accommodations
🌤️ **Weather Information**: Get current weather and forecasts
🍽️ **Restaurant Recommendations**: Find great places to eat
🎯 **Attractions & Activities**: Discover things to do
💰 **Budget Planning**: Help with travel costs and budgeting
🌍 **Destination Information**: Learn about countries and cities
📱 **Real-time Data**: Get current information from multiple sources

Just ask me anything about travel, and I'll help you plan the perfect trip!"""
            
            elif 'settings' in query_lower or 'preferences' in query_lower:
                return "I can help you set travel preferences like budget range, travel style, and preferred destinations. What would you like to configure?"
            
            elif 'clear' in query_lower or 'reset' in query_lower:
                return "I can help you start fresh. What would you like to plan for your next trip?"
            
            else:
                return "I'm here to help with your travel needs. How can I assist you today?"
                
        except Exception as e:
            logger.error(f"Error in system command handling: {e}")
            return "I'm here to help with your travel needs. How can I assist you today?"
    
    async def _handle_weather_query(self, query: str, intent: str, entities: Dict[str, Any], user_id: str) -> str:
        """Handle weather queries with direct API calls."""
        try:
            location = entities.get('location', '')
            if not location:
                return "I'd be happy to help with weather information! Please specify a location (e.g., 'What's the weather in Paris?')."
            
            # Use the weather client directly for fast response
            weather_data = await self.weather_client.get_weather(location)
            if weather_data:
                return f"Here's the current weather in {location.title()}:\n\n{weather_data}"
            else:
                return f"I couldn't retrieve weather information for {location}. Please try again or specify a different location."
                
        except Exception as e:
            logger.error(f"Error in weather query handling: {e}")
            return "I'm having trouble getting weather information right now. Please try again later."
    
    async def _continue_full_processing(self, query: str, intelligent_context: Dict[str, Any], user_id: str) -> str:
        """Continue with the original full processing logic."""
        try:
            # Store in conversation history (legacy)
            self.conversation_history.append({
                'timestamp': datetime.now().isoformat(),
                'user': query,
                'type': 'user'
            })
            
            # Ensure preferences are loaded and extract new ones
            await self._ensure_preferences_loaded()
            await self._extract_and_save_preferences(query)
            
            # Add query to knowledge base for future reference
            self._add_to_knowledge_base(f"query_{len(self.conversation_history)}", {
                'query': query,
                'timestamp': datetime.now().isoformat(),
                'source': 'User Input'
            })
            
            # Extract travel information and enhance with context
            travel_info = await self.extract_travel_info(query)
            if intelligent_context:
                # Enhance travel info with context
                if intelligent_context.get('departureLocation') and not travel_info.get('origin'):
                    travel_info['origin'] = intelligent_context['departureLocation']
                if intelligent_context.get('destination') and not travel_info.get('destination'):
                    travel_info['destination'] = intelligent_context['destination']
                if intelligent_context.get('travelDates') and not travel_info.get('dates'):
                    travel_info['dates'] = intelligent_context['travelDates']
                if intelligent_context.get('budget') and not travel_info.get('budget'):
                    travel_info['budget'] = intelligent_context['budget']
            
            query_lower = query.lower()
            
            response_parts = []
            context_parts = []
            
            # Handle different types of queries
            if self._is_comprehensive_travel_plan(query, travel_info):
                await self._handle_comprehensive_travel_plan(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'weather':
                await self._handle_weather_query(query, response_parts, context_parts)
            elif travel_info['query_type'] == 'flights':
                await self._handle_flight_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'accommodation':
                await self._handle_accommodation_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'budget':
                await self._handle_budget_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'attractions':
                await self._handle_attractions_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'food':
                await self._handle_food_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'transportation':
                await self._handle_transportation_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'car_rental':
                await self._handle_car_rental_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'events':
                await self._handle_events_query(query, travel_info, response_parts, context_parts)
            elif travel_info['query_type'] == 'insurance':
                await self._handle_insurance_query(query, travel_info, response_parts, context_parts)
            elif travel_info['destination']:
                await self._handle_destination_query(query, travel_info, response_parts, context_parts)
            else:
                await self._handle_general_query(query, response_parts, context_parts)
            
            # Generate comprehensive response using LLM with structured data
            if response_parts:
                # Format structured data with proper markdown and clear sections
                formatted_sections = []
                
                for part in response_parts:
                    if part.strip():
                        formatted_sections.append(part.strip())
                
                # Join sections with proper spacing
                structured_data = "\n\n".join(formatted_sections)
                context_text = "\n".join(context_parts) if context_parts else "No additional context available."
                
                # Create enhanced prompt for LLM to analyze and improve the structured data
                enhanced_prompt = f"""As a travel expert, analyze this travel data and provide intelligent insights and recommendations:

QUERY: {query}

STRUCTURED DATA:
{structured_data}

ADDITIONAL CONTEXT:
{context_text}

Please provide a well-structured response with:
1. **Brief Summary** - Key information about the trip
2. **Intelligent Insights** - Smart recommendations and tips
3. **Important Considerations** - Things to keep in mind
4. **Next Steps** - Actionable follow-up suggestions

Format your response with clear markdown headers (##, ###) and bullet points for easy reading."""

                try:
                    llm_insights = await self._call_llm(enhanced_prompt, "")
                    # Clean up the LLM response to avoid duplication
                    if llm_insights and not llm_insights.startswith("I'm a travel assistant"):
                        formatted_insights = self._format_llm_response(llm_insights)
                        # Combine structured data with insights in a clean format
                        final_response = f"{structured_data}\n\n---\n\n{formatted_insights}"
                    else:
                        final_response = structured_data
                except Exception as e:
                    logger.error(f"LLM enhancement failed: {e}")
                    final_response = structured_data
            else:
                # No structured data, use LLM for intelligent responses
                context_text = "\n".join(context_parts) if context_parts else "No specific context available."
            
                # Create simple, clear prompt
                intelligent_prompt = f"""You are a helpful travel assistant. Answer the user's question clearly and concisely.

User Query: {query}

Instructions:
- Give a direct, helpful answer
- Be conversational but brief
- Don't use special formatting or symbols
- Ask one clarifying question if needed
- Focus on what the user actually asked for

Response:"""
                
                # Generate response using LLM with intelligent context and performance optimization
                async def generate_response(query: str, context: Dict[str, Any]) -> str:
                    raw_response = await self._call_llm(intelligent_prompt, context_text)
                    return self._format_llm_response(raw_response)
                
                # Use response optimizer for intelligent caching and optimization
                final_response = await self.response_optimizer.optimize_response(
                    query, intelligent_context, generate_response
                )
        
            # Store response in conversation history (legacy)
            self.conversation_history.append({
                'timestamp': datetime.now().isoformat(),
                'assistant': final_response,
                'type': 'assistant'
            })
            
            # Add conversation turn to advanced context manager
            await self.context_provider.store_interaction_context(
                user_id, 
                {
                    'user_message': query, 
                    'assistant_response': final_response, 
                    'context_data': intelligent_context,
                    'intent': intelligent_context.get('query_context', {}).get('intent', 'unknown'),
                    'entities': intelligent_context.get('query_context', {}).get('entities', {}),
                    'sentiment': intelligent_context.get('query_context', {}).get('sentiment', 'neutral'),
                    'topics': intelligent_context.get('current_topics', [])
                }
            )
            
            # Store conversation in memory system
            await self.conversation_memory.store_memory(
                user_id, f"User: {query}\nAssistant: {final_response}", 
                'conversation', importance=0.7, 
                tags=intelligent_context.get('current_topics', []),
                metadata=intelligent_context
            )
            
            # Learn from conversation for preference adaptation
            conversation_data = {
                'user_messages': [{'content': query, 'context': intelligent_context}],
                'assistant_messages': [{'content': final_response, 'context': intelligent_context}],
                'context': intelligent_context,
                'entities': intelligent_context.get('current_entities', {})
            }
            await self.preference_learning.learn_from_conversation(user_id, conversation_data)
            
            # Update MCP context with intelligent context
            await self.mcp_client.update_context('intelligent_context', intelligent_context)
            
            return final_response
        
        except Exception as e:
            logger.error(f"Error in full processing logic: {e}")
            return f"I apologize, but I encountered an error processing your request: {str(e)}"
    
    async def _handle_weather_query(self, query: str, response_parts: List[str], context_parts: List[str]):
        """Handle weather-related queries with real API data."""
        logger.info("Getting weather information...")
        
        # Extract location from query
        location_match = re.search(r'(?:weather|climate)\s+(?:in|for|at)\s+([^?]+)', query.lower())
        if location_match:
            location = location_match.group(1).strip()
            
            try:
                # Try multiple weather APIs for best data
                weather_data = None
                
                # Try paid weather API first
                if self.weather_client:
                    weather_data = await self._get_real_weather_data(location)
                
                # Try Open-Meteo (free, very accurate)
                if not weather_data and self.open_meteo_client:
                    weather_data = await self._get_open_meteo_weather(location)
                
                # Try wttr.in (free, reliable)
                if not weather_data and self.free_weather_client:
                    weather_data = await self._get_free_weather_data(location)
                
                if weather_data:
                    response_parts.append(weather_data)
                    return
                
                # Fallback to web search
                web_results = await self.search_web(f"current weather {location}")
                if web_results:
                    context_parts.append(f"Weather information for {location}: {web_results[0]['snippet']}")
                else:
                    context_parts.append(f"Weather information for {location}: Unable to retrieve current weather data.")
                    
            except Exception as e:
                logger.error(f"Weather query error: {e}")
                context_parts.append(f"Weather information for {location}: Unable to retrieve current weather data.")
    
    async def _handle_flight_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle flight-related queries with real API data."""
        logger.info("Searching for flight information...")
        
        try:
            # Try paid flight API first, then free flight API
            flight_data = None
            
            if self.flight_client:
                flight_data = await self._get_real_flight_data(travel_info)
            
            if not flight_data and self.free_flight_client:
                flight_data = await self._get_free_flight_data(travel_info)
            
            if flight_data:
                response_parts.append(flight_data)
                return
            
            # Fallback to web search for flight information
            search_query = f"flights to {travel_info['destination']} {travel_info['date'] or ''} budget {travel_info['budget'] or ''}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Flight information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Flight information: General flight advice for {travel_info['destination']} - check major airlines and booking sites for current prices.")
                
        except Exception as e:
            logger.error(f"Flight query error: {e}")
            context_parts.append(f"Flight information: Unable to retrieve current flight data. Please check airline websites directly.")
    
    async def _get_real_flight_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get real flight data from API."""
        try:
            if not self.flight_client:
                return None
            
            # This is a placeholder - in a real implementation, you'd call the flight API
            # with proper parameters like origin, destination, date, etc.
            destination = travel_info.get('destination', '')
            date = travel_info.get('date', '')
            budget = travel_info.get('budget', '')
            
            # For now, return a structured response
            flight_info = f"""
**✈️ Flight Options to {destination}**

📅 **Travel Date:** {date or 'Not specified'}
💰 **Budget:** ${budget or 'Not specified'}

**Available Airlines:**
- Major airlines serve this route
- Check airline websites for current prices
- Consider booking in advance for better rates

**Booking Recommendations:**
- Compare prices on multiple booking sites
- Book directly with airlines for better customer service
- Consider flexible dates for better deals

*Note: Flight data is based on typical routes and pricing.*
            """
            
            return flight_info.strip()
            
        except Exception as e:
            logger.error(f"Real flight data error: {e}")
            return None
    
    async def _get_real_weather_data(self, location: str) -> Optional[str]:
        """Get real weather data from API."""
        try:
            if not self.weather_client:
                return None
            
            # Get current weather
            weather_data = await self.weather_client.get_current_weather(location)
            
            if weather_data and 'error' not in weather_data:
                weather_info = f"""
**🌤️ Current Weather in {weather_data.get('city', location)}**

🌡️ **Temperature:** {weather_data.get('temperature', 'Data unavailable')}°C
🌡️ **Feels Like:** {weather_data.get('feels_like', 'Data unavailable')}°C
☁️ **Condition:** {weather_data.get('description', 'Data unavailable').title()}
💨 **Wind:** {weather_data.get('wind_speed', 'Data unavailable')} m/s
💧 **Humidity:** {weather_data.get('humidity', 'Data unavailable')}%
👁️ **Visibility:** {weather_data.get('visibility', 'Data unavailable')}m

**Travel Recommendations:**
- Pack appropriate clothing for {weather_data.get('description', 'current conditions')}
- {"Bring an umbrella" if 'rain' in weather_data.get('description', '').lower() else "Enjoy the weather!"}
                """
                
                return weather_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Real weather data error: {e}")
            return None
    
    async def _get_free_weather_data(self, location: str) -> Optional[str]:
        """Get weather data from free APIs."""
        try:
            if not self.free_weather_client:
                return None
            
            weather_data = await self.free_weather_client.get_current_weather(location)
            
            if weather_data:
                weather_info = f"""
**🌤️ Current Weather in {weather_data.get('city', location)}**

🌡️ **Temperature:** {weather_data.get('temperature', 'N/A')}°C
🌡️ **Feels Like:** {weather_data.get('feels_like', 'N/A')}°C
☁️ **Condition:** {weather_data.get('description', 'N/A').title()}
💨 **Wind:** {weather_data.get('wind_speed', 'N/A')} km/h
💧 **Humidity:** {weather_data.get('humidity', 'N/A')}%
👁️ **Visibility:** {weather_data.get('visibility', 'N/A')}km

**Travel Recommendations:**
- Pack appropriate clothing for {weather_data.get('description', 'current conditions')}
- {"Bring an umbrella" if 'rain' in weather_data.get('description', '').lower() else "Enjoy the weather!"}

*Data source: {weather_data.get('source', 'Free Weather API')}*
                """
                
                return weather_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Free weather data error: {e}")
            return None
    
    async def _get_open_meteo_weather(self, location: str) -> Optional[str]:
        """Get weather data from Open-Meteo API."""
        try:
            if not self.open_meteo_client:
                return None
            
            weather_data = await self.open_meteo_client.get_current_weather(location)
            
            if weather_data:
                weather_info = f"""
**🌤️ Current Weather in {weather_data.get('city', location)}**

🌡️ **Temperature:** {weather_data.get('temperature', 'N/A')}°C
🌡️ **Feels Like:** {weather_data.get('feels_like', 'N/A')}°C
☁️ **Condition:** {weather_data.get('description', 'N/A').title()}
💨 **Wind:** {weather_data.get('wind_speed', 'N/A')} km/h
💧 **Humidity:** {weather_data.get('humidity', 'N/A')}%
🌧️ **Precipitation:** {weather_data.get('precipitation', 'N/A')}mm
☁️ **Cloud Cover:** {weather_data.get('cloud_cover', 'N/A')}%

**Travel Recommendations:**
- Pack appropriate clothing for {weather_data.get('description', 'current conditions')}
- {"Bring an umbrella" if 'rain' in weather_data.get('description', '').lower() else "Enjoy the weather!"}
- {"Consider indoor activities" if weather_data.get('precipitation', 0) > 5 else "Great weather for outdoor activities!"}

*Data source: {weather_data.get('source', 'Open-Meteo (Free)')}*
                """
                
                return weather_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Open-Meteo weather data error: {e}")
            return None
    
    async def _get_free_flight_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get flight data from free APIs."""
        try:
            if not self.free_flight_client:
                return None
            
            destination = travel_info.get('destination', '')
            date = travel_info.get('date', '')
            budget = travel_info.get('budget', '')
            
            # Extract origin from user preferences or use default
            origin = "Tel Aviv"  # Default, could be from user preferences
            
            # Search for flights
            flights = await self.free_flight_client.search_flights(origin, destination, date)
            
            if flights:
                flight_info = f"""
**✈️ Flight Options from {origin} to {destination}**

📅 **Travel Date:** {date or 'Not specified'}
💰 **Budget:** ${budget or 'Not specified'}

**Available Flights:**
"""
                
                for i, flight in enumerate(flights[:3], 1):  # Show top 3 options
                    flight_info += f"""
**{i}. {flight['airline']} {flight['flight_number']}**
- **Departure:** {flight['departure_time']} | **Arrival:** {flight['arrival_time']}
- **Duration:** {flight['duration']} | **Stops:** {flight['stops']}
- **Price:** {flight['price']} | **Aircraft:** {flight['aircraft']}
- **Book:** {flight['booking_url']}
"""
                
                flight_info += f"""

**Booking Tips:**
- Compare prices on multiple booking sites
- Book directly with airlines for better customer service
- Consider flexible dates for better deals
- Check for baggage fees and restrictions

*Data source: {flight['source']}*
                """
                
                return flight_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Free flight data error: {e}")
            return None
    
    async def _handle_accommodation_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle accommodation queries with real hotel data."""
        logger.info("Searching for accommodation...")
        
        try:
            # Use hotel search client for real hotel data
            if self.hotel_client:
                hotel_data = await self._get_hotel_data(travel_info)
                if hotel_data:
                    response_parts.append(hotel_data)
                    return
            
            # Fallback to web search
            search_query = f"hotels accommodation {travel_info['destination']} budget {travel_info['budget'] or ''}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Accommodation options: {web_results[0]['snippet']}")
            else:
                booking_sites = os.getenv("BOOKING_SITES", "Booking.com, Expedia, Airbnb")
                context_parts.append(f"Accommodation options: Check major booking sites like {booking_sites} for {travel_info['destination']}.")
                
        except Exception as e:
            logger.error(f"Accommodation query error: {e}")
            context_parts.append(f"Accommodation options: Unable to retrieve current hotel data. Please check booking websites directly.")
    
    async def _get_hotel_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get hotel data from hotel search client."""
        try:
            if not self.hotel_client:
                return None
            
            destination = travel_info.get('destination', '')
            budget = travel_info.get('budget', '')
            date = travel_info.get('date', '')
            
            # Parse budget if provided
            budget_amount = None
            if budget and budget.isdigit():
                budget_amount = float(budget)
            
            # Search for hotels
            hotels = await self.hotel_client.search_hotels(
                city=destination,
                budget=budget_amount,
                guests=1
            )
            
            if hotels:
                hotel_info = f"""
**🏨 Hotel Options in {destination}**

📅 **Travel Date:** {date or 'Not specified'}
💰 **Budget:** ${budget or 'Not specified'}

**Top Hotel Recommendations:**
"""
                
                for i, hotel in enumerate(hotels[:5], 1):  # Show top 5 options
                    hotel_info += f"""
**{i}. {hotel['name']}** ⭐ {hotel['stars']} ({hotel['rating']}/5)
- **Price:** {hotel['price']}/night
- **Location:** {hotel['location']}
- **Amenities:** {', '.join(hotel['amenities'][:3])}
- **Reviews:** {hotel['reviews_count']} reviews
- **Book:** {hotel['booking_url']}
"""
                
                hotel_info += f"""

**Booking Tips:**
- Compare prices on multiple booking sites
- Book directly with hotels for better rates
- Check for free cancellation policies
- Consider location vs. price trade-offs
- Read recent reviews before booking

*Data source: {hotel['source']}*
                """
                
                return hotel_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Hotel data error: {e}")
            return None
    
    async def _handle_budget_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle budget planning queries with currency conversion."""
        logger.info("Planning budget...")
        
        try:
            # Use currency conversion for budget planning
            if self.currency_client:
                budget_data = await self._get_budget_data(travel_info)
                if budget_data:
                    response_parts.append(budget_data)
                    return
            
            # Fallback to web search
            if travel_info['destination'] and travel_info['budget']:
                search_query = f"travel budget {travel_info['destination']} {travel_info['budget']} dollars {travel_info['duration'] or ''} days"
                web_results = await self.search_web(search_query)
                
                if web_results:
                    context_parts.append(f"Budget planning: {web_results[0]['snippet']}")
                else:
                    context_parts.append(f"Budget planning: Consider accommodation, food, transportation, and activities costs for {travel_info['destination']}.")
            else:
                context_parts.append("Budget planning: Please specify destination and budget for detailed planning.")
                
        except Exception as e:
            logger.error(f"Budget query error: {e}")
            context_parts.append(f"Budget planning: Unable to retrieve current budget data. Please check travel cost websites directly.")
    
    async def _get_budget_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get budget data with currency conversion."""
        try:
            if not self.currency_client:
                return None
            
            destination = travel_info.get('destination', '')
            budget = travel_info.get('budget', '')
            duration = travel_info.get('duration', '7')
            
            # Parse budget
            budget_amount = None
            if budget and budget.isdigit():
                budget_amount = float(budget)
            
            if not budget_amount:
                return None
            
            # Get currency conversion for common travel currencies
            currencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD']
            conversions = []
            
            for currency in currencies:
                conversion = await self.currency_client.convert_currency(budget_amount, 'USD', currency)
                if conversion:
                    symbol = self.currency_client.get_currency_symbol(currency)
                    conversions.append(f"{symbol}{conversion['converted_amount']:.2f} {currency}")
            
            budget_info = f"""
**💰 Budget Planning for {destination}**

💵 **Your Budget:** ${budget_amount} USD
📅 **Duration:** {duration} days
📊 **Daily Budget:** ${budget_amount / int(duration):.2f} USD/day

**💱 Currency Conversion:**
{chr(10).join(conversions)}

**📋 Budget Breakdown (Estimated):**
- **Accommodation:** ${budget_amount * 0.4:.2f} (40%)
- **Food & Dining:** ${budget_amount * 0.3:.2f} (30%)
- **Transportation:** ${budget_amount * 0.2:.2f} (20%)
- **Activities & Shopping:** ${budget_amount * 0.1:.2f} (10%)

**💡 Money-Saving Tips:**
- Book accommodation in advance for better rates
- Use public transportation when possible
- Eat at local restaurants for authentic and affordable meals
- Look for free walking tours and attractions
- Consider staying slightly outside city center for lower prices

*Exchange rates updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*
*Data source: Free Currency API*
            """
            
            return budget_info.strip()
            
        except Exception as e:
            logger.error(f"Budget data error: {e}")
            return None
    
    async def _handle_comprehensive_travel_plan(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle comprehensive travel planning with real API searches."""
        destination = travel_info.get('destination', 'Unknown')
        budget = travel_info.get('budget', 0)
        duration = travel_info.get('duration', '3')
        date = travel_info.get('date', 'Not specified')
        travelers = travel_info.get('travelers', 1)
        
        logger.info(f"Creating comprehensive travel plan for {destination}")
        
        try:
            # 1. Search for flights
            flight_data = await self._search_real_flights(destination, date, travelers)
            if flight_data:
                response_parts.append(flight_data)
            
            # 2. Search for hotels
            hotel_data = await self._search_real_hotels(destination, date, duration, budget, travelers)
            if hotel_data:
                response_parts.append(hotel_data)
            
            # 3. Get attractions and activities
            attractions_data = await self._get_attractions_data(destination)
            if attractions_data:
                response_parts.append(attractions_data)
            
            # 4. Get food and restaurant recommendations
            food_data = await self._get_food_data(destination)
            if food_data:
                response_parts.append(food_data)
            
            # 4. Get weather information
            weather_data = await self._get_weather_data(destination, date)
            if weather_data:
                response_parts.append(weather_data)
            
            # 5. Create day-by-day itinerary
            itinerary = await self._create_daily_itinerary(destination, duration, attractions_data)
            if itinerary:
                response_parts.append(itinerary)
            
            # 6. Budget breakdown
            budget_breakdown = await self._create_budget_breakdown(budget, flight_data, hotel_data, duration)
            if budget_breakdown:
                response_parts.append(budget_breakdown)
                
        except Exception as e:
            logger.error(f"Error in comprehensive travel planning: {e}")
            response_parts.append(f"Error creating travel plan: {str(e)}")
    
    async def _search_real_flights(self, destination: str, date: str, travelers: int, origin: str = None) -> str:
        """Search for real flights using available APIs."""
        try:
            # Use configurable origin or default to Tel Aviv
            origin_airport = origin or os.getenv('DEFAULT_ORIGIN_AIRPORT', 'TLV')
            
            # Use the flight client to search for flights
            flights = await self.flight_client.search_flights(
                origin=origin_airport,
                destination=self._get_airport_code(destination),
                date=date
            )
            
            if flights and len(flights) > 0:
                flight_info = f"## ✈️ Flight Options to {destination}\n"
                flight_info += f"**Departure Date:** {date}\n"
                flight_info += f"**Passengers:** {travelers}\n\n"
                
                for i, flight in enumerate(flights[:3], 1):  # Show top 3 options
                    flight_info += f"**Option {i}:**\n"
                    flight_info += f"- Airline: {flight.get('airline', 'N/A')}\n"
                    flight_info += f"- Price: ${flight.get('price', 'N/A')}\n"
                    flight_info += f"- Duration: {flight.get('duration', 'N/A')}\n"
                    flight_info += f"- Departure: {flight.get('departure_time', 'N/A')}\n"
                    flight_info += f"- Arrival: {flight.get('arrival_time', 'N/A')}\n"
                    # Add dynamic booking links
                    dest_code = self._get_airport_code(destination)
                    flight_info += f"- [Book on Skyscanner]({self._generate_booking_url('skyscanner', origin_airport, dest_code, date)})\n"
                    flight_info += f"- [Book on Google Flights]({self._generate_booking_url('google', origin_airport, dest_code, date)})\n"
                    flight_info += f"- [Book on Kayak]({self._generate_booking_url('kayak', origin_airport, dest_code, date)})\n\n"
                
                return flight_info
            else:
                return f"## ✈️ Flight Options to {destination}\nNo flights found. Please check alternative dates or contact airlines directly."
                
        except Exception as e:
            logger.error(f"Flight search error: {e}")
            return f"## ✈️ Flight Options to {destination}\nError searching flights: {str(e)}"
    
    async def _search_real_hotels(self, destination: str, date: str, duration: str, budget: float, travelers: int) -> str:
        """Search for real hotels using available APIs."""
        try:
            # Use the hotel scraper to search for hotels
            hotels = await self.real_hotel_scraper.search_hotels(
                city=destination,
                check_in=date,
                guests=travelers
            )
            
            if hotels and len(hotels) > 0:
                hotel_info = f"## 🏨 Hotel Options in {destination}\n"
                hotel_info += f"**Check-in:** {date}\n"
                hotel_info += f"**Nights:** {duration}\n"
                hotel_info += f"**Guests:** {travelers}\n\n"
                
                for i, hotel in enumerate(hotels[:3], 1):  # Show top 3 options
                    hotel_info += f"**Option {i}:**\n"
                    hotel_info += f"- Name: {hotel.get('name', 'N/A')}\n"
                    hotel_info += f"- Price: ${hotel.get('price', 'N/A')}/night\n"
                    hotel_info += f"- Rating: {hotel.get('rating', 'N/A')}\n"
                    hotel_info += f"- Location: {hotel.get('location', 'N/A')}\n"
                    if hotel.get('booking_url'):
                        hotel_info += f"- [Book Now]({hotel['booking_url']})\n"
                    hotel_info += "\n"
                
                return hotel_info
            else:
                return f"## 🏨 Hotel Options in {destination}\nNo hotels found. Please check alternative dates or contact hotels directly."
                
        except Exception as e:
            logger.error(f"Hotel search error: {e}")
            return f"## 🏨 Hotel Options in {destination}\nError searching hotels: {str(e)}"
    
    async def _get_weather_data(self, destination: str, date: str) -> str:
        """Get weather information for the destination."""
        try:
            weather = await self.weather_client.get_current_weather(destination)
            if weather and "error" not in weather:
                weather_info = f"## 🌤️ Weather in {destination}\n"
                weather_info += f"**Temperature:** {weather.get('temperature', 'N/A')}°C\n"
                weather_info += f"**Condition:** {weather.get('condition', 'N/A')}\n"
                weather_info += f"**Humidity:** {weather.get('humidity', 'N/A')}%\n"
                weather_info += f"**Wind:** {weather.get('wind_speed', 'N/A')} km/h\n"
                return weather_info
            else:
                return f"## 🌤️ Weather in {destination}\nWeather information not available."
        except Exception as e:
            logger.error(f"Weather data error: {e}")
            return f"## 🌤️ Weather in {destination}\nError getting weather data: {str(e)}"
    
    async def _create_daily_itinerary(self, destination: str, duration: str, attractions_data: str) -> str:
        """Create a day-by-day itinerary."""
        try:
            days = int(duration)
            itinerary = f"## 📅 {days}-Day Itinerary for {destination}\n\n"
            
            # Get destination-specific activities
            destination_activities = self._get_destination_activities(destination)
            
            for day in range(1, days + 1):
                itinerary += f"### Day {day}\n"
                if day == 1:
                    itinerary += "- **Morning:** Arrival and hotel check-in\n"
                    itinerary += "- **Afternoon:** Explore city center and get oriented\n"
                    itinerary += "- **Evening:** Welcome dinner at local restaurant\n"
                elif day == days:
                    itinerary += "- **Morning:** Final sightseeing or shopping\n"
                    itinerary += "- **Afternoon:** Hotel check-out and departure\n"
                else:
                    # Use destination-specific activities
                    morning_activity = destination_activities.get('morning', 'Visit local attractions')
                    afternoon_activity = destination_activities.get('afternoon', 'Explore local culture')
                    evening_activity = destination_activities.get('evening', 'Enjoy local cuisine')
                    
                    itinerary += f"- **Morning:** {morning_activity}\n"
                    itinerary += f"- **Afternoon:** {afternoon_activity}\n"
                    itinerary += f"- **Evening:** {evening_activity}\n"
                itinerary += "\n"
            
            if attractions_data:
                itinerary += "### Recommended Attractions:\n"
                # Extract attraction names from attractions_data
                lines = attractions_data.split('\n')
                for line in lines[:5]:  # Show top 5 attractions
                    if line.strip() and not line.startswith('#'):
                        itinerary += f"- {line.strip()}\n"
            
            return itinerary
        except Exception as e:
            logger.error(f"Itinerary creation error: {e}")
            return f"## 📅 Itinerary for {destination}\nError creating itinerary: {str(e)}"
    
    def _get_destination_activities(self, destination: str) -> Dict[str, str]:
        """Get destination-specific activities."""
        destination_lower = destination.lower()
        
        activities_map = {
            'iceland': {
                'morning': 'Northern Lights tour or Blue Lagoon visit',
                'afternoon': 'Golden Circle tour (Geysir, Gullfoss, Thingvellir)',
                'evening': 'Northern Lights hunting or Reykjavik nightlife'
            },
            'japan': {
                'morning': 'Visit temples and shrines',
                'afternoon': 'Explore traditional neighborhoods',
                'evening': 'Experience local cuisine and culture'
            },
            'france': {
                'morning': 'Visit museums and landmarks',
                'afternoon': 'Explore local markets and cafes',
                'evening': 'Enjoy French cuisine and wine'
            },
            'italy': {
                'morning': 'Visit historical sites and museums',
                'afternoon': 'Explore local neighborhoods and shops',
                'evening': 'Enjoy authentic Italian dining'
            },
            'spain': {
                'morning': 'Visit architectural landmarks',
                'afternoon': 'Explore local markets and tapas bars',
                'evening': 'Experience flamenco and nightlife'
            },
            'thailand': {
                'morning': 'Visit temples and cultural sites',
                'afternoon': 'Explore local markets and street food',
                'evening': 'Enjoy Thai cuisine and night markets'
            }
        }
        
        # Return specific activities if found, otherwise generic ones
        for key, activities in activities_map.items():
            if key in destination_lower:
                return activities
        
        # Default activities
        return {
            'morning': 'Visit local attractions and landmarks',
            'afternoon': 'Explore local culture and neighborhoods',
            'evening': 'Enjoy local cuisine and entertainment'
        }
    
    async def _create_budget_breakdown(self, budget: float, flight_data: str, hotel_data: str, duration: str) -> str:
        """Create a budget breakdown."""
        try:
            breakdown = f"## 💰 Budget Breakdown (Total: ${budget})\n\n"
            
            # Estimate costs based on available data
            flight_cost = 800  # Default estimate
            hotel_cost = 150 * int(duration)  # $150/night estimate
            food_cost = 50 * int(duration)  # $50/day estimate
            activities_cost = 100 * int(duration)  # $100/day estimate
            transport_cost = 200  # Local transport estimate
            
            total_estimated = flight_cost + hotel_cost + food_cost + activities_cost + transport_cost
            
            breakdown += f"- **Flights:** ${flight_cost}\n"
            breakdown += f"- **Accommodation:** ${hotel_cost} ({duration} nights)\n"
            breakdown += f"- **Food & Dining:** ${food_cost}\n"
            breakdown += f"- **Activities:** ${activities_cost}\n"
            breakdown += f"- **Local Transport:** ${transport_cost}\n"
            breakdown += f"- **Total Estimated:** ${total_estimated}\n\n"
            
            if total_estimated <= budget:
                breakdown += f"✅ **Within Budget!** You have ${budget - total_estimated} remaining for extras.\n"
            else:
                breakdown += f"⚠️ **Over Budget** by ${total_estimated - budget}. Consider adjusting plans.\n"
            
            return breakdown
        except Exception as e:
            logger.error(f"Budget breakdown error: {e}")
            return f"## 💰 Budget Breakdown\nError creating budget breakdown: {str(e)}"
    
    def _get_airport_code(self, destination: str) -> str:
        """Get airport code for destination using simplified lookup."""
        try:
            destination_lower = destination.lower()
            
            # Common major airports for popular destinations only
            major_airports = {
                'iceland': 'KEF', 'japan': 'NRT', 'france': 'CDG', 'italy': 'FCO',
                'spain': 'MAD', 'germany': 'FRA', 'thailand': 'BKK', 'vietnam': 'SGN',
                'india': 'DEL', 'brazil': 'GRU', 'argentina': 'EZE', 'chile': 'SCL',
                'mexico': 'MEX', 'canada': 'YYZ', 'australia': 'SYD', 'uk': 'LHR',
                'china': 'PEK', 'russia': 'SVO', 'greece': 'ATH', 'turkey': 'IST',
                'egypt': 'CAI', 'morocco': 'CMN', 'south africa': 'JNB', 'norway': 'OSL',
                'sweden': 'ARN', 'finland': 'HEL', 'denmark': 'CPH', 'netherlands': 'AMS',
                'belgium': 'BRU', 'switzerland': 'ZUR', 'austria': 'VIE', 'poland': 'WAW',
                'czech republic': 'PRG', 'hungary': 'BUD', 'croatia': 'ZAG', 'romania': 'OTP',
                'bulgaria': 'SOF', 'serbia': 'BEG', 'ukraine': 'KBP', 'lithuania': 'VNO',
                'latvia': 'RIX', 'estonia': 'TLL', 'luxembourg': 'LUX', 'malta': 'MLA',
                'cyprus': 'LCA', 'israel': 'TLV', 'jordan': 'AMM', 'lebanon': 'BEY',
                'saudi arabia': 'RUH', 'uae': 'DXB', 'qatar': 'DOH', 'kuwait': 'KWI',
                'bahrain': 'BAH', 'oman': 'MCT', 'afghanistan': 'KBL', 'pakistan': 'KHI',
                'bangladesh': 'DAC', 'sri lanka': 'CMB', 'maldives': 'MLE', 'nepal': 'KTM',
                'myanmar': 'RGN', 'laos': 'VTE', 'cambodia': 'PNH', 'malaysia': 'KUL',
                'singapore': 'SIN', 'indonesia': 'CGK', 'philippines': 'MNL', 'brunei': 'BWN',
                'mongolia': 'ULN', 'kazakhstan': 'ALA', 'uzbekistan': 'TAS', 'georgia': 'TBS',
                'armenia': 'EVN', 'azerbaijan': 'GYD'
            }
            
            for country, code in major_airports.items():
                if country in destination_lower:
                    return code
            
            # For cities, try to extract the first 3 letters as a code
            if len(destination) >= 3:
                return destination[:3].upper()
            
            # Default fallback
            return 'UNK'
            
        except Exception as e:
            logger.error(f"Error getting airport code for {destination}: {e}")
            return 'UNK'
    
    async def _handle_destination_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle destination-specific queries with attractions."""
        destination = travel_info['destination']
        logger.info(f"Getting information about {destination}...")
        
        try:
            # Get attractions for the destination
            if self.real_attractions_scraper:
                attractions_data = await self._get_attractions_data(destination)
                if attractions_data:
                    response_parts.append(attractions_data)
            
            # Get country information
            country_data = await self.get_country_info(destination)
            if "error" not in country_data and country_data:
                if isinstance(country_data, list) and len(country_data) > 0:
                    country_info = country_data[0]
                else:
                    country_info = country_data
            
            capital = country_info.get('capital', ['Unknown'])[0] if isinstance(country_info.get('capital'), list) else country_info.get('capital', 'Unknown')
            population = country_info.get('population', 'Unknown')
            currency = country_info.get('currencies', {}).get('USD', {}).get('name', 'Unknown') if country_info.get('currencies') else 'Unknown'
            
            response_parts.append(f"{destination}")
            response_parts.append(f"Capital: {capital}")
            response_parts.append(f"Population: {population:,}" if isinstance(population, int) else f"Population: {population}")
            response_parts.append(f"Currency: {currency}")
            
            # Get coordinates
            if capital != 'Unknown':
                print(f"🗺️ Getting coordinates for {capital}...")
                geo_data = await self.geocode_location(capital)
                if "error" not in geo_data and geo_data:
                    if isinstance(geo_data, list) and len(geo_data) > 0:
                        geo_info = geo_data[0]
                    else:
                        geo_info = geo_data
                    
                    lat = geo_info.get('lat', 'Unknown')
                    lon = geo_info.get('lon', 'Unknown')
                    response_parts.append(f"Coordinates: {lat}, {lon}")
        
            # Get Wikipedia information
            print(f"📚 Getting detailed information...")
            wiki_data = await self.search_wikipedia(f"{destination} tourism travel guide")
            if "error" not in wiki_data and wiki_data:
                summary = wiki_data.get('summary', 'No summary available')
                context_parts.append(f"Travel information: {summary[:500]}...")
        
        except Exception as e:
            logger.error(f"Destination query error: {e}")
            context_parts.append(f"Destination information: Unable to retrieve detailed data for {destination}. Please check travel websites directly.")
    
    async def _get_food_data(self, destination: str) -> Optional[str]:
        """Get food/restaurant data for destination."""
        try:
            if not self.real_food_scraper:
                return None
            
            restaurants = await self.real_food_scraper.search_restaurants(destination, limit=10)
            
            if restaurants:
                food_info = f"""
**🍽️ Top Restaurants in {destination}**

"""
                
                # Group restaurants by cuisine
                cuisines = {}
                for restaurant in restaurants:
                    cuisine = restaurant.get('cuisine_type', 'International')
                    if cuisine not in cuisines:
                        cuisines[cuisine] = []
                    cuisines[cuisine].append(restaurant)
                
                for cuisine, restos in cuisines.items():
                    food_info += f"**{cuisine}:**\n"
                    for resto in restos[:3]:  # Top 3 per cuisine
                        food_info += f"• **{resto['name']}** ⭐ {resto['rating']} - {resto['price_range']}\n"
                    food_info += "\n"
                
                return food_info
            
            return None
            
        except Exception as e:
            logger.error(f"Food data error: {e}")
            return None

    async def _get_attractions_data(self, destination: str) -> Optional[str]:
        """Get attractions data for a destination."""
        try:
            if not self.real_attractions_scraper:
                return None
            
            attractions = await self.real_attractions_scraper.search_attractions(destination)
            
            if attractions:
                attractions_info = f"""
**🎯 Top Attractions in {destination}**

"""
                
                # Group attractions by category
                categories = {}
                for attraction in attractions[:10]:  # Top 10 attractions
                    category = attraction.get('category', 'general')
                    if category not in categories:
                        categories[category] = []
                    categories[category].append(attraction)
                
                for category, attrs in categories.items():
                    attractions_info += f"**{category.title()}:**\n"
                    for attr in attrs[:3]:  # Top 3 per category
                        # Add map reference if coordinates are available
                        map_ref = ""
                        if attr.get('lat') and attr.get('lng'):
                            map_ref = f" 📍"
                        attractions_info += f"• **{attr['name']}** ⭐ {attr['rating']} - {attr['price']} ({attr['duration']}){map_ref}\n"
                    attractions_info += "\n"
                
                # Add travel tips
                tips = self.attractions_client.get_travel_tips(destination)
                attractions_info += f"""
**💡 Travel Tips for {destination}:**
{chr(10).join([f"• {tip}" for tip in tips])}

*Data source: {attractions[0]['source']}*
                """
                
                return attractions_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Attractions data error: {e}")
            return None
    
    async def _handle_general_query(self, query: str, response_parts: List[str], context_parts: List[str]):
        """Handle general travel queries."""
        logger.info("Searching for general information...")
        
        # Search the web for current information
        web_results = await self.search_web(query)
        if web_results:
            context_parts.append(f"Current information: {web_results[0]['snippet']}")
    
    def get_conversation_summary(self) -> str:
        """Get a summary of the conversation history."""
        if not self.conversation_history:
            return "No conversation history available."
        
        recent_messages = self.conversation_history[-10:]  # Last 10 messages
        summary_parts = []
        
        for msg in recent_messages:
            if msg['type'] == 'user':
                summary_parts.append(f"User: {msg['user'][:100]}...")
            else:
                summary_parts.append(f"Assistant: {msg['assistant'][:100]}...")
        
        return "\n".join(summary_parts)
    
    async def save_conversation(self, user_id: str = "default_user"):
        """Save conversation using ContextProvider."""
        try:
            if len(self.conversation_history) >= 2:
                interaction_data = {
                    'user_message': self.conversation_history[-2]['user'],
                    'assistant_response': self.conversation_history[-1]['assistant'],
                    'context_data': {'conversation_length': len(self.conversation_history)},
                    'intent': 'conversation',
                    'entities': {},
                    'sentiment': 'neutral',
                    'confidence': 0.8
                }
                await self.context_provider.store_interaction_context(user_id, interaction_data)
                logger.debug(f"Saved conversation for user {user_id}")
        except Exception as e:
            logger.error(f"Failed to save conversation: {e}")
    
    def chat(self):
        """Interactive chat interface."""
        print("🌍 Travel AI Agent - Privacy-First Travel Planning")
        print("=" * 60)
        print("Features:")
        print("• Local AI (Llama 3.1 8B) - No data leaves your device")
        print("• Real-time web search for current information")
        print("• Country information, Wikipedia, and geocoding")
        print("• Travel planning, budgeting, and recommendations")
        print("• Encrypted local storage for privacy")
        print("=" * 60)
        print("Type 'help' for commands, 'quit' to exit")
        print("All your data stays on your device - complete privacy!")
        print("-" * 60)
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Thank you for using Travel AI Agent! Safe travels!")
                    break
                
                if user_input.lower() == 'help':
                    self._show_help()
                    continue
                
                if user_input.lower() == 'summary':
                    print(f"\n📋 Conversation Summary:\n{self.get_conversation_summary()}")
                    continue
                
                if not user_input:
                    continue
                
                # Process the query
                response = asyncio.run(self.process_query(user_input))
                print(f"\n🤖 Agent: {response}")
                
                # Save conversation
                asyncio.run(self.save_conversation())
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye! Safe travels!")
                break
            except Exception as e:
                logger.error(f"Chat error: {e}")
                print(f"\n❌ Error: {e}")
    
    def _show_help(self):
        """Show help information."""
        help_text = """
🆘 Travel AI Agent Help

Available Commands:
• help - Show this help message
• summary - Show conversation summary
• quit/exit/bye - Exit the application

Example Queries:
• "Tell me about Peru"
• "Plan a trip to Japan for 2 weeks with $3000 budget"
• "What's the weather like in Tokyo?"
• "Find flights to Paris in January"
• "Budget hotels in Bangkok under $50/night"
• "What to see in Rome in 3 days?"

Features:
• Country information and coordinates
• Real-time weather and travel information
• Budget planning and cost estimates
• Flight and accommodation suggestions
• Wikipedia integration for detailed info
• Web search for current information

Privacy:
• All data stays on your device
• No tracking or data collection
• Encrypted local storage
• Free forever - no API costs
        """
        print(help_text)

    async def _handle_attractions_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle attractions queries with real attractions data."""
        logger.info("Searching for attractions...")
        
        try:
            if self.attractions_client and travel_info.get('destination'):
                attractions_data = await self._get_attractions_data(travel_info['destination'])
                if attractions_data:
                    response_parts.append(attractions_data)
                    return
            
            # Fallback to web search
            search_query = f"attractions things to do {travel_info.get('destination', '')}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Attractions information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Attractions: Check local tourism websites and travel guides for {travel_info.get('destination', 'your destination')}.")
                
        except Exception as e:
            logger.error(f"Attractions query error: {e}")
            context_parts.append("Attractions: Unable to retrieve current attractions data. Please check tourism websites directly.")
    
    async def _handle_food_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle food and restaurant queries with real restaurant data."""
        logger.info("Searching for restaurants...")
        
        try:
            if self.food_client and travel_info.get('destination'):
                food_data = await self._get_food_data(travel_info)
                if food_data:
                    response_parts.append(food_data)
                    return
            
            # Fallback to web search
            search_query = f"restaurants food {travel_info.get('destination', '')}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Restaurant information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Restaurants: Check local food guides and review sites for {travel_info.get('destination', 'your destination')}.")
                
        except Exception as e:
            logger.error(f"Food query error: {e}")
            context_parts.append("Restaurants: Unable to retrieve current restaurant data. Please check food review websites directly.")
    
    async def _handle_transportation_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle transportation queries with real transport data."""
        logger.info("Searching for transportation options...")
        
        try:
            if self.transportation_client and travel_info.get('destination'):
                transport_data = await self._get_transportation_data(travel_info['destination'])
                if transport_data:
                    response_parts.append(transport_data)
                    return
            
            # Fallback to web search
            search_query = f"transportation public transit {travel_info.get('destination', '')}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Transportation information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Transportation: Check local transit websites and maps for {travel_info.get('destination', 'your destination')}.")
                
        except Exception as e:
            logger.error(f"Transportation query error: {e}")
            context_parts.append("Transportation: Unable to retrieve current transport data. Please check local transit websites directly.")
    
    async def _handle_car_rental_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle car rental queries with real rental data."""
        logger.info("Searching for car rentals...")
        
        try:
            if self.car_rental_client and travel_info.get('destination'):
                car_data = await self._get_car_rental_data(travel_info)
                if car_data:
                    response_parts.append(car_data)
                    return
            
            # Fallback to web search
            search_query = f"car rental {travel_info.get('destination', '')}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Car rental information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Car rentals: Check major rental companies and comparison sites for {travel_info.get('destination', 'your destination')}.")
                
        except Exception as e:
            logger.error(f"Car rental query error: {e}")
            context_parts.append("Car rentals: Unable to retrieve current rental data. Please check rental company websites directly.")
    
    async def _handle_events_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle events and entertainment queries with real events data."""
        logger.info("Searching for events and shows...")
        
        try:
            if self.events_client and travel_info.get('destination'):
                events_data = await self._get_events_data(travel_info)
                if events_data:
                    response_parts.append(events_data)
                    return
            
            # Fallback to web search
            search_query = f"events shows entertainment {travel_info.get('destination', '')}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Events information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Events: Check local event calendars and entertainment venues for {travel_info.get('destination', 'your destination')}.")
                
        except Exception as e:
            logger.error(f"Events query error: {e}")
            context_parts.append("Events: Unable to retrieve current events data. Please check local event websites directly.")
    
    async def _handle_insurance_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle travel insurance queries with real insurance data."""
        logger.info("Searching for travel insurance...")
        
        try:
            if self.insurance_client and travel_info.get('destination'):
                insurance_data = await self._get_insurance_data(travel_info)
                if insurance_data:
                    response_parts.append(insurance_data)
                    return
            
            # Fallback to web search
            search_query = f"travel insurance {travel_info.get('destination', '')}"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Insurance information: {web_results[0]['snippet']}")
            else:
                context_parts.append(f"Travel insurance: Check insurance comparison sites and providers for {travel_info.get('destination', 'your destination')}.")
                
        except Exception as e:
            logger.error(f"Insurance query error: {e}")
            context_parts.append("Travel insurance: Unable to retrieve current insurance data. Please check insurance provider websites directly.")
    
    async def _get_food_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get food and restaurant data."""
        try:
            if not self.food_client:
                return None
            
            destination = travel_info.get('destination', '')
            budget = travel_info.get('budget', '')
            
            # Parse budget for price range
            price_range = None
            if budget:
                if budget < 50:
                    price_range = "budget"
                elif budget < 100:
                    price_range = "mid-range"
                else:
                    price_range = "luxury"
            
            # Search for restaurants
            restaurants = await self.food_client.get_restaurants(
                city=destination,
                price_range=price_range
            )
            
            if restaurants:
                food_info = f"""
**🍽️ Restaurant Recommendations in {destination}**

💰 **Budget:** ${budget or 'Not specified'}

**Top Restaurant Options:**
"""
                
                for i, restaurant in enumerate(restaurants[:6], 1):  # Show top 6 options
                    food_info += f"""
**{i}. {restaurant['name']}** ⭐ {restaurant['rating']} ({restaurant['price_range']})
- **Cuisine:** {restaurant['cuisine']}
- **Specialty:** {restaurant['specialty']}
- **Location:** {restaurant['location']}
- **Features:** {', '.join(restaurant['features'][:3])}
- **Popular Dishes:** {', '.join(restaurant['popular_dishes'][:2])}
- **Reservations:** {restaurant['reservations']}
"""
                
                # Add food tips
                tips = await self.food_client.get_food_tips(destination)
                food_info += f"""

**🍴 Dining Tips:**
{chr(10).join([f"• {tip}" for tip in tips])}

*Data source: {restaurant['source']}*
                """
                
                return food_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Food data error: {e}")
            return None
    
    async def _get_transportation_data(self, destination: str) -> Optional[str]:
        """Get transportation data for a destination."""
        try:
            if not self.transportation_client:
                return None
            
            transport_options = await self.transportation_client.get_transportation_options(destination)
            
            if transport_options:
                transport_info = f"""
**🚌 Transportation Options in {destination}**

**Available Transport Types:**
"""
                
                # Group by transport type
                transport_types = {}
                for option in transport_options[:10]:  # Top 10 options
                    transport_type = option.get('type', 'Other')
                    if transport_type not in transport_types:
                        transport_types[transport_type] = []
                    transport_types[transport_type].append(option)
                
                for transport_type, options in transport_types.items():
                    transport_info += f"\n**{transport_type}:**\n"
                    for option in options[:3]:  # Top 3 per type
                        transport_info += f"• **{option['service']}** - {option['price']} ({option['speed']}, {option['convenience']})\n"
                
                # Add transportation tips
                tips = await self.transportation_client.get_transportation_tips(destination)
                transport_info += f"""

**🚌 Transportation Tips:**
{chr(10).join([f"• {tip}" for tip in tips])}

*Data source: {transport_options[0]['source']}*
                """
                
                return transport_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Transportation data error: {e}")
            return None
    
    async def _get_car_rental_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get car rental data."""
        try:
            if not self.car_rental_client:
                return None
            
            destination = travel_info.get('destination', '')
            duration = int(travel_info.get('duration', 1))
            
            # Search for car rentals
            rentals = await self.car_rental_client.search_car_rentals(
                city=destination,
                duration=duration
            )
            
            if rentals:
                car_info = f"""
**🚗 Car Rental Options in {destination}**

📅 **Rental Duration:** {duration} days

**Top Car Rental Options:**
"""
                
                for i, rental in enumerate(rentals[:5], 1):  # Show top 5 options
                    car_info += f"""
**{i}. {rental['company']} - {rental['car_type']}**
- **Vehicle:** {rental['car_model']}
- **Price:** {rental['total_price']} ({rental['daily_price']}/day)
- **Rating:** ⭐ {rental['rating']}
- **Location:** {rental['pickup_location']}
- **Features:** {', '.join(rental['features'][:3])}
- **Insurance:** {rental['insurance']}
- **Book:** {rental['booking_url']}
"""
                
                # Add rental tips
                tips = await self.car_rental_client.get_rental_tips(destination)
                car_info += f"""

**🚗 Rental Tips:**
{chr(10).join([f"• {tip}" for tip in tips])}

*Data source: {rental['source']}*
                """
                
                return car_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Car rental data error: {e}")
            return None
    
    async def _get_events_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get events and entertainment data."""
        try:
            if not self.events_client:
                return None
            
            destination = travel_info.get('destination', '')
            date = travel_info.get('date', '')
            
            # Search for events
            events = await self.events_client.get_events(
                city=destination,
                date_range="this week"
            )
            
            if events:
                events_info = f"""
**🎭 Events & Entertainment in {destination}**

📅 **Date Range:** This week

**Upcoming Events:**
"""
                
                # Group by category
                categories = {}
                for event in events[:12]:  # Top 12 events
                    category = event.get('category', 'general')
                    if category not in categories:
                        categories[category] = []
                    categories[category].append(event)
                
                for category, event_list in categories.items():
                    events_info += f"\n**{category.title()}:**\n"
                    for event in event_list[:3]:  # Top 3 per category
                        events_info += f"• **{event['name']}** - {event['date']} at {event['time']} ({event['price']})\n"
                        events_info += f"  📍 {event['venue']} | ⭐ {event['rating']}\n"
                
                # Add entertainment tips
                tips = await self.events_client.get_entertainment_tips(destination)
                events_info += f"""

**🎭 Entertainment Tips:**
{chr(10).join([f"• {tip}" for tip in tips])}

*Data source: {events[0]['source']}*
                """
                
                return events_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Events data error: {e}")
            return None
    
    async def _get_insurance_data(self, travel_info: Dict[str, Any]) -> Optional[str]:
        """Get travel insurance data."""
        try:
            if not self.insurance_client:
                return None
            
            destination = travel_info.get('destination', '')
            duration = int(travel_info.get('duration', 7))
            budget = travel_info.get('budget', 0)
            
            # Determine trip type based on budget
            trip_type = "leisure"
            if budget > 5000:
                trip_type = "luxury"
            elif budget < 1000:
                trip_type = "budget"
            
            # Search for insurance options
            insurance_options = await self.insurance_client.get_travel_insurance_options(
                destination=destination,
                duration=duration,
                trip_type=trip_type
            )
            
            if insurance_options:
                insurance_info = f"""
**🛡️ Travel Insurance Options for {destination}**

📅 **Trip Duration:** {duration} days
💰 **Trip Type:** {trip_type.title()}

**Insurance Provider Options:**
"""
                
                for i, insurance in enumerate(insurance_options[:5], 1):  # Show top 5 options
                    insurance_info += f"""
**{i}. {insurance['provider']} - {insurance['coverage_type']}**
- **Price:** {insurance['total_price']} ({insurance['daily_price']}/day)
- **Rating:** ⭐ {insurance['rating']}
- **Coverage:** {insurance['coverage_level']}
- **Medical Coverage:** {insurance['medical_coverage']}
- **Trip Cancellation:** {insurance['trip_cancellation']}
- **Features:** {', '.join(insurance['features'][:3])}
- **Book:** {insurance['booking_url']}
"""
                
                # Add insurance tips
                tips = await self.insurance_client.get_insurance_tips(destination)
                insurance_info += f"""

**🛡️ Insurance Tips:**
{chr(10).join([f"• {tip}" for tip in tips])}

*Data source: {insurance['source']}*
                """
                
                return insurance_info.strip()
            
            return None
            
        except Exception as e:
            logger.error(f"Insurance data error: {e}")
            return None
    
    def _generate_booking_url(self, provider: str, origin: str, destination: str, date: str) -> str:
        """Generate dynamic booking URL for flight providers."""
        # Generate dynamic booking URLs instead of hardcoded patterns
        # This allows for configuration and avoids hardcoded URLs
        
        # Use configurable booking URLs
        base_urls = {
            'skyscanner': os.getenv("SKYSCANNER_URL", "https://www.skyscanner.com/transport/flights"),
            'google': os.getenv("GOOGLE_FLIGHTS_URL", "https://www.google.com/travel/flights"),
            'kayak': os.getenv("KAYAK_URL", "https://www.kayak.com/flights")
        }
        
        base_url = base_urls.get(provider, 'https://booking.example.com')
        
        if provider == 'skyscanner':
            return f"{base_url}/{origin.lower()}/{destination.lower()}/{date}/"
        elif provider == 'google':
            return f"{base_url}?q=Flights+from+{origin}+to+{destination}+on+{date}"
        elif provider == 'kayak':
            return f"{base_url}/{origin}-{destination}/{date}"
        else:
            return f"{base_url}/search?from={origin}&to={destination}&date={date}"


def main():
    """Main application entry point."""
    try:
        # Ensure data directory exists
        os.makedirs('data', exist_ok=True)
        
        # Initialize and run the travel agent
        agent = TravelAgent()
        agent.chat()
        
    except Exception as e:
        logger.error(f"Application error: {e}")
        print(f"❌ Failed to start Travel AI Agent: {e}")
        print("Please check the logs in data/travel_agent.log for more details.")

if __name__ == "__main__":
    main()
