# VPN Integration Guide

## 🌐 Overview

This guide explains how to integrate VPN and proxy services into the Travel AI Agent to enable location-based price optimization and access to region-specific deals.

## 🎯 Why VPN Integration?

### Benefits
1. **Price Optimization**: Different countries often have different pricing for the same flights/hotels
2. **Access to Regional Deals**: Some promotions are only available in specific regions
3. **Currency Arbitrage**: Take advantage of exchange rate differences
4. **Inventory Access**: Access to inventory that may be location-restricted
5. **Competitive Advantage**: Find deals that competitors can't access

### Real-World Examples
- **Flight Prices**: A flight from NYC to London might be $200 cheaper when searched from the UK
- **Hotel Rates**: Hotels often offer better rates to local customers
- **Package Deals**: Travel packages may have different pricing in different markets
- **Loyalty Programs**: Some benefits are region-specific

## 🛠️ Implementation Architecture

### 1. Proxy Manager
```python
import asyncio
import aiohttp
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class ProxyLocation(Enum):
    US = "us"
    UK = "uk"
    DE = "de"
    JP = "jp"
    AU = "au"
    CA = "ca"
    FR = "fr"
    IT = "it"
    ES = "es"
    NL = "nl"

@dataclass
class ProxyConfig:
    host: str
    port: int
    username: Optional[str] = None
    password: Optional[str] = None
    location: ProxyLocation = ProxyLocation.US
    is_working: bool = True
    response_time: float = 0.0
    success_rate: float = 100.0

class ProxyManager:
    """
    Manages a pool of proxies from different geographic locations
    for optimal travel search results.
    """
    
    def __init__(self):
        self.proxy_pool: Dict[ProxyLocation, List[ProxyConfig]] = {}
        self.current_proxy: Optional[ProxyConfig] = None
        self.performance_metrics: Dict[str, Dict] = {}
        self._initialize_proxy_pool()
    
    def _initialize_proxy_pool(self):
        """Initialize proxy pool with different geographic locations."""
        # In production, these would come from your proxy provider
        self.proxy_pool = {
            ProxyLocation.US: [
                ProxyConfig("proxy-us-1.example.com", 8080, location=ProxyLocation.US),
                ProxyConfig("proxy-us-2.example.com", 8080, location=ProxyLocation.US),
            ],
            ProxyLocation.UK: [
                ProxyConfig("proxy-uk-1.example.com", 8080, location=ProxyLocation.UK),
                ProxyConfig("proxy-uk-2.example.com", 8080, location=ProxyLocation.UK),
            ],
            ProxyLocation.DE: [
                ProxyConfig("proxy-de-1.example.com", 8080, location=ProxyLocation.DE),
                ProxyConfig("proxy-de-2.example.com", 8080, location=ProxyLocation.DE),
            ],
            # Add more locations as needed
        }
    
    async def get_optimal_proxy(self, 
                              search_type: str, 
                              destination: str,
                              preferred_locations: List[ProxyLocation] = None) -> ProxyConfig:
        """
        Selects the best proxy based on multiple factors.
        
        Args:
            search_type: Type of search (flight, hotel, etc.)
            destination: Destination country/city
            preferred_locations: Preferred proxy locations
            
        Returns:
            Best proxy configuration for the search
        """
        # Determine optimal locations based on destination
        optimal_locations = self._determine_optimal_locations(destination, preferred_locations)
        
        # Get available proxies for these locations
        available_proxies = []
        for location in optimal_locations:
            if location in self.proxy_pool:
                available_proxies.extend(self.proxy_pool[location])
        
        # Filter working proxies
        working_proxies = [p for p in available_proxies if p.is_working]
        
        if not working_proxies:
            raise Exception("No working proxies available")
        
        # Select best proxy based on performance metrics
        best_proxy = self._select_best_proxy(working_proxies, search_type)
        
        self.current_proxy = best_proxy
        return best_proxy
    
    def _determine_optimal_locations(self, 
                                   destination: str, 
                                   preferred: List[ProxyLocation] = None) -> List[ProxyLocation]:
        """
        Determines optimal proxy locations based on destination and preferences.
        """
        # Destination-based optimization
        destination_optimization = {
            "europe": [ProxyLocation.UK, ProxyLocation.DE, ProxyLocation.FR],
            "asia": [ProxyLocation.JP, ProxyLocation.AU],
            "americas": [ProxyLocation.US, ProxyLocation.CA],
            "default": [ProxyLocation.US, ProxyLocation.UK, ProxyLocation.DE]
        }
        
        # Get base locations
        base_locations = destination_optimization.get("default", [ProxyLocation.US])
        
        # Add preferred locations if provided
        if preferred:
            base_locations = preferred + base_locations
        
        return list(set(base_locations))  # Remove duplicates
    
    def _select_best_proxy(self, 
                          proxies: List[ProxyConfig], 
                          search_type: str) -> ProxyConfig:
        """
        Selects the best proxy based on performance metrics.
        """
        # Score proxies based on multiple factors
        scored_proxies = []
        for proxy in proxies:
            score = self._calculate_proxy_score(proxy, search_type)
            scored_proxies.append((score, proxy))
        
        # Return proxy with highest score
        scored_proxies.sort(key=lambda x: x[0], reverse=True)
        return scored_proxies[0][1]
    
    def _calculate_proxy_score(self, proxy: ProxyConfig, search_type: str) -> float:
        """
        Calculates a score for a proxy based on various factors.
        """
        score = 0.0
        
        # Response time (lower is better)
        score += max(0, 100 - proxy.response_time)
        
        # Success rate
        score += proxy.success_rate
        
        # Search type optimization
        type_bonus = self._get_search_type_bonus(proxy.location, search_type)
        score += type_bonus
        
        return score
    
    def _get_search_type_bonus(self, location: ProxyLocation, search_type: str) -> float:
        """
        Returns bonus points for specific location/search type combinations.
        """
        bonuses = {
            (ProxyLocation.US, "flight"): 10,
            (ProxyLocation.UK, "hotel"): 10,
            (ProxyLocation.DE, "package"): 10,
            # Add more combinations as needed
        }
        return bonuses.get((location, search_type), 0)
    
    async def test_proxy(self, proxy: ProxyConfig) -> bool:
        """
        Tests if a proxy is working and updates performance metrics.
        """
        try:
            start_time = asyncio.get_event_loop().time()
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    "https://httpbin.org/ip",
                    proxy=f"http://{proxy.host}:{proxy.port}",
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:
                    if response.status == 200:
                        response_time = asyncio.get_event_loop().time() - start_time
                        proxy.response_time = response_time
                        proxy.is_working = True
                        return True
        except Exception as e:
            print(f"Proxy test failed for {proxy.host}: {e}")
            proxy.is_working = False
            return False
        
        return False
    
    async def rotate_proxy(self, reason: str = "performance"):
        """
        Rotates to a new proxy when current one underperforms.
        """
        if self.current_proxy:
            # Mark current proxy as problematic
            self.current_proxy.is_working = False
            
            # Log rotation reason
            print(f"Rotating proxy due to: {reason}")
        
        # Select new proxy
        new_proxy = await self.get_optimal_proxy("general", "default")
        self.current_proxy = new_proxy
        
        return new_proxy
```

