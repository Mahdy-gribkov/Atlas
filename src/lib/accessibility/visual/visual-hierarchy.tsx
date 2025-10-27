/**
 * Visual Hierarchy Component
 * 
 * Provides visual hierarchy controls for improved content structure and accessibility.
 * Implements WCAG 2.1 AA visual hierarchy requirements and content organization.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Visual Hierarchy Variants
const visualHierarchyVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      level: {
        '1': 'text-4xl font-bold leading-tight',
        '2': 'text-3xl font-bold leading-tight',
        '3': 'text-2xl font-semibold leading-snug',
        '4': 'text-xl font-semibold leading-snug',
        '5': 'text-lg font-medium leading-normal',
        '6': 'text-base font-medium leading-normal',
        'body': 'text-base leading-relaxed',
        'small': 'text-sm leading-relaxed',
        'caption': 'text-xs leading-normal'
      },
      emphasis: {
        'none': 'font-normal',
        'light': 'font-light',
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold',
        'bold': 'font-bold',
        'extrabold': 'font-extrabold'
      },
      spacing: {
        'tight': 'space-y-1',
        'normal': 'space-y-2',
        'relaxed': 'space-y-4',
        'loose': 'space-y-6',
        'extra-loose': 'space-y-8'
      },
      contrast: {
        'low': 'opacity-60',
        'medium': 'opacity-80',
        'high': 'opacity-100',
        'extreme': 'opacity-100 brightness-150'
      },
      structure: {
        'flat': 'hierarchy-flat',
        'nested': 'hierarchy-nested',
        'grouped': 'hierarchy-grouped',
        'layered': 'hierarchy-layered'
      }
    },
    defaultVariants: {
      level: 'body',
      emphasis: 'normal',
      spacing: 'normal',
      contrast: 'high',
      structure: 'nested'
    }
  }
);

// Visual Hierarchy Toggle Props
interface VisualHierarchyToggleProps extends VariantProps<typeof visualHierarchyVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Visual Hierarchy Toggle Component
export const VisualHierarchyToggle = React.forwardRef<HTMLButtonElement, VisualHierarchyToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.visualHierarchy);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          visualHierarchy: newState
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
        aria-label={isEnabled ? 'Disable visual hierarchy' : 'Enable visual hierarchy'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex flex-col items-center">
          <div className="w-2 h-2 bg-current rounded-full" />
          <div className="w-1 h-1 bg-current rounded-full mt-1" />
          <div className="w-1 h-1 bg-current rounded-full mt-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Visual hierarchy enabled' : 'Visual hierarchy disabled'}
          </span>
        )}
      </button>
    );
  }
);

VisualHierarchyToggle.displayName = 'VisualHierarchyToggle';

// Visual Hierarchy Provider Props
interface VisualHierarchyProviderProps {
  children: React.ReactNode;
  className?: string;
  structure?: 'flat' | 'nested' | 'grouped' | 'layered';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose' | 'extra-loose';
  applyToBody?: boolean;
}

// Visual Hierarchy Provider Component
export const VisualHierarchyProvider = React.forwardRef<HTMLDivElement, VisualHierarchyProviderProps>(
  ({ 
    children, 
    className, 
    structure = 'nested', 
    spacing = 'normal',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentStructure, setCurrentStructure] = useState(structure);

    useEffect(() => {
      if (config.visual.visualHierarchy) {
        setCurrentStructure(structure);
      } else {
        setCurrentStructure('flat');
      }
    }, [config.visual.visualHierarchy, structure]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing hierarchy classes
        document.body.classList.remove(
          'hierarchy-flat',
          'hierarchy-nested',
          'hierarchy-grouped',
          'hierarchy-layered'
        );
        
        if (config.visual.visualHierarchy) {
          document.body.classList.add(`hierarchy-${currentStructure}`);
        }
      }
    }, [currentStructure, applyToBody, config.visual.visualHierarchy]);

    return (
      <div
        ref={ref}
        className={cn(
          visualHierarchyVariants({ structure: currentStructure, spacing }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VisualHierarchyProvider.displayName = 'VisualHierarchyProvider';

// Visual Hierarchy Heading Component
interface VisualHierarchyHeadingProps extends VariantProps<typeof visualHierarchyVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  emphasis?: 'none' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  contrast?: 'low' | 'medium' | 'high' | 'extreme';
}

export const VisualHierarchyHeading = React.forwardRef<HTMLElement, VisualHierarchyHeadingProps>(
  ({ children, className, as: Component = 'h1', level = '1', emphasis = 'bold', contrast = 'high', ...props }, ref) => {
    const { config } = useAccessibility();
    const isVisualHierarchyEnabled = config.visual.visualHierarchy;

    return (
      <Component
        ref={ref as any}
        className={cn(
          visualHierarchyVariants({ 
            level: isVisualHierarchyEnabled ? level : 'body',
            emphasis: isVisualHierarchyEnabled ? emphasis : 'normal',
            contrast: isVisualHierarchyEnabled ? contrast : 'high'
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

VisualHierarchyHeading.displayName = 'VisualHierarchyHeading';

// Visual Hierarchy Text Component
interface VisualHierarchyTextProps extends VariantProps<typeof visualHierarchyVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div';
  level?: 'body' | 'small' | 'caption';
  emphasis?: 'none' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  contrast?: 'low' | 'medium' | 'high' | 'extreme';
}

export const VisualHierarchyText = React.forwardRef<HTMLElement, VisualHierarchyTextProps>(
  ({ children, className, as: Component = 'p', level = 'body', emphasis = 'normal', contrast = 'high', ...props }, ref) => {
    const { config } = useAccessibility();
    const isVisualHierarchyEnabled = config.visual.visualHierarchy;

    return (
      <Component
        ref={ref as any}
        className={cn(
          visualHierarchyVariants({ 
            level: isVisualHierarchyEnabled ? level : 'body',
            emphasis: isVisualHierarchyEnabled ? emphasis : 'normal',
            contrast: isVisualHierarchyEnabled ? contrast : 'high'
          }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

VisualHierarchyText.displayName = 'VisualHierarchyText';

// Visual Hierarchy Button Component
interface VisualHierarchyButtonProps extends VariantProps<typeof visualHierarchyVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  level?: 'body' | 'small' | 'caption';
  emphasis?: 'none' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
}

export const VisualHierarchyButton = React.forwardRef<HTMLButtonElement, VisualHierarchyButtonProps>(
  ({ children, className, onClick, disabled, type = 'button', level = 'body', emphasis = 'medium', ...props }, ref) => {
    const { config } = useAccessibility();
    const isVisualHierarchyEnabled = config.visual.visualHierarchy;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          visualHierarchyVariants({ 
            level: isVisualHierarchyEnabled ? level : 'body',
            emphasis: isVisualHierarchyEnabled ? emphasis : 'normal'
          }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

VisualHierarchyButton.displayName = 'VisualHierarchyButton';

// Visual Hierarchy Card Component
interface VisualHierarchyCardProps extends VariantProps<typeof visualHierarchyVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  level?: '1' | '2' | '3' | '4' | '5' | '6';
  structure?: 'flat' | 'nested' | 'grouped' | 'layered';
}

export const VisualHierarchyCard = React.forwardRef<HTMLDivElement, VisualHierarchyCardProps>(
  ({ children, className, title, description, level = '3', structure = 'nested', ...props }, ref) => {
    const { config } = useAccessibility();
    const isVisualHierarchyEnabled = config.visual.visualHierarchy;

    return (
      <div
        ref={ref}
        className={cn(
          'p-6 rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          visualHierarchyVariants({ 
            structure: isVisualHierarchyEnabled ? structure : 'flat'
          }),
          className
        )}
        {...props}
      >
        {title && (
          <VisualHierarchyHeading
            level={isVisualHierarchyEnabled ? level : 'body'}
            emphasis={isVisualHierarchyEnabled ? 'bold' : 'normal'}
            className="mb-2"
          >
            {title}
          </VisualHierarchyHeading>
        )}
        {description && (
          <VisualHierarchyText
            level={isVisualHierarchyEnabled ? 'body' : 'body'}
            emphasis={isVisualHierarchyEnabled ? 'normal' : 'normal'}
            className="opacity-80 mb-4"
          >
            {description}
          </VisualHierarchyText>
        )}
        {children}
      </div>
    );
  }
);

VisualHierarchyCard.displayName = 'VisualHierarchyCard';

// Visual Hierarchy Status Component
interface VisualHierarchyStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VisualHierarchyStatus = React.forwardRef<HTMLDivElement, VisualHierarchyStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isVisualHierarchyEnabled = config.visual.visualHierarchy;

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
          Visual Hierarchy: {isVisualHierarchyEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isVisualHierarchyEnabled 
              ? 'Enhanced content structure and visual organization' 
              : 'Standard content layout'
            }
          </div>
        )}
      </div>
    );
  }
);

VisualHierarchyStatus.displayName = 'VisualHierarchyStatus';

// Visual Hierarchy Demo Component
interface VisualHierarchyDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VisualHierarchyDemo = React.forwardRef<HTMLDivElement, VisualHierarchyDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isVisualHierarchyEnabled = config.visual.visualHierarchy;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <VisualHierarchyHeading
          level={isVisualHierarchyEnabled ? '1' : 'body'}
          emphasis={isVisualHierarchyEnabled ? 'bold' : 'normal'}
        >
          Visual Hierarchy Demo
        </VisualHierarchyHeading>
        
        <VisualHierarchyHeading
          level={isVisualHierarchyEnabled ? '2' : 'body'}
          emphasis={isVisualHierarchyEnabled ? 'semibold' : 'normal'}
        >
          Section Heading
        </VisualHierarchyHeading>
        
        <VisualHierarchyText
          level={isVisualHierarchyEnabled ? 'body' : 'body'}
          emphasis={isVisualHierarchyEnabled ? 'normal' : 'normal'}
        >
          This is body text that demonstrates the visual hierarchy system. 
          When enabled, it provides better content structure and organization.
        </VisualHierarchyText>
        
        <VisualHierarchyHeading
          level={isVisualHierarchyEnabled ? '3' : 'body'}
          emphasis={isVisualHierarchyEnabled ? 'medium' : 'normal'}
        >
          Subsection
        </VisualHierarchyHeading>
        
        <VisualHierarchyText
          level={isVisualHierarchyEnabled ? 'small' : 'body'}
          emphasis={isVisualHierarchyEnabled ? 'light' : 'normal'}
        >
          This is smaller text that shows the hierarchy levels.
        </VisualHierarchyText>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Visual hierarchy helps organize content and improve readability.
            </p>
          </div>
        )}
      </div>
    );
  }
);

VisualHierarchyDemo.displayName = 'VisualHierarchyDemo';

// Export all components
export {
  visualHierarchyVariants,
  type VisualHierarchyToggleProps,
  type VisualHierarchyProviderProps,
  type VisualHierarchyHeadingProps,
  type VisualHierarchyTextProps,
  type VisualHierarchyButtonProps,
  type VisualHierarchyCardProps,
  type VisualHierarchyStatusProps,
  type VisualHierarchyDemoProps
};
