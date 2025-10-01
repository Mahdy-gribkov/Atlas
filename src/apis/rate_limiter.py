"""
API rate limiter for managing free API quotas.
Ensures we don't exceed free tier limits.
"""

import asyncio
import time
from typing import Dict, Optional
from datetime import datetime, timedelta
import json
import os

class APIRateLimiter:
    """
    Manages rate limits for multiple free APIs.
    Tracks usage and prevents exceeding free tier limits.
    """
    
    def __init__(self, cache_file: str = "./cache/rate_limits.json"):
        self.cache_file = cache_file
        self.rate_limits = {
            'openweather': {'calls': 0, 'reset_time': 0, 'limit': 1000, 'period': 'day'},
            'fixer': {'calls': 0, 'reset_time': 0, 'limit': 100, 'period': 'month'},
            'aviationstack': {'calls': 0, 'reset_time': 0, 'limit': 100, 'period': 'month'},
            'amadeus': {'calls': 0, 'reset_time': 0, 'limit': 2000, 'period': 'month'},
            'openai': {'calls': 0, 'reset_time': 0, 'limit': 1000, 'period': 'day'},
            'restcountries': {'calls': 0, 'reset_time': 0, 'limit': 10000, 'period': 'day'},
            'wikipedia': {'calls': 0, 'reset_time': 0, 'limit': 10000, 'period': 'day'},
            'nominatim': {'calls': 0, 'reset_time': 0, 'limit': 1000, 'period': 'day'}
        }
        
        # Load existing rate limit data
        self._load_rate_limits()
    
    def _load_rate_limits(self):
        """Load rate limit data from cache file."""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'r') as f:
                    cached_data = json.load(f)
                    
                # Update rate limits with cached data
                for api_name, data in cached_data.items():
                    if api_name in self.rate_limits:
                        self.rate_limits[api_name].update(data)
                        
        except Exception as e:
            print(f"Error loading rate limits: {e}")
    
    def _save_rate_limits(self):
        """Save rate limit data to cache file."""
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            with open(self.cache_file, 'w') as f:
                json.dump(self.rate_limits, f, indent=2)
        except Exception as e:
            print(f"Error saving rate limits: {e}")
    
    def _get_reset_time(self, period: str) -> float:
        """Calculate reset time based on period."""
        now = time.time()
        
        if period == 'day':
            # Reset at midnight
            tomorrow = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
            return tomorrow.timestamp()
        elif period == 'month':
            # Reset at beginning of next month
            next_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if next_month.month == 12:
                next_month = next_month.replace(year=next_month.year + 1, month=1)
            else:
                next_month = next_month.replace(month=next_month.month + 1)
            return next_month.timestamp()
        else:
            # Default to 1 hour
            return now + 3600
    
    async def check_rate_limit(self, api_name: str) -> bool:
        """
        Check if API call is within rate limit.
        
        Args:
            api_name: Name of the API service
            
        Returns:
            bool: True if within limit, False if exceeded
        """
        if api_name not in self.rate_limits:
            print(f"Unknown API: {api_name}")
            return False
        
        now = time.time()
        api_limit = self.rate_limits[api_name]
        
        # Reset counter if time window has passed
        if now > api_limit['reset_time']:
            api_limit['calls'] = 0
            api_limit['reset_time'] = self._get_reset_time(api_limit['period'])
            self._save_rate_limits()
        
        # Check if under limit
        if api_limit['calls'] < api_limit['limit']:
            api_limit['calls'] += 1
            self._save_rate_limits()
            return True
        
        return False
    
    async def wait_for_rate_limit(self, api_name: str) -> float:
        """
        Wait until rate limit resets.
        
        Args:
            api_name: Name of the API service
            
        Returns:
            float: Time waited in seconds
        """
        if api_name not in self.rate_limits:
            return 0
        
        api_limit = self.rate_limits[api_name]
        wait_time = api_limit['reset_time'] - time.time()
        
        if wait_time > 0:
            print(f"Rate limit exceeded for {api_name}. Waiting {wait_time:.0f} seconds...")
            await asyncio.sleep(wait_time)
            return wait_time
        
        return 0
    
    def get_usage_stats(self, api_name: str = None) -> Dict:
        """
        Get usage statistics for APIs.
        
        Args:
            api_name: Specific API name, or None for all APIs
            
        Returns:
            dict: Usage statistics
        """
        if api_name:
            if api_name not in self.rate_limits:
                return {}
            
            api_limit = self.rate_limits[api_name]
            now = time.time()
            
            return {
                'api_name': api_name,
                'calls_made': api_limit['calls'],
                'limit': api_limit['limit'],
                'remaining': max(0, api_limit['limit'] - api_limit['calls']),
                'period': api_limit['period'],
                'reset_time': api_limit['reset_time'],
                'time_until_reset': max(0, api_limit['reset_time'] - now),
                'usage_percentage': (api_limit['calls'] / api_limit['limit']) * 100
            }
        else:
            # Return stats for all APIs
            stats = {}
            for api_name in self.rate_limits.keys():
                stats[api_name] = self.get_usage_stats(api_name)
            return stats
    
    def get_available_apis(self) -> list:
        """
        Get list of APIs that are not rate limited.
        
        Returns:
            list: Available API names
        """
        available_apis = []
        
        for api_name, api_limit in self.rate_limits.items():
            if api_limit['calls'] < api_limit['limit']:
                available_apis.append(api_name)
        
        return available_apis
    
    def reset_api_usage(self, api_name: str = None):
        """
        Reset usage for specific API or all APIs.
        
        Args:
            api_name: Specific API name, or None for all APIs
        """
        if api_name:
            if api_name in self.rate_limits:
                self.rate_limits[api_name]['calls'] = 0
                self.rate_limits[api_name]['reset_time'] = self._get_reset_time(
                    self.rate_limits[api_name]['period']
                )
        else:
            # Reset all APIs
            for api_name in self.rate_limits.keys():
                self.rate_limits[api_name]['calls'] = 0
                self.rate_limits[api_name]['reset_time'] = self._get_reset_time(
                    self.rate_limits[api_name]['period']
                )
        
        self._save_rate_limits()
    
    def add_api_limit(self, api_name: str, limit: int, period: str = 'day'):
        """
        Add or update rate limit for an API.
        
        Args:
            api_name: Name of the API
            limit: Maximum calls allowed
            period: Time period ('day' or 'month')
        """
        self.rate_limits[api_name] = {
            'calls': 0,
            'reset_time': self._get_reset_time(period),
            'limit': limit,
            'period': period
        }
        self._save_rate_limits()
    
    def get_rate_limit_status(self) -> Dict:
        """
        Get overall rate limit status.
        
        Returns:
            dict: Status information
        """
        total_apis = len(self.rate_limits)
        available_apis = len(self.get_available_apis())
        limited_apis = total_apis - available_apis
        
        return {
            'total_apis': total_apis,
            'available_apis': available_apis,
            'limited_apis': limited_apis,
            'availability_percentage': (available_apis / total_apis) * 100 if total_apis > 0 else 0
        }
