# Free APIs & Data Sources Guide

## 🆓 Overview

This guide covers all the free APIs and data sources we'll use for the travel AI agent. **No paid services** - everything is free or has generous free tiers.

## 🌤️ Weather APIs

### 1. OpenWeather API (Recommended)
- **Free Tier**: 1,000 calls/day
- **Features**: Current weather, 5-day forecast, historical data
- **Registration**: https://openweathermap.org/api
- **Rate Limit**: 60 calls/minute

```python
class OpenWeatherClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://api.openweathermap.org/data/2.5"
    
    async def get_current_weather(self, city: str) -> Dict:
        """Get current weather for a city."""
        url = f"{self.base_url}/weather"
        params = {
            'q': city,
            'appid': self.api_key,
            'units': 'metric'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
    
    async def get_forecast(self, city: str, days: int = 5) -> Dict:
        """Get weather forecast."""
        url = f"{self.base_url}/forecast"
        params = {
            'q': city,
            'appid': self.api_key,
            'units': 'metric',
            'cnt': days * 8  # 8 forecasts per day
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
```

### 2. WeatherAPI (Alternative)
- **Free Tier**: 1M calls/month
- **Features**: Current weather, forecast, historical data
- **Registration**: https://www.weatherapi.com/
- **Rate Limit**: 1,000 calls/day

## 💱 Currency APIs

### 1. Fixer.io (Recommended)
- **Free Tier**: 100 calls/month
- **Features**: Real-time exchange rates, historical data
- **Registration**: https://fixer.io/
- **Rate Limit**: 100 calls/month

```python
class FixerClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://data.fixer.io/api"
    
    async def get_latest_rates(self, base_currency: str = "USD") -> Dict:
        """Get latest exchange rates."""
        url = f"{self.base_url}/latest"
        params = {
            'access_key': self.api_key,
            'base': base_currency
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
    
    async def convert_currency(self, amount: float, from_curr: str, to_curr: str) -> float:
        """Convert currency amount."""
        rates = await self.get_latest_rates(from_curr)
        if rates['success']:
            rate = rates['rates'].get(to_curr, 1)
            return amount * rate
        return amount
```

### 2. ExchangeRate-API (Alternative)
- **Free Tier**: 1,500 calls/month
- **Features**: Real-time rates, no API key required
- **URL**: https://api.exchangerate-api.com/v4/latest/USD
- **Rate Limit**: 1,500 calls/month

## ✈️ Flight Data APIs

### 1. AviationStack (Free Tier)
- **Free Tier**: 100 calls/month
- **Features**: Flight data, airline information
- **Registration**: https://aviationstack.com/
- **Rate Limit**: 100 calls/month

```python
class AviationStackClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://api.aviationstack.com/v1"
    
    async def get_flight_info(self, flight_number: str) -> Dict:
        """Get flight information."""
        url = f"{self.base_url}/flights"
        params = {
            'access_key': self.api_key,
            'flight_iata': flight_number
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
    
    async def get_airline_info(self, airline_code: str) -> Dict:
        """Get airline information."""
        url = f"{self.base_url}/airlines"
        params = {
            'access_key': self.api_key,
            'iata_code': airline_code
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
```

### 2. Amadeus (Free Tier)
- **Free Tier**: 2,000 calls/month
- **Features**: Flight search, hotel search, city search
- **Registration**: https://developers.amadeus.com/
- **Rate Limit**: 2,000 calls/month

```python
class AmadeusClient:
    def __init__(self, api_key: str, api_secret: str):
        self.api_key = api_key
        self.api_secret = api_secret
        self.base_url = "https://api.amadeus.com/v1"
        self.access_token = None
    
    async def get_access_token(self) -> str:
        """Get access token for API calls."""
        url = "https://test.api.amadeus.com/v1/security/oauth2/token"
        data = {
            'grant_type': 'client_credentials',
            'client_id': self.api_key,
            'client_secret': self.api_secret
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(url, data=data) as response:
                result = await response.json()
                self.access_token = result['access_token']
                return self.access_token
    
    async def search_flights(self, origin: str, destination: str, departure_date: str) -> Dict:
        """Search for flights."""
        if not self.access_token:
            await self.get_access_token()
        
        url = f"{self.base_url}/shopping/flight-offers"
        headers = {'Authorization': f'Bearer {self.access_token}'}
        params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': departure_date,
            'adults': 1,
            'max': 10
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, params=params) as response:
                return await response.json()
```

