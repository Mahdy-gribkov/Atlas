/**
 * Destination Search Component
 * 
 * Provides comprehensive destination discovery for Atlas travel agent.
 * Implements advanced search, filtering, and destination recommendations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Destination Search Variants
const destinationSearchVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'destination-search-mode-standard',
        'enhanced': 'destination-search-mode-enhanced',
        'advanced': 'destination-search-mode-advanced',
        'custom': 'destination-search-mode-custom'
      },
      type: {
        'popular': 'destination-type-popular',
        'trending': 'destination-type-trending',
        'seasonal': 'destination-type-seasonal',
        'budget': 'destination-type-budget',
        'mixed': 'destination-type-mixed'
      },
      style: {
        'minimal': 'destination-style-minimal',
        'moderate': 'destination-style-moderate',
        'detailed': 'destination-style-detailed',
        'custom': 'destination-style-custom'
      },
      format: {
        'text': 'destination-format-text',
        'visual': 'destination-format-visual',
        'interactive': 'destination-format-interactive',
        'mixed': 'destination-format-mixed'
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

// Destination Search Props
interface DestinationSearchProps extends VariantProps<typeof destinationSearchVariants> {
  className?: string;
  onDestinationSelect?: (destination: DestinationData) => void;
  initialSearch?: Partial<DestinationSearchData>;
  showFilters?: boolean;
  showTrending?: boolean;
  showSeasonal?: boolean;
  showBudget?: boolean;
}

// Destination Search Data Interface
interface DestinationSearchData {
  id: string;
  query: string;
  filters: DestinationFilters;
  results: DestinationData[];
  trending: DestinationData[];
  seasonal: DestinationData[];
  budget: DestinationData[];
  popular: DestinationData[];
  searchHistory: string[];
  favorites: DestinationData[];
  createdAt: Date;
  updatedAt: Date;
}

// Destination Data Interface
interface DestinationData {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  highlights: string[];
  images: DestinationImage[];
  weather: WeatherInfo;
  bestTimeToVisit: string[];
  averageCost: {
    budget: number;
    midRange: number;
    luxury: number;
    currency: string;
  };
  activities: ActivityPreview[];
  accommodations: AccommodationPreview[];
  transportation: TransportationInfo;
  culture: CultureInfo;
  safety: SafetyInfo;
  visa: VisaInfo;
  rating: number;
  reviewCount: number;
  tags: string[];
  isPopular: boolean;
  isTrending: boolean;
  isSeasonal: boolean;
  isBudgetFriendly: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Destination Image Interface
interface DestinationImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  photographer: string;
  isMain: boolean;
}

// Weather Info Interface
interface WeatherInfo {
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: {
    date: Date;
    high: number;
    low: number;
    condition: string;
    precipitation: number;
  }[];
  bestMonths: string[];
  climate: string;
}

// Activity Preview Interface
interface ActivityPreview {
  id: string;
  name: string;
  type: 'attraction' | 'adventure' | 'culture' | 'nature' | 'food' | 'shopping';
  duration: string;
  cost: number;
  rating: number;
  image: string;
}

// Accommodation Preview Interface
interface AccommodationPreview {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'guesthouse';
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  rating: number;
  image: string;
}

// Transportation Info Interface
interface TransportationInfo {
  airports: {
    name: string;
    code: string;
    distance: number;
  }[];
  publicTransport: string[];
  carRental: boolean;
  taxi: boolean;
  bikeSharing: boolean;
}

// Culture Info Interface
interface CultureInfo {
  language: string[];
  currency: string;
  timezone: string;
  customs: string[];
  festivals: string[];
  cuisine: string[];
}

// Safety Info Interface
interface SafetyInfo {
  level: 'very-safe' | 'safe' | 'moderate' | 'caution' | 'avoid';
  advisories: string[];
  emergencyNumbers: string[];
  healthRecommendations: string[];
}

// Visa Info Interface
interface VisaInfo {
  required: boolean;
  type: 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required';
  duration: string;
  cost: number;
  processingTime: string;
}

// Destination Filters Interface
interface DestinationFilters {
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  weather: string[];
  activities: string[];
  duration: {
    min: number;
    max: number;
  };
  season: string[];
  rating: number;
  visaRequired: boolean;
  safety: string[];
}

// Destination Search Component
export const DestinationSearch = React.forwardRef<HTMLDivElement, DestinationSearchProps>(
  ({ 
    className, 
    onDestinationSelect,
    initialSearch,
    showFilters = true,
    showTrending = true,
    showSeasonal = true,
    showBudget = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [search, setSearch] = useState<DestinationSearchData>(
      initialSearch || {
        id: '',
        query: '',
        filters: {
          budget: { min: 0, max: 10000, currency: 'USD' },
          weather: [],
          activities: [],
          duration: { min: 1, max: 30 },
          season: [],
          rating: 0,
          visaRequired: false,
          safety: []
        },
        results: [],
        trending: [],
        seasonal: [],
        budget: [],
        popular: [],
        searchHistory: [],
        favorites: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterPanel, setShowFilterPanel] = useState(false);

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'trending', name: 'Trending', icon: '📈' },
      { id: 'seasonal', name: 'Seasonal', icon: '🌍' },
      { id: 'budget', name: 'Budget', icon: '💰' },
      { id: 'popular', name: 'Popular', icon: '⭐' }
    ];

    const activityTypes = [
      { id: 'attraction', name: 'Attractions', icon: '🏛️' },
      { id: 'adventure', name: 'Adventure', icon: '🏔️' },
      { id: 'culture', name: 'Culture', icon: '🎭' },
      { id: 'nature', name: 'Nature', icon: '🌿' },
      { id: 'food', name: 'Food', icon: '🍽️' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️' }
    ];

    const seasons = [
      { id: 'spring', name: 'Spring', icon: '🌸' },
      { id: 'summer', name: 'Summer', icon: '☀️' },
      { id: 'autumn', name: 'Autumn', icon: '🍂' },
      { id: 'winter', name: 'Winter', icon: '❄️' }
    ];

    const updateSearch = useCallback((path: string, value: any) => {
      setSearch(prev => {
        const newSearch = { ...prev };
        const keys = path.split('.');
        let current: any = newSearch;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newSearch.updatedAt = new Date();
        return newSearch;
      });
    }, []);

    const searchDestinations = useCallback(async (query: string) => {
      if (!query.trim()) return;
      
      setIsSearching(true);
      updateSearch('query', query);
      
      // Simulate search API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults: DestinationData[] = [
        {
          id: 'dest-1',
          name: 'Paris',
          country: 'France',
          region: 'Île-de-France',
          coordinates: { lat: 48.8566, lng: 2.3522 },
          description: 'The City of Light, known for its art, fashion, and romantic atmosphere.',
          highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Champs-Élysées'],
          images: [
            {
              id: 'img-1',
              url: '/images/paris-main.jpg',
              thumbnail: '/images/paris-thumb.jpg',
              caption: 'Eiffel Tower at sunset',
              photographer: 'John Doe',
              isMain: true
            }
          ],
          weather: {
            current: { temperature: 15, condition: 'Partly Cloudy', humidity: 65, windSpeed: 12 },
            forecast: [],
            bestMonths: ['April', 'May', 'September', 'October'],
            climate: 'Temperate'
          },
          bestTimeToVisit: ['April-June', 'September-November'],
          averageCost: { budget: 80, midRange: 150, luxury: 300, currency: 'USD' },
          activities: [
            { id: 'act-1', name: 'Eiffel Tower', type: 'attraction', duration: '2-3 hours', cost: 25, rating: 4.5, image: '/images/eiffel.jpg' },
            { id: 'act-2', name: 'Louvre Museum', type: 'culture', duration: 'Half day', cost: 17, rating: 4.7, image: '/images/louvre.jpg' }
          ],
          accommodations: [
            { id: 'acc-1', name: 'Hotel Plaza Athénée', type: 'hotel', priceRange: { min: 500, max: 800, currency: 'USD' }, rating: 4.8, image: '/images/hotel.jpg' }
          ],
          transportation: {
            airports: [{ name: 'Charles de Gaulle', code: 'CDG', distance: 25 }],
            publicTransport: ['Metro', 'Bus', 'RER'],
            carRental: true,
            taxi: true,
            bikeSharing: true
          },
          culture: {
            language: ['French'],
            currency: 'EUR',
            timezone: 'CET',
            customs: ['Greet with cheek kisses', 'Dress elegantly'],
            festivals: ['Bastille Day', 'Fashion Week'],
            cuisine: ['French', 'Pastries', 'Wine']
          },
          safety: {
            level: 'safe',
            advisories: [],
            emergencyNumbers: ['112'],
            healthRecommendations: ['Travel insurance recommended']
          },
          visa: {
            required: false,
            type: 'visa-free',
            duration: '90 days',
            cost: 0,
            processingTime: 'N/A'
          },
          rating: 4.6,
          reviewCount: 12543,
          tags: ['romantic', 'culture', 'art', 'fashion'],
          isPopular: true,
          isTrending: true,
          isSeasonal: false,
          isBudgetFriendly: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateSearch('results', mockResults);
      setIsSearching(false);
    }, [updateSearch]);

    const addToFavorites = useCallback((destination: DestinationData) => {
      const isAlreadyFavorite = search.favorites.some(fav => fav.id === destination.id);
      if (!isAlreadyFavorite) {
        updateSearch('favorites', [...search.favorites, destination]);
      }
    }, [search.favorites, updateSearch]);

    const removeFromFavorites = useCallback((destinationId: string) => {
      const updatedFavorites = search.favorites.filter(fav => fav.id !== destinationId);
      updateSearch('favorites', updatedFavorites);
    }, [search.favorites, updateSearch]);

    const getSafetyColor = (level: SafetyInfo['level']) => {
      switch (level) {
        case 'very-safe': return 'text-green-600 dark:text-green-400';
        case 'safe': return 'text-green-500 dark:text-green-400';
        case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
        case 'caution': return 'text-orange-600 dark:text-orange-400';
        case 'avoid': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getSafetyIcon = (level: SafetyInfo['level']) => {
      switch (level) {
        case 'very-safe': return '🟢';
        case 'safe': return '🟢';
        case 'moderate': return '🟡';
        case 'caution': return '🟠';
        case 'avoid': return '🔴';
        default: return '⚪';
      }
    };

    const formatCost = (cost: number, currency: string) => {
      return `${currency} ${cost}`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          destinationSearchVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Destination Search
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover amazing places to visit
            </p>
          </div>
          <div className="flex gap-2">
            {showFilters && (
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                🔍 Filters
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchDestinations(searchQuery)}
            placeholder="Search destinations..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
          />
          <button
            onClick={() => searchDestinations(searchQuery)}
            disabled={isSearching}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSearching ? '🔍' : 'Search'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilterPanel && showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Filters
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={search.filters.budget.min}
                    onChange={(e) => updateSearch('filters.budget.min', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={search.filters.budget.max}
                    onChange={(e) => updateSearch('filters.budget.max', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Activities
                </label>
                <div className="flex flex-wrap gap-2">
                  {activityTypes.map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => {
                        const currentActivities = search.filters.activities;
                        const newActivities = currentActivities.includes(activity.id)
                          ? currentActivities.filter(a => a !== activity.id)
                          : [...currentActivities, activity.id];
                        updateSearch('filters.activities', newActivities);
                      }}
                      className={cn(
                        'px-3 py-1 text-xs rounded-md transition-colors duration-200',
                        search.filters.activities.includes(activity.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {activity.icon} {activity.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Season
                </label>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((season) => (
                    <button
                      key={season.id}
                      onClick={() => {
                        const currentSeasons = search.filters.season;
                        const newSeasons = currentSeasons.includes(season.id)
                          ? currentSeasons.filter(s => s !== season.id)
                          : [...currentSeasons, season.id];
                        updateSearch('filters.season', newSeasons);
                      }}
                      className={cn(
                        'px-3 py-1 text-xs rounded-md transition-colors duration-200',
                        search.filters.season.includes(season.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {season.icon} {season.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'search' && (
            <div className="space-y-4">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Searching destinations...</p>
                </div>
              ) : search.results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {search.results.map((destination) => (
                    <div
                      key={destination.id}
                      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => onDestinationSelect?.(destination)}
                    >
                      {destination.images[0] && (
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                          <img
                            src={destination.images[0].thumbnail}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {destination.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {destination.country}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {destination.rating}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {destination.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={cn('flex items-center gap-1', getSafetyColor(destination.safety.level))}>
                              {getSafetyIcon(destination.safety.level)}
                              <span className="capitalize">{destination.safety.level.replace('-', ' ')}</span>
                            </span>
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            From {formatCost(destination.averageCost.budget, destination.averageCost.currency)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex gap-1">
                            {destination.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const isFavorite = search.favorites.some(fav => fav.id === destination.id);
                              if (isFavorite) {
                                removeFromFavorites(destination.id);
                              } else {
                                addToFavorites(destination);
                              }
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                          >
                            {search.favorites.some(fav => fav.id === destination.id) ? '❤️' : '🤍'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🌍</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No destinations found
                  </h3>
                  <p>Try searching for a destination or adjusting your filters</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'trending' && showTrending && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Trending Destinations
              </h3>
              <p>Discover what's popular right now</p>
            </div>
          )}

          {activeTab === 'seasonal' && showSeasonal && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Seasonal Destinations
              </h3>
              <p>Find the best places to visit this season</p>
            </div>
          )}

          {activeTab === 'budget' && showBudget && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Budget-Friendly Destinations
              </h3>
              <p>Explore amazing places without breaking the bank</p>
            </div>
          )}

          {activeTab === 'popular' && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Popular Destinations
              </h3>
              <p>Discover the most loved travel destinations</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

DestinationSearch.displayName = 'DestinationSearch';

// Destination Search Demo Component
interface DestinationSearchDemoProps {
  className?: string;
  showControls?: boolean;
}

export const DestinationSearchDemo = React.forwardRef<HTMLDivElement, DestinationSearchDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [search, setSearch] = useState<Partial<DestinationSearchData>>({});

    const handleDestinationSelect = (destination: DestinationData) => {
      console.log('Destination selected:', destination);
    };

    const mockSearch: Partial<DestinationSearchData> = {
      id: 'search-1',
      query: '',
      filters: {
        budget: { min: 0, max: 5000, currency: 'USD' },
        weather: [],
        activities: [],
        duration: { min: 1, max: 14 },
        season: [],
        rating: 0,
        visaRequired: false,
        safety: []
      },
      results: [],
      trending: [],
      seasonal: [],
      budget: [],
      popular: [],
      searchHistory: [],
      favorites: [],
      createdAt: new Date(),
      updatedAt: new Date()
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
          Destination Search Demo
        </h3>
        
        <DestinationSearch
          onDestinationSelect={handleDestinationSelect}
          initialSearch={mockSearch}
          showFilters={true}
          showTrending={true}
          showSeasonal={true}
          showBudget={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced destination discovery with search, filtering, trending destinations, and comprehensive destination information.
            </p>
          </div>
        )}
      </div>
    );
  }
);

DestinationSearchDemo.displayName = 'DestinationSearchDemo';

// Export all components
export {
  destinationSearchVariants,
  type DestinationSearchProps,
  type DestinationSearchData,
  type DestinationData,
  type DestinationImage,
  type WeatherInfo,
  type ActivityPreview,
  type AccommodationPreview,
  type TransportationInfo,
  type CultureInfo,
  type SafetyInfo,
  type VisaInfo,
  type DestinationFilters,
  type DestinationSearchDemoProps
};
