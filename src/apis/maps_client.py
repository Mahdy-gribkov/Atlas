"""
Nominatim (OpenStreetMap) API client for geocoding.
Free tier: 1000 calls/day
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime
import json

from .rate_limiter import APIRateLimiter

class NominatimClient:
    """Nominatim API client for geocoding."""
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.base_url = "https://nominatim.openstreetmap.org"
        self.rate_limiter = rate_limiter or APIRateLimiter()
    
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """Make API request with proper error handling."""
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        raise Exception(f"Nominatim API request failed: {response.status}")
        except Exception as e:
            print(f"Nominatim API error: {e}")
            raise
    
    async def geocode(self, location: str) -> Dict[str, Any]:
        """
        Geocode a location to get coordinates.
        
        Args:
            location: Location name or address
            
        Returns:
            Geocoding results
        """
        try:
            params = {
                'q': location,
                'format': 'json',
                'limit': 1,
                'addressdetails': 1,
                'extratags': 1
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/search", params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        if data and len(data) > 0:
                            result = data[0]
                            return {
                                'location': location,
                                'latitude': float(result.get('lat', 0)),
                                'longitude': float(result.get('lon', 0)),
                                'display_name': result.get('display_name', location),
                                'address': result.get('address', {}),
                                'place_id': result.get('place_id'),
                                'osm_id': result.get('osm_id'),
                                'source': 'Nominatim (OpenStreetMap)',
                                'timestamp': datetime.now().isoformat()
                            }
                        else:
                            return {'error': 'Location not found'}
                    else:
                        return {'error': f'Geocoding failed: {response.status}'}
                        
        except Exception as e:
            print(f"Geocoding error: {e}")
            return {'error': str(e)}
    
    async def reverse_geocode(self, lat: float, lon: float) -> Dict[str, Any]:
        """
        Reverse geocode coordinates to get address.
        
        Args:
            lat: Latitude
            lon: Longitude
            
        Returns:
            Reverse geocoding results
        """
        try:
            params = {
                'lat': lat,
                'lon': lon,
                'format': 'json',
                'addressdetails': 1,
                'extratags': 1
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/reverse", params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'latitude': lat,
                            'longitude': lon,
                            'display_name': data.get('display_name', ''),
                            'address': data.get('address', {}),
                            'place_id': data.get('place_id'),
                            'osm_id': data.get('osm_id'),
                            'source': 'Nominatim (OpenStreetMap)',
                            'timestamp': datetime.now().isoformat()
                        }
                    else:
                        return {'error': f'Reverse geocoding failed: {response.status}'}
                        
        except Exception as e:
            print(f"Reverse geocoding error: {e}")
            return {'error': str(e)}