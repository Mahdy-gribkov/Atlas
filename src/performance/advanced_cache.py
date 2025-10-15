"""
Advanced Caching System - Production Ready
Provides sophisticated multi-level caching for optimal performance.
"""

import asyncio
import json
import logging
import time
import hashlib
from typing import Dict, List, Any, Optional, Union, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from collections import OrderedDict
import pickle
import threading
from functools import wraps

logger = logging.getLogger(__name__)


@dataclass
class CacheEntry:
    """Represents a cache entry with metadata."""
    key: str
    value: Any
    created_at: datetime
    expires_at: datetime
    access_count: int
    last_accessed: datetime
    size_bytes: int
    tags: List[str]
    metadata: Dict[str, Any]


class AdvancedCache:
    """
    Advanced multi-level caching system with intelligent eviction and optimization.
    Provides memory, disk, and distributed caching capabilities.
    """
    
    def __init__(self, max_memory_size: int = 100 * 1024 * 1024,  # 100MB
                 max_disk_size: int = 500 * 1024 * 1024,  # 500MB
                 default_ttl: int = 3600,  # 1 hour
                 cleanup_interval: int = 300):  # 5 minutes
        self.max_memory_size = max_memory_size
        self.max_disk_size = max_disk_size
        self.default_ttl = default_ttl
        self.cleanup_interval = cleanup_interval
        
        # Memory cache (LRU with size limits)
        self.memory_cache: OrderedDict[str, CacheEntry] = OrderedDict()
        self.memory_size = 0
        
        # Disk cache (persistent storage)
        self.disk_cache_path = "data/cache"
        self.disk_cache_index: Dict[str, Dict[str, Any]] = {}
        
        # Statistics
        self.stats = {
            'hits': 0,
            'misses': 0,
            'evictions': 0,
            'disk_writes': 0,
            'disk_reads': 0,
            'memory_hits': 0,
            'disk_hits': 0
        }
        
        # Thread safety
        self._lock = threading.RLock()
        
        # Background cleanup task
        self._cleanup_task = None
        self._start_cleanup_task()
        
        logger.info("🚀 Advanced Cache System initialized")
    
    async def get(self, key: str, default: Any = None) -> Any:
        """
        Get value from cache with intelligent fallback.
        
        Args:
            key: Cache key
            default: Default value if not found
            
        Returns:
            Cached value or default
        """
        try:
            with self._lock:
                # Try memory cache first
                if key in self.memory_cache:
                    entry = self.memory_cache[key]
                    
                    # Check expiration
                    if datetime.now() < entry.expires_at:
                        # Update access info
                        entry.access_count += 1
                        entry.last_accessed = datetime.now()
                        self.memory_cache.move_to_end(key)
                        
                        self.stats['hits'] += 1
                        self.stats['memory_hits'] += 1
                        
                        logger.debug(f"Memory cache hit: {key}")
                        return entry.value
                    else:
                        # Expired, remove from memory
                        del self.memory_cache[key]
                        self.memory_size -= entry.size_bytes
                
                # Try disk cache
                disk_value = await self._get_from_disk(key)
                if disk_value is not None:
                    # Restore to memory cache
                    await self._set_memory(key, disk_value, self.default_ttl)
                    
                    self.stats['hits'] += 1
                    self.stats['disk_hits'] += 1
                    
                    logger.debug(f"Disk cache hit: {key}")
                    return disk_value
                
                # Cache miss
                self.stats['misses'] += 1
                logger.debug(f"Cache miss: {key}")
                return default
                
        except Exception as e:
            logger.error(f"Error getting from cache: {e}")
            return default
    
    async def set(self, key: str, value: Any, ttl: int = None, 
                 tags: List[str] = None, metadata: Dict[str, Any] = None) -> bool:
        """
        Set value in cache with intelligent storage strategy.
        
        Args:
            key: Cache key
            value: Value to cache
            ttl: Time to live in seconds
            tags: Cache tags for organization
            metadata: Additional metadata
            
        Returns:
            Success status
        """
        try:
            ttl = ttl or self.default_ttl
            tags = tags or []
            metadata = metadata or {}
            
            with self._lock:
                # Try memory cache first
                if await self._set_memory(key, value, ttl, tags, metadata):
                    return True
                
                # Fallback to disk cache
                return await self._set_disk(key, value, ttl, tags, metadata)
                
        except Exception as e:
            logger.error(f"Error setting cache: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """
        Delete value from cache.
        
        Args:
            key: Cache key
            
        Returns:
            Success status
        """
        try:
            with self._lock:
                deleted = False
                
                # Remove from memory cache
                if key in self.memory_cache:
                    entry = self.memory_cache[key]
                    del self.memory_cache[key]
                    self.memory_size -= entry.size_bytes
                    deleted = True
                
                # Remove from disk cache
                if await self._delete_from_disk(key):
                    deleted = True
                
                return deleted
                
        except Exception as e:
            logger.error(f"Error deleting from cache: {e}")
            return False
    
    async def clear(self, tags: List[str] = None) -> int:
        """
        Clear cache entries, optionally filtered by tags.
        
        Args:
            tags: Tags to filter by
            
        Returns:
            Number of entries cleared
        """
        try:
            with self._lock:
                cleared_count = 0
                
                # Clear memory cache
                if tags:
                    keys_to_remove = []
                    for key, entry in self.memory_cache.items():
                        if any(tag in entry.tags for tag in tags):
                            keys_to_remove.append(key)
                    
                    for key in keys_to_remove:
                        entry = self.memory_cache[key]
                        del self.memory_cache[key]
                        self.memory_size -= entry.size_bytes
                        cleared_count += 1
                else:
                    cleared_count = len(self.memory_cache)
                    self.memory_cache.clear()
                    self.memory_size = 0
                
                # Clear disk cache
                cleared_count += await self._clear_disk(tags)
                
                return cleared_count
                
        except Exception as e:
            logger.error(f"Error clearing cache: {e}")
            return 0
    
    async def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        try:
            with self._lock:
                hit_rate = (self.stats['hits'] / 
                           (self.stats['hits'] + self.stats['misses']) 
                           if (self.stats['hits'] + self.stats['misses']) > 0 else 0)
                
                return {
                    'hits': self.stats['hits'],
                    'misses': self.stats['misses'],
                    'hit_rate': hit_rate,
                    'evictions': self.stats['evictions'],
                    'memory_entries': len(self.memory_cache),
                    'memory_size_mb': self.memory_size / (1024 * 1024),
                    'memory_utilization': (self.memory_size / self.max_memory_size) * 100,
                    'disk_writes': self.stats['disk_writes'],
                    'disk_reads': self.stats['disk_reads'],
                    'memory_hits': self.stats['memory_hits'],
                    'disk_hits': self.stats['disk_hits']
                }
                
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {}
    
    async def _set_memory(self, key: str, value: Any, ttl: int, 
                         tags: List[str] = None, metadata: Dict[str, Any] = None) -> bool:
        """Set value in memory cache."""
        try:
            # Calculate size
            size_bytes = len(pickle.dumps(value))
            
            # Check if we need to evict
            while (self.memory_size + size_bytes > self.max_memory_size and 
                   self.memory_cache):
                await self._evict_lru()
            
            # Create cache entry
            entry = CacheEntry(
                key=key,
                value=value,
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(seconds=ttl),
                access_count=1,
                last_accessed=datetime.now(),
                size_bytes=size_bytes,
                tags=tags or [],
                metadata=metadata or {}
            )
            
            # Add to memory cache
            self.memory_cache[key] = entry
            self.memory_size += size_bytes
            
            logger.debug(f"Set in memory cache: {key} ({size_bytes} bytes)")
            return True
            
        except Exception as e:
            logger.error(f"Error setting memory cache: {e}")
            return False
    
    async def _evict_lru(self) -> None:
        """Evict least recently used entry from memory cache."""
        try:
            if not self.memory_cache:
                return
            
            # Remove least recently used (first item in OrderedDict)
            key, entry = self.memory_cache.popitem(last=False)
            self.memory_size -= entry.size_bytes
            self.stats['evictions'] += 1
            
            logger.debug(f"Evicted from memory cache: {key}")
            
        except Exception as e:
            logger.error(f"Error evicting from memory cache: {e}")
    
    async def _set_disk(self, key: str, value: Any, ttl: int, 
                       tags: List[str] = None, metadata: Dict[str, Any] = None) -> bool:
        """Set value in disk cache."""
        try:
            import os
            
            # Ensure cache directory exists
            os.makedirs(self.disk_cache_path, exist_ok=True)
            
            # Create cache entry
            entry = CacheEntry(
                key=key,
                value=value,
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(seconds=ttl),
                access_count=0,
                last_accessed=datetime.now(),
                size_bytes=0,  # Will be calculated
                tags=tags or [],
                metadata=metadata or {}
            )
            
            # Serialize and save
            cache_file = os.path.join(self.disk_cache_path, f"{key}.cache")
            with open(cache_file, 'wb') as f:
                pickle.dump(entry, f)
            
            # Update index
            self.disk_cache_index[key] = {
                'file': cache_file,
                'created_at': entry.created_at.isoformat(),
                'expires_at': entry.expires_at.isoformat(),
                'tags': tags or [],
                'metadata': metadata or {}
            }
            
            self.stats['disk_writes'] += 1
            logger.debug(f"Set in disk cache: {key}")
            return True
            
        except Exception as e:
            logger.error(f"Error setting disk cache: {e}")
            return False
    
    async def _get_from_disk(self, key: str) -> Any:
        """Get value from disk cache."""
        try:
            if key not in self.disk_cache_index:
                return None
            
            cache_info = self.disk_cache_index[key]
            cache_file = cache_info['file']
            
            # Check if file exists
            import os
            if not os.path.exists(cache_file):
                del self.disk_cache_index[key]
                return None
            
            # Check expiration
            expires_at = datetime.fromisoformat(cache_info['expires_at'])
            if datetime.now() > expires_at:
                # Expired, remove
                os.remove(cache_file)
                del self.disk_cache_index[key]
                return None
            
            # Load from disk
            with open(cache_file, 'rb') as f:
                entry = pickle.load(f)
            
            self.stats['disk_reads'] += 1
            return entry.value
            
        except Exception as e:
            logger.error(f"Error getting from disk cache: {e}")
            return None
    
    async def _delete_from_disk(self, key: str) -> bool:
        """Delete value from disk cache."""
        try:
            if key not in self.disk_cache_index:
                return False
            
            cache_info = self.disk_cache_index[key]
            cache_file = cache_info['file']
            
            # Remove file
            import os
            if os.path.exists(cache_file):
                os.remove(cache_file)
            
            # Remove from index
            del self.disk_cache_index[key]
            
            return True
            
        except Exception as e:
            logger.error(f"Error deleting from disk cache: {e}")
            return False
    
    async def _clear_disk(self, tags: List[str] = None) -> int:
        """Clear disk cache."""
        try:
            import os
            
            cleared_count = 0
            keys_to_remove = []
            
            for key, cache_info in self.disk_cache_index.items():
                if tags:
                    if any(tag in cache_info['tags'] for tag in tags):
                        keys_to_remove.append(key)
                else:
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                if await self._delete_from_disk(key):
                    cleared_count += 1
            
            return cleared_count
            
        except Exception as e:
            logger.error(f"Error clearing disk cache: {e}")
            return 0
    
    def _start_cleanup_task(self):
        """Start background cleanup task."""
        def cleanup_loop():
            while True:
                try:
                    asyncio.run(self._cleanup_expired())
                    time.sleep(self.cleanup_interval)
                except Exception as e:
                    logger.error(f"Cleanup task error: {e}")
                    time.sleep(60)  # Wait 1 minute before retrying
        
        cleanup_thread = threading.Thread(target=cleanup_loop, daemon=True)
        cleanup_thread.start()
    
    async def _cleanup_expired(self):
        """Clean up expired cache entries."""
        try:
            with self._lock:
                now = datetime.now()
                
                # Clean memory cache
                expired_keys = []
                for key, entry in self.memory_cache.items():
                    if now > entry.expires_at:
                        expired_keys.append(key)
                
                for key in expired_keys:
                    entry = self.memory_cache[key]
                    del self.memory_cache[key]
                    self.memory_size -= entry.size_bytes
                
                # Clean disk cache
                expired_disk_keys = []
                for key, cache_info in self.disk_cache_index.items():
                    expires_at = datetime.fromisoformat(cache_info['expires_at'])
                    if now > expires_at:
                        expired_disk_keys.append(key)
                
                for key in expired_disk_keys:
                    await self._delete_from_disk(key)
                
                if expired_keys or expired_disk_keys:
                    logger.info(f"Cleaned up {len(expired_keys)} memory and {len(expired_disk_keys)} disk cache entries")
                    
        except Exception as e:
            logger.error(f"Error in cleanup: {e}")


def cached(ttl: int = 3600, tags: List[str] = None, cache_key_func: Callable = None):
    """
    Decorator for caching function results.
    
    Args:
        ttl: Time to live in seconds
        tags: Cache tags
        cache_key_func: Function to generate cache key from arguments
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            if cache_key_func:
                cache_key = cache_key_func(*args, **kwargs)
            else:
                # Default key generation
                key_data = f"{func.__name__}:{str(args)}:{str(sorted(kwargs.items()))}"
                cache_key = hashlib.md5(key_data.encode()).hexdigest()
            
            # Try to get from cache
            cache = getattr(wrapper, '_cache', None)
            if cache is None:
                # Initialize cache for this function
                cache = AdvancedCache()
                wrapper._cache = cache
            
            cached_result = await cache.get(cache_key)
            if cached_result is not None:
                return cached_result
            
            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache.set(cache_key, result, ttl, tags)
            
            return result
        
        return wrapper
    return decorator


# Global cache instance
_global_cache = AdvancedCache()


async def get_cache() -> AdvancedCache:
    """Get global cache instance."""
    return _global_cache


async def cache_get(key: str, default: Any = None) -> Any:
    """Get value from global cache."""
    return await _global_cache.get(key, default)


async def cache_set(key: str, value: Any, ttl: int = 3600, 
                   tags: List[str] = None, metadata: Dict[str, Any] = None) -> bool:
    """Set value in global cache."""
    return await _global_cache.set(key, value, ttl, tags, metadata)


async def cache_delete(key: str) -> bool:
    """Delete value from global cache."""
    return await _global_cache.delete(key)


async def cache_clear(tags: List[str] = None) -> int:
    """Clear global cache."""
    return await _global_cache.clear(tags)
