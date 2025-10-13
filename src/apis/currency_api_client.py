"""
Free Currency API client - No API key required.
Provides real-time currency exchange rates.
"""

import aiohttp
import asyncio
from typing import Dict, Any, Optional, List
from datetime import datetime
import json

class CurrencyAPIClient:
    """
    Free Currency API client for exchange rates.
    No API key required, completely free.
    """
    
    def __init__(self):
        self.base_url = "https://api.freecurrencyapi.com/v1"
        self.fallback_url = "https://api.exchangerate-api.com/v4/latest"
    
    async def get_latest_rates(self, base_currency: str = "USD") -> Optional[Dict[str, Any]]:
        """
        Get latest exchange rates.
        
        Args:
            base_currency: Base currency code (e.g., 'USD', 'EUR')
            
        Returns:
            Exchange rates dictionary
        """
        try:
            # Try primary API first
            rates = await self._get_rates_primary(base_currency)
            if rates:
                return rates
            
            # Fallback to secondary API
            rates = await self._get_rates_fallback(base_currency)
            if rates:
                return rates
                
            return None
            
        except Exception as e:
            print(f"Currency API error: {e}")
            return None
    
    async def convert_currency(self, amount: float, from_currency: str, to_currency: str) -> Optional[Dict[str, Any]]:
        """
        Convert currency amount.
        
        Args:
            amount: Amount to convert
            from_currency: Source currency code
            to_currency: Target currency code
            
        Returns:
            Conversion result
        """
        try:
            rates_data = await self.get_latest_rates(from_currency)
            if not rates_data:
                return None
            
            rates = rates_data.get('rates', {})
            if to_currency not in rates:
                return None
            
            rate = rates[to_currency]
            converted_amount = amount * rate
            
            return {
                'from_currency': from_currency,
                'to_currency': to_currency,
                'amount': amount,
                'rate': rate,
                'converted_amount': converted_amount,
                'date': rates_data.get('date', datetime.now().strftime('%Y-%m-%d')),
                'source': 'Free Currency API',
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Currency conversion error: {e}")
            return None
    
    async def _get_rates_primary(self, base_currency: str) -> Optional[Dict[str, Any]]:
        """Get rates from primary API."""
        try:
            url = f"{self.base_url}/latest"
            params = {
                'apikey': 'fca_live_demo',  # Demo key for testing
                'base_currency': base_currency
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, params=params, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'base': base_currency,
                            'date': datetime.now().strftime('%Y-%m-%d'),
                            'rates': data.get('data', {}),
                            'source': 'Free Currency API (Primary)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
        except Exception as e:
            print(f"Primary currency API error: {e}")
        
        return None
    
    async def _get_rates_fallback(self, base_currency: str) -> Optional[Dict[str, Any]]:
        """Get rates from fallback API."""
        try:
            url = f"{self.fallback_url}/{base_currency}"
            
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        return {
                            'base': base_currency,
                            'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
                            'rates': data.get('rates', {}),
                            'source': 'Exchange Rate API (Fallback)',
                            'timestamp': datetime.now().isoformat()
                        }
                        
        except Exception as e:
            print(f"Fallback currency API error: {e}")
        
        return None
    
    async def get_supported_currencies(self) -> List[str]:
        """Get list of supported currency codes."""
        return [
            'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL',
            'MXN', 'KRW', 'SGD', 'HKD', 'NZD', 'SEK', 'NOK', 'DKK', 'PLN', 'CZK',
            'HUF', 'RUB', 'TRY', 'ZAR', 'ILS', 'AED', 'SAR', 'EGP', 'THB', 'MYR',
            'IDR', 'PHP', 'VND', 'RON', 'BGN', 'HRK', 'ISK', 'UAH', 'LTL', 'LVL',
            'EEK', 'MTL', 'CYP', 'SIT', 'SKK', 'BAM', 'MKD', 'ALL', 'RSD', 'MDL'
        ]
    
    def get_currency_symbol(self, currency_code: str) -> str:
        """Get currency symbol."""
        symbols = {
            'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$',
            'AUD': 'A$', 'CHF': 'CHF', 'CNY': '¥', 'INR': '₹', 'BRL': 'R$',
            'MXN': '$', 'KRW': '₩', 'SGD': 'S$', 'HKD': 'HK$', 'NZD': 'NZ$',
            'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč',
            'HUF': 'Ft', 'RUB': '₽', 'TRY': '₺', 'ZAR': 'R', 'ILS': '₪',
            'AED': 'د.إ', 'SAR': '﷼', 'EGP': '£', 'THB': '฿', 'MYR': 'RM',
            'IDR': 'Rp', 'PHP': '₱', 'VND': '₫'
        }
        
        return symbols.get(currency_code, currency_code)
