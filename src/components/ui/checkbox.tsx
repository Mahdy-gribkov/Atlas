import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const checkboxVariants = cva(
  'peer h-4 w-4 shrink-0 rounded-sm border border-atlas-border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main focus-visible:ring-atlas-error-main data-[state=checked]:bg-atlas-error-main data-[state=checked]:border-atlas-error-main',
        success: 'border-atlas-success-main focus-visible:ring-atlas-success-main data-[state=checked]:bg-atlas-success-main data-[state=checked]:border-atlas-success-main',
        warning: 'border-atlas-warning-main focus-visible:ring-atlas-warning-main data-[state=checked]:bg-atlas-warning-main data-[state=checked]:border-atlas-warning-main',
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

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, variant, size, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant, size, className }))}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Enhanced Checkbox with label and description
export interface CheckboxFieldProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const CheckboxField = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
>(({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  label,
  description,
  errorMessage,
  variant = 'default',
  size = 'default',
  className,
}, ref) => {
  const checkboxId = id || React.useId();
  const errorId = `${checkboxId}-error`;
  const descriptionId = `${checkboxId}-description`;
  
  const actualVariant = errorMessage ? 'error' : variant;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          ref={ref}
          id={checkboxId}
          checked={checked}
          onCheckedChange={onCheckedChange}
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
              htmlFor={checkboxId}
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
CheckboxField.displayName = 'CheckboxField';

// Checkbox group
export interface CheckboxGroupProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  className?: string;
}

const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
  ({ children, label, description, errorMessage, required = false, className }, ref) => {
    const groupId = React.useId();
    const errorId = `${groupId}-error`;
    const descriptionId = `${groupId}-description`;

    return (
      <fieldset ref={ref} className={cn('space-y-3', className)}>
        {label && (
          <legend className="text-sm font-medium text-atlas-text-primary">
            {label}
            {required && (
              <span className="ml-1 text-atlas-error-main" aria-label="required">
                *
              </span>
            )}
          </legend>
        )}
        {description && (
          <p
            id={descriptionId}
            className="text-sm text-atlas-text-tertiary"
          >
            {description}
          </p>
        )}
        <div className="space-y-2">
          {children}
        </div>
        {errorMessage && (
          <p
            id={errorId}
            className="text-sm text-atlas-error-main"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </fieldset>
    );
  }
);
CheckboxGroup.displayName = 'CheckboxGroup';

export { Checkbox, CheckboxField, CheckboxGroup, checkboxVariants };
