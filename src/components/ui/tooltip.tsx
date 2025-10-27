import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentVariants = cva(
  'z-tooltip overflow-hidden rounded-md border bg-atlas-card-bg px-3 py-1.5 text-xs text-atlas-text-primary shadow-md animate-fade-in data-[state=closed]:animate-fade-out',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        dark: 'border-atlas-text-primary bg-atlas-text-primary text-white',
        light: 'border-atlas-border-subtle bg-white text-atlas-text-primary',
        success: 'border-atlas-success-main bg-atlas-success-bg text-atlas-success-dark',
        error: 'border-atlas-error-main bg-atlas-error-bg text-atlas-error-dark',
        warning: 'border-atlas-warning-main bg-atlas-warning-bg text-atlas-warning-dark',
        info: 'border-atlas-info-main bg-atlas-info-bg text-atlas-info-dark',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-1.5 text-xs',
        lg: 'px-4 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipContentVariants>
>(({ className, variant, size, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant, size, className }))}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Enhanced Tooltip component with additional features
export interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  variant?: 'default' | 'dark' | 'light' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'default' | 'lg';
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  skipDelayDuration?: number;
  disabled?: boolean;
  className?: string;
}

const EnhancedTooltip = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  EnhancedTooltipProps
>(({
  children,
  content,
  variant = 'default',
  size = 'default',
  side = 'top',
  align = 'center',
  delayDuration = 700,
  skipDelayDuration = 300,
  disabled = false,
  className,
}, ref) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip delayDuration={delayDuration} skipDelayDuration={skipDelayDuration}>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent
        ref={ref}
        variant={variant}
        size={size}
        side={side}
        align={align}
        className={className}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
});
EnhancedTooltip.displayName = 'EnhancedTooltip';

// Tooltip with arrow
const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn('fill-atlas-card-bg', className)}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

// Info tooltip (commonly used for help text)
export interface InfoTooltipProps {
  children: React.ReactNode;
  info: string;
  className?: string;
}

const InfoTooltip = React.forwardRef<HTMLDivElement, InfoTooltipProps>(
  ({ children, info, className }, ref) => (
    <div ref={ref} className={cn('inline-flex items-center', className)}>
      {children}
      <EnhancedTooltip content={info} variant="info" size="sm">
        <button
          type="button"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-atlas-info-main text-white hover:bg-atlas-info-dark focus:outline-none focus:ring-2 focus:ring-atlas-info-main focus:ring-offset-2"
          aria-label="More information"
        >
          <svg
            className="h-2.5 w-2.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </EnhancedTooltip>
    </div>
  )
);
InfoTooltip.displayName = 'InfoTooltip';

// Error tooltip (for form validation)
export interface ErrorTooltipProps {
  children: React.ReactNode;
  error: string;
  className?: string;
}

const ErrorTooltip = React.forwardRef<HTMLDivElement, ErrorTooltipProps>(
  ({ children, error, className }, ref) => (
    <div ref={ref} className={cn('inline-flex items-center', className)}>
      {children}
      <EnhancedTooltip content={error} variant="error" size="sm">
        <button
          type="button"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-atlas-error-main text-white hover:bg-atlas-error-dark focus:outline-none focus:ring-2 focus:ring-atlas-error-main focus:ring-offset-2"
          aria-label="Error information"
        >
          <svg
            className="h-2.5 w-2.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </EnhancedTooltip>
    </div>
  )
);
ErrorTooltip.displayName = 'ErrorTooltip';

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipArrow,
  EnhancedTooltip,
  InfoTooltip,
  ErrorTooltip,
  tooltipContentVariants,
};
