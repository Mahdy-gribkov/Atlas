import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon, PlusIcon, MinusIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const accordionVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: '',
        card: 'space-y-2',
        bordered: 'space-y-1 border border-atlas-border rounded-lg divide-y divide-atlas-border',
        ghost: 'space-y-1',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const accordionItemVariants = cva(
  'border-b border-atlas-border last:border-b-0',
  {
    variants: {
      variant: {
        default: '',
        card: 'border border-atlas-border rounded-lg mb-2 last:mb-0',
        bordered: 'border-0',
        ghost: 'border-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const accordionTriggerVariants = cva(
  'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:text-atlas-primary-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default: 'text-atlas-text-primary',
        card: 'px-4 text-atlas-text-primary hover:bg-atlas-border-subtle rounded-t-lg',
        bordered: 'px-4 text-atlas-text-primary hover:bg-atlas-border-subtle',
        ghost: 'text-atlas-text-primary hover:bg-atlas-border-subtle rounded-lg px-2',
      },
      size: {
        sm: 'text-sm py-3',
        default: 'text-base py-4',
        lg: 'text-lg py-5',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: true,
    },
  }
);

const accordionContentVariants = cva(
  'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
  {
    variants: {
      variant: {
        default: 'pb-4 pt-0',
        card: 'px-4 pb-4 pt-0',
        bordered: 'px-4 pb-4 pt-0',
        ghost: 'px-2 pb-4 pt-0',
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

const accordionChevronVariants = cva(
  'h-4 w-4 shrink-0 transition-transform duration-200',
  {
    variants: {
      variant: {
        default: 'text-atlas-text-tertiary',
        card: 'text-atlas-text-tertiary',
        bordered: 'text-atlas-text-tertiary',
        ghost: 'text-atlas-text-tertiary',
        plus: 'text-atlas-primary-main',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface AccordionProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>,
    VariantProps<typeof accordionVariants> {
  variant?: 'default' | 'card' | 'bordered' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  collapsible?: boolean;
  multiple?: boolean;
}

export interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>,
    VariantProps<typeof accordionItemVariants> {
  value: string;
}

export interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>,
    VariantProps<typeof accordionTriggerVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  chevronIcon?: 'chevron' | 'plus' | 'none';
  badge?: string | number;
  description?: string;
}

export interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>,
    VariantProps<typeof accordionContentVariants> {}

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, variant, size, collapsible = true, multiple = false, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn(accordionVariants({ variant, size, className }))}
    collapsible={collapsible}
    type={multiple ? 'multiple' : 'single'}
    {...props}
  />
));
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(accordionItemVariants({ variant, className }))}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      leftIcon,
      rightIcon,
      chevronIcon = 'chevron',
      badge,
      description,
      children,
      ...props
    },
    ref
  ) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(accordionTriggerVariants({ variant, size, fullWidth, className }))}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {leftIcon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {leftIcon}
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
          {rightIcon && (
            <span className="flex-shrink-0" aria-hidden="true">
              {rightIcon}
            </span>
          )}
          {chevronIcon === 'chevron' && (
            <ChevronDownIcon
              className={cn(accordionChevronVariants({ variant }))}
              aria-hidden="true"
            />
          )}
          {chevronIcon === 'plus' && (
            <div className="relative">
              <PlusIcon
                className={cn(accordionChevronVariants({ variant: 'plus' }))}
                aria-hidden="true"
              />
              <MinusIcon
                className={cn(
                  accordionChevronVariants({ variant: 'plus' }),
                  'absolute inset-0 rotate-90 transition-transform duration-200 data-[state=open]:rotate-0'
                )}
                aria-hidden="true"
              />
            </div>
          )}
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, variant, size, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(accordionContentVariants({ variant, size, className }))}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';

// Additional utility components for advanced accordion functionality
const AccordionGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    label?: string;
    description?: string;
    variant?: 'default' | 'card' | 'bordered' | 'ghost';
  }
>(({ className, label, description, variant = 'default', children, ...props }, ref) => (
  <div ref={ref} className={cn('space-y-4', className)} {...props}>
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
    <Accordion variant={variant} className="w-full">
      {children}
    </Accordion>
  </div>
));
AccordionGroup.displayName = 'AccordionGroup';

const AccordionSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'subtle' | 'none';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  if (variant === 'none') return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        'h-px',
        variant === 'default' ? 'bg-atlas-border' : 'bg-atlas-border-subtle',
        className
      )}
      {...props}
    />
  );
});
AccordionSeparator.displayName = 'AccordionSeparator';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionGroup,
  AccordionSeparator,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
  accordionChevronVariants,
};
