# Testing Guide

This guide provides comprehensive instructions for testing the AI Travel Agent application, including unit tests, integration tests, end-to-end tests, and performance tests.

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Testing Strategy](#testing-strategy)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [Performance Testing](#performance-testing)
7. [Security Testing](#security-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [API Testing](#api-testing)
10. [Component Testing](#component-testing)
11. [Test Automation](#test-automation)
12. [Continuous Integration](#continuous-integration)
13. [Test Data Management](#test-data-management)
14. [Debugging Tests](#debugging-tests)
15. [Best Practices](#best-practices)

## Testing Overview

The AI Travel Agent application uses a comprehensive testing strategy to ensure reliability, performance, and security across all components.

### Testing Pyramid

```
                    ┌─────────────────┐
                    │   E2E Tests     │  ← Few, High-level
                    │   (Playwright)  │
                    └─────────────────┘
                  ┌─────────────────────┐
                  │ Integration Tests   │  ← Some, Medium-level
                  │   (Jest + MSW)     │
                  └─────────────────────┘
                ┌─────────────────────────┐
                │    Unit Tests          │  ← Many, Low-level
                │   (Jest + RTL)         │
                └─────────────────────────┘
```

### Testing Tools

| Tool | Purpose | Type | Coverage |
|------|---------|------|----------|
| Jest | Unit & Integration Tests | JavaScript | 80%+ |
| React Testing Library | Component Tests | React | 90%+ |
| Playwright | E2E Tests | Browser | 70%+ |
| MSW | API Mocking | Network | 100% |
| Lighthouse | Performance | Web | 90+ |
| axe-core | Accessibility | Web | 100% |
| Jest Coverage | Code Coverage | JavaScript | 80%+ |

## Testing Strategy

### Test Categories

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test interactions between components and services
3. **End-to-End Tests**: Test complete user workflows
4. **Performance Tests**: Test application performance under load
5. **Security Tests**: Test security vulnerabilities and compliance
6. **Accessibility Tests**: Test accessibility compliance (WCAG 2.1)

### Test Environment Setup

```bash
# Install testing dependencies
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @playwright/test \
  msw \
  jest \
  jest-environment-jsdom \
  @types/jest \
  @types/testing-library__jest-dom

# Install additional testing tools
npm install --save-dev \
  @storybook/test \
  @chromatic-html/jest-runner \
  lighthouse \
  axe-core \
  @axe-core/react
```

## Unit Testing

### Jest Configuration

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/services/(.*)$': '<rootDir>/services/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/jest.setup.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Jest Setup

```javascript
// jest.setup.js
import '@testing-library/jest-dom/extend-expect';

// Mock Next.js router
jest.mock('next/router', () => require('next-router-mock'));

// Mock NextAuth.js
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(() => Promise.resolve({ uid: 'test-user-id', role: 'user' })),
}));

// Mock Firebase
jest.mock('@/lib/firebase/admin', () => ({
  adminDb: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => ({
          exists: true,
          data: jest.fn(() => ({ userId: 'test-user-id' })),
        })),
        update: jest.fn(),
        set: jest.fn(),
        delete: jest.fn(),
      })),
      where: jest.fn(() => ({
        get: jest.fn(() => ({
          docs: [{ data: jest.fn(() => ({ id: 'test-id' })) }],
        })),
      })),
    })),
  },
}));

// Mock external APIs
jest.mock('@/services/external/weather.service', () => ({
  WeatherService: jest.fn().mockImplementation(() => ({
    getCurrentWeather: jest.fn(() => Promise.resolve({
      location: 'Test City',
      temperature: 20,
      conditions: 'Sunny',
    })),
  })),
}));

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
  })
);
```

### Unit Test Examples

#### Service Tests

```typescript
// __tests__/services/weather.service.test.ts
import { WeatherService } from '@/services/external/weather.service';

describe('WeatherService', () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
  });

  describe('getCurrentWeather', () => {
    it('should return weather data for valid location', async () => {
      const mockWeatherData = {
        location: 'London',
        temperature: 15,
        conditions: 'Cloudy',
        humidity: 70,
        windSpeed: 10,
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      });

      const result = await weatherService.getCurrentWeather('London');

      expect(result).toEqual(mockWeatherData);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('api.openweathermap.org'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should throw error for invalid location', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(weatherService.getCurrentWeather('InvalidCity')).rejects.toThrow(
        'Weather data not available'
      );
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(weatherService.getCurrentWeather('London')).rejects.toThrow(
        'Network error'
      );
    });
  });

  describe('getWeatherForecast', () => {
    it('should return forecast data for valid location', async () => {
      const mockForecastData = [
        { date: '2023-10-27', temperature: 16, conditions: 'Sunny' },
        { date: '2023-10-28', temperature: 14, conditions: 'Rainy' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockForecastData),
      });

      const result = await weatherService.getWeatherForecast('London', 2);

      expect(result).toEqual(mockForecastData);
      expect(result).toHaveLength(2);
    });
  });
});
```

#### Utility Function Tests

```typescript
// __tests__/lib/utils.test.ts
import { cn, formatDate, calculateDistance } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
      expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-10-27T10:30:00Z');
      expect(formatDate(date)).toBe('Oct 27, 2023');
    });

    it('should handle invalid dates', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      const point1 = { lat: 51.5074, lng: -0.1278 }; // London
      const point2 = { lat: 48.8566, lng: 2.3522 }; // Paris

      const distance = calculateDistance(point1, point2);
      expect(distance).toBeCloseTo(344, 0); // ~344 km
    });
  });
});
```

## Integration Testing

### API Integration Tests

```typescript
// __tests__/api/weather.test.ts
import { mockAppRouterRequest } from '@/lib/testing';
import { GET } from '@/app/api/weather/route';
import { WeatherService } from '@/services/external/weather.service';

jest.mock('@/services/external/weather.service');

describe('Weather API', () => {
  let mockGetCurrentWeather: jest.Mock;
  let mockGetWeatherForecast: jest.Mock;

  beforeEach(() => {
    mockGetCurrentWeather = jest.fn();
    mockGetWeatherForecast = jest.fn();
    
    (WeatherService as jest.Mock).mockImplementation(() => ({
      getCurrentWeather: mockGetCurrentWeather,
      getWeatherForecast: mockGetWeatherForecast,
    }));
  });

  describe('GET /api/weather', () => {
    it('should return current weather for valid location', async () => {
      mockGetCurrentWeather.mockResolvedValue({
        location: 'London',
        temperature: 15,
        conditions: 'Cloudy',
      });

      const response = await mockAppRouterRequest(GET, {
        query: { location: 'London', type: 'current' },
        userId: 'test-user',
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.location).toBe('London');
      expect(mockGetCurrentWeather).toHaveBeenCalledWith('London');
    });

    it('should return weather forecast for valid location', async () => {
      mockGetWeatherForecast.mockResolvedValue([
        { date: '2023-10-27', temperature: 16, conditions: 'Sunny' },
        { date: '2023-10-28', temperature: 14, conditions: 'Rainy' },
      ]);

      const response = await mockAppRouterRequest(GET, {
        query: { location: 'Paris', type: 'forecast', days: '2' },
        userId: 'test-user',
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(mockGetWeatherForecast).toHaveBeenCalledWith('Paris', 2);
    });

    it('should return 400 if location is missing', async () => {
      const response = await mockAppRouterRequest(GET, {
        query: { type: 'current' },
        userId: 'test-user',
      });

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Location parameter is required');
    });

    it('should return 401 if user is not authenticated', async () => {
      const response = await mockAppRouterRequest(GET, {
        query: { location: 'London', type: 'current' },
        // No userId provided
      });

      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized');
    });
  });
});
```

### Service Integration Tests

```typescript
// __tests__/services/itinerary.service.test.ts
import { ItineraryService } from '@/services/itinerary.service';
import { ItineraryGeneratorService } from '@/services/itinerary/itinerary-generator.service';

jest.mock('@/services/itinerary/itinerary-generator.service');

describe('ItineraryService Integration', () => {
  let itineraryService: ItineraryService;
  let mockGenerateItinerary: jest.Mock;

  beforeEach(() => {
    mockGenerateItinerary = jest.fn();
    
    (ItineraryGeneratorService as jest.Mock).mockImplementation(() => ({
      generateItinerary: mockGenerateItinerary,
    }));

    itineraryService = new ItineraryService();
  });

  describe('createItinerary', () => {
    it('should create itinerary with generated data', async () => {
      const mockGeneratedItinerary = {
        days: [
          {
            day: 1,
            date: '2023-10-27',
            theme: 'Arrival and Orientation',
            activities: [
              {
                id: 'activity-1',
                name: 'City Tour',
                description: 'Explore the city',
                location: {
                  name: 'City Center',
                  address: '123 Main St',
                  coordinates: { lat: 51.5074, lng: -0.1278 },
                },
                startTime: '09:00',
                endTime: '11:00',
                duration: '2 hours',
                cost: { amount: 50, currency: 'USD', perPerson: true },
                category: 'sightseeing',
                difficulty: 'easy',
                accessibility: {
                  wheelchairAccessible: true,
                  visualAccessibility: false,
                  hearingAccessibility: false,
                  cognitiveAccessibility: false,
                },
                sustainability: {
                  ecoFriendly: true,
                  carbonFootprint: 5,
                  localBusiness: true,
                  sustainableTransport: true,
                },
                requirements: ['Comfortable shoes'],
                tips: ['Bring water'],
                bookingRequired: true,
                bookingUrl: 'https://example.com/book',
              },
            ],
            meals: [],
            transportation: [],
            estimatedCost: 100,
            notes: ['Arrive early'],
          },
        ],
        totalCost: 100,
        sustainabilityScore: 85,
        accessibilityScore: 75,
        tags: ['london', 'sightseeing'],
      };

      mockGenerateItinerary.mockResolvedValue(mockGeneratedItinerary);

      const itineraryData = {
        title: 'London Adventure',
        destination: 'London',
        startDate: '2023-10-27',
        endDate: '2023-10-29',
        travelers: 2,
        budget: 1000,
        preferences: {
          interests: ['sightseeing', 'food'],
          travelStyle: { budget: 'mid-range' },
        },
      };

      const result = await itineraryService.createItinerary('test-user-id', itineraryData);

      expect(result).toBeDefined();
      expect(result.title).toBe('London Adventure');
      expect(result.destination).toBe('London');
      expect(result.days).toHaveLength(1);
      expect(result.days[0].activities).toHaveLength(1);
      expect(result.metadata.totalCost).toBe(100);
      expect(mockGenerateItinerary).toHaveBeenCalledWith(
        expect.objectContaining({
          destination: 'London',
          startDate: '2023-10-27',
          endDate: '2023-10-29',
          travelers: 2,
          budget: 1000,
          interests: ['sightseeing', 'food'],
          travelStyle: 'mid-range',
        })
      );
    });
  });
});
```

## End-to-End Testing

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to sign up', async ({ page }) => {
    await page.goto('/auth/signup');
    
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');
    
    await page.click('[data-testid="signup-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should allow user to sign in', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    
    await page.click('[data-testid="signin-button"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('should redirect unauthenticated user to signin', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL('/auth/signin');
  });
});
```

```typescript
// e2e/itinerary.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Itinerary Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/auth/signin');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="signin-button"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create a new itinerary', async ({ page }) => {
    await page.goto('/itinerary/new');
    
    // Fill in itinerary form
    await page.fill('[data-testid="title-input"]', 'London Adventure');
    await page.fill('[data-testid="destination-input"]', 'London');
    await page.fill('[data-testid="start-date-input"]', '2023-10-27');
    await page.fill('[data-testid="end-date-input"]', '2023-10-29');
    await page.fill('[data-testid="travelers-input"]', '2');
    await page.fill('[data-testid="budget-input"]', '1000');
    
    // Select interests
    await page.check('[data-testid="interest-sightseeing"]');
    await page.check('[data-testid="interest-food"]');
    
    // Select travel style
    await page.selectOption('[data-testid="travel-style-select"]', 'mid-range');
    
    // Submit form
    await page.click('[data-testid="create-itinerary-button"]');
    
    // Wait for itinerary to be created
    await expect(page).toHaveURL(/\/itinerary\/[a-zA-Z0-9]+/);
    await expect(page.locator('[data-testid="itinerary-title"]')).toContainText('London Adventure');
    await expect(page.locator('[data-testid="itinerary-destination"]')).toContainText('London');
  });

  test('should display itinerary details', async ({ page }) => {
    // Navigate to existing itinerary
    await page.goto('/itinerary/test-itinerary-id');
    
    await expect(page.locator('[data-testid="itinerary-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="itinerary-destination"]')).toBeVisible();
    await expect(page.locator('[data-testid="itinerary-dates"]')).toBeVisible();
    await expect(page.locator('[data-testid="itinerary-budget"]')).toBeVisible();
    
    // Check day tabs
    await expect(page.locator('[data-testid="day-tab-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="day-tab-2"]')).toBeVisible();
    
    // Check activities
    await expect(page.locator('[data-testid="activity-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="activity-item"]')).toHaveCount(2);
  });

  test('should allow editing itinerary', async ({ page }) => {
    await page.goto('/itinerary/test-itinerary-id');
    
    // Click edit button
    await page.click('[data-testid="edit-itinerary-button"]');
    
    // Modify title
    await page.fill('[data-testid="title-input"]', 'Updated London Adventure');
    
    // Save changes
    await page.click('[data-testid="save-itinerary-button"]');
    
    // Verify changes
    await expect(page.locator('[data-testid="itinerary-title"]')).toContainText('Updated London Adventure');
  });
});
```

## Performance Testing

### Lighthouse Performance Tests

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('should have good Lighthouse scores', async ({ page }) => {
    await page.goto('/');
    
    // Run Lighthouse audit
    const lighthouse = await page.evaluate(() => {
      return new Promise((resolve) => {
        // This would integrate with Lighthouse CI
        resolve({
          performance: 95,
          accessibility: 98,
          bestPractices: 92,
          seo: 90,
        });
      });
    });
    
    expect(lighthouse.performance).toBeGreaterThan(90);
    expect(lighthouse.accessibility).toBeGreaterThan(95);
    expect(lighthouse.bestPractices).toBeGreaterThan(90);
    expect(lighthouse.seo).toBeGreaterThan(85);
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000); // 3 seconds
  });

  test('should handle large datasets', async ({ page }) => {
    await page.goto('/itinerary/test-itinerary-id');
    
    // Wait for all content to load
    await page.waitForSelector('[data-testid="activity-list"]');
    
    // Check that all activities are rendered
    const activities = await page.locator('[data-testid="activity-item"]').count();
    expect(activities).toBeGreaterThan(0);
    
    // Check that scrolling works smoothly
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(1000);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
});
```

### Load Testing

```typescript
// e2e/load.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Load Testing', () => {
  test('should handle multiple concurrent users', async ({ browser }) => {
    const contexts = await Promise.all(
      Array.from({ length: 10 }, () => browser.newContext())
    );
    
    const pages = await Promise.all(
      contexts.map(context => context.newPage())
    );
    
    // All users navigate to the same page
    await Promise.all(
      pages.map(page => page.goto('/'))
    );
    
    // All users perform the same action
    await Promise.all(
      pages.map(page => page.click('[data-testid="create-itinerary-button"]'))
    );
    
    // Check that all pages loaded successfully
    for (const page of pages) {
      await expect(page).toHaveURL(/\/itinerary\/new/);
    }
    
    // Clean up
    await Promise.all(contexts.map(context => context.close()));
  });
});
```

## Security Testing

### Security Test Examples

```typescript
// __tests__/security/auth.test.ts
import { mockAppRouterRequest } from '@/lib/testing';
import { GET } from '@/app/api/user/route';

describe('Security Tests', () => {
  describe('Authentication', () => {
    it('should reject requests without valid token', async () => {
      const response = await mockAppRouterRequest(GET, {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      });

      expect(response.status).toBe(401);
    });

    it('should reject requests with expired token', async () => {
      const response = await mockAppRouterRequest(GET, {
        headers: {
          'Authorization': 'Bearer expired-token',
        },
      });

      expect(response.status).toBe(401);
    });

    it('should accept requests with valid token', async () => {
      const response = await mockAppRouterRequest(GET, {
        userId: 'valid-user-id',
        userRole: 'user',
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Authorization', () => {
    it('should reject admin requests from regular users', async () => {
      const response = await mockAppRouterRequest(GET, {
        userId: 'regular-user-id',
        userRole: 'user',
        url: '/api/admin/users',
      });

      expect(response.status).toBe(403);
    });

    it('should accept admin requests from admin users', async () => {
      const response = await mockAppRouterRequest(GET, {
        userId: 'admin-user-id',
        userRole: 'admin',
        url: '/api/admin/users',
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Input Validation', () => {
    it('should reject malicious input', async () => {
      const response = await mockAppRouterRequest(GET, {
        query: {
          location: '<script>alert("xss")</script>',
        },
      });

      expect(response.status).toBe(400);
    });

    it('should sanitize user input', async () => {
      const response = await mockAppRouterRequest(GET, {
        query: {
          location: 'London<script>alert("xss")</script>',
        },
      });

      const data = await response.json();
      expect(data.data.location).not.toContain('<script>');
    });
  });
});
```

## Accessibility Testing

### Accessibility Test Examples

```typescript
// __tests__/accessibility/button.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '@/components/ui/button';

expect.extend(toHaveNoViolations);

describe('Button Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA attributes', () => {
    render(<Button aria-label="Close dialog">×</Button>);
    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button).toBeInTheDocument();
  });

  it('should be keyboard accessible', () => {
    render(<Button>Submit</Button>);
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('tabindex', '0');
  });
});
```

```typescript
// e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('should have good accessibility scores', async ({ page }) => {
    await page.goto('/');
    
    // Run accessibility audit
    const accessibilityResults = await page.evaluate(() => {
      return new Promise((resolve) => {
        // This would integrate with axe-core
        resolve({
          violations: [],
          passes: 50,
          incomplete: 0,
        });
      });
    });
    
    expect(accessibilityResults.violations).toHaveLength(0);
    expect(accessibilityResults.passes).toBeGreaterThan(40);
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    await page.keyboard.press('Enter');
    // Should trigger the focused element
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/itinerary/new');
    
    // Focus should be on the first input
    await expect(page.locator('[data-testid="title-input"]')).toBeFocused();
    
    // Tab should move focus to next input
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-testid="destination-input"]')).toBeFocused();
  });
});
```

## API Testing

### API Test Examples

```typescript
// __tests__/api/itinerary.test.ts
import { mockAppRouterRequest } from '@/lib/testing';
import { GET, POST, PUT, DELETE } from '@/app/api/itinerary/route';

describe('Itinerary API', () => {
  describe('GET /api/itinerary', () => {
    it('should return user itineraries', async () => {
      const response = await mockAppRouterRequest(GET, {
        userId: 'test-user-id',
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    it('should return 401 for unauthenticated requests', async () => {
      const response = await mockAppRouterRequest(GET);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/itinerary', () => {
    it('should create new itinerary', async () => {
      const itineraryData = {
        title: 'Test Itinerary',
        destination: 'London',
        startDate: '2023-10-27',
        endDate: '2023-10-29',
        travelers: 2,
        budget: 1000,
        preferences: {
          interests: ['sightseeing'],
          travelStyle: { budget: 'mid-range' },
        },
      };

      const response = await mockAppRouterRequest(POST, {
        body: itineraryData,
        userId: 'test-user-id',
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Itinerary');
    });

    it('should validate required fields', async () => {
      const response = await mockAppRouterRequest(POST, {
        body: { title: 'Test' }, // Missing required fields
        userId: 'test-user-id',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/itinerary/[id]', () => {
    it('should update existing itinerary', async () => {
      const updateData = {
        title: 'Updated Itinerary',
      };

      const response = await mockAppRouterRequest(PUT, {
        body: updateData,
        userId: 'test-user-id',
        params: { id: 'test-itinerary-id' },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Updated Itinerary');
    });

    it('should return 404 for non-existent itinerary', async () => {
      const response = await mockAppRouterRequest(PUT, {
        body: { title: 'Updated' },
        userId: 'test-user-id',
        params: { id: 'non-existent-id' },
      });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/itinerary/[id]', () => {
    it('should delete existing itinerary', async () => {
      const response = await mockAppRouterRequest(DELETE, {
        userId: 'test-user-id',
        params: { id: 'test-itinerary-id' },
      });

      expect(response.status).toBe(200);
    });

    it('should return 404 for non-existent itinerary', async () => {
      const response = await mockAppRouterRequest(DELETE, {
        userId: 'test-user-id',
        params: { id: 'non-existent-id' },
      });

      expect(response.status).toBe(404);
    });
  });
});
```

## Component Testing

### Component Test Examples

```typescript
// __tests__/components/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary text-primary-foreground');
  });

  it('renders with different variants', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button', { name: /secondary button/i });
    expect(button).toHaveClass('bg-secondary text-secondary-foreground');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Test Click</Button>);
    const button = screen.getByRole('button', { name: /test click/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading...</Button>);
    const button = screen.getByRole('button', { name: /loading.../i });
    expect(button).toBeDisabled();
  });
});
```

```typescript
// __tests__/components/ItineraryForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItineraryForm } from '@/components/ItineraryForm';

describe('ItineraryForm', () => {
  it('renders all form fields', () => {
    render(<ItineraryForm onSubmit={jest.fn()} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/travelers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/budget/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<ItineraryForm onSubmit={jest.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /create itinerary/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/destination is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockSubmit = jest.fn();
    render(<ItineraryForm onSubmit={mockSubmit} />);
    
    await user.type(screen.getByLabelText(/title/i), 'Test Itinerary');
    await user.type(screen.getByLabelText(/destination/i), 'London');
    await user.type(screen.getByLabelText(/start date/i), '2023-10-27');
    await user.type(screen.getByLabelText(/end date/i), '2023-10-29');
    await user.type(screen.getByLabelText(/travelers/i), '2');
    await user.type(screen.getByLabelText(/budget/i), '1000');
    
    const submitButton = screen.getByRole('button', { name: /create itinerary/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        title: 'Test Itinerary',
        destination: 'London',
        startDate: '2023-10-27',
        endDate: '2023-10-29',
        travelers: 2,
        budget: 1000,
        preferences: {
          interests: [],
          travelStyle: { budget: 'mid-range' },
        },
      });
    });
  });
});
```

## Test Automation

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18, 20]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run unit tests
      run: npm run test:ci
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella

  e2e:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload E2E test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

  performance:
    runs-on: ubuntu-latest
    needs: test
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run performance tests
      run: npm run test:performance
    
    - name: Upload performance results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: performance-results
        path: performance-results/
        retention-days: 30
```

## Continuous Integration

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test:ci"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### Test Scripts

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:unit": "jest --testPathPattern=__tests__/unit",
    "test:integration": "jest --testPathPattern=__tests__/integration",
    "test:api": "jest --testPathPattern=__tests__/api",
    "test:components": "jest --testPathPattern=__tests__/components",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:ci && npm run test:e2e",
    "test:performance": "jest --testPathPattern=__tests__/performance",
    "test:security": "jest --testPathPattern=__tests__/security",
    "test:accessibility": "jest --testPathPattern=__tests__/accessibility"
  }
}
```

## Test Data Management

### Test Data Setup

```typescript
// __tests__/fixtures/test-data.ts
export const testUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

export const testItinerary = {
  id: 'test-itinerary-id',
  userId: 'test-user-id',
  title: 'Test Itinerary',
  destination: 'London',
  startDate: new Date('2023-10-27'),
  endDate: new Date('2023-10-29'),
  travelers: 2,
  budget: 1000,
  status: 'draft',
  days: [
    {
      day: 1,
      date: new Date('2023-10-27'),
      theme: 'Arrival and Orientation',
      activities: [
        {
          id: 'activity-1',
          name: 'City Tour',
          type: 'attraction',
          description: 'Explore the city',
          location: {
            name: 'City Center',
            address: '123 Main St',
            city: 'London',
            country: 'UK',
            coordinates: { lat: 51.5074, lng: -0.1278 },
          },
          duration: 120,
          cost: 50,
          rating: 4.5,
          bookingRequired: true,
          accessibility: {
            wheelchairAccessible: true,
            visualAccessibility: false,
            hearingAccessibility: false,
            cognitiveAccessibility: false,
          },
          sustainability: {
            ecoFriendly: true,
            carbonFootprint: 5,
            localBusiness: true,
            sustainableTransport: true,
          },
          timeSlot: {
            start: '09:00',
            end: '11:00',
            flexible: false,
          },
        },
      ],
      estimatedCost: 100,
      notes: 'Arrive early to explore the surroundings.',
    },
  ],
  metadata: {
    totalCost: 100,
    sustainabilityScore: 85,
    accessibilityScore: 75,
    tags: ['london', 'sightseeing'],
    source: 'ai-generated',
    version: 1,
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

export const testWeatherData = {
  location: 'London',
  temperature: 15,
  conditions: 'Cloudy',
  humidity: 70,
  windSpeed: 10,
  description: 'Overcast clouds',
  icon: '04d',
  timestamp: new Date('2023-10-27T10:00:00Z'),
};
```

### Mock Data Setup

```typescript
// __tests__/mocks/mock-data.ts
export const mockWeatherService = {
  getCurrentWeather: jest.fn(() => Promise.resolve({
    location: 'London',
    temperature: 15,
    conditions: 'Cloudy',
  })),
  getWeatherForecast: jest.fn(() => Promise.resolve([
    { date: '2023-10-27', temperature: 16, conditions: 'Sunny' },
    { date: '2023-10-28', temperature: 14, conditions: 'Rainy' },
  ])),
};

export const mockItineraryService = {
  createItinerary: jest.fn(() => Promise.resolve(testItinerary)),
  getItineraryById: jest.fn(() => Promise.resolve(testItinerary)),
  updateItinerary: jest.fn(() => Promise.resolve(testItinerary)),
  deleteItinerary: jest.fn(() => Promise.resolve(true)),
  listItineraries: jest.fn(() => Promise.resolve([testItinerary])),
};
```

## Debugging Tests

### Debug Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Jest Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "--no-cache", "--no-coverage"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    },
    {
      "name": "Debug Playwright Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/playwright",
      "args": ["test", "--debug"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Debug Commands

```bash
# Debug Jest tests
npm run test -- --runInBand --no-cache --no-coverage

# Debug specific test file
npm run test -- --testNamePattern="Button" --runInBand

# Debug Playwright tests
npx playwright test --debug

# Debug specific Playwright test
npx playwright test auth.spec.ts --debug
```

## Best Practices

### 1. Test Organization

- **Group related tests** using `describe` blocks
- **Use descriptive test names** that explain what is being tested
- **Follow the AAA pattern**: Arrange, Act, Assert
- **Keep tests focused** on a single behavior
- **Use consistent naming conventions**

### 2. Test Data

- **Use factories** for creating test data
- **Keep test data minimal** and focused
- **Use realistic data** that represents real-world scenarios
- **Clean up test data** after each test

### 3. Mocking

- **Mock external dependencies** to isolate units under test
- **Use MSW** for API mocking in integration tests
- **Mock at the right level** (not too high, not too low)
- **Verify mock interactions** when necessary

### 4. Assertions

- **Use specific assertions** instead of generic ones
- **Test both positive and negative cases**
- **Verify error conditions** and edge cases
- **Use meaningful error messages**

### 5. Performance

- **Run tests in parallel** when possible
- **Use appropriate test timeouts**
- **Clean up resources** after tests
- **Avoid unnecessary setup/teardown**

### 6. Maintenance

- **Keep tests up to date** with code changes
- **Refactor tests** when refactoring code
- **Remove obsolete tests** and test data
- **Monitor test performance** and optimize slow tests

## Conclusion

This testing guide provides comprehensive coverage of testing strategies for the AI Travel Agent application. By following these practices and using the provided examples, you can ensure the reliability, performance, and security of your application.

For additional support, refer to the [Troubleshooting Guide](TROUBLESHOOTING.md) or contact the development team.