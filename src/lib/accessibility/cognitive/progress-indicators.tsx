/**
 * Progress Indicators Component
 * 
 * Provides progress indicators for cognitive accessibility.
 * Implements WCAG 2.1 AA progress indicator requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Progress Indicators Variants
const progressIndicatorsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'progress-standard',
        'enhanced': 'progress-enhanced',
        'minimal': 'progress-minimal',
        'custom': 'progress-custom'
      },
      style: {
        'linear': 'progress-style-linear',
        'circular': 'progress-style-circular',
        'steps': 'progress-style-steps',
        'dots': 'progress-style-dots'
      },
      size: {
        'small': 'progress-size-small',
        'medium': 'progress-size-medium',
        'large': 'progress-size-large',
        'custom': 'progress-size-custom'
      },
      feedback: {
        'none': 'progress-feedback-none',
        'visual': 'progress-feedback-visual',
        'audio': 'progress-feedback-audio',
        'both': 'progress-feedback-both'
      }
    },
    defaultVariants: {
      mode: 'standard',
      style: 'linear',
      size: 'medium',
      feedback: 'visual'
    }
  }
);

// Progress Indicators Toggle Props
interface ProgressIndicatorsToggleProps extends VariantProps<typeof progressIndicatorsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Progress Indicators Toggle Component
export const ProgressIndicatorsToggle = React.forwardRef<HTMLButtonElement, ProgressIndicatorsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.progressIndicators);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          progressIndicators: newState
        }
      });
      
      onToggle?.(newState);
    }, [isEnabled, updateConfig, onToggle]);

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
        aria-label={isEnabled ? 'Disable progress indicators' : 'Enable progress indicators'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Progress indicators enabled' : 'Progress indicators disabled'}
          </span>
        )}
      </button>
    );
  }
);

ProgressIndicatorsToggle.displayName = 'ProgressIndicatorsToggle';

// Progress Indicators Provider Props
interface ProgressIndicatorsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'custom';
  style?: 'linear' | 'circular' | 'steps' | 'dots';
  size?: 'small' | 'medium' | 'large' | 'custom';
  applyToBody?: boolean;
}

// Progress Indicators Provider Component
export const ProgressIndicatorsProvider = React.forwardRef<HTMLDivElement, ProgressIndicatorsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    style = 'linear',
    size = 'medium',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.progressIndicators) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.progressIndicators]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing progress indicators classes
        document.body.classList.remove(
          'progress-standard',
          'progress-enhanced',
          'progress-minimal',
          'progress-custom'
        );
        
        document.body.classList.add(`progress-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          progressIndicatorsVariants({ mode: currentMode, style, size }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ProgressIndicatorsProvider.displayName = 'ProgressIndicatorsProvider';

// Progress Indicators Linear Component
interface ProgressIndicatorsLinearProps extends VariantProps<typeof progressIndicatorsVariants> {
  className?: string;
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'custom';
}

export const ProgressIndicatorsLinear = React.forwardRef<HTMLDivElement, ProgressIndicatorsLinearProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    label = 'Progress',
    showPercentage = true,
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isProgressIndicatorsEnabled = config.cognitive.progressIndicators;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          progressIndicatorsVariants({ 
            mode: isProgressIndicatorsEnabled ? 'enhanced' : mode
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={`${label}: ${Math.round(percentage)}% complete`}
          />
        </div>
      </div>
    );
  }
);

ProgressIndicatorsLinear.displayName = 'ProgressIndicatorsLinear';

// Progress Indicators Circular Component
interface ProgressIndicatorsCircularProps extends VariantProps<typeof progressIndicatorsVariants> {
  className?: string;
  value?: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'custom';
}

export const ProgressIndicatorsCircular = React.forwardRef<HTMLDivElement, ProgressIndicatorsCircularProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    label = 'Progress',
    showPercentage = true,
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isProgressIndicatorsEnabled = config.cognitive.progressIndicators;
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center',
          progressIndicatorsVariants({ 
            mode: isProgressIndicatorsEnabled ? 'enhanced' : mode
          }),
          className
        )}
        {...props}
      >
        <div className="relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-blue-600 transition-all duration-500 ease-out"
              role="progressbar"
              aria-valuenow={value}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-label={`${label}: ${Math.round(percentage)}% complete`}
            />
          </svg>
          {showPercentage && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>
        
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
          {label}
        </span>
      </div>
    );
  }
);

ProgressIndicatorsCircular.displayName = 'ProgressIndicatorsCircular';

// Progress Indicators Steps Component
interface ProgressIndicatorsStepsProps extends VariantProps<typeof progressIndicatorsVariants> {
  className?: string;
  steps?: string[];
  currentStep?: number;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'custom';
}

export const ProgressIndicatorsSteps = React.forwardRef<HTMLDivElement, ProgressIndicatorsStepsProps>(
  ({ 
    className, 
    steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
    currentStep = 0,
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isProgressIndicatorsEnabled = config.cognitive.progressIndicators;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-between',
          progressIndicatorsVariants({ 
            mode: isProgressIndicatorsEnabled ? 'enhanced' : mode
          }),
          className
        )}
        {...props}
      >
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                index <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}
              aria-label={`Step ${index + 1}: ${step}`}
            >
              {index + 1}
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'w-12 h-1 mx-2 transition-all duration-300',
                  index < currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
);

ProgressIndicatorsSteps.displayName = 'ProgressIndicatorsSteps';

// Progress Indicators Status Component
interface ProgressIndicatorsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ProgressIndicatorsStatus = React.forwardRef<HTMLDivElement, ProgressIndicatorsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isProgressIndicatorsEnabled = config.cognitive.progressIndicators;

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
          Progress Indicators: {isProgressIndicatorsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isProgressIndicatorsEnabled 
              ? 'Enhanced progress indicators and visual feedback' 
              : 'Standard progress indicators'
            }
          </div>
        )}
      </div>
    );
  }
);

ProgressIndicatorsStatus.displayName = 'ProgressIndicatorsStatus';

// Progress Indicators Demo Component
interface ProgressIndicatorsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ProgressIndicatorsDemo = React.forwardRef<HTMLDivElement, ProgressIndicatorsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isProgressIndicatorsEnabled = config.cognitive.progressIndicators;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 10));
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Progress Indicators Demo</h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-medium mb-2">Linear Progress</h4>
            <ProgressIndicatorsLinear
              mode={isProgressIndicatorsEnabled ? 'enhanced' : 'standard'}
              value={progress}
              label="Loading Progress"
              showPercentage={true}
            />
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Circular Progress</h4>
            <ProgressIndicatorsCircular
              mode={isProgressIndicatorsEnabled ? 'enhanced' : 'standard'}
              value={progress}
              label="Upload Progress"
              showPercentage={true}
            />
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Step Progress</h4>
            <ProgressIndicatorsSteps
              mode={isProgressIndicatorsEnabled ? 'enhanced' : 'standard'}
              steps={['Search', 'Select', 'Book', 'Confirm']}
              currentStep={Math.floor(progress / 25)}
            />
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isProgressIndicatorsEnabled 
                ? 'Enhanced progress indicators are enabled. Progress updates automatically with visual feedback.'
                : 'Standard progress indicators are used. Enable enhanced indicators for better visual feedback.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

ProgressIndicatorsDemo.displayName = 'ProgressIndicatorsDemo';

// Export all components
export {
  progressIndicatorsVariants,
  type ProgressIndicatorsToggleProps,
  type ProgressIndicatorsProviderProps,
  type ProgressIndicatorsLinearProps,
  type ProgressIndicatorsCircularProps,
  type ProgressIndicatorsStepsProps,
  type ProgressIndicatorsStatusProps,
  type ProgressIndicatorsDemoProps
};
