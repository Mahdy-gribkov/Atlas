/**
 * Caption Support Component
 * 
 * Provides caption support for hearing accessibility.
 * Implements WCAG 2.1 AA caption support requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Caption Support Variants
const captionSupportVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'caption-support-standard',
        'enhanced': 'caption-support-enhanced',
        'comprehensive': 'caption-support-comprehensive',
        'custom': 'caption-support-custom'
      },
      style: {
        'minimal': 'caption-style-minimal',
        'moderate': 'caption-style-moderate',
        'detailed': 'caption-style-detailed',
        'custom': 'caption-style-custom'
      },
      size: {
        'small': 'caption-size-small',
        'medium': 'caption-size-medium',
        'large': 'caption-size-large',
        'custom': 'caption-size-custom'
      },
      position: {
        'bottom': 'caption-position-bottom',
        'top': 'caption-position-top',
        'overlay': 'caption-position-overlay',
        'custom': 'caption-position-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      style: 'moderate',
      size: 'medium',
      position: 'bottom'
    }
  }
);

// Caption Support Toggle Props
interface CaptionSupportToggleProps extends VariantProps<typeof captionSupportVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Caption Support Toggle Component
export const CaptionSupportToggle = React.forwardRef<HTMLButtonElement, CaptionSupportToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.captionSupport);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          captionSupport: newState
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
        aria-label={isEnabled ? 'Disable caption support' : 'Enable caption support'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Caption support enabled' : 'Caption support disabled'}
          </span>
        )}
      </button>
    );
  }
);

CaptionSupportToggle.displayName = 'CaptionSupportToggle';

// Caption Support Provider Props
interface CaptionSupportProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  size?: 'small' | 'medium' | 'large' | 'custom';
  applyToBody?: boolean;
}

// Caption Support Provider Component
export const CaptionSupportProvider = React.forwardRef<HTMLDivElement, CaptionSupportProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    style = 'moderate',
    size = 'medium',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.captionSupport) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.captionSupport]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing caption support classes
        document.body.classList.remove(
          'caption-support-standard',
          'caption-support-enhanced',
          'caption-support-comprehensive',
          'caption-support-custom'
        );
        
        document.body.classList.add(`caption-support-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          captionSupportVariants({ mode: currentMode, style, size }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CaptionSupportProvider.displayName = 'CaptionSupportProvider';

// Caption Support Video Component
interface CaptionSupportVideoProps extends VariantProps<typeof captionSupportVariants> {
  className?: string;
  src?: string;
  captions?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  size?: 'small' | 'medium' | 'large' | 'custom';
  position?: 'bottom' | 'top' | 'overlay' | 'custom';
}

export const CaptionSupportVideo = React.forwardRef<HTMLDivElement, CaptionSupportVideoProps>(
  ({ 
    className, 
    src,
    captions,
    mode = 'standard',
    style = 'moderate',
    size = 'medium',
    position = 'bottom',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isCaptionSupportEnabled = config.hearing.captionSupport;

    const sizeClasses = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base'
    };

    const positionClasses = {
      bottom: 'bottom-2',
      top: 'top-2',
      overlay: 'bottom-2 bg-black bg-opacity-75'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative transition-all duration-300',
          captionSupportVariants({ 
            mode: isCaptionSupportEnabled ? 'enhanced' : mode,
            style,
            size
          }),
          className
        )}
        {...props}
      >
        <div className="w-full h-48 bg-gray-900 rounded-lg flex items-center justify-center text-white">
          <div className="text-center">
            <div className="text-2xl mb-2">🎥</div>
            <div className="text-sm">Video Content</div>
          </div>
        </div>
        
        {isCaptionSupportEnabled && captions && (
          <div
            className={cn(
              'absolute left-2 right-2 px-3 py-2 text-white rounded-md',
              sizeClasses[size],
              positionClasses[position]
            )}
          >
            {captions}
          </div>
        )}
      </div>
    );
  }
);

CaptionSupportVideo.displayName = 'CaptionSupportVideo';

// Caption Support Audio Component
interface CaptionSupportAudioProps extends VariantProps<typeof captionSupportVariants> {
  className?: string;
  children: React.ReactNode;
  captions?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  size?: 'small' | 'medium' | 'large' | 'custom';
}

export const CaptionSupportAudio = React.forwardRef<HTMLDivElement, CaptionSupportAudioProps>(
  ({ 
    className, 
    children,
    captions,
    mode = 'standard',
    style = 'moderate',
    size = 'medium',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isCaptionSupportEnabled = config.hearing.captionSupport;

    const sizeClasses = {
      small: 'text-xs',
      medium: 'text-sm',
      large: 'text-base'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          captionSupportVariants({ 
            mode: isCaptionSupportEnabled ? 'enhanced' : mode,
            style,
            size
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isCaptionSupportEnabled && captions && (
          <div className="mt-3 p-3 bg-gray-100 rounded-md dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">📝</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Captions
              </span>
            </div>
            <p className={cn('text-gray-600 dark:text-gray-400', sizeClasses[size])}>
              {captions}
            </p>
          </div>
        )}
      </div>
    );
  }
);

CaptionSupportAudio.displayName = 'CaptionSupportAudio';

// Caption Support Status Component
interface CaptionSupportStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const CaptionSupportStatus = React.forwardRef<HTMLDivElement, CaptionSupportStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isCaptionSupportEnabled = config.hearing.captionSupport;

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
          Caption Support: {isCaptionSupportEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isCaptionSupportEnabled 
              ? 'Enhanced caption support for audio and video content' 
              : 'Standard audio and video content'
            }
          </div>
        )}
      </div>
    );
  }
);

CaptionSupportStatus.displayName = 'CaptionSupportStatus';

// Caption Support Demo Component
interface CaptionSupportDemoProps {
  className?: string;
  showControls?: boolean;
}

export const CaptionSupportDemo = React.forwardRef<HTMLDivElement, CaptionSupportDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isCaptionSupportEnabled = config.hearing.captionSupport;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Caption Support Demo</h3>
        
        <div className="space-y-4">
          <CaptionSupportVideo
            mode={isCaptionSupportEnabled ? 'enhanced' : 'standard'}
            style={isCaptionSupportEnabled ? 'detailed' : 'moderate'}
            size={isCaptionSupportEnabled ? 'large' : 'medium'}
            captions="Welcome to Atlas Travel Agent. We help you plan your perfect trip."
          />
          
          <CaptionSupportAudio
            mode={isCaptionSupportEnabled ? 'enhanced' : 'standard'}
            style={isCaptionSupportEnabled ? 'detailed' : 'moderate'}
            size={isCaptionSupportEnabled ? 'large' : 'medium'}
            captions="This is a text alternative for the audio content. It provides the same information in a visual format for users who cannot hear the audio."
          >
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Audio Content
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This content would normally be presented as audio.
              </p>
            </div>
          </CaptionSupportAudio>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isCaptionSupportEnabled 
                ? 'Caption support is enabled. Text alternatives are provided for audio and video content.'
                : 'Standard audio and video content is used. Enable caption support for text alternatives.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

CaptionSupportDemo.displayName = 'CaptionSupportDemo';

// Export all components
export {
  captionSupportVariants,
  type CaptionSupportToggleProps,
  type CaptionSupportProviderProps,
  type CaptionSupportVideoProps,
  type CaptionSupportAudioProps,
  type CaptionSupportStatusProps,
  type CaptionSupportDemoProps
};
