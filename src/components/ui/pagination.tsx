import * as React from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronsLeftIcon, 
  ChevronsRightIcon,
  MoreHorizontalIcon
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const paginationVariants = cva(
  'flex items-center justify-center',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border border-atlas-border rounded-lg p-2 bg-atlas-card-bg',
        ghost: 'bg-atlas-border-subtle rounded-lg p-2',
        minimal: 'text-atlas-text-tertiary',
      },
      size: {
        sm: 'gap-1',
        default: 'gap-2',
        lg: 'gap-3',
      },
      alignment: {
        left: 'justify-start',
        center: 'justify-center',
        right: 'justify-end',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      alignment: 'center',
    },
  }
);

const paginationItemVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-atlas-border bg-atlas-card-bg hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        outlined: 'border border-atlas-border bg-transparent hover:bg-atlas-primary-main hover:text-white hover:border-atlas-primary-main',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:text-atlas-text-primary',
      },
      size: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
      state: {
        default: '',
        active: 'bg-atlas-primary-main text-white border-atlas-primary-main hover:bg-atlas-primary-light',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const paginationButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-atlas-border bg-atlas-card-bg hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        outlined: 'border border-atlas-border bg-transparent hover:bg-atlas-primary-main hover:text-white hover:border-atlas-primary-main',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:text-atlas-text-primary',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
      iconOnly: {
        true: 'w-8 px-0',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      iconOnly: false,
    },
  }
);

const paginationInfoVariants = cva(
  'text-sm text-atlas-text-secondary',
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

export interface PaginationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  alignment?: 'left' | 'center' | 'right' | 'between';
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showInfo?: boolean;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  siblingCount?: number;
  boundaryCount?: number;
  disabled?: boolean;
  hideOnSinglePage?: boolean;
}

export interface PaginationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationItemVariants> {
  page: number;
  isActive?: boolean;
  isDisabled?: boolean;
}

export interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationButtonVariants> {
  icon?: React.ReactNode;
  iconOnly?: boolean;
}

export interface PaginationInfoProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationInfoVariants> {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
}

const PaginationItem = React.forwardRef<
  HTMLButtonElement,
  PaginationItemProps
>(({ className, variant, size, state, page, isActive, isDisabled, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      paginationItemVariants({ 
        variant, 
        size, 
        state: isActive ? 'active' : isDisabled ? 'disabled' : state,
        className 
      })
    )}
    disabled={isDisabled}
    aria-current={isActive ? 'page' : undefined}
    aria-label={`Go to page ${page}`}
    {...props}
  >
    {page}
  </button>
));
PaginationItem.displayName = 'PaginationItem';

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(({ className, variant, size, iconOnly, icon, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(paginationButtonVariants({ variant, size, iconOnly, className }))}
    {...props}
  >
    {icon && (
      <span className={iconOnly ? '' : 'mr-1'} aria-hidden="true">
        {icon}
      </span>
    )}
    {children}
  </button>
));
PaginationButton.displayName = 'PaginationButton';

const PaginationInfo = React.forwardRef<
  HTMLDivElement,
  PaginationInfoProps
>(({ className, size, currentPage, totalPages, totalItems, itemsPerPage, ...props }, ref) => {
  const getInfoText = () => {
    if (totalItems && itemsPerPage) {
      const startItem = (currentPage - 1) * itemsPerPage + 1;
      const endItem = Math.min(currentPage * itemsPerPage, totalItems);
      return `Showing ${startItem}-${endItem} of ${totalItems} results`;
    }
    return `Page ${currentPage} of ${totalPages}`;
  };

  return (
    <div
      ref={ref}
      className={cn(paginationInfoVariants({ size, className }))}
      {...props}
    >
      {getInfoText()}
    </div>
  );
});
PaginationInfo.displayName = 'PaginationInfo';

const Pagination = React.forwardRef<
  HTMLDivElement,
  PaginationProps
