"use client";

import React, { forwardRef, useState, useMemo, useCallback, useRef, useEffect } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { 
  MapIcon,
  MapPinIcon,
  NavigationIcon,
  CompassIcon,
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
  SearchIcon,
  TargetIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  FlagIcon,
  HomeIcon,
  BuildingIcon,
  CarIcon,
  PlaneIcon,
  TrainIcon,
  ShipIcon
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Input } from "./input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";

// Maps Root Component
const mapsVariants = cva(
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
      type: {
        road: "road-map",
        satellite: "satellite",
        terrain: "terrain",
        hybrid: "hybrid",
        street: "street-view"
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
      type: "road",
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface MapsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mapsVariants> {
  data?: MapData;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  center?: { lat: number; lng: number };
  zoom?: number;
  interactive?: boolean;
  showControls?: boolean;
  showMarkers?: boolean;
  showClusters?: boolean;
  showRoutes?: boolean;
  showHeatmap?: boolean;
  showTraffic?: boolean;
  showSatellite?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onMarkerClick?: (marker: MapMarker, index: number) => void;
  onMarkerHover?: (marker: MapMarker, index: number) => void;
  onMapClick?: (coordinates: { lat: number; lng: number }) => void;
  onZoomChange?: (zoom: number) => void;
  onCenterChange?: (center: { lat: number; lng: number }) => void;
  renderMarker?: (marker: MapMarker, index: number) => React.ReactNode;
  renderPopup?: (marker: MapMarker, index: number) => React.ReactNode;
  actions?: MapAction[];
}

export interface MapData {
  markers: MapMarker[];
  routes?: MapRoute[];
  polygons?: MapPolygon[];
  circles?: MapCircle[];
}

export interface MapMarker {
  id: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  type?: 'default' | 'restaurant' | 'hotel' | 'attraction' | 'transport' | 'shopping' | 'entertainment' | 'custom';
  category?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  metadata?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface MapRoute {
  id: string;
  name: string;
  waypoints: { lat: number; lng: number }[];
  color?: string;
  weight?: number;
  metadata?: any;
}

export interface MapPolygon {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number }[];
  color?: string;
  fillColor?: string;
  metadata?: any;
}

export interface MapCircle {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number;
  color?: string;
  fillColor?: string;
  metadata?: any;
}

export interface MapAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (mapData: MapData) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: boolean;
}

const Maps = forwardRef<HTMLDivElement, MapsProps>(
  ({
    className,
    variant,
    type,
    size,
    spacing,
    density,
    data = { markers: [] },
    title,
    subtitle,
    width = 800,
    height = 600,
    center = { lat: 40.7128, lng: -74.0060 }, // New York City
    zoom = 10,
    interactive = true,
    showControls = true,
    showMarkers = true,
    showClusters = true,
    showRoutes = true,
    showHeatmap = false,
    showTraffic = false,
    showSatellite = false,
    searchable = false,
    filterable = false,
    loading = false,
    emptyMessage = "No map data available",
    onMarkerClick,
    onMarkerHover,
    onMapClick,
    onZoomChange,
    onCenterChange,
    renderMarker,
    renderPopup,
    actions = [],
    ...props
  }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
    const [currentZoom, setCurrentZoom] = useState(zoom);
    const [currentCenter, setCurrentCenter] = useState(center);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>([]);
    const [mapType, setMapType] = useState(type);

    // Filter markers based on search query
    useEffect(() => {
      if (!searchQuery) {
        setFilteredMarkers(data.markers);
        return;
      }

      const filtered = data.markers.filter(marker =>
        marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        marker.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setFilteredMarkers(filtered);
    }, [data.markers, searchQuery]);

    const getMarkerIcon = (markerType?: string) => {
      switch (markerType) {
        case 'restaurant':
          return <StarIcon className="h-4 w-4" />;
        case 'hotel':
          return <BuildingIcon className="h-4 w-4" />;
        case 'attraction':
          return <FlagIcon className="h-4 w-4" />;
        case 'transport':
          return <CarIcon className="h-4 w-4" />;
        case 'shopping':
          return <HeartIcon className="h-4 w-4" />;
        case 'entertainment':
          return <UsersIcon className="h-4 w-4" />;
        default:
          return <MapPinIcon className="h-4 w-4" />;
      }
    };

    const getMarkerColor = (marker: MapMarker) => {
      if (marker.color) return marker.color;
      
      switch (marker.type) {
        case 'restaurant':
          return 'hsl(var(--primary))';
        case 'hotel':
          return 'hsl(var(--secondary))';
        case 'attraction':
          return 'hsl(var(--accent))';
        case 'transport':
          return 'hsl(var(--muted-foreground))';
        case 'shopping':
          return 'hsl(var(--destructive))';
        case 'entertainment':
          return 'hsl(var(--warning))';
        default:
          return 'hsl(var(--foreground))';
      }
    };

    const getMarkerSize = (size?: string) => {
      switch (size) {
        case 'sm':
          return 'w-6 h-6';
        case 'lg':
          return 'w-10 h-10';
        default:
          return 'w-8 h-8';
      }
    };

    const handleMarkerClick = useCallback((marker: MapMarker, index: number) => {
      setSelectedMarker(marker);
      onMarkerClick?.(marker, index);
    }, [onMarkerClick]);

    const handleMarkerHover = useCallback((marker: MapMarker, index: number) => {
      setHoveredMarker(marker);
      onMarkerHover?.(marker, index);
    }, [onMarkerHover]);

    const handleMapClick = useCallback((event: React.MouseEvent) => {
      if (!mapRef.current) return;
      
      const rect = mapRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Simple coordinate conversion (this would be more complex in a real implementation)
      const lat = currentCenter.lat + (y - rect.height / 2) * 0.001;
      const lng = currentCenter.lng + (x - rect.width / 2) * 0.001;
      
      onMapClick?.({ lat, lng });
    }, [currentCenter, onMapClick]);

    const handleZoomIn = () => {
      const newZoom = Math.min(currentZoom + 1, 20);
      setCurrentZoom(newZoom);
      onZoomChange?.(newZoom);
    };

    const handleZoomOut = () => {
      const newZoom = Math.max(currentZoom - 1, 1);
      setCurrentZoom(newZoom);
      onZoomChange?.(newZoom);
    };

    const handleReset = () => {
      setCurrentZoom(zoom);
      setCurrentCenter(center);
      onZoomChange?.(zoom);
      onCenterChange?.(center);
    };

    const handleAction = useCallback((actionKey: string) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(data);
    }, [actions, data]);

    const renderMap = () => {
      return (
        <div
          ref={mapRef}
          className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden"
          style={{ width: '100%', height: `${height}px`, minHeight: '400px' }}
          onClick={handleMapClick}
        >
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            {/* Simple grid pattern to simulate map */}
            <div className="absolute inset-0 opacity-20">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="absolute w-full h-px bg-border" style={{ top: `${i * 5}%` }} />
              ))}
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="absolute h-full w-px bg-border" style={{ left: `${i * 5}%` }} />
              ))}
            </div>
          </div>

          {/* Routes */}
          {showRoutes && data.routes && data.routes.map((route, index) => (
            <div key={route.id} className="absolute">
              {/* Route visualization would go here */}
              <div className="text-xs text-muted-foreground p-2 bg-background/80 rounded">
                Route: {route.name}
              </div>
            </div>
          ))}

          {/* Markers */}
          {showMarkers && filteredMarkers.map((marker, index) => {
            const isHovered = hoveredMarker?.id === marker.id;
            const isSelected = selectedMarker?.id === marker.id;

            return (
              <div
                key={marker.id}
                className={cn(
                  "absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200",
                  getMarkerSize(marker.size),
                  isHovered && "scale-110",
                  isSelected && "ring-2 ring-primary"
                )}
                style={{
                  left: `${50 + (marker.lng - currentCenter.lng) * 100}%`,
                  top: `${50 + (marker.lat - currentCenter.lat) * 100}%`,
                  ...marker.style
                }}
                onClick={() => handleMarkerClick(marker, index)}
                onMouseEnter={() => handleMarkerHover(marker, index)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                {renderMarker ? renderMarker(marker, index) : (
                  <div
                    className={cn(
                      "w-full h-full rounded-full border-2 border-background flex items-center justify-center text-background",
                      marker.className
                    )}
                    style={{ backgroundColor: getMarkerColor(marker) }}
                  >
                    {marker.icon || getMarkerIcon(marker.type)}
                  </div>
                )}

                {/* Marker Label */}
                {marker.title && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-background border border-border rounded px-2 py-1 whitespace-nowrap">
                    {marker.title}
                  </div>
                )}
              </div>
            );
          })}

          {/* Clusters */}
          {showClusters && filteredMarkers.length > 10 && (
            <div className="absolute top-4 right-4 bg-background border border-border rounded-lg p-2">
              <div className="text-xs text-muted-foreground">
                {filteredMarkers.length} markers
              </div>
            </div>
          )}

          {/* Heatmap Overlay */}
          {showHeatmap && (
            <div className="absolute inset-0 bg-red-500/20 pointer-events-none">
              <div className="absolute top-4 left-4 text-xs text-red-600 bg-background/80 px-2 py-1 rounded">
                Heatmap Active
              </div>
            </div>
          )}

          {/* Traffic Overlay */}
          {showTraffic && (
            <div className="absolute inset-0 bg-yellow-500/20 pointer-events-none">
              <div className="absolute top-4 left-4 text-xs text-yellow-600 bg-background/80 px-2 py-1 rounded">
                Traffic Data
              </div>
            </div>
          )}

          {/* Satellite Overlay */}
          {showSatellite && (
            <div className="absolute inset-0 bg-green-500/20 pointer-events-none">
              <div className="absolute top-4 left-4 text-xs text-green-600 bg-background/80 px-2 py-1 rounded">
                Satellite View
              </div>
            </div>
          )}
        </div>
      );
    };

    const renderPopupContent = () => {
      if (!selectedMarker) return null;

      if (renderPopup) {
        return renderPopup(selectedMarker, 0);
      }

      return (
        <div className="bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs">
          <div className="flex items-center space-x-2 mb-2">
            {getMarkerIcon(selectedMarker.type)}
            <h3 className="font-medium text-foreground">{selectedMarker.title}</h3>
          </div>
          {selectedMarker.description && (
            <p className="text-sm text-muted-foreground mb-2">{selectedMarker.description}</p>
          )}
          {selectedMarker.category && (
            <Badge variant="secondary" className="text-xs">
              {selectedMarker.category}
            </Badge>
          )}
        </div>
      );
    };

    const renderLegendContent = () => {
      const markerTypes = [...new Set(filteredMarkers.map(marker => marker.type || 'default'))];

      return (
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Marker Types</div>
            {markerTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full flex items-center justify-center text-background text-xs"
                  style={{ backgroundColor: getMarkerColor({ id: '', title: '', lat: 0, lng: 0, type: type as any }) }}
                >
                  {getMarkerIcon(type)}
                </div>
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div ref={ref} className={cn(mapsVariants({ variant, type, size, spacing, density }), className)} {...props}>
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
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
              )}

              {/* Map Type Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MapIcon className="h-4 w-4 mr-2" />
                    {mapType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setMapType('road')}>
                    Road Map
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMapType('satellite')}>
                    Satellite
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMapType('terrain')}>
                    Terrain
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMapType('hybrid')}>
                    Hybrid
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

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

        {/* Map */}
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Loading map...</span>
              </div>
            </div>
          ) : filteredMarkers.length === 0 && !data.routes?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <>
              {renderMap()}
              
              {/* Popup */}
              {selectedMarker && (
                <div className="absolute top-4 left-4 z-10">
                  {renderPopupContent()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Legend */}
        {renderLegendContent()}
      </div>
    );
  }
);

