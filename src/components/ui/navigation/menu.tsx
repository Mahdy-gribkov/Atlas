import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const menuVariants = cva(
  'relative inline-block',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg shadow-lg',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg shadow-lg',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg shadow-lg',
        minimal: 'bg-transparent border border-atlas-border-subtle rounded-lg',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-xl',
        inline: 'inline-block',
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
      position: {
        bottom: 'top-full left-0 mt-1',
        top: 'bottom-full left-0 mb-1',
        left: 'top-0 right-full mr-1',
        right: 'top-0 left-full ml-1',
        'bottom-left': 'top-full left-0 mt-1',
        'bottom-right': 'top-full right-0 mt-1',
        'top-left': 'bottom-full left-0 mb-1',
        'top-right': 'bottom-full right-0 mb-1',
        'left-top': 'top-0 right-full mr-1',
        'left-bottom': 'bottom-0 right-full mr-1',
        'right-top': 'top-0 left-full ml-1',
        'right-bottom': 'bottom-0 left-full ml-1',
      },
      padding: {
        none: 'p-0',
        xs: 'p-1',
        sm: 'p-2',
        default: 'p-3',
        lg: 'p-4',
        xl: 'p-5',
        '2xl': 'p-6',
        '3xl': 'p-8',
        '4xl': 'p-10',
        '5xl': 'p-12',
        '6xl': 'p-16',
      },
      margin: {
        none: 'm-0',
        xs: 'm-1',
        sm: 'm-2',
        default: 'm-3',
        lg: 'm-4',
        xl: 'm-5',
        '2xl': 'm-6',
        '3xl': 'm-8',
        '4xl': 'm-10',
        '5xl': 'm-12',
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
      zIndex: {
        0: 'z-0',
        10: 'z-10',
        20: 'z-20',
        30: 'z-30',
        40: 'z-40',
        50: 'z-50',
        auto: 'z-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'bottom',
      padding: 'default',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'default',
      shadow: 'default',
      zIndex: 'auto',
    },
  }
);

const menuItemVariants = cva(
  'flex items-center w-full px-3 py-2 text-sm font-medium transition-colors',
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
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const menuSeparatorVariants = cva(
  'my-1 h-px bg-atlas-border',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border',
        subtle: 'bg-atlas-border-subtle',
        primary: 'bg-atlas-primary-main',
        secondary: 'bg-atlas-secondary-main',
        success: 'bg-atlas-success-main',
        warning: 'bg-atlas-warning-main',
        error: 'bg-atlas-error-main',
        info: 'bg-atlas-info-main',
        inverse: 'bg-atlas-text-inverse',
        muted: 'bg-atlas-text-muted',
      },
      size: {
        xs: 'h-px',
        sm: 'h-0.5',
        default: 'h-px',
        lg: 'h-1',
        xl: 'h-1.5',
        '2xl': 'h-2',
        '3xl': 'h-3',
        '4xl': 'h-4',
        '5xl': 'h-5',
        '6xl': 'h-6',
      },
      margin: {
        none: 'my-0',
        xs: 'my-1',
        sm: 'my-1.5',
        default: 'my-1',
        lg: 'my-2',
        xl: 'my-2.5',
        '2xl': 'my-3',
        '3xl': 'my-4',
        '4xl': 'my-5',
        '5xl': 'my-6',
        '6xl': 'my-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      margin: 'default',
    },
  }
);

export interface MenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menuVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  position?: 'bottom' | 'top' | 'left' | 'right' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 'auto';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface MenuItemProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof menuItemVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted' | 'ghost' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  onClick?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface MenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof menuSeparatorVariants> {
  variant?: 'default' | 'subtle' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
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
    open = false,
    onOpenChange,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const menuProps = asChild ? {} : {
      ref,
      className: cn(
        menuVariants({
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
          className,
        })
      ),
      'data-state': open ? 'open' : 'closed',
      ...props,
    };

    return (
      <Comp {...menuProps}>
        {children}
      </Comp>
    );
  }
);
Menu.displayName = 'Menu';

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  ({
    className,
    variant,
    size,
    state,
    weight,
    rounded,
    shadow,
    onClick,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'button';
    
    const itemProps = asChild ? {} : {
      ref,
      onClick,
      className: cn(
        menuItemVariants({
          variant,
          size,
          state,
          weight,
          rounded,
          shadow,
          className,
        })
      ),
      disabled: state === 'disabled' || state === 'loading',
      ...props,
    };

    return (
      <Comp {...itemProps}>
        {children}
      </Comp>
    );
  }
);
MenuItem.displayName = 'MenuItem';

const MenuSeparator = React.forwardRef<HTMLDivElement, MenuSeparatorProps>(
  ({
    className,
    variant,
    size,
    margin,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const separatorProps = asChild ? {} : {
      ref,
      className: cn(
        menuSeparatorVariants({
          variant,
          size,
          margin,
          className,
        })
      ),
      'aria-hidden': 'true',
      ...props,
    };

    return (
      <Comp {...separatorProps}>
        {children}
      </Comp>
    );
  }
);
MenuSeparator.displayName = 'MenuSeparator';

// Additional utility components for advanced menu functionality
const MenuSolid = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuSolid.displayName = 'MenuSolid';

const MenuTransparent = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuTransparent.displayName = 'MenuTransparent';

const MenuGradient = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuGradient.displayName = 'MenuGradient';

const MenuDark = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuDark.displayName = 'MenuDark';

const MenuLight = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuLight.displayName = 'MenuLight';

const MenuMinimal = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuMinimal.displayName = 'MenuMinimal';

const MenuFloating = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuFloating.displayName = 'MenuFloating';

const MenuInline = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="inline"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuInline.displayName = 'MenuInline';

const MenuBlock = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    variant="block"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuBlock.displayName = 'MenuBlock';

// Menu with responsive breakpoints
const MenuResponsive = React.forwardRef<
  HTMLDivElement,
  MenuProps & {
    breakpoints?: {
      sm?: Partial<MenuProps>;
      md?: Partial<MenuProps>;
      lg?: Partial<MenuProps>;
      xl?: Partial<MenuProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.position) {
      classes.push(`sm:${breakpoints.sm.position}`);
    }
    if (breakpoints.md?.position) {
      classes.push(`md:${breakpoints.md.position}`);
    }
    if (breakpoints.lg?.position) {
      classes.push(`lg:${breakpoints.lg.position}`);
    }
    if (breakpoints.xl?.position) {
      classes.push(`xl:${breakpoints.xl.position}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Menu
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Menu>
  );
});
MenuResponsive.displayName = 'MenuResponsive';

// Menu with spacing utilities
const MenuSpacing = React.forwardRef<
  HTMLDivElement,
  MenuProps & {
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
    <Menu
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Menu>
  );
});
MenuSpacing.displayName = 'MenuSpacing';

// Menu with card styling
const MenuCard = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Menu
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
  </Menu>
));
MenuCard.displayName = 'MenuCard';

// Menu with section styling
const MenuSection = React.forwardRef<
  HTMLDivElement,
  Omit<MenuProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Menu
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Menu>
));
MenuSection.displayName = 'MenuSection';

export {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuSolid,
  MenuTransparent,
  MenuGradient,
  MenuDark,
  MenuLight,
  MenuMinimal,
  MenuFloating,
  MenuInline,
  MenuBlock,
  MenuResponsive,
  MenuSpacing,
  MenuCard,
  MenuSection,
  menuVariants,
  menuItemVariants,
  menuSeparatorVariants,
};
