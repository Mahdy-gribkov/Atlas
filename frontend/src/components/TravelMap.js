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

    // Calculate center point
    if (pointCount > 0) {
      setMapCenter([centerLat / pointCount, centerLng / pointCount]);
    } else {
      // Default to a reasonable center if no locations
      setMapCenter([40.7128, -74.0060]); // New York City
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

  return (
    <div className="real-map-container">
      <MapContainer
        key={`${mapCenter[0]}-${mapCenter[1]}`}
        center={mapCenter}
        zoom={markers.length > 1 ? 6 : 10}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
