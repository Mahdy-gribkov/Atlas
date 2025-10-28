import * as React from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  SearchIcon,
  FilterIcon,
  MoreHorizontalIcon,
  LoaderIcon,
  CheckIcon,
  XIcon
} from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const dataTableVariants = cva(
  'w-full overflow-hidden rounded-lg border border-atlas-border bg-atlas-card-bg',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg',
        outlined: 'border-2 border-atlas-primary-main bg-atlas-card-bg',
        ghost: 'border-transparent bg-transparent',
        minimal: 'border-atlas-border-subtle bg-atlas-border-subtle',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      striped: {
        true: '',
        false: '',
      },
      hoverable: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      striped: false,
      hoverable: true,
    },
  }
);

const dataTableHeaderVariants = cva(
  'border-b border-atlas-border bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        elevated: 'bg-atlas-card-bg shadow-sm',
        ghost: 'bg-transparent',
        minimal: 'bg-atlas-border-subtle',
      },
      size: {
        sm: 'px-2 py-1',
        default: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const dataTableRowVariants = cva(
  'border-b border-atlas-border-subtle transition-colors',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle',
        elevated: 'hover:bg-atlas-primary-lighter',
        ghost: 'hover:bg-atlas-border-subtle',
        minimal: 'hover:bg-atlas-border-subtle',
      },
      size: {
        sm: 'px-2 py-1',
        default: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
      state: {
        default: '',
        selected: 'bg-atlas-primary-lighter',
        disabled: 'opacity-50 cursor-not-allowed',
      },
      striped: {
        true: 'even:bg-atlas-border-subtle/50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
      striped: false,
    },
  }
);