Maps.displayName = "Maps";

// Maps Sub-components
const MapContainer = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative w-full h-full bg-muted/20 rounded-lg overflow-hidden", className)} {...props} />
  )
);
MapContainer.displayName = "MapContainer";

const MapHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center justify-between mb-4", className)} {...props} />
  )
);
MapHeader.displayName = "MapHeader";

const MapTitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("font-semibold text-foreground", className)} {...props} />
  )
);
MapTitle.displayName = "MapTitle";

const MapSubtitle = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);
MapSubtitle.displayName = "MapSubtitle";

const MapControls = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2", className)} {...props} />
  )
);
MapControls.displayName = "MapControls";

const MapLegend = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-wrap gap-4 mt-4", className)} {...props} />
  )
);
MapLegend.displayName = "MapLegend";

const MapPopup = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("bg-background border border-border rounded-lg p-4 shadow-lg max-w-xs", className)} {...props} />
  )
);
MapPopup.displayName = "MapPopup";

// Maps Variants
const MapsSolid = forwardRef<HTMLDivElement, MapsProps>(
  ({ variant = "default", ...props }, ref) => (
    <Maps ref={ref} variant={variant} {...props} />
  )
);
MapsSolid.displayName = "MapsSolid";

const MapsTransparent = forwardRef<HTMLDivElement, MapsProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Maps ref={ref} variant={variant} {...props} />
  )
);
MapsTransparent.displayName = "MapsTransparent";

