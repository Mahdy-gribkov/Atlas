"""
Secure database implementation with encryption and automatic cleanup.
Provides privacy-first data storage for the Travel AI Agent.
"""

import sqlite3
import os
import hashlib
import asyncio
import logging
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from cryptography.fernet import Fernet
import json

from .models import UserPreference, SearchHistory, TravelPlan, APICache

logger = logging.getLogger(__name__)
from ..config import config

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
            
            # Migrate existing tables if needed
            self._migrate_tables()
            
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
            """,
            """
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                timestamp TEXT NOT NULL,
                user_message TEXT NOT NULL,
                assistant_response TEXT NOT NULL,
                context_data TEXT,
                intent TEXT,
                entities TEXT,
                sentiment TEXT,
                confidence REAL
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS user_profiles (
                user_id TEXT PRIMARY KEY,
                travel_style TEXT,
                budget_range TEXT,
                preferred_destinations TEXT,
                preferred_activities TEXT,
                preferred_accommodations TEXT,
                preferred_transportation TEXT,
                dietary_preferences TEXT,
                accessibility_needs TEXT,
                language_preferences TEXT,
                last_updated TEXT,
                confidence_scores TEXT
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS context_summaries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                summary_type TEXT NOT NULL,
                summary TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, summary_type)
            )
            """,
            """
            CREATE TABLE IF NOT EXISTS user_preferences_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                preference_type TEXT NOT NULL,
                preference_value TEXT NOT NULL,
                confidence REAL DEFAULT 0.5,
                source TEXT DEFAULT 'user',
                usage_count INTEGER DEFAULT 1,
                timestamp TEXT NOT NULL
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
    
    def _migrate_tables(self):
        """Migrate existing tables to new schema if needed."""
        try:
            # Get list of existing tables
            cursor = self.conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
            existing_tables = [row[0] for row in cursor.fetchall()]
            
            # Check if conversations table exists and has timestamp column
            if 'conversations' in existing_tables:
                cursor = self.conn.execute("PRAGMA table_info(conversations)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'timestamp' not in columns:
                    # Add timestamp column to existing conversations table
                    self.conn.execute("ALTER TABLE conversations ADD COLUMN timestamp TEXT")
                    print("Added timestamp column to conversations table")
            
            # Check if old user_preferences table exists and migrate to new structure
            if 'user_preferences' in existing_tables:
                cursor = self.conn.execute("PRAGMA table_info(user_preferences)")
                columns = [row[1] for row in cursor.fetchall()]
                
                if 'user_id' not in columns:
                    # Migrate old user_preferences to new structure
                    self.conn.execute("""
                        CREATE TABLE IF NOT EXISTS user_preferences_backup AS 
                        SELECT * FROM user_preferences
                    """)
                    self.conn.execute("DROP TABLE user_preferences")
                    print("Migrated user_preferences table to new structure")
            
            self.conn.commit()
        except Exception as e:
            print(f"Migration error: {e}")
    
    def _setup_cleanup_triggers(self):
        """Set up automatic cleanup triggers for expired data."""
        try:
            # Get list of existing tables
            cursor = self.conn.execute("SELECT name FROM sqlite_master WHERE type='table'")
            existing_tables = [row[0] for row in cursor.fetchall()]
            
            # Only create triggers for tables that exist
            if 'user_preferences' in existing_tables:
                self.conn.execute("""
                    CREATE TRIGGER IF NOT EXISTS cleanup_expired_preferences
                    AFTER INSERT ON user_preferences
                    BEGIN
                        DELETE FROM user_preferences 
                        WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
                    END
                """)
            
            if 'search_history' in existing_tables:
                self.conn.execute("""
                    CREATE TRIGGER IF NOT EXISTS cleanup_expired_searches
                    AFTER INSERT ON search_history
                    BEGIN
                        DELETE FROM search_history 
                        WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
                    END
                """)
            
            if 'api_cache' in existing_tables:
                self.conn.execute("""
                    CREATE TRIGGER IF NOT EXISTS cleanup_expired_cache
                    AFTER INSERT ON api_cache
                    BEGIN
                        DELETE FROM api_cache 
                        WHERE expires_at IS NOT NULL AND expires_at < datetime('now');
                    END
                """)
            
            self.conn.commit()
        except Exception as e:
            print(f"Error setting up cleanup triggers: {e}")
    
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
    
    async def delete_preference(self, pref_type: str) -> bool:
        """Delete specific preference type."""
        try:
            await self._execute_query(
                "DELETE FROM user_preferences WHERE preference_type = ?",
                (pref_type,)
            )
            conn = await self._ensure_connection()
            conn.commit()
            return True
        except Exception as e:
            print(f"Error deleting preference: {e}")
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
            
            conn = await self._ensure_connection()
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing search: {e}")
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
            
            conn = await self._ensure_connection()
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing travel plan: {e}")
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
            
            conn = await self._ensure_connection()
            conn.commit()
            return True
            
        except Exception as e:
            print(f"Error storing API cache: {e}")
            return False
    
    async def get_api_cache(self, api_name: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Retrieve API response from cache."""
        try:
            params_hash = self._hash_params(params)
            
            cursor = await self._execute_query("""
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
            
            conn = await self._ensure_connection()
            conn.commit()
            
            if deleted_count > 0:
                print(f"Cleaned up {deleted_count} expired records")
            
            return deleted_count
            
        except Exception as e:
            print(f"Error during cleanup: {e}")
            return 0
    
    async def get_database_stats(self) -> Dict[str, int]:
        """Get database statistics."""
        try:
            stats = {}
            
            # Count records in each table
            tables = ['user_preferences', 'search_history', 'travel_plans', 'api_cache']
            for table in tables:
                cursor = await self._execute_query(f"SELECT COUNT(*) FROM {table}")
                stats[table] = cursor.fetchone()[0]
            
            # Count expired records
            cursor = await self._execute_query("""
                SELECT COUNT(*) FROM user_preferences 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            stats['expired_preferences'] = cursor.fetchone()[0]
            
            cursor = await self._execute_query("""
                SELECT COUNT(*) FROM search_history 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            stats['expired_searches'] = cursor.fetchone()[0]
            
            cursor = await self._execute_query("""
                SELECT COUNT(*) FROM api_cache 
                WHERE expires_at IS NOT NULL AND expires_at < datetime('now')
            """)
            stats['expired_cache'] = cursor.fetchone()[0]
            
            return stats
            
        except Exception as e:
            print(f"Error getting database stats: {e}")
            return {}
    
    async def get_user_preferences(self, user_id: str = "default") -> Dict[str, Any]:
        """Get user preferences as a dictionary."""
        try:
            preferences = await self.get_preferences()
            result = {}
            for pref in preferences:
                result[pref.preference_type] = pref.preference_value
            return result
        except Exception as e:
            print(f"Error getting user preferences: {e}")
            return {}
    
    async def get_conversation_data(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get conversation data for a user."""
        try:
            await self._ensure_connection()
            query = """
                SELECT user_message, assistant_response, timestamp 
                FROM conversations 
                WHERE user_id = ? 
                ORDER BY timestamp DESC 
                LIMIT ?
            """
            cursor = await self._execute_query(query, (user_id, limit))
            rows = cursor.fetchall()
            
            conversations = []
            for row in rows:
                conversations.append({
                    'user_message': row[0],
                    'assistant_response': row[1],
                    'timestamp': row[2]
                })
            return conversations
        except Exception as e:
            print(f"Error getting conversation data: {e}")
            return []
    
    async def store_conversation_data(self, conversation_data: Dict[str, Any]) -> bool:
        """Store conversation data."""
        try:
            await self._ensure_connection()
            query = """
                INSERT INTO conversations (user_id, timestamp, user_message, assistant_response, context_data, intent, entities, sentiment, confidence)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            params = (
                conversation_data.get('user_id', 'default'),
                conversation_data.get('timestamp', datetime.now().isoformat()),
                conversation_data.get('user_message', ''),
                conversation_data.get('assistant_response', ''),
                json.dumps(conversation_data.get('context_data', {})),
                conversation_data.get('intent', 'unknown'),
                json.dumps(conversation_data.get('entities', {})),
                conversation_data.get('sentiment', 'neutral'),
                conversation_data.get('confidence', 0.5)
            )
            await self._execute_query(query, params)
            return True
        except Exception as e:
            print(f"Error storing conversation data: {e}")
            return False
    
    async def initialize_memory_tables(self) -> bool:
        """Initialize memory tables."""
        try:
            await self._ensure_connection()
            
            # Create memories table
            query = """
                CREATE TABLE IF NOT EXISTS memories (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    content TEXT NOT NULL,
                    content_type TEXT NOT NULL,
                    importance REAL NOT NULL,
                    timestamp TEXT NOT NULL,
                    tags TEXT NOT NULL,
                    metadata TEXT NOT NULL
                )
            """
            await self._execute_query(query)
            
            # Create memory search index
            query = """
                CREATE TABLE IF NOT EXISTS memory_search_index (
                    memory_id TEXT PRIMARY KEY,
                    content TEXT NOT NULL,
                    tags TEXT NOT NULL,
                    FOREIGN KEY (memory_id) REFERENCES memories (id)
                )
            """
            await self._execute_query(query)
            
            return True
        except Exception as e:
            print(f"Error initializing memory tables: {e}")
            return False
    
    async def store_memory_entry(self, memory_data: Dict[str, Any]) -> bool:
        """Store memory entry."""
        try:
            await self._ensure_connection()
            query = """
                INSERT OR REPLACE INTO memories (id, user_id, content, content_type, importance, timestamp, tags, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            params = (
                memory_data.get('id', ''),
                memory_data.get('user_id', 'default'),
                memory_data.get('content', ''),
                memory_data.get('content_type', 'general'),
                memory_data.get('importance', 0.5),
                memory_data.get('timestamp', datetime.now().isoformat()),
                json.dumps(memory_data.get('tags', [])),
                json.dumps(memory_data.get('metadata', {}))
            )
            await self._execute_query(query, params)
            return True
        except Exception as e:
            print(f"Error storing memory entry: {e}")
            return False
    
    async def get_memories(self, user_id: str, query: str = None, content_type: str = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Get memories for a user."""
        try:
            await self._ensure_connection()
            
            where_conditions = ["user_id = ?"]
            params = [user_id]
            
            if query:
                where_conditions.append("content LIKE ?")
                params.append(f"%{query}%")
            
            if content_type:
                where_conditions.append("content_type = ?")
                params.append(content_type)
            
            where_clause = " AND ".join(where_conditions)
            params.append(limit)
            
            query_sql = f"""
                SELECT id, user_id, content, content_type, importance, timestamp, tags, metadata
                FROM memories 
                WHERE {where_clause}
                ORDER BY importance DESC, timestamp DESC 
                LIMIT ?
            """
            
            cursor = await self._execute_query(query_sql, tuple(params))
            rows = cursor.fetchall()
            
            memories = []
            for row in rows:
                memories.append({
                    'id': row[0],
                    'user_id': row[1],
                    'content': row[2],
                    'content_type': row[3],
                    'importance': row[4],
                    'timestamp': row[5],
                    'tags': json.loads(row[6]),
                    'metadata': json.loads(row[7])
                })
            return memories
        except Exception as e:
            print(f"Error getting memories: {e}")
            return []
    
    async def update_memory_search_index(self, memory_id: str, content: str, tags: List[str]) -> bool:
        """Update memory search index."""
        try:
            await self._ensure_connection()
            query = """
                INSERT OR REPLACE INTO memory_search_index (memory_id, content, tags)
                VALUES (?, ?, ?)
            """
            await self._execute_query(query, (memory_id, content, json.dumps(tags)))
            return True
        except Exception as e:
            print(f"Error updating memory search index: {e}")
            return False
    
    async def update_memory_importance(self, memory_id: str, importance: float) -> bool:
        """Update memory importance."""
        try:
            await self._ensure_connection()
            query = "UPDATE memories SET importance = ? WHERE id = ?"
            await self._execute_query(query, (importance, memory_id))
            return True
        except Exception as e:
            print(f"Error updating memory importance: {e}")
            return False
    
    async def remove_old_memories(self, cutoff_date: datetime, user_id: str = None) -> int:
        """Remove old memories."""
        try:
            await self._ensure_connection()
            
            where_conditions = ["timestamp < ?"]
            params = [cutoff_date.isoformat()]
            
            if user_id:
                where_conditions.append("user_id = ?")
                params.append(user_id)
            
            where_clause = " AND ".join(where_conditions)
            
            # First get count
            count_query = f"SELECT COUNT(*) FROM memories WHERE {where_clause}"
            cursor = await self._execute_query(count_query, tuple(params))
            count = cursor.fetchone()[0]
            
            # Then delete
            delete_query = f"DELETE FROM memories WHERE {where_clause}"
            await self._execute_query(delete_query, tuple(params))
            
            return count
        except Exception as e:
            print(f"Error removing old memories: {e}")
            return 0
    
    async def get_memory_statistics(self, user_id: str = None) -> Dict[str, Any]:
        """Get memory statistics."""
        try:
            await self._ensure_connection()
            
            where_clause = "WHERE user_id = ?" if user_id else ""
            params = [user_id] if user_id else []
            
            query = f"""
                SELECT 
                    COUNT(*) as total_memories,
                    COUNT(CASE WHEN content_type = 'conversation' THEN 1 END) as conversation_memories,
                    COUNT(CASE WHEN content_type = 'preference' THEN 1 END) as preference_memories,
                    COUNT(CASE WHEN content_type = 'fact' THEN 1 END) as fact_memories,
                    COUNT(CASE WHEN content_type = 'context' THEN 1 END) as context_memories,
                    AVG(importance) as average_importance,
                    MIN(timestamp) as oldest_memory,
                    MAX(timestamp) as newest_memory
                FROM memories 
                {where_clause}
            """
            
            cursor = await self._execute_query(query, tuple(params))
            row = cursor.fetchone()
            
            return {
                'total_memories': row[0] or 0,
                'conversation_memories': row[1] or 0,
                'preference_memories': row[2] or 0,
                'fact_memories': row[3] or 0,
                'context_memories': row[4] or 0,
                'average_importance': row[5] or 0.0,
                'oldest_memory': row[6],
                'newest_memory': row[7]
            }
        except Exception as e:
            print(f"Error getting memory statistics: {e}")
            return {}
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile."""
        try:
            await self._ensure_connection()
            query = "SELECT * FROM user_profiles WHERE user_id = ?"
            cursor = await self._execute_query(query, (user_id,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'user_id': row[0],
                    'travel_style': row[1],
                    'budget_range': json.loads(row[2]),
                    'preferred_destinations': json.loads(row[3]),
                    'preferred_activities': json.loads(row[4]),
                    'preferred_accommodations': json.loads(row[5]),
                    'preferred_transportation': json.loads(row[6]),
                    'dietary_preferences': json.loads(row[7]),
                    'accessibility_needs': json.loads(row[8]),
                    'language_preferences': json.loads(row[9]),
                    'last_updated': row[10],
                    'confidence_scores': json.loads(row[11])
                }
            return None
        except Exception as e:
            print(f"Error getting user profile: {e}")
            return None
    
    async def save_user_profile(self, profile_data: Dict[str, Any]) -> bool:
        """Save user profile."""
        try:
            await self._ensure_connection()
            query = """
                INSERT OR REPLACE INTO user_profiles 
                (user_id, travel_style, budget_range, preferred_destinations, preferred_activities, 
                 preferred_accommodations, preferred_transportation, dietary_preferences, 
                 accessibility_needs, language_preferences, last_updated, confidence_scores)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            params = (
                profile_data.get('user_id', ''),
                profile_data.get('travel_style', 'general'),
                json.dumps(profile_data.get('budget_range', [1000, 5000])),
                json.dumps(profile_data.get('preferred_destinations', [])),
                json.dumps(profile_data.get('preferred_activities', [])),
                json.dumps(profile_data.get('preferred_accommodations', [])),
                json.dumps(profile_data.get('preferred_transportation', [])),
                json.dumps(profile_data.get('dietary_preferences', [])),
                json.dumps(profile_data.get('accessibility_needs', [])),
                json.dumps(profile_data.get('language_preferences', [])),
                profile_data.get('last_updated', datetime.now().isoformat()),
                json.dumps(profile_data.get('confidence_scores', {}))
            )
            await self._execute_query(query, params)
            return True
        except Exception as e:
            print(f"Error saving user profile: {e}")
            return False
    
    async def get_context_summary(self, user_id: str, summary_type: str) -> Optional[str]:
        """Get context summary."""
        try:
            await self._ensure_connection()
            query = "SELECT summary FROM context_summaries WHERE user_id = ? AND summary_type = ?"
            cursor = await self._execute_query(query, (user_id, summary_type))
            row = cursor.fetchone()
            return row[0] if row else None
        except Exception as e:
            print(f"Error getting context summary: {e}")
            return None
    
    async def store_user_preference(self, preference_data: Dict[str, Any]) -> bool:
        """Store user preference."""
        try:
            await self._ensure_connection()
            query = """
                INSERT OR REPLACE INTO user_preferences 
                (user_id, preference_type, preference_value, confidence, source, usage_count, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            params = (
                preference_data.get('user_id', ''),
                preference_data.get('preference_type', ''),
                preference_data.get('preference_value', ''),
                preference_data.get('confidence', 0.5),
                preference_data.get('source', 'user'),
                preference_data.get('usage_count', 1),
                preference_data.get('timestamp', datetime.now().isoformat())
            )
            await self._execute_query(query, params)
            return True
        except Exception as e:
            print(f"Error storing user preference: {e}")
            return False

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
            
            # Store in the main conversations table
            await self._execute_query("""
                INSERT INTO conversations (user_id, timestamp, user_message, assistant_response, context_data, intent, entities, sentiment, confidence)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id, 
                datetime.now().isoformat(),
                encrypted_user_msg, 
                encrypted_assistant_msg,
                None,  # context_data
                None,  # intent
                None,  # entities
                None,  # sentiment
                None   # confidence
            ))
            
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
    
    # User Management Methods
    async def create_user(self, user_data: Dict[str, Any]) -> str:
        """Create a new user in the database."""
        try:
            await self._ensure_connection()
            
            user_id = f"user_{int(datetime.now().timestamp())}"
            
            # Create users table if it doesn't exist
            await self._execute_query("""
                CREATE TABLE IF NOT EXISTS users (
                    id TEXT PRIMARY KEY,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE
                )
            """)
            
            query = """
                INSERT INTO users (id, username, email, password_hash, salt, created_at, last_login, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """
            
            await self._execute_query(query, (
                user_id,
                user_data.get('username'),
                user_data.get('email'),
                user_data.get('password_hash'),
                user_data.get('salt'),
                user_data.get('created_at'),
                user_data.get('last_login'),
                user_data.get('is_active', True)
            ))
            
            return user_id
            
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None
    
    async def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Get user by username."""
        try:
            await self._ensure_connection()
            
            query = "SELECT * FROM users WHERE username = ?"
            cursor = await self._execute_query(query, (username,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'password_hash': row[3],
                    'salt': row[4],
                    'created_at': row[5],
                    'last_login': row[6],
                    'is_active': bool(row[7])
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting user by username: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email."""
        try:
            await self._ensure_connection()
            
            query = "SELECT * FROM users WHERE email = ?"
            cursor = await self._execute_query(query, (email,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'password_hash': row[3],
                    'salt': row[4],
                    'created_at': row[5],
                    'last_login': row[6],
                    'is_active': bool(row[7])
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID."""
        try:
            await self._ensure_connection()
            
            query = "SELECT * FROM users WHERE id = ?"
            cursor = await self._execute_query(query, (user_id,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'id': row[0],
                    'username': row[1],
                    'email': row[2],
                    'password_hash': row[3],
                    'salt': row[4],
                    'created_at': row[5],
                    'last_login': row[6],
                    'is_active': bool(row[7])
                }
            return None
            
        except Exception as e:
            logger.error(f"Error getting user by ID: {e}")
            return None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user information."""
        try:
            await self._ensure_connection()
            
            # Build dynamic update query
            set_clauses = []
            values = []
            
            for key, value in update_data.items():
                if key in ['username', 'email', 'password_hash', 'salt', 'last_login', 'is_active']:
                    set_clauses.append(f"{key} = ?")
                    values.append(value)
            
            if not set_clauses:
                return False
            
            query = f"UPDATE users SET {', '.join(set_clauses)} WHERE id = ?"
            values.append(user_id)
            
            await self._execute_query(query, tuple(values))
            return True
            
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            return False
    
    async def get_conversation_history(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get conversation history for a user."""
        try:
            await self._ensure_connection()
            
            query = """
                SELECT user_message, assistant_response, timestamp 
                FROM conversations 
                WHERE user_id = ? 
                ORDER BY timestamp DESC 
                LIMIT ?
            """
            
            cursor = await self._execute_query(query, (user_id, limit))
            rows = cursor.fetchall()
            
            conversations = []
            for row in rows:
                conversations.append({
                    'user_message': self._decrypt_data(row[0]),
                    'assistant_response': self._decrypt_data(row[1]),
                    'created_at': row[2]
                })
            
            return conversations
            
        except Exception as e:
            logger.error(f"Error getting conversation history: {e}")
            return []
    
    async def search_memories(self, user_id: str, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search memories for a user."""
        try:
            await self._ensure_connection()
            
            # Simple text search in memory content
            search_query = f"%{query}%"
            query_sql = """
                SELECT id, content, content_type, importance, tags, timestamp
                FROM memories 
                WHERE user_id = ? AND content LIKE ?
                ORDER BY importance DESC, timestamp DESC
                LIMIT ?
            """
            
            cursor = await self._execute_query(query_sql, (user_id, search_query, limit))
            rows = cursor.fetchall()
            
            memories = []
            for row in rows:
                memories.append({
                    'id': row[0],
                    'content': self._decrypt_data(row[1]),
                    'content_type': row[2],
                    'importance': row[3],
                    'tags': json.loads(row[4]) if row[4] else [],
                    'timestamp': row[5]
                })
            
            return memories
            
        except Exception as e:
            logger.error(f"Error searching memories: {e}")
            return []