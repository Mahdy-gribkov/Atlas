"""
Free Wikipedia API client - No API key required.
Uses Wikipedia REST API for real Wikipedia content.
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import urllib.parse

from .rate_limiter import APIRateLimiter

class WikipediaClient:
    """
    Free Wikipedia client using Wikipedia REST API.
    Provides real Wikipedia content without requiring API keys.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.rate_limiter = rate_limiter or APIRateLimiter()
        # No API key needed - uses Wikipedia REST API (completely free)
        self.base_url = "https://en.wikipedia.org/api/rest_v1"
    
    async def search_articles(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search Wikipedia articles using Wikipedia REST API (completely free, no API key).
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of article results
        """
        try:
            # Use Wikipedia search API (completely free, no API key)
            results = await self._search_wikipedia(query, limit)
            if results:
                return results
            
            return []
            
        except Exception as e:
            print(f"Wikipedia search error: {e}")
            return []
    
    async def get_article(self, title: str) -> Optional[Dict[str, Any]]:
        """
        Get Wikipedia article content using Wikipedia REST API (completely free, no API key).
        
        Args:
            title: Article title
            
        Returns:
            Article content
        """
        try:
            # Use Wikipedia page API (completely free, no API key)
            result = await self._get_wikipedia_article(title)
            if result:
                return result
            
            return None
            
        except Exception as e:
            print(f"Wikipedia article error: {e}")
            return None
    
    async def get_article_summary(self, title: str) -> Optional[Dict[str, Any]]:
        """
        Get Wikipedia article summary using Wikipedia REST API (completely free, no API key).
        
        Args:
            title: Article title
            
        Returns:
            Article summary
        """
        try:
            # Use Wikipedia summary API (completely free, no API key)
            result = await self._get_wikipedia_summary(title)
            if result:
                return result
            
            return None
            
        except Exception as e:
            print(f"Wikipedia summary error: {e}")
            return None
    
    async def _search_wikipedia(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Search Wikipedia using REST API (completely free, no API key)."""
        try:
            # Use Wikipedia search API to find articles
            search_url = f"{self.base_url}/page/summary/{urllib.parse.quote(query)}"
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        # Check if we got a valid response
                        if data.get('type') != 'disambiguation' and data.get('extract'):
                            result = {
                                'title': data.get('title', ''),
                                'extract': data.get('extract', ''),
                                'url': data.get('content_urls', {}).get('desktop', {}).get('page', ''),
                                'thumbnail': data.get('thumbnail', {}).get('source', '') if data.get('thumbnail') else '',
                                'type': data.get('type', ''),
                                'source': 'Wikipedia REST API (Real Data, Free)',
                                'timestamp': datetime.now().isoformat()
                            }
                            
                            return [result]
                        else:
                            # Try alternative search approach
                            return await self._search_wikipedia_alternative(query, limit)
                    else:
                        # Try alternative search approach
                        return await self._search_wikipedia_alternative(query, limit)
                        
        except Exception as e:
            print(f"Wikipedia search API error: {e}")
            # Try alternative search approach
            return await self._search_wikipedia_alternative(query, limit)
    
    async def _search_wikipedia_alternative(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Alternative Wikipedia search using different approach."""
        try:
            # Use Wikipedia's search endpoint
            search_url = "https://en.wikipedia.org/w/api.php"
            params = {
                'action': 'query',
                'format': 'json',
                'list': 'search',
                'srsearch': query,
                'srlimit': limit,
                'srprop': 'snippet'
            }
            
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        search_results = data.get('query', {}).get('search', [])
                        
                        results = []
                        for item in search_results[:limit]:
                            # Get page summary for each result
                            summary = await self._get_page_summary(item['title'])
                            if summary:
                                results.append(summary)
                        
                        return results
                        
        except Exception as e:
            print(f"Wikipedia alternative search error: {e}")
            return []
    
    async def _get_page_summary(self, title: str) -> Optional[Dict[str, Any]]:
        """Get page summary for a specific title."""
        try:
            url = f"{self.base_url}/page/summary/{urllib.parse.quote(title)}"
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'title': data.get('title', ''),
                            'extract': data.get('extract', ''),
                            'url': data.get('content_urls', {}).get('desktop', {}).get('page', ''),
                            'thumbnail': data.get('thumbnail', {}).get('source', '') if data.get('thumbnail') else '',
                            'type': data.get('type', ''),
                            'source': 'Wikipedia REST API (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
        except Exception as e:
            print(f"Wikipedia page summary error: {e}")
            return None
    
    async def _get_wikipedia_article(self, title: str) -> Optional[Dict[str, Any]]:
        """Get Wikipedia article using REST API (completely free, no API key)."""
        try:
            url = f"{self.base_url}/page/summary/{urllib.parse.quote(title)}"
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        result = {
                            'title': data.get('title', ''),
                            'extract': data.get('extract', ''),
                            'url': data.get('content_urls', {}).get('desktop', {}).get('page', ''),
                            'thumbnail': data.get('thumbnail', {}).get('source', '') if data.get('thumbnail') else '',
                            'type': data.get('type', ''),
                            'source': 'Wikipedia REST API (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
                        return result
                        
        except Exception as e:
            print(f"Wikipedia article API error: {e}")
            return None
    
    async def _get_wikipedia_summary(self, title: str) -> Optional[Dict[str, Any]]:
        """Get Wikipedia summary using REST API (completely free, no API key)."""
        try:
            url = f"{self.base_url}/page/summary/{urllib.parse.quote(title)}"
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        result = {
                            'title': data.get('title', ''),
                            'extract': data.get('extract', ''),
                            'url': data.get('content_urls', {}).get('desktop', {}).get('page', ''),
                            'thumbnail': data.get('thumbnail', {}).get('source', '') if data.get('thumbnail') else '',
                            'type': data.get('type', ''),
                            'source': 'Wikipedia REST API (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
                        return result
                        
        except Exception as e:
            print(f"Wikipedia summary API error: {e}")
            return None
    
    async def get_related_articles(self, title: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Get related Wikipedia articles using Wikipedia REST API (completely free, no API key).
        
        Args:
            title: Article title
            limit: Maximum number of related articles
            
        Returns:
            List of related articles
        """
        try:
            # Use Wikipedia links API (completely free, no API key)
            results = await self._get_wikipedia_links(title, limit)
            if results:
                return results
            
            return []
            
        except Exception as e:
            print(f"Wikipedia related articles error: {e}")
            return []
    
    async def _get_wikipedia_links(self, title: str, limit: int) -> List[Dict[str, Any]]:
        """Get Wikipedia links using REST API (completely free, no API key)."""
        try:
            url = f"{self.base_url}/page/links/{urllib.parse.quote(title)}"
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        results = []
                        links = data.get('links', [])
                        
                        for i, link in enumerate(links[:limit]):
                            result = {
                                'title': link.get('title', ''),
                                'url': f"https://en.wikipedia.org/wiki/{urllib.parse.quote(link.get('title', ''))}",
                                'source': 'Wikipedia REST API (Real Data, Free)',
                                'timestamp': datetime.now().isoformat()
                            }
                            
                            results.append(result)
                        
                        return results
                        
        except Exception as e:
            print(f"Wikipedia links API error: {e}")
            return []
    
    async def get_article_categories(self, title: str) -> List[str]:
        """
        Get Wikipedia article categories using Wikipedia REST API (completely free, no API key).
        
        Args:
            title: Article title
            
        Returns:
            List of categories
        """
        try:
            # Use Wikipedia categories API (completely free, no API key)
            categories = await self._get_wikipedia_categories(title)
            if categories:
                return categories
            
            return []
            
        except Exception as e:
            print(f"Wikipedia categories error: {e}")
            return []
    
    async def _get_wikipedia_categories(self, title: str) -> List[str]:
        """Get Wikipedia categories using REST API (completely free, no API key)."""
        try:
            url = f"{self.base_url}/page/categories/{urllib.parse.quote(title)}"
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        categories = []
                        for category in data.get('categories', []):
                            if 'title' in category:
                                categories.append(category['title'])
                        
                        return categories
                        
        except Exception as e:
            print(f"Wikipedia categories API error: {e}")
            return []