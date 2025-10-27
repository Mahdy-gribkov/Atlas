/**
 * Flight Booking Component
 * 
 * Provides flight search, comparison, and booking for Atlas travel agent.
 * Implements flight search, price comparison, seat selection, and booking management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Flight Booking Variants
const flightBookingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'flight-booking-mode-standard',
        'enhanced': 'flight-booking-mode-enhanced',
        'advanced': 'flight-booking-mode-advanced',
        'custom': 'flight-booking-mode-custom'
      },
      type: {
        'domestic': 'flight-type-domestic',
        'international': 'flight-type-international',
        'business': 'flight-type-business',
        'mixed': 'flight-type-mixed'
      },
      style: {
        'minimal': 'flight-style-minimal',
        'moderate': 'flight-style-moderate',
        'detailed': 'flight-style-detailed',
        'custom': 'flight-style-custom'
      },
      format: {
        'text': 'flight-format-text',
        'visual': 'flight-format-visual',
        'interactive': 'flight-format-interactive',
        'mixed': 'flight-format-mixed'
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

// Flight Booking Props
interface FlightBookingProps extends VariantProps<typeof flightBookingVariants> {
  className?: string;
  onBookingUpdate?: (booking: FlightBookingData) => void;
  initialBooking?: Partial<FlightBookingData>;
  showFilters?: boolean;
  showComparison?: boolean;
  showSeatSelection?: boolean;
  showPriceAlerts?: boolean;
}

// Flight Booking Data Interface
interface FlightBookingData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: FlightSearchCriteria;
  searchResults: FlightResult[];
  selectedFlights: SelectedFlight[];
  bookings: FlightBooking[];
  priceAlerts: PriceAlert[];
  favorites: string[];
  settings: FlightBookingSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Flight Search Criteria Interface
interface FlightSearchCriteria {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'economy' | 'premium-economy' | 'business' | 'first';
  tripType: 'one-way' | 'round-trip' | 'multi-city';
  flexibleDates: boolean;
  directFlightsOnly: boolean;
  preferredAirlines: string[];
  maxStops: number;
  maxPrice?: number;
  currency: string;
}

// Flight Result Interface
interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  aircraft: string;
  departure: {
    airport: string;
    terminal?: string;
    gate?: string;
    time: Date;
    city: string;
    country: string;
  };
  arrival: {
    airport: string;
    terminal?: string;
    gate?: string;
    time: Date;
    city: string;
    country: string;
  };
  duration: number; // in minutes
  stops: number;
  stopDetails: StopDetail[];
  cabinClass: string;
  price: {
    base: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
  };
  baggage: {
    carryOn: BaggageInfo;
    checked: BaggageInfo;
  };
  amenities: string[];
  bookingClass: string;
  availability: number;
  refundable: boolean;
  changeable: boolean;
  cancellationPolicy: string;
  bookingUrl: string;
  provider: string;
  lastUpdated: Date;
}

// Stop Detail Interface
interface StopDetail {
  airport: string;
  city: string;
  country: string;
  arrivalTime: Date;
  departureTime: Date;
  duration: number; // in minutes
}

// Baggage Info Interface
interface BaggageInfo {
  included: boolean;
  weight: number; // in kg
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  price?: number;
  currency?: string;
}

// Selected Flight Interface
interface SelectedFlight {
  id: string;
  flightId: string;
  flight: FlightResult;
  passengers: PassengerInfo[];
  seats: SeatSelection[];
  meals: MealSelection[];
  extras: ExtraSelection[];
  totalPrice: number;
  currency: string;
  bookingReference?: string;
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Passenger Info Interface
interface PassengerInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  passportNumber?: string;
  passportExpiry?: Date;
  frequentFlyerNumber?: string;
  specialRequests: string[];
  seatPreference: 'window' | 'aisle' | 'middle' | 'any';
  mealPreference: 'standard' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | 'gluten-free';
}

// Seat Selection Interface
interface SeatSelection {
  passengerId: string;
  seatNumber: string;
  seatType: 'standard' | 'premium' | 'exit-row' | 'bulkhead';
  price: number;
  currency: string;
  location: {
    row: number;
    column: string;
  };
}

// Meal Selection Interface
interface MealSelection {
  passengerId: string;
  mealType: string;
  price: number;
  currency: string;
  description: string;
}

// Extra Selection Interface
interface ExtraSelection {
  id: string;
  type: 'baggage' | 'seat' | 'meal' | 'insurance' | 'priority' | 'lounge';
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  passengerId?: string;
}

// Flight Booking Interface
interface FlightBooking {
  id: string;
  bookingReference: string;
  selectedFlight: SelectedFlight;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  confirmationNumber: string;
  eTicketNumber: string;
  bookingDate: Date;
  travelDate: Date;
  totalAmount: number;
  currency: string;
  cancellationPolicy: string;
  refundPolicy: string;
  changePolicy: string;
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
  type: 'ticket' | 'receipt' | 'itinerary' | 'boarding-pass' | 'other';
  name: string;
  url: string;
  downloadDate: Date;
}

// Booking Notification Interface
interface BookingNotification {
  id: string;
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'delay';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Price Alert Interface
interface PriceAlert {
  id: string;
  searchCriteria: FlightSearchCriteria;
  targetPrice: number;
  currency: string;
  isActive: boolean;
  lastChecked: Date;
  notifications: PriceAlertNotification[];
  createdAt: Date;
}

// Price Alert Notification Interface
interface PriceAlertNotification {
  id: string;
  price: number;
  currency: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Flight Booking Settings Interface
interface FlightBookingSettings {
  preferredAirlines: string[];
  preferredAirports: string[];
  cabinClassPreference: string;
  seatPreference: string;
  mealPreference: string;
  autoCheckIn: boolean;
  priceAlertsEnabled: boolean;
  flexibleDates: boolean;
  directFlightsOnly: boolean;
  maxStops: number;
  maxPrice: number;
  currency: string;
  notifications: {
    priceDrops: boolean;
    scheduleChanges: boolean;
    checkInReminders: boolean;
    gateChanges: boolean;
  };
}

// Flight Booking Component
export const FlightBooking = React.forwardRef<HTMLDivElement, FlightBookingProps>(
  ({ 
    className, 
    onBookingUpdate,
    initialBooking,
    showFilters = true,
    showComparison = true,
    showSeatSelection = true,
    showPriceAlerts = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [booking, setBooking] = useState<FlightBookingData>(
      initialBooking || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          origin: '',
          destination: '',
          departureDate: new Date(),
          passengers: { adults: 1, children: 0, infants: 0 },
          cabinClass: 'economy',
          tripType: 'round-trip',
          flexibleDates: false,
          directFlightsOnly: false,
          preferredAirlines: [],
          maxStops: 2,
          currency: 'USD'
        },
        searchResults: [],
        selectedFlights: [],
        bookings: [],
        priceAlerts: [],
        favorites: [],
        settings: {
          preferredAirlines: [],
          preferredAirports: [],
          cabinClassPreference: 'economy',
          seatPreference: 'any',
          mealPreference: 'standard',
          autoCheckIn: false,
          priceAlertsEnabled: true,
          flexibleDates: false,
          directFlightsOnly: false,
          maxStops: 2,
          maxPrice: 1000,
          currency: 'USD',
          notifications: {
            priceDrops: true,
            scheduleChanges: true,
            checkInReminders: true,
            gateChanges: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState<string>('');
    const [comparisonMode, setComparisonMode] = useState(false);

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '✈️' },
      { id: 'comparison', name: 'Comparison', icon: '⚖️' },
      { id: 'bookings', name: 'Bookings', icon: '🎫' },
      { id: 'alerts', name: 'Price Alerts', icon: '🔔' }
    ];

    const cabinClasses = [
      { id: 'economy', name: 'Economy', icon: '💺', color: 'blue' },
      { id: 'premium-economy', name: 'Premium Economy', icon: '🪑', color: 'green' },
      { id: 'business', name: 'Business', icon: '🛋️', color: 'purple' },
      { id: 'first', name: 'First Class', icon: '👑', color: 'gold' }
    ];

    const tripTypes = [
      { id: 'one-way', name: 'One Way', icon: '➡️' },
      { id: 'round-trip', name: 'Round Trip', icon: '🔄' },
      { id: 'multi-city', name: 'Multi City', icon: '🗺️' }
    ];

    const airlines = [
      { id: 'american', name: 'American Airlines', code: 'AA', logo: '✈️' },
      { id: 'delta', name: 'Delta Air Lines', code: 'DL', logo: '✈️' },
      { id: 'united', name: 'United Airlines', code: 'UA', logo: '✈️' },
      { id: 'southwest', name: 'Southwest Airlines', code: 'WN', logo: '✈️' },
      { id: 'jetblue', name: 'JetBlue Airways', code: 'B6', logo: '✈️' },
      { id: 'alaska', name: 'Alaska Airlines', code: 'AS', logo: '✈️' }
    ];

    const updateBooking = useCallback((path: string, value: any) => {
      setBooking(prev => {
        const newBooking = { ...prev };
        const keys = path.split('.');
        let current: any = newBooking;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newBooking.updatedAt = new Date();
        onBookingUpdate?.(newBooking);
        return newBooking;
      });
    }, [onBookingUpdate]);

    const searchFlights = useCallback(() => {
      setIsSearching(true);
      // Simulate flight search
      setTimeout(() => {
        const mockResults: FlightResult[] = [
          {
            id: 'flight-1',
            airline: 'American Airlines',
            flightNumber: 'AA123',
            aircraft: 'Boeing 737',
            departure: {
              airport: 'LAX',
              terminal: '2',
              time: new Date(Date.now() + 24 * 60 * 60 * 1000),
              city: 'Los Angeles',
              country: 'USA'
            },
            arrival: {
              airport: 'JFK',
              terminal: '4',
              time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
              city: 'New York',
              country: 'USA'
            },
            duration: 300,
            stops: 0,
            stopDetails: [],
            cabinClass: 'economy',
            price: {
              base: 250,
              taxes: 50,
              fees: 25,
              total: 325,
              currency: 'USD'
            },
            baggage: {
              carryOn: { included: true, weight: 7, dimensions: { length: 55, width: 40, height: 20 } },
              checked: { included: false, weight: 23, price: 35, currency: 'USD', dimensions: { length: 62, width: 40, height: 20 } }
            },
            amenities: ['WiFi', 'Entertainment', 'Snacks'],
            bookingClass: 'Y',
            availability: 5,
            refundable: false,
            changeable: true,
            cancellationPolicy: 'Non-refundable',
            bookingUrl: 'https://aa.com',
            provider: 'American Airlines',
            lastUpdated: new Date()
          }
        ];
        updateBooking('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateBooking]);

    const selectFlight = useCallback((flightId: string) => {
      const flight = booking.searchResults.find(f => f.id === flightId);
      if (!flight) return;

      const selectedFlight: SelectedFlight = {
        id: `selected-${Date.now()}`,
        flightId: flight.id,
        flight: flight,
        passengers: [],
        seats: [],
        meals: [],
        extras: [],
        totalPrice: flight.price.total,
        currency: flight.price.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updateBooking('selectedFlights', [...booking.selectedFlights, selectedFlight]);
    }, [booking.searchResults, booking.selectedFlights, updateBooking]);

    const addPassenger = useCallback((selectedFlightId: string) => {
      const newPassenger: PassengerInfo = {
        id: `passenger-${Date.now()}`,
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        gender: 'male',
        nationality: '',
        specialRequests: [],
        seatPreference: 'any',
        mealPreference: 'standard'
      };
      
      const updatedSelectedFlights = booking.selectedFlights.map(sf => 
        sf.id === selectedFlightId 
          ? { ...sf, passengers: [...sf.passengers, newPassenger] }
          : sf
      );
      updateBooking('selectedFlights', updatedSelectedFlights);
    }, [booking.selectedFlights, updateBooking]);

    const formatCurrency = (amount: number, currency: string) => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTimeOnly = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const getCabinClassIcon = (cabinClass: string) => {
      const cabin = cabinClasses.find(c => c.id === cabinClass);
      return cabin?.icon || '💺';
    };

    const getCabinClassName = (cabinClass: string) => {
      const cabin = cabinClasses.find(c => c.id === cabinClass);
      return cabin?.name || cabinClass;
    };

    const getTripTypeIcon = (tripType: string) => {
      const trip = tripTypes.find(t => t.id === tripType);
      return trip?.icon || '✈️';
    };

    const getAirlineLogo = (airline: string) => {
      const airlineData = airlines.find(a => a.name === airline);
      return airlineData?.logo || '✈️';
    };

    const getStopsText = (stops: number) => {
      switch (stops) {
        case 0: return 'Direct';
        case 1: return '1 Stop';
        default: return `${stops} Stops`;
      }
    };

    const getStopsColor = (stops: number) => {
      switch (stops) {
        case 0: return 'text-green-600 dark:text-green-400';
        case 1: return 'text-yellow-600 dark:text-yellow-400';
        default: return 'text-red-600 dark:text-red-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          flightBookingVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Flight Booking
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Search and book flights for {booking.tripName || 'your trip'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              💰 Price Alerts
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              🎫 My Bookings
            </button>
          </div>
        </div>

        {/* Flight Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Flights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <input
                type="text"
                value={booking.searchCriteria.origin}
                onChange={(e) => updateBooking('searchCriteria.origin', e.target.value)}
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
                value={booking.searchCriteria.destination}
                onChange={(e) => updateBooking('searchCriteria.destination', e.target.value)}
                placeholder="City or Airport"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure
              </label>
              <input
                type="date"
                value={booking.searchCriteria.departureDate.toISOString().split('T')[0]}
                onChange={(e) => updateBooking('searchCriteria.departureDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Return
              </label>
              <input
                type="date"
                value={booking.searchCriteria.returnDate ? booking.searchCriteria.returnDate.toISOString().split('T')[0] : ''}
                onChange={(e) => updateBooking('searchCriteria.returnDate', e.target.value ? new Date(e.target.value) : undefined)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passengers
              </label>
              <div className="flex gap-2">
                <select
                  value={booking.searchCriteria.passengers.adults}
                  onChange={(e) => updateBooking('searchCriteria.passengers.adults', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={booking.searchCriteria.passengers.children}
                  onChange={(e) => updateBooking('searchCriteria.passengers.children', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </select>
                <select
                  value={booking.searchCriteria.passengers.infants}
                  onChange={(e) => updateBooking('searchCriteria.passengers.infants', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} Infant{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cabin Class
              </label>
              <select
                value={booking.searchCriteria.cabinClass}
                onChange={(e) => updateBooking('searchCriteria.cabinClass', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {cabinClasses.map((cabin) => (
                  <option key={cabin.id} value={cabin.id}>
                    {cabin.icon} {cabin.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Type
              </label>
              <select
                value={booking.searchCriteria.tripType}
                onChange={(e) => updateBooking('searchCriteria.tripType', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {tripTypes.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.icon} {trip.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={booking.searchCriteria.flexibleDates}
                onChange={(e) => updateBooking('searchCriteria.flexibleDates', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flexible dates</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={booking.searchCriteria.directFlightsOnly}
                onChange={(e) => updateBooking('searchCriteria.directFlightsOnly', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Direct flights only</span>
            </label>
          </div>
          
          <button
            onClick={searchFlights}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Flights'}
          </button>
        </div>

        {/* Flight Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {booking.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {booking.selectedFlights.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {booking.bookings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {booking.priceAlerts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Price Alerts</div>
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
                  Flight Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.searchResults.length} flights found
                </div>
              </div>
              
              <div className="space-y-3">
                {booking.searchResults.map((flight) => (
                  <div key={flight.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getAirlineLogo(flight.airline)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {flight.airline} {flight.flightNumber}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {flight.aircraft}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(flight.price.total, flight.price.currency)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {getCabinClassIcon(flight.cabinClass)} {getCabinClassName(flight.cabinClass)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Departure</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTimeOnly(flight.departure.time)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {flight.departure.airport} • {flight.departure.city}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(flight.duration)}
                        </div>
                        <div className={cn('text-sm font-medium', getStopsColor(flight.stops))}>
                          {getStopsText(flight.stops)}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Arrival</div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTimeOnly(flight.arrival.time)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {flight.arrival.airport} • {flight.arrival.city}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {flight.amenities.slice(0, 3).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                          Details
                        </button>
                        <button
                          onClick={() => selectFlight(flight.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          Select
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
              
              {booking.bookings.length > 0 ? (
                <div className="space-y-3">
                  {booking.bookings.map((bookingItem) => (
                    <div key={bookingItem.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getAirlineLogo(bookingItem.selectedFlight.flight.airline)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {bookingItem.selectedFlight.flight.airline} {bookingItem.selectedFlight.flight.flightNumber}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Booking: {bookingItem.bookingReference}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(bookingItem.totalAmount, bookingItem.currency)}
                          </div>
                          <div className={cn(
                            'text-sm font-medium',
                            bookingItem.status === 'confirmed' ? 'text-green-600 dark:text-green-400' :
                            bookingItem.status === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          )}>
                            {bookingItem.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <div className="flex justify-between">
                            <span>Departure:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(bookingItem.travelDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Route:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {bookingItem.selectedFlight.flight.departure.airport} → {bookingItem.selectedFlight.flight.arrival.airport}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Passengers:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {bookingItem.selectedFlight.passengers.length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Booking Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(bookingItem.bookingDate)}
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
                  <p>Search and book flights to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'alerts' && showPriceAlerts && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Price Alerts
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Price alerts coming soon
                </h3>
                <p>Get notified when flight prices drop</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FlightBooking.displayName = 'FlightBooking';

// Flight Booking Demo Component
interface FlightBookingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const FlightBookingDemo = React.forwardRef<HTMLDivElement, FlightBookingDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [booking, setBooking] = useState<Partial<FlightBookingData>>({});

    const handleBookingUpdate = (updatedBooking: FlightBookingData) => {
      setBooking(updatedBooking);
      console.log('Flight booking updated:', updatedBooking);
    };

    const mockBooking: Partial<FlightBookingData> = {
      id: 'flight-booking-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        origin: 'LAX',
        destination: 'CDG',
        departureDate: new Date('2024-06-15'),
        returnDate: new Date('2024-06-22'),
        passengers: { adults: 2, children: 0, infants: 0 },
        cabinClass: 'economy',
        tripType: 'round-trip',
        flexibleDates: false,
        directFlightsOnly: false,
        preferredAirlines: [],
        maxStops: 2,
        currency: 'USD'
      },
      searchResults: [],
      selectedFlights: [],
      bookings: [],
      priceAlerts: [],
      favorites: [],
      settings: {
        preferredAirlines: [],
        preferredAirports: [],
        cabinClassPreference: 'economy',
        seatPreference: 'any',
        mealPreference: 'standard',
        autoCheckIn: false,
        priceAlertsEnabled: true,
        flexibleDates: false,
        directFlightsOnly: false,
        maxStops: 2,
        maxPrice: 1000,
        currency: 'USD',
        notifications: {
          priceDrops: true,
          scheduleChanges: true,
          checkInReminders: true,
          gateChanges: true
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
          Flight Booking Demo
        </h3>
        
        <FlightBooking
          onBookingUpdate={handleBookingUpdate}
          initialBooking={mockBooking}
          showFilters={true}
          showComparison={true}
          showSeatSelection={true}
          showPriceAlerts={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive flight booking with search, comparison, seat selection, and booking management.
            </p>
          </div>
        )}
      </div>
    );
  }
);

FlightBookingDemo.displayName = 'FlightBookingDemo';

// Export all components
export {
  flightBookingVariants,
  type FlightBookingProps,
  type FlightBookingData,
  type FlightSearchCriteria,
  type FlightResult,
  type StopDetail,
  type BaggageInfo,
  type SelectedFlight,
  type PassengerInfo,
  type SeatSelection,
  type MealSelection,
  type ExtraSelection,
  type FlightBooking,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type PriceAlert,
  type PriceAlertNotification,
  type FlightBookingSettings,
  type FlightBookingDemoProps
};
