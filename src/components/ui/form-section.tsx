import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  FolderIcon, 
  FileTextIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon
} from 'lucide-react';

const formSectionVariants = cva(
  'border border-atlas-border rounded-lg bg-atlas-card-bg',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg',
        outlined: 'border-2 border-atlas-primary-main bg-atlas-card-bg',
        ghost: 'border-transparent bg-transparent',
        minimal: 'border-atlas-border-subtle bg-atlas-border-subtle',
        card: 'border-atlas-border bg-atlas-card-bg shadow-sm',
        elevated: 'border-atlas-border bg-atlas-card-bg shadow-md',
        success: 'border-atlas-success-main bg-atlas-success-bg',
        warning: 'border-atlas-warning-main bg-atlas-warning-bg',
        error: 'border-atlas-error-main bg-atlas-error-bg',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      collapsible: {
        true: 'overflow-hidden transition-all duration-200',
        false: '',
      },
      collapsed: {
        true: 'max-h-0 opacity-0',
        false: '',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      collapsible: false,
      collapsed: false,
      disabled: false,
    },
  }
);

const formSectionHeaderVariants = cva(
  'flex items-center justify-between cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle',
        outlined: 'hover:bg-atlas-primary-lighter',
        ghost: 'hover:bg-atlas-border-subtle',
        minimal: 'hover:bg-atlas-border-subtle',
        card: 'hover:bg-atlas-border-subtle',
        elevated: 'hover:bg-atlas-border-subtle',
        success: 'hover:bg-atlas-success-main/10',
        warning: 'hover:bg-atlas-warning-main/10',
        error: 'hover:bg-atlas-error-main/10',
      },
      size: {
        sm: 'px-4 py-3',
        default: 'px-6 py-4',
        lg: 'px-8 py-5',
      },
      collapsible: {
        true: 'rounded-t-lg',
        false: 'rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      collapsible: false,
    },
  }
);

const formSectionTitleVariants = cva(
  'font-semibold text-atlas-text-primary flex items-center gap-2',
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
      disabled: {
        true: 'text-atlas-text-tertiary',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      required: false,
      disabled: false,
    },
  }
);

const formSectionDescriptionVariants = cva(
  'text-sm text-atlas-text-secondary mt-1',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      disabled: {
        true: 'text-atlas-text-tertiary',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      disabled: false,
    },
  }
);

const formSectionContentVariants = cva(
  'space-y-4',
  {
    variants: {
      size: {
        sm: 'px-4 pb-4 space-y-2',
        default: 'px-6 pb-6 space-y-4',
        lg: 'px-8 pb-8 space-y-6',
      },
      collapsible: {
        true: 'rounded-b-lg',
        false: '',
      },
    },
    defaultVariants: {
      size: 'default',
      collapsible: false,
    },
  }
);

const formSectionActionsVariants = cva(
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

export interface FormSectionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSectionVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default' | 'lg';
  collapsible?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
  title?: string;
  description?: string;
  required?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  showHeader?: boolean;
  onToggle?: (collapsed: boolean) => void;
  children: React.ReactNode;
}

export interface FormSectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSectionHeaderVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'default' | 'lg';
  collapsible?: boolean;
  title?: string;
  description?: string;
  required?: boolean;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  collapsed?: boolean;
  onToggle?: () => void;
}

export interface FormSectionTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof formSectionTitleVariants> {
  size?: 'sm' | 'default' | 'lg';
  required?: boolean;
  disabled?: boolean;
}

export interface FormSectionDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof formSectionDescriptionVariants> {
  size?: 'sm' | 'default' | 'lg';
  disabled?: boolean;
}

export interface FormSectionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSectionContentVariants> {
  size?: 'sm' | 'default' | 'lg';
  collapsible?: boolean;
}

export interface FormSectionActionsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formSectionActionsVariants> {
  size?: 'sm' | 'default' | 'lg';
}

const FormSectionTitle = React.forwardRef<
  HTMLHeadingElement,
  FormSectionTitleProps
