import { NextRequest } from 'next/server';
import { handleHealthCheck } from '@/lib/monitoring/health-check';
import { withErrorHandling } from '@/lib/error-handling';

export const GET = withErrorHandling(handleHealthCheck);
