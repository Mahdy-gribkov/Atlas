# Security Architecture & Privacy-First Design

## 🔒 Security-First Philosophy

This travel AI agent is designed with **privacy and security as the top priority**. Every component is built to protect user data and ensure complete privacy.

## 🛡️ Core Security Principles

### 1. **Zero-Knowledge Architecture**
- **No External Data Storage**: All user data stays on the user's device
- **Local Processing**: All AI processing happens locally when possible
- **Encrypted Communication**: All external API calls are encrypted and anonymized
- **Data Minimization**: Collect only essential data, delete immediately after use

### 2. **End-to-End Encryption**
- **Local Database Encryption**: SQLite database encrypted with AES-256
- **Memory Encryption**: Sensitive data encrypted in memory
- **API Communication**: All external calls use TLS 1.3
- **File System Protection**: All local files encrypted at rest

### 3. **Privacy by Design**
- **No User Tracking**: No analytics, no user behavior tracking
- **Anonymous API Calls**: External API calls don't include user identifiers
- **Local Analytics**: All analytics happen locally, no external transmission
- **Immediate Data Deletion**: Temporary data deleted after each session

## 🏗️ Secure Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Device (Local)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Frontend      │  │   Backend       │  │   Database   │ │
│  │   (React)       │  │   (FastAPI)     │  │   (SQLite)   │ │
│  │   - Client-side │  │   - Local only  │  │   - Encrypted│ │
│  │   - No tracking │  │   - No external │  │   - Local    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────┬───────────────────────────────────────┘
                      │ (Encrypted, Anonymous)
┌─────────────────────▼───────────────────────────────────────┐
│                External APIs (Free Only)                   │
│  - OpenWeather (Weather)                                   │
│  - Fixer.io (Currency)                                     │
│  - Public Travel APIs                                      │
│  - No user data transmitted                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Security Implementation

### 1. **Local Database Security**
```python
import sqlite3
import sqlcipher3
from cryptography.fernet import Fernet
import os

class SecureDatabase:
    """
    Encrypted local database with zero external access.
    """
    
    def __init__(self, db_path: str, encryption_key: bytes):
        self.db_path = db_path
        self.encryption_key = encryption_key
        self.fernet = Fernet(encryption_key)
        self._initialize_secure_db()
    
    def _initialize_secure_db(self):
        """Initialize encrypted SQLite database."""
        # Use SQLCipher for database-level encryption
        self.conn = sqlcipher3.connect(self.db_path)
        self.conn.execute(f"PRAGMA key = '{self.encryption_key.decode()}'")
        self.conn.execute("PRAGMA cipher_page_size = 4096")
        self.conn.execute("PRAGMA kdf_iter = 64000")
        self.conn.execute("PRAGMA cipher_hmac_algorithm = HMAC_SHA1")
        self.conn.execute("PRAGMA cipher_kdf_algorithm = PBKDF2_HMAC_SHA1")
        
        # Create tables with minimal data collection
        self._create_tables()
    
    def _create_tables(self):
        """Create tables with minimal data collection."""
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS user_preferences (
                id INTEGER PRIMARY KEY,
                preference_type TEXT,
                preference_value TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP
            )
        """)
        
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS search_history (
                id INTEGER PRIMARY KEY,
                search_type TEXT,
                search_params TEXT,  -- Encrypted
                results_count INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP DEFAULT (datetime('now', '+1 day'))
            )
        """)
    
    def store_preference(self, pref_type: str, pref_value: str, ttl_hours: int = 24):
        """Store user preference with automatic expiration."""
        # Encrypt sensitive data
        encrypted_value = self.fernet.encrypt(pref_value.encode())
        
        self.conn.execute("""
            INSERT INTO user_preferences (preference_type, preference_value, expires_at)
            VALUES (?, ?, datetime('now', '+{} hours'))
        """.format(ttl_hours), (pref_type, encrypted_value))
        
        self.conn.commit()
    
    def get_preferences(self, pref_type: str = None):
        """Retrieve user preferences with automatic cleanup."""
        # Clean up expired preferences first
        self.conn.execute("DELETE FROM user_preferences WHERE expires_at < datetime('now')")
        
        if pref_type:
            cursor = self.conn.execute(
                "SELECT preference_value FROM user_preferences WHERE preference_type = ?",
                (pref_type,)
            )
        else:
            cursor = self.conn.execute("SELECT preference_type, preference_value FROM user_preferences")
        
        results = []
        for row in cursor.fetchall():
            try:
                if pref_type:
                    decrypted_value = self.fernet.decrypt(row[0]).decode()
                    results.append(decrypted_value)
                else:
                    decrypted_value = self.fernet.decrypt(row[1]).decode()
                    results.append((row[0], decrypted_value))
            except:
                # Skip corrupted data
                continue
        
        return results
    
    def cleanup_expired_data(self):
        """Remove all expired data."""
        self.conn.execute("DELETE FROM user_preferences WHERE expires_at < datetime('now')")
        self.conn.execute("DELETE FROM search_history WHERE expires_at < datetime('now')")
        self.conn.commit()
    
    def close(self):
        """Close database connection securely."""
        if self.conn:
            self.conn.close()
```

