"""
Async Database Wrapper for SecureDatabase
Provides proper async/await support for database operations.
"""

import asyncio
import logging
from typing import Dict, Any, List, Optional
from .secure_database import SecureDatabase

logger = logging.getLogger(__name__)


class AsyncDatabase:
    """
    Async wrapper for SecureDatabase.
    
    This wrapper provides proper async/await support by running
    synchronous database operations in a thread pool.
    """
    
    def __init__(self, db_path: str = None, encryption_key: str = None):
        """Initialize the async database wrapper."""
        self.db = SecureDatabase(db_path, encryption_key)
        self.executor = None
        logger.info("Async Database wrapper initialized")
    
    async def _run_in_executor(self, func, *args, **kwargs):
        """Run a synchronous function in a thread pool."""
        if self.executor is None:
            self.executor = asyncio.get_event_loop().run_in_executor
        
        return await self.executor(None, func, *args, **kwargs)
    
    # User Management Methods
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user in the database."""
        return await self._run_in_executor(self.db.create_user, user_data)
    
    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username."""
        return await self._run_in_executor(self.db.get_user_by_username, username)
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        return await self._run_in_executor(self.db.get_user_by_email, email)
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        return await self._run_in_executor(self.db.get_user_by_id, user_id)
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user information."""
        return await self._run_in_executor(self.db.update_user, user_id, update_data)
    
    # Preference Methods
    async def get_user_preferences(self, user_id: str) -> List[Dict[str, Any]]:
        """Get user preferences."""
        return await self._run_in_executor(self.db.get_user_preferences, user_id)
    
    async def store_user_preference(self, preference_data: Dict[str, Any]) -> bool:
        """Store user preference."""
        return await self._run_in_executor(self.db.store_user_preference, preference_data)
    
    # Conversation Methods
    async def save_conversation(self, user_id: str, user_message: str, assistant_response: str) -> bool:
        """Save conversation to database."""
        return await self._run_in_executor(self.db.save_conversation, user_id, user_message, assistant_response)
    
    async def get_conversation_history(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get conversation history."""
        return await self._run_in_executor(self.db.get_conversation_history, user_id, limit)
    
    # Memory Methods
    async def store_memory(self, user_id: str, memory_data: Dict[str, Any]) -> bool:
        """Store memory."""
        return await self._run_in_executor(self.db.store_memory, user_id, memory_data)
    
    async def get_recent_memories(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent memories."""
        return await self._run_in_executor(self.db.get_recent_memories, user_id, limit)
    
    async def search_memories(self, user_id: str, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search memories."""
        return await self._run_in_executor(self.db.search_memories, user_id, query, limit)
    
    # Profile Methods
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile."""
        return await self._run_in_executor(self.db.get_user_profile, user_id)
    
    async def save_user_profile(self, profile_data: Dict[str, Any]) -> bool:
        """Save user profile."""
        return await self._run_in_executor(self.db.save_user_profile, profile_data)
    
    # Context Methods
    async def get_context_summary(self, user_id: str, summary_type: str) -> Optional[str]:
        """Get context summary."""
        return await self._run_in_executor(self.db.get_context_summary, user_id, summary_type)
    
    # Cache Methods
    async def get_cached_data(self, key: str) -> Optional[Dict[str, Any]]:
        """Get cached data."""
        return await self._run_in_executor(self.db.get_cached_data, key)
    
    async def cache_data(self, key: str, data: Dict[str, Any], ttl: int = 3600) -> bool:
        """Cache data."""
        return await self._run_in_executor(self.db.cache_data, key, data, ttl)
    
    # Cleanup Methods
    async def cleanup_expired_data(self) -> int:
        """Cleanup expired data."""
        return await self._run_in_executor(self.db.cleanup_expired_data)
    
    async def close(self):
        """Close database connection."""
        if hasattr(self.db, 'close'):
            await self._run_in_executor(self.db.close)
        logger.info("Async Database connection closed")
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    async def __aenter__(self):
        """Async context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        asyncio.create_task(self.close())
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()
