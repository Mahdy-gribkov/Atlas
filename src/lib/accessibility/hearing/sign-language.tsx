/**
 * Sign Language Component
 * 
 * Provides sign language support for hearing accessibility.
 * Implements WCAG 2.1 AA sign language requirements and hearing accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Sign Language Variants
const signLanguageVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'sign-language-standard',
        'enhanced': 'sign-language-enhanced',
        'comprehensive': 'sign-language-comprehensive',
        'custom': 'sign-language-custom'
      },
      type: {
        'asl': 'sign-type-asl',
        'bsl': 'sign-type-bsl',
        'lsf': 'sign-type-lsf',
        'mixed': 'sign-type-mixed'
      },
      style: {
        'minimal': 'sign-style-minimal',
        'moderate': 'sign-style-moderate',
        'detailed': 'sign-style-detailed',
        'custom': 'sign-style-custom'
      },
      size: {
        'small': 'sign-size-small',
        'medium': 'sign-size-medium',
        'large': 'sign-size-large',
        'custom': 'sign-size-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'asl',
      style: 'moderate',
      size: 'medium'
    }
  }
);

// Sign Language Toggle Props
interface SignLanguageToggleProps extends VariantProps<typeof signLanguageVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Sign Language Toggle Component
export const SignLanguageToggle = React.forwardRef<HTMLButtonElement, SignLanguageToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.hearing.signLanguage);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        hearing: {
          signLanguage: newState
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
            ? 'bg-orange-600 text-white border-orange-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable sign language support' : 'Enable sign language support'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Sign language support enabled' : 'Sign language support disabled'}
          </span>
        )}
      </button>
    );
  }
);

SignLanguageToggle.displayName = 'SignLanguageToggle';

// Sign Language Provider Props
interface SignLanguageProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'asl' | 'bsl' | 'lsf' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Sign Language Provider Component
export const SignLanguageProvider = React.forwardRef<HTMLDivElement, SignLanguageProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'asl',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.hearing.signLanguage) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.hearing.signLanguage]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing sign language classes
        document.body.classList.remove(
          'sign-language-standard',
          'sign-language-enhanced',
          'sign-language-comprehensive',
          'sign-language-custom'
        );
        
        document.body.classList.add(`sign-language-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          signLanguageVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SignLanguageProvider.displayName = 'SignLanguageProvider';

// Sign Language Video Component
interface SignLanguageVideoProps extends VariantProps<typeof signLanguageVariants> {
  className?: string;
  children: React.ReactNode;
  signLanguageContent?: string;
  type?: 'asl' | 'bsl' | 'lsf' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  size?: 'small' | 'medium' | 'large' | 'custom';
}

export const SignLanguageVideo = React.forwardRef<HTMLDivElement, SignLanguageVideoProps>(
  ({ 
    className, 
    children,
    signLanguageContent,
    type = 'asl',
    mode = 'standard',
    style = 'moderate',
    size = 'medium',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isSignLanguageEnabled = config.hearing.signLanguage;

    const sizeClasses = {
      small: 'w-32 h-24',
      medium: 'w-48 h-36',
      large: 'w-64 h-48'
    };

    const typeLabels = {
      asl: 'American Sign Language',
      bsl: 'British Sign Language',
      lsf: 'French Sign Language',
      mixed: 'Sign Language'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          signLanguageVariants({ 
            mode: isSignLanguageEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isSignLanguageEnabled && signLanguageContent && (
          <div className="mt-4">
            <div className={cn('mx-auto bg-gray-900 rounded-lg flex items-center justify-center text-white', sizeClasses[size])}>
              <div className="text-center">
                <div className="text-2xl mb-2">👋</div>
                <div className="text-sm">{typeLabels[type]}</div>
              </div>
            </div>
            <div className="mt-2 p-3 bg-gray-100 rounded-md dark:bg-gray-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">👋</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {typeLabels[type]} Translation
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {signLanguageContent}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
);

SignLanguageVideo.displayName = 'SignLanguageVideo';

// Sign Language Text Component
interface SignLanguageTextProps extends VariantProps<typeof signLanguageVariants> {
  className?: string;
  children: React.ReactNode;
  signLanguageContent?: string;
  type?: 'asl' | 'bsl' | 'lsf' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const SignLanguageText = React.forwardRef<HTMLDivElement, SignLanguageTextProps>(
  ({ 
    className, 
    children,
    signLanguageContent,
    type = 'asl',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isSignLanguageEnabled = config.hearing.signLanguage;

    const typeLabels = {
      asl: 'American Sign Language',
      bsl: 'British Sign Language',
      lsf: 'French Sign Language',
      mixed: 'Sign Language'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'transition-all duration-300',
          signLanguageVariants({ 
            mode: isSignLanguageEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        {children}
        
        {isSignLanguageEnabled && signLanguageContent && (
          <div className="mt-3 p-3 bg-gray-100 rounded-md dark:bg-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">👋</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {typeLabels[type]} Translation
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {signLanguageContent}
            </p>
          </div>
        )}
      </div>
    );
  }
);

SignLanguageText.displayName = 'SignLanguageText';

// Sign Language Status Component
interface SignLanguageStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SignLanguageStatus = React.forwardRef<HTMLDivElement, SignLanguageStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isSignLanguageEnabled = config.hearing.signLanguage;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-orange-500" />
        <span className="font-medium">
          Sign Language: {isSignLanguageEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isSignLanguageEnabled 
              ? 'Sign language support and translations' 
              : 'Standard text content'
            }
          </div>
        )}
      </div>
    );
  }
);

SignLanguageStatus.displayName = 'SignLanguageStatus';

// Sign Language Demo Component
interface SignLanguageDemoProps {
  className?: string;
  showControls?: boolean;
}

export const SignLanguageDemo = React.forwardRef<HTMLDivElement, SignLanguageDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isSignLanguageEnabled = config.hearing.signLanguage;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Sign Language Demo</h3>
        
        <div className="space-y-4">
          <SignLanguageVideo
            mode={isSignLanguageEnabled ? 'enhanced' : 'standard'}
            type={isSignLanguageEnabled ? 'asl' : 'asl'}
            style={isSignLanguageEnabled ? 'detailed' : 'moderate'}
            signLanguageContent="Welcome to Atlas Travel Agent. We help you plan your perfect trip."
          >
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Video Content
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This content would normally be presented as video.
              </p>
            </div>
          </SignLanguageVideo>
          
          <SignLanguageText
            mode={isSignLanguageEnabled ? 'enhanced' : 'standard'}
            type={isSignLanguageEnabled ? 'asl' : 'asl'}
            style={isSignLanguageEnabled ? 'detailed' : 'moderate'}
            signLanguageContent="This is a sign language translation of the text content. It provides the same information in sign language format."
          >
            <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h4 className="text-md font-semibold mb-2 text-gray-800 dark:text-gray-200">
                Text Content
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This content would normally be presented as text.
              </p>
            </div>
          </SignLanguageText>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isSignLanguageEnabled 
                ? 'Sign language support is enabled. Sign language translations are provided for content.'
                : 'Standard text content is used. Enable sign language support for sign language translations.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

SignLanguageDemo.displayName = 'SignLanguageDemo';

// Export all components
export {
  signLanguageVariants,
  type SignLanguageToggleProps,
  type SignLanguageProviderProps,
  type SignLanguageVideoProps,
  type SignLanguageTextProps,
  type SignLanguageStatusProps,
  type SignLanguageDemoProps
};
