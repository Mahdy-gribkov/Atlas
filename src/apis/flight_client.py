"""
AviationStack API client for flight information.
Free tier: 100 calls/month
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

from ..config import config
from .rate_limiter import APIRateLimiter

class AviationStackClient:
    """AviationStack API client for flight information."""
    
    def __init__(self, api_key: str = None, rate_limiter: APIRateLimiter = None):
        self.api_key = api_key or config.AVIATIONSTACK_API_KEY
        self.base_url = "http://api.aviationstack.com/v1"
        self.rate_limiter = rate_limiter or APIRateLimiter()
        
        if not self.api_key:
            raise ValueError("AviationStack API key is required")
    
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make API request with rate limiting."""
        if not await self.rate_limiter.check_rate_limit('aviationstack'):
            await self.rate_limiter.wait_for_rate_limit('aviationstack')
        
        params['access_key'] = self.api_key
        url = f"{self.base_url}/{endpoint}"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    raise Exception(f"API request failed: {response.status}")
    
    async def get_flight_info(self, flight_number: str) -> Dict[str, Any]:
        """Get flight information."""
        params = {'flight_iata': flight_number}
        return await self._make_request('flights', params)
    
    async def get_airline_info(self, airline_code: str) -> Dict[str, Any]:
        """Get airline information."""
        params = {'iata_code': airline_code}
        return await self._make_request('airlines', params)
