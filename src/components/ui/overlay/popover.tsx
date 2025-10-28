"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  XIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  ExternalLinkIcon,
  DownloadIcon,
  ShareIcon,
  BookmarkIcon,
  HeartIcon,
  StarIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

// Popover Root Component
const popoverVariants = cva(
  "relative inline-block",
  {
    variants: {
      variant: {
        default: "bg-background border border-border",
        card: "bg-card border border-border",
        elevated: "bg-background border border-border shadow-lg",
        glass: "bg-background/80 backdrop-blur-sm border border-border/50",
        minimal: "bg-transparent border-0"
      },
      size: {
        sm: "text-sm p-2",
        md: "text-base p-3",
        lg: "text-lg p-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface PopoverProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof popoverVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
  offset?: number;
  showArrow?: boolean;
  showCloseButton?: boolean;
  dismissible?: boolean;
  persistent?: boolean;
  title?: string;
  description?: string;
  actions?: PopoverAction[];
  onClose?: () => void;
  onAction?: (actionKey: string) => void;
  children?: React.ReactNode;
  triggerElement?: React.ReactNode;
}

export interface PopoverAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
}

const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  ({
    className,
    variant,
    size,
    open = false,
    onOpenChange,
    trigger = 'click',
    placement = 'bottom',
    offset = 8,
    showArrow = true,
    showCloseButton = false,
    dismissible = true,
    persistent = false,
    title,
    description,
    actions = [],
    onClose,
    onAction,
    children,
    triggerElement,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
    
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const handleOpenChange = useCallback((newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
      if (!newOpen) {
        onClose?.();
      }
    }, [onOpenChange, onClose]);

    const handleClose = useCallback(() => {
      if (!dismissible) return;
      handleOpenChange(false);
    }, [dismissible, handleOpenChange]);

    const handleAction = useCallback((actionKey: string) => {
      onAction?.(actionKey);
    }, [onAction]);

    const calculatePosition = useCallback(() => {
      if (!triggerRef.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = 0;
      let left = 0;
      let arrowTop = 0;
      let arrowLeft = 0;

      switch (placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          top = triggerRect.top - contentRect.height - offset;
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          arrowTop = contentRect.height;
          arrowLeft = contentRect.width / 2;
          
          if (placement === 'top-start') {
            left = triggerRect.left;
          } else if (placement === 'top-end') {
            left = triggerRect.right - contentRect.width;
          }
          break;

        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
          arrowTop = -8;
          arrowLeft = contentRect.width / 2;
          
          if (placement === 'bottom-start') {
            left = triggerRect.left;
          } else if (placement === 'bottom-end') {
            left = triggerRect.right - contentRect.width;
          }
          break;

        case 'left':
        case 'left-start':
        case 'left-end':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          left = triggerRect.left - contentRect.width - offset;
          arrowTop = contentRect.height / 2;
          arrowLeft = contentRect.width;
          
          if (placement === 'left-start') {
            top = triggerRect.top;
          } else if (placement === 'left-end') {
            top = triggerRect.bottom - contentRect.height;
          }
          break;

        case 'right':
        case 'right-start':
        case 'right-end':
          top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
          left = triggerRect.right + offset;
          arrowTop = contentRect.height / 2;
          arrowLeft = -8;
          
          if (placement === 'right-start') {
            top = triggerRect.top;
          } else if (placement === 'right-end') {
            top = triggerRect.bottom - contentRect.height;
          }
          break;
      }

      // Adjust for viewport boundaries
      if (left < 0) left = 8;
      if (left + contentRect.width > viewportWidth) left = viewportWidth - contentRect.width - 8;
      if (top < 0) top = 8;
      if (top + contentRect.height > viewportHeight) top = viewportHeight - contentRect.height - 8;

      setPosition({ top, left });
      setArrowPosition({ top: arrowTop, left: arrowLeft });
    }, [placement, offset]);

    const handleTriggerClick = useCallback(() => {
      if (trigger === 'click') {
        handleOpenChange(!isOpen);
      }
    }, [trigger, isOpen, handleOpenChange]);

    const handleTriggerMouseEnter = useCallback(() => {
      if (trigger === 'hover') {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        handleOpenChange(true);
      }
    }, [trigger, handleOpenChange]);

    const handleTriggerMouseLeave = useCallback(() => {
      if (trigger === 'hover' && !persistent) {
        timeoutRef.current = setTimeout(() => {
          handleOpenChange(false);
        }, 150);
      }
    }, [trigger, persistent, handleOpenChange]);

    const handleContentMouseEnter = useCallback(() => {
      if (trigger === 'hover' && !persistent) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    }, [trigger, persistent]);

    const handleContentMouseLeave = useCallback(() => {
      if (trigger === 'hover' && !persistent) {
        timeoutRef.current = setTimeout(() => {
          handleOpenChange(false);
        }, 150);
      }
    }, [trigger, persistent, handleOpenChange]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    }, [isOpen, handleClose]);

    // Effects
    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    useEffect(() => {
      if (isOpen) {
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
    }, [isOpen, calculatePosition, handleKeyDown]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const getArrowClasses = () => {
      const baseClasses = "absolute w-2 h-2 bg-background border border-border transform rotate-45";
      
      switch (placement) {
        case 'top':
        case 'top-start':
        case 'top-end':
          return `${baseClasses} border-t-0 border-l-0`;
        case 'bottom':
        case 'bottom-start':
        case 'bottom-end':
          return `${baseClasses} border-b-0 border-r-0`;
        case 'left':
        case 'left-start':
        case 'left-end':
          return `${baseClasses} border-l-0 border-b-0`;
        case 'right':
        case 'right-start':
        case 'right-end':
          return `${baseClasses} border-r-0 border-t-0`;
        default:
          return baseClasses;
      }
    };

    return (
      <div ref={ref} className={cn("relative inline-block", className)} {...props}>
        {/* Trigger */}
        <div
          ref={triggerRef}
          onClick={handleTriggerClick}
          onMouseEnter={handleTriggerMouseEnter}
          onMouseLeave={handleTriggerMouseLeave}
          className="inline-block"
        >
          {triggerElement || children}
        </div>

        {/* Content */}
        {isOpen && (
          <div
            ref={contentRef}
            className={cn(
              "fixed z-50 rounded-lg shadow-lg",
              popoverVariants({ variant, size })
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            onMouseEnter={handleContentMouseEnter}
            onMouseLeave={handleContentMouseLeave}
          >
            {/* Arrow */}
            {showArrow && (
              <div
                className={getArrowClasses()}
                style={{
                  top: `${arrowPosition.top}px`,
                  left: `${arrowPosition.left}px`,
                }}
              />
            )}

            {/* Header */}
            {(title || description || showCloseButton) && (
              <div className="flex items-center justify-between p-3 border-b border-border">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h3 className="font-semibold text-foreground text-sm">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {description}
                    </p>
                  )}
                </div>
                
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                    aria-label="Close popover"
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="p-3">
              {children}
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center justify-end space-x-2 p-3 border-t border-border">
                {actions.map(action => (
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
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Popover.displayName = "Popover";

// Popover Sub-components
const PopoverTrigger = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("inline-block", className)} {...props} />
  )
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("fixed z-50 rounded-lg shadow-lg", className)} {...props} />
  )
);
PopoverContent.displayName = "PopoverContent";

const PopoverHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between p-3 border-b border-border", className)} {...props} />
  )
);
PopoverHeader.displayName = "PopoverHeader";

const PopoverTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold text-foreground text-sm", className)} {...props} />
  )
);
PopoverTitle.displayName = "PopoverTitle";

const PopoverDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground mt-1", className)} {...props} />
  )
);
PopoverDescription.displayName = "PopoverDescription";

const PopoverBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-3", className)} {...props} />
  )
);
PopoverBody.displayName = "PopoverBody";

const PopoverActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-end space-x-2 p-3 border-t border-border", className)} {...props} />
  )
);
PopoverActions.displayName = "PopoverActions";

const PopoverClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("h-6 w-6 p-0 opacity-70 hover:opacity-100", className)}
      aria-label="Close popover"
      {...props}
    />
  )
);
PopoverClose.displayName = "PopoverClose";

// Popover Variants
const PopoverCard = forwardRef<HTMLDivElement, PopoverProps>(
  ({ variant = "card", ...props }, ref) => (
    <Popover ref={ref} variant={variant} {...props} />
  )
);
PopoverCard.displayName = "PopoverCard";

const PopoverElevated = forwardRef<HTMLDivElement, PopoverProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Popover ref={ref} variant={variant} {...props} />
  )
);
PopoverElevated.displayName = "PopoverElevated";

const PopoverGlass = forwardRef<HTMLDivElement, PopoverProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Popover ref={ref} variant={variant} {...props} />
  )
);
PopoverGlass.displayName = "PopoverGlass";

const PopoverMinimal = forwardRef<HTMLDivElement, PopoverProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Popover ref={ref} variant={variant} {...props} />
  )
);
PopoverMinimal.displayName = "PopoverMinimal";

// Trigger Variants
const PopoverClick = forwardRef<HTMLDivElement, PopoverProps>(
  ({ trigger = "click", ...props }, ref) => (
    <Popover ref={ref} trigger={trigger} {...props} />
  )
);
PopoverClick.displayName = "PopoverClick";

const PopoverHover = forwardRef<HTMLDivElement, PopoverProps>(
  ({ trigger = "hover", ...props }, ref) => (
    <Popover ref={ref} trigger={trigger} {...props} />
  )
);
PopoverHover.displayName = "PopoverHover";

const PopoverFocus = forwardRef<HTMLDivElement, PopoverProps>(
  ({ trigger = "focus", ...props }, ref) => (
    <Popover ref={ref} trigger={trigger} {...props} />
  )
);
PopoverFocus.displayName = "PopoverFocus";

// Size Variants
const PopoverSmall = forwardRef<HTMLDivElement, PopoverProps>(
  ({ size = "sm", ...props }, ref) => (
    <Popover ref={ref} size={size} {...props} />
  )
);
PopoverSmall.displayName = "PopoverSmall";

const PopoverLarge = forwardRef<HTMLDivElement, PopoverProps>(
  ({ size = "lg", ...props }, ref) => (
    <Popover ref={ref} size={size} {...props} />
  )
);
PopoverLarge.displayName = "PopoverLarge";

// Responsive Popover
const PopoverResponsive = forwardRef<HTMLDivElement, PopoverProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Popover {...props} />
    </div>
  )
);
PopoverResponsive.displayName = "PopoverResponsive";

// Size Utilities
const PopoverSizes = {
  sm: "text-sm p-2",
  md: "text-base p-3",
  lg: "text-lg p-4"
};

// Placement Utilities
const PopoverPlacements = {
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
const PopoverVariantColors = {
  default: "bg-background border border-border",
  card: "bg-card border border-border",
  elevated: "bg-background border border-border shadow-lg",
  glass: "bg-background/80 backdrop-blur-sm border border-border/50",
  minimal: "bg-transparent border-0"
};

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverActions,
  PopoverClose,
  PopoverCard,
  PopoverElevated,
  PopoverGlass,
  PopoverMinimal,
  PopoverClick,
  PopoverHover,
  PopoverFocus,
  PopoverSmall,
  PopoverLarge,
  PopoverResponsive,
  PopoverSizes,
  PopoverPlacements,
  PopoverVariantColors,
  popoverVariants
};
