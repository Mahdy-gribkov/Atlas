import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const switchVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-atlas-primary-main',
        success: 'data-[state=checked]:bg-atlas-success-main',
        error: 'data-[state=checked]:bg-atlas-error-main',
        warning: 'data-[state=checked]:bg-atlas-warning-main',
        info: 'data-[state=checked]:bg-atlas-info-main',
        secondary: 'data-[state=checked]:bg-atlas-secondary-main',
        ai: 'data-[state=checked]:bg-atlas-ai-main',
      },
      size: {
        sm: 'h-4 w-7',
        default: 'h-6 w-11',
        lg: 'h-8 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> &
    VariantProps<typeof switchVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(switchVariants({ variant, size, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

// Enhanced Switch with label and description
export interface SwitchFieldProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'secondary' | 'ai';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const SwitchField = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchFieldProps
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
  const switchId = id || React.useId();
  const errorId = `${switchId}-error`;
  const descriptionId = `${switchId}-description`;
  
  const actualVariant = errorMessage ? 'error' : variant;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-start space-x-3">
        <Switch
          ref={ref}
          id={switchId}
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
              htmlFor={switchId}
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
SwitchField.displayName = 'SwitchField';

// Toggle switch (alternative styling)
const toggleVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-atlas-primary-main',
        success: 'data-[state=checked]:bg-atlas-success-main',
        error: 'data-[state=checked]:bg-atlas-error-main',
        warning: 'data-[state=checked]:bg-atlas-warning-main',
        info: 'data-[state=checked]:bg-atlas-info-main',
        secondary: 'data-[state=checked]:bg-atlas-secondary-main',
        ai: 'data-[state=checked]:bg-atlas-ai-main',
      },
      size: {
        sm: 'h-4 w-7',
        default: 'h-6 w-11',
        lg: 'h-8 w-14',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
  </SwitchPrimitive.Root>
));
Toggle.displayName = SwitchPrimitive.Root.displayName;

// Switch group for multiple related switches
export interface SwitchGroupProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
  required?: boolean;
  className?: string;
}

const SwitchGroup = React.forwardRef<HTMLFieldSetElement, SwitchGroupProps>(
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
SwitchGroup.displayName = 'SwitchGroup';

export {
  Switch,
  SwitchField,
  Toggle,
  SwitchGroup,
  switchVariants,
  toggleVariants,
};
