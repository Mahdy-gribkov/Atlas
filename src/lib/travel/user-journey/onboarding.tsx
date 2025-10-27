/**
 * Onboarding Component
 * 
 * Provides user onboarding experience for Atlas travel agent.
 * Implements guided setup and introduction features for new users.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Onboarding Variants
const onboardingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'onboarding-mode-standard',
        'enhanced': 'onboarding-mode-enhanced',
        'advanced': 'onboarding-mode-advanced',
        'custom': 'onboarding-mode-custom'
      },
      type: {
        'welcome': 'onboarding-type-welcome',
        'preferences': 'onboarding-type-preferences',
        'goals': 'onboarding-type-goals',
        'tutorial': 'onboarding-type-tutorial',
        'mixed': 'onboarding-type-mixed'
      },
      style: {
        'minimal': 'onboarding-style-minimal',
        'moderate': 'onboarding-style-moderate',
        'detailed': 'onboarding-style-detailed',
        'custom': 'onboarding-style-custom'
      },
      format: {
        'text': 'onboarding-format-text',
        'visual': 'onboarding-format-visual',
        'interactive': 'onboarding-format-interactive',
        'mixed': 'onboarding-format-mixed'
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

// Onboarding Step Props
interface OnboardingStepProps extends VariantProps<typeof onboardingVariants> {
  className?: string;
  step: {
    id: string;
    title: string;
    description: string;
    content: React.ReactNode;
    icon?: string;
    isCompleted?: boolean;
    isActive?: boolean;
  };
  onNext?: () => void;
  onPrevious?: () => void;
  onSkip?: () => void;
  onComplete?: () => void;
  showNavigation?: boolean;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
}

// Onboarding Step Component
export const OnboardingStep = React.forwardRef<HTMLDivElement, OnboardingStepProps>(
  ({ 
    className, 
    step,
    onNext,
    onPrevious,
    onSkip,
    onComplete,
    showNavigation = true,
    showProgress = true,
    currentStep = 1,
    totalSteps = 5,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleNext = useCallback(() => {
      setIsAnimating(true);
      setTimeout(() => {
        onNext?.();
        setIsAnimating(false);
      }, 300);
    }, [onNext]);

    const handlePrevious = useCallback(() => {
      setIsAnimating(true);
      setTimeout(() => {
        onPrevious?.();
        setIsAnimating(false);
      }, 300);
    }, [onPrevious]);

    const handleSkip = useCallback(() => {
      onSkip?.();
    }, [onSkip]);

    const handleComplete = useCallback(() => {
      onComplete?.();
    }, [onComplete]);

    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col h-full bg-white dark:bg-gray-800',
          onboardingVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-gray-600">
          {showProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-500">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-4">
            {step.icon && (
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">{step.icon}</span>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {step.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {step.description}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className={cn(
            'transition-all duration-300',
            isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
          )}>
            {step.content}
          </div>
        </div>

        {/* Footer */}
        {showNavigation && (
          <div className="flex-shrink-0 p-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    ← Previous
                  </button>
                )}
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  Skip
                </button>
              </div>
              
              <div className="flex gap-3">
                {currentStep < totalSteps ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={handleComplete}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                  >
                    Complete Setup
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

OnboardingStep.displayName = 'OnboardingStep';

// Onboarding Wizard Props
interface OnboardingWizardProps {
  className?: string;
  steps: Array<OnboardingStepProps['step']>;
  onComplete?: (data: any) => void;
  onSkip?: () => void;
  showProgress?: boolean;
  showNavigation?: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

// Onboarding Wizard Component
export const OnboardingWizard = React.forwardRef<HTMLDivElement, OnboardingWizardProps>(
  ({ 
    className, 
    steps,
    onComplete,
    onSkip,
    showProgress = true,
    showNavigation = true,
    autoAdvance = false,
    autoAdvanceDelay = 5000,
    ...props 
  }, ref) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [onboardingData, setOnboardingData] = useState<any>({});

    const currentStep = steps[currentStepIndex];
    const isLastStep = currentStepIndex === steps.length - 1;

    const handleNext = useCallback(() => {
      setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
      
      if (isLastStep) {
        onComplete?.(onboardingData);
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    }, [currentStepIndex, isLastStep, onComplete, onboardingData]);

    const handlePrevious = useCallback(() => {
      if (currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      }
    }, [currentStepIndex]);

    const handleSkip = useCallback(() => {
      onSkip?.();
    }, [onSkip]);

    const handleComplete = useCallback(() => {
      onComplete?.(onboardingData);
    }, [onComplete]);

    const updateData = useCallback((stepId: string, data: any) => {
      setOnboardingData(prev => ({
        ...prev,
        [stepId]: data
      }));
    }, []);

    // Auto-advance functionality
    useEffect(() => {
      if (autoAdvance && !isLastStep) {
        const timer = setTimeout(() => {
          handleNext();
        }, autoAdvanceDelay);
        
        return () => clearTimeout(timer);
      }
    }, [autoAdvance, autoAdvanceDelay, handleNext, isLastStep]);

    if (!currentStep) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 bg-white dark:bg-gray-800',
          className
        )}
        {...props}
      >
        <OnboardingStep
          step={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSkip={handleSkip}
          onComplete={handleComplete}
          showNavigation={showNavigation}
          showProgress={showProgress}
          currentStep={currentStepIndex + 1}
          totalSteps={steps.length}
        />
      </div>
    );
  }
);

