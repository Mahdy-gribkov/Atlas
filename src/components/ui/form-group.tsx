import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { UsersIcon, FolderIcon, GridIcon, ListIcon } from 'lucide-react';

const formGroupVariants = cva(
  'space-y-4',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-6 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-2',
        card: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-sm',
        elevated: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'space-y-2 p-4',
        default: 'space-y-4 p-6',
        lg: 'space-y-6 p-8',
      },
      layout: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row items-end gap-4',
        grid: 'grid gap-4',
        inline: 'flex flex-wrap items-end gap-4',
      },
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      },
      gap: {
        sm: 'gap-2',
        default: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
      alignment: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
      spacing: {
        compact: 'space-y-2',
        default: 'space-y-4',
        relaxed: 'space-y-6',
        loose: 'space-y-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      layout: 'vertical',
      columns: 1,
      gap: 'default',
      alignment: 'stretch',
      spacing: 'default',
    },
  }
);

const formGroupHeaderVariants = cva(
  'flex items-center justify-between',
  {
    variants: {
      variant: {
        default: '',
        bordered: 'border-b border-atlas-border pb-4 mb-4',
        elevated: 'bg-atlas-border-subtle rounded-lg p-4 mb-4',
        minimal: 'pb-2 mb-2',
      },
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formGroupTitleVariants = cva(
  'font-semibold text-atlas-text-primary',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-base',
        lg: 'text-lg',
      },
      required: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      required: false,
    },
  }
);

