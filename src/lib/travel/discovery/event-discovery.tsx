/**
 * Event Discovery Component
 * 
 * Provides comprehensive event discovery for Atlas travel agent.
 * Implements local events, festivals, activities, and cultural experiences.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Event Discovery Variants
const eventDiscoveryVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'event-discovery-mode-standard',
        'enhanced': 'event-discovery-mode-enhanced',
        'advanced': 'event-discovery-mode-advanced',
        'custom': 'event-discovery-mode-custom'
      },
      type: {
        'festival': 'event-type-festival',
        'cultural': 'event-type-cultural',
        'music': 'event-type-music',
        'sports': 'event-type-sports',
        'mixed': 'event-type-mixed'
      },
      style: {
        'minimal': 'event-style-minimal',
        'moderate': 'event-style-moderate',
        'detailed': 'event-style-detailed',
        'custom': 'event-style-custom'
      },
      format: {
        'text': 'event-format-text',
        'visual': 'event-format-visual',
        'interactive': 'event-format-interactive',
        'mixed': 'event-format-mixed'
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

// Event Discovery Props
interface EventDiscoveryProps extends VariantProps<typeof eventDiscoveryVariants> {
  className?: string;
  onEventSelect?: (event: EventData) => void;
  initialEvents?: Partial<EventDiscoveryData>;
  showFilters?: boolean;
  showCalendar?: boolean;
  showTickets?: boolean;
  showNearby?: boolean;
}

// Event Discovery Data Interface
interface EventDiscoveryData {
  id: string;
  destination: string;
  events: EventData[];
  festivals: EventData[];
  cultural: EventData[];
  music: EventData[];
  sports: EventData[];
  categories: EventCategory[];
  filters: EventFilters;
  calendar: CalendarView;
  createdAt: Date;
  updatedAt: Date;
}

// Event Data Interface
interface EventData {
  id: string;
  title: string;
  description: string;
  type: 'festival' | 'cultural' | 'music' | 'sports' | 'exhibition' | 'conference' | 'workshop' | 'tour';
  category: string;
  venue: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    capacity: number;
    accessibility: string[];
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    duration: number; // in hours
    recurring: {
      isRecurring: boolean;
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      endDate?: Date;
    };
  };
  pricing: {
    type: 'free' | 'paid' | 'donation' | 'membership';
    price?: number;
    currency?: string;
    discounts: Discount[];
    groupRates: GroupRate[];
  };
  organizer: {
    name: string;
    contact: {
      phone?: string;
      email?: string;
      website?: string;
    };
    rating: number;
    verified: boolean;
  };
  images: EventImage[];
  tags: string[];
  ageRestrictions: {
    minAge?: number;
    maxAge?: number;
    allAges: boolean;
  };
  requirements: {
    booking: boolean;
    dressCode?: string;
    equipment?: string[];
    skills?: string[];
  };
  tickets: {
    available: boolean;
    url?: string;
    phone?: string;
    boxOffice: boolean;
    onlineOnly: boolean;
    lastMinute: boolean;
  };
  capacity: {
    total: number;
    available: number;
    soldOut: boolean;
  };
  rating: number;
  reviewCount: number;
  reviews: EventReview[];
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    hashtags: string[];
  };
  distance: {
    fromUser: number;
    fromAttractions: number[];
  };
  isRecommended: boolean;
  recommendationScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Event Image Interface
interface EventImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  type: 'poster' | 'venue' | 'performance' | 'crowd';
  isMain: boolean;
}

// Event Review Interface
interface EventReview {
  id: string;
  userId: string;
  userName: string;
  avatar?: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
  photos: string[];
}

// Event Category Interface
interface EventCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

// Discount Interface
interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed' | 'early-bird' | 'group' | 'student' | 'senior';
  value: number;
  conditions: string[];
  validUntil: Date;
}

// Group Rate Interface
interface GroupRate {
  id: string;
  groupSize: number;
  discount: number;
  type: 'percentage' | 'fixed';
}

// Calendar View Interface
interface CalendarView {
  currentMonth: Date;
  events: CalendarEvent[];
}

// Calendar Event Interface
interface CalendarEvent {
  id: string;
  eventId: string;
  date: Date;
  title: string;
  type: string;
  color: string;
}

// Event Filters Interface
interface EventFilters {
  type: string[];
  category: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  priceRange: {
    min: number;
    max: number;
  };
  distance: number;
  ageRestrictions: string[];
  requirements: string[];
  availability: boolean;
}

// Event Discovery Component
export const EventDiscovery = React.forwardRef<HTMLDivElement, EventDiscoveryProps>(
  ({ 
    className, 
    onEventSelect,
    initialEvents,
    showFilters = true,
    showCalendar = true,
    showTickets = true,
    showNearby = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [events, setEvents] = useState<EventDiscoveryData>(
      initialEvents || {
        id: '',
        destination: '',
        events: [],
        festivals: [],
        cultural: [],
        music: [],
        sports: [],
        categories: [],
        filters: {
          type: [],
          category: [],
          dateRange: {
            start: new Date(),
            end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          priceRange: { min: 0, max: 500 },
          distance: 20,
          ageRestrictions: [],
          requirements: [],
          availability: true
        },
        calendar: {
          currentMonth: new Date(),
          events: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

    const tabs = [
      { id: 'all', name: 'All Events', icon: '🎪' },
      { id: 'festivals', name: 'Festivals', icon: '🎭' },
      { id: 'cultural', name: 'Cultural', icon: '🏛️' },
      { id: 'music', name: 'Music', icon: '🎵' },
      { id: 'sports', name: 'Sports', icon: '⚽' }
    ];

    const eventTypes = [
      { id: 'festival', name: 'Festival', icon: '🎭', color: 'purple' },
      { id: 'cultural', name: 'Cultural', icon: '🏛️', color: 'blue' },
      { id: 'music', name: 'Music', icon: '🎵', color: 'green' },
      { id: 'sports', name: 'Sports', icon: '⚽', color: 'orange' },
      { id: 'exhibition', name: 'Exhibition', icon: '🖼️', color: 'pink' },
      { id: 'conference', name: 'Conference', icon: '🎤', color: 'indigo' },
      { id: 'workshop', name: 'Workshop', icon: '🔧', color: 'yellow' },
      { id: 'tour', name: 'Tour', icon: '🚶', color: 'teal' }
    ];

    const categories = [
      { id: 'art', name: 'Art', icon: '🎨', color: 'purple' },
      { id: 'music', name: 'Music', icon: '🎵', color: 'green' },
      { id: 'food', name: 'Food & Drink', icon: '🍽️', color: 'orange' },
      { id: 'sports', name: 'Sports', icon: '⚽', color: 'blue' },
      { id: 'technology', name: 'Technology', icon: '💻', color: 'gray' },
      { id: 'education', name: 'Education', icon: '📚', color: 'indigo' },
      { id: 'business', name: 'Business', icon: '💼', color: 'slate' },
      { id: 'health', name: 'Health & Wellness', icon: '🧘', color: 'emerald' }
    ];

    const updateEvents = useCallback((path: string, value: any) => {
      setEvents(prev => {
        const newEvents = { ...prev };
        const keys = path.split('.');
        let current: any = newEvents;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newEvents.updatedAt = new Date();
        return newEvents;
      });
    }, []);

    const loadEvents = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEvents: EventData[] = [
        {
          id: 'event-1',
          title: 'Paris Jazz Festival',
          description: 'Annual jazz festival featuring world-renowned artists in beautiful outdoor venues throughout Paris.',
          type: 'festival',
          category: 'music',
          venue: {
            name: 'Parc de la Villette',
            address: '211 Avenue Jean Jaurès, 75019 Paris',
            coordinates: { lat: 48.8944, lng: 2.3872 },
            capacity: 5000,
            accessibility: ['Wheelchair accessible', 'Audio description']
          },
          schedule: {
            startDate: new Date('2024-07-15'),
            endDate: new Date('2024-07-21'),
            startTime: '18:00',
            endTime: '23:00',
            duration: 5,
            recurring: {
              isRecurring: true,
              frequency: 'yearly',
              endDate: new Date('2024-07-21')
            }
          },
          pricing: {
            type: 'paid',
            price: 45,
            currency: 'EUR',
            discounts: [
              {
                id: 'disc-1',
                name: 'Early Bird',
                type: 'early-bird',
                value: 20,
                conditions: ['Book before June 1st'],
                validUntil: new Date('2024-06-01')
              }
            ],
            groupRates: [
              {
                id: 'group-1',
                groupSize: 5,
                discount: 15,
                type: 'percentage'
              }
            ]
          },
          organizer: {
            name: 'Paris Jazz Association',
            contact: {
              phone: '+33 1 40 03 75 75',
              email: 'info@parisjazzfestival.com',
              website: 'https://www.parisjazzfestival.com'
            },
            rating: 4.7,
            verified: true
          },
          images: [
            {
              id: 'img-1',
              url: '/images/jazz-festival.jpg',
              thumbnail: '/images/jazz-festival-thumb.jpg',
              caption: 'Paris Jazz Festival performance',
              type: 'performance',
              isMain: true
            }
          ],
          tags: ['jazz', 'music', 'outdoor', 'summer'],
          ageRestrictions: {
            allAges: true
          },
          requirements: {
            booking: true,
            dressCode: 'Casual'
          },
          tickets: {
            available: true,
            url: 'https://www.parisjazzfestival.com/tickets',
            phone: '+33 1 40 03 75 75',
            boxOffice: true,
            onlineOnly: false,
            lastMinute: true
          },
          capacity: {
            total: 5000,
            available: 1200,
            soldOut: false
          },
          rating: 4.7,
          reviewCount: 2847,
          reviews: [],
          social: {
            facebook: 'https://facebook.com/parisjazzfestival',
            instagram: 'https://instagram.com/parisjazzfestival',
            twitter: 'https://twitter.com/parisjazzfest',
            hashtags: ['#ParisJazzFestival', '#JazzParis', '#SummerMusic']
          },
          distance: {
            fromUser: 3.2,
            fromAttractions: [2.1, 4.5, 3.8]
          },
          isRecommended: true,
          recommendationScore: 0.92,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'event-2',
          title: 'Louvre Night Tours',
          description: 'Exclusive evening tours of the Louvre Museum with expert guides and smaller crowds.',
          type: 'tour',
          category: 'art',
          venue: {
            name: 'Musée du Louvre',
            address: 'Rue de Rivoli, 75001 Paris',
            coordinates: { lat: 48.8606, lng: 2.3376 },
            capacity: 25,
            accessibility: ['Wheelchair accessible', 'Audio guide']
          },
          schedule: {
            startDate: new Date('2024-06-01'),
            endDate: new Date('2024-08-31'),
            startTime: '19:00',
            endTime: '21:00',
            duration: 2,
            recurring: {
              isRecurring: true,
              frequency: 'weekly',
              endDate: new Date('2024-08-31')
            }
          },
          pricing: {
            type: 'paid',
            price: 65,
            currency: 'EUR',
            discounts: [],
            groupRates: []
          },
          organizer: {
            name: 'Louvre Museum',
            contact: {
              phone: '+33 1 40 20 50 50',
              email: 'info@louvre.fr',
              website: 'https://www.louvre.fr'
            },
            rating: 4.9,
            verified: true
          },
          images: [
            {
              id: 'img-2',
              url: '/images/louvre-night.jpg',
              thumbnail: '/images/louvre-night-thumb.jpg',
              caption: 'Louvre Museum at night',
              type: 'venue',
              isMain: true
            }
          ],
          tags: ['art', 'museum', 'guided-tour', 'evening'],
          ageRestrictions: {
            minAge: 12,
            allAges: false
          },
          requirements: {
            booking: true,
            equipment: ['Comfortable shoes']
          },
          tickets: {
            available: true,
            url: 'https://www.louvre.fr/en/visit/tickets',
            phone: '+33 1 40 20 50 50',
            boxOffice: true,
            onlineOnly: false,
            lastMinute: false
          },
          capacity: {
            total: 25,
            available: 8,
            soldOut: false
          },
          rating: 4.9,
          reviewCount: 1923,
          reviews: [],
          social: {
            instagram: 'https://instagram.com/museelouvre',
            twitter: 'https://twitter.com/museelouvre',
            hashtags: ['#Louvre', '#MuseumTour', '#ArtParis']
          },
          distance: {
            fromUser: 1.5,
            fromAttractions: [0.2, 1.8, 2.3]
          },
          isRecommended: true,
          recommendationScore: 0.88,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateEvents('events', mockEvents);
      updateEvents('festivals', mockEvents.filter(e => e.type === 'festival'));
      updateEvents('cultural', mockEvents.filter(e => e.type === 'cultural' || e.category === 'art'));
      updateEvents('music', mockEvents.filter(e => e.type === 'music' || e.category === 'music'));
      updateEvents('sports', mockEvents.filter(e => e.type === 'sports' || e.category === 'sports'));
      setIsLoading(false);
    }, [updateEvents]);

    const getCurrentEvents = useCallback(() => {
      switch (activeTab) {
        case 'festivals':
          return events.festivals;
        case 'cultural':
          return events.cultural;
        case 'music':
          return events.music;
        case 'sports':
          return events.sports;
        case 'all':
          return events.events;
        default:
          return events.events;
      }
    }, [activeTab, events]);

    const getTypeIcon = (type: EventData['type']) => {
      const eventType = eventTypes.find(t => t.id === type);
      return eventType?.icon || '🎪';
    };

    const getTypeName = (type: EventData['type']) => {
      const eventType = eventTypes.find(t => t.id === type);
      return eventType?.name || type;
    };

    const getCategoryIcon = (category: string) => {
      const cat = categories.find(c => c.id === category);
      return cat?.icon || '🎪';
    };

    const getCategoryName = (category: string) => {
      const cat = categories.find(c => c.id === category);
      return cat?.name || category;
    };

    const formatPrice = (pricing: EventData['pricing']) => {
      if (pricing.type === 'free') return 'Free';
      if (pricing.type === 'donation') return 'Donation';
      if (pricing.type === 'membership') return 'Membership Required';
      return `${pricing.currency} ${pricing.price}`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTime = (time: string) => {
      return time;
    };

    const formatDistance = (distance: number) => {
      return `${distance.toFixed(1)} km`;
    };

    const getAvailabilityColor = (capacity: EventData['capacity']) => {
      if (capacity.soldOut) return 'text-red-600 dark:text-red-400';
      if (capacity.available < capacity.total * 0.1) return 'text-orange-600 dark:text-orange-400';
      return 'text-green-600 dark:text-green-400';
    };

    const getAvailabilityText = (capacity: EventData['capacity']) => {
      if (capacity.soldOut) return 'Sold Out';
      if (capacity.available < capacity.total * 0.1) return 'Limited Availability';
      return `${capacity.available} tickets available`;
    };

    useEffect(() => {
      loadEvents();
    }, [loadEvents]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          eventDiscoveryVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Event Discovery
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover amazing events in {events.destination}
            </p>
          </div>
          <div className="flex gap-2">
            {showCalendar && (
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                className={cn(
                  'px-4 py-2 rounded-md transition-colors duration-200',
                  viewMode === 'calendar'
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
              >
                📅 {viewMode === 'list' ? 'Calendar' : 'List'}
              </button>
            )}
            <button
              onClick={loadEvents}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                >
                  <option value="">All Types</option>
                  {eventTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 4).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        const currentCategories = events.filters.category;
                        const newCategories = currentCategories.includes(category.id)
                          ? currentCategories.filter(c => c !== category.id)
                          : [...currentCategories, category.id];
                        updateEvents('filters.category', newCategories);
                      }}
                      className={cn(
                        'px-3 py-1 text-xs rounded-md transition-colors duration-200',
                        events.filters.category.includes(category.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {category.icon} {category.name}
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
                    placeholder="Min"
                    value={events.filters.priceRange.min}
                    onChange={(e) => updateEvents('filters.priceRange.min', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={events.filters.priceRange.max}
                    onChange={(e) => updateEvents('filters.priceRange.max', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Distance
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={events.filters.distance}
                  onChange={(e) => updateEvents('filters.distance', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                  {events.filters.distance} km
                </div>
              </div>
            </div>
          </div>
        )}

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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Discovering amazing events...</p>
            </div>
          ) : getCurrentEvents().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentEvents()
                .filter(event => !selectedCategory || event.type === selectedCategory)
                .map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onEventSelect?.(event)}
                >
                  {event.images[0] && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={event.images[0].thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(event.type)}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {event.venue.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {event.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({event.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(event.schedule.startDate)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(event.schedule.startTime)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getCategoryIcon(event.category)} {getCategoryName(event.category)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Price:</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(event.pricing)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDistance(event.distance.fromUser)}
                        </span>
                      </div>
                      
                      {showTickets && (
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className={cn('font-medium', getAvailabilityColor(event.capacity))}>
                            {getAvailabilityText(event.capacity)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {event.isRecommended && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          🎯 Recommended
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {Math.round(event.recommendationScore * 100)}% match
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1">
                        {event.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No events found
              </h3>
              <p>Try adjusting your filters or check back later for new events</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

EventDiscovery.displayName = 'EventDiscovery';

// Event Discovery Demo Component
interface EventDiscoveryDemoProps {
  className?: string;
  showControls?: boolean;
}

export const EventDiscoveryDemo = React.forwardRef<HTMLDivElement, EventDiscoveryDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [events, setEvents] = useState<Partial<EventDiscoveryData>>({});

    const handleEventSelect = (event: EventData) => {
      console.log('Event selected:', event);
    };

    const mockEvents: Partial<EventDiscoveryData> = {
      id: 'events-1',
      destination: 'Paris, France',
      events: [],
      festivals: [],
      cultural: [],
      music: [],
      sports: [],
      categories: [],
      filters: {
        type: [],
        category: [],
        dateRange: {
          start: new Date(),
          end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        priceRange: { min: 0, max: 200 },
        distance: 20,
        ageRestrictions: [],
        requirements: [],
        availability: true
      },
      calendar: {
        currentMonth: new Date(),
        events: []
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
          Event Discovery Demo
        </h3>
        
        <EventDiscovery
          onEventSelect={handleEventSelect}
          initialEvents={mockEvents}
          showFilters={true}
          showCalendar={true}
          showTickets={true}
          showNearby={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive event discovery with festivals, cultural events, music, sports, and ticket availability.
            </p>
          </div>
        )}
      </div>
    );
  }
);

EventDiscoveryDemo.displayName = 'EventDiscoveryDemo';

// Export all components
export {
  eventDiscoveryVariants,
  type EventDiscoveryProps,
  type EventDiscoveryData,
  type EventData,
  type EventImage,
  type EventReview,
  type EventCategory,
  type Discount,
  type GroupRate,
  type CalendarView,
  type CalendarEvent,
  type EventFilters,
  type EventDiscoveryDemoProps
};
