"""
Travel tools for the LangChain agent.
Provides access to free APIs and travel information.
"""

from typing import Dict, Any, List, Optional
from langchain.tools import BaseTool
from pydantic import BaseModel, Field
import asyncio
import json

from ..apis import (
    OpenWeatherClient, FixerClient, AviationStackClient, 
    RestCountriesClient, WikipediaClient, NominatimClient
)
from ..config import config
from ..database import SecureDatabase

class WeatherInput(BaseModel):
    """Input for weather tool."""
    city: str = Field(description="City name")
    country_code: Optional[str] = Field(default=None, description="Country code (optional)")
    days: int = Field(default=5, description="Number of forecast days (max 5)")

class CurrencyInput(BaseModel):
    """Input for currency tool."""
    amount: float = Field(description="Amount to convert")
    from_currency: str = Field(description="Source currency code (e.g., USD)")
    to_currency: str = Field(description="Target currency code (e.g., EUR)")

class FlightInput(BaseModel):
    """Input for flight tool."""
    flight_number: str = Field(description="Flight number (e.g., AA123)")

class CountryInput(BaseModel):
    """Input for country tool."""
    country_name: str = Field(description="Country name")

class GeocodeInput(BaseModel):
    """Input for geocoding tool."""
    address: str = Field(description="Address or location name")

class TravelTools:
    """Collection of travel tools for the LangChain agent."""
    
    def __init__(self, database: SecureDatabase = None):
        self.database = database or SecureDatabase()
        
        # Initialize API clients
        self.weather_client = None
        self.currency_client = None
        self.flight_client = None
        self.country_client = None
        self.wikipedia_client = None
        self.maps_client = None
        
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize API clients based on available configuration."""
        try:
            if config.OPENWEATHER_API_KEY:
                self.weather_client = OpenWeatherClient()
        except Exception as e:
            print(f"Warning: Weather client not available: {e}")
        
        try:
            if config.FIXER_API_KEY:
                self.currency_client = FixerClient()
        except Exception as e:
            print(f"Warning: Currency client not available: {e}")
        
        try:
            if config.AVIATIONSTACK_API_KEY:
                self.flight_client = AviationStackClient()
        except Exception as e:
            print(f"Warning: Flight client not available: {e}")
        
        # These clients don't require API keys
        self.country_client = RestCountriesClient()
        self.wikipedia_client = WikipediaClient()
        self.maps_client = NominatimClient()
    
    def get_available_tools(self) -> List[BaseTool]:
        """Get list of available tools."""
        tools = []
        
        if self.weather_client:
            tools.append(WeatherTool(self.weather_client, self.database))
        
        if self.currency_client:
            tools.append(CurrencyTool(self.currency_client, self.database))
        
        if self.flight_client:
            tools.append(FlightTool(self.flight_client, self.database))
        
        tools.extend([
            CountryTool(self.country_client, self.database),
            WikipediaTool(self.wikipedia_client, self.database),
            GeocodeTool(self.maps_client, self.database)
        ])
        
        return tools

class WeatherTool(BaseTool):
    """Tool for getting weather information."""
    
    name = "weather"
    description = "Get current weather and forecast for a city. Input should be city name and optional country code."
    args_schema = WeatherInput
    
    def __init__(self, weather_client: OpenWeatherClient, database: SecureDatabase):
        super().__init__()
        self.weather_client = weather_client
        self.database = database
    
    def _run(self, city: str, country_code: str = None, days: int = 5) -> str:
        """Get weather information for a city."""
        try:
            # Check cache first
            cache_key = f"weather_{city}_{country_code}_{days}"
            cached_result = self.database.get_api_cache('weather', {'city': city, 'country': country_code, 'days': days})
            
            if cached_result:
                return f"Weather information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get weather data
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                if days == 1:
                    # Get current weather only
                    result = loop.run_until_complete(
                        self.weather_client.get_current_weather(city, country_code)
                    )
                else:
                    # Get forecast
                    result = loop.run_until_complete(
                        self.weather_client.get_weather_forecast(city, country_code, days)
                    )
                
                # Cache the result
                self.database.store_api_cache('weather', 'forecast', 
                                            {'city': city, 'country': country_code, 'days': days}, 
                                            result, ttl_hours=1)
                
                return f"Weather information for {city}: {json.dumps(result, indent=2)}"
                
            finally:
                loop.close()
                
        except Exception as e:
            return f"Error getting weather information: {str(e)}"
    
    async def _arun(self, city: str, country_code: str = None, days: int = 5) -> str:
        """Async version of weather tool."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('weather', {'city': city, 'country': country_code, 'days': days})
            
            if cached_result:
                return f"Weather information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get weather data
            if days == 1:
                result = await self.weather_client.get_current_weather(city, country_code)
            else:
                result = await self.weather_client.get_weather_forecast(city, country_code, days)
            
            # Cache the result
            self.database.store_api_cache('weather', 'forecast', 
                                        {'city': city, 'country': country_code, 'days': days}, 
                                        result, ttl_hours=1)
            
            return f"Weather information for {city}: {json.dumps(result, indent=2)}"
            
        except Exception as e:
            return f"Error getting weather information: {str(e)}"

