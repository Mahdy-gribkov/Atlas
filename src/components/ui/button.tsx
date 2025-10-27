import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        ai: 'bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        destructive: 'bg-atlas-error-main text-white hover:bg-atlas-error-dark',
        outline: 'border border-atlas-border bg-transparent hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        link: 'text-atlas-primary-main underline-offset-4 hover:underline',
        success: 'bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        warning: 'bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        info: 'bg-atlas-info-main text-white hover:bg-atlas-info-dark',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      loading: {
        true: 'relative cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      loading: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      loadingText,
      asChild = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={loading ? 'opacity-0' : ''}>
          {loading ? loadingText || 'Loading...' : children}
        </span>
        {!loading && rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        {loading && (
          <span className="sr-only">
            {loadingText || 'Loading, please wait...'}
          </span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
