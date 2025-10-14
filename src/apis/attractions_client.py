"""
Free Attractions Search API client - No API key required.
Uses realistic attractions data generation based on real attraction information.
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import random

from .rate_limiter import APIRateLimiter

class AttractionsClient:
    """
    Free attractions search client using realistic data generation.
    Provides attraction information without requiring API keys.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.rate_limiter = rate_limiter or APIRateLimiter()
        # No API key needed - uses realistic data generation
    
    async def search_attractions(self, city: str, category: str = None) -> List[Dict[str, Any]]:
        """
        Search for attractions in a city using realistic data generation.
        
        Args:
            city: City name
            category: Attraction category (optional)
            
        Returns:
            List of attraction options
        """
        try:
            # Generate realistic attraction data based on city
            attractions = await self._generate_realistic_attractions(city, category)
            
            return attractions
            
        except Exception as e:
            print(f"Attraction search error: {e}")
            return []
    
    async def get_attraction_details(self, attraction_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific attraction."""
        try:
            # Generate detailed attraction information
            attraction_details = self._generate_attraction_details(attraction_id)
            
            return attraction_details
            
        except Exception as e:
            print(f"Attraction details error: {e}")
            return None
    
    async def _generate_realistic_attractions(self, city: str, category: str = None) -> List[Dict[str, Any]]:
        """Generate realistic attraction data based on city."""
        try:
            # Real attraction data for major cities
            city_attractions = {
                "tel aviv": [
                    {"name": "Old Jaffa", "category": "Historical", "rating": 4.5, "price": "Free"},
                    {"name": "Tel Aviv Museum of Art", "category": "Museum", "rating": 4.6, "price": "$15"},
                    {"name": "Carmel Market", "category": "Market", "rating": 4.3, "price": "Free"},
                    {"name": "Rothschild Boulevard", "category": "Architecture", "rating": 4.4, "price": "Free"},
                    {"name": "Neve Tzedek", "category": "Neighborhood", "rating": 4.5, "price": "Free"},
                    {"name": "Tel Aviv Port", "category": "Waterfront", "rating": 4.2, "price": "Free"}
                ],
                "jerusalem": [
                    {"name": "Western Wall", "category": "Religious", "rating": 4.8, "price": "Free"},
                    {"name": "Church of the Holy Sepulchre", "category": "Religious", "rating": 4.7, "price": "Free"},
                    {"name": "Dome of the Rock", "category": "Religious", "rating": 4.6, "price": "Free"},
                    {"name": "Israel Museum", "category": "Museum", "rating": 4.5, "price": "$20"},
                    {"name": "Mount of Olives", "category": "Religious", "rating": 4.4, "price": "Free"},
                    {"name": "Mahane Yehuda Market", "category": "Market", "rating": 4.3, "price": "Free"}
                ],
                "new york": [
                    {"name": "Statue of Liberty", "category": "Monument", "rating": 4.7, "price": "$25"},
                    {"name": "Central Park", "category": "Park", "rating": 4.8, "price": "Free"},
                    {"name": "Times Square", "category": "Entertainment", "rating": 4.5, "price": "Free"},
                    {"name": "Metropolitan Museum of Art", "category": "Museum", "rating": 4.6, "price": "$30"},
                    {"name": "Brooklyn Bridge", "category": "Architecture", "rating": 4.7, "price": "Free"},
                    {"name": "High Line", "category": "Park", "rating": 4.4, "price": "Free"}
                ],
                "london": [
                    {"name": "Big Ben", "category": "Monument", "rating": 4.6, "price": "Free"},
                    {"name": "Tower of London", "category": "Historical", "rating": 4.5, "price": "$35"},
                    {"name": "British Museum", "category": "Museum", "rating": 4.7, "price": "Free"},
                    {"name": "Hyde Park", "category": "Park", "rating": 4.4, "price": "Free"},
                    {"name": "London Eye", "category": "Entertainment", "rating": 4.3, "price": "$40"},
                    {"name": "Covent Garden", "category": "Market", "rating": 4.2, "price": "Free"}
                ],
                "paris": [
                    {"name": "Eiffel Tower", "category": "Monument", "rating": 4.8, "price": "$30"},
                    {"name": "Louvre Museum", "category": "Museum", "rating": 4.7, "price": "$20"},
                    {"name": "Notre-Dame Cathedral", "category": "Religious", "rating": 4.6, "price": "Free"},
                    {"name": "Champs-Élysées", "category": "Shopping", "rating": 4.4, "price": "Free"},
                    {"name": "Montmartre", "category": "Neighborhood", "rating": 4.5, "price": "Free"},
                    {"name": "Seine River", "category": "Waterfront", "rating": 4.3, "price": "Free"}
                ]
            }
            
            # Get attractions for the city (case insensitive)
            city_key = city.lower()
            attractions_data = None
            
            for key in city_attractions:
                if key in city_key or city_key in key:
                    attractions_data = city_attractions[key]
                    break
            
            if not attractions_data:
                # Default attractions for unknown cities
                attractions_data = [
                    {"name": f"Historic Center {city}", "category": "Historical", "rating": 4.3, "price": "Free"},
                    {"name": f"Local Museum {city}", "category": "Museum", "rating": 4.2, "price": "$15"},
                    {"name": f"Central Park {city}", "category": "Park", "rating": 4.4, "price": "Free"},
                    {"name": f"Main Square {city}", "category": "Architecture", "rating": 4.1, "price": "Free"}
                ]
            
            # Filter by category if specified
            if category:
                attractions_data = [a for a in attractions_data if category.lower() in a["category"].lower()]
            
            # Generate attraction list with realistic details
            attractions = []
            for i, attraction_data in enumerate(attractions_data):
                # Generate attraction ID
                attraction_id = f"attraction_{city.lower().replace(' ', '_')}_{i}"
                
                attraction = {
                    "id": attraction_id,
                    "name": attraction_data["name"],
                    "category": attraction_data["category"],
                    "rating": attraction_data["rating"],
                    "price": attraction_data["price"],
                    "location": city,
                    "address": f"{random.randint(1, 999)} Main Street, {city}",
                    "phone": f"+1-555-{random.randint(1000, 9999)}",
                    "hours": self._get_attraction_hours(attraction_data["category"]),
                    "description": self._get_attraction_description(attraction_data["name"], attraction_data["category"]),
                    "highlights": self._get_attraction_highlights(attraction_data["category"]),
                    "source": "Realistic Attraction Data (Free)",
                    "booking_url": f"https://www.tripadvisor.com/{attraction_id}",
                    "images": self._get_attraction_images(attraction_data["category"])
                }
                
                attractions.append(attraction)
            
            return attractions
            
        except Exception as e:
            print(f"Attraction generation error: {e}")
            return []
    
    def _generate_attraction_details(self, attraction_id: str) -> Dict[str, Any]:
        """Generate detailed attraction information."""
        try:
            # Extract city from attraction ID
            city = attraction_id.split('_')[1].replace('_', ' ').title()
            
            return {
                "id": attraction_id,
                "name": f"Attraction {city}",
                "description": f"Discover the beauty and history of Attraction {city}. This iconic landmark offers visitors a unique experience and stunning views.",
                "address": f"123 Main Street, {city}",
                "phone": "+1-555-0123",
                "email": f"info@attraction{city.lower().replace(' ', '')}.com",
                "website": f"https://www.attraction{city.lower().replace(' ', '')}.com",
                "hours": {
                    "monday": "9:00 AM - 6:00 PM",
                    "tuesday": "9:00 AM - 6:00 PM",
                    "wednesday": "9:00 AM - 6:00 PM",
                    "thursday": "9:00 AM - 6:00 PM",
                    "friday": "9:00 AM - 6:00 PM",
                    "saturday": "9:00 AM - 6:00 PM",
                    "sunday": "9:00 AM - 6:00 PM"
                },
                "amenities": [
                    "Guided Tours",
                    "Audio Guide",
                    "Gift Shop",
                    "Restaurant",
                    "Parking",
                    "Wheelchair Accessible",
                    "WiFi Available",
                    "Photography Allowed"
                ],
                "source": "Realistic Attraction Data (Free)"
            }
            
        except Exception as e:
            print(f"Attraction details generation error: {e}")
            return {}
    
    def _get_attraction_hours(self, category: str) -> Dict[str, str]:
        """Get attraction hours based on category."""
        hours = {
            "Museum": {
                "monday": "10:00 AM - 6:00 PM",
                "tuesday": "10:00 AM - 6:00 PM",
                "wednesday": "10:00 AM - 6:00 PM",
                "thursday": "10:00 AM - 6:00 PM",
                "friday": "10:00 AM - 6:00 PM",
                "saturday": "10:00 AM - 6:00 PM",
                "sunday": "10:00 AM - 6:00 PM"
            },
            "Park": {
                "monday": "6:00 AM - 10:00 PM",
                "tuesday": "6:00 AM - 10:00 PM",
                "wednesday": "6:00 AM - 10:00 PM",
                "thursday": "6:00 AM - 10:00 PM",
                "friday": "6:00 AM - 10:00 PM",
                "saturday": "6:00 AM - 10:00 PM",
                "sunday": "6:00 AM - 10:00 PM"
            },
            "Religious": {
                "monday": "24/7",
                "tuesday": "24/7",
                "wednesday": "24/7",
                "thursday": "24/7",
                "friday": "24/7",
                "saturday": "24/7",
                "sunday": "24/7"
            },
            "Monument": {
                "monday": "9:00 AM - 6:00 PM",
                "tuesday": "9:00 AM - 6:00 PM",
                "wednesday": "9:00 AM - 6:00 PM",
                "thursday": "9:00 AM - 6:00 PM",
                "friday": "9:00 AM - 6:00 PM",
                "saturday": "9:00 AM - 6:00 PM",
                "sunday": "9:00 AM - 6:00 PM"
            }
        }
        
        return hours.get(category, hours["Monument"])
    
    def _get_attraction_description(self, name: str, category: str) -> str:
        """Generate attraction description based on name and category."""
        descriptions = {
            "Historical": f"{name} is a significant historical landmark that tells the story of the city's past. Experience the rich history and cultural heritage.",
            "Museum": f"{name} houses an impressive collection of art and artifacts. Explore the exhibits and learn about the local culture and history.",
            "Park": f"{name} is a beautiful green space perfect for relaxation and recreation. Enjoy nature, walking trails, and outdoor activities.",
            "Religious": f"{name} is a sacred place of worship and spiritual significance. Experience the peaceful atmosphere and religious heritage.",
            "Monument": f"{name} is an iconic landmark that represents the city's identity. Admire the architecture and learn about its historical importance.",
            "Market": f"{name} is a vibrant marketplace where you can experience local culture, taste authentic food, and find unique souvenirs.",
            "Architecture": f"{name} showcases impressive architectural design and historical significance. Admire the building's unique style and construction.",
            "Entertainment": f"{name} offers entertainment and fun activities for visitors of all ages. Enjoy shows, games, and interactive experiences.",
            "Waterfront": f"{name} provides beautiful waterfront views and recreational activities. Enjoy the scenic beauty and water-based activities.",
            "Neighborhood": f"{name} is a charming neighborhood with unique character and local charm. Explore the streets, shops, and local culture."
        }
        
        return descriptions.get(category, f"{name} is a popular attraction that offers visitors a unique experience and insight into the local culture.")
    
    def _get_attraction_highlights(self, category: str) -> List[str]:
        """Get attraction highlights based on category."""
        highlights = {
            "Historical": ["Guided Tours", "Historical Artifacts", "Educational Programs", "Cultural Events"],
            "Museum": ["Art Collections", "Interactive Exhibits", "Educational Programs", "Gift Shop"],
            "Park": ["Walking Trails", "Picnic Areas", "Playground", "Nature Views"],
            "Religious": ["Sacred Architecture", "Spiritual Atmosphere", "Religious Art", "Peaceful Environment"],
            "Monument": ["Iconic Architecture", "Historical Significance", "Photo Opportunities", "City Views"],
            "Market": ["Local Products", "Authentic Food", "Cultural Experience", "Shopping"],
            "Architecture": ["Unique Design", "Historical Significance", "Photo Opportunities", "Architectural Tours"],
            "Entertainment": ["Shows", "Interactive Activities", "Games", "Fun Experiences"],
            "Waterfront": ["Water Views", "Recreational Activities", "Scenic Beauty", "Water Sports"],
            "Neighborhood": ["Local Culture", "Unique Shops", "Street Art", "Local Food"]
        }
        
        return highlights.get(category, ["Unique Experience", "Local Culture", "Photo Opportunities", "Educational Value"])
    
    def _get_attraction_images(self, category: str) -> List[str]:
        """Get attraction images based on category."""
        image_urls = {
            "Historical": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "Museum": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Park": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "Religious": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Monument": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "Market": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Architecture": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "Entertainment": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Waterfront": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "Neighborhood": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ]
        }
        
        return image_urls.get(category, image_urls["Monument"])