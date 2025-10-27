/**
 * Visual Notifications Component
 * 
 * Provides visual notifications support for hearing accessibility.
 * Implements WCAG 2.1 AA visual notifications requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Visual Notifications Variants
const visualNotificationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'visual-notifications-standard',
        'enhanced': 'visual-notifications-enhanced',
        'prominent': 'visual-notifications-prominent',
        'custom': 'visual-notifications-custom'
      },
      type: {
        'alert': 'notification-type-alert',
        'info': 'notification-type-info',
        'success': 'notification-type-success',
        'warning': 'notification-type-warning',
        'error': 'notification-type-error'
      },
      style: {
        'subtle': 'notification-style-subtle',
        'moderate': 'notification-style-moderate',
        'bold': 'notification-style-bold',
        'custom': 'notification-style-custom'
      },
      position: {
        'top': 'notification-position-top',
        'bottom': 'notification-position-bottom',
        'center': 'notification-position-center',
        'custom': 'notification-position-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'info',
      style: 'moderate',
      position: 'top'
    }
  }
);

// Visual Notifications Toggle Props
interface VisualNotificationsToggleProps extends VariantProps<typeof visualNotificationsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Visual Notifications Toggle Component
export const VisualNotificationsToggle = React.forwardRef<HTMLButtonElement, VisualNotificationsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.visualNotifications);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          visualNotifications: newState
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
        aria-label={isEnabled ? 'Disable visual notifications' : 'Enable visual notifications'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Visual notifications enabled' : 'Visual notifications disabled'}
          </span>
        )}
      </button>
    );
  }
);

VisualNotificationsToggle.displayName = 'VisualNotificationsToggle';

// Visual Notifications Provider Props
interface VisualNotificationsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  type?: 'alert' | 'info' | 'success' | 'warning' | 'error';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
  applyToBody?: boolean;
}

// Visual Notifications Provider Component
export const VisualNotificationsProvider = React.forwardRef<HTMLDivElement, VisualNotificationsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'info',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.visualNotifications) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.visualNotifications]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing visual notifications classes
        document.body.classList.remove(
          'visual-notifications-standard',
          'visual-notifications-enhanced',
          'visual-notifications-prominent',
          'visual-notifications-custom'
        );
        
        document.body.classList.add(`visual-notifications-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          visualNotificationsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VisualNotificationsProvider.displayName = 'VisualNotificationsProvider';

// Visual Notifications Alert Component
interface VisualNotificationsAlertProps extends VariantProps<typeof visualNotificationsVariants> {
  className?: string;
  children: React.ReactNode;
  title?: string;
  type?: 'alert' | 'info' | 'success' | 'warning' | 'error';
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

export const VisualNotificationsAlert = React.forwardRef<HTMLDivElement, VisualNotificationsAlertProps>(
  ({ 
    className, 
    children,
    title,
    type = 'info',
    mode = 'standard',
    style = 'moderate',
    onDismiss,
    autoDismiss = false,
    duration = 5000,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVisualNotificationsEnabled = config.hearing.visualNotifications;
    const [isVisible, setIsVisible] = useState(true);

    const typeClasses = {
      alert: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      success: 'border-green-500 bg-green-50 dark:bg-green-900/20',
      warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      error: 'border-red-500 bg-red-50 dark:bg-red-900/20'
    };

    const typeIcons = {
      alert: '🔔',
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    useEffect(() => {
      if (autoDismiss && isVisible) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [autoDismiss, isVisible, duration, onDismiss]);

    const handleDismiss = useCallback(() => {
      setIsVisible(false);
      onDismiss?.();
    }, [onDismiss]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          visualNotificationsVariants({ 
            mode: isVisualNotificationsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          typeClasses[type],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">{typeIcons[type]}</span>
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
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
);

VisualNotificationsAlert.displayName = 'VisualNotificationsAlert';

// Visual Notifications Toast Component
interface VisualNotificationsToastProps extends VariantProps<typeof visualNotificationsVariants> {
  className?: string;
  children: React.ReactNode;
  type?: 'alert' | 'info' | 'success' | 'warning' | 'error';
  mode?: 'standard' | 'enhanced' | 'prominent' | 'custom';
  style?: 'subtle' | 'moderate' | 'bold' | 'custom';
  position?: 'top' | 'bottom' | 'center';
  onDismiss?: () => void;
  autoDismiss?: boolean;
  duration?: number;
}

export const VisualNotificationsToast = React.forwardRef<HTMLDivElement, VisualNotificationsToastProps>(
  ({ 
    className, 
    children,
    type = 'info',
    mode = 'standard',
    style = 'moderate',
    position = 'top',
    onDismiss,
    autoDismiss = true,
    duration = 3000,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVisualNotificationsEnabled = config.hearing.visualNotifications;
    const [isVisible, setIsVisible] = useState(true);

    const typeClasses = {
      alert: 'bg-blue-600 text-white',
      info: 'bg-blue-600 text-white',
      success: 'bg-green-600 text-white',
      warning: 'bg-yellow-600 text-white',
      error: 'bg-red-600 text-white'
    };

    const typeIcons = {
      alert: '🔔',
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    const positionClasses = {
      top: 'top-4',
      bottom: 'bottom-4',
      center: 'top-1/2 transform -translate-y-1/2'
    };

    useEffect(() => {
      if (autoDismiss && isVisible) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [autoDismiss, isVisible, duration, onDismiss]);

    const handleDismiss = useCallback(() => {
      setIsVisible(false);
      onDismiss?.();
    }, [onDismiss]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed left-1/2 transform -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg transition-all duration-300',
          visualNotificationsVariants({ 
            mode: isVisualNotificationsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          typeClasses[type],
          positionClasses[position],
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{typeIcons[type]}</span>
          <div className="flex-1 text-sm">
            {children}
          </div>
          {onDismiss && (
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
);

VisualNotificationsToast.displayName = 'VisualNotificationsToast';

// Visual Notifications Status Component
interface VisualNotificationsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VisualNotificationsStatus = React.forwardRef<HTMLDivElement, VisualNotificationsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isVisualNotificationsEnabled = config.hearing.visualNotifications;

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
          Visual Notifications: {isVisualNotificationsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isVisualNotificationsEnabled 
              ? 'Enhanced visual notifications and alerts' 
              : 'Standard notifications'
            }
          </div>
        )}
      </div>
    );
  }
);

VisualNotificationsStatus.displayName = 'VisualNotificationsStatus';

// Visual Notifications Demo Component
interface VisualNotificationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VisualNotificationsDemo = React.forwardRef<HTMLDivElement, VisualNotificationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isVisualNotificationsEnabled = config.hearing.visualNotifications;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Visual Notifications Demo</h3>
        
        <div className="space-y-4">
          <VisualNotificationsAlert
            mode={isVisualNotificationsEnabled ? 'enhanced' : 'standard'}
            type={isVisualNotificationsEnabled ? 'info' : 'info'}
            style={isVisualNotificationsEnabled ? 'bold' : 'moderate'}
            title="Information"
            onDismiss={() => console.log('Alert dismissed')}
          >
            This is an informational notification with visual emphasis.
          </VisualNotificationsAlert>
          
          <VisualNotificationsAlert
            mode={isVisualNotificationsEnabled ? 'enhanced' : 'standard'}
            type={isVisualNotificationsEnabled ? 'success' : 'success'}
            style={isVisualNotificationsEnabled ? 'bold' : 'moderate'}
            title="Success"
            onDismiss={() => console.log('Success dismissed')}
          >
            Your booking has been confirmed successfully.
          </VisualNotificationsAlert>
          
          <VisualNotificationsAlert
            mode={isVisualNotificationsEnabled ? 'enhanced' : 'standard'}
            type={isVisualNotificationsEnabled ? 'warning' : 'warning'}
            style={isVisualNotificationsEnabled ? 'bold' : 'moderate'}
            title="Warning"
            onDismiss={() => console.log('Warning dismissed')}
          >
            Please check your travel documents before departure.
          </VisualNotificationsAlert>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isVisualNotificationsEnabled 
                ? 'Enhanced visual notifications are enabled. Clear visual alerts and notifications are provided.'
                : 'Standard notifications are used. Enable visual notifications for enhanced visual alerts.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

VisualNotificationsDemo.displayName = 'VisualNotificationsDemo';

// Export all components
export {
  visualNotificationsVariants,
  type VisualNotificationsToggleProps,
  type VisualNotificationsProviderProps,
  type VisualNotificationsAlertProps,
  type VisualNotificationsToastProps,
  type VisualNotificationsStatusProps,
  type VisualNotificationsDemoProps
};
