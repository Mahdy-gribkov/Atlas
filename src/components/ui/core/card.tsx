"use client";

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { Slot } from '@radix-ui/react-slot';
import { 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Star, 
  Bookmark, 
  Download, 
  ExternalLink, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  Trash2,
  Edit,
  Copy,
  Check,
  X,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
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
  FolderArchive
} from 'lucide-react';

const cardVariants = cva(
  'rounded-lg border bg-atlas-card-bg text-atlas-text-primary shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border hover:border-atlas-border-subtle',
        elevated: 'border-atlas-border-subtle shadow-md hover:shadow-lg',
        outlined: 'border-2 border-atlas-primary-main hover:border-atlas-primary-light',
        ghost: 'border-transparent shadow-none hover:bg-atlas-border-subtle',
        success: 'border-atlas-success-main bg-atlas-success-bg hover:bg-atlas-success-light',
        error: 'border-atlas-error-main bg-atlas-error-bg hover:bg-atlas-error-light',
        warning: 'border-atlas-warning-main bg-atlas-warning-bg hover:bg-atlas-warning-light',
        info: 'border-atlas-info-main bg-atlas-info-bg hover:bg-atlas-info-light',
        gradient: 'border-transparent bg-gradient-to-br from-atlas-primary-main to-atlas-secondary-main text-white hover:from-atlas-primary-light hover:to-atlas-secondary-light',
        glass: 'border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20',
        minimal: 'border-transparent shadow-none hover:bg-atlas-border-subtle',
        premium: 'border-atlas-warning-main bg-gradient-to-br from-atlas-warning-main/10 to-atlas-success-main/10 hover:from-atlas-warning-main/20 hover:to-atlas-success-main/20',
        featured: 'border-atlas-primary-main bg-gradient-to-br from-atlas-primary-main/5 to-atlas-ai-main/5 hover:from-atlas-primary-main/10 hover:to-atlas-ai-main/10',
        compact: 'border-atlas-border-subtle bg-atlas-card-bg hover:bg-atlas-border-subtle',
        spacious: 'border-atlas-border bg-atlas-card-bg hover:border-atlas-primary-main',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        default: 'text-sm',
        lg: 'text-base',
        xl: 'text-lg',
      },
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200',
        false: '',
      },
      loading: {
        true: 'opacity-75 cursor-wait',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
      selected: {
        true: 'ring-2 ring-atlas-primary-main ring-offset-2',
        false: '',
      },
      hover: {
        none: '',
        lift: 'hover:shadow-lg hover:-translate-y-1',
        scale: 'hover:scale-105',
        glow: 'hover:shadow-lg hover:shadow-atlas-primary-main/25',
        slide: 'hover:translate-x-2',
        rotate: 'hover:rotate-1',
        pulse: 'hover:animate-pulse',
      },
      animation: {
        none: '',
        fade: 'transition-opacity duration-200',
        slide: 'transition-transform duration-200',
        scale: 'transition-transform duration-200',
        bounce: 'transition-transform duration-300 ease-bounce',
        spring: 'transition-transform duration-300 ease-out',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-lg',
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
      border: {
        none: 'border-0',
        thin: 'border',
        thick: 'border-2',
        thickest: 'border-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      padding: 'default',
      interactive: false,
      loading: false,
      disabled: false,
      selected: false,
      hover: 'none',
      animation: 'fade',
      rounded: 'default',
      shadow: 'sm',
      border: 'thin',
    },
  }
);

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content' | 'onCopy' | 'onFocus'>,
    VariantProps<typeof cardVariants> {
  // Basic props
  asChild?: boolean;
  
  // Content props
  title?: string;
  subtitle?: string;
  description?: string;
  content?: React.ReactNode;
  footer?: React.ReactNode;
  
  // Media props
  media?: {
    src: string;
    alt?: string;
    type?: 'image' | 'video' | 'audio';
    aspectRatio?: 'square' | 'video' | 'wide' | 'ultrawide' | 'portrait' | 'landscape';
    overlay?: boolean;
    overlayContent?: React.ReactNode;
  };
  
  // Actions props
  actions?: {
    primary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    };
    secondary?: {
      label: string;
      onClick: () => void;
      icon?: React.ReactNode;
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    };
    menu?: {
      items: Array<{
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
        destructive?: boolean;
        disabled?: boolean;
      }>;
    };
  };
  
  // Interactive props
  onClick?: () => void;
  onDoubleClick?: () => void;
  onHover?: (isHovered: boolean) => void;
  onFocus?: (isFocused: boolean) => void;
  
  // State props
  isSelected?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  isExpanded?: boolean;
  isCollapsible?: boolean;
  
  // Badge props
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  
  // Status props
  status?: {
    type: 'success' | 'warning' | 'error' | 'info' | 'loading';
    message?: string;
    icon?: React.ReactNode;
  };
  
  // Rating props
  rating?: {
    value: number;
    max?: number;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
    readonly?: boolean;
    onChange?: (value: number) => void;
  };
  
  // Tags props
  tags?: Array<{
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    removable?: boolean;
    onRemove?: () => void;
  }>;
  
  // Progress props
  progress?: {
    value: number;
    max?: number;
    showValue?: boolean;
    variant?: 'default' | 'success' | 'warning' | 'error';
    size?: 'sm' | 'md' | 'lg';
  };
  
  // Stats props
  stats?: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
      value: number;
      direction: 'up' | 'down' | 'neutral';
    };
  }>;
  
  // Avatar props
  avatar?: {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'away' | 'busy';
  };
  
  // Link props
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  external?: boolean;
  
  // Copy props
  copyable?: boolean;
  copyText?: string;
  onCopy?: (text: string) => void;
  
  // Share props
  shareable?: boolean;
  shareUrl?: string;
  shareTitle?: string;
  onShare?: (url: string, title: string) => void;
  
  // Bookmark props
  bookmarkable?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (isBookmarked: boolean) => void;
  
  // Like props
  likeable?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  onLike?: (isLiked: boolean) => void;
  
  // Download props
  downloadable?: boolean;
  downloadUrl?: string;
  downloadFilename?: string;
  onDownload?: (url: string, filename: string) => void;
  
  // Edit props
  editable?: boolean;
  onEdit?: () => void;
  
  // Delete props
  deletable?: boolean;
  onDelete?: () => void;
  
  // Fullscreen props
  fullscreenable?: boolean;
  isFullscreen?: boolean;
  onFullscreen?: (isFullscreen: boolean) => void;
  
  // Accessibility props
  ariaLabel?: string;
  ariaDescription?: string;
  ariaExpanded?: boolean;
  ariaSelected?: boolean;
  role?: string;
  
  // Layout props
  orientation?: 'vertical' | 'horizontal';
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  
  // Responsive props
  responsive?: boolean;
  breakpoints?: {
    sm?: Partial<CardProps>;
    md?: Partial<CardProps>;
    lg?: Partial<CardProps>;
    xl?: Partial<CardProps>;
  };
  
  // Animation props
  animationDelay?: number;
  animationDuration?: number;
  animationEasing?: string;
  
  // Custom props
  customStyles?: React.CSSProperties;
  customClasses?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant,
    size,
    padding,
    interactive,
    loading,
    disabled,
    selected,
    hover,
    animation,
    rounded,
    shadow,
    border,
    asChild,
    title,
    subtitle,
    description,
    content,
    footer,
    media,
    actions,
    onClick,
    onDoubleClick,
    onHover,
    onFocus,
    isSelected,
    isLoading,
    isDisabled,
    isExpanded,
    isCollapsible,
    badge,
    status,
    rating,
    tags,
    progress,
    stats,
    avatar,
    href,
    target,
    external,
    copyable,
    copyText,
    onCopy,
    shareable,
    shareUrl,
    shareTitle,
    onShare,
    bookmarkable,
    isBookmarked,
    onBookmark,
    likeable,
    isLiked,
    likesCount,
    onLike,
    downloadable,
    downloadUrl,
    downloadFilename,
    onDownload,
    editable,
    onEdit,
    deletable,
    onDelete,
    fullscreenable,
    isFullscreen,
    onFullscreen,
    ariaLabel,
    ariaDescription,
    ariaExpanded,
    ariaSelected,
    role,
    orientation,
    alignment,
    justify,
    responsive,
    breakpoints,
    animationDelay,
    animationDuration,
    animationEasing,
    customStyles,
    customClasses,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [isCopied, setIsCopied] = React.useState(false);
    const [isShared, setIsShared] = React.useState(false);
    const [isBookmarkedState, setIsBookmarkedState] = React.useState(isBookmarked || false);
    const [isLikedState, setIsLikedState] = React.useState(isLiked || false);
    const [likesCountState, setLikesCountState] = React.useState(likesCount || 0);
    const [isFullscreenState, setIsFullscreenState] = React.useState(isFullscreen || false);
    const [isExpandedState, setIsExpandedState] = React.useState(isExpanded || false);

    // Handle copy functionality
    const handleCopy = React.useCallback(async () => {
      if (copyable && copyText) {
        try {
          await navigator.clipboard.writeText(copyText);
          setIsCopied(true);
          onCopy?.(copyText);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
          console.error('Failed to copy text:', error);
        }
      }
    }, [copyable, copyText, onCopy]);

    // Handle share functionality
    const handleShare = React.useCallback(async () => {
      if (shareable && shareUrl && shareTitle) {
        try {
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              url: shareUrl,
            });
          } else {
            await navigator.clipboard.writeText(shareUrl);
          }
          setIsShared(true);
          onShare?.(shareUrl, shareTitle);
          setTimeout(() => setIsShared(false), 2000);
        } catch (error) {
          console.error('Failed to share:', error);
        }
      }
    }, [shareable, shareUrl, shareTitle, onShare]);

    // Handle bookmark functionality
    const handleBookmark = React.useCallback(() => {
      if (bookmarkable) {
        const newBookmarkState = !isBookmarkedState;
        setIsBookmarkedState(newBookmarkState);
        onBookmark?.(newBookmarkState);
      }
    }, [bookmarkable, isBookmarkedState, onBookmark]);

    // Handle like functionality
    const handleLike = React.useCallback(() => {
      if (likeable) {
        const newLikedState = !isLikedState;
        setIsLikedState(newLikedState);
        setLikesCountState(prev => newLikedState ? prev + 1 : prev - 1);
        onLike?.(newLikedState);
      }
    }, [likeable, isLikedState, onLike]);

    // Handle fullscreen functionality
    const handleFullscreen = React.useCallback(() => {
      if (fullscreenable) {
        const newFullscreenState = !isFullscreenState;
        setIsFullscreenState(newFullscreenState);
        onFullscreen?.(newFullscreenState);
      }
    }, [fullscreenable, isFullscreenState, onFullscreen]);

    // Handle expand/collapse functionality
    const handleExpand = React.useCallback(() => {
      if (isCollapsible) {
        const newExpandedState = !isExpandedState;
        setIsExpandedState(newExpandedState);
      }
    }, [isCollapsible, isExpandedState]);

    // Handle hover events
    const handleMouseEnter = React.useCallback(() => {
      setIsHovered(true);
      onHover?.(true);
    }, [onHover]);

    const handleMouseLeave = React.useCallback(() => {
      setIsHovered(false);
      onHover?.(false);
    }, [onHover]);

    // Handle focus events
    const handleFocus = React.useCallback(() => {
      setIsFocused(true);
      onFocus?.(true);
    }, [onFocus]);

    const handleBlur = React.useCallback(() => {
      setIsFocused(false);
      onFocus?.(false);
    }, [onFocus]);

    // Determine actual state values
    const actualLoading = loading || isLoading;
    const actualDisabled = disabled || isDisabled;
    const actualSelected = selected || isSelected;

    // Compose className
    const cardClassName = cn(
      cardVariants({
        variant,
        size,
        padding,
        interactive: interactive || !!onClick,
        loading: actualLoading,
        disabled: actualDisabled,
        selected: actualSelected,
        hover,
        animation,
        rounded,
        shadow,
        border,
        className
      }),
      customClasses
    );

    // Compose styles
    const cardStyles: React.CSSProperties = {
      ...customStyles,
      ...(animationDelay && { animationDelay: `${animationDelay}ms` }),
      ...(animationDuration && { animationDuration: `${animationDuration}ms` }),
      ...(animationEasing && { animationTimingFunction: animationEasing }),
    };

    // Render media
    const renderMedia = () => {
      if (!media) return null;

      const aspectRatioClasses = {
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[16/9]',
        ultrawide: 'aspect-[21/9]',
        portrait: 'aspect-[3/4]',
        landscape: 'aspect-[4/3]',
      };

      return (
        <div className={cn('relative overflow-hidden', aspectRatioClasses[media.aspectRatio || 'video'])}>
          {media.type === 'image' && (
            <img
              src={media.src}
              alt={media.alt || ''}
              className="w-full h-full object-cover"
            />
          )}
          {media.type === 'video' && (
            <video
              src={media.src}
              className="w-full h-full object-cover"
              controls
            />
          )}
          {media.type === 'audio' && (
            <audio
              src={media.src}
              className="w-full"
              controls
            />
          )}
          {media.overlay && media.overlayContent && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              {media.overlayContent}
            </div>
          )}
        </div>
      );
    };

    // Render actions
    const renderActions = () => {
      if (!actions) return null;

      return (
        <div className="flex items-center gap-2">
          {actions.primary && (
            <button
              onClick={actions.primary.onClick}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                actions.primary.variant === 'destructive' && 'bg-atlas-error-main text-white hover:bg-atlas-error-light',
                actions.primary.variant === 'outline' && 'border border-atlas-border hover:bg-atlas-border-subtle',
                actions.primary.variant === 'secondary' && 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
                actions.primary.variant === 'ghost' && 'hover:bg-atlas-border-subtle',
                actions.primary.variant === 'link' && 'text-atlas-primary-main hover:underline',
                !actions.primary.variant && 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light'
              )}
            >
              {actions.primary.icon && <span className="mr-2">{actions.primary.icon}</span>}
              {actions.primary.label}
            </button>
          )}
          {actions.secondary && (
            <button
              onClick={actions.secondary.onClick}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                actions.secondary.variant === 'destructive' && 'bg-atlas-error-main text-white hover:bg-atlas-error-light',
                actions.secondary.variant === 'outline' && 'border border-atlas-border hover:bg-atlas-border-subtle',
                actions.secondary.variant === 'secondary' && 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
                actions.secondary.variant === 'ghost' && 'hover:bg-atlas-border-subtle',
                actions.secondary.variant === 'link' && 'text-atlas-primary-main hover:underline',
                !actions.secondary.variant && 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light'
              )}
            >
              {actions.secondary.icon && <span className="mr-2">{actions.secondary.icon}</span>}
              {actions.secondary.label}
            </button>
          )}
          {actions.menu && (
            <div className="relative">
              <button className="p-2 hover:bg-atlas-border-subtle rounded-md">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      );
    };

    // Render badge
    const renderBadge = () => {
      if (!badge) return null;

      const positionClasses = {
        'top-left': 'top-2 left-2',
        'top-right': 'top-2 right-2',
        'bottom-left': 'bottom-2 left-2',
        'bottom-right': 'bottom-2 right-2',
      };

      return (
        <div className={cn('absolute z-10', positionClasses[badge.position || 'top-right'])}>
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              badge.variant === 'secondary' && 'bg-atlas-secondary-main text-white',
              badge.variant === 'destructive' && 'bg-atlas-error-main text-white',
              badge.variant === 'outline' && 'border border-atlas-border bg-atlas-card-bg',
              !badge.variant && 'bg-atlas-primary-main text-white'
            )}
          >
            {badge.text}
          </span>
        </div>
      );
    };

    // Render status
    const renderStatus = () => {
      if (!status) return null;

      const statusIcons = {
        success: <CheckCircle className="h-4 w-4 text-atlas-success-main" />,
        warning: <AlertTriangle className="h-4 w-4 text-atlas-warning-main" />,
        error: <XCircle className="h-4 w-4 text-atlas-error-main" />,
        info: <Info className="h-4 w-4 text-atlas-info-main" />,
        loading: <div className="h-4 w-4 animate-spin rounded-full border-2 border-atlas-primary-main border-t-transparent" />,
      };

      return (
        <div className="flex items-center gap-2">
          {status.icon || statusIcons[status.type]}
          {status.message && <span className="text-sm">{status.message}</span>}
        </div>
      );
    };

    // Render rating
    const renderRating = () => {
      if (!rating) return null;

      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: rating.max || 5 }, (_, i) => (
            <Star
              key={i}
              className={cn(
                'h-4 w-4',
                i < rating.value ? 'text-atlas-warning-main fill-current' : 'text-atlas-border',
                rating.size === 'sm' && 'h-3 w-3',
                rating.size === 'lg' && 'h-5 w-5'
              )}
              onClick={() => !rating.readonly && rating.onChange?.(i + 1)}
            />
          ))}
          {rating.showValue && <span className="text-sm ml-1">{rating.value}</span>}
        </div>
      );
    };

    // Render tags
    const renderTags = () => {
      if (!tags || tags.length === 0) return null;

      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                tag.variant === 'secondary' && 'bg-atlas-secondary-main text-white',
                tag.variant === 'destructive' && 'bg-atlas-error-main text-white',
                tag.variant === 'outline' && 'border border-atlas-border bg-atlas-card-bg',
                !tag.variant && 'bg-atlas-primary-main text-white'
              )}
            >
              {tag.text}
              {tag.removable && (
                <button
                  onClick={tag.onRemove}
                  className="ml-1 hover:text-atlas-text-secondary"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
      );
    };

    // Render progress
    const renderProgress = () => {
      if (!progress) return null;

      const percentage = (progress.value / (progress.max || 100)) * 100;

      return (
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{progress.showValue ? `${progress.value}/${progress.max || 100}` : 'Progress'}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-atlas-border rounded-full h-2">
            <div
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                progress.variant === 'success' && 'bg-atlas-success-main',
                progress.variant === 'warning' && 'bg-atlas-warning-main',
                progress.variant === 'error' && 'bg-atlas-error-main',
                !progress.variant && 'bg-atlas-primary-main',
                progress.size === 'sm' && 'h-1',
                progress.size === 'lg' && 'h-3'
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    };

    // Render stats
    const renderStats = () => {
      if (!stats || stats.length === 0) return null;

      return (
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {stat.icon}
                <span className="text-lg font-semibold">{stat.value}</span>
              </div>
              <div className="text-sm text-atlas-text-secondary">{stat.label}</div>
              {stat.trend && (
                <div className={cn(
                  'text-xs',
                  stat.trend.direction === 'up' && 'text-atlas-success-main',
                  stat.trend.direction === 'down' && 'text-atlas-error-main',
                  stat.trend.direction === 'neutral' && 'text-atlas-text-tertiary'
                )}>
                  {stat.trend.direction === 'up' && '+'}
                  {stat.trend.value}%
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    // Render avatar
    const renderAvatar = () => {
      if (!avatar) return null;

      const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
      };

      const statusClasses = {
        online: 'bg-atlas-success-main',
        offline: 'bg-atlas-text-tertiary',
        away: 'bg-atlas-warning-main',
        busy: 'bg-atlas-error-main',
      };

      return (
        <div className="relative">
          <div className={cn('rounded-full', sizeClasses[avatar.size || 'md'])}>
            {avatar.src ? (
              <img
                src={avatar.src}
                alt={avatar.alt || ''}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-atlas-border flex items-center justify-center text-sm font-medium">
                {avatar.fallback || '?'}
              </div>
            )}
          </div>
          {avatar.status && (
            <div className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white',
              statusClasses[avatar.status]
            )} />
          )}
        </div>
      );
    };

    // Render interactive buttons
    const renderInteractiveButtons = () => {
      const buttons = [];

      if (copyable) {
        buttons.push(
          <button
            key="copy"
            onClick={handleCopy}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title={isCopied ? 'Copied!' : 'Copy'}
          >
            {isCopied ? <Check className="h-4 w-4 text-atlas-success-main" /> : <Copy className="h-4 w-4" />}
          </button>
        );
      }

      if (shareable) {
        buttons.push(
          <button
            key="share"
            onClick={handleShare}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title={isShared ? 'Shared!' : 'Share'}
          >
            {isShared ? <Check className="h-4 w-4 text-atlas-success-main" /> : <Share2 className="h-4 w-4" />}
          </button>
        );
      }

      if (bookmarkable) {
        buttons.push(
          <button
            key="bookmark"
            onClick={handleBookmark}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title={isBookmarkedState ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className={cn('h-4 w-4', isBookmarkedState && 'fill-current text-atlas-warning-main')} />
          </button>
        );
      }

      if (likeable) {
        buttons.push(
          <button
            key="like"
            onClick={handleLike}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title={isLikedState ? 'Unlike' : 'Like'}
          >
            <Heart className={cn('h-4 w-4', isLikedState && 'fill-current text-atlas-error-main')} />
            {likesCountState > 0 && <span className="ml-1 text-sm">{likesCountState}</span>}
          </button>
        );
      }

      if (downloadable) {
        buttons.push(
          <button
            key="download"
            onClick={() => downloadUrl && downloadFilename && onDownload?.(downloadUrl, downloadFilename)}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        );
      }

      if (editable) {
        buttons.push(
          <button
            key="edit"
            onClick={onEdit}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
        );
      }

      if (deletable) {
        buttons.push(
          <button
            key="delete"
            onClick={onDelete}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors text-atlas-error-main"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        );
      }

      if (fullscreenable) {
        buttons.push(
          <button
            key="fullscreen"
            onClick={handleFullscreen}
            className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
            title={isFullscreenState ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreenState ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        );
      }

      if (buttons.length === 0) return null;

      return (
        <div className="flex items-center gap-1">
          {buttons}
        </div>
      );
    };

    // Compose card content
    const cardContent = (
      <div
        ref={ref}
        className={cardClassName}
        style={cardStyles}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        role={role || (interactive || onClick ? 'button' : undefined)}
        tabIndex={interactive || onClick ? 0 : undefined}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription}
        aria-expanded={ariaExpanded || (isCollapsible ? isExpandedState : undefined)}
        aria-selected={ariaSelected || actualSelected}
        {...props}
      >
        {/* Badge */}
        {renderBadge()}

        {/* Media */}
        {renderMedia()}

        {/* Header */}
        {(title || subtitle || avatar) && (
          <div className="flex items-start gap-3 p-6 pb-4">
            {avatar && renderAvatar()}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-atlas-text-primary">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-atlas-text-secondary mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {renderInteractiveButtons()}
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-4">
          {description && (
            <p className="text-sm text-atlas-text-secondary mb-4">
              {description}
            </p>
          )}
          
          {content && (
            <div className="mb-4">
              {content}
            </div>
          )}

          {/* Status */}
          {renderStatus()}

          {/* Rating */}
          {renderRating()}

          {/* Tags */}
          {renderTags()}

          {/* Progress */}
          {renderProgress()}

          {/* Stats */}
          {renderStats()}
        </div>

        {/* Actions */}
        {actions && (
          <div className="px-6 pb-4">
            {renderActions()}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    );

    // Wrap with link if href is provided
    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={external ? 'noopener noreferrer' : undefined}
          className="block"
        >
          {cardContent}
        </a>
      );
    }

    return cardContent;
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight text-atlas-text-primary',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-atlas-text-secondary', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Card Collection Component
interface CardCollectionProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
}

const CardCollection = React.forwardRef<HTMLDivElement, CardCollectionProps>(
  ({ className, orientation = 'vertical', spacing = 'md', columns = 1, children, ...props }, ref) => {
    const spacingClasses = {
      none: '',
      sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
      md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
      lg: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
    };

    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          orientation === 'vertical' && 'grid',
          orientation === 'horizontal' && 'flex',
          orientation === 'vertical' && gridClasses[columns],
          orientation === 'horizontal' && 'flex-wrap',
          spacingClasses[spacing],
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

CardCollection.displayName = 'CardCollection';

// Card Skeleton Component
interface CardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'media' | 'avatar' | 'minimal';
  lines?: number;
}

const CardSkeleton = React.forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, variant = 'default', lines = 3, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-atlas-card-bg p-6 animate-pulse',
          className
        )}
        {...props}
      >
        {variant === 'media' && (
          <div className="w-full h-48 bg-atlas-border rounded-md mb-4" />
        )}
        
        {variant === 'avatar' && (
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-atlas-border rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-atlas-border rounded w-3/4 mb-2" />
              <div className="h-3 bg-atlas-border rounded w-1/2" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {Array.from({ length: lines }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-3 bg-atlas-border rounded',
                i === lines - 1 && 'w-2/3'
              )}
            />
          ))}
        </div>
      </div>
    );
  }
);

