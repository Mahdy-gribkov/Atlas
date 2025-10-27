import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { 
  AlertCircleIcon, 
  CheckCircleIcon, 
  InfoIcon, 
  AlertTriangleIcon,
  XIcon,
  BellIcon,
  ShieldCheckIcon,
  ClockIcon
} from 'lucide-react';
import { cn } from '@/lib/utils/atlas-utils';

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg border-atlas-border text-atlas-text-primary',
        success: 'bg-atlas-success-bg border-atlas-success-main text-atlas-success-dark',
        error: 'bg-atlas-error-bg border-atlas-error-main text-atlas-error-dark',
        warning: 'bg-atlas-warning-bg border-atlas-warning-main text-atlas-warning-dark',
        info: 'bg-atlas-info-bg border-atlas-info-main text-atlas-info-dark',
        ai: 'bg-atlas-ai-lighter border-atlas-ai-main text-atlas-ai-dark',
        neutral: 'bg-atlas-border-subtle border-atlas-border text-atlas-text-secondary',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        default: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base',
      },
      elevation: {
        flat: 'shadow-none',
        low: 'shadow-sm',
        medium: 'shadow-md',
        high: 'shadow-lg',
      },
      dismissible: {
        true: 'pr-10',
        false: '',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md transition-shadow',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      elevation: 'flat',
      dismissible: false,
      interactive: false,
    },
  }
);

const alertIconVariants = cva(
  'flex-shrink-0',
  {
    variants: {
      variant: {
        default: 'text-atlas-text-tertiary',
        success: 'text-atlas-success-main',
        error: 'text-atlas-error-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
        ai: 'text-atlas-ai-main',
        neutral: 'text-atlas-text-tertiary',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const alertTitleVariants = cva(
  'font-semibold leading-none tracking-tight',
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

const alertDescriptionVariants = cva(
  'mt-1 leading-relaxed',
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

const alertActionVariants = cva(
  'mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
  {
    variants: {
      size: {
        sm: 'gap-1',
        default: 'gap-2',
        lg: 'gap-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info' | 'ai' | 'neutral';
  size?: 'sm' | 'default' | 'lg';
  elevation?: 'flat' | 'low' | 'medium' | 'high';
  dismissible?: boolean;
  interactive?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  role?: 'alert' | 'alertdialog' | 'status' | 'banner';
}

export interface AlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof alertTitleVariants> {}

export interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof alertDescriptionVariants> {}

export interface AlertActionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertActionVariants> {}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant,
      size,
      elevation,
      dismissible,
      interactive,
      onDismiss,
      icon,
      title,
      description,
      actions,
      role = 'alert',
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = React.useCallback(() => {
      setIsVisible(false);
      onDismiss?.();
    }, [onDismiss]);

    const getDefaultIcon = () => {
      switch (variant) {
        case 'success':
          return <CheckCircleIcon className={alertIconVariants({ variant, size })} />;
        case 'error':
          return <AlertCircleIcon className={alertIconVariants({ variant, size })} />;
        case 'warning':
          return <AlertTriangleIcon className={alertIconVariants({ variant, size })} />;
        case 'info':
          return <InfoIcon className={alertIconVariants({ variant, size })} />;
        case 'ai':
          return <BellIcon className={alertIconVariants({ variant, size })} />;
        case 'neutral':
          return <ShieldCheckIcon className={alertIconVariants({ variant, size })} />;
        default:
          return <InfoIcon className={alertIconVariants({ variant, size })} />;
      }
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        role={role}
        className={cn(alertVariants({ variant, size, elevation, dismissible, interactive, className }))}
        {...props}
      >
        <div className="flex items-start gap-3">
          {(icon || variant !== 'default') && (
            <div className="flex-shrink-0 mt-0.5" aria-hidden="true">
              {icon || getDefaultIcon()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && (
              <AlertTitle size={size} className="mb-1">
                {title}
              </AlertTitle>
            )}
            {description && (
              <AlertDescription size={size}>
                {description}
              </AlertDescription>
            )}
            {children && (
              <div className={title || description ? 'mt-2' : ''}>
                {children}
              </div>
            )}
            {actions && (
              <AlertAction size={size}>
                {actions}
              </AlertAction>
            )}
          </div>
          {dismissible && (
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3 right-3 flex-shrink-0 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2 transition-colors"
              aria-label="Dismiss alert"
            >
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, size, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn(alertTitleVariants({ size, className }))}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, size, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(alertDescriptionVariants({ size, className }))}
      {...props}
    />
  )
);
AlertDescription.displayName = 'AlertDescription';

const AlertAction = React.forwardRef<HTMLDivElement, AlertActionProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(alertActionVariants({ size, className }))}
      {...props}
    />
  )
);
AlertAction.displayName = 'AlertAction';

// Additional utility components for advanced alert functionality
const AlertGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    spacing?: 'sm' | 'default' | 'lg';
    maxHeight?: string;
    scrollable?: boolean;
  }
>(({ className, spacing = 'default', maxHeight, scrollable = false, children, ...props }, ref) => {
  const spacingClass = {
    sm: 'space-y-2',
    default: 'space-y-3',
    lg: 'space-y-4',
  }[spacing];

  return (
    <div
      ref={ref}
      className={cn(
        'w-full',
        spacingClass,
        scrollable && 'overflow-y-auto',
        className
      )}
      style={maxHeight ? { maxHeight } : undefined}
      {...props}
    >
      {children}
    </div>
  );
});
AlertGroup.displayName = 'AlertGroup';

const AlertToast = React.forwardRef<
  HTMLDivElement,
  AlertProps & {
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  }
>(({ className, duration = 5000, position = 'top-right', ...props }, ref) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div
      className={cn(
        'fixed z-toast max-w-sm w-full',
        positionClasses[position],
        'animate-slide-in-from-right'
      )}
    >
      <Alert
        ref={ref}
        className={cn('shadow-lg', className)}
        {...props}
      />
    </div>
  );
});
AlertToast.displayName = 'AlertToast';

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
  AlertGroup,
  AlertToast,
  alertVariants,
  alertIconVariants,
  alertTitleVariants,
  alertDescriptionVariants,
  alertActionVariants,
};
