"use client";

import React, { forwardRef, useState, useMemo, useCallback, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  NetworkIcon,
  NodesIcon,
  LinkIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
  DownloadIcon,
  ShareIcon,
  SettingsIcon,
  MoreHorizontalIcon,
  FilterIcon,
  EyeIcon,
  EyeOffIcon,
  MoveIcon,
  SearchIcon,
  TargetIcon,
  UsersIcon,
  GitBranchIcon,
  WorkflowIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

// Graphs Root Component
const graphsVariants = cva(
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
        force: "force-directed",
        hierarchical: "hierarchical",
        circular: "circular",
        grid: "grid",
        random: "random"
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
      layout: "force",
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface GraphsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof graphsVariants> {
  data?: GraphData;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
  animated?: boolean;
  showLabels?: boolean;
  showTooltips?: boolean;
  showControls?: boolean;
  showLegend?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onNodeClick?: (node: GraphNode, index: number) => void;
  onNodeHover?: (node: GraphNode, index: number) => void;
  onEdgeClick?: (edge: GraphEdge, index: number) => void;
  onEdgeHover?: (edge: GraphEdge, index: number) => void;
  renderNode?: (node: GraphNode, index: number) => React.ReactNode;
  renderEdge?: (edge: GraphEdge, index: number) => React.ReactNode;
  renderTooltip?: (item: GraphNode | GraphEdge, index: number) => React.ReactNode;
  actions?: GraphAction[];
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  type?: 'default' | 'source' | 'target' | 'intermediate' | 'hub' | 'isolated';
  metadata?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight?: number;
  color?: string;
  type?: 'default' | 'directed' | 'bidirectional' | 'dashed' | 'dotted';
  label?: string;
  metadata?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface GraphAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (graphData: GraphData) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

const Graphs = forwardRef<HTMLDivElement, GraphsProps>(
  ({
    className,
    variant,
    layout,
    size,
    spacing,
    density,
    data = { nodes: [], edges: [] },
    title,
    subtitle,
    width = 800,
    height = 600,
    interactive = true,
    animated = true,
    showLabels = true,
    showTooltips = true,
    showControls = true,
    showLegend = true,
    searchable = false,
    filterable = false,
    loading = false,
    emptyMessage = "No graph data available",
    onNodeClick,
    onNodeHover,
    onEdgeClick,
    onEdgeHover,
    renderNode,
    renderEdge,
    renderTooltip,
    actions = [],
    ...props
  }, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
    const [hoveredEdge, setHoveredNode] = useState<GraphEdge | null>(null);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNodes, setFilteredNodes] = useState<GraphNode[]>([]);
    const [filteredEdges, setFilteredEdges] = useState<GraphEdge[]>([]);

    // Filter nodes and edges based on search query
    useEffect(() => {
      if (!searchQuery) {
        setFilteredNodes(data.nodes);
        setFilteredEdges(data.edges);
        return;
      }

      const filtered = data.nodes.filter(node =>
        node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredNodeIds = new Set(filtered.map(node => node.id));
      const filteredEdges = data.edges.filter(edge =>
        filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
      );

      setFilteredNodes(filtered);
      setFilteredEdges(filteredEdges);
    }, [data, searchQuery]);

    const getNodeIcon = (type?: string) => {
      switch (type) {
        case 'source':
          return <TargetIcon className="h-4 w-4" />;
        case 'target':
          return <TargetIcon className="h-4 w-4" />;
        case 'hub':
          return <NetworkIcon className="h-4 w-4" />;
        case 'isolated':
          return <NodesIcon className="h-4 w-4" />;
        default:
          return <NodesIcon className="h-4 w-4" />;
      }
    };

    const getEdgeIcon = (type?: string) => {
      switch (type) {
        case 'directed':
          return <LinkIcon className="h-3 w-3" />;
        case 'bidirectional':
          return <GitBranchIcon className="h-3 w-3" />;
        default:
          return <LinkIcon className="h-3 w-3" />;
      }
    };

    const getNodeColor = (node: GraphNode) => {
      if (node.color) return node.color;
      
      switch (node.type) {
        case 'source':
          return 'hsl(var(--primary))';
        case 'target':
          return 'hsl(var(--secondary))';
        case 'hub':
          return 'hsl(var(--accent))';
        case 'isolated':
          return 'hsl(var(--muted-foreground))';
        default:
          return 'hsl(var(--foreground))';
      }
    };

    const getEdgeColor = (edge: GraphEdge) => {
      if (edge.color) return edge.color;
      return 'hsl(var(--border))';
    };

    const handleNodeClick = useCallback((node: GraphNode, index: number) => {
      setSelectedNode(node);
      onNodeClick?.(node, index);
    }, [onNodeClick]);

    const handleNodeHover = useCallback((node: GraphNode, index: number) => {
      setHoveredNode(node);
      onNodeHover?.(node, index);
    }, [onNodeHover]);

    const handleEdgeClick = useCallback((edge: GraphEdge, index: number) => {
      setSelectedEdge(edge);
      onEdgeClick?.(edge, index);
    }, [onEdgeClick]);

    const handleEdgeHover = useCallback((edge: GraphEdge, index: number) => {
      setHoveredEdge(edge);
      onEdgeHover?.(edge, index);
    }, [onEdgeHover]);

    const handleAction = useCallback((actionKey: string) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(data);
    }, [actions, data]);

    const handleZoomIn = () => {
      setZoomLevel(prev => Math.min(prev * 1.2, 3));
    };

    const handleZoomOut = () => {
      setZoomLevel(prev => Math.max(prev / 1.2, 0.1));
    };

    const handleReset = () => {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    };

    const renderGraph = () => {
      const nodeRadius = 20;
      const nodeSpacing = 100;

      // Simple layout calculation
      const nodes = filteredNodes.map((node, index) => {
        if (node.x !== undefined && node.y !== undefined) {
          return { ...node, x: node.x, y: node.y };
        }

        // Simple grid layout
        const cols = Math.ceil(Math.sqrt(filteredNodes.length));
        const row = Math.floor(index / cols);
        const col = index % cols;
        
        return {
          ...node,
          x: col * nodeSpacing + nodeRadius,
          y: row * nodeSpacing + nodeRadius
        };
      });

      return (
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0"
        >
          {/* Edges */}
          {filteredEdges.map((edge, index) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;

            const isHovered = hoveredEdge?.id === edge.id;
            const isSelected = selectedEdge?.id === edge.id;

            return (
              <g key={edge.id}>
                {/* Edge Line */}
                <line
                  x1={sourceNode.x!}
                  y1={sourceNode.y!}
                  x2={targetNode.x!}
                  y2={targetNode.y!}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={isHovered || isSelected ? 3 : 2}
                  strokeDasharray={edge.type === 'dashed' ? '5,5' : edge.type === 'dotted' ? '2,2' : 'none'}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isHovered && "opacity-80",
                    isSelected && "stroke-primary"
                  )}
                  onClick={() => handleEdgeClick(edge, index)}
                  onMouseEnter={() => handleEdgeHover(edge, index)}
                  onMouseLeave={() => setHoveredEdge(null)}
                />

                {/* Edge Arrow (for directed edges) */}
                {edge.type === 'directed' && (
                  <polygon
                    points={`${targetNode.x! - 10},${targetNode.y! - 5} ${targetNode.x! - 10},${targetNode.y! + 5} ${targetNode.x!},${targetNode.y!}`}
                    fill={getEdgeColor(edge)}
                    className="cursor-pointer"
                    onClick={() => handleEdgeClick(edge, index)}
                    onMouseEnter={() => handleEdgeHover(edge, index)}
                    onMouseLeave={() => setHoveredEdge(null)}
                  />
                )}

                {/* Edge Label */}
                {edge.label && showLabels && (
                  <text
                    x={(sourceNode.x! + targetNode.x!) / 2}
                    y={(sourceNode.y! + targetNode.y!) / 2}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground pointer-events-none"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const isHovered = hoveredNode?.id === node.id;
            const isSelected = selectedNode?.id === node.id;
            const nodeSize = node.size || nodeRadius;

            return (
              <g key={node.id}>
                {/* Node Circle */}
                <circle
                  cx={node.x!}
                  cy={node.y!}
                  r={nodeSize}
                  fill={getNodeColor(node)}
                  stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                  strokeWidth={isSelected ? 3 : 1}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    isHovered && "opacity-80",
                    node.className
                  )}
                  onClick={() => handleNodeClick(node, index)}
                  onMouseEnter={() => handleNodeHover(node, index)}
                  onMouseLeave={() => setHoveredNode(null)}
                />

                {/* Node Icon */}
                <g
                  transform={`translate(${node.x! - 8}, ${node.y! - 8})`}
                  className="pointer-events-none"
                >
                  {getNodeIcon(node.type)}
                </g>

                {/* Node Label */}
                {showLabels && (
                  <text
                    x={node.x!}
                    y={node.y! + nodeSize + 20}
                    textAnchor="middle"
                    className="text-xs fill-foreground pointer-events-none"
                  >
                    {node.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      );
    };

    const renderTooltipContent = () => {
      if (!showTooltips) return null;

      const item = hoveredNode || hoveredEdge;
      if (!item) return null;

      if (renderTooltip) {
        return renderTooltip(item, 0);
      }

      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <div className="text-sm font-medium">
            {hoveredNode ? hoveredNode.label : hoveredEdge?.label || 'Edge'}
          </div>
          <div className="text-sm text-muted-foreground">
            {hoveredNode ? `Type: ${hoveredNode.type || 'default'}` : `Weight: ${hoveredEdge?.weight || 1}`}
          </div>
        </div>
      );
    };

    const renderLegendContent = () => {
      if (!showLegend) return null;

      const nodeTypes = [...new Set(filteredNodes.map(node => node.type || 'default'))];
      const edgeTypes = [...new Set(filteredEdges.map(edge => edge.type || 'default'))];

      return (
        <div className="flex flex-wrap gap-4 mt-4">
          {/* Node Types */}
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Node Types</div>
            {nodeTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getNodeColor({ id: '', label: '', type: type as any }) }}
                />
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>

          {/* Edge Types */}
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Edge Types</div>
            {edgeTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-4 h-0.5"
                  style={{ backgroundColor: getEdgeColor({ id: '', source: '', target: '', type: type as any }) }}
                />
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div ref={ref} className={cn(graphsVariants({ variant, layout, size, spacing, density }), className)} {...props}>
        {/* Header */}
        {(title || subtitle || actions.length > 0 || showControls) && (
          <div className="flex items-center justify-between mb-4">
            <div>
              {title && (
                <h3 className="font-semibold text-foreground">{title}</h3>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* Search */}
              {searchable && (
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search nodes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
              )}

              {/* Controls */}
              {showControls && (
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" onClick={handleZoomIn} className="h-8 w-8 p-0">
                    <ZoomInIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleZoomOut} className="h-8 w-8 p-0">
                    <ZoomOutIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 w-8 p-0">
                    <RotateCcwIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex items-center space-x-1">
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
          </div>
        )}

        {/* Graph */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Loading graph...</span>
              </div>
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div
              className="relative border border-border rounded-lg overflow-hidden"
              style={{
                width: '100%',
                height: `${height}px`,
                minHeight: '400px'
              }}
            >
              {renderGraph()}
              
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

Graphs.displayName = "Graphs";

// Graphs Sub-components
const GraphContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative border border-border rounded-lg overflow-hidden", className)} {...props} />
  )
);
GraphContainer.displayName = "GraphContainer";

const GraphHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between mb-4", className)} {...props} />
  )
);
GraphHeader.displayName = "GraphHeader";

const GraphTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-semibold text-foreground", className)} {...props} />
  )
);
GraphTitle.displayName = "GraphTitle";

const GraphSubtitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
GraphSubtitle.displayName = "GraphSubtitle";

const GraphControls = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
  )
);
GraphControls.displayName = "GraphControls";

const GraphLegend = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap gap-4 mt-4", className)} {...props} />
  )
);
GraphLegend.displayName = "GraphLegend";

const GraphTooltip = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-background border border-border rounded-lg p-3 shadow-lg", className)} {...props} />
  )
);
GraphTooltip.displayName = "GraphTooltip";

// Graphs Variants
const GraphsSolid = forwardRef<HTMLDivElement, GraphsProps>(
  ({ variant = "default", ...props }, ref) => (
    <Graphs ref={ref} variant={variant} {...props} />
  )
);
GraphsSolid.displayName = "GraphsSolid";

const GraphsTransparent = forwardRef<HTMLDivElement, GraphsProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Graphs ref={ref} variant={variant} {...props} />
  )
);
GraphsTransparent.displayName = "GraphsTransparent";

