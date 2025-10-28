"use client";

import React, { forwardRef, useState, useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  MegaphoneIcon,
  BellIcon,
  AlertTriangleIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,
  StarIcon,
  HeartIcon,
  GiftIcon,
  SparklesIcon,
  ZapIcon,
  TargetIcon,
  TrophyIcon,
  CrownIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExternalLinkIcon,
  DownloadIcon,
  ShareIcon,
  BookmarkIcon,
  MoreHorizontalIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";

// Banner Root Component
const bannerVariants = cva(
  "relative w-full border-b",
  {
    variants: {
      variant: {
        default: "bg-background border-border",
        primary: "bg-primary text-primary-foreground border-primary",
        secondary: "bg-secondary text-secondary-foreground border-secondary",
        success: "bg-green-500 text-white border-green-500",
        warning: "bg-yellow-500 text-white border-yellow-500",
        error: "bg-red-500 text-white border-red-500",
        info: "bg-blue-500 text-white border-blue-500",
        announcement: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500",
        promotion: "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500",
        celebration: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400",
        maintenance: "bg-gray-500 text-white border-gray-500",
        beta: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600"
      },
      size: {
        sm: "text-sm py-2",
        md: "text-base py-3",
        lg: "text-lg py-4"
      },
      density: {
        compact: "py-2",
        normal: "py-3",
        spacious: "py-4"
      },
      position: {
        top: "fixed top-0 left-0 right-0 z-50",
        bottom: "fixed bottom-0 left-0 right-0 z-50",
        inline: "relative"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      density: "normal",
      position: "top"
    }
  }
);

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title?: string;
  description?: string;
  message?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  persistent?: boolean;
  collapsible?: boolean;
  expanded?: boolean;
  showIcon?: boolean;
  showCloseButton?: boolean;
  showCta?: boolean;
  ctaText?: string;
  ctaHref?: string;
  ctaAction?: () => void;
  actions?: BannerAction[];
  onClose?: () => void;
  onToggle?: (expanded: boolean) => void;
  onAction?: (actionKey: string) => void;
  children?: React.ReactNode;
}

export interface BannerAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
}

