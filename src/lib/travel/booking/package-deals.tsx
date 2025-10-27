/**
 * Package Deals Component
 * 
 * Provides travel package deals and bundles for Atlas travel agent.
 * Implements package search, comparison, and booking for comprehensive travel packages.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Package Deals Variants
const packageDealsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'package-deals-mode-standard',
        'enhanced': 'package-deals-mode-enhanced',
        'advanced': 'package-deals-mode-advanced',
        'custom': 'package-deals-mode-custom'
      },
      type: {
        'budget': 'package-type-budget',
        'mid-range': 'package-type-mid-range',
        'luxury': 'package-type-luxury',
        'mixed': 'package-type-mixed'
      },
      style: {
        'minimal': 'package-style-minimal',
        'moderate': 'package-style-moderate',
        'detailed': 'package-style-detailed',
        'custom': 'package-style-custom'
      },
      format: {
        'text': 'package-format-text',
        'visual': 'package-format-visual',
        'interactive': 'package-format-interactive',
        'mixed': 'package-format-mixed'
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

// Package Deals Props
interface PackageDealsProps extends VariantProps<typeof packageDealsVariants> {
  className?: string;
  onPackageUpdate?: (packageDeal: PackageDealData) => void;
  initialPackage?: Partial<PackageDealData>;
  showFilters?: boolean;
  showComparison?: boolean;
  showSavings?: boolean;
  showCustomization?: boolean;
}

// Package Deal Data Interface
interface PackageDealData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: PackageSearchCriteria;
  searchResults: PackageResult[];
  selectedPackages: SelectedPackage[];
  bookings: PackageBooking[];
  favorites: string[];
  settings: PackageDealSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Package Search Criteria Interface
interface PackageSearchCriteria {
  destination: string;
  departureDate: Date;
  returnDate: Date;
  travelers: {
    adults: number;
    children: number;
    seniors: number;
  };
  packageTypes: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  duration: {
    min: number; // in days
    max: number; // in days
  };
  inclusions: string[];
  preferences: {
    allInclusive: boolean;
    beachResort: boolean;
    cityBreak: boolean;
    adventure: boolean;
    cultural: boolean;
    romantic: boolean;
    family: boolean;
  };
  flexibleDates: boolean;
}

// Package Result Interface
interface PackageResult {
  id: string;
  name: string;
  description: string;
  type: 'flight-hotel' | 'all-inclusive' | 'city-break' | 'adventure' | 'cruise' | 'custom';
  provider: PackageProvider;
  destination: PackageDestination;
  pricing: PackagePricing;
  inclusions: PackageInclusion[];
  exclusions: PackageExclusion[];
  itinerary: PackageItinerary[];
  accommodations: PackageAccommodation[];
  transportation: PackageTransportation[];
  activities: PackageActivity[];
  policies: PackagePolicy[];
  rating: {
    overall: number;
    value: number;
    accommodations: number;
    activities: number;
    service: number;
    reviewCount: number;
  };
  reviews: PackageReview[];
  images: PackageImage[];
  availability: PackageAvailability;
  lastUpdated: Date;
}

// Package Provider Interface
interface PackageProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  specialties: string[];
  destinations: string[];
  yearsInBusiness: number;
}

// Package Destination Interface
interface PackageDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  climate: string;
  bestTimeToVisit: string[];
  highlights: string[];
  attractions: string[];
  culture: string;
  language: string[];
  currency: string;
  timezone: string;
}

// Package Pricing Interface
interface PackagePricing {
  basePrice: number;
  adultPrice: number;
  childPrice: number;
  seniorPrice: number;
  taxes: number;
  fees: {
    bookingFee: number;
    serviceFee: number;
    resortFee: number;
  };
  total: number;
  currency: string;
  savings: PackageSavings;
  paymentMethods: string[];
  depositRequired: boolean;
  depositAmount: number;
  cancellationPolicy: string;
  refundPolicy: string;
}

// Package Savings Interface
interface PackageSavings {
  originalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  savingsBreakdown: {
    flight: number;
    hotel: number;
    activities: number;
    meals: number;
    transportation: number;
  };
}

// Package Inclusion Interface
interface PackageInclusion {
  id: string;
  category: 'flight' | 'accommodation' | 'meals' | 'activities' | 'transportation' | 'insurance' | 'other';
  name: string;
  description: string;
  value: number;
  currency: string;
  isOptional: boolean;
}

// Package Exclusion Interface
interface PackageExclusion {
  id: string;
  category: string;
  name: string;
  description: string;
  estimatedCost: number;
  currency: string;
}

// Package Itinerary Interface
interface PackageItinerary {
  id: string;
  day: number;
  date: Date;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodations: string;
  transportation: string;
  highlights: string[];
}

// Package Accommodation Interface
interface PackageAccommodation {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'villa' | 'apartment' | 'hostel' | 'camping';
  rating: number;
  location: string;
  amenities: string[];
  roomType: string;
  occupancy: number;
  images: string[];
  description: string;
}

// Package Transportation Interface
interface PackageTransportation {
  id: string;
  type: 'flight' | 'bus' | 'train' | 'car' | 'transfer' | 'cruise';
  provider: string;
  route: string;
  departure: {
    location: string;
    time: string;
    date: Date;
  };
  arrival: {
    location: string;
    time: string;
    date: Date;
  };
  duration: number; // in minutes
  class: string;
  amenities: string[];
}

// Package Activity Interface
interface PackageActivity {
  id: string;
  name: string;
  type: 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'dining' | 'entertainment';
  description: string;
  duration: number; // in hours
  location: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  ageRestrictions: {
    minAge: number;
    maxAge?: number;
  };
  inclusions: string[];
  exclusions: string[];
  price: number;
  currency: string;
}

// Package Policy Interface
interface PackagePolicy {
  id: string;
  type: 'cancellation' | 'refund' | 'change' | 'age' | 'health' | 'travel';
  title: string;
  description: string;
  isImportant: boolean;
  restrictions: string[];
}

// Package Review Interface
interface PackageReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  packageType: string;
  travelDate: Date;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple' | 'group';
  photos: string[];
}

// Package Image Interface
interface PackageImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'destination' | 'accommodation' | 'activity' | 'food' | 'transportation';
  isPrimary: boolean;
}

// Package Availability Interface
interface PackageAvailability {
  isAvailable: boolean;
  availableDates: Date[];
  maxTravelers: number;
  minTravelers: number;
  blackoutDates: Date[];
  seasonalAvailability: SeasonalAvailability[];
  lastUpdated: Date;
}

// Seasonal Availability Interface
interface SeasonalAvailability {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
  priceMultiplier: number;
}

// Selected Package Interface
interface SelectedPackage {
  id: string;
  packageId: string;
  package: PackageResult;
  travelers: TravelerInfo[];
  selectedDates: {
    departure: Date;
    return: Date;
  };
  customizations: PackageCustomization[];
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
  type: 'adult' | 'child' | 'senior';
  specialRequests: string[];
  dietaryRestrictions: string[];
  isPrimary: boolean;
}

// Package Customization Interface
interface PackageCustomization {
  id: string;
  category: 'accommodation' | 'activities' | 'meals' | 'transportation' | 'extras';
  name: string;
  description: string;
  price: number;
  currency: string;
  isOptional: boolean;
  isSelected: boolean;
}

// Package Booking Interface
interface PackageBooking {
  id: string;
  bookingNumber: string;
  selectedPackage: SelectedPackage;
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
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'special-offer';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Package Deal Settings Interface
interface PackageDealSettings {
  preferredTypes: string[];
  preferredProviders: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  durationPreference: {
    min: number;
    max: number;
  };
  inclusions: string[];
  preferences: {
    allInclusive: boolean;
    beachResort: boolean;
    cityBreak: boolean;
    adventure: boolean;
    cultural: boolean;
    romantic: boolean;
    family: boolean;
  };
  notifications: {
    priceDrops: boolean;
    newDeals: boolean;
    reminderNotifications: boolean;
    specialOffers: boolean;
  };
}

// Package Deals Component
export const PackageDeals = React.forwardRef<HTMLDivElement, PackageDealsProps>(
  ({ 
    className, 
    onPackageUpdate,
    initialPackage,
    showFilters = true,
    showComparison = true,
    showSavings = true,
    showCustomization = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [packageDeal, setPackageDeal] = useState<PackageDealData>(
      initialPackage || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          destination: '',
          departureDate: new Date(),
          returnDate: new Date(),
          travelers: { adults: 2, children: 0, seniors: 0 },
          packageTypes: [],
          priceRange: { min: 0, max: 5000, currency: 'USD' },
          duration: { min: 3, max: 14 },
          inclusions: [],
          preferences: {
            allInclusive: false,
            beachResort: false,
            cityBreak: false,
            adventure: false,
            cultural: false,
            romantic: false,
            family: false
          },
          flexibleDates: false
        },
        searchResults: [],
        selectedPackages: [],
        bookings: [],
        favorites: [],
        settings: {
          preferredTypes: [],
          preferredProviders: [],
          priceRange: { min: 0, max: 5000, currency: 'USD' },
          durationPreference: { min: 3, max: 14 },
          inclusions: [],
          preferences: {
            allInclusive: false,
            beachResort: false,
            cityBreak: false,
            adventure: false,
            cultural: false,
            romantic: false,
            family: false
          },
          notifications: {
            priceDrops: true,
            newDeals: true,
            reminderNotifications: true,
            specialOffers: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '📦' },
      { id: 'comparison', name: 'Comparison', icon: '⚖️' },
      { id: 'bookings', name: 'Bookings', icon: '🎫' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' }
    ];

    const packageTypes = [
      { id: 'flight-hotel', name: 'Flight + Hotel', icon: '✈️🏨', color: 'blue' },
      { id: 'all-inclusive', name: 'All Inclusive', icon: '🍽️', color: 'green' },
      { id: 'city-break', name: 'City Break', icon: '🏙️', color: 'purple' },
      { id: 'adventure', name: 'Adventure', icon: '🏔️', color: 'orange' },
      { id: 'cruise', name: 'Cruise', icon: '🚢', color: 'cyan' },
      { id: 'custom', name: 'Custom', icon: '🎨', color: 'pink' }
    ];

    const inclusions = [
      { id: 'flight', name: 'Flights', icon: '✈️', category: 'transportation' },
      { id: 'hotel', name: 'Accommodation', icon: '🏨', category: 'accommodation' },
      { id: 'meals', name: 'Meals', icon: '🍽️', category: 'meals' },
      { id: 'activities', name: 'Activities', icon: '🎯', category: 'activities' },
      { id: 'transfers', name: 'Transfers', icon: '🚐', category: 'transportation' },
      { id: 'insurance', name: 'Travel Insurance', icon: '🛡️', category: 'insurance' },
      { id: 'tours', name: 'Guided Tours', icon: '👨‍🏫', category: 'activities' },
      { id: 'entertainment', name: 'Entertainment', icon: '🎭', category: 'activities' }
    ];

    const destinations = [
      { id: 'paris', name: 'Paris', country: 'France', icon: '🗼', color: 'blue' },
      { id: 'rome', name: 'Rome', country: 'Italy', icon: '🏛️', color: 'green' },
      { id: 'london', name: 'London', country: 'UK', icon: '🏰', color: 'purple' },
      { id: 'tokyo', name: 'Tokyo', country: 'Japan', icon: '🗾', color: 'red' },
      { id: 'barcelona', name: 'Barcelona', country: 'Spain', icon: '🏛️', color: 'orange' },
      { id: 'new-york', name: 'New York', country: 'USA', icon: '🗽', color: 'cyan' }
    ];

    const updatePackage = useCallback((path: string, value: any) => {
      setPackageDeal(prev => {
        const newPackage = { ...prev };
        const keys = path.split('.');
        let current: any = newPackage;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newPackage.updatedAt = new Date();
        onPackageUpdate?.(newPackage);
        return newPackage;
      });
    }, [onPackageUpdate]);

    const searchPackages = useCallback(() => {
      setIsSearching(true);
      // Simulate package search
      setTimeout(() => {
        const mockResults: PackageResult[] = [
          {
            id: 'package-1',
            name: 'Paris Romance Package',
            description: 'Perfect romantic getaway to the City of Light with luxury accommodations and exclusive experiences.',
            type: 'city-break',
            provider: {
              id: 'provider-1',
              name: 'Luxury Travel Co.',
              logo: '✨',
              description: 'Premium travel packages for discerning travelers',
              rating: 4.8,
              reviewCount: 1200,
              verified: true,
              contact: {
                phone: '+1-800-LUXURY-1',
                email: 'info@luxurytravel.com',
                website: 'https://luxurytravel.com'
              },
              specialties: ['luxury', 'romantic', 'city-breaks'],
              destinations: ['Paris', 'Rome', 'London'],
              yearsInBusiness: 15
            },
            destination: {
              id: 'destination-1',
              name: 'Paris',
              country: 'France',
              region: 'Île-de-France',
              coordinates: { lat: 48.8566, lng: 2.3522 },
              climate: 'Temperate',
              bestTimeToVisit: ['Spring', 'Summer', 'Autumn'],
              highlights: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
              attractions: ['Champs-Élysées', 'Montmartre', 'Seine River'],
              culture: 'Rich history and art',
              language: ['French'],
              currency: 'EUR',
              timezone: 'CET'
            },
            pricing: {
              basePrice: 2500,
              adultPrice: 2500,
              childPrice: 1500,
              seniorPrice: 2200,
              taxes: 300,
              fees: {
                bookingFee: 50,
                serviceFee: 75,
                resortFee: 0
              },
              total: 2925,
              currency: 'USD',
              savings: {
                originalPrice: 3500,
                discountAmount: 575,
                discountPercentage: 16.4,
                savingsBreakdown: {
                  flight: 200,
                  hotel: 250,
                  activities: 100,
                  meals: 25,
                  transportation: 0
                }
              },
              paymentMethods: ['credit-card', 'paypal'],
              depositRequired: true,
              depositAmount: 500,
              cancellationPolicy: 'Free cancellation up to 30 days before departure',
              refundPolicy: 'Full refund minus deposit'
            },
            inclusions: [
              {
                id: 'incl-1',
                category: 'flight',
                name: 'Round-trip flights',
                description: 'Economy class flights from major US cities',
                value: 800,
                currency: 'USD',
                isOptional: false
              },
              {
                id: 'incl-2',
                category: 'accommodation',
                name: '4-star hotel',
                description: '3 nights in a 4-star hotel in central Paris',
                value: 600,
                currency: 'USD',
                isOptional: false
              },
              {
                id: 'incl-3',
                category: 'activities',
                name: 'City tour',
                description: 'Half-day guided city tour',
                value: 150,
                currency: 'USD',
                isOptional: false
              }
            ],
            exclusions: [],
            itinerary: [],
            accommodations: [],
            transportation: [],
            activities: [],
            policies: [],
            rating: {
              overall: 4.7,
              value: 4.5,
              accommodations: 4.8,
              activities: 4.6,
              service: 4.7,
              reviewCount: 450
            },
            reviews: [],
            images: [],
            availability: {
              isAvailable: true,
              availableDates: [],
              maxTravelers: 8,
              minTravelers: 2,
              blackoutDates: [],
              seasonalAvailability: [],
              lastUpdated: new Date()
            },
            lastUpdated: new Date()
          }
        ];
        updatePackage('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updatePackage]);

    const selectPackage = useCallback((packageId: string) => {
      const packageItem = packageDeal.searchResults.find(p => p.id === packageId);
      if (!packageItem) return;

      const selectedPackage: SelectedPackage = {
        id: `selected-${Date.now()}`,
        packageId: packageItem.id,
        package: packageItem,
        travelers: [],
        selectedDates: {
          departure: packageDeal.searchCriteria.departureDate,
          return: packageDeal.searchCriteria.returnDate
        },
        customizations: [],
        totalPrice: packageItem.pricing.total,
        currency: packageItem.pricing.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updatePackage('selectedPackages', [...packageDeal.selectedPackages, selectedPackage]);
    }, [packageDeal.searchResults, packageDeal.selectedPackages, packageDeal.searchCriteria, updatePackage]);

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

    const getPackageTypeIcon = (type: string) => {
      const packageType = packageTypes.find(t => t.id === type);
      return packageType?.icon || '📦';
    };

    const getPackageTypeName = (type: string) => {
      const packageType = packageTypes.find(t => t.id === type);
      return packageType?.name || type;
    };

    const getInclusionIcon = (inclusionId: string) => {
      const inclusion = inclusions.find(i => i.id === inclusionId);
      return inclusion?.icon || '📦';
    };

    const getInclusionName = (inclusionId: string) => {
      const inclusion = inclusions.find(i => i.id === inclusionId);
      return inclusion?.name || inclusionId;
    };

    const getDestinationIcon = (destinationId: string) => {
      const destination = destinations.find(d => d.id === destinationId);
      return destination?.icon || '🌍';
    };

    const getDestinationName = (destinationId: string) => {
      const destination = destinations.find(d => d.id === destinationId);
      return destination?.name || destinationId;
    };

    const calculateSavings = (originalPrice: number, currentPrice: number) => {
      const savings = originalPrice - currentPrice;
      const percentage = (savings / originalPrice) * 100;
      return { amount: savings, percentage };
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          packageDealsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Package Deals
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover amazing travel packages and save big
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
              🎫 My Bookings
            </button>
          </div>
        </div>

        {/* Package Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Package Deals
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={packageDeal.searchCriteria.destination}
                onChange={(e) => updatePackage('searchCriteria.destination', e.target.value)}
                placeholder="City or country"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={packageDeal.searchCriteria.departureDate.toISOString().split('T')[0]}
                onChange={(e) => updatePackage('searchCriteria.departureDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={packageDeal.searchCriteria.returnDate.toISOString().split('T')[0]}
                onChange={(e) => updatePackage('searchCriteria.returnDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Travelers
              </label>
              <div className="flex gap-1">
                <select
                  value={packageDeal.searchCriteria.travelers.adults}
                  onChange={(e) => updatePackage('searchCriteria.travelers.adults', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={packageDeal.searchCriteria.travelers.children}
                  onChange={(e) => updatePackage('searchCriteria.travelers.children', parseInt(e.target.value))}
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
                Package Types
              </label>
              <div className="flex flex-wrap gap-1">
                {packageTypes.slice(0, 4).map((packageType) => (
                  <button
                    key={packageType.id}
                    onClick={() => {
                      const currentTypes = packageDeal.searchCriteria.packageTypes;
                      const newTypes = currentTypes.includes(packageType.id)
                        ? currentTypes.filter(t => t !== packageType.id)
                        : [...currentTypes, packageType.id];
                      updatePackage('searchCriteria.packageTypes', newTypes);
                    }}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                      packageDeal.searchCriteria.packageTypes.includes(packageType.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {packageType.icon} {packageType.name}
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
                  value={packageDeal.searchCriteria.priceRange.min}
                  onChange={(e) => updatePackage('searchCriteria.priceRange.min', parseInt(e.target.value))}
                  placeholder="Min"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <input
                  type="number"
                  value={packageDeal.searchCriteria.priceRange.max}
                  onChange={(e) => updatePackage('searchCriteria.priceRange.max', parseInt(e.target.value))}
                  placeholder="Max"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration
              </label>
              <div className="flex gap-2">
                <select
                  value={packageDeal.searchCriteria.duration.min}
                  onChange={(e) => updatePackage('searchCriteria.duration.min', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value={1}>1+ days</option>
                  <option value={3}>3+ days</option>
                  <option value={7}>7+ days</option>
                  <option value={14}>14+ days</option>
                </select>
                <select
                  value={packageDeal.searchCriteria.duration.max}
                  onChange={(e) => updatePackage('searchCriteria.duration.max', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value={3}>Up to 3 days</option>
                  <option value={7}>Up to 7 days</option>
                  <option value={14}>Up to 14 days</option>
                  <option value={30}>Up to 30 days</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={packageDeal.searchCriteria.preferences.allInclusive}
                onChange={(e) => updatePackage('searchCriteria.preferences.allInclusive', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">All inclusive</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={packageDeal.searchCriteria.preferences.beachResort}
                onChange={(e) => updatePackage('searchCriteria.preferences.beachResort', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Beach resort</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={packageDeal.searchCriteria.flexibleDates}
                onChange={(e) => updatePackage('searchCriteria.flexibleDates', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flexible dates</span>
            </label>
          </div>
          
          <button
            onClick={searchPackages}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Packages'}
          </button>
        </div>

        {/* Package Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {packageDeal.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {packageDeal.selectedPackages.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {packageDeal.bookings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {packageDeal.favorites.length}
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
                  Package Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {packageDeal.searchResults.length} packages found
                </div>
              </div>
              
              <div className={cn(
                'gap-4',
                viewMode === 'list' && 'space-y-3',
                viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                viewMode === 'map' && 'grid grid-cols-1 lg:grid-cols-2'
              )}>
                {packageDeal.searchResults.map((packageItem) => (
                  <div key={packageItem.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {viewMode === 'grid' && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">{getPackageTypeIcon(packageItem.type)}</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{packageItem.provider.logo}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {packageItem.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {packageItem.provider.name} • {getPackageTypeName(packageItem.type)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {packageItem.destination.name}, {packageItem.destination.country}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(packageItem.pricing.total, packageItem.pricing.currency)}
                          </div>
                          {packageItem.pricing.savings.discountAmount > 0 && (
                            <div className="text-sm text-green-600 dark:text-green-400">
                              Save {formatCurrency(packageItem.pricing.savings.discountAmount, packageItem.pricing.currency)}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {packageItem.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {packageItem.rating.overall}/5 ({packageItem.rating.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {packageItem.searchCriteria?.duration || '3-7 days'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Savings:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {packageItem.pricing.savings.discountPercentage.toFixed(1)}% off
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {packageItem.inclusions.slice(0, 3).map((inclusion) => (
                            <span
                              key={inclusion.id}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                              {getInclusionIcon(inclusion.category)} {getInclusionName(inclusion.category)}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                            Details
                          </button>
                          <button
                            onClick={() => selectPackage(packageItem.id)}
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

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                My Bookings
              </h3>
              
              {packageDeal.bookings.length > 0 ? (
                <div className="space-y-3">
                  {packageDeal.bookings.map((booking) => (
                    <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{booking.selectedPackage.package.provider.logo}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {booking.selectedPackage.package.name}
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
                              {booking.selectedPackage.package.destination.name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Travelers:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.selectedPackage.travelers.length}
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
                  <p>Search and book packages to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Packages
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No favorite packages yet
                </h3>
                <p>Save packages you like to your favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

PackageDeals.displayName = 'PackageDeals';

// Package Deals Demo Component
interface PackageDealsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PackageDealsDemo = React.forwardRef<HTMLDivElement, PackageDealsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [packageDeal, setPackageDeal] = useState<Partial<PackageDealData>>({});

    const handlePackageUpdate = (updatedPackage: PackageDealData) => {
      setPackageDeal(updatedPackage);
      console.log('Package deal updated:', updatedPackage);
    };

    const mockPackage: Partial<PackageDealData> = {
      id: 'package-deal-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        destination: 'Paris',
        departureDate: new Date('2024-06-15'),
        returnDate: new Date('2024-06-22'),
        travelers: { adults: 2, children: 0, seniors: 0 },
        packageTypes: [],
        priceRange: { min: 0, max: 3000, currency: 'USD' },
        duration: { min: 3, max: 14 },
        inclusions: [],
        preferences: {
          allInclusive: false,
          beachResort: false,
          cityBreak: true,
          adventure: false,
          cultural: true,
          romantic: true,
          family: false
        },
        flexibleDates: false
      },
      searchResults: [],
      selectedPackages: [],
      bookings: [],
      favorites: [],
      settings: {
        preferredTypes: [],
        preferredProviders: [],
        priceRange: { min: 0, max: 3000, currency: 'USD' },
        durationPreference: { min: 3, max: 14 },
        inclusions: [],
        preferences: {
          allInclusive: false,
          beachResort: false,
          cityBreak: true,
          adventure: false,
          cultural: true,
          romantic: true,
          family: false
        },
        notifications: {
          priceDrops: true,
          newDeals: true,
          reminderNotifications: true,
          specialOffers: true
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
          Package Deals Demo
        </h3>
        
        <PackageDeals
          onPackageUpdate={handlePackageUpdate}
          initialPackage={mockPackage}
          showFilters={true}
          showComparison={true}
          showSavings={true}
          showCustomization={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive travel package deals with search, comparison, savings calculation, and customization options.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PackageDealsDemo.displayName = 'PackageDealsDemo';

// Export all components
export {
  packageDealsVariants,
  type PackageDealsProps,
  type PackageDealData,
  type PackageSearchCriteria,
  type PackageResult,
  type PackageProvider,
  type PackageDestination,
  type PackagePricing,
  type PackageSavings,
  type PackageInclusion,
  type PackageExclusion,
  type PackageItinerary,
  type PackageAccommodation,
  type PackageTransportation,
  type PackageActivity,
  type PackagePolicy,
  type PackageReview,
  type PackageImage,
  type PackageAvailability,
  type SeasonalAvailability,
  type SelectedPackage,
  type TravelerInfo,
  type PackageCustomization,
  type PackageBooking,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type PackageDealSettings,
  type PackageDealsDemoProps
};
