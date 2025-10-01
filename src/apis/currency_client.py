"""
Fixer.io API client for currency exchange rates.
Free tier: 100 calls/month
"""

import aiohttp
import asyncio
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json

from ..config import config
from .rate_limiter import APIRateLimiter

class FixerClient:
    """
    Fixer.io API client for currency exchange rates.
    Provides real-time and historical exchange rates for travel planning.
    """
    
    def __init__(self, api_key: str = None, rate_limiter: APIRateLimiter = None):
        self.api_key = api_key or config.FIXER_API_KEY
        self.base_url = "http://data.fixer.io/api"
        self.rate_limiter = rate_limiter or APIRateLimiter()
        
        if not self.api_key:
            raise ValueError("Fixer.io API key is required")
    
    async def _make_request(self, endpoint: str, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make API request with rate limiting and error handling.
        
        Args:
            endpoint: API endpoint
            params: Request parameters
            
        Returns:
            dict: API response data
        """
        # Check rate limit
        if not await self.rate_limiter.check_rate_limit('fixer'):
            await self.rate_limiter.wait_for_rate_limit('fixer')
        
        # Add API key to parameters
        params['access_key'] = self.api_key
        
        url = f"{self.base_url}/{endpoint}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=30)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        if not data.get('success', False):
                            raise Exception(f"API error: {data.get('error', {}).get('info', 'Unknown error')}")
                        
                        return data
                    else:
                        error_text = await response.text()
                        raise Exception(f"API request failed: {response.status} - {error_text}")
        
        except asyncio.TimeoutError:
            raise Exception("API request timed out")
        except Exception as e:
            raise Exception(f"API request error: {str(e)}")
    
    async def get_latest_rates(self, base_currency: str = "USD", symbols: List[str] = None) -> Dict[str, Any]:
        """
        Get latest exchange rates.
        
        Args:
            base_currency: Base currency code (e.g., 'USD', 'EUR')
            symbols: List of currency codes to get rates for
            
        Returns:
            dict: Latest exchange rates
        """
        params = {'base': base_currency}
        
        if symbols:
            params['symbols'] = ','.join(symbols)
        
        try:
            data = await self._make_request('latest', params)
            
            return {
                'base': data['base'],
                'date': data['date'],
                'rates': data['rates'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to get latest rates: {str(e)}")
    
    async def get_historical_rates(self, date: str, base_currency: str = "USD", 
                                 symbols: List[str] = None) -> Dict[str, Any]:
        """
        Get historical exchange rates for a specific date.
        
        Args:
            date: Date in YYYY-MM-DD format
            base_currency: Base currency code
            symbols: List of currency codes to get rates for
            
        Returns:
            dict: Historical exchange rates
        """
        params = {'base': base_currency}
        
        if symbols:
            params['symbols'] = ','.join(symbols)
        
        try:
            data = await self._make_request(date, params)
            
            return {
                'base': data['base'],
                'date': data['date'],
                'rates': data['rates'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to get historical rates for {date}: {str(e)}")
    
    async def convert_currency(self, amount: float, from_currency: str, to_currency: str) -> Dict[str, Any]:
        """
        Convert currency amount from one currency to another.
        
        Args:
            amount: Amount to convert
            from_currency: Source currency code
            to_currency: Target currency code
            
        Returns:
            dict: Conversion result
        """
        try:
            # Get latest rates with both currencies
            rates_data = await self.get_latest_rates(from_currency, [to_currency])
            
            if to_currency not in rates_data['rates']:
                raise Exception(f"Currency {to_currency} not found in rates")
            
            rate = rates_data['rates'][to_currency]
            converted_amount = amount * rate
            
            return {
                'from_currency': from_currency,
                'to_currency': to_currency,
                'amount': amount,
                'rate': rate,
                'converted_amount': converted_amount,
                'date': rates_data['date'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to convert {amount} {from_currency} to {to_currency}: {str(e)}")
    
    async def get_currency_symbols(self) -> Dict[str, str]:
        """
        Get list of supported currency symbols.
        
        Returns:
            dict: Currency codes and their descriptions
        """
        try:
            data = await self._make_request('symbols', {})
            
            return data.get('symbols', {})
            
        except Exception as e:
            raise Exception(f"Failed to get currency symbols: {str(e)}")
    
    async def get_travel_currency_info(self, destination_country: str, 
                                     base_currency: str = "USD") -> Dict[str, Any]:
        """
        Get comprehensive currency information for travel planning.
        
        Args:
            destination_country: Destination country code (e.g., 'FR', 'JP')
            base_currency: Base currency code
            
        Returns:
            dict: Comprehensive currency information
        """
        try:
            # Common currencies for travel
            travel_currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL']
            
            # Get latest rates
            rates_data = await self.get_latest_rates(base_currency, travel_currencies)
            
            # Get currency symbols
            symbols = await self.get_currency_symbols()
            
            # Create comprehensive currency info
            currency_info = {
                'base_currency': base_currency,
                'destination_country': destination_country,
                'date': rates_data['date'],
                'rates': rates_data['rates'],
                'symbols': symbols,
                'travel_currencies': {}
            }
            
            # Add travel-specific currency information
            for currency in travel_currencies:
                if currency in rates_data['rates']:
                    currency_info['travel_currencies'][currency] = {
                        'code': currency,
                        'name': symbols.get(currency, currency),
                        'rate': rates_data['rates'][currency],
                        'conversion_from_base': rates_data['rates'][currency],
                        'conversion_to_base': 1 / rates_data['rates'][currency] if rates_data['rates'][currency] != 0 else 0
                    }
            
            return currency_info
            
        except Exception as e:
            raise Exception(f"Failed to get travel currency info: {str(e)}")
    
    async def calculate_travel_budget(self, base_currency: str, destination_currency: str,
                                    base_budget: float, expenses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculate travel budget in destination currency.
        
        Args:
            base_currency: Base currency code
            destination_currency: Destination currency code
            base_budget: Base budget amount
            expenses: List of expense categories with amounts
            
        Returns:
            dict: Budget calculation results
        """
        try:
            # Get conversion rate
            conversion_data = await self.convert_currency(1, base_currency, destination_currency)
            rate = conversion_data['rate']
            
            # Calculate total budget in destination currency
            total_budget_destination = base_budget * rate
            
            # Calculate expenses in destination currency
            expenses_destination = []
            total_expenses_destination = 0
            
            for expense in expenses:
                expense_amount = expense.get('amount', 0)
                expense_destination = expense_amount * rate
                
                expenses_destination.append({
                    'category': expense.get('category', 'Unknown'),
                    'amount_base': expense_amount,
                    'amount_destination': expense_destination,
                    'currency_base': base_currency,
                    'currency_destination': destination_currency
                })
                
                total_expenses_destination += expense_destination
            
            # Calculate remaining budget
            remaining_budget = total_budget_destination - total_expenses_destination
            
            return {
                'base_currency': base_currency,
                'destination_currency': destination_currency,
                'exchange_rate': rate,
                'base_budget': base_budget,
                'total_budget_destination': total_budget_destination,
                'expenses': expenses_destination,
                'total_expenses_destination': total_expenses_destination,
                'remaining_budget': remaining_budget,
                'budget_status': 'sufficient' if remaining_budget >= 0 else 'insufficient',
                'date': conversion_data['date'],
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to calculate travel budget: {str(e)}")
    
    def get_currency_emoji(self, currency_code: str) -> str:
        """
        Get currency emoji based on currency code.
        
        Args:
            currency_code: Currency code (e.g., 'USD', 'EUR')
            
        Returns:
            str: Currency emoji
        """
        currency_emojis = {
            'USD': '💵',  # US Dollar
            'EUR': '💶',  # Euro
            'GBP': '💷',  # British Pound
            'JPY': '💴',  # Japanese Yen
            'CAD': '🇨🇦',  # Canadian Dollar
            'AUD': '🇦🇺',  # Australian Dollar
            'CHF': '🇨🇭',  # Swiss Franc
            'CNY': '🇨🇳',  # Chinese Yuan
            'INR': '🇮🇳',  # Indian Rupee
            'BRL': '🇧🇷',  # Brazilian Real
            'MXN': '🇲🇽',  # Mexican Peso
            'KRW': '🇰🇷',  # South Korean Won
            'SGD': '🇸🇬',  # Singapore Dollar
            'HKD': '🇭🇰',  # Hong Kong Dollar
            'NZD': '🇳🇿',  # New Zealand Dollar
            'SEK': '🇸🇪',  # Swedish Krona
            'NOK': '🇳🇴',  # Norwegian Krone
            'DKK': '🇩🇰',  # Danish Krone
            'PLN': '🇵🇱',  # Polish Zloty
            'CZK': '🇨🇿',  # Czech Koruna
            'HUF': '🇭🇺',  # Hungarian Forint
            'RUB': '🇷🇺',  # Russian Ruble
            'TRY': '🇹🇷',  # Turkish Lira
            'ZAR': '🇿🇦',  # South African Rand
            'ILS': '🇮🇱',  # Israeli Shekel
            'AED': '🇦🇪',  # UAE Dirham
            'SAR': '🇸🇦',  # Saudi Riyal
            'EGP': '🇪🇬',  # Egyptian Pound
            'THB': '🇹🇭',  # Thai Baht
            'MYR': '🇲🇾',  # Malaysian Ringgit
            'IDR': '🇮🇩',  # Indonesian Rupiah
            'PHP': '🇵🇭',  # Philippine Peso
            'VND': '🇻🇳',  # Vietnamese Dong
        }
        
        return currency_emojis.get(currency_code, '💰')
    
    async def get_currency_trends(self, currency_pair: str, days: int = 7) -> Dict[str, Any]:
        """
        Get currency trend analysis for the past few days.
        
        Args:
            currency_pair: Currency pair (e.g., 'USD_EUR')
            days: Number of days to analyze
            
        Returns:
            dict: Currency trend analysis
        """
        try:
            from_currency, to_currency = currency_pair.split('_')
            
            # Get historical rates for the past few days
            historical_rates = []
            current_date = datetime.now().date()
            
            for i in range(days):
                date = current_date - timedelta(days=i)
                date_str = date.strftime('%Y-%m-%d')
                
                try:
                    rates_data = await self.get_historical_rates(date_str, from_currency, [to_currency])
                    if to_currency in rates_data['rates']:
                        historical_rates.append({
                            'date': date_str,
                            'rate': rates_data['rates'][to_currency]
                        })
                except:
                    # Skip if historical data not available
                    continue
            
            if not historical_rates:
                raise Exception("No historical data available")
            
            # Calculate trend
            rates = [rate['rate'] for rate in historical_rates]
            trend = 'stable'
            
            if len(rates) >= 2:
                first_rate = rates[-1]  # Oldest rate
                last_rate = rates[0]    # Newest rate
                
                change_percent = ((last_rate - first_rate) / first_rate) * 100
                
                if change_percent > 2:
                    trend = 'increasing'
                elif change_percent < -2:
                    trend = 'decreasing'
            
            return {
                'currency_pair': currency_pair,
                'from_currency': from_currency,
                'to_currency': to_currency,
                'historical_rates': historical_rates,
                'trend': trend,
                'current_rate': rates[0] if rates else 0,
                'analysis_days': len(historical_rates),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Failed to get currency trends: {str(e)}")
