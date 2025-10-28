import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const drawerVariants = cva(
  'fixed inset-0 z-50',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse',
        light: 'bg-atlas-text-inverse text-atlas-text-primary',
        minimal: 'bg-transparent border border-atlas-border-subtle',
        floating: 'bg-atlas-card-bg border border-atlas-border shadow-xl',
        overlay: 'bg-atlas-overlay',
        backdrop: 'bg-atlas-backdrop',
      },
      size: {
        xs: 'w-64',
        sm: 'w-72',
        default: 'w-80',
        lg: 'w-96',
        xl: 'w-[28rem]',
        '2xl': 'w-[32rem]',
        '3xl': 'w-[36rem]',
        '4xl': 'w-[40rem]',
        '5xl': 'w-[44rem]',
        '6xl': 'w-[48rem]',
        full: 'w-full',
        auto: 'w-auto',
      },
      position: {
        left: 'left-0 top-0 h-full',
        right: 'right-0 top-0 h-full',
        top: 'top-0 left-0 w-full',
        bottom: 'bottom-0 left-0 w-full',
        'left-top': 'left-0 top-0 h-1/2',
        'left-bottom': 'left-0 bottom-0 h-1/2',
        'right-top': 'right-0 top-0 h-1/2',
        'right-bottom': 'right-0 bottom-0 h-1/2',
        'top-left': 'top-0 left-0 w-1/2',
        'top-right': 'top-0 right-0 w-1/2',
        'bottom-left': 'bottom-0 left-0 w-1/2',
        'bottom-right': 'bottom-0 right-0 w-1/2',
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
      shadow: 'default',
      zIndex: 'auto',
      transition: 'smooth',
    },
  }
);

