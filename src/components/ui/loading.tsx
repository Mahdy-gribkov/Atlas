"use client";

import React, { forwardRef, useState, useCallback, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  Loader2,
  RefreshCw,
  RotateCcw,
  Zap,
  Target,
  Activity,
  Pulse,
  Heart,
  Star,
  Sparkles,
  Moon,
  Sun,
  Cloud,
  Wind,
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

// Loading Root Component
const loadingVariants = cva(
  "inline-flex items-center justify-center transition-all duration-200",
  {
    variants: {
      variant: {
        default: "text-atlas-primary-main",
        primary: "text-atlas-primary-main",
        secondary: "text-atlas-secondary-main",
        success: "text-atlas-success-main",
        warning: "text-atlas-warning-main",
        error: "text-atlas-error-main",
        info: "text-atlas-info-main",
        muted: "text-atlas-text-secondary",
        glass: "text-white/80",
        gradient: "text-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main bg-clip-text",
        minimal: "text-atlas-text-primary/60",
        premium: "text-atlas-warning-main",
        featured: "text-atlas-ai-main",
        compact: "text-atlas-text-primary/80",
        spacious: "text-atlas-text-primary/70",
      },
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16",
        "3xl": "h-20 w-20",
        "4xl": "h-24 w-24"
      },
      type: {
        spinner: "animate-spin",
        pulse: "animate-pulse",
        bounce: "animate-bounce",
        ping: "animate-ping",
        spin: "animate-spin",
        rotate: "animate-spin",
        heartbeat: "animate-pulse",
        wave: "animate-pulse",
        dots: "animate-pulse",
        bars: "animate-pulse",
        circles: "animate-pulse",
        squares: "animate-pulse",
        ripple: "animate-ping",
        shimmer: "animate-pulse",
        glow: "animate-pulse",
        float: "animate-bounce",
        shake: "animate-pulse",
        wiggle: "animate-pulse",
        elastic: "animate-bounce",
        spring: "animate-bounce",
        smooth: "animate-spin",
        fast: "animate-spin",
        slow: "animate-spin",
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
      type: "spinner",
      animation: "fade",
      rounded: "default",
      shadow: "md",
    }
  }
);

export interface LoadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof loadingVariants> {
  // Basic props
  text?: string;
  subtitle?: string;
  description?: string;
  content?: React.ReactNode;
  
  // Display props
  showText?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showIcon?: boolean;
  showProgress?: boolean;
  
  // Icon props
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  
  // Overlay props
  overlay?: boolean;
  fullscreen?: boolean;
  centered?: boolean;
  overlayOpacity?: number;
  overlayBlur?: boolean;
  
  // Progress props
  progress?: number;
  progressMax?: number;
  progressVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showProgressValue?: boolean;
  progressText?: string;
  
  // Animation props
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
  // Responsive props
  responsive?: boolean;
  breakpoints?: {
    sm?: Partial<LoadingProps>;
    md?: Partial<LoadingProps>;
    lg?: Partial<LoadingProps>;
    xl?: Partial<LoadingProps>;
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

const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({
    className,
    variant,
    size,
    type,
    text,
    showText = false,
    icon,
    showIcon = true,
    overlay = false,
    fullscreen = false,
    centered = true,
    children,
    ...props
  }, ref) => {
    const getDefaultIcon = () => {
      if (icon) return icon;
      
      switch (type) {
        case 'pulse':
        case 'heartbeat':
          return <Pulse className="h-full w-full" />;
        case 'bounce':
          return <Target className="h-full w-full" />;
        case 'ping':
          return <Activity className="h-full w-full" />;
        case 'rotate':
          return <RotateCcw className="h-full w-full" />;
        case 'wave':
          return <Zap className="h-full w-full" />;
        case 'dots':
          return <div className="flex space-x-1">
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>;
        case 'bars':
          return <div className="flex space-x-1">
            <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>;
        case 'circles':
          return <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>;
        case 'squares':
          return <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>;
        default:
          return <Loader2 className="h-full w-full" />;
      }
    };

    const loadingContent = (
      <div className={cn("flex items-center space-x-2", className)} {...props}>
        {showIcon && (
          <div className={cn(loadingVariants({ variant, size, type }))}>
            {getDefaultIcon()}
          </div>
        )}
        
        {showText && text && (
          <span className="text-sm text-muted-foreground">
            {text}
          </span>
        )}
        
        {children}
      </div>
    );

    if (overlay) {
      return (
    <div
      ref={ref}
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
            fullscreen && "fixed inset-0",
            centered && "items-center justify-center"
          )}
        >
          {loadingContent}
    </div>
      );
    }

    if (fullscreen) {
    return (
      <div
        ref={ref}
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50",
            className
          )}
        {...props}
      >
          {loadingContent}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn(centered && "flex items-center justify-center", className)} {...props}>
        {loadingContent}
      </div>
    );
  }
);