CardSkeleton.displayName = 'CardSkeleton';

// Card Loading Component
interface CardLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  spinner?: React.ReactNode;
}

const CardLoading = React.forwardRef<HTMLDivElement, CardLoadingProps>(
  ({ className, message = 'Loading...', spinner, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-atlas-card-bg p-6 flex items-center justify-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {spinner || (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-atlas-primary-main border-t-transparent" />
          )}
          <p className="text-sm text-atlas-text-secondary">{message}</p>
        </div>
      </div>
    );
  }
);

CardLoading.displayName = 'CardLoading';

// Card Empty Component
interface CardEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardEmpty = React.forwardRef<HTMLDivElement, CardEmptyProps>(
  ({ className, title = 'No content', description, action, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-atlas-card-bg p-6 flex flex-col items-center justify-center text-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <div className="h-12 w-12 rounded-full bg-atlas-border flex items-center justify-center">
              <File className="h-6 w-6 text-atlas-text-tertiary" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-atlas-text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-atlas-text-secondary max-w-sm">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    );
  }
);

CardEmpty.displayName = 'CardEmpty';

// Card Error Component
interface CardErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardError = React.forwardRef<HTMLDivElement, CardErrorProps>(
  ({ className, title = 'Something went wrong', description, action, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-atlas-error-main bg-atlas-error-bg p-6 flex flex-col items-center justify-center text-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <div className="h-12 w-12 rounded-full bg-atlas-error-main/10 flex items-center justify-center">
              <XCircle className="h-6 w-6 text-atlas-error-main" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-atlas-error-main">{title}</h3>
          {description && (
            <p className="text-sm text-atlas-text-secondary max-w-sm">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    );
  }
);

CardError.displayName = 'CardError';

// Card Success Component
interface CardSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardSuccess = React.forwardRef<HTMLDivElement, CardSuccessProps>(
  ({ className, title = 'Success!', description, action, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-atlas-success-main bg-atlas-success-bg p-6 flex flex-col items-center justify-center text-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <div className="h-12 w-12 rounded-full bg-atlas-success-main/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-atlas-success-main" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-atlas-success-main">{title}</h3>
          {description && (
            <p className="text-sm text-atlas-text-secondary max-w-sm">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    );
  }
);

CardSuccess.displayName = 'CardSuccess';

// Card Warning Component
interface CardWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardWarning = React.forwardRef<HTMLDivElement, CardWarningProps>(
  ({ className, title = 'Warning', description, action, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-atlas-warning-main bg-atlas-warning-bg p-6 flex flex-col items-center justify-center text-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <div className="h-12 w-12 rounded-full bg-atlas-warning-main/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-atlas-warning-main" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-atlas-warning-main">{title}</h3>
          {description && (
            <p className="text-sm text-atlas-text-secondary max-w-sm">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    );
  }
);

CardWarning.displayName = 'CardWarning';

// Card Info Component
interface CardInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

const CardInfo = React.forwardRef<HTMLDivElement, CardInfoProps>(
  ({ className, title = 'Information', description, action, icon, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-atlas-info-main bg-atlas-info-bg p-6 flex flex-col items-center justify-center text-center',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-3">
          {icon || (
            <div className="h-12 w-12 rounded-full bg-atlas-info-main/10 flex items-center justify-center">
              <Info className="h-6 w-6 text-atlas-info-main" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-atlas-info-main">{title}</h3>
          {description && (
            <p className="text-sm text-atlas-text-secondary max-w-sm">{description}</p>
          )}
          {action && <div className="mt-4">{action}</div>}
        </div>
      </div>
    );
  }
);

CardInfo.displayName = 'CardInfo';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardCollection,
  CardSkeleton,
  CardLoading,
  CardEmpty,
  CardError,
  CardSuccess,
  CardWarning,
  CardInfo,
  cardVariants,
  type CardCollectionProps,
  type CardSkeletonProps,
  type CardLoadingProps,
  type CardEmptyProps,
  type CardErrorProps,
  type CardSuccessProps,
  type CardWarningProps,
  type CardInfoProps,
};
