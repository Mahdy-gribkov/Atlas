import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const dividerVariants = cva(
  '',
  {
    variants: {
      variant: {
        default: 'border-t border-atlas-border',
        solid: 'border-t border-solid border-atlas-border',
        dashed: 'border-t border-dashed border-atlas-border',
        dotted: 'border-t border-dotted border-atlas-border',
        double: 'border-t-2 border-double border-atlas-border',
        thick: 'border-t-4 border-solid border-atlas-border',
        thin: 'border-t border-solid border-atlas-border',
        primary: 'border-t border-solid border-atlas-primary-main',
        secondary: 'border-t border-solid border-atlas-secondary-main',
        success: 'border-t border-solid border-atlas-success-main',
        warning: 'border-t border-solid border-atlas-warning-main',
        error: 'border-t border-solid border-atlas-error-main',
        info: 'border-t border-solid border-atlas-info-main',
        subtle: 'border-t border-solid border-atlas-border-subtle',
        strong: 'border-t-2 border-solid border-atlas-border',
        gradient: 'bg-gradient-to-r from-transparent via-atlas-border to-transparent h-px',
        shadow: 'border-t border-solid border-atlas-border shadow-sm',
        none: '',
      },
      orientation: {
        horizontal: 'w-full h-px',
        vertical: 'h-full w-px',
        both: 'w-full h-px',
      },
      size: {
        xs: 'h-px',
        sm: 'h-0.5',
        default: 'h-px',
        md: 'h-px',
        lg: 'h-1',
        xl: 'h-2',
        '2xl': 'h-3',
        '3xl': 'h-4',
      },
      width: {
        xs: 'w-8',
        sm: 'w-16',
        default: 'w-full',
        md: 'w-3/4',
        lg: 'w-2/3',
        xl: 'w-1/2',
        '2xl': 'w-1/3',
        '3xl': 'w-1/4',
        full: 'w-full',
        auto: 'w-auto',
      },
      height: {
        xs: 'h-8',
        sm: 'h-16',
        default: 'h-full',
        md: 'h-3/4',
        lg: 'h-2/3',
        xl: 'h-1/2',
        '2xl': 'h-1/3',
        '3xl': 'h-1/4',
        full: 'h-full',
        auto: 'h-auto',
      },
      margin: {
        none: 'm-0',
        xs: 'my-2',
        sm: 'my-4',
        default: 'my-6',
        lg: 'my-8',
        xl: 'my-12',
        '2xl': 'my-16',
        '3xl': 'my-20',
        '4xl': 'my-24',
        '5xl': 'my-32',
        '6xl': 'my-40',
      },
      marginX: {
        none: 'mx-0',
        xs: 'mx-2',
        sm: 'mx-4',
        default: 'mx-6',
        lg: 'mx-8',
        xl: 'mx-12',
        '2xl': 'mx-16',
        '3xl': 'mx-20',
        '4xl': 'mx-24',
        '5xl': 'mx-32',
        '6xl': 'mx-40',
      },
      marginY: {
        none: 'my-0',
        xs: 'my-2',
        sm: 'my-4',
        default: 'my-6',
        lg: 'my-8',
        xl: 'my-12',
        '2xl': 'my-16',
        '3xl': 'my-20',
        '4xl': 'my-24',
        '5xl': 'my-32',
        '6xl': 'my-40',
      },
      padding: {
        none: 'p-0',
        xs: 'px-2',
        sm: 'px-4',
        default: 'px-6',
        lg: 'px-8',
        xl: 'px-12',
        '2xl': 'px-16',
        '3xl': 'px-20',
        '4xl': 'px-24',
        '5xl': 'px-32',
        '6xl': 'px-40',
      },
      paddingX: {
        none: 'px-0',
        xs: 'px-2',
        sm: 'px-4',
        default: 'px-6',
        lg: 'px-8',
        xl: 'px-12',
        '2xl': 'px-16',
        '3xl': 'px-20',
        '4xl': 'px-24',
        '5xl': 'px-32',
        '6xl': 'px-40',
      },
      paddingY: {
        none: 'py-0',
        xs: 'py-2',
        sm: 'py-4',
        default: 'py-6',
        lg: 'py-8',
        xl: 'py-12',
        '2xl': 'py-16',
        '3xl': 'py-20',
        '4xl': 'py-24',
        '5xl': 'py-32',
        '6xl': 'py-40',
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
      opacity: {
        0: 'opacity-0',
        5: 'opacity-5',
        10: 'opacity-10',
        20: 'opacity-20',
        25: 'opacity-25',
        30: 'opacity-30',
        40: 'opacity-40',
        50: 'opacity-50',
        60: 'opacity-60',
        70: 'opacity-70',
        75: 'opacity-75',
        80: 'opacity-80',
        90: 'opacity-90',
        95: 'opacity-95',
        100: 'opacity-100',
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
      orientation: 'horizontal',
      size: 'default',
      width: 'default',
      height: 'default',
      margin: 'default',
      marginX: 'none',
      marginY: 'default',
      padding: 'none',
      paddingX: 'none',
      paddingY: 'none',
      background: 'none',
      rounded: 'none',
      shadow: 'none',
      opacity: 100,
      visibility: 'visible',
      display: 'block',
    },
  }
);

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {
  variant?: 'default' | 'solid' | 'dashed' | 'dotted' | 'double' | 'thick' | 'thin' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'subtle' | 'strong' | 'gradient' | 'shadow' | 'none';
  orientation?: 'horizontal' | 'vertical' | 'both';
  size?: 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  width?: 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'auto';
  height?: 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'auto';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  marginX?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  marginY?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  paddingX?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  paddingY?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  opacity?: 0 | 5 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 95 | 100;
  visibility?: 'visible' | 'hidden' | 'collapse';
  display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'table' | 'inline-table' | 'table-cell' | 'table-row' | 'table-column' | 'table-column-group' | 'table-header-group' | 'table-footer-group' | 'table-row-group' | 'table-caption' | 'none';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({
    className,
    variant,
    orientation,
    size,
    width,
    height,
    margin,
    marginX,
    marginY,
    padding,
    paddingX,
    paddingY,
    background,
    rounded,
    shadow,
    opacity,
    visibility,
    display,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const dividerProps = asChild ? {} : {
      ref,
      className: cn(
        dividerVariants({
          variant,
          orientation,
          size,
          width,
          height,
          margin,
          marginX,
          marginY,
          padding,
          paddingX,
          paddingY,
          background,
          rounded,
          shadow,
          opacity,
          visibility,
          display,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...dividerProps}>
        {children}
      </Comp>
    );
  }
);
Divider.displayName = 'Divider';

// Additional utility components for advanced divider functionality
const DividerHorizontal = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'orientation'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    orientation="horizontal"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerHorizontal.displayName = 'DividerHorizontal';

const DividerVertical = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'orientation'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    orientation="vertical"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerVertical.displayName = 'DividerVertical';

const DividerSolid = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerSolid.displayName = 'DividerSolid';

const DividerDashed = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="dashed"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerDashed.displayName = 'DividerDashed';

const DividerDotted = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="dotted"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerDotted.displayName = 'DividerDotted';

const DividerDouble = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="double"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerDouble.displayName = 'DividerDouble';

const DividerThick = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="thick"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerThick.displayName = 'DividerThick';

const DividerThin = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="thin"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerThin.displayName = 'DividerThin';

const DividerPrimary = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="primary"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerPrimary.displayName = 'DividerPrimary';

const DividerSecondary = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="secondary"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerSecondary.displayName = 'DividerSecondary';

const DividerSuccess = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="success"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerSuccess.displayName = 'DividerSuccess';

const DividerWarning = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="warning"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerWarning.displayName = 'DividerWarning';

const DividerError = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="error"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerError.displayName = 'DividerError';

const DividerInfo = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="info"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerInfo.displayName = 'DividerInfo';

const DividerSubtle = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="subtle"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerSubtle.displayName = 'DividerSubtle';

const DividerStrong = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="strong"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerStrong.displayName = 'DividerStrong';

const DividerGradient = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerGradient.displayName = 'DividerGradient';

const DividerShadow = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="shadow"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerShadow.displayName = 'DividerShadow';

const DividerNone = React.forwardRef<
  HTMLDivElement,
  Omit<DividerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Divider
    ref={ref}
    variant="none"
    className={className}
    {...props}
  >
    {children}
  </Divider>
));
DividerNone.displayName = 'DividerNone';

// Divider with responsive breakpoints
const DividerResponsive = React.forwardRef<
  HTMLDivElement,
  DividerProps & {
    breakpoints?: {
      sm?: Partial<DividerProps>;
      md?: Partial<DividerProps>;
      lg?: Partial<DividerProps>;
      xl?: Partial<DividerProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.orientation) {
      classes.push(`sm:${breakpoints.sm.orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'}`);
    }
    if (breakpoints.md?.orientation) {
      classes.push(`md:${breakpoints.md.orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'}`);
    }
    if (breakpoints.lg?.orientation) {
      classes.push(`lg:${breakpoints.lg.orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'}`);
    }
    if (breakpoints.xl?.orientation) {
      classes.push(`xl:${breakpoints.xl.orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Divider
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Divider>
  );
});
DividerResponsive.displayName = 'DividerResponsive';

// Divider with spacing utilities
const DividerSpacing = React.forwardRef<
  HTMLDivElement,
  DividerProps & {
    spacingSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ className, spacingSize = 'md', children, ...props }, ref) => {
  const spacingSizes = {
    xs: 'xs',
    sm: 'sm',
    md: 'default',
    lg: 'lg',
    xl: 'xl',
  };

  return (
    <Divider
      ref={ref}
      margin={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Divider>
  );
});
DividerSpacing.displayName = 'DividerSpacing';

// Divider with opacity utilities
const DividerOpacity = React.forwardRef<
  HTMLDivElement,
  DividerProps & {
    opacityLevel?: 'low' | 'medium' | 'high';
  }
>(({ className, opacityLevel = 'medium', children, ...props }, ref) => {
  const opacityLevels = {
    low: 30,
    medium: 50,
    high: 75,
  };

  return (
    <Divider
      ref={ref}
      opacity={opacityLevels[opacityLevel]}
      className={className}
      {...props}
    >
      {children}
    </Divider>
  );
});
DividerOpacity.displayName = 'DividerOpacity';

export {
  Divider,
  DividerHorizontal,
  DividerVertical,
  DividerSolid,
  DividerDashed,
  DividerDotted,
  DividerDouble,
  DividerThick,
  DividerThin,
  DividerPrimary,
  DividerSecondary,
  DividerSuccess,
  DividerWarning,
  DividerError,
  DividerInfo,
  DividerSubtle,
  DividerStrong,
  DividerGradient,
  DividerShadow,
  DividerNone,
  DividerResponsive,
  DividerSpacing,
  DividerOpacity,
  dividerVariants,
};
