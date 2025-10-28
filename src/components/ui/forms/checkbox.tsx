import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { 
  Check, 
  Minus, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Sparkles,
  Star,
  Heart,
  Shield,
  Zap,
  Crown,
  Gem,
  Award,
  Trophy
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const checkboxVariants = cva(
  'peer shrink-0 border ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg text-atlas-text-primary focus-visible:ring-atlas-primary-main data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main',
        error: 'border-atlas-error-main bg-atlas-error-bg text-atlas-error-main focus-visible:ring-atlas-error-main data-[state=checked]:bg-atlas-error-main data-[state=checked]:text-white data-[state=checked]:border-atlas-error-main',
        success: 'border-atlas-success-main bg-atlas-success-bg text-atlas-success-main focus-visible:ring-atlas-success-main data-[state=checked]:bg-atlas-success-main data-[state=checked]:text-white data-[state=checked]:border-atlas-success-main',
        warning: 'border-atlas-warning-main bg-atlas-warning-bg text-atlas-warning-main focus-visible:ring-atlas-warning-main data-[state=checked]:bg-atlas-warning-main data-[state=checked]:text-white data-[state=checked]:border-atlas-warning-main',
        info: 'border-atlas-info-main bg-atlas-info-bg text-atlas-info-main focus-visible:ring-atlas-info-main data-[state=checked]:bg-atlas-info-main data-[state=checked]:text-white data-[state=checked]:border-atlas-info-main',
        ai: 'border-atlas-ai-main bg-atlas-ai-main/10 text-atlas-ai-main focus-visible:ring-atlas-ai-main data-[state=checked]:bg-atlas-ai-main data-[state=checked]:text-white data-[state=checked]:border-atlas-ai-main',
        primary: 'border-atlas-primary-main bg-atlas-primary-main/10 text-atlas-primary-main focus-visible:ring-atlas-primary-main data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main',
        secondary: 'border-atlas-secondary-main bg-atlas-secondary-main/10 text-atlas-secondary-main focus-visible:ring-atlas-secondary-main data-[state=checked]:bg-atlas-secondary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-secondary-main',
        glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white focus-visible:ring-white/50 data-[state=checked]:bg-white/20 data-[state=checked]:text-white data-[state=checked]:border-white/30',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent focus-visible:ring-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-secondary-main data-[state=checked]:text-white',
        minimal: 'bg-transparent border-atlas-border shadow-none focus-visible:ring-atlas-primary-main data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main',
        premium: 'bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent focus-visible:ring-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-warning-main data-[state=checked]:to-atlas-success-main data-[state=checked]:text-white',
        featured: 'bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent focus-visible:ring-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-ai-main data-[state=checked]:text-white',
        compact: 'bg-atlas-text-primary/90 text-atlas-background border-transparent focus-visible:ring-atlas-background/50 data-[state=checked]:bg-atlas-background data-[state=checked]:text-atlas-text-primary',
        spacious: 'bg-atlas-text-primary/70 text-atlas-background border-transparent focus-visible:ring-atlas-background/50 data-[state=checked]:bg-atlas-background data-[state=checked]:text-atlas-text-primary',
      },
      size: {
        xs: 'h-3 w-3 rounded-sm',
        sm: 'h-3.5 w-3.5 rounded-sm',
        default: 'h-4 w-4 rounded-sm',
        lg: 'h-5 w-5 rounded-md',
        xl: 'h-6 w-6 rounded-md',
      },
      shape: {
        square: 'rounded-sm',
        rounded: 'rounded-md',
        circle: 'rounded-full',
        none: 'rounded-none',
      },
      animation: {
        none: '',
        fade: 'animate-in fade-in-0',
        slide: 'animate-in slide-in-from-left-1',
        scale: 'animate-in zoom-in-95',
        bounce: 'animate-in bounce-in-0',
        spring: 'animate-in spring-in-0',
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        default: 'shadow',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        glow: 'shadow-lg shadow-atlas-primary-main/25',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      shape: 'square',
      animation: 'none',
      shadow: 'none',
    },
  }
);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'> &
    VariantProps<typeof checkboxVariants> & {
      loading?: boolean;
      loadingText?: string | undefined;
      indeterminate?: boolean;
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
  indeterminate = false,
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
  
  const getDefaultIcon = React.useCallback((variant: string) => {
    switch (variant) {
      case 'success': return <CheckCircle className="h-3 w-3" />;
      case 'error': return <AlertCircle className="h-3 w-3" />;
      case 'warning': return <AlertCircle className="h-3 w-3" />;
      case 'info': return <Info className="h-3 w-3" />;
      case 'ai': return <Sparkles className="h-3 w-3" />;
      case 'premium': return <Crown className="h-3 w-3" />;
      case 'featured': return <Star className="h-3 w-3" />;
      case 'compact': return <Heart className="h-3 w-3" />;
      case 'spacious': return <Shield className="h-3 w-3" />;
      default: return <Check className="h-3 w-3" />;
    }
  }, []);

  const handleAnimationStart = React.useCallback(() => {
    setIsAnimating(true);
    onAnimationStart?.();
  }, [onAnimationStart]);

  const handleAnimationEnd = React.useCallback(() => {
    setIsAnimating(false);
    onAnimationEnd?.();
  }, [onAnimationEnd]);

  const animationStyle = React.useMemo(() => ({
    animationDuration: animationDuration ? `${animationDuration}ms` : undefined,
    animationTimingFunction: animationEasing,
    ...customStyles,
  }), [animationDuration, animationEasing, customStyles]);

  return (
    <div className={cn("relative inline-flex items-center", customClasses)}>
      {showIcon && iconPosition === 'left' && (
        <span className="mr-2 flex-shrink-0" aria-hidden="true">
          {icon || getDefaultIcon(variant || 'default')}
        </span>
      )}
      
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(checkboxVariants({ variant, size, shape, animation, shadow, className }))}
        disabled={loading || props.disabled}
        onAnimationStart={handleAnimationStart}
        onAnimationEnd={handleAnimationEnd}
        style={animationStyle}
        {...props}
      >
        <CheckboxPrimitive.Indicator className={cn(
          'flex items-center justify-center text-current',
          loading && 'opacity-0'
        )}>
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : indeterminate ? (
            <Minus className="h-3 w-3" />
          ) : (
            <Check className="h-3 w-3" />
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      
      {showIcon && iconPosition === 'right' && (
        <span className="ml-2 flex-shrink-0" aria-hidden="true">
          {icon || getDefaultIcon(variant || 'default')}
        </span>
      )}
      
      {loading && loadingText && (
        <span className="ml-2 text-sm text-atlas-text-secondary">
          {loadingText}
        </span>
      )}
    </div>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

// Enhanced Checkbox with label and description
export interface CheckboxFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
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
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info' | 'ai' | 'primary' | 'secondary' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  shape?: 'square' | 'rounded' | 'circle' | 'none';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  loading?: boolean;
  loadingText?: string;
  indeterminate?: boolean;
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  orientation?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end';
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
  customStyles?: React.CSSProperties;
  customClasses?: string | undefined;
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  ariaLabel?: string;
  ariaDescription?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
}

const CheckboxField = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxFieldProps
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
  shape = 'square',
  animation = 'none',
  shadow = 'none',
  loading = false,
  loadingText,
  indeterminate = false,
  icon,
  showIcon = false,
  iconPosition = 'left',
  orientation = 'vertical',
  alignment = 'start',
  spacing = 'normal',
  className,
  customStyles,
  customClasses,
  animationDuration,
  animationEasing,
  onAnimationStart,
  onAnimationEnd,
  ariaLabel,
  ariaDescription,
  ariaLabelledBy,
  ariaDescribedBy,
  role,
  ...props
}, ref) => {
  const checkboxId = id || React.useId();
  const errorId = `${checkboxId}-error`;
  const successId = `${checkboxId}-success`;
  const warningId = `${checkboxId}-warning`;
  const infoId = `${checkboxId}-info`;
  const descriptionId = `${checkboxId}-description`;
  
  const actualVariant = errorMessage ? 'error' : 
                       successMessage ? 'success' : 
                       warningMessage ? 'warning' : 
                       infoMessage ? 'info' : variant;

  const getSpacingClasses = (spacing: string) => {
    switch (spacing) {
      case 'tight': return 'space-y-1';
      case 'loose': return 'space-y-4';
      default: return 'space-y-2';
    }
  };

  const getAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      default: return 'items-start';
    }
  };

  return (
    <div 
      className={cn(
        getSpacingClasses(spacing),
        orientation === 'horizontal' ? 'flex items-center space-x-3 space-y-0' : '',
        className
      )}
      style={customStyles}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={cn(
        description && descriptionId,
        errorMessage && errorId,
        successMessage && successId,
        warningMessage && warningId,
        infoMessage && infoId,
        ariaDescribedBy
      )}
      {...props}
    >
      <div className={cn(
        "flex",
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        getAlignmentClasses(alignment),
        orientation === 'vertical' && 'space-y-2'
      )}>
        <Checkbox
          ref={ref}
          id={checkboxId}
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
          indeterminate={indeterminate}
          icon={icon}
          showIcon={showIcon}
          iconPosition={iconPosition}
          animationDuration={animationDuration || undefined}
          animationEasing={animationEasing}
          onAnimationStart={onAnimationStart || undefined}
          onAnimationEnd={onAnimationEnd || undefined}
          customStyles={customStyles || undefined}
          customClasses={customClasses}
          aria-describedby={cn(
            description && descriptionId,
            errorMessage && errorId,
            successMessage && successId,
            warningMessage && warningId,
            infoMessage && infoId,
            ariaDescribedBy
          )}
          aria-invalid={!!errorMessage}
          aria-labelledby={ariaLabelledBy}
        />
        
        <div className={cn(
          "flex-1",
          orientation === 'horizontal' ? 'ml-3' : ''
        )}>
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium cursor-pointer",
                disabled ? 'text-atlas-text-tertiary cursor-not-allowed' : 'text-atlas-text-primary'
              )}
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
              className="text-sm text-atlas-text-tertiary mt-1"
            >
              {description}
            </p>
          )}
          
          {errorMessage && (
            <p
              id={errorId}
              className="text-sm text-atlas-error-main mt-1"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
          
          {successMessage && (
            <p
              id={successId}
              className="text-sm text-atlas-success-main mt-1"
              role="status"
            >
              {successMessage}
            </p>
          )}
          
          {warningMessage && (
            <p
              id={warningId}
              className="text-sm text-atlas-warning-main mt-1"
              role="alert"
            >
              {warningMessage}
            </p>
          )}
          
          {infoMessage && (
            <p
              id={infoId}
              className="text-sm text-atlas-info-main mt-1"
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
CheckboxField.displayName = 'CheckboxField';

// Checkbox group
export interface CheckboxGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'content'> {
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
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info' | 'ai' | 'primary' | 'secondary' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  shape?: 'square' | 'rounded' | 'circle' | 'none';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  className?: string;
  customStyles?: React.CSSProperties;
  customClasses?: string | undefined;
  ariaLabel?: string;
  ariaDescription?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: string;
}

const CheckboxGroup = React.forwardRef<HTMLFieldSetElement, CheckboxGroupProps>(
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
    shape = 'square',
    animation = 'none',
    shadow = 'none',
    className,
    customStyles,
    customClasses,
    ariaLabel,
    ariaDescription,
    ariaLabelledBy,
    ariaDescribedBy,
    role,
    ...props
  }, ref) => {
    const groupId = React.useId();
    const errorId = `${groupId}-error`;
    const successId = `${groupId}-success`;
    const warningId = `${groupId}-warning`;
    const infoId = `${groupId}-info`;
    const descriptionId = `${groupId}-description`;

    const getSpacingClasses = (spacing: string) => {
      switch (spacing) {
        case 'tight': return 'space-y-1';
        case 'loose': return 'space-y-4';
        default: return 'space-y-3';
      }
    };

    const getAlignmentClasses = (alignment: string) => {
      switch (alignment) {
        case 'center': return 'items-center';
        case 'end': return 'items-end';
        default: return 'items-start';
      }
    };

    return (
      <fieldset 
        ref={ref} 
        className={cn(
          getSpacingClasses(spacing),
          className
        )}
        style={customStyles}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={cn(
          description && descriptionId,
          errorMessage && errorId,
          successMessage && successId,
          warningMessage && warningId,
          infoMessage && infoId,
          ariaDescribedBy
        )}
        aria-labelledby={ariaLabelledBy}
        {...props}
      >
        {label && (
          <legend className={cn(
            "text-sm font-medium",
            errorMessage ? 'text-atlas-error-main' :
            successMessage ? 'text-atlas-success-main' :
            warningMessage ? 'text-atlas-warning-main' :
            infoMessage ? 'text-atlas-info-main' :
            'text-atlas-text-primary'
          )}>
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
          "space-y-2",
          orientation === 'horizontal' ? 'flex flex-wrap gap-4 space-y-0' : '',
          getAlignmentClasses(alignment)
        )}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                variant: variant,
                size: size,
                shape: shape,
                animation: animation,
                shadow: shadow,
                ...child.props
              });
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
CheckboxGroup.displayName = 'CheckboxGroup';

// Checkbox Utility Components
const CheckboxContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical';
    alignment?: 'start' | 'center' | 'end';
    spacing?: 'tight' | 'normal' | 'loose';
  }
>(({ className, orientation = 'vertical', alignment = 'start', spacing = 'normal', ...props }, ref) => {
  const getSpacingClasses = (spacing: string) => {
    switch (spacing) {
      case 'tight': return 'space-y-1';
      case 'loose': return 'space-y-4';
      default: return 'space-y-2';
    }
  };

  const getAlignmentClasses = (alignment: string) => {
    switch (alignment) {
      case 'center': return 'items-center';
      case 'end': return 'items-end';
      default: return 'items-start';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        getSpacingClasses(spacing),
        orientation === 'horizontal' ? 'flex flex-wrap gap-4 space-y-0' : '',
        getAlignmentClasses(alignment),
        className
      )}
      {...props}
    />
  );
});
CheckboxContainer.displayName = 'CheckboxContainer';

const CheckboxLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean;
    disabled?: boolean;
  }
