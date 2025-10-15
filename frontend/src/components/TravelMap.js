import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TravelMap = ({ currentLocation, destinationLocation, suggestedLocations }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  const [mapView, setMapView] = useState('standard');

  // Custom marker icons
  const createCustomIcon = (color, type = 'default') => {
    const iconHtml = `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: white;
        font-weight: bold;
      ">
        ${type === 'current' ? '📍' : type === 'destination' ? '🎯' : '📍'}
      </div>
    `;
    
    return L.divIcon({
      html: iconHtml,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  // Update map when locations change
  useEffect(() => {
    const newMarkers = [];
    let centerLat = 0;
    let centerLng = 0;
    let pointCount = 0;

    // Add current location marker
    if (currentLocation && currentLocation.lat && currentLocation.lng) {
      newMarkers.push({
        position: [currentLocation.lat, currentLocation.lng],
        icon: createCustomIcon('#8b5cf6', 'current'),
        popup: `Current: ${currentLocation.name || 'Your Location'}`,
        type: 'current'
      });
      centerLat += currentLocation.lat;
      centerLng += currentLocation.lng;
      pointCount++;
    }

    // Add destination marker
    if (destinationLocation && destinationLocation.lat && destinationLocation.lng) {
      newMarkers.push({
        position: [destinationLocation.lat, destinationLocation.lng],
        icon: createCustomIcon('#ef4444', 'destination'),
        popup: `Destination: ${destinationLocation.name || 'Destination'}`,
        type: 'destination'
      });
      centerLat += destinationLocation.lat;
      centerLng += destinationLocation.lng;
      pointCount++;
    }

    // Add suggested locations
    if (suggestedLocations && suggestedLocations.length > 0) {
      suggestedLocations.forEach((location, index) => {
        if (location.lat && location.lng) {
          newMarkers.push({
            position: [location.lat, location.lng],
            icon: createCustomIcon('#f59e0b', 'suggestion'),
            popup: `Suggestion: ${location.name || `Location ${index + 1}`}`,
            type: 'suggestion'
          });
          centerLat += location.lat;
          centerLng += location.lng;
          pointCount++;
        }
      });
    }

    setMarkers(newMarkers);

    // Calculate center point with priority logic
    if (pointCount > 0) {
      // Priority: current location first, then destination, then suggested locations
      if (currentLocation && currentLocation.lat && currentLocation.lng) {
        // If we have current location, center on it primarily
        if (destinationLocation && destinationLocation.lat && destinationLocation.lng) {
          // If we also have destination, center between them
          setMapCenter([
            (currentLocation.lat + destinationLocation.lat) / 2,
            (currentLocation.lng + destinationLocation.lng) / 2
          ]);
        } else {
          // Just center on current location
          setMapCenter([currentLocation.lat, currentLocation.lng]);
        }
      } else if (destinationLocation && destinationLocation.lat && destinationLocation.lng) {
        // Center on destination if no current location
        setMapCenter([destinationLocation.lat, destinationLocation.lng]);
      } else {
        // Fallback to average of all points
        setMapCenter([centerLat / pointCount, centerLng / pointCount]);
      }
    } else {
      // Default to Tel Aviv if no locations
      setMapCenter([32.0853, 34.7818]); // Tel Aviv, Israel
    }

    // Create route if we have both current and destination
    if (currentLocation && destinationLocation && 
        currentLocation.lat && currentLocation.lng && 
        destinationLocation.lat && destinationLocation.lng) {
      setRoute([
        [currentLocation.lat, currentLocation.lng],
        [destinationLocation.lat, destinationLocation.lng]
      ]);
    } else {
      setRoute([]);
    }
  }, [currentLocation, destinationLocation, suggestedLocations]);

  // If no locations, show placeholder
  if (!currentLocation && !destinationLocation && (!suggestedLocations || suggestedLocations.length === 0)) {
    return (
      <div className="map-placeholder">
        <div className="map-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
          </svg>
        </div>
        <div className="map-text">
          Set your location
        </div>
        <div className="map-subtext">
          Ask about destinations
        </div>
      </div>
    );
  }

  // Map view configurations
  const mapViews = {
    standard: {
      name: 'Standard',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    terrain: {
      name: 'Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>'
    },
  };

  return (
    <div className="real-map-container">
      {/* Map View Controls - Single Button */}
      <div className="map-controls">
        <div className="map-view-selector">
          <button
            className="map-view-btn"
            onClick={() => {
              const viewKeys = Object.keys(mapViews);
              const currentIndex = viewKeys.indexOf(mapView);
              const nextIndex = (currentIndex + 1) % viewKeys.length;
              setMapView(viewKeys[nextIndex]);
            }}
          >
            {mapViews[mapView].name}
          </button>
        </div>
      </div>
      
      <MapContainer
        key={`${mapCenter[0]}-${mapCenter[1]}-${mapView}`}
        center={mapCenter}
        zoom={markers.length > 1 ? 6 : 10}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        <TileLayer
          attribution={mapViews[mapView].attribution}
          url={mapViews[mapView].url}
        />
        
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            icon={marker.icon}
          >
            <Popup>
              {marker.popup}
            </Popup>
          </Marker>
        ))}
        
        {route.length > 0 && (
          <Polyline
            positions={route}
            color="#8b5cf6"
            weight={3}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TravelMap;
