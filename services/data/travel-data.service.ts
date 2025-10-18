import { VectorService, Document } from '../ai/vector.service';

export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  highlights: string[];
  bestTimeToVisit: string[];
  currency: string;
  language: string[];
  timezone: string;
  visaRequirements: string;
  safetyLevel: 'low' | 'medium' | 'high';
  budgetLevel: 'budget' | 'mid-range' | 'luxury';
  categories: string[];
  images: string[];
  climate: {
    temperature: {
      min: number;
      max: number;
    };
    rainfall: number;
    humidity: number;
  };
}

export interface TravelActivity {
  id: string;
  name: string;
  description: string;
  location: string;
  category: 'sightseeing' | 'adventure' | 'culture' | 'food' | 'nature' | 'entertainment' | 'shopping' | 'relaxation';
  duration: string;
  cost: {
    min: number;
    max: number;
    currency: string;
  };
  difficulty: 'easy' | 'moderate' | 'challenging';
  accessibility: {
    wheelchairAccessible: boolean;
    familyFriendly: boolean;
    petFriendly: boolean;
  };
  sustainability: {
    ecoFriendly: boolean;
    carbonFootprint: 'low' | 'medium' | 'high';
    localImpact: 'positive' | 'neutral' | 'negative';
  };
  bestTime: string[];
  requirements: string[];
  tips: string[];
  images: string[];
}

export interface TravelAccommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'boutique' | 'bed-breakfast' | 'camping';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  amenities: string[];
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  rating: number;
  sustainability: {
    ecoCertified: boolean;
    localOwned: boolean;
    greenPractices: string[];
  };
  accessibility: {
    wheelchairAccessible: boolean;
    accessibleRooms: number;
    accessibleFacilities: string[];
  };
  images: string[];
  bookingUrl?: string;
}

export interface TravelTransportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'bike' | 'walking';
  from: string;
  to: string;
  duration: string;
  cost: {
    min: number;
    max: number;
    currency: string;
  };
  sustainability: {
    carbonFootprint: 'low' | 'medium' | 'high';
    ecoFriendly: boolean;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    assistanceAvailable: boolean;
  };
  frequency: string;
  bookingUrl?: string;
}

export class TravelDataService {
  private vectorService: VectorService;
  private destinations: Map<string, TravelDestination> = new Map();
  private activities: Map<string, TravelActivity> = new Map();
  private accommodations: Map<string, TravelAccommodation> = new Map();
  private transportation: Map<string, TravelTransportation> = new Map();

  constructor() {
    this.vectorService = new VectorService();
    this.initializeData();
  }

  private initializeData(): void {
    this.loadDestinations();
    this.loadActivities();
    this.loadAccommodations();
    this.loadTransportation();
  }

