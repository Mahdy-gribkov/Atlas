"""
Free Car Rental API client - No API key required.
Uses realistic car rental data generation based on real car rental information.
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import random

from .rate_limiter import APIRateLimiter

class CarRentalClient:
    """
    Free car rental client using realistic data generation.
    Provides car rental information without requiring API keys.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.rate_limiter = rate_limiter or APIRateLimiter()
        # No API key needed - uses realistic data generation
    
    async def search_car_rentals(self, city: str, pickup_date: str = None, 
                               return_date: str = None, car_type: str = None) -> List[Dict[str, Any]]:
        """
        Search for car rentals using realistic data generation.
        
        Args:
            city: City name
            pickup_date: Pickup date (optional)
            return_date: Return date (optional)
            car_type: Type of car (optional)
            
        Returns:
            List of car rental options
        """
        try:
            # Generate realistic car rental data
            rentals = await self._generate_realistic_car_rentals(city, pickup_date, return_date, car_type)
            
            return rentals
            
        except Exception as e:
            print(f"Car rental search error: {e}")
            return []
    
    async def _generate_realistic_car_rentals(self, city: str, pickup_date: str = None, 
                                            return_date: str = None, car_type: str = None) -> List[Dict[str, Any]]:
        """Generate realistic car rental data based on city."""
        try:
            # Common car rental companies
            rental_companies = [
                {"name": "Hertz", "base_price": 60, "rating": 4.2},
                {"name": "Avis", "base_price": 65, "rating": 4.1},
                {"name": "Enterprise", "base_price": 55, "rating": 4.3},
                {"name": "Budget", "base_price": 50, "rating": 4.0},
                {"name": "National", "base_price": 70, "rating": 4.4},
                {"name": "Alamo", "base_price": 58, "rating": 4.1}
            ]
            
            # Car types with their characteristics
            car_types = {
                "Economy": {"base_price": 0, "description": "Small, fuel-efficient car", "passengers": 4, "bags": 2},
                "Compact": {"base_price": 10, "description": "Slightly larger than economy", "passengers": 4, "bags": 2},
                "Mid-size": {"base_price": 20, "description": "Comfortable for families", "passengers": 5, "bags": 3},
                "Full-size": {"base_price": 30, "description": "Spacious and comfortable", "passengers": 5, "bags": 4},
                "SUV": {"base_price": 40, "description": "Great for families and luggage", "passengers": 7, "bags": 5},
                "Luxury": {"base_price": 80, "description": "Premium vehicle with luxury features", "passengers": 5, "bags": 4}
            }
            
            # If no car type specified, show all types
            if not car_type:
                selected_car_types = list(car_types.keys())
            else:
                selected_car_types = [car_type] if car_type in car_types else list(car_types.keys())
            
            rentals = []
            
            for company in rental_companies:
                for car_type_name in selected_car_types:
                    # Calculate realistic price with some variation
                    base_price = company["base_price"] + car_types[car_type_name]["base_price"]
                    price_variation = 0.8 + (random.random() * 0.4)  # 80% to 120% of base price
                    price = int(base_price * price_variation)
                    
                    # Generate rental ID
                    rental_id = f"rental_{city.lower().replace(' ', '_')}_{company['name'].lower()}_{car_type_name.lower()}"
                    
                    rental = {
                        "id": rental_id,
                        "company": company["name"],
                        "car_type": car_type_name,
                        "description": car_types[car_type_name]["description"],
                        "passengers": car_types[car_type_name]["passengers"],
                        "bags": car_types[car_type_name]["bags"],
                        "price_per_day": f"${price}",
                        "currency": "USD",
                        "location": city,
                        "pickup_date": pickup_date or "Tomorrow",
                        "return_date": return_date or "Day after tomorrow",
                        "rating": company["rating"],
                        "amenities": self._get_car_amenities(car_type_name),
                        "policies": self._get_rental_policies(),
                        "source": "Realistic Car Rental Data (Free)",
                        "booking_url": f"https://www.{company['name'].lower()}.com",
                        "images": self._get_car_images(car_type_name)
                    }
                    
                    rentals.append(rental)
            
            return rentals
            
        except Exception as e:
            print(f"Car rental generation error: {e}")
            return []
    
    def _get_car_amenities(self, car_type: str) -> List[str]:
        """Get car amenities based on car type."""
        amenities = {
            "Economy": ["Air Conditioning", "Automatic Transmission", "Power Steering", "Radio"],
            "Compact": ["Air Conditioning", "Automatic Transmission", "Power Steering", "Radio", "Bluetooth"],
            "Mid-size": ["Air Conditioning", "Automatic Transmission", "Power Steering", "Radio", "Bluetooth", "GPS"],
            "Full-size": ["Air Conditioning", "Automatic Transmission", "Power Steering", "Radio", "Bluetooth", "GPS", "Leather Seats"],
            "SUV": ["Air Conditioning", "Automatic Transmission", "Power Steering", "Radio", "Bluetooth", "GPS", "All-Wheel Drive", "Third Row Seating"],
            "Luxury": ["Air Conditioning", "Automatic Transmission", "Power Steering", "Radio", "Bluetooth", "GPS", "Leather Seats", "Sunroof", "Premium Sound System"]
        }
        
        return amenities.get(car_type, amenities["Economy"])
    
    def _get_rental_policies(self) -> List[str]:
        """Get standard rental policies."""
        return [
            "Minimum age: 21 years",
            "Valid driver's license required",
            "Credit card required for deposit",
            "Unlimited mileage included",
            "24/7 roadside assistance",
            "Free cancellation up to 24 hours before pickup",
            "Additional driver fee: $15/day",
            "GPS rental: $10/day",
            "Child safety seat: $10/day"
        ]
    
    def _get_car_images(self, car_type: str) -> List[str]:
        """Get car images based on car type."""
        image_urls = {
            "Economy": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Compact": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "Mid-size": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Full-size": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ],
            "SUV": [
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
            ],
            "Luxury": [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
            ]
        }
        
        return image_urls.get(car_type, image_urls["Economy"])