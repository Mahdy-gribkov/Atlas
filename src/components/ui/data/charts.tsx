"use client";

import React, { forwardRef, useState, useMemo, useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  BarChartIcon,
  LineChartIcon,
  PieChartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  MinusIcon,
  DownloadIcon,
  ShareIcon,
  SettingsIcon,
  MoreHorizontalIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
  FilterIcon,
  EyeIcon,
  EyeOffIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Select } from "./select";

// Charts Root Component
const chartsVariants = cva(
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
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface ChartsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartsVariants> {
  data?: ChartData[];
  type?: 'bar' | 'line' | 'pie' | 'area' | 'donut' | 'radar' | 'scatter' | 'bubble' | 'heatmap';
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  responsive?: boolean;
  interactive?: boolean;
  animated?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  showAxes?: boolean;
  showLabels?: boolean;
  showValues?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onDataClick?: (data: ChartDataPoint, index: number) => void;
  onDataHover?: (data: ChartDataPoint, index: number) => void;
  renderTooltip?: (data: ChartDataPoint, index: number) => React.ReactNode;
  renderLegend?: (data: ChartData[], index: number) => React.ReactNode;
  actions?: ChartAction[];
}

export interface ChartData {
  label: string;
  value: number;
  color?: string;
  data?: ChartDataPoint[];
  metadata?: any;
}

export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
  color?: string;
  metadata?: any;
}

export interface ChartAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (chartData: ChartData[]) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

