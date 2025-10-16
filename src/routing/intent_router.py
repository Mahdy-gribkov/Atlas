"""
Intent Router and Detection System
Implements intelligent routing to bypass unnecessary context processing for simple queries.
"""

import asyncio
import logging
import re
from typing import Dict, Any, Optional, Tuple
from enum import Enum
from dataclasses import dataclass
from datetime import datetime

logger = logging.getLogger(__name__)


class IntentType(Enum):
    """Types of user intents."""
    GREETING = "greeting"
    THANKS = "thanks"
    GOODBYE = "goodbye"
    SIMPLE_QUESTION = "simple_question"
    WEATHER_QUERY = "weather_query"
    GENERAL_CHAT = "general_chat"
    TRAVEL_PLANNING = "travel_planning"
    BOOKING_REQUEST = "booking_request"
    SEARCH_REQUEST = "search_request"
    COMPLEX_QUERY = "complex_query"
    SYSTEM_COMMAND = "system_command"
    UNKNOWN = "unknown"


@dataclass
class IntentResult:
    """Result of intent analysis."""
    intent: IntentType
    confidence: float
    entities: Dict[str, Any]
    requires_context: bool
    bypass_context: bool
    routing_path: str
    processing_notes: str


class IntentRouter:
    """
    Intelligent router that analyzes user input and determines the optimal processing path.
    
    This addresses the "Centralized Core Bottleneck" by:
    1. Detecting simple intents that don't need context
    2. Routing them directly to LLM for fast responses
    3. Only using full context management for complex queries
    """
    
    def __init__(self):
        self.greeting_patterns = [
            r'\b(hi|hello|hey)\b',
            r'\b(good morning|good afternoon|good evening)\b',
            r'\b(how are you|how\'s it going|what\'s up)\b',
            r'\b(nice to meet you|pleased to meet you)\b'
        ]
        
        self.thanks_patterns = [
            r'\b(thank you|thanks|thx|appreciate it|much appreciated)\b',
            r'\b(that\'s helpful|that helps|perfect|great|awesome)\b'
        ]
        
        self.goodbye_patterns = [
            r'\b(goodbye|bye|farewell|take care)\b',
            r'\b(see you|until next time|talk to you later)\b'
        ]
        
        self.simple_question_patterns = [
            r'\b(what is|what\'s|how do|how does|when is|where is|who is)\b',
            r'\b(can you|could you|would you)\b',
            r'\b(do you know|tell me about)\b'
        ]
        
        self.weather_patterns = [
            r'\b(weather|temperature|forecast|climate|rain|sunny|cloudy)\b',
            r'\b(how\'s the weather|what\'s the weather like)\b'
        ]
        
        self.travel_planning_patterns = [
            r'\b(plan|planning|itinerary|schedule|organize|arrange)\b',
            r'\b(trip|vacation|holiday|journey|travel)\b',
            r'\b(visit|go to|travel to|explore)\b'
        ]
        
        self.booking_patterns = [
            r'\b(book|reserve|buy|purchase|order)\b',
            r'\b(flight|hotel|accommodation|restaurant)\b',
            r'\b(ticket|reservation|booking)\b'
        ]
        
        self.search_patterns = [
            r'\b(search|find|look for|show me|get me)\b',
            r'\b(what are|what restaurants|what hotels|what flights)\b'
        ]
        
        self.system_command_patterns = [
            r'\b(help|commands|what can you do|capabilities)\b',
            r'\b(settings|preferences|configure|setup)\b',
            r'\b(clear|reset|start over|new conversation)\b'
        ]
        
        logger.info("Intent Router initialized with pattern matching")
    
    async def analyze_intent(self, query: str, user_id: str = "default") -> IntentResult:
        """
        Analyze user query to determine intent and optimal routing path.
        
        Args:
            query: User's input query
            user_id: User identifier for context
            
        Returns:
            IntentResult with routing decision
        """
        try:
            query_lower = query.lower().strip()
            query_length = len(query.split())
            
            # Handle empty or very short queries
            if not query_lower or query_length < 2:
                return IntentResult(
                    intent=IntentType.UNKNOWN,
                    confidence=0.0,
                    entities={},
                    requires_context=False,
                    bypass_context=True,
                    routing_path="direct_llm",
                    processing_notes="Empty or too short query"
                )
            
            # Pattern matching for different intents
            intent_scores = {}
            
            # Check greeting patterns
            if self._matches_patterns(query_lower, self.greeting_patterns):
                intent_scores[IntentType.GREETING] = 0.9
            
            # Check thanks patterns
            if self._matches_patterns(query_lower, self.thanks_patterns):
                intent_scores[IntentType.THANKS] = 0.9
            
            # Check goodbye patterns
            if self._matches_patterns(query_lower, self.goodbye_patterns):
                intent_scores[IntentType.GOODBYE] = 0.9
            
            # Check weather patterns
            if self._matches_patterns(query_lower, self.weather_patterns):
                intent_scores[IntentType.WEATHER_QUERY] = 0.8
            
            # Check simple question patterns
            if self._matches_patterns(query_lower, self.simple_question_patterns):
                intent_scores[IntentType.SIMPLE_QUESTION] = 0.7
            
            # Check travel planning patterns
            if self._matches_patterns(query_lower, self.travel_planning_patterns):
                intent_scores[IntentType.TRAVEL_PLANNING] = 0.8
            
            # Check booking patterns
            if self._matches_patterns(query_lower, self.booking_patterns):
                intent_scores[IntentType.BOOKING_REQUEST] = 0.8
            
            # Check search patterns
            if self._matches_patterns(query_lower, self.search_patterns):
                intent_scores[IntentType.SEARCH_REQUEST] = 0.7
            
            # Check system command patterns
            if self._matches_patterns(query_lower, self.system_command_patterns):
                intent_scores[IntentType.SYSTEM_COMMAND] = 0.8
            
            # Determine best intent
            if intent_scores:
                best_intent = max(intent_scores.items(), key=lambda x: x[1])
                intent_type = best_intent[0]
                confidence = best_intent[1]
            else:
                # Default to complex query if no patterns match
                intent_type = IntentType.COMPLEX_QUERY
                confidence = 0.5
            
            # Extract entities
            entities = self._extract_entities(query_lower)
            
            # Determine routing path
            requires_context, bypass_context, routing_path, processing_notes = self._determine_routing(
                intent_type, confidence, entities, query_length
            )
            
            result = IntentResult(
                intent=intent_type,
                confidence=confidence,
                entities=entities,
                requires_context=requires_context,
                bypass_context=bypass_context,
                routing_path=routing_path,
                processing_notes=processing_notes
            )
            
            logger.debug(f"Intent analysis: {intent_type.value} (confidence: {confidence:.2f}) - {routing_path}")
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing intent: {e}")
            return IntentResult(
                intent=IntentType.UNKNOWN,
                confidence=0.0,
                entities={},
                requires_context=True,
                bypass_context=False,
                routing_path="full_context",
                processing_notes=f"Error in analysis: {str(e)}"
            )
    
    def _matches_patterns(self, query: str, patterns: list) -> bool:
        """Check if query matches any of the given patterns."""
        for pattern in patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        return False
    
    def _extract_entities(self, query: str) -> Dict[str, Any]:
        """Extract entities from the query."""
        entities = {}
        
        # Location entities
        locations = ['paris', 'tokyo', 'london', 'new york', 'rome', 'japan', 'france', 'italy', 'spain', 'germany']
        for location in locations:
            if location in query:
                entities['location'] = location
                break
        
        # Date entities (simple patterns)
        date_patterns = [
            r'\b(today|tomorrow|yesterday)\b',
            r'\b(this week|next week|this month|next month)\b',
            r'\b(january|february|march|april|may|june|july|august|september|october|november|december)\b'
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                entities['date'] = match.group()
                break
        
        # Number entities
        number_match = re.search(r'\b(\d+)\b', query)
        if number_match:
            entities['number'] = int(number_match.group())
        
        return entities
    
    def _determine_routing(self, intent: IntentType, confidence: float, entities: Dict[str, Any], query_length: int) -> Tuple[bool, bool, str, str]:
        """
        Determine the optimal routing path based on intent analysis.
        
        Returns:
            Tuple of (requires_context, bypass_context, routing_path, processing_notes)
        """
        
        # High-confidence simple intents that don't need context
        if intent in [IntentType.GREETING, IntentType.THANKS, IntentType.GOODBYE] and confidence > 0.8:
            return False, True, "direct_llm", f"Simple {intent.value} - bypassing context"
        
        # System commands that don't need user context
        if intent == IntentType.SYSTEM_COMMAND and confidence > 0.7:
            return False, True, "system_handler", "System command - no context needed"
        
        # Simple questions that might not need full context
        if intent == IntentType.SIMPLE_QUESTION and confidence > 0.7 and query_length < 8:
            return False, True, "direct_llm", "Simple question - minimal context"
        
        # Weather queries that might not need user preferences
        if intent == IntentType.WEATHER_QUERY and confidence > 0.7 and 'location' in entities:
            return False, True, "weather_api", "Weather query with location - direct API call"
        
        # Complex queries that need full context
        if intent in [IntentType.TRAVEL_PLANNING, IntentType.BOOKING_REQUEST, IntentType.SEARCH_REQUEST]:
            return True, False, "full_context", f"Complex {intent.value} - needs full context"
        
        # Default to full context for unknown or low-confidence intents
        if confidence < 0.6 or intent == IntentType.UNKNOWN:
            return True, False, "full_context", "Low confidence or unknown intent - using full context"
        
        # Medium confidence - use lightweight context
        return True, False, "lightweight_context", f"Medium confidence {intent.value} - using lightweight context"
    
    async def route_query(self, query: str, user_id: str = "default") -> Dict[str, Any]:
        """
        Route the query to the appropriate processing path.
        
        Args:
            query: User's input query
            user_id: User identifier
            
        Returns:
            Routing decision with processing instructions
        """
        try:
            intent_result = await self.analyze_intent(query, user_id)
            
            routing_decision = {
                'intent': intent_result.intent.value,
                'confidence': intent_result.confidence,
                'entities': intent_result.entities,
                'requires_context': intent_result.requires_context,
                'bypass_context': intent_result.bypass_context,
                'routing_path': intent_result.routing_path,
                'processing_notes': intent_result.processing_notes,
                'timestamp': datetime.now().isoformat(),
                'user_id': user_id,
                'query_length': len(query.split()),
                'estimated_latency': self._estimate_latency(intent_result)
            }
            
            logger.info(f"Query routed: {intent_result.intent.value} -> {intent_result.routing_path} (latency: {routing_decision['estimated_latency']}ms)")
            return routing_decision
            
        except Exception as e:
            logger.error(f"Error routing query: {e}")
            return {
                'intent': 'unknown',
                'confidence': 0.0,
                'entities': {},
                'requires_context': True,
                'bypass_context': False,
                'routing_path': 'full_context',
                'processing_notes': f'Routing error: {str(e)}',
                'timestamp': datetime.now().isoformat(),
                'user_id': user_id,
                'query_length': len(query.split()),
                'estimated_latency': 2000  # Fallback to high latency
            }
    
    def _estimate_latency(self, intent_result: IntentResult) -> int:
        """Estimate processing latency based on routing path."""
        latency_map = {
            'direct_llm': 200,  # Very fast - direct LLM call
            'system_handler': 100,  # Fast - system command
            'weather_api': 500,  # Medium - API call
            'lightweight_context': 800,  # Medium - minimal context
            'full_context': 1500  # Slower - full context processing
        }
        
        return latency_map.get(intent_result.routing_path, 1500)
    
    def get_routing_stats(self) -> Dict[str, Any]:
        """Get routing statistics for monitoring."""
        return {
            'router_initialized': True,
            'pattern_count': {
                'greeting': len(self.greeting_patterns),
                'thanks': len(self.thanks_patterns),
                'goodbye': len(self.goodbye_patterns),
                'simple_question': len(self.simple_question_patterns),
                'weather': len(self.weather_patterns),
                'travel_planning': len(self.travel_planning_patterns),
                'booking': len(self.booking_patterns),
                'search': len(self.search_patterns),
                'system_command': len(self.system_command_patterns)
            },
            'routing_paths': [
                'direct_llm',
                'system_handler', 
                'weather_api',
                'lightweight_context',
                'full_context'
            ]
        }
