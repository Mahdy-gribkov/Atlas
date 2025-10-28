import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { Loader2, Check, X, AlertCircle, Info, ExternalLink } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light active:bg-atlas-primary-dark shadow-sm hover:shadow-md',
        secondary: 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light active:bg-atlas-secondary-dark shadow-sm hover:shadow-md',
        ai: 'bg-atlas-ai-main text-white hover:bg-atlas-ai-light active:bg-atlas-ai-dark shadow-sm hover:shadow-md',
        destructive: 'bg-atlas-error-main text-white hover:bg-atlas-error-light active:bg-atlas-error-dark shadow-sm hover:shadow-md',
        outline: 'border border-atlas-border bg-transparent hover:bg-atlas-border-subtle hover:text-atlas-text-primary active:bg-atlas-border-subtle',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary active:bg-atlas-border-subtle',
        link: 'text-atlas-primary-main underline-offset-4 hover:underline active:text-atlas-primary-dark',
        success: 'bg-atlas-success-main text-white hover:bg-atlas-success-light active:bg-atlas-success-dark shadow-sm hover:shadow-md',
        warning: 'bg-atlas-warning-main text-white hover:bg-atlas-warning-light active:bg-atlas-warning-dark shadow-sm hover:shadow-md',
        info: 'bg-atlas-info-main text-white hover:bg-atlas-info-light active:bg-atlas-info-dark shadow-sm hover:shadow-md',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white hover:from-atlas-primary-light hover:to-atlas-secondary-light active:from-atlas-primary-dark active:to-atlas-secondary-dark shadow-sm hover:shadow-md',
        glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 active:bg-white/30',
        minimal: 'text-atlas-text-primary hover:bg-atlas-border-subtle active:bg-atlas-border-subtle',
      },
      size: {
        xs: 'h-6 rounded px-2 text-xs',
        sm: 'h-8 rounded-md px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 rounded-md px-8 text-lg',
        xl: 'h-12 rounded-lg px-10 text-xl',
        icon: 'h-10 w-10',
        'icon-xs': 'h-6 w-6',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
        'icon-xl': 'h-14 w-14',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      loading: {
        true: 'relative cursor-not-allowed',
        false: '',
      },
      loadingPosition: {
        left: '',
        right: '',
        center: '',
      },
      iconPosition: {
        left: '',
        right: '',
        center: '',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
        ping: 'animate-ping',
      },
      ripple: {
        true: 'relative overflow-hidden',
        false: '',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
      loading: false,
      loadingPosition: 'left',
      iconPosition: 'left',
      animation: 'none',
      ripple: false,
      shadow: 'sm',
      rounded: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  loadingIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  tooltip?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  badge?: string | number;
  badgePosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  ripple?: boolean;
  rippleColor?: string;
  onRipple?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  success?: boolean;
  successText?: string;
  successIcon?: React.ReactNode;
  error?: boolean;
  errorText?: string;
  errorIcon?: React.ReactNode;
  warning?: boolean;
  warningText?: string;
  warningIcon?: React.ReactNode;
  info?: boolean;
  infoText?: string;
  infoIcon?: React.ReactNode;
  external?: boolean;
  externalIcon?: React.ReactNode;
  download?: boolean;
  downloadIcon?: React.ReactNode;
  copy?: boolean;
  copyText?: string;
  copyIcon?: React.ReactNode;
  copiedText?: string;
  copiedIcon?: React.ReactNode;
  onCopy?: (text: string) => void;
  keyboardShortcut?: string;
  ariaLabel?: string;
  ariaDescription?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaPressed?: boolean;
  ariaCurrent?: boolean;
  role?: string;
  tabIndex?: number;
  autoFocus?: boolean;
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  name?: string;
  type?: 'button' | 'submit' | 'reset';
  value?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      loadingText,
      loadingIcon,
      loadingPosition,
      iconPosition,
      animation,
      ripple,
      rippleColor,
      onRipple,
      shadow,
      rounded,
      asChild = false,
      leftIcon,
      rightIcon,
      icon,
      iconOnly,
      tooltip,
      tooltipPosition,
      badge,
      badgePosition,
      success,
      successText,
      successIcon,
      error,
      errorText,
      errorIcon,
      warning,
      warningText,
      warningIcon,
      info,
      infoText,
      infoIcon,
      external,
      externalIcon,
      download,
      downloadIcon,
      copy,
      copyText,
      copyIcon,
      copiedText,
      copiedIcon,
      onCopy,
      keyboardShortcut,
      ariaLabel,
      ariaDescription,
      ariaExpanded,
      ariaControls,
      ariaPressed,
      ariaCurrent,
      role,
      tabIndex,
      autoFocus,
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
      name,
      type,
      value,
      children,
      disabled,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const [isCopied, setIsCopied] = React.useState(false);
    const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Handle ripple effect
    const handleRipple = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      if (!ripple || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = Date.now();

      setRipples(prev => [...prev, { id, x, y }]);

      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== id));
      }, 600);

      onRipple?.(event);
    }, [ripple, onRipple]);

    // Handle copy functionality
    const handleCopy = React.useCallback(async () => {
      if (!copy || !copyText) return;

      try {
        await navigator.clipboard.writeText(copyText);
        setIsCopied(true);
        onCopy?.(copyText);
        
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }, [copy, copyText, onCopy]);

    // Handle keyboard shortcuts
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyboardShortcut && event.ctrlKey && event.key === keyboardShortcut.toLowerCase()) {
        event.preventDefault();
        if (copy) {
          handleCopy();
        } else {
          onClick?.(event as any);
        }
      }
      onKeyDown?.(event);
    }, [keyboardShortcut, copy, handleCopy, onClick, onKeyDown]);

    // Determine current state
    const currentState = success ? 'success' : error ? 'error' : warning ? 'warning' : info ? 'info' : 'default';
    const currentText = success ? successText : error ? errorText : warning ? warningText : info ? infoText : children;
    const currentIcon = success ? successIcon : error ? errorIcon : warning ? warningIcon : info ? infoIcon : null;

    // Determine loading icon
    const defaultLoadingIcon = <Loader2 className="h-4 w-4 animate-spin" />;
    const loadingIconElement = loadingIcon || defaultLoadingIcon;

    // Determine external icon
    const defaultExternalIcon = <ExternalLink className="h-4 w-4" />;
    const externalIconElement = externalIcon || defaultExternalIcon;

    // Determine copy icons
    const defaultCopyIcon = <Check className="h-4 w-4" />;
    const defaultCopiedIcon = <Check className="h-4 w-4" />;
    const copyIconElement = isCopied ? (copiedIcon || defaultCopiedIcon) : (copyIcon || defaultCopyIcon);

    // Determine download icon
    const defaultDownloadIcon = <ExternalLink className="h-4 w-4" />;
    const downloadIconElement = downloadIcon || defaultDownloadIcon;

    // Determine badge position
    const badgePositionClasses = {
      'top-right': 'top-0 right-0 -translate-y-1/2 translate-x-1/2',
      'top-left': 'top-0 left-0 -translate-y-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-0 right-0 translate-y-1/2 translate-x-1/2',
      'bottom-left': 'bottom-0 left-0 translate-y-1/2 -translate-x-1/2',
    };

    return (
      <div className="relative inline-block">
        <Comp
          ref={ref || buttonRef}
          className={cn(
            buttonVariants({ 
              variant, 
              size, 
              fullWidth, 
              loading, 
              loadingPosition, 
              iconPosition, 
              animation, 
              ripple, 
              shadow, 
              rounded, 
              className 
            }),
            currentState !== 'default' && 'opacity-90',
            iconOnly && 'aspect-square p-0'
          )}
          disabled={disabled || loading}
          aria-disabled={disabled || loading}
          aria-label={ariaLabel}
          aria-describedby={ariaDescription}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-pressed={ariaPressed}
          aria-current={ariaCurrent}
          role={role}
          tabIndex={tabIndex}
          autoFocus={autoFocus}
          form={form}
          formAction={formAction}
          formEncType={formEncType}
          formMethod={formMethod}
          formNoValidate={formNoValidate}
          formTarget={formTarget}
          name={name}
          type={type}
          value={value}
          onClick={copy ? handleCopy : onClick}
          onMouseDown={handleRipple}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {/* Ripple effects */}
          {ripple && ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute pointer-events-none animate-ping"
              style={{
                left: ripple.x - 10,
                top: ripple.y - 10,
                width: 20,
                height: 20,
                backgroundColor: rippleColor || 'rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                transform: 'scale(0)',
                animation: 'ripple 0.6s linear',
              }}
            />
          ))}

          {/* Loading state */}
          {loading && (
            <>
              {loadingPosition === 'left' && (
                <span className="mr-2" aria-hidden="true">
                  {loadingIconElement}
                </span>
              )}
              {loadingPosition === 'center' && (
                <span aria-hidden="true">
                  {loadingIconElement}
                </span>
              )}
              <span className={loading ? 'opacity-0' : ''}>
                {loading ? loadingText || 'Loading...' : currentText}
              </span>
              {loadingPosition === 'right' && (
                <span className="ml-2" aria-hidden="true">
                  {loadingIconElement}
                </span>
              )}
              <span className="sr-only">
                {loading ? loadingText || 'Loading, please wait...' : ''}
              </span>
            </>
          )}

          {/* Non-loading state */}
          {!loading && (
            <>
              {/* Left icon */}
              {iconPosition === 'left' && (leftIcon || icon) && (
                <span className="mr-2" aria-hidden="true">
                  {leftIcon || icon}
                </span>
              )}

              {/* Center icon (icon-only buttons) */}
              {iconPosition === 'center' && (icon || iconOnly) && (
                <span aria-hidden="true">
                  {icon}
                </span>
              )}

              {/* Button content */}
              {!iconOnly && (
                <span className={currentState !== 'default' ? 'opacity-90' : ''}>
                  {currentText}
                </span>
              )}

              {/* Right icon */}
              {iconPosition === 'right' && (rightIcon || icon) && (
                <span className="ml-2" aria-hidden="true">
                  {rightIcon || icon}
                </span>
              )}

              {/* State icons */}
              {currentIcon && (
                <span className="ml-2" aria-hidden="true">
                  {currentIcon}
                </span>
              )}

              {/* External link icon */}
              {external && (
                <span className="ml-2" aria-hidden="true">
                  {externalIconElement}
                </span>
              )}

              {/* Download icon */}
              {download && (
                <span className="ml-2" aria-hidden="true">
                  {downloadIconElement}
                </span>
              )}

              {/* Copy icon */}
              {copy && (
                <span className="ml-2" aria-hidden="true">
                  {copyIconElement}
                </span>
              )}
            </>
          )}

          {/* Keyboard shortcut indicator */}
          {keyboardShortcut && (
            <span className="ml-2 text-xs opacity-60" aria-hidden="true">
              ⌘{keyboardShortcut.toUpperCase()}
            </span>
          )}
        </Comp>

        {/* Badge */}
        {badge && (
          <span
            className={cn(
              'absolute inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full',
              badgePositionClasses[badgePosition || 'top-right']
            )}
            aria-hidden="true"
          >
            {badge}
          </span>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className={cn(
              'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg opacity-0 pointer-events-none transition-opacity duration-200',
              tooltipPosition === 'top' && 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
              tooltipPosition === 'bottom' && 'top-full left-1/2 transform -translate-x-1/2 mt-2',
              tooltipPosition === 'left' && 'right-full top-1/2 transform -translate-y-1/2 mr-2',
              tooltipPosition === 'right' && 'left-full top-1/2 transform -translate-y-1/2 ml-2',
              'group-hover:opacity-100'
            )}
            role="tooltip"
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }
);
Button.displayName = 'Button';