OnboardingWizard.displayName = 'OnboardingWizard';

// Welcome Step Component
interface WelcomeStepProps {
  className?: string;
  onNext?: () => void;
}

export const WelcomeStep = React.forwardRef<HTMLDivElement, WelcomeStepProps>(
  ({ className, onNext }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'text-center space-y-6',
          className
        )}
      >
        <div className="space-y-4">
          <div className="text-6xl">🗺️</div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome to Atlas
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your intelligent travel companion that helps you discover, plan, and book amazing adventures around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center space-y-3">
            <div className="text-3xl">🤖</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI-Powered Planning
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized recommendations and intelligent itinerary suggestions
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="text-3xl">🌍</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Global Discovery
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Explore destinations, activities, and experiences worldwide
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="text-3xl">📱</div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Seamless Experience
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              From planning to booking, everything in one place
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Let's Get Started
          </button>
        </div>
      </div>
    );
  }
);

WelcomeStep.displayName = 'WelcomeStep';

// Preferences Step Component
interface PreferencesStepProps {
  className?: string;
  onNext?: (preferences: any) => void;
}

export const PreferencesStep = React.forwardRef<HTMLDivElement, PreferencesStepProps>(
  ({ className, onNext }, ref) => {
    const [preferences, setPreferences] = useState({
      travelStyle: '',
      budget: '',
      interests: [] as string[],
      groupSize: '',
      season: ''
    });

    const travelStyles = [
      { id: 'adventure', name: 'Adventure', icon: '🏔️', description: 'Hiking, climbing, extreme sports' },
      { id: 'culture', name: 'Culture', icon: '🏛️', description: 'Museums, history, local traditions' },
      { id: 'relaxation', name: 'Relaxation', icon: '🏖️', description: 'Beaches, spas, peaceful retreats' },
      { id: 'food', name: 'Food & Wine', icon: '🍷', description: 'Culinary experiences, wine tasting' },
      { id: 'nature', name: 'Nature', icon: '🌿', description: 'National parks, wildlife, eco-tourism' },
      { id: 'city', name: 'Urban', icon: '🏙️', description: 'Cities, nightlife, shopping' }
    ];

    const interests = [
      'Photography', 'Art', 'Music', 'Sports', 'History', 'Architecture',
      'Cooking', 'Dancing', 'Reading', 'Gaming', 'Fitness', 'Yoga',
      'Meditation', 'Volunteering', 'Learning', 'Socializing'
    ];

    const handleStyleSelect = (styleId: string) => {
      setPreferences(prev => ({ ...prev, travelStyle: styleId }));
    };

    const handleInterestToggle = (interest: string) => {
      setPreferences(prev => ({
        ...prev,
        interests: prev.interests.includes(interest)
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      }));
    };

    const handleNext = () => {
      onNext?.(preferences);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          className
        )}
      >
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            What's your travel style?
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {travelStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
                className={cn(
                  'p-4 border-2 rounded-lg text-left transition-all duration-200',
                  preferences.travelStyle === style.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                )}
              >
                <div className="text-2xl mb-2">{style.icon}</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {style.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {style.description}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            What are your interests?
          </h4>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {interests.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={cn(
                  'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                  preferences.interests.includes(interest)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Budget Range
            </label>
            <select
              value={preferences.budget}
              onChange={(e) => setPreferences(prev => ({ ...prev, budget: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="">Select budget range</option>
              <option value="budget">Budget ($0-50/day)</option>
              <option value="mid-range">Mid-range ($50-150/day)</option>
              <option value="luxury">Luxury ($150+/day)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Group Size
            </label>
            <select
              value={preferences.groupSize}
              onChange={(e) => setPreferences(prev => ({ ...prev, groupSize: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
            >
              <option value="">Select group size</option>
              <option value="solo">Solo Traveler</option>
              <option value="couple">Couple</option>
              <option value="family">Family (3-4)</option>
              <option value="group">Group (5+)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={handleNext}
            disabled={!preferences.travelStyle}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }
);

PreferencesStep.displayName = 'PreferencesStep';

// Onboarding Demo Component
interface OnboardingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const OnboardingDemo = React.forwardRef<HTMLDivElement, OnboardingDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [isActive, setIsActive] = useState(false);

    const steps = [
      {
        id: 'welcome',
        title: 'Welcome to Atlas',
        description: 'Let\'s get you started with your travel planning journey',
        icon: '🗺️',
        content: <WelcomeStep onNext={() => console.log('Welcome step completed')} />
      },
      {
        id: 'preferences',
        title: 'Tell us about yourself',
        description: 'Help us personalize your travel experience',
        icon: '⚙️',
        content: <PreferencesStep onNext={(prefs) => console.log('Preferences:', prefs)} />
      },
      {
        id: 'goals',
        title: 'What are your travel goals?',
        description: 'What kind of experiences are you looking for?',
        icon: '🎯',
        content: (
          <div className="text-center space-y-6">
            <div className="text-4xl">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Travel Goals
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This step would collect information about travel goals and aspirations.
            </p>
          </div>
        )
      },
      {
        id: 'tutorial',
        title: 'Let\'s explore Atlas',
        description: 'Take a quick tour of our features',
        icon: '🎓',
        content: (
          <div className="text-center space-y-6">
            <div className="text-4xl">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Feature Tour
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This step would provide a tutorial on how to use Atlas features.
            </p>
          </div>
        )
      },
      {
        id: 'complete',
        title: 'You\'re all set!',
        description: 'Welcome to your personalized Atlas experience',
        icon: '🎉',
        content: (
          <div className="text-center space-y-6">
            <div className="text-4xl">🎉</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Setup Complete
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You're ready to start planning your next adventure!
            </p>
          </div>
        )
      }
    ];

    const handleComplete = (data: any) => {
      console.log('Onboarding completed:', data);
      setIsActive(false);
    };

    const handleSkip = () => {
      console.log('Onboarding skipped');
      setIsActive(false);
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
          Onboarding Demo
        </h3>
        
        <div className="space-y-4">
          <button
            onClick={() => setIsActive(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Start Onboarding
          </button>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Click the button above to experience the onboarding flow
          </div>
        </div>
        
        {isActive && (
          <OnboardingWizard
            steps={steps}
            onComplete={handleComplete}
            onSkip={handleSkip}
            showProgress={true}
            showNavigation={true}
          />
        )}
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive onboarding experience with welcome, preferences, goals, and tutorial steps.
            </p>
          </div>
        )}
      </div>
    );
  }
);

OnboardingDemo.displayName = 'OnboardingDemo';

// Export all components
export {
  onboardingVariants,
  type OnboardingStepProps,
  type OnboardingWizardProps,
  type WelcomeStepProps,
  type PreferencesStepProps,
  type OnboardingDemoProps
};