>(({ className, required = false, disabled = false, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium cursor-pointer",
      disabled ? 'text-atlas-text-tertiary cursor-not-allowed' : 'text-atlas-text-primary',
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-1 text-atlas-error-main" aria-label="required">
        *
      </span>
    )}
  </label>
));
CheckboxLabel.displayName = 'CheckboxLabel';

const CheckboxDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-atlas-text-tertiary", className)}
    {...props}
  />
));
CheckboxDescription.displayName = 'CheckboxDescription';

const CheckboxErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-atlas-error-main", className)}
    role="alert"
    {...props}
  />
));
CheckboxErrorMessage.displayName = 'CheckboxErrorMessage';

const CheckboxSuccessMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-atlas-success-main", className)}
    role="status"
    {...props}
  />
));
CheckboxSuccessMessage.displayName = 'CheckboxSuccessMessage';

const CheckboxWarningMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-atlas-warning-main", className)}
    role="alert"
    {...props}
  />
));
CheckboxWarningMessage.displayName = 'CheckboxWarningMessage';

const CheckboxInfoMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-atlas-info-main", className)}
    role="status"
    {...props}
  />
));
CheckboxInfoMessage.displayName = 'CheckboxInfoMessage';

// Checkbox Variant Components
const CheckboxSuccess = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="success" {...props} />);
CheckboxSuccess.displayName = 'CheckboxSuccess';

