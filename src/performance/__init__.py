"""
Performance Optimization Module - Production Ready
Provides advanced caching, monitoring, and response optimization.
"""

from .advanced_cache import AdvancedCache, cached, get_cache, cache_get, cache_set, cache_delete, cache_clear
from .performance_monitor import (
    PerformanceMonitor, PerformanceMetric, PerformanceAlert,
    get_performance_monitor, record_metric, record_response_time, 
    record_error, performance_timer
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
    
    # Performance Monitor
    'PerformanceMonitor',
    'PerformanceMetric',
    'PerformanceAlert',
    'get_performance_monitor',
    'record_metric',
    'record_response_time',
    'record_error',
    'performance_timer',
    
    # Response Optimizer
    'ResponseOptimizer',
    'OptimizationRule',
    'ResponseCache',
    'get_response_optimizer',
    'optimize_response'
]
