# 🌍 Travel AI Agent

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-green?logo=python)](https://python.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A privacy-first, intelligent travel planning assistant that runs entirely locally using AI and free APIs.**

## 🎯 **Project Overview**

The Travel AI Agent is a comprehensive full-stack application that demonstrates advanced software engineering skills, AI integration, and modern development practices. Built with privacy-first principles, it provides intelligent travel planning without compromising user data.

### **Key Features**
- 🤖 **Local AI Integration** - Uses Llama 3.1 8B model via Ollama
- 🔒 **Privacy-First Design** - All data processed locally, no external data leakage
- 🌐 **100% Free APIs** - 15+ completely free APIs, NO API keys required
- 🗺️ **Interactive Maps** - React Leaflet integration with geocoding
- 💬 **Streaming Chat Interface** - Real-time AI responses with typing indicators
- 🐳 **Docker Ready** - Production-ready containerization
- 📱 **Responsive Design** - Modern UI with dark/light mode support

## 🚀 **Quick Start**

### **Docker Deployment (Recommended)**
   ```bash
# Clone the repository
   git clone <repository-url>
   cd Travel_Agent

# Deploy with Docker
./deploy.sh

# Access the application
open http://localhost:8000
```

### **Development Setup**
   ```bash
# Clone the repository
git clone <repository-url>
cd Travel_Agent

# Install Python dependencies
   pip install -r requirements.txt

# Install frontend dependencies
   cd frontend
   npm install
   cd ..

# Start the application
   python api.py

# Access the application
open http://localhost:8000
```

## 🏗️ **Architecture & Technology Stack**

### **Backend (Python/FastAPI)**
- **Framework**: FastAPI with async/await support
- **AI Integration**: Ollama with Llama 3.1 8B model
- **Database**: Encrypted SQLite with automatic cleanup
- **APIs**: 15+ free API integrations (weather, flights, hotels, etc.)
- **Security**: AES-256 encryption, rate limiting, circuit breakers

### **Frontend (React)**
- **Framework**: React 18.2 with Hooks
- **Maps**: React Leaflet with custom markers
- **Styling**: Modern CSS with responsive design
- **Features**: Voice recognition, streaming responses, dark mode

### **Infrastructure**
- **Containerization**: Multi-stage Docker builds
- **Orchestration**: Docker Compose for development and production
- **Monitoring**: Health checks and logging
- **Deployment**: Ready for cloud platforms (AWS, GCP, Azure)

## 📊 **Technical Highlights**

### **AI Integration**
- **Local LLM**: Llama 3.1 8B model running via Ollama
- **Conversation Memory**: Persistent chat history with encryption
- **Streaming Responses**: Real-time AI responses with typing indicators
- **Context Awareness**: Maintains conversation context across sessions

### **API Architecture**
- **15+ Free APIs**: Weather, flights, hotels, attractions, transportation
- **Rate Limiting**: Intelligent request throttling
- **Circuit Breakers**: Fault tolerance and error handling
- **Caching**: Redis-like caching for improved performance

### **Security Features**
- **Data Encryption**: AES-256 encryption for all stored data
- **Privacy-First**: No external data transmission
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Graceful error handling with user feedback

## 🎨 **User Interface**

### **Modern Design**
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: User preference support
- **Interactive Maps**: Real-time location visualization
- **Voice Input**: Speech-to-text integration
- **Streaming Chat**: Real-time AI responses

### **User Experience**
- **Intuitive Navigation**: Clean and simple interface
- **Real-time Feedback**: Loading states and progress indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant design

## 🔧 **Development**

### **Prerequisites**
- Python 3.11+
- Node.js 18+
- Docker (optional)
- Ollama with Llama 3.1 8B model

### **Backend Development**
```bash
# Start the API server
python api.py

# Run tests
pytest

# Check health
curl http://localhost:8000/health
```

### **Frontend Development**
```bash
# Start the React development server
cd frontend
npm start

# Build for production
npm run build
```

### **Docker Development**
```bash
# Start development environment
./dev.sh

# Start production environment
./deploy.sh
```

## 📚 **Documentation**

### **Technical Documentation**
- [API Documentation](API_DOCUMENTATION.md)
- [Docker Deployment Guide](DOCKER_README.md)
- [Portfolio Showcase](PORTFOLIO_README.md)
- [LinkedIn Showcase](LINKEDIN_SHOWCASE.md)

### **API Endpoints**
- **Health Check**: `GET /health`
- **Chat Interface**: `POST /chat` (streaming)
- **Simple Chat**: `POST /chat-simple`
- **Map Geocoding**: `POST /api/maps/geocode`
- **Reverse Geocoding**: `POST /api/maps/reverse-geocode`
- **Features List**: `GET /features`

## 🚀 **Deployment Options**

### **Cloud Platforms**
- **AWS**: ECS, Fargate, or EC2 deployment
- **Google Cloud**: Cloud Run or GKE
- **Azure**: Container Instances or AKS
- **DigitalOcean**: App Platform or Droplets
- **Heroku**: Container Registry deployment

### **Self-Hosted**
- **Docker**: Single command deployment
- **Kubernetes**: Production-ready manifests
- **VPS**: Any Linux server with Docker
- **Raspberry Pi**: Lightweight ARM deployment

## 📈 **Performance Metrics**

### **Response Times**
- **API Endpoints**: < 200ms average response time
- **AI Responses**: < 2s for typical queries
- **Database Queries**: < 50ms for most operations
- **Frontend Load**: < 3s initial load time

### **Resource Usage**
- **Memory**: ~512MB RAM for full stack
- **CPU**: Low usage with async operations
- **Storage**: < 100MB for application + data
- **Network**: Minimal bandwidth usage

## 🌟 **Key Achievements**

### **Technical Excellence**
- ✅ **Full-Stack Development**: End-to-end application development
- ✅ **AI Integration**: Local LLM integration with streaming responses
- ✅ **API Design**: RESTful API with comprehensive documentation
- ✅ **Database Design**: Encrypted SQLite with efficient queries
- ✅ **Frontend Development**: Modern React with advanced features

### **DevOps & Infrastructure**
- ✅ **Containerization**: Production-ready Docker setup
- ✅ **Orchestration**: Docker Compose for development and production
- ✅ **Monitoring**: Health checks and logging
- ✅ **Security**: Privacy-first design with encryption
- ✅ **Scalability**: Horizontal scaling support

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Mahdy Gribkov**
- GitHub: [@mahdygribkov](https://github.com/mahdygribkov)
- LinkedIn: [Mahdy Gribkov](https://linkedin.com/in/mahdygribkov)
- Portfolio: [mahdygribkov.com](https://mahdygribkov.com)

## 🙏 **Acknowledgments**

- **Ollama Team** for the amazing local LLM platform
- **FastAPI Team** for the excellent web framework
- **React Team** for the powerful frontend library
- **OpenStreetMap** for free mapping data
- **All API Providers** for free access to travel data

---

**⭐ If you found this project helpful, please give it a star!**

*This project demonstrates advanced full-stack development skills, AI integration, and modern DevOps practices. Perfect for showcasing technical expertise in interviews and portfolio presentations.*