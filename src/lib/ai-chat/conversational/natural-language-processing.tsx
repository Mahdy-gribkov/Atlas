/**
 * Natural Language Processing Component
 * 
 * Provides natural language processing support for AI chat interface.
 * Implements advanced NLP capabilities for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Natural Language Processing Variants
const nlpVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'nlp-mode-standard',
        'enhanced': 'nlp-mode-enhanced',
        'advanced': 'nlp-mode-advanced',
        'custom': 'nlp-mode-custom'
      },
      type: {
        'intent': 'nlp-type-intent',
        'entity': 'nlp-type-entity',
        'sentiment': 'nlp-type-sentiment',
        'language': 'nlp-type-language',
        'mixed': 'nlp-type-mixed'
      },
      style: {
        'minimal': 'nlp-style-minimal',
        'moderate': 'nlp-style-moderate',
        'detailed': 'nlp-style-detailed',
        'custom': 'nlp-style-custom'
      },
      format: {
        'text': 'nlp-format-text',
        'visual': 'nlp-format-visual',
        'interactive': 'nlp-format-interactive',
        'mixed': 'nlp-format-mixed'
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

// NLP Toggle Props
interface NLPToggleProps extends VariantProps<typeof nlpVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// NLP Toggle Component
export const NLPToggle = React.forwardRef<HTMLButtonElement, NLPToggleProps>(
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
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable NLP' : 'Enable NLP'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'NLP enabled' : 'NLP disabled'}
          </span>
        )}
      </button>
    );
  }
);

NLPToggle.displayName = 'NLPToggle';

// NLP Provider Props
interface NLPProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'intent' | 'entity' | 'sentiment' | 'language' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// NLP Provider Component
export const NLPProvider = React.forwardRef<HTMLDivElement, NLPProviderProps>(
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
        // Remove existing NLP classes
        document.body.classList.remove(
          'nlp-mode-standard',
          'nlp-mode-enhanced',
          'nlp-mode-advanced',
          'nlp-mode-custom'
        );
        
        document.body.classList.add(`nlp-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          nlpVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NLPProvider.displayName = 'NLPProvider';

// NLP Processor Component
interface NLPProcessorProps extends VariantProps<typeof nlpVariants> {
  className?: string;
  onProcess?: (result: any) => void;
  type?: 'intent' | 'entity' | 'sentiment' | 'language' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const NLPProcessor = React.forwardRef<HTMLDivElement, NLPProcessorProps>(
  ({ 
    className, 
    onProcess,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleProcess = useCallback(async () => {
      if (input.trim()) {
        setIsProcessing(true);
        
        // Simulate NLP processing
        setTimeout(() => {
          const mockResult = {
            intent: 'travel_planning',
            entities: [
              { type: 'destination', value: 'Paris', confidence: 0.95 },
              { type: 'date', value: '2024-06-15', confidence: 0.88 },
              { type: 'duration', value: '7 days', confidence: 0.92 }
            ],
            sentiment: {
              score: 0.8,
              label: 'positive'
            },
            language: {
              detected: 'en',
              confidence: 0.99
            },
            confidence: 0.91
          };
          
          setResult(mockResult);
          setIsProcessing(false);
          onProcess?.(mockResult);
        }, 2000);
      }
    }, [input, onProcess]);

    const getSentimentColor = (sentiment: string) => {
      switch (sentiment) {
        case 'positive': return 'text-green-600 dark:text-green-400';
        case 'negative': return 'text-red-600 dark:text-red-400';
        case 'neutral': return 'text-gray-600 dark:text-gray-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getSentimentIcon = (sentiment: string) => {
      switch (sentiment) {
        case 'positive': return '😊';
        case 'negative': return '😞';
        case 'neutral': return '😐';
        default: return '❓';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          nlpVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Natural Language Processing
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
              placeholder="Enter your travel request..."
            />
          </div>
          
          <button
            onClick={handleProcess}
            disabled={!input.trim() || isProcessing}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Processing...' : 'Process Text'}
          </button>
          
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Intent
                  </h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {result.intent.replace('_', ' ').toUpperCase()}
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-md dark:bg-green-900/20">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                    Sentiment
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSentimentIcon(result.sentiment.label)}</span>
                    <span className={cn('text-sm font-medium', getSentimentColor(result.sentiment.label))}>
                      {result.sentiment.label} ({Math.round(result.sentiment.score * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Extracted Entities
                </h4>
                <div className="space-y-2">
                  {result.entities.map((entity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {entity.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-800 dark:text-gray-200">
                          {entity.value}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Math.round(entity.confidence * 100)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
                <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-200 mb-1">
                  Overall Confidence
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

NLPProcessor.displayName = 'NLPProcessor';

// NLP Status Component
interface NLPStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const NLPStatus = React.forwardRef<HTMLDivElement, NLPStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <span className="font-medium">
          NLP: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced natural language processing capabilities' 
              : 'Standard text processing'
            }
          </div>
        )}
      </div>
    );
  }
);

NLPStatus.displayName = 'NLPStatus';

// NLP Demo Component
interface NLPDemoProps {
  className?: string;
  showControls?: boolean;
}

export const NLPDemo = React.forwardRef<HTMLDivElement, NLPDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Natural Language Processing Demo</h3>
        
        <NLPProcessor
          mode="enhanced"
          type="mixed"
          style="detailed"
          onProcess={(result) => console.log('NLP result:', result)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced natural language processing for understanding travel requests, extracting entities, and analyzing sentiment.
            </p>
          </div>
        )}
      </div>
    );
  }
);

NLPDemo.displayName = 'NLPDemo';

// Export all components
export {
  nlpVariants,
  type NLPToggleProps,
  type NLPProviderProps,
  type NLPProcessorProps,
  type NLPStatusProps,
  type NLPDemoProps
};

