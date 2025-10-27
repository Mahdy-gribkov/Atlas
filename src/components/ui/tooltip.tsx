"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef, createContext } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { createPortal } from "react-dom";
import { 
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lightbulb,
  Star,
  Heart,
  Zap,
  Target,
  Eye,
  EyeOff,
  Lock,
  Unlock,
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
  Badge,
  Flag,
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

// Tooltip Root Component
const tooltipVariants = cva(
  "absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-atlas-text-primary text-atlas-background",
        dark: "bg-atlas-text-primary text-atlas-background",
        light: "bg-atlas-background text-atlas-text-primary border border-atlas-border",
        primary: "bg-atlas-primary-main text-white",
        secondary: "bg-atlas-secondary-main text-white",
        ai: "bg-atlas-ai-main text-white",
        success: "bg-atlas-success-main text-white",
        warning: "bg-atlas-warning-main text-white",
        error: "bg-atlas-error-main text-white",
        info: "bg-atlas-info-main text-white",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
        gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white",
        minimal: "bg-transparent text-atlas-text-primary border border-atlas-border",
        premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white",
        featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white",
        compact: "bg-atlas-text-primary/90 text-atlas-background",
        spacious: "bg-atlas-text-primary/70 text-atlas-background",
      },
      size: {
        xs: "text-xs px-2 py-1",
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3",
        xl: "text-lg px-5 py-4",
      },
      placement: {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
        "top-start": "bottom-full left-0 mb-2",
        "top-end": "bottom-full right-0 mb-2",
        "bottom-start": "top-full left-0 mt-2",
        "bottom-end": "top-full right-0 mt-2",
        "left-start": "right-full top-0 mr-2",
        "left-end": "right-full bottom-0 mr-2",
        "right-start": "left-full top-0 ml-2",
        "right-end": "left-full bottom-0 ml-2"
      },
      animation: {
        none: "",
        fade: "animate-in fade-in duration-200",
        slide: "animate-in slide-in-from-bottom-4 duration-200",
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
      placement: "top",
      animation: "fade",
      rounded: "default",
      shadow: "md",
    }
  }
);

const tooltipArrowVariants = cva(
  "absolute w-2 h-2 transform rotate-45",
  {
    variants: {
      placement: {
        top: "top-full left-1/2 transform -translate-x-1/2 -mt-1",
        bottom: "bottom-full left-1/2 transform -translate-x-1/2 -mb-1",
        left: "left-full top-1/2 transform -translate-y-1/2 -ml-1",
        right: "right-full top-1/2 transform -translate-y-1/2 -mr-1",
        "top-start": "top-full left-4 -mt-1",
        "top-end": "top-full right-4 -mt-1",
        "bottom-start": "bottom-full left-4 -mb-1",
        "bottom-end": "bottom-full right-4 -mb-1",
        "left-start": "left-full top-4 -ml-1",
        "left-end": "left-full bottom-4 -ml-1",
        "right-start": "right-full top-4 -mr-1",
        "right-end": "right-full bottom-4 -mr-1"
      },
      variant: {
        default: "bg-atlas-text-primary",
        dark: "bg-atlas-text-primary",
        light: "bg-atlas-background border border-atlas-border",
        primary: "bg-atlas-primary-main",
        secondary: "bg-atlas-secondary-main",
        ai: "bg-atlas-ai-main",
        success: "bg-atlas-success-main",
        warning: "bg-atlas-warning-main",
        error: "bg-atlas-error-main",
        info: "bg-atlas-info-main",
        glass: "bg-white/10 backdrop-blur-md border border-white/20",
        gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main",
        minimal: "bg-transparent border border-atlas-border",
        premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main",
        featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main",
        compact: "bg-atlas-text-primary/90",
        spacious: "bg-atlas-text-primary/70",
      }
    },
    defaultVariants: {
      placement: "top",
      variant: "default"
    }
  }
);

