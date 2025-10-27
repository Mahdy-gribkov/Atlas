/**
 * Assistive Devices Component
 * 
 * Provides assistive device support for motor accessibility.
 * Implements WCAG 2.1 AA assistive device requirements and device integration.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Assistive Devices Variants
const assistiveDevicesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'basic': 'assistive-devices-basic',
        'advanced': 'assistive-devices-advanced',
        'expert': 'assistive-devices-expert',
        'custom': 'assistive-devices-custom'
      },
      device: {
        'switch': 'assistive-device-switch',
        'joystick': 'assistive-device-joystick',
        'trackball': 'assistive-device-trackball',
        'head-pointer': 'assistive-device-head-pointer',
        'mouth-stick': 'assistive-device-mouth-stick',
        'voice': 'assistive-device-voice',
        'eye-tracker': 'assistive-device-eye-tracker',
        'custom': 'assistive-device-custom'
      },
      feedback: {
        'none': 'assistive-feedback-none',
        'visual': 'assistive-feedback-visual',
        'audio': 'assistive-feedback-audio',
        'haptic': 'assistive-feedback-haptic',
        'all': 'assistive-feedback-all'
      },
      sensitivity: {
        'low': 'assistive-sensitivity-low',
        'medium': 'assistive-sensitivity-medium',
        'high': 'assistive-sensitivity-high',
        'auto': 'assistive-sensitivity-auto'
      }
    },
    defaultVariants: {
      mode: 'basic',
      device: 'switch',
      feedback: 'visual',
      sensitivity: 'medium'
    }
  }
);

// Assistive Devices Toggle Props
interface AssistiveDevicesToggleProps extends VariantProps<typeof assistiveDevicesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Assistive Devices Toggle Component
export const AssistiveDevicesToggle = React.forwardRef<HTMLButtonElement, AssistiveDevicesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.assistiveDevices);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          assistiveDevices: newState
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
            ? 'bg-emerald-600 text-white border-emerald-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable assistive devices' : 'Enable assistive devices'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Assistive devices enabled' : 'Assistive devices disabled'}
          </span>
        )}
      </button>
    );
  }
);

AssistiveDevicesToggle.displayName = 'AssistiveDevicesToggle';

// Assistive Devices Selector Props
interface AssistiveDevicesSelectorProps extends VariantProps<typeof assistiveDevicesVariants> {
  className?: string;
  onDeviceChange?: (device: string) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Assistive Devices Selector Component
export const AssistiveDevicesSelector = React.forwardRef<HTMLDivElement, AssistiveDevicesSelectorProps>(
  ({ 
    className, 
    onDeviceChange, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [currentDevice, setCurrentDevice] = useState('switch');

    const devices = [
      { value: 'switch', label: 'Switch', description: 'Single switch input', icon: '🔘' },
      { value: 'joystick', label: 'Joystick', description: 'Joystick controller', icon: '🕹️' },
      { value: 'trackball', label: 'Trackball', description: 'Trackball mouse', icon: '🖱️' },
      { value: 'head-pointer', label: 'Head Pointer', description: 'Head-mounted pointer', icon: '👆' },
      { value: 'mouth-stick', description: 'Mouth-operated stick', icon: '🦷' },
      { value: 'voice', label: 'Voice', description: 'Voice control', icon: '🎤' },
      { value: 'eye-tracker', label: 'Eye Tracker', description: 'Eye tracking device', icon: '👁️' },
      { value: 'custom', label: 'Custom', description: 'Custom device', icon: '⚙️' }
    ];

    const handleDeviceChange = useCallback((newDevice: string) => {
      setCurrentDevice(newDevice);
      
      updateConfig({
        motor: {
          assistiveDevices: newDevice !== 'none'
        }
      });
      
      onDeviceChange?.(newDevice);
    }, [updateConfig, onDeviceChange]);

    const sizeClasses = {
      sm: 'w-48',
      md: 'w-56',
      lg: 'w-64'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col gap-2 p-3 bg-white border-2 border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-600',
          sizeClasses[size],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Assistive Device
          </span>
        )}
        
        <div className="flex flex-col gap-1">
          {devices.map((device) => (
            <button
              key={device.value}
              onClick={() => handleDeviceChange(device.value)}
              className={cn(
                'w-full px-2 py-1 text-xs rounded transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentDevice === device.value 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 dark:text-gray-300'
              )}
              aria-label={`Set assistive device to ${device.label}`}
              aria-pressed={currentDevice === device.value}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{device.icon}</span>
                <div className="flex flex-col">
                  <div className="font-medium">{device.label}</div>
                  <div className="text-xs opacity-80">{device.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

AssistiveDevicesSelector.displayName = 'AssistiveDevicesSelector';

// Assistive Devices Provider Props
interface AssistiveDevicesProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
  device?: 'switch' | 'joystick' | 'trackball' | 'head-pointer' | 'mouth-stick' | 'voice' | 'eye-tracker' | 'custom';
  feedback?: 'none' | 'visual' | 'audio' | 'haptic' | 'all';
  applyToBody?: boolean;
}

// Assistive Devices Provider Component
export const AssistiveDevicesProvider = React.forwardRef<HTMLDivElement, AssistiveDevicesProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'basic', 
    device = 'switch',
    feedback = 'visual',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.assistiveDevices) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('basic');
      }
    }, [config.motor.assistiveDevices, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing assistive devices classes
        document.body.classList.remove(
          'assistive-devices-basic',
          'assistive-devices-advanced',
          'assistive-devices-expert',
          'assistive-devices-custom'
        );
        
        if (config.motor.assistiveDevices) {
          document.body.classList.add(`assistive-devices-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.motor.assistiveDevices]);

    return (
      <div
        ref={ref}
        className={cn(
          assistiveDevicesVariants({ mode: currentMode, device, feedback }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AssistiveDevicesProvider.displayName = 'AssistiveDevicesProvider';

// Assistive Devices Button Component
interface AssistiveDevicesButtonProps extends VariantProps<typeof assistiveDevicesVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  deviceAction?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
}

export const AssistiveDevicesButton = React.forwardRef<HTMLButtonElement, AssistiveDevicesButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    deviceAction,
    mode = 'basic',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAssistiveDevicesEnabled = config.motor.assistiveDevices;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          assistiveDevicesVariants({ 
            mode: isAssistiveDevicesEnabled ? mode : 'basic'
          }),
          className
        )}
        data-device-action={deviceAction}
        aria-describedby={deviceAction ? `${ref}-device-info` : undefined}
        {...props}
      >
        {children}
        {deviceAction && (
          <span id={`${ref}-device-info`} className="sr-only">
            Device action: {deviceAction}
          </span>
        )}
      </button>
    );
  }
);

AssistiveDevicesButton.displayName = 'AssistiveDevicesButton';

// Assistive Devices Status Component
interface AssistiveDevicesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AssistiveDevicesStatus = React.forwardRef<HTMLDivElement, AssistiveDevicesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAssistiveDevicesEnabled = config.motor.assistiveDevices;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="font-medium">
          Assistive Devices: {isAssistiveDevicesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAssistiveDevicesEnabled 
              ? 'Assistive device integration and support' 
              : 'Standard input devices only'
            }
          </div>
        )}
      </div>
    );
  }
);

AssistiveDevicesStatus.displayName = 'AssistiveDevicesStatus';

// Assistive Devices Demo Component
interface AssistiveDevicesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AssistiveDevicesDemo = React.forwardRef<HTMLDivElement, AssistiveDevicesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAssistiveDevicesEnabled = config.motor.assistiveDevices;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Assistive Devices Demo</h3>
        
        <div className="flex gap-2">
          <AssistiveDevicesButton
            mode={isAssistiveDevicesEnabled ? 'advanced' : 'basic'}
            deviceAction="switch-press"
            onClick={() => console.log('Switch press button clicked')}
          >
            Switch Press
          </AssistiveDevicesButton>
          
          <AssistiveDevicesButton
            mode={isAssistiveDevicesEnabled ? 'advanced' : 'basic'}
            deviceAction="joystick-move"
            onClick={() => console.log('Joystick move button clicked')}
          >
            Joystick Move
          </AssistiveDevicesButton>
          
          <AssistiveDevicesButton
            mode={isAssistiveDevicesEnabled ? 'advanced' : 'basic'}
            deviceAction="trackball-roll"
            onClick={() => console.log('Trackball roll button clicked')}
          >
            Trackball Roll
          </AssistiveDevicesButton>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <AssistiveDevicesButton
            mode={isAssistiveDevicesEnabled ? 'advanced' : 'basic'}
            deviceAction="head-pointer"
            onClick={() => console.log('Head pointer button clicked')}
          >
            Head Pointer
          </AssistiveDevicesButton>
          
          <AssistiveDevicesButton
            mode={isAssistiveDevicesEnabled ? 'advanced' : 'basic'}
            deviceAction="mouth-stick"
            onClick={() => console.log('Mouth stick button clicked')}
          >
            Mouth Stick
          </AssistiveDevicesButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAssistiveDevicesEnabled 
                ? 'Assistive devices are enabled. Use your assistive device to interact with the interface.'
                : 'Standard input devices are used. Enable assistive devices for specialized device support.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AssistiveDevicesDemo.displayName = 'AssistiveDevicesDemo';

// Export all components
export {
  assistiveDevicesVariants,
  type AssistiveDevicesToggleProps,
  type AssistiveDevicesSelectorProps,
  type AssistiveDevicesProviderProps,
  type AssistiveDevicesButtonProps,
  type AssistiveDevicesStatusProps,
  type AssistiveDevicesDemoProps
};
