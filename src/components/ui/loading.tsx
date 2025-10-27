import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main',
        ai: 'text-atlas-ai-main',
        success: 'text-atlas-success-main',
        error: 'text-atlas-error-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
        muted: 'text-atlas-text-tertiary',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(spinnerVariants({ size, variant, className }))}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
);
Spinner.displayName = 'Spinner';

// Pulse spinner variant
const pulseSpinnerVariants = cva(
  'animate-pulse rounded-full bg-current',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',
        default: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      variant: {
        default: 'text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main',
        ai: 'text-atlas-ai-main',
        success: 'text-atlas-success-main',
        error: 'text-atlas-error-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
        muted: 'text-atlas-text-tertiary',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface PulseSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pulseSpinnerVariants> {
  label?: string;
}

const PulseSpinner = React.forwardRef<HTMLDivElement, PulseSpinnerProps>(
  ({ className, size, variant, label = 'Loading...', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(pulseSpinnerVariants({ size, variant, className }))}
      role="status"
      aria-label={label}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
);
PulseSpinner.displayName = 'PulseSpinner';

// Dots spinner
const dotsSpinnerVariants = cva(
  'inline-flex space-x-1',
  {
    variants: {
      size: {
        sm: 'space-x-1',
        default: 'space-x-1.5',
        lg: 'space-x-2',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface DotsSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dotsSpinnerVariants> {
  variant?: 'default' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'muted';
  label?: string;
}

const DotsSpinner = React.forwardRef<HTMLDivElement, DotsSpinnerProps>(
  ({ className, size, variant = 'default', label = 'Loading...', ...props }, ref) => {
    const dotColor = {
      default: 'bg-atlas-primary-main',
      secondary: 'bg-atlas-secondary-main',
      ai: 'bg-atlas-ai-main',
      success: 'bg-atlas-success-main',
      error: 'bg-atlas-error-main',
      warning: 'bg-atlas-warning-main',
      info: 'bg-atlas-info-main',
      muted: 'bg-atlas-text-tertiary',
    }[variant];

    const dotSize = {
      sm: 'h-2 w-2',
      default: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
    }[size || 'default'];

    return (
      <div
        ref={ref}
        className={cn(dotsSpinnerVariants({ size, className }))}
        role="status"
        aria-label={label}
        {...props}
      >
        <div className={cn('rounded-full animate-bounce', dotColor, dotSize)} style={{ animationDelay: '0ms' }} />
        <div className={cn('rounded-full animate-bounce', dotColor, dotSize)} style={{ animationDelay: '150ms' }} />
        <div className={cn('rounded-full animate-bounce', dotColor, dotSize)} style={{ animationDelay: '300ms' }} />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);
DotsSpinner.displayName = 'DotsSpinner';

// Skeleton component
const skeletonVariants = cva(
  'animate-pulse rounded-md bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        card: 'bg-atlas-border-subtle',
        text: 'bg-atlas-border-subtle',
        avatar: 'rounded-full bg-atlas-border-subtle',
        button: 'rounded-md bg-atlas-border-subtle',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant, className }))}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
);
Skeleton.displayName = 'Skeleton';

// Loading states
export interface LoadingStateProps {
  loading?: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  spinner?: React.ReactNode;
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ loading = false, children, fallback, spinner, ...props }, ref) => {
    if (loading) {
      return (
        <div ref={ref} {...props}>
          {fallback || spinner || <Spinner />}
        </div>
      );
    }
    
    return <>{children}</>;
  }
);
LoadingState.displayName = 'LoadingState';

// Loading overlay
export interface LoadingOverlayProps {
  loading?: boolean;
  children: React.ReactNode;
  spinner?: React.ReactNode;
  message?: string;
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ loading = false, children, spinner, message, ...props }, ref) => (
    <div ref={ref} className="relative" {...props}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-atlas-card-bg/80 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            {spinner || <Spinner size="lg" />}
            {message && (
              <p className="text-sm text-atlas-text-secondary">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
);
LoadingOverlay.displayName = 'LoadingOverlay';

export {
  Spinner,
  PulseSpinner,
  DotsSpinner,
  Skeleton,
  LoadingState,
  LoadingOverlay,
  spinnerVariants,
  pulseSpinnerVariants,
  dotsSpinnerVariants,
  skeletonVariants,
};
