import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const spacerVariants = cva(
  '',
  {
    variants: {
      variant: {
        default: '',
        vertical: '',
        horizontal: '',
        both: '',
        responsive: '',
        dynamic: '',
      },
      size: {
        0: 'h-0 w-0',
        1: 'h-1 w-1',
        2: 'h-2 w-2',
        3: 'h-3 w-3',
        4: 'h-4 w-4',
        5: 'h-5 w-5',
        6: 'h-6 w-6',
        8: 'h-8 w-8',
        10: 'h-10 w-10',
        12: 'h-12 w-12',
        16: 'h-16 w-16',
        20: 'h-20 w-20',
        24: 'h-24 w-24',
        32: 'h-32 w-32',
        40: 'h-40 w-40',
        48: 'h-48 w-48',
        56: 'h-56 w-56',
        64: 'h-64 w-64',
        72: 'h-72 w-72',
        80: 'h-80 w-80',
        96: 'h-96 w-96',
      },
      height: {
        0: 'h-0',
        1: 'h-1',
        2: 'h-2',
        3: 'h-3',
        4: 'h-4',
        5: 'h-5',
        6: 'h-6',
        8: 'h-8',
        10: 'h-10',
        12: 'h-12',
        16: 'h-16',
        20: 'h-20',
        24: 'h-24',
        32: 'h-32',
        40: 'h-40',
        48: 'h-48',
        56: 'h-56',
        64: 'h-64',
        72: 'h-72',
        80: 'h-80',
        96: 'h-96',
        auto: 'h-auto',
        full: 'h-full',
        screen: 'h-screen',
        min: 'h-min',
        max: 'h-max',
        fit: 'h-fit',
      },
      width: {
        0: 'w-0',
        1: 'w-1',
        2: 'w-2',
        3: 'w-3',
        4: 'w-4',
        5: 'w-5',
        6: 'w-6',
        8: 'w-8',
        10: 'w-10',
        12: 'w-12',
        16: 'w-16',
        20: 'w-20',
        24: 'w-24',
        32: 'w-32',
        40: 'w-40',
        48: 'w-48',
        56: 'w-56',
        64: 'w-64',
        72: 'w-72',
        80: 'w-80',
        96: 'w-96',
        auto: 'w-auto',
        full: 'w-full',
        screen: 'w-screen',
        min: 'w-min',
        max: 'w-max',
        fit: 'w-fit',
      },
      margin: {
        none: 'm-0',
        xs: 'm-1',
        sm: 'm-2',
        default: 'm-4',
        lg: 'm-6',
        xl: 'm-8',
        '2xl': 'm-12',
        '3xl': 'm-16',
        '4xl': 'm-20',
        '5xl': 'm-24',
        '6xl': 'm-32',
      },
      marginTop: {
        none: 'mt-0',
        xs: 'mt-1',
        sm: 'mt-2',
        default: 'mt-4',
        lg: 'mt-6',
        xl: 'mt-8',
        '2xl': 'mt-12',
        '3xl': 'mt-16',
        '4xl': 'mt-20',
        '5xl': 'mt-24',
        '6xl': 'mt-32',
      },
      marginBottom: {
        none: 'mb-0',
        xs: 'mb-1',
        sm: 'mb-2',
        default: 'mb-4',
        lg: 'mb-6',
        xl: 'mb-8',
        '2xl': 'mb-12',
        '3xl': 'mb-16',
        '4xl': 'mb-20',
        '5xl': 'mb-24',
        '6xl': 'mb-32',
      },
      marginLeft: {
        none: 'ml-0',
        xs: 'ml-1',
        sm: 'ml-2',
        default: 'ml-4',
        lg: 'ml-6',
        xl: 'ml-8',
        '2xl': 'ml-12',
        '3xl': 'ml-16',
        '4xl': 'ml-20',
        '5xl': 'ml-24',
        '6xl': 'ml-32',
      },
      marginRight: {
        none: 'mr-0',
        xs: 'mr-1',
        sm: 'mr-2',
        default: 'mr-4',
        lg: 'mr-6',
        xl: 'mr-8',
        '2xl': 'mr-12',
        '3xl': 'mr-16',
        '4xl': 'mr-20',
        '5xl': 'mr-24',
        '6xl': 'mr-32',
      },
      padding: {
        none: 'p-0',
        xs: 'p-1',
        sm: 'p-2',
        default: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        '2xl': 'p-12',
        '3xl': 'p-16',
        '4xl': 'p-20',
        '5xl': 'p-24',
        '6xl': 'p-32',
      },
      paddingTop: {
        none: 'pt-0',
        xs: 'pt-1',
        sm: 'pt-2',
        default: 'pt-4',
        lg: 'pt-6',
        xl: 'pt-8',
        '2xl': 'pt-12',
        '3xl': 'pt-16',
        '4xl': 'pt-20',
        '5xl': 'pt-24',
        '6xl': 'pt-32',
      },
      paddingBottom: {
        none: 'pb-0',
        xs: 'pb-1',
        sm: 'pb-2',
        default: 'pb-4',
        lg: 'pb-6',
        xl: 'pb-8',
        '2xl': 'pb-12',
        '3xl': 'pb-16',
        '4xl': 'pb-20',
        '5xl': 'pb-24',
        '6xl': 'pb-32',
      },
      paddingLeft: {
        none: 'pl-0',
        xs: 'pl-1',
        sm: 'pl-2',
        default: 'pl-4',
        lg: 'pl-6',
        xl: 'pl-8',
        '2xl': 'pl-12',
        '3xl': 'pl-16',
        '4xl': 'pl-20',
        '5xl': 'pl-24',
        '6xl': 'pl-32',
      },
      paddingRight: {
        none: 'pr-0',
        xs: 'pr-1',
        sm: 'pr-2',
        default: 'pr-4',
        lg: 'pr-6',
        xl: 'pr-8',
        '2xl': 'pr-12',
        '3xl': 'pr-16',
        '4xl': 'pr-20',
        '5xl': 'pr-24',
        '6xl': 'pr-32',
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
      visibility: {
        visible: 'visible',
        hidden: 'hidden',
        collapse: 'collapse',
      },
      display: {
        block: 'block',
        inline: 'inline',
        'inline-block': 'inline-block',
        flex: 'flex',
        'inline-flex': 'inline-flex',
        grid: 'grid',
        'inline-grid': 'inline-grid',
        table: 'table',
        'inline-table': 'inline-table',
        'table-cell': 'table-cell',
        'table-row': 'table-row',
        'table-column': 'table-column',
        'table-column-group': 'table-column-group',
        'table-header-group': 'table-header-group',
        'table-footer-group': 'table-footer-group',
        'table-row-group': 'table-row-group',
        'table-caption': 'table-caption',
        none: 'hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 4,
      height: 4,
      width: 4,
      margin: 'none',
      marginTop: 'none',
      marginBottom: 'none',
      marginLeft: 'none',
      marginRight: 'none',
      padding: 'none',
      paddingTop: 'none',
      paddingBottom: 'none',
      paddingLeft: 'none',
      paddingRight: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
      visibility: 'visible',
      display: 'block',
    },
  }
);

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {
  variant?: 'default' | 'vertical' | 'horizontal' | 'both' | 'responsive' | 'dynamic';
  size?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96;
  height?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96 | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';
  width?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 | 96 | 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  marginTop?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  marginBottom?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  marginLeft?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  marginRight?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  paddingTop?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  paddingBottom?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  paddingLeft?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  paddingRight?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  visibility?: 'visible' | 'hidden' | 'collapse';
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'table' | 'inline-table' | 'table-cell' | 'table-row' | 'table-column' | 'table-column-group' | 'table-header-group' | 'table-footer-group' | 'table-row-group' | 'table-caption' | 'none';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({
    className,
    variant,
    size,
    height,
    width,
    margin,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    padding,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    background,
    border,
    rounded,
    shadow,
    visibility,
    display,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const spacerProps = asChild ? {} : {
      ref,
      className: cn(
        spacerVariants({
          variant,
          size,
          height,
          width,
          margin,
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          padding,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          background,
          border,
          rounded,
          shadow,
          visibility,
          display,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...spacerProps}>
        {children}
      </Comp>
    );
  }
);
Spacer.displayName = 'Spacer';

// Additional utility components for advanced spacer functionality
const VSpacer = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'variant' | 'width'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    variant="vertical"
    width={0}
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
VSpacer.displayName = 'VSpacer';

const HSpacer = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'variant' | 'height'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    variant="horizontal"
    height={0}
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
HSpacer.displayName = 'HSpacer';

const SpacerBoth = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    variant="both"
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
SpacerBoth.displayName = 'SpacerBoth';

const SpacerResponsive = React.forwardRef<
  HTMLDivElement,
  SpacerProps & {
    breakpoints?: {
      sm?: Partial<SpacerProps>;
      md?: Partial<SpacerProps>;
      lg?: Partial<SpacerProps>;
      xl?: Partial<SpacerProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.size) {
      classes.push(`sm:h-${breakpoints.sm.size} sm:w-${breakpoints.sm.size}`);
    }
    if (breakpoints.md?.size) {
      classes.push(`md:h-${breakpoints.md.size} md:w-${breakpoints.md.size}`);
    }
    if (breakpoints.lg?.size) {
      classes.push(`lg:h-${breakpoints.lg.size} lg:w-${breakpoints.lg.size}`);
    }
    if (breakpoints.xl?.size) {
      classes.push(`xl:h-${breakpoints.xl.size} xl:w-${breakpoints.xl.size}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Spacer
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Spacer>
  );
});
SpacerResponsive.displayName = 'SpacerResponsive';

const SpacerDynamic = React.forwardRef<
  HTMLDivElement,
  SpacerProps & {
    minSize?: number;
    maxSize?: number;
    step?: number;
  }
>(({ className, minSize = 0, maxSize = 96, step = 1, children, ...props }, ref) => {
  const [currentSize, setCurrentSize] = React.useState(minSize);
  
  const dynamicStyle = React.useMemo(() => ({
    height: `${currentSize * 0.25}rem`,
    width: `${currentSize * 0.25}rem`,
  }), [currentSize]);

  return (
    <Spacer
      ref={ref}
      className={className}
      style={dynamicStyle}
      {...props}
    >
      {children}
    </Spacer>
  );
});
SpacerDynamic.displayName = 'SpacerDynamic';

const SpacerFlex = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'display'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    display="flex"
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
SpacerFlex.displayName = 'SpacerFlex';

const SpacerGrid = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'display'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    display="grid"
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
SpacerGrid.displayName = 'SpacerGrid';

const SpacerHidden = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'visibility'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    visibility="hidden"
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
SpacerHidden.displayName = 'SpacerHidden';

const SpacerCollapse = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'visibility'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    visibility="collapse"
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
SpacerCollapse.displayName = 'SpacerCollapse';

const SpacerCard = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Spacer
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
  </Spacer>
));
SpacerCard.displayName = 'SpacerCard';

const SpacerSection = React.forwardRef<
  HTMLDivElement,
  Omit<SpacerProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Spacer
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Spacer>
));
SpacerSection.displayName = 'SpacerSection';

export {
  Spacer,
  VSpacer,
  HSpacer,
  SpacerBoth,
  SpacerResponsive,
  SpacerDynamic,
  SpacerFlex,
  SpacerGrid,
  SpacerHidden,
  SpacerCollapse,
  SpacerCard,
  SpacerSection,
  spacerVariants,
};
