import { TravelDataService, TravelDestination, TravelActivity, TravelAccommodation, TravelTransportation } from '../data/travel-data.service';
import { VectorService } from '../ai/vector.service';
import { GeminiService } from '../ai/gemini.service';

export interface ItineraryRequest {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: number;
  interests: string[];
  travelStyle: 'budget' | 'mid-range' | 'luxury';
  accessibility?: {
    wheelchairAccessible: boolean;
    mobilityAssistance: boolean;
  };
  sustainability?: {
    ecoFriendly: boolean;
    localExperiences: boolean;
  };
  dietaryRestrictions?: string[];
  ageGroups?: {
    adults: number;
    children: number;
    seniors: number;
  };
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  activities: ItineraryActivity[];
  meals: ItineraryMeal[];
  transportation: ItineraryTransportation[];
  accommodation?: ItineraryAccommodation;
  estimatedCost: number;
  notes: string[];
}

export interface ItineraryActivity {
  id: string;
  name: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  startTime: string;
  endTime: string;
  duration: string;
  cost: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  accessibility: {
    wheelchairAccessible: boolean;
    familyFriendly: boolean;
  };
  sustainability: {
    ecoFriendly: boolean;
    localImpact: 'positive' | 'neutral' | 'negative';
  };
  requirements: string[];
  tips: string[];
  bookingRequired: boolean;
  bookingUrl?: string;
}

export interface ItineraryMeal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description: string;
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  time: string;
  cost: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  cuisine: string;
  dietaryOptions: string[];
  accessibility: {
    wheelchairAccessible: boolean;
  };
  sustainability: {
    localSourcing: boolean;
    ecoFriendly: boolean;
  };
  bookingRequired: boolean;
  bookingUrl?: string;
}

export interface ItineraryTransportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'bike' | 'walking' | 'taxi' | 'metro';
  from: string;
  to: string;
  startTime: string;
  endTime: string;
  duration: string;
  cost: {
    amount: number;
    currency: string;
    perPerson: boolean;
  };
  distance?: string;
  accessibility: {
    wheelchairAccessible: boolean;
    assistanceAvailable: boolean;
  };
  sustainability: {
    carbonFootprint: 'low' | 'medium' | 'high';
    ecoFriendly: boolean;
  };
  bookingRequired: boolean;
  bookingUrl?: string;
  notes: string[];
}

export interface ItineraryAccommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'boutique' | 'bed-breakfast';
  location: {
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  checkIn: string;
  checkOut: string;
  cost: {
    amount: number;
    currency: string;
    perNight: boolean;
  };
  amenities: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    accessibleRooms: number;
  };
  sustainability: {
    ecoCertified: boolean;
    localOwned: boolean;
  };
  rating: number;
  bookingUrl?: string;
}

export interface GeneratedItinerary {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  duration: number;
  travelers: number;
  budget: {
    total: number;
    perPerson: number;
    currency: string;
  };
  travelStyle: string;
  days: ItineraryDay[];
  summary: {
    totalActivities: number;
    totalMeals: number;
    totalTransportation: number;
    highlights: string[];
    tips: string[];
  };
  metadata: {
    generatedAt: Date;
    version: string;
    preferences: ItineraryRequest;
  };
}

export class ItineraryGeneratorService {
  private travelDataService: TravelDataService;
  private vectorService: VectorService;
  private geminiService: GeminiService;

  constructor() {
    this.travelDataService = new TravelDataService();
    this.vectorService = new VectorService();
    this.geminiService = new GeminiService();
  }

