import { adminDb } from '@/lib/firebase/admin';
import { ChatSession, ChatMessage, ChatContext } from '@/types';
import { createChatSessionSchema, chatMessageSchema } from '@/lib/validations/schemas';

export class GuestChatService {
  private collection = adminDb?.collection('guestChatSessions');

  async createGuestChatSession(guestId: string, sessionData: any): Promise<ChatSession> {
    const validatedData = createChatSessionSchema.parse(sessionData);
    
    const session: ChatSession = {
      id: this.generateId(),
      userId: null, // Guest sessions don't have a userId
      guestId,
      title: validatedData.title || 'Guest Chat Session',
      messages: [],
      context: {
        conversationMemory: [],
        activeTools: validatedData.context?.activeTools || [],
        ...(validatedData.context?.currentItinerary && { currentItinerary: validatedData.context.currentItinerary }),
      },
      status: 'active',
      isGuest: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.collection) {
      await this.collection.doc(session.id).set(session);
    }
    return session;
  }

  async getGuestChatSession(id: string): Promise<ChatSession | null> {
    if (!this.collection) {
      return null;
    }
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as ChatSession;
  }

  async addMessage(sessionId: string, messageData: any): Promise<ChatSession> {
    const validatedData = chatMessageSchema.parse(messageData);
    
    const session = await this.getGuestChatSession(sessionId);
    if (!session) {
      throw new Error('Guest chat session not found');
    }

    const message: ChatMessage = {
      id: this.generateMessageId(),
      role: validatedData.role,
      content: validatedData.content,
      timestamp: new Date(),
      metadata: {
        ...(validatedData.attachments && { attachments: validatedData.attachments }),
      },
    };

    const updatedMessages = [...session.messages, message];
    const updatedSession: ChatSession = {
      ...session,
      messages: updatedMessages,
      updatedAt: new Date(),
    };

    // Update conversation memory
    updatedSession.context.conversationMemory = this.updateConversationMemory(
      updatedSession.context.conversationMemory,
      message
    );

    await this.collection.doc(sessionId).update({
      messages: updatedMessages,
      context: updatedSession.context,
      updatedAt: new Date(),
    });

    return updatedSession;
  }

  async updateGuestChatSession(id: string, updateData: any): Promise<ChatSession> {
    const session = await this.getGuestChatSession(id);
    if (!session) {
      throw new Error('Guest chat session not found');
    }

    const updatedSession: ChatSession = {
      ...session,
      ...updateData,
      updatedAt: new Date(),
    };

    await this.collection.doc(id).update({
      ...updateData,
      updatedAt: new Date(),
    });

    return updatedSession;
  }

  async convertGuestSessionToUser(guestSessionId: string, userId: string): Promise<ChatSession> {
    const guestSession = await this.getGuestChatSession(guestSessionId);
    if (!guestSession) {
      throw new Error('Guest session not found');
    }

    // Create new user session
    const userSession: ChatSession = {
      ...guestSession,
      id: this.generateId(),
      userId,
      guestId: undefined,
      isGuest: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to user chat sessions collection
    const userCollection = adminDb?.collection('chatSessions');
    if (userCollection) {
      await userCollection.doc(userSession.id).set(userSession);
    }

    // Mark guest session as converted
    await this.updateGuestChatSession(guestSessionId, {
      status: 'deleted',
      convertedToUserId: userId,
    });

    return userSession;
  }

  async deleteGuestChatSession(id: string): Promise<void> {
    await this.collection.doc(id).update({
      status: 'deleted',
      updatedAt: new Date(),
    });
  }

  private updateConversationMemory(memory: string[], message: ChatMessage): string[] {
    const newMemory = [...memory];
    
    // Keep only the last 10 messages in memory for context
    if (newMemory.length >= 10) {
      newMemory.shift();
    }
    
    // Add current message to memory
    newMemory.push(`${message.role}: ${message.content}`);
    
    return newMemory;
  }

  private generateId(): string {
    return `guest_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `guest_msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
