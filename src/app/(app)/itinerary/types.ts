// Itinerary Types
export interface Itinerary {
  id: string;
  title: string;
  description: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  status: 'draft' | 'planned' | 'booked' | 'completed' | 'cancelled';
  days: ItineraryDay[];
  travelers: Traveler[];
  preferences: ItineraryPreferences;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface ItineraryDay {
  date: Date;
  activities: Activity[];
  accommodations?: Accommodation;
  transportation?: Transportation[];
  meals: Meal[];
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: 'sightseeing' | 'adventure' | 'cultural' | 'relaxation' | 'shopping' | 'nightlife';
  location: Location;
  duration: number; // in hours
  cost: number;
  currency: string;
  rating: number;
  bookingRequired: boolean;
  bookingUrl?: string;
  timeSlot: {
    start: string;
    end: string;
  };
}

export interface Location {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  city: string;
  country: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'bnb';
  location: Location;
  checkIn: Date;
  checkOut: Date;
  cost: number;
  currency: string;
  rating: number;
  amenities: string[];
  bookingUrl?: string;
}

export interface Transportation {
  id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'taxi' | 'walking';
  from: Location;
  to: Location;
  departureTime: Date;
  arrivalTime: Date;
  cost: number;
  currency: string;
  bookingUrl?: string;
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  location: Location;
  cost: number;
  currency: string;
  cuisine: string;
  dietaryRestrictions: string[];
  bookingUrl?: string;
}

export interface Traveler {
  id: string;
  name: string;
  email: string;
  age: number;
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
  interests: string[];
}

export interface ItineraryPreferences {
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  interests: string[];
  accommodationType: string[];
  transportationMode: string[];
  mealPreferences: string[];
  accessibilityNeeds: string[];
  groupSize: number;
  pace: 'relaxed' | 'moderate' | 'fast';
}

export interface ItinerarySearchFilters {
  destination?: string;
  startDate?: Date;
  endDate?: Date;
  budget?: {
    min: number;
    max: number;
  };
  travelers?: number;
  interests?: string[];
  accommodationType?: string[];
}

export interface ItineraryRecommendation {
  id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  cost: number;
  currency: string;
  rating: number;
  imageUrl: string;
  tags: string[];
  activities: Activity[];
}
