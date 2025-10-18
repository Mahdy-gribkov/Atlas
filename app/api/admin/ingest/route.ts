import { NextRequest, NextResponse } from 'next/server';
import { withRole } from '@/lib/middleware/auth';
import { IngestionService } from '@/services/ai/ingestion.service';

const ingestionService = new IngestionService();

export async function POST(request: NextRequest) {
  return withRole(
    request,
    ['admin'],
    async (req, token) => {
      try {
        const { action } = await req.json();
        
        if (action === 'sample-data') {
          await ingestionService.ingestSampleData();
          return NextResponse.json({
            success: true,
            message: 'Sample data ingested successfully',
          });
        }
        
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
      } catch (error) {
        console.error('Error ingesting data:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to ingest data' },
          { status: 500 }
        );
      }
    }
  );
}

export async function GET(request: NextRequest) {
  return withRole(
    request,
    ['admin'],
    async (req, token) => {
      try {
        const stats = await ingestionService.getIngestionStats();
        
        return NextResponse.json({
          success: true,
          data: stats,
        });
      } catch (error) {
        console.error('Error getting ingestion stats:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to get stats' },
          { status: 500 }
        );
      }
    }
  );
}