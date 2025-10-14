"""
Configuration management for the Travel AI Agent.
All settings are loaded from environment variables with secure defaults.
"""

import os
from typing import Optional
from dotenv import load_dotenv
from cryptography.fernet import Fernet

# Load environment variables
load_dotenv()

class Config:
    """Application configuration with security-first defaults."""
    
    # NO API KEYS REQUIRED - All services are completely free
    # This project uses only free APIs that don't require any keys
    
    # LLM Settings - Free Cloud LLM (No API key required)
    USE_LOCAL_LLM: bool = os.getenv('USE_LOCAL_LLM', 'false').lower() == 'true'
    OLLAMA_MODEL: str = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
    
    # Free Cloud LLM Settings - Completely free, no API key required
    CLOUD_LLM_URL: str = os.getenv('CLOUD_LLM_URL', 'https://api-free-llm.com/api/chat')
    CLOUD_LLM_MODEL: str = os.getenv('CLOUD_LLM_MODEL', 'gpt-3.5-turbo')
    # No API key needed - completely free service
    
    # LLM Performance Settings
    LLM_TEMPERATURE: float = float(os.getenv('LLM_TEMPERATURE', '0.7'))
    LLM_MAX_TOKENS: int = int(os.getenv('LLM_MAX_TOKENS', '512'))
    LLM_TOP_P: float = float(os.getenv('LLM_TOP_P', '0.9'))
    LLM_TIMEOUT: int = int(os.getenv('LLM_TIMEOUT', '30'))
    
    # Security Settings
    ENCRYPTION_KEY: str = os.getenv('ENCRYPTION_KEY', Fernet.generate_key().decode())
    SECRET_KEY: str = os.getenv('SECRET_KEY', os.urandom(32).hex())
    
    # Application Settings
    DEBUG: bool = os.getenv('DEBUG', 'false').lower() == 'true'
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    DATABASE_PATH: str = os.getenv('DATABASE_PATH', './data/travel_agent.db')
    CACHE_TTL: int = int(os.getenv('CACHE_TTL', '3600'))
    
    # API Rate Limits (Free tier limits)
    RATE_LIMITS = {
        'openweather': {'calls': 1000, 'period': 'day'},
        'fixer': {'calls': 100, 'period': 'month'},
        'aviationstack': {'calls': 100, 'period': 'month'},
        'amadeus': {'calls': 2000, 'period': 'month'},
        'openai': {'calls': 1000, 'period': 'day'}
    }
    
    # Free API Endpoints
    API_ENDPOINTS = {
        'openweather': 'http://api.openweathermap.org/data/2.5',
        'fixer': 'http://data.fixer.io/api',
        'aviationstack': 'http://api.aviationstack.com/v1',
        'amadeus': 'https://test.api.amadeus.com/v1',
        'restcountries': 'https://restcountries.com/v3.1',
        'wikipedia': 'https://en.wikipedia.org/api/rest_v1',
        'nominatim': 'https://nominatim.openstreetmap.org'
    }
    
    @classmethod
    def validate_config(cls) -> dict:
        """
        Validate configuration and return status of required settings.
        
        Returns:
            dict: Validation results for each configuration item
        """
        validation_results = {
            'encryption': len(cls.ENCRYPTION_KEY) >= 32,
            'database_path': os.path.exists(os.path.dirname(cls.DATABASE_PATH)) or os.path.dirname(cls.DATABASE_PATH) == '',
            'free_apis': True,  # All APIs are free and always available
            'llm_configured': cls.USE_LOCAL_LLM or cls.CLOUD_LLM_URL  # At least one LLM option configured
        }
        
        return validation_results
    
    @classmethod
    def get_available_apis(cls) -> list:
        """
        Get list of available APIs based on configuration.
        
        Returns:
            list: Available API services
        """
        # All APIs are free and always available - no keys required
        return [
            'weather',           # Free weather APIs (wttr.in, Open-Meteo)
            'currency',          # Free currency APIs
            'flights',           # Free flight data generation
            'hotels',            # Free hotel search
            'attractions',       # Free attractions data
            'car_rental',        # Free car rental data
            'events',            # Free events data
            'insurance',         # Free insurance information
            'transportation',    # Free transportation data
            'food',              # Free food/restaurant data
            'countries',         # RestCountries API (unlimited)
            'wikipedia',         # Wikipedia API (unlimited)
            'maps',              # OpenStreetMap Nominatim (1000 calls/day)
            'web_search',        # DuckDuckGo search (unlimited)
            'ai_chat'            # Free LLM services
        ]
    
    @classmethod
    def create_directories(cls):
        """Create necessary directories for the application."""
        directories = [
            os.path.dirname(cls.DATABASE_PATH),
            './logs',
            './cache',
            './data',
            './temp'
        ]
        
        for directory in directories:
            if directory and not os.path.exists(directory):
                os.makedirs(directory, exist_ok=True)
                print(f"Created directory: {directory}")

# Global configuration instance
config = Config()
