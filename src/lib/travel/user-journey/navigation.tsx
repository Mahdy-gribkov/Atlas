/**
 * Navigation Component
 * 
 * Provides comprehensive navigation functionality for Atlas travel agent.
 * Implements GPS navigation, offline maps, and route planning features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Navigation Variants
const navigationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'navigation-mode-standard',
        'enhanced': 'navigation-mode-enhanced',
        'advanced': 'navigation-mode-advanced',
        'custom': 'navigation-mode-custom'
      },
      type: {
        'driving': 'navigation-type-driving',
        'walking': 'navigation-type-walking',
        'transit': 'navigation-type-transit',
        'cycling': 'navigation-type-cycling',
        'mixed': 'navigation-type-mixed'
      },
      style: {
        'minimal': 'navigation-style-minimal',
        'moderate': 'navigation-style-moderate',
        'detailed': 'navigation-style-detailed',
        'custom': 'navigation-style-custom'
      },
      format: {
        'text': 'navigation-format-text',
        'visual': 'navigation-format-visual',
        'interactive': 'navigation-format-interactive',
        'mixed': 'navigation-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Navigation Props
interface NavigationProps extends VariantProps<typeof navigationVariants> {
  className?: string;
  onNavigationUpdate?: (navigation: NavigationData) => void;
  initialNavigation?: Partial<NavigationData>;
  showMap?: boolean;
  showOffline?: boolean;
  showTraffic?: boolean;
  showAlternatives?: boolean;
}

// Navigation Data Interface
interface NavigationData {
  id: string;
  route: NavigationRoute;
  currentLocation: Location;
  destination: Location;
  isNavigating: boolean;
  isOffline: boolean;
  settings: NavigationSettings;
  history: NavigationHistory[];
  favorites: FavoriteLocation[];
  offlineMaps: OfflineMap[];
  createdAt: Date;
  updatedAt: Date;
}

// Navigation Route Interface
interface NavigationRoute {
  id: string;
  origin: Location;
  destination: Location;
  waypoints: Location[];
  steps: RouteStep[];
  distance: number; // in meters
  duration: number; // in seconds
  trafficDelay?: number; // in seconds
  tolls: Toll[];
  fuelCost?: number;
  currency: string;
  mode: 'driving' | 'walking' | 'transit' | 'cycling';
  alternatives: AlternativeRoute[];
  createdAt: Date;
}

// Location Interface
interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'address' | 'landmark' | 'business' | 'custom';
  category?: string;
  rating?: number;
  isFavorite: boolean;
}

// Route Step Interface
interface RouteStep {
  id: string;
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
  startLocation: Location;
  endLocation: Location;
  maneuver: {
    type: 'turn' | 'straight' | 'merge' | 'exit' | 'arrive' | 'depart';
    direction?: 'left' | 'right' | 'straight' | 'slight-left' | 'slight-right' | 'sharp-left' | 'sharp-right';
    bearing?: number;
  };
  roadName?: string;
  roadType?: string;
  isToll?: boolean;
  speedLimit?: number;
  trafficCondition?: 'light' | 'moderate' | 'heavy' | 'severe';
}

// Toll Interface
interface Toll {
  id: string;
  name: string;
  cost: number;
  currency: string;
  location: Location;
  type: 'bridge' | 'tunnel' | 'highway' | 'ferry';
}

// Alternative Route Interface
interface AlternativeRoute {
  id: string;
  distance: number;
  duration: number;
  summary: string;
  steps: RouteStep[];
  isRecommended: boolean;
}

// Navigation Settings Interface
interface NavigationSettings {
  voiceGuidance: boolean;
  voiceLanguage: string;
  speedLimitWarnings: boolean;
  trafficAlerts: boolean;
  tollAvoidance: boolean;
  highwayAvoidance: boolean;
  ferryAvoidance: boolean;
  unitSystem: 'metric' | 'imperial';
  mapStyle: 'standard' | 'satellite' | 'terrain' | 'hybrid';
  nightMode: boolean;
  autoZoom: boolean;
}

// Navigation History Interface
interface NavigationHistory {
  id: string;
  origin: Location;
  destination: Location;
  route: NavigationRoute;
  completedAt: Date;
  duration: number;
  distance: number;
}

// Favorite Location Interface
interface FavoriteLocation {
  id: string;
  location: Location;
  category: 'home' | 'work' | 'frequent' | 'custom';
  addedAt: Date;
}

// Offline Map Interface
interface OfflineMap {
  id: string;
  name: string;
  region: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  size: number; // in MB
  downloadedAt: Date;
  expiresAt: Date;
  isDownloaded: boolean;
}

// Navigation Component
export const Navigation = React.forwardRef<HTMLDivElement, NavigationProps>(
  ({ 
    className, 
    onNavigationUpdate,
    initialNavigation,
    showMap = true,
    showOffline = true,
    showTraffic = true,
    showAlternatives = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [navigation, setNavigation] = useState<NavigationData>(
      initialNavigation || {
        id: '',
        route: {} as NavigationRoute,
        currentLocation: {
          id: '',
          name: 'Current Location',
          address: '',
          coordinates: { lat: 0, lng: 0 },
          type: 'address',
          isFavorite: false
        },
        destination: {
          id: '',
          name: '',
          address: '',
          coordinates: { lat: 0, lng: 0 },
          type: 'address',
          isFavorite: false
        },
        isNavigating: false,
        isOffline: false,
        settings: {
          voiceGuidance: true,
          voiceLanguage: 'en',
          speedLimitWarnings: true,
          trafficAlerts: true,
          tollAvoidance: false,
          highwayAvoidance: false,
          ferryAvoidance: false,
          unitSystem: 'metric',
          mapStyle: 'standard',
          nightMode: false,
          autoZoom: true
        },
        history: [],
        favorites: [],
        offlineMaps: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('search');
    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Location[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    const tabs = [
      { id: 'search', name: 'Search', icon: '🔍' },
      { id: 'route', name: 'Route', icon: '🗺️' },
      { id: 'navigation', name: 'Navigate', icon: '🧭' },
      { id: 'offline', name: 'Offline', icon: '📱' }
    ];

    const updateNavigation = useCallback((path: string, value: any) => {
      setNavigation(prev => {
        const newNavigation = { ...prev };
        const keys = path.split('.');
        let current: any = newNavigation;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newNavigation.updatedAt = new Date();
        onNavigationUpdate?.(newNavigation);
        return newNavigation;
      });
    }, [onNavigationUpdate]);

    const searchLocation = useCallback(async (query: string) => {
      if (!query.trim()) return;
      
      setIsSearching(true);
      
      // Simulate search API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResults: Location[] = [
        {
          id: 'loc-1',
          name: 'Eiffel Tower',
          address: 'Champ de Mars, 7th arrondissement, Paris',
          coordinates: { lat: 48.8584, lng: 2.2945 },
          type: 'landmark',
          category: 'attraction',
          rating: 4.5,
          isFavorite: false
        },
        {
          id: 'loc-2',
          name: 'Louvre Museum',
          address: 'Rue de Rivoli, 1st arrondissement, Paris',
          coordinates: { lat: 48.8606, lng: 2.3376 },
          type: 'landmark',
          category: 'museum',
          rating: 4.7,
          isFavorite: false
        },
        {
          id: 'loc-3',
          name: 'Notre-Dame Cathedral',
          address: '6 Parvis Notre-Dame, 4th arrondissement, Paris',
          coordinates: { lat: 48.8530, lng: 2.3499 },
          type: 'landmark',
          category: 'religious',
          rating: 4.6,
          isFavorite: false
        }
      ];
      
      setSearchResults(mockResults);
      setIsSearching(false);
    }, []);

    const selectDestination = useCallback((location: Location) => {
      updateNavigation('destination', location);
      setActiveTab('route');
    }, [updateNavigation]);

    const startNavigation = useCallback(() => {
      updateNavigation('isNavigating', true);
      setActiveTab('navigation');
    }, [updateNavigation]);

    const stopNavigation = useCallback(() => {
      updateNavigation('isNavigating', false);
      setCurrentStep(0);
    }, [updateNavigation]);

    const nextStep = useCallback(() => {
      if (navigation.route.steps && currentStep < navigation.route.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }, [navigation.route.steps, currentStep]);

    const previousStep = useCallback(() => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    }, [currentStep]);

    const addToFavorites = useCallback((location: Location) => {
      const favorite: FavoriteLocation = {
        id: `fav-${Date.now()}`,
        location,
        category: 'custom',
        addedAt: new Date()
      };
      updateNavigation('favorites', [...navigation.favorites, favorite]);
    }, [navigation.favorites, updateNavigation]);

    const removeFromFavorites = useCallback((favoriteId: string) => {
      const updatedFavorites = navigation.favorites.filter(fav => fav.id !== favoriteId);
      updateNavigation('favorites', updatedFavorites);
    }, [navigation.favorites, updateNavigation]);

    const formatDistance = (meters: number) => {
      if (navigation.settings.unitSystem === 'imperial') {
        const miles = meters * 0.000621371;
        return miles < 0.1 ? `${Math.round(miles * 5280)} ft` : `${miles.toFixed(1)} mi`;
      } else {
        return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
      }
    };

    const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}m`;
      }
    };

    const getManeuverIcon = (maneuver: RouteStep['maneuver']) => {
      switch (maneuver.type) {
        case 'turn':
          switch (maneuver.direction) {
            case 'left': return '↰';
            case 'right': return '↱';
            case 'slight-left': return '↖';
            case 'slight-right': return '↗';
            case 'sharp-left': return '↶';
            case 'sharp-right': return '↷';
            default: return '→';
          }
        case 'straight': return '→';
        case 'merge': return '⇄';
        case 'exit': return '↗';
        case 'arrive': return '🏁';
        case 'depart': return '🚀';
        default: return '→';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          navigationVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Navigation
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {navigation.isNavigating ? 'Navigating to destination' : 'Plan your route'}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => updateNavigation('settings.nightMode', !navigation.settings.nightMode)}
              className={cn(
                'px-4 py-2 rounded-md transition-colors duration-200',
                navigation.settings.nightMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              )}
            >
              {navigation.settings.nightMode ? '🌙' : '☀️'}
            </button>
            {showOffline && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                📱 Offline
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchLocation(searchQuery)}
                  placeholder="Search for a location..."
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                />
                <button
                  onClick={() => searchLocation(searchQuery)}
                  disabled={isSearching}
                  className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSearching ? '🔍' : 'Search'}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((location) => (
                    <div
                      key={location.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                      onClick={() => selectDestination(location)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {location.type === 'landmark' ? '🏛️' :
                           location.type === 'business' ? '🏢' : '📍'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {location.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {location.address}
                          </div>
                          {location.rating && (
                            <div className="text-xs text-yellow-600 dark:text-yellow-400">
                              ⭐ {location.rating}
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToFavorites(location);
                        }}
                        className="p-1 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
                      >
                        ⭐
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Favorites */}
              {navigation.favorites.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Favorites
                  </h3>
                  <div className="space-y-2">
                    {navigation.favorites.map((favorite) => (
                      <div
                        key={favorite.id}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                        onClick={() => selectDestination(favorite.location)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">⭐</div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              {favorite.location.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {favorite.location.address}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromFavorites(favorite.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'route' && (
            <div className="space-y-4">
              {navigation.destination.name ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Route to {navigation.destination.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatDistance(navigation.route.distance || 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatDuration(navigation.route.duration || 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {navigation.route.mode?.charAt(0).toUpperCase() + navigation.route.mode?.slice(1)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Mode</div>
                    </div>
                  </div>

                  {showAlternatives && navigation.route.alternatives && navigation.route.alternatives.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Alternative Routes
                      </h4>
                      <div className="space-y-2">
                        {navigation.route.alternatives.map((alternative) => (
                          <div
                            key={alternative.id}
                            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                          >
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-100">
                                {alternative.summary}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDistance(alternative.distance)} • {formatDuration(alternative.duration)}
                              </div>
                            </div>
                            {alternative.isRecommended && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                                Recommended
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={startNavigation}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Start Navigation
                    </button>
                    <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      Share Route
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No destination selected
                  </h3>
                  <p>Search for a location to plan your route</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'navigation' && (
            <div className="space-y-4">
              {navigation.isNavigating ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🧭</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Navigating to {navigation.destination.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Step {currentStep + 1} of {navigation.route.steps?.length || 0}
                    </p>
                  </div>

                  {navigation.route.steps && navigation.route.steps[currentStep] && (
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-3xl">
                          {getManeuverIcon(navigation.route.steps[currentStep].maneuver)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {navigation.route.steps[currentStep].instruction}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDistance(navigation.route.steps[currentStep].distance)} • {formatDuration(navigation.route.steps[currentStep].duration)}
                          </div>
                        </div>
                      </div>
                      
                      {navigation.route.steps[currentStep].roadName && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          On {navigation.route.steps[currentStep].roadName}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={previousStep}
                      disabled={currentStep === 0}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={currentStep >= (navigation.route.steps?.length || 0) - 1}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next Step
                    </button>
                    <button
                      onClick={stopNavigation}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🚗</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Not navigating
                  </h3>
                  <p>Start navigation to begin turn-by-turn directions</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'offline' && showOffline && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Offline Maps
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-4">
                  Download maps for offline use when you don't have internet connection
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Download Maps
                </button>
              </div>

              <div className="space-y-3">
                {navigation.offlineMaps.map((map) => (
                  <div key={map.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {map.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Size: {(map.size / 1024).toFixed(1)} MB
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {map.isDownloaded ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-md">
                          Downloaded
                        </span>
                      ) : (
                        <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Navigation.displayName = 'Navigation';

// Navigation Demo Component
interface NavigationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const NavigationDemo = React.forwardRef<HTMLDivElement, NavigationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [navigation, setNavigation] = useState<Partial<NavigationData>>({});

    const handleNavigationUpdate = (updatedNavigation: NavigationData) => {
      setNavigation(updatedNavigation);
      console.log('Navigation updated:', updatedNavigation);
    };

    const mockNavigation: Partial<NavigationData> = {
      id: 'nav-1',
      route: {
        id: 'route-1',
        origin: {
          id: 'origin-1',
          name: 'Current Location',
          address: 'Los Angeles, CA',
          coordinates: { lat: 34.0522, lng: -118.2437 },
          type: 'address',
          isFavorite: false
        },
        destination: {
          id: 'dest-1',
          name: 'Eiffel Tower',
          address: 'Champ de Mars, 7th arrondissement, Paris',
          coordinates: { lat: 48.8584, lng: 2.2945 },
          type: 'landmark',
          isFavorite: false
        },
        waypoints: [],
        steps: [
          {
            id: 'step-1',
            instruction: 'Head north on Main Street',
            distance: 500,
            duration: 120,
            startLocation: {
              id: 'start-1',
              name: 'Start',
              address: 'Current Location',
              coordinates: { lat: 34.0522, lng: -118.2437 },
              type: 'address',
              isFavorite: false
            },
            endLocation: {
              id: 'end-1',
              name: 'End',
              address: 'Next Location',
              coordinates: { lat: 34.0572, lng: -118.2437 },
              type: 'address',
              isFavorite: false
            },
            maneuver: {
              type: 'straight',
              direction: 'straight'
            },
            roadName: 'Main Street'
          }
        ],
        distance: 1000,
        duration: 300,
        mode: 'driving',
        alternatives: [],
        createdAt: new Date()
      },
      currentLocation: {
        id: 'current-1',
        name: 'Current Location',
        address: 'Los Angeles, CA',
        coordinates: { lat: 34.0522, lng: -118.2437 },
        type: 'address',
        isFavorite: false
      },
      destination: {
        id: 'dest-1',
        name: 'Eiffel Tower',
        address: 'Champ de Mars, 7th arrondissement, Paris',
        coordinates: { lat: 48.8584, lng: 2.2945 },
        type: 'landmark',
        isFavorite: false
      },
      isNavigating: false,
      isOffline: false,
      settings: {
        voiceGuidance: true,
        voiceLanguage: 'en',
        speedLimitWarnings: true,
        trafficAlerts: true,
        tollAvoidance: false,
        highwayAvoidance: false,
        ferryAvoidance: false,
        unitSystem: 'metric',
        mapStyle: 'standard',
        nightMode: false,
        autoZoom: true
      },
      history: [],
      favorites: [],
      offlineMaps: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Navigation Demo
        </h3>
        
        <Navigation
          onNavigationUpdate={handleNavigationUpdate}
          initialNavigation={mockNavigation}
          showMap={true}
          showOffline={true}
          showTraffic={true}
          showAlternatives={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive navigation system with GPS guidance, offline maps, route planning, and turn-by-turn directions.
            </p>
          </div>
        )}
      </div>
    );
  }
);

NavigationDemo.displayName = 'NavigationDemo';

// Export all components
export {
  navigationVariants,
  type NavigationProps,
  type NavigationData,
  type NavigationRoute,
  type Location,
  type RouteStep,
  type Toll,
  type AlternativeRoute,
  type NavigationSettings,
  type NavigationHistory,
  type FavoriteLocation,
  type OfflineMap,
  type NavigationDemoProps
};
