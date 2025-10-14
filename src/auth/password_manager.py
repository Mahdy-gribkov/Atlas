"""
Password management utilities for secure authentication.
"""

import hashlib
import secrets
import string
from typing import Tuple

class PasswordManager:
    """Secure password management with hashing and validation."""
    
    @staticmethod
    def hash_password(password: str, salt: str = None) -> Tuple[str, str]:
        """
        Hash a password using PBKDF2 with a random salt.
        
        Args:
            password: Plain text password
            salt: Optional salt (generated if not provided)
            
        Returns:
            Tuple of (hashed_password, salt)
        """
        if salt is None:
            salt = secrets.token_hex(32)
        
        # Use PBKDF2 with SHA-256
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000  # 100,000 iterations
        )
        
        return password_hash.hex(), salt
    
    @staticmethod
    def verify_password(password: str, hashed_password: str, salt: str) -> bool:
        """
        Verify a password against its hash.
        
        Args:
            password: Plain text password to verify
            hashed_password: Stored hash
            salt: Salt used for hashing
            
        Returns:
            True if password matches, False otherwise
        """
        computed_hash, _ = PasswordManager.hash_password(password, salt)
        return computed_hash == hashed_password
    
    @staticmethod
    def generate_secure_password(length: int = 12) -> str:
        """
        Generate a secure random password.
        
        Args:
            length: Password length (default: 12)
            
        Returns:
            Secure random password
        """
        alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
        password = ''.join(secrets.choice(alphabet) for _ in range(length))
        return password
    
    @staticmethod
    def validate_password_strength(password: str) -> dict:
        """
        Validate password strength.
        
        Args:
            password: Password to validate
            
        Returns:
            Dictionary with validation results
        """
        result = {
            'valid': True,
            'errors': [],
            'strength': 'weak'
        }
        
        if len(password) < 8:
            result['valid'] = False
            result['errors'].append('Password must be at least 8 characters long')
        
        if not any(c.isupper() for c in password):
            result['errors'].append('Password must contain at least one uppercase letter')
        
        if not any(c.islower() for c in password):
            result['errors'].append('Password must contain at least one lowercase letter')
        
        if not any(c.isdigit() for c in password):
            result['errors'].append('Password must contain at least one number')
        
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
            result['errors'].append('Password must contain at least one special character')
        
        # Calculate strength
        if len(password) >= 12 and len(result['errors']) == 0:
            result['strength'] = 'strong'
        elif len(password) >= 8 and len(result['errors']) <= 1:
            result['strength'] = 'medium'
        
        if len(result['errors']) > 0:
            result['valid'] = False
        
        return result
