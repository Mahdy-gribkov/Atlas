"use client";

import React, { forwardRef, useState, useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  XCircleIcon,
  PlayIcon,
  PauseIcon,
  StopIcon,
  MoreHorizontalIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar } from "./avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

// Timeline Root Component
const timelineVariants = cva(
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
      orientation: {
        vertical: "flex flex-col",
        horizontal: "flex flex-row",
        alternating: "flex flex-col"
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
      orientation: "vertical",
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  data?: TimelineItem[];
  orientation?: 'vertical' | 'horizontal' | 'alternating';
  showConnector?: boolean;
  showIcons?: boolean;
  showDates?: boolean;
  showTimes?: boolean;
  clickable?: boolean;
  selectable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onItemClick?: (item: TimelineItem, index: number) => void;
  onItemSelect?: (item: TimelineItem, index: number) => void;
  renderItem?: (item: TimelineItem, index: number) => React.ReactNode;
  renderIcon?: (item: TimelineItem, index: number) => React.ReactNode;
  renderDate?: (item: TimelineItem, index: number) => React.ReactNode;
  actions?: TimelineAction[];
}

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: Date | string;
  time?: string;
  status?: 'completed' | 'in-progress' | 'pending' | 'cancelled' | 'warning' | 'error' | 'info';
  type?: 'event' | 'milestone' | 'task' | 'note' | 'meeting' | 'travel';
  location?: string;
  participants?: string[];
  tags?: string[];
  icon?: React.ReactNode;
  color?: string;
  data?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface TimelineAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: TimelineItem, index: number) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (item: TimelineItem, index: number) => boolean;
}

const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({
    className,
    variant,
    orientation,
    size,
    spacing,
    density,
    data = [],
    showConnector = true,
    showIcons = true,
    showDates = true,
    showTimes = true,
    clickable = false,
    selectable = false,
    loading = false,
    emptyMessage = "No timeline items available",
    onItemClick,
    onItemSelect,
    renderItem,
    renderIcon,
    renderDate,
    actions = [],
    ...props
  }, ref) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const getStatusIcon = (status?: string) => {
      switch (status) {
        case 'completed':
          return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
        case 'in-progress':
          return <PlayIcon className="h-4 w-4 text-blue-500" />;
        case 'pending':
          return <ClockIcon className="h-4 w-4 text-yellow-500" />;
        case 'cancelled':
          return <XCircleIcon className="h-4 w-4 text-red-500" />;
        case 'warning':
          return <AlertCircleIcon className="h-4 w-4 text-orange-500" />;
        case 'error':
          return <XCircleIcon className="h-4 w-4 text-red-500" />;
        case 'info':
          return <InfoIcon className="h-4 w-4 text-blue-500" />;
        default:
          return <ClockIcon className="h-4 w-4 text-muted-foreground" />;
      }
    };

    const getTypeIcon = (type?: string) => {
      switch (type) {
        case 'event':
          return <CalendarIcon className="h-4 w-4" />;
        case 'milestone':
          return <CheckCircleIcon className="h-4 w-4" />;
        case 'task':
          return <ClockIcon className="h-4 w-4" />;
        case 'note':
          return <InfoIcon className="h-4 w-4" />;
        case 'meeting':
          return <UserIcon className="h-4 w-4" />;
        case 'travel':
          return <MapPinIcon className="h-4 w-4" />;
        default:
          return <ClockIcon className="h-4 w-4" />;
      }
    };

    const formatDate = (date: Date | string) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toLocaleDateString();
    };

    const formatTime = (time?: string) => {
      if (!time) return '';
      return time;
    };

    const handleItemClick = (item: TimelineItem, index: number) => {
      if (clickable) {
        onItemClick?.(item, index);
      }
      if (selectable) {
        setSelectedItem(item.id);
        onItemSelect?.(item, index);
      }
    };

    const handleAction = (actionKey: string, item: TimelineItem, index: number) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(item, index);
    };

    const renderTimelineItem = (item: TimelineItem, index: number) => {
      if (renderItem) {
        return renderItem(item, index);
      }

      const isSelected = selectedItem === item.id;
      const isLast = index === data.length - 1;

      return (
        <div key={item.id} className="relative">
          {/* Timeline Item */}
          <div
            className={cn(
              "flex items-start space-x-4 p-4 rounded-lg transition-colors",
              "hover:bg-muted/50",
              isSelected && "bg-primary/10",
              clickable && "cursor-pointer",
              item.className
            )}
            onClick={() => handleItemClick(item, index)}
            style={item.style}
          >
            {/* Timeline Connector */}
            {showConnector && !isLast && (
              <div
                className={cn(
                  "absolute left-6 top-12 w-px h-full bg-border",
                  orientation === 'horizontal' && "hidden"
                )}
              />
            )}

            {/* Icon */}
            {showIcons && (
              <div className="flex-shrink-0 relative z-10">
                <div
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-full border-2 border-background",
                    "bg-background shadow-sm",
                    item.color && `border-${item.color}-500`,
                    item.status === 'completed' && "bg-green-500 border-green-500",
                    item.status === 'in-progress' && "bg-blue-500 border-blue-500",
                    item.status === 'pending' && "bg-yellow-500 border-yellow-500",
                    item.status === 'cancelled' && "bg-red-500 border-red-500",
                    item.status === 'warning' && "bg-orange-500 border-orange-500",
                    item.status === 'error' && "bg-red-500 border-red-500",
                    item.status === 'info' && "bg-blue-500 border-blue-500"
                  )}
                >
                  {renderIcon ? renderIcon(item, index) : (
                    item.icon || (
                      item.status ? getStatusIcon(item.status) : getTypeIcon(item.type)
                    )
                  )}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
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

              {/* Meta Information */}
              <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                {showDates && (
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{renderDate ? renderDate(item, index) : formatDate(item.date)}</span>
                  </div>
                )}
                {showTimes && item.time && (
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-3 w-3" />
                    <span>{formatTime(item.time)}</span>
                  </div>
                )}
                {item.location && (
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-3 w-3" />
                    <span>{item.location}</span>
                  </div>
                )}
                {item.participants && item.participants.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-3 w-3" />
                    <span>{item.participants.length} participant{item.participants.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Participants */}
              {item.participants && item.participants.length > 0 && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex -space-x-2">
                    {item.participants.slice(0, 3).map((participant, idx) => (
                      <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                        <div className="h-full w-full bg-primary/10 rounded-full flex items-center justify-center text-xs">
                          {participant.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                    ))}
                    {item.participants.length > 3 && (
                      <div className="h-6 w-6 border-2 border-background bg-muted rounded-full flex items-center justify-center text-xs">
                        +{item.participants.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    const getOrientationClasses = () => {
      switch (orientation) {
        case 'horizontal':
          return "flex flex-row overflow-x-auto space-x-4";
        case 'alternating':
          return "flex flex-col space-y-4";
        default:
          return cn("flex flex-col", spacing);
      }
    };

    return (
      <div ref={ref} className={cn(timelineVariants({ variant, orientation, size, spacing, density }), className)} {...props}>
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
          <div className={getOrientationClasses()}>
            {data.map((item, index) => renderTimelineItem(item, index))}
          </div>
        )}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";

// Timeline Sub-components
const TimelineItem = forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props} />
  )
);
TimelineItem.displayName = "TimelineItem";

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item?: TimelineItem;
  index?: number;
}

const TimelineConnector = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("absolute left-6 top-12 w-px h-full bg-border", className)} {...props} />
  )
);
TimelineConnector.displayName = "TimelineConnector";

const TimelineIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0 relative z-10", className)} {...props} />
  )
);
TimelineIcon.displayName = "TimelineIcon";

const TimelineContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
TimelineContent.displayName = "TimelineContent";

const TimelineMeta = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-4 mt-2 text-xs text-muted-foreground", className)} {...props} />
  )
);
TimelineMeta.displayName = "TimelineMeta";

const TimelineActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-1 ml-4", className)} {...props} />
  )
);
TimelineActions.displayName = "TimelineActions";

// Timeline Variants
const TimelineSolid = forwardRef<HTMLDivElement, TimelineProps>(
  ({ variant = "default", ...props }, ref) => (
    <Timeline ref={ref} variant={variant} {...props} />
  )
);
TimelineSolid.displayName = "TimelineSolid";

const TimelineTransparent = forwardRef<HTMLDivElement, TimelineProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Timeline ref={ref} variant={variant} {...props} />
  )
);
TimelineTransparent.displayName = "TimelineTransparent";

const TimelineGradient = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, ...props }, ref) => (
    <Timeline
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
TimelineGradient.displayName = "TimelineGradient";

const TimelineCard = forwardRef<HTMLDivElement, TimelineProps>(
  ({ variant = "card", ...props }, ref) => (
    <Timeline ref={ref} variant={variant} {...props} />
  )
);
TimelineCard.displayName = "TimelineCard";

const TimelineElevated = forwardRef<HTMLDivElement, TimelineProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Timeline ref={ref} variant={variant} {...props} />
  )
);
TimelineElevated.displayName = "TimelineElevated";

const TimelineGlass = forwardRef<HTMLDivElement, TimelineProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Timeline ref={ref} variant={variant} {...props} />
  )
);
TimelineGlass.displayName = "TimelineGlass";

// Orientation Variants
const TimelineVertical = forwardRef<HTMLDivElement, TimelineProps>(
  ({ orientation = "vertical", ...props }, ref) => (
    <Timeline ref={ref} orientation={orientation} {...props} />
  )
);
TimelineVertical.displayName = "TimelineVertical";

const TimelineHorizontal = forwardRef<HTMLDivElement, TimelineProps>(
  ({ orientation = "horizontal", ...props }, ref) => (
    <Timeline ref={ref} orientation={orientation} {...props} />
  )
);
TimelineHorizontal.displayName = "TimelineHorizontal";

const TimelineAlternating = forwardRef<HTMLDivElement, TimelineProps>(
  ({ orientation = "alternating", ...props }, ref) => (
    <Timeline ref={ref} orientation={orientation} {...props} />
  )
);
TimelineAlternating.displayName = "TimelineAlternating";

// Responsive Timeline
const TimelineResponsive = forwardRef<HTMLDivElement, TimelineProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Timeline {...props} />
    </div>
  )
);
TimelineResponsive.displayName = "TimelineResponsive";

// Spacing Utilities
const TimelineSpacing = {
  tight: "space-y-2",
  normal: "space-y-4",
  loose: "space-y-6"
};

// Density Utilities
const TimelineDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const TimelineCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Status Variants
const TimelineStatusVariants = {
  completed: "bg-green-500 border-green-500",
  'in-progress': "bg-blue-500 border-blue-500",
  pending: "bg-yellow-500 border-yellow-500",
  cancelled: "bg-red-500 border-red-500",
  warning: "bg-orange-500 border-orange-500",
  error: "bg-red-500 border-red-500",
  info: "bg-blue-500 border-blue-500"
};

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  TimelineContent,
  TimelineMeta,
  TimelineActions,
  TimelineSolid,
  TimelineTransparent,
  TimelineGradient,
  TimelineCard,
  TimelineElevated,
  TimelineGlass,
  TimelineVertical,
  TimelineHorizontal,
  TimelineAlternating,
  TimelineResponsive,
  TimelineSpacing,
  TimelineDensity,
  TimelineCardVariants,
  TimelineStatusVariants,
  timelineVariants
};
