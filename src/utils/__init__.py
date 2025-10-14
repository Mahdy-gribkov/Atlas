"""
Utility modules for the Travel AI Agent.
Includes error handling, caching, security, and performance optimization.
"""

from .error_handler import (
    retry_async,
    circuit_breaker_async,
    API_RETRY_CONFIG,
    API_CIRCUIT_BREAKER_CONFIG,
    DATABASE_RETRY_CONFIG,
    DATABASE_CIRCUIT_BREAKER_CONFIG,
    ErrorHandler
)

from .cache_manager import (
    LRUCache,
    CacheManager,
    PersistentCache,
    cached,
    cache_manager,
    API_CACHE,
    DATABASE_CACHE,
    RESPONSE_CACHE
)

from .security import (
    SecurityValidator,
    SecurityMonitor,
    InputSanitizer,
    security_validator,
    security_monitor,
    input_sanitizer
)

from .performance import (
    PerformanceOptimizer,
    optimize_response,
    batch_api_calls,
    compress_context,
    ResponseCache,
    performance_optimizer,
    response_cache
)

__all__ = [
    # Error handling
    'retry_async',
    'circuit_breaker_async',
    'API_RETRY_CONFIG',
    'API_CIRCUIT_BREAKER_CONFIG',
    'DATABASE_RETRY_CONFIG',
    'DATABASE_CIRCUIT_BREAKER_CONFIG',
    'ErrorHandler',
    
    # Caching
    'LRUCache',
    'CacheManager',
    'PersistentCache',
    'cached',
    'cache_manager',
    'API_CACHE',
    'DATABASE_CACHE',
    'RESPONSE_CACHE',
    
    # Security
    'SecurityValidator',
    'SecurityMonitor',
    'InputSanitizer',
    'security_validator',
    'security_monitor',
    'input_sanitizer',
    
    # Performance
    'PerformanceOptimizer',
    'optimize_response',
    'batch_api_calls',
    'compress_context',
    'ResponseCache',
    'performance_optimizer',
    'response_cache'
]