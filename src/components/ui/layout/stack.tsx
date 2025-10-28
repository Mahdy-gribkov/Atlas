import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const stackVariants = cva(
  'flex',
  {
    variants: {
      variant: {
        default: '',
        vertical: 'flex-col',
        horizontal: 'flex-row',
        reverse: 'flex-col-reverse',
        'reverse-horizontal': 'flex-row-reverse',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      direction: {
        vertical: 'flex-col',
        horizontal: 'flex-row',
        'vertical-reverse': 'flex-col-reverse',
        'horizontal-reverse': 'flex-row-reverse',
      },
      spacing: {
        0: 'gap-0',
        1: 'gap-1',
        2: 'gap-2',
        3: 'gap-3',
        4: 'gap-4',
        5: 'gap-5',
        6: 'gap-6',
        8: 'gap-8',
        10: 'gap-10',
        12: 'gap-12',
        16: 'gap-16',
        20: 'gap-20',
        24: 'gap-24',
        32: 'gap-32',
      },
      align: {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      wrap: {
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      divider: {
        none: '',
        solid: 'divide-y divide-atlas-border',
        dashed: 'divide-y divide-dashed divide-atlas-border',
        dotted: 'divide-y divide-dotted divide-atlas-border',
        'solid-horizontal': 'divide-x divide-atlas-border',
        'dashed-horizontal': 'divide-x divide-dashed divide-atlas-border',
        'dotted-horizontal': 'divide-x divide-dotted divide-atlas-border',
      },
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
        '2xl': 'p-16',
      },
      margin: {
        none: 'm-0',
        xs: 'm-2',
        sm: 'm-4',
        default: 'm-6',
        lg: 'm-8',
        xl: 'm-12',
        '2xl': 'm-16',
        auto: 'mx-auto',
      },
      background: {
        none: '',
        subtle: 'bg-atlas-border-subtle',
        card: 'bg-atlas-card-bg',
        primary: 'bg-atlas-primary-main',
        secondary: 'bg-atlas-secondary-main',
        success: 'bg-atlas-success-main',
        warning: 'bg-atlas-warning-main',
        error: 'bg-atlas-error-main',
        info: 'bg-atlas-info-main',
      },
      border: {
        none: '',
        subtle: 'border border-atlas-border-subtle',
        default: 'border border-atlas-border',
        strong: 'border-2 border-atlas-border',
        primary: 'border border-atlas-primary-main',
        success: 'border border-atlas-success-main',
        warning: 'border border-atlas-warning-main',
        error: 'border border-atlas-error-main',
      },
      rounded: {
        none: '',
        sm: 'rounded-sm',
        default: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        default: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl',
        inner: 'shadow-inner',
      },
    },
    defaultVariants: {
      variant: 'default',
      direction: 'vertical',
      spacing: 4,
      align: 'stretch',
      justify: 'start',
      wrap: 'nowrap',
      divider: 'none',
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const stackItemVariants = cva(
  '',
  {
    variants: {
      spacing: {
        0: 'mb-0',
        1: 'mb-1',
        2: 'mb-2',
        3: 'mb-3',
        4: 'mb-4',
        5: 'mb-5',
        6: 'mb-6',
        8: 'mb-8',
        10: 'mb-10',
        12: 'mb-12',
        16: 'mb-16',
        20: 'mb-20',
        24: 'mb-24',
        32: 'mb-32',
        none: 'mb-0',
      },
      spacingHorizontal: {
        0: 'mr-0',
        1: 'mr-1',
        2: 'mr-2',
        3: 'mr-3',
        4: 'mr-4',
        5: 'mr-5',
        6: 'mr-6',
        8: 'mr-8',
        10: 'mr-10',
        12: 'mr-12',
        16: 'mr-16',
        20: 'mr-20',
        24: 'mr-24',
        32: 'mr-32',
        none: 'mr-0',
      },
      align: {
        start: 'self-start',
        end: 'self-end',
        center: 'self-center',
        stretch: 'self-stretch',
        baseline: 'self-baseline',
      },
      grow: {
        0: 'grow-0',
        1: 'grow',
      },
      shrink: {
        0: 'shrink-0',
        1: 'shrink',
      },
      order: {
        1: 'order-1',
        2: 'order-2',
        3: 'order-3',
        4: 'order-4',
        5: 'order-5',
        6: 'order-6',
        7: 'order-7',
        8: 'order-8',
        9: 'order-9',
        10: 'order-10',
        11: 'order-11',
        12: 'order-12',
        first: 'order-first',
        last: 'order-last',
        none: 'order-none',
      },
    },
    defaultVariants: {
      spacing: 'none',
      spacingHorizontal: 'none',
      align: 'stretch',
      grow: 0,
      shrink: 1,
      order: 'none',
    },
  }
);

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  variant?: 'default' | 'vertical' | 'horizontal' | 'reverse' | 'reverse-horizontal' | 'wrap' | 'wrap-reverse' | 'nowrap';
  direction?: 'vertical' | 'horizontal' | 'vertical-reverse' | 'horizontal-reverse';
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  divider?: 'none' | 'solid' | 'dashed' | 'dotted' | 'solid-horizontal' | 'dashed-horizontal' | 'dotted-horizontal';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface StackItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackItemVariants> {
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 'none';
  spacingHorizontal?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 'none';
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  grow?: 0 | 1;
  shrink?: 0 | 1;
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'first' | 'last' | 'none';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({
    className,
    variant,
    direction,
    spacing,
    align,
    justify,
    wrap,
    divider,
    padding,
    margin,
    background,
    border,
    rounded,
    shadow,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const stackProps = asChild ? {} : {
      ref,
      className: cn(
        stackVariants({
          variant,
          direction,
          spacing,
          align,
          justify,
          wrap,
          divider,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...stackProps}>
        {children}
      </Comp>
    );
  }
);
Stack.displayName = 'Stack';

const StackItem = React.forwardRef<HTMLDivElement, StackItemProps>(
  ({
    className,
    spacing,
    spacingHorizontal,
    align,
    grow,
    shrink,
    order,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const itemProps = asChild ? {} : {
      ref,
      className: cn(
        stackItemVariants({
          spacing,
          spacingHorizontal,
          align,
          grow,
          shrink,
          order,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...itemProps}>
        {children}
      </Comp>
    );
  }
);
StackItem.displayName = 'StackItem';

// Additional utility components for advanced stack functionality
const VStack = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    direction="vertical"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
VStack.displayName = 'VStack';

const HStack = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    direction="horizontal"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
HStack.displayName = 'HStack';

const VStackReverse = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    direction="vertical-reverse"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
VStackReverse.displayName = 'VStackReverse';

const HStackReverse = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    direction="horizontal-reverse"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
HStackReverse.displayName = 'HStackReverse';

const StackCenter = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'align' | 'justify'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    align="center"
    justify="center"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackCenter.displayName = 'StackCenter';

const StackBetween = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'justify'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    justify="between"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackBetween.displayName = 'StackBetween';

const StackAround = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'justify'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    justify="around"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackAround.displayName = 'StackAround';

const StackEvenly = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'justify'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    justify="evenly"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackEvenly.displayName = 'StackEvenly';

const StackWrap = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'wrap'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    wrap="wrap"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackWrap.displayName = 'StackWrap';

const StackNowrap = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'wrap'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    wrap="nowrap"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackNowrap.displayName = 'StackNowrap';

// Stack with divider
const StackDivider = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'divider'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    divider="solid"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackDivider.displayName = 'StackDivider';

// Stack with spacing utilities
const StackSpacing = React.forwardRef<
  HTMLDivElement,
  StackProps & {
    spacingSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ className, spacingSize = 'md', children, ...props }, ref) => {
  const spacingSizes = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 8,
  };

  return (
    <Stack
      ref={ref}
      spacing={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Stack>
  );
});
StackSpacing.displayName = 'StackSpacing';

// Stack with responsive breakpoints
const StackResponsive = React.forwardRef<
  HTMLDivElement,
  StackProps & {
    breakpoints?: {
      sm?: Partial<StackProps>;
      md?: Partial<StackProps>;
      lg?: Partial<StackProps>;
      xl?: Partial<StackProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.direction) {
      classes.push(`sm:flex-${breakpoints.sm.direction}`);
    }
    if (breakpoints.md?.direction) {
      classes.push(`md:flex-${breakpoints.md.direction}`);
    }
    if (breakpoints.lg?.direction) {
      classes.push(`lg:flex-${breakpoints.lg.direction}`);
    }
    if (breakpoints.xl?.direction) {
      classes.push(`xl:flex-${breakpoints.xl.direction}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Stack
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Stack>
  );
});
StackResponsive.displayName = 'StackResponsive';

// Stack with card styling
const StackCard = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    background="card"
    border="default"
    rounded="lg"
    shadow="sm"
    padding="default"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackCard.displayName = 'StackCard';

// Stack with section styling
const StackSection = React.forwardRef<
  HTMLDivElement,
  Omit<StackProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Stack
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Stack>
));
StackSection.displayName = 'StackSection';

export {
  Stack,
  StackItem,
  VStack,
  HStack,
  VStackReverse,
  HStackReverse,
  StackCenter,
  StackBetween,
  StackAround,
  StackEvenly,
  StackWrap,
  StackNowrap,
  StackDivider,
  StackSpacing,
  StackResponsive,
  StackCard,
  StackSection,
  stackVariants,
  stackItemVariants,
};
