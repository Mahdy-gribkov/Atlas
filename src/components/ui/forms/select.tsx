"use client";

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { 
  Check, 
  ChevronDown, 
  ChevronUp,
  Search,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Heart,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Globe,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Copy,
  Share,
  Edit,
  Trash2,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  ExternalLink,
  Bookmark,
  Flag,
  Tag,
  Hash,
  DollarSign,
  Percent,
  Zap,
  Target,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

// Enhanced Select Trigger Variants
const selectTriggerVariants = cva(
  'flex w-full items-center justify-between rounded-md border bg-atlas-card-bg px-3 py-2 text-sm ring-offset-background placeholder:text-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main focus:ring-atlas-error-main',
        success: 'border-atlas-success-main focus:ring-atlas-success-main',
        warning: 'border-atlas-warning-main focus:ring-atlas-warning-main',
        info: 'border-atlas-info-main focus:ring-atlas-info-main',
        ai: 'border-atlas-ai-main focus:ring-atlas-ai-main',
        primary: 'border-atlas-primary-main focus:ring-atlas-primary-main',
        secondary: 'border-atlas-secondary-main focus:ring-atlas-secondary-main',
        glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/70 focus:ring-white/50',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent placeholder:text-white/70 focus:ring-white/50',
        minimal: 'bg-transparent border-atlas-border shadow-none focus:ring-atlas-primary-main',
        premium: 'bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent placeholder:text-white/70 focus:ring-white/50',
        featured: 'bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent placeholder:text-white/70 focus:ring-white/50',
        compact: 'bg-atlas-text-primary/90 text-atlas-background border-transparent placeholder:text-atlas-background/70 focus:ring-atlas-background/50',
        spacious: 'bg-atlas-text-primary/70 text-atlas-background border-transparent placeholder:text-atlas-background/70 focus:ring-atlas-background/50'
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
        xl: 'h-14 px-5 text-lg'
      },
      animation: {
        none: '',
        fade: 'transition-opacity duration-200',
        slide: 'transition-transform duration-200',
        scale: 'transition-transform duration-200',
        bounce: 'transition-transform duration-300',
        spring: 'transition-transform duration-500'
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        default: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        glow: 'shadow-glow'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'fade',
      rounded: 'default',
      shadow: 'default'
    },
  }
);

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerVariants>
>(({ className, variant, size, animation, rounded, shadow, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size, animation, rounded, shadow, className }))}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// Enhanced Select Content Variants
const selectContentVariants = cva(
  'relative z-dropdown max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-atlas-card-bg text-atlas-text-primary shadow-md',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        glass: 'bg-white/10 backdrop-blur-md border-white/20 text-white',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent',
        minimal: 'bg-transparent border-atlas-border shadow-none',
        premium: 'bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent',
        featured: 'bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent',
        compact: 'bg-atlas-text-primary/90 text-atlas-background border-transparent',
        spacious: 'bg-atlas-text-primary/70 text-atlas-background border-transparent',
        success: 'bg-atlas-success-light border-atlas-success-main text-atlas-success-dark',
        warning: 'bg-atlas-warning-light border-atlas-warning-main text-atlas-warning-dark',
        error: 'bg-atlas-error-light border-atlas-error-main text-atlas-error-dark',
        info: 'bg-atlas-info-light border-atlas-info-main text-atlas-info-dark',
        ai: 'bg-atlas-ai-main/10 border-atlas-ai-main text-atlas-ai-main',
        primary: 'bg-atlas-primary-main/10 border-atlas-primary-main text-atlas-primary-main',
        secondary: 'bg-atlas-secondary-main/10 border-atlas-secondary-main text-atlas-secondary-main'
      },
      size: {
        xs: 'min-w-[6rem] p-0.5 text-xs',
        sm: 'min-w-[7rem] p-1 text-sm',
        default: 'min-w-[8rem] p-1 text-sm',
        lg: 'min-w-[10rem] p-1.5 text-base',
        xl: 'min-w-[12rem] p-2 text-lg'
      },
      animation: {
        none: '',
        fade: 'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        slide: 'data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out',
        scale: 'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
        bounce: 'data-[state=open]:animate-bounce-in data-[state=closed]:animate-bounce-out',
        spring: 'data-[state=open]:animate-spring-in data-[state=closed]:animate-spring-out'
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full'
      },
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        default: 'shadow-md',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        inner: 'shadow-inner',
        glow: 'shadow-glow'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'scale',
      rounded: 'default',
      shadow: 'default'
    }
  }
);

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> &
    VariantProps<typeof selectContentVariants>
