/**
 * Testing system exports
 */

export * from './test-utils';
export * from './api-test-helpers';

// Re-export commonly used items for convenience
export {
  mockUser,
  mockItinerary,
  mockChatSession,
  mockWeatherResponse,
  mockFlightResponse,
  mockPlacesResponse,
  createMockRequest,
  createMockResponse,
  TestDataFactory,
  waitFor,
  waitForElement,
  mockExternalServices,
  setupTestEnvironment,
  cleanupTestEnvironment,
  measurePerformance,
  measureAsyncPerformance,
} from './test-utils';

export {
  ApiTestHelper,
  ApiTestSuite,
  commonTestScenarios,
} from './api-test-helpers';
