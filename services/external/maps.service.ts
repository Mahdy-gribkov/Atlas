import { z } from 'zod';

// Google Maps API Response Schemas
const placeSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  formatted_address: z.string(),
  geometry: z.object({
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    viewport: z.object({
      northeast: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      southwest: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
    }),
  }),
  types: z.array(z.string()),
  rating: z.number().optional(),
  user_ratings_total: z.number().optional(),
  price_level: z.number().optional(),
  photos: z.array(z.object({
    photo_reference: z.string(),
    height: z.number(),
    width: z.number(),
  })).optional(),
  opening_hours: z.object({
    open_now: z.boolean(),
    weekday_text: z.array(z.string()),
  }).optional(),
  vicinity: z.string().optional(),
});

const placesResponseSchema = z.object({
  results: z.array(placeSchema),
  status: z.string(),
  next_page_token: z.string().optional(),
});

const directionsResponseSchema = z.object({
  routes: z.array(z.object({
    legs: z.array(z.object({
      distance: z.object({
        text: z.string(),
        value: z.number(),
      }),
      duration: z.object({
        text: z.string(),
        value: z.number(),
      }),
      start_address: z.string(),
      end_address: z.string(),
      start_location: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      end_location: z.object({
        lat: z.number(),
        lng: z.number(),
      }),
      steps: z.array(z.object({
        distance: z.object({
          text: z.string(),
          value: z.number(),
        }),
        duration: z.object({
          text: z.string(),
          value: z.number(),
        }),
        html_instructions: z.string(),
        travel_mode: z.string(),
        start_location: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
        end_location: z.object({
          lat: z.number(),
          lng: z.number(),
        }),
      })),
    })),
    overview_polyline: z.object({
      points: z.string(),
    }),
    summary: z.string(),
    warnings: z.array(z.string()),
  })),
  status: z.string(),
});

export interface Place {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
  rating?: number | undefined;
  userRatingsTotal?: number | undefined;
  priceLevel?: number | undefined;
  photos?: Array<{
    reference: string;
    height: number;
    width: number;
  }> | undefined;
  openingHours?: {
    openNow: boolean;
    weekdayText: string[];
  } | undefined;
  vicinity?: string | undefined;
}

export interface DirectionsRoute {
  distance: {
    text: string;
    value: number; // in meters
  };
  duration: {
    text: string;
    value: number; // in seconds
  };
  startAddress: string;
  endAddress: string;
  steps: Array<{
    distance: {
      text: string;
      value: number;
    };
    duration: {
      text: string;
      value: number;
    };
    instructions: string;
    travelMode: string;
    startLocation: {
      lat: number;
      lng: number;
    };
    endLocation: {
      lat: number;
      lng: number;
    };
  }>;
  overviewPolyline: string;
  summary: string;
  warnings: string[];
}

