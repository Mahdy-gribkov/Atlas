"""
Web Search Client for real-time information retrieval.
Provides access to current web information for travel planning.
"""

import asyncio
import aiohttp
from typing import Dict, Any, List, Optional
import logging

logger = logging.getLogger(__name__)

class WebSearchClient:
    """
    Web search client for real-time travel information.
    
    Uses free APIs and services to provide current information
    without requiring API keys or paid services.
    """
    
    def __init__(self):
        """Initialize the web search client."""
        self.session = None
        self.rate_limiter = {}  # Simple rate limiting
    
    async def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search the web for real-time information.
        
        Args:
            query: Search query
            num_results: Number of results to return
            
        Returns:
            List of search results with title, url, and snippet
        """
        try:
            # Use DuckDuckGo instant answer API (free, no API key required)
            results = await self._search_duckduckgo(query, num_results)
            
            if not results:
                # Fallback to other free search methods
                results = await self._search_fallback(query, num_results)
            
            return results
            
        except Exception as e:
            logger.error(f"Web search error: {e}")
            return []
    
    async def _search_duckduckgo(self, query: str, num_results: int) -> List[Dict[str, Any]]:
        """Search using DuckDuckGo instant answer API."""
        try:
            # Use a simpler approach with requests instead of aiohttp
            import requests
            
            url = "https://api.duckduckgo.com/"
            params = {
                'q': query,
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            
            # Use requests with timeout in a thread to avoid blocking
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: requests.get(url, params=params, timeout=3)
            )
            
            if response.status_code == 200:
                data = response.json()
                
                results = []
                
                # Extract instant answer
                if data.get('Abstract'):
                    results.append({
                        'title': data.get('Heading', 'Instant Answer'),
                        'url': data.get('AbstractURL', ''),
                        'snippet': data.get('Abstract', ''),
                        'source': 'DuckDuckGo Instant Answer'
                    })
                
                # Extract related topics
                for topic in data.get('RelatedTopics', [])[:num_results-1]:
                    if isinstance(topic, dict) and 'Text' in topic:
                        results.append({
                            'title': topic.get('Text', '').split(' - ')[0],
                            'url': topic.get('FirstURL', ''),
                            'snippet': topic.get('Text', ''),
                            'source': 'DuckDuckGo Related Topics'
                        })
                
                return results[:num_results]
            
        except Exception as e:
            logger.error(f"DuckDuckGo search error: {e}")
        
        return []
    
    async def _search_fallback(self, query: str, num_results: int) -> List[Dict[str, Any]]:
        """Fallback search method using web scraping."""
        try:
            # This is a placeholder for additional search methods
            # In a production environment, you might use:
            # - Bing Search API (free tier)
            # - Google Custom Search (free tier)
            # - Web scraping with proper rate limiting
            
            return []
            
        except Exception as e:
            logger.error(f"Fallback search error: {e}")
            return []
    
    async def search_travel_info(self, destination: str, info_type: str = "general") -> List[Dict[str, Any]]:
        """
        Search for specific travel information.
        
        Args:
            destination: Travel destination
            info_type: Type of information (weather, flights, hotels, etc.)
            
        Returns:
            List of travel-related search results
        """
        try:
            # Build specific search queries based on info type
            if info_type == "weather":
                query = f"current weather {destination} temperature forecast"
            elif info_type == "flights":
                query = f"flights to {destination} airlines booking"
            elif info_type == "hotels":
                query = f"hotels accommodation {destination} booking"
            elif info_type == "attractions":
                query = f"tourist attractions {destination} things to do"
            elif info_type == "food":
                query = f"local food cuisine {destination} restaurants"
            elif info_type == "transport":
                query = f"transportation {destination} public transport"
            else:
                query = f"travel guide {destination} tourism"
            
            return await self.search(query, num_results=3)
            
        except Exception as e:
            logger.error(f"Travel info search error: {e}")
            return []
    
    async def get_current_weather(self, location: str) -> Optional[Dict[str, Any]]:
        """
        Get current weather information for a location.
        
        Args:
            location: Location name
            
        Returns:
            Weather information dictionary
        """
        try:
            results = await self.search_travel_info(location, "weather")
            
            if results:
                # Extract weather information from search results
                weather_info = {
                    'location': location,
                    'source': results[0]['source'],
                    'information': results[0]['snippet']
                }
                return weather_info
            
        except Exception as e:
            logger.error(f"Weather search error: {e}")
        
        return None
    
    async def get_flight_info(self, destination: str, origin: str = "") -> List[Dict[str, Any]]:
        """
        Get flight information for a destination.
        
        Args:
            destination: Destination city/country
            origin: Origin city (optional)
            
        Returns:
            List of flight information
        """
        try:
            query = f"flights to {destination}"
            if origin:
                query = f"flights from {origin} to {destination}"
            
            return await self.search(query, num_results=3)
            
        except Exception as e:
            logger.error(f"Flight search error: {e}")
            return []
    
    async def get_hotel_info(self, destination: str, budget: str = "") -> List[Dict[str, Any]]:
        """
        Get hotel information for a destination.
        
        Args:
            destination: Destination city/country
            budget: Budget range (optional)
            
        Returns:
            List of hotel information
        """
        try:
            query = f"hotels accommodation {destination}"
            if budget:
                query = f"hotels {destination} budget {budget}"
            
            return await self.search(query, num_results=3)
            
        except Exception as e:
            logger.error(f"Hotel search error: {e}")
            return []
    
    async def get_travel_tips(self, destination: str) -> List[Dict[str, Any]]:
        """
        Get travel tips and advice for a destination.
        
        Args:
            destination: Destination city/country
            
        Returns:
            List of travel tips
        """
        try:
            query = f"travel tips {destination} advice guide"
            return await self.search(query, num_results=3)
            
        except Exception as e:
            logger.error(f"Travel tips search error: {e}")
            return []
    
    def close(self):
        """Close the web search client."""
        if self.session:
            asyncio.create_task(self.session.close())
