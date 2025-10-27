/**
 * Switch Navigation Component
 * 
 * Provides switch navigation support for motor accessibility.
 * Implements WCAG 2.1 AA switch navigation requirements and assistive device support.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Switch Navigation Variants
const switchNavigationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'basic': 'switch-basic',
        'advanced': 'switch-advanced',
        'expert': 'switch-expert',
        'custom': 'switch-custom'
      },
      speed: {
        'slow': 'switch-speed-slow',
        'normal': 'switch-speed-normal',
        'fast': 'switch-speed-fast',
        'instant': 'switch-speed-instant'
      },
      style: {
        'default': 'switch-style-default',
        'highlight': 'switch-style-highlight',
        'outline': 'switch-style-outline',
        'glow': 'switch-style-glow'
      },
      feedback: {
        'none': 'switch-feedback-none',
        'visual': 'switch-feedback-visual',
        'audio': 'switch-feedback-audio',
        'haptic': 'switch-feedback-haptic',
        'all': 'switch-feedback-all'
      }
    },
    defaultVariants: {
      mode: 'basic',
      speed: 'normal',
      style: 'default',
      feedback: 'visual'
    }
  }
);

// Switch Navigation Toggle Props
interface SwitchNavigationToggleProps extends VariantProps<typeof switchNavigationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Switch Navigation Toggle Component
export const SwitchNavigationToggle = React.forwardRef<HTMLButtonElement, SwitchNavigationToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.switchNavigation);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          switchNavigation: newState
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
            ? 'bg-teal-600 text-white border-teal-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable switch navigation' : 'Enable switch navigation'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Switch navigation enabled' : 'Switch navigation disabled'}
          </span>
        )}
      </button>
    );
  }
);

SwitchNavigationToggle.displayName = 'SwitchNavigationToggle';

// Switch Navigation Provider Props
interface SwitchNavigationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
  speed?: 'slow' | 'normal' | 'fast' | 'instant';
  style?: 'default' | 'highlight' | 'outline' | 'glow';
  applyToBody?: boolean;
}

// Switch Navigation Provider Component
export const SwitchNavigationProvider = React.forwardRef<HTMLDivElement, SwitchNavigationProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'basic', 
    speed = 'normal',
    style = 'default',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.switchNavigation) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('basic');
      }
    }, [config.motor.switchNavigation, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing switch navigation classes
        document.body.classList.remove(
          'switch-basic',
          'switch-advanced',
          'switch-expert',
          'switch-custom'
        );
        
        if (config.motor.switchNavigation) {
          document.body.classList.add(`switch-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.motor.switchNavigation]);

    return (
      <div
        ref={ref}
        className={cn(
          switchNavigationVariants({ mode: currentMode, speed, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SwitchNavigationProvider.displayName = 'SwitchNavigationProvider';

// Switch Navigation Button Component
interface SwitchNavigationButtonProps extends VariantProps<typeof switchNavigationVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  switchAction?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
}

export const SwitchNavigationButton = React.forwardRef<HTMLButtonElement, SwitchNavigationButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    switchAction,
    mode = 'basic',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isSwitchNavigationEnabled = config.motor.switchNavigation;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          switchNavigationVariants({ 
            mode: isSwitchNavigationEnabled ? mode : 'basic'
          }),
          className
        )}
        data-switch-action={switchAction}
        aria-describedby={switchAction ? `${ref}-switch-info` : undefined}
        {...props}
      >
        {children}
        {switchAction && (
          <span id={`${ref}-switch-info`} className="sr-only">
            Switch action: {switchAction}
          </span>
        )}
      </button>
    );
  }
);

SwitchNavigationButton.displayName = 'SwitchNavigationButton';

// Switch Navigation Menu Component
interface SwitchNavigationMenuProps extends VariantProps<typeof switchNavigationVariants> {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
}

export const SwitchNavigationMenu = React.forwardRef<HTMLDivElement, SwitchNavigationMenuProps>(
  ({ children, className, orientation = 'horizontal', mode = 'basic', ...props }, ref) => {
    const { config } = useAccessibility();
    const isSwitchNavigationEnabled = config.motor.switchNavigation;

    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          switchNavigationVariants({ 
            mode: isSwitchNavigationEnabled ? mode : 'basic'
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

SwitchNavigationMenu.displayName = 'SwitchNavigationMenu';

// Switch Navigation Status Component
interface SwitchNavigationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SwitchNavigationStatus = React.forwardRef<HTMLDivElement, SwitchNavigationStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isSwitchNavigationEnabled = config.motor.switchNavigation;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-teal-500" />
        <span className="font-medium">
          Switch Navigation: {isSwitchNavigationEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isSwitchNavigationEnabled 
              ? 'Switch-based navigation and assistive device support' 
              : 'Standard navigation only'
            }
          </div>
        )}
      </div>
    );
  }
);

SwitchNavigationStatus.displayName = 'SwitchNavigationStatus';

// Switch Navigation Demo Component
interface SwitchNavigationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const SwitchNavigationDemo = React.forwardRef<HTMLDivElement, SwitchNavigationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isSwitchNavigationEnabled = config.motor.switchNavigation;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Switch Navigation Demo</h3>
        
        <div className="flex gap-2">
          <SwitchNavigationButton
            mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
            switchAction="next"
            onClick={() => console.log('Next clicked')}
          >
            Next
          </SwitchNavigationButton>
          
          <SwitchNavigationButton
            mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
            switchAction="previous"
            onClick={() => console.log('Previous clicked')}
          >
            Previous
          </SwitchNavigationButton>
          
          <SwitchNavigationButton
            mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
            switchAction="select"
            onClick={() => console.log('Select clicked')}
          >
            Select
          </SwitchNavigationButton>
        </div>
        
        <SwitchNavigationMenu
          orientation="horizontal"
          mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
        >
          <SwitchNavigationButton
            mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
            switchAction="menu-item-1"
            onClick={() => console.log('Menu item 1 clicked')}
          >
            Menu Item 1
          </SwitchNavigationButton>
          
          <SwitchNavigationButton
            mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
            switchAction="menu-item-2"
            onClick={() => console.log('Menu item 2 clicked')}
          >
            Menu Item 2
          </SwitchNavigationButton>
          
          <SwitchNavigationButton
            mode={isSwitchNavigationEnabled ? 'advanced' : 'basic'}
            switchAction="menu-item-3"
            onClick={() => console.log('Menu item 3 clicked')}
          >
            Menu Item 3
          </SwitchNavigationButton>
        </SwitchNavigationMenu>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSwitchNavigationEnabled 
                ? 'Switch navigation is enabled. Use assistive switches to navigate and interact.'
                : 'Standard navigation is used. Enable switch navigation for assistive device support.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

SwitchNavigationDemo.displayName = 'SwitchNavigationDemo';

// Export all components
export {
  switchNavigationVariants,
  type SwitchNavigationToggleProps,
  type SwitchNavigationProviderProps,
  type SwitchNavigationButtonProps,
  type SwitchNavigationMenuProps,
  type SwitchNavigationStatusProps,
  type SwitchNavigationDemoProps
};
