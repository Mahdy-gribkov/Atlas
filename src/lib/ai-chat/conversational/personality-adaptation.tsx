/**
 * Personality Adaptation Component
 * 
 * Provides personality adaptation support for AI chat interface.
 * Implements advanced personality customization for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Personality Adaptation Variants
const personalityAdaptationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'personality-adaptation-mode-standard',
        'enhanced': 'personality-adaptation-mode-enhanced',
        'advanced': 'personality-adaptation-mode-advanced',
        'custom': 'personality-adaptation-mode-custom'
      },
      type: {
        'professional': 'personality-type-professional',
        'friendly': 'personality-type-friendly',
        'enthusiastic': 'personality-type-enthusiastic',
        'casual': 'personality-type-casual',
        'mixed': 'personality-type-mixed'
      },
      style: {
        'minimal': 'personality-style-minimal',
        'moderate': 'personality-style-moderate',
        'detailed': 'personality-style-detailed',
        'custom': 'personality-style-custom'
      },
      format: {
        'text': 'personality-format-text',
        'visual': 'personality-format-visual',
        'interactive': 'personality-format-interactive',
        'mixed': 'personality-format-mixed'
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

// Personality Adaptation Toggle Props
interface PersonalityAdaptationToggleProps extends VariantProps<typeof personalityAdaptationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Personality Adaptation Toggle Component
export const PersonalityAdaptationToggle = React.forwardRef<HTMLButtonElement, PersonalityAdaptationToggleProps>(
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
            ? 'bg-violet-600 text-white border-violet-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable personality adaptation' : 'Enable personality adaptation'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Personality adaptation enabled' : 'Personality adaptation disabled'}
          </span>
        )}
      </button>
    );
  }
);

PersonalityAdaptationToggle.displayName = 'PersonalityAdaptationToggle';

// Personality Adaptation Provider Props
interface PersonalityAdaptationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'professional' | 'friendly' | 'enthusiastic' | 'casual' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Personality Adaptation Provider Component
export const PersonalityAdaptationProvider = React.forwardRef<HTMLDivElement, PersonalityAdaptationProviderProps>(
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
        // Remove existing personality adaptation classes
        document.body.classList.remove(
          'personality-adaptation-mode-standard',
          'personality-adaptation-mode-enhanced',
          'personality-adaptation-mode-advanced',
          'personality-adaptation-mode-custom'
        );
        
        document.body.classList.add(`personality-adaptation-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          personalityAdaptationVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PersonalityAdaptationProvider.displayName = 'PersonalityAdaptationProvider';

// Personality Adaptation Engine Component
interface PersonalityAdaptationEngineProps extends VariantProps<typeof personalityAdaptationVariants> {
  className?: string;
  onPersonalityUpdated?: (personality: any) => void;
  type?: 'professional' | 'friendly' | 'enthusiastic' | 'casual' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const PersonalityAdaptationEngine = React.forwardRef<HTMLDivElement, PersonalityAdaptationEngineProps>(
  ({ 
    className, 
    onPersonalityUpdated,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [personality, setPersonality] = useState({
      current: 'friendly',
      traits: {
        professional: {
          name: 'Professional',
          icon: '👔',
          color: 'text-blue-600 dark:text-blue-400',
          description: 'Formal, knowledgeable, and business-like',
          characteristics: ['Formal tone', 'Expert knowledge', 'Structured responses', 'Professional language'],
          examples: ['I recommend...', 'Based on my analysis...', 'Please consider...']
        },
        friendly: {
          name: 'Friendly',
          icon: '😊',
          color: 'text-green-600 dark:text-green-400',
          description: 'Warm, approachable, and conversational',
          characteristics: ['Warm tone', 'Personal touch', 'Encouraging', 'Conversational'],
          examples: ['I\'d love to help!', 'That sounds amazing!', 'Let\'s make this perfect!']
        },
        enthusiastic: {
          name: 'Enthusiastic',
          icon: '🎉',
          color: 'text-orange-600 dark:text-orange-400',
          description: 'Excited, energetic, and passionate',
          characteristics: ['Excited tone', 'High energy', 'Passionate', 'Motivational'],
          examples: ['This is fantastic!', 'You\'re going to love this!', 'Amazing choice!']
        },
        casual: {
          name: 'Casual',
          icon: '😎',
          color: 'text-purple-600 dark:text-purple-400',
          description: 'Relaxed, informal, and easy-going',
          characteristics: ['Relaxed tone', 'Informal language', 'Easy-going', 'Conversational'],
          examples: ['Sure thing!', 'No problem!', 'Sounds good to me!']
        }
      },
      adaptation: {
        userPreference: 'auto',
        contextAware: true,
        learningEnabled: true,
        adaptationSpeed: 'medium'
      },
      metrics: {
        adaptationCount: 0,
        userSatisfaction: 0,
        personalitySwitches: 0,
        effectiveness: 0
      }
    });

    const [isActive, setIsActive] = useState(false);

    const switchPersonality = useCallback((newPersonality: string) => {
      setPersonality(prev => ({
        ...prev,
        current: newPersonality,
        metrics: {
          ...prev.metrics,
          personalitySwitches: prev.metrics.personalitySwitches + 1,
          adaptationCount: prev.metrics.adaptationCount + 1
        }
      }));
      onPersonalityUpdated?.(personality);
    }, [personality, onPersonalityUpdated]);

    const updateAdaptationSettings = useCallback((settings: any) => {
      setPersonality(prev => ({
        ...prev,
        adaptation: {
          ...prev.adaptation,
          ...settings
        }
      }));
    }, []);

    const getPersonalityIcon = (personalityType: string) => {
      return personality.traits[personalityType as keyof typeof personality.traits]?.icon || '🤖';
    };

    const getPersonalityColor = (personalityType: string) => {
      return personality.traits[personalityType as keyof typeof personality.traits]?.color || 'text-gray-600 dark:text-gray-400';
    };

    const generateResponse = useCallback((message: string) => {
      const currentTrait = personality.traits[personality.current as keyof typeof personality.traits];
      const examples = currentTrait?.examples || [];
      const randomExample = examples[Math.floor(Math.random() * examples.length)];
      
      return `${randomExample} ${message}`;
    }, [personality]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          personalityAdaptationVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Personality Adaptation
          </h3>
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors duration-200',
              isActive 
                ? 'bg-violet-600 text-white hover:bg-violet-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-violet-50 rounded-md dark:bg-violet-900/20">
              <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {personality.metrics.adaptationCount}
              </div>
              <div className="text-sm text-violet-600 dark:text-violet-400">
                Adaptations
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {personality.metrics.personalitySwitches}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Switches
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {personality.metrics.userSatisfaction}%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Satisfaction
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {personality.metrics.effectiveness}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Effectiveness
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Current Personality
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getPersonalityIcon(personality.current)}</span>
                  <span className={cn('text-sm font-semibold', getPersonalityColor(personality.current))}>
                    {personality.traits[personality.current as keyof typeof personality.traits]?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {personality.traits[personality.current as keyof typeof personality.traits]?.description}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Available Personalities
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(personality.traits).map(([key, trait]) => (
                  <button
                    key={key}
                    onClick={() => switchPersonality(key)}
                    className={cn(
                      'p-3 text-left rounded-md border-2 transition-all duration-200',
                      personality.current === key
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{trait.icon}</span>
                      <span className={cn('text-sm font-semibold', trait.color)}>
                        {trait.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {trait.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Adaptation Settings
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">User Preference:</span>
                  <select
                    value={personality.adaptation.userPreference}
                    onChange={(e) => updateAdaptationSettings({ userPreference: e.target.value })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="auto">Auto</option>
                    <option value="manual">Manual</option>
                    <option value="context">Context-based</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Context Aware:</span>
                  <input
                    type="checkbox"
                    checked={personality.adaptation.contextAware}
                    onChange={(e) => updateAdaptationSettings({ contextAware: e.target.checked })}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Learning Enabled:</span>
                  <input
                    type="checkbox"
                    checked={personality.adaptation.learningEnabled}
                    onChange={(e) => updateAdaptationSettings({ learningEnabled: e.target.checked })}
                    className="rounded"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Adaptation Speed:</span>
                  <select
                    value={personality.adaptation.adaptationSpeed}
                    onChange={(e) => updateAdaptationSettings({ adaptationSpeed: e.target.value })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="slow">Slow</option>
                    <option value="medium">Medium</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Response Preview
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  "{generateResponse('I can help you plan your perfect trip!')}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PersonalityAdaptationEngine.displayName = 'PersonalityAdaptationEngine';

// Personality Adaptation Status Component
interface PersonalityAdaptationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const PersonalityAdaptationStatus = React.forwardRef<HTMLDivElement, PersonalityAdaptationStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-violet-500" />
        <span className="font-medium">
          Personality Adaptation: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced personality adaptation and customization' 
              : 'Standard personality mode'
            }
          </div>
        )}
      </div>
    );
  }
);

PersonalityAdaptationStatus.displayName = 'PersonalityAdaptationStatus';

// Personality Adaptation Demo Component
interface PersonalityAdaptationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const PersonalityAdaptationDemo = React.forwardRef<HTMLDivElement, PersonalityAdaptationDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Personality Adaptation Demo</h3>
        
        <PersonalityAdaptationEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onPersonalityUpdated={(personality) => console.log('Personality updated:', personality)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced personality adaptation for customizing AI responses based on user preferences and context.
            </p>
          </div>
        )}
      </div>
    );
  }
);

PersonalityAdaptationDemo.displayName = 'PersonalityAdaptationDemo';

// Export all components
export {
  personalityAdaptationVariants,
  type PersonalityAdaptationToggleProps,
  type PersonalityAdaptationProviderProps,
  type PersonalityAdaptationEngineProps,
  type PersonalityAdaptationStatusProps,
  type PersonalityAdaptationDemoProps
};
