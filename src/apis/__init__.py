"""
API clients for the Travel AI Agent.
Provides comprehensive travel data through free and paid APIs.
"""

# Core API clients
from .weather_client import OpenWeatherClient
from .flight_client import AviationStackClient
from .country_client import RestCountriesClient
from .wikipedia_client import WikipediaClient
from .maps_client import NominatimClient
from .web_search_client import WebSearchClient
from .rate_limiter import APIRateLimiter

# Free API clients (no keys required)
from .free_weather_client import FreeWeatherClient
from .free_flight_client import FreeFlightClient
from .open_meteo_client import OpenMeteoClient

# Additional service clients
from .currency_api_client import CurrencyAPIClient
from .hotel_search_client import HotelSearchClient
from .attractions_client import AttractionsClient
from .car_rental_client import CarRentalClient
from .events_client import EventsClient
from .insurance_client import InsuranceClient
from .transportation_client import TransportationClient
from .food_client import FoodClient

__all__ = [
    # Core clients
    'OpenWeatherClient',
    'AviationStackClient',
    'RestCountriesClient',
    'WikipediaClient',
    'NominatimClient',
    'WebSearchClient',
    'APIRateLimiter',
    
    # Free clients
    'FreeWeatherClient',
    'FreeFlightClient',
    'OpenMeteoClient',
    
    # Service clients
    'CurrencyAPIClient',
    'HotelSearchClient',
    'AttractionsClient',
    'CarRentalClient',
    'EventsClient',
    'InsuranceClient',
    'TransportationClient',
    'FoodClient'
]
