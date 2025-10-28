import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  AlertCircleIcon, 
  CheckCircleIcon, 
  InfoIcon, 
  AlertTriangleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  LoaderIcon
} from 'lucide-react';

const formValidationVariants = cva(
  'space-y-2',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-4 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-4 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-1',
        inline: 'flex items-center gap-2',
      },
      size: {
        sm: 'space-y-1 text-xs',
        default: 'space-y-2 text-sm',
        lg: 'space-y-3 text-base',
      },
      state: {
        default: '',
        error: 'text-atlas-error-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
        loading: 'text-atlas-text-tertiary',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const formValidationMessageVariants = cva(
  'flex items-center gap-2 transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-3 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-3 bg-atlas-border-subtle rounded-lg',
        minimal: '',
        inline: 'flex items-center gap-2',
      },
      size: {
        sm: 'text-xs gap-1',
        default: 'text-sm gap-2',
        lg: 'text-base gap-3',
      },
      state: {
        default: 'text-atlas-text-primary',
        error: 'text-atlas-error-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
        loading: 'text-atlas-text-tertiary',
      },
      type: {
        error: 'bg-atlas-error-bg border-atlas-error-main',
        success: 'bg-atlas-success-bg border-atlas-success-main',
        warning: 'bg-atlas-warning-bg border-atlas-warning-main',
        info: 'bg-atlas-info-bg border-atlas-info-main',
        loading: 'bg-atlas-border-subtle border-atlas-border',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
      type: 'error',
    },
  }
);

