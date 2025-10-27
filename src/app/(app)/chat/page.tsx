import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { GuestChatPage } from '@/components/pages/GuestChatPage';

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  // If no session, redirect to guest chat
  if (!session) {
    redirect('/chat/guest');
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)]">
      <ChatInterface />
    </div>
  );
}
