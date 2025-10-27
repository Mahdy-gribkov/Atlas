import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  X,
  Plus,
  Minus,
  Check,
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
} from 'lucide-react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'border-transparent bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        ai: 'border-transparent bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        success: 'border-transparent bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        error: 'border-transparent bg-atlas-error-main text-white hover:bg-atlas-error-dark',
        warning: 'border-transparent bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        info: 'border-transparent bg-atlas-info-main text-white hover:bg-atlas-info-dark',
        outline: 'text-atlas-text-primary border-atlas-border hover:bg-atlas-border-subtle',
        ghost: 'border-transparent text-atlas-text-primary hover:bg-atlas-border-subtle',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md text-white',
        gradient: 'border-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white',
        minimal: 'border-transparent bg-transparent text-atlas-text-primary',
        premium: 'border-transparent bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white',
        featured: 'border-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white',
        compact: 'border-transparent bg-atlas-primary-main/90 text-white',
        spacious: 'border-transparent bg-atlas-primary-main/70 text-white',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
        xl: 'px-4 py-1.5 text-base',
        '2xl': 'px-5 py-2 text-lg',
      },
      position: {
        'top-left': 'absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2',
        'top-right': 'absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2',
        'bottom-left': 'absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2',
        'bottom-right': 'absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2',
        'top-center': 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        'bottom-center': 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2',
        'center-left': 'absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2',
        'center-right': 'absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2',
        'center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
        'inline': 'relative',
      },
      animation: {
        none: '',
        fade: 'animate-in fade-in duration-200',
        slide: 'animate-in slide-in-from-bottom-4 duration-200',
        scale: 'animate-in zoom-in-95 duration-200',
        bounce: 'animate-in bounce-in duration-300',
        spring: 'animate-in spring-in duration-300',
        pulse: 'animate-pulse',
        ping: 'animate-ping',
        wiggle: 'animate-pulse',
        glow: 'animate-pulse',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-full',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
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
      position: 'inline',
      animation: 'fade',
      rounded: 'default',
      shadow: 'md',
    }
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof badgeVariants> {
  // Basic props
  removable?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  
  // Content props
  content?: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  
  // Interactive props
  clickable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  
  // Animation props
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
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

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    position,
    animation,
    rounded,
    shadow,
    removable, 
    onRemove, 
    removeLabel = 'Remove', 
    content,
    icon,
    showIcon = false,
    iconPosition = 'left',
    clickable = false,
    onClick,
    disabled = false,
    animationDuration,
    animationEasing,
    onAnimationStart,
    onAnimationEnd,
    ariaLabel,
    ariaDescription,
    ariaLabelledBy,
    ariaDescribedBy,
    role = 'badge',
    customStyles,
    customClasses,
    children, 
    ...props 
  }, ref) => (
    <div
      ref={ref}
      className={cn(
        badgeVariants({ variant, size, position, animation, rounded, shadow }),
        clickable && !disabled && 'cursor-pointer hover:scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        customClasses,
        className
      )}
      style={{
        animationDuration: animationDuration ? `${animationDuration}ms` : undefined,
        animationTimingFunction: animationEasing,
        ...customStyles,
      }}
      onClick={clickable && !disabled ? onClick : undefined}
      onAnimationStart={onAnimationStart}
      onAnimationEnd={onAnimationEnd}
      aria-label={ariaLabel}
      aria-description={ariaDescription}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      role={role}
      {...props}
    >
      {showIcon && icon && iconPosition === 'left' && (
        <span className="mr-1" aria-hidden="true">
          {icon}
        </span>
      )}
      {content || children}
      {showIcon && icon && iconPosition === 'right' && (
        <span className="ml-1" aria-hidden="true">
          {icon}
        </span>
      )}
      {removable && (
        <button
          type="button"
          className="ml-1 inline-flex h-3 w-3 items-center justify-center rounded-full hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/50"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={removeLabel}
        >
          <X className="h-2 w-2" />
        </button>
      )}
    </div>
  )
);
Badge.displayName = 'Badge';

