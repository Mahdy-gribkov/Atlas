import * as React from 'react';
import * as CalendarPrimitive from '@radix-ui/react-calendar';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const calendarVariants = cva(
  'rounded-md border border-atlas-border bg-atlas-card-bg text-atlas-text-primary shadow-md',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg',
        outlined: 'border-2 border-atlas-primary-main bg-atlas-card-bg',
        ghost: 'border-transparent bg-transparent shadow-none',
        minimal: 'border-atlas-border-subtle bg-atlas-border-subtle',
      },
      size: {
        sm: 'p-2',
        default: 'p-3',
        lg: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const calendarHeaderVariants = cva(
  'flex items-center justify-between py-4',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border-b border-atlas-border',
        ghost: '',
        minimal: 'border-b border-atlas-border-subtle',
      },
      size: {
        sm: 'py-2',
        default: 'py-4',
        lg: 'py-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const calendarTitleVariants = cva(
  'text-sm font-semibold text-atlas-text-primary',
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

const calendarNavigationVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        outlined: 'hover:bg-atlas-primary-main hover:text-white',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
      },
      size: {
        sm: 'h-6 w-6 text-xs',
        default: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const calendarGridVariants = cva(
  'mt-4 grid grid-cols-7 gap-px',
  {
    variants: {
      size: {
        sm: 'gap-0.5',
        default: 'gap-px',
        lg: 'gap-1',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const calendarDayVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        outlined: 'hover:bg-atlas-primary-main hover:text-white',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
      },
      size: {
        sm: 'h-6 w-6 text-xs',
        default: 'h-9 w-9 text-sm',
        lg: 'h-12 w-12 text-base',
      },
      state: {
        default: 'text-atlas-text-primary',
        selected: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        today: 'bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        outside: 'text-atlas-text-tertiary opacity-50',
        disabled: 'text-atlas-text-tertiary opacity-50 cursor-not-allowed',
        range: 'bg-atlas-primary-lighter text-atlas-primary-main',
        rangeStart: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        rangeEnd: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const calendarWeekdayVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium text-atlas-text-tertiary',
  {
    variants: {
      size: {
        sm: 'h-6 text-xs',
        default: 'h-9 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface CalendarProps
  extends React.ComponentPropsWithoutRef<typeof CalendarPrimitive.Root>,
    VariantProps<typeof calendarVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  showNavigation?: boolean;
  showWeekdays?: boolean;
  showOutsideDays?: boolean;
  fixedWeeks?: boolean;
  locale?: string;
  disabled?: boolean;
  value?: Date | Date[];
  defaultValue?: Date | Date[];
  onValueChange?: (value: Date | Date[] | undefined) => void;
  onSelect?: (value: Date | Date[] | undefined) => void;
  mode?: 'single' | 'multiple' | 'range';
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  highlightedDates?: Date[];
  customDayContent?: (date: Date) => React.ReactNode;
}

export interface CalendarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calendarHeaderVariants> {
  title?: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onToday?: () => void;
  showToday?: boolean;
}

export interface CalendarTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof calendarTitleVariants> {}

export interface CalendarNavigationProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof calendarNavigationVariants> {
  direction?: 'previous' | 'next';
}

export interface CalendarGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calendarGridVariants> {}

export interface CalendarDayProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof calendarDayVariants> {
  date: Date;
  isSelected?: boolean;
  isToday?: boolean;
  isOutside?: boolean;
  isDisabled?: boolean;
  isInRange?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  customContent?: React.ReactNode;
}

export interface CalendarWeekdayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calendarWeekdayVariants> {
  weekday: string;
}

const CalendarTitle = React.forwardRef<
  HTMLHeadingElement,
  CalendarTitleProps
>(({ className, size, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(calendarTitleVariants({ size, className }))}
    {...props}
  />
));
CalendarTitle.displayName = 'CalendarTitle';

const CalendarNavigation = React.forwardRef<
  HTMLButtonElement,
  CalendarNavigationProps
>(({ className, variant, size, direction, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(calendarNavigationVariants({ variant, size, className }))}
    aria-label={`Go to ${direction} month`}
    {...props}
  >
    {direction === 'previous' ? (
      <ChevronLeftIcon className="h-4 w-4" />
    ) : (
      <ChevronRightIcon className="h-4 w-4" />
    )}
  </button>
));
CalendarNavigation.displayName = 'CalendarNavigation';

const CalendarHeader = React.forwardRef<
  HTMLDivElement,
  CalendarHeaderProps
>(({ className, variant, size, title, onPrevious, onNext, onToday, showToday = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(calendarHeaderVariants({ variant, size, className }))}
    {...props}
  >
    <CalendarNavigation
      variant={variant}
      size={size}
      direction="previous"
      onClick={onPrevious}
    />
    <CalendarTitle size={size}>
      {title}
    </CalendarTitle>
    <div className="flex items-center gap-2">
      {showToday && (
        <button
          onClick={onToday}
          className={cn(calendarNavigationVariants({ variant, size }))}
          aria-label="Go to today"
        >
          Today
        </button>
      )}
      <CalendarNavigation
        variant={variant}
        size={size}
        direction="next"
        onClick={onNext}
      />
    </div>
  </div>
));
CalendarHeader.displayName = 'CalendarHeader';

const CalendarGrid = React.forwardRef<
  HTMLDivElement,
  CalendarGridProps
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(calendarGridVariants({ size, className }))}
    {...props}
  />
));
CalendarGrid.displayName = 'CalendarGrid';

const CalendarWeekday = React.forwardRef<
  HTMLDivElement,
  CalendarWeekdayProps
>(({ className, size, weekday, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(calendarWeekdayVariants({ size, className }))}
    {...props}
  >
    {weekday}
  </div>
));
CalendarWeekday.displayName = 'CalendarWeekday';

const CalendarDay = React.forwardRef<
  HTMLButtonElement,
  CalendarDayProps
>(({ 
  className, 
  variant, 
  size, 
  state, 
  date, 
  isSelected, 
  isToday, 
  isOutside, 
  isDisabled, 
  isInRange, 
  isRangeStart, 
  isRangeEnd, 
  customContent,
  ...props 
}, ref) => {
  const getState = () => {
    if (isRangeStart) return 'rangeStart';
    if (isRangeEnd) return 'rangeEnd';
    if (isInRange) return 'range';
    if (isSelected) return 'selected';
    if (isToday) return 'today';
    if (isOutside) return 'outside';
    if (isDisabled) return 'disabled';
    return 'default';
  };

  return (
    <button
      ref={ref}
      className={cn(calendarDayVariants({ variant, size, state: getState(), className }))}
      disabled={isDisabled || isOutside}
      aria-label={`Select ${date.toLocaleDateString()}`}
      aria-selected={isSelected}
      {...props}
    >
      {customContent || date.getDate()}
    </button>
  );
});
CalendarDay.displayName = 'CalendarDay';

const Calendar = React.forwardRef<
  React.ElementRef<typeof CalendarPrimitive.Root>,
  CalendarProps
>(({
  className,
  variant,
  size,
  showNavigation = true,
  showWeekdays = true,
  showOutsideDays = true,
  fixedWeeks = false,
  locale = 'en-US',
  disabled = false,
  value,
  defaultValue,
  onValueChange,
  onSelect,
  mode = 'single',
  minDate,
  maxDate,
  disabledDates = [],
  highlightedDates = [],
  customDayContent,
  ...props
}, ref) => {
  const [currentValue, setCurrentValue] = React.useState<Date | Date[] | undefined>(
    value || defaultValue
  );
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleValueChange = React.useCallback((newValue: Date | Date[] | undefined) => {
    setCurrentValue(newValue);
    onValueChange?.(newValue);
    onSelect?.(newValue);
  }, [onValueChange, onSelect]);

  const handlePreviousMonth = React.useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleToday = React.useCallback(() => {
    const today = new Date();
    setCurrentMonth(today);
    handleValueChange(today);
  }, [handleValueChange]);

  const isDateDisabled = React.useCallback((date: Date) => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(disabledDate => 
      date.toDateString() === disabledDate.toDateString()
    );
  }, [disabled, minDate, maxDate, disabledDates]);

  const isDateHighlighted = React.useCallback((date: Date) => {
    return highlightedDates.some(highlightedDate => 
      date.toDateString() === highlightedDate.toDateString()
    );
  }, [highlightedDates]);

  const getMonthTitle = () => {
    return currentMonth.toLocaleDateString(locale, { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getWeekdays = () => {
    const weekdays = [];
    const startDate = new Date(currentMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const weekday = new Date(startDate);
      weekday.setDate(startDate.getDate() + i);
      weekdays.push(weekday.toLocaleDateString(locale, { weekday: 'short' }));
    }
    
    return weekdays;
  };

  const getDaysInMonth = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const isDateSelected = (date: Date) => {
    if (!currentValue) return false;
    if (Array.isArray(currentValue)) {
      return currentValue.some(selectedDate => 
        date.toDateString() === selectedDate.toDateString()
      );
    }
    return date.toDateString() === currentValue.toDateString();
  };

  const isDateInRange = (date: Date) => {
    if (mode !== 'range' || !Array.isArray(currentValue) || currentValue.length !== 2) {
      return false;
    }
    const [start, end] = currentValue;
    return date >= start && date <= end;
  };

  const isDateRangeStart = (date: Date) => {
    if (mode !== 'range' || !Array.isArray(currentValue) || currentValue.length !== 2) {
      return false;
    }
    return date.toDateString() === currentValue[0].toDateString();
  };

  const isDateRangeEnd = (date: Date) => {
    if (mode !== 'range' || !Array.isArray(currentValue) || currentValue.length !== 2) {
      return false;
    }
    return date.toDateString() === currentValue[1].toDateString();
  };

  return (
    <CalendarPrimitive.Root
      ref={ref}
      className={cn(calendarVariants({ variant, size, className }))}
      value={currentValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      locale={locale}
      {...props}
    >
      {showNavigation && (
        <CalendarHeader
          variant={variant}
          size={size}
          title={getMonthTitle()}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
          onToday={handleToday}
          showToday={true}
        />
      )}
      
      {showWeekdays && (
        <div className="grid grid-cols-7 gap-px">
          {getWeekdays().map((weekday, index) => (
            <CalendarWeekday
              key={index}
              size={size}
              weekday={weekday}
            />
          ))}
        </div>
      )}
      
      <CalendarGrid size={size}>
        {getDaysInMonth().map((date, index) => (
          <CalendarDay
            key={index}
            variant={variant}
            size={size}
            date={date}
            isSelected={isDateSelected(date)}
            isToday={date.toDateString() === new Date().toDateString()}
            isOutside={date.getMonth() !== currentMonth.getMonth()}
            isDisabled={isDateDisabled(date)}
            isInRange={isDateInRange(date)}
            isRangeStart={isDateRangeStart(date)}
            isRangeEnd={isDateRangeEnd(date)}
            customContent={customDayContent?.(date)}
            onClick={() => {
              if (!isDateDisabled(date) && !date.getMonth() !== currentMonth.getMonth()) {
                handleValueChange(date);
              }
            }}
          />
        ))}
      </CalendarGrid>
    </CalendarPrimitive.Root>
  );
});
Calendar.displayName = 'Calendar';

// Additional utility components for advanced calendar functionality
const CalendarContainer = React.forwardRef<
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
CalendarContainer.displayName = 'CalendarContainer';

const CalendarSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    default: 'h-9 w-9',
    lg: 'h-12 w-12',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-4', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px">
        {Array.from({ length: 42 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'bg-atlas-border-subtle rounded animate-pulse',
              sizeClasses[size]
            )}
          />
        ))}
      </div>
    </div>
  );
});
CalendarSkeleton.displayName = 'CalendarSkeleton';

export {
  Calendar,
  CalendarHeader,
  CalendarTitle,
  CalendarNavigation,
  CalendarGrid,
  CalendarDay,
  CalendarWeekday,
  CalendarContainer,
  CalendarSkeleton,
  calendarVariants,
  calendarHeaderVariants,
  calendarTitleVariants,
  calendarNavigationVariants,
  calendarGridVariants,
  calendarDayVariants,
  calendarWeekdayVariants,
};
