#!/usr/bin/env python3
"""
Test script for all free APIs in the Travel AI Agent.
This script tests all API clients to ensure they work with free services only.
"""

import asyncio
import sys
import os
from datetime import datetime

# Add src to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from apis.flight_client import AviationStackClient
from apis.free_weather_client import FreeWeatherClient
from apis.food_client import FoodClient
from apis.hotel_search_client import HotelSearchClient
from apis.attractions_client import AttractionsClient
from apis.country_client import RestCountriesClient
from apis.wikipedia_client import WikipediaClient
from apis.maps_client import NominatimClient
from apis.web_search_client import WebSearchClient
from apis.currency_api_client import CurrencyAPIClient

async def test_api(client, test_name, test_func):
    """Test a single API client."""
    try:
        print(f"Testing {test_name}...")
        result = await test_func()
        if result:
            print(f"✅ {test_name}: PASSED")
            return True
        else:
            print(f"❌ {test_name}: FAILED - No data returned")
            return False
    except Exception as e:
        print(f"❌ {test_name}: FAILED - {str(e)}")
        return False

async def main():
    """Test all API clients."""
    print("🧪 Testing Travel AI Agent APIs")
    print("=" * 50)
    
    # Initialize clients
    flight_client = AviationStackClient()
    free_weather_client = FreeWeatherClient()
    food_client = FoodClient()
    hotel_client = HotelSearchClient()
    attractions_client = AttractionsClient()
    country_client = RestCountriesClient()
    wikipedia_client = WikipediaClient()
    maps_client = NominatimClient()
    web_search_client = WebSearchClient()
    currency_client = CurrencyAPIClient()
    
    # Test results
    results = []
    
    # Test weather APIs
    
    results.append(await test_api(
        free_weather_client, 
        "Free Weather (Open-Meteo)", 
        lambda: free_weather_client.get_current_weather("Paris")
    ))
    
    # Test flight API
    results.append(await test_api(
        flight_client, 
        "Flight Search (OpenSky)", 
        lambda: flight_client.search_flights("LHR", "CDG", "2024-01-15")
    ))
    
    # Test food API
    results.append(await test_api(
        food_client, 
        "Food Search (Zomato)", 
        lambda: food_client.search_restaurants("London", "Italian")
    ))
    
    # Test hotel API
    results.append(await test_api(
        hotel_client, 
        "Hotel Search (Booking.com)", 
        lambda: hotel_client.search_hotels("London", "2024-01-15", "2024-01-17", 2)
    ))
    
    # Test attractions API
    results.append(await test_api(
        attractions_client, 
        "Attractions (Foursquare)", 
        lambda: attractions_client.search_attractions("London", "tourist")
    ))
    
    # Test country API
    results.append(await test_api(
        country_client, 
        "Country Info (REST Countries)", 
        lambda: country_client.get_country_info("United States")
    ))
    
    # Test Wikipedia API
    results.append(await test_api(
        wikipedia_client, 
        "Wikipedia Search", 
        lambda: wikipedia_client.search("London")
    ))
    
    # Test maps API
    results.append(await test_api(
        maps_client, 
        "Maps (Nominatim)", 
        lambda: maps_client.geocode("London, UK")
    ))
    
    # Test web search API
    results.append(await test_api(
        web_search_client, 
        "Web Search (DuckDuckGo)", 
        lambda: web_search_client.search("travel to London")
    ))
    
    # Test currency API
    results.append(await test_api(
        currency_client, 
        "Currency Exchange (exchangerate-api)", 
        lambda: currency_client.get_exchange_rate("USD", "EUR")
    ))
    
    # Summary
    print("\n" + "=" * 50)
    passed = sum(results)
    total = len(results)
    print(f"📊 Test Results: {passed}/{total} APIs passed")
    
    if passed == total:
        print("🎉 All APIs are working correctly!")
        return 0
    else:
        print(f"⚠️  {total - passed} APIs need attention")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)
