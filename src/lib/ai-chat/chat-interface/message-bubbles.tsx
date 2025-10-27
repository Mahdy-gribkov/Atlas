/**
 * Message Bubbles Component
 * 
 * Provides message bubble UI components for AI chat interface.
 * Implements advanced message display and interaction features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Message Bubbles Variants
const messageBubblesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'message-bubbles-mode-standard',
        'enhanced': 'message-bubbles-mode-enhanced',
        'advanced': 'message-bubbles-mode-advanced',
        'custom': 'message-bubbles-mode-custom'
      },
      type: {
        'user': 'message-type-user',
        'assistant': 'message-type-assistant',
        'system': 'message-type-system',
        'error': 'message-type-error',
        'mixed': 'message-type-mixed'
      },
      style: {
        'minimal': 'message-style-minimal',
        'moderate': 'message-style-moderate',
        'detailed': 'message-style-detailed',
        'custom': 'message-style-custom'
      },
      format: {
        'text': 'message-format-text',
        'visual': 'message-format-visual',
        'interactive': 'message-format-interactive',
        'mixed': 'message-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Message Bubble Props
interface MessageBubbleProps extends VariantProps<typeof messageBubblesVariants> {
  className?: string;
  message: {
    id: string;
    content: string;
    timestamp: Date;
    sender: 'user' | 'assistant' | 'system';
    type?: 'text' | 'image' | 'file' | 'suggestion' | 'error';
    metadata?: {
      avatar?: string;
      name?: string;
      status?: 'sent' | 'delivered' | 'read' | 'failed';
      reactions?: Array<{ emoji: string; count: number }>;
      attachments?: Array<{ name: string; type: string; size: number }>;
    };
  };
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showTimestamp?: boolean;
  showAvatar?: boolean;
  showActions?: boolean;
}

// Message Bubble Component
export const MessageBubble = React.forwardRef<HTMLDivElement, MessageBubbleProps>(
  ({ 
    className, 
    message,
    onReaction,
    onReply,
    onEdit,
    onDelete,
    showTimestamp = true,
    showAvatar = true,
    showActions = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showReactions, setShowReactions] = useState(false);

    const getSenderColor = (sender: string) => {
      switch (sender) {
        case 'user': return 'bg-blue-500';
        case 'assistant': return 'bg-gray-500';
        case 'system': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };

    const getSenderTextColor = (sender: string) => {
      switch (sender) {
        case 'user': return 'text-blue-600 dark:text-blue-400';
        case 'assistant': return 'text-gray-600 dark:text-gray-400';
        case 'system': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getBubbleAlignment = (sender: string) => {
      return sender === 'user' ? 'justify-end' : 'justify-start';
    };

    const getBubbleStyle = (sender: string) => {
      if (sender === 'user') {
        return 'bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm';
      } else if (sender === 'assistant') {
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-r-2xl rounded-tl-2xl rounded-bl-sm';
      } else {
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-2xl';
      }
    };

    const getStatusIcon = (status?: string) => {
      switch (status) {
        case 'sent': return '✓';
        case 'delivered': return '✓✓';
        case 'read': return '✓✓';
        case 'failed': return '✗';
        default: return '';
      }
    };

    const getStatusColor = (status?: string) => {
      switch (status) {
        case 'sent': return 'text-gray-400';
        case 'delivered': return 'text-gray-400';
        case 'read': return 'text-blue-500';
        case 'failed': return 'text-red-500';
        default: return 'text-gray-400';
      }
    };

    const formatTimestamp = (timestamp: Date) => {
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleReaction = (emoji: string) => {
      onReaction?.(message.id, emoji);
      setShowReactions(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex w-full mb-4',
          getBubbleAlignment(message.sender),
          messageBubblesVariants({ type, style }),
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <div className={cn('flex max-w-[80%]', message.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
          {showAvatar && message.sender !== 'user' && (
            <div className="flex-shrink-0 mr-3">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium', getSenderColor(message.sender))}>
                {message.metadata?.avatar || (message.sender === 'assistant' ? 'AI' : 'S')}
              </div>
            </div>
          )}
          
          <div className="flex flex-col">
            <div className={cn('px-4 py-2 text-sm', getBubbleStyle(message.sender))}>
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              
              {message.metadata?.attachments && message.metadata.attachments.length > 0 && (
                <div className="mt-2 space-y-1">
                  {message.metadata.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-white/20 rounded-md">
                      <span className="text-xs">📎</span>
                      <span className="text-xs truncate">{attachment.name}</span>
                      <span className="text-xs opacity-75">({attachment.size}KB)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={cn('flex items-center gap-2 mt-1', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
              {showTimestamp && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                  {formatTimestamp(message.timestamp)}
                </span>
              )}
              
              {message.sender === 'user' && message.metadata?.status && (
                <span className={cn('text-xs', getStatusColor(message.metadata.status))}>
                  {getStatusIcon(message.metadata.status)}
                </span>
              )}
              
              {message.metadata?.name && message.sender !== 'user' && (
                <span className={cn('text-xs font-medium', getSenderTextColor(message.sender))}>
                  {message.metadata.name}
                </span>
              )}
            </div>
            
            {message.metadata?.reactions && message.metadata.reactions.length > 0 && (
              <div className={cn('flex flex-wrap gap-1 mt-1', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {message.metadata.reactions.map((reaction, index) => (
                  <button
                    key={index}
                    onClick={() => handleReaction(reaction.emoji)}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-gray-600 dark:text-gray-400">{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}
            
            {isHovered && showActions && (
              <div className={cn('flex gap-1 mt-1', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  title="Add reaction"
                >
                  😊
                </button>
                <button
                  onClick={() => onReply?.(message.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  title="Reply"
                >
                  ↩️
                </button>
                {message.sender === 'user' && (
                  <>
                    <button
                      onClick={() => onEdit?.(message.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete?.(message.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            )}
            
            {showReactions && (
              <div className={cn('flex gap-1 mt-1', message.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {['👍', '👎', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleReaction(emoji)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors duration-200"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {showAvatar && message.sender === 'user' && (
            <div className="flex-shrink-0 ml-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

MessageBubble.displayName = 'MessageBubble';

// Message List Props
interface MessageListProps {
  className?: string;
  messages: Array<MessageBubbleProps['message']>;
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  showTimestamps?: boolean;
  showAvatars?: boolean;
  showActions?: boolean;
  autoScroll?: boolean;
}

// Message List Component
export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(
  ({ 
    className, 
    messages,
    onReaction,
    onReply,
    onEdit,
    onDelete,
    showTimestamps = true,
    showAvatars = true,
    showActions = true,
    autoScroll = true,
    ...props 
  }, ref) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
      if (autoScroll) {
        scrollToBottom();
      }
    }, [messages, autoScroll, scrollToBottom]);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col h-full overflow-y-auto p-4 space-y-2',
          className
        )}
        {...props}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onReaction={onReaction}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            showTimestamp={showTimestamps}
            showAvatar={showAvatars}
            showActions={showActions}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  }
);

MessageList.displayName = 'MessageList';

// Message Input Props
interface MessageInputProps {
  className?: string;
  placeholder?: string;
  onSend?: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  maxLength?: number;
  showCharacterCount?: boolean;
  showSendButton?: boolean;
  allowAttachments?: boolean;
  onAttachment?: (file: File) => void;
}

// Message Input Component
export const MessageInput = React.forwardRef<HTMLDivElement, MessageInputProps>(
  ({ 
    className, 
    placeholder = "Type your message...",
    onSend,
    onTyping,
    disabled = false,
    maxLength = 1000,
    showCharacterCount = true,
    showSendButton = true,
    allowAttachments = true,
    onAttachment,
    ...props 
  }, ref) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = useCallback(() => {
      if (message.trim() && !disabled) {
        onSend?.(message.trim());
        setMessage('');
        setIsTyping(false);
        onTyping?.(false);
      }
    }, [message, disabled, onSend, onTyping]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }, [handleSend]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      if (value.length <= maxLength) {
        setMessage(value);
        
        if (value.trim() && !isTyping) {
          setIsTyping(true);
          onTyping?.(true);
        } else if (!value.trim() && isTyping) {
          setIsTyping(false);
          onTyping?.(false);
        }
      }
    }, [maxLength, isTyping, onTyping]);

    const handleAttachment = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onAttachment?.(file);
      }
    }, [onAttachment]);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-end gap-2 p-4 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800',
          className
        )}
        {...props}
      >
        {allowAttachments && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Attach file"
          >
            📎
          </button>
        )}
        
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
          
          {showCharacterCount && (
            <div className="absolute bottom-1 right-1 text-xs text-gray-400">
              {message.length}/{maxLength}
            </div>
          )}
        </div>
        
        {showSendButton && (
          <button
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            title="Send message"
          >
            ➤
          </button>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleAttachment}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    );
  }
);

MessageInput.displayName = 'MessageInput';

// Message Bubbles Demo Component
interface MessageBubblesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const MessageBubblesDemo = React.forwardRef<HTMLDivElement, MessageBubblesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [messages, setMessages] = useState<Array<MessageBubbleProps['message']>>([
      {
        id: '1',
        content: 'Hello! I\'m your AI travel assistant. How can I help you plan your next adventure?',
        timestamp: new Date(Date.now() - 300000),
        sender: 'assistant',
        metadata: {
          name: 'Atlas AI',
          avatar: '🗺️',
          status: 'read'
        }
      },
      {
        id: '2',
        content: 'I\'m looking for a romantic getaway in Europe for next spring. Something with beautiful architecture and great food.',
        timestamp: new Date(Date.now() - 240000),
        sender: 'user',
        metadata: {
          status: 'read'
        }
      },
      {
        id: '3',
        content: 'That sounds wonderful! I\'d recommend Paris, France or Florence, Italy for a romantic European getaway. Both offer stunning architecture, world-class cuisine, and perfect spring weather.\n\nWould you like me to create a detailed itinerary for either destination?',
        timestamp: new Date(Date.now() - 180000),
        sender: 'assistant',
        metadata: {
          name: 'Atlas AI',
          avatar: '🗺️',
          status: 'read',
          reactions: [
            { emoji: '❤️', count: 2 },
            { emoji: '👍', count: 1 }
          ]
        }
      },
      {
        id: '4',
        content: 'Paris sounds perfect! Can you help me plan a 5-day itinerary?',
        timestamp: new Date(Date.now() - 120000),
        sender: 'user',
        metadata: {
          status: 'delivered'
        }
      }
    ]);

    const handleSend = (content: string) => {
      const newMessage: MessageBubbleProps['message'] = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
        sender: 'user',
        metadata: {
          status: 'sent'
        }
      };
      setMessages(prev => [...prev, newMessage]);
    };

    const handleReaction = (messageId: string, emoji: string) => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.metadata?.reactions || [];
          const existingReaction = reactions.find(r => r.emoji === emoji);
          
          if (existingReaction) {
            existingReaction.count += 1;
          } else {
            reactions.push({ emoji, count: 1 });
          }
          
          return {
            ...msg,
            metadata: {
              ...msg.metadata,
              reactions
            }
          };
        }
        return msg;
      }));
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col h-96 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <MessageList
          messages={messages}
          onReaction={handleReaction}
          className="flex-1"
        />
        <MessageInput
          onSend={handleSend}
          placeholder="Ask me anything about travel..."
        />
        
        {showControls && (
          <div className="p-4 bg-gray-100 dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interactive message bubbles with reactions, replies, and real-time features.
            </p>
          </div>
        )}
      </div>
    );
  }
);

MessageBubblesDemo.displayName = 'MessageBubblesDemo';

// Export all components
export {
  messageBubblesVariants,
  type MessageBubbleProps,
  type MessageListProps,
  type MessageInputProps,
  type MessageBubblesDemoProps
};
