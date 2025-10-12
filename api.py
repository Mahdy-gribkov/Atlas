#!/usr/bin/env python3
"""
FastAPI backend for Travel AI Agent
Provides REST API for React frontend

Author: Mahdy Gribkov
License: MIT
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import asyncio
import json
import logging
import time
import os
from travel_agent import TravelAgent

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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize travel agent
agent = TravelAgent()

# Response cache for common queries
response_cache = {}
CACHE_DURATION = 300  # 5 minutes

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str = "success"

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Travel AI Agent API is running!"}

async def generate_streaming_response(message: str):
    """Generate streaming response for real-time chat."""
    try:
        # Check cache first
        cache_key = f"chat_{hash(message)}"
        current_time = time.time()
        
        if cache_key in response_cache:
            cached_data = response_cache[cache_key]
            if current_time - cached_data['timestamp'] < CACHE_DURATION:
                # Return cached response in chunks for streaming effect
                response = cached_data['response']
                words = response.split()
                chunk_size = 5
                
                for i in range(0, len(words), chunk_size):
                    chunk = ' '.join(words[i:i+chunk_size])
                    yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
                    await asyncio.sleep(0.05)  # Small delay for streaming effect
                
                yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
                return
        
        # Generate new response with streaming
        logger.info(f"Processing new request: {message[:100]}...")
        
        # Start processing
        yield f"data: {json.dumps({'chunk': '🔍 Analyzing your request...', 'done': False})}\n\n"
        await asyncio.sleep(0.1)
        
        # Process the query
        response = await agent.process_query(message)
        
        # Cache the response
        response_cache[cache_key] = {
            'response': response,
            'timestamp': current_time
        }
        
        # Stream the response
        words = response.split()
        chunk_size = 8
        
        for i in range(0, len(words), chunk_size):
            chunk = ' '.join(words[i:i+chunk_size])
            yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
            await asyncio.sleep(0.03)  # Faster streaming for better UX
        
        yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"
        
        # Save conversation
        agent.save_conversation()
        
    except Exception as e:
        logger.error(f"Streaming error: {e}")
        yield f"data: {json.dumps({'chunk': f'Sorry, I encountered an error: {str(e)}', 'done': True})}\n\n"

@app.post("/chat")
async def chat_stream(request: ChatRequest):
    """
    Chat with the travel agent using streaming response.
    
    Args:
        request: Chat request with message
        
    Returns:
        Streaming response from the agent
    """
    return StreamingResponse(
        generate_streaming_response(request.message),
        media_type="text/plain"
    )

@app.post("/chat-simple", response_model=ChatResponse)
async def chat_simple(request: ChatRequest):
    """
    Simple chat endpoint for fallback.
    """
    try:
        logger.info(f"Processing simple chat request: {request.message[:100]}...")
        
        # Check cache first
        cache_key = f"chat_{hash(request.message)}"
        current_time = time.time()
        
        if cache_key in response_cache:
            cached_data = response_cache[cache_key]
            if current_time - cached_data['timestamp'] < CACHE_DURATION:
                return ChatResponse(response=cached_data['response'])
        
        # Process the query
        response = await agent.process_query(request.message)
        
        # Cache the response
        response_cache[cache_key] = {
            'response': response,
            'timestamp': current_time
        }
        
        # Save conversation
        agent.save_conversation()
        
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

@app.get("/health")
async def health_check():
    """Health check for the agent."""
    try:
        # Test agent functionality
        test_response = await agent.process_query("Hello")
        return {
            "status": "healthy",
            "agent": "working",
            "llm": agent.llm_type,
            "model": agent.model_name if hasattr(agent, 'model_name') else "unknown"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# Serve React build files
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")
    
    # Serve React app for all other routes
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all routes not handled by API."""
        if full_path.startswith("api/") or full_path.startswith("static/"):
            raise HTTPException(status_code=404, detail="Not found")
        
        # Serve index.html for all other routes (React Router)
        index_path = os.path.join("static", "index.html")
        if os.path.exists(index_path):
            from fastapi.responses import FileResponse
            return FileResponse(index_path)
        else:
            raise HTTPException(status_code=404, detail="React app not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
