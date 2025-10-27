/**
 * Conversation History Component
 * 
 * Provides conversation history support for AI chat interface.
 * Implements advanced conversation tracking and management for travel agent interactions.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Conversation History Variants
const conversationHistoryVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'conversation-history-mode-standard',
        'enhanced': 'conversation-history-mode-enhanced',
        'advanced': 'conversation-history-mode-advanced',
        'custom': 'conversation-history-mode-custom'
      },
      type: {
        'session': 'history-type-session',
        'persistent': 'history-type-persistent',
        'searchable': 'history-type-searchable',
        'analytics': 'history-type-analytics',
        'mixed': 'history-type-mixed'
      },
      style: {
        'minimal': 'history-style-minimal',
        'moderate': 'history-style-moderate',
        'detailed': 'history-style-detailed',
        'custom': 'history-style-custom'
      },
      format: {
        'text': 'history-format-text',
        'visual': 'history-format-visual',
        'interactive': 'history-format-interactive',
        'mixed': 'history-format-mixed'
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

// Conversation History Toggle Props
interface ConversationHistoryToggleProps extends VariantProps<typeof conversationHistoryVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Conversation History Toggle Component
export const ConversationHistoryToggle = React.forwardRef<HTMLButtonElement, ConversationHistoryToggleProps>(
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
            ? 'bg-sky-600 text-white border-sky-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable conversation history' : 'Enable conversation history'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Conversation history enabled' : 'Conversation history disabled'}
          </span>
        )}
      </button>
    );
  }
);

ConversationHistoryToggle.displayName = 'ConversationHistoryToggle';

// Conversation History Provider Props
interface ConversationHistoryProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'session' | 'persistent' | 'searchable' | 'analytics' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Conversation History Provider Component
export const ConversationHistoryProvider = React.forwardRef<HTMLDivElement, ConversationHistoryProviderProps>(
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
        // Remove existing conversation history classes
        document.body.classList.remove(
          'conversation-history-mode-standard',
          'conversation-history-mode-enhanced',
          'conversation-history-mode-advanced',
          'conversation-history-mode-custom'
        );
        
        document.body.classList.add(`conversation-history-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          conversationHistoryVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ConversationHistoryProvider.displayName = 'ConversationHistoryProvider';

// Conversation History Manager Component
interface ConversationHistoryManagerProps extends VariantProps<typeof conversationHistoryVariants> {
  className?: string;
  onHistoryUpdate?: (history: any) => void;
  type?: 'session' | 'persistent' | 'searchable' | 'analytics' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const ConversationHistoryManager = React.forwardRef<HTMLDivElement, ConversationHistoryManagerProps>(
  ({ 
    className, 
    onHistoryUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [history, setHistory] = useState({
      conversations: [
        {
          id: 1,
          title: 'Paris Trip Planning',
          date: '2024-01-15',
          duration: '45 minutes',
          messageCount: 12,
          status: 'completed',
          topics: ['destination', 'accommodation', 'activities'],
          summary: 'Planned a 7-day trip to Paris with hotel recommendations and activity suggestions'
        },
        {
          id: 2,
          title: 'Tokyo Adventure',
          date: '2024-01-10',
          duration: '30 minutes',
          messageCount: 8,
          status: 'in_progress',
          topics: ['destination', 'culture', 'food'],
          summary: 'Exploring Tokyo travel options and cultural experiences'
        },
        {
          id: 3,
          title: 'Budget Travel Tips',
          date: '2024-01-08',
          duration: '20 minutes',
          messageCount: 6,
          status: 'completed',
          topics: ['budget', 'tips', 'accommodation'],
          summary: 'Discussed budget-friendly travel options and money-saving tips'
        }
      ],
      currentSession: {
        id: 4,
        startTime: new Date().toISOString(),
        messageCount: 0,
        topics: [],
        status: 'active'
      },
      analytics: {
        totalConversations: 3,
        totalMessages: 26,
        averageDuration: '32 minutes',
        mostCommonTopics: ['destination', 'accommodation', 'activities'],
        userSatisfaction: 92
      },
      searchQuery: '',
      filteredConversations: []
    });

    const [isActive, setIsActive] = useState(false);

    const searchConversations = useCallback((query: string) => {
      setHistory(prev => ({
        ...prev,
        searchQuery: query,
        filteredConversations: query 
          ? prev.conversations.filter(conv => 
              conv.title.toLowerCase().includes(query.toLowerCase()) ||
              conv.summary.toLowerCase().includes(query.toLowerCase()) ||
              conv.topics.some(topic => topic.toLowerCase().includes(query.toLowerCase()))
            )
          : []
      }));
    }, []);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'text-green-600 dark:text-green-400';
        case 'in_progress': return 'text-yellow-600 dark:text-yellow-400';
        case 'active': return 'text-blue-600 dark:text-blue-400';
        case 'cancelled': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'completed': return '✅';
        case 'in_progress': return '🔄';
        case 'active': return '🟢';
        case 'cancelled': return '❌';
        default: return '❓';
      }
    };

    const getTopicIcon = (topic: string) => {
      switch (topic) {
        case 'destination': return '🗺️';
        case 'accommodation': return '🏨';
        case 'activities': return '🎯';
        case 'budget': return '💰';
        case 'culture': return '🏛️';
        case 'food': return '🍽️';
        case 'tips': return '💡';
        default: return '📝';
      }
    };

    const conversationsToShow = history.searchQuery ? history.filteredConversations : history.conversations;

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          conversationHistoryVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Conversation History
          </h3>
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors duration-200',
              isActive 
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-sky-50 rounded-md dark:bg-sky-900/20">
              <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                {history.analytics.totalConversations}
              </div>
              <div className="text-sm text-sky-600 dark:text-sky-400">
                Conversations
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {history.analytics.totalMessages}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Messages
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {history.analytics.averageDuration}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Avg Duration
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {history.analytics.userSatisfaction}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Satisfaction
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Search Conversations
              </h4>
              <input
                type="text"
                value={history.searchQuery}
                onChange={(e) => searchConversations(e.target.value)}
                placeholder="Search conversations..."
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {history.searchQuery ? 'Search Results' : 'Recent Conversations'}
              </h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {conversationsToShow.map((conversation) => (
                  <div key={conversation.id} className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {conversation.title}
                      </h5>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getStatusIcon(conversation.status)}</span>
                        <span className={cn('text-xs font-medium', getStatusColor(conversation.status))}>
                          {conversation.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                      <span>{conversation.date}</span>
                      <span>{conversation.duration}</span>
                      <span>{conversation.messageCount} messages</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {conversation.summary}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {conversation.topics.map((topic) => (
                        <span 
                          key={topic}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200"
                        >
                          {getTopicIcon(topic)} {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Current Session
              </h4>
              <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Session #{history.currentSession.id}
                  </span>
                  <span className="text-sm">{getStatusIcon(history.currentSession.status)}</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Started: {new Date(history.currentSession.startTime).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Messages: {history.currentSession.messageCount}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Most Common Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {history.analytics.mostCommonTopics.map((topic) => (
                  <span 
                    key={topic}
                    className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200"
                  >
                    {getTopicIcon(topic)} {topic}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setHistory(prev => ({ ...prev, analytics: { ...prev.analytics, userSatisfaction: 95, totalConversations: 4 } }))}
                className="px-3 py-1 text-sm bg-sky-600 text-white rounded-md hover:bg-sky-700"
              >
                Update Analytics
              </button>
              <button
                onClick={() => setHistory(prev => ({ ...prev, searchQuery: '', filteredConversations: [] }))}
                className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConversationHistoryManager.displayName = 'ConversationHistoryManager';

// Conversation History Status Component
interface ConversationHistoryStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ConversationHistoryStatus = React.forwardRef<HTMLDivElement, ConversationHistoryStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-sky-500" />
        <span className="font-medium">
          Conversation History: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced conversation history tracking and analytics' 
              : 'Basic conversation tracking'
            }
          </div>
        )}
      </div>
    );
  }
);

ConversationHistoryStatus.displayName = 'ConversationHistoryStatus';

// Conversation History Demo Component
interface ConversationHistoryDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ConversationHistoryDemo = React.forwardRef<HTMLDivElement, ConversationHistoryDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Conversation History Demo</h3>
        
        <ConversationHistoryManager
          mode="enhanced"
          type="mixed"
          style="detailed"
          onHistoryUpdate={(history) => console.log('History updated:', history)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced conversation history tracking for maintaining context and providing personalized experiences.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ConversationHistoryDemo.displayName = 'ConversationHistoryDemo';

// Export all components
export {
  conversationHistoryVariants,
  type ConversationHistoryToggleProps,
  type ConversationHistoryProviderProps,
  type ConversationHistoryManagerProps,
  type ConversationHistoryStatusProps,
  type ConversationHistoryDemoProps
};
