// Map service to connect with backend API
const API_BASE_URL = 'http://localhost:8000';

export const mapService = {
  // Geocode an address to get coordinates
  async geocodeAddress(address) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/maps/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error geocoding address:', error);
      throw error;
    }
  },

  // Reverse geocode coordinates to get address
  async reverseGeocode(lat, lng) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/maps/reverse-geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      throw error;
    }
  },

  // Search for locations
  async searchLocations(query) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/maps/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },

  // Fallback geocoding using a free service if backend is not available
  async fallbackGeocode(address) {
    try {
      // Make address more specific for common cities
      let searchQuery = address;
      if (address.toLowerCase().includes('rome') && !address.toLowerCase().includes('italy')) {
        searchQuery = 'Rome, Italy';
      } else if (address.toLowerCase().includes('paris') && !address.toLowerCase().includes('france')) {
        searchQuery = 'Paris, France';
      } else if (address.toLowerCase().includes('london') && !address.toLowerCase().includes('england')) {
        searchQuery = 'London, England';
      }
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lng),
          name: data[0].display_name,
          address: data[0].display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Error with fallback geocoding:', error);
      throw error;
    }
  }
};
