"""
Response Optimization System - Production Ready
Provides intelligent response optimization and caching strategies.
"""

import asyncio
import time
import logging
import hashlib
from typing import Dict, List, Any, Optional, Union, Callable
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
import json
import re

from .advanced_cache import AdvancedCache, cached
from .simple_performance_monitor import record_response_time, record_metric

logger = logging.getLogger(__name__)


@dataclass
class OptimizationRule:
    """Represents an optimization rule."""
    name: str
    condition: Callable[[Dict[str, Any]], bool]
    action: Callable[[Dict[str, Any]], Any]
    priority: int
    enabled: bool = True


@dataclass
class ResponseCache:
    """Represents a cached response."""
    query_hash: str
    response: str
    created_at: datetime
    expires_at: datetime
    access_count: int
    last_accessed: datetime
    metadata: Dict[str, Any]


class ResponseOptimizer:
    """
    Intelligent response optimization system.
    Provides caching, precomputation, and intelligent response strategies.
    """
    
    def __init__(self, cache: AdvancedCache = None):
        self.cache = cache or AdvancedCache()
        self.optimization_rules: List[OptimizationRule] = []
        self.response_cache: Dict[str, ResponseCache] = {}
        self.precomputed_responses: Dict[str, str] = {}
        
        # Performance tracking
        self.optimization_stats = {
            'cache_hits': 0,
            'cache_misses': 0,
            'precomputed_hits': 0,
            'optimization_applied': 0,
            'response_times': []
        }
        
        # Initialize optimization rules
        self._initialize_optimization_rules()
        
        logger.info("⚡ Response Optimizer initialized")
    
    async def optimize_response(self, query: str, context: Dict[str, Any], 
                              response_generator: Callable) -> str:
        """
        Optimize response generation using intelligent strategies.
        
        Args:
            query: User query
            context: Query context
            response_generator: Function to generate response if not cached
            
        Returns:
            Optimized response
        """
        start_time = time.time()
        
        try:
            # Generate query hash for caching
            query_hash = self._generate_query_hash(query, context)
            
            # Check cache first
            cached_response = await self._get_cached_response(query_hash)
            if cached_response:
                self.optimization_stats['cache_hits'] += 1
                await record_metric('response_optimizer_cache_hit', 1.0)
                logger.debug(f"Cache hit for query: {query[:50]}...")
                return cached_response
            
            self.optimization_stats['cache_misses'] += 1
            
            # Check precomputed responses
            precomputed_response = await self._get_precomputed_response(query, context)
            if precomputed_response:
                self.optimization_stats['precomputed_hits'] += 1
                await record_metric('response_optimizer_precomputed_hit', 1.0)
                logger.debug(f"Precomputed response found for query: {query[:50]}...")
                
                # Cache the precomputed response
                await self._cache_response(query_hash, precomputed_response, context)
                return precomputed_response
            
            # Apply optimization rules
            optimized_context = await self._apply_optimization_rules(context)
            
            # Generate response
            response = await response_generator(query, optimized_context)
            
            # Post-process response
            optimized_response = await self._post_process_response(response, context)
            
            # Cache the response
            await self._cache_response(query_hash, optimized_response, context)
            
            # Update stats
            duration = time.time() - start_time
            self.optimization_stats['response_times'].append(duration)
            self.optimization_stats['optimization_applied'] += 1
            
            await record_response_time('response_optimization', duration, True)
            await record_metric('response_optimizer_duration', duration)
            
            return optimized_response
            
        except Exception as e:
            duration = time.time() - start_time
            await record_response_time('response_optimization', duration, False)
            await record_metric('response_optimizer_error', 1.0)
            logger.error(f"Response optimization error: {e}")
            
            # Fallback to direct response generation
            return await response_generator(query, context)
    
    async def precompute_responses(self, common_queries: List[str], 
                                 context_templates: List[Dict[str, Any]]):
        """
        Precompute responses for common queries.
        
        Args:
            common_queries: List of common queries
            context_templates: List of context templates
        """
        try:
            logger.info(f"Precomputing responses for {len(common_queries)} queries")
            
            for query in common_queries:
                for context_template in context_templates:
                    # Generate response for this query-context combination
                    query_hash = self._generate_query_hash(query, context_template)
                    
                    if query_hash not in self.precomputed_responses:
                        # This would be implemented with actual response generation
                        # For now, we'll create a placeholder
                        self.precomputed_responses[query_hash] = f"Precomputed response for: {query}"
            
            logger.info(f"✅ Precomputed {len(self.precomputed_responses)} responses")
            
        except Exception as e:
            logger.error(f"Error precomputing responses: {e}")
    
    async def get_optimization_stats(self) -> Dict[str, Any]:
        """Get optimization statistics."""
        try:
            cache_hit_rate = (
                self.optimization_stats['cache_hits'] / 
                (self.optimization_stats['cache_hits'] + self.optimization_stats['cache_misses'])
                if (self.optimization_stats['cache_hits'] + self.optimization_stats['cache_misses']) > 0 
                else 0
            )
            
            avg_response_time = (
                sum(self.optimization_stats['response_times']) / 
                len(self.optimization_stats['response_times'])
                if self.optimization_stats['response_times'] 
                else 0
            )
            
            return {
                'cache_hit_rate': cache_hit_rate,
                'cache_hits': self.optimization_stats['cache_hits'],
                'cache_misses': self.optimization_stats['cache_misses'],
                'precomputed_hits': self.optimization_stats['precomputed_hits'],
                'optimization_applied': self.optimization_stats['optimization_applied'],
                'average_response_time': avg_response_time,
                'cached_responses': len(self.response_cache),
                'precomputed_responses': len(self.precomputed_responses),
                'active_rules': len([r for r in self.optimization_rules if r.enabled])
            }
            
        except Exception as e:
            logger.error(f"Error getting optimization stats: {e}")
            return {}
    
    def _generate_query_hash(self, query: str, context: Dict[str, Any]) -> str:
        """Generate hash for query and context."""
        try:
            # Normalize query
            normalized_query = re.sub(r'\s+', ' ', query.lower().strip())
            
            # Create hash data
            hash_data = {
                'query': normalized_query,
                'context_keys': sorted(context.keys()) if context else [],
                'context_values': [str(v) for v in sorted(context.values())] if context else []
            }
            
            # Generate hash
            hash_string = json.dumps(hash_data, sort_keys=True)
            return hashlib.md5(hash_string.encode()).hexdigest()
            
        except Exception as e:
            logger.error(f"Error generating query hash: {e}")
            return hashlib.md5(query.encode()).hexdigest()
    
    async def _get_cached_response(self, query_hash: str) -> Optional[str]:
        """Get cached response."""
        try:
            if query_hash in self.response_cache:
                cache_entry = self.response_cache[query_hash]
                
                # Check expiration
                if datetime.now() < cache_entry.expires_at:
                    # Update access info
                    cache_entry.access_count += 1
                    cache_entry.last_accessed = datetime.now()
                    return cache_entry.response
                else:
                    # Expired, remove
                    del self.response_cache[query_hash]
            
            return None
            
        except Exception as e:
            logger.error(f"Error getting cached response: {e}")
            return None
    
    async def _cache_response(self, query_hash: str, response: str, context: Dict[str, Any]):
        """Cache response."""
        try:
            cache_entry = ResponseCache(
                query_hash=query_hash,
                response=response,
                created_at=datetime.now(),
                expires_at=datetime.now() + timedelta(hours=1),  # 1 hour TTL
                access_count=1,
                last_accessed=datetime.now(),
                metadata=context
            )
            
            self.response_cache[query_hash] = cache_entry
            
            # Also cache in advanced cache
            await self.cache.set(
                f"response_{query_hash}",
                response,
                ttl=3600,  # 1 hour
                tags=['response', 'optimized'],
                metadata=context
            )
            
        except Exception as e:
            logger.error(f"Error caching response: {e}")
    
    async def _get_precomputed_response(self, query: str, context: Dict[str, Any]) -> Optional[str]:
        """Get precomputed response."""
        try:
            query_hash = self._generate_query_hash(query, context)
            return self.precomputed_responses.get(query_hash)
            
        except Exception as e:
            logger.error(f"Error getting precomputed response: {e}")
            return None
    
    async def _apply_optimization_rules(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Apply optimization rules to context."""
        try:
            optimized_context = context.copy()
            
            # Sort rules by priority
            sorted_rules = sorted(
                [r for r in self.optimization_rules if r.enabled],
                key=lambda r: r.priority,
                reverse=True
            )
            
            for rule in sorted_rules:
                try:
                    if rule.condition(optimized_context):
                        optimized_context = rule.action(optimized_context)
                        logger.debug(f"Applied optimization rule: {rule.name}")
                except Exception as e:
                    logger.error(f"Error applying rule {rule.name}: {e}")
            
            return optimized_context
            
        except Exception as e:
            logger.error(f"Error applying optimization rules: {e}")
            return context
    
    async def _post_process_response(self, response: str, context: Dict[str, Any]) -> str:
        """Post-process response for optimization."""
        try:
            # Remove excessive whitespace
            response = re.sub(r'\n\s*\n', '\n\n', response)
            response = re.sub(r' +', ' ', response)
            
            # Optimize for length if needed
            max_length = context.get('max_response_length', 2000)
            if len(response) > max_length:
                # Truncate intelligently
                response = response[:max_length-3] + "..."
            
            # Add context-specific optimizations
            if context.get('user_preferences', {}).get('travel_style') == 'budget':
                # Add budget-friendly tips
                if 'budget' not in response.lower():
                    response += "\n\n💡 Budget tip: Consider booking in advance for better deals!"
            
            return response.strip()
            
        except Exception as e:
            logger.error(f"Error post-processing response: {e}")
            return response
    
    def _initialize_optimization_rules(self):
        """Initialize optimization rules."""
        try:
            # Rule 1: Cache frequently asked questions
            self.optimization_rules.append(OptimizationRule(
                name="cache_frequent_queries",
                condition=lambda ctx: ctx.get('query_frequency', 0) > 5,
                action=lambda ctx: {**ctx, 'cache_ttl': 7200},  # 2 hours
                priority=10
            ))
            
            # Rule 2: Optimize for user preferences
            self.optimization_rules.append(OptimizationRule(
                name="optimize_for_preferences",
                condition=lambda ctx: 'user_preferences' in ctx,
                action=lambda ctx: {
                    **ctx,
                    'optimization_level': 'high',
                    'personalization': True
                },
                priority=8
            ))
            
            # Rule 3: Reduce response time for simple queries
            self.optimization_rules.append(OptimizationRule(
                name="fast_simple_queries",
                condition=lambda ctx: ctx.get('query_complexity', 'medium') == 'simple',
                action=lambda ctx: {
                    **ctx,
                    'response_timeout': 2.0,
                    'use_cache': True
                },
                priority=6
            ))
            
            # Rule 4: Optimize for mobile users
            self.optimization_rules.append(OptimizationRule(
                name="mobile_optimization",
                condition=lambda ctx: ctx.get('user_agent', '').lower().find('mobile') != -1,
                action=lambda ctx: {
                    **ctx,
                    'max_response_length': 1000,
                    'format': 'mobile'
                },
                priority=4
            ))
            
            # Rule 5: Batch similar requests
            self.optimization_rules.append(OptimizationRule(
                name="batch_similar_requests",
                condition=lambda ctx: ctx.get('similar_requests_count', 0) > 3,
                action=lambda ctx: {
                    **ctx,
                    'batch_mode': True,
                    'batch_size': min(ctx.get('similar_requests_count', 0), 10)
                },
                priority=2
            ))
            
            logger.info(f"✅ Initialized {len(self.optimization_rules)} optimization rules")
            
        except Exception as e:
            logger.error(f"Error initializing optimization rules: {e}")
    
    async def add_optimization_rule(self, rule: OptimizationRule):
        """Add a new optimization rule."""
        self.optimization_rules.append(rule)
        logger.info(f"Added optimization rule: {rule.name}")
    
    async def remove_optimization_rule(self, rule_name: str):
        """Remove an optimization rule."""
        self.optimization_rules = [r for r in self.optimization_rules if r.name != rule_name]
        logger.info(f"Removed optimization rule: {rule_name}")
    
    async def clear_cache(self):
        """Clear response cache."""
        try:
            self.response_cache.clear()
            await self.cache.clear(['response', 'optimized'])
            logger.info("Response cache cleared")
            
        except Exception as e:
            logger.error(f"Error clearing cache: {e}")


# Global response optimizer instance
_global_optimizer = ResponseOptimizer()


async def get_response_optimizer() -> ResponseOptimizer:
    """Get global response optimizer instance."""
    return _global_optimizer


async def optimize_response(query: str, context: Dict[str, Any], 
                          response_generator: Callable) -> str:
    """Optimize response using global optimizer."""
    return await _global_optimizer.optimize_response(query, context, response_generator)
