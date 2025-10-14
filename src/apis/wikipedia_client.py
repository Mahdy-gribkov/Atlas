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
        """Make API request with proper error handling."""
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        raise Exception(f"Wikipedia API request failed: {response.status}")
        except Exception as e:
            print(f"Wikipedia API error: {e}")
            raise
    
    async def search(self, query: str) -> Dict[str, Any]:
        """
        Search Wikipedia for information.
        
        Args:
            query: Search query
            
        Returns:
            Wikipedia search results
        """
        try:
            # Use Wikipedia's search API
            search_url = "https://en.wikipedia.org/api/rest_v1/page/summary"
            params = {'title': query}
            
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'title': data.get('title', query),
                            'summary': data.get('extract', 'No summary available'),
                            'url': data.get('content_urls', {}).get('desktop', {}).get('page', ''),
                            'thumbnail': data.get('thumbnail', {}).get('source', ''),
                            'type': data.get('type', 'standard'),
                            'source': 'Wikipedia (Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        return {'error': f'Wikipedia search failed: {response.status}'}
                        
        except Exception as e:
            print(f"Wikipedia search error: {e}")
            return {'error': str(e)}
    
    async def get_page_content(self, title: str) -> Dict[str, Any]:
        """
        Get full page content from Wikipedia.
        
        Args:
            title: Page title
            
        Returns:
            Page content
        """
        try:
            # Get page content
            content_url = f"https://en.wikipedia.org/api/rest_v1/page/html/{title}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(content_url, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        content = await response.text()
                        
                        return {
                            'title': title,
                            'content': content,
                            'source': 'Wikipedia (Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        return {'error': f'Wikipedia content fetch failed: {response.status}'}
                        
        except Exception as e:
            print(f"Wikipedia content error: {e}")
            return {'error': str(e)}
    
    async def get_city_info(self, city_name: str) -> Dict[str, Any]:
        """Get city information from Wikipedia."""
        return await self._make_request(f'page/summary/{city_name}')
    
    async def search_travel_info(self, query: str) -> Dict[str, Any]:
        """Search for travel-related information."""
        return await self._make_request(f'page/summary/{query}')