const formValidationIconVariants = cva(
  'flex-shrink-0',
  {
    variants: {
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
      state: {
        default: 'text-atlas-text-tertiary',
        error: 'text-atlas-error-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
        loading: 'text-atlas-text-tertiary',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

const formValidationSummaryVariants = cva(
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
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormValidationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formValidationVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'inline';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning' | 'info' | 'loading';
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  success?: ValidationSuccess[];
  info?: ValidationInfo[];
  loading?: boolean;
  showSummary?: boolean;
  children?: React.ReactNode;
}

export interface ValidationError {
  field?: string;
  message: string;
  code?: string;
  details?: string;
}

export interface ValidationWarning {
  field?: string;
  message: string;
  code?: string;
  details?: string;
}

export interface ValidationSuccess {
  field?: string;
  message: string;
  code?: string;
  details?: string;
}

export interface ValidationInfo {
  field?: string;
  message: string;
  code?: string;
  details?: string;
}

export interface FormValidationMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formValidationMessageVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'inline';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning' | 'info' | 'loading';
  type?: 'error' | 'success' | 'warning' | 'info' | 'loading';
  message: string;
  details?: string;
  field?: string;
  code?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export interface FormValidationSummaryProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formValidationSummaryVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
  success?: ValidationSuccess[];
  info?: ValidationInfo[];
  showCounts?: boolean;
  maxItems?: number;
}

const FormValidationMessage = React.forwardRef<
  HTMLDivElement,
  FormValidationMessageProps
>(({ 
  className, 
  variant, 
  size, 
  state, 
  type, 
  message, 
  details, 
  field, 
  code, 
  icon, 
  dismissible, 
  onDismiss, 
  ...props 
}, ref) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'error':
        return <AlertCircleIcon className={formValidationIconVariants({ size, state: 'error' })} />;
      case 'success':
        return <CheckCircleIcon className={formValidationIconVariants({ size, state: 'success' })} />;
      case 'warning':
        return <AlertTriangleIcon className={formValidationIconVariants({ size, state: 'warning' })} />;
      case 'info':
        return <InfoIcon className={formValidationIconVariants({ size, state: 'info' })} />;
      case 'loading':
        return <LoaderIcon className={cn(formValidationIconVariants({ size, state: 'loading' }), 'animate-spin')} />;
      default:
        return <InfoIcon className={formValidationIconVariants({ size, state: 'default' })} />;
    }
  };

  const getRole = () => {
    switch (type) {
      case 'error':
        return 'alert';
      case 'success':
        return 'status';
      case 'warning':
        return 'alert';
      case 'info':
        return 'status';
      default:
        return 'status';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formValidationMessageVariants({ variant, size, state, type, className }))}
      role={getRole()}
      aria-live={type === 'error' || type === 'warning' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className="flex items-start gap-2 flex-1 min-w-0">
        <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
          {getIcon()}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">{message}</span>
            {field && (
              <span className="text-xs opacity-75">
                ({field})
              </span>
            )}
            {code && (
              <span className="text-xs opacity-75 font-mono">
                [{code}]
              </span>
            )}
          </div>
          {details && (
            <p className="text-xs opacity-75 mt-1">
              {details}
            </p>
          )}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded-sm transition-colors"
          aria-label="Dismiss message"
        >
          <XCircleIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
FormValidationMessage.displayName = 'FormValidationMessage';

const FormValidationSummary = React.forwardRef<
  HTMLDivElement,
  FormValidationSummaryProps
>(({ 
  className, 
  variant, 
  size, 
  errors = [], 
  warnings = [], 
  success = [], 
  info = [], 
  showCounts = true, 
  maxItems = 10, 
  ...props 
}, ref) => {
  const totalErrors = errors.length;
  const totalWarnings = warnings.length;
  const totalSuccess = success.length;
  const totalInfo = info.length;
  const totalMessages = totalErrors + totalWarnings + totalSuccess + totalInfo;

  if (totalMessages === 0) return null;

  const renderMessages = (messages: any[], type: 'error' | 'warning' | 'success' | 'info') => {
    const limitedMessages = messages.slice(0, maxItems);
    
    return limitedMessages.map((message, index) => (
      <FormValidationMessage
        key={`${type}-${index}`}
        variant="minimal"
        size={size}
        type={type}
        message={message.message}
        details={message.details}
        field={message.field}
        code={message.code}
      />
    ));
  };

  return (
    <div
      ref={ref}
      className={cn(formValidationSummaryVariants({ variant, size, className }))}
      {...props}
    >
      {showCounts && (
        <div className="flex items-center gap-4 text-sm font-medium text-atlas-text-primary mb-2">
          {totalErrors > 0 && (
            <span className="text-atlas-error-main">
              {totalErrors} error{totalErrors !== 1 ? 's' : ''}
            </span>
          )}
          {totalWarnings > 0 && (
            <span className="text-atlas-warning-main">
              {totalWarnings} warning{totalWarnings !== 1 ? 's' : ''}
            </span>
          )}
          {totalSuccess > 0 && (
            <span className="text-atlas-success-main">
              {totalSuccess} success{totalSuccess !== 1 ? 'es' : ''}
            </span>
          )}
          {totalInfo > 0 && (
            <span className="text-atlas-info-main">
              {totalInfo} info{totalInfo !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}
      
      <div className="space-y-1">
        {renderMessages(errors, 'error')}
        {renderMessages(warnings, 'warning')}
        {renderMessages(success, 'success')}
        {renderMessages(info, 'info')}
      </div>
      
      {totalMessages > maxItems && (
        <p className="text-xs text-atlas-text-tertiary mt-2">
          Showing {maxItems} of {totalMessages} messages
        </p>
      )}
    </div>
  );
});
FormValidationSummary.displayName = 'FormValidationSummary';

const FormValidation = React.forwardRef<
  HTMLDivElement,
  FormValidationProps
>(({
  className,
  variant,
  size,
  state,
  errors = [],
  warnings = [],
  success = [],
  info = [],
  loading = false,
  showSummary = true,
  children,
  ...props
}, ref) => {
  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;
  const hasSuccess = success.length > 0;
  const hasInfo = info.length > 0;
  const hasMessages = hasErrors || hasWarnings || hasSuccess || hasInfo;

  const currentState = React.useMemo(() => {
    if (loading) return 'loading';
    if (hasErrors) return 'error';
    if (hasWarnings) return 'warning';
    if (hasSuccess) return 'success';
    if (hasInfo) return 'info';
    return state || 'default';
  }, [loading, hasErrors, hasWarnings, hasSuccess, hasInfo, state]);

  return (
    <div
      ref={ref}
      className={cn(formValidationVariants({ variant, size, state: currentState, className }))}
      {...props}
    >
      {children}
      
      {showSummary && hasMessages && (
        <FormValidationSummary
          variant={variant}
          size={size}
          errors={errors}
          warnings={warnings}
          success={success}
          info={info}
        />
      )}
      
      {loading && (
        <FormValidationMessage
          variant="minimal"
          size={size}
          type="loading"
          message="Validating..."
        />
      )}
    </div>
  );
});
FormValidation.displayName = 'FormValidation';

// Additional utility components for advanced form validation functionality
const FormValidationContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full',
      variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
      variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
FormValidationContainer.displayName = 'FormValidationContainer';

const FormValidationSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    messageCount?: number;
  }
>(({ className, size = 'default', messageCount = 3, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-3',
    default: 'h-4',
    lg: 'h-5',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-2', className)}
      {...props}
    >
      {Array.from({ length: messageCount }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="h-4 w-4 bg-atlas-border-subtle rounded animate-pulse" />
          <div
            className={cn(
              'flex-1 bg-atlas-border-subtle rounded animate-pulse',
              sizeClasses[size]
            )}
          />
        </div>
      ))}
    </div>
  );
});
FormValidationSkeleton.displayName = 'FormValidationSkeleton';

export {
  FormValidation,
  FormValidationMessage,
  FormValidationSummary,
  FormValidationContainer,
  FormValidationSkeleton,
  formValidationVariants,
  formValidationMessageVariants,
  formValidationIconVariants,
  formValidationSummaryVariants,
};
