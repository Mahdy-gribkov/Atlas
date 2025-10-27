"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  InfoIcon,
  HelpCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightbulbIcon,
  StarIcon,
  HeartIcon,
  ZapIcon,
  TargetIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon
} from "lucide-react";

// Tooltip Root Component
const tooltipVariants = cva(
  "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white",
        dark: "bg-black text-white",
        light: "bg-white text-gray-900 border border-gray-200",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        error: "bg-red-500 text-white",
        info: "bg-blue-500 text-white"
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-2",
        lg: "text-base px-4 py-3"
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
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      placement: "top"
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
        default: "bg-gray-900",
        dark: "bg-black",
        light: "bg-white border border-gray-200",
        primary: "bg-primary",
        secondary: "bg-secondary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        error: "bg-red-500",
        info: "bg-blue-500"
      }
    },
    defaultVariants: {
      placement: "top",
      variant: "default"
    }
  }
);

export interface TooltipProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  showArrow?: boolean;
  trigger?: 'hover' | 'focus' | 'click' | 'manual';
  delay?: number;
  duration?: number;
  disabled?: boolean;
  persistent?: boolean;
  maxWidth?: number;
  children?: React.ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({
    className,
    variant,
    size,
    placement,
    content,
    title,
    description,
    icon,
    showIcon = false,
    showArrow = true,
    trigger = 'hover',
    delay = 300,
    duration = 0,
    disabled = false,
    persistent = false,
    maxWidth = 200,
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const getDefaultIcon = () => {
      if (icon) return icon;
      
      switch (variant) {
        case 'success':
          return <CheckCircleIcon className="h-3 w-3" />;
        case 'warning':
          return <AlertTriangleIcon className="h-3 w-3" />;
        case 'error':
          return <XCircleIcon className="h-3 w-3" />;
        case 'info':
          return <InfoIcon className="h-3 w-3" />;
        default:
          return <HelpCircleIcon className="h-3 w-3" />;
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
          top = containerRect.top - tooltipRect.height - 8;
          left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = containerRect.bottom + 8;
          left = containerRect.left + (containerRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
          left = containerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = containerRect.top + (containerRect.height - tooltipRect.height) / 2;
          left = containerRect.right + 8;
          break;
        case 'top-start':
          top = containerRect.top - tooltipRect.height - 8;
          left = containerRect.left;
          break;
        case 'top-end':
          top = containerRect.top - tooltipRect.height - 8;
          left = containerRect.right - tooltipRect.width;
          break;
        case 'bottom-start':
          top = containerRect.bottom + 8;
          left = containerRect.left;
          break;
        case 'bottom-end':
          top = containerRect.bottom + 8;
          left = containerRect.right - tooltipRect.width;
          break;
        case 'left-start':
          top = containerRect.top;
          left = containerRect.left - tooltipRect.width - 8;
          break;
        case 'left-end':
          top = containerRect.bottom - tooltipRect.height;
          left = containerRect.left - tooltipRect.width - 8;
          break;
        case 'right-start':
          top = containerRect.top;
          left = containerRect.right + 8;
          break;
        case 'right-end':
          top = containerRect.bottom - tooltipRect.height;
          left = containerRect.right + 8;
          break;
      }

      // Adjust for viewport boundaries
      if (left < 8) left = 8;
      if (left + tooltipRect.width > viewportWidth - 8) left = viewportWidth - tooltipRect.width - 8;
      if (top < 8) top = 8;
      if (top + tooltipRect.height > viewportHeight - 8) top = viewportHeight - tooltipRect.height - 8;

      setPosition({ top, left });
    }, [placement]);

    const showTooltip = useCallback(() => {
      if (disabled) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        setTimeout(calculatePosition, 0);
      }, delay);
    }, [disabled, delay, calculatePosition]);

    const hideTooltip = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (!persistent) {
        timeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, duration);
      }
    }, [persistent, duration]);

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
        setTimeout(calculatePosition, 0);
      }
    }, [trigger, isVisible, calculatePosition]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    }, [isVisible]);

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
        {isVisible && (
          <div
            ref={tooltipRef}
            className={cn(
              tooltipVariants({ variant, size, placement }),
              "opacity-100 transition-opacity duration-200"
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxWidth: `${maxWidth}px`,
            }}
            role="tooltip"
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
              {showIcon && (
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
            </div>
          </div>
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

// Size Utilities
const TooltipSizes = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-2",
  lg: "text-base px-4 py-3"
};

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
  default: "bg-gray-900 text-white",
  dark: "bg-black text-white",
  light: "bg-white text-gray-900 border border-gray-200",
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-green-500 text-white",
  warning: "bg-yellow-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white"
};

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipTitle,
  TooltipDescription,
  TooltipIcon,
  TooltipArrow,
  TooltipDark,
  TooltipLight,
  TooltipPrimary,
  TooltipSecondary,
  TooltipSuccess,
  TooltipWarning,
  TooltipError,
  TooltipInfo,
  TooltipHover,
  TooltipFocus,
  TooltipClick,
  TooltipSmall,
  TooltipLarge,
  TooltipResponsive,
  TooltipSizes,
  TooltipPlacements,
  TooltipVariantColors,
  tooltipVariants,
  tooltipArrowVariants
};