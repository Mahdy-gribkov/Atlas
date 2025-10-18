import { GeminiService } from './gemini.service';
import { VectorService } from './vector.service';
import { ItineraryService } from '../itinerary.service';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { WeatherService } from '../external/weather.service';
import { FlightService } from '../external/flight.service';
import { MapsService } from '../external/maps.service';
import { CountriesService } from '../external/countries.service';
import { Itinerary, ChatMessage } from '@/types';

export interface AgentTool {
  name: string;
  description: string;
  parameters: any;
  handler: (params: any) => Promise<any>;
}

export interface AgentContext {
  userId: string;
  currentItinerary?: string;
  userPreferences?: any;
  conversationHistory: ChatMessage[];
  activeTools: string[];
}

export class AgentService {
  private geminiService: GeminiService;
  private vectorService: VectorService;
  private itineraryService: ItineraryService;
  private chatService: ChatService;
  private userService: UserService;
  private weatherService: WeatherService;
  private flightService: FlightService;
  private mapsService: MapsService;
  private countriesService: CountriesService;
  private tools: Map<string, AgentTool>;

  constructor() {
    this.geminiService = new GeminiService();
    this.vectorService = new VectorService();
    this.itineraryService = new ItineraryService();
    this.chatService = new ChatService();
    this.userService = new UserService();
    this.weatherService = new WeatherService();
    this.flightService = new FlightService();
    this.mapsService = new MapsService();
    this.countriesService = new CountriesService();
    this.tools = new Map();
    
    this.initializeTools();
  }

