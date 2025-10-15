"""
Preference Learning System - Production Ready
Provides intelligent user preference learning and adaptation.
"""

import asyncio
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
import re
from dataclasses import dataclass, asdict
from collections import defaultdict, Counter

from ..database.secure_database import SecureDatabase

logger = logging.getLogger(__name__)


@dataclass
class PreferencePattern:
    """Represents a learned preference pattern."""
    pattern_type: str
    pattern_value: str
    confidence: float
    frequency: int
    last_seen: datetime
    context: Dict[str, Any]


@dataclass
class UserProfile:
    """Represents a comprehensive user profile."""
    user_id: str
    travel_style: str
    budget_range: Tuple[float, float]
    preferred_destinations: List[str]
    preferred_activities: List[str]
    preferred_accommodations: List[str]
    preferred_transportation: List[str]
    dietary_preferences: List[str]
    accessibility_needs: List[str]
    language_preferences: List[str]
    last_updated: datetime
    confidence_scores: Dict[str, float]


class PreferenceLearningSystem:
    """
    Advanced preference learning system that intelligently learns and adapts to user preferences.
    Provides sophisticated pattern recognition and preference prediction.
    """
    
    def __init__(self, database: SecureDatabase):
        self.database = database
        self.user_profiles = {}  # In-memory cache for user profiles
        self.preference_patterns = {}  # In-memory cache for preference patterns
        self.learning_history = {}  # In-memory cache for learning history
        
        # Learning parameters
        self.min_confidence_threshold = 0.6
        self.pattern_frequency_threshold = 3
        self.learning_decay_days = 60
        self.max_preferences_per_type = 10
        
        # Preference categories
        self.preference_categories = {
            'travel_style': ['luxury', 'budget', 'adventure', 'cultural', 'relaxation', 'business'],
            'accommodation': ['hotel', 'hostel', 'airbnb', 'resort', 'apartment', 'villa'],
            'transportation': ['flight', 'train', 'bus', 'car', 'taxi', 'walking', 'bike'],
            'activities': ['sightseeing', 'food', 'nightlife', 'nature', 'museums', 'shopping', 'beach'],
            'dining': ['fine_dining', 'casual', 'street_food', 'local_cuisine', 'international', 'vegetarian', 'vegan'],
            'budget': ['low', 'medium', 'high', 'luxury'],
            'duration': ['short_trip', 'weekend', 'week_long', 'extended'],
            'group_size': ['solo', 'couple', 'family', 'group', 'business']
        }
        
        logger.info("🎯 Preference Learning System initialized")
    
    async def learn_from_conversation(self, user_id: str, conversation_data: Dict[str, Any]) -> bool:
        """
        Learn user preferences from conversation data.
        
        Args:
            user_id: Unique user identifier
            conversation_data: Conversation data including messages, context, etc.
            
        Returns:
            Success status
        """
        try:
            # Extract preferences from conversation
            extracted_preferences = await self._extract_preferences_from_conversation(
                user_id, conversation_data
            )
            
            # Update user profile
            await self._update_user_profile(user_id, extracted_preferences)
            
            # Learn new patterns
            await self._learn_preference_patterns(user_id, extracted_preferences)
            
            # Update learning history
            await self._update_learning_history(user_id, extracted_preferences)
            
            logger.info(f"✅ Learned preferences for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error learning from conversation: {e}")
            return False
    
    async def get_user_preferences(self, user_id: str) -> UserProfile:
        """
        Get comprehensive user preferences.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            User profile with preferences
        """
        try:
            # Try cache first
            if user_id in self.user_profiles:
                return self.user_profiles[user_id]
            
            # Load from database
            profile = await self._load_user_profile(user_id)
            
            # Update cache
            self.user_profiles[user_id] = profile
            
            return profile
            
        except Exception as e:
            logger.error(f"Error getting user preferences: {e}")
            return self._create_default_profile(user_id)
    
    async def predict_preferences(self, user_id: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict user preferences for a given context.
        
        Args:
            user_id: Unique user identifier
            context: Context for prediction (destination, dates, etc.)
            
        Returns:
            Predicted preferences
        """
        try:
            # Get user profile
            profile = await self.get_user_preferences(user_id)
            
            # Get relevant patterns
            patterns = await self._get_relevant_patterns(user_id, context)
            
            # Make predictions
            predictions = await self._make_preference_predictions(profile, patterns, context)
            
            return predictions
            
        except Exception as e:
            logger.error(f"Error predicting preferences: {e}")
            return {}
    
    async def get_preference_suggestions(self, user_id: str, query: str) -> List[str]:
        """
        Get personalized suggestions based on user preferences.
        
        Args:
            user_id: Unique user identifier
            query: User query for suggestions
            
        Returns:
            List of personalized suggestions
        """
        try:
            # Get user profile
            profile = await self.get_user_preferences(user_id)
            
            # Analyze query context
            query_context = await self._analyze_query_context(query)
            
            # Generate suggestions
            suggestions = await self._generate_personalized_suggestions(
                profile, query_context
            )
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Error getting preference suggestions: {e}")
            return []
    
    async def update_preference_confidence(self, user_id: str, preference_type: str, 
                                         preference_value: str, feedback: str) -> bool:
        """
        Update preference confidence based on user feedback.
        
        Args:
            user_id: Unique user identifier
            preference_type: Type of preference
            preference_value: Preference value
            feedback: User feedback ('positive', 'negative', 'neutral')
            
        Returns:
            Success status
        """
        try:
            # Get current profile
            profile = await self.get_user_preferences(user_id)
            
            # Update confidence based on feedback
            confidence_adjustment = {
                'positive': 0.1,
                'negative': -0.1,
                'neutral': 0.0
            }
            
            adjustment = confidence_adjustment.get(feedback, 0.0)
            
            # Update confidence score
            if preference_type in profile.confidence_scores:
                new_confidence = max(0.0, min(1.0, 
                    profile.confidence_scores[preference_type] + adjustment))
                profile.confidence_scores[preference_type] = new_confidence
            
            # Save updated profile
            await self._save_user_profile(profile)
            
            logger.info(f"✅ Updated preference confidence for user {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating preference confidence: {e}")
            return False
    
    async def _extract_preferences_from_conversation(self, user_id: str, 
                                                   conversation_data: Dict[str, Any]) -> Dict[str, Any]:
        """Extract preferences from conversation data."""
        try:
            preferences = defaultdict(list)
            
            # Extract from user messages
            user_messages = conversation_data.get('user_messages', [])
            for message in user_messages:
                message_preferences = await self._extract_preferences_from_text(
                    message.get('content', ''), message.get('context', {})
                )
                for pref_type, pref_values in message_preferences.items():
                    preferences[pref_type].extend(pref_values)
            
            # Extract from context data
            context_data = conversation_data.get('context', {})
            if context_data:
                context_preferences = await self._extract_preferences_from_context(context_data)
                for pref_type, pref_values in context_preferences.items():
                    preferences[pref_type].extend(pref_values)
            
            # Extract from entities
            entities = conversation_data.get('entities', {})
            if entities:
                entity_preferences = await self._extract_preferences_from_entities(entities)
                for pref_type, pref_values in entity_preferences.items():
                    preferences[pref_type].extend(pref_values)
            
            return dict(preferences)
            
        except Exception as e:
            logger.error(f"Error extracting preferences from conversation: {e}")
            return {}
    
    async def _extract_preferences_from_text(self, text: str, context: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract preferences from text using NLP techniques."""
        try:
            preferences = defaultdict(list)
            text_lower = text.lower()
            
            # Travel style preferences
            if any(word in text_lower for word in ['luxury', 'expensive', 'high-end', 'premium']):
                preferences['travel_style'].append('luxury')
            elif any(word in text_lower for word in ['budget', 'cheap', 'affordable', 'economical']):
                preferences['travel_style'].append('budget')
            elif any(word in text_lower for word in ['adventure', 'hiking', 'outdoor', 'extreme']):
                preferences['travel_style'].append('adventure')
            elif any(word in text_lower for word in ['culture', 'museum', 'history', 'art']):
                preferences['travel_style'].append('cultural')
            elif any(word in text_lower for word in ['relax', 'beach', 'spa', 'peaceful']):
                preferences['travel_style'].append('relaxation')
            
            # Accommodation preferences
            if any(word in text_lower for word in ['hotel', 'resort', 'accommodation']):
                preferences['accommodation'].append('hotel')
            elif any(word in text_lower for word in ['hostel', 'backpack', 'budget']):
                preferences['accommodation'].append('hostel')
            elif any(word in text_lower for word in ['airbnb', 'apartment', 'rental']):
                preferences['accommodation'].append('airbnb')
            
            # Activity preferences
            if any(word in text_lower for word in ['food', 'restaurant', 'dining', 'cuisine']):
                preferences['activities'].append('food')
            elif any(word in text_lower for word in ['nightlife', 'bar', 'club', 'party']):
                preferences['activities'].append('nightlife')
            elif any(word in text_lower for word in ['nature', 'park', 'hiking', 'outdoor']):
                preferences['activities'].append('nature')
            elif any(word in text_lower for word in ['museum', 'gallery', 'art', 'culture']):
                preferences['activities'].append('museums')
            elif any(word in text_lower for word in ['shopping', 'market', 'store']):
                preferences['activities'].append('shopping')
            elif any(word in text_lower for word in ['beach', 'swimming', 'water']):
                preferences['activities'].append('beach')
            
            # Budget preferences
            budget_patterns = [
                (r'\$(\d+)', 'budget_amount'),
                (r'(\d+)\s*(?:usd|dollars?)', 'budget_amount'),
                (r'budget\s*of\s*(\d+)', 'budget_amount')
            ]
            
            for pattern, pref_type in budget_patterns:
                matches = re.findall(pattern, text_lower)
                for match in matches:
                    try:
                        amount = float(match)
                        if amount < 1000:
                            preferences['budget'].append('low')
                        elif amount < 5000:
                            preferences['budget'].append('medium')
                        elif amount < 10000:
                            preferences['budget'].append('high')
                        else:
                            preferences['budget'].append('luxury')
                    except ValueError:
                        continue
            
            # Duration preferences
            if any(word in text_lower for word in ['weekend', '2 days', '3 days']):
                preferences['duration'].append('weekend')
            elif any(word in text_lower for word in ['week', '7 days', 'one week']):
                preferences['duration'].append('week_long')
            elif any(word in text_lower for word in ['month', 'extended', 'long']):
                preferences['duration'].append('extended')
            else:
                preferences['duration'].append('short_trip')
            
            return dict(preferences)
            
        except Exception as e:
            logger.error(f"Error extracting preferences from text: {e}")
            return {}
    
    async def _extract_preferences_from_context(self, context: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract preferences from context data."""
        try:
            preferences = defaultdict(list)
            
            # Extract from travel info
            if 'travel_info' in context:
                travel_info = context['travel_info']
                
                # Destination preferences
                if 'destination' in travel_info:
                    preferences['preferred_destinations'].append(travel_info['destination'])
                
                # Budget preferences
                if 'budget' in travel_info:
                    budget = travel_info['budget']
                    if isinstance(budget, (int, float)):
                        if budget < 1000:
                            preferences['budget'].append('low')
                        elif budget < 5000:
                            preferences['budget'].append('medium')
                        elif budget < 10000:
                            preferences['budget'].append('high')
                        else:
                            preferences['budget'].append('luxury')
            
            # Extract from user preferences
            if 'user_preferences' in context:
                user_prefs = context['user_preferences']
                for pref_type, pref_value in user_prefs.items():
                    if isinstance(pref_value, list):
                        preferences[pref_type].extend(pref_value)
                    else:
                        preferences[pref_type].append(str(pref_value))
            
            return dict(preferences)
            
        except Exception as e:
            logger.error(f"Error extracting preferences from context: {e}")
            return {}
    
    async def _extract_preferences_from_entities(self, entities: Dict[str, Any]) -> Dict[str, List[str]]:
        """Extract preferences from extracted entities."""
        try:
            preferences = defaultdict(list)
            
            # Location entities
            if 'locations' in entities:
                preferences['preferred_destinations'].extend(entities['locations'])
            
            # Currency entities
            if 'currencies' in entities:
                for currency in entities['currencies']:
                    # Extract budget level from currency amount
                    if '$' in currency or 'usd' in currency.lower():
                        try:
                            amount = float(re.findall(r'[\d.]+', currency)[0])
                            if amount < 1000:
                                preferences['budget'].append('low')
                            elif amount < 5000:
                                preferences['budget'].append('medium')
                            elif amount < 10000:
                                preferences['budget'].append('high')
                            else:
                                preferences['budget'].append('luxury')
                        except (ValueError, IndexError):
                            continue
            
            # Date entities
            if 'dates' in entities:
                # Analyze date patterns for duration preferences
                date_count = len(entities['dates'])
                if date_count == 1:
                    preferences['duration'].append('short_trip')
                elif date_count == 2:
                    preferences['duration'].append('weekend')
                elif date_count <= 7:
                    preferences['duration'].append('week_long')
                else:
                    preferences['duration'].append('extended')
            
            return dict(preferences)
            
        except Exception as e:
            logger.error(f"Error extracting preferences from entities: {e}")
            return {}
    
    async def _update_user_profile(self, user_id: str, preferences: Dict[str, List[str]]) -> None:
        """Update user profile with new preferences."""
        try:
            # Get current profile
            profile = await self.get_user_preferences(user_id)
            
            # Update profile with new preferences
            for pref_type, pref_values in preferences.items():
                if pref_type == 'travel_style':
                    profile.travel_style = self._get_most_common(pref_values, profile.travel_style)
                elif pref_type == 'preferred_destinations':
                    profile.preferred_destinations = self._merge_lists(
                        profile.preferred_destinations, pref_values
                    )
                elif pref_type == 'preferred_activities':
                    profile.preferred_activities = self._merge_lists(
                        profile.preferred_activities, pref_values
                    )
                elif pref_type == 'preferred_accommodations':
                    profile.preferred_accommodations = self._merge_lists(
                        profile.preferred_accommodations, pref_values
                    )
                elif pref_type == 'budget':
                    budget_level = self._get_most_common(pref_values)
                    if budget_level:
                        profile.budget_range = self._get_budget_range(budget_level)
                
                # Update confidence scores
                if pref_type in profile.confidence_scores:
                    profile.confidence_scores[pref_type] = min(1.0, 
                        profile.confidence_scores[pref_type] + 0.1)
                else:
                    profile.confidence_scores[pref_type] = 0.7
            
            profile.last_updated = datetime.now()
            
            # Save updated profile
            await self._save_user_profile(profile)
            
        except Exception as e:
            logger.error(f"Error updating user profile: {e}")
    
    def _get_most_common(self, values: List[str], default: str = None) -> str:
        """Get the most common value from a list."""
        if not values:
            return default
        
        counter = Counter(values)
        return counter.most_common(1)[0][0]
    
    def _merge_lists(self, existing: List[str], new: List[str], max_items: int = 10) -> List[str]:
        """Merge two lists, keeping the most frequent items."""
        combined = existing + new
        counter = Counter(combined)
        return [item for item, count in counter.most_common(max_items)]
    
    def _get_budget_range(self, budget_level: str) -> Tuple[float, float]:
        """Get budget range from budget level."""
        ranges = {
            'low': (0, 1000),
            'medium': (1000, 5000),
            'high': (5000, 10000),
            'luxury': (10000, float('inf'))
        }
        return ranges.get(budget_level, (0, 5000))
    
    async def _learn_preference_patterns(self, user_id: str, preferences: Dict[str, List[str]]) -> None:
        """Learn preference patterns from user data."""
        try:
            if user_id not in self.preference_patterns:
                self.preference_patterns[user_id] = []
            
            # Create patterns from preferences
            for pref_type, pref_values in preferences.items():
                for value in pref_values:
                    pattern = PreferencePattern(
                        pattern_type=pref_type,
                        pattern_value=value,
                        confidence=0.7,
                        frequency=1,
                        last_seen=datetime.now(),
                        context={}
                    )
                    
                    # Check if pattern already exists
                    existing_pattern = None
                    for existing in self.preference_patterns[user_id]:
                        if (existing.pattern_type == pref_type and 
                            existing.pattern_value == value):
                            existing_pattern = existing
                            break
                    
                    if existing_pattern:
                        # Update existing pattern
                        existing_pattern.frequency += 1
                        existing_pattern.confidence = min(1.0, existing_pattern.confidence + 0.1)
                        existing_pattern.last_seen = datetime.now()
                    else:
                        # Add new pattern
                        self.preference_patterns[user_id].append(pattern)
            
        except Exception as e:
            logger.error(f"Error learning preference patterns: {e}")
    
    async def _update_learning_history(self, user_id: str, preferences: Dict[str, List[str]]) -> None:
        """Update learning history for a user."""
        try:
            if user_id not in self.learning_history:
                self.learning_history[user_id] = []
            
            learning_entry = {
                'timestamp': datetime.now(),
                'preferences_learned': preferences,
                'learning_method': 'conversation_analysis'
            }
            
            self.learning_history[user_id].append(learning_entry)
            
            # Keep only recent history
            cutoff_date = datetime.now() - timedelta(days=self.learning_decay_days)
            self.learning_history[user_id] = [
                entry for entry in self.learning_history[user_id]
                if entry['timestamp'] > cutoff_date
            ]
            
        except Exception as e:
            logger.error(f"Error updating learning history: {e}")
    
    async def _get_relevant_patterns(self, user_id: str, context: Dict[str, Any]) -> List[PreferencePattern]:
        """Get relevant preference patterns for a context."""
        try:
            if user_id not in self.preference_patterns:
                return []
            
            relevant_patterns = []
            for pattern in self.preference_patterns[user_id]:
                # Check if pattern is relevant to context
                if await self._is_pattern_relevant(pattern, context):
                    relevant_patterns.append(pattern)
            
            # Sort by confidence and frequency
            relevant_patterns.sort(key=lambda p: (p.confidence, p.frequency), reverse=True)
            
            return relevant_patterns[:5]  # Return top 5 patterns
            
        except Exception as e:
            logger.error(f"Error getting relevant patterns: {e}")
            return []
    
    async def _is_pattern_relevant(self, pattern: PreferencePattern, context: Dict[str, Any]) -> bool:
        """Check if a pattern is relevant to the given context."""
        try:
            # Simple relevance check based on context keywords
            context_text = str(context).lower()
            pattern_text = f"{pattern.pattern_type} {pattern.pattern_value}".lower()
            
            # Check for keyword overlap
            context_words = set(context_text.split())
            pattern_words = set(pattern_text.split())
            
            overlap = len(context_words.intersection(pattern_words))
            return overlap > 0
            
        except Exception as e:
            logger.error(f"Error checking pattern relevance: {e}")
            return False
    
    async def _make_preference_predictions(self, profile: UserProfile, 
                                         patterns: List[PreferencePattern], 
                                         context: Dict[str, Any]) -> Dict[str, Any]:
        """Make preference predictions based on profile and patterns."""
        try:
            predictions = {}
            
            # Predict based on profile
            predictions['travel_style'] = profile.travel_style
            predictions['budget_range'] = profile.budget_range
            predictions['preferred_destinations'] = profile.preferred_destinations[:3]
            predictions['preferred_activities'] = profile.preferred_activities[:3]
            
            # Predict based on patterns
            for pattern in patterns:
                if pattern.confidence > self.min_confidence_threshold:
                    predictions[f"predicted_{pattern.pattern_type}"] = pattern.pattern_value
            
            return predictions
            
        except Exception as e:
            logger.error(f"Error making preference predictions: {e}")
            return {}
    
    async def _analyze_query_context(self, query: str) -> Dict[str, Any]:
        """Analyze query context for suggestion generation."""
        try:
            context = {
                'query_type': 'general',
                'keywords': [],
                'entities': [],
                'intent': 'unknown'
            }
            
            query_lower = query.lower()
            
            # Determine query type
            if any(word in query_lower for word in ['where', 'destination', 'place']):
                context['query_type'] = 'destination'
            elif any(word in query_lower for word in ['what', 'do', 'activity']):
                context['query_type'] = 'activity'
            elif any(word in query_lower for word in ['hotel', 'stay', 'accommodation']):
                context['query_type'] = 'accommodation'
            elif any(word in query_lower for word in ['eat', 'food', 'restaurant']):
                context['query_type'] = 'dining'
            elif any(word in query_lower for word in ['budget', 'cost', 'price']):
                context['query_type'] = 'budget'
            
            # Extract keywords
            context['keywords'] = query_lower.split()
            
            return context
            
        except Exception as e:
            logger.error(f"Error analyzing query context: {e}")
            return {}
    
    async def _generate_personalized_suggestions(self, profile: UserProfile, 
                                               query_context: Dict[str, Any]) -> List[str]:
        """Generate personalized suggestions based on profile and query context."""
        try:
            suggestions = []
            query_type = query_context.get('query_type', 'general')
            
            if query_type == 'destination':
                suggestions.extend(profile.preferred_destinations[:3])
            elif query_type == 'activity':
                suggestions.extend(profile.preferred_activities[:3])
            elif query_type == 'accommodation':
                suggestions.extend(profile.preferred_accommodations[:3])
            elif query_type == 'dining':
                suggestions.extend(profile.dietary_preferences[:3])
            else:
                # General suggestions
                suggestions.extend(profile.preferred_destinations[:2])
                suggestions.extend(profile.preferred_activities[:2])
            
            return suggestions[:5]  # Return top 5 suggestions
            
        except Exception as e:
            logger.error(f"Error generating personalized suggestions: {e}")
            return []
    
    def _create_default_profile(self, user_id: str) -> UserProfile:
        """Create a default user profile."""
        return UserProfile(
            user_id=user_id,
            travel_style='general',
            budget_range=(1000, 5000),
            preferred_destinations=[],
            preferred_activities=[],
            preferred_accommodations=[],
            preferred_transportation=[],
            dietary_preferences=[],
            accessibility_needs=[],
            language_preferences=[],
            last_updated=datetime.now(),
            confidence_scores={}
        )
    
    # Database operations
    async def _load_user_profile(self, user_id: str) -> UserProfile:
        """Load user profile from database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, return default profile
            return self._create_default_profile(user_id)
        except Exception as e:
            logger.error(f"Error loading user profile: {e}")
            return self._create_default_profile(user_id)
    
    async def _save_user_profile(self, profile: UserProfile) -> None:
        """Save user profile to database."""
        try:
            # This would integrate with the existing SecureDatabase
            # For now, update cache
            self.user_profiles[profile.user_id] = profile
        except Exception as e:
            logger.error(f"Error saving user profile: {e}")
