/**
 * Attention Management Component
 * 
 * Provides attention management support for cognitive accessibility.
 * Implements WCAG 2.1 AA attention management requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Attention Management Variants
const attentionManagementVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'attention-standard',
        'enhanced': 'attention-enhanced',
        'focused': 'attention-focused',
        'custom': 'attention-custom'
      },
      level: {
        'low': 'attention-level-low',
        'medium': 'attention-level-medium',
        'high': 'attention-level-high',
        'adaptive': 'attention-level-adaptive'
      },
      style: {
        'subtle': 'attention-style-subtle',
        'moderate': 'attention-style-moderate',
        'prominent': 'attention-style-prominent',
        'custom': 'attention-style-custom'
      },
      duration: {
        'short': 'attention-duration-short',
        'medium': 'attention-duration-medium',
        'long': 'attention-duration-long',
        'custom': 'attention-duration-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      level: 'medium',
      style: 'moderate',
      duration: 'medium'
    }
  }
);

// Attention Management Toggle Props
interface AttentionManagementToggleProps extends VariantProps<typeof attentionManagementVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Attention Management Toggle Component
export const AttentionManagementToggle = React.forwardRef<HTMLButtonElement, AttentionManagementToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.attentionManagement);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          attentionManagement: newState
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
        aria-label={isEnabled ? 'Disable attention management' : 'Enable attention management'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Attention management enabled' : 'Attention management disabled'}
          </span>
        )}
      </button>
    );
  }
);

AttentionManagementToggle.displayName = 'AttentionManagementToggle';

// Attention Management Provider Props
interface AttentionManagementProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'focused' | 'custom';
  level?: 'low' | 'medium' | 'high' | 'adaptive';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
  applyToBody?: boolean;
}

// Attention Management Provider Component
export const AttentionManagementProvider = React.forwardRef<HTMLDivElement, AttentionManagementProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    level = 'medium',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.attentionManagement) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.attentionManagement]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing attention management classes
        document.body.classList.remove(
          'attention-standard',
          'attention-enhanced',
          'attention-focused',
          'attention-custom'
        );
        
        document.body.classList.add(`attention-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          attentionManagementVariants({ mode: currentMode, level, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AttentionManagementProvider.displayName = 'AttentionManagementProvider';

// Attention Management Focus Component
interface AttentionManagementFocusProps extends VariantProps<typeof attentionManagementVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  priority?: 'high' | 'medium' | 'low';
  mode?: 'standard' | 'enhanced' | 'focused' | 'custom';
  level?: 'low' | 'medium' | 'high' | 'adaptive';
}

export const AttentionManagementFocus = React.forwardRef<HTMLDivElement, AttentionManagementFocusProps>(
  ({ 
    children, 
    className, 
    title,
    priority = 'medium',
    mode = 'standard',
    level = 'medium',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAttentionManagementEnabled = config.cognitive.attentionManagement;

    const priorityClasses = {
      high: 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg',
      medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 shadow-md',
      low: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
    };

    const priorityIcons = {
      high: '🔴',
      medium: '🟡',
      low: '🔵'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          attentionManagementVariants({ 
            mode: isAttentionManagementEnabled ? 'enhanced' : mode,
            level
          }),
          priorityClasses[priority],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">{priorityIcons[priority]}</span>
          <div className="flex-1">
            {title && (
              <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                {title}
              </h3>
            )}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

AttentionManagementFocus.displayName = 'AttentionManagementFocus';

// Attention Management Alert Component
interface AttentionManagementAlertProps extends VariantProps<typeof attentionManagementVariants> {
  className?: string;
  message?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  mode?: 'standard' | 'enhanced' | 'focused' | 'custom';
  level?: 'low' | 'medium' | 'high' | 'adaptive';
  onDismiss?: () => void;
}

export const AttentionManagementAlert = React.forwardRef<HTMLDivElement, AttentionManagementAlertProps>(
  ({ 
    className, 
    message,
    type = 'info',
    mode = 'standard',
    level = 'medium',
    onDismiss,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAttentionManagementEnabled = config.cognitive.attentionManagement;

    const typeClasses = {
      info: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      error: 'border-red-500 bg-red-50 dark:bg-red-900/20',
      success: 'border-green-500 bg-green-50 dark:bg-green-900/20'
    };

    const typeIcons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          attentionManagementVariants({ 
            mode: isAttentionManagementEnabled ? 'enhanced' : mode,
            level
          }),
          typeClasses[type],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">{typeIcons[type]}</span>
          <div className="flex-1">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {message}
            </p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    );
  }
);

AttentionManagementAlert.displayName = 'AttentionManagementAlert';

// Attention Management Timer Component
interface AttentionManagementTimerProps extends VariantProps<typeof attentionManagementVariants> {
  className?: string;
  duration?: number;
  onComplete?: () => void;
  mode?: 'standard' | 'enhanced' | 'focused' | 'custom';
  level?: 'low' | 'medium' | 'high' | 'adaptive';
}

export const AttentionManagementTimer = React.forwardRef<HTMLDivElement, AttentionManagementTimerProps>(
  ({ 
    className, 
    duration = 300,
    onComplete,
    mode = 'standard',
    level = 'medium',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAttentionManagementEnabled = config.cognitive.attentionManagement;
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      let interval: NodeJS.Timeout;
      
      if (isActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(time => {
            if (time <= 1) {
              setIsActive(false);
              onComplete?.();
              return 0;
            }
            return time - 1;
          });
        }, 1000);
      }

      return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const handleStart = useCallback(() => {
      setIsActive(true);
    }, []);

    const handlePause = useCallback(() => {
      setIsActive(false);
    }, []);

    const handleReset = useCallback(() => {
      setIsActive(false);
      setTimeLeft(duration);
    }, [duration]);

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          attentionManagementVariants({ 
            mode: isAttentionManagementEnabled ? 'enhanced' : mode,
            level
          }),
          className
        )}
        {...props}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {formatTime(timeLeft)}
          </div>
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleStart}
              disabled={isActive}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start
            </button>
            <button
              onClick={handlePause}
              disabled={!isActive}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pause
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
);

AttentionManagementTimer.displayName = 'AttentionManagementTimer';

// Attention Management Status Component
interface AttentionManagementStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AttentionManagementStatus = React.forwardRef<HTMLDivElement, AttentionManagementStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAttentionManagementEnabled = config.cognitive.attentionManagement;

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
          Attention Management: {isAttentionManagementEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAttentionManagementEnabled 
              ? 'Enhanced attention management and focus aids' 
              : 'Standard attention management'
            }
          </div>
        )}
      </div>
    );
  }
);

AttentionManagementStatus.displayName = 'AttentionManagementStatus';

// Attention Management Demo Component
interface AttentionManagementDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AttentionManagementDemo = React.forwardRef<HTMLDivElement, AttentionManagementDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAttentionManagementEnabled = config.cognitive.attentionManagement;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Attention Management Demo</h3>
        
        <div className="space-y-4">
          <AttentionManagementFocus
            mode={isAttentionManagementEnabled ? 'enhanced' : 'standard'}
            level={isAttentionManagementEnabled ? 'high' : 'medium'}
            title="Important Information"
            priority="high"
          >
            This is a high-priority message that requires your attention. Please read carefully.
          </AttentionManagementFocus>
          
          <AttentionManagementAlert
            mode={isAttentionManagementEnabled ? 'enhanced' : 'standard'}
            level={isAttentionManagementEnabled ? 'high' : 'medium'}
            message="Your booking will expire in 10 minutes. Please complete your purchase soon."
            type="warning"
          />
          
          <AttentionManagementTimer
            mode={isAttentionManagementEnabled ? 'enhanced' : 'standard'}
            level={isAttentionManagementEnabled ? 'high' : 'medium'}
            duration={300}
            onComplete={() => console.log('Timer completed')}
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAttentionManagementEnabled 
                ? 'Enhanced attention management is enabled. Use focus aids, alerts, and timers to manage attention.'
                : 'Standard attention management is used. Enable enhanced attention management for better focus aids.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AttentionManagementDemo.displayName = 'AttentionManagementDemo';

// Export all components
export {
  attentionManagementVariants,
  type AttentionManagementToggleProps,
  type AttentionManagementProviderProps,
  type AttentionManagementFocusProps,
  type AttentionManagementAlertProps,
  type AttentionManagementTimerProps,
  type AttentionManagementStatusProps,
  type AttentionManagementDemoProps
};
