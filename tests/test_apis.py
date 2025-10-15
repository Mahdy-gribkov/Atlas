#!/usr/bin/env python3
"""
Comprehensive test suite for all free APIs.
Tests that all APIs work with real data and no API keys are required.
"""

import asyncio
import sys
import os
import pytest
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from src.apis.flight_client import AviationStackClient
from src.apis.free_weather_client import FreeWeatherClient
from src.apis.food_client import FoodClient
from src.apis.hotel_search_client import HotelSearchClient
from src.apis.attractions_client import AttractionsClient
from src.apis.country_client import RestCountriesClient
from src.apis.wikipedia_client import WikipediaClient
from src.apis.maps_client import NominatimClient
from src.apis.web_search_client import WebSearchClient
from src.apis.currency_api_client import CurrencyAPIClient

class TestFreeAPIs:
    """Test suite for all free APIs."""
    
    @pytest.mark.asyncio
    async def test_weather_api(self):
        """Test weather API with real data."""
        client = FreeWeatherClient()
        
        # Test current weather
        weather = await client.get_current_weather('Tel Aviv')
        assert weather is not None, "Weather API should return data"
        assert 'temperature' in weather, "Weather data should include temperature"
        assert 'source' in weather, "Weather data should include source"
        assert 'Real Data' in weather['source'], "Should use real data, not mock"
        
        # Test forecast
        forecast = await client.get_weather_forecast('Tel Aviv', 3)
        assert len(forecast) > 0, "Forecast should return data"
        assert 'date' in forecast[0], "Forecast should include date"
    
    @pytest.mark.asyncio
    async def test_free_weather_api(self):
        """Test free weather API with real data."""
        client = FreeWeatherClient()
        
        weather = await client.get_current_weather('Tel Aviv')
        assert weather is not None, "Free Weather API should return data"
        assert 'temperature' in weather, "Weather data should include temperature"
        assert 'Real Data' in weather['source'], "Should use real data, not mock"
    
    @pytest.mark.asyncio
    async def test_flight_api(self):
        """Test flight API with real data."""
        client = AviationStackClient()
        
        flights = await client.search_flights('TLV', 'JFK')
        assert len(flights) > 0, "Flight API should return flights"
        assert 'airline' in flights[0], "Flight data should include airline"
        assert 'price' in flights[0], "Flight data should include price"
        assert 'Real' in flights[0]['source'], "Should use real data, not mock"
        
        # Test airline info
        airline_info = await client.get_airline_info('EL')
        assert airline_info is not None, "Airline info should be available"
        assert 'name' in airline_info, "Airline info should include name"
    
    @pytest.mark.asyncio
    async def test_food_api(self):
        """Test food API with real data."""
        client = FoodClient()
        
        restaurants = await client.get_restaurants('Tel Aviv', 'italian')
        assert len(restaurants) > 0, "Food API should return restaurants"
        assert 'name' in restaurants[0], "Restaurant data should include name"
        assert 'Real' in restaurants[0]['source'], "Should use real data, not mock"
        
        # Test food recommendations
        foods = await client.get_food_recommendations('Tel Aviv', 'italian')
        assert len(foods) >= 0, "Food recommendations should work"
    
    @pytest.mark.asyncio
    async def test_hotel_api(self):
        """Test hotel API with real data."""
        client = HotelSearchClient()
        
        hotels = await client.search_hotels('Tel Aviv', budget=100)
        assert len(hotels) > 0, "Hotel API should return hotels"
        assert 'name' in hotels[0], "Hotel data should include name"
        assert 'price' in hotels[0], "Hotel data should include price"
        assert 'Real' in hotels[0]['source'], "Should use real data, not mock"
    
    @pytest.mark.asyncio
    async def test_attractions_api(self):
        """Test attractions API with real data."""
        client = AttractionsClient()
        
        attractions = await client.get_attractions('Tel Aviv', 'landmarks')
        assert len(attractions) > 0, "Attractions API should return attractions"
        assert 'name' in attractions[0], "Attraction data should include name"
        assert 'Real' in attractions[0]['source'], "Should use real data, not mock"
    
    @pytest.mark.asyncio
    async def test_country_api(self):
        """Test country API with real data."""
        client = RestCountriesClient()
        
        countries = await client.get_countries()
        assert len(countries) > 0, "Country API should return countries"
        assert 'name' in countries[0], "Country data should include name"
        
        # Test specific country
        israel = await client.get_country('Israel')
        assert israel is not None, "Should be able to get specific country"
        assert 'name' in israel, "Country data should include name"
    
    @pytest.mark.asyncio
    async def test_wikipedia_api(self):
        """Test Wikipedia API with real data."""
        client = WikipediaClient()
        
        articles = await client.search_articles('Tel Aviv')
        assert len(articles) > 0, "Wikipedia API should return articles"
        assert 'title' in articles[0], "Article data should include title"
        
        # Test article content
        content = await client.get_article_content('Tel Aviv')
        assert content is not None, "Should be able to get article content"
    
    @pytest.mark.asyncio
    async def test_maps_api(self):
        """Test maps API with real data."""
        client = NominatimClient()
        
        results = await client.search_location('Tel Aviv')
        assert len(results) > 0, "Maps API should return results"
        assert 'display_name' in results[0], "Location data should include display name"
        
        # Test geocoding
        coords = await client.geocode('Tel Aviv, Israel')
        assert coords is not None, "Should be able to geocode location"
        assert 'lat' in coords, "Coordinates should include latitude"
        assert 'lon' in coords, "Coordinates should include longitude"
    
    @pytest.mark.asyncio
    async def test_web_search_api(self):
        """Test web search API with real data."""
        client = WebSearchClient()
        
        results = await client.search('Tel Aviv tourism')
        assert len(results) > 0, "Web search API should return results"
        assert 'title' in results[0], "Search result should include title"
        assert 'url' in results[0], "Search result should include URL"
    
    @pytest.mark.asyncio
    async def test_currency_api(self):
        """Test currency API with real data."""
        client = CurrencyAPIClient()
        
        rates = await client.get_exchange_rates('USD')
        assert rates is not None, "Currency API should return rates"
        assert 'rates' in rates, "Currency data should include rates"
        
        # Test conversion
        conversion = await client.convert_currency(100, 'USD', 'EUR')
        assert conversion is not None, "Should be able to convert currency"
        assert 'result' in conversion, "Conversion should include result"

