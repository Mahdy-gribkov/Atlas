"""
Database models for the Travel AI Agent.
Defines the structure of data stored in the encrypted local database.
"""

from dataclasses import dataclass
from datetime import datetime
from typing import Optional, Dict, Any, List
import json

@dataclass
class UserPreference:
    """User preference model with automatic expiration."""
    id: Optional[int] = None
    preference_type: str = ""
    preference_value: str = ""
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database storage."""
        return {
            'id': self.id,
            'preference_type': self.preference_type,
            'preference_value': self.preference_value,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'UserPreference':
        """Create from dictionary."""
        return cls(
            id=data.get('id'),
            preference_type=data.get('preference_type', ''),
            preference_value=data.get('preference_value', ''),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            expires_at=datetime.fromisoformat(data['expires_at']) if data.get('expires_at') else None
        )

@dataclass
class SearchHistory:
    """Search history model with automatic cleanup."""
    id: Optional[int] = None
    search_type: str = ""
    search_params: str = ""  # JSON string
    results_count: int = 0
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database storage."""
        return {
            'id': self.id,
            'search_type': self.search_type,
            'search_params': self.search_params,
            'results_count': self.results_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'SearchHistory':
        """Create from dictionary."""
        return cls(
            id=data.get('id'),
            search_type=data.get('search_type', ''),
            search_params=data.get('search_params', ''),
            results_count=data.get('results_count', 0),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            expires_at=datetime.fromisoformat(data['expires_at']) if data.get('expires_at') else None
        )
    
    def get_search_params(self) -> Dict[str, Any]:
        """Get search parameters as dictionary."""
        try:
            return json.loads(self.search_params)
        except (json.JSONDecodeError, TypeError):
            return {}
    
    def set_search_params(self, params: Dict[str, Any]):
        """Set search parameters from dictionary."""
        self.search_params = json.dumps(params)

@dataclass
class TravelPlan:
    """Travel plan model for storing trip information."""
    id: Optional[int] = None
    plan_name: str = ""
    destination: str = ""
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    travelers: int = 1
    budget: float = 0.0
    currency: str = "USD"
    plan_data: str = ""  # JSON string with detailed plan
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database storage."""
        return {
            'id': self.id,
            'plan_name': self.plan_name,
            'destination': self.destination,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'travelers': self.travelers,
            'budget': self.budget,
            'currency': self.currency,
            'plan_data': self.plan_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'TravelPlan':
        """Create from dictionary."""
        return cls(
            id=data.get('id'),
            plan_name=data.get('plan_name', ''),
            destination=data.get('destination', ''),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None,
            travelers=data.get('travelers', 1),
            budget=data.get('budget', 0.0),
            currency=data.get('currency', 'USD'),
            plan_data=data.get('plan_data', ''),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            updated_at=datetime.fromisoformat(data['updated_at']) if data.get('updated_at') else None
        )
    
    def get_plan_data(self) -> Dict[str, Any]:
        """Get plan data as dictionary."""
        try:
            return json.loads(self.plan_data)
        except (json.JSONDecodeError, TypeError):
            return {}
    
    def set_plan_data(self, data: Dict[str, Any]):
        """Set plan data from dictionary."""
        self.plan_data = json.dumps(data)

@dataclass
class APICache:
    """API cache model for storing API responses."""
    id: Optional[int] = None
    api_name: str = ""
    endpoint: str = ""
    params_hash: str = ""
    response_data: str = ""  # JSON string
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database storage."""
        return {
            'id': self.id,
            'api_name': self.api_name,
            'endpoint': self.endpoint,
            'params_hash': self.params_hash,
            'response_data': self.response_data,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'APICache':
        """Create from dictionary."""
        return cls(
            id=data.get('id'),
            api_name=data.get('api_name', ''),
            endpoint=data.get('endpoint', ''),
            params_hash=data.get('params_hash', ''),
            response_data=data.get('response_data', ''),
            created_at=datetime.fromisoformat(data['created_at']) if data.get('created_at') else None,
            expires_at=datetime.fromisoformat(data['expires_at']) if data.get('expires_at') else None
        )
    
    def get_response_data(self) -> Dict[str, Any]:
        """Get response data as dictionary."""
        try:
            return json.loads(self.response_data)
        except (json.JSONDecodeError, TypeError):
            return {}
    
    def set_response_data(self, data: Dict[str, Any]):
        """Set response data from dictionary."""
        self.response_data = json.dumps(data)
