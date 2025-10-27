/**
 * Voice Interaction Component
 * 
 * Provides voice recognition and synthesis capabilities for AI travel agent.
 * Implements advanced speech processing and voice interaction features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Voice Interaction Variants
const voiceInteractionVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'voice-interaction-mode-standard',
        'enhanced': 'voice-interaction-mode-enhanced',
        'advanced': 'voice-interaction-mode-advanced',
        'custom': 'voice-interaction-mode-custom'
      },
      type: {
        'recognition': 'voice-type-recognition',
        'synthesis': 'voice-type-synthesis',
        'conversation': 'voice-type-conversation',
        'commands': 'voice-type-commands',
        'mixed': 'voice-type-mixed'
      },
      style: {
        'minimal': 'voice-style-minimal',
        'moderate': 'voice-style-moderate',
        'detailed': 'voice-style-detailed',
        'custom': 'voice-style-custom'
      },
      format: {
        'text': 'voice-format-text',
        'visual': 'voice-format-visual',
        'interactive': 'voice-format-interactive',
        'mixed': 'voice-format-mixed'
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

// Voice Interaction Toggle Props
interface VoiceInteractionToggleProps extends VariantProps<typeof voiceInteractionVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Voice Interaction Toggle Component
export const VoiceInteractionToggle = React.forwardRef<HTMLButtonElement, VoiceInteractionToggleProps>(
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
        aria-label={isEnabled ? 'Disable voice interaction' : 'Enable voice interaction'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Voice interaction enabled' : 'Voice interaction disabled'}
          </span>
        )}
      </button>
    );
  }
);

VoiceInteractionToggle.displayName = 'VoiceInteractionToggle';

// Voice Interaction Provider Props
interface VoiceInteractionProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'recognition' | 'synthesis' | 'conversation' | 'commands' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Voice Interaction Provider Component
export const VoiceInteractionProvider = React.forwardRef<HTMLDivElement, VoiceInteractionProviderProps>(
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
        // Remove existing voice interaction classes
        document.body.classList.remove(
          'voice-interaction-mode-standard',
          'voice-interaction-mode-enhanced',
          'voice-interaction-mode-advanced',
          'voice-interaction-mode-custom'
        );
        
        document.body.classList.add(`voice-interaction-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          voiceInteractionVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

VoiceInteractionProvider.displayName = 'VoiceInteractionProvider';

// Voice Interaction Engine Component
interface VoiceInteractionEngineProps extends VariantProps<typeof voiceInteractionVariants> {
  className?: string;
  onVoiceUpdate?: (voice: any) => void;
  type?: 'recognition' | 'synthesis' | 'conversation' | 'commands' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const VoiceInteractionEngine = React.forwardRef<HTMLDivElement, VoiceInteractionEngineProps>(
  ({ 
    className, 
    onVoiceUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [voiceInteraction, setVoiceInteraction] = useState({
      recognition: {
        isEnabled: true,
        isListening: false,
        language: 'en-US',
        confidence: 0,
        transcript: '',
        supportedLanguages: [
          { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
          { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
          { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
          { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
          { code: 'de-DE', name: 'German', flag: '🇩🇪' },
          { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
          { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
          { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
          { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
          { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' }
        ]
      },
      synthesis: {
        isEnabled: true,
        isSpeaking: false,
        voice: 'en-US-Standard-A',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        availableVoices: [
          { id: 'en-US-Standard-A', name: 'Sarah (US)', gender: 'Female', language: 'English' },
          { id: 'en-US-Standard-B', name: 'John (US)', gender: 'Male', language: 'English' },
          { id: 'en-GB-Standard-A', name: 'Emma (UK)', gender: 'Female', language: 'English' },
          { id: 'es-ES-Standard-A', name: 'María (ES)', gender: 'Female', language: 'Spanish' },
          { id: 'fr-FR-Standard-A', name: 'Sophie (FR)', gender: 'Female', language: 'French' },
          { id: 'de-DE-Standard-A', name: 'Hans (DE)', gender: 'Male', language: 'German' }
        ]
      },
      conversation: {
        isActive: false,
        context: 'travel-planning',
        responses: [
          'I understand you\'re looking for travel recommendations.',
          'Let me help you find the perfect destination.',
          'What type of experience are you looking for?',
          'I can suggest some amazing places to visit.',
          'Would you like me to create an itinerary for you?'
        ],
        currentResponse: ''
      },
      commands: {
        isEnabled: true,
        availableCommands: [
          { command: 'book flight', action: 'Open flight booking', icon: '✈️' },
          { command: 'find hotel', action: 'Search hotels', icon: '🏨' },
          { command: 'plan trip', action: 'Start trip planning', icon: '🗺️' },
          { command: 'check weather', action: 'Get weather info', icon: '🌤️' },
          { command: 'translate', action: 'Open translation', icon: '🌍' },
          { command: 'emergency', action: 'Emergency assistance', icon: '🚨' }
        ],
        lastCommand: ''
      },
      metrics: {
        recognitionAccuracy: 94,
        synthesisQuality: 91,
        responseTime: '1.2s',
        userSatisfaction: 4.6,
        totalInteractions: 892
      }
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState('en-US-Standard-A');

    const startListening = useCallback(async () => {
      setIsProcessing(true);
      
      // Simulate voice recognition
      setTimeout(() => {
        setVoiceInteraction(prev => ({
          ...prev,
          recognition: {
            ...prev.recognition,
            isListening: true,
            confidence: 0.87,
            transcript: 'I want to plan a trip to Japan for next spring'
          }
        }));
        
        setIsProcessing(false);
        onVoiceUpdate?.({ transcript: 'I want to plan a trip to Japan for next spring' });
      }, 2000);
    }, [onVoiceUpdate]);

    const stopListening = useCallback(() => {
      setVoiceInteraction(prev => ({
        ...prev,
        recognition: {
          ...prev.recognition,
          isListening: false
        }
      }));
    }, []);

    const speakText = useCallback(async (text: string) => {
      if (!text.trim()) return;
      
      setIsProcessing(true);
      
      // Simulate text-to-speech
      setTimeout(() => {
        setVoiceInteraction(prev => ({
          ...prev,
          synthesis: {
            ...prev.synthesis,
            isSpeaking: true
          }
        }));
        
        // Simulate speaking duration
        setTimeout(() => {
          setVoiceInteraction(prev => ({
            ...prev,
            synthesis: {
              ...prev.synthesis,
              isSpeaking: false
            }
          }));
          setIsProcessing(false);
        }, 3000);
        
        onVoiceUpdate?.({ spokenText: text });
      }, 1000);
    }, [onVoiceUpdate]);

    const executeCommand = useCallback(async (command: string) => {
      setIsProcessing(true);
      
      // Simulate command execution
      setTimeout(() => {
        setVoiceInteraction(prev => ({
          ...prev,
          commands: {
            ...prev.commands,
            lastCommand: command
          }
        }));
        
        setIsProcessing(false);
        onVoiceUpdate?.({ executedCommand: command });
      }, 1500);
    }, [onVoiceUpdate]);

    const getVoiceIcon = (gender: string) => {
      return gender === 'Female' ? '👩' : '👨';
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
          voiceInteractionVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Voice Interaction
          </h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-3 h-3 rounded-full',
              voiceInteraction.recognition.isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            )} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {voiceInteraction.recognition.isListening ? 'Listening' : 'Ready'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-emerald-50 rounded-md dark:bg-emerald-900/20">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(voiceInteraction.metrics.recognitionAccuracy)}%
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-400">
                Recognition Accuracy
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {Math.round(voiceInteraction.metrics.synthesisQuality)}%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Synthesis Quality
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {voiceInteraction.metrics.responseTime}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Response Time
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {voiceInteraction.metrics.userSatisfaction}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                User Satisfaction
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Voice Recognition
              </h4>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={startListening}
                    disabled={isProcessing || voiceInteraction.recognition.isListening}
                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {voiceInteraction.recognition.isListening ? 'Listening...' : 'Start Listening'}
                  </button>
                  <button
                    onClick={stopListening}
                    disabled={!voiceInteraction.recognition.isListening}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Stop
                  </button>
                </div>
                
                {voiceInteraction.recognition.transcript && (
                  <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Transcript
                      </span>
                      <span className={cn('text-xs font-medium', getConfidenceColor(voiceInteraction.recognition.confidence))}>
                        {Math.round(voiceInteraction.recognition.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      "{voiceInteraction.recognition.transcript}"
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Recognition Language
                  </label>
                  <select
                    value={voiceInteraction.recognition.language}
                    onChange={(e) => setVoiceInteraction(prev => ({
                      ...prev,
                      recognition: { ...prev.recognition, language: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {voiceInteraction.recognition.supportedLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Text-to-Speech
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Select Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {voiceInteraction.synthesis.availableVoices.map((voice) => (
                      <option key={voice.id} value={voice.id}>
                        {getVoiceIcon(voice.gender)} {voice.name} ({voice.language})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Text to speak
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter text to convert to speech..."
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    defaultValue="Hello! I'm your AI travel assistant. How can I help you plan your next adventure?"
                  />
                </div>
                
                <button
                  onClick={() => speakText('Hello! I\'m your AI travel assistant. How can I help you plan your next adventure?')}
                  disabled={isProcessing || voiceInteraction.synthesis.isSpeaking}
                  className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {voiceInteraction.synthesis.isSpeaking ? 'Speaking...' : 'Speak Text'}
                </button>
                
                {voiceInteraction.synthesis.isSpeaking && (
                  <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-md dark:bg-emerald-900/20">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                      Speaking...
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Voice Commands
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {voiceInteraction.commands.availableCommands.map((cmd) => (
                  <button
                    key={cmd.command}
                    onClick={() => executeCommand(cmd.command)}
                    disabled={isProcessing}
                    className="p-3 text-center border border-gray-200 rounded-md hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <div className="text-lg mb-1">{cmd.icon}</div>
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {cmd.command}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {cmd.action}
                    </div>
                  </button>
                ))}
              </div>
              
              {voiceInteraction.commands.lastCommand && (
                <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Last Command Executed
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    "{voiceInteraction.commands.lastCommand}"
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Voice Settings
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Speech Rate
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceInteraction.synthesis.rate}
                    onChange={(e) => setVoiceInteraction(prev => ({
                      ...prev,
                      synthesis: { ...prev.synthesis, rate: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    {voiceInteraction.synthesis.rate}x
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Pitch
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={voiceInteraction.synthesis.pitch}
                    onChange={(e) => setVoiceInteraction(prev => ({
                      ...prev,
                      synthesis: { ...prev.synthesis, pitch: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    {voiceInteraction.synthesis.pitch}x
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Volume
                  </label>
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.1"
                    value={voiceInteraction.synthesis.volume}
                    onChange={(e) => setVoiceInteraction(prev => ({
                      ...prev,
                      synthesis: { ...prev.synthesis, volume: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
                    {Math.round(voiceInteraction.synthesis.volume * 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VoiceInteractionEngine.displayName = 'VoiceInteractionEngine';

// Voice Interaction Status Component
interface VoiceInteractionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const VoiceInteractionStatus = React.forwardRef<HTMLDivElement, VoiceInteractionStatusProps>(
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
          Voice Interaction: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Speech recognition and text-to-speech' 
              : 'Text-only interaction'
            }
          </div>
        )}
      </div>
    );
  }
);

VoiceInteractionStatus.displayName = 'VoiceInteractionStatus';

// Voice Interaction Demo Component
interface VoiceInteractionDemoProps {
  className?: string;
  showControls?: boolean;
}

export const VoiceInteractionDemo = React.forwardRef<HTMLDivElement, VoiceInteractionDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Voice Interaction Demo</h3>
        
        <VoiceInteractionEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onVoiceUpdate={(voice) => console.log('Voice updated:', voice)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced voice recognition and text-to-speech capabilities for hands-free travel planning.
            </p>
          </div>
        )}
      </div>
    );
  }
);

VoiceInteractionDemo.displayName = 'VoiceInteractionDemo';

// Export all components
export {
  voiceInteractionVariants,
  type VoiceInteractionToggleProps,
  type VoiceInteractionProviderProps,
  type VoiceInteractionEngineProps,
  type VoiceInteractionStatusProps,
  type VoiceInteractionDemoProps
};
