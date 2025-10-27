/**
 * Itinerary Optimization Component
 * 
 * Provides AI-powered itinerary optimization and suggestions for Atlas travel agent.
 * Implements route optimization, time management, and intelligent recommendations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Itinerary Optimization Variants
const itineraryOptimizationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'itinerary-optimization-mode-standard',
        'enhanced': 'itinerary-optimization-mode-enhanced',
        'advanced': 'itinerary-optimization-mode-advanced',
        'custom': 'itinerary-optimization-mode-custom'
      },
      type: {
        'route': 'optimization-type-route',
        'time': 'optimization-type-time',
        'cost': 'optimization-type-cost',
        'mixed': 'optimization-type-mixed'
      },
      style: {
        'minimal': 'optimization-style-minimal',
        'moderate': 'optimization-style-moderate',
        'detailed': 'optimization-style-detailed',
        'custom': 'optimization-style-custom'
      },
      format: {
        'text': 'optimization-format-text',
        'visual': 'optimization-format-visual',
        'interactive': 'optimization-format-interactive',
        'mixed': 'optimization-format-mixed'
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

// Itinerary Optimization Props
interface ItineraryOptimizationProps extends VariantProps<typeof itineraryOptimizationVariants> {
  className?: string;
  onOptimizationUpdate?: (optimization: ItineraryOptimizationData) => void;
  initialOptimization?: Partial<ItineraryOptimizationData>;
  showSuggestions?: boolean;
  showAnalytics?: boolean;
  showAlternatives?: boolean;
  showRealTime?: boolean;
}

// Itinerary Optimization Data Interface
interface ItineraryOptimizationData {
  id: string;
  tripId: string;
  tripName: string;
  originalItinerary: ItineraryDay[];
  optimizedItinerary: ItineraryDay[];
  suggestions: OptimizationSuggestion[];
  analytics: OptimizationAnalytics;
  alternatives: ItineraryAlternative[];
  constraints: OptimizationConstraints;
  preferences: OptimizationPreferences;
  settings: OptimizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Itinerary Day Interface
interface ItineraryDay {
  id: string;
  date: Date;
  dayNumber: number;
  location: string;
  activities: DayActivity[];
  meals: DayMeal[];
  transportation: DayTransportation[];
  accommodations: DayAccommodation[];
  totalCost: number;
  totalTime: number; // in minutes
  totalDistance: number; // in km
  efficiency: number; // 0-100
  satisfaction: number; // 0-100
  notes: string;
}

// Day Activity Interface
interface DayActivity {
  id: string;
  name: string;
  type: 'attraction' | 'experience' | 'leisure' | 'shopping' | 'cultural' | 'adventure';
  startTime: string;
  endTime: string;
  duration: number; // in minutes
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
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'moderate' | 'hard';
  weatherDependent: boolean;
  crowdLevel: 'low' | 'medium' | 'high';
  bookingRequired: boolean;
  bookingInfo?: BookingInfo;
  notes: string;
}

// Day Meal Interface
interface DayMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  restaurant: string;
  location: string;
  cost: number;
  currency: string;
  cuisine: string;
  rating: number;
  notes: string;
}

// Day Transportation Interface
interface DayTransportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'metro' | 'walking' | 'bike';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: number; // in minutes
  distance: number; // in km
  cost: number;
  currency: string;
  bookingInfo?: BookingInfo;
  notes: string;
}

// Day Accommodation Interface
interface DayAccommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'airbnb' | 'resort' | 'apartment';
  location: string;
  checkIn: string;
  checkOut: string;
  cost: number;
  currency: string;
  rating: number;
  amenities: string[];
  notes: string;
}

// Booking Info Interface
interface BookingInfo {
  confirmationNumber: string;
  provider: string;
  url?: string;
  phone?: string;
  cancellationPolicy: string;
}

// Optimization Suggestion Interface
interface OptimizationSuggestion {
  id: string;
  type: 'route' | 'timing' | 'cost' | 'experience' | 'weather' | 'crowd';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'hard';
  savings?: {
    time: number; // in minutes
    cost: number;
    currency: string;
  };
  improvements?: {
    efficiency: number;
    satisfaction: number;
    experience: number;
  };
  affectedDays: string[];
  affectedActivities: string[];
  confidence: number; // 0-100
  isApplied: boolean;
  createdAt: Date;
}

// Optimization Analytics Interface
interface OptimizationAnalytics {
  totalCost: number;
  totalTime: number;
  totalDistance: number;
  averageEfficiency: number;
  averageSatisfaction: number;
  costBreakdown: {
    activities: number;
    meals: number;
    transportation: number;
    accommodations: number;
  };
  timeBreakdown: {
    activities: number;
    transportation: number;
    meals: number;
    freeTime: number;
  };
  efficiencyMetrics: {
    routeOptimization: number;
    timeUtilization: number;
    costEfficiency: number;
    experienceQuality: number;
  };
  trends: {
    costTrend: 'increasing' | 'decreasing' | 'stable';
    timeTrend: 'increasing' | 'decreasing' | 'stable';
    satisfactionTrend: 'increasing' | 'decreasing' | 'stable';
  };
}

// Itinerary Alternative Interface
interface ItineraryAlternative {
  id: string;
  name: string;
  description: string;
  type: 'budget' | 'luxury' | 'adventure' | 'cultural' | 'relaxed' | 'packed';
  days: ItineraryDay[];
  analytics: OptimizationAnalytics;
  pros: string[];
  cons: string[];
  suitability: number; // 0-100
  isRecommended: boolean;
  createdAt: Date;
}

// Optimization Constraints Interface
interface OptimizationConstraints {
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  time: {
    startDate: Date;
    endDate: Date;
    dailyHours: number;
    restDays: number;
  };
  physical: {
    fitnessLevel: 'low' | 'medium' | 'high';
    mobility: 'full' | 'limited' | 'wheelchair';
    ageRestrictions: string[];
  };
  preferences: {
    avoidCrowds: boolean;
    preferOutdoor: boolean;
    culturalFocus: boolean;
    adventureLevel: 'low' | 'medium' | 'high';
  };
  dietary: {
    restrictions: string[];
    preferences: string[];
  };
  accessibility: {
    wheelchairAccessible: boolean;
    hearingAccessible: boolean;
    visualAccessible: boolean;
  };
}

// Optimization Preferences Interface
interface OptimizationPreferences {
  priorities: {
    cost: number; // 0-100
    time: number; // 0-100
    experience: number; // 0-100
    convenience: number; // 0-100
  };
  preferences: {
    earlyRiser: boolean;
    nightOwl: boolean;
    foodie: boolean;
    photographer: boolean;
    shopper: boolean;
    cultureEnthusiast: boolean;
    adventureSeeker: boolean;
    relaxationLover: boolean;
  };
  avoidances: {
    crowds: boolean;
    expensive: boolean;
    touristy: boolean;
    longWalks: boolean;
    stairs: boolean;
    heights: boolean;
  };
}

// Optimization Settings Interface
interface OptimizationSettings {
  autoOptimize: boolean;
  realTimeUpdates: boolean;
  weatherIntegration: boolean;
  crowdDataIntegration: boolean;
  costOptimization: boolean;
  timeOptimization: boolean;
  routeOptimization: boolean;
  experienceOptimization: boolean;
  notificationThresholds: {
    costIncrease: number; // percentage
    timeIncrease: number; // percentage
    efficiencyDecrease: number; // percentage
  };
  optimizationFrequency: 'realtime' | 'hourly' | 'daily' | 'manual';
}

// Itinerary Optimization Component
export const ItineraryOptimization = React.forwardRef<HTMLDivElement, ItineraryOptimizationProps>(
  ({ 
    className, 
    onOptimizationUpdate,
    initialOptimization,
    showSuggestions = true,
    showAnalytics = true,
    showAlternatives = true,
    showRealTime = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [optimization, setOptimization] = useState<ItineraryOptimizationData>(
      initialOptimization || {
        id: '',
        tripId: '',
        tripName: '',
        originalItinerary: [],
        optimizedItinerary: [],
        suggestions: [],
        analytics: {
          totalCost: 0,
          totalTime: 0,
          totalDistance: 0,
          averageEfficiency: 0,
          averageSatisfaction: 0,
          costBreakdown: {
            activities: 0,
            meals: 0,
            transportation: 0,
            accommodations: 0
          },
          timeBreakdown: {
            activities: 0,
            transportation: 0,
            meals: 0,
            freeTime: 0
          },
          efficiencyMetrics: {
            routeOptimization: 0,
            timeUtilization: 0,
            costEfficiency: 0,
            experienceQuality: 0
          },
          trends: {
            costTrend: 'stable',
            timeTrend: 'stable',
            satisfactionTrend: 'stable'
          }
        },
        alternatives: [],
        constraints: {
          budget: { min: 0, max: 10000, currency: 'USD' },
          time: { startDate: new Date(), endDate: new Date(), dailyHours: 8, restDays: 0 },
          physical: { fitnessLevel: 'medium', mobility: 'full', ageRestrictions: [] },
          preferences: { avoidCrowds: false, preferOutdoor: false, culturalFocus: false, adventureLevel: 'medium' },
          dietary: { restrictions: [], preferences: [] },
          accessibility: { wheelchairAccessible: false, hearingAccessible: false, visualAccessible: false }
        },
        preferences: {
          priorities: { cost: 50, time: 50, experience: 50, convenience: 50 },
          preferences: {
            earlyRiser: false,
            nightOwl: false,
            foodie: false,
            photographer: false,
            shopper: false,
            cultureEnthusiast: false,
            adventureSeeker: false,
            relaxationLover: false
          },
          avoidances: {
            crowds: false,
            expensive: false,
            touristy: false,
            longWalks: false,
            stairs: false,
            heights: false
          }
        },
        settings: {
          autoOptimize: true,
          realTimeUpdates: true,
          weatherIntegration: true,
          crowdDataIntegration: true,
          costOptimization: true,
          timeOptimization: true,
          routeOptimization: true,
          experienceOptimization: true,
          notificationThresholds: {
            costIncrease: 20,
            timeIncrease: 30,
            efficiencyDecrease: 15
          },
          optimizationFrequency: 'realtime'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [selectedSuggestion, setSelectedSuggestion] = useState<string>('');

    const tabs = [
      { id: 'overview', name: 'Overview', icon: '📊' },
      { id: 'suggestions', name: 'Suggestions', icon: '💡' },
      { id: 'analytics', name: 'Analytics', icon: '📈' },
      { id: 'alternatives', name: 'Alternatives', icon: '🔄' },
      { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];

    const suggestionTypes = [
      { id: 'route', name: 'Route', icon: '🗺️', color: 'blue' },
      { id: 'timing', name: 'Timing', icon: '⏰', color: 'green' },
      { id: 'cost', name: 'Cost', icon: '💰', color: 'yellow' },
      { id: 'experience', name: 'Experience', icon: '⭐', color: 'purple' },
      { id: 'weather', name: 'Weather', icon: '🌤️', color: 'cyan' },
      { id: 'crowd', name: 'Crowd', icon: '👥', color: 'orange' }
    ];

    const alternativeTypes = [
      { id: 'budget', name: 'Budget', icon: '💰', color: 'green' },
      { id: 'luxury', name: 'Luxury', icon: '✨', color: 'purple' },
      { id: 'adventure', name: 'Adventure', icon: '🏔️', color: 'orange' },
      { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'blue' },
      { id: 'relaxed', name: 'Relaxed', icon: '😌', color: 'pink' },
      { id: 'packed', name: 'Packed', icon: '📅', color: 'red' }
    ];

    const updateOptimization = useCallback((path: string, value: any) => {
      setOptimization(prev => {
        const newOptimization = { ...prev };
        const keys = path.split('.');
        let current: any = newOptimization;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newOptimization.updatedAt = new Date();
        onOptimizationUpdate?.(newOptimization);
        return newOptimization;
      });
    }, [onOptimizationUpdate]);

    const addSuggestion = useCallback(() => {
      const newSuggestion: OptimizationSuggestion = {
        id: `suggestion-${Date.now()}`,
        type: 'route',
        title: '',
        description: '',
        impact: 'medium',
        effort: 'moderate',
        affectedDays: [],
        affectedActivities: [],
        confidence: 80,
        isApplied: false,
        createdAt: new Date()
      };
      updateOptimization('suggestions', [...optimization.suggestions, newSuggestion]);
    }, [optimization.suggestions, updateOptimization]);

    const applySuggestion = useCallback((suggestionId: string) => {
      const updatedSuggestions = optimization.suggestions.map(suggestion => 
        suggestion.id === suggestionId 
          ? { ...suggestion, isApplied: true }
          : suggestion
      );
      updateOptimization('suggestions', updatedSuggestions);
      
      // Simulate optimization process
      setIsOptimizing(true);
      setTimeout(() => {
        setIsOptimizing(false);
        // Update analytics and itinerary here
      }, 2000);
    }, [optimization.suggestions, updateOptimization]);

    const generateAlternative = useCallback((type: string) => {
      const newAlternative: ItineraryAlternative = {
        id: `alternative-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Itinerary`,
        description: `A ${type}-focused itinerary alternative`,
        type: type as ItineraryAlternative['type'],
        days: [],
        analytics: optimization.analytics,
        pros: [],
        cons: [],
        suitability: Math.floor(Math.random() * 40) + 60, // 60-100
        isRecommended: false,
        createdAt: new Date()
      };
      updateOptimization('alternatives', [...optimization.alternatives, newAlternative]);
    }, [optimization.alternatives, optimization.analytics, updateOptimization]);

    const formatCurrency = (amount: number, currency: string) => {
      return `${currency} ${amount.toFixed(2)}`;
    };

    const formatTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };

    const formatDistance = (km: number) => {
      return `${km.toFixed(1)} km`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getSuggestionTypeIcon = (type: OptimizationSuggestion['type']) => {
      const suggestionType = suggestionTypes.find(t => t.id === type);
      return suggestionType?.icon || '💡';
    };

    const getSuggestionTypeName = (type: OptimizationSuggestion['type']) => {
      const suggestionType = suggestionTypes.find(t => t.id === type);
      return suggestionType?.name || type;
    };

    const getSuggestionTypeColor = (type: OptimizationSuggestion['type']) => {
      const suggestionType = suggestionTypes.find(t => t.id === type);
      return suggestionType?.color || 'gray';
    };

    const getImpactColor = (impact: OptimizationSuggestion['impact']) => {
      switch (impact) {
        case 'high': return 'text-red-600 dark:text-red-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'low': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getEffortColor = (effort: OptimizationSuggestion['effort']) => {
      switch (effort) {
        case 'easy': return 'text-green-600 dark:text-green-400';
        case 'moderate': return 'text-yellow-600 dark:text-yellow-400';
        case 'hard': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getAlternativeTypeIcon = (type: ItineraryAlternative['type']) => {
      const alternativeType = alternativeTypes.find(t => t.id === type);
      return alternativeType?.icon || '🔄';
    };

    const getAlternativeTypeName = (type: ItineraryAlternative['type']) => {
      const alternativeType = alternativeTypes.find(t => t.id === type);
      return alternativeType?.name || type;
    };

    const getAlternativeTypeColor = (type: ItineraryAlternative['type']) => {
      const alternativeType = alternativeTypes.find(t => t.id === type);
      return alternativeType?.color || 'gray';
    };

    const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
      switch (trend) {
        case 'increasing': return '📈';
        case 'decreasing': return '📉';
        case 'stable': return '➡️';
        default: return '➡️';
      }
    };

    const getTrendColor = (trend: 'increasing' | 'decreasing' | 'stable') => {
      switch (trend) {
        case 'increasing': return 'text-green-600 dark:text-green-400';
        case 'decreasing': return 'text-red-600 dark:text-red-400';
        case 'stable': return 'text-gray-600 dark:text-gray-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          itineraryOptimizationVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Itinerary Optimization
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered optimization for {optimization.tripName || 'your trip'}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
              📊 Export
            </button>
            <button
              onClick={() => setIsOptimizing(true)}
              disabled={isOptimizing}
              className={cn(
                'px-4 py-2 rounded-md transition-colors duration-200',
                isOptimizing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {isOptimizing ? '🔄 Optimizing...' : '🚀 Optimize'}
            </button>
          </div>
        </div>

        {/* Optimization Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(optimization.analytics.totalCost, optimization.constraints.budget.currency)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatTime(optimization.analytics.totalTime)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {optimization.analytics.averageEfficiency}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Efficiency</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {optimization.analytics.averageSatisfaction}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Cost Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(optimization.analytics.costBreakdown).map(([category, amount]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {category}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(amount, optimization.constraints.budget.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Time Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(optimization.analytics.timeBreakdown).map(([category, minutes]) => (
                      <div key={category} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {category}:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatTime(minutes)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Efficiency Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(optimization.analytics.efficiencyMetrics).map(([metric, value]) => (
                    <div key={metric} className="text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {value}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {metric.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && showSuggestions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Optimization Suggestions
                </h3>
                <button
                  onClick={addSuggestion}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Suggestion
                </button>
              </div>
              
              <div className="space-y-3">
                {optimization.suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getSuggestionTypeIcon(suggestion.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {suggestion.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {suggestion.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          `bg-${getSuggestionTypeColor(suggestion.type)}-100 text-${getSuggestionTypeColor(suggestion.type)}-800 dark:bg-${getSuggestionTypeColor(suggestion.type)}-900 dark:text-${getSuggestionTypeColor(suggestion.type)}-200`
                        )}>
                          {getSuggestionTypeName(suggestion.type)}
                        </span>
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          suggestion.isApplied 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        )}>
                          {suggestion.isApplied ? 'Applied' : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Impact:</span>
                        <span className={cn('font-medium', getImpactColor(suggestion.impact))}>
                          {suggestion.impact}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Effort:</span>
                        <span className={cn('font-medium', getEffortColor(suggestion.effort))}>
                          {suggestion.effort}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {suggestion.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    {suggestion.savings && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">
                          Potential Savings
                        </h5>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          Time: {formatTime(suggestion.savings.time)} • 
                          Cost: {formatCurrency(suggestion.savings.cost, suggestion.savings.currency)}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(suggestion.createdAt)}
                      </div>
                      {!suggestion.isApplied && (
                        <button
                          onClick={() => applySuggestion(suggestion.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                        >
                          Apply Suggestion
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && showAnalytics && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Optimization Analytics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Trends
                  </h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(optimization.analytics.trends).map(([trend, value]) => (
                      <div key={trend} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {trend.replace('Trend', '')}:
                        </span>
                        <span className={cn('font-medium', getTrendColor(value))}>
                          {getTrendIcon(value)} {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Performance
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Efficiency:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {optimization.analytics.averageEfficiency}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Satisfaction:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {optimization.analytics.averageSatisfaction}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Distance:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDistance(optimization.analytics.totalDistance)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Days:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {optimization.optimizedItinerary.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Suggestions:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {optimization.suggestions.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Applied:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {optimization.suggestions.filter(s => s.isApplied).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alternatives' && showAlternatives && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Itinerary Alternatives
                </h3>
                <div className="flex gap-2">
                  {alternativeTypes.slice(0, 3).map((type) => (
                    <button
                      key={type.id}
                      onClick={() => generateAlternative(type.id)}
                      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {type.icon} {type.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {optimization.alternatives.map((alternative) => (
                  <div key={alternative.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getAlternativeTypeIcon(alternative.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {alternative.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {alternative.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          `bg-${getAlternativeTypeColor(alternative.type)}-100 text-${getAlternativeTypeColor(alternative.type)}-800 dark:bg-${getAlternativeTypeColor(alternative.type)}-900 dark:text-${getAlternativeTypeColor(alternative.type)}-200`
                        )}>
                          {getAlternativeTypeName(alternative.type)}
                        </span>
                        {alternative.isRecommended && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                            Recommended
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Days:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {alternative.days.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(alternative.analytics.totalCost, optimization.constraints.budget.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suitability:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {alternative.suitability}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {alternative.pros.slice(0, 2).map((pro) => (
                          <span
                            key={pro}
                            className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md"
                          >
                            ✓ {pro}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(alternative.createdAt)}
                      </div>
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Optimization Settings
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={optimization.settings.autoOptimize}
                      onChange={(e) => updateOptimization('settings.autoOptimize', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto-optimize</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={optimization.settings.realTimeUpdates}
                      onChange={(e) => updateOptimization('settings.realTimeUpdates', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Real-time updates</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={optimization.settings.weatherIntegration}
                      onChange={(e) => updateOptimization('settings.weatherIntegration', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Weather integration</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={optimization.settings.crowdDataIntegration}
                      onChange={(e) => updateOptimization('settings.crowdDataIntegration', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Crowd data integration</span>
                  </label>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Optimization Frequency
                  </label>
                  <select
                    value={optimization.settings.optimizationFrequency}
                    onChange={(e) => updateOptimization('settings.optimizationFrequency', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ItineraryOptimization.displayName = 'ItineraryOptimization';

// Itinerary Optimization Demo Component
interface ItineraryOptimizationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ItineraryOptimizationDemo = React.forwardRef<HTMLDivElement, ItineraryOptimizationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [optimization, setOptimization] = useState<Partial<ItineraryOptimizationData>>({});

    const handleOptimizationUpdate = (updatedOptimization: ItineraryOptimizationData) => {
      setOptimization(updatedOptimization);
      console.log('Itinerary optimization updated:', updatedOptimization);
    };

    const mockOptimization: Partial<ItineraryOptimizationData> = {
      id: 'optimization-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      originalItinerary: [],
      optimizedItinerary: [],
      suggestions: [],
      analytics: {
        totalCost: 2500,
        totalTime: 4800,
        totalDistance: 45.2,
        averageEfficiency: 85,
        averageSatisfaction: 92,
        costBreakdown: {
          activities: 800,
          meals: 600,
          transportation: 400,
          accommodations: 700
        },
        timeBreakdown: {
          activities: 2400,
          transportation: 600,
          meals: 300,
          freeTime: 1500
        },
        efficiencyMetrics: {
          routeOptimization: 88,
          timeUtilization: 85,
          costEfficiency: 82,
          experienceQuality: 90
        },
        trends: {
          costTrend: 'stable',
          timeTrend: 'stable',
          satisfactionTrend: 'stable'
        }
      },
      alternatives: [],
      constraints: {
        budget: { min: 0, max: 5000, currency: 'USD' },
        time: { startDate: new Date(), endDate: new Date(), dailyHours: 8, restDays: 0 },
        physical: { fitnessLevel: 'medium', mobility: 'full', ageRestrictions: [] },
        preferences: { avoidCrowds: false, preferOutdoor: false, culturalFocus: false, adventureLevel: 'medium' },
        dietary: { restrictions: [], preferences: [] },
        accessibility: { wheelchairAccessible: false, hearingAccessible: false, visualAccessible: false }
      },
      preferences: {
        priorities: { cost: 50, time: 50, experience: 50, convenience: 50 },
        preferences: {
          earlyRiser: false,
          nightOwl: false,
          foodie: false,
          photographer: false,
          shopper: false,
          cultureEnthusiast: false,
          adventureSeeker: false,
          relaxationLover: false
        },
        avoidances: {
          crowds: false,
          expensive: false,
          touristy: false,
          longWalks: false,
          stairs: false,
          heights: false
        }
      },
      settings: {
        autoOptimize: true,
        realTimeUpdates: true,
        weatherIntegration: true,
        crowdDataIntegration: true,
        costOptimization: true,
        timeOptimization: true,
        routeOptimization: true,
        experienceOptimization: true,
        notificationThresholds: {
          costIncrease: 20,
          timeIncrease: 30,
          efficiencyDecrease: 15
        },
        optimizationFrequency: 'realtime'
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
          Itinerary Optimization Demo
        </h3>
        
        <ItineraryOptimization
          onOptimizationUpdate={handleOptimizationUpdate}
          initialOptimization={mockOptimization}
          showSuggestions={true}
          showAnalytics={true}
          showAlternatives={true}
          showRealTime={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered itinerary optimization with route optimization, time management, cost analysis, and intelligent suggestions.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ItineraryOptimizationDemo.displayName = 'ItineraryOptimizationDemo';

// Export all components
export {
  itineraryOptimizationVariants,
  type ItineraryOptimizationProps,
  type ItineraryOptimizationData,
  type ItineraryDay,
  type DayActivity,
  type DayMeal,
  type DayTransportation,
  type DayAccommodation,
  type BookingInfo,
  type OptimizationSuggestion,
  type OptimizationAnalytics,
  type ItineraryAlternative,
  type OptimizationConstraints,
  type OptimizationPreferences,
  type OptimizationSettings,
  type ItineraryOptimizationDemoProps
};
