/**
 * Accessibility Manager
 * 
 * Centralized manager for accessibility features and WCAG compliance.
 * Provides high-level API for managing accessibility across the application.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

import { 
  AccessibilityConfig, 
  AccessibilityPreferences, 
  AccessibilityFeature,
  AccessibilityCategory,
  AccessibilityTestResult,
  AccessibilityAuditResult,
  AccessibilityMetrics,
  AccessibilityError,
  AccessibilityEvent,
  DEFAULT_ACCESSIBILITY_CONFIG
} from './accessibility-types';
import { 
  ariaUtils, 
  focusUtils, 
  keyboardUtils, 
  screenReaderUtils,
  validationUtils,
  detectAccessibilityFeatures,
  getAccessibilityConfigForFeature,
  runAccessibilityTests,
  createAccessibilityEvent,
  dispatchAccessibilityEvent,
  saveAccessibilityPreferences,
  loadAccessibilityPreferences,
  generateAccessibilityCSS
} from './accessibility-utils';

export class AccessibilityManager {
  private config: AccessibilityConfig;
  private preferences: AccessibilityPreferences;
  private eventListeners: Map<string, EventListener[]>;
  private metrics: AccessibilityMetrics;
  private errors: AccessibilityError[];

  constructor(initialConfig?: Partial<AccessibilityConfig>) {
    this.config = { ...DEFAULT_ACCESSIBILITY_CONFIG, ...initialConfig };
    this.preferences = {
      preferences: this.config,
      lastUpdated: new Date(),
      version: '1.0.0'
    };
    this.eventListeners = new Map();
    this.metrics = {
      timestamp: new Date(),
      sessionId: this.generateSessionId(),
      metrics: {
        keyboardNavigation: 0,
        screenReaderUsage: 0,
        voiceControlUsage: 0,
        highContrastUsage: 0,
        fontSizeChanges: 0,
        themeSwitches: 0,
        accessibilityFeaturesUsed: []
      }
    };
    this.errors = [];
    
    this.initialize();
  }

  // Initialization
  private initialize(): void {
    this.loadPreferences();
    this.setupEventListeners();
    this.applyConfiguration();
    this.trackInitialMetrics();
  }

  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Configuration Management
  public getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AccessibilityConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      visual: { ...this.config.visual, ...newConfig.visual },
      motor: { ...this.config.motor, ...newConfig.motor },
      cognitive: { ...this.config.cognitive, ...newConfig.cognitive },
      hearing: { ...this.config.hearing, ...newConfig.hearing },
      comprehensive: { ...this.config.comprehensive, ...newConfig.comprehensive }
    };
    
    this.preferences.preferences = this.config;
    this.preferences.lastUpdated = new Date();
    
    this.applyConfiguration();
    this.savePreferences();
    this.dispatchEvent('config-change', { config: this.config });
  }

  public resetToDefaults(): void {
    this.config = { ...DEFAULT_ACCESSIBILITY_CONFIG };
    this.preferences.preferences = this.config;
    this.preferences.lastUpdated = new Date();
    
    this.applyConfiguration();
    this.savePreferences();
    this.dispatchEvent('config-change', { config: this.config });
  }

  // Feature Management
  public isFeatureEnabled(feature: AccessibilityFeature): boolean {
    const category = this.getFeatureCategory(feature);
    const featureKey = this.getFeatureKey(feature);
    return Boolean(this.config[category][featureKey as keyof AccessibilityConfig[typeof category]]);
  }

  public enableFeature(feature: AccessibilityFeature): void {
    const category = this.getFeatureCategory(feature);
    const featureKey = this.getFeatureKey(feature);
    
    this.updateConfig({
      [category]: {
        [featureKey]: true
      }
    } as Partial<AccessibilityConfig>);
    
    this.trackFeatureUsage(feature);
  }

  public disableFeature(feature: AccessibilityFeature): void {
    const category = this.getFeatureCategory(feature);
    const featureKey = this.getFeatureKey(feature);
    
    this.updateConfig({
      [category]: {
        [featureKey]: false
      }
    } as Partial<AccessibilityConfig>);
  }

  public toggleFeature(feature: AccessibilityFeature): void {
    if (this.isFeatureEnabled(feature)) {
      this.disableFeature(feature);
    } else {
      this.enableFeature(feature);
    }
  }

  // Preference Management
  public getPreferences(): AccessibilityPreferences {
    return { ...this.preferences };
  }

  public savePreferences(): void {
    saveAccessibilityPreferences(this.config);
  }

  public loadPreferences(): void {
    const loaded = loadAccessibilityPreferences();
    if (loaded) {
      this.config = loaded;
      this.preferences.preferences = loaded;
      this.preferences.lastUpdated = new Date();
    }
  }

  public exportPreferences(): string {
    return JSON.stringify(this.preferences, null, 2);
  }

  public importPreferences(preferencesJson: string): void {
    try {
      const preferences = JSON.parse(preferencesJson);
      this.preferences = preferences;
      this.config = preferences.preferences;
      this.applyConfiguration();
      this.dispatchEvent('config-change', { config: this.config });
    } catch (error) {
      throw new Error('Invalid preferences format');
    }
  }

  // Event Management
  public addEventListener(event: string, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public removeEventListener(event: string, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  public dispatchEvent(type: string, data: Record<string, any> = {}): void {
    const event = createAccessibilityEvent(type, data);
    document.dispatchEvent(event);
    
    const listeners = this.eventListeners.get(type);
    if (listeners) {
      listeners.forEach(listener => listener(event));
    }
  }

  // Testing and Validation
  public runAccessibilityTests(element: HTMLElement): AccessibilityTestResult[] {
    const errors = runAccessibilityTests(element);
    const results: AccessibilityTestResult[] = errors.map((error, index) => ({
      testId: `test-${index}`,
      testName: 'Accessibility Validation',
      status: 'fail',
      message: error,
      element,
      suggestions: this.getSuggestionsForError(error)
    }));

    this.dispatchEvent('test-result', { results, element });
    return results;
  }

  public runFullAudit(): AccessibilityAuditResult {
    const results: AccessibilityTestResult[] = [];
    const elements = document.querySelectorAll('*');
    
    elements.forEach(element => {
      const elementResults = this.runAccessibilityTests(element as HTMLElement);
      results.push(...elementResults);
    });

    const summary = {
      total: results.length,
      passed: results.filter(r => r.status === 'pass').length,
      failed: results.filter(r => r.status === 'fail').length,
      warnings: results.filter(r => r.status === 'warning').length
    };

    const score = summary.total > 0 ? (summary.passed / summary.total) * 100 : 0;

    const auditResult: AccessibilityAuditResult = {
      timestamp: new Date(),
      url: window.location.href,
      results,
      summary,
      wcagLevel: this.config.comprehensive.wcagCompliance,
      score
    };

    this.dispatchEvent('audit-complete', { result: auditResult });
    return auditResult;
  }

  // Metrics and Analytics
  public getMetrics(): AccessibilityMetrics {
    return { ...this.metrics };
  }

  public trackMetric(metric: string, value: number): void {
    this.metrics.metrics[metric as keyof typeof this.metrics.metrics] = 
      (this.metrics.metrics[metric as keyof typeof this.metrics.metrics] as number) + value;
  }

  public trackFeatureUsage(feature: AccessibilityFeature): void {
    if (!this.metrics.metrics.accessibilityFeaturesUsed.includes(feature)) {
      this.metrics.metrics.accessibilityFeaturesUsed.push(feature);
    }
  }

  public resetMetrics(): void {
    this.metrics = {
      timestamp: new Date(),
      sessionId: this.generateSessionId(),
      metrics: {
        keyboardNavigation: 0,
        screenReaderUsage: 0,
        voiceControlUsage: 0,
        highContrastUsage: 0,
        fontSizeChanges: 0,
        themeSwitches: 0,
        accessibilityFeaturesUsed: []
      }
    };
  }

  // Error Management
  public getErrors(): AccessibilityError[] {
    return [...this.errors];
  }

  public addError(error: AccessibilityError): void {
    this.errors.push(error);
    this.dispatchEvent('error', { error });
  }

  public clearErrors(): void {
    this.errors = [];
  }

  // Utility Methods
  private getFeatureCategory(feature: AccessibilityFeature): AccessibilityCategory {
    const categories: AccessibilityCategory[] = ['visual', 'motor', 'cognitive', 'hearing', 'comprehensive'];
    
    for (const category of categories) {
      if (this.config[category][feature as keyof AccessibilityConfig[typeof category]] !== undefined) {
        return category;
      }
    }
    
    throw new Error(`Unknown accessibility feature: ${feature}`);
  }

  private getFeatureKey(feature: AccessibilityFeature): string {
    const category = this.getFeatureCategory(feature);
    const config = this.config[category];
    
    for (const key in config) {
      if (key === feature) {
        return key;
      }
    }
    
    throw new Error(`Unknown accessibility feature: ${feature}`);
  }

  private getSuggestionsForError(error: string): string[] {
    const suggestions: Record<string, string[]> = {
      'ARIA attributes': [
        'Add required ARIA attributes',
        'Ensure ARIA attributes are valid',
        'Check for missing ARIA labels'
      ],
      'Color contrast': [
        'Increase text color contrast',
        'Use high contrast colors',
        'Check background colors'
      ],
      'Focus management': [
        'Add visible focus indicators',
        'Ensure proper tab order',
        'Implement focus trapping'
      ]
    };

    for (const [key, suggestionList] of Object.entries(suggestions)) {
      if (error.toLowerCase().includes(key.toLowerCase())) {
        return suggestionList;
      }
    }

    return ['Review accessibility guidelines', 'Check WCAG compliance'];
  }

  private setupEventListeners(): void {
    // Keyboard navigation tracking
    document.addEventListener('keydown', (event) => {
      if (keyboardUtils.isNavigationKey(event.key)) {
        this.trackMetric('keyboardNavigation', 1);
      }
    });

    // Screen reader usage tracking
    document.addEventListener('focus', (event) => {
      if (event.target instanceof HTMLElement) {
        const hasAriaLabel = event.target.hasAttribute('aria-label') || 
                             event.target.hasAttribute('aria-labelledby');
        if (hasAriaLabel) {
          this.trackMetric('screenReaderUsage', 1);
        }
      }
    });

    // Theme switch tracking
    const themeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    themeMediaQuery.addEventListener('change', () => {
      this.trackMetric('themeSwitches', 1);
    });
  }

  private applyConfiguration(): void {
    // Apply CSS based on configuration
    const css = generateAccessibilityCSS(this.config);
    this.injectCSS(css);

    // Apply high contrast mode
    if (this.config.visual.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    // Apply text scaling
    if (this.config.visual.textScaling > 1.0) {
      document.body.classList.add('text-scaled');
      document.body.style.fontSize = `${this.config.visual.textScaling}em`;
    } else {
      document.body.classList.remove('text-scaled');
      document.body.style.fontSize = '';
    }

    // Apply reduced motion
    if (this.config.motor.timeoutControls) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }

  private injectCSS(css: string): void {
    let styleElement = document.getElementById('atlas-accessibility-styles');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'atlas-accessibility-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }

  private trackInitialMetrics(): void {
    const features = detectAccessibilityFeatures();
    
    if (features.highContrast) {
      this.trackMetric('highContrastUsage', 1);
    }
    
    if (features.screenReader) {
      this.trackMetric('screenReaderUsage', 1);
    }
  }

  // Public API Methods
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    screenReaderUtils.announce(message, priority);
  }

  public trapFocus(element: HTMLElement): void {
    focusUtils.trapFocus(element);
  }

  public releaseFocusTrap(element: HTMLElement): void {
    focusUtils.releaseFocusTrap(element);
  }

  public moveFocusTo(element: HTMLElement): void {
    focusUtils.moveFocusTo(element);
  }

  public validateElement(element: HTMLElement): string[] {
    const errors: string[] = [];
    
    errors.push(...validationUtils.validateAriaAttributes(element));
    errors.push(...validationUtils.validateFocusManagement(element));
    errors.push(...validationUtils.validateColorContrast(element));
    
    return errors;
  }

  public getAccessibilityReport(): {
    config: AccessibilityConfig;
    metrics: AccessibilityMetrics;
    errors: AccessibilityError[];
    features: Record<string, boolean>;
  } {
    return {
      config: this.getConfig(),
      metrics: this.getMetrics(),
      errors: this.getErrors(),
      features: detectAccessibilityFeatures()
    };
  }
}

// Singleton instance
let accessibilityManager: AccessibilityManager | null = null;

export function getAccessibilityManager(): AccessibilityManager {
  if (!accessibilityManager) {
    accessibilityManager = new AccessibilityManager();
  }
  return accessibilityManager;
}

export function initializeAccessibility(config?: Partial<AccessibilityConfig>): AccessibilityManager {
  if (accessibilityManager) {
    accessibilityManager.updateConfig(config || {});
  } else {
    accessibilityManager = new AccessibilityManager(config);
  }
  return accessibilityManager;
}

export function destroyAccessibilityManager(): void {
  if (accessibilityManager) {
    accessibilityManager.clearErrors();
    accessibilityManager.resetMetrics();
    accessibilityManager = null;
  }
}
