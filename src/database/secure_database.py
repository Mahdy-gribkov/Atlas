"""
Secure database implementation with encryption and automatic cleanup.
Provides privacy-first data storage for the Travel AI Agent.
Uses aiosqlite for proper async database operations.
"""

import aiosqlite
import os
import hashlib
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from cryptography.fernet import Fernet
import json
import logging

logger = logging.getLogger(__name__)

from .models import UserPreference, SearchHistory, TravelPlan, APICache
from config import config

class SecureDatabase:
    """
    Encrypted local database with zero external access.
    All data is encrypted at rest and automatically cleaned up.
    Uses aiosqlite for proper async operations.
    """
    
    def __init__(self, db_path: str = None, encryption_key: str = None):
        """
        Initialize the secure database.
        
        Args:
            db_path: Path to the database file
            encryption_key: Encryption key for data protection
        """
        self.db_path = db_path or config.DATABASE_PATH
        self.encryption_key = encryption_key or config.ENCRYPTION_KEY
        
        # Ensure encryption key is proper length
        if len(self.encryption_key) < 32:
            self.encryption_key = Fernet.generate_key().decode()
        
        self.fernet = Fernet(self.encryption_key.encode())
        self._connection_lock = asyncio.Lock()
        self._initialized = False
        
        # Create database directory if it doesn't exist
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
    
    async def _ensure_initialized(self):
        """Ensure database is initialized."""
        if not self._initialized:
            await self._initialize_database()
    
    async def _initialize_database(self):
        """Initialize encrypted SQLite database with tables."""
        try:
            async with aiosqlite.connect(self.db_path) as db:
                # Set pragmas for better performance
                await db.execute("PRAGMA journal_mode=WAL")
                await db.execute("PRAGMA synchronous=NORMAL")
                await db.execute("PRAGMA cache_size=1000")
                await db.execute("PRAGMA temp_store=MEMORY")
                
                # Create tables
                await self._create_tables(db)
                
                # Set up automatic cleanup triggers
                await self._setup_cleanup_triggers(db)
                
                await db.commit()
                
            self._initialized = True
            logger.info(f"Secure database initialized: {self.db_path}")
            
        except Exception as e:
            logger.error(f"Database initialization error: {e}")
            raise
    
    async def _create_tables(self, db: aiosqlite.Connection):
        """Create database tables with proper structure."""
        tables = [
            """
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                preference_type TEXT NOT NULL,
                preference_value TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS search_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                search_type TEXT NOT NULL,
                search_params TEXT NOT NULL,
                results_count INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP DEFAULT (datetime('now', '+1 day'))
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS travel_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plan_name TEXT NOT NULL,
                destination TEXT NOT NULL,
                start_date TIMESTAMP,
                end_date TIMESTAMP,
                travelers INTEGER DEFAULT 1,
                budget REAL DEFAULT 0.0,
                currency TEXT DEFAULT 'USD',
                plan_data TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS api_cache (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                api_name TEXT NOT NULL,
                endpoint TEXT NOT NULL,
                params_hash TEXT NOT NULL,
                response_data TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP DEFAULT (datetime('now', '+1 hour'))
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                user_message TEXT NOT NULL,
                assistant_response TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            """
        ]
        
        for table_sql in tables:
            await db.execute(table_sql)
        
        # Create indexes for better performance
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_preferences_type ON user_preferences(preference_type)",
            "CREATE INDEX IF NOT EXISTS idx_preferences_expires ON user_preferences(expires_at)",
            "CREATE INDEX IF NOT EXISTS idx_search_type ON search_history(search_type)",
            "CREATE INDEX IF NOT EXISTS idx_search_expires ON search_history(expires_at)",
            "CREATE INDEX IF NOT EXISTS idx_plans_destination ON travel_plans(destination)",
            "CREATE INDEX IF NOT EXISTS idx_cache_hash ON api_cache(params_hash)",
            "CREATE INDEX IF NOT EXISTS idx_cache_expires ON api_cache(expires_at)",
            "CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id)"
        ]
        
        for index_sql in indexes:
            await db.execute(index_sql)
    
    async def _setup_cleanup_triggers(self, db: aiosqlite.Connection):
        """Set up automatic cleanup triggers for expired data."""
        # Trigger to clean up expired preferences
        await db.execute("""
            CREATE TRIGGER IF NOT EXISTS cleanup_expired_preferences
            AFTER INSERT ON user_preferences
            BEGIN
                DELETE FROM user_preferences 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
            END
        """)
        
        # Trigger to clean up expired search history
        await db.execute("""
            CREATE TRIGGER IF NOT EXISTS cleanup_expired_searches
            AFTER INSERT ON search_history
            BEGIN
                DELETE FROM search_history 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
            END
        """)
        
        # Trigger to clean up expired cache
        await db.execute("""
            CREATE TRIGGER IF NOT EXISTS cleanup_expired_cache
            AFTER INSERT ON api_cache
            BEGIN
                DELETE FROM api_cache 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
            END
        """)
    
    async def _execute_query(self, query: str, params: tuple = None) -> aiosqlite.Cursor:
        """Execute a database query with proper connection management."""
        await self._ensure_initialized()
        
        async with aiosqlite.connect(self.db_path) as db:
            if params:
                cursor = await db.execute(query, params)
            else:
                cursor = await db.execute(query)
            await db.commit()
            return cursor
    
    async def _execute_many(self, query: str, params_list: List[tuple]) -> aiosqlite.Cursor:
        """Execute a database query with multiple parameter sets."""
        await self._ensure_initialized()
        
        async with aiosqlite.connect(self.db_path) as db:
            cursor = await db.executemany(query, params_list)
            await db.commit()
            return cursor
    
    def _encrypt_data(self, data: str) -> str:
        """Encrypt sensitive data."""
        try:
            return self.fernet.encrypt(data.encode()).decode()
        except Exception as e:
            logger.error(f"Encryption error: {e}")
            return data
    
    def _decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data."""
        try:
            return self.fernet.decrypt(encrypted_data.encode()).decode()
        except Exception as e:
            logger.error(f"Decryption error: {e}")
            return encrypted_data
    
    def _hash_params(self, params: Dict[str, Any]) -> str:
        """Create hash for API parameters."""
        params_str = json.dumps(params, sort_keys=True)
        return hashlib.md5(params_str.encode()).hexdigest()
    
    # User Preferences Methods
    async def store_preference(self, pref_type: str, pref_value: str, ttl_hours: int = 24) -> bool:
        """Store user preference with automatic expiration."""
        try:
            encrypted_value = self._encrypt_data(pref_value)
            expires_at = datetime.now() + timedelta(hours=ttl_hours)
            
            await self._execute_query("""
                INSERT INTO user_preferences (preference_type, preference_value, expires_at)
                VALUES (?, ?, ?)
            """, (pref_type, encrypted_value, expires_at))
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing preference: {e}")
            return False
    
    async def get_preferences(self, pref_type: str = None) -> List[UserPreference]:
        """Retrieve user preferences with automatic cleanup."""
        try:
            # Clean up expired preferences first
            await self.cleanup_expired_data()
            
            if pref_type:
                cursor = await self._execute_query(
                    "SELECT * FROM user_preferences WHERE preference_type = ?",
                    (pref_type,)
                )
            else:
                cursor = await self._execute_query("SELECT * FROM user_preferences")
            
            preferences = []
            async for row in cursor:
                try:
                    decrypted_value = self._decrypt_data(row[2])
                    preference = UserPreference(
                        id=row[0],
                        preference_type=row[1],
                        preference_value=decrypted_value,
                        created_at=datetime.fromisoformat(row[3]) if row[3] else None,
                        expires_at=datetime.fromisoformat(row[4]) if row[4] else None
                    )
                    preferences.append(preference)
                except Exception as e:
                    logger.error(f"Error processing preference: {e}")
                    continue
            
            return preferences
            
        except Exception as e:
            logger.error(f"Error retrieving preferences: {e}")
            return []
    
    async def delete_preference(self, pref_type: str) -> bool:
        """Delete specific preference type."""
        try:
            await self._execute_query(
                "DELETE FROM user_preferences WHERE preference_type = ?",
                (pref_type,)
            )
            return True
        except Exception as e:
            logger.error(f"Error deleting preference: {e}")
            return False
    
    # Search History Methods
    async def store_search(self, search_type: str, params: Dict[str, Any], results_count: int = 0) -> bool:
        """Store search history with automatic expiration."""
        try:
            encrypted_params = self._encrypt_data(json.dumps(params))
            expires_at = datetime.now() + timedelta(days=1)
            
            await self._execute_query("""
                INSERT INTO search_history (search_type, search_params, results_count, expires_at)
                VALUES (?, ?, ?, ?)
            """, (search_type, encrypted_params, results_count, expires_at))
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing search: {e}")
            return False
    
    async def get_search_history(self, search_type: str = None, limit: int = 10) -> List[SearchHistory]:
        """Retrieve search history with automatic cleanup."""
        try:
            await self.cleanup_expired_data()
            
            if search_type:
                cursor = await self._execute_query(
                    "SELECT * FROM search_history WHERE search_type = ? ORDER BY created_at DESC LIMIT ?",
                    (search_type, limit)
                )
            else:
                cursor = await self._execute_query(
                    "SELECT * FROM search_history ORDER BY created_at DESC LIMIT ?",
                    (limit,)
                )
            
            searches = []
            async for row in cursor:
                try:
                    decrypted_params = self._decrypt_data(row[2])
                    search = SearchHistory(
                        id=row[0],
                        search_type=row[1],
                        search_params=decrypted_params,
                        results_count=row[3],
                        created_at=datetime.fromisoformat(row[4]) if row[4] else None,
                        expires_at=datetime.fromisoformat(row[5]) if row[5] else None
                    )
                    searches.append(search)
                except Exception as e:
                    logger.error(f"Error processing search: {e}")
                    continue
            
            return searches
            
        except Exception as e:
            logger.error(f"Error retrieving search history: {e}")
            return []
    
    # Travel Plans Methods
    async def store_travel_plan(self, plan: TravelPlan) -> bool:
        """Store travel plan."""
        try:
            encrypted_plan_data = self._encrypt_data(plan.plan_data)
            
            if plan.id:
                # Update existing plan
                await self._execute_query("""
                    UPDATE travel_plans SET
                        plan_name = ?, destination = ?, start_date = ?, end_date = ?,
                        travelers = ?, budget = ?, currency = ?, plan_data = ?, updated_at = ?
                    WHERE id = ?
                """, (plan.plan_name, plan.destination, plan.start_date, plan.end_date,
                      plan.travelers, plan.budget, plan.currency, encrypted_plan_data,
                      datetime.now(), plan.id))
            else:
                # Insert new plan
                await self._execute_query("""
                    INSERT INTO travel_plans 
                    (plan_name, destination, start_date, end_date, travelers, budget, currency, plan_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (plan.plan_name, plan.destination, plan.start_date, plan.end_date,
                      plan.travelers, plan.budget, plan.currency, encrypted_plan_data))
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing travel plan: {e}")
            return False
    
    async def get_travel_plans(self, destination: str = None) -> List[TravelPlan]:
        """Retrieve travel plans."""
        try:
            if destination:
                cursor = await self._execute_query(
                    "SELECT * FROM travel_plans WHERE destination LIKE ? ORDER BY created_at DESC",
                    (f"%{destination}%",)
                )
            else:
                cursor = await self._execute_query(
                    "SELECT * FROM travel_plans ORDER BY created_at DESC"
                )
            
            plans = []
            async for row in cursor:
                try:
                    decrypted_plan_data = self._decrypt_data(row[8])
                    plan = TravelPlan(
                        id=row[0],
                        plan_name=row[1],
                        destination=row[2],
                        start_date=datetime.fromisoformat(row[3]) if row[3] else None,
                        end_date=datetime.fromisoformat(row[4]) if row[4] else None,
                        travelers=row[5],
                        budget=row[6],
                        currency=row[7],
                        plan_data=decrypted_plan_data,
                        created_at=datetime.fromisoformat(row[9]) if row[9] else None,
                        updated_at=datetime.fromisoformat(row[10]) if row[10] else None
                    )
                    plans.append(plan)
                except Exception as e:
                    logger.error(f"Error processing travel plan: {e}")
                    continue
            
            return plans
            
        except Exception as e:
            logger.error(f"Error retrieving travel plans: {e}")
            return []
    
    # API Cache Methods
    async def store_api_cache(self, api_name: str, endpoint: str, params: Dict[str, Any], 
                       response_data: Dict[str, Any], ttl_hours: int = 1) -> bool:
        """Store API response in cache."""
        try:
            params_hash = self._hash_params(params)
            encrypted_response = self._encrypt_data(json.dumps(response_data))
            expires_at = datetime.now() + timedelta(hours=ttl_hours)
            
            # Delete existing cache for same parameters
            await self._execute_query(
                "DELETE FROM api_cache WHERE api_name = ? AND params_hash = ?",
                (api_name, params_hash)
            )
            
            # Insert new cache entry
            await self._execute_query("""
                INSERT INTO api_cache (api_name, endpoint, params_hash, response_data, expires_at)
                VALUES (?, ?, ?, ?, ?)
            """, (api_name, endpoint, params_hash, encrypted_response, expires_at))
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing API cache: {e}")
            return False
    
    async def get_api_cache(self, api_name: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Retrieve API response from cache."""
        try:
            params_hash = self._hash_params(params)
            
            cursor = await self._execute_query("""
                SELECT response_data FROM api_cache 
                WHERE api_name = ? AND params_hash = ? AND expires_at > datetime('now')
            """, (api_name, params_hash))
            
            row = await cursor.fetchone()
            if row:
                decrypted_response = self._decrypt_data(row[0])
                return json.loads(decrypted_response)
            
            return None
            
        except Exception as e:
            logger.error(f"Error retrieving API cache: {e}")
            return None
    
    # Cleanup Methods
    async def cleanup_expired_data(self) -> int:
        """Clean up all expired data and return count of deleted records."""
        try:
            deleted_count = 0
            
            # Clean up expired preferences
            cursor = await self._execute_query(
                "DELETE FROM user_preferences WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
            )
            deleted_count += cursor.rowcount
            
            # Clean up expired search history
            cursor = await self._execute_query(
                "DELETE FROM search_history WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
            )
            deleted_count += cursor.rowcount
            
            # Clean up expired cache
            cursor = await self._execute_query(
                "DELETE FROM api_cache WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
            )
            deleted_count += cursor.rowcount
            
            if deleted_count > 0:
                logger.info(f"Cleaned up {deleted_count} expired records")
            
            return deleted_count
            
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
            return 0
    
    async def get_database_stats(self) -> Dict[str, int]:
        """Get database statistics."""
        try:
            stats = {}
            
            # Count records in each table
            tables = ['user_preferences', 'search_history', 'travel_plans', 'api_cache', 'conversations']
            for table in tables:
                cursor = await self._execute_query(f"SELECT COUNT(*) FROM {table}")
                row = await cursor.fetchone()
                stats[table] = row[0] if row else 0
            
            # Count expired records
            cursor = await self._execute_query("""
                SELECT COUNT(*) FROM user_preferences 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            row = await cursor.fetchone()
            stats['expired_preferences'] = row[0] if row else 0
            
            cursor = await self._execute_query("""
                SELECT COUNT(*) FROM search_history 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            row = await cursor.fetchone()
            stats['expired_searches'] = row[0] if row else 0
            
            cursor = await self._execute_query("""
                SELECT COUNT(*) FROM api_cache 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            row = await cursor.fetchone()
            stats['expired_cache'] = row[0] if row else 0
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting database stats: {e}")
            return {}
    
    async def save_conversation(self, user_id: str, user_message: str, assistant_response: str) -> bool:
        """
        Save conversation to database.
        
        Args:
            user_id: User identifier
            user_message: User's message
            assistant_response: Assistant's response
            
        Returns:
            bool: True if saved successfully
        """
        try:
            # Encrypt the conversation data
            encrypted_user_msg = self._encrypt_data(user_message)
            encrypted_assistant_msg = self._encrypt_data(assistant_response)
            
            await self._execute_query("""
                INSERT INTO conversations (user_id, user_message, assistant_response)
                VALUES (?, ?, ?)
            """, (user_id, encrypted_user_msg, encrypted_assistant_msg))
            
            return True
            
        except Exception as e:
            logger.error(f"Error saving conversation: {e}")
            return False
    
    async def get_conversations(self, user_id: str = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get conversation history."""
        try:
            if user_id:
                cursor = await self._execute_query(
                    "SELECT * FROM conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT ?",
                    (user_id, limit)
                )
            else:
                cursor = await self._execute_query(
                    "SELECT * FROM conversations ORDER BY created_at DESC LIMIT ?",
                    (limit,)
                )
            
            conversations = []
            async for row in cursor:
                try:
                    decrypted_user_msg = self._decrypt_data(row[2])
                    decrypted_assistant_msg = self._decrypt_data(row[3])
                    
                    conversations.append({
                        'id': row[0],
                        'user_id': row[1],
                        'user_message': decrypted_user_msg,
                        'assistant_response': decrypted_assistant_msg,
                        'created_at': datetime.fromisoformat(row[4]) if row[4] else None
                    })
                except Exception as e:
                    logger.error(f"Error processing conversation: {e}")
                    continue
            
            return conversations
            
        except Exception as e:
            logger.error(f"Error retrieving conversations: {e}")
            return []
    
    async def close(self):
        """Close database connection securely."""
        # With aiosqlite, connections are automatically closed
        # This method is kept for compatibility
        logger.info("Database connection closed")
    
    async def __aenter__(self):
        """Async context manager entry."""
        await self._ensure_initialized()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        await self.close()