# Developer Guide

This guide provides comprehensive information for developers working on the AI Travel Agent application, including architecture, development setup, coding standards, and contribution guidelines.

## Table of Contents

1. [Development Overview](#development-overview)
2. [Architecture](#architecture)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Coding Standards](#coding-standards)
6. [API Development](#api-development)
7. [Frontend Development](#frontend-development)
8. [Database Design](#database-design)
9. [Testing](#testing)
10. [Deployment](#deployment)
11. [Contributing](#contributing)
12. [Troubleshooting](#troubleshooting)

## Development Overview

The AI Travel Agent is a full-stack web application built with modern technologies and best practices. It provides AI-powered travel planning, real-time data integration, and comprehensive user management.

### Technology Stack

#### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks and context
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **Framer Motion**: Animation library
- **React Hook Form**: Form management
- **Zod**: Schema validation

#### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Firebase**: Authentication and database
- **NextAuth.js**: Authentication framework
- **Google Gemini AI**: AI capabilities
- **External APIs**: Weather, flights, maps, countries

#### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest**: Testing framework
- **Playwright**: E2E testing
- **Storybook**: Component development

### Key Features

- **AI-Powered Itinerary Generation**: Create personalized travel plans
- **Real-Time Data Integration**: Weather, flights, accommodations
- **Multi-Modal Input**: Text, voice, and image inputs
- **Accessibility Support**: WCAG 2.1 AA compliance
- **Internationalization**: Multi-language support
- **Security**: Comprehensive security measures
- **Performance**: Optimized for speed and efficiency

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    System Architecture                      │
├─────────────────────────────────────────────────────────────┤
│ 1. Client Layer (Next.js, React, TypeScript)              │
├─────────────────────────────────────────────────────────────┤
│ 2. API Layer (Next.js API Routes, Middleware)             │
├─────────────────────────────────────────────────────────────┤
│ 3. Service Layer (Business Logic, External APIs)          │
├─────────────────────────────────────────────────────────────┤
│ 4. Data Layer (Firebase Firestore, Vector DB)             │
├─────────────────────────────────────────────────────────────┤
│ 5. AI Layer (Google Gemini, LangChain, RAG)               │
├─────────────────────────────────────────────────────────────┤
│ 6. External Services (Weather, Flights, Maps, Countries)  │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  Component Architecture                     │
├─────────────────────────────────────────────────────────────┤
│ 1. Pages (App Router)                                      │
├─────────────────────────────────────────────────────────────┤
│ 2. Layouts (Root, Auth, Dashboard)                         │
├─────────────────────────────────────────────────────────────┤
│ 3. Components (UI, Forms, Features)                        │
├─────────────────────────────────────────────────────────────┤
│ 4. Hooks (Custom React Hooks)                              │
├─────────────────────────────────────────────────────────────┤
│ 5. Services (Business Logic)                               │
├─────────────────────────────────────────────────────────────┤
│ 6. Utils (Helper Functions)                                │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Data Flow                              │
├─────────────────────────────────────────────────────────────┤
│ 1. User Input → Form Validation → API Request              │
├─────────────────────────────────────────────────────────────┤
│ 2. API Route → Service Layer → External APIs               │
├─────────────────────────────────────────────────────────────┤
│ 3. External APIs → Data Processing → Database Storage      │
├─────────────────────────────────────────────────────────────┤
│ 4. Database → Service Layer → API Response                 │
├─────────────────────────────────────────────────────────────┤
│ 5. API Response → Component State → UI Update              │
└─────────────────────────────────────────────────────────────┘
```

## Development Setup

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: Version 2.30.0 or higher
- **Firebase CLI**: For Firebase operations
- **VS Code**: Recommended IDE with extensions

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/ai-travel-agent.git
   cd ai-travel-agent
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set Up Firebase**
   ```bash
   firebase login
   firebase init
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### VS Code Extensions

Recommended extensions for development:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "firebase.vscode-firebase-explorer"
  ]
}
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

## Project Structure

```
ai-travel-agent/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/                # Dashboard pages
│   ├── itineraries/              # Itinerary pages
│   ├── chat/                     # Chat pages
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── weather/
│   │   ├── flights/
│   │   ├── places/
│   │   ├── itineraries/
│   │   ├── chat/
│   │   ├── health/
│   │   └── metrics/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components
│   ├── forms/                    # Form components
│   ├── features/                 # Feature components
│   ├── layout/                   # Layout components
│   └── providers/                # Context providers
├── lib/                          # Utility libraries
│   ├── auth/                     # Authentication utilities
│   ├── db/                       # Database utilities
│   ├── utils/                    # General utilities
│   ├── validations/              # Validation schemas
│   ├── security/                 # Security utilities
│   ├── monitoring/               # Monitoring utilities
│   ├── performance/              # Performance utilities
│   └── testing/                  # Testing utilities
├── services/                     # Business logic services
│   ├── ai/                       # AI services
│   ├── external/                 # External API services
│   ├── data/                     # Data services
│   └── itinerary/                # Itinerary services
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── styles/                       # CSS and styling
├── public/                       # Static assets
├── docs/                         # Documentation
├── __tests__/                    # Test files
├── tests/                        # E2E tests
├── .storybook/                   # Storybook configuration
├── .github/                      # GitHub workflows
├── firebase.json                 # Firebase configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Jest configuration
├── playwright.config.js          # Playwright configuration
└── package.json                  # Dependencies and scripts
```

## Coding Standards

### TypeScript Standards

#### Type Definitions

```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Use enums for constants
enum UserRole {
  USER = 'user',
  PREMIUM = 'premium',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

// Use type aliases for unions
type Status = 'draft' | 'published' | 'completed';

// Use generics for reusable types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
```

#### Function Definitions

```typescript
// Use explicit return types for public functions
export async function createItinerary(
  userId: string,
  data: CreateItineraryData
): Promise<Itinerary> {
  // Implementation
}

// Use arrow functions for simple operations
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Use async/await for asynchronous operations
export async function fetchWeatherData(location: string): Promise<WeatherData> {
  try {
    const response = await fetch(`/api/weather?location=${location}`);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}
```

### React Standards

#### Component Structure

```typescript
// Use functional components with TypeScript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
        },
        {
          'h-9 px-3 text-sm': size === 'sm',
          'h-10 px-4 py-2': size === 'md',
          'h-11 px-8 text-lg': size === 'lg',
        }
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

#### Hook Usage

```typescript
// Use custom hooks for reusable logic
export function useItinerary(id: string) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItinerary() {
      try {
        setLoading(true);
        const data = await itineraryService.getById(id);
        setItinerary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchItinerary();
  }, [id]);

  return { itinerary, loading, error };
}
```

### API Standards

#### Route Structure

```typescript
// app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { secure } from '@/lib/security';
import { WeatherService } from '@/services/external/weather.service';
import { withErrorHandling } from '@/lib/error-handling';

const weatherService = new WeatherService();

export const GET = secure.user(
  withErrorHandling(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location');
    const type = searchParams.get('type') || 'current';
    const days = parseInt(searchParams.get('days') || '3');

    if (!location) {
      return NextResponse.json(
        { success: false, error: 'Location parameter is required' },
        { status: 400 }
      );
    }

    let data;
    if (type === 'current') {
      data = await weatherService.getCurrentWeather(location);
    } else if (type === 'forecast') {
      data = await weatherService.getWeatherForecast(location, days);
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type parameter' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  })
);
```

#### Error Handling

```typescript
// Use consistent error responses
export function handleApiError(error: unknown, request: NextRequest): NextResponse {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof Error) {
    appError = new AppError(ErrorCode.UNEXPECTED_ERROR, error.message, 500);
  } else {
    appError = new AppError(ErrorCode.UNEXPECTED_ERROR, 'An unknown error occurred', 500);
  }

  return NextResponse.json(
    {
      success: false,
      error: appError.message,
      code: appError.code,
      details: process.env.NODE_ENV === 'development' ? appError.details : undefined,
    },
    { status: appError.httpStatus }
  );
}
```

### Database Standards

#### Firestore Structure

```typescript
// Use consistent document structure
interface FirestoreDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  updatedBy: string;
}

// Use subcollections for related data
interface ItineraryDocument extends FirestoreDocument {
  title: string;
  destination: string;
  startDate: Timestamp;
  endDate: Timestamp;
  travelers: number;
  budget: number;
  status: 'draft' | 'published' | 'completed';
  userId: string;
  // Subcollections: days, activities, comments
}

// Use batch operations for multiple writes
export async function createItineraryWithDays(
  itineraryData: ItineraryData,
  daysData: DayData[]
): Promise<void> {
  const batch = adminDb.batch();
  
  const itineraryRef = adminDb.collection('itineraries').doc();
  batch.set(itineraryRef, itineraryData);
  
  daysData.forEach(dayData => {
    const dayRef = itineraryRef.collection('days').doc();
    batch.set(dayRef, dayData);
  });
  
  await batch.commit();
}
```

## API Development

### API Design Principles

1. **RESTful Design**: Follow REST conventions
2. **Consistent Responses**: Use standard response format
3. **Error Handling**: Comprehensive error handling
4. **Validation**: Input validation and sanitization
5. **Security**: Authentication and authorization
6. **Documentation**: Clear API documentation
7. **Versioning**: API versioning strategy

### API Response Format

```typescript
// Success Response
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Error Response
interface ApiErrorResponse {
  success: false;
  error: string;
  code: string;
  details?: any;
  timestamp: string;
}
```

### API Endpoints

#### Authentication Endpoints

```typescript
// POST /api/auth/signin
export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();
  
  // Validate input
  const validatedData = signinSchema.parse({ email, password });
  
  // Authenticate user
  const user = await authenticateUser(validatedData.email, validatedData.password);
  
  // Create session
  const session = await createSession(user);
  
  return NextResponse.json({
    success: true,
    data: { user, session },
    timestamp: new Date().toISOString(),
  });
};
```

#### Resource Endpoints

```typescript
// GET /api/itineraries
export const GET = secure.user(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  
  const itineraries = await itineraryService.list({
    userId: req.user.id,
    status,
    limit,
    offset,
  });
  
  return NextResponse.json({
    success: true,
    data: itineraries,
    pagination: {
      total: itineraries.length,
      limit,
      offset,
      hasMore: itineraries.length === limit,
    },
    timestamp: new Date().toISOString(),
  });
});
```

### Middleware

#### Authentication Middleware

```typescript
// lib/middleware/auth.ts
export function withAuth(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    try {
      const user = await verifyToken(token);
      req.user = user;
      return handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }
  };
}
```

#### Rate Limiting Middleware

```typescript
// lib/middleware/rate-limit.ts
export function withRateLimit(limit: number, windowMs: number) {
  return (handler: Function) => {
    return async (req: NextRequest, context: any) => {
      const ip = req.ip || req.headers.get('x-forwarded-for');
      const key = `rate_limit:${ip}`;
      
      const current = await redis.get(key) || 0;
      
      if (current >= limit) {
        return NextResponse.json(
          { success: false, error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }
      
      await redis.incr(key);
      await redis.expire(key, Math.ceil(windowMs / 1000));
      
      return handler(req, context);
    };
  };
}
```

## Frontend Development

### Component Development

#### Component Structure

```typescript
// components/features/ItineraryCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Itinerary } from '@/types';

interface ItineraryCardProps {
  itinerary: Itinerary;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function ItineraryCard({
  itinerary,
  onEdit,
  onDelete,
  onShare,
}: ItineraryCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {itinerary.title}
          <Badge variant={getStatusVariant(itinerary.status)}>
            {itinerary.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {itinerary.destination}
          </p>
          <p className="text-sm">
            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
          </p>
          <p className="text-sm">
            {itinerary.travelers} travelers • ${itinerary.budget}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <Button variant="outline" size="sm" onClick={() => onEdit(itinerary.id)}>
              Edit
            </Button>
          )}
          {onShare && (
            <Button variant="outline" size="sm" onClick={() => onShare(itinerary.id)}>
              Share
            </Button>
          )}
          {onDelete && (
            <Button variant="destructive" size="sm" onClick={() => onDelete(itinerary.id)}>
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'published':
      return 'default';
    case 'completed':
      return 'success';
    default:
      return 'secondary';
  }
}
```

#### Form Components

```typescript
// components/forms/ItineraryForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const itinerarySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  travelers: z.number().min(1, 'At least 1 traveler required'),
  budget: z.number().min(0, 'Budget must be positive'),
  travelStyle: z.enum(['budget', 'mid-range', 'luxury']),
});

type ItineraryFormData = z.infer<typeof itinerarySchema>;

interface ItineraryFormProps {
  onSubmit: (data: ItineraryFormData) => void;
  initialData?: Partial<ItineraryFormData>;
  loading?: boolean;
}

export function ItineraryForm({
  onSubmit,
  initialData,
  loading = false,
}: ItineraryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ItineraryFormData>({
    resolver: zodResolver(itinerarySchema),
    defaultValues: initialData,
  });

  const travelStyle = watch('travelStyle');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter trip title"
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          {...register('destination')}
          placeholder="Enter destination"
        />
        {errors.destination && (
          <p className="text-sm text-destructive">{errors.destination.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="travelers">Travelers</Label>
          <Input
            id="travelers"
            type="number"
            min="1"
            {...register('travelers', { valueAsNumber: true })}
          />
          {errors.travelers && (
            <p className="text-sm text-destructive">{errors.travelers.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            min="0"
            {...register('budget', { valueAsNumber: true })}
          />
          {errors.budget && (
            <p className="text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="travelStyle">Travel Style</Label>
        <Select
          value={travelStyle}
          onValueChange={(value) => setValue('travelStyle', value as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select travel style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="budget">Budget</SelectItem>
            <SelectItem value="mid-range">Mid-range</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
          </SelectContent>
        </Select>
        {errors.travelStyle && (
          <p className="text-sm text-destructive">{errors.travelStyle.message}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Create Itinerary'}
      </Button>
    </form>
  );
}
```

### State Management

#### Context Providers

```typescript
// components/providers/ItineraryProvider.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Itinerary } from '@/types';

interface ItineraryState {
  itineraries: Itinerary[];
  loading: boolean;
  error: string | null;
}

type ItineraryAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITINERARIES'; payload: Itinerary[] }
  | { type: 'ADD_ITINERARY'; payload: Itinerary }
  | { type: 'UPDATE_ITINERARY'; payload: Itinerary }
  | { type: 'DELETE_ITINERARY'; payload: string };

const initialState: ItineraryState = {
  itineraries: [],
  loading: false,
  error: null,
};

function itineraryReducer(state: ItineraryState, action: ItineraryAction): ItineraryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ITINERARIES':
      return { ...state, itineraries: action.payload };
    case 'ADD_ITINERARY':
      return { ...state, itineraries: [...state.itineraries, action.payload] };
    case 'UPDATE_ITINERARY':
      return {
        ...state,
        itineraries: state.itineraries.map((itinerary) =>
          itinerary.id === action.payload.id ? action.payload : itinerary
        ),
      };
    case 'DELETE_ITINERARY':
      return {
        ...state,
        itineraries: state.itineraries.filter((itinerary) => itinerary.id !== action.payload),
      };
    default:
      return state;
  }
}

interface ItineraryContextType {
  state: ItineraryState;
  dispatch: React.Dispatch<ItineraryAction>;
}

const ItineraryContext = createContext<ItineraryContextType | undefined>(undefined);

export function ItineraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(itineraryReducer, initialState);

  return (
    <ItineraryContext.Provider value={{ state, dispatch }}>
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItineraryContext() {
  const context = useContext(ItineraryContext);
  if (context === undefined) {
    throw new Error('useItineraryContext must be used within an ItineraryProvider');
  }
  return context;
}
```

#### Custom Hooks

```typescript
// hooks/useItinerary.ts
import { useState, useEffect } from 'react';
import { Itinerary } from '@/types';
import { itineraryService } from '@/services';

export function useItinerary(id: string) {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItinerary() {
      try {
        setLoading(true);
        setError(null);
        const data = await itineraryService.getById(id);
        setItinerary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchItinerary();
    }
  }, [id]);

  const updateItinerary = async (updates: Partial<Itinerary>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedItinerary = await itineraryService.update(id, updates);
      setItinerary(updatedItinerary);
      return updatedItinerary;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItinerary = async () => {
    try {
      setLoading(true);
      setError(null);
      await itineraryService.delete(id);
      setItinerary(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    itinerary,
    loading,
    error,
    updateItinerary,
    deleteItinerary,
  };
}
```

## Database Design

### Firestore Structure

#### Collections

```typescript
// Users collection
interface UserDocument {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Itineraries collection
interface ItineraryDocument {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: Timestamp;
  endDate: Timestamp;
  travelers: number;
  budget: number;
  status: 'draft' | 'published' | 'completed';
  metadata: ItineraryMetadata;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Days subcollection
interface DayDocument {
  id: string;
  day: number;
  date: Timestamp;
  theme: string;
  activities: ActivityDocument[];
  meals: MealDocument[];
  transportation: TransportationDocument[];
  accommodation?: AccommodationDocument;
  estimatedCost: number;
  notes: string[];
}

// Activities subcollection
interface ActivityDocument {
  id: string;
  name: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'other';
  description: string;
  location: LocationDocument;
  timeSlot: TimeSlotDocument;
  duration: number;
  cost: number;
  rating?: number;
  bookingRequired: boolean;
  bookingUrl?: string;
  accessibility: AccessibilityDocument;
  sustainability: SustainabilityDocument;
}
```

#### Indexes

```typescript
// Firestore indexes configuration
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "itineraries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "itineraries",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "destination", "order": "ASCENDING" },
        { "fieldPath": "startDate", "order": "ASCENDING" }
      ]
    }
  ]
}
```

### Database Operations

#### CRUD Operations

```typescript
// services/database/itinerary.service.ts
export class ItineraryService {
  private collection = adminDb.collection('itineraries');

  async create(data: CreateItineraryData): Promise<Itinerary> {
    const docRef = this.collection.doc();
    const itinerary: Itinerary = {
      id: docRef.id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.set(itinerary);
    return itinerary;
  }

  async getById(id: string): Promise<Itinerary | null> {
    const doc = await this.collection.doc(id).get();
    return doc.exists ? (doc.data() as Itinerary) : null;
  }

  async list(filters: ItineraryFilters): Promise<Itinerary[]> {
    let query = this.collection as any;

    if (filters.userId) {
      query = query.where('userId', '==', filters.userId);
    }

    if (filters.status) {
      query = query.where('status', '==', filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as Itinerary);
  }

  async update(id: string, updates: Partial<Itinerary>): Promise<Itinerary> {
    const docRef = this.collection.doc(id);
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await docRef.update(updateData);
    const updatedDoc = await docRef.get();
    return updatedDoc.data() as Itinerary;
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
```

#### Batch Operations

```typescript
// Batch operations for multiple writes
export async function createItineraryWithDays(
  itineraryData: CreateItineraryData,
  daysData: CreateDayData[]
): Promise<Itinerary> {
  const batch = adminDb.batch();
  
  const itineraryRef = this.collection.doc();
  const itinerary: Itinerary = {
    id: itineraryRef.id,
    ...itineraryData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  batch.set(itineraryRef, itinerary);
  
  daysData.forEach((dayData, index) => {
    const dayRef = itineraryRef.collection('days').doc();
    const day: Day = {
      id: dayRef.id,
      day: index + 1,
      ...dayData,
    };
    batch.set(dayRef, day);
  });
  
  await batch.commit();
  return itinerary;
}
```

## Testing

### Unit Testing

#### Service Tests

```typescript
// __tests__/services/weather.service.test.ts
import { WeatherService } from '@/services/external/weather.service';

describe('WeatherService', () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
  });

  describe('getCurrentWeather', () => {
    it('should return current weather for valid location', async () => {
      const result = await weatherService.getCurrentWeather('London');

      expect(result).toBeDefined();
      expect(result.location).toBe('London');
      expect(result.temperature).toBeDefined();
      expect(result.conditions).toBeDefined();
    });

    it('should throw error for invalid location', async () => {
      await expect(weatherService.getCurrentWeather('InvalidCity'))
        .rejects.toThrow('Location not found');
    });
  });
});
```

#### Component Tests

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@/lib/testing';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test Click</Button>);
    const button = screen.getByRole('button', { name: /test click/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/api.test.ts
import { mockAppRouterRequest } from '@/lib/testing';
import { GET } from '@/app/api/weather/route';

describe('Weather API Integration', () => {
  it('should return weather data for valid request', async () => {
    const response = await mockAppRouterRequest(GET, {
      query: { location: 'London', type: 'current' },
      userId: 'test-user',
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.location).toBe('London');
  });
});
```

### E2E Testing

```typescript
// tests/e2e/itinerary.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Itinerary Creation', () => {
  test('should create a new itinerary', async ({ page }) => {
    await page.goto('/itineraries/create');
    
    await page.fill('[data-testid="title-input"]', 'Paris Adventure');
    await page.fill('[data-testid="destination-input"]', 'Paris, France');
    await page.fill('[data-testid="start-date-input"]', '2024-01-15');
    await page.fill('[data-testid="end-date-input"]', '2024-01-20');
    
    await page.click('[data-testid="create-button"]');
    
    await expect(page).toHaveURL(/\/itineraries\/[a-zA-Z0-9-]+/);
    await expect(page.locator('[data-testid="itinerary-title"]')).toContainText('Paris Adventure');
  });
});
```

## Deployment

### Environment Configuration

#### Development

```bash
# .env.local
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-development-secret
FIREBASE_PROJECT_ID=your-dev-project
# ... other development variables
```

#### Production

```bash
# .env.production
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
FIREBASE_PROJECT_ID=your-production-project
# ... other production variables
```

### Build Process

```bash
# Install dependencies
npm ci

# Run tests
npm run test:ci

# Build application
npm run build

# Start production server
npm start
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

## Contributing

### Development Workflow

1. **Fork the Repository**: Create your own fork
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature
4. **Write Tests**: Add tests for your changes
5. **Run Tests**: Ensure all tests pass
6. **Commit Changes**: Use conventional commit messages
7. **Push to Branch**: Push your changes
8. **Create Pull Request**: Submit a PR for review

### Commit Convention

```bash
# Format: type(scope): description
feat(auth): add two-factor authentication
fix(api): resolve rate limiting issue
docs(readme): update installation instructions
style(components): format button component
refactor(services): simplify weather service
test(api): add integration tests for weather endpoint
chore(deps): update dependencies
```

### Code Review Process

1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Team members review code
3. **Testing**: Manual testing of changes
4. **Approval**: At least 2 approvals required
5. **Merge**: Merge to main branch
6. **Deploy**: Automatic deployment to staging

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

#### Firebase Issues

```bash
# Check Firebase CLI
firebase --version

# Login to Firebase
firebase login

# Check project configuration
firebase use --list
```

#### Development Server Issues

```bash
# Check port availability
lsof -i :3000

# Kill process on port
kill -9 $(lsof -t -i:3000)

# Restart development server
npm run dev
```

### Debugging

#### API Debugging

```typescript
// Add logging to API routes
export const GET = async (req: NextRequest) => {
  console.log('API Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });
  
  try {
    // API logic
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

#### Component Debugging

```typescript
// Use React DevTools
import { useEffect } from 'react';

export function MyComponent() {
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  // Component logic
}
```

### Performance Issues

#### Bundle Analysis

```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

#### Memory Leaks

```typescript
// Check for memory leaks
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Memory usage:', process.memoryUsage());
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

## Conclusion

This developer guide provides comprehensive information for contributing to the AI Travel Agent application. Follow the established patterns and conventions to ensure code quality and maintainability.

For additional help, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
