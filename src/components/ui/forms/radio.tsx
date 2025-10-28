import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle, Loader2, AlertCircle, CheckCircle, Info, Sparkles, Star, Heart, Shield, Zap, Crown, Gem, Award, Trophy } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const radioVariants = cva(
  'aspect-square rounded-full border ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out',
  {
    variants: {
      variant: {
        default: 'border-atlas-border text-atlas-primary-main focus-visible:ring-atlas-primary-main',
        secondary: 'border-atlas-secondary-main text-atlas-secondary-main focus-visible:ring-atlas-secondary-main',
        ai: 'border-atlas-ai-main text-atlas-ai-main focus-visible:ring-atlas-ai-main',
        success: 'border-atlas-success-main text-atlas-success-main focus-visible:ring-atlas-success-main',
        error: 'border-atlas-error-main text-atlas-error-main focus-visible:ring-atlas-error-main',
        warning: 'border-atlas-warning-main text-atlas-warning-main focus-visible:ring-atlas-warning-main',
        info: 'border-atlas-info-main text-atlas-info-main focus-visible:ring-atlas-info-main',
        muted: 'border-atlas-border text-atlas-text-tertiary focus-visible:ring-atlas-text-tertiary',
        glass: 'border-atlas-border/20 bg-atlas-background/10 backdrop-blur-sm text-atlas-primary-main focus-visible:ring-atlas-primary-main',
        gradient: 'border-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white focus-visible:ring-atlas-primary-main',
        minimal: 'border-transparent text-atlas-primary-main focus-visible:ring-atlas-primary-main hover:bg-atlas-background-secondary',
        premium: 'border-atlas-primary-main/50 bg-gradient-to-r from-atlas-primary-main/10 to-atlas-secondary-main/10 text-atlas-primary-main focus-visible:ring-atlas-primary-main',
        featured: 'border-atlas-secondary-main/50 bg-gradient-to-r from-atlas-secondary-main/10 to-atlas-ai-main/10 text-atlas-secondary-main focus-visible:ring-atlas-secondary-main',
        compact: 'border-atlas-border text-atlas-primary-main focus-visible:ring-atlas-primary-main',
        spacious: 'border-atlas-border text-atlas-primary-main focus-visible:ring-atlas-primary-main',
      },
      size: {
        xs: 'h-3 w-3',
        sm: 'h-3.5 w-3.5',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
        xl: 'h-6 w-6',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-sm',
        rounded: 'rounded-md',
        none: 'rounded-none',
      },
      animation: {
        none: '',
        fade: 'animate-fade-in',
        slide: 'animate-slide-in',
        scale: 'animate-scale-in',
        bounce: 'animate-bounce-in',
        spring: 'animate-spring-in',
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
      shape: 'circle',
      animation: 'none',
      shadow: 'none',
    },
  }
);

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn('grid gap-2', className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'> & 
    VariantProps<typeof radioVariants> & {
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
      default: return <Circle className="h-2.5 w-2.5 fill-current text-current" />;
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

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        radioVariants({ variant, size, shape, animation, shadow }),
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
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {loading ? (
          <div className="flex items-center space-x-1">
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
            {loadingText && <span className="text-xs">{loadingText}</span>}
          </div>
        ) : (
          <>
            {showIcon && iconPosition === 'left' && (
              <span className="mr-1" aria-hidden="true">
                {getDefaultIcon()}
              </span>
            )}
            <Circle className="h-2.5 w-2.5 fill-current text-current" />
            {showIcon && iconPosition === 'right' && (
              <span className="ml-1" aria-hidden="true">
                {getDefaultIcon()}
              </span>
            )}
          </>
        )}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

// Enhanced Radio with label and description
export interface RadioFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  id?: string;
  value: string;
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
  shape?: 'circle' | 'square' | 'rounded' | 'none';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
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

const RadioField = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioFieldProps
>(({
  id,
  value,
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
  shape = 'circle',
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
  const radioId = id || React.useId();
  const errorId = `${radioId}-error`;
  const successId = `${radioId}-success`;
  const warningId = `${radioId}-warning`;
  const infoId = `${radioId}-info`;
  const descriptionId = `${radioId}-description`;
  
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
        <RadioGroupItem
          ref={ref}
          id={radioId}
          value={value}
          disabled={disabled}
          required={required}
          variant={actualVariant}
          size={size}
          shape={shape}
          animation={animation}
          shadow={shadow}
          loading={loading}
          loadingText={loadingText}
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
              htmlFor={radioId}
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
RadioField.displayName = 'RadioField';

// Radio group with enhanced features
export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  loading?: boolean;
  separator?: boolean;
}

export interface RadioGroup {
  label: string;
  options: RadioOption[];
  disabled?: boolean;
  separator?: boolean;
}

export interface EnhancedRadioGroupProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'content'> {
  options?: RadioOption[];
  groups?: RadioGroup[];
  value?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: string;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  infoMessage?: string;
  required?: boolean;
  variant?: 'default' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  shape?: 'circle' | 'square' | 'rounded' | 'none';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  orientation?: 'horizontal' | 'vertical';
  alignment?: 'start' | 'center' | 'end';
  spacing?: 'tight' | 'normal' | 'loose';
  loading?: boolean;
  emptyMessage?: string;
  maxHeight?: string;
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

const EnhancedRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  EnhancedRadioGroupProps
>(({
  options = [],
  groups = [],
  value,
  onValueChange,
  name,
  label,
  description,
  errorMessage,
  successMessage,
  warningMessage,
  infoMessage,
  required = false,
  variant = 'default',
  size = 'default',
  shape = 'circle',
  animation = 'none',
  shadow = 'none',
  orientation = 'vertical',
  alignment = 'start',
  spacing = 'normal',
  loading = false,
  emptyMessage = 'No options available',
  maxHeight,
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
  const groupId = React.useId();
  const errorId = `${groupId}-error`;
  const successId = `${groupId}-success`;
  const warningId = `${groupId}-warning`;
  const infoId = `${groupId}-info`;
  const descriptionId = `${groupId}-description`;
  
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

  const getDefaultIcon = (optionVariant?: string) => {
    switch (optionVariant) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'ai': return <Sparkles className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'featured': return <Star className="h-4 w-4" />;
      case 'gradient': return <Gem className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderOptions = () => {
    if (groups.length > 0) {
      return groups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-2">
          {group.label && (
            <div className="text-sm font-medium text-atlas-text-secondary border-b border-atlas-border pb-1">
              {group.label}
            </div>
          )}
          <div className={cn('space-y-2', group.disabled && 'opacity-50')}>
            {group.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3">
                <RadioGroupItem
                  value={option.value}
                  disabled={option.disabled || group.disabled}
                  variant={actualVariant}
                  size={size}
                  shape={shape}
                  animation={animation}
                  shadow={shadow}
                  loading={option.loading}
                  loadingText={option.loading ? 'Loading...' : undefined}
                  icon={option.icon || getDefaultIcon(option.badgeVariant)}
                  showIcon={!!(option.icon || getDefaultIcon(option.badgeVariant))}
                  iconPosition="left"
                  animationDuration={animationDuration}
                  animationEasing={animationEasing}
                  onAnimationStart={onAnimationStart}
                  onAnimationEnd={onAnimationEnd}
                  customStyles={customStyles}
                  customClasses={customClasses}
                  id={`${groupId}-${option.value}`}
                />
                <div className="flex-1 space-y-1">
                  <label
                    htmlFor={`${groupId}-${option.value}`}
                    className={cn(
                      'text-sm font-medium cursor-pointer flex items-center space-x-2',
                      (option.disabled || group.disabled) ? 'text-atlas-text-tertiary cursor-not-allowed' : 'text-atlas-text-primary'
                    )}
                  >
                    <span>{option.label}</span>
                    {option.badge && (
                      <span className={cn(
                        'px-2 py-0.5 text-xs rounded-full',
                        option.badgeVariant === 'success' && 'bg-atlas-success-main/10 text-atlas-success-main',
                        option.badgeVariant === 'error' && 'bg-atlas-error-main/10 text-atlas-error-main',
                        option.badgeVariant === 'warning' && 'bg-atlas-warning-main/10 text-atlas-warning-main',
                        option.badgeVariant === 'info' && 'bg-atlas-info-main/10 text-atlas-info-main',
                        option.badgeVariant === 'ai' && 'bg-atlas-ai-main/10 text-atlas-ai-main',
                        !option.badgeVariant && 'bg-atlas-background-secondary text-atlas-text-secondary'
                      )}>
                        {option.badge}
                      </span>
                    )}
                  </label>
                  {option.description && (
                    <p className="text-sm text-atlas-text-tertiary">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {group.separator && groupIndex < groups.length - 1 && (
            <div className="border-t border-atlas-border my-4" />
          )}
        </div>
      ));
    }

    if (options.length === 0) {
      return (
        <div className="text-center py-8 text-atlas-text-tertiary">
          {emptyMessage}
        </div>
      );
    }

    return options.map((option) => (
      <div key={option.value} className="flex items-start space-x-3">
        <RadioGroupItem
          value={option.value}
          disabled={option.disabled}
          variant={actualVariant}
          size={size}
          shape={shape}
          animation={animation}
          shadow={shadow}
          loading={option.loading}
          loadingText={option.loading ? 'Loading...' : undefined}
          icon={option.icon || getDefaultIcon(option.badgeVariant)}
          showIcon={!!(option.icon || getDefaultIcon(option.badgeVariant))}
          iconPosition="left"
          animationDuration={animationDuration}
          animationEasing={animationEasing}
          onAnimationStart={onAnimationStart}
          onAnimationEnd={onAnimationEnd}
          customStyles={customStyles}
          customClasses={customClasses}
          id={`${groupId}-${option.value}`}
        />
        <div className="flex-1 space-y-1">
          <label
            htmlFor={`${groupId}-${option.value}`}
            className={cn(
              'text-sm font-medium cursor-pointer flex items-center space-x-2',
              option.disabled ? 'text-atlas-text-tertiary cursor-not-allowed' : 'text-atlas-text-primary'
            )}
          >
            <span>{option.label}</span>
            {option.badge && (
              <span className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                option.badgeVariant === 'success' && 'bg-atlas-success-main/10 text-atlas-success-main',
                option.badgeVariant === 'error' && 'bg-atlas-error-main/10 text-atlas-error-main',
                option.badgeVariant === 'warning' && 'bg-atlas-warning-main/10 text-atlas-warning-main',
                option.badgeVariant === 'info' && 'bg-atlas-info-main/10 text-atlas-info-main',
                option.badgeVariant === 'ai' && 'bg-atlas-ai-main/10 text-atlas-ai-main',
                !option.badgeVariant && 'bg-atlas-background-secondary text-atlas-text-secondary'
              )}>
                {option.badge}
              </span>
            )}
          </label>
          {option.description && (
            <p className="text-sm text-atlas-text-tertiary">
              {option.description}
            </p>
          )}
        </div>
      </div>
    ));
  };

  return (
    <fieldset className={cn(getSpacingClasses(), className)} {...props}>
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
      
      <RadioGroup
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        name={name}
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
        className={cn(
          orientation === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2',
          getAlignmentClasses()
        )}
        style={{
          maxHeight,
          ...customStyles,
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-atlas-text-tertiary" />
            <span className="ml-2 text-atlas-text-tertiary">Loading options...</span>
          </div>
        ) : (
          renderOptions()
        )}
      </RadioGroup>
      
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
});
EnhancedRadioGroup.displayName = 'EnhancedRadioGroup';

// Utility Components
const RadioContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('space-y-2', className)}
    {...props}
  />
));
RadioContainer.displayName = 'RadioContainer';

const RadioLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('text-sm font-medium text-atlas-text-primary cursor-pointer', className)}
    {...props}
  />
));
RadioLabel.displayName = 'RadioLabel';

const RadioDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-text-tertiary', className)}
    {...props}
  />
));
RadioDescription.displayName = 'RadioDescription';

