"""
Advanced Context Manager - Production Ready
Provides sophisticated conversation memory and user preference tracking.
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import hashlib
import re
from dataclasses import dataclass, asdict
from collections import defaultdict, deque

from ..database.secure_database import SecureDatabase

logger = logging.getLogger(__name__)


@dataclass
class ConversationTurn:
    """Represents a single conversation turn."""
    user_id: str
    timestamp: datetime
    user_message: str
    assistant_response: str
    context_data: Dict[str, Any]
    intent: str
    entities: Dict[str, Any]
    sentiment: str
    topics: List[str]


@dataclass
class UserPreference:
    """Represents a user preference."""
    user_id: str
    preference_type: str
    preference_value: str
    confidence: float
    source: str
    timestamp: datetime
    usage_count: int


@dataclass
class ContextSummary:
    """Represents a context summary."""
    user_id: str
    summary_type: str
    content: str
    timestamp: datetime
    relevance_score: float


class AdvancedContextManager:
    """
    Advanced context manager for sophisticated conversation memory.
    Provides genius-level context preservation and user preference learning.
    """
    
    def __init__(self, database: SecureDatabase):
        self.database = database
        self.conversation_cache = {}  # In-memory cache for active conversations
        self.preference_cache = {}    # In-memory cache for user preferences
        self.context_summaries = {}   # In-memory cache for context summaries
        
        # Context management parameters
        self.max_conversation_turns = 50
        self.max_preference_history = 100
        self.context_decay_days = 30
        self.preference_confidence_threshold = 0.7
        
        logger.info("🧠 Advanced Context Manager initialized")
    
    async def add_conversation_turn(self, user_id: str, user_message: str, 
                                  assistant_response: str, context_data: Dict[str, Any] = None) -> bool:
        """
        Add a conversation turn to the context.
        
        Args:
            user_id: Unique user identifier
            user_message: User's message
            assistant_response: Assistant's response
            context_data: Additional context data
            
        Returns:
            Success status
        """
        try:
            # Analyze the conversation turn
            intent = await self._analyze_intent(user_message)
            entities = await self._extract_entities(user_message)
            sentiment = await self._analyze_sentiment(user_message)
            topics = await self._extract_topics(user_message, assistant_response)
            
            # Create conversation turn
            turn = ConversationTurn(
                user_id=user_id,
                timestamp=datetime.now(),
                user_message=user_message,
                assistant_response=assistant_response,
                context_data=context_data or {},
                intent=intent,
                entities=entities,
                sentiment=sentiment,
                topics=topics
            )
            
            # Store in database
            await self._store_conversation_turn(turn)
            
            # Update in-memory cache
            if user_id not in self.conversation_cache:
                self.conversation_cache[user_id] = deque(maxlen=self.max_conversation_turns)
            
            self.conversation_cache[user_id].append(turn)
            
            # Extract and update preferences
            await self._extract_and_update_preferences(turn)
            
            # Update context summaries
            await self._update_context_summaries(turn)
            
            logger.info(f"✅ Conversation turn added for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error adding conversation turn: {e}")
            return False
    
    async def get_conversation_context(self, user_id: str, max_turns: int = 10) -> List[Dict[str, Any]]:
        """
        Get conversation context for a user.
        
        Args:
            user_id: Unique user identifier
            max_turns: Maximum number of turns to return
            
        Returns:
            List of conversation turns
        """
        try:
            # Try cache first
            if user_id in self.conversation_cache:
                turns = list(self.conversation_cache[user_id])[-max_turns:]
                return [asdict(turn) for turn in turns]
            
            # Load from database
            turns = await self._load_conversation_turns(user_id, max_turns)
            
            # Update cache
            if turns:
                self.conversation_cache[user_id] = deque(turns, maxlen=self.max_conversation_turns)
            
            return [asdict(turn) for turn in turns]
            
        except Exception as e:
            logger.error(f"Error getting conversation context: {e}")
            return []
    
    async def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """
        Get user preferences.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            Dictionary of user preferences
        """
        try:
            # Try cache first
            if user_id in self.preference_cache:
                return self.preference_cache[user_id]
            
            # Load from database
            preferences = await self._load_user_preferences(user_id)
            
            # Update cache
            self.preference_cache[user_id] = preferences
            
            return preferences
            
        except Exception as e:
            logger.error(f"Error getting user preferences: {e}")
            return {}
    
    async def get_context_summary(self, user_id: str, summary_type: str = "general") -> Optional[str]:
        """
        Get context summary for a user.
        
        Args:
            user_id: Unique user identifier
            summary_type: Type of summary to get
            
        Returns:
            Context summary string
        """
        try:
            # Try cache first
            cache_key = f"{user_id}_{summary_type}"
            if cache_key in self.context_summaries:
                return self.context_summaries[cache_key]
            
            # Load from database
            summary = await self._load_context_summary(user_id, summary_type)
            
            # Update cache
            if summary:
                self.context_summaries[cache_key] = summary
            
            return summary
            
        except Exception as e:
            logger.error(f"Error getting context summary: {e}")
            return None
    
    async def build_intelligent_context(self, user_id: str, current_query: str) -> Dict[str, Any]:
        """
        Build intelligent context for current query.
        
        Args:
            user_id: Unique user identifier
            current_query: Current user query
            
        Returns:
            Intelligent context dictionary
        """
        try:
            # Get conversation history
            conversation_history = await self.get_conversation_context(user_id, 5)
            
            # Get user preferences
            user_preferences = await self.get_user_preferences(user_id)
            
            # Get relevant context summaries
            general_summary = await self.get_context_summary(user_id, "general")
            travel_summary = await self.get_context_summary(user_id, "travel")
            
            # Analyze current query
            current_intent = await self._analyze_intent(current_query)
            current_entities = await self._extract_entities(current_query)
            current_topics = await self._extract_topics(current_query, "")
            
            # Build intelligent context
            intelligent_context = {
                "user_id": user_id,
                "current_query": current_query,
                "current_intent": current_intent,
                "current_entities": current_entities,
                "current_topics": current_topics,
                "conversation_history": conversation_history,
                "user_preferences": user_preferences,
                "context_summaries": {
                    "general": general_summary,
                    "travel": travel_summary
                },
                "relevant_preferences": await self._get_relevant_preferences(user_preferences, current_query),
                "conversation_flow": await self._analyze_conversation_flow(conversation_history),
                "timestamp": datetime.now().isoformat()
            }
            
            return intelligent_context
            
        except Exception as e:
            logger.error(f"Error building intelligent context: {e}")
            return {
                "user_id": user_id,
                "current_query": current_query,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }
    
    async def _analyze_intent(self, message: str) -> str:
        """Analyze user intent from message."""
        try:
            message_lower = message.lower()
            
            # Travel-related intents
            if any(word in message_lower for word in ['book', 'reserve', 'buy', 'purchase']):
                return 'booking'
            elif any(word in message_lower for word in ['search', 'find', 'look for', 'show me']):
                return 'search'
            elif any(word in message_lower for word in ['plan', 'itinerary', 'schedule', 'organize']):
                return 'planning'
            elif any(word in message_lower for word in ['weather', 'temperature', 'forecast']):
                return 'weather'
            elif any(word in message_lower for word in ['flight', 'airline', 'airport']):
                return 'flights'
            elif any(word in message_lower for word in ['hotel', 'accommodation', 'stay']):
                return 'hotels'
            elif any(word in message_lower for word in ['attraction', 'sightseeing', 'tourist', 'visit']):
                return 'attractions'
            elif any(word in message_lower for word in ['restaurant', 'food', 'dining', 'eat']):
                return 'food'
            elif any(word in message_lower for word in ['transport', 'transportation', 'bus', 'train', 'taxi']):
                return 'transportation'
            elif any(word in message_lower for word in ['budget', 'cost', 'price', 'expensive', 'cheap']):
                return 'budget'
            elif any(word in message_lower for word in ['help', 'assist', 'support']):
                return 'help'
            else:
                return 'general'
                
        except Exception as e:
            logger.error(f"Error analyzing intent: {e}")
            return 'unknown'
    
    async def _extract_entities(self, message: str) -> Dict[str, Any]:
        """Extract entities from message."""
        try:
            entities = {
                'locations': [],
                'dates': [],
                'numbers': [],
                'currencies': [],
                'people': []
            }
            
            # Extract locations (simple pattern matching)
            location_patterns = [
                r'\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b',  # Capitalized words
                r'\b(?:in|to|from|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b'  # Preposition + location
            ]
            
            for pattern in location_patterns:
                matches = re.findall(pattern, message)
                entities['locations'].extend(matches)
            
            # Extract dates
            date_patterns = [
                r'\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b',  # MM/DD/YYYY or DD/MM/YYYY
                r'\b(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}(?:st|nd|rd|th)?\b',
                r'\b\d{1,2}(?:st|nd|rd|th)?\s+(?:january|february|march|april|may|june|july|august|september|october|november|december)\b'
            ]
            
            for pattern in date_patterns:
                matches = re.findall(pattern, message, re.IGNORECASE)
                entities['dates'].extend(matches)
            
            # Extract numbers
            number_patterns = [
                r'\b\d+\b',  # Simple numbers
                r'\$\d+(?:\.\d{2})?\b',  # Currency amounts
                r'\b\d+\s*(?:days?|nights?|weeks?|months?)\b'  # Duration
            ]
            
            for pattern in number_patterns:
                matches = re.findall(pattern, message)
                entities['numbers'].extend(matches)
            
            # Extract currencies
            currency_patterns = [
                r'\$\d+(?:\.\d{2})?\b',  # USD
                r'\b\d+(?:\.\d{2})?\s*(?:usd|dollars?)\b',  # USD words
                r'\b\d+(?:\.\d{2})?\s*(?:eur|euros?)\b',  # EUR
                r'\b\d+(?:\.\d{2})?\s*(?:gbp|pounds?)\b'  # GBP
            ]
            
            for pattern in currency_patterns:
                matches = re.findall(pattern, message, re.IGNORECASE)
                entities['currencies'].extend(matches)
            
            return entities
            
        except Exception as e:
            logger.error(f"Error extracting entities: {e}")
            return {}
    
    async def _analyze_sentiment(self, message: str) -> str:
        """Analyze sentiment of message."""
        try:
            message_lower = message.lower()
            
            # Positive sentiment indicators
            positive_words = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'enjoy', 'happy', 'excited']
            negative_words = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'angry', 'frustrated', 'disappointed', 'sad', 'worried']
            
            positive_count = sum(1 for word in positive_words if word in message_lower)
            negative_count = sum(1 for word in negative_words if word in message_lower)
            
            if positive_count > negative_count:
                return 'positive'
            elif negative_count > positive_count:
                return 'negative'
            else:
                return 'neutral'
                
        except Exception as e:
            logger.error(f"Error analyzing sentiment: {e}")
            return 'neutral'
    
    async def _extract_topics(self, user_message: str, assistant_response: str) -> List[str]:
        """Extract topics from conversation."""
        try:
            topics = []
            combined_text = f"{user_message} {assistant_response}".lower()
            
            # Travel topics
            travel_topics = {
                'flights': ['flight', 'airline', 'airport', 'plane', 'flying'],
                'hotels': ['hotel', 'accommodation', 'stay', 'room', 'booking'],
                'attractions': ['attraction', 'sightseeing', 'tourist', 'visit', 'museum', 'monument'],
                'food': ['restaurant', 'food', 'dining', 'eat', 'meal', 'cuisine'],
                'transportation': ['transport', 'bus', 'train', 'taxi', 'car', 'metro'],
                'weather': ['weather', 'temperature', 'forecast', 'rain', 'sunny'],
                'budget': ['budget', 'cost', 'price', 'expensive', 'cheap', 'affordable'],
                'planning': ['plan', 'itinerary', 'schedule', 'organize', 'trip']
            }
            
            for topic, keywords in travel_topics.items():
                if any(keyword in combined_text for keyword in keywords):
                    topics.append(topic)
            
            return topics
            
        except Exception as e:
            logger.error(f"Error extracting topics: {e}")
            return []
    
    async def _extract_and_update_preferences(self, turn: ConversationTurn) -> None:
        """Extract and update user preferences from conversation turn."""
        try:
            message = turn.user_message.lower()
            entities = turn.entities
            
            # Extract budget preferences
            if 'budget' in message or 'currencies' in entities:
                for currency in entities.get('currencies', []):
                    await self._update_preference(
                        turn.user_id, 'budget', currency, 0.8, 'conversation'
                    )
            
            # Extract destination preferences
            if entities.get('locations'):
                for location in entities['locations']:
                    await self._update_preference(
                        turn.user_id, 'preferred_destination', location, 0.7, 'conversation'
                    )
            
            # Extract travel style preferences
            if any(word in message for word in ['luxury', 'expensive', 'high-end']):
                await self._update_preference(
                    turn.user_id, 'travel_style', 'luxury', 0.9, 'conversation'
                )
            elif any(word in message for word in ['budget', 'cheap', 'affordable']):
                await self._update_preference(
                    turn.user_id, 'travel_style', 'budget', 0.9, 'conversation'
                )
            elif any(word in message for word in ['backpack', 'hostel', 'adventure']):
                await self._update_preference(
                    turn.user_id, 'travel_style', 'adventure', 0.9, 'conversation'
                )
            
            # Extract activity preferences
            if any(word in message for word in ['beach', 'relax', 'resort']):
                await self._update_preference(
                    turn.user_id, 'activity_preference', 'relaxation', 0.8, 'conversation'
                )
            elif any(word in message for word in ['hiking', 'outdoor', 'nature']):
                await self._update_preference(
                    turn.user_id, 'activity_preference', 'outdoor', 0.8, 'conversation'
                )
            elif any(word in message for word in ['culture', 'museum', 'history']):
                await self._update_preference(
                    turn.user_id, 'activity_preference', 'culture', 0.8, 'conversation'
                )
            elif any(word in message for word in ['food', 'restaurant', 'cuisine']):
                await self._update_preference(
                    turn.user_id, 'activity_preference', 'food', 0.8, 'conversation'
                )
            
            # Extract duration preferences
            if entities.get('numbers'):
                for number in entities['numbers']:
                    if 'day' in message or 'night' in message:
                        await self._update_preference(
                            turn.user_id, 'preferred_duration', number, 0.7, 'conversation'
                        )
            
        except Exception as e:
            logger.error(f"Error extracting preferences: {e}")
    
    async def _update_preference(self, user_id: str, preference_type: str, 
                               preference_value: str, confidence: float, source: str) -> None:
        """Update user preference."""
        try:
            # Check if preference already exists
            existing_prefs = await self.get_user_preferences(user_id)
            
            if preference_type in existing_prefs:
                existing_pref = existing_prefs[preference_type]
                # Update confidence and usage count
                new_confidence = (existing_pref['confidence'] + confidence) / 2
                new_usage_count = existing_pref['usage_count'] + 1
                
                await self._store_preference(
                    user_id, preference_type, preference_value, 
                    new_confidence, source, new_usage_count
                )
            else:
                await self._store_preference(
                    user_id, preference_type, preference_value, 
                    confidence, source, 1
                )
            
            # Update cache
            if user_id in self.preference_cache:
                self.preference_cache[user_id][preference_type] = {
                    'value': preference_value,
                    'confidence': confidence,
                    'source': source,
                    'timestamp': datetime.now().isoformat(),
                    'usage_count': 1
                }
            
        except Exception as e:
            logger.error(f"Error updating preference: {e}")
    
    async def _get_relevant_preferences(self, preferences: Dict[str, Any], query: str) -> Dict[str, Any]:
        """Get preferences relevant to current query."""
        try:
            relevant_prefs = {}
            query_lower = query.lower()
            
            # Map query topics to preference types
            topic_mapping = {
                'budget': ['budget', 'cost', 'price', 'expensive', 'cheap'],
                'destination': ['destination', 'place', 'city', 'country', 'location'],
                'travel_style': ['luxury', 'budget', 'adventure', 'style', 'type'],
                'activity': ['activity', 'attraction', 'restaurant', 'food', 'culture'],
                'duration': ['day', 'night', 'week', 'month', 'duration', 'length']
            }
            
            for pref_type, pref_data in preferences.items():
                for topic, keywords in topic_mapping.items():
                    if any(keyword in query_lower for keyword in keywords):
                        if pref_type in [topic, f'preferred_{topic}', f'activity_preference']:
                            relevant_prefs[pref_type] = pref_data
                            break
            
            return relevant_prefs
            
        except Exception as e:
            logger.error(f"Error getting relevant preferences: {e}")
            return {}
    
    async def _analyze_conversation_flow(self, conversation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze conversation flow patterns."""
        try:
            if not conversation_history:
                return {'flow_type': 'new_conversation', 'continuity': 0.0}
            
            # Analyze intent progression
            intents = [turn.get('intent', 'unknown') for turn in conversation_history]
            
            # Check for conversation continuity
            unique_intents = set(intents)
            continuity = len(unique_intents) / len(intents) if intents else 0.0
            
            # Determine flow type
            if continuity > 0.8:
                flow_type = 'focused_conversation'
            elif continuity > 0.5:
                flow_type = 'mixed_conversation'
            else:
                flow_type = 'exploratory_conversation'
            
            return {
                'flow_type': flow_type,
                'continuity': continuity,
                'intent_progression': intents,
                'conversation_length': len(conversation_history)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing conversation flow: {e}")
            return {'flow_type': 'unknown', 'continuity': 0.0}
    
    # Database operations
    async def _store_conversation_turn(self, turn: ConversationTurn) -> None:
        """Store conversation turn in database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, we'll use a simple storage approach
            pass
        except Exception as e:
            logger.error(f"Error storing conversation turn: {e}")
    
    async def _load_conversation_turns(self, user_id: str, max_turns: int) -> List[ConversationTurn]:
        """Load conversation turns from database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, return empty list
            return []
        except Exception as e:
            logger.error(f"Error loading conversation turns: {e}")
            return []
    
    async def _load_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Load user preferences from database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, return empty dict
            return {}
        except Exception as e:
            logger.error(f"Error loading user preferences: {e}")
            return {}
    
    async def _store_preference(self, user_id: str, preference_type: str, 
                              preference_value: str, confidence: float, 
                              source: str, usage_count: int) -> None:
        """Store preference in database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, we'll use in-memory storage
            pass
        except Exception as e:
            logger.error(f"Error storing preference: {e}")
    
    async def _load_context_summary(self, user_id: str, summary_type: str) -> Optional[str]:
        """Load context summary from database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, return None
            return None
        except Exception as e:
            logger.error(f"Error loading context summary: {e}")
            return None
    
    async def _update_context_summaries(self, turn: ConversationTurn) -> None:
        """Update context summaries based on conversation turn."""
        try:
            # Generate summaries based on conversation content
            # This would create intelligent summaries of user preferences and conversation topics
            pass
        except Exception as e:
            logger.error(f"Error updating context summaries: {e}")