  async generateItinerary(request: ItineraryRequest): Promise<GeneratedItinerary> {
    try {
      console.log('Generating itinerary for:', request.destination);

      // Get destination information
      const destination = await this.getDestinationInfo(request.destination);
      if (!destination) {
        throw new Error(`Destination ${request.destination} not found`);
      }

      // Calculate trip duration
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Get relevant activities, accommodations, and transportation
      const activities = await this.getRelevantActivities(destination, request);
      const accommodations = await this.getRelevantAccommodations(destination, request);
      const transportation = await this.getRelevantTransportation(destination, request);

      // Generate daily itineraries
      const days = await this.generateDailyItineraries(
        destination,
        activities,
        accommodations,
        transportation,
        request,
        duration
      );

      // Calculate total budget
      const totalBudget = this.calculateTotalBudget(days, request.travelers);
      const perPersonBudget = totalBudget / request.travelers;

      // Generate summary
      const summary = this.generateSummary(days, destination);

      const itinerary: GeneratedItinerary = {
        id: this.generateItineraryId(),
        title: `${request.destination} Adventure - ${duration} Days`,
        destination: request.destination,
        startDate: request.startDate,
        endDate: request.endDate,
        duration,
        travelers: request.travelers,
        budget: {
          total: totalBudget,
          perPerson: perPersonBudget,
          currency: destination.currency,
        },
        travelStyle: request.travelStyle,
        days,
        summary,
        metadata: {
          generatedAt: new Date(),
          version: '1.0',
          preferences: request,
        },
      };

      console.log(`Successfully generated itinerary with ${days.length} days`);
      return itinerary;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }

  private async getDestinationInfo(destinationName: string): Promise<TravelDestination | null> {
    const destinations = await this.travelDataService.getDestinations();
    return destinations.find(dest => 
      dest.name.toLowerCase().includes(destinationName.toLowerCase()) ||
      dest.country.toLowerCase().includes(destinationName.toLowerCase())
    ) || null;
  }

  private async getRelevantActivities(
    destination: TravelDestination,
    request: ItineraryRequest
  ): Promise<TravelActivity[]> {
    const allActivities = await this.travelDataService.getActivitiesByDestination(destination.name);
    
    // Filter by interests
    let filteredActivities = allActivities;
    if (request.interests.length > 0) {
      filteredActivities = allActivities.filter(activity =>
        request.interests.some(interest =>
          activity.category.toLowerCase().includes(interest.toLowerCase()) ||
          activity.name.toLowerCase().includes(interest.toLowerCase())
        )
      );
    }

    // Filter by accessibility
    if (request.accessibility?.wheelchairAccessible) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.accessibility.wheelchairAccessible
      );
    }

    // Filter by sustainability
    if (request.sustainability?.ecoFriendly) {
      filteredActivities = filteredActivities.filter(activity =>
        activity.sustainability.ecoFriendly
      );
    }

