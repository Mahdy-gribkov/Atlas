"""
REST Countries API client for country information.
Free tier: Unlimited
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

from .rate_limiter import APIRateLimiter

class RestCountriesClient:
    """REST Countries API client for country information."""
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.base_url = "https://restcountries.com/v3.1"
        self.rate_limiter = rate_limiter or APIRateLimiter()
    
    async def _make_request(self, endpoint: str) -> Dict[str, Any]:
        """Make API request."""
        url = f"{self.base_url}/{endpoint}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"API request failed: {response.status}")
    
    async def get_country_info(self, country_name: str) -> Dict[str, Any]:
        """Get country information."""
        return await self._make_request(f'name/{country_name}')
    
    async def get_countries_by_currency(self, currency: str) -> List[Dict[str, Any]]:
        """Get countries that use a specific currency."""
        return await self._make_request(f'currency/{currency}')
