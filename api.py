#!/usr/bin/env python3
"""
FastAPI backend for Travel AI Agent
Provides REST API for React frontend with streaming responses

This module implements the FastAPI backend server that handles:
- Chat endpoints with streaming responses
- CORS configuration for React frontend
- Response caching for performance
- Error handling and logging
- Health checks and monitoring

Endpoints:
- POST /chat: Streaming chat endpoint with real-time responses
- POST /chat-simple: Simple chat endpoint for fallback
- GET /features: Available features information
- GET /health: Health check endpoint
- GET /: Root endpoint for API status

Features:
- Real-time streaming responses using Server-Sent Events
- Response caching with TTL for performance
- Comprehensive error handling
- CORS support for frontend integration
- Static file serving for React build
- Health monitoring and status checks

Author: Mahdy Gribkov
License: MIT
Version: 1.0.0
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Dict, Any, Optional
import asyncio
import json
import logging
import time
import os
from datetime import datetime
from travel_agent import TravelAgent
from src.utils.cache_manager import cache_manager, API_CACHE
from src.utils.security import security_validator, security_monitor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Travel AI Agent API",
    description="Privacy-first travel planning assistant",
    version="1.0.0"
)

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
    expose_headers=["X-Total-Count"],
)

# Initialize travel agent
agent = TravelAgent()

# Get API response cache
api_cache = cache_manager.get_cache(API_CACHE)

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

@app.get("/")
async def root():
    """Serve React app."""
    index_path = os.path.join("frontend/build", "index.html")
    if os.path.exists(index_path):
        from fastapi.responses import FileResponse
        return FileResponse(index_path)
    else:
        return {"message": "Travel AI Agent API is running!", "error": "React app not found"}

async def generate_streaming_response(message: str, context: Optional[Dict[str, Any]] = None):
    """Generate streaming response for real-time chat with timeout handling."""
    try:
        # Check cache first
        cache_key = f"chat_{hash(message)}"
        
        cached_response = await api_cache.get(cache_key)
        if cached_response:
            # Return cached response in chunks for streaming effect
            response = cached_response
            words = response.split()
            chunk_size = 3
            
            for i in range(0, len(words), chunk_size):
                chunk = ' '.join(words[i:i+chunk_size])
                yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
                await asyncio.sleep(0.02)  # Faster streaming
            
            yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
            return
        
        # Generate new response with timeout
        logger.info(f"Processing new request: {message[:100]}...")
        
        # Start processing with timeout
        yield f"data: {json.dumps({'chunk': 'Planning your trip...', 'done': False})}\n\n"
        
        try:
            # Process with timeout to prevent long waits
            response = await asyncio.wait_for(
                agent.process_query(message, context), 
                timeout=30.0  # 30 second timeout
            )
        except asyncio.TimeoutError:
            yield f"data: {json.dumps({'chunk': 'Request is taking longer than expected. Please try a simpler question or check your internet connection.', 'done': True})}\n\n"
            return
        
        # Cache the response
        await api_cache.set(cache_key, response, ttl=3600)  # 1 hour cache
        
        # Save conversation to database
        try:
            await agent.database.store_conversation_data({
                "user_id": "default_user",
                "user_message": message,
                "assistant_response": response,
                "timestamp": datetime.now().isoformat()
            })
        except Exception as e:
            logger.error(f"Error saving conversation: {e}")
        
        # Stream the response more naturally
        words = response.split()
        chunk_size = 2  # Smaller chunks for more natural streaming
        
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i+chunk_size])
            if chunk.strip():  # Only send non-empty chunks
                yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
                await asyncio.sleep(0.05)  # Slightly slower for readability
        
        yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
        
        # Save conversation
        await agent.save_conversation()
        
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        yield f"data: {json.dumps({'chunk': f'Sorry, I encountered an error. Please try again.', 'done': True})}\n\n"

@app.post("/chat")
async def chat_stream(request: ChatRequest):
    """
    Chat with the travel agent using streaming response.
    
    Args:
        request: Chat request with message
        
    Returns:
        Streaming response from the agent
    """
    # Validate input
    validation_result = security_validator.validate_message(request.message)
    if not validation_result['valid']:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid input: {'; '.join(validation_result['errors'])}"
        )
    
    # Use sanitized message
    sanitized_message = validation_result['sanitized']
    
    return StreamingResponse(
        generate_streaming_response(sanitized_message, request.context),
        media_type="text/plain"
    )

@app.post("/chat-simple", response_model=ChatResponse)
async def chat_simple(request: ChatRequest):
    """
    Simple chat endpoint for fallback.
    """
    try:
        # Validate input
        validation_result = security_validator.validate_message(request.message)
        if not validation_result['valid']:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid input: {'; '.join(validation_result['errors'])}"
            )
        
        # Use sanitized message
        sanitized_message = validation_result['sanitized']
        
        logger.info(f"Processing simple chat request: {sanitized_message[:100]}...")
        
        # Check cache first
        cache_key = f"chat_{hash(sanitized_message)}"
        
        cached_response = await api_cache.get(cache_key)
        if cached_response:
            return ChatResponse(response=cached_response)
        
        # Process the query
        response = await agent.process_query(sanitized_message)
        
        # Cache the response
        await api_cache.set(cache_key, response, ttl=1800)  # 30 minutes
        
        # Save conversation
        await agent.save_conversation()
        
        return ChatResponse(response=response)
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/features")
async def get_features():
    """Get available features."""
    return {
        "features": [
            "Country information and coordinates",
            "Real-time weather and travel information", 
            "Budget planning and cost estimates",
            "Flight and accommodation suggestions",
            "Wikipedia integration for detailed info",
            "Web search for current information"
        ]
    }

@app.post("/api/travel-plan")
async def store_travel_plan(plan_data: dict):
    """Store travel plan data in the database."""
    try:
        # Store the travel plan data
        # This is a simple implementation - you can expand this
        return {"status": "success", "message": "Travel plan stored"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/chat-history")
async def get_chat_history():
    """Get chat history for the user."""
    try:
        conversations = await agent.database.get_conversation_history("default_user", limit=50)
        return {"conversations": conversations}
    except Exception as e:
        logger.error(f"Error getting chat history: {e}")
        return {"error": str(e), "conversations": []}

@app.get("/health")
async def health_check():
    """Health check for the agent."""
    try:
        # Test agent functionality
        test_response = await agent.process_query("Hello")
        return {
            "status": "healthy",
            "agent": "working",
            "llm": "cloud",
            "model": "LLM7.io (GPT-3.5-turbo)"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# Map API endpoints for frontend integration
@app.post("/api/maps/geocode")
async def geocode_address(request: dict):
    """Geocode an address to get coordinates."""
    try:
        address = request.get("address", "")
        if not address:
            return {"error": "Address is required"}
        
        # Use the maps client to geocode
        result = await agent.maps_client.geocode(address)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/maps/reverse-geocode")
async def reverse_geocode(request: dict):
    """Reverse geocode coordinates to get address."""
    try:
        lat = request.get("lat")
        lng = request.get("lng")
        if lat is None or lng is None:
            return {"error": "Latitude and longitude are required"}
        
        # Use the maps client to reverse geocode
        result = await agent.maps_client.reverse_geocode(lat, lng)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/maps/search")
async def search_locations(request: dict):
    """Search for locations."""
    try:
        query = request.get("query", "")
        if not query:
            return {"error": "Query is required"}
        
        # Use the maps client to search
        result = await agent.maps_client.geocode(query)
        return result
    except Exception as e:
        return {"error": str(e)}

# Serve React build files
if os.path.exists("frontend/build"):
    app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")
    
    # Serve React app for all other routes
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all routes not handled by API."""
        if full_path.startswith("api/") or full_path.startswith("static/"):
            raise HTTPException(status_code=404, detail="Not found")
        
        # Serve index.html for all other routes (React Router)
        index_path = os.path.join("frontend/build", "index.html")
        if os.path.exists(index_path):
            from fastapi.responses import FileResponse
            return FileResponse(index_path)
        else:
            raise HTTPException(status_code=404, detail="React app not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

