import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const containerVariants = cva(
  'w-full mx-auto',
  {
    variants: {
      variant: {
        default: '',
        centered: 'flex flex-col items-center justify-center',
        fluid: 'max-w-none',
        constrained: 'max-w-7xl',
        narrow: 'max-w-4xl',
        wide: 'max-w-full',
      },
      size: {
        xs: 'px-4',
        sm: 'px-6',
        default: 'px-8',
        lg: 'px-12',
        xl: 'px-16',
        none: 'px-0',
      },
      maxWidth: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
        screen: 'max-w-screen-xl',
        none: 'max-w-none',
      },
      padding: {
        none: 'p-0',
        xs: 'p-2',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-12',
        '2xl': 'p-16',
      },
      margin: {
        none: 'm-0',
        xs: 'm-2',
        sm: 'm-4',
        default: 'm-6',
        lg: 'm-8',
        xl: 'm-12',
        '2xl': 'm-16',
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
      maxWidth: '7xl',
      padding: 'default',
      margin: 'none',
      background: 'none',
      border: 'none',
      rounded: 'default',
      shadow: 'none',
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  variant?: 'default' | 'centered' | 'fluid' | 'constrained' | 'narrow' | 'wide';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'none';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | 'screen' | 'none';
  padding?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  margin?: 'none' | 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'auto';
  background?: 'none' | 'subtle' | 'card' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  border?: 'none' | 'subtle' | 'default' | 'strong' | 'primary' | 'success' | 'warning' | 'error';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({
    className,
    variant,
    size,
    maxWidth,
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
    
    const containerProps = asChild ? {} : {
      ref,
      className: cn(
        containerVariants({
          variant,
          size,
          maxWidth,
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
      <Comp {...containerProps}>
        {children}
      </Comp>
    );
  }
);
Container.displayName = 'Container';

// Additional utility components for advanced container functionality
const ContainerFluid = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'variant' | 'maxWidth'>
>(({ className, children, ...props }, ref) => (
  <Container
    ref={ref}
    variant="fluid"
    maxWidth="none"
    className={className}
    {...props}
  >
    {children}
  </Container>
));
ContainerFluid.displayName = 'ContainerFluid';

const ContainerNarrow = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'variant' | 'maxWidth'>
>(({ className, children, ...props }, ref) => (
  <Container
    ref={ref}
    variant="narrow"
    maxWidth="4xl"
    className={className}
    {...props}
  >
    {children}
  </Container>
));
ContainerNarrow.displayName = 'ContainerNarrow';

const ContainerWide = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'variant' | 'maxWidth'>
>(({ className, children, ...props }, ref) => (
  <Container
    ref={ref}
    variant="wide"
    maxWidth="full"
    className={className}
    {...props}
  >
    {children}
  </Container>
));
ContainerWide.displayName = 'ContainerWide';

const ContainerCentered = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Container
    ref={ref}
    variant="centered"
    className={className}
    {...props}
  >
    {children}
  </Container>
));
ContainerCentered.displayName = 'ContainerCentered';

const ContainerCard = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'background' | 'border' | 'rounded' | 'shadow'>
>(({ className, children, ...props }, ref) => (
  <Container
    ref={ref}
    background="card"
    border="default"
    rounded="lg"
    shadow="sm"
    className={className}
    {...props}
  >
    {children}
  </Container>
));
ContainerCard.displayName = 'ContainerCard';

const ContainerSection = React.forwardRef<
  HTMLDivElement,
  Omit<ContainerProps, 'padding' | 'background'>
>(({ className, children, ...props }, ref) => (
  <Container
    ref={ref}
    padding="xl"
    background="subtle"
    className={className}
    {...props}
  >
    {children}
  </Container>
));
ContainerSection.displayName = 'ContainerSection';

// Responsive container variants
const ContainerResponsive = React.forwardRef<
  HTMLDivElement,
  ContainerProps & {
    breakpoints?: {
      sm?: ContainerProps;
      md?: ContainerProps;
      lg?: ContainerProps;
      xl?: ContainerProps;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm) {
      classes.push('sm:max-w-sm');
    }
    if (breakpoints.md) {
      classes.push('md:max-w-md');
    }
    if (breakpoints.lg) {
      classes.push('lg:max-w-lg');
    }
    if (breakpoints.xl) {
      classes.push('xl:max-w-xl');
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Container
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Container>
  );
});
ContainerResponsive.displayName = 'ContainerResponsive';

// Container with aspect ratio
const ContainerAspect = React.forwardRef<
  HTMLDivElement,
  ContainerProps & {
    aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide' | 'ultrawide';
  }
>(({ className, aspectRatio = 'video', children, ...props }, ref) => {
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    wide: 'aspect-[16/9]',
    ultrawide: 'aspect-[21/9]',
  };

  return (
    <Container
      ref={ref}
      className={cn(aspectClasses[aspectRatio], className)}
      {...props}
    >
      {children}
    </Container>
  );
});
ContainerAspect.displayName = 'ContainerAspect';

// Container with scroll behavior
const ContainerScrollable = React.forwardRef<
  HTMLDivElement,
  ContainerProps & {
    scrollBehavior?: 'auto' | 'smooth';
    scrollSnap?: boolean;
    scrollPadding?: string;
  }
>(({ className, scrollBehavior = 'auto', scrollSnap = false, scrollPadding, children, ...props }, ref) => {
  const scrollClasses = cn(
    'overflow-auto',
    scrollBehavior === 'smooth' && 'scroll-smooth',
    scrollSnap && 'scroll-snap-type-y-mandatory',
    scrollPadding && `scroll-p-${scrollPadding}`
  );

  return (
    <Container
      ref={ref}
      className={cn(scrollClasses, className)}
      {...props}
    >
      {children}
    </Container>
  );
});
ContainerScrollable.displayName = 'ContainerScrollable';

// Container with focus management
const ContainerFocusable = React.forwardRef<
  HTMLDivElement,
  ContainerProps & {
    focusable?: boolean;
    focusRing?: boolean;
  }
>(({ className, focusable = false, focusRing = true, children, ...props }, ref) => {
  const focusClasses = cn(
    focusable && 'focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2',
    focusable && 'cursor-pointer',
    !focusRing && 'focus:ring-0'
  );

  return (
    <Container
      ref={ref}
      className={cn(focusClasses, className)}
      tabIndex={focusable ? 0 : undefined}
      {...props}
    >
      {children}
    </Container>
  );
});
ContainerFocusable.displayName = 'ContainerFocusable';

export {
  Container,
  ContainerFluid,
  ContainerNarrow,
  ContainerWide,
  ContainerCentered,
  ContainerCard,
  ContainerSection,
  ContainerResponsive,
  ContainerAspect,
  ContainerScrollable,
  ContainerFocusable,
  containerVariants,
};
