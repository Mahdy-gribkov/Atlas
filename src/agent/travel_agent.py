"""
Main Travel AI Agent implementation.
Privacy-first travel planning with LangChain and free APIs.
"""

import asyncio
from typing import Dict, Any, List, Optional
from datetime import datetime
import json

from langchain.agents import initialize_agent, AgentType
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from langchain.schema import BaseMessage, HumanMessage, AIMessage

from ..config import config
from ..database import SecureDatabase
from .prompts import TRAVEL_AGENT_PROMPT, SYSTEM_MESSAGES
from .tools import TravelTools

class TravelAgent:
    """
    Privacy-first travel AI agent with LangChain.
    Uses only free APIs and protects user data.
    """
    
    def __init__(self, 
                 openai_api_key: str = None,
                 database: SecureDatabase = None,
                 use_local_llm: bool = False):
        """
        Initialize the travel agent.
        
        Args:
            openai_api_key: OpenAI API key (optional if using local LLM)
            database: Secure database instance
            use_local_llm: Whether to use local LLM instead of OpenAI
        """
        self.openai_api_key = openai_api_key or config.OPENAI_API_KEY
        self.database = database or SecureDatabase()
        self.use_local_llm = use_local_llm or config.USE_LOCAL_LLM
        
        # Initialize components
        self.llm = None
        self.memory = None
        self.tools = None
        self.agent = None
        
        self._initialize_agent()
    
    def _initialize_agent(self):
        """Initialize the LangChain agent with tools and memory."""
        try:
            # Initialize LLM
            if self.use_local_llm:
                self._initialize_local_llm()
            else:
                self._initialize_openai_llm()
            
            # Initialize memory
            self.memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                output_key="output"
            )
            
            # Initialize tools
            self.tools = TravelTools(self.database)
            available_tools = self.tools.get_available_tools()
            
            if not available_tools:
                raise Exception("No tools available. Please check your API configuration.")
            
            # Initialize agent
            self.agent = initialize_agent(
                tools=available_tools,
                llm=self.llm,
                agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
                memory=self.memory,
                verbose=config.DEBUG,
                handle_parsing_errors=True,
                max_iterations=5,
                early_stopping_method="generate"
            )
            
            print(f"Travel agent initialized with {len(available_tools)} tools")
            
        except Exception as e:
            print(f"Error initializing travel agent: {e}")
            raise
    
    def _initialize_openai_llm(self):
        """Initialize OpenAI LLM."""
        if not self.openai_api_key:
            raise ValueError("OpenAI API key is required when not using local LLM")
        
        self.llm = OpenAI(
            openai_api_key=self.openai_api_key,
            temperature=0.7,
            max_tokens=1000,
            model_name="gpt-3.5-turbo"
        )
        
        print("OpenAI LLM initialized")
    
    def _initialize_local_llm(self):
        """Initialize local LLM (Ollama)."""
        try:
            import ollama
            
            # Check if Ollama is available
            models = ollama.list()
            model_name = config.OLLAMA_MODEL
            
            if model_name not in [model['name'] for model in models['models']]:
                print(f"Model {model_name} not found. Available models: {[m['name'] for m in models['models']]}")
                raise Exception(f"Local model {model_name} not available")
            
            # Create a simple wrapper for Ollama
            class OllamaLLM:
                def __init__(self, model_name):
                    self.model_name = model_name
                
                def __call__(self, prompt, **kwargs):
                    try:
                        response = ollama.generate(
                            model=self.model_name,
                            prompt=prompt,
                            options={
                                'temperature': kwargs.get('temperature', 0.7),
                                'top_p': kwargs.get('top_p', 0.9),
                                'max_tokens': kwargs.get('max_tokens', 1000)
                            }
                        )
                        return response['response']
                    except Exception as e:
                        return f"Error with local LLM: {str(e)}"
            
            self.llm = OllamaLLM(model_name)
            print(f"Local LLM ({model_name}) initialized")
            
        except ImportError:
            raise Exception("Ollama not installed. Install with: pip install ollama")
        except Exception as e:
            raise Exception(f"Failed to initialize local LLM: {e}")
    
    async def chat(self, message: str, user_id: str = "default") -> str:
        """
        Chat with the travel agent.
        
        Args:
            message: User message
            user_id: User identifier for personalization
            
        Returns:
            str: Agent response
        """
        try:
            # Store user preference for this interaction
            self.database.store_preference(f"last_query_{user_id}", message, ttl_hours=1)
            
            # Process the message
            if not self.agent:
                return "Agent not initialized. Please check your configuration."
            
            # Run the agent
            response = self.agent.run(input=message)
            
            # Store the interaction
            self.database.store_search("chat", {
                "user_id": user_id,
                "message": message,
                "response": response,
                "timestamp": datetime.now().isoformat()
            })
            
            return response
            
        except Exception as e:
            error_msg = f"I apologize, but I encountered an error: {str(e)}"
            print(f"Chat error: {e}")
            return error_msg
    
    def get_help(self) -> str:
        """Get help information about available features."""
        return SYSTEM_MESSAGES["greeting"]
    
    def get_weather_help(self) -> str:
        """Get help for weather features."""
        return SYSTEM_MESSAGES["weather_help"]
    
    def get_currency_help(self) -> str:
        """Get help for currency features."""
        return SYSTEM_MESSAGES["currency_help"]
    
    def get_flight_help(self) -> str:
        """Get help for flight features."""
        return SYSTEM_MESSAGES["flight_help"]
    
    def get_country_help(self) -> str:
        """Get help for country features."""
        return SYSTEM_MESSAGES["country_help"]
    
    def get_privacy_info(self) -> str:
        """Get privacy information."""
        return SYSTEM_MESSAGES["privacy_info"]
    
    async def plan_trip(self, destination: str, start_date: str = None, 
                       end_date: str = None, travelers: int = 1, 
                       budget: float = None, currency: str = "USD") -> Dict[str, Any]:
        """
        Plan a comprehensive trip.
        
        Args:
            destination: Destination city or country
            start_date: Trip start date (YYYY-MM-DD)
            end_date: Trip end date (YYYY-MM-DD)
            travelers: Number of travelers
            budget: Budget amount
            currency: Budget currency
            
        Returns:
            dict: Comprehensive trip plan
        """
        try:
            trip_plan = {
                "destination": destination,
                "start_date": start_date,
                "end_date": end_date,
                "travelers": travelers,
                "budget": budget,
                "currency": currency,
                "created_at": datetime.now().isoformat(),
                "components": {}
            }
            
            # Get weather information
            try:
                weather_info = await self._get_weather_for_trip(destination, start_date, end_date)
                trip_plan["components"]["weather"] = weather_info
            except Exception as e:
                trip_plan["components"]["weather"] = {"error": str(e)}
            
            # Get currency information
            if budget and currency != "USD":
                try:
                    currency_info = await self._get_currency_for_trip(currency, budget)
                    trip_plan["components"]["currency"] = currency_info
                except Exception as e:
                    trip_plan["components"]["currency"] = {"error": str(e)}
            
            # Get destination information
            try:
                destination_info = await self._get_destination_info(destination)
                trip_plan["components"]["destination"] = destination_info
            except Exception as e:
                trip_plan["components"]["destination"] = {"error": str(e)}
            
            # Store the trip plan
            from ..database.models import TravelPlan
            travel_plan = TravelPlan(
                plan_name=f"Trip to {destination}",
                destination=destination,
                start_date=datetime.fromisoformat(start_date) if start_date else None,
                end_date=datetime.fromisoformat(end_date) if end_date else None,
                travelers=travelers,
                budget=budget or 0.0,
                currency=currency
            )
            travel_plan.set_plan_data(trip_plan)
            
            self.database.store_travel_plan(travel_plan)
            
            return trip_plan
            
        except Exception as e:
            return {"error": f"Failed to plan trip: {str(e)}"}
    
    async def _get_weather_for_trip(self, destination: str, start_date: str, end_date: str) -> Dict[str, Any]:
        """Get weather information for trip dates."""
        if not self.tools.weather_client:
            return {"error": "Weather service not available"}
        
        try:
            # Parse dates to determine forecast days
            if start_date and end_date:
                start = datetime.fromisoformat(start_date)
                end = datetime.fromisoformat(end_date)
                days = (end - start).days + 1
            else:
                days = 5
            
            # Get weather forecast
            weather_data = await self.tools.weather_client.get_weather_forecast(
                destination, days=min(days, 5)
            )
            
            return {
                "forecast": weather_data,
                "recommendations": self._generate_weather_recommendations(weather_data)
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    async def _get_currency_for_trip(self, currency: str, budget: float) -> Dict[str, Any]:
        """Get currency information for trip budget."""
        if not self.tools.currency_client:
            return {"error": "Currency service not available"}
        
        try:
            # Get currency information
            currency_info = await self.tools.currency_client.get_travel_currency_info(
                destination_country="", base_currency=currency
            )
            
            return {
                "currency_info": currency_info,
                "budget_analysis": {
                    "budget": budget,
                    "currency": currency,
                    "equivalent_usd": budget * currency_info["rates"].get("USD", 1)
                }
            }
            
        except Exception as e:
            return {"error": str(e)}
    
    async def _get_destination_info(self, destination: str) -> Dict[str, Any]:
        """Get destination information."""
        try:
            destination_info = {}
            
            # Get country information
            if self.tools.country_client:
                try:
                    country_info = await self.tools.country_client.get_country_info(destination)
                    destination_info["country"] = country_info
                except:
                    pass
            
            # Get Wikipedia information
            if self.tools.wikipedia_client:
                try:
                    wiki_info = await self.tools.wikipedia_client.get_city_info(destination)
                    destination_info["wikipedia"] = wiki_info
                except:
                    pass
            
            return destination_info
            
        except Exception as e:
            return {"error": str(e)}
    
    def _generate_weather_recommendations(self, weather_data: List[Dict]) -> List[str]:
        """Generate weather-based travel recommendations."""
        recommendations = []
        
        for day in weather_data:
            if day.get("max_temperature", 0) > 30:
                recommendations.append(f"Hot weather on {day['date']} - pack light clothing and stay hydrated")
            elif day.get("min_temperature", 0) < 10:
                recommendations.append(f"Cold weather on {day['date']} - pack warm clothing")
            
            if day.get("max_precipitation_probability", 0) > 50:
                recommendations.append(f"Rain likely on {day['date']} - plan indoor activities")
        
        return recommendations
    
    def get_available_features(self) -> List[str]:
        """Get list of available features."""
        features = []
        
        if self.tools.weather_client:
            features.append("weather")
        if self.tools.currency_client:
            features.append("currency")
        if self.tools.flight_client:
            features.append("flights")
        if self.tools.country_client:
            features.append("countries")
        if self.tools.wikipedia_client:
            features.append("wikipedia")
        if self.tools.maps_client:
            features.append("geocoding")
        
        return features
    
    def get_database_stats(self) -> Dict[str, Any]:
        """Get database statistics."""
        return self.database.get_database_stats()
    
    def cleanup_data(self) -> int:
        """Clean up expired data."""
        return self.database.cleanup_expired_data()
    
    def close(self):
        """Close the agent and database."""
        if self.database:
            self.database.close()
        print("Travel agent closed")
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