  private initializeTools(): void {
    // Tool: Search travel information
    this.registerTool({
      name: 'search_travel_info',
      description: 'Search for travel information, guides, and recommendations',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
          location: { type: 'string', description: 'Specific location to search' },
          type: { type: 'string', enum: ['itinerary', 'guide', 'review', 'attraction', 'restaurant'], description: 'Type of information to search' },
        },
        required: ['query'],
      },
      handler: this.searchTravelInfo.bind(this),
    });

    // Tool: Create itinerary
    this.registerTool({
      name: 'create_itinerary',
      description: 'Create a new travel itinerary',
      parameters: {
        type: 'object',
        properties: {
          destination: { type: 'string', description: 'Travel destination' },
          startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
          endDate: { type: 'string', description: 'End date (YYYY-MM-DD)' },
          travelers: { type: 'number', description: 'Number of travelers' },
          budget: { type: 'number', description: 'Budget amount' },
          preferences: { type: 'object', description: 'User preferences' },
        },
        required: ['destination', 'startDate', 'endDate', 'travelers', 'budget'],
      },
      handler: this.createItinerary.bind(this),
    });

    // Tool: Update itinerary
    this.registerTool({
      name: 'update_itinerary',
      description: 'Update an existing itinerary',
      parameters: {
        type: 'object',
        properties: {
          itineraryId: { type: 'string', description: 'ID of the itinerary to update' },
          updates: { type: 'object', description: 'Updates to apply' },
        },
        required: ['itineraryId', 'updates'],
      },
      handler: this.updateItinerary.bind(this),
    });

    // Tool: Get user preferences
    this.registerTool({
      name: 'get_user_preferences',
      description: 'Get user travel preferences and settings',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
      handler: this.getUserPreferences.bind(this),
    });

    // Tool: Search locations
    this.registerTool({
      name: 'search_locations',
      description: 'Search for specific locations and attractions',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'Location to search' },
          type: { type: 'string', enum: ['attraction', 'restaurant', 'hotel', 'activity'], description: 'Type of location' },
        },
        required: ['location'],
      },
      handler: this.searchLocations.bind(this),
    });

    // Tool: Get weather information
    this.registerTool({
      name: 'get_weather',
      description: 'Get current weather or forecast for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: 'Location to get weather for' },
          type: { type: 'string', enum: ['current', 'forecast'], description: 'Type of weather data' },
          days: { type: 'number', description: 'Number of days for forecast (1-5)' },
        },
        required: ['location'],
      },
      handler: this.getWeather.bind(this),
    });

    // Tool: Search flights
    this.registerTool({
      name: 'search_flights',
      description: 'Search for flight options between airports',
      parameters: {
        type: 'object',
        properties: {
          origin: { type: 'string', description: 'Origin airport code (e.g., JFK)' },
          destination: { type: 'string', description: 'Destination airport code (e.g., LAX)' },
          departureDate: { type: 'string', description: 'Departure date (YYYY-MM-DD)' },
          returnDate: { type: 'string', description: 'Return date (YYYY-MM-DD)' },
          adults: { type: 'number', description: 'Number of adult passengers' },
          children: { type: 'number', description: 'Number of child passengers' },
          travelClass: { type: 'string', enum: ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'], description: 'Travel class' },
        },
        required: ['origin', 'destination', 'departureDate', 'adults'],
      },
      handler: this.searchFlights.bind(this),
    });

    // Tool: Search places
    this.registerTool({
      name: 'search_places',
      description: 'Search for places, attractions, restaurants, and hotels',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query for places' },
          location: { type: 'string', description: 'Location coordinates (lat,lng) or address' },
          type: { type: 'string', description: 'Type of place (restaurant, tourist_attraction, lodging, etc.)' },
          radius: { type: 'number', description: 'Search radius in meters' },
        },
        required: ['query'],
      },
      handler: this.searchPlaces.bind(this),
    });

    // Tool: Get country information
    this.registerTool({
      name: 'get_country_info',
      description: 'Get information about countries, regions, and travel destinations',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Country name or code to search' },
          action: { type: 'string', enum: ['search', 'region', 'popular', 'all'], description: 'Type of search' },
          region: { type: 'string', description: 'Region name for regional search' },
        },
        required: ['query'],
      },
      handler: this.getCountryInfo.bind(this),
    });

    // Tool: Get directions
    this.registerTool({
      name: 'get_directions',
      description: 'Get directions between two locations',
      parameters: {
        type: 'object',
        properties: {
          origin: { type: 'string', description: 'Starting location' },
          destination: { type: 'string', description: 'Destination location' },
          mode: { type: 'string', enum: ['driving', 'walking', 'bicycling', 'transit'], description: 'Travel mode' },
        },
        required: ['origin', 'destination'],
      },
      handler: this.getDirections.bind(this),
    });
  }

  private registerTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  async processMessage(message: string, context: AgentContext): Promise<string> {
    try {
      // First, try to determine if the user wants to use a tool
      const toolDecision = await this.decideToolUsage(message, context);
      
      if (toolDecision.shouldUseTool && toolDecision.toolName) {
        const tool = this.tools.get(toolDecision.toolName);
        if (tool) {
          const toolResult = await tool.handler(toolDecision.parameters);
          return await this.formatToolResponse(toolResult, toolDecision.toolName, message);
        }
      }

      // If no tool is needed, use regular chat
      return await this.geminiService.chatWithContext(
        message,
        context.conversationHistory,
        {
          userPreferences: context.userPreferences,
          currentItinerary: context.currentItinerary,
        }
      );
    } catch (error) {
      console.error('Error processing message:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  }

  private async decideToolUsage(message: string, context: AgentContext): Promise<{
    shouldUseTool: boolean;
    toolName?: string;
    parameters?: any;
  }> {
    const toolDescriptions = Array.from(this.tools.values()).map(tool => 
      `${tool.name}: ${tool.description}`
    ).join('\n');

    const decisionPrompt = `Based on the user's message, decide if you should use a tool and which one.

Available tools:
${toolDescriptions}

User message: "${message}"

Context:
- Current itinerary: ${context.currentItinerary || 'None'}
- User preferences: ${JSON.stringify(context.userPreferences || {})}

Respond with JSON:
{
  "shouldUseTool": boolean,
  "toolName": "tool_name" or null,
  "parameters": {} or null
}`;

    try {
      const response = await this.geminiService.generateText(decisionPrompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error deciding tool usage:', error);
    }

    return { shouldUseTool: false };
  }

  private async formatToolResponse(toolResult: any, toolName: string, originalMessage: string): Promise<string> {
    const formatPrompt = `Format the tool result into a helpful response for the user.

Tool used: ${toolName}
Original message: "${originalMessage}"
Tool result: ${JSON.stringify(toolResult)}

Provide a natural, conversational response that incorporates the tool result.`;

    try {
      return await this.geminiService.generateText(formatPrompt);
    } catch (error) {
      console.error('Error formatting tool response:', error);
      return `I've processed your request. Here's what I found: ${JSON.stringify(toolResult)}`;
    }
  }

  // Tool handlers
  private async searchTravelInfo(params: any): Promise<any> {
    const { query, location, type } = params;
    
    try {
      const searchQuery = location ? `${query} in ${location}` : query;
      const results = await this.vectorService.searchSimilar(searchQuery, {
        topK: 5,
        filter: type ? { type: { $eq: type } } : undefined,
      });

      return {
        query: searchQuery,
        results: results.map(result => ({
          title: result.metadata.title,
          content: result.content.substring(0, 200) + '...',
          type: result.metadata.type,
          location: result.metadata.location,
          score: result.metadata.relevance || 0.9,
        })),
      };
    } catch (error) {
      console.error('Error searching travel info:', error);
      return { error: 'Failed to search travel information' };
    }
  }

  private async createItinerary(params: any): Promise<any> {
    const { destination, startDate, endDate, travelers, budget, preferences } = params;
    
    try {
      const prompt = `Create a detailed travel itinerary for ${destination} from ${startDate} to ${endDate} for ${travelers} travelers with a budget of $${budget}.`;
      
      const itineraryData = await this.geminiService.generateItinerary(prompt, preferences);
      
      // Save to database
      const itinerary = await this.itineraryService.createItinerary(
        params.userId || 'system',
        {
          title: itineraryData.title,
          destination: itineraryData.destination,
          startDate: itineraryData.startDate,
          endDate: itineraryData.endDate,
          travelers: itineraryData.travelers,
          budget: itineraryData.budget,
          preferences,
        }
      );

      return {
        itinerary,
        message: `I've created a ${itineraryData.destination} itinerary for you!`,
      };
    } catch (error) {
      console.error('Error creating itinerary:', error);
      return { error: 'Failed to create itinerary' };
    }
  }

  private async updateItinerary(params: any): Promise<any> {
    const { itineraryId, updates } = params;
    
    try {
      const updatedItinerary = await this.itineraryService.updateItinerary(itineraryId, updates);
      return {
        itinerary: updatedItinerary,
        message: 'Itinerary updated successfully!',
      };
    } catch (error) {
      console.error('Error updating itinerary:', error);
      return { error: 'Failed to update itinerary' };
    }
  }

  private async getUserPreferences(params: any): Promise<any> {
    try {
      const user = await this.userService.getUserById(params.userId);
      return {
        preferences: user?.preferences || {},
        message: 'Here are your current travel preferences.',
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return { error: 'Failed to get user preferences' };
    }
  }

  private async searchLocations(params: any): Promise<any> {
    const { location, type } = params;
    
    try {
      const results = await this.vectorService.searchByLocation(location, {
        topK: 10,
      });

      return {
        location,
        type,
        results: results.map(result => ({
          title: result.metadata.title,
          content: result.content.substring(0, 150) + '...',
          tags: result.metadata.tags,
          score: result.metadata.relevance || 0.9,
        })),
      };
    } catch (error) {
      console.error('Error searching locations:', error);
      return { error: 'Failed to search locations' };
    }
  }

  async getAvailableTools(): Promise<AgentTool[]> {
    return Array.from(this.tools.values());
  }

  async validateToolCall(toolName: string, parameters: any): Promise<boolean> {
    const tool = this.tools.get(toolName);
    if (!tool) return false;

    // Basic validation - in production, use a proper JSON schema validator
    try {
      // This is a simplified validation
      return true;
    } catch (error) {
      return false;
    }
  }

  // New tool handlers for real APIs
  private async getWeather(params: any): Promise<any> {
    const { location, type = 'current', days = 5 } = params;
    
    try {
      if (type === 'forecast') {
        const forecast = await this.weatherService.getWeatherForecast(location, days);
        return forecast ? {
          location: forecast.location,
          country: forecast.country,
          forecasts: forecast.forecasts,
          type: 'forecast'
        } : { error: 'Weather forecast not available' };
      } else {
        const weather = await this.weatherService.getCurrentWeather(location);
        return weather ? {
          location: weather.location,
          country: weather.country,
          temperature: weather.temperature,
          description: weather.description,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          type: 'current'
        } : { error: 'Weather data not available' };
      }
    } catch (error) {
      console.error('Error getting weather:', error);
      return { error: 'Failed to get weather information' };
    }
  }

  private async searchFlights(params: any): Promise<any> {
    const { origin, destination, departureDate, returnDate, adults = 1, children, travelClass } = params;
    
    try {
      const flightOffers = await this.flightService.searchFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        adults,
        children,
        travelClass,
      });

      return {
        origin,
        destination,
        departureDate,
        returnDate,
        offers: flightOffers.map(offer => ({
          id: offer.id,
          price: offer.price,
          itineraries: offer.itineraries,
          bookingInfo: offer.bookingInfo,
        })),
        totalResults: flightOffers.length,
      };
    } catch (error) {
      console.error('Error searching flights:', error);
      return { error: 'Failed to search flights' };
    }
  }

  private async searchPlaces(params: any): Promise<any> {
    const { query, location, type, radius } = params;
    
    try {
      let places;
      
      if (location && radius) {
        // Parse location if it's coordinates
        const [lat, lng] = location.includes(',') 
          ? location.split(',').map((coord: string) => parseFloat(coord.trim()))
          : [null, null];
        
        if (lat && lng) {
          places = await this.mapsService.getNearbyPlaces({ lat, lng }, radius, type);
        } else {
          places = await this.mapsService.searchPlaces(query, undefined, radius, type);
        }
      } else {
        places = await this.mapsService.searchPlaces(query, undefined, radius, type);
      }

      return {
        query,
        location,
        type,
        places: places.map(place => ({
          id: place.id,
          name: place.name,
          address: place.address,
          location: place.location,
          rating: place.rating,
          types: place.types,
        })),
        totalResults: places.length,
      };
    } catch (error) {
      console.error('Error searching places:', error);
      return { error: 'Failed to search places' };
    }
  }

  private async getCountryInfo(params: any): Promise<any> {
    const { query, action = 'search', region } = params;
    
    try {
      let countries;
      
      switch (action) {
        case 'region':
          countries = await this.countriesService.getCountriesByRegion(region || query);
          break;
        case 'popular':
          countries = await this.countriesService.getPopularDestinations();
          break;
        case 'all':
          countries = await this.countriesService.getAllCountries();
          break;
        default:
          countries = await this.countriesService.searchCountries(query);
          break;
      }

      return {
        query,
        action,
        region,
        countries: countries.map(country => ({
          name: country.name,
          codes: country.codes,
          region: country.region,
          subregion: country.subregion,
          capital: country.capital,
          population: country.population,
          area: country.area,
          flag: country.flag,
          location: country.location,
        })),
        totalResults: countries.length,
      };
    } catch (error) {
      console.error('Error getting country info:', error);
      return { error: 'Failed to get country information' };
    }
  }

  private async getDirections(params: any): Promise<any> {
    const { origin, destination, mode = 'driving' } = params;
    
    try {
      const routes = await this.mapsService.getDirections(origin, destination, mode);

      return {
        origin,
        destination,
        mode,
        routes: routes.map(route => ({
          distance: route.distance,
          duration: route.duration,
          startAddress: route.startAddress,
          endAddress: route.endAddress,
          steps: route.steps.slice(0, 5), // Limit steps for brevity
          summary: route.summary,
        })),
        totalRoutes: routes.length,
      };
    } catch (error) {
      console.error('Error getting directions:', error);
      return { error: 'Failed to get directions' };
    }
  }
}
