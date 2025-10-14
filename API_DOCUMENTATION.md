# 🌍 Travel AI Agent - API Documentation

## Overview

The Travel AI Agent provides a comprehensive REST API for travel planning and information retrieval. All endpoints are designed to work with the React frontend and support real-time streaming responses.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication as it's designed for single-user local deployment. All data is stored locally and encrypted.

## Endpoints

### 1. Chat Endpoints

#### POST /chat
**Description**: Streaming chat endpoint with real-time responses

**Request Body**:
```json
{
  "message": "Plan a trip to Japan for 2 weeks with $3000 budget"
}
```

**Response**: Server-Sent Events stream
```
data: {"chunk": "🔍 Analyzing your request...", "done": false}

data: {"chunk": "I'll help you plan an amazing trip to Japan!", "done": false}

data: {"chunk": "", "done": true}
```

**Features**:
- Real-time streaming responses
- Cached responses for performance
- Automatic conversation saving
- Error handling with fallbacks

#### POST /chat-simple
**Description**: Simple chat endpoint for fallback scenarios

**Request Body**:
```json
{
  "message": "What's the weather like in Tokyo?"
}
```

**Response**:
```json
{
  "response": "🌤️ Current weather in Tokyo:\n- Temperature: 15°C (59°F)\n- Condition: Partly cloudy\n- Humidity: 65%\n- Wind: 10 km/h",
  "status": "success"
}
```

### 2. Information Endpoints

#### GET /features
**Description**: Get available features and capabilities

**Response**:
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

#### GET /health
**Description**: Health check endpoint for monitoring

**Response**:
```json
{
  "status": "healthy",
  "agent": "working",
  "llm": "local",
  "model": "llama3.1:8b"
}
```

**Error Response**:
```json
{
  "status": "unhealthy",
  "error": "LLM initialization failed"
}
```

#### GET /
**Description**: Root endpoint for API status

**Response**:
```json
{
  "message": "Travel AI Agent API is running!"
}
```

## Data Models

### ChatRequest
```json
{
  "message": "string"
}
```

### ChatResponse
```json
{
  "response": "string",
  "status": "string"
}
```

### StreamingChunk
```json
{
  "chunk": "string",
  "done": "boolean"
}
```

## Error Handling

### HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request format
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "detail": "Error message description"
}
```

### Common Error Scenarios

1. **LLM Not Available**
   ```json
   {
     "detail": "Local LLM not available. Please check Ollama installation."
   }
   ```

2. **Invalid Request**
   ```json
   {
     "detail": "Invalid request format. Message field is required."
   }
   ```

3. **API Rate Limit**
   ```json
   {
     "detail": "API rate limit exceeded. Please try again later."
   }
   ```

## Rate Limiting

- **Chat endpoints**: No rate limiting (local processing)
- **External APIs**: Managed internally with circuit breakers
- **Caching**: 5-minute TTL for repeated queries

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://127.0.0.1:3000` (Alternative localhost)

## Streaming Responses

The `/chat` endpoint uses Server-Sent Events (SSE) for real-time streaming:

1. **Connection**: Client connects to `/chat` endpoint
2. **Streaming**: Server sends chunks of response data
3. **Completion**: Server sends final chunk with `done: true`
4. **Cleanup**: Connection closes automatically

### Example Client Implementation

```javascript
const response = await fetch('/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: userMessage })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let assistantMessage = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.chunk) {
        assistantMessage += data.chunk + ' ';
        // Update UI with new content
      }
      if (data.done) {
        // Streaming complete
        break;
      }
    }
  }
}
```

## Performance Considerations

### Caching
- Responses are cached for 5 minutes
- Cache key based on message hash
- Automatic cache cleanup

### Database
- SQLite with WAL mode for performance
- Encrypted storage for privacy
- Automatic cleanup of expired data

### Memory Management
- Connection pooling for database
- Async/await for non-blocking operations
- Proper resource cleanup

## Security Features

