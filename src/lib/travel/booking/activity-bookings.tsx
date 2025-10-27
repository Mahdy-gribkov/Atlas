/**
 * Activity Bookings Component
 * 
 * Provides activity search, comparison, and booking for Atlas travel agent.
 * Implements activity search, price comparison, availability checking, and booking management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Activity Bookings Variants
const activityBookingsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'activity-bookings-mode-standard',
        'enhanced': 'activity-bookings-mode-enhanced',
        'advanced': 'activity-bookings-mode-advanced',
        'custom': 'activity-bookings-mode-custom'
      },
      type: {
        'tours': 'activity-type-tours',
        'experiences': 'activity-type-experiences',
        'adventures': 'activity-type-adventures',
        'mixed': 'activity-type-mixed'
      },
      style: {
        'minimal': 'activity-style-minimal',
        'moderate': 'activity-style-moderate',
        'detailed': 'activity-style-detailed',
        'custom': 'activity-style-custom'
      },
      format: {
        'text': 'activity-format-text',
        'visual': 'activity-format-visual',
        'interactive': 'activity-format-interactive',
        'mixed': 'activity-format-mixed'
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

// Activity Bookings Props
interface ActivityBookingsProps extends VariantProps<typeof activityBookingsVariants> {
  className?: string;
  onBookingUpdate?: (booking: ActivityBookingData) => void;
  initialBooking?: Partial<ActivityBookingData>;
  showFilters?: boolean;
  showReviews?: boolean;
  showAvailability?: boolean;
  showRecommendations?: boolean;
}

// Activity Booking Data Interface
interface ActivityBookingData {
  id: string;
  tripId: string;
  tripName: string;
  searchCriteria: ActivitySearchCriteria;
  searchResults: ActivityResult[];
  selectedActivities: SelectedActivity[];
  bookings: ActivityBooking[];
  favorites: string[];
  settings: ActivityBookingSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Search Criteria Interface
interface ActivitySearchCriteria {
  destination: string;
  activityDate: Date;
  activityTime?: string;
  participants: {
    adults: number;
    children: number;
    seniors: number;
  };
  categories: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  duration: {
    min: number; // in hours
    max: number; // in hours
  };
  difficulty: 'easy' | 'moderate' | 'hard' | 'any';
  language: string[];
  features: string[];
  instantBooking: boolean;
}

// Activity Result Interface
interface ActivityResult {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  provider: ActivityProvider;
  location: ActivityLocation;
  pricing: ActivityPricing;
  availability: ActivityAvailability;
  details: ActivityDetails;
  requirements: ActivityRequirement[];
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  rating: {
    overall: number;
    value: number;
    guide: number;
    experience: number;
    reviewCount: number;
  };
  reviews: ActivityReview[];
  images: ActivityImage[];
  videos: ActivityVideo[];
  tags: string[];
  isPopular: boolean;
  isRecommended: boolean;
  lastUpdated: Date;
}

// Activity Provider Interface
interface ActivityProvider {
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
  languages: string[];
  specialties: string[];
}

// Activity Location Interface
interface ActivityLocation {
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
  meetingPoint: string;
  pickupAvailable: boolean;
  pickupLocations: string[];
  transportation: string;
  accessibility: {
    wheelchairAccessible: boolean;
    mobilityFriendly: boolean;
    hearingAccessible: boolean;
    visualAccessible: boolean;
  };
}

// Activity Pricing Interface
interface ActivityPricing {
  basePrice: number;
  adultPrice: number;
  childPrice: number;
  seniorPrice: number;
  groupDiscounts: GroupDiscount[];
  taxes: number;
  fees: {
    bookingFee: number;
    serviceFee: number;
    equipmentFee: number;
  };
  total: number;
  currency: string;
  paymentMethods: string[];
  depositRequired: boolean;
  depositAmount: number;
  refundPolicy: string;
}

// Group Discount Interface
interface GroupDiscount {
  minParticipants: number;
  maxParticipants: number;
  discountPercentage: number;
  discountAmount: number;
}

// Activity Availability Interface
interface ActivityAvailability {
  isAvailable: boolean;
  availableSlots: TimeSlot[];
  maxParticipants: number;
  minParticipants: number;
  currentBookings: number;
  lastUpdated: Date;
  blackoutDates: Date[];
  seasonalAvailability: SeasonalAvailability[];
}

// Time Slot Interface
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  availableSpots: number;
  price: number;
  currency: string;
  isPopular: boolean;
}

// Seasonal Availability Interface
interface SeasonalAvailability {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  startDate: Date;
  endDate: Date;
  isAvailable: boolean;
  priceMultiplier: number;
}

// Activity Details Interface
interface ActivityDetails {
  duration: number; // in minutes
  difficulty: 'easy' | 'moderate' | 'hard';
  groupSize: {
    min: number;
    max: number;
  };
  ageRestrictions: {
    minAge: number;
    maxAge?: number;
  };
  physicalRequirements: string[];
  whatToBring: string[];
  whatToExpect: string[];
  highlights: string[];
  itinerary: ActivityItinerary[];
}

// Activity Itinerary Interface
interface ActivityItinerary {
  id: string;
  time: string;
  activity: string;
  description: string;
  duration: number; // in minutes
  location: string;
}

// Activity Requirement Interface
interface ActivityRequirement {
  id: string;
  type: 'age' | 'fitness' | 'equipment' | 'documentation' | 'experience' | 'health';
  title: string;
  description: string;
  isMandatory: boolean;
  alternatives: string[];
}

// Activity Review Interface
interface ActivityReview {
  id: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  verified: boolean;
  helpful: number;
  activityDate: Date;
  travelerType: 'business' | 'leisure' | 'family' | 'solo' | 'couple' | 'group';
  photos: string[];
}

// Activity Image Interface
interface ActivityImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'main' | 'gallery' | 'equipment' | 'location' | 'participants';
  isPrimary: boolean;
}

// Activity Video Interface
interface ActivityVideo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  duration: number; // in seconds
  type: 'promotional' | 'tutorial' | 'testimonial' | 'behind-scenes';
}

// Selected Activity Interface
interface SelectedActivity {
  id: string;
  activityId: string;
  activity: ActivityResult;
  participants: ParticipantInfo[];
  selectedSlot: TimeSlot;
  extras: SelectedExtra[];
  specialRequests: string[];
  totalPrice: number;
  currency: string;
  status: 'selected' | 'booked' | 'confirmed' | 'cancelled';
  createdAt: Date;
}

// Participant Info Interface
interface ParticipantInfo {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  age: number;
  type: 'adult' | 'child' | 'senior';
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

// Activity Booking Interface
interface ActivityBooking {
  id: string;
  bookingNumber: string;
  selectedActivity: SelectedActivity;
  contactInfo: ContactInfo;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  confirmationNumber: string;
  bookingDate: Date;
  activityDate: Date;
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
  type: 'confirmation' | 'reminder' | 'change' | 'cancellation' | 'weather';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// Activity Booking Settings Interface
interface ActivityBookingSettings {
  preferredCategories: string[];
  preferredProviders: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  difficultyPreference: string;
  languagePreference: string[];
  features: string[];
  instantBooking: boolean;
  notifications: {
    priceDrops: boolean;
    availabilityChanges: boolean;
    weatherAlerts: boolean;
    reminderNotifications: boolean;
  };
}

// Activity Bookings Component
export const ActivityBookings = React.forwardRef<HTMLDivElement, ActivityBookingsProps>(
  ({ 
    className, 
    onBookingUpdate,
    initialBooking,
    showFilters = true,
    showReviews = true,
    showAvailability = true,
    showRecommendations = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [booking, setBooking] = useState<ActivityBookingData>(
      initialBooking || {
        id: '',
        tripId: '',
        tripName: '',
        searchCriteria: {
          destination: '',
          activityDate: new Date(),
          participants: { adults: 2, children: 0, seniors: 0 },
          categories: [],
          priceRange: { min: 0, max: 500, currency: 'USD' },
          duration: { min: 1, max: 8 },
          difficulty: 'any',
          language: ['en'],
          features: [],
          instantBooking: false
        },
        searchResults: [],
        selectedActivities: [],
        bookings: [],
        favorites: [],
        settings: {
          preferredCategories: [],
          preferredProviders: [],
          priceRange: { min: 0, max: 500, currency: 'USD' },
          difficultyPreference: 'any',
          languagePreference: ['en'],
          features: [],
          instantBooking: false,
          notifications: {
            priceDrops: true,
            availabilityChanges: true,
            weatherAlerts: true,
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
    const [selectedActivity, setSelectedActivity] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'results', name: 'Results', icon: '🎯' },
      { id: 'recommendations', name: 'Recommendations', icon: '💡' },
      { id: 'bookings', name: 'Bookings', icon: '🎫' },
      { id: 'favorites', name: 'Favorites', icon: '⭐' }
    ];

    const categories = [
      { id: 'tours', name: 'Tours', icon: '🚶', color: 'blue' },
      { id: 'adventures', name: 'Adventures', icon: '🏔️', color: 'green' },
      { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'purple' },
      { id: 'food', name: 'Food & Drink', icon: '🍽️', color: 'orange' },
      { id: 'nature', name: 'Nature', icon: '🌿', color: 'green' },
      { id: 'water', name: 'Water Sports', icon: '🏄', color: 'cyan' },
      { id: 'winter', name: 'Winter Sports', icon: '⛷️', color: 'blue' },
      { id: 'wellness', name: 'Wellness', icon: '🧘', color: 'pink' },
      { id: 'nightlife', name: 'Nightlife', icon: '🍸', color: 'indigo' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'yellow' }
    ];

    const difficulties = [
      { id: 'easy', name: 'Easy', icon: '🟢', color: 'green' },
      { id: 'moderate', name: 'Moderate', icon: '🟡', color: 'yellow' },
      { id: 'hard', name: 'Hard', icon: '🔴', color: 'red' }
    ];

    const features = [
      { id: 'pickup', name: 'Pickup Available', icon: '🚐' },
      { id: 'guide', name: 'Professional Guide', icon: '👨‍🏫' },
      { id: 'equipment', name: 'Equipment Included', icon: '🎒' },
      { id: 'meal', name: 'Meal Included', icon: '🍽️' },
      { id: 'photo', name: 'Photo Service', icon: '📸' },
      { id: 'insurance', name: 'Insurance Included', icon: '🛡️' },
      { id: 'wifi', name: 'WiFi Available', icon: '📶' },
      { id: 'accessibility', name: 'Accessible', icon: '♿' }
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

    const searchActivities = useCallback(() => {
      setIsSearching(true);
      // Simulate activity search
      setTimeout(() => {
        const mockResults: ActivityResult[] = [
          {
            id: 'activity-1',
            name: 'Paris City Walking Tour',
            description: 'Discover the hidden gems of Paris with our expert local guide.',
            category: 'tours',
            subcategory: 'city-tour',
            provider: {
              id: 'provider-1',
              name: 'Paris Tours Co.',
              logo: '🏛️',
              description: 'Professional tour company specializing in Paris experiences',
              rating: 4.8,
              reviewCount: 1250,
              verified: true,
              contact: {
                phone: '+33 1 23 45 67 89',
                email: 'info@paristours.com',
                website: 'https://paristours.com'
              },
              languages: ['en', 'fr', 'es'],
              specialties: ['city-tours', 'cultural-tours']
            },
            location: {
              id: 'location-1',
              name: 'Notre-Dame Cathedral',
              address: {
                street: '6 Parvis Notre-Dame',
                city: 'Paris',
                state: 'Île-de-France',
                zipCode: '75004',
                country: 'France'
              },
              coordinates: { lat: 48.8530, lng: 2.3499 },
              meetingPoint: 'In front of Notre-Dame Cathedral',
              pickupAvailable: true,
              pickupLocations: ['Hotel pickup', 'Metro stations'],
              transportation: 'Walking tour',
              accessibility: {
                wheelchairAccessible: true,
                mobilityFriendly: true,
                hearingAccessible: false,
                visualAccessible: false
              }
            },
            pricing: {
              basePrice: 45,
              adultPrice: 45,
              childPrice: 25,
              seniorPrice: 40,
              groupDiscounts: [],
              taxes: 5,
              fees: {
                bookingFee: 2,
                serviceFee: 3,
                equipmentFee: 0
              },
              total: 55,
              currency: 'USD',
              paymentMethods: ['credit-card', 'paypal'],
              depositRequired: false,
              depositAmount: 0,
              refundPolicy: 'Free cancellation up to 24 hours before activity'
            },
            availability: {
              isAvailable: true,
              availableSlots: [
                {
                  id: 'slot-1',
                  startTime: '09:00',
                  endTime: '12:00',
                  duration: 180,
                  availableSpots: 15,
                  price: 55,
                  currency: 'USD',
                  isPopular: true
                }
              ],
              maxParticipants: 20,
              minParticipants: 2,
              currentBookings: 5,
              lastUpdated: new Date(),
              blackoutDates: [],
              seasonalAvailability: []
            },
            details: {
              duration: 180,
              difficulty: 'easy',
              groupSize: { min: 2, max: 20 },
              ageRestrictions: { minAge: 6 },
              physicalRequirements: ['Ability to walk for 3 hours'],
              whatToBring: ['Comfortable walking shoes', 'Water bottle'],
              whatToExpect: ['Historic landmarks', 'Local stories', 'Photo opportunities'],
              highlights: ['Notre-Dame Cathedral', 'Seine River', 'Latin Quarter'],
              itinerary: []
            },
            requirements: [],
            inclusions: ['Professional guide', 'Audio headsets', 'Map'],
            exclusions: ['Food and drinks', 'Transportation', 'Tips'],
            cancellationPolicy: 'Free cancellation up to 24 hours before activity',
            rating: {
              overall: 4.7,
              value: 4.5,
              guide: 4.8,
              experience: 4.6,
              reviewCount: 320
            },
            reviews: [],
            images: [],
            videos: [],
            tags: ['walking', 'historic', 'cultural', 'family-friendly'],
            isPopular: true,
            isRecommended: true,
            lastUpdated: new Date()
          }
        ];
        updateBooking('searchResults', mockResults);
        setIsSearching(false);
      }, 2000);
    }, [updateBooking]);

    const selectActivity = useCallback((activityId: string) => {
      const activity = booking.searchResults.find(a => a.id === activityId);
      if (!activity) return;

      const selectedActivity: SelectedActivity = {
        id: `selected-${Date.now()}`,
        activityId: activity.id,
        activity: activity,
        participants: [],
        selectedSlot: activity.availability.availableSlots[0],
        extras: [],
        specialRequests: [],
        totalPrice: activity.pricing.total,
        currency: activity.pricing.currency,
        status: 'selected',
        createdAt: new Date()
      };
      updateBooking('selectedActivities', [...booking.selectedActivities, selectedActivity]);
    }, [booking.searchResults, booking.selectedActivities, updateBooking]);

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

    const formatDuration = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };

    const getCategoryIcon = (categoryId: string) => {
      const category = categories.find(c => c.id === categoryId);
      return category?.icon || '🎯';
    };

    const getCategoryName = (categoryId: string) => {
      const category = categories.find(c => c.id === categoryId);
      return category?.name || categoryId;
    };

    const getDifficultyIcon = (difficulty: string) => {
      const diff = difficulties.find(d => d.id === difficulty);
      return diff?.icon || '🟢';
    };

    const getDifficultyName = (difficulty: string) => {
      const diff = difficulties.find(d => d.id === difficulty);
      return diff?.name || difficulty;
    };

    const getFeatureIcon = (featureId: string) => {
      const feature = features.find(f => f.id === featureId);
      return feature?.icon || '🎯';
    };

    const getFeatureName = (featureId: string) => {
      const feature = features.find(f => f.id === featureId);
      return feature?.name || featureId;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          activityBookingsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Activity Bookings
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover and book activities for {booking.tripName || 'your trip'}
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

        {/* Activity Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Search Activities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={booking.searchCriteria.destination}
                onChange={(e) => updateBooking('searchCriteria.destination', e.target.value)}
                placeholder="City or location"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Activity Date
              </label>
              <input
                type="date"
                value={booking.searchCriteria.activityDate.toISOString().split('T')[0]}
                onChange={(e) => updateBooking('searchCriteria.activityDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Participants
              </label>
              <div className="flex gap-1">
                <select
                  value={booking.searchCriteria.participants.adults}
                  onChange={(e) => updateBooking('searchCriteria.participants.adults', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <select
                  value={booking.searchCriteria.participants.children}
                  onChange={(e) => updateBooking('searchCriteria.participants.children', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  {[0, 1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Child{num !== 1 ? 'ren' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <select
                value={booking.searchCriteria.categories[0] || ''}
                onChange={(e) => updateBooking('searchCriteria.categories', e.target.value ? [e.target.value] : [])}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={booking.searchCriteria.priceRange.min}
                  onChange={(e) => updateBooking('searchCriteria.priceRange.min', parseInt(e.target.value))}
                  placeholder="Min"
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <input
                  type="number"
                  value={booking.searchCriteria.priceRange.max}
                  onChange={(e) => updateBooking('searchCriteria.priceRange.max', parseInt(e.target.value))}
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
                  value={booking.searchCriteria.duration.min}
                  onChange={(e) => updateBooking('searchCriteria.duration.min', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value={1}>1+ hours</option>
                  <option value={2}>2+ hours</option>
                  <option value={4}>4+ hours</option>
                  <option value={8}>8+ hours</option>
                </select>
                <select
                  value={booking.searchCriteria.duration.max}
                  onChange={(e) => updateBooking('searchCriteria.duration.max', parseInt(e.target.value))}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value={2}>Up to 2h</option>
                  <option value={4}>Up to 4h</option>
                  <option value={8}>Up to 8h</option>
                  <option value={24}>All day</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </label>
              <select
                value={booking.searchCriteria.difficulty}
                onChange={(e) => updateBooking('searchCriteria.difficulty', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="any">Any Level</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty.id} value={difficulty.id}>
                    {difficulty.icon} {difficulty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={booking.searchCriteria.instantBooking}
                onChange={(e) => updateBooking('searchCriteria.instantBooking', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Instant booking</span>
            </label>
          </div>
          
          <button
            onClick={searchActivities}
            disabled={isSearching}
            className={cn(
              'w-full px-4 py-2 rounded-md transition-colors duration-200',
              isSearching
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {isSearching ? '🔍 Searching...' : '🔍 Search Activities'}
          </button>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {booking.searchResults.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Results</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {booking.selectedActivities.length}
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
              {booking.favorites.length}
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
                  Activity Results
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.searchResults.length} activities found
                </div>
              </div>
              
              <div className={cn(
                'gap-4',
                viewMode === 'list' && 'space-y-3',
                viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                viewMode === 'map' && 'grid grid-cols-1 lg:grid-cols-2'
              )}>
                {booking.searchResults.map((activity) => (
                  <div key={activity.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    {viewMode === 'grid' && (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">{getCategoryIcon(activity.category)}</span>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(activity.category)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {activity.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.provider.name} • {getCategoryName(activity.category)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDuration(activity.details.duration)} • {getDifficultyIcon(activity.details.difficulty)} {getDifficultyName(activity.details.difficulty)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {formatCurrency(activity.pricing.adultPrice, activity.pricing.currency)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            per person
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {activity.description}
                      </p>
                      
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex justify-between">
                          <span>Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {activity.rating.overall}/5 ({activity.rating.reviewCount} reviews)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Group Size:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {activity.details.groupSize.min}-{activity.details.groupSize.max} people
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {activity.availability.availableSlots.length} time slots
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {activity.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                            Details
                          </button>
                          <button
                            onClick={() => selectActivity(activity.id)}
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
              
              {booking.bookings.length > 0 ? (
                <div className="space-y-3">
                  {booking.bookings.map((bookingItem) => (
                    <div key={bookingItem.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getCategoryIcon(bookingItem.selectedActivity.activity.category)}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                              {bookingItem.selectedActivity.activity.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Booking: {bookingItem.bookingNumber}
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
                            <span>Activity Date:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(bookingItem.activityDate)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {bookingItem.selectedActivity.selectedSlot.startTime} - {bookingItem.selectedActivity.selectedSlot.endTime}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between">
                            <span>Participants:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {bookingItem.selectedActivity.participants.length}
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
                  <p>Search and book activities to see them here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Favorite Activities
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No favorite activities yet
                </h3>
                <p>Save activities you like to your favorites</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ActivityBookings.displayName = 'ActivityBookings';

// Activity Bookings Demo Component
interface ActivityBookingsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ActivityBookingsDemo = React.forwardRef<HTMLDivElement, ActivityBookingsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [booking, setBooking] = useState<Partial<ActivityBookingData>>({});

    const handleBookingUpdate = (updatedBooking: ActivityBookingData) => {
      setBooking(updatedBooking);
      console.log('Activity booking updated:', updatedBooking);
    };

    const mockBooking: Partial<ActivityBookingData> = {
      id: 'activity-booking-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      searchCriteria: {
        destination: 'Paris',
        activityDate: new Date('2024-06-15'),
        participants: { adults: 2, children: 0, seniors: 0 },
        categories: [],
        priceRange: { min: 0, max: 200, currency: 'USD' },
        duration: { min: 1, max: 8 },
        difficulty: 'any',
        language: ['en'],
        features: [],
        instantBooking: false
      },
      searchResults: [],
      selectedActivities: [],
      bookings: [],
      favorites: [],
      settings: {
        preferredCategories: [],
        preferredProviders: [],
        priceRange: { min: 0, max: 200, currency: 'USD' },
        difficultyPreference: 'any',
        languagePreference: ['en'],
        features: [],
        instantBooking: false,
        notifications: {
          priceDrops: true,
          availabilityChanges: true,
          weatherAlerts: true,
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
          Activity Bookings Demo
        </h3>
        
        <ActivityBookings
          onBookingUpdate={handleBookingUpdate}
          initialBooking={mockBooking}
          showFilters={true}
          showReviews={true}
          showAvailability={true}
          showRecommendations={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive activity search and booking with filters, reviews, availability checking, and recommendations.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ActivityBookingsDemo.displayName = 'ActivityBookingsDemo';

// Export all components
export {
  activityBookingsVariants,
  type ActivityBookingsProps,
  type ActivityBookingData,
  type ActivitySearchCriteria,
  type ActivityResult,
  type ActivityProvider,
  type ActivityLocation,
  type ActivityPricing,
  type GroupDiscount,
  type ActivityAvailability,
  type TimeSlot,
  type SeasonalAvailability,
  type ActivityDetails,
  type ActivityItinerary,
  type ActivityRequirement,
  type ActivityReview,
  type ActivityImage,
  type ActivityVideo,
  type SelectedActivity,
  type ParticipantInfo,
  type SelectedExtra,
  type ActivityBooking,
  type ContactInfo,
  type PaymentInfo,
  type BookingDocument,
  type BookingNotification,
  type ActivityBookingSettings,
  type ActivityBookingsDemoProps
};
