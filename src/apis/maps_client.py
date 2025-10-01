"""
Nominatim (OpenStreetMap) API client for geocoding.
Free tier: 1000 calls/day
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

from .rate_limiter import APIRateLimiter

class NominatimClient:
    """Nominatim API client for geocoding."""
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.base_url = "https://nominatim.openstreetmap.org"
        self.rate_limiter = rate_limiter or APIRateLimiter()
    
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make API request."""
        url = f"{self.base_url}/{endpoint}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"API request failed: {response.status}")
    
    async def geocode(self, address: str) -> Dict[str, Any]:
        """Convert address to coordinates."""
        params = {'q': address, 'format': 'json', 'limit': 1}
        return await self._make_request('search', params)
    
    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        """Convert coordinates to address."""
        params = {'lat': lat, 'lon': lon, 'format': 'json'}
        return await self._make_request('reverse', params)
