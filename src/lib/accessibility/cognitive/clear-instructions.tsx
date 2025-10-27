/**
 * Clear Instructions Component
 * 
 * Provides clear instructions support for cognitive accessibility.
 * Implements WCAG 2.1 AA clear instructions requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Clear Instructions Variants
const clearInstructionsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'instructions-standard',
        'enhanced': 'instructions-enhanced',
        'detailed': 'instructions-detailed',
        'custom': 'instructions-custom'
      },
      style: {
        'minimal': 'instructions-style-minimal',
        'moderate': 'instructions-style-moderate',
        'comprehensive': 'instructions-style-comprehensive',
        'custom': 'instructions-style-custom'
      },
      language: {
        'simple': 'instructions-language-simple',
        'standard': 'instructions-language-standard',
        'detailed': 'instructions-language-detailed',
        'custom': 'instructions-language-custom'
      },
      format: {
        'text': 'instructions-format-text',
        'step': 'instructions-format-step',
        'visual': 'instructions-format-visual',
        'mixed': 'instructions-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      style: 'moderate',
      language: 'standard',
      format: 'text'
    }
  }
);

// Clear Instructions Toggle Props
interface ClearInstructionsToggleProps extends VariantProps<typeof clearInstructionsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Clear Instructions Toggle Component
export const ClearInstructionsToggle = React.forwardRef<HTMLButtonElement, ClearInstructionsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.clearInstructions);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          clearInstructions: newState
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
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable clear instructions' : 'Enable clear instructions'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Clear instructions enabled' : 'Clear instructions disabled'}
          </span>
        )}
      </button>
    );
  }
);

ClearInstructionsToggle.displayName = 'ClearInstructionsToggle';

// Clear Instructions Provider Props
interface ClearInstructionsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'detailed' | 'custom';
  style?: 'minimal' | 'moderate' | 'comprehensive' | 'custom';
  language?: 'simple' | 'standard' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Clear Instructions Provider Component
export const ClearInstructionsProvider = React.forwardRef<HTMLDivElement, ClearInstructionsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    style = 'moderate',
    language = 'standard',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.clearInstructions) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.clearInstructions]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing clear instructions classes
        document.body.classList.remove(
          'instructions-standard',
          'instructions-enhanced',
          'instructions-detailed',
          'instructions-custom'
        );
        
        document.body.classList.add(`instructions-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          clearInstructionsVariants({ mode: currentMode, style, language }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ClearInstructionsProvider.displayName = 'ClearInstructionsProvider';

// Clear Instructions Text Component
interface ClearInstructionsTextProps extends VariantProps<typeof clearInstructionsVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  level?: 'basic' | 'intermediate' | 'advanced';
  mode?: 'standard' | 'enhanced' | 'detailed' | 'custom';
  style?: 'minimal' | 'moderate' | 'comprehensive' | 'custom';
}

export const ClearInstructionsText = React.forwardRef<HTMLDivElement, ClearInstructionsTextProps>(
  ({ 
    children, 
    className, 
    title,
    level = 'intermediate',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isClearInstructionsEnabled = config.cognitive.clearInstructions;

    const levelClasses = {
      basic: 'text-sm text-gray-600 dark:text-gray-400',
      intermediate: 'text-base text-gray-700 dark:text-gray-300',
      advanced: 'text-lg text-gray-800 dark:text-gray-200'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          clearInstructionsVariants({ 
            mode: isClearInstructionsEnabled ? 'enhanced' : mode,
            style
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        <div className={levelClasses[level]}>
          {children}
        </div>
      </div>
    );
  }
);

ClearInstructionsText.displayName = 'ClearInstructionsText';

// Clear Instructions Step Component
interface ClearInstructionsStepProps extends VariantProps<typeof clearInstructionsVariants> {
  children: React.ReactNode;
  className?: string;
  stepNumber?: number;
  title?: string;
  isCompleted?: boolean;
  isActive?: boolean;
  mode?: 'standard' | 'enhanced' | 'detailed' | 'custom';
  style?: 'minimal' | 'moderate' | 'comprehensive' | 'custom';
}

export const ClearInstructionsStep = React.forwardRef<HTMLDivElement, ClearInstructionsStepProps>(
  ({ 
    children, 
    className, 
    stepNumber = 1,
    title,
    isCompleted = false,
    isActive = false,
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isClearInstructionsEnabled = config.cognitive.clearInstructions;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-start gap-3 p-4 rounded-lg border-2 transition-all duration-300',
          clearInstructionsVariants({ 
            mode: isClearInstructionsEnabled ? 'enhanced' : mode,
            style
          }),
          isCompleted 
            ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
            : isActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
            isCompleted 
              ? 'bg-green-600 text-white' 
              : isActive 
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          )}
        >
          {isCompleted ? '✓' : stepNumber}
        </div>
        
        <div className="flex-1">
          {title && (
            <h4 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">
              {title}
            </h4>
          )}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      </div>
    );
  }
);

ClearInstructionsStep.displayName = 'ClearInstructionsStep';

// Clear Instructions List Component
interface ClearInstructionsListProps extends VariantProps<typeof clearInstructionsVariants> {
  items: string[];
  className?: string;
  title?: string;
  type?: 'ordered' | 'unordered' | 'checklist';
  mode?: 'standard' | 'enhanced' | 'detailed' | 'custom';
  style?: 'minimal' | 'moderate' | 'comprehensive' | 'custom';
}

export const ClearInstructionsList = React.forwardRef<HTMLDivElement, ClearInstructionsListProps>(
  ({ 
    items, 
    className, 
    title,
    type = 'unordered',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isClearInstructionsEnabled = config.cognitive.clearInstructions;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          clearInstructionsVariants({ 
            mode: isClearInstructionsEnabled ? 'enhanced' : mode,
            style
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        
        {type === 'ordered' ? (
          <ol className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {index + 1}.
                </span> {item}
              </li>
            ))}
          </ol>
        ) : type === 'checklist' ? (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 rounded dark:border-gray-600" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400">•</span> {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);

ClearInstructionsList.displayName = 'ClearInstructionsList';

// Clear Instructions Status Component
interface ClearInstructionsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ClearInstructionsStatus = React.forwardRef<HTMLDivElement, ClearInstructionsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isClearInstructionsEnabled = config.cognitive.clearInstructions;

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
          Clear Instructions: {isClearInstructionsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isClearInstructionsEnabled 
              ? 'Enhanced instructions and guidance' 
              : 'Standard instructions'
            }
          </div>
        )}
      </div>
    );
  }
);

ClearInstructionsStatus.displayName = 'ClearInstructionsStatus';

// Clear Instructions Demo Component
interface ClearInstructionsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ClearInstructionsDemo = React.forwardRef<HTMLDivElement, ClearInstructionsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isClearInstructionsEnabled = config.cognitive.clearInstructions;

    const steps = [
      'Enter your destination city or country',
      'Select your travel dates',
      'Choose your accommodation preferences',
      'Review and confirm your booking'
    ];

    const tips = [
      'Use specific city names for better results',
      'Check multiple dates for better prices',
      'Read reviews before booking',
      'Keep your confirmation email safe'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Clear Instructions Demo</h3>
        
        <div className="space-y-4">
          <ClearInstructionsText
            mode={isClearInstructionsEnabled ? 'enhanced' : 'standard'}
            style={isClearInstructionsEnabled ? 'comprehensive' : 'moderate'}
            title="How to Book a Trip"
            level={isClearInstructionsEnabled ? 'advanced' : 'intermediate'}
          >
            Follow these simple steps to book your perfect trip. Each step is designed to be easy to understand and complete.
          </ClearInstructionsText>
          
          <div className="space-y-2">
            {steps.map((step, index) => (
              <ClearInstructionsStep
                key={index}
                mode={isClearInstructionsEnabled ? 'enhanced' : 'standard'}
                style={isClearInstructionsEnabled ? 'comprehensive' : 'moderate'}
                stepNumber={index + 1}
                title={`Step ${index + 1}`}
                isActive={index === 0}
                isCompleted={index < 0}
              >
                {step}
              </ClearInstructionsStep>
            ))}
          </div>
          
          <ClearInstructionsList
            mode={isClearInstructionsEnabled ? 'enhanced' : 'standard'}
            style={isClearInstructionsEnabled ? 'comprehensive' : 'moderate'}
            items={tips}
            title="Helpful Tips"
            type="checklist"
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isClearInstructionsEnabled 
                ? 'Enhanced instructions are enabled. Clear, detailed guidance is provided for all actions.'
                : 'Standard instructions are used. Enable clear instructions for enhanced guidance.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

ClearInstructionsDemo.displayName = 'ClearInstructionsDemo';

// Export all components
export {
  clearInstructionsVariants,
  type ClearInstructionsToggleProps,
  type ClearInstructionsProviderProps,
  type ClearInstructionsTextProps,
  type ClearInstructionsStepProps,
  type ClearInstructionsListProps,
  type ClearInstructionsStatusProps,
  type ClearInstructionsDemoProps
};
