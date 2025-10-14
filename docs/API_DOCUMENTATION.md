# 📚 Travel AI Agent - API Documentation

## Overview

The Travel AI Agent provides a comprehensive REST API for travel planning and information retrieval. All endpoints are designed to work with the React frontend and support real-time streaming responses.

## Base URL

```
http://localhost:8000
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses are in JSON format with the following structure:

```json
{
  "status": "success|error",
  "data": {},
  "message": "Optional message",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

## Endpoints

### 1. Health Check

**GET** `/health`

Check the health status of the application.

**Response:**
```json
{
  "status": "healthy",
  "agent": "working",
  "llm": "local",
  "model": "llama3.1:8b"
}
```

### 2. Root Endpoint

**GET** `/`

Get basic information about the API.

**Response:**
```json
{
  "message": "Travel AI Agent API is running!"
}
```

### 3. Chat Interface

**POST** `/chat`

Send a message to the AI travel agent and receive a streaming response.

**Request Body:**
```json
{
  "message": "I want to plan a trip to Japan"
}
```

**Response:**
Streaming response with Server-Sent Events (SSE) format:

```
data: {"chunk": "I'd be happy to help you plan your trip to Japan!", "done": false}
data: {"chunk": " To give you the best recommendations, I need a few details:", "done": false}
data: {"chunk": " What cities are you interested in visiting?", "done": false}
data: {"done": true}
```

### 4. Simple Chat

**POST** `/chat-simple`

Send a message and receive a simple JSON response (non-streaming).

**Request Body:**
```json
{
  "message": "What's the weather like in Tokyo?"
}
```

**Response:**
```json
{
  "response": "The weather in Tokyo is currently sunny with a temperature of 22°C. It's a great time to visit!",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

### 5. Features List

**GET** `/features`

Get a list of all available features.

**Response:**
```json
{
  "features": [
    "Country information and coordinates",
    "Real-time weather and travel information",
    "Budget planning and cost estimates",
    "Flight and accommodation suggestions",
    "Wikipedia integration for detailed info",
    "Web search for current information"
  ]
}
```

### 6. Map Geocoding

**POST** `/api/maps/geocode`

Convert an address to coordinates.

**Request Body:**
```json
{
  "address": "Tokyo, Japan"
}
```

**Response:**
```json
{
  "location": "Tokyo, Japan",
  "latitude": 35.6762,
  "longitude": 139.6503,
  "display_name": "Tokyo, Japan",
  "address": {
    "city": "Tokyo",
    "country": "Japan"
  },
  "source": "Nominatim (OpenStreetMap)",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

### 7. Reverse Geocoding

**POST** `/api/maps/reverse-geocode`

Convert coordinates to an address.

**Request Body:**
```json
{
  "lat": 35.6762,
  "lng": 139.6503
}
```

**Response:**
```json
{
  "latitude": 35.6762,
  "longitude": 139.6503,
  "display_name": "Tokyo, Japan",
  "address": {
    "city": "Tokyo",
    "country": "Japan"
  },
  "source": "Nominatim (OpenStreetMap)",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

### 8. Location Search

**POST** `/api/maps/search`

Search for locations by query.

**Request Body:**
```json
{
  "query": "Tokyo attractions"
}
```

**Response:**
```json
{
  "location": "Tokyo attractions",
  "latitude": 35.6762,
  "longitude": 139.6503,
  "display_name": "Tokyo, Japan",
  "address": {
    "city": "Tokyo",
    "country": "Japan"
  },
  "source": "Nominatim (OpenStreetMap)",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

### Common Error Codes

- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

### Example Error Response

```json
{
  "status": "error",
  "error": "Address is required",
  "code": "MISSING_ADDRESS",
  "timestamp": "2025-10-14T02:20:00Z"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Rate Limit**: 100 requests per hour per IP
- **Headers**: Rate limit information is included in response headers
- **Exceeded**: Returns 429 status code when limit is exceeded

## CORS

The API supports Cross-Origin Resource Sharing (CORS) for the React frontend:

- **Allowed Origins**: `http://localhost:3000`, `http://localhost:8000`
- **Allowed Methods**: GET, POST, PUT, DELETE
- **Allowed Headers**: Content-Type, Authorization

## WebSocket Support

The chat interface supports WebSocket connections for real-time communication:

**WebSocket URL**: `ws://localhost:8000/ws`

**Message Format:**
```json
{
  "type": "message",
  "content": "Hello, I need help planning a trip"
}
```

## API Client Examples

### JavaScript/Fetch

```javascript
// Send a chat message
const response = await fetch('/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'I want to plan a trip to Japan'
  })
});

// Handle streaming response
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      console.log(data.chunk);
    }
  }
}
```

### Python/Requests

```python
import requests
import json

# Send a simple chat message
response = requests.post('http://localhost:8000/chat-simple', 
                        json={'message': 'What\'s the weather in Tokyo?'})
data = response.json()
print(data['response'])

# Geocode an address
response = requests.post('http://localhost:8000/api/maps/geocode',
                        json={'address': 'Tokyo, Japan'})
data = response.json()
print(f"Coordinates: {data['latitude']}, {data['longitude']}")
```

### cURL

```bash
# Health check
curl http://localhost:8000/health

# Send a chat message
curl -X POST http://localhost:8000/chat-simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help planning a trip"}'

# Geocode an address
curl -X POST http://localhost:8000/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "Tokyo, Japan"}'
```

## Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Chat Interface
```bash
curl -X POST http://localhost:8000/chat-simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Test message"}'
```

### Map API
```bash
curl -X POST http://localhost:8000/api/maps/geocode \
  -H "Content-Type: application/json" \
  -d '{"address": "New York, NY"}'
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install axios
```

### Python
```bash
pip install requests
```

### Go
```bash
go get github.com/go-resty/resty/v2
```

## Changelog

### Version 1.0.0
- Initial API release
- Chat interface with streaming support
- Map geocoding and reverse geocoding
- Health check endpoint
- CORS support for React frontend

## Support

For API support and questions:

1. Check the [GitHub Issues](https://github.com/your-repo/issues)
2. Review the [Documentation](README.md)
3. Contact the development team

## License

This API is part of the Travel AI Agent project and is licensed under the MIT License.