const RadioErrorMessage = React.forwardRef<
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
RadioErrorMessage.displayName = 'RadioErrorMessage';

const RadioSuccessMessage = React.forwardRef<
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
RadioSuccessMessage.displayName = 'RadioSuccessMessage';

const RadioWarningMessage = React.forwardRef<
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
RadioWarningMessage.displayName = 'RadioWarningMessage';

const RadioInfoMessage = React.forwardRef<
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
RadioInfoMessage.displayName = 'RadioInfoMessage';

// Variant Components
const RadioSuccess = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="success" {...props} />);
RadioSuccess.displayName = 'RadioSuccess';

const RadioWarning = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="warning" {...props} />);
RadioWarning.displayName = 'RadioWarning';

const RadioError = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="error" {...props} />);
RadioError.displayName = 'RadioError';

const RadioInfo = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="info" {...props} />);
RadioInfo.displayName = 'RadioInfo';

const RadioAI = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="ai" {...props} />);
RadioAI.displayName = 'RadioAI';

const RadioPrimary = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="default" {...props} />);
RadioPrimary.displayName = 'RadioPrimary';

const RadioSecondary = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="secondary" {...props} />);
RadioSecondary.displayName = 'RadioSecondary';

const RadioGlass = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="glass" {...props} />);
RadioGlass.displayName = 'RadioGlass';

