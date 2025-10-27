/**
 * Keyboard Navigation Component
 * 
 * Provides comprehensive keyboard navigation support for motor accessibility.
 * Implements WCAG 2.1 AA keyboard navigation requirements and focus management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { focusUtils, keyboardUtils } from '../core/accessibility-utils';

// Keyboard Navigation Variants
const keyboardNavigationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'keyboard-standard',
        'enhanced': 'keyboard-enhanced',
        'minimal': 'keyboard-minimal',
        'expert': 'keyboard-expert'
      },
      style: {
        'default': 'keyboard-default',
        'highlight': 'keyboard-highlight',
        'outline': 'keyboard-outline',
        'glow': 'keyboard-glow'
      },
      speed: {
        'slow': 'keyboard-slow',
        'normal': 'keyboard-normal',
        'fast': 'keyboard-fast',
        'instant': 'keyboard-instant'
      },
      scope: {
        'local': 'keyboard-local',
        'global': 'keyboard-global',
        'modal': 'keyboard-modal',
        'page': 'keyboard-page'
      }
    },
    defaultVariants: {
      mode: 'standard',
      style: 'default',
      speed: 'normal',
      scope: 'global'
    }
  }
);

// Keyboard Navigation Toggle Props
interface KeyboardNavigationToggleProps extends VariantProps<typeof keyboardNavigationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Keyboard Navigation Toggle Component
export const KeyboardNavigationToggle = React.forwardRef<HTMLButtonElement, KeyboardNavigationToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.keyboardNavigation);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          keyboardNavigation: newState
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
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable keyboard navigation' : 'Enable keyboard navigation'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Keyboard navigation enabled' : 'Keyboard navigation disabled'}
          </span>
        )}
      </button>
    );
  }
);

KeyboardNavigationToggle.displayName = 'KeyboardNavigationToggle';

// Keyboard Navigation Provider Props
interface KeyboardNavigationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'expert';
  style?: 'default' | 'highlight' | 'outline' | 'glow';
  speed?: 'slow' | 'normal' | 'fast' | 'instant';
  scope?: 'local' | 'global' | 'modal' | 'page';
  applyToBody?: boolean;
}

// Keyboard Navigation Provider Component
export const KeyboardNavigationProvider = React.forwardRef<HTMLDivElement, KeyboardNavigationProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    style = 'default',
    speed = 'normal',
    scope = 'global',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.keyboardNavigation) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('minimal');
      }
    }, [config.motor.keyboardNavigation, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing keyboard navigation classes
        document.body.classList.remove(
          'keyboard-standard',
          'keyboard-enhanced',
          'keyboard-minimal',
          'keyboard-expert'
        );
        
        if (config.motor.keyboardNavigation) {
          document.body.classList.add(`keyboard-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.motor.keyboardNavigation]);

    return (
      <div
        ref={ref}
        className={cn(
          keyboardNavigationVariants({ mode: currentMode, style, speed, scope }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KeyboardNavigationProvider.displayName = 'KeyboardNavigationProvider';

// Keyboard Navigation Button Component
interface KeyboardNavigationButtonProps extends VariantProps<typeof keyboardNavigationVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  shortcut?: string;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'expert';
}

export const KeyboardNavigationButton = React.forwardRef<HTMLButtonElement, KeyboardNavigationButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    shortcut,
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isKeyboardNavigationEnabled = config.motor.keyboardNavigation;

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (shortcut && event.key === shortcut) {
        event.preventDefault();
        onClick?.();
      }
    }, [shortcut, onClick]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          keyboardNavigationVariants({ 
            mode: isKeyboardNavigationEnabled ? mode : 'minimal'
          }),
          className
        )}
        aria-describedby={shortcut ? `${ref}-shortcut` : undefined}
        {...props}
      >
        {children}
        {shortcut && (
          <span id={`${ref}-shortcut`} className="sr-only">
            Keyboard shortcut: {keyboardUtils.getKeyboardShortcutDescription([shortcut])}
          </span>
        )}
      </button>
    );
  }
);

KeyboardNavigationButton.displayName = 'KeyboardNavigationButton';

// Keyboard Navigation Menu Component
interface KeyboardNavigationMenuProps extends VariantProps<typeof keyboardNavigationVariants> {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  mode?: 'standard' | 'enhanced' | 'minimal' | 'expert';
}

export const KeyboardNavigationMenu = React.forwardRef<HTMLDivElement, KeyboardNavigationMenuProps>(
  ({ children, className, orientation = 'horizontal', mode = 'standard', ...props }, ref) => {
    const { config } = useAccessibility();
    const isKeyboardNavigationEnabled = config.motor.keyboardNavigation;

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (!isKeyboardNavigationEnabled) return;

      const menuItems = Array.from(ref.current?.querySelectorAll('[role="menuitem"]') || []);
      const currentIndex = menuItems.indexOf(event.target as Element);

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (orientation === 'vertical') {
            const nextIndex = (currentIndex + 1) % menuItems.length;
            (menuItems[nextIndex] as HTMLElement)?.focus();
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (orientation === 'vertical') {
            const prevIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
            (menuItems[prevIndex] as HTMLElement)?.focus();
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (orientation === 'horizontal') {
            const nextIndex = (currentIndex + 1) % menuItems.length;
            (menuItems[nextIndex] as HTMLElement)?.focus();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (orientation === 'horizontal') {
            const prevIndex = currentIndex === 0 ? menuItems.length - 1 : currentIndex - 1;
            (menuItems[prevIndex] as HTMLElement)?.focus();
          }
          break;
        case 'Home':
          event.preventDefault();
          (menuItems[0] as HTMLElement)?.focus();
          break;
        case 'End':
          event.preventDefault();
          (menuItems[menuItems.length - 1] as HTMLElement)?.focus();
          break;
      }
    }, [isKeyboardNavigationEnabled, orientation, ref]);

    return (
      <div
        ref={ref}
        role="menu"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex gap-2',
          orientation === 'vertical' ? 'flex-col' : 'flex-row',
          keyboardNavigationVariants({ 
            mode: isKeyboardNavigationEnabled ? mode : 'minimal'
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

KeyboardNavigationMenu.displayName = 'KeyboardNavigationMenu';

// Keyboard Navigation Item Component
interface KeyboardNavigationItemProps extends VariantProps<typeof keyboardNavigationVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  mode?: 'standard' | 'enhanced' | 'minimal' | 'expert';
}

export const KeyboardNavigationItem = React.forwardRef<HTMLDivElement, KeyboardNavigationItemProps>(
  ({ children, className, onClick, disabled, mode = 'standard', ...props }, ref) => {
    const { config } = useAccessibility();
    const isKeyboardNavigationEnabled = config.motor.keyboardNavigation;

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.();
      }
    }, [onClick]);

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={disabled ? -1 : 0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'px-3 py-2 rounded-md cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          keyboardNavigationVariants({ 
            mode: isKeyboardNavigationEnabled ? mode : 'minimal'
          }),
          className
        )}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KeyboardNavigationItem.displayName = 'KeyboardNavigationItem';

// Keyboard Navigation Status Component
interface KeyboardNavigationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const KeyboardNavigationStatus = React.forwardRef<HTMLDivElement, KeyboardNavigationStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isKeyboardNavigationEnabled = config.motor.keyboardNavigation;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="font-medium">
          Keyboard Navigation: {isKeyboardNavigationEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isKeyboardNavigationEnabled 
              ? 'Enhanced keyboard navigation and focus management' 
              : 'Standard keyboard navigation'
            }
          </div>
        )}
      </div>
    );
  }
);

KeyboardNavigationStatus.displayName = 'KeyboardNavigationStatus';

// Keyboard Navigation Demo Component
interface KeyboardNavigationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const KeyboardNavigationDemo = React.forwardRef<HTMLDivElement, KeyboardNavigationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isKeyboardNavigationEnabled = config.motor.keyboardNavigation;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Keyboard Navigation Demo</h3>
        
        <KeyboardNavigationMenu
          orientation="horizontal"
          mode={isKeyboardNavigationEnabled ? 'enhanced' : 'minimal'}
        >
          <KeyboardNavigationItem
            mode={isKeyboardNavigationEnabled ? 'enhanced' : 'minimal'}
            onClick={() => console.log('Home clicked')}
          >
            Home
          </KeyboardNavigationItem>
          <KeyboardNavigationItem
            mode={isKeyboardNavigationEnabled ? 'enhanced' : 'minimal'}
            onClick={() => console.log('About clicked')}
          >
            About
          </KeyboardNavigationItem>
          <KeyboardNavigationItem
            mode={isKeyboardNavigationEnabled ? 'enhanced' : 'minimal'}
            onClick={() => console.log('Contact clicked')}
          >
            Contact
          </KeyboardNavigationItem>
        </KeyboardNavigationMenu>
        
        <div className="flex gap-2">
          <KeyboardNavigationButton
            mode={isKeyboardNavigationEnabled ? 'enhanced' : 'minimal'}
            shortcut="s"
            onClick={() => console.log('Save clicked')}
          >
            Save
          </KeyboardNavigationButton>
          <KeyboardNavigationButton
            mode={isKeyboardNavigationEnabled ? 'enhanced' : 'minimal'}
            shortcut="c"
            onClick={() => console.log('Cancel clicked')}
          >
            Cancel
          </KeyboardNavigationButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use Tab to navigate between elements, Enter/Space to activate, and arrow keys for menu navigation.
            </p>
          </div>
        )}
      </div>
    );
  }
);

KeyboardNavigationDemo.displayName = 'KeyboardNavigationDemo';

// Export all components
export {
  keyboardNavigationVariants,
  type KeyboardNavigationToggleProps,
  type KeyboardNavigationProviderProps,
  type KeyboardNavigationButtonProps,
  type KeyboardNavigationMenuProps,
  type KeyboardNavigationItemProps,
  type KeyboardNavigationStatusProps,
  type KeyboardNavigationDemoProps
};
