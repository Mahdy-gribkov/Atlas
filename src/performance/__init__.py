"""
Performance Optimization Module - Production Ready
Provides advanced caching, monitoring, and response optimization.
"""

from .advanced_cache import AdvancedCache, cached, get_cache, cache_get, cache_set, cache_delete, cache_clear
from .simple_performance_monitor import (
    SimplePerformanceMonitor, record_metric, record_response_time, 
    record_error, get_performance_stats, get_health_status
)
from .response_optimizer import (
    ResponseOptimizer, OptimizationRule, ResponseCache,
    get_response_optimizer, optimize_response
)

__all__ = [
    # Advanced Cache
    'AdvancedCache',
    'cached',
    'get_cache',
    'cache_get',
    'cache_set',
    'cache_delete',
    'cache_clear',
    
    # Simple Performance Monitor
    'SimplePerformanceMonitor',
    'record_metric',
    'record_response_time',
    'record_error',
    'get_performance_stats',
    'get_health_status',
    
    # Response Optimizer
    'ResponseOptimizer',
    'OptimizationRule',
    'ResponseCache',
    'get_response_optimizer',
    'optimize_response'
]
