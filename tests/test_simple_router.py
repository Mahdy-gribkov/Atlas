"""
Simple test to validate the Intent Router works with basic TravelAgent functionality.
"""

import asyncio
import logging
import sys
import os

# Add project root to path for imports
project_root = os.path.dirname(os.path.dirname(__file__))
sys.path.insert(0, project_root)

from src.routing import IntentRouter, IntentType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_simple_router():
    """Test the Intent Router with simple queries."""
    logger.info("Testing Simple Intent Router")
    logger.info("=" * 50)
    
    router = IntentRouter()
    
    # Test simple queries that should bypass context
    simple_queries = [
        "Hi there!",
        "Hello!",
        "Thank you!",
        "Goodbye!",
        "Help",
        "What can you do?",
    ]
    
    success_count = 0
    
    for query in simple_queries:
        try:
            routing_decision = await router.route_query(query, "test_user")
            
            intent = routing_decision['intent']
            bypass_context = routing_decision['bypass_context']
            routing_path = routing_decision['routing_path']
            latency = routing_decision['estimated_latency']
            
            logger.info(f"Query: '{query}' -> {intent} (bypass: {bypass_context}, path: {routing_path}, {latency}ms)")
            
            # Check that simple queries are being routed correctly
            if bypass_context and latency < 1000:  # Should be fast
                logger.info(f"SUCCESS: '{query}' is correctly routed for fast processing")
                success_count += 1
            else:
                logger.warning(f"WARNING: '{query}' might not be optimally routed")
                
        except Exception as e:
            logger.error(f"ERROR: '{query}' -> {e}")
    
    logger.info("=" * 50)
    logger.info(f"Simple Router Test Results: {success_count}/{len(simple_queries)} queries optimally routed")
    
    if success_count >= len(simple_queries) * 0.8:  # 80% success rate
        logger.info("SUCCESS: Intent Router is working correctly!")
        logger.info("SUCCESS: Simple queries are being routed for fast processing")
        logger.info("SUCCESS: Bypass logic is functioning")
        return True
    else:
        logger.error("FAILED: Too many queries not optimally routed")
        return False


async def test_complex_router():
    """Test the Intent Router with complex queries."""
    logger.info("Testing Complex Intent Router")
    logger.info("=" * 50)
    
    router = IntentRouter()
    
    # Test complex queries that should use full context
    complex_queries = [
        "Plan a trip to Japan for 2 weeks",
        "I want to book a flight to Tokyo",
        "Find me hotels in Paris",
        "What's the weather in London?",
    ]
    
    success_count = 0
    
    for query in complex_queries:
        try:
            routing_decision = await router.route_query(query, "test_user")
            
            intent = routing_decision['intent']
            bypass_context = routing_decision['bypass_context']
            routing_path = routing_decision['routing_path']
            latency = routing_decision['estimated_latency']
            
            logger.info(f"Query: '{query}' -> {intent} (bypass: {bypass_context}, path: {routing_path}, {latency}ms)")
            
            # Check that complex queries are being routed correctly
            if not bypass_context or routing_path == 'full_context':
                logger.info(f"SUCCESS: '{query}' is correctly routed for full processing")
                success_count += 1
            else:
                logger.warning(f"WARNING: '{query}' might not be optimally routed")
                
        except Exception as e:
            logger.error(f"ERROR: '{query}' -> {e}")
    
    logger.info("=" * 50)
    logger.info(f"Complex Router Test Results: {success_count}/{len(complex_queries)} queries optimally routed")
    
    if success_count >= len(complex_queries) * 0.8:  # 80% success rate
        logger.info("SUCCESS: Complex queries are being routed correctly!")
        logger.info("SUCCESS: Full context processing is being used when needed")
        return True
    else:
        logger.error("FAILED: Too many complex queries not optimally routed")
        return False


async def run_all_tests():
    """Run all simple router tests."""
    logger.info("STARTING: Simple Router Tests")
    logger.info("=" * 60)
    
    try:
        # Test simple queries
        simple_success = await test_simple_router()
        
        # Test complex queries
        complex_success = await test_complex_router()
        
        logger.info("=" * 60)
        if simple_success and complex_success:
            logger.info("COMPLETED: All router tests passed!")
            logger.info("SUCCESS: Intent routing system is working correctly")
            logger.info("SUCCESS: Simple queries bypass context for speed")
            logger.info("SUCCESS: Complex queries use full context processing")
            logger.info("SUCCESS: Your friend's architectural recommendation is implemented!")
        else:
            logger.error("FAILED: Some router tests failed")
            
    except Exception as e:
        logger.error(f"ERROR: Test suite failed: {e}")


if __name__ == "__main__":
    asyncio.run(run_all_tests())
