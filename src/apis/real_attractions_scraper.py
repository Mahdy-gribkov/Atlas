"""
Real Attractions Data Scraper - NO API KEYS, NO PAYMENTS
Scrapes real attractions and activities data from free public sources.
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


class RealAttractionsScraper:
    """
    Real attractions data scraper using free public sources.
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
    
    async def search_attractions(self, city: str, category: str = "all", limit: int = 20) -> List[Dict[str, Any]]:
        """
        Search for real attractions using free web scraping.
        
        Args:
            city: Destination city
            category: Attraction category (all, museums, parks, landmarks, etc.)
            limit: Maximum number of results
            
        Returns:
            List of real attractions
        """
        circuit_key = f"attractions_search_{city}_{category}"
        
        # Check circuit breaker
        if not error_handler.should_allow_request(circuit_key):
            print(f"Circuit breaker OPEN for attractions search: {city}")
            return []
        
        try:
            # Try multiple free sources
            attractions = []
            
            # Source 1: TripAdvisor (public search results)
            tripadvisor_attractions = await self._scrape_tripadvisor_attractions(city, category, limit)
            if tripadvisor_attractions:
                attractions.extend(tripadvisor_attractions)
            
            # Source 2: Lonely Planet (public content)
            lonely_planet_attractions = await self._scrape_lonely_planet_attractions(city, category, limit)
            if lonely_planet_attractions:
                attractions.extend(lonely_planet_attractions)
            
            # Source 3: Time Out (public content)
            timeout_attractions = await self._scrape_timeout_attractions(city, category, limit)
            if timeout_attractions:
                attractions.extend(timeout_attractions)
            
            if attractions:
                error_handler.record_success(circuit_key)
                return self._deduplicate_attractions(attractions)
            
            error_handler.record_success(circuit_key)
            return []
            
        except Exception as e:
            error_handler.record_failure(circuit_key)
            print(f"Attractions search error: {e}")
            return []
    
    async def _scrape_tripadvisor_attractions(self, city: str, category: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape TripAdvisor public search results."""
        try:
            if not self.session:
                return []
            
            # Build TripAdvisor search URL
            base_url = "https://www.tripadvisor.com/Attractions"
            params = {
                'g': city.lower().replace(' ', '_'),
                'c': 'attractions'
            }
            
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
                    return self._parse_tripadvisor_attractions_html(html, city)
                    
        except Exception as e:
            print(f"TripAdvisor attractions scraping error: {e}")
            
        return []
    
    async def _scrape_lonely_planet_attractions(self, city: str, category: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape Lonely Planet public content."""
        try:
            if not self.session:
                return []
            
            # Build Lonely Planet search URL
            base_url = "https://www.lonelyplanet.com"
            city_slug = city.lower().replace(' ', '-')
            url = f"{base_url}/{city_slug}/attractions"
            
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
                    return self._parse_lonely_planet_attractions_html(html, city)
                    
        except Exception as e:
            print(f"Lonely Planet attractions scraping error: {e}")
            
        return []
    
    async def _scrape_timeout_attractions(self, city: str, category: str, limit: int) -> List[Dict[str, Any]]:
        """Scrape Time Out public content."""
        try:
            if not self.session:
                return []
            
            # Build Time Out search URL
            base_url = "https://www.timeout.com"
            city_slug = city.lower().replace(' ', '-')
            url = f"{base_url}/{city_slug}/attractions"
            
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
                    return self._parse_timeout_attractions_html(html, city)
                    
        except Exception as e:
            print(f"Time Out attractions scraping error: {e}")
            
        return []
    
    def _parse_tripadvisor_attractions_html(self, html: str, city: str) -> List[Dict[str, Any]]:
        """Parse TripAdvisor HTML for attractions data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            attractions = []
            
            # Look for attraction result containers
            attraction_containers = soup.find_all(['div', 'section'], class_=re.compile(r'attraction|listing|result'))
            
            for container in attraction_containers[:15]:  # Limit to 15 results
                try:
                    # Extract attraction information
                    name_elem = container.find(['h3', 'h4', 'span'], class_=re.compile(r'name|title|attraction'))
                    rating_elem = container.find(['span', 'div'], class_=re.compile(r'rating|score|review'))
                    description_elem = container.find(['p', 'span', 'div'], class_=re.compile(r'description|summary|text'))
                    category_elem = container.find(['span', 'div'], class_=re.compile(r'category|type|tag'))
                    
                    if name_elem:
                        name = name_elem.get_text(strip=True)
                        rating_text = rating_elem.get_text(strip=True) if rating_elem else "N/A"
                        description_text = description_elem.get_text(strip=True) if description_elem else "No description available"
                        category_text = category_elem.get_text(strip=True) if category_elem else "Attraction"
                        
                        # Extract rating
                        rating_match = re.search(r'[\d.]+', rating_text)
                        rating = float(rating_match.group()) if rating_match else 0
                        
                        attraction = {
                            'name': name,
                            'rating': rating,
                            'description': description_text,
                            'category': category_text,
                            'city': city,
                            'source': 'TripAdvisor (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'url': f"https://www.tripadvisor.com/Attractions?g={city.lower().replace(' ', '_')}"
                        }
                        
                        attractions.append(attraction)
                        
                except Exception as e:
                    continue
                    
            return attractions
            
        except Exception as e:
            print(f"TripAdvisor attractions parsing error: {e}")
            return []
    
    def _parse_lonely_planet_attractions_html(self, html: str, city: str) -> List[Dict[str, Any]]:
        """Parse Lonely Planet HTML for attractions data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            attractions = []
            
            # Look for attraction result containers
            attraction_containers = soup.find_all(['div', 'section', 'article'], class_=re.compile(r'attraction|listing|result|card'))
            
            for container in attraction_containers[:15]:  # Limit to 15 results
                try:
                    # Extract attraction information
                    name_elem = container.find(['h3', 'h4', 'span'], class_=re.compile(r'name|title|attraction'))
                    description_elem = container.find(['p', 'span', 'div'], class_=re.compile(r'description|summary|text'))
                    category_elem = container.find(['span', 'div'], class_=re.compile(r'category|type|tag'))
                    
                    if name_elem:
                        name = name_elem.get_text(strip=True)
                        description_text = description_elem.get_text(strip=True) if description_elem else "No description available"
                        category_text = category_elem.get_text(strip=True) if category_elem else "Attraction"
                        
                        attraction = {
                            'name': name,
                            'rating': 0,  # Lonely Planet doesn't always have ratings
                            'description': description_text,
                            'category': category_text,
                            'city': city,
                            'source': 'Lonely Planet (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'url': f"https://www.lonelyplanet.com/{city.lower().replace(' ', '-')}/attractions"
                        }
                        
                        attractions.append(attraction)
                        
                except Exception as e:
                    continue
                    
            return attractions
            
        except Exception as e:
            print(f"Lonely Planet attractions parsing error: {e}")
            return []
    
    def _parse_timeout_attractions_html(self, html: str, city: str) -> List[Dict[str, Any]]:
        """Parse Time Out HTML for attractions data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            attractions = []
            
            # Look for attraction result containers
            attraction_containers = soup.find_all(['div', 'section', 'article'], class_=re.compile(r'attraction|listing|result|card'))
            
            for container in attraction_containers[:15]:  # Limit to 15 results
                try:
                    # Extract attraction information
                    name_elem = container.find(['h3', 'h4', 'span'], class_=re.compile(r'name|title|attraction'))
                    description_elem = container.find(['p', 'span', 'div'], class_=re.compile(r'description|summary|text'))
                    category_elem = container.find(['span', 'div'], class_=re.compile(r'category|type|tag'))
                    
                    if name_elem:
                        name = name_elem.get_text(strip=True)
                        description_text = description_elem.get_text(strip=True) if description_elem else "No description available"
                        category_text = category_elem.get_text(strip=True) if category_elem else "Attraction"
                        
                        attraction = {
                            'name': name,
                            'rating': 0,  # Time Out doesn't always have ratings
                            'description': description_text,
                            'category': category_text,
                            'city': city,
                            'source': 'Time Out (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'url': f"https://www.timeout.com/{city.lower().replace(' ', '-')}/attractions"
                        }
                        
                        attractions.append(attraction)
                        
                except Exception as e:
                    continue
                    
            return attractions
            
        except Exception as e:
            print(f"Time Out attractions parsing error: {e}")
            return []
    
    def _deduplicate_attractions(self, attractions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate attractions based on name."""
        try:
            seen = set()
            unique_attractions = []
            
            for attraction in attractions:
                # Create a key based on name
                key = attraction.get('name', '').lower()
                
                if key not in seen:
                    seen.add(key)
                    unique_attractions.append(attraction)
            
            return unique_attractions[:20]  # Return top 20 results
            
        except Exception as e:
            print(f"Attractions deduplication error: {e}")
            return attractions