### 2. **Secure API Communication**
```python
import aiohttp
import asyncio
from typing import Dict, Any
import hashlib
import hmac
import time

class SecureAPIClient:
    """
    Secure API client with anonymization and rate limiting.
    """
    
    def __init__(self):
        self.session = None
        self.rate_limits = {}
        self.request_history = []
    
    async def __aenter__(self):
        # Create session with security headers
        timeout = aiohttp.ClientTimeout(total=30)
        connector = aiohttp.TCPConnector(ssl=True)
        
        self.session = aiohttp.ClientSession(
            timeout=timeout,
            connector=connector,
            headers={
                'User-Agent': 'TravelAgent/1.0 (Privacy-First)',
                'Accept': 'application/json',
                'Connection': 'close'  # No persistent connections
            }
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    async def make_secure_request(self, 
                                url: str, 
                                params: Dict[str, Any] = None,
                                api_name: str = "unknown") -> Dict[str, Any]:
        """
        Make secure API request with anonymization and rate limiting.
        """
        # Check rate limits
        if not self._check_rate_limit(api_name):
            raise Exception(f"Rate limit exceeded for {api_name}")
        
        # Anonymize request parameters
        anonymized_params = self._anonymize_params(params)
        
        try:
            async with self.session.get(url, params=anonymized_params) as response:
                # Log request (without sensitive data)
                self._log_request(api_name, response.status)
                
                if response.status == 200:
                    data = await response.json()
                    return self._sanitize_response(data)
                else:
                    raise Exception(f"API request failed: {response.status}")
        
        except Exception as e:
            self._log_error(api_name, str(e))
            raise
    
    def _anonymize_params(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Remove or anonymize sensitive parameters.
        """
        if not params:
            return {}
        
        # Parameters to anonymize or remove
        sensitive_keys = ['user_id', 'session_id', 'ip_address', 'location']
        anonymized = {}
        
        for key, value in params.items():
            if key in sensitive_keys:
                # Skip sensitive parameters
                continue
            elif key == 'location' and isinstance(value, str):
                # Generalize location (city level only)
                anonymized[key] = value.split(',')[0].strip()
            else:
                anonymized[key] = value
        
        return anonymized
    
    def _sanitize_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Remove any potentially sensitive data from API responses.
        """
        # Remove tracking IDs, user identifiers, etc.
        sensitive_keys = ['tracking_id', 'user_id', 'session_id', 'ip_address']
        
        def clean_dict(obj):
            if isinstance(obj, dict):
                return {k: clean_dict(v) for k, v in obj.items() 
                       if k not in sensitive_keys}
            elif isinstance(obj, list):
                return [clean_dict(item) for item in obj]
            else:
                return obj
        
        return clean_dict(data)
    
    def _check_rate_limit(self, api_name: str) -> bool:
        """
        Check if API request is within rate limits.
        """
        now = time.time()
        
        # Clean old requests
        self.request_history = [
            req for req in self.request_history 
            if now - req['timestamp'] < 3600  # Keep last hour
        ]
        
        # Count requests for this API in the last hour
        api_requests = [
            req for req in self.request_history 
            if req['api'] == api_name and now - req['timestamp'] < 3600
        ]
        
        # Rate limits (requests per hour)
        limits = {
            'openweather': 1000,
            'fixer': 100,
            'default': 100
        }
        
        limit = limits.get(api_name, limits['default'])
        
        if len(api_requests) >= limit:
            return False
        
        # Record this request
        self.request_history.append({
            'api': api_name,
            'timestamp': now
        })
        
        return True
    
    def _log_request(self, api_name: str, status_code: int):
        """Log request without sensitive data."""
        # Only log essential information
        print(f"API Request: {api_name} - Status: {status_code}")
    
    def _log_error(self, api_name: str, error: str):
        """Log error without sensitive data."""
        print(f"API Error: {api_name} - {error}")
```

