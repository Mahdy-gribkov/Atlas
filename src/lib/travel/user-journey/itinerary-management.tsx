/**
 * Itinerary Management Component
 * 
 * Provides comprehensive itinerary management for Atlas travel agent.
 * Implements trip planning, schedule management, and itinerary optimization features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Itinerary Management Variants
const itineraryManagementVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'itinerary-management-mode-standard',
        'enhanced': 'itinerary-management-mode-enhanced',
        'advanced': 'itinerary-management-mode-advanced',
        'custom': 'itinerary-management-mode-custom'
      },
      type: {
        'planning': 'itinerary-type-planning',
        'schedule': 'itinerary-type-schedule',
        'optimization': 'itinerary-type-optimization',
        'sharing': 'itinerary-type-sharing',
        'mixed': 'itinerary-type-mixed'
      },
      style: {
        'minimal': 'itinerary-style-minimal',
        'moderate': 'itinerary-style-moderate',
        'detailed': 'itinerary-style-detailed',
        'custom': 'itinerary-style-custom'
      },
      format: {
        'text': 'itinerary-format-text',
        'visual': 'itinerary-format-visual',
        'interactive': 'itinerary-format-interactive',
        'mixed': 'itinerary-format-mixed'
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

// Itinerary Management Props
interface ItineraryManagementProps extends VariantProps<typeof itineraryManagementVariants> {
  className?: string;
  onItineraryUpdate?: (itinerary: ItineraryData) => void;
  initialItinerary?: Partial<ItineraryData>;
  showTimeline?: boolean;
  showMap?: boolean;
  showSharing?: boolean;
  showOptimization?: boolean;
}

// Itinerary Data Interface
interface ItineraryData {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  duration: number; // in days
  travelers: number;
  budget: {
    total: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  days: ItineraryDay[];
  status: 'draft' | 'planned' | 'confirmed' | 'active' | 'completed';
  visibility: 'private' | 'shared' | 'public';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Itinerary Day Interface
interface ItineraryDay {
  id: string;
  date: Date;
  dayNumber: number;
  title: string;
  activities: ItineraryActivity[];
  accommodation?: {
    id: string;
    name: string;
    address: string;
    checkIn?: Date;
    checkOut?: Date;
  };
  transportation: ItineraryTransportation[];
  notes: string;
  weather?: {
    temperature: number;
    condition: string;
    icon: string;
  };
}

// Itinerary Activity Interface
interface ItineraryActivity {
  id: string;
  title: string;
  description: string;
  type: 'attraction' | 'restaurant' | 'activity' | 'shopping' | 'transport' | 'free-time';
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  cost: number;
  currency: string;
  bookingStatus: 'not-booked' | 'booked' | 'confirmed' | 'cancelled';
  bookingReference?: string;
  notes: string;
  images: string[];
  rating?: number;
  category: string[];
}

// Itinerary Transportation Interface
interface ItineraryTransportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'walking' | 'metro';
  from: string;
  to: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  cost: number;
  currency: string;
  bookingStatus: 'not-booked' | 'booked' | 'confirmed' | 'cancelled';
  bookingReference?: string;
  notes: string;
}

// Itinerary Management Component
export const ItineraryManagement = React.forwardRef<HTMLDivElement, ItineraryManagementProps>(
  ({ 
    className, 
    onItineraryUpdate,
    initialItinerary,
    showTimeline = true,
    showMap = true,
    showSharing = true,
    showOptimization = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [itinerary, setItinerary] = useState<ItineraryData>(
      initialItinerary || {
        id: '',
        title: '',
        description: '',
        destination: '',
        startDate: new Date(),
        endDate: new Date(),
        duration: 0,
        travelers: 1,
        budget: {
          total: 0,
          spent: 0,
          remaining: 0,
          currency: 'USD'
        },
        days: [],
        status: 'draft',
        visibility: 'private',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeDay, setActiveDay] = useState<number>(0);
    const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'list'>('timeline');
    const [isEditing, setIsEditing] = useState(false);

    const updateItinerary = useCallback((path: string, value: any) => {
      setItinerary(prev => {
        const newItinerary = { ...prev };
        const keys = path.split('.');
        let current: any = newItinerary;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newItinerary.updatedAt = new Date();
        onItineraryUpdate?.(newItinerary);
        return newItinerary;
      });
    }, [onItineraryUpdate]);

    const addDay = useCallback(() => {
      const newDay: ItineraryDay = {
        id: `day-${Date.now()}`,
        date: new Date(itinerary.startDate.getTime() + itinerary.days.length * 24 * 60 * 60 * 1000),
        dayNumber: itinerary.days.length + 1,
        title: `Day ${itinerary.days.length + 1}`,
        activities: [],
        transportation: [],
        notes: ''
      };
      updateItinerary('days', [...itinerary.days, newDay]);
    }, [itinerary.days, itinerary.startDate, updateItinerary]);

    const removeDay = useCallback((dayId: string) => {
      const newDays = itinerary.days.filter(day => day.id !== dayId);
      updateItinerary('days', newDays);
    }, [itinerary.days, updateItinerary]);

    const addActivity = useCallback((dayId: string) => {
      const newActivity: ItineraryActivity = {
        id: `activity-${Date.now()}`,
        title: '',
        description: '',
        type: 'attraction',
        startTime: new Date(),
        endTime: new Date(),
        duration: 60,
        location: {
          name: '',
          address: ''
        },
        cost: 0,
        currency: 'USD',
        bookingStatus: 'not-booked',
        notes: '',
        images: [],
        category: []
      };

      const updatedDays = itinerary.days.map(day => 
        day.id === dayId 
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      );
      updateItinerary('days', updatedDays);
    }, [itinerary.days, updateItinerary]);

    const updateActivity = useCallback((dayId: string, activityId: string, updates: Partial<ItineraryActivity>) => {
      const updatedDays = itinerary.days.map(day => 
        day.id === dayId 
          ? {
              ...day,
              activities: day.activities.map(activity =>
                activity.id === activityId ? { ...activity, ...updates } : activity
              )
            }
          : day
      );
      updateItinerary('days', updatedDays);
    }, [itinerary.days, updateItinerary]);

    const removeActivity = useCallback((dayId: string, activityId: string) => {
      const updatedDays = itinerary.days.map(day => 
        day.id === dayId 
          ? { ...day, activities: day.activities.filter(activity => activity.id !== activityId) }
          : day
      );
      updateItinerary('days', updatedDays);
    }, [itinerary.days, updateItinerary]);

    const calculateBudget = useCallback(() => {
      let totalSpent = 0;
      itinerary.days.forEach(day => {
        day.activities.forEach(activity => {
          totalSpent += activity.cost;
        });
        day.transportation.forEach(transport => {
          totalSpent += transport.cost;
        });
      });
      
      updateItinerary('budget.spent', totalSpent);
      updateItinerary('budget.remaining', itinerary.budget.total - totalSpent);
    }, [itinerary.days, itinerary.budget.total, updateItinerary]);

    useEffect(() => {
      calculateBudget();
    }, [calculateBudget]);

    const activityTypes = [
      { id: 'attraction', name: 'Attraction', icon: '🏛️' },
      { id: 'restaurant', name: 'Restaurant', icon: '🍽️' },
      { id: 'activity', name: 'Activity', icon: '🎯' },
      { id: 'shopping', name: 'Shopping', icon: '🛍️' },
      { id: 'transport', name: 'Transport', icon: '🚗' },
      { id: 'free-time', name: 'Free Time', icon: '🆓' }
    ];

    const transportationTypes = [
      { id: 'flight', name: 'Flight', icon: '✈️' },
      { id: 'train', name: 'Train', icon: '🚆' },
      { id: 'bus', name: 'Bus', icon: '🚌' },
      { id: 'car', name: 'Car', icon: '🚗' },
      { id: 'taxi', name: 'Taxi', icon: '🚕' },
      { id: 'walking', name: 'Walking', icon: '🚶' },
      { id: 'metro', name: 'Metro', icon: '🚇' }
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          itineraryManagementVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Itinerary Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {itinerary.title || 'Untitled Itinerary'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
            {showSharing && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
                Share
              </button>
            )}
            {showOptimization && (
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200">
                Optimize
              </button>
            )}
          </div>
        </div>

        {/* Itinerary Info */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Title
              </label>
              <input
                type="text"
                value={itinerary.title}
                onChange={(e) => updateItinerary('title', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                placeholder="Enter itinerary title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={itinerary.destination}
                onChange={(e) => updateItinerary('destination', e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                placeholder="Enter destination"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={itinerary.startDate.toISOString().split('T')[0]}
                onChange={(e) => updateItinerary('startDate', new Date(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                value={itinerary.duration}
                onChange={(e) => updateItinerary('duration', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Description
            </label>
            <textarea
              value={itinerary.description}
              onChange={(e) => updateItinerary('description', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
              placeholder="Enter itinerary description"
            />
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Budget Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${itinerary.budget.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Budget</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${itinerary.budget.spent}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${itinerary.budget.remaining}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {['timeline', 'calendar', 'list'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={cn(
                  'px-4 py-2 text-sm rounded-md transition-colors duration-200',
                  viewMode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={addDay}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            + Add Day
          </button>
        </div>

        {/* Days */}
        <div className="space-y-4">
          {itinerary.days.map((day, dayIndex) => (
            <div key={day.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {day.dayNumber}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {day.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {day.date.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => addActivity(day.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    + Activity
                  </button>
                  <button
                    onClick={() => removeDay(day.id)}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Activities */}
              <div className="space-y-3">
                {day.activities.map((activity, activityIndex) => (
                  <div key={activity.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {activityTypes.find(t => t.id === activity.type)?.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {activity.title || 'Untitled Activity'}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {activity.startTime.toLocaleTimeString()} - {activity.endTime.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md">
                          ${activity.cost}
                        </span>
                        <button
                          onClick={() => removeActivity(day.id, activity.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={activity.title}
                            onChange={(e) => updateActivity(day.id, activity.id, { title: e.target.value })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Type
                          </label>
                          <select
                            value={activity.type}
                            onChange={(e) => updateActivity(day.id, activity.id, { type: e.target.value as any })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          >
                            {activityTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.icon} {type.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            value={activity.location.name}
                            onChange={(e) => updateActivity(day.id, activity.id, { 
                              location: { ...activity.location, name: e.target.value }
                            })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Cost
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={activity.cost}
                            onChange={(e) => updateActivity(day.id, activity.id, { cost: parseFloat(e.target.value) })}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                          />
                        </div>
                      </div>
                    )}
                    
                    {activity.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                ))}
                
                {day.activities.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📅</div>
                    <p>No activities planned for this day</p>
                    <button
                      onClick={() => addActivity(day.id)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Add First Activity
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {itinerary.days.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No days planned yet
              </h3>
              <p>Start building your itinerary by adding days</p>
              <button
                onClick={addDay}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Add First Day
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ItineraryManagement.displayName = 'ItineraryManagement';

// Itinerary Management Demo Component
interface ItineraryManagementDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ItineraryManagementDemo = React.forwardRef<HTMLDivElement, ItineraryManagementDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [itinerary, setItinerary] = useState<Partial<ItineraryData>>({});

    const handleItineraryUpdate = (updatedItinerary: ItineraryData) => {
      setItinerary(updatedItinerary);
      console.log('Itinerary updated:', updatedItinerary);
    };

    const mockItinerary: Partial<ItineraryData> = {
      id: 'itinerary-1',
      title: 'Paris Adventure',
      description: 'A wonderful 5-day trip to the City of Light',
      destination: 'Paris, France',
      startDate: new Date('2024-06-15'),
      endDate: new Date('2024-06-19'),
      duration: 5,
      travelers: 2,
      budget: {
        total: 2000,
        spent: 0,
        remaining: 2000,
        currency: 'USD'
      },
      days: [
        {
          id: 'day-1',
          date: new Date('2024-06-15'),
          dayNumber: 1,
          title: 'Arrival & City Tour',
          activities: [
            {
              id: 'activity-1',
              title: 'Eiffel Tower Visit',
              description: 'Visit the iconic Eiffel Tower',
              type: 'attraction',
              startTime: new Date('2024-06-15T10:00:00'),
              endTime: new Date('2024-06-15T12:00:00'),
              duration: 120,
              location: {
                name: 'Eiffel Tower',
                address: 'Champ de Mars, 7th arrondissement, Paris'
              },
              cost: 25,
              currency: 'USD',
              bookingStatus: 'not-booked',
              notes: '',
              images: [],
              category: ['landmark', 'architecture']
            }
          ],
          transportation: [],
          notes: 'First day in Paris'
        }
      ],
      status: 'draft',
      visibility: 'private',
      tags: ['paris', 'culture', 'romantic'],
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
          Itinerary Management Demo
        </h3>
        
        <ItineraryManagement
          onItineraryUpdate={handleItineraryUpdate}
          initialItinerary={mockItinerary}
          showTimeline={true}
          showMap={true}
          showSharing={true}
          showOptimization={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive itinerary management with day planning, activity scheduling, budget tracking, and optimization features.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ItineraryManagementDemo.displayName = 'ItineraryManagementDemo';

// Export all components
export {
  itineraryManagementVariants,
  type ItineraryManagementProps,
  type ItineraryData,
  type ItineraryDay,
  type ItineraryActivity,
  type ItineraryTransportation,
  type ItineraryManagementDemoProps
};
