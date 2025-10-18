/**
 * Health check API tests
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { ApiTestHelper, commonTestScenarios } from '@/lib/testing/api-test-helpers';
import { setupTestEnvironment, cleanupTestEnvironment } from '@/lib/testing/test-utils';

describe('Health Check API', () => {
  let apiHelper: ApiTestHelper;

  beforeEach(() => {
    setupTestEnvironment();
    apiHelper = new ApiTestHelper();
  });

  afterEach(() => {
    cleanupTestEnvironment();
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const { data } = await apiHelper.testGet('/api/health', {
        expectedStatus: 200,
      });

      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('uptime');
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('environment');
      expect(data).toHaveProperty('checks');
      expect(data).toHaveProperty('metrics');
    });

    it('should include all required health checks', async () => {
      const { data } = await apiHelper.testGet('/api/health');

      expect(data.checks).toHaveProperty('database');
      expect(data.checks).toHaveProperty('externalServices');
      expect(data.checks).toHaveProperty('memory');
      expect(data.checks).toHaveProperty('disk');
      expect(data.checks).toHaveProperty('api');

      // Check that each health check has required properties
      Object.values(data.checks).forEach((check: any) => {
        expect(check).toHaveProperty('status');
        expect(check).toHaveProperty('message');
        expect(['pass', 'fail', 'warn']).toContain(check.status);
      });
    });

    it('should include performance metrics', async () => {
      const { data } = await apiHelper.testGet('/api/health');

      expect(data.metrics).toHaveProperty('errorRate');
      expect(data.metrics).toHaveProperty('avgResponseTime');
      expect(data.metrics).toHaveProperty('totalRequests');
      expect(data.metrics).toHaveProperty('totalErrors');

      expect(typeof data.metrics.errorRate).toBe('number');
      expect(typeof data.metrics.avgResponseTime).toBe('number');
      expect(typeof data.metrics.totalRequests).toBe('number');
      expect(typeof data.metrics.totalErrors).toBe('number');
    });
  });

  describe('GET /api/ready', () => {
    it('should return readiness status', async () => {
      const { data } = await apiHelper.testGet('/api/ready', {
        expectedStatus: 200,
      });

      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(['ready', 'not ready']).toContain(data.status);
    });
  });

  describe('GET /api/live', () => {
    it('should return liveness status', async () => {
      const { data } = await apiHelper.testGet('/api/live', {
        expectedStatus: 200,
      });

      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data.status).toBe('alive');
    });
  });

  describe('Common scenarios', () => {
    it('should pass health check scenario', async () => {
      await expect(commonTestScenarios.testHealthCheck(apiHelper)).resolves.not.toThrow();
    });
  });
});
