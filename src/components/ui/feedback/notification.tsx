"use client";

import React, { forwardRef, useState, useCallback, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  CheckCircleIcon,
  XCircleIcon,
  InfoIcon,
  AlertTriangleIcon,
  BellIcon,
  MailIcon,
  MessageSquareIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  UsersIcon,
  HeartIcon,
  StarIcon,
  ThumbsUpIcon,
  DownloadIcon,
  UploadIcon,
  ShareIcon,
  BookmarkIcon,
  XIcon,
  MoreHorizontalIcon,
  ChevronRightIcon,
  ExternalLinkIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar } from "./avatar";

// Notification Root Component
const notificationVariants = cva(
  "relative w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg",
  {
    variants: {
      variant: {
        default: "border-border",
        success: "border-green-500/50 bg-green-50 dark:bg-green-950/50",
        warning: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/50",
        error: "border-red-500/50 bg-red-50 dark:bg-red-950/50",
        info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/50",
        primary: "border-primary/50 bg-primary/5",
        secondary: "border-secondary/50 bg-secondary/5",
        muted: "border-muted bg-muted/50"
      },
      size: {
        sm: "text-sm p-3",
        md: "text-base p-4",
        lg: "text-lg p-5"
      },
      position: {
        "top-left": "fixed top-4 left-4 z-50",
        "top-right": "fixed top-4 right-4 z-50",
        "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
        "bottom-left": "fixed bottom-4 left-4 z-50",
        "bottom-right": "fixed bottom-4 right-4 z-50",
        "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        "center": "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
        "inline": "relative"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "top-right"
    }
  }
);

export interface NotificationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  description?: string;
  message?: string;
  icon?: React.ReactNode;
  avatar?: string;
  image?: string;
  timestamp?: Date | string;
  duration?: number;
  persistent?: boolean;
  dismissible?: boolean;
  clickable?: boolean;
  showCloseButton?: boolean;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  showImage?: boolean;
  actions?: NotificationAction[];
  onClose?: () => void;
  onClick?: () => void;
  onAction?: (actionKey: string) => void;
  children?: React.ReactNode;
}

