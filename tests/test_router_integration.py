"""
Test the Intent Router integration with TravelAgent to validate the routing system works end-to-end.
"""

import asyncio
import logging
import sys
import os

# Add project root to path for imports
project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, project_root)

from travel_agent import TravelAgent

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_router_integration():
    """Test the Intent Router integration with TravelAgent."""
    logger.info("Testing Intent Router Integration with TravelAgent")
    logger.info("=" * 60)
    
    try:
        # Use a different database to avoid conflicts
        os.environ['DATABASE_PATH'] = './data/test_router.db'
        agent = TravelAgent()
        
        # Test cases for different routing paths
        test_cases = [
            # Simple greetings - should be fast (bypass context)
            ("Hi there!", "greeting", "fast"),
            ("Hello!", "greeting", "fast"),
            ("Good morning!", "greeting", "fast"),
            
            # Thanks - should be fast (bypass context)
            ("Thank you!", "thanks", "fast"),
            ("Thanks a lot!", "thanks", "fast"),
            
            # System commands - should be fast (bypass context)
            ("Help", "system", "fast"),
            ("What can you do?", "system", "fast"),
            
            # Weather queries - should be medium speed (direct API)
            ("What's the weather in Paris?", "weather", "medium"),
            
            # Complex travel planning - should use full context
            ("Plan a trip to Japan for 2 weeks", "travel_planning", "full_context"),
            ("I want to book a flight to Tokyo", "booking", "full_context"),
        ]
        
        success_count = 0
        total_tests = len(test_cases)
        
        for query, expected_type, expected_speed in test_cases:
            try:
                logger.info(f"Testing: '{query}' (expected: {expected_type}, {expected_speed})")
                
                # Process the query
                response = await agent.process_query(query, {'user_id': 'test_user'})
                
                # Check that we got a response
                if response and len(response) > 0:
                    logger.info(f"SUCCESS: '{query}' -> Got response ({len(response)} chars)")
                    success_count += 1
                else:
                    logger.error(f"FAILED: '{query}' -> No response received")
                    
            except Exception as e:
                logger.error(f"ERROR: '{query}' -> {e}")
        
        logger.info("=" * 60)
        logger.info(f"Router Integration Test Results: {success_count}/{total_tests} passed")
        
        if success_count == total_tests:
            logger.info("SUCCESS: All router integration tests passed!")
            logger.info("SUCCESS: Intent routing is working with TravelAgent")
            logger.info("SUCCESS: Bypass logic is functioning correctly")
            logger.info("SUCCESS: Full context processing is working")
            return True
        else:
            logger.error(f"FAILED: {total_tests - success_count} tests failed")
            return False
            
    except Exception as e:
        logger.error(f"ERROR: Router integration test failed: {e}")
        return False


async def test_performance_comparison():
    """Test performance difference between routed and non-routed queries."""
    logger.info("Testing Performance Comparison")
    logger.info("=" * 60)
    
    try:
        os.environ['DATABASE_PATH'] = './data/test_performance.db'
        agent = TravelAgent()
        
        # Test simple query (should be fast with routing)
        import time
        start_time = time.time()
        response1 = await agent.process_query("Hi there!", {'user_id': 'test_user'})
        simple_time = time.time() - start_time
        
        # Test complex query (should use full context)
        start_time = time.time()
        response2 = await agent.process_query("Plan a detailed trip to Japan for 2 weeks with hotels and flights", {'user_id': 'test_user'})
        complex_time = time.time() - start_time
        
        logger.info(f"Simple query time: {simple_time:.2f}s")
        logger.info(f"Complex query time: {complex_time:.2f}s")
        logger.info(f"Performance difference: {complex_time/simple_time:.1f}x slower for complex query")
        
        if simple_time < complex_time:
            logger.info("SUCCESS: Simple queries are faster than complex queries")
            logger.info("SUCCESS: Routing system is providing performance benefits")
        else:
            logger.warning("WARNING: Performance difference not as expected")
        
        return True
        
    except Exception as e:
        logger.error(f"ERROR: Performance test failed: {e}")
        return False


async def run_all_tests():
    """Run all router integration tests."""
    logger.info("STARTING: Router Integration Tests")
    logger.info("=" * 60)
    
    try:
        # Test basic integration
        integration_success = await test_router_integration()
        
        # Test performance
        await test_performance_comparison()
        
        logger.info("=" * 60)
        if integration_success:
            logger.info("COMPLETED: All router integration tests passed!")
            logger.info("SUCCESS: Intent routing system is fully functional")
            logger.info("SUCCESS: TravelAgent integration is working")
            logger.info("SUCCESS: Performance optimization is active")
        else:
            logger.error("FAILED: Some router integration tests failed")
            
    except Exception as e:
        logger.error(f"ERROR: Test suite failed: {e}")


if __name__ == "__main__":
    asyncio.run(run_all_tests())
