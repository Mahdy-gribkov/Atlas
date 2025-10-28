"use client";

import React, { Component, ErrorInfo, ReactNode, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  AlertTriangleIcon,
  XCircleIcon,
  RefreshCwIcon,
  HomeIcon,
  BugIcon,
  ShieldAlertIcon,
  AlertCircleIcon,
  InfoIcon,
  ExternalLinkIcon,
  CopyIcon,
  DownloadIcon,
  ShareIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

// ErrorBoundary Root Component
const errorBoundaryVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-background",
        card: "bg-card border border-border rounded-lg",
        elevated: "bg-card shadow-lg rounded-lg",
        glass: "bg-background/80 backdrop-blur-sm border border-border/50",
        minimal: "bg-transparent"
      },
      size: {
        sm: "text-sm p-4",
        md: "text-base p-6",
        lg: "text-lg p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ErrorBoundaryProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorBoundaryVariants> {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
  showDetails?: boolean;
  showStack?: boolean;
  showActions?: boolean;
  title?: string;
  description?: string;
  actions?: ErrorBoundaryAction[];
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

export interface ErrorBoundaryAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    this.props.onError?.(error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys?.[index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const {
      children,
      fallback,
      showDetails = true,
      showStack = false,
      showActions = true,
      title,
      description,
      actions = [],
      variant,
      size,
      className,
      ...props
    } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const defaultActions: ErrorBoundaryAction[] = [
        {
          key: 'retry',
          label: 'Try Again',
          icon: <RefreshCwIcon className="h-4 w-4" />,
          onClick: this.resetErrorBoundary,
        },
        {
          key: 'home',
          label: 'Go Home',
          icon: <HomeIcon className="h-4 w-4" />,
          onClick: () => window.location.href = '/',
        },
        {
          key: 'report',
          label: 'Report Issue',
          icon: <BugIcon className="h-4 w-4" />,
          onClick: () => {
            const errorReport = {
              message: error?.message,
              stack: error?.stack,
              componentStack: errorInfo?.componentStack,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              url: window.location.href,
            };
            
            // Copy to clipboard
            navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
            
            // You could also send to an error reporting service
            console.error('Error Report:', errorReport);
          },
        },
      ];

      const allActions = [...defaultActions, ...actions];

      return (
        <div
          className={cn(
            errorBoundaryVariants({ variant, size }),
            "flex items-center justify-center min-h-[200px]",
            className
          )}
          {...props}
        >
          <div className="text-center max-w-md mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20">
                <XCircleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {title || "Something went wrong"}
            </h2>

            {/* Description */}
            <p className="text-muted-foreground mb-6">
              {description || "An unexpected error occurred. Please try again or contact support if the problem persists."}
            </p>

            {/* Error Details */}
            {showDetails && error && (
              <div className="mb-6 p-4 bg-muted rounded-lg text-left">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-foreground">Error Details</h3>
                  <Badge variant="destructive" className="text-xs">
                    {error.name}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {error.message}
                </p>
                
                {showStack && error.stack && (
                  <details className="mt-2">
                    <summary className="text-sm font-medium text-foreground cursor-pointer">
                      Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-32 bg-background p-2 rounded border">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex flex-wrap gap-2 justify-center">
                {allActions.map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    className="h-9"
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

// Forward ref wrapper for ErrorBoundary
const ErrorBoundary = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  (props, ref) => {
    return <ErrorBoundaryClass {...props} />;
  }
);

ErrorBoundary.displayName = "ErrorBoundary";

// ErrorBoundary Sub-components
const ErrorBoundaryFallback = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-center max-w-md mx-auto", className)} {...props} />
  )
);
ErrorBoundaryFallback.displayName = "ErrorBoundaryFallback";

const ErrorBoundaryIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex justify-center mb-4", className)} {...props} />
  )
);
ErrorBoundaryIcon.displayName = "ErrorBoundaryIcon";

const ErrorBoundaryTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-xl font-semibold text-foreground mb-2", className)} {...props} />
  )
);
ErrorBoundaryTitle.displayName = "ErrorBoundaryTitle";

const ErrorBoundaryDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-muted-foreground mb-6", className)} {...props} />
  )
);
ErrorBoundaryDescription.displayName = "ErrorBoundaryDescription";

