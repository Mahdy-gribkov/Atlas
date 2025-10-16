"""
Complete Architecture Test
Tests the full functionality of the refactored architecture with real database operations.
"""

import asyncio
import logging
import sys
import os
from datetime import datetime

# Add project root to path for imports
project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, project_root)

from src.database.secure_database import SecureDatabase
from src.context.advanced_context_manager import AdvancedContextManager
from src.context.context_provider import ContextProvider, ContextData
from travel_agent import TravelAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_database_methods():
    """Test that all database methods work correctly."""
    logger.info("Testing Database Methods")
    
    database = SecureDatabase(db_path="./data/test_db.db")
    
    # Test user preferences
    user_id = "test_user_db"
    preferences = await database.get_user_preferences(user_id)
    assert isinstance(preferences, dict), "get_user_preferences should return a dictionary"
    logger.info("SUCCESS: get_user_preferences works")
    
    # Test conversation data
    conversation_data = await database.get_conversation_data(user_id, 5)
    assert isinstance(conversation_data, list), "get_conversation_data should return a list"
    logger.info("SUCCESS: get_conversation_data works")
    
    # Test memory tables initialization
    result = await database.initialize_memory_tables()
    assert result is True, "initialize_memory_tables should return True"
    logger.info("SUCCESS: initialize_memory_tables works")
    
    # Test storing memory entry
    memory_data = {
        'id': 'test_memory_1',
        'user_id': user_id,
        'content': 'Test memory content',
        'content_type': 'test',
        'importance': 0.8,
        'timestamp': datetime.now().isoformat(),
        'tags': ['test', 'memory'],
        'metadata': {'source': 'test'}
    }
    result = await database.store_memory_entry(memory_data)
    assert result is True, "store_memory_entry should return True"
    logger.info("SUCCESS: store_memory_entry works")
    
    # Test getting memories
    memories = await database.get_memories(user_id, limit=5)
    assert isinstance(memories, list), "get_memories should return a list"
    logger.info("SUCCESS: get_memories works")
    
    # Test user profile
    profile_data = {
        'user_id': user_id,
        'travel_style': 'luxury',
        'budget_range': [5000, 10000],
        'preferred_destinations': ['Paris', 'Tokyo'],
        'preferred_activities': ['museums', 'fine_dining'],
        'preferred_accommodations': ['hotels'],
        'preferred_transportation': ['flight'],
        'dietary_preferences': ['vegetarian'],
        'accessibility_needs': [],
        'language_preferences': ['english'],
        'last_updated': datetime.now().isoformat(),
        'confidence_scores': {'travel_style': 0.9}
    }
    result = await database.save_user_profile(profile_data)
    assert result is True, "save_user_profile should return True"
    logger.info("SUCCESS: save_user_profile works")
    
    # Test getting user profile
    profile = await database.get_user_profile(user_id)
    assert isinstance(profile, dict), "get_user_profile should return a dictionary"
    assert profile['travel_style'] == 'luxury', "Profile should contain correct data"
    logger.info("SUCCESS: get_user_profile works")
    
    logger.info("COMPLETED: All database methods work correctly")


async def test_context_manager_methods():
    """Test that all context manager methods work correctly."""
    logger.info("Testing Context Manager Methods")
    
    database = SecureDatabase(db_path="./data/test_cm.db")
    context_manager = AdvancedContextManager(database)
    
    user_id = "test_user_cm"
    
    # Test get_user_context
    user_context = await context_manager.get_user_context(user_id)
    assert isinstance(user_context, dict), "get_user_context should return a dictionary"
    assert 'user_id' in user_context, "User context should contain user_id"
    assert 'preferences' in user_context, "User context should contain preferences"
    assert 'conversation_history' in user_context, "User context should contain conversation_history"
    assert 'memory_context' in user_context, "User context should contain memory_context"
    logger.info("SUCCESS: get_user_context works")
    
    # Test orchestrate_context_flow
    query = "Plan a trip to Japan"
    orchestrated_context = await context_manager.orchestrate_context_flow(user_id, query)
    assert isinstance(orchestrated_context, dict), "orchestrate_context_flow should return a dictionary"
    assert 'orchestration_timestamp' in orchestrated_context, "Should contain orchestration timestamp"
    assert 'context_provider' in orchestrated_context, "Should contain context provider info"
    logger.info("SUCCESS: orchestrate_context_flow works")
    
    # Test store_interaction_context
    interaction_data = {
        'user_message': 'I want to visit Tokyo',
        'assistant_response': 'Tokyo is a great destination!',
        'context_data': {'destination': 'Tokyo'},
        'intent': 'travel_planning',
        'entities': {'destination': 'Tokyo'},
        'sentiment': 'positive',
        'topics': ['travel', 'tokyo']
    }
    result = await context_manager.store_interaction_context(user_id, interaction_data)
    assert result is True, "store_interaction_context should return True"
    logger.info("SUCCESS: store_interaction_context works")
    
    # Test get_conversation_context
    conversation_context = await context_manager.get_conversation_context(user_id, 5)
    assert isinstance(conversation_context, list), "get_conversation_context should return a list"
    logger.info("SUCCESS: get_conversation_context works")
    
    # Test get_preferences_context
    preferences_context = await context_manager.get_preferences_context(user_id)
    assert isinstance(preferences_context, dict), "get_preferences_context should return a dictionary"
    logger.info("SUCCESS: get_preferences_context works")
    
    # Test get_memory_context
    memory_context = await context_manager.get_memory_context(user_id, "Tokyo")
    assert isinstance(memory_context, list), "get_memory_context should return a list"
    logger.info("SUCCESS: get_memory_context works")
    
    logger.info("COMPLETED: All context manager methods work correctly")