>(({ className, children, position = 'popper', variant, size, animation, rounded, shadow, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        selectContentVariants({ variant, size, animation, rounded, shadow }),
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const selectItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-atlas-border-subtle focus:text-atlas-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-atlas-error-main focus:bg-atlas-error-bg focus:text-atlas-error-dark',
        success: 'text-atlas-success-main focus:bg-atlas-success-bg focus:text-atlas-success-dark',
        warning: 'text-atlas-warning-main focus:bg-atlas-warning-bg focus:text-atlas-warning-dark',
        info: 'text-atlas-info-main focus:bg-atlas-info-bg focus:text-atlas-info-dark',
        ai: 'text-atlas-ai-main focus:bg-atlas-ai-main/10 focus:text-atlas-ai-main',
        primary: 'text-atlas-primary-main focus:bg-atlas-primary-main/10 focus:text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main focus:bg-atlas-secondary-main/10 focus:text-atlas-secondary-main',
        glass: 'text-white focus:bg-white/10 focus:text-white',
        gradient: 'text-white focus:bg-white/10 focus:text-white',
        minimal: 'text-atlas-text-primary focus:bg-atlas-border-subtle focus:text-atlas-text-primary',
        premium: 'text-white focus:bg-white/10 focus:text-white',
        featured: 'text-white focus:bg-white/10 focus:text-white',
        compact: 'text-atlas-background focus:bg-atlas-background/10 focus:text-atlas-background',
        spacious: 'text-atlas-background focus:bg-atlas-background/10 focus:text-atlas-background'
      },
      size: {
        xs: 'py-1 pl-6 pr-1.5 text-xs',
        sm: 'py-1 pl-7 pr-2 text-xs',
        default: 'py-1.5 pl-8 pr-2 text-sm',
        lg: 'py-2 pl-9 pr-2.5 text-base',
        xl: 'py-2.5 pl-10 pr-3 text-lg'
      },
      animation: {
        none: '',
        fade: 'transition-opacity duration-200',
        slide: 'transition-transform duration-200',
        scale: 'transition-transform duration-200',
        bounce: 'transition-transform duration-300',
        spring: 'transition-transform duration-500'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'fade'
    },
  }
);

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
    VariantProps<typeof selectItemVariants>
>(({ className, variant, size, animation, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectItemVariants({ variant, size, animation, className }))}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold text-atlas-text-primary', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-atlas-border', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Enhanced Select Interfaces
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  group?: string;
  loading?: boolean;
  separator?: boolean;
}

export interface SelectGroup {
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  separator?: boolean;
}