### 2. VPN-Enabled HTTP Client
```python
class VPNHTTPClient:
    """
    HTTP client that automatically uses VPN/proxy for requests.
    """
    
    def __init__(self, proxy_manager: ProxyManager):
        self.proxy_manager = proxy_manager
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def __aenter__(self):
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def get(self, 
                 url: str, 
                 search_type: str = "general",
                 destination: str = "default",
                 **kwargs) -> aiohttp.ClientResponse:
        """
        Makes a GET request through the optimal proxy.
        """
        # Get optimal proxy
        proxy_config = await self.proxy_manager.get_optimal_proxy(
            search_type, destination
        )
        
        # Prepare proxy URL
        proxy_url = f"http://{proxy_config.host}:{proxy_config.port}"
        if proxy_config.username and proxy_config.password:
            proxy_url = f"http://{proxy_config.username}:{proxy_config.password}@{proxy_config.host}:{proxy_config.port}"
        
        # Make request with proxy
        try:
            response = await self.session.get(
                url,
                proxy=proxy_url,
                **kwargs
            )
            
            # Update proxy performance metrics
            await self._update_proxy_metrics(proxy_config, response)
            
            return response
            
        except Exception as e:
            # Rotate proxy on failure
            await self.proxy_manager.rotate_proxy(f"Request failed: {e}")
            raise
    
    async def _update_proxy_metrics(self, proxy: ProxyConfig, response: aiohttp.ClientResponse):
        """
        Updates proxy performance metrics based on response.
        """
        # Update success rate
        if response.status == 200:
            proxy.success_rate = min(100, proxy.success_rate + 1)
        else:
            proxy.success_rate = max(0, proxy.success_rate - 5)
        
        # Update working status
        proxy.is_working = proxy.success_rate > 50
```

