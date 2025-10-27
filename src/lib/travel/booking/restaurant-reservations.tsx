/**
 * Restaurant Reservations Component
 * 
 * Provides restaurant search, comparison, and reservation for Atlas travel agent.
 * Implements restaurant search, menu browsing, table selection, and reservation management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Restaurant Reservations Variants
const restaurantReservationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'restaurant-reservations-mode-standard',
        'enhanced': 'restaurant-reservations-mode-enhanced',
        'advanced': 'restaurant-reservations-mode-advanced',
        'custom': 'restaurant-reservations-mode-custom'
      },
      type: {
        'fine-dining': 'restaurant-type-fine-dining',
        'casual': 'restaurant-type-casual',
        'street-food': 'restaurant-type-street-food',
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

// Restaurant Reservations Props
interface RestaurantReservationsProps extends VariantProps<typeof restaurantReservationsVariants> {
  className?: string;
  onReservationUpdate?: (reservation: RestaurantReservationData) => void;
  initialReservation?: Partial<RestaurantReservationData>;
  showFilters?: boolean;
  showMenus?: boolean;
  showReviews?: boolean;
  showMap?: boolean;
}

// Restaurant Reservation Data Interface
interface RestaurantReservationData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: RestaurantSearchCriteria;
  searchResults: RestaurantResult[];
  selectedRestaurants: SelectedRestaurant[];
  reservations: RestaurantReservation[];
  favorites: string[];
  settings: RestaurantReservationSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Restaurant Search Criteria Interface
interface RestaurantSearchCriteria {
  destination: string;
  reservationDate: Date;
  reservationTime: string;
  partySize: number;
  cuisine: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  rating: number;
  features: string[];
  distance: number; // in km
  instantBooking: boolean;
}

// Restaurant Result Interface
interface RestaurantResult {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  type: 'fine-dining' | 'casual' | 'fast-food' | 'street-food' | 'cafe' | 'bar' | 'bakery';
  location: RestaurantLocation;
  contact: RestaurantContact;
  hours: RestaurantHours;
  pricing: RestaurantPricing;
  menu: RestaurantMenu;
  availability: RestaurantAvailability;
  features: RestaurantFeature[];
  rating: {
    overall: number;
    food: number;
    service: number;
    ambiance: number;
    value: number;
    reviewCount: number;
  };
  reviews: RestaurantReview[];
  images: RestaurantImage[];
  awards: RestaurantAward[];
  policies: RestaurantPolicy[];
  lastUpdated: Date;
}

// Restaurant Location Interface
interface RestaurantLocation {
  id: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhood: string;
  landmarks: string[];
  parking: {
    available: boolean;
    type: 'street' | 'valet' | 'garage' | 'lot';
    cost: number;
    currency: string;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    hearingAccessible: boolean;
    visualAccessible: boolean;
  };
}

// Restaurant Contact Interface
interface RestaurantContact {
  phone: string;
  email: string;
  website: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

// Restaurant Hours Interface
interface RestaurantHours {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
  specialHours: SpecialHours[];
}

// Time Slot Interface
interface TimeSlot {
  open: string;
  close: string;
  type: 'dining' | 'bar' | 'takeout' | 'delivery';
}

// Special Hours Interface
interface SpecialHours {
  date: Date;
  hours: TimeSlot[];
  note: string;
}

// Restaurant Pricing Interface
interface RestaurantPricing {
  priceRange: 'budget' | 'moderate' | 'expensive' | 'luxury';
  averageCost: number;
  currency: string;
  paymentMethods: string[];
  tippingPolicy: string;
  serviceCharge: number;
  taxRate: number;
}

// Restaurant Menu Interface
interface RestaurantMenu {
  id: string;
  sections: MenuSection[];
  lastUpdated: Date;
  seasonalItems: MenuItem[];
  specials: MenuItem[];
}

// Menu Section Interface
interface MenuSection {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
  order: number;
}

// Menu Item Interface
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  dietary: string[];
  allergens: string[];
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot';
  availability: 'always' | 'seasonal' | 'limited';
  images: string[];
}

// Restaurant Availability Interface
interface RestaurantAvailability {
  isOpen: boolean;
  availableTables: TableAvailability[];
  nextAvailableSlot: string;
  lastUpdated: Date;
  blackoutDates: Date[];
}

// Table Availability Interface
interface TableAvailability {
  id: string;
  time: string;
  tableSize: number;
  availableTables: number;
  price: number;
  currency: string;
  isPopular: boolean;
}

// Restaurant Feature Interface
interface RestaurantFeature {
  id: string;
  name: string;
  icon: string;
  category: 'dining' | 'service' | 'amenity' | 'entertainment';
  isAvailable: boolean;
  price?: number;
  currency?: string;
}

// Restaurant Review Interface
interface RestaurantReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  visitDate: Date;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple' | 'group';
  photos: string[];
  dishes: string[];
}

// Restaurant Image Interface
interface RestaurantImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'exterior' | 'interior' | 'food' | 'ambiance' | 'menu';
  isPrimary: boolean;
}

// Restaurant Award Interface
interface RestaurantAward {
  id: string;
  name: string;
  year: number;
  organization: string;
  category: string;
}

// Restaurant Policy Interface
interface RestaurantPolicy {
  id: string;
  type: 'reservation' | 'cancellation' | 'dress-code' | 'age-restriction' | 'pet' | 'smoking';
  title: string;
  description: string;
  isImportant: boolean;
}

// Selected Restaurant Interface
interface SelectedRestaurant {
  id: string;
  restaurantId: string;
  restaurant: RestaurantResult;
  reservationDate: Date;
  reservationTime: string;
  partySize: number;
  tablePreference: string;
  specialRequests: string[];
  dietaryRestrictions: string[];
  totalCost: number;
  currency: string;
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Restaurant Reservation Interface
interface RestaurantReservation {
  id: string;
  reservationNumber: string;
  selectedRestaurant: SelectedRestaurant;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  confirmationNumber: string;
  bookingDate: Date;
  reservationDate: Date;
  totalAmount: number;
  currency: string;
  cancellationPolicy: string;
  refundPolicy: string;
  documents: BookingDocument[];
  notifications: BookingNotification[];
}

// Contact Info Interface
interface ContactInfo {
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Payment Info Interface
interface PaymentInfo {
  method: 'credit-card' | 'debit-card' | 'paypal' | 'bank-transfer' | 'wallet';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  billingAddress?: ContactInfo['address'];
  transactionId?: string;
}

// Booking Document Interface
interface BookingDocument {
  id: string;
  type: 'confirmation' | 'receipt' | 'voucher' | 'itinerary' | 'other';
  name: string;
  url: string;
  downloadDate: Date;
}

// Booking Notification Interface
interface BookingNotification {
  id: string;
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'special-offer';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Restaurant Reservation Settings Interface
interface RestaurantReservationSettings {
  preferredCuisines: string[];
  preferredPriceRange: string;
  preferredFeatures: string[];
  partySizePreference: number;
  timePreference: string;
  instantBooking: boolean;
  notifications: {
    availabilityChanges: boolean;
    specialOffers: boolean;
    reminderNotifications: boolean;
    reviewRequests: boolean;
  };
}

// Restaurant Reservations Component
export const RestaurantReservations = React.forwardRef<HTMLDivElement, RestaurantReservationsProps>(
  ({ 
    className, 
    onReservationUpdate,
    initialReservation,
    showFilters = true,
    showMenus = true,
    showReviews = true,
    showMap = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [reservation, setReservation] = useState<RestaurantReservationData>(
      initialReservation || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          destination: '',
          reservationDate: new Date(),
          reservationTime: '19:00',
          partySize: 2,
          cuisine: [],
          priceRange: { min: 0, max: 200, currency: 'USD' },
          rating: 4.0,
          features: [],
          distance: 5,
          instantBooking: false
        },
        searchResults: [],
        selectedRestaurants: [],
        reservations: [],
        favorites: [],
        settings: {
          preferredCuisines: [],
          preferredPriceRange: 'moderate',
          preferredFeatures: [],
          partySizePreference: 2,
          timePreference: '19:00',
          instantBooking: false,
          notifications: {
            availabilityChanges: true,
            specialOffers: true,
            reminderNotifications: true,
            reviewRequests: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '🍽️' },
      { id: 'menus', name: 'Menus', icon: '📋' },
      { id: 'reservations', name: 'Reservations', icon: '🎫' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' }
    ];

    const cuisines = [
      { id: 'french', name: 'French', icon: '🥐', color: 'blue' },
      { id: 'italian', name: 'Italian', icon: '🍝', color: 'green' },
      { id: 'japanese', name: 'Japanese', icon: '🍣', color: 'red' },
      { id: 'chinese', name: 'Chinese', icon: '🥢', color: 'yellow' },
      { id: 'indian', name: 'Indian', icon: '🍛', color: 'orange' },
      { id: 'mexican', name: 'Mexican', icon: '🌮', color: 'purple' },
      { id: 'thai', name: 'Thai', icon: '🍜', color: 'pink' },
      { id: 'mediterranean', name: 'Mediterranean', icon: '🫒', color: 'cyan' },
      { id: 'american', name: 'American', icon: '🍔', color: 'indigo' },
      { id: 'seafood', name: 'Seafood', icon: '🦐', color: 'teal' }
    ];

    const restaurantTypes = [
      { id: 'fine-dining', name: 'Fine Dining', icon: '🍾', color: 'gold' },
      { id: 'casual', name: 'Casual', icon: '🍽️', color: 'blue' },
      { id: 'fast-food', name: 'Fast Food', icon: '🍟', color: 'orange' },
      { id: 'street-food', name: 'Street Food', icon: '🌭', color: 'red' },
      { id: 'cafe', name: 'Cafe', icon: '☕', color: 'brown' },
      { id: 'bar', name: 'Bar', icon: '🍸', color: 'purple' },
      { id: 'bakery', name: 'Bakery', icon: '🥖', color: 'yellow' }
    ];

    const features = [
      { id: 'outdoor-seating', name: 'Outdoor Seating', icon: '🌞' },
      { id: 'live-music', name: 'Live Music', icon: '🎵' },
      { id: 'wine-bar', name: 'Wine Bar', icon: '🍷' },
      { id: 'cocktail-bar', name: 'Cocktail Bar', icon: '🍹' },
      { id: 'private-dining', name: 'Private Dining', icon: '🏠' },
      { id: 'kids-menu', name: 'Kids Menu', icon: '👶' },
      { id: 'vegetarian', name: 'Vegetarian Options', icon: '🥗' },
      { id: 'vegan', name: 'Vegan Options', icon: '🌱' },
      { id: 'gluten-free', name: 'Gluten-Free', icon: '🌾' },
      { id: 'halal', name: 'Halal', icon: '🕌' },
      { id: 'kosher', name: 'Kosher', icon: '✡️' },
      { id: 'pet-friendly', name: 'Pet Friendly', icon: '🐕' }
    ];

    const updateReservation = useCallback((path: string, value: any) => {
      setReservation(prev => {
        const newReservation = { ...prev };
        const keys = path.split('.');
        let current: any = newReservation;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newReservation.updatedAt = new Date();
        onReservationUpdate?.(newReservation);
        return newReservation;
      });
    }, [onReservationUpdate]);

    const searchRestaurants = useCallback(() => {
      setIsSearching(true);
      // Simulate restaurant search
      setTimeout(() => {
        const mockResults: RestaurantResult[] = [
          {
            id: 'restaurant-1',
            name: 'Le Comptoir du Relais',
            description: 'Traditional French bistro serving classic dishes in a cozy atmosphere.',
            cuisine: ['french', 'bistro'],
            type: 'casual',
            location: {
              id: 'location-1',
              address: {
                street: '9 Carrefour de l\'Odéon',
                city: 'Paris',
                state: 'Île-de-France',
                zipCode: '75006',
                country: 'France'
              },
              coordinates: { lat: 48.8530, lng: 2.3499 },
              neighborhood: 'Saint-Germain-des-Prés',
              landmarks: ['Odéon Theatre', 'Luxembourg Gardens'],
              parking: {
                available: false,
                type: 'street',
                cost: 0,
                currency: 'EUR'
              },
              accessibility: {
                wheelchairAccessible: false,
                hearingAccessible: false,
                visualAccessible: false
              }
            },
            contact: {
              phone: '+33 1 44 27 07 97',
              email: 'info@comptoirdurelais.com',
              website: 'https://comptoirdurelais.com',
              socialMedia: {
                instagram: '@comptoirdurelais'
              }
            },
            hours: {
              monday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              tuesday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              wednesday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              thursday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              friday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              saturday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              sunday: [{ open: '12:00', close: '14:30', type: 'dining' }, { open: '19:00', close: '23:00', type: 'dining' }],
              specialHours: []
            },
            pricing: {
              priceRange: 'moderate',
              averageCost: 45,
              currency: 'EUR',
              paymentMethods: ['cash', 'credit-card'],
              tippingPolicy: 'Service included',
              serviceCharge: 0,
              taxRate: 20
            },
            menu: {
              id: 'menu-1',
              sections: [],
              lastUpdated: new Date(),
              seasonalItems: [],
              specials: []
            },
            availability: {
              isOpen: true,
              availableTables: [
                {
                  id: 'table-1',
                  time: '19:00',
                  tableSize: 4,
                  availableTables: 2,
                  price: 0,
                  currency: 'EUR',
                  isPopular: true
                }
              ],
              nextAvailableSlot: '19:30',
              lastUpdated: new Date(),
              blackoutDates: []
            },
            features: [],
            rating: {
              overall: 4.5,
              food: 4.6,
              service: 4.4,
              ambiance: 4.5,
              value: 4.3,
              reviewCount: 1250
            },
            reviews: [],
            images: [],
            awards: [],
            policies: [],
            lastUpdated: new Date()
          }
        ];
        updateReservation('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateReservation]);

    const selectRestaurant = useCallback((restaurantId: string) => {
      const restaurant = reservation.searchResults.find(r => r.id === restaurantId);
      if (!restaurant) return;

      const selectedRestaurant: SelectedRestaurant = {
        id: `selected-${Date.now()}`,
        restaurantId: restaurant.id,
        restaurant: restaurant,
        reservationDate: reservation.searchCriteria.reservationDate,
        reservationTime: reservation.searchCriteria.reservationTime,
        partySize: reservation.searchCriteria.partySize,
        tablePreference: '',
        specialRequests: [],
        dietaryRestrictions: [],
        totalCost: restaurant.pricing.averageCost * reservation.searchCriteria.partySize,
        currency: restaurant.pricing.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updateReservation('selectedRestaurants', [...reservation.selectedRestaurants, selectedRestaurant]);
    }, [reservation.searchResults, reservation.selectedRestaurants, reservation.searchCriteria, updateReservation]);

    const formatCurrency = (amount: number, currency: string) => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getCuisineIcon = (cuisineId: string) => {
      const cuisine = cuisines.find(c => c.id === cuisineId);
      return cuisine?.icon || '🍽️';
    };

    const getCuisineName = (cuisineId: string) => {
      const cuisine = cuisines.find(c => c.id === cuisineId);
      return cuisine?.name || cuisineId;
    };

    const getRestaurantTypeIcon = (type: string) => {
      const restaurantType = restaurantTypes.find(t => t.id === type);
      return restaurantType?.icon || '🍽️';
    };

    const getRestaurantTypeName = (type: string) => {
      const restaurantType = restaurantTypes.find(t => t.id === type);
      return restaurantType?.name || type;
    };

    const getFeatureIcon = (featureId: string) => {
      const feature = features.find(f => f.id === featureId);
      return feature?.icon || '🍽️';
    };

    const getFeatureName = (featureId: string) => {
      const feature = features.find(f => f.id === featureId);
      return feature?.name || featureId;
    };

    const getPriceRangeText = (priceRange: string) => {
      switch (priceRange) {
        case 'budget': return '$';
        case 'moderate': return '$$';
        case 'expensive': return '$$$';
        case 'luxury': return '$$$$';
        default: return '$$';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          restaurantReservationsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Restaurant Reservations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find and book restaurants for {reservation.tripName || 'your trip'}
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1 text-sm rounded-l-md transition-colors duration-200',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ☰ List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-3 py-1 text-sm transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  'px-3 py-1 text-sm rounded-r-md transition-colors duration-200',
                  viewMode === 'map'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                🗺️ Map
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              🎫 My Reservations
            </button>
          </div>
        </div>

        {/* Restaurant Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Restaurants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={reservation.searchCriteria.destination}
                onChange={(e) => updateReservation('searchCriteria.destination', e.target.value)}
                placeholder="City or neighborhood"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reservation Date
              </label>
              <input
                type="date"
                value={reservation.searchCriteria.reservationDate.toISOString().split('T')[0]}
                onChange={(e) => updateReservation('searchCriteria.reservationDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={reservation.searchCriteria.reservationTime}
                onChange={(e) => updateReservation('searchCriteria.reservationTime', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Party Size
              </label>
              <select
                value={reservation.searchCriteria.partySize}
                onChange={(e) => updateReservation('searchCriteria.partySize', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cuisine
              </label>
              <div className="flex flex-wrap gap-1">
                {cuisines.slice(0, 6).map((cuisine) => (
                  <button
                    key={cuisine.id}
                    onClick={() => {
                      const currentCuisines = reservation.searchCriteria.cuisine;
                      const newCuisines = currentCuisines.includes(cuisine.id)
                        ? currentCuisines.filter(c => c !== cuisine.id)
                        : [...currentCuisines, cuisine.id];
                      updateReservation('searchCriteria.cuisine', newCuisines);
                    }}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                      reservation.searchCriteria.cuisine.includes(cuisine.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {cuisine.icon} {cuisine.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={reservation.searchCriteria.priceRange.min}
                  onChange={(e) => updateReservation('searchCriteria.priceRange.min', parseInt(e.target.value))}
                  placeholder="Min"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <input
                  type="number"
                  value={reservation.searchCriteria.priceRange.max}
                  onChange={(e) => updateReservation('searchCriteria.priceRange.max', parseInt(e.target.value))}
                  placeholder="Max"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Rating
              </label>
              <select
                value={reservation.searchCriteria.rating}
                onChange={(e) => updateReservation('searchCriteria.rating', parseFloat(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value={0}>Any Rating</option>
                <option value={3}>3+ Stars</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reservation.searchCriteria.instantBooking}
                onChange={(e) => updateReservation('searchCriteria.instantBooking', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Instant booking</span>
            </label>
          </div>
          
          <button
            onClick={searchRestaurants}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Restaurants'}
          </button>
        </div>

        {/* Restaurant Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {reservation.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {reservation.selectedRestaurants.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {reservation.reservations.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reservations</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {reservation.favorites.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Favorites</div>
          </div>
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
          {activeTab === 'results' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Restaurant Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {reservation.searchResults.length} restaurants found
                </div>
              </div>
              
              <div className={cn(
                'gap-4',
                viewMode === 'list' && 'space-y-3',
                viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                viewMode === 'map' && 'grid grid-cols-1 lg:grid-cols-2'
              )}>
                {reservation.searchResults.map((restaurant) => (
                  <div key={restaurant.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {viewMode === 'grid' && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">{getRestaurantTypeIcon(restaurant.type)}</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getRestaurantTypeIcon(restaurant.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {restaurant.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {restaurant.cuisine.map(c => getCuisineName(c)).join(', ')} • {getRestaurantTypeName(restaurant.type)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {restaurant.location.neighborhood} • {getPriceRangeText(restaurant.pricing.priceRange)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(restaurant.pricing.averageCost, restaurant.pricing.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            per person
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {restaurant.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {restaurant.rating.overall}/5 ({restaurant.rating.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {restaurant.availability.availableTables.length} time slots
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Available:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {restaurant.availability.nextAvailableSlot}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {restaurant.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature.id}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                              {getFeatureIcon(feature.id)} {getFeatureName(feature.id)}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                            Details
                          </button>
                          <button
                            onClick={() => selectRestaurant(restaurant.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                My Reservations
              </h3>
              
              {reservation.reservations.length > 0 ? (
                <div className="space-y-3">
                  {reservation.reservations.map((reservationItem) => (
                    <div key={reservationItem.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getRestaurantTypeIcon(reservationItem.selectedRestaurant.restaurant.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {reservationItem.selectedRestaurant.restaurant.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Reservation: {reservationItem.reservationNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(reservationItem.totalAmount, reservationItem.currency)}
                          </div>
                          <div className={cn(
                            'text-sm font-medium',
                            reservationItem.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                            reservationItem.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {reservationItem.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <div className="flex justify-between">
                            <span>Reservation Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(reservationItem.reservationDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {reservationItem.selectedRestaurant.reservationTime}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Party Size:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {reservationItem.selectedRestaurant.partySize} people
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(reservationItem.bookingDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🎫</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No reservations yet
                  </h3>
                  <p>Search and book restaurants to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Restaurants
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No favorite restaurants yet
                </h3>
                <p>Save restaurants you like to your favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

RestaurantReservations.displayName = 'RestaurantReservations';

// Restaurant Reservations Demo Component
interface RestaurantReservationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const RestaurantReservationsDemo = React.forwardRef<HTMLDivElement, RestaurantReservationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [reservation, setReservation] = useState<Partial<RestaurantReservationData>>({});

    const handleReservationUpdate = (updatedReservation: RestaurantReservationData) => {
      setReservation(updatedReservation);
      console.log('Restaurant reservation updated:', updatedReservation);
    };

    const mockReservation: Partial<RestaurantReservationData> = {
      id: 'restaurant-reservation-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        destination: 'Paris',
        reservationDate: new Date('2024-06-15'),
        reservationTime: '19:00',
        partySize: 2,
        cuisine: [],
        priceRange: { min: 0, max: 100, currency: 'EUR' },
        rating: 4.0,
        features: [],
        distance: 5,
        instantBooking: false
      },
      searchResults: [],
      selectedRestaurants: [],
      reservations: [],
      favorites: [],
      settings: {
        preferredCuisines: [],
        preferredPriceRange: 'moderate',
        preferredFeatures: [],
        partySizePreference: 2,
        timePreference: '19:00',
        instantBooking: false,
        notifications: {
          availabilityChanges: true,
          specialOffers: true,
          reminderNotifications: true,
          reviewRequests: true
        }
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
          Restaurant Reservations Demo
        </h3>
        
        <RestaurantReservations
          onReservationUpdate={handleReservationUpdate}
          initialReservation={mockReservation}
          showFilters={true}
          showMenus={true}
          showReviews={true}
          showMap={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive restaurant search and reservation with filters, menus, reviews, and map view.
            </p>
          </div>
        )}
      </div>
    );
  }
);

RestaurantReservationsDemo.displayName = 'RestaurantReservationsDemo';

// Export all components
export {
  restaurantReservationsVariants,
  type RestaurantReservationsProps,
  type RestaurantReservationData,
  type RestaurantSearchCriteria,
  type RestaurantResult,
  type RestaurantLocation,
  type RestaurantContact,
  type RestaurantHours,
  type TimeSlot,
  type SpecialHours,
  type RestaurantPricing,
  type RestaurantMenu,
  type MenuSection,
  type MenuItem,
  type RestaurantAvailability,
  type TableAvailability,
  type RestaurantFeature,
  type RestaurantReview,
  type RestaurantImage,
  type RestaurantAward,
  type RestaurantPolicy,
  type SelectedRestaurant,
  type RestaurantReservation,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type RestaurantReservationSettings,
  type RestaurantReservationsDemoProps
};
