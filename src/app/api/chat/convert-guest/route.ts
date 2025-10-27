import { NextRequest, NextResponse } from 'next/server';
import { GuestChatService } from '@/services/guest-chat.service';
import { withAuth } from '@/lib/middleware/auth';

const guestChatService = new GuestChatService();

export async function POST(request: NextRequest) {
  return withAuth(
    request,
    async (req, token) => {
      try {
        const body = await req.json();
        const { guestSessionId, userId } = body;
        
        if (!guestSessionId || !userId) {
          return NextResponse.json(
            { success: false, error: 'Guest session ID and user ID are required' },
            { status: 400 }
          );
        }

        // Verify the user ID matches the token
        if (token.uid !== userId) {
          return NextResponse.json(
            { success: false, error: 'Unauthorized' },
            { status: 403 }
          );
        }

        // Convert guest session to user session
        const userSession = await guestChatService.convertGuestSessionToUser(
          guestSessionId,
          userId
        );

        return NextResponse.json({
          success: true,
          data: userSession,
          message: 'Guest session converted successfully',
        });
      } catch (error) {
        console.error('Error converting guest session:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to convert guest session' },
          { status: 500 }
        );
      }
    }
  );
}