// Button Group Component
interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  attached?: boolean;
  children: React.ReactNode;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = 'horizontal', spacing = 'sm', attached = false, children, ...props }, ref) => {
    const spacingClasses = {
      none: '',
      sm: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
      md: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
      lg: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    };

    const attachedClasses = attached ? {
      horizontal: '[&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:last-child)]:border-r-0',
      vertical: '[&>*:first-child]:rounded-b-none [&>*:last-child]:rounded-t-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:not(:last-child)]:border-b-0',
    } : {};

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex',
          orientation === 'vertical' && 'flex-col',
          spacingClasses[spacing],
          attachedClasses[orientation],
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

// Button Toggle Component
interface ButtonToggleProps extends Omit<ButtonProps, 'onClick'> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  value?: string;
  defaultPressed?: boolean;
}

const ButtonToggle = React.forwardRef<HTMLButtonElement, ButtonToggleProps>(
  ({ className, pressed, onPressedChange, value, defaultPressed = false, children, ...props }, ref) => {
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed);
    const isPressed = pressed !== undefined ? pressed : internalPressed;

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      const newPressed = !isPressed;
      if (pressed === undefined) {
        setInternalPressed(newPressed);
      }
      onPressedChange?.(newPressed);
      props.onClick?.(event);
    }, [isPressed, pressed, onPressedChange, props]);

    return (
      <Button
        ref={ref}
        className={cn(
          isPressed && 'bg-atlas-primary-main text-white',
          className
        )}
        aria-pressed={isPressed}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ButtonToggle.displayName = 'ButtonToggle';

// Button Loading Component
interface ButtonLoadingProps {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const ButtonLoading: React.FC<ButtonLoadingProps> = ({ loading, loadingText, children }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        <span>{loadingText || 'Loading...'}</span>
      </div>
    );
  }
  return <>{children}</>;
};

// Button Icon Component
interface ButtonIconProps {
  icon: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ icon, size = 'md', className }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <span className={cn(sizeClasses[size], className)} aria-hidden="true">
      {icon}
    </span>
  );
};

// Button Spinner Component
interface ButtonSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <Loader2 className={cn(sizeClasses[size], 'animate-spin', className)} />
  );
};

export { 
  Button, 
  buttonVariants, 
  ButtonGroup, 
  ButtonToggle, 
  ButtonLoading, 
  ButtonIcon, 
  ButtonSpinner,
  type ButtonGroupProps,
  type ButtonToggleProps,
  type ButtonLoadingProps,
  type ButtonIconProps,
  type ButtonSpinnerProps
};
