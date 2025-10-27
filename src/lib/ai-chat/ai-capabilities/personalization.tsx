/**
 * Personalization Component
 * 
 * Provides personalized experiences and customized recommendations for travel planning.
 * Implements advanced personalization algorithms for travel agent interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Personalization Variants
const personalizationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'personalization-mode-standard',
        'enhanced': 'personalization-mode-enhanced',
        'advanced': 'personalization-mode-advanced',
        'custom': 'personalization-mode-custom'
      },
      type: {
        'content': 'personalization-type-content',
        'interface': 'personalization-type-interface',
        'recommendations': 'personalization-type-recommendations',
        'communication': 'personalization-type-communication',
        'mixed': 'personalization-type-mixed'
      },
      style: {
        'minimal': 'personalization-style-minimal',
        'moderate': 'personalization-style-moderate',
        'detailed': 'personalization-style-detailed',
        'custom': 'personalization-style-custom'
      },
      format: {
        'text': 'personalization-format-text',
        'visual': 'personalization-format-visual',
        'interactive': 'personalization-format-interactive',
        'mixed': 'personalization-format-mixed'
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

// Personalization Toggle Props
interface PersonalizationToggleProps extends VariantProps<typeof personalizationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Personalization Toggle Component
export const PersonalizationToggle = React.forwardRef<HTMLButtonElement, PersonalizationToggleProps>(
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
            ? 'bg-pink-600 text-white border-pink-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable personalization' : 'Enable personalization'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Personalization enabled' : 'Personalization disabled'}
          </span>
        )}
      </button>
    );
  }
);

PersonalizationToggle.displayName = 'PersonalizationToggle';

// Personalization Provider Props
interface PersonalizationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'content' | 'interface' | 'recommendations' | 'communication' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Personalization Provider Component
export const PersonalizationProvider = React.forwardRef<HTMLDivElement, PersonalizationProviderProps>(
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
        // Remove existing personalization classes
        document.body.classList.remove(
          'personalization-mode-standard',
          'personalization-mode-enhanced',
          'personalization-mode-advanced',
          'personalization-mode-custom'
        );
        
        document.body.classList.add(`personalization-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          personalizationVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PersonalizationProvider.displayName = 'PersonalizationProvider';

// Personalization Engine Component
interface PersonalizationEngineProps extends VariantProps<typeof personalizationVariants> {
  className?: string;
  onPersonalizationUpdate?: (personalization: any) => void;
  type?: 'content' | 'interface' | 'recommendations' | 'communication' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const PersonalizationEngine = React.forwardRef<HTMLDivElement, PersonalizationEngineProps>(
  ({ 
    className, 
    onPersonalizationUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [personalization, setPersonalization] = useState({
      userProfile: {
        demographics: {
          age: '28-35',
          location: 'San Francisco',
          occupation: 'Software Engineer',
          income: 'High',
          family: 'Couple'
        },
        preferences: {
          travelStyle: 'Adventure & Culture',
          budget: 'Premium',
          interests: ['Technology', 'Food', 'Nature', 'Art'],
          accommodation: 'Boutique Hotels',
          transportation: 'Premium',
          activities: 'Unique Experiences'
        },
        behavior: {
          bookingWindow: '2-3 months',
          tripDuration: '7-10 days',
          groupSize: '2 people',
          seasonPreference: 'Spring/Fall',
          riskTolerance: 'Moderate'
        }
      },
      customization: {
        interface: {
          theme: 'dark',
          layout: 'compact',
          language: 'English',
          currency: 'USD',
          timezone: 'PST'
        },
        content: {
          detailLevel: 'comprehensive',
          mediaPreference: 'high-quality',
          notificationFrequency: 'moderate',
          emailDigest: 'weekly'
        },
        communication: {
          tone: 'professional-friendly',
          formality: 'casual',
          responseLength: 'detailed',
          emojiUsage: 'moderate'
        }
      },
      recommendations: {
        destinations: [
          { name: 'Tokyo, Japan', score: 95, reason: 'Perfect blend of tech and culture' },
          { name: 'Reykjavik, Iceland', score: 92, reason: 'Unique adventure experiences' },
          { name: 'Melbourne, Australia', score: 89, reason: 'Food scene and urban culture' }
        ],
        activities: [
          { name: 'Tech Museum Tours', score: 94, reason: 'Matches your tech interest' },
          { name: 'Food Experiences', score: 91, reason: 'High food interest score' },
          { name: 'Nature Adventures', score: 88, reason: 'Adventure travel style' }
        ],
        accommodations: [
          { name: 'Boutique Hotels', score: 96, reason: 'Your preferred accommodation type' },
          { name: 'Design Hotels', score: 93, reason: 'Matches your aesthetic preferences' },
          { name: 'Luxury Resorts', score: 87, reason: 'Premium budget preference' }
        ]
      },
      metrics: {
        personalizationScore: 94,
        accuracyRate: 91,
        userSatisfaction: 4.8,
        engagementIncrease: 23,
        conversionRate: 18
      }
    });

    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('profile');

    const updatePersonalization = useCallback(async () => {
      setIsUpdating(true);
      
      // Simulate personalization update
      setTimeout(() => {
        setPersonalization(prev => ({
          ...prev,
          metrics: {
            ...prev.metrics,
            personalizationScore: Math.min(98, prev.metrics.personalizationScore + 1),
            accuracyRate: Math.min(95, prev.metrics.accuracyRate + 1)
          }
        }));
        
        setIsUpdating(false);
        onPersonalizationUpdate?.(personalization);
      }, 2000);
    }, [personalization, onPersonalizationUpdate]);

    const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-green-600 dark:text-green-400';
      if (score >= 80) return 'text-yellow-600 dark:text-yellow-400';
      if (score >= 70) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getPreferenceIcon = (preference: string) => {
      switch (preference.toLowerCase()) {
        case 'adventure': return '🏔️';
        case 'culture': return '🏛️';
        case 'food': return '🍽️';
        case 'nature': return '🌿';
        case 'art': return '🎨';
        case 'technology': return '💻';
        case 'luxury': return '💎';
        case 'budget': return '💰';
        default: return '⭐';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          personalizationVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Personalization Engine
          </h3>
          <button
            onClick={updatePersonalization}
            disabled={isUpdating}
            className="px-3 py-1 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-pink-50 rounded-md dark:bg-pink-900/20">
              <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {personalization.metrics.personalizationScore}%
              </div>
              <div className="text-sm text-pink-600 dark:text-pink-400">
                Personalization Score
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {personalization.metrics.accuracyRate}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Accuracy Rate
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {personalization.metrics.userSatisfaction}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                User Satisfaction
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                +{personalization.metrics.engagementIncrease}%
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Engagement Increase
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Personalization Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {['profile', 'customization', 'recommendations'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-md transition-all duration-200',
                    selectedCategory === category
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                  )}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {selectedCategory === 'profile' && (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Demographics
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(personalization.userProfile.demographics).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Travel Preferences
                  </h5>
                  <div className="space-y-2">
                    {Object.entries(personalization.userProfile.preferences).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{getPreferenceIcon(key)}</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {Array.isArray(value) ? value.join(', ') : value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Travel Behavior
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(personalization.userProfile.behavior).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {selectedCategory === 'customization' && (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Interface Customization
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(personalization.customization.interface).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Content Preferences
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(personalization.customization.content).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Communication Style
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(personalization.customization.communication).map(([key, value]) => (
                      <div key={key} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {selectedCategory === 'recommendations' && (
              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Personalized Destinations
                  </h5>
                  <div className="space-y-2">
                    {personalization.recommendations.destinations.map((dest, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🗺️</span>
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {dest.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {dest.reason}
                            </div>
                          </div>
                        </div>
                        <span className={cn('text-sm font-medium', getScoreColor(dest.score))}>
                          {dest.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Personalized Activities
                  </h5>
                  <div className="space-y-2">
                    {personalization.recommendations.activities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🎯</span>
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {activity.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {activity.reason}
                            </div>
                          </div>
                        </div>
                        <span className={cn('text-sm font-medium', getScoreColor(activity.score))}>
                          {activity.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Personalized Accommodations
                  </h5>
                  <div className="space-y-2">
                    {personalization.recommendations.accommodations.map((accommodation, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">🏨</span>
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {accommodation.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {accommodation.reason}
                            </div>
                          </div>
                        </div>
                        <span className={cn('text-sm font-medium', getScoreColor(accommodation.score))}>
                          {accommodation.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

PersonalizationEngine.displayName = 'PersonalizationEngine';

// Personalization Status Component
interface PersonalizationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const PersonalizationStatus = React.forwardRef<HTMLDivElement, PersonalizationStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-pink-500" />
        <span className="font-medium">
          Personalization: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Customized experiences and recommendations' 
              : 'Generic recommendations'
            }
          </div>
        )}
      </div>
    );
  }
);

PersonalizationStatus.displayName = 'PersonalizationStatus';

// Personalization Demo Component
interface PersonalizationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PersonalizationDemo = React.forwardRef<HTMLDivElement, PersonalizationDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Personalization Demo</h3>
        
        <PersonalizationEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onPersonalizationUpdate={(personalization) => console.log('Personalization updated:', personalization)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered personalization that adapts to your preferences, behavior, and travel patterns.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PersonalizationDemo.displayName = 'PersonalizationDemo';

// Export all components
export {
  personalizationVariants,
  type PersonalizationToggleProps,
  type PersonalizationProviderProps,
  type PersonalizationEngineProps,
  type PersonalizationStatusProps,
  type PersonalizationDemoProps
};
