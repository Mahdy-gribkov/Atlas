import { z } from 'zod';

// User Schemas
export const userPreferencesSchema = z.object({
  language: z.enum(['en', 'he']).default('en'),
  timezone: z.string().default('UTC'),
  currency: z.string().default('USD'),
  travelStyle: z.object({
    budget: z.enum(['budget', 'mid-range', 'luxury']).default('mid-range'),
    pace: z.enum(['relaxed', 'moderate', 'fast-paced']).default('moderate'),
    accommodation: z.enum(['hostel', 'hotel', 'airbnb', 'luxury']).default('hotel'),
    transportation: z.enum(['public', 'rental', 'private']).default('public'),
    groupSize: z.enum(['solo', 'couple', 'family', 'group']).default('solo'),
  }),
  interests: z.array(z.string()).default([]),
  accessibility: z.object({
    mobility: z.boolean().default(false),
    visual: z.boolean().default(false),
    hearing: z.boolean().default(false),
    cognitive: z.boolean().default(false),
    notes: z.string().optional(),
  }),
  dietary: z.object({
    restrictions: z.array(z.string()).default([]),
    allergies: z.array(z.string()).default([]),
    preferences: z.array(z.string()).default([]),
  }),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: z.enum(['user', 'agent', 'admin']).default('user'),
  preferences: userPreferencesSchema.optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  preferences: userPreferencesSchema.partial().optional(),
});

// Itinerary Schemas
export const locationSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  coordinates: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  city: z.string().min(1),
  country: z.string().min(1),
});

export const timeSlotSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  flexible: z.boolean().default(false),
});

export const activitySchema = z.object({
  name: z.string().min(1).max(200),
  type: z.enum(['attraction', 'restaurant', 'entertainment', 'shopping', 'other']),
  description: z.string().min(1).max(1000),
  location: locationSchema,
  duration: z.number().min(15).max(1440), // 15 minutes to 24 hours
  cost: z.number().min(0),
  rating: z.number().min(1).max(5).optional(),
  bookingRequired: z.boolean().default(false),
  timeSlot: timeSlotSchema,
});

export const itineraryDaySchema = z.object({
  day: z.number().min(1),
  date: z.string().datetime(),
  activities: z.array(activitySchema).min(1),
  estimatedCost: z.number().min(0),
  notes: z.string().max(500).optional(),
});

export const createItinerarySchema = z.object({
  title: z.string().min(1).max(200),
  destination: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  travelers: z.number().min(1).max(20),
  budget: z.number().min(0),
  preferences: userPreferencesSchema.optional(),
});

export const updateItinerarySchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['draft', 'planning', 'confirmed', 'completed', 'cancelled']).optional(),
  days: z.array(itineraryDaySchema).optional(),
  budget: z.number().min(0).optional(),
});

// Chat Schemas
export const chatMessageSchema = z.object({
  content: z.string().min(1).max(4000),
  role: z.enum(['user', 'assistant', 'system']).default('user'),
  attachments: z.array(z.object({
    type: z.enum(['image', 'link', 'pdf', 'location']),
    url: z.string().url(),
    metadata: z.any().optional(),
  })).optional(),
});

export const createChatSessionSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  context: z.object({
    currentItinerary: z.string().optional(),
    activeTools: z.array(z.string()).default([]),
  }).optional(),
});

// Price Alert Schemas
export const createPriceAlertSchema = z.object({
  type: z.enum(['flight', 'hotel', 'activity']),
  destination: z.string().min(1).max(100),
  targetPrice: z.number().min(0),
  notifications: z.array(z.enum(['email', 'push', 'sms'])).min(1),
});

export const updatePriceAlertSchema = z.object({
  targetPrice: z.number().min(0).optional(),
  status: z.enum(['active', 'triggered', 'expired', 'cancelled']).optional(),
});

// Query Schemas
export const paginationSchema = z.object({
  page: z.string().default('1'),
  limit: z.string().default('10'),
});

export const itineraryQuerySchema = paginationSchema.extend({
  status: z.enum(['draft', 'planning', 'confirmed', 'completed', 'cancelled']).optional(),
  destination: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export const chatQuerySchema = paginationSchema.extend({
  status: z.enum(['active', 'archived', 'deleted']).optional(),
  search: z.string().optional(),
});

// AI Request Schemas
export const aiItineraryRequestSchema = z.object({
  destination: z.string().min(1).max(100),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  travelers: z.number().min(1).max(20),
  budget: z.number().min(0),
  preferences: userPreferencesSchema.optional(),
  prompt: z.string().min(1).max(2000).optional(),
});

export const aiChatRequestSchema = z.object({
  message: z.string().min(1).max(4000),
  sessionId: z.string().optional(),
  context: z.object({
    currentItinerary: z.string().optional(),
    activeTools: z.array(z.string()).default([]),
  }).optional(),
  attachments: z.array(z.object({
    type: z.enum(['image', 'link', 'pdf', 'location']),
    url: z.string().url(),
    metadata: z.any().optional(),
  })).optional(),
});
