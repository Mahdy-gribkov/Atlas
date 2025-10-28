import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const footerVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg border-t border-atlas-border',
        transparent: 'bg-transparent',
        solid: 'bg-atlas-card-bg',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse',
        light: 'bg-atlas-text-inverse text-atlas-text-primary',
        sticky: 'sticky bottom-0 z-50 bg-atlas-card-bg border-t border-atlas-border',
        fixed: 'fixed bottom-0 z-50 bg-atlas-card-bg border-t border-atlas-border',
        floating: 'absolute bottom-0 z-50 bg-atlas-card-bg border-t border-atlas-border rounded-lg shadow-lg',
      },
      size: {
        xs: 'py-4 px-4',
        sm: 'py-6 px-6',
        default: 'py-8 px-8',
        lg: 'py-10 px-10',
        xl: 'py-12 px-12',
        '2xl': 'py-16 px-16',
        '3xl': 'py-20 px-20',
        '4xl': 'py-24 px-24',
        '5xl': 'py-28 px-28',
        '6xl': 'py-32 px-32',
        auto: 'py-auto px-8',
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

const footerContentVariants = cva(
  'flex flex-col space-y-6',
  {
    variants: {
      variant: {
        default: '',
        grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
        flex: 'flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-6',
        centered: 'flex flex-col items-center text-center space-y-4',
        sidebar: 'flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8',
        compact: 'flex flex-col space-y-2',
        expanded: 'flex flex-col space-y-8',
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
      direction: {
        row: 'flex-row',
        col: 'flex-col',
        'row-reverse': 'flex-row-reverse',
        'col-reverse': 'flex-col-reverse',
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
    },
    defaultVariants: {
      variant: 'default',
      align: 'start',
      justify: 'start',
      direction: 'col',
      wrap: 'nowrap',
      gap: 6,
    },
  }
);

const footerSectionVariants = cva(
  'flex flex-col space-y-3',
  {
    variants: {
      variant: {
        default: '',
        links: 'space-y-2',
        text: 'space-y-1',
        social: 'flex flex-row space-x-3',
        contact: 'space-y-2',
        legal: 'space-y-1',
        newsletter: 'space-y-3',
        brand: 'space-y-2',
        navigation: 'space-y-2',
        info: 'space-y-1',
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
      weight: 'normal',
    },
  }
);

const footerCopyrightVariants = cva(
  'text-center text-sm text-atlas-text-muted',
  {
    variants: {
      variant: {
        default: '',
        left: 'text-left',
        right: 'text-right',
        center: 'text-center',
        justified: 'text-justify',
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
        default: 'text-atlas-text-muted',
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
      weight: 'normal',
    },
  }
);

export interface FooterProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof footerVariants> {
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

export interface FooterContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerContentVariants> {
  variant?: 'default' | 'grid' | 'flex' | 'centered' | 'sidebar' | 'compact' | 'expanded';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface FooterSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerSectionVariants> {
  variant?: 'default' | 'links' | 'text' | 'social' | 'contact' | 'legal' | 'newsletter' | 'brand' | 'navigation' | 'info';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface FooterCopyrightProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof footerCopyrightVariants> {
  variant?: 'default' | 'left' | 'right' | 'center' | 'justified';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
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
    const Comp = asChild ? React.Fragment : 'footer';
    
    const footerProps = asChild ? {} : {
      ref,
      className: cn(
        footerVariants({
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
      <Comp {...footerProps}>
        {children}
      </Comp>
    );
  }
);
Footer.displayName = 'Footer';

const FooterContent = React.forwardRef<HTMLDivElement, FooterContentProps>(
  ({
    className,
    variant,
    align,
    justify,
    direction,
    wrap,
    gap,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const contentProps = asChild ? {} : {
      ref,
      className: cn(
        footerContentVariants({
          variant,
          align,
          justify,
          direction,
          wrap,
          gap,
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
FooterContent.displayName = 'FooterContent';

const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(
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
    
    const sectionProps = asChild ? {} : {
      ref,
      className: cn(
        footerSectionVariants({
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
      <Comp {...sectionProps}>
        {children}
      </Comp>
    );
  }
);
FooterSection.displayName = 'FooterSection';

const FooterCopyright = React.forwardRef<HTMLDivElement, FooterCopyrightProps>(
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
    
    const copyrightProps = asChild ? {} : {
      ref,
      className: cn(
        footerCopyrightVariants({
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
      <Comp {...copyrightProps}>
        {children}
      </Comp>
    );
  }
);
FooterCopyright.displayName = 'FooterCopyright';

// Additional utility components for advanced footer functionality
const FooterSticky = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="sticky"
    position="sticky"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterSticky.displayName = 'FooterSticky';

const FooterFixed = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="fixed"
    position="fixed"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterFixed.displayName = 'FooterFixed';

const FooterFloating = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant' | 'position'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="floating"
    position="absolute"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterFloating.displayName = 'FooterFloating';

const FooterTransparent = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterTransparent.displayName = 'FooterTransparent';

const FooterSolid = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterSolid.displayName = 'FooterSolid';

const FooterGradient = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterGradient.displayName = 'FooterGradient';

const FooterDark = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterDark.displayName = 'FooterDark';

const FooterLight = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterLight.displayName = 'FooterLight';

// Footer with responsive breakpoints
const FooterResponsive = React.forwardRef<
  HTMLElement,
  FooterProps & {
    breakpoints?: {
      sm?: Partial<FooterProps>;
      md?: Partial<FooterProps>;
      lg?: Partial<FooterProps>;
      xl?: Partial<FooterProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.size) {
      classes.push(`sm:py-${breakpoints.sm.size}`);
    }
    if (breakpoints.md?.size) {
      classes.push(`md:py-${breakpoints.md.size}`);
    }
    if (breakpoints.lg?.size) {
      classes.push(`lg:py-${breakpoints.lg.size}`);
    }
    if (breakpoints.xl?.size) {
      classes.push(`xl:py-${breakpoints.xl.size}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Footer
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Footer>
  );
});
FooterResponsive.displayName = 'FooterResponsive';

// Footer with spacing utilities
const FooterSpacing = React.forwardRef<
  HTMLElement,
  FooterProps & {
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
    <Footer
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Footer>
  );
});
FooterSpacing.displayName = 'FooterSpacing';

// Footer with card styling
const FooterCard = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Footer
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
  </Footer>
));
FooterCard.displayName = 'FooterCard';

// Footer with section styling
const FooterSectionStyled = React.forwardRef<
  HTMLElement,
  Omit<FooterProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Footer
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Footer>
));
FooterSectionStyled.displayName = 'FooterSectionStyled';

export {
  Footer,
  FooterContent,
  FooterSection,
  FooterCopyright,
  FooterSticky,
  FooterFixed,
  FooterFloating,
  FooterTransparent,
  FooterSolid,
  FooterGradient,
  FooterDark,
  FooterLight,
  FooterResponsive,
  FooterSpacing,
  FooterCard,
  FooterSectionStyled,
  footerVariants,
  footerContentVariants,
  footerSectionVariants,
  footerCopyrightVariants,
};