const RadioGradient = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="gradient" {...props} />);
RadioGradient.displayName = 'RadioGradient';

const RadioMinimal = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="minimal" {...props} />);
RadioMinimal.displayName = 'RadioMinimal';

const RadioPremium = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="premium" {...props} />);
RadioPremium.displayName = 'RadioPremium';

const RadioFeatured = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="featured" {...props} />);
RadioFeatured.displayName = 'RadioFeatured';

const RadioCompact = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="compact" {...props} />);
RadioCompact.displayName = 'RadioCompact';

const RadioSpacious = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} variant="spacious" {...props} />);
RadioSpacious.displayName = 'RadioSpacious';

// Size Components
const RadioSmall = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} size="sm" {...props} />);
RadioSmall.displayName = 'RadioSmall';

const RadioLarge = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} size="lg" {...props} />);
RadioLarge.displayName = 'RadioLarge';

const RadioExtraSmall = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} size="xs" {...props} />);
RadioExtraSmall.displayName = 'RadioExtraSmall';

const RadioExtraLarge = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, 'onAnimationStart' | 'onAnimationEnd'>
>((props, ref) => <RadioGroupItem ref={ref} size="xl" {...props} />);
RadioExtraLarge.displayName = 'RadioExtraLarge';

// Radio Management Hook
const useRadio = () => {
  const [value, setValue] = React.useState<string>('');

  const handleValueChange = React.useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  return {
    value,
    setValue,
    onValueChange: handleValueChange,
  };
};

