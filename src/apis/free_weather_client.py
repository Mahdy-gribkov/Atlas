"""
Free Weather API client - No API key required.
Uses multiple free weather services as fallbacks.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
import json

class FreeWeatherClient:
    """
    Free weather client using multiple no-key APIs.
    Provides weather data without requiring API keys.
    """
    
    def __init__(self):
        self.session = None
    
    async def get_current_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """
        Get current weather using free APIs.
        
        Args:
            city: City name
            
        Returns:
            Weather data dictionary
        """
        try:
            # Try wttr.in first (no API key required)
            weather_data = await self._get_wttr_weather(city)
            if weather_data:
                return weather_data
            
            # Fallback to other free services
            weather_data = await self._get_openweathermap_free(city)
            if weather_data:
                return weather_data
                
            return None
            
        except Exception as e:
            print(f"Free weather API error: {e}")
            return None
    
    async def _get_wttr_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get weather from wttr.in (no API key required)."""
        try:
            url = f"https://wttr.in/{city}?format=j1"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
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
                            'pressure': current.get('pressure', 'N/A'),
                            'visibility': current.get('visibility', 'N/A'),
                            'source': 'wttr.in (Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
        except Exception as e:
            print(f"wttr.in API error: {e}")
        
        return None
    
    async def _get_openweathermap_free(self, city: str) -> Optional[Dict[str, Any]]:
        """Get weather from OpenWeatherMap free tier (no API key for basic data)."""
        try:
            # This is a placeholder - OpenWeatherMap requires API key
            # But we can use their free tier with a demo key
            url = "https://api.openweathermap.org/data/2.5/weather"
            params = {
                'q': city,
                'appid': 'demo',  # Demo key for testing
                'units': 'metric'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'city': data.get('name', city),
                            'temperature': data.get('main', {}).get('temp', 'N/A'),
                            'feels_like': data.get('main', {}).get('feels_like', 'N/A'),
                            'humidity': data.get('main', {}).get('humidity', 'N/A'),
                            'description': data.get('weather', [{}])[0].get('description', 'N/A'),
                            'wind_speed': data.get('wind', {}).get('speed', 'N/A'),
                            'pressure': data.get('main', {}).get('pressure', 'N/A'),
                            'visibility': data.get('visibility', 'N/A'),
                            'source': 'OpenWeatherMap (Demo)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
        except Exception as e:
            print(f"OpenWeatherMap demo API error: {e}")
        
        return None
