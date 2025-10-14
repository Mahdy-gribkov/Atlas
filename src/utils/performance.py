"""
Performance optimization utilities for the Travel AI Agent.
Includes caching, connection pooling, and response optimization.
"""

import asyncio
import time
import logging
from typing import Dict, Any, Optional
from functools import wraps
import aiohttp
from .cache_manager import cache_manager, API_CACHE

logger = logging.getLogger(__name__)

class PerformanceOptimizer:
    """Performance optimization manager for API calls and responses."""
    
    def __init__(self):
        self.session_pool = None
        self.request_cache = {}
        self.performance_stats = {
            'total_requests': 0,
            'cache_hits': 0,
            'avg_response_time': 0,
            'timeout_count': 0
        }
    
    async def get_session(self) -> aiohttp.ClientSession:
        """Get or create aiohttp session with connection pooling."""
        if self.session_pool is None:
            connector = aiohttp.TCPConnector(
                limit=100,
                limit_per_host=30,
                ttl_dns_cache=300,
                use_dns_cache=True,
            )
            timeout = aiohttp.ClientTimeout(total=10, connect=5)
            self.session_pool = aiohttp.ClientSession(
                connector=connector,
                timeout=timeout
            )
        return self.session_pool
    
    async def close_session(self):
        """Close the aiohttp session."""
        if self.session_pool:
            await self.session_pool.close()
            self.session_pool = None
    
    def track_performance(self, func):
        """Decorator to track function performance."""
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                execution_time = time.time() - start_time
                self.performance_stats['total_requests'] += 1
                self.performance_stats['avg_response_time'] = (
                    (self.performance_stats['avg_response_time'] * 
                     (self.performance_stats['total_requests'] - 1) + execution_time) /
                    self.performance_stats['total_requests']
                )
                return result
            except asyncio.TimeoutError:
                self.performance_stats['timeout_count'] += 1
                raise
        return wrapper
    
    def get_stats(self) -> Dict[str, Any]:
        """Get performance statistics."""
        return self.performance_stats.copy()

# Global performance optimizer
performance_optimizer = PerformanceOptimizer()

def optimize_response(response: str, max_length: int = 1000) -> str:
    """
    Optimize response for faster processing and better UX.
    
    Args:
        response: Original response text
        max_length: Maximum response length
        
    Returns:
        Optimized response text
    """
    if len(response) <= max_length:
        return response
    
    # Truncate at sentence boundary
    sentences = response.split('. ')
    optimized = ''
    
    for sentence in sentences:
        if len(optimized + sentence + '. ') <= max_length:
            optimized += sentence + '. '
        else:
            break
    
    if not optimized:
        # Fallback: truncate at word boundary
        words = response.split()
        optimized = ' '.join(words[:max_length//6])  # Rough word count
        if len(words) > max_length//6:
            optimized += '...'
    
    return optimized.strip()

async def batch_api_calls(api_calls: list, max_concurrent: int = 5) -> list:
    """
    Execute multiple API calls concurrently with rate limiting.
    
    Args:
        api_calls: List of async API call functions
        max_concurrent: Maximum concurrent calls
        
    Returns:
        List of results
    """
    semaphore = asyncio.Semaphore(max_concurrent)
    
    async def limited_call(call):
        async with semaphore:
            return await call()
    
    tasks = [limited_call(call) for call in api_calls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Filter out exceptions and log them
    valid_results = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.warning(f"API call {i} failed: {result}")
        else:
            valid_results.append(result)
    
    return valid_results

def compress_context(context: str, max_tokens: int = 200) -> str:
    """
    Compress context to fit within token limits.
    
    Args:
        context: Original context
        max_tokens: Maximum token count (rough estimate)
        
    Returns:
        Compressed context
    """
    if len(context) <= max_tokens * 4:  # Rough char to token ratio
        return context
    
    # Keep important parts and truncate
    lines = context.split('\n')
    important_lines = []
    current_length = 0
    
    for line in lines:
        if current_length + len(line) > max_tokens * 4:
            break
        if any(keyword in line.lower() for keyword in 
               ['price', 'cost', 'budget', 'flight', 'hotel', 'weather', 'location']):
            important_lines.append(line)
            current_length += len(line)
    
    return '\n'.join(important_lines[:10])  # Max 10 important lines

class ResponseCache:
    """Enhanced response caching with smart invalidation."""
    
    def __init__(self, ttl: int = 3600):
        self.cache = {}
        self.ttl = ttl
        self.access_times = {}
    
    async def get(self, key: str) -> Optional[str]:
        """Get cached response if valid."""
        if key in self.cache:
            if time.time() - self.access_times[key] < self.ttl:
                self.access_times[key] = time.time()
                return self.cache[key]
            else:
                # Expired
                del self.cache[key]
                del self.access_times[key]
        return None
    
    async def set(self, key: str, value: str, ttl: Optional[int] = None):
        """Cache response with TTL."""
        self.cache[key] = value
        self.access_times[key] = time.time()
        
        # Clean up old entries if cache is getting large
        if len(self.cache) > 1000:
            await self._cleanup()
    
    async def _cleanup(self):
        """Remove expired entries."""
        current_time = time.time()
        expired_keys = [
            key for key, access_time in self.access_times.items()
            if current_time - access_time > self.ttl
        ]
        
        for key in expired_keys:
            self.cache.pop(key, None)
            self.access_times.pop(key, None)

# Global response cache
response_cache = ResponseCache()
