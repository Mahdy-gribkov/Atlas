"""
Simple Performance Monitor - Practical and Lightweight
Provides essential performance monitoring without over-engineering.
"""

import time
import logging
import threading
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from collections import defaultdict, deque
import json

logger = logging.getLogger(__name__)


class SimplePerformanceMonitor:
    """
    Simple, practical performance monitoring.
    
    Tracks essential metrics without over-engineering:
    - Response times
    - API call counts
    - Error rates
    - Memory usage (if available)
    """
    
    def __init__(self, max_history: int = 1000):
        """Initialize the performance monitor."""
        self.max_history = max_history
        self.metrics = defaultdict(lambda: deque(maxlen=max_history))
        self.counters = defaultdict(int)
        self.lock = threading.Lock()
        
        # Track response times
        self.response_times = deque(maxlen=max_history)
        
        # Track API calls
        self.api_calls = defaultdict(int)
        self.api_errors = defaultdict(int)
        
        # Track system metrics
        self.start_time = time.time()
        self.last_cleanup = time.time()
        
        logger.info("Simple Performance Monitor initialized")
    
    def record_response_time(self, endpoint: str, duration: float):
        """Record response time for an endpoint."""
        with self.lock:
            self.response_times.append({
                'endpoint': endpoint,
                'duration': duration,
                'timestamp': datetime.now().isoformat()
            })
            self.counters['total_requests'] += 1
    
    def record_api_call(self, service: str, success: bool = True):
        """Record an API call."""
        with self.lock:
            self.api_calls[service] += 1
            if not success:
                self.api_errors[service] += 1
            self.counters['total_api_calls'] += 1
    
    def record_error(self, error_type: str, message: str = ""):
        """Record an error."""
        with self.lock:
            self.counters[f'errors_{error_type}'] += 1
            self.counters['total_errors'] += 1
            
            # Log significant errors
            if self.counters[f'errors_{error_type}'] % 10 == 0:
                logger.warning(f"Error threshold reached: {error_type} ({self.counters[f'errors_{error_type}']} total)")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get current performance statistics."""
        with self.lock:
            uptime = time.time() - self.start_time
            
            # Calculate response time statistics
            if self.response_times:
                durations = [rt['duration'] for rt in self.response_times]
                avg_response_time = sum(durations) / len(durations)
                max_response_time = max(durations)
                min_response_time = min(durations)
            else:
                avg_response_time = max_response_time = min_response_time = 0
            
            # Calculate API error rates
            api_stats = {}
            for service in self.api_calls:
                total_calls = self.api_calls[service]
                errors = self.api_errors.get(service, 0)
                error_rate = (errors / total_calls * 100) if total_calls > 0 else 0
                
                api_stats[service] = {
                    'total_calls': total_calls,
                    'errors': errors,
                    'error_rate': round(error_rate, 2)
                }
            
            return {
                'uptime_seconds': round(uptime, 2),
                'total_requests': self.counters['total_requests'],
                'total_api_calls': self.counters['total_api_calls'],
                'total_errors': self.counters['total_errors'],
                'response_times': {
                    'average': round(avg_response_time, 3),
                    'max': round(max_response_time, 3),
                    'min': round(min_response_time, 3),
                    'count': len(self.response_times)
                },
                'api_stats': api_stats,
                'timestamp': datetime.now().isoformat()
            }
    
    def get_health_status(self) -> Dict[str, Any]:
        """Get system health status."""
        stats = self.get_stats()
        
        # Simple health checks
        health_issues = []
        
        # Check response times
        if stats['response_times']['average'] > 5.0:
            health_issues.append("High average response time")
        
        # Check error rates
        if stats['total_errors'] > stats['total_requests'] * 0.1:  # More than 10% error rate
            health_issues.append("High error rate")
        
        # Check API error rates
        for service, api_stat in stats['api_stats'].items():
            if api_stat['error_rate'] > 20:  # More than 20% API error rate
                health_issues.append(f"High API error rate for {service}")
        
        health_status = "healthy" if not health_issues else "degraded"
        if len(health_issues) > 3:
            health_status = "unhealthy"
        
        return {
            'status': health_status,
            'issues': health_issues,
            'uptime': stats['uptime_seconds'],
            'timestamp': datetime.now().isoformat()
        }
    
    def cleanup_old_data(self):
        """Clean up old data to prevent memory leaks."""
        current_time = time.time()
        if current_time - self.last_cleanup > 3600:  # Cleanup every hour
            with self.lock:
                # Remove old response times (older than 24 hours)
                cutoff_time = current_time - 86400
                self.response_times = deque([
                    rt for rt in self.response_times 
                    if datetime.fromisoformat(rt['timestamp']).timestamp() > cutoff_time
                ], maxlen=self.max_history)
                
                self.last_cleanup = current_time
                logger.info("Performance monitor data cleaned up")
    
    def reset_stats(self):
        """Reset all statistics."""
        with self.lock:
            self.metrics.clear()
            self.counters.clear()
            self.response_times.clear()
            self.api_calls.clear()
            self.api_errors.clear()
            self.start_time = time.time()
            logger.info("Performance monitor stats reset")


# Global instance
performance_monitor = SimplePerformanceMonitor()


def record_response_time(endpoint: str, duration: float):
    """Record response time for an endpoint."""
    performance_monitor.record_response_time(endpoint, duration)


def record_metric(metric_name: str, value: float, tags: Dict[str, str] = None):
    """Record a custom metric."""
    # For simplicity, we'll just log it
    logger.info(f"Metric recorded: {metric_name}={value}, tags={tags}")


def record_api_call(service: str, success: bool = True):
    """Record an API call."""
    performance_monitor.record_api_call(service, success)


def record_error(error_type: str, message: str = ""):
    """Record an error."""
    performance_monitor.record_error(error_type, message)


def get_performance_stats() -> Dict[str, Any]:
    """Get current performance statistics."""
    return performance_monitor.get_stats()


def get_health_status() -> Dict[str, Any]:
    """Get system health status."""
    return performance_monitor.get_health_status()


def performance_timer(endpoint: str):
    """Decorator for timing function execution."""
    def decorator(func):
        import functools
        import time
        import asyncio
        
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                record_response_time(endpoint, duration)
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                record_response_time(endpoint, duration)
        
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator
