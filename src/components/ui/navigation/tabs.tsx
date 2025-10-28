import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const tabsVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg',
        minimal: 'bg-transparent border-b border-atlas-border-subtle',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg',
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
      direction: {
        horizontal: 'flex-col',
        vertical: 'flex-row',
        'horizontal-reverse': 'flex-col-reverse',
        'vertical-reverse': 'flex-row-reverse',
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
      direction: 'horizontal',
      align: 'start',
      justify: 'start',
      wrap: 'nowrap',
      gap: 0,
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const tabsListVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg p-1',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg p-1',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg p-1',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg p-1',
        minimal: 'bg-transparent border-b border-atlas-border-subtle',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg p-1',
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
      direction: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
        'horizontal-reverse': 'flex-row-reverse',
        'vertical-reverse': 'flex-col-reverse',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      direction: 'horizontal',
      align: 'center',
      justify: 'start',
      wrap: 'nowrap',
      gap: 0,
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const tabsTriggerVariants = cva(
  'flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors',
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

const tabsContentVariants = cva(
  'mt-2',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg p-4',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg p-4',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg p-4',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg p-4',
        minimal: 'bg-transparent border-b border-atlas-border-subtle pb-2',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg p-4',
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
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

export interface TabsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  direction?: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  direction?: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface TabsTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tabsTriggerVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted' | 'ghost' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  value: string;
  onClick?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface TabsContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsContentVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  value: string;
  asChild?: boolean;
  children?: React.ReactNode;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    className,
    variant,
    size,
    direction,
    align,
    justify,
    wrap,
    gap,
    padding,
    margin,
    background,
    border,
    rounded,
    shadow,
    defaultValue,
    value,
    onValueChange,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue || '');
    
    const handleTabChange = (newValue: string) => {
      setActiveTab(newValue);
      onValueChange?.(newValue);
    };

    const Comp = asChild ? React.Fragment : 'div';
    
    const tabsProps = asChild ? {} : {
      ref,
      className: cn(
        tabsVariants({
          variant,
          size,
          direction,
          align,
          justify,
          wrap,
          gap,
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
      <Comp {...tabsProps}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              activeTab: value || activeTab,
              onTabChange: handleTabChange,
            } as any);
          }
          return child;
        })}
      </Comp>
    );
  }
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({
    className,
    variant,
    size,
    direction,
    align,
    justify,
    wrap,
    gap,
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
    
    const listProps = asChild ? {} : {
      ref,
      className: cn(
        tabsListVariants({
          variant,
          size,
          direction,
          align,
          justify,
          wrap,
          gap,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          className,
        })
      ),
      role: 'tablist',
      ...props,
    };

    return (
      <Comp {...listProps}>
        {children}
      </Comp>
    );
  }
);
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({
    className,
    variant,
    size,
    state,
    weight,
    rounded,
    shadow,
    value,
    onClick,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'button';
    
    const triggerProps = asChild ? {} : {
      ref,
      onClick,
      className: cn(
        tabsTriggerVariants({
          variant,
          size,
          state,
          weight,
          rounded,
          shadow,
          className,
        })
      ),
      role: 'tab',
      'aria-selected': state === 'active',
      'aria-controls': `tabpanel-${value}`,
      'data-state': state === 'active' ? 'active' : 'inactive',
      ...props,
    };

    return (
      <Comp {...triggerProps}>
        {children}
      </Comp>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
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
    value,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const contentProps = asChild ? {} : {
      ref,
      className: cn(
        tabsContentVariants({
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
      role: 'tabpanel',
      'aria-labelledby': `tab-${value}`,
      'data-state': 'active',
      ...props,
    };

    return (
      <Comp {...contentProps}>
        {children}
      </Comp>
    );
  }
);
TabsContent.displayName = 'TabsContent';

// Additional utility components for advanced tabs functionality
const TabsSolid = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsSolid.displayName = 'TabsSolid';

const TabsTransparent = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsTransparent.displayName = 'TabsTransparent';

const TabsGradient = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsGradient.displayName = 'TabsGradient';

const TabsDark = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsDark.displayName = 'TabsDark';

const TabsLight = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsLight.displayName = 'TabsLight';

const TabsMinimal = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsMinimal.displayName = 'TabsMinimal';

const TabsFloating = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsFloating.displayName = 'TabsFloating';

const TabsInline = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="inline"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsInline.displayName = 'TabsInline';

const TabsBlock = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    variant="block"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsBlock.displayName = 'TabsBlock';

// Tabs with responsive breakpoints
const TabsResponsive = React.forwardRef<
  HTMLDivElement,
  TabsProps & {
    breakpoints?: {
      sm?: Partial<TabsProps>;
      md?: Partial<TabsProps>;
      lg?: Partial<TabsProps>;
      xl?: Partial<TabsProps>;
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
    <Tabs
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Tabs>
  );
});
TabsResponsive.displayName = 'TabsResponsive';

// Tabs with spacing utilities
const TabsSpacing = React.forwardRef<
  HTMLDivElement,
  TabsProps & {
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
    <Tabs
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Tabs>
  );
});
TabsSpacing.displayName = 'TabsSpacing';

// Tabs with card styling
const TabsCard = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Tabs
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
  </Tabs>
));
TabsCard.displayName = 'TabsCard';

// Tabs with section styling
const TabsSection = React.forwardRef<
  HTMLDivElement,
  Omit<TabsProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Tabs
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Tabs>
));
TabsSection.displayName = 'TabsSection';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsSolid,
  TabsTransparent,
  TabsGradient,
  TabsDark,
  TabsLight,
  TabsMinimal,
  TabsFloating,
  TabsInline,
  TabsBlock,
  TabsResponsive,
  TabsSpacing,
  TabsCard,
  TabsSection,
  tabsVariants,
  tabsListVariants,
  tabsTriggerVariants,
  tabsContentVariants,
};