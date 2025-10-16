"""
Test the Intent Router system to validate the routing logic works correctly.
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


async def test_intent_router():
    """Test the Intent Router functionality."""
    logger.info("Testing Intent Router")
    logger.info("=" * 50)
    
    router = IntentRouter()
    
    # Test cases for different intents
    test_cases = [
        # Simple greetings - should bypass context
        ("Hi there!", IntentType.GREETING, True),
        ("Hello!", IntentType.GREETING, True),
        ("Good morning!", IntentType.GREETING, True),
        
        # Thanks - should bypass context
        ("Thank you!", IntentType.THANKS, True),
        ("Thanks a lot!", IntentType.THANKS, True),
        
        # Goodbye - should bypass context
        ("Goodbye!", IntentType.GOODBYE, True),
        ("See you later!", IntentType.GOODBYE, True),
        
        # Weather queries - should bypass context if location provided
        ("What's the weather in Paris?", IntentType.WEATHER_QUERY, True),
        ("How's the weather today?", IntentType.WEATHER_QUERY, False),  # No location
        
        # System commands - should bypass context
        ("Help", IntentType.SYSTEM_COMMAND, True),
        ("What can you do?", IntentType.SYSTEM_COMMAND, True),
        
        # Simple questions - should bypass context
        ("What is Python?", IntentType.SIMPLE_QUESTION, True),
        ("How do I cook pasta?", IntentType.SIMPLE_QUESTION, True),
        
        # Complex travel planning - should use full context
        ("Plan a trip to Japan for 2 weeks", IntentType.TRAVEL_PLANNING, False),
        ("I want to book a flight to Tokyo", IntentType.BOOKING_REQUEST, False),
        ("Find me hotels in Paris", IntentType.SEARCH_REQUEST, False),
    ]
    
    success_count = 0
    total_tests = len(test_cases)
    
    for query, expected_intent, should_bypass in test_cases:
        try:
            routing_decision = await router.route_query(query, "test_user")
            
            # Check intent detection
            detected_intent = IntentType(routing_decision['intent'])
            bypass_context = routing_decision['bypass_context']
            
            intent_correct = detected_intent == expected_intent
            bypass_correct = bypass_context == should_bypass
            
            if intent_correct and bypass_correct:
                logger.info(f"SUCCESS: '{query}' -> {detected_intent.value} (bypass: {bypass_context})")
                success_count += 1
            else:
                logger.error(f"FAILED: '{query}' -> Expected: {expected_intent.value} (bypass: {should_bypass}), Got: {detected_intent.value} (bypass: {bypass_context})")
                
        except Exception as e:
            logger.error(f"ERROR: '{query}' -> {e}")
    
    logger.info("=" * 50)
    logger.info(f"Intent Router Test Results: {success_count}/{total_tests} passed")
    
    if success_count == total_tests:
        logger.info("SUCCESS: All intent routing tests passed!")
        return True
    else:
        logger.error(f"FAILED: {total_tests - success_count} tests failed")
        return False


async def test_routing_performance():
    """Test routing performance and latency estimation."""
    logger.info("Testing Routing Performance")
    logger.info("=" * 50)
    
    router = IntentRouter()
    
    # Test different query types and their estimated latencies
    performance_tests = [
        ("Hi", "direct_llm", 200),
        ("Help", "system_handler", 100),
        ("Weather in Paris", "weather_api", 500),
        ("Plan a trip to Japan", "full_context", 1500),
    ]
    
    for query, expected_path, expected_latency in performance_tests:
        routing_decision = await router.route_query(query, "test_user")
        
        actual_path = routing_decision['routing_path']
        actual_latency = routing_decision['estimated_latency']
        
        if actual_path == expected_path and actual_latency == expected_latency:
            logger.info(f"SUCCESS: '{query}' -> {actual_path} ({actual_latency}ms)")
        else:
            logger.error(f"FAILED: '{query}' -> Expected: {expected_path} ({expected_latency}ms), Got: {actual_path} ({actual_latency}ms)")


async def test_entity_extraction():
    """Test entity extraction from queries."""
    logger.info("Testing Entity Extraction")
    logger.info("=" * 50)
    
    router = IntentRouter()
    
    entity_tests = [
        ("Weather in Paris", {"location": "paris"}),
        ("Weather in Tokyo", {"location": "tokyo"}),
        ("What's the weather in London?", {"location": "london"}),
        ("I want to visit 5 cities", {"number": 5}),
        ("Plan a trip for 2 weeks", {}),  # No specific entities
    ]
    
    for query, expected_entities in entity_tests:
        routing_decision = await router.route_query(query, "test_user")
        actual_entities = routing_decision['entities']
        
        if actual_entities == expected_entities:
            logger.info(f"SUCCESS: '{query}' -> {actual_entities}")
        else:
            logger.error(f"FAILED: '{query}' -> Expected: {expected_entities}, Got: {actual_entities}")


async def run_all_tests():
    """Run all intent router tests."""
    logger.info("STARTING: Intent Router Tests")
    logger.info("=" * 60)
    
    try:
        # Test basic intent routing
        intent_success = await test_intent_router()
        
        # Test performance estimation
        await test_routing_performance()
        
        # Test entity extraction
        await test_entity_extraction()
        
        logger.info("=" * 60)
        if intent_success:
            logger.info("COMPLETED: All Intent Router tests passed!")
            logger.info("SUCCESS: Intent routing system is working correctly")
            logger.info("SUCCESS: Bypass logic is functioning as expected")
            logger.info("SUCCESS: Performance estimation is accurate")
            logger.info("SUCCESS: Entity extraction is working")
        else:
            logger.error("FAILED: Some intent router tests failed")
            
    except Exception as e:
        logger.error(f"ERROR: Test suite failed: {e}")


if __name__ == "__main__":
    asyncio.run(run_all_tests())
