import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { Loader2, AlertCircle, CheckCircle, Info, Sparkles, Star, Heart, Shield, Zap, Crown, Gem, Award, Trophy } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const switchVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
        secondary: 'data-[state=checked]:bg-atlas-secondary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-secondary-main',
        ai: 'data-[state=checked]:bg-atlas-ai-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-ai-main',
        success: 'data-[state=checked]:bg-atlas-success-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-success-main',
        error: 'data-[state=checked]:bg-atlas-error-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-error-main',
        warning: 'data-[state=checked]:bg-atlas-warning-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-warning-main',
        info: 'data-[state=checked]:bg-atlas-info-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-info-main',
        muted: 'data-[state=checked]:bg-atlas-text-tertiary data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-text-tertiary',
        glass: 'data-[state=checked]:bg-atlas-primary-main/80 data-[state=unchecked]:bg-atlas-border/20 backdrop-blur-sm focus-visible:ring-atlas-primary-main',
        gradient: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-secondary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
        minimal: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-transparent hover:bg-atlas-background-secondary focus-visible:ring-atlas-primary-main',
        premium: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main/80 data-[state=checked]:to-atlas-secondary-main/80 data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
        featured: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-secondary-main/80 data-[state=checked]:to-atlas-ai-main/80 data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-secondary-main',
        compact: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
        spacious: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
      },
      size: {
        xs: 'h-3 w-6',
        sm: 'h-4 w-7',
        default: 'h-6 w-11',
        lg: 'h-8 w-14',
        xl: 'h-10 w-18',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-sm',
        pill: 'rounded-full',
        none: 'rounded-none',
      },
      animation: {
        none: '',
        fade: 'animate-fade-in',
        slide: 'animate-slide-in',
        scale: 'animate-scale-in',
        bounce: 'animate-bounce-in',
        spring: 'animate-spring-in',
        smooth: 'transition-all duration-300 ease-in-out',
        fast: 'transition-all duration-150 ease-in-out',
        slow: 'transition-all duration-500 ease-in-out',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        default: 'shadow',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        glow: 'shadow-glow',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
      animation: 'none',
      shadow: 'none',
    },
  }
);

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'> & 
    VariantProps<typeof switchVariants> & {
      loading?: boolean;
      loadingText?: string | undefined;
      icon?: React.ReactNode;
      showIcon?: boolean;
      iconPosition?: 'left' | 'right';
      animationDuration?: number | undefined;
      animationEasing?: string | undefined;
      onAnimationStart?: (() => void) | undefined;
      onAnimationEnd?: (() => void) | undefined;
      customStyles?: React.CSSProperties | undefined;
      customClasses?: string | undefined;
    }
