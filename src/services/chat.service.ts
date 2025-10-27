import { adminDb } from '@/lib/firebase/admin';
import { ChatSession, ChatMessage, ChatContext } from '@/types';
import { createChatSessionSchema, chatMessageSchema } from '@/lib/validations/schemas';

export class ChatService {
  private collection = adminDb?.collection('chatSessions');

  async createChatSession(userId: string, sessionData: any): Promise<ChatSession> {
    const validatedData = createChatSessionSchema.parse(sessionData);
    
    const session: ChatSession = {
      id: this.generateId(),
      userId,
      title: validatedData.title || 'New Chat',
      messages: [],
      context: {
        conversationMemory: [],
        activeTools: validatedData.context?.activeTools || [],
        ...(validatedData.context?.currentItinerary && { currentItinerary: validatedData.context.currentItinerary }),
      },
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.collection) {
      await this.collection.doc(session.id).set(session);
    }
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | null> {
    if (!this.collection) {
      return null;
    }
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as ChatSession;
  }

  async getUserChatSessions(
    userId: string, 
    page: number = 1, 
    limit: number = 10,
    status: 'active' | 'archived' | 'deleted' = 'active'
  ): Promise<{ sessions: ChatSession[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '==', status)
      .offset(offset)
      .limit(limit)
      .orderBy('updatedAt', 'desc')
      .get();

    const sessions = snapshot.docs.map((doc: any) => doc.data() as ChatSession);
    
    const totalSnapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '==', status)
      .get();
    const total = totalSnapshot.size;

    return { sessions, total };
  }

  async addMessage(sessionId: string, messageData: any): Promise<ChatSession> {
    const validatedData = chatMessageSchema.parse(messageData);
    
    const session = await this.getChatSession(sessionId);
    if (!session) {
      throw new Error('Chat session not found');
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

  async updateChatSession(id: string, updateData: any): Promise<ChatSession> {
    const session = await this.getChatSession(id);
    if (!session) {
      throw new Error('Chat session not found');
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

  async deleteChatSession(id: string): Promise<void> {
    await this.collection.doc(id).update({
      status: 'deleted',
      updatedAt: new Date(),
    });
  }

  async archiveChatSession(id: string): Promise<ChatSession> {
    return this.updateChatSession(id, { status: 'archived' });
  }

  async searchChatSessions(
    userId: string, 
    query: string, 
    page: number = 1, 
    limit: number = 10
  ): Promise<{ sessions: ChatSession[]; total: number }> {
    const offset = (page - 1) * limit;
    
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - in production, consider using Algolia or similar
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .offset(offset)
      .limit(limit)
      .orderBy('updatedAt', 'desc')
      .get();

    const allSessions = snapshot.docs.map((doc: any) => doc.data() as ChatSession);
    
    // Filter sessions that contain the search query
    const filteredSessions = allSessions.filter((session: ChatSession) => 
      session.title.toLowerCase().includes(query.toLowerCase()) ||
      session.messages.some((message: ChatMessage) => 
        message.content.toLowerCase().includes(query.toLowerCase())
      )
    );

    return { 
      sessions: filteredSessions, 
      total: filteredSessions.length 
    };
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
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
