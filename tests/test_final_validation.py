"""
Final Validation Test
Simple test to validate the complete architecture refactor works end-to-end.
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


async def test_architecture_refactor():
    """Test the complete architecture refactor."""
    logger.info("STARTING: Final Architecture Validation")
    logger.info("=" * 60)
    
    try:
        # Test 1: Database functionality
        logger.info("Testing Database Functionality")
        database = SecureDatabase(db_path="./data/final_test.db")
        
        # Test user preferences
        preferences = await database.get_user_preferences("test_user")
        assert isinstance(preferences, dict), "get_user_preferences should return a dictionary"
        logger.info("SUCCESS: Database methods work")
        
        # Test 2: Context Manager functionality
        logger.info("Testing Context Manager Functionality")
        context_manager = AdvancedContextManager(database)
        
        # Test orchestrate_context_flow
        context = await context_manager.orchestrate_context_flow("test_user", "Plan a trip to Paris")
        assert isinstance(context, dict), "orchestrate_context_flow should return a dictionary"
        assert 'orchestration_timestamp' in context, "Should contain orchestration timestamp"
        assert 'context_provider' in context, "Should contain context provider info"
        logger.info("SUCCESS: Context manager methods work")
        
        # Test 3: TravelAgent integration
        logger.info("Testing TravelAgent Integration")
        
        # Use different database to avoid locking
        os.environ['DATABASE_PATH'] = './data/final_agent.db'
        agent = TravelAgent()
        
        # Test that agent uses ContextProvider
        assert isinstance(agent.context_provider, ContextProvider), "TravelAgent should use ContextProvider"
        logger.info("SUCCESS: TravelAgent uses ContextProvider")
        
        # Test context retrieval
        context = await agent.context_provider.orchestrate_context_flow("test_user", "Find flights to Tokyo")
        assert isinstance(context, dict), "Context should be retrieved"
        logger.info("SUCCESS: TravelAgent can get context through ContextProvider")
        
        # Test 4: End-to-end workflow
        logger.info("Testing End-to-End Workflow")
        
        # Store interaction context
        interaction_data = {
            'user_message': 'I want to visit Japan',
            'assistant_response': 'Japan is a great destination!',
            'context_data': {'destination': 'Japan'},
            'intent': 'travel_planning',
            'entities': {'destination': 'Japan'},
            'sentiment': 'positive',
            'topics': ['travel', 'japan']
        }
        
        result = await agent.context_provider.store_interaction_context("test_user", interaction_data)
        assert result is True, "Interaction context should be stored"
        logger.info("SUCCESS: End-to-end workflow works")
        
        logger.info("=" * 60)
        logger.info("COMPLETED: ALL ARCHITECTURE VALIDATION TESTS PASSED!")
        logger.info("SUCCESS: Database functionality works correctly")
        logger.info("SUCCESS: Context manager functionality works correctly")
        logger.info("SUCCESS: TravelAgent integration works correctly")
        logger.info("SUCCESS: End-to-end workflow works correctly")
        logger.info("SUCCESS: Architecture refactor is fully functional!")
        
        return True
        
    except Exception as e:
        logger.error(f"ERROR: Test failed: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(test_architecture_refactor())
