import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const stepperVariants = cva(
  'w-full',
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
      direction: 'horizontal',
      align: 'center',
      justify: 'between',
      wrap: 'nowrap',
      gap: 4,
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const stepperStepVariants = cva(
  'flex items-center',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg p-3',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg p-3',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg p-3',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg p-3',
        minimal: 'bg-transparent border-b border-atlas-border-subtle pb-2',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg p-3',
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
      state: {
        default: '',
        active: 'text-atlas-primary-main',
        completed: 'text-atlas-success-main',
        disabled: 'text-atlas-text-muted opacity-50',
        error: 'text-atlas-error-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
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
      state: 'default',
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

const stepperStepIconVariants = cva(
  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle text-atlas-text-muted',
        primary: 'bg-atlas-primary-main text-atlas-text-inverse',
        secondary: 'bg-atlas-secondary-main text-atlas-text-inverse',
        success: 'bg-atlas-success-main text-atlas-text-inverse',
        warning: 'bg-atlas-warning-main text-atlas-text-inverse',
        error: 'bg-atlas-error-main text-atlas-text-inverse',
        info: 'bg-atlas-info-main text-atlas-text-inverse',
        inverse: 'bg-atlas-text-inverse text-atlas-text-primary',
        muted: 'bg-atlas-text-muted text-atlas-text-inverse',
        ghost: 'bg-transparent text-atlas-text-primary',
        outline: 'bg-transparent border border-atlas-border text-atlas-text-primary',
        solid: 'bg-atlas-text-primary text-atlas-text-inverse',
      },
      size: {
        xs: 'w-6 h-6 text-xs',
        sm: 'w-7 h-7 text-sm',
        default: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
        xl: 'w-12 h-12 text-lg',
        '2xl': 'w-14 h-14 text-xl',
        '3xl': 'w-16 h-16 text-2xl',
        '4xl': 'w-20 h-20 text-3xl',
        '5xl': 'w-24 h-24 text-4xl',
        '6xl': 'w-28 h-28 text-5xl',
      },
      state: {
        default: '',
        active: 'bg-atlas-primary-main text-atlas-text-inverse',
        completed: 'bg-atlas-success-main text-atlas-text-inverse',
        disabled: 'bg-atlas-border-subtle text-atlas-text-muted opacity-50',
        error: 'bg-atlas-error-main text-atlas-text-inverse',
        warning: 'bg-atlas-warning-main text-atlas-text-inverse',
        info: 'bg-atlas-info-main text-atlas-text-inverse',
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
      rounded: 'full',
      shadow: 'none',
    },
  }
);

const stepperStepContentVariants = cva(
  'ml-3',
  {
    variants: {
      variant: {
        default: '',
        solid: 'bg-atlas-card-bg border border-atlas-border rounded-lg p-3',
        transparent: 'bg-transparent',
        gradient: 'bg-gradient-to-r from-atlas-primary-main to-atlas-secondary-main rounded-lg p-3',
        dark: 'bg-atlas-text-primary text-atlas-text-inverse rounded-lg p-3',
        light: 'bg-atlas-text-inverse text-atlas-text-primary rounded-lg p-3',
        minimal: 'bg-transparent border-b border-atlas-border-subtle pb-2',
        floating: 'bg-atlas-card-bg border border-atlas-border rounded-lg shadow-lg p-3',
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
      state: {
        default: '',
        active: 'text-atlas-primary-main',
        completed: 'text-atlas-success-main',
        disabled: 'text-atlas-text-muted opacity-50',
        error: 'text-atlas-error-main',
        warning: 'text-atlas-warning-main',
        info: 'text-atlas-info-main',
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
      state: 'default',
      padding: 'none',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'none',
      shadow: 'none',
    },
  }
);

export interface StepperProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperVariants> {
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
  currentStep?: number;
  totalSteps?: number;
  onStepChange?: (step: number) => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface StepperStepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperStepVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'completed' | 'disabled' | 'error' | 'warning' | 'info';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  stepNumber?: number;
  onClick?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface StepperStepIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperStepIconVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted' | 'ghost' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'completed' | 'disabled' | 'error' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface StepperStepContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepperStepContentVariants> {
  variant?: 'default' | 'solid' | 'transparent' | 'gradient' | 'dark' | 'light' | 'minimal' | 'floating' | 'inline' | 'block';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'completed' | 'disabled' | 'error' | 'warning' | 'info';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'gradient' | 'pattern' | 'image';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error' | 'top' | 'bottom' | 'left' | 'right';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
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
    currentStep = 1,
    totalSteps = 1,
    onStepChange,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const stepperProps = asChild ? {} : {
      ref,
      className: cn(
        stepperVariants({
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
      'aria-label': 'Stepper',
      ...props,
    };

    return (
      <Comp {...stepperProps}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              stepNumber: index + 1,
              currentStep,
              totalSteps,
              onStepChange,
            } as any);
          }
          return child;
        })}
      </Comp>
    );
  }
);
Stepper.displayName = 'Stepper';

