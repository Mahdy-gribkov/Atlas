import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    entries: jest.fn(),
    forEach: jest.fn(),
    toString: jest.fn(),
  }),
  usePathname: () => '/test-path',
}));

jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
    status: 'authenticated',
  }),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
}));

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(() => Promise.resolve({
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  })),
}));

// Mock Firebase modules
jest.mock('@/lib/firebase/client', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-id',
      email: 'test@example.com',
      displayName: 'Test User',
    },
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
        orderBy: jest.fn(() => ({
          get: jest.fn(),
          limit: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
      get: jest.fn(),
    })),
  },
  storage: {
    ref: jest.fn(() => ({
      put: jest.fn(),
      getDownloadURL: jest.fn(),
      delete: jest.fn(),
    })),
  },
}));

jest.mock('@/lib/firebase/admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(),
        set: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })),
      add: jest.fn(),
      where: jest.fn(() => ({
        get: jest.fn(),
        limit: jest.fn(() => ({
          get: jest.fn(),
        })),
        orderBy: jest.fn(() => ({
          get: jest.fn(),
          limit: jest.fn(() => ({
            get: jest.fn(),
          })),
        })),
      })),
      get: jest.fn(),
    })),
    batch: jest.fn(() => ({
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn(),
    })),
  },
}));

// Mock external API services
jest.mock('@/services/external/weather.service', () => ({
  WeatherService: jest.fn().mockImplementation(() => ({
    getCurrentWeather: jest.fn(),
    getWeatherForecast: jest.fn(),
    getWeatherByCoordinates: jest.fn(),
  })),
}));

jest.mock('@/services/external/flight.service', () => ({
  FlightService: jest.fn().mockImplementation(() => ({
    searchFlights: jest.fn(),
    getFlightOffers: jest.fn(),
    getFlightDetails: jest.fn(),
  })),
}));

jest.mock('@/services/external/maps.service', () => ({
  MapsService: jest.fn().mockImplementation(() => ({
    searchPlaces: jest.fn(),
    getPlaceDetails: jest.fn(),
    getDirections: jest.fn(),
    getDistanceMatrix: jest.fn(),
  })),
}));

jest.mock('@/services/external/countries.service', () => ({
  CountriesService: jest.fn().mockImplementation(() => ({
    getAllCountries: jest.fn(),
    getCountryByCode: jest.fn(),
    searchCountries: jest.fn(),
  })),
}));

// Mock AI services
jest.mock('@/services/ai/gemini.service', () => ({
  GeminiService: jest.fn().mockImplementation(() => ({
    generateText: jest.fn(),
    generateResponse: jest.fn(),
    generateItinerary: jest.fn(),
    generateEmbedding: jest.fn(),
  })),
}));

jest.mock('@/services/ai/vector.service', () => ({
  VectorService: jest.fn().mockImplementation(() => ({
    initializeIndex: jest.fn(),
    embedDocument: jest.fn(),
    searchSimilar: jest.fn(),
    addDocument: jest.fn(),
    deleteDocument: jest.fn(),
  })),
}));

// Mock security services
jest.mock('@/lib/security/rate-limit', () => ({
  RateLimiter: jest.fn().mockImplementation(() => ({
    checkLimit: jest.fn(() => Promise.resolve(true)),
    increment: jest.fn(),
    reset: jest.fn(),
  })),
  withRateLimit: jest.fn(() => jest.fn()),
}));

jest.mock('@/lib/security/audit', () => ({
  logAuditEvent: jest.fn(),
  AuditAction: {
    LOGIN: 'LOGIN',
    LOGOUT: 'LOGOUT',
    CREATE_ITINERARY: 'CREATE_ITINERARY',
    UPDATE_ITINERARY: 'UPDATE_ITINERARY',
    DELETE_ITINERARY: 'DELETE_ITINERARY',
    CHAT_MESSAGE: 'CHAT_MESSAGE',
    UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
  },
}));

// Mock monitoring services
jest.mock('@/lib/monitoring/metrics', () => ({
  MetricsCollector: jest.fn().mockImplementation(() => ({
    incrementRequest: jest.fn(),
    incrementError: jest.fn(),
    recordPerformance: jest.fn(),
    recordMetric: jest.fn(),
    getMetrics: jest.fn(),
  })),
  withMetrics: jest.fn(() => jest.fn()),
}));

jest.mock('@/lib/monitoring/health-check', () => ({
  HealthChecker: jest.fn().mockImplementation(() => ({
    checkHealth: jest.fn(),
    checkReadiness: jest.fn(),
    getHealthStatus: jest.fn(),
  })),
  handleHealthCheck: jest.fn(),
  handleReadinessCheck: jest.fn(),
}));