const formGroupDescriptionVariants = cva(
  'text-sm text-atlas-text-secondary mt-1',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formGroupActionsVariants = cva(
  'flex items-center gap-2',
  {
    variants: {
      size: {
        sm: 'gap-1',
        default: 'gap-2',
        lg: 'gap-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formGroupContentVariants = cva(
  'space-y-4',
  {
    variants: {
      layout: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row items-end gap-4',
        grid: 'grid gap-4',
        inline: 'flex flex-wrap items-end gap-4',
      },
      columns: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      },
      gap: {
        sm: 'gap-2',
        default: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
      },
      spacing: {
        compact: 'space-y-2',
        default: 'space-y-4',
        relaxed: 'space-y-6',
        loose: 'space-y-8',
      },
    },
    defaultVariants: {
      layout: 'vertical',
      columns: 1,
      gap: 'default',
      spacing: 'default',
    },
  }
);

export interface FormGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  layout?: 'vertical' | 'horizontal' | 'grid' | 'inline';
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'default' | 'lg' | 'xl';
  alignment?: 'start' | 'center' | 'end' | 'stretch';
  spacing?: 'compact' | 'default' | 'relaxed' | 'loose';
  title?: string;
  description?: string;
  required?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  showHeader?: boolean;
  children: React.ReactNode;
}

export interface FormGroupHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupHeaderVariants> {
  variant?: 'default' | 'bordered' | 'elevated' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  title?: string;
  description?: string;
  required?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface FormGroupTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof formGroupTitleVariants> {
  size?: 'sm' | 'default' | 'lg';
  required?: boolean;
}

export interface FormGroupDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formGroupDescriptionVariants> {
  size?: 'sm' | 'default' | 'lg';
}

export interface FormGroupActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupActionsVariants> {
  size?: 'sm' | 'default' | 'lg';
}

export interface FormGroupContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formGroupContentVariants> {
  layout?: 'vertical' | 'horizontal' | 'grid' | 'inline';
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'default' | 'lg' | 'xl';
  spacing?: 'compact' | 'default' | 'relaxed' | 'loose';
}

const FormGroupTitle = React.forwardRef<
  HTMLHeadingElement,
  FormGroupTitleProps
>(({ className, size, required, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(formGroupTitleVariants({ size, required, className }))}
    {...props}
  >
    {children}
    {required && (
      <span className="text-atlas-error-main ml-1" aria-label="required">
        *
      </span>
    )}
  </h3>
));
FormGroupTitle.displayName = 'FormGroupTitle';

const FormGroupDescription = React.forwardRef<
  HTMLParagraphElement,
  FormGroupDescriptionProps
>(({ className, size, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(formGroupDescriptionVariants({ size, className }))}
    {...props}
  >
    {children}
  </p>
));
FormGroupDescription.displayName = 'FormGroupDescription';

const FormGroupActions = React.forwardRef<
  HTMLDivElement,
  FormGroupActionsProps
>(({ className, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formGroupActionsVariants({ size, className }))}
    {...props}
  >
    {children}
  </div>
));
FormGroupActions.displayName = 'FormGroupActions';

const FormGroupHeader = React.forwardRef<
  HTMLDivElement,
  FormGroupHeaderProps
>(({ 
  className, 
  variant, 
  size, 
  title, 
  description, 
  required, 
  icon, 
  actions, 
  children, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={cn(formGroupHeaderVariants({ variant, size, className }))}
    {...props}
  >
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        {title && (
          <FormGroupTitle size={size} required={required}>
            {title}
          </FormGroupTitle>
        )}
        {description && (
          <FormGroupDescription size={size}>
            {description}
          </FormGroupDescription>
        )}
        {children}
      </div>
    </div>
    {actions && (
      <FormGroupActions size={size}>
        {actions}
      </FormGroupActions>
    )}
  </div>
));
FormGroupHeader.displayName = 'FormGroupHeader';

const FormGroupContent = React.forwardRef<
  HTMLDivElement,
  FormGroupContentProps
>(({ className, layout, columns, gap, spacing, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formGroupContentVariants({ layout, columns, gap, spacing, className }))}
    {...props}
  >
    {children}
  </div>
));
FormGroupContent.displayName = 'FormGroupContent';

const FormGroup = React.forwardRef<
  HTMLDivElement,
  FormGroupProps
>(({
  className,
  variant,
  size,
  layout,
  columns,
  gap,
  alignment,
  spacing,
  title,
  description,
  required,
  icon,
  actions,
  showHeader = true,
  children,
  ...props
}, ref) => {
  const groupId = React.useId();

  return (
    <fieldset
      ref={ref}
      className={cn(formGroupVariants({ variant, size, layout, columns, gap, alignment, spacing, className }))}
      aria-labelledby={title ? `${groupId}-title` : undefined}
      aria-describedby={description ? `${groupId}-description` : undefined}
      {...props}
    >
      {showHeader && (title || description || icon || actions) && (
        <FormGroupHeader
          variant={variant === 'card' || variant === 'elevated' ? 'bordered' : 'default'}
          size={size}
          title={title}
          description={description}
          required={required}
          icon={icon}
          actions={actions}
        />
      )}
      
      <FormGroupContent
        layout={layout}
        columns={columns}
        gap={gap}
        spacing={spacing}
      >
        {children}
      </FormGroupContent>
    </fieldset>
  );
});
FormGroup.displayName = 'FormGroup';

// Additional utility components for advanced form group functionality
const FormGroupContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
    size?: 'sm' | 'default' | 'lg';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  }
>(({ className, variant = 'default', size = 'default', maxWidth = 'full', children, ...props }, ref) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
        variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
FormGroupContainer.displayName = 'FormGroupContainer';

const FormGroupSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    showHeader?: boolean;
    fieldCount?: number;
    columns?: 1 | 2 | 3 | 4;
  }
>(({ className, size = 'default', showHeader = true, fieldCount = 3, columns = 1, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-6',
    default: 'h-8',
    lg: 'h-10',
  };

  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-4', className)}
      {...props}
    >
      {showHeader && (
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-6 w-32 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      )}
      <div className={cn('grid gap-4', gridClasses[columns])}>
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
            <div
              className={cn(
                'w-full bg-atlas-border-subtle rounded animate-pulse',
                sizeClasses[size]
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
});
FormGroupSkeleton.displayName = 'FormGroupSkeleton';

export {
  FormGroup,
  FormGroupHeader,
  FormGroupTitle,
  FormGroupDescription,
  FormGroupActions,
  FormGroupContent,
  FormGroupContainer,
  FormGroupSkeleton,
  formGroupVariants,
  formGroupHeaderVariants,
  formGroupTitleVariants,
  formGroupDescriptionVariants,
  formGroupActionsVariants,
  formGroupContentVariants,
};