// Chip component (similar to badge but more interactive)
const chipVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'border-transparent bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        ai: 'border-transparent bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        success: 'border-transparent bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        error: 'border-transparent bg-atlas-error-main text-white hover:bg-atlas-error-dark',
        warning: 'border-transparent bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        info: 'border-transparent bg-atlas-info-main text-white hover:bg-atlas-info-dark',
        outline: 'text-atlas-text-primary border-atlas-border hover:bg-atlas-border-subtle',
        ghost: 'border-transparent text-atlas-text-primary hover:bg-atlas-border-subtle',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md text-white',
        gradient: 'border-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white',
        minimal: 'border-transparent bg-transparent text-atlas-text-primary',
        premium: 'border-transparent bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white',
        featured: 'border-transparent bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white',
        compact: 'border-transparent bg-atlas-primary-main/90 text-white',
        spacious: 'border-transparent bg-atlas-primary-main/70 text-white',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-2.5 py-1 text-sm',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
        xl: 'px-5 py-2.5 text-lg',
        '2xl': 'px-6 py-3 text-xl',
      },
      selected: {
        true: 'ring-2 ring-atlas-primary-main ring-offset-2',
        false: '',
      },
      animation: {
        none: '',
        fade: 'animate-in fade-in duration-200',
        slide: 'animate-in slide-in-from-bottom-4 duration-200',
        scale: 'animate-in zoom-in-95 duration-200',
        bounce: 'animate-in bounce-in duration-300',
        spring: 'animate-in spring-in duration-300',
        pulse: 'animate-pulse',
        ping: 'animate-ping',
        wiggle: 'animate-pulse',
        glow: 'animate-pulse',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-full',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
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
      selected: false,
      animation: 'fade',
      rounded: 'default',
      shadow: 'md',
    }
  }
);

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'content'>,
    VariantProps<typeof chipVariants> {
  // Basic props
  removable?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  
  // Content props
  content?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  
  // Interactive props
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  
  // Animation props
  animationDuration?: number;
  animationEasing?: string;
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  
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

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      variant,
      size,
      selected,
      animation,
      rounded,
      shadow,
      removable,
      onRemove,
      removeLabel = 'Remove',
      content,
      leftIcon,
      rightIcon,
      showLeftIcon = true,
      showRightIcon = true,
      disabled = false,
      loading = false,
      loadingText = 'Loading...',
      animationDuration,
      animationEasing,
      onAnimationStart,
      onAnimationEnd,
      ariaLabel,
      ariaDescription,
      ariaLabelledBy,
      ariaDescribedBy,
      role = 'button',
      customStyles,
      customClasses,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        chipVariants({ variant, size, selected, animation, rounded, shadow }),
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        customClasses,
        className
      )}
      style={{
        animationDuration: animationDuration ? `${animationDuration}ms` : undefined,
        animationTimingFunction: animationEasing,
        ...customStyles,
      }}
      disabled={disabled || loading}
      onAnimationStart={onAnimationStart}
      onAnimationEnd={onAnimationEnd}
      aria-label={ariaLabel}
      aria-description={ariaDescription}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      role={role}
      {...props}
    >
      {showLeftIcon && leftIcon && (
        <span className="mr-1" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      {loading ? loadingText : (content || children)}
      {showRightIcon && rightIcon && (
        <span className="ml-1" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      {removable && !loading && (
        <button
          type="button"
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-black/20 focus:outline-none focus:ring-1 focus:ring-white/50"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label={removeLabel}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </button>
  )
);
Chip.displayName = 'Chip';

// Status indicator component
const statusVariants = cva(
  'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        online: 'bg-atlas-success-bg text-atlas-success-dark',
        offline: 'bg-atlas-error-bg text-atlas-error-dark',
        away: 'bg-atlas-warning-bg text-atlas-warning-dark',
        busy: 'bg-atlas-error-bg text-atlas-error-dark',
        pending: 'bg-atlas-info-bg text-atlas-info-dark',
        active: 'bg-atlas-success-bg text-atlas-success-dark',
        inactive: 'bg-atlas-text-tertiary text-white',
      },
    },
    defaultVariants: {
      variant: 'online',
    },
  }
);

export interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  showDot?: boolean;
}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  ({ className, variant, showDot = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(statusVariants({ variant, className }))}
      {...props}
    >
      {showDot && (
        <div
          className={cn(
            'mr-1 h-2 w-2 rounded-full',
            variant === 'online' && 'bg-atlas-success-main',
            variant === 'offline' && 'bg-atlas-error-main',
            variant === 'away' && 'bg-atlas-warning-main',
            variant === 'busy' && 'bg-atlas-error-main',
            variant === 'pending' && 'bg-atlas-info-main',
            variant === 'active' && 'bg-atlas-success-main',
            variant === 'inactive' && 'bg-atlas-text-tertiary'
          )}
        />
      )}
      {children}
    </div>
  )
);
Status.displayName = 'Status';