export interface NotificationAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  ({
    className,
    variant,
    size,
    position,
    title,
    description,
    message,
    icon,
    avatar,
    image,
    timestamp,
    duration = 5000,
    persistent = false,
    dismissible = true,
    clickable = false,
    showCloseButton = true,
    showTimestamp = true,
    showAvatar = false,
    showImage = false,
    actions = [],
    onClose,
    onClick,
    onAction,
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [progress, setProgress] = useState(100);

    const getDefaultIcon = () => {
      if (icon) return icon;
      
      switch (variant) {
        case 'success':
          return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
        case 'warning':
          return <AlertTriangleIcon className="h-5 w-5 text-yellow-600" />;
        case 'error':
          return <XCircleIcon className="h-5 w-5 text-red-600" />;
        case 'info':
          return <InfoIcon className="h-5 w-5 text-blue-600" />;
        case 'primary':
          return <BellIcon className="h-5 w-5 text-primary" />;
        case 'secondary':
          return <MessageSquareIcon className="h-5 w-5 text-secondary" />;
        default:
          return <BellIcon className="h-5 w-5 text-muted-foreground" />;
      }
    };

    const formatTimestamp = (timestamp: Date | string) => {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return date.toLocaleDateString();
    };

    const handleClose = useCallback(() => {
      if (!dismissible) return;
      
      setIsClosing(true);
      setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, 200);
    }, [dismissible, onClose]);

    const handleClick = useCallback(() => {
      if (clickable) {
        onClick?.();
      }
    }, [clickable, onClick]);

    const handleAction = useCallback((actionKey: string) => {
      onAction?.(actionKey);
    }, [onAction]);

    // Auto-dismiss functionality
    useEffect(() => {
      if (!persistent && isVisible && duration > 0) {
        const interval = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev - (100 / (duration / 100));
            if (newProgress <= 0) {
              handleClose();
              return 0;
            }
            return newProgress;
          });
        }, 100);

        return () => clearInterval(interval);
      }
    }, [persistent, isVisible, duration, handleClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          notificationVariants({ variant, size, position }),
          isClosing && "opacity-0 scale-95 transition-all duration-200",
          !isClosing && "opacity-100 scale-100 transition-all duration-200",
          clickable && "cursor-pointer hover:shadow-xl",
          className
        )}
        onClick={handleClick}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {/* Progress Bar */}
        {!persistent && duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-border rounded-t-lg overflow-hidden">
            <div
              className="h-full bg-current transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex items-start space-x-3">
          {/* Avatar */}
          {showAvatar && avatar && (
            <Avatar className="flex-shrink-0">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <img src={avatar} alt="Avatar" className="h-full w-full rounded-full object-cover" />
              </div>
            </Avatar>
          )}

          {/* Icon */}
          {!showAvatar && (
            <div className="flex-shrink-0 mt-0.5">
              {getDefaultIcon()}
            </div>
          )}

          {/* Image */}
          {showImage && image && (
            <div className="flex-shrink-0">
              <img
                src={image}
                alt="Notification"
                className="h-12 w-12 rounded-lg object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="font-semibold text-foreground leading-none mb-1">
                {title}
              </h4>
            )}
            
            {description && (
              <p className="text-sm text-muted-foreground mb-1">
                {description}
              </p>
            )}

            {message && (
              <p className="text-sm text-foreground">
                {message}
              </p>
            )}

            {children && (
              <div className="mt-2">
                {children}
              </div>
            )}

            {/* Timestamp */}
            {showTimestamp && timestamp && (
              <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                <ClockIcon className="h-3 w-3" />
                <span>{formatTimestamp(timestamp)}</span>
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                {actions.slice(0, 2).map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action.key);
                    }}
                    disabled={action.disabled}
                    className="h-7 text-xs"
                  >
                    {action.icon && <span className="mr-1">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
                {actions.length > 2 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 w-7 p-0"
                      >
                        <MoreHorizontalIcon className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.slice(2).map(action => (
                        <DropdownMenuItem
                          key={action.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(action.key);
                          }}
                          disabled={action.disabled}
                        >
                          {action.icon && <span className="mr-2">{action.icon}</span>}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          {dismissible && showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="flex-shrink-0 h-6 w-6 p-0 opacity-70 hover:opacity-100"
              aria-label="Close notification"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

Notification.displayName = "Notification";

// Notification Sub-components
const NotificationTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <h4 ref={ref} className={cn("font-semibold text-foreground leading-none mb-1", className)} {...props} />
  )
);
NotificationTitle.displayName = "NotificationTitle";

const NotificationDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground mb-1", className)} {...props} />
  )
);
NotificationDescription.displayName = "NotificationDescription";

const NotificationMessage = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-foreground", className)} {...props} />
  )
);
NotificationMessage.displayName = "NotificationMessage";

const NotificationIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 mt-0.5", className)} {...props} />
  )
);
NotificationIcon.displayName = "NotificationIcon";

const NotificationAvatar = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
  )
);
NotificationAvatar.displayName = "NotificationAvatar";

const NotificationImage = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
  )
);
NotificationImage.displayName = "NotificationImage";

const NotificationContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
NotificationContent.displayName = "NotificationContent";

const NotificationTimestamp = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 mt-2 text-xs text-muted-foreground", className)} {...props} />
  )
);
NotificationTimestamp.displayName = "NotificationTimestamp";

const NotificationActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 mt-3", className)} {...props} />
  )
);
NotificationActions.displayName = "NotificationActions";

const NotificationClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("flex-shrink-0 h-6 w-6 p-0 opacity-70 hover:opacity-100", className)}
      aria-label="Close notification"
      {...props}
    />
  )
);
NotificationClose.displayName = "NotificationClose";

// Notification Variants
const NotificationSuccess = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "success", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationSuccess.displayName = "NotificationSuccess";

const NotificationWarning = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationWarning.displayName = "NotificationWarning";

const NotificationError = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "error", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationError.displayName = "NotificationError";

const NotificationInfo = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "info", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationInfo.displayName = "NotificationInfo";

