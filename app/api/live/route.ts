import { NextRequest } from 'next/server';
import { handleLivenessCheck } from '@/lib/monitoring/health-check';
import { withErrorHandling } from '@/lib/error-handling';

export const GET = withErrorHandling(handleLivenessCheck);
