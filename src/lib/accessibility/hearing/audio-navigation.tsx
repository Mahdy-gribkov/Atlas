/**
 * Audio Navigation Component
 * 
 * Provides audio navigation support for hearing accessibility.
 * Implements WCAG 2.1 AA audio navigation requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Audio Navigation Variants
const audioNavigationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'audio-navigation-standard',
        'enhanced': 'audio-navigation-enhanced',
        'comprehensive': 'audio-navigation-comprehensive',
        'custom': 'audio-navigation-custom'
      },
      type: {
        'verbal': 'navigation-type-verbal',
        'audio': 'navigation-type-audio',
        'mixed': 'navigation-type-mixed',
        'custom': 'navigation-type-custom'
      },
      style: {
        'minimal': 'navigation-style-minimal',
        'moderate': 'navigation-style-moderate',
        'detailed': 'navigation-style-detailed',
        'custom': 'navigation-style-custom'
      },
      format: {
        'text': 'navigation-format-text',
        'audio': 'navigation-format-audio',
        'visual': 'navigation-format-visual',
        'mixed': 'navigation-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'verbal',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Audio Navigation Toggle Props
interface AudioNavigationToggleProps extends VariantProps<typeof audioNavigationVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Audio Navigation Toggle Component
export const AudioNavigationToggle = React.forwardRef<HTMLButtonElement, AudioNavigationToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.audioNavigation);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          audioNavigation: newState
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
        aria-label={isEnabled ? 'Disable audio navigation' : 'Enable audio navigation'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Audio navigation enabled' : 'Audio navigation disabled'}
          </span>
        )}
      </button>
    );
  }
);

AudioNavigationToggle.displayName = 'AudioNavigationToggle';

// Audio Navigation Provider Props
interface AudioNavigationProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'verbal' | 'audio' | 'mixed' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Audio Navigation Provider Component
export const AudioNavigationProvider = React.forwardRef<HTMLDivElement, AudioNavigationProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'verbal',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.audioNavigation) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.audioNavigation]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing audio navigation classes
        document.body.classList.remove(
          'audio-navigation-standard',
          'audio-navigation-enhanced',
          'audio-navigation-comprehensive',
          'audio-navigation-custom'
        );
        
        document.body.classList.add(`audio-navigation-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          audioNavigationVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AudioNavigationProvider.displayName = 'AudioNavigationProvider';

// Audio Navigation Menu Component
interface AudioNavigationMenuProps extends VariantProps<typeof audioNavigationVariants> {
  className?: string;
  items: Array<{ label: string; href?: string; onClick?: () => void }>;
  title?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'verbal' | 'audio' | 'mixed' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  format?: 'text' | 'audio' | 'visual' | 'mixed';
}

export const AudioNavigationMenu = React.forwardRef<HTMLDivElement, AudioNavigationMenuProps>(
  ({ 
    className, 
    items,
    title,
    mode = 'standard',
    type = 'verbal',
    style = 'moderate',
    format = 'mixed',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioNavigationEnabled = config.hearing.audioNavigation;

    const handleItemClick = useCallback((item: { label: string; href?: string; onClick?: () => void }) => {
      if (isAudioNavigationEnabled) {
        console.log(`Audio navigation: ${item.label}`);
      }
      item.onClick?.();
    }, [isAudioNavigationEnabled]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          audioNavigationVariants({ 
            mode: isAudioNavigationEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        
        <nav className="space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className={cn(
                'w-full text-left p-3 rounded-md transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                audioNavigationVariants({ 
                  mode: isAudioNavigationEnabled ? 'enhanced' : mode,
                  type,
                  style,
                  format
                })
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">🔊</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    );
  }
);

AudioNavigationMenu.displayName = 'AudioNavigationMenu';

// Audio Navigation Breadcrumb Component
interface AudioNavigationBreadcrumbProps extends VariantProps<typeof audioNavigationVariants> {
  className?: string;
  items: Array<{ label: string; href?: string }>;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'verbal' | 'audio' | 'mixed' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  format?: 'text' | 'audio' | 'visual' | 'mixed';
}

export const AudioNavigationBreadcrumb = React.forwardRef<HTMLDivElement, AudioNavigationBreadcrumbProps>(
  ({ 
    className, 
    items,
    mode = 'standard',
    type = 'verbal',
    style = 'moderate',
    format = 'mixed',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isAudioNavigationEnabled = config.hearing.audioNavigation;

    const handleItemClick = useCallback((item: { label: string; href?: string }) => {
      if (isAudioNavigationEnabled) {
        console.log(`Audio navigation breadcrumb: ${item.label}`);
      }
    }, [isAudioNavigationEnabled]);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          audioNavigationVariants({ 
            mode: isAudioNavigationEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => handleItemClick(item)}
              className={cn(
                'text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200',
                audioNavigationVariants({ 
                  mode: isAudioNavigationEnabled ? 'enhanced' : mode,
                  type,
                  style,
                  format
                })
              )}
            >
              {item.label}
            </button>
            {index < items.length - 1 && (
              <span className="text-gray-400 dark:text-gray-500">/</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

AudioNavigationBreadcrumb.displayName = 'AudioNavigationBreadcrumb';

// Audio Navigation Status Component
interface AudioNavigationStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const AudioNavigationStatus = React.forwardRef<HTMLDivElement, AudioNavigationStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isAudioNavigationEnabled = config.hearing.audioNavigation;

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
          Audio Navigation: {isAudioNavigationEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isAudioNavigationEnabled 
              ? 'Enhanced audio navigation and guidance' 
              : 'Standard navigation'
            }
          </div>
        )}
      </div>
    );
  }
);

AudioNavigationStatus.displayName = 'AudioNavigationStatus';

// Audio Navigation Demo Component
interface AudioNavigationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const AudioNavigationDemo = React.forwardRef<HTMLDivElement, AudioNavigationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isAudioNavigationEnabled = config.hearing.audioNavigation;

    const menuItems = [
      { label: 'Home', onClick: () => console.log('Home clicked') },
      { label: 'Search Flights', onClick: () => console.log('Search Flights clicked') },
      { label: 'Book Hotel', onClick: () => console.log('Book Hotel clicked') },
      { label: 'My Bookings', onClick: () => console.log('My Bookings clicked') },
      { label: 'Profile', onClick: () => console.log('Profile clicked') }
    ];

    const breadcrumbItems = [
      { label: 'Home' },
      { label: 'Search' },
      { label: 'Flights' },
      { label: 'Results' }
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Audio Navigation Demo</h3>
        
        <div className="space-y-4">
          <AudioNavigationBreadcrumb
            mode={isAudioNavigationEnabled ? 'enhanced' : 'standard'}
            type={isAudioNavigationEnabled ? 'mixed' : 'verbal'}
            style={isAudioNavigationEnabled ? 'detailed' : 'moderate'}
            items={breadcrumbItems}
          />
          
          <AudioNavigationMenu
            mode={isAudioNavigationEnabled ? 'enhanced' : 'standard'}
            type={isAudioNavigationEnabled ? 'mixed' : 'verbal'}
            style={isAudioNavigationEnabled ? 'detailed' : 'moderate'}
            title="Main Navigation"
            items={menuItems}
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAudioNavigationEnabled 
                ? 'Audio navigation is enabled. Audio guidance is provided for navigation elements.'
                : 'Standard navigation is used. Enable audio navigation for audio guidance.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

AudioNavigationDemo.displayName = 'AudioNavigationDemo';

// Export all components
export {
  audioNavigationVariants,
  type AudioNavigationToggleProps,
  type AudioNavigationProviderProps,
  type AudioNavigationMenuProps,
  type AudioNavigationBreadcrumbProps,
  type AudioNavigationStatusProps,
  type AudioNavigationDemoProps
};