### 3. Travel Search with VPN
```python
class VPNTravelSearcher:
    """
    Travel search functionality with VPN integration.
    """
    
    def __init__(self, proxy_manager: ProxyManager):
        self.proxy_manager = proxy_manager
        self.http_client = VPNHTTPClient(proxy_manager)
    
    async def search_flights_with_vpn(self, 
                                    origin: str, 
                                    destination: str,
                                    departure_date: str,
                                    return_date: str = None) -> Dict:
        """
        Searches for flights using multiple proxy locations for price comparison.
        """
        search_params = {
            "origin": origin,
            "destination": destination,
            "departure_date": departure_date,
            "return_date": return_date
        }
        
        # Determine optimal proxy locations for this search
        optimal_locations = self._get_optimal_locations_for_route(origin, destination)
        
        results = {}
        
        # Search from each optimal location
        for location in optimal_locations:
            try:
                # Get proxy for this location
                proxy = await self.proxy_manager.get_optimal_proxy(
                    "flight", destination, [location]
                )
                
                # Search using this proxy
                async with self.http_client as client:
                    search_results = await self._search_flights_from_location(
                        client, search_params, location
                    )
                    
                    results[location.value] = {
                        "proxy_location": location.value,
                        "results": search_results,
                        "search_time": asyncio.get_event_loop().time()
                    }
                    
            except Exception as e:
                print(f"Search failed for location {location.value}: {e}")
                continue
        
        # Compare results and return best options
        return self._compare_results(results)
    
    def _get_optimal_locations_for_route(self, origin: str, destination: str) -> List[ProxyLocation]:
        """
        Determines optimal proxy locations for a specific route.
        """
        # Route-specific optimization logic
        route_optimization = {
            ("US", "EU"): [ProxyLocation.UK, ProxyLocation.DE, ProxyLocation.FR],
            ("EU", "US"): [ProxyLocation.US, ProxyLocation.CA],
            ("US", "ASIA"): [ProxyLocation.JP, ProxyLocation.AU],
            ("EU", "ASIA"): [ProxyLocation.JP, ProxyLocation.AU],
        }
        
        # Determine region for origin and destination
        origin_region = self._get_region(origin)
        dest_region = self._get_region(destination)
        
        # Get optimal locations for this route
        optimal = route_optimization.get((origin_region, dest_region))
        
        if not optimal:
            # Default optimization
            optimal = [ProxyLocation.US, ProxyLocation.UK, ProxyLocation.DE]
        
        return optimal
    
    def _get_region(self, location: str) -> str:
        """
        Determines the region for a location.
        """
        # Simplified region mapping
        region_mapping = {
            "US": "US", "CA": "US", "MX": "US",
            "UK": "EU", "DE": "EU", "FR": "EU", "IT": "EU", "ES": "EU",
            "JP": "ASIA", "CN": "ASIA", "KR": "ASIA", "AU": "ASIA"
        }
        
        return region_mapping.get(location.upper(), "OTHER")
    
    async def _search_flights_from_location(self, 
                                          client: VPNHTTPClient,
                                          params: Dict, 
                                          location: ProxyLocation) -> Dict:
        """
        Searches for flights from a specific proxy location.
        """
        # This would integrate with actual flight search APIs
        # For example, using Amadeus API with the proxy
        
        search_url = "https://api.amadeus.com/v2/shopping/flight-offers"
        
        response = await client.get(
            search_url,
            search_type="flight",
            destination=params["destination"],
            params={
                "originLocationCode": params["origin"],
                "destinationLocationCode": params["destination"],
                "departureDate": params["departure_date"],
                "adults": 1,
                "max": 10
            }
        )
        
        return await response.json()
    
    def _compare_results(self, results: Dict) -> Dict:
        """
        Compares results from different proxy locations and returns best options.
        """
        all_flights = []
        
        # Collect all flights from all locations
        for location, data in results.items():
            if "results" in data and "data" in data["results"]:
                for flight in data["results"]["data"]:
                    flight["search_location"] = location
                    all_flights.append(flight)
        
        # Sort by price
        all_flights.sort(key=lambda x: float(x["price"]["total"]))
        
        # Return top 10 results with location information
        return {
            "best_deals": all_flights[:10],
            "search_summary": {
                "total_results": len(all_flights),
                "locations_searched": list(results.keys()),
                "price_range": {
                    "min": float(all_flights[0]["price"]["total"]) if all_flights else 0,
                    "max": float(all_flights[-1]["price"]["total"]) if all_flights else 0
                }
            }
        }
```

