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
from .context_provider import ContextProvider, ContextData

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


class AdvancedContextManager(ContextProvider):
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
        
        logger.info("Advanced Context Manager initialized")
    
    # ContextProvider Interface Implementation
    async def get_user_context(self, user_id: str) -> Dict[str, Any]:
        """
        Get complete user context for decision making.
        
        This is the main method that aggregates all user-related data
        needed for the MDP to make informed decisions.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            Complete user context including preferences, history, and patterns
        """
        try:
            logger.debug(f"Getting complete user context for: {user_id}")
            
            # Create context data object
            context_data = ContextData(user_id)
            
            # Aggregate all context data
            context_data.preferences = await self.get_user_preferences(user_id)
            context_data.conversation_history = await self._load_conversation_turns(user_id, 10)
            context_data.memory_context = await self.get_relevant_memories(user_id, "")
            context_data.preference_patterns = await self._get_preference_patterns(user_id)
            context_data.context_summary = await self.get_context_summary(user_id, "general")
            
            # Extract derived context
            if context_data.preferences:
                context_data.travel_style = context_data.preferences.get('travel_style', 'general')
                context_data.budget_range = tuple(context_data.preferences.get('budget_range', [1000, 5000]))
                context_data.preferred_destinations = context_data.preferences.get('preferred_destinations', [])
                context_data.preferred_activities = context_data.preferences.get('preferred_activities', [])
                context_data.confidence_scores = context_data.preferences.get('confidence_scores', {})
            
            # Calculate context quality
            context_data.calculate_context_quality()
            
            logger.debug(f"Retrieved complete context for {user_id} (quality: {context_data.context_quality:.2f})")
            return context_data.to_dict()
            
        except Exception as e:
            logger.error(f"Error getting user context for {user_id}: {e}")
            return {}
    
    async def get_conversation_context(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent conversation context for the user.
        
        Args:
            user_id: Unique user identifier
            limit: Maximum number of conversation turns to retrieve
            
        Returns:
            List of recent conversation turns with context data
        """
        try:
            turns = await self._load_conversation_turns(user_id, limit)
            return [turn.__dict__ for turn in turns]
        except Exception as e:
            logger.error(f"Error getting conversation context for {user_id}: {e}")
            return []
    
    async def get_preferences_context(self, user_id: str) -> Dict[str, Any]:
        """
        Get user preferences context for personalization.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            User preferences including travel style, budget, activities, etc.
        """
        try:
            return await self.get_user_preferences(user_id)
        except Exception as e:
            logger.error(f"Error getting preferences context for {user_id}: {e}")
            return {}
    
    async def get_memory_context(self, user_id: str, query: str = None) -> List[Dict[str, Any]]:
        """
        Get relevant memory context for the user.
        
        Args:
            user_id: Unique user identifier
            query: Optional query to filter relevant memories
            
        Returns:
            List of relevant memory entries
        """
        try:
            memories = await self.get_relevant_memories(user_id, query or "")
            return [memory.__dict__ for memory in memories]
        except Exception as e:
            logger.error(f"Error getting memory context for {user_id}: {e}")
            return []
    
    async def get_preference_patterns(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get learned preference patterns for the user.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            List of learned preference patterns with confidence scores
        """
        try:
            return await self._get_preference_patterns(user_id)
        except Exception as e:
            logger.error(f"Error getting preference patterns for {user_id}: {e}")
            return []
    
    async def orchestrate_context_flow(self, user_id: str, query: str) -> Dict[str, Any]:
        """
        Orchestrate the complete context flow for MDP.
        
        This is the main orchestration method that coordinates all context
        retrieval and provides a complete context package to the MDP.
        
        Args:
            user_id: Unique user identifier
            query: Current user query for context relevance
            
        Returns:
            Complete orchestrated context for MDP decision making
        """
        try:
            logger.info(f"Orchestrating context flow for user {user_id}")
            
            # Get complete user context
            user_context = await self.get_user_context(user_id)
            
            # Enhance with query-specific context
            if query:
                # Get query-relevant memories
                relevant_memories = await self.get_relevant_memories(user_id, query)
                user_context['query_relevant_memories'] = [memory.__dict__ for memory in relevant_memories]
                
                # Analyze query intent and context
                query_context = await self._analyze_query_context(query)
                user_context['query_context'] = query_context
            
            # Add orchestration metadata
            user_context['orchestration_timestamp'] = datetime.now().isoformat()
            user_context['context_provider'] = 'AdvancedContextManager'
            
            logger.info(f"Context orchestration complete for user {user_id}")
            return user_context
            
        except Exception as e:
            logger.error(f"Error orchestrating context flow for {user_id}: {e}")
            return {}
    
    async def store_interaction_context(self, user_id: str, interaction_data: Dict[str, Any]) -> bool:
        """
        Store interaction context for future use.
        
        Args:
            user_id: Unique user identifier
            interaction_data: Interaction data to store
            
        Returns:
            Success status of storage operation
        """
        try:
            # Store conversation turn
            if 'user_message' in interaction_data and 'assistant_response' in interaction_data:
                turn = ConversationTurn(
                    user_id=user_id,
                    timestamp=datetime.now(),
                    user_message=interaction_data['user_message'],
                    assistant_response=interaction_data['assistant_response'],
                    context_data=interaction_data.get('context_data', {}),
                    intent=interaction_data.get('intent', 'unknown'),
                    entities=interaction_data.get('entities', {}),
                    sentiment=interaction_data.get('sentiment', 'neutral'),
                    topics=interaction_data.get('topics', [])
                )
                await self.store_conversation_turn(turn)
            
            # Store preferences if any
            if 'preferences' in interaction_data:
                await self._store_user_preferences(user_id, interaction_data['preferences'])
            
            # Store memory if any
            if 'memory' in interaction_data:
                memory_data = interaction_data['memory']
                await self.store_memory(
                    user_id,
                    memory_data.get('content', ''),
                    memory_data.get('content_type', 'interaction'),
                    memory_data.get('importance', 0.5),
                    memory_data.get('tags', []),
                    memory_data.get('metadata', {})
                )
            
            logger.debug(f"Stored interaction context for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error storing interaction context for {user_id}: {e}")
            return False
    
    async def get_context_summary(self, user_id: str, summary_type: str = "general") -> Optional[str]:
        """
        Get context summary for the user.
        
        Args:
            user_id: Unique user identifier
            summary_type: Type of summary to retrieve
            
        Returns:
            Context summary string or None if not available
        """
        try:
            return await self._load_context_summary(user_id, summary_type)
        except Exception as e:
            logger.error(f"Error getting context summary for {user_id}: {e}")
            return None
    
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
            
            logger.info(f"Conversation turn added for user {user_id}")
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
    
    async def _get_preference_patterns(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get learned preference patterns for the user.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            List of learned preference patterns with confidence scores
        """
        try:
            # This would integrate with the preference learning system
            # For now, return empty list - can be enhanced later
            return []
        except Exception as e:
            logger.error(f"Error getting preference patterns for {user_id}: {e}")
            return []
    
    async def get_relevant_memories(self, user_id: str, query: str = "", limit: int = 10) -> List[Any]:
        """
        Get relevant memories for a user based on query.
        
        Args:
            user_id: Unique user identifier
            query: Query to find relevant memories
            limit: Maximum number of memories to return
            
        Returns:
            List of relevant memory entries
        """
        try:
            # This would integrate with the conversation memory system
            # For now, return empty list - can be enhanced later
            return []
        except Exception as e:
            logger.error(f"Error getting relevant memories for {user_id}: {e}")
            return []
    
    async def store_conversation_turn(self, turn: ConversationTurn) -> bool:
        """
        Store a conversation turn.
        
        Args:
            turn: ConversationTurn object to store
            
        Returns:
            Success status
        """
        try:
            if self.database:
                conversation_data = {
                    'user_id': turn.user_id,
                    'timestamp': turn.timestamp.isoformat(),
                    'user_message': turn.user_message,
                    'assistant_response': turn.assistant_response,
                    'context_data': turn.context_data,
                    'intent': turn.intent,
                    'entities': turn.entities,
                    'sentiment': turn.sentiment,
                    'confidence': 0.8  # Default confidence
                }
                return await self.database.store_conversation_data(conversation_data)
            return False
        except Exception as e:
            logger.error(f"Error storing conversation turn: {e}")
            return False
    
    async def _store_user_preferences(self, user_id: str, preferences: Dict[str, Any]) -> bool:
        """
        Store user preferences.
        
        Args:
            user_id: User identifier
            preferences: Dictionary of preferences to store
            
        Returns:
            Success status
        """
        try:
            if self.database:
                for pref_type, pref_value in preferences.items():
                    preference_data = {
                        'user_id': user_id,
                        'preference_type': pref_type,
                        'preference_value': str(pref_value),
                        'confidence': 0.8,
                        'source': 'user',
                        'usage_count': 1,
                        'timestamp': datetime.now().isoformat()
                    }
                    await self.database.store_user_preference(preference_data)
                return True
            return False
        except Exception as e:
            logger.error(f"Error storing user preferences: {e}")
            return False
    
    async def _analyze_query_context(self, query: str) -> Dict[str, Any]:
        """
        Analyze query context and extract intent, entities, and sentiment.
        
        Args:
            query: User query to analyze
            
        Returns:
            Query context analysis
        """
        try:
            # Simple query analysis - can be enhanced with NLP
            query_lower = query.lower()
            
            # Extract intent
            intent = "general"
            if any(word in query_lower for word in ["plan", "trip", "travel", "visit"]):
                intent = "travel_planning"
            elif any(word in query_lower for word in ["weather", "climate"]):
                intent = "weather_inquiry"
            elif any(word in query_lower for word in ["hotel", "accommodation", "stay"]):
                intent = "accommodation_inquiry"
            elif any(word in query_lower for word in ["flight", "airline", "fly"]):
                intent = "flight_inquiry"
            
            # Extract entities (simple keyword extraction)
            entities = {}
            # Use dynamic destination detection - let the travel agent handle destination extraction
            # This is just a basic fallback for common patterns
            destination_patterns = [
                r'\b(to|in|from|visit|travel to|going to|planning to go to)\s+([a-zA-Z\s]+?)(?:\s|$|,|\.)',
                r'\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:is|has|offers|provides)',
                r'\b(?:destination|place|location|city|country)\s*:?\s*([a-zA-Z\s]+)'
            ]
            
            import re
            for pattern in destination_patterns:
                match = re.search(pattern, query, re.IGNORECASE)
                if match:
                    potential_dest = match.group(1) if len(match.groups()) > 0 else match.group(0)
                    if len(potential_dest.strip()) > 2 and len(potential_dest.strip()) < 50:
                        entities["destination"] = potential_dest.strip().title()
                        break
            
            # Extract sentiment
            sentiment = "neutral"
            positive_words = ["love", "great", "amazing", "wonderful", "excellent", "fantastic"]
            negative_words = ["hate", "terrible", "awful", "bad", "horrible", "disappointing"]
            
            if any(word in query_lower for word in positive_words):
                sentiment = "positive"
            elif any(word in query_lower for word in negative_words):
                sentiment = "negative"
            
            return {
                "intent": intent,
                "entities": entities,
                "sentiment": sentiment,
                "confidence": 0.7,
                "query_length": len(query),
                "keywords": [word for word in query_lower.split() if len(word) > 3]
            }
        except Exception as e:
            logger.error(f"Error analyzing query context: {e}")
            return {
                "intent": "unknown",
                "entities": {},
                "sentiment": "neutral",
                "confidence": 0.0,
                "query_length": len(query),
                "keywords": []
            }
    
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
            if self.database:
                # Store conversation data in the database
                conversation_data = {
                    'user_id': turn.user_id,
                    'timestamp': turn.timestamp.isoformat(),
                    'user_message': turn.user_message,
                    'assistant_response': turn.assistant_response,
                    'context_data': json.dumps(turn.context_data),
                    'intent': turn.intent,
                    'entities': json.dumps(turn.entities),
                    'sentiment': turn.sentiment,
                    'confidence': turn.confidence
                }
                
                # Use the database's store method
                await self.database.store_conversation_data(conversation_data)
                logger.debug(f"Stored conversation turn for user {turn.user_id}")
            else:
                logger.warning("Database not available, conversation turn not stored")
        except Exception as e:
            logger.error(f"Error storing conversation turn: {e}")
    
    async def _load_conversation_turns(self, user_id: str, max_turns: int) -> List[ConversationTurn]:
        """Load conversation turns from database."""
        try:
            if self.database:
                # Load conversation data from the database
                conversation_data = await self.database.get_conversation_data(user_id, max_turns)
                
                turns = []
                for data in conversation_data:
                    turn = ConversationTurn(
                        user_id=data['user_id'],
                        timestamp=datetime.fromisoformat(data['timestamp']),
                        user_message=data['user_message'],
                        assistant_response=data['assistant_response'],
                        context_data=json.loads(data['context_data']),
                        intent=data['intent'],
                        entities=json.loads(data['entities']),
                        sentiment=data.get('sentiment', 'neutral'),
                        confidence=data.get('confidence', 0.5)
                    )
                    turns.append(turn)
                
                logger.debug(f"Loaded {len(turns)} conversation turns for user {user_id}")
                return turns
            else:
                logger.warning("Database not available, returning empty conversation turns")
                return []
        except Exception as e:
            logger.error(f"Error loading conversation turns: {e}")
            return []
    
    async def _load_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Load user preferences from database."""
        try:
            if self.database:
                # Load user preferences from the database
                preferences = await self.database.get_user_preferences(user_id)
                logger.debug(f"Loaded preferences for user {user_id}")
                return preferences
            else:
                logger.warning("Database not available, returning empty preferences")
                return {}
        except Exception as e:
            logger.error(f"Error loading user preferences: {e}")
            return {}
    
    async def _store_preference(self, user_id: str, preference_type: str, 
                              preference_value: str, confidence: float, 
                              source: str, usage_count: int) -> None:
        """Store preference in database."""
        try:
            if self.database:
                # Store preference in the database
                preference_data = {
                    'user_id': user_id,
                    'preference_type': preference_type,
                    'preference_value': preference_value,
                    'confidence': confidence,
                    'source': source,
                    'usage_count': usage_count,
                    'timestamp': datetime.now().isoformat()
                }
                
                await self.database.store_user_preference(preference_data)
                logger.debug(f"Stored preference for user {user_id}: {preference_type}={preference_value}")
            else:
                logger.warning("Database not available, preference not stored")
        except Exception as e:
            logger.error(f"Error storing preference: {e}")
    
    async def _load_context_summary(self, user_id: str, summary_type: str) -> Optional[str]:
        """Load context summary from database."""
        try:
            if self.database:
                # Load context summary from the database
                summary = await self.database.get_context_summary(user_id, summary_type)
                logger.debug(f"Loaded context summary for user {user_id}, type: {summary_type}")
                return summary
            else:
                logger.warning("Database not available, returning None for context summary")
                return None
        except Exception as e:
            logger.error(f"Error loading context summary: {e}")
            return None
    
    async def _update_context_summaries(self, turn: ConversationTurn) -> None:
        """Update context summaries based on conversation turn."""
        try:
            # Generate summaries based on conversation content
            # This creates intelligent summaries of user preferences and conversation topics
            if not turn or not turn.get('user') or not turn.get('assistant'):
                return
            
            user_message = turn['user'].lower()
            assistant_message = turn['assistant'].lower()
            
            # Extract travel preferences from conversation
            if any(word in user_message for word in ['budget', 'money', 'cost', 'price', '$']):
                self._update_preference_summary('budget_conscious', True)
            
            if any(word in user_message for word in ['luxury', 'expensive', 'high-end', 'premium']):
                self._update_preference_summary('travel_style', 'luxury')
            elif any(word in user_message for word in ['budget', 'cheap', 'affordable', 'economical']):
                self._update_preference_summary('travel_style', 'budget')
            
            if any(word in user_message for word in ['culture', 'museum', 'history', 'art']):
                self._update_preference_summary('interests', 'culture')
            elif any(word in user_message for word in ['nature', 'hiking', 'outdoor', 'adventure']):
                self._update_preference_summary('interests', 'nature')
            elif any(word in user_message for word in ['food', 'restaurant', 'cuisine', 'dining']):
                self._update_preference_summary('interests', 'food')
            
            # Update conversation topic summaries
            if any(word in user_message for word in ['flight', 'airline', 'airport']):
                self._update_topic_summary('flights', user_message)
            elif any(word in user_message for word in ['hotel', 'accommodation', 'stay']):
                self._update_topic_summary('accommodation', user_message)
            elif any(word in user_message for word in ['weather', 'climate', 'temperature']):
                self._update_topic_summary('weather', user_message)
                
        except Exception as e:
            logger.error(f"Error updating context summaries: {e}")
    
    def _update_preference_summary(self, key: str, value: Any):
        """Update preference summary with new information."""
        if not hasattr(self, '_preference_summaries'):
            self._preference_summaries = {}
        
        if key not in self._preference_summaries:
            self._preference_summaries[key] = {'value': value, 'count': 1}
        else:
            self._preference_summaries[key]['count'] += 1
            # Update value if it's different (for non-boolean values)
            if isinstance(value, str) and value != self._preference_summaries[key]['value']:
                self._preference_summaries[key]['value'] = value
    
    def _update_topic_summary(self, topic: str, content: str):
        """Update topic summary with conversation content."""
        if not hasattr(self, '_topic_summaries'):
            self._topic_summaries = {}
        
        if topic not in self._topic_summaries:
            self._topic_summaries[topic] = {'mentions': 1, 'last_mentioned': content[:100]}
        else:
            self._topic_summaries[topic]['mentions'] += 1
            self._topic_summaries[topic]['last_mentioned'] = content[:100]
