/**
 * Assistive Technology Component
 * 
 * Provides assistive technology support for comprehensive accessibility.
 * Implements WCAG 2.1 AA assistive technology requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Assistive Technology Variants
const assistiveTechnologyVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'assistive-technology-standard',
        'enhanced': 'assistive-technology-enhanced',
        'comprehensive': 'assistive-technology-comprehensive',
        'custom': 'assistive-technology-custom'
      },
      type: {
        'screen-reader': 'technology-type-screen-reader',
        'voice-control': 'technology-type-voice-control',
        'switch-control': 'technology-type-switch-control',
        'eye-tracking': 'technology-type-eye-tracking',
        'mixed': 'technology-type-mixed'
      },
      style: {
        'minimal': 'technology-style-minimal',
        'moderate': 'technology-style-moderate',
        'detailed': 'technology-style-detailed',
        'custom': 'technology-style-custom'
      },
      format: {
        'text': 'technology-format-text',
        'visual': 'technology-format-visual',
        'interactive': 'technology-format-interactive',
        'mixed': 'technology-format-mixed'
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

// Assistive Technology Toggle Props
interface AssistiveTechnologyToggleProps extends VariantProps<typeof assistiveTechnologyVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Assistive Technology Toggle Component
export const AssistiveTechnologyToggle = React.forwardRef<HTMLButtonElement, AssistiveTechnologyToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.assistiveTechnology);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          assistiveTechnology: newState
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
            ? 'bg-orange-600 text-white border-orange-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable assistive technology' : 'Enable assistive technology'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Assistive technology enabled' : 'Assistive technology disabled'}
          </span>
        )}
      </button>
    );
  }
);

AssistiveTechnologyToggle.displayName = 'AssistiveTechnologyToggle';

// Assistive Technology Provider Props
interface AssistiveTechnologyProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'screen-reader' | 'voice-control' | 'switch-control' | 'eye-tracking' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Assistive Technology Provider Component
export const AssistiveTechnologyProvider = React.forwardRef<HTMLDivElement, AssistiveTechnologyProviderProps>(
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
      if (config.comprehensive.assistiveTechnology) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.assistiveTechnology]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing assistive technology classes
        document.body.classList.remove(
          'assistive-technology-standard',
          'assistive-technology-enhanced',
          'assistive-technology-comprehensive',
          'assistive-technology-custom'
        );
        
        document.body.classList.add(`assistive-technology-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          assistiveTechnologyVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AssistiveTechnologyProvider.displayName = 'AssistiveTechnologyProvider';

// Assistive Technology Detector Component
interface AssistiveTechnologyDetectorProps extends VariantProps<typeof assistiveTechnologyVariants> {
  className?: string;
  onDetect?: (technologies: any) => void;
  type?: 'screen-reader' | 'voice-control' | 'switch-control' | 'eye-tracking' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const AssistiveTechnologyDetector = React.forwardRef<HTMLDivElement, AssistiveTechnologyDetectorProps>(
  ({ 
    className, 
    onDetect,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAssistiveTechnologyEnabled = config.comprehensive.assistiveTechnology;
    const [detectedTechnologies, setDetectedTechnologies] = useState<any[]>([]);
    const [isDetecting, setIsDetecting] = useState(false);

    const handleDetect = useCallback(async () => {
      if (isAssistiveTechnologyEnabled) {
        setIsDetecting(true);
        
        // Simulate assistive technology detection
        setTimeout(() => {
          const mockTechnologies = [
            { name: 'NVDA', type: 'screen-reader', version: '2023.1', status: 'detected' },
            { name: 'JAWS', type: 'screen-reader', version: '2023', status: 'detected' },
            { name: 'VoiceOver', type: 'screen-reader', version: 'macOS 13', status: 'detected' },
            { name: 'Dragon', type: 'voice-control', version: '15.0', status: 'detected' },
            { name: 'Switch Control', type: 'switch-control', version: 'iOS 16', status: 'detected' }
          ];
          
          setDetectedTechnologies(mockTechnologies);
          setIsDetecting(false);
          onDetect?.(mockTechnologies);
        }, 2000);
      }
    }, [isAssistiveTechnologyEnabled, onDetect]);

    const getTechnologyIcon = (techType: string) => {
      switch (techType) {
        case 'screen-reader': return '👁️';
        case 'voice-control': return '🎤';
        case 'switch-control': return '🔄';
        case 'eye-tracking': return '👀';
        default: return '🔧';
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'detected': return 'text-green-600 dark:text-green-400';
        case 'not-detected': return 'text-gray-600 dark:text-gray-400';
        case 'error': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          assistiveTechnologyVariants({ 
            mode: isAssistiveTechnologyEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Assistive Technology Detection
          </h3>
          <button
            onClick={handleDetect}
            disabled={isDetecting}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isDetecting ? 'Detecting...' : 'Detect Technologies'}
          </button>
        </div>
        
        {detectedTechnologies.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Detected {detectedTechnologies.length} assistive technologies
            </div>
            
            <div className="space-y-2">
              {detectedTechnologies.map((tech, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md dark:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getTechnologyIcon(tech.type)}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {tech.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {tech.type} • {tech.version}
                      </div>
                    </div>
                  </div>
                  <div className={cn('text-sm font-medium', getStatusColor(tech.status))}>
                    {tech.status}
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

AssistiveTechnologyDetector.displayName = 'AssistiveTechnologyDetector';

// Assistive Technology Status Component
interface AssistiveTechnologyStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AssistiveTechnologyStatus = React.forwardRef<HTMLDivElement, AssistiveTechnologyStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAssistiveTechnologyEnabled = config.comprehensive.assistiveTechnology;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-orange-500" />
        <span className="font-medium">
          Assistive Technology: {isAssistiveTechnologyEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAssistiveTechnologyEnabled 
              ? 'Enhanced assistive technology support and detection' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

AssistiveTechnologyStatus.displayName = 'AssistiveTechnologyStatus';

// Assistive Technology Demo Component
interface AssistiveTechnologyDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AssistiveTechnologyDemo = React.forwardRef<HTMLDivElement, AssistiveTechnologyDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAssistiveTechnologyEnabled = config.comprehensive.assistiveTechnology;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Assistive Technology Demo</h3>
        
        <AssistiveTechnologyDetector
          mode={isAssistiveTechnologyEnabled ? 'enhanced' : 'standard'}
          type={isAssistiveTechnologyEnabled ? 'mixed' : 'mixed'}
          style={isAssistiveTechnologyEnabled ? 'detailed' : 'moderate'}
          onDetect={(technologies) => console.log('Detected technologies:', technologies)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAssistiveTechnologyEnabled 
                ? 'Assistive technology support is enabled. Detection and compatibility features are available.'
                : 'Standard accessibility features are used. Enable assistive technology for enhanced support.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AssistiveTechnologyDemo.displayName = 'AssistiveTechnologyDemo';

// Export all components
export {
  assistiveTechnologyVariants,
  type AssistiveTechnologyToggleProps,
  type AssistiveTechnologyProviderProps,
  type AssistiveTechnologyDetectorProps,
  type AssistiveTechnologyStatusProps,
  type AssistiveTechnologyDemoProps
};
