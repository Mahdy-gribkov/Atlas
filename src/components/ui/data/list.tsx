"use client";

import React, { forwardRef, useState, useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  MoreHorizontalIcon,
  StarIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  DownloadIcon
} from "lucide-react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

// List Root Component
const listVariants = cva(
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
      layout: {
        vertical: "flex flex-col",
        horizontal: "flex flex-row flex-wrap",
        grid: "grid",
        masonry: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
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
      },
      density: {
        compact: "p-2",
        normal: "p-4",
        spacious: "p-6"
      }
    },
    defaultVariants: {
      variant: "default",
      layout: "vertical",
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface ListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listVariants> {
  data?: any[];
  renderItem?: (item: any, index: number) => React.ReactNode;
  keyExtractor?: (item: any, index: number) => string;
  selectable?: boolean;
  expandable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: any, index: number) => void;
  onItemSelect?: (item: any, index: number, selected: boolean) => void;
  onItemExpand?: (item: any, index: number, expanded: boolean) => void;
  onItemAction?: (action: string, item: any, index: number) => void;
  selectedItems?: any[];
  expandedItems?: any[];
  actions?: ListAction[];
  itemProps?: React.HTMLAttributes<HTMLDivElement>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ListAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any, index: number) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: any, index: number) => boolean;
}

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: any;
  index?: number;
  selected?: boolean;
  expanded?: boolean;
  expandable?: boolean;
  selectable?: boolean;
  actions?: ListAction[];
  onItemClick?: (item: any, index: number) => void;
  onItemSelect?: (item: any, index: number, selected: boolean) => void;
  onItemExpand?: (item: any, index: number, expanded: boolean) => void;
  onItemAction?: (action: string, item: any, index: number) => void;
  children?: React.ReactNode;
}

