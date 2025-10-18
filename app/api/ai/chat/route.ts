import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/middleware/auth';
import { withValidation } from '@/lib/middleware/validation';
import { AgentService } from '@/services/ai/agent.service';
import { ChatService } from '@/services/chat.service';
import { UserService } from '@/services/user.service';
import { aiChatRequestSchema } from '@/lib/validations/schemas';

const agentService = new AgentService();
const chatService = new ChatService();
const userService = new UserService();

export async function POST(request: NextRequest) {
  return withValidation(
    aiChatRequestSchema,
    async (req, data) => {
      return withAuth(
        req,
        async (authReq, token) => {
          try {
            const { message, sessionId, context, attachments } = data;
            
            // Get or create chat session
            let session;
            if (sessionId) {
              session = await chatService.getChatSession(sessionId);
              if (!session || session.userId !== token.uid) {
                return NextResponse.json(
                  { success: false, error: 'Chat session not found' },
                  { status: 404 }
                );
              }
            } else {
              session = await chatService.createChatSession(token.uid as string, {
                title: message.substring(0, 50) + '...',
                context,
              });
            }

            // Get user preferences
            const user = await userService.getUserById(token.uid as string);
            
            // Add user message to session
            await chatService.addMessage(session.id, {
              content: message,
              role: 'user',
              attachments,
            });

            // Process message with AI agent
            const agentContext: any = {
              userId: token.uid as string,
              conversationHistory: session.messages,
              activeTools: context?.activeTools || [],
            };
            
            if (context?.currentItinerary) {
              agentContext.currentItinerary = context.currentItinerary;
            }
            
            if (user?.preferences) {
              agentContext.userPreferences = user.preferences;
            }

            const aiResponse = await agentService.processMessage(message, agentContext);

            // Add AI response to session
            const updatedSession = await chatService.addMessage(session.id, {
              content: aiResponse,
              role: 'assistant',
            });

            return NextResponse.json({
              success: true,
              data: {
                session: updatedSession,
                response: aiResponse,
              },
              message: 'Message processed successfully',
            });
          } catch (error) {
            console.error('Error processing chat message:', error);
            return NextResponse.json(
              { success: false, error: 'Failed to process message' },
              { status: 500 }
            );
          }
        }
      );
    }
  );
}