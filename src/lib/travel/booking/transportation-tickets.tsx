/**
 * Transportation Tickets Component
 * 
 * Provides public transport ticket booking for Atlas travel agent.
 * Implements ticket search, comparison, and booking for buses, trains, metros, and other public transport.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Transportation Tickets Variants
const transportationTicketsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'transportation-tickets-mode-standard',
        'enhanced': 'transportation-tickets-mode-enhanced',
        'advanced': 'transportation-tickets-mode-advanced',
        'custom': 'transportation-tickets-mode-custom'
      },
      type: {
        'bus': 'transportation-type-bus',
        'train': 'transportation-type-train',
        'metro': 'transportation-type-metro',
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

// Transportation Tickets Props
interface TransportationTicketsProps extends VariantProps<typeof transportationTicketsVariants> {
  className?: string;
  onTicketUpdate?: (ticket: TransportationTicketData) => void;
  initialTicket?: Partial<TransportationTicketData>;
  showFilters?: boolean;
  showRoutes?: boolean;
  showPasses?: boolean;
  showRealTime?: boolean;
}

// Transportation Ticket Data Interface
interface TransportationTicketData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: TransportationSearchCriteria;
  searchResults: TransportationResult[];
  selectedTickets: SelectedTicket[];
  bookings: TransportationBooking[];
  passes: TransportationPass[];
  favorites: string[];
  settings: TransportationTicketSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Transportation Search Criteria Interface
interface TransportationSearchCriteria {
  origin: string;
  destination: string;
  departureDate: Date;
  departureTime?: string;
  returnDate?: Date;
  returnTime?: string;
  passengers: {
    adults: number;
    children: number;
    seniors: number;
    students: number;
  };
  transportTypes: string[];
  ticketTypes: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  preferences: {
    directOnly: boolean;
    accessible: boolean;
    wifiRequired: boolean;
    airConditioning: boolean;
  };
  flexibleDates: boolean;
}

// Transportation Result Interface
interface TransportationResult {
  id: string;
  provider: TransportationProvider;
  route: TransportationRoute;
  schedule: TransportationSchedule;
  pricing: TransportationPricing;
  availability: TransportationAvailability;
  amenities: TransportationAmenity[];
  policies: TransportationPolicy[];
  rating: {
    overall: number;
    punctuality: number;
    comfort: number;
    cleanliness: number;
    value: number;
    reviewCount: number;
  };
  reviews: TransportationReview[];
  lastUpdated: Date;
}

// Transportation Provider Interface
interface TransportationProvider {
  id: string;
  name: string;
  logo: string;
  type: 'bus' | 'train' | 'metro' | 'tram' | 'ferry' | 'cable-car';
  description: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  languages: string[];
  specialties: string[];
}

// Transportation Route Interface
interface TransportationRoute {
  id: string;
  name: string;
  origin: RouteStop;
  destination: RouteStop;
  stops: RouteStop[];
  distance: number; // in km
  duration: number; // in minutes
  frequency: string;
  operatingDays: string[];
  seasonalSchedule: SeasonalSchedule[];
}

// Route Stop Interface
interface RouteStop {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    hearingAccessible: boolean;
    visualAccessible: boolean;
  };
  connections: string[];
}

// Seasonal Schedule Interface
interface SeasonalSchedule {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  startDate: Date;
  endDate: Date;
  schedule: TransportationSchedule;
}

// Transportation Schedule Interface
interface TransportationSchedule {
  departure: string;
  arrival: string;
  duration: number; // in minutes
  frequency: string;
  operatingDays: string[];
  exceptions: ScheduleException[];
}

// Schedule Exception Interface
interface ScheduleException {
  date: Date;
  reason: string;
  alternativeSchedule?: TransportationSchedule;
}

// Transportation Pricing Interface
interface TransportationPricing {
  basePrice: number;
  adultPrice: number;
  childPrice: number;
  seniorPrice: number;
  studentPrice: number;
  taxes: number;
  fees: {
    bookingFee: number;
    serviceFee: number;
    convenienceFee: number;
  };
  total: number;
  currency: string;
  discounts: TransportationDiscount[];
  paymentMethods: string[];
  refundPolicy: string;
}

// Transportation Discount Interface
interface TransportationDiscount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'group';
  value: number;
  conditions: string[];
  validFrom: Date;
  validTo: Date;
}

// Transportation Availability Interface
interface TransportationAvailability {
  isAvailable: boolean;
  availableSeats: number;
  totalSeats: number;
  lastUpdated: Date;
  restrictions: string[];
  blackoutDates: Date[];
}

// Transportation Amenity Interface
interface TransportationAmenity {
  id: string;
  name: string;
  icon: string;
  category: 'comfort' | 'entertainment' | 'service' | 'accessibility';
  isIncluded: boolean;
  price?: number;
  currency?: string;
  description: string;
}

// Transportation Policy Interface
interface TransportationPolicy {
  id: string;
  type: 'luggage' | 'pets' | 'smoking' | 'food' | 'cancellation' | 'refund';
  title: string;
  description: string;
  isImportant: boolean;
  restrictions: string[];
}

// Transportation Review Interface
interface TransportationReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  route: string;
  travelDate: Date;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple' | 'group';
  photos: string[];
}

// Selected Ticket Interface
interface SelectedTicket {
  id: string;
  ticketId: string;
  ticket: TransportationResult;
  passengers: PassengerInfo[];
  seatPreference: string;
  extras: SelectedExtra[];
  specialRequests: string[];
  totalPrice: number;
  currency: string;
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Passenger Info Interface
interface PassengerInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  type: 'adult' | 'child' | 'senior' | 'student';
  specialNeeds: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Selected Extra Interface
interface SelectedExtra {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  totalPrice: number;
}

// Transportation Pass Interface
interface TransportationPass {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'annual';
  description: string;
  validity: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  coverage: string[];
  price: number;
  currency: string;
  benefits: string[];
  restrictions: string[];
  isActive: boolean;
  purchasedDate: Date;
}

// Transportation Booking Interface
interface TransportationBooking {
  id: string;
  bookingNumber: string;
  selectedTicket: SelectedTicket;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
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

// Transportation Ticket Settings Interface
interface TransportationTicketSettings {
  preferredProviders: string[];
  preferredTransportTypes: string[];
  preferredTicketTypes: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  preferences: {
    directOnly: boolean;
    accessible: boolean;
    wifiRequired: boolean;
    airConditioning: boolean;
  };
  notifications: {
    priceDrops: boolean;
    scheduleChanges: boolean;
    delayAlerts: boolean;
    reminderNotifications: boolean;
  };
}

// Transportation Tickets Component
export const TransportationTickets = React.forwardRef<HTMLDivElement, TransportationTicketsProps>(
  ({ 
    className, 
    onTicketUpdate,
    initialTicket,
    showFilters = true,
    showRoutes = true,
    showPasses = true,
    showRealTime = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [ticket, setTicket] = useState<TransportationTicketData>(
      initialTicket || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          origin: '',
          destination: '',
          departureDate: new Date(),
          passengers: { adults: 1, children: 0, seniors: 0, students: 0 },
          transportTypes: [],
          ticketTypes: [],
          priceRange: { min: 0, max: 100, currency: 'USD' },
          preferences: {
            directOnly: false,
            accessible: false,
            wifiRequired: false,
            airConditioning: false
          },
          flexibleDates: false
        },
        searchResults: [],
        selectedTickets: [],
        bookings: [],
        passes: [],
        favorites: [],
        settings: {
          preferredProviders: [],
          preferredTransportTypes: [],
          preferredTicketTypes: [],
          priceRange: { min: 0, max: 100, currency: 'USD' },
          preferences: {
            directOnly: false,
            accessible: false,
            wifiRequired: false,
            airConditioning: false
          },
          notifications: {
            priceDrops: true,
            scheduleChanges: true,
            delayAlerts: true,
            reminderNotifications: true
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '🚌' },
      { id: 'routes', name: 'Routes', icon: '🗺️' },
      { id: 'passes', name: 'Passes', icon: '🎫' },
      { id: 'bookings', name: 'Bookings', icon: '📋' }
    ];

    const transportTypes = [
      { id: 'bus', name: 'Bus', icon: '🚌', color: 'blue' },
      { id: 'train', name: 'Train', icon: '🚂', color: 'green' },
      { id: 'metro', name: 'Metro', icon: '🚇', color: 'red' },
      { id: 'tram', name: 'Tram', icon: '🚋', color: 'yellow' },
      { id: 'ferry', name: 'Ferry', icon: '⛴️', color: 'cyan' },
      { id: 'cable-car', name: 'Cable Car', icon: '🚠', color: 'purple' }
    ];

    const ticketTypes = [
      { id: 'single', name: 'Single Ticket', icon: '🎫', color: 'blue' },
      { id: 'return', name: 'Return Ticket', icon: '🔄', color: 'green' },
      { id: 'daily', name: 'Daily Pass', icon: '📅', color: 'purple' },
      { id: 'weekly', name: 'Weekly Pass', icon: '📆', color: 'orange' },
      { id: 'monthly', name: 'Monthly Pass', icon: '🗓️', color: 'pink' },
      { id: 'group', name: 'Group Ticket', icon: '👥', color: 'indigo' }
    ];

    const amenities = [
      { id: 'wifi', name: 'WiFi', icon: '📶', category: 'service' },
      { id: 'air-conditioning', name: 'Air Conditioning', icon: '❄️', category: 'comfort' },
      { id: 'charging-ports', name: 'Charging Ports', icon: '🔌', category: 'service' },
      { id: 'toilet', name: 'Toilet', icon: '🚻', category: 'service' },
      { id: 'snacks', name: 'Snacks', icon: '🍿', category: 'service' },
      { id: 'entertainment', name: 'Entertainment', icon: '📺', category: 'entertainment' },
      { id: 'luggage-space', name: 'Luggage Space', icon: '🧳', category: 'service' },
      { id: 'wheelchair-access', name: 'Wheelchair Access', icon: '♿', category: 'accessibility' }
    ];

    const updateTicket = useCallback((path: string, value: any) => {
      setTicket(prev => {
        const newTicket = { ...prev };
        const keys = path.split('.');
        let current: any = newTicket;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newTicket.updatedAt = new Date();
        onTicketUpdate?.(newTicket);
        return newTicket;
      });
    }, [onTicketUpdate]);

    const searchTransportation = useCallback(() => {
      setIsSearching(true);
      // Simulate transportation search
      setTimeout(() => {
        const mockResults: TransportationResult[] = [
          {
            id: 'transport-1',
            provider: {
              id: 'provider-1',
              name: 'RATP',
              logo: '🚇',
              type: 'metro',
              description: 'Paris Metro and Bus Services',
              rating: 4.2,
              reviewCount: 850,
              verified: true,
              contact: {
                phone: '+33 1 58 76 16 16',
                email: 'info@ratp.fr',
                website: 'https://ratp.fr'
              },
              languages: ['fr', 'en'],
              specialties: ['metro', 'bus', 'tram']
            },
            route: {
              id: 'route-1',
              name: 'Line 1 - Châtelet to Bastille',
              origin: {
                id: 'stop-1',
                name: 'Châtelet',
                address: '1 Place du Châtelet, 75001 Paris',
                coordinates: { lat: 48.8584, lng: 2.3470 },
                facilities: ['ticket-office', 'toilets', 'shops'],
                accessibility: {
                  wheelchairAccessible: true,
                  hearingAccessible: true,
                  visualAccessible: true
                },
                connections: ['RER A', 'RER B', 'Line 4', 'Line 7', 'Line 11', 'Line 14']
              },
              destination: {
                id: 'stop-2',
                name: 'Bastille',
                address: 'Place de la Bastille, 75011 Paris',
                coordinates: { lat: 48.8532, lng: 2.3694 },
                facilities: ['ticket-office', 'toilets'],
                accessibility: {
                  wheelchairAccessible: true,
                  hearingAccessible: true,
                  visualAccessible: true
                },
                connections: ['Line 5', 'Line 8']
              },
              stops: [],
              distance: 2.5,
              duration: 8,
              frequency: 'Every 2-3 minutes',
              operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
              seasonalSchedule: []
            },
            schedule: {
              departure: '06:00',
              arrival: '06:08',
              duration: 8,
              frequency: 'Every 2-3 minutes',
              operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
              exceptions: []
            },
            pricing: {
              basePrice: 2.10,
              adultPrice: 2.10,
              childPrice: 1.05,
              seniorPrice: 1.05,
              studentPrice: 1.05,
              taxes: 0,
              fees: {
                bookingFee: 0,
                serviceFee: 0,
                convenienceFee: 0
              },
              total: 2.10,
              currency: 'EUR',
              discounts: [],
              paymentMethods: ['cash', 'credit-card', 'contactless'],
              refundPolicy: 'Non-refundable'
            },
            availability: {
              isAvailable: true,
              availableSeats: 0, // Standing only
              totalSeats: 0,
              lastUpdated: new Date(),
              restrictions: [],
              blackoutDates: []
            },
            amenities: [],
            policies: [],
            rating: {
              overall: 4.2,
              punctuality: 4.0,
              comfort: 3.8,
              cleanliness: 4.1,
              value: 4.5,
              reviewCount: 850
            },
            reviews: [],
            lastUpdated: new Date()
          }
        ];
        updateTicket('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateTicket]);

    const selectTicket = useCallback((ticketId: string) => {
      const transportTicket = ticket.searchResults.find(t => t.id === ticketId);
      if (!transportTicket) return;

      const selectedTicket: SelectedTicket = {
        id: `selected-${Date.now()}`,
        ticketId: transportTicket.id,
        ticket: transportTicket,
        passengers: [],
        seatPreference: '',
        extras: [],
        specialRequests: [],
        totalPrice: transportTicket.pricing.total,
        currency: transportTicket.pricing.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updateTicket('selectedTickets', [...ticket.selectedTickets, selectedTicket]);
    }, [ticket.searchResults, ticket.selectedTickets, updateTicket]);

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

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };

    const getTransportTypeIcon = (type: string) => {
      const transportType = transportTypes.find(t => t.id === type);
      return transportType?.icon || '🚌';
    };

    const getTransportTypeName = (type: string) => {
      const transportType = transportTypes.find(t => t.id === type);
      return transportType?.name || type;
    };

    const getTicketTypeIcon = (type: string) => {
      const ticketType = ticketTypes.find(t => t.id === type);
      return ticketType?.icon || '🎫';
    };

    const getTicketTypeName = (type: string) => {
      const ticketType = ticketTypes.find(t => t.id === type);
      return ticketType?.name || type;
    };

    const getAmenityIcon = (amenityId: string) => {
      const amenity = amenities.find(a => a.id === amenityId);
      return amenity?.icon || '🚌';
    };

    const getAmenityName = (amenityId: string) => {
      const amenity = amenities.find(a => a.id === amenityId);
      return amenity?.name || amenityId;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          transportationTicketsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Transportation Tickets
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Book public transport for {ticket.tripName || 'your trip'}
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
              🎫 My Tickets
            </button>
          </div>
        </div>

        {/* Transportation Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Transportation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <input
                type="text"
                value={ticket.searchCriteria.origin}
                onChange={(e) => updateTicket('searchCriteria.origin', e.target.value)}
                placeholder="Station or stop"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <input
                type="text"
                value={ticket.searchCriteria.destination}
                onChange={(e) => updateTicket('searchCriteria.destination', e.target.value)}
                placeholder="Station or stop"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={ticket.searchCriteria.departureDate.toISOString().split('T')[0]}
                onChange={(e) => updateTicket('searchCriteria.departureDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departure Time
              </label>
              <input
                type="time"
                value={ticket.searchCriteria.departureTime || ''}
                onChange={(e) => updateTicket('searchCriteria.departureTime', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Passengers
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={ticket.searchCriteria.passengers.adults}
                  onChange={(e) => updateTicket('searchCriteria.passengers.adults', parseInt(e.target.value))}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={ticket.searchCriteria.passengers.children}
                  onChange={(e) => updateTicket('searchCriteria.passengers.children', parseInt(e.target.value))}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[0, 1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transport Type
              </label>
              <div className="flex flex-wrap gap-1">
                {transportTypes.slice(0, 4).map((transportType) => (
                  <button
                    key={transportType.id}
                    onClick={() => {
                      const currentTypes = ticket.searchCriteria.transportTypes;
                      const newTypes = currentTypes.includes(transportType.id)
                        ? currentTypes.filter(t => t !== transportType.id)
                        : [...currentTypes, transportType.id];
                      updateTicket('searchCriteria.transportTypes', newTypes);
                    }}
                    className={cn(
                      'px-2 py-1 text-xs rounded-md transition-colors duration-200',
                      ticket.searchCriteria.transportTypes.includes(transportType.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    )}
                  >
                    {transportType.icon} {transportType.name}
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
                  value={ticket.searchCriteria.priceRange.min}
                  onChange={(e) => updateTicket('searchCriteria.priceRange.min', parseInt(e.target.value))}
                  placeholder="Min"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <input
                  type="number"
                  value={ticket.searchCriteria.priceRange.max}
                  onChange={(e) => updateTicket('searchCriteria.priceRange.max', parseInt(e.target.value))}
                  placeholder="Max"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ticket.searchCriteria.preferences.directOnly}
                onChange={(e) => updateTicket('searchCriteria.preferences.directOnly', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Direct only</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ticket.searchCriteria.preferences.accessible}
                onChange={(e) => updateTicket('searchCriteria.preferences.accessible', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Accessible</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={ticket.searchCriteria.flexibleDates}
                onChange={(e) => updateTicket('searchCriteria.flexibleDates', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Flexible dates</span>
            </label>
          </div>
          
          <button
            onClick={searchTransportation}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Transportation'}
          </button>
        </div>

        {/* Transportation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {ticket.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {ticket.selectedTickets.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Selected</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {ticket.bookings.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Bookings</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {ticket.passes.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Passes</div>
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
                  Transportation Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {ticket.searchResults.length} options found
                </div>
              </div>
              
              <div className={cn(
                'gap-4',
                viewMode === 'list' && 'space-y-3',
                viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                viewMode === 'map' && 'grid grid-cols-1 lg:grid-cols-2'
              )}>
                {ticket.searchResults.map((transport) => (
                  <div key={transport.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {viewMode === 'grid' && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">{getTransportTypeIcon(transport.provider.type)}</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTransportTypeIcon(transport.provider.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {transport.provider.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {transport.route.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {transport.route.origin.name} → {transport.route.destination.name}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(transport.pricing.adultPrice, transport.pricing.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            per person
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatTime(transport.route.duration)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {transport.route.distance} km
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frequency:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {transport.route.frequency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {transport.rating.overall}/5 ({transport.rating.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {transport.amenities.slice(0, 3).map((amenity) => (
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
                            onClick={() => selectTicket(transport.id)}
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
              
              {ticket.bookings.length > 0 ? (
                <div className="space-y-3">
                  {ticket.bookings.map((booking) => (
                    <div key={booking.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTransportTypeIcon(booking.selectedTicket.ticket.provider.type)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {booking.selectedTicket.ticket.provider.name}
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
                            <span>Route:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.selectedTicket.ticket.route.origin.name} → {booking.selectedTicket.ticket.route.destination.name}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Passengers:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {booking.selectedTicket.passengers.length}
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
                  <p>Search and book transportation to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'passes' && showPasses && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Transportation Passes
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">🎫</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Passes coming soon
                </h3>
                <p>Daily, weekly, and monthly transportation passes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TransportationTickets.displayName = 'TransportationTickets';

// Transportation Tickets Demo Component
interface TransportationTicketsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TransportationTicketsDemo = React.forwardRef<HTMLDivElement, TransportationTicketsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [ticket, setTicket] = useState<Partial<TransportationTicketData>>({});

    const handleTicketUpdate = (updatedTicket: TransportationTicketData) => {
      setTicket(updatedTicket);
      console.log('Transportation ticket updated:', updatedTicket);
    };

    const mockTicket: Partial<TransportationTicketData> = {
      id: 'transportation-ticket-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        origin: 'Châtelet',
        destination: 'Bastille',
        departureDate: new Date('2024-06-15'),
        passengers: { adults: 2, children: 0, seniors: 0, students: 0 },
        transportTypes: [],
        ticketTypes: [],
        priceRange: { min: 0, max: 10, currency: 'EUR' },
        preferences: {
          directOnly: false,
          accessible: false,
          wifiRequired: false,
          airConditioning: false
        },
        flexibleDates: false
      },
      searchResults: [],
      selectedTickets: [],
      bookings: [],
      passes: [],
      favorites: [],
      settings: {
        preferredProviders: [],
        preferredTransportTypes: [],
        preferredTicketTypes: [],
        priceRange: { min: 0, max: 10, currency: 'EUR' },
        preferences: {
          directOnly: false,
          accessible: false,
          wifiRequired: false,
          airConditioning: false
        },
        notifications: {
          priceDrops: true,
          scheduleChanges: true,
          delayAlerts: true,
          reminderNotifications: true
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
          Transportation Tickets Demo
        </h3>
        
        <TransportationTickets
          onTicketUpdate={handleTicketUpdate}
          initialTicket={mockTicket}
          showFilters={true}
          showRoutes={true}
          showPasses={true}
          showRealTime={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive public transport ticket booking with search, routes, passes, and real-time updates.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TransportationTicketsDemo.displayName = 'TransportationTicketsDemo';

// Export all components
export {
  transportationTicketsVariants,
  type TransportationTicketsProps,
  type TransportationTicketData,
  type TransportationSearchCriteria,
  type TransportationResult,
  type TransportationProvider,
  type TransportationRoute,
  type RouteStop,
  type SeasonalSchedule,
  type TransportationSchedule,
  type ScheduleException,
  type TransportationPricing,
  type TransportationDiscount,
  type TransportationAvailability,
  type TransportationAmenity,
  type TransportationPolicy,
  type TransportationReview,
  type SelectedTicket,
  type PassengerInfo,
  type SelectedExtra,
  type TransportationPass,
  type TransportationBooking,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type TransportationTicketSettings,
  type TransportationTicketsDemoProps
};
