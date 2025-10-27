/**
 * Search Component
 * 
 * Provides comprehensive search functionality for Atlas travel agent.
 * Implements advanced search features with filters, suggestions, and results.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Search Variants
const searchVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'search-mode-standard',
        'enhanced': 'search-mode-enhanced',
        'advanced': 'search-mode-advanced',
        'custom': 'search-mode-custom'
      },
      type: {
        'destination': 'search-type-destination',
        'activity': 'search-type-activity',
        'accommodation': 'search-type-accommodation',
        'flight': 'search-type-flight',
        'mixed': 'search-type-mixed'
      },
      style: {
        'minimal': 'search-style-minimal',
        'moderate': 'search-style-moderate',
        'detailed': 'search-style-detailed',
        'custom': 'search-style-custom'
      },
      format: {
        'text': 'search-format-text',
        'visual': 'search-format-visual',
        'interactive': 'search-format-interactive',
        'mixed': 'search-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Search Props
interface SearchProps extends VariantProps<typeof searchVariants> {
  className?: string;
  onSearch?: (query: SearchQuery) => void;
  onSuggestionClick?: (suggestion: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  showSuggestions?: boolean;
  showRecent?: boolean;
  showTrending?: boolean;
  maxSuggestions?: number;
  debounceDelay?: number;
}

// Search Query Interface
interface SearchQuery {
  query: string;
  type: 'destination' | 'activity' | 'accommodation' | 'flight' | 'all';
  filters: {
    priceRange?: [number, number];
    rating?: number;
    location?: string;
    dateRange?: [Date, Date];
    category?: string[];
    amenities?: string[];
  };
  sortBy?: 'relevance' | 'price' | 'rating' | 'distance' | 'popularity';
  limit?: number;
}

// Search Result Interface
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  image?: string;
  price?: number;
  rating?: number;
  location?: string;
  distance?: number;
  category?: string[];
  amenities?: string[];
  availability?: boolean;
}

// Search Component
export const Search = React.forwardRef<HTMLDivElement, SearchProps>(
  ({ 
    className, 
    onSearch,
    onSuggestionClick,
    placeholder = "Search destinations, activities, hotels...",
    showFilters = true,
    showSuggestions = true,
    showRecent = true,
    showTrending = true,
    maxSuggestions = 8,
    debounceDelay = 300,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showSuggestionsList, setShowSuggestionsList] = useState(false);
    const [filters, setFilters] = useState<SearchQuery['filters']>({});
    const [searchType, setSearchType] = useState<SearchQuery['type']>('all');
    
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Mock data for suggestions
    const mockSuggestions = [
      'Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK',
      'Rome, Italy', 'Barcelona, Spain', 'Amsterdam, Netherlands',
      'Santorini, Greece', 'Bali, Indonesia', 'Dubai, UAE',
      'Machu Picchu, Peru', 'Great Wall, China', 'Eiffel Tower',
      'Colosseum, Rome', 'Louvre Museum', 'Times Square',
      'Buckingham Palace', 'Sagrada Familia', 'Anne Frank House',
      'Hotels in Paris', 'Flights to Tokyo', 'Activities in NYC'
    ];

    const mockTrending = [
      'Spring destinations 2024', 'Budget travel Europe',
      'Solo travel tips', 'Family vacation ideas',
      'Digital nomad destinations', 'Sustainable travel',
      'Weekend getaways', 'Adventure travel'
    ];

    const searchTypes = [
      { id: 'all', name: 'All', icon: '🔍' },
      { id: 'destination', name: 'Destinations', icon: '🗺️' },
      { id: 'activity', name: 'Activities', icon: '🎯' },
      { id: 'accommodation', name: 'Hotels', icon: '🏨' },
      { id: 'flight', name: 'Flights', icon: '✈️' }
    ];

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      
      debounceRef.current = setTimeout(() => {
        if (value.trim()) {
          // Filter suggestions based on query
          const filteredSuggestions = mockSuggestions
            .filter(suggestion => 
              suggestion.toLowerCase().includes(value.toLowerCase())
            )
            .slice(0, maxSuggestions);
          setSuggestions(filteredSuggestions);
          setShowSuggestionsList(true);
        } else {
          setSuggestions([]);
          setShowSuggestionsList(false);
        }
      }, debounceDelay);
    }, [maxSuggestions, debounceDelay]);

    const handleSearch = useCallback(() => {
      if (!query.trim()) return;
      
      setIsSearching(true);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const newRecent = [query, ...prev.filter(item => item !== query)].slice(0, 5);
        localStorage.setItem('atlas-recent-searches', JSON.stringify(newRecent));
        return newRecent;
      });
      
      const searchQuery: SearchQuery = {
        query: query.trim(),
        type: searchType,
        filters,
        sortBy: 'relevance',
        limit: 20
      };
      
      onSearch?.(searchQuery);
      
      setTimeout(() => {
        setIsSearching(false);
        setShowSuggestionsList(false);
      }, 1000);
    }, [query, searchType, filters, onSearch]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      } else if (e.key === 'Escape') {
        setShowSuggestionsList(false);
      }
    }, [handleSearch]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
      setQuery(suggestion);
      setShowSuggestionsList(false);
      onSuggestionClick?.(suggestion);
    }, [onSuggestionClick]);

    const handleFilterChange = useCallback((key: string, value: any) => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }));
    }, []);

    // Load recent searches from localStorage
    useEffect(() => {
      const saved = localStorage.getItem('atlas-recent-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading recent searches:', error);
        }
      }
    }, []);

    // Focus input on mount
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          searchVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Search Input */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestionsList(true)}
                placeholder={placeholder}
                className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSearching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  '🔍'
                )}
              </button>
            </div>
          </div>

          {/* Search Type Selector */}
          <div className="flex gap-1 mt-2">
            {searchTypes.map((searchTypeItem) => (
              <button
                key={searchTypeItem.id}
                onClick={() => setSearchType(searchTypeItem.id as SearchQuery['type'])}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors duration-200',
                  searchType === searchTypeItem.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                <span>{searchTypeItem.icon}</span>
                <span>{searchTypeItem.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              Filters
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                    onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange?.[1] || 1000])}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                    onChange={(e) => handleFilterChange('priceRange', [filters.priceRange?.[0] || 0, parseInt(e.target.value) || 1000])}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Rating
                </label>
                <select
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                >
                  <option value="">Any rating</option>
                  <option value="3">3+ stars</option>
                  <option value="4">4+ stars</option>
                  <option value="5">5 stars</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, Country"
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Suggestions */}
        {showSuggestions && showSuggestionsList && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {/* Recent Searches */}
            {showRecent && recentSearches.length > 0 && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Recent Searches
                </h5>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full text-left p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <span className="mr-2">🕒</span>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {showTrending && query === '' && (
              <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Trending Searches
                </h5>
                <div className="space-y-1">
                  {mockTrending.slice(0, 4).map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(trend)}
                      className="w-full text-left p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <span className="mr-2">🔥</span>
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3">
                <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Suggestions
                </h5>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                    >
                      <span className="mr-2">💡</span>
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {query && suggestions.length === 0 && (
              <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                <div className="text-2xl mb-2">🔍</div>
                <p className="text-sm">No suggestions found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Search.displayName = 'Search';

// Search Results Props
interface SearchResultsProps {
  className?: string;
  results: SearchResult[];
  isLoading?: boolean;
  onResultClick?: (result: SearchResult) => void;
  onLoadMore?: () => void;
  showFilters?: boolean;
  showSort?: boolean;
}

// Search Results Component
export const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(
  ({ 
    className, 
    results,
    isLoading = false,
    onResultClick,
    onLoadMore,
    showFilters = true,
    showSort = true,
    ...props 
  }, ref) => {
    const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'rating' | 'distance' | 'popularity'>('relevance');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const sortedResults = React.useMemo(() => {
      return [...results].sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return (a.price || 0) - (b.price || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'distance':
            return (a.distance || 0) - (b.distance || 0);
          case 'popularity':
            return Math.random() - 0.5; // Mock popularity
          default:
            return 0; // Relevance - keep original order
        }
      });
    }, [results, sortBy]);

    if (isLoading) {
      return (
        <div
          ref={ref}
          className={cn(
            'space-y-4',
            className
          )}
          {...props}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded-md mb-3" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          className
        )}
        {...props}
      >
        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Search Results
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {results.length} results found
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {showSort && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>
            )}
            
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors duration-200',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No results found
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </div>
        ) : (
          <div className={cn(
            'space-y-4',
            viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'
          )}>
            {sortedResults.map((result) => (
              <div
                key={result.id}
                onClick={() => onResultClick?.(result)}
                className={cn(
                  'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer',
                  viewMode === 'list' ? 'flex' : 'block'
                )}
              >
                {result.image && (
                  <div className={cn(
                    'bg-gray-200 dark:bg-gray-700',
                    viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48 w-full'
                  )}>
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4 flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      {result.title}
                    </h4>
                    {result.price && (
                      <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${result.price}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {result.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    {result.rating && (
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{result.rating}</span>
                      </div>
                    )}
                    {result.location && (
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{result.location}</span>
                      </div>
                    )}
                    {result.distance && (
                      <div className="flex items-center gap-1">
                        <span>📏</span>
                        <span>{result.distance}km</span>
                      </div>
                    )}
                  </div>
                  
                  {result.category && result.category.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.category.slice(0, 3).map((cat, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 rounded-md"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {onLoadMore && (
          <div className="text-center">
            <button
              onClick={onLoadMore}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Load More Results
            </button>
          </div>
        )}
      </div>
    );
  }
);

SearchResults.displayName = 'SearchResults';

// Search Demo Component
interface SearchDemoProps {
  className?: string;
  showControls?: boolean;
}

export const SearchDemo = React.forwardRef<HTMLDivElement, SearchDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [searchQuery, setSearchQuery] = useState<SearchQuery | null>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Eiffel Tower',
        description: 'Iconic iron lattice tower in Paris, France',
        type: 'attraction',
        image: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Eiffel+Tower',
        price: 25,
        rating: 4.5,
        location: 'Paris, France',
        distance: 2.5,
        category: ['Landmark', 'Architecture'],
        availability: true
      },
      {
        id: '2',
        title: 'Louvre Museum',
        description: 'World\'s largest art museum and historic monument',
        type: 'attraction',
        image: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Louvre',
        price: 17,
        rating: 4.7,
        location: 'Paris, France',
        distance: 1.8,
        category: ['Museum', 'Art'],
        availability: true
      },
      {
        id: '3',
        title: 'Hotel Plaza Athénée',
        description: 'Luxury hotel in the heart of Paris',
        type: 'accommodation',
        image: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Hotel',
        price: 800,
        rating: 4.8,
        location: 'Paris, France',
        distance: 0.5,
        category: ['Luxury', 'Hotel'],
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
        availability: true
      }
    ];

    const handleSearch = (query: SearchQuery) => {
      setSearchQuery(query);
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setResults(mockResults);
        setIsLoading(false);
      }, 1000);
    };

    const handleResultClick = (result: SearchResult) => {
      console.log('Result clicked:', result);
    };

    const handleLoadMore = () => {
      console.log('Load more results');
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Search Demo
        </h3>
        
        <Search
          onSearch={handleSearch}
          onSuggestionClick={(suggestion) => console.log('Suggestion clicked:', suggestion)}
          placeholder="Search destinations, activities, hotels..."
          showFilters={true}
          showSuggestions={true}
          showRecent={true}
          showTrending={true}
          maxSuggestions={8}
          debounceDelay={300}
        />
        
        {searchQuery && (
          <SearchResults
            results={results}
            isLoading={isLoading}
            onResultClick={handleResultClick}
            onLoadMore={handleLoadMore}
            showFilters={true}
            showSort={true}
          />
        )}
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced search functionality with filters, suggestions, recent searches, and trending topics.
            </p>
          </div>
        )}
      </div>
    );
  }
);

SearchDemo.displayName = 'SearchDemo';

// Export all components
export {
  searchVariants,
  type SearchProps,
  type SearchQuery,
  type SearchResult,
  type SearchResultsProps,
  type SearchDemoProps
};
