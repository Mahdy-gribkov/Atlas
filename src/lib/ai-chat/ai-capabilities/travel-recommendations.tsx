/**
 * Travel Recommendations Component
 * 
 * Provides AI-powered travel recommendations for destinations and activities.
 * Implements advanced recommendation algorithms for travel agent interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Travel Recommendations Variants
const travelRecommendationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'travel-recommendations-mode-standard',
        'enhanced': 'travel-recommendations-mode-enhanced',
        'advanced': 'travel-recommendations-mode-advanced',
        'custom': 'travel-recommendations-mode-custom'
      },
      type: {
        'destinations': 'recommendations-type-destinations',
        'activities': 'recommendations-type-activities',
        'accommodations': 'recommendations-type-accommodations',
        'restaurants': 'recommendations-type-restaurants',
        'mixed': 'recommendations-type-mixed'
      },
      style: {
        'minimal': 'recommendations-style-minimal',
        'moderate': 'recommendations-style-moderate',
        'detailed': 'recommendations-style-detailed',
        'custom': 'recommendations-style-custom'
      },
      format: {
        'text': 'recommendations-format-text',
        'visual': 'recommendations-format-visual',
        'interactive': 'recommendations-format-interactive',
        'mixed': 'recommendations-format-mixed'
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

// Travel Recommendations Toggle Props
interface TravelRecommendationsToggleProps extends VariantProps<typeof travelRecommendationsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Travel Recommendations Toggle Component
export const TravelRecommendationsToggle = React.forwardRef<HTMLButtonElement, TravelRecommendationsToggleProps>(
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
            ? 'bg-rose-600 text-white border-rose-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable travel recommendations' : 'Enable travel recommendations'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Travel recommendations enabled' : 'Travel recommendations disabled'}
          </span>
        )}
      </button>
    );
  }
);

TravelRecommendationsToggle.displayName = 'TravelRecommendationsToggle';

// Travel Recommendations Provider Props
interface TravelRecommendationsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'destinations' | 'activities' | 'accommodations' | 'restaurants' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Travel Recommendations Provider Component
export const TravelRecommendationsProvider = React.forwardRef<HTMLDivElement, TravelRecommendationsProviderProps>(
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
        // Remove existing travel recommendations classes
        document.body.classList.remove(
          'travel-recommendations-mode-standard',
          'travel-recommendations-mode-enhanced',
          'travel-recommendations-mode-advanced',
          'travel-recommendations-mode-custom'
        );
        
        document.body.classList.add(`travel-recommendations-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          travelRecommendationsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

TravelRecommendationsProvider.displayName = 'TravelRecommendationsProvider';

// Travel Recommendations Engine Component
interface TravelRecommendationsEngineProps extends VariantProps<typeof travelRecommendationsVariants> {
  className?: string;
  onRecommendationsGenerated?: (recommendations: any) => void;
  type?: 'destinations' | 'activities' | 'accommodations' | 'restaurants' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const TravelRecommendationsEngine = React.forwardRef<HTMLDivElement, TravelRecommendationsEngineProps>(
  ({ 
    className, 
    onRecommendationsGenerated,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [preferences, setPreferences] = useState({
      budget: 'medium',
      travelStyle: 'adventure',
      interests: ['culture', 'nature', 'food'],
      duration: '7 days',
      season: 'summer',
      groupSize: 'couple'
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);

    const mockRecommendations = {
      destinations: [
        {
          id: 1,
          name: 'Kyoto, Japan',
          score: 95,
          reasons: ['Rich cultural heritage', 'Beautiful temples', 'Authentic experiences'],
          highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Traditional tea ceremony'],
          bestTime: 'Spring/Fall',
          budget: 'Medium',
          image: '🏯'
        },
        {
          id: 2,
          name: 'Santorini, Greece',
          score: 92,
          reasons: ['Stunning sunsets', 'Unique architecture', 'Romantic atmosphere'],
          highlights: ['Oia village', 'Red Beach', 'Wine tasting'],
          bestTime: 'Summer',
          budget: 'High',
          image: '🏝️'
        },
        {
          id: 3,
          name: 'Banff, Canada',
          score: 88,
          reasons: ['Breathtaking nature', 'Outdoor activities', 'Wildlife viewing'],
          highlights: ['Lake Louise', 'Banff National Park', 'Hot springs'],
          bestTime: 'Summer/Winter',
          budget: 'Medium',
          image: '🏔️'
        }
      ],
      activities: [
        {
          id: 1,
          name: 'Cultural Walking Tour',
          type: 'culture',
          score: 90,
          description: 'Explore historic neighborhoods and learn about local traditions',
          duration: '3 hours',
          price: '$45',
          rating: 4.8,
          image: '🚶‍♂️'
        },
        {
          id: 2,
          name: 'Food Market Experience',
          type: 'food',
          score: 87,
          description: 'Taste local delicacies and meet local vendors',
          duration: '2 hours',
          price: '$35',
          rating: 4.6,
          image: '🍽️'
        },
        {
          id: 3,
          name: 'Nature Photography Workshop',
          type: 'nature',
          score: 85,
          description: 'Capture stunning landscapes with professional guidance',
          duration: '4 hours',
          price: '$75',
          rating: 4.9,
          image: '📸'
        }
      ],
      accommodations: [
        {
          id: 1,
          name: 'Boutique Hotel Downtown',
          type: 'hotel',
          score: 93,
          description: 'Luxurious hotel in the heart of the city',
          price: '$180/night',
          rating: 4.7,
          amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant'],
          image: '🏨'
        },
        {
          id: 2,
          name: 'Cozy Bed & Breakfast',
          type: 'bnb',
          score: 89,
          description: 'Charming B&B with local character',
          price: '$120/night',
          rating: 4.5,
          amenities: ['WiFi', 'Breakfast', 'Garden'],
          image: '🏡'
        },
        {
          id: 3,
          name: 'Modern Apartment',
          type: 'apartment',
          score: 86,
          description: 'Fully equipped apartment with city views',
          price: '$150/night',
          rating: 4.4,
          amenities: ['WiFi', 'Kitchen', 'Balcony'],
          image: '🏢'
        }
      ],
      restaurants: [
        {
          id: 1,
          name: 'Traditional Local Cuisine',
          type: 'local',
          score: 94,
          description: 'Authentic dishes prepared by local chefs',
          price: '$$',
          rating: 4.8,
          specialties: ['Signature dish', 'Local wine', 'Dessert'],
          image: '🍴'
        },
        {
          id: 2,
          name: 'Fine Dining Experience',
          type: 'fine-dining',
          score: 91,
          description: 'Michelin-starred restaurant with innovative cuisine',
          price: '$$$',
          rating: 4.9,
          specialties: ['Tasting menu', 'Wine pairing', 'Chef special'],
          image: '🍾'
        },
        {
          id: 3,
          name: 'Street Food Adventure',
          type: 'street-food',
          score: 88,
          description: 'Explore local street food culture',
          price: '$',
          rating: 4.6,
          specialties: ['Local snacks', 'Fresh juices', 'Traditional sweets'],
          image: '🌮'
        }
      ]
    };

    const generateRecommendations = useCallback(async () => {
      setIsGenerating(true);
      
      // Simulate AI recommendation generation
      setTimeout(() => {
        const allRecommendations = Object.values(mockRecommendations).flat();
        const filteredRecommendations = allRecommendations
          .filter(rec => {
            if (type === 'mixed') return true;
            return rec.type === type || rec.name?.toLowerCase().includes(type);
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 6);
        
        setRecommendations(filteredRecommendations);
        setIsGenerating(false);
        onRecommendationsGenerated?.(filteredRecommendations);
      }, 2000);
    }, [type, onRecommendationsGenerated]);

    const getRecommendationIcon = (recommendation: any) => {
      if (recommendation.image) return recommendation.image;
      if (recommendation.type === 'culture') return '🏛️';
      if (recommendation.type === 'food') return '🍽️';
      if (recommendation.type === 'nature') return '🌿';
      if (recommendation.type === 'hotel') return '🏨';
      if (recommendation.type === 'bnb') return '🏡';
      if (recommendation.type === 'apartment') return '🏢';
      if (recommendation.type === 'local') return '🍴';
      if (recommendation.type === 'fine-dining') return '🍾';
      if (recommendation.type === 'street-food') return '🌮';
      return '📍';
    };

    const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-green-600 dark:text-green-400';
      if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
      if (score >= 70) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getBudgetColor = (budget: string) => {
      switch (budget.toLowerCase()) {
        case 'low': return 'text-green-600 dark:text-green-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'high': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          travelRecommendationsVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          AI Travel Recommendations
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Travel Preferences
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Budget</label>
                <select
                  value={preferences.budget}
                  onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Style</label>
                <select
                  value={preferences.travelStyle}
                  onChange={(e) => setPreferences(prev => ({ ...prev, travelStyle: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="adventure">Adventure</option>
                  <option value="relaxation">Relaxation</option>
                  <option value="culture">Culture</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</label>
                <select
                  value={preferences.duration}
                  onChange={(e) => setPreferences(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                >
                  <option value="3 days">3 days</option>
                  <option value="7 days">7 days</option>
                  <option value="14 days">14 days</option>
                  <option value="30 days">30 days</option>
                </select>
              </div>
            </div>
          </div>
          
          <button
            onClick={generateRecommendations}
            disabled={isGenerating}
            className="w-full px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Generating Recommendations...' : 'Generate Recommendations'}
          </button>
          
          {recommendations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Recommended Options
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((recommendation) => (
                  <div key={recommendation.id} className="p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getRecommendationIcon(recommendation)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {recommendation.name}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-medium', getScoreColor(recommendation.score))}>
                              {recommendation.score}%
                            </span>
                            {recommendation.rating && (
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                ⭐ {recommendation.rating}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {recommendation.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                          {recommendation.price && (
                            <span className={cn('font-medium', getBudgetColor(recommendation.price))}>
                              {recommendation.price}
                            </span>
                          )}
                          {recommendation.duration && (
                            <span>{recommendation.duration}</span>
                          )}
                          {recommendation.bestTime && (
                            <span>Best: {recommendation.bestTime}</span>
                          )}
                        </div>
                        
                        {recommendation.reasons && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Why we recommend:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {recommendation.reasons.map((reason: string, index: number) => (
                                <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {recommendation.highlights && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              Highlights:
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-500">
                              {recommendation.highlights.join(' • ')}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

TravelRecommendationsEngine.displayName = 'TravelRecommendationsEngine';

// Travel Recommendations Status Component
interface TravelRecommendationsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const TravelRecommendationsStatus = React.forwardRef<HTMLDivElement, TravelRecommendationsStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-rose-500" />
        <span className="font-medium">
          Travel Recommendations: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'AI-powered travel recommendations and suggestions' 
              : 'Basic travel suggestions'
            }
          </div>
        )}
      </div>
    );
  }
);

TravelRecommendationsStatus.displayName = 'TravelRecommendationsStatus';

// Travel Recommendations Demo Component
interface TravelRecommendationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TravelRecommendationsDemo = React.forwardRef<HTMLDivElement, TravelRecommendationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Travel Recommendations Demo</h3>
        
        <TravelRecommendationsEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onRecommendationsGenerated={(recommendations) => console.log('Recommendations generated:', recommendations)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered travel recommendations based on your preferences, interests, and travel style.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TravelRecommendationsDemo.displayName = 'TravelRecommendationsDemo';

// Export all components
export {
  travelRecommendationsVariants,
  type TravelRecommendationsToggleProps,
  type TravelRecommendationsProviderProps,
  type TravelRecommendationsEngineProps,
  type TravelRecommendationsStatusProps,
  type TravelRecommendationsDemoProps
};
