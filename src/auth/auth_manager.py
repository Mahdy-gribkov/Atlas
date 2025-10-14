"""
Authentication manager for user sessions and security.
"""

import asyncio
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from .jwt_handler import JWTHandler
from .password_manager import PasswordManager
from ..database.secure_database import SecureDatabase
from ..utils.security import SecurityValidator

class AuthManager:
    """Main authentication manager for the Travel AI Agent."""
    
    def __init__(self, database: SecureDatabase = None):
        self.db = database or SecureDatabase()
        self.jwt_handler = JWTHandler()
        self.password_manager = PasswordManager()
        self.security_validator = SecurityValidator()
        
        # In-memory session storage (in production, use Redis)
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
        self.failed_attempts: Dict[str, Dict[str, Any]] = {}
        
        # Security settings
        self.max_failed_attempts = 5
        self.lockout_duration = 300  # 5 minutes
        self.session_timeout = 1800  # 30 minutes
    
    async def register_user(self, username: str, email: str, password: str) -> Dict[str, Any]:
        """
        Register a new user.
        
        Args:
            username: Username
            email: Email address
            password: Plain text password
            
        Returns:
            Registration result
        """
        try:
            # Validate input
            validation_result = self.security_validator.validate_user_input({
                'username': username,
                'email': email,
                'password': password
            })
            
            if not validation_result['valid']:
                return {
                    'success': False,
                    'error': 'Invalid input',
                    'details': validation_result['errors']
                }
            
            # Check if user already exists
            existing_user = await self.db.get_user_by_username(username)
            if existing_user:
                return {
                    'success': False,
                    'error': 'Username already exists'
                }
            
            existing_email = await self.db.get_user_by_email(email)
            if existing_email:
                return {
                    'success': False,
                    'error': 'Email already registered'
                }
            
            # Validate password strength
            password_validation = self.password_manager.validate_password_strength(password)
            if not password_validation['valid']:
                return {
                    'success': False,
                    'error': 'Password does not meet requirements',
                    'details': password_validation['errors']
                }
            
            # Hash password
            hashed_password, salt = self.password_manager.hash_password(password)
            
            # Create user
            user_id = await self.db.create_user({
                'username': username,
                'email': email,
                'password_hash': hashed_password,
                'salt': salt,
                'created_at': datetime.now().isoformat(),
                'last_login': None,
                'is_active': True
            })
            
            return {
                'success': True,
                'user_id': user_id,
                'message': 'User registered successfully'
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': 'Registration failed',
                'details': str(e)
            }
    
    async def authenticate_user(self, username: str, password: str) -> Dict[str, Any]:
        """
        Authenticate a user with username and password.
        
        Args:
            username: Username or email
            password: Plain text password
            
        Returns:
            Authentication result
        """
        try:
            # Check for account lockout
            if self._is_account_locked(username):
                return {
                    'success': False,
                    'error': 'Account temporarily locked due to too many failed attempts'
                }
            
            # Get user from database
            user = await self.db.get_user_by_username(username)
            if not user:
                user = await self.db.get_user_by_email(username)
            
            if not user:
                self._record_failed_attempt(username)
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
            
            # Verify password
            if not self.password_manager.verify_password(password, user['password_hash'], user['salt']):
                self._record_failed_attempt(username)
                return {
                    'success': False,
                    'error': 'Invalid credentials'
                }
            
            # Check if account is active
            if not user.get('is_active', True):
                return {
                    'success': False,
                    'error': 'Account is deactivated'
                }
            
            # Clear failed attempts
            self._clear_failed_attempts(username)
            
            # Update last login
            await self.db.update_user(user['id'], {'last_login': datetime.now().isoformat()})
            
            # Create tokens
            access_token = self.jwt_handler.create_access_token(user['id'], user['username'])
            refresh_token = self.jwt_handler.create_refresh_token(user['id'], user['username'])
            
            # Create session
            session_id = f"{user['id']}_{int(datetime.now().timestamp())}"
            self.active_sessions[session_id] = {
                'user_id': user['id'],
                'username': user['username'],
                'created_at': datetime.now(),
                'last_activity': datetime.now(),
                'access_token': access_token
            }
            
            return {
                'success': True,
                'user_id': user['id'],
                'username': user['username'],
                'access_token': access_token,
                'refresh_token': refresh_token,
                'session_id': session_id,
                'expires_in': self.jwt_handler.access_token_expire_minutes * 60
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': 'Authentication failed',
                'details': str(e)
            }
    
    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verify an access token and return user information.
        
        Args:
            token: JWT access token
            
        Returns:
            User information if token is valid, None otherwise
        """
        try:
            payload = self.jwt_handler.verify_token(token, 'access')
            if not payload:
                return None
            
            # Check if session is still active
            user_id = payload['user_id']
            active_session = None
            
            for session_id, session_data in self.active_sessions.items():
                if session_data['user_id'] == user_id and session_data['access_token'] == token:
                    # Check session timeout
                    if datetime.now() - session_data['last_activity'] > timedelta(seconds=self.session_timeout):
                        del self.active_sessions[session_id]
                        return None
                    
                    # Update last activity
                    session_data['last_activity'] = datetime.now()
                    active_session = session_data
                    break
            
            if not active_session:
                return None
            
            # Get fresh user data
            user = await self.db.get_user_by_id(user_id)
            if not user or not user.get('is_active', True):
                return None
            
            return {
                'user_id': user['id'],
                'username': user['username'],
                'email': user['email'],
                'session_id': active_session.get('session_id')
            }
            
        except Exception as e:
            return None
    
    async def refresh_token(self, refresh_token: str) -> Optional[Dict[str, Any]]:
        """
        Refresh an access token using a refresh token.
        
        Args:
            refresh_token: Valid refresh token
            
        Returns:
            New access token information if valid, None otherwise
        """
        try:
            new_access_token = self.jwt_handler.refresh_access_token(refresh_token)
            if not new_access_token:
                return None
            
            payload = self.jwt_handler.verify_token(new_access_token, 'access')
            if not payload:
                return None
            
            # Update session with new token
            user_id = payload['user_id']
            for session_id, session_data in self.active_sessions.items():
                if session_data['user_id'] == user_id:
                    session_data['access_token'] = new_access_token
                    session_data['last_activity'] = datetime.now()
                    break
            
            return {
                'access_token': new_access_token,
                'expires_in': self.jwt_handler.access_token_expire_minutes * 60
            }
            
        except Exception as e:
            return None
    
    async def logout(self, token: str) -> bool:
        """
        Logout a user and invalidate their session.
        
        Args:
            token: JWT access token
            
        Returns:
            True if logout successful, False otherwise
        """
        try:
            payload = self.jwt_handler.verify_token(token, 'access')
            if not payload:
                return False
            
            user_id = payload['user_id']
            
            # Remove session
            for session_id, session_data in list(self.active_sessions.items()):
                if session_data['user_id'] == user_id and session_data['access_token'] == token:
                    del self.active_sessions[session_id]
                    break
            
            return True
            
        except Exception as e:
            return False
    
    def _is_account_locked(self, username: str) -> bool:
        """Check if account is locked due to failed attempts."""
        if username not in self.failed_attempts:
            return False
        
        attempts = self.failed_attempts[username]
        if attempts['count'] >= self.max_failed_attempts:
            lockout_time = attempts['last_attempt'] + timedelta(seconds=self.lockout_duration)
            if datetime.now() < lockout_time:
                return True
            else:
                # Lockout expired, clear attempts
                del self.failed_attempts[username]
        
        return False
    
    def _record_failed_attempt(self, username: str):
        """Record a failed login attempt."""
        if username not in self.failed_attempts:
            self.failed_attempts[username] = {
                'count': 0,
                'last_attempt': None
            }
        
        self.failed_attempts[username]['count'] += 1
        self.failed_attempts[username]['last_attempt'] = datetime.now()
    
    def _clear_failed_attempts(self, username: str):
        """Clear failed attempts for a user."""
        if username in self.failed_attempts:
            del self.failed_attempts[username]
    
    async def cleanup_expired_sessions(self):
        """Clean up expired sessions."""
        current_time = datetime.now()
        expired_sessions = []
        
        for session_id, session_data in self.active_sessions.items():
            if current_time - session_data['last_activity'] > timedelta(seconds=self.session_timeout):
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.active_sessions[session_id]
    
    async def get_user_sessions(self, user_id: str) -> list:
        """Get all active sessions for a user."""
        user_sessions = []
        for session_id, session_data in self.active_sessions.items():
            if session_data['user_id'] == user_id:
                user_sessions.append({
                    'session_id': session_id,
                    'created_at': session_data['created_at'].isoformat(),
                    'last_activity': session_data['last_activity'].isoformat()
                })
        
        return user_sessions