// Tooltip Action Interface
export interface TooltipAction {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

// Portal Component
const Portal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return createPortal(children, document.body);
};

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof tooltipVariants> {
  // Basic content
  content?: string;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  
  // Trigger configuration
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Positioning
  placement?: 'top' | 'bottom' | 'left' | 'right' | 
             'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' |
             'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  
  // Animation
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
  // Behavior
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
  forceMount?: boolean;
  delay?: number;
  duration?: number;
  persistent?: boolean;
  maxWidth?: number;
  
  // Icon
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  showArrow?: boolean;
  
  // Interactive
  interactive?: boolean;
  clickable?: boolean;
  disabled?: boolean;
  
  // Actions
  actions?: TooltipAction[];
  
  // Responsive
  responsive?: boolean;
  breakpoints?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
  
  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
  
  // Custom
  customStyles?: React.CSSProperties;
  customClasses?: string;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({
    className,
    variant,
    size,
    placement,
    animation,
    rounded,
    shadow,
    content,
    title,
    description,
    children,
    trigger = 'hover',
    open,
    onOpenChange,
    offset = 8,
    sideOffset,
    alignOffset,
    avoidCollisions = true,
    collisionPadding = 8,
    animationDuration = 200,
    animationEasing = 'ease-out',
    onAnimationStart,
    onAnimationEnd,
    delayDuration = 300,
    skipDelayDuration = 300,
    disableHoverableContent = false,
    forceMount = false,
    delay = 300,
    duration = 0,
    persistent = false,
    maxWidth = 200,
    icon,
    showIcon = false,
    iconPosition = 'left',
    showArrow = true,
    interactive = false,
    clickable = false,
    disabled = false,
    actions,
    responsive = false,
    breakpoints,
    ariaLabel,
    ariaDescription,
    ariaLabelledBy,
    ariaDescribedBy,
    role = 'tooltip',
    customStyles,
    customClasses,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const animationTimeoutRef = useRef<NodeJS.Timeout>();

    const getDefaultIcon = () => {
      if (icon) return icon;
      
      switch (variant) {
        case 'success':
          return <CheckCircle className="h-3 w-3" />;
        case 'warning':
          return <AlertTriangle className="h-3 w-3" />;
        case 'error':
          return <XCircle className="h-3 w-3" />;
        case 'info':
          return <Info className="h-3 w-3" />;
        case 'ai':
          return <Sparkles className="h-3 w-3" />;
        default:
          return <HelpCircle className="h-3 w-3" />;
      }
    };

    const calculatePosition = useCallback(() => {
      if (!containerRef.current || !tooltipRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0;
      let left = 0;

      switch (placement) {
        case 'top':
          top = containerRect.top - tooltipRect.height - offset;
          left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = containerRect.bottom + offset;
          left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
          left = containerRect.left - tooltipRect.width - offset;
          break;
        case 'right':
          top = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
          left = containerRect.right + offset;
          break;
        case 'top-start':
          top = containerRect.top - tooltipRect.height - offset;
          left = containerRect.left;
          break;
        case 'top-end':
          top = containerRect.top - tooltipRect.height - offset;
          left = containerRect.right - tooltipRect.width;
          break;
        case 'bottom-start':
          top = containerRect.bottom + offset;
          left = containerRect.left;
          break;
        case 'bottom-end':
          top = containerRect.bottom + offset;
          left = containerRect.right - tooltipRect.width;
          break;
        case 'left-start':
          top = containerRect.top;
          left = containerRect.left - tooltipRect.width - offset;
          break;
        case 'left-end':
          top = containerRect.bottom - tooltipRect.height;
          left = containerRect.left - tooltipRect.width - offset;
          break;
        case 'right-start':
          top = containerRect.top;
          left = containerRect.right + offset;
          break;
        case 'right-end':
          top = containerRect.bottom - tooltipRect.height;
          left = containerRect.right + offset;
          break;
        default:
          top = containerRect.top - tooltipRect.height - offset;
          left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          break;
      }

      // Adjust for viewport boundaries with collision padding
      if (avoidCollisions) {
        if (left < collisionPadding) left = collisionPadding;
        if (left + tooltipRect.width > viewportWidth - collisionPadding) left = viewportWidth - tooltipRect.width - collisionPadding;
        if (top < collisionPadding) top = collisionPadding;
        if (top + tooltipRect.height > viewportHeight - collisionPadding) top = viewportHeight - tooltipRect.height - collisionPadding;
      }

      setPosition({ top, left });
    }, [placement, offset, avoidCollisions, collisionPadding]);

    const showTooltip = useCallback(() => {
      if (disabled) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        onOpenChange?.(true);
        onAnimationStart?.();
        setTimeout(calculatePosition, 0);
      }, delayDuration);
    }, [disabled, delayDuration, onOpenChange, onAnimationStart, calculatePosition]);

    const hideTooltip = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (!persistent) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          onOpenChange?.(false);
          onAnimationEnd?.();
        }, skipDelayDuration);
      }
    }, [persistent, skipDelayDuration, onOpenChange, onAnimationEnd]);

    const handleMouseEnter = useCallback(() => {
      if (trigger === 'hover') {
        showTooltip();
      }
    }, [trigger, showTooltip]);

    const handleMouseLeave = useCallback(() => {
      if (trigger === 'hover') {
        hideTooltip();
      }
    }, [trigger, hideTooltip]);

    const handleFocus = useCallback(() => {
      if (trigger === 'focus') {
        showTooltip();
      }
    }, [trigger, showTooltip]);

    const handleBlur = useCallback(() => {
      if (trigger === 'focus') {
        hideTooltip();
      }
    }, [trigger, hideTooltip]);

    const handleClick = useCallback(() => {
      if (trigger === 'click') {
        setIsVisible(!isVisible);
        onOpenChange?.(!isVisible);
        setTimeout(calculatePosition, 0);
      }
    }, [trigger, isVisible, onOpenChange, calculatePosition]);

    const handleAction = useCallback((action: TooltipAction) => {
      if (action.onClick) {
        action.onClick();
      }
      return;
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
        onOpenChange?.(false);
      }
    }, [isVisible, onOpenChange]);

    // Handle external open state
    useEffect(() => {
      if (open !== undefined) {
        setIsVisible(open);
      }
    }, [open]);

    // Handle animation
    useEffect(() => {
      if (isVisible) {
        setIsAnimating(true);
        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
        }, animationDuration);
      }
    }, [isVisible, animationDuration]);

    // Effects
    useEffect(() => {
      if (isVisible) {
        calculatePosition();
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition);
        
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('resize', calculatePosition);
          window.removeEventListener('scroll', calculatePosition);
        };
      }
    }, [isVisible, calculatePosition, handleKeyDown]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
      };
    }, []);

    const tooltipContent = content || title || description;

    if (!tooltipContent) return <>{children}</>;

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {/* Trigger */}
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleClick}
          className="inline-block"
        >
          {children}
        </div>

        {/* Tooltip */}
        {(isVisible || forceMount) && (
          <Portal>
            <div
              ref={tooltipRef}
              className={cn(
                tooltipVariants({ 
                  variant, 
                  size, 
                  placement, 
                  animation,
                  rounded,
                  shadow,
                  className: customClasses
                }),
                "opacity-100 transition-opacity duration-200"
              )}
              style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                maxWidth: `${maxWidth}px`,
                zIndex: 50,
                ...customStyles
              }}
              role={role}
              aria-label={ariaLabel}
              aria-describedby={ariaDescribedBy}
              aria-labelledby={ariaLabelledBy}
              aria-live="polite"
            >
              {/* Arrow */}
              {showArrow && (
                <div
                  className={tooltipArrowVariants({ placement, variant })}
                />
              )}

              {/* Content */}
              <div className="flex items-center space-x-2">
                {showIcon && iconPosition === 'left' && (
                  <div className="flex-shrink-0">
                    {getDefaultIcon()}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {title && (
                    <div className="font-semibold">
                      {title}
                    </div>
                  )}
                  
                  {description && (
                    <div className="text-xs opacity-90 mt-1">
                      {description}
                    </div>
                  )}

                  {content && !title && !description && (
                    <div>
                      {content}
                    </div>
                  )}
                </div>

                {showIcon && iconPosition === 'right' && (
                  <div className="flex-shrink-0">
                    {getDefaultIcon()}
                  </div>
                )}
              </div>

              {/* Actions */}
              {actions && actions.length > 0 && (
                <div className="flex gap-1 mt-2 pt-2 border-t border-current/20">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleAction(action)}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-colors",
                        action.variant === 'destructive' 
                          ? "hover:bg-red-500/20 text-red-400" 
                          : "hover:bg-white/10"
                      )}
                      disabled={action.disabled}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Portal>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

// Tooltip Sub-components
const TooltipTrigger = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-block", className)} {...props} />
  )
);
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute z-50 px-3 py-2 text-sm font-medium rounded-md shadow-lg", className)} {...props} />
  )
);
TooltipContent.displayName = "TooltipContent";

const TooltipTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-semibold", className)} {...props} />
  )
);
TooltipTitle.displayName = "TooltipTitle";

const TooltipDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-xs opacity-90 mt-1", className)} {...props} />
  )
);
TooltipDescription.displayName = "TooltipDescription";

const TooltipIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
  )
);
TooltipIcon.displayName = "TooltipIcon";

const TooltipArrow = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute w-2 h-2 transform rotate-45", className)} {...props} />
  )
);
TooltipArrow.displayName = "TooltipArrow";

// Tooltip Variants
const TooltipDark = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "dark", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipDark.displayName = "TooltipDark";

const TooltipLight = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "light", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipLight.displayName = "TooltipLight";

const TooltipPrimary = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "primary", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipPrimary.displayName = "TooltipPrimary";

const TooltipSecondary = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "secondary", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipSecondary.displayName = "TooltipSecondary";

const TooltipSuccess = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "success", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipSuccess.displayName = "TooltipSuccess";

const TooltipWarning = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipWarning.displayName = "TooltipWarning";

const TooltipError = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "error", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipError.displayName = "TooltipError";

const TooltipInfo = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "info", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipInfo.displayName = "TooltipInfo";

// Trigger Variants
const TooltipHover = forwardRef<HTMLDivElement, TooltipProps>(
  ({ trigger = "hover", ...props }, ref) => (
    <Tooltip ref={ref} trigger={trigger} {...props} />
  )
);
TooltipHover.displayName = "TooltipHover";

