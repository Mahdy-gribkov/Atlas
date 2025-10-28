import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const paginationVariants = cva(
  'flex items-center justify-center space-x-2',
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
      align: 'center',
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

const paginationItemVariants = cva(
  'flex items-center justify-center min-w-[2.5rem] h-10 px-3 py-2 text-sm font-medium transition-colors',
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
        xs: 'min-w-[2rem] h-8 px-2 py-1 text-xs',
        sm: 'min-w-[2.25rem] h-9 px-2.5 py-1.5 text-sm',
        default: 'min-w-[2.5rem] h-10 px-3 py-2 text-sm',
        lg: 'min-w-[3rem] h-11 px-4 py-2.5 text-base',
        xl: 'min-w-[3.5rem] h-12 px-5 py-3 text-lg',
        '2xl': 'min-w-[4rem] h-14 px-6 py-4 text-xl',
        '3xl': 'min-w-[5rem] h-16 px-8 py-5 text-2xl',
        '4xl': 'min-w-[6rem] h-18 px-10 py-6 text-3xl',
        '5xl': 'min-w-[7rem] h-20 px-12 py-7 text-4xl',
        '6xl': 'min-w-[8rem] h-24 px-16 py-8 text-5xl',
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

const paginationEllipsisVariants = cva(
  'flex items-center justify-center min-w-[2.5rem] h-10 px-3 py-2 text-sm font-medium text-atlas-text-muted',
  {
    variants: {
      variant: {
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
      size: {
        xs: 'min-w-[2rem] h-8 px-2 py-1 text-xs',
        sm: 'min-w-[2.25rem] h-9 px-2.5 py-1.5 text-sm',
        default: 'min-w-[2.5rem] h-10 px-3 py-2 text-sm',
        lg: 'min-w-[3rem] h-11 px-4 py-2.5 text-base',
        xl: 'min-w-[3.5rem] h-12 px-5 py-3 text-lg',
        '2xl': 'min-w-[4rem] h-14 px-6 py-4 text-xl',
        '3xl': 'min-w-[5rem] h-16 px-8 py-5 text-2xl',
        '4xl': 'min-w-[6rem] h-18 px-10 py-6 text-3xl',
        '5xl': 'min-w-[7rem] h-20 px-12 py-7 text-4xl',
        '6xl': 'min-w-[8rem] h-24 px-16 py-8 text-5xl',
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      weight: 'medium',
      rounded: 'default',
    },
  }
);

export interface PaginationProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof paginationVariants> {
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
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showEllipsis?: boolean;
  maxVisiblePages?: number;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PaginationItemProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationItemVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted' | 'ghost' | 'outline' | 'solid';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  state?: 'default' | 'active' | 'disabled' | 'loading' | 'error' | 'success' | 'warning' | 'info';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  shadow?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | 'inner';
  page?: number;
  onClick?: () => void;
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface PaginationEllipsisProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof paginationEllipsisVariants> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'inverse' | 'muted';
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  rounded?: 'none' | 'sm' | 'default' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
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
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    showFirstLast = true,
    showPrevNext = true,
    showEllipsis = true,
    maxVisiblePages = 5,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'nav';
    
    const paginationProps = asChild ? {} : {
      ref,
      className: cn(
        paginationVariants({
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
      'aria-label': 'Pagination',
      ...props,
    };

    const generatePageNumbers = () => {
      const pages: (number | 'ellipsis')[] = [];
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (showFirstLast && startPage > 1) {
        pages.push(1);
        if (startPage > 2 && showEllipsis) {
          pages.push('ellipsis');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (showFirstLast && endPage < totalPages) {
        if (endPage < totalPages - 1 && showEllipsis) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
      
      return pages;
    };

    const handlePageChange = (page: number) => {
      if (onPageChange && page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    };

    return (
      <Comp {...paginationProps}>
        {children || (
          <>
            {showPrevNext && (
              <PaginationItem
                variant="ghost"
                size={size}
                state={currentPage === 1 ? 'disabled' : 'default'}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous page"
              >
                ←
              </PaginationItem>
            )}
            
            {generatePageNumbers().map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <PaginationEllipsis
                    key={`ellipsis-${index}`}
                    variant="default"
                    size={size}
                  >
                    ...
                  </PaginationEllipsis>
                );
              }
              
              return (
                <PaginationItem
                  key={page}
                  variant="default"
                  size={size}
                  state={page === currentPage ? 'active' : 'default'}
                  onClick={() => handlePageChange(page)}
                  aria-label={`Page ${page}`}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </PaginationItem>
              );
            })}
            
            {showPrevNext && (
              <PaginationItem
                variant="ghost"
                size={size}
                state={currentPage === totalPages ? 'disabled' : 'default'}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next page"
              >
                →
              </PaginationItem>
            )}
          </>
        )}
      </Comp>
    );
  }
);
Pagination.displayName = 'Pagination';

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({
    className,
    variant,
    size,
    state,
    weight,
    rounded,
    shadow,
    page,
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
        paginationItemVariants({
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
PaginationItem.displayName = 'PaginationItem';

const PaginationEllipsis = React.forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  ({
    className,
    variant,
    size,
    weight,
    rounded,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'span';
    
    const ellipsisProps = asChild ? {} : {
      ref,
      className: cn(
        paginationEllipsisVariants({
          variant,
          size,
          weight,
          rounded,
          className,
        })
      ),
      'aria-hidden': 'true',
      ...props,
    };

    return (
      <Comp {...ellipsisProps}>
        {children || '...'}
      </Comp>
    );
  }
);
PaginationEllipsis.displayName = 'PaginationEllipsis';

// Additional utility components for advanced pagination functionality
const PaginationSolid = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="solid"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationSolid.displayName = 'PaginationSolid';

const PaginationTransparent = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="transparent"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationTransparent.displayName = 'PaginationTransparent';

const PaginationGradient = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="gradient"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationGradient.displayName = 'PaginationGradient';

const PaginationDark = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="dark"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationDark.displayName = 'PaginationDark';

const PaginationLight = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="light"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationLight.displayName = 'PaginationLight';

const PaginationMinimal = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="minimal"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationMinimal.displayName = 'PaginationMinimal';

const PaginationFloating = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="floating"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationFloating.displayName = 'PaginationFloating';

const PaginationInline = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="inline"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationInline.displayName = 'PaginationInline';

const PaginationBlock = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    variant="block"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationBlock.displayName = 'PaginationBlock';

// Pagination with responsive breakpoints
const PaginationResponsive = React.forwardRef<
  HTMLElement,
  PaginationProps & {
    breakpoints?: {
      sm?: Partial<PaginationProps>;
      md?: Partial<PaginationProps>;
      lg?: Partial<PaginationProps>;
      xl?: Partial<PaginationProps>;
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
    <Pagination
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Pagination>
  );
});
PaginationResponsive.displayName = 'PaginationResponsive';

// Pagination with spacing utilities
const PaginationSpacing = React.forwardRef<
  HTMLElement,
  PaginationProps & {
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
    <Pagination
      ref={ref}
      size={spacingSizes[spacingSize]}
      className={className}
      {...props}
    >
      {children}
    </Pagination>
  );
});
PaginationSpacing.displayName = 'PaginationSpacing';

// Pagination with card styling
const PaginationCard = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'background' | 'border' | 'rounded' | 'shadow' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Pagination
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
  </Pagination>
));
PaginationCard.displayName = 'PaginationCard';

// Pagination with section styling
const PaginationSection = React.forwardRef<
  HTMLElement,
  Omit<PaginationProps, 'background' | 'padding'>
>(({ className, children, ...props }, ref) => (
  <Pagination
    ref={ref}
    background="subtle"
    padding="xl"
    className={className}
    {...props}
  >
    {children}
  </Pagination>
));
PaginationSection.displayName = 'PaginationSection';

export {
  Pagination,
  PaginationItem,
  PaginationEllipsis,
  PaginationSolid,
  PaginationTransparent,
  PaginationGradient,
  PaginationDark,
  PaginationLight,
  PaginationMinimal,
  PaginationFloating,
  PaginationInline,
  PaginationBlock,
  PaginationResponsive,
  PaginationSpacing,
  PaginationCard,
  PaginationSection,
  paginationVariants,
  paginationItemVariants,
  paginationEllipsisVariants,
};