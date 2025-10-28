import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/error-handling/production';

async function healthCheck() {
  const startTime = Date.now();
  
  // Basic health checks
  const checks = {
    database: await checkDatabase(),
    externalServices: await checkExternalServices(),
    memory: checkMemoryUsage(),
    uptime: process.uptime(),
  };
  
  const responseTime = Date.now() - startTime;
  
  const isHealthy = Object.values(checks).every(check => 
    typeof check === 'boolean' ? check : true
  );
  
  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    responseTime: `${responseTime}ms`,
    checks,
  }, {
    status: isHealthy ? 200 : 503
  });
}

async function checkDatabase(): Promise<boolean> {
  try {
    // In production, implement actual database health check
    // For now, return true as we're using Firebase
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

async function checkExternalServices(): Promise<boolean> {
  try {
    // Check external services like Firebase, AI services, etc.
    // For now, return true
    return true;
  } catch (error) {
    console.error('External services health check failed:', error);
    return false;
  }
}

function checkMemoryUsage(): { used: number; total: number; percentage: number } {
  const used = process.memoryUsage();
  const total = used.heapTotal;
  const percentage = Math.round((used.heapUsed / total) * 100);
  
  return {
    used: Math.round(used.heapUsed / 1024 / 1024), // MB
    total: Math.round(total / 1024 / 1024), // MB
    percentage,
  };
}

export const GET = withErrorHandling(healthCheck);