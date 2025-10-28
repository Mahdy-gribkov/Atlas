import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  User,
  Users,
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
  FolderArchive,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  MapPin,
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
  Sparkles
} from 'lucide-react';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full transition-all duration-200',
  {
    variants: {
      size: {
        xs: 'h-6 w-6',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
        '3xl': 'h-24 w-24',
        '4xl': 'h-32 w-32',
      },
      variant: {
        default: 'bg-atlas-primary-main',
        secondary: 'bg-atlas-secondary-main',
        ai: 'bg-atlas-ai-main',
        success: 'bg-atlas-success-main',
        error: 'bg-atlas-error-main',
        warning: 'bg-atlas-warning-main',
        info: 'bg-atlas-info-main',
        muted: 'bg-atlas-text-tertiary',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20',
        gradient: 'bg-gradient-to-br from-atlas-primary-main to-atlas-secondary-main',
        minimal: 'bg-transparent border border-atlas-border',
        premium: 'bg-gradient-to-br from-atlas-warning-main to-atlas-success-main',
        featured: 'bg-gradient-to-br from-atlas-primary-main to-atlas-ai-main',
        compact: 'bg-atlas-primary-main/90',
        spacious: 'bg-atlas-primary-main/70',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
        rounded: 'rounded-md',
        none: 'rounded-none',
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
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        glow: 'shadow-lg shadow-atlas-primary-main/25',
      },
      border: {
        none: 'border-0',
        sm: 'border',
        md: 'border-2',
        lg: 'border-4',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
      shape: 'circle',
      animation: 'fade',
      shadow: 'md',
      border: 'none',
    }
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  // Basic props
  src?: string;
  alt?: string;
  fallback?: string;
  
  // Status props
  status?: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'active' | 'inactive';
  showStatus?: boolean;
  statusPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  
  // Interactive props
  clickable?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  
  // Icon props
  icon?: React.ReactNode;
  showIcon?: boolean;
  iconPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  
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
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ 
  className, 
  size, 
  variant, 
  shape,
  animation,
  shadow,
  border,
  src, 
  alt, 
  fallback, 
  status, 
  showStatus = false, 
  statusPosition = 'bottom-right',
  clickable = false,
  onClick,
  disabled = false,
  loading = false,
  icon,
  showIcon = false,
  iconPosition = 'center',
  animationDuration,
  animationEasing,
  onAnimationStart,
  onAnimationEnd,
  ariaLabel,
  ariaDescription,
  ariaLabelledBy,
  ariaDescribedBy,
  role = 'img',
  customStyles,
  customClasses,
  ...props 
}, ref) => {
  const getStatusPositionClasses = () => {
    switch (statusPosition) {
      case 'top-left':
        return 'absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2';
      case 'top-right':
        return 'absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2';
      case 'bottom-left':
        return 'absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2';
      case 'bottom-right':
        return 'absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2';
      case 'top-center':
        return 'absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      case 'bottom-center':
        return 'absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2';
      default:
        return 'absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2';
    }
  };

  const getIconPositionClasses = () => {
    switch (iconPosition) {
      case 'top-left':
        return 'absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2';
      case 'top-right':
        return 'absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2';
      case 'bottom-left':
        return 'absolute bottom-0 left-0 transform -translate-x-1/2 translate-y-1/2';
      case 'bottom-right':
        return 'absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2';
      case 'center':
        return 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
      default:
        return 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    }
  };

  return (
    <div className="relative inline-block">
      <AvatarPrimitive.Root
        ref={ref}
        className={cn(
          avatarVariants({ size, variant, shape, animation, shadow, border }),
          clickable && !disabled && 'cursor-pointer hover:scale-105',
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
        <AvatarPrimitive.Image
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
        />
        <AvatarPrimitive.Fallback
          className={cn(
            "flex h-full w-full items-center justify-center text-sm font-medium text-white",
            shape === 'circle' && 'rounded-full',
            shape === 'square' && 'rounded-lg',
            shape === 'rounded' && 'rounded-md',
            shape === 'none' && 'rounded-none',
            variant === 'default' && 'bg-atlas-primary-main',
            variant === 'secondary' && 'bg-atlas-secondary-main',
            variant === 'ai' && 'bg-atlas-ai-main',
            variant === 'success' && 'bg-atlas-success-main',
            variant === 'error' && 'bg-atlas-error-main',
            variant === 'warning' && 'bg-atlas-warning-main',
            variant === 'info' && 'bg-atlas-info-main',
            variant === 'muted' && 'bg-atlas-text-tertiary',
            variant === 'glass' && 'bg-white/10 backdrop-blur-md border border-white/20',
            variant === 'gradient' && 'bg-gradient-to-br from-atlas-primary-main to-atlas-secondary-main',
            variant === 'minimal' && 'bg-transparent border border-atlas-border',
            variant === 'premium' && 'bg-gradient-to-br from-atlas-warning-main to-atlas-success-main',
            variant === 'featured' && 'bg-gradient-to-br from-atlas-primary-main to-atlas-ai-main',
            variant === 'compact' && 'bg-atlas-primary-main/90',
            variant === 'spacious' && 'bg-atlas-primary-main/70',
          )}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            fallback || alt?.charAt(0).toUpperCase() || <User className="h-4 w-4" />
          )}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
      
      {showStatus && status && (
        <div
          className={cn(
            'h-3 w-3 rounded-full border-2 border-white',
            getStatusPositionClasses(),
            status === 'online' && 'bg-atlas-success-main',
            status === 'offline' && 'bg-atlas-text-tertiary',
            status === 'away' && 'bg-atlas-warning-main',
            status === 'busy' && 'bg-atlas-error-main',
            status === 'pending' && 'bg-atlas-info-main',
            status === 'active' && 'bg-atlas-success-main',
            status === 'inactive' && 'bg-atlas-text-tertiary'
          )}
        />
      )}
      
      {showIcon && icon && (
        <div
          className={cn(
            'flex items-center justify-center',
            getIconPositionClasses()
          )}
        >
          {icon}
        </div>
      )}
    </div>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-atlas-primary-main text-sm font-medium text-white',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Enhanced Avatar Group component
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  spacing?: 'none' | 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ 
    children, 
    max, 
    size = 'default', 
    spacing = 'default', 
    orientation = 'horizontal',
    className,
    showTooltip = false,
    tooltipPosition = 'top',
  }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingCount = max ? childrenArray.length - max : 0;

    const spacingClasses = {
      none: 'gap-0',
      sm: orientation === 'horizontal' ? '-space-x-1' : '-space-y-1',
      default: orientation === 'horizontal' ? '-space-x-2' : '-space-y-2',
      lg: orientation === 'horizontal' ? '-space-x-3' : '-space-y-3',
    };

    const sizeClasses = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      default: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
      '2xl': 'h-20 w-20',
      '3xl': 'h-24 w-24',
      '4xl': 'h-32 w-32',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          orientation === 'vertical' && 'flex-col',
          spacingClasses[spacing],
          className
        )}
      >
        {visibleChildren.map((child, index) => (
          <div key={index} className="relative">
            {child}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className={cn(
            'relative flex items-center justify-center rounded-full border-2 border-white bg-atlas-border-subtle text-xs font-medium text-atlas-text-primary',
            sizeClasses[size]
          )}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

// Enhanced User Avatar component
export interface UserAvatarProps {
  name: string;
  email?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy' | 'pending' | 'active' | 'inactive';
  variant?: 'default' | 'secondary' | 'ai' | 'success' | 'error' | 'warning' | 'info' | 'muted' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  shape?: 'circle' | 'square' | 'rounded' | 'none';
  className?: string;
  showName?: boolean;
  showEmail?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ 
    name, 
    email, 
    src, 
    size = 'default', 
    showStatus = false, 
    status,
    variant = 'default',
    shape = 'circle',
    className,
    showName = true,
    showEmail = true,
    orientation = 'horizontal',
  }, ref) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div 
        ref={ref} 
        className={cn(
          'flex items-center',
          orientation === 'vertical' ? 'flex-col space-y-2' : 'space-x-3',
          className
        )}
      >
        <Avatar
          {...(src && { src })}
          alt={name}
          fallback={initials}
          size={size}
          variant={variant}
          shape={shape}
          showStatus={showStatus}
          {...(status && { status })}
        />
        {(showName || showEmail) && (
          <div className={cn(
            'flex flex-col',
            orientation === 'vertical' && 'items-center text-center'
          )}>
            {showName && (
              <span className="text-sm font-medium text-atlas-text-primary">{name}</span>
            )}
            {showEmail && email && (
              <span className="text-xs text-atlas-text-tertiary">{email}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);
UserAvatar.displayName = 'UserAvatar';

// Variant Components
const AvatarSuccess = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ variant = 'success', ...props }, ref) => (
    <Avatar ref={ref} variant={variant} {...props} />
  )
);
AvatarSuccess.displayName = 'AvatarSuccess';

const AvatarWarning = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ variant = 'warning', ...props }, ref) => (
    <Avatar ref={ref} variant={variant} {...props} />
  )
);
AvatarWarning.displayName = 'AvatarWarning';

const AvatarError = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ variant = 'error', ...props }, ref) => (
    <Avatar ref={ref} variant={variant} {...props} />
  )
);
AvatarError.displayName = 'AvatarError';

const AvatarInfo = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ variant = 'info', ...props }, ref) => (
    <Avatar ref={ref} variant={variant} {...props} />
  )
);
AvatarInfo.displayName = 'AvatarInfo';

const AvatarGlass = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ variant = 'glass', ...props }, ref) => (
    <Avatar ref={ref} variant={variant} {...props} />
  )
);
AvatarGlass.displayName = 'AvatarGlass';

const AvatarGradient = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ variant = 'gradient', ...props }, ref) => (
    <Avatar ref={ref} variant={variant} {...props} />
  )
);
AvatarGradient.displayName = 'AvatarGradient';

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  UserAvatar,
  AvatarSuccess,
  AvatarWarning,
  AvatarError,
  AvatarInfo,
  AvatarGlass,
  AvatarGradient,
  avatarVariants,
};
