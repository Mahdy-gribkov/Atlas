"use client";

import React, { forwardRef, useState, useMemo, useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  FilterIcon, 
  SearchIcon,
  SettingsIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  MoreHorizontalIcon
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";
import { Checkbox } from "./checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Modal } from "./modal";

// DataGrid Root Component
const dataGridVariants = cva(
  "w-full",
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
      density: {
        compact: "p-2",
        normal: "p-4",
        spacious: "p-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      density: "normal"
    }
  }
);

export interface DataGridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataGridVariants> {
  data?: any[];
  columns?: DataGridColumn[];
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  selectable?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  virtualized?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onDataChange?: (data: any[]) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<string, any>) => void;
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onSelectionChange?: (selectedRows: any[]) => void;
  onColumnResize?: (column: string, width: number) => void;
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;
  onRowAdd?: (row: any) => void;
  onRowEdit?: (row: any, index: number) => void;
  onRowDelete?: (row: any, index: number) => void;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface DataGridColumn {
  key: string;
  title: string;
  dataIndex?: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  editable?: boolean;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
  hidden?: boolean;
  render?: (value: any, record: any, index: number) => React.ReactNode;
  editRender?: (value: any, record: any, index: number, onChange: (value: any) => void) => React.ReactNode;
  sorter?: (a: any, b: any) => number;
  filterType?: 'text' | 'select' | 'date' | 'number' | 'boolean';
  filterOptions?: { label: string; value: any }[];
  validation?: (value: any) => string | null;
  required?: boolean;
}

