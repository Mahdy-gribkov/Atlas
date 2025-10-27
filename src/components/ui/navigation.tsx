import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const navigationVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg border-b border-atlas-border',
        transparent: 'bg-transparent',
        solid: 'bg-atlas-card-bg',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse',
        light: 'bg-atlas-text-inverse text-atlas-text-primary',
        sticky: 'sticky top-0 z-50 bg-atlas-card-bg border-b border-atlas-border',
        fixed: 'fixed top-0 z-50 bg-atlas-card-bg border-b border-atlas-border',
        floating: 'absolute top-0 z-50 bg-atlas-card-bg border-b border-atlas-border rounded-lg shadow-lg',
      },
      size: {
        xs: 'h-12 px-4',
        sm: 'h-14 px-6',
        default: 'h-16 px-8',
        lg: 'h-20 px-10',
        xl: 'h-24 px-12',
        '2xl': 'h-28 px-16',
        '3xl': 'h-32 px-20',
        '4xl': 'h-36 px-24',
        '5xl': 'h-40 px-28',
        '6xl': 'h-44 px-32',
        auto: 'h-auto py-4 px-8',
      },
      direction: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
        'horizontal-reverse': 'flex-row-reverse',
        'vertical-reverse': 'flex-col-reverse',
      },
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      wrap: {
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      gap: {
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
      padding: {
        none: 'p-0',
        xs: 'px-4 py-2',
        sm: 'px-6 py-3',
        default: 'px-8 py-4',
        lg: 'px-10 py-5',
        xl: 'px-12 py-6',
        '2xl': 'px-16 py-8',
        '3xl': 'px-20 py-10',
        '4xl': 'px-24 py-12',
        '5xl': 'px-28 py-14',
        '6xl': 'px-32 py-16',
      },
      margin: {
        none: 'm-0',
        xs: 'mx-4 my-2',
        sm: 'mx-6 my-3',
        default: 'mx-8 my-4',
        lg: 'mx-10 my-5',
        xl: 'mx-12 my-6',
        '2xl': 'mx-16 my-8',
        '3xl': 'mx-20 my-10',
        '4xl': 'mx-24 my-12',
        '5xl': 'mx-28 my-14',
        '6xl': 'mx-32 my-16',
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
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main',
        pattern: 'bg-atlas-pattern',
        image: 'bg-cover bg-center bg-no-repeat',
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
        top: 'border-t border-atlas-border',
        bottom: 'border-b border-atlas-border',
        left: 'border-l border-atlas-border',
        right: 'border-r border-atlas-border',
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
      position: {
        static: 'static',
        relative: 'relative',
        absolute: 'absolute',
        fixed: 'fixed',
        sticky: 'sticky',
      },
      zIndex: {
        0: 'z-0',
        10: 'z-10',
        20: 'z-20',
        30: 'z-30',
        40: 'z-40',
        50: 'z-50',
        auto: 'z-auto',
      },
      overflow: {
        visible: 'overflow-visible',
        hidden: 'overflow-hidden',
        scroll: 'overflow-scroll',
        auto: 'overflow-auto',
        'x-hidden': 'overflow-x-hidden',
        'y-hidden': 'overflow-y-hidden',
        'x-scroll': 'overflow-x-scroll',
        'y-scroll': 'overflow-y-scroll',
        'x-auto': 'overflow-x-auto',
        'y-auto': 'overflow-y-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      direction: 'horizontal',
      align: 'start',
      wrap: 'nowrap',
      gap: 4,
      padding: 'default',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
      position: 'static',
      zIndex: 'auto',
      overflow: 'visible',
    },
  }
);

const navigationItemVariants = cva(
  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'text-atlas-text-primary hover:text-atlas-primary-main hover:bg-atlas-primary-subtle',
        primary: 'text-atlas-primary-main hover:text-atlas-primary-dark hover:bg-atlas-primary-subtle',
        secondary: 'text-atlas-secondary-main hover:text-atlas-secondary-dark hover:bg-atlas-secondary-subtle',
        success: 'text-atlas-success-main hover:text-atlas-success-dark hover:bg-atlas-success-subtle',
        warning: 'text-atlas-warning-main hover:text-atlas-warning-dark hover:bg-atlas-warning-subtle',
        error: 'text-atlas-error-main hover:text-atlas-error-dark hover:bg-atlas-error-subtle',
        info: 'text-atlas-info-main hover:text-atlas-info-dark hover:bg-atlas-info-subtle',
        inverse: 'text-atlas-text-inverse hover:text-atlas-text-inverse hover:bg-atlas-text-inverse-subtle',
        muted: 'text-atlas-text-muted hover:text-atlas-text-primary hover:bg-atlas-border-subtle',
        ghost: 'text-atlas-text-primary hover:text-atlas-primary-main hover:bg-transparent',
        outline: 'text-atlas-text-primary border border-atlas-border hover:text-atlas-primary-main hover:border-atlas-primary-main',
        solid: 'text-atlas-text-inverse bg-atlas-primary-main hover:bg-atlas-primary-dark',
      },
      size: {
        xs: 'px-2 py-1 text-xs',
        sm: 'px-3 py-1.5 text-sm',
        default: 'px-3 py-2 text-sm',
        lg: 'px-4 py-2.5 text-base',
        xl: 'px-5 py-3 text-lg',
        '2xl': 'px-6 py-4 text-xl',
        '3xl': 'px-8 py-5 text-2xl',
        '4xl': 'px-10 py-6 text-3xl',
        '5xl': 'px-12 py-7 text-4xl',
        '6xl': 'px-16 py-8 text-5xl',
      },
      state: {
        default: '',
        active: 'bg-atlas-primary-main text-atlas-text-inverse',
        disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
        loading: 'opacity-75 cursor-wait pointer-events-none',
        error: 'text-atlas-error-main bg-atlas-error-subtle',
        success: 'text-atlas-success-main bg-atlas-success-subtle',
        warning: 'text-atlas-warning-main bg-atlas-warning-subtle',
        info: 'text-atlas-info-main bg-atlas-info-subtle',
      },
      weight: {
        light: 'font-light',
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
        extrabold: 'font-extrabold',
        black: 'font-black',
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
      size: 'default',
      state: 'default',
      weight: 'medium',
      rounded: 'default',
      shadow: 'none',
    },
  }
);

const navigationListVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: '',
        horizontal: 'flex-row space-x-1',
        vertical: 'flex-col space-y-1',
        'horizontal-reverse': 'flex-row-reverse space-x-reverse space-x-1',
        'vertical-reverse': 'flex-col-reverse space-y-reverse space-y-1',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      gap: {
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
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-5',
        xl: 'p-6',
        '2xl': 'p-8',
        '3xl': 'p-10',
        '4xl': 'p-12',
        '5xl': 'p-14',
        '6xl': 'p-16',
      },
      margin: {
        none: 'm-0',
        xs: 'm-2',
        sm: 'm-3',
        default: 'm-4',
        lg: 'm-5',
        xl: 'm-6',
        '2xl': 'm-8',
        '3xl': 'm-10',
        '4xl': 'm-12',
        '5xl': 'm-14',
        '6xl': 'm-16',
        auto: 'mx-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      align: 'center',
      justify: 'start',
      gap: 1,
      padding: 'none',
      margin: 'none',
    },
  }
);

export interface NavigationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof navigationVariants> {
  variant?: 'default' | 'transparent' | 'solid' | 'gradient' | 'dark' | 'light' | 'sticky' | 'fixed' | 'floating';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  direction?: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 'auto';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'x-hidden' | 'y-hidden' | 'x-scroll' | 'y-scroll' | 'x-auto' | 'y-auto';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface NavigationItemProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof navigationItemVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted' | 'ghost' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface NavigationListProps
  extends React.HTMLAttributes<HTMLUListElement>,
    VariantProps<typeof navigationListVariants> {
  variant?: 'default' | 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse' | 'wrap' | 'wrap-reverse' | 'nowrap';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Navigation = React.forwardRef<HTMLElement, NavigationProps>(
  ({
    className,
    variant,
    size,
    direction,
    align,
    wrap,
    gap,
    padding,
    margin,
    background,
    border,
    rounded,
    shadow,
    position,
    zIndex,
    overflow,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'nav';
    
    const navigationProps = asChild ? {} : {
      ref,
      className: cn(
        navigationVariants({
          variant,
          size,
          direction,
          align,
          wrap,
          gap,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          position,
          zIndex,
          overflow,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...navigationProps}>
        {children}
      </Comp>
    );
  }
);
Navigation.displayName = 'Navigation';

const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  ({
    className,
    variant,
    size,
    state,
    weight,
    rounded,
    shadow,
    href,
    target,
    rel,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'a';
    
    const itemProps = asChild ? {} : {
      ref,
      href,
      target,
      rel,
      className: cn(
        navigationItemVariants({
          variant,
          size,
          state,
          weight,
          rounded,
          shadow,
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
NavigationItem.displayName = 'NavigationItem';

const NavigationList = React.forwardRef<HTMLUListElement, NavigationListProps>(
  ({
    className,
    variant,
    align,
    justify,
    gap,
    padding,
    margin,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'ul';
    
    const listProps = asChild ? {} : {
      ref,
      className: cn(
        navigationListVariants({
          variant,
          align,
          justify,
          gap,
          padding,
          margin,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...listProps}>
        {children}
      </Comp>
    );
  }
);
NavigationList.displayName = 'NavigationList';

// Additional utility components for advanced navigation functionality
const NavigationHorizontal = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    direction="horizontal"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationHorizontal.displayName = 'NavigationHorizontal';

const NavigationVertical = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    direction="vertical"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationVertical.displayName = 'NavigationVertical';

const NavigationSticky = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="sticky"
    position="sticky"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationSticky.displayName = 'NavigationSticky';

const NavigationFixed = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="fixed"
    position="fixed"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationFixed.displayName = 'NavigationFixed';

const NavigationFloating = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="floating"
    position="absolute"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationFloating.displayName = 'NavigationFloating';

const NavigationTransparent = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationTransparent.displayName = 'NavigationTransparent';

const NavigationSolid = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationSolid.displayName = 'NavigationSolid';

const NavigationGradient = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationGradient.displayName = 'NavigationGradient';

const NavigationDark = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationDark.displayName = 'NavigationDark';

const NavigationLight = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationLight.displayName = 'NavigationLight';

// Navigation with responsive breakpoints
const NavigationResponsive = React.forwardRef<
  HTMLElement,
  NavigationProps & {
    breakpoints?: {
      sm?: Partial<NavigationProps>;
      md?: Partial<NavigationProps>;
      lg?: Partial<NavigationProps>;
      xl?: Partial<NavigationProps>;
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
    <Navigation
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Navigation>
  );
});
NavigationResponsive.displayName = 'NavigationResponsive';

// Navigation with spacing utilities
const NavigationSpacing = React.forwardRef<
  HTMLElement,
  NavigationProps & {
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
    <Navigation
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Navigation>
  );
});
NavigationSpacing.displayName = 'NavigationSpacing';

// Navigation with card styling
const NavigationCard = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Navigation
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
  </Navigation>
));
NavigationCard.displayName = 'NavigationCard';

// Navigation with section styling
const NavigationSection = React.forwardRef<
  HTMLElement,
  Omit<NavigationProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Navigation
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Navigation>
));
NavigationSection.displayName = 'NavigationSection';

export {
  Navigation,
  NavigationItem,
  NavigationList,
  NavigationHorizontal,
  NavigationVertical,
  NavigationSticky,
  NavigationFixed,
  NavigationFloating,
  NavigationTransparent,
  NavigationSolid,
  NavigationGradient,
  NavigationDark,
  NavigationLight,
  NavigationResponsive,
  NavigationSpacing,
  NavigationCard,
  NavigationSection,
  navigationVariants,
  navigationItemVariants,
  navigationListVariants,
};