### Data Protection
- All stored data is AES-256 encrypted
- No external data transmission
- Local processing only

### Input Validation
- Request validation with Pydantic
- SQL injection prevention
- XSS protection in responses

### Privacy
- No user tracking or analytics
- No external API calls for user data
- Complete local data storage

## Monitoring and Logging

### Log Levels
- **INFO**: Normal operations
- **WARNING**: Non-critical issues
- **ERROR**: Critical errors
- **DEBUG**: Detailed debugging info

### Log Files
- `data/travel_agent.log`: Application logs
- Console output: Real-time monitoring

### Health Monitoring
- `/health` endpoint for status checks
- Automatic error reporting
- Performance metrics tracking

## Development

### Local Development
```bash
# Start the API server
python api.py

# Server will be available at http://localhost:8000
```

### Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat-simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Environment Variables
- `USE_LOCAL_LLM`: Enable local LLM (default: true)
- `OLLAMA_MODEL`: LLM model name (default: llama3.1:8b)
- `DEBUG`: Enable debug mode (default: false)
- `LOG_LEVEL`: Logging level (default: INFO)

## Troubleshooting

### Common Issues

1. **"LLM not available"**
   - Check if Ollama is installed and running
   - Verify model is downloaded: `ollama list`
   - Check logs for specific error messages

2. **"CORS errors"**
   - Ensure frontend is running on localhost:3000
   - Check CORS configuration in api.py

3. **"Database errors"**
   - Check if data directory exists and is writable
   - Verify encryption key configuration
   - Check database file permissions

4. **"API timeout"**
   - Check network connectivity
   - Verify external API endpoints are accessible
   - Check rate limiting configuration

### Debug Mode
Enable debug mode for detailed logging:
```bash
export DEBUG=true
python api.py
```

## Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added streaming responses and error handling
- **v1.2.0**: Enhanced security and performance optimizations

---

For more information, see the main [README.md](README.md) file.


## Overview

The Travel AI Agent provides a comprehensive REST API for travel planning and information retrieval. All endpoints are designed to work with the React frontend and support real-time streaming responses.

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-domain.com`

## Authentication

Currently, the API does not require authentication as it's designed for single-user local deployment. All data is stored locally and encrypted.

## Endpoints

### 1. Chat Endpoints

#### POST /chat
**Description**: Streaming chat endpoint with real-time responses

**Request Body**:
```json
{
  "message": "Plan a trip to Japan for 2 weeks with $3000 budget"
}
```

**Response**: Server-Sent Events stream
```
data: {"chunk": "🔍 Analyzing your request...", "done": false}

data: {"chunk": "I'll help you plan an amazing trip to Japan!", "done": false}

data: {"chunk": "", "done": true}
```

**Features**:
- Real-time streaming responses
- Cached responses for performance
- Automatic conversation saving
- Error handling with fallbacks

#### POST /chat-simple
**Description**: Simple chat endpoint for fallback scenarios

**Request Body**:
```json
{
  "message": "What's the weather like in Tokyo?"
}
```

**Response**:
```json
{
  "response": "🌤️ Current weather in Tokyo:\n- Temperature: 15°C (59°F)\n- Condition: Partly cloudy\n- Humidity: 65%\n- Wind: 10 km/h",
  "status": "success"
}
```

### 2. Information Endpoints

#### GET /features
**Description**: Get available features and capabilities

**Response**:
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

#### GET /health
**Description**: Health check endpoint for monitoring

**Response**:
```json
{
  "status": "healthy",
  "agent": "working",
  "llm": "local",
  "model": "llama3.1:8b"
}
```

**Error Response**:
```json
{
  "status": "unhealthy",
  "error": "LLM initialization failed"
}
```

#### GET /
**Description**: Root endpoint for API status

**Response**:
```json
{
  "message": "Travel AI Agent API is running!"
}
```

## Data Models

### ChatRequest
```json
{
  "message": "string"
}
```

### ChatResponse
```json
{
  "response": "string",
  "status": "string"
}
```

### StreamingChunk
```json
{
  "chunk": "string",
  "done": "boolean"
}
```

## Error Handling

### HTTP Status Codes

- **200 OK**: Request successful
- **400 Bad Request**: Invalid request format
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "detail": "Error message description"
}
```

