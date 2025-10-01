"""
Secure database module for the Travel AI Agent.
Provides encrypted local storage with automatic data cleanup.
"""

from .secure_database import SecureDatabase
from .models import UserPreference, SearchHistory, TravelPlan

__all__ = ['SecureDatabase', 'UserPreference', 'SearchHistory', 'TravelPlan']