  private loadDestinations(): void {
    const destinations: TravelDestination[] = [
      {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japan',
        region: 'Asia',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        description: 'Tokyo is Japan\'s bustling capital, blending traditional culture with cutting-edge technology. From ancient temples to futuristic skyscrapers, Tokyo offers an incredible mix of experiences.',
        highlights: [
          'Senso-ji Temple in Asakusa',
          'Tokyo Skytree observation deck',
          'Shibuya Crossing',
          'Tsukiji Outer Market',
          'Meiji Shrine',
          'Harajuku fashion district',
          'Ginza shopping district',
          'Ueno Park and museums'
        ],
        bestTimeToVisit: ['March-May (Cherry Blossom)', 'September-November (Autumn Colors)'],
        currency: 'JPY',
        language: ['Japanese', 'English (limited)'],
        timezone: 'JST (UTC+9)',
        visaRequirements: 'Visa-free for most countries (90 days)',
        safetyLevel: 'high',
        budgetLevel: 'mid-range',
        categories: ['culture', 'food', 'technology', 'shopping', 'temples'],
        images: ['tokyo-skyline.jpg', 'sensoji-temple.jpg', 'shibuya-crossing.jpg'],
        climate: {
          temperature: { min: 5, max: 30 },
          rainfall: 1500,
          humidity: 65
        }
      },
      {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        region: 'Europe',
        coordinates: { lat: 48.8566, lng: 2.3522 },
        description: 'Paris, the City of Light, is renowned for its art, fashion, cuisine, and iconic landmarks. It\'s a city that has inspired artists, writers, and dreamers for centuries.',
        highlights: [
          'Eiffel Tower',
          'Louvre Museum',
          'Notre-Dame Cathedral',
          'Arc de Triomphe',
          'Sacré-Cœur Basilica',
          'Champs-Élysées',
          'Montmartre district',
          'Seine River cruises'
        ],
        bestTimeToVisit: ['April-June', 'September-November'],
        currency: 'EUR',
        language: ['French', 'English (tourist areas)'],
        timezone: 'CET (UTC+1)',
        visaRequirements: 'Schengen visa for non-EU citizens',
        safetyLevel: 'medium',
        budgetLevel: 'mid-range',
        categories: ['art', 'culture', 'food', 'romance', 'history'],
        images: ['eiffel-tower.jpg', 'louvre-museum.jpg', 'notre-dame.jpg'],
        climate: {
          temperature: { min: 2, max: 25 },
          rainfall: 650,
          humidity: 75
        }
      },
      {
        id: 'new-york',
        name: 'New York City',
        country: 'United States',
        region: 'North America',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        description: 'New York City, the Big Apple, is a vibrant metropolis that never sleeps. It\'s a melting pot of cultures, cuisines, and experiences that offers something for everyone.',
        highlights: [
          'Statue of Liberty',
          'Central Park',
          'Times Square',
          'Brooklyn Bridge',
          'Empire State Building',
          'Broadway shows',
          'Metropolitan Museum of Art',
          'High Line park'
        ],
        bestTimeToVisit: ['April-June', 'September-November'],
        currency: 'USD',
        language: ['English', 'Spanish (many areas)'],
        timezone: 'EST (UTC-5)',
        visaRequirements: 'ESTA or visa required for most countries',
        safetyLevel: 'medium',
        budgetLevel: 'mid-range',
        categories: ['culture', 'entertainment', 'shopping', 'food', 'art'],
        images: ['nyc-skyline.jpg', 'statue-liberty.jpg', 'central-park.jpg'],
        climate: {
          temperature: { min: -2, max: 28 },
          rainfall: 1200,
          humidity: 60
        }
      },
      {
        id: 'london',
        name: 'London',
        country: 'United Kingdom',
        region: 'Europe',
        coordinates: { lat: 51.5074, lng: -0.1278 },
        description: 'London is a historic city that seamlessly blends tradition with modernity. From royal palaces to cutting-edge art galleries, London offers a rich tapestry of experiences.',
        highlights: [
          'Big Ben and Westminster',
          'Tower of London',
          'British Museum',
          'Buckingham Palace',
          'London Eye',
          'Tower Bridge',
          'Hyde Park',
          'West End theatre district'
        ],
        bestTimeToVisit: ['May-September'],
        currency: 'GBP',
        language: ['English'],
        timezone: 'GMT (UTC+0)',
        visaRequirements: 'Visa required for most non-EU citizens',
        safetyLevel: 'high',
        budgetLevel: 'mid-range',
        categories: ['history', 'culture', 'royalty', 'museums', 'theatre'],
        images: ['big-ben.jpg', 'tower-bridge.jpg', 'buckingham-palace.jpg'],
        climate: {
          temperature: { min: 2, max: 22 },
          rainfall: 600,
          humidity: 80
        }
      },
      {
        id: 'bangkok',
        name: 'Bangkok',
        country: 'Thailand',
        region: 'Asia',
        coordinates: { lat: 13.7563, lng: 100.5018 },
        description: 'Bangkok is a vibrant city that offers an intoxicating mix of ancient temples, bustling markets, modern skyscrapers, and incredible street food.',
        highlights: [
          'Grand Palace and Wat Phra Kaew',
          'Wat Pho (Temple of the Reclining Buddha)',
          'Chatuchak Weekend Market',
          'Floating markets',
          'Khao San Road',
          'Jim Thompson House',
          'Lumpini Park',
          'Chinatown'
        ],
        bestTimeToVisit: ['November-February'],
        currency: 'THB',
        language: ['Thai', 'English (tourist areas)'],
        timezone: 'ICT (UTC+7)',
        visaRequirements: 'Visa-free for most countries (30 days)',
        safetyLevel: 'medium',
        budgetLevel: 'budget',
        categories: ['culture', 'food', 'temples', 'markets', 'nightlife'],
        images: ['grand-palace.jpg', 'wat-pho.jpg', 'floating-market.jpg'],
        climate: {
          temperature: { min: 20, max: 35 },
          rainfall: 1400,
          humidity: 80
        }
      }
    ];

    destinations.forEach(dest => {
      this.destinations.set(dest.id, dest);
    });
  }

