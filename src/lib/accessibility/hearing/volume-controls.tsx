/**
 * Volume Controls Component
 * 
 * Provides volume controls support for hearing accessibility.
 * Implements WCAG 2.1 AA volume controls requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Volume Controls Variants
const volumeControlsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'volume-controls-standard',
        'enhanced': 'volume-controls-enhanced',
        'comprehensive': 'volume-controls-comprehensive',
        'custom': 'volume-controls-custom'
      },
      type: {
        'slider': 'volume-type-slider',
        'buttons': 'volume-type-buttons',
        'mixed': 'volume-type-mixed',
        'custom': 'volume-type-custom'
      },
      style: {
        'minimal': 'volume-style-minimal',
        'moderate': 'volume-style-moderate',
        'detailed': 'volume-style-detailed',
        'custom': 'volume-style-custom'
      },
      size: {
        'small': 'volume-size-small',
        'medium': 'volume-size-medium',
        'large': 'volume-size-large',
        'custom': 'volume-size-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'slider',
      style: 'moderate',
      size: 'medium'
    }
  }
);

// Volume Controls Toggle Props
interface VolumeControlsToggleProps extends VariantProps<typeof volumeControlsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Volume Controls Toggle Component
export const VolumeControlsToggle = React.forwardRef<HTMLButtonElement, VolumeControlsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.volumeControls);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          volumeControls: newState
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
            ? 'bg-yellow-600 text-white border-yellow-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable volume controls' : 'Enable volume controls'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Volume controls enabled' : 'Volume controls disabled'}
          </span>
        )}
      </button>
    );
  }
);

VolumeControlsToggle.displayName = 'VolumeControlsToggle';

// Volume Controls Provider Props
interface VolumeControlsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'slider' | 'buttons' | 'mixed' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Volume Controls Provider Component
export const VolumeControlsProvider = React.forwardRef<HTMLDivElement, VolumeControlsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'slider',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.volumeControls) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.volumeControls]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing volume controls classes
        document.body.classList.remove(
          'volume-controls-standard',
          'volume-controls-enhanced',
          'volume-controls-comprehensive',
          'volume-controls-custom'
        );
        
        document.body.classList.add(`volume-controls-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          volumeControlsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VolumeControlsProvider.displayName = 'VolumeControlsProvider';

// Volume Controls Slider Component
interface VolumeControlsSliderProps extends VariantProps<typeof volumeControlsVariants> {
  className?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  type?: 'slider' | 'buttons' | 'mixed' | 'custom';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  size?: 'small' | 'medium' | 'large' | 'custom';
}

export const VolumeControlsSlider = React.forwardRef<HTMLDivElement, VolumeControlsSliderProps>(
  ({ 
    className, 
    value = 50,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    type = 'slider',
    mode = 'standard',
    style = 'moderate',
    size = 'medium',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVolumeControlsEnabled = config.hearing.volumeControls;
    const [currentValue, setCurrentValue] = useState(value);

    const sizeClasses = {
      small: 'h-2',
      medium: 'h-3',
      large: 'h-4'
    };

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value);
      setCurrentValue(newValue);
      onChange?.(newValue);
    }, [onChange]);

    const handleMute = useCallback(() => {
      const newValue = currentValue === 0 ? 50 : 0;
      setCurrentValue(newValue);
      onChange?.(newValue);
    }, [currentValue, onChange]);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 transition-all duration-300',
          volumeControlsVariants({ 
            mode: isVolumeControlsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <button
          onClick={handleMute}
          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={currentValue === 0 ? 'Unmute' : 'Mute'}
        >
          {currentValue === 0 ? '🔇' : '🔊'}
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            onChange={handleChange}
            className={cn(
              'w-full appearance-none bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700',
              sizeClasses[size]
            )}
            aria-label="Volume control"
          />
        </div>
        
        <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-center">
          {currentValue}
        </span>
      </div>
    );
  }
);

VolumeControlsSlider.displayName = 'VolumeControlsSlider';

// Volume Controls Buttons Component
interface VolumeControlsButtonsProps extends VariantProps<typeof volumeControlsVariants> {
  className?: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  type?: 'slider' | 'buttons' | 'mixed' | 'custom';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const VolumeControlsButtons = React.forwardRef<HTMLDivElement, VolumeControlsButtonsProps>(
  ({ 
    className, 
    value = 50,
    min = 0,
    max = 100,
    step = 10,
    onChange,
    type = 'buttons',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isVolumeControlsEnabled = config.hearing.volumeControls;
    const [currentValue, setCurrentValue] = useState(value);

    const handleVolumeChange = useCallback((newValue: number) => {
      const clampedValue = Math.max(min, Math.min(max, newValue));
      setCurrentValue(clampedValue);
      onChange?.(clampedValue);
    }, [min, max, onChange]);

    const handleMute = useCallback(() => {
      const newValue = currentValue === 0 ? 50 : 0;
      setCurrentValue(newValue);
      onChange?.(newValue);
    }, [currentValue, onChange]);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 transition-all duration-300',
          volumeControlsVariants({ 
            mode: isVolumeControlsEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <button
          onClick={handleMute}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={currentValue === 0 ? 'Unmute' : 'Mute'}
        >
          {currentValue === 0 ? '🔇' : '🔊'}
        </button>
        
        <button
          onClick={() => handleVolumeChange(currentValue - step)}
          disabled={currentValue <= min}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Decrease volume"
        >
          🔉
        </button>
        
        <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-center">
          {currentValue}
        </span>
        
        <button
          onClick={() => handleVolumeChange(currentValue + step)}
          disabled={currentValue >= max}
          className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Increase volume"
        >
          🔊
        </button>
      </div>
    );
  }
);

VolumeControlsButtons.displayName = 'VolumeControlsButtons';

// Volume Controls Status Component
interface VolumeControlsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VolumeControlsStatus = React.forwardRef<HTMLDivElement, VolumeControlsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isVolumeControlsEnabled = config.hearing.volumeControls;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="font-medium">
          Volume Controls: {isVolumeControlsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isVolumeControlsEnabled 
              ? 'Enhanced volume controls and audio management' 
              : 'Standard volume controls'
            }
          </div>
        )}
      </div>
    );
  }
);

VolumeControlsStatus.displayName = 'VolumeControlsStatus';

// Volume Controls Demo Component
interface VolumeControlsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VolumeControlsDemo = React.forwardRef<HTMLDivElement, VolumeControlsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isVolumeControlsEnabled = config.hearing.volumeControls;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Volume Controls Demo</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-md font-medium mb-2">Volume Slider</h4>
            <VolumeControlsSlider
              mode={isVolumeControlsEnabled ? 'enhanced' : 'standard'}
              type={isVolumeControlsEnabled ? 'mixed' : 'slider'}
              style={isVolumeControlsEnabled ? 'detailed' : 'moderate'}
              size={isVolumeControlsEnabled ? 'large' : 'medium'}
              onChange={(value) => console.log('Volume changed:', value)}
            />
          </div>
          
          <div>
            <h4 className="text-md font-medium mb-2">Volume Buttons</h4>
            <VolumeControlsButtons
              mode={isVolumeControlsEnabled ? 'enhanced' : 'standard'}
              type={isVolumeControlsEnabled ? 'mixed' : 'buttons'}
              style={isVolumeControlsEnabled ? 'detailed' : 'moderate'}
              onChange={(value) => console.log('Volume changed:', value)}
            />
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isVolumeControlsEnabled 
                ? 'Enhanced volume controls are enabled. Use sliders and buttons to control audio volume.'
                : 'Standard volume controls are used. Enable enhanced volume controls for better audio management.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

VolumeControlsDemo.displayName = 'VolumeControlsDemo';

// Export all components
export {
  volumeControlsVariants,
  type VolumeControlsToggleProps,
  type VolumeControlsProviderProps,
  type VolumeControlsSliderProps,
  type VolumeControlsButtonsProps,
  type VolumeControlsStatusProps,
  type VolumeControlsDemoProps
};
