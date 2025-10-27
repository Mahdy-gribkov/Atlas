import { NextRequest, NextResponse } from 'next/server';
import { GuestChatService } from '@/services/guest-chat.service';
import { GeminiService } from '@/services/ai/gemini.service';
import { aiChatRequestSchema } from '@/lib/validations/schemas';

const guestChatService = new GuestChatService();
const geminiService = new GeminiService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;
    
    if (!message || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    // Get or create guest session
    let session = await guestChatService.getGuestChatSession(sessionId);
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Guest session not found' },
        { status: 404 }
      );
    }

    // Add user message to session
    await guestChatService.addMessage(sessionId, {
      content: message,
      role: 'user',
    });

    // Generate AI response
    const aiResponse = await geminiService.generateResponse(message, {
      conversationHistory: session.messages,
      context: 'travel_planning',
    });

    // Add AI response to session
    await guestChatService.addMessage(sessionId, {
      content: aiResponse,
      role: 'assistant',
    });

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        sessionId: sessionId,
      },
      message: 'Response generated successfully',
    });
  } catch (error) {
    console.error('Error processing guest chat:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
