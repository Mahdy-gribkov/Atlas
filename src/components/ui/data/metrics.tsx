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
  TargetIcon,
  ZapIcon,
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
  MoreHorizontalIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XCircleIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

// Metrics Root Component
const metricsVariants = cva(
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
        horizontal: "flex flex-row",
        dashboard: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
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

export interface MetricsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof metricsVariants> {
  data?: MetricItem[];
  columns?: number;
  showKPIs?: boolean;
  showIndicators?: boolean;
  showProgress?: boolean;
  showTrends?: boolean;
  showComparisons?: boolean;
  showAlerts?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: MetricItem, index: number) => void;
  renderItem?: (item: MetricItem, index: number) => React.ReactNode;
  renderKPI?: (item: MetricItem, index: number) => React.ReactNode;
  renderIndicator?: (item: MetricItem, index: number) => React.ReactNode;
  actions?: MetricAction[];
}

export interface MetricItem {
  id: string;
  title: string;
  value: number | string;
  target?: number;
  previousValue?: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  trend?: 'up' | 'down' | 'stable';
  status?: 'excellent' | 'good' | 'warning' | 'critical' | 'info';
  format?: 'number' | 'currency' | 'percentage' | 'duration' | 'custom';
  icon?: React.ReactNode;
  color?: string;
  description?: string;
  unit?: string;
  threshold?: {
    warning: number;
    critical: number;
  };
  progress?: {
    current: number;
    target: number;
    max?: number;
  };
  kpi?: {
    category: string;
    period: string;
    benchmark?: number;
  };
  indicator?: {
    type: 'gauge' | 'progress' | 'trend' | 'comparison';
    data: any;
  };
  alert?: {
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
  };
  data?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface MetricAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: MetricItem, index: number) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: MetricItem, index: number) => boolean;
}

