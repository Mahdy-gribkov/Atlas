/**
 * Visual Cues Component
 * 
 * Provides visual cues support for cognitive accessibility.
 * Implements WCAG 2.1 AA visual cues requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Visual Cues Variants
const visualCuesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'visual-cues-standard',
        'enhanced': 'visual-cues-enhanced',
        'prominent': 'visual-cues-prominent',
        'custom': 'visual-cues-custom'
      },
      style: {
        'subtle': 'visual-style-subtle',
        'moderate': 'visual-style-moderate',
        'bold': 'visual-style-bold',
        'custom': 'visual-style-custom'
      },
      type: {
        'icon': 'visual-type-icon',
        'color': 'visual-type-color',
        'shape': 'visual-type-shape',
        'mixed': 'visual-type-mixed'
      },
      size: {
        'small': 'visual-size-small',
        'medium': 'visual-size-medium',
        'large': 'visual-size-large',
        'custom': 'visual-size-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      style: 'moderate',
      type: 'mixed',
      size: 'medium'
    }
  }
);

// Visual Cues Toggle Props
interface VisualCuesToggleProps extends VariantProps<typeof visualCuesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Visual Cues Toggle Component
export const VisualCuesToggle = React.forwardRef<HTMLButtonElement, VisualCuesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.visualCues);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          visualCues: newState
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
            ? 'bg-pink-600 text-white border-pink-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable visual cues' : 'Enable visual cues'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Visual cues enabled' : 'Visual cues disabled'}
          </span>
        )}
      </button>
    );
  }
);

VisualCuesToggle.displayName = 'VisualCuesToggle';

// Visual Cues Provider Props
interface VisualCuesProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
  type?: 'icon' | 'color' | 'shape' | 'mixed';
  applyToBody?: boolean;
}

// Visual Cues Provider Component
export const VisualCuesProvider = React.forwardRef<HTMLDivElement, VisualCuesProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    style = 'moderate',
    type = 'mixed',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.visualCues) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.visualCues]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing visual cues classes
        document.body.classList.remove(
          'visual-cues-standard',
          'visual-cues-enhanced',
          'visual-cues-prominent',
          'visual-cues-custom'
        );
        
        document.body.classList.add(`visual-cues-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          visualCuesVariants({ mode: currentMode, style, type }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VisualCuesProvider.displayName = 'VisualCuesProvider';

// Visual Cues Icon Component
interface VisualCuesIconProps extends VariantProps<typeof visualCuesVariants> {
  className?: string;
  icon?: string;
  label?: string;
  type?: 'icon' | 'color' | 'shape' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
}

export const VisualCuesIcon = React.forwardRef<HTMLDivElement, VisualCuesIconProps>(
  ({ 
    className, 
    icon = '📌',
    label,
    type = 'icon',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVisualCuesEnabled = config.cognitive.visualCues;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-2 rounded-md transition-all duration-300',
          visualCuesVariants({ 
            mode: isVisualCuesEnabled ? 'enhanced' : mode,
            style,
            type
          }),
          className
        )}
        {...props}
      >
        <span className="text-lg">{icon}</span>
        {label && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
      </div>
    );
  }
);

VisualCuesIcon.displayName = 'VisualCuesIcon';

// Visual Cues Badge Component
interface VisualCuesBadgeProps extends VariantProps<typeof visualCuesVariants> {
  className?: string;
  children: React.ReactNode;
  type?: 'icon' | 'color' | 'shape' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export const VisualCuesBadge = React.forwardRef<HTMLDivElement, VisualCuesBadgeProps>(
  ({ 
    className, 
    children,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    variant = 'default',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVisualCuesEnabled = config.cognitive.visualCues;

    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300',
          visualCuesVariants({ 
            mode: isVisualCuesEnabled ? 'enhanced' : mode,
            style,
            type
          }),
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VisualCuesBadge.displayName = 'VisualCuesBadge';

// Visual Cues Indicator Component
interface VisualCuesIndicatorProps extends VariantProps<typeof visualCuesVariants> {
  className?: string;
  children: React.ReactNode;
  type?: 'icon' | 'color' | 'shape' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
  status?: 'active' | 'inactive' | 'pending' | 'complete';
}

export const VisualCuesIndicator = React.forwardRef<HTMLDivElement, VisualCuesIndicatorProps>(
  ({ 
    className, 
    children,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    status = 'active',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVisualCuesEnabled = config.cognitive.visualCues;

    const statusClasses = {
      active: 'bg-green-500 text-white',
      inactive: 'bg-gray-400 text-white',
      pending: 'bg-yellow-500 text-white',
      complete: 'bg-blue-500 text-white'
    };

    const statusIcons = {
      active: '●',
      inactive: '○',
      pending: '◐',
      complete: '✓'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-2 rounded-md transition-all duration-300',
          visualCuesVariants({ 
            mode: isVisualCuesEnabled ? 'enhanced' : mode,
            style,
            type
          }),
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'w-3 h-3 rounded-full flex items-center justify-center text-xs font-bold',
            statusClasses[status]
          )}
        >
          {statusIcons[status]}
        </div>
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {children}
        </span>
      </div>
    );
  }
);

VisualCuesIndicator.displayName = 'VisualCuesIndicator';

// Visual Cues Status Component
interface VisualCuesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VisualCuesStatus = React.forwardRef<HTMLDivElement, VisualCuesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isVisualCuesEnabled = config.cognitive.visualCues;

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
          Visual Cues: {isVisualCuesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isVisualCuesEnabled 
              ? 'Enhanced visual cues and indicators' 
              : 'Standard visual cues'
            }
          </div>
        )}
      </div>
    );
  }
);

VisualCuesStatus.displayName = 'VisualCuesStatus';

// Visual Cues Demo Component
interface VisualCuesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VisualCuesDemo = React.forwardRef<HTMLDivElement, VisualCuesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isVisualCuesEnabled = config.cognitive.visualCues;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Visual Cues Demo</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium mb-2">Icons</h4>
            <div className="flex gap-2">
              <VisualCuesIcon
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                icon="🏠"
                label="Home"
              />
              <VisualCuesIcon
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                icon="✈️"
                label="Flights"
              />
              <VisualCuesIcon
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                icon="🏨"
                label="Hotels"
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Badges</h4>
            <div className="flex gap-2">
              <VisualCuesBadge
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                variant="success"
              >
                Available
              </VisualCuesBadge>
              <VisualCuesBadge
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                variant="warning"
              >
                Limited
              </VisualCuesBadge>
              <VisualCuesBadge
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                variant="error"
              >
                Sold Out
              </VisualCuesBadge>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Status Indicators</h4>
            <div className="space-y-2">
              <VisualCuesIndicator
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                status="active"
              >
                Booking in progress
              </VisualCuesIndicator>
              <VisualCuesIndicator
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                status="pending"
              >
                Payment pending
              </VisualCuesIndicator>
              <VisualCuesIndicator
                mode={isVisualCuesEnabled ? 'enhanced' : 'standard'}
                style={isVisualCuesEnabled ? 'bold' : 'moderate'}
                status="complete"
              >
                Booking confirmed
              </VisualCuesIndicator>
            </div>
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isVisualCuesEnabled 
                ? 'Enhanced visual cues are enabled. Icons, badges, and indicators provide clear visual guidance.'
                : 'Standard visual cues are used. Enable enhanced visual cues for better visual guidance.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

VisualCuesDemo.displayName = 'VisualCuesDemo';

// Export all components
export {
  visualCuesVariants,
  type VisualCuesToggleProps,
  type VisualCuesProviderProps,
  type VisualCuesIconProps,
  type VisualCuesBadgeProps,
  type VisualCuesIndicatorProps,
  type VisualCuesStatusProps,
  type VisualCuesDemoProps
};
