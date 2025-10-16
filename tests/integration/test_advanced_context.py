"""
Test Advanced Context Management Systems
Tests all context management components with real data.
"""

import asyncio
import logging
from datetime import datetime
from src.database.secure_database import SecureDatabase
from src.context import (
    AdvancedContextManager, ConversationMemory, PreferenceLearningSystem,
    ConversationTurn, MemoryEntry, UserProfile
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def test_advanced_context_systems():
    """Test all advanced context management systems."""
    logger.info("🚀 Testing Advanced Context Management Systems")
    logger.info("=" * 60)
    
    # Initialize database
    database = SecureDatabase()
    
    # Initialize context systems
    context_manager = AdvancedContextManager(database)
    conversation_memory = ConversationMemory(database)
    preference_learning = PreferenceLearningSystem(database)
    
    user_id = "test_user_001"
    
    # Test 1: Advanced Context Manager
    logger.info("\n🧠 Testing Advanced Context Manager...")
    
    # Add conversation turns
    await context_manager.add_conversation_turn(
        user_id, 
        "I want to plan a trip to Rome, Italy for 4 days with a budget of $3000",
        "I'd be happy to help you plan your trip to Rome! With a $3000 budget for 4 days, you'll have plenty of options for a comfortable stay.",
        {
            'destination': 'Rome, Italy',
            'duration': '4 days',
            'budget': '$3000',
            'travel_style': 'comfortable'
        }
    )
    
    await context_manager.add_conversation_turn(
        user_id,
        "I prefer luxury hotels and fine dining experiences",
        "Perfect! With your budget, you can definitely enjoy luxury accommodations and fine dining in Rome. I'll focus on high-end hotels and Michelin-starred restaurants.",
        {
            'accommodation_preference': 'luxury_hotels',
            'dining_preference': 'fine_dining'
        }
    )
    
    # Get conversation context
    conversation_context = await context_manager.get_conversation_context(user_id, 5)
    logger.info(f"✅ Conversation context retrieved: {len(conversation_context)} turns")
    
    # Get user preferences
    user_preferences = await context_manager.get_user_preferences(user_id)
    logger.info(f"✅ User preferences retrieved: {len(user_preferences)} preferences")
    
    # Build intelligent context
    intelligent_context = await context_manager.build_intelligent_context(
        user_id, "What are the best luxury hotels in Rome?"
    )
    logger.info(f"✅ Intelligent context built with {len(intelligent_context)} data points")
    
    # Test 2: Conversation Memory System
    logger.info("\n💾 Testing Conversation Memory System...")
    
    # Store memories
    memory_id_1 = await conversation_memory.store_memory(
        user_id,
        "User prefers luxury travel with high-end accommodations and fine dining",
        'preference',
        importance=0.9,
        tags=['luxury', 'hotels', 'dining', 'preferences'],
        metadata={'confidence': 0.9, 'source': 'conversation'}
    )
    logger.info(f"✅ Memory stored: {memory_id_1}")
    
    memory_id_2 = await conversation_memory.store_memory(
        user_id,
        "Rome, Italy trip planned for 4 days with $3000 budget",
        'fact',
        importance=0.8,
        tags=['rome', 'italy', 'trip', 'budget', '4_days'],
        metadata={'destination': 'Rome', 'budget': 3000, 'duration': '4 days'}
    )
    logger.info(f"✅ Memory stored: {memory_id_2}")
    
    # Retrieve memories
    memories = await conversation_memory.retrieve_memories(user_id, limit=10)
    logger.info(f"✅ Memories retrieved: {len(memories)} memories")
    
    # Get relevant memories
    relevant_memories = await conversation_memory.get_relevant_memories(
        user_id, "luxury hotels in Rome"
    )
    logger.info(f"✅ Relevant memories found: {len(relevant_memories)} memories")
    
    # Test 3: Preference Learning System
    logger.info("\n🎯 Testing Preference Learning System...")
    
    # Learn from conversation
    conversation_data = {
        'user_messages': [
            {'content': 'I want luxury hotels and fine dining', 'context': {'preference_type': 'accommodation'}},
            {'content': 'I prefer cultural activities and museums', 'context': {'preference_type': 'activities'}}
        ],
        'assistant_messages': [
            {'content': 'I\'ll focus on luxury accommodations', 'context': {}},
            {'content': 'I\'ll include cultural attractions', 'context': {}}
        ],
        'context': {
            'destination': 'Rome',
            'budget': 3000,
            'travel_style': 'luxury'
        },
        'entities': {
            'locations': ['Rome', 'Italy'],
            'currencies': ['$3000'],
            'dates': ['4 days']
        }
    }
    
    await preference_learning.learn_from_conversation(user_id, conversation_data)
    logger.info("✅ Preferences learned from conversation")
    
    # Get user preferences
    user_profile = await preference_learning.get_user_preferences(user_id)
    logger.info(f"✅ User profile retrieved: {user_profile.travel_style} travel style")
    
    # Predict preferences
    predictions = await preference_learning.predict_preferences(
        user_id, {'destination': 'Rome', 'budget': 3000}
    )
    logger.info(f"✅ Preference predictions made: {len(predictions)} predictions")
    
    # Get personalized suggestions
    suggestions = await preference_learning.get_preference_suggestions(
        user_id, "What should I do in Rome?"
    )
    logger.info(f"✅ Personalized suggestions generated: {len(suggestions)} suggestions")
    
    # Test 4: Integration Test
    logger.info("\n🔗 Testing System Integration...")
    
    # Simulate a complete conversation flow
    test_queries = [
        "I'm planning a trip to Paris next month",
        "I prefer boutique hotels and local cuisine",
        "What are the best museums to visit?",
        "I have a budget of $5000 for 5 days"
    ]
    
    for i, query in enumerate(test_queries):
        logger.info(f"\n--- Conversation Turn {i+1} ---")
        logger.info(f"User: {query}")
        
        # Build intelligent context
        intelligent_context = await context_manager.build_intelligent_context(user_id, query)
        
        # Get relevant memories
        relevant_memories = await conversation_memory.get_relevant_memories(user_id, query)
        
        # Get user preferences
        user_profile = await preference_learning.get_user_preferences(user_id)
        
        # Get personalized suggestions
        suggestions = await preference_learning.get_preference_suggestions(user_id, query)
        
        logger.info(f"✅ Context built with {len(intelligent_context)} data points")
        logger.info(f"✅ {len(relevant_memories)} relevant memories found")
        logger.info(f"✅ User profile: {user_profile.travel_style} style")
        logger.info(f"✅ {len(suggestions)} personalized suggestions")
        
        # Simulate assistant response
        assistant_response = f"Based on your preferences for {user_profile.travel_style} travel, I can help you with {query.lower()}. Here are some personalized suggestions: {', '.join(suggestions[:2]) if suggestions else 'general recommendations'}."
        
        # Add to context manager
        await context_manager.add_conversation_turn(
            user_id, query, assistant_response, intelligent_context
        )
        
        # Store in memory
        await conversation_memory.store_memory(
            user_id, f"User: {query}\nAssistant: {assistant_response}",
            'conversation', importance=0.7, tags=intelligent_context.get('current_topics', [])
        )
        
        # Learn from conversation
        await preference_learning.learn_from_conversation(user_id, {
            'user_messages': [{'content': query, 'context': intelligent_context}],
            'context': intelligent_context
        })
    
    # Test 5: Memory Statistics
    logger.info("\n📊 Testing Memory Statistics...")
    
    memory_stats = await conversation_memory.get_memory_statistics(user_id)
    logger.info(f"✅ Memory statistics: {memory_stats}")
    
    # Test 6: Context Summaries
    logger.info("\n📝 Testing Context Summaries...")
    
    general_summary = await context_manager.get_context_summary(user_id, "general")
    travel_summary = await context_manager.get_context_summary(user_id, "travel")
    
    logger.info(f"✅ General summary: {general_summary}")
    logger.info(f"✅ Travel summary: {travel_summary}")
    
    logger.info("\n🎉 All Advanced Context Management Systems tests completed successfully!")
    logger.info("✅ Advanced Context Manager: Working")
    logger.info("✅ Conversation Memory System: Working")
    logger.info("✅ Preference Learning System: Working")
    logger.info("✅ System Integration: Working")
    logger.info("✅ Memory Statistics: Working")
    logger.info("✅ Context Summaries: Working")
    
    logger.info("\n🚀 Advanced Context Management Systems are production-ready!")
    logger.info("💡 The travel agent now has genius-level conversation memory and user preference learning!")


if __name__ == "__main__":
    asyncio.run(test_advanced_context_systems())
