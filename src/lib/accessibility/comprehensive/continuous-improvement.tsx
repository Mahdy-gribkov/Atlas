/**
 * Continuous Improvement Component
 * 
 * Provides continuous improvement support for comprehensive accessibility.
 * Implements WCAG 2.1 AA continuous improvement requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Continuous Improvement Variants
const continuousImprovementVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'continuous-improvement-standard',
        'enhanced': 'continuous-improvement-enhanced',
        'comprehensive': 'continuous-improvement-comprehensive',
        'custom': 'continuous-improvement-custom'
      },
      type: {
        'analytics': 'improvement-type-analytics',
        'optimization': 'improvement-type-optimization',
        'monitoring': 'improvement-type-monitoring',
        'learning': 'improvement-type-learning',
        'mixed': 'improvement-type-mixed'
      },
      style: {
        'minimal': 'improvement-style-minimal',
        'moderate': 'improvement-style-moderate',
        'detailed': 'improvement-style-detailed',
        'custom': 'improvement-style-custom'
      },
      format: {
        'text': 'improvement-format-text',
        'visual': 'improvement-format-visual',
        'interactive': 'improvement-format-interactive',
        'mixed': 'improvement-format-mixed'
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

// Continuous Improvement Toggle Props
interface ContinuousImprovementToggleProps extends VariantProps<typeof continuousImprovementVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Continuous Improvement Toggle Component
export const ContinuousImprovementToggle = React.forwardRef<HTMLButtonElement, ContinuousImprovementToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.continuousImprovement);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          continuousImprovement: newState
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
        aria-label={isEnabled ? 'Disable continuous improvement' : 'Enable continuous improvement'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Continuous improvement enabled' : 'Continuous improvement disabled'}
          </span>
        )}
      </button>
    );
  }
);

ContinuousImprovementToggle.displayName = 'ContinuousImprovementToggle';

// Continuous Improvement Provider Props
interface ContinuousImprovementProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'analytics' | 'optimization' | 'monitoring' | 'learning' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Continuous Improvement Provider Component
export const ContinuousImprovementProvider = React.forwardRef<HTMLDivElement, ContinuousImprovementProviderProps>(
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
      if (config.comprehensive.continuousImprovement) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.continuousImprovement]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing continuous improvement classes
        document.body.classList.remove(
          'continuous-improvement-standard',
          'continuous-improvement-enhanced',
          'continuous-improvement-comprehensive',
          'continuous-improvement-custom'
        );
        
        document.body.classList.add(`continuous-improvement-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          continuousImprovementVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContinuousImprovementProvider.displayName = 'ContinuousImprovementProvider';

// Continuous Improvement Dashboard Component
interface ContinuousImprovementDashboardProps extends VariantProps<typeof continuousImprovementVariants> {
  className?: string;
  onMetricSelect?: (metric: string) => void;
  type?: 'analytics' | 'optimization' | 'monitoring' | 'learning' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const ContinuousImprovementDashboard = React.forwardRef<HTMLDivElement, ContinuousImprovementDashboardProps>(
  ({ 
    className, 
    onMetricSelect,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isContinuousImprovementEnabled = config.comprehensive.continuousImprovement;
    const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
    const [metrics, setMetrics] = useState({
      accessibilityScore: 92,
      userSatisfaction: 88,
      performanceScore: 95,
      errorRate: 2.1,
      improvementRate: 15.3
    });

    const improvementAreas = [
      {
        id: 'analytics',
        name: 'Analytics & Insights',
        description: 'Track accessibility metrics and user behavior patterns.',
        icon: '📊',
        metrics: [
          'Accessibility Score: 92%',
          'User Engagement: +15%',
          'Error Rate: -8%',
          'Completion Rate: 94%'
        ],
        trend: 'up'
      },
      {
        id: 'optimization',
        name: 'Performance Optimization',
        description: 'Continuously optimize accessibility features and performance.',
        icon: '⚡',
        metrics: [
          'Load Time: -23%',
          'Accessibility Score: +12%',
          'User Satisfaction: +18%',
          'Error Reduction: -15%'
        ],
        trend: 'up'
      },
      {
        id: 'monitoring',
        name: 'Real-time Monitoring',
        description: 'Monitor accessibility compliance and user experience in real-time.',
        icon: '🔍',
        metrics: [
          'Uptime: 99.9%',
          'Response Time: 120ms',
          'Accessibility Checks: 24/7',
          'Issue Detection: 95%'
        ],
        trend: 'stable'
      },
      {
        id: 'learning',
        name: 'Machine Learning',
        description: 'Learn from user interactions to improve accessibility features.',
        icon: '🤖',
        metrics: [
          'Prediction Accuracy: 89%',
          'User Preference Learning: 92%',
          'Accessibility Suggestions: 87%',
          'Personalization: 94%'
        ],
        trend: 'up'
      }
    ];

    const handleMetricSelect = useCallback((metricId: string) => {
      setSelectedMetric(metricId);
      onMetricSelect?.(metricId);
    }, [onMetricSelect]);

    const getTrendIcon = (trend: string) => {
      switch (trend) {
        case 'up': return '📈';
        case 'down': return '📉';
        case 'stable': return '➡️';
        default: return '📊';
      }
    };

    const getTrendColor = (trend: string) => {
      switch (trend) {
        case 'up': return 'text-green-600 dark:text-green-400';
        case 'down': return 'text-red-600 dark:text-red-400';
        case 'stable': return 'text-blue-600 dark:text-blue-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          continuousImprovementVariants({ 
            mode: isContinuousImprovementEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Continuous Improvement Dashboard
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {metrics.accessibilityScore}%
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Accessibility Score
            </div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {metrics.userSatisfaction}%
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              User Satisfaction
            </div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {metrics.performanceScore}%
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Performance Score
            </div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {metrics.improvementRate}%
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              Improvement Rate
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {improvementAreas.map((area) => (
            <div
              key={area.id}
              onClick={() => handleMetricSelect(area.id)}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md',
                selectedMetric === area.id
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'
              )}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{area.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                      {area.name}
                    </h4>
                    <span className={cn('text-sm', getTrendColor(area.trend))}>
                      {getTrendIcon(area.trend)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {area.description}
                  </p>
                  <div className="space-y-1">
                    {area.metrics.slice(0, 2).map((metric, index) => (
                      <div key={index} className="text-xs text-gray-500 dark:text-gray-500">
                        • {metric}
                      </div>
                    ))}
                    {area.metrics.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        • +{area.metrics.length - 2} more metrics
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedMetric && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
            <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
              Selected Improvement Area
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {improvementAreas.find(a => a.id === selectedMetric)?.description}
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-cyan-600 text-white rounded-md hover:bg-cyan-700">
                View Details
              </button>
              <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500">
                Export Report
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

ContinuousImprovementDashboard.displayName = 'ContinuousImprovementDashboard';

// Continuous Improvement Status Component
interface ContinuousImprovementStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ContinuousImprovementStatus = React.forwardRef<HTMLDivElement, ContinuousImprovementStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isContinuousImprovementEnabled = config.comprehensive.continuousImprovement;

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
          Continuous Improvement: {isContinuousImprovementEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isContinuousImprovementEnabled 
              ? 'Enhanced continuous improvement and optimization' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

ContinuousImprovementStatus.displayName = 'ContinuousImprovementStatus';

// Continuous Improvement Demo Component
interface ContinuousImprovementDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ContinuousImprovementDemo = React.forwardRef<HTMLDivElement, ContinuousImprovementDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isContinuousImprovementEnabled = config.comprehensive.continuousImprovement;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Continuous Improvement Demo</h3>
        
        <ContinuousImprovementDashboard
          mode={isContinuousImprovementEnabled ? 'enhanced' : 'standard'}
          type={isContinuousImprovementEnabled ? 'mixed' : 'mixed'}
          style={isContinuousImprovementEnabled ? 'detailed' : 'moderate'}
          onMetricSelect={(metric) => console.log('Selected metric:', metric)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isContinuousImprovementEnabled 
                ? 'Continuous improvement is enabled. Advanced analytics and optimization features are available.'
                : 'Standard accessibility features are used. Enable continuous improvement for enhanced analytics.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

ContinuousImprovementDemo.displayName = 'ContinuousImprovementDemo';

// Export all components
export {
  continuousImprovementVariants,
  type ContinuousImprovementToggleProps,
  type ContinuousImprovementProviderProps,
  type ContinuousImprovementDashboardProps,
  type ContinuousImprovementStatusProps,
  type ContinuousImprovementDemoProps
};
