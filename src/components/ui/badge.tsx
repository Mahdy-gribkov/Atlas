import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'border-transparent bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        ai: 'border-transparent bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        success: 'border-transparent bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        error: 'border-transparent bg-atlas-error-main text-white hover:bg-atlas-error-dark',
        warning: 'border-transparent bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        info: 'border-transparent bg-atlas-info-main text-white hover:bg-atlas-info-dark',
        outline: 'text-atlas-text-primary border-atlas-border',
        ghost: 'border-transparent text-atlas-text-primary hover:bg-atlas-border-subtle',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  removable?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, removable, onRemove, removeLabel = 'Remove', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    >
      {children}
      {removable && (
        <button
          type="button"
          className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/50"
          onClick={onRemove}
          aria-label={removeLabel}
        >
          <svg
            className="h-2 w-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
);
Badge.displayName = 'Badge';

// Chip component (similar to badge but more interactive)
const chipVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'border-transparent bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        ai: 'border-transparent bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        success: 'border-transparent bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        error: 'border-transparent bg-atlas-error-main text-white hover:bg-atlas-error-dark',
        warning: 'border-transparent bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        info: 'border-transparent bg-atlas-info-main text-white hover:bg-atlas-info-dark',
        outline: 'text-atlas-text-primary border-atlas-border hover:bg-atlas-border-subtle',
        ghost: 'border-transparent text-atlas-text-primary hover:bg-atlas-border-subtle',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
      selected: {
        true: 'ring-2 ring-atlas-primary-main ring-offset-2',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      selected: false,
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  removable?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      selected,
      removable,
      onRemove,
      removeLabel = 'Remove',
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(chipVariants({ variant, size, selected, className }))}
      {...props}
    >
      {leftIcon && (
        <span className="mr-1" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {children}
      {rightIcon && (
        <span className="ml-1" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {removable && (
        <button
          type="button"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/50"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={removeLabel}
        >
          <svg
            className="h-3 w-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </button>
  )
);
Chip.displayName = 'Chip';

// Status indicator component
const statusVariants = cva(
  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        online: 'bg-atlas-success-bg text-atlas-success-dark',
        offline: 'bg-atlas-error-bg text-atlas-error-dark',
        away: 'bg-atlas-warning-bg text-atlas-warning-dark',
        busy: 'bg-atlas-error-bg text-atlas-error-dark',
        pending: 'bg-atlas-info-bg text-atlas-info-dark',
        active: 'bg-atlas-success-bg text-atlas-success-dark',
        inactive: 'bg-atlas-text-tertiary text-white',
      },
    },
    defaultVariants: {
      variant: 'online',
    },
  }
);

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  showDot?: boolean;
}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  ({ className, variant, showDot = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(statusVariants({ variant, className }))}
      {...props}
    >
      {showDot && (
        <div
          className={cn(
            'mr-1 h-2 w-2 rounded-full',
            variant === 'online' && 'bg-atlas-success-main',
            variant === 'offline' && 'bg-atlas-error-main',
            variant === 'away' && 'bg-atlas-warning-main',
            variant === 'busy' && 'bg-atlas-error-main',
            variant === 'pending' && 'bg-atlas-info-main',
            variant === 'active' && 'bg-atlas-success-main',
            variant === 'inactive' && 'bg-atlas-text-tertiary'
          )}
        />
      )}
      {children}
    </div>
  )
);
Status.displayName = 'Status';

export {
  Badge,
  Chip,
  Status,
  badgeVariants,
  chipVariants,
  statusVariants,
};
