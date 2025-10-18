import { NextRequest } from 'next/server';
import { handleReadinessCheck } from '@/lib/monitoring/health-check';
import { withErrorHandling } from '@/lib/error-handling';

export const GET = withErrorHandling(handleReadinessCheck);
