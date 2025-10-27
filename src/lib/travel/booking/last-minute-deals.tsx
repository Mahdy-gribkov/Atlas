/**
 * Last-minute Deals Component
 * 
 * Provides last-minute booking opportunities for Atlas travel agent.
 * Implements deal discovery, price alerts, and instant booking for urgent travel needs.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Last-minute Deals Variants
const lastMinuteDealsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'last-minute-deals-mode-standard',
        'enhanced': 'last-minute-deals-mode-enhanced',
        'advanced': 'last-minute-deals-mode-advanced',
        'custom': 'last-minute-deals-mode-custom'
      },
      type: {
        'flights': 'deals-type-flights',
        'hotels': 'deals-type-hotels',
        'packages': 'deals-type-packages',
        'mixed': 'deals-type-mixed'
      },
      style: {
        'minimal': 'deals-style-minimal',
        'moderate': 'deals-style-moderate',
        'detailed': 'deals-style-detailed',
        'custom': 'deals-style-custom'
      },
      format: {
        'text': 'deals-format-text',
        'visual': 'deals-format-visual',
        'interactive': 'deals-format-interactive',
        'mixed': 'deals-format-mixed'
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

// Last-minute Deals Props
interface LastMinuteDealsProps extends VariantProps<typeof lastMinuteDealsVariants> {
  className?: string;
  onDealUpdate?: (deal: LastMinuteDealData) => void;
  initialDeal?: Partial<LastMinuteDealData>;
  showFilters?: boolean;
  showAlerts?: boolean;
  showCountdown?: boolean;
  showSavings?: boolean;
}

// Last-minute Deal Data Interface
interface LastMinuteDealData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: DealSearchCriteria;
  searchResults: DealResult[];
  selectedDeals: SelectedDeal[];
  bookings: DealBooking[];
  alerts: DealAlert[];
  favorites: string[];
  settings: LastMinuteDealSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Deal Search Criteria Interface
interface DealSearchCriteria {
  departureLocation: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  travelers: {
    adults: number;
    children: number;
  };
  dealTypes: string[];
  maxPrice: number;
  currency: string;
  urgency: 'immediate' | 'within-24h' | 'within-3days' | 'within-week';
  flexibility: {
    dates: boolean;
    destination: boolean;
    departure: boolean;
  };
  preferences: {
    directFlights: boolean;
    specificAirlines: string[];
    hotelRating: number;
    allInclusive: boolean;
  };
}

// Deal Result Interface
interface DealResult {
  id: string;
  type: 'flight' | 'hotel' | 'package' | 'car' | 'activity';
  title: string;
  description: string;
  provider: DealProvider;
  destination: DealDestination;
  pricing: DealPricing;
  availability: DealAvailability;
  urgency: DealUrgency;
  restrictions: DealRestriction[];
  inclusions: DealInclusion[];
  exclusions: DealExclusion[];
  rating: {
    overall: number;
    value: number;
    reliability: number;
    reviewCount: number;
  };
  reviews: DealReview[];
  images: DealImage[];
  lastUpdated: Date;
}

// Deal Provider Interface
interface DealProvider {
  id: string;
  name: string;
  logo: string;
  type: 'airline' | 'hotel' | 'ota' | 'travel-agent' | 'direct';
  rating: number;
  reviewCount: number;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  specialties: string[];
  trustScore: number;
}

// Deal Destination Interface
interface DealDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  highlights: string[];
  weather: {
    current: string;
    forecast: string[];
  };
  bestTimeToVisit: string[];
  attractions: string[];
  culture: string;
  language: string[];
  currency: string;
  timezone: string;
}

// Deal Pricing Interface
interface DealPricing {
  originalPrice: number;
  discountedPrice: number;
  savings: number;
  savingsPercentage: number;
  currency: string;
  priceBreakdown: {
    basePrice: number;
    taxes: number;
    fees: number;
    discounts: number;
  };
  paymentMethods: string[];
  depositRequired: boolean;
  depositAmount: number;
  cancellationPolicy: string;
  refundPolicy: string;
}

// Deal Availability Interface
interface DealAvailability {
  isAvailable: boolean;
  availableCount: number;
  lastUpdated: Date;
  expirationTime: Date;
  blackoutDates: Date[];
  restrictions: string[];
  minimumNotice: number; // in hours
}

// Deal Urgency Interface
interface DealUrgency {
  level: 'low' | 'medium' | 'high' | 'critical';
  timeRemaining: number; // in minutes
  bookingDeadline: Date;
  isExpiring: boolean;
  urgencyReason: string;
}

// Deal Restriction Interface
interface DealRestriction {
  id: string;
  type: 'age' | 'passport' | 'visa' | 'health' | 'booking' | 'cancellation';
  title: string;
  description: string;
  isImportant: boolean;
  appliesTo: string[];
}

// Deal Inclusion Interface
interface DealInclusion {
  id: string;
  category: 'flight' | 'accommodation' | 'meals' | 'activities' | 'transportation' | 'insurance' | 'other';
  name: string;
  description: string;
  value: number;
  currency: string;
  isOptional: boolean;
}

// Deal Exclusion Interface
interface DealExclusion {
  id: string;
  category: string;
  name: string;
  description: string;
  estimatedCost: number;
  currency: string;
}

// Deal Review Interface
interface DealReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  dealType: string;
  travelDate: Date;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple' | 'group';
  photos: string[];
}

// Deal Image Interface
interface DealImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'destination' | 'accommodation' | 'activity' | 'food' | 'transportation';
  isPrimary: boolean;
}

// Selected Deal Interface
interface SelectedDeal {
  id: string;
  dealId: string;
  deal: DealResult;
  travelers: TravelerInfo[];
  selectedOptions: SelectedOption[];
  totalPrice: number;
  currency: string;
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Traveler Info Interface
interface TravelerInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  type: 'adult' | 'child';
  specialRequests: string[];
  dietaryRestrictions: string[];
  isPrimary: boolean;
}

// Selected Option Interface
interface SelectedOption {
  id: string;
  category: 'seat' | 'meal' | 'baggage' | 'insurance' | 'activity' | 'other';
  name: string;
  description: string;
  price: number;
  currency: string;
  isRequired: boolean;
  isSelected: boolean;
}

// Deal Booking Interface
interface DealBooking {
  id: string;
  bookingNumber: string;
  selectedDeal: SelectedDeal;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  confirmationNumber: string;
  bookingDate: Date;
  travelDate: Date;
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
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'urgent';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Deal Alert Interface
interface DealAlert {
  id: string;
  name: string;
  criteria: DealSearchCriteria;
  isActive: boolean;
  lastChecked: Date;
  notifications: DealAlertNotification[];
  createdAt: Date;
}

// Deal Alert Notification Interface
interface DealAlertNotification {
  id: string;
  dealId: string;
  title: string;
  message: string;
  price: number;
  currency: string;
  isRead: boolean;
  createdAt: Date;
}

// Last-minute Deal Settings Interface
interface LastMinuteDealSettings {
  preferredDealTypes: string[];
  maxPrice: number;
  currency: string;
  urgencyLevel: string;
  flexibility: {
    dates: boolean;
    destination: boolean;
    departure: boolean;
  };
  preferences: {
    directFlights: boolean;
    specificAirlines: string[];
    hotelRating: number;
    allInclusive: boolean;
  };
  notifications: {
    newDeals: boolean;
    priceDrops: boolean;
    urgentDeals: boolean;
    expirationAlerts: boolean;
  };
}

// Last-minute Deals Component
export const LastMinuteDeals = React.forwardRef<HTMLDivElement, LastMinuteDealsProps>(
  ({ 
    className, 
    onDealUpdate,
    initialDeal,
    showFilters = true,
    showAlerts = true,
    showCountdown = true,
    showSavings = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [deal, setDeal] = useState<LastMinuteDealData>(
      initialDeal || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          departureLocation: '',
          destination: '',
          departureDate: new Date(),
          travelers: { adults: 1, children: 0 },
          dealTypes: [],
          maxPrice: 1000,
          currency: 'USD',
          urgency: 'within-24h',
          flexibility: {
            dates: true,
            destination: true,
            departure: true
          },
          preferences: {
            directFlights: false,
            specificAirlines: [],
            hotelRating: 3,
            allInclusive: false
          }
        },
        searchResults: [],
        selectedDeals: [],
        bookings: [],
        alerts: [],
        favorites: [],
        settings: {
          preferredDealTypes: [],
          maxPrice: 1000,
          currency: 'USD',
          urgencyLevel: 'within-24h',
          flexibility: {
            dates: true,
            destination: true,
            departure: true
          },
          preferences: {
            directFlights: false,
            specificAirlines: [],
            hotelRating: 3,
            allInclusive: false
          },
          notifications: {
            newDeals: true,
            priceDrops: true,
            urgentDeals: true,
            expirationAlerts: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('deals');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedDeal, setSelectedDeal] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');

    const tabs = [
      { id: 'deals', name: 'Deals', icon: '🔥' },
      { id: 'alerts', name: 'Alerts', icon: '🔔' },
      { id: 'bookings', name: 'Bookings', icon: '🎫' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' }
    ];

    const dealTypes = [
      { id: 'flight', name: 'Flights', icon: '✈️', color: 'blue' },
      { id: 'hotel', name: 'Hotels', icon: '🏨', color: 'green' },
      { id: 'package', name: 'Packages', icon: '📦', color: 'purple' },
      { id: 'car', name: 'Car Rentals', icon: '🚗', color: 'orange' },
      { id: 'activity', name: 'Activities', icon: '🎯', color: 'red' }
    ];

    const urgencyLevels = [
      { id: 'immediate', name: 'Immediate', icon: '⚡', color: 'red' },
      { id: 'within-24h', name: 'Within 24h', icon: '🔥', color: 'orange' },
      { id: 'within-3days', name: 'Within 3 days', icon: '⏰', color: 'yellow' },
      { id: 'within-week', name: 'Within week', icon: '📅', color: 'blue' }
    ];

    const destinations = [
      { id: 'paris', name: 'Paris', country: 'France', icon: '🗼', color: 'blue' },
      { id: 'rome', name: 'Rome', country: 'Italy', icon: '🏛️', color: 'green' },
      { id: 'london', name: 'London', country: 'UK', icon: '🏰', color: 'purple' },
      { id: 'tokyo', name: 'Tokyo', country: 'Japan', icon: '🗾', color: 'red' },
      { id: 'barcelona', name: 'Barcelona', country: 'Spain', icon: '🏛️', color: 'orange' },
      { id: 'new-york', name: 'New York', country: 'USA', icon: '🗽', color: 'cyan' }
    ];

    const updateDeal = useCallback((path: string, value: any) => {
      setDeal(prev => {
        const newDeal = { ...prev };
        const keys = path.split('.');
        let current: any = newDeal;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newDeal.updatedAt = new Date();
        onDealUpdate?.(newDeal);
        return newDeal;
      });
    }, [onDealUpdate]);

    const searchDeals = useCallback(() => {
      setIsSearching(true);
      // Simulate deal search
      setTimeout(() => {
        const mockResults: DealResult[] = [
          {
            id: 'deal-1',
            type: 'flight',
            title: 'Last-Minute Paris Flight Deal',
            description: 'Amazing deal on flights to Paris with major savings!',
            provider: {
              id: 'provider-1',
              name: 'Air France',
              logo: '✈️',
              type: 'airline',
              rating: 4.2,
              reviewCount: 1500,
              verified: true,
              contact: {
                phone: '+1-800-237-2747',
                email: 'info@airfrance.com',
                website: 'https://airfrance.com'
              },
              specialties: ['europe', 'premium'],
              trustScore: 95
            },
            destination: {
              id: 'destination-1',
              name: 'Paris',
              country: 'France',
              region: 'Île-de-France',
              coordinates: { lat: 48.8566, lng: 2.3522 },
              highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
              weather: {
                current: 'Sunny, 22°C',
                forecast: ['Sunny', 'Partly Cloudy', 'Rain']
              },
              bestTimeToVisit: ['Spring', 'Summer', 'Autumn'],
              attractions: ['Champs-Élysées', 'Montmartre', 'Seine River'],
              culture: 'Rich history and art',
              language: ['French'],
              currency: 'EUR',
              timezone: 'CET'
            },
            pricing: {
              originalPrice: 800,
              discountedPrice: 450,
              savings: 350,
              savingsPercentage: 43.8,
              currency: 'USD',
              priceBreakdown: {
                basePrice: 400,
                taxes: 50,
                fees: 0,
                discounts: 350
              },
              paymentMethods: ['credit-card', 'paypal'],
              depositRequired: false,
              depositAmount: 0,
              cancellationPolicy: 'Non-refundable',
              refundPolicy: 'No refunds'
            },
            availability: {
              isAvailable: true,
              availableCount: 3,
              lastUpdated: new Date(),
              expirationTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
              blackoutDates: [],
              restrictions: ['Non-refundable', 'No changes allowed'],
              minimumNotice: 4
            },
            urgency: {
              level: 'high',
              timeRemaining: 120, // 2 hours in minutes
              bookingDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000),
              isExpiring: true,
              urgencyReason: 'Limited seats available'
            },
            restrictions: [],
            inclusions: [],
            exclusions: [],
            rating: {
              overall: 4.3,
              value: 4.5,
              reliability: 4.1,
              reviewCount: 850
            },
            reviews: [],
            images: [],
            lastUpdated: new Date()
          }
        ];
        updateDeal('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateDeal]);

    const selectDeal = useCallback((dealId: string) => {
      const dealItem = deal.searchResults.find(d => d.id === dealId);
      if (!dealItem) return;

      const selectedDeal: SelectedDeal = {
        id: `selected-${Date.now()}`,
        dealId: dealItem.id,
        deal: dealItem,
        travelers: [],
        selectedOptions: [],
        totalPrice: dealItem.pricing.discountedPrice,
        currency: dealItem.pricing.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updateDeal('selectedDeals', [...deal.selectedDeals, selectedDeal]);
    }, [deal.searchResults, deal.selectedDeals, updateDeal]);

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

    const formatTimeRemaining = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours > 0) {
        return `${hours}h ${mins}m`;
      }
      return `${mins}m`;
    };

    const getDealTypeIcon = (type: string) => {
      const dealType = dealTypes.find(t => t.id === type);
      return dealType?.icon || '🔥';
    };

    const getDealTypeName = (type: string) => {
      const dealType = dealTypes.find(t => t.id === type);
      return dealType?.name || type;
    };

    const getUrgencyIcon = (level: string) => {
      const urgency = urgencyLevels.find(u => u.id === level);
      return urgency?.icon || '⏰';
    };

    const getUrgencyName = (level: string) => {
      const urgency = urgencyLevels.find(u => u.id === level);
      return urgency?.name || level;
    };

    const getUrgencyColor = (level: string) => {
      const urgency = urgencyLevels.find(u => u.id === level);
      return urgency?.color || 'gray';
    };

    const getDestinationIcon = (destinationId: string) => {
      const destination = destinations.find(d => d.id === destinationId);
      return destination?.icon || '🌍';
    };

    const getDestinationName = (destinationId: string) => {
      const destination = destinations.find(d => d.id === destinationId);
      return destination?.name || destinationId;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          lastMinuteDealsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Last-Minute Deals
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find amazing last-minute travel deals and save big
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              🔔 Price Alerts
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              🎫 My Bookings
            </button>
          </div>
        </div>

        {/* Deal Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Last-Minute Deals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <input
                type="text"
                value={deal.searchCriteria.departureLocation}
                onChange={(e) => updateDeal('searchCriteria.departureLocation', e.target.value)}
                placeholder="City or Airport"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <input
                type="text"
                value={deal.searchCriteria.destination}
                onChange={(e) => updateDeal('searchCriteria.destination', e.target.value)}
                placeholder="City or Airport"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={deal.searchCriteria.departureDate.toISOString().split('T')[0]}
                onChange={(e) => updateDeal('searchCriteria.departureDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Travelers
              </label>
              <div className="flex gap-1">
                <select
                  value={deal.searchCriteria.travelers.adults}
                  onChange={(e) => updateDeal('searchCriteria.travelers.adults', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={deal.searchCriteria.travelers.children}
                  onChange={(e) => updateDeal('searchCriteria.travelers.children', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deal Types
              </label>
              <div className="flex flex-wrap gap-1">
                {dealTypes.slice(0, 4).map((dealType) => (
                  <button
                    key={dealType.id}
                    onClick={() => {
                      const currentTypes = deal.searchCriteria.dealTypes;
                      const newTypes = currentTypes.includes(dealType.id)
                        ? currentTypes.filter(t => t !== dealType.id)
                        : [...currentTypes, dealType.id];
                      updateDeal('searchCriteria.dealTypes', newTypes);
                    }}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                      deal.searchCriteria.dealTypes.includes(dealType.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {dealType.icon} {dealType.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={deal.searchCriteria.maxPrice}
                onChange={(e) => updateDeal('searchCriteria.maxPrice', parseInt(e.target.value))}
                placeholder="Maximum price"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urgency
              </label>
              <select
                value={deal.searchCriteria.urgency}
                onChange={(e) => updateDeal('searchCriteria.urgency', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {urgencyLevels.map((urgency) => (
                  <option key={urgency.id} value={urgency.id}>
                    {urgency.icon} {urgency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deal.searchCriteria.flexibility.dates}
                onChange={(e) => updateDeal('searchCriteria.flexibility.dates', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flexible dates</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deal.searchCriteria.flexibility.destination}
                onChange={(e) => updateDeal('searchCriteria.flexibility.destination', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flexible destination</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={deal.searchCriteria.preferences.directFlights}
                onChange={(e) => updateDeal('searchCriteria.preferences.directFlights', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Direct flights only</span>
            </label>
          </div>
          
          <button
            onClick={searchDeals}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Deals'}
          </button>
        </div>

        {/* Deal Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {deal.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Deals Found</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {deal.selectedDeals.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {deal.bookings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {deal.alerts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Alerts</div>
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
          {activeTab === 'deals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Last-Minute Deals
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {deal.searchResults.length} deals found
                </div>
              </div>
              
              <div className="space-y-3">
                {deal.searchResults.map((dealItem) => (
                  <div key={dealItem.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getDealTypeIcon(dealItem.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {dealItem.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {dealItem.provider.name} • {dealItem.destination.name}, {dealItem.destination.country}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-md',
                              `bg-${getUrgencyColor(dealItem.urgency.level)}-100 dark:bg-${getUrgencyColor(dealItem.urgency.level)}-900`,
                              `text-${getUrgencyColor(dealItem.urgency.level)}-600 dark:text-${getUrgencyColor(dealItem.urgency.level)}-400`
                            )}>
                              {getUrgencyIcon(dealItem.urgency.level)} {getUrgencyName(dealItem.urgency.level)}
                            </span>
                            {dealItem.urgency.isExpiring && (
                              <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-md">
                                ⏰ Expires in {formatTimeRemaining(dealItem.urgency.timeRemaining)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(dealItem.pricing.discountedPrice, dealItem.pricing.currency)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {formatCurrency(dealItem.pricing.originalPrice, dealItem.pricing.currency)}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          Save {dealItem.pricing.savingsPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {dealItem.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Deal Details:</h5>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {dealItem.provider.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Available:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {dealItem.availability.availableCount} left
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {dealItem.rating.overall}/5 ({dealItem.rating.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Savings:</h5>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Original Price:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(dealItem.pricing.originalPrice, dealItem.pricing.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Discounted Price:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatCurrency(dealItem.pricing.discountedPrice, dealItem.pricing.currency)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>You Save:</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(dealItem.pricing.savings, dealItem.pricing.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {dealItem.inclusions.slice(0, 3).map((inclusion) => (
                          <span
                            key={inclusion.id}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {inclusion.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                          Details
                        </button>
                        <button
                          onClick={() => selectDeal(dealItem.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                My Bookings
              </h3>
              
              {deal.bookings.length > 0 ? (
                <div className="space-y-3">
                  {deal.bookings.map((booking) => (
                    <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getDealTypeIcon(booking.selectedDeal.deal.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {booking.selectedDeal.deal.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Booking: {booking.bookingNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(booking.totalAmount, booking.currency)}
                          </div>
                          <div className={cn(
                            'text-sm font-medium',
                            booking.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                            booking.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <div className="flex justify-between">
                            <span>Travel Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(booking.travelDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Destination:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.selectedDeal.deal.destination.name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Travelers:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.selectedDeal.travelers.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(booking.bookingDate)}
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
                    No bookings yet
                  </h3>
                  <p>Book last-minute deals to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && showAlerts && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Price Alerts
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No alerts set up yet
                </h3>
                <p>Set up price alerts to get notified of great deals</p>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Deals
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No favorite deals yet
                </h3>
                <p>Save deals you like to your favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

LastMinuteDeals.displayName = 'LastMinuteDeals';

// Last-minute Deals Demo Component
interface LastMinuteDealsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const LastMinuteDealsDemo = React.forwardRef<HTMLDivElement, LastMinuteDealsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [deal, setDeal] = useState<Partial<LastMinuteDealData>>({});

    const handleDealUpdate = (updatedDeal: LastMinuteDealData) => {
      setDeal(updatedDeal);
      console.log('Last-minute deal updated:', updatedDeal);
    };

    const mockDeal: Partial<LastMinuteDealData> = {
      id: 'last-minute-deal-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        departureLocation: 'New York',
        destination: 'Paris',
        departureDate: new Date('2024-06-15'),
        travelers: { adults: 2, children: 0 },
        dealTypes: [],
        maxPrice: 1000,
        currency: 'USD',
        urgency: 'within-24h',
        flexibility: {
          dates: true,
          destination: true,
          departure: true
        },
        preferences: {
          directFlights: false,
          specificAirlines: [],
          hotelRating: 3,
          allInclusive: false
        }
      },
      searchResults: [],
      selectedDeals: [],
      bookings: [],
      alerts: [],
      favorites: [],
      settings: {
        preferredDealTypes: [],
        maxPrice: 1000,
        currency: 'USD',
        urgencyLevel: 'within-24h',
        flexibility: {
          dates: true,
          destination: true,
          departure: true
        },
        preferences: {
          directFlights: false,
          specificAirlines: [],
          hotelRating: 3,
          allInclusive: false
        },
        notifications: {
          newDeals: true,
          priceDrops: true,
          urgentDeals: true,
          expirationAlerts: true
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
          Last-minute Deals Demo
        </h3>
        
        <LastMinuteDeals
          onDealUpdate={handleDealUpdate}
          initialDeal={mockDeal}
          showFilters={true}
          showAlerts={true}
          showCountdown={true}
          showSavings={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive last-minute deal discovery with urgency tracking, countdown timers, savings calculation, and instant booking.
            </p>
          </div>
        )}
      </div>
    );
  }
);

LastMinuteDealsDemo.displayName = 'LastMinuteDealsDemo';

// Export all components
export {
  lastMinuteDealsVariants,
  type LastMinuteDealsProps,
  type LastMinuteDealData,
  type DealSearchCriteria,
  type DealResult,
  type DealProvider,
  type DealDestination,
  type DealPricing,
  type DealAvailability,
  type DealUrgency,
  type DealRestriction,
  type DealInclusion,
  type DealExclusion,
  type DealReview,
  type DealImage,
  type SelectedDeal,
  type TravelerInfo,
  type SelectedOption,
  type DealBooking,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type DealAlert,
  type DealAlertNotification,
  type LastMinuteDealSettings,
  type LastMinuteDealsDemoProps
};