// Radio Sizes
const RadioSizes = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  default: 'h-4 w-4',
  lg: 'h-5 w-5',
  xl: 'h-6 w-6',
} as const;

// Radio Variants
const RadioVariants = {
  default: 'border-atlas-border text-atlas-primary-main focus-visible:ring-atlas-primary-main',
  secondary: 'border-atlas-secondary-main text-atlas-secondary-main focus-visible:ring-atlas-secondary-main',
  ai: 'border-atlas-ai-main text-atlas-ai-main focus-visible:ring-atlas-ai-main',
  success: 'border-atlas-success-main text-atlas-success-main focus-visible:ring-atlas-success-main',
  error: 'border-atlas-error-main text-atlas-error-main focus-visible:ring-atlas-error-main',
  warning: 'border-atlas-warning-main text-atlas-warning-main focus-visible:ring-atlas-warning-main',
  info: 'border-atlas-info-main text-atlas-info-main focus-visible:ring-atlas-info-main',
  muted: 'border-atlas-border text-atlas-text-tertiary focus-visible:ring-atlas-text-tertiary',
  glass: 'border-atlas-border/20 bg-atlas-background/10 backdrop-blur-sm text-atlas-primary-main focus-visible:ring-atlas-primary-main',
  gradient: 'border-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white focus-visible:ring-atlas-primary-main',
  minimal: 'border-transparent text-atlas-primary-main focus-visible:ring-atlas-primary-main hover:bg-atlas-background-secondary',
  premium: 'border-atlas-primary-main/50 bg-gradient-to-r from-atlas-primary-main/10 to-atlas-secondary-main/10 text-atlas-primary-main focus-visible:ring-atlas-primary-main',
  featured: 'border-atlas-secondary-main/50 bg-gradient-to-r from-atlas-secondary-main/10 to-atlas-ai-main/10 text-atlas-secondary-main focus-visible:ring-atlas-secondary-main',
  compact: 'border-atlas-border text-atlas-primary-main focus-visible:ring-atlas-primary-main',
  spacious: 'border-atlas-border text-atlas-primary-main focus-visible:ring-atlas-primary-main',
} as const;

export {
  RadioGroup,
  RadioGroupItem,
  RadioField,
  EnhancedRadioGroup,
  radioVariants,
  // Utility Components
  RadioContainer,
  RadioLabel,
  RadioDescription,
  RadioErrorMessage,
  RadioSuccessMessage,
  RadioWarningMessage,
  RadioInfoMessage,
  // Variant Components
  RadioSuccess,
  RadioWarning,
  RadioError,
  RadioInfo,
  RadioAI,
  RadioPrimary,
  RadioSecondary,
  RadioGlass,
  RadioGradient,
  RadioMinimal,
  RadioPremium,
  RadioFeatured,
  RadioCompact,
  RadioSpacious,
  // Size Components
  RadioSmall,
  RadioLarge,
  RadioExtraSmall,
  RadioExtraLarge,
  // Hooks and Utilities
  useRadio,
  RadioSizes,
  RadioVariants,
};