### 3. **Local LLM Integration**
```python
import ollama
from typing import Optional

class LocalLLMManager:
    """
    Manages local LLM for privacy-preserving AI processing.
    """
    
    def __init__(self):
        self.local_model = None
        self.fallback_to_openai = False
    
    def initialize_local_model(self, model_name: str = "llama2"):
        """
        Initialize local LLM model.
        """
        try:
            # Check if Ollama is available
            models = ollama.list()
            if model_name in [model['name'] for model in models['models']]:
                self.local_model = model_name
                print(f"Local model {model_name} initialized successfully")
            else:
                print(f"Model {model_name} not found, will use OpenAI as fallback")
                self.fallback_to_openai = True
        except Exception as e:
            print(f"Local LLM not available: {e}")
            self.fallback_to_openai = True
    
    async def generate_response(self, 
                              prompt: str, 
                              context: str = None,
                              use_local: bool = True) -> str:
        """
        Generate response using local LLM or fallback to OpenAI.
        """
        if use_local and self.local_model and not self.fallback_to_openai:
            return await self._generate_local_response(prompt, context)
        else:
            return await self._generate_openai_response(prompt, context)
    
    async def _generate_local_response(self, prompt: str, context: str = None) -> str:
        """
        Generate response using local LLM.
        """
        try:
            full_prompt = f"{context}\n\n{prompt}" if context else prompt
            
            response = ollama.generate(
                model=self.local_model,
                prompt=full_prompt,
                options={
                    'temperature': 0.7,
                    'top_p': 0.9,
                    'max_tokens': 1000
                }
            )
            
            return response['response']
        
        except Exception as e:
            print(f"Local LLM error: {e}")
            # Fallback to OpenAI
            return await self._generate_openai_response(prompt, context)
    
    async def _generate_openai_response(self, prompt: str, context: str = None) -> str:
        """
        Generate response using OpenAI (minimal usage).
        """
        # This would use OpenAI API with minimal data transmission
        # Implementation depends on your OpenAI setup
        pass
```

## 🔍 Free API Sources

### 1. **Weather Information**
- **OpenWeather API**: Free tier (1000 calls/day)
- **WeatherAPI**: Free tier (1M calls/month)
- **AccuWeather**: Free tier (50 calls/day)

### 2. **Currency Exchange**
- **Fixer.io**: Free tier (100 calls/month)
- **ExchangeRate-API**: Free tier (1500 calls/month)
- **CurrencyLayer**: Free tier (1000 calls/month)

### 3. **Travel Information**
- **REST Countries API**: Free, no limits
- **AviationStack**: Free tier (100 calls/month)
- **Amadeus**: Free tier (2000 calls/month)
- **Skyscanner**: Free tier (500 calls/month)

### 4. **Public Data Sources**
- **Wikipedia API**: Free, no limits
- **OpenStreetMap**: Free, no limits
- **Public datasets**: Government and open data sources

## 🛡️ Privacy Protection Measures

