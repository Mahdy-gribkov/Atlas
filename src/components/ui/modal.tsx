"use client";

import React, { forwardRef, useState, useCallback, useEffect, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  X,
  Maximize2,
  Minimize2,
  Move,
  RotateCcw,
  Download,
  Share2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  Edit,
  Copy,
  Check,
  Plus,
  Minus,
  Heart,
  Star,
  Bookmark,
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
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
  Zap,
  Sparkles,
  Crown,
  Award,
  Trophy,
  Medal,
  Badge,
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

// Modal Root Component
const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-atlas-background/80 backdrop-blur-sm",
        opaque: "bg-atlas-background",
        transparent: "bg-transparent",
        blur: "bg-atlas-background/50 backdrop-blur-md",
        dark: "bg-black/80 backdrop-blur-sm",
        glass: "bg-white/10 backdrop-blur-md border border-white/20",
        gradient: "bg-gradient-to-br from-atlas-primary-main/20 to-atlas-secondary-main/20 backdrop-blur-sm",
        minimal: "bg-transparent",
        premium: "bg-gradient-to-br from-atlas-warning-main/10 to-atlas-success-main/10 backdrop-blur-sm",
        featured: "bg-gradient-to-br from-atlas-primary-main/5 to-atlas-ai-main/5 backdrop-blur-sm",
        compact: "bg-atlas-background/90 backdrop-blur-sm",
        spacious: "bg-atlas-background/70 backdrop-blur-md",
      },
      size: {
        xs: "p-2",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-12",
        "2xl": "p-16",
        full: "p-0"
      },
      position: {
        center: "items-center justify-center",
        top: "items-start justify-center pt-8",
        bottom: "items-end justify-center pb-8",
        left: "items-center justify-start pl-8",
        right: "items-center justify-end pr-8",
        "top-left": "items-start justify-start pt-8 pl-8",
        "top-right": "items-start justify-end pt-8 pr-8",
        "bottom-left": "items-end justify-start pb-8 pl-8",
        "bottom-right": "items-end justify-end pb-8 pr-8",
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
        default: "rounded-lg",
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
      position: "center",
      animation: "fade",
      rounded: "default",
      shadow: "md",
    }
  }
);

const modalContentVariants = cva(
  "relative bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg transition-all duration-200",
  {
    variants: {
      size: {
        xs: "max-w-xs",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full h-full"
      },
      variant: {
        default: "bg-atlas-card-bg",
        card: "bg-atlas-card-bg",
        elevated: "bg-atlas-card-bg shadow-2xl",
        glass: "bg-atlas-card-bg/80 backdrop-blur-sm border-atlas-border/50",
        minimal: "bg-transparent border-0 shadow-none",
        gradient: "bg-gradient-to-br from-atlas-primary-main/5 to-atlas-secondary-main/5",
        premium: "bg-gradient-to-br from-atlas-warning-main/5 to-atlas-success-main/5",
        featured: "bg-gradient-to-br from-atlas-primary-main/3 to-atlas-ai-main/3",
        compact: "bg-atlas-card-bg/90",
        spacious: "bg-atlas-card-bg/70",
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
        default: "rounded-lg",
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
      size: "md",
      variant: "default",
      animation: "fade",
      rounded: "default",
      shadow: "md",
    }
  }
);

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof modalVariants> {
  // Basic props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  
  // Content props
  title?: string;
  subtitle?: string;
  description?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  
  // Header props
  showCloseButton?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  headerActions?: React.ReactNode;
  headerIcon?: React.ReactNode;
  
  // Behavior props
  closable?: boolean;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  fullscreen?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  
  // Actions props
  actions?: ModalAction[];
  onClose?: () => void;
  onAction?: (actionKey: string) => void;
  
  // Stacking props
  stackable?: boolean;
  zIndex?: number;
  onStackChange?: (stackIndex: number) => void;
  
  // Focus management
  focusTrap?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
  onFocusChange?: (isFocused: boolean) => void;
  
  // Scroll management
  scrollLock?: boolean;
  scrollBehavior?: 'auto' | 'smooth';
  onScrollChange?: (isScrolled: boolean) => void;
  
  // Animation props
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
  // Responsive props
  responsive?: boolean;
  breakpoints?: {
    sm?: Partial<ModalProps>;
    md?: Partial<ModalProps>;
    lg?: Partial<ModalProps>;
    xl?: Partial<ModalProps>;
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

export interface ModalAction {
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

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({
    className,
    variant,
    size,
    position,
    animation,
    rounded,
    shadow,
    open = false,
    onOpenChange,
    title,
    subtitle,
    description,
    content,
    footer,
    showCloseButton = true,
    showHeader = true,
    showFooter = false,
    headerActions,
    headerIcon,
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
    stackable = false,
    zIndex,
    onStackChange,
    focusTrap = true,
    initialFocus,
    onFocusChange,
    scrollLock = true,
    scrollBehavior = 'auto',
    onScrollChange,
    animationDuration,
    animationEasing,
    onAnimationStart,
    onAnimationEnd,
    responsive = false,
    breakpoints,
    ariaLabel,
    ariaDescription,
    ariaLabelledBy,
    ariaDescribedBy,
    role = 'dialog',
    customStyles,
    customClasses,
    children,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeOffset, setResizeOffset] = useState({ width: 0, height: 0 });
    const [isFocused, setIsFocused] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [stackIndex, setStackIndex] = useState(0);
    
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const previousActiveElement = useRef<HTMLElement | null>(null);

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