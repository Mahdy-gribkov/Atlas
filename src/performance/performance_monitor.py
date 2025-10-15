"""
Performance Monitoring System - Production Ready
Provides comprehensive performance monitoring and optimization.
"""

import asyncio
import time
import logging
import psutil
import threading
from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from collections import defaultdict, deque
import json

logger = logging.getLogger(__name__)


@dataclass
class PerformanceMetric:
    """Represents a performance metric."""
    name: str
    value: float
    timestamp: datetime
    tags: Dict[str, str]
    metadata: Dict[str, Any]


@dataclass
class PerformanceAlert:
    """Represents a performance alert."""
    alert_type: str
    message: str
    severity: str  # 'low', 'medium', 'high', 'critical'
    timestamp: datetime
    metric_name: str
    threshold: float
    actual_value: float
    metadata: Dict[str, Any]


class PerformanceMonitor:
    """
    Comprehensive performance monitoring system.
    Tracks system metrics, application performance, and provides alerts.
    """
    
    def __init__(self, alert_thresholds: Dict[str, float] = None):
        self.alert_thresholds = alert_thresholds or {
            'cpu_usage': 80.0,
            'memory_usage': 85.0,
            'response_time': 5.0,
            'error_rate': 5.0,
            'cache_hit_rate': 70.0
        }
        
        # Metrics storage
        self.metrics: Dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
        self.alerts: List[PerformanceAlert] = []
        
        # Performance tracking
        self.response_times: deque = deque(maxlen=1000)
        self.error_counts: Dict[str, int] = defaultdict(int)
        self.request_counts: Dict[str, int] = defaultdict(int)
        
        # System monitoring
        self.system_metrics = {
            'cpu_usage': 0.0,
            'memory_usage': 0.0,
            'disk_usage': 0.0,
            'network_io': {'bytes_sent': 0, 'bytes_recv': 0},
            'process_count': 0
        }
        
        # Monitoring state
        self.monitoring = False
        self.monitor_task = None
        self._lock = threading.Lock()
        
        # Callbacks for alerts
        self.alert_callbacks: List[Callable] = []
        
        logger.info("📊 Performance Monitor initialized")
    
    async def start_monitoring(self, interval: int = 30):
        """
        Start performance monitoring.
        
        Args:
            interval: Monitoring interval in seconds
        """
        if self.monitoring:
            return
        
        self.monitoring = True
        self.monitor_task = asyncio.create_task(self._monitoring_loop(interval))
        logger.info(f"📊 Performance monitoring started (interval: {interval}s)")
    
    async def stop_monitoring(self):
        """Stop performance monitoring."""
        if not self.monitoring:
            return
        
        self.monitoring = False
        if self.monitor_task:
            self.monitor_task.cancel()
            try:
                await self.monitor_task
            except asyncio.CancelledError:
                pass
        
        logger.info("📊 Performance monitoring stopped")
    
    async def record_metric(self, name: str, value: float, tags: Dict[str, str] = None, 
                          metadata: Dict[str, Any] = None):
        """
        Record a performance metric.
        
        Args:
            name: Metric name
            value: Metric value
            tags: Metric tags
            metadata: Additional metadata
        """
        try:
            metric = PerformanceMetric(
                name=name,
                value=value,
                timestamp=datetime.now(),
                tags=tags or {},
                metadata=metadata or {}
            )
            
            with self._lock:
                self.metrics[name].append(metric)
            
            # Check for alerts
            await self._check_alerts(metric)
            
        except Exception as e:
            logger.error(f"Error recording metric: {e}")
    
    async def record_response_time(self, operation: str, duration: float, 
                                 success: bool = True, metadata: Dict[str, Any] = None):
        """
        Record response time for an operation.
        
        Args:
            operation: Operation name
            duration: Duration in seconds
            success: Whether operation was successful
            metadata: Additional metadata
        """
        try:
            # Record response time
            self.response_times.append({
                'operation': operation,
                'duration': duration,
                'success': success,
                'timestamp': datetime.now(),
                'metadata': metadata or {}
            })
            
            # Update request counts
            with self._lock:
                self.request_counts[operation] += 1
                if not success:
                    self.error_counts[operation] += 1
            
            # Record as metric
            await self.record_metric(
                f"response_time_{operation}",
                duration,
                {'operation': operation, 'success': str(success)},
                metadata
            )
            
        except Exception as e:
            logger.error(f"Error recording response time: {e}")
    
    async def record_error(self, operation: str, error: str, metadata: Dict[str, Any] = None):
        """
        Record an error.
        
        Args:
            operation: Operation name
            error: Error message
            metadata: Additional metadata
        """
        try:
            with self._lock:
                self.error_counts[operation] += 1
            
            await self.record_metric(
                f"error_{operation}",
                1.0,
                {'operation': operation, 'error': error},
                metadata
            )
            
        except Exception as e:
            logger.error(f"Error recording error: {e}")
    
    async def get_metrics(self, name: str = None, 
                         start_time: datetime = None, 
                         end_time: datetime = None) -> List[PerformanceMetric]:
        """
        Get performance metrics.
        
        Args:
            name: Metric name filter
            start_time: Start time filter
            end_time: End time filter
            
        Returns:
            List of matching metrics
        """
        try:
            with self._lock:
                if name:
                    metrics = list(self.metrics.get(name, []))
                else:
                    metrics = []
                    for metric_list in self.metrics.values():
                        metrics.extend(metric_list)
                
                # Apply time filters
                if start_time:
                    metrics = [m for m in metrics if m.timestamp >= start_time]
                if end_time:
                    metrics = [m for m in metrics if m.timestamp <= end_time]
                
                return sorted(metrics, key=lambda m: m.timestamp)
                
        except Exception as e:
            logger.error(f"Error getting metrics: {e}")
            return []
    
    async def get_performance_summary(self) -> Dict[str, Any]:
        """
        Get performance summary.
        
        Returns:
            Performance summary dictionary
        """
        try:
            with self._lock:
                # Calculate response time statistics
                if self.response_times:
                    durations = [rt['duration'] for rt in self.response_times]
                    avg_response_time = sum(durations) / len(durations)
                    max_response_time = max(durations)
                    min_response_time = min(durations)
                else:
                    avg_response_time = max_response_time = min_response_time = 0.0
                
                # Calculate error rates
                total_requests = sum(self.request_counts.values())
                total_errors = sum(self.error_counts.values())
                error_rate = (total_errors / total_requests * 100) if total_requests > 0 else 0.0
                
                # Get recent metrics (last hour)
                recent_time = datetime.now() - timedelta(hours=1)
                recent_metrics = await self.get_metrics(start_time=recent_time)
                
                # Calculate metric averages
                metric_averages = {}
                for metric in recent_metrics:
                    if metric.name not in metric_averages:
                        metric_averages[metric.name] = []
                    metric_averages[metric.name].append(metric.value)
                
                for name, values in metric_averages.items():
                    metric_averages[name] = sum(values) / len(values)
                
                return {
                    'timestamp': datetime.now().isoformat(),
                    'system_metrics': self.system_metrics,
                    'response_times': {
                        'average': avg_response_time,
                        'maximum': max_response_time,
                        'minimum': min_response_time,
                        'count': len(self.response_times)
                    },
                    'error_rates': {
                        'overall': error_rate,
                        'by_operation': dict(self.error_counts)
                    },
                    'request_counts': dict(self.request_counts),
                    'metric_averages': metric_averages,
                    'alerts_count': len(self.alerts),
                    'monitoring_active': self.monitoring
                }
                
        except Exception as e:
            logger.error(f"Error getting performance summary: {e}")
            return {}
    
    async def get_alerts(self, severity: str = None) -> List[PerformanceAlert]:
        """
        Get performance alerts.
        
        Args:
            severity: Severity filter
            
        Returns:
            List of alerts
        """
        try:
            with self._lock:
                alerts = list(self.alerts)
                
                if severity:
                    alerts = [a for a in alerts if a.severity == severity]
                
                return sorted(alerts, key=lambda a: a.timestamp, reverse=True)
                
        except Exception as e:
            logger.error(f"Error getting alerts: {e}")
            return []
    
    async def add_alert_callback(self, callback: Callable[[PerformanceAlert], None]):
        """
        Add alert callback.
        
        Args:
            callback: Callback function for alerts
        """
        self.alert_callbacks.append(callback)
    
    async def _monitoring_loop(self, interval: int):
        """Main monitoring loop."""
        while self.monitoring:
            try:
                await self._collect_system_metrics()
                await asyncio.sleep(interval)
            except Exception as e:
                logger.error(f"Monitoring loop error: {e}")
                await asyncio.sleep(interval)
    
    async def _collect_system_metrics(self):
        """Collect system metrics."""
        try:
            # CPU usage
            cpu_usage = psutil.cpu_percent(interval=1)
            
            # Memory usage
            memory = psutil.virtual_memory()
            memory_usage = memory.percent
            
            # Disk usage
            disk = psutil.disk_usage('/')
            disk_usage = (disk.used / disk.total) * 100
            
            # Network I/O
            network = psutil.net_io_counters()
            network_io = {
                'bytes_sent': network.bytes_sent,
                'bytes_recv': network.bytes_recv
            }
            
            # Process count
            process_count = len(psutil.pids())
            
            # Update system metrics
            self.system_metrics.update({
                'cpu_usage': cpu_usage,
                'memory_usage': memory_usage,
                'disk_usage': disk_usage,
                'network_io': network_io,
                'process_count': process_count
            })
            
            # Record as metrics
            await self.record_metric('cpu_usage', cpu_usage)
            await self.record_metric('memory_usage', memory_usage)
            await self.record_metric('disk_usage', disk_usage)
            await self.record_metric('process_count', process_count)
            
        except Exception as e:
            logger.error(f"Error collecting system metrics: {e}")
    
    async def _check_alerts(self, metric: PerformanceMetric):
        """Check for performance alerts."""
        try:
            threshold = self.alert_thresholds.get(metric.name)
            if threshold is None:
                return
            
            # Determine severity
            if metric.value >= threshold * 1.5:
                severity = 'critical'
            elif metric.value >= threshold * 1.2:
                severity = 'high'
            elif metric.value >= threshold:
                severity = 'medium'
            else:
                return  # No alert needed
            
            # Create alert
            alert = PerformanceAlert(
                alert_type='threshold_exceeded',
                message=f"{metric.name} exceeded threshold: {metric.value:.2f} > {threshold:.2f}",
                severity=severity,
                timestamp=datetime.now(),
                metric_name=metric.name,
                threshold=threshold,
                actual_value=metric.value,
                metadata=metric.metadata
            )
            
            # Add to alerts
            with self._lock:
                self.alerts.append(alert)
                # Keep only recent alerts
                if len(self.alerts) > 1000:
                    self.alerts = self.alerts[-1000:]
            
            # Call alert callbacks
            for callback in self.alert_callbacks:
                try:
                    if asyncio.iscoroutinefunction(callback):
                        await callback(alert)
                    else:
                        callback(alert)
                except Exception as e:
                    logger.error(f"Alert callback error: {e}")
            
            logger.warning(f"Performance alert: {alert.message}")
            
        except Exception as e:
            logger.error(f"Error checking alerts: {e}")


# Global performance monitor instance
_global_monitor = PerformanceMonitor()


async def get_performance_monitor() -> PerformanceMonitor:
    """Get global performance monitor instance."""
    return _global_monitor


async def record_metric(name: str, value: float, tags: Dict[str, str] = None, 
                       metadata: Dict[str, Any] = None):
    """Record a metric in the global monitor."""
    await _global_monitor.record_metric(name, value, tags, metadata)


async def record_response_time(operation: str, duration: float, 
                             success: bool = True, metadata: Dict[str, Any] = None):
    """Record response time in the global monitor."""
    await _global_monitor.record_response_time(operation, duration, success, metadata)


async def record_error(operation: str, error: str, metadata: Dict[str, Any] = None):
    """Record an error in the global monitor."""
    await _global_monitor.record_error(operation, error, metadata)


def performance_timer(operation_name: str):
    """
    Decorator for timing function execution.
    
    Args:
        operation_name: Name of the operation being timed
    """
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            success = True
            error = None
            
            try:
                if asyncio.iscoroutinefunction(func):
                    result = await func(*args, **kwargs)
                else:
                    result = func(*args, **kwargs)
                return result
            except Exception as e:
                success = False
                error = str(e)
                await record_error(operation_name, error)
                raise
            finally:
                duration = time.time() - start_time
                await record_response_time(operation_name, duration, success)
        
        return wrapper
    return decorator
