/**
 * Multi-language Support Component
 * 
 * Provides international language capabilities for AI travel agent.
 * Implements advanced language detection, translation, and localization features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Multi-language Support Variants
const multiLanguageSupportVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'multi-language-support-mode-standard',
        'enhanced': 'multi-language-support-mode-enhanced',
        'advanced': 'multi-language-support-mode-advanced',
        'custom': 'multi-language-support-mode-custom'
      },
      type: {
        'detection': 'language-type-detection',
        'translation': 'language-type-translation',
        'localization': 'language-type-localization',
        'communication': 'language-type-communication',
        'mixed': 'language-type-mixed'
      },
      style: {
        'minimal': 'language-style-minimal',
        'moderate': 'language-style-moderate',
        'detailed': 'language-style-detailed',
        'custom': 'language-style-custom'
      },
      format: {
        'text': 'language-format-text',
        'visual': 'language-format-visual',
        'interactive': 'language-format-interactive',
        'mixed': 'language-format-mixed'
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

// Multi-language Support Toggle Props
interface MultiLanguageSupportToggleProps extends VariantProps<typeof multiLanguageSupportVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Multi-language Support Toggle Component
export const MultiLanguageSupportToggle = React.forwardRef<HTMLButtonElement, MultiLanguageSupportToggleProps>(
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
        aria-label={isEnabled ? 'Disable multi-language support' : 'Enable multi-language support'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Multi-language support enabled' : 'Multi-language support disabled'}
          </span>
        )}
      </button>
    );
  }
);

MultiLanguageSupportToggle.displayName = 'MultiLanguageSupportToggle';

// Multi-language Support Provider Props
interface MultiLanguageSupportProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'detection' | 'translation' | 'localization' | 'communication' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Multi-language Support Provider Component
export const MultiLanguageSupportProvider = React.forwardRef<HTMLDivElement, MultiLanguageSupportProviderProps>(
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
        // Remove existing multi-language support classes
        document.body.classList.remove(
          'multi-language-support-mode-standard',
          'multi-language-support-mode-enhanced',
          'multi-language-support-mode-advanced',
          'multi-language-support-mode-custom'
        );
        
        document.body.classList.add(`multi-language-support-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          multiLanguageSupportVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MultiLanguageSupportProvider.displayName = 'MultiLanguageSupportProvider';

// Multi-language Support Engine Component
interface MultiLanguageSupportEngineProps extends VariantProps<typeof multiLanguageSupportVariants> {
  className?: string;
  onLanguageUpdate?: (language: any) => void;
  type?: 'detection' | 'translation' | 'localization' | 'communication' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const MultiLanguageSupportEngine = React.forwardRef<HTMLDivElement, MultiLanguageSupportEngineProps>(
  ({ 
    className, 
    onLanguageUpdate,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [languageSupport, setLanguageSupport] = useState({
      currentLanguage: 'en',
      detectedLanguage: 'en',
      supportedLanguages: [
        { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English', confidence: 100 },
        { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español', confidence: 95 },
        { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français', confidence: 92 },
        { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch', confidence: 88 },
        { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano', confidence: 85 },
        { code: 'pt', name: 'Portuguese', flag: '🇵🇹', nativeName: 'Português', confidence: 90 },
        { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語', confidence: 87 },
        { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어', confidence: 83 },
        { code: 'zh', name: 'Chinese', flag: '🇨🇳', nativeName: '中文', confidence: 89 },
        { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', confidence: 81 }
      ],
      translation: {
        isEnabled: true,
        autoDetect: true,
        quality: 'high',
        supportedPairs: 45,
        realTimeTranslation: true
      },
      localization: {
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12-hour',
        numberFormat: 'US',
        culturalAdaptations: true
      },
      communication: {
        tone: 'professional',
        formality: 'moderate',
        culturalContext: true,
        regionalVariants: true,
        emojiSupport: true
      },
      metrics: {
        languageAccuracy: 94,
        translationQuality: 91,
        userSatisfaction: 4.7,
        supportedLanguages: 10,
        activeUsers: 1247
      }
    });

    const [isDetecting, setIsDetecting] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    const detectLanguage = useCallback(async (text: string) => {
      if (!text.trim()) return;
      
      setIsDetecting(true);
      
      // Simulate language detection
      setTimeout(() => {
        const detectedLang = text.includes('hola') ? 'es' : 
                           text.includes('bonjour') ? 'fr' : 
                           text.includes('guten') ? 'de' : 
                           text.includes('ciao') ? 'it' : 
                           text.includes('こんにちは') ? 'ja' : 
                           text.includes('안녕') ? 'ko' : 
                           text.includes('你好') ? 'zh' : 
                           text.includes('مرحبا') ? 'ar' : 'en';
        
        setLanguageSupport(prev => ({
          ...prev,
          detectedLanguage: detectedLang
        }));
        
        setIsDetecting(false);
        onLanguageUpdate?.({ detectedLanguage: detectedLang });
      }, 1500);
    }, [onLanguageUpdate]);

    const translateText = useCallback(async (text: string, targetLang: string) => {
      if (!text.trim()) return;
      
      setIsTranslating(true);
      
      // Simulate translation
      setTimeout(() => {
        const translations: Record<string, string> = {
          'es': 'Hola, ¿cómo puedo ayudarte con tu viaje?',
          'fr': 'Bonjour, comment puis-je vous aider avec votre voyage?',
          'de': 'Hallo, wie kann ich Ihnen bei Ihrer Reise helfen?',
          'it': 'Ciao, come posso aiutarti con il tuo viaggio?',
          'ja': 'こんにちは、旅行のお手伝いをさせていただけますか？',
          'ko': '안녕하세요, 여행에 대해 어떻게 도와드릴까요?',
          'zh': '你好，我可以如何帮助您的旅行？',
          'ar': 'مرحبا، كيف يمكنني مساعدتك في رحلتك؟'
        };
        
        setTranslatedText(translations[targetLang] || text);
        setIsTranslating(false);
        onLanguageUpdate?.({ translatedText: translations[targetLang] });
      }, 2000);
    }, [onLanguageUpdate]);

    const getLanguageFlag = (code: string) => {
      const lang = languageSupport.supportedLanguages.find(l => l.code === code);
      return lang?.flag || '🌍';
    };

    const getLanguageName = (code: string) => {
      const lang = languageSupport.supportedLanguages.find(l => l.code === code);
      return lang?.name || 'Unknown';
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 90) return 'text-green-600 dark:text-green-400';
      if (confidence >= 80) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 70) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          multiLanguageSupportVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Multi-language Support
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">{getLanguageFlag(languageSupport.currentLanguage)}</span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {getLanguageName(languageSupport.currentLanguage)}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-teal-50 rounded-md dark:bg-teal-900/20">
              <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                {languageSupport.metrics.languageAccuracy}%
              </div>
              <div className="text-sm text-teal-600 dark:text-teal-400">
                Language Accuracy
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {languageSupport.metrics.translationQuality}%
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Translation Quality
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {languageSupport.metrics.userSatisfaction}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                User Satisfaction
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {languageSupport.metrics.supportedLanguages}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Languages
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Language Detection
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Enter text to detect language
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type text in any language..."
                      className="flex-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                    <button
                      onClick={() => detectLanguage(inputText)}
                      disabled={isDetecting || !inputText.trim()}
                      className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isDetecting ? 'Detecting...' : 'Detect'}
                    </button>
                  </div>
                </div>
                
                {languageSupport.detectedLanguage && (
                  <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getLanguageFlag(languageSupport.detectedLanguage)}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Detected: {getLanguageName(languageSupport.detectedLanguage)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Translation
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Select target language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    {languageSupport.supportedLanguages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name} ({lang.nativeName})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Text to translate
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={3}
                    placeholder="Enter text to translate..."
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                
                <button
                  onClick={() => translateText(inputText, selectedLanguage)}
                  disabled={isTranslating || !inputText.trim()}
                  className="w-full px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </button>
                
                {translatedText && (
                  <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getLanguageFlag(selectedLanguage)}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Translation ({getLanguageName(selectedLanguage)})
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {translatedText}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Supported Languages
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {languageSupport.supportedLanguages.map((lang) => (
                  <div key={lang.code} className="p-2 border border-gray-200 rounded-md dark:border-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.flag}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {lang.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {lang.nativeName}
                        </div>
                      </div>
                      <span className={cn('text-xs font-medium', getConfidenceColor(lang.confidence))}>
                        {lang.confidence}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Localization Settings
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Currency</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {languageSupport.localization.currency}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Date Format</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {languageSupport.localization.dateFormat}
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400">Time Format</div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {languageSupport.localization.timeFormat}
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

MultiLanguageSupportEngine.displayName = 'MultiLanguageSupportEngine';

// Multi-language Support Status Component
interface MultiLanguageSupportStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const MultiLanguageSupportStatus = React.forwardRef<HTMLDivElement, MultiLanguageSupportStatusProps>(
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
          Multi-language Support: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'International language support and translation' 
              : 'English only'
            }
          </div>
        )}
      </div>
    );
  }
);

MultiLanguageSupportStatus.displayName = 'MultiLanguageSupportStatus';

// Multi-language Support Demo Component
interface MultiLanguageSupportDemoProps {
  className?: string;
  showControls?: boolean;
}

export const MultiLanguageSupportDemo = React.forwardRef<HTMLDivElement, MultiLanguageSupportDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Multi-language Support Demo</h3>
        
        <MultiLanguageSupportEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onLanguageUpdate={(language) => console.log('Language updated:', language)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              International language support with automatic detection, translation, and localization.
            </p>
          </div>
        )}
      </div>
    );
  }
);

MultiLanguageSupportDemo.displayName = 'MultiLanguageSupportDemo';

// Export all components
export {
  multiLanguageSupportVariants,
  type MultiLanguageSupportToggleProps,
  type MultiLanguageSupportProviderProps,
  type MultiLanguageSupportEngineProps,
  type MultiLanguageSupportStatusProps,
  type MultiLanguageSupportDemoProps
};
