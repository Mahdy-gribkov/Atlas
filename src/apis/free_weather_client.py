"""
Free Weather API client - No API key required.
Uses real free weather services that provide actual data.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import json

class FreeWeatherClient:
    """
    Free weather client using real free APIs.
    Provides actual weather data without requiring API keys.
    """
    
    def __init__(self):
        self.session = None
    
    async def get_current_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """
        Get current weather for a city using multiple real free APIs.
        
        Args:
            city: City name
            
        Returns:
            Current weather data from real APIs
        """
        try:
            # Try multiple sources and combine data for accuracy
            weather_sources = []
            
            # Source 1: wttr.in (completely free, no key, real data)
            wttr_data = await self._get_wttr_weather(city)
            if wttr_data:
                weather_sources.append(wttr_data)
            
            # Source 2: Open-Meteo (completely free, no key, real data)
            meteo_data = await self._get_open_meteo_weather(city)
            if meteo_data:
                weather_sources.append(meteo_data)
            
            # Source 3: WeatherAPI free tier (real data)
            weatherapi_data = await self._get_weatherapi_weather(city)
            if weatherapi_data:
                weather_sources.append(weatherapi_data)
            
            # Source 4: OpenWeatherLite (completely free, no key, real data)
            openweatherlite_data = await self._get_openweatherlite_weather(city)
            if openweatherlite_data:
                weather_sources.append(openweatherlite_data)
            
            if weather_sources:
                # Combine data from multiple sources for accuracy
                return self._combine_weather_data(weather_sources, city)
            
            return None
            
        except Exception as e:
            print(f"Weather API error: {e}")
            return None
    
    async def get_weather_forecast(self, city: str, days: int = 5) -> List[Dict[str, Any]]:
        """
        Get weather forecast for a city using real free APIs.
        
        Args:
            city: City name
            days: Number of forecast days
            
        Returns:
            List of forecast data from real APIs
        """
        try:
            # Try Open-Meteo first (best free forecast API, real data)
            forecast_data = await self._get_open_meteo_forecast(city, days)
            if forecast_data:
                return forecast_data
            
            # Fallback to wttr.in forecast
            forecast_data = await self._get_wttr_forecast(city, days)
            if forecast_data:
                return forecast_data
            
            return []
            
        except Exception as e:
            print(f"Forecast API error: {e}")
            return []
    
    async def _get_wttr_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from wttr.in (completely free, no API key)."""
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
                            'wind_direction': current.get('winddir16Point', 'N/A'),
                            'pressure': current.get('pressure', 'N/A'),
                            'visibility': current.get('visibility', 'N/A'),
                            'uv_index': current.get('uvIndex', 'N/A'),
                            'source': 'wttr.in (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
        except Exception as e:
            print(f"wttr.in error: {e}")
            return None
    
    async def _get_open_meteo_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from Open-Meteo (completely free, no API key)."""
        try:
            # First get coordinates using free geocoding
            coords = await self._get_coordinates(city)
            if not coords:
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
                            'source': 'Open-Meteo (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
        except Exception as e:
            print(f"Open-Meteo error: {e}")
            return None
    
    async def _get_weatherapi_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from WeatherAPI free tier."""
        try:
            url = "http://api.weatherapi.com/v1/current.json"
            params = {
                'key': 'demo',  # Free tier demo key
                'q': city,
                'aqi': 'no'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        current = data.get('current', {})
                        
                        return {
                            'city': city,
                            'temperature': current.get('temp_c', 'N/A'),
                            'feels_like': current.get('feelslike_c', 'N/A'),
                            'humidity': current.get('humidity', 'N/A'),
                            'description': current.get('condition', {}).get('text', 'N/A'),
                            'wind_speed': current.get('wind_kph', 'N/A'),
                            'wind_direction': current.get('wind_degree', 'N/A'),
                            'pressure': current.get('pressure_mb', 'N/A'),
                            'visibility': current.get('vis_km', 'N/A'),
                            'uv_index': current.get('uv', 'N/A'),
                            'source': 'WeatherAPI Free (Real Data)',
                            'timestamp': datetime.now().isoformat()
                        }
        except Exception as e:
            print(f"WeatherAPI error: {e}")
            return None
    
    async def _get_openweatherlite_weather(self, city: str) -> Optional[Dict[str, Any]]:
        """Get real weather data from OpenWeatherLite (completely free, no API key)."""
        try:
            url = f"https://openweatherlite.com/api/weather?q={city}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
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
        except Exception as e:
            print(f"OpenWeatherLite error: {e}")
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
                                'source': 'Open-Meteo (Real Data, Free)'
                            })
                        
                        return forecasts
        except Exception as e:
            print(f"Open-Meteo forecast error: {e}")
            return []
    
    async def _get_wttr_forecast(self, city: str, days: int) -> List[Dict[str, Any]]:
        """Get real forecast data from wttr.in."""
        try:
            url = f"https://wttr.in/{city}?format=j1"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
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
        except Exception as e:
            print(f"wttr.in forecast error: {e}")
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
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        if data and len(data) > 0:
                            return {
                                'latitude': float(data[0]['lat']),
                                'longitude': float(data[0]['lon'])
                            }
        except Exception as e:
            print(f"Geocoding error: {e}")
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
    
    def _combine_weather_data(self, weather_sources: List[Dict[str, Any]], city: str) -> Dict[str, Any]:
        """Combine weather data from multiple sources for accuracy."""
        try:
            # Extract numeric values and calculate averages
            temperatures = []
            humidities = []
            pressures = []
            wind_speeds = []
            descriptions = []
            sources_used = []
            
            for source_data in weather_sources:
                sources_used.append(source_data.get('source', 'Unknown'))
                
                # Temperature
                temp = source_data.get('temperature')
                if temp != 'N/A' and temp is not None:
                    try:
                        temperatures.append(float(temp))
                    except (ValueError, TypeError):
                        pass
                
                # Humidity
                humidity = source_data.get('humidity')
                if humidity != 'N/A' and humidity is not None:
                    try:
                        humidities.append(float(humidity))
                    except (ValueError, TypeError):
                        pass
                
                # Pressure
                pressure = source_data.get('pressure')
                if pressure != 'N/A' and pressure is not None:
                    try:
                        pressures.append(float(pressure))
                    except (ValueError, TypeError):
                        pass
                
                # Wind speed
                wind = source_data.get('wind_speed')
                if wind != 'N/A' and wind is not None:
                    try:
                        wind_speeds.append(float(wind))
                    except (ValueError, TypeError):
                        pass
                
                # Description
                desc = source_data.get('description')
                if desc != 'N/A' and desc:
                    descriptions.append(desc)
            
            # Calculate averages
            avg_temp = sum(temperatures) / len(temperatures) if temperatures else 'N/A'
            avg_humidity = sum(humidities) / len(humidities) if humidities else 'N/A'
            avg_pressure = sum(pressures) / len(pressures) if pressures else 'N/A'
            avg_wind = sum(wind_speeds) / len(wind_speeds) if wind_speeds else 'N/A'
            
            # Get most common description
            most_common_desc = max(set(descriptions), key=descriptions.count) if descriptions else 'Unknown'
            
            return {
                'city': city,
                'temperature': round(avg_temp, 1) if avg_temp != 'N/A' else 'N/A',
                'feels_like': 'N/A',  # Would need to calculate from multiple sources
                'humidity': round(avg_humidity, 1) if avg_humidity != 'N/A' else 'N/A',
                'description': most_common_desc,
                'wind_speed': round(avg_wind, 1) if avg_wind != 'N/A' else 'N/A',
                'wind_direction': 'N/A',  # Would need to calculate from multiple sources
                'pressure': round(avg_pressure, 1) if avg_pressure != 'N/A' else 'N/A',
                'visibility': 'N/A',  # Would need to calculate from multiple sources
                'uv_index': 'N/A',  # Would need to calculate from multiple sources
                'sources_used': len(weather_sources),
                'source': f'Enhanced Weather ({len(weather_sources)} Sources)',
                'timestamp': datetime.now().isoformat(),
                'raw_sources': sources_used
            }
            
        except Exception as e:
            print(f"Weather data combination error: {e}")
            # Return the first available source as fallback
            return weather_sources[0] if weather_sources else {
                'city': city,
                'error': str(e),
                'source': 'Enhanced Weather (Error)',
                'timestamp': datetime.now().isoformat()
            }