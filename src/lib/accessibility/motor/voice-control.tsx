/**
 * Voice Control Component
 * 
 * Provides voice control support for motor accessibility.
 * Implements WCAG 2.1 AA voice control requirements and speech recognition.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { useVoiceControl } from '../core/accessibility-hooks';

// Voice Control Variants
const voiceControlVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'basic': 'voice-basic',
        'advanced': 'voice-advanced',
        'expert': 'voice-expert',
        'custom': 'voice-custom'
      },
      sensitivity: {
        'low': 'voice-sensitivity-low',
        'medium': 'voice-sensitivity-medium',
        'high': 'voice-sensitivity-high',
        'auto': 'voice-sensitivity-auto'
      },
      language: {
        'en': 'voice-lang-en',
        'es': 'voice-lang-es',
        'fr': 'voice-lang-fr',
        'de': 'voice-lang-de',
        'auto': 'voice-lang-auto'
      },
      feedback: {
        'none': 'voice-feedback-none',
        'visual': 'voice-feedback-visual',
        'audio': 'voice-feedback-audio',
        'both': 'voice-feedback-both'
      }
    },
    defaultVariants: {
      mode: 'basic',
      sensitivity: 'medium',
      language: 'en',
      feedback: 'visual'
    }
  }
);

// Voice Control Toggle Props
interface VoiceControlToggleProps extends VariantProps<typeof voiceControlVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Voice Control Toggle Component
export const VoiceControlToggle = React.forwardRef<HTMLButtonElement, VoiceControlToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.voiceControl);
    const { isVoiceSupported, isListening, startListening, stopListening } = useVoiceControl();

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          voiceControl: newState
        }
      });
      
      if (newState && isVoiceSupported) {
        startListening();
      } else {
        stopListening();
      }
      
      onToggle?.(newState);
    }, [isEnabled, updateConfig, onToggle, isVoiceSupported, startListening, stopListening]);

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
          isListening ? 'animate-pulse' : '',
          className
        )}
        onClick={handleToggle}
        disabled={!isVoiceSupported}
        aria-label={isEnabled ? 'Disable voice control' : 'Enable voice control'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-full" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Voice control enabled' : 'Voice control disabled'}
            {!isVoiceSupported && ' (Not supported)'}
          </span>
        )}
      </button>
    );
  }
);

VoiceControlToggle.displayName = 'VoiceControlToggle';

// Voice Control Provider Props
interface VoiceControlProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
  sensitivity?: 'low' | 'medium' | 'high' | 'auto';
  language?: 'en' | 'es' | 'fr' | 'de' | 'auto';
  feedback?: 'none' | 'visual' | 'audio' | 'both';
  applyToBody?: boolean;
}

// Voice Control Provider Component
export const VoiceControlProvider = React.forwardRef<HTMLDivElement, VoiceControlProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'basic', 
    sensitivity = 'medium',
    language = 'en',
    feedback = 'visual',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.voiceControl) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('basic');
      }
    }, [config.motor.voiceControl, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing voice control classes
        document.body.classList.remove(
          'voice-basic',
          'voice-advanced',
          'voice-expert',
          'voice-custom'
        );
        
        if (config.motor.voiceControl) {
          document.body.classList.add(`voice-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.motor.voiceControl]);

    return (
      <div
        ref={ref}
        className={cn(
          voiceControlVariants({ mode: currentMode, sensitivity, language, feedback }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VoiceControlProvider.displayName = 'VoiceControlProvider';

// Voice Control Button Component
interface VoiceControlButtonProps extends VariantProps<typeof voiceControlVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  command?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
}

export const VoiceControlButton = React.forwardRef<HTMLButtonElement, VoiceControlButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    command,
    mode = 'basic',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVoiceControlEnabled = config.motor.voiceControl;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          voiceControlVariants({ 
            mode: isVoiceControlEnabled ? mode : 'basic'
          }),
          className
        )}
        data-voice-command={command}
        {...props}
      >
        {children}
      </button>
    );
  }
);

VoiceControlButton.displayName = 'VoiceControlButton';

// Voice Control Status Component
interface VoiceControlStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VoiceControlStatus = React.forwardRef<HTMLDivElement, VoiceControlStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isVoiceControlEnabled = config.motor.voiceControl;
    const { isVoiceSupported, isListening, transcript } = useVoiceControl();

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className={cn(
          'w-3 h-3 rounded-full',
          isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
        )} />
        <span className="font-medium">
          Voice Control: {isVoiceControlEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isVoiceControlEnabled 
              ? `Voice recognition ${isListening ? 'active' : 'ready'}` 
              : 'Voice control disabled'
            }
            {!isVoiceSupported && ' (Not supported)'}
            {transcript && ` - Last: "${transcript}"`}
          </div>
        )}
      </div>
    );
  }
);

VoiceControlStatus.displayName = 'VoiceControlStatus';

// Voice Control Commands Component
interface VoiceControlCommandsProps {
  className?: string;
  showCommands?: boolean;
}

export const VoiceControlCommands = React.forwardRef<HTMLDivElement, VoiceControlCommandsProps>(
  ({ className, showCommands = true }, ref) => {
    const { config } = useAccessibility();
    const isVoiceControlEnabled = config.motor.voiceControl;

    const commands = [
      { command: 'navigate', description: 'Navigate to different sections' },
      { command: 'click', description: 'Click on elements' },
      { command: 'scroll', description: 'Scroll up or down' },
      { command: 'search', description: 'Search for content' },
      { command: 'help', description: 'Show help information' },
      { command: 'stop', description: 'Stop current action' }
    ];

    if (!showCommands || !isVoiceControlEnabled) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2 p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Voice Commands</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {commands.map((cmd) => (
            <div key={cmd.command} className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                {cmd.command}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {cmd.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

VoiceControlCommands.displayName = 'VoiceControlCommands';

// Voice Control Demo Component
interface VoiceControlDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VoiceControlDemo = React.forwardRef<HTMLDivElement, VoiceControlDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isVoiceControlEnabled = config.motor.voiceControl;
    const { isVoiceSupported, isListening, transcript } = useVoiceControl();

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Voice Control Demo</h3>
        
        <div className="flex gap-2">
          <VoiceControlButton
            mode={isVoiceControlEnabled ? 'advanced' : 'basic'}
            command="navigate home"
            onClick={() => console.log('Navigate to home')}
          >
            Home
          </VoiceControlButton>
          <VoiceControlButton
            mode={isVoiceControlEnabled ? 'advanced' : 'basic'}
            command="search"
            onClick={() => console.log('Search')}
          >
            Search
          </VoiceControlButton>
          <VoiceControlButton
            mode={isVoiceControlEnabled ? 'advanced' : 'basic'}
            command="help"
            onClick={() => console.log('Help')}
          >
            Help
          </VoiceControlButton>
        </div>
        
        {isListening && (
          <div className="p-4 bg-green-100 rounded-md dark:bg-green-900">
            <p className="text-sm text-green-800 dark:text-green-200">
              🎤 Listening... {transcript && `"${transcript}"`}
            </p>
          </div>
        )}
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isVoiceSupported 
                ? 'Voice control is supported. Try saying "navigate home" or "click search".'
                : 'Voice control is not supported in this browser.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

VoiceControlDemo.displayName = 'VoiceControlDemo';

// Export all components
export {
  voiceControlVariants,
  type VoiceControlToggleProps,
  type VoiceControlProviderProps,
  type VoiceControlButtonProps,
  type VoiceControlStatusProps,
  type VoiceControlCommandsProps,
  type VoiceControlDemoProps
};
