"""
Database models for the Travel AI Agent.
Defines Pydantic models for data validation and serialization.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class PreferenceType(str, Enum):
    """User preference types."""
    DEPARTURE_LOCATION = "departure_location"
    DESTINATION = "destination"
    BUDGET = "budget"
    TRAVEL_STYLE = "travel_style"
    INTERESTS = "interests"
    DURATION = "duration"

class SearchType(str, Enum):
    """Search types for history tracking."""
    FLIGHT = "flight"
    HOTEL = "hotel"
    WEATHER = "weather"
    ATTRACTION = "attraction"
    RESTAURANT = "restaurant"
    TRANSPORTATION = "transportation"
    CAR_RENTAL = "car_rental"
    EVENT = "event"
    INSURANCE = "insurance"
    GENERAL = "general"

class UserPreference(BaseModel):
    """User preference model."""
    id: Optional[int] = None
    preference_type: PreferenceType
    preference_value: str
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

class SearchHistory(BaseModel):
    """Search history model."""
    id: Optional[int] = None
    search_type: SearchType
    search_params: str  # JSON string of search parameters
    results_count: int = 0
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

class TravelPlan(BaseModel):
    """Travel plan model."""
    id: Optional[int] = None
    plan_name: str
    destination: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    travelers: int = 1
    budget: float = 0.0
    currency: str = "USD"
    plan_data: str  # JSON string of plan details
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class APICache(BaseModel):
    """API cache model."""
    id: Optional[int] = None
    api_name: str
    endpoint: str
    params_hash: str
    response_data: str  # JSON string of response
    created_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None

class Conversation(BaseModel):
    """Conversation model."""
    id: Optional[int] = None
    user_id: str
    user_message: str
    assistant_response: str
    created_at: Optional[datetime] = None

class WeatherData(BaseModel):
    """Weather data model."""
    city: str
    temperature: Optional[float] = None
    feels_like: Optional[float] = None
    humidity: Optional[int] = None
    description: Optional[str] = None
    wind_speed: Optional[float] = None
    wind_direction: Optional[str] = None
    pressure: Optional[float] = None
    visibility: Optional[float] = None
    uv_index: Optional[int] = None
    source: Optional[str] = None
    timestamp: Optional[datetime] = None

class FlightData(BaseModel):
    """Flight data model."""
    airline: str
    airline_code: str
    flight_number: str
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    duration: str
    price: str
    currency: str = "USD"
    stops: str
    aircraft: str
    date: str
    source: str
    booking_url: Optional[str] = None

class HotelData(BaseModel):
    """Hotel data model."""
    name: str
    stars: int
    rating: float
    price: str
    location: str
    amenities: List[str]
    reviews_count: int
    booking_url: Optional[str] = None
    source: str

class AttractionData(BaseModel):
    """Attraction data model."""
    name: str
    category: str
    rating: float
    price: str
    duration: str
    lat: Optional[float] = None
    lng: Optional[float] = None
    source: str

class RestaurantData(BaseModel):
    """Restaurant data model."""
    name: str
    cuisine: str
    rating: float
    price_range: str
    specialty: str
    location: str
    features: List[str]
    popular_dishes: List[str]
    reservations: str
    source: str

class TransportationData(BaseModel):
    """Transportation data model."""
    type: str
    service: str
    price: str
    speed: str
    convenience: str
    source: str

class CarRentalData(BaseModel):
    """Car rental data model."""
    company: str
    car_type: str
    car_model: str
    total_price: str
    daily_price: str
    rating: float
    pickup_location: str
    features: List[str]
    insurance: str
    booking_url: Optional[str] = None
    source: str

class EventData(BaseModel):
    """Event data model."""
    name: str
    category: str
    date: str
    time: str
    venue: str
    price: str
    rating: float
    source: str

class InsuranceData(BaseModel):
    """Insurance data model."""
    provider: str
    coverage_type: str
    total_price: str
    daily_price: str
    rating: float
    coverage_level: str
    medical_coverage: str
    trip_cancellation: str
    features: List[str]
    booking_url: Optional[str] = None
    source: str

class CountryData(BaseModel):
    """Country data model."""
    name: str
    capital: Optional[str] = None
    population: Optional[int] = None
    currency: Optional[str] = None
    languages: List[str] = []
    region: Optional[str] = None
    subregion: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    source: str

class GeocodeData(BaseModel):
    """Geocode data model."""
    lat: float
    lng: float
    name: str
    address: str
    source: str