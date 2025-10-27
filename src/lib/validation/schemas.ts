import { z } from 'zod';
import { 
  User, 
  UserPreferences, 
  TravelStyle, 
  AccessibilityPreferences, 
  DietaryPreferences,
  Itinerary,
  ItineraryDay,
  Activity,
  Location,
  TimeSlot,
  Accommodation,
  Transportation,
  ItineraryMetadata,
  AccessibilityInfo,
  SustainabilityInfo,
  ChatSession,
  ChatMessage,
  MessageMetadata,
  Attachment,
  ChatContext,
  PriceAlert,
  Notification,
  ApiResponse,
  PaginatedResponse,
  ApiError
} from '@/types';

// Enhanced validation schemas with comprehensive error messages
export const userPreferencesSchema = z.object({
  language: z.enum(['en', 'he'], {
    errorMap: () => ({ message: 'Language must be either English (en) or Hebrew (he)' })
  }).default('en'),
  timezone: z.string().min(1, 'Timezone is required').default('UTC'),
  currency: z.string().length(3, 'Currency must be a 3-letter code').default('USD'),
  travelStyle: z.object({
    budget: z.enum(['budget', 'mid-range', 'luxury'], {
      errorMap: () => ({ message: 'Budget must be budget, mid-range, or luxury' })
    }).default('mid-range'),
    pace: z.enum(['relaxed', 'moderate', 'fast-paced'], {
      errorMap: () => ({ message: 'Pace must be relaxed, moderate, or fast-paced' })
    }).default('moderate'),
    accommodation: z.enum(['hostel', 'hotel', 'airbnb', 'luxury'], {
      errorMap: () => ({ message: 'Accommodation must be hostel, hotel, airbnb, or luxury' })
    }).default('hotel'),
    transportation: z.enum(['public', 'rental', 'private'], {
      errorMap: () => ({ message: 'Transportation must be public, rental, or private' })
    }).default('public'),
    groupSize: z.enum(['solo', 'couple', 'family', 'group'], {
      errorMap: () => ({ message: 'Group size must be solo, couple, family, or group' })
    }).default('solo'),
  }),
  interests: z.array(z.string().min(1, 'Interest cannot be empty')).default([]),
  accessibility: z.object({
    mobility: z.boolean().default(false),
    visual: z.boolean().default(false),
    hearing: z.boolean().default(false),
    cognitive: z.boolean().default(false),
    notes: z.string().max(500, 'Accessibility notes cannot exceed 500 characters').optional(),
  }),
  dietary: z.object({
    restrictions: z.array(z.string().min(1, 'Dietary restriction cannot be empty')).default([]),
    allergies: z.array(z.string().min(1, 'Allergy cannot be empty')).default([]),
    preferences: z.array(z.string().min(1, 'Dietary preference cannot be empty')).default([]),
  }),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  role: z.enum(['user', 'agent', 'admin'], {
    errorMap: () => ({ message: 'Role must be user, agent, or admin' })
  }).default('user'),
  preferences: userPreferencesSchema.optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').optional(),
  preferences: userPreferencesSchema.partial().optional(),
});

// Enhanced location schema with coordinate validation
export const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(200, 'Location name cannot exceed 200 characters'),
  address: z.string().min(1, 'Address is required').max(500, 'Address cannot exceed 500 characters'),
  coordinates: z.object({
    lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  }),
  city: z.string().min(1, 'City is required').max(100, 'City name cannot exceed 100 characters'),
  country: z.string().min(1, 'Country is required').max(100, 'Country name cannot exceed 100 characters'),
});

// Enhanced time slot schema with time validation
export const timeSlotSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format'),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format'),
  flexible: z.boolean().default(false),
}).refine(
  (data) => {
    const start = new Date(`2000-01-01T${data.start}:00`);
    const end = new Date(`2000-01-01T${data.end}:00`);
    return start < end;
  },
  {
    message: 'End time must be after start time',
    path: ['end'],
  }
);

// Enhanced activity schema
export const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required').max(200, 'Activity name cannot exceed 200 characters'),
  type: z.enum(['attraction', 'restaurant', 'entertainment', 'shopping', 'other'], {
    errorMap: () => ({ message: 'Activity type must be attraction, restaurant, entertainment, shopping, or other' })
  }),
  description: z.string().min(1, 'Description is required').max(1000, 'Description cannot exceed 1000 characters'),
  location: locationSchema,
  duration: z.number().min(15, 'Duration must be at least 15 minutes').max(1440, 'Duration cannot exceed 24 hours'),
  cost: z.number().min(0, 'Cost cannot be negative'),
  rating: z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional(),
  bookingRequired: z.boolean().default(false),
  timeSlot: timeSlotSchema,
});