const List = forwardRef<HTMLDivElement, ListProps>(
  ({
    className,
    variant,
    layout,
    size,
    spacing,
    density,
    data = [],
    renderItem,
    keyExtractor,
    selectable = false,
    expandable = false,
    sortable = false,
    filterable = false,
    searchable = false,
    loading = false,
    emptyMessage = "No items available",
    onItemClick,
    onItemSelect,
    onItemExpand,
    onItemAction,
    selectedItems = [],
    expandedItems = [],
    actions = [],
    itemProps,
    header,
    footer,
    ...props
  }, ref) => {
    const [selectedItemsState, setSelectedItemsState] = useState<any[]>(selectedItems);
    const [expandedItemsState, setExpandedItemsState] = useState<any[]>(expandedItems);

    const handleItemClick = (item: any, index: number) => {
      onItemClick?.(item, index);
    };

    const handleItemSelect = (item: any, index: number, selected: boolean) => {
      if (selected) {
        setSelectedItemsState(prev => [...prev, item]);
      } else {
        setSelectedItemsState(prev => prev.filter(i => i !== item));
      }
      onItemSelect?.(item, index, selected);
    };

    const handleItemExpand = (item: any, index: number, expanded: boolean) => {
      if (expanded) {
        setExpandedItemsState(prev => [...prev, item]);
      } else {
        setExpandedItemsState(prev => prev.filter(i => i !== item));
      }
      onItemExpand?.(item, index, expanded);
    };

    const handleItemAction = (action: string, item: any, index: number) => {
      onItemAction?.(action, item, index);
    };

    const isItemSelected = (item: any) => {
      return selectedItemsState.includes(item);
    };

    const isItemExpanded = (item: any) => {
      return expandedItemsState.includes(item);
    };

    const getItemKey = (item: any, index: number) => {
      return keyExtractor ? keyExtractor(item, index) : `item-${index}`;
    };

    const renderListItem = (item: any, index: number) => {
      if (renderItem) {
        return renderItem(item, index);
      }

      return (
        <ListItem
          key={getItemKey(item, index)}
          item={item}
          index={index}
          selected={isItemSelected(item)}
          expanded={isItemExpanded(item)}
          expandable={expandable}
          selectable={selectable}
          actions={actions}
          onItemClick={handleItemClick}
          onItemSelect={handleItemSelect}
          onItemExpand={handleItemExpand}
          onItemAction={handleItemAction}
          {...itemProps}
        >
          {typeof item === 'string' ? item : JSON.stringify(item)}
        </ListItem>
      );
    };

    const getLayoutClasses = () => {
      switch (layout) {
        case 'horizontal':
          return "flex flex-row flex-wrap gap-4";
        case 'grid':
          return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
        case 'masonry':
          return "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4";
        default:
          return cn("flex flex-col", spacing);
      }
    };

    return (
      <div ref={ref} className={cn(listVariants({ variant, layout, size, spacing, density }), className)} {...props}>
        {header && (
          <div className="mb-4">
            {header}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className={getLayoutClasses()}>
            {data.map((item, index) => renderListItem(item, index))}
          </div>
        )}

        {footer && (
          <div className="mt-4">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

List.displayName = "List";

// List Item Component
const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  ({
    className,
    item,
    index = 0,
    selected = false,
    expanded = false,
    expandable = false,
    selectable = false,
    actions = [],
    onItemClick,
    onItemSelect,
    onItemExpand,
    onItemAction,
    children,
    ...props
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
      onItemClick?.(item, index);
    };

    const handleSelect = (checked: boolean) => {
      onItemSelect?.(item, index, checked);
    };

    const handleExpand = () => {
      onItemExpand?.(item, index, !expanded);
    };

    const handleAction = (actionKey: string) => {
      onItemAction?.(actionKey, item, index);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center space-x-3 p-4 rounded-lg border border-border/50 transition-colors",
          "hover:bg-muted/50 hover:border-border",
          selected && "bg-primary/10 border-primary/50",
          "cursor-pointer",
          className
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {selectable && (
          <Checkbox
            checked={selected}
            onCheckedChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select item ${index + 1}`}
          />
        )}

        {expandable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleExpand();
            }}
            className="h-6 w-6 p-0"
          >
            {expanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Button>
        )}

        <div className="flex-1 min-w-0">
          {children}
        </div>

        {actions.length > 0 && (isHovered || selected) && (
          <div className="flex items-center space-x-1">
            {actions.slice(0, 3).map(action => (
              <Button
                key={action.key}
                variant={action.variant || "ghost"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(action.key);
                }}
                disabled={action.disabled?.(item, index)}
                className="h-8 w-8 p-0"
              >
                {action.icon}
              </Button>
            ))}
            {actions.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 w-8 p-0"
                  >
                    <MoreHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.slice(3).map(action => (
                    <DropdownMenuItem
                      key={action.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(action.key);
                      }}
                      disabled={action.disabled?.(item, index)}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    );
  }
);

ListItem.displayName = "ListItem";

// List Sub-components
const ListHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props} />
  )
);
ListHeader.displayName = "ListHeader";

const ListFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props} />
  )
);
ListFooter.displayName = "ListFooter";

const ListContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
ListContent.displayName = "ListContent";

const ListTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-medium text-foreground", className)} {...props} />
  )
);
ListTitle.displayName = "ListTitle";

const ListDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
ListDescription.displayName = "ListDescription";

const ListMeta = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 text-xs text-muted-foreground", className)} {...props} />
  )
);
ListMeta.displayName = "ListMeta";

// List Variants
const ListSolid = forwardRef<HTMLDivElement, ListProps>(
  ({ variant = "default", ...props }, ref) => (
    <List ref={ref} variant={variant} {...props} />
  )
);
ListSolid.displayName = "ListSolid";

const ListTransparent = forwardRef<HTMLDivElement, ListProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <List ref={ref} variant={variant} {...props} />
  )
);
ListTransparent.displayName = "ListTransparent";

const ListGradient = forwardRef<HTMLDivElement, ListProps>(
  ({ className, ...props }, ref) => (
    <List
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
ListGradient.displayName = "ListGradient";

const ListCard = forwardRef<HTMLDivElement, ListProps>(
  ({ variant = "card", ...props }, ref) => (
    <List ref={ref} variant={variant} {...props} />
  )
);
ListCard.displayName = "ListCard";

const ListElevated = forwardRef<HTMLDivElement, ListProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <List ref={ref} variant={variant} {...props} />
  )
);
ListElevated.displayName = "ListElevated";

const ListGlass = forwardRef<HTMLDivElement, ListProps>(
  ({ variant = "glass", ...props }, ref) => (
    <List ref={ref} variant={variant} {...props} />
  )
);
ListGlass.displayName = "ListGlass";

// Layout Variants
const ListVertical = forwardRef<HTMLDivElement, ListProps>(
  ({ layout = "vertical", ...props }, ref) => (
    <List ref={ref} layout={layout} {...props} />
  )
);
ListVertical.displayName = "ListVertical";

const ListHorizontal = forwardRef<HTMLDivElement, ListProps>(
  ({ layout = "horizontal", ...props }, ref) => (
    <List ref={ref} layout={layout} {...props} />
  )
);
ListHorizontal.displayName = "ListHorizontal";

const ListGrid = forwardRef<HTMLDivElement, ListProps>(
  ({ layout = "grid", ...props }, ref) => (
    <List ref={ref} layout={layout} {...props} />
  )
);
ListGrid.displayName = "ListGrid";

const ListMasonry = forwardRef<HTMLDivElement, ListProps>(
  ({ layout = "masonry", ...props }, ref) => (
    <List ref={ref} layout={layout} {...props} />
  )
);
ListMasonry.displayName = "ListMasonry";

// Responsive List
const ListResponsive = forwardRef<HTMLDivElement, ListProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <List {...props} />
    </div>
  )
);
ListResponsive.displayName = "ListResponsive";

// Spacing Utilities
const ListSpacing = {
  tight: "space-y-1",
  normal: "space-y-2",
  loose: "space-y-4"
};

// Density Utilities
const ListDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const ListCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Layout Utilities
const ListLayouts = {
  vertical: "flex flex-col",
  horizontal: "flex flex-row flex-wrap",
  grid: "grid",
  masonry: "columns-1 sm:columns-2 lg:columns-3 xl:columns-4"
};

export {
  List,
  ListItem,
  ListHeader,
  ListFooter,
  ListContent,
  ListTitle,
  ListDescription,
  ListMeta,
  ListSolid,
  ListTransparent,
  ListGradient,
  ListCard,
  ListElevated,
  ListGlass,
  ListVertical,
  ListHorizontal,
  ListGrid,
  ListMasonry,
  ListResponsive,
  ListSpacing,
  ListDensity,
  ListCardVariants,
  ListLayouts,
  listVariants
};
