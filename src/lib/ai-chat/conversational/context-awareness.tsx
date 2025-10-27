/**
 * Context Awareness Component
 * 
 * Provides context awareness support for AI chat interface.
 * Implements advanced context management for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Context Awareness Variants
const contextAwarenessVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'context-awareness-mode-standard',
        'enhanced': 'context-awareness-mode-enhanced',
        'advanced': 'context-awareness-mode-advanced',
        'custom': 'context-awareness-mode-custom'
      },
      type: {
        'conversation': 'context-type-conversation',
        'user': 'context-type-user',
        'session': 'context-type-session',
        'environment': 'context-type-environment',
        'mixed': 'context-type-mixed'
      },
      style: {
        'minimal': 'context-style-minimal',
        'moderate': 'context-style-moderate',
        'detailed': 'context-style-detailed',
        'custom': 'context-style-custom'
      },
      format: {
        'text': 'context-format-text',
        'visual': 'context-format-visual',
        'interactive': 'context-format-interactive',
        'mixed': 'context-format-mixed'
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

// Context Awareness Toggle Props
interface ContextAwarenessToggleProps extends VariantProps<typeof contextAwarenessVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Context Awareness Toggle Component
export const ContextAwarenessToggle = React.forwardRef<HTMLButtonElement, ContextAwarenessToggleProps>(
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
            ? 'bg-green-600 text-white border-green-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable context awareness' : 'Enable context awareness'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Context awareness enabled' : 'Context awareness disabled'}
          </span>
        )}
      </button>
    );
  }
);

ContextAwarenessToggle.displayName = 'ContextAwarenessToggle';

// Context Awareness Provider Props
interface ContextAwarenessProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'conversation' | 'user' | 'session' | 'environment' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Context Awareness Provider Component
export const ContextAwarenessProvider = React.forwardRef<HTMLDivElement, ContextAwarenessProviderProps>(
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
        // Remove existing context awareness classes
        document.body.classList.remove(
          'context-awareness-mode-standard',
          'context-awareness-mode-enhanced',
          'context-awareness-mode-advanced',
          'context-awareness-mode-custom'
        );
        
        document.body.classList.add(`context-awareness-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          contextAwarenessVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContextAwarenessProvider.displayName = 'ContextAwarenessProvider';

// Context Manager Component
interface ContextManagerProps extends VariantProps<typeof contextAwarenessVariants> {
  className?: string;
  onContextUpdate?: (context: any) => void;
  type?: 'conversation' | 'user' | 'session' | 'environment' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const ContextManager = React.forwardRef<HTMLDivElement, ContextManagerProps>(
  ({ 
    className, 
    onContextUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [context, setContext] = useState({
      conversation: {
        history: [],
        currentTopic: 'travel_planning',
        userPreferences: {},
        sessionData: {}
      },
      user: {
        profile: {
          name: 'Traveler',
          preferences: {
            budget: 'medium',
            travelStyle: 'adventure',
            interests: ['culture', 'food', 'nature']
          },
          history: []
        }
      },
      session: {
        startTime: new Date().toISOString(),
        duration: 0,
        interactions: 0,
        currentGoal: 'plan_trip'
      },
      environment: {
        location: 'unknown',
        timezone: 'UTC',
        device: 'desktop',
        language: 'en'
      }
    });

    const [isActive, setIsActive] = useState(false);

    const updateContext = useCallback((newContext: any) => {
      setContext(prev => ({
        ...prev,
        ...newContext
      }));
      onContextUpdate?.(newContext);
    }, [onContextUpdate]);

    const addConversationEntry = useCallback((entry: any) => {
      setContext(prev => ({
        ...prev,
        conversation: {
          ...prev.conversation,
          history: [...prev.conversation.history, entry]
        }
      }));
    }, []);

    const updateUserPreferences = useCallback((preferences: any) => {
      setContext(prev => ({
        ...prev,
        user: {
          ...prev.user,
          profile: {
            ...prev.user.profile,
            preferences: {
              ...prev.user.profile.preferences,
              ...preferences
            }
          }
        }
      }));
    }, []);

    const getContextSummary = () => {
      return {
        conversationLength: context.conversation.history.length,
        userPreferences: Object.keys(context.user.profile.preferences).length,
        sessionDuration: Math.floor((Date.now() - new Date(context.session.startTime).getTime()) / 1000),
        currentTopic: context.conversation.currentTopic
      };
    };

    const summary = getContextSummary();

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          contextAwarenessVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Context Awareness
          </h3>
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors duration-200',
              isActive 
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {summary.conversationLength}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Messages
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {summary.userPreferences}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Preferences
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {summary.sessionDuration}s
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Duration
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                {summary.currentTopic.replace('_', ' ')}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Topic
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Conversation Context
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="mb-1">
                    <strong>Current Topic:</strong> {context.conversation.currentTopic.replace('_', ' ')}
                  </div>
                  <div className="mb-1">
                    <strong>Messages:</strong> {context.conversation.history.length}
                  </div>
                  <div>
                    <strong>User Preferences:</strong> {Object.keys(context.user.profile.preferences).join(', ')}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                User Profile
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="mb-1">
                    <strong>Name:</strong> {context.user.profile.name}
                  </div>
                  <div className="mb-1">
                    <strong>Budget:</strong> {context.user.profile.preferences.budget}
                  </div>
                  <div className="mb-1">
                    <strong>Travel Style:</strong> {context.user.profile.preferences.travelStyle}
                  </div>
                  <div>
                    <strong>Interests:</strong> {context.user.profile.preferences.interests.join(', ')}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Session Information
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <div className="mb-1">
                    <strong>Start Time:</strong> {new Date(context.session.startTime).toLocaleTimeString()}
                  </div>
                  <div className="mb-1">
                    <strong>Duration:</strong> {summary.sessionDuration} seconds
                  </div>
                  <div className="mb-1">
                    <strong>Interactions:</strong> {context.session.interactions}
                  </div>
                  <div>
                    <strong>Current Goal:</strong> {context.session.currentGoal.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ContextManager.displayName = 'ContextManager';

// Context Awareness Status Component
interface ContextAwarenessStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ContextAwarenessStatus = React.forwardRef<HTMLDivElement, ContextAwarenessStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="font-medium">
          Context Awareness: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced context management and awareness' 
              : 'Basic conversation tracking'
            }
          </div>
        )}
      </div>
    );
  }
);

ContextAwarenessStatus.displayName = 'ContextAwarenessStatus';

// Context Awareness Demo Component
interface ContextAwarenessDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ContextAwarenessDemo = React.forwardRef<HTMLDivElement, ContextAwarenessDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Context Awareness Demo</h3>
        
        <ContextManager
          mode="enhanced"
          type="mixed"
          style="detailed"
          onContextUpdate={(context) => console.log('Context updated:', context)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced context awareness for maintaining conversation state, user preferences, and session information.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ContextAwarenessDemo.displayName = 'ContextAwarenessDemo';

// Export all components
export {
  contextAwarenessVariants,
  type ContextAwarenessToggleProps,
  type ContextAwarenessProviderProps,
  type ContextManagerProps,
  type ContextAwarenessStatusProps,
  type ContextAwarenessDemoProps
};
