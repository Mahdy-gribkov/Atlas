"""
MCP Client for Travel AI Agent
Integrates with the MCP server to provide real-time data access.
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class TravelMCPClient:
    """
    MCP Client for Travel AI Agent.
    Provides seamless integration with MCP server tools.
    """
    
    def __init__(self, server_url: str = None):
        """Initialize the MCP client."""
        self.server_url = server_url or os.getenv("MCP_SERVER_URL", "http://localhost:8000")
        self.session_id = None
        self.context = {}
        
        logger.info("🔗 Travel MCP Client initialized")
    
    async def call_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call a tool on the MCP server.
        
        Args:
            tool_name: Name of the tool to call
            parameters: Tool parameters
            
        Returns:
            Tool response
        """
        try:
            # Call the actual tool implementations directly
            response = await self._call_real_tool(tool_name, parameters)
            return response
            
        except Exception as e:
            logger.error(f"MCP tool call error: {e}")
            return {'error': str(e)}
    
    async def _call_real_tool(self, tool_name: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
        """Call real tool implementations."""
        try:
            if tool_name == 'search_flights':
                return await self._real_flight_search(parameters)
            elif tool_name == 'search_hotels':
                return await self._real_hotel_search(parameters)
            elif tool_name == 'search_attractions':
                return await self._real_attractions_search(parameters)
            elif tool_name == 'get_weather':
                return await self._real_weather_search(parameters)
            elif tool_name == 'geocode_location':
                return await self._real_geocode(parameters)
            elif tool_name == 'convert_currency':
                return await self._real_currency_conversion(parameters)
            elif tool_name == 'search_wikipedia':
                return await self._real_wikipedia_search(parameters)
            elif tool_name == 'web_search':
                return await self._real_web_search(parameters)
            elif tool_name == 'get_country_info':
                return await self._real_country_info(parameters)
            else:
                return {'error': f'Unknown tool: {tool_name}'}
                
        except Exception as e:
            logger.error(f"Real tool call error: {e}")
            return {'error': str(e)}
    
    async def _real_flight_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real flight search using web scrapers."""
        try:
            from src.apis import RealFlightScraper
            
            async with RealFlightScraper() as scraper:
                flights = await scraper.search_flights(
                    origin=params.get('origin', ''),
                    destination=params.get('destination', ''),
                    date=params.get('date'),
                    return_date=params.get('return_date'),
                    passengers=params.get('passengers', 1)
                )
                
                return {
                    'flights': flights,
                    'count': len(flights),
                    'source': 'Real Web Scraping',
                    'timestamp': datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Real flight search error: {e}")
            return {'error': str(e), 'flights': []}
    
    async def _real_hotel_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real hotel search using web scrapers."""
        try:
            from src.apis import RealHotelScraper
            
            async with RealHotelScraper() as scraper:
                hotels = await scraper.search_hotels(
                    city=params.get('city', ''),
                    check_in=params.get('check_in'),
                    check_out=params.get('check_out'),
                    guests=params.get('guests', 1),
                    rooms=params.get('rooms', 1),
                    budget=params.get('budget')
                )
                
                return {
                    'hotels': hotels,
                    'count': len(hotels),
                    'source': 'Real Web Scraping',
                    'timestamp': datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Real hotel search error: {e}")
            return {'error': str(e), 'hotels': []}
    
    async def _real_attractions_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real attractions search using web scrapers."""
        try:
            from src.apis import RealAttractionsScraper
            
            async with RealAttractionsScraper() as scraper:
                attractions = await scraper.search_attractions(
                    city=params.get('city', ''),
                    category=params.get('category', 'all'),
                    limit=params.get('limit', 20)
                )
                
                return {
                    'attractions': attractions,
                    'count': len(attractions),
                    'source': 'Real Web Scraping',
                    'timestamp': datetime.now().isoformat()
                }
        except Exception as e:
            logger.error(f"Real attractions search error: {e}")
            return {'error': str(e), 'attractions': []}
    
    async def _real_weather_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real weather search using free APIs."""
        try:
            from src.apis import FreeWeatherClient
            
            weather_client = FreeWeatherClient()
            weather = await weather_client.get_current_weather(params.get('location', ''))
            
            return {
                'weather': weather,
                'source': 'Free Weather API',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Real weather search error: {e}")
            return {'error': str(e), 'weather': {}}
    
    async def _real_geocode(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real geocoding using free APIs."""
        try:
            from src.apis import NominatimClient
            
            maps_client = NominatimClient()
            location = await maps_client.geocode(params.get('address', ''))
            
            return {
                'location': location,
                'source': 'OpenStreetMap',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Real geocoding error: {e}")
            return {'error': str(e), 'location': {}}
    
    async def _real_currency_conversion(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real currency conversion using free APIs."""
        try:
            from src.apis import CurrencyAPIClient
            
            currency_client = CurrencyAPIClient()
            conversion = await currency_client.convert_currency(
                amount=params.get('amount', 0),
                from_currency=params.get('from_currency', 'USD'),
                to_currency=params.get('to_currency', 'EUR')
            )
            
            return {
                'conversion': conversion,
                'source': 'Free Currency API',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Real currency conversion error: {e}")
            return {'error': str(e), 'conversion': {}}
    
    async def _real_wikipedia_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real Wikipedia search using free APIs."""
        try:
            from src.apis import WikipediaClient
            
            wikipedia_client = WikipediaClient()
            results = await wikipedia_client.search(
                query=params.get('query', ''),
                limit=params.get('limit', 10)
            )
            
            return {
                'results': results,
                'count': len(results),
                'source': 'Wikipedia API',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Real Wikipedia search error: {e}")
            return {'error': str(e), 'results': []}
    
    async def _real_web_search(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real web search using free APIs."""
        try:
            from src.apis import WebSearchClient
            
            web_search_client = WebSearchClient()
            results = await web_search_client.search(
                query=params.get('query', ''),
                max_results=params.get('max_results', 10)
            )
            
            return {
                'results': results,
                'count': len(results),
                'source': 'DuckDuckGo',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Real web search error: {e}")
            return {'error': str(e), 'results': []}
    
    async def _real_country_info(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """Real country information using free APIs."""
        try:
            from src.apis import RestCountriesClient
            
            country_client = RestCountriesClient()
            country_info = await country_client.get_country_info(params.get('country', ''))
            
            return {
                'country_info': country_info,
                'source': 'REST Countries API',
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Real country info error: {e}")
            return {'error': str(e), 'country_info': {}}
    
    async def update_context(self, key: str, value: Any) -> bool:
        """Update conversation context."""
        try:
            self.context[key] = {
                'value': value,
                'timestamp': datetime.now().isoformat()
            }
            return True
        except Exception as e:
            logger.error(f"Context update error: {e}")
            return False
    
    async def get_context(self, key: str) -> Optional[Any]:
        """Get conversation context."""
        try:
            if key in self.context:
                return self.context[key]['value']
            return None
        except Exception as e:
            logger.error(f"Context get error: {e}")
            return None
    
    async def get_all_context(self) -> Dict[str, Any]:
        """Get all conversation context."""
        return self.context.copy()