const MapsGradient = forwardRef<HTMLDivElement, MapsProps>(
  ({ className, ...props }, ref) => (
    <Maps
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
MapsGradient.displayName = "MapsGradient";

const MapsCard = forwardRef<HTMLDivElement, MapsProps>(
  ({ variant = "card", ...props }, ref) => (
    <Maps ref={ref} variant={variant} {...props} />
  )
);
MapsCard.displayName = "MapsCard";

const MapsElevated = forwardRef<HTMLDivElement, MapsProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Maps ref={ref} variant={variant} {...props} />
  )
);
MapsElevated.displayName = "MapsElevated";

const MapsGlass = forwardRef<HTMLDivElement, MapsProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Maps ref={ref} variant={variant} {...props} />
  )
);
MapsGlass.displayName = "MapsGlass";

// Map Type Variants
const RoadMap = forwardRef<HTMLDivElement, MapsProps>(
  ({ type = "road", ...props }, ref) => (
    <Maps ref={ref} type={type} {...props} />
  )
);
RoadMap.displayName = "RoadMap";

const SatelliteMap = forwardRef<HTMLDivElement, MapsProps>(
  ({ type = "satellite", ...props }, ref) => (
    <Maps ref={ref} type={type} {...props} />
  )
);
SatelliteMap.displayName = "SatelliteMap";