const CheckboxWarning = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="warning" {...props} />);
CheckboxWarning.displayName = 'CheckboxWarning';

const CheckboxError = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="error" {...props} />);
CheckboxError.displayName = 'CheckboxError';

const CheckboxInfo = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="info" {...props} />);
CheckboxInfo.displayName = 'CheckboxInfo';

const CheckboxAI = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="ai" {...props} />);
CheckboxAI.displayName = 'CheckboxAI';

const CheckboxPrimary = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="primary" {...props} />);
CheckboxPrimary.displayName = 'CheckboxPrimary';

const CheckboxSecondary = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="secondary" {...props} />);
CheckboxSecondary.displayName = 'CheckboxSecondary';

const CheckboxGlass = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="glass" {...props} />);
CheckboxGlass.displayName = 'CheckboxGlass';

const CheckboxGradient = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="gradient" {...props} />);
CheckboxGradient.displayName = 'CheckboxGradient';

const CheckboxMinimal = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="minimal" {...props} />);
CheckboxMinimal.displayName = 'CheckboxMinimal';

const CheckboxPremium = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="premium" {...props} />);
CheckboxPremium.displayName = 'CheckboxPremium';

const CheckboxFeatured = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="featured" {...props} />);
CheckboxFeatured.displayName = 'CheckboxFeatured';

