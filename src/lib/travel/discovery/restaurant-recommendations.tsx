/**
 * Restaurant Recommendations Component
 * 
 * Provides comprehensive restaurant recommendations for Atlas travel agent.
 * Implements local dining, food experiences, and restaurant discovery.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Restaurant Recommendations Variants
const restaurantRecommendationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'restaurant-recommendations-mode-standard',
        'enhanced': 'restaurant-recommendations-mode-enhanced',
        'advanced': 'restaurant-recommendations-mode-advanced',
        'custom': 'restaurant-recommendations-mode-custom'
      },
      type: {
        'fine-dining': 'restaurant-type-fine-dining',
        'casual': 'restaurant-type-casual',
        'street-food': 'restaurant-type-street-food',
        'local': 'restaurant-type-local',
        'mixed': 'restaurant-type-mixed'
      },
      style: {
        'minimal': 'restaurant-style-minimal',
        'moderate': 'restaurant-style-moderate',
        'detailed': 'restaurant-style-detailed',
        'custom': 'restaurant-style-custom'
      },
      format: {
        'text': 'restaurant-format-text',
        'visual': 'restaurant-format-visual',
        'interactive': 'restaurant-format-interactive',
        'mixed': 'restaurant-format-mixed'
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

// Restaurant Recommendations Props
interface RestaurantRecommendationsProps extends VariantProps<typeof restaurantRecommendationsVariants> {
  className?: string;
  onRestaurantSelect?: (restaurant: RestaurantData) => void;
  initialRecommendations?: Partial<RestaurantRecommendationsData>;
  showFilters?: boolean;
  showReviews?: boolean;
  showReservations?: boolean;
  showDelivery?: boolean;
}

// Restaurant Recommendations Data Interface
interface RestaurantRecommendationsData {
  id: string;
  destination: string;
  recommendations: RestaurantData[];
  nearby: RestaurantData[];
  popular: RestaurantData[];
  trending: RestaurantData[];
  categories: RestaurantCategory[];
  filters: RestaurantFilters;
  preferences: RestaurantPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant Data Interface
interface RestaurantData {
  id: string;
  name: string;
  type: 'fine-dining' | 'casual' | 'street-food' | 'cafe' | 'bar' | 'fast-food' | 'buffet';
  cuisine: string[];
  description: string;
  address: {
    street: string;
    city: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    neighborhood: string;
  };
  images: RestaurantImage[];
  pricing: {
    range: '$' | '$$' | '$$$' | '$$$$';
    averagePrice: number;
    currency: string;
    description: string;
  };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contact: {
    phone: string;
    website?: string;
    email?: string;
  };
  amenities: {
    general: string[];
    dining: string[];
    accessibility: string[];
  };
  menu: MenuSection[];
  specialFeatures: string[];
  rating: number;
  reviewCount: number;
  reviews: RestaurantReview[];
  reservations: {
    required: boolean;
    url?: string;
    phone?: string;
    instantBooking: boolean;
    partySize: {
      min: number;
      max: number;
    };
  };
  delivery: {
    available: boolean;
    providers: string[];
    estimatedTime: number;
    minimumOrder: number;
  };
  distance: {
    fromUser: number;
    fromAttractions: number[];
  };
  tags: string[];
  isRecommended: boolean;
  recommendationScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant Image Interface
interface RestaurantImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'exterior' | 'interior' | 'food' | 'menu' | 'atmosphere';
  isMain: boolean;
}

// Menu Section Interface
interface MenuSection {
  id: string;
  name: string;
  items: MenuItem[];
}

// Menu Item Interface
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  allergens: string[];
  dietary: string[];
}

// Restaurant Review Interface
interface RestaurantReview {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  photos: string[];
  categories: {
    food: number;
    service: number;
    atmosphere: number;
    value: number;
  };
}

// Restaurant Category Interface
interface RestaurantCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Restaurant Filters Interface
interface RestaurantFilters {
  type: string[];
  cuisine: string[];
  priceRange: string[];
  rating: number;
  distance: number;
  amenities: string[];
  reservations: boolean;
  delivery: boolean;
  openNow: boolean;
}

// Restaurant Preferences Interface
interface RestaurantPreferences {
  cuisine: string[];
  priceRange: string[];
  atmosphere: string[];
  dietary: string[];
  groupSize: number;
  occasion: string[];
}

// Restaurant Recommendations Component
export const RestaurantRecommendations = React.forwardRef<HTMLDivElement, RestaurantRecommendationsProps>(
  ({ 
    className, 
    onRestaurantSelect,
    initialRecommendations,
    showFilters = true,
    showReviews = true,
    showReservations = true,
    showDelivery = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [recommendations, setRecommendations] = useState<RestaurantRecommendationsData>(
      initialRecommendations || {
        id: '',
        destination: '',
        recommendations: [],
        nearby: [],
        popular: [],
        trending: [],
        categories: [],
        filters: {
          type: [],
          cuisine: [],
          priceRange: [],
          rating: 0,
          distance: 10,
          amenities: [],
          reservations: false,
          delivery: false,
          openNow: false
        },
        preferences: {
          cuisine: [],
          priceRange: [],
          atmosphere: [],
          dietary: [],
          groupSize: 2,
          occasion: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('recommendations');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState<string>('');

    const tabs = [
      { id: 'recommendations', name: 'For You', icon: '🎯' },
      { id: 'nearby', name: 'Nearby', icon: '📍' },
      { id: 'popular', name: 'Popular', icon: '⭐' },
      { id: 'trending', name: 'Trending', icon: '📈' }
    ];

    const restaurantTypes = [
      { id: 'fine-dining', name: 'Fine Dining', icon: '🍽️', color: 'purple' },
      { id: 'casual', name: 'Casual', icon: '🍴', color: 'blue' },
      { id: 'street-food', name: 'Street Food', icon: '🌮', color: 'orange' },
      { id: 'cafe', name: 'Café', icon: '☕', color: 'brown' },
      { id: 'bar', name: 'Bar', icon: '🍸', color: 'green' },
      { id: 'fast-food', name: 'Fast Food', icon: '🍔', color: 'red' },
      { id: 'buffet', name: 'Buffet', icon: '🥘', color: 'yellow' }
    ];

    const cuisines = [
      { id: 'french', name: 'French', icon: '🥐' },
      { id: 'italian', name: 'Italian', icon: '🍝' },
      { id: 'japanese', name: 'Japanese', icon: '🍣' },
      { id: 'chinese', name: 'Chinese', icon: '🥢' },
      { id: 'indian', name: 'Indian', icon: '🍛' },
      { id: 'mexican', name: 'Mexican', icon: '🌮' },
      { id: 'thai', name: 'Thai', icon: '🍜' },
      { id: 'mediterranean', name: 'Mediterranean', icon: '🥗' },
      { id: 'american', name: 'American', icon: '🍔' },
      { id: 'seafood', name: 'Seafood', icon: '🐟' }
    ];

    const priceRanges = [
      { id: '$', name: 'Budget', icon: '💰' },
      { id: '$$', name: 'Moderate', icon: '💵' },
      { id: '$$$', name: 'Expensive', icon: '💎' },
      { id: '$$$$', name: 'Very Expensive', icon: '👑' }
    ];

    const updateRecommendations = useCallback((path: string, value: any) => {
      setRecommendations(prev => {
        const newRecommendations = { ...prev };
        const keys = path.split('.');
        let current: any = newRecommendations;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newRecommendations.updatedAt = new Date();
        return newRecommendations;
      });
    }, []);

    const loadRecommendations = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRestaurants: RestaurantData[] = [
        {
          id: 'rest-1',
          name: 'L\'Ambroisie',
          type: 'fine-dining',
          cuisine: ['french'],
          description: 'Three-Michelin-starred restaurant offering exceptional French cuisine in an elegant setting.',
          address: {
            street: '9 Place des Vosges',
            city: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            neighborhood: '4th Arrondissement'
          },
          images: [
            {
              id: 'img-1',
              url: '/images/ambroisie.jpg',
              thumbnail: '/images/ambroisie-thumb.jpg',
              caption: 'L\'Ambroisie dining room',
              type: 'interior',
              isMain: true
            }
          ],
          pricing: {
            range: '$$$$',
            averagePrice: 350,
            currency: 'EUR',
            description: 'Very expensive'
          },
          hours: {
            monday: 'Closed',
            tuesday: '12:00-14:00, 19:30-22:00',
            wednesday: '12:00-14:00, 19:30-22:00',
            thursday: '12:00-14:00, 19:30-22:00',
            friday: '12:00-14:00, 19:30-22:00',
            saturday: '12:00-14:00, 19:30-22:00',
            sunday: 'Closed'
          },
          contact: {
            phone: '+33 1 42 78 51 45',
            website: 'https://www.ambroisie-paris.com',
            email: 'contact@ambroisie-paris.com'
          },
          amenities: {
            general: ['WiFi', 'Air conditioning', 'Private dining'],
            dining: ['Wine list', 'Sommelier', 'Tasting menu'],
            accessibility: ['Wheelchair accessible', 'Elevator']
          },
          menu: [
            {
              id: 'menu-1',
              name: 'Tasting Menu',
              items: [
                {
                  id: 'item-1',
                  name: 'Lobster with Caviar',
                  description: 'Fresh lobster with premium caviar',
                  price: 120,
                  currency: 'EUR',
                  allergens: ['shellfish'],
                  dietary: []
                }
              ]
            }
          ],
          specialFeatures: ['Michelin 3-star', 'Wine cellar', 'Private chef'],
          rating: 4.9,
          reviewCount: 1247,
          reviews: [],
          reservations: {
            required: true,
            url: 'https://www.ambroisie-paris.com/reservations',
            phone: '+33 1 42 78 51 45',
            instantBooking: false,
            partySize: { min: 1, max: 8 }
          },
          delivery: {
            available: false,
            providers: [],
            estimatedTime: 0,
            minimumOrder: 0
          },
          distance: {
            fromUser: 2.5,
            fromAttractions: [1.2, 3.4, 2.8]
          },
          tags: ['michelin', 'fine-dining', 'french', 'luxury'],
          isRecommended: true,
          recommendationScore: 0.98,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'rest-2',
          name: 'Le Comptoir du Relais',
          type: 'casual',
          cuisine: ['french', 'bistro'],
          description: 'Charming bistro serving traditional French cuisine in a cozy atmosphere.',
          address: {
            street: '9 Carrefour de l\'Odéon',
            city: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8522, lng: 2.3372 },
            neighborhood: '6th Arrondissement'
          },
          images: [
            {
              id: 'img-2',
              url: '/images/comptoir-relais.jpg',
              thumbnail: '/images/comptoir-relais-thumb.jpg',
              caption: 'Le Comptoir du Relais exterior',
              type: 'exterior',
              isMain: true
            }
          ],
          pricing: {
            range: '$$',
            averagePrice: 45,
            currency: 'EUR',
            description: 'Moderate'
          },
          hours: {
            monday: '12:00-14:00, 19:00-23:00',
            tuesday: '12:00-14:00, 19:00-23:00',
            wednesday: '12:00-14:00, 19:00-23:00',
            thursday: '12:00-14:00, 19:00-23:00',
            friday: '12:00-14:00, 19:00-23:00',
            saturday: '12:00-14:00, 19:00-23:00',
            sunday: '12:00-14:00, 19:00-23:00'
          },
          contact: {
            phone: '+33 1 44 27 07 97',
            website: 'https://www.comptoirdurelais.com'
          },
          amenities: {
            general: ['WiFi', 'Outdoor seating'],
            dining: ['Wine list', 'Local specialties'],
            accessibility: ['Wheelchair accessible']
          },
          menu: [
            {
              id: 'menu-2',
              name: 'Main Courses',
              items: [
                {
                  id: 'item-2',
                  name: 'Coq au Vin',
                  description: 'Traditional French chicken in wine sauce',
                  price: 28,
                  currency: 'EUR',
                  allergens: ['alcohol'],
                  dietary: []
                }
              ]
            }
          ],
          specialFeatures: ['Traditional recipes', 'Local ingredients', 'Cozy atmosphere'],
          rating: 4.3,
          reviewCount: 3420,
          reviews: [],
          reservations: {
            required: false,
            instantBooking: true,
            partySize: { min: 1, max: 6 }
          },
          delivery: {
            available: true,
            providers: ['Uber Eats', 'Deliveroo'],
            estimatedTime: 35,
            minimumOrder: 25
          },
          distance: {
            fromUser: 1.8,
            fromAttractions: [0.5, 2.1, 1.7]
          },
          tags: ['bistro', 'traditional', 'casual', 'local'],
          isRecommended: true,
          recommendationScore: 0.87,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateRecommendations('recommendations', mockRestaurants);
      updateRecommendations('nearby', mockRestaurants.filter(r => r.distance.fromUser <= 5));
      updateRecommendations('popular', mockRestaurants.filter(r => r.reviewCount > 2000));
      updateRecommendations('trending', mockRestaurants.filter(r => r.isRecommended));
      setIsLoading(false);
    }, [updateRecommendations]);

    const getCurrentRestaurants = useCallback(() => {
      switch (activeTab) {
        case 'nearby':
          return recommendations.nearby;
        case 'popular':
          return recommendations.popular;
        case 'trending':
          return recommendations.trending;
        case 'recommendations':
          return recommendations.recommendations;
        default:
          return recommendations.recommendations;
      }
    }, [activeTab, recommendations]);

    const getTypeIcon = (type: RestaurantData['type']) => {
      const restaurantType = restaurantTypes.find(t => t.id === type);
      return restaurantType?.icon || '🍽️';
    };

    const getTypeName = (type: RestaurantData['type']) => {
      const restaurantType = restaurantTypes.find(t => t.id === type);
      return restaurantType?.name || type;
    };

    const getCuisineIcon = (cuisine: string) => {
      const cuisineType = cuisines.find(c => c.id === cuisine);
      return cuisineType?.icon || '🍽️';
    };

    const getPriceColor = (range: RestaurantData['pricing']['range']) => {
      switch (range) {
        case '$': return 'text-green-600 dark:text-green-400';
        case '$$': return 'text-blue-600 dark:text-blue-400';
        case '$$$': return 'text-orange-600 dark:text-orange-400';
        case '$$$$': return 'text-purple-600 dark:text-purple-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const formatPrice = (pricing: RestaurantData['pricing']) => {
      return `${pricing.currency} ${pricing.averagePrice}`;
    };

    const formatDistance = (distance: number) => {
      return `${distance.toFixed(1)} km`;
    };

    useEffect(() => {
      loadRecommendations();
    }, [loadRecommendations]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          restaurantRecommendationsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Restaurant Recommendations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover amazing dining in {recommendations.destination}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadRecommendations}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cuisine
                </label>
                <select
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                >
                  <option value="">All Cuisines</option>
                  {cuisines.map((cuisine) => (
                    <option key={cuisine.id} value={cuisine.id}>
                      {cuisine.icon} {cuisine.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => {
                        const currentRanges = recommendations.filters.priceRange;
                        const newRanges = currentRanges.includes(range.id)
                          ? currentRanges.filter(r => r !== range.id)
                          : [...currentRanges, range.id];
                        updateRecommendations('filters.priceRange', newRanges);
                      }}
                      className={cn(
                        'px-3 py-1 text-xs rounded-md transition-colors duration-200',
                        recommendations.filters.priceRange.includes(range.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {range.icon} {range.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={recommendations.filters.reservations}
                      onChange={(e) => updateRecommendations('filters.reservations', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    Reservations Available
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={recommendations.filters.delivery}
                      onChange={(e) => updateRecommendations('filters.delivery', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    Delivery Available
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distance
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={recommendations.filters.distance}
                  onChange={(e) => updateRecommendations('filters.distance', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  {recommendations.filters.distance} km
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
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Finding the best restaurants...</p>
            </div>
          ) : getCurrentRestaurants().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentRestaurants()
                .filter(restaurant => !selectedCuisine || restaurant.cuisine.includes(selectedCuisine))
                .map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onRestaurantSelect?.(restaurant)}
                >
                  {restaurant.images[0] && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={restaurant.images[0].thumbnail}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(restaurant.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {restaurant.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {restaurant.address.neighborhood}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {restaurant.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({restaurant.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {restaurant.cuisine.map((cuisine) => (
                        <span
                          key={cuisine}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                        >
                          {getCuisineIcon(cuisine)} {cuisine}
                        </span>
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getTypeName(restaurant.type)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className={cn('font-semibold', getPriceColor(restaurant.pricing.range))}>
                          {restaurant.pricing.range} • {formatPrice(restaurant.pricing)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDistance(restaurant.distance.fromUser)}
                        </span>
                      </div>
                      
                      {showReservations && (
                        <div className="flex justify-between">
                          <span>Reservations:</span>
                          <span className={cn(
                            'font-medium',
                            restaurant.reservations.required
                              ? 'text-orange-600 dark:text-orange-400'
                              : 'text-green-600 dark:text-green-400'
                          )}>
                            {restaurant.reservations.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                      )}
                      
                      {showDelivery && (
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span className={cn(
                            'font-medium',
                            restaurant.delivery.available
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-600 dark:text-gray-400'
                          )}>
                            {restaurant.delivery.available ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {restaurant.isRecommended && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          🎯 Recommended
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {Math.round(restaurant.recommendationScore * 100)}% match
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1">
                        {restaurant.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No restaurants found
              </h3>
              <p>Try adjusting your filters or check back later for new recommendations</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RestaurantRecommendations.displayName = 'RestaurantRecommendations';

// Restaurant Recommendations Demo Component
interface RestaurantRecommendationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const RestaurantRecommendationsDemo = React.forwardRef<HTMLDivElement, RestaurantRecommendationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [recommendations, setRecommendations] = useState<Partial<RestaurantRecommendationsData>>({});

    const handleRestaurantSelect = (restaurant: RestaurantData) => {
      console.log('Restaurant selected:', restaurant);
    };

    const mockRecommendations: Partial<RestaurantRecommendationsData> = {
      id: 'rec-1',
      destination: 'Paris, France',
      recommendations: [],
      nearby: [],
      popular: [],
      trending: [],
      categories: [],
      filters: {
        type: [],
        cuisine: [],
        priceRange: [],
        rating: 0,
        distance: 10,
        amenities: [],
        reservations: false,
        delivery: false,
        openNow: false
      },
      preferences: {
        cuisine: ['french', 'italian'],
        priceRange: ['$$', '$$$'],
        atmosphere: ['casual', 'romantic'],
        dietary: [],
        groupSize: 2,
        occasion: ['dinner', 'date']
      },
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
          Restaurant Recommendations Demo
        </h3>
        
        <RestaurantRecommendations
          onRestaurantSelect={handleRestaurantSelect}
          initialRecommendations={mockRecommendations}
          showFilters={true}
          showReviews={true}
          showReservations={true}
          showDelivery={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive restaurant recommendations with cuisine filters, price ranges, reservations, and delivery options.
            </p>
          </div>
        )}
      </div>
    );
  }
);

RestaurantRecommendationsDemo.displayName = 'RestaurantRecommendationsDemo';

// Export all components
export {
  restaurantRecommendationsVariants,
  type RestaurantRecommendationsProps,
  type RestaurantRecommendationsData,
  type RestaurantData,
  type RestaurantImage,
  type MenuSection,
  type MenuItem,
  type RestaurantReview,
  type RestaurantCategory,
  type RestaurantFilters,
  type RestaurantPreferences,
  type RestaurantRecommendationsDemoProps
};