const drawerOverlayVariants = cva(
  'fixed inset-0 bg-black/50',
  {
    variants: {
      variant: {
        default: 'bg-black/50',
        light: 'bg-black/25',
        dark: 'bg-black/75',
        subtle: 'bg-black/10',
        none: 'bg-transparent',
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
      zIndex: 'auto',
      transition: 'smooth',
    },
  }
);

const drawerContentVariants = cva(
  'flex flex-col h-full',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse',
        light: 'bg-atlas-text-inverse text-atlas-text-primary',
        minimal: 'bg-transparent border border-atlas-border-subtle',
        floating: 'bg-atlas-card-bg border border-atlas-border shadow-xl',
        overlay: 'bg-atlas-overlay',
        backdrop: 'bg-atlas-backdrop',
      },
      size: {
        xs: 'w-64',
        sm: 'w-72',
        default: 'w-80',
        lg: 'w-96',
        xl: 'w-[28rem]',
        '2xl': 'w-[32rem]',
        '3xl': 'w-[36rem]',
        '4xl': 'w-[40rem]',
        '5xl': 'w-[44rem]',
        '6xl': 'w-[48rem]',
        full: 'w-full',
        auto: 'w-auto',
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
      padding: 'default',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const drawerHeaderVariants = cva(
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

const drawerBodyVariants = cva(
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

const drawerFooterVariants = cva(
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

export interface DrawerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'overlay' | 'backdrop';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full' | 'auto';
  position?: 'left' | 'right' | 'top' | 'bottom' | 'left-top' | 'left-bottom' | 'right-top' | 'right-bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 'auto';
  transition?: 'none' | 'smooth' | 'fast' | 'slow' | 'bounce' | 'elastic';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerOverlayVariants> {
  variant?: 'default' | 'light' | 'dark' | 'subtle' | 'none';
  zIndex?: 0 | 10 | 20 | 30 | 40 | 50 | 'auto';
  transition?: 'none' | 'smooth' | 'fast' | 'slow' | 'bounce' | 'elastic';
  onClick?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerContentVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'overlay' | 'backdrop';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full' | 'auto';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerHeaderVariants> {
  variant?: 'default' | 'compact' | 'expanded' | 'minimal' | 'floating' | 'transparent';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerBodyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerBodyVariants> {
  variant?: 'default' | 'scrollable' | 'hidden' | 'auto' | 'visible';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  spacing?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface DrawerFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof drawerFooterVariants> {
  variant?: 'default' | 'compact' | 'expanded' | 'minimal' | 'floating' | 'transparent';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  align?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  asChild?: boolean;
  children?: React.ReactNode;
}

const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
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
    transition,
    open = false,
    onOpenChange,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const drawerProps = asChild ? {} : {
      ref,
      className: cn(
        drawerVariants({
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
          transition,
          className,
        })
      ),
      'data-state': open ? 'open' : 'closed',
      ...props,
    };

    return (
      <Comp {...drawerProps}>
        {children}
      </Comp>
    );
  }
);
Drawer.displayName = 'Drawer';

const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
  ({
    className,
    variant,
    zIndex,
    transition,
    onClick,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const overlayProps = asChild ? {} : {
      ref,
      onClick,
      className: cn(
        drawerOverlayVariants({
          variant,
          zIndex,
          transition,
          className,
        })
      ),
      'aria-hidden': 'true',
      ...props,
    };

    return (
      <Comp {...overlayProps}>
        {children}
      </Comp>
    );
  }
);
DrawerOverlay.displayName = 'DrawerOverlay';

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
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
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const contentProps = asChild ? {} : {
      ref,
      className: cn(
        drawerContentVariants({
          variant,
          size,
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
      <Comp {...contentProps}>
        {children}
      </Comp>
    );
  }
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = React.forwardRef<HTMLDivElement, DrawerHeaderProps>(
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
        drawerHeaderVariants({
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
DrawerHeader.displayName = 'DrawerHeader';

const DrawerBody = React.forwardRef<HTMLDivElement, DrawerBodyProps>(
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
    
    const bodyProps = asChild ? {} : {
      ref,
      className: cn(
        drawerBodyVariants({
          variant,
          padding,
          spacing,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...bodyProps}>
        {children}
      </Comp>
    );
  }
);
DrawerBody.displayName = 'DrawerBody';

const DrawerFooter = React.forwardRef<HTMLDivElement, DrawerFooterProps>(
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
        drawerFooterVariants({
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
DrawerFooter.displayName = 'DrawerFooter';

// Additional utility components for advanced drawer functionality
const DrawerSolid = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerSolid.displayName = 'DrawerSolid';

const DrawerTransparent = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerTransparent.displayName = 'DrawerTransparent';

const DrawerGradient = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerGradient.displayName = 'DrawerGradient';

const DrawerDark = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerDark.displayName = 'DrawerDark';

const DrawerLight = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerLight.displayName = 'DrawerLight';

const DrawerMinimal = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerMinimal.displayName = 'DrawerMinimal';

const DrawerFloating = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerFloating.displayName = 'DrawerFloating';

const DrawerOverlayStyled = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="overlay"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerOverlayStyled.displayName = 'DrawerOverlayStyled';

const DrawerBackdrop = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    variant="backdrop"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerBackdrop.displayName = 'DrawerBackdrop';

// Drawer with responsive breakpoints
const DrawerResponsive = React.forwardRef<
  HTMLDivElement,
  DrawerProps & {
    breakpoints?: {
      sm?: Partial<DrawerProps>;
      md?: Partial<DrawerProps>;
      lg?: Partial<DrawerProps>;
      xl?: Partial<DrawerProps>;
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
    <Drawer
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Drawer>
  );
});
DrawerResponsive.displayName = 'DrawerResponsive';

// Drawer with spacing utilities
const DrawerSpacing = React.forwardRef<
  HTMLDivElement,
  DrawerProps & {
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
    <Drawer
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Drawer>
  );
});
DrawerSpacing.displayName = 'DrawerSpacing';

// Drawer with card styling
const DrawerCard = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Drawer
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
  </Drawer>
));
DrawerCard.displayName = 'DrawerCard';

// Drawer with section styling
const DrawerSection = React.forwardRef<
  HTMLDivElement,
  Omit<DrawerProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Drawer
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Drawer>
));
DrawerSection.displayName = 'DrawerSection';

export {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerSolid,
  DrawerTransparent,
  DrawerGradient,
  DrawerDark,
  DrawerLight,
  DrawerMinimal,
  DrawerFloating,
  DrawerOverlayStyled,
  DrawerBackdrop,
  DrawerResponsive,
  DrawerSpacing,
  DrawerCard,
  DrawerSection,
  drawerVariants,
  drawerOverlayVariants,
  drawerContentVariants,
  drawerHeaderVariants,
  drawerBodyVariants,
  drawerFooterVariants,
};
