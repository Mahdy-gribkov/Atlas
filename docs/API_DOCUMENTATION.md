# API Documentation

This document provides comprehensive documentation for all API endpoints in the AI Travel Agent application.

## Table of Contents

1. [Authentication](#authentication)
2. [Health & Monitoring](#health--monitoring)
3. [User Management](#user-management)
4. [Travel Services](#travel-services)
5. [Itinerary Management](#itinerary-management)
6. [Chat & AI Services](#chat--ai-services)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

## Authentication

The application uses NextAuth.js for authentication. All protected endpoints require a valid session token.

### Authentication Headers

```http
Authorization: Bearer <session-token>
```

### Session Token

The session token is obtained through the NextAuth.js authentication flow:

1. **Login**: `POST /api/auth/signin`
2. **Session**: `GET /api/auth/session`
3. **Logout**: `POST /api/auth/signout`

## Health & Monitoring

### GET /api/health

Comprehensive health check endpoint that verifies all system components.

**Request:**
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "pass",
      "message": "Database connection healthy",
      "responseTime": 5
    },
    "externalServices": {
      "status": "pass",
      "message": "4/4 external services healthy",
      "responseTime": 100
    },
    "memory": {
      "status": "pass",
      "message": "Memory usage normal",
      "details": {
        "used": 256,
        "total": 512,
        "percentage": 50
      }
    },
    "disk": {
      "status": "pass",
      "message": "Disk space normal",
      "details": {
        "usagePercent": 45
      }
    },
    "api": {
      "status": "pass",
      "message": "API performance normal",
      "details": {
        "errorRate": 0.5,
        "avgResponseTime": 150,
        "totalRequests": 1000
      }
    }
  },
  "metrics": {
    "errorRate": 0.5,
    "avgResponseTime": 150,
    "totalRequests": 1000,
    "totalErrors": 5
  }
}
```

**Status Codes:**
- `200` - All systems healthy
- `503` - Some systems degraded
- `500` - Critical systems failing

### GET /api/ready

Readiness check for container orchestration (Kubernetes, Docker).

**Request:**
```http
GET /api/ready
```

**Response:**
```json
{
  "status": "ready",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Application ready
- `503` - Application not ready

### GET /api/live

Liveness check for basic application availability.

**Request:**
```http
GET /api/live
```

**Response:**
```json
{
  "status": "alive",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Application alive

### GET /api/metrics

Application metrics endpoint (Admin only).

**Request:**
```http
GET /api/metrics
Authorization: Bearer <admin-session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response_time": {
      "count": 1000,
      "sum": 150000,
      "avg": 150,
      "min": 50,
      "max": 500,
      "latest": 120
    },
    "memory_usage": {
      "count": 1000,
      "sum": 256000000,
      "avg": 256000,
      "min": 200000,
      "max": 300000,
      "latest": 250000
    },
    "requests": {
      "/api/health": 100,
      "/api/weather": 500,
      "/api/flights": 200
    },
    "errors": {
      "/api/weather": 5,
      "/api/flights": 2
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes:**
- `200` - Metrics retrieved successfully
- `401` - Unauthorized (not admin)
- `403` - Forbidden

## User Management

### GET /api/users/profile

Get current user profile.

**Request:**
```http
GET /api/users/profile
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "preferences": {
      "language": "en",
      "currency": "USD",
      "notifications": {
        "email": true,
        "push": false
      }
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Profile retrieved successfully
- `401` - Unauthorized

### PUT /api/users/profile

Update user profile.

**Request:**
```http
PUT /api/users/profile
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "language": "he",
    "currency": "ILS",
    "notifications": {
      "email": true,
      "push": true
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Smith",
    "role": "user",
    "preferences": {
      "language": "he",
      "currency": "ILS",
      "notifications": {
        "email": true,
        "push": true
      }
    },
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Profile updated successfully
- `400` - Invalid input data
- `401` - Unauthorized

## Travel Services

### GET /api/weather

Get weather information for a location.

**Request:**
```http
GET /api/weather?location=London&type=current
Authorization: Bearer <session-token>
```

**Query Parameters:**
- `location` (required): City name or coordinates
- `type` (required): `current` or `forecast`
- `days` (optional): Number of forecast days (1-7, default: 3)

**Response (Current Weather):**
```json
{
  "success": true,
  "data": {
    "location": "London",
    "country": "GB",
    "coordinates": {
      "lat": 51.5074,
      "lng": -0.1278
    },
    "current": {
      "temperature": 15,
      "feelsLike": 13,
      "humidity": 65,
      "pressure": 1013,
      "visibility": 10000,
      "uvIndex": 3,
      "conditions": "Cloudy",
      "description": "overcast clouds",
      "icon": "04d",
      "wind": {
        "speed": 3.5,
        "direction": 230,
        "gust": 5.2
      }
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Forecast):**
```json
{
  "success": true,
  "data": {
    "location": "London",
    "country": "GB",
    "forecast": [
      {
        "date": "2024-01-01",
        "temperature": {
          "min": 12,
          "max": 18
        },
        "conditions": "Cloudy",
        "description": "overcast clouds",
        "icon": "04d",
        "precipitation": {
          "probability": 20,
          "amount": 0.5
        },
        "wind": {
          "speed": 3.5,
          "direction": 230
        }
      }
    ],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Weather data retrieved successfully
- `400` - Invalid parameters
- `401` - Unauthorized
- `503` - Weather service unavailable

### GET /api/flights

Search for flights.

**Request:**
```http
GET /api/flights?origin=LHR&destination=CDG&departureDate=2024-01-15&adults=2
Authorization: Bearer <session-token>
```

**Query Parameters:**
- `origin` (required): IATA airport code
- `destination` (required): IATA airport code
- `departureDate` (required): Departure date (YYYY-MM-DD)
- `returnDate` (optional): Return date (YYYY-MM-DD)
- `adults` (optional): Number of adults (default: 1)
- `children` (optional): Number of children (default: 0)
- `infants` (optional): Number of infants (default: 0)
- `class` (optional): Cabin class (`economy`, `premium`, `business`, `first`)

**Response:**
```json
{
  "success": true,
  "data": {
    "flights": [
      {
        "id": "flight-123",
        "airline": "British Airways",
        "flightNumber": "BA304",
        "aircraft": "Airbus A320",
        "departure": {
          "airport": "LHR",
          "terminal": "5",
          "time": "2024-01-15T08:30:00.000Z"
        },
        "arrival": {
          "airport": "CDG",
          "terminal": "2A",
          "time": "2024-01-15T10:45:00.000Z"
        },
        "duration": "2h 15m",
        "stops": 0,
        "price": {
          "amount": 250,
          "currency": "EUR",
          "perPerson": true
        },
        "class": "economy",
        "baggage": {
          "included": true,
          "weight": "23kg"
        },
        "bookingUrl": "https://example.com/book/flight-123"
      }
    ],
    "searchParams": {
      "origin": "LHR",
      "destination": "CDG",
      "departureDate": "2024-01-15",
      "adults": 2
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Flights retrieved successfully
- `400` - Invalid parameters
- `401` - Unauthorized
- `503` - Flight service unavailable

### GET /api/places

Search for places and attractions.

**Request:**
```http
GET /api/places?location=Paris&type=attraction&radius=5000
Authorization: Bearer <session-token>
```

**Query Parameters:**
- `location` (required): City name or coordinates
- `type` (optional): Place type (`attraction`, `restaurant`, `hotel`, `shopping`)
- `radius` (optional): Search radius in meters (default: 5000)
- `keyword` (optional): Search keyword
- `priceLevel` (optional): Price level (1-4)

**Response:**
```json
{
  "success": true,
  "data": {
    "places": [
      {
        "id": "place-123",
        "name": "Eiffel Tower",
        "type": "attraction",
        "description": "Iconic iron tower and symbol of Paris",
        "location": {
          "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
          "coordinates": {
            "lat": 48.8584,
            "lng": 2.2945
          }
        },
        "rating": 4.6,
        "priceLevel": 3,
        "openingHours": {
          "monday": "09:30-23:45",
          "tuesday": "09:30-23:45",
          "wednesday": "09:30-23:45",
          "thursday": "09:30-23:45",
          "friday": "09:30-23:45",
          "saturday": "09:30-23:45",
          "sunday": "09:30-23:45"
        },
        "photos": [
          "https://example.com/photo1.jpg",
          "https://example.com/photo2.jpg"
        ],
        "reviews": [
          {
            "author": "John Doe",
            "rating": 5,
            "text": "Amazing view from the top!",
            "date": "2024-01-01T00:00:00.000Z"
          }
        ],
        "accessibility": {
          "wheelchairAccessible": true,
          "elevator": true,
          "accessibleRestrooms": true
        },
        "sustainability": {
          "ecoFriendly": true,
          "carbonFootprint": 0,
          "localBusiness": true
        }
      }
    ],
    "searchParams": {
      "location": "Paris",
      "type": "attraction",
      "radius": 5000
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Places retrieved successfully
- `400` - Invalid parameters
- `401` - Unauthorized
- `503` - Places service unavailable

## Itinerary Management

### GET /api/itineraries

Get user's itineraries.

**Request:**
```http
GET /api/itineraries?status=draft&limit=10&offset=0
Authorization: Bearer <session-token>
```

**Query Parameters:**
- `status` (optional): Filter by status (`draft`, `published`, `completed`)
- `limit` (optional): Number of results (default: 10, max: 50)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "itineraries": [
      {
        "id": "itinerary-123",
        "title": "Paris Adventure",
        "destination": "Paris, France",
        "startDate": "2024-01-15T00:00:00.000Z",
        "endDate": "2024-01-20T00:00:00.000Z",
        "travelers": 2,
        "budget": 2000,
        "status": "draft",
        "days": [
          {
            "day": 1,
            "date": "2024-01-15T00:00:00.000Z",
            "theme": "Arrival and Orientation",
            "activities": [
              {
                "id": "activity-1",
                "name": "Eiffel Tower Visit",
                "type": "attraction",
                "description": "Visit the iconic Eiffel Tower",
                "location": {
                  "name": "Eiffel Tower",
                  "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
                  "coordinates": {
                    "lat": 48.8584,
                    "lng": 2.2945
                  }
                },
                "timeSlot": {
                  "start": "10:00",
                  "end": "12:00",
                  "flexible": false
                },
                "duration": 120,
                "cost": 25,
                "rating": 4.6,
                "bookingRequired": true,
                "accessibility": {
                  "wheelchairAccessible": true,
                  "visualAccessibility": true,
                  "hearingAccessibility": false,
                  "cognitiveAccessibility": true
                },
                "sustainability": {
                  "ecoFriendly": true,
                  "carbonFootprint": 0,
                  "localBusiness": true,
                  "sustainableTransport": true
                }
              }
            ],
            "estimatedCost": 150,
            "notes": "Arrive early to explore the surroundings."
          }
        ],
        "metadata": {
          "totalCost": 1500,
          "sustainabilityScore": 85,
          "accessibilityScore": 90,
          "tags": ["paris", "culture", "accessible"],
          "source": "ai-generated",
          "version": 1
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 25,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Itineraries retrieved successfully
- `401` - Unauthorized

### POST /api/itineraries

Create a new itinerary.

**Request:**
```http
POST /api/itineraries
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "title": "Paris Adventure",
  "destination": "Paris, France",
  "startDate": "2024-01-15",
  "endDate": "2024-01-20",
  "travelers": 2,
  "budget": 2000,
  "preferences": {
    "interests": ["culture", "food", "history"],
    "travelStyle": {
      "budget": "mid-range"
    },
    "accessibility": {
      "mobility": true,
      "visual": false,
      "hearing": false,
      "cognitive": false
    },
    "dietary": {
      "restrictions": ["vegetarian"]
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "itinerary-123",
    "title": "Paris Adventure",
    "destination": "Paris, France",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "travelers": 2,
    "budget": 2000,
    "status": "draft",
    "days": [
      {
        "day": 1,
        "date": "2024-01-15T00:00:00.000Z",
        "theme": "Arrival and Orientation",
        "activities": [
          {
            "id": "activity-1",
            "name": "Eiffel Tower Visit",
            "type": "attraction",
            "description": "Visit the iconic Eiffel Tower",
            "location": {
              "name": "Eiffel Tower",
              "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
              "coordinates": {
                "lat": 48.8584,
                "lng": 2.2945
              }
            },
            "timeSlot": {
              "start": "10:00",
              "end": "12:00",
              "flexible": false
            },
            "duration": 120,
            "cost": 25,
            "rating": 4.6,
            "bookingRequired": true,
            "accessibility": {
              "wheelchairAccessible": true,
              "visualAccessibility": true,
              "hearingAccessibility": false,
              "cognitiveAccessibility": true
            },
            "sustainability": {
              "ecoFriendly": true,
              "carbonFootprint": 0,
              "localBusiness": true,
              "sustainableTransport": true
            }
          }
        ],
        "estimatedCost": 150,
        "notes": "Arrive early to explore the surroundings."
      }
    ],
    "metadata": {
      "totalCost": 1500,
      "sustainabilityScore": 85,
      "accessibilityScore": 90,
      "tags": ["paris", "culture", "accessible"],
      "source": "ai-generated",
      "version": 1
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Itinerary created successfully
- `400` - Invalid input data
- `401` - Unauthorized

### GET /api/itineraries/{id}

Get a specific itinerary.

**Request:**
```http
GET /api/itineraries/itinerary-123
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "itinerary-123",
    "title": "Paris Adventure",
    "destination": "Paris, France",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "travelers": 2,
    "budget": 2000,
    "status": "draft",
    "days": [
      {
        "day": 1,
        "date": "2024-01-15T00:00:00.000Z",
        "theme": "Arrival and Orientation",
        "activities": [
          {
            "id": "activity-1",
            "name": "Eiffel Tower Visit",
            "type": "attraction",
            "description": "Visit the iconic Eiffel Tower",
            "location": {
              "name": "Eiffel Tower",
              "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
              "coordinates": {
                "lat": 48.8584,
                "lng": 2.2945
              }
            },
            "timeSlot": {
              "start": "10:00",
              "end": "12:00",
              "flexible": false
            },
            "duration": 120,
            "cost": 25,
            "rating": 4.6,
            "bookingRequired": true,
            "accessibility": {
              "wheelchairAccessible": true,
              "visualAccessibility": true,
              "hearingAccessibility": false,
              "cognitiveAccessibility": true
            },
            "sustainability": {
              "ecoFriendly": true,
              "carbonFootprint": 0,
              "localBusiness": true,
              "sustainableTransport": true
            }
          }
        ],
        "estimatedCost": 150,
        "notes": "Arrive early to explore the surroundings."
      }
    ],
    "metadata": {
      "totalCost": 1500,
      "sustainabilityScore": 85,
      "accessibilityScore": 90,
      "tags": ["paris", "culture", "accessible"],
      "source": "ai-generated",
      "version": 1
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Itinerary retrieved successfully
- `401` - Unauthorized
- `403` - Forbidden (not your itinerary)
- `404` - Itinerary not found

### PUT /api/itineraries/{id}

Update an itinerary.

**Request:**
```http
PUT /api/itineraries/itinerary-123
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "title": "Updated Paris Adventure",
  "status": "published"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "itinerary-123",
    "title": "Updated Paris Adventure",
    "destination": "Paris, France",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-01-20T00:00:00.000Z",
    "travelers": 2,
    "budget": 2000,
    "status": "published",
    "days": [
      // ... existing days
    ],
    "metadata": {
      // ... existing metadata
    },
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Itinerary updated successfully
- `400` - Invalid input data
- `401` - Unauthorized
- `403` - Forbidden (not your itinerary)
- `404` - Itinerary not found

### DELETE /api/itineraries/{id}

Delete an itinerary.

**Request:**
```http
DELETE /api/itineraries/itinerary-123
Authorization: Bearer <session-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Itinerary deleted successfully"
}
```

**Status Codes:**
- `200` - Itinerary deleted successfully
- `401` - Unauthorized
- `403` - Forbidden (not your itinerary)
- `404` - Itinerary not found

## Chat & AI Services

### POST /api/chat

Send a message to the AI travel assistant.

**Request:**
```http
POST /api/chat
Authorization: Bearer <session-token>
Content-Type: application/json

{
  "message": "I want to plan a trip to Paris for 5 days",
  "context": {
    "itineraryId": "itinerary-123",
    "conversationId": "conv-456"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "message-789",
    "message": "I'd be happy to help you plan your 5-day trip to Paris! Let me create a personalized itinerary for you.",
    "type": "assistant",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "suggestions": [
      "What's your budget for this trip?",
      "What are your main interests?",
      "Do you have any accessibility requirements?"
    ],
    "actions": [
      {
        "type": "create_itinerary",
        "label": "Create Itinerary",
        "data": {
          "destination": "Paris",
          "duration": 5
        }
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Message processed successfully
- `400` - Invalid input data
- `401` - Unauthorized
- `503` - AI service unavailable

## Error Handling

### Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `AUTHENTICATION_ERROR` - Authentication failed
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `NOT_FOUND_ERROR` - Resource not found
- `EXTERNAL_API_ERROR` - External service error
- `DATABASE_ERROR` - Database operation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `SERVICE_UNAVAILABLE` - Service temporarily unavailable

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Default Limit**: 100 requests per 15 minutes per IP
- **Authenticated Users**: 1000 requests per 15 minutes
- **Admin Users**: 5000 requests per 15 minutes

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED",
  "retryAfter": 900,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## SDK and Client Libraries

### JavaScript/TypeScript

```typescript
import { TravelAgentAPI } from '@ai-travel-agent/sdk';

const api = new TravelAgentAPI({
  baseURL: 'https://api.travelagent.com',
  apiKey: 'your-api-key'
});

// Get weather
const weather = await api.weather.getCurrent('London');

// Search flights
const flights = await api.flights.search({
  origin: 'LHR',
  destination: 'CDG',
  departureDate: '2024-01-15',
  adults: 2
});

// Create itinerary
const itinerary = await api.itineraries.create({
  title: 'Paris Adventure',
  destination: 'Paris, France',
  startDate: '2024-01-15',
  endDate: '2024-01-20',
  travelers: 2,
  budget: 2000
});
```

### Python

```python
from travel_agent import TravelAgentAPI

api = TravelAgentAPI(
    base_url='https://api.travelagent.com',
    api_key='your-api-key'
)

# Get weather
weather = api.weather.get_current('London')

# Search flights
flights = api.flights.search(
    origin='LHR',
    destination='CDG',
    departure_date='2024-01-15',
    adults=2
)

# Create itinerary
itinerary = api.itineraries.create(
    title='Paris Adventure',
    destination='Paris, France',
    start_date='2024-01-15',
    end_date='2024-01-20',
    travelers=2,
    budget=2000
)
```

## Webhooks

The API supports webhooks for real-time notifications:

### Webhook Events

- `itinerary.created` - New itinerary created
- `itinerary.updated` - Itinerary updated
- `itinerary.deleted` - Itinerary deleted
- `user.registered` - New user registered
- `payment.completed` - Payment completed

### Webhook Payload

```json
{
  "event": "itinerary.created",
  "data": {
    "id": "itinerary-123",
    "userId": "user-456",
    "title": "Paris Adventure"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Webhook Configuration

```http
POST /api/webhooks
Authorization: Bearer <admin-session-token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhooks/travel-agent",
  "events": ["itinerary.created", "itinerary.updated"],
  "secret": "webhook-secret"
}
```

## Testing

### Test Environment

The API provides a test environment for development and testing:

- **Base URL**: `https://api-test.travelagent.com`
- **Test Data**: Pre-populated with test data
- **Rate Limits**: Higher limits for testing
- **Mock Responses**: Available for external services

### Test Credentials

```env
# Test environment
API_BASE_URL=https://api-test.travelagent.com
API_KEY=test-api-key
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword
```

### Postman Collection

A Postman collection is available for testing all endpoints:

1. Import the collection from `/docs/postman-collection.json`
2. Set environment variables
3. Run tests individually or as a suite

## Support

For API support and questions:

- **Documentation**: [API Documentation](API_DOCUMENTATION.md)
- **Status Page**: [API Status](https://status.travelagent.com)
- **Support Email**: api-support@travelagent.com
- **GitHub Issues**: [API Issues](https://github.com/travel-agent/api/issues)

## Changelog

### Version 1.0.0 (2024-01-01)

- Initial API release
- Core travel services (weather, flights, places)
- Itinerary management
- AI chat integration
- User management
- Health monitoring
- Rate limiting
- Comprehensive error handling