>(({ 
  className, 
  variant, 
  size, 
  shape,
  animation,
  shadow,
  loading = false,
  loadingText,
  icon,
  showIcon = false,
  iconPosition = 'left',
  animationDuration,
  animationEasing,
  onAnimationStart,
  onAnimationEnd,
  customStyles,
  customClasses,
  ...props 
}, ref) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const getDefaultIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success': return <CheckCircle className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      case 'warning': return <AlertCircle className="h-3 w-3" />;
      case 'info': return <Info className="h-3 w-3" />;
      case 'ai': return <Sparkles className="h-3 w-3" />;
      case 'premium': return <Crown className="h-3 w-3" />;
      case 'featured': return <Star className="h-3 w-3" />;
      case 'gradient': return <Gem className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleAnimationStart = () => {
    setIsAnimating(true);
    onAnimationStart?.();
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    onAnimationEnd?.();
  };

  const animationStyle = animationDuration ? {
    animationDuration: `${animationDuration}ms`,
    animationTimingFunction: animationEasing || 'ease-in-out',
  } : {};

  const getThumbSize = () => {
    switch (size) {
      case 'xs': return 'h-2 w-2';
      case 'sm': return 'h-3 w-3';
      case 'default': return 'h-5 w-5';
      case 'lg': return 'h-7 w-7';
      case 'xl': return 'h-9 w-9';
      default: return 'h-5 w-5';
    }
  };

  const getThumbTranslate = () => {
    switch (size) {
      case 'xs': return 'data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0';
      case 'sm': return 'data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0';
      case 'default': return 'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0';
      case 'lg': return 'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0';
      case 'xl': return 'data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0';
      default: return 'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0';
    }
  };

  return (
    <SwitchPrimitive.Root
      className={cn(
        switchVariants({ variant, size, shape, animation, shadow }),
        customClasses,
        className
      )}
      style={{
        ...animationStyle,
        ...customStyles,
      }}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb 
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform',
          getThumbSize(),
          getThumbTranslate()
        )}
      >
        {loading && (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-2 w-2 animate-spin text-atlas-text-tertiary" />
            {loadingText && <span className="ml-1 text-xs">{loadingText}</span>}
          </div>
        )}
        {!loading && showIcon && iconPosition === 'left' && (
          <div className="flex items-center justify-center h-full w-full">
            {getDefaultIcon()}
          </div>
        )}
        {!loading && showIcon && iconPosition === 'right' && (
          <div className="flex items-center justify-center h-full w-full">
            {getDefaultIcon()}
          </div>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

// Enhanced Switch with label and description
export interface SwitchFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  infoMessage?: string;
  variant?: 'default' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  shape?: 'rounded' | 'square' | 'pill' | 'none';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring' | 'smooth' | 'fast' | 'slow';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  orientation?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end';
  spacing?: 'tight' | 'normal' | 'loose';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  customStyles?: React.CSSProperties;
  customClasses?: string | undefined;
  ariaLabel?: string;
  ariaDescription?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
}

const SwitchField = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchFieldProps
>(({
  id,
  checked,
  onCheckedChange,
  disabled = false,
  required = false,
  label,
  description,
  errorMessage,
  successMessage,
  warningMessage,
  infoMessage,
  variant = 'default',
  size = 'default',
  shape = 'rounded',
  animation = 'none',
  shadow = 'none',
  orientation = 'vertical',
  alignment = 'start',
  spacing = 'normal',
  loading = false,
  loadingText,
  icon,
  showIcon = false,
  iconPosition = 'left',
  animationDuration,
  animationEasing,
  onAnimationStart,
  onAnimationEnd,
  customStyles,
  customClasses,
  ariaLabel,
  ariaDescription,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
  className,
  ...props
}, ref) => {
  const switchId = id || React.useId();
  const errorId = `${switchId}-error`;
  const successId = `${switchId}-success`;
  const warningId = `${switchId}-warning`;
  const infoId = `${switchId}-info`;
  const descriptionId = `${switchId}-description`;
  
  const actualVariant = errorMessage ? 'error' : 
                       successMessage ? 'success' : 
                       warningMessage ? 'warning' : 
                       infoMessage ? 'info' : variant;

  const getSpacingClasses = () => {
    switch (spacing) {
      case 'tight': return 'space-y-1';
      case 'loose': return 'space-y-4';
      default: return 'space-y-2';
    }
  };

  const getAlignmentClasses = () => {
    switch (alignment) {
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      default: return 'items-start';
    }
  };

  return (
    <div className={cn(getSpacingClasses(), className)} {...props}>
      <div className={cn('flex', orientation === 'horizontal' ? 'flex-row items-center space-x-3' : 'flex-col', getAlignmentClasses())}>
        <Switch
          ref={ref}
          id={switchId}
          checked={checked ?? false}
          onCheckedChange={onCheckedChange || (() => {})}
          disabled={disabled}
          required={required}
          variant={actualVariant}
          size={size}
          shape={shape}
          animation={animation}
          shadow={shadow}
          loading={loading}
          loadingText={loadingText || undefined}
          icon={icon}
          showIcon={showIcon}
          iconPosition={iconPosition}
          animationDuration={animationDuration}
          animationEasing={animationEasing}
          onAnimationStart={onAnimationStart}
          onAnimationEnd={onAnimationEnd}
          customStyles={customStyles}
          customClasses={customClasses}
          aria-describedby={cn(
            description && descriptionId,
            errorMessage && errorId,
            successMessage && successId,
            warningMessage && warningId,
            infoMessage && infoId,
            ariaDescribedBy
          )}
          aria-invalid={ariaInvalid ?? !!errorMessage}
          aria-required={ariaRequired ?? required}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
        />
        <div className={cn('flex-1', getSpacingClasses())}>
          {label && (
            <label
              htmlFor={switchId}
              className="text-sm font-medium text-atlas-text-primary cursor-pointer"
            >
              {label}
              {required && (
                <span className="ml-1 text-atlas-error-main" aria-label="required">
                  *
                </span>
              )}
            </label>
          )}
          {description && (
            <p
              id={descriptionId}
              className="text-sm text-atlas-text-tertiary"
            >
              {description}
            </p>
          )}
          {errorMessage && (
            <p
              id={errorId}
              className="text-sm text-atlas-error-main"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p
              id={successId}
              className="text-sm text-atlas-success-main"
              role="status"
            >
              {successMessage}
            </p>
          )}
          {warningMessage && (
            <p
              id={warningId}
              className="text-sm text-atlas-warning-main"
              role="alert"
            >
              {warningMessage}
            </p>
          )}
          {infoMessage && (
            <p
              id={infoId}
              className="text-sm text-atlas-info-main"
              role="status"
            >
              {infoMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
SwitchField.displayName = 'SwitchField';

// Toggle switch (alternative styling)
const toggleVariants = cva(
  'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-primary-main',
        secondary: 'data-[state=checked]:bg-atlas-secondary-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-secondary-main',
        ai: 'data-[state=checked]:bg-atlas-ai-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-ai-main',
        success: 'data-[state=checked]:bg-atlas-success-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-success-main',
        error: 'data-[state=checked]:bg-atlas-error-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-error-main',
        warning: 'data-[state=checked]:bg-atlas-warning-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-warning-main',
        info: 'data-[state=checked]:bg-atlas-info-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-info-main',
        muted: 'data-[state=checked]:bg-atlas-text-tertiary data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-text-tertiary',
        glass: 'data-[state=checked]:bg-atlas-primary-main/80 data-[state=unchecked]:bg-atlas-border-subtle/20 backdrop-blur-sm focus-visible:ring-atlas-primary-main',
        gradient: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-secondary-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-primary-main',
        minimal: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-transparent hover:bg-atlas-background-secondary focus-visible:ring-atlas-primary-main',
        premium: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main/80 data-[state=checked]:to-atlas-secondary-main/80 data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-primary-main',
        featured: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-secondary-main/80 data-[state=checked]:to-atlas-ai-main/80 data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-secondary-main',
        compact: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-primary-main',
        spacious: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border-subtle focus-visible:ring-atlas-primary-main',
      },
      size: {
        xs: 'h-3 w-6',
        sm: 'h-4 w-7',
        default: 'h-6 w-11',
        lg: 'h-8 w-14',
        xl: 'h-10 w-18',
      },
      shape: {
        rounded: 'rounded-full',
        square: 'rounded-sm',
        pill: 'rounded-full',
        none: 'rounded-none',
      },
      animation: {
        none: '',
        fade: 'animate-fade-in',
        slide: 'animate-slide-in',
        scale: 'animate-scale-in',
        bounce: 'animate-bounce-in',
        spring: 'animate-spring-in',
        smooth: 'transition-all duration-300 ease-in-out',
        fast: 'transition-all duration-150 ease-in-out',
        slow: 'transition-all duration-500 ease-in-out',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        default: 'shadow',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        glow: 'shadow-glow',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'rounded',
      animation: 'none',
      shadow: 'none',
    },
  }
);

const Toggle = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'> & 
    VariantProps<typeof toggleVariants> & {
      loading?: boolean;
      loadingText?: string | undefined;
      icon?: React.ReactNode;
      showIcon?: boolean;
      iconPosition?: 'left' | 'right';
      animationDuration?: number | undefined;
      animationEasing?: string | undefined;
      onAnimationStart?: (() => void) | undefined;
      onAnimationEnd?: (() => void) | undefined;
      customStyles?: React.CSSProperties | undefined;
      customClasses?: string | undefined;
    }
>(({ 
  className, 
  variant, 
  size, 
  shape,
  animation,
  shadow,
  loading = false,
  loadingText,
  icon,
  showIcon = false,
  iconPosition = 'left',
  animationDuration,
  animationEasing,
  onAnimationStart,
  onAnimationEnd,
  customStyles,
  customClasses,
  ...props 
}, ref) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const getDefaultIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success': return <CheckCircle className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      case 'warning': return <AlertCircle className="h-3 w-3" />;
      case 'info': return <Info className="h-3 w-3" />;
      case 'ai': return <Sparkles className="h-3 w-3" />;
      case 'premium': return <Crown className="h-3 w-3" />;
      case 'featured': return <Star className="h-3 w-3" />;
      case 'gradient': return <Gem className="h-3 w-3" />;
      default: return null;
    }
  };

  const handleAnimationStart = () => {
    setIsAnimating(true);
    onAnimationStart?.();
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
    onAnimationEnd?.();
  };

  const animationStyle = animationDuration ? {
    animationDuration: `${animationDuration}ms`,
    animationTimingFunction: animationEasing || 'ease-in-out',
  } : {};

  const getThumbSize = () => {
    switch (size) {
      case 'xs': return 'h-2 w-2';
      case 'sm': return 'h-3 w-3';
      case 'default': return 'h-5 w-5';
      case 'lg': return 'h-7 w-7';
      case 'xl': return 'h-9 w-9';
      default: return 'h-5 w-5';
    }
  };

  const getThumbTranslate = () => {
    switch (size) {
      case 'xs': return 'data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0';
      case 'sm': return 'data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0';
      case 'default': return 'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0';
      case 'lg': return 'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0';
      case 'xl': return 'data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0';
      default: return 'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0';
    }
  };

  return (
    <SwitchPrimitive.Root
      className={cn(
        toggleVariants({ variant, size, shape, animation, shadow }),
        customClasses,
        className
      )}
      style={{
        ...animationStyle,
        ...customStyles,
      }}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
      {...props}
      ref={ref}
    >
      <SwitchPrimitive.Thumb 
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform',
          getThumbSize(),
          getThumbTranslate()
        )}
      >
        {loading && (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-2 w-2 animate-spin text-atlas-text-tertiary" />
            {loadingText && <span className="ml-1 text-xs">{loadingText}</span>}
          </div>
        )}
        {!loading && showIcon && iconPosition === 'left' && (
          <div className="flex items-center justify-center h-full w-full">
            {getDefaultIcon()}
          </div>
        )}
        {!loading && showIcon && iconPosition === 'right' && (
          <div className="flex items-center justify-center h-full w-full">
            {getDefaultIcon()}
          </div>
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});
Toggle.displayName = SwitchPrimitive.Root.displayName;

// Switch group for multiple related switches
export interface SwitchGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'content'> {
  children: React.ReactNode;
  label?: string;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  infoMessage?: string;
  required?: boolean;
  orientation?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end';
  spacing?: 'tight' | 'normal' | 'loose';
  variant?: 'default' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  shape?: 'rounded' | 'square' | 'pill' | 'none';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring' | 'smooth' | 'fast' | 'slow';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  customStyles?: React.CSSProperties;
  customClasses?: string | undefined;
  ariaLabel?: string;
  ariaDescription?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
}

const SwitchGroup = React.forwardRef<HTMLFieldSetElement, SwitchGroupProps>(
  ({ 
    children, 
    label, 
    description, 
    errorMessage,
    successMessage,
    warningMessage,
    infoMessage,
    required = false, 
    orientation = 'vertical',
    alignment = 'start',
    spacing = 'normal',
    variant = 'default',
    size = 'default',
    shape = 'rounded',
    animation = 'none',
    shadow = 'none',
    customStyles,
    customClasses,
    ariaLabel,
    ariaDescription,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaInvalid,
    ariaRequired,
    className 
  }, ref) => {
    const groupId = React.useId();
    const errorId = `${groupId}-error`;
    const successId = `${groupId}-success`;
    const warningId = `${groupId}-warning`;
    const infoId = `${groupId}-info`;
    const descriptionId = `${groupId}-description`;

    const getSpacingClasses = () => {
      switch (spacing) {
        case 'tight': return 'space-y-1';
        case 'loose': return 'space-y-4';
        default: return 'space-y-2';
      }
    };

    const getAlignmentClasses = () => {
      switch (alignment) {
        case 'center': return 'items-center';
        case 'end': return 'items-end';
        default: return 'items-start';
      }
    };

    return (
      <fieldset 
        ref={ref} 
        className={cn(getSpacingClasses(), className)} 
        style={customStyles}
        aria-describedby={cn(
          description && descriptionId,
          errorMessage && errorId,
          successMessage && successId,
          warningMessage && warningId,
          infoMessage && infoId,
          ariaDescribedBy
        )}
        aria-invalid={ariaInvalid ?? !!errorMessage}
        aria-required={ariaRequired ?? required}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {label && (
          <legend className="text-sm font-medium text-atlas-text-primary">
            {label}
            {required && (
              <span className="ml-1 text-atlas-error-main" aria-label="required">
                *
              </span>
            )}
          </legend>
        )}
        {description && (
          <p
            id={descriptionId}
            className="text-sm text-atlas-text-tertiary"
          >
            {description}
          </p>
        )}
        <div className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2',
          getAlignmentClasses()
        )}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                variant: variant,
                size: size,
                shape: shape,
                animation: animation,
                shadow: shadow,
                customClasses: customClasses,
              } as any);
            }
            return child;
          })}
        </div>
        {errorMessage && (
          <p
            id={errorId}
            className="text-sm text-atlas-error-main"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p
            id={successId}
            className="text-sm text-atlas-success-main"
            role="status"
          >
            {successMessage}
          </p>
        )}
        {warningMessage && (
          <p
            id={warningId}
            className="text-sm text-atlas-warning-main"
            role="alert"
          >
            {warningMessage}
          </p>
        )}
        {infoMessage && (
          <p
            id={infoId}
            className="text-sm text-atlas-info-main"
            role="status"
          >
            {infoMessage}
          </p>
        )}
      </fieldset>
    );
  }
);
SwitchGroup.displayName = 'SwitchGroup';

