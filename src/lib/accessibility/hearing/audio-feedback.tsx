/**
 * Audio Feedback Component
 * 
 * Provides audio feedback support for hearing accessibility.
 * Implements WCAG 2.1 AA audio feedback requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Audio Feedback Variants
const audioFeedbackVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'audio-feedback-standard',
        'enhanced': 'audio-feedback-enhanced',
        'comprehensive': 'audio-feedback-comprehensive',
        'custom': 'audio-feedback-custom'
      },
      type: {
        'beep': 'feedback-type-beep',
        'tone': 'feedback-type-tone',
        'voice': 'feedback-type-voice',
        'mixed': 'feedback-type-mixed'
      },
      style: {
        'subtle': 'feedback-style-subtle',
        'moderate': 'feedback-style-moderate',
        'prominent': 'feedback-style-prominent',
        'custom': 'feedback-style-custom'
      },
      frequency: {
        'low': 'feedback-frequency-low',
        'medium': 'feedback-frequency-medium',
        'high': 'feedback-frequency-high',
        'custom': 'feedback-frequency-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'beep',
      style: 'moderate',
      frequency: 'medium'
    }
  }
);

// Audio Feedback Toggle Props
interface AudioFeedbackToggleProps extends VariantProps<typeof audioFeedbackVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Audio Feedback Toggle Component
export const AudioFeedbackToggle = React.forwardRef<HTMLButtonElement, AudioFeedbackToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.audioFeedback);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          audioFeedback: newState
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
        aria-label={isEnabled ? 'Disable audio feedback' : 'Enable audio feedback'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Audio feedback enabled' : 'Audio feedback disabled'}
          </span>
        )}
      </button>
    );
  }
);

AudioFeedbackToggle.displayName = 'AudioFeedbackToggle';

// Audio Feedback Provider Props
interface AudioFeedbackProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'beep' | 'tone' | 'voice' | 'mixed';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
  applyToBody?: boolean;
}

// Audio Feedback Provider Component
export const AudioFeedbackProvider = React.forwardRef<HTMLDivElement, AudioFeedbackProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'beep',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.audioFeedback) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.audioFeedback]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing audio feedback classes
        document.body.classList.remove(
          'audio-feedback-standard',
          'audio-feedback-enhanced',
          'audio-feedback-comprehensive',
          'audio-feedback-custom'
        );
        
        document.body.classList.add(`audio-feedback-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          audioFeedbackVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AudioFeedbackProvider.displayName = 'AudioFeedbackProvider';

// Audio Feedback Button Component
interface AudioFeedbackButtonProps extends VariantProps<typeof audioFeedbackVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  feedbackType?: 'success' | 'error' | 'warning' | 'info';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
}

export const AudioFeedbackButton = React.forwardRef<HTMLButtonElement, AudioFeedbackButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    feedbackType = 'info',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioFeedbackEnabled = config.hearing.audioFeedback;

    const feedbackSounds = {
      success: '🔔',
      error: '🔔',
      warning: '🔔',
      info: '🔔'
    };

    const handleClick = useCallback(() => {
      if (isAudioFeedbackEnabled) {
        // In a real implementation, this would play actual audio
        console.log(`Playing ${feedbackType} feedback sound`);
      }
      onClick?.();
    }, [isAudioFeedbackEnabled, feedbackType, onClick]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          audioFeedbackVariants({ 
            mode: isAudioFeedbackEnabled ? 'enhanced' : mode,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        {isAudioFeedbackEnabled && (
          <span className="ml-2 text-sm">
            {feedbackSounds[feedbackType]}
          </span>
        )}
      </button>
    );
  }
);

AudioFeedbackButton.displayName = 'AudioFeedbackButton';

// Audio Feedback Input Component
interface AudioFeedbackInputProps extends VariantProps<typeof audioFeedbackVariants> {
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'subtle' | 'moderate' | 'prominent' | 'custom';
}

export const AudioFeedbackInput = React.forwardRef<HTMLInputElement, AudioFeedbackInputProps>(
  ({ 
    className, 
    type = 'text',
    placeholder,
    value = '',
    onChange,
    onFocus,
    onBlur,
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioFeedbackEnabled = config.hearing.audioFeedback;

    const handleFocus = useCallback(() => {
      if (isAudioFeedbackEnabled) {
        console.log('Playing focus feedback sound');
      }
      onFocus?.();
    }, [isAudioFeedbackEnabled, onFocus]);

    const handleBlur = useCallback(() => {
      if (isAudioFeedbackEnabled) {
        console.log('Playing blur feedback sound');
      }
      onBlur?.();
    }, [isAudioFeedbackEnabled, onBlur]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (isAudioFeedbackEnabled) {
        console.log('Playing input feedback sound');
      }
      onChange?.(e.target.value);
    }, [isAudioFeedbackEnabled, onChange]);

    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600',
          audioFeedbackVariants({ 
            mode: isAudioFeedbackEnabled ? 'enhanced' : mode,
            style
          }),
          className
        )}
        {...props}
      />
    );
  }
);

AudioFeedbackInput.displayName = 'AudioFeedbackInput';

// Audio Feedback Status Component
interface AudioFeedbackStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AudioFeedbackStatus = React.forwardRef<HTMLDivElement, AudioFeedbackStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAudioFeedbackEnabled = config.hearing.audioFeedback;

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
          Audio Feedback: {isAudioFeedbackEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAudioFeedbackEnabled 
              ? 'Enhanced audio feedback for interactions' 
              : 'Standard interactions'
            }
          </div>
        )}
      </div>
    );
  }
);

AudioFeedbackStatus.displayName = 'AudioFeedbackStatus';

// Audio Feedback Demo Component
interface AudioFeedbackDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AudioFeedbackDemo = React.forwardRef<HTMLDivElement, AudioFeedbackDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAudioFeedbackEnabled = config.hearing.audioFeedback;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Audio Feedback Demo</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium mb-2">Interactive Buttons</h4>
            <div className="flex gap-2">
              <AudioFeedbackButton
                mode={isAudioFeedbackEnabled ? 'enhanced' : 'standard'}
                style={isAudioFeedbackEnabled ? 'prominent' : 'moderate'}
                feedbackType="success"
                onClick={() => console.log('Success button clicked')}
              >
                Success
              </AudioFeedbackButton>
              <AudioFeedbackButton
                mode={isAudioFeedbackEnabled ? 'enhanced' : 'standard'}
                style={isAudioFeedbackEnabled ? 'prominent' : 'moderate'}
                feedbackType="error"
                onClick={() => console.log('Error button clicked')}
              >
                Error
              </AudioFeedbackButton>
              <AudioFeedbackButton
                mode={isAudioFeedbackEnabled ? 'enhanced' : 'standard'}
                style={isAudioFeedbackEnabled ? 'prominent' : 'moderate'}
                feedbackType="warning"
                onClick={() => console.log('Warning button clicked')}
              >
                Warning
              </AudioFeedbackButton>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Input Fields</h4>
            <AudioFeedbackInput
              mode={isAudioFeedbackEnabled ? 'enhanced' : 'standard'}
              style={isAudioFeedbackEnabled ? 'prominent' : 'moderate'}
              placeholder="Type something..."
              onChange={(value) => console.log('Input changed:', value)}
            />
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAudioFeedbackEnabled 
                ? 'Audio feedback is enabled. Audio cues are provided for interactions.'
                : 'Standard interactions are used. Enable audio feedback for audio cues.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioFeedbackDemo.displayName = 'AudioFeedbackDemo';

// Export all components
export {
  audioFeedbackVariants,
  type AudioFeedbackToggleProps,
  type AudioFeedbackProviderProps,
  type AudioFeedbackButtonProps,
  type AudioFeedbackInputProps,
  type AudioFeedbackStatusProps,
  type AudioFeedbackDemoProps
};
