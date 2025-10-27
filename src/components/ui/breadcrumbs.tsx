import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const breadcrumbsVariants = cva(
  'flex items-center space-x-2',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg px-4 py-2',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg px-4 py-2',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg px-4 py-2',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg px-4 py-2',
        minimal: 'bg-transparent border-b border-atlas-border-subtle pb-2',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg px-4 py-2',
        inline: 'inline-flex',
        block: 'block',
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
      spacing: {
        0: 'space-x-0',
        1: 'space-x-1',
        2: 'space-x-2',
        3: 'space-x-3',
        4: 'space-x-4',
        5: 'space-x-5',
        6: 'space-x-6',
        8: 'space-x-8',
        10: 'space-x-10',
        12: 'space-x-12',
        16: 'space-x-16',
        20: 'space-x-20',
        24: 'space-x-24',
        32: 'space-x-32',
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
        horizontal: 'flex-row',
        vertical: 'flex-col space-y-2 space-x-0',
        'horizontal-reverse': 'flex-row-reverse space-x-reverse space-x-2',
        'vertical-reverse': 'flex-col-reverse space-y-reverse space-y-2 space-x-0',
      },
      wrap: {
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      padding: {
        none: 'p-0',
        xs: 'px-2 py-1',
        sm: 'px-3 py-1.5',
        default: 'px-4 py-2',
        lg: 'px-5 py-2.5',
        xl: 'px-6 py-3',
        '2xl': 'px-8 py-4',
        '3xl': 'px-10 py-5',
        '4xl': 'px-12 py-6',
        '5xl': 'px-16 py-8',
        '6xl': 'px-20 py-10',
      },
      margin: {
        none: 'm-0',
        xs: 'mx-2 my-1',
        sm: 'mx-3 my-1.5',
        default: 'mx-4 my-2',
        lg: 'mx-5 my-2.5',
        xl: 'mx-6 my-3',
        '2xl': 'mx-8 my-4',
        '3xl': 'mx-10 my-5',
        '4xl': 'mx-12 my-6',
        '5xl': 'mx-16 my-8',
        '6xl': 'mx-20 my-10',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      spacing: 2,
      align: 'start',
      direction: 'horizontal',
      wrap: 'nowrap',
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const breadcrumbItemVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: 'text-atlas-text-primary',
        primary: 'text-atlas-primary-main',
        secondary: 'text-atlas-secondary-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        error: 'text-atlas-error-main',
        info: 'text-atlas-info-main',
        inverse: 'text-atlas-text-inverse',
        muted: 'text-atlas-text-muted',
        link: 'text-atlas-primary-main hover:text-atlas-primary-dark hover:underline',
        current: 'text-atlas-text-primary font-semibold',
        disabled: 'text-atlas-text-muted opacity-50 cursor-not-allowed',
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
      state: {
        default: '',
        active: 'text-atlas-primary-main font-semibold',
        disabled: 'text-atlas-text-muted opacity-50 cursor-not-allowed',
        loading: 'opacity-75 cursor-wait',
        error: 'text-atlas-error-main',
        success: 'text-atlas-success-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
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
      padding: {
        none: 'p-0',
        xs: 'px-1 py-0.5',
        sm: 'px-2 py-1',
        default: 'px-3 py-1.5',
        lg: 'px-4 py-2',
        xl: 'px-5 py-2.5',
        '2xl': 'px-6 py-3',
        '3xl': 'px-8 py-4',
        '4xl': 'px-10 py-5',
        '5xl': 'px-12 py-6',
        '6xl': 'px-16 py-8',
      },
      margin: {
        none: 'm-0',
        xs: 'mx-1 my-0.5',
        sm: 'mx-2 my-1',
        default: 'mx-3 my-1.5',
        lg: 'mx-4 my-2',
        xl: 'mx-5 my-2.5',
        '2xl': 'mx-6 my-3',
        '3xl': 'mx-8 my-4',
        '4xl': 'mx-10 my-5',
        '5xl': 'mx-12 my-6',
        '6xl': 'mx-16 my-8',
        auto: 'mx-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
      weight: 'normal',
      rounded: 'none',
      padding: 'none',
      margin: 'none',
    },
  }
);

const breadcrumbSeparatorVariants = cva(
  'flex items-center text-atlas-text-muted',
  {
    variants: {
      variant: {
        default: '',
        slash: 'text-atlas-text-muted',
        arrow: 'text-atlas-text-muted',
        chevron: 'text-atlas-text-muted',
        dot: 'text-atlas-text-muted',
        pipe: 'text-atlas-text-muted',
        custom: 'text-atlas-text-muted',
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

export interface BreadcrumbsProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbsVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface BreadcrumbItemProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof breadcrumbItemVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted' | 'link' | 'current' | 'disabled';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof breadcrumbSeparatorVariants> {
  variant?: 'default' | 'slash' | 'arrow' | 'chevron' | 'dot' | 'pipe' | 'custom';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  ({
    className,
    variant,
    size,
    spacing,
    align,
    direction,
    wrap,
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
    const Comp = asChild ? React.Fragment : 'nav';
    
    const breadcrumbsProps = asChild ? {} : {
      ref,
      className: cn(
        breadcrumbsVariants({
          variant,
          size,
          spacing,
          align,
          direction,
          wrap,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          className,
        })
      ),
      'aria-label': 'Breadcrumb',
      ...props,
    };

    return (
      <Comp {...breadcrumbsProps}>
        {children}
      </Comp>
    );
  }
);
Breadcrumbs.displayName = 'Breadcrumbs';

const BreadcrumbItem = React.forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(
  ({
    className,
    variant,
    size,
    state,
    weight,
    rounded,
    padding,
    margin,
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
        breadcrumbItemVariants({
          variant,
          size,
          state,
          weight,
          rounded,
          padding,
          margin,
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
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbSeparator = React.forwardRef<HTMLSpanElement, BreadcrumbSeparatorProps>(
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
    const Comp = asChild ? React.Fragment : 'span';
    
    const separatorProps = asChild ? {} : {
      ref,
      className: cn(
        breadcrumbSeparatorVariants({
          variant,
          size,
          color,
          weight,
          className,
        })
      ),
      'aria-hidden': 'true',
      ...props,
    };

    const getSeparatorContent = () => {
      if (children) return children;
      
      switch (variant) {
        case 'slash':
          return '/';
        case 'arrow':
          return '→';
        case 'chevron':
          return '›';
        case 'dot':
          return '•';
        case 'pipe':
          return '|';
        default:
          return '/';
      }
    };

    return (
      <Comp {...separatorProps}>
        {getSeparatorContent()}
      </Comp>
    );
  }
);
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

// Additional utility components for advanced breadcrumbs functionality
const BreadcrumbsSolid = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsSolid.displayName = 'BreadcrumbsSolid';

const BreadcrumbsTransparent = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsTransparent.displayName = 'BreadcrumbsTransparent';

const BreadcrumbsGradient = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsGradient.displayName = 'BreadcrumbsGradient';

const BreadcrumbsDark = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsDark.displayName = 'BreadcrumbsDark';

const BreadcrumbsLight = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsLight.displayName = 'BreadcrumbsLight';

const BreadcrumbsMinimal = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsMinimal.displayName = 'BreadcrumbsMinimal';

const BreadcrumbsFloating = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsFloating.displayName = 'BreadcrumbsFloating';

const BreadcrumbsInline = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="inline"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsInline.displayName = 'BreadcrumbsInline';

const BreadcrumbsBlock = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    variant="block"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsBlock.displayName = 'BreadcrumbsBlock';

// Breadcrumbs with responsive breakpoints
const BreadcrumbsResponsive = React.forwardRef<
  HTMLElement,
  BreadcrumbsProps & {
    breakpoints?: {
      sm?: Partial<BreadcrumbsProps>;
      md?: Partial<BreadcrumbsProps>;
      lg?: Partial<BreadcrumbsProps>;
      xl?: Partial<BreadcrumbsProps>;
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
    <Breadcrumbs
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Breadcrumbs>
  );
});
BreadcrumbsResponsive.displayName = 'BreadcrumbsResponsive';

// Breadcrumbs with spacing utilities
const BreadcrumbsSpacing = React.forwardRef<
  HTMLElement,
  BreadcrumbsProps & {
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
    <Breadcrumbs
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Breadcrumbs>
  );
});
BreadcrumbsSpacing.displayName = 'BreadcrumbsSpacing';

// Breadcrumbs with card styling
const BreadcrumbsCard = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
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
  </Breadcrumbs>
));
BreadcrumbsCard.displayName = 'BreadcrumbsCard';

// Breadcrumbs with section styling
const BreadcrumbsSection = React.forwardRef<
  HTMLElement,
  Omit<BreadcrumbsProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Breadcrumbs
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Breadcrumbs>
));
BreadcrumbsSection.displayName = 'BreadcrumbsSection';

export {
  Breadcrumbs,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbsSolid,
  BreadcrumbsTransparent,
  BreadcrumbsGradient,
  BreadcrumbsDark,
  BreadcrumbsLight,
  BreadcrumbsMinimal,
  BreadcrumbsFloating,
  BreadcrumbsInline,
  BreadcrumbsBlock,
  BreadcrumbsResponsive,
  BreadcrumbsSpacing,
  BreadcrumbsCard,
  BreadcrumbsSection,
  breadcrumbsVariants,
  breadcrumbItemVariants,
  breadcrumbSeparatorVariants,
};