## 🏨 Hotel Data Sources

### 1. Public Hotel Data
Since most hotel APIs require paid plans, we'll use web scraping and public data sources:

```python
import requests
from bs4 import BeautifulSoup
import asyncio
import aiohttp

class HotelDataScraper:
    """
    Ethical web scraping for hotel information.
    """
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
    
    async def get_hotel_info(self, city: str) -> List[Dict]:
        """
        Get hotel information from public sources.
        """
        # This would scrape public hotel information
        # Implementation depends on specific sources
        pass
    
    async def get_hotel_reviews(self, hotel_name: str, city: str) -> List[Dict]:
        """
        Get hotel reviews from public sources.
        """
        # Scrape reviews from public review sites
        pass
```

### 2. OpenStreetMap Data
- **Free**: No limits
- **Features**: Hotel locations, amenities, reviews
- **API**: Overpass API

```python
class OSMHotelClient:
    def __init__(self):
        self.base_url = "https://overpass-api.de/api/interpreter"
    
    async def get_hotels_in_city(self, city: str) -> List[Dict]:
        """Get hotels from OpenStreetMap."""
        query = f"""
        [out:json];
        (
          node["tourism"="hotel"]["addr:city"="{city}"];
          way["tourism"="hotel"]["addr:city"="{city}"];
          relation["tourism"="hotel"]["addr:city"="{city}"];
        );
        out center;
        """
        
        async with aiohttp.ClientSession() as session:
            async with session.post(self.base_url, data=query) as response:
                return await response.json()
```

## 🌍 Country & Travel Information

### 1. REST Countries API
- **Free**: No limits
- **Features**: Country information, currencies, languages
- **URL**: https://restcountries.com/

```python
class RestCountriesClient:
    def __init__(self):
        self.base_url = "https://restcountries.com/v3.1"
    
    async def get_country_info(self, country_name: str) -> Dict:
        """Get country information."""
        url = f"{self.base_url}/name/{country_name}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                data = await response.json()
                return data[0] if data else {}
    
    async def get_countries_by_currency(self, currency: str) -> List[Dict]:
        """Get countries that use a specific currency."""
        url = f"{self.base_url}/currency/{currency}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return await response.json()
```

### 2. Wikipedia API
- **Free**: No limits
- **Features**: Travel information, city data, cultural information
- **URL**: https://en.wikipedia.org/api/rest_v1/

```python
class WikipediaClient:
    def __init__(self):
        self.base_url = "https://en.wikipedia.org/api/rest_v1"
    
    async def get_city_info(self, city_name: str) -> Dict:
        """Get city information from Wikipedia."""
        url = f"{self.base_url}/page/summary/{city_name}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return await response.json()
    
    async def search_travel_info(self, query: str) -> List[Dict]:
        """Search for travel-related information."""
        url = f"{self.base_url}/page/summary/{query}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return await response.json()
```

## 🗺️ Maps & Location Data

### 1. OpenStreetMap (Free)
- **Free**: No limits
- **Features**: Maps, routing, points of interest
- **API**: Nominatim API

```python
class NominatimClient:
    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org"
    
    async def geocode(self, address: str) -> Dict:
        """Convert address to coordinates."""
        url = f"{self.base_url}/search"
        params = {
            'q': address,
            'format': 'json',
            'limit': 1
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                data = await response.json()
                return data[0] if data else {}
    
    async def reverse_geocode(self, lat: float, lon: float) -> Dict:
        """Convert coordinates to address."""
        url = f"{self.base_url}/reverse"
        params = {
            'lat': lat,
            'lon': lon,
            'format': 'json'
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as response:
                return await response.json()
```

## 📊 Public Datasets

### 1. Government Open Data
- **US**: data.gov
- **EU**: data.europa.eu
- **UK**: data.gov.uk
- **Features**: Travel statistics, tourism data, economic indicators

### 2. Academic Datasets
- **Kaggle**: Free travel datasets
- **Google Dataset Search**: Academic travel research
- **World Bank**: Economic and travel data

