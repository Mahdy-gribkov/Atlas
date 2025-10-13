"""
Open-Meteo API client - No API key required.
Provides weather forecasts and historical data.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import json

class OpenMeteoClient:
    """
    Open-Meteo API client for weather data.
    No API key required, completely free.
    """
    
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1"
    
    async def get_current_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """
        Get current weather for a city.
        
        Args:
            city: City name
            
        Returns:
            Weather data dictionary
        """
        try:
            # First get coordinates for the city
            coords = await self._get_coordinates(city)
            if not coords:
                return None
            
            lat, lon = coords['latitude'], coords['longitude']
            
            # Get current weather
            url = f"{self.base_url}/forecast"
            params = {
                'latitude': lat,
                'longitude': lon,
                'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m',
                'timezone': 'auto'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
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
                            'source': 'Open-Meteo (Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
        except Exception as e:
            print(f"Open-Meteo API error: {e}")
        
        return None
    
    async def get_weather_forecast(self, city: str, days: int = 5) -> List[Dict[str, Any]]:
        """
        Get weather forecast for a city.
        
        Args:
            city: City name
            days: Number of days to forecast (max 16)
            
        Returns:
            List of forecast data
        """
        try:
            coords = await self._get_coordinates(city)
            if not coords:
                return []
            
            lat, lon = coords['latitude'], coords['longitude']
            
            url = f"{self.base_url}/forecast"
            params = {
                'latitude': lat,
                'longitude': lon,
                'daily': 'temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code',
                'timezone': 'auto',
                'forecast_days': min(days, 16)
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
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
                                'source': 'Open-Meteo (Free)'
                            })
                        
                        return forecasts
                        
        except Exception as e:
            print(f"Open-Meteo forecast error: {e}")
        
        return []
    
    async def _get_coordinates(self, city: str) -> Optional[Dict[str, float]]:
        """Get coordinates for a city using Open-Meteo geocoding."""
        try:
            url = f"{self.base_url}/search"
            params = {
                'name': city,
                'count': 1,
                'language': 'en',
                'format': 'json'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        results = data.get('results', [])
                        if results:
                            return {
                                'latitude': results[0].get('latitude'),
                                'longitude': results[0].get('longitude')
                            }
                        
        except Exception as e:
            print(f"Open-Meteo geocoding error: {e}")
        
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
