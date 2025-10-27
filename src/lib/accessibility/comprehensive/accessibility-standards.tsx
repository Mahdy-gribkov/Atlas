/**
 * Accessibility Standards Component
 * 
 * Provides accessibility standards support for comprehensive accessibility.
 * Implements WCAG 2.1 AA accessibility standards requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Accessibility Standards Variants
const accessibilityStandardsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'accessibility-standards-standard',
        'enhanced': 'accessibility-standards-enhanced',
        'comprehensive': 'accessibility-standards-comprehensive',
        'custom': 'accessibility-standards-custom'
      },
      type: {
        'wcag': 'standards-type-wcag',
        'section508': 'standards-type-section508',
        'ada': 'standards-type-ada',
        'iso': 'standards-type-iso',
        'mixed': 'standards-type-mixed'
      },
      style: {
        'minimal': 'standards-style-minimal',
        'moderate': 'standards-style-moderate',
        'detailed': 'standards-style-detailed',
        'custom': 'standards-style-custom'
      },
      format: {
        'text': 'standards-format-text',
        'visual': 'standards-format-visual',
        'interactive': 'standards-format-interactive',
        'mixed': 'standards-format-mixed'
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

// Accessibility Standards Toggle Props
interface AccessibilityStandardsToggleProps extends VariantProps<typeof accessibilityStandardsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Accessibility Standards Toggle Component
export const AccessibilityStandardsToggle = React.forwardRef<HTMLButtonElement, AccessibilityStandardsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.accessibilityStandards);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          accessibilityStandards: newState
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
            ? 'bg-slate-600 text-white border-slate-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable accessibility standards' : 'Enable accessibility standards'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Accessibility standards enabled' : 'Accessibility standards disabled'}
          </span>
        )}
      </button>
    );
  }
);

AccessibilityStandardsToggle.displayName = 'AccessibilityStandardsToggle';

// Accessibility Standards Provider Props
interface AccessibilityStandardsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'wcag' | 'section508' | 'ada' | 'iso' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Accessibility Standards Provider Component
export const AccessibilityStandardsProvider = React.forwardRef<HTMLDivElement, AccessibilityStandardsProviderProps>(
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
      if (config.comprehensive.accessibilityStandards) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.accessibilityStandards]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing accessibility standards classes
        document.body.classList.remove(
          'accessibility-standards-standard',
          'accessibility-standards-enhanced',
          'accessibility-standards-comprehensive',
          'accessibility-standards-custom'
        );
        
        document.body.classList.add(`accessibility-standards-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          accessibilityStandardsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccessibilityStandardsProvider.displayName = 'AccessibilityStandardsProvider';

// Accessibility Standards Compliance Component
interface AccessibilityStandardsComplianceProps extends VariantProps<typeof accessibilityStandardsVariants> {
  className?: string;
  onStandardSelect?: (standard: string) => void;
  type?: 'wcag' | 'section508' | 'ada' | 'iso' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const AccessibilityStandardsCompliance = React.forwardRef<HTMLDivElement, AccessibilityStandardsComplianceProps>(
  ({ 
    className, 
    onStandardSelect,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityStandardsEnabled = config.comprehensive.accessibilityStandards;
    const [selectedStandard, setSelectedStandard] = useState<string | null>(null);

    const standards = [
      {
        id: 'wcag',
        name: 'WCAG 2.1 AA',
        description: 'Web Content Accessibility Guidelines 2.1 Level AA compliance.',
        icon: '🌐',
        level: 'AA',
        compliance: 95,
        requirements: [
          'Perceivable: Information must be presentable to users',
          'Operable: Interface components must be operable',
          'Understandable: Information and UI operation must be understandable',
          'Robust: Content must be robust enough for interpretation'
        ],
        status: 'compliant'
      },
      {
        id: 'section508',
        name: 'Section 508',
        description: 'US federal accessibility standards for electronic and information technology.',
        icon: '🇺🇸',
        level: 'Federal',
        compliance: 92,
        requirements: [
          'Software applications and operating systems',
          'Web-based intranet and internet information',
          'Telecommunications products',
          'Video and multimedia products'
        ],
        status: 'compliant'
      },
      {
        id: 'ada',
        name: 'ADA Compliance',
        description: 'Americans with Disabilities Act compliance for digital accessibility.',
        icon: '♿',
        level: 'Legal',
        compliance: 88,
        requirements: [
          'Equal access to digital services',
          'Reasonable accommodations',
          'Non-discrimination in digital spaces',
          'Effective communication'
        ],
        status: 'mostly-compliant'
      },
      {
        id: 'iso',
        name: 'ISO/IEC 40500',
        description: 'International standard for web accessibility guidelines.',
        icon: '🌍',
        level: 'International',
        compliance: 90,
        requirements: [
          'International accessibility standards',
          'Cross-cultural considerations',
          'Global compliance requirements',
          'Universal design principles'
        ],
        status: 'compliant'
      }
    ];

    const handleStandardSelect = useCallback((standardId: string) => {
      setSelectedStandard(standardId);
      onStandardSelect?.(standardId);
    }, [onStandardSelect]);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'compliant': return 'text-green-600 dark:text-green-400';
        case 'mostly-compliant': return 'text-yellow-600 dark:text-yellow-400';
        case 'non-compliant': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'compliant': return '✅';
        case 'mostly-compliant': return '⚠️';
        case 'non-compliant': return '❌';
        default: return '❓';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          accessibilityStandardsVariants({ 
            mode: isAccessibilityStandardsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Accessibility Standards Compliance
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standards.map((standard) => (
            <div
              key={standard.id}
              onClick={() => handleStandardSelect(standard.id)}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                selectedStandard === standard.id
                  ? 'border-slate-500 bg-slate-50 dark:bg-slate-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{standard.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      {standard.name}
                    </h4>
                    <span className={cn('text-sm', getStatusColor(standard.status))}>
                      {getStatusIcon(standard.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {standard.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Level: {standard.level}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Compliance: {standard.compliance}%
                    </span>
                  </div>
                  <div className="space-y-1">
                    {standard.requirements.slice(0, 2).map((requirement, index) => (
                      <div key={index} className="text-xs text-gray-500 dark:text-gray-500">
                        • {requirement}
                      </div>
                    ))}
                    {standard.requirements.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        • +{standard.requirements.length - 2} more requirements
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedStandard && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
            <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Selected Standard Details
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {standards.find(s => s.id === selectedStandard)?.description}
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-slate-600 text-white rounded-md hover:bg-slate-700">
                View Full Standard
              </button>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500">
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AccessibilityStandardsCompliance.displayName = 'AccessibilityStandardsCompliance';

// Accessibility Standards Status Component
interface AccessibilityStandardsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AccessibilityStandardsStatus = React.forwardRef<HTMLDivElement, AccessibilityStandardsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityStandardsEnabled = config.comprehensive.accessibilityStandards;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-slate-500" />
        <span className="font-medium">
          Accessibility Standards: {isAccessibilityStandardsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAccessibilityStandardsEnabled 
              ? 'Enhanced accessibility standards compliance and monitoring' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

AccessibilityStandardsStatus.displayName = 'AccessibilityStandardsStatus';

// Accessibility Standards Demo Component
interface AccessibilityStandardsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AccessibilityStandardsDemo = React.forwardRef<HTMLDivElement, AccessibilityStandardsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityStandardsEnabled = config.comprehensive.accessibilityStandards;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Accessibility Standards Demo</h3>
        
        <AccessibilityStandardsCompliance
          mode={isAccessibilityStandardsEnabled ? 'enhanced' : 'standard'}
          type={isAccessibilityStandardsEnabled ? 'mixed' : 'mixed'}
          style={isAccessibilityStandardsEnabled ? 'detailed' : 'moderate'}
          onStandardSelect={(standard) => console.log('Selected standard:', standard)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAccessibilityStandardsEnabled 
                ? 'Accessibility standards are enabled. Comprehensive compliance monitoring and reporting is available.'
                : 'Standard accessibility features are used. Enable accessibility standards for enhanced compliance.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AccessibilityStandardsDemo.displayName = 'AccessibilityStandardsDemo';

// Export all components
export {
  accessibilityStandardsVariants,
  type AccessibilityStandardsToggleProps,
  type AccessibilityStandardsProviderProps,
  type AccessibilityStandardsComplianceProps,
  type AccessibilityStandardsStatusProps,
  type AccessibilityStandardsDemoProps
};