## 🔧 Configuration

### Environment Variables
```env
# Proxy Configuration
PROXY_PROVIDER=your_proxy_provider
PROXY_API_KEY=your_proxy_api_key
PROXY_USERNAME=your_proxy_username
PROXY_PASSWORD=your_proxy_password

# VPN Configuration
VPN_ENABLED=true
VPN_ROTATION_INTERVAL=300  # seconds
VPN_MAX_RETRIES=3
VPN_TIMEOUT=30

# Performance Settings
PROXY_TEST_INTERVAL=600  # seconds
PROXY_HEALTH_CHECK_URL=https://httpbin.org/ip
PROXY_MAX_RESPONSE_TIME=5.0  # seconds
```

### Proxy Provider Integration
```python
class ProxyProvider:
    """
    Interface for different proxy providers.
    """
    
    async def get_proxy_list(self) -> List[ProxyConfig]:
        """Get list of available proxies from provider."""
        pass
    
    async def test_proxy(self, proxy: ProxyConfig) -> bool:
        """Test if a proxy is working."""
        pass
    
    async def get_proxy_stats(self, proxy: ProxyConfig) -> Dict:
        """Get performance statistics for a proxy."""
        pass

class BrightDataProvider(ProxyProvider):
    """
    Integration with Bright Data proxy service.
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.brightdata.com"
    
    async def get_proxy_list(self) -> List[ProxyConfig]:
        """Get proxies from Bright Data."""
        # Implementation for Bright Data API
        pass

class ProxyMeshProvider(ProxyProvider):
    """
    Integration with ProxyMesh service.
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.proxymesh.com"
    
    async def get_proxy_list(self) -> List[ProxyConfig]:
        """Get proxies from ProxyMesh."""
        # Implementation for ProxyMesh API
        pass
```

## 📊 Monitoring and Analytics

