"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Bell,
  Heart,
  Star,
  Zap,
  X,
  ExternalLink,
  Download,
  Share2,
  Bookmark,
  MoreHorizontal,
  Clock,
  Calendar,
  MapPin,
  User,
  Users,
  Tag,
  Filter,
  Search,
  Grid,
  List,
  Layout,
  Image,
  Video,
  File,
  Folder,
  Archive,
  Sparkles,
  Crown,
  Award,
  Trophy,
  Medal,
  Badge as BadgeIcon,
  Flag,
  Target,
  Compass,
  Navigation,
  Route,
  Map,
  Globe,
  Plane,
  Car,
  Train,
  Ship,
  Bike,
  Camera,
  Lightbulb,
  Flashlight,
  Battery,
  Plug,
  Wifi,
  Bluetooth,
  Signal,
  Radio,
  Tv,
  Monitor,
  Laptop,
  Smartphone,
  Tablet,
  Watch,
  Headphones,
  Speaker,
  Phone,
  Mail,
  Send,
  Upload,
  Cloud,
  Database,
  Server,
  Network,
  Clipboard,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FolderOpen,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderSync,
  FolderSearch,
  FolderHeart,
  FolderLock,
  FolderArchive
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

// Toast Root Component
const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border shadow-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-atlas-border bg-atlas-card-bg text-atlas-text-primary",
        destructive: "border-atlas-error-main bg-atlas-error-light text-atlas-error-dark",
        success: "border-atlas-success-main bg-atlas-success-light text-atlas-success-dark",
        warning: "border-atlas-warning-main bg-atlas-warning-light text-atlas-warning-dark",
        error: "border-atlas-error-main bg-atlas-error-light text-atlas-error-dark",
        info: "border-atlas-info-main bg-atlas-info-light text-atlas-info-dark",
        glass: "border-white/20 bg-white/10 backdrop-blur-md text-white",
        gradient: "border-atlas-primary-main/20 bg-gradient-to-r from-atlas-primary-main/10 to-atlas-secondary-main/10 text-atlas-text-primary",
        minimal: "border-transparent bg-transparent text-atlas-text-primary",
        premium: "border-atlas-warning-main/20 bg-gradient-to-r from-atlas-warning-main/5 to-atlas-success-main/5 text-atlas-text-primary",
        featured: "border-atlas-primary-main/20 bg-gradient-to-r from-atlas-primary-main/5 to-atlas-ai-main/5 text-atlas-text-primary",
        compact: "border-atlas-border bg-atlas-card-bg/90 text-atlas-text-primary",
        spacious: "border-atlas-border bg-atlas-card-bg/70 text-atlas-text-primary",
      },
      size: {
        xs: "text-xs p-3 pr-6",
        sm: "text-sm p-4 pr-6",
        md: "text-base p-6 pr-8",
        lg: "text-lg p-8 pr-10",
        xl: "text-xl p-10 pr-12"
      },
      position: {
        "top-left": "fixed top-4 left-4 z-50",
        "top-center": "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
        "top-right": "fixed top-4 right-4 z-50",
        "bottom-left": "fixed bottom-4 left-4 z-50",
        "bottom-center": "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
        "bottom-right": "fixed bottom-4 right-4 z-50",
        "center-left": "fixed top-1/2 left-4 transform -translate-y-1/2 z-50",
        "center-right": "fixed top-1/2 right-4 transform -translate-y-1/2 z-50",
        "center": "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
        "inline": "relative",
      },
      animation: {
        none: "",
        fade: "animate-in fade-in duration-200",
        slide: "animate-in slide-in-from-right-4 duration-200",
        scale: "animate-in zoom-in-95 duration-200",
        bounce: "animate-in bounce-in duration-300",
        spring: "animate-in spring-in duration-300",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        inner: "shadow-inner",
        glow: "shadow-lg shadow-atlas-primary-main/25",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "inline",
      animation: "fade",
      rounded: "default",
      shadow: "md",
    }
  }
);

export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof toastVariants> {
  // Basic props
  id?: string;
  
  // Content props
  title?: string;
  subtitle?: string;
  description?: string;
  message?: string;
  content?: React.ReactNode;
  
  // Icon props
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  // Behavior props
  duration?: number;
  persistent?: boolean;
  dismissible?: boolean;
  showCloseButton?: boolean;
  showProgress?: boolean;
  
  // Actions props
  actions?: ToastAction[];
  onClose?: () => void;
  onAction?: (actionKey: string) => void;
  
  // Stacking props
  stackable?: boolean;
  zIndex?: number;
  maxToasts?: number;
  onStackChange?: (stackIndex: number) => void;
  
  // Animation props
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
  // Progress props
  progressValue?: number;
  progressMax?: number;
  progressVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showProgressValue?: boolean;
  
  // Responsive props
  responsive?: boolean;
  breakpoints?: {
    sm?: Partial<ToastProps>;
    md?: Partial<ToastProps>;
    lg?: Partial<ToastProps>;
    xl?: Partial<ToastProps>;
  };
  
  // Accessibility props
  ariaLabel?: string;
  ariaDescription?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
  
  // Custom props
  customStyles?: React.CSSProperties;
  customClasses?: string;
  
  // Children
  children?: React.ReactNode;
}

