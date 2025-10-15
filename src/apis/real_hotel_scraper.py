"""
Real Hotel Data Scraper - NO API KEYS, NO PAYMENTS
Scrapes real hotel data from free public sources.
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import re
from bs4 import BeautifulSoup
import urllib.parse

from .rate_limiter import APIRateLimiter
from ..utils.error_handler import error_handler


class RealHotelScraper:
    """
    Real hotel data scraper using free public sources.
    NO API KEYS, NO PAYMENTS - Only free web scraping.
    """
    
    def __init__(self, rate_limiter: APIRateLimiter = None):
        self.rate_limiter = rate_limiter or APIRateLimiter()
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def search_hotels(self, city: str, check_in: str = None, check_out: str = None, 
                          guests: int = 1, rooms: int = 1, budget: Optional[float] = None) -> List[Dict[str, Any]]:
        """
        Search for real hotels using free web scraping.
        
        Args:
            city: Destination city
            check_in: Check-in date (YYYY-MM-DD)
            check_out: Check-out date (YYYY-MM-DD)
            guests: Number of guests
            rooms: Number of rooms
            budget: Maximum budget per night
            
        Returns:
            List of real hotel options
        """
        circuit_key = f"hotel_search_{city}_{check_in}_{check_out}"
        
        # Check circuit breaker
        if not error_handler.should_allow_request(circuit_key):
            print(f"Circuit breaker OPEN for hotel search: {city}")
            return []
        
        try:
            # Try multiple free sources
            hotels = []
            
            # Source 1: Booking.com (public search results)
            booking_hotels = await self._scrape_booking_hotels(city, check_in, check_out, guests, rooms, budget)
            if booking_hotels:
                hotels.extend(booking_hotels)
            
            # Source 2: Hotels.com (public search results)
            hotels_com_hotels = await self._scrape_hotels_com(city, check_in, check_out, guests, rooms, budget)
            if hotels_com_hotels:
                hotels.extend(hotels_com_hotels)
            
            # Source 3: Expedia (public search results)
            expedia_hotels = await self._scrape_expedia_hotels(city, check_in, check_out, guests, rooms, budget)
            if expedia_hotels:
                hotels.extend(expedia_hotels)
            
            if hotels:
                error_handler.record_success(circuit_key)
                return self._deduplicate_hotels(hotels)
            
            error_handler.record_success(circuit_key)
            return []
            
        except Exception as e:
            error_handler.record_failure(circuit_key)
            print(f"Hotel search error: {e}")
            return []
    
    async def _scrape_booking_hotels(self, city: str, check_in: str, check_out: str, 
                                   guests: int, rooms: int, budget: Optional[float]) -> List[Dict[str, Any]]:
        """Scrape Booking.com public search results."""
        try:
            if not self.session:
                return []
            
            # Build Booking.com search URL
            base_url = "https://www.booking.com/searchresults.html"
            params = {
                'ss': city,
                'checkin': check_in or (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'checkout': check_out or (datetime.now() + timedelta(days=9)).strftime('%Y-%m-%d'),
                'group_adults': guests,
                'no_rooms': rooms
            }
            
            if budget:
                params['maxprice'] = budget
            
            url = f"{base_url}?{urllib.parse.urlencode(params)}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            
            async with self.session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    html = await response.text()
                    return self._parse_booking_hotels_html(html, city)
                    
        except Exception as e:
            print(f"Booking.com hotels scraping error: {e}")
            
        return []
    
    async def _scrape_hotels_com(self, city: str, check_in: str, check_out: str, 
                               guests: int, rooms: int, budget: Optional[float]) -> List[Dict[str, Any]]:
        """Scrape Hotels.com public search results."""
        try:
            if not self.session:
                return []
            
            # Build Hotels.com search URL
            base_url = "https://www.hotels.com/search.do"
            params = {
                'q-destination': city,
                'q-check-in': check_in or (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'q-check-out': check_out or (datetime.now() + timedelta(days=9)).strftime('%Y-%m-%d'),
                'q-rooms': rooms,
                'q-room-0-adults': guests
            }
            
            if budget:
                params['q-max-price'] = budget
            
            url = f"{base_url}?{urllib.parse.urlencode(params)}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            
            async with self.session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    html = await response.text()
                    return self._parse_hotels_com_html(html, city)
                    
        except Exception as e:
            print(f"Hotels.com scraping error: {e}")
            
        return []
    
    async def _scrape_expedia_hotels(self, city: str, check_in: str, check_out: str, 
                                   guests: int, rooms: int, budget: Optional[float]) -> List[Dict[str, Any]]:
        """Scrape Expedia public search results."""
        try:
            if not self.session:
                return []
            
            # Build Expedia search URL
            base_url = "https://www.expedia.com/Hotel-Search"
            params = {
                'destination': city,
                'startDate': check_in or (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'endDate': check_out or (datetime.now() + timedelta(days=9)).strftime('%Y-%m-%d'),
                'rooms': rooms,
                'adults': guests
            }
            
            if budget:
                params['maxPrice'] = budget
            
            url = f"{base_url}?{urllib.parse.urlencode(params)}"
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            
            async with self.session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    html = await response.text()
                    return self._parse_expedia_hotels_html(html, city)
                    
        except Exception as e:
            print(f"Expedia hotels scraping error: {e}")
            
        return []
    
    def _parse_booking_hotels_html(self, html: str, city: str) -> List[Dict[str, Any]]:
        """Parse Booking.com HTML for hotel data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            hotels = []
            
            # Look for hotel result containers
            hotel_containers = soup.find_all(['div', 'section'], class_=re.compile(r'hotel|property|result'))
            
            for container in hotel_containers[:10]:  # Limit to 10 results
                try:
                    # Extract hotel information
                    name_elem = container.find(['h3', 'h4', 'span'], class_=re.compile(r'name|title|hotel'))
                    price_elem = container.find(['span', 'div'], class_=re.compile(r'price|cost|amount'))
                    rating_elem = container.find(['span', 'div'], class_=re.compile(r'rating|score|review'))
                    location_elem = container.find(['span', 'div'], class_=re.compile(r'location|address|area'))
                    
                    if name_elem and price_elem:
                        name = name_elem.get_text(strip=True)
                        price_text = price_elem.get_text(strip=True)
                        rating_text = rating_elem.get_text(strip=True) if rating_elem else "N/A"
                        location_text = location_elem.get_text(strip=True) if location_elem else city
                        
                        # Extract price number
                        price_match = re.search(r'[\d,]+', price_text.replace('$', '').replace(',', ''))
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        # Extract rating
                        rating_match = re.search(r'[\d.]+', rating_text)
                        rating = float(rating_match.group()) if rating_match else 0
                        
                        hotel = {
                            'name': name,
                            'price_per_night': price,
                            'currency': 'USD',
                            'rating': rating,
                            'location': location_text,
                            'city': city,
                            'source': 'Booking.com (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'booking_url': f"https://www.booking.com/searchresults.html?ss={urllib.parse.quote(city)}"
                        }
                        
                        hotels.append(hotel)
                        
                except Exception as e:
                    continue
                    
            return hotels
            
        except Exception as e:
            print(f"Booking.com hotels parsing error: {e}")
            return []
    
    def _parse_hotels_com_html(self, html: str, city: str) -> List[Dict[str, Any]]:
        """Parse Hotels.com HTML for hotel data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            hotels = []
            
            # Look for hotel result containers
            hotel_containers = soup.find_all(['div', 'section'], class_=re.compile(r'hotel|property|result'))
            
            for container in hotel_containers[:10]:  # Limit to 10 results
                try:
                    # Extract hotel information
                    name_elem = container.find(['h3', 'h4', 'span'], class_=re.compile(r'name|title|hotel'))
                    price_elem = container.find(['span', 'div'], class_=re.compile(r'price|cost|amount'))
                    rating_elem = container.find(['span', 'div'], class_=re.compile(r'rating|score|review'))
                    location_elem = container.find(['span', 'div'], class_=re.compile(r'location|address|area'))
                    
                    if name_elem and price_elem:
                        name = name_elem.get_text(strip=True)
                        price_text = price_elem.get_text(strip=True)
                        rating_text = rating_elem.get_text(strip=True) if rating_elem else "N/A"
                        location_text = location_elem.get_text(strip=True) if location_elem else city
                        
                        # Extract price number
                        price_match = re.search(r'[\d,]+', price_text.replace('$', '').replace(',', ''))
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        # Extract rating
                        rating_match = re.search(r'[\d.]+', rating_text)
                        rating = float(rating_match.group()) if rating_match else 0
                        
                        hotel = {
                            'name': name,
                            'price_per_night': price,
                            'currency': 'USD',
                            'rating': rating,
                            'location': location_text,
                            'city': city,
                            'source': 'Hotels.com (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'booking_url': f"https://www.hotels.com/search.do?q-destination={urllib.parse.quote(city)}"
                        }
                        
                        hotels.append(hotel)
                        
                except Exception as e:
                    continue
                    
            return hotels
            
        except Exception as e:
            print(f"Hotels.com parsing error: {e}")
            return []
    
    def _parse_expedia_hotels_html(self, html: str, city: str) -> List[Dict[str, Any]]:
        """Parse Expedia HTML for hotel data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            hotels = []
            
            # Look for hotel result containers
            hotel_containers = soup.find_all(['div', 'section'], class_=re.compile(r'hotel|property|result'))
            
            for container in hotel_containers[:10]:  # Limit to 10 results
                try:
                    # Extract hotel information
                    name_elem = container.find(['h3', 'h4', 'span'], class_=re.compile(r'name|title|hotel'))
                    price_elem = container.find(['span', 'div'], class_=re.compile(r'price|cost|amount'))
                    rating_elem = container.find(['span', 'div'], class_=re.compile(r'rating|score|review'))
                    location_elem = container.find(['span', 'div'], class_=re.compile(r'location|address|area'))
                    
                    if name_elem and price_elem:
                        name = name_elem.get_text(strip=True)
                        price_text = price_elem.get_text(strip=True)
                        rating_text = rating_elem.get_text(strip=True) if rating_elem else "N/A"
                        location_text = location_elem.get_text(strip=True) if location_elem else city
                        
                        # Extract price number
                        price_match = re.search(r'[\d,]+', price_text.replace('$', '').replace(',', ''))
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        # Extract rating
                        rating_match = re.search(r'[\d.]+', rating_text)
                        rating = float(rating_match.group()) if rating_match else 0
                        
                        hotel = {
                            'name': name,
                            'price_per_night': price,
                            'currency': 'USD',
                            'rating': rating,
                            'location': location_text,
                            'city': city,
                            'source': 'Expedia (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'booking_url': f"https://www.expedia.com/Hotel-Search?destination={urllib.parse.quote(city)}"
                        }
                        
                        hotels.append(hotel)
                        
                except Exception as e:
                    continue
                    
            return hotels
            
        except Exception as e:
            print(f"Expedia hotels parsing error: {e}")
            return []
    
    def _deduplicate_hotels(self, hotels: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate hotels based on name and price."""
        try:
            seen = set()
            unique_hotels = []
            
            for hotel in hotels:
                # Create a key based on name and price
                key = (hotel.get('name', '').lower(), hotel.get('price_per_night', 0))
                
                if key not in seen:
                    seen.add(key)
                    unique_hotels.append(hotel)
            
            # Sort by price (cheapest first)
            unique_hotels.sort(key=lambda x: x.get('price_per_night', float('inf')))
            
            return unique_hotels[:15]  # Return top 15 results
            
        except Exception as e:
            print(f"Hotel deduplication error: {e}")
            return hotels