async def test_travel_agent_integration():
    """Test that TravelAgent works with the new architecture."""
    logger.info("Testing TravelAgent Integration")
    
    # Use a different database file to avoid locking
    import os
    os.environ['DATABASE_PATH'] = './data/test_agent.db'
    agent = TravelAgent()
    
    # Test that agent has context_provider
    assert hasattr(agent, 'context_provider'), "TravelAgent should have context_provider"
    assert isinstance(agent.context_provider, ContextProvider), "context_provider should implement ContextProvider"
    logger.info("SUCCESS: TravelAgent uses ContextProvider")
    
    # Test that agent can get context through provider
    user_id = "test_user_agent"
    query = "What's the weather like in Paris?"
    
    try:
        context = await agent.context_provider.orchestrate_context_flow(user_id, query)
        assert isinstance(context, dict), "Context should be a dictionary"
        logger.info("SUCCESS: TravelAgent can get context through ContextProvider")
    except Exception as e:
        logger.error(f"Error testing TravelAgent context: {e}")
        raise
    
    # Test that agent can store interaction context
    interaction_data = {
        'user_message': 'Plan a trip to Paris',
        'assistant_response': 'I can help you plan a trip to Paris!',
        'context_data': {'destination': 'Paris'},
        'intent': 'travel_planning',
        'entities': {'destination': 'Paris'},
        'sentiment': 'positive',
        'topics': ['travel', 'paris']
    }
    
    result = await agent.context_provider.store_interaction_context(user_id, interaction_data)
    assert result is True, "store_interaction_context should return True"
    logger.info("SUCCESS: TravelAgent can store interaction context")
    
    logger.info("COMPLETED: TravelAgent integration works correctly")


async def test_end_to_end_workflow():
    """Test complete end-to-end workflow."""
    logger.info("Testing End-to-End Workflow")
    
    # Use a different database file to avoid locking
    import os
    os.environ['DATABASE_PATH'] = './data/test_e2e.db'
    agent = TravelAgent()
    user_id = "test_user_e2e"
    query = "I want to plan a luxury trip to Japan for 2 weeks"
    
    # Step 1: Get context
    context = await agent.context_provider.orchestrate_context_flow(user_id, query)
    assert isinstance(context, dict), "Context should be retrieved"
    logger.info("SUCCESS: Context retrieved")
    
    # Step 2: Store user preferences
    preferences = {
        'travel_style': 'luxury',
        'budget_range': [10000, 20000],
        'preferred_destinations': ['Japan'],
        'preferred_activities': ['culture', 'food', 'nature']
    }
    
    interaction_data = {
        'user_message': query,
        'assistant_response': 'I can help you plan a luxury trip to Japan!',
        'preferences': preferences,
        'context_data': {'trip_type': 'luxury', 'destination': 'Japan', 'duration': '2 weeks'},
        'intent': 'travel_planning',
        'entities': {'destination': 'Japan', 'duration': '2 weeks', 'style': 'luxury'},
        'sentiment': 'positive',
        'topics': ['travel', 'japan', 'luxury']
    }
    
    result = await agent.context_provider.store_interaction_context(user_id, interaction_data)
    assert result is True, "Interaction context should be stored"
    logger.info("SUCCESS: Interaction context stored")
    
    # Step 3: Retrieve updated context
    updated_context = await agent.context_provider.get_user_context(user_id)
    assert isinstance(updated_context, dict), "Updated context should be retrieved"
    logger.info("SUCCESS: Updated context retrieved")
    
    # Step 4: Test conversation context
    conversation_context = await agent.context_provider.get_conversation_context(user_id, 5)
    assert isinstance(conversation_context, list), "Conversation context should be retrieved"
    logger.info("SUCCESS: Conversation context retrieved")
    
    logger.info("COMPLETED: End-to-end workflow works correctly")


async def run_complete_tests():
    """Run all complete architecture tests."""
    logger.info("STARTING: Complete Architecture Tests")
    logger.info("=" * 60)
    
    try:
        await test_database_methods()
        await test_context_manager_methods()
        await test_travel_agent_integration()
        await test_end_to_end_workflow()
        
        logger.info("=" * 60)
        logger.info("COMPLETED: ALL COMPLETE ARCHITECTURE TESTS PASSED!")
        logger.info("SUCCESS: Database methods work correctly")
        logger.info("SUCCESS: Context manager methods work correctly")
        logger.info("SUCCESS: TravelAgent integration works correctly")
        logger.info("SUCCESS: End-to-end workflow works correctly")
        logger.info("SUCCESS: Architecture refactor is fully functional!")
        
    except Exception as e:
        logger.error(f"ERROR: Test failed: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(run_complete_tests())
