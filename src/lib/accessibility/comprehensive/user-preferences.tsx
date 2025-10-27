/**
 * User Preferences Component
 * 
 * Provides user preferences support for comprehensive accessibility.
 * Implements WCAG 2.1 AA user preferences requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// User Preferences Variants
const userPreferencesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'user-preferences-standard',
        'enhanced': 'user-preferences-enhanced',
        'comprehensive': 'user-preferences-comprehensive',
        'custom': 'user-preferences-custom'
      },
      type: {
        'visual': 'preferences-type-visual',
        'motor': 'preferences-type-motor',
        'cognitive': 'preferences-type-cognitive',
        'hearing': 'preferences-type-hearing',
        'mixed': 'preferences-type-mixed'
      },
      style: {
        'minimal': 'preferences-style-minimal',
        'moderate': 'preferences-style-moderate',
        'detailed': 'preferences-style-detailed',
        'custom': 'preferences-style-custom'
      },
      format: {
        'text': 'preferences-format-text',
        'visual': 'preferences-format-visual',
        'interactive': 'preferences-format-interactive',
        'mixed': 'preferences-format-mixed'
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

// User Preferences Toggle Props
interface UserPreferencesToggleProps extends VariantProps<typeof userPreferencesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// User Preferences Toggle Component
export const UserPreferencesToggle = React.forwardRef<HTMLButtonElement, UserPreferencesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.userPreferences);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          userPreferences: newState
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
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable user preferences' : 'Enable user preferences'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'User preferences enabled' : 'User preferences disabled'}
          </span>
        )}
      </button>
    );
  }
);

UserPreferencesToggle.displayName = 'UserPreferencesToggle';

// User Preferences Provider Props
interface UserPreferencesProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'visual' | 'motor' | 'cognitive' | 'hearing' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// User Preferences Provider Component
export const UserPreferencesProvider = React.forwardRef<HTMLDivElement, UserPreferencesProviderProps>(
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
      if (config.comprehensive.userPreferences) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.userPreferences]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing user preferences classes
        document.body.classList.remove(
          'user-preferences-standard',
          'user-preferences-enhanced',
          'user-preferences-comprehensive',
          'user-preferences-custom'
        );
        
        document.body.classList.add(`user-preferences-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          userPreferencesVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UserPreferencesProvider.displayName = 'UserPreferencesProvider';

// User Preferences Panel Component
interface UserPreferencesPanelProps extends VariantProps<typeof userPreferencesVariants> {
  className?: string;
  onSave?: (preferences: any) => void;
  onReset?: () => void;
  type?: 'visual' | 'motor' | 'cognitive' | 'hearing' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const UserPreferencesPanel = React.forwardRef<HTMLDivElement, UserPreferencesPanelProps>(
  ({ 
    className, 
    onSave,
    onReset,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isUserPreferencesEnabled = config.comprehensive.userPreferences;
    const [preferences, setPreferences] = useState({
      visual: {
        highContrast: false,
        fontSize: 'medium',
        colorBlind: false,
        darkMode: false
      },
      motor: {
        keyboardNavigation: true,
        voiceControl: false,
        touchTargets: 'medium',
        gestureAlternatives: false
      },
      cognitive: {
        simplifiedInterface: false,
        progressIndicators: true,
        errorPrevention: true,
        clearInstructions: true
      },
      hearing: {
        audioAlternatives: true,
        visualNotifications: true,
        captionSupport: true,
        volumeControls: true
      }
    });

    const handlePreferenceChange = useCallback((category: string, key: string, value: any) => {
      setPreferences(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: value
        }
      }));
    }, []);

    const handleSave = useCallback(() => {
      onSave?.(preferences);
      console.log('Preferences saved:', preferences);
    }, [preferences, onSave]);

    const handleReset = useCallback(() => {
      setPreferences({
        visual: {
          highContrast: false,
          fontSize: 'medium',
          colorBlind: false,
          darkMode: false
        },
        motor: {
          keyboardNavigation: true,
          voiceControl: false,
          touchTargets: 'medium',
          gestureAlternatives: false
        },
        cognitive: {
          simplifiedInterface: false,
          progressIndicators: true,
          errorPrevention: true,
          clearInstructions: true
        },
        hearing: {
          audioAlternatives: true,
          visualNotifications: true,
          captionSupport: true,
          volumeControls: true
        }
      });
      onReset?.();
    }, [onReset]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          userPreferencesVariants({ 
            mode: isUserPreferencesEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Accessibility Preferences
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Visual Preferences
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.visual.highContrast}
                  onChange={(e) => handlePreferenceChange('visual', 'highContrast', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">High Contrast</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.visual.colorBlind}
                  onChange={(e) => handlePreferenceChange('visual', 'colorBlind', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Color Blind Support</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.visual.darkMode}
                  onChange={(e) => handlePreferenceChange('visual', 'darkMode', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Motor Preferences
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.motor.keyboardNavigation}
                  onChange={(e) => handlePreferenceChange('motor', 'keyboardNavigation', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Keyboard Navigation</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.motor.voiceControl}
                  onChange={(e) => handlePreferenceChange('motor', 'voiceControl', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Voice Control</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Cognitive Preferences
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.cognitive.simplifiedInterface}
                  onChange={(e) => handlePreferenceChange('cognitive', 'simplifiedInterface', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Simplified Interface</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.cognitive.progressIndicators}
                  onChange={(e) => handlePreferenceChange('cognitive', 'progressIndicators', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Progress Indicators</span>
              </label>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Hearing Preferences
            </h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.hearing.audioAlternatives}
                  onChange={(e) => handlePreferenceChange('hearing', 'audioAlternatives', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Audio Alternatives</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preferences.hearing.visualNotifications}
                  onChange={(e) => handlePreferenceChange('hearing', 'visualNotifications', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Visual Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

UserPreferencesPanel.displayName = 'UserPreferencesPanel';

// User Preferences Status Component
interface UserPreferencesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const UserPreferencesStatus = React.forwardRef<HTMLDivElement, UserPreferencesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isUserPreferencesEnabled = config.comprehensive.userPreferences;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <span className="font-medium">
          User Preferences: {isUserPreferencesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isUserPreferencesEnabled 
              ? 'Enhanced user preferences and customization' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

UserPreferencesStatus.displayName = 'UserPreferencesStatus';

// User Preferences Demo Component
interface UserPreferencesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const UserPreferencesDemo = React.forwardRef<HTMLDivElement, UserPreferencesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isUserPreferencesEnabled = config.comprehensive.userPreferences;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">User Preferences Demo</h3>
        
        <UserPreferencesPanel
          mode={isUserPreferencesEnabled ? 'enhanced' : 'standard'}
          type={isUserPreferencesEnabled ? 'mixed' : 'mixed'}
          style={isUserPreferencesEnabled ? 'detailed' : 'moderate'}
          onSave={(preferences) => console.log('Preferences saved:', preferences)}
          onReset={() => console.log('Preferences reset')}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isUserPreferencesEnabled 
                ? 'User preferences are enabled. Comprehensive customization options are available.'
                : 'Standard accessibility features are used. Enable user preferences for enhanced customization.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

UserPreferencesDemo.displayName = 'UserPreferencesDemo';

// Export all components
export {
  userPreferencesVariants,
  type UserPreferencesToggleProps,
  type UserPreferencesProviderProps,
  type UserPreferencesPanelProps,
  type UserPreferencesStatusProps,
  type UserPreferencesDemoProps
};
