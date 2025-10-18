# Troubleshooting Guide

This guide helps you resolve common issues when setting up and running the AI Travel Agent application.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Environment Configuration](#environment-configuration)
3. [Firebase Setup](#firebase-setup)
4. [External API Issues](#external-api-issues)
5. [Authentication Problems](#authentication-problems)
6. [Build and Deployment Issues](#build-and-deployment-issues)
7. [Performance Issues](#performance-issues)
8. [Testing Issues](#testing-issues)
9. [Security Issues](#security-issues)
10. [Monitoring and Health Checks](#monitoring-and-health-checks)

## Installation Issues

### Node.js Version Issues

**Problem**: Build fails with Node.js version errors

**Solution**:
```bash
# Check your Node.js version
node --version

# Should be 18.0.0 or higher
# If not, update Node.js from https://nodejs.org/

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Dependency Installation Failures

**Problem**: `npm install` fails with dependency errors

**Solution**:
```bash
# Try with different package manager
yarn install

# Or use npm with legacy peer deps
npm install --legacy-peer-deps

# Clear all caches
npm cache clean --force
yarn cache clean
rm -rf node_modules package-lock.json yarn.lock
npm install
```

### TypeScript Compilation Errors

**Problem**: TypeScript compilation fails

**Solution**:
```bash
# Check TypeScript version
npx tsc --version

# Run type checking
npm run type-check

# Fix common issues:
# 1. Update @types packages
npm update @types/node @types/react @types/react-dom

# 2. Check tsconfig.json configuration
# 3. Ensure all imports are correct
```

## Environment Configuration

### Missing Environment Variables

**Problem**: Application fails to start due to missing environment variables

**Solution**:
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Ensure all required variables are set:
   ```env
   # Required
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-client-email
   FIREBASE_PRIVATE_KEY=your-private-key
   
   # External APIs
   OPENWEATHER_API_KEY=your-key
   AMADEUS_API_KEY=your-key
   AMADEUS_API_SECRET=your-secret
   GOOGLE_MAPS_API_KEY=your-key
   GOOGLE_GEMINI_API_KEY=your-key
   ```

3. Restart the development server:
   ```bash
   npm run dev
   ```

### Environment Variable Format Issues

**Problem**: Firebase private key format errors

**Solution**:
```env
# Correct format - include the entire key with newlines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Or use single line with \n for newlines
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

## Firebase Setup

### Firebase Authentication Issues

**Problem**: Authentication not working

**Solution**:
1. **Check Firebase Console**:
   - Go to Firebase Console → Authentication
   - Ensure Email/Password and Google providers are enabled
   - Check authorized domains include your domain

2. **Verify Service Account**:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate new private key if needed
   - Ensure the service account has proper permissions

3. **Check Firestore Rules**:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### Firestore Connection Issues

**Problem**: Cannot connect to Firestore

**Solution**:
```bash
# Check Firebase CLI
firebase --version

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Test connection
firebase emulators:start --only firestore
```

## External API Issues

### OpenWeatherMap API Issues

**Problem**: Weather data not loading

**Solution**:
1. **Check API Key**:
   ```bash
   # Test API key
   curl "http://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY"
   ```

2. **Verify API Limits**:
   - Check your API plan limits
   - Monitor usage in OpenWeatherMap dashboard
   - Consider upgrading if needed

3. **Check API Endpoint**:
   ```typescript
   // Ensure correct endpoint
   const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
   ```

### Amadeus API Issues

**Problem**: Flight search not working

**Solution**:
1. **Get Access Token**:
   ```bash
   curl -X POST "https://test.api.amadeus.com/v1/security/oauth2/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials&client_id=YOUR_API_KEY&client_secret=YOUR_API_SECRET"
   ```

2. **Check API Endpoints**:
   - Test API: `https://test.api.amadeus.com`
   - Production API: `https://api.amadeus.com`

3. **Verify Credentials**:
   - Ensure both API key and secret are correct
   - Check if you're using test or production environment

### Google Maps API Issues

**Problem**: Maps not loading or places not found

**Solution**:
1. **Enable Required APIs**:
   - Go to Google Cloud Console
   - Enable: Maps JavaScript API, Places API, Geocoding API, Directions API

2. **Check API Key Restrictions**:
   - Set HTTP referrers or IP restrictions
   - Ensure your domain is allowed

3. **Verify Billing**:
   - Ensure billing is enabled for your Google Cloud project
   - Check usage quotas

### Google Gemini AI Issues

**Problem**: AI features not working

**Solution**:
1. **Check API Key**:
   ```bash
   # Test API key
   curl -H "Content-Type: application/json" \
        -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY"
   ```

2. **Enable Gemini API**:
   - Go to Google AI Studio
   - Enable the Gemini API
   - Check usage limits

3. **Verify Model Access**:
   - Ensure you have access to the required models
   - Check if you're using the correct model names

## Authentication Problems

### NextAuth.js Issues

**Problem**: Authentication not working

**Solution**:
1. **Check NextAuth Configuration**:
   ```typescript
   // pages/api/auth/[...nextauth].ts
   export default NextAuth({
     providers: [
       GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
       }),
       CredentialsProvider({
         // ... configuration
       }),
     ],
     adapter: FirestoreAdapter({
       // ... Firebase configuration
     }),
   });
   ```

2. **Verify Environment Variables**:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Check Session Configuration**:
   ```typescript
   // Ensure session strategy is correct
   session: {
     strategy: 'jwt', // or 'database'
   },
   ```

### Google OAuth Issues

**Problem**: Google sign-in not working

**Solution**:
1. **Google Cloud Console Setup**:
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

2. **Check OAuth Consent Screen**:
   - Configure OAuth consent screen
   - Add required scopes
   - Verify app information

## Build and Deployment Issues

### Build Failures

**Problem**: `npm run build` fails

**Solution**:
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear Next.js cache
rm -rf .next

# Try building again
npm run build
```

### Vercel Deployment Issues

**Problem**: Deployment fails on Vercel

**Solution**:
1. **Check Build Logs**:
   - Go to Vercel dashboard
   - Check build logs for specific errors
   - Verify environment variables are set

2. **Environment Variables**:
   - Ensure all required environment variables are set in Vercel
   - Check variable names and values

3. **Build Configuration**:
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs"
   }
   ```

### Docker Issues

**Problem**: Docker build fails

**Solution**:
```dockerfile
# Ensure proper Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Performance Issues

### Slow API Responses

**Problem**: API endpoints are slow

**Solution**:
1. **Enable Caching**:
   ```typescript
   import { withCaching } from '@/lib/performance';
   
   export const GET = withCaching('api-cache', (req) => req.url)(handler);
   ```

2. **Check External API Limits**:
   - Monitor API response times
   - Implement retry logic
   - Consider API upgrades

3. **Database Optimization**:
   - Check Firestore query performance
   - Implement pagination
   - Use indexes for complex queries

### Memory Issues

**Problem**: High memory usage

**Solution**:
1. **Check Memory Usage**:
   ```bash
   # Monitor memory usage
   npm run dev
   # Check browser dev tools for memory leaks
   ```

2. **Optimize Components**:
   ```typescript
   // Use React.memo for expensive components
   const ExpensiveComponent = React.memo(({ data }) => {
     // Component logic
   });
   
   // Use useMemo for expensive calculations
   const expensiveValue = useMemo(() => {
     return calculateExpensiveValue(data);
   }, [data]);
   ```

## Testing Issues

### Test Failures

**Problem**: Tests are failing

**Solution**:
```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file
npm test -- --testPathPattern=health.test.ts

# Check test coverage
npm run test:coverage
```

### Mock Issues

**Problem**: Mocks not working correctly

**Solution**:
```typescript
// Ensure proper mock setup
jest.mock('@/services/external/weather.service', () => ({
  WeatherService: jest.fn().mockImplementation(() => ({
    getCurrentWeather: jest.fn(() => Promise.resolve(mockWeatherData)),
  })),
}));
```

### Environment Issues in Tests

**Problem**: Tests fail due to environment issues

**Solution**:
```javascript
// jest.setup.js
process.env.NEXTAUTH_SECRET = 'test-secret';
process.env.FIREBASE_PROJECT_ID = 'test-project';
// ... other test environment variables
```

## Security Issues

### CORS Issues

**Problem**: CORS errors in browser

**Solution**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
```

### Rate Limiting Issues

**Problem**: Rate limiting too aggressive

**Solution**:
```typescript
// lib/security/config.ts
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP',
};
```

## Monitoring and Health Checks

### Health Check Failures

**Problem**: Health checks failing

**Solution**:
1. **Check Individual Services**:
   ```bash
   # Test health endpoint
   curl http://localhost:3000/api/health
   
   # Check specific service
   curl http://localhost:3000/api/ready
   ```

2. **Verify External Dependencies**:
   - Check if external APIs are accessible
   - Verify database connections
   - Check Redis connection (if using)

### Metrics Not Collecting

**Problem**: Metrics not being collected

**Solution**:
```typescript
// Ensure metrics are being recorded
import { recordMetric } from '@/lib/monitoring';

// Record metrics in your code
recordMetric('api_response_time', responseTime);
recordMetric('api_requests', 1);
```

## Getting Help

If you're still experiencing issues:

1. **Check the logs**:
   ```bash
   # Development logs
   npm run dev
   
   # Production logs
   npm start
   ```

2. **Review the documentation**:
   - [API Documentation](API_DOCUMENTATION.md)
   - [Production Features](PRODUCTION_FEATURES.md)
   - [Security Guide](SECURITY_GUIDE.md)

3. **Create an issue**:
   - Include error messages
   - Provide steps to reproduce
   - Include environment details
   - Attach relevant logs

4. **Check external service status**:
   - [Firebase Status](https://status.firebase.google.com/)
   - [Google Cloud Status](https://status.cloud.google.com/)
   - [Vercel Status](https://www.vercel-status.com/)

## Common Error Messages

### "Module not found"
- Check if the module is installed
- Verify import paths
- Clear node_modules and reinstall

### "Authentication failed"
- Check API keys and secrets
- Verify OAuth configuration
- Check Firebase setup

### "Rate limit exceeded"
- Check API usage limits
- Implement proper rate limiting
- Consider API plan upgrades

### "Database connection failed"
- Check Firebase configuration
- Verify service account permissions
- Check Firestore rules

### "Build failed"
- Check TypeScript errors
- Verify all dependencies are installed
- Clear build cache

Remember to always check the latest documentation and keep your dependencies updated for the best experience.