### Performance Tracking
```python
class VPNAnalytics:
    """
    Tracks VPN performance and provides analytics.
    """
    
    def __init__(self):
        self.metrics = {
            "requests_by_location": {},
            "success_rates": {},
            "response_times": {},
            "price_differences": {},
            "cost_savings": {}
        }
    
    def track_request(self, location: str, success: bool, response_time: float):
        """Track a request made through a specific location."""
        if location not in self.metrics["requests_by_location"]:
            self.metrics["requests_by_location"][location] = 0
        self.metrics["requests_by_location"][location] += 1
        
        if location not in self.metrics["success_rates"]:
            self.metrics["success_rates"][location] = {"success": 0, "total": 0}
        
        self.metrics["success_rates"][location]["total"] += 1
        if success:
            self.metrics["success_rates"][location]["success"] += 1
    
    def track_price_difference(self, location: str, price_difference: float):
        """Track price differences found through different locations."""
        if location not in self.metrics["price_differences"]:
            self.metrics["price_differences"][location] = []
        self.metrics["price_differences"][location].append(price_difference)
    
    def get_analytics_report(self) -> Dict:
        """Generate analytics report."""
        report = {
            "total_requests": sum(self.metrics["requests_by_location"].values()),
            "location_performance": {},
            "average_savings": {},
            "recommendations": []
        }
        
        # Calculate performance metrics for each location
        for location in self.metrics["requests_by_location"]:
            success_data = self.metrics["success_rates"].get(location, {"success": 0, "total": 0})
            success_rate = (success_data["success"] / success_data["total"] * 100) if success_data["total"] > 0 else 0
            
            price_diffs = self.metrics["price_differences"].get(location, [])
            avg_savings = sum(price_diffs) / len(price_diffs) if price_diffs else 0
            
            report["location_performance"][location] = {
                "success_rate": success_rate,
                "total_requests": self.metrics["requests_by_location"][location],
                "average_savings": avg_savings
            }
        
        return report
```

## 🚀 Usage Example

```python
async def main():
    # Initialize proxy manager
    proxy_manager = ProxyManager()
    
    # Initialize travel searcher
    searcher = VPNTravelSearcher(proxy_manager)
    
    # Search for flights with VPN optimization
    results = await searcher.search_flights_with_vpn(
        origin="NYC",
        destination="LHR",
        departure_date="2024-06-15",
        return_date="2024-06-22"
    )
    
    print("Best flight deals found:")
    for flight in results["best_deals"][:5]:
        print(f"${flight['price']['total']} - {flight['search_location']} - {flight['itineraries'][0]['segments'][0]['carrierCode']}")
    
    print(f"\nSearch summary:")
    print(f"Total results: {results['search_summary']['total_results']}")
    print(f"Locations searched: {results['search_summary']['locations_searched']}")
    print(f"Price range: ${results['search_summary']['price_range']['min']} - ${results['search_summary']['price_range']['max']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## ⚠️ Important Considerations

### Legal and Ethical
1. **Terms of Service**: Ensure compliance with travel booking site terms of service
2. **Rate Limiting**: Respect API rate limits and implement proper delays
3. **Data Privacy**: Handle user data according to privacy regulations
4. **Fair Use**: Use VPN capabilities responsibly and ethically

### Technical
1. **Proxy Quality**: Use reliable, high-quality proxy services
2. **Error Handling**: Implement robust error handling and fallback mechanisms
3. **Performance**: Monitor and optimize proxy performance
4. **Cost Management**: Track proxy usage costs and optimize for efficiency

### Security
1. **Authentication**: Secure proxy credentials and API keys
2. **Encryption**: Use encrypted connections for all proxy communications
3. **Monitoring**: Monitor for suspicious activity or abuse
4. **Compliance**: Ensure compliance with relevant regulations

---

This VPN integration will significantly enhance the travel agent's ability to find the best deals by leveraging location-based pricing differences and accessing region-specific promotions.
