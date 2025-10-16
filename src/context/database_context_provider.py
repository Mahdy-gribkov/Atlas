"""
Database Context Provider Implementation
Concrete implementation of ContextProvider interface using SecureDatabase.
"""

import logging
from typing import Dict, Any, List, Optional
from datetime import datetime
from .context_provider import ContextProvider, ContextData
from ..database.secure_database import SecureDatabase

logger = logging.getLogger(__name__)


class DatabaseContextProvider(ContextProvider):
    """
    Concrete implementation of ContextProvider using SecureDatabase.
    
    This implementation provides context data by querying the secure database
    and aggregating user preferences, conversation history, and memory data.
    """
    
    def __init__(self, database: SecureDatabase):
        """Initialize the database context provider."""
        self.database = database
        logger.info("Database Context Provider initialized")
    
    async def get_user_context(self, user_id: str) -> Dict[str, Any]:
        """Get complete user context for decision making."""
        try:
            # Get user preferences
            preferences = await self.database.get_user_preferences(user_id)
            
            # Get conversation history
            conversations = await self.database.get_conversation_history(user_id, limit=10)
            
            # Get user profile
            profile = await self.database.get_user_profile(user_id)
            
            return {
                'preferences': preferences,
                'conversations': conversations,
                'profile': profile,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting user context: {e}")
            return {
                'preferences': [],
                'conversations': [],
                'profile': None,
                'timestamp': datetime.now().isoformat()
            }
    
    async def get_conversation_context(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent conversation context for the user."""
        try:
            conversations = await self.database.get_conversation_history(user_id, limit=limit)
            return conversations
        except Exception as e:
            logger.error(f"Error getting conversation context: {e}")
            return []
    
    async def get_preferences_context(self, user_id: str) -> Dict[str, Any]:
        """Get user preferences context for personalization."""
        try:
            preferences = await self.database.get_user_preferences(user_id)
            profile = await self.database.get_user_profile(user_id)
            
            return {
                'preferences': preferences,
                'profile': profile,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting preferences context: {e}")
            return {
                'preferences': [],
                'profile': None,
                'timestamp': datetime.now().isoformat()
            }
    
    async def get_memory_context(self, user_id: str, query: str = None) -> List[Dict[str, Any]]:
        """Get relevant memory context for the user."""
        try:
            if query:
                memories = await self.database.search_memories(user_id, query, limit=5)
            else:
                memories = await self.database.get_recent_memories(user_id, limit=10)
            
            return memories
        except Exception as e:
            logger.error(f"Error getting memory context: {e}")
            return []
    
    async def get_preference_patterns(self, user_id: str) -> List[Dict[str, Any]]:
        """Get learned preference patterns for the user."""
        try:
            # Get user preferences and analyze patterns
            preferences = await self.database.get_user_preferences(user_id)
            
            # Simple pattern analysis
            patterns = []
            if preferences:
                # Group preferences by type
                preference_types = {}
                for pref in preferences:
                    pref_type = pref.get('preference_type', 'unknown')
                    if pref_type not in preference_types:
                        preference_types[pref_type] = []
                    preference_types[pref_type].append(pref)
                
                # Create patterns from grouped preferences
                for pref_type, prefs in preference_types.items():
                    if len(prefs) > 1:  # Only create patterns for types with multiple preferences
                        patterns.append({
                            'type': pref_type,
                            'count': len(prefs),
                            'confidence': min(1.0, len(prefs) / 5.0),  # Higher confidence with more data
                            'preferences': prefs
                        })
            
            return patterns
        except Exception as e:
            logger.error(f"Error getting preference patterns: {e}")
            return []
    
    async def orchestrate_context_flow(self, user_id: str, query: str) -> Dict[str, Any]:
        """Orchestrate the complete context flow for MDP."""
        try:
            # Create context data object
            context_data = ContextData(user_id)
            
            # Get all context components in parallel
            user_context = await self.get_user_context(user_id)
            conversation_context = await self.get_conversation_context(user_id)
            preferences_context = await self.get_preferences_context(user_id)
            memory_context = await self.get_memory_context(user_id, query)
            preference_patterns = await self.get_preference_patterns(user_id)
            
            # Populate context data
            context_data.preferences = user_context.get('preferences', [])
            context_data.conversation_history = conversation_context
            context_data.memory_context = memory_context
            context_data.preference_patterns = preference_patterns
            
            # Extract derived context
            profile = preferences_context.get('profile')
            if profile:
                context_data.travel_style = profile.get('travel_style', 'general')
                context_data.budget_range = tuple(profile.get('budget_range', [1000, 5000]))
                context_data.preferred_destinations = profile.get('preferred_destinations', [])
                context_data.preferred_activities = profile.get('preferred_activities', [])
            
            # Calculate context quality
            context_data.calculate_context_quality()
            
            return context_data.to_dict()
            
        except Exception as e:
            logger.error(f"Error orchestrating context flow: {e}")
            # Return minimal context on error
            return ContextData(user_id).to_dict()
    
    async def store_interaction_context(self, user_id: str, interaction_data: Dict[str, Any]) -> bool:
        """Store interaction context for future use."""
        try:
            # Store conversation
            if 'user_message' in interaction_data and 'assistant_response' in interaction_data:
                await self.database.save_conversation(
                    user_id,
                    interaction_data['user_message'],
                    interaction_data['assistant_response']
                )
            
            # Store preferences if extracted
            if 'preferences' in interaction_data:
                for preference in interaction_data['preferences']:
                    await self.database.store_user_preference(preference)
            
            # Store memory if created
            if 'memory' in interaction_data:
                await self.database.store_memory(user_id, interaction_data['memory'])
            
            return True
            
        except Exception as e:
            logger.error(f"Error storing interaction context: {e}")
            return False
    
    async def get_context_summary(self, user_id: str, summary_type: str = "general") -> Optional[str]:
        """Get context summary for the user."""
        try:
            summary = await self.database.get_context_summary(user_id, summary_type)
            return summary
        except Exception as e:
            logger.error(f"Error getting context summary: {e}")
            return None
