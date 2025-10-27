import * as React from 'react';
import { 
  SearchIcon, 
  CommandIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CheckIcon,
  LoaderIcon
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const commandVariants = cva(
  'flex h-full w-full flex-col overflow-hidden rounded-md bg-atlas-card-bg text-atlas-text-primary shadow-lg border border-atlas-border',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg border-atlas-border',
        elevated: 'bg-atlas-card-bg border-atlas-border shadow-xl',
        ghost: 'bg-transparent border-transparent shadow-none',
        minimal: 'bg-atlas-border-subtle border-atlas-border-subtle',
      },
      size: {
        sm: 'max-h-64',
        default: 'max-h-96',
        lg: 'max-h-[32rem]',
        full: 'max-h-screen',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const commandInputVariants = cva(
  'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-atlas-text-tertiary disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-b border-atlas-border',
        outlined: 'border border-atlas-border rounded-md',
        ghost: 'border-0',
        minimal: 'border-b border-atlas-border-subtle',
      },
      size: {
        sm: 'h-8 text-xs',
        default: 'h-11 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const commandListVariants = cva(
  'max-h-[300px] overflow-y-auto overflow-x-hidden',
  {
    variants: {
      variant: {
        default: '',
        scrollable: 'max-h-[400px]',
        compact: 'max-h-[200px]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const commandItemVariants = cva(
  'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-atlas-primary-main aria-selected:text-white data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        elevated: 'hover:bg-atlas-primary-lighter hover:text-atlas-primary-main',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
      },
      size: {
        sm: 'px-1.5 py-1 text-xs',
        default: 'px-2 py-1.5 text-sm',
        lg: 'px-3 py-2 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const commandGroupVariants = cva(
  'overflow-hidden p-1 text-atlas-text-tertiary',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border-b border-atlas-border pb-2 mb-2',
        ghost: '',
        minimal: 'bg-atlas-border-subtle rounded-md p-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const commandSeparatorVariants = cva(
  '-mx-1 h-px bg-atlas-border',
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

const commandEmptyVariants = cva(
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

export interface CommandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg' | 'full';
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  shouldFilter?: boolean;
  filter?: (value: string, search: string) => number;
  children: React.ReactNode;
}

export interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof commandInputVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
}

export interface CommandListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandListVariants> {
  variant?: 'default' | 'scrollable' | 'compact';
  children: React.ReactNode;
}

export interface CommandItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandItemVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
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

export interface CommandGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandGroupVariants> {
  variant?: 'default' | 'bordered' | 'ghost' | 'minimal';
  heading?: string;
  children: React.ReactNode;
}

export interface CommandSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandSeparatorVariants> {
  variant?: 'default' | 'subtle' | 'none';
}

export interface CommandEmptyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandEmptyVariants> {
  variant?: 'default' | 'minimal' | 'compact';
  children: React.ReactNode;
}

const CommandInput = React.forwardRef<
  HTMLInputElement,
  CommandInputProps
>(({ 
  className, 
  variant, 
  size, 
  placeholder = 'Search...', 
  value, 
  onValueChange, 
  loading = false, 
  disabled = false, 
  ...props 
}, ref) => (
  <div className="flex items-center border-b border-atlas-border px-3">
    <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <input
      ref={ref}
      className={cn(commandInputVariants({ variant, size, className }))}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      disabled={disabled}
      {...props}
    />
    {loading && (
      <LoaderIcon className="ml-2 h-4 w-4 animate-spin opacity-50" />
    )}
  </div>
));
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
  HTMLDivElement,
  CommandListProps
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(commandListVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
));
CommandList.displayName = 'CommandList';

const CommandItem = React.forwardRef<
  HTMLDivElement,
  CommandItemProps
>(({ 
  className, 
  variant, 
  size, 
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
    <div
      ref={ref}
      className={cn(commandItemVariants({ variant, size, className }))}
      onSelect={handleSelect}
      data-disabled={disabled}
      aria-selected={selected}
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
    </div>
  );
});
CommandItem.displayName = 'CommandItem';

const CommandGroup = React.forwardRef<
  HTMLDivElement,
  CommandGroupProps
>(({ className, variant, heading, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(commandGroupVariants({ variant, className }))}
    {...props}
  >
    {heading && (
      <div className="px-2 py-1.5 text-xs font-semibold text-atlas-text-secondary">
        {heading}
      </div>
    )}
    <div className="space-y-1">
      {children}
    </div>
  </div>
));
CommandGroup.displayName = 'CommandGroup';

const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(commandSeparatorVariants({ variant, className }))}
    {...props}
  />
));
CommandSeparator.displayName = 'CommandSeparator';

const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  CommandEmptyProps
>(({ className, variant, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(commandEmptyVariants({ variant, className }))}
    {...props}
  >
    {children}
  </div>
));
CommandEmpty.displayName = 'CommandEmpty';

const Command = React.forwardRef<
  HTMLDivElement,
  CommandProps
>(({
  className,
  variant,
  size,
  placeholder = 'Search...',
  value,
  onValueChange,
  onSelect,
  loading = false,
  disabled = false,
  shouldFilter = true,
  filter,
  children,
  ...props
}, ref) => {
  const [searchValue, setSearchValue] = React.useState(value || '');
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback((newValue: string) => {
    setSearchValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const handleSelect = React.useCallback((selectedValue: string) => {
    setSelectedValue(selectedValue);
    onSelect?.(selectedValue);
  }, [onSelect]);

  const defaultFilter = React.useCallback((value: string, search: string) => {
    if (!search) return 1;
    const valueLower = value.toLowerCase();
    const searchLower = search.toLowerCase();
    return valueLower.includes(searchLower) ? 1 : 0;
  }, []);

  const filterFunction = filter || defaultFilter;

  return (
    <div
      ref={ref}
      className={cn(commandVariants({ variant, size, className }))}
      {...props}
    >
      <CommandInput
        variant="default"
        size="default"
        placeholder={placeholder}
        value={searchValue}
        onValueChange={handleValueChange}
        loading={loading}
        disabled={disabled}
      />
      <CommandList variant="default">
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === CommandGroup) {
              return React.cloneElement(child, {
                ...child.props,
                children: React.Children.map(child.props.children, (item) => {
                  if (React.isValidElement(item) && item.type === CommandItem) {
                    const itemValue = item.props.value;
                    const shouldShow = shouldFilter 
                      ? filterFunction(itemValue, searchValue) > 0
                      : true;
                    
                    if (shouldShow) {
                      return React.cloneElement(item, {
                        ...item.props,
                        onSelect: handleSelect,
                        selected: selectedValue === itemValue,
                      });
                    }
                    return null;
                  }
                  return item;
                }),
              });
            }
            if (child.type === CommandItem) {
              const itemValue = child.props.value;
              const shouldShow = shouldFilter 
                ? filterFunction(itemValue, searchValue) > 0
                : true;
              
              if (shouldShow) {
                return React.cloneElement(child, {
                  ...child.props,
                  onSelect: handleSelect,
                  selected: selectedValue === itemValue,
                });
              }
              return null;
            }
          }
          return child;
        })}
        {searchValue && React.Children.count(children) === 0 && (
          <CommandEmpty>
            No results found for "{searchValue}".
          </CommandEmpty>
        )}
      </CommandList>
    </div>
  );
});
Command.displayName = 'Command';

