"""
Real Flight Data Scraper - NO API KEYS, NO PAYMENTS
Scrapes real flight data from free public sources.
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


class RealFlightScraper:
    """
    Real flight data scraper using free public sources.
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
    
    async def search_flights(self, origin: str, destination: str, date: str = None, 
                           return_date: str = None, passengers: int = 1) -> List[Dict[str, Any]]:
        """
        Search for real flights using free web scraping.
        
        Args:
            origin: Departure city/airport code
            destination: Arrival city/airport code  
            date: Departure date (YYYY-MM-DD)
            return_date: Return date (YYYY-MM-DD) for round trip
            passengers: Number of passengers
            
        Returns:
            List of real flight options
        """
        circuit_key = f"flight_search_{origin}_{destination}_{date}"
        
        # Check circuit breaker
        if not error_handler.should_allow_request(circuit_key):
            print(f"Circuit breaker OPEN for flight search: {origin} -> {destination}")
            return []
        
        try:
            # Try multiple free sources
            flights = []
            
            # Source 1: Google Flights (public search results)
            google_flights = await self._scrape_google_flights(origin, destination, date, return_date, passengers)
            if google_flights:
                flights.extend(google_flights)
            
            # Source 2: Kayak (public search results)
            kayak_flights = await self._scrape_kayak_flights(origin, destination, date, return_date, passengers)
            if kayak_flights:
                flights.extend(kayak_flights)
            
            # Source 3: Skyscanner (public search results)
            skyscanner_flights = await self._scrape_skyscanner_flights(origin, destination, date, return_date, passengers)
            if skyscanner_flights:
                flights.extend(skyscanner_flights)
            
            if flights:
                error_handler.record_success(circuit_key)
                return self._deduplicate_flights(flights)
            
            error_handler.record_success(circuit_key)
            return []
            
        except Exception as e:
            error_handler.record_failure(circuit_key)
            print(f"Flight search error: {e}")
            return []
    
    async def _scrape_google_flights(self, origin: str, destination: str, date: str, 
                                   return_date: str, passengers: int) -> List[Dict[str, Any]]:
        """Scrape Google Flights public search results."""
        try:
            if not self.session:
                return []
            
            # Build Google Flights search URL
            base_url = "https://www.google.com/travel/flights"
            params = {
                'q': f'Flights from {origin} to {destination}',
                'date': date or (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'passengers': passengers
            }
            
            if return_date:
                params['returnDate'] = return_date
            
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
                    return self._parse_google_flights_html(html, origin, destination)
                    
        except Exception as e:
            print(f"Google Flights scraping error: {e}")
            
        return []
    
    async def _scrape_kayak_flights(self, origin: str, destination: str, date: str, 
                                  return_date: str, passengers: int) -> List[Dict[str, Any]]:
        """Scrape Kayak public search results."""
        try:
            if not self.session:
                return []
            
            # Build Kayak search URL
            base_url = "https://www.kayak.com/flights"
            params = {
                'origin': origin,
                'destination': destination,
                'depart': date or (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'passengers': passengers
            }
            
            if return_date:
                params['return'] = return_date
            
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
                    return self._parse_kayak_flights_html(html, origin, destination)
                    
        except Exception as e:
            print(f"Kayak flights scraping error: {e}")
            
        return []
    
    async def _scrape_skyscanner_flights(self, origin: str, destination: str, date: str, 
                                       return_date: str, passengers: int) -> List[Dict[str, Any]]:
        """Scrape Skyscanner public search results."""
        try:
            if not self.session:
                return []
            
            # Build Skyscanner search URL
            base_url = "https://www.skyscanner.com/transport/flights"
            params = {
                'from': origin,
                'to': destination,
                'depart': date or (datetime.now() + timedelta(days=7)).strftime('%Y-%m-%d'),
                'passengers': passengers
            }
            
            if return_date:
                params['return'] = return_date
            
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
                    return self._parse_skyscanner_flights_html(html, origin, destination)
                    
        except Exception as e:
            print(f"Skyscanner flights scraping error: {e}")
            
        return []
    
    def _parse_google_flights_html(self, html: str, origin: str, destination: str) -> List[Dict[str, Any]]:
        """Parse Google Flights HTML for flight data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            flights = []
            
            # Look for flight result containers
            flight_containers = soup.find_all(['div', 'section'], class_=re.compile(r'flight|result|option'))
            
            for container in flight_containers[:10]:  # Limit to 10 results
                try:
                    # Extract flight information
                    airline_elem = container.find(['span', 'div'], class_=re.compile(r'airline|carrier'))
                    price_elem = container.find(['span', 'div'], class_=re.compile(r'price|cost|amount'))
                    time_elem = container.find(['span', 'div'], class_=re.compile(r'time|duration'))
                    
                    if airline_elem and price_elem:
                        airline = airline_elem.get_text(strip=True)
                        price_text = price_elem.get_text(strip=True)
                        time_text = time_elem.get_text(strip=True) if time_elem else "N/A"
                        
                        # Extract price number
                        price_match = re.search(r'[\d,]+', price_text.replace('$', '').replace(',', ''))
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        flight = {
                            'airline': airline,
                            'price': price,
                            'currency': 'USD',
                            'duration': time_text,
                            'origin': origin,
                            'destination': destination,
                            'source': 'Google Flights (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'booking_url': f"https://www.google.com/travel/flights?q=Flights%20from%20{origin}%20to%20{destination}"
                        }
                        
                        flights.append(flight)
                        
                except Exception as e:
                    continue
                    
            return flights
            
        except Exception as e:
            print(f"Google Flights parsing error: {e}")
            return []
    
    def _parse_kayak_flights_html(self, html: str, origin: str, destination: str) -> List[Dict[str, Any]]:
        """Parse Kayak HTML for flight data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            flights = []
            
            # Look for flight result containers
            flight_containers = soup.find_all(['div', 'section'], class_=re.compile(r'flight|result|option'))
            
            for container in flight_containers[:10]:  # Limit to 10 results
                try:
                    # Extract flight information
                    airline_elem = container.find(['span', 'div'], class_=re.compile(r'airline|carrier'))
                    price_elem = container.find(['span', 'div'], class_=re.compile(r'price|cost|amount'))
                    time_elem = container.find(['span', 'div'], class_=re.compile(r'time|duration'))
                    
                    if airline_elem and price_elem:
                        airline = airline_elem.get_text(strip=True)
                        price_text = price_elem.get_text(strip=True)
                        time_text = time_elem.get_text(strip=True) if time_elem else "N/A"
                        
                        # Extract price number
                        price_match = re.search(r'[\d,]+', price_text.replace('$', '').replace(',', ''))
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        flight = {
                            'airline': airline,
                            'price': price,
                            'currency': 'USD',
                            'duration': time_text,
                            'origin': origin,
                            'destination': destination,
                            'source': 'Kayak (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'booking_url': f"https://www.kayak.com/flights/{origin}-{destination}"
                        }
                        
                        flights.append(flight)
                        
                except Exception as e:
                    continue
                    
            return flights
            
        except Exception as e:
            print(f"Kayak flights parsing error: {e}")
            return []
    
    def _parse_skyscanner_flights_html(self, html: str, origin: str, destination: str) -> List[Dict[str, Any]]:
        """Parse Skyscanner HTML for flight data."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            flights = []
            
            # Look for flight result containers
            flight_containers = soup.find_all(['div', 'section'], class_=re.compile(r'flight|result|option'))
            
            for container in flight_containers[:10]:  # Limit to 10 results
                try:
                    # Extract flight information
                    airline_elem = container.find(['span', 'div'], class_=re.compile(r'airline|carrier'))
                    price_elem = container.find(['span', 'div'], class_=re.compile(r'price|cost|amount'))
                    time_elem = container.find(['span', 'div'], class_=re.compile(r'time|duration'))
                    
                    if airline_elem and price_elem:
                        airline = airline_elem.get_text(strip=True)
                        price_text = price_elem.get_text(strip=True)
                        time_text = time_elem.get_text(strip=True) if time_elem else "N/A"
                        
                        # Extract price number
                        price_match = re.search(r'[\d,]+', price_text.replace('$', '').replace(',', ''))
                        price = float(price_match.group().replace(',', '')) if price_match else 0
                        
                        flight = {
                            'airline': airline,
                            'price': price,
                            'currency': 'USD',
                            'duration': time_text,
                            'origin': origin,
                            'destination': destination,
                            'source': 'Skyscanner (Scraped)',
                            'timestamp': datetime.now().isoformat(),
                            'booking_url': f"https://www.skyscanner.com/transport/flights/{origin}/{destination}"
                        }
                        
                        flights.append(flight)
                        
                except Exception as e:
                    continue
                    
            return flights
            
        except Exception as e:
            print(f"Skyscanner flights parsing error: {e}")
            return []
    
    def _deduplicate_flights(self, flights: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Remove duplicate flights based on airline and price."""
        try:
            seen = set()
            unique_flights = []
            
            for flight in flights:
                # Create a key based on airline and price
                key = (flight.get('airline', ''), flight.get('price', 0))
                
                if key not in seen:
                    seen.add(key)
                    unique_flights.append(flight)
            
            # Sort by price (cheapest first)
            unique_flights.sort(key=lambda x: x.get('price', float('inf')))
            
            return unique_flights[:15]  # Return top 15 results
            
        except Exception as e:
            print(f"Flight deduplication error: {e}")
            return flights
