/**
 * Inclusive Features Component
 * 
 * Provides inclusive features support for comprehensive accessibility.
 * Implements WCAG 2.1 AA inclusive features requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Inclusive Features Variants
const inclusiveFeaturesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'inclusive-features-standard',
        'enhanced': 'inclusive-features-enhanced',
        'comprehensive': 'inclusive-features-comprehensive',
        'custom': 'inclusive-features-custom'
      },
      type: {
        'cultural': 'features-type-cultural',
        'linguistic': 'features-type-linguistic',
        'cognitive': 'features-type-cognitive',
        'physical': 'features-type-physical',
        'mixed': 'features-type-mixed'
      },
      style: {
        'minimal': 'features-style-minimal',
        'moderate': 'features-style-moderate',
        'detailed': 'features-style-detailed',
        'custom': 'features-style-custom'
      },
      format: {
        'text': 'features-format-text',
        'visual': 'features-format-visual',
        'interactive': 'features-format-interactive',
        'mixed': 'features-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Inclusive Features Toggle Props
interface InclusiveFeaturesToggleProps extends VariantProps<typeof inclusiveFeaturesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Inclusive Features Toggle Component
export const InclusiveFeaturesToggle = React.forwardRef<HTMLButtonElement, InclusiveFeaturesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.inclusiveFeatures);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          inclusiveFeatures: newState
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
            ? 'bg-pink-600 text-white border-pink-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable inclusive features' : 'Enable inclusive features'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Inclusive features enabled' : 'Inclusive features disabled'}
          </span>
        )}
      </button>
    );
  }
);

InclusiveFeaturesToggle.displayName = 'InclusiveFeaturesToggle';

// Inclusive Features Provider Props
interface InclusiveFeaturesProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'cultural' | 'linguistic' | 'cognitive' | 'physical' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Inclusive Features Provider Component
export const InclusiveFeaturesProvider = React.forwardRef<HTMLDivElement, InclusiveFeaturesProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'mixed',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.comprehensive.inclusiveFeatures) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.inclusiveFeatures]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing inclusive features classes
        document.body.classList.remove(
          'inclusive-features-standard',
          'inclusive-features-enhanced',
          'inclusive-features-comprehensive',
          'inclusive-features-custom'
        );
        
        document.body.classList.add(`inclusive-features-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          inclusiveFeaturesVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InclusiveFeaturesProvider.displayName = 'InclusiveFeaturesProvider';

// Inclusive Features Showcase Component
interface InclusiveFeaturesShowcaseProps extends VariantProps<typeof inclusiveFeaturesVariants> {
  className?: string;
  onFeatureSelect?: (feature: string) => void;
  type?: 'cultural' | 'linguistic' | 'cognitive' | 'physical' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const InclusiveFeaturesShowcase = React.forwardRef<HTMLDivElement, InclusiveFeaturesShowcaseProps>(
  ({ 
    className, 
    onFeatureSelect,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isInclusiveFeaturesEnabled = config.comprehensive.inclusiveFeatures;
    const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

    const features = [
      {
        id: 'cultural',
        name: 'Cultural Inclusivity',
        description: 'Features that respect and accommodate diverse cultural backgrounds.',
        icon: '🌍',
        examples: [
          'Multi-language support',
          'Cultural date formats',
          'Currency localization',
          'Cultural color meanings',
          'Religious considerations'
        ]
      },
      {
        id: 'linguistic',
        name: 'Linguistic Accessibility',
        description: 'Support for multiple languages and communication styles.',
        icon: '🗣️',
        examples: [
          'Right-to-left text support',
          'Multiple language interfaces',
          'Translation services',
          'Simplified language options',
          'Sign language support'
        ]
      },
      {
        id: 'cognitive',
        name: 'Cognitive Accessibility',
        description: 'Features that support different cognitive abilities and learning styles.',
        icon: '🧠',
        examples: [
          'Simplified interfaces',
          'Progress indicators',
          'Memory aids',
          'Clear instructions',
          'Error prevention'
        ]
      },
      {
        id: 'physical',
        name: 'Physical Accessibility',
        description: 'Support for different physical abilities and mobility needs.',
        icon: '♿',
        examples: [
          'Keyboard navigation',
          'Voice control',
          'Large touch targets',
          'Switch control',
          'Eye tracking'
        ]
      }
    ];

    const handleFeatureSelect = useCallback((featureId: string) => {
      setSelectedFeature(featureId);
      onFeatureSelect?.(featureId);
    }, [onFeatureSelect]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          inclusiveFeaturesVariants({ 
            mode: isInclusiveFeaturesEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Inclusive Features Showcase
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => handleFeatureSelect(feature.id)}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                selectedFeature === feature.id
                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <div className="flex-1">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {feature.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {feature.description}
                  </p>
                  <div className="space-y-1">
                    {feature.examples.slice(0, 3).map((example, index) => (
                      <div key={index} className="text-xs text-gray-500 dark:text-gray-500">
                        • {example}
                      </div>
                    ))}
                    {feature.examples.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        • +{feature.examples.length - 3} more features
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedFeature && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
            <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Selected Feature Details
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {features.find(f => f.id === selectedFeature)?.description}
            </p>
          </div>
        )}
      </div>
    );
  }
);

InclusiveFeaturesShowcase.displayName = 'InclusiveFeaturesShowcase';

// Inclusive Features Status Component
interface InclusiveFeaturesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const InclusiveFeaturesStatus = React.forwardRef<HTMLDivElement, InclusiveFeaturesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isInclusiveFeaturesEnabled = config.comprehensive.inclusiveFeatures;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-pink-500" />
        <span className="font-medium">
          Inclusive Features: {isInclusiveFeaturesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isInclusiveFeaturesEnabled 
              ? 'Enhanced inclusive features and cultural accessibility' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

InclusiveFeaturesStatus.displayName = 'InclusiveFeaturesStatus';

// Inclusive Features Demo Component
interface InclusiveFeaturesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const InclusiveFeaturesDemo = React.forwardRef<HTMLDivElement, InclusiveFeaturesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isInclusiveFeaturesEnabled = config.comprehensive.inclusiveFeatures;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Inclusive Features Demo</h3>
        
        <InclusiveFeaturesShowcase
          mode={isInclusiveFeaturesEnabled ? 'enhanced' : 'standard'}
          type={isInclusiveFeaturesEnabled ? 'mixed' : 'mixed'}
          style={isInclusiveFeaturesEnabled ? 'detailed' : 'moderate'}
          onFeatureSelect={(feature) => console.log('Selected feature:', feature)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isInclusiveFeaturesEnabled 
                ? 'Inclusive features are enabled. Comprehensive cultural and linguistic accessibility is available.'
                : 'Standard accessibility features are used. Enable inclusive features for enhanced cultural accessibility.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

InclusiveFeaturesDemo.displayName = 'InclusiveFeaturesDemo';

// Export all components
export {
  inclusiveFeaturesVariants,
  type InclusiveFeaturesToggleProps,
  type InclusiveFeaturesProviderProps,
  type InclusiveFeaturesShowcaseProps,
  type InclusiveFeaturesStatusProps,
  type InclusiveFeaturesDemoProps
};