// Utility Components
const SwitchContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
));
SwitchContainer.displayName = 'SwitchContainer';

const SwitchLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium text-atlas-text-primary cursor-pointer', className)}
    {...props}
  />
));
SwitchLabel.displayName = 'SwitchLabel';

const SwitchDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-text-tertiary', className)}
    {...props}
  />
));
SwitchDescription.displayName = 'SwitchDescription';

const SwitchErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-error-main', className)}
    role="alert"
    {...props}
  />
));
SwitchErrorMessage.displayName = 'SwitchErrorMessage';

const SwitchSuccessMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-success-main', className)}
    role="status"
    {...props}
  />
));
SwitchSuccessMessage.displayName = 'SwitchSuccessMessage';

const SwitchWarningMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-warning-main', className)}
    role="alert"
    {...props}
  />
));
SwitchWarningMessage.displayName = 'SwitchWarningMessage';

const SwitchInfoMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-info-main', className)}
    role="status"
    {...props}
  />
));
SwitchInfoMessage.displayName = 'SwitchInfoMessage';

// Variant Components
const SwitchSuccess = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="success" {...props} />);
SwitchSuccess.displayName = 'SwitchSuccess';

const SwitchWarning = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="warning" {...props} />);
SwitchWarning.displayName = 'SwitchWarning';

