"""
JWT token handling for secure authentication.
"""

import jwt
import time
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from src.config import config

class JWTHandler:
    """JWT token management for authentication."""
    
    def __init__(self, secret_key: str = None):
        self.secret_key = secret_key or config.SECRET_KEY
        self.algorithm = 'HS256'
        self.access_token_expire_minutes = 30
        self.refresh_token_expire_days = 7
    
    def create_access_token(self, user_id: str, username: str, additional_claims: Dict[str, Any] = None) -> str:
        """
        Create a JWT access token.
        
        Args:
            user_id: User ID
            username: Username
            additional_claims: Additional claims to include
            
        Returns:
            JWT access token
        """
        now = datetime.utcnow()
        payload = {
            'user_id': user_id,
            'username': username,
            'type': 'access',
            'iat': now,
            'exp': now + timedelta(minutes=self.access_token_expire_minutes),
            'jti': f"{user_id}_{int(now.timestamp())}"  # Unique token ID
        }
        
        if additional_claims:
            payload.update(additional_claims)
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def create_refresh_token(self, user_id: str, username: str) -> str:
        """
        Create a JWT refresh token.
        
        Args:
            user_id: User ID
            username: Username
            
        Returns:
            JWT refresh token
        """
        now = datetime.utcnow()
        payload = {
            'user_id': user_id,
            'username': username,
            'type': 'refresh',
            'iat': now,
            'exp': now + timedelta(days=self.refresh_token_expire_days),
            'jti': f"refresh_{user_id}_{int(now.timestamp())}"
        }
        
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)
    
    def verify_token(self, token: str, token_type: str = 'access') -> Optional[Dict[str, Any]]:
        """
        Verify and decode a JWT token.
        
        Args:
            token: JWT token to verify
            token_type: Expected token type ('access' or 'refresh')
            
        Returns:
            Decoded token payload if valid, None otherwise
        """
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            
            # Check token type
            if payload.get('type') != token_type:
                return None
            
            # Check expiration
            if payload.get('exp', 0) < time.time():
                return None
            
            return payload
            
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
    
    def refresh_access_token(self, refresh_token: str) -> Optional[str]:
        """
        Create a new access token from a refresh token.
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            New access token if refresh token is valid, None otherwise
        """
        payload = self.verify_token(refresh_token, 'refresh')
        if not payload:
            return None
        
        return self.create_access_token(
            payload['user_id'],
            payload['username']
        )
    
    def get_token_info(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Get token information without verification.
        
        Args:
            token: JWT token
            
        Returns:
            Token payload if decodable, None otherwise
        """
        try:
            # Decode without verification to get payload
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
        except jwt.InvalidTokenError:
            return None
    
    def is_token_expired(self, token: str) -> bool:
        """
        Check if a token is expired.
        
        Args:
            token: JWT token
            
        Returns:
            True if expired, False otherwise
        """
        payload = self.get_token_info(token)
        if not payload:
            return True
        
        exp = payload.get('exp', 0)
        return exp < time.time()
