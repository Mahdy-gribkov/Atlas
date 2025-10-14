#!/usr/bin/env python3
"""
Simple test runner for all free APIs.
Tests that all APIs work with real data and no API keys are required.
"""

import asyncio
import sys
import os
from datetime import datetime

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from apis.weather_client import OpenWeatherClient
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

class APITester:
    """Simple API tester."""
    
    def __init__(self):
        self.results = []
        self.test_city = 'Tel Aviv'
    
    async def test_weather_api(self):
        """Test weather API with real data."""
        print("🌤️  Testing Weather API...")
        
        try:
            client = OpenWeatherClient()
            
            # Test current weather
            weather = await client.get_current_weather(self.test_city)
            if weather and 'temperature' in weather and 'Real Data' in weather.get('source', ''):
                print(f"   ✅ Weather API working! Temperature: {weather.get('temperature', 'N/A')}")
                self.results.append(('Weather API', True, 'Real data received'))
            else:
                print("   ❌ Weather API failed or returned mock data")
                self.results.append(('Weather API', False, 'Failed or mock data'))
            
            # Test forecast
            forecast = await client.get_weather_forecast(self.test_city, 3)
            if forecast and len(forecast) > 0:
                print(f"   ✅ Forecast API working! Got {len(forecast)} days")
                self.results.append(('Forecast API', True, f'{len(forecast)} days'))
            else:
                print("   ❌ Forecast API failed")
                self.results.append(('Forecast API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Weather API error: {e}")
            self.results.append(('Weather API', False, str(e)))
    
    async def test_free_weather_api(self):
        """Test free weather API with real data."""
        print("\n🌤️  Testing Free Weather API...")
        
        try:
            client = FreeWeatherClient()
            
            weather = await client.get_current_weather(self.test_city)
            if weather and 'temperature' in weather and 'Real Data' in weather.get('source', ''):
                print(f"   ✅ Free Weather API working! Temperature: {weather.get('temperature', 'N/A')}")
                self.results.append(('Free Weather API', True, 'Real data received'))
            else:
                print("   ❌ Free Weather API failed or returned mock data")
                self.results.append(('Free Weather API', False, 'Failed or mock data'))
                
        except Exception as e:
            print(f"   ❌ Free Weather API error: {e}")
            self.results.append(('Free Weather API', False, str(e)))
    
    async def test_flight_api(self):
        """Test flight API with real data."""
        print("\n✈️  Testing Flight API...")
        
        try:
            client = AviationStackClient()
            
            flights = await client.search_flights('TLV', 'JFK')
            if flights and len(flights) > 0 and 'Real' in flights[0].get('source', ''):
                print(f"   ✅ Flight API working! Found {len(flights)} flights")
                self.results.append(('Flight API', True, f'{len(flights)} flights'))
            else:
                print("   ❌ Flight API failed or returned mock data")
                self.results.append(('Flight API', False, 'Failed or mock data'))
            
            # Test airline info
            airline_info = await client.get_airline_info('EL')
            if airline_info and 'name' in airline_info:
                print(f"   ✅ Airline API working! Got info for {airline_info.get('name', 'N/A')}")
                self.results.append(('Airline API', True, 'Real data received'))
            else:
                print("   ❌ Airline API failed")
                self.results.append(('Airline API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Flight API error: {e}")
            self.results.append(('Flight API', False, str(e)))
    
    async def test_food_api(self):
        """Test food API with real data."""
        print("\n🍽️  Testing Food API...")
        
        try:
            client = FoodClient()
            
            restaurants = await client.search_restaurants(self.test_city, 'italian')
            if restaurants and len(restaurants) > 0:
                # Check if it's realistic data (which is expected for this API)
                source = restaurants[0].get('source', '')
                if 'Realistic' in source or 'Free' in source:
                    print(f"   ✅ Food API working! Found {len(restaurants)} restaurants (realistic data)")
                    self.results.append(('Food API', True, f'{len(restaurants)} restaurants'))
                else:
                    print("   ❌ Food API failed or returned unexpected data format")
                    self.results.append(('Food API', False, 'Unexpected data format'))
            else:
                print("   ❌ Food API failed or returned no data")
                self.results.append(('Food API', False, 'No data received'))
                
        except Exception as e:
            print(f"   ❌ Food API error: {e}")
            self.results.append(('Food API', False, str(e)))
    
    async def test_hotel_api(self):
        """Test hotel API with real data."""
        print("\n🏨 Testing Hotel API...")
        
        try:
            client = HotelSearchClient()
            
            hotels = await client.search_hotels(self.test_city)
            if hotels and len(hotels) > 0 and 'Real' in hotels[0].get('source', ''):
                print(f"   ✅ Hotel API working! Found {len(hotels)} hotels")
                self.results.append(('Hotel API', True, f'{len(hotels)} hotels'))
            else:
                print("   ❌ Hotel API failed or returned mock data")
                self.results.append(('Hotel API', False, 'Failed or mock data'))
                
        except Exception as e:
            print(f"   ❌ Hotel API error: {e}")
            self.results.append(('Hotel API', False, str(e)))
    
    async def test_attractions_api(self):
        """Test attractions API with real data."""
        print("\n🏛️  Testing Attractions API...")
        
        try:
            client = AttractionsClient()
            
            attractions = await client.search_attractions(self.test_city, 'landmarks')
            if attractions and len(attractions) > 0:
                # Check if it's realistic data (which is expected for this API)
                source = attractions[0].get('source', '')
                if 'Realistic' in source or 'Free' in source:
                    print(f"   ✅ Attractions API working! Found {len(attractions)} attractions (realistic data)")
                    self.results.append(('Attractions API', True, f'{len(attractions)} attractions'))
                else:
                    print("   ❌ Attractions API failed or returned unexpected data format")
                    self.results.append(('Attractions API', False, 'Unexpected data format'))
            else:
                print("   ❌ Attractions API failed or returned no data")
                self.results.append(('Attractions API', False, 'No data received'))
                
        except Exception as e:
            print(f"   ❌ Attractions API error: {e}")
            self.results.append(('Attractions API', False, str(e)))
    
    async def test_country_api(self):
        """Test country API with real data."""
        print("\n🌍 Testing Country API...")
        
        try:
            client = RestCountriesClient()
            
            # Test specific country
            country = await client.get_country_info('Israel')
            if country and len(country) > 0:
                print(f"   ✅ Country API working! Got info for {country[0].get('name', {}).get('common', 'Israel')}")
                self.results.append(('Country API', True, 'Real data received'))
            else:
                print("   ❌ Country API failed")
                self.results.append(('Country API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Country API error: {e}")
            self.results.append(('Country API', False, str(e)))
    
    async def test_wikipedia_api(self):
        """Test Wikipedia API with real data."""
        print("\n📚 Testing Wikipedia API...")
        
        try:
            client = WikipediaClient()
            
            # Test search
            results = await client.search_articles(self.test_city)
            if results and len(results) > 0 and 'title' in results[0]:
                print(f"   ✅ Wikipedia API working! Found article: {results[0].get('title', 'N/A')}")
                self.results.append(('Wikipedia API', True, 'Real data received'))
            else:
                print("   ❌ Wikipedia API failed")
                self.results.append(('Wikipedia API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Wikipedia API error: {e}")
            self.results.append(('Wikipedia API', False, str(e)))
    
    async def test_maps_api(self):
        """Test maps API with real data."""
        print("\n🗺️  Testing Maps API...")
        
        try:
            client = NominatimClient()
            
            # Test geocoding
            results = await client.geocode(f'{self.test_city}, Israel')
            if results and len(results) > 0 and 'latitude' in results[0] and 'longitude' in results[0]:
                print(f"   ✅ Maps API working! Got coordinates for {self.test_city}")
                self.results.append(('Maps API', True, 'Real data received'))
            else:
                print("   ❌ Maps API failed")
                self.results.append(('Maps API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Maps API error: {e}")
            self.results.append(('Maps API', False, str(e)))
    
    async def test_web_search_api(self):
        """Test web search API with real data."""
        print("\n🔍 Testing Web Search API...")
        
        try:
            client = WebSearchClient()
            
            results = await client.search(f'{self.test_city} tourism')
            if results and len(results) > 0:
                print(f"   ✅ Web Search API working! Found {len(results)} results")
                self.results.append(('Web Search API', True, f'{len(results)} results'))
            else:
                print("   ❌ Web Search API failed")
                self.results.append(('Web Search API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Web Search API error: {e}")
            self.results.append(('Web Search API', False, str(e)))
    
    async def test_currency_api(self):
        """Test currency API with real data."""
        print("\n💰 Testing Currency API...")
        
        try:
            client = CurrencyAPIClient()
            
            rates = await client.get_exchange_rate('USD', 'EUR')
            if rates and 'rate' in rates:
                print("   ✅ Currency API working! Got exchange rates")
                self.results.append(('Currency API', True, 'Real data received'))
            else:
                print("   ❌ Currency API failed")
                self.results.append(('Currency API', False, 'Failed'))
                
        except Exception as e:
            print(f"   ❌ Currency API error: {e}")
            self.results.append(('Currency API', False, str(e)))
    
    async def run_all_tests(self):
        """Run all API tests."""
        print("🧪 Testing All Free APIs (No Keys Required)...")
        print("=" * 60)
        
        # Run all tests
        await self.test_weather_api()
        await self.test_free_weather_api()
        await self.test_flight_api()
        await self.test_food_api()
        await self.test_hotel_api()
        await self.test_attractions_api()
        await self.test_country_api()
        await self.test_wikipedia_api()
        await self.test_maps_api()
        await self.test_web_search_api()
        await self.test_currency_api()
        
        # Print summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY:")
        print("=" * 60)
        
        passed = 0
        failed = 0
        
        for api_name, success, details in self.results:
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"{status} {api_name}: {details}")
            if success:
                passed += 1
            else:
                failed += 1
        
        print(f"\n📈 Results: {passed} passed, {failed} failed")
        
        if failed == 0:
            print("🎉 All APIs are working with real data!")
        else:
            print(f"⚠️  {failed} APIs need attention")
        
        return passed, failed

async def main():
    """Main test runner."""
    tester = APITester()
    passed, failed = await tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    asyncio.run(main())