export class MapsService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api';

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Maps features will be disabled.');
    }
  }

  private isApiAvailable(): boolean {
    return !!this.apiKey;
  }

  async searchPlaces(
    query: string,
    location?: { lat: number; lng: number },
    radius?: number,
    type?: string
  ): Promise<Place[]> {
    if (!this.isApiAvailable()) {
      console.warn('Maps API not available');
      return [];
    }

    try {
      const params = new URLSearchParams({
        query,
        key: this.apiKey,
      });

      if (location) {
        params.append('location', `${location.lat},${location.lng}`);
      }

      if (radius) {
        params.append('radius', radius.toString());
      }

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(
        `${this.baseUrl}/place/textsearch/json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Places API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = placesResponseSchema.parse(data);

      if (validatedData.status !== 'OK') {
        throw new Error(`Places API error: ${validatedData.status}`);
      }

      return validatedData.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        types: place.types,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })),
        openingHours: place.opening_hours ? {
          openNow: place.opening_hours.open_now,
          weekdayText: place.opening_hours.weekday_text,
        } : undefined,
        vicinity: place.vicinity,
      }));
    } catch (error) {
      console.error('Error searching places:', error);
      return [];
    }
  }

  async getNearbyPlaces(
    location: { lat: number; lng: number },
    radius: number = 1000,
    type?: string
  ): Promise<Place[]> {
    if (!this.isApiAvailable()) {
      console.warn('Maps API not available');
      return [];
    }

    try {
      const params = new URLSearchParams({
        location: `${location.lat},${location.lng}`,
        radius: radius.toString(),
        key: this.apiKey,
      });

      if (type) {
        params.append('type', type);
      }

      const response = await fetch(
        `${this.baseUrl}/place/nearbysearch/json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Nearby places API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = placesResponseSchema.parse(data);

      if (validatedData.status !== 'OK') {
        throw new Error(`Nearby places API error: ${validatedData.status}`);
      }

      return validatedData.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        types: place.types,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        photos: place.photos?.map(photo => ({
          reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })),
        openingHours: place.opening_hours ? {
          openNow: place.opening_hours.open_now,
          weekdayText: place.opening_hours.weekday_text,
        } : undefined,
        vicinity: place.vicinity,
      }));
    } catch (error) {
      console.error('Error getting nearby places:', error);
      return [];
    }
  }

  async getDirections(
    origin: string | { lat: number; lng: number },
    destination: string | { lat: number; lng: number },
    mode: 'driving' | 'walking' | 'bicycling' | 'transit' = 'driving'
  ): Promise<DirectionsRoute[]> {
    if (!this.isApiAvailable()) {
      console.warn('Maps API not available');
      return [];
    }

    try {
      const originStr = typeof origin === 'string' 
        ? origin 
        : `${origin.lat},${origin.lng}`;
      
      const destinationStr = typeof destination === 'string' 
        ? destination 
        : `${destination.lat},${destination.lng}`;

      const params = new URLSearchParams({
        origin: originStr,
        destination: destinationStr,
        mode,
        key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/directions/json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Directions API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = directionsResponseSchema.parse(data);

      if (validatedData.status !== 'OK') {
        throw new Error(`Directions API error: ${validatedData.status}`);
      }

      return validatedData.routes.map(route => ({
        distance: {
          text: route.legs[0]?.distance.text || '',
          value: route.legs[0]?.distance.value || 0,
        },
        duration: {
          text: route.legs[0]?.duration.text || '',
          value: route.legs[0]?.duration.value || 0,
        },
        startAddress: route.legs[0]?.start_address || '',
        endAddress: route.legs[0]?.end_address || '',
        steps: route.legs[0]?.steps.map(step => ({
          distance: {
            text: step.distance.text,
            value: step.distance.value,
          },
          duration: {
            text: step.duration.text,
            value: step.duration.value,
          },
          instructions: step.html_instructions,
          travelMode: step.travel_mode,
          startLocation: {
            lat: step.start_location.lat,
            lng: step.start_location.lng,
          },
          endLocation: {
            lat: step.end_location.lat,
            lng: step.end_location.lng,
          },
        })) || [],
        overviewPolyline: route.overview_polyline.points,
        summary: route.summary,
        warnings: route.warnings,
      }));
    } catch (error) {
      console.error('Error getting directions:', error);
      return [];
    }
  }

  async getPlaceDetails(placeId: string): Promise<Place | null> {
    if (!this.isApiAvailable()) {
      console.warn('Maps API not available');
      return null;
    }

    try {
      const params = new URLSearchParams({
        place_id: placeId,
        fields: 'place_id,name,formatted_address,geometry,types,rating,user_ratings_total,price_level,photos,opening_hours,vicinity',
        key: this.apiKey,
      });

      const response = await fetch(
        `${this.baseUrl}/place/details/json?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(`Place details API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'OK') {
        throw new Error(`Place details API error: ${data.status}`);
      }

      const place = data.result;
      return {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
        types: place.types,
        rating: place.rating,
        userRatingsTotal: place.user_ratings_total,
        priceLevel: place.price_level,
        photos: place.photos?.map((photo: any) => ({
          reference: photo.photo_reference,
          height: photo.height,
          width: photo.width,
        })),
        openingHours: place.opening_hours ? {
          openNow: place.opening_hours.open_now,
          weekdayText: place.opening_hours.weekday_text,
        } : undefined,
        vicinity: place.vicinity,
      };
    } catch (error) {
      console.error('Error getting place details:', error);
      return null;
    }
  }

  getPhotoUrl(photoReference: string, maxWidth: number = 400): string {
    if (!this.isApiAvailable()) {
      return '';
    }
    
    return `${this.baseUrl}/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${this.apiKey}`;
  }
}