class CurrencyTool(BaseTool):
    """Tool for currency conversion."""
    
    name = "currency"
    description = "Convert currency amounts between different currencies. Input should be amount, from currency, and to currency."
    args_schema = CurrencyInput
    
    def __init__(self, currency_client: FixerClient, database: SecureDatabase):
        super().__init__()
        self.currency_client = currency_client
        self.database = database
    
    def _run(self, amount: float, from_currency: str, to_currency: str) -> str:
        """Convert currency amount."""
        try:
            # Check cache first
            cache_key = f"currency_{amount}_{from_currency}_{to_currency}"
            cached_result = self.database.get_api_cache('currency', {
                'amount': amount, 'from': from_currency, 'to': to_currency
            })
            
            if cached_result:
                return f"Currency conversion (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get conversion
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                result = loop.run_until_complete(
                    self.currency_client.convert_currency(amount, from_currency, to_currency)
                )
                
                # Cache the result
                self.database.store_api_cache('currency', 'convert', {
                    'amount': amount, 'from': from_currency, 'to': to_currency
                }, result, ttl_hours=24)
                
                return f"Currency conversion: {json.dumps(result, indent=2)}"
                
            finally:
                loop.close()
                
        except Exception as e:
            return f"Error converting currency: {str(e)}"
    
    async def _arun(self, amount: float, from_currency: str, to_currency: str) -> str:
        """Async version of currency tool."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('currency', {
                'amount': amount, 'from': from_currency, 'to': to_currency
            })
            
            if cached_result:
                return f"Currency conversion (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get conversion
            result = await self.currency_client.convert_currency(amount, from_currency, to_currency)
            
            # Cache the result
            self.database.store_api_cache('currency', 'convert', {
                'amount': amount, 'from': from_currency, 'to': to_currency
            }, result, ttl_hours=24)
            
            return f"Currency conversion: {json.dumps(result, indent=2)}"
            
        except Exception as e:
            return f"Error converting currency: {str(e)}"

class FlightTool(BaseTool):
    """Tool for flight information."""
    
    name = "flight"
    description = "Get flight information and status. Input should be flight number."
    args_schema = FlightInput
    
    def __init__(self, flight_client: AviationStackClient, database: SecureDatabase):
        super().__init__()
        self.flight_client = flight_client
        self.database = database
    
    def _run(self, flight_number: str) -> str:
        """Get flight information."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('flight', {'flight_number': flight_number})
            
            if cached_result:
                return f"Flight information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get flight data
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                result = loop.run_until_complete(
                    self.flight_client.get_flight_info(flight_number)
                )
                
                # Cache the result
                self.database.store_api_cache('flight', 'info', 
                                            {'flight_number': flight_number}, 
                                            result, ttl_hours=1)
                
                return f"Flight information for {flight_number}: {json.dumps(result, indent=2)}"
                
            finally:
                loop.close()
                
        except Exception as e:
            return f"Error getting flight information: {str(e)}"
    
    async def _arun(self, flight_number: str) -> str:
        """Async version of flight tool."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('flight', {'flight_number': flight_number})
            
            if cached_result:
                return f"Flight information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get flight data
            result = await self.flight_client.get_flight_info(flight_number)
            
            # Cache the result
            self.database.store_api_cache('flight', 'info', 
                                        {'flight_number': flight_number}, 
                                        result, ttl_hours=1)
            
            return f"Flight information for {flight_number}: {json.dumps(result, indent=2)}"
            
        except Exception as e:
            return f"Error getting flight information: {str(e)}"

class CountryTool(BaseTool):
    """Tool for country information."""
    
    name = "country"
    description = "Get information about a country. Input should be country name."
    args_schema = CountryInput
    
    def __init__(self, country_client: RestCountriesClient, database: SecureDatabase):
        super().__init__()
        self.country_client = country_client
        self.database = database
    
    def _run(self, country_name: str) -> str:
        """Get country information."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('country', {'name': country_name})
            
            if cached_result:
                return f"Country information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get country data
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                result = loop.run_until_complete(
                    self.country_client.get_country_info(country_name)
                )
                
                # Cache the result
                self.database.store_api_cache('country', 'info', 
                                            {'name': country_name}, 
                                            result, ttl_hours=24)
                
                return f"Country information for {country_name}: {json.dumps(result, indent=2)}"
                
            finally:
                loop.close()
                
        except Exception as e:
            return f"Error getting country information: {str(e)}"
    
    async def _arun(self, country_name: str) -> str:
        """Async version of country tool."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('country', {'name': country_name})
            
            if cached_result:
                return f"Country information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get country data
            result = await self.country_client.get_country_info(country_name)
            
            # Cache the result
            self.database.store_api_cache('country', 'info', 
                                        {'name': country_name}, 
                                        result, ttl_hours=24)
            
            return f"Country information for {country_name}: {json.dumps(result, indent=2)}"
            
        except Exception as e:
            return f"Error getting country information: {str(e)}"

class WikipediaTool(BaseTool):
    """Tool for Wikipedia information."""
    
    name = "wikipedia"
    description = "Get information from Wikipedia. Input should be search term."
    args_schema = CountryInput  # Reusing the same schema
    
    def __init__(self, wikipedia_client: WikipediaClient, database: SecureDatabase):
        super().__init__()
        self.wikipedia_client = wikipedia_client
        self.database = database
    
    def _run(self, country_name: str) -> str:
        """Get Wikipedia information."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('wikipedia', {'term': country_name})
            
            if cached_result:
                return f"Wikipedia information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get Wikipedia data
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                result = loop.run_until_complete(
                    self.wikipedia_client.get_city_info(country_name)
                )
                
                # Cache the result
                self.database.store_api_cache('wikipedia', 'info', 
                                            {'term': country_name}, 
                                            result, ttl_hours=24)
                
                return f"Wikipedia information for {country_name}: {json.dumps(result, indent=2)}"
                
            finally:
                loop.close()
                
        except Exception as e:
            return f"Error getting Wikipedia information: {str(e)}"
    
    async def _arun(self, country_name: str) -> str:
        """Async version of Wikipedia tool."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('wikipedia', {'term': country_name})
            
            if cached_result:
                return f"Wikipedia information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get Wikipedia data
            result = await self.wikipedia_client.get_city_info(country_name)
            
            # Cache the result
            self.database.store_api_cache('wikipedia', 'info', 
                                        {'term': country_name}, 
                                        result, ttl_hours=24)
            
            return f"Wikipedia information for {country_name}: {json.dumps(result, indent=2)}"
            
        except Exception as e:
            return f"Error getting Wikipedia information: {str(e)}"

class GeocodeTool(BaseTool):
    """Tool for geocoding addresses."""
    
    name = "geocode"
    description = "Get coordinates for an address or location. Input should be address or location name."
    args_schema = GeocodeInput
    
    def __init__(self, maps_client: NominatimClient, database: SecureDatabase):
        super().__init__()
        self.maps_client = maps_client
        self.database = database
    
    def _run(self, address: str) -> str:
        """Get geocoding information."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('geocode', {'address': address})
            
            if cached_result:
                return f"Geocoding information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get geocoding data
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            try:
                result = loop.run_until_complete(
                    self.maps_client.geocode(address)
                )
                
                # Cache the result
                self.database.store_api_cache('geocode', 'search', 
                                            {'address': address}, 
                                            result, ttl_hours=24)
                
                return f"Geocoding information for {address}: {json.dumps(result, indent=2)}"
                
            finally:
                loop.close()
                
        except Exception as e:
            return f"Error getting geocoding information: {str(e)}"
    
    async def _arun(self, address: str) -> str:
        """Async version of geocoding tool."""
        try:
            # Check cache first
            cached_result = self.database.get_api_cache('geocode', {'address': address})
            
            if cached_result:
                return f"Geocoding information (cached): {json.dumps(cached_result, indent=2)}"
            
            # Get geocoding data
            result = await self.maps_client.geocode(address)
            
            # Cache the result
            self.database.store_api_cache('geocode', 'search', 
                                        {'address': address}, 
                                        result, ttl_hours=24)
            
            return f"Geocoding information for {address}: {json.dumps(result, indent=2)}"
            
        except Exception as e:
            return f"Error getting geocoding information: {str(e)}"