// Utility Components
const BadgeGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { 
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
}>(
  ({ className, spacing = 'md', wrap = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center',
        spacing === 'none' && 'gap-0',
        spacing === 'sm' && 'gap-1',
        spacing === 'md' && 'gap-2',
        spacing === 'lg' && 'gap-3',
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
BadgeGroup.displayName = 'BadgeGroup';

const ChipGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { 
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  wrap?: boolean;
  orientation?: 'horizontal' | 'vertical';
}>(
  ({ className, spacing = 'md', wrap = true, orientation = 'horizontal', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        orientation === 'vertical' && 'flex-col',
        spacing === 'none' && 'gap-0',
        spacing === 'sm' && 'gap-1',
        spacing === 'md' && 'gap-2',
        spacing === 'lg' && 'gap-3',
        wrap && 'flex-wrap',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
ChipGroup.displayName = 'ChipGroup';

const BadgeContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}>(
  ({ className, position = 'top-right', children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  )
);
BadgeContainer.displayName = 'BadgeContainer';

// Variant Components
const BadgeSuccess = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'success', ...props }, ref) => (
    <Badge ref={ref} variant={variant} {...props} />
  )
);
BadgeSuccess.displayName = 'BadgeSuccess';

const BadgeWarning = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'warning', ...props }, ref) => (
    <Badge ref={ref} variant={variant} {...props} />
  )
);
BadgeWarning.displayName = 'BadgeWarning';

const BadgeError = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'error', ...props }, ref) => (
    <Badge ref={ref} variant={variant} {...props} />
  )
);
BadgeError.displayName = 'BadgeError';

const BadgeInfo = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ variant = 'info', ...props }, ref) => (
    <Badge ref={ref} variant={variant} {...props} />
  )
);
BadgeInfo.displayName = 'BadgeInfo';

const ChipSuccess = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ variant = 'success', ...props }, ref) => (
    <Chip ref={ref} variant={variant} {...props} />
  )
);
ChipSuccess.displayName = 'ChipSuccess';

const ChipWarning = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ variant = 'warning', ...props }, ref) => (
    <Chip ref={ref} variant={variant} {...props} />
  )
);
ChipWarning.displayName = 'ChipWarning';

const ChipError = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ variant = 'error', ...props }, ref) => (
    <Chip ref={ref} variant={variant} {...props} />
  )
);
ChipError.displayName = 'ChipError';

const ChipInfo = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ variant = 'info', ...props }, ref) => (
    <Chip ref={ref} variant={variant} {...props} />
  )
);
ChipInfo.displayName = 'ChipInfo';

export {
  Badge,
  Chip,
  Status,
  BadgeGroup,
  ChipGroup,
  BadgeContainer,
  BadgeSuccess,
  BadgeWarning,
  BadgeError,
  BadgeInfo,
  ChipSuccess,
  ChipWarning,
  ChipError,
  ChipInfo,
  badgeVariants,
  chipVariants,
  statusVariants,
};