const SwitchError = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="error" {...props} />);
SwitchError.displayName = 'SwitchError';

const SwitchInfo = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="info" {...props} />);
SwitchInfo.displayName = 'SwitchInfo';

const SwitchAI = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="ai" {...props} />);
SwitchAI.displayName = 'SwitchAI';

const SwitchPrimary = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="default" {...props} />);
SwitchPrimary.displayName = 'SwitchPrimary';

const SwitchSecondary = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="secondary" {...props} />);
SwitchSecondary.displayName = 'SwitchSecondary';

const SwitchGlass = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="glass" {...props} />);
SwitchGlass.displayName = 'SwitchGlass';

const SwitchGradient = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="gradient" {...props} />);
SwitchGradient.displayName = 'SwitchGradient';

const SwitchMinimal = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="minimal" {...props} />);
SwitchMinimal.displayName = 'SwitchMinimal';

const SwitchPremium = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="premium" {...props} />);
SwitchPremium.displayName = 'SwitchPremium';

const SwitchFeatured = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="featured" {...props} />);
SwitchFeatured.displayName = 'SwitchFeatured';

const SwitchCompact = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="compact" {...props} />);
SwitchCompact.displayName = 'SwitchCompact';

const SwitchSpacious = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} variant="spacious" {...props} />);
SwitchSpacious.displayName = 'SwitchSpacious';

