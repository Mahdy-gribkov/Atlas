import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const tabsListVariants = cva(
  'inline-flex items-center justify-center rounded-md bg-atlas-border-subtle p-1 text-atlas-text-secondary transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        elevated: 'bg-atlas-card-bg shadow-sm border border-atlas-border',
        ghost: 'bg-transparent',
        pills: 'bg-transparent gap-1',
        underline: 'bg-transparent border-b border-atlas-border rounded-none p-0',
      },
      size: {
        sm: 'h-8 text-xs',
        default: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col h-auto w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-atlas-card-bg data-[state=active]:text-atlas-text-primary data-[state=active]:shadow-sm',
  {
    variants: {
      variant: {
        default: 'data-[state=active]:bg-atlas-card-bg data-[state=active]:text-atlas-text-primary',
        elevated: 'data-[state=active]:bg-atlas-primary-main data-[state=active]:text-white data-[state=active]:shadow-md',
        ghost: 'data-[state=active]:bg-transparent data-[state=active]:text-atlas-primary-main',
        pills: 'rounded-full data-[state=active]:bg-atlas-primary-main data-[state=active]:text-white',
        underline: 'rounded-none border-b-2 border-transparent data-[state=active]:border-atlas-primary-main data-[state=active]:bg-transparent data-[state=active]:text-atlas-primary-main',
      },
      size: {
        sm: 'h-6 px-2 text-xs',
        default: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
      },
      fullWidth: {
        true: 'flex-1',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

const tabsContentVariants = cva(
  'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
        card: 'rounded-lg border border-atlas-border bg-atlas-card-bg p-4 shadow-sm',
        elevated: 'rounded-lg border border-atlas-border bg-atlas-card-bg p-6 shadow-md',
        ghost: '',
      },
      animation: {
        true: 'data-[state=inactive]:animate-fade-out data-[state=active]:animate-fade-in',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      animation: true,
    },
  }
);

export interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsListVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'pills' | 'underline';
  size?: 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
}

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsContentProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>,
    VariantProps<typeof tabsContentVariants> {}

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, variant, size, orientation, fullWidth, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn('w-full', className)}
    orientation={orientation}
    {...props}
  />
));
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, orientation, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size, orientation, className }))}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon,
      rightIcon,
      badge,
      children,
      ...props
    },
    ref
  ) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {leftIcon && (
        <span className="mr-2 flex-shrink-0" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className="flex items-center gap-2">
        {children}
        {badge && (
          <span
            className="inline-flex items-center justify-center rounded-full bg-atlas-primary-main text-xs font-medium text-white min-w-[1.25rem] h-5 px-1"
            aria-label={`${badge} items`}
          >
            {badge}
          </span>
        )}
      </span>
      {rightIcon && (
        <span className="ml-2 flex-shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </TabsPrimitive.Trigger>
  )
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, variant, animation, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(tabsContentVariants({ variant, animation, className }))}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

// Additional utility components for advanced tab functionality
const TabsIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical';
  }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute bg-atlas-primary-main transition-all duration-200 ease-out',
      orientation === 'horizontal'
        ? 'bottom-0 h-0.5 w-full'
        : 'left-0 w-0.5 h-full',
      className
    )}
    {...props}
  />
));
TabsIndicator.displayName = 'TabsIndicator';

const TabsGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    description?: string;
  }
>(({ className, label, description, children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-2', className)} {...props}>
    {(label || description) && (
      <div className="space-y-1">
        {label && (
          <h3 className="text-sm font-medium text-atlas-text-primary">
            {label}
          </h3>
        )}
        {description && (
          <p className="text-xs text-atlas-text-secondary">{description}</p>
        )}
      </div>
    )}
    {children}
  </div>
));
TabsGroup.displayName = 'TabsGroup';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator,
  TabsGroup,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
};
