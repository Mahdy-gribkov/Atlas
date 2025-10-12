# 🌍 Travel AI Agent

A **privacy-first, free, and intelligent travel planning assistant** powered by local AI and free APIs. No data leaves your device, no API costs, complete privacy.

## ✨ Features

### 🧠 **Intelligent Planning**
- **Local AI**: Uses Llama 3.1 8B model running on your device
- **Context Awareness**: Remembers conversation history and preferences
- **Multi-step Planning**: Breaks down complex travel requests into actionable steps

### 🔍 **Information Sources**
- **Country Information**: Detailed data about countries, capitals, currencies
- **Wikipedia Integration**: Rich cultural and historical information
- **Geocoding**: Precise coordinates and location data
- **Web Search**: Real-time information from the internet
- **Travel APIs**: Weather, flights, hotels (when API keys provided)

### 🛡️ **Privacy & Security**
- **Zero Data Leakage**: Everything runs locally on your machine
- **Encrypted Storage**: All data encrypted with AES-256
- **No Tracking**: No analytics, no data collection
- **Free Forever**: No subscription fees, no API costs

### 🚀 **Performance**
- **Fast Responses**: Optimized for speed and efficiency
- **Offline Capable**: Works without internet (except for real-time data)
- **Low Resource Usage**: Efficient memory and CPU usage

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **8GB+ RAM** (for local LLM)
- **Windows/Linux/Mac**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Travel_Agent
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements-simple.txt
   ```

3. **Install Ollama (for local AI)**
   ```bash
   # Windows
   winget install Ollama.Ollama
   
   # Linux/Mac
   curl -fsSL https://ollama.com/install.sh | sh
   ```

4. **Download AI model**
   ```bash
   ollama pull llama3.1:8b
   ```

5. **Run the travel agent**
   ```bash
   python travel_agent.py
   ```

## 🎯 Usage Examples

### Basic Country Information
```
You: Tell me about Peru
Agent: **Peru**
Capital: Lima
Coordinates: -12.0459808, -77.0305912
Tourist Attractions: Peru is famous for Machu Picchu, the ancient Inca citadel...
```

### Travel Planning
```
You: I want to plan a trip to Japan for 2 weeks with a $3000 budget
Agent: ✈️ Planning your Japan trip...
- Flights: $800-1200 (round trip from major US cities)
- Accommodation: $100-200/night (hotels/ryokans)
- Food: $50-100/day
- Activities: $500-800
- Transportation: $200-400 (JR Pass)
Total estimated: $2800-3600
```

### Real-time Information
```
You: What's the current weather in Tokyo?
Agent: 🌤️ Current weather in Tokyo:
- Temperature: 15°C (59°F)
- Condition: Partly cloudy
- Humidity: 65%
- Wind: 10 km/h
```

## 🏗️ Architecture

### Core Components
- **Travel Agent**: Main AI assistant with conversation memory
- **Local LLM**: Llama 3.1 8B for natural language processing
- **API Clients**: Free services for real-time data
- **Secure Database**: Encrypted local storage
- **Web Search**: Real-time internet information

### Data Flow
```
User Query → Travel Agent → Local LLM → API Calls → Response
                ↓
         Secure Database (encrypted storage)
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file for API keys:
```env
# Local LLM (default)
USE_LOCAL_LLM=true
OLLAMA_MODEL=llama3.1:8b

# Optional API keys for enhanced features
OPENWEATHER_API_KEY=your_key_here
FIXER_API_KEY=your_key_here
AVIATIONSTACK_API_KEY=your_key_here

# Security
ENCRYPTION_KEY=your_encryption_key_here
```

### Available Models
- **llama3.1:8b** (Recommended - 4.7GB, 8GB RAM)
- **llama3.1:70b** (Best quality - 40GB, 80GB RAM)
- **mistral:7b** (Fastest - 4.1GB, 6GB RAM)

## 🛠️ Development

### Project Structure
```
Travel_Agent/
├── travel_agent.py          # Main application
├── requirements-simple.txt  # Dependencies
├── README.md               # This file
└── src/
    ├── config.py           # Configuration management
    ├── apis/               # API clients
    │   ├── country_client.py
    │   ├── wikipedia_client.py
    │   ├── maps_client.py
    │   └── web_search_client.py
    └── database/
        └── secure_database.py
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

## 🚀 Performance Optimization

### Speed Improvements
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

### Getting Help
- Check the logs in `data/` directory
- Verify all dependencies installed
- Ensure Python 3.9+ is being used

## 📈 Roadmap

### Planned Features
- **Multi-language Support**: Spanish, French, German, Japanese
- **Voice Interface**: Speech-to-text and text-to-speech
- **Mobile App**: iOS and Android versions
- **Advanced Planning**: Itinerary optimization, booking integration
- **Offline Maps**: Downloadable maps for offline use

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

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