const Metrics = forwardRef<HTMLDivElement, MetricsProps>(
  ({
    className,
    variant,
    layout,
    size,
    spacing,
    density,
    data = [],
    columns = 4,
    showKPIs = true,
    showIndicators = true,
    showProgress = true,
    showTrends = true,
    showComparisons = true,
    showAlerts = true,
    loading = false,
    emptyMessage = "No metrics available",
    onItemClick,
    renderItem,
    renderKPI,
    renderIndicator,
    actions = [],
    ...props
  }, ref) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const formatValue = (value: number | string, format?: string, unit?: string) => {
      if (typeof value === 'string') return value;
      
      let formattedValue: string;
      switch (format) {
        case 'currency':
          formattedValue = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value);
          break;
        case 'percentage':
          formattedValue = `${value}%`;
          break;
        case 'duration':
          formattedValue = `${value}s`;
          break;
        case 'custom':
          formattedValue = value.toString();
          break;
        default:
          formattedValue = new Intl.NumberFormat('en-US').format(value);
      }
      
      return unit ? `${formattedValue} ${unit}` : formattedValue;
    };

    const getStatusIcon = (status?: string) => {
      switch (status) {
        case 'excellent':
          return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
        case 'good':
          return <CheckCircleIcon className="h-4 w-4 text-blue-500" />;
        case 'warning':
          return <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />;
        case 'critical':
          return <XCircleIcon className="h-4 w-4 text-red-500" />;
        case 'info':
          return <InfoIcon className="h-4 w-4 text-blue-500" />;
        default:
          return null;
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

    const getStatusColor = (status?: string) => {
      switch (status) {
        case 'excellent':
          return 'border-green-500 bg-green-50';
        case 'good':
          return 'border-blue-500 bg-blue-50';
        case 'warning':
          return 'border-yellow-500 bg-yellow-50';
        case 'critical':
          return 'border-red-500 bg-red-50';
        case 'info':
          return 'border-blue-500 bg-blue-50';
        default:
          return 'border-border bg-background';
      }
    };

    const getAlertColor = (level?: string) => {
      switch (level) {
        case 'success':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'warning':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'error':
          return 'bg-red-100 text-red-800 border-red-200';
        case 'info':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    const calculateProgress = (item: MetricItem) => {
      if (!item.progress) return 0;
      const { current, target, max = 100 } = item.progress;
      return Math.min((current / target) * 100, max);
    };

    const handleItemClick = (item: MetricItem, index: number) => {
      setSelectedItem(item.id);
      onItemClick?.(item, index);
    };

    const handleAction = (actionKey: string, item: MetricItem, index: number) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(item, index);
    };

    const renderMetricItem = (item: MetricItem, index: number) => {
      if (renderItem) {
        return renderItem(item, index);
      }

      const isSelected = selectedItem === item.id;
      const changeValue = item.change !== undefined ? Math.abs(item.change) : 0;
      const progressValue = calculateProgress(item);

      return (
        <div
          key={item.id}
          className={cn(
            "p-4 rounded-lg border transition-colors",
            getStatusColor(item.status),
            "hover:shadow-md",
            isSelected && "ring-2 ring-primary/50",
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
                {item.status && showAlerts && (
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="text-2xl font-bold text-foreground">
                  {formatValue(item.value, item.format, item.unit)}
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.description}
                  </p>
                )}
              </div>

              {/* KPI Information */}
              {showKPIs && item.kpi && (
                <div className="mb-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>{item.kpi.category}</span>
                    <span>{item.kpi.period}</span>
                    {item.kpi.benchmark && (
                      <span>Benchmark: {formatValue(item.kpi.benchmark, item.format)}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {showProgress && item.progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressValue)}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatValue(item.progress.current, item.format)}</span>
                    <span>{formatValue(item.progress.target, item.format)}</span>
                  </div>
                </div>
              )}

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

              {/* Alert */}
              {showAlerts && item.alert && (
                <div className={cn("mt-3 p-2 rounded border text-xs", getAlertColor(item.alert.level))}>
                  {item.alert.message}
                </div>
              )}

              {/* Indicator */}
              {showIndicators && item.indicator && (
                <div className="mt-3">
                  {renderIndicator ? renderIndicator(item, index) : (
                    <div className="h-16 bg-muted/50 rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        {item.indicator.type} indicator
                      </span>
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
        case 'dashboard':
          return "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6";
        default:
          return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`;
      }
    };

    return (
      <div ref={ref} className={cn(metricsVariants({ variant, layout, size, spacing, density }), className)} {...props}>
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
            {data.map((item, index) => renderMetricItem(item, index))}
          </div>
        )}
      </div>
    );
  }
);

Metrics.displayName = "Metrics";

// Metrics Sub-components
const MetricItem = forwardRef<HTMLDivElement, MetricItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-4 rounded-lg border border-border/50", className)} {...props} />
  )
);
MetricItem.displayName = "MetricItem";

interface MetricItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: MetricItem;
  index?: number;
}

const MetricHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 mb-2", className)} {...props} />
  )
);
MetricHeader.displayName = "MetricHeader";

const MetricValue = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-2xl font-bold text-foreground", className)} {...props} />
  )
);
MetricValue.displayName = "MetricValue";

const MetricDescription = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />
  )
);
MetricDescription.displayName = "MetricDescription";

const MetricKPI = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-3 text-xs text-muted-foreground", className)} {...props} />
  )
);
MetricKPI.displayName = "MetricKPI";

const MetricProgress = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-3", className)} {...props} />
  )
);
MetricProgress.displayName = "MetricProgress";

const MetricTrend = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-4 text-sm", className)} {...props} />
  )
);
MetricTrend.displayName = "MetricTrend";

const MetricAlert = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-3 p-2 rounded border text-xs", className)} {...props} />
  )
);
MetricAlert.displayName = "MetricAlert";

const MetricIndicator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mt-3", className)} {...props} />
  )
);
MetricIndicator.displayName = "MetricIndicator";

const MetricActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-1 ml-4", className)} {...props} />
  )
);
MetricActions.displayName = "MetricActions";

// Metrics Variants
const MetricsSolid = forwardRef<HTMLDivElement, MetricsProps>(
  ({ variant = "default", ...props }, ref) => (
    <Metrics ref={ref} variant={variant} {...props} />
  )
);
MetricsSolid.displayName = "MetricsSolid";

const MetricsTransparent = forwardRef<HTMLDivElement, MetricsProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Metrics ref={ref} variant={variant} {...props} />
  )
);
MetricsTransparent.displayName = "MetricsTransparent";

const MetricsGradient = forwardRef<HTMLDivElement, MetricsProps>(
  ({ className, ...props }, ref) => (
    <Metrics
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
MetricsGradient.displayName = "MetricsGradient";

const MetricsCard = forwardRef<HTMLDivElement, MetricsProps>(
  ({ variant = "card", ...props }, ref) => (
    <Metrics ref={ref} variant={variant} {...props} />
  )
);
MetricsCard.displayName = "MetricsCard";

const MetricsElevated = forwardRef<HTMLDivElement, MetricsProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Metrics ref={ref} variant={variant} {...props} />
  )
);
MetricsElevated.displayName = "MetricsElevated";

const MetricsGlass = forwardRef<HTMLDivElement, MetricsProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Metrics ref={ref} variant={variant} {...props} />
  )
);
MetricsGlass.displayName = "MetricsGlass";

// Layout Variants
const MetricsGrid = forwardRef<HTMLDivElement, MetricsProps>(
  ({ layout = "grid", ...props }, ref) => (
    <Metrics ref={ref} layout={layout} {...props} />
  )
);
MetricsGrid.displayName = "MetricsGrid";

const MetricsFlex = forwardRef<HTMLDivElement, MetricsProps>(
  ({ layout = "flex", ...props }, ref) => (
    <Metrics ref={ref} layout={layout} {...props} />
  )
);
MetricsFlex.displayName = "MetricsFlex";

const MetricsVertical = forwardRef<HTMLDivElement, MetricsProps>(
  ({ layout = "vertical", ...props }, ref) => (
    <Metrics ref={ref} layout={layout} {...props} />
  )
);
MetricsVertical.displayName = "MetricsVertical";

const MetricsHorizontal = forwardRef<HTMLDivElement, MetricsProps>(
  ({ layout = "horizontal", ...props }, ref) => (
    <Metrics ref={ref} layout={layout} {...props} />
  )
);
MetricsHorizontal.displayName = "MetricsHorizontal";

const MetricsDashboard = forwardRef<HTMLDivElement, MetricsProps>(
  ({ layout = "dashboard", ...props }, ref) => (
    <Metrics ref={ref} layout={layout} {...props} />
  )
);
MetricsDashboard.displayName = "MetricsDashboard";

// Responsive Metrics
const MetricsResponsive = forwardRef<HTMLDivElement, MetricsProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Metrics {...props} />
    </div>
  )
);
MetricsResponsive.displayName = "MetricsResponsive";

// Spacing Utilities
const MetricsSpacing = {
  tight: "space-y-2",
  normal: "space-y-4",
  loose: "space-y-6"
};

// Density Utilities
const MetricsDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const MetricsCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Status Variants
const MetricsStatusVariants = {
  excellent: "border-green-500 bg-green-50",
  good: "border-blue-500 bg-blue-50",
  warning: "border-yellow-500 bg-yellow-50",
  critical: "border-red-500 bg-red-50",
  info: "border-blue-500 bg-blue-50"
};

// Alert Variants
const MetricsAlertVariants = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200"
};

export {
  Metrics,
  MetricItem,
  MetricHeader,
  MetricValue,
  MetricDescription,
  MetricKPI,
  MetricProgress,
  MetricTrend,
  MetricAlert,
  MetricIndicator,
  MetricActions,
  MetricsSolid,
  MetricsTransparent,
  MetricsGradient,
  MetricsCard,
  MetricsElevated,
  MetricsGlass,
  MetricsGrid,
  MetricsFlex,
  MetricsVertical,
  MetricsHorizontal,
  MetricsDashboard,
  MetricsResponsive,
  MetricsSpacing,
  MetricsDensity,
  MetricsCardVariants,
  MetricsStatusVariants,
  MetricsAlertVariants,
  metricsVariants
};