const TooltipFocus = forwardRef<HTMLDivElement, TooltipProps>(
  ({ trigger = "focus", ...props }, ref) => (
    <Tooltip ref={ref} trigger={trigger} {...props} />
  )
);
TooltipFocus.displayName = "TooltipFocus";

const TooltipClick = forwardRef<HTMLDivElement, TooltipProps>(
  ({ trigger = "click", ...props }, ref) => (
    <Tooltip ref={ref} trigger={trigger} {...props} />
  )
);
TooltipClick.displayName = "TooltipClick";

// Size Variants
const TooltipSmall = forwardRef<HTMLDivElement, TooltipProps>(
  ({ size = "sm", ...props }, ref) => (
    <Tooltip ref={ref} size={size} {...props} />
  )
);
TooltipSmall.displayName = "TooltipSmall";

const TooltipLarge = forwardRef<HTMLDivElement, TooltipProps>(
  ({ size = "lg", ...props }, ref) => (
    <Tooltip ref={ref} size={size} {...props} />
  )
);
TooltipLarge.displayName = "TooltipLarge";

// Responsive Tooltip
const TooltipResponsive = forwardRef<HTMLDivElement, TooltipProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Tooltip {...props} />
    </div>
  )
);
TooltipResponsive.displayName = "TooltipResponsive";

// Tooltip Management Hook
const useTooltip = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
};

// Tooltip Provider Context
const TooltipContext = createContext<{
  defaultDelay?: number;
  defaultDuration?: number;
  defaultPlacement?: TooltipProps['placement'];
  defaultVariant?: TooltipProps['variant'];
}>({});

const TooltipProvider: React.FC<{
  children: React.ReactNode;
  defaultDelay?: number;
  defaultDuration?: number;
  defaultPlacement?: TooltipProps['placement'];
  defaultVariant?: TooltipProps['variant'];
}> = ({ 
  children, 
  defaultDelay = 300, 
  defaultDuration = 0, 
  defaultPlacement = 'top',
  defaultVariant = 'default'
}) => {
  return (
    <TooltipContext.Provider value={{
      defaultDelay,
      defaultDuration,
      defaultPlacement,
      defaultVariant
    }}>
      {children}
    </TooltipContext.Provider>
  );
};

