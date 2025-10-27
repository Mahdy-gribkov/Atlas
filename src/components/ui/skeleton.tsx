"use client";

import React, { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Skeleton Root Component
const skeletonVariants = cva(
  "animate-pulse bg-muted rounded",
  {
    variants: {
      variant: {
        default: "bg-muted",
        primary: "bg-primary/20",
        secondary: "bg-secondary/20",
        success: "bg-green-500/20",
        warning: "bg-yellow-500/20",
        error: "bg-red-500/20",
        info: "bg-blue-500/20",
        subtle: "bg-muted/50",
        minimal: "bg-muted/30"
      },
      size: {
        sm: "h-4",
        md: "h-6",
        lg: "h-8",
        xl: "h-12",
        "2xl": "h-16"
      },
      shape: {
        rectangle: "rounded",
        circle: "rounded-full",
        square: "rounded",
        rounded: "rounded-lg",
        pill: "rounded-full"
      },
      animation: {
        pulse: "animate-pulse",
        wave: "animate-pulse",
        shimmer: "animate-pulse",
        glow: "animate-pulse",
        fade: "animate-pulse",
        bounce: "animate-pulse",
        none: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "rectangle",
      animation: "pulse"
    }
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
  count?: number;
  spacing?: string | number;
  children?: React.ReactNode;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({
    className,
    variant,
    size,
    shape,
    animation,
    width,
    height,
    count = 1,
    spacing = 8,
    children,
    ...props
  }, ref) => {
    const style = {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    if (count === 1) {
      return (
        <div
          ref={ref}
          className={cn(skeletonVariants({ variant, size, shape, animation }), className)}
          style={style}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {Array.from({ length: count }, (_, index) => (
          <div
            key={index}
            ref={index === 0 ? ref : undefined}
            className={cn(skeletonVariants({ variant, size, shape, animation }), className)}
            style={{
              ...style,
              marginBottom: index < count - 1 ? `${spacing}px` : undefined,
            }}
            {...props}
          >
            {children}
          </div>
        ))}
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";

// Skeleton Sub-components
const SkeletonText = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} className={cn("h-4", className)} {...props} />
  )
);
SkeletonText.displayName = "SkeletonText";

const SkeletonTitle = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} className={cn("h-6 w-3/4", className)} {...props} />
  )
);
SkeletonTitle.displayName = "SkeletonTitle";

const SkeletonSubtitle = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} className={cn("h-4 w-1/2", className)} {...props} />
  )
);
SkeletonSubtitle.displayName = "SkeletonSubtitle";

const SkeletonAvatar = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} shape="circle" className={cn("h-10 w-10", className)} {...props} />
  )
);
SkeletonAvatar.displayName = "SkeletonAvatar";

const SkeletonButton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} className={cn("h-10 w-20 rounded-md", className)} {...props} />
  )
);
SkeletonButton.displayName = "SkeletonButton";

const SkeletonCard = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton ref={ref} className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
);
SkeletonCard.displayName = "SkeletonCard";

const SkeletonImage = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <Skeleton ref={ref} className={cn("h-48 w-full", className)} {...props} />
  )
);
SkeletonImage.displayName = "SkeletonImage";

const SkeletonTable = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, rows = 5, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
);
SkeletonTable.displayName = "SkeletonTable";

const SkeletonList = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, items = 5, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Skeleton shape="circle" className="h-8 w-8" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
);
SkeletonList.displayName = "SkeletonList";

const SkeletonForm = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, fields = 4, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
      {Array.from({ length: fields }, (_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
);
SkeletonForm.displayName = "SkeletonForm";

// Skeleton Variants
const SkeletonPrimary = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "primary", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonPrimary.displayName = "SkeletonPrimary";

const SkeletonSecondary = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "secondary", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonSecondary.displayName = "SkeletonSecondary";

const SkeletonSuccess = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "success", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonSuccess.displayName = "SkeletonSuccess";

const SkeletonWarning = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonWarning.displayName = "SkeletonWarning";

const SkeletonError = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "error", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonError.displayName = "SkeletonError";

const SkeletonInfo = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "info", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonInfo.displayName = "SkeletonInfo";

const SkeletonSubtle = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "subtle", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonSubtle.displayName = "SkeletonSubtle";

const SkeletonMinimal = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Skeleton ref={ref} variant={variant} {...props} />
  )
);
SkeletonMinimal.displayName = "SkeletonMinimal";

// Shape Variants
const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "circle", ...props }, ref) => (
    <Skeleton ref={ref} shape={shape} {...props} />
  )
);
SkeletonCircle.displayName = "SkeletonCircle";

const SkeletonSquare = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "square", ...props }, ref) => (
    <Skeleton ref={ref} shape={shape} {...props} />
  )
);
SkeletonSquare.displayName = "SkeletonSquare";

