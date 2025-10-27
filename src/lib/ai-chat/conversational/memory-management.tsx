/**
 * Memory Management Component
 * 
 * Provides memory management support for AI chat interface.
 * Implements advanced memory systems for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Memory Management Variants
const memoryManagementVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'memory-management-mode-standard',
        'enhanced': 'memory-management-mode-enhanced',
        'advanced': 'memory-management-mode-advanced',
        'custom': 'memory-management-mode-custom'
      },
      type: {
        'short-term': 'memory-type-short-term',
        'long-term': 'memory-type-long-term',
        'episodic': 'memory-type-episodic',
        'semantic': 'memory-type-semantic',
        'mixed': 'memory-type-mixed'
      },
      style: {
        'minimal': 'memory-style-minimal',
        'moderate': 'memory-style-moderate',
        'detailed': 'memory-style-detailed',
        'custom': 'memory-style-custom'
      },
      format: {
        'text': 'memory-format-text',
        'visual': 'memory-format-visual',
        'interactive': 'memory-format-interactive',
        'mixed': 'memory-format-mixed'
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

// Memory Management Toggle Props
interface MemoryManagementToggleProps extends VariantProps<typeof memoryManagementVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Memory Management Toggle Component
export const MemoryManagementToggle = React.forwardRef<HTMLButtonElement, MemoryManagementToggleProps>(
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
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable memory management' : 'Enable memory management'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Memory management enabled' : 'Memory management disabled'}
          </span>
        )}
      </button>
    );
  }
);

MemoryManagementToggle.displayName = 'MemoryManagementToggle';

// Memory Management Provider Props
interface MemoryManagementProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'short-term' | 'long-term' | 'episodic' | 'semantic' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Memory Management Provider Component
export const MemoryManagementProvider = React.forwardRef<HTMLDivElement, MemoryManagementProviderProps>(
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
        // Remove existing memory management classes
        document.body.classList.remove(
          'memory-management-mode-standard',
          'memory-management-mode-enhanced',
          'memory-management-mode-advanced',
          'memory-management-mode-custom'
        );
        
        document.body.classList.add(`memory-management-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          memoryManagementVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MemoryManagementProvider.displayName = 'MemoryManagementProvider';

// Memory Manager Component
interface MemoryManagerProps extends VariantProps<typeof memoryManagementVariants> {
  className?: string;
  onMemoryUpdate?: (memory: any) => void;
  type?: 'short-term' | 'long-term' | 'episodic' | 'semantic' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const MemoryManager = React.forwardRef<HTMLDivElement, MemoryManagerProps>(
  ({ 
    className, 
    onMemoryUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [memory, setMemory] = useState({
      shortTerm: {
        currentConversation: [],
        activeContext: {},
        immediateGoals: [],
        recentInteractions: []
      },
      longTerm: {
        userProfile: {
          preferences: {},
          travelHistory: [],
          relationships: {},
          learnedPatterns: []
        },
        knowledgeBase: {
          destinations: [],
          travelTips: [],
          culturalInsights: [],
          localRecommendations: []
        }
      },
      episodic: {
        pastTrips: [],
        memorableExperiences: [],
        userStories: [],
        sharedMoments: []
      },
      semantic: {
        travelConcepts: {},
        destinationKnowledge: {},
        culturalUnderstanding: {},
        languagePatterns: {}
      }
    });

    const [isActive, setIsActive] = useState(false);
    const [memoryStats, setMemoryStats] = useState({
      totalMemories: 0,
      shortTermCount: 0,
      longTermCount: 0,
      episodicCount: 0,
      semanticCount: 0
    });

    const updateMemory = useCallback((newMemory: any) => {
      setMemory(prev => ({
        ...prev,
        ...newMemory
      }));
      onMemoryUpdate?.(newMemory);
    }, [onMemoryUpdate]);

    const addShortTermMemory = useCallback((memoryItem: any) => {
      setMemory(prev => ({
        ...prev,
        shortTerm: {
          ...prev.shortTerm,
          currentConversation: [...prev.shortTerm.currentConversation, memoryItem]
        }
      }));
    }, []);

    const consolidateToLongTerm = useCallback(() => {
      // Simulate memory consolidation
      setMemory(prev => ({
        ...prev,
        longTerm: {
          ...prev.longTerm,
          userProfile: {
            ...prev.longTerm.userProfile,
            learnedPatterns: [...prev.longTerm.userProfile.learnedPatterns, {
              pattern: 'user_prefers_adventure_travel',
              confidence: 0.85,
              timestamp: new Date().toISOString()
            }]
          }
        }
      }));
    }, []);

    const getMemoryIcon = (memoryType: string) => {
      switch (memoryType) {
        case 'short-term': return '🧠';
        case 'long-term': return '💾';
        case 'episodic': return '📚';
        case 'semantic': return '🔍';
        default: return '🧠';
      }
    };

    const getMemoryColor = (memoryType: string) => {
      switch (memoryType) {
        case 'short-term': return 'text-blue-600 dark:text-blue-400';
        case 'long-term': return 'text-green-600 dark:text-green-400';
        case 'episodic': return 'text-purple-600 dark:text-purple-400';
        case 'semantic': return 'text-orange-600 dark:text-orange-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    useEffect(() => {
      // Update memory stats
      const stats = {
        totalMemories: memory.shortTerm.currentConversation.length + 
                      Object.keys(memory.longTerm.userProfile.preferences).length +
                      memory.episodic.pastTrips.length +
                      Object.keys(memory.semantic.travelConcepts).length,
        shortTermCount: memory.shortTerm.currentConversation.length,
        longTermCount: Object.keys(memory.longTerm.userProfile.preferences).length,
        episodicCount: memory.episodic.pastTrips.length,
        semanticCount: Object.keys(memory.semantic.travelConcepts).length
      };
      setMemoryStats(stats);
    }, [memory]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          memoryManagementVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Memory Management
          </h3>
          <button
            onClick={() => setIsActive(!isActive)}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors duration-200',
              isActive 
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
            )}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {memoryStats.shortTermCount}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Short-term
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {memoryStats.longTermCount}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Long-term
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {memoryStats.episodicCount}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Episodic
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {memoryStats.semanticCount}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Semantic
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Memory Types
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { type: 'short-term', name: 'Short-term Memory', description: 'Current conversation and immediate context' },
                  { type: 'long-term', name: 'Long-term Memory', description: 'User profile and persistent knowledge' },
                  { type: 'episodic', name: 'Episodic Memory', description: 'Past experiences and stories' },
                  { type: 'semantic', name: 'Semantic Memory', description: 'Knowledge and concepts' }
                ].map((memoryType) => (
                  <div key={memoryType.type} className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getMemoryIcon(memoryType.type)}</span>
                      <span className={cn('text-sm font-semibold', getMemoryColor(memoryType.type))}>
                        {memoryType.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {memoryType.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Memory Operations
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={addShortTermMemory}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Memory
                </button>
                <button
                  onClick={consolidateToLongTerm}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Consolidate
                </button>
                <button
                  onClick={() => setMemory({
                    shortTerm: { currentConversation: [], activeContext: {}, immediateGoals: [], recentInteractions: [] },
                    longTerm: { userProfile: { preferences: {}, travelHistory: [], relationships: {}, learnedPatterns: [] }, knowledgeBase: { destinations: [], travelTips: [], culturalInsights: [], localRecommendations: [] } },
                    episodic: { pastTrips: [], memorableExperiences: [], userStories: [], sharedMoments: [] },
                    semantic: { travelConcepts: {}, destinationKnowledge: {}, culturalUnderstanding: {}, languagePatterns: {} }
                  })}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Memory Statistics
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="mb-1">
                  <strong>Total Memories:</strong> {memoryStats.totalMemories}
                </div>
                <div className="mb-1">
                  <strong>Memory Efficiency:</strong> {Math.round((memoryStats.totalMemories / 100) * 100)}%
                </div>
                <div>
                  <strong>Last Updated:</strong> {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

MemoryManager.displayName = 'MemoryManager';

// Memory Management Status Component
interface MemoryManagementStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const MemoryManagementStatus = React.forwardRef<HTMLDivElement, MemoryManagementStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-purple-500" />
        <span className="font-medium">
          Memory Management: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced memory management and consolidation' 
              : 'Basic conversation tracking'
            }
          </div>
        )}
      </div>
    );
  }
);

MemoryManagementStatus.displayName = 'MemoryManagementStatus';

// Memory Management Demo Component
interface MemoryManagementDemoProps {
  className?: string;
  showControls?: boolean;
}

export const MemoryManagementDemo = React.forwardRef<HTMLDivElement, MemoryManagementDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Memory Management Demo</h3>
        
        <MemoryManager
          mode="enhanced"
          type="mixed"
          style="detailed"
          onMemoryUpdate={(memory) => console.log('Memory updated:', memory)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced memory management for maintaining conversation context, user preferences, and learned patterns.
            </p>
          </div>
        )}
      </div>
    );
  }
);

MemoryManagementDemo.displayName = 'MemoryManagementDemo';

// Export all components
export {
  memoryManagementVariants,
  type MemoryManagementToggleProps,
  type MemoryManagementProviderProps,
  type MemoryManagerProps,
  type MemoryManagementStatusProps,
  type MemoryManagementDemoProps
};