const TerrainMap = forwardRef<HTMLDivElement, MapsProps>(
  ({ type = "terrain", ...props }, ref) => (
    <Maps ref={ref} type={type} {...props} />
  )
);
TerrainMap.displayName = "TerrainMap";

const HybridMap = forwardRef<HTMLDivElement, MapsProps>(
  ({ type = "hybrid", ...props }, ref) => (
    <Maps ref={ref} type={type} {...props} />
  )
);
HybridMap.displayName = "HybridMap";

// Responsive Maps
const MapsResponsive = forwardRef<HTMLDivElement, MapsProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
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
      <Maps {...props} />
    </div>
  )
);
MapsResponsive.displayName = "MapsResponsive";

// Spacing Utilities
const MapsSpacing = {
  tight: "space-y-2",
  normal: "space-y-4",
  loose: "space-y-6"
};

// Density Utilities
const MapsDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const MapsCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Map Types
const MapsTypes = {
  road: "road-map",
  satellite: "satellite",
  terrain: "terrain",
  hybrid: "hybrid",
  street: "street-view"
};

// Marker Types
const MapsMarkerTypes = {
  default: "default",
  restaurant: "restaurant",
  hotel: "hotel",
  attraction: "attraction",
  transport: "transport",
  shopping: "shopping",
  entertainment: "entertainment",
  custom: "custom"
};

// Marker Sizes
const MapsMarkerSizes = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-10 h-10"
};

export {
  Maps,
  MapContainer,
  MapHeader,
  MapTitle,
  MapSubtitle,
  MapControls,
  MapLegend,
  MapPopup,
  MapsSolid,
  MapsTransparent,
  MapsGradient,
  MapsCard,
  MapsElevated,
  MapsGlass,
  RoadMap,
  SatelliteMap,
  TerrainMap,
  HybridMap,
  MapsResponsive,
  MapsSpacing,
  MapsDensity,
  MapsCardVariants,
  MapsTypes,
  MapsMarkerTypes,
  MapsMarkerSizes,
  mapsVariants
};