const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({
    className,
    variant,
    size,
    density,
    position,
    title,
    description,
    message,
    icon,
    dismissible = false,
    persistent = true,
    collapsible = false,
    expanded = true,
    showIcon = true,
    showCloseButton = true,
    showCta = false,
    ctaText = "Learn More",
    ctaHref,
    ctaAction,
    actions = [],
    onClose,
    onToggle,
    onAction,
    children,
    ...props
  }, ref) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [isClosing, setIsClosing] = useState(false);

    const getDefaultIcon = () => {
      if (icon) return icon;
      
      switch (variant) {
        case 'primary':
          return <MegaphoneIcon className="h-5 w-5" />;
        case 'secondary':
          return <BellIcon className="h-5 w-5" />;
        case 'success':
          return <CheckCircleIcon className="h-5 w-5" />;
        case 'warning':
          return <AlertTriangleIcon className="h-5 w-5" />;
        case 'error':
          return <XCircleIcon className="h-5 w-5" />;
        case 'info':
          return <InfoIcon className="h-5 w-5" />;
        case 'announcement':
          return <MegaphoneIcon className="h-5 w-5" />;
        case 'promotion':
          return <GiftIcon className="h-5 w-5" />;
        case 'celebration':
          return <SparklesIcon className="h-5 w-5" />;
        case 'maintenance':
          return <AlertTriangleIcon className="h-5 w-5" />;
        case 'beta':
          return <StarIcon className="h-5 w-5" />;
        default:
          return <BellIcon className="h-5 w-5" />;
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

    const handleToggle = useCallback(() => {
      if (!collapsible) return;
      
      const newExpanded = !isExpanded;
      setIsExpanded(newExpanded);
      onToggle?.(newExpanded);
    }, [collapsible, isExpanded, onToggle]);

    const handleAction = useCallback((actionKey: string) => {
      onAction?.(actionKey);
    }, [onAction]);

    const handleCtaClick = useCallback(() => {
      if (ctaAction) {
        ctaAction();
      } else if (ctaHref) {
        window.open(ctaHref, '_blank');
      }
    }, [ctaAction, ctaHref]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          bannerVariants({ variant, size, density, position }),
          isClosing && "opacity-0 scale-y-0 transition-all duration-200",
          !isClosing && "opacity-100 scale-y-100 transition-all duration-200",
          className
        )}
        role="banner"
        aria-live="polite"
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              {/* Icon */}
              {showIcon && (
                <div className="flex-shrink-0">
                  {getDefaultIcon()}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="font-semibold leading-none mb-1">
                    {title}
                  </h3>
                )}
                
                {description && (
                  <p className="text-sm opacity-90 mb-1">
                    {description}
                  </p>
                )}

                {message && (
                  <p className="text-sm opacity-90">
                    {message}
                  </p>
                )}

                {/* Collapsible Content */}
                {collapsible && isExpanded && children && (
                  <div className="mt-2">
                    {children}
                  </div>
                )}

                {/* Non-collapsible Content */}
                {!collapsible && children && (
                  <div className="mt-2">
                    {children}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* CTA Button */}
                {showCta && (
                  <Button
                    variant={variant === 'default' ? 'outline' : 'secondary'}
                    size="sm"
                    onClick={handleCtaClick}
                    className="h-8"
                  >
                    {ctaText}
                    {ctaHref && <ExternalLinkIcon className="h-3 w-3 ml-1" />}
                  </Button>
                )}

                {/* Action Buttons */}
                {actions.length > 0 && (
                  <>
                    {actions.slice(0, 2).map(action => (
                      <Button
                        key={action.key}
                        variant={action.variant || (variant === 'default' ? 'outline' : 'secondary')}
                        size="sm"
                        onClick={() => handleAction(action.key)}
                        disabled={action.disabled}
                        className="h-8"
                      >
                        {action.icon && <span className="mr-1">{action.icon}</span>}
                        {action.label}
                      </Button>
                    ))}
                    {actions.length > 2 && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={variant === 'default' ? 'outline' : 'secondary'}
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.slice(2).map(action => (
                            <DropdownMenuItem
                              key={action.key}
                              onClick={() => handleAction(action.key)}
                              disabled={action.disabled}
                            >
                              {action.icon && <span className="mr-2">{action.icon}</span>}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </>
                )}

                {/* Collapse Toggle */}
                {collapsible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggle}
                    className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                    aria-label={isExpanded ? "Collapse banner" : "Expand banner"}
                  >
                    {isExpanded ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </Button>
                )}

                {/* Close Button */}
                {dismissible && showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="h-8 w-8 p-0 opacity-70 hover:opacity-100"
                    aria-label="Close banner"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Banner.displayName = "Banner";

// Banner Sub-components
const BannerTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none mb-1", className)} {...props} />
  )
);
BannerTitle.displayName = "BannerTitle";

const BannerDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm opacity-90 mb-1", className)} {...props} />
  )
);
BannerDescription.displayName = "BannerDescription";

const BannerMessage = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
  )
);
BannerMessage.displayName = "BannerMessage";

const BannerIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
  )
);
BannerIcon.displayName = "BannerIcon";

const BannerContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
BannerContent.displayName = "BannerContent";

const BannerActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 flex-shrink-0", className)} {...props} />
  )
);
BannerActions.displayName = "BannerActions";

const BannerClose = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      className={cn("h-8 w-8 p-0 opacity-70 hover:opacity-100", className)}
      aria-label="Close banner"
      {...props}
    />
  )
);
BannerClose.displayName = "BannerClose";

// Banner Variants
const BannerPrimary = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "primary", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerPrimary.displayName = "BannerPrimary";

const BannerSecondary = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "secondary", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerSecondary.displayName = "BannerSecondary";

const BannerSuccess = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "success", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerSuccess.displayName = "BannerSuccess";

const BannerWarning = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "warning", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerWarning.displayName = "BannerWarning";

const BannerError = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "error", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerError.displayName = "BannerError";

const BannerInfo = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "info", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerInfo.displayName = "BannerInfo";

const BannerAnnouncement = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "announcement", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerAnnouncement.displayName = "BannerAnnouncement";

const BannerPromotion = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "promotion", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerPromotion.displayName = "BannerPromotion";

