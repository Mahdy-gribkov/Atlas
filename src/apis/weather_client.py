"""
OpenWeather API client for weather information.
Free tier: 1000 calls/day
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json

from config import config
from .rate_limiter import APIRateLimiter

class OpenWeatherClient:
    """
    OpenWeather API client with rate limiting and caching.
    Provides current weather and forecasts for travel planning.
    """
    
    def __init__(self, api_key: str = None, rate_limiter: APIRateLimiter = None):
        self.api_key = api_key or config.OPENWEATHER_API_KEY
        self.base_url = "http://api.openweathermap.org/data/2.5"
        self.rate_limiter = rate_limiter or APIRateLimiter()
        
        if not self.api_key:
            raise ValueError("OpenWeather API key is required")
    
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make API request with rate limiting and error handling.
        
        Args:
            endpoint: API endpoint
            params: Request parameters
            
        Returns:
            dict: API response data
        """
        # Check rate limit
        if not await self.rate_limiter.check_rate_limit('openweather'):
            await self.rate_limiter.wait_for_rate_limit('openweather')
        
        # Add API key to parameters
        params['appid'] = self.api_key
        params['units'] = 'metric'  # Use metric units
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        error_text = await response.text()
                        raise Exception(f"API request failed: {response.status} - {error_text}")
        
        except asyncio.TimeoutError:
            raise Exception("API request timed out")
        except Exception as e:
            raise Exception(f"API request error: {str(e)}")
    
    async def get_current_weather(self, city: str, country_code: str = None) -> Dict[str, Any]:
        """
        Get current weather for a city.
        
        Args:
            city: City name
            country_code: Optional country code (e.g., 'US', 'GB')
            
        Returns:
            dict: Current weather data
        """
        query = f"{city},{country_code}" if country_code else city
        
        params = {'q': query}
        
        try:
            data = await self._make_request('weather', params)
            
            # Format response for travel planning
            return {
                'city': data['name'],
                'country': data['sys']['country'],
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'wind_direction': data['wind'].get('deg', 0),
                'visibility': data.get('visibility', 0),
                'cloudiness': data['clouds']['all'],
                'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).isoformat(),
                'sunset': datetime.fromtimestamp(data['sys']['sunset']).isoformat(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to get current weather for {city}: {str(e)}")
    
    async def get_weather_forecast(self, city: str, country_code: str = None, days: int = 5) -> List[Dict[str, Any]]:
        """
        Get weather forecast for a city.
        
        Args:
            city: City name
            country_code: Optional country code
            days: Number of days to forecast (max 5)
            
        Returns:
            list: Forecast data for each day
        """
        query = f"{city},{country_code}" if country_code else city
        
        params = {
            'q': query,
            'cnt': min(days * 8, 40)  # 8 forecasts per day, max 40 total
        }
        
        try:
            data = await self._make_request('forecast', params)
            
            # Group forecasts by day
            daily_forecasts = {}
            
            for item in data['list']:
                date = datetime.fromtimestamp(item['dt']).date()
                
                if date not in daily_forecasts:
                    daily_forecasts[date] = {
                        'date': date.isoformat(),
                        'city': data['city']['name'],
                        'country': data['city']['country'],
                        'forecasts': []
                    }
                
                forecast = {
                    'time': datetime.fromtimestamp(item['dt']).isoformat(),
                    'temperature': item['main']['temp'],
                    'feels_like': item['main']['feels_like'],
                    'humidity': item['main']['humidity'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'wind_speed': item['wind']['speed'],
                    'cloudiness': item['clouds']['all'],
                    'precipitation_probability': item.get('pop', 0) * 100
                }
                
                daily_forecasts[date]['forecasts'].append(forecast)
            
            # Calculate daily summaries
            result = []
            for date, day_data in sorted(daily_forecasts.items()):
                forecasts = day_data['forecasts']
                
                # Calculate daily statistics
                temps = [f['temperature'] for f in forecasts]
                humidities = [f['humidity'] for f in forecasts]
                wind_speeds = [f['wind_speed'] for f in forecasts]
                precip_probs = [f['precipitation_probability'] for f in forecasts]
                
                daily_summary = {
                    'date': day_data['date'],
                    'city': day_data['city'],
                    'country': day_data['country'],
                    'min_temperature': min(temps),
                    'max_temperature': max(temps),
                    'avg_temperature': sum(temps) / len(temps),
                    'avg_humidity': sum(humidities) / len(humidities),
                    'avg_wind_speed': sum(wind_speeds) / len(wind_speeds),
                    'max_precipitation_probability': max(precip_probs),
                    'description': forecasts[0]['description'],  # Use first forecast description
                    'icon': forecasts[0]['icon'],
                    'hourly_forecasts': forecasts
                }
                
                result.append(daily_summary)
            
            return result[:days]  # Return requested number of days
            
        except Exception as e:
            raise Exception(f"Failed to get weather forecast for {city}: {str(e)}")
    
    async def get_weather_by_coordinates(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Get current weather by coordinates.
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            dict: Current weather data
        """
        params = {'lat': lat, 'lon': lon}
        
        try:
            data = await self._make_request('weather', params)
            
            return {
                'city': data['name'],
                'country': data['sys']['country'],
                'coordinates': {'lat': lat, 'lon': lon},
                'temperature': data['main']['temp'],
                'feels_like': data['main']['feels_like'],
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'],
                'icon': data['weather'][0]['icon'],
                'wind_speed': data['wind']['speed'],
                'wind_direction': data['wind'].get('deg', 0),
                'visibility': data.get('visibility', 0),
                'cloudiness': data['clouds']['all'],
                'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).isoformat(),
                'sunset': datetime.fromtimestamp(data['sys']['sunset']).isoformat(),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to get weather for coordinates {lat}, {lon}: {str(e)}")
    
    async def get_weather_alerts(self, city: str, country_code: str = None) -> List[Dict[str, Any]]:
        """
        Get weather alerts for a city (if available).
        
        Args:
            city: City name
            country_code: Optional country code
            
        Returns:
            list: Weather alerts
        """
        # Note: Weather alerts require One Call API which is paid
        # For free tier, we'll return basic weather conditions that might be concerning
        
        try:
            current_weather = await self.get_current_weather(city, country_code)
            alerts = []
            
            # Check for potentially concerning weather conditions
            if current_weather['wind_speed'] > 15:  # High wind
                alerts.append({
                    'type': 'wind',
                    'severity': 'moderate',
                    'description': f"High winds: {current_weather['wind_speed']} m/s",
                    'recommendation': 'Consider postponing outdoor activities'
                })
            
            if current_weather['humidity'] > 80:  # High humidity
                alerts.append({
                    'type': 'humidity',
                    'severity': 'low',
                    'description': f"High humidity: {current_weather['humidity']}%",
                    'recommendation': 'Stay hydrated and seek air conditioning'
                })
            
            if current_weather['visibility'] < 1000:  # Low visibility
                alerts.append({
                    'type': 'visibility',
                    'severity': 'moderate',
                    'description': f"Low visibility: {current_weather['visibility']}m",
                    'recommendation': 'Exercise caution when driving or traveling'
                })
            
            return alerts
            
        except Exception as e:
            raise Exception(f"Failed to get weather alerts for {city}: {str(e)}")
    
    def get_weather_emoji(self, weather_code: str) -> str:
        """
        Get weather emoji based on weather icon code.
        
        Args:
            weather_code: OpenWeather icon code (e.g., '01d', '10n')
            
        Returns:
            str: Weather emoji
        """
        weather_emojis = {
            '01d': '☀️',  # clear sky day
            '01n': '🌙',  # clear sky night
            '02d': '⛅',  # few clouds day
            '02n': '☁️',  # few clouds night
            '03d': '☁️',  # scattered clouds
            '03n': '☁️',  # scattered clouds
            '04d': '☁️',  # broken clouds
            '04n': '☁️',  # broken clouds
            '09d': '🌧️',  # shower rain
            '09n': '🌧️',  # shower rain
            '10d': '🌦️',  # rain day
            '10n': '🌧️',  # rain night
            '11d': '⛈️',  # thunderstorm
            '11n': '⛈️',  # thunderstorm
            '13d': '❄️',  # snow
            '13n': '❄️',  # snow
            '50d': '🌫️',  # mist
            '50n': '🌫️',  # mist
        }
        
        return weather_emojis.get(weather_code, '🌤️')
    
    async def get_travel_weather_summary(self, city: str, country_code: str = None, 
                                       travel_dates: List[str] = None) -> Dict[str, Any]:
        """
        Get comprehensive weather summary for travel planning.
        
        Args:
            city: City name
            country_code: Optional country code
            travel_dates: List of travel dates (YYYY-MM-DD format)
            
        Returns:
            dict: Comprehensive weather summary
        """
        try:
            # Get current weather
            current = await self.get_current_weather(city, country_code)
            
            # Get forecast
            forecast_days = 5
            if travel_dates:
                # Calculate days between now and travel dates
                now = datetime.now().date()
                max_date = max([datetime.strptime(date, '%Y-%m-%d').date() for date in travel_dates])
                forecast_days = min((max_date - now).days + 1, 5)
            
            forecast = await self.get_weather_forecast(city, country_code, forecast_days)
            
            # Get weather alerts
            alerts = await self.get_weather_alerts(city, country_code)
            
            # Create travel recommendations
            recommendations = self._generate_weather_recommendations(current, forecast)
            
            return {
                'current_weather': current,
                'forecast': forecast,
                'alerts': alerts,
                'recommendations': recommendations,
                'summary': {
                    'city': current['city'],
                    'country': current['country'],
                    'current_temp': current['temperature'],
                    'current_description': current['description'],
                    'weather_emoji': self.get_weather_emoji(current['icon']),
                    'forecast_days': len(forecast),
                    'alerts_count': len(alerts)
                }
            }
            
        except Exception as e:
            raise Exception(f"Failed to get travel weather summary for {city}: {str(e)}")
    
    def _generate_weather_recommendations(self, current: Dict, forecast: List[Dict]) -> List[Dict[str, str]]:
        """
        Generate weather-based travel recommendations.
        
        Args:
            current: Current weather data
            forecast: Weather forecast data
            
        Returns:
            list: Travel recommendations
        """
        recommendations = []
        
        # Current weather recommendations
        if current['temperature'] < 10:
            recommendations.append({
                'type': 'clothing',
                'priority': 'high',
                'message': 'Pack warm clothing - temperatures are cold'
            })
        elif current['temperature'] > 30:
            recommendations.append({
                'type': 'clothing',
                'priority': 'high',
                'message': 'Pack light clothing - temperatures are hot'
            })
        
        if current['wind_speed'] > 10:
            recommendations.append({
                'type': 'activities',
                'priority': 'medium',
                'message': 'High winds may affect outdoor activities'
            })
        
        if current['humidity'] > 80:
            recommendations.append({
                'type': 'health',
                'priority': 'medium',
                'message': 'High humidity - stay hydrated and seek air conditioning'
            })
        
        # Forecast recommendations
        for day in forecast:
            if day['max_precipitation_probability'] > 50:
                recommendations.append({
                    'type': 'activities',
                    'priority': 'medium',
                    'message': f"Rain likely on {day['date']} - plan indoor activities"
                })
            
            if day['max_temperature'] > 35:
                recommendations.append({
                    'type': 'health',
                    'priority': 'high',
                    'message': f"Very hot weather on {day['date']} - avoid outdoor activities during midday"
                })
        
        return recommendations
