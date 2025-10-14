"""
Test suite for the consolidated Weather Client.
Tests all weather API integrations and circuit breaker functionality.
"""

import pytest
import asyncio
import aiohttp
from unittest.mock import AsyncMock, patch, MagicMock
from datetime import datetime

from src.apis.weather_client import WeatherClient
from src.apis.rate_limiter import APIRateLimiter


class TestWeatherClient:
    """Test cases for WeatherClient."""
    
    @pytest.fixture
    def weather_client(self):
        """Create a WeatherClient instance for testing."""
        rate_limiter = APIRateLimiter()
        return WeatherClient(rate_limiter)
    
    @pytest.fixture
    def mock_response_data(self):
        """Mock response data for weather APIs."""
        return {
            'current_condition': [{
                'temp_C': '22',
                'FeelsLikeC': '24',
                'humidity': '65',
                'weatherDesc': [{'value': 'Partly Cloudy'}],
                'windspeedKmph': '15',
                'winddir16Point': 'NW',
                'pressure': '1013',
                'visibility': '10',
                'uvIndex': '5'
            }]
        }
    
    @pytest.mark.asyncio
    async def test_get_current_weather_success(self, weather_client, mock_response_data):
        """Test successful weather data retrieval."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value=mock_response_data)
            mock_get.return_value.__aenter__.return_value = mock_response
            
            result = await weather_client.get_current_weather('London')
            
            assert result is not None
            assert result['city'] == 'London'
            assert result['temperature'] == '22'
            assert result['source'] == 'wttr.in (Real Data, Free)'
    
    @pytest.mark.asyncio
    async def test_get_current_weather_fallback(self, weather_client):
        """Test weather API fallback mechanism."""
        # Mock wttr.in failure
        with patch('aiohttp.ClientSession.get') as mock_get:
            # First call fails (wttr.in)
            mock_response_fail = AsyncMock()
            mock_response_fail.status = 500
            mock_get.return_value.__aenter__.return_value = mock_response_fail
            
            # Mock geocoding success
            with patch.object(weather_client, '_get_coordinates') as mock_coords:
                mock_coords.return_value = {'latitude': 51.5074, 'longitude': -0.1278}
                
                # Mock Open-Meteo success
                open_meteo_data = {
                    'current': {
                        'temperature_2m': 22.5,
                        'apparent_temperature': 24.0,
                        'relative_humidity_2m': 65,
                        'weather_code': 1,
                        'wind_speed_10m': 15.0,
                        'wind_direction_10m': 315,
                        'precipitation': 0.0,
                        'cloud_cover': 25
                    }
                }
                
                mock_response_success = AsyncMock()
                mock_response_success.status = 200
                mock_response_success.json = AsyncMock(return_value=open_meteo_data)
                mock_get.return_value.__aenter__.return_value = mock_response_success
                
                result = await weather_client.get_current_weather('London')
                
                assert result is not None
                assert result['source'] == 'Open-Meteo (Real Data, Free)'
    
    @pytest.mark.asyncio
    async def test_circuit_breaker_functionality(self, weather_client):
        """Test circuit breaker pattern for failed services."""
        # Simulate multiple failures
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 500
            mock_get.return_value.__aenter__.return_value = mock_response
            
            # First few calls should fail but circuit should remain closed
            for i in range(3):
                result = await weather_client.get_current_weather('London')
                assert result is None
            
            # Circuit should now be open
            assert weather_client.circuit_breaker['wttr']['state'] == 'open'
            
            # Next call should be blocked by circuit breaker
            result = await weather_client.get_current_weather('London')
            assert result is None
    
    @pytest.mark.asyncio
    async def test_get_weather_forecast(self, weather_client):
        """Test weather forecast functionality."""
        with patch.object(weather_client, '_get_coordinates') as mock_coords:
            mock_coords.return_value = {'latitude': 51.5074, 'longitude': -0.1278}
            
            with patch('aiohttp.ClientSession.get') as mock_get:
                forecast_data = {
                    'daily': {
                        'time': ['2024-01-20', '2024-01-21', '2024-01-22'],
                        'temperature_2m_max': [15.0, 16.0, 17.0],
                        'temperature_2m_min': [8.0, 9.0, 10.0],
                        'precipitation_sum': [0.0, 2.5, 0.0],
                        'weather_code': [1, 61, 2]
                    }
                }
                
                mock_response = AsyncMock()
                mock_response.status = 200
                mock_response.json = AsyncMock(return_value=forecast_data)
                mock_get.return_value.__aenter__.return_value = mock_response
                
                result = await weather_client.get_weather_forecast('London', 3)
                
                assert len(result) == 3
                assert result[0]['date'] == '2024-01-20'
                assert result[0]['max_temperature'] == 15.0
                assert result[0]['description'] == 'Mainly clear'
    
    def test_weather_description_mapping(self, weather_client):
        """Test weather code to description mapping."""
        assert weather_client._get_weather_description(0) == "Clear sky"
        assert weather_client._get_weather_description(1) == "Mainly clear"
        assert weather_client._get_weather_description(61) == "Slight rain"
        assert weather_client._get_weather_description(95) == "Thunderstorm"
        assert weather_client._get_weather_description(999) == "Unknown"
    
    @pytest.mark.asyncio
    async def test_rate_limiting(self, weather_client):
        """Test rate limiting functionality."""
        # Mock rate limiter to deny requests
        weather_client.rate_limiter.check_rate_limit = AsyncMock(return_value=False)
        
        result = await weather_client.get_current_weather('London')
        assert result is None
    
    @pytest.mark.asyncio
    async def test_invalid_city_handling(self, weather_client):
        """Test handling of invalid city names."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 404
            mock_get.return_value.__aenter__.return_value = mock_response
            
            result = await weather_client.get_current_weather('InvalidCity123')
            assert result is None
    
    @pytest.mark.asyncio
    async def test_network_timeout_handling(self, weather_client):
        """Test handling of network timeouts."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_get.side_effect = asyncio.TimeoutError()
            
            result = await weather_client.get_current_weather('London')
            assert result is None
    
    @pytest.mark.asyncio
    async def test_json_parsing_error_handling(self, weather_client):
        """Test handling of JSON parsing errors."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(side_effect=ValueError("Invalid JSON"))
            mock_get.return_value.__aenter__.return_value = mock_response
            
            result = await weather_client.get_current_weather('London')
            assert result is None
    
    def test_circuit_breaker_reset(self, weather_client):
        """Test circuit breaker reset functionality."""
        # Set circuit to open state
        weather_client.circuit_breaker['wttr']['state'] = 'open'
        weather_client.circuit_breaker['wttr']['failures'] = 3
        
        # Reset circuit
        weather_client._reset_circuit('wttr')
        
        assert weather_client.circuit_breaker['wttr']['state'] == 'closed'
        assert weather_client.circuit_breaker['wttr']['failures'] == 0
        assert weather_client.circuit_breaker['wttr']['last_failure'] is None
    
    @pytest.mark.asyncio
    async def test_concurrent_requests(self, weather_client):
        """Test handling of concurrent requests."""
        with patch('aiohttp.ClientSession.get') as mock_get:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.json = AsyncMock(return_value={'current_condition': [{'temp_C': '20'}]})
            mock_get.return_value.__aenter__.return_value = mock_response
            
            # Make multiple concurrent requests
            tasks = [
                weather_client.get_current_weather('London'),
                weather_client.get_current_weather('Paris'),
                weather_client.get_current_weather('Berlin')
            ]
            
            results = await asyncio.gather(*tasks)
            
            # All requests should succeed
            assert all(result is not None for result in results)
            assert len(results) == 3


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
