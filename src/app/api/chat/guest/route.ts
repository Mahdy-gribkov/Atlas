import { NextRequest, NextResponse } from 'next/server';
import { GuestChatService } from '@/services/guest-chat.service';
import { createChatSessionSchema } from '@/lib/validations/schemas';

const guestChatService = new GuestChatService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createChatSessionSchema.parse(body);
    
    // Generate a guest ID
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session = await guestChatService.createGuestChatSession(guestId, {
      title: validatedData.title || 'Guest Chat Session',
      context: validatedData.context,
    });

    return NextResponse.json({
      success: true,
      data: session,
      message: 'Guest chat session created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating guest chat session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create guest chat session' },
      { status: 500 }
    );
  }
}
