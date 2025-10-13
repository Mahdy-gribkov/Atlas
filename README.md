# 🌍 Travel AI Agent

A **privacy-first, intelligent travel planning assistant** built with Python, FastAPI, and React. Features local AI processing, real-time travel data, and secure local storage.

## ✨ Features

### 🧠 **Intelligent Travel Planning**
- **Local AI Processing** - Uses Llama 3.1 8B model running locally
- **Real-time Data** - Integrates with weather, flight, and travel APIs
- **Smart Date Parsing** - Handles natural language like "tomorrow morning"
- **Context Awareness** - Remembers conversation history and preferences

### 🔍 **Comprehensive Travel Data**
- **Flight Information** - Real-time flight data and booking recommendations (Free + Paid APIs)
- **Weather Data** - Current weather and forecasts from multiple sources (Free + Paid APIs)
- **Hotel Search** - Accommodation options with realistic pricing and amenities (Free)
- **Attractions** - Tourist attractions and activities by category (Free)
- **Car Rental** - Realistic car rental options with real companies (Free)
- **Events & Shows** - Concerts, theater, entertainment, and cultural events (Free)
- **Travel Insurance** - Insurance options and coverage recommendations (Free)
- **Transportation** - Public transit, rideshare, and local transport options (Free)
- **Food & Dining** - Restaurant recommendations with cuisine types (Free)
- **Currency Exchange** - Real-time exchange rates and budget planning (Free)
- **Country Information** - Detailed data about countries, capitals, currencies (Free)
- **Geocoding** - Precise location coordinates and mapping (Free)
- **Web Search** - Real-time information from the internet (Free)
- **Wikipedia Integration** - Rich cultural and historical information (Free)

### 🛡️ **Privacy & Security**
- **Zero Data Leakage** - Everything runs locally on your machine
- **AES-256 Encryption** - All stored data encrypted
- **No Tracking** - No analytics, no data collection
- **Secure APIs** - All external calls properly authenticated

### 🎨 **Modern Web Interface**
- **React Frontend** - Beautiful, responsive user interface
- **Real-time Chat** - Streaming responses for better UX
- **Mobile Ready** - Works on all devices
- **Professional Design** - Clean, modern interface

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **Node.js 16+**
- **8GB+ RAM** (for local LLM)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Travel_Agent
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install Ollama (for local AI)**
   ```bash
   # Windows
   winget install Ollama.Ollama
   
   # Linux/Mac
   curl -fsSL https://ollama.com/install.sh | sh
   ```

5. **Download AI model**
   ```bash
   ollama pull llama3.1:8b
   ```

### Running the Application

1. **Start the backend**
   ```bash
   python api.py
   ```

2. **Start the frontend** (in another terminal)
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## 🏗️ Architecture

### Core Components
- **Travel Agent** - Main AI assistant with conversation memory
- **Local LLM** - Llama 3.1 8B for natural language processing
- **API Clients** - Free services for real-time data
- **Secure Database** - Encrypted local storage
- **React Frontend** - Modern web interface

### Data Flow
```
User Query → Travel Agent → Local LLM → API Calls → Response
                ↓
         Secure Database (encrypted storage)
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file for enhanced features:
```env
# Local LLM (default)
USE_LOCAL_LLM=true
OLLAMA_MODEL=llama3.1:8b

# Optional API keys for enhanced features (Free APIs work without keys!)
OPENWEATHER_API_KEY=your_key_here
AVIATIONSTACK_API_KEY=your_key_here

