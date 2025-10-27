/**
 * Help Systems Component
 * 
 * Provides help systems support for cognitive accessibility.
 * Implements WCAG 2.1 AA help systems requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Help Systems Variants
const helpSystemsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'help-systems-standard',
        'enhanced': 'help-systems-enhanced',
        'comprehensive': 'help-systems-comprehensive',
        'custom': 'help-systems-custom'
      },
      level: {
        'basic': 'help-level-basic',
        'intermediate': 'help-level-intermediate',
        'advanced': 'help-level-advanced',
        'expert': 'help-level-expert'
      },
      style: {
        'minimal': 'help-style-minimal',
        'moderate': 'help-style-moderate',
        'detailed': 'help-style-detailed',
        'custom': 'help-style-custom'
      },
      format: {
        'text': 'help-format-text',
        'visual': 'help-format-visual',
        'interactive': 'help-format-interactive',
        'mixed': 'help-format-mixed'
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

// Help Systems Toggle Props
interface HelpSystemsToggleProps extends VariantProps<typeof helpSystemsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Help Systems Toggle Component
export const HelpSystemsToggle = React.forwardRef<HTMLButtonElement, HelpSystemsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.helpSystems);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          helpSystems: newState
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
            ? 'bg-cyan-600 text-white border-cyan-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable help systems' : 'Enable help systems'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Help systems enabled' : 'Help systems disabled'}
          </span>
        )}
      </button>
    );
  }
);

HelpSystemsToggle.displayName = 'HelpSystemsToggle';

// Help Systems Provider Props
interface HelpSystemsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Help Systems Provider Component
export const HelpSystemsProvider = React.forwardRef<HTMLDivElement, HelpSystemsProviderProps>(
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
      if (config.cognitive.helpSystems) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.helpSystems]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing help systems classes
        document.body.classList.remove(
          'help-systems-standard',
          'help-systems-enhanced',
          'help-systems-comprehensive',
          'help-systems-custom'
        );
        
        document.body.classList.add(`help-systems-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          helpSystemsVariants({ mode: currentMode, level, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HelpSystemsProvider.displayName = 'HelpSystemsProvider';

// Help Systems Tooltip Component
interface HelpSystemsTooltipProps extends VariantProps<typeof helpSystemsVariants> {
  className?: string;
  content?: string;
  title?: string;
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const HelpSystemsTooltip = React.forwardRef<HTMLDivElement, HelpSystemsTooltipProps>(
  ({ 
    className, 
    content,
    title,
    level = 'intermediate',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isHelpSystemsEnabled = config.cognitive.helpSystems;

    return (
      <div
        ref={ref}
        className={cn(
          'p-3 rounded-lg border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          helpSystemsVariants({ 
            mode: isHelpSystemsEnabled ? 'enhanced' : mode,
            level,
            style
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div className="flex-1">
            {title && (
              <h4 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">
                {title}
              </h4>
            )}
            {content && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {content}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

HelpSystemsTooltip.displayName = 'HelpSystemsTooltip';

// Help Systems FAQ Component
interface HelpSystemsFAQProps extends VariantProps<typeof helpSystemsVariants> {
  className?: string;
  title?: string;
  questions: Array<{ question: string; answer: string }>;
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const HelpSystemsFAQ = React.forwardRef<HTMLDivElement, HelpSystemsFAQProps>(
  ({ 
    className, 
    title,
    questions,
    level = 'intermediate',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isHelpSystemsEnabled = config.cognitive.helpSystems;
    const [expandedItems, setExpandedItems] = useState<number[]>([]);

    const handleToggle = useCallback((index: number) => {
      setExpandedItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          helpSystemsVariants({ 
            mode: isHelpSystemsEnabled ? 'enhanced' : mode,
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
        
        <div className="space-y-2">
          {questions.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-md dark:border-gray-600">
              <button
                onClick={() => handleToggle(index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {item.question}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {expandedItems.includes(index) ? '−' : '+'}
                </span>
              </button>
              
              {expandedItems.includes(index) && (
                <div className="px-4 pb-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

HelpSystemsFAQ.displayName = 'HelpSystemsFAQ';

// Help Systems Guide Component
interface HelpSystemsGuideProps extends VariantProps<typeof helpSystemsVariants> {
  className?: string;
  title?: string;
  steps: string[];
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const HelpSystemsGuide = React.forwardRef<HTMLDivElement, HelpSystemsGuideProps>(
  ({ 
    className, 
    title,
    steps,
    level = 'intermediate',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isHelpSystemsEnabled = config.cognitive.helpSystems;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          helpSystemsVariants({ 
            mode: isHelpSystemsEnabled ? 'enhanced' : mode,
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
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-medium flex items-center justify-center flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

HelpSystemsGuide.displayName = 'HelpSystemsGuide';

// Help Systems Status Component
interface HelpSystemsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const HelpSystemsStatus = React.forwardRef<HTMLDivElement, HelpSystemsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isHelpSystemsEnabled = config.cognitive.helpSystems;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-cyan-500" />
        <span className="font-medium">
          Help Systems: {isHelpSystemsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isHelpSystemsEnabled 
              ? 'Enhanced help systems and guidance' 
              : 'Standard help systems'
            }
          </div>
        )}
      </div>
    );
  }
);

HelpSystemsStatus.displayName = 'HelpSystemsStatus';

// Help Systems Demo Component
interface HelpSystemsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const HelpSystemsDemo = React.forwardRef<HTMLDivElement, HelpSystemsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isHelpSystemsEnabled = config.cognitive.helpSystems;

    const faqQuestions = [
      {
        question: 'How do I book a flight?',
        answer: 'Select your destination, choose dates, and follow the booking process step by step.'
      },
      {
        question: 'Can I cancel my booking?',
        answer: 'Yes, you can cancel your booking within 24 hours for a full refund.'
      },
      {
        question: 'How do I contact support?',
        answer: 'You can contact support through the help center or by calling our customer service line.'
      }
    ];

    const guideSteps = [
      'Enter your destination city or country',
      'Select your travel dates',
      'Choose your accommodation preferences',
      'Review and confirm your booking',
      'Complete payment and receive confirmation'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Help Systems Demo</h3>
        
        <div className="space-y-4">
          <HelpSystemsTooltip
            mode={isHelpSystemsEnabled ? 'enhanced' : 'standard'}
            level={isHelpSystemsEnabled ? 'advanced' : 'intermediate'}
            style={isHelpSystemsEnabled ? 'detailed' : 'moderate'}
            title="Booking Tips"
            content="Make sure to check multiple dates for better prices and read reviews before booking."
          />
          
          <HelpSystemsFAQ
            mode={isHelpSystemsEnabled ? 'enhanced' : 'standard'}
            level={isHelpSystemsEnabled ? 'advanced' : 'intermediate'}
            style={isHelpSystemsEnabled ? 'detailed' : 'moderate'}
            title="Frequently Asked Questions"
            questions={faqQuestions}
          />
          
          <HelpSystemsGuide
            mode={isHelpSystemsEnabled ? 'enhanced' : 'standard'}
            level={isHelpSystemsEnabled ? 'advanced' : 'intermediate'}
            style={isHelpSystemsEnabled ? 'detailed' : 'moderate'}
            title="How to Book a Trip"
            steps={guideSteps}
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isHelpSystemsEnabled 
                ? 'Enhanced help systems are enabled. Use tooltips, FAQs, and guides for comprehensive assistance.'
                : 'Standard help systems are used. Enable enhanced help systems for better assistance.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

HelpSystemsDemo.displayName = 'HelpSystemsDemo';

// Export all components
export {
  helpSystemsVariants,
  type HelpSystemsToggleProps,
  type HelpSystemsProviderProps,
  type HelpSystemsTooltipProps,
  type HelpSystemsFAQProps,
  type HelpSystemsGuideProps,
  type HelpSystemsStatusProps,
  type HelpSystemsDemoProps
};
