/**
 * Transportation Options Component
 * 
 * Provides comprehensive transportation options for Atlas travel agent.
 * Implements public transport, car rentals, ride-sharing, and transportation planning.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Transportation Options Variants
const transportationOptionsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'transportation-options-mode-standard',
        'enhanced': 'transportation-options-mode-enhanced',
        'advanced': 'transportation-options-mode-advanced',
        'custom': 'transportation-options-mode-custom'
      },
      type: {
        'public': 'transportation-type-public',
        'private': 'transportation-type-private',
        'rental': 'transportation-type-rental',
        'shared': 'transportation-type-shared',
        'mixed': 'transportation-type-mixed'
      },
      style: {
        'minimal': 'transportation-style-minimal',
        'moderate': 'transportation-style-moderate',
        'detailed': 'transportation-style-detailed',
        'custom': 'transportation-style-custom'
      },
      format: {
        'text': 'transportation-format-text',
        'visual': 'transportation-format-visual',
        'interactive': 'transportation-format-interactive',
        'mixed': 'transportation-format-mixed'
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

// Transportation Options Props
interface TransportationOptionsProps extends VariantProps<typeof transportationOptionsVariants> {
  className?: string;
  onTransportationSelect?: (transportation: TransportationData) => void;
  initialTransportation?: Partial<TransportationOptionsData>;
  showPublic?: boolean;
  showPrivate?: boolean;
  showRental?: boolean;
  showShared?: boolean;
}

// Transportation Options Data Interface
interface TransportationOptionsData {
  id: string;
  destination: string;
  origin: string;
  options: TransportationData[];
  publicTransport: TransportationData[];
  privateTransport: TransportationData[];
  rentalCars: TransportationData[];
  sharedRides: TransportationData[];
  routes: TransportationRoute[];
  filters: TransportationFilters;
  preferences: TransportationPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// Transportation Data Interface
interface TransportationData {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'metro' | 'taxi' | 'uber' | 'lyft' | 'car-rental' | 'bike' | 'walking';
  name: string;
  provider: string;
  description: string;
  route: {
    from: string;
    to: string;
    stops: string[];
    distance: number; // in km
    duration: number; // in minutes
  };
  schedule: {
    frequency: string;
    operatingHours: {
      start: string;
      end: string;
    };
    days: string[];
  };
  pricing: {
    basePrice: number;
    currency: string;
    pricingModel: 'fixed' | 'distance' | 'time' | 'dynamic';
    discounts: Discount[];
    fees: Fee[];
  };
  capacity: {
    maxPassengers: number;
    luggage: {
      carryOn: number;
      checked: number;
    };
  };
  amenities: string[];
  accessibility: string[];
  booking: {
    required: boolean;
    url: string;
    phone: string;
    instantBooking: boolean;
    cancellationPolicy: string;
  };
  rating: number;
  reviewCount: number;
  reviews: TransportationReview[];
  images: TransportationImage[];
  tags: string[];
  isRecommended: boolean;
  recommendationScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Transportation Route Interface
interface TransportationRoute {
  id: string;
  name: string;
  type: 'direct' | 'connecting' | 'multi-modal';
  segments: RouteSegment[];
  totalDuration: number;
  totalDistance: number;
  totalCost: number;
  currency: string;
  transfers: number;
  comfort: 'low' | 'medium' | 'high';
  reliability: 'low' | 'medium' | 'high';
}

// Route Segment Interface
interface RouteSegment {
  id: string;
  transportationId: string;
  from: string;
  to: string;
  duration: number;
  distance: number;
  cost: number;
  departureTime: Date;
  arrivalTime: Date;
}

// Discount Interface
interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'buy-one-get-one';
  value: number;
  conditions: string[];
  validUntil: Date;
}

// Fee Interface
interface Fee {
  id: string;
  name: string;
  amount: number;
  type: 'mandatory' | 'optional' | 'penalty';
  description: string;
}

// Transportation Review Interface
interface TransportationReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
}

// Transportation Image Interface
interface TransportationImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  isMain: boolean;
}

// Transportation Filters Interface
interface TransportationFilters {
  type: string[];
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  rating: number;
  amenities: string[];
  accessibility: string[];
  instantBooking: boolean;
}

// Transportation Preferences Interface
interface TransportationPreferences {
  priority: 'cost' | 'speed' | 'comfort' | 'convenience';
  maxTransfers: number;
  preferredTypes: string[];
  avoidTypes: string[];
  accessibility: string[];
  groupSize: number;
}

// Transportation Options Component
export const TransportationOptions = React.forwardRef<HTMLDivElement, TransportationOptionsProps>(
  ({ 
    className, 
    onTransportationSelect,
    initialTransportation,
    showPublic = true,
    showPrivate = true,
    showRental = true,
    showShared = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [transportation, setTransportation] = useState<TransportationOptionsData>(
      initialTransportation || {
        id: '',
        destination: '',
        origin: '',
        options: [],
        publicTransport: [],
        privateTransport: [],
        rentalCars: [],
        sharedRides: [],
        routes: [],
        filters: {
          type: [],
          priceRange: { min: 0, max: 1000 },
          duration: { min: 0, max: 480 },
          rating: 0,
          amenities: [],
          accessibility: [],
          instantBooking: false
        },
        preferences: {
          priority: 'cost',
          maxTransfers: 3,
          preferredTypes: [],
          avoidTypes: [],
          accessibility: [],
          groupSize: 1
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<string>('');

    const tabs = [
      { id: 'all', name: 'All Options', icon: '🚌' },
      { id: 'public', name: 'Public Transport', icon: '🚇' },
      { id: 'private', name: 'Private', icon: '🚗' },
      { id: 'rental', name: 'Rental Cars', icon: '🚙' },
      { id: 'shared', name: 'Shared Rides', icon: '🚕' }
    ];

    const transportationTypes = [
      { id: 'flight', name: 'Flight', icon: '✈️', category: 'public' },
      { id: 'train', name: 'Train', icon: '🚆', category: 'public' },
      { id: 'bus', name: 'Bus', icon: '🚌', category: 'public' },
      { id: 'metro', name: 'Metro', icon: '🚇', category: 'public' },
      { id: 'taxi', name: 'Taxi', icon: '🚕', category: 'private' },
      { id: 'uber', name: 'Uber', icon: '🚗', category: 'shared' },
      { id: 'lyft', name: 'Lyft', icon: '🚗', category: 'shared' },
      { id: 'car-rental', name: 'Car Rental', icon: '🚙', category: 'rental' },
      { id: 'bike', name: 'Bike', icon: '🚲', category: 'public' },
      { id: 'walking', name: 'Walking', icon: '🚶', category: 'public' }
    ];

    const updateTransportation = useCallback((path: string, value: any) => {
      setTransportation(prev => {
        const newTransportation = { ...prev };
        const keys = path.split('.');
        let current: any = newTransportation;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newTransportation.updatedAt = new Date();
        return newTransportation;
      });
    }, []);

    const loadTransportation = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTransportation: TransportationData[] = [
        {
          id: 'trans-1',
          type: 'metro',
          name: 'Paris Metro',
          provider: 'RATP',
          description: 'Fast and efficient underground transportation system serving Paris and its suburbs.',
          route: {
            from: 'Charles de Gaulle Airport',
            to: 'City Center',
            stops: ['Terminal 1', 'Terminal 2', 'Châtelet-Les Halles'],
            distance: 25,
            duration: 45
          },
          schedule: {
            frequency: 'Every 3-5 minutes',
            operatingHours: { start: '05:30', end: '01:15' },
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          pricing: {
            basePrice: 10.30,
            currency: 'EUR',
            pricingModel: 'fixed',
            discounts: [],
            fees: []
          },
          capacity: {
            maxPassengers: 1,
            luggage: { carryOn: 2, checked: 0 }
          },
          amenities: ['Air conditioning', 'WiFi', 'Accessibility'],
          accessibility: ['Wheelchair accessible', 'Audio announcements'],
          booking: {
            required: false,
            url: 'https://www.ratp.fr',
            phone: '+33 1 58 76 16 16',
            instantBooking: true,
            cancellationPolicy: 'No cancellation needed'
          },
          rating: 4.2,
          reviewCount: 15420,
          reviews: [],
          images: [],
          tags: ['public-transport', 'metro', 'airport', 'city-center'],
          isRecommended: true,
          recommendationScore: 0.85,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'trans-2',
          type: 'uber',
          name: 'Uber',
          provider: 'Uber Technologies',
          description: 'On-demand ride-sharing service with various vehicle options.',
          route: {
            from: 'Any location',
            to: 'Any destination',
            stops: [],
            distance: 0,
            duration: 0
          },
          schedule: {
            frequency: 'On-demand',
            operatingHours: { start: '24/7', end: '24/7' },
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          pricing: {
            basePrice: 0,
            currency: 'EUR',
            pricingModel: 'dynamic',
            discounts: [],
            fees: []
          },
          capacity: {
            maxPassengers: 4,
            luggage: { carryOn: 2, checked: 0 }
          },
          amenities: ['Air conditioning', 'WiFi', 'Phone charging'],
          accessibility: ['Wheelchair accessible vehicles available'],
          booking: {
            required: true,
            url: 'https://www.uber.com',
            phone: '',
            instantBooking: true,
            cancellationPolicy: 'Free cancellation up to 2 minutes'
          },
          rating: 4.5,
          reviewCount: 8920,
          reviews: [],
          images: [],
          tags: ['ride-sharing', 'on-demand', 'private', 'convenient'],
          isRecommended: true,
          recommendationScore: 0.92,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'trans-3',
          type: 'car-rental',
          name: 'Hertz Car Rental',
          provider: 'Hertz Corporation',
          description: 'Premium car rental service with a wide selection of vehicles.',
          route: {
            from: 'Airport Terminal',
            to: 'Any destination',
            stops: [],
            distance: 0,
            duration: 0
          },
          schedule: {
            frequency: '24/7',
            operatingHours: { start: '24/7', end: '24/7' },
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },
          pricing: {
            basePrice: 45,
            currency: 'EUR',
            pricingModel: 'time',
            discounts: [],
            fees: []
          },
          capacity: {
            maxPassengers: 5,
            luggage: { carryOn: 4, checked: 2 }
          },
          amenities: ['GPS', 'Air conditioning', 'Bluetooth', 'Child seats available'],
          accessibility: ['Hand controls available'],
          booking: {
            required: true,
            url: 'https://www.hertz.com',
            phone: '+33 1 42 86 12 34',
            instantBooking: false,
            cancellationPolicy: 'Free cancellation up to 24 hours'
          },
          rating: 4.3,
          reviewCount: 5670,
          reviews: [],
          images: [],
          tags: ['car-rental', 'flexible', 'independent', 'premium'],
          isRecommended: false,
          recommendationScore: 0.78,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateTransportation('options', mockTransportation);
      updateTransportation('publicTransport', mockTransportation.filter(t => ['flight', 'train', 'bus', 'metro', 'bike', 'walking'].includes(t.type)));
      updateTransportation('privateTransport', mockTransportation.filter(t => t.type === 'taxi'));
      updateTransportation('rentalCars', mockTransportation.filter(t => t.type === 'car-rental'));
      updateTransportation('sharedRides', mockTransportation.filter(t => ['uber', 'lyft'].includes(t.type)));
      setIsLoading(false);
    }, [updateTransportation]);

    const getCurrentOptions = useCallback(() => {
      switch (activeTab) {
        case 'public':
          return transportation.publicTransport;
        case 'private':
          return transportation.privateTransport;
        case 'rental':
          return transportation.rentalCars;
        case 'shared':
          return transportation.sharedRides;
        case 'all':
          return transportation.options;
        default:
          return transportation.options;
      }
    }, [activeTab, transportation]);

    const getTypeIcon = (type: TransportationData['type']) => {
      const transportType = transportationTypes.find(t => t.id === type);
      return transportType?.icon || '🚌';
    };

    const getTypeName = (type: TransportationData['type']) => {
      const transportType = transportationTypes.find(t => t.id === type);
      return transportType?.name || type;
    };

    const formatPrice = (pricing: TransportationData['pricing']) => {
      if (pricing.pricingModel === 'dynamic') {
        return 'Dynamic pricing';
      }
      return `${pricing.currency} ${pricing.basePrice}`;
    };

    const formatDuration = (duration: number) => {
      if (duration === 0) return 'Variable';
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    };

    const formatDistance = (distance: number) => {
      if (distance === 0) return 'Variable';
      return `${distance} km`;
    };

    useEffect(() => {
      loadTransportation();
    }, [loadTransportation]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          transportationOptionsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Transportation Options
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              From {transportation.origin} to {transportation.destination}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadTransportation}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType('')}
            className={cn(
              'px-4 py-2 text-sm rounded-md transition-colors duration-200',
              selectedType === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            All Types
          </button>
          {transportationTypes.map((transportType) => (
            <button
              key={transportType.id}
              onClick={() => setSelectedType(transportType.id)}
              className={cn(
                'px-4 py-2 text-sm rounded-md transition-colors duration-200',
                selectedType === transportType.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {transportType.icon} {transportType.name}
            </button>
          ))}
        </div>

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
              <p className="text-gray-600 dark:text-gray-400">Finding transportation options...</p>
            </div>
          ) : getCurrentOptions().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentOptions()
                .filter(option => !selectedType || option.type === selectedType)
                .map((option) => (
                <div
                  key={option.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onTransportationSelect?.(option)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getTypeIcon(option.type)}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {option.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {option.provider}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {option.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({option.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {option.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {option.route.from} → {option.route.to}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDuration(option.route.duration)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDistance(option.route.distance)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(option.pricing)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Capacity:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {option.capacity.maxPassengers} passengers
                        </span>
                      </div>
                    </div>
                    
                    {option.isRecommended && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          🎯 Recommended
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {Math.round(option.recommendationScore * 100)}% match
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1">
                        {option.tags.slice(0, 3).map((tag) => (
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
              <div className="text-6xl mb-4">🚌</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No transportation options found
              </h3>
              <p>Try adjusting your filters or check back later for new options</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TransportationOptions.displayName = 'TransportationOptions';

// Transportation Options Demo Component
interface TransportationOptionsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TransportationOptionsDemo = React.forwardRef<HTMLDivElement, TransportationOptionsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [transportation, setTransportation] = useState<Partial<TransportationOptionsData>>({});

    const handleTransportationSelect = (transportation: TransportationData) => {
      console.log('Transportation selected:', transportation);
    };

    const mockTransportation: Partial<TransportationOptionsData> = {
      id: 'trans-1',
      destination: 'Paris City Center',
      origin: 'Charles de Gaulle Airport',
      options: [],
      publicTransport: [],
      privateTransport: [],
      rentalCars: [],
      sharedRides: [],
      routes: [],
      filters: {
        type: [],
        priceRange: { min: 0, max: 200 },
        duration: { min: 0, max: 120 },
        rating: 0,
        amenities: [],
        accessibility: [],
        instantBooking: false
      },
      preferences: {
        priority: 'cost',
        maxTransfers: 2,
        preferredTypes: [],
        avoidTypes: [],
        accessibility: [],
        groupSize: 2
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
          Transportation Options Demo
        </h3>
        
        <TransportationOptions
          onTransportationSelect={handleTransportationSelect}
          initialTransportation={mockTransportation}
          showPublic={true}
          showPrivate={true}
          showRental={true}
          showShared={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive transportation options with public transport, private rides, car rentals, and shared services.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TransportationOptionsDemo.displayName = 'TransportationOptionsDemo';

// Export all components
export {
  transportationOptionsVariants,
  type TransportationOptionsProps,
  type TransportationOptionsData,
  type TransportationData,
  type TransportationRoute,
  type RouteSegment,
  type Discount,
  type Fee,
  type TransportationReview,
  type TransportationImage,
  type TransportationFilters,
  type TransportationPreferences,
  type TransportationOptionsDemoProps
};
