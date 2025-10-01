# 🌍 Travel AI Agent

An intelligent travel planning assistant built with LangChain that helps users plan trips, find accommodations, and discover amazing travel experiences.

## 🎯 What This Project Does

This Travel AI Agent is designed to be your personal travel assistant that can:

- **Plan Complete Trips**: From destination selection to detailed itineraries
- **Find Flights & Hotels**: Search and compare options based on your preferences
- **Provide Travel Information**: Weather, local customs, visa requirements, and more
- **Learn Your Preferences**: Remember your travel style and budget for better recommendations
- **Handle Complex Queries**: Natural language conversations about travel planning

## 🏗️ Architecture Overview

### Core Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Input    │───▶│  LangChain      │───▶│  Travel Tools   │
│   (Natural      │    │  Agent          │    │  (APIs)         │
│   Language)     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Memory System  │
                       │  (Conversation  │
                       │   History)      │
                       └─────────────────┘
```

### Technology Stack

- **🤖 AI Framework**: LangChain for agent orchestration
- **🐍 Backend**: Python 3.9+ with async support
- **🧠 LLM**: OpenAI GPT-4 (configurable)
- **💾 Database**: SQLite for user data and preferences
- **🌐 APIs**: Amadeus (flights/hotels), Google Places, OpenWeather
- **📊 Memory**: ConversationBufferMemory for context retention

## 🚀 Quick Start

### Prerequisites

- Python 3.9 or higher
- OpenAI API key
- Travel API keys (Amadeus, Google Places)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Travel_Agent
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Run the agent**
   ```bash
   python src/main.py
   ```

## 📖 How It Works

### 1. Agent Architecture

The Travel AI Agent uses LangChain's ReAct (Reasoning + Acting) pattern:

- **Reasoning**: The agent analyzes your request and determines what information it needs
- **Acting**: It uses appropriate tools (APIs) to gather that information
- **Response**: It synthesizes the information into a helpful response

### 2. Tool Integration

The agent has access to several specialized tools:

- **Flight Tool**: Search for flights using Amadeus API
- **Hotel Tool**: Find accommodations based on location and preferences
- **Weather Tool**: Get current and forecast weather information
- **Maps Tool**: Find nearby attractions, restaurants, and services
- **Currency Tool**: Convert between different currencies

### 3. Memory System

The agent remembers:
- Your conversation history
- Your travel preferences
- Previous trip details
- Budget constraints and preferences

## 🛠️ Development Guide

### Project Structure

```
Travel_Agent/
├── src/
│   ├── agent/              # Core agent implementation
│   │   ├── travel_agent.py # Main agent class
│   │   └── prompts.py      # Prompt templates
│   ├── tools/              # API integration tools
│   │   ├── flight_tool.py
│   │   ├── hotel_tool.py
│   │   └── weather_tool.py
│   ├── memory/             # Memory management
│   │   └── conversation_memory.py
│   └── utils/              # Utilities and helpers
│       ├── config.py       # Configuration management
│       └── helpers.py      # Common helper functions
├── tests/                  # Test files
├── docs/                   # Documentation
├── examples/               # Usage examples
└── requirements.txt        # Python dependencies
```

### Key Concepts Explained

#### LangChain Agents
An agent is an AI system that can use tools to accomplish tasks. Think of it as a smart assistant that can:
- Understand what you want
- Decide which tools to use
- Execute actions using those tools
- Provide you with results

#### Tools
Tools are functions that the agent can call to get information or perform actions. For example:
- A flight search tool might call an airline API
- A weather tool might call a weather service API
- A currency converter tool might call a financial API

#### Memory
Memory allows the agent to remember previous conversations and user preferences, making interactions more personalized over time.

## 📚 Learning Resources

### For Beginners

1. **Python Basics**
   - [Python.org Tutorial](https://docs.python.org/3/tutorial/)
   - [Real Python](https://realpython.com/) - Great for practical examples

2. **LangChain Introduction**
   - [LangChain Documentation](https://python.langchain.com/docs/get_started/introduction)
   - [LangChain Agents Guide](https://python.langchain.com/docs/modules/agents/)

3. **API Integration**
   - [Python Requests Library](https://requests.readthedocs.io/)
   - [Async/Await in Python](https://docs.python.org/3/library/asyncio.html)

### Advanced Topics

- **Prompt Engineering**: Crafting effective prompts for AI models
- **Memory Management**: Optimizing conversation context
- **Error Handling**: Building robust applications
- **Testing**: Ensuring code quality and reliability

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=src

# Run specific test file
pytest tests/test_agent.py
```

## 📊 Example Usage

### Basic Trip Planning

```python
from src.agent.travel_agent import TravelAgent

# Initialize the agent
agent = TravelAgent()

# Plan a trip
response = agent.plan_trip(
    destination="Paris",
    duration="5 days",
    budget="$2000",
    interests=["museums", "food", "history"]
)

print(response)
```

### Flight Search

```python
# Search for flights
flights = agent.search_flights(
    origin="New York",
    destination="London",
    departure_date="2024-06-15",
    return_date="2024-06-22"
)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🗺️ Roadmap

- [ ] **Phase 1**: Basic agent with core travel tools
- [ ] **Phase 2**: Advanced planning and booking capabilities
- [ ] **Phase 3**: Multi-language support and localization
- [ ] **Phase 4**: Mobile app integration
- [ ] **Phase 5**: Group travel planning features

---

**Happy Traveling! 🌍✈️**

*Built with ❤️ using LangChain and Python*
