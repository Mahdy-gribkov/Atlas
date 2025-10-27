/**
 * Activity Recommendations Component
 * 
 * Provides AI-powered activity suggestions for Atlas travel agent.
 * Implements personalized recommendations and activity discovery.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Activity Recommendations Variants
const activityRecommendationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'activity-recommendations-mode-standard',
        'enhanced': 'activity-recommendations-mode-enhanced',
        'advanced': 'activity-recommendations-mode-advanced',
        'custom': 'activity-recommendations-mode-custom'
      },
      type: {
        'personalized': 'activity-type-personalized',
        'trending': 'activity-type-trending',
        'seasonal': 'activity-type-seasonal',
        'budget': 'activity-type-budget',
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

// Activity Recommendations Props
interface ActivityRecommendationsProps extends VariantProps<typeof activityRecommendationsVariants> {
  className?: string;
  onActivitySelect?: (activity: ActivityData) => void;
  initialRecommendations?: Partial<ActivityRecommendationsData>;
  showFilters?: boolean;
  showPersonalized?: boolean;
  showTrending?: boolean;
  showNearby?: boolean;
}

// Activity Recommendations Data Interface
interface ActivityRecommendationsData {
  id: string;
  destination: string;
  userPreferences: UserPreferences;
  recommendations: ActivityData[];
  personalized: ActivityData[];
  trending: ActivityData[];
  nearby: ActivityData[];
  categories: ActivityCategory[];
  filters: ActivityFilters;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Data Interface
interface ActivityData {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  type: 'indoor' | 'outdoor' | 'cultural' | 'adventure' | 'relaxation' | 'educational';
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    area: string;
  };
  images: ActivityImage[];
  pricing: {
    adult: number;
    child?: number;
    senior?: number;
    currency: string;
    includes: string[];
    excludes: string[];
  };
  duration: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  availability: {
    days: string[];
    times: string[];
    season: string[];
  };
  requirements: {
    age: {
      min?: number;
      max?: number;
    };
    fitness: 'low' | 'moderate' | 'high';
    equipment: string[];
    skills: string[];
  };
  rating: number;
  reviewCount: number;
  reviews: ActivityReview[];
  highlights: string[];
  tips: string[];
  bookingInfo: {
    provider: string;
    bookingUrl: string;
    cancellationPolicy: string;
    instantConfirmation: boolean;
  };
  tags: string[];
  isRecommended: boolean;
  recommendationScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Activity Image Interface
interface ActivityImage {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  isMain: boolean;
}

// Activity Review Interface
interface ActivityReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  date: Date;
  helpful: number;
}

// Activity Category Interface
interface ActivityCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories: string[];
}

// User Preferences Interface
interface UserPreferences {
  interests: string[];
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  duration: {
    min: number;
    max: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  groupSize: number;
  ageRange: {
    min: number;
    max: number;
  };
  fitnessLevel: 'low' | 'moderate' | 'high';
  accessibility: string[];
  weather: string[];
  timeOfDay: string[];
}

// Activity Filters Interface
interface ActivityFilters {
  category: string[];
  type: string[];
  priceRange: {
    min: number;
    max: number;
  };
  duration: {
    min: number;
    max: number;
  };
  rating: number;
  distance: number;
  availability: string[];
}

// Activity Recommendations Component
export const ActivityRecommendations = React.forwardRef<HTMLDivElement, ActivityRecommendationsProps>(
  ({ 
    className, 
    onActivitySelect,
    initialRecommendations,
    showFilters = true,
    showPersonalized = true,
    showTrending = true,
    showNearby = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [recommendations, setRecommendations] = useState<ActivityRecommendationsData>(
      initialRecommendations || {
        id: '',
        destination: '',
        userPreferences: {
          interests: [],
          budget: { min: 0, max: 1000, currency: 'USD' },
          duration: { min: 1, max: 8, unit: 'hours' },
          groupSize: 1,
          ageRange: { min: 18, max: 65 },
          fitnessLevel: 'moderate',
          accessibility: [],
          weather: [],
          timeOfDay: []
        },
        recommendations: [],
        personalized: [],
        trending: [],
        nearby: [],
        categories: [],
        filters: {
          category: [],
          type: [],
          priceRange: { min: 0, max: 1000 },
          duration: { min: 1, max: 8 },
          rating: 0,
          distance: 50,
          availability: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('personalized');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const tabs = [
      { id: 'personalized', name: 'For You', icon: '🎯' },
      { id: 'trending', name: 'Trending', icon: '📈' },
      { id: 'nearby', name: 'Nearby', icon: '📍' },
      { id: 'all', name: 'All Activities', icon: '🎪' }
    ];

    const activityCategories = [
      { id: 'attractions', name: 'Attractions', icon: '🏛️', subcategories: ['Museums', 'Monuments', 'Landmarks'] },
      { id: 'adventure', name: 'Adventure', icon: '🏔️', subcategories: ['Hiking', 'Climbing', 'Water Sports'] },
      { id: 'culture', name: 'Culture', icon: '🎭', subcategories: ['Theater', 'Music', 'Art'] },
      { id: 'food', name: 'Food & Drink', icon: '🍽️', subcategories: ['Tours', 'Tastings', 'Cooking Classes'] },
      { id: 'nature', name: 'Nature', icon: '🌿', subcategories: ['Parks', 'Gardens', 'Wildlife'] },
      { id: 'shopping', name: 'Shopping', icon: '🛍️', subcategories: ['Markets', 'Malls', 'Boutiques'] },
      { id: 'entertainment', name: 'Entertainment', icon: '🎪', subcategories: ['Shows', 'Events', 'Nightlife'] },
      { id: 'wellness', name: 'Wellness', icon: '🧘', subcategories: ['Spas', 'Yoga', 'Meditation'] }
    ];

    const activityTypes = [
      { id: 'indoor', name: 'Indoor', icon: '🏠' },
      { id: 'outdoor', name: 'Outdoor', icon: '🌳' },
      { id: 'cultural', name: 'Cultural', icon: '🎨' },
      { id: 'adventure', name: 'Adventure', icon: '⚡' },
      { id: 'relaxation', name: 'Relaxation', icon: '😌' },
      { id: 'educational', name: 'Educational', icon: '📚' }
    ];

    const updateRecommendations = useCallback((path: string, value: any) => {
      setRecommendations(prev => {
        const newRecommendations = { ...prev };
        const keys = path.split('.');
        let current: any = newRecommendations;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newRecommendations.updatedAt = new Date();
        return newRecommendations;
      });
    }, []);

    const generateRecommendations = useCallback(async () => {
      setIsLoading(true);
      
      // Simulate AI recommendation generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockActivities: ActivityData[] = [
        {
          id: 'act-1',
          name: 'Eiffel Tower Skip-the-Line Tour',
          description: 'Skip the long lines and enjoy priority access to the iconic Eiffel Tower with a knowledgeable guide.',
          category: 'attractions',
          subcategory: 'Monuments',
          type: 'cultural',
          location: {
            name: 'Eiffel Tower',
            address: 'Champ de Mars, 7th arrondissement, Paris',
            coordinates: { lat: 48.8584, lng: 2.2945 },
            area: '7th Arrondissement'
          },
          images: [
            {
              id: 'img-1',
              url: '/images/eiffel-tour.jpg',
              thumbnail: '/images/eiffel-tour-thumb.jpg',
              caption: 'Eiffel Tower tour group',
              isMain: true
            }
          ],
          pricing: {
            adult: 45,
            child: 25,
            senior: 40,
            currency: 'USD',
            includes: ['Skip-the-line access', 'Professional guide', 'Audio headset'],
            excludes: ['Food and drinks', 'Gratuities']
          },
          duration: {
            min: 2,
            max: 3,
            unit: 'hours'
          },
          availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            times: ['09:00', '11:00', '14:00', '16:00'],
            season: ['Spring', 'Summer', 'Autumn', 'Winter']
          },
          requirements: {
            age: { min: 6 },
            fitness: 'low',
            equipment: [],
            skills: []
          },
          rating: 4.7,
          reviewCount: 2847,
          reviews: [],
          highlights: ['Skip-the-line access', 'Professional guide', 'Small group size', 'Multiple time slots'],
          tips: ['Book in advance', 'Wear comfortable shoes', 'Bring a camera', 'Arrive 15 minutes early'],
          bookingInfo: {
            provider: 'Paris Tours Co.',
            bookingUrl: 'https://example.com/book',
            cancellationPolicy: 'Free cancellation up to 24 hours',
            instantConfirmation: true
          },
          tags: ['skip-the-line', 'guided-tour', 'monument', 'family-friendly'],
          isRecommended: true,
          recommendationScore: 0.95,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'act-2',
          name: 'Seine River Dinner Cruise',
          description: 'Enjoy a romantic dinner cruise along the Seine River with stunning views of Paris landmarks.',
          category: 'food',
          subcategory: 'Tours',
          type: 'relaxation',
          location: {
            name: 'Seine River',
            address: 'Port de la Bourdonnais, 7th arrondissement, Paris',
            coordinates: { lat: 48.8566, lng: 2.2945 },
            area: '7th Arrondissement'
          },
          images: [
            {
              id: 'img-2',
              url: '/images/seine-cruise.jpg',
              thumbnail: '/images/seine-cruise-thumb.jpg',
              caption: 'Seine River dinner cruise',
              isMain: true
            }
          ],
          pricing: {
            adult: 120,
            currency: 'USD',
            includes: ['3-course dinner', 'Wine', 'Live music', 'Commentary'],
            excludes: ['Transportation to pier', 'Gratuities']
          },
          duration: {
            min: 2,
            max: 3,
            unit: 'hours'
          },
          availability: {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            times: ['19:00', '20:30'],
            season: ['Spring', 'Summer', 'Autumn', 'Winter']
          },
          requirements: {
            fitness: 'low',
            equipment: [],
            skills: []
          },
          rating: 4.5,
          reviewCount: 1923,
          reviews: [],
          highlights: ['Romantic atmosphere', 'Stunning views', 'Gourmet dinner', 'Live entertainment'],
          tips: ['Dress smart casual', 'Book window seats', 'Arrive 30 minutes early', 'Bring a jacket'],
          bookingInfo: {
            provider: 'Seine Cruises',
            bookingUrl: 'https://example.com/book',
            cancellationPolicy: 'Free cancellation up to 48 hours',
            instantConfirmation: true
          },
          tags: ['romantic', 'dinner', 'cruise', 'views'],
          isRecommended: true,
          recommendationScore: 0.88,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      updateRecommendations('recommendations', mockActivities);
      updateRecommendations('personalized', mockActivities);
      setIsLoading(false);
    }, [updateRecommendations]);

    const getCurrentActivities = useCallback(() => {
      switch (activeTab) {
        case 'personalized':
          return recommendations.personalized;
        case 'trending':
          return recommendations.trending;
        case 'nearby':
          return recommendations.nearby;
        case 'all':
          return recommendations.recommendations;
        default:
          return recommendations.recommendations;
      }
    }, [activeTab, recommendations]);

    const getActivityIcon = (category: string) => {
      const cat = activityCategories.find(c => c.id === category);
      return cat?.icon || '🎪';
    };

    const getTypeIcon = (type: ActivityData['type']) => {
      switch (type) {
        case 'indoor': return '🏠';
        case 'outdoor': return '🌳';
        case 'cultural': return '🎨';
        case 'adventure': return '⚡';
        case 'relaxation': return '😌';
        case 'educational': return '📚';
        default: return '🎪';
      }
    };

    const formatDuration = (duration: ActivityData['duration']) => {
      return `${duration.min}-${duration.max} ${duration.unit}`;
    };

    const formatPrice = (pricing: ActivityData['pricing']) => {
      return `${pricing.currency} ${pricing.adult}`;
    };

    useEffect(() => {
      generateRecommendations();
    }, [generateRecommendations]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          activityRecommendationsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Activity Recommendations
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover amazing activities in {recommendations.destination || 'your destination'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generateRecommendations}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? '🔄' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={cn(
              'px-4 py-2 text-sm rounded-md transition-colors duration-200',
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            All Categories
          </button>
          {activityCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'px-4 py-2 text-sm rounded-md transition-colors duration-200',
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {category.icon} {category.name}
            </button>
          ))}
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
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Finding the best activities for you...</p>
            </div>
          ) : getCurrentActivities().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCurrentActivities()
                .filter(activity => !selectedCategory || activity.category === selectedCategory)
                .map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => onActivitySelect?.(activity)}
                >
                  {activity.images[0] && (
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700">
                      <img
                        src={activity.images[0].thumbnail}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getActivityIcon(activity.category)}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {activityCategories.find(c => c.id === activity.category)?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.rating}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ({activity.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {activity.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {activity.description}
                    </p>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-between">
                        <span>📍 {activity.location.area}</span>
                        <span>{getTypeIcon(activity.type)} {activity.type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>⏱️ {formatDuration(activity.duration)}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          From {formatPrice(activity.pricing)}
                        </span>
                      </div>
                    </div>
                    
                    {activity.isRecommended && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          🎯 Recommended
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {Math.round(activity.recommendationScore * 100)}% match
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
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
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        Book Now →
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
                No activities found
              </h3>
              <p>Try adjusting your preferences or filters</p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ActivityRecommendations.displayName = 'ActivityRecommendations';

// Activity Recommendations Demo Component
interface ActivityRecommendationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ActivityRecommendationsDemo = React.forwardRef<HTMLDivElement, ActivityRecommendationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [recommendations, setRecommendations] = useState<Partial<ActivityRecommendationsData>>({});

    const handleActivitySelect = (activity: ActivityData) => {
      console.log('Activity selected:', activity);
    };

    const mockRecommendations: Partial<ActivityRecommendationsData> = {
      id: 'rec-1',
      destination: 'Paris, France',
      userPreferences: {
        interests: ['culture', 'food', 'history'],
        budget: { min: 0, max: 200, currency: 'USD' },
        duration: { min: 1, max: 4, unit: 'hours' },
        groupSize: 2,
        ageRange: { min: 25, max: 35 },
        fitnessLevel: 'moderate',
        accessibility: [],
        weather: ['sunny', 'partly-cloudy'],
        timeOfDay: ['morning', 'afternoon']
      },
      recommendations: [],
      personalized: [],
      trending: [],
      nearby: [],
      categories: [],
      filters: {
        category: [],
        type: [],
        priceRange: { min: 0, max: 200 },
        duration: { min: 1, max: 4 },
        rating: 0,
        distance: 10,
        availability: []
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
          Activity Recommendations Demo
        </h3>
        
        <ActivityRecommendations
          onActivitySelect={handleActivitySelect}
          initialRecommendations={mockRecommendations}
          showFilters={true}
          showPersonalized={true}
          showTrending={true}
          showNearby={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered activity recommendations with personalized suggestions, trending activities, and comprehensive filtering.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ActivityRecommendationsDemo.displayName = 'ActivityRecommendationsDemo';

// Export all components
export {
  activityRecommendationsVariants,
  type ActivityRecommendationsProps,
  type ActivityRecommendationsData,
  type ActivityData,
  type ActivityImage,
  type ActivityReview,
  type ActivityCategory,
  type UserPreferences,
  type ActivityFilters,
  type ActivityRecommendationsDemoProps
};
