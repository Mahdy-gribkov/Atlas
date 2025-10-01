# Getting Started with Travel AI Agent

## 🎯 What You'll Learn

This guide will walk you through creating your first AI travel agent using LangChain. By the end, you'll understand:

- How AI agents work with tools
- How to integrate travel APIs
- How to manage conversation memory
- How to build a complete travel planning system

## 🧠 Understanding AI Agents

### What is an AI Agent?

An AI agent is like a smart assistant that can:
1. **Understand** what you want (using natural language)
2. **Plan** how to help you (reasoning about the task)
3. **Act** by using tools to get information
4. **Respond** with helpful results

Think of it like having a travel agent who can instantly search flights, check hotel availability, and get weather information - all while remembering your preferences!

### How LangChain Agents Work

```
User: "I want to plan a trip to Paris for 5 days in June"

Agent thinks: "I need to:
1. Search for flights to Paris
2. Find hotels in Paris
3. Check weather for June
4. Suggest activities"

Agent acts: Uses flight tool → Uses hotel tool → Uses weather tool

Agent responds: "Here's your Paris trip plan with flights, hotels, and activities!"
```

## 🛠️ Setting Up Your Development Environment

### Step 1: Install Python

Make sure you have Python 3.9 or higher:

```bash
python --version
```

If you don't have Python, download it from [python.org](https://python.org).

### Step 2: Create a Virtual Environment

A virtual environment keeps your project dependencies separate:

```bash
# Create virtual environment
python -m venv travel_agent_env

# Activate it (Windows)
travel_agent_env\Scripts\activate

# Activate it (Mac/Linux)
source travel_agent_env/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install langchain openai python-dotenv requests
```

## 🔑 Getting API Keys

### OpenAI API Key (Required)

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-`)

### Travel API Keys (Optional for Basic Version)

#### Amadeus API (Flights & Hotels)
1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Sign up for free account
3. Create a new app
4. Get your API key and secret

#### Google Places API (Local Information)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Places API
3. Create credentials
4. Get your API key

## 🏗️ Building Your First Agent

### Step 1: Create the Basic Structure

Create these files in your project:

```
Travel_Agent/
├── src/
│   ├── __init__.py
│   ├── agent.py
│   └── tools.py
├── .env
└── main.py
```

### Step 2: Set Up Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
AMADEUS_API_KEY=your_amadeus_key_here
AMADEUS_API_SECRET=your_amadeus_secret_here
GOOGLE_PLACES_API_KEY=your_google_key_here
```

### Step 3: Create Your First Tool

Let's start with a simple weather tool:

```python
# src/tools.py
import requests
from typing import Dict, Any

class WeatherTool:
    """A tool to get weather information for any city."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "http://api.openweathermap.org/data/2.5/weather"
    
    def get_weather(self, city: str) -> Dict[str, Any]:
        """
        Get current weather for a city.
        
        Args:
            city: Name of the city
            
        Returns:
            Dictionary with weather information
        """
        try:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            return {
                'city': data['name'],
                'temperature': data['main']['temp'],
                'description': data['weather'][0]['description'],
                'humidity': data['main']['humidity']
            }
            
        except Exception as e:
            return {'error': f'Could not get weather for {city}: {str(e)}'}
    
    def __call__(self, city: str) -> str:
        """Make the tool callable by the agent."""
        result = self.get_weather(city)
        
        if 'error' in result:
            return result['error']
        
        return f"Weather in {result['city']}: {result['temperature']}°C, {result['description']}, Humidity: {result['humidity']}%"
```

### Step 4: Create Your First Agent

```python
# src/agent.py
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI
from langchain.memory import ConversationBufferMemory
from .tools import WeatherTool

class TravelAgent:
    """A simple travel agent that can help with weather information."""
    
    def __init__(self, openai_api_key: str, weather_api_key: str):
        # Initialize the language model
        self.llm = OpenAI(openai_api_key=openai_api_key, temperature=0.7)
        
        # Create the weather tool
        weather_tool = WeatherTool(weather_api_key)
        
        # Define tools for the agent
        self.tools = [
            Tool(
                name="Weather",
                func=weather_tool,
                description="Get current weather information for any city. Input should be the city name."
            )
        ]
        
        # Set up memory for conversation
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        # Initialize the agent
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent="conversational-react-description",
            memory=self.memory,
            verbose=True
        )
    
    def chat(self, message: str) -> str:
        """Chat with the travel agent."""
        try:
            response = self.agent.run(input=message)
            return response
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"
```

### Step 5: Create the Main Application

```python
# main.py
import os
from dotenv import load_dotenv
from src.agent import TravelAgent

def main():
    # Load environment variables
    load_dotenv()
    
    # Get API keys
    openai_key = os.getenv('OPENAI_API_KEY')
    weather_key = os.getenv('OPENWEATHER_API_KEY')
    
    if not openai_key:
        print("Please set your OPENAI_API_KEY in the .env file")
        return
    
    if not weather_key:
        print("Please set your OPENWEATHER_API_KEY in the .env file")
        return
    
    # Create the agent
    agent = TravelAgent(openai_key, weather_key)
    
    print("🌍 Travel AI Agent is ready! Ask me about weather in any city.")
    print("Type 'quit' to exit.\n")
    
    while True:
        user_input = input("You: ")
        
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Goodbye! Happy travels! ✈️")
            break
        
        response = agent.chat(user_input)
        print(f"Agent: {response}\n")

if __name__ == "__main__":
    main()
```

## 🧪 Testing Your Agent

Run your agent:

```bash
python main.py
```

Try these example conversations:

```
You: What's the weather like in Paris?
Agent: [Gets weather data and responds]

You: I'm planning a trip to Tokyo next month. What should I know about the weather?
Agent: [Provides weather information and travel advice]
```

## 🎓 Understanding What Happened

### 1. Tool Creation
- We created a `WeatherTool` class that can get weather data
- The tool has a `__call__` method that makes it usable by the agent
- It handles errors gracefully

### 2. Agent Initialization
- We used LangChain's `initialize_agent` function
- We chose the "conversational-react-description" agent type
- We added memory so the agent remembers the conversation

### 3. Agent Execution
- The agent receives your message
- It decides which tool to use (in this case, the weather tool)
- It calls the tool with the appropriate parameters
- It formats the response in a natural way

## 🚀 Next Steps

Now that you have a basic agent working, you can:

1. **Add More Tools**: Flight search, hotel finder, currency converter
2. **Improve Memory**: Store user preferences and travel history
3. **Better Prompts**: Make the agent more travel-focused
4. **Error Handling**: Make the agent more robust
5. **User Interface**: Create a web interface or chatbot

## 🐛 Common Issues and Solutions

### Issue: "No module named 'langchain'"
**Solution**: Make sure you activated your virtual environment and installed dependencies

### Issue: "Invalid API key"
**Solution**: Check your `.env` file and make sure the API keys are correct

### Issue: "Tool not found"
**Solution**: Make sure your tool is properly defined and added to the tools list

### Issue: Agent gives generic responses
**Solution**: Improve your prompts and add more specific tools

## 📚 Further Reading

- [LangChain Documentation](https://python.langchain.com/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Python Requests Library](https://requests.readthedocs.io/)

---

**Congratulations!** You've built your first AI travel agent! 🎉

In the next guide, we'll add more sophisticated tools and make the agent much more capable.