// Enhanced itinerary day schema
export const itineraryDaySchema = z.object({
  day: z.number().min(1, 'Day number must be at least 1'),
  date: z.string().datetime('Invalid date format'),
  activities: z.array(activitySchema).min(1, 'At least one activity is required'),
  accommodation: z.object({
    name: z.string().min(1, 'Accommodation name is required'),
    type: z.enum(['hotel', 'hostel', 'airbnb', 'resort', 'other']),
    location: locationSchema,
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    cost: z.number().min(0),
    rating: z.number().min(1).max(5).optional(),
    amenities: z.array(z.string()).default([]),
  }).optional(),
  transportation: z.object({
    type: z.enum(['flight', 'train', 'bus', 'car', 'walking', 'other']),
    from: locationSchema,
    to: locationSchema,
    departure: z.string().datetime(),
    arrival: z.string().datetime(),
    cost: z.number().min(0),
    bookingReference: z.string().optional(),
  }).optional(),
  estimatedCost: z.number().min(0, 'Estimated cost cannot be negative'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

// Enhanced itinerary schemas
export const createItinerarySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  destination: z.string().min(1, 'Destination is required').max(100, 'Destination cannot exceed 100 characters'),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  travelers: z.number().min(1, 'At least one traveler is required').max(20, 'Cannot exceed 20 travelers'),
  budget: z.number().min(0, 'Budget cannot be negative'),
  preferences: userPreferencesSchema.optional(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const updateItinerarySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').optional(),
  status: z.enum(['draft', 'planning', 'confirmed', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be draft, planning, confirmed, completed, or cancelled' })
  }).optional(),
  days: z.array(itineraryDaySchema).optional(),
  budget: z.number().min(0, 'Budget cannot be negative').optional(),
});

// Enhanced chat schemas
export const chatMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(4000, 'Message cannot exceed 4000 characters'),
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: 'Role must be user, assistant, or system' })
  }).default('user'),
  attachments: z.array(z.object({
    type: z.enum(['image', 'link', 'pdf', 'location'], {
      errorMap: () => ({ message: 'Attachment type must be image, link, pdf, or location' })
    }),
    url: z.string().url('Invalid URL format'),
    metadata: z.any().optional(),
  })).optional(),
});

export const chatSessionSchema = z.object({
  id: z.string().min(1, 'Session ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters'),
  messages: z.array(chatMessageSchema),
  context: z.object({
    conversationMemory: z.array(z.string()),
    activeTools: z.array(z.string()),
    currentItinerary: z.string().optional(),
  }),
  status: z.enum(['active', 'archived', 'deleted'], {
    errorMap: () => ({ message: 'Status must be active, archived, or deleted' })
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createChatSessionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
  context: z.object({
    currentItinerary: z.string().optional(),
    activeTools: z.array(z.string()).default([]),
  }).optional(),
});

// Enhanced price alert schemas
export const createPriceAlertSchema = z.object({
  type: z.enum(['flight', 'hotel', 'activity'], {
    errorMap: () => ({ message: 'Type must be flight, hotel, or activity' })
  }),
  destination: z.string().min(1, 'Destination is required').max(100, 'Destination cannot exceed 100 characters'),
  targetPrice: z.number().min(0, 'Target price cannot be negative'),
  notifications: z.array(z.enum(['email', 'push', 'sms'], {
    errorMap: () => ({ message: 'Notification type must be email, push, or sms' })
  })).min(1, 'At least one notification method is required'),
});

export const updatePriceAlertSchema = z.object({
  targetPrice: z.number().min(0, 'Target price cannot be negative').optional(),
  status: z.enum(['active', 'triggered', 'expired', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be active, triggered, expired, or cancelled' })
  }).optional(),
});

// Enhanced query schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').default('10'),
}).transform((data) => ({
  page: parseInt(data.page),
  limit: parseInt(data.limit),
}));

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

// Enhanced AI request schemas
export const aiItineraryRequestSchema = z.object({
  destination: z.string().min(1, 'Destination is required').max(100, 'Destination cannot exceed 100 characters'),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  travelers: z.number().min(1, 'At least one traveler is required').max(20, 'Cannot exceed 20 travelers'),
  budget: z.number().min(0, 'Budget cannot be negative'),
  preferences: userPreferencesSchema.optional(),
  prompt: z.string().min(1, 'Prompt is required').max(2000, 'Prompt cannot exceed 2000 characters').optional(),
}).refine(
  (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return start < end;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const aiChatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(4000, 'Message cannot exceed 4000 characters'),
  sessionId: z.string().optional(),
  context: z.object({
    currentItinerary: z.string().optional(),
    activeTools: z.array(z.string()).default([]),
  }).optional(),
  attachments: z.array(z.object({
    type: z.enum(['image', 'link', 'pdf', 'location']),
    url: z.string().url('Invalid URL format'),
    metadata: z.any().optional(),
  })).optional(),
});

// Validation utility functions
export class ValidationService {
  /**
   * Validate data against a schema with detailed error messages
   */
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors?: z.ZodError;
  } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error };
      }
      throw error;
    }
  }

  /**
   * Validate data and throw error if invalid
   */
  static validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }

  /**
   * Safe validation that returns null on error
   */
  static safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): T | null {
    try {
      return schema.parse(data);
    } catch {
      return null;
    }
  }

  /**
   * Format validation errors for API responses
   */
  static formatErrors(error: z.ZodError): Array<{
    field: string;
    message: string;
    code: string;
  }> {
    return error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      code: err.code,
    }));
  }
}

// Export all schemas
export {
  userPreferencesSchema,
  createUserSchema,
  updateUserSchema,
  locationSchema,
  timeSlotSchema,
  activitySchema,
  itineraryDaySchema,
  createItinerarySchema,
  updateItinerarySchema,
  chatMessageSchema,
  chatSessionSchema,
  createChatSessionSchema,
  createPriceAlertSchema,
  updatePriceAlertSchema,
  paginationSchema,
  itineraryQuerySchema,
  chatQuerySchema,
  aiItineraryRequestSchema,
  aiChatRequestSchema,
};