const NotificationPrimary = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "primary", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationPrimary.displayName = "NotificationPrimary";

const NotificationSecondary = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "secondary", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationSecondary.displayName = "NotificationSecondary";

const NotificationMuted = forwardRef<HTMLDivElement, NotificationProps>(
  ({ variant = "muted", ...props }, ref) => (
    <Notification ref={ref} variant={variant} {...props} />
  )
);
NotificationMuted.displayName = "NotificationMuted";

// Position Variants
const NotificationTopLeft = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "top-left", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationTopLeft.displayName = "NotificationTopLeft";

const NotificationTopRight = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "top-right", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationTopRight.displayName = "NotificationTopRight";

const NotificationTopCenter = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "top-center", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationTopCenter.displayName = "NotificationTopCenter";

const NotificationBottomLeft = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "bottom-left", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationBottomLeft.displayName = "NotificationBottomLeft";

const NotificationBottomRight = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "bottom-right", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationBottomRight.displayName = "NotificationBottomRight";

const NotificationBottomCenter = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "bottom-center", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationBottomCenter.displayName = "NotificationBottomCenter";

const NotificationCenter = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "center", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationCenter.displayName = "NotificationCenter";

const NotificationInline = forwardRef<HTMLDivElement, NotificationProps>(
  ({ position = "inline", ...props }, ref) => (
    <Notification ref={ref} position={position} {...props} />
  )
);
NotificationInline.displayName = "NotificationInline";

// Size Variants
const NotificationSmall = forwardRef<HTMLDivElement, NotificationProps>(
  ({ size = "sm", ...props }, ref) => (
    <Notification ref={ref} size={size} {...props} />
  )
);
NotificationSmall.displayName = "NotificationSmall";

const NotificationLarge = forwardRef<HTMLDivElement, NotificationProps>(
  ({ size = "lg", ...props }, ref) => (
    <Notification ref={ref} size={size} {...props} />
  )
);
NotificationLarge.displayName = "NotificationLarge";

// Responsive Notification
const NotificationResponsive = forwardRef<HTMLDivElement, NotificationProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Notification {...props} />
    </div>
  )
);
NotificationResponsive.displayName = "NotificationResponsive";

// Size Utilities
const NotificationSizes = {
  sm: "text-sm p-3",
  md: "text-base p-4",
  lg: "text-lg p-5"
};

// Position Utilities
const NotificationPositions = {
  "top-left": "fixed top-4 left-4 z-50",
  "top-right": "fixed top-4 right-4 z-50",
  "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
  "bottom-left": "fixed bottom-4 left-4 z-50",
  "bottom-right": "fixed bottom-4 right-4 z-50",
  "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
  "center": "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
  "inline": "relative"
};

// Variant Colors
const NotificationVariantColors = {
  default: "border-border",
  success: "border-green-500/50 bg-green-50 dark:bg-green-950/50",
  warning: "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/50",
  error: "border-red-500/50 bg-red-50 dark:bg-red-950/50",
  info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/50",
  primary: "border-primary/50 bg-primary/5",
  secondary: "border-secondary/50 bg-secondary/5",
  muted: "border-muted bg-muted/50"
};

export {
  Notification,
  NotificationTitle,
  NotificationDescription,
  NotificationMessage,
  NotificationIcon,
  NotificationAvatar,
  NotificationImage,
  NotificationContent,
  NotificationTimestamp,
  NotificationActions,
  NotificationClose,
  NotificationSuccess,
  NotificationWarning,
  NotificationError,
  NotificationInfo,
  NotificationPrimary,
  NotificationSecondary,
  NotificationMuted,
  NotificationTopLeft,
  NotificationTopRight,
  NotificationTopCenter,
  NotificationBottomLeft,
  NotificationBottomRight,
  NotificationBottomCenter,
  NotificationCenter,
  NotificationInline,
  NotificationSmall,
  NotificationLarge,
  NotificationResponsive,
  NotificationSizes,
  NotificationPositions,
  NotificationVariantColors,
  notificationVariants
};
