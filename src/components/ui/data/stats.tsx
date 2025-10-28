"use client";

import React, { forwardRef, useState, useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowRightIcon,
  BarChartIcon,
  PieChartIcon,
  LineChartIcon,
  ActivityIcon,
  UsersIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  MoreHorizontalIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

// Stats Root Component
const statsVariants = cva(
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
        grid: "grid",
        flex: "flex",
        vertical: "flex flex-col",
        horizontal: "flex flex-row"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      },
      spacing: {
        tight: "space-y-2",
        normal: "space-y-4",
        loose: "space-y-6"
      },
      density: {
        compact: "p-2",
        normal: "p-4",
        spacious: "p-6"
      }
    },
    defaultVariants: {
      variant: "default",
      layout: "grid",
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface StatsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statsVariants> {
  data?: StatItem[];
  columns?: number;
  showTrends?: boolean;
  showComparisons?: boolean;
  showCharts?: boolean;
  chartType?: 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'radar';
  loading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: StatItem, index: number) => void;
  renderItem?: (item: StatItem, index: number) => React.ReactNode;
  renderChart?: (item: StatItem, index: number) => React.ReactNode;
  actions?: StatAction[];
}

export interface StatItem {
  id: string;
  title: string;
  value: number | string;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'custom';
  icon?: React.ReactNode;
  color?: string;
  description?: string;
  chartData?: ChartData[];
  comparison?: ComparisonData;
  data?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
}

export interface ComparisonData {
  period: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface StatAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: StatItem, index: number) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: StatItem, index: number) => boolean;
}