const dataTableCellVariants = cva(
  'px-4 py-3 text-left align-middle',
  {
    variants: {
      variant: {
        default: '',
        numeric: 'text-right',
        center: 'text-center',
        left: 'text-left',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base',
      },
      state: {
        default: '',
        selected: 'bg-atlas-primary-lighter',
        disabled: 'opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const dataTableHeaderCellVariants = cva(
  'px-4 py-3 text-left font-medium text-atlas-text-primary',
  {
    variants: {
      variant: {
        default: '',
        numeric: 'text-right',
        center: 'text-center',
        left: 'text-left',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base',
      },
      sortable: {
        true: 'cursor-pointer hover:bg-atlas-border-subtle select-none',
        false: '',
      },
      sorted: {
        true: 'bg-atlas-primary-lighter text-atlas-primary-main',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      sortable: false,
      sorted: false,
    },
  }
);

const dataTablePaginationVariants = cva(
  'flex items-center justify-between px-4 py-3 border-t border-atlas-border',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg',
        elevated: 'bg-atlas-border-subtle',
        ghost: 'bg-transparent',
        minimal: 'bg-atlas-border-subtle',
      },
      size: {
        sm: 'px-2 py-2',
        default: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const dataTableFilterVariants = cva(
  'flex items-center gap-2 px-4 py-3 border-b border-atlas-border bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        elevated: 'bg-atlas-card-bg',
        ghost: 'bg-transparent',
        minimal: 'bg-atlas-border-subtle',
      },
      size: {
        sm: 'px-2 py-2',
        default: 'px-4 py-3',
        lg: 'px-6 py-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface DataTableProps<T = any>
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataTableVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  striped?: boolean;
  hoverable?: boolean;
  data: T[];
  columns: DataTableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (row: T, selected: boolean) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  selectable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface DataTableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  sorter?: (a: T, b: T) => number;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: Array<{ label: string; value: any }>;
  filterPlaceholder?: string;
}

export interface DataTableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement>,
    VariantProps<typeof dataTableHeaderVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  children: React.ReactNode;
}

export interface DataTableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof dataTableRowVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'selected' | 'disabled';
  striped?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export interface DataTableCellProps
  extends React.HTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof dataTableCellVariants> {
  variant?: 'default' | 'numeric' | 'center' | 'left';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'selected' | 'disabled';
  children: React.ReactNode;
}

export interface DataTableHeaderCellProps
  extends React.HTMLAttributes<HTMLTableCellElement>,
    VariantProps<typeof dataTableHeaderCellVariants> {
  variant?: 'default' | 'numeric' | 'center' | 'left';
  size?: 'sm' | 'default' | 'lg';
  sortable?: boolean;
  sorted?: boolean;
  sortDirection?: 'asc' | 'desc';
  onSort?: () => void;
  children: React.ReactNode;
}

export interface DataTablePaginationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataTablePaginationVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  showPageSize?: boolean;
  showTotal?: boolean;
}

export interface DataTableFilterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataTableFilterVariants> {
  variant?: 'default' | 'elevated' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  columns: DataTableColumn[];
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  onClearFilters?: () => void;
  showClearButton?: boolean;
}

const DataTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  DataTableHeaderProps
>(({ className, variant, size, children, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(dataTableHeaderVariants({ variant, size, className }))}
    {...props}
  >
    {children}
  </thead>
));
DataTableHeader.displayName = 'DataTableHeader';

const DataTableRow = React.forwardRef<
  HTMLTableRowElement,
  DataTableRowProps
>(({ className, variant, size, state, striped, onClick, children, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(dataTableRowVariants({ variant, size, state, striped, className }))}
    onClick={onClick}
    {...props}
  >
    {children}
  </tr>
));
DataTableRow.displayName = 'DataTableRow';

const DataTableCell = React.forwardRef<
  HTMLTableCellElement,
  DataTableCellProps
>(({ className, variant, size, state, children, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(dataTableCellVariants({ variant, size, state, className }))}
    {...props}
  >
    {children}
  </td>
));
DataTableCell.displayName = 'DataTableCell';

const DataTableHeaderCell = React.forwardRef<
  HTMLTableCellElement,
  DataTableHeaderCellProps
>(({ 
  className, 
  variant, 
  size, 
  sortable, 
  sorted, 
  sortDirection, 
  onSort, 
  children, 
  ...props 
}, ref) => (
  <th
    ref={ref}
    className={cn(dataTableHeaderCellVariants({ variant, size, sortable, sorted, className }))}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-2">
      <span className="flex-1">{children}</span>
      {sortable && (
        <div className="flex flex-col">
          <ArrowUpIcon 
            className={cn(
              'h-3 w-3',
              sorted && sortDirection === 'asc' ? 'text-atlas-primary-main' : 'text-atlas-text-tertiary'
            )}
          />
          <ArrowDownIcon 
            className={cn(
              'h-3 w-3 -mt-1',
              sorted && sortDirection === 'desc' ? 'text-atlas-primary-main' : 'text-atlas-text-tertiary'
            )}
          />
        </div>
      )}
    </div>
  </th>
));
DataTableHeaderCell.displayName = 'DataTableHeaderCell';

const DataTablePagination = React.forwardRef<
  HTMLDivElement,
  DataTablePaginationProps
>(({ 
  className, 
  variant, 
  size, 
  currentPage, 
  totalPages, 
  pageSize, 
  totalItems, 
  onPageChange, 
  onPageSizeChange, 
  showPageSize = true, 
  showTotal = true, 
  ...props 
}, ref) => {
  const getPageInfo = () => {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    return `Showing ${startItem}-${endItem} of ${totalItems} results`;
  };

  return (
    <div
      ref={ref}
      className={cn(dataTablePaginationVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-4">
        {showTotal && (
          <span className="text-sm text-atlas-text-secondary">
            {getPageInfo()}
          </span>
        )}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-atlas-text-secondary">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded border border-atlas-border bg-atlas-card-bg px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded border border-atlas-border bg-atlas-card-bg px-3 py-1 text-sm hover:bg-atlas-border-subtle disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-atlas-text-secondary">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded border border-atlas-border bg-atlas-card-bg px-3 py-1 text-sm hover:bg-atlas-border-subtle disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
});
DataTablePagination.displayName = 'DataTablePagination';

const DataTableFilter = React.forwardRef<
  HTMLDivElement,
  DataTableFilterProps
>(({ 
  className, 
  variant, 
  size, 
  columns, 
  filters, 
  onFilterChange, 
  onClearFilters, 
  showClearButton = true, 
  ...props 
}, ref) => {
  const handleFilterChange = React.useCallback((key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  }, [filters, onFilterChange]);

  const handleClearFilters = React.useCallback(() => {
    onFilterChange({});
    onClearFilters?.();
  }, [onFilterChange, onClearFilters]);

  return (
    <div
      ref={ref}
      className={cn(dataTableFilterVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-4 flex-1">
        {columns
          .filter(col => col.filterable)
          .map(column => (
            <div key={column.key} className="flex items-center gap-2">
              <label className="text-sm font-medium text-atlas-text-primary">
                {column.title}:
              </label>
              {column.filterType === 'select' ? (
                <select
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className="rounded border border-atlas-border bg-atlas-card-bg px-2 py-1 text-sm"
                >
                  <option value="">All</option>
                  {column.filterOptions?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={column.filterType === 'number' ? 'number' : 'text'}
                  placeholder={column.filterPlaceholder || `Filter ${column.title}...`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className="rounded border border-atlas-border bg-atlas-card-bg px-2 py-1 text-sm w-32"
                />
              )}
            </div>
          ))}
      </div>
      {showClearButton && (
        <button
          onClick={handleClearFilters}
          className="flex items-center gap-1 rounded border border-atlas-border bg-atlas-card-bg px-3 py-1 text-sm hover:bg-atlas-border-subtle"
        >
          <XIcon className="h-4 w-4" />
          Clear
        </button>
      )}
    </div>
  );
});
DataTableFilter.displayName = 'DataTableFilter';

const DataTable = React.forwardRef<
  HTMLDivElement,
  DataTableProps
>(({
  className,
  variant,
  size,
  striped,
  hoverable,
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  onRowSelect,
  onSort,
  onFilter,
  selectable = false,
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize = 10,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  ...props
}, ref) => {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = React.useState<Record<string, any>>({});
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());

  const handleSort = React.useCallback((column: string) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
    onSort?.(column, newDirection);
  }, [sortColumn, sortDirection, onSort]);

  const handleFilterChange = React.useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    onFilter?.(newFilters);
  }, [onFilter]);

  const handleRowSelect = React.useCallback((index: number, selected: boolean) => {
    const newSelected = new Set(selectedRows);
    if (selected) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(data[index], selected);
  }, [selectedRows, onRowSelect, data]);

  const handleSelectAll = React.useCallback((selected: boolean) => {
    if (selected) {
      const allIndices = new Set(data.map((_, index) => index));
      setSelectedRows(allIndices);
      data.forEach((row, index) => onRowSelect?.(row, true));
    } else {
      setSelectedRows(new Set());
      data.forEach((row, index) => onRowSelect?.(row, false));
    }
  }, [data, onRowSelect]);

  const filteredData = React.useMemo(() => {
    if (Object.keys(filters).length === 0) return data;
    
    return data.filter(row => {
      return columns.every(column => {
        const filterValue = filters[column.key];
        if (!filterValue) return true;
        
        const cellValue = column.dataIndex ? row[column.dataIndex] : '';
        return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase());
      });
    });
  }, [data, filters, columns]);

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return filteredData;
    
    const column = columns.find(col => col.key === sortColumn);
    if (!column) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = column.dataIndex ? a[column.dataIndex] : '';
      const bValue = column.dataIndex ? b[column.dataIndex] : '';
      
      if (column.sorter) {
        return column.sorter(a, b);
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, columns]);

  const paginatedData = React.useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination, currentPage, pageSize]);

  if (loading) {
    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="flex items-center justify-center h-64">
          <LoaderIcon className="h-8 w-8 animate-spin text-atlas-text-tertiary" />
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn('w-full', className)} {...props}>
      {filterable && (
        <DataTableFilter
          variant={variant}
          size={size}
          columns={columns}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
      
      <div className="overflow-x-auto">
        <table className={cn(dataTableVariants({ variant, size, striped, hoverable }))}>
          <DataTableHeader variant={variant} size={size}>
            <DataTableRow variant={variant} size={size}>
              {selectable && (
                <DataTableHeaderCell variant="center" size={size}>
                  <input
                    type="checkbox"
                    checked={selectedRows.size === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-atlas-border"
                  />
                </DataTableHeaderCell>
              )}
              {columns.map(column => (
                <DataTableHeaderCell
                  key={column.key}
                  variant={column.align}
                  size={size}
                  sortable={sortable && column.sortable !== false}
                  sorted={sortColumn === column.key}
                  sortDirection={sortDirection}
                  onSort={() => handleSort(column.key)}
                >
                  {column.title}
                </DataTableHeaderCell>
              ))}
            </DataTableRow>
          </DataTableHeader>
          
          <tbody>
            {paginatedData.length === 0 ? (
              <DataTableRow variant={variant} size={size}>
                <DataTableCell
                  variant="center"
                  size={size}
                  colSpan={columns.length + (selectable ? 1 : 0)}
                >
                  <div className="py-8 text-center text-atlas-text-tertiary">
                    {emptyMessage}
                  </div>
                </DataTableCell>
              </DataTableRow>
            ) : (
              paginatedData.map((row, index) => (
                <DataTableRow
                  key={index}
                  variant={variant}
                  size={size}
                  state={selectedRows.has(index) ? 'selected' : 'default'}
                  striped={striped}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <DataTableCell variant="center" size={size}>
                      <input
                        type="checkbox"
                        checked={selectedRows.has(index)}
                        onChange={(e) => handleRowSelect(index, e.target.checked)}
                        className="rounded border-atlas-border"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </DataTableCell>
                  )}
                  {columns.map(column => (
                    <DataTableCell
                      key={column.key}
                      variant={column.align}
                      size={size}
                    >
                      {column.render 
                        ? column.render(
                            column.dataIndex ? row[column.dataIndex] : '',
                            row,
                            index
                          )
                        : column.dataIndex 
                          ? row[column.dataIndex]
                          : ''
                      }
                    </DataTableCell>
                  ))}
                </DataTableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {pagination && (
        <DataTablePagination
          variant={variant}
          size={size}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={onPageChange || (() => {})}
        />
      )}
    </div>
  );
});
DataTable.displayName = 'DataTable';

// Additional utility components for advanced data table functionality
const DataTableContainer = React.forwardRef<
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
DataTableContainer.displayName = 'DataTableContainer';

const DataTableSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    rows?: number;
    columns?: number;
  }
>(({ className, size = 'default', rows = 5, columns = 4, ...props }, ref) => {
  const sizeClasses = {
    sm: 'h-6',
    default: 'h-8',
    lg: 'h-10',
  };

  return (
    <div
      ref={ref}
      className={cn('w-full space-y-2', className)}
      {...props}
    >
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-atlas-border">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className={cn('bg-atlas-border-subtle rounded animate-pulse', sizeClasses[size])}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className={cn('bg-atlas-border-subtle rounded animate-pulse', sizeClasses[size])}
            />
          ))}
        </div>
      ))}
    </div>
  );
});
DataTableSkeleton.displayName = 'DataTableSkeleton';

export {
  DataTable,
  DataTableHeader,
  DataTableRow,
  DataTableCell,
  DataTableHeaderCell,
  DataTablePagination,
  DataTableFilter,
  DataTableContainer,
  DataTableSkeleton,
  dataTableVariants,
  dataTableHeaderVariants,
  dataTableRowVariants,
  dataTableCellVariants,
  dataTableHeaderCellVariants,
  dataTablePaginationVariants,
  dataTableFilterVariants,
};
