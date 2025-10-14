"""
Free Weather API client - No API key required.
Uses real free weather services that provide actual data.
Consolidated and improved version with better error handling and circuit breaker pattern.
"""

import aiohttp
import asyncio
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json

from .rate_limiter import APIRateLimiter

logger = logging.getLogger(__name__)

class WeatherClient:
    """
    Free weather client using real free APIs.
    Provides actual weather data without requiring API keys.
    Implements circuit breaker pattern for reliability.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        """
        Initialize the weather client.
        
        Args:
            rate_limiter: Optional rate limiter instance
        """
        self.rate_limiter = rate_limiter or APIRateLimiter()
        self.circuit_breaker = {
            'wttr': {'failures': 0, 'last_failure': None, 'state': 'closed'},
            'open_meteo': {'failures': 0, 'last_failure': None, 'state': 'closed'},
            'openweatherlite': {'failures': 0, 'last_failure': None, 'state': 'closed'}
        }
        self.max_failures = 3
        self.timeout_seconds = 30
    
    async def get_current_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """
        Get current weather for a city using real free APIs.
        
        Args:
            city: City name
            
        Returns:
            Current weather data from real APIs or None if all fail
        """
        if not city or not city.strip():
            logger.warning("Empty city name provided")
            return None
        
        city = city.strip()
        logger.info(f"Getting weather for {city}")
        
        # Try wttr.in first (most reliable free service)
        if self._is_circuit_closed('wttr'):
            weather_data = await self._get_wttr_weather(city)
            if weather_data:
                self._reset_circuit('wttr')
                return weather_data
            else:
                self._record_failure('wttr')
        
        # Fallback to Open-Meteo (very reliable, no key required)
        if self._is_circuit_closed('open_meteo'):
            weather_data = await self._get_open_meteo_weather(city)
            if weather_data:
                self._reset_circuit('open_meteo')
                return weather_data
            else:
                self._record_failure('open_meteo')
        
        # Final fallback to OpenWeatherLite
        if self._is_circuit_closed('openweatherlite'):
            weather_data = await self._get_openweatherlite_weather(city)
            if weather_data:
                self._reset_circuit('openweatherlite')
                return weather_data
            else:
                self._record_failure('openweatherlite')
        
        logger.error(f"All weather APIs failed for {city}")
        return None
    
    async def get_weather_forecast(self, city: str, days: int = 5) -> List[Dict[str, Any]]:
        """
        Get weather forecast for a city using real free APIs.
        
        Args:
            city: City name
            days: Number of forecast days (max 16)
            
        Returns:
            List of forecast data from real APIs
        """
        if not city or not city.strip():
            logger.warning("Empty city name provided for forecast")
            return []
        
        city = city.strip()
        days = min(max(days, 1), 16)  # Limit to 1-16 days
        logger.info(f"Getting {days}-day forecast for {city}")
        
        # Try Open-Meteo first (best free forecast API)
        if self._is_circuit_closed('open_meteo'):
            forecast_data = await self._get_open_meteo_forecast(city, days)
            if forecast_data:
                self._reset_circuit('open_meteo')
                return forecast_data
            else:
                self._record_failure('open_meteo')
        
        # Fallback to wttr.in forecast
        if self._is_circuit_closed('wttr'):
            forecast_data = await self._get_wttr_forecast(city, days)
            if forecast_data:
                self._reset_circuit('wttr')
                return forecast_data
            else:
                self._record_failure('wttr')
        
        logger.error(f"All forecast APIs failed for {city}")
        return []
    
    def _is_circuit_closed(self, service: str) -> bool:
        """Check if circuit breaker is closed for a service."""
        circuit = self.circuit_breaker.get(service, {})
        if circuit.get('state') == 'open':
            # Check if timeout has passed
            last_failure = circuit.get('last_failure')
            if last_failure and (datetime.now() - last_failure).seconds > self.timeout_seconds:
                circuit['state'] = 'half-open'
                return True
            return False
        return True
    
    def _record_failure(self, service: str):
        """Record a failure for a service."""
        circuit = self.circuit_breaker.get(service, {})
        circuit['failures'] = circuit.get('failures', 0) + 1
        circuit['last_failure'] = datetime.now()
        
        if circuit['failures'] >= self.max_failures:
            circuit['state'] = 'open'
            logger.warning(f"Circuit breaker opened for {service}")
    
    def _reset_circuit(self, service: str):
        """Reset circuit breaker for a service."""
        circuit = self.circuit_breaker.get(service, {})
        circuit['failures'] = 0
        circuit['last_failure'] = None
        circuit['state'] = 'closed'
    
    async def _get_wttr_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from wttr.in (completely free, no API key)."""
        try:
            # Check rate limit
            if not await self.rate_limiter.check_rate_limit('wttr'):
                logger.warning("Rate limit exceeded for wttr.in")
                return None
            
            url = f"https://wttr.in/{city}?format=j1"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    timeout=aiohttp.ClientTimeout(total=10),
                    headers={'User-Agent': 'Travel-AI-Agent/1.0'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        current = data.get('current_condition', [{}])[0]
                        
                        return {
                            'city': city,
                            'temperature': current.get('temp_C', 'N/A'),
                            'feels_like': current.get('FeelsLikeC', 'N/A'),
                            'humidity': current.get('humidity', 'N/A'),
                            'description': current.get('weatherDesc', [{}])[0].get('value', 'N/A'),
                            'wind_speed': current.get('windspeedKmph', 'N/A'),
                            'wind_direction': current.get('winddir16Point', 'N/A'),
                            'pressure': current.get('pressure', 'N/A'),
                            'visibility': current.get('visibility', 'N/A'),
                            'uv_index': current.get('uvIndex', 'N/A'),
                            'source': 'wttr.in (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        logger.warning(f"wttr.in returned status {response.status}")
                        return None
        except Exception as e:
            logger.error(f"wttr.in error: {e}")
            return None
    
    async def _get_open_meteo_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from Open-Meteo (completely free, no API key)."""
        try:
            # Check rate limit
            if not await self.rate_limiter.check_rate_limit('open_meteo'):
                logger.warning("Rate limit exceeded for Open-Meteo")
                return None
            
            # First get coordinates using free geocoding
            coords = await self._get_coordinates(city)
            if not coords:
                logger.warning(f"Could not get coordinates for {city}")
                return None
            
            lat, lon = coords['latitude'], coords['longitude']
            
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m',
                'timezone': 'auto'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    params=params, 
                    timeout=aiohttp.ClientTimeout(total=10),
                    headers={'User-Agent': 'Travel-AI-Agent/1.0'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        current = data.get('current', {})
                        weather_code = current.get('weather_code', 0)
                        
                        return {
                            'city': city,
                            'temperature': current.get('temperature_2m', 'N/A'),
                            'feels_like': current.get('apparent_temperature', 'N/A'),
                            'humidity': current.get('relative_humidity_2m', 'N/A'),
                            'description': self._get_weather_description(weather_code),
                            'wind_speed': current.get('wind_speed_10m', 'N/A'),
                            'wind_direction': current.get('wind_direction_10m', 'N/A'),
                            'precipitation': current.get('precipitation', 'N/A'),
                            'cloud_cover': current.get('cloud_cover', 'N/A'),
                            'source': 'Open-Meteo (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        logger.warning(f"Open-Meteo returned status {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Open-Meteo error: {e}")
            return None
    
    async def _get_openweatherlite_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from OpenWeatherLite (completely free, no API key)."""
        try:
            # Check rate limit
            if not await self.rate_limiter.check_rate_limit('openweatherlite'):
                logger.warning("Rate limit exceeded for OpenWeatherLite")
                return None
            
            url = f"https://openweatherlite.com/api/weather?q={city}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    timeout=aiohttp.ClientTimeout(total=10),
                    headers={'User-Agent': 'Travel-AI-Agent/1.0'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'city': city,
                            'temperature': data.get('main', {}).get('temp', 'N/A'),
                            'feels_like': data.get('main', {}).get('feels_like', 'N/A'),
                            'humidity': data.get('main', {}).get('humidity', 'N/A'),
                            'description': data.get('weather', [{}])[0].get('description', 'N/A'),
                            'wind_speed': data.get('wind', {}).get('speed', 'N/A'),
                            'wind_direction': data.get('wind', {}).get('deg', 'N/A'),
                            'pressure': data.get('main', {}).get('pressure', 'N/A'),
                            'visibility': data.get('visibility', 'N/A'),
                            'source': 'OpenWeatherLite (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        logger.warning(f"OpenWeatherLite returned status {response.status}")
                        return None
        except Exception as e:
            logger.error(f"OpenWeatherLite error: {e}")
            return None
    
    async def _get_open_meteo_forecast(self, city: str, days: int) -> List[Dict[str, Any]]:
        """Get real forecast data from Open-Meteo."""
        try:
            coords = await self._get_coordinates(city)
            if not coords:
                return []
            
            lat, lon = coords['latitude'], coords['longitude']
            
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                'latitude': lat,
                'longitude': lon,
                'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
                'timezone': 'auto',
                'forecast_days': days
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    params=params, 
                    timeout=aiohttp.ClientTimeout(total=10),
                    headers={'User-Agent': 'Travel-AI-Agent/1.0'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        daily = data.get('daily', {})
                        dates = daily.get('time', [])
                        max_temps = daily.get('temperature_2m_max', [])
                        min_temps = daily.get('temperature_2m_min', [])
                        precipitations = daily.get('precipitation_sum', [])
                        weather_codes = daily.get('weather_code', [])
                        
                        forecasts = []
                        for i in range(len(dates)):
                            forecasts.append({
                                'date': dates[i],
                                'max_temperature': max_temps[i] if i < len(max_temps) else 'N/A',
                                'min_temperature': min_temps[i] if i < len(min_temps) else 'N/A',
                                'precipitation': precipitations[i] if i < len(precipitations) else 'N/A',
                                'description': self._get_weather_description(weather_codes[i] if i < len(weather_codes) else 0),
                                'source': 'Open-Meteo (Real Data, Free)'
                            })
                        
                        return forecasts
                    else:
                        logger.warning(f"Open-Meteo forecast returned status {response.status}")
                        return []
        except Exception as e:
            logger.error(f"Open-Meteo forecast error: {e}")
            return []
    
    async def _get_wttr_forecast(self, city: str, days: int) -> List[Dict[str, Any]]:
        """Get real forecast data from wttr.in."""
        try:
            url = f"https://wttr.in/{city}?format=j1"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    timeout=aiohttp.ClientTimeout(total=10),
                    headers={'User-Agent': 'Travel-AI-Agent/1.0'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        weather = data.get('weather', [])
                        
                        forecasts = []
                        for i, day in enumerate(weather[:days]):
                            forecasts.append({
                                'date': day.get('date', ''),
                                'max_temperature': day.get('maxtempC', 'N/A'),
                                'min_temperature': day.get('mintempC', 'N/A'),
                                'precipitation': day.get('totalprecipMM', 'N/A'),
                                'description': day.get('hourly', [{}])[0].get('weatherDesc', [{}])[0].get('value', 'N/A'),
                                'source': 'wttr.in (Real Data, Free)'
                            })
                        
                        return forecasts
                    else:
                        logger.warning(f"wttr.in forecast returned status {response.status}")
                        return []
        except Exception as e:
            logger.error(f"wttr.in forecast error: {e}")
            return []
    
    async def _get_coordinates(self, city: str) -> Optional[Dict[str, float]]:
        """Get coordinates for a city using free geocoding (no API key)."""
        try:
            # Use Nominatim (free, no API key, real data)
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                'q': city,
                'format': 'json',
                'limit': 1
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    url, 
                    params=params, 
                    timeout=aiohttp.ClientTimeout(total=10),
                    headers={'User-Agent': 'Travel-AI-Agent/1.0'}
                ) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data and len(data) > 0:
                            return {
                                'latitude': float(data[0]['lat']),
                                'longitude': float(data[0]['lon'])
                            }
                    else:
                        logger.warning(f"Geocoding returned status {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Geocoding error: {e}")
            return None
    
    def _get_weather_description(self, code: int) -> str:
        """Convert weather code to description."""
        weather_codes = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Dense drizzle",
            61: "Slight rain",
            63: "Moderate rain",
            65: "Heavy rain",
            71: "Slight snow",
            73: "Moderate snow",
            75: "Heavy snow",
            77: "Snow grains",
            80: "Slight rain showers",
            81: "Moderate rain showers",
            82: "Violent rain showers",
            85: "Slight snow showers",
            86: "Heavy snow showers",
            95: "Thunderstorm",
            96: "Thunderstorm with slight hail",
            99: "Thunderstorm with heavy hail"
        }
        return weather_codes.get(code, "Unknown")

# Backward compatibility aliases
OpenWeatherClient = WeatherClient
FreeWeatherClient = WeatherClient