const StepperStep = React.forwardRef<HTMLDivElement, StepperStepProps>(
  ({
    className,
    variant,
    size,
    state,
    padding,
    margin,
    background,
    border,
    rounded,
    shadow,
    stepNumber,
    onClick,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const stepProps = asChild ? {} : {
      ref,
      onClick,
      className: cn(
        stepperStepVariants({
          variant,
          size,
          state,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          className,
        })
      ),
      'data-state': state,
      ...props,
    };

    return (
      <Comp {...stepProps}>
        {children}
      </Comp>
    );
  }
);
StepperStep.displayName = 'StepperStep';

const StepperStepIcon = React.forwardRef<HTMLDivElement, StepperStepIconProps>(
  ({
    className,
    variant,
    size,
    state,
    weight,
    rounded,
    shadow,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const iconProps = asChild ? {} : {
      ref,
      className: cn(
        stepperStepIconVariants({
          variant,
          size,
          state,
          weight,
          rounded,
          shadow,
          className,
        })
      ),
      'data-state': state,
      ...props,
    };

    return (
      <Comp {...iconProps}>
        {children}
      </Comp>
    );
  }
);
StepperStepIcon.displayName = 'StepperStepIcon';

const StepperStepContent = React.forwardRef<HTMLDivElement, StepperStepContentProps>(
  ({
    className,
    variant,
    size,
    state,
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
        stepperStepContentVariants({
          variant,
          size,
          state,
          padding,
          margin,
          background,
          border,
          rounded,
          shadow,
          className,
        })
      ),
      'data-state': state,
      ...props,
    };

    return (
      <Comp {...contentProps}>
        {children}
      </Comp>
    );
  }
);
StepperStepContent.displayName = 'StepperStepContent';

// Additional utility components for advanced stepper functionality
const StepperSolid = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperSolid.displayName = 'StepperSolid';

const StepperTransparent = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperTransparent.displayName = 'StepperTransparent';

const StepperGradient = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperGradient.displayName = 'StepperGradient';

const StepperDark = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperDark.displayName = 'StepperDark';

const StepperLight = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperLight.displayName = 'StepperLight';

const StepperMinimal = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperMinimal.displayName = 'StepperMinimal';

const StepperFloating = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperFloating.displayName = 'StepperFloating';

const StepperInline = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="inline"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperInline.displayName = 'StepperInline';

const StepperBlock = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    variant="block"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperBlock.displayName = 'StepperBlock';

// Stepper with responsive breakpoints
const StepperResponsive = React.forwardRef<
  HTMLDivElement,
  StepperProps & {
    breakpoints?: {
      sm?: Partial<StepperProps>;
      md?: Partial<StepperProps>;
      lg?: Partial<StepperProps>;
      xl?: Partial<StepperProps>;
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
    <Stepper
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Stepper>
  );
});
StepperResponsive.displayName = 'StepperResponsive';

// Stepper with spacing utilities
const StepperSpacing = React.forwardRef<
  HTMLDivElement,
  StepperProps & {
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
    <Stepper
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Stepper>
  );
});
StepperSpacing.displayName = 'StepperSpacing';

// Stepper with card styling
const StepperCard = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Stepper
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
  </Stepper>
));
StepperCard.displayName = 'StepperCard';

// Stepper with section styling
const StepperSection = React.forwardRef<
  HTMLDivElement,
  Omit<StepperProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Stepper
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Stepper>
));
StepperSection.displayName = 'StepperSection';

export {
  Stepper,
  StepperStep,
  StepperStepIcon,
  StepperStepContent,
  StepperSolid,
  StepperTransparent,
  StepperGradient,
  StepperDark,
  StepperLight,
  StepperMinimal,
  StepperFloating,
  StepperInline,
  StepperBlock,
  StepperResponsive,
  StepperSpacing,
  StepperCard,
  StepperSection,
  stepperVariants,
  stepperStepVariants,
  stepperStepIconVariants,
  stepperStepContentVariants,
};
