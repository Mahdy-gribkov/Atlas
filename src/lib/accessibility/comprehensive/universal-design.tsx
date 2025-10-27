/**
 * Universal Design Component
 * 
 * Provides universal design support for comprehensive accessibility.
 * Implements WCAG 2.1 AA universal design requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Universal Design Variants
const universalDesignVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'universal-design-standard',
        'enhanced': 'universal-design-enhanced',
        'comprehensive': 'universal-design-comprehensive',
        'custom': 'universal-design-custom'
      },
      principle: {
        'equitable': 'design-principle-equitable',
        'flexible': 'design-principle-flexible',
        'simple': 'design-principle-simple',
        'perceptible': 'design-principle-perceptible',
        'tolerant': 'design-principle-tolerant',
        'efficient': 'design-principle-efficient',
        'mixed': 'design-principle-mixed'
      },
      style: {
        'minimal': 'design-style-minimal',
        'moderate': 'design-style-moderate',
        'detailed': 'design-style-detailed',
        'custom': 'design-style-custom'
      },
      format: {
        'text': 'design-format-text',
        'visual': 'design-format-visual',
        'interactive': 'design-format-interactive',
        'mixed': 'design-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      principle: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Universal Design Toggle Props
interface UniversalDesignToggleProps extends VariantProps<typeof universalDesignVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Universal Design Toggle Component
export const UniversalDesignToggle = React.forwardRef<HTMLButtonElement, UniversalDesignToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.universalDesign);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          universalDesign: newState
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
        aria-label={isEnabled ? 'Disable universal design' : 'Enable universal design'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Universal design enabled' : 'Universal design disabled'}
          </span>
        )}
      </button>
    );
  }
);

UniversalDesignToggle.displayName = 'UniversalDesignToggle';

// Universal Design Provider Props
interface UniversalDesignProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  principle?: 'equitable' | 'flexible' | 'simple' | 'perceptible' | 'tolerant' | 'efficient' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Universal Design Provider Component
export const UniversalDesignProvider = React.forwardRef<HTMLDivElement, UniversalDesignProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    principle = 'mixed',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.comprehensive.universalDesign) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.universalDesign]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing universal design classes
        document.body.classList.remove(
          'universal-design-standard',
          'universal-design-enhanced',
          'universal-design-comprehensive',
          'universal-design-custom'
        );
        
        document.body.classList.add(`universal-design-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          universalDesignVariants({ mode: currentMode, principle, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UniversalDesignProvider.displayName = 'UniversalDesignProvider';

// Universal Design Principles Component
interface UniversalDesignPrinciplesProps extends VariantProps<typeof universalDesignVariants> {
  className?: string;
  onPrincipleSelect?: (principle: string) => void;
  principle?: 'equitable' | 'flexible' | 'simple' | 'perceptible' | 'tolerant' | 'efficient' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const UniversalDesignPrinciples = React.forwardRef<HTMLDivElement, UniversalDesignPrinciplesProps>(
  ({ 
    className, 
    onPrincipleSelect,
    principle = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isUniversalDesignEnabled = config.comprehensive.universalDesign;
    const [selectedPrinciple, setSelectedPrinciple] = useState(principle);

    const principles = [
      {
        id: 'equitable',
        name: 'Equitable Use',
        description: 'The design is useful and marketable to people with diverse abilities.',
        icon: '⚖️',
        examples: ['High contrast mode', 'Multiple input methods', 'Flexible layouts']
      },
      {
        id: 'flexible',
        name: 'Flexibility in Use',
        description: 'The design accommodates a wide range of individual preferences and abilities.',
        icon: '🔄',
        examples: ['Customizable interfaces', 'Multiple ways to navigate', 'Adaptive controls']
      },
      {
        id: 'simple',
        name: 'Simple and Intuitive',
        description: 'Use of the design is easy to understand, regardless of experience.',
        icon: '🎯',
        examples: ['Clear navigation', 'Consistent patterns', 'Helpful instructions']
      },
      {
        id: 'perceptible',
        name: 'Perceptible Information',
        description: 'The design communicates necessary information effectively.',
        icon: '👁️',
        examples: ['Multiple formats', 'Clear visual hierarchy', 'Audio alternatives']
      },
      {
        id: 'tolerant',
        name: 'Tolerance for Error',
        description: 'The design minimizes hazards and adverse consequences of errors.',
        icon: '🛡️',
        examples: ['Error prevention', 'Confirmation dialogs', 'Undo functionality']
      },
      {
        id: 'efficient',
        name: 'Low Physical Effort',
        description: 'The design can be used efficiently and comfortably.',
        icon: '⚡',
        examples: ['Minimal clicks', 'Keyboard shortcuts', 'Voice commands']
      }
    ];

    const handlePrincipleSelect = useCallback((principleId: string) => {
      setSelectedPrinciple(principleId as any);
      onPrincipleSelect?.(principleId);
    }, [onPrincipleSelect]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          universalDesignVariants({ 
            mode: isUniversalDesignEnabled ? 'enhanced' : mode,
            principle,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Universal Design Principles
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((principle) => (
            <div
              key={principle.id}
              onClick={() => handlePrincipleSelect(principle.id)}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                selectedPrinciple === principle.id
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{principle.icon}</span>
                <div className="flex-1">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {principle.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {principle.description}
                  </p>
                  <div className="space-y-1">
                    {principle.examples.map((example, index) => (
                      <div key={index} className="text-xs text-gray-500 dark:text-gray-500">
                        • {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

UniversalDesignPrinciples.displayName = 'UniversalDesignPrinciples';

// Universal Design Status Component
interface UniversalDesignStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const UniversalDesignStatus = React.forwardRef<HTMLDivElement, UniversalDesignStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isUniversalDesignEnabled = config.comprehensive.universalDesign;

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
          Universal Design: {isUniversalDesignEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isUniversalDesignEnabled 
              ? 'Enhanced universal design principles and inclusive features' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

UniversalDesignStatus.displayName = 'UniversalDesignStatus';

// Universal Design Demo Component
interface UniversalDesignDemoProps {
  className?: string;
  showControls?: boolean;
}

export const UniversalDesignDemo = React.forwardRef<HTMLDivElement, UniversalDesignDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isUniversalDesignEnabled = config.comprehensive.universalDesign;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Universal Design Demo</h3>
        
        <UniversalDesignPrinciples
          mode={isUniversalDesignEnabled ? 'enhanced' : 'standard'}
          principle={isUniversalDesignEnabled ? 'mixed' : 'mixed'}
          style={isUniversalDesignEnabled ? 'detailed' : 'moderate'}
          onPrincipleSelect={(principle) => console.log('Selected principle:', principle)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isUniversalDesignEnabled 
                ? 'Universal design is enabled. Comprehensive inclusive design principles are applied.'
                : 'Standard accessibility features are used. Enable universal design for enhanced inclusivity.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

UniversalDesignDemo.displayName = 'UniversalDesignDemo';

// Export all components
export {
  universalDesignVariants,
  type UniversalDesignToggleProps,
  type UniversalDesignProviderProps,
  type UniversalDesignPrinciplesProps,
  type UniversalDesignStatusProps,
  type UniversalDesignDemoProps
};
