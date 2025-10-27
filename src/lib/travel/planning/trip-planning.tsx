/**
 * Trip Planning Component
 * 
 * Provides comprehensive trip planning tools for Atlas travel agent.
 * Implements itinerary creation, route planning, and travel organization.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Trip Planning Variants
const tripPlanningVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'trip-planning-mode-standard',
        'enhanced': 'trip-planning-mode-enhanced',
        'advanced': 'trip-planning-mode-advanced',
        'custom': 'trip-planning-mode-custom'
      },
      type: {
        'solo': 'trip-type-solo',
        'couple': 'trip-type-couple',
        'family': 'trip-type-family',
        'group': 'trip-type-group',
        'mixed': 'trip-type-mixed'
      },
      style: {
        'minimal': 'trip-style-minimal',
        'moderate': 'trip-style-moderate',
        'detailed': 'trip-style-detailed',
        'custom': 'trip-style-custom'
      },
      format: {
        'text': 'trip-format-text',
        'visual': 'trip-format-visual',
        'interactive': 'trip-format-interactive',
        'mixed': 'trip-format-mixed'
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

// Trip Planning Props
interface TripPlanningProps extends VariantProps<typeof tripPlanningVariants> {
  className?: string;
  onTripUpdate?: (trip: TripData) => void;
  initialTrip?: Partial<TripData>;
  showTimeline?: boolean;
  showBudget?: boolean;
  showCollaboration?: boolean;
  showOptimization?: boolean;
}

// Trip Data Interface
interface TripData {
  id: string;
  title: string;
  description: string;
  type: 'solo' | 'couple' | 'family' | 'group' | 'business';
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  travelers: Traveler[];
  itinerary: ItineraryDay[];
  budget: TripBudget;
  accommodations: Accommodation[];
  transportation: Transportation[];
  activities: Activity[];
  restaurants: Restaurant[];
  documents: Document[];
  notes: Note[];
  collaborators: Collaborator[];
  status: 'planning' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  visibility: 'private' | 'shared' | 'public';
  createdAt: Date;
  updatedAt: Date;
}

// Traveler Interface
interface Traveler {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'traveler' | 'viewer';
  preferences: TravelerPreferences;
  emergencyContact: EmergencyContact;
  documents: TravelerDocument[];
}

// Traveler Preferences Interface
interface TravelerPreferences {
  interests: string[];
  dietary: string[];
  accessibility: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  accommodation: string[];
  transportation: string[];
}

// Emergency Contact Interface
interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Traveler Document Interface
interface TravelerDocument {
  id: string;
  type: 'passport' | 'visa' | 'id' | 'insurance' | 'vaccination';
  number: string;
  expiryDate: Date;
  issuingCountry: string;
  fileUrl?: string;
}

// Itinerary Day Interface
interface ItineraryDay {
  id: string;
  date: Date;
  dayNumber: number;
  location: string;
  activities: DayActivity[];
  meals: Meal[];
  transportation: DayTransportation[];
  notes: string;
  budget: {
    planned: number;
    actual: number;
    currency: string;
  };
}

// Day Activity Interface
interface DayActivity {
  id: string;
  name: string;
  type: 'attraction' | 'experience' | 'leisure' | 'shopping' | 'cultural';
  startTime: string;
  endTime: string;
  duration: number; // in hours
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  cost: number;
  currency: string;
  bookingRequired: boolean;
  bookingInfo?: BookingInfo;
  notes: string;
}

// Meal Interface
interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  restaurant: string;
  location: string;
  cost: number;
  currency: string;
  notes: string;
}

// Day Transportation Interface
interface DayTransportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'metro' | 'walking';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  cost: number;
  currency: string;
  bookingInfo?: BookingInfo;
}

// Booking Info Interface
interface BookingInfo {
  confirmationNumber: string;
  provider: string;
  url?: string;
  phone?: string;
  cancellationPolicy: string;
}

// Trip Budget Interface
interface TripBudget {
  total: number;
  currency: string;
  categories: {
    accommodation: number;
    transportation: number;
    activities: number;
    meals: number;
    shopping: number;
    miscellaneous: number;
  };
  actual: {
    total: number;
    categories: {
      accommodation: number;
      transportation: number;
      activities: number;
      meals: number;
      shopping: number;
      miscellaneous: number;
    };
  };
  alerts: BudgetAlert[];
}

// Budget Alert Interface
interface BudgetAlert {
  id: string;
  type: 'over-budget' | 'approaching-limit' | 'savings-opportunity';
  category: string;
  message: string;
  amount: number;
  currency: string;
}

// Accommodation Interface
interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'apartment';
  location: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  cost: number;
  currency: string;
  bookingInfo?: BookingInfo;
  amenities: string[];
  notes: string;
}

// Transportation Interface
interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car-rental' | 'ferry';
  from: string;
  to: string;
  departureDate: Date;
  arrivalDate: Date;
  cost: number;
  currency: string;
  bookingInfo?: BookingInfo;
  notes: string;
}

// Activity Interface
interface Activity {
  id: string;
  name: string;
  type: string;
  location: string;
  date: Date;
  time: string;
  duration: number;
  cost: number;
  currency: string;
  bookingInfo?: BookingInfo;
  notes: string;
}

// Restaurant Interface
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  date: Date;
  time: string;
  cost: number;
  currency: string;
  reservationInfo?: BookingInfo;
  notes: string;
}

// Document Interface
interface Document {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'insurance' | 'itinerary' | 'booking' | 'other';
  fileUrl: string;
  uploadDate: Date;
  expiryDate?: Date;
  notes: string;
}

// Note Interface
interface Note {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'important' | 'reminder' | 'tip';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
}

// Collaborator Interface
interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'organizer' | 'editor' | 'viewer';
  permissions: string[];
  joinedAt: Date;
}

// Trip Planning Component
export const TripPlanning = React.forwardRef<HTMLDivElement, TripPlanningProps>(
  ({ 
    className, 
    onTripUpdate,
    initialTrip,
    showTimeline = true,
    showBudget = true,
    showCollaboration = true,
    showOptimization = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [trip, setTrip] = useState<TripData>(
      initialTrip || {
        id: '',
        title: '',
        description: '',
        type: 'solo',
        destination: '',
        startDate: new Date(),
        endDate: new Date(),
        duration: 0,
        travelers: [],
        itinerary: [],
        budget: {
          total: 0,
          currency: 'USD',
          categories: {
            accommodation: 0,
            transportation: 0,
            activities: 0,
            meals: 0,
            shopping: 0,
            miscellaneous: 0
          },
          actual: {
            total: 0,
            categories: {
              accommodation: 0,
              transportation: 0,
              activities: 0,
              meals: 0,
              shopping: 0,
              miscellaneous: 0
            }
          },
          alerts: []
        },
        accommodations: [],
        transportation: [],
        activities: [],
        restaurants: [],
        documents: [],
        notes: [],
        collaborators: [],
        status: 'planning',
        visibility: 'private',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number>(0);

    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📋' },
      { id: 'itinerary', name: 'Itinerary', icon: '🗓️' },
      { id: 'budget', name: 'Budget', icon: '💰' },
      { id: 'travelers', name: 'Travelers', icon: '👥' },
      { id: 'documents', name: 'Documents', icon: '📄' }
    ];

    const tripTypes = [
      { id: 'solo', name: 'Solo Travel', icon: '🧳', color: 'blue' },
      { id: 'couple', name: 'Couple', icon: '💑', color: 'pink' },
      { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'green' },
      { id: 'group', name: 'Group', icon: '👥', color: 'purple' },
      { id: 'business', name: 'Business', icon: '💼', color: 'gray' }
    ];

    const statusColors = {
      'planning': 'text-yellow-600 dark:text-yellow-400',
      'confirmed': 'text-green-600 dark:text-green-400',
      'in-progress': 'text-blue-600 dark:text-blue-400',
      'completed': 'text-gray-600 dark:text-gray-400',
      'cancelled': 'text-red-600 dark:text-red-400'
    };

    const updateTrip = useCallback((path: string, value: any) => {
      setTrip(prev => {
        const newTrip = { ...prev };
        const keys = path.split('.');
        let current: any = newTrip;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newTrip.updatedAt = new Date();
        onTripUpdate?.(newTrip);
        return newTrip;
      });
    }, [onTripUpdate]);

    const addTraveler = useCallback(() => {
      const newTraveler: Traveler = {
        id: `traveler-${Date.now()}`,
        name: '',
        email: '',
        role: 'traveler',
        preferences: {
          interests: [],
          dietary: [],
          accessibility: [],
          budget: { min: 0, max: 1000, currency: 'USD' },
          accommodation: [],
          transportation: []
        },
        emergencyContact: {
          name: '',
          relationship: '',
          phone: ''
        },
        documents: []
      };
      updateTrip('travelers', [...trip.travelers, newTraveler]);
    }, [trip.travelers, updateTrip]);

    const addItineraryDay = useCallback(() => {
      const newDay: ItineraryDay = {
        id: `day-${Date.now()}`,
        date: new Date(trip.startDate.getTime() + trip.itinerary.length * 24 * 60 * 60 * 1000),
        dayNumber: trip.itinerary.length + 1,
        location: trip.destination,
        activities: [],
        meals: [],
        transportation: [],
        notes: '',
        budget: {
          planned: 0,
          actual: 0,
          currency: trip.budget.currency
        }
      };
      updateTrip('itinerary', [...trip.itinerary, newDay]);
    }, [trip.itinerary, trip.startDate, trip.destination, trip.budget.currency, updateTrip]);

    const addActivity = useCallback((dayId: string) => {
      const newActivity: DayActivity = {
        id: `activity-${Date.now()}`,
        name: '',
        type: 'attraction',
        startTime: '09:00',
        endTime: '10:00',
        duration: 1,
        location: {
          name: '',
          address: '',
          coordinates: { lat: 0, lng: 0 }
        },
        cost: 0,
        currency: trip.budget.currency,
        bookingRequired: false,
        notes: ''
      };
      
      const updatedItinerary = trip.itinerary.map(day => 
        day.id === dayId 
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      );
      updateTrip('itinerary', updatedItinerary);
    }, [trip.itinerary, trip.budget.currency, updateTrip]);

    const calculateDuration = useCallback((startDate: Date, endDate: Date) => {
      const diffTime = endDate.getTime() - startDate.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }, []);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatCurrency = (amount: number, currency: string) => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const getTripTypeIcon = (type: TripData['type']) => {
      const tripType = tripTypes.find(t => t.id === type);
      return tripType?.icon || '🧳';
    };

    const getTripTypeName = (type: TripData['type']) => {
      const tripType = tripTypes.find(t => t.id === type);
      return tripType?.name || type;
    };

    useEffect(() => {
      if (trip.startDate && trip.endDate) {
        const duration = calculateDuration(trip.startDate, trip.endDate);
        updateTrip('duration', duration);
      }
    }, [trip.startDate, trip.endDate, calculateDuration, updateTrip]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          tripPlanningVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Trip Planning
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Plan your perfect {trip.destination || 'destination'} trip
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              💾 Save
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
              📤 Share
            </button>
          </div>
        </div>

        {/* Trip Overview */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Title
              </label>
              <input
                type="text"
                value={trip.title}
                onChange={(e) => updateTrip('title', e.target.value)}
                placeholder="Enter trip title"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={trip.destination}
                onChange={(e) => updateTrip('destination', e.target.value)}
                placeholder="Enter destination"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trip Type
              </label>
              <select
                value={trip.type}
                onChange={(e) => updateTrip('type', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                {tripTypes.map((tripType) => (
                  <option key={tripType.id} value={tripType.id}>
                    {tripType.icon} {tripType.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={trip.status}
                onChange={(e) => updateTrip('status', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="planning">Planning</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={trip.startDate.toISOString().split('T')[0]}
                onChange={(e) => updateTrip('startDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={trip.endDate.toISOString().split('T')[0]}
                onChange={(e) => updateTrip('endDate', new Date(e.target.value))}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={trip.description}
              onChange={(e) => updateTrip('description', e.target.value)}
              placeholder="Describe your trip..."
              rows={3}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* Trip Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {trip.duration}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Days</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {trip.travelers.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Travelers</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {trip.itinerary.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Days Planned</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatCurrency(trip.budget.total, trip.budget.currency)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Budget</div>
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Trip Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Basic Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getTripTypeIcon(trip.type)} {getTripTypeName(trip.type)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {trip.duration} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Dates:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={cn('font-medium', statusColors[trip.status])}>
                          {trip.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Budget Overview
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total Budget:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(trip.budget.total, trip.budget.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Accommodation:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(trip.budget.categories.accommodation, trip.budget.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transportation:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(trip.budget.categories.transportation, trip.budget.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Activities:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(trip.budget.categories.activities, trip.budget.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Itinerary
                </h3>
                <button
                  onClick={addItineraryDay}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Day
                </button>
              </div>
              
              {trip.itinerary.length > 0 ? (
                <div className="space-y-4">
                  {trip.itinerary.map((day, index) => (
                    <div key={day.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          Day {day.dayNumber}: {formatDate(day.date)}
                        </h4>
                        <button
                          onClick={() => addActivity(day.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                        >
                          ➕ Activity
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {day.activities.map((activity) => (
                          <div key={activity.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900 dark:text-gray-100">
                                  {activity.name || 'New Activity'}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {activity.startTime} - {activity.endTime} • {activity.location.name}
                                </p>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatCurrency(activity.cost, activity.currency)}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {day.activities.length === 0 && (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            No activities planned for this day
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🗓️</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No itinerary planned yet
                  </h3>
                  <p>Start by adding days to your trip</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'travelers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Travelers
                </h3>
                <button
                  onClick={addTraveler}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Traveler
                </button>
              </div>
              
              {trip.travelers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trip.travelers.map((traveler) => (
                    <div key={traveler.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          👤
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {traveler.name || 'New Traveler'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {traveler.role}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Email:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {traveler.email || 'Not set'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatCurrency(traveler.preferences.budget.min, traveler.preferences.budget.currency)} - {formatCurrency(traveler.preferences.budget.max, traveler.preferences.budget.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No travelers added yet
                  </h3>
                  <p>Add travelers to your trip</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'budget' && showBudget && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Budget Planning
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Budget Categories
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(trip.budget.categories).map(([category, amount]) => (
                        <div key={category} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">
                            {category}:
                          </span>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => updateTrip(`budget.categories.${category}`, parseFloat(e.target.value))}
                            className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded text-right dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Total Budget
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(trip.budget.total, trip.budget.currency)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Total planned budget
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Travel Documents
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Document management coming soon
                </h3>
                <p>Upload and organize your travel documents</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TripPlanning.displayName = 'TripPlanning';

// Trip Planning Demo Component
interface TripPlanningDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TripPlanningDemo = React.forwardRef<HTMLDivElement, TripPlanningDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [trip, setTrip] = useState<Partial<TripData>>({});

    const handleTripUpdate = (updatedTrip: TripData) => {
      setTrip(updatedTrip);
      console.log('Trip updated:', updatedTrip);
    };

    const mockTrip: Partial<TripData> = {
      id: 'trip-1',
      title: 'Paris Adventure',
      description: 'A wonderful trip to the City of Light',
      type: 'couple',
      destination: 'Paris, France',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-22'),
      duration: 7,
      travelers: [],
      itinerary: [],
      budget: {
        total: 3000,
        currency: 'USD',
        categories: {
          accommodation: 1200,
          transportation: 800,
          activities: 600,
          meals: 300,
          shopping: 100,
          miscellaneous: 0
        },
        actual: {
          total: 0,
          categories: {
            accommodation: 0,
            transportation: 0,
            activities: 0,
            meals: 0,
            shopping: 0,
            miscellaneous: 0
          }
        },
        alerts: []
      },
      accommodations: [],
      transportation: [],
      activities: [],
      restaurants: [],
      documents: [],
      notes: [],
      collaborators: [],
      status: 'planning',
      visibility: 'private',
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
          Trip Planning Demo
        </h3>
        
        <TripPlanning
          onTripUpdate={handleTripUpdate}
          initialTrip={mockTrip}
          showTimeline={true}
          showBudget={true}
          showCollaboration={true}
          showOptimization={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive trip planning with itinerary creation, budget management, traveler coordination, and document organization.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TripPlanningDemo.displayName = 'TripPlanningDemo';

// Export all components
export {
  tripPlanningVariants,
  type TripPlanningProps,
  type TripData,
  type Traveler,
  type TravelerPreferences,
  type EmergencyContact,
  type TravelerDocument,
  type ItineraryDay,
  type DayActivity,
  type Meal,
  type DayTransportation,
  type BookingInfo,
  type TripBudget,
  type BudgetAlert,
  type Accommodation,
  type Transportation,
  type Activity,
  type Restaurant,
  type Document,
  type Note,
  type Collaborator,
  type TripPlanningDemoProps
};
