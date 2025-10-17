"""
Authentication utilities for the Travel AI Agent.
Provides JWT token management and user authentication.
"""

import jwt
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__)

# Password hashing - use argon2 for Python 3.13 compatibility
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", secrets.token_urlsafe(32))
JWT_ALGORITHM = "HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# API Key Configuration
VALID_API_KEYS = set(os.getenv("VALID_API_KEYS", "").split(",")) if os.getenv("VALID_API_KEYS") else set()

class AuthManager:
    """Manages authentication and authorization for the Travel AI Agent."""
    
    def __init__(self):
        self.secret_key = JWT_SECRET_KEY
        self.algorithm = JWT_ALGORITHM
        self.access_token_expire_minutes = JWT_ACCESS_TOKEN_EXPIRE_MINUTES
        
        # In-memory user store (in production, use database)
        self.users = {
            "admin": {
                "username": "admin",
                "hashed_password": pwd_context.hash("admin123"),
                "email": "admin@travelagent.com",
                "role": "admin",
                "is_active": True
            },
            "user": {
                "username": "user", 
                "hashed_password": pwd_context.hash("user123"),
                "email": "user@travelagent.com",
                "role": "user",
                "is_active": True
            }
        }
        
        logger.info("Auth Manager initialized")
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash."""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Hash a password."""
        return pwd_context.hash(password)
    
    def authenticate_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Authenticate a user with username and password."""
        user = self.users.get(username)
        if not user:
            return None
        if not self.verify_password(password, user["hashed_password"]):
            return None
        if not user["is_active"]:
            return None
        return user
    
    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token."""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode a JWT token."""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            username: str = payload.get("sub")
            if username is None:
                return None
            return payload
        except jwt.PyJWTError:
            return None
    
    def validate_api_key(self, api_key: str) -> bool:
        """Validate an API key."""
        if not api_key:
            return False
        
        # Check against configured API keys
        if api_key in VALID_API_KEYS:
            return True
        
        # Check against user-generated API keys (hash-based)
        for username, user_data in self.users.items():
            user_api_key = self.generate_user_api_key(username)
            if api_key == user_api_key:
                return True
        
        return False
    
    def generate_user_api_key(self, username: str) -> str:
        """Generate a user-specific API key."""
        if username not in self.users:
            return None
        
        # Create a deterministic API key based on username and secret
        key_data = f"{username}:{self.secret_key}"
        api_key = hashlib.sha256(key_data.encode()).hexdigest()[:32]
        return f"ta_{api_key}"
    
    def get_user_from_api_key(self, api_key: str) -> Optional[str]:
        """Get username from API key."""
        if not api_key:
            return None
        
        # Check user-generated API keys
        for username, user_data in self.users.items():
            user_api_key = self.generate_user_api_key(username)
            if api_key == user_api_key:
                return username
        
        return None

# Global auth manager instance
auth_manager = AuthManager()

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    return auth_manager.create_access_token(data, expires_delta)

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify and decode a JWT token."""
    return auth_manager.verify_token(token)

def validate_api_key(api_key: str) -> bool:
    """Validate an API key."""
    return auth_manager.validate_api_key(api_key)

def get_user_from_api_key(api_key: str) -> Optional[str]:
    """Get username from API key."""
    return auth_manager.get_user_from_api_key(api_key)
