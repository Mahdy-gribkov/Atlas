/**
 * Weather API tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ApiTestHelper, commonTestScenarios } from '@/lib/testing/api-test-helpers';
import { setupTestEnvironment, cleanupTestEnvironment } from '@/lib/testing/test-utils';

describe('Weather API', () => {
  let apiHelper: ApiTestHelper;

  beforeEach(() => {
    setupTestEnvironment();
    apiHelper = new ApiTestHelper();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('GET /api/weather', () => {
    it('should return current weather for a location', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: 'Paris', type: 'current' },
        expectedStatus: 200,
      });

      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('message');
      expect(data.data).toHaveProperty('location');
      expect(data.data).toHaveProperty('current');
    });

    it('should return weather forecast for a location', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: 'Paris', type: 'forecast', days: '5' },
        expectedStatus: 200,
      });

      expect(data).toHaveProperty('success', true);
      expect(data).toHaveProperty('data');
      expect(data.data).toHaveProperty('location');
      expect(data.data).toHaveProperty('forecast');
      expect(Array.isArray(data.data.forecast)).toBe(true);
    });

    it('should require location parameter', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        expectedStatus: 400,
      });

      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should validate location parameter', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: '', type: 'current' },
        expectedStatus: 400,
      });

      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should validate type parameter', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: 'Paris', type: 'invalid' },
        expectedStatus: 400,
      });

      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should validate days parameter for forecast', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: 'Paris', type: 'forecast', days: 'invalid' },
        expectedStatus: 400,
      });

      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Error handling', () => {
    it('should handle invalid location gracefully', async () => {
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: 'InvalidLocation123', type: 'current' },
        expectedStatus: 503,
      });

      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });

    it('should handle API service errors', async () => {
      // Mock API service error
      const { data } = await apiHelper.testGet('/api/weather', {
        query: { location: 'Paris', type: 'current' },
        expectedStatus: 503,
      });

      expect(data).toHaveProperty('success', false);
      expect(data).toHaveProperty('error');
    });
  });

  describe('Common scenarios', () => {
    it('should pass weather API scenario', async () => {
      await expect(commonTestScenarios.testWeatherAPI(apiHelper)).resolves.not.toThrow();
    });
  });
});
