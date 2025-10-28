import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  CheckCircleIcon, 
  AlertCircleIcon, 
  ClockIcon, 
  LoaderIcon,
  SendIcon,
  RefreshIcon,
  DownloadIcon,
  EyeIcon,
  TrashIcon,
  CopyIcon,
  ShareIcon,
  ExternalLinkIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  ShieldCheckIcon,
  AlertTriangleIcon
} from 'lucide-react';

const formSubmissionVariants = cva(
  'w-full space-y-4',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-6 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-2',
        card: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-sm',
        elevated: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'space-y-2 p-4',
        default: 'space-y-4 p-6',
        lg: 'space-y-6 p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formSubmissionStatusVariants = cva(
  'flex items-center gap-3 p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle border-atlas-border text-atlas-text-primary',
        submitting: 'bg-atlas-info-bg border-atlas-info-main text-atlas-info-main',
        success: 'bg-atlas-success-bg border-atlas-success-main text-atlas-success-main',
        error: 'bg-atlas-error-bg border-atlas-error-main text-atlas-error-main',
        warning: 'bg-atlas-warning-bg border-atlas-warning-main text-atlas-warning-main',
      },
      size: {
        sm: 'p-3 text-sm',
        default: 'p-4 text-sm',
        lg: 'p-5 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formSubmissionButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        outline: 'border border-atlas-border bg-transparent hover:bg-atlas-border-subtle',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        success: 'bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        warning: 'bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        error: 'bg-atlas-error-main text-white hover:bg-atlas-error-dark',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormSubmissionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSubmissionVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  submission: FormSubmissionData;
  onSubmissionChange?: (submission: FormSubmissionData) => void;
  onSubmit?: (data: any) => Promise<void>;
  onRetry?: () => void;
  onView?: (submissionId: string) => void;
  onDownload?: (submissionId: string) => void;
  onDelete?: (submissionId: string) => void;
  onCopy?: (submissionId: string) => void;
  onShare?: (submissionId: string) => void;
  showActions?: boolean;
  showDetails?: boolean;
  showTimestamps?: boolean;
  children?: React.ReactNode;
}

export interface FormSubmissionData {
  id: string;
  formId: string;
  data: Record<string, any>;
  status: 'draft' | 'submitting' | 'submitted' | 'success' | 'error' | 'cancelled';
  submittedAt?: Date;
  completedAt?: Date;
  error?: string;
  message?: string;
  metadata?: {
    userAgent?: string;
    ipAddress?: string;
    referrer?: string;
    duration?: number;
    fieldCount?: number;
    validationErrors?: number;
  };
  validation?: {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code?: string;
}

export interface FormSubmissionStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSubmissionStatusVariants> {
  variant?: 'default' | 'submitting' | 'success' | 'error' | 'warning';
  size?: 'sm' | 'default' | 'lg';
  submission: FormSubmissionData;
  showTimestamp?: boolean;
  showDetails?: boolean;
}

export interface FormSubmissionActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  submission: FormSubmissionData;
  onRetry?: () => void;
  onView?: (submissionId: string) => void;
  onDownload?: (submissionId: string) => void;
  onDelete?: (submissionId: string) => void;
  onCopy?: (submissionId: string) => void;
  onShare?: (submissionId: string) => void;
  size?: 'sm' | 'default' | 'lg';
}

const FormSubmissionStatus = React.forwardRef<
  HTMLDivElement,
  FormSubmissionStatusProps
