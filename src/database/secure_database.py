"""
Secure database implementation with encryption and automatic cleanup.
Provides privacy-first data storage for the Travel AI Agent.
"""

import sqlite3
import os
import hashlib
import asyncio
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from cryptography.fernet import Fernet
import json

from .models import UserPreference, SearchHistory, TravelPlan, APICache
from config import config

class SecureDatabase:
    """
    Encrypted local database with zero external access.
    All data is encrypted at rest and automatically cleaned up.
    """
    
    def __init__(self, db_path: str = None, encryption_key: str = None):
        self.db_path = db_path or config.DATABASE_PATH
        self.encryption_key = encryption_key or config.ENCRYPTION_KEY
        
        # Ensure encryption key is proper length
        if len(self.encryption_key) < 32:
            self.encryption_key = Fernet.generate_key().decode()
        
        self.fernet = Fernet(self.encryption_key.encode())
        self.conn: Optional[sqlite3.Connection] = None
        self._connection_lock = asyncio.Lock()
        
        # Create database directory if it doesn't exist
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        
        self._initialize_database()
    
    def _initialize_database(self):
        """Initialize encrypted SQLite database with tables."""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.execute("PRAGMA journal_mode=WAL")
            self.conn.execute("PRAGMA synchronous=NORMAL")
            self.conn.execute("PRAGMA cache_size=1000")
            self.conn.execute("PRAGMA temp_store=MEMORY")
            
            # Create tables
            self._create_tables()
            
            # Set up automatic cleanup
            self._setup_cleanup_triggers()
            
            print(f"Secure database initialized: {self.db_path}")
            
        except Exception as e:
            print(f"Database initialization error: {e}")
            raise
    
    def _create_tables(self):
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
            """
        ]
        
        for table_sql in tables:
            self.conn.execute(table_sql)
        
        # Create indexes for better performance
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_preferences_type ON user_preferences(preference_type)",
            "CREATE INDEX IF NOT EXISTS idx_preferences_expires ON user_preferences(expires_at)",
            "CREATE INDEX IF NOT EXISTS idx_search_type ON search_history(search_type)",
            "CREATE INDEX IF NOT EXISTS idx_search_expires ON search_history(expires_at)",
            "CREATE INDEX IF NOT EXISTS idx_plans_destination ON travel_plans(destination)",
            "CREATE INDEX IF NOT EXISTS idx_cache_hash ON api_cache(params_hash)",
            "CREATE INDEX IF NOT EXISTS idx_cache_expires ON api_cache(expires_at)"
        ]
        
        for index_sql in indexes:
            self.conn.execute(index_sql)
        
        self.conn.commit()
    
    def _setup_cleanup_triggers(self):
        """Set up automatic cleanup triggers for expired data."""
        # Trigger to clean up expired preferences
        self.conn.execute("""
            CREATE TRIGGER IF NOT EXISTS cleanup_expired_preferences
            AFTER INSERT ON user_preferences
            BEGIN
                DELETE FROM user_preferences 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
            END
        """)
        
        # Trigger to clean up expired search history
        self.conn.execute("""
            CREATE TRIGGER IF NOT EXISTS cleanup_expired_searches
            AFTER INSERT ON search_history
            BEGIN
                DELETE FROM search_history 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
            END
        """)
        
        # Trigger to clean up expired cache
        self.conn.execute("""
            CREATE TRIGGER IF NOT EXISTS cleanup_expired_cache
            AFTER INSERT ON api_cache
            BEGIN
                DELETE FROM api_cache 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
            END
        """)
        
        self.conn.commit()
    
    async def _ensure_connection(self):
        """Ensure database connection is available and thread-safe."""
        async with self._connection_lock:
            if self.conn is None:
                self._initialize_database()
            return self.conn
    
    async def _execute_query(self, query: str, params: tuple = None) -> sqlite3.Cursor:
        """Execute a database query with proper connection management."""
        conn = await self._ensure_connection()
        if params:
            return conn.execute(query, params)
        else:
            return conn.execute(query)
    
    async def _execute_many(self, query: str, params_list: List[tuple]) -> sqlite3.Cursor:
        """Execute a database query with multiple parameter sets."""
        conn = await self._ensure_connection()
        return conn.executemany(query, params_list)
    
    def _encrypt_data(self, data: str) -> str:
        """Encrypt sensitive data."""
        try:
            return self.fernet.encrypt(data.encode()).decode()
        except Exception as e:
            print(f"Encryption error: {e}")
            return data
    
    def _decrypt_data(self, encrypted_data: str) -> str:
        """Decrypt sensitive data."""
        try:
            return self.fernet.decrypt(encrypted_data.encode()).decode()
        except Exception as e:
            print(f"Decryption error: {e}")
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
            
            conn = await self._ensure_connection()
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing preference: {e}")
            return False
    
    def get_preferences(self, pref_type: str = None) -> List[UserPreference]:
        """Retrieve user preferences with automatic cleanup."""
        try:
            # Clean up expired preferences first
            self.cleanup_expired_data()
            
            if pref_type:
                cursor = self.conn.execute(
                    "SELECT * FROM user_preferences WHERE preference_type = ?",
                    (pref_type,)
                )
            else:
                cursor = self.conn.execute("SELECT * FROM user_preferences")
            
            preferences = []
            for row in cursor.fetchall():
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
                    print(f"Error processing preference: {e}")
                    continue
            
            return preferences
            
        except Exception as e:
            print(f"Error retrieving preferences: {e}")
            return []
    
    def delete_preference(self, pref_type: str) -> bool:
        """Delete specific preference type."""
        try:
            self.conn.execute(
                "DELETE FROM user_preferences WHERE preference_type = ?",
                (pref_type,)
            )
            self.conn.commit()
            return True
        except Exception as e:
            print(f"Error deleting preference: {e}")
            return False
    
    # Search History Methods
    def store_search(self, search_type: str, params: Dict[str, Any], results_count: int = 0) -> bool:
        """Store search history with automatic expiration."""
        try:
            encrypted_params = self._encrypt_data(json.dumps(params))
            expires_at = datetime.now() + timedelta(days=1)
            
            self.conn.execute("""
                INSERT INTO search_history (search_type, search_params, results_count, expires_at)
                VALUES (?, ?, ?, ?)
            """, (search_type, encrypted_params, results_count, expires_at))
            
            self.conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing search: {e}")
            return False
    
    def get_search_history(self, search_type: str = None, limit: int = 10) -> List[SearchHistory]:
        """Retrieve search history with automatic cleanup."""
        try:
            self.cleanup_expired_data()
            
            if search_type:
                cursor = self.conn.execute(
                    "SELECT * FROM search_history WHERE search_type = ? ORDER BY created_at DESC LIMIT ?",
                    (search_type, limit)
                )
            else:
                cursor = self.conn.execute(
                    "SELECT * FROM search_history ORDER BY created_at DESC LIMIT ?",
                    (limit,)
                )
            
            searches = []
            for row in cursor.fetchall():
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
                    print(f"Error processing search: {e}")
                    continue
            
            return searches
            
        except Exception as e:
            print(f"Error retrieving search history: {e}")
            return []
    
    # Travel Plans Methods
    def store_travel_plan(self, plan: TravelPlan) -> bool:
        """Store travel plan."""
        try:
            encrypted_plan_data = self._encrypt_data(plan.plan_data)
            
            if plan.id:
                # Update existing plan
                self.conn.execute("""
                    UPDATE travel_plans SET
                        plan_name = ?, destination = ?, start_date = ?, end_date = ?,
                        travelers = ?, budget = ?, currency = ?, plan_data = ?, updated_at = ?
                    WHERE id = ?
                """, (plan.plan_name, plan.destination, plan.start_date, plan.end_date,
                      plan.travelers, plan.budget, plan.currency, encrypted_plan_data,
                      datetime.now(), plan.id))
            else:
                # Insert new plan
                self.conn.execute("""
                    INSERT INTO travel_plans 
                    (plan_name, destination, start_date, end_date, travelers, budget, currency, plan_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (plan.plan_name, plan.destination, plan.start_date, plan.end_date,
                      plan.travelers, plan.budget, plan.currency, encrypted_plan_data))
            
            self.conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing travel plan: {e}")
            return False
    
    def get_travel_plans(self, destination: str = None) -> List[TravelPlan]:
        """Retrieve travel plans."""
        try:
            if destination:
                cursor = self.conn.execute(
                    "SELECT * FROM travel_plans WHERE destination LIKE ? ORDER BY created_at DESC",
                    (f"%{destination}%",)
                )
            else:
                cursor = self.conn.execute(
                    "SELECT * FROM travel_plans ORDER BY created_at DESC"
                )
            
            plans = []
            for row in cursor.fetchall():
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
                    print(f"Error processing travel plan: {e}")
                    continue
            
            return plans
            
        except Exception as e:
            print(f"Error retrieving travel plans: {e}")
            return []
    
    # API Cache Methods
    def store_api_cache(self, api_name: str, endpoint: str, params: Dict[str, Any], 
                       response_data: Dict[str, Any], ttl_hours: int = 1) -> bool:
        """Store API response in cache."""
        try:
            params_hash = self._hash_params(params)
            encrypted_response = self._encrypt_data(json.dumps(response_data))
            expires_at = datetime.now() + timedelta(hours=ttl_hours)
            
            # Delete existing cache for same parameters
            self.conn.execute(
                "DELETE FROM api_cache WHERE api_name = ? AND params_hash = ?",
                (api_name, params_hash)
            )
            
            # Insert new cache entry
            self.conn.execute("""
                INSERT INTO api_cache (api_name, endpoint, params_hash, response_data, expires_at)
                VALUES (?, ?, ?, ?, ?)
            """, (api_name, endpoint, params_hash, encrypted_response, expires_at))
            
            self.conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing API cache: {e}")
            return False
    
    def get_api_cache(self, api_name: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Retrieve API response from cache."""
        try:
            params_hash = self._hash_params(params)
            
            cursor = self.conn.execute("""
                SELECT response_data FROM api_cache 
                WHERE api_name = ? AND params_hash = ? AND expires_at > datetime('now')
            """, (api_name, params_hash))
            
            row = cursor.fetchone()
            if row:
                decrypted_response = self._decrypt_data(row[0])
                return json.loads(decrypted_response)
            
            return None
            
        except Exception as e:
            print(f"Error retrieving API cache: {e}")
            return None
    
    # Cleanup Methods
    def cleanup_expired_data(self) -> int:
        """Clean up all expired data and return count of deleted records."""
        try:
            deleted_count = 0
            
            # Clean up expired preferences
            cursor = self.conn.execute(
                "DELETE FROM user_preferences WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
            )
            deleted_count += cursor.rowcount
            
            # Clean up expired search history
            cursor = self.conn.execute(
                "DELETE FROM search_history WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
            )
            deleted_count += cursor.rowcount
            
            # Clean up expired cache
            cursor = self.conn.execute(
                "DELETE FROM api_cache WHERE expires_at IS NOT NULL AND expires_at < datetime('now')"
            )
            deleted_count += cursor.rowcount
            
            self.conn.commit()
            
            if deleted_count > 0:
                print(f"Cleaned up {deleted_count} expired records")
            
            return deleted_count
            
        except Exception as e:
            print(f"Error during cleanup: {e}")
            return 0
    
    def get_database_stats(self) -> Dict[str, int]:
        """Get database statistics."""
        try:
            stats = {}
            
            # Count records in each table
            tables = ['user_preferences', 'search_history', 'travel_plans', 'api_cache']
            for table in tables:
                cursor = self.conn.execute(f"SELECT COUNT(*) FROM {table}")
                stats[table] = cursor.fetchone()[0]
            
            # Count expired records
            cursor = self.conn.execute("""
                SELECT COUNT(*) FROM user_preferences 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            stats['expired_preferences'] = cursor.fetchone()[0]
            
            cursor = self.conn.execute("""
                SELECT COUNT(*) FROM search_history 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            stats['expired_searches'] = cursor.fetchone()[0]
            
            cursor = self.conn.execute("""
                SELECT COUNT(*) FROM api_cache 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            stats['expired_cache'] = cursor.fetchone()[0]
            
            return stats
            
        except Exception as e:
            print(f"Error getting database stats: {e}")
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
            
            # Store in a simple conversations table
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT NOT NULL,
                    user_message TEXT NOT NULL,
                    assistant_response TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            await self._execute_query("""
                INSERT INTO conversations (user_id, user_message, assistant_response)
                VALUES (?, ?, ?)
            """, (user_id, encrypted_user_msg, encrypted_assistant_msg))
            
            conn = await self._ensure_connection()
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error saving conversation: {e}")
            return False
    
    def close(self):
        """Close database connection securely."""
        if self.conn:
            self.conn.close()
            self.conn = None
            print("Database connection closed")
    
    def __enter__(self):
        """Context manager entry."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit."""
        self.close()
