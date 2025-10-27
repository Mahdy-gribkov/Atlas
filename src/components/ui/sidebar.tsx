import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const sidebarVariants = cva(
  'flex flex-col h-full',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg border-r border-atlas-border',
        transparent: 'bg-transparent',
        solid: 'bg-atlas-card-bg',
        gradient: 'bg-gradient-to-b from-atlas-primary-main to-atlas-secondary-main',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse',
        light: 'bg-atlas-text-inverse text-atlas-text-primary',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg',
        overlay: 'bg-atlas-card-bg border-r border-atlas-border shadow-xl',
        minimal: 'bg-transparent border-r border-atlas-border-subtle',
      },
      size: {
        xs: 'w-48',
        sm: 'w-56',
        default: 'w-64',
        lg: 'w-72',
        xl: 'w-80',
        '2xl': 'w-96',
        '3xl': 'w-[28rem]',
        '4xl': 'w-[32rem]',
        '5xl': 'w-[36rem]',
        '6xl': 'w-[40rem]',
        auto: 'w-auto',
        full: 'w-full',
      },
      position: {
        left: 'left-0',
        right: 'right-0',
        top: 'top-0',
        bottom: 'bottom-0',
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
        gradient: 'bg-gradient-to-b from-atlas-primary-main to-atlas-secondary-main',
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
      transition: {
        none: '',
        smooth: 'transition-all duration-300 ease-in-out',
        fast: 'transition-all duration-150 ease-in-out',
        slow: 'transition-all duration-500 ease-in-out',
        bounce: 'transition-all duration-300 ease-bounce',
        elastic: 'transition-all duration-300 ease-elastic',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'left',
      padding: 'default',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
      zIndex: 'auto',
      overflow: 'auto',
      transition: 'smooth',
    },
  }
);

