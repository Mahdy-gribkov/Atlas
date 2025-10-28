import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const sectionVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: '',
        hero: 'min-h-screen flex items-center justify-center',
        content: 'py-16',
        footer: 'py-8',
        header: 'py-4',
        sidebar: 'h-full',
        main: 'flex-1',
        aside: 'w-64',
        article: 'max-w-4xl mx-auto',
        nav: 'py-2',
        section: 'py-12',
      },
      size: {
        xs: 'py-4',
        sm: 'py-6',
        default: 'py-8',
        lg: 'py-12',
        xl: 'py-16',
        '2xl': 'py-20',
        '3xl': 'py-24',
        '4xl': 'py-32',
        '5xl': 'py-40',
        '6xl': 'py-48',
        full: 'min-h-screen',
        auto: 'py-auto',
      },
      padding: {
        none: 'p-0',
        xs: 'px-4 py-2',
        sm: 'px-6 py-4',
        default: 'px-8 py-6',
        lg: 'px-12 py-8',
        xl: 'px-16 py-12',
        '2xl': 'px-20 py-16',
        '3xl': 'px-24 py-20',
        '4xl': 'px-32 py-24',
        '5xl': 'px-40 py-32',
        '6xl': 'px-48 py-40',
      },
      margin: {
        none: 'm-0',
        xs: 'mx-4 my-2',
        sm: 'mx-6 my-4',
        default: 'mx-8 my-6',
        lg: 'mx-12 my-8',
        xl: 'mx-16 my-12',
        '2xl': 'mx-20 my-16',
        '3xl': 'mx-24 my-20',
        '4xl': 'mx-32 my-24',
        '5xl': 'mx-40 my-32',
        '6xl': 'mx-48 my-40',
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
        gradient: 'bg-gradient-to-br from-atlas-primary-main to-atlas-secondary-main',
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

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  variant?: 'default' | 'hero' | 'content' | 'footer' | 'header' | 'sidebar' | 'main' | 'aside' | 'article' | 'nav' | 'section';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | 'full' | 'auto';
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

const Section = React.forwardRef<HTMLElement, SectionProps>(
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
    const Comp = asChild ? React.Fragment : 'section';
    
    const sectionProps = asChild ? {} : {
      ref,
      className: cn(
        sectionVariants({
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
      <Comp {...sectionProps}>
        {children}
      </Comp>
    );
  }
);
Section.displayName = 'Section';

// Additional utility components for advanced section functionality
const SectionHero = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="hero"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionHero.displayName = 'SectionHero';

const SectionContent = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="content"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionContent.displayName = 'SectionContent';

const SectionFooter = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="footer"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionFooter.displayName = 'SectionFooter';

const SectionHeader = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="header"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionHeader.displayName = 'SectionHeader';

const SectionSidebar = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="sidebar"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionSidebar.displayName = 'SectionSidebar';

const SectionMain = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="main"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionMain.displayName = 'SectionMain';

const SectionAside = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="aside"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionAside.displayName = 'SectionAside';

const SectionArticle = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="article"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionArticle.displayName = 'SectionArticle';

const SectionNav = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="nav"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionNav.displayName = 'SectionNav';

const SectionSection = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    variant="section"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionSection.displayName = 'SectionSection';

// Section with responsive breakpoints
const SectionResponsive = React.forwardRef<
  HTMLElement,
  SectionProps & {
    breakpoints?: {
      sm?: Partial<SectionProps>;
      md?: Partial<SectionProps>;
      lg?: Partial<SectionProps>;
      xl?: Partial<SectionProps>;
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
    <Section
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Section>
  );
});
SectionResponsive.displayName = 'SectionResponsive';

// Section with spacing utilities
const SectionSpacing = React.forwardRef<
  HTMLElement,
  SectionProps & {
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
    <Section
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Section>
  );
});
SectionSpacing.displayName = 'SectionSpacing';

// Section with card styling
const SectionCard = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Section
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
  </Section>
));
SectionCard.displayName = 'SectionCard';

// Section with section styling
const SectionSectionStyled = React.forwardRef<
  HTMLElement,
  Omit<SectionProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Section
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Section>
));
SectionSectionStyled.displayName = 'SectionSectionStyled';

export {
  Section,
  SectionHero,
  SectionContent,
  SectionFooter,
  SectionHeader,
  SectionSidebar,
  SectionMain,
  SectionAside,
  SectionArticle,
  SectionNav,
  SectionSection,
  SectionResponsive,
  SectionSpacing,
  SectionCard,
  SectionSectionStyled,
  sectionVariants,
};
