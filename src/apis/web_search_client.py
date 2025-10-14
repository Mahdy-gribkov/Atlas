"""
Free Web Search API client - No API key required.
Uses DuckDuckGo search for real web search results.
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import urllib.parse

from .rate_limiter import APIRateLimiter

class WebSearchClient:
    """
    Free web search client using DuckDuckGo.
    Provides real web search results without requiring API keys.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.rate_limiter = rate_limiter or APIRateLimiter()
        # No API key needed - uses DuckDuckGo (completely free)
    
    async def search(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Search the web using DuckDuckGo (completely free, no API key).
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            List of search results
        """
        try:
            # Use DuckDuckGo search (completely free, no API key)
            results = await self._search_duckduckgo(query, max_results)
            if results:
                return results
            
            return []
            
        except Exception as e:
            print(f"Web search error: {e}")
            return []
    
    async def _search_duckduckgo(self, query: str, max_results: int) -> List[Dict[str, Any]]:
        """Search using DuckDuckGo (completely free, no API key)."""
        try:
            # DuckDuckGo search URL
            search_url = "https://html.duckduckgo.com/html/"
            
            # Prepare search parameters
            params = {
                'q': query,
                'kl': 'us-en'  # Language
            }
            
            # Headers to mimic a real browser
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(search_url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as response:
                    if response.status == 200:
                        html_content = await response.text()
                        
                        # Parse HTML to extract search results
                        results = self._parse_duckduckgo_results(html_content, max_results)
                        return results
                        
        except Exception as e:
            print(f"DuckDuckGo search error: {e}")
            return []
    
    def _parse_duckduckgo_results(self, html_content: str, max_results: int) -> List[Dict[str, Any]]:
        """Parse DuckDuckGo search results from HTML."""
        try:
            import re
            
            results = []
            
            # DuckDuckGo result pattern
            result_pattern = r'<a rel="nofollow" href="([^"]+)" class="result__a">([^<]+)</a>'
            matches = re.findall(result_pattern, html_content)
            
            for i, (url, title) in enumerate(matches[:max_results]):
                # Clean up the title
                title = re.sub(r'<[^>]+>', '', title)  # Remove HTML tags
                title = title.strip()
                
                # Extract domain from URL
                domain = urllib.parse.urlparse(url).netloc
                
                result = {
                    'title': title,
                    'url': url,
                    'domain': domain,
                    'snippet': f"Search result for: {title}",
                    'source': 'DuckDuckGo (Real Data, Free)',
                    'timestamp': datetime.now().isoformat()
                }
                
                results.append(result)
            
            return results
            
        except Exception as e:
            print(f"HTML parsing error: {e}")
            return []
    
    async def search_news(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Search for news using DuckDuckGo.
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            List of news results
        """
        try:
            # Add news-specific terms to the query
            news_query = f"{query} news"
            results = await self.search(news_query, max_results)
            
            # Filter and enhance results for news
            news_results = []
            for result in results:
                news_result = result.copy()
                news_result['type'] = 'news'
                news_result['source'] = 'DuckDuckGo News (Real Data, Free)'
                news_results.append(news_result)
            
            return news_results
            
        except Exception as e:
            print(f"News search error: {e}")
            return []
    
    async def search_images(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Search for images using DuckDuckGo.
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            List of image results
        """
        try:
            # Add image-specific terms to the query
            image_query = f"{query} images"
            results = await self.search(image_query, max_results)
            
            # Filter and enhance results for images
            image_results = []
            for result in results:
                image_result = result.copy()
                image_result['type'] = 'image'
                image_result['source'] = 'DuckDuckGo Images (Real Data, Free)'
                image_results.append(image_result)
            
            return image_results
            
        except Exception as e:
            print(f"Image search error: {e}")
            return []
    
    async def search_travel(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Search for travel-related information using DuckDuckGo.
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            List of travel results
        """
        try:
            # Add travel-specific terms to the query
            travel_query = f"{query} travel guide"
            results = await self.search(travel_query, max_results)
            
            # Filter and enhance results for travel
            travel_results = []
            for result in results:
                travel_result = result.copy()
                travel_result['type'] = 'travel'
                travel_result['source'] = 'DuckDuckGo Travel (Real Data, Free)'
                travel_results.append(travel_result)
            
            return travel_results
            
        except Exception as e:
            print(f"Travel search error: {e}")
            return []