# Performance Guide

This guide provides comprehensive information about performance optimization in the AI Travel Agent application, including best practices, monitoring, and optimization techniques.

## Table of Contents

1. [Performance Overview](#performance-overview)
2. [Frontend Performance](#frontend-performance)
3. [Backend Performance](#backend-performance)
4. [Database Performance](#database-performance)
5. [API Performance](#api-performance)
6. [Caching Strategies](#caching-strategies)
7. [Image Optimization](#image-optimization)
8. [Bundle Optimization](#bundle-optimization)
9. [Performance Monitoring](#performance-monitoring)
10. [Performance Testing](#performance-testing)
11. [Performance Best Practices](#performance-best-practices)

## Performance Overview

The AI Travel Agent application is designed for optimal performance across all components, from frontend rendering to backend API responses.

### Performance Goals

- **First Contentful Paint (FCP)**: < 1.5 seconds
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1
- **API Response Time**: < 200 milliseconds
- **Database Query Time**: < 50 milliseconds
- **Cache Hit Rate**: > 90%

### Performance Metrics

```typescript
// Performance metrics interface
interface PerformanceMetrics {
  // Core Web Vitals
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  
  // Custom metrics
  apiResponseTime: number;
  databaseQueryTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  cpuUsage: number;
}
```

## Frontend Performance

### React Performance Optimization

#### Component Optimization

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }: { data: any }) => {
  return (
    <div>
      {data.map(item => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
});

// Use useMemo for expensive calculations
function ItineraryList({ itineraries }: { itineraries: Itinerary[] }) {
  const sortedItineraries = useMemo(() => {
    return itineraries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [itineraries]);

  return (
    <div>
      {sortedItineraries.map(itinerary => (
        <ItineraryCard key={itinerary.id} itinerary={itinerary} />
      ))}
    </div>
  );
}

// Use useCallback for event handlers
function ItineraryForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const handleSubmit = useCallback((data: any) => {
    onSubmit(data);
  }, [onSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

#### Virtual Scrolling

```typescript
// Use virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

function VirtualizedItineraryList({ itineraries }: { itineraries: Itinerary[] }) {
  const Row = ({ index, style }: { index: number; style: any }) => (
    <div style={style}>
      <ItineraryCard itinerary={itineraries[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={itineraries.length}
      itemSize={200}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

#### Lazy Loading

```typescript
// Lazy load components
const ChatInterface = lazy(() => import('@/components/features/ChatInterface'));
const ItineraryEditor = lazy(() => import('@/components/features/ItineraryEditor'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/itineraries/:id/edit" element={<ItineraryEditor />} />
      </Routes>
    </Suspense>
  );
}
```

### Next.js Performance Optimization

#### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <div className="card">
      <Image
        src={destination.image}
        alt={destination.name}
        width={300}
        height={200}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        priority={false}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
```

#### Dynamic Imports

```typescript
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), {
  loading: () => <div>Loading map...</div>,
  ssr: false, // Disable SSR for client-only components
});

const ChartComponent = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Loading chart...</div>,
});
```

#### Prefetching

```typescript
// Prefetch important pages
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/dashboard" prefetch={true}>
        Dashboard
      </Link>
      <Link href="/itineraries" prefetch={true}>
        Itineraries
      </Link>
      <Link href="/chat" prefetch={false}>
        Chat
      </Link>
    </nav>
  );
}
```

### CSS Performance

#### Tailwind CSS Optimization

```typescript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom theme extensions
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  // Purge unused CSS in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
  },
};
```

#### Critical CSS

```typescript
// Extract critical CSS
import { extractCritical } from '@emotion/server';

export function getServerSideProps() {
  const { html, css, ids } = extractCritical(html);
  
  return {
    props: {
      html,
      css,
      ids,
    },
  };
}
```

## Backend Performance

### API Route Optimization

#### Response Optimization

```typescript
// Optimize API responses
export const GET = async (req: NextRequest) => {
  const startTime = Date.now();
  
  try {
    // Fetch data
    const data = await fetchData();
    
    // Compress response
    const response = NextResponse.json(data);
    response.headers.set('Content-Encoding', 'gzip');
    
    // Add performance headers
    const responseTime = Date.now() - startTime;
    response.headers.set('X-Response-Time', `${responseTime}ms`);
    
    return response;
  } catch (error) {
    // Handle errors efficiently
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
```

#### Database Query Optimization

```typescript
// Optimize database queries
export class ItineraryService {
  async getItineraries(userId: string, limit: number = 10): Promise<Itinerary[]> {
    // Use indexes for efficient queries
    const query = adminDb
      .collection('itineraries')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as Itinerary);
  }
  
  async getItineraryWithDays(id: string): Promise<Itinerary | null> {
    // Use batch reads for related data
    const [itineraryDoc, daysSnapshot] = await Promise.all([
      adminDb.collection('itineraries').doc(id).get(),
      adminDb.collection('itineraries').doc(id).collection('days').get(),
    ]);
    
    if (!itineraryDoc.exists) {
      return null;
    }
    
    const itinerary = itineraryDoc.data() as Itinerary;
    itinerary.days = daysSnapshot.docs.map(doc => doc.data() as Day);
    
    return itinerary;
  }
}
```

### Memory Management

#### Memory Optimization

```typescript
// Optimize memory usage
export class MemoryOptimizer {
  private cache = new Map<string, any>();
  private maxCacheSize = 1000;
  
  set(key: string, value: any): void {
    // Implement LRU cache
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, value);
  }
  
  get(key: string): any {
    const value = this.cache.get(key);
    if (value) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  clear(): void {
    this.cache.clear();
  }
}
```

#### Garbage Collection

```typescript
// Monitor garbage collection
export function monitorGarbageCollection() {
  if (process.env.NODE_ENV === 'development') {
    const gc = require('gc-stats')();
    
    gc.on('stats', (stats: any) => {
      console.log('GC Stats:', {
        pause: stats.pause,
        pauseMS: stats.pauseMS,
        gctype: stats.gctype,
        before: stats.before,
        after: stats.after,
      });
    });
  }
}
```

## Database Performance

### Firestore Optimization

#### Query Optimization

```typescript
// Optimize Firestore queries
export class OptimizedItineraryService {
  // Use composite indexes
  async getItinerariesByStatusAndDate(
    userId: string,
    status: string,
    startDate: Date
  ): Promise<Itinerary[]> {
    const query = adminDb
      .collection('itineraries')
      .where('userId', '==', userId)
      .where('status', '==', status)
      .where('startDate', '>=', startDate)
      .orderBy('startDate', 'asc')
      .limit(50);
    
    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as Itinerary);
  }
  
  // Use batch operations
  async createItineraryWithDays(
    itineraryData: ItineraryData,
    daysData: DayData[]
  ): Promise<void> {
    const batch = adminDb.batch();
    
    const itineraryRef = adminDb.collection('itineraries').doc();
    batch.set(itineraryRef, itineraryData);
    
    daysData.forEach(dayData => {
      const dayRef = itineraryRef.collection('days').doc();
      batch.set(dayRef, dayData);
    });
    
    await batch.commit();
  }
}
```

#### Caching Strategy

```typescript
// Implement database caching
export class CachedItineraryService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  async getItinerary(id: string): Promise<Itinerary | null> {
    const cached = this.cache.get(id);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    const itinerary = await this.fetchItinerary(id);
    
    if (itinerary) {
      this.cache.set(id, {
        data: itinerary,
        timestamp: Date.now(),
      });
    }
    
    return itinerary;
  }
  
  private async fetchItinerary(id: string): Promise<Itinerary | null> {
    const doc = await adminDb.collection('itineraries').doc(id).get();
    return doc.exists ? (doc.data() as Itinerary) : null;
  }
}
```

## API Performance

### Response Time Optimization

#### API Middleware

```typescript
// Performance monitoring middleware
export function withPerformanceMonitoring(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const startTime = Date.now();
    
    try {
      const response = await handler(req, context);
      
      const responseTime = Date.now() - startTime;
      
      // Log performance metrics
      console.log(`API ${req.method} ${req.url} - ${responseTime}ms`);
      
      // Add performance headers
      response.headers.set('X-Response-Time', `${responseTime}ms`);
      
      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error(`API Error ${req.method} ${req.url} - ${responseTime}ms`, error);
      throw error;
    }
  };
}
```

#### Request Optimization

```typescript
// Optimize request handling
export const GET = withPerformanceMonitoring(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get('location');
  const type = searchParams.get('type') || 'current';
  
  // Validate input early
  if (!location) {
    return NextResponse.json(
      { error: 'Location parameter is required' },
      { status: 400 }
    );
  }
  
  // Use Promise.all for parallel requests
  const [weatherData, forecastData] = await Promise.all([
    weatherService.getCurrentWeather(location),
    weatherService.getWeatherForecast(location, 3),
  ]);
  
  return NextResponse.json({
    success: true,
    data: { current: weatherData, forecast: forecastData },
    timestamp: new Date().toISOString(),
  });
});
```

## Caching Strategies

### Multi-Level Caching

#### Application-Level Caching

```typescript
// Application-level cache
export class ApplicationCache {
  private memoryCache = new Map<string, any>();
  private redisCache: Redis;
  
  constructor() {
    this.redisCache = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }
    
    // Check Redis cache
    const redisValue = await this.redisCache.get(key);
    if (redisValue) {
      this.memoryCache.set(key, redisValue);
      return redisValue;
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    // Set in memory cache
    this.memoryCache.set(key, value);
    
    // Set in Redis cache
    await this.redisCache.set(key, value, { ex: ttl });
  }
}
```

#### CDN Caching

```typescript
// CDN caching configuration
export function withCDNCaching(handler: Function) {
  return async (req: NextRequest, context: any) => {
    const response = await handler(req, context);
    
    // Set CDN cache headers
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    response.headers.set('CDN-Cache-Control', 'max-age=86400');
    
    return response;
  };
}
```

### Cache Invalidation

```typescript
// Cache invalidation strategy
export class CacheInvalidator {
  private cache: ApplicationCache;
  
  constructor(cache: ApplicationCache) {
    this.cache = cache;
  }
  
  async invalidateItinerary(userId: string, itineraryId?: string): Promise<void> {
    const patterns = [
      `itineraries:${userId}:*`,
      `itineraries:${userId}:list`,
    ];
    
    if (itineraryId) {
      patterns.push(`itinerary:${itineraryId}`);
    }
    
    await Promise.all(
      patterns.map(pattern => this.cache.deletePattern(pattern))
    );
  }
  
  async invalidateWeather(location: string): Promise<void> {
    const patterns = [
      `weather:${location}:*`,
      `weather:${location}:current`,
      `weather:${location}:forecast`,
    ];
    
    await Promise.all(
      patterns.map(pattern => this.cache.deletePattern(pattern))
    );
  }
}
```

## Image Optimization

### Next.js Image Optimization

```typescript
// Optimized image component
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  quality?: number;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  quality = 75,
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      onLoad={() => console.log('Image loaded')}
      onError={() => console.error('Image failed to load')}
    />
  );
}
```

### Image Lazy Loading

```typescript
// Lazy loading hook
export function useLazyLoading() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return { ref, isIntersecting };
}
```

## Bundle Optimization

### Code Splitting

```typescript
// Dynamic imports for code splitting
const ChatInterface = dynamic(() => import('@/components/features/ChatInterface'), {
  loading: () => <div>Loading chat...</div>,
  ssr: false,
});

const ItineraryEditor = dynamic(() => import('@/components/features/ItineraryEditor'), {
  loading: () => <div>Loading editor...</div>,
});

const MapComponent = dynamic(() => import('@/components/features/Map'), {
  loading: () => <div>Loading map...</div>,
  ssr: false,
});
```

### Bundle Analysis

```typescript
// Bundle analysis configuration
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Next.js configuration
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
});
```

## Performance Monitoring

### Real-Time Monitoring

```typescript
// Performance monitoring service
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
  }
  
  getMetrics(): Record<string, { avg: number; min: number; max: number }> {
    const result: Record<string, { avg: number; min: number; max: number }> = {};
    
    this.metrics.forEach((values, name) => {
      const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      result[name] = { avg, min, max };
    });
    
    return result;
  }
}
```

### Web Vitals Monitoring

```typescript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric: any) {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Send to Google Analytics
    gtag('event', metric.name, {
      value: Math.round(metric.value),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
}

// Initialize Web Vitals monitoring
getCLS(reportWebVitals);
getFID(reportWebVitals);
getFCP(reportWebVitals);
getLCP(reportWebVitals);
getTTFB(reportWebVitals);
```

## Performance Testing

### Load Testing

```typescript
// Load testing with Playwright
import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should load dashboard within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000);
  });
  
  test('should handle multiple concurrent requests', async ({ browser }) => {
    const context = await browser.newContext();
    const pages = await Promise.all([
      context.newPage(),
      context.newPage(),
      context.newPage(),
    ]);
    
    const startTime = Date.now();
    await Promise.all(pages.map(page => page.goto('/api/health')));
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000);
    
    await context.close();
  });
});
```

### Performance Budget

```typescript
// Performance budget configuration
export const performanceBudget = {
  // Bundle size limits
  bundleSize: {
    max: 250 * 1024, // 250KB
    warning: 200 * 1024, // 200KB
  },
  
  // API response time limits
  apiResponseTime: {
    max: 500, // 500ms
    warning: 300, // 300ms
  },
  
  // Database query time limits
  databaseQueryTime: {
    max: 100, // 100ms
    warning: 50, // 50ms
  },
  
  // Memory usage limits
  memoryUsage: {
    max: 100 * 1024 * 1024, // 100MB
    warning: 80 * 1024 * 1024, // 80MB
  },
};
```

## Performance Best Practices

### Development Best Practices

1. **Code Splitting**: Split code into smaller chunks
2. **Lazy Loading**: Load components and data on demand
3. **Memoization**: Use React.memo and useMemo for expensive operations
4. **Virtual Scrolling**: Use virtual scrolling for large lists
5. **Image Optimization**: Optimize images and use appropriate formats

### Production Best Practices

1. **CDN Usage**: Use CDN for static assets
2. **Caching**: Implement multi-level caching
3. **Compression**: Enable gzip/brotli compression
4. **Database Optimization**: Optimize database queries and indexes
5. **Monitoring**: Monitor performance metrics continuously

### Monitoring Best Practices

1. **Real-Time Monitoring**: Monitor performance in real-time
2. **Alerting**: Set up alerts for performance degradation
3. **Regular Audits**: Conduct regular performance audits
4. **User Experience**: Monitor user experience metrics
5. **Continuous Improvement**: Continuously improve performance

## Conclusion

This performance guide provides comprehensive information about optimizing the AI Travel Agent application for maximum performance. Regular monitoring and optimization are essential for maintaining a fast and responsive user experience.

For additional performance resources, refer to:
- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance Documentation](https://react.dev/learn/render-and-commit)
- [Web Vitals Documentation](https://web.dev/vitals/)
- [Firebase Performance Documentation](https://firebase.google.com/docs/perf-mon)