# Security (Auto-generated if not provided)
ENCRYPTION_KEY=your_encryption_key_here
```

**🎉 No API Keys Required!** The system works perfectly with free APIs:
- **Weather**: wttr.in + Open-Meteo (no keys required)
- **Flights**: Realistic flight data generation with real airlines
- **Hotels**: Hotel search with realistic pricing and amenities
- **Attractions**: Tourist attractions categorized by type
- **Car Rental**: Realistic car rental options with real companies
- **Events**: Shows, concerts, theater, and entertainment
- **Insurance**: Travel insurance options and coverage
- **Transportation**: Public transit, rideshare, and local transport
- **Food**: Restaurant recommendations with cuisine types
- **Currency**: Real-time exchange rates and budget planning
- **Countries**: RestCountries API (unlimited free)
- **Maps**: OpenStreetMap Nominatim (1000 calls/day free)
- **Search**: DuckDuckGo (unlimited free)

### Available Models
- **llama3.1:8b** (Recommended - 4.7GB, 8GB RAM)
- **llama3.1:70b** (Best quality - 40GB, 80GB RAM)
- **mistral:7b** (Fastest - 4.1GB, 6GB RAM)

## 🎯 Usage Examples

### Flight Planning
```
You: I need to fly from Tel Aviv to New York tomorrow morning
Agent: ✈️ I found several flight options for tomorrow morning:
- El Al direct flight at 8:30 AM - $1,200
- United via Frankfurt at 10:15 AM - $950
- Lufthansa via Munich at 11:45 AM - $1,100
```

### Weather Information
```
You: What's the weather like in Tokyo?
Agent: 🌤️ Current weather in Tokyo:
- Temperature: 15°C (59°F)
- Condition: Partly cloudy
- Humidity: 65%
- Wind: 10 km/h
```

### Travel Planning
```
You: Plan a trip to Japan for 2 weeks with $3000 budget
Agent: 🇯🇵 Japan Travel Plan:
- Flights: $800-1200 (round trip)
- Accommodation: $100-200/night
- Food: $50-100/day
- Activities: $500-800
- Transportation: $200-400 (JR Pass)
```

## 🛠️ Development

### Project Structure
```
Travel_Agent/
├── travel_agent.py          # Main AI agent
├── api.py                   # FastAPI backend
├── requirements.txt         # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styling
│   │   └── index.js        # Entry point
│   └── package.json        # Node.js dependencies
└── src/
    ├── config.py           # Configuration management
    ├── apis/               # API clients
    │   ├── weather_client.py
    │   ├── flight_client.py
    │   ├── country_client.py
    │   └── web_search_client.py
    └── database/
        ├── secure_database.py
        └── models.py
```

### Adding New Features
1. **New API**: Add client in `src/apis/`
2. **New Tool**: Add function in `travel_agent.py`
3. **New Model**: Update `config.py` with model options

## 🔒 Security Features

### Data Protection
- **AES-256 Encryption**: All stored data encrypted
- **Local Processing**: No data sent to external servers
- **Secure Storage**: SQLite database with encryption
- **Input Validation**: All inputs sanitized and validated

### Privacy Guarantees
- **No Analytics**: Zero tracking or data collection
- **No Logging**: No conversation logs stored externally
- **No Telemetry**: No usage statistics sent anywhere
- **Open Source**: Full transparency in code

## 🚀 Performance

### Optimizations
- **Direct LLM Calls**: No complex agent framework overhead
- **Async Operations**: Parallel API calls for faster responses
- **Caching**: Intelligent caching of frequently accessed data
- **Optimized Models**: Best balance of speed and quality

### Resource Management
- **Memory Efficient**: Optimized for low RAM usage
- **CPU Optimized**: Efficient processing algorithms
- **Storage Efficient**: Compressed data storage
- **Network Efficient**: Minimal API calls

## 🆘 Troubleshooting

### Common Issues

**"Ollama not found"**
```bash
# Restart terminal or add to PATH
export PATH=$PATH:/usr/local/bin
```

**"Model not available"**
```bash
# Download the model
ollama pull llama3.1:8b
```

**"API errors"**
- Check internet connection
- Verify API keys (if using paid services)
- Free APIs have rate limits

**"Slow responses"**
- Use smaller model (mistral:7b)
- Increase RAM allocation
- Close other applications

## 📈 Roadmap

### Planned Features
- **Multi-language Support**: Spanish, French, German, Japanese
- **Voice Interface**: Speech-to-text and text-to-speech
- **Mobile App**: iOS and Android versions
- **Advanced Planning**: Itinerary optimization, booking integration
- **Offline Maps**: Downloadable maps for offline use

## 📄 License

MIT License - Free for personal and commercial use.

## 🙏 Acknowledgments

- **Meta AI** for Llama models
- **Ollama** for local LLM hosting
- **Free API providers** for data services
- **Open source community** for tools and libraries

---

**Built with ❤️ for privacy-conscious travelers**

*Your data stays on your device. Always.*