const Stats = forwardRef<HTMLDivElement, StatsProps>(
  ({
    className,
    variant,
    layout,
    size,
    spacing,
    density,
    data = [],
    columns = 4,
    showTrends = true,
    showComparisons = true,
    showCharts = false,
    chartType = 'bar',
    loading = false,
    emptyMessage = "No statistics available",
    onItemClick,
    renderItem,
    renderChart,
    actions = [],
    ...props
  }, ref) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const formatValue = (value: number | string, format?: string) => {
      if (typeof value === 'string') return value;
      
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value);
        case 'percentage':
          return `${value}%`;
        case 'duration':
          return `${value}s`;
        case 'custom':
          return value.toString();
        default:
          return new Intl.NumberFormat('en-US').format(value);
      }
    };

    const getTrendIcon = (trend?: string) => {
      switch (trend) {
        case 'up':
          return <TrendingUpIcon className="h-4 w-4 text-green-500" />;
        case 'down':
          return <TrendingDownIcon className="h-4 w-4 text-red-500" />;
        case 'stable':
          return <MinusIcon className="h-4 w-4 text-yellow-500" />;
        default:
          return null;
      }
    };

    const getChangeIcon = (changeType?: string) => {
      switch (changeType) {
        case 'increase':
          return <ArrowUpIcon className="h-3 w-3 text-green-500" />;
        case 'decrease':
          return <ArrowDownIcon className="h-3 w-3 text-red-500" />;
        case 'neutral':
          return <ArrowRightIcon className="h-3 w-3 text-yellow-500" />;
        default:
          return null;
      }
    };

    const getChangeColor = (changeType?: string) => {
      switch (changeType) {
        case 'increase':
          return 'text-green-500';
        case 'decrease':
          return 'text-red-500';
        case 'neutral':
          return 'text-yellow-500';
        default:
          return 'text-muted-foreground';
      }
    };

    const handleItemClick = (item: StatItem, index: number) => {
      setSelectedItem(item.id);
      onItemClick?.(item, index);
    };

    const handleAction = (actionKey: string, item: StatItem, index: number) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(item, index);
    };

    const renderStatItem = (item: StatItem, index: number) => {
      if (renderItem) {
        return renderItem(item, index);
      }

      const isSelected = selectedItem === item.id;
      const changeValue = item.change !== undefined ? Math.abs(item.change) : 0;

      return (
        <div
          key={item.id}
          className={cn(
            "p-4 rounded-lg border border-border/50 transition-colors",
            "hover:bg-muted/50 hover:border-border",
            isSelected && "bg-primary/10 border-primary/50",
            "cursor-pointer",
            item.className
          )}
          onClick={() => handleItemClick(item, index)}
          style={item.style}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                {item.icon && (
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                )}
                <h3 className="font-medium text-foreground truncate">
                  {item.title}
                </h3>
              </div>

              <div className="mb-2">
                <div className="text-2xl font-bold text-foreground">
                  {formatValue(item.value, item.format)}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
              </div>

              {/* Trend and Change */}
              {(showTrends || showComparisons) && (
                <div className="flex items-center space-x-4 text-sm">
                  {showTrends && item.trend && (
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(item.trend)}
                      <span className="capitalize">{item.trend}</span>
                    </div>
                  )}
                  
                  {showComparisons && item.change !== undefined && (
                    <div className={cn("flex items-center space-x-1", getChangeColor(item.changeType))}>
                      {getChangeIcon(item.changeType)}
                      <span>
                        {item.changeType === 'increase' ? '+' : item.changeType === 'decrease' ? '-' : ''}
                        {formatValue(changeValue, item.format)}
                      </span>
                    </div>
                  )}

                  {item.previousValue && (
                    <div className="text-xs text-muted-foreground">
                      vs {formatValue(item.previousValue, item.format)}
                    </div>
                  )}
                </div>
              )}

              {/* Chart */}
              {showCharts && item.chartData && item.chartData.length > 0 && (
                <div className="mt-4">
                  {renderChart ? renderChart(item, index) : (
                    <div className="h-16 bg-muted/50 rounded flex items-end space-x-1 p-2">
                      {item.chartData.map((data, idx) => (
                        <div
                          key={idx}
                          className="bg-primary rounded-sm flex-1"
                          style={{ 
                            height: `${(data.value / Math.max(...item.chartData!.map(d => d.value))) * 100}%`,
                            backgroundColor: data.color || 'hsl(var(--primary))'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center space-x-1 ml-4">
                {actions.slice(0, 2).map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "ghost"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAction(action.key, item, index);
                    }}
                    disabled={action.disabled?.(item, index)}
                    className="h-6 w-6 p-0"
                  >
                    {action.icon}
                  </Button>
                ))}
                {actions.length > 2 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                        className="h-6 w-6 p-0"
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.slice(2).map(action => (
                        <DropdownMenuItem
                          key={action.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction(action.key, item, index);
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
        </div>
      );
    };

    const getLayoutClasses = () => {
      switch (layout) {
        case 'flex':
          return "flex flex-wrap gap-4";
        case 'vertical':
          return cn("flex flex-col", spacing);
        case 'horizontal':
          return "flex flex-row gap-4 overflow-x-auto";
        default:
          return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`;
      }
    };

    return (
      <div ref={ref} className={cn(statsVariants({ variant, layout, size, spacing, density }), className)} {...props}>
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
            {data.map((item, index) => renderStatItem(item, index))}
          </div>
        )}
      </div>
    );
  }
);

Stats.displayName = "Stats";

// Stats Sub-components
const StatItem = forwardRef<HTMLDivElement, StatItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 rounded-lg border border-border/50", className)} {...props} />
  )
);
StatItem.displayName = "StatItem";

interface StatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: StatItem;
  index?: number;
}

const StatHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 mb-2", className)} {...props} />
  )
);
StatHeader.displayName = "StatHeader";

const StatValue = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-2xl font-bold text-foreground", className)} {...props} />
  )
);
StatValue.displayName = "StatValue";

const StatDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />
  )
);
StatDescription.displayName = "StatDescription";

const StatTrend = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-4 text-sm", className)} {...props} />
  )
);
StatTrend.displayName = "StatTrend";

const StatChart = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4", className)} {...props} />
  )
);
StatChart.displayName = "StatChart";

const StatActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-1 ml-4", className)} {...props} />
  )
);
StatActions.displayName = "StatActions";

// Stats Variants
const StatsSolid = forwardRef<HTMLDivElement, StatsProps>(
  ({ variant = "default", ...props }, ref) => (
    <Stats ref={ref} variant={variant} {...props} />
  )
);
StatsSolid.displayName = "StatsSolid";

const StatsTransparent = forwardRef<HTMLDivElement, StatsProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Stats ref={ref} variant={variant} {...props} />
  )
);
StatsTransparent.displayName = "StatsTransparent";

const StatsGradient = forwardRef<HTMLDivElement, StatsProps>(
  ({ className, ...props }, ref) => (
    <Stats
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
StatsGradient.displayName = "StatsGradient";

const StatsCard = forwardRef<HTMLDivElement, StatsProps>(
  ({ variant = "card", ...props }, ref) => (
    <Stats ref={ref} variant={variant} {...props} />
  )
);
StatsCard.displayName = "StatsCard";

const StatsElevated = forwardRef<HTMLDivElement, StatsProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Stats ref={ref} variant={variant} {...props} />
  )
);
StatsElevated.displayName = "StatsElevated";

const StatsGlass = forwardRef<HTMLDivElement, StatsProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Stats ref={ref} variant={variant} {...props} />
  )
);
StatsGlass.displayName = "StatsGlass";

// Layout Variants
const StatsGrid = forwardRef<HTMLDivElement, StatsProps>(
  ({ layout = "grid", ...props }, ref) => (
    <Stats ref={ref} layout={layout} {...props} />
  )
);
StatsGrid.displayName = "StatsGrid";

const StatsFlex = forwardRef<HTMLDivElement, StatsProps>(
  ({ layout = "flex", ...props }, ref) => (
    <Stats ref={ref} layout={layout} {...props} />
  )
);
StatsFlex.displayName = "StatsFlex";

const StatsVertical = forwardRef<HTMLDivElement, StatsProps>(
  ({ layout = "vertical", ...props }, ref) => (
    <Stats ref={ref} layout={layout} {...props} />
  )
);
StatsVertical.displayName = "StatsVertical";

const StatsHorizontal = forwardRef<HTMLDivElement, StatsProps>(
  ({ layout = "horizontal", ...props }, ref) => (
    <Stats ref={ref} layout={layout} {...props} />
  )
);
StatsHorizontal.displayName = "StatsHorizontal";

// Responsive Stats
const StatsResponsive = forwardRef<HTMLDivElement, StatsProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Stats {...props} />
    </div>
  )
);
StatsResponsive.displayName = "StatsResponsive";

// Spacing Utilities
const StatsSpacing = {
  tight: "space-y-2",
  normal: "space-y-4",
  loose: "space-y-6"
};

// Density Utilities
const StatsDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const StatsCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Chart Types
const StatsChartTypes = {
  bar: "bar",
  line: "line",
  pie: "pie",
  area: "area",
  donut: "donut",
  radar: "radar"
};

// Trend Colors
const StatsTrendColors = {
  up: "text-green-500",
  down: "text-red-500",
  stable: "text-yellow-500"
};

export {
  Stats,
  StatItem,
  StatHeader,
  StatValue,
  StatDescription,
  StatTrend,
  StatChart,
  StatActions,
  StatsSolid,
  StatsTransparent,
  StatsGradient,
  StatsCard,
  StatsElevated,
  StatsGlass,
  StatsGrid,
  StatsFlex,
  StatsVertical,
  StatsHorizontal,
  StatsResponsive,
  StatsSpacing,
  StatsDensity,
  StatsCardVariants,
  StatsChartTypes,
  StatsTrendColors,
  statsVariants
};
