"""
Enhanced security utilities for the Travel AI Agent.
Includes input validation, sanitization, and monitoring.
"""

import re
import html
import logging
from typing import Dict, List, Any
import hashlib
import time

logger = logging.getLogger(__name__)

class SecurityValidator:
    """Enhanced input validation and sanitization."""
    
    def __init__(self):
        self.max_length = 2000
        self.suspicious_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<iframe[^>]*>',
            r'<object[^>]*>',
            r'<embed[^>]*>',
            r'<link[^>]*>',
            r'<meta[^>]*>',
            r'<style[^>]*>.*?</style>',
            r'expression\s*\(',
            r'url\s*\(',
            r'@import',
            r'data:text/html',
            r'vbscript:',
            r'data:image/svg\+xml',
        ]
        
        self.sql_patterns = [
            r'union\s+select',
            r'drop\s+table',
            r'delete\s+from',
            r'insert\s+into',
            r'update\s+set',
            r'alter\s+table',
            r'create\s+table',
            r'exec\s*\(',
            r'execute\s*\(',
            r'sp_',
            r'xp_',
            r'--',
            r'/\*.*?\*/',
            r';\s*drop',
            r';\s*delete',
            r';\s*insert',
            r';\s*update',
        ]
    
    def validate_message(self, message: str) -> Dict[str, Any]:
        """
        Validate and sanitize user message.
        
        Args:
            message: User input message
            
        Returns:
            Validation result with sanitized message
        """
        errors = []
        
        # Length check
        if len(message) > self.max_length:
            errors.append(f"Message too long (max {self.max_length} characters)")
            message = message[:self.max_length]
        
        # XSS detection
        for pattern in self.suspicious_patterns:
            if re.search(pattern, message, re.IGNORECASE):
                errors.append("Potentially malicious content detected")
                break
        
        # SQL injection detection
        for pattern in self.sql_patterns:
            if re.search(pattern, message, re.IGNORECASE):
                errors.append("SQL injection attempt detected")
                break
        
        # Sanitize HTML
        sanitized = html.escape(message, quote=True)
        
        # Remove excessive whitespace
        sanitized = re.sub(r'\s+', ' ', sanitized).strip()
        
        return {
            'valid': len(errors) == 0,
            'errors': errors,
            'sanitized': sanitized,
            'original_length': len(message),
            'sanitized_length': len(sanitized)
        }
    
    def validate_api_key(self, api_key: str) -> bool:
        """Validate API key format."""
        if not api_key or len(api_key) < 10:
            return False
        
        # Check for common patterns
        if re.match(r'^[a-zA-Z0-9_-]+$', api_key):
            return True
        
        return False

class SecurityMonitor:
    """Security event monitoring and logging."""
    
    def __init__(self):
        self.security_events = []
        self.blocked_ips = set()
        self.rate_limits = {}
        self.max_events = 1000
    
    def log_security_event(self, event_type: str, details: Dict[str, Any]):
        """Log security event."""
        event = {
            'timestamp': time.time(),
            'type': event_type,
            'details': details,
            'ip_hash': hashlib.md5(details.get('ip', '').encode()).hexdigest()[:8]
        }
        
        self.security_events.append(event)
        
        # Keep only recent events
        if len(self.security_events) > self.max_events:
            self.security_events = self.security_events[-self.max_events:]
        
        logger.warning(f"Security event: {event_type} - {details}")
    
    def check_rate_limit(self, identifier: str, max_requests: int = 100, window: int = 3600) -> bool:
        """Check if identifier is within rate limits."""
        current_time = time.time()
        
        if identifier not in self.rate_limits:
            self.rate_limits[identifier] = []
        
        # Clean old requests
        self.rate_limits[identifier] = [
            req_time for req_time in self.rate_limits[identifier]
            if current_time - req_time < window
        ]
        
        # Check limit
        if len(self.rate_limits[identifier]) >= max_requests:
            self.log_security_event('rate_limit_exceeded', {
                'identifier': identifier,
                'requests': len(self.rate_limits[identifier]),
                'window': window
            })
            return False
        
        # Add current request
        self.rate_limits[identifier].append(current_time)
        return True
    
    def get_security_report(self) -> Dict[str, Any]:
        """Get security monitoring report."""
        current_time = time.time()
        recent_events = [
            event for event in self.security_events
            if current_time - event['timestamp'] < 3600  # Last hour
        ]
        
        event_types = {}
        for event in recent_events:
            event_type = event['type']
            event_types[event_type] = event_types.get(event_type, 0) + 1
        
        return {
            'total_events': len(self.security_events),
            'recent_events': len(recent_events),
            'event_types': event_types,
            'blocked_ips': len(self.blocked_ips),
            'active_rate_limits': len(self.rate_limits)
        }

class InputSanitizer:
    """Advanced input sanitization."""
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for safe storage."""
        # Remove path components
        filename = filename.split('/')[-1].split('\\')[-1]
        
        # Remove dangerous characters
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
        
        # Limit length
        if len(filename) > 100:
            name, ext = filename.rsplit('.', 1) if '.' in filename else (filename, '')
            filename = name[:95] + ('.' + ext if ext else '')
        
        return filename
    
    @staticmethod
    def sanitize_url(url: str) -> str:
        """Sanitize URL for safe use."""
        # Remove dangerous protocols
        dangerous_protocols = ['javascript:', 'data:', 'vbscript:', 'file:']
        for protocol in dangerous_protocols:
            if url.lower().startswith(protocol):
                return ''
        
        # Basic URL validation
        if not re.match(r'^https?://', url):
            return ''
        
        return url[:2000]  # Limit length

# Global instances
security_validator = SecurityValidator()
security_monitor = SecurityMonitor()
input_sanitizer = InputSanitizer()