export interface EnhancedSelectProps {
  options?: SelectOption[];
  groups?: SelectGroup[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  infoMessage?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info' | 'ai' | 'primary' | 'secondary' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
  rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  maxHeight?: number;
  position?: 'popper' | 'item-aligned';
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  onOpenChange?: (open: boolean) => void;
  keyboardNavigation?: boolean;
  closeOnSelect?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  modal?: boolean;
  preventScroll?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  ariaLabel?: string;
  ariaDescription?: string;
  role?: string;
  customStyles?: React.CSSProperties;
  customClasses?: string;
}

const EnhancedSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  EnhancedSelectProps
>(({
  options = [],
  groups = [],
  value,
  onValueChange,
  placeholder = 'Select an option...',
  label,
  helperText,
  errorMessage,
  successMessage,
  warningMessage,
  infoMessage,
  disabled = false,
  required = false,
  variant = 'default',
  size = 'default',
  animation = 'fade',
  rounded = 'default',
  shadow = 'default',
  className,
  searchable = false,
  clearable = false,
  multiple = false,
  loading = false,
  emptyMessage = 'No options found',
  maxHeight = 300,
  position = 'popper',
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  alignOffset = 0,
  onSearch,
  onClear,
  onOpenChange,
  keyboardNavigation = true,
  closeOnSelect = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  modal = false,
  preventScroll = false,
  trapFocus = true,
  restoreFocus = true,
  ariaLabel,
  ariaDescription,
  role = 'combobox',
  customStyles,
  customClasses,
  ...props
}, ref) => {
  const selectId = React.useId();
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);
  
  // Determine the actual variant based on messages
  const actualVariant = errorMessage 
    ? 'error' 
    : successMessage 
    ? 'success' 
    : warningMessage 
    ? 'warning' 
    : infoMessage
    ? 'info'
    : variant;

  const message = errorMessage || successMessage || warningMessage || infoMessage;

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    
    if (newOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [onOpenChange, searchable]);

  const handleSearch = React.useCallback((query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  }, [onSearch]);

  const handleClear = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.('');
    onClear?.();
  }, [onValueChange, onClear]);

  const getDefaultIcon = React.useCallback((option: SelectOption) => {
    if (option.icon) return option.icon;
    
    switch (option.badgeVariant) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  }, []);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery) return groups;
    
    return groups.map(group => ({
      ...group,
      options: group.options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.options.length > 0);
  }, [groups, searchQuery]);

  const renderOptions = React.useCallback(() => {
    if (groups.length > 0) {
      return filteredGroups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-atlas-text-tertiary">
            {group.label}
          </SelectLabel>
          
          {group.options.map((option, optionIndex) => (
            <React.Fragment key={optionIndex}>
              <SelectItem
                value={option.value}
                disabled={option.disabled || option.loading}
                variant={option.badgeVariant}
                size={size}
                animation={animation}
                className={cn(
                  "flex items-center gap-2",
                  option.loading && "opacity-50 cursor-not-allowed"
                )}
              >
                {option.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  getDefaultIcon(option)
                )}
                
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="truncate">{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-atlas-text-tertiary truncate">
                      {option.description}
                    </span>
                  )}
                </div>
                
                {option.badge && (
                  <span className={cn(
                    "px-1.5 py-0.5 text-xs rounded-full",
                    option.badgeVariant === 'success' && "bg-atlas-success-light text-atlas-success-dark",
                    option.badgeVariant === 'warning' && "bg-atlas-warning-light text-atlas-warning-dark",
                    option.badgeVariant === 'error' && "bg-atlas-error-light text-atlas-error-dark",
                    option.badgeVariant === 'info' && "bg-atlas-info-light text-atlas-info-dark",
                    !option.badgeVariant && "bg-atlas-border-subtle text-atlas-text-secondary"
                  )}>
                    {option.badge}
                  </span>
                )}
              </SelectItem>
              
              {option.separator && <SelectSeparator />}
            </React.Fragment>
          ))}
          
          {group.separator && groupIndex < filteredGroups.length - 1 && (
            <SelectSeparator />
          )}
        </React.Fragment>
      ));
    }

    return filteredOptions.map((option, index) => (
      <React.Fragment key={index}>
        <SelectItem
          value={option.value}
          disabled={option.disabled || option.loading}
          variant={option.badgeVariant}
          size={size}
          animation={animation}
          className={cn(
            "flex items-center gap-2",
            option.loading && "opacity-50 cursor-not-allowed"
          )}
        >
          {option.loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            getDefaultIcon(option)
          )}
          
          <div className="flex flex-col flex-1 min-w-0">
            <span className="truncate">{option.label}</span>
            {option.description && (
              <span className="text-xs text-atlas-text-tertiary truncate">
                {option.description}
              </span>
            )}
          </div>
          
          {option.badge && (
            <span className={cn(
              "px-1.5 py-0.5 text-xs rounded-full",
              option.badgeVariant === 'success' && "bg-atlas-success-light text-atlas-success-dark",
              option.badgeVariant === 'warning' && "bg-atlas-warning-light text-atlas-warning-dark",
              option.badgeVariant === 'error' && "bg-atlas-error-light text-atlas-error-dark",
              option.badgeVariant === 'info' && "bg-atlas-info-light text-atlas-info-dark",
              !option.badgeVariant && "bg-atlas-border-subtle text-atlas-text-secondary"
            )}>
              {option.badge}
            </span>
          )}
        </SelectItem>
        
        {option.separator && <SelectSeparator />}
      </React.Fragment>
    ));
  }, [groups, filteredGroups, filteredOptions, size, animation, getDefaultIcon]);

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-atlas-text-primary"
        >
          {label}
          {required && (
            <span className="ml-1 text-atlas-error-main" aria-label="required">
              *
            </span>
          )}
        </label>
      )}
      
      <Select 
        value={value} 
        onValueChange={onValueChange} 
        disabled={disabled}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          ref={ref}
          id={selectId}
          variant={actualVariant}
          size={size}
          animation={animation}
          rounded={rounded}
          shadow={shadow}
          className={cn(
            clearable && value && 'pr-8',
            customClasses,
            className
          )}
          style={customStyles}
          aria-describedby={cn(
            message && errorId,
            helperText && helperId
          )}
          aria-invalid={!!errorMessage}
          aria-required={required}
          aria-label={ariaLabel}
          aria-describedby={ariaDescription}
          role={role}
        >
          <SelectValue placeholder={placeholder} />
          {clearable && value && (
            <button
              type="button"
              className="absolute right-8 top-1/2 -translate-y-1/2 text-atlas-text-tertiary hover:text-atlas-text-primary transition-colors"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </SelectTrigger>
        
        <SelectContent
          variant={actualVariant}
          size={size}
          animation={animation}
          rounded={rounded}
          shadow={shadow}
          position={position}
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          style={{ maxHeight: `${maxHeight}px` }}
          onCloseAutoFocus={(e) => {
            if (!restoreFocus) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (!closeOnEscape) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (!closeOnOutsideClick) e.preventDefault();
          }}
        >
          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          
          {!loading && searchable && (
            <div className="p-2 border-b border-atlas-border">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-atlas-text-tertiary" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-8 pr-2 py-1.5 text-sm bg-transparent border-none outline-none placeholder-atlas-text-tertiary"
                />
              </div>
            </div>
          )}
          
          {!loading && (
            <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight - (searchable ? 60 : 0)}px` }}>
              {renderOptions()}
              
              {(filteredOptions.length === 0 && groups.length === 0) && (
                <div className="flex flex-col items-center justify-center p-4 text-center text-atlas-text-tertiary">
                  <Search className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">{emptyMessage}</p>
                </div>
              )}
            </div>
          )}
        </SelectContent>
      </Select>
      
      {(message || helperText) && (
        <div className="space-y-1">
          {message && (
            <p
              id={errorId}
              className={cn(
                'text-sm',
                errorMessage && 'text-atlas-error-main',
                successMessage && 'text-atlas-success-main',
                warningMessage && 'text-atlas-warning-main',
                infoMessage && 'text-atlas-info-main'
              )}
              role={errorMessage ? 'alert' : undefined}
            >
              {message}
            </p>
          )}
          {helperText && (
            <p
              id={helperId}
              className="text-sm text-atlas-text-tertiary"
            >
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
});
EnhancedSelect.displayName = 'EnhancedSelect';

// Select Utility Components
const SelectSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    placeholder?: string;
    onSearch?: (query: string) => void;
  }
>(({ className, placeholder = 'Search options...', onSearch, ...props }, ref) => (
  <div className="p-2 border-b border-atlas-border">
    <div className="relative">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-atlas-text-tertiary" />
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        className={cn(
          "w-full pl-8 pr-2 py-1.5 text-sm bg-transparent border-none outline-none placeholder-atlas-text-tertiary",
          className
        )}
        {...props}
      />
    </div>
  </div>
));
SelectSearch.displayName = 'SelectSearch';

const SelectLoading = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center p-4",
      size === 'sm' && "p-2",
      size === 'lg' && "p-6",
      className
    )}
    {...props}
  >
    <Loader2 className={cn(
      "animate-spin",
      size === 'sm' && "h-4 w-4",
      size === 'default' && "h-6 w-6",
      size === 'lg' && "h-8 w-8"
    )} />
  </div>
));
SelectLoading.displayName = 'SelectLoading';

const SelectEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message?: string;
    icon?: React.ReactNode;
  }
>(({ className, message = 'No options found', icon, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center p-4 text-center text-atlas-text-tertiary",
      className
    )}
    {...props}
  >
    {icon || <Search className="h-8 w-8 mb-2 opacity-50" />}
    <p className="text-sm">{message}</p>
  </div>
));
SelectEmpty.displayName = 'SelectEmpty';

// Select Variant Components
const SelectGlass = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="glass" {...props} />);
SelectGlass.displayName = 'SelectGlass';

const SelectGradient = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="gradient" {...props} />);
SelectGradient.displayName = 'SelectGradient';

const SelectMinimal = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="minimal" {...props} />);
SelectMinimal.displayName = 'SelectMinimal';

const SelectPremium = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="premium" {...props} />);
SelectPremium.displayName = 'SelectPremium';

const SelectFeatured = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="featured" {...props} />);
SelectFeatured.displayName = 'SelectFeatured';

const SelectCompact = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="compact" {...props} />);
SelectCompact.displayName = 'SelectCompact';

const SelectSpacious = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="spacious" {...props} />);
SelectSpacious.displayName = 'SelectSpacious';

const SelectSuccess = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="success" {...props} />);
SelectSuccess.displayName = 'SelectSuccess';

const SelectWarning = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="warning" {...props} />);
SelectWarning.displayName = 'SelectWarning';

const SelectError = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="error" {...props} />);
SelectError.displayName = 'SelectError';

const SelectInfo = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="info" {...props} />);
SelectInfo.displayName = 'SelectInfo';

const SelectAI = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="ai" {...props} />);
SelectAI.displayName = 'SelectAI';

const SelectPrimary = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="primary" {...props} />);
SelectPrimary.displayName = 'SelectPrimary';

const SelectSecondary = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'variant'>
>((props, ref) => <EnhancedSelect ref={ref} variant="secondary" {...props} />);
SelectSecondary.displayName = 'SelectSecondary';

// Select Size Components
const SelectSmall = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'size'>
>((props, ref) => <EnhancedSelect ref={ref} size="sm" {...props} />);
SelectSmall.displayName = 'SelectSmall';

const SelectLarge = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'size'>
>((props, ref) => <EnhancedSelect ref={ref} size="lg" {...props} />);
SelectLarge.displayName = 'SelectLarge';

const SelectExtraSmall = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'size'>
>((props, ref) => <EnhancedSelect ref={ref} size="xs" {...props} />);
SelectExtraSmall.displayName = 'SelectExtraSmall';

const SelectExtraLarge = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  Omit<EnhancedSelectProps, 'size'>
>((props, ref) => <EnhancedSelect ref={ref} size="xl" {...props} />);
SelectExtraLarge.displayName = 'SelectExtraLarge';

// Select Management Hook
export const useSelect = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState<string>('');
  
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
    value,
    setValue
  };
};

// Select Utilities
export const SelectSizes = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-2 text-xs",
  default: "h-10 px-3 text-sm",
  lg: "h-12 px-4 text-base",
  xl: "h-14 px-5 text-lg"
} as const;

export const SelectVariants = {
  default: "border-atlas-border bg-atlas-card-bg text-atlas-text-primary",
  error: "border-atlas-error-main focus:ring-atlas-error-main",
  success: "border-atlas-success-main focus:ring-atlas-success-main",
  warning: "border-atlas-warning-main focus:ring-atlas-warning-main",
  info: "border-atlas-info-main focus:ring-atlas-info-main",
  ai: "border-atlas-ai-main focus:ring-atlas-ai-main",
  primary: "border-atlas-primary-main focus:ring-atlas-primary-main",
  secondary: "border-atlas-secondary-main focus:ring-atlas-secondary-main",
  glass: "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/70 focus:ring-white/50",
  gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent placeholder:text-white/70 focus:ring-white/50",
  minimal: "bg-transparent border-atlas-border shadow-none focus:ring-atlas-primary-main",
  premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent placeholder:text-white/70 focus:ring-white/50",
  featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent placeholder:text-white/70 focus:ring-white/50",
  compact: "bg-atlas-text-primary/90 text-atlas-background border-transparent placeholder:text-atlas-background/70 focus:ring-atlas-background/50",
  spacious: "bg-atlas-text-primary/70 text-atlas-background border-transparent placeholder:text-atlas-background/70 focus:ring-atlas-background/50"
} as const;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
  EnhancedSelect,
  selectTriggerVariants,
  selectContentVariants,
  selectItemVariants,
  SelectSearch,
  SelectLoading,
  SelectEmpty,
  SelectGlass,
  SelectGradient,
  SelectMinimal,
  SelectPremium,
  SelectFeatured,
  SelectCompact,
  SelectSpacious,
  SelectSuccess,
  SelectWarning,
  SelectError,
  SelectInfo,
  SelectAI,
  SelectPrimary,
  SelectSecondary,
  SelectSmall,
  SelectLarge,
  SelectExtraSmall,
  SelectExtraLarge,
  useSelect,
  SelectSizes,
  SelectVariants,
};