const GraphsGradient = forwardRef<HTMLDivElement, GraphsProps>(
  ({ className, ...props }, ref) => (
    <Graphs
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
GraphsGradient.displayName = "GraphsGradient";

const GraphsCard = forwardRef<HTMLDivElement, GraphsProps>(
  ({ variant = "card", ...props }, ref) => (
    <Graphs ref={ref} variant={variant} {...props} />
  )
);
GraphsCard.displayName = "GraphsCard";

const GraphsElevated = forwardRef<HTMLDivElement, GraphsProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Graphs ref={ref} variant={variant} {...props} />
  )
);
GraphsElevated.displayName = "GraphsElevated";

const GraphsGlass = forwardRef<HTMLDivElement, GraphsProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Graphs ref={ref} variant={variant} {...props} />
  )
);
GraphsGlass.displayName = "GraphsGlass";

// Layout Variants
const ForceDirectedGraph = forwardRef<HTMLDivElement, GraphsProps>(
  ({ layout = "force", ...props }, ref) => (
    <Graphs ref={ref} layout={layout} {...props} />
  )
);
ForceDirectedGraph.displayName = "ForceDirectedGraph";

const HierarchicalGraph = forwardRef<HTMLDivElement, GraphsProps>(
  ({ layout = "hierarchical", ...props }, ref) => (
    <Graphs ref={ref} layout={layout} {...props} />
  )
);
HierarchicalGraph.displayName = "HierarchicalGraph";

