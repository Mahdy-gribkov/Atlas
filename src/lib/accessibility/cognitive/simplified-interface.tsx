/**
 * Simplified Interface Component
 * 
 * Provides simplified interface support for cognitive accessibility.
 * Implements WCAG 2.1 AA simplified interface requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Simplified Interface Variants
const simplifiedInterfaceVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'simplified-standard',
        'minimal': 'simplified-minimal',
        'essential': 'simplified-essential',
        'custom': 'simplified-custom'
      },
      complexity: {
        'low': 'complexity-low',
        'medium': 'complexity-medium',
        'high': 'complexity-high',
        'adaptive': 'complexity-adaptive'
      },
      layout: {
        'standard': 'layout-standard',
        'linear': 'layout-linear',
        'grid': 'layout-grid',
        'custom': 'layout-custom'
      },
      density: {
        'sparse': 'density-sparse',
        'normal': 'density-normal',
        'compact': 'density-compact',
        'custom': 'density-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      complexity: 'medium',
      layout: 'standard',
      density: 'normal'
    }
  }
);

// Simplified Interface Toggle Props
interface SimplifiedInterfaceToggleProps extends VariantProps<typeof simplifiedInterfaceVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Simplified Interface Toggle Component
export const SimplifiedInterfaceToggle = React.forwardRef<HTMLButtonElement, SimplifiedInterfaceToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.simplifiedInterface);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          simplifiedInterface: newState
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
        aria-label={isEnabled ? 'Disable simplified interface' : 'Enable simplified interface'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Simplified interface enabled' : 'Simplified interface disabled'}
          </span>
        )}
      </button>
    );
  }
);

SimplifiedInterfaceToggle.displayName = 'SimplifiedInterfaceToggle';

// Simplified Interface Provider Props
interface SimplifiedInterfaceProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'minimal' | 'essential' | 'custom';
  complexity?: 'low' | 'medium' | 'high' | 'adaptive';
  layout?: 'standard' | 'linear' | 'grid' | 'custom';
  applyToBody?: boolean;
}

// Simplified Interface Provider Component
export const SimplifiedInterfaceProvider = React.forwardRef<HTMLDivElement, SimplifiedInterfaceProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    complexity = 'medium',
    layout = 'standard',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.simplifiedInterface) {
        setCurrentMode('minimal');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.simplifiedInterface]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing simplified interface classes
        document.body.classList.remove(
          'simplified-standard',
          'simplified-minimal',
          'simplified-essential',
          'simplified-custom'
        );
        
        document.body.classList.add(`simplified-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          simplifiedInterfaceVariants({ mode: currentMode, complexity, layout }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SimplifiedInterfaceProvider.displayName = 'SimplifiedInterfaceProvider';

// Simplified Interface Button Component
interface SimplifiedInterfaceButtonProps extends VariantProps<typeof simplifiedInterfaceVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  priority?: 'high' | 'medium' | 'low';
  mode?: 'standard' | 'minimal' | 'essential' | 'custom';
}

export const SimplifiedInterfaceButton = React.forwardRef<HTMLButtonElement, SimplifiedInterfaceButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    priority = 'medium',
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isSimplifiedInterfaceEnabled = config.cognitive.simplifiedInterface;

    const priorityClasses = {
      high: 'bg-blue-600 text-white hover:bg-blue-700',
      medium: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
      low: 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          simplifiedInterfaceVariants({ 
            mode: isSimplifiedInterfaceEnabled ? 'minimal' : mode
          }),
          priorityClasses[priority],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SimplifiedInterfaceButton.displayName = 'SimplifiedInterfaceButton';

// Simplified Interface Card Component
interface SimplifiedInterfaceCardProps extends VariantProps<typeof simplifiedInterfaceVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  priority?: 'high' | 'medium' | 'low';
  mode?: 'standard' | 'minimal' | 'essential' | 'custom';
}

export const SimplifiedInterfaceCard = React.forwardRef<HTMLDivElement, SimplifiedInterfaceCardProps>(
  ({ children, className, title, priority = 'medium', mode = 'standard', ...props }, ref) => {
    const { config } = useAccessibility();
    const isSimplifiedInterfaceEnabled = config.cognitive.simplifiedInterface;

    const priorityClasses = {
      high: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
      medium: 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600',
      low: 'border-gray-200 bg-gray-50 dark:bg-gray-900 dark:border-gray-700'
    };

    if (isSimplifiedInterfaceEnabled && priority === 'low') {
      return null; // Hide low priority items in simplified mode
    }

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          simplifiedInterfaceVariants({ 
            mode: isSimplifiedInterfaceEnabled ? 'minimal' : mode
          }),
          priorityClasses[priority],
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
        )}
        {children}
      </div>
    );
  }
);

SimplifiedInterfaceCard.displayName = 'SimplifiedInterfaceCard';

// Simplified Interface Status Component
interface SimplifiedInterfaceStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SimplifiedInterfaceStatus = React.forwardRef<HTMLDivElement, SimplifiedInterfaceStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isSimplifiedInterfaceEnabled = config.cognitive.simplifiedInterface;

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
          Simplified Interface: {isSimplifiedInterfaceEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isSimplifiedInterfaceEnabled 
              ? 'Reduced cognitive load and simplified navigation' 
              : 'Standard interface complexity'
            }
          </div>
        )}
      </div>
    );
  }
);

SimplifiedInterfaceStatus.displayName = 'SimplifiedInterfaceStatus';

// Simplified Interface Demo Component
interface SimplifiedInterfaceDemoProps {
  className?: string;
  showControls?: boolean;
}

export const SimplifiedInterfaceDemo = React.forwardRef<HTMLDivElement, SimplifiedInterfaceDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isSimplifiedInterfaceEnabled = config.cognitive.simplifiedInterface;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Simplified Interface Demo</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SimplifiedInterfaceCard
            mode={isSimplifiedInterfaceEnabled ? 'minimal' : 'standard'}
            priority="high"
            title="Primary Action"
          >
            <SimplifiedInterfaceButton
              mode={isSimplifiedInterfaceEnabled ? 'minimal' : 'standard'}
              priority="high"
              onClick={() => console.log('Primary action clicked')}
            >
              Book Trip
            </SimplifiedInterfaceButton>
          </SimplifiedInterfaceCard>
          
          <SimplifiedInterfaceCard
            mode={isSimplifiedInterfaceEnabled ? 'minimal' : 'standard'}
            priority="medium"
            title="Secondary Action"
          >
            <SimplifiedInterfaceButton
              mode={isSimplifiedInterfaceEnabled ? 'minimal' : 'standard'}
              priority="medium"
              onClick={() => console.log('Secondary action clicked')}
            >
              Save for Later
            </SimplifiedInterfaceButton>
          </SimplifiedInterfaceCard>
          
          <SimplifiedInterfaceCard
            mode={isSimplifiedInterfaceEnabled ? 'minimal' : 'standard'}
            priority="low"
            title="Additional Options"
          >
            <SimplifiedInterfaceButton
              mode={isSimplifiedInterfaceEnabled ? 'minimal' : 'standard'}
              priority="low"
              onClick={() => console.log('Additional option clicked')}
            >
              More Options
            </SimplifiedInterfaceButton>
          </SimplifiedInterfaceCard>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSimplifiedInterfaceEnabled 
                ? 'Simplified interface is enabled. Low priority items are hidden to reduce cognitive load.'
                : 'Standard interface is used. Enable simplified interface to reduce complexity.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

SimplifiedInterfaceDemo.displayName = 'SimplifiedInterfaceDemo';

// Export all components
export {
  simplifiedInterfaceVariants,
  type SimplifiedInterfaceToggleProps,
  type SimplifiedInterfaceProviderProps,
  type SimplifiedInterfaceButtonProps,
  type SimplifiedInterfaceCardProps,
  type SimplifiedInterfaceStatusProps,
  type SimplifiedInterfaceDemoProps
};
