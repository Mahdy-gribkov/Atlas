# 🌍 Travel AI Agent

A **privacy-first, completely free** travel planning assistant built with LangChain that helps users plan amazing trips using only free APIs and public data sources. **Zero costs, complete privacy protection, and local data processing.**

## 🔒 Privacy & Security First

- **Zero External Data Storage**: All your data stays on your device
- **Local Processing**: AI processing happens locally when possible
- **Encrypted Storage**: SQLite database with AES-256 encryption
- **Free APIs Only**: No paid services, no hidden costs
- **Data Minimization**: Collect only essential data, delete immediately after use
- **Anonymous API Calls**: No user data transmitted to external services

## 🆓 Completely Free

- **No API Costs**: All APIs are free or have generous free tiers
- **No Subscription Fees**: Use forever without any costs
- **No Hidden Charges**: Transparent, open-source implementation
- **Self-Hosted**: Run on your own device, no cloud dependencies

## 🚀 Features

### Core Capabilities
- **Weather Information**: Current weather and 5-day forecasts
- **Currency Exchange**: Real-time exchange rates and conversions
- **Flight Information**: Flight status and airline data
- **Country Information**: Comprehensive destination details
- **Wikipedia Integration**: General information and facts
- **Geocoding**: Address and location services

### Advanced Features
- **Trip Planning**: Comprehensive travel planning assistance
- **Local Memory**: Encrypted conversation history
- **Rate Limiting**: Intelligent API usage management
- **Caching**: Local data caching for better performance
- **Multi-Language Support**: Works in multiple languages
- **Interactive Chat**: Natural language conversation

## 🛠️ Technology Stack

- **Backend**: Python 3.9+ with FastAPI
- **AI Framework**: LangChain with local LLM support
- **Database**: Encrypted SQLite with automatic cleanup
- **APIs**: Free services only (OpenWeather, Fixer.io, etc.)
- **Security**: End-to-end encryption and data protection
- **Deployment**: Local deployment with Docker support

## 📋 Free API Sources

| Service | Free Tier | Features |
|---------|-----------|----------|
| **OpenWeather** | 1000 calls/day | Weather data and forecasts |
| **Fixer.io** | 100 calls/month | Currency exchange rates |
| **AviationStack** | 100 calls/month | Flight information |
| **REST Countries** | Unlimited | Country information |
| **Wikipedia** | Unlimited | General information |
| **OpenStreetMap** | 1000 calls/day | Geocoding and maps |

## 🚀 Quick Start

### Prerequisites
- Python 3.9 or higher
- Free API keys (get them for free from the services above)

### Installation

#### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd Travel_Agent

# Run setup script
# On Windows:
scripts\setup.bat

# On Linux/Mac:
chmod +x scripts/setup.sh
./scripts/setup.sh
```

#### Option 2: Manual Setup
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create directories
mkdir data logs cache temp

# Copy environment file
cp env.example .env
```

### Configuration

1. **Get Free API Keys** (Optional - Local LLM is default):
   - [OpenWeather API](https://openweathermap.org/api) - Free tier: 1000 calls/day
   - [Fixer.io API](https://fixer.io/) - Free tier: 100 calls/month
   - [AviationStack API](https://aviationstack.com/) - Free tier: 100 calls/month
   - **Local LLM (Ollama)**: Completely free, no API key needed (recommended)
   - [OpenAI API](https://platform.openai.com/) - $5 free credit (optional)

2. **Edit .env file**:
   ```env
   # Local LLM (recommended - completely free)
   USE_LOCAL_LLM=true
   OLLAMA_MODEL=llama2
   
   # Free APIs (optional)
   OPENWEATHER_API_KEY=your_openweather_key_here
   FIXER_API_KEY=your_fixer_key_here
   AVIATIONSTACK_API_KEY=your_aviationstack_key_here
   
   # OpenAI (optional - only if you want to use OpenAI instead of local LLM)
   OPENAI_API_KEY=your_openai_key_here
   ```

### Running the Agent

```bash
# Interactive chat mode (default)
python main.py

# Trip planning mode
python main.py --plan-trip

# Test API connections
python main.py --test-apis

# Show help
python main.py --help
```

## 💬 Usage Examples

### Interactive Chat
```
You: What's the weather like in Paris?
Agent: I'll check the current weather in Paris for you...

You: Convert 1000 USD to EUR
Agent: Converting 1000 USD to EUR...

You: Tell me about Japan
Agent: I'll get information about Japan for you...

You: Plan a trip to London
Agent: I'll help you plan a comprehensive trip to London...
```

### Trip Planning
```
Destination: Paris, France
Start date: 2024-06-15
End date: 2024-06-22
Travelers: 2
Budget: 2000 USD

Agent: Planning your trip to Paris...
- Weather forecast for your dates
- Currency information (USD to EUR)
- Destination details and recommendations
- Local attractions and activities
```

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `help` | Show available commands |
| `features` | Show available features |
| `privacy` | Show privacy information |
| `stats` | Show database statistics |
| `cleanup` | Clean up expired data |
| `quit` | Exit the application |

## 📊 API Usage & Limits

The agent intelligently manages API usage to stay within free tier limits:

- **Weather**: 1000 calls/day (OpenWeather)
- **Currency**: 100 calls/month (Fixer.io)
- **Flights**: 100 calls/month (AviationStack)
- **Countries**: Unlimited (REST Countries)
- **Wikipedia**: Unlimited
- **Maps**: 1000 calls/day (OpenStreetMap)

## 🛡️ Security Features

### Data Protection
- **Local Encryption**: All data encrypted with AES-256
- **Automatic Cleanup**: Expired data deleted automatically
- **No External Storage**: Data never leaves your device
- **Anonymous Requests**: API calls don't include user identifiers

### Privacy Measures
- **Zero Tracking**: No user behavior monitoring
- **Local Memory**: Conversation history stored locally
- **Data Minimization**: Only essential data collected
- **Immediate Deletion**: Temporary data deleted after use

## 🏗️ Project Structure

```
Travel_Agent/
├── src/
│   ├── agent/              # Core agent implementation
│   ├── apis/               # Free API clients
│   ├── database/           # Encrypted local database
│   └── config.py           # Configuration management
├── scripts/                # Setup and utility scripts
├── docs/                   # Documentation
├── main.py                 # Main application
├── requirements.txt        # Python dependencies
├── setup.py               # Package setup
└── README.md              # This file
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Install development dependencies
pip install -r requirements.txt
pip install -e ".[dev]"

# Run tests
pytest

# Format code
black src/

# Type checking
mypy src/
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder for detailed guides
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas

## 🎯 Roadmap

- [ ] **Phase 1**: Core agent with free APIs ✅
- [ ] **Phase 2**: Local LLM integration (Ollama)
- [ ] **Phase 3**: Web interface
- [ ] **Phase 4**: Mobile app
- [ ] **Phase 5**: Advanced trip planning features

## 🙏 Acknowledgments

- **LangChain** for the amazing AI framework
- **OpenWeather** for free weather data
- **Fixer.io** for free currency rates
- **AviationStack** for free flight data
- **REST Countries** for free country information
- **Wikipedia** for free general information
- **OpenStreetMap** for free mapping data

---

**Happy Traveling! 🌍✈️**

*Built with ❤️ using only free APIs and open-source technologies*
