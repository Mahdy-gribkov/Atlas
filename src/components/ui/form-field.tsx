import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { AlertCircleIcon, CheckIcon, InfoIcon } from 'lucide-react';

const formFieldVariants = cva(
  'space-y-2',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-4 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-4 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-1',
      },
      size: {
        sm: 'space-y-1',
        default: 'space-y-2',
        lg: 'space-y-3',
      },
      required: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      required: false,
      disabled: false,
    },
  }
);

const formLabelVariants = cva(
  'text-sm font-medium text-atlas-text-primary',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      required: {
        true: '',
        false: '',
      },
      disabled: {
        true: 'text-atlas-text-tertiary',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      required: false,
      disabled: false,
    },
  }
);

const formDescriptionVariants = cva(
  'text-sm text-atlas-text-secondary',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      disabled: {
        true: 'text-atlas-text-tertiary',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      disabled: false,
    },
  }
);

const formErrorVariants = cva(
  'text-sm text-atlas-error-main',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formSuccessVariants = cva(
  'text-sm text-atlas-success-main',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formHintVariants = cva(
  'text-sm text-atlas-text-tertiary',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface FormFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formFieldVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  required?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  hint?: string;
  helpText?: string;
  children: React.ReactNode;
}

export interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof formLabelVariants> {
  size?: 'sm' | 'default' | 'lg';
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
}

export interface FormDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formDescriptionVariants> {
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
}

export interface FormErrorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formErrorVariants> {
  size?: 'sm' | 'default' | 'lg';
}

export interface FormSuccessProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSuccessVariants> {
  size?: 'sm' | 'default' | 'lg';
}

export interface FormHintProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formHintVariants> {
  size?: 'sm' | 'default' | 'lg';
}

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  FormLabelProps
>(({ className, size, required, disabled, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(formLabelVariants({ size, required, disabled, className }))}
    {...props}
  >
    {children}
    {required && (
      <span className="text-atlas-error-main ml-1" aria-label="required">
        *
      </span>
    )}
  </label>
));
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  FormDescriptionProps
>(({ className, size, disabled, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(formDescriptionVariants({ size, disabled, className }))}
    {...props}
  >
    {children}
  </p>
));
FormDescription.displayName = 'FormDescription';

const FormError = React.forwardRef<
  HTMLDivElement,
  FormErrorProps
>(({ className, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formErrorVariants({ size, className }))}
    role="alert"
    aria-live="polite"
    {...props}
  >
    <div className="flex items-center gap-2">
      <AlertCircleIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  </div>
));
FormError.displayName = 'FormError';

const FormSuccess = React.forwardRef<
  HTMLDivElement,
  FormSuccessProps
>(({ className, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formSuccessVariants({ size, className }))}
    role="status"
    aria-live="polite"
    {...props}
  >
    <div className="flex items-center gap-2">
      <CheckIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  </div>
));
FormSuccess.displayName = 'FormSuccess';

const FormHint = React.forwardRef<
  HTMLDivElement,
  FormHintProps
>(({ className, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formHintVariants({ size, className }))}
    {...props}
  >
    <div className="flex items-center gap-2">
      <InfoIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  </div>
));
FormHint.displayName = 'FormHint';

const FormField = React.forwardRef<
  HTMLDivElement,
  FormFieldProps
>(({
  className,
  variant,
  size,
  required,
  disabled,
  label,
  description,
  error,
  success,
  hint,
  helpText,
  children,
  ...props
}, ref) => {
  const fieldId = React.useId();
  const errorId = React.useId();
  const descriptionId = React.useId();
  const hintId = React.useId();

  const hasError = Boolean(error);
  const hasSuccess = Boolean(success);
  const hasHint = Boolean(hint || helpText);

  return (
    <div
      ref={ref}
      className={cn(formFieldVariants({ variant, size, required, disabled, className }))}
      {...props}
    >
      {label && (
        <FormLabel
          size={size}
          required={required}
          disabled={disabled}
          htmlFor={fieldId}
        >
          {label}
        </FormLabel>
      )}
      
      {description && (
        <FormDescription
          size={size}
          disabled={disabled}
          id={descriptionId}
        >
          {description}
        </FormDescription>
      )}
      
      <div className="relative">
        {React.isValidElement(children) && React.cloneElement(children, {
          id: fieldId,
          'aria-describedby': [
            descriptionId,
            hasError ? errorId : null,
            hasHint ? hintId : null,
          ].filter(Boolean).join(' ') || undefined,
          'aria-invalid': hasError,
          'aria-required': required,
          disabled,
          ...children.props,
        })}
      </div>
      
      {hasError && (
        <FormError
          size={size}
          id={errorId}
        >
          {error}
        </FormError>
      )}
      
      {hasSuccess && (
        <FormSuccess
          size={size}
        >
          {success}
        </FormSuccess>
      )}
      
      {hasHint && (
        <FormHint
          size={size}
          id={hintId}
        >
          {hint || helpText}
        </FormHint>
      )}
    </div>
  );
});
FormField.displayName = 'FormField';

// Additional utility components for advanced form field functionality
const FormFieldGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
    columns?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'default' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', columns = 1, gap = 'default', children, ...props }, ref) => {
  const gapClasses = {
    sm: 'gap-2',
    default: 'gap-4',
    lg: 'gap-6',
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        gridClasses[columns],
        gapClasses[gap],
        variant === 'outlined' && 'p-4 border border-atlas-border rounded-lg bg-atlas-card-bg',
        variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
FormFieldGroup.displayName = 'FormFieldGroup';

const FormFieldContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full space-y-4',
      variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
      variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
FormFieldContainer.displayName = 'FormFieldContainer';

const FormFieldSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    showLabel?: boolean;
    showDescription?: boolean;
  }
>(({ className, size = 'default', showLabel = true, showDescription = false, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-6',
    default: 'h-8',
    lg: 'h-10',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-2', className)}
      {...props}
    >
      {showLabel && (
        <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
      )}
      {showDescription && (
        <div className="h-3 w-32 bg-atlas-border-subtle rounded animate-pulse" />
      )}
      <div
        className={cn(
          'w-full bg-atlas-border-subtle rounded animate-pulse',
          sizeClasses[size]
        )}
      />
    </div>
  );
});
FormFieldSkeleton.displayName = 'FormFieldSkeleton';

export {
  FormField,
  FormLabel,
  FormDescription,
  FormError,
  FormSuccess,
  FormHint,
  FormFieldGroup,
  FormFieldContainer,
  FormFieldSkeleton,
  formFieldVariants,
  formLabelVariants,
  formDescriptionVariants,
  formErrorVariants,
  formSuccessVariants,
  formHintVariants,
};
