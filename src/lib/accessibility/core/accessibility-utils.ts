/**
 * Accessibility Utilities
 * 
 * Utility functions for accessibility features and WCAG compliance.
 * Provides helper functions for common accessibility operations.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

import { AccessibilityConfig, AccessibilityFeature, AccessibilityCategory } from './accessibility-types';

// ARIA Utilities
export const ariaUtils = {
  // Generate unique ID for ARIA attributes
  generateId: (prefix: string = 'atlas'): string => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Set ARIA attributes on element
  setAriaAttributes: (element: HTMLElement, attributes: Record<string, string | boolean>): void => {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('aria-')) {
        element.setAttribute(key, String(value));
      }
    });
  },

  // Remove ARIA attributes from element
  removeAriaAttributes: (element: HTMLElement, attributes: string[]): void => {
    attributes.forEach(attr => {
      if (attr.startsWith('aria-')) {
        element.removeAttribute(attr);
      }
    });
  },

  // Check if element has required ARIA attributes
  hasRequiredAriaAttributes: (element: HTMLElement, required: string[]): boolean => {
    return required.every(attr => element.hasAttribute(attr));
  },

  // Get ARIA label for element
  getAriaLabel: (element: HTMLElement): string | null => {
    return element.getAttribute('aria-label') || 
           element.getAttribute('aria-labelledby') || 
           element.textContent?.trim() || 
           null;
  }
};

// Focus Management Utilities
export const focusUtils = {
  // Trap focus within element
  trapFocus: (element: HTMLElement): void => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement.focus();
  },

  // Release focus trap
  releaseFocusTrap: (element: HTMLElement): void => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;

    if (firstElement) {
      firstElement.removeEventListener('keydown', () => {});
    }
  },

  // Move focus to element
  moveFocusTo: (element: HTMLElement): void => {
    element.focus();
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },

  // Get next focusable element
  getNextFocusableElement: (currentElement: HTMLElement): HTMLElement | null => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(currentElement);
    return focusableElements[currentIndex + 1] as HTMLElement || null;
  },

  // Get previous focusable element
  getPreviousFocusableElement: (currentElement: HTMLElement): HTMLElement | null => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).indexOf(currentElement);
    return focusableElements[currentIndex - 1] as HTMLElement || null;
  }
};

// Color Utilities
export const colorUtils = {
  // Check if color meets contrast ratio
  meetsContrastRatio: (foreground: string, background: string, ratio: number = 4.5): boolean => {
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    return contrast >= ratio;
  },

  // Get luminance of color
  getLuminance: (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;
    
    const { r, g, b } = rgb;
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Convert hex to RGB
  hexToRgb: (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  },

  // Generate high contrast colors
  generateHighContrastColors: (baseColor: string): { foreground: string; background: string } => {
    const luminance = getLuminance(baseColor);
    return luminance > 0.5 
      ? { foreground: '#000000', background: '#FFFFFF' }
      : { foreground: '#FFFFFF', background: '#000000' };
  }
};

// Keyboard Utilities
export const keyboardUtils = {
  // Check if key is navigation key
  isNavigationKey: (key: string): boolean => {
    const navigationKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'];
    return navigationKeys.includes(key);
  },

  // Check if key is activation key
  isActivationKey: (key: string): boolean => {
    const activationKeys = ['Enter', 'Space'];
    return activationKeys.includes(key);
  },

  // Check if key is escape key
  isEscapeKey: (key: string): boolean => {
    return key === 'Escape';
  },

  // Get keyboard shortcut description
  getKeyboardShortcutDescription: (keys: string[]): string => {
    return keys.map(key => {
      switch (key) {
        case 'Ctrl': return 'Ctrl';
        case 'Alt': return 'Alt';
        case 'Shift': return 'Shift';
        case 'Meta': return 'Cmd';
        case 'Enter': return 'Enter';
        case 'Space': return 'Space';
        case 'Escape': return 'Esc';
        case 'ArrowUp': return '↑';
        case 'ArrowDown': return '↓';
        case 'ArrowLeft': return '←';
        case 'ArrowRight': return '→';
        default: return key;
      }
    }).join(' + ');
  }
};

// Screen Reader Utilities
export const screenReaderUtils = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create screen reader only text
  createScreenReaderOnlyText: (text: string): HTMLElement => {
    const element = document.createElement('span');
    element.className = 'sr-only';
    element.textContent = text;
    return element;
  },

  // Check if screen reader is active
  isScreenReaderActive: (): boolean => {
    return window.speechSynthesis !== undefined && 
           window.speechSynthesis.getVoices().length > 0;
  }
};

// Validation Utilities
export const validationUtils = {
  // Validate ARIA attributes
  validateAriaAttributes: (element: HTMLElement): string[] => {
    const errors: string[] = [];
    
    // Check for required ARIA attributes
    if (element.hasAttribute('aria-expanded') && !element.hasAttribute('aria-controls')) {
      errors.push('Elements with aria-expanded must have aria-controls');
    }
    
    if (element.hasAttribute('aria-labelledby') && !document.getElementById(element.getAttribute('aria-labelledby')!)) {
      errors.push('aria-labelledby references non-existent element');
    }
    
    if (element.hasAttribute('aria-describedby') && !document.getElementById(element.getAttribute('aria-describedby')!)) {
      errors.push('aria-describedby references non-existent element');
    }
    
    return errors;
  },

  // Validate focus management
  validateFocusManagement: (element: HTMLElement): string[] => {
    const errors: string[] = [];
    
    // Check if element is focusable
    if (element.hasAttribute('tabindex') && element.getAttribute('tabindex') === '-1') {
      errors.push('Element with tabindex="-1" should not be focusable');
    }
    
    // Check if element has proper focus indicators
    if (element.matches('button, [href], input, select, textarea')) {
      const styles = window.getComputedStyle(element);
      if (styles.outline === 'none' && styles.boxShadow === 'none') {
        errors.push('Focusable element should have visible focus indicators');
      }
    }
    
    return errors;
  },

  // Validate color contrast
  validateColorContrast: (element: HTMLElement): string[] => {
    const errors: string[] = [];
    const styles = window.getComputedStyle(element);
    const foreground = styles.color;
    const background = styles.backgroundColor;
    
    if (foreground && background) {
      const contrast = colorUtils.meetsContrastRatio(foreground, background);
      if (!contrast) {
        errors.push('Text does not meet minimum contrast ratio of 4.5:1');
      }
    }
    
    return errors;
  }
};

// Utility Functions
export function getLuminance(color: string): number {
  return colorUtils.getLuminance(color);
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  return colorUtils.hexToRgb(hex);
}

// Accessibility Feature Detection
export function detectAccessibilityFeatures(): Record<string, boolean> {
  const features: Record<string, boolean> = {};
  
  // Check for high contrast mode
  features.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
  
  // Check for reduced motion
  features.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check for dark mode preference
  features.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Check for screen reader
  features.screenReader = screenReaderUtils.isScreenReaderActive();
  
  // Check for touch support
  features.touchSupport = 'ontouchstart' in window;
  
  // Check for voice control
  features.voiceControl = 'speechRecognition' in window;
  
  return features;
}

// Accessibility Configuration Helpers
export function getAccessibilityConfigForFeature(feature: AccessibilityFeature): Partial<AccessibilityConfig> {
  const config: Partial<AccessibilityConfig> = {};
  
  switch (feature) {
    case 'high-contrast':
      config.visual = { highContrast: true };
      break;
    case 'font-size':
      config.visual = { fontSize: 'large' };
      break;
    case 'keyboard-navigation':
      config.motor = { keyboardNavigation: true };
      break;
    case 'voice-control':
      config.motor = { voiceControl: true };
      break;
    case 'simplified-interface':
      config.cognitive = { simplifiedInterface: true };
      break;
    case 'audio-alternatives':
      config.hearing = { audioAlternatives: true };
      break;
    case 'wcag-compliance':
      config.comprehensive = { wcagCompliance: 'AA' };
      break;
  }
  
  return config;
}

// Accessibility Testing Helpers
export function runAccessibilityTests(element: HTMLElement): string[] {
  const errors: string[] = [];
  
  // Run ARIA validation
  errors.push(...validationUtils.validateAriaAttributes(element));
  
  // Run focus management validation
  errors.push(...validationUtils.validateFocusManagement(element));
  
  // Run color contrast validation
  errors.push(...validationUtils.validateColorContrast(element));
  
  return errors;
}

// Accessibility Event Helpers
export function createAccessibilityEvent(
  type: string, 
  data: Record<string, any> = {}
): CustomEvent {
  return new CustomEvent(`atlas-accessibility-${type}`, {
    detail: {
      timestamp: new Date(),
      ...data
    }
  });
}

export function dispatchAccessibilityEvent(
  type: string, 
  data: Record<string, any> = {}
): void {
  const event = createAccessibilityEvent(type, data);
  document.dispatchEvent(event);
}

// Accessibility Storage Helpers
export function saveAccessibilityPreferences(preferences: AccessibilityConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('atlas-accessibility-preferences', JSON.stringify(preferences));
  }
}

export function loadAccessibilityPreferences(): AccessibilityConfig | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('atlas-accessibility-preferences');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.warn('Failed to load accessibility preferences:', error);
      }
    }
  }
  return null;
}

// Accessibility CSS Helpers
export function generateAccessibilityCSS(config: AccessibilityConfig): string {
  let css = '';
  
  // High contrast mode
  if (config.visual.highContrast) {
    css += `
      .high-contrast {
        filter: contrast(150%) brightness(1.2);
      }
    `;
  }
  
  // Font size scaling
  if (config.visual.textScaling > 1.0) {
    css += `
      .text-scaled {
        font-size: ${config.visual.textScaling}em !important;
      }
    `;
  }
  
  // Focus indicators
  if (config.visual.focusIndicators) {
    css += `
      *:focus {
        outline: 2px solid #0066cc !important;
        outline-offset: 2px !important;
      }
    `;
  }
  
  // Reduced motion
  if (config.motor.timeoutControls) {
    css += `
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    `;
  }
  
  return css;
}
