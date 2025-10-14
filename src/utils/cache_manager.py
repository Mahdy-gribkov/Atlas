"""
Advanced caching system for the Travel AI Agent.
Includes LRU cache, persistent cache, and performance optimization.
"""

import asyncio
import json
import time
import logging
from typing import Dict, Any, Optional, Union
from collections import OrderedDict
import os
import pickle

logger = logging.getLogger(__name__)

class LRUCache:
    """Thread-safe LRU cache with TTL support."""
    
    def __init__(self, max_size: int = 1000, default_ttl: float = 3600):
        self.max_size = max_size
        self.default_ttl = default_ttl
        self._cache = OrderedDict()
        self._timestamps = {}
        self._lock = asyncio.Lock()
    
    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        async with self._lock:
            if key not in self._cache:
                return None
            
            # Check TTL
            if time.time() - self._timestamps[key] > self.default_ttl:
                del self._cache[key]
                del self._timestamps[key]
                return None
            
            # Move to end (most recently used)
            value = self._cache.pop(key)
            self._cache[key] = value
            return value
    
    async def set(self, key: str, value: Any, ttl: Optional[float] = None) -> None:
        """Set value in cache."""
        async with self._lock:
            if ttl is None:
                ttl = self.default_ttl
            
            # Remove if exists
            if key in self._cache:
                del self._cache[key]
                del self._timestamps[key]
            
            # Add new entry
            self._cache[key] = value
            self._timestamps[key] = time.time()
            
            # Evict if over limit
            while len(self._cache) > self.max_size:
                oldest_key = next(iter(self._cache))
                del self._cache[oldest_key]
                del self._timestamps[oldest_key]
    
    async def delete(self, key: str) -> bool:
        """Delete key from cache."""
        async with self._lock:
            if key in self._cache:
                del self._cache[key]
                del self._timestamps[key]
                return True
            return False
    
    async def clear(self) -> None:
        """Clear all cache entries."""
        async with self._lock:
            self._cache.clear()
            self._timestamps.clear()
    
    async def cleanup_expired(self) -> int:
        """Remove expired entries and return count."""
        async with self._lock:
            current_time = time.time()
            expired_keys = [
                key for key, timestamp in self._timestamps.items()
                if current_time - timestamp > self.default_ttl
            ]
            
            for key in expired_keys:
                del self._cache[key]
                del self._timestamps[key]
            
            return len(expired_keys)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        return {
            'size': len(self._cache),
            'max_size': self.max_size,
            'usage_percent': (len(self._cache) / self.max_size) * 100,
            'default_ttl': self.default_ttl
        }

class PersistentCache:
    """Persistent cache that survives application restarts."""
    
    def __init__(self, cache_file: str = './data/cache.pkl'):
        self.cache_file = cache_file
        self._cache = {}
        self._timestamps = {}
        self._lock = asyncio.Lock()
        self._load_cache()
    
    def _load_cache(self):
        """Load cache from disk."""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'rb') as f:
                    data = pickle.load(f)
                    self._cache = data.get('cache', {})
                    self._timestamps = data.get('timestamps', {})
                logger.info(f"Loaded persistent cache with {len(self._cache)} entries")
        except Exception as e:
            logger.warning(f"Failed to load persistent cache: {e}")
            self._cache = {}
            self._timestamps = {}
    
    async def _save_cache(self):
        """Save cache to disk."""
        try:
            os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)
            data = {
                'cache': self._cache,
                'timestamps': self._timestamps
            }
            with open(self.cache_file, 'wb') as f:
                pickle.dump(data, f)
        except Exception as e:
            logger.error(f"Failed to save persistent cache: {e}")
    
    async def get(self, key: str, ttl: float = 3600) -> Optional[Any]:
        """Get value from persistent cache."""
        async with self._lock:
            if key not in self._cache:
                return None
            
            # Check TTL
            if time.time() - self._timestamps[key] > ttl:
                del self._cache[key]
                del self._timestamps[key]
                await self._save_cache()
                return None
            
            return self._cache[key]
    
    async def set(self, key: str, value: Any, ttl: float = 3600) -> None:
        """Set value in persistent cache."""
        async with self._lock:
            self._cache[key] = value
            self._timestamps[key] = time.time()
            await self._save_cache()

class CacheManager:
    """Centralized cache management system."""
    
    def __init__(self):
        self._caches: Dict[str, LRUCache] = {}
        self._cleanup_task: Optional[asyncio.Task] = None
        self._cleanup_started = False
    
    def get_cache(self, name: str, max_size: int = 1000, default_ttl: float = 3600) -> LRUCache:
        """Get or create a cache instance."""
        if name not in self._caches:
            self._caches[name] = LRUCache(max_size, default_ttl)
            if not self._cleanup_started:
                self._start_cleanup_task()
        return self._caches[name]
    
    def _start_cleanup_task(self):
        """Start the cleanup task for expired entries."""
        try:
            if self._cleanup_task is None or self._cleanup_task.done():
                self._cleanup_task = asyncio.create_task(self._cleanup_loop())
                self._cleanup_started = True
        except RuntimeError:
            # No event loop running yet, will start later
            pass
    
    async def _cleanup_loop(self):
        """Background cleanup loop."""
        while True:
            try:
                await asyncio.sleep(300)  # Run every 5 minutes
                total_cleaned = 0
                for cache in self._caches.values():
                    cleaned = await cache.cleanup_expired()
                    total_cleaned += cleaned
                
                if total_cleaned > 0:
                    logger.info(f"Cleaned {total_cleaned} expired cache entries")
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Cache cleanup error: {e}")
    
    def get_all_stats(self) -> Dict[str, Any]:
        """Get statistics for all caches."""
        stats = {}
        for name, cache in self._caches.items():
            stats[name] = cache.get_stats()
        return stats
    
    async def clear_all(self):
        """Clear all caches."""
        for cache in self._caches.values():
            await cache.clear()
    
    async def shutdown(self):
        """Shutdown cache manager."""
        if self._cleanup_task and not self._cleanup_task.done():
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass

def cached(cache_name: str = 'default', ttl: float = 3600):
    """Decorator for caching function results."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Create cache key from function name and arguments
            cache_key = f"{func.__name__}:{hash(str(args) + str(kwargs))}"
            
            # Get cache
            cache = cache_manager.get_cache(cache_name)
            
            # Try to get from cache
            result = await cache.get(cache_key, ttl)
            if result is not None:
                return result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache.set(cache_key, result, ttl)
            
            return result
        return wrapper
    return decorator

# Global cache manager
cache_manager = CacheManager()

# Cache names
API_CACHE = 'api_responses'
DATABASE_CACHE = 'database_queries'
RESPONSE_CACHE = 'llm_responses'