// Additional Variant Components
const TooltipAI = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "ai", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipAI.displayName = "TooltipAI";

const TooltipGlass = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipGlass.displayName = "TooltipGlass";

const TooltipGradient = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "gradient", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipGradient.displayName = "TooltipGradient";

const TooltipMinimal = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipMinimal.displayName = "TooltipMinimal";

const TooltipPremium = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "premium", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipPremium.displayName = "TooltipPremium";

const TooltipFeatured = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "featured", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipFeatured.displayName = "TooltipFeatured";

const TooltipCompact = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "compact", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipCompact.displayName = "TooltipCompact";

const TooltipSpacious = forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = "spacious", ...props }, ref) => (
    <Tooltip ref={ref} variant={variant} {...props} />
  )
);
TooltipSpacious.displayName = "TooltipSpacious";

// Additional Size Components
const TooltipExtraSmall = forwardRef<HTMLDivElement, TooltipProps>(
  ({ size = "xs", ...props }, ref) => (
    <Tooltip ref={ref} size={size} {...props} />
  )
);
TooltipExtraSmall.displayName = "TooltipExtraSmall";

const TooltipExtraLarge = forwardRef<HTMLDivElement, TooltipProps>(
  ({ size = "xl", ...props }, ref) => (
    <Tooltip ref={ref} size={size} {...props} />
  )
);
TooltipExtraLarge.displayName = "TooltipExtraLarge";

// Tooltip Actions Component
const TooltipActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex gap-1 mt-2 pt-2 border-t border-current/20", className)} {...props} />
  )
);
TooltipActions.displayName = "TooltipActions";

// Size Utilities
const TooltipSizes = {
  xs: "text-xs px-2 py-1",
  sm: "text-sm px-2 py-1",
  default: "text-sm px-3 py-2",
  lg: "text-base px-3 py-2",
  xl: "text-lg px-4 py-3"
} as const;

// Placement Utilities
const TooltipPlacements = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
  "top-start": "top-start",
  "top-end": "top-end",
  "bottom-start": "bottom-start",
  "bottom-end": "bottom-end",
  "left-start": "left-start",
  "left-end": "left-end",
  "right-start": "right-start",
  "right-end": "right-end"
};

// Variant Colors
const TooltipVariantColors = {
  default: "bg-atlas-text-primary text-atlas-background",
  dark: "bg-atlas-text-primary text-atlas-background",
  light: "bg-atlas-background text-atlas-text-primary border border-atlas-border",
  primary: "bg-atlas-primary-main text-white",
  secondary: "bg-atlas-secondary-main text-white",
  ai: "bg-atlas-ai-main text-white",
  success: "bg-atlas-success-main text-white",
  warning: "bg-atlas-warning-main text-white",
  error: "bg-atlas-error-main text-white",
  info: "bg-atlas-info-main text-white",
  glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white",
  gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white",
  minimal: "bg-transparent border border-atlas-border text-atlas-text-primary",
  premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white",
  featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white",
  compact: "bg-atlas-text-primary/90 text-atlas-background",
  spacious: "bg-atlas-text-primary/70 text-atlas-background"
} as const;

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipTitle,
  TooltipDescription,
  TooltipIcon,
  TooltipArrow,
  TooltipActions,
  TooltipDark,
  TooltipLight,
  TooltipPrimary,
  TooltipSecondary,
  TooltipSuccess,
  TooltipWarning,
  TooltipError,
  TooltipInfo,
  TooltipAI,
  TooltipGlass,
  TooltipGradient,
  TooltipMinimal,
  TooltipPremium,
  TooltipFeatured,
  TooltipCompact,
  TooltipSpacious,
  TooltipHover,
  TooltipFocus,
  TooltipClick,
  TooltipSmall,
  TooltipLarge,
  TooltipExtraSmall,
  TooltipExtraLarge,
  TooltipResponsive,
  TooltipSizes,
  TooltipPlacements,
  TooltipVariantColors,
  tooltipVariants,
  tooltipArrowVariants,
  useTooltip,
  TooltipProvider
};