const BannerCelebration = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "celebration", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerCelebration.displayName = "BannerCelebration";

const BannerMaintenance = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "maintenance", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerMaintenance.displayName = "BannerMaintenance";

const BannerBeta = forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = "beta", ...props }, ref) => (
    <Banner ref={ref} variant={variant} {...props} />
  )
);
BannerBeta.displayName = "BannerBeta";

// Position Variants
const BannerTop = forwardRef<HTMLDivElement, BannerProps>(
  ({ position = "top", ...props }, ref) => (
    <Banner ref={ref} position={position} {...props} />
  )
);
BannerTop.displayName = "BannerTop";

const BannerBottom = forwardRef<HTMLDivElement, BannerProps>(
  ({ position = "bottom", ...props }, ref) => (
    <Banner ref={ref} position={position} {...props} />
  )
);
BannerBottom.displayName = "BannerBottom";

const BannerInline = forwardRef<HTMLDivElement, BannerProps>(
  ({ position = "inline", ...props }, ref) => (
    <Banner ref={ref} position={position} {...props} />
  )
);
BannerInline.displayName = "BannerInline";

// Size Variants
const BannerSmall = forwardRef<HTMLDivElement, BannerProps>(
  ({ size = "sm", ...props }, ref) => (
    <Banner ref={ref} size={size} {...props} />
  )
);
BannerSmall.displayName = "BannerSmall";

const BannerLarge = forwardRef<HTMLDivElement, BannerProps>(
  ({ size = "lg", ...props }, ref) => (
    <Banner ref={ref} size={size} {...props} />
  )
);
BannerLarge.displayName = "BannerLarge";

// Density Variants
const BannerCompact = forwardRef<HTMLDivElement, BannerProps>(
  ({ density = "compact", ...props }, ref) => (
    <Banner ref={ref} density={density} {...props} />
  )
);
BannerCompact.displayName = "BannerCompact";

const BannerSpacious = forwardRef<HTMLDivElement, BannerProps>(
  ({ density = "spacious", ...props }, ref) => (
    <Banner ref={ref} density={density} {...props} />
  )
);
BannerSpacious.displayName = "BannerSpacious";

// Responsive Banner
const BannerResponsive = forwardRef<HTMLDivElement, BannerProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Banner {...props} />
    </div>
  )
);
BannerResponsive.displayName = "BannerResponsive";

// Size Utilities
const BannerSizes = {
  sm: "text-sm py-2",
  md: "text-base py-3",
  lg: "text-lg py-4"
};

// Density Utilities
const BannerDensity = {
  compact: "py-2",
  normal: "py-3",
  spacious: "py-4"
};

// Position Utilities
const BannerPositions = {
  top: "fixed top-0 left-0 right-0 z-50",
  bottom: "fixed bottom-0 left-0 right-0 z-50",
  inline: "relative"
};

// Variant Colors
const BannerVariantColors = {
  default: "bg-background border-border",
  primary: "bg-primary text-primary-foreground border-primary",
  secondary: "bg-secondary text-secondary-foreground border-secondary",
  success: "bg-green-500 text-white border-green-500",
  warning: "bg-yellow-500 text-white border-yellow-500",
  error: "bg-red-500 text-white border-red-500",
  info: "bg-blue-500 text-white border-blue-500",
  announcement: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500",
  promotion: "bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500",
  celebration: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400",
  maintenance: "bg-gray-500 text-white border-gray-500",
  beta: "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-600"
};

export {
  Banner,
  BannerTitle,
  BannerDescription,
  BannerMessage,
  BannerIcon,
  BannerContent,
  BannerActions,
  BannerClose,
  BannerPrimary,
  BannerSecondary,
  BannerSuccess,
  BannerWarning,
  BannerError,
  BannerInfo,
  BannerAnnouncement,
  BannerPromotion,
  BannerCelebration,
  BannerMaintenance,
  BannerBeta,
  BannerTop,
  BannerBottom,
  BannerInline,
  BannerSmall,
  BannerLarge,
  BannerCompact,
  BannerSpacious,
  BannerResponsive,
  BannerSizes,
  BannerDensity,
  BannerPositions,
  BannerVariantColors,
  bannerVariants
};
