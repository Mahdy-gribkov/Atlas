import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const sliderVariants = cva(
  'relative flex w-full touch-none select-none items-center',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border border-atlas-border rounded-lg p-4 bg-atlas-card-bg',
        ghost: 'bg-atlas-border-subtle rounded-lg p-4',
        minimal: '',
      },
      size: {
        sm: 'h-4',
        default: 'h-6',
        lg: 'h-8',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col h-full w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const sliderTrackVariants = cva(
  'relative grow overflow-hidden rounded-full bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        outlined: 'bg-atlas-border',
        ghost: 'bg-atlas-border-subtle',
        minimal: 'bg-atlas-border-subtle',
      },
      size: {
        sm: 'h-1',
        default: 'h-2',
        lg: 'h-3',
      },
      orientation: {
        horizontal: 'w-full',
        vertical: 'h-full w-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const sliderRangeVariants = cva(
  'absolute h-full bg-atlas-primary-main',
  {
    variants: {
      variant: {
        default: 'bg-atlas-primary-main',
        outlined: 'bg-atlas-primary-main',
        ghost: 'bg-atlas-primary-main',
        minimal: 'bg-atlas-primary-main',
        success: 'bg-atlas-success-main',
        warning: 'bg-atlas-warning-main',
        error: 'bg-atlas-error-main',
        ai: 'bg-atlas-ai-main',
      },
      size: {
        sm: 'h-1',
        default: 'h-2',
        lg: 'h-3',
      },
      orientation: {
        horizontal: 'w-full',
        vertical: 'h-full w-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const sliderThumbVariants = cva(
  'block h-5 w-5 rounded-full border-2 border-atlas-primary-main bg-white shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-atlas-primary-main bg-white hover:bg-atlas-primary-lighter',
        outlined: 'border-atlas-primary-main bg-white hover:bg-atlas-primary-lighter',
        ghost: 'border-atlas-primary-main bg-white hover:bg-atlas-primary-lighter',
        minimal: 'border-atlas-primary-main bg-white hover:bg-atlas-primary-lighter',
        success: 'border-atlas-success-main bg-white hover:bg-atlas-success-bg',
        warning: 'border-atlas-warning-main bg-white hover:bg-atlas-warning-bg',
        error: 'border-atlas-error-main bg-white hover:bg-atlas-error-bg',
        ai: 'border-atlas-ai-main bg-white hover:bg-atlas-ai-lighter',
      },
      size: {
        sm: 'h-4 w-4',
        default: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
      orientation: {
        horizontal: '',
        vertical: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const sliderLabelVariants = cva(
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

const sliderValueVariants = cva(
  'text-sm text-atlas-text-secondary',
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

export interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  rangeVariant?: 'default' | 'success' | 'warning' | 'error' | 'ai';
  thumbVariant?: 'default' | 'success' | 'warning' | 'error' | 'ai';
  label?: string;
  description?: string;
  showValue?: boolean;
  showTicks?: boolean;
  showLabels?: boolean;
  tickCount?: number;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  step?: number;
  min?: number;
  max?: number;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

export interface SliderTrackProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>,
    VariantProps<typeof sliderTrackVariants> {}

export interface SliderRangeProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>,
    VariantProps<typeof sliderRangeVariants> {}

export interface SliderThumbProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>,
    VariantProps<typeof sliderThumbVariants> {}

export interface SliderLabelProps
  extends React.HTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof sliderLabelVariants> {}

export interface SliderValueProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sliderValueVariants> {}

const SliderTrack = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Track>,
  SliderTrackProps
>(({ className, variant, size, orientation, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    className={cn(sliderTrackVariants({ variant, size, orientation, className }))}
    {...props}
  />
));
SliderTrack.displayName = 'SliderTrack';

const SliderRange = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Range>,
  SliderRangeProps
>(({ className, variant, size, orientation, ...props }, ref) => (
  <SliderPrimitive.Range
    ref={ref}
    className={cn(sliderRangeVariants({ variant, size, orientation, className }))}
    {...props}
  />
));
SliderRange.displayName = 'SliderRange';

const SliderThumb = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Thumb>,
  SliderThumbProps
>(({ className, variant, size, orientation, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(sliderThumbVariants({ variant, size, orientation, className }))}
    {...props}
  />
));
SliderThumb.displayName = 'SliderThumb';

const SliderLabel = React.forwardRef<
  HTMLLabelElement,
  SliderLabelProps
>(({ className, size, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(sliderLabelVariants({ size, className }))}
    {...props}
  />
));
SliderLabel.displayName = 'SliderLabel';

const SliderValue = React.forwardRef<
  HTMLDivElement,
  SliderValueProps
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(sliderValueVariants({ size, className }))}
    {...props}
  />
));
SliderValue.displayName = 'SliderValue';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({
  className,
  variant,
  size,
  orientation,
  rangeVariant,
  thumbVariant,
  label,
  description,
  showValue = false,
  showTicks = false,
  showLabels = false,
  tickCount = 5,
  formatValue,
  disabled = false,
  step = 1,
  min = 0,
  max = 100,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  ...props
}, ref) => {
  const [currentValue, setCurrentValue] = React.useState<number[]>(
    value || defaultValue || [min]
  );

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback((newValue: number[]) => {
    setCurrentValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  const formatDisplayValue = React.useCallback((val: number) => {
    if (formatValue) {
      return formatValue(val);
    }
    return val.toString();
  }, [formatValue]);

  const generateTicks = () => {
    if (!showTicks) return null;
    
    const ticks = [];
    const stepSize = (max - min) / (tickCount - 1);
    
    for (let i = 0; i < tickCount; i++) {
      const tickValue = min + (i * stepSize);
      const percentage = ((tickValue - min) / (max - min)) * 100;
      
      ticks.push(
        <div
          key={i}
          className="absolute top-1/2 transform -translate-y-1/2 w-1 h-1 bg-atlas-text-tertiary rounded-full"
          style={{
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      );
    }
    
    return ticks;
  };

  const generateLabels = () => {
    if (!showLabels) return null;
    
    const labels = [];
    const stepSize = (max - min) / (tickCount - 1);
    
    for (let i = 0; i < tickCount; i++) {
      const labelValue = min + (i * stepSize);
      const percentage = ((labelValue - min) / (max - min)) * 100;
      
      labels.push(
        <div
          key={i}
          className="absolute top-full mt-1 text-xs text-atlas-text-tertiary"
          style={{
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {formatDisplayValue(labelValue)}
        </div>
      );
    }
    
    return labels;
  };

  return (
    <div className="w-full space-y-2">
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <SliderLabel size={size}>
              {label}
            </SliderLabel>
          )}
          {description && (
            <p className="text-xs text-atlas-text-secondary">
              {description}
            </p>
          )}
        </div>
      )}
      
      <div className="relative">
        <SliderPrimitive.Root
          ref={ref}
          className={cn(sliderVariants({ variant, size, orientation, className }))}
          value={currentValue}
          onValueChange={handleValueChange}
          onValueCommit={onValueCommit}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          orientation={orientation}
          {...props}
        >
          <SliderTrack
            variant={variant}
            size={size}
            orientation={orientation}
          >
            <SliderRange
              variant={rangeVariant}
              size={size}
              orientation={orientation}
            />
            {generateTicks()}
          </SliderTrack>
          
          {currentValue.map((_, index) => (
            <SliderThumb
              key={index}
              variant={thumbVariant}
              size={size}
              orientation={orientation}
              aria-label={`Slider thumb ${index + 1}`}
            />
          ))}
        </SliderPrimitive.Root>
        
        {generateLabels()}
      </div>
      
      {showValue && (
        <div className="flex justify-between text-xs text-atlas-text-secondary">
          <span>Min: {formatDisplayValue(min)}</span>
          <span>Current: {currentValue.map(formatDisplayValue).join(' - ')}</span>
          <span>Max: {formatDisplayValue(max)}</span>
        </div>
      )}
    </div>
  );
});
Slider.displayName = 'Slider';

// Additional utility components for advanced slider functionality
const SliderContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full space-y-4',
      variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
      variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SliderContainer.displayName = 'SliderContainer';

const SliderGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    description?: string;
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, label, description, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props}>
    {(label || description) && (
      <div className="space-y-1">
        {label && (
          <h3 className={cn(sliderLabelVariants({ size }))}>
            {label}
          </h3>
        )}
        {description && (
          <p className="text-xs text-atlas-text-secondary">
            {description}
          </p>
        )}
      </div>
    )}
    <div className="space-y-4">
      {children}
    </div>
  </div>
));
SliderGroup.displayName = 'SliderGroup';

const SliderSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => {
  const heightClasses = {
    sm: 'h-4',
    default: 'h-6',
    lg: 'h-8',
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
          'w-full bg-atlas-border-subtle rounded-full animate-pulse',
          heightClasses[size]
        )}
      />
      <div className="h-3 w-32 bg-atlas-border-subtle rounded animate-pulse" />
    </div>
  );
});
SliderSkeleton.displayName = 'SliderSkeleton';

export {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
  SliderLabel,
  SliderValue,
  SliderContainer,
  SliderGroup,
  SliderSkeleton,
  sliderVariants,
  sliderTrackVariants,
  sliderRangeVariants,
  sliderThumbVariants,
  sliderLabelVariants,
  sliderValueVariants,
};
