import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const gridVariants = cva(
  'grid',
  {
    variants: {
      variant: {
        default: '',
        auto: 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
        fixed: 'grid-cols-12',
        masonry: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4',
        responsive: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      },
      cols: {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
        5: 'grid-cols-5',
        6: 'grid-cols-6',
        7: 'grid-cols-7',
        8: 'grid-cols-8',
        9: 'grid-cols-9',
        10: 'grid-cols-10',
        11: 'grid-cols-11',
        12: 'grid-cols-12',
        none: 'grid-cols-none',
      },
      rows: {
        1: 'grid-rows-1',
        2: 'grid-rows-2',
        3: 'grid-rows-3',
        4: 'grid-rows-4',
        5: 'grid-rows-5',
        6: 'grid-rows-6',
        none: 'grid-rows-none',
        auto: 'grid-rows-[repeat(auto-fit,minmax(0,1fr))]',
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
      flow: {
        row: 'grid-flow-row',
        col: 'grid-flow-col',
        dense: 'grid-flow-dense',
        'row-dense': 'grid-flow-row-dense',
        'col-dense': 'grid-flow-col-dense',
      },
      autoCols: {
        auto: 'auto-cols-auto',
        min: 'auto-cols-min',
        max: 'auto-cols-max',
        fr: 'auto-cols-fr',
      },
      autoRows: {
        auto: 'auto-rows-auto',
        min: 'auto-rows-min',
        max: 'auto-rows-max',
        fr: 'auto-rows-fr',
      },
      justifyItems: {
        start: 'justify-items-start',
        end: 'justify-items-end',
        center: 'justify-items-center',
        stretch: 'justify-items-stretch',
      },
      alignItems: {
        start: 'items-start',
        end: 'items-end',
        center: 'items-center',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      },
      justifyContent: {
        start: 'justify-start',
        end: 'justify-end',
        center: 'justify-center',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
        stretch: 'justify-stretch',
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
      placeItems: {
        start: 'place-items-start',
        end: 'place-items-end',
        center: 'place-items-center',
        stretch: 'place-items-stretch',
      },
      placeContent: {
        start: 'place-content-start',
        end: 'place-content-end',
        center: 'place-content-center',
        between: 'place-content-between',
        around: 'place-content-around',
        evenly: 'place-content-evenly',
        stretch: 'place-content-stretch',
      },
    },
    defaultVariants: {
      variant: 'default',
      cols: 1,
      rows: 'auto',
      gap: 4,
      flow: 'row',
      justifyItems: 'stretch',
      alignItems: 'stretch',
      justifyContent: 'start',
      alignContent: 'start',
    },
  }
);

const gridItemVariants = cva(
  '',
  {
    variants: {
      colSpan: {
        1: 'col-span-1',
        2: 'col-span-2',
        3: 'col-span-3',
        4: 'col-span-4',
        5: 'col-span-5',
        6: 'col-span-6',
        7: 'col-span-7',
        8: 'col-span-8',
        9: 'col-span-9',
        10: 'col-span-10',
        11: 'col-span-11',
        12: 'col-span-12',
        full: 'col-span-full',
        auto: 'col-auto',
      },
      rowSpan: {
        1: 'row-span-1',
        2: 'row-span-2',
        3: 'row-span-3',
        4: 'row-span-4',
        5: 'row-span-5',
        6: 'row-span-6',
        full: 'row-span-full',
        auto: 'row-auto',
      },
      colStart: {
        1: 'col-start-1',
        2: 'col-start-2',
        3: 'col-start-3',
        4: 'col-start-4',
        5: 'col-start-5',
        6: 'col-start-6',
        7: 'col-start-7',
        8: 'col-start-8',
        9: 'col-start-9',
        10: 'col-start-10',
        11: 'col-start-11',
        12: 'col-start-12',
        13: 'col-start-13',
        auto: 'col-start-auto',
      },
      rowStart: {
        1: 'row-start-1',
        2: 'row-start-2',
        3: 'row-start-3',
        4: 'row-start-4',
        5: 'row-start-5',
        6: 'row-start-6',
        auto: 'row-start-auto',
      },
      colEnd: {
        1: 'col-end-1',
        2: 'col-end-2',
        3: 'col-end-3',
        4: 'col-end-4',
        5: 'col-end-5',
        6: 'col-end-6',
        7: 'col-end-7',
        8: 'col-end-8',
        9: 'col-end-9',
        10: 'col-end-10',
        11: 'col-end-11',
        12: 'col-end-12',
        13: 'col-end-13',
        auto: 'col-end-auto',
      },
      rowEnd: {
        1: 'row-end-1',
        2: 'row-end-2',
        3: 'row-end-3',
        4: 'row-end-4',
        5: 'row-end-5',
        6: 'row-end-6',
        auto: 'row-end-auto',
      },
      justifySelf: {
        start: 'justify-self-start',
        end: 'justify-self-end',
        center: 'justify-self-center',
        stretch: 'justify-self-stretch',
        auto: 'justify-self-auto',
      },
      alignSelf: {
        start: 'self-start',
        end: 'self-end',
        center: 'self-center',
        stretch: 'self-stretch',
        baseline: 'self-baseline',
        auto: 'self-auto',
      },
      placeSelf: {
        start: 'place-self-start',
        end: 'place-self-end',
        center: 'place-self-center',
        stretch: 'place-self-stretch',
        auto: 'place-self-auto',
      },
    },
    defaultVariants: {
      colSpan: 'auto',
      rowSpan: 'auto',
      justifySelf: 'auto',
      alignSelf: 'auto',
    },
  }
);

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  variant?: 'default' | 'auto' | 'fixed' | 'masonry' | 'responsive';
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'none';
  rows?: 1 | 2 | 3 | 4 | 5 | 6 | 'none' | 'auto';
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  gapX?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  gapY?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32;
  flow?: 'row' | 'col' | 'dense' | 'row-dense' | 'col-dense';
  autoCols?: 'auto' | 'min' | 'max' | 'fr';
  autoRows?: 'auto' | 'min' | 'max' | 'fr';
  justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  alignItems?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  placeItems?: 'start' | 'end' | 'center' | 'stretch';
  placeContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch';
  asChild?: boolean;
  children?: React.ReactNode;
}

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full' | 'auto';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full' | 'auto';
  colStart?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  rowStart?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  colEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  rowEnd?: 1 | 2 | 3 | 4 | 5 | 6 | 'auto';
  justifySelf?: 'start' | 'end' | 'center' | 'stretch' | 'auto';
  alignSelf?: 'start' | 'end' | 'center' | 'stretch' | 'baseline' | 'auto';
  placeSelf?: 'start' | 'end' | 'center' | 'stretch' | 'auto';
  asChild?: boolean;
  children?: React.ReactNode;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({
    className,
    variant,
    cols,
    rows,
    gap,
    gapX,
    gapY,
    flow,
    autoCols,
    autoRows,
    justifyItems,
    alignItems,
    justifyContent,
    alignContent,
    placeItems,
    placeContent,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const gridProps = asChild ? {} : {
      ref,
      className: cn(
        gridVariants({
          variant,
          cols,
          rows,
          gap,
          gapX,
          gapY,
          flow,
          autoCols,
          autoRows,
          justifyItems,
          alignItems,
          justifyContent,
          alignContent,
          placeItems,
          placeContent,
          className,
        })
      ),
      ...props,
    };

    return (
      <Comp {...gridProps}>
        {children}
      </Comp>
    );
  }
);
Grid.displayName = 'Grid';

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({
    className,
    colSpan,
    rowSpan,
    colStart,
    rowStart,
    colEnd,
    rowEnd,
    justifySelf,
    alignSelf,
    placeSelf,
    asChild = false,
    children,
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'div';
    
    const itemProps = asChild ? {} : {
      ref,
      className: cn(
        gridItemVariants({
          colSpan,
          rowSpan,
          colStart,
          rowStart,
          colEnd,
          rowEnd,
          justifySelf,
          alignSelf,
          placeSelf,
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
GridItem.displayName = 'GridItem';

// Additional utility components for advanced grid functionality
const GridAuto = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'variant' | 'cols'>
>(({ className, children, ...props }, ref) => (
  <Grid
    ref={ref}
    variant="auto"
    className={className}
    {...props}
  >
    {children}
  </Grid>
));
GridAuto.displayName = 'GridAuto';

const GridFixed = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'variant' | 'cols'>
>(({ className, children, ...props }, ref) => (
  <Grid
    ref={ref}
    variant="fixed"
    cols={12}
    className={className}
    {...props}
  >
    {children}
  </Grid>
));
GridFixed.displayName = 'GridFixed';

const GridMasonry = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Grid
    ref={ref}
    variant="masonry"
    className={className}
    {...props}
  >
    {children}
  </Grid>
));
GridMasonry.displayName = 'GridMasonry';

const GridResponsive = React.forwardRef<
  HTMLDivElement,
  Omit<GridProps, 'variant'>
>(({ className, children, ...props }, ref) => (
  <Grid
    ref={ref}
    variant="responsive"
    className={className}
    {...props}
  >
    {children}
  </Grid>
));
GridResponsive.displayName = 'GridResponsive';

// Grid with responsive breakpoints
const GridBreakpoints = React.forwardRef<
  HTMLDivElement,
  GridProps & {
    breakpoints?: {
      sm?: Partial<GridProps>;
      md?: Partial<GridProps>;
      lg?: Partial<GridProps>;
      xl?: Partial<GridProps>;
    };
  }
>(({ className, breakpoints, children, ...props }, ref) => {
  const responsiveClasses = React.useMemo(() => {
    if (!breakpoints) return '';
    
    const classes = [];
    
    if (breakpoints.sm?.cols) {
      classes.push(`sm:grid-cols-${breakpoints.sm.cols}`);
    }
    if (breakpoints.md?.cols) {
      classes.push(`md:grid-cols-${breakpoints.md.cols}`);
    }
    if (breakpoints.lg?.cols) {
      classes.push(`lg:grid-cols-${breakpoints.lg.cols}`);
    }
    if (breakpoints.xl?.cols) {
      classes.push(`xl:grid-cols-${breakpoints.xl.cols}`);
    }
    
    return classes.join(' ');
  }, [breakpoints]);

  return (
    <Grid
      ref={ref}
      className={cn(responsiveClasses, className)}
      {...props}
    >
      {children}
    </Grid>
  );
});
GridBreakpoints.displayName = 'GridBreakpoints';

// Grid with template areas
const GridTemplate = React.forwardRef<
  HTMLDivElement,
  GridProps & {
    templateAreas?: string[];
    templateColumns?: string;
    templateRows?: string;
  }
>(({ className, templateAreas, templateColumns, templateRows, children, ...props }, ref) => {
  const templateStyle = React.useMemo(() => {
    const style: React.CSSProperties = {};
    
    if (templateAreas) {
      style.gridTemplateAreas = templateAreas.map(area => `"${area}"`).join(' ');
    }
    if (templateColumns) {
      style.gridTemplateColumns = templateColumns;
    }
    if (templateRows) {
      style.gridTemplateRows = templateRows;
    }
    
    return style;
  }, [templateAreas, templateColumns, templateRows]);

  return (
    <Grid
      ref={ref}
      className={className}
      style={templateStyle}
      {...props}
    >
      {children}
    </Grid>
  );
});
GridTemplate.displayName = 'GridTemplate';

// Grid with subgrid support
const GridSubgrid = React.forwardRef<
  HTMLDivElement,
  GridProps & {
    subgrid?: boolean;
    subgridCols?: number;
    subgridRows?: number;
  }
>(({ className, subgrid = false, subgridCols, subgridRows, children, ...props }, ref) => {
  const subgridClasses = React.useMemo(() => {
    if (!subgrid) return '';
    
    const classes = ['subgrid'];
    
    if (subgridCols) {
      classes.push(`subgrid-cols-${subgridCols}`);
    }
    if (subgridRows) {
      classes.push(`subgrid-rows-${subgridRows}`);
    }
    
    return classes.join(' ');
  }, [subgrid, subgridCols, subgridRows]);

  return (
    <Grid
      ref={ref}
      className={cn(subgridClasses, className)}
      {...props}
    >
      {children}
    </Grid>
  );
});
GridSubgrid.displayName = 'GridSubgrid';

// Grid with gap utilities
const GridGap = React.forwardRef<
  HTMLDivElement,
  GridProps & {
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
    <Grid
      ref={ref}
      gap={gapSizes[gapSize]}
      className={className}
      {...props}
    >
      {children}
    </Grid>
  );
});
GridGap.displayName = 'GridGap';

export {
  Grid,
  GridItem,
  GridAuto,
  GridFixed,
  GridMasonry,
  GridResponsive,
  GridBreakpoints,
  GridTemplate,
  GridSubgrid,
  GridGap,
  gridVariants,
  gridItemVariants,
};
