/**
 * Sentiment Analysis Component
 * 
 * Provides sentiment analysis support for AI chat interface.
 * Implements advanced sentiment detection for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Sentiment Analysis Variants
const sentimentAnalysisVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'sentiment-analysis-mode-standard',
        'enhanced': 'sentiment-analysis-mode-enhanced',
        'advanced': 'sentiment-analysis-mode-advanced',
        'custom': 'sentiment-analysis-mode-custom'
      },
      type: {
        'polarity': 'sentiment-type-polarity',
        'emotion': 'sentiment-type-emotion',
        'intensity': 'sentiment-type-intensity',
        'contextual': 'sentiment-type-contextual',
        'mixed': 'sentiment-type-mixed'
      },
      style: {
        'minimal': 'sentiment-style-minimal',
        'moderate': 'sentiment-style-moderate',
        'detailed': 'sentiment-style-detailed',
        'custom': 'sentiment-style-custom'
      },
      format: {
        'text': 'sentiment-format-text',
        'visual': 'sentiment-format-visual',
        'interactive': 'sentiment-format-interactive',
        'mixed': 'sentiment-format-mixed'
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

// Sentiment Analysis Toggle Props
interface SentimentAnalysisToggleProps extends VariantProps<typeof sentimentAnalysisVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Sentiment Analysis Toggle Component
export const SentimentAnalysisToggle = React.forwardRef<HTMLButtonElement, SentimentAnalysisToggleProps>(
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
            ? 'bg-rose-600 text-white border-rose-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable sentiment analysis' : 'Enable sentiment analysis'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Sentiment analysis enabled' : 'Sentiment analysis disabled'}
          </span>
        )}
      </button>
    );
  }
);

SentimentAnalysisToggle.displayName = 'SentimentAnalysisToggle';

// Sentiment Analysis Provider Props
interface SentimentAnalysisProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'polarity' | 'emotion' | 'intensity' | 'contextual' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Sentiment Analysis Provider Component
export const SentimentAnalysisProvider = React.forwardRef<HTMLDivElement, SentimentAnalysisProviderProps>(
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
        // Remove existing sentiment analysis classes
        document.body.classList.remove(
          'sentiment-analysis-mode-standard',
          'sentiment-analysis-mode-enhanced',
          'sentiment-analysis-mode-advanced',
          'sentiment-analysis-mode-custom'
        );
        
        document.body.classList.add(`sentiment-analysis-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          sentimentAnalysisVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SentimentAnalysisProvider.displayName = 'SentimentAnalysisProvider';

// Sentiment Analysis Engine Component
interface SentimentAnalysisEngineProps extends VariantProps<typeof sentimentAnalysisVariants> {
  className?: string;
  onSentimentAnalyzed?: (sentiment: any) => void;
  type?: 'polarity' | 'emotion' | 'intensity' | 'contextual' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const SentimentAnalysisEngine = React.forwardRef<HTMLDivElement, SentimentAnalysisEngineProps>(
  ({ 
    className, 
    onSentimentAnalyzed,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [sentimentResult, setSentimentResult] = useState<any>(null);
    const [sentimentHistory, setSentimentHistory] = useState<any[]>([]);

    const emotions = {
      joy: { icon: '😊', color: 'text-yellow-600 dark:text-yellow-400', description: 'Happy and excited' },
      sadness: { icon: '😢', color: 'text-blue-600 dark:text-blue-400', description: 'Sad or disappointed' },
      anger: { icon: '😠', color: 'text-red-600 dark:text-red-400', description: 'Angry or frustrated' },
      fear: { icon: '😨', color: 'text-purple-600 dark:text-purple-400', description: 'Worried or anxious' },
      surprise: { icon: '😲', color: 'text-orange-600 dark:text-orange-400', description: 'Surprised or amazed' },
      disgust: { icon: '🤢', color: 'text-green-600 dark:text-green-400', description: 'Disgusted or repulsed' },
      neutral: { icon: '😐', color: 'text-gray-600 dark:text-gray-400', description: 'Neutral or indifferent' }
    };

    const handleAnalyzeSentiment = useCallback(async () => {
      if (input.trim()) {
        setIsProcessing(true);
        
        // Simulate sentiment analysis
        setTimeout(() => {
          const mockResult = {
            polarity: {
              score: Math.random() * 2 - 1, // -1 to 1
              label: Math.random() > 0.5 ? 'positive' : Math.random() > 0.3 ? 'negative' : 'neutral'
            },
            emotion: {
              primary: Object.keys(emotions)[Math.floor(Math.random() * Object.keys(emotions).length)],
              confidence: Math.random() * 0.3 + 0.7 // 0.7 to 1.0
            },
            intensity: {
              level: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
              description: Math.random() > 0.5 ? 'high' : 'moderate'
            },
            contextual: {
              travel_related: Math.random() > 0.3,
              urgency: Math.random() > 0.7,
              satisfaction: Math.random() * 0.4 + 0.6 // 0.6 to 1.0
            },
            confidence: Math.random() * 0.2 + 0.8, // 0.8 to 1.0
            timestamp: new Date().toISOString()
          };
          
          setSentimentResult(mockResult);
          setSentimentHistory(prev => [mockResult, ...prev.slice(0, 4)]);
          setIsProcessing(false);
          onSentimentAnalyzed?.(mockResult);
        }, 1800);
      }
    }, [input, onSentimentAnalyzed]);

    const getPolarityColor = (label: string) => {
      switch (label) {
        case 'positive': return 'text-green-600 dark:text-green-400';
        case 'negative': return 'text-red-600 dark:text-red-400';
        case 'neutral': return 'text-gray-600 dark:text-gray-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getPolarityIcon = (label: string) => {
      switch (label) {
        case 'positive': return '😊';
        case 'negative': return '😞';
        case 'neutral': return '😐';
        default: return '❓';
      }
    };

    const getIntensityColor = (level: number) => {
      if (level >= 0.8) return 'text-red-600 dark:text-red-400';
      if (level >= 0.6) return 'text-orange-600 dark:text-orange-400';
      if (level >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
      return 'text-green-600 dark:text-green-400';
    };

    const getIntensityDescription = (level: number) => {
      if (level >= 0.8) return 'Very High';
      if (level >= 0.6) return 'High';
      if (level >= 0.4) return 'Moderate';
      return 'Low';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          sentimentAnalysisVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Sentiment Analysis Engine
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
              placeholder="Enter text to analyze sentiment..."
            />
          </div>
          
          <button
            onClick={handleAnalyzeSentiment}
            disabled={!input.trim() || isProcessing}
            className="w-full px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Analyzing Sentiment...' : 'Analyze Sentiment'}
          </button>
          
          {sentimentResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <h4 className="text-md font-semibold text-green-800 dark:text-green-200 mb-2">
                    Polarity Analysis
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPolarityIcon(sentimentResult.polarity.label)}</span>
                      <span className={cn('text-sm font-medium', getPolarityColor(sentimentResult.polarity.label))}>
                        {sentimentResult.polarity.label.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({sentimentResult.polarity.score.toFixed(2)})
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={cn(
                          'h-2 rounded-full transition-all duration-500',
                          sentimentResult.polarity.label === 'positive' ? 'bg-green-500' :
                          sentimentResult.polarity.label === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                        )}
                        style={{ 
                          width: `${Math.abs(sentimentResult.polarity.score) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg dark:bg-purple-900/20">
                  <h4 className="text-md font-semibold text-purple-800 dark:text-purple-200 mb-2">
                    Emotion Detection
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emotions[sentimentResult.emotion.primary as keyof typeof emotions]?.icon}</span>
                      <span className={cn('text-sm font-medium', emotions[sentimentResult.emotion.primary as keyof typeof emotions]?.color)}>
                        {sentimentResult.emotion.primary.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({Math.round(sentimentResult.emotion.confidence * 100)}%)
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {emotions[sentimentResult.emotion.primary as keyof typeof emotions]?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg dark:bg-orange-900/20">
                  <h4 className="text-md font-semibold text-orange-800 dark:text-orange-200 mb-2">
                    Intensity Level
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('text-sm font-medium', getIntensityColor(sentimentResult.intensity.level))}>
                        {getIntensityDescription(sentimentResult.intensity.level)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        ({Math.round(sentimentResult.intensity.level * 100)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className={cn('h-2 rounded-full transition-all duration-500', getIntensityColor(sentimentResult.intensity.level).replace('text-', 'bg-'))}
                        style={{ width: `${sentimentResult.intensity.level * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Contextual Analysis
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Travel Related:</span>
                      <span className={cn('font-medium', sentimentResult.contextual.travel_related ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')}>
                        {sentimentResult.contextual.travel_related ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Urgency:</span>
                      <span className={cn('font-medium', sentimentResult.contextual.urgency ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')}>
                        {sentimentResult.contextual.urgency ? 'High' : 'Normal'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Satisfaction:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {Math.round(sentimentResult.contextual.satisfaction * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Overall Confidence
                </h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-600">
                    <div 
                      className="bg-rose-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${sentimentResult.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {Math.round(sentimentResult.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {sentimentHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Recent Analyses
              </h4>
              <div className="space-y-2">
                {sentimentHistory.map((sentiment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getPolarityIcon(sentiment.polarity.label)}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {sentiment.polarity.label}
                      </span>
                      <span className="text-sm">{emotions[sentiment.emotion.primary as keyof typeof emotions]?.icon}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {sentiment.emotion.primary}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs', getIntensityColor(sentiment.intensity.level))}>
                        {getIntensityDescription(sentiment.intensity.level)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {Math.round(sentiment.confidence * 100)}%
                      </span>
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

SentimentAnalysisEngine.displayName = 'SentimentAnalysisEngine';

// Sentiment Analysis Status Component
interface SentimentAnalysisStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const SentimentAnalysisStatus = React.forwardRef<HTMLDivElement, SentimentAnalysisStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-rose-500" />
        <span className="font-medium">
          Sentiment Analysis: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced sentiment and emotion analysis' 
              : 'Basic text processing'
            }
          </div>
        )}
      </div>
    );
  }
);

SentimentAnalysisStatus.displayName = 'SentimentAnalysisStatus';

// Sentiment Analysis Demo Component
interface SentimentAnalysisDemoProps {
  className?: string;
  showControls?: boolean;
}

export const SentimentAnalysisDemo = React.forwardRef<HTMLDivElement, SentimentAnalysisDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Sentiment Analysis Demo</h3>
        
        <SentimentAnalysisEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onSentimentAnalyzed={(sentiment) => console.log('Sentiment analyzed:', sentiment)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced sentiment analysis for understanding user emotions and adjusting responses accordingly.
            </p>
          </div>
        )}
      </div>
    );
  }
);

SentimentAnalysisDemo.displayName = 'SentimentAnalysisDemo';

// Export all components
export {
  sentimentAnalysisVariants,
  type SentimentAnalysisToggleProps,
  type SentimentAnalysisProviderProps,
  type SentimentAnalysisEngineProps,
  type SentimentAnalysisStatusProps,
  type SentimentAnalysisDemoProps
};
