/**
 * Intent Recognition Component
 * 
 * Provides intent recognition support for AI chat interface.
 * Implements advanced intent detection for travel agent conversations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Intent Recognition Variants
const intentRecognitionVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'intent-recognition-mode-standard',
        'enhanced': 'intent-recognition-mode-enhanced',
        'advanced': 'intent-recognition-mode-advanced',
        'custom': 'intent-recognition-mode-custom'
      },
      type: {
        'travel': 'intent-type-travel',
        'booking': 'intent-type-booking',
        'information': 'intent-type-information',
        'support': 'intent-type-support',
        'mixed': 'intent-type-mixed'
      },
      style: {
        'minimal': 'intent-style-minimal',
        'moderate': 'intent-style-moderate',
        'detailed': 'intent-style-detailed',
        'custom': 'intent-style-custom'
      },
      format: {
        'text': 'intent-format-text',
        'visual': 'intent-format-visual',
        'interactive': 'intent-format-interactive',
        'mixed': 'intent-format-mixed'
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

// Intent Recognition Toggle Props
interface IntentRecognitionToggleProps extends VariantProps<typeof intentRecognitionVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Intent Recognition Toggle Component
export const IntentRecognitionToggle = React.forwardRef<HTMLButtonElement, IntentRecognitionToggleProps>(
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
            ? 'bg-teal-600 text-white border-teal-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable intent recognition' : 'Enable intent recognition'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Intent recognition enabled' : 'Intent recognition disabled'}
          </span>
        )}
      </button>
    );
  }
);

IntentRecognitionToggle.displayName = 'IntentRecognitionToggle';

// Intent Recognition Provider Props
interface IntentRecognitionProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'travel' | 'booking' | 'information' | 'support' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Intent Recognition Provider Component
export const IntentRecognitionProvider = React.forwardRef<HTMLDivElement, IntentRecognitionProviderProps>(
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
        // Remove existing intent recognition classes
        document.body.classList.remove(
          'intent-recognition-mode-standard',
          'intent-recognition-mode-enhanced',
          'intent-recognition-mode-advanced',
          'intent-recognition-mode-custom'
        );
        
        document.body.classList.add(`intent-recognition-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          intentRecognitionVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IntentRecognitionProvider.displayName = 'IntentRecognitionProvider';

// Intent Recognition Engine Component
interface IntentRecognitionEngineProps extends VariantProps<typeof intentRecognitionVariants> {
  className?: string;
  onIntentDetected?: (intent: any) => void;
  type?: 'travel' | 'booking' | 'information' | 'support' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const IntentRecognitionEngine = React.forwardRef<HTMLDivElement, IntentRecognitionEngineProps>(
  ({ 
    className, 
    onIntentDetected,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [detectedIntent, setDetectedIntent] = useState<any>(null);
    const [intentHistory, setIntentHistory] = useState<any[]>([]);

    const intents = {
      travel: [
        { name: 'plan_trip', description: 'Plan a new trip', confidence: 0.95, examples: ['I want to plan a trip', 'Help me plan my vacation'] },
        { name: 'find_destination', description: 'Find travel destination', confidence: 0.92, examples: ['Where should I go?', 'Best places to visit'] },
        { name: 'get_recommendations', description: 'Get travel recommendations', confidence: 0.88, examples: ['What do you recommend?', 'Suggest activities'] },
        { name: 'compare_options', description: 'Compare travel options', confidence: 0.85, examples: ['Compare destinations', 'Which is better?'] }
      ],
      booking: [
        { name: 'book_flight', description: 'Book a flight', confidence: 0.94, examples: ['Book a flight', 'I need to fly'] },
        { name: 'book_hotel', description: 'Book accommodation', confidence: 0.91, examples: ['Book a hotel', 'Find accommodation'] },
        { name: 'book_activity', description: 'Book activities', confidence: 0.87, examples: ['Book tours', 'Reserve activities'] },
        { name: 'modify_booking', description: 'Modify existing booking', confidence: 0.83, examples: ['Change my booking', 'Modify reservation'] }
      ],
      information: [
        { name: 'get_weather', description: 'Get weather information', confidence: 0.89, examples: ['What\'s the weather?', 'Weather forecast'] },
        { name: 'get_culture', description: 'Get cultural information', confidence: 0.86, examples: ['Tell me about culture', 'Local customs'] },
        { name: 'get_transport', description: 'Get transportation info', confidence: 0.84, examples: ['How to get around?', 'Transportation options'] },
        { name: 'get_safety', description: 'Get safety information', confidence: 0.82, examples: ['Is it safe?', 'Safety tips'] }
      ],
      support: [
        { name: 'get_help', description: 'Get general help', confidence: 0.90, examples: ['I need help', 'Can you help me?'] },
        { name: 'report_issue', description: 'Report an issue', confidence: 0.88, examples: ['I have a problem', 'Something went wrong'] },
        { name: 'contact_support', description: 'Contact support', confidence: 0.85, examples: ['Contact support', 'Speak to someone'] },
        { name: 'feedback', description: 'Provide feedback', confidence: 0.83, examples: ['Give feedback', 'Rate experience'] }
      ]
    };

    const handleDetectIntent = useCallback(async () => {
      if (input.trim()) {
        setIsProcessing(true);
        
        // Simulate intent detection
        setTimeout(() => {
          const allIntents = Object.values(intents).flat();
          const randomIntent = allIntents[Math.floor(Math.random() * allIntents.length)];
          
          const result = {
            intent: randomIntent.name,
            description: randomIntent.description,
            confidence: randomIntent.confidence + (Math.random() * 0.1 - 0.05),
            category: Object.keys(intents).find(key => intents[key as keyof typeof intents].includes(randomIntent)) || 'mixed',
            entities: [
              { type: 'destination', value: 'Paris', confidence: 0.92 },
              { type: 'date', value: '2024-06-15', confidence: 0.88 },
              { type: 'duration', value: '7 days', confidence: 0.85 }
            ],
            timestamp: new Date().toISOString()
          };
          
          setDetectedIntent(result);
          setIntentHistory(prev => [result, ...prev.slice(0, 4)]);
          setIsProcessing(false);
          onIntentDetected?.(result);
        }, 1500);
      }
    }, [input, onIntentDetected]);

    const getIntentIcon = (intentName: string) => {
      if (intentName.includes('plan') || intentName.includes('trip')) return '🗺️';
      if (intentName.includes('book')) return '📅';
      if (intentName.includes('weather')) return '🌤️';
      if (intentName.includes('help') || intentName.includes('support')) return '🆘';
      if (intentName.includes('culture')) return '🏛️';
      if (intentName.includes('transport')) return '🚌';
      if (intentName.includes('safety')) return '🛡️';
      if (intentName.includes('feedback')) return '💬';
      return '🎯';
    };

    const getIntentColor = (category: string) => {
      switch (category) {
        case 'travel': return 'text-blue-600 dark:text-blue-400';
        case 'booking': return 'text-green-600 dark:text-green-400';
        case 'information': return 'text-purple-600 dark:text-purple-400';
        case 'support': return 'text-orange-600 dark:text-orange-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
      if (confidence >= 0.8) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 0.7) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          intentRecognitionVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Intent Recognition Engine
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              User Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Enter your message to detect intent..."
            />
          </div>
          
          <button
            onClick={handleDetectIntent}
            disabled={!input.trim() || isProcessing}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? 'Detecting Intent...' : 'Detect Intent'}
          </button>
          
          {detectedIntent && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-lg dark:bg-teal-900/20">
                <h4 className="text-md font-semibold text-teal-800 dark:text-teal-200 mb-2">
                  Detected Intent
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getIntentIcon(detectedIntent.intent)}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {detectedIntent.intent.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={cn('text-sm font-medium', getConfidenceColor(detectedIntent.confidence))}>
                      ({Math.round(detectedIntent.confidence * 100)}%)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {detectedIntent.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-500">
                      Category:
                    </span>
                    <span className={cn('text-xs font-medium', getIntentColor(detectedIntent.category))}>
                      {detectedIntent.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Extracted Entities
                </h4>
                <div className="space-y-2">
                  {detectedIntent.entities.map((entity: any, index: number) => (
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
            </div>
          )}
          
          {intentHistory.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Recent Intents
              </h4>
              <div className="space-y-2">
                {intentHistory.map((intent, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getIntentIcon(intent.intent)}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {intent.intent.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn('text-xs', getIntentColor(intent.category))}>
                        {intent.category}
                      </span>
                      <span className={cn('text-xs', getConfidenceColor(intent.confidence))}>
                        {Math.round(intent.confidence * 100)}%
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

IntentRecognitionEngine.displayName = 'IntentRecognitionEngine';

// Intent Recognition Status Component
interface IntentRecognitionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const IntentRecognitionStatus = React.forwardRef<HTMLDivElement, IntentRecognitionStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-teal-500" />
        <span className="font-medium">
          Intent Recognition: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Advanced intent detection and classification' 
              : 'Basic text processing'
            }
          </div>
        )}
      </div>
    );
  }
);

IntentRecognitionStatus.displayName = 'IntentRecognitionStatus';

// Intent Recognition Demo Component
interface IntentRecognitionDemoProps {
  className?: string;
  showControls?: boolean;
}

export const IntentRecognitionDemo = React.forwardRef<HTMLDivElement, IntentRecognitionDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Intent Recognition Demo</h3>
        
        <IntentRecognitionEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onIntentDetected={(intent) => console.log('Intent detected:', intent)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced intent recognition for understanding user goals and providing appropriate responses.
            </p>
          </div>
        )}
      </div>
    );
  }
);

IntentRecognitionDemo.displayName = 'IntentRecognitionDemo';

// Export all components
export {
  intentRecognitionVariants,
  type IntentRecognitionToggleProps,
  type IntentRecognitionProviderProps,
  type IntentRecognitionEngineProps,
  type IntentRecognitionStatusProps,
  type IntentRecognitionDemoProps
};
