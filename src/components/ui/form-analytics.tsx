import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  BarChartIcon, 
  TrendingUpIcon, 
  TrendingDownIcon, 
  UsersIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  EyeIcon, 
  MousePointerIcon, 
  CalendarIcon, 
  DownloadIcon, 
  RefreshIcon, 
  FilterIcon, 
  MoreHorizontalIcon,
  ActivityIcon,
  TargetIcon,
  ZapIcon,
  TimerIcon,
  UserCheckIcon,
  UserXIcon,
  FileTextIcon,
  PieChartIcon,
  LineChartIcon
} from 'lucide-react';

const formAnalyticsVariants = cva(
  'w-full space-y-6',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-6 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-4',
        card: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-sm',
        elevated: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'space-y-4 p-4',
        default: 'space-y-6 p-6',
        lg: 'space-y-8 p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formAnalyticsMetricVariants = cva(
  'p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg border-atlas-border',
        success: 'bg-atlas-success-bg border-atlas-success-main',
        warning: 'bg-atlas-warning-bg border-atlas-warning-main',
        error: 'bg-atlas-error-bg border-atlas-error-main',
        info: 'bg-atlas-info-bg border-atlas-info-main',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formAnalyticsChartVariants = cva(
  'w-full h-64 bg-atlas-card-bg border border-atlas-border rounded-lg p-4',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg',
        outlined: 'bg-atlas-border-subtle',
        ghost: 'bg-transparent',
      },
      size: {
        sm: 'h-48',
        default: 'h-64',
        lg: 'h-80',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormAnalyticsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formAnalyticsVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  analytics: FormAnalyticsData;
  onAnalyticsChange?: (analytics: FormAnalyticsData) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onFilter?: (filters: AnalyticsFilters) => void;
  showCharts?: boolean;
  showMetrics?: boolean;
  showTrends?: boolean;
  timeRange?: 'hour' | 'day' | 'week' | 'month' | 'year';
  children?: React.ReactNode;
}

export interface FormAnalyticsData {
  formId: string;
  period: {
    start: Date;
    end: Date;
  };
  overview: {
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
    averageTime: number;
    bounceRate: number;
    conversionRate: number;
  };
  submissions: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    byDate: Array<{ date: string; count: number }>;
  };
  fields: Array<{
    id: string;
    name: string;
    views: number;
    interactions: number;
    completions: number;
    averageTime: number;
    abandonmentRate: number;
  }>;
  users: {
    total: number;
    new: number;
    returning: number;
    byDevice: Array<{ device: string; count: number }>;
    byLocation: Array<{ location: string; count: number }>;
  };
  performance: {
    averageLoadTime: number;
    averageInteractionTime: number;
    errorRate: number;
    uptime: number;
  };
}

export interface AnalyticsFilters {
  dateRange?: { start: Date; end: Date };
  device?: string[];
  location?: string[];
  status?: string[];
}

export interface FormAnalyticsMetricProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formAnalyticsMetricVariants> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'default' | 'lg';
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  trend?: Array<{ date: string; value: number }>;
}

export interface FormAnalyticsChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formAnalyticsChartVariants> {
  variant?: 'default' | 'outlined' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  title: string;
  data: Array<{ label: string; value: number; color?: string }>;
  type?: 'bar' | 'line' | 'pie' | 'area';
  showLegend?: boolean;
  showTooltip?: boolean;
}

const FormAnalyticsMetric = React.forwardRef<
  HTMLDivElement,
  FormAnalyticsMetricProps
>(({ 
  className, 
  variant, 
  size, 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  description, 
  ...props 
}, ref) => {
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUpIcon className="h-4 w-4 text-atlas-success-main" />;
      case 'decrease':
        return <TrendingDownIcon className="h-4 w-4 text-atlas-error-main" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-atlas-success-main';
      case 'decrease':
        return 'text-atlas-error-main';
      default:
        return 'text-atlas-text-tertiary';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formAnalyticsMetricVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {icon && (
              <span className="flex-shrink-0 text-atlas-text-tertiary" aria-hidden="true">
                {icon}
              </span>
            )}
            <h3 className="text-sm font-medium text-atlas-text-primary truncate">
              {title}
            </h3>
          </div>
          
          <div className="text-2xl font-bold text-atlas-text-primary mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 text-sm', getChangeColor())}>
              {getChangeIcon()}
              <span>
                {changeType === 'increase' ? '+' : changeType === 'decrease' ? '-' : ''}
                {Math.abs(change)}%
              </span>
              <span className="text-atlas-text-tertiary">vs last period</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-atlas-text-secondary mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
FormAnalyticsMetric.displayName = 'FormAnalyticsMetric';

const FormAnalyticsChart = React.forwardRef<
  HTMLDivElement,
  FormAnalyticsChartProps
>(({ 
  className, 
  variant, 
  size, 
  title, 
  data, 
  type = 'bar', 
  showLegend = true, 
  showTooltip = true, 
  ...props 
}, ref) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const renderBarChart = () => (
    <div className="flex items-end justify-between h-full gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="w-full bg-atlas-border-subtle rounded-t-sm relative">
            <div
              className="bg-atlas-primary-main rounded-t-sm transition-all duration-500"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: item.value > 0 ? '4px' : '0px',
              }}
            />
          </div>
          <div className="text-xs text-atlas-text-tertiary mt-2 text-center">
            {item.label}
          </div>
          <div className="text-xs font-medium text-atlas-text-primary">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercentage = 0;

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const startAngle = cumulativePercentage * 3.6;
              const endAngle = (cumulativePercentage + percentage) * 3.6;
              cumulativePercentage += percentage;

              const radius = 40;
              const x1 = 50 + radius * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + radius * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + radius * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + radius * Math.sin((endAngle * Math.PI) / 180);
              const largeArcFlag = percentage > 50 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color || `hsl(${index * 60}, 70%, 50%)`}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'pie':
        return renderPieChart();
      case 'bar':
      default:
        return renderBarChart();
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formAnalyticsChartVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          {title}
        </h3>
        {showLegend && (
          <div className="flex items-center gap-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)` }}
                />
                <span className="text-xs text-atlas-text-tertiary">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="h-full">
        {renderChart()}
      </div>
    </div>
  );
});
FormAnalyticsChart.displayName = 'FormAnalyticsChart';

