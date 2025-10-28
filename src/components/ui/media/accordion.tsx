import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const accordionVariants = cva(
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
      direction: 'vertical',
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

const accordionItemVariants = cva(
  'border-b border-atlas-border last:border-b-0',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg mb-2 last:mb-0',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg mb-2 last:mb-0',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg mb-2 last:mb-0',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg mb-2 last:mb-0',
        minimal: 'bg-transparent border-b border-atlas-border-subtle last:border-b-0',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg mb-2 last:mb-0',
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

const accordionTriggerVariants = cva(
  'flex items-center justify-between w-full px-4 py-3 text-left font-medium transition-colors',
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
        default: 'px-4 py-3 text-base',
        lg: 'px-5 py-3.5 text-lg',
        xl: 'px-6 py-4 text-xl',
        '2xl': 'px-8 py-5 text-2xl',
        '3xl': 'px-10 py-6 text-3xl',
        '4xl': 'px-12 py-7 text-4xl',
        '5xl': 'px-16 py-8 text-5xl',
        '6xl': 'px-20 py-10 text-6xl',
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

const accordionContentVariants = cva(
  'overflow-hidden transition-all duration-300 ease-in-out',
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

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
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
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
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

export interface AccordionTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
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

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
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
    type = 'single',
    collapsible = true,
    defaultValue,
    value,
    onValueChange,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const [activeItems, setActiveItems] = React.useState<string | string[]>(
      defaultValue || (type === 'single' ? '' : [])
    );

    const handleValueChange = (newValue: string | string[]) => {
      setActiveItems(newValue);
      onValueChange?.(newValue);
    };

    const Comp = asChild ? React.Fragment : 'div';
    
    const accordionProps = asChild ? {} : {
      ref,
      className: cn(
        accordionVariants({
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
      <Comp {...accordionProps}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              type,
              collapsible,
              activeItems: value || activeItems,
              onValueChange: handleValueChange,
            } as any);
          }
          return child;
        })}
      </Comp>
    );
  }
);
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
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
    
    const itemProps = asChild ? {} : {
      ref,
      className: cn(
        accordionItemVariants({
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
      'data-state': 'closed',
      ...props,
    };

    return (
      <Comp {...itemProps}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              value,
            } as any);
          }
          return child;
        })}
      </Comp>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
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
    
    const triggerProps = asChild ? {} : {
      ref,
      onClick,
      className: cn(
        accordionTriggerVariants({
          variant,
          size,
          state,
          weight,
          rounded,
          shadow,
          className,
        })
      ),
      'aria-expanded': 'false',
      'aria-controls': 'accordion-content',
      ...props,
    };

    return (
      <Comp {...triggerProps}>
        {children}
        <span className="ml-auto transition-transform duration-200 group-data-[state=open]/accordion:rotate-180">
          ▼
        </span>
      </Comp>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
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
        accordionContentVariants({
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
      'data-state': 'closed',
      'data-orientation': 'vertical',
      ...props,
    };

    return (
      <Comp {...contentProps}>
        <div className="pb-4 pt-0">
          {children}
        </div>
      </Comp>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';

// Additional utility components for advanced accordion functionality
const AccordionSolid = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionSolid.displayName = 'AccordionSolid';

const AccordionTransparent = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionTransparent.displayName = 'AccordionTransparent';

const AccordionGradient = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionGradient.displayName = 'AccordionGradient';

const AccordionDark = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionDark.displayName = 'AccordionDark';

const AccordionLight = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionLight.displayName = 'AccordionLight';

const AccordionMinimal = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionMinimal.displayName = 'AccordionMinimal';

const AccordionFloating = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionFloating.displayName = 'AccordionFloating';

const AccordionInline = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="inline"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionInline.displayName = 'AccordionInline';

const AccordionBlock = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    variant="block"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionBlock.displayName = 'AccordionBlock';

// Accordion with responsive breakpoints
const AccordionResponsive = React.forwardRef<
  HTMLDivElement,
  AccordionProps & {
    breakpoints?: {
      sm?: Partial<AccordionProps>;
      md?: Partial<AccordionProps>;
      lg?: Partial<AccordionProps>;
      xl?: Partial<AccordionProps>;
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
    <Accordion
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Accordion>
  );
});
AccordionResponsive.displayName = 'AccordionResponsive';

// Accordion with spacing utilities
const AccordionSpacing = React.forwardRef<
  HTMLDivElement,
  AccordionProps & {
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
    <Accordion
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Accordion>
  );
});
AccordionSpacing.displayName = 'AccordionSpacing';

// Accordion with card styling
const AccordionCard = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Accordion
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
  </Accordion>
));
AccordionCard.displayName = 'AccordionCard';

// Accordion with section styling
const AccordionSection = React.forwardRef<
  HTMLDivElement,
  Omit<AccordionProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Accordion
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Accordion>
));
AccordionSection.displayName = 'AccordionSection';

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  AccordionSolid,
  AccordionTransparent,
  AccordionGradient,
  AccordionDark,
  AccordionLight,
  AccordionMinimal,
  AccordionFloating,
  AccordionInline,
  AccordionBlock,
  AccordionResponsive,
  AccordionSpacing,
  AccordionCard,
  AccordionSection,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
};