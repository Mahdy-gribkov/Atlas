"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  LoaderIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  ZapIcon,
  TargetIcon,
  ActivityIcon,
  PulseIcon,
  HeartIcon,
  StarIcon,
  SparklesIcon,
  MoonIcon,
  SunIcon,
  CloudIcon,
  WindIcon
} from "lucide-react";

// Loading Root Component
const loadingVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "text-primary",
        primary: "text-primary",
        secondary: "text-secondary",
        success: "text-green-500",
        warning: "text-yellow-500",
        error: "text-red-500",
        info: "text-blue-500",
        muted: "text-muted-foreground"
      },
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
        "2xl": "h-16 w-16"
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
        squares: "animate-pulse"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      type: "spinner"
    }
  }
);

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
  showText?: boolean;
  icon?: React.ReactNode;
  showIcon?: boolean;
  overlay?: boolean;
  fullscreen?: boolean;
  centered?: boolean;
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
          return <PulseIcon className="h-full w-full" />;
        case 'bounce':
          return <TargetIcon className="h-full w-full" />;
        case 'ping':
          return <ActivityIcon className="h-full w-full" />;
        case 'rotate':
          return <RotateCcwIcon className="h-full w-full" />;
        case 'wave':
          return <ZapIcon className="h-full w-full" />;
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
          return <LoaderIcon className="h-full w-full" />;
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