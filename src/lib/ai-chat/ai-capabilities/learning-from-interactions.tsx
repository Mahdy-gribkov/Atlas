/**
 * Learning from Interactions Component
 * 
 * Provides machine learning and adaptation capabilities for AI travel agent.
 * Implements learning algorithms that improve from user interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Learning from Interactions Variants
const learningFromInteractionsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'learning-from-interactions-mode-standard',
        'enhanced': 'learning-from-interactions-mode-enhanced',
        'advanced': 'learning-from-interactions-mode-advanced',
        'custom': 'learning-from-interactions-mode-custom'
      },
      type: {
        'behavioral': 'learning-type-behavioral',
        'preference': 'learning-type-preference',
        'pattern': 'learning-type-pattern',
        'feedback': 'learning-type-feedback',
        'mixed': 'learning-type-mixed'
      },
      style: {
        'minimal': 'learning-style-minimal',
        'moderate': 'learning-style-moderate',
        'detailed': 'learning-style-detailed',
        'custom': 'learning-style-custom'
      },
      format: {
        'text': 'learning-format-text',
        'visual': 'learning-format-visual',
        'interactive': 'learning-format-interactive',
        'mixed': 'learning-format-mixed'
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

// Learning from Interactions Toggle Props
interface LearningFromInteractionsToggleProps extends VariantProps<typeof learningFromInteractionsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Learning from Interactions Toggle Component
export const LearningFromInteractionsToggle = React.forwardRef<HTMLButtonElement, LearningFromInteractionsToggleProps>(
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
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable learning from interactions' : 'Enable learning from interactions'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Learning from interactions enabled' : 'Learning from interactions disabled'}
          </span>
        )}
      </button>
    );
  }
);

LearningFromInteractionsToggle.displayName = 'LearningFromInteractionsToggle';

// Learning from Interactions Provider Props
interface LearningFromInteractionsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'behavioral' | 'preference' | 'pattern' | 'feedback' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Learning from Interactions Provider Component
export const LearningFromInteractionsProvider = React.forwardRef<HTMLDivElement, LearningFromInteractionsProviderProps>(
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
        // Remove existing learning from interactions classes
        document.body.classList.remove(
          'learning-from-interactions-mode-standard',
          'learning-from-interactions-mode-enhanced',
          'learning-from-interactions-mode-advanced',
          'learning-from-interactions-mode-custom'
        );
        
        document.body.classList.add(`learning-from-interactions-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          learningFromInteractionsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LearningFromInteractionsProvider.displayName = 'LearningFromInteractionsProvider';

// Learning from Interactions Engine Component
interface LearningFromInteractionsEngineProps extends VariantProps<typeof learningFromInteractionsVariants> {
  className?: string;
  onLearningUpdate?: (learning: any) => void;
  type?: 'behavioral' | 'preference' | 'pattern' | 'feedback' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const LearningFromInteractionsEngine = React.forwardRef<HTMLDivElement, LearningFromInteractionsEngineProps>(
  ({ 
    className, 
    onLearningUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [learning, setLearning] = useState({
      userProfile: {
        preferences: {
          travelStyle: 'adventure',
          budget: 'medium',
          interests: ['culture', 'nature', 'food'],
          accommodation: 'hotel',
          transportation: 'mixed'
        },
        behavior: {
          bookingPattern: 'advance',
          decisionTime: 'quick',
          riskTolerance: 'moderate',
          socialSharing: 'high'
        },
        patterns: {
          favoriteDestinations: ['Japan', 'Italy', 'Costa Rica'],
          travelFrequency: 'quarterly',
          groupSize: 'couple',
          seasonPreference: 'spring'
        }
      },
      insights: [
        {
          id: 1,
          type: 'preference',
          title: 'Prefers Cultural Experiences',
          confidence: 92,
          description: 'User consistently chooses destinations with rich cultural heritage',
          evidence: ['Selected Kyoto over Tokyo', 'Booked museum tours', 'Asked about local traditions'],
          impact: 'Recommend cultural activities and destinations'
        },
        {
          id: 2,
          type: 'behavioral',
          title: 'Quick Decision Maker',
          confidence: 87,
          description: 'User makes travel decisions quickly without extensive research',
          evidence: ['Booked trip within 2 hours', 'Limited comparison shopping', 'Trusts recommendations'],
          impact: 'Provide concise, confident recommendations'
        },
        {
          id: 3,
          type: 'pattern',
          title: 'Spring Travel Preference',
          confidence: 78,
          description: 'User tends to travel more during spring months',
          evidence: ['3 spring trips in past year', 'Avoids summer travel', 'Prefers mild weather'],
          impact: 'Suggest spring destinations and activities'
        }
      ],
      adaptations: [
        {
          id: 1,
          feature: 'Recommendation Engine',
          change: 'Increased weight for cultural activities',
          effectiveness: 94,
          description: 'Adjusted algorithm to prioritize cultural experiences'
        },
        {
          id: 2,
          feature: 'Response Style',
          change: 'More concise and direct communication',
          effectiveness: 89,
          description: 'Reduced verbose explanations based on user behavior'
        },
        {
          id: 3,
          feature: 'Timing Suggestions',
          change: 'Prioritize spring travel windows',
          effectiveness: 82,
          description: 'Enhanced spring destination recommendations'
        }
      ],
      metrics: {
        learningAccuracy: 89,
        adaptationSuccess: 92,
        userSatisfaction: 4.7,
        totalInteractions: 156,
        learningRate: 'high'
      }
    });

    const [isLearning, setIsLearning] = useState(false);
    const [selectedInsight, setSelectedInsight] = useState<any>(null);

    const simulateLearning = useCallback(async () => {
      setIsLearning(true);
      
      // Simulate learning process
      setTimeout(() => {
        const newInsight = {
          id: Date.now(),
          type: 'preference',
          title: 'Budget-Conscious Traveler',
          confidence: 85,
          description: 'User consistently looks for value and budget-friendly options',
          evidence: ['Compared prices extensively', 'Chose mid-range hotels', 'Asked about discounts'],
          impact: 'Highlight value propositions and budget tips'
        };
        
        setLearning(prev => ({
          ...prev,
          insights: [...prev.insights, newInsight],
          metrics: {
            ...prev.metrics,
            totalInteractions: prev.metrics.totalInteractions + 1,
            learningAccuracy: Math.min(95, prev.metrics.learningAccuracy + 1)
          }
        }));
        
        setIsLearning(false);
        onLearningUpdate?.(newInsight);
      }, 2000);
    }, [onLearningUpdate]);

    const getInsightIcon = (type: string) => {
      switch (type) {
        case 'preference': return '🎯';
        case 'behavioral': return '🧠';
        case 'pattern': return '📊';
        case 'feedback': return '💬';
        default: return '🔍';
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 90) return 'text-green-600 dark:text-green-400';
      if (confidence >= 80) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 70) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getEffectivenessColor = (effectiveness: number) => {
      if (effectiveness >= 90) return 'text-green-600 dark:text-green-400';
      if (effectiveness >= 80) return 'text-yellow-600 dark:text-yellow-400';
      if (effectiveness >= 70) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          learningFromInteractionsVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Learning from Interactions
          </h3>
          <button
            onClick={simulateLearning}
            disabled={isLearning}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLearning ? 'Learning...' : 'Learn Now'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {learning.metrics.learningAccuracy}%
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Learning Accuracy
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {learning.metrics.adaptationSuccess}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Adaptation Success
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {learning.metrics.userSatisfaction}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                User Satisfaction
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {learning.metrics.totalInteractions}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Interactions
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                User Profile
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                  <h5 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Preferences
                  </h5>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div><strong>Style:</strong> {learning.userProfile.preferences.travelStyle}</div>
                    <div><strong>Budget:</strong> {learning.userProfile.preferences.budget}</div>
                    <div><strong>Interests:</strong> {learning.userProfile.preferences.interests.join(', ')}</div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                  <h5 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Behavior
                  </h5>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div><strong>Booking:</strong> {learning.userProfile.behavior.bookingPattern}</div>
                    <div><strong>Decision:</strong> {learning.userProfile.behavior.decisionTime}</div>
                    <div><strong>Risk:</strong> {learning.userProfile.behavior.riskTolerance}</div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                  <h5 className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Patterns
                  </h5>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                    <div><strong>Favorites:</strong> {learning.userProfile.patterns.favoriteDestinations.join(', ')}</div>
                    <div><strong>Frequency:</strong> {learning.userProfile.patterns.travelFrequency}</div>
                    <div><strong>Season:</strong> {learning.userProfile.patterns.seasonPreference}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Learning Insights
              </h4>
              <div className="space-y-3">
                {learning.insights.map((insight) => (
                  <div 
                    key={insight.id} 
                    className="p-3 border border-gray-200 rounded-md dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => setSelectedInsight(insight)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getInsightIcon(insight.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {insight.title}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-medium', getConfidenceColor(insight.confidence))}>
                              {insight.confidence}% confidence
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {insight.description}
                        </p>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          <strong>Impact:</strong> {insight.impact}
                        </div>
                        
                        <div className="mt-2">
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            Evidence:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {insight.evidence.map((item: string, index: number) => (
                              <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                System Adaptations
              </h4>
              <div className="space-y-2">
                {learning.adaptations.map((adaptation) => (
                  <div key={adaptation.id} className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {adaptation.feature}
                      </h5>
                      <span className={cn('text-xs font-medium', getEffectivenessColor(adaptation.effectiveness))}>
                        {adaptation.effectiveness}% effective
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {adaptation.description}
                    </p>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      <strong>Change:</strong> {adaptation.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedInsight && (
              <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Insight Details
                </h4>
                <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                  <div><strong>Type:</strong> {selectedInsight.type}</div>
                  <div><strong>Confidence:</strong> {selectedInsight.confidence}%</div>
                  <div><strong>Description:</strong> {selectedInsight.description}</div>
                  <div><strong>Impact:</strong> {selectedInsight.impact}</div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="mt-2 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

LearningFromInteractionsEngine.displayName = 'LearningFromInteractionsEngine';

// Learning from Interactions Status Component
interface LearningFromInteractionsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const LearningFromInteractionsStatus = React.forwardRef<HTMLDivElement, LearningFromInteractionsStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <span className="font-medium">
          Learning from Interactions: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Machine learning and adaptive AI capabilities' 
              : 'Static AI responses'
            }
          </div>
        )}
      </div>
    );
  }
);

LearningFromInteractionsStatus.displayName = 'LearningFromInteractionsStatus';

// Learning from Interactions Demo Component
interface LearningFromInteractionsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const LearningFromInteractionsDemo = React.forwardRef<HTMLDivElement, LearningFromInteractionsDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Learning from Interactions Demo</h3>
        
        <LearningFromInteractionsEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onLearningUpdate={(learning) => console.log('Learning updated:', learning)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI that learns and adapts from user interactions to provide personalized experiences.
            </p>
          </div>
        )}
      </div>
    );
  }
);

LearningFromInteractionsDemo.displayName = 'LearningFromInteractionsDemo';

// Export all components
export {
  learningFromInteractionsVariants,
  type LearningFromInteractionsToggleProps,
  type LearningFromInteractionsProviderProps,
  type LearningFromInteractionsEngineProps,
  type LearningFromInteractionsStatusProps,
  type LearningFromInteractionsDemoProps
};