const DataGrid = forwardRef<HTMLDivElement, DataGridProps>(
  ({
    className,
    variant,
    size,
    density,
    data = [],
    columns = [],
    editable = false,
    sortable = false,
    filterable = false,
    searchable = false,
    pagination = false,
    pageSize = 10,
    selectable = false,
    resizable = false,
    reorderable = false,
    virtualized = false,
    loading = false,
    emptyMessage = "No data available",
    onDataChange,
    onSort,
    onFilter,
    onSearch,
    onPageChange,
    onSelectionChange,
    onColumnResize,
    onColumnReorder,
    onRowAdd,
    onRowEdit,
    onRowDelete,
    toolbar,
    footer,
    ...props
  }, ref) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [editingRow, setEditingRow] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<any>({});
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    const [showColumnSettings, setShowColumnSettings] = useState(false);

    // Initialize column order and visibility
    React.useEffect(() => {
      const order = columns.map(col => col.key);
      setColumnOrder(order);
      setVisibleColumns(order.filter(key => !columns.find(col => col.key === key)?.hidden));
    }, [columns]);

    // Get visible columns in correct order
    const orderedColumns = useMemo(() => {
      return visibleColumns
        .map(key => columns.find(col => col.key === key))
        .filter(Boolean) as DataGridColumn[];
    }, [columns, visibleColumns]);

    // Filter and search data
    const filteredData = useMemo(() => {
      let result = [...data];

      // Apply search
      if (searchQuery && searchable) {
        result = result.filter(record =>
          orderedColumns.some(column => {
            if (!column.searchable) return false;
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
    }, [data, searchQuery, filters, orderedColumns, searchable]);

    // Sort data
    const sortedData = useMemo(() => {
      if (!sortColumn || !sortable) return filteredData;

      return [...filteredData].sort((a, b) => {
        const column = orderedColumns.find(col => col.key === sortColumn);
        if (column?.sorter) {
          return column.sorter(a, b) * (sortDirection === 'asc' ? 1 : -1);
        }

        const aValue = column?.dataIndex ? a[column.dataIndex] : a[sortColumn];
        const bValue = column?.dataIndex ? b[column.dataIndex] : b[sortColumn];

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }, [filteredData, sortColumn, sortDirection, orderedColumns, sortable]);

    // Paginate data
    const paginatedData = useMemo(() => {
      if (!pagination) return sortedData;

      const startIndex = (currentPage - 1) * pageSize;
      return sortedData.slice(startIndex, startIndex + pageSize);
    }, [sortedData, currentPage, pageSize, pagination]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    const handleSort = useCallback((columnKey: string) => {
      if (!sortable) return;

      const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
      setSortColumn(columnKey);
      setSortDirection(newDirection);
      onSort?.(columnKey, newDirection);
    }, [sortable, sortColumn, sortDirection, onSort]);

    const handleFilter = useCallback((columnKey: string, value: any) => {
      const newFilters = { ...filters, [columnKey]: value };
      setFilters(newFilters);
      onFilter?.(newFilters);
    }, [filters, onFilter]);

    const handleSearch = useCallback((query: string) => {
      setSearchQuery(query);
      onSearch?.(query);
    }, [onSearch]);

    const handlePageChange = useCallback((page: number) => {
      setCurrentPage(page);
      onPageChange?.(page);
    }, [onPageChange]);

    const handleSelectAll = useCallback((checked: boolean) => {
      if (checked) {
        setSelectedRows([...paginatedData]);
      } else {
        setSelectedRows([]);
      }
      onSelectionChange?.(checked ? paginatedData : []);
    }, [paginatedData, onSelectionChange]);

    const handleSelectRow = useCallback((record: any, checked: boolean) => {
      let newSelection;
      if (checked) {
        newSelection = [...selectedRows, record];
      } else {
        newSelection = selectedRows.filter(row => row !== record);
      }
      setSelectedRows(newSelection);
      onSelectionChange?.(newSelection);
    }, [selectedRows, onSelectionChange]);

    const handleEdit = useCallback((record: any, index: number) => {
      setEditingRow(index);
      setEditingData({ ...record });
    }, []);

    const handleSave = useCallback(() => {
      if (editingRow === null) return;

      const newData = [...data];
      newData[editingRow] = { ...editingData };
      
      onDataChange?.(newData);
      onRowEdit?.(editingData, editingRow);
      
      setEditingRow(null);
      setEditingData({});
    }, [editingRow, editingData, data, onDataChange, onRowEdit]);

    const handleCancel = useCallback(() => {
      setEditingRow(null);
      setEditingData({});
    }, []);

    const handleDelete = useCallback((record: any, index: number) => {
      const newData = data.filter((_, i) => i !== index);
      onDataChange?.(newData);
      onRowDelete?.(record, index);
    }, [data, onDataChange, onRowDelete]);

    const handleAddRow = useCallback(() => {
      const newRow = orderedColumns.reduce((acc, col) => {
        acc[col.key] = col.required ? '' : null;
        return acc;
      }, {} as any);
      
      const newData = [...data, newRow];
      onDataChange?.(newData);
      onRowAdd?.(newRow);
      
      // Start editing the new row
      setEditingRow(newData.length - 1);
      setEditingData(newRow);
    }, [data, orderedColumns, onDataChange, onRowAdd]);

    const handleColumnResize = useCallback((columnKey: string, width: number) => {
      setColumnWidths(prev => ({ ...prev, [columnKey]: width }));
      onColumnResize?.(columnKey, width);
    }, [onColumnResize]);

    const handleColumnReorder = useCallback((fromIndex: number, toIndex: number) => {
      const newOrder = [...visibleColumns];
      const [removed] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, removed);
      
      setVisibleColumns(newOrder);
      onColumnReorder?.(fromIndex, toIndex);
    }, [visibleColumns, onColumnReorder]);

    const toggleColumnVisibility = useCallback((columnKey: string) => {
      setVisibleColumns(prev => 
        prev.includes(columnKey) 
          ? prev.filter(key => key !== columnKey)
          : [...prev, columnKey]
      );
    }, []);

    const isRowSelected = (record: any) => {
      return selectedRows.includes(record);
    };

    const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;

    return (
      <div ref={ref} className={cn(dataGridVariants({ variant, size, density }), className)} {...props}>
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}
            
            {editable && (
              <Button onClick={handleAddRow} size="sm">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {columns.map(column => (
                  <DropdownMenuItem
                    key={column.key}
                    onClick={() => toggleColumnVisibility(column.key)}
                    className="flex items-center space-x-2"
                  >
                    {visibleColumns.includes(column.key) ? (
                      <EyeIcon className="h-4 w-4" />
                    ) : (
                      <EyeOffIcon className="h-4 w-4" />
                    )}
                    <span>{column.title}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {toolbar}
          </div>
        </div>

        {/* Filters */}
        {filterable && (
          <div className="mb-4 flex flex-wrap gap-2">
            {orderedColumns.filter(col => col.filterable).map(column => (
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

        {/* Data Grid */}
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-muted/50">
              <tr>
                {selectable && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {editable && (
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-16">
                    Actions
                  </th>
                )}
                {orderedColumns.map(column => (
                  <th
                    key={column.key}
                    className={cn(
                      "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right",
                      column.fixed === 'left' && "sticky left-0 bg-muted/50 z-10",
                      column.fixed === 'right' && "sticky right-0 bg-muted/50 z-10"
                    )}
                    style={{ width: columnWidths[column.key] || column.width }}
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
                      {resizable && (
                        <div className="w-1 h-4 bg-border cursor-col-resize" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={orderedColumns.length + (selectable ? 1 : 0) + (editable ? 1 : 0)} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={orderedColumns.length + (selectable ? 1 : 0) + (editable ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((record, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    {selectable && (
                      <td className="p-4">
                        <Checkbox
                          checked={isRowSelected(record)}
                          onCheckedChange={(checked) => handleSelectRow(record, checked as boolean)}
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {editable && (
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {editingRow === index ? (
                            <>
                              <Button size="sm" onClick={handleSave}>
                                <SaveIcon className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancel}>
                                <XIcon className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(record, index)}>
                                <EditIcon className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => handleDelete(record, index)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                    {orderedColumns.map(column => (
                      <td
                        key={column.key}
                        className={cn(
                          "p-4 align-middle",
                          column.align === 'center' && "text-center",
                          column.align === 'right' && "text-right",
                          column.fixed === 'left' && "sticky left-0 bg-background z-10",
                          column.fixed === 'right' && "sticky right-0 bg-background z-10"
                        )}
                        style={{ width: columnWidths[column.key] || column.width }}
                      >
                        {editingRow === index && column.editable ? (
                          column.editRender ? (
                            column.editRender(
                              column.dataIndex ? editingData[column.dataIndex] : editingData[column.key],
                              editingData,
                              index,
                              (value) => setEditingData(prev => ({
                                ...prev,
                                [column.dataIndex || column.key]: value
                              }))
                            )
                          ) : (
                            <Input
                              value={column.dataIndex ? editingData[column.dataIndex] : editingData[column.key] || ''}
                              onChange={(e) => setEditingData(prev => ({
                                ...prev,
                                [column.dataIndex || column.key]: e.target.value
                              }))}
                              className="w-full"
                            />
                          )
                        ) : column.render ? (
                          column.render(
                            column.dataIndex ? record[column.dataIndex] : record[column.key],
                            record,
                            index
                          )
                        ) : (
                          column.dataIndex ? record[column.dataIndex] : record[column.key]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
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

        {/* Footer */}
        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

DataGrid.displayName = "DataGrid";

// DataGrid Utility Components
const DataGridToolbar = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between mb-4", className)} {...props} />
  )
);
DataGridToolbar.displayName = "DataGridToolbar";

const DataGridFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props} />
  )
);
DataGridFooter.displayName = "DataGridFooter";

// DataGrid Variants
const DataGridSolid = forwardRef<HTMLDivElement, DataGridProps>(
  ({ variant = "default", ...props }, ref) => (
    <DataGrid ref={ref} variant={variant} {...props} />
  )
);
DataGridSolid.displayName = "DataGridSolid";

const DataGridTransparent = forwardRef<HTMLDivElement, DataGridProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <DataGrid ref={ref} variant={variant} {...props} />
  )
);
DataGridTransparent.displayName = "DataGridTransparent";

const DataGridGradient = forwardRef<HTMLDivElement, DataGridProps>(
  ({ className, ...props }, ref) => (
    <DataGrid
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
DataGridGradient.displayName = "DataGridGradient";

const DataGridCard = forwardRef<HTMLDivElement, DataGridProps>(
  ({ variant = "card", ...props }, ref) => (
    <DataGrid ref={ref} variant={variant} {...props} />
  )
);
DataGridCard.displayName = "DataGridCard";

const DataGridElevated = forwardRef<HTMLDivElement, DataGridProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <DataGrid ref={ref} variant={variant} {...props} />
  )
);
DataGridElevated.displayName = "DataGridElevated";

const DataGridGlass = forwardRef<HTMLDivElement, DataGridProps>(
  ({ variant = "glass", ...props }, ref) => (
    <DataGrid ref={ref} variant={variant} {...props} />
  )
);
DataGridGlass.displayName = "DataGridGlass";

// Responsive DataGrid
const DataGridResponsive = forwardRef<HTMLDivElement, DataGridProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <DataGrid {...props} />
    </div>
  )
);
DataGridResponsive.displayName = "DataGridResponsive";

// Density Utilities
const DataGridDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const DataGridCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Section Variants
const DataGridSectionVariants = {
  header: "bg-muted/50",
  body: "divide-y divide-border",
  footer: "bg-muted/50 font-medium"
};

export {
  DataGrid,
  DataGridToolbar,
  DataGridFooter,
  DataGridSolid,
  DataGridTransparent,
  DataGridGradient,
  DataGridCard,
  DataGridElevated,
  DataGridGlass,
  DataGridResponsive,
  DataGridDensity,
  DataGridCardVariants,
  DataGridSectionVariants,
  dataGridVariants
};
