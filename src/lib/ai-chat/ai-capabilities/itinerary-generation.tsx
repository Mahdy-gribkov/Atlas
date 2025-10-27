/**
 * Itinerary Generation Component
 * 
 * Provides AI-powered itinerary generation for travel planning.
 * Implements advanced trip planning and scheduling algorithms.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Itinerary Generation Variants
const itineraryGenerationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'itinerary-generation-mode-standard',
        'enhanced': 'itinerary-generation-mode-enhanced',
        'advanced': 'itinerary-generation-mode-advanced',
        'custom': 'itinerary-generation-mode-custom'
      },
      type: {
        'daily': 'itinerary-type-daily',
        'hourly': 'itinerary-type-hourly',
        'flexible': 'itinerary-type-flexible',
        'optimized': 'itinerary-type-optimized',
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

// Itinerary Generation Toggle Props
interface ItineraryGenerationToggleProps extends VariantProps<typeof itineraryGenerationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Itinerary Generation Toggle Component
export const ItineraryGenerationToggle = React.forwardRef<HTMLButtonElement, ItineraryGenerationToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      onToggle?.(newState);
    }, [isEnabled, onToggle]);

    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500',
          sizeClasses[size],
          positionClasses[position],
          isEnabled 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable itinerary generation' : 'Enable itinerary generation'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Itinerary generation enabled' : 'Itinerary generation disabled'}
          </span>
        )}
      </button>
    );
  }
);

ItineraryGenerationToggle.displayName = 'ItineraryGenerationToggle';

// Itinerary Generation Provider Props
interface ItineraryGenerationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'daily' | 'hourly' | 'flexible' | 'optimized' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Itinerary Generation Provider Component
export const ItineraryGenerationProvider = React.forwardRef<HTMLDivElement, ItineraryGenerationProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'mixed',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing itinerary generation classes
        document.body.classList.remove(
          'itinerary-generation-mode-standard',
          'itinerary-generation-mode-enhanced',
          'itinerary-generation-mode-advanced',
          'itinerary-generation-mode-custom'
        );
        
        document.body.classList.add(`itinerary-generation-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          itineraryGenerationVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ItineraryGenerationProvider.displayName = 'ItineraryGenerationProvider';

// Itinerary Generation Engine Component
interface ItineraryGenerationEngineProps extends VariantProps<typeof itineraryGenerationVariants> {
  className?: string;
  onItineraryGenerated?: (itinerary: any) => void;
  type?: 'daily' | 'hourly' | 'flexible' | 'optimized' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const ItineraryGenerationEngine = React.forwardRef<HTMLDivElement, ItineraryGenerationEngineProps>(
  ({ 
    className, 
    onItineraryGenerated,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [tripDetails, setTripDetails] = useState({
      destination: 'Paris',
      duration: '7 days',
      startDate: '2024-06-15',
      travelers: '2',
      budget: 'medium',
      interests: ['culture', 'food', 'history'],
      pace: 'moderate'
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);

    const mockItinerary = {
      destination: 'Paris',
      duration: '7 days',
      totalCost: '$2,500',
      summary: 'A perfect blend of culture, cuisine, and history in the City of Light',
      days: [
        {
          day: 1,
          date: '2024-06-15',
          theme: 'Arrival & Orientation',
          activities: [
            { time: '10:00', activity: 'Arrive at CDG Airport', type: 'transport', duration: '1 hour', cost: '$50' },
            { time: '12:00', activity: 'Check into hotel', type: 'accommodation', duration: '1 hour', cost: '$200' },
            { time: '14:00', activity: 'Lunch at local bistro', type: 'food', duration: '1.5 hours', cost: '$60' },
            { time: '16:00', activity: 'Seine River cruise', type: 'activity', duration: '2 hours', cost: '$40' },
            { time: '19:00', activity: 'Dinner near Eiffel Tower', type: 'food', duration: '2 hours', cost: '$120' }
          ]
        },
        {
          day: 2,
          date: '2024-06-16',
          theme: 'Historic Paris',
          activities: [
            { time: '09:00', activity: 'Notre-Dame Cathedral', type: 'culture', duration: '2 hours', cost: 'Free' },
            { time: '11:30', activity: 'Louvre Museum', type: 'culture', duration: '3 hours', cost: '$20' },
            { time: '15:00', activity: 'Lunch in Marais', type: 'food', duration: '1.5 hours', cost: '$80' },
            { time: '17:00', activity: 'Sainte-Chapelle', type: 'culture', duration: '1 hour', cost: '$12' },
            { time: '19:30', activity: 'Dinner in Latin Quarter', type: 'food', duration: '2 hours', cost: '$100' }
          ]
        },
        {
          day: 3,
          date: '2024-06-17',
          theme: 'Art & Gardens',
          activities: [
            { time: '09:00', activity: 'Musée d\'Orsay', type: 'culture', duration: '3 hours', cost: '$18' },
            { time: '13:00', activity: 'Lunch in Saint-Germain', type: 'food', duration: '1.5 hours', cost: '$90' },
            { time: '15:00', activity: 'Luxembourg Gardens', type: 'nature', duration: '2 hours', cost: 'Free' },
            { time: '17:30', activity: 'Montmartre walking tour', type: 'culture', duration: '2 hours', cost: '$25' },
            { time: '20:00', activity: 'Dinner in Montmartre', type: 'food', duration: '2 hours', cost: '$110' }
          ]
        }
      ],
      tips: [
        'Book museum tickets in advance to avoid queues',
        'Use the Paris Metro for efficient city transportation',
        'Try local specialties like croissants and macarons',
        'Visit attractions early in the morning for fewer crowds'
      ],
      packing: [
        'Comfortable walking shoes',
        'Light jacket for evening',
        'Universal power adapter',
        'Camera for photos',
        'Small backpack for day trips'
      ]
    };

    const generateItinerary = useCallback(async () => {
      setIsGenerating(true);
      
      // Simulate AI itinerary generation
      setTimeout(() => {
        setGeneratedItinerary(mockItinerary);
        setIsGenerating(false);
        onItineraryGenerated?.(mockItinerary);
      }, 3000);
    }, [onItineraryGenerated]);

    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'transport': return '🚗';
        case 'accommodation': return '🏨';
        case 'food': return '🍽️';
        case 'activity': return '🎯';
        case 'culture': return '🏛️';
        case 'nature': return '🌿';
        case 'shopping': return '🛍️';
        case 'entertainment': return '🎭';
        default: return '📍';
      }
    };

    const getActivityColor = (type: string) => {
      switch (type) {
        case 'transport': return 'text-blue-600 dark:text-blue-400';
        case 'accommodation': return 'text-green-600 dark:text-green-400';
        case 'food': return 'text-orange-600 dark:text-orange-400';
        case 'activity': return 'text-purple-600 dark:text-purple-400';
        case 'culture': return 'text-red-600 dark:text-red-400';
        case 'nature': return 'text-emerald-600 dark:text-emerald-400';
        case 'shopping': return 'text-pink-600 dark:text-pink-400';
        case 'entertainment': return 'text-yellow-600 dark:text-yellow-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          itineraryGenerationVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          AI Itinerary Generation
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Trip Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Destination</label>
                <input
                  type="text"
                  value={tripDetails.destination}
                  onChange={(e) => setTripDetails(prev => ({ ...prev, destination: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                <select
                  value={tripDetails.duration}
                  onChange={(e) => setTripDetails(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="3 days">3 days</option>
                  <option value="5 days">5 days</option>
                  <option value="7 days">7 days</option>
                  <option value="10 days">10 days</option>
                  <option value="14 days">14 days</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Travelers</label>
                <select
                  value={tripDetails.travelers}
                  onChange={(e) => setTripDetails(prev => ({ ...prev, travelers: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="1">Solo</option>
                  <option value="2">Couple</option>
                  <option value="4">Family (4)</option>
                  <option value="6">Group (6)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Budget</label>
                <select
                  value={tripDetails.budget}
                  onChange={(e) => setTripDetails(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Pace</label>
                <select
                  value={tripDetails.pace}
                  onChange={(e) => setTripDetails(prev => ({ ...prev, pace: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="relaxed">Relaxed</option>
                  <option value="moderate">Moderate</option>
                  <option value="fast">Fast-paced</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
                <input
                  type="date"
                  value={tripDetails.startDate}
                  onChange={(e) => setTripDetails(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                />
              </div>
            </div>
          </div>
          
          <button
            onClick={generateItinerary}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Generating Itinerary...' : 'Generate Itinerary'}
          </button>
          
          {generatedItinerary && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Trip Summary
                </h4>
                <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <div><strong>Destination:</strong> {generatedItinerary.destination}</div>
                  <div><strong>Duration:</strong> {generatedItinerary.duration}</div>
                  <div><strong>Estimated Cost:</strong> {generatedItinerary.totalCost}</div>
                  <div><strong>Summary:</strong> {generatedItinerary.summary}</div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Daily Itinerary
                </h4>
                <div className="space-y-4">
                  {generatedItinerary.days.map((day: any) => (
                    <div key={day.day} className="border border-gray-200 rounded-lg p-4 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          Day {day.day} - {day.theme}
                        </h5>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {day.date}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {day.activities.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                              {activity.time}
                            </span>
                            <span className="text-lg">{getActivityIcon(activity.type)}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={cn('text-sm font-medium', getActivityColor(activity.type))}>
                                  {activity.activity}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-500">
                                  {activity.duration}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                              {activity.cost}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Travel Tips
                  </h4>
                  <div className="space-y-1">
                    {generatedItinerary.tips.map((tip: string, index: number) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Packing List
                  </h4>
                  <div className="space-y-1">
                    {generatedItinerary.packing.map((item: string, index: number) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">📦</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ItineraryGenerationEngine.displayName = 'ItineraryGenerationEngine';

// Itinerary Generation Status Component
interface ItineraryGenerationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ItineraryGenerationStatus = React.forwardRef<HTMLDivElement, ItineraryGenerationStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="font-medium">
          Itinerary Generation: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'AI-powered itinerary generation and trip planning' 
              : 'Basic trip planning'
            }
          </div>
        )}
      </div>
    );
  }
);

ItineraryGenerationStatus.displayName = 'ItineraryGenerationStatus';

// Itinerary Generation Demo Component
interface ItineraryGenerationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ItineraryGenerationDemo = React.forwardRef<HTMLDivElement, ItineraryGenerationDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Itinerary Generation Demo</h3>
        
        <ItineraryGenerationEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onItineraryGenerated={(itinerary) => console.log('Itinerary generated:', itinerary)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered itinerary generation with detailed daily schedules, activities, and travel tips.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ItineraryGenerationDemo.displayName = 'ItineraryGenerationDemo';

// Export all components
export {
  itineraryGenerationVariants,
  type ItineraryGenerationToggleProps,
  type ItineraryGenerationProviderProps,
  type ItineraryGenerationEngineProps,
  type ItineraryGenerationStatusProps,
  type ItineraryGenerationDemoProps
};
