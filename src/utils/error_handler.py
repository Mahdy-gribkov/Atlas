"""
Error handling utilities for the Travel AI Agent.
Includes retry mechanisms, circuit breakers, and comprehensive error handling.
"""

import asyncio
import logging
import time
from typing import Callable, Any, Dict, Optional
from functools import wraps
import aiohttp

logger = logging.getLogger(__name__)

class ErrorHandler:
    """Comprehensive error handling with retry and circuit breaker patterns."""
    
    def __init__(self):
        self.circuit_breakers = {}
        self.error_counts = {}
        self.last_error_times = {}
    
    def get_circuit_breaker_state(self, key: str) -> str:
        """Get circuit breaker state: CLOSED, OPEN, HALF_OPEN."""
        if key not in self.circuit_breakers:
            return "CLOSED"
        return self.circuit_breakers[key]['state']
    
    def should_allow_request(self, key: str, failure_threshold: int = 5, 
                           timeout: int = 60) -> bool:
        """Check if request should be allowed through circuit breaker."""
        if key not in self.circuit_breakers:
            self.circuit_breakers[key] = {
                'state': 'CLOSED',
                'failure_count': 0,
                'last_failure_time': 0
            }
        
        breaker = self.circuit_breakers[key]
        current_time = time.time()
        
        if breaker['state'] == 'OPEN':
            if current_time - breaker['last_failure_time'] > timeout:
                breaker['state'] = 'HALF_OPEN'
                return True
            return False
        
        return True
    
    def record_success(self, key: str):
        """Record successful request."""
        if key in self.circuit_breakers:
            self.circuit_breakers[key]['state'] = 'CLOSED'
            self.circuit_breakers[key]['failure_count'] = 0
    
    def record_failure(self, key: str, failure_threshold: int = 5):
        """Record failed request."""
        if key not in self.circuit_breakers:
            self.circuit_breakers[key] = {
                'state': 'CLOSED',
                'failure_count': 0,
                'last_failure_time': 0
            }
        
        breaker = self.circuit_breakers[key]
        breaker['failure_count'] += 1
        breaker['last_failure_time'] = time.time()
        
        if breaker['failure_count'] >= failure_threshold:
            breaker['state'] = 'OPEN'
            logger.warning(f"Circuit breaker OPEN for {key}")

# Global error handler
error_handler = ErrorHandler()

# Configuration constants
API_RETRY_CONFIG = {
    'max_retries': 3,
    'base_delay': 1.0,
    'max_delay': 10.0,
    'exponential_base': 2.0,
    'jitter': True
}

API_CIRCUIT_BREAKER_CONFIG = {
    'failure_threshold': 5,
    'timeout': 60,
    'expected_exception': Exception
}

DATABASE_RETRY_CONFIG = {
    'max_retries': 2,
    'base_delay': 0.5,
    'max_delay': 5.0,
    'exponential_base': 2.0,
    'jitter': True
}

DATABASE_CIRCUIT_BREAKER_CONFIG = {
    'failure_threshold': 3,
    'timeout': 30,
    'expected_exception': Exception
}

def retry_async(max_retries: int = 3, base_delay: float = 1.0, 
                max_delay: float = 10.0, exponential_base: float = 2.0,
                jitter: bool = True, exceptions: tuple = (Exception,)):
    """
    Async retry decorator with exponential backoff.
    
    Args:
        max_retries: Maximum number of retry attempts
        base_delay: Base delay between retries in seconds
        max_delay: Maximum delay between retries
        exponential_base: Base for exponential backoff
        jitter: Add random jitter to delay
        exceptions: Tuple of exceptions to retry on
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    
                    if attempt == max_retries:
                        logger.error(f"Function {func.__name__} failed after {max_retries} retries: {e}")
                        raise e
                    
                    # Calculate delay with exponential backoff
                    delay = min(base_delay * (exponential_base ** attempt), max_delay)
                    
                    if jitter:
                        import random
                        delay *= (0.5 + random.random() * 0.5)
                    
                    logger.warning(f"Function {func.__name__} failed (attempt {attempt + 1}/{max_retries + 1}): {e}. Retrying in {delay:.2f}s")
                    await asyncio.sleep(delay)
            
            raise last_exception
        return wrapper
    return decorator

def circuit_breaker_async(failure_threshold: int = 5, timeout: int = 60,
                         expected_exception: type = Exception):
    """
    Async circuit breaker decorator.
    
    Args:
        failure_threshold: Number of failures before opening circuit
        timeout: Time to wait before trying again
        expected_exception: Exception type to count as failures
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            key = f"{func.__module__}.{func.__name__}"
            
            if not error_handler.should_allow_request(key, failure_threshold, timeout):
                raise Exception(f"Circuit breaker is OPEN for {key}")
            
            try:
                result = await func(*args, **kwargs)
                error_handler.record_success(key)
                return result
            except expected_exception as e:
                error_handler.record_failure(key, failure_threshold)
                raise e
        return wrapper
    return decorator

class AsyncTimeout:
    """Async timeout context manager."""
    
    def __init__(self, timeout: float):
        self.timeout = timeout
        self.task = None
    
    async def __aenter__(self):
        self.task = asyncio.current_task()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.task and not self.task.done():
            self.task.cancel()

async def safe_api_call(url: str, session: aiohttp.ClientSession, 
                       timeout: float = 10.0, **kwargs) -> Optional[Dict[str, Any]]:
    """
    Make a safe API call with timeout and error handling.
    
    Args:
        url: API endpoint URL
        session: aiohttp session
        timeout: Request timeout
        **kwargs: Additional request parameters
        
    Returns:
        Response data or None if failed
    """
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=timeout), **kwargs) as response:
            if response.status == 200:
                return await response.json()
            else:
                logger.warning(f"API call failed with status {response.status}: {url}")
                return None
    except asyncio.TimeoutError:
        logger.warning(f"API call timeout: {url}")
        return None
    except Exception as e:
        logger.error(f"API call error: {url} - {e}")
        return None

def handle_errors(func: Callable) -> Callable:
    """Generic error handling decorator."""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {e}")
            raise
    return wrapper