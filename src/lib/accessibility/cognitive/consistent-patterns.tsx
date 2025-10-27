/**
 * Consistent Patterns Component
 * 
 * Provides consistent patterns support for cognitive accessibility.
 * Implements WCAG 2.1 AA consistent patterns requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Consistent Patterns Variants
const consistentPatternsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'patterns-standard',
        'enhanced': 'patterns-enhanced',
        'strict': 'patterns-strict',
        'custom': 'patterns-custom'
      },
      level: {
        'basic': 'patterns-level-basic',
        'intermediate': 'patterns-level-intermediate',
        'advanced': 'patterns-level-advanced',
        'expert': 'patterns-level-expert'
      },
      style: {
        'minimal': 'patterns-style-minimal',
        'moderate': 'patterns-style-moderate',
        'comprehensive': 'patterns-style-comprehensive',
        'custom': 'patterns-style-custom'
      },
      format: {
        'text': 'patterns-format-text',
        'visual': 'patterns-format-visual',
        'interactive': 'patterns-format-interactive',
        'mixed': 'patterns-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      level: 'intermediate',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Consistent Patterns Toggle Props
interface ConsistentPatternsToggleProps extends VariantProps<typeof consistentPatternsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Consistent Patterns Toggle Component
export const ConsistentPatternsToggle = React.forwardRef<HTMLButtonElement, ConsistentPatternsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.consistentPatterns);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          consistentPatterns: newState
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
            ? 'bg-indigo-600 text-white border-indigo-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable consistent patterns' : 'Enable consistent patterns'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Consistent patterns enabled' : 'Consistent patterns disabled'}
          </span>
        )}
      </button>
    );
  }
);

ConsistentPatternsToggle.displayName = 'ConsistentPatternsToggle';

// Consistent Patterns Provider Props
interface ConsistentPatternsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  style?: 'minimal' | 'moderate' | 'comprehensive' | 'custom';
  applyToBody?: boolean;
}

// Consistent Patterns Provider Component
export const ConsistentPatternsProvider = React.forwardRef<HTMLDivElement, ConsistentPatternsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    level = 'intermediate',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.consistentPatterns) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.consistentPatterns]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing consistent patterns classes
        document.body.classList.remove(
          'patterns-standard',
          'patterns-enhanced',
          'patterns-strict',
          'patterns-custom'
        );
        
        document.body.classList.add(`patterns-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          consistentPatternsVariants({ mode: currentMode, level, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ConsistentPatternsProvider.displayName = 'ConsistentPatternsProvider';

// Consistent Patterns Button Component
interface ConsistentPatternsButtonProps extends VariantProps<typeof consistentPatternsVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export const ConsistentPatternsButton = React.forwardRef<HTMLButtonElement, ConsistentPatternsButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    variant = 'primary',
    mode = 'standard',
    level = 'intermediate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isConsistentPatternsEnabled = config.cognitive.consistentPatterns;

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500',
      tertiary: 'bg-transparent text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 focus:ring-blue-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed',
          consistentPatternsVariants({ 
            mode: isConsistentPatternsEnabled ? 'enhanced' : mode,
            level
          }),
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ConsistentPatternsButton.displayName = 'ConsistentPatternsButton';

// Consistent Patterns Card Component
interface ConsistentPatternsCardProps extends VariantProps<typeof consistentPatternsVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  variant?: 'default' | 'highlighted' | 'outlined' | 'filled';
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export const ConsistentPatternsCard = React.forwardRef<HTMLDivElement, ConsistentPatternsCardProps>(
  ({ 
    children, 
    className, 
    title,
    variant = 'default',
    mode = 'standard',
    level = 'intermediate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isConsistentPatternsEnabled = config.cognitive.consistentPatterns;

    const variantClasses = {
      default: 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
      highlighted: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400',
      outlined: 'border-2 border-gray-300 bg-transparent dark:border-gray-600',
      filled: 'border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          consistentPatternsVariants({ 
            mode: isConsistentPatternsEnabled ? 'enhanced' : mode,
            level
          }),
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {children}
        </div>
      </div>
    );
  }
);

ConsistentPatternsCard.displayName = 'ConsistentPatternsCard';

// Consistent Patterns List Component
interface ConsistentPatternsListProps extends VariantProps<typeof consistentPatternsVariants> {
  className?: string;
  items: string[];
  title?: string;
  type?: 'ordered' | 'unordered' | 'description';
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export const ConsistentPatternsList = React.forwardRef<HTMLDivElement, ConsistentPatternsListProps>(
  ({ 
    className, 
    items,
    title,
    type = 'unordered',
    mode = 'standard',
    level = 'intermediate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isConsistentPatternsEnabled = config.cognitive.consistentPatterns;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          consistentPatternsVariants({ 
            mode: isConsistentPatternsEnabled ? 'enhanced' : mode,
            level
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
        ) : type === 'description' ? (
          <dl className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                <dt className="font-medium text-gray-800 dark:text-gray-200">
                  {item.split(':')[0]}
                </dt>
                <dd className="ml-4">
                  {item.split(':')[1] || ''}
                </dd>
              </div>
            ))}
          </dl>
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

ConsistentPatternsList.displayName = 'ConsistentPatternsList';

// Consistent Patterns Status Component
interface ConsistentPatternsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ConsistentPatternsStatus = React.forwardRef<HTMLDivElement, ConsistentPatternsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isConsistentPatternsEnabled = config.cognitive.consistentPatterns;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-indigo-500" />
        <span className="font-medium">
          Consistent Patterns: {isConsistentPatternsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isConsistentPatternsEnabled 
              ? 'Enhanced consistent patterns and design' 
              : 'Standard patterns'
            }
          </div>
        )}
      </div>
    );
  }
);

ConsistentPatternsStatus.displayName = 'ConsistentPatternsStatus';

// Consistent Patterns Demo Component
interface ConsistentPatternsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ConsistentPatternsDemo = React.forwardRef<HTMLDivElement, ConsistentPatternsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isConsistentPatternsEnabled = config.cognitive.consistentPatterns;

    const listItems = [
      'Consistent button styles',
      'Uniform card layouts',
      'Standardized spacing',
      'Predictable navigation patterns'
    ];

    const descriptionItems = [
      'Primary Action: Main call-to-action buttons',
      'Secondary Action: Supporting action buttons',
      'Tertiary Action: Alternative action buttons',
      'Danger Action: Destructive action buttons'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Consistent Patterns Demo</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium mb-2">Button Patterns</h4>
            <div className="flex gap-2">
              <ConsistentPatternsButton
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                variant="primary"
                onClick={() => console.log('Primary clicked')}
              >
                Primary
              </ConsistentPatternsButton>
              <ConsistentPatternsButton
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                variant="secondary"
                onClick={() => console.log('Secondary clicked')}
              >
                Secondary
              </ConsistentPatternsButton>
              <ConsistentPatternsButton
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                variant="tertiary"
                onClick={() => console.log('Tertiary clicked')}
              >
                Tertiary
              </ConsistentPatternsButton>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Card Patterns</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConsistentPatternsCard
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                title="Default Card"
                variant="default"
              >
                This is a default card with consistent styling.
              </ConsistentPatternsCard>
              <ConsistentPatternsCard
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                title="Highlighted Card"
                variant="highlighted"
              >
                This is a highlighted card with consistent styling.
              </ConsistentPatternsCard>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">List Patterns</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ConsistentPatternsList
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                title="Unordered List"
                items={listItems}
                type="unordered"
              />
              <ConsistentPatternsList
                mode={isConsistentPatternsEnabled ? 'enhanced' : 'standard'}
                level={isConsistentPatternsEnabled ? 'advanced' : 'intermediate'}
                title="Description List"
                items={descriptionItems}
                type="description"
              />
            </div>
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isConsistentPatternsEnabled 
                ? 'Enhanced consistent patterns are enabled. All components follow the same design patterns.'
                : 'Standard patterns are used. Enable consistent patterns for enhanced design consistency.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

ConsistentPatternsDemo.displayName = 'ConsistentPatternsDemo';

// Export all components
export {
  consistentPatternsVariants,
  type ConsistentPatternsToggleProps,
  type ConsistentPatternsProviderProps,
  type ConsistentPatternsButtonProps,
  type ConsistentPatternsCardProps,
  type ConsistentPatternsListProps,
  type ConsistentPatternsStatusProps,
  type ConsistentPatternsDemoProps
};
