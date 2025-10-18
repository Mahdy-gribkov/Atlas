import { NextRequest, NextResponse } from 'next/server';
import { metricsCollector } from '@/lib/monitoring/metrics';
import { withErrorHandling } from '@/lib/error-handling';

async function handleMetrics(req: NextRequest): Promise<NextResponse> {
  const metrics = metricsCollector.getAggregatedMetrics();
  
  return NextResponse.json({
    success: true,
    data: metrics,
    timestamp: new Date().toISOString(),
  });
}

export const GET = withErrorHandling(handleMetrics);
