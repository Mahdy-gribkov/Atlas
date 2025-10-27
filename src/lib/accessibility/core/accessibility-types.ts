/**
 * Accessibility Types
 * 
 * TypeScript interfaces and types for accessibility features.
 * Provides type safety for all accessibility implementations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

import { ReactNode } from 'react';

// Base Accessibility Types
export interface AccessibilityConfig {
  visual: VisualAccessibilityConfig;
  motor: MotorAccessibilityConfig;
  cognitive: CognitiveAccessibilityConfig;
  hearing: HearingAccessibilityConfig;
  comprehensive: ComprehensiveAccessibilityConfig;
}

export interface AccessibilityPreferences {
  userId?: string;
  preferences: AccessibilityConfig;
  lastUpdated: Date;
  version: string;
}

// Visual Accessibility Types
export interface VisualAccessibilityConfig {
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorBlindSupport: boolean;
  screenReaderOptimized: boolean;
  focusIndicators: boolean;
  textScaling: number; // 1.0 to 2.0
  theme: 'light' | 'dark' | 'auto';
  visualHierarchy: boolean;
  iconAlternatives: boolean;
  readingMode: boolean;
}

// Motor Accessibility Types
export interface MotorAccessibilityConfig {
  keyboardNavigation: boolean;
  voiceControl: boolean;
  touchTargets: 'small' | 'medium' | 'large';
  gestureAlternatives: boolean;
  switchNavigation: boolean;
  eyeTracking: boolean;
  oneHandedMode: boolean;
  customizableShortcuts: boolean;
  assistiveDevices: boolean;
  timeoutControls: boolean;
}

// Cognitive Accessibility Types
export interface CognitiveAccessibilityConfig {
  simplifiedInterface: boolean;
  progressIndicators: boolean;
  errorPrevention: boolean;
  clearInstructions: boolean;
  memoryAids: boolean;
  attentionManagement: boolean;
  languageSupport: string[];
  visualCues: boolean;
  consistentPatterns: boolean;
  helpSystems: boolean;
}

// Hearing Accessibility Types
export interface HearingAccessibilityConfig {
  audioAlternatives: boolean;
  visualNotifications: boolean;
  captionSupport: boolean;
  signLanguage: boolean;
  vibrationFeedback: boolean;
  textToSpeech: boolean;
  audioDescriptions: boolean;
  soundControls: boolean;
  visualAlerts: boolean;
  communicationAids: boolean;
}

// Comprehensive Accessibility Types
export interface ComprehensiveAccessibilityConfig {
  wcagCompliance: 'A' | 'AA' | 'AAA';
  accessibilityTesting: boolean;
  userPreferences: boolean;
  assistiveTechnology: boolean;
  universalDesign: boolean;
  inclusiveFeatures: boolean;
  accessibilityDocumentation: boolean;
  userFeedback: boolean;
  continuousImprovement: boolean;
  accessibilityStandards: string[];
}

// Accessibility Context Types
export interface AccessibilityContextType {
  config: AccessibilityConfig;
  preferences: AccessibilityPreferences;
  updateConfig: (config: Partial<AccessibilityConfig>) => void;
  resetToDefaults: () => void;
  exportPreferences: () => string;
  importPreferences: (preferences: string) => void;
}

// Accessibility Component Props
export interface AccessibilityComponentProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  role?: string;
  tabIndex?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

// Accessibility Hook Types
export interface UseAccessibilityOptions {
  config?: Partial<AccessibilityConfig>;
  persist?: boolean;
  userId?: string;
}

export interface UseAccessibilityReturn {
  config: AccessibilityConfig;
  updateConfig: (config: Partial<AccessibilityConfig>) => void;
  resetToDefaults: () => void;
  isEnabled: (feature: keyof AccessibilityConfig) => boolean;
  getPreference: <T extends keyof AccessibilityConfig>(
    category: T,
    preference: keyof AccessibilityConfig[T]
  ) => AccessibilityConfig[T][keyof AccessibilityConfig[T]];
}

// Accessibility Testing Types
export interface AccessibilityTestResult {
  testId: string;
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  element?: HTMLElement;
  suggestions?: string[];
}

export interface AccessibilityAuditResult {
  timestamp: Date;
  url: string;
  results: AccessibilityTestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  wcagLevel: 'A' | 'AA' | 'AAA';
  score: number;
}

// Accessibility Metrics Types
export interface AccessibilityMetrics {
  timestamp: Date;
  userId?: string;
  sessionId: string;
  metrics: {
    keyboardNavigation: number;
    screenReaderUsage: number;
    voiceControlUsage: number;
    highContrastUsage: number;
    fontSizeChanges: number;
    themeSwitches: number;
    accessibilityFeaturesUsed: string[];
  };
}

// Accessibility Error Types
export interface AccessibilityError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  element?: HTMLElement;
  suggestion?: string;
  wcagGuideline?: string;
}

// Accessibility Event Types
export interface AccessibilityEvent {
  type: 'config-change' | 'feature-toggle' | 'error' | 'test-result';
  timestamp: Date;
  userId?: string;
  data: Record<string, any>;
}

// Accessibility Utility Types
export type AccessibilityFeature = 
  | 'high-contrast'
  | 'font-size'
  | 'color-blind'
  | 'screen-reader'
  | 'focus-indicators'
  | 'text-scaling'
  | 'theme-switching'
  | 'visual-hierarchy'
  | 'icon-alternatives'
  | 'reading-mode'
  | 'keyboard-navigation'
  | 'voice-control'
  | 'touch-targets'
  | 'gesture-alternatives'
  | 'switch-navigation'
  | 'eye-tracking'
  | 'one-handed-mode'
  | 'customizable-shortcuts'
  | 'assistive-devices'
  | 'timeout-controls'
  | 'simplified-interface'
  | 'progress-indicators'
  | 'error-prevention'
  | 'clear-instructions'
  | 'memory-aids'
  | 'attention-management'
  | 'language-support'
  | 'visual-cues'
  | 'consistent-patterns'
  | 'help-systems'
  | 'audio-alternatives'
  | 'visual-notifications'
  | 'caption-support'
  | 'sign-language'
  | 'vibration-feedback'
  | 'text-to-speech'
  | 'audio-descriptions'
  | 'sound-controls'
  | 'visual-alerts'
  | 'communication-aids'
  | 'wcag-compliance'
  | 'accessibility-testing'
  | 'user-preferences'
  | 'assistive-technology'
  | 'universal-design'
  | 'inclusive-features'
  | 'accessibility-documentation'
  | 'user-feedback'
  | 'continuous-improvement'
  | 'accessibility-standards';

export type AccessibilityCategory = 'visual' | 'motor' | 'cognitive' | 'hearing' | 'comprehensive';

// Accessibility Constants
export const ACCESSIBILITY_FEATURES: Record<AccessibilityCategory, AccessibilityFeature[]> = {
  visual: [
    'high-contrast',
    'font-size',
    'color-blind',
    'screen-reader',
    'focus-indicators',
    'text-scaling',
    'theme-switching',
    'visual-hierarchy',
    'icon-alternatives',
    'reading-mode'
  ],
  motor: [
    'keyboard-navigation',
    'voice-control',
    'touch-targets',
    'gesture-alternatives',
    'switch-navigation',
    'eye-tracking',
    'one-handed-mode',
    'customizable-shortcuts',
    'assistive-devices',
    'timeout-controls'
  ],
  cognitive: [
    'simplified-interface',
    'progress-indicators',
    'error-prevention',
    'clear-instructions',
    'memory-aids',
    'attention-management',
    'language-support',
    'visual-cues',
    'consistent-patterns',
    'help-systems'
  ],
  hearing: [
    'audio-alternatives',
    'visual-notifications',
    'caption-support',
    'sign-language',
    'vibration-feedback',
    'text-to-speech',
    'audio-descriptions',
    'sound-controls',
    'visual-alerts',
    'communication-aids'
  ],
  comprehensive: [
    'wcag-compliance',
    'accessibility-testing',
    'user-preferences',
    'assistive-technology',
    'universal-design',
    'inclusive-features',
    'accessibility-documentation',
    'user-feedback',
    'continuous-improvement',
    'accessibility-standards'
  ]
};

export const DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
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