// Additional utility components for advanced command functionality
const CommandDialog = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg' | 'full';
  }
>(({ className, open = false, onOpenChange, variant = 'default', size = 'default', children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-modal flex items-start justify-center pt-[15vh]"
      {...props}
    >
      <div className="fixed inset-0 bg-black/50" onClick={() => handleOpenChange(false)} />
      <div className="relative w-full max-w-lg mx-4">
        <Command variant={variant} size={size} className={className}>
          {children}
        </Command>
      </div>
    </div>
  );
});
CommandDialog.displayName = 'CommandDialog';

const CommandShortcut = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    keys?: string[];
  }
>(({ className, keys = [], ...props }, ref) => {
  if (keys.length === 0) return null;

  return (
    <div
      ref={ref}
      className={cn(
        'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-atlas-border-subtle px-1.5 font-mono text-xs text-atlas-text-tertiary',
        className
      )}
      {...props}
    >
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-atlas-card-bg px-1 font-mono text-xs">
            {key}
          </kbd>
          {index < keys.length - 1 && <span>+</span>}
        </React.Fragment>
      ))}
    </div>
  );
});
CommandShortcut.displayName = 'CommandShortcut';

const CommandSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg' | 'full';
    itemCount?: number;
  }
>(({ className, size = 'default', itemCount = 5, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-6',
    default: 'h-8',
    lg: 'h-10',
    full: 'h-12',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-2', className)}
      {...props}
    >
      <div className="flex items-center border-b border-atlas-border px-3">
        <div className="h-4 w-4 bg-atlas-border-subtle rounded animate-pulse mr-2" />
        <div className={cn('flex-1 bg-atlas-border-subtle rounded animate-pulse', sizeClasses[size])} />
      </div>
      <div className="space-y-1 p-1">
        {Array.from({ length: itemCount }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-2 py-1.5"
          >
            <div className="h-4 w-4 bg-atlas-border-subtle rounded animate-pulse" />
            <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
});
CommandSkeleton.displayName = 'CommandSkeleton';

export {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandSeparator,
  CommandEmpty,
  CommandDialog,
  CommandShortcut,
  CommandSkeleton,
  commandVariants,
  commandInputVariants,
  commandListVariants,
  commandItemVariants,
  commandGroupVariants,
  commandSeparatorVariants,
  commandEmptyVariants,
};
