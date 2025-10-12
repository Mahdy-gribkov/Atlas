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
    
    # API Keys (Free services only)
    OPENWEATHER_API_KEY: Optional[str] = os.getenv('OPENWEATHER_API_KEY')
    FIXER_API_KEY: Optional[str] = os.getenv('FIXER_API_KEY')
    AVIATIONSTACK_API_KEY: Optional[str] = os.getenv('AVIATIONSTACK_API_KEY')
    AMADEUS_API_KEY: Optional[str] = os.getenv('AMADEUS_API_KEY')
    AMADEUS_API_SECRET: Optional[str] = os.getenv('AMADEUS_API_SECRET')
    OPENAI_API_KEY: Optional[str] = os.getenv('OPENAI_API_KEY')
    
    # Local LLM Settings (Free)
    OLLAMA_MODEL: str = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
    USE_LOCAL_LLM: bool = os.getenv('USE_LOCAL_LLM', 'true').lower() == 'true'
    
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
            'openweather': cls.OPENWEATHER_API_KEY is not None,
            'fixer': cls.FIXER_API_KEY is not None,
            'aviationstack': cls.AVIATIONSTACK_API_KEY is not None,
            'amadeus': cls.AMADEUS_API_KEY is not None and cls.AMADEUS_API_SECRET is not None,
            'openai': cls.OPENAI_API_KEY is not None,
            'encryption': len(cls.ENCRYPTION_KEY) >= 32,
            'database_path': os.path.exists(os.path.dirname(cls.DATABASE_PATH)) or os.path.dirname(cls.DATABASE_PATH) == ''
        }
        
        return validation_results
    
    @classmethod
    def get_available_apis(cls) -> list:
        """
        Get list of available APIs based on configuration.
        
        Returns:
            list: Available API services
        """
        validation = cls.validate_config()
        available_apis = []
        
        if validation['openweather']:
            available_apis.append('weather')
        if validation['fixer']:
            available_apis.append('currency')
        if validation['aviationstack']:
            available_apis.append('flights')
        if validation['amadeus']:
            available_apis.append('travel_search')
        if validation['openai']:
            available_apis.append('ai_chat')
        
        # Always available (no API key required)
        available_apis.extend(['countries', 'wikipedia', 'maps'])
        
        return available_apis
    
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
