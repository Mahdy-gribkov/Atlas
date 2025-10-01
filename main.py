#!/usr/bin/env python3
"""
Travel AI Agent - Main Application
Privacy-first travel planning with free APIs only.

Usage:
    python main.py                    # Interactive chat mode
    python main.py --help             # Show help
    python main.py --plan-trip        # Trip planning mode
    python main.py --test-apis        # Test API connections
"""

import asyncio
import argparse
import sys
import os
from typing import Dict, Any

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.config import config
from src.database import SecureDatabase
from src.agent import TravelAgent

class TravelAgentApp:
    """Main application class for the Travel AI Agent."""
    
    def __init__(self):
        self.agent = None
        self.database = None
    
    def initialize(self):
        """Initialize the application."""
        try:
            print("🌍 Initializing Travel AI Agent...")
            
            # Create necessary directories
            config.create_directories()
            
            # Validate configuration
            validation = config.validate_config()
            print(f"Configuration validation: {validation}")
            
            # Initialize database
            self.database = SecureDatabase()
            print("✅ Database initialized")
            
            # Initialize agent
            self.agent = TravelAgent(database=self.database)
            print("✅ Travel agent initialized")
            
            # Show available features
            features = self.agent.get_available_features()
            print(f"Available features: {', '.join(features)}")
            
            return True
            
        except Exception as e:
            print(f"❌ Initialization failed: {e}")
            return False
    
    async def interactive_chat(self):
        """Run interactive chat mode."""
        print("\n" + "="*60)
        print("🌍 Travel AI Agent - Interactive Chat Mode")
        print("="*60)
        print("Type 'help' for available commands, 'quit' to exit")
        print("All your data stays on your device - complete privacy!")
        print("-"*60)
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if not user_input:
                    continue
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Goodbye! Happy travels!")
                    break
                
                if user_input.lower() == 'help':
                    self.show_help()
                    continue
                
                if user_input.lower() == 'features':
                    self.show_features()
                    continue
                
                if user_input.lower() == 'privacy':
                    print(self.agent.get_privacy_info())
                    continue
                
                if user_input.lower() == 'stats':
                    self.show_stats()
                    continue
                
                if user_input.lower() == 'cleanup':
                    deleted = self.agent.cleanup_data()
                    print(f"🧹 Cleaned up {deleted} expired records")
                    continue
                
                # Process the message
                print("🤖 Agent: ", end="", flush=True)
                response = await self.agent.chat(user_input)
                print(response)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye! Happy travels!")
                break
            except Exception as e:
                print(f"❌ Error: {e}")
    
    async def plan_trip_mode(self):
        """Run trip planning mode."""
        print("\n" + "="*60)
        print("🌍 Travel AI Agent - Trip Planning Mode")
        print("="*60)
        
        try:
            # Get trip details from user
            destination = input("Destination (city or country): ").strip()
            if not destination:
                print("❌ Destination is required")
                return
            
            start_date = input("Start date (YYYY-MM-DD, optional): ").strip()
            end_date = input("End date (YYYY-MM-DD, optional): ").strip()
            
            travelers_input = input("Number of travelers (default 1): ").strip()
            travelers = int(travelers_input) if travelers_input.isdigit() else 1
            
            budget_input = input("Budget amount (optional): ").strip()
            budget = float(budget_input) if budget_input else None
            
            currency = input("Currency (default USD): ").strip() or "USD"
            
            print(f"\n🔄 Planning trip to {destination}...")
            
            # Plan the trip
            trip_plan = await self.agent.plan_trip(
                destination=destination,
                start_date=start_date if start_date else None,
                end_date=end_date if end_date else None,
                travelers=travelers,
                budget=budget,
                currency=currency
            )
            
            # Display results
            print("\n" + "="*60)
            print("📋 TRIP PLAN")
            print("="*60)
            print(json.dumps(trip_plan, indent=2, default=str))
            
        except Exception as e:
            print(f"❌ Trip planning failed: {e}")
    
    async def test_apis(self):
        """Test API connections."""
        print("\n" + "="*60)
        print("🌍 Travel AI Agent - API Testing")
        print("="*60)
        
        # Test weather API
        if self.agent.tools.weather_client:
            print("🌤️ Testing weather API...")
            try:
                weather = await self.agent.tools.weather_client.get_current_weather("London")
                print(f"✅ Weather API working: {weather['city']} - {weather['temperature']}°C")
            except Exception as e:
                print(f"❌ Weather API error: {e}")
        else:
            print("❌ Weather API not configured")
        
        # Test currency API
        if self.agent.tools.currency_client:
            print("💱 Testing currency API...")
            try:
                conversion = await self.agent.tools.currency_client.convert_currency(100, "USD", "EUR")
                print(f"✅ Currency API working: {conversion['converted_amount']:.2f} EUR")
            except Exception as e:
                print(f"❌ Currency API error: {e}")
        else:
            print("❌ Currency API not configured")
        
        # Test country API
        if self.agent.tools.country_client:
            print("🌍 Testing country API...")
            try:
                country = await self.agent.tools.country_client.get_country_info("France")
                print(f"✅ Country API working: {country.get('name', {}).get('common', 'Unknown')}")
            except Exception as e:
                print(f"❌ Country API error: {e}")
        else:
            print("❌ Country API not configured")
        
        # Test Wikipedia API
        if self.agent.tools.wikipedia_client:
            print("📚 Testing Wikipedia API...")
            try:
                wiki = await self.agent.tools.wikipedia_client.get_city_info("Paris")
                print(f"✅ Wikipedia API working: {wiki.get('title', 'Unknown')}")
            except Exception as e:
                print(f"❌ Wikipedia API error: {e}")
        else:
            print("❌ Wikipedia API not configured")
        
        print("\n" + "="*60)
        print("API Testing Complete")
        print("="*60)
    
    def show_help(self):
        """Show help information."""
        print("\n" + "="*60)
        print("📖 HELP - Available Commands")
        print("="*60)
        print("help          - Show this help message")
        print("features      - Show available features")
        print("privacy       - Show privacy information")
        print("stats         - Show database statistics")
        print("cleanup       - Clean up expired data")
        print("quit/exit     - Exit the application")
        print("\n📝 Example Questions:")
        print("• What's the weather like in Paris?")
        print("• Convert 1000 USD to EUR")
        print("• Tell me about Japan")
        print("• Plan a trip to London")
        print("• What's the flight status for AA123?")
        print("="*60)
    
    def show_features(self):
        """Show available features."""
        features = self.agent.get_available_features()
        print(f"\n🔧 Available Features: {', '.join(features)}")
        
        if "weather" in features:
            print("🌤️ Weather: Current weather and forecasts")
        if "currency" in features:
            print("💱 Currency: Exchange rates and conversions")
        if "flights" in features:
            print("✈️ Flights: Flight information and status")
        if "countries" in features:
            print("🌍 Countries: Country information and details")
        if "wikipedia" in features:
            print("📚 Wikipedia: General information and facts")
        if "geocoding" in features:
            print("🗺️ Geocoding: Address and location information")
    
    def show_stats(self):
        """Show database statistics."""
        stats = self.agent.get_database_stats()
        print("\n📊 Database Statistics:")
        for key, value in stats.items():
            print(f"  {key}: {value}")

def main():
    """Main application entry point."""
    parser = argparse.ArgumentParser(description="Travel AI Agent - Privacy-first travel planning")
    parser.add_argument("--plan-trip", action="store_true", help="Run in trip planning mode")
    parser.add_argument("--test-apis", action="store_true", help="Test API connections")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive chat mode (default)")
    
    args = parser.parse_args()
    
    # Create application
    app = TravelAgentApp()
    
    # Initialize
    if not app.initialize():
        sys.exit(1)
    
    try:
        # Run appropriate mode
        if args.plan_trip:
            asyncio.run(app.plan_trip_mode())
        elif args.test_apis:
            asyncio.run(app.test_apis())
        else:
            # Default to interactive mode
            asyncio.run(app.interactive_chat())
    
    except KeyboardInterrupt:
        print("\n👋 Goodbye! Happy travels!")
    except Exception as e:
        print(f"❌ Application error: {e}")
    finally:
        # Cleanup
        if app.agent:
            app.agent.close()

if __name__ == "__main__":
    main()
