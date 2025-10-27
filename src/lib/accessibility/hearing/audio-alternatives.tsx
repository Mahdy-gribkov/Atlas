/**
 * Audio Alternatives Component
 * 
 * Provides audio alternatives support for hearing accessibility.
 * Implements WCAG 2.1 AA audio alternatives requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Audio Alternatives Variants
const audioAlternativesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'audio-alternatives-standard',
        'enhanced': 'audio-alternatives-enhanced',
        'comprehensive': 'audio-alternatives-comprehensive',
        'custom': 'audio-alternatives-custom'
      },
      type: {
        'visual': 'audio-type-visual',
        'text': 'audio-type-text',
        'haptic': 'audio-type-haptic',
        'mixed': 'audio-type-mixed'
      },
      style: {
        'subtle': 'audio-style-subtle',
        'moderate': 'audio-style-moderate',
        'prominent': 'audio-style-prominent',
        'custom': 'audio-style-custom'
      },
      format: {
        'icon': 'audio-format-icon',
        'text': 'audio-format-text',
        'visual': 'audio-format-visual',
        'mixed': 'audio-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'visual',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Audio Alternatives Toggle Props
interface AudioAlternativesToggleProps extends VariantProps<typeof audioAlternativesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Audio Alternatives Toggle Component
export const AudioAlternativesToggle = React.forwardRef<HTMLButtonElement, AudioAlternativesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.audioAlternatives);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          audioAlternatives: newState
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
        aria-label={isEnabled ? 'Disable audio alternatives' : 'Enable audio alternatives'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Audio alternatives enabled' : 'Audio alternatives disabled'}
          </span>
        )}
      </button>
    );
  }
);

AudioAlternativesToggle.displayName = 'AudioAlternativesToggle';

// Audio Alternatives Provider Props
interface AudioAlternativesProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'visual' | 'text' | 'haptic' | 'mixed';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
  applyToBody?: boolean;
}

// Audio Alternatives Provider Component
export const AudioAlternativesProvider = React.forwardRef<HTMLDivElement, AudioAlternativesProviderProps>(
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
      if (config.hearing.audioAlternatives) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.audioAlternatives]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing audio alternatives classes
        document.body.classList.remove(
          'audio-alternatives-standard',
          'audio-alternatives-enhanced',
          'audio-alternatives-comprehensive',
          'audio-alternatives-custom'
        );
        
        document.body.classList.add(`audio-alternatives-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          audioAlternativesVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AudioAlternativesProvider.displayName = 'AudioAlternativesProvider';

// Audio Alternatives Visual Component
interface AudioAlternativesVisualProps extends VariantProps<typeof audioAlternativesVariants> {
  className?: string;
  children: React.ReactNode;
  audioDescription?: string;
  type?: 'visual' | 'text' | 'haptic' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
}

export const AudioAlternativesVisual = React.forwardRef<HTMLDivElement, AudioAlternativesVisualProps>(
  ({ 
    className, 
    children,
    audioDescription,
    type = 'visual',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioAlternativesEnabled = config.hearing.audioAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'relative transition-all duration-300',
          audioAlternativesVariants({ 
            mode: isAudioAlternativesEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isAudioAlternativesEnabled && audioDescription && (
          <div className="absolute top-2 right-2 p-2 bg-black bg-opacity-75 text-white text-xs rounded-md">
            <span className="mr-1">🔊</span>
            {audioDescription}
          </div>
        )}
      </div>
    );
  }
);

AudioAlternativesVisual.displayName = 'AudioAlternativesVisual';

// Audio Alternatives Text Component
interface AudioAlternativesTextProps extends VariantProps<typeof audioAlternativesVariants> {
  className?: string;
  children: React.ReactNode;
  audioContent?: string;
  type?: 'visual' | 'text' | 'haptic' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
}

export const AudioAlternativesText = React.forwardRef<HTMLDivElement, AudioAlternativesTextProps>(
  ({ 
    className, 
    children,
    audioContent,
    type = 'text',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioAlternativesEnabled = config.hearing.audioAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          audioAlternativesVariants({ 
            mode: isAudioAlternativesEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isAudioAlternativesEnabled && audioContent && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🔊</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Audio Content
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {audioContent}
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioAlternativesText.displayName = 'AudioAlternativesText';

// Audio Alternatives Status Component
interface AudioAlternativesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AudioAlternativesStatus = React.forwardRef<HTMLDivElement, AudioAlternativesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAudioAlternativesEnabled = config.hearing.audioAlternatives;

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
          Audio Alternatives: {isAudioAlternativesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAudioAlternativesEnabled 
              ? 'Visual and text alternatives for audio content' 
              : 'Standard audio content'
            }
          </div>
        )}
      </div>
    );
  }
);

AudioAlternativesStatus.displayName = 'AudioAlternativesStatus';

// Audio Alternatives Demo Component
interface AudioAlternativesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AudioAlternativesDemo = React.forwardRef<HTMLDivElement, AudioAlternativesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAudioAlternativesEnabled = config.hearing.audioAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Audio Alternatives Demo</h3>
        
        <div className="space-y-4">
          <AudioAlternativesVisual
            mode={isAudioAlternativesEnabled ? 'enhanced' : 'standard'}
            type={isAudioAlternativesEnabled ? 'mixed' : 'visual'}
            style={isAudioAlternativesEnabled ? 'prominent' : 'moderate'}
            audioDescription="Welcome to Atlas Travel Agent"
          >
            <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
              Welcome Video
            </div>
          </AudioAlternativesVisual>
          
          <AudioAlternativesText
            mode={isAudioAlternativesEnabled ? 'enhanced' : 'standard'}
            type={isAudioAlternativesEnabled ? 'mixed' : 'text'}
            style={isAudioAlternativesEnabled ? 'prominent' : 'moderate'}
            audioContent="This is a text alternative for the audio content. It provides the same information in a visual format."
          >
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Audio Content
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This content would normally be presented as audio.
              </p>
            </div>
          </AudioAlternativesText>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAudioAlternativesEnabled 
                ? 'Audio alternatives are enabled. Visual and text alternatives are provided for audio content.'
                : 'Standard audio content is used. Enable audio alternatives for visual and text alternatives.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioAlternativesDemo.displayName = 'AudioAlternativesDemo';

// Export all components
export {
  audioAlternativesVariants,
  type AudioAlternativesToggleProps,
  type AudioAlternativesProviderProps,
  type AudioAlternativesVisualProps,
  type AudioAlternativesTextProps,
  type AudioAlternativesStatusProps,
  type AudioAlternativesDemoProps
};