>(({ 
  className, 
  variant, 
  size, 
  submission, 
  showTimestamp = true, 
  showDetails = false, 
  ...props 
}, ref) => {
  const getStatusVariant = () => {
    switch (submission.status) {
      case 'submitting':
        return 'submitting';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'cancelled':
        return 'warning';
      default:
        return variant || 'default';
    }
  };

  const getStatusIcon = () => {
    switch (submission.status) {
      case 'submitting':
        return <LoaderIcon className="h-5 w-5 animate-spin" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'error':
        return <AlertCircleIcon className="h-5 w-5" />;
      case 'cancelled':
        return <AlertTriangleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getStatusMessage = () => {
    if (submission.message) return submission.message;
    
    switch (submission.status) {
      case 'submitting':
        return 'Submitting form...';
      case 'success':
        return 'Form submitted successfully';
      case 'error':
        return submission.error || 'Submission failed';
      case 'cancelled':
        return 'Submission cancelled';
      default:
        return 'Ready to submit';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formSubmissionStatusVariants({ variant: getStatusVariant(), size, className }))}
      role="status"
      aria-live="polite"
      {...props}
    >
      <span className="flex-shrink-0" aria-hidden="true">
        {getStatusIcon()}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium">{getStatusMessage()}</div>
        
        {showDetails && submission.metadata && (
          <div className="text-xs opacity-75 mt-1 space-y-1">
            {submission.metadata.duration && (
              <div>Duration: {submission.metadata.duration}ms</div>
            )}
            {submission.metadata.fieldCount && (
              <div>Fields: {submission.metadata.fieldCount}</div>
            )}
            {submission.validation?.errors.length > 0 && (
              <div>Errors: {submission.validation.errors.length}</div>
            )}
          </div>
        )}
        
        {showTimestamp && submission.submittedAt && (
          <div className="text-xs opacity-75 mt-1">
            {submission.submittedAt.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
});
FormSubmissionStatus.displayName = 'FormSubmissionStatus';

const FormSubmissionActions = React.forwardRef<
  HTMLDivElement,
  FormSubmissionActionsProps
>(({ 
  className, 
  submission, 
  onRetry, 
  onView, 
  onDownload, 
  onDelete, 
  onCopy, 
  onShare, 
  size = 'default', 
  ...props 
}, ref) => {
  const canRetry = submission.status === 'error';
  const canView = submission.status === 'success' || submission.status === 'submitted';
  const canDownload = submission.status === 'success' || submission.status === 'submitted';

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {canRetry && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className={cn(formSubmissionButtonVariants({ variant: 'outline', size }))}
          aria-label="Retry submission"
        >
          <RefreshIcon className="h-4 w-4 mr-2" />
          Retry
        </button>
      )}
      
      {canView && onView && (
        <button
          type="button"
          onClick={() => onView(submission.id)}
          className={cn(formSubmissionButtonVariants({ variant: 'outline', size }))}
          aria-label="View submission"
        >
          <EyeIcon className="h-4 w-4 mr-2" />
          View
        </button>
      )}
      
      {canDownload && onDownload && (
        <button
          type="button"
          onClick={() => onDownload(submission.id)}
          className={cn(formSubmissionButtonVariants({ variant: 'outline', size }))}
          aria-label="Download submission"
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </button>
      )}
      
      {onCopy && (
        <button
          type="button"
          onClick={() => onCopy(submission.id)}
          className={cn(formSubmissionButtonVariants({ variant: 'ghost', size }))}
          aria-label="Copy submission"
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      )}
      
      {onShare && (
        <button
          type="button"
          onClick={() => onShare(submission.id)}
          className={cn(formSubmissionButtonVariants({ variant: 'ghost', size }))}
          aria-label="Share submission"
        >
          <ShareIcon className="h-4 w-4" />
        </button>
      )}
      
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(submission.id)}
          className={cn(formSubmissionButtonVariants({ variant: 'error', size }))}
          aria-label="Delete submission"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
});
FormSubmissionActions.displayName = 'FormSubmissionActions';

const FormSubmission = React.forwardRef<
  HTMLDivElement,
  FormSubmissionProps
>(({
  className,
  variant,
  size,
  submission,
  onSubmissionChange,
  onSubmit,
  onRetry,
  onView,
  onDownload,
  onDelete,
  onCopy,
  onShare,
  showActions = true,
  showDetails = true,
  showTimestamps = true,
  children,
  ...props
}, ref) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(async () => {
    if (!onSubmit || submission.status === 'submitting') return;
    
    setIsSubmitting(true);
    try {
      const updatedSubmission = {
        ...submission,
        status: 'submitting' as const,
        submittedAt: new Date(),
      };
      onSubmissionChange?.(updatedSubmission);
      
      await onSubmit(submission.data);
      
      const successSubmission = {
        ...updatedSubmission,
        status: 'success' as const,
        completedAt: new Date(),
        message: 'Form submitted successfully',
      };
      onSubmissionChange?.(successSubmission);
    } catch (error) {
      const errorSubmission = {
        ...submission,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Submission failed',
        completedAt: new Date(),
      };
      onSubmissionChange?.(errorSubmission);
    } finally {
      setIsSubmitting(false);
    }
  }, [submission, onSubmit, onSubmissionChange]);

  const handleRetry = React.useCallback(() => {
    if (submission.status === 'error') {
      handleSubmit();
    }
    onRetry?.();
  }, [submission.status, handleSubmit, onRetry]);

  return (
    <div
      ref={ref}
      className={cn(formSubmissionVariants({ variant, size, className }))}
      {...props}
    >
      <FormSubmissionStatus
        variant={variant}
        size={size}
        submission={submission}
        showTimestamp={showTimestamps}
        showDetails={showDetails}
      />
      
      {showActions && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {submission.status === 'draft' && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(formSubmissionButtonVariants({ variant: 'default', size }))}
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </button>
            )}
          </div>
          
          <FormSubmissionActions
            submission={submission}
            onRetry={handleRetry}
            onView={onView}
            onDownload={onDownload}
            onDelete={onDelete}
            onCopy={onCopy}
            onShare={onShare}
            size={size}
          />
        </div>
      )}
      
      {children}
    </div>
  );
});
FormSubmission.displayName = 'FormSubmission';

// Additional utility components
const FormSubmissionContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
    size?: 'sm' | 'default' | 'lg';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  }
>(({ className, variant = 'default', size = 'default', maxWidth = 'full', children, ...props }, ref) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
        variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
FormSubmissionContainer.displayName = 'FormSubmissionContainer';

const FormSubmissionSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full space-y-4', className)}
      {...props}
    >
      <div className="flex items-center gap-3 p-4 border border-atlas-border rounded-lg">
        <div className="h-5 w-5 bg-atlas-border-subtle rounded animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-48 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-3 w-32 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-20 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-10 w-20 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
});
FormSubmissionSkeleton.displayName = 'FormSubmissionSkeleton';

export {
  FormSubmission,
  FormSubmissionStatus,
  FormSubmissionActions,
  FormSubmissionContainer,
  FormSubmissionSkeleton,
  formSubmissionVariants,
  formSubmissionStatusVariants,
  formSubmissionButtonVariants,
};
