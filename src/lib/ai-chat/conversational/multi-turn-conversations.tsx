/**
 * Multi-turn Conversations Component
 * 
 * Provides multi-turn conversation support for AI chat interface.
 * Implements advanced conversation management for travel agent interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Multi-turn Conversations Variants
const multiTurnConversationsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'multi-turn-conversations-mode-standard',
        'enhanced': 'multi-turn-conversations-mode-enhanced',
        'advanced': 'multi-turn-conversations-mode-advanced',
        'custom': 'multi-turn-conversations-mode-custom'
      },
      type: {
        'sequential': 'conversation-type-sequential',
        'contextual': 'conversation-type-contextual',
        'adaptive': 'conversation-type-adaptive',
        'collaborative': 'conversation-type-collaborative',
        'mixed': 'conversation-type-mixed'
      },
      style: {
        'minimal': 'conversation-style-minimal',
        'moderate': 'conversation-style-moderate',
        'detailed': 'conversation-style-detailed',
        'custom': 'conversation-style-custom'
      },
      format: {
        'text': 'conversation-format-text',
        'visual': 'conversation-format-visual',
        'interactive': 'conversation-format-interactive',
        'mixed': 'conversation-format-mixed'
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

// Multi-turn Conversations Toggle Props
interface MultiTurnConversationsToggleProps extends VariantProps<typeof multiTurnConversationsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Multi-turn Conversations Toggle Component
export const MultiTurnConversationsToggle = React.forwardRef<HTMLButtonElement, MultiTurnConversationsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      onToggle?.(newState);
    }, [isEnabled, onToggle]);

    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500',
          sizeClasses[size],
          positionClasses[position],
          isEnabled 
            ? 'bg-emerald-600 text-white border-emerald-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable multi-turn conversations' : 'Enable multi-turn conversations'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Multi-turn conversations enabled' : 'Multi-turn conversations disabled'}
          </span>
        )}
      </button>
    );
  }
);

MultiTurnConversationsToggle.displayName = 'MultiTurnConversationsToggle';

// Multi-turn Conversations Provider Props
interface MultiTurnConversationsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'sequential' | 'contextual' | 'adaptive' | 'collaborative' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Multi-turn Conversations Provider Component
export const MultiTurnConversationsProvider = React.forwardRef<HTMLDivElement, MultiTurnConversationsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'mixed',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing multi-turn conversations classes
        document.body.classList.remove(
          'multi-turn-conversations-mode-standard',
          'multi-turn-conversations-mode-enhanced',
          'multi-turn-conversations-mode-advanced',
          'multi-turn-conversations-mode-custom'
        );
        
        document.body.classList.add(`multi-turn-conversations-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          multiTurnConversationsVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MultiTurnConversationsProvider.displayName = 'MultiTurnConversationsProvider';

// Multi-turn Conversations Manager Component
interface MultiTurnConversationsManagerProps extends VariantProps<typeof multiTurnConversationsVariants> {
  className?: string;
  onConversationUpdate?: (conversation: any) => void;
  type?: 'sequential' | 'contextual' | 'adaptive' | 'collaborative' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const MultiTurnConversationsManager = React.forwardRef<HTMLDivElement, MultiTurnConversationsManagerProps>(
  ({ 
    className, 
    onConversationUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [conversation, setConversation] = useState({
      messages: [
        { id: 1, role: 'assistant', content: 'Hello! I\'m Atlas, your AI travel assistant. How can I help you plan your next adventure?', timestamp: new Date().toISOString() }
      ],
      context: {
        currentTopic: 'greeting',
        userPreferences: {},
        conversationHistory: [],
        activeGoals: []
      },
      state: {
        isActive: true,
        turnCount: 1,
        lastUserMessage: null,
        conversationFlow: 'linear'
      },
      metrics: {
        totalTurns: 1,
        averageResponseTime: 0,
        userEngagement: 0,
        conversationQuality: 0
      }
    });

    const [newMessage, setNewMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const addMessage = useCallback((role: 'user' | 'assistant', content: string) => {
      const message = {
        id: conversation.messages.length + 1,
        role,
        content,
        timestamp: new Date().toISOString()
      };
      
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, message],
        state: {
          ...prev.state,
          turnCount: prev.state.turnCount + 1,
          lastUserMessage: role === 'user' ? content : prev.state.lastUserMessage
        },
        metrics: {
          ...prev.metrics,
          totalTurns: prev.metrics.totalTurns + 1
        }
      }));
      
      onConversationUpdate?.(conversation);
    }, [conversation, onConversationUpdate]);

    const handleSendMessage = useCallback(async () => {
      if (newMessage.trim()) {
        addMessage('user', newMessage);
        setIsProcessing(true);
        
        // Simulate AI response
        setTimeout(() => {
          const responses = [
            'That sounds exciting! Let me help you with that.',
            'I understand. Let\'s work together to make this perfect.',
            'Great choice! I have some excellent recommendations for you.',
            'I can definitely help you with that. Let me gather some information.',
            'Perfect! Let\'s continue building your ideal trip.'
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          addMessage('assistant', randomResponse);
          setNewMessage('');
          setIsProcessing(false);
        }, 1500);
      }
    }, [newMessage, addMessage]);

    const clearConversation = useCallback(() => {
      setConversation(prev => ({
        ...prev,
        messages: [{ id: 1, role: 'assistant', content: 'Hello! I\'m Atlas, your AI travel assistant. How can I help you plan your next adventure?', timestamp: new Date().toISOString() }],
        state: {
          ...prev.state,
          turnCount: 1,
          lastUserMessage: null
        },
        metrics: {
          ...prev.metrics,
          totalTurns: 1
        }
      }));
    }, []);

    const getMessageIcon = (role: string) => {
      return role === 'user' ? '👤' : '🤖';
    };

    const getMessageColor = (role: string) => {
      return role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400';
    };

    const getConversationTypeIcon = (conversationType: string) => {
      switch (conversationType) {
        case 'sequential': return '➡️';
        case 'contextual': return '🎯';
        case 'adaptive': return '🔄';
        case 'collaborative': return '🤝';
        case 'mixed': return '🔀';
        default: return '💬';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          multiTurnConversationsVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Multi-turn Conversations
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getConversationTypeIcon(type)}</span>
            <button
              onClick={clearConversation}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-emerald-50 rounded-md dark:bg-emerald-900/20">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {conversation.metrics.totalTurns}
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-400">
                Total Turns
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {conversation.messages.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Messages
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {conversation.metrics.userEngagement}%
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Engagement
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {conversation.metrics.conversationQuality}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Quality
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Conversation History
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-2 p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                {conversation.messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-2">
                    <span className="text-sm">{getMessageIcon(message.role)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn('text-xs font-medium', getMessageColor(message.role))}>
                          {message.role.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Send Message
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isProcessing}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isProcessing ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Conversation Context
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>
                    <strong>Current Topic:</strong> {conversation.context.currentTopic}
                  </div>
                  <div>
                    <strong>Turn Count:</strong> {conversation.state.turnCount}
                  </div>
                  <div>
                    <strong>Flow Type:</strong> {conversation.state.conversationFlow}
                  </div>
                  <div>
                    <strong>Last User Message:</strong> {conversation.state.lastUserMessage || 'None'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setConversation(prev => ({ ...prev, metrics: { ...prev.metrics, userEngagement: 85, conversationQuality: 92 } }))}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Metrics
              </button>
              <button
                onClick={() => setConversation(prev => ({ ...prev, context: { ...prev.context, currentTopic: 'travel_planning' } }))}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Change Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MultiTurnConversationsManager.displayName = 'MultiTurnConversationsManager';

// Multi-turn Conversations Status Component
interface MultiTurnConversationsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const MultiTurnConversationsStatus = React.forwardRef<HTMLDivElement, MultiTurnConversationsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="font-medium">
          Multi-turn Conversations: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced multi-turn conversation management' 
              : 'Basic conversation tracking'
            }
          </div>
        )}
      </div>
    );
  }
);

MultiTurnConversationsStatus.displayName = 'MultiTurnConversationsStatus';

// Multi-turn Conversations Demo Component
interface MultiTurnConversationsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const MultiTurnConversationsDemo = React.forwardRef<HTMLDivElement, MultiTurnConversationsDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Multi-turn Conversations Demo</h3>
        
        <MultiTurnConversationsManager
          mode="enhanced"
          type="adaptive"
          style="detailed"
          onConversationUpdate={(conversation) => console.log('Conversation updated:', conversation)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced multi-turn conversation management for maintaining context and flow across multiple interactions.
            </p>
          </div>
        )}
      </div>
    );
  }
);

MultiTurnConversationsDemo.displayName = 'MultiTurnConversationsDemo';

// Export all components
export {
  multiTurnConversationsVariants,
  type MultiTurnConversationsToggleProps,
  type MultiTurnConversationsProviderProps,
  type MultiTurnConversationsManagerProps,
  type MultiTurnConversationsStatusProps,
  type MultiTurnConversationsDemoProps
};
