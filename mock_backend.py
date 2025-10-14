#!/usr/bin/env python3
"""
Simple mock backend for UI testing.
Provides fake responses to test the complete chat interface.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json

app = FastAPI(title="Mock Travel Agent API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def root():
    return {"message": "Mock Travel Agent API is running!"}

@app.get("/health")
async def health():
    return {"status": "healthy", "agent": "working", "llm": "mock"}

async def generate_mock_response(message: str):
    """Generate mock streaming response."""
    # Simulate processing delay
    await asyncio.sleep(0.5)
    
    # Mock responses based on keywords
    mock_responses = {
        "flight": "I'd be happy to help you find flights! To give you the best options, I need a few details:\n\n✈️ **Where are you flying from and to?**\n📅 **What are your travel dates?**\n💰 **What's your budget range?**\n👥 **How many passengers?**\n\nOnce you provide these details, I can search for the best flight deals and show you specific options with prices, airlines, and booking links.",
        "hotel": "I can help you find great accommodations! To recommend the best hotels, please tell me:\n\n🏨 **Which city or area?**\n📅 **Check-in and check-out dates?**\n💰 **Budget per night?**\n👥 **Number of guests?**\n⭐ **Hotel type preference?** (luxury, mid-range, budget)\n\nWith this information, I can show you specific hotels with reviews, amenities, and booking options.",
        "weather": "I can provide current weather and forecasts! Please specify:\n\n🌤️ **Which destination?**\n📅 **What dates are you traveling?**\n\nI'll give you detailed weather information including temperature, conditions, and packing recommendations for your trip.",
        "budget": "I'd love to help you plan your travel budget! To create a detailed budget breakdown, I need:\n\n💰 **Total budget amount?**\n🗺️ **Destination(s)?**\n📅 **Trip duration?**\n👥 **Number of travelers?**\n🎯 **Travel style?** (budget, mid-range, luxury)\n\nI'll break down costs for flights, accommodation, food, activities, and transportation.",
        "japan": "Japan is an amazing destination! To give you the best travel advice, please tell me:\n\n🗾 **Which cities do you want to visit?**\n📅 **When are you planning to travel?**\n💰 **What's your budget range?**\n⏰ **How long is your trip?**\n🎯 **What interests you most?** (culture, food, nature, technology, history)\n\nI'll create a detailed itinerary with must-see attractions, local experiences, and practical tips!"
    }
    
    # Find matching response
    message_lower = message.lower()
    response = "I'd be happy to help you with your travel planning! "
    
    for keyword, mock_response in mock_responses.items():
        if keyword in message_lower:
            response = mock_response
            break
    
    if response == "I'd be happy to help you with your travel planning! ":
        response += "I can help with flights, hotels, weather, budgets, and destination information. To give you the best recommendations, please be specific about what you're looking for. For example:\n\n• 'Find flights from New York to Tokyo for March 15-22'\n• 'Budget hotels in Paris under $150/night'\n• 'Weather in London next week'\n\nWhat specific travel help do you need?"
    
    # Stream the response
    words = response.split()
    chunk_size = 3
    
    for i in range(0, len(words), chunk_size):
        chunk = ' '.join(words[i:i+chunk_size])
        yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
        await asyncio.sleep(0.1)  # Simulate typing
    
    yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"

@app.post("/chat")
async def chat_stream(request: ChatRequest):
    """Mock chat endpoint with streaming."""
    return StreamingResponse(
        generate_mock_response(request.message),
        media_type="text/plain"
    )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Mock Backend for UI Testing...")
    print("📱 Frontend: http://localhost:3000")
    print("🔧 Backend: http://localhost:8000")
    print("💡 This provides fake responses for complete UI testing")
    uvicorn.run(app, host="127.0.0.1", port=8000)