export interface ToastAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'success' | 'warning' | 'info';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  keyboardShortcut?: string;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({
    className,
    variant,
    size,
    title,
    description,
    message,
    icon,
    duration = 5000,
    persistent = false,
    dismissible = true,
    showIcon = true,
    showCloseButton = true,
    showProgress = true,
    actions = [],
    onClose,
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
        case 'destructive':
        case 'error':
          return <XCircle className="h-5 w-5" />;
        case 'warning':
          return <AlertTriangle className="h-5 w-5" />;
        case 'success':
          return <CheckCircle className="h-5 w-5" />;
        case 'info':
          return <Info className="h-5 w-5" />;
        default:
          return <Bell className="h-5 w-5" />;
      }
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
          toastVariants({ variant, size }),
          isClosing && "opacity-0 scale-95 transition-all duration-200",
          !isClosing && "opacity-100 scale-100 transition-all duration-200",
      className
    )}
        role="alert"
        aria-live="polite"
    {...props}
      >
        {/* Progress Bar */}
        {showProgress && !persistent && duration > 0 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-current opacity-20 rounded-t-md overflow-hidden">
            <div
              className="h-full bg-current transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

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
              <div className="font-semibold leading-none mb-1">
                {title}
              </div>
            )}
            
            {description && (
              <div className="text-sm opacity-90 mb-1">
                {description}
              </div>
            )}

            {message && (
              <div className="text-sm opacity-90">
                {message}
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
                {actions.slice(0, 2).map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={() => handleAction(action.key)}
                    disabled={action.disabled}
                    className="h-7 text-xs"
                  >
                    {action.icon && <span className="mr-1">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
                {actions.length > 2 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      // Show remaining actions in a simple way
                      actions.slice(2).forEach(action => {
                        if (!action.disabled) {
                          handleAction(action.key);
                        }
                      });
                    }}
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Close Button */}
          {dismissible && showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-2 top-2 h-6 w-6 p-0 opacity-70 hover:opacity-100"
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }
);

Toast.displayName = "Toast";

// Toast Sub-components
const ToastTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-semibold leading-none mb-1", className)} {...props} />
  )
);
ToastTitle.displayName = "ToastTitle";

const ToastDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm opacity-90 mb-1", className)} {...props} />
  )
);
ToastDescription.displayName = "ToastDescription";

const ToastMessage = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
  )
);
ToastMessage.displayName = "ToastMessage";

const ToastIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 mt-0.5", className)} {...props} />
  )
);
ToastIcon.displayName = "ToastIcon";

const ToastContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
ToastContent.displayName = "ToastContent";

const ToastActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 mt-3", className)} {...props} />
  )
);
ToastActions.displayName = "ToastActions";

const ToastClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
    ref={ref}
      variant="ghost"
      size="sm"
      className={cn("absolute right-2 top-2 h-6 w-6 p-0 opacity-70 hover:opacity-100", className)}
      aria-label="Close toast"
    {...props}
  />
  )
);
ToastClose.displayName = "ToastClose";

// Toast Variants
const ToastSuccess = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = "success", ...props }, ref) => (
    <Toast ref={ref} variant={variant} {...props} />
  )
);
ToastSuccess.displayName = "ToastSuccess";

const ToastWarning = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Toast ref={ref} variant={variant} {...props} />
  )
);
ToastWarning.displayName = "ToastWarning";

const ToastError = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = "error", ...props }, ref) => (
    <Toast ref={ref} variant={variant} {...props} />
  )
);
ToastError.displayName = "ToastError";

const ToastInfo = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = "info", ...props }, ref) => (
    <Toast ref={ref} variant={variant} {...props} />
  )
);
ToastInfo.displayName = "ToastInfo";

const ToastDestructive = forwardRef<HTMLDivElement, ToastProps>(
  ({ variant = "destructive", ...props }, ref) => (
    <Toast ref={ref} variant={variant} {...props} />
  )
);
ToastDestructive.displayName = "ToastDestructive";

// Size Variants
const ToastSmall = forwardRef<HTMLDivElement, ToastProps>(
  ({ size = "sm", ...props }, ref) => (
    <Toast ref={ref} size={size} {...props} />
  )
);
ToastSmall.displayName = "ToastSmall";

const ToastLarge = forwardRef<HTMLDivElement, ToastProps>(
  ({ size = "lg", ...props }, ref) => (
    <Toast ref={ref} size={size} {...props} />
  )
);
ToastLarge.displayName = "ToastLarge";

// Responsive Toast
const ToastResponsive = forwardRef<HTMLDivElement, ToastProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Toast {...props} />
    </div>
  )
);
ToastResponsive.displayName = "ToastResponsive";

// Size Utilities
const ToastSizes = {
  sm: "text-sm p-4",
  md: "text-base p-6",
  lg: "text-lg p-8"
};

// Variant Colors
const ToastVariantColors = {
  default: "border bg-background text-foreground",
  destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
  success: "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-100",
  error: "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100",
  info: "border-blue-500 bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
};

export {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastMessage,
  ToastIcon,
  ToastContent,
  ToastActions,
  ToastClose,
  ToastSuccess,
  ToastWarning,
  ToastError,
  ToastInfo,
  ToastDestructive,
  ToastSmall,
  ToastLarge,
  ToastResponsive,
  ToastSizes,
  ToastVariantColors,
  toastVariants
};