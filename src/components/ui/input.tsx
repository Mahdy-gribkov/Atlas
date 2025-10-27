import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-atlas-card-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-atlas-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main focus-visible:ring-atlas-error-main',
        success: 'border-atlas-success-main focus-visible:ring-atlas-success-main',
        warning: 'border-atlas-warning-main focus-visible:ring-atlas-warning-main',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  required?: boolean;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      leftIcon,
      rightIcon,
      onRightIconClick,
      required,
      fullWidth,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    
    // Determine the actual variant based on messages
    const actualVariant = errorMessage 
      ? 'error' 
      : successMessage 
      ? 'success' 
      : warningMessage 
      ? 'warning' 
      : variant;

    const message = errorMessage || successMessage || warningMessage;

    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-atlas-text-primary"
          >
            {label}
            {required && (
              <span className="ml-1 text-atlas-error-main" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            className={cn(
              inputVariants({ variant: actualVariant, size, className }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10'
            )}
            ref={ref}
            aria-describedby={cn(
              message && errorId,
              helperText && helperId
            )}
            aria-invalid={!!errorMessage}
            aria-required={required}
            {...props}
          />
          
          {rightIcon && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary hover:text-atlas-text-primary transition-colors"
              onClick={onRightIconClick}
              tabIndex={-1}
              aria-label="Toggle input visibility"
            >
              {rightIcon}
            </button>
          )}
        </div>
        
        {(message || helperText) && (
          <div className="space-y-1">
            {message && (
              <p
                id={errorId}
                className={cn(
                  'text-sm',
                  errorMessage && 'text-atlas-error-main',
                  successMessage && 'text-atlas-success-main',
                  warningMessage && 'text-atlas-warning-main'
                )}
                role={errorMessage ? 'alert' : undefined}
              >
                {message}
              </p>
            )}
            {helperText && (
              <p
                id={helperId}
                className="text-sm text-atlas-text-tertiary"
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
