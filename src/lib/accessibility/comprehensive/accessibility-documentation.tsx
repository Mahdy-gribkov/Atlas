/**
 * Accessibility Documentation Component
 * 
 * Provides accessibility documentation support for comprehensive accessibility.
 * Implements WCAG 2.1 AA accessibility documentation requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Accessibility Documentation Variants
const accessibilityDocumentationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'accessibility-documentation-standard',
        'enhanced': 'accessibility-documentation-enhanced',
        'comprehensive': 'accessibility-documentation-comprehensive',
        'custom': 'accessibility-documentation-custom'
      },
      type: {
        'guidelines': 'documentation-type-guidelines',
        'tutorials': 'documentation-type-tutorials',
        'examples': 'documentation-type-examples',
        'reference': 'documentation-type-reference',
        'mixed': 'documentation-type-mixed'
      },
      style: {
        'minimal': 'documentation-style-minimal',
        'moderate': 'documentation-style-moderate',
        'detailed': 'documentation-style-detailed',
        'custom': 'documentation-style-custom'
      },
      format: {
        'text': 'documentation-format-text',
        'visual': 'documentation-format-visual',
        'interactive': 'documentation-format-interactive',
        'mixed': 'documentation-format-mixed'
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

// Accessibility Documentation Toggle Props
interface AccessibilityDocumentationToggleProps extends VariantProps<typeof accessibilityDocumentationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Accessibility Documentation Toggle Component
export const AccessibilityDocumentationToggle = React.forwardRef<HTMLButtonElement, AccessibilityDocumentationToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.accessibilityDocumentation);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          accessibilityDocumentation: newState
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
        aria-label={isEnabled ? 'Disable accessibility documentation' : 'Enable accessibility documentation'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Accessibility documentation enabled' : 'Accessibility documentation disabled'}
          </span>
        )}
      </button>
    );
  }
);

AccessibilityDocumentationToggle.displayName = 'AccessibilityDocumentationToggle';

// Accessibility Documentation Provider Props
interface AccessibilityDocumentationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'guidelines' | 'tutorials' | 'examples' | 'reference' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Accessibility Documentation Provider Component
export const AccessibilityDocumentationProvider = React.forwardRef<HTMLDivElement, AccessibilityDocumentationProviderProps>(
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
      if (config.comprehensive.accessibilityDocumentation) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.accessibilityDocumentation]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing accessibility documentation classes
        document.body.classList.remove(
          'accessibility-documentation-standard',
          'accessibility-documentation-enhanced',
          'accessibility-documentation-comprehensive',
          'accessibility-documentation-custom'
        );
        
        document.body.classList.add(`accessibility-documentation-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          accessibilityDocumentationVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccessibilityDocumentationProvider.displayName = 'AccessibilityDocumentationProvider';

// Accessibility Documentation Browser Component
interface AccessibilityDocumentationBrowserProps extends VariantProps<typeof accessibilityDocumentationVariants> {
  className?: string;
  onDocumentSelect?: (document: string) => void;
  type?: 'guidelines' | 'tutorials' | 'examples' | 'reference' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const AccessibilityDocumentationBrowser = React.forwardRef<HTMLDivElement, AccessibilityDocumentationBrowserProps>(
  ({ 
    className, 
    onDocumentSelect,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityDocumentationEnabled = config.comprehensive.accessibilityDocumentation;
    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

    const documents = [
      {
        id: 'guidelines',
        name: 'Accessibility Guidelines',
        description: 'Comprehensive guidelines for implementing accessibility features.',
        icon: '📋',
        sections: [
          'WCAG 2.1 AA Compliance',
          'Visual Accessibility',
          'Motor Accessibility',
          'Cognitive Accessibility',
          'Hearing Accessibility'
        ]
      },
      {
        id: 'tutorials',
        name: 'Implementation Tutorials',
        description: 'Step-by-step tutorials for implementing accessibility features.',
        icon: '🎓',
        sections: [
          'Getting Started',
          'Component Implementation',
          'Testing Procedures',
          'Best Practices',
          'Common Pitfalls'
        ]
      },
      {
        id: 'examples',
        name: 'Code Examples',
        description: 'Practical examples and code snippets for accessibility implementation.',
        icon: '💻',
        sections: [
          'React Components',
          'CSS Styling',
          'ARIA Implementation',
          'Keyboard Navigation',
          'Screen Reader Support'
        ]
      },
      {
        id: 'reference',
        name: 'API Reference',
        description: 'Complete reference for accessibility APIs and utilities.',
        icon: '📚',
        sections: [
          'Component Props',
          'Hooks and Utilities',
          'Context APIs',
          'Type Definitions',
          'Configuration Options'
        ]
      }
    ];

    const handleDocumentSelect = useCallback((documentId: string) => {
      setSelectedDocument(documentId);
      onDocumentSelect?.(documentId);
    }, [onDocumentSelect]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          accessibilityDocumentationVariants({ 
            mode: isAccessibilityDocumentationEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Accessibility Documentation
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((document) => (
            <div
              key={document.id}
              onClick={() => handleDocumentSelect(document.id)}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                selectedDocument === document.id
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{document.icon}</span>
                <div className="flex-1">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {document.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {document.description}
                  </p>
                  <div className="space-y-1">
                    {document.sections.slice(0, 3).map((section, index) => (
                      <div key={index} className="text-xs text-gray-500 dark:text-gray-500">
                        • {section}
                      </div>
                    ))}
                    {document.sections.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        • +{document.sections.length - 3} more sections
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedDocument && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
            <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Selected Documentation
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {documents.find(d => d.id === selectedDocument)?.description}
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                View Documentation
              </button>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500">
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AccessibilityDocumentationBrowser.displayName = 'AccessibilityDocumentationBrowser';

// Accessibility Documentation Status Component
interface AccessibilityDocumentationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AccessibilityDocumentationStatus = React.forwardRef<HTMLDivElement, AccessibilityDocumentationStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityDocumentationEnabled = config.comprehensive.accessibilityDocumentation;

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
          Accessibility Documentation: {isAccessibilityDocumentationEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAccessibilityDocumentationEnabled 
              ? 'Enhanced accessibility documentation and resources' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

AccessibilityDocumentationStatus.displayName = 'AccessibilityDocumentationStatus';

// Accessibility Documentation Demo Component
interface AccessibilityDocumentationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AccessibilityDocumentationDemo = React.forwardRef<HTMLDivElement, AccessibilityDocumentationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityDocumentationEnabled = config.comprehensive.accessibilityDocumentation;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Accessibility Documentation Demo</h3>
        
        <AccessibilityDocumentationBrowser
          mode={isAccessibilityDocumentationEnabled ? 'enhanced' : 'standard'}
          type={isAccessibilityDocumentationEnabled ? 'mixed' : 'mixed'}
          style={isAccessibilityDocumentationEnabled ? 'detailed' : 'moderate'}
          onDocumentSelect={(document) => console.log('Selected document:', document)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAccessibilityDocumentationEnabled 
                ? 'Accessibility documentation is enabled. Comprehensive guides and resources are available.'
                : 'Standard accessibility features are used. Enable accessibility documentation for enhanced resources.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AccessibilityDocumentationDemo.displayName = 'AccessibilityDocumentationDemo';

// Export all components
export {
  accessibilityDocumentationVariants,
  type AccessibilityDocumentationToggleProps,
  type AccessibilityDocumentationProviderProps,
  type AccessibilityDocumentationBrowserProps,
  type AccessibilityDocumentationStatusProps,
  type AccessibilityDocumentationDemoProps
};
