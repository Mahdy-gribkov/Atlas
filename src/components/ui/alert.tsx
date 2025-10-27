"use client";

import React, { forwardRef, useState, useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon,
  XIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
  ShieldAlertIcon,
  ShieldXIcon,
  BellIcon,
  MegaphoneIcon,
  LightbulbIcon,
  HeartIcon,
  StarIcon,
  ZapIcon,
  MoreHorizontalIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

// Alert Root Component
const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        warning: "border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
        success: "border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
        info: "border-blue-500/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600",
        error: "border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600",
        critical: "border-red-600/50 text-red-700 dark:border-red-600 [&>svg]:text-red-700",
        notice: "border-purple-500/50 text-purple-600 dark:border-purple-500 [&>svg]:text-purple-600",
        announcement: "border-orange-500/50 text-orange-600 dark:border-orange-500 [&>svg]:text-orange-600",
        tip: "border-cyan-500/50 text-cyan-600 dark:border-cyan-500 [&>svg]:text-cyan-600"
      },
      size: {
        sm: "text-sm p-3",
        md: "text-base p-4",
        lg: "text-lg p-5",
        xl: "text-xl p-6"
      },
      density: {
        compact: "p-2",
        normal: "p-4",
        spacious: "p-6"
      },
      style: {
        solid: "border-0",
        outlined: "bg-transparent",
        filled: "border-0 text-white",
        subtle: "bg-muted/50",
        minimal: "bg-transparent border-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      density: "normal",
      style: "outlined"
    }
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  persistent?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showIcon?: boolean;
  showCloseButton?: boolean;
  actions?: AlertAction[];
  onClose?: () => void;
  onAction?: (actionKey: string) => void;
  children?: React.ReactNode;
}

export interface AlertAction {
  key: string;
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({
    className,
    variant,
    size,
    density,
    style,
    title,
    description,
    icon,
    dismissible = false,
    persistent = true,
    autoClose = false,
    autoCloseDelay = 5000,
    showIcon = true,
    showCloseButton = true,
    actions = [],
    onClose,
    onAction,
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);

    const getDefaultIcon = () => {
      if (icon) return icon;
      
      switch (variant) {
        case 'destructive':
        case 'error':
        case 'critical':
          return <XCircleIcon className="h-4 w-4" />;
        case 'warning':
          return <AlertTriangleIcon className="h-4 w-4" />;
        case 'success':
          return <CheckCircleIcon className="h-4 w-4" />;
        case 'info':
          return <InfoIcon className="h-4 w-4" />;
        case 'notice':
          return <BellIcon className="h-4 w-4" />;
        case 'announcement':
          return <MegaphoneIcon className="h-4 w-4" />;
        case 'tip':
          return <LightbulbIcon className="h-4 w-4" />;
        default:
          return <AlertCircleIcon className="h-4 w-4" />;
      }
    };

    const getBackgroundColor = () => {
      if (style === 'filled') {
        switch (variant) {
          case 'destructive':
          case 'error':
          case 'critical':
            return 'bg-red-500';
          case 'warning':
            return 'bg-yellow-500';
          case 'success':
            return 'bg-green-500';
          case 'info':
            return 'bg-blue-500';
          case 'notice':
            return 'bg-purple-500';
          case 'announcement':
            return 'bg-orange-500';
          case 'tip':
            return 'bg-cyan-500';
          default:
            return 'bg-primary';
        }
      }
      return '';
    };

    const handleClose = useCallback(() => {
      if (!dismissible) return;
      
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 200);
    }, [dismissible, onClose]);

    const handleAction = useCallback((actionKey: string) => {
      onAction?.(actionKey);
    }, [onAction]);

    // Auto-close functionality
    React.useEffect(() => {
      if (autoClose && !persistent && isVisible) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoCloseDelay);
        
        return () => clearTimeout(timer);
      }
    }, [autoClose, persistent, isVisible, autoCloseDelay, handleClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          alertVariants({ variant, size, density, style }),
          getBackgroundColor(),
          isClosing && "opacity-0 scale-95 transition-all duration-200",
          !isClosing && "opacity-100 scale-100 transition-all duration-200",
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              {getDefaultIcon()}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold leading-none tracking-tight mb-1">
                {title}
              </h4>
            )}
            
            {description && (
              <div className="text-sm opacity-90 mt-1">
                {description}
              </div>
            )}

            {children && (
              <div className="mt-2">
                {children}
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                {actions.map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => handleAction(action.key)}
                    disabled={action.disabled}
                    className="h-8"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          {dismissible && showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="flex-shrink-0 h-6 w-6 p-0 opacity-70 hover:opacity-100"
              aria-label="Close alert"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";

// Alert Sub-components
const AlertTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
);
AlertTitle.displayName = "AlertTitle";

const AlertDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm opacity-90 mt-1", className)} {...props} />
  )
);
AlertDescription.displayName = "AlertDescription";

const AlertIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 mt-0.5", className)} {...props} />
  )
);
AlertIcon.displayName = "AlertIcon";

const AlertContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
AlertContent.displayName = "AlertContent";

const AlertActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 mt-3", className)} {...props} />
  )
);
AlertActions.displayName = "AlertActions";

const AlertClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("flex-shrink-0 h-6 w-6 p-0 opacity-70 hover:opacity-100", className)}
      aria-label="Close alert"
      {...props}
    />
  )
);
AlertClose.displayName = "AlertClose";

// Alert Variants
const AlertSolid = forwardRef<HTMLDivElement, AlertProps>(
  ({ style = "solid", ...props }, ref) => (
    <Alert ref={ref} style={style} {...props} />
  )
);
AlertSolid.displayName = "AlertSolid";

const AlertOutlined = forwardRef<HTMLDivElement, AlertProps>(
  ({ style = "outlined", ...props }, ref) => (
    <Alert ref={ref} style={style} {...props} />
  )
);
AlertOutlined.displayName = "AlertOutlined";

const AlertFilled = forwardRef<HTMLDivElement, AlertProps>(
  ({ style = "filled", ...props }, ref) => (
    <Alert ref={ref} style={style} {...props} />
  )
);
AlertFilled.displayName = "AlertFilled";

const AlertSubtle = forwardRef<HTMLDivElement, AlertProps>(
  ({ style = "subtle", ...props }, ref) => (
    <Alert ref={ref} style={style} {...props} />
  )
);
AlertSubtle.displayName = "AlertSubtle";

const AlertMinimal = forwardRef<HTMLDivElement, AlertProps>(
  ({ style = "minimal", ...props }, ref) => (
    <Alert ref={ref} style={style} {...props} />
  )
);
AlertMinimal.displayName = "AlertMinimal";

// Severity Variants
const AlertSuccess = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "success", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertSuccess.displayName = "AlertSuccess";

const AlertWarning = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertWarning.displayName = "AlertWarning";

const AlertError = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "error", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertError.displayName = "AlertError";

const AlertInfo = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "info", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertInfo.displayName = "AlertInfo";

const AlertCritical = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "critical", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertCritical.displayName = "AlertCritical";

const AlertNotice = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "notice", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertNotice.displayName = "AlertNotice";

const AlertAnnouncement = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "announcement", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertAnnouncement.displayName = "AlertAnnouncement";

const AlertTip = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "tip", ...props }, ref) => (
    <Alert ref={ref} variant={variant} {...props} />
  )
);
AlertTip.displayName = "AlertTip";

// Size Variants
const AlertSmall = forwardRef<HTMLDivElement, AlertProps>(
  ({ size = "sm", ...props }, ref) => (
    <Alert ref={ref} size={size} {...props} />
  )
);
AlertSmall.displayName = "AlertSmall";

const AlertLarge = forwardRef<HTMLDivElement, AlertProps>(
  ({ size = "lg", ...props }, ref) => (
    <Alert ref={ref} size={size} {...props} />
  )
);
AlertLarge.displayName = "AlertLarge";

const AlertExtraLarge = forwardRef<HTMLDivElement, AlertProps>(
  ({ size = "xl", ...props }, ref) => (
    <Alert ref={ref} size={size} {...props} />
  )
);
AlertExtraLarge.displayName = "AlertExtraLarge";

// Density Variants
const AlertCompact = forwardRef<HTMLDivElement, AlertProps>(
  ({ density = "compact", ...props }, ref) => (
    <Alert ref={ref} density={density} {...props} />
  )
);
AlertCompact.displayName = "AlertCompact";

const AlertSpacious = forwardRef<HTMLDivElement, AlertProps>(
  ({ density = "spacious", ...props }, ref) => (
    <Alert ref={ref} density={density} {...props} />
  )
);
AlertSpacious.displayName = "AlertSpacious";

// Responsive Alert
const AlertResponsive = forwardRef<HTMLDivElement, AlertProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Alert {...props} />
    </div>
  )
);
AlertResponsive.displayName = "AlertResponsive";

// Spacing Utilities
const AlertSpacing = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Size Utilities
const AlertSizes = {
  sm: "text-sm p-3",
  md: "text-base p-4",
  lg: "text-lg p-5",
  xl: "text-xl p-6"
};

// Style Variants
const AlertStyles = {
  solid: "border-0",
  outlined: "bg-transparent",
  filled: "border-0 text-white",
  subtle: "bg-muted/50",
  minimal: "bg-transparent border-0"
};

// Severity Colors
const AlertSeverityColors = {
  default: "text-foreground",
  destructive: "text-destructive",
  warning: "text-yellow-600",
  success: "text-green-600",
  info: "text-blue-600",
  error: "text-red-600",
  critical: "text-red-700",
  notice: "text-purple-600",
  announcement: "text-orange-600",
  tip: "text-cyan-600"
};

export {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertIcon,
  AlertContent,
  AlertActions,
  AlertClose,
  AlertSolid,
  AlertOutlined,
  AlertFilled,
  AlertSubtle,
  AlertMinimal,
  AlertSuccess,
  AlertWarning,
  AlertError,
  AlertInfo,
  AlertCritical,
  AlertNotice,
  AlertAnnouncement,
  AlertTip,
  AlertSmall,
  AlertLarge,
  AlertExtraLarge,
  AlertCompact,
  AlertSpacious,
  AlertResponsive,
  AlertSpacing,
  AlertSizes,
  AlertStyles,
  AlertSeverityColors,
  alertVariants
};