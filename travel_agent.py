#!/usr/bin/env python3
"""
🌍 Travel AI Agent - Privacy-First Travel Planning Assistant

A comprehensive travel planning agent that runs entirely locally using:
- Local LLM (Llama 3.1 8B) for natural language processing
- Free APIs for real-time travel information
- Encrypted local storage for privacy
- Web search capabilities for current information

Author: Travel AI Agent Team
License: MIT
"""

import sys
import os
import asyncio
import json
import re
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import logging

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src.config import config
from src.database.secure_database import SecureDatabase
from src.apis import RestCountriesClient, WikipediaClient, NominatimClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('data/travel_agent.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class WebSearchClient:
    """Web search client for real-time information."""
    
    def __init__(self):
        self.session = None
    
    async def search(self, query: str, num_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search the web for real-time information.
        
        Args:
            query: Search query
            num_results: Number of results to return
            
        Returns:
            List of search results with title, url, and snippet
        """
        try:
            import aiohttp
            
            # Use DuckDuckGo instant answer API (free, no API key required)
            url = "https://api.duckduckgo.com/"
            params = {
                'q': query,
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        results = []
                        
                        # Extract instant answer
                        if data.get('Abstract'):
                            results.append({
                                'title': data.get('Heading', 'Instant Answer'),
                                'url': data.get('AbstractURL', ''),
                                'snippet': data.get('Abstract', ''),
                                'source': 'DuckDuckGo Instant Answer'
                            })
                        
                        # Extract related topics
                        for topic in data.get('RelatedTopics', [])[:num_results-1]:
                            if isinstance(topic, dict) and 'Text' in topic:
                                results.append({
                                    'title': topic.get('Text', '').split(' - ')[0],
                                    'url': topic.get('FirstURL', ''),
                                    'snippet': topic.get('Text', ''),
                                    'source': 'DuckDuckGo Related Topics'
                                })
                        
                        return results[:num_results]
                    
        except Exception as e:
            logger.error(f"Web search error: {e}")
        
        return []

class TravelAgent:
    """
    Advanced Travel AI Agent with comprehensive travel planning capabilities.
    
    Features:
    - Local LLM integration (Llama 3.1 8B)
    - Real-time web search
    - Country information lookup
    - Wikipedia integration
    - Geocoding services
    - Travel planning and budgeting
    - Encrypted local storage
    """
    
    def __init__(self):
        """Initialize the travel agent with all components."""
        self.database = SecureDatabase()
        self.country_client = RestCountriesClient()
        self.wikipedia_client = WikipediaClient()
        self.maps_client = NominatimClient()
        self.web_search = WebSearchClient()
        
        # Conversation memory
        self.conversation_history = []
        self.user_preferences = {}
        
        # Initialize LLM
        if config.USE_LOCAL_LLM:
            self._init_local_llm()
        else:
            self._init_openai_llm()
        
        logger.info("Travel agent initialized successfully")
    
    def _init_local_llm(self):
        """Initialize local LLM using Ollama."""
        try:
            import ollama
            self.llm_type = "local"
            self.model_name = config.OLLAMA_MODEL
            logger.info(f"Local LLM ({self.model_name}) initialized")
        except Exception as e:
            logger.error(f"Local LLM initialization failed: {e}")
            raise
    
    def _init_openai_llm(self):
        """Initialize OpenAI LLM (fallback)."""
        try:
            import openai
            self.llm_type = "openai"
            openai.api_key = config.OPENAI_API_KEY
            logger.info("OpenAI LLM initialized")
        except Exception as e:
            logger.error(f"OpenAI LLM initialization failed: {e}")
            raise
    
    def _call_llm(self, prompt: str, context: str = "") -> str:
        """
        Call the LLM with enhanced prompting.
        
        Args:
            prompt: Main prompt for the LLM
            context: Additional context information
            
        Returns:
            LLM response
        """
        try:
            # Build enhanced prompt with context
            enhanced_prompt = f"""
            You are an expert travel planning assistant with access to real-time information.
            
            Context: {context}
            
            User Request: {prompt}
            
            Please provide helpful, accurate, and detailed travel advice. Include:
            - Specific recommendations when possible
            - Budget considerations
            - Practical tips and warnings
            - Current information when relevant
            
            Be conversational, helpful, and thorough in your response.
            """
            
            if self.llm_type == "local":
                import ollama
                response = ollama.generate(
                    model=self.model_name,
                    prompt=enhanced_prompt,
                    options={
                        'temperature': 0.7,
                        'top_p': 0.9,
                        'num_predict': 1000
                    }
                )
                return response['response']
            
            elif self.llm_type == "openai":
                import openai
                response = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": enhanced_prompt}],
                    temperature=0.7
                )
                return response.choices[0].message.content
            
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            return f"I apologize, but I'm having trouble processing your request right now. Error: {str(e)}"
    
    async def get_country_info(self, country_name: str) -> Dict[str, Any]:
        """Get comprehensive country information."""
        try:
            return await self.country_client.get_country_info(country_name)
        except Exception as e:
            logger.error(f"Country info error: {e}")
            return {"error": str(e)}
    
    async def search_wikipedia(self, query: str) -> Dict[str, Any]:
        """Search Wikipedia for detailed information."""
        try:
            return await self.wikipedia_client.search(query)
        except Exception as e:
            logger.error(f"Wikipedia search error: {e}")
            return {"error": str(e)}
    
    async def geocode_location(self, location: str) -> Dict[str, Any]:
        """Get precise location coordinates."""
        try:
            return await self.maps_client.geocode(location)
        except Exception as e:
            logger.error(f"Geocoding error: {e}")
            return {"error": str(e)}
    
    async def search_web(self, query: str) -> List[Dict[str, Any]]:
        """Search the web for real-time information."""
        try:
            return await self.web_search.search(query)
        except Exception as e:
            logger.error(f"Web search error: {e}")
            return []
    
    def extract_travel_info(self, query: str) -> Dict[str, Any]:
        """
        Extract travel planning information from user query.
        
        Args:
            query: User's travel query
            
        Returns:
            Dictionary with extracted information
        """
        query_lower = query.lower()
        
        # Extract destination
        destinations = ['peru', 'japan', 'france', 'italy', 'spain', 'germany', 'thailand', 'vietnam', 'india', 'brazil', 'argentina', 'chile', 'mexico', 'canada', 'australia', 'new zealand', 'south korea', 'china', 'russia', 'uk', 'ireland', 'portugal', 'greece', 'turkey', 'egypt', 'morocco', 'south africa', 'kenya', 'tanzania', 'madagascar', 'mauritius', 'seychelles']
        destination = None
        for dest in destinations:
            if dest in query_lower:
                destination = dest.title()
                break
        
        # Extract budget
        budget_match = re.search(r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)', query)
        budget = float(budget_match.group(1).replace(',', '')) if budget_match else None
        
        # Extract duration
        duration_patterns = [
            r'(\d+)\s*days?',
            r'(\d+)\s*weeks?',
            r'(\d+)\s*months?'
        ]
        duration = None
        for pattern in duration_patterns:
            match = re.search(pattern, query_lower)
            if match:
                duration = match.group(1)
                break
        
        # Extract dates
        date_patterns = [
            r'january\s+(\d+)',
            r'february\s+(\d+)',
            r'march\s+(\d+)',
            r'april\s+(\d+)',
            r'may\s+(\d+)',
            r'june\s+(\d+)',
            r'july\s+(\d+)',
            r'august\s+(\d+)',
            r'september\s+(\d+)',
            r'october\s+(\d+)',
            r'november\s+(\d+)',
            r'december\s+(\d+)'
        ]
        travel_date = None
        for pattern in date_patterns:
            match = re.search(pattern, query_lower)
            if match:
                travel_date = match.group(0)
                break
        
        # Extract number of travelers
        travelers_match = re.search(r'(\d+)\s*(?:people|travelers?|guests?)', query_lower)
        travelers = int(travelers_match.group(1)) if travelers_match else 1
        
        return {
            'destination': destination,
            'budget': budget,
            'duration': duration,
            'date': travel_date,
            'travelers': travelers,
            'query_type': self._classify_query_type(query_lower)
        }
    
    def _classify_query_type(self, query: str) -> str:
        """Classify the type of travel query."""
        if any(word in query for word in ['flight', 'airline', 'book', 'ticket']):
            return 'flights'
        elif any(word in query for word in ['hotel', 'accommodation', 'stay', 'room']):
            return 'accommodation'
        elif any(word in query for word in ['budget', 'cost', 'price', 'expensive', 'cheap']):
            return 'budget'
        elif any(word in query for word in ['weather', 'climate', 'temperature']):
            return 'weather'
        elif any(word in query for word in ['attraction', 'sightseeing', 'tour', 'visit']):
            return 'attractions'
        elif any(word in query for word in ['food', 'restaurant', 'cuisine', 'eat']):
            return 'food'
        elif any(word in query for word in ['transport', 'bus', 'train', 'metro', 'taxi']):
            return 'transportation'
        else:
            return 'general'
    
    async def process_query(self, query: str) -> str:
        """
        Process a travel query with comprehensive analysis.
        
        Args:
            query: User's travel query
            
        Returns:
            Comprehensive travel response
        """
        logger.info(f"Processing query: {query[:100]}...")
        
        # Store in conversation history
        self.conversation_history.append({
            'timestamp': datetime.now().isoformat(),
            'user': query,
            'type': 'user'
        })
        
        # Extract travel information
        travel_info = self.extract_travel_info(query)
        query_lower = query.lower()
        
        response_parts = []
        context_parts = []
        
        # Handle different types of queries
        if travel_info['query_type'] == 'weather':
            await self._handle_weather_query(query, response_parts, context_parts)
        elif travel_info['query_type'] == 'flights':
            await self._handle_flight_query(query, travel_info, response_parts, context_parts)
        elif travel_info['query_type'] == 'accommodation':
            await self._handle_accommodation_query(query, travel_info, response_parts, context_parts)
        elif travel_info['query_type'] == 'budget':
            await self._handle_budget_query(query, travel_info, response_parts, context_parts)
        elif travel_info['destination']:
            await self._handle_destination_query(query, travel_info, response_parts, context_parts)
        else:
            await self._handle_general_query(query, response_parts, context_parts)
        
        # Generate comprehensive response using LLM
        context = "\n".join(context_parts) if context_parts else "No specific context available."
        llm_response = self._call_llm(query, context)
        
        # Combine structured data with LLM response
        if response_parts:
            structured_response = "\n\n".join(response_parts)
            final_response = f"{structured_response}\n\n{llm_response}"
        else:
            final_response = llm_response
        
        # Store response in conversation history
        self.conversation_history.append({
            'timestamp': datetime.now().isoformat(),
            'assistant': final_response,
            'type': 'assistant'
        })
        
        return final_response
    
    async def _handle_weather_query(self, query: str, response_parts: List[str], context_parts: List[str]):
        """Handle weather-related queries."""
        print("🌤️ Getting weather information...")
        
        # Extract location from query
        location_match = re.search(r'(?:weather|climate)\s+(?:in|for|at)\s+([^?]+)', query.lower())
        if location_match:
            location = location_match.group(1).strip()
            
        # Search for current weather
        web_results = await self.search_web(f"current weather {location}")
        if web_results:
            context_parts.append(f"Weather information for {location}: {web_results[0]['snippet']}")
    
    async def _handle_flight_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle flight-related queries."""
        print("✈️ Searching for flight information...")
        
        # Search for flight information
        search_query = f"flights to {travel_info['destination']} {travel_info['date'] or ''} budget {travel_info['budget'] or ''}"
        web_results = await self.search_web(search_query)
        
        if web_results:
            context_parts.append(f"Flight information: {web_results[0]['snippet']}")
        else:
            context_parts.append(f"Flight information: General flight advice for {travel_info['destination']} - check major airlines and booking sites for current prices.")
    
    async def _handle_accommodation_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle accommodation queries."""
        print("🏨 Searching for accommodation...")
        
        search_query = f"hotels accommodation {travel_info['destination']} budget {travel_info['budget'] or ''}"
        web_results = await self.search_web(search_query)
        
        if web_results:
            context_parts.append(f"Accommodation options: {web_results[0]['snippet']}")
    
    async def _handle_budget_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle budget planning queries."""
        print("💰 Planning budget...")
        
        if travel_info['destination'] and travel_info['budget']:
            search_query = f"travel budget {travel_info['destination']} {travel_info['budget']} dollars {travel_info['duration'] or ''} days"
            web_results = await self.search_web(search_query)
            
            if web_results:
                context_parts.append(f"Budget planning: {web_results[0]['snippet']}")
    
    async def _handle_destination_query(self, query: str, travel_info: Dict[str, Any], response_parts: List[str], context_parts: List[str]):
        """Handle destination-specific queries."""
        destination = travel_info['destination']
        print(f"📍 Getting information about {destination}...")
        
        # Get country information
        country_data = await self.get_country_info(destination)
        if "error" not in country_data and country_data:
            if isinstance(country_data, list) and len(country_data) > 0:
                country_info = country_data[0]
            else:
                country_info = country_data
            
            capital = country_info.get('capital', ['Unknown'])[0] if isinstance(country_info.get('capital'), list) else country_info.get('capital', 'Unknown')
            population = country_info.get('population', 'Unknown')
            currency = country_info.get('currencies', {}).get('USD', {}).get('name', 'Unknown') if country_info.get('currencies') else 'Unknown'
            
            response_parts.append(f"**{destination}**")
            response_parts.append(f"Capital: {capital}")
            response_parts.append(f"Population: {population:,}" if isinstance(population, int) else f"Population: {population}")
            response_parts.append(f"Currency: {currency}")
            
            # Get coordinates
            if capital != 'Unknown':
                print(f"🗺️ Getting coordinates for {capital}...")
                geo_data = await self.geocode_location(capital)
                if "error" not in geo_data and geo_data:
                    if isinstance(geo_data, list) and len(geo_data) > 0:
                        geo_info = geo_data[0]
                    else:
                        geo_info = geo_data
                    
                    lat = geo_info.get('lat', 'Unknown')
                    lon = geo_info.get('lon', 'Unknown')
                    response_parts.append(f"Coordinates: {lat}, {lon}")
        
        # Get Wikipedia information
        print(f"📚 Getting detailed information...")
        wiki_data = await self.search_wikipedia(f"{destination} tourism travel guide")
        if "error" not in wiki_data and wiki_data:
            summary = wiki_data.get('summary', 'No summary available')
            context_parts.append(f"Travel information: {summary[:500]}...")
    
    async def _handle_general_query(self, query: str, response_parts: List[str], context_parts: List[str]):
        """Handle general travel queries."""
        print("🔍 Searching for general information...")
        
        # Search the web for current information
        web_results = await self.search_web(query)
        if web_results:
            context_parts.append(f"Current information: {web_results[0]['snippet']}")
    
    def get_conversation_summary(self) -> str:
        """Get a summary of the conversation history."""
        if not self.conversation_history:
            return "No conversation history available."
        
        recent_messages = self.conversation_history[-10:]  # Last 10 messages
        summary_parts = []
        
        for msg in recent_messages:
            if msg['type'] == 'user':
                summary_parts.append(f"User: {msg['user'][:100]}...")
            else:
                summary_parts.append(f"Assistant: {msg['assistant'][:100]}...")
        
        return "\n".join(summary_parts)
    
    def save_conversation(self):
        """Save conversation to database."""
        try:
            self.database.save_conversation(
                user_id="default",
                user_message=self.conversation_history[-2]['user'] if len(self.conversation_history) >= 2 else "",
                assistant_response=self.conversation_history[-1]['assistant'] if self.conversation_history else ""
            )
        except Exception as e:
            logger.error(f"Failed to save conversation: {e}")
    
    def chat(self):
        """Interactive chat interface."""
        print("🌍 Travel AI Agent - Privacy-First Travel Planning")
        print("=" * 60)
        print("Features:")
        print("• Local AI (Llama 3.1 8B) - No data leaves your device")
        print("• Real-time web search for current information")
        print("• Country information, Wikipedia, and geocoding")
        print("• Travel planning, budgeting, and recommendations")
        print("• Encrypted local storage for privacy")
        print("=" * 60)
        print("Type 'help' for commands, 'quit' to exit")
        print("All your data stays on your device - complete privacy!")
        print("-" * 60)
        
        while True:
            try:
                user_input = input("\nYou: ").strip()
                
                if user_input.lower() in ['quit', 'exit', 'bye']:
                    print("👋 Thank you for using Travel AI Agent! Safe travels!")
                    break
                
                if user_input.lower() == 'help':
                    self._show_help()
                    continue
                
                if user_input.lower() == 'summary':
                    print(f"\n📋 Conversation Summary:\n{self.get_conversation_summary()}")
                    continue
                
                if not user_input:
                    continue
                
                # Process the query
                response = asyncio.run(self.process_query(user_input))
                print(f"\n🤖 Agent: {response}")
                
                # Save conversation
                self.save_conversation()
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye! Safe travels!")
                break
            except Exception as e:
                logger.error(f"Chat error: {e}")
                print(f"\n❌ Error: {e}")
    
    def _show_help(self):
        """Show help information."""
        help_text = """
🆘 Travel AI Agent Help

Available Commands:
• help - Show this help message
• summary - Show conversation summary
• quit/exit/bye - Exit the application

Example Queries:
• "Tell me about Peru"
• "Plan a trip to Japan for 2 weeks with $3000 budget"
• "What's the weather like in Tokyo?"
• "Find flights to Paris in January"
• "Budget hotels in Bangkok under $50/night"
• "What to see in Rome in 3 days?"

Features:
• Country information and coordinates
• Real-time weather and travel information
• Budget planning and cost estimates
• Flight and accommodation suggestions
• Wikipedia integration for detailed info
• Web search for current information

Privacy:
• All data stays on your device
• No tracking or data collection
• Encrypted local storage
• Free forever - no API costs
        """
        print(help_text)

def main():
    """Main application entry point."""
    try:
        # Ensure data directory exists
        os.makedirs('data', exist_ok=True)
        
        # Initialize and run the travel agent
        agent = TravelAgent()
        agent.chat()
        
    except Exception as e:
        logger.error(f"Application error: {e}")
        print(f"❌ Failed to start Travel AI Agent: {e}")
        print("Please check the logs in data/travel_agent.log for more details.")

if __name__ == "__main__":
    main()
