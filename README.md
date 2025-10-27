# 🚀 Travel Agent - AI-Powered Travel Planning Platform

A comprehensive, production-ready travel planning platform built with Next.js 14, Firebase, and AI integration.

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Itinerary Planning**: Generate personalized travel itineraries using Google Gemini AI
- **Real-Time Chat Interface**: Interactive chat with AI travel assistant
- **Multi-Language Support**: English and Hebrew localization
- **User Authentication**: Secure authentication with NextAuth.js and Firebase
- **Responsive Design**: Mobile-first, accessible UI with Tailwind CSS

### 🔒 Security & Performance
- **Comprehensive Security**: CSRF protection, rate limiting, input validation
- **Performance Optimization**: Multi-level caching, image optimization, code splitting
- **Error Handling**: Centralized error management with detailed logging
- **Monitoring**: Real-time health checks, metrics collection, and alerting

### 🛠️ Developer Experience
- **TypeScript**: Full type safety with strict configuration
- **Testing**: Comprehensive test suite with Jest and Playwright
- **Code Quality**: ESLint, Prettier, and automated formatting
- **CI/CD**: Automated testing, security scanning, and deployment

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (app)/             # Application routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── layouts/          # Layout components
│   └── features/         # Feature-specific components
├── lib/                  # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── security/         # Security system
│   ├── validation/       # Data validation
│   ├── cache/            # Caching system
│   ├── monitoring/       # Monitoring & metrics
│   └── utils/            # General utilities
├── services/             # Business logic services
│   ├── ai/               # AI services
│   ├── external/         # External API services
│   ├── data/             # Data services
│   └── core/             # Core business services
├── types/                # TypeScript definitions
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
└── styles/               # Global styles
```

### Technology Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict configuration
- **Database**: Firebase Firestore
- **Authentication**: NextAuth.js with Firebase
- **AI**: Google Gemini via LangChain
- **UI**: Tailwind CSS with Radix UI components
- **Testing**: Jest, Playwright, Testing Library
- **Deployment**: Vercel with automated CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+
- Firebase project
- Google Cloud API keys

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/travel-agent.git
   cd travel-agent
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
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Firebase Admin
   FIREBASE_ADMIN_PROJECT_ID=your_project_id
   FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_private_key
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # AI Services
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   
   # External APIs
   OPENWEATHER_API_KEY=your_openweather_key
   AMADEUS_API_KEY=your_amadeus_key
   AMADEUS_API_SECRET=your_amadeus_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   
   # Redis (Optional)
   REDIS_URL=your_redis_url
   ```

4. **Set up Firebase**
   ```bash
   npm run firebase:emulators:start
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:ci
```

### Test Coverage
- **Target**: 80%+ coverage across all metrics
- **Reports**: Generated in `coverage/` directory
- **Thresholds**: Branches, functions, lines, statements

## 🔒 Security

### Security Features
- **CSRF Protection**: Token-based CSRF protection
- **Rate Limiting**: Per-endpoint rate limiting with Redis
- **Input Validation**: Comprehensive Zod schema validation
- **Authentication**: Secure JWT-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Audit Logging**: Comprehensive security event logging

### Security Scanning
```bash
# Run security audit
npm run security:audit

# Fix vulnerabilities
npm run security:fix

# Snyk security scan
npm run security:scan
```

## 📊 Monitoring & Observability

### Health Checks
- **Liveness**: `/api/health` - Basic application health
- **Readiness**: `/api/ready` - Application readiness status
- **Metrics**: `/api/metrics` - Performance and business metrics

### Monitoring Features
- **Performance Metrics**: Response times, memory usage, request counts
- **Error Tracking**: Centralized error logging and alerting
- **Business Metrics**: User activity, feature usage, conversion rates
- **Health Monitoring**: Database connectivity, external API status

## 🚀 Deployment

### Vercel Deployment
1. **Connect to Vercel**
   ```bash
   vercel --prod
   ```

2. **Configure Environment Variables**
   Set all required environment variables in Vercel dashboard

3. **Deploy**
   ```bash
   git push origin main
   ```

### Docker Deployment
```bash
# Build image
docker build -t travel-agent .

# Run container
docker run -p 3000:3000 travel-agent
```

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build
npm run build
```

### Database Management
```bash
# Run migrations
npm run migrate

# Create backup
npm run backup:create

# Restore backup
npm run backup:restore
```

### External Services
- **Weather**: OpenWeatherMap API
- **Flights**: Amadeus API
- **Maps**: Google Maps API
- **Countries**: REST Countries API

## 📈 Performance

### Optimization Features
- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Multi-level caching strategy
- **Compression**: Gzip/Brotli compression
- **CDN**: Global asset delivery

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Webpack bundle analyzer
- **Performance Budgets**: Automated performance checks

## 🤝 Contributing

### Development Workflow
1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run test:ci
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature
   ```
7. **Create a Pull Request**

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages
- **Test Coverage**: 80%+ coverage required

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### User Management
- `GET /api/users` - Get all users (admin)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Itinerary Management
- `GET /api/itineraries` - Get user itineraries
- `POST /api/itineraries` - Create itinerary
- `GET /api/itineraries/[id]` - Get itinerary
- `PUT /api/itineraries/[id]` - Update itinerary
- `DELETE /api/itineraries/[id]` - Delete itinerary

### Chat Interface
- `GET /api/chat` - Get chat sessions
- `POST /api/chat` - Create chat session
- `GET /api/chat/[id]` - Get chat session
- `POST /api/chat/[id]/messages` - Add message

### AI Services
- `POST /api/ai/chat` - AI chat endpoint
- `POST /api/ai/itinerary` - Generate itinerary
- `GET /api/ai/search` - AI-powered search

### External APIs
- `GET /api/weather` - Get weather data
- `GET /api/flights` - Search flights
- `GET /api/places` - Search places
- `GET /api/directions` - Get directions
- `GET /api/countries` - Get country data

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Issues**
   - Verify environment variables
   - Check Firebase project configuration
   - Ensure service account permissions

2. **Authentication Problems**
   - Verify NextAuth configuration
   - Check Google OAuth settings
   - Ensure session secret is set

3. **API Rate Limiting**
   - Check external API quotas
   - Verify API keys are valid
   - Monitor rate limit usage

4. **Build Failures**
   - Run `npm run type-check`
   - Check for TypeScript errors
   - Verify all dependencies are installed

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Run with verbose output
npm run dev -- --verbose
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Firebase Team** - For the comprehensive backend services
- **Google AI** - For the Gemini AI capabilities
- **Vercel** - For the deployment platform
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support

- **Documentation**: [Wiki](https://github.com/your-username/travel-agent/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/travel-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/travel-agent/discussions)
- **Email**: support@travel-agent.com

---

**Built with ❤️ by the Travel Agent Team**