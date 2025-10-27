/**
 * Audio Descriptions Component
 * 
 * Provides audio descriptions support for hearing accessibility.
 * Implements WCAG 2.1 AA audio descriptions requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Audio Descriptions Variants
const audioDescriptionsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'audio-descriptions-standard',
        'enhanced': 'audio-descriptions-enhanced',
        'comprehensive': 'audio-descriptions-comprehensive',
        'custom': 'audio-descriptions-custom'
      },
      type: {
        'visual': 'description-type-visual',
        'text': 'description-type-text',
        'mixed': 'description-type-mixed',
        'custom': 'description-type-custom'
      },
      style: {
        'minimal': 'description-style-minimal',
        'moderate': 'description-style-moderate',
        'detailed': 'description-style-detailed',
        'custom': 'description-style-custom'
      },
      format: {
        'narrative': 'description-format-narrative',
        'descriptive': 'description-format-descriptive',
        'technical': 'description-format-technical',
        'custom': 'description-format-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'visual',
      style: 'moderate',
      format: 'narrative'
    }
  }
);

// Audio Descriptions Toggle Props
interface AudioDescriptionsToggleProps extends VariantProps<typeof audioDescriptionsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Audio Descriptions Toggle Component
export const AudioDescriptionsToggle = React.forwardRef<HTMLButtonElement, AudioDescriptionsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.audioDescriptions);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          audioDescriptions: newState
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
        aria-label={isEnabled ? 'Disable audio descriptions' : 'Enable audio descriptions'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Audio descriptions enabled' : 'Audio descriptions disabled'}
          </span>
        )}
      </button>
    );
  }
);

AudioDescriptionsToggle.displayName = 'AudioDescriptionsToggle';

// Audio Descriptions Provider Props
interface AudioDescriptionsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'visual' | 'text' | 'mixed' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Audio Descriptions Provider Component
export const AudioDescriptionsProvider = React.forwardRef<HTMLDivElement, AudioDescriptionsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'visual',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.audioDescriptions) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.audioDescriptions]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing audio descriptions classes
        document.body.classList.remove(
          'audio-descriptions-standard',
          'audio-descriptions-enhanced',
          'audio-descriptions-comprehensive',
          'audio-descriptions-custom'
        );
        
        document.body.classList.add(`audio-descriptions-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          audioDescriptionsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AudioDescriptionsProvider.displayName = 'AudioDescriptionsProvider';

// Audio Descriptions Visual Component
interface AudioDescriptionsVisualProps extends VariantProps<typeof audioDescriptionsVariants> {
  className?: string;
  children: React.ReactNode;
  description?: string;
  type?: 'visual' | 'text' | 'mixed' | 'custom';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  format?: 'narrative' | 'descriptive' | 'technical' | 'custom';
}

export const AudioDescriptionsVisual = React.forwardRef<HTMLDivElement, AudioDescriptionsVisualProps>(
  ({ 
    className, 
    children,
    description,
    type = 'visual',
    mode = 'standard',
    style = 'moderate',
    format = 'narrative',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioDescriptionsEnabled = config.hearing.audioDescriptions;

    return (
      <div
        ref={ref}
        className={cn(
          'relative transition-all duration-300',
          audioDescriptionsVariants({ 
            mode: isAudioDescriptionsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isAudioDescriptionsEnabled && description && (
          <div className="absolute top-2 left-2 p-2 bg-black bg-opacity-75 text-white text-xs rounded-md max-w-xs">
            <span className="mr-1">📝</span>
            {description}
          </div>
        )}
      </div>
    );
  }
);

AudioDescriptionsVisual.displayName = 'AudioDescriptionsVisual';

// Audio Descriptions Text Component
interface AudioDescriptionsTextProps extends VariantProps<typeof audioDescriptionsVariants> {
  className?: string;
  children: React.ReactNode;
  description?: string;
  type?: 'visual' | 'text' | 'mixed' | 'custom';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  format?: 'narrative' | 'descriptive' | 'technical' | 'custom';
}

export const AudioDescriptionsText = React.forwardRef<HTMLDivElement, AudioDescriptionsTextProps>(
  ({ 
    className, 
    children,
    description,
    type = 'text',
    mode = 'standard',
    style = 'moderate',
    format = 'narrative',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioDescriptionsEnabled = config.hearing.audioDescriptions;

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          audioDescriptionsVariants({ 
            mode: isAudioDescriptionsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isAudioDescriptionsEnabled && description && (
          <div className="mt-3 p-3 bg-gray-100 rounded-md dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">📝</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Audio Description
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioDescriptionsText.displayName = 'AudioDescriptionsText';

// Audio Descriptions Status Component
interface AudioDescriptionsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AudioDescriptionsStatus = React.forwardRef<HTMLDivElement, AudioDescriptionsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAudioDescriptionsEnabled = config.hearing.audioDescriptions;

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
          Audio Descriptions: {isAudioDescriptionsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAudioDescriptionsEnabled 
              ? 'Enhanced audio descriptions for visual content' 
              : 'Standard visual content'
            }
          </div>
        )}
      </div>
    );
  }
);

AudioDescriptionsStatus.displayName = 'AudioDescriptionsStatus';

// Audio Descriptions Demo Component
interface AudioDescriptionsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AudioDescriptionsDemo = React.forwardRef<HTMLDivElement, AudioDescriptionsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAudioDescriptionsEnabled = config.hearing.audioDescriptions;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Audio Descriptions Demo</h3>
        
        <div className="space-y-4">
          <AudioDescriptionsVisual
            mode={isAudioDescriptionsEnabled ? 'enhanced' : 'standard'}
            type={isAudioDescriptionsEnabled ? 'mixed' : 'visual'}
            style={isAudioDescriptionsEnabled ? 'detailed' : 'moderate'}
            format={isAudioDescriptionsEnabled ? 'narrative' : 'narrative'}
            description="A beautiful sunset over the ocean with waves gently lapping the shore"
          >
            <div className="w-full h-32 bg-gradient-to-r from-orange-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
              Sunset Image
            </div>
          </AudioDescriptionsVisual>
          
          <AudioDescriptionsText
            mode={isAudioDescriptionsEnabled ? 'enhanced' : 'standard'}
            type={isAudioDescriptionsEnabled ? 'mixed' : 'text'}
            style={isAudioDescriptionsEnabled ? 'detailed' : 'moderate'}
            format={isAudioDescriptionsEnabled ? 'narrative' : 'narrative'}
            description="This is a detailed audio description of the visual content. It provides comprehensive information about what is shown in the image or video."
          >
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Visual Content
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This content would normally be presented as visual media.
              </p>
            </div>
          </AudioDescriptionsText>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAudioDescriptionsEnabled 
                ? 'Audio descriptions are enabled. Detailed descriptions are provided for visual content.'
                : 'Standard visual content is used. Enable audio descriptions for detailed visual descriptions.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioDescriptionsDemo.displayName = 'AudioDescriptionsDemo';

// Export all components
export {
  audioDescriptionsVariants,
  type AudioDescriptionsToggleProps,
  type AudioDescriptionsProviderProps,
  type AudioDescriptionsVisualProps,
  type AudioDescriptionsTextProps,
  type AudioDescriptionsStatusProps,
  type AudioDescriptionsDemoProps
};
