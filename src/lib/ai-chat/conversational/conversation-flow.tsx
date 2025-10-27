/**
 * Conversation Flow Component
 * 
 * Provides conversation flow support for AI chat interface.
 * Implements advanced conversation management for travel agent interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Conversation Flow Variants
const conversationFlowVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'conversation-flow-mode-standard',
        'enhanced': 'conversation-flow-mode-enhanced',
        'advanced': 'conversation-flow-mode-advanced',
        'custom': 'conversation-flow-mode-custom'
      },
      type: {
        'linear': 'flow-type-linear',
        'branching': 'flow-type-branching',
        'adaptive': 'flow-type-adaptive',
        'contextual': 'flow-type-contextual',
        'mixed': 'flow-type-mixed'
      },
      style: {
        'minimal': 'flow-style-minimal',
        'moderate': 'flow-style-moderate',
        'detailed': 'flow-style-detailed',
        'custom': 'flow-style-custom'
      },
      format: {
        'text': 'flow-format-text',
        'visual': 'flow-format-visual',
        'interactive': 'flow-format-interactive',
        'mixed': 'flow-format-mixed'
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

// Conversation Flow Toggle Props
interface ConversationFlowToggleProps extends VariantProps<typeof conversationFlowVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Conversation Flow Toggle Component
export const ConversationFlowToggle = React.forwardRef<HTMLButtonElement, ConversationFlowToggleProps>(
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
        aria-label={isEnabled ? 'Disable conversation flow' : 'Enable conversation flow'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Conversation flow enabled' : 'Conversation flow disabled'}
          </span>
        )}
      </button>
    );
  }
);

ConversationFlowToggle.displayName = 'ConversationFlowToggle';

// Conversation Flow Provider Props
interface ConversationFlowProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'linear' | 'branching' | 'adaptive' | 'contextual' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Conversation Flow Provider Component
export const ConversationFlowProvider = React.forwardRef<HTMLDivElement, ConversationFlowProviderProps>(
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
        // Remove existing conversation flow classes
        document.body.classList.remove(
          'conversation-flow-mode-standard',
          'conversation-flow-mode-enhanced',
          'conversation-flow-mode-advanced',
          'conversation-flow-mode-custom'
        );
        
        document.body.classList.add(`conversation-flow-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          conversationFlowVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ConversationFlowProvider.displayName = 'ConversationFlowProvider';

// Conversation Flow Manager Component
interface ConversationFlowManagerProps extends VariantProps<typeof conversationFlowVariants> {
  className?: string;
  onFlowUpdate?: (flow: any) => void;
  type?: 'linear' | 'branching' | 'adaptive' | 'contextual' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const ConversationFlowManager = React.forwardRef<HTMLDivElement, ConversationFlowManagerProps>(
  ({ 
    className, 
    onFlowUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [flow, setFlow] = useState({
      currentState: 'greeting',
      states: {
        greeting: {
          name: 'Greeting',
          description: 'Initial welcome and introduction',
          nextStates: ['needs_assessment', 'quick_question'],
          transitions: ['user_intent_identified', 'user_preference_shared']
        },
        needs_assessment: {
          name: 'Needs Assessment',
          description: 'Understanding user travel requirements',
          nextStates: ['destination_selection', 'budget_discussion'],
          transitions: ['destination_chosen', 'budget_shared']
        },
        destination_selection: {
          name: 'Destination Selection',
          description: 'Helping user choose travel destination',
          nextStates: ['itinerary_planning', 'accommodation_search'],
          transitions: ['destination_confirmed', 'alternative_requested']
        },
        itinerary_planning: {
          name: 'Itinerary Planning',
          description: 'Creating detailed travel itinerary',
          nextStates: ['booking_assistance', 'customization'],
          transitions: ['itinerary_approved', 'modifications_requested']
        },
        booking_assistance: {
          name: 'Booking Assistance',
          description: 'Helping with reservations and bookings',
          nextStates: ['confirmation', 'support'],
          transitions: ['booking_completed', 'help_requested']
        }
      },
      history: [],
      currentPath: ['greeting'],
      flowMetrics: {
        totalTransitions: 0,
        averageResponseTime: 0,
        userSatisfaction: 0,
        completionRate: 0
      }
    });

    const [isActive, setIsActive] = useState(false);

    const transitionToState = useCallback((newState: string) => {
      setFlow(prev => ({
        ...prev,
        currentState: newState,
        currentPath: [...prev.currentPath, newState],
        history: [...prev.history, {
          from: prev.currentState,
          to: newState,
          timestamp: new Date().toISOString(),
          transition: 'user_action'
        }],
        flowMetrics: {
          ...prev.flowMetrics,
          totalTransitions: prev.flowMetrics.totalTransitions + 1
        }
      }));
      onFlowUpdate?.(flow);
    }, [flow, onFlowUpdate]);

    const getStateIcon = (stateName: string) => {
      switch (stateName) {
        case 'greeting': return '👋';
        case 'needs_assessment': return '❓';
        case 'destination_selection': return '🗺️';
        case 'itinerary_planning': return '📋';
        case 'booking_assistance': return '💳';
        case 'confirmation': return '✅';
        case 'support': return '🆘';
        default: return '💬';
      }
    };

    const getStateColor = (stateName: string) => {
      switch (stateName) {
        case 'greeting': return 'text-blue-600 dark:text-blue-400';
        case 'needs_assessment': return 'text-green-600 dark:text-green-400';
        case 'destination_selection': return 'text-purple-600 dark:text-purple-400';
        case 'itinerary_planning': return 'text-orange-600 dark:text-orange-400';
        case 'booking_assistance': return 'text-red-600 dark:text-red-400';
        case 'confirmation': return 'text-emerald-600 dark:text-emerald-400';
        case 'support': return 'text-pink-600 dark:text-pink-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getFlowTypeIcon = (flowType: string) => {
      switch (flowType) {
        case 'linear': return '➡️';
        case 'branching': return '🌳';
        case 'adaptive': return '🔄';
        case 'contextual': return '🎯';
        case 'mixed': return '🔀';
        default: return '💬';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          conversationFlowVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Conversation Flow
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getFlowTypeIcon(type)}</span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={cn(
                'px-3 py-1 text-sm rounded-md transition-colors duration-200',
                isActive 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
              )}
            >
              {isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {flow.flowMetrics.totalTransitions}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Transitions
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {flow.currentPath.length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                States
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {flow.flowMetrics.completionRate}%
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Completion
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {flow.flowMetrics.userSatisfaction}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Satisfaction
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Current State
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getStateIcon(flow.currentState)}</span>
                  <span className={cn('text-sm font-semibold', getStateColor(flow.currentState))}>
                    {flow.states[flow.currentState as keyof typeof flow.states]?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {flow.states[flow.currentState as keyof typeof flow.states]?.description}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Available Transitions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {flow.states[flow.currentState as keyof typeof flow.states]?.nextStates.map((nextState) => (
                  <button
                    key={nextState}
                    onClick={() => transitionToState(nextState)}
                    className="p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getStateIcon(nextState)}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {flow.states[nextState as keyof typeof flow.states]?.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Flow Path
              </h4>
              <div className="flex items-center gap-2 overflow-x-auto">
                {flow.currentPath.map((state, index) => (
                  <React.Fragment key={state}>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md dark:bg-gray-700">
                      <span className="text-sm">{getStateIcon(state)}</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {flow.states[state as keyof typeof flow.states]?.name}
                      </span>
                    </div>
                    {index < flow.currentPath.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFlow(prev => ({ ...prev, currentState: 'greeting', currentPath: ['greeting'] }))}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Reset Flow
              </button>
              <button
                onClick={() => setFlow(prev => ({ ...prev, flowMetrics: { ...prev.flowMetrics, completionRate: 85, userSatisfaction: 92 } }))}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update Metrics
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConversationFlowManager.displayName = 'ConversationFlowManager';

// Conversation Flow Status Component
interface ConversationFlowStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ConversationFlowStatus = React.forwardRef<HTMLDivElement, ConversationFlowStatusProps>(
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
          Conversation Flow: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced conversation flow management' 
              : 'Basic conversation tracking'
            }
          </div>
        )}
      </div>
    );
  }
);

ConversationFlowStatus.displayName = 'ConversationFlowStatus';

// Conversation Flow Demo Component
interface ConversationFlowDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ConversationFlowDemo = React.forwardRef<HTMLDivElement, ConversationFlowDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Conversation Flow Demo</h3>
        
        <ConversationFlowManager
          mode="enhanced"
          type="adaptive"
          style="detailed"
          onFlowUpdate={(flow) => console.log('Flow updated:', flow)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced conversation flow management for guiding users through travel planning conversations.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ConversationFlowDemo.displayName = 'ConversationFlowDemo';

// Export all components
export {
  conversationFlowVariants,
  type ConversationFlowToggleProps,
  type ConversationFlowProviderProps,
  type ConversationFlowManagerProps,
  type ConversationFlowStatusProps,
  type ConversationFlowDemoProps
};