const sidebarHeaderVariants = cva(
  'flex items-center justify-between p-4 border-b border-atlas-border',
  {
    variants: {
      variant: {
        default: '',
        compact: 'p-2',
        expanded: 'p-6',
        minimal: 'p-2 border-b-0',
        floating: 'p-4 bg-atlas-card-bg rounded-lg shadow-sm',
        transparent: 'p-4 bg-transparent',
      },
      size: {
        xs: 'h-12',
        sm: 'h-14',
        default: 'h-16',
        lg: 'h-20',
        xl: 'h-24',
        '2xl': 'h-28',
        '3xl': 'h-32',
        '4xl': 'h-36',
        '5xl': 'h-40',
        '6xl': 'h-44',
        auto: 'h-auto',
      },
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      direction: {
        row: 'flex-row',
        col: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'col-reverse': 'flex-col-reverse',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      align: 'between',
      direction: 'row',
      gap: 4,
    },
  }
);

const sidebarContentVariants = cva(
  'flex-1 overflow-y-auto',
  {
    variants: {
      variant: {
        default: '',
        scrollable: 'overflow-y-scroll',
        hidden: 'overflow-hidden',
        auto: 'overflow-y-auto',
        visible: 'overflow-visible',
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
      spacing: {
        none: 'space-y-0',
        xs: 'space-y-1',
        sm: 'space-y-2',
        default: 'space-y-3',
        lg: 'space-y-4',
        xl: 'space-y-6',
        '2xl': 'space-y-8',
        '3xl': 'space-y-10',
        '4xl': 'space-y-12',
        '5xl': 'space-y-14',
        '6xl': 'space-y-16',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      spacing: 'default',
    },
  }
);

const sidebarFooterVariants = cva(
  'p-4 border-t border-atlas-border',
  {
    variants: {
      variant: {
        default: '',
        compact: 'p-2',
        expanded: 'p-6',
        minimal: 'p-2 border-t-0',
        floating: 'p-4 bg-atlas-card-bg rounded-lg shadow-sm',
        transparent: 'p-4 bg-transparent',
      },
      size: {
        xs: 'h-12',
        sm: 'h-14',
        default: 'h-16',
        lg: 'h-20',
        xl: 'h-24',
        '2xl': 'h-28',
        '3xl': 'h-32',
        '4xl': 'h-36',
        '5xl': 'h-40',
        '6xl': 'h-44',
        auto: 'h-auto',
      },
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      direction: {
        row: 'flex-row',
        col: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'col-reverse': 'flex-col-reverse',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      align: 'center',
      direction: 'row',
      gap: 4,
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  variant?: 'default' | 'transparent' | 'solid' | 'gradient' | 'dark' | 'light' | 'floating' | 'overlay' | 'minimal';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto' | 'full';
  position?: 'left' | 'right' | 'top' | 'bottom';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 'auto';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'x-hidden' | 'y-hidden' | 'x-scroll' | 'y-scroll' | 'x-auto' | 'y-auto';
  transition?: 'none' | 'smooth' | 'fast' | 'slow' | 'bounce' | 'elastic';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarHeaderVariants> {
  variant?: 'default' | 'compact' | 'expanded' | 'minimal' | 'floating' | 'transparent';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarContentVariants> {
  variant?: 'default' | 'scrollable' | 'hidden' | 'auto' | 'visible';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  spacing?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface SidebarFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarFooterVariants> {
  variant?: 'default' | 'compact' | 'expanded' | 'minimal' | 'floating' | 'transparent';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  asChild?: boolean;
  children?: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({
    className,
    variant,
    size,
    position,
    padding,
    margin,
    background,
    border,
    rounded,
    shadow,
    zIndex,
    overflow,
    transition,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const sidebarProps = asChild ? {} : {
      ref,
      className: cn(
        sidebarVariants({
          variant,
          size,
          position,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          zIndex,
          overflow,
          transition,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...sidebarProps}>
        {children}
      </Comp>
    );
  }
);
Sidebar.displayName = 'Sidebar';

const SidebarHeader = React.forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({
    className,
    variant,
    size,
    align,
    direction,
    gap,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const headerProps = asChild ? {} : {
      ref,
      className: cn(
        sidebarHeaderVariants({
          variant,
          size,
          align,
          direction,
          gap,
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
SidebarHeader.displayName = 'SidebarHeader';

const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  ({
    className,
    variant,
    padding,
    spacing,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const contentProps = asChild ? {} : {
      ref,
      className: cn(
        sidebarContentVariants({
          variant,
          padding,
          spacing,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...contentProps}>
        {children}
      </Comp>
    );
  }
);
SidebarContent.displayName = 'SidebarContent';

const SidebarFooter = React.forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({
    className,
    variant,
    size,
    align,
    direction,
    gap,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const footerProps = asChild ? {} : {
      ref,
      className: cn(
        sidebarFooterVariants({
          variant,
          size,
          align,
          direction,
          gap,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...footerProps}>
        {children}
      </Comp>
    );
  }
);
SidebarFooter.displayName = 'SidebarFooter';

// Additional utility components for advanced sidebar functionality
const SidebarLeft = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'position'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    position="left"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarLeft.displayName = 'SidebarLeft';

const SidebarRight = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'position'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    position="right"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarRight.displayName = 'SidebarRight';

const SidebarTop = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'position'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    position="top"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarTop.displayName = 'SidebarTop';

const SidebarBottom = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'position'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    position="bottom"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarBottom.displayName = 'SidebarBottom';

const SidebarFloating = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarFloating.displayName = 'SidebarFloating';

const SidebarOverlay = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="overlay"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarOverlay.displayName = 'SidebarOverlay';

const SidebarMinimal = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarMinimal.displayName = 'SidebarMinimal';

const SidebarTransparent = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarTransparent.displayName = 'SidebarTransparent';

const SidebarSolid = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarSolid.displayName = 'SidebarSolid';

const SidebarGradient = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarGradient.displayName = 'SidebarGradient';

const SidebarDark = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarDark.displayName = 'SidebarDark';

const SidebarLight = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarLight.displayName = 'SidebarLight';

// Sidebar with responsive breakpoints
const SidebarResponsive = React.forwardRef<
  HTMLDivElement,
  SidebarProps & {
    breakpoints?: {
      sm?: Partial<SidebarProps>;
      md?: Partial<SidebarProps>;
      lg?: Partial<SidebarProps>;
      xl?: Partial<SidebarProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.size) {
      classes.push(`sm:w-${breakpoints.sm.size}`);
    }
    if (breakpoints.md?.size) {
      classes.push(`md:w-${breakpoints.md.size}`);
    }
    if (breakpoints.lg?.size) {
      classes.push(`lg:w-${breakpoints.lg.size}`);
    }
    if (breakpoints.xl?.size) {
      classes.push(`xl:w-${breakpoints.xl.size}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Sidebar
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Sidebar>
  );
});
SidebarResponsive.displayName = 'SidebarResponsive';

// Sidebar with spacing utilities
const SidebarSpacing = React.forwardRef<
  HTMLDivElement,
  SidebarProps & {
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
    <Sidebar
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Sidebar>
  );
});
SidebarSpacing.displayName = 'SidebarSpacing';

// Sidebar with card styling
const SidebarCard = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
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
  </Sidebar>
));
SidebarCard.displayName = 'SidebarCard';

// Sidebar with section styling
const SidebarSection = React.forwardRef<
  HTMLDivElement,
  Omit<SidebarProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Sidebar
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Sidebar>
));
SidebarSection.displayName = 'SidebarSection';

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarLeft,
  SidebarRight,
  SidebarTop,
  SidebarBottom,
  SidebarFloating,
  SidebarOverlay,
  SidebarMinimal,
  SidebarTransparent,
  SidebarSolid,
  SidebarGradient,
  SidebarDark,
  SidebarLight,
  SidebarResponsive,
  SidebarSpacing,
  SidebarCard,
  SidebarSection,
  sidebarVariants,
  sidebarHeaderVariants,
  sidebarContentVariants,
  sidebarFooterVariants,
};
