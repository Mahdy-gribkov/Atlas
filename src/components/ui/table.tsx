"use client";

import React, { forwardRef, useState, useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, FilterIcon, SearchIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";
import { Checkbox } from "./checkbox";

// Table Root Component
const tableVariants = cva(
  "w-full border-collapse",
  {
    variants: {
      variant: {
        default: "bg-background",
        bordered: "border border-border",
        striped: "bg-background",
        hover: "bg-background",
        compact: "bg-background",
        spacious: "bg-background",
        minimal: "bg-transparent",
        card: "bg-card border border-border rounded-lg",
        elevated: "bg-card shadow-lg rounded-lg",
        glass: "bg-background/80 backdrop-blur-sm border border-border/50"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      },
      spacing: {
        tight: "space-y-1",
        normal: "space-y-2",
        loose: "space-y-4"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      spacing: "normal"
    }
  }
);

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  data?: any[];
  columns?: Column[];
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
}

export interface Column {
  key: string;
  title: string;
  dataIndex?: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any, index: number) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: { label: string; value: any }[];
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({
    className,
    variant,
    size,
    spacing,
    data = [],
    columns = [],
    sortable = false,
    filterable = false,
    searchable = false,
    pagination = false,
    pageSize = 10,
    onSort,
    onFilter,
    onSearch,
    onPageChange,
    loading = false,
    emptyMessage = "No data available",
    selectable = false,
    onSelectionChange,
    ...props
  }, ref) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    // Filter and search data
    const filteredData = useMemo(() => {
      let result = [...data];

      // Apply search
      if (searchQuery && searchable) {
        result = result.filter(record =>
          columns.some(column => {
            const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
            return String(value).toLowerCase().includes(searchQuery.toLowerCase());
          })
        );
      }

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          result = result.filter(record => {
            const recordValue = record[key];
            if (typeof value === 'string') {
              return String(recordValue).toLowerCase().includes(value.toLowerCase());
            }
            return recordValue === value;
          });
        }
      });

      return result;
    }, [data, searchQuery, filters, columns, searchable]);

    // Sort data
    const sortedData = useMemo(() => {
      if (!sortColumn || !sortable) return filteredData;

      return [...filteredData].sort((a, b) => {
        const column = columns.find(col => col.key === sortColumn);
        if (column?.sorter) {
          return column.sorter(a, b) * (sortDirection === 'asc' ? 1 : -1);
        }

        const aValue = column?.dataIndex ? a[column.dataIndex] : a[sortColumn];
        const bValue = column?.dataIndex ? b[column.dataIndex] : b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }, [filteredData, sortColumn, sortDirection, columns, sortable]);

    // Paginate data
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;

      const startIndex = (currentPage - 1) * pageSize;
      return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleSort = (columnKey: string) => {
      if (!sortable) return;

      const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortColumn(columnKey);
      setSortDirection(newDirection);
      onSort?.(columnKey, newDirection);
    };

    const handleFilter = (columnKey: string, value: any) => {
      const newFilters = { ...filters, [columnKey]: value };
      setFilters(newFilters);
      onFilter?.(newFilters);
    };

    const handleSearch = (query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    };

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
      onPageChange?.(page);
    };

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedRows([...paginatedData]);
      } else {
        setSelectedRows([]);
      }
      onSelectionChange?.(checked ? paginatedData : []);
    };

    const handleSelectRow = (record: any, checked: boolean) => {
      let newSelection;
      if (checked) {
        newSelection = [...selectedRows, record];
      } else {
        newSelection = selectedRows.filter(row => row !== record);
      }
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    };

    const isRowSelected = (record: any) => {
      return selectedRows.includes(record);
    };

    const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;

    return (
      <div className="w-full">
        {/* Search and Filters */}
        {(searchable || filterable) && (
          <div className="mb-4 space-y-4">
            {searchable && (
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}
            
            {filterable && (
              <div className="flex flex-wrap gap-2">
                {columns.filter(col => col.filterable).map(column => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{column.title}:</span>
                    {column.filterType === 'select' && column.filterOptions ? (
                      <Select
                        value={filters[column.key] || ''}
                        onValueChange={(value) => handleFilter(column.key, value)}
                      >
                        <option value="">All</option>
                        {column.filterOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        placeholder={`Filter by ${column.title}`}
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilter(column.key, e.target.value)}
                        className="w-48"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            ref={ref}
            className={cn(tableVariants({ variant, size, spacing }), className)}
            {...props}
          >
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                )}
                {columns.map(column => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "text-left font-medium",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right",
                      column.width && `w-[${column.width}]`
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <span>{column.title}</span>
                      {sortable && column.sortable !== false && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort(column.key)}
                          className="h-6 w-6 p-0"
                        >
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4" />
                            )
                          ) : (
                            <FilterIcon className="h-4 w-4 opacity-50" />
                          )}
                        </Button>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((record, index) => (
                  <TableRow key={index}>
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={isRowSelected(record)}
                          onCheckedChange={(checked) => handleSelectRow(record, checked as boolean)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </TableCell>
                    )}
                    {columns.map(column => (
                      <TableCell
                        key={column.key}
                        className={cn(
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(
                              column.dataIndex ? record[column.dataIndex] : record[column.key],
                              record,
                              index
                            )
                          : column.dataIndex
                          ? record[column.dataIndex]
                          : record[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = "Table";

// Table Sub-components
const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-muted/50", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("divide-y divide-border", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("bg-muted/50 font-medium", className)} {...props} />
));
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// Table Utility Components
const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Table Variants
const TableSolid = forwardRef<HTMLTableElement, TableProps>(
  ({ variant = "default", ...props }, ref) => (
    <Table ref={ref} variant={variant} {...props} />
  )
);
TableSolid.displayName = "TableSolid";

const TableTransparent = forwardRef<HTMLTableElement, TableProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Table ref={ref} variant={variant} {...props} />
  )
);
TableTransparent.displayName = "TableTransparent";

const TableGradient = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <Table
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
TableGradient.displayName = "TableGradient";

const TableCard = forwardRef<HTMLTableElement, TableProps>(
  ({ variant = "card", ...props }, ref) => (
    <Table ref={ref} variant={variant} {...props} />
  )
);
TableCard.displayName = "TableCard";

const TableElevated = forwardRef<HTMLTableElement, TableProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Table ref={ref} variant={variant} {...props} />
  )
);
TableElevated.displayName = "TableElevated";

const TableGlass = forwardRef<HTMLTableElement, TableProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Table ref={ref} variant={variant} {...props} />
  )
);
TableGlass.displayName = "TableGlass";

// Responsive Table
const TableResponsive = forwardRef<HTMLDivElement, TableProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
  ({ breakpoint = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-x-auto",
        breakpoint === 'sm' && "sm:overflow-x-visible",
        breakpoint === 'md' && "md:overflow-x-visible",
        breakpoint === 'lg' && "lg:overflow-x-visible",
        breakpoint === 'xl' && "xl:overflow-x-visible",
        className
      )}
    >
      <Table {...props} />
    </div>
  )
);
TableResponsive.displayName = "TableResponsive";

// Spacing Utilities
const TableSpacing = {
  tight: "space-y-1",
  normal: "space-y-2",
  loose: "space-y-4"
};

// Card Variants
const TableCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Section Variants
const TableSectionVariants = {
  header: "bg-muted/50",
  body: "divide-y divide-border",
  footer: "bg-muted/50 font-medium"
};

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableSolid,
  TableTransparent,
  TableGradient,
  TableCard,
  TableElevated,
  TableGlass,
  TableResponsive,
  TableSpacing,
  TableCardVariants,
  TableSectionVariants,
  tableVariants
};
