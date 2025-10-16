"""
Context Provider Interface - Clean Architecture Implementation
Defines the contract for providing context data to the MDP (Main Decision Process).

This interface implements the Dependency Inversion Principle by:
- Defining what data the MDP needs (abstraction)
- Allowing different implementations (database, API, cache, etc.)
- Decoupling MDP from specific data access implementations
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from datetime import datetime


class ContextProvider(ABC):
    """
    Abstract interface for providing context data to the MDP.
    
    This interface ensures that the MDP (Main Decision Process) receives
    all necessary context data without knowing how it's retrieved or stored.
    This follows the Single Responsibility Principle and Dependency Inversion Principle.
    """
    
    @abstractmethod
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
        pass
    
    @abstractmethod
    async def get_conversation_context(self, user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get recent conversation context for the user.
        
        Args:
            user_id: Unique user identifier
            limit: Maximum number of conversation turns to retrieve
            
        Returns:
            List of recent conversation turns with context data
        """
        pass
    
    @abstractmethod
    async def get_preferences_context(self, user_id: str) -> Dict[str, Any]:
        """
        Get user preferences context for personalization.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            User preferences including travel style, budget, activities, etc.
        """
        pass
    
    @abstractmethod
    async def get_memory_context(self, user_id: str, query: str = None) -> List[Dict[str, Any]]:
        """
        Get relevant memory context for the user.
        
        Args:
            user_id: Unique user identifier
            query: Optional query to filter relevant memories
            
        Returns:
            List of relevant memory entries
        """
        pass
    
    @abstractmethod
    async def get_preference_patterns(self, user_id: str) -> List[Dict[str, Any]]:
        """
        Get learned preference patterns for the user.
        
        Args:
            user_id: Unique user identifier
            
        Returns:
            List of learned preference patterns with confidence scores
        """
        pass
    
    @abstractmethod
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
        pass
    
    @abstractmethod
    async def store_interaction_context(self, user_id: str, interaction_data: Dict[str, Any]) -> bool:
        """
        Store interaction context for future use.
        
        Args:
            user_id: Unique user identifier
            interaction_data: Interaction data to store
            
        Returns:
            Success status of storage operation
        """
        pass
    
    @abstractmethod
    async def get_context_summary(self, user_id: str, summary_type: str = "general") -> Optional[str]:
        """
        Get context summary for the user.
        
        Args:
            user_id: Unique user identifier
            summary_type: Type of summary to retrieve
            
        Returns:
            Context summary string or None if not available
        """
        pass


class ContextData:
    """
    Data class representing complete context for MDP.
    
    This class provides a structured way to pass context data
    between the Context Provider and the MDP.
    """
    
    def __init__(self, user_id: str, timestamp: datetime = None):
        self.user_id = user_id
        self.timestamp = timestamp or datetime.now()
        
        # Core context data
        self.preferences: Dict[str, Any] = {}
        self.conversation_history: List[Dict[str, Any]] = []
        self.memory_context: List[Dict[str, Any]] = []
        self.preference_patterns: List[Dict[str, Any]] = []
        self.context_summary: Optional[str] = None
        
        # Derived context
        self.travel_style: str = "general"
        self.budget_range: tuple = (1000, 5000)
        self.preferred_destinations: List[str] = []
        self.preferred_activities: List[str] = []
        
        # Metadata
        self.confidence_scores: Dict[str, float] = {}
        self.last_updated: Optional[datetime] = None
        self.context_quality: float = 0.0
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert context data to dictionary format."""
        return {
            'user_id': self.user_id,
            'timestamp': self.timestamp.isoformat(),
            'preferences': self.preferences,
            'conversation_history': self.conversation_history,
            'memory_context': self.memory_context,
            'preference_patterns': self.preference_patterns,
            'context_summary': self.context_summary,
            'travel_style': self.travel_style,
            'budget_range': self.budget_range,
            'preferred_destinations': self.preferred_destinations,
            'preferred_activities': self.preferred_activities,
            'confidence_scores': self.confidence_scores,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None,
            'context_quality': self.context_quality
        }
    
    def calculate_context_quality(self) -> float:
        """
        Calculate the quality score of the context data.
        
        Returns:
            Quality score between 0.0 and 1.0
        """
        quality_factors = []
        
        # Check if we have basic preferences
        if self.preferences:
            quality_factors.append(0.2)
        
        # Check conversation history
        if len(self.conversation_history) > 0:
            quality_factors.append(0.2)
        
        # Check memory context
        if len(self.memory_context) > 0:
            quality_factors.append(0.2)
        
        # Check preference patterns
        if len(self.preference_patterns) > 0:
            quality_factors.append(0.2)
        
        # Check confidence scores
        if self.confidence_scores:
            avg_confidence = sum(self.confidence_scores.values()) / len(self.confidence_scores)
            quality_factors.append(avg_confidence * 0.2)
        
        self.context_quality = sum(quality_factors)
        return self.context_quality