const SkeletonRounded = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "rounded", ...props }, ref) => (
    <Skeleton ref={ref} shape={shape} {...props} />
  )
);
SkeletonRounded.displayName = "SkeletonRounded";

const SkeletonPill = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = "pill", ...props }, ref) => (
    <Skeleton ref={ref} shape={shape} {...props} />
  )
);
SkeletonPill.displayName = "SkeletonPill";

// Size Variants
const SkeletonSmall = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ size = "sm", ...props }, ref) => (
    <Skeleton ref={ref} size={size} {...props} />
  )
);
SkeletonSmall.displayName = "SkeletonSmall";

const SkeletonLarge = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ size = "lg", ...props }, ref) => (
    <Skeleton ref={ref} size={size} {...props} />
  )
);
SkeletonLarge.displayName = "SkeletonLarge";

const SkeletonExtraLarge = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ size = "xl", ...props }, ref) => (
    <Skeleton ref={ref} size={size} {...props} />
  )
);
SkeletonExtraLarge.displayName = "SkeletonExtraLarge";

const SkeletonHuge = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ size = "2xl", ...props }, ref) => (
    <Skeleton ref={ref} size={size} {...props} />
  )
);
SkeletonHuge.displayName = "SkeletonHuge";

// Animation Variants
const SkeletonWave = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ animation = "wave", ...props }, ref) => (
    <Skeleton ref={ref} animation={animation} {...props} />
  )
);
SkeletonWave.displayName = "SkeletonWave";

const SkeletonShimmer = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ animation = "shimmer", ...props }, ref) => (
    <Skeleton ref={ref} animation={animation} {...props} />
  )
);
SkeletonShimmer.displayName = "SkeletonShimmer";

const SkeletonGlow = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ animation = "glow", ...props }, ref) => (
    <Skeleton ref={ref} animation={animation} {...props} />
  )
);
SkeletonGlow.displayName = "SkeletonGlow";

const SkeletonFade = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ animation = "fade", ...props }, ref) => (
    <Skeleton ref={ref} animation={animation} {...props} />
  )
);
SkeletonFade.displayName = "SkeletonFade";

const SkeletonBounce = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ animation = "bounce", ...props }, ref) => (
    <Skeleton ref={ref} animation={animation} {...props} />
  )
);
SkeletonBounce.displayName = "SkeletonBounce";

const SkeletonNone = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ animation = "none", ...props }, ref) => (
    <Skeleton ref={ref} animation={animation} {...props} />
  )
);
SkeletonNone.displayName = "SkeletonNone";

// Responsive Skeleton
const SkeletonResponsive = forwardRef<HTMLDivElement, SkeletonProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Skeleton {...props} />
    </div>
  )
);
SkeletonResponsive.displayName = "SkeletonResponsive";

// Size Utilities
const SkeletonSizes = {
  sm: "h-4",
  md: "h-6",
  lg: "h-8",
  xl: "h-12",
  "2xl": "h-16"
};

// Shape Utilities
const SkeletonShapes = {
  rectangle: "rounded",
  circle: "rounded-full",
  square: "rounded",
  rounded: "rounded-lg",
  pill: "rounded-full"
};

// Animation Utilities
const SkeletonAnimations = {
  pulse: "animate-pulse",
  wave: "animate-pulse",
  shimmer: "animate-pulse",
  glow: "animate-pulse",
  fade: "animate-pulse",
  bounce: "animate-pulse",
  none: ""
};

// Variant Colors
const SkeletonVariantColors = {
  default: "bg-muted",
  primary: "bg-primary/20",
  secondary: "bg-secondary/20",
  success: "bg-green-500/20",
  warning: "bg-yellow-500/20",
  error: "bg-red-500/20",
  info: "bg-blue-500/20",
  subtle: "bg-muted/50",
  minimal: "bg-muted/30"
};

export {
  Skeleton,
  SkeletonText,
  SkeletonTitle,
  SkeletonSubtitle,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonImage,
  SkeletonTable,
  SkeletonList,
  SkeletonForm,
  SkeletonPrimary,
  SkeletonSecondary,
  SkeletonSuccess,
  SkeletonWarning,
  SkeletonError,
  SkeletonInfo,
  SkeletonSubtle,
  SkeletonMinimal,
  SkeletonCircle,
  SkeletonSquare,
  SkeletonRounded,
  SkeletonPill,
  SkeletonSmall,
  SkeletonLarge,
  SkeletonExtraLarge,
  SkeletonHuge,
  SkeletonWave,
  SkeletonShimmer,
  SkeletonGlow,
  SkeletonFade,
  SkeletonBounce,
  SkeletonNone,
  SkeletonResponsive,
  SkeletonSizes,
  SkeletonShapes,
  SkeletonAnimations,
  SkeletonVariantColors,
  skeletonVariants
};
