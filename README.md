# AI Travel Agent

A production-ready AI-powered travel planning application built with Next.js, React, TypeScript, Firebase, and Google Gemini AI.

## 🚀 Features

### Core Functionality
- **AI-Powered Itinerary Generation**: Create personalized travel itineraries using Google Gemini AI
- **Multi-Modal Input Support**: Text, voice, and image inputs for travel planning
- **Real-Time Data Integration**: Live weather, flight, and accommodation data
- **Conversational Planning**: Interactive chat-based travel planning
- **Cost Optimization**: Budget-aware recommendations and cost tracking
- **Sustainability Focus**: Eco-friendly travel options and carbon footprint tracking
- **Accessibility Support**: Comprehensive accessibility features and recommendations

### Production-Ready Features
- **Comprehensive Security**: Authentication, authorization, rate limiting, CSRF protection
- **Error Handling & Logging**: Structured logging with severity levels and audit trails
- **Monitoring & Alerting**: Health checks, metrics collection, and performance monitoring
- **Performance Optimization**: Multi-strategy caching, response optimization, and memory management
- **Testing Framework**: Unit, integration, component, and API testing with 70%+ coverage
- **Internationalization**: Hebrew (RTL) and English support with auto-detection

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Framer Motion** for animations
- **React Hook Form** with Zod validation

### Backend & Services
- **Firebase** (Auth, Firestore, Cloud Functions)
- **Google Gemini AI** via LangChain
- **NextAuth.js** for authentication
- **Vector Database** (Pinecone/Weaviate) for RAG
- **External APIs**: OpenWeatherMap, Amadeus, Google Maps, REST Countries

### Security & Monitoring
- **Comprehensive Security System**: RBAC, rate limiting, input validation
- **Audit Logging**: Security events and user actions
- **Health Checks**: Liveness, readiness, and comprehensive health monitoring
- **Performance Monitoring**: Metrics collection and alerting
- **Error Handling**: Categorized error types with structured logging

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── health/        # Health check endpoints
│   │   ├── weather/       # Weather API
│   │   ├── flights/       # Flight search API
│   │   └── ...
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── ...
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── ...
├── lib/                  # Utility libraries
│   ├── security/         # Security system
│   ├── error-handling/   # Error handling
│   ├── monitoring/       # Monitoring & metrics
│   ├── performance/      # Performance optimization
│   └── testing/          # Testing utilities
├── services/             # Business logic services
│   ├── ai/              # AI services (Gemini, Vector)
│   ├── external/        # External API services
│   └── ...
├── types/               # TypeScript type definitions
├── __tests__/           # Test files
└── docs/               # Documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Google Cloud project (for Gemini AI)
- External API keys (OpenWeatherMap, Amadeus, Google Maps)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-travel-agent.git
   cd ai-travel-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   # Security
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   
   # Firebase
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   
   # External APIs
   OPENWEATHER_API_KEY=your-openweather-key
   AMADEUS_API_KEY=your-amadeus-key
   AMADEUS_API_SECRET=your-amadeus-secret
   GOOGLE_MAPS_API_KEY=your-google-maps-key
   
   # AI Services
   GOOGLE_GEMINI_API_KEY=your-gemini-key
   
   # Optional: Monitoring
   UPSTASH_REDIS_REST_URL=your-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   ```

4. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Email/Password, Google)
   - Create a Firestore database
   - Generate service account credentials

5. **Set up external APIs**
   - [OpenWeatherMap](https://openweathermap.org/api) - Weather data
   - [Amadeus](https://developers.amadeus.com/) - Flight data
   - [Google Maps](https://developers.google.com/maps) - Maps and places
   - [Google Gemini](https://ai.google.dev/) - AI capabilities

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

The application includes comprehensive testing with multiple test types:

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:api         # API tests
npm run test:components  # Component tests
```

### Test Coverage
- **Minimum Coverage**: 70% for all metrics
- **Test Types**: Unit, integration, component, API, performance, security
- **Mocking**: Comprehensive mocking of external dependencies
- **Test Utilities**: Custom helpers for API and component testing

## 🔒 Security

The application implements comprehensive security measures:

### Authentication & Authorization
- **NextAuth.js** with multiple providers
- **Role-Based Access Control (RBAC)**
- **JWT token management**
- **Session management**

### Security Features
- **Input validation and sanitization**
- **Rate limiting and DDoS protection**
- **CSRF protection**
- **Security headers (CSP, HSTS, etc.)**
- **Audit logging**
- **Brute force protection**

### Usage Example
```typescript
import { secure } from '@/lib/security';

// Public endpoint
export const GET = secure.public(async (req) => {
  return NextResponse.json({ data: 'public data' });
});

// User-only endpoint
export const POST = secure.user(async (req, context) => {
  return NextResponse.json({ 
    data: 'user data',
    userId: context.userId 
  });
});
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **`/api/health`** - Comprehensive health check
- **`/api/ready`** - Readiness check
- **`/api/live`** - Liveness check
- **`/api/metrics`** - Application metrics

### Monitoring Features
- **Performance metrics** (response times, memory usage)
- **Business metrics** (user activity, error rates)
- **Health monitoring** (database, external services)
- **Alerting system** (configurable thresholds)

### Usage Example
```bash
# Check application health
curl http://localhost:3000/api/health

# Get metrics
curl http://localhost:3000/api/metrics
```

## ⚡ Performance

### Caching System
- **Multi-strategy caching** (LRU, FIFO, TTL)
- **Request-level caching**
- **Function-level caching**
- **Tag-based invalidation**

### Optimization Features
- **Response compression**
- **Image optimization**
- **Database query optimization**
- **Memory management**

### Usage Example
```typescript
import { withCaching } from '@/lib/performance';

export const GET = withCaching(
  'weather-cache',
  (req) => `weather:${req.nextUrl.searchParams.get('location')}`,
  { ttl: 300 } // 5 minutes
)(async (req) => {
  // Your API logic
});
```

## 🌍 Internationalization

The application supports multiple languages with RTL support:

- **English** (LTR)
- **Hebrew** (RTL)
- **Auto-detection** based on browser settings
- **Dynamic language switching**

## 📚 API Documentation

### Core Endpoints

#### Health & Monitoring
- `GET /api/health` - Comprehensive health check
- `GET /api/ready` - Readiness check
- `GET /api/live` - Liveness check
- `GET /api/metrics` - Application metrics

#### Travel Services
- `GET /api/weather` - Weather data
- `GET /api/flights` - Flight search
- `GET /api/places` - Places and attractions
- `POST /api/itineraries` - Create itinerary

#### User Management
- `GET /api/users/profile` - User profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/itineraries` - User itineraries

### Authentication
All protected endpoints require authentication via NextAuth.js. Include the session token in the Authorization header:

```
Authorization: Bearer <session-token>
```

## 🚀 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Monitoring and alerting set up
- [ ] Health checks configured
- [ ] Caching strategy implemented
- [ ] Error handling and logging configured
- [ ] Test coverage meets requirements
- [ ] Performance optimization enabled
- [ ] Security audit completed

### Deployment Options

#### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

#### Docker
```bash
docker build -t ai-travel-agent .
docker run -p 3000:3000 ai-travel-agent
```

#### Manual Deployment
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Ensure test coverage remains above 70%
- Follow the existing code style
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [documentation](docs/)
- Review the [troubleshooting guide](docs/TROUBLESHOOTING.md)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Google Gemini](https://ai.google.dev/) - AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Built with ❤️ for travelers worldwide**