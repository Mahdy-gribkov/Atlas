/**
 * Predictive Suggestions Component
 * 
 * Provides proactive recommendations and predictive suggestions for travel planning.
 * Implements advanced prediction algorithms for travel agent interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Predictive Suggestions Variants
const predictiveSuggestionsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'predictive-suggestions-mode-standard',
        'enhanced': 'predictive-suggestions-mode-enhanced',
        'advanced': 'predictive-suggestions-mode-advanced',
        'custom': 'predictive-suggestions-mode-custom'
      },
      type: {
        'destinations': 'predictions-type-destinations',
        'activities': 'predictions-type-activities',
        'timing': 'predictions-type-timing',
        'deals': 'predictions-type-deals',
        'mixed': 'predictions-type-mixed'
      },
      style: {
        'minimal': 'predictions-style-minimal',
        'moderate': 'predictions-style-moderate',
        'detailed': 'predictions-style-detailed',
        'custom': 'predictions-style-custom'
      },
      format: {
        'text': 'predictions-format-text',
        'visual': 'predictions-format-visual',
        'interactive': 'predictions-format-interactive',
        'mixed': 'predictions-format-mixed'
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

// Predictive Suggestions Toggle Props
interface PredictiveSuggestionsToggleProps extends VariantProps<typeof predictiveSuggestionsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Predictive Suggestions Toggle Component
export const PredictiveSuggestionsToggle = React.forwardRef<HTMLButtonElement, PredictiveSuggestionsToggleProps>(
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
            ? 'bg-indigo-600 text-white border-indigo-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable predictive suggestions' : 'Enable predictive suggestions'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Predictive suggestions enabled' : 'Predictive suggestions disabled'}
          </span>
        )}
      </button>
    );
  }
);

PredictiveSuggestionsToggle.displayName = 'PredictiveSuggestionsToggle';

// Predictive Suggestions Provider Props
interface PredictiveSuggestionsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'destinations' | 'activities' | 'timing' | 'deals' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Predictive Suggestions Provider Component
export const PredictiveSuggestionsProvider = React.forwardRef<HTMLDivElement, PredictiveSuggestionsProviderProps>(
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
        // Remove existing predictive suggestions classes
        document.body.classList.remove(
          'predictive-suggestions-mode-standard',
          'predictive-suggestions-mode-enhanced',
          'predictive-suggestions-mode-advanced',
          'predictive-suggestions-mode-custom'
        );
        
        document.body.classList.add(`predictive-suggestions-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          predictiveSuggestionsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PredictiveSuggestionsProvider.displayName = 'PredictiveSuggestionsProvider';

// Predictive Suggestions Engine Component
interface PredictiveSuggestionsEngineProps extends VariantProps<typeof predictiveSuggestionsVariants> {
  className?: string;
  onSuggestionsGenerated?: (suggestions: any) => void;
  type?: 'destinations' | 'activities' | 'timing' | 'deals' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const PredictiveSuggestionsEngine = React.forwardRef<HTMLDivElement, PredictiveSuggestionsEngineProps>(
  ({ 
    className, 
    onSuggestionsGenerated,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [suggestions, setSuggestions] = useState({
      destinations: [
        {
          id: 1,
          name: 'Reykjavik, Iceland',
          prediction: 'Perfect for your next trip',
          confidence: 94,
          reasons: ['Northern Lights season', 'Matches your adventure style', 'Great deals available'],
          timing: 'Next 2 weeks',
          price: '$1,200',
          image: '🏔️',
          urgency: 'high'
        },
        {
          id: 2,
          name: 'Lisbon, Portugal',
          prediction: 'Highly recommended',
          confidence: 89,
          reasons: ['Spring weather perfect', 'Cultural attractions', 'Budget-friendly'],
          timing: 'Next month',
          price: '$800',
          image: '🏛️',
          urgency: 'medium'
        },
        {
          id: 3,
          name: 'Bali, Indonesia',
          prediction: 'Great timing',
          confidence: 85,
          reasons: ['Dry season starting', 'Beach weather', 'Cultural experiences'],
          timing: 'Next 3 months',
          price: '$1,500',
          image: '🏝️',
          urgency: 'low'
        }
      ],
      activities: [
        {
          id: 1,
          name: 'Food Tour in Tokyo',
          prediction: 'Perfect match',
          confidence: 92,
          reasons: ['Matches your food interest', 'Spring cherry blossom season', 'Great reviews'],
          timing: 'Next 2 weeks',
          price: '$85',
          image: '🍣',
          urgency: 'high'
        },
        {
          id: 2,
          name: 'Hiking in Patagonia',
          prediction: 'Adventure awaits',
          confidence: 88,
          reasons: ['Peak hiking season', 'Matches adventure style', 'Limited availability'],
          timing: 'Next month',
          price: '$450',
          image: '🥾',
          urgency: 'medium'
        },
        {
          id: 3,
          name: 'Wine Tasting in Tuscany',
          prediction: 'Romantic getaway',
          confidence: 86,
          reasons: ['Perfect for couples', 'Harvest season', 'Beautiful scenery'],
          timing: 'Next 3 months',
          price: '$120',
          image: '🍷',
          urgency: 'low'
        }
      ],
      deals: [
        {
          id: 1,
          name: 'Paris Hotel Deal',
          prediction: 'Limited time offer',
          confidence: 96,
          reasons: ['40% off luxury hotels', 'Spring promotion', 'Perfect timing'],
          timing: 'Expires in 3 days',
          price: '$180/night',
          originalPrice: '$300/night',
          image: '🏨',
          urgency: 'high'
        },
        {
          id: 2,
          name: 'Flight to Barcelona',
          prediction: 'Price drop expected',
          confidence: 78,
          reasons: ['Seasonal pricing', 'Demand patterns', 'Historical data'],
          timing: 'Book within 1 week',
          price: '$450',
          originalPrice: '$650',
          image: '✈️',
          urgency: 'medium'
        },
        {
          id: 3,
          name: 'Caribbean Cruise',
          prediction: 'Early bird special',
          confidence: 82,
          reasons: ['Early booking discount', 'Peak season approaching', 'Limited cabins'],
          timing: 'Book within 2 weeks',
          price: '$1,200',
          originalPrice: '$1,800',
          image: '🚢',
          urgency: 'medium'
        }
      ],
      timing: [
        {
          id: 1,
          prediction: 'Best time to visit Japan',
          confidence: 91,
          reason: 'Cherry blossom season starting',
          recommendation: 'Book flights now for April travel',
          urgency: 'high',
          image: '🌸'
        },
        {
          id: 2,
          prediction: 'Avoid Europe in July',
          confidence: 87,
          reason: 'Peak tourist season',
          recommendation: 'Consider May or September instead',
          urgency: 'medium',
          image: '🌍'
        },
        {
          id: 3,
          prediction: 'Perfect time for New Zealand',
          confidence: 84,
          reason: 'Autumn colors and mild weather',
          recommendation: 'Plan for March-April',
          urgency: 'low',
          image: '🍂'
        }
      ]
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const generateSuggestions = useCallback(async () => {
      setIsGenerating(true);
      
      // Simulate AI prediction generation
      setTimeout(() => {
        setIsGenerating(false);
        onSuggestionsGenerated?.(suggestions);
      }, 2000);
    }, [suggestions, onSuggestionsGenerated]);

    const getUrgencyColor = (urgency: string) => {
      switch (urgency) {
        case 'high': return 'text-red-600 dark:text-red-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'low': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getUrgencyIcon = (urgency: string) => {
      switch (urgency) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '⚪';
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 90) return 'text-green-600 dark:text-green-400';
      if (confidence >= 80) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 70) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getAllSuggestions = () => {
      return [
        ...suggestions.destinations.map(item => ({ ...item, category: 'destinations' })),
        ...suggestions.activities.map(item => ({ ...item, category: 'activities' })),
        ...suggestions.deals.map(item => ({ ...item, category: 'deals' })),
        ...suggestions.timing.map(item => ({ ...item, category: 'timing' }))
      ];
    };

    const filteredSuggestions = selectedCategory === 'all' 
      ? getAllSuggestions() 
      : suggestions[selectedCategory as keyof typeof suggestions] || [];

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          predictiveSuggestionsVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Predictive Suggestions
          </h3>
          <button
            onClick={generateSuggestions}
            disabled={isGenerating}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isGenerating ? 'Analyzing...' : 'Generate Predictions'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Filter Suggestions
            </h4>
            <div className="flex flex-wrap gap-2">
              {['all', 'destinations', 'activities', 'deals', 'timing'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-3 py-1 text-sm rounded-md transition-all duration-200',
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                  )}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {Array.isArray(filteredSuggestions) && filteredSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="p-4 border border-gray-200 rounded-lg dark:border-gray-600">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{suggestion.image}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {suggestion.name || suggestion.prediction}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className={cn('text-xs font-medium', getConfidenceColor(suggestion.confidence))}>
                          {suggestion.confidence}%
                        </span>
                        <span className={cn('text-xs', getUrgencyColor(suggestion.urgency))}>
                          {getUrgencyIcon(suggestion.urgency)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {suggestion.prediction || suggestion.reason}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-2">
                      {suggestion.timing && (
                        <span><strong>Timing:</strong> {suggestion.timing}</span>
                      )}
                      {suggestion.price && (
                        <span><strong>Price:</strong> {suggestion.price}</span>
                      )}
                      {suggestion.originalPrice && (
                        <span className="line-through">{suggestion.originalPrice}</span>
                      )}
                    </div>
                    
                    {suggestion.reasons && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Why we predict this:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.reasons.map((reason: string, index: number) => (
                            <span key={index} className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {suggestion.recommendation && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Recommendation:
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {suggestion.recommendation}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        Book Now
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500">
                        Save for Later
                      </button>
                      <button className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500">
                        Not Interested
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-indigo-50 rounded-lg dark:bg-indigo-900/20">
            <h4 className="text-sm font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
              Prediction Insights
            </h4>
            <div className="text-sm text-indigo-600 dark:text-indigo-400 space-y-1">
              <div>• Based on your travel history and preferences</div>
              <div>• Analyzed seasonal patterns and pricing trends</div>
              <div>• Considered current market conditions and availability</div>
              <div>• Updated in real-time as new data becomes available</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PredictiveSuggestionsEngine.displayName = 'PredictiveSuggestionsEngine';

// Predictive Suggestions Status Component
interface PredictiveSuggestionsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const PredictiveSuggestionsStatus = React.forwardRef<HTMLDivElement, PredictiveSuggestionsStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-indigo-500" />
        <span className="font-medium">
          Predictive Suggestions: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Proactive recommendations and predictions' 
              : 'Reactive suggestions only'
            }
          </div>
        )}
      </div>
    );
  }
);

PredictiveSuggestionsStatus.displayName = 'PredictiveSuggestionsStatus';

// Predictive Suggestions Demo Component
interface PredictiveSuggestionsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PredictiveSuggestionsDemo = React.forwardRef<HTMLDivElement, PredictiveSuggestionsDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Predictive Suggestions Demo</h3>
        
        <PredictiveSuggestionsEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onSuggestionsGenerated={(suggestions) => console.log('Suggestions generated:', suggestions)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered predictive suggestions based on your preferences, travel patterns, and market data.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PredictiveSuggestionsDemo.displayName = 'PredictiveSuggestionsDemo';

// Export all components
export {
  predictiveSuggestionsVariants,
  type PredictiveSuggestionsToggleProps,
  type PredictiveSuggestionsProviderProps,
  type PredictiveSuggestionsEngineProps,
  type PredictiveSuggestionsStatusProps,
  type PredictiveSuggestionsDemoProps
};