    return filteredActivities;
  }

  private async getRelevantAccommodations(
    destination: TravelDestination,
    request: ItineraryRequest
  ): Promise<TravelAccommodation[]> {
    const accommodations = await this.travelDataService.getAccommodationsByDestination(destination.name);
    
    // Filter by budget
    const budgetFilter = accommodations.filter(acc => {
      const avgPrice = (acc.priceRange.min + acc.priceRange.max) / 2;
      const dailyBudget = request.budget / request.travelers / this.calculateDuration(request);
      
      if (request.travelStyle === 'budget') return avgPrice < dailyBudget * 0.3;
      if (request.travelStyle === 'mid-range') return avgPrice >= dailyBudget * 0.2 && avgPrice < dailyBudget * 0.5;
      return avgPrice >= dailyBudget * 0.4;
    });

    // Filter by accessibility
    if (request.accessibility?.wheelchairAccessible) {
      return budgetFilter.filter(acc => acc.accessibility.wheelchairAccessible);
    }

    return budgetFilter;
  }

  private async getRelevantTransportation(
    destination: TravelDestination,
    request: ItineraryRequest
  ): Promise<TravelTransportation[]> {
    return await this.travelDataService.getTransportationByDestination(destination.name);
  }

  private async generateDailyItineraries(
    destination: TravelDestination,
    activities: TravelActivity[],
    accommodations: TravelAccommodation[],
    transportation: TravelTransportation[],
    request: ItineraryRequest,
    duration: number
  ): Promise<ItineraryDay[]> {
    const days: ItineraryDay[] = [];
    const startDate = new Date(request.startDate);

    for (let i = 0; i < duration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const day: ItineraryDay = {
        day: i + 1,
        date: currentDate.toISOString().split('T')[0] || '',
        theme: this.generateDayTheme(i, duration, destination),
        activities: await this.generateDayActivities(activities, i, duration, request),
        meals: this.generateDayMeals(destination, i, request),
        transportation: this.generateDayTransportation(transportation, i, request),
        estimatedCost: 0,
        notes: this.generateDayNotes(i, duration, destination),
      };

      // Add accommodation for the night
      if (i < duration - 1) {
        const accommodation = this.selectAccommodation(accommodations, request);
        if (accommodation) {
          day.accommodation = accommodation;
        }
      }

      // Calculate estimated cost for the day
      day.estimatedCost = this.calculateDayCost(day, request.travelers);

      days.push(day);
    }

    return days;
  }

  private generateDayTheme(dayIndex: number, totalDays: number, destination: TravelDestination): string {
    const themes = [
      'Arrival and Orientation',
      'Cultural Exploration',
      'Local Experiences',
      'Adventure and Nature',
      'Food and Entertainment',
      'Shopping and Relaxation',
      'Hidden Gems',
      'Farewell and Departure'
    ];

    if (dayIndex === 0) return themes[0] || 'Arrival and Orientation';
    if (dayIndex === totalDays - 1) return themes[themes.length - 1] || 'Departure Day';
    
    const themeIndex = Math.min(dayIndex, themes.length - 2);
    return themes[themeIndex] || 'Cultural Exploration';
  }

  private async generateDayActivities(
    activities: TravelActivity[],
    dayIndex: number,
    totalDays: number,
    request: ItineraryRequest
  ): Promise<ItineraryActivity[]> {
    const dayActivities: ItineraryActivity[] = [];
    const activitiesPerDay = Math.min(3, Math.ceil(activities.length / totalDays));
    
    // Select activities for this day
    const selectedActivities = activities.slice(
      dayIndex * activitiesPerDay,
      (dayIndex + 1) * activitiesPerDay
    );

    let currentTime = 9; // Start at 9 AM

    for (const activity of selectedActivities) {
      const duration = this.parseDuration(activity.duration);
      const endTime = currentTime + duration;

      const bookingUrl = this.generateBookingUrl(activity);
      const itineraryActivity: ItineraryActivity = {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        location: {
          name: activity.location,
          address: activity.location, // Simplified for now
          coordinates: { lat: 0, lng: 0 }, // Would be populated from real data
        },
        startTime: this.formatTime(currentTime),
        endTime: this.formatTime(endTime),
        duration: activity.duration,
        cost: {
          amount: (activity.cost.min + activity.cost.max) / 2,
          currency: activity.cost.currency,
          perPerson: true,
        },
        category: activity.category,
        difficulty: activity.difficulty,
        accessibility: activity.accessibility,
        sustainability: activity.sustainability,
        requirements: activity.requirements,
        tips: activity.tips,
        bookingRequired: this.determineBookingRequired(activity),
        ...(bookingUrl && { bookingUrl }),
      };

      dayActivities.push(itineraryActivity);
      currentTime = endTime + 1; // 1 hour break between activities
    }

    return dayActivities;
  }

  private generateDayMeals(
    destination: TravelDestination,
    dayIndex: number,
    request: ItineraryRequest
  ): ItineraryMeal[] {
    const meals: ItineraryMeal[] = [];
    const mealTimes = [
      { type: 'breakfast' as const, time: '8:00' },
      { type: 'lunch' as const, time: '13:00' },
      { type: 'dinner' as const, time: '19:00' },
    ];

    for (const mealTime of mealTimes) {
      const mealBookingUrl = this.generateMealBookingUrl(mealTime.type);
      const meal: ItineraryMeal = {
        id: `meal_${dayIndex}_${mealTime.type}`,
        type: mealTime.type,
        name: this.generateMealName(mealTime.type, destination),
        description: this.generateMealDescription(mealTime.type, destination),
        location: {
          name: this.generateMealLocation(mealTime.type, destination),
          address: 'Local restaurant', // Simplified
          coordinates: { lat: 0, lng: 0 },
        },
        time: mealTime.time,
        cost: {
          amount: this.calculateMealCost(mealTime.type, destination, request.travelStyle),
          currency: destination.currency,
          perPerson: true,
        },
        cuisine: this.getLocalCuisine(destination),
        dietaryOptions: this.getDietaryOptions(request.dietaryRestrictions),
        accessibility: {
          wheelchairAccessible: true, // Simplified
        },
        sustainability: {
          localSourcing: true,
          ecoFriendly: true,
        },
        bookingRequired: mealTime.type === 'dinner',
        ...(mealBookingUrl && { bookingUrl: mealBookingUrl }),
      };

      meals.push(meal);
    }

    return meals;
  }

  private generateDayTransportation(
    transportation: TravelTransportation[],
    dayIndex: number,
    request: ItineraryRequest
  ): ItineraryTransportation[] {
    const dayTransport: ItineraryTransportation[] = [];

    // Add basic transportation for the day
    if (dayIndex === 0) {
      // Airport transfer
      dayTransport.push({
        id: `transport_${dayIndex}_airport`,
        type: 'taxi',
        from: 'Airport',
        to: 'Hotel',
        startTime: '10:00',
        endTime: '11:00',
        duration: '1 hour',
        cost: {
          amount: 50,
          currency: 'USD',
          perPerson: false,
        },
        accessibility: {
          wheelchairAccessible: true,
          assistanceAvailable: true,
        },
        sustainability: {
          carbonFootprint: 'medium',
          ecoFriendly: false,
        },
        bookingRequired: false,
        notes: ['Airport pickup arranged'],
      });
    }

    // Add local transportation
    if (transportation.length > 0) {
      const localTransport = transportation[0];
      if (localTransport) {
        dayTransport.push({
          id: `transport_${dayIndex}_local`,
          type: localTransport.type,
          from: 'Hotel',
          to: 'City Center',
          startTime: '9:00',
          endTime: '9:30',
          duration: '30 minutes',
          cost: {
            amount: (localTransport.cost.min + localTransport.cost.max) / 2,
            currency: localTransport.cost.currency,
            perPerson: true,
          },
          accessibility: localTransport.accessibility,
          sustainability: localTransport.sustainability,
          bookingRequired: (localTransport as any).bookingRequired || false,
          ...(localTransport.bookingUrl && { bookingUrl: localTransport.bookingUrl }),
          notes: ['Local transportation pass recommended'],
        });
      }
    }

    return dayTransport;
  }

  private selectAccommodation(
    accommodations: TravelAccommodation[],
    request: ItineraryRequest
  ): ItineraryAccommodation | undefined {
    if (accommodations.length === 0) return undefined;

    const selected = accommodations[0]; // Simplified selection
    if (!selected) {
      return undefined;
    }
    return {
      id: selected.id,
      name: selected.name,
      type: selected.type === 'camping' ? 'hotel' : 
            selected.type === 'apartment' ? 'hotel' :
            selected.type === 'boutique' ? 'hotel' :
            selected.type === 'bed-breakfast' ? 'hotel' :
            selected.type as 'hostel' | 'hotel' | 'resort',
      location: {
        name: selected.location,
        address: selected.location,
        coordinates: selected.coordinates,
      },
      checkIn: '15:00',
      checkOut: '11:00',
      cost: {
        amount: (selected.priceRange.min + selected.priceRange.max) / 2,
        currency: selected.priceRange.currency,
        perNight: true,
      },
      amenities: selected.amenities,
      accessibility: selected.accessibility,
      sustainability: selected.sustainability,
      rating: selected.rating,
      ...(selected.bookingUrl && { bookingUrl: selected.bookingUrl }),
    };
  }

  private calculateTotalBudget(days: ItineraryDay[], travelers: number): number {
    return days.reduce((total, day) => total + day.estimatedCost, 0);
  }

  private calculateDayCost(day: ItineraryDay, travelers: number): number {
    let cost = 0;

    // Activities cost
    cost += day.activities.reduce((sum, activity) => 
      sum + (activity.cost.perPerson ? activity.cost.amount * travelers : activity.cost.amount), 0
    );

    // Meals cost
    cost += day.meals.reduce((sum, meal) => 
      sum + (meal.cost.perPerson ? meal.cost.amount * travelers : meal.cost.amount), 0
    );

    // Transportation cost
    cost += day.transportation.reduce((sum, transport) => 
      sum + (transport.cost.perPerson ? transport.cost.amount * travelers : transport.cost.amount), 0
    );

    // Accommodation cost
    if (day.accommodation) {
      cost += day.accommodation.cost.perNight ? 
        day.accommodation.cost.amount : 
        day.accommodation.cost.amount * travelers;
    }

    return cost;
  }

  private generateSummary(days: ItineraryDay[], destination: TravelDestination) {
    const totalActivities = days.reduce((sum, day) => sum + day.activities.length, 0);
    const totalMeals = days.reduce((sum, day) => sum + day.meals.length, 0);
    const totalTransportation = days.reduce((sum, day) => sum + day.transportation.length, 0);

    const highlights = [
      `Explore ${destination.name}'s top attractions`,
      `Experience local ${this.getLocalCuisine(destination)} cuisine`,
      `Discover hidden gems and local culture`,
      `Enjoy ${destination.highlights.slice(0, 2).join(' and ')}`,
    ];

    const tips = [
      'Book accommodations in advance',
      'Purchase local transportation passes',
      'Try local street food',
      'Learn basic local phrases',
      'Carry cash for small vendors',
    ];

    return {
      totalActivities,
      totalMeals,
      totalTransportation,
      highlights,
      tips,
    };
  }

  // Helper methods
  private calculateDuration(request: ItineraryRequest): number {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[1] || '2') : 2;
  }

  private formatTime(hour: number): string {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  private determineBookingRequired(activity: TravelActivity): boolean {
    return ['culture', 'entertainment'].includes(activity.category);
  }

  private generateBookingUrl(activity: TravelActivity): string | undefined {
    return this.determineBookingRequired(activity) ? 
      `https://bookings.example.com/${activity.id}` : undefined;
  }

  private generateMealName(type: string, destination: TravelDestination): string {
    const mealNames = {
      breakfast: `Local ${destination.name} Breakfast`,
      lunch: `Traditional ${destination.name} Lunch`,
      dinner: `Authentic ${destination.name} Dinner`,
    };
    return mealNames[type as keyof typeof mealNames] || 'Local Meal';
  }

  private generateMealDescription(type: string, destination: TravelDestination): string {
    return `Experience authentic ${this.getLocalCuisine(destination)} cuisine in a local setting`;
  }

  private generateMealLocation(type: string, destination: TravelDestination): string {
    return `Local ${destination.name} Restaurant`;
  }

  private calculateMealCost(type: string, destination: TravelDestination, style: string): number {
    const baseCosts = {
      breakfast: { budget: 5, 'mid-range': 15, luxury: 30 },
      lunch: { budget: 10, 'mid-range': 25, luxury: 50 },
      dinner: { budget: 15, 'mid-range': 40, luxury: 80 },
    };
    return baseCosts[type as keyof typeof baseCosts]?.[style as keyof typeof baseCosts.breakfast] || 20;
  }

  private getLocalCuisine(destination: TravelDestination): string {
    const cuisines: Record<string, string> = {
      'Tokyo': 'Japanese',
      'Paris': 'French',
      'New York City': 'American',
      'London': 'British',
      'Bangkok': 'Thai',
    };
    return cuisines[destination.name] || 'Local';
  }

  private getDietaryOptions(restrictions?: string[]): string[] {
    const options = ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'];
    return restrictions ? options.filter(opt => restrictions.includes(opt)) : options;
  }

  private generateMealBookingUrl(type: string): string | undefined {
    return type === 'dinner' ? 'https://restaurants.example.com/book' : undefined;
  }

  private generateDayNotes(dayIndex: number, totalDays: number, destination: TravelDestination): string[] {
    const notes = [
      'Wear comfortable walking shoes',
      'Bring a camera for photos',
      'Check weather forecast',
    ];

    if (dayIndex === 0) {
      notes.push('Exchange currency at airport', 'Get local SIM card');
    }

    if (dayIndex === totalDays - 1) {
      notes.push('Check out time is 11:00 AM', 'Confirm flight details');
    }

    return notes;
  }

  private generateItineraryId(): string {
    return `itinerary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
