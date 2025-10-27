"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  XIcon,
  MaximizeIcon,
  MinimizeIcon,
  MoveIcon,
  RotateCcwIcon,
  DownloadIcon,
  ShareIcon,
  MoreHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UnlockIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

// Modal Root Component
const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-background/80 backdrop-blur-sm",
        opaque: "bg-background",
        transparent: "bg-transparent",
        blur: "bg-background/50 backdrop-blur-md",
        dark: "bg-black/80 backdrop-blur-sm"
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
        full: "p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const modalContentVariants = cva(
  "relative bg-background border border-border rounded-lg shadow-lg",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        full: "max-w-full h-full"
      },
      variant: {
        default: "bg-background",
        card: "bg-card",
        elevated: "bg-background shadow-2xl",
        glass: "bg-background/80 backdrop-blur-sm border-border/50",
        minimal: "bg-transparent border-0 shadow-none"
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default"
    }
  }
);

export interface ModalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalVariants> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  fullscreen?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  actions?: ModalAction[];
  onClose?: () => void;
  onAction?: (actionKey: string) => void;
  children?: React.ReactNode;
}

export interface ModalAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    variant,
    size,
    open = false,
  onOpenChange,
    title,
    description,
    showCloseButton = true,
    showHeader = true,
    showFooter = false,
    closable = true,
    maskClosable = true,
    keyboard = true,
    centered = true,
    fullscreen = false,
    draggable = false,
    resizable = false,
    actions = [],
    onClose,
    onAction,
  children,
  ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeOffset, setResizeOffset] = useState({ width: 0, height: 0 });
    
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });

    const handleOpenChange = useCallback((newOpen: boolean) => {
      setIsOpen(newOpen);
      onOpenChange?.(newOpen);
      if (!newOpen) {
        onClose?.();
      }
    }, [onOpenChange, onClose]);

    const handleClose = useCallback(() => {
      if (!closable) return;
      handleOpenChange(false);
    }, [closable, handleOpenChange]);

    const handleAction = useCallback((actionKey: string) => {
      onAction?.(actionKey);
    }, [onAction]);

    const handleOverlayClick = useCallback((e: React.MouseEvent) => {
      if (maskClosable && e.target === e.currentTarget) {
        handleClose();
      }
    }, [maskClosable, handleClose]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
      if (!keyboard) return;
      
      if (e.key === 'Escape') {
        handleClose();
      }
    }, [keyboard, handleClose]);

    // Handle dragging
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (!draggable) return;
      
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }, [draggable]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
      if (!isDragging || !contentRef.current) return;
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      setDragOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }, [isDragging]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle resizing
    const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
      if (!resizable) return;
      
      e.stopPropagation();
      setIsResizing(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }, [resizable]);

    const handleResizeMouseMove = useCallback((e: MouseEvent) => {
      if (!isResizing || !contentRef.current) return;
      
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;
      
      setResizeOffset(prev => ({
        width: Math.max(300, prev.width + deltaX),
        height: Math.max(200, prev.height + deltaY)
      }));
      
      dragStartRef.current = { x: e.clientX, y: e.clientY };
    }, [isResizing]);

    const handleResizeMouseUp = useCallback(() => {
      setIsResizing(false);
    }, []);

    // Effects
    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleResizeMouseMove);
        document.addEventListener('mouseup', handleResizeMouseUp);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        return () => {
          document.removeEventListener('keydown', handleKeyDown);
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.removeEventListener('mousemove', handleResizeMouseMove);
          document.removeEventListener('mouseup', handleResizeMouseUp);
          document.body.style.overflow = 'unset';
        };
      }
    }, [isOpen, handleKeyDown, handleMouseMove, handleMouseUp, handleResizeMouseMove, handleResizeMouseUp]);

    if (!isOpen) return null;

    const modalSize = fullscreen ? "full" : size;
    const contentSize = fullscreen ? "full" : size;

  return (
      <div
        ref={ref}
        className={cn(
          modalVariants({ variant, size: modalSize }),
          centered && "items-center justify-center",
          fullscreen && "p-0",
          className
        )}
        onClick={handleOverlayClick}
        {...props}
      >
        <div
          ref={contentRef}
          className={cn(
            modalContentVariants({ size: contentSize, variant: "default" }),
            fullscreen && "rounded-none",
            isDragging && "cursor-move",
            isResizing && "cursor-nw-resize"
          )}
          style={{
            transform: draggable ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : undefined,
            width: resizable ? `${resizeOffset.width}px` : undefined,
            height: resizable ? `${resizeOffset.height}px` : undefined,
            minWidth: resizable ? '300px' : undefined,
            minHeight: resizable ? '200px' : undefined
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Header */}
          {showHeader && (title || description || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
              
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                  aria-label="Close modal"
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
        {children}
          </div>

          {/* Footer */}
          {showFooter && actions.length > 0 && (
            <div className="flex items-center justify-end space-x-2 p-6 border-t border-border">
              {actions.map(action => (
                <Button
                  key={action.key}
                  variant={action.variant || "outline"}
                  onClick={() => handleAction(action.key)}
                  disabled={action.disabled}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Resize Handle */}
          {resizable && (
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-border"
              onMouseDown={handleResizeMouseDown}
            />
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = "Modal";

// Modal Sub-components
const ModalOverlay = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("fixed inset-0 z-50", className)} {...props} />
  )
);
ModalOverlay.displayName = "ModalOverlay";

const ModalContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative bg-background border border-border rounded-lg shadow-lg", className)} {...props} />
  )
);
ModalContent.displayName = "ModalContent";

const ModalHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between p-6 border-b border-border", className)} {...props} />
  )
);
ModalHeader.displayName = "ModalHeader";

const ModalTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  )
);
ModalTitle.displayName = "ModalTitle";

const ModalDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />
  )
);
ModalDescription.displayName = "ModalDescription";

const ModalBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6", className)} {...props} />
  )
);
ModalBody.displayName = "ModalBody";

const ModalFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-end space-x-2 p-6 border-t border-border", className)} {...props} />
  )
);
ModalFooter.displayName = "ModalFooter";

const ModalClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0 opacity-70 hover:opacity-100", className)}
      aria-label="Close modal"
      {...props}
    />
  )
);
ModalClose.displayName = "ModalClose";

// Modal Variants
const ModalCard = forwardRef<HTMLDivElement, ModalProps>(
  ({ variant = "card", ...props }, ref) => (
    <Modal ref={ref} variant={variant} {...props} />
  )
);
ModalCard.displayName = "ModalCard";

const ModalElevated = forwardRef<HTMLDivElement, ModalProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Modal ref={ref} variant={variant} {...props} />
  )
);
ModalElevated.displayName = "ModalElevated";

const ModalGlass = forwardRef<HTMLDivElement, ModalProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Modal ref={ref} variant={variant} {...props} />
  )
);
ModalGlass.displayName = "ModalGlass";

const ModalMinimal = forwardRef<HTMLDivElement, ModalProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Modal ref={ref} variant={variant} {...props} />
  )
);
ModalMinimal.displayName = "ModalMinimal";

// Size Variants
const ModalSmall = forwardRef<HTMLDivElement, ModalProps>(
  ({ size = "sm", ...props }, ref) => (
    <Modal ref={ref} size={size} {...props} />
  )
);
ModalSmall.displayName = "ModalSmall";

const ModalLarge = forwardRef<HTMLDivElement, ModalProps>(
  ({ size = "lg", ...props }, ref) => (
    <Modal ref={ref} size={size} {...props} />
  )
);
ModalLarge.displayName = "ModalLarge";

const ModalExtraLarge = forwardRef<HTMLDivElement, ModalProps>(
  ({ size = "xl", ...props }, ref) => (
    <Modal ref={ref} size={size} {...props} />
  )
);
ModalExtraLarge.displayName = "ModalExtraLarge";

const ModalFullscreen = forwardRef<HTMLDivElement, ModalProps>(
  ({ fullscreen = true, ...props }, ref) => (
    <Modal ref={ref} fullscreen={fullscreen} {...props} />
  )
);
ModalFullscreen.displayName = "ModalFullscreen";

// Responsive Modal
const ModalResponsive = forwardRef<HTMLDivElement, ModalProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Modal {...props} />
    </div>
  )
);
ModalResponsive.displayName = "ModalResponsive";

// Size Utilities
const ModalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  full: "max-w-full h-full"
};

// Variant Colors
const ModalVariantColors = {
  default: "bg-background/80 backdrop-blur-sm",
  opaque: "bg-background",
  transparent: "bg-transparent",
  blur: "bg-background/50 backdrop-blur-md",
  dark: "bg-black/80 backdrop-blur-sm"
};

export {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
  ModalCard,
  ModalElevated,
  ModalGlass,
  ModalMinimal,
  ModalSmall,
  ModalLarge,
  ModalExtraLarge,
  ModalFullscreen,
  ModalResponsive,
  ModalSizes,
  ModalVariantColors,
  modalVariants,
  modalContentVariants
};