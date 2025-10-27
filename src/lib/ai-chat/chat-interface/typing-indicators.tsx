/**
 * Typing Indicators Component
 * 
 * Provides typing indicators and status displays for AI chat interface.
 * Implements real-time typing status and activity indicators.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Typing Indicators Variants
const typingIndicatorsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'typing-indicators-mode-standard',
        'enhanced': 'typing-indicators-mode-enhanced',
        'advanced': 'typing-indicators-mode-advanced',
        'custom': 'typing-indicators-mode-custom'
      },
      type: {
        'dots': 'typing-type-dots',
        'wave': 'typing-type-wave',
        'pulse': 'typing-type-pulse',
        'text': 'typing-type-text',
        'mixed': 'typing-type-mixed'
      },
      style: {
        'minimal': 'typing-style-minimal',
        'moderate': 'typing-style-moderate',
        'detailed': 'typing-style-detailed',
        'custom': 'typing-style-custom'
      },
      format: {
        'text': 'typing-format-text',
        'visual': 'typing-format-visual',
        'interactive': 'typing-format-interactive',
        'mixed': 'typing-format-mixed'
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

// Typing Indicator Props
interface TypingIndicatorProps extends VariantProps<typeof typingIndicatorsVariants> {
  className?: string;
  isTyping?: boolean;
  user?: {
    name: string;
    avatar?: string;
    color?: string;
  };
  message?: string;
  duration?: number;
  onComplete?: () => void;
  showAvatar?: boolean;
  showName?: boolean;
  showMessage?: boolean;
}

// Typing Indicator Component
export const TypingIndicator = React.forwardRef<HTMLDivElement, TypingIndicatorProps>(
  ({ 
    className, 
    isTyping = false,
    user = { name: 'AI Assistant', avatar: '🤖', color: 'blue' },
    message = 'is typing...',
    duration = 3000,
    onComplete,
    showAvatar = true,
    showName = true,
    showMessage = true,
    type = 'dots',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [animationStep, setAnimationStep] = useState(0);
    const [isVisible, setIsVisible] = useState(isTyping);

    useEffect(() => {
      setIsVisible(isTyping);
      
      if (isTyping) {
        const interval = setInterval(() => {
          setAnimationStep(prev => (prev + 1) % 3);
        }, 500);
        
        const timeout = setTimeout(() => {
          setIsVisible(false);
          onComplete?.();
        }, duration);
        
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      } else {
        setAnimationStep(0);
      }
    }, [isTyping, duration, onComplete]);

    const getColorClasses = (color: string) => {
      switch (color) {
        case 'blue': return 'bg-blue-500';
        case 'green': return 'bg-green-500';
        case 'purple': return 'bg-purple-500';
        case 'orange': return 'bg-orange-500';
        case 'pink': return 'bg-pink-500';
        default: return 'bg-gray-500';
      }
    };

    const renderDots = () => (
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-all duration-300',
              getColorClasses(user.color || 'blue'),
              animationStep === index ? 'opacity-100 scale-110' : 'opacity-40 scale-100'
            )}
            style={{
              animationDelay: `${index * 200}ms`
            }}
          />
        ))}
      </div>
    );

    const renderWave = () => (
      <div className="flex items-center gap-1">
        {[0, 1, 2, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              'w-1 h-4 rounded-full transition-all duration-300',
              getColorClasses(user.color || 'blue'),
              animationStep === index ? 'opacity-100' : 'opacity-40'
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              transform: `scaleY(${animationStep === index ? 1.5 : 0.8})`
            }}
          />
        ))}
      </div>
    );

    const renderPulse = () => (
      <div className="flex items-center">
        <div
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-500',
            getColorClasses(user.color || 'blue'),
            'animate-pulse'
          )}
        />
      </div>
    );

    const renderText = () => (
      <div className="flex items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {message}
        </span>
      </div>
    );

    const renderIndicator = () => {
      switch (type) {
        case 'dots': return renderDots();
        case 'wave': return renderWave();
        case 'pulse': return renderPulse();
        case 'text': return renderText();
        default: return renderDots();
      }
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg',
          typingIndicatorsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {showAvatar && (
          <div className="flex-shrink-0">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium', getColorClasses(user.color || 'blue'))}>
              {user.avatar || '👤'}
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {renderIndicator()}
          
          {showName && showMessage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{user.name}</span> {message}
            </span>
          )}
          
          {showName && !showMessage && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {user.name}
            </span>
          )}
          
          {!showName && showMessage && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {message}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TypingIndicator.displayName = 'TypingIndicator';

// Typing Status Props
interface TypingStatusProps {
  className?: string;
  users: Array<{
    id: string;
    name: string;
    avatar?: string;
    color?: string;
    isTyping: boolean;
    lastSeen?: Date;
  }>;
  maxDisplay?: number;
  onUserClick?: (userId: string) => void;
  showLastSeen?: boolean;
}

// Typing Status Component
export const TypingStatus = React.forwardRef<HTMLDivElement, TypingStatusProps>(
  ({ 
    className, 
    users,
    maxDisplay = 3,
    onUserClick,
    showLastSeen = false,
    ...props 
  }, ref) => {
    const typingUsers = users.filter(user => user.isTyping);
    const visibleUsers = typingUsers.slice(0, maxDisplay);
    const remainingCount = typingUsers.length - maxDisplay;

    const formatLastSeen = (date: Date) => {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      
      if (minutes < 1) return 'just now';
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    };

    if (typingUsers.length === 0) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-2',
          className
        )}
        {...props}
      >
        {visibleUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors duration-200"
            onClick={() => onUserClick?.(user.id)}
          >
            <div className="flex-shrink-0">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium',
                user.color === 'blue' ? 'bg-blue-500' :
                user.color === 'green' ? 'bg-green-500' :
                user.color === 'purple' ? 'bg-purple-500' :
                user.color === 'orange' ? 'bg-orange-500' :
                user.color === 'pink' ? 'bg-pink-500' :
                'bg-gray-500'
              )}>
                {user.avatar || '👤'}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {user.name}
              </div>
              {showLastSeen && user.lastSeen && (
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Last seen {formatLastSeen(user.lastSeen)}
                </div>
              )}
            </div>
            
            <div className="flex-shrink-0">
              <TypingIndicator
                isTyping={user.isTyping}
                type="dots"
                style="minimal"
                showAvatar={false}
                showName={false}
                showMessage={false}
                user={user}
              />
            </div>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-500 text-center py-2">
            +{remainingCount} more {remainingCount === 1 ? 'person' : 'people'} typing...
          </div>
        )}
      </div>
    );
  }
);

TypingStatus.displayName = 'TypingStatus';

// Typing Manager Props
interface TypingManagerProps {
  className?: string;
  onTypingStart?: (userId: string) => void;
  onTypingStop?: (userId: string) => void;
  onTypingUpdate?: (typingUsers: string[]) => void;
  typingTimeout?: number;
  debounceDelay?: number;
}

// Typing Manager Component
export const TypingManager = React.forwardRef<HTMLDivElement, TypingManagerProps>(
  ({ 
    className, 
    onTypingStart,
    onTypingStop,
    onTypingUpdate,
    typingTimeout = 3000,
    debounceDelay = 500,
    ...props 
  }, ref) => {
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
    const [typingTimers, setTypingTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());
    const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());

    const startTyping = useCallback((userId: string) => {
      // Clear existing debounce timer
      const existingDebounce = debounceTimers.current.get(userId);
      if (existingDebounce) {
        clearTimeout(existingDebounce);
      }

      // Set new debounce timer
      const debounceTimer = setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (!newSet.has(userId)) {
            newSet.add(userId);
            onTypingStart?.(userId);
            return newSet;
          }
          return prev;
        });

        // Set timeout to stop typing
        const timer = setTimeout(() => {
          stopTyping(userId);
        }, typingTimeout);

        setTypingTimers(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, timer);
          return newMap;
        });
      }, debounceDelay);

      debounceTimers.current.set(userId, debounceTimer);
    }, [typingTimeout, debounceDelay, onTypingStart]);

    const stopTyping = useCallback((userId: string) => {
      // Clear debounce timer
      const debounceTimer = debounceTimers.current.get(userId);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimers.current.delete(userId);
      }

      // Clear typing timer
      const typingTimer = typingTimers.get(userId);
      if (typingTimer) {
        clearTimeout(typingTimer);
        setTypingTimers(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }

      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(userId)) {
          newSet.delete(userId);
          onTypingStop?.(userId);
          return newSet;
        }
        return prev;
      });
    }, [onTypingStop]);

    const updateTyping = useCallback((userId: string, isTyping: boolean) => {
      if (isTyping) {
        startTyping(userId);
      } else {
        stopTyping(userId);
      }
    }, [startTyping, stopTyping]);

    useEffect(() => {
      onTypingUpdate?.(Array.from(typingUsers));
    }, [typingUsers, onTypingUpdate]);

    // Expose methods for external use
    React.useImperativeHandle(ref, () => ({
      startTyping,
      stopTyping,
      updateTyping,
      getTypingUsers: () => Array.from(typingUsers)
    }));

    return (
      <div
        ref={ref}
        className={cn(
          'hidden', // This component is for logic only
          className
        )}
        {...props}
      />
    );
  }
);

TypingManager.displayName = 'TypingManager';

// Typing Indicators Demo Component
interface TypingIndicatorsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TypingIndicatorsDemo = React.forwardRef<HTMLDivElement, TypingIndicatorsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState([
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: '👩',
        color: 'blue',
        isTyping: false,
        lastSeen: new Date(Date.now() - 300000)
      },
      {
        id: '2',
        name: 'Marcus Johnson',
        avatar: '👨',
        color: 'green',
        isTyping: true,
        lastSeen: new Date(Date.now() - 120000)
      },
      {
        id: '3',
        name: 'Elena Rodriguez',
        avatar: '👩',
        color: 'purple',
        isTyping: true,
        lastSeen: new Date(Date.now() - 60000)
      }
    ]);

    const toggleTyping = () => {
      setIsTyping(!isTyping);
    };

    const toggleUserTyping = (userId: string) => {
      setTypingUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isTyping: !user.isTyping }
          : user
      ));
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Typing Indicators Demo
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Single Typing Indicator
            </h4>
            <div className="space-y-3">
              <TypingIndicator
                isTyping={isTyping}
                user={{ name: 'AI Assistant', avatar: '🤖', color: 'blue' }}
                message="is thinking..."
                type="dots"
              />
              
              <TypingIndicator
                isTyping={isTyping}
                user={{ name: 'AI Assistant', avatar: '🤖', color: 'green' }}
                message="is typing..."
                type="wave"
              />
              
              <TypingIndicator
                isTyping={isTyping}
                user={{ name: 'AI Assistant', avatar: '🤖', color: 'purple' }}
                message="is processing..."
                type="pulse"
              />
              
              <button
                onClick={toggleTyping}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                {isTyping ? 'Stop Typing' : 'Start Typing'}
              </button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Multiple Users Typing
            </h4>
            <TypingStatus
              users={typingUsers}
              maxDisplay={2}
              showLastSeen={true}
              onUserClick={toggleUserTyping}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Typing Manager
            </h4>
            <TypingManager
              onTypingStart={(userId) => console.log('User started typing:', userId)}
              onTypingStop={(userId) => console.log('User stopped typing:', userId)}
              onTypingUpdate={(users) => console.log('Typing users:', users)}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Check console for typing events
            </div>
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time typing indicators with multiple animation styles and user management.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TypingIndicatorsDemo.displayName = 'TypingIndicatorsDemo';

// Export all components
export {
  typingIndicatorsVariants,
  type TypingIndicatorProps,
  type TypingStatusProps,
  type TypingManagerProps,
  type TypingIndicatorsDemoProps
};