// Mock error handling
jest.mock('@/lib/error-handling/error-handler', () => ({
  ErrorHandler: jest.fn().mockImplementation(() => ({
    handleError: jest.fn(),
    logError: jest.fn(),
    trackError: jest.fn(),
    checkForAlerts: jest.fn(),
  })),
}));

// Mock performance services
jest.mock('@/lib/performance/cache', () => ({
  CacheManager: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    getStats: jest.fn(),
  })),
  cacheManager: {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  clear: jest.fn(),
    getStats: jest.fn(),
  },
  withCaching: jest.fn(() => jest.fn()),
  cached: jest.fn(() => jest.fn()),
}));

jest.mock('@/lib/performance/optimization', () => ({
  PerformanceOptimizer: jest.fn().mockImplementation(() => ({
    optimizeRequest: jest.fn(),
    compressResponse: jest.fn(),
    addCacheHeaders: jest.fn(),
    optimizeImages: jest.fn(),
  })),
  performanceOptimizer: {
    optimizeRequest: jest.fn(),
    compressResponse: jest.fn(),
    addCacheHeaders: jest.fn(),
    optimizeImages: jest.fn(),
  },
}));

// Mock validation services
jest.mock('@/lib/validation/schemas', () => ({
  ValidationService: jest.fn().mockImplementation(() => ({
    validate: jest.fn(),
    validateOrThrow: jest.fn(),
    safeValidate: jest.fn(),
    formatErrors: jest.fn(),
  })),
  createUserSchema: jest.fn(),
  updateUserSchema: jest.fn(),
  createItinerarySchema: jest.fn(),
  updateItinerarySchema: jest.fn(),
  chatMessageSchema: jest.fn(),
  chatSessionSchema: jest.fn(),
  paginationSchema: jest.fn(),
  aiItineraryRequestSchema: jest.fn(),
  aiChatRequestSchema: jest.fn(),
}));

// Mock data services
jest.mock('@/lib/data/migrations', () => ({
  DataMigrationManager: jest.fn().mockImplementation(() => ({
    migrate: jest.fn(),
    rollback: jest.fn(),
    getCurrentVersion: jest.fn(),
    getPendingMigrations: jest.fn(),
    validateDataIntegrity: jest.fn(),
  })),
  migrationManager: {
    migrate: jest.fn(),
    rollback: jest.fn(),
    getCurrentVersion: jest.fn(),
    getPendingMigrations: jest.fn(),
    validateDataIntegrity: jest.fn(),
  },
}));

jest.mock('@/lib/data/backup', () => ({
  BackupManager: jest.fn().mockImplementation(() => ({
    createFullBackup: jest.fn(),
    createIncrementalBackup: jest.fn(),
    restoreBackup: jest.fn(),
    listBackups: jest.fn(),
    deleteBackup: jest.fn(),
    validateBackup: jest.fn(),
  })),
  backupManager: {
    createFullBackup: jest.fn(),
    createIncrementalBackup: jest.fn(),
    restoreBackup: jest.fn(),
    listBackups: jest.fn(),
    deleteBackup: jest.fn(),
    validateBackup: jest.fn(),
  },
}));

// Mock API manager
jest.mock('@/services/api/manager', () => ({
  ApiManager: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
    getWeather: jest.fn(),
    getWeatherForecast: jest.fn(),
    getFlights: jest.fn(),
    getPlaces: jest.fn(),
    getDirections: jest.fn(),
    getCountryData: jest.fn(),
    getAllCountries: jest.fn(),
    getServiceHealth: jest.fn(),
    clearCache: jest.fn(),
  })),
  apiManager: {
    request: jest.fn(),
    getWeather: jest.fn(),
    getWeatherForecast: jest.fn(),
    getFlights: jest.fn(),
    getPlaces: jest.fn(),
    getDirections: jest.fn(),
    getCountryData: jest.fn(),
    getAllCountries: jest.fn(),
    getServiceHealth: jest.fn(),
    clearCache: jest.fn(),
  },
}));

// Global test setup
beforeAll(() => {
  // Set up global test environment
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  };
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset any global state
  process.env.NODE_ENV = 'test';
});

afterEach(() => {
// Clean up after each test
  jest.restoreAllMocks();
});

afterAll(() => {
  // Clean up after all tests
  jest.clearAllMocks();
});

// Custom matchers
expect.extend({
  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid date`,
        pass: false,
      };
    }
  },
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = typeof received === 'string' && emailRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = typeof received === 'string' && uuidRegex.test(received);
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },
});

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidDate(): R;
      toBeValidEmail(): R;
      toBeValidUUID(): R;
    }
  }
}