Loading.displayName = "Loading";

// Loading Sub-components
const LoadingSpinner = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "spinner", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingSpinner.displayName = "LoadingSpinner";

const LoadingPulse = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "pulse", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingPulse.displayName = "LoadingPulse";

const LoadingBounce = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "bounce", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingBounce.displayName = "LoadingBounce";

const LoadingPing = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "ping", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingPing.displayName = "LoadingPing";

const LoadingDots = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "dots", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingDots.displayName = "LoadingDots";

const LoadingBars = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "bars", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingBars.displayName = "LoadingBars";

const LoadingCircles = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "circles", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingCircles.displayName = "LoadingCircles";

const LoadingSquares = forwardRef<HTMLDivElement, LoadingProps>(
  ({ type = "squares", ...props }, ref) => (
    <Loading ref={ref} type={type} {...props} />
  )
);
LoadingSquares.displayName = "LoadingSquares";

// Size Variants
const LoadingSmall = forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = "sm", ...props }, ref) => (
    <Loading ref={ref} size={size} {...props} />
  )
);
LoadingSmall.displayName = "LoadingSmall";

const LoadingLarge = forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = "lg", ...props }, ref) => (
    <Loading ref={ref} size={size} {...props} />
  )
);
LoadingLarge.displayName = "LoadingLarge";

const LoadingExtraLarge = forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = "xl", ...props }, ref) => (
    <Loading ref={ref} size={size} {...props} />
  )
);
LoadingExtraLarge.displayName = "LoadingExtraLarge";

const LoadingHuge = forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = "2xl", ...props }, ref) => (
    <Loading ref={ref} size={size} {...props} />
  )
);
LoadingHuge.displayName = "LoadingHuge";

// Variant Variants
const LoadingPrimary = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "primary", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingPrimary.displayName = "LoadingPrimary";

const LoadingSecondary = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "secondary", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingSecondary.displayName = "LoadingSecondary";

const LoadingSuccess = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "success", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingSuccess.displayName = "LoadingSuccess";

const LoadingWarning = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingWarning.displayName = "LoadingWarning";

const LoadingError = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "error", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingError.displayName = "LoadingError";

const LoadingInfo = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "info", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingInfo.displayName = "LoadingInfo";

const LoadingMuted = forwardRef<HTMLDivElement, LoadingProps>(
  ({ variant = "muted", ...props }, ref) => (
    <Loading ref={ref} variant={variant} {...props} />
  )
);
LoadingMuted.displayName = "LoadingMuted";

// Overlay Variants
const LoadingOverlay = forwardRef<HTMLDivElement, LoadingProps>(
  ({ overlay = true, ...props }, ref) => (
    <Loading ref={ref} overlay={overlay} {...props} />
  )
);
LoadingOverlay.displayName = "LoadingOverlay";

const LoadingFullscreen = forwardRef<HTMLDivElement, LoadingProps>(
  ({ fullscreen = true, ...props }, ref) => (
    <Loading ref={ref} fullscreen={fullscreen} {...props} />
  )
);
LoadingFullscreen.displayName = "LoadingFullscreen";

// Responsive Loading
const LoadingResponsive = forwardRef<HTMLDivElement, LoadingProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Loading {...props} />
    </div>
  )
);
LoadingResponsive.displayName = "LoadingResponsive";

// Size Utilities
const LoadingSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
  "2xl": "h-16 w-16"
};

// Type Utilities
const LoadingTypes = {
  spinner: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  ping: "animate-ping",
  spin: "animate-spin",
  rotate: "animate-spin",
  heartbeat: "animate-pulse",
  wave: "animate-pulse",
  dots: "animate-pulse",
  bars: "animate-pulse",
  circles: "animate-pulse",
  squares: "animate-pulse"
};

// Variant Colors
const LoadingVariantColors = {
  default: "text-primary",
  primary: "text-primary",
  secondary: "text-secondary",
  success: "text-green-500",
  warning: "text-yellow-500",
  error: "text-red-500",
  info: "text-blue-500",
  muted: "text-muted-foreground"
};

export {
  Loading,
  LoadingSpinner,
  LoadingPulse,
  LoadingBounce,
  LoadingPing,
  LoadingDots,
  LoadingBars,
  LoadingCircles,
  LoadingSquares,
  LoadingSmall,
  LoadingLarge,
  LoadingExtraLarge,
  LoadingHuge,
  LoadingPrimary,
  LoadingSecondary,
  LoadingSuccess,
  LoadingWarning,
  LoadingError,
  LoadingInfo,
  LoadingMuted,
  LoadingOverlay,
  LoadingFullscreen,
  LoadingResponsive,
  LoadingSizes,
  LoadingTypes,
  LoadingVariantColors,
  loadingVariants
};