>(({ className, size, required, disabled, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(formSectionTitleVariants({ size, required, disabled, className }))}
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
FormSectionTitle.displayName = 'FormSectionTitle';

const FormSectionDescription = React.forwardRef<
  HTMLParagraphElement,
  FormSectionDescriptionProps
>(({ className, size, disabled, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(formSectionDescriptionVariants({ size, disabled, className }))}
    {...props}
  >
    {children}
  </p>
));
FormSectionDescription.displayName = 'FormSectionDescription';

const FormSectionActions = React.forwardRef<
  HTMLDivElement,
  FormSectionActionsProps
>(({ className, size, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formSectionActionsVariants({ size, className }))}
    {...props}
  >
    {children}
  </div>
));
FormSectionActions.displayName = 'FormSectionActions';

const FormSectionHeader = React.forwardRef<
  HTMLDivElement,
  FormSectionHeaderProps
>(({ 
  className, 
  variant, 
  size, 
  collapsible, 
  title, 
  description, 
  required, 
  icon, 
  actions, 
  collapsed, 
  onToggle, 
  children, 
  ...props 
}, ref) => {
  const handleClick = React.useCallback(() => {
    if (collapsible && onToggle) {
      onToggle();
    }
  }, [collapsible, onToggle]);

  return (
    <div
      ref={ref}
      className={cn(formSectionHeaderVariants({ variant, size, collapsible, className }))}
      onClick={handleClick}
      role={collapsible ? 'button' : undefined}
      tabIndex={collapsible ? 0 : undefined}
      aria-expanded={collapsible ? !collapsed : undefined}
      aria-controls={collapsible ? 'section-content' : undefined}
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
            <FormSectionTitle size={size} required={required}>
              {title}
            </FormSectionTitle>
          )}
          {description && (
            <FormSectionDescription size={size}>
              {description}
            </FormSectionDescription>
          )}
          {children}
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        {actions && (
          <FormSectionActions size={size}>
            {actions}
          </FormSectionActions>
        )}
        {collapsible && (
          <div className="flex-shrink-0">
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-atlas-text-tertiary" />
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-atlas-text-tertiary" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});
FormSectionHeader.displayName = 'FormSectionHeader';

const FormSectionContent = React.forwardRef<
  HTMLDivElement,
  FormSectionContentProps
>(({ className, size, collapsible, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(formSectionContentVariants({ size, collapsible, className }))}
    id={collapsible ? 'section-content' : undefined}
    {...props}
  >
    {children}
  </div>
));
FormSectionContent.displayName = 'FormSectionContent';

const FormSection = React.forwardRef<
  HTMLDivElement,
  FormSectionProps
>(({
  className,
  variant,
  size,
  collapsible,
  collapsed = false,
  disabled,
  title,
  description,
  required,
  icon,
  actions,
  showHeader = true,
  onToggle,
  children,
  ...props
}, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
  const sectionId = React.useId();

  React.useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const handleToggle = React.useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  }, [isCollapsed, onToggle]);

  return (
    <div
      ref={ref}
      className={cn(formSectionVariants({ variant, size, collapsible, collapsed: isCollapsed, disabled, className }))}
      aria-labelledby={title ? `${sectionId}-title` : undefined}
      aria-describedby={description ? `${sectionId}-description` : undefined}
      {...props}
    >
      {showHeader && (title || description || icon || actions) && (
        <FormSectionHeader
          variant={variant}
          size={size}
          collapsible={collapsible}
          title={title}
          description={description}
          required={required}
          icon={icon}
          actions={actions}
          collapsed={isCollapsed}
          onToggle={handleToggle}
        />
      )}
      
      <FormSectionContent
        size={size}
        collapsible={collapsible}
      >
        {children}
      </FormSectionContent>
    </div>
  );
});
FormSection.displayName = 'FormSection';

// Additional utility components for advanced form section functionality
const FormSectionContainer = React.forwardRef<
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
        'w-full space-y-4',
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
FormSectionContainer.displayName = 'FormSectionContainer';

const FormSectionSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    showHeader?: boolean;
    fieldCount?: number;
    collapsible?: boolean;
  }
>(({ className, size = 'default', showHeader = true, fieldCount = 3, collapsible = false, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-6',
    default: 'h-8',
    lg: 'h-10',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full border border-atlas-border rounded-lg bg-atlas-card-bg', className)}
      {...props}
    >
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-atlas-border">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 bg-atlas-border-subtle rounded animate-pulse" />
            <div className="h-6 w-32 bg-atlas-border-subtle rounded animate-pulse" />
          </div>
          {collapsible && (
            <div className="h-4 w-4 bg-atlas-border-subtle rounded animate-pulse" />
          )}
        </div>
      )}
      <div className="p-4 space-y-4">
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
FormSectionSkeleton.displayName = 'FormSectionSkeleton';

export {
  FormSection,
  FormSectionHeader,
  FormSectionTitle,
  FormSectionDescription,
  FormSectionActions,
  FormSectionContent,
  FormSectionContainer,
  FormSectionSkeleton,
  formSectionVariants,
  formSectionHeaderVariants,
  formSectionTitleVariants,
  formSectionDescriptionVariants,
  formSectionContentVariants,
  formSectionActionsVariants,
};