const Charts = forwardRef<HTMLDivElement, ChartsProps>(
  ({
    className,
    variant,
    size,
    spacing,
    density,
    data = [],
    type = 'bar',
    title,
    subtitle,
    width = 400,
    height = 300,
    responsive = true,
    interactive = true,
    animated = true,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    showAxes = true,
    showLabels = true,
    showValues = true,
    loading = false,
    emptyMessage = "No chart data available",
    onDataClick,
    onDataHover,
    renderTooltip,
    renderLegend,
    actions = [],
    ...props
  }, ref) => {
    const [hoveredData, setHoveredData] = useState<ChartDataPoint | null>(null);
    const [selectedData, setSelectedData] = useState<ChartDataPoint | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const maxValue = useMemo(() => {
      return Math.max(...data.map(d => d.value));
    }, [data]);

    const minValue = useMemo(() => {
      return Math.min(...data.map(d => d.value));
    }, [data]);

    const getChartIcon = (chartType: string) => {
      switch (chartType) {
        case 'bar':
          return <BarChartIcon className="h-4 w-4" />;
        case 'line':
          return <LineChartIcon className="h-4 w-4" />;
        case 'pie':
        case 'donut':
          return <PieChartIcon className="h-4 w-4" />;
        default:
          return <BarChartIcon className="h-4 w-4" />;
      }
    };

    const handleDataClick = useCallback((dataPoint: ChartDataPoint, index: number) => {
      setSelectedData(dataPoint);
      onDataClick?.(dataPoint, index);
    }, [onDataClick]);

    const handleDataHover = useCallback((dataPoint: ChartDataPoint, index: number) => {
      setHoveredData(dataPoint);
      onDataHover?.(dataPoint, index);
    }, [onDataHover]);

    const handleAction = useCallback((actionKey: string) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(data);
    }, [actions, data]);

    const renderBarChart = () => {
      const barWidth = width / data.length * 0.8;
      const maxBarHeight = height * 0.8;

      return (
        <div className="relative w-full h-full">
          {/* Grid Lines */}
          {showGrid && (
            <div className="absolute inset-0">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-border/20"
                  style={{ top: `${(i * 20)}%` }}
                />
              ))}
            </div>
          )}

          {/* Bars */}
          <div className="relative h-full flex items-end justify-between px-4 pb-8">
            {data.map((item, index) => {
              const barHeight = (item.value / maxValue) * maxBarHeight;
              const isHovered = hoveredData?.metadata?.index === index;
              const isSelected = selectedData?.metadata?.index === index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2"
                  style={{ width: `${100 / data.length}%` }}
                >
                  {/* Bar */}
                  <div
                    className={cn(
                      "relative cursor-pointer transition-all duration-300",
                      isHovered && "scale-105",
                      isSelected && "ring-2 ring-primary"
                    )}
                    style={{
                      width: `${barWidth}px`,
                      height: `${barHeight}px`,
                      backgroundColor: item.color || `hsl(var(--primary))`
                    }}
                    onClick={() => handleDataClick({ x: item.label, y: item.value, metadata: { index } }, index)}
                    onMouseEnter={() => handleDataHover({ x: item.label, y: item.value, metadata: { index } }, index)}
                    onMouseLeave={() => setHoveredData(null)}
                  >
                    {/* Value Label */}
                    {showValues && (
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium">
                        {item.value}
                      </div>
                    )}
                  </div>

                  {/* X-axis Label */}
                  {showLabels && (
                    <div className="text-xs text-muted-foreground text-center truncate max-w-full">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Y-axis Labels */}
          {showAxes && (
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-8">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="text-xs text-muted-foreground">
                  {Math.round(maxValue - (i * maxValue / 4))}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderLineChart = () => {
      const maxBarHeight = height * 0.8;
      const pointRadius = 4;

      return (
        <div className="relative w-full h-full">
          {/* Grid Lines */}
          {showGrid && (
            <div className="absolute inset-0">
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-border/20"
                  style={{ top: `${(i * 20)}%` }}
                />
              ))}
            </div>
          )}

          {/* Line and Points */}
          <div className="relative h-full px-4 pb-8">
            <svg width="100%" height="100%" className="absolute inset-0">
              {/* Line */}
              <polyline
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                points={data.map((item, index) => {
                  const x = (index / (data.length - 1)) * (width - 32) + 16;
                  const y = height - 32 - ((item.value / maxValue) * maxBarHeight);
                  return `${x},${y}`;
                }).join(' ')}
              />

              {/* Points */}
              {data.map((item, index) => {
                const x = (index / (data.length - 1)) * (width - 32) + 16;
                const y = height - 32 - ((item.value / maxValue) * maxBarHeight);
                const isHovered = hoveredData?.metadata?.index === index;
                const isSelected = selectedData?.metadata?.index === index;

                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r={isHovered || isSelected ? pointRadius + 2 : pointRadius}
                    fill={item.color || "hsl(var(--primary))"}
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleDataClick({ x: item.label, y: item.value, metadata: { index } }, index)}
                    onMouseEnter={() => handleDataHover({ x: item.label, y: item.value, metadata: { index } }, index)}
                    onMouseLeave={() => setHoveredData(null)}
                  />
                );
              })}
            </svg>

            {/* Labels */}
            {showLabels && (
              <div className="absolute bottom-0 left-4 right-4 flex justify-between">
                {data.map((item, index) => (
                  <div key={index} className="text-xs text-muted-foreground text-center">
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Y-axis Labels */}
          {showAxes && (
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-8">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="text-xs text-muted-foreground">
                  {Math.round(maxValue - (i * maxValue / 4))}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderPieChart = () => {
      const radius = Math.min(width, height) / 2 - 40;
      const centerX = width / 2;
      const centerY = height / 2;
      const total = data.reduce((sum, item) => sum + item.value, 0);

      let currentAngle = 0;

      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <svg width={width} height={height} className="absolute inset-0">
            {data.map((item, index) => {
              const percentage = item.value / total;
              const angle = percentage * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;

              const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
              const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
              const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
              const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              currentAngle += angle;

              const isHovered = hoveredData?.metadata?.index === index;
              const isSelected = selectedData?.metadata?.index === index;

              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color || `hsl(${index * 60}, 70%, 50%)`}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isHovered && "opacity-80",
                    isSelected && "stroke-2 stroke-primary"
                  )}
                  onClick={() => handleDataClick({ x: item.label, y: item.value, metadata: { index } }, index)}
                  onMouseEnter={() => handleDataHover({ x: item.label, y: item.value, metadata: { index } }, index)}
                  onMouseLeave={() => setHoveredData(null)}
                />
              );
            })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">{total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      );
    };

    const renderChart = () => {
      switch (type) {
        case 'bar':
          return renderBarChart();
        case 'line':
          return renderLineChart();
        case 'pie':
        case 'donut':
          return renderPieChart();
        default:
          return renderBarChart();
      }
    };

    const renderTooltipContent = () => {
      if (!hoveredData || !showTooltip) return null;

      if (renderTooltip) {
        return renderTooltip(hoveredData, hoveredData.metadata?.index || 0);
      }

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium">{hoveredData.x}</div>
          <div className="text-sm text-muted-foreground">{hoveredData.y}</div>
        </div>
      );
    };

    const renderLegendContent = () => {
      if (!showLegend) return null;

      if (renderLegend) {
        return renderLegend(data, 0);
      }

      return (
        <div className="flex flex-wrap gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div ref={ref} className={cn(chartsVariants({ variant, size, spacing, density }), className)} {...props}>
        {/* Header */}
        {(title || subtitle || actions.length > 0) && (
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && (
                <h3 className="font-semibold text-foreground">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            {actions.length > 0 && (
              <div className="flex items-center space-x-2">
                {actions.slice(0, 3).map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "ghost"}
                    size="sm"
                    onClick={() => handleAction(action.key)}
                    disabled={action.disabled}
                    className="h-8 w-8 p-0"
                  >
                    {action.icon}
                  </Button>
                ))}
                {actions.length > 3 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.slice(3).map(action => (
                        <DropdownMenuItem
                          key={action.key}
                          onClick={() => handleAction(action.key)}
                          disabled={action.disabled}
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
        )}

        {/* Chart */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Loading chart...</span>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div
              className="relative"
              style={{
                width: responsive ? '100%' : `${width}px`,
                height: `${height}px`,
                minHeight: '200px'
              }}
            >
              {renderChart()}
              
              {/* Tooltip */}
              {renderTooltipContent()}
            </div>
          )}
        </div>

        {/* Legend */}
        {renderLegendContent()}
      </div>
    );
  }
);

Charts.displayName = "Charts";

// Charts Sub-components
const ChartContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props} />
  )
);
ChartContainer.displayName = "ChartContainer";

const ChartHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between mb-4", className)} {...props} />
  )
);
ChartHeader.displayName = "ChartHeader";

const ChartTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-semibold text-foreground", className)} {...props} />
  )
);
ChartTitle.displayName = "ChartTitle";

const ChartSubtitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
ChartSubtitle.displayName = "ChartSubtitle";

const ChartActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
  )
);
ChartActions.displayName = "ChartActions";

const ChartLegend = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap gap-2 mt-4", className)} {...props} />
  )
);
ChartLegend.displayName = "ChartLegend";

const ChartTooltip = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-background border border-border rounded-lg p-3 shadow-lg", className)} {...props} />
  )
);
ChartTooltip.displayName = "ChartTooltip";

// Charts Variants
const ChartsSolid = forwardRef<HTMLDivElement, ChartsProps>(
  ({ variant = "default", ...props }, ref) => (
    <Charts ref={ref} variant={variant} {...props} />
  )
);
ChartsSolid.displayName = "ChartsSolid";

const ChartsTransparent = forwardRef<HTMLDivElement, ChartsProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Charts ref={ref} variant={variant} {...props} />
  )
);
ChartsTransparent.displayName = "ChartsTransparent";

const ChartsGradient = forwardRef<HTMLDivElement, ChartsProps>(
  ({ className, ...props }, ref) => (
    <Charts
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
ChartsGradient.displayName = "ChartsGradient";

const ChartsCard = forwardRef<HTMLDivElement, ChartsProps>(
  ({ variant = "card", ...props }, ref) => (
    <Charts ref={ref} variant={variant} {...props} />
  )
);
ChartsCard.displayName = "ChartsCard";

const ChartsElevated = forwardRef<HTMLDivElement, ChartsProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Charts ref={ref} variant={variant} {...props} />
  )
);
ChartsElevated.displayName = "ChartsElevated";

const ChartsGlass = forwardRef<HTMLDivElement, ChartsProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Charts ref={ref} variant={variant} {...props} />
  )
);
ChartsGlass.displayName = "ChartsGlass";

// Chart Type Variants
const BarChart = forwardRef<HTMLDivElement, ChartsProps>(
  ({ type = "bar", ...props }, ref) => (
    <Charts ref={ref} type={type} {...props} />
  )
);
BarChart.displayName = "BarChart";

const LineChart = forwardRef<HTMLDivElement, ChartsProps>(
  ({ type = "line", ...props }, ref) => (
    <Charts ref={ref} type={type} {...props} />
  )
);
LineChart.displayName = "LineChart";

const PieChart = forwardRef<HTMLDivElement, ChartsProps>(
  ({ type = "pie", ...props }, ref) => (
    <Charts ref={ref} type={type} {...props} />
  )
);
PieChart.displayName = "PieChart";

const DonutChart = forwardRef<HTMLDivElement, ChartsProps>(
  ({ type = "donut", ...props }, ref) => (
    <Charts ref={ref} type={type} {...props} />
  )
);
DonutChart.displayName = "DonutChart";

// Responsive Charts
const ChartsResponsive = forwardRef<HTMLDivElement, ChartsProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Charts {...props} />
    </div>
  )
);
ChartsResponsive.displayName = "ChartsResponsive";

// Spacing Utilities
const ChartsSpacing = {
  tight: "space-y-2",
  normal: "space-y-4",
  loose: "space-y-6"
};

// Density Utilities
const ChartsDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const ChartsCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Chart Types
const ChartsTypes = {
  bar: "bar",
  line: "line",
  pie: "pie",
  area: "area",
  donut: "donut",
  radar: "radar",
  scatter: "scatter",
  bubble: "bubble",
  heatmap: "heatmap"
};

export {
  Charts,
  ChartContainer,
  ChartHeader,
  ChartTitle,
  ChartSubtitle,
  ChartActions,
  ChartLegend,
  ChartTooltip,
  ChartsSolid,
  ChartsTransparent,
  ChartsGradient,
  ChartsCard,
  ChartsElevated,
  ChartsGlass,
  BarChart,
  LineChart,
  PieChart,
  DonutChart,
  ChartsResponsive,
  ChartsSpacing,
  ChartsDensity,
  ChartsCardVariants,
  ChartsTypes,
  chartsVariants
};
