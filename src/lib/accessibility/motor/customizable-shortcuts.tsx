/**
 * Customizable Shortcuts Component
 * 
 * Provides customizable keyboard shortcuts for motor accessibility.
 * Implements WCAG 2.1 AA customizable shortcuts requirements and user-defined shortcuts.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';
import { keyboardUtils } from '../core/accessibility-utils';

// Customizable Shortcuts Variants
const customizableShortcutsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'basic': 'shortcuts-basic',
        'advanced': 'shortcuts-advanced',
        'expert': 'shortcuts-expert',
        'custom': 'shortcuts-custom'
      },
      style: {
        'default': 'shortcuts-style-default',
        'minimal': 'shortcuts-style-minimal',
        'detailed': 'shortcuts-style-detailed',
        'custom': 'shortcuts-style-custom'
      },
      feedback: {
        'none': 'shortcuts-feedback-none',
        'visual': 'shortcuts-feedback-visual',
        'audio': 'shortcuts-feedback-audio',
        'both': 'shortcuts-feedback-both'
      },
      complexity: {
        'simple': 'shortcuts-complexity-simple',
        'moderate': 'shortcuts-complexity-moderate',
        'advanced': 'shortcuts-complexity-advanced',
        'expert': 'shortcuts-complexity-expert'
      }
    },
    defaultVariants: {
      mode: 'basic',
      style: 'default',
      feedback: 'visual',
      complexity: 'moderate'
    }
  }
);

// Customizable Shortcuts Toggle Props
interface CustomizableShortcutsToggleProps extends VariantProps<typeof customizableShortcutsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Customizable Shortcuts Toggle Component
export const CustomizableShortcutsToggle = React.forwardRef<HTMLButtonElement, CustomizableShortcutsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.motor.customizableShortcuts);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        motor: {
          customizableShortcuts: newState
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
            ? 'bg-indigo-600 text-white border-indigo-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable customizable shortcuts' : 'Enable customizable shortcuts'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Customizable shortcuts enabled' : 'Customizable shortcuts disabled'}
          </span>
        )}
      </button>
    );
  }
);

CustomizableShortcutsToggle.displayName = 'CustomizableShortcutsToggle';

// Customizable Shortcuts Provider Props
interface CustomizableShortcutsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
  style?: 'default' | 'minimal' | 'detailed' | 'custom';
  feedback?: 'none' | 'visual' | 'audio' | 'both';
  applyToBody?: boolean;
}

// Customizable Shortcuts Provider Component
export const CustomizableShortcutsProvider = React.forwardRef<HTMLDivElement, CustomizableShortcutsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'basic', 
    style = 'default',
    feedback = 'visual',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.motor.customizableShortcuts) {
        setCurrentMode(mode);
      } else {
        setCurrentMode('basic');
      }
    }, [config.motor.customizableShortcuts, mode]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing customizable shortcuts classes
        document.body.classList.remove(
          'shortcuts-basic',
          'shortcuts-advanced',
          'shortcuts-expert',
          'shortcuts-custom'
        );
        
        if (config.motor.customizableShortcuts) {
          document.body.classList.add(`shortcuts-${currentMode}`);
        }
      }
    }, [currentMode, applyToBody, config.motor.customizableShortcuts]);

    return (
      <div
        ref={ref}
        className={cn(
          customizableShortcutsVariants({ mode: currentMode, style, feedback }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CustomizableShortcutsProvider.displayName = 'CustomizableShortcutsProvider';

// Customizable Shortcuts Button Component
interface CustomizableShortcutsButtonProps extends VariantProps<typeof customizableShortcutsVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  shortcut?: string;
  mode?: 'basic' | 'advanced' | 'expert' | 'custom';
}

export const CustomizableShortcutsButton = React.forwardRef<HTMLButtonElement, CustomizableShortcutsButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    shortcut,
    mode = 'basic',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isCustomizableShortcutsEnabled = config.motor.customizableShortcuts;

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
      if (shortcut && event.key === shortcut) {
        event.preventDefault();
        onClick?.();
      }
    }, [shortcut, onClick]);

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          customizableShortcutsVariants({ 
            mode: isCustomizableShortcutsEnabled ? mode : 'basic'
          }),
          className
        )}
        data-shortcut={shortcut}
        aria-describedby={shortcut ? `${ref}-shortcut-info` : undefined}
        {...props}
      >
        {children}
        {shortcut && (
          <span id={`${ref}-shortcut-info`} className="sr-only">
            Keyboard shortcut: {keyboardUtils.getKeyboardShortcutDescription([shortcut])}
          </span>
        )}
      </button>
    );
  }
);

CustomizableShortcutsButton.displayName = 'CustomizableShortcutsButton';

// Customizable Shortcuts Manager Component
interface CustomizableShortcutsManagerProps {
  className?: string;
  showControls?: boolean;
}

export const CustomizableShortcutsManager = React.forwardRef<HTMLDivElement, CustomizableShortcutsManagerProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isCustomizableShortcutsEnabled = config.motor.customizableShortcuts;
    const [shortcuts, setShortcuts] = useState<Record<string, string>>({
      'save': 'Ctrl+S',
      'open': 'Ctrl+O',
      'new': 'Ctrl+N',
      'close': 'Ctrl+W',
      'undo': 'Ctrl+Z',
      'redo': 'Ctrl+Y',
      'cut': 'Ctrl+X',
      'copy': 'Ctrl+C',
      'paste': 'Ctrl+V',
      'find': 'Ctrl+F'
    });

    const handleShortcutChange = useCallback((action: string, newShortcut: string) => {
      setShortcuts(prev => ({
        ...prev,
        [action]: newShortcut
      }));
    }, []);

    if (!showControls || !isCustomizableShortcutsEnabled) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Customizable Shortcuts</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(shortcuts).map(([action, shortcut]) => (
            <div key={action} className="flex items-center gap-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
              <span className="font-medium text-sm w-20">{action}</span>
              <input
                type="text"
                value={shortcut}
                onChange={(e) => handleShortcutChange(action, e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                placeholder="Enter shortcut"
              />
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => {
              // Reset to defaults
              setShortcuts({
                'save': 'Ctrl+S',
                'open': 'Ctrl+O',
                'new': 'Ctrl+N',
                'close': 'Ctrl+W',
                'undo': 'Ctrl+Z',
                'redo': 'Ctrl+Y',
                'cut': 'Ctrl+X',
                'copy': 'Ctrl+C',
                'paste': 'Ctrl+V',
                'find': 'Ctrl+F'
              });
            }}
            className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Reset to Defaults
          </button>
          
          <button
            onClick={() => {
              // Save shortcuts
              localStorage.setItem('atlas-custom-shortcuts', JSON.stringify(shortcuts));
            }}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Shortcuts
          </button>
        </div>
      </div>
    );
  }
);

CustomizableShortcutsManager.displayName = 'CustomizableShortcutsManager';

// Customizable Shortcuts Status Component
interface CustomizableShortcutsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const CustomizableShortcutsStatus = React.forwardRef<HTMLDivElement, CustomizableShortcutsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isCustomizableShortcutsEnabled = config.motor.customizableShortcuts;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-indigo-500" />
        <span className="font-medium">
          Customizable Shortcuts: {isCustomizableShortcutsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isCustomizableShortcutsEnabled 
              ? 'User-defined keyboard shortcuts available' 
              : 'Standard keyboard shortcuts only'
            }
          </div>
        )}
      </div>
    );
  }
);

CustomizableShortcutsStatus.displayName = 'CustomizableShortcutsStatus';

// Customizable Shortcuts Demo Component
interface CustomizableShortcutsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const CustomizableShortcutsDemo = React.forwardRef<HTMLDivElement, CustomizableShortcutsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isCustomizableShortcutsEnabled = config.motor.customizableShortcuts;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Customizable Shortcuts Demo</h3>
        
        <div className="flex gap-2">
          <CustomizableShortcutsButton
            mode={isCustomizableShortcutsEnabled ? 'advanced' : 'basic'}
            shortcut="s"
            onClick={() => console.log('Save clicked')}
          >
            Save
          </CustomizableShortcutsButton>
          
          <CustomizableShortcutsButton
            mode={isCustomizableShortcutsEnabled ? 'advanced' : 'basic'}
            shortcut="o"
            onClick={() => console.log('Open clicked')}
          >
            Open
          </CustomizableShortcutsButton>
          
          <CustomizableShortcutsButton
            mode={isCustomizableShortcutsEnabled ? 'advanced' : 'basic'}
            shortcut="n"
            onClick={() => console.log('New clicked')}
          >
            New
          </CustomizableShortcutsButton>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isCustomizableShortcutsEnabled 
                ? 'Customizable shortcuts are enabled. Press S, O, or N to test the shortcuts.'
                : 'Standard shortcuts are used. Enable customizable shortcuts to define your own.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

CustomizableShortcutsDemo.displayName = 'CustomizableShortcutsDemo';

// Export all components
export {
  customizableShortcutsVariants,
  type CustomizableShortcutsToggleProps,
  type CustomizableShortcutsProviderProps,
  type CustomizableShortcutsButtonProps,
  type CustomizableShortcutsManagerProps,
  type CustomizableShortcutsStatusProps,
  type CustomizableShortcutsDemoProps
};
