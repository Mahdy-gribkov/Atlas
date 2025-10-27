/**
 * Voice Recognition Component
 * 
 * Provides voice recognition support for hearing accessibility.
 * Implements WCAG 2.1 AA voice recognition requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Voice Recognition Variants
const voiceRecognitionVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'voice-recognition-standard',
        'enhanced': 'voice-recognition-enhanced',
        'comprehensive': 'voice-recognition-comprehensive',
        'custom': 'voice-recognition-custom'
      },
      type: {
        'speech': 'voice-type-speech',
        'command': 'voice-type-command',
        'dictation': 'voice-type-dictation',
        'mixed': 'voice-type-mixed'
      },
      style: {
        'minimal': 'voice-style-minimal',
        'moderate': 'voice-style-moderate',
        'detailed': 'voice-style-detailed',
        'custom': 'voice-style-custom'
      },
      language: {
        'english': 'voice-language-english',
        'spanish': 'voice-language-spanish',
        'french': 'voice-language-french',
        'custom': 'voice-language-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'speech',
      style: 'moderate',
      language: 'english'
    }
  }
);

// Voice Recognition Toggle Props
interface VoiceRecognitionToggleProps extends VariantProps<typeof voiceRecognitionVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Voice Recognition Toggle Component
export const VoiceRecognitionToggle = React.forwardRef<HTMLButtonElement, VoiceRecognitionToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.voiceRecognition);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          voiceRecognition: newState
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
        aria-label={isEnabled ? 'Disable voice recognition' : 'Enable voice recognition'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Voice recognition enabled' : 'Voice recognition disabled'}
          </span>
        )}
      </button>
    );
  }
);

VoiceRecognitionToggle.displayName = 'VoiceRecognitionToggle';

// Voice Recognition Provider Props
interface VoiceRecognitionProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'speech' | 'command' | 'dictation' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Voice Recognition Provider Component
export const VoiceRecognitionProvider = React.forwardRef<HTMLDivElement, VoiceRecognitionProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'speech',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.voiceRecognition) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.voiceRecognition]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing voice recognition classes
        document.body.classList.remove(
          'voice-recognition-standard',
          'voice-recognition-enhanced',
          'voice-recognition-comprehensive',
          'voice-recognition-custom'
        );
        
        document.body.classList.add(`voice-recognition-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          voiceRecognitionVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VoiceRecognitionProvider.displayName = 'VoiceRecognitionProvider';

// Voice Recognition Input Component
interface VoiceRecognitionInputProps extends VariantProps<typeof voiceRecognitionVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  onVoiceResult?: (result: string) => void;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'speech' | 'command' | 'dictation' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const VoiceRecognitionInput = React.forwardRef<HTMLInputElement, VoiceRecognitionInputProps>(
  ({ 
    className, 
    placeholder,
    value = '',
    onChange,
    onVoiceStart,
    onVoiceEnd,
    onVoiceResult,
    mode = 'standard',
    type = 'speech',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVoiceRecognitionEnabled = config.hearing.voiceRecognition;
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const handleVoiceStart = useCallback(() => {
      if (isVoiceRecognitionEnabled) {
        setIsListening(true);
        onVoiceStart?.();
        console.log('Voice recognition started');
      }
    }, [isVoiceRecognitionEnabled, onVoiceStart]);

    const handleVoiceEnd = useCallback(() => {
      if (isVoiceRecognitionEnabled) {
        setIsListening(false);
        onVoiceEnd?.();
        console.log('Voice recognition ended');
      }
    }, [isVoiceRecognitionEnabled, onVoiceEnd]);

    const handleVoiceResult = useCallback((result: string) => {
      if (isVoiceRecognitionEnabled) {
        setTranscript(result);
        onChange?.(result);
        onVoiceResult?.(result);
        console.log('Voice recognition result:', result);
      }
    }, [isVoiceRecognitionEnabled, onChange, onVoiceResult]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    }, [onChange]);

    return (
      <div className="relative">
        <input
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(
            'w-full px-3 py-2 pr-12 border border-gray-300 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600',
            voiceRecognitionVariants({ 
              mode: isVoiceRecognitionEnabled ? 'enhanced' : mode,
              type,
              style
            }),
            className
          )}
          {...props}
        />
        
        {isVoiceRecognitionEnabled && (
          <button
            onClick={isListening ? handleVoiceEnd : handleVoiceStart}
            className={cn(
              'absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-md transition-all duration-300',
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            )}
            aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
          >
            {isListening ? '🛑' : '🎤'}
          </button>
        )}
        
        {isVoiceRecognitionEnabled && transcript && (
          <div className="mt-2 p-2 bg-gray-100 rounded-md dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🎤</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Voice Recognition
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {transcript}
            </p>
          </div>
        )}
      </div>
    );
  }
);

VoiceRecognitionInput.displayName = 'VoiceRecognitionInput';

// Voice Recognition Commands Component
interface VoiceRecognitionCommandsProps extends VariantProps<typeof voiceRecognitionVariants> {
  className?: string;
  commands?: string[];
  onCommand?: (command: string) => void;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'speech' | 'command' | 'dictation' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const VoiceRecognitionCommands = React.forwardRef<HTMLDivElement, VoiceRecognitionCommandsProps>(
  ({ 
    className, 
    commands = [],
    onCommand,
    mode = 'standard',
    type = 'command',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVoiceRecognitionEnabled = config.hearing.voiceRecognition;

    const handleCommand = useCallback((command: string) => {
      if (isVoiceRecognitionEnabled) {
        onCommand?.(command);
        console.log('Voice command executed:', command);
      }
    }, [isVoiceRecognitionEnabled, onCommand]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          voiceRecognitionVariants({ 
            mode: isVoiceRecognitionEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Voice Commands
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {commands.map((command, index) => (
            <button
              key={index}
              onClick={() => handleCommand(command)}
              className="p-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-all duration-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            >
              {command}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

VoiceRecognitionCommands.displayName = 'VoiceRecognitionCommands';

// Voice Recognition Status Component
interface VoiceRecognitionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VoiceRecognitionStatus = React.forwardRef<HTMLDivElement, VoiceRecognitionStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isVoiceRecognitionEnabled = config.hearing.voiceRecognition;

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
          Voice Recognition: {isVoiceRecognitionEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isVoiceRecognitionEnabled 
              ? 'Enhanced voice recognition and commands' 
              : 'Standard input methods'
            }
          </div>
        )}
      </div>
    );
  }
);

VoiceRecognitionStatus.displayName = 'VoiceRecognitionStatus';

// Voice Recognition Demo Component
interface VoiceRecognitionDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VoiceRecognitionDemo = React.forwardRef<HTMLDivElement, VoiceRecognitionDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isVoiceRecognitionEnabled = config.hearing.voiceRecognition;

    const voiceCommands = [
      'Search flights',
      'Book hotel',
      'Find restaurants',
      'Get directions',
      'Check weather',
      'View itinerary'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Voice Recognition Demo</h3>
        
        <div className="space-y-4">
          <VoiceRecognitionInput
            mode={isVoiceRecognitionEnabled ? 'enhanced' : 'standard'}
            type={isVoiceRecognitionEnabled ? 'mixed' : 'speech'}
            style={isVoiceRecognitionEnabled ? 'detailed' : 'moderate'}
            placeholder="Type or speak your search..."
            onChange={(value) => console.log('Input changed:', value)}
            onVoiceStart={() => console.log('Voice recognition started')}
            onVoiceEnd={() => console.log('Voice recognition ended')}
            onVoiceResult={(result) => console.log('Voice result:', result)}
          />
          
          <VoiceRecognitionCommands
            mode={isVoiceRecognitionEnabled ? 'enhanced' : 'standard'}
            type={isVoiceRecognitionEnabled ? 'mixed' : 'command'}
            style={isVoiceRecognitionEnabled ? 'detailed' : 'moderate'}
            commands={voiceCommands}
            onCommand={(command) => console.log('Command executed:', command)}
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isVoiceRecognitionEnabled 
                ? 'Voice recognition is enabled. Use voice commands and speech input for interaction.'
                : 'Standard input methods are used. Enable voice recognition for voice interaction.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

VoiceRecognitionDemo.displayName = 'VoiceRecognitionDemo';

// Export all components
export {
  voiceRecognitionVariants,
  type VoiceRecognitionToggleProps,
  type VoiceRecognitionProviderProps,
  type VoiceRecognitionInputProps,
  type VoiceRecognitionCommandsProps,
  type VoiceRecognitionStatusProps,
  type VoiceRecognitionDemoProps
};
