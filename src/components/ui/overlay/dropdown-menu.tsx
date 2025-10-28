"use client";

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { 
  Check, 
  ChevronRight, 
  Circle, 
  ChevronDown,
  MoreHorizontal,
  Search,
  Filter,
  Settings,
  User,
  LogOut,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  Flag,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Home,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-atlas-border-subtle data-[state=open]:bg-atlas-border-subtle',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-dropdown min-w-[8rem] overflow-hidden rounded-md border bg-atlas-card-bg p-1 text-atlas-text-primary shadow-lg data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> &
    VariantProps<typeof dropdownMenuVariants>
>(({ className, variant, size, animation, rounded, shadow, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        dropdownMenuVariants({ variant, size, animation, rounded, shadow }),
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

// Enhanced Dropdown Menu Variants
const dropdownMenuVariants = cva(
  "z-dropdown min-w-[8rem] overflow-hidden rounded-md border bg-atlas-card-bg text-atlas-text-primary shadow-md",
  {
    variants: {
      variant: {
        default: "border-atlas-border",
        glass: "bg-white/10 backdrop-blur-md border-white/20 text-white",
        gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent",
        minimal: "bg-transparent border-atlas-border shadow-none",
        premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent",
        featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent",
        compact: "bg-atlas-text-primary/90 text-atlas-background border-transparent",
        spacious: "bg-atlas-text-primary/70 text-atlas-background border-transparent",
        success: "bg-atlas-success-light border-atlas-success-main text-atlas-success-dark",
        warning: "bg-atlas-warning-light border-atlas-warning-main text-atlas-warning-dark",
        error: "bg-atlas-error-light border-atlas-error-main text-atlas-error-dark",
        info: "bg-atlas-info-light border-atlas-info-main text-atlas-info-dark",
        ai: "bg-atlas-ai-main/10 border-atlas-ai-main text-atlas-ai-main",
        primary: "bg-atlas-primary-main/10 border-atlas-primary-main text-atlas-primary-main",
        secondary: "bg-atlas-secondary-main/10 border-atlas-secondary-main text-atlas-secondary-main"
      },
      size: {
        xs: "min-w-[6rem] p-0.5 text-xs",
        sm: "min-w-[7rem] p-1 text-sm",
        default: "min-w-[8rem] p-1 text-sm",
        lg: "min-w-[10rem] p-1.5 text-base",
        xl: "min-w-[12rem] p-2 text-lg"
      },
      animation: {
        none: "",
        fade: "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        slide: "data-[state=open]:animate-slide-in data-[state=closed]:animate-slide-out",
        scale: "data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out",
        bounce: "data-[state=open]:animate-bounce-in data-[state=closed]:animate-bounce-out",
        spring: "data-[state=open]:animate-spring-in data-[state=closed]:animate-spring-out"
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "rounded-md",
        md: "rounded-md",
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full"
      },
      shadow: {
        none: "shadow-none",
        sm: "shadow-sm",
        default: "shadow-md",
        md: "shadow-md",
        lg: "shadow-lg",
        xl: "shadow-xl",
        inner: "shadow-inner",
        glow: "shadow-glow"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
      rounded: "default",
      shadow: "default"
    }
  }
);

const dropdownMenuItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-atlas-border-subtle focus:text-atlas-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
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
        xs: 'px-1.5 py-1 text-xs',
        sm: 'px-2 py-1 text-sm',
        default: 'px-2 py-1.5 text-sm',
        lg: 'px-3 py-2 text-base',
        xl: 'px-4 py-2.5 text-lg'
      },
      inset: {
        true: 'pl-8',
        false: '',
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
      inset: false,
      animation: 'fade'
    },
  }
);

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> &
    VariantProps<typeof dropdownMenuItemVariants>
>(({ className, variant, size, inset, animation, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownMenuItemVariants({ variant, size, inset, animation, className }))}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-atlas-border-subtle focus:text-atlas-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-atlas-border-subtle focus:text-atlas-text-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold text-atlas-text-primary',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-atlas-border', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-atlas-text-tertiary', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

// Enhanced Dropdown Menu Interfaces
export interface DropdownMenuAction {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'ai' | 'primary' | 'secondary' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious';
  disabled?: boolean;
  shortcut?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
  separator?: boolean;
}

export interface DropdownMenuGroup {
  label?: string;
  items: DropdownMenuAction[];
  separator?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
  groups?: DropdownMenuGroup[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  alignOffset?: number;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'minimal' | 'premium' | 'featured' | 'compact' | 'spacious' | 'success' | 'warning' | 'error' | 'info' | 'ai' | 'primary' | 'secondary';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce' | 'spring';
  rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'inner' | 'glow';
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  maxHeight?: number;
  loading?: boolean;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAction?: (action: DropdownMenuAction) => void;
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

const EnhancedDropdownMenu = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuProps
>(({
  trigger,
  children,
  groups,
  align = 'end',
  side = 'bottom',
  sideOffset = 4,
  alignOffset = 0,
  className,
  variant = 'default',
  size = 'default',
  animation = 'scale',
  rounded = 'default',
  shadow = 'default',
  searchable = false,
  searchPlaceholder = 'Search...',
  onSearch,
  maxHeight = 300,
  loading = false,
  disabled = false,
  open,
  onOpenChange,
  onAction,
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
  role = 'menu',
  customStyles,
  customClasses,
  ...props
}, ref) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

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

  const handleAction = React.useCallback((action: DropdownMenuAction) => {
    if (action.disabled || action.loading) return;
    
    action.onClick?.();
    onAction?.(action);
    
    if (closeOnSelect) {
      handleOpenChange(false);
    }
  }, [closeOnSelect, onAction, handleOpenChange]);

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery || !groups) return groups;
    
    return groups.map(group => ({
      ...group,
      items: group.items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.items.length > 0);
  }, [groups, searchQuery]);

  const getDefaultIcon = React.useCallback((action: DropdownMenuAction) => {
    if (action.icon) return action.icon;
    
    switch (action.variant) {
      case 'destructive':
        return <Trash2 className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'ai':
        return <Settings className="h-4 w-4" />;
      case 'primary':
        return <Star className="h-4 w-4" />;
      case 'secondary':
        return <Heart className="h-4 w-4" />;
      default:
        return <MoreHorizontal className="h-4 w-4" />;
    }
  }, []);

  const renderGroups = React.useCallback(() => {
    if (!filteredGroups) return null;
    
    return filteredGroups.map((group, groupIndex) => (
      <React.Fragment key={groupIndex}>
        {group.label && (
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-semibold text-atlas-text-tertiary">
            {group.label}
          </DropdownMenuLabel>
        )}
        
        {group.items.map((action, actionIndex) => (
          <React.Fragment key={actionIndex}>
            <DropdownMenuItem
              variant={action.variant}
              size={size}
              disabled={action.disabled || action.loading}
              onClick={() => handleAction(action)}
              className={cn(
                "flex items-center gap-2",
                action.loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {action.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getDefaultIcon(action)
              )}
              
              <span className="flex-1">{action.label}</span>
              
              {action.badge && (
                <span className={cn(
                  "px-1.5 py-0.5 text-xs rounded-full",
                  action.badgeVariant === 'success' && "bg-atlas-success-light text-atlas-success-dark",
                  action.badgeVariant === 'warning' && "bg-atlas-warning-light text-atlas-warning-dark",
                  action.badgeVariant === 'error' && "bg-atlas-error-light text-atlas-error-dark",
                  action.badgeVariant === 'info' && "bg-atlas-info-light text-atlas-info-dark",
                  !action.badgeVariant && "bg-atlas-border-subtle text-atlas-text-secondary"
                )}>
                  {action.badge}
                </span>
              )}
              
              {action.shortcut && (
                <DropdownMenuShortcut>{action.shortcut}</DropdownMenuShortcut>
              )}
            </DropdownMenuItem>
            
            {action.separator && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
        
        {group.separator && groupIndex < filteredGroups.length - 1 && (
          <DropdownMenuSeparator />
        )}
      </React.Fragment>
    ));
  }, [filteredGroups, size, handleAction, getDefaultIcon]);

  return (
    <DropdownMenu
      open={open !== undefined ? open : isOpen}
      onOpenChange={handleOpenChange}
      modal={modal}
    >
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className={cn(
          dropdownMenuVariants({ variant, size, animation, rounded, shadow }),
          customClasses,
          className
        )}
        style={{
          maxHeight: `${maxHeight}px`,
          ...customStyles
        }}
        role={role}
        aria-label={ariaLabel}
        aria-describedby={ariaDescription}
        onCloseAutoFocus={(e) => {
          if (!restoreFocus) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!closeOnEscape) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (!closeOnOutsideClick) e.preventDefault();
        }}
        {...props}
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
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm bg-transparent border-none outline-none placeholder-atlas-text-tertiary"
              />
            </div>
          </div>
        )}
        
        {!loading && (
          <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight - (searchable ? 60 : 0)}px` }}>
            {children || renderGroups()}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
EnhancedDropdownMenu.displayName = 'EnhancedDropdownMenu';

// Dropdown Menu Utility Components
const DropdownMenuSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    placeholder?: string;
    onSearch?: (query: string) => void;
  }
>(({ className, placeholder = 'Search...', onSearch, ...props }, ref) => (
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
DropdownMenuSearch.displayName = 'DropdownMenuSearch';

const DropdownMenuLoading = React.forwardRef<
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
DropdownMenuLoading.displayName = 'DropdownMenuLoading';

const DropdownMenuEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    message?: string;
    icon?: React.ReactNode;
  }
>(({ className, message = 'No items found', icon, ...props }, ref) => (
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
DropdownMenuEmpty.displayName = 'DropdownMenuEmpty';

// Dropdown Menu Variant Components
const DropdownMenuGlass = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="glass" {...props} />);
DropdownMenuGlass.displayName = 'DropdownMenuGlass';

const DropdownMenuGradient = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="gradient" {...props} />);
DropdownMenuGradient.displayName = 'DropdownMenuGradient';

const DropdownMenuMinimal = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="minimal" {...props} />);
DropdownMenuMinimal.displayName = 'DropdownMenuMinimal';

const DropdownMenuPremium = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="premium" {...props} />);
DropdownMenuPremium.displayName = 'DropdownMenuPremium';

const DropdownMenuFeatured = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="featured" {...props} />);
DropdownMenuFeatured.displayName = 'DropdownMenuFeatured';

const DropdownMenuCompact = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="compact" {...props} />);
DropdownMenuCompact.displayName = 'DropdownMenuCompact';

const DropdownMenuSpacious = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="spacious" {...props} />);
DropdownMenuSpacious.displayName = 'DropdownMenuSpacious';

const DropdownMenuSuccess = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="success" {...props} />);
DropdownMenuSuccess.displayName = 'DropdownMenuSuccess';

const DropdownMenuWarning = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="warning" {...props} />);
DropdownMenuWarning.displayName = 'DropdownMenuWarning';

const DropdownMenuError = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="error" {...props} />);
DropdownMenuError.displayName = 'DropdownMenuError';

const DropdownMenuInfo = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="info" {...props} />);
DropdownMenuInfo.displayName = 'DropdownMenuInfo';

const DropdownMenuAI = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="ai" {...props} />);
DropdownMenuAI.displayName = 'DropdownMenuAI';

const DropdownMenuPrimary = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="primary" {...props} />);
DropdownMenuPrimary.displayName = 'DropdownMenuPrimary';

const DropdownMenuSecondary = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'variant'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} variant="secondary" {...props} />);
DropdownMenuSecondary.displayName = 'DropdownMenuSecondary';

// Dropdown Menu Size Components
const DropdownMenuSmall = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'size'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} size="sm" {...props} />);
DropdownMenuSmall.displayName = 'DropdownMenuSmall';

const DropdownMenuLarge = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'size'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} size="lg" {...props} />);
DropdownMenuLarge.displayName = 'DropdownMenuLarge';

const DropdownMenuExtraSmall = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'size'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} size="xs" {...props} />);
DropdownMenuExtraSmall.displayName = 'DropdownMenuExtraSmall';

const DropdownMenuExtraLarge = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  Omit<DropdownMenuProps, 'size'>
>((props, ref) => <EnhancedDropdownMenu ref={ref} size="xl" {...props} />);
DropdownMenuExtraLarge.displayName = 'DropdownMenuExtraLarge';

// Dropdown Menu Management Hook
export const useDropdownMenu = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);
  
  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
};

// Dropdown Menu Utilities
export const DropdownMenuSizes = {
  xs: "min-w-[6rem] p-0.5 text-xs",
  sm: "min-w-[7rem] p-1 text-sm",
  default: "min-w-[8rem] p-1 text-sm",
  lg: "min-w-[10rem] p-1.5 text-base",
  xl: "min-w-[12rem] p-2 text-lg"
} as const;

export const DropdownMenuVariants = {
  default: "border-atlas-border bg-atlas-card-bg text-atlas-text-primary",
  glass: "bg-white/10 backdrop-blur-md border-white/20 text-white",
  gradient: "bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main text-white border-transparent",
  minimal: "bg-transparent border-atlas-border shadow-none text-atlas-text-primary",
  premium: "bg-gradient-to-r from-atlas-warning-main to-atlas-success-main text-white border-transparent",
  featured: "bg-gradient-to-r from-atlas-primary-main to-atlas-ai-main text-white border-transparent",
  compact: "bg-atlas-text-primary/90 text-atlas-background border-transparent",
  spacious: "bg-atlas-text-primary/70 text-atlas-background border-transparent",
  success: "bg-atlas-success-light border-atlas-success-main text-atlas-success-dark",
  warning: "bg-atlas-warning-light border-atlas-warning-main text-atlas-warning-dark",
  error: "bg-atlas-error-light border-atlas-error-main text-atlas-error-dark",
  info: "bg-atlas-info-light border-atlas-info-main text-atlas-info-dark",
  ai: "bg-atlas-ai-main/10 border-atlas-ai-main text-atlas-ai-main",
  primary: "bg-atlas-primary-main/10 border-atlas-primary-main text-atlas-primary-main",
  secondary: "bg-atlas-secondary-main/10 border-atlas-secondary-main text-atlas-secondary-main"
} as const;

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  EnhancedDropdownMenu,
  DropdownMenuSearch,
  DropdownMenuLoading,
  DropdownMenuEmpty,
  DropdownMenuGlass,
  DropdownMenuGradient,
  DropdownMenuMinimal,
  DropdownMenuPremium,
  DropdownMenuFeatured,
  DropdownMenuCompact,
  DropdownMenuSpacious,
  DropdownMenuSuccess,
  DropdownMenuWarning,
  DropdownMenuError,
  DropdownMenuInfo,
  DropdownMenuAI,
  DropdownMenuPrimary,
  DropdownMenuSecondary,
  DropdownMenuSmall,
  DropdownMenuLarge,
  DropdownMenuExtraSmall,
  DropdownMenuExtraLarge,
  dropdownMenuVariants,
  dropdownMenuItemVariants,
  useDropdownMenu,
  DropdownMenuSizes,
  DropdownMenuVariants
};
