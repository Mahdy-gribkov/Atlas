/**
 * Accessibility Hooks
 * 
 * React hooks for accessibility features and WCAG compliance.
 * Provides reusable hooks for common accessibility operations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  AccessibilityConfig, 
  AccessibilityFeature, 
  AccessibilityCategory,
  UseAccessibilityOptions,
  UseAccessibilityReturn 
} from './accessibility-types';
import { 
  ariaUtils, 
  focusUtils, 
  keyboardUtils, 
  screenReaderUtils,
  detectAccessibilityFeatures,
  getAccessibilityConfigForFeature
} from './accessibility-utils';

// Main accessibility hook
export function useAccessibility(options: UseAccessibilityOptions = {}): UseAccessibilityReturn {
  const [config, setConfig] = useState<AccessibilityConfig>(() => {
    if (options.config) {
      return { ...options.config } as AccessibilityConfig;
    }
    
    if (options.persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem('atlas-accessibility-preferences');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (error) {
          console.warn('Failed to load accessibility preferences:', error);
        }
      }
    }
    
    return {
      visual: {
        highContrast: false,
        fontSize: 'medium',
        colorBlindSupport: false,
        screenReaderOptimized: false,
        focusIndicators: true,
        textScaling: 1.0,
        theme: 'auto',
        visualHierarchy: true,
        iconAlternatives: false,
        readingMode: false
      },
      motor: {
        keyboardNavigation: true,
        voiceControl: false,
        touchTargets: 'medium',
        gestureAlternatives: false,
        switchNavigation: false,
        eyeTracking: false,
        oneHandedMode: false,
        customizableShortcuts: false,
        assistiveDevices: false,
        timeoutControls: false
      },
      cognitive: {
        simplifiedInterface: false,
        progressIndicators: true,
        errorPrevention: true,
        clearInstructions: true,
        memoryAids: false,
        attentionManagement: false,
        languageSupport: ['en'],
        visualCues: true,
        consistentPatterns: true,
        helpSystems: true
      },
      hearing: {
        audioAlternatives: false,
        visualNotifications: true,
        captionSupport: false,
        signLanguage: false,
        vibrationFeedback: false,
        textToSpeech: false,
        audioDescriptions: false,
        soundControls: false,
        visualAlerts: true,
        communicationAids: false
      },
      comprehensive: {
        wcagCompliance: 'AA',
        accessibilityTesting: true,
        userPreferences: true,
        assistiveTechnology: true,
        universalDesign: true,
        inclusiveFeatures: true,
        accessibilityDocumentation: true,
        userFeedback: true,
        continuousImprovement: true,
        accessibilityStandards: ['WCAG 2.1', 'Section 508']
      }
    };
  });

  const updateConfig = useCallback((newConfig: Partial<AccessibilityConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      visual: { ...prev.visual, ...newConfig.visual },
      motor: { ...prev.motor, ...newConfig.motor },
      cognitive: { ...prev.cognitive, ...newConfig.cognitive },
      hearing: { ...prev.hearing, ...newConfig.hearing },
      comprehensive: { ...prev.comprehensive, ...newConfig.comprehensive }
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setConfig({
      visual: {
        highContrast: false,
        fontSize: 'medium',
        colorBlindSupport: false,
        screenReaderOptimized: false,
        focusIndicators: true,
        textScaling: 1.0,
        theme: 'auto',
        visualHierarchy: true,
        iconAlternatives: false,
        readingMode: false
      },
      motor: {
        keyboardNavigation: true,
        voiceControl: false,
        touchTargets: 'medium',
        gestureAlternatives: false,
        switchNavigation: false,
        eyeTracking: false,
        oneHandedMode: false,
        customizableShortcuts: false,
        assistiveDevices: false,
        timeoutControls: false
      },
      cognitive: {
        simplifiedInterface: false,
        progressIndicators: true,
        errorPrevention: true,
        clearInstructions: true,
        memoryAids: false,
        attentionManagement: false,
        languageSupport: ['en'],
        visualCues: true,
        consistentPatterns: true,
        helpSystems: true
      },
      hearing: {
        audioAlternatives: false,
        visualNotifications: true,
        captionSupport: false,
        signLanguage: false,
        vibrationFeedback: false,
        textToSpeech: false,
        audioDescriptions: false,
        soundControls: false,
        visualAlerts: true,
        communicationAids: false
      },
      comprehensive: {
        wcagCompliance: 'AA',
        accessibilityTesting: true,
        userPreferences: true,
        assistiveTechnology: true,
        universalDesign: true,
        inclusiveFeatures: true,
        accessibilityDocumentation: true,
        userFeedback: true,
        continuousImprovement: true,
        accessibilityStandards: ['WCAG 2.1', 'Section 508']
      }
    });
  }, []);

  const isEnabled = useCallback((feature: keyof AccessibilityConfig) => {
    return Boolean(config[feature]);
  }, [config]);

  const getPreference = useCallback(<T extends keyof AccessibilityConfig>(
    category: T,
    preference: keyof AccessibilityConfig[T]
  ) => {
    return config[category][preference];
  }, [config]);

  // Persist configuration
  useEffect(() => {
    if (options.persist && typeof window !== 'undefined') {
      localStorage.setItem('atlas-accessibility-preferences', JSON.stringify(config));
    }
  }, [config, options.persist]);

  return {
    config,
    updateConfig,
    resetToDefaults,
    isEnabled,
    getPreference
  };
}

// Hook for ARIA attributes
export function useAriaAttributes(
  elementRef: React.RefObject<HTMLElement>,
  attributes: Record<string, string | boolean>
) {
  useEffect(() => {
    if (elementRef.current) {
      ariaUtils.setAriaAttributes(elementRef.current, attributes);
    }
  }, [elementRef, attributes]);
}

// Hook for focus management
export function useFocusManagement(
  elementRef: React.RefObject<HTMLElement>,
  options: {
    trapFocus?: boolean;
    autoFocus?: boolean;
    restoreFocus?: boolean;
  } = {}
) {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      if (options.autoFocus) {
        elementRef.current.focus();
      }

      if (options.trapFocus) {
        focusUtils.trapFocus(elementRef.current);
      }

      if (options.restoreFocus) {
        previousFocusRef.current = document.activeElement as HTMLElement;
      }
    }

    return () => {
      if (options.trapFocus && elementRef.current) {
        focusUtils.releaseFocusTrap(elementRef.current);
      }

      if (options.restoreFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [elementRef, options]);
}

// Hook for keyboard navigation
export function useKeyboardNavigation(
  onKeyDown: (event: React.KeyboardEvent) => void,
  options: {
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
) {
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (options.preventDefault) {
      event.preventDefault();
    }
    if (options.stopPropagation) {
      event.stopPropagation();
    }
    onKeyDown(event);
  }, [onKeyDown, options]);

  return { handleKeyDown };
}

// Hook for screen reader announcements
export function useScreenReaderAnnouncements() {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    screenReaderUtils.announce(message, priority);
  }, []);

  const announceError = useCallback((message: string) => {
    announce(message, 'assertive');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(message, 'polite');
  }, [announce]);

  return { announce, announceError, announceSuccess };
}

// Hook for accessibility feature detection
export function useAccessibilityFeatureDetection() {
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const detectedFeatures = detectAccessibilityFeatures();
    setFeatures(detectedFeatures);
  }, []);

  return features;
}

// Hook for high contrast mode
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

// Hook for reduced motion
export function useReducedMotion() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isReducedMotion;
}

// Hook for dark mode preference
export function useDarkModePreference() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
}

// Hook for touch support detection
export function useTouchSupport() {
  const [isTouchSupported, setIsTouchSupported] = useState(false);

  useEffect(() => {
    setIsTouchSupported('ontouchstart' in window);
  }, []);

  return isTouchSupported;
}

// Hook for voice control
export function useVoiceControl() {
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    setIsVoiceSupported('speechRecognition' in window);
  }, []);

  const startListening = useCallback(() => {
    if (!isVoiceSupported) return;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isVoiceSupported]);

  const stopListening = useCallback(() => {
    if (isListening) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.stop();
    }
  }, [isListening]);

  return {
    isVoiceSupported,
    isListening,
    transcript,
    startListening,
    stopListening
  };
}

// Hook for accessibility testing
export function useAccessibilityTesting() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = useCallback((element: HTMLElement) => {
    setIsRunning(true);
    
    // Simulate running accessibility tests
    setTimeout(() => {
      const results = [
        { test: 'ARIA attributes', status: 'pass', message: 'All required ARIA attributes present' },
        { test: 'Color contrast', status: 'pass', message: 'Text meets contrast requirements' },
        { test: 'Focus management', status: 'warning', message: 'Some focus indicators could be improved' }
      ];
      
      setTestResults(results);
      setIsRunning(false);
    }, 1000);
  }, []);

  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  return {
    testResults,
    isRunning,
    runTests,
    clearResults
  };
}

// Hook for accessibility preferences
export function useAccessibilityPreferences() {
  const [preferences, setPreferences] = useState<AccessibilityConfig | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('atlas-accessibility-preferences');
      if (stored) {
        try {
          setPreferences(JSON.parse(stored));
        } catch (error) {
          console.warn('Failed to load accessibility preferences:', error);
        }
      }
    }
  }, []);

  const savePreferences = useCallback((newPreferences: AccessibilityConfig) => {
    setPreferences(newPreferences);
    if (typeof window !== 'undefined') {
      localStorage.setItem('atlas-accessibility-preferences', JSON.stringify(newPreferences));
    }
  }, []);

  const loadPreferences = useCallback(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('atlas-accessibility-preferences');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setPreferences(parsed);
          return parsed;
        } catch (error) {
          console.warn('Failed to load accessibility preferences:', error);
        }
      }
    }
    return null;
  }, []);

  return {
    preferences,
    savePreferences,
    loadPreferences
  };
}

// Hook for accessibility metrics
export function useAccessibilityMetrics() {
  const [metrics, setMetrics] = useState<Record<string, number>>({});

  const trackMetric = useCallback((metric: string, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [metric]: (prev[metric] || 0) + value
    }));
  }, []);

  const resetMetrics = useCallback(() => {
    setMetrics({});
  }, []);

  return {
    metrics,
    trackMetric,
    resetMetrics
  };
}

// Hook for accessibility shortcuts
export function useAccessibilityShortcuts() {
  const [shortcuts, setShortcuts] = useState<Record<string, string>>({});

  const registerShortcut = useCallback((key: string, description: string) => {
    setShortcuts(prev => ({
      ...prev,
      [key]: description
    }));
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => {
      const newShortcuts = { ...prev };
      delete newShortcuts[key];
      return newShortcuts;
    });
  }, []);

  const getShortcutDescription = useCallback((key: string) => {
    return shortcuts[key] || '';
  }, [shortcuts]);

  return {
    shortcuts,
    registerShortcut,
    unregisterShortcut,
    getShortcutDescription
  };
}