## 🔧 API Management

### 1. Rate Limiting
```python
import asyncio
import time
from collections import defaultdict

class APIRateLimiter:
    """
    Manages rate limits for multiple APIs.
    """
    
    def __init__(self):
        self.rate_limits = {
            'openweather': {'calls': 0, 'reset_time': 0, 'limit': 1000},
            'fixer': {'calls': 0, 'reset_time': 0, 'limit': 100},
            'aviationstack': {'calls': 0, 'reset_time': 0, 'limit': 100},
            'amadeus': {'calls': 0, 'reset_time': 0, 'limit': 2000}
        }
    
    async def check_rate_limit(self, api_name: str) -> bool:
        """Check if API call is within rate limit."""
        now = time.time()
        api_limit = self.rate_limits[api_name]
        
        # Reset counter if time window has passed
        if now > api_limit['reset_time']:
            api_limit['calls'] = 0
            api_limit['reset_time'] = now + 3600  # 1 hour
        
        # Check if under limit
        if api_limit['calls'] < api_limit['limit']:
            api_limit['calls'] += 1
            return True
        
        return False
    
    async def wait_for_rate_limit(self, api_name: str):
        """Wait until rate limit resets."""
        api_limit = self.rate_limits[api_name]
        wait_time = api_limit['reset_time'] - time.time()
        
        if wait_time > 0:
            await asyncio.sleep(wait_time)
```

### 2. API Key Management
```python
import os
from typing import Dict

class APIKeyManager:
    """
    Manages API keys securely.
    """
    
    def __init__(self):
        self.api_keys = self._load_api_keys()
    
    def _load_api_keys(self) -> Dict[str, str]:
        """Load API keys from environment variables."""
        return {
            'openweather': os.getenv('OPENWEATHER_API_KEY'),
            'fixer': os.getenv('FIXER_API_KEY'),
            'aviationstack': os.getenv('AVIATIONSTACK_API_KEY'),
            'amadeus_key': os.getenv('AMADEUS_API_KEY'),
            'amadeus_secret': os.getenv('AMADEUS_API_SECRET')
        }
    
    def get_api_key(self, service: str) -> str:
        """Get API key for a service."""
        return self.api_keys.get(service)
    
    def validate_api_keys(self) -> Dict[str, bool]:
        """Validate all API keys."""
        validation_results = {}
        
        for service, key in self.api_keys.items():
            validation_results[service] = key is not None and len(key) > 0
        
        return validation_results
```

## 📋 Free API Setup Checklist

### Required API Keys
- [ ] OpenWeather API key (weather data)
- [ ] Fixer.io API key (currency exchange)
- [ ] AviationStack API key (flight data)
- [ ] Amadeus API key + secret (travel data)

### Optional API Keys
- [ ] WeatherAPI key (backup weather)
- [ ] ExchangeRate-API (backup currency)

### Environment Setup
```env
# Required APIs
OPENWEATHER_API_KEY=your_openweather_key
FIXER_API_KEY=your_fixer_key
AVIATIONSTACK_API_KEY=your_aviationstack_key
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret

# Optional APIs
WEATHERAPI_KEY=your_weatherapi_key
EXCHANGERATE_API_KEY=your_exchangerate_key
```

## 🚀 Usage Examples

### Complete Travel Search
```python
async def search_travel_info(city: str):
    """Search comprehensive travel information using free APIs."""
    
    # Initialize clients
    weather_client = OpenWeatherClient(api_key_manager.get_api_key('openweather'))
    currency_client = FixerClient(api_key_manager.get_api_key('fixer'))
    country_client = RestCountriesClient()
    wiki_client = WikipediaClient()
    
    # Gather information
    weather_info = await weather_client.get_current_weather(city)
    city_info = await wiki_client.get_city_info(city)
    
    # Get country information
    country_name = city_info.get('extract', '').split(',')[-1].strip()
    country_info = await country_client.get_country_info(country_name)
    
    return {
        'weather': weather_info,
        'city_info': city_info,
        'country_info': country_info
    }
```

---

This guide ensures you have access to comprehensive travel data using only free APIs and public sources, keeping costs at zero while maintaining functionality.
