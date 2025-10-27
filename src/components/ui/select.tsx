import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const selectTriggerVariants = cva(
  'flex h-10 w-full items-center justify-between rounded-md border border-atlas-border bg-atlas-card-bg px-3 py-2 text-sm ring-offset-background placeholder:text-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main focus:ring-atlas-error-main',
        success: 'border-atlas-success-main focus:ring-atlas-success-main',
        warning: 'border-atlas-warning-main focus:ring-atlas-warning-main',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size, className }))}
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

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-dropdown max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-atlas-card-bg text-atlas-text-primary shadow-md data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
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
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> &
    VariantProps<typeof selectItemVariants>
>(({ className, variant, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(selectItemVariants({ variant, className }))}
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

// Enhanced Select component with additional features
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface EnhancedSelectProps {
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: 'default' | 'error' | 'success' | 'warning';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

const EnhancedSelect = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  EnhancedSelectProps
>(({
  options,
  value,
  onValueChange,
  placeholder = 'Select an option...',
  label,
  helperText,
  errorMessage,
  successMessage,
  warningMessage,
  disabled = false,
  required = false,
  variant = 'default',
  size = 'default',
  className,
  searchable = false,
  clearable = false,
  multiple = false,
}, ref) => {
  const selectId = React.useId();
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  
  // Determine the actual variant based on messages
  const actualVariant = errorMessage 
    ? 'error' 
    : successMessage 
    ? 'success' 
    : warningMessage 
    ? 'warning' 
    : variant;

  const message = errorMessage || successMessage || warningMessage;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.('');
  };

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
      
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          ref={ref}
          id={selectId}
          variant={actualVariant}
          size={size}
          className={cn(clearable && value && 'pr-8', className)}
          aria-describedby={cn(
            message && errorId,
            helperText && helperId
          )}
          aria-invalid={!!errorMessage}
          aria-required={required}
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
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </SelectTrigger>
        
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              <div className="flex items-center space-x-2">
                {option.icon && (
                  <span className="flex-shrink-0" aria-hidden="true">
                    {option.icon}
                  </span>
                )}
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-atlas-text-tertiary">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
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
                warningMessage && 'text-atlas-warning-main'
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
  selectItemVariants,
};
