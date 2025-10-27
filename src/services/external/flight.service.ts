import { z } from 'zod';

// Amadeus API Response Schemas
const flightOfferSchema = z.object({
  id: z.string(),
  source: z.string(),
  instantTicketingRequired: z.boolean(),
  nonHomogeneous: z.boolean(),
  oneWay: z.boolean(),
  lastTicketingDate: z.string(),
  numberOfBookableSeats: z.number(),
  itineraries: z.array(z.object({
    duration: z.string(),
    segments: z.array(z.object({
      departure: z.object({
        iataCode: z.string(),
        terminal: z.string().optional(),
        at: z.string(),
      }),
      arrival: z.object({
        iataCode: z.string(),
        terminal: z.string().optional(),
        at: z.string(),
      }),
      carrierCode: z.string(),
      number: z.string(),
      aircraft: z.object({
        code: z.string(),
      }),
      operating: z.object({
        carrierCode: z.string(),
      }).optional(),
      duration: z.string(),
      id: z.string(),
      numberOfStops: z.number(),
      blacklistedInEU: z.boolean(),
    })),
  })),
  price: z.object({
    currency: z.string(),
    total: z.string(),
    base: z.string(),
    fees: z.array(z.object({
      amount: z.string(),
      type: z.string(),
    })),
    grandTotal: z.string(),
  }),
  pricingOptions: z.object({
    fareType: z.array(z.string()),
    includedCheckedBagsOnly: z.boolean(),
  }),
  validatingAirlineCodes: z.array(z.string()),
  travelerPricings: z.array(z.object({
    travelerId: z.string(),
    fareOption: z.string(),
    travelerType: z.string(),
    price: z.object({
      currency: z.string(),
      total: z.string(),
      base: z.string(),
    }),
    fareDetailsBySegment: z.array(z.object({
      segmentId: z.string(),
      cabin: z.string(),
      fareBasis: z.string(),
      class: z.string(),
      includedCheckedBags: z.object({
        weight: z.number(),
        weightUnit: z.string(),
      }),
    })),
  })),
});

const flightOffersResponseSchema = z.object({
  data: z.array(flightOfferSchema),
  dictionaries: z.object({
    locations: z.record(z.object({
      cityCode: z.string(),
      countryCode: z.string(),
    })),
    aircraft: z.record(z.string()),
    currencies: z.record(z.string()),
    carriers: z.record(z.string()),
  }),
  meta: z.object({
    count: z.number(),
    links: z.object({
      self: z.string(),
    }),
  }),
});

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string | undefined;
  adults: number;
  children?: number | undefined;
  infants?: number | undefined;
  travelClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' | undefined;
  nonStop?: boolean | undefined;
  maxPrice?: number | undefined;
  currency?: string | undefined;
}

export interface FlightOffer {
  id: string;
  price: {
    currency: string;
    total: number;
    base: number;
    fees: Array<{
      amount: number;
      type: string;
    }>;
  };
  itineraries: Array<{
    duration: string;
    segments: Array<{
      departure: {
        airport: string;
        terminal?: string | undefined;
        time: Date;
      };
      arrival: {
        airport: string;
        terminal?: string | undefined;
        time: Date;
      };
      airline: string;
      flightNumber: string;
      aircraft: string;
      duration: string;
      stops: number;
    }>;
  }>;
  bookingInfo: {
    lastTicketingDate: Date;
    seatsAvailable: number;
    instantTicketing: boolean;
  };
}

export class FlightService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl = 'https://test.api.amadeus.com';
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.apiKey = process.env.AMADEUS_API_KEY || '';
    this.apiSecret = process.env.AMADEUS_API_SECRET || '';
    
    if (!this.apiKey || !this.apiSecret) {
      console.warn('Amadeus API credentials not found. Flight search features will be disabled.');
    }
  }

  private isApiAvailable(): boolean {
    return !!(this.apiKey && this.apiSecret);
  }

  private async getAccessToken(): Promise<string | null> {
    if (!this.isApiAvailable()) {
      return null;
    }

    // Check if we have a valid token
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.apiSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      console.error('Error getting Amadeus access token:', error);
      return null;
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<FlightOffer[]> {
    const token = await this.getAccessToken();
    if (!token) {
      console.warn('Flight API not available');
      return [];
    }

    try {
      const searchParams = new URLSearchParams({
        originLocationCode: params.origin,
        destinationLocationCode: params.destination,
        departureDate: params.departureDate,
        adults: params.adults.toString(),
        currencyCode: params.currency || 'USD',
        max: '20', // Limit results
      });

      if (params.returnDate) {
        searchParams.append('returnDate', params.returnDate);
      }

      if (params.children) {
        searchParams.append('children', params.children.toString());
      }

      if (params.infants) {
        searchParams.append('infants', params.infants.toString());
      }

      if (params.travelClass) {
        searchParams.append('travelClass', params.travelClass);
      }

      if (params.nonStop) {
        searchParams.append('nonStop', 'true');
      }

      if (params.maxPrice) {
        searchParams.append('maxPrice', params.maxPrice.toString());
      }

      const response = await fetch(
        `${this.baseUrl}/v2/shopping/flight-offers?${searchParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Flight search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const validatedData = flightOffersResponseSchema.parse(data);

      return validatedData.data.map(offer => ({
        id: offer.id,
        price: {
          currency: offer.price.currency,
          total: parseFloat(offer.price.total),
          base: parseFloat(offer.price.base),
          fees: offer.price.fees.map(fee => ({
            amount: parseFloat(fee.amount),
            type: fee.type,
          })),
        },
        itineraries: offer.itineraries.map(itinerary => ({
          duration: itinerary.duration,
          segments: itinerary.segments.map(segment => ({
            departure: {
              airport: segment.departure.iataCode,
              terminal: segment.departure.terminal,
              time: new Date(segment.departure.at),
            },
            arrival: {
              airport: segment.arrival.iataCode,
              terminal: segment.arrival.terminal,
              time: new Date(segment.arrival.at),
            },
            airline: segment.carrierCode,
            flightNumber: segment.number,
            aircraft: segment.aircraft.code,
            duration: segment.duration,
            stops: segment.numberOfStops,
          })),
        })),
        bookingInfo: {
          lastTicketingDate: new Date(offer.lastTicketingDate),
          seatsAvailable: offer.numberOfBookableSeats,
          instantTicketing: offer.instantTicketingRequired,
        },
      }));
    } catch (error) {
      console.error('Error searching flights:', error);
      return [];
    }
  }

  async getFlightOffersByOriginAndDestination(
    origin: string,
    destination: string,
    departureDate: string,
    adults: number = 1
  ): Promise<FlightOffer[]> {
    return this.searchFlights({
      origin,
      destination,
      departureDate,
      adults,
    });
  }

  async getFlightInspiration(origin: string, departureDate: string): Promise<any[]> {
    const token = await this.getAccessToken();
    if (!token) {
      console.warn('Flight API not available');
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v1/shopping/flight-destinations?origin=${origin}&departureDate=${departureDate}&max=20`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Flight inspiration failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error getting flight inspiration:', error);
      return [];
    }
  }

  async getAirportAutocomplete(query: string): Promise<any[]> {
    const token = await this.getAccessToken();
    if (!token) {
      console.warn('Flight API not available');
      return [];
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/v1/reference-data/locations?subType=AIRPORT&keyword=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Airport search failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  }
}