const FormAnalytics = React.forwardRef<
  HTMLDivElement,
  FormAnalyticsProps
>(({
  className,
  variant,
  size,
  analytics,
  onAnalyticsChange,
  onRefresh,
  onExport,
  onFilter,
  showCharts = true,
  showMetrics = true,
  showTrends = true,
  timeRange = 'week',
  children,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setIsLoading(true);
    try {
      await onRefresh?.();
    } finally {
      setIsLoading(false);
    }
  }, [onRefresh]);

  const metrics = [
    {
      title: 'Total Views',
      value: analytics.overview.totalViews,
      change: 12,
      changeType: 'increase' as const,
      icon: <EyeIcon className="h-4 w-4" />,
      description: 'Form page views',
    },
    {
      title: 'Submissions',
      value: analytics.overview.totalSubmissions,
      change: 8,
      changeType: 'increase' as const,
      icon: <CheckCircleIcon className="h-4 w-4" />,
      description: 'Completed submissions',
    },
    {
      title: 'Completion Rate',
      value: `${analytics.overview.completionRate.toFixed(1)}%`,
      change: -2,
      changeType: 'decrease' as const,
      icon: <TargetIcon className="h-4 w-4" />,
      description: 'Views to submissions',
    },
    {
      title: 'Avg. Time',
      value: `${Math.round(analytics.overview.averageTime / 60)}m`,
      change: 5,
      changeType: 'increase' as const,
      icon: <TimerIcon className="h-4 w-4" />,
      description: 'Time to complete',
    },
  ];

  const chartData = {
    submissions: analytics.submissions.byDate.map(item => ({
      label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: item.count,
    })),
    devices: analytics.users.byDevice.map(item => ({
      label: item.device,
      value: item.count,
    })),
    fields: analytics.fields.slice(0, 5).map(field => ({
      label: field.name,
      value: field.interactions,
    })),
  };

  return (
    <div
      ref={ref}
      className={cn(formAnalyticsVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Form Analytics
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {analytics.period.start.toLocaleDateString()} - {analytics.period.end.toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center justify-center p-2 text-sm font-medium text-atlas-text-primary hover:bg-atlas-border-subtle rounded-md transition-colors disabled:opacity-50"
            aria-label="Refresh analytics"
          >
            <RefreshIcon className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </button>
          
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center justify-center p-2 text-sm font-medium text-atlas-text-primary hover:bg-atlas-border-subtle rounded-md transition-colors"
            aria-label="Export analytics"
          >
            <DownloadIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <FormAnalyticsMetric
              key={index}
              variant="default"
              size={size}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
              description={metric.description}
            />
          ))}
        </div>
      )}

      {showCharts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormAnalyticsChart
            variant="default"
            size={size}
            title="Submissions Over Time"
            data={chartData.submissions}
            type="bar"
            showLegend={false}
          />
          
          <FormAnalyticsChart
            variant="default"
            size={size}
            title="Device Distribution"
            data={chartData.devices}
            type="pie"
            showLegend={true}
          />
        </div>
      )}

      {showTrends && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-atlas-text-primary">
            Field Performance
          </h3>
          <div className="space-y-2">
            {analytics.fields.slice(0, 5).map((field, index) => (
              <div key={field.id} className="flex items-center justify-between p-3 bg-atlas-border-subtle rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-atlas-primary-main text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-atlas-text-primary">
                      {field.name}
                    </div>
                    <div className="text-xs text-atlas-text-secondary">
                      {field.interactions} interactions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-atlas-text-primary">
                    {field.completionRate.toFixed(1)}%
                  </div>
                  <div className="text-xs text-atlas-text-secondary">
                    {Math.round(field.averageTime / 1000)}s avg
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {children}
    </div>
  );
});
FormAnalytics.displayName = 'FormAnalytics';

// Additional utility components
const FormAnalyticsContainer = React.forwardRef<
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
        'w-full',
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
FormAnalyticsContainer.displayName = 'FormAnalyticsContainer';

const FormAnalyticsSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    metricCount?: number;
  }
>(({ className, size = 'default', metricCount = 4, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full space-y-6', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-4 w-48 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: metricCount }).map((_, index) => (
          <div key={index} className="p-4 border border-atlas-border rounded-lg">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
              <div className="h-8 w-16 bg-atlas-border-subtle rounded animate-pulse" />
              <div className="h-3 w-20 bg-atlas-border-subtle rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-atlas-border-subtle rounded-lg animate-pulse" />
        <div className="h-64 bg-atlas-border-subtle rounded-lg animate-pulse" />
      </div>
    </div>
  );
});
FormAnalyticsSkeleton.displayName = 'FormAnalyticsSkeleton';

export {
  FormAnalytics,
  FormAnalyticsMetric,
  FormAnalyticsChart,
  FormAnalyticsContainer,
  FormAnalyticsSkeleton,
  formAnalyticsVariants,
  formAnalyticsMetricVariants,
  formAnalyticsChartVariants,
};
