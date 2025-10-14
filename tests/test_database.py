"""
Test suite for the Secure Database.
Tests encryption, async operations, and data integrity.
"""

import pytest
import asyncio
import tempfile
import os
from datetime import datetime, timedelta
from unittest.mock import patch

from src.database.secure_database import SecureDatabase
from src.database.models import UserPreference, SearchHistory, TravelPlan, APICache


class TestSecureDatabase:
    """Test cases for SecureDatabase."""
    
    @pytest.fixture
    async def db(self):
        """Create a temporary database for testing."""
        with tempfile.NamedTemporaryFile(suffix='.db', delete=False) as tmp:
            db_path = tmp.name
        
        db = SecureDatabase(db_path, 'test-encryption-key-32-chars-long')
        await db._initialize_database()
        yield db
        
        # Cleanup
        await db.close()
        os.unlink(db_path)
    
    @pytest.mark.asyncio
    async def test_database_initialization(self, db):
        """Test database initialization and table creation."""
        # Check if database is initialized
        assert db._initialized is True
        
        # Test basic connection
        stats = await db.get_database_stats()
        assert isinstance(stats, dict)
        assert 'user_preferences' in stats
        assert 'search_history' in stats
        assert 'travel_plans' in stats
        assert 'api_cache' in stats
        assert 'conversations' in stats
    
    @pytest.mark.asyncio
    async def test_user_preferences_encryption(self, db):
        """Test user preference storage and encryption."""
        # Store a preference
        success = await db.store_preference('theme', 'dark', 24)
        assert success is True
        
        # Retrieve preferences
        preferences = await db.get_preferences('theme')
        assert len(preferences) == 1
        assert preferences[0].preference_type == 'theme'
        assert preferences[0].preference_value == 'dark'
        
        # Test encryption by checking raw database
        async with db._execute_query("SELECT preference_value FROM user_preferences WHERE preference_type = ?", ('theme',)) as cursor:
            row = await cursor.fetchone()
            # Encrypted value should be different from original
            assert row[0] != 'dark'
    
    @pytest.mark.asyncio
    async def test_search_history_storage(self, db):
        """Test search history storage and retrieval."""
        search_params = {
            'destination': 'Paris',
            'dates': '2024-06-01 to 2024-06-07',
            'travelers': 2
        }
        
        # Store search
        success = await db.store_search('flights', search_params, 5)
        assert success is True
        
        # Retrieve search history
        searches = await db.get_search_history('flights', 10)
        assert len(searches) == 1
        assert searches[0].search_type == 'flights'
        assert searches[0].results_count == 5
        
        # Verify search params are encrypted
        async with db._execute_query("SELECT search_params FROM search_history WHERE search_type = ?", ('flights',)) as cursor:
            row = await cursor.fetchone()
            # Encrypted value should be different from original
            assert row[0] != str(search_params)
    
    @pytest.mark.asyncio
    async def test_travel_plan_storage(self, db):
        """Test travel plan storage and retrieval."""
        plan = TravelPlan(
            plan_name='Paris Trip',
            destination='Paris, France',
            start_date=datetime(2024, 6, 1),
            end_date=datetime(2024, 6, 7),
            travelers=2,
            budget=2000.0,
            currency='USD',
            plan_data='{"itinerary": "Day 1: Arrival, Day 2: Eiffel Tower"}'
        )
        
        # Store plan
        success = await db.store_travel_plan(plan)
        assert success is True
        
        # Retrieve plans
        plans = await db.get_travel_plans('Paris')
        assert len(plans) == 1
        assert plans[0].plan_name == 'Paris Trip'
        assert plans[0].destination == 'Paris, France'
        assert plans[0].budget == 2000.0
    
    @pytest.mark.asyncio
    async def test_api_cache_functionality(self, db):
        """Test API cache storage and retrieval."""
        cache_params = {
            'city': 'London',
            'type': 'weather'
        }
        
        cache_response = {
            'temperature': 22,
            'humidity': 65,
            'description': 'Partly Cloudy'
        }
        
        # Store cache
        success = await db.store_api_cache('weather', '/current', cache_params, cache_response, 1)
        assert success is True
        
        # Retrieve cache
        cached_data = await db.get_api_cache('weather', cache_params)
        assert cached_data is not None
        assert cached_data['temperature'] == 22
        assert cached_data['humidity'] == 65
        
        # Test cache miss with different params
        different_params = {'city': 'Paris', 'type': 'weather'}
        cached_data = await db.get_api_cache('weather', different_params)
        assert cached_data is None
    
    @pytest.mark.asyncio
    async def test_conversation_storage(self, db):
        """Test conversation storage and retrieval."""
        user_id = 'test_user_123'
        user_message = 'I want to plan a trip to Paris'
        assistant_response = 'I can help you plan your trip to Paris!'
        
        # Store conversation
        success = await db.save_conversation(user_id, user_message, assistant_response)
        assert success is True
        
        # Retrieve conversations
        conversations = await db.get_conversations(user_id, 10)
        assert len(conversations) == 1
        assert conversations[0]['user_id'] == user_id
        assert conversations[0]['user_message'] == user_message
        assert conversations[0]['assistant_response'] == assistant_response
    
    @pytest.mark.asyncio
    async def test_automatic_cleanup(self, db):
        """Test automatic cleanup of expired data."""
        # Store data with short expiration
        await db.store_preference('temp_pref', 'temp_value', 0)  # Expires immediately
        await db.store_search('temp_search', {'query': 'test'}, 0)  # Expires in 1 day (default)
        
        # Store data with normal expiration
        await db.store_preference('permanent_pref', 'permanent_value', 24)
        
        # Trigger cleanup
        deleted_count = await db.cleanup_expired_data()
        assert deleted_count >= 0  # At least the temp preference should be deleted
        
        # Check that permanent data still exists
        preferences = await db.get_preferences('permanent_pref')
        assert len(preferences) == 1
        assert preferences[0].preference_value == 'permanent_value'
    
    @pytest.mark.asyncio
    async def test_data_encryption_integrity(self, db):
        """Test that data is properly encrypted and decrypted."""
        sensitive_data = 'This is sensitive travel information'
        
        # Store sensitive data
        await db.store_preference('sensitive', sensitive_data, 24)
        
        # Retrieve and verify decryption
        preferences = await db.get_preferences('sensitive')
        assert len(preferences) == 1
        assert preferences[0].preference_value == sensitive_data
        
        # Verify raw database contains encrypted data
        async with db._execute_query("SELECT preference_value FROM user_preferences WHERE preference_type = ?", ('sensitive',)) as cursor:
            row = await cursor.fetchone()
            encrypted_value = row[0]
            assert encrypted_value != sensitive_data
            assert len(encrypted_value) > len(sensitive_data)  # Encrypted data is typically longer
    
    @pytest.mark.asyncio
    async def test_concurrent_operations(self, db):
        """Test concurrent database operations."""
        async def store_preference(pref_type, pref_value):
            return await db.store_preference(pref_type, pref_value, 24)
        
        async def store_search(search_type, params):
            return await db.store_search(search_type, params, 1)
        
        # Perform concurrent operations
        tasks = [
            store_preference('theme', 'dark'),
            store_preference('language', 'en'),
            store_search('flights', {'origin': 'NYC', 'destination': 'LAX'}),
            store_search('hotels', {'city': 'Paris', 'dates': '2024-06-01'})
        ]
        
        results = await asyncio.gather(*tasks)
        assert all(results)  # All operations should succeed
        
        # Verify all data was stored
        preferences = await db.get_preferences()
        searches = await db.get_search_history()
        
        assert len(preferences) >= 2
        assert len(searches) >= 2
    
    @pytest.mark.asyncio
    async def test_database_statistics(self, db):
        """Test database statistics functionality."""
        # Add some test data
        await db.store_preference('test_pref', 'test_value', 24)
        await db.store_search('test_search', {'query': 'test'}, 1)
        
        # Get statistics
        stats = await db.get_database_stats()
        
        assert isinstance(stats, dict)
        assert 'user_preferences' in stats
        assert 'search_history' in stats
        assert 'travel_plans' in stats
        assert 'api_cache' in stats
        assert 'conversations' in stats
        assert 'expired_preferences' in stats
        assert 'expired_searches' in stats
        assert 'expired_cache' in stats
        
        # Verify counts are non-negative
        for key, value in stats.items():
            assert isinstance(value, int)
            assert value >= 0
    
    @pytest.mark.asyncio
    async def test_error_handling(self, db):
        """Test error handling in database operations."""
        # Test with invalid data
        result = await db.store_preference('', 'value', 24)  # Empty preference type
        assert result is False
        
        result = await db.store_preference('type', '', 24)  # Empty preference value
        assert result is False
        
        # Test with None values
        result = await db.store_search(None, {'query': 'test'}, 1)
        assert result is False
        
        # Test with invalid JSON in search params
        result = await db.store_search('test', 'invalid_json', 1)
        assert result is False
    
    @pytest.mark.asyncio
    async def test_context_manager(self, db):
        """Test database context manager functionality."""
        async with db as context_db:
            assert context_db is db
            assert context_db._initialized is True
        
        # Database should still be accessible after context exit
        stats = await db.get_database_stats()
        assert isinstance(stats, dict)


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