const CircularGraph = forwardRef<HTMLDivElement, GraphsProps>(
  ({ layout = "circular", ...props }, ref) => (
    <Graphs ref={ref} layout={layout} {...props} />
  )
);
CircularGraph.displayName = "CircularGraph";

const GridGraph = forwardRef<HTMLDivElement, GraphsProps>(
  ({ layout = "grid", ...props }, ref) => (
    <Graphs ref={ref} layout={layout} {...props} />
  )
);
GridGraph.displayName = "GridGraph";

// Responsive Graphs
const GraphsResponsive = forwardRef<HTMLDivElement, GraphsProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Graphs {...props} />
    </div>
  )
);
GraphsResponsive.displayName = "GraphsResponsive";

// Spacing Utilities
const GraphsSpacing = {
  tight: "space-y-2",
  normal: "space-y-4",
  loose: "space-y-6"
};

// Density Utilities
const GraphsDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const GraphsCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Layout Types
const GraphsLayouts = {
  force: "force-directed",
  hierarchical: "hierarchical",
  circular: "circular",
  grid: "grid",
  random: "random"
};

// Node Types
const GraphsNodeTypes = {
  default: "default",
  source: "source",
  target: "target",
  intermediate: "intermediate",
  hub: "hub",
  isolated: "isolated"
};

// Edge Types
const GraphsEdgeTypes = {
  default: "default",
  directed: "directed",
  bidirectional: "bidirectional",
  dashed: "dashed",
  dotted: "dotted"
};

export {
  Graphs,
  GraphContainer,
  GraphHeader,
  GraphTitle,
  GraphSubtitle,
  GraphControls,
  GraphLegend,
  GraphTooltip,
  GraphsSolid,
  GraphsTransparent,
  GraphsGradient,
  GraphsCard,
  GraphsElevated,
  GraphsGlass,
  ForceDirectedGraph,
  HierarchicalGraph,
  CircularGraph,
  GridGraph,
  GraphsResponsive,
  GraphsSpacing,
  GraphsDensity,
  GraphsCardVariants,
  GraphsLayouts,
  GraphsNodeTypes,
  GraphsEdgeTypes,
  graphsVariants
};
