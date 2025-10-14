"""
Free Maps API client - No API key required.
Uses OpenStreetMap Nominatim for geocoding and reverse geocoding.
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import urllib.parse

from .rate_limiter import APIRateLimiter

class NominatimClient:
    """
    Free maps client using OpenStreetMap Nominatim.
    Provides geocoding and reverse geocoding without requiring API keys.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.rate_limiter = rate_limiter or APIRateLimiter()
        # No API key needed - uses OpenStreetMap Nominatim (completely free)
        self.base_url = "https://nominatim.openstreetmap.org"
    
    async def geocode(self, address: str) -> List[Dict[str, Any]]:
        """
        Geocode an address to get coordinates using Nominatim (completely free, no API key).
        
        Args:
            address: Address to geocode
            
        Returns:
            List of geocoding results
        """
        try:
            # Use Nominatim geocoding (completely free, no API key)
            results = await self._geocode_nominatim(address)
            if results:
                return results
            
            return []
            
        except Exception as e:
            print(f"Geocoding error: {e}")
            return []
    
    async def reverse_geocode(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        """
        Reverse geocode coordinates to get address using Nominatim (completely free, no API key).
        
        Args:
            latitude: Latitude coordinate
            longitude: Longitude coordinate
            
        Returns:
            Reverse geocoding result
        """
        try:
            # Use Nominatim reverse geocoding (completely free, no API key)
            result = await self._reverse_geocode_nominatim(latitude, longitude)
            if result:
                return result
            
            return None
            
        except Exception as e:
            print(f"Reverse geocoding error: {e}")
            return None
    
    async def search_places(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Search for places using Nominatim (completely free, no API key).
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of place results
        """
        try:
            # Use Nominatim search (completely free, no API key)
            results = await self._search_nominatim(query, limit)
            if results:
                return results
            
            return []
            
        except Exception as e:
            print(f"Place search error: {e}")
            return []
    
    async def _geocode_nominatim(self, address: str) -> List[Dict[str, Any]]:
        """Geocode using Nominatim (completely free, no API key)."""
        try:
            url = f"{self.base_url}/search"
            params = {
                'q': address,
                'format': 'json',
                'limit': 10,
                'addressdetails': 1,
                'extratags': 1
            }
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        results = []
                        for item in data:
                            result = {
                                'address': item.get('display_name', ''),
                                'latitude': float(item.get('lat', 0)),
                                'longitude': float(item.get('lon', 0)),
                                'place_id': item.get('place_id', ''),
                                'type': item.get('type', ''),
                                'importance': item.get('importance', 0),
                                'source': 'OpenStreetMap Nominatim (Real Data, Free)',
                                'timestamp': datetime.now().isoformat()
                            }
                            
                            # Add address components if available
                            if 'address' in item:
                                address_components = item['address']
                                result['address_components'] = {
                                    'country': address_components.get('country', ''),
                                    'state': address_components.get('state', ''),
                                    'city': address_components.get('city', ''),
                                    'postcode': address_components.get('postcode', ''),
                                    'street': address_components.get('street', ''),
                                    'house_number': address_components.get('house_number', '')
                                }
                            
                            results.append(result)
                        
                        return results
                        
        except Exception as e:
            print(f"Nominatim geocoding error: {e}")
            return []
    
    async def _reverse_geocode_nominatim(self, latitude: float, longitude: float) -> Optional[Dict[str, Any]]:
        """Reverse geocode using Nominatim (completely free, no API key)."""
        try:
            url = f"{self.base_url}/reverse"
            params = {
                'lat': latitude,
                'lon': longitude,
                'format': 'json',
                'addressdetails': 1,
                'extratags': 1
            }
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        result = {
                            'address': data.get('display_name', ''),
                            'latitude': latitude,
                            'longitude': longitude,
                            'place_id': data.get('place_id', ''),
                            'type': data.get('type', ''),
                            'source': 'OpenStreetMap Nominatim (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
                        # Add address components if available
                        if 'address' in data:
                            address_components = data['address']
                            result['address_components'] = {
                                'country': address_components.get('country', ''),
                                'state': address_components.get('state', ''),
                                'city': address_components.get('city', ''),
                                'postcode': address_components.get('postcode', ''),
                                'street': address_components.get('street', ''),
                                'house_number': address_components.get('house_number', '')
                            }
                        
                        return result
                        
        except Exception as e:
            print(f"Nominatim reverse geocoding error: {e}")
            return None
    
    async def _search_nominatim(self, query: str, limit: int) -> List[Dict[str, Any]]:
        """Search places using Nominatim (completely free, no API key)."""
        try:
            url = f"{self.base_url}/search"
            params = {
                'q': query,
                'format': 'json',
                'limit': limit,
                'addressdetails': 1,
                'extratags': 1
            }
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        results = []
                        for item in data:
                            result = {
                                'name': item.get('display_name', ''),
                                'latitude': float(item.get('lat', 0)),
                                'longitude': float(item.get('lon', 0)),
                                'place_id': item.get('place_id', ''),
                                'type': item.get('type', ''),
                                'importance': item.get('importance', 0),
                                'source': 'OpenStreetMap Nominatim (Real Data, Free)',
                                'timestamp': datetime.now().isoformat()
                            }
                            
                            # Add address components if available
                            if 'address' in item:
                                address_components = item['address']
                                result['address_components'] = {
                                    'country': address_components.get('country', ''),
                                    'state': address_components.get('state', ''),
                                    'city': address_components.get('city', ''),
                                    'postcode': address_components.get('postcode', ''),
                                    'street': address_components.get('street', ''),
                                    'house_number': address_components.get('house_number', '')
                                }
                            
                            results.append(result)
                        
                        return results
                        
        except Exception as e:
            print(f"Nominatim search error: {e}")
            return []
    
    async def get_place_details(self, place_id: str) -> Optional[Dict[str, Any]]:
        """
        Get detailed information about a place using Nominatim (completely free, no API key).
        
        Args:
            place_id: OpenStreetMap place ID
            
        Returns:
            Place details
        """
        try:
            url = f"{self.base_url}/details"
            params = {
                'place_id': place_id,
                'format': 'json',
                'addressdetails': 1,
                'extratags': 1
            }
            
            # Headers to be respectful to the service
            headers = {
                'User-Agent': 'Travel-AI-Agent/1.0 (contact@example.com)'
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, headers=headers, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        result = {
                            'place_id': place_id,
                            'name': data.get('display_name', ''),
                            'latitude': float(data.get('lat', 0)),
                            'longitude': float(data.get('lon', 0)),
                            'type': data.get('type', ''),
                            'importance': data.get('importance', 0),
                            'source': 'OpenStreetMap Nominatim (Real Data, Free)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
                        # Add address components if available
                        if 'address' in data:
                            address_components = data['address']
                            result['address_components'] = {
                                'country': address_components.get('country', ''),
                                'state': address_components.get('state', ''),
                                'city': address_components.get('city', ''),
                                'postcode': address_components.get('postcode', ''),
                                'street': address_components.get('street', ''),
                                'house_number': address_components.get('house_number', '')
                            }
                        
                        return result
                        
        except Exception as e:
            print(f"Nominatim place details error: {e}")
            return None