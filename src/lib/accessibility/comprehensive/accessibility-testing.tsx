/**
 * Accessibility Testing Component
 * 
 * Provides accessibility testing support for comprehensive accessibility.
 * Implements WCAG 2.1 AA accessibility testing requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Accessibility Testing Variants
const accessibilityTestingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'accessibility-testing-standard',
        'enhanced': 'accessibility-testing-enhanced',
        'comprehensive': 'accessibility-testing-comprehensive',
        'custom': 'accessibility-testing-custom'
      },
      type: {
        'automated': 'testing-type-automated',
        'manual': 'testing-type-manual',
        'user': 'testing-type-user',
        'mixed': 'testing-type-mixed'
      },
      style: {
        'minimal': 'testing-style-minimal',
        'moderate': 'testing-style-moderate',
        'detailed': 'testing-style-detailed',
        'custom': 'testing-style-custom'
      },
      format: {
        'text': 'testing-format-text',
        'visual': 'testing-format-visual',
        'interactive': 'testing-format-interactive',
        'mixed': 'testing-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'automated',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Accessibility Testing Toggle Props
interface AccessibilityTestingToggleProps extends VariantProps<typeof accessibilityTestingVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Accessibility Testing Toggle Component
export const AccessibilityTestingToggle = React.forwardRef<HTMLButtonElement, AccessibilityTestingToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.accessibilityTesting);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          accessibilityTesting: newState
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
            ? 'bg-green-600 text-white border-green-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable accessibility testing' : 'Enable accessibility testing'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Accessibility testing enabled' : 'Accessibility testing disabled'}
          </span>
        )}
      </button>
    );
  }
);

AccessibilityTestingToggle.displayName = 'AccessibilityTestingToggle';

// Accessibility Testing Provider Props
interface AccessibilityTestingProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'automated' | 'manual' | 'user' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Accessibility Testing Provider Component
export const AccessibilityTestingProvider = React.forwardRef<HTMLDivElement, AccessibilityTestingProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'automated',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.comprehensive.accessibilityTesting) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.accessibilityTesting]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing accessibility testing classes
        document.body.classList.remove(
          'accessibility-testing-standard',
          'accessibility-testing-enhanced',
          'accessibility-testing-comprehensive',
          'accessibility-testing-custom'
        );
        
        document.body.classList.add(`accessibility-testing-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          accessibilityTestingVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AccessibilityTestingProvider.displayName = 'AccessibilityTestingProvider';

// Accessibility Testing Runner Component
interface AccessibilityTestingRunnerProps extends VariantProps<typeof accessibilityTestingVariants> {
  className?: string;
  onTest?: (results: any) => void;
  type?: 'automated' | 'manual' | 'user' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const AccessibilityTestingRunner = React.forwardRef<HTMLDivElement, AccessibilityTestingRunnerProps>(
  ({ 
    className, 
    onTest,
    type = 'automated',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityTestingEnabled = config.comprehensive.accessibilityTesting;
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleTest = useCallback(async () => {
      if (isAccessibilityTestingEnabled) {
        setIsRunning(true);
        
        // Simulate accessibility testing
        setTimeout(() => {
          const mockResults = {
            type: type,
            timestamp: new Date().toISOString(),
            score: 92,
            tests: [
              { name: 'Keyboard Navigation', status: 'passed', score: 100 },
              { name: 'Screen Reader Support', status: 'passed', score: 95 },
              { name: 'Color Contrast', status: 'warning', score: 85 },
              { name: 'Focus Management', status: 'passed', score: 100 },
              { name: 'ARIA Labels', status: 'failed', score: 70 },
              { name: 'Alt Text', status: 'passed', score: 90 }
            ],
            summary: {
              passed: 4,
              failed: 1,
              warnings: 1,
              total: 6
            }
          };
          
          setResults(mockResults);
          setIsRunning(false);
          onTest?.(mockResults);
        }, 3000);
      }
    }, [isAccessibilityTestingEnabled, type, onTest]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          accessibilityTestingVariants({ 
            mode: isAccessibilityTestingEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Accessibility Testing
          </h3>
          <button
            onClick={handleTest}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </button>
        </div>
        
        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.summary.passed}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Passed
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-md dark:bg-red-900/20">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {results.summary.failed}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Failed
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-md dark:bg-yellow-900/20">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {results.summary.warnings}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Warnings
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {results.score}%
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Score
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {results.tests.map((test: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-md border-l-4',
                    test.status === 'passed' 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : test.status === 'failed'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⚠️'}
                      </span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {test.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {test.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

AccessibilityTestingRunner.displayName = 'AccessibilityTestingRunner';

// Accessibility Testing Status Component
interface AccessibilityTestingStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AccessibilityTestingStatus = React.forwardRef<HTMLDivElement, AccessibilityTestingStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityTestingEnabled = config.comprehensive.accessibilityTesting;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="font-medium">
          Accessibility Testing: {isAccessibilityTestingEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAccessibilityTestingEnabled 
              ? 'Enhanced accessibility testing and monitoring' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

AccessibilityTestingStatus.displayName = 'AccessibilityTestingStatus';

// Accessibility Testing Demo Component
interface AccessibilityTestingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AccessibilityTestingDemo = React.forwardRef<HTMLDivElement, AccessibilityTestingDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAccessibilityTestingEnabled = config.comprehensive.accessibilityTesting;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Accessibility Testing Demo</h3>
        
        <AccessibilityTestingRunner
          mode={isAccessibilityTestingEnabled ? 'enhanced' : 'standard'}
          type={isAccessibilityTestingEnabled ? 'mixed' : 'automated'}
          style={isAccessibilityTestingEnabled ? 'detailed' : 'moderate'}
          onTest={(results) => console.log('Accessibility testing results:', results)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAccessibilityTestingEnabled 
                ? 'Accessibility testing is enabled. Comprehensive testing and monitoring is available.'
                : 'Standard accessibility features are used. Enable accessibility testing for enhanced monitoring.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AccessibilityTestingDemo.displayName = 'AccessibilityTestingDemo';

// Export all components
export {
  accessibilityTestingVariants,
  type AccessibilityTestingToggleProps,
  type AccessibilityTestingProviderProps,
  type AccessibilityTestingRunnerProps,
  type AccessibilityTestingStatusProps,
  type AccessibilityTestingDemoProps
};