const CheckboxCompact = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="compact" {...props} />);
CheckboxCompact.displayName = 'CheckboxCompact';

const CheckboxSpacious = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} variant="spacious" {...props} />);
CheckboxSpacious.displayName = 'CheckboxSpacious';

// Checkbox Size Components
const CheckboxSmall = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} size="sm" {...props} />);
CheckboxSmall.displayName = 'CheckboxSmall';

const CheckboxLarge = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} size="lg" {...props} />);
CheckboxLarge.displayName = 'CheckboxLarge';

const CheckboxExtraSmall = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} size="xs" {...props} />);
CheckboxExtraSmall.displayName = 'CheckboxExtraSmall';

const CheckboxExtraLarge = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <Checkbox ref={ref} size="xl" {...props} />);
CheckboxExtraLarge.displayName = 'CheckboxExtraLarge';

// Checkbox Management Hook
const useCheckbox = () => {
  const [checked, setChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(false);
  
  const toggle = React.useCallback(() => setChecked(prev => !prev), []);
  const setCheckedValue = React.useCallback((value: boolean) => setChecked(value), []);
  const setIndeterminateValue = React.useCallback((value: boolean) => setIndeterminate(value), []);
  
  return {
    checked,
    indeterminate,
    toggle,
    setChecked: setCheckedValue,
    setIndeterminate: setIndeterminateValue
  };
};

// Checkbox Utilities
const CheckboxSizes = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6"
} as const;

