/**
 * Car Rentals Component
 * 
 * Provides car rental search, comparison, and booking for Atlas travel agent.
 * Implements car search, price comparison, vehicle selection, and rental management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Car Rentals Variants
const carRentalsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'car-rentals-mode-standard',
        'enhanced': 'car-rentals-mode-enhanced',
        'advanced': 'car-rentals-mode-advanced',
        'custom': 'car-rentals-mode-custom'
      },
      type: {
        'economy': 'car-type-economy',
        'luxury': 'car-type-luxury',
        'suv': 'car-type-suv',
        'mixed': 'car-type-mixed'
      },
      style: {
        'minimal': 'car-style-minimal',
        'moderate': 'car-style-moderate',
        'detailed': 'car-style-detailed',
        'custom': 'car-style-custom'
      },
      format: {
        'text': 'car-format-text',
        'visual': 'car-format-visual',
        'interactive': 'car-format-interactive',
        'mixed': 'car-format-mixed'
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

// Car Rentals Props
interface CarRentalsProps extends VariantProps<typeof carRentalsVariants> {
  className?: string;
  onRentalUpdate?: (rental: CarRentalData) => void;
  initialRental?: Partial<CarRentalData>;
  showFilters?: boolean;
  showComparison?: boolean;
  showInsurance?: boolean;
  showExtras?: boolean;
}

// Car Rental Data Interface
interface CarRentalData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: CarSearchCriteria;
  searchResults: CarResult[];
  selectedCars: SelectedCar[];
  rentals: CarRental[];
  favorites: string[];
  settings: CarRentalSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Car Search Criteria Interface
interface CarSearchCriteria {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
  driverAge: number;
  driverLicense: string;
  carType: string[];
  transmission: 'manual' | 'automatic' | 'any';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric' | 'any';
  seats: number;
  luggage: number;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  features: string[];
  instantBooking: boolean;
}

// Car Result Interface
interface CarResult {
  id: string;
  provider: string;
  vehicle: Vehicle;
  location: RentalLocation;
  pricing: CarPricing;
  availability: CarAvailability;
  policies: CarPolicy[];
  extras: CarExtra[];
  insurance: InsuranceOption[];
  rating: {
    overall: number;
    cleanliness: number;
    condition: number;
    service: number;
    value: number;
    reviewCount: number;
  };
  reviews: CarReview[];
  bookingUrl: string;
  lastUpdated: Date;
}

// Vehicle Interface
interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  category: 'economy' | 'compact' | 'intermediate' | 'standard' | 'full-size' | 'premium' | 'luxury' | 'suv' | 'minivan' | 'convertible';
  type: 'sedan' | 'hatchback' | 'suv' | 'coupe' | 'convertible' | 'wagon' | 'pickup' | 'van';
  transmission: 'manual' | 'automatic';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  engineSize: string;
  power: number; // in HP
  seats: number;
  doors: number;
  luggage: number; // in bags
  features: string[];
  images: VehicleImage[];
  specifications: VehicleSpecification[];
}

// Vehicle Image Interface
interface VehicleImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'exterior' | 'interior' | 'dashboard' | 'trunk' | 'engine' | 'other';
  isPrimary: boolean;
}

// Vehicle Specification Interface
interface VehicleSpecification {
  id: string;
  name: string;
  value: string;
  unit?: string;
  category: 'performance' | 'safety' | 'comfort' | 'technology' | 'dimensions';
}

// Rental Location Interface
interface RentalLocation {
  id: string;
  name: string;
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
  phone: string;
  email: string;
  hours: {
    open: string;
    close: string;
    timezone: string;
  };
  amenities: string[];
  pickupInstructions: string;
  dropoffInstructions: string;
}

// Car Pricing Interface
interface CarPricing {
  baseRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  taxes: number;
  fees: {
    airportFee: number;
    youngDriverFee: number;
    additionalDriverFee: number;
    gpsFee: number;
    childSeatFee: number;
  };
  total: number;
  currency: string;
  mileage: {
    included: number;
    overageRate: number;
    unlimited: boolean;
  };
  fuel: {
    policy: 'full-to-full' | 'pre-purchase' | 'empty-to-empty';
    price: number;
  };
  deposit: number;
  cancellationPolicy: string;
}

// Car Availability Interface
interface CarAvailability {
  isAvailable: boolean;
  availableCount: number;
  lastUpdated: Date;
  restrictions: string[];
  minimumRentalPeriod: number; // in days
  maximumRentalPeriod: number; // in days
}

// Car Policy Interface
interface CarPolicy {
  id: string;
  type: 'age' | 'license' | 'insurance' | 'mileage' | 'fuel' | 'damage' | 'cancellation';
  title: string;
  description: string;
  isImportant: boolean;
  restrictions: string[];
}

// Car Extra Interface
interface CarExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: 'equipment' | 'service' | 'insurance' | 'convenience';
  isRequired: boolean;
  isPopular: boolean;
  availability: boolean;
}

// Insurance Option Interface
interface InsuranceOption {
  id: string;
  name: string;
  type: 'collision' | 'liability' | 'comprehensive' | 'personal' | 'roadside';
  coverage: string;
  deductible: number;
  price: number;
  currency: string;
  isRequired: boolean;
  isRecommended: boolean;
}

// Car Review Interface
interface CarReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  vehicle: string;
  rentalDate: Date;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple';
}

// Selected Car Interface
interface SelectedCar {
  id: string;
  carId: string;
  car: CarResult;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
  driver: DriverInfo;
  additionalDrivers: DriverInfo[];
  extras: SelectedExtra[];
  insurance: SelectedInsurance[];
  totalPrice: number;
  currency: string;
  specialRequests: string[];
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Driver Info Interface
interface DriverInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseCountry: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  age: number;
}

// Selected Extra Interface
interface SelectedExtra {
  id: string;
  extraId: string;
  extra: CarExtra;
  quantity: number;
  totalPrice: number;
  currency: string;
}

// Selected Insurance Interface
interface SelectedInsurance {
  id: string;
  insuranceId: string;
  insurance: InsuranceOption;
  price: number;
  currency: string;
}

// Car Rental Interface
interface CarRental {
  id: string;
  rentalNumber: string;
  selectedCar: SelectedCar;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  confirmationNumber: string;
  bookingDate: Date;
  pickupDate: Date;
  dropoffDate: Date;
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
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'pickup';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Car Rental Settings Interface
interface CarRentalSettings {
  preferredProviders: string[];
  preferredCarTypes: string[];
  transmissionPreference: string;
  fuelTypePreference: string;
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  features: string[];
  insurancePreferences: string[];
  extrasPreferences: string[];
  instantBooking: boolean;
  notifications: {
    priceDrops: boolean;
    availabilityChanges: boolean;
    pickupReminders: boolean;
    returnReminders: boolean;
  };
}

// Car Rentals Component
export const CarRentals = React.forwardRef<HTMLDivElement, CarRentalsProps>(
  ({ 
    className, 
    onRentalUpdate,
    initialRental,
    showFilters = true,
    showComparison = true,
    showInsurance = true,
    showExtras = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [rental, setRental] = useState<CarRentalData>(
      initialRental || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          pickupLocation: '',
          dropoffLocation: '',
          pickupDate: new Date(),
          pickupTime: '10:00',
          dropoffDate: new Date(),
          dropoffTime: '10:00',
          driverAge: 25,
          driverLicense: '',
          carType: [],
          transmission: 'any',
          fuelType: 'any',
          seats: 4,
          luggage: 2,
          priceRange: { min: 0, max: 200, currency: 'USD' },
          features: [],
          instantBooking: false
        },
        searchResults: [],
        selectedCars: [],
        rentals: [],
        favorites: [],
        settings: {
          preferredProviders: [],
          preferredCarTypes: [],
          transmissionPreference: 'any',
          fuelTypePreference: 'any',
          priceRange: { min: 0, max: 200, currency: 'USD' },
          features: [],
          insurancePreferences: [],
          extrasPreferences: [],
          instantBooking: false,
          notifications: {
            priceDrops: true,
            availabilityChanges: true,
            pickupReminders: true,
            returnReminders: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedCar, setSelectedCar] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '🚗' },
      { id: 'comparison', name: 'Comparison', icon: '⚖️' },
      { id: 'rentals', name: 'Rentals', icon: '🎫' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' }
    ];

    const carTypes = [
      { id: 'economy', name: 'Economy', icon: '🚗', color: 'green' },
      { id: 'compact', name: 'Compact', icon: '🚙', color: 'blue' },
      { id: 'intermediate', name: 'Intermediate', icon: '🚘', color: 'purple' },
      { id: 'standard', name: 'Standard', icon: '🚖', color: 'orange' },
      { id: 'full-size', name: 'Full Size', icon: '🚔', color: 'red' },
      { id: 'premium', name: 'Premium', icon: '🏎️', color: 'gold' },
      { id: 'luxury', name: 'Luxury', icon: '🚘', color: 'pink' },
      { id: 'suv', name: 'SUV', icon: '🚙', color: 'indigo' },
      { id: 'minivan', name: 'Minivan', icon: '🚐', color: 'teal' },
      { id: 'convertible', name: 'Convertible', icon: '🚗', color: 'yellow' }
    ];

    const providers = [
      { id: 'hertz', name: 'Hertz', logo: '🚗', color: 'red' },
      { id: 'avis', name: 'Avis', logo: '🚗', color: 'blue' },
      { id: 'enterprise', name: 'Enterprise', logo: '🚗', color: 'green' },
      { id: 'budget', name: 'Budget', logo: '🚗', color: 'yellow' },
      { id: 'national', name: 'National', logo: '🚗', color: 'purple' },
      { id: 'alamo', name: 'Alamo', logo: '🚗', color: 'orange' }
    ];

    const features = [
      { id: 'gps', name: 'GPS Navigation', icon: '🗺️' },
      { id: 'bluetooth', name: 'Bluetooth', icon: '📱' },
      { id: 'usb', name: 'USB Ports', icon: '🔌' },
      { id: 'air-conditioning', name: 'Air Conditioning', icon: '❄️' },
      { id: 'cruise-control', name: 'Cruise Control', icon: '⚡' },
      { id: 'backup-camera', name: 'Backup Camera', icon: '📹' },
      { id: 'sunroof', name: 'Sunroof', icon: '☀️' },
      { id: 'leather-seats', name: 'Leather Seats', icon: '🪑' },
      { id: 'heated-seats', name: 'Heated Seats', icon: '🔥' },
      { id: 'wifi', name: 'WiFi Hotspot', icon: '📶' }
    ];

    const updateRental = useCallback((path: string, value: any) => {
      setRental(prev => {
        const newRental = { ...prev };
        const keys = path.split('.');
        let current: any = newRental;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newRental.updatedAt = new Date();
        onRentalUpdate?.(newRental);
        return newRental;
      });
    }, [onRentalUpdate]);

    const searchCars = useCallback(() => {
      setIsSearching(true);
      // Simulate car search
      setTimeout(() => {
        const mockResults: CarResult[] = [
          {
            id: 'car-1',
            provider: 'Hertz',
            vehicle: {
              id: 'vehicle-1',
              make: 'Toyota',
              model: 'Camry',
              year: 2023,
              category: 'intermediate',
              type: 'sedan',
              transmission: 'automatic',
              fuelType: 'gasoline',
              engineSize: '2.5L',
              power: 203,
              seats: 5,
              doors: 4,
              luggage: 2,
              features: ['gps', 'bluetooth', 'air-conditioning'],
              images: [],
              specifications: []
            },
            location: {
              id: 'location-1',
              name: 'Hertz Downtown',
              address: {
                street: '123 Main St',
                city: 'Paris',
                state: 'Île-de-France',
                zipCode: '75001',
                country: 'France'
              },
              coordinates: { lat: 48.8566, lng: 2.3522 },
              phone: '+33 1 23 45 67 89',
              email: 'downtown@hertz.com',
              hours: {
                open: '06:00',
                close: '22:00',
                timezone: 'CET'
              },
              amenities: ['24/7 service', 'Free shuttle'],
              pickupInstructions: 'Present at counter with ID and credit card',
              dropoffInstructions: 'Return to same location'
            },
            pricing: {
              baseRate: 45,
              dailyRate: 45,
              weeklyRate: 280,
              monthlyRate: 1000,
              taxes: 15,
              fees: {
                airportFee: 0,
                youngDriverFee: 0,
                additionalDriverFee: 10,
                gpsFee: 8,
                childSeatFee: 12
              },
              total: 60,
              currency: 'USD',
              mileage: {
                included: 200,
                overageRate: 0.25,
                unlimited: false
              },
              fuel: {
                policy: 'full-to-full',
                price: 0
              },
              deposit: 200,
              cancellationPolicy: 'Free cancellation up to 24 hours before pickup'
            },
            availability: {
              isAvailable: true,
              availableCount: 3,
              lastUpdated: new Date(),
              restrictions: [],
              minimumRentalPeriod: 1,
              maximumRentalPeriod: 30
            },
            policies: [],
            extras: [],
            insurance: [],
            rating: {
              overall: 4.2,
              cleanliness: 4.3,
              condition: 4.1,
              service: 4.0,
              value: 4.2,
              reviewCount: 150
            },
            reviews: [],
            bookingUrl: 'https://hertz.com',
            lastUpdated: new Date()
          }
        ];
        updateRental('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateRental]);

    const selectCar = useCallback((carId: string) => {
      const car = rental.searchResults.find(c => c.id === carId);
      if (!car) return;

      const selectedCar: SelectedCar = {
        id: `selected-${Date.now()}`,
        carId: car.id,
        car: car,
        pickupLocation: rental.searchCriteria.pickupLocation,
        dropoffLocation: rental.searchCriteria.dropoffLocation,
        pickupDate: rental.searchCriteria.pickupDate,
        pickupTime: rental.searchCriteria.pickupTime,
        dropoffDate: rental.searchCriteria.dropoffDate,
        dropoffTime: rental.searchCriteria.dropoffTime,
        driver: {
          id: `driver-${Date.now()}`,
          firstName: '',
          lastName: '',
          dateOfBirth: new Date(),
          licenseNumber: '',
          licenseExpiry: new Date(),
          licenseCountry: '',
          phone: '',
          email: '',
          isPrimary: true,
          age: rental.searchCriteria.driverAge
        },
        additionalDrivers: [],
        extras: [],
        insurance: [],
        totalPrice: car.pricing.total,
        currency: car.pricing.currency,
        specialRequests: [],
        status: 'selected',
        createdAt: new Date()
      };
      updateRental('selectedCars', [...rental.selectedCars, selectedCar]);
    }, [rental.searchResults, rental.selectedCars, rental.searchCriteria, updateRental]);

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

    const getCarTypeIcon = (type: string) => {
      const carType = carTypes.find(t => t.id === type);
      return carType?.icon || '🚗';
    };

    const getCarTypeName = (type: string) => {
      const carType = carTypes.find(t => t.id === type);
      return carType?.name || type;
    };

    const getProviderLogo = (provider: string) => {
      const providerData = providers.find(p => p.name === provider);
      return providerData?.logo || '🚗';
    };

    const getFeatureIcon = (featureId: string) => {
      const feature = features.find(f => f.id === featureId);
      return feature?.icon || '🚗';
    };

    const getFeatureName = (featureId: string) => {
      const feature = features.find(f => f.id === featureId);
      return feature?.name || featureId;
    };

    const calculateRentalDays = (pickup: Date, dropoff: Date) => {
      return Math.ceil((dropoff.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          carRentalsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Car Rentals
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find and book rental cars for {rental.tripName || 'your trip'}
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
                  'px-3 py-1 text-sm rounded-r-md transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ⊞ Grid
              </button>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              🎫 My Rentals
            </button>
          </div>
        </div>

        {/* Car Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Rental Cars
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pickup Location
              </label>
              <input
                type="text"
                value={rental.searchCriteria.pickupLocation}
                onChange={(e) => updateRental('searchCriteria.pickupLocation', e.target.value)}
                placeholder="City or Airport"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drop-off Location
              </label>
              <input
                type="text"
                value={rental.searchCriteria.dropoffLocation}
                onChange={(e) => updateRental('searchCriteria.dropoffLocation', e.target.value)}
                placeholder="Same as pickup"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                value={rental.searchCriteria.pickupDate.toISOString().split('T')[0]}
                onChange={(e) => updateRental('searchCriteria.pickupDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pickup Time
              </label>
              <input
                type="time"
                value={rental.searchCriteria.pickupTime}
                onChange={(e) => updateRental('searchCriteria.pickupTime', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drop-off Date
              </label>
              <input
                type="date"
                value={rental.searchCriteria.dropoffDate.toISOString().split('T')[0]}
                onChange={(e) => updateRental('searchCriteria.dropoffDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Drop-off Time
              </label>
              <input
                type="time"
                value={rental.searchCriteria.dropoffTime}
                onChange={(e) => updateRental('searchCriteria.dropoffTime', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Driver Age
              </label>
              <select
                value={rental.searchCriteria.driverAge}
                onChange={(e) => updateRental('searchCriteria.driverAge', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {[21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35].map(age => (
                  <option key={age} value={age}>{age} years old</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Car Type
              </label>
              <select
                value={rental.searchCriteria.carType[0] || ''}
                onChange={(e) => updateRental('searchCriteria.carType', e.target.value ? [e.target.value] : [])}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="">Any Type</option>
                {carTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transmission
              </label>
              <select
                value={rental.searchCriteria.transmission}
                onChange={(e) => updateRental('searchCriteria.transmission', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="any">Any</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={rental.searchCriteria.priceRange.min}
                  onChange={(e) => updateRental('searchCriteria.priceRange.min', parseInt(e.target.value))}
                  placeholder="Min"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <input
                  type="number"
                  value={rental.searchCriteria.priceRange.max}
                  onChange={(e) => updateRental('searchCriteria.priceRange.max', parseInt(e.target.value))}
                  placeholder="Max"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Features
              </label>
              <div className="flex flex-wrap gap-1">
                {features.slice(0, 4).map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => {
                      const currentFeatures = rental.searchCriteria.features;
                      const newFeatures = currentFeatures.includes(feature.id)
                        ? currentFeatures.filter(f => f !== feature.id)
                        : [...currentFeatures, feature.id];
                      updateRental('searchCriteria.features', newFeatures);
                    }}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                      rental.searchCriteria.features.includes(feature.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {feature.icon} {feature.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rental.searchCriteria.instantBooking}
                onChange={(e) => updateRental('searchCriteria.instantBooking', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Instant booking</span>
            </label>
          </div>
          
          <button
            onClick={searchCars}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Cars'}
          </button>
        </div>

        {/* Car Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {rental.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {rental.selectedCars.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {rental.rentals.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Rentals</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {rental.favorites.length}
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
                  Car Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {rental.searchResults.length} cars found
                </div>
              </div>
              
              <div className={cn(
                'gap-4',
                viewMode === 'list' && 'space-y-3',
                viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              )}>
                {rental.searchResults.map((car) => (
                  <div key={car.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {viewMode === 'grid' && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">{getCarTypeIcon(car.vehicle.category)}</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getProviderLogo(car.provider)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {car.vehicle.make} {car.vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {car.provider} • {getCarTypeName(car.vehicle.category)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {car.vehicle.year} • {car.vehicle.seats} seats • {car.vehicle.transmission}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(car.pricing.dailyRate, car.pricing.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            per day
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {car.location.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {car.rating.overall}/5 ({car.rating.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {car.availability.availableCount} cars
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {car.vehicle.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                              {getFeatureIcon(feature)} {getFeatureName(feature)}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                            Details
                          </button>
                          <button
                            onClick={() => selectCar(car.id)}
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

          {activeTab === 'rentals' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                My Rentals
              </h3>
              
              {rental.rentals.length > 0 ? (
                <div className="space-y-3">
                  {rental.rentals.map((rentalItem) => (
                    <div key={rentalItem.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCarTypeIcon(rentalItem.selectedCar.car.vehicle.category)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {rentalItem.selectedCar.car.vehicle.make} {rentalItem.selectedCar.car.vehicle.model}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Rental: {rentalItem.rentalNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(rentalItem.totalAmount, rentalItem.currency)}
                          </div>
                          <div className={cn(
                            'text-sm font-medium',
                            rentalItem.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                            rentalItem.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {rentalItem.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <div className="flex justify-between">
                            <span>Pickup:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(rentalItem.pickupDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Drop-off:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(rentalItem.dropoffDate)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {calculateRentalDays(rentalItem.pickupDate, rentalItem.dropoffDate)} days
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(rentalItem.bookingDate)}
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
                    No rentals yet
                  </h3>
                  <p>Search and book cars to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Cars
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No favorite cars yet
                </h3>
                <p>Save cars you like to your favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CarRentals.displayName = 'CarRentals';

// Car Rentals Demo Component
interface CarRentalsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const CarRentalsDemo = React.forwardRef<HTMLDivElement, CarRentalsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [rental, setRental] = useState<Partial<CarRentalData>>({});

    const handleRentalUpdate = (updatedRental: CarRentalData) => {
      setRental(updatedRental);
      console.log('Car rental updated:', updatedRental);
    };

    const mockRental: Partial<CarRentalData> = {
      id: 'car-rental-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        pickupLocation: 'CDG Airport',
        dropoffLocation: 'CDG Airport',
        pickupDate: new Date('2024-06-15'),
        pickupTime: '10:00',
        dropoffDate: new Date('2024-06-22'),
        dropoffTime: '10:00',
        driverAge: 25,
        driverLicense: '',
        carType: [],
        transmission: 'any',
        fuelType: 'any',
        seats: 4,
        luggage: 2,
        priceRange: { min: 0, max: 100, currency: 'USD' },
        features: [],
        instantBooking: false
      },
      searchResults: [],
      selectedCars: [],
      rentals: [],
      favorites: [],
      settings: {
        preferredProviders: [],
        preferredCarTypes: [],
        transmissionPreference: 'any',
        fuelTypePreference: 'any',
        priceRange: { min: 0, max: 100, currency: 'USD' },
        features: [],
        insurancePreferences: [],
        extrasPreferences: [],
        instantBooking: false,
        notifications: {
          priceDrops: true,
          availabilityChanges: true,
          pickupReminders: true,
          returnReminders: true
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
          Car Rentals Demo
        </h3>
        
        <CarRentals
          onRentalUpdate={handleRentalUpdate}
          initialRental={mockRental}
          showFilters={true}
          showComparison={true}
          showInsurance={true}
          showExtras={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive car rental search and booking with filters, comparison, insurance options, and extras.
            </p>
          </div>
        )}
      </div>
    );
  }
);

CarRentalsDemo.displayName = 'CarRentalsDemo';

// Export all components
export {
  carRentalsVariants,
  type CarRentalsProps,
  type CarRentalData,
  type CarSearchCriteria,
  type CarResult,
  type Vehicle,
  type VehicleImage,
  type VehicleSpecification,
  type RentalLocation,
  type CarPricing,
  type CarAvailability,
  type CarPolicy,
  type CarExtra,
  type InsuranceOption,
  type CarReview,
  type SelectedCar,
  type DriverInfo,
  type SelectedExtra,
  type SelectedInsurance,
  type CarRental,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type CarRentalSettings,
  type CarRentalsDemoProps
};
