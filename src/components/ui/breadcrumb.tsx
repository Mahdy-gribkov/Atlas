import * as React from 'react';
import { ChevronRightIcon, HomeIcon, SlashIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const breadcrumbVariants = cva(
  'flex items-center space-x-1 text-sm text-atlas-text-secondary',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'text-atlas-text-tertiary',
        outlined: 'border border-atlas-border rounded-lg px-3 py-2 bg-atlas-card-bg',
        ghost: 'bg-atlas-border-subtle rounded-lg px-3 py-2',
      },
      size: {
        sm: 'text-xs space-x-1',
        default: 'text-sm space-x-1',
        lg: 'text-base space-x-2',
      },
      separator: {
        slash: '',
        chevron: '',
        dot: '',
        arrow: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      separator: 'slash',
    },
  }
);

const breadcrumbItemVariants = cva(
  'inline-flex items-center transition-colors',
  {
    variants: {
      variant: {
        default: 'hover:text-atlas-text-primary',
        minimal: 'hover:text-atlas-text-secondary',
        outlined: 'hover:text-atlas-primary-main',
        ghost: 'hover:text-atlas-primary-main',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      current: {
        true: 'text-atlas-text-primary font-medium',
        false: '',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      current: false,
      disabled: false,
    },
  }
);

const breadcrumbSeparatorVariants = cva(
  'flex-shrink-0 text-atlas-text-tertiary',
  {
    variants: {
      variant: {
        default: '',
        minimal: 'text-atlas-text-tertiary',
        outlined: 'text-atlas-text-tertiary',
        ghost: 'text-atlas-text-tertiary',
      },
      size: {
        sm: 'h-3 w-3',
        default: 'h-4 w-4',
        lg: 'h-5 w-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const breadcrumbLinkVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:text-atlas-text-secondary',
        outlined: 'hover:bg-atlas-primary-main hover:text-white',
        ghost: 'hover:bg-atlas-primary-main hover:text-white',
      },
      size: {
        sm: 'text-xs px-1 py-0.5',
        default: 'text-sm px-2 py-1',
        lg: 'text-base px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BreadcrumbProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbVariants> {
  variant?: 'default' | 'minimal' | 'outlined' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  separator?: 'slash' | 'chevron' | 'dot' | 'arrow';
  maxItems?: number;
  showHome?: boolean;
  homeHref?: string;
  homeLabel?: string;
  items: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  current?: boolean;
}

export interface BreadcrumbItemProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof breadcrumbItemVariants> {
  item: BreadcrumbItem;
  isLast?: boolean;
  separator?: React.ReactNode;
}

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof breadcrumbLinkVariants> {
  icon?: React.ReactNode;
}

export interface BreadcrumbSeparatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof breadcrumbSeparatorVariants> {
  separator?: 'slash' | 'chevron' | 'dot' | 'arrow';
}

const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  BreadcrumbSeparatorProps
>(({ className, separator = 'slash', size, variant, ...props }, ref) => {
  const getSeparatorIcon = () => {
    switch (separator) {
      case 'chevron':
        return <ChevronRightIcon className={breadcrumbSeparatorVariants({ size, variant })} />;
      case 'dot':
        return <span className={cn(breadcrumbSeparatorVariants({ size, variant }), 'text-center')}>•</span>;
      case 'arrow':
        return <span className={cn(breadcrumbSeparatorVariants({ size, variant }), 'text-center')}>→</span>;
      case 'slash':
      default:
        return <SlashIcon className={breadcrumbSeparatorVariants({ size, variant })} />;
    }
  };

  return (
    <span
      ref={ref}
      className={cn(breadcrumbSeparatorVariants({ size, variant, className }))}
      aria-hidden="true"
      {...props}
    >
      {getSeparatorIcon()}
    </span>
  );
});
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  BreadcrumbLinkProps
>(({ className, variant, size, icon, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(breadcrumbLinkVariants({ variant, size, className }))}
    {...props}
  >
    {icon && (
      <span className="flex-shrink-0" aria-hidden="true">
        {icon}
      </span>
    )}
    <span className="truncate">{children}</span>
  </a>
));
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbItem = React.forwardRef<
  HTMLElement,
  BreadcrumbItemProps
>(({ className, variant, size, current, disabled, item, isLast, separator, ...props }, ref) => {
  const SeparatorComponent = separator || BreadcrumbSeparator;

  return (
    <>
      <li
        ref={ref}
        className={cn(
          'inline-flex items-center',
          breadcrumbItemVariants({ variant, size, current, disabled, className })
        )}
        aria-current={current ? 'page' : undefined}
        {...props}
      >
        {item.href && !item.disabled ? (
          <BreadcrumbLink
            href={item.href}
            variant={variant}
            size={size}
            icon={item.icon}
          >
            {item.label}
          </BreadcrumbLink>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1">
            {item.icon && (
              <span className="flex-shrink-0" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </span>
        )}
      </li>
      {!isLast && (
        <SeparatorComponent
          variant={variant}
          size={size}
          separator="slash"
        />
      )}
    </>
  );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';

const Breadcrumb = React.forwardRef<
  HTMLElement,
  BreadcrumbProps
>(({
  className,
  variant,
  size,
  separator,
  maxItems,
  showHome = true,
  homeHref = '/',
  homeLabel = 'Home',
  items,
  ...props
}, ref) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [collapsedItems, setCollapsedItems] = React.useState<BreadcrumbItem[]>([]);

  React.useEffect(() => {
    if (maxItems && items.length > maxItems) {
      setIsCollapsed(true);
      const visibleItems = items.slice(-(maxItems - 1));
      const hiddenItems = items.slice(0, -(maxItems - 1));
      setCollapsedItems(hiddenItems);
    } else {
      setIsCollapsed(false);
      setCollapsedItems([]);
    }
  }, [maxItems, items]);

  const renderItems = () => {
    const allItems = [
      ...(showHome ? [{
        label: homeLabel,
        href: homeHref,
        icon: <HomeIcon className="h-4 w-4" />,
      }] : []),
      ...items,
    ];

    if (isCollapsed) {
      const visibleItems = allItems.slice(-(maxItems! - 1));
      const hiddenItems = allItems.slice(0, -(maxItems! - 1));
      
      return (
        <>
          <BreadcrumbItem
            variant={variant}
            size={size}
            item={{
              label: `... (${hiddenItems.length} more)`,
              disabled: true,
            }}
            separator={<BreadcrumbSeparator variant={variant} size={size} separator={separator} />}
          />
          {visibleItems.map((item, index) => (
            <BreadcrumbItem
              key={index}
              variant={variant}
              size={size}
              item={item}
              current={index === visibleItems.length - 1}
              separator={<BreadcrumbSeparator variant={variant} size={size} separator={separator} />}
            />
          ))}
        </>
      );
    }

    return allItems.map((item, index) => (
      <BreadcrumbItem
        key={index}
        variant={variant}
        size={size}
        item={item}
        current={index === allItems.length - 1}
        separator={<BreadcrumbSeparator variant={variant} size={size} separator={separator} />}
      />
    ));
  };

  return (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn(breadcrumbVariants({ variant, size, separator, className }))}
      {...props}
    >
      <ol className="flex items-center space-x-1">
        {renderItems()}
      </ol>
    </nav>
  );
});
Breadcrumb.displayName = 'Breadcrumb';

// Additional utility components for advanced breadcrumb functionality
const BreadcrumbContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'minimal' | 'outlined' | 'ghost';
    size?: 'sm' | 'default' | 'lg';
  }
>(({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-full',
      variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
      variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
      className
    )}
    {...props}
  >
    {children}
  </div>
));
BreadcrumbContainer.displayName = 'BreadcrumbContainer';

const BreadcrumbSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    itemCount?: number;
  }
>(({ className, size = 'default', itemCount = 3, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-3 w-16',
    default: 'h-4 w-20',
    lg: 'h-5 w-24',
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-center space-x-1', className)}
      {...props}
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              'bg-atlas-border-subtle rounded animate-pulse',
              sizeClasses[size]
            )}
          />
          {index < itemCount - 1 && (
            <BreadcrumbSeparator size={size} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});
BreadcrumbSkeleton.displayName = 'BreadcrumbSkeleton';

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbContainer,
  BreadcrumbSkeleton,
  breadcrumbVariants,
  breadcrumbItemVariants,
  breadcrumbLinkVariants,
  breadcrumbSeparatorVariants,
};