class TestAPIIntegration:
    """Test API integration and error handling."""
    
    @pytest.mark.asyncio
    async def test_api_error_handling(self):
        """Test that APIs handle errors gracefully."""
        client = FreeWeatherClient()
        
        # Test with invalid city
        weather = await client.get_current_weather('InvalidCity12345')
        # Should not crash, may return None or fallback data
        assert weather is None or isinstance(weather, dict)
    
    @pytest.mark.asyncio
    async def test_api_rate_limiting(self):
        """Test that APIs respect rate limiting."""
        client = FreeWeatherClient()
        
        # Make multiple requests quickly
        tasks = []
        for i in range(5):
            tasks.append(client.get_current_weather('Tel Aviv'))
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Should not all fail due to rate limiting
        successful_results = [r for r in results if isinstance(r, dict)]
        assert len(successful_results) > 0, "Some requests should succeed"
    
    @pytest.mark.asyncio
    async def test_api_data_consistency(self):
        """Test that APIs return consistent data formats."""
        client = FreeWeatherClient()
        
        weather = await client.get_current_weather('Tel Aviv')
        if weather:
            # Check required fields
            required_fields = ['city', 'temperature', 'source', 'timestamp']
            for field in required_fields:
                assert field in weather, f"Weather data should include {field}"
            
            # Check data types
            assert isinstance(weather['city'], str), "City should be string"
            assert isinstance(weather['temperature'], (str, int, float)), "Temperature should be numeric or string"
            assert isinstance(weather['source'], str), "Source should be string"

def run_tests():
    """Run all tests."""
    print("🧪 Running comprehensive API tests...")
    print("=" * 60)
    
    # Run pytest
    pytest.main([__file__, "-v", "--tb=short"])
    
    print("\n" + "=" * 60)
    print("✅ API testing completed!")

if __name__ == "__main__":
    run_tests()
