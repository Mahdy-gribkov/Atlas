/**
 * Gesture Alternatives Component
 * 
 * Provides gesture alternatives for motor accessibility.
 * Implements WCAG 2.1 AA gesture alternative requirements and alternative input methods.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Gesture Alternatives Variants
const gestureAlternativesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'gesture-standard',
        'alternative': 'gesture-alternative',
        'minimal': 'gesture-minimal',
        'custom': 'gesture-custom'
      },
      input: {
        'mouse': 'gesture-input-mouse',
        'keyboard': 'gesture-input-keyboard',
        'touch': 'gesture-input-touch',
        'voice': 'gesture-input-voice',
        'switch': 'gesture-input-switch'
      },
      feedback: {
        'none': 'gesture-feedback-none',
        'visual': 'gesture-feedback-visual',
        'audio': 'gesture-feedback-audio',
        'haptic': 'gesture-feedback-haptic',
        'all': 'gesture-feedback-all'
      },
      complexity: {
        'simple': 'gesture-complexity-simple',
        'moderate': 'gesture-complexity-moderate',
        'advanced': 'gesture-complexity-advanced',
        'expert': 'gesture-complexity-expert'
      }
    },
    defaultVariants: {
      mode: 'standard',
      input: 'mouse',
      feedback: 'visual',
      complexity: 'moderate'
    }
  }
);

// Gesture Alternatives Toggle Props
interface GestureAlternativesToggleProps extends VariantProps<typeof gestureAlternativesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Gesture Alternatives Toggle Component
export const GestureAlternativesToggle = React.forwardRef<HTMLButtonElement, GestureAlternativesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.gestureAlternatives);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          gestureAlternatives: newState
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
            ? 'bg-orange-600 text-white border-orange-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable gesture alternatives' : 'Enable gesture alternatives'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Gesture alternatives enabled' : 'Gesture alternatives disabled'}
          </span>
        )}
      </button>
    );
  }
);

GestureAlternativesToggle.displayName = 'GestureAlternativesToggle';

// Gesture Alternatives Provider Props
interface GestureAlternativesProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'alternative' | 'minimal' | 'custom';
  input?: 'mouse' | 'keyboard' | 'touch' | 'voice' | 'switch';
  feedback?: 'none' | 'visual' | 'audio' | 'haptic' | 'all';
  applyToBody?: boolean;
}

// Gesture Alternatives Provider Component
export const GestureAlternativesProvider = React.forwardRef<HTMLDivElement, GestureAlternativesProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    input = 'mouse',
    feedback = 'visual',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.gestureAlternatives) {
        setCurrentMode('alternative');
      } else {
        setCurrentMode('standard');
      }
    }, [config.motor.gestureAlternatives]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing gesture alternative classes
        document.body.classList.remove(
          'gesture-standard',
          'gesture-alternative',
          'gesture-minimal',
          'gesture-custom'
        );
        
        document.body.classList.add(`gesture-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          gestureAlternativesVariants({ mode: currentMode, input, feedback }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GestureAlternativesProvider.displayName = 'GestureAlternativesProvider';

// Gesture Alternatives Button Component
interface GestureAlternativesButtonProps extends VariantProps<typeof gestureAlternativesVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  gesture?: string;
  alternative?: string;
  mode?: 'standard' | 'alternative' | 'minimal' | 'custom';
}

export const GestureAlternativesButton = React.forwardRef<HTMLButtonElement, GestureAlternativesButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    gesture,
    alternative,
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isGestureAlternativesEnabled = config.motor.gestureAlternatives;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          gestureAlternativesVariants({ 
            mode: isGestureAlternativesEnabled ? 'alternative' : mode
          }),
          className
        )}
        data-gesture={gesture}
        data-alternative={alternative}
        aria-describedby={gesture ? `${ref}-gesture-info` : undefined}
        {...props}
      >
        {children}
        {gesture && (
          <span id={`${ref}-gesture-info`} className="sr-only">
            Gesture: {gesture}, Alternative: {alternative}
          </span>
        )}
      </button>
    );
  }
);

GestureAlternativesButton.displayName = 'GestureAlternativesButton';

// Gesture Alternatives Menu Component
interface GestureAlternativesMenuProps extends VariantProps<typeof gestureAlternativesVariants> {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  mode?: 'standard' | 'alternative' | 'minimal' | 'custom';
}

export const GestureAlternativesMenu = React.forwardRef<HTMLDivElement, GestureAlternativesMenuProps>(
  ({ children, className, orientation = 'horizontal', mode = 'standard', ...props }, ref) => {
    const { config } = useAccessibility();
    const isGestureAlternativesEnabled = config.motor.gestureAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          gestureAlternativesVariants({ 
            mode: isGestureAlternativesEnabled ? 'alternative' : mode
          }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GestureAlternativesMenu.displayName = 'GestureAlternativesMenu';

// Gesture Alternatives Status Component
interface GestureAlternativesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const GestureAlternativesStatus = React.forwardRef<HTMLDivElement, GestureAlternativesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isGestureAlternativesEnabled = config.motor.gestureAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-orange-500" />
        <span className="font-medium">
          Gesture Alternatives: {isGestureAlternativesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isGestureAlternativesEnabled 
              ? 'Alternative input methods available' 
              : 'Standard gesture input only'
            }
          </div>
        )}
      </div>
    );
  }
);

GestureAlternativesStatus.displayName = 'GestureAlternativesStatus';

// Gesture Alternatives Demo Component
interface GestureAlternativesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const GestureAlternativesDemo = React.forwardRef<HTMLDivElement, GestureAlternativesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isGestureAlternativesEnabled = config.motor.gestureAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Gesture Alternatives Demo</h3>
        
        <div className="flex gap-2">
          <GestureAlternativesButton
            mode={isGestureAlternativesEnabled ? 'alternative' : 'standard'}
            gesture="swipe left"
            alternative="click left arrow"
            onClick={() => console.log('Previous clicked')}
          >
            Previous
          </GestureAlternativesButton>
          
          <GestureAlternativesButton
            mode={isGestureAlternativesEnabled ? 'alternative' : 'standard'}
            gesture="swipe right"
            alternative="click right arrow"
            onClick={() => console.log('Next clicked')}
          >
            Next
          </GestureAlternativesButton>
          
          <GestureAlternativesButton
            mode={isGestureAlternativesEnabled ? 'alternative' : 'standard'}
            gesture="pinch zoom"
            alternative="use zoom controls"
            onClick={() => console.log('Zoom clicked')}
          >
            Zoom
          </GestureAlternativesButton>
        </div>
        
        <GestureAlternativesMenu
          orientation="horizontal"
          mode={isGestureAlternativesEnabled ? 'alternative' : 'standard'}
        >
          <GestureAlternativesButton
            mode={isGestureAlternativesEnabled ? 'alternative' : 'standard'}
            gesture="tap"
            alternative="click or press Enter"
            onClick={() => console.log('Menu item 1 clicked')}
          >
            Menu Item 1
          </GestureAlternativesButton>
          
          <GestureAlternativesButton
            mode={isGestureAlternativesEnabled ? 'alternative' : 'standard'}
            gesture="long press"
            alternative="right-click or press Shift+Enter"
            onClick={() => console.log('Menu item 2 clicked')}
          >
            Menu Item 2
          </GestureAlternativesButton>
        </GestureAlternativesMenu>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isGestureAlternativesEnabled 
                ? 'Gesture alternatives are enabled. Complex gestures have alternative input methods.'
                : 'Standard gesture input is used. Enable alternatives for additional input methods.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

GestureAlternativesDemo.displayName = 'GestureAlternativesDemo';

// Export all components
export {
  gestureAlternativesVariants,
  type GestureAlternativesToggleProps,
  type GestureAlternativesProviderProps,
  type GestureAlternativesButtonProps,
  type GestureAlternativesMenuProps,
  type GestureAlternativesStatusProps,
  type GestureAlternativesDemoProps
};
