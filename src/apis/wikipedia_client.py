"""
Wikipedia API client for general information.
Free tier: Unlimited
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

from .rate_limiter import APIRateLimiter

class WikipediaClient:
    """Wikipedia API client for general information."""
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.base_url = "https://en.wikipedia.org/api/rest_v1"
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
    
    async def get_city_info(self, city_name: str) -> Dict[str, Any]:
        """Get city information from Wikipedia."""
        return await self._make_request(f'page/summary/{city_name}')
    
    async def search_travel_info(self, query: str) -> Dict[str, Any]:
        """Search for travel-related information."""
        return await self._make_request(f'page/summary/{query}')
