/**
 * Reading Mode Component
 * 
 * Provides reading mode for improved content readability and accessibility.
 * Implements WCAG 2.1 AA reading mode requirements and content optimization.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Reading Mode Variants
const readingModeVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'normal': 'reading-normal',
        'focus': 'reading-focus',
        'distraction-free': 'reading-distraction-free',
        'print': 'reading-print',
        'night': 'reading-night',
        'sepia': 'reading-sepia'
      },
      layout: {
        'single': 'reading-single-column',
        'multi': 'reading-multi-column',
        'wide': 'reading-wide',
        'narrow': 'reading-narrow'
      },
      typography: {
        'serif': 'reading-serif',
        'sans-serif': 'reading-sans-serif',
        'monospace': 'reading-monospace',
        'custom': 'reading-custom'
      },
      spacing: {
        'tight': 'reading-tight',
        'normal': 'reading-normal',
        'relaxed': 'reading-relaxed',
        'loose': 'reading-loose'
      },
      contrast: {
        'low': 'reading-low-contrast',
        'medium': 'reading-medium-contrast',
        'high': 'reading-high-contrast',
        'extreme': 'reading-extreme-contrast'
      }
    },
    defaultVariants: {
      mode: 'normal',
      layout: 'single',
      typography: 'sans-serif',
      spacing: 'normal',
      contrast: 'high'
    }
  }
);

// Reading Mode Toggle Props
interface ReadingModeToggleProps extends VariantProps<typeof readingModeVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Reading Mode Toggle Component
export const ReadingModeToggle = React.forwardRef<HTMLButtonElement, ReadingModeToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.readingMode);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          readingMode: newState
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
        aria-label={isEnabled ? 'Disable reading mode' : 'Enable reading mode'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Reading mode enabled' : 'Reading mode disabled'}
          </span>
        )}
      </button>
    );
  }
);

ReadingModeToggle.displayName = 'ReadingModeToggle';

// Reading Mode Selector Props
interface ReadingModeSelectorProps extends VariantProps<typeof readingModeVariants> {
  className?: string;
  onModeChange?: (mode: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Reading Mode Selector Component
export const ReadingModeSelector = React.forwardRef<HTMLDivElement, ReadingModeSelectorProps>(
  ({ 
    className, 
    onModeChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentMode, setCurrentMode] = useState('normal');

    const modes = [
      { value: 'normal', label: 'Normal', description: 'Standard reading mode', icon: '📖' },
      { value: 'focus', label: 'Focus', description: 'Highlighted reading area', icon: '🎯' },
      { value: 'distraction-free', label: 'Distraction Free', description: 'Minimal interface', icon: '🧘' },
      { value: 'print', label: 'Print', description: 'Print-optimized layout', icon: '🖨️' },
      { value: 'night', label: 'Night', description: 'Dark reading mode', icon: '🌙' },
      { value: 'sepia', label: 'Sepia', description: 'Warm sepia tone', icon: '📜' }
    ];

    const handleModeChange = useCallback((newMode: string) => {
      setCurrentMode(newMode);
      
      updateConfig({
        visual: {
          readingMode: newMode !== 'normal'
        }
      });
      
      onModeChange?.(newMode);
    }, [updateConfig, onModeChange]);

    const sizeClasses = {
      sm: 'w-48',
      md: 'w-56',
      lg: 'w-64'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600',
          sizeClasses[size],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reading Mode
          </span>
        )}
        
        <div className="flex flex-col gap-1">
          {modes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => handleModeChange(mode.value)}
              className={cn(
                'w-full px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentMode === mode.value 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set reading mode to ${mode.label}`}
              aria-pressed={currentMode === mode.value}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{mode.icon}</span>
                <div className="flex flex-col">
                  <div className="font-medium">{mode.label}</div>
                  <div className="text-xs opacity-80">{mode.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

ReadingModeSelector.displayName = 'ReadingModeSelector';

// Reading Mode Provider Props
interface ReadingModeProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'normal' | 'focus' | 'distraction-free' | 'print' | 'night' | 'sepia';
  layout?: 'single' | 'multi' | 'wide' | 'narrow';
  typography?: 'serif' | 'sans-serif' | 'monospace' | 'custom';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  applyToBody?: boolean;
}

// Reading Mode Provider Component
export const ReadingModeProvider = React.forwardRef<HTMLDivElement, ReadingModeProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'normal', 
    layout = 'single',
    typography = 'sans-serif',
    spacing = 'normal',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.visual.readingMode) {
        setCurrentMode('focus');
      } else {
        setCurrentMode('normal');
      }
    }, [config.visual.readingMode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing reading mode classes
        document.body.classList.remove(
          'reading-normal',
          'reading-focus',
          'reading-distraction-free',
          'reading-print',
          'reading-night',
          'reading-sepia'
        );
        
        if (config.visual.readingMode) {
          document.body.classList.add(`reading-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.visual.readingMode]);

    return (
      <div
        ref={ref}
        className={cn(
          readingModeVariants({ mode: currentMode, layout, typography, spacing }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ReadingModeProvider.displayName = 'ReadingModeProvider';

// Reading Mode Text Component
interface ReadingModeTextProps extends VariantProps<typeof readingModeVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  mode?: 'normal' | 'focus' | 'distraction-free' | 'print' | 'night' | 'sepia';
  typography?: 'serif' | 'sans-serif' | 'monospace' | 'custom';
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
}

export const ReadingModeText = React.forwardRef<HTMLElement, ReadingModeTextProps>(
  ({ children, className, as: Component = 'p', mode = 'normal', typography = 'sans-serif', spacing = 'normal', ...props }, ref) => {
    const { config } = useAccessibility();
    const currentMode = config.visual.readingMode ? 'focus' : mode;

    return (
      <Component
        ref={ref as any}
        className={cn(
          readingModeVariants({ mode: currentMode, typography, spacing }),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ReadingModeText.displayName = 'ReadingModeText';

// Reading Mode Article Component
interface ReadingModeArticleProps extends VariantProps<typeof readingModeVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  author?: string;
  date?: string;
  mode?: 'normal' | 'focus' | 'distraction-free' | 'print' | 'night' | 'sepia';
  layout?: 'single' | 'multi' | 'wide' | 'narrow';
  typography?: 'serif' | 'sans-serif' | 'monospace' | 'custom';
}

export const ReadingModeArticle = React.forwardRef<HTMLArticleElement, ReadingModeArticleProps>(
  ({ 
    children, 
    className, 
    title, 
    author, 
    date, 
    mode = 'normal', 
    layout = 'single',
    typography = 'sans-serif',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const currentMode = config.visual.readingMode ? 'focus' : mode;

    return (
      <article
        ref={ref}
        className={cn(
          'max-w-4xl mx-auto p-6',
          readingModeVariants({ mode: currentMode, layout, typography }),
          className
        )}
        {...props}
      >
        {title && (
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{title}</h1>
            {(author || date) && (
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {author && <span>By {author}</span>}
                {author && date && <span> • </span>}
                {date && <span>{date}</span>}
              </div>
            )}
          </header>
        )}
        
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </article>
    );
  }
);

ReadingModeArticle.displayName = 'ReadingModeArticle';

// Reading Mode Status Component
interface ReadingModeStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ReadingModeStatus = React.forwardRef<HTMLDivElement, ReadingModeStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isReadingModeEnabled = config.visual.readingMode;

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
          Reading Mode: {isReadingModeEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isReadingModeEnabled 
              ? 'Optimized layout for reading' 
              : 'Standard content layout'
            }
          </div>
        )}
      </div>
    );
  }
);

ReadingModeStatus.displayName = 'ReadingModeStatus';

// Reading Mode Demo Component
interface ReadingModeDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ReadingModeDemo = React.forwardRef<HTMLDivElement, ReadingModeDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isReadingModeEnabled = config.visual.readingMode;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Reading Mode Demo</h3>
        
        <ReadingModeArticle
          title="Sample Article"
          author="Atlas Team"
          date="2024-01-01"
          mode={isReadingModeEnabled ? 'focus' : 'normal'}
          layout={isReadingModeEnabled ? 'single' : 'multi'}
          typography={isReadingModeEnabled ? 'serif' : 'sans-serif'}
        >
          <p>
            This is a sample article demonstrating the reading mode functionality. 
            When reading mode is enabled, the content is optimized for better readability 
            with improved typography, spacing, and layout.
          </p>
          
          <p>
            The reading mode provides a distraction-free environment that helps users 
            focus on the content without being overwhelmed by interface elements.
          </p>
          
          <h2>Key Features</h2>
          <ul>
            <li>Improved typography and spacing</li>
            <li>Distraction-free layout</li>
            <li>Better contrast and readability</li>
            <li>Optimized for long-form content</li>
          </ul>
        </ReadingModeArticle>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Reading mode enhances the reading experience by optimizing content layout and typography.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ReadingModeDemo.displayName = 'ReadingModeDemo';

// Export all components
export {
  readingModeVariants,
  type ReadingModeToggleProps,
  type ReadingModeSelectorProps,
  type ReadingModeProviderProps,
  type ReadingModeTextProps,
  type ReadingModeArticleProps,
  type ReadingModeStatusProps,
  type ReadingModeDemoProps
};