  private loadActivities(): void {
    const activities: TravelActivity[] = [
      {
        id: 'tokyo-sensoji-temple',
        name: 'Visit Senso-ji Temple',
        description: 'Explore Tokyo\'s oldest temple in the historic Asakusa district. Experience traditional Japanese architecture and culture.',
        location: 'Asakusa, Tokyo',
        category: 'culture',
        duration: '2-3 hours',
        cost: { min: 0, max: 0, currency: 'JPY' },
        difficulty: 'easy',
        accessibility: {
          wheelchairAccessible: true,
          familyFriendly: true,
          petFriendly: false
        },
        sustainability: {
          ecoFriendly: true,
          carbonFootprint: 'low',
          localImpact: 'positive'
        },
        bestTime: ['Morning', 'Evening'],
        requirements: ['Respectful clothing', 'Remove shoes in temple areas'],
        tips: [
          'Visit early morning for fewer crowds',
          'Try traditional street food in Nakamise-dori',
          'Take a rickshaw tour of the area',
          'Visit during festivals for special experiences'
        ],
        images: ['sensoji-temple.jpg', 'nakamise-dori.jpg']
      },
      {
        id: 'paris-louvre-museum',
        name: 'Louvre Museum Tour',
        description: 'Discover the world\'s largest art museum, home to the Mona Lisa and thousands of other masterpieces.',
        location: 'Louvre, Paris',
        category: 'culture',
        duration: '4-6 hours',
        cost: { min: 17, max: 17, currency: 'EUR' },
        difficulty: 'easy',
        accessibility: {
          wheelchairAccessible: true,
          familyFriendly: true,
          petFriendly: false
        },
        sustainability: {
          ecoFriendly: true,
          carbonFootprint: 'low',
          localImpact: 'positive'
        },
        bestTime: ['Wednesday', 'Friday (late opening)'],
        requirements: ['Advance booking recommended', 'Valid ID'],
        tips: [
          'Book tickets online to avoid queues',
          'Start with the most famous works',
          'Take breaks in the museum cafes',
          'Consider a guided tour for better understanding'
        ],
        images: ['louvre-pyramid.jpg', 'mona-lisa.jpg']
      },
      {
        id: 'nyc-central-park',
        name: 'Central Park Exploration',
        description: 'Discover the heart of Manhattan in this iconic 843-acre park. Perfect for walking, cycling, or simply relaxing.',
        location: 'Manhattan, New York',
        category: 'nature',
        duration: '2-4 hours',
        cost: { min: 0, max: 0, currency: 'USD' },
        difficulty: 'easy',
        accessibility: {
          wheelchairAccessible: true,
          familyFriendly: true,
          petFriendly: true
        },
        sustainability: {
          ecoFriendly: true,
          carbonFootprint: 'low',
          localImpact: 'positive'
        },
        bestTime: ['Spring', 'Fall', 'Early morning', 'Late afternoon'],
        requirements: ['Comfortable walking shoes', 'Water bottle'],
        tips: [
          'Rent a bike for faster exploration',
          'Visit the Central Park Zoo',
          'Take a horse-drawn carriage ride',
          'Have a picnic by the lake'
        ],
        images: ['central-park-lake.jpg', 'central-park-bridge.jpg']
      }
    ];

    activities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });
  }

  private loadAccommodations(): void {
    const accommodations: TravelAccommodation[] = [
      {
        id: 'tokyo-park-hyatt',
        name: 'Park Hyatt Tokyo',
        type: 'hotel',
        location: 'Shinjuku, Tokyo',
        coordinates: { lat: 35.6762, lng: 139.6503 },
        description: 'Luxury hotel with stunning city views, world-class dining, and exceptional service in the heart of Tokyo.',
        amenities: [
          'Spa and wellness center',
          'Multiple restaurants',
          'Rooftop bar',
          'Concierge service',
          'Business center',
          'Fitness center'
        ],
        priceRange: { min: 800, max: 2000, currency: 'USD' },
        rating: 4.8,
        sustainability: {
          ecoCertified: true,
          localOwned: false,
          greenPractices: ['Energy efficient lighting', 'Water conservation', 'Local sourcing']
        },
        accessibility: {
          wheelchairAccessible: true,
          accessibleRooms: 5,
          accessibleFacilities: ['Elevators', 'Ramps', 'Accessible bathrooms']
        },
        images: ['park-hyatt-tokyo.jpg', 'park-hyatt-room.jpg'],
        bookingUrl: 'https://www.hyatt.com/en-US/hotel/japan/park-hyatt-tokyo/tyoph'
      },
      {
        id: 'paris-ritz',
        name: 'The Ritz Paris',
        type: 'hotel',
        location: 'Place Vendôme, Paris',
        coordinates: { lat: 48.8676, lng: 2.3301 },
        description: 'Iconic luxury hotel in the heart of Paris, known for its elegance, history, and exceptional service.',
        amenities: [
          'Chanel spa',
          'Michelin-starred restaurants',
          'Bar Hemingway',
          'Shopping arcade',
          'Concierge service',
          'Valet parking'
        ],
        priceRange: { min: 1000, max: 3000, currency: 'EUR' },
        rating: 4.9,
        sustainability: {
          ecoCertified: true,
          localOwned: false,
          greenPractices: ['Sustainable sourcing', 'Waste reduction', 'Energy efficiency']
        },
        accessibility: {
          wheelchairAccessible: true,
          accessibleRooms: 3,
          accessibleFacilities: ['Elevators', 'Accessible entrances', 'Accessible bathrooms']
        },
        images: ['ritz-paris.jpg', 'ritz-paris-suite.jpg'],
        bookingUrl: 'https://www.ritzparis.com/'
      }
    ];

    accommodations.forEach(accommodation => {
      this.accommodations.set(accommodation.id, accommodation);
    });
  }

  private loadTransportation(): void {
    const transportation: TravelTransportation[] = [
      {
        id: 'tokyo-metro',
        type: 'train',
        from: 'Any Tokyo station',
        to: 'Any Tokyo station',
        duration: 'Varies by distance',
        cost: { min: 170, max: 320, currency: 'JPY' },
        sustainability: {
          carbonFootprint: 'low',
          ecoFriendly: true
        },
        accessibility: {
          wheelchairAccessible: true,
          assistanceAvailable: true
        },
        frequency: 'Every 2-5 minutes',
        bookingUrl: 'https://www.tokyometro.jp/en/'
      },
      {
        id: 'paris-metro',
        type: 'train',
        from: 'Any Paris station',
        to: 'Any Paris station',
        duration: 'Varies by distance',
        cost: { min: 1.90, max: 1.90, currency: 'EUR' },
        sustainability: {
          carbonFootprint: 'low',
          ecoFriendly: true
        },
        accessibility: {
          wheelchairAccessible: false,
          assistanceAvailable: false
        },
        frequency: 'Every 2-5 minutes',
        bookingUrl: 'https://www.ratp.fr/en'
      }
    ];

    transportation.forEach(transport => {
      this.transportation.set(transport.id, transport);
    });
  }

  // Public methods for accessing data
  async getDestinations(): Promise<TravelDestination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<TravelDestination | null> {
    return this.destinations.get(id) || null;
  }

  async searchDestinations(query: string): Promise<TravelDestination[]> {
    const results = await this.vectorService.queryDocuments(query, 10);
    const destinationIds = results
      .map(result => result.metadata.destinationId)
      .filter(Boolean);
    
    return destinationIds
      .map(id => this.destinations.get(id))
      .filter(Boolean) as TravelDestination[];
  }

  async getActivitiesByDestination(destinationId: string): Promise<TravelActivity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.location.toLowerCase().includes(destinationId.toLowerCase()));
  }

  async getAccommodationsByDestination(destinationId: string): Promise<TravelAccommodation[]> {
    return Array.from(this.accommodations.values())
      .filter(accommodation => accommodation.location.toLowerCase().includes(destinationId.toLowerCase()));
  }

  async getTransportationByDestination(destinationId: string): Promise<TravelTransportation[]> {
    return Array.from(this.transportation.values())
      .filter(transport => 
        transport.from.toLowerCase().includes(destinationId.toLowerCase()) ||
        transport.to.toLowerCase().includes(destinationId.toLowerCase())
      );
  }

  async getActivitiesByCategory(category: string): Promise<TravelActivity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.category === category);
  }

  async getBudgetFriendlyOptions(budget: 'budget' | 'mid-range' | 'luxury'): Promise<{
    destinations: TravelDestination[];
    accommodations: TravelAccommodation[];
    activities: TravelActivity[];
  }> {
    return {
      destinations: Array.from(this.destinations.values())
        .filter(dest => dest.budgetLevel === budget),
      accommodations: Array.from(this.accommodations.values())
        .filter(acc => {
          const avgPrice = (acc.priceRange.min + acc.priceRange.max) / 2;
          if (budget === 'budget') return avgPrice < 100;
          if (budget === 'mid-range') return avgPrice >= 100 && avgPrice < 300;
          return avgPrice >= 300;
        }),
      activities: Array.from(this.activities.values())
        .filter(activity => {
          const avgCost = (activity.cost.min + activity.cost.max) / 2;
          if (budget === 'budget') return avgCost < 50;
          if (budget === 'mid-range') return avgCost >= 50 && avgCost < 150;
          return avgCost >= 150;
        })
    };
  }

  async getSustainableOptions(): Promise<{
    destinations: TravelDestination[];
    accommodations: TravelAccommodation[];
    activities: TravelActivity[];
    transportation: TravelTransportation[];
  }> {
    return {
      destinations: Array.from(this.destinations.values())
        .filter(dest => dest.safetyLevel === 'high'), // Assuming safer destinations are more sustainable
      accommodations: Array.from(this.accommodations.values())
        .filter(acc => acc.sustainability.ecoCertified),
      activities: Array.from(this.activities.values())
        .filter(activity => activity.sustainability.ecoFriendly),
      transportation: Array.from(this.transportation.values())
        .filter(transport => transport.sustainability.ecoFriendly)
    };
  }

  async getAccessibleOptions(): Promise<{
    destinations: TravelDestination[];
    accommodations: TravelAccommodation[];
    activities: TravelActivity[];
    transportation: TravelTransportation[];
  }> {
    return {
      destinations: Array.from(this.destinations.values()), // All destinations can be made accessible
      accommodations: Array.from(this.accommodations.values())
        .filter(acc => acc.accessibility.wheelchairAccessible),
      activities: Array.from(this.activities.values())
        .filter(activity => activity.accessibility.wheelchairAccessible),
      transportation: Array.from(this.transportation.values())
        .filter(transport => transport.accessibility.wheelchairAccessible)
    };
  }

  // Method to ingest travel data into vector database
  async ingestTravelData(): Promise<void> {
    const documents: Document[] = [];

    // Ingest destinations
    for (const destination of Array.from(this.destinations.values())) {
      documents.push({
        id: `destination_${destination.id}`,
        content: `${destination.name} Travel Guide - ${destination.description}. Highlights: ${destination.highlights.join(', ')}. Best time to visit: ${destination.bestTimeToVisit.join(', ')}. Currency: ${destination.currency}. Language: ${destination.language.join(', ')}. Safety level: ${destination.safetyLevel}. Budget level: ${destination.budgetLevel}.`,
        metadata: {
          title: `${destination.name} Travel Guide`,
          type: 'destination',
          destinationId: destination.id,
          location: `${destination.name}, ${destination.country}`,
          tags: [destination.name.toLowerCase(), destination.country.toLowerCase(), ...destination.categories],
          source: 'travel-data-service',
          createdAt: new Date(),
        },
      });
    }

    // Ingest activities
    for (const activity of Array.from(this.activities.values())) {
      documents.push({
        id: `activity_${activity.id}`,
        content: `${activity.name} - ${activity.description}. Location: ${activity.location}. Category: ${activity.category}. Duration: ${activity.duration}. Cost: ${activity.cost.min}-${activity.cost.max} ${activity.cost.currency}. Difficulty: ${activity.difficulty}. Tips: ${activity.tips.join(', ')}.`,
        metadata: {
          title: activity.name,
          type: 'activity',
          activityId: activity.id,
          location: activity.location,
          tags: [activity.category, activity.location.toLowerCase()],
          source: 'travel-data-service',
          createdAt: new Date(),
        },
      });
    }

    await this.vectorService.upsertDocuments(documents);
    console.log(`Successfully ingested ${documents.length} travel data documents`);
  }
}
