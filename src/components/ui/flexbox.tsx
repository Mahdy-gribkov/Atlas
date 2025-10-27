import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const flexboxVariants = cva(
  'flex',
  {
    variants: {
      variant: {
        default: '',
        inline: 'inline-flex',
        column: 'flex-col',
        'column-reverse': 'flex-col-reverse',
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      direction: {
        row: 'flex-row',
        'row-reverse': 'flex-row-reverse',
        col: 'flex-col',
        'col-reverse': 'flex-col-reverse',
      },
      wrap: {
        wrap: 'flex-wrap',
        'wrap-reverse': 'flex-wrap-reverse',
        nowrap: 'flex-nowrap',
      },
      justify: {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      },
      align: {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        baseline: 'items-baseline',
        stretch: 'items-stretch',
      },
      alignContent: {
        start: 'content-start',
        end: 'content-end',
        center: 'content-center',
        between: 'content-between',
        around: 'content-around',
        evenly: 'content-evenly',
        stretch: 'content-stretch',
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
      gapX: {
        0: 'gap-x-0',
        1: 'gap-x-1',
        2: 'gap-x-2',
        3: 'gap-x-3',
        4: 'gap-x-4',
        5: 'gap-x-5',
        6: 'gap-x-6',
        8: 'gap-x-8',
        10: 'gap-x-10',
        12: 'gap-x-12',
        16: 'gap-x-16',
        20: 'gap-x-20',
        24: 'gap-x-24',
        32: 'gap-x-32',
      },
      gapY: {
        0: 'gap-y-0',
        1: 'gap-y-1',
        2: 'gap-y-2',
        3: 'gap-y-3',
        4: 'gap-y-4',
        5: 'gap-y-5',
        6: 'gap-y-6',
        8: 'gap-y-8',
        10: 'gap-y-10',
        12: 'gap-y-12',
        16: 'gap-y-16',
        20: 'gap-y-20',
        24: 'gap-y-24',
        32: 'gap-y-32',
      },
      grow: {
        0: 'grow-0',
        1: 'grow',
      },
      shrink: {
        0: 'shrink-0',
        1: 'shrink',
      },
      basis: {
        auto: 'basis-auto',
        full: 'basis-full',
        '1/2': 'basis-1/2',
        '1/3': 'basis-1/3',
        '2/3': 'basis-2/3',
        '1/4': 'basis-1/4',
        '3/4': 'basis-3/4',
        '1/5': 'basis-1/5',
        '2/5': 'basis-2/5',
        '3/5': 'basis-3/5',
        '4/5': 'basis-4/5',
        '1/6': 'basis-1/6',
        '5/6': 'basis-5/6',
      },
    },
    defaultVariants: {
      variant: 'default',
      direction: 'row',
      wrap: 'nowrap',
      justify: 'start',
      align: 'stretch',
      alignContent: 'stretch',
      gap: 0,
      grow: 0,
      shrink: 1,
      basis: 'auto',
    },
  }
);

const flexItemVariants = cva(
  '',
  {
    variants: {
      order: {
        1: 'order-1',
        2: 'order-2',
        3: 'order-3',
        4: 'order-4',
        5: 'order-5',
        6: 'order-6',
        7: 'order-7',
        8: 'order-8',
        9: 'order-9',
        10: 'order-10',
        11: 'order-11',
        12: 'order-12',
        first: 'order-first',
        last: 'order-last',
        none: 'order-none',
      },
      grow: {
        0: 'grow-0',
        1: 'grow',
      },
      shrink: {
        0: 'shrink-0',
        1: 'shrink',
      },
      basis: {
        auto: 'basis-auto',
        full: 'basis-full',
        '1/2': 'basis-1/2',
        '1/3': 'basis-1/3',
        '2/3': 'basis-2/3',
        '1/4': 'basis-1/4',
        '3/4': 'basis-3/4',
        '1/5': 'basis-1/5',
        '2/5': 'basis-2/5',
        '3/5': 'basis-3/5',
        '4/5': 'basis-4/5',
        '1/6': 'basis-1/6',
        '5/6': 'basis-5/6',
      },
      alignSelf: {
        auto: 'self-auto',
        start: 'self-start',
        end: 'self-end',
        center: 'self-center',
        stretch: 'self-stretch',
        baseline: 'self-baseline',
      },
      justifySelf: {
        auto: 'justify-self-auto',
        start: 'justify-self-start',
        end: 'justify-self-end',
        center: 'justify-self-center',
        stretch: 'justify-self-stretch',
      },
    },
    defaultVariants: {
      order: 'none',
      grow: 0,
      shrink: 1,
      basis: 'auto',
      alignSelf: 'auto',
      justifySelf: 'auto',
    },
  }
);

export interface FlexboxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexboxVariants> {
  variant?: 'default' | 'inline' | 'column' | 'column-reverse' | 'row' | 'row-reverse' | 'wrap' | 'wrap-reverse' | 'nowrap';
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  gapX?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  gapY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  grow?: 0 | 1;
  shrink?: 0 | 1;
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface FlexItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexItemVariants> {
  order?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'first' | 'last' | 'none';
  grow?: 0 | 1;
  shrink?: 0 | 1;
  basis?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | '1/5' | '2/5' | '3/5' | '4/5' | '1/6' | '5/6';
  alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  justifySelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Flexbox = React.forwardRef<HTMLDivElement, FlexboxProps>(
  ({
    className,
    variant,
    direction,
    wrap,
    justify,
    align,
    alignContent,
    gap,
    gapX,
    gapY,
    grow,
    shrink,
    basis,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const flexboxProps = asChild ? {} : {
      ref,
      className: cn(
        flexboxVariants({
          variant,
          direction,
          wrap,
          justify,
          align,
          alignContent,
          gap,
          gapX,
          gapY,
          grow,
          shrink,
          basis,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...flexboxProps}>
        {children}
      </Comp>
    );
  }
);
Flexbox.displayName = 'Flexbox';

const FlexItem = React.forwardRef<HTMLDivElement, FlexItemProps>(
  ({
    className,
    order,
    grow,
    shrink,
    basis,
    alignSelf,
    justifySelf,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const itemProps = asChild ? {} : {
      ref,
      className: cn(
        flexItemVariants({
          order,
          grow,
          shrink,
          basis,
          alignSelf,
          justifySelf,
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
FlexItem.displayName = 'FlexItem';

// Additional utility components for advanced flexbox functionality
const FlexRow = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    direction="row"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexRow.displayName = 'FlexRow';

const FlexCol = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'direction'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    direction="col"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexCol.displayName = 'FlexCol';

const FlexCenter = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'justify' | 'align'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    justify="center"
    align="center"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexCenter.displayName = 'FlexCenter';

const FlexBetween = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'justify'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    justify="between"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexBetween.displayName = 'FlexBetween';

const FlexAround = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'justify'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    justify="around"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexAround.displayName = 'FlexAround';

const FlexEvenly = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'justify'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    justify="evenly"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexEvenly.displayName = 'FlexEvenly';

const FlexWrap = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'wrap'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    wrap="wrap"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexWrap.displayName = 'FlexWrap';

const FlexNowrap = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'wrap'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    wrap="nowrap"
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexNowrap.displayName = 'FlexNowrap';

// Flexbox with responsive breakpoints
const FlexResponsive = React.forwardRef<
  HTMLDivElement,
  FlexboxProps & {
    breakpoints?: {
      sm?: Partial<FlexboxProps>;
      md?: Partial<FlexboxProps>;
      lg?: Partial<FlexboxProps>;
      xl?: Partial<FlexboxProps>;
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
    <Flexbox
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Flexbox>
  );
});
FlexResponsive.displayName = 'FlexResponsive';

// Flexbox with gap utilities
const FlexGap = React.forwardRef<
  HTMLDivElement,
  FlexboxProps & {
    gapSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ className, gapSize = 'md', children, ...props }, ref) => {
  const gapSizes = {
    xs: 2,
    sm: 3,
    md: 4,
    lg: 6,
    xl: 8,
  };

  return (
    <Flexbox
      ref={ref}
      gap={gapSizes[gapSize]}
      className={className}
      {...props}
    >
      {children}
    </Flexbox>
  );
});
FlexGap.displayName = 'FlexGap';

// Flexbox with grow utilities
const FlexGrow = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'grow'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    grow={1}
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexGrow.displayName = 'FlexGrow';

// Flexbox with shrink utilities
const FlexShrink = React.forwardRef<
  HTMLDivElement,
  Omit<FlexboxProps, 'shrink'>
>(({ className, children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    shrink={0}
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexShrink.displayName = 'FlexShrink';

// Flexbox with basis utilities
const FlexBasis = React.forwardRef<
  HTMLDivElement,
  FlexboxProps & {
    basisSize?: 'auto' | 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4';
  }
>(({ className, basisSize = 'auto', children, ...props }, ref) => (
  <Flexbox
    ref={ref}
    basis={basisSize}
    className={className}
    {...props}
  >
    {children}
  </Flexbox>
));
FlexBasis.displayName = 'FlexBasis';

export {
  Flexbox,
  FlexItem,
  FlexRow,
  FlexCol,
  FlexCenter,
  FlexBetween,
  FlexAround,
  FlexEvenly,
  FlexWrap,
  FlexNowrap,
  FlexResponsive,
  FlexGap,
  FlexGrow,
  FlexShrink,
  FlexBasis,
  flexboxVariants,
  flexItemVariants,
};
