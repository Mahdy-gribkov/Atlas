"""
Health monitoring system for the Travel AI Agent.
Provides comprehensive health checks and monitoring.
"""

import asyncio
import logging
import time
import psutil
import os
from typing import Dict, Any, List
from datetime import datetime, timedelta
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class HealthCheck:
    """Represents a health check result."""
    name: str
    status: str  # 'healthy', 'degraded', 'unhealthy'
    message: str
    response_time: float
    timestamp: datetime
    details: Dict[str, Any] = None

class HealthMonitor:
    """Comprehensive health monitoring system."""
    
    def __init__(self):
        self.health_checks = []
        self.start_time = time.time()
        self.check_history = []
        
    async def run_all_checks(self) -> List[HealthCheck]:
        """Run all health checks."""
        checks = []
        
        # System health checks
        checks.append(await self._check_system_resources())
        checks.append(await self._check_database_connection())
        checks.append(await self._check_api_endpoints())
        checks.append(await self._check_cache_health())
        checks.append(await self._check_disk_space())
        checks.append(await self._check_memory_usage())
        
        self.health_checks = checks
        self.check_history.append({
            'timestamp': datetime.now(),
            'checks': checks
        })
        
        # Keep only last 100 check results
        if len(self.check_history) > 100:
            self.check_history = self.check_history[-100:]
        
        return checks
    
    async def _check_system_resources(self) -> HealthCheck:
        """Check system resource usage."""
        start_time = time.time()
        
        try:
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            # Determine status based on thresholds
            if cpu_percent > 90 or memory.percent > 90 or disk.percent > 90:
                status = 'unhealthy'
                message = f"High resource usage: CPU {cpu_percent}%, Memory {memory.percent}%, Disk {disk.percent}%"
            elif cpu_percent > 70 or memory.percent > 70 or disk.percent > 70:
                status = 'degraded'
                message = f"Elevated resource usage: CPU {cpu_percent}%, Memory {memory.percent}%, Disk {disk.percent}%"
            else:
                status = 'healthy'
                message = f"System resources normal: CPU {cpu_percent}%, Memory {memory.percent}%, Disk {disk.percent}%"
            
            return HealthCheck(
                name='system_resources',
                status=status,
                message=message,
                response_time=time.time() - start_time,
                timestamp=datetime.now(),
                details={
                    'cpu_percent': cpu_percent,
                    'memory_percent': memory.percent,
                    'disk_percent': disk.percent,
                    'memory_available_gb': memory.available / (1024**3),
                    'disk_free_gb': disk.free / (1024**3)
                }
            )
            
        except Exception as e:
            return HealthCheck(
                name='system_resources',
                status='unhealthy',
                message=f"Failed to check system resources: {str(e)}",
                response_time=time.time() - start_time,
                timestamp=datetime.now()
            )
    
    async def _check_database_connection(self) -> HealthCheck:
        """Check database connectivity."""
        start_time = time.time()
        
        try:
            from ..database.secure_database import SecureDatabase
            
            db = SecureDatabase()
            # Test database connection
            await db._ensure_connection()
            
            # Get database stats
            stats = await db.get_database_stats()
            
            return HealthCheck(
                name='database_connection',
                status='healthy',
                message='Database connection successful',
                response_time=time.time() - start_time,
                timestamp=datetime.now(),
                details=stats
            )
            
        except Exception as e:
            return HealthCheck(
                name='database_connection',
                status='unhealthy',
                message=f"Database connection failed: {str(e)}",
                response_time=time.time() - start_time,
                timestamp=datetime.now()
            )
    
    async def _check_api_endpoints(self) -> HealthCheck:
        """Check external API endpoints."""
        start_time = time.time()
        
        try:
            import aiohttp
            
            # Test a few key APIs
            api_tests = [
                ('OpenWeatherMap', 'https://api.openweathermap.org/data/2.5/weather?q=London&appid=test'),
                ('Wikipedia', 'https://en.wikipedia.org/api/rest_v1/page/summary/London'),
                ('OpenStreetMap', 'https://nominatim.openstreetmap.org/search?q=London&format=json&limit=1')
            ]
            
            results = []
            async with aiohttp.ClientSession() as session:
                for name, url in api_tests:
                    try:
                        async with session.get(url, timeout=aiohttp.ClientTimeout(total=5)) as response:
                            if response.status in [200, 401]:  # 401 is OK for API key tests
                                results.append(f"{name}: OK")
                            else:
                                results.append(f"{name}: Status {response.status}")
                    except Exception as e:
                        results.append(f"{name}: Error - {str(e)}")
            
            healthy_count = len([r for r in results if 'OK' in r])
            total_count = len(results)
            
            if healthy_count == total_count:
                status = 'healthy'
                message = f"All {total_count} API endpoints accessible"
            elif healthy_count > total_count // 2:
                status = 'degraded'
                message = f"{healthy_count}/{total_count} API endpoints accessible"
            else:
                status = 'unhealthy'
                message = f"Only {healthy_count}/{total_count} API endpoints accessible"
            
            return HealthCheck(
                name='api_endpoints',
                status=status,
                message=message,
                response_time=time.time() - start_time,
                timestamp=datetime.now(),
                details={'results': results}
            )
            
        except Exception as e:
            return HealthCheck(
                name='api_endpoints',
                status='unhealthy',
                message=f"API endpoint check failed: {str(e)}",
                response_time=time.time() - start_time,
                timestamp=datetime.now()
            )
    
    async def _check_cache_health(self) -> HealthCheck:
        """Check cache system health."""
        start_time = time.time()
        
        try:
            from ..utils.cache_manager import cache_manager
            
            # Get cache statistics
            stats = cache_manager.get_all_stats()
            
            # Check if caches are working
            test_cache = cache_manager.get_cache('health_test', max_size=10, default_ttl=60)
            await test_cache.set('test_key', 'test_value')
            test_value = await test_cache.get('test_key')
            
            if test_value == 'test_value':
                status = 'healthy'
                message = 'Cache system operational'
            else:
                status = 'degraded'
                message = 'Cache system has issues'
            
            return HealthCheck(
                name='cache_health',
                status=status,
                message=message,
                response_time=time.time() - start_time,
                timestamp=datetime.now(),
                details=stats
            )
            
        except Exception as e:
            return HealthCheck(
                name='cache_health',
                status='unhealthy',
                message=f"Cache health check failed: {str(e)}",
                response_time=time.time() - start_time,
                timestamp=datetime.now()
            )
    
    async def _check_disk_space(self) -> HealthCheck:
        """Check disk space availability."""
        start_time = time.time()
        
        try:
            disk = psutil.disk_usage('/')
            free_gb = disk.free / (1024**3)
            total_gb = disk.total / (1024**3)
            used_percent = (disk.used / disk.total) * 100
            
            if free_gb < 1:  # Less than 1GB free
                status = 'unhealthy'
                message = f"Critical: Only {free_gb:.1f}GB free disk space"
            elif free_gb < 5:  # Less than 5GB free
                status = 'degraded'
                message = f"Warning: Only {free_gb:.1f}GB free disk space"
            else:
                status = 'healthy'
                message = f"Disk space OK: {free_gb:.1f}GB free ({used_percent:.1f}% used)"
            
            return HealthCheck(
                name='disk_space',
                status=status,
                message=message,
                response_time=time.time() - start_time,
                timestamp=datetime.now(),
                details={
                    'free_gb': free_gb,
                    'total_gb': total_gb,
                    'used_percent': used_percent
                }
            )
            
        except Exception as e:
            return HealthCheck(
                name='disk_space',
                status='unhealthy',
                message=f"Disk space check failed: {str(e)}",
                response_time=time.time() - start_time,
                timestamp=datetime.now()
            )
    
    async def _check_memory_usage(self) -> HealthCheck:
        """Check memory usage."""
        start_time = time.time()
        
        try:
            memory = psutil.virtual_memory()
            available_gb = memory.available / (1024**3)
            used_percent = memory.percent
            
            if available_gb < 0.5:  # Less than 500MB available
                status = 'unhealthy'
                message = f"Critical: Only {available_gb:.1f}GB available memory"
            elif available_gb < 1:  # Less than 1GB available
                status = 'degraded'
                message = f"Warning: Only {available_gb:.1f}GB available memory"
            else:
                status = 'healthy'
                message = f"Memory OK: {available_gb:.1f}GB available ({used_percent:.1f}% used)"
            
            return HealthCheck(
                name='memory_usage',
                status=status,
                message=message,
                response_time=time.time() - start_time,
                timestamp=datetime.now(),
                details={
                    'available_gb': available_gb,
                    'used_percent': used_percent,
                    'total_gb': memory.total / (1024**3)
                }
            )
            
        except Exception as e:
            return HealthCheck(
                name='memory_usage',
                status='unhealthy',
                message=f"Memory usage check failed: {str(e)}",
                response_time=time.time() - start_time,
                timestamp=datetime.now()
            )
    
    def get_overall_health(self) -> Dict[str, Any]:
        """Get overall system health status."""
        if not self.health_checks:
            return {
                'status': 'unknown',
                'message': 'No health checks performed',
                'timestamp': datetime.now().isoformat()
            }
        
        # Count statuses
        status_counts = {}
        for check in self.health_checks:
            status_counts[check.status] = status_counts.get(check.status, 0) + 1
        
        # Determine overall status
        if status_counts.get('unhealthy', 0) > 0:
            overall_status = 'unhealthy'
        elif status_counts.get('degraded', 0) > 0:
            overall_status = 'degraded'
        else:
            overall_status = 'healthy'
        
        # Calculate uptime
        uptime_seconds = time.time() - self.start_time
        uptime_hours = uptime_seconds / 3600
        
        return {
            'status': overall_status,
            'message': f"System is {overall_status}",
            'timestamp': datetime.now().isoformat(),
            'uptime_hours': round(uptime_hours, 2),
            'check_counts': status_counts,
            'total_checks': len(self.health_checks)
        }
    
    def get_health_summary(self) -> Dict[str, Any]:
        """Get a summary of health check results."""
        overall = self.get_overall_health()
        
        return {
            'overall': overall,
            'checks': [
                {
                    'name': check.name,
                    'status': check.status,
                    'message': check.message,
                    'response_time': check.response_time,
                    'timestamp': check.timestamp.isoformat(),
                    'details': check.details
                }
                for check in self.health_checks
            ]
        }

# Global health monitor instance
health_monitor = HealthMonitor()
