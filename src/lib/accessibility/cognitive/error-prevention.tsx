/**
 * Error Prevention Component
 * 
 * Provides error prevention support for cognitive accessibility.
 * Implements WCAG 2.1 AA error prevention requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Error Prevention Variants
const errorPreventionVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'error-prevention-standard',
        'enhanced': 'error-prevention-enhanced',
        'strict': 'error-prevention-strict',
        'custom': 'error-prevention-custom'
      },
      level: {
        'basic': 'error-level-basic',
        'intermediate': 'error-level-intermediate',
        'advanced': 'error-level-advanced',
        'expert': 'error-level-expert'
      },
      feedback: {
        'none': 'error-feedback-none',
        'immediate': 'error-feedback-immediate',
        'delayed': 'error-feedback-delayed',
        'both': 'error-feedback-both'
      },
      style: {
        'subtle': 'error-style-subtle',
        'moderate': 'error-style-moderate',
        'prominent': 'error-style-prominent',
        'custom': 'error-style-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      level: 'intermediate',
      feedback: 'immediate',
      style: 'moderate'
    }
  }
);

// Error Prevention Toggle Props
interface ErrorPreventionToggleProps extends VariantProps<typeof errorPreventionVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Error Prevention Toggle Component
export const ErrorPreventionToggle = React.forwardRef<HTMLButtonElement, ErrorPreventionToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.errorPrevention);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          errorPrevention: newState
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
            ? 'bg-red-600 text-white border-red-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable error prevention' : 'Enable error prevention'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Error prevention enabled' : 'Error prevention disabled'}
          </span>
        )}
      </button>
    );
  }
);

ErrorPreventionToggle.displayName = 'ErrorPreventionToggle';

// Error Prevention Provider Props
interface ErrorPreventionProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
  feedback?: 'none' | 'immediate' | 'delayed' | 'both';
  applyToBody?: boolean;
}

// Error Prevention Provider Component
export const ErrorPreventionProvider = React.forwardRef<HTMLDivElement, ErrorPreventionProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    level = 'intermediate',
    feedback = 'immediate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.errorPrevention) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.errorPrevention]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing error prevention classes
        document.body.classList.remove(
          'error-prevention-standard',
          'error-prevention-enhanced',
          'error-prevention-strict',
          'error-prevention-custom'
        );
        
        document.body.classList.add(`error-prevention-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          errorPreventionVariants({ mode: currentMode, level, feedback }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ErrorPreventionProvider.displayName = 'ErrorPreventionProvider';

// Error Prevention Input Component
interface ErrorPreventionInputProps extends VariantProps<typeof errorPreventionVariants> {
  className?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export const ErrorPreventionInput = React.forwardRef<HTMLInputElement, ErrorPreventionInputProps>(
  ({ 
    className, 
    type = 'text',
    placeholder,
    value = '',
    onChange,
    onBlur,
    required = false,
    pattern,
    minLength,
    maxLength,
    mode = 'standard',
    level = 'intermediate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isErrorPreventionEnabled = config.cognitive.errorPrevention;
    const [error, setError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const validateInput = useCallback((inputValue: string) => {
      if (!isErrorPreventionEnabled) return true;

      setIsValidating(true);

      // Required field validation
      if (required && !inputValue.trim()) {
        setError('This field is required');
        return false;
      }

      // Pattern validation
      if (pattern && inputValue && !new RegExp(pattern).test(inputValue)) {
        setError('Invalid format');
        return false;
      }

      // Length validation
      if (minLength && inputValue.length < minLength) {
        setError(`Minimum ${minLength} characters required`);
        return false;
      }

      if (maxLength && inputValue.length > maxLength) {
        setError(`Maximum ${maxLength} characters allowed`);
        return false;
      }

      // Type-specific validation
      if (type === 'email' && inputValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputValue)) {
          setError('Please enter a valid email address');
          return false;
        }
      }

      if (type === 'url' && inputValue) {
        try {
          new URL(inputValue);
        } catch {
          setError('Please enter a valid URL');
          return false;
        }
      }

      setError(null);
      return true;
    }, [isErrorPreventionEnabled, required, pattern, minLength, maxLength, type]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange?.(newValue);
      
      if (isErrorPreventionEnabled) {
        validateInput(newValue);
      }
    }, [onChange, validateInput, isErrorPreventionEnabled]);

    const handleBlur = useCallback(() => {
      if (isErrorPreventionEnabled) {
        validateInput(value);
      }
      onBlur?.();
    }, [onBlur, validateInput, value, isErrorPreventionEnabled]);

    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          pattern={pattern}
          minLength={minLength}
          maxLength={maxLength}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
            errorPreventionVariants({ 
              mode: isErrorPreventionEnabled ? 'enhanced' : mode,
              level
            }),
            error 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
              : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${ref}-error` : undefined}
          {...props}
        />
        
        {error && (
          <div
            id={`${ref}-error`}
            className="mt-1 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}
        
        {isValidating && (
          <div className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            Validating...
          </div>
        )}
      </div>
    );
  }
);

ErrorPreventionInput.displayName = 'ErrorPreventionInput';

// Error Prevention Form Component
interface ErrorPreventionFormProps extends VariantProps<typeof errorPreventionVariants> {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (data: FormData) => void;
  mode?: 'standard' | 'enhanced' | 'strict' | 'custom';
  level?: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export const ErrorPreventionForm = React.forwardRef<HTMLFormElement, ErrorPreventionFormProps>(
  ({ children, className, onSubmit, mode = 'standard', level = 'intermediate', ...props }, ref) => {
    const { config } = useAccessibility();
    const isErrorPreventionEnabled = config.cognitive.errorPrevention;

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (isErrorPreventionEnabled) {
        const formData = new FormData(e.currentTarget);
        onSubmit?.(formData);
      } else {
        onSubmit?.(new FormData(e.currentTarget));
      }
    }, [onSubmit, isErrorPreventionEnabled]);

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          'space-y-4',
          errorPreventionVariants({ 
            mode: isErrorPreventionEnabled ? 'enhanced' : mode,
            level
          }),
          className
        )}
        {...props}
      >
        {children}
      </form>
    );
  }
);

ErrorPreventionForm.displayName = 'ErrorPreventionForm';

// Error Prevention Status Component
interface ErrorPreventionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ErrorPreventionStatus = React.forwardRef<HTMLDivElement, ErrorPreventionStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isErrorPreventionEnabled = config.cognitive.errorPrevention;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <span className="font-medium">
          Error Prevention: {isErrorPreventionEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isErrorPreventionEnabled 
              ? 'Enhanced error prevention and validation' 
              : 'Standard error handling'
            }
          </div>
        )}
      </div>
    );
  }
);

ErrorPreventionStatus.displayName = 'ErrorPreventionStatus';

// Error Prevention Demo Component
interface ErrorPreventionDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ErrorPreventionDemo = React.forwardRef<HTMLDivElement, ErrorPreventionDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isErrorPreventionEnabled = config.cognitive.errorPrevention;
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: ''
    });

    const handleInputChange = useCallback((field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback((data: FormData) => {
      console.log('Form submitted:', Object.fromEntries(data));
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Error Prevention Demo</h3>
        
        <ErrorPreventionForm
          mode={isErrorPreventionEnabled ? 'enhanced' : 'standard'}
          level={isErrorPreventionEnabled ? 'advanced' : 'intermediate'}
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <ErrorPreventionInput
              mode={isErrorPreventionEnabled ? 'enhanced' : 'standard'}
              level={isErrorPreventionEnabled ? 'advanced' : 'intermediate'}
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <ErrorPreventionInput
              mode={isErrorPreventionEnabled ? 'enhanced' : 'standard'}
              level={isErrorPreventionEnabled ? 'advanced' : 'intermediate'}
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              required
              minLength={8}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <ErrorPreventionInput
              mode={isErrorPreventionEnabled ? 'enhanced' : 'standard'}
              level={isErrorPreventionEnabled ? 'advanced' : 'intermediate'}
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(value) => handleInputChange('confirmPassword', value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </ErrorPreventionForm>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isErrorPreventionEnabled 
                ? 'Enhanced error prevention is enabled. Try entering invalid data to see validation.'
                : 'Standard error handling is used. Enable error prevention for enhanced validation.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

ErrorPreventionDemo.displayName = 'ErrorPreventionDemo';

// Export all components
export {
  errorPreventionVariants,
  type ErrorPreventionToggleProps,
  type ErrorPreventionProviderProps,
  type ErrorPreventionInputProps,
  type ErrorPreventionFormProps,
  type ErrorPreventionStatusProps,
  type ErrorPreventionDemoProps
};
