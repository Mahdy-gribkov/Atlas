import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const radioVariants = cva(
  'aspect-square h-4 w-4 rounded-full border border-atlas-border text-atlas-primary-main ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main text-atlas-error-main focus-visible:ring-atlas-error-main',
        success: 'border-atlas-success-main text-atlas-success-main focus-visible:ring-atlas-success-main',
        warning: 'border-atlas-warning-main text-atlas-warning-main focus-visible:ring-atlas-warning-main',
      },
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn('grid gap-2', className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> &
    VariantProps<typeof radioVariants>
>(({ className, variant, size, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(radioVariants({ variant, size, className }))}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-current text-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Enhanced Radio with label and description
export interface RadioFieldProps {
  id?: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const RadioField = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioFieldProps
>(({
  id,
  value,
  disabled = false,
  required = false,
  label,
  description,
  errorMessage,
  variant = 'default',
  size = 'default',
  className,
}, ref) => {
  const radioId = id || React.useId();
  const errorId = `${radioId}-error`;
  const descriptionId = `${radioId}-description`;
  
  const actualVariant = errorMessage ? 'error' : variant;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <RadioGroupItem
          ref={ref}
          id={radioId}
          value={value}
          disabled={disabled}
          required={required}
          variant={actualVariant}
          size={size}
          aria-describedby={cn(
            description && descriptionId,
            errorMessage && errorId
          )}
          aria-invalid={!!errorMessage}
        />
        <div className="flex-1 space-y-1">
          {label && (
            <label
              htmlFor={radioId}
              className="text-sm font-medium text-atlas-text-primary cursor-pointer"
            >
              {label}
              {required && (
                <span className="ml-1 text-atlas-error-main" aria-label="required">
                  *
                </span>
              )}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className="text-sm text-atlas-text-tertiary"
            >
              {description}
            </p>
          )}
          {errorMessage && (
            <p
              id={errorId}
              className="text-sm text-atlas-error-main"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
RadioField.displayName = 'RadioField';

// Radio group with enhanced features
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface EnhancedRadioGroupProps {
  options: RadioOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const EnhancedRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  EnhancedRadioGroupProps
>(({
  options,
  value,
  onValueChange,
  name,
  label,
  description,
  errorMessage,
  required = false,
  variant = 'default',
  size = 'default',
  orientation = 'vertical',
  className,
}, ref) => {
  const groupId = React.useId();
  const errorId = `${groupId}-error`;
  const descriptionId = `${groupId}-description`;
  
  const actualVariant = errorMessage ? 'error' : variant;

  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <label className="text-sm font-medium text-atlas-text-primary">
          {label}
          {required && (
            <span className="ml-1 text-atlas-error-main" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      {description && (
        <p
          id={descriptionId}
          className="text-sm text-atlas-text-tertiary"
        >
          {description}
        </p>
      )}
      
      <RadioGroup
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        name={name}
        aria-describedby={cn(
          description && descriptionId,
          errorMessage && errorId
        )}
        aria-invalid={!!errorMessage}
        aria-required={required}
        className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2'
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem
              value={option.value}
              disabled={option.disabled}
              variant={actualVariant}
              size={size}
              id={`${groupId}-${option.value}`}
            />
            <div className="flex-1 space-y-1">
              <label
                htmlFor={`${groupId}-${option.value}`}
                className={cn(
                  'text-sm font-medium cursor-pointer',
                  option.disabled ? 'text-atlas-text-tertiary cursor-not-allowed' : 'text-atlas-text-primary'
                )}
              >
                <div className="flex items-center space-x-2">
                  {option.icon && (
                    <span className="flex-shrink-0" aria-hidden="true">
                      {option.icon}
                    </span>
                  )}
                  <span>{option.label}</span>
                </div>
              </label>
              {option.description && (
                <p className="text-sm text-atlas-text-tertiary">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      
      {errorMessage && (
        <p
          id={errorId}
          className="text-sm text-atlas-error-main"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
});
EnhancedRadioGroup.displayName = 'EnhancedRadioGroup';

export {
  RadioGroup,
  RadioGroupItem,
  RadioField,
  EnhancedRadioGroup,
  radioVariants,
};