>(({
  className,
  variant,
  size,
  alignment,
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showInfo = false,
  showPageNumbers = true,
  maxVisiblePages = 7,
  siblingCount = 1,
  boundaryCount = 1,
  disabled = false,
  hideOnSinglePage = true,
  ...props
}, ref) => {
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handlePageChange = React.useCallback((page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) return;
    
    setIsNavigating(true);
    onPageChange(page);
    
    // Reset navigation state after a short delay
    setTimeout(() => setIsNavigating(false), 150);
  }, [disabled, totalPages, currentPage, onPageChange]);

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const totalVisiblePages = Math.min(maxVisiblePages, totalPages);
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range to show
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - boundaryCount - 1;
      
      // Add boundary pages
      for (let i = 1; i <= boundaryCount; i++) {
        pages.push(i);
      }
      
      // Add left ellipsis if needed
      if (shouldShowLeftEllipsis) {
        pages.push('ellipsis');
      }
      
      // Add sibling pages
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i > boundaryCount && i < totalPages - boundaryCount + 1) {
          pages.push(i);
        }
      }
      
      // Add right ellipsis if needed
      if (shouldShowRightEllipsis) {
        pages.push('ellipsis');
      }
      
      // Add right boundary pages
      for (let i = totalPages - boundaryCount + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (hideOnSinglePage && totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div
      ref={ref}
      className={cn(paginationVariants({ variant, size, alignment, className }))}
      {...props}
    >
      {showInfo && (
        <PaginationInfo
          size={size}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      )}
      
      <nav aria-label="Pagination Navigation" className="flex items-center">
        {showFirstLast && (
          <PaginationButton
            variant={variant}
            size={size}
            iconOnly
            icon={<ChevronsLeftIcon className="h-4 w-4" />}
            onClick={() => handlePageChange(1)}
            disabled={disabled || currentPage === 1}
            aria-label="Go to first page"
          />
        )}
        
        {showPrevNext && (
          <PaginationButton
            variant={variant}
            size={size}
            iconOnly
            icon={<ChevronLeftIcon className="h-4 w-4" />}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={disabled || currentPage === 1}
            aria-label="Go to previous page"
          />
        )}
        
        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-10 w-10 items-center justify-center text-atlas-text-tertiary"
                    aria-hidden="true"
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </span>
                );
              }
              
              return (
                <PaginationItem
                  key={page}
                  variant={variant}
                  size={size}
                  page={page}
                  isActive={page === currentPage}
                  isDisabled={disabled}
                  onClick={() => handlePageChange(page)}
                />
              );
            })}
          </div>
        )}
        
        {showPrevNext && (
          <PaginationButton
            variant={variant}
            size={size}
            iconOnly
            icon={<ChevronRightIcon className="h-4 w-4" />}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={disabled || currentPage === totalPages}
            aria-label="Go to next page"
          />
        )}
        
        {showFirstLast && (
          <PaginationButton
            variant={variant}
            size={size}
            iconOnly
            icon={<ChevronsRightIcon className="h-4 w-4" />}
            onClick={() => handlePageChange(totalPages)}
            disabled={disabled || currentPage === totalPages}
            aria-label="Go to last page"
          />
        )}
      </nav>
      
      {isNavigating && (
        <div className="sr-only" aria-live="polite">
          Navigating to page {currentPage}
        </div>
      )}
    </div>
  );
});
Pagination.displayName = 'Pagination';

// Additional utility components for advanced pagination functionality
const PaginationContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
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
PaginationContainer.displayName = 'PaginationContainer';

const PaginationSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    itemCount?: number;
  }
>(({ className, size = 'default', itemCount = 5, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    default: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-center justify-center gap-2', className)}
      {...props}
    >
      {Array.from({ length: itemCount }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-atlas-border-subtle rounded-md animate-pulse',
            sizeClasses[size]
          )}
        />
      ))}
    </div>
  );
});
PaginationSkeleton.displayName = 'PaginationSkeleton';

export {
  Pagination,
  PaginationItem,
  PaginationButton,
  PaginationInfo,
  PaginationContainer,
  PaginationSkeleton,
  paginationVariants,
  paginationItemVariants,
  paginationButtonVariants,
  paginationInfoVariants,
};