// Size Components
const SwitchSmall = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} size="sm" {...props} />);
SwitchSmall.displayName = 'SwitchSmall';

const SwitchLarge = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} size="lg" {...props} />);
SwitchLarge.displayName = 'SwitchLarge';

const SwitchExtraSmall = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} size="xs" {...props} />);
SwitchExtraSmall.displayName = 'SwitchExtraSmall';

const SwitchExtraLarge = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Switch ref={ref} size="xl" {...props} />);
SwitchExtraLarge.displayName = 'SwitchExtraLarge';

// Switch Management Hook
const useSwitch = () => {
  const [checked, setChecked] = React.useState<boolean>(false);

  const handleCheckedChange = React.useCallback((newChecked: boolean) => {
    setChecked(newChecked);
  }, []);

  return {
    checked,
    setChecked,
    onCheckedChange: handleCheckedChange,
  };
};

// Switch Sizes
const SwitchSizes = {
  xs: 'h-3 w-6',
  sm: 'h-4 w-7',
  default: 'h-6 w-11',
  lg: 'h-8 w-14',
  xl: 'h-10 w-18',
} as const;

// Switch Variants
const SwitchVariants = {
  default: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
  secondary: 'data-[state=checked]:bg-atlas-secondary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-secondary-main',
  ai: 'data-[state=checked]:bg-atlas-ai-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-ai-main',
  success: 'data-[state=checked]:bg-atlas-success-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-success-main',
  error: 'data-[state=checked]:bg-atlas-error-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-error-main',
  warning: 'data-[state=checked]:bg-atlas-warning-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-warning-main',
  info: 'data-[state=checked]:bg-atlas-info-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-info-main',
  muted: 'data-[state=checked]:bg-atlas-text-tertiary data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-text-tertiary',
  glass: 'data-[state=checked]:bg-atlas-primary-main/80 data-[state=unchecked]:bg-atlas-border/20 backdrop-blur-sm focus-visible:ring-atlas-primary-main',
  gradient: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-secondary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
  minimal: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-transparent hover:bg-atlas-background-secondary focus-visible:ring-atlas-primary-main',
  premium: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main/80 data-[state=checked]:to-atlas-secondary-main/80 data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
  featured: 'data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-secondary-main/80 data-[state=checked]:to-atlas-ai-main/80 data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-secondary-main',
  compact: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
  spacious: 'data-[state=checked]:bg-atlas-primary-main data-[state=unchecked]:bg-atlas-border focus-visible:ring-atlas-primary-main',
} as const;

export {
  Switch,
  SwitchField,
  Toggle,
  SwitchGroup,
  switchVariants,
  toggleVariants,
  // Utility Components
  SwitchContainer,
  SwitchLabel,
  SwitchDescription,
  SwitchErrorMessage,
  SwitchSuccessMessage,
  SwitchWarningMessage,
  SwitchInfoMessage,
  // Variant Components
  SwitchSuccess,
  SwitchWarning,
  SwitchError,
  SwitchInfo,
  SwitchAI,
  SwitchPrimary,
  SwitchSecondary,
  SwitchGlass,
  SwitchGradient,
  SwitchMinimal,
  SwitchPremium,
  SwitchFeatured,
  SwitchCompact,
  SwitchSpacious,
  // Size Components
  SwitchSmall,
  SwitchLarge,
  SwitchExtraSmall,
  SwitchExtraLarge,
  // Hooks and Utilities
  useSwitch,
  SwitchSizes,
  SwitchVariants,
};
