import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const headerVariants = cva(
  'w-full flex items-center justify-between',
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

const headerBrandVariants = cva(
  'flex items-center space-x-3',
  {
    variants: {
      variant: {
        default: '',
        logo: 'font-bold text-xl',
        text: 'font-semibold text-lg',
        icon: 'text-2xl',
        image: 'w-8 h-8',
        combined: 'flex items-center space-x-3',
      },
      size: {
        xs: 'text-sm',
        sm: 'text-base',
        default: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl',
        '3xl': 'text-4xl',
        '4xl': 'text-5xl',
        '5xl': 'text-6xl',
        '6xl': 'text-7xl',
      },
      color: {
        default: 'text-atlas-text-primary',
        primary: 'text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        error: 'text-atlas-error-main',
        info: 'text-atlas-info-main',
        inverse: 'text-atlas-text-inverse',
        muted: 'text-atlas-text-muted',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      color: 'default',
      weight: 'semibold',
    },
  }
);

const headerNavVariants = cva(
  'flex items-center space-x-6',
  {
    variants: {
      variant: {
        default: '',
        horizontal: 'flex-row space-x-6',
        vertical: 'flex-col space-y-4',
        dropdown: 'relative',
        mobile: 'flex-col space-y-2',
        desktop: 'flex-row space-x-6',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
      },
      color: {
        default: 'text-atlas-text-primary',
        primary: 'text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        error: 'text-atlas-error-main',
        info: 'text-atlas-info-main',
        inverse: 'text-atlas-text-inverse',
        muted: 'text-atlas-text-muted',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      color: 'default',
      weight: 'medium',
    },
  }
);

const headerActionsVariants = cva(
  'flex items-center space-x-3',
  {
    variants: {
      variant: {
        default: '',
        buttons: 'flex items-center space-x-2',
        icons: 'flex items-center space-x-3',
        mixed: 'flex items-center space-x-3',
        mobile: 'flex items-center space-x-2',
        desktop: 'flex items-center space-x-3',
      },
      size: {
        xs: 'text-xs',
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl',
        '4xl': 'text-4xl',
        '5xl': 'text-5xl',
        '6xl': 'text-6xl',
      },
      color: {
        default: 'text-atlas-text-primary',
        primary: 'text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        error: 'text-atlas-error-main',
        info: 'text-atlas-info-main',
        inverse: 'text-atlas-text-inverse',
        muted: 'text-atlas-text-muted',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      color: 'default',
      weight: 'medium',
    },
  }
);

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof headerVariants> {
  variant?: 'default' | 'transparent' | 'solid' | 'gradient' | 'dark' | 'light' | 'sticky' | 'fixed' | 'floating';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
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

export interface HeaderBrandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerBrandVariants> {
  variant?: 'default' | 'logo' | 'text' | 'icon' | 'image' | 'combined';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface HeaderNavProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerNavVariants> {
  variant?: 'default' | 'horizontal' | 'vertical' | 'dropdown' | 'mobile' | 'desktop';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface HeaderActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerActionsVariants> {
  variant?: 'default' | 'buttons' | 'icons' | 'mixed' | 'mobile' | 'desktop';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
  ({
    className,
    variant,
    size,
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
    const Comp = asChild ? React.Fragment : 'header';
    
    const headerProps = asChild ? {} : {
      ref,
      className: cn(
        headerVariants({
          variant,
          size,
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
      <Comp {...headerProps}>
        {children}
      </Comp>
    );
  }
);
Header.displayName = 'Header';

const HeaderBrand = React.forwardRef<HTMLDivElement, HeaderBrandProps>(
  ({
    className,
    variant,
    size,
    color,
    weight,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const brandProps = asChild ? {} : {
      ref,
      className: cn(
        headerBrandVariants({
          variant,
          size,
          color,
          weight,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...brandProps}>
        {children}
      </Comp>
    );
  }
);
HeaderBrand.displayName = 'HeaderBrand';

const HeaderNav = React.forwardRef<HTMLDivElement, HeaderNavProps>(
  ({
    className,
    variant,
    size,
    color,
    weight,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'nav';
    
    const navProps = asChild ? {} : {
      ref,
      className: cn(
        headerNavVariants({
          variant,
          size,
          color,
          weight,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...navProps}>
        {children}
      </Comp>
    );
  }
);
HeaderNav.displayName = 'HeaderNav';

const HeaderActions = React.forwardRef<HTMLDivElement, HeaderActionsProps>(
  ({
    className,
    variant,
    size,
    color,
    weight,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const actionsProps = asChild ? {} : {
      ref,
      className: cn(
        headerActionsVariants({
          variant,
          size,
          color,
          weight,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...actionsProps}>
        {children}
      </Comp>
    );
  }
);
HeaderActions.displayName = 'HeaderActions';

// Additional utility components for advanced header functionality
const HeaderSticky = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="sticky"
    position="sticky"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderSticky.displayName = 'HeaderSticky';

const HeaderFixed = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="fixed"
    position="fixed"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderFixed.displayName = 'HeaderFixed';

const HeaderFloating = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="floating"
    position="absolute"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderFloating.displayName = 'HeaderFloating';

const HeaderTransparent = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderTransparent.displayName = 'HeaderTransparent';

const HeaderSolid = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderSolid.displayName = 'HeaderSolid';

const HeaderGradient = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderGradient.displayName = 'HeaderGradient';

const HeaderDark = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderDark.displayName = 'HeaderDark';

const HeaderLight = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderLight.displayName = 'HeaderLight';

// Header with responsive breakpoints
const HeaderResponsive = React.forwardRef<
  HTMLElement,
  HeaderProps & {
    breakpoints?: {
      sm?: Partial<HeaderProps>;
      md?: Partial<HeaderProps>;
      lg?: Partial<HeaderProps>;
      xl?: Partial<HeaderProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.size) {
      classes.push(`sm:h-${breakpoints.sm.size}`);
    }
    if (breakpoints.md?.size) {
      classes.push(`md:h-${breakpoints.md.size}`);
    }
    if (breakpoints.lg?.size) {
      classes.push(`lg:h-${breakpoints.lg.size}`);
    }
    if (breakpoints.xl?.size) {
      classes.push(`xl:h-${breakpoints.xl.size}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Header
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Header>
  );
});
HeaderResponsive.displayName = 'HeaderResponsive';

// Header with spacing utilities
const HeaderSpacing = React.forwardRef<
  HTMLElement,
  HeaderProps & {
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
    <Header
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Header>
  );
});
HeaderSpacing.displayName = 'HeaderSpacing';

// Header with card styling
const HeaderCard = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Header
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
  </Header>
));
HeaderCard.displayName = 'HeaderCard';

// Header with section styling
const HeaderSection = React.forwardRef<
  HTMLElement,
  Omit<HeaderProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Header
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Header>
));
HeaderSection.displayName = 'HeaderSection';

export {
  Header,
  HeaderBrand,
  HeaderNav,
  HeaderActions,
  HeaderSticky,
  HeaderFixed,
  HeaderFloating,
  HeaderTransparent,
  HeaderSolid,
  HeaderGradient,
  HeaderDark,
  HeaderLight,
  HeaderResponsive,
  HeaderSpacing,
  HeaderCard,
  HeaderSection,
  headerVariants,
  headerBrandVariants,
  headerNavVariants,
  headerActionsVariants,
};