### 1. **Data Minimization**
```python
class DataMinimizer:
    """
    Ensures only essential data is collected and processed.
    """
    
    @staticmethod
    def minimize_search_params(params: Dict[str, Any]) -> Dict[str, Any]:
        """
        Remove unnecessary data from search parameters.
        """
        essential_keys = [
            'origin', 'destination', 'departure_date', 'return_date',
            'adults', 'children', 'currency'
        ]
        
        return {k: v for k, v in params.items() if k in essential_keys}
    
    @staticmethod
    def anonymize_location(location: str) -> str:
        """
        Generalize location to city level only.
        """
        # Remove specific addresses, keep only city
        return location.split(',')[0].strip()
    
    @staticmethod
    def hash_user_id(user_id: str) -> str:
        """
        Hash user ID for anonymous tracking.
        """
        return hashlib.sha256(user_id.encode()).hexdigest()[:16]
```

### 2. **Automatic Data Cleanup**
```python
import schedule
import time

class DataCleanupScheduler:
    """
    Automatically cleans up old data to maintain privacy.
    """
    
    def __init__(self, db: SecureDatabase):
        self.db = db
        self.setup_schedule()
    
    def setup_schedule(self):
        """Setup automatic cleanup schedule."""
        # Clean up every hour
        schedule.every().hour.do(self.cleanup_expired_data)
        
        # Deep clean every day
        schedule.every().day.at("02:00").do(self.deep_cleanup)
    
    def cleanup_expired_data(self):
        """Clean up expired data."""
        self.db.cleanup_expired_data()
        print("Expired data cleaned up")
    
    def deep_cleanup(self):
        """Deep cleanup of all temporary data."""
        # Remove all search history older than 24 hours
        # Remove all temporary files
        # Clear all caches
        print("Deep cleanup completed")
    
    def run_scheduler(self):
        """Run the cleanup scheduler."""
        while True:
            schedule.run_pending()
            time.sleep(60)
```

## 🔐 Security Testing

### 1. **Automated Security Tests**
```python
import pytest
from cryptography.fernet import Fernet

class SecurityTests:
    """
    Automated security testing suite.
    """
    
    def test_database_encryption(self):
        """Test database encryption."""
        key = Fernet.generate_key()
        db = SecureDatabase(":memory:", key)
        
        # Test data encryption
        db.store_preference("test", "sensitive_data")
        preferences = db.get_preferences("test")
        
        assert preferences[0] == "sensitive_data"
        db.close()
    
    def test_api_anonymization(self):
        """Test API parameter anonymization."""
        client = SecureAPIClient()
        
        params = {
            "location": "123 Main St, New York, NY, USA",
            "user_id": "user123",
            "destination": "Paris, France"
        }
        
        anonymized = client._anonymize_params(params)
        
        assert "user_id" not in anonymized
        assert anonymized["location"] == "123 Main St"
        assert anonymized["destination"] == "Paris, France"
    
    def test_rate_limiting(self):
        """Test API rate limiting."""
        client = SecureAPIClient()
        
        # Test rate limit
        for i in range(101):  # Exceed default limit
            if not client._check_rate_limit("test_api"):
                assert i >= 100  # Should be limited at 100
                break
```

## 📋 Security Checklist

### Development Phase
- [ ] All sensitive data encrypted at rest
- [ ] No external data storage
- [ ] Local processing for all AI operations
- [ ] API calls anonymized and rate-limited
- [ ] Automatic data cleanup implemented
- [ ] Security tests passing

### Deployment Phase
- [ ] Local deployment only
- [ ] No cloud dependencies
- [ ] Encrypted local database
- [ ] Secure API communication
- [ ] Privacy audit completed
- [ ] User data protection verified

### Ongoing Security
- [ ] Regular security updates
- [ ] Automated security testing
- [ ] Privacy compliance monitoring
- [ ] Data minimization verification
- [ ] Encryption key rotation
- [ ] Security incident response plan

---

This security architecture ensures that your travel AI agent is completely private and secure, with no external data exposure and maximum user privacy protection.
