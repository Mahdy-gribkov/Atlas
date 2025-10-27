/**
 * Emoji Reactions Component
 * 
 * Provides emoji reaction capabilities for AI chat interface.
 * Implements emoji picker, reactions display, and interaction features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Emoji Reactions Variants
const emojiReactionsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'emoji-reactions-mode-standard',
        'enhanced': 'emoji-reactions-mode-enhanced',
        'advanced': 'emoji-reactions-mode-advanced',
        'custom': 'emoji-reactions-mode-custom'
      },
      type: {
        'picker': 'emoji-type-picker',
        'display': 'emoji-type-display',
        'quick': 'emoji-type-quick',
        'custom': 'emoji-type-custom',
        'mixed': 'emoji-type-mixed'
      },
      style: {
        'minimal': 'emoji-style-minimal',
        'moderate': 'emoji-style-moderate',
        'detailed': 'emoji-style-detailed',
        'custom': 'emoji-style-custom'
      },
      format: {
        'text': 'emoji-format-text',
        'visual': 'emoji-format-visual',
        'interactive': 'emoji-format-interactive',
        'mixed': 'emoji-format-mixed'
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

// Emoji Picker Props
interface EmojiPickerProps extends VariantProps<typeof emojiReactionsVariants> {
  className?: string;
  onEmojiSelect?: (emoji: string) => void;
  onClose?: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showCategories?: boolean;
  showSearch?: boolean;
  maxHeight?: number;
}

// Emoji Picker Component
export const EmojiPicker = React.forwardRef<HTMLDivElement, EmojiPickerProps>(
  ({ 
    className, 
    onEmojiSelect,
    onClose,
    position = 'top',
    showCategories = true,
    showSearch = true,
    maxHeight = 300,
    type = 'picker',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [selectedCategory, setSelectedCategory] = useState('smileys');
    const [searchQuery, setSearchQuery] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    const emojiCategories = {
      smileys: {
        name: 'Smileys & People',
        icon: '😀',
        emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']
      },
      animals: {
        name: 'Animals & Nature',
        icon: '🐶',
        emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🦍', '🦧', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🦄', '🐎', '🦓', '🦌', '🐂', '🐃', '🐄', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐐', '🐑', '🐏', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🐞', '🦗', '🕷️', '🕸️', '🦂', '🦟', '🦠', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🦄', '🐴', '🦓', '🦌', '🐂', '🐃', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌']
      },
      food: {
        name: 'Food & Drink',
        icon: '🍎',
        emojis: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫒', '🌽', '🥕', '🫑', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥙', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾']
      },
      travel: {
        name: 'Travel & Places',
        icon: '🚗',
        emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🛼', '🚁', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚀', '🛸', '🚉', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🎢', '🎡', '🎠', '⛵', '🛥️', '🚤', '⛴️', '🛳️', '🚢', '⚓', '🚧', '⛽', '🚨', '🚥', '🚦', '🛑', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🕋', '⛩️', '🛤️', '🛣️', '🗾', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉', '🌁']
      },
      activities: {
        name: 'Activities',
        icon: '⚽',
        emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🤹‍♀️', '🤹‍♂️', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🪘', '🥁', '🪗', '🎸', '🪕', '🎺', '🎷', '🪗', '🎻', '🪗', '🎲', '♠️', '♥️', '♦️', '♣️', '🃏', '🀄', '🎴', '🎯', '🎳', '🎮', '🕹️', '🎰', '🧩']
      }
    };

    const filteredEmojis = useCallback(() => {
      const category = emojiCategories[selectedCategory as keyof typeof emojiCategories];
      if (!category) return [];
      
      if (searchQuery) {
        return category.emojis.filter(emoji => 
          emoji.includes(searchQuery) || 
          emoji.charCodeAt(0).toString().includes(searchQuery)
        );
      }
      
      return category.emojis;
    }, [selectedCategory, searchQuery]);

    const handleEmojiClick = (emoji: string) => {
      onEmojiSelect?.(emoji);
      setIsVisible(false);
      onClose?.();
    };

    const positionClasses = {
      top: 'bottom-full mb-2',
      bottom: 'top-full mt-2',
      left: 'right-full mr-2',
      right: 'left-full ml-2'
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg',
          positionClasses[position],
          emojiReactionsVariants({ type, style }),
          className
        )}
        style={{ maxHeight: `${maxHeight}px` }}
        {...props}
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-600">
          {showSearch && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emojis..."
              className="w-full p-2 text-sm border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            />
          )}
          
          {showCategories && (
            <div className="flex gap-1 mt-2">
              {Object.entries(emojiCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    'p-1 rounded-md text-lg transition-colors duration-200',
                    selectedCategory === key 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                  title={category.name}
                >
                  {category.icon}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-3 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-8 gap-1">
            {filteredEmojis().map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="p-2 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                title={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

EmojiPicker.displayName = 'EmojiPicker';

// Emoji Display Props
interface EmojiDisplayProps {
  className?: string;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
  onReactionClick?: (emoji: string) => void;
  onReactionAdd?: (emoji: string) => void;
  onReactionRemove?: (emoji: string) => void;
  showUserList?: boolean;
  maxDisplay?: number;
}

// Emoji Display Component
export const EmojiDisplay = React.forwardRef<HTMLDivElement, EmojiDisplayProps>(
  ({ 
    className, 
    reactions,
    onReactionClick,
    onReactionAdd,
    onReactionRemove,
    showUserList = false,
    maxDisplay = 5,
    ...props 
  }, ref) => {
    const [showUserTooltip, setShowUserTooltip] = useState<string | null>(null);

    const handleReactionClick = (emoji: string) => {
      onReactionClick?.(emoji);
    };

    const handleReactionHover = (emoji: string) => {
      if (showUserList) {
        setShowUserTooltip(emoji);
      }
    };

    const handleReactionLeave = () => {
      setShowUserTooltip(null);
    };

    const sortedReactions = reactions
      .sort((a, b) => b.count - a.count)
      .slice(0, maxDisplay);

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-wrap gap-1',
          className
        )}
        {...props}
      >
        {sortedReactions.map((reaction) => (
          <div key={reaction.emoji} className="relative">
            <button
              onClick={() => handleReactionClick(reaction.emoji)}
              onMouseEnter={() => handleReactionHover(reaction.emoji)}
              onMouseLeave={handleReactionLeave}
              className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <span>{reaction.emoji}</span>
              <span className="text-gray-600 dark:text-gray-400">{reaction.count}</span>
            </button>
            
            {showUserTooltip === reaction.emoji && showUserList && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10">
                {reaction.users.join(', ')}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800" />
              </div>
            )}
          </div>
        ))}
        
        {reactions.length > maxDisplay && (
          <button className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            +{reactions.length - maxDisplay} more
          </button>
        )}
      </div>
    );
  }
);

EmojiDisplay.displayName = 'EmojiDisplay';

// Quick Reactions Props
interface QuickReactionsProps {
  className?: string;
  onReactionSelect?: (emoji: string) => void;
  reactions?: string[];
  showLabel?: boolean;
}

// Quick Reactions Component
export const QuickReactions = React.forwardRef<HTMLDivElement, QuickReactionsProps>(
  ({ 
    className, 
    onReactionSelect,
    reactions = ['👍', '👎', '❤️', '😂', '😮', '😢', '😡'],
    showLabel = true,
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2',
          className
        )}
        {...props}
      >
        {showLabel && (
          <span className="text-sm text-gray-600 dark:text-gray-400">Quick reactions:</span>
        )}
        
        <div className="flex gap-1">
          {reactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onReactionSelect?.(emoji)}
              className="p-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              title={emoji}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

QuickReactions.displayName = 'QuickReactions';

// Emoji Reactions Demo Component
interface EmojiReactionsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const EmojiReactionsDemo = React.forwardRef<HTMLDivElement, EmojiReactionsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [showPicker, setShowPicker] = useState(false);
    const [reactions, setReactions] = useState<Array<{
      emoji: string;
      count: number;
      users: string[];
    }>>([
      { emoji: '👍', count: 3, users: ['Alice', 'Bob', 'Charlie'] },
      { emoji: '❤️', count: 2, users: ['Alice', 'David'] },
      { emoji: '😂', count: 1, users: ['Eve'] }
    ]);

    const handleEmojiSelect = (emoji: string) => {
      setReactions(prev => {
        const existingReaction = prev.find(r => r.emoji === emoji);
        if (existingReaction) {
          return prev.map(r => 
            r.emoji === emoji 
              ? { ...r, count: r.count + 1, users: [...r.users, 'You'] }
              : r
          );
        } else {
          return [...prev, { emoji, count: 1, users: ['You'] }];
        }
      });
      setShowPicker(false);
    };

    const handleQuickReaction = (emoji: string) => {
      handleEmojiSelect(emoji);
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
          Emoji Reactions Demo
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Emoji Display
            </h4>
            <EmojiDisplay
              reactions={reactions}
              onReactionClick={(emoji) => console.log('Reaction clicked:', emoji)}
              showUserList={true}
              maxDisplay={5}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Quick Reactions
            </h4>
            <QuickReactions
              onReactionSelect={handleQuickReaction}
              showLabel={true}
            />
          </div>
          
          <div className="relative">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Emoji Picker
            </h4>
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              {showPicker ? 'Close Picker' : 'Open Emoji Picker'}
            </button>
            
            {showPicker && (
              <div className="relative">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setShowPicker(false)}
                  position="bottom"
                  showCategories={true}
                  showSearch={true}
                  maxHeight={300}
                />
              </div>
            )}
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interactive emoji reactions with picker, quick reactions, and user tracking.
            </p>
          </div>
        )}
      </div>
    );
  }
);

EmojiReactionsDemo.displayName = 'EmojiReactionsDemo';

// Export all components
export {
  emojiReactionsVariants,
  type EmojiPickerProps,
  type EmojiDisplayProps,
  type QuickReactionsProps,
  type EmojiReactionsDemoProps
};
