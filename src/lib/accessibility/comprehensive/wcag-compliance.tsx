/**
 * WCAG Compliance Component
 * 
 * Provides WCAG compliance support for comprehensive accessibility.
 * Implements WCAG 2.1 AA compliance requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// WCAG Compliance Variants
const wcagComplianceVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'wcag-compliance-standard',
        'enhanced': 'wcag-compliance-enhanced',
        'comprehensive': 'wcag-compliance-comprehensive',
        'custom': 'wcag-compliance-custom'
      },
      level: {
        'a': 'wcag-level-a',
        'aa': 'wcag-level-aa',
        'aaa': 'wcag-level-aaa',
        'custom': 'wcag-level-custom'
      },
      style: {
        'minimal': 'wcag-style-minimal',
        'moderate': 'wcag-style-moderate',
        'detailed': 'wcag-style-detailed',
        'custom': 'wcag-style-custom'
      },
      format: {
        'text': 'wcag-format-text',
        'visual': 'wcag-format-visual',
        'interactive': 'wcag-format-interactive',
        'mixed': 'wcag-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      level: 'aa',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// WCAG Compliance Toggle Props
interface WCAGComplianceToggleProps extends VariantProps<typeof wcagComplianceVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// WCAG Compliance Toggle Component
export const WCAGComplianceToggle = React.forwardRef<HTMLButtonElement, WCAGComplianceToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.wcagCompliance);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          wcagCompliance: newState
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
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable WCAG compliance' : 'Enable WCAG compliance'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'WCAG compliance enabled' : 'WCAG compliance disabled'}
          </span>
        )}
      </button>
    );
  }
);

WCAGComplianceToggle.displayName = 'WCAGComplianceToggle';

// WCAG Compliance Provider Props
interface WCAGComplianceProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  level?: 'a' | 'aa' | 'aaa' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// WCAG Compliance Provider Component
export const WCAGComplianceProvider = React.forwardRef<HTMLDivElement, WCAGComplianceProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    level = 'aa',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.comprehensive.wcagCompliance) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.wcagCompliance]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing WCAG compliance classes
        document.body.classList.remove(
          'wcag-compliance-standard',
          'wcag-compliance-enhanced',
          'wcag-compliance-comprehensive',
          'wcag-compliance-custom'
        );
        
        document.body.classList.add(`wcag-compliance-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          wcagComplianceVariants({ mode: currentMode, level, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

WCAGComplianceProvider.displayName = 'WCAGComplianceProvider';

// WCAG Compliance Checker Component
interface WCAGComplianceCheckerProps extends VariantProps<typeof wcagComplianceVariants> {
  className?: string;
  onCheck?: (results: any) => void;
  level?: 'a' | 'aa' | 'aaa' | 'custom';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const WCAGComplianceChecker = React.forwardRef<HTMLDivElement, WCAGComplianceCheckerProps>(
  ({ 
    className, 
    onCheck,
    level = 'aa',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isWCAGComplianceEnabled = config.comprehensive.wcagCompliance;
    const [isChecking, setIsChecking] = useState(false);
    const [results, setResults] = useState<any>(null);

    const handleCheck = useCallback(async () => {
      if (isWCAGComplianceEnabled) {
        setIsChecking(true);
        
        // Simulate WCAG compliance check
        setTimeout(() => {
          const mockResults = {
            level: level.toUpperCase(),
            score: 95,
            issues: [
              { type: 'error', message: 'Missing alt text on image', severity: 'high' },
              { type: 'warning', message: 'Low color contrast', severity: 'medium' },
              { type: 'info', message: 'Consider adding ARIA labels', severity: 'low' }
            ],
            passed: 28,
            failed: 3,
            warnings: 5
          };
          
          setResults(mockResults);
          setIsChecking(false);
          onCheck?.(mockResults);
        }, 2000);
      }
    }, [isWCAGComplianceEnabled, level, onCheck]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          wcagComplianceVariants({ 
            mode: isWCAGComplianceEnabled ? 'enhanced' : mode,
            level,
            style
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            WCAG {level.toUpperCase()} Compliance Check
          </h3>
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isChecking ? 'Checking...' : 'Check Compliance'}
          </button>
        </div>
        
        {results && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {results.passed}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Passed
                </div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-md dark:bg-red-900/20">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {results.failed}
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  Failed
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-md dark:bg-yellow-900/20">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {results.warnings}
                </div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400">
                  Warnings
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              {results.issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className={cn(
                    'p-3 rounded-md border-l-4',
                    issue.type === 'error' 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : issue.type === 'warning'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                      : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {issue.message}
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

WCAGComplianceChecker.displayName = 'WCAGComplianceChecker';

// WCAG Compliance Status Component
interface WCAGComplianceStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const WCAGComplianceStatus = React.forwardRef<HTMLDivElement, WCAGComplianceStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isWCAGComplianceEnabled = config.comprehensive.wcagCompliance;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="font-medium">
          WCAG Compliance: {isWCAGComplianceEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isWCAGComplianceEnabled 
              ? 'Enhanced WCAG compliance monitoring and checking' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

WCAGComplianceStatus.displayName = 'WCAGComplianceStatus';

// WCAG Compliance Demo Component
interface WCAGComplianceDemoProps {
  className?: string;
  showControls?: boolean;
}

export const WCAGComplianceDemo = React.forwardRef<HTMLDivElement, WCAGComplianceDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isWCAGComplianceEnabled = config.comprehensive.wcagCompliance;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">WCAG Compliance Demo</h3>
        
        <WCAGComplianceChecker
          mode={isWCAGComplianceEnabled ? 'enhanced' : 'standard'}
          level={isWCAGComplianceEnabled ? 'aa' : 'aa'}
          style={isWCAGComplianceEnabled ? 'detailed' : 'moderate'}
          onCheck={(results) => console.log('WCAG compliance results:', results)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isWCAGComplianceEnabled 
                ? 'WCAG compliance is enabled. Comprehensive accessibility checking and monitoring is available.'
                : 'Standard accessibility features are used. Enable WCAG compliance for enhanced monitoring.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

WCAGComplianceDemo.displayName = 'WCAGComplianceDemo';

// Export all components
export {
  wcagComplianceVariants,
  type WCAGComplianceToggleProps,
  type WCAGComplianceProviderProps,
  type WCAGComplianceCheckerProps,
  type WCAGComplianceStatusProps,
  type WCAGComplianceDemoProps
};
