"""
API clients for the Travel AI Agent.
Provides comprehensive travel data through free and paid APIs.
"""

# Core API clients
from .flight_client import AviationStackClient
from .country_client import RestCountriesClient
from .wikipedia_client import WikipediaClient
from .maps_client import NominatimClient
from .web_search_client import WebSearchClient
from .rate_limiter import APIRateLimiter

# Free API clients (no keys required) - REAL DATA ONLY
from .free_weather_client import FreeWeatherClient
from .open_meteo_client import OpenMeteoClient

# Additional service clients - REAL DATA ONLY
from .currency_api_client import CurrencyAPIClient

# Real Web Scrapers
from .real_flight_scraper import RealFlightScraper
from .real_hotel_scraper import RealHotelScraper
from .real_attractions_scraper import RealAttractionsScraper
from .real_food_scraper import RealFoodScraper

# Enhanced API Clients - Multiple Free Sources
# (Enhanced clients are integrated into existing clients)

__all__ = [
    # Core clients - REAL DATA ONLY
    'AviationStackClient',
    'RestCountriesClient',
    'WikipediaClient',
    'NominatimClient',
    'WebSearchClient',
    'APIRateLimiter',
    
    # Free clients - REAL DATA ONLY
    'FreeWeatherClient',
    'OpenMeteoClient',
    
    # Service clients - REAL DATA ONLY
    'CurrencyAPIClient',
    
    # Real Web Scrapers
    'RealFlightScraper',
    'RealHotelScraper',
    'RealAttractionsScraper',
    'RealFoodScraper',
    
    # Enhanced API Clients - Multiple Free Sources
    # (Enhanced clients are integrated into existing clients)
]