const ErrorBoundaryDetails = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-6 p-4 bg-muted rounded-lg text-left", className)} {...props} />
  )
);
ErrorBoundaryDetails.displayName = "ErrorBoundaryDetails";

const ErrorBoundaryActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap gap-2 justify-center", className)} {...props} />
  )
);
ErrorBoundaryActions.displayName = "ErrorBoundaryActions";

// ErrorBoundary Variants
const ErrorBoundaryCard = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  ({ variant = "card", ...props }, ref) => (
    <ErrorBoundary ref={ref} variant={variant} {...props} />
  )
);
ErrorBoundaryCard.displayName = "ErrorBoundaryCard";

const ErrorBoundaryElevated = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <ErrorBoundary ref={ref} variant={variant} {...props} />
  )
);
ErrorBoundaryElevated.displayName = "ErrorBoundaryElevated";

const ErrorBoundaryGlass = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  ({ variant = "glass", ...props }, ref) => (
    <ErrorBoundary ref={ref} variant={variant} {...props} />
  )
);
ErrorBoundaryGlass.displayName = "ErrorBoundaryGlass";

const ErrorBoundaryMinimal = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <ErrorBoundary ref={ref} variant={variant} {...props} />
  )
);
ErrorBoundaryMinimal.displayName = "ErrorBoundaryMinimal";

// Size Variants
const ErrorBoundarySmall = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  ({ size = "sm", ...props }, ref) => (
    <ErrorBoundary ref={ref} size={size} {...props} />
  )
);
ErrorBoundarySmall.displayName = "ErrorBoundarySmall";

const ErrorBoundaryLarge = forwardRef<HTMLDivElement, ErrorBoundaryProps>(
  ({ size = "lg", ...props }, ref) => (
    <ErrorBoundary ref={ref} size={size} {...props} />
  )
);
ErrorBoundaryLarge.displayName = "ErrorBoundaryLarge";

// Responsive ErrorBoundary
const ErrorBoundaryResponsive = forwardRef<HTMLDivElement, ErrorBoundaryProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
  ({ breakpoint = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full",
        breakpoint === 'sm' && "sm:w-auto",
        breakpoint === 'md' && "md:w-auto",
        breakpoint === 'lg' && "lg:w-auto",
        breakpoint === 'xl' && "xl:w-auto",
        className
      )}
    >
      <ErrorBoundary {...props} />
    </div>
  )
);
ErrorBoundaryResponsive.displayName = "ErrorBoundaryResponsive";

// Size Utilities
const ErrorBoundarySizes = {
  sm: "text-sm p-4",
  md: "text-base p-6",
  lg: "text-lg p-8"
};

// Variant Colors
const ErrorBoundaryVariantColors = {
  default: "bg-background",
  card: "bg-card border border-border rounded-lg",
  elevated: "bg-card shadow-lg rounded-lg",
  glass: "bg-background/80 backdrop-blur-sm border border-border/50",
  minimal: "bg-transparent"
};

// Error Types
const ErrorBoundaryErrorTypes = {
  TypeError: "Type Error",
  ReferenceError: "Reference Error",
  SyntaxError: "Syntax Error",
  RangeError: "Range Error",
  EvalError: "Eval Error",
  URIError: "URI Error",
  NetworkError: "Network Error",
  ValidationError: "Validation Error",
  AuthenticationError: "Authentication Error",
  AuthorizationError: "Authorization Error",
  NotFoundError: "Not Found Error",
  ServerError: "Server Error",
  ClientError: "Client Error",
  UnknownError: "Unknown Error"
};

export {
  ErrorBoundary,
  ErrorBoundaryFallback,
  ErrorBoundaryIcon,
  ErrorBoundaryTitle,
  ErrorBoundaryDescription,
  ErrorBoundaryDetails,
  ErrorBoundaryActions,
  ErrorBoundaryCard,
  ErrorBoundaryElevated,
  ErrorBoundaryGlass,
  ErrorBoundaryMinimal,
  ErrorBoundarySmall,
  ErrorBoundaryLarge,
  ErrorBoundaryResponsive,
  ErrorBoundarySizes,
  ErrorBoundaryVariantColors,
  ErrorBoundaryErrorTypes,
  errorBoundaryVariants
};
