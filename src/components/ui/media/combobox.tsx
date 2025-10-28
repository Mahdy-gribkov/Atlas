import * as React from 'react';
import * as ComboboxPrimitive from '@radix-ui/react-combobox';
import { 
  CheckIcon, 
  ChevronDownIcon, 
  SearchIcon, 
  XIcon,
  LoaderIcon
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const comboboxVariants = cva(
  'relative w-full',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border border-atlas-border rounded-lg',
        ghost: 'border-0',
        minimal: 'border-b border-atlas-border-subtle rounded-none',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const comboboxTriggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border border-atlas-border bg-atlas-card-bg px-3 py-2 text-sm ring-offset-background placeholder:text-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg',
        outlined: 'border-2 border-atlas-primary-main bg-atlas-card-bg',
        ghost: 'border-transparent bg-transparent',
        minimal: 'border-0 border-b border-atlas-border-subtle rounded-none bg-transparent',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: '',
        error: 'border-atlas-error-main focus:ring-atlas-error-main',
        success: 'border-atlas-success-main focus:ring-atlas-success-main',
        warning: 'border-atlas-warning-main focus:ring-atlas-warning-main',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const comboboxContentVariants = cva(
  'relative z-dropdown max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-atlas-border bg-atlas-card-bg text-atlas-text-primary shadow-md',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg',
        elevated: 'border-atlas-border bg-atlas-card-bg shadow-lg',
        ghost: 'border-transparent bg-transparent shadow-none',
        minimal: 'border-atlas-border-subtle bg-atlas-border-subtle',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const comboboxItemVariants = cva(
  'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-atlas-primary-main focus:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        elevated: 'hover:bg-atlas-primary-lighter hover:text-atlas-primary-main',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
      },
      size: {
        sm: 'py-1 pl-6 text-xs',
        default: 'py-1.5 pl-8 text-sm',
        lg: 'py-2 pl-10 text-base',
      },
      state: {
        default: '',
        selected: 'bg-atlas-primary-main text-white',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const comboboxLabelVariants = cva(
  'text-sm font-medium text-atlas-text-primary',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const comboboxSeparatorVariants = cva(
  '-mx-1 my-1 h-px bg-atlas-border',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border',
        subtle: 'bg-atlas-border-subtle',
        none: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const comboboxEmptyVariants = cva(
  'py-6 text-center text-sm text-atlas-text-tertiary',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'py-4',
        compact: 'py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ComboboxProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Root>,
    VariantProps<typeof comboboxVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  children: React.ReactNode;
}

export interface ComboboxTriggerProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Trigger>,
    VariantProps<typeof comboboxTriggerVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'error' | 'success' | 'warning';
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface ComboboxContentProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Content>,
    VariantProps<typeof comboboxContentVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

export interface ComboboxItemProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Item>,
    VariantProps<typeof comboboxItemVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'selected' | 'disabled';
  value: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  selected?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: string | number;
  description?: string;
  keywords?: string[];
}

export interface ComboboxLabelProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof comboboxLabelVariants> {
  size?: 'sm' | 'default' | 'lg';
  required?: boolean;
}

export interface ComboboxSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Separator>,
    VariantProps<typeof comboboxSeparatorVariants> {
  variant?: 'default' | 'subtle' | 'none';
}

export interface ComboboxEmptyProps
  extends React.ComponentPropsWithoutRef<typeof ComboboxPrimitive.Empty>,
    VariantProps<typeof comboboxEmptyVariants> {
  variant?: 'default' | 'minimal' | 'compact';
  children: React.ReactNode;
}

const ComboboxTrigger = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Trigger>,
  ComboboxTriggerProps
>(({ 
  className, 
  variant, 
  size, 
  state, 
  placeholder = 'Select an option...', 
  value, 
  onValueChange, 
  loading = false, 
  disabled = false, 
  clearable = false, 
  searchable = false, 
  leftIcon, 
  rightIcon, 
  ...props 
}, ref) => {
  const [inputValue, setInputValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const handleClear = React.useCallback(() => {
    setInputValue('');
    onValueChange?.('');
  }, [onValueChange]);

  return (
    <ComboboxPrimitive.Trigger
      ref={ref}
      className={cn(comboboxTriggerVariants({ variant, size, state, className }))}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {searchable ? (
          <input
            className="flex-1 bg-transparent outline-none placeholder:text-atlas-text-tertiary"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            disabled={disabled}
          />
        ) : (
          <span className={cn(
            'flex-1 truncate',
            !inputValue && 'text-atlas-text-tertiary'
          )}>
            {inputValue || placeholder}
          </span>
        )}
        {clearable && inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-1 hover:bg-atlas-border-subtle rounded-sm transition-colors"
            aria-label="Clear selection"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {loading && (
          <LoaderIcon className="h-4 w-4 animate-spin opacity-50" />
        )}
        {rightIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        ) : (
          <ChevronDownIcon className="h-4 w-4 opacity-50" aria-hidden="true" />
        )}
      </div>
    </ComboboxPrimitive.Trigger>
  );
});
ComboboxTrigger.displayName = 'ComboboxTrigger';

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Content>,
  ComboboxContentProps
>(({ className, variant, size, children, ...props }, ref) => (
  <ComboboxPrimitive.Portal>
    <ComboboxPrimitive.Content
      ref={ref}
      className={cn(comboboxContentVariants({ variant, size, className }))}
      position="popper"
      sideOffset={4}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Content>
  </ComboboxPrimitive.Portal>
));
ComboboxContent.displayName = 'ComboboxContent';

const ComboboxItem = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Item>,
  ComboboxItemProps
>(({ 
  className, 
  variant, 
  size, 
  state, 
  value, 
  onSelect, 
  disabled = false, 
  selected = false, 
  icon, 
  rightIcon, 
  badge, 
  description, 
  keywords, 
  children, 
  ...props 
}, ref) => {
  const handleSelect = React.useCallback(() => {
    if (!disabled) {
      onSelect?.(value);
    }
  }, [disabled, onSelect, value]);

  return (
    <ComboboxPrimitive.Item
      ref={ref}
      className={cn(comboboxItemVariants({ variant, size, state: selected ? 'selected' : state, className }))}
      value={value}
      onSelect={handleSelect}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {icon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate">{children}</span>
            {badge && (
              <span
                className="inline-flex items-center justify-center rounded-full bg-atlas-primary-main text-xs font-medium text-white min-w-[1.25rem] h-5 px-1 flex-shrink-0"
                aria-label={`${badge} items`}
              >
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-atlas-text-secondary mt-1 truncate">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {selected && (
          <CheckIcon className="h-4 w-4" aria-hidden="true" />
        )}
        {rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
    </ComboboxPrimitive.Item>
  );
});
ComboboxItem.displayName = 'ComboboxItem';

const ComboboxLabel = React.forwardRef<
  HTMLLabelElement,
  ComboboxLabelProps
>(({ className, size, required = false, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(comboboxLabelVariants({ size, className }))}
    {...props}
  >
    {children}
    {required && (
      <span className="text-atlas-error-main ml-1" aria-label="required">
        *
      </span>
    )}
  </label>
));
ComboboxLabel.displayName = 'ComboboxLabel';

const ComboboxSeparator = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Separator>,
  ComboboxSeparatorProps
>(({ className, variant, ...props }, ref) => (
  <ComboboxPrimitive.Separator
    ref={ref}
    className={cn(comboboxSeparatorVariants({ variant, className }))}
    {...props}
  />
));
ComboboxSeparator.displayName = 'ComboboxSeparator';

const ComboboxEmpty = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Empty>,
  ComboboxEmptyProps
>(({ className, variant, children, ...props }, ref) => (
  <ComboboxPrimitive.Empty
    ref={ref}
    className={cn(comboboxEmptyVariants({ variant, className }))}
    {...props}
  >
    {children}
  </ComboboxPrimitive.Empty>
));
ComboboxEmpty.displayName = 'ComboboxEmpty';

const Combobox = React.forwardRef<
  React.ElementRef<typeof ComboboxPrimitive.Root>,
  ComboboxProps
>(({
  className,
  variant,
  size,
  placeholder = 'Select an option...',
  value,
  onValueChange,
  onSelect,
  loading = false,
  disabled = false,
  clearable = false,
  searchable = false,
  children,
  ...props
}, ref) => {
  const [currentValue, setCurrentValue] = React.useState(value || '');

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback((newValue: string) => {
    setCurrentValue(newValue);
    onValueChange?.(newValue);
    onSelect?.(newValue);
  }, [onValueChange, onSelect]);

  return (
    <ComboboxPrimitive.Root
      ref={ref}
      className={cn(comboboxVariants({ variant, size, className }))}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      {...props}
    >
      {children}
    </ComboboxPrimitive.Root>
  );
});
Combobox.displayName = 'Combobox';

// Additional utility components for advanced combobox functionality
const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, label, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props}>
    {label && (
      <ComboboxLabel size={size}>
        {label}
      </ComboboxLabel>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
));
ComboboxGroup.displayName = 'ComboboxGroup';

const ComboboxContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full',
      variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
      variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
ComboboxContainer.displayName = 'ComboboxContainer';

const ComboboxSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8',
    default: 'h-10',
    lg: 'h-12',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-2', className)}
      {...props}
    >
      <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
      <div
        className={cn(
          'w-full bg-atlas-border-subtle rounded-md animate-pulse',
          sizeClasses[size]
        )}
      />
    </div>
  );
});
ComboboxSkeleton.displayName = 'ComboboxSkeleton';

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxItem,
  ComboboxLabel,
  ComboboxSeparator,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxContainer,
  ComboboxSkeleton,
  comboboxVariants,
  comboboxTriggerVariants,
  comboboxContentVariants,
  comboboxItemVariants,
  comboboxLabelVariants,
  comboboxSeparatorVariants,
  comboboxEmptyVariants,
};
