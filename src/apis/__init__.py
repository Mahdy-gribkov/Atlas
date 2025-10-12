"""
Free API clients for the Travel AI Agent.
All APIs used are free or have generous free tiers.
"""

from .weather_client import OpenWeatherClient
from .currency_client import FixerClient
from .flight_client import AviationStackClient
from .country_client import RestCountriesClient
from .wikipedia_client import WikipediaClient
from .maps_client import NominatimClient
from .web_search_client import WebSearchClient
from .rate_limiter import APIRateLimiter

__all__ = [
    'OpenWeatherClient',
    'FixerClient', 
    'AviationStackClient',
    'RestCountriesClient',
    'WikipediaClient',
    'NominatimClient',
    'WebSearchClient',
    'APIRateLimiter'
]
