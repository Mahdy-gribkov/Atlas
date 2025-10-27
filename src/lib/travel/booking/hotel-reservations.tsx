/**
 * Hotel Reservations Component
 * 
 * Provides hotel search, comparison, and reservation for Atlas travel agent.
 * Implements hotel search, price comparison, room selection, and booking management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Hotel Reservations Variants
const hotelReservationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'hotel-reservations-mode-standard',
        'enhanced': 'hotel-reservations-mode-enhanced',
        'advanced': 'hotel-reservations-mode-advanced',
        'custom': 'hotel-reservations-mode-custom'
      },
      type: {
        'budget': 'hotel-type-budget',
        'mid-range': 'hotel-type-mid-range',
        'luxury': 'hotel-type-luxury',
        'mixed': 'hotel-type-mixed'
      },
      style: {
        'minimal': 'hotel-style-minimal',
        'moderate': 'hotel-style-moderate',
        'detailed': 'hotel-style-detailed',
        'custom': 'hotel-style-custom'
      },
      format: {
        'text': 'hotel-format-text',
        'visual': 'hotel-format-visual',
        'interactive': 'hotel-format-interactive',
        'mixed': 'hotel-format-mixed'
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

// Hotel Reservations Props
interface HotelReservationsProps extends VariantProps<typeof hotelReservationsVariants> {
  className?: string;
  onReservationUpdate?: (reservation: HotelReservationData) => void;
  initialReservation?: Partial<HotelReservationData>;
  showFilters?: boolean;
  showComparison?: boolean;
  showReviews?: boolean;
  showMap?: boolean;
}

// Hotel Reservation Data Interface
interface HotelReservationData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: HotelSearchCriteria;
  searchResults: HotelResult[];
  selectedHotels: SelectedHotel[];
  reservations: HotelReservation[];
  favorites: string[];
  settings: HotelReservationSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Hotel Search Criteria Interface
interface HotelSearchCriteria {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  starRating: number[];
  amenities: string[];
  hotelTypes: string[];
  distanceFromCenter: number; // in km
  flexibleDates: boolean;
  instantBooking: boolean;
}

// Hotel Result Interface
interface HotelResult {
  id: string;
  name: string;
  brand: string;
  starRating: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  description: string;
  images: HotelImage[];
  amenities: HotelAmenity[];
  rooms: HotelRoom[];
  policies: HotelPolicy[];
  reviews: HotelReview[];
  rating: {
    overall: number;
    cleanliness: number;
    service: number;
    location: number;
    value: number;
    reviewCount: number;
  };
  price: {
    base: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
    perNight: number;
  };
  availability: {
    roomsAvailable: number;
    lastUpdated: Date;
  };
  cancellationPolicy: string;
  checkInTime: string;
  checkOutTime: string;
  petFriendly: boolean;
  wifiIncluded: boolean;
  parkingAvailable: boolean;
  bookingUrl: string;
  provider: string;
  lastUpdated: Date;
}

// Hotel Image Interface
interface HotelImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'exterior' | 'interior' | 'room' | 'amenity' | 'dining' | 'other';
  isPrimary: boolean;
}

// Hotel Amenity Interface
interface HotelAmenity {
  id: string;
  name: string;
  icon: string;
  category: 'general' | 'room' | 'dining' | 'fitness' | 'business' | 'family' | 'accessibility';
  isIncluded: boolean;
  price?: number;
  currency?: string;
}

// Hotel Room Interface
interface HotelRoom {
  id: string;
  name: string;
  type: 'standard' | 'deluxe' | 'suite' | 'presidential';
  size: number; // in sq ft
  maxOccupancy: number;
  bedConfiguration: string;
  amenities: string[];
  images: HotelImage[];
  price: {
    base: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
    perNight: number;
  };
  availability: number;
  cancellationPolicy: string;
  smokingAllowed: boolean;
  petFriendly: boolean;
}

// Hotel Policy Interface
interface HotelPolicy {
  id: string;
  type: 'check-in' | 'check-out' | 'cancellation' | 'pet' | 'smoking' | 'age' | 'payment';
  title: string;
  description: string;
  isImportant: boolean;
}

// Hotel Review Interface
interface HotelReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  roomType?: string;
  stayDate?: Date;
  travelerType: 'business' | 'leisure' | 'couple' | 'family' | 'solo' | 'group';
}

// Selected Hotel Interface
interface SelectedHotel {
  id: string;
  hotelId: string;
  hotel: HotelResult;
  room: HotelRoom;
  guests: GuestInfo[];
  checkIn: Date;
  checkOut: Date;
  nights: number;
  totalPrice: number;
  currency: string;
  specialRequests: string[];
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Guest Info Interface
interface GuestInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  specialRequests: string[];
}

// Hotel Reservation Interface
interface HotelReservation {
  id: string;
  reservationNumber: string;
  selectedHotel: SelectedHotel;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  confirmationNumber: string;
  bookingDate: Date;
  checkIn: Date;
  checkOut: Date;
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
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'check-in';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Hotel Reservation Settings Interface
interface HotelReservationSettings {
  preferredBrands: string[];
  preferredAmenities: string[];
  starRatingPreference: number[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  roomPreferences: {
    bedType: string;
    smoking: boolean;
    petFriendly: boolean;
    accessibility: boolean;
  };
  bookingPreferences: {
    instantBooking: boolean;
    flexibleDates: boolean;
    freeCancellation: boolean;
    breakfastIncluded: boolean;
  };
  notifications: {
    priceDrops: boolean;
    availabilityChanges: boolean;
    checkInReminders: boolean;
    reviewRequests: boolean;
  };
}

// Hotel Reservations Component
export const HotelReservations = React.forwardRef<HTMLDivElement, HotelReservationsProps>(
  ({ 
    className, 
    onReservationUpdate,
    initialReservation,
    showFilters = true,
    showComparison = true,
    showReviews = true,
    showMap = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [reservation, setReservation] = useState<HotelReservationData>(
      initialReservation || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          destination: '',
          checkIn: new Date(),
          checkOut: new Date(),
          guests: { adults: 2, children: 0, rooms: 1 },
          priceRange: { min: 0, max: 1000, currency: 'USD' },
          starRating: [3, 4, 5],
          amenities: [],
          hotelTypes: [],
          distanceFromCenter: 10,
          flexibleDates: false,
          instantBooking: false
        },
        searchResults: [],
        selectedHotels: [],
        reservations: [],
        favorites: [],
        settings: {
          preferredBrands: [],
          preferredAmenities: [],
          starRatingPreference: [3, 4, 5],
          priceRange: { min: 0, max: 1000, currency: 'USD' },
          roomPreferences: {
            bedType: 'any',
            smoking: false,
            petFriendly: false,
            accessibility: false
          },
          bookingPreferences: {
            instantBooking: false,
            flexibleDates: false,
            freeCancellation: true,
            breakfastIncluded: false
          },
          notifications: {
            priceDrops: true,
            availabilityChanges: true,
            checkInReminders: true,
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
    const [selectedHotel, setSelectedHotel] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '🏨' },
      { id: 'comparison', name: 'Comparison', icon: '⚖️' },
      { id: 'reservations', name: 'Reservations', icon: '🎫' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' }
    ];

    const hotelTypes = [
      { id: 'hotel', name: 'Hotel', icon: '🏨', color: 'blue' },
      { id: 'resort', name: 'Resort', icon: '🏖️', color: 'green' },
      { id: 'boutique', name: 'Boutique', icon: '✨', color: 'purple' },
      { id: 'hostel', name: 'Hostel', icon: '🏠', color: 'orange' },
      { id: 'apartment', name: 'Apartment', icon: '🏢', color: 'gray' },
      { id: 'villa', name: 'Villa', icon: '🏡', color: 'pink' }
    ];

    const amenities = [
      { id: 'wifi', name: 'Free WiFi', icon: '📶', category: 'general' },
      { id: 'parking', name: 'Parking', icon: '🅿️', category: 'general' },
      { id: 'pool', name: 'Pool', icon: '🏊', category: 'general' },
      { id: 'gym', name: 'Fitness Center', icon: '💪', category: 'fitness' },
      { id: 'spa', name: 'Spa', icon: '🧘', category: 'general' },
      { id: 'restaurant', name: 'Restaurant', icon: '🍽️', category: 'dining' },
      { id: 'bar', name: 'Bar', icon: '🍸', category: 'dining' },
      { id: 'business', name: 'Business Center', icon: '💼', category: 'business' },
      { id: 'concierge', name: 'Concierge', icon: '🎩', category: 'general' },
      { id: 'room-service', name: 'Room Service', icon: '🍽️', category: 'room' }
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

    const searchHotels = useCallback(() => {
      setIsSearching(true);
      // Simulate hotel search
      setTimeout(() => {
        const mockResults: HotelResult[] = [
          {
            id: 'hotel-1',
            name: 'Grand Paris Hotel',
            brand: 'Grand Hotels',
            starRating: 5,
            address: {
              street: '123 Champs-Élysées',
              city: 'Paris',
              state: 'Île-de-France',
              zipCode: '75008',
              country: 'France',
              coordinates: { lat: 48.8566, lng: 2.3522 }
            },
            description: 'Luxury hotel in the heart of Paris with stunning views of the Eiffel Tower.',
            images: [],
            amenities: [],
            rooms: [],
            policies: [],
            reviews: [],
            rating: {
              overall: 4.5,
              cleanliness: 4.6,
              service: 4.4,
              location: 4.8,
              value: 4.2,
              reviewCount: 1250
            },
            price: {
              base: 300,
              taxes: 60,
              fees: 30,
              total: 390,
              currency: 'USD',
              perNight: 390
            },
            availability: {
              roomsAvailable: 3,
              lastUpdated: new Date()
            },
            cancellationPolicy: 'Free cancellation until 24 hours before check-in',
            checkInTime: '15:00',
            checkOutTime: '11:00',
            petFriendly: true,
            wifiIncluded: true,
            parkingAvailable: true,
            bookingUrl: 'https://grandhotels.com',
            provider: 'Grand Hotels',
            lastUpdated: new Date()
          }
        ];
        updateReservation('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateReservation]);

    const selectHotel = useCallback((hotelId: string) => {
      const hotel = reservation.searchResults.find(h => h.id === hotelId);
      if (!hotel) return;

      const selectedHotel: SelectedHotel = {
        id: `selected-${Date.now()}`,
        hotelId: hotel.id,
        hotel: hotel,
        room: hotel.rooms[0] || {
          id: 'room-1',
          name: 'Standard Room',
          type: 'standard',
          size: 300,
          maxOccupancy: 2,
          bedConfiguration: '1 King Bed',
          amenities: [],
          images: [],
          price: hotel.price,
          availability: 1,
          cancellationPolicy: hotel.cancellationPolicy,
          smokingAllowed: false,
          petFriendly: hotel.petFriendly
        },
        guests: [],
        checkIn: reservation.searchCriteria.checkIn,
        checkOut: reservation.searchCriteria.checkOut,
        nights: Math.ceil((reservation.searchCriteria.checkOut.getTime() - reservation.searchCriteria.checkIn.getTime()) / (1000 * 60 * 60 * 24)),
        totalPrice: hotel.price.total,
        currency: hotel.price.currency,
        specialRequests: [],
        status: 'selected',
        createdAt: new Date()
      };
      updateReservation('selectedHotels', [...reservation.selectedHotels, selectedHotel]);
    }, [reservation.searchResults, reservation.selectedHotels, reservation.searchCriteria, updateReservation]);

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

    const getStarRating = (rating: number) => {
      return '⭐'.repeat(Math.floor(rating));
    };

    const getHotelTypeIcon = (type: string) => {
      const hotelType = hotelTypes.find(t => t.id === type);
      return hotelType?.icon || '🏨';
    };

    const getHotelTypeName = (type: string) => {
      const hotelType = hotelTypes.find(t => t.id === type);
      return hotelType?.name || type;
    };

    const getAmenityIcon = (amenityId: string) => {
      const amenity = amenities.find(a => a.id === amenityId);
      return amenity?.icon || '🏨';
    };

    const getAmenityName = (amenityId: string) => {
      const amenity = amenities.find(a => a.id === amenityId);
      return amenity?.name || amenityId;
    };

    const calculateNights = (checkIn: Date, checkOut: Date) => {
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          hotelReservationsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Hotel Reservations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find and book hotels for {reservation.tripName || 'your trip'}
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

        {/* Hotel Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Hotels
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
                placeholder="City, hotel, or landmark"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Check-in
              </label>
              <input
                type="date"
                value={reservation.searchCriteria.checkIn.toISOString().split('T')[0]}
                onChange={(e) => updateReservation('searchCriteria.checkIn', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Check-out
              </label>
              <input
                type="date"
                value={reservation.searchCriteria.checkOut.toISOString().split('T')[0]}
                onChange={(e) => updateReservation('searchCriteria.checkOut', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Guests & Rooms
              </label>
              <div className="flex gap-1">
                <select
                  value={reservation.searchCriteria.guests.adults}
                  onChange={(e) => updateReservation('searchCriteria.guests.adults', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={reservation.searchCriteria.guests.children}
                  onChange={(e) => updateReservation('searchCriteria.guests.children', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </select>
                <select
                  value={reservation.searchCriteria.guests.rooms}
                  onChange={(e) => updateReservation('searchCriteria.guests.rooms', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Star Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => {
                      const currentRatings = reservation.searchCriteria.starRating;
                      const newRatings = currentRatings.includes(rating)
                        ? currentRatings.filter(r => r !== rating)
                        : [...currentRatings, rating];
                      updateReservation('searchCriteria.starRating', newRatings);
                    }}
                    className={cn(
                      'px-3 py-1 text-sm rounded-md transition-colors duration-200',
                      reservation.searchCriteria.starRating.includes(rating)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {getStarRating(rating)}
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
                Distance from Center
              </label>
              <select
                value={reservation.searchCriteria.distanceFromCenter}
                onChange={(e) => updateReservation('searchCriteria.distanceFromCenter', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
                <option value={50}>Within 50 km</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={reservation.searchCriteria.flexibleDates}
                onChange={(e) => updateReservation('searchCriteria.flexibleDates', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flexible dates</span>
            </label>
            
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
            onClick={searchHotels}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Hotels'}
          </button>
        </div>

        {/* Hotel Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {reservation.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {reservation.selectedHotels.length}
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
                  Hotel Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {reservation.searchResults.length} hotels found
                </div>
              </div>
              
              <div className={cn(
                'gap-4',
                viewMode === 'list' && 'space-y-3',
                viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                viewMode === 'map' && 'grid grid-cols-1 lg:grid-cols-2'
              )}>
                {reservation.searchResults.map((hotel) => (
                  <div key={hotel.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {viewMode === 'grid' && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">🏨</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {hotel.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hotel.address.city}, {hotel.address.country}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-yellow-500">{getStarRating(hotel.starRating)}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {hotel.rating.overall}/5 ({hotel.rating.reviewCount} reviews)
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(hotel.price.perNight, hotel.price.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            per night
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {hotel.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {hotel.amenities.slice(0, 3).map((amenity) => (
                            <span
                              key={amenity.id}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                              {getAmenityIcon(amenity.id)} {getAmenityName(amenity.id)}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                            Details
                          </button>
                          <button
                            onClick={() => selectHotel(hotel.id)}
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
                          <span className="text-2xl">🏨</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {reservationItem.selectedHotel.hotel.name}
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
                            <span>Check-in:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(reservationItem.checkIn)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Check-out:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(reservationItem.checkOut)}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Nights:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {calculateNights(reservationItem.checkIn, reservationItem.checkOut)}
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
                  <p>Search and book hotels to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Hotels
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No favorite hotels yet
                </h3>
                <p>Save hotels you like to your favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

HotelReservations.displayName = 'HotelReservations';

// Hotel Reservations Demo Component
interface HotelReservationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const HotelReservationsDemo = React.forwardRef<HTMLDivElement, HotelReservationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [reservation, setReservation] = useState<Partial<HotelReservationData>>({});

    const handleReservationUpdate = (updatedReservation: HotelReservationData) => {
      setReservation(updatedReservation);
      console.log('Hotel reservation updated:', updatedReservation);
    };

    const mockReservation: Partial<HotelReservationData> = {
      id: 'hotel-reservation-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        destination: 'Paris',
        checkIn: new Date('2024-06-15'),
        checkOut: new Date('2024-06-22'),
        guests: { adults: 2, children: 0, rooms: 1 },
        priceRange: { min: 0, max: 500, currency: 'USD' },
        starRating: [3, 4, 5],
        amenities: [],
        hotelTypes: [],
        distanceFromCenter: 10,
        flexibleDates: false,
        instantBooking: false
      },
      searchResults: [],
      selectedHotels: [],
      reservations: [],
      favorites: [],
      settings: {
        preferredBrands: [],
        preferredAmenities: [],
        starRatingPreference: [3, 4, 5],
        priceRange: { min: 0, max: 500, currency: 'USD' },
        roomPreferences: {
          bedType: 'any',
          smoking: false,
          petFriendly: false,
          accessibility: false
        },
        bookingPreferences: {
          instantBooking: false,
          flexibleDates: false,
          freeCancellation: true,
          breakfastIncluded: false
        },
        notifications: {
          priceDrops: true,
          availabilityChanges: true,
          checkInReminders: true,
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
          Hotel Reservations Demo
        </h3>
        
        <HotelReservations
          onReservationUpdate={handleReservationUpdate}
          initialReservation={mockReservation}
          showFilters={true}
          showComparison={true}
          showReviews={true}
          showMap={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive hotel search and booking with filters, comparison, reviews, and map view.
            </p>
          </div>
        )}
      </div>
    );
  }
);

HotelReservationsDemo.displayName = 'HotelReservationsDemo';

// Export all components
export {
  hotelReservationsVariants,
  type HotelReservationsProps,
  type HotelReservationData,
  type HotelSearchCriteria,
  type HotelResult,
  type HotelImage,
  type HotelAmenity,
  type HotelRoom,
  type HotelPolicy,
  type HotelReview,
  type SelectedHotel,
  type GuestInfo,
  type HotelReservation,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type HotelReservationSettings,
  type HotelReservationsDemoProps
};
