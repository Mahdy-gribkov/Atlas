"""
Secure database module for the Travel AI Agent.
Provides encrypted local storage with automatic data cleanup.
"""

from .secure_database import SecureDatabase
from .async_database import AsyncDatabase
from .models import UserPreference, SearchHistory, TravelPlan

__all__ = ['SecureDatabase', 'AsyncDatabase', 'UserPreference', 'SearchHistory', 'TravelPlan']
