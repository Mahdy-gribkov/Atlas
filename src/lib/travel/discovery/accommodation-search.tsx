/**
 * Accommodation Search Component
 * 
 * Provides comprehensive accommodation search for Atlas travel agent.
 * Implements hotels, hostels, alternative accommodations, and booking features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Accommodation Search Variants
const accommodationSearchVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'accommodation-search-mode-standard',
        'enhanced': 'accommodation-search-mode-enhanced',
        'advanced': 'accommodation-search-mode-advanced',
        'custom': 'accommodation-search-mode-custom'
      },
      type: {
        'hotel': 'accommodation-type-hotel',
        'hostel': 'accommodation-type-hostel',
        'airbnb': 'accommodation-type-airbnb',
        'resort': 'accommodation-type-resort',
        'mixed': 'accommodation-type-mixed'
      },
      style: {
        'minimal': 'accommodation-style-minimal',
        'moderate': 'accommodation-style-moderate',
        'detailed': 'accommodation-style-detailed',
        'custom': 'accommodation-style-custom'
      },
      format: {
        'text': 'accommodation-format-text',
        'visual': 'accommodation-format-visual',
        'interactive': 'accommodation-format-interactive',
        'mixed': 'accommodation-format-mixed'
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

// Accommodation Search Props
interface AccommodationSearchProps extends VariantProps<typeof accommodationSearchVariants> {
  className?: string;
  onAccommodationSelect?: (accommodation: AccommodationData) => void;
  initialSearch?: Partial<AccommodationSearchData>;
  showFilters?: boolean;
  showMap?: boolean;
  showReviews?: boolean;
  showAvailability?: boolean;
}

// Accommodation Search Data Interface
interface AccommodationSearchData {
  id: string;
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  rooms: number;
  accommodations: AccommodationData[];
  filters: AccommodationFilters;
  mapView: boolean;
  sortBy: 'price' | 'rating' | 'distance' | 'popularity';
  createdAt: Date;
  updatedAt: Date;
}

// Accommodation Data Interface
interface AccommodationData {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'guesthouse' | 'apartment' | 'villa';
  category: 'budget' | 'mid-range' | 'luxury' | 'boutique';
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
  images: AccommodationImage[];
  pricing: {
    basePrice: number;
    currency: string;
    pricingModel: 'per-night' | 'per-person' | 'per-room';
    taxes: number;
    fees: Fee[];
    discounts: Discount[];
    cancellationPolicy: string;
  };
  availability: {
    isAvailable: boolean;
    roomsAvailable: number;
    lastUpdated: Date;
  };
  amenities: {
    general: string[];
    room: string[];
    dining: string[];
    recreation: string[];
    business: string[];
    accessibility: string[];
  };
  rooms: RoomType[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    pets: string;
    smoking: string;
    ageRestrictions: string;
  };
  rating: number;
  reviewCount: number;
  reviews: AccommodationReview[];
  host?: HostInfo;
  distance: {
    fromAirport: number;
    fromCityCenter: number;
    fromAttractions: number[];
  };
  tags: string[];
  isRecommended: boolean;
  recommendationScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Accommodation Image Interface
interface AccommodationImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'exterior' | 'interior' | 'room' | 'amenity' | 'dining';
  isMain: boolean;
}

// Room Type Interface
interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
    infants: number;
  };
  size: number; // in square meters
  amenities: string[];
  images: string[];
  pricing: {
    basePrice: number;
    currency: string;
  };
  availability: boolean;
}

// Host Info Interface
interface HostInfo {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  rating: number;
  reviewCount: number;
  responseTime: string;
  languages: string[];
  verified: boolean;
  superhost: boolean;
}

// Accommodation Review Interface
interface AccommodationReview {
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
    cleanliness: number;
    location: number;
    value: number;
    service: number;
  };
}

// Fee Interface
interface Fee {
  id: string;
  name: string;
  amount: number;
  type: 'mandatory' | 'optional' | 'penalty';
  description: string;
}

// Discount Interface
interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'early-bird' | 'last-minute';
  value: number;
  conditions: string[];
  validUntil: Date;
}

// Accommodation Filters Interface
interface AccommodationFilters {
  type: string[];
  category: string[];
  priceRange: {
    min: number;
    max: number;
  };
  rating: number;
  amenities: string[];
  distance: {
    fromAirport: number;
    fromCityCenter: number;
  };
  availability: boolean;
  instantBooking: boolean;
  freeCancellation: boolean;
}

// Accommodation Search Component
export const AccommodationSearch = React.forwardRef<HTMLDivElement, AccommodationSearchProps>(
  ({ 
    className, 
    onAccommodationSelect,
    initialSearch,
    showFilters = true,
    showMap = true,
    showReviews = true,
    showAvailability = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [search, setSearch] = useState<AccommodationSearchData>(
      initialSearch || {
        id: '',
        destination: '',
        checkIn: new Date(),
        checkOut: new Date(),
        guests: 2,
        rooms: 1,
        accommodations: [],
        filters: {
          type: [],
          category: [],
          priceRange: { min: 0, max: 1000 },
          rating: 0,
          amenities: [],
          distance: { fromAirport: 50, fromCityCenter: 20 },
          availability: true,
          instantBooking: false,
          freeCancellation: false
        },
        mapView: false,
        sortBy: 'popularity',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');

    const tabs = [
      { id: 'all', name: 'All', icon: '🏨' },
      { id: 'hotel', name: 'Hotels', icon: '🏨' },
      { id: 'hostel', name: 'Hostels', icon: '🏠' },
      { id: 'airbnb', name: 'Airbnb', icon: '🏡' },
      { id: 'resort', name: 'Resorts', icon: '🏖️' }
    ];

    const accommodationTypes = [
      { id: 'hotel', name: 'Hotel', icon: '🏨', category: 'mid-range' },
      { id: 'hostel', name: 'Hostel', icon: '🏠', category: 'budget' },
      { id: 'airbnb', name: 'Airbnb', icon: '🏡', category: 'mid-range' },
      { id: 'resort', name: 'Resort', icon: '🏖️', category: 'luxury' },
      { id: 'guesthouse', name: 'Guesthouse', icon: '🏘️', category: 'budget' },
      { id: 'apartment', name: 'Apartment', icon: '🏢', category: 'mid-range' },
      { id: 'villa', name: 'Villa', icon: '🏰', category: 'luxury' }
    ];

    const categories = [
      { id: 'budget', name: 'Budget', icon: '💰', color: 'green' },
      { id: 'mid-range', name: 'Mid-Range', icon: '⭐', color: 'blue' },
      { id: 'luxury', name: 'Luxury', icon: '💎', color: 'purple' },
      { id: 'boutique', name: 'Boutique', icon: '🎨', color: 'pink' }
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

    const loadAccommodations = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockAccommodations: AccommodationData[] = [
        {
          id: 'acc-1',
          name: 'Hotel Plaza Athénée',
          type: 'hotel',
          category: 'luxury',
          description: 'Iconic luxury hotel in the heart of Paris, known for its elegant rooms and exceptional service.',
          address: {
            street: '25 Avenue Montaigne',
            city: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8656, lng: 2.3012 },
            neighborhood: '8th Arrondissement'
          },
          images: [
            {
              id: 'img-1',
              url: '/images/plaza-athenee.jpg',
              thumbnail: '/images/plaza-athenee-thumb.jpg',
              caption: 'Hotel Plaza Athénée exterior',
              type: 'exterior',
              isMain: true
            }
          ],
          pricing: {
            basePrice: 650,
            currency: 'EUR',
            pricingModel: 'per-night',
            taxes: 65,
            fees: [],
            discounts: [],
            cancellationPolicy: 'Free cancellation up to 24 hours'
          },
          availability: {
            isAvailable: true,
            roomsAvailable: 3,
            lastUpdated: new Date()
          },
          amenities: {
            general: ['WiFi', 'Air conditioning', 'Concierge', 'Room service'],
            room: ['Minibar', 'Safe', 'Balcony', 'City view'],
            dining: ['Restaurant', 'Bar', 'Room service', 'Breakfast'],
            recreation: ['Spa', 'Fitness center', 'Pool'],
            business: ['Business center', 'Meeting rooms', 'WiFi'],
            accessibility: ['Wheelchair accessible', 'Elevator']
          },
          rooms: [
            {
              id: 'room-1',
              name: 'Deluxe Room',
              description: 'Elegant room with city views',
              capacity: { adults: 2, children: 1, infants: 1 },
              size: 35,
              amenities: ['Minibar', 'Safe', 'Balcony'],
              images: ['/images/deluxe-room.jpg'],
              pricing: { basePrice: 650, currency: 'EUR' },
              availability: true
            }
          ],
          policies: {
            checkIn: '15:00',
            checkOut: '12:00',
            cancellation: 'Free cancellation up to 24 hours',
            pets: 'Pets allowed with additional fee',
            smoking: 'Non-smoking property',
            ageRestrictions: 'Children welcome'
          },
          rating: 4.8,
          reviewCount: 2847,
          reviews: [],
          distance: {
            fromAirport: 25,
            fromCityCenter: 2,
            fromAttractions: [1, 3, 5]
          },
          tags: ['luxury', 'central', 'spa', 'restaurant'],
          isRecommended: true,
          recommendationScore: 0.95,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'acc-2',
          name: 'Generator Paris',
          type: 'hostel',
          category: 'budget',
          description: 'Modern hostel in the trendy Marais district, perfect for budget-conscious travelers.',
          address: {
            street: '9-11 Place du Colonel Fabien',
            city: 'Paris',
            country: 'France',
            coordinates: { lat: 48.8806, lng: 2.3706 },
            neighborhood: '10th Arrondissement'
          },
          images: [
            {
              id: 'img-2',
              url: '/images/generator-paris.jpg',
              thumbnail: '/images/generator-paris-thumb.jpg',
              caption: 'Generator Paris exterior',
              type: 'exterior',
              isMain: true
            }
          ],
          pricing: {
            basePrice: 35,
            currency: 'EUR',
            pricingModel: 'per-person',
            taxes: 3.5,
            fees: [],
            discounts: [],
            cancellationPolicy: 'Free cancellation up to 48 hours'
          },
          availability: {
            isAvailable: true,
            roomsAvailable: 12,
            lastUpdated: new Date()
          },
          amenities: {
            general: ['WiFi', 'Air conditioning', 'Luggage storage', 'Laundry'],
            room: ['Shared bathroom', 'Lockers', 'Bed linen'],
            dining: ['Bar', 'Café', 'Kitchen'],
            recreation: ['Common room', 'Games room', 'Rooftop'],
            business: ['WiFi', 'Work area'],
            accessibility: ['Wheelchair accessible', 'Elevator']
          },
          rooms: [
            {
              id: 'room-2',
              name: 'Dormitory',
              description: 'Shared dormitory with bunk beds',
              capacity: { adults: 6, children: 0, infants: 0 },
              size: 20,
              amenities: ['Lockers', 'Bed linen'],
              images: ['/images/dormitory.jpg'],
              pricing: { basePrice: 35, currency: 'EUR' },
              availability: true
            }
          ],
          policies: {
            checkIn: '15:00',
            checkOut: '11:00',
            cancellation: 'Free cancellation up to 48 hours',
            pets: 'Pets not allowed',
            smoking: 'Non-smoking property',
            ageRestrictions: '18+ only'
          },
          rating: 4.2,
          reviewCount: 1923,
          reviews: [],
          distance: {
            fromAirport: 30,
            fromCityCenter: 5,
            fromAttractions: [8, 12, 15]
          },
          tags: ['budget', 'social', 'modern', 'central'],
          isRecommended: true,
          recommendationScore: 0.82,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateSearch('accommodations', mockAccommodations);
      setIsLoading(false);
    }, [updateSearch]);

    const getCurrentAccommodations = useCallback(() => {
      switch (activeTab) {
        case 'hotel':
          return search.accommodations.filter(acc => acc.type === 'hotel');
        case 'hostel':
          return search.accommodations.filter(acc => acc.type === 'hostel');
        case 'airbnb':
          return search.accommodations.filter(acc => acc.type === 'airbnb');
        case 'resort':
          return search.accommodations.filter(acc => acc.type === 'resort');
        case 'all':
          return search.accommodations;
        default:
          return search.accommodations;
      }
    }, [activeTab, search.accommodations]);

    const getTypeIcon = (type: AccommodationData['type']) => {
      const accommodationType = accommodationTypes.find(t => t.id === type);
      return accommodationType?.icon || '🏨';
    };

    const getTypeName = (type: AccommodationData['type']) => {
      const accommodationType = accommodationTypes.find(t => t.id === type);
      return accommodationType?.name || type;
    };

    const getCategoryColor = (category: AccommodationData['category']) => {
      const cat = categories.find(c => c.id === category);
      switch (cat?.color) {
        case 'green': return 'text-green-600 dark:text-green-400';
        case 'blue': return 'text-blue-600 dark:text-blue-400';
        case 'purple': return 'text-purple-600 dark:text-purple-400';
        case 'pink': return 'text-pink-600 dark:text-pink-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const formatPrice = (pricing: AccommodationData['pricing']) => {
      const totalPrice = pricing.basePrice + pricing.taxes;
      return `${pricing.currency} ${totalPrice}`;
    };

    const formatDistance = (distance: number) => {
      return `${distance} km`;
    };

    useEffect(() => {
      loadAccommodations();
    }, [loadAccommodations]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          accommodationSearchVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Accommodation Search
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {search.destination} • {search.guests} guests • {search.rooms} room
            </p>
          </div>
          <div className="flex gap-2">
            {showMap && (
              <button
                onClick={() => updateSearch('mapView', !search.mapView)}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors duration-200',
                  search.mapView
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                🗺️ Map
              </button>
            )}
            <button
              onClick={loadAccommodations}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Search
            </button>
          </div>
        </div>

        {/* Search Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={search.filters.priceRange.min}
                    onChange={(e) => updateSearch('filters.priceRange.min', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={search.filters.priceRange.max}
                    onChange={(e) => updateSearch('filters.priceRange.max', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={search.sortBy}
                  onChange={(e) => updateSearch('sortBy', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                >
                  <option value="popularity">Popularity</option>
                  <option value="price">Price</option>
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={search.filters.freeCancellation}
                    onChange={(e) => updateSearch('filters.freeCancellation', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  Free Cancellation
                </label>
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
              <p className="text-gray-600 dark:text-gray-400">Searching accommodations...</p>
            </div>
          ) : getCurrentAccommodations().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentAccommodations()
                .filter(acc => !selectedType || acc.category === selectedType)
                .map((accommodation) => (
                <div
                  key={accommodation.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onAccommodationSelect?.(accommodation)}
                >
                  {accommodation.images[0] && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={accommodation.images[0].thumbnail}
                        alt={accommodation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(accommodation.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {accommodation.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {accommodation.address.neighborhood}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {accommodation.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({accommodation.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {accommodation.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getTypeName(accommodation.type)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className={cn('font-medium', getCategoryColor(accommodation.category))}>
                          {accommodation.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDistance(accommodation.distance.fromCityCenter)} from center
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(accommodation.pricing)} / night
                        </span>
                      </div>
                      
                      {showAvailability && (
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className={cn(
                            'font-medium',
                            accommodation.availability.isAvailable
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          )}>
                            {accommodation.availability.roomsAvailable} rooms
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {accommodation.isRecommended && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          🎯 Recommended
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {Math.round(accommodation.recommendationScore * 100)}% match
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1">
                        {accommodation.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🏨</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No accommodations found
              </h3>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

AccommodationSearch.displayName = 'AccommodationSearch';

// Accommodation Search Demo Component
interface AccommodationSearchDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AccommodationSearchDemo = React.forwardRef<HTMLDivElement, AccommodationSearchDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [search, setSearch] = useState<Partial<AccommodationSearchData>>({});

    const handleAccommodationSelect = (accommodation: AccommodationData) => {
      console.log('Accommodation selected:', accommodation);
    };

    const mockSearch: Partial<AccommodationSearchData> = {
      id: 'search-1',
      destination: 'Paris, France',
      checkIn: new Date('2024-06-15'),
      checkOut: new Date('2024-06-19'),
      guests: 2,
      rooms: 1,
      accommodations: [],
      filters: {
        type: [],
        category: [],
        priceRange: { min: 0, max: 500 },
        rating: 0,
        amenities: [],
        distance: { fromAirport: 50, fromCityCenter: 20 },
        availability: true,
        instantBooking: false,
        freeCancellation: false
      },
      mapView: false,
      sortBy: 'popularity',
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
          Accommodation Search Demo
        </h3>
        
        <AccommodationSearch
          onAccommodationSelect={handleAccommodationSelect}
          initialSearch={mockSearch}
          showFilters={true}
          showMap={true}
          showReviews={true}
          showAvailability={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive accommodation search with hotels, hostels, Airbnb, and alternative accommodations.
            </p>
          </div>
        )}
      </div>
    );
  }
);

AccommodationSearchDemo.displayName = 'AccommodationSearchDemo';

// Export all components
export {
  accommodationSearchVariants,
  type AccommodationSearchProps,
  type AccommodationSearchData,
  type AccommodationData,
  type AccommodationImage,
  type RoomType,
  type HostInfo,
  type AccommodationReview,
  type Fee,
  type Discount,
  type AccommodationFilters,
  type AccommodationSearchDemoProps
};
