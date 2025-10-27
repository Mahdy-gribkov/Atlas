/**
 * Language Support Component
 * 
 * Provides language support for cognitive accessibility.
 * Implements WCAG 2.1 AA language support requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Language Support Variants
const languageSupportVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'language-standard',
        'enhanced': 'language-enhanced',
        'simplified': 'language-simplified',
        'custom': 'language-custom'
      },
      level: {
        'basic': 'language-level-basic',
        'intermediate': 'language-level-intermediate',
        'advanced': 'language-level-advanced',
        'expert': 'language-level-expert'
      },
      style: {
        'formal': 'language-style-formal',
        'casual': 'language-style-casual',
        'simple': 'language-style-simple',
        'custom': 'language-style-custom'
      },
      format: {
        'text': 'language-format-text',
        'visual': 'language-format-visual',
        'audio': 'language-format-audio',
        'mixed': 'language-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      level: 'intermediate',
      style: 'casual',
      format: 'text'
    }
  }
);

// Language Support Toggle Props
interface LanguageSupportToggleProps extends VariantProps<typeof languageSupportVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Language Support Toggle Component
export const LanguageSupportToggle = React.forwardRef<HTMLButtonElement, LanguageSupportToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.languageSupport);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          languageSupport: newState
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
        aria-label={isEnabled ? 'Disable language support' : 'Enable language support'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Language support enabled' : 'Language support disabled'}
          </span>
        )}
      </button>
    );
  }
);

LanguageSupportToggle.displayName = 'LanguageSupportToggle';

// Language Support Provider Props
interface LanguageSupportProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'simplified' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  style?: 'formal' | 'casual' | 'simple' | 'custom';
  applyToBody?: boolean;
}

// Language Support Provider Component
export const LanguageSupportProvider = React.forwardRef<HTMLDivElement, LanguageSupportProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    level = 'intermediate',
    style = 'casual',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.languageSupport) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.languageSupport]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing language support classes
        document.body.classList.remove(
          'language-standard',
          'language-enhanced',
          'language-simplified',
          'language-custom'
        );
        
        document.body.classList.add(`language-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          languageSupportVariants({ mode: currentMode, level, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LanguageSupportProvider.displayName = 'LanguageSupportProvider';

// Language Support Text Component
interface LanguageSupportTextProps extends VariantProps<typeof languageSupportVariants> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mode?: 'standard' | 'enhanced' | 'simplified' | 'custom';
  style?: 'formal' | 'casual' | 'simple' | 'custom';
}

export const LanguageSupportText = React.forwardRef<HTMLDivElement, LanguageSupportTextProps>(
  ({ 
    children, 
    className, 
    title,
    level = 'intermediate',
    mode = 'standard',
    style = 'casual',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isLanguageSupportEnabled = config.cognitive.languageSupport;

    const levelClasses = {
      basic: 'text-sm text-gray-600 dark:text-gray-400',
      intermediate: 'text-base text-gray-700 dark:text-gray-300',
      advanced: 'text-lg text-gray-800 dark:text-gray-200',
      expert: 'text-xl text-gray-900 dark:text-gray-100'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          languageSupportVariants({ 
            mode: isLanguageSupportEnabled ? 'enhanced' : mode,
            level,
            style
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        <div className={levelClasses[level]}>
          {children}
        </div>
      </div>
    );
  }
);

LanguageSupportText.displayName = 'LanguageSupportText';

// Language Support Definition Component
interface LanguageSupportDefinitionProps extends VariantProps<typeof languageSupportVariants> {
  className?: string;
  term?: string;
  definition?: string;
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mode?: 'standard' | 'enhanced' | 'simplified' | 'custom';
  style?: 'formal' | 'casual' | 'simple' | 'custom';
}

export const LanguageSupportDefinition = React.forwardRef<HTMLDivElement, LanguageSupportDefinitionProps>(
  ({ 
    className, 
    term,
    definition,
    level = 'intermediate',
    mode = 'standard',
    style = 'casual',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isLanguageSupportEnabled = config.cognitive.languageSupport;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          languageSupportVariants({ 
            mode: isLanguageSupportEnabled ? 'enhanced' : mode,
            level,
            style
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">📖</span>
          <div className="flex-1">
            {term && (
              <h4 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">
                {term}
              </h4>
            )}
            {definition && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {definition}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

LanguageSupportDefinition.displayName = 'LanguageSupportDefinition';

// Language Support Glossary Component
interface LanguageSupportGlossaryProps extends VariantProps<typeof languageSupportVariants> {
  className?: string;
  title?: string;
  terms?: Array<{ term: string; definition: string }>;
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mode?: 'standard' | 'enhanced' | 'simplified' | 'custom';
  style?: 'formal' | 'casual' | 'simple' | 'custom';
}

export const LanguageSupportGlossary = React.forwardRef<HTMLDivElement, LanguageSupportGlossaryProps>(
  ({ 
    className, 
    title,
    terms = [],
    level = 'intermediate',
    mode = 'standard',
    style = 'casual',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isLanguageSupportEnabled = config.cognitive.languageSupport;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          languageSupportVariants({ 
            mode: isLanguageSupportEnabled ? 'enhanced' : mode,
            level,
            style
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
        
        <div className="space-y-3">
          {terms.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-sm">📖</span>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {item.term}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.definition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

LanguageSupportGlossary.displayName = 'LanguageSupportGlossary';

// Language Support Status Component
interface LanguageSupportStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const LanguageSupportStatus = React.forwardRef<HTMLDivElement, LanguageSupportStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isLanguageSupportEnabled = config.cognitive.languageSupport;

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
          Language Support: {isLanguageSupportEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isLanguageSupportEnabled 
              ? 'Enhanced language support and definitions' 
              : 'Standard language support'
            }
          </div>
        )}
      </div>
    );
  }
);

LanguageSupportStatus.displayName = 'LanguageSupportStatus';

// Language Support Demo Component
interface LanguageSupportDemoProps {
  className?: string;
  showControls?: boolean;
}

export const LanguageSupportDemo = React.forwardRef<HTMLDivElement, LanguageSupportDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isLanguageSupportEnabled = config.cognitive.languageSupport;

    const glossaryTerms = [
      { term: 'Itinerary', definition: 'A planned route or journey' },
      { term: 'Accommodation', definition: 'A place where you can stay overnight' },
      { term: 'Booking', definition: 'Reserving a service or accommodation' },
      { term: 'Destination', definition: 'The place you want to travel to' }
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Language Support Demo</h3>
        
        <div className="space-y-4">
          <LanguageSupportText
            mode={isLanguageSupportEnabled ? 'enhanced' : 'standard'}
            level={isLanguageSupportEnabled ? 'advanced' : 'intermediate'}
            style={isLanguageSupportEnabled ? 'simple' : 'casual'}
            title="Travel Information"
          >
            Plan your perfect trip with our comprehensive travel planning tools. Create detailed itineraries, book accommodations, and discover amazing destinations.
          </LanguageSupportText>
          
          <LanguageSupportDefinition
            mode={isLanguageSupportEnabled ? 'enhanced' : 'standard'}
            level={isLanguageSupportEnabled ? 'advanced' : 'intermediate'}
            style={isLanguageSupportEnabled ? 'simple' : 'casual'}
            term="Itinerary"
            definition="A detailed plan for a journey, including places to visit, activities, and timing."
          />
          
          <LanguageSupportGlossary
            mode={isLanguageSupportEnabled ? 'enhanced' : 'standard'}
            level={isLanguageSupportEnabled ? 'advanced' : 'intermediate'}
            style={isLanguageSupportEnabled ? 'simple' : 'casual'}
            title="Travel Glossary"
            terms={glossaryTerms}
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isLanguageSupportEnabled 
                ? 'Enhanced language support is enabled. Clear definitions and simplified language are provided.'
                : 'Standard language support is used. Enable enhanced language support for better comprehension.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

LanguageSupportDemo.displayName = 'LanguageSupportDemo';

// Export all components
export {
  languageSupportVariants,
  type LanguageSupportToggleProps,
  type LanguageSupportProviderProps,
  type LanguageSupportTextProps,
  type LanguageSupportDefinitionProps,
  type LanguageSupportGlossaryProps,
  type LanguageSupportStatusProps,
  type LanguageSupportDemoProps
};
