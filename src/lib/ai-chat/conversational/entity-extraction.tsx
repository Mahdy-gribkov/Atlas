/**
 * Entity Extraction Component
 * 
 * Provides entity extraction support for AI chat interface.
 * Implements advanced entity recognition for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Entity Extraction Variants
const entityExtractionVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'entity-extraction-mode-standard',
        'enhanced': 'entity-extraction-mode-enhanced',
        'advanced': 'entity-extraction-mode-advanced',
        'custom': 'entity-extraction-mode-custom'
      },
      type: {
        'location': 'entity-type-location',
        'temporal': 'entity-type-temporal',
        'person': 'entity-type-person',
        'organization': 'entity-type-organization',
        'mixed': 'entity-type-mixed'
      },
      style: {
        'minimal': 'entity-style-minimal',
        'moderate': 'entity-style-moderate',
        'detailed': 'entity-style-detailed',
        'custom': 'entity-style-custom'
      },
      format: {
        'text': 'entity-format-text',
        'visual': 'entity-format-visual',
        'interactive': 'entity-format-interactive',
        'mixed': 'entity-format-mixed'
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

// Entity Extraction Toggle Props
interface EntityExtractionToggleProps extends VariantProps<typeof entityExtractionVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Entity Extraction Toggle Component
export const EntityExtractionToggle = React.forwardRef<HTMLButtonElement, EntityExtractionToggleProps>(
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
            ? 'bg-amber-600 text-white border-amber-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable entity extraction' : 'Enable entity extraction'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Entity extraction enabled' : 'Entity extraction disabled'}
          </span>
        )}
      </button>
    );
  }
);

EntityExtractionToggle.displayName = 'EntityExtractionToggle';

// Entity Extraction Provider Props
interface EntityExtractionProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'location' | 'temporal' | 'person' | 'organization' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Entity Extraction Provider Component
export const EntityExtractionProvider = React.forwardRef<HTMLDivElement, EntityExtractionProviderProps>(
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
        // Remove existing entity extraction classes
        document.body.classList.remove(
          'entity-extraction-mode-standard',
          'entity-extraction-mode-enhanced',
          'entity-extraction-mode-advanced',
          'entity-extraction-mode-custom'
        );
        
        document.body.classList.add(`entity-extraction-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          entityExtractionVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

EntityExtractionProvider.displayName = 'EntityExtractionProvider';

// Entity Extraction Engine Component
interface EntityExtractionEngineProps extends VariantProps<typeof entityExtractionVariants> {
  className?: string;
  onEntitiesExtracted?: (entities: any) => void;
  type?: 'location' | 'temporal' | 'person' | 'organization' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const EntityExtractionEngine = React.forwardRef<HTMLDivElement, EntityExtractionEngineProps>(
  ({ 
    className, 
    onEntitiesExtracted,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedEntities, setExtractedEntities] = useState<any[]>([]);
    const [entityHistory, setEntityHistory] = useState<any[]>([]);

    const entityTypes = {
      location: {
        name: 'Location',
        icon: '📍',
        color: 'text-blue-600 dark:text-blue-400',
        examples: ['Paris', 'New York', 'Tokyo', 'London', 'Sydney']
      },
      temporal: {
        name: 'Temporal',
        icon: '📅',
        color: 'text-green-600 dark:text-green-400',
        examples: ['June 15', 'next week', 'tomorrow', 'summer', '2024']
      },
      person: {
        name: 'Person',
        icon: '👤',
        color: 'text-purple-600 dark:text-purple-400',
        examples: ['John', 'Maria', 'Dr. Smith', 'tour guide', 'family']
      },
      organization: {
        name: 'Organization',
        icon: '🏢',
        color: 'text-orange-600 dark:text-orange-400',
        examples: ['Airbnb', 'Marriott', 'TripAdvisor', 'UNESCO', 'museum']
      },
      money: {
        name: 'Money',
        icon: '💰',
        color: 'text-yellow-600 dark:text-yellow-400',
        examples: ['$500', '1000 euros', 'budget', 'expensive', 'cheap']
      },
      activity: {
        name: 'Activity',
        icon: '🎯',
        color: 'text-red-600 dark:text-red-400',
        examples: ['hiking', 'museum visit', 'dining', 'shopping', 'sightseeing']
      }
    };

    const handleExtractEntities = useCallback(async () => {
      if (input.trim()) {
        setIsProcessing(true);
        
        // Simulate entity extraction
        setTimeout(() => {
          const mockEntities = [
            { 
              type: 'location', 
              value: 'Paris', 
              confidence: 0.95, 
              start: 0, 
              end: 5,
              context: 'I want to visit Paris next summer'
            },
            { 
              type: 'temporal', 
              value: 'next summer', 
              confidence: 0.88, 
              start: 20, 
              end: 31,
              context: 'I want to visit Paris next summer'
            },
            { 
              type: 'money', 
              value: '$2000', 
              confidence: 0.92, 
              start: 35, 
              end: 40,
              context: 'with a budget of $2000'
            },
            { 
              type: 'activity', 
              value: 'museums', 
              confidence: 0.85, 
              start: 45, 
              end: 52,
              context: 'and visit museums'
            }
          ];
          
          setExtractedEntities(mockEntities);
          setEntityHistory(prev => [mockEntities, ...prev.slice(0, 4)]);
          setIsProcessing(false);
          onEntitiesExtracted?.(mockEntities);
        }, 2000);
      }
    }, [input, onEntitiesExtracted]);

    const getEntityIcon = (entityType: string) => {
      return entityTypes[entityType as keyof typeof entityTypes]?.icon || '🏷️';
    };

    const getEntityColor = (entityType: string) => {
      return entityTypes[entityType as keyof typeof entityTypes]?.color || 'text-gray-600 dark:text-gray-400';
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
      if (confidence >= 0.8) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 0.7) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const highlightEntities = (text: string, entities: any[]) => {
      let highlightedText = text;
      entities.forEach((entity, index) => {
        const before = highlightedText.substring(0, entity.start);
        const after = highlightedText.substring(entity.end);
        const entityText = highlightedText.substring(entity.start, entity.end);
        highlightedText = before + `<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">${entityText}</mark>` + after;
      });
      return highlightedText;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          entityExtractionVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Entity Extraction Engine
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Text
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Enter text to extract entities..."
            />
          </div>
          
          <button
            onClick={handleExtractEntities}
            disabled={!input.trim() || isProcessing}
            className="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Extracting Entities...' : 'Extract Entities'}
          </button>
          
          {extractedEntities.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg dark:bg-amber-900/20">
                <h4 className="text-md font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  Extracted Entities
                </h4>
                <div className="space-y-2">
                  {extractedEntities.map((entity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-md dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEntityIcon(entity.type)}</span>
                        <span className={cn('text-sm font-medium', getEntityColor(entity.type))}>
                          {entityTypes[entity.type as keyof typeof entityTypes]?.name}
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          "{entity.value}"
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          {entity.start}-{entity.end}
                        </span>
                        <span className={cn('text-xs font-medium', getConfidenceColor(entity.confidence))}>
                          {Math.round(entity.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Highlighted Text
                </h4>
                <div 
                  className="p-3 bg-gray-50 rounded-md dark:bg-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightEntities(input, extractedEntities) 
                  }}
                />
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Entity Statistics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(entityTypes).map(([type, info]) => {
                    const count = extractedEntities.filter(e => e.type === type).length;
                    return (
                      <div key={type} className="text-center p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="text-lg">{info.icon}</div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {count}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {info.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          
          {entityHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Recent Extractions
              </h4>
              <div className="space-y-2">
                {entityHistory.map((entities, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date().toLocaleTimeString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {entities.length} entities
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {entities.map((entity: any, entityIndex: number) => (
                        <span 
                          key={entityIndex}
                          className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            entity.type === 'location' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            entity.type === 'temporal' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            entity.type === 'person' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            entity.type === 'organization' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                            entity.type === 'money' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          )}
                        >
                          {entity.value}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

EntityExtractionEngine.displayName = 'EntityExtractionEngine';

// Entity Extraction Status Component
interface EntityExtractionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const EntityExtractionStatus = React.forwardRef<HTMLDivElement, EntityExtractionStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <span className="font-medium">
          Entity Extraction: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced entity recognition and extraction' 
              : 'Basic text processing'
            }
          </div>
        )}
      </div>
    );
  }
);

EntityExtractionStatus.displayName = 'EntityExtractionStatus';

// Entity Extraction Demo Component
interface EntityExtractionDemoProps {
  className?: string;
  showControls?: boolean;
}

export const EntityExtractionDemo = React.forwardRef<HTMLDivElement, EntityExtractionDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Entity Extraction Demo</h3>
        
        <EntityExtractionEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onEntitiesExtracted={(entities) => console.log('Entities extracted:', entities)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced entity extraction for identifying locations, dates, people, and other important information.
            </p>
          </div>
        )}
      </div>
    );
  }
);

EntityExtractionDemo.displayName = 'EntityExtractionDemo';

// Export all components
export {
  entityExtractionVariants,
  type EntityExtractionToggleProps,
  type EntityExtractionProviderProps,
  type EntityExtractionEngineProps,
  type EntityExtractionStatusProps,
  type EntityExtractionDemoProps
};