### Common Error Scenarios

1. **LLM Not Available**
   ```json
   {
     "detail": "Local LLM not available. Please check Ollama installation."
   }
   ```

2. **Invalid Request**
   ```json
   {
     "detail": "Invalid request format. Message field is required."
   }
   ```

3. **API Rate Limit**
   ```json
   {
     "detail": "API rate limit exceeded. Please try again later."
   }
   ```

## Rate Limiting

- **Chat endpoints**: No rate limiting (local processing)
- **External APIs**: Managed internally with circuit breakers
- **Caching**: 5-minute TTL for repeated queries

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)
- `http://127.0.0.1:3000` (Alternative localhost)

## Streaming Responses

The `/chat` endpoint uses Server-Sent Events (SSE) for real-time streaming:

1. **Connection**: Client connects to `/chat` endpoint
2. **Streaming**: Server sends chunks of response data
3. **Completion**: Server sends final chunk with `done: true`
4. **Cleanup**: Connection closes automatically

### Example Client Implementation

```javascript
const response = await fetch('/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: userMessage })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
let assistantMessage = '';

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.chunk) {
        assistantMessage += data.chunk + ' ';
        // Update UI with new content
      }
      if (data.done) {
        // Streaming complete
        break;
      }
    }
  }
}
```

## Performance Considerations

### Caching
- Responses are cached for 5 minutes
- Cache key based on message hash
- Automatic cache cleanup

### Database
- SQLite with WAL mode for performance
- Encrypted storage for privacy
- Automatic cleanup of expired data

### Memory Management
- Connection pooling for database
- Async/await for non-blocking operations
- Proper resource cleanup

## Security Features

### Data Protection
- All stored data is AES-256 encrypted
- No external data transmission
- Local processing only

### Input Validation
- Request validation with Pydantic
- SQL injection prevention
- XSS protection in responses

### Privacy
- No user tracking or analytics
- No external API calls for user data
- Complete local data storage

## Monitoring and Logging

### Log Levels
- **INFO**: Normal operations
- **WARNING**: Non-critical issues
- **ERROR**: Critical errors
- **DEBUG**: Detailed debugging info

### Log Files
- `data/travel_agent.log`: Application logs
- Console output: Real-time monitoring

### Health Monitoring
- `/health` endpoint for status checks
- Automatic error reporting
- Performance metrics tracking

## Development

### Local Development
```bash
# Start the API server
python api.py

# Server will be available at http://localhost:8000
```

### Testing
```bash
# Test health endpoint
curl http://localhost:8000/health

# Test chat endpoint
curl -X POST http://localhost:8000/chat-simple \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Environment Variables
- `USE_LOCAL_LLM`: Enable local LLM (default: true)
- `OLLAMA_MODEL`: LLM model name (default: llama3.1:8b)
- `DEBUG`: Enable debug mode (default: false)
- `LOG_LEVEL`: Logging level (default: INFO)

## Troubleshooting

### Common Issues

1. **"LLM not available"**
   - Check if Ollama is installed and running
   - Verify model is downloaded: `ollama list`
   - Check logs for specific error messages

2. **"CORS errors"**
   - Ensure frontend is running on localhost:3000
   - Check CORS configuration in api.py

3. **"Database errors"**
   - Check if data directory exists and is writable
   - Verify encryption key configuration
   - Check database file permissions

4. **"API timeout"**
   - Check network connectivity
   - Verify external API endpoints are accessible
   - Check rate limiting configuration

### Debug Mode
Enable debug mode for detailed logging:
```bash
export DEBUG=true
python api.py
```

## Version History

- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added streaming responses and error handling
- **v1.2.0**: Enhanced security and performance optimizations

---

For more information, see the main [README.md](README.md) file.