const CheckboxVariants = {
  default: "border-atlas-border bg-atlas-card-bg text-atlas-text-primary focus-visible:ring-atlas-primary-main data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main",
  error: "border-atlas-error-main bg-atlas-error-bg text-atlas-error-main focus-visible:ring-atlas-error-main data-[state=checked]:bg-atlas-error-main data-[state=checked]:text-white data-[state=checked]:border-atlas-error-main",
  success: "border-atlas-success-main bg-atlas-success-bg text-atlas-success-main focus-visible:ring-atlas-success-main data-[state=checked]:bg-atlas-success-main data-[state=checked]:text-white data-[state=checked]:border-atlas-success-main",
  warning: "border-atlas-warning-main bg-atlas-warning-bg text-atlas-warning-main focus-visible:ring-atlas-warning-main data-[state=checked]:bg-atlas-warning-main data-[state=checked]:text-white data-[state=checked]:border-atlas-warning-main",
  info: "border-atlas-info-main bg-atlas-info-bg text-atlas-info-main focus-visible:ring-atlas-info-main data-[state=checked]:bg-atlas-info-main data-[state=checked]:text-white data-[state=checked]:border-atlas-info-main",
  ai: "border-atlas-ai-main bg-atlas-ai-main/10 text-atlas-ai-main focus-visible:ring-atlas-ai-main data-[state=checked]:bg-atlas-ai-main data-[state=checked]:text-white data-[state=checked]:border-atlas-ai-main",
  primary: "border-atlas-primary-main bg-atlas-primary-main/10 text-atlas-primary-main focus-visible:ring-atlas-primary-main data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main",
  secondary: "border-atlas-secondary-main bg-atlas-secondary-main/10 text-atlas-secondary-main focus-visible:ring-atlas-secondary-main data-[state=checked]:bg-atlas-secondary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-secondary-main",
  glass: "bg-white/10 backdrop-blur-md border-white/20 text-white focus-visible:ring-white/50 data-[state=checked]:bg-white/20 data-[state=checked]:text-white data-[state=checked]:border-white/30",
  gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent focus-visible:ring-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-secondary-main data-[state=checked]:text-white",
  minimal: "bg-transparent border-atlas-border shadow-none focus-visible:ring-atlas-primary-main data-[state=checked]:bg-atlas-primary-main data-[state=checked]:text-white data-[state=checked]:border-atlas-primary-main",
  premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent focus-visible:ring-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-warning-main data-[state=checked]:to-atlas-success-main data-[state=checked]:text-white",
  featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent focus-visible:ring-white/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-atlas-primary-main data-[state=checked]:to-atlas-ai-main data-[state=checked]:text-white",
  compact: "bg-atlas-text-primary/90 text-atlas-background border-transparent focus-visible:ring-atlas-background/50 data-[state=checked]:bg-atlas-background data-[state=checked]:text-atlas-text-primary",
  spacious: "bg-atlas-text-primary/70 text-atlas-background border-transparent focus-visible:ring-atlas-background/50 data-[state=checked]:bg-atlas-background data-[state=checked]:text-atlas-text-primary"
} as const;

export { 
  Checkbox, 
  CheckboxField, 
  CheckboxGroup, 
  checkboxVariants,
  CheckboxContainer,
  CheckboxLabel,
  CheckboxDescription,
  CheckboxErrorMessage,
  CheckboxSuccessMessage,
  CheckboxWarningMessage,
  CheckboxInfoMessage,
  CheckboxSuccess,
  CheckboxWarning,
  CheckboxError,
  CheckboxInfo,
  CheckboxAI,
  CheckboxPrimary,
  CheckboxSecondary,
  CheckboxGlass,
  CheckboxGradient,
  CheckboxMinimal,
  CheckboxPremium,
  CheckboxFeatured,
  CheckboxCompact,
  CheckboxSpacious,
  CheckboxSmall,
  CheckboxLarge,
  CheckboxExtraSmall,
  CheckboxExtraLarge,
  useCheckbox,
  CheckboxSizes,
  CheckboxVariants,
};
