/**
 * Accessibility Context
 * 
 * React context for managing accessibility preferences and configuration.
 * Provides centralized state management for all accessibility features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  AccessibilityContextType, 
  AccessibilityConfig, 
  AccessibilityPreferences,
  DEFAULT_ACCESSIBILITY_CONFIG 
} from './accessibility-types';

// Context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Action Types
type AccessibilityAction =
  | { type: 'UPDATE_CONFIG'; payload: Partial<AccessibilityConfig> }
  | { type: 'RESET_TO_DEFAULTS' }
  | { type: 'LOAD_PREFERENCES'; payload: AccessibilityPreferences }
  | { type: 'SET_USER_ID'; payload: string };

// Reducer
function accessibilityReducer(
  state: AccessibilityPreferences,
  action: AccessibilityAction
): AccessibilityPreferences {
  switch (action.type) {
    case 'UPDATE_CONFIG':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
          visual: { ...state.preferences.visual, ...action.payload.visual },
          motor: { ...state.preferences.motor, ...action.payload.motor },
          cognitive: { ...state.preferences.cognitive, ...action.payload.cognitive },
          hearing: { ...state.preferences.hearing, ...action.payload.hearing },
          comprehensive: { ...state.preferences.comprehensive, ...action.payload.comprehensive }
        },
        lastUpdated: new Date()
      };
    
    case 'RESET_TO_DEFAULTS':
      return {
        ...state,
        preferences: DEFAULT_ACCESSIBILITY_CONFIG,
        lastUpdated: new Date()
      };
    
    case 'LOAD_PREFERENCES':
      return action.payload;
    
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload
      };
    
    default:
      return state;
  }
}

// Provider Props
interface AccessibilityProviderProps {
  children: React.ReactNode;
  userId?: string;
  initialConfig?: Partial<AccessibilityConfig>;
  persist?: boolean;
}

// Provider Component
export function AccessibilityProvider({ 
  children, 
  userId, 
  initialConfig,
  persist = true 
}: AccessibilityProviderProps) {
  const [state, dispatch] = useReducer(accessibilityReducer, {
    userId,
    preferences: {
      ...DEFAULT_ACCESSIBILITY_CONFIG,
      ...initialConfig,
      visual: { ...DEFAULT_ACCESSIBILITY_CONFIG.visual, ...initialConfig?.visual },
      motor: { ...DEFAULT_ACCESSIBILITY_CONFIG.motor, ...initialConfig?.motor },
      cognitive: { ...DEFAULT_ACCESSIBILITY_CONFIG.cognitive, ...initialConfig?.cognitive },
      hearing: { ...DEFAULT_ACCESSIBILITY_CONFIG.hearing, ...initialConfig?.hearing },
      comprehensive: { ...DEFAULT_ACCESSIBILITY_CONFIG.comprehensive, ...initialConfig?.comprehensive }
    },
    lastUpdated: new Date(),
    version: '1.0.0'
  });

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      const stored = localStorage.getItem('atlas-accessibility-preferences');
      if (stored) {
        try {
          const preferences = JSON.parse(stored);
          dispatch({ type: 'LOAD_PREFERENCES', payload: preferences });
        } catch (error) {
          console.warn('Failed to load accessibility preferences:', error);
        }
      }
    }
  }, [persist]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      localStorage.setItem('atlas-accessibility-preferences', JSON.stringify(state));
    }
  }, [state, persist]);

  // Update configuration
  const updateConfig = useCallback((config: Partial<AccessibilityConfig>) => {
    dispatch({ type: 'UPDATE_CONFIG', payload: config });
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    dispatch({ type: 'RESET_TO_DEFAULTS' });
  }, []);

  // Export preferences
  const exportPreferences = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  // Import preferences
  const importPreferences = useCallback((preferences: string) => {
    try {
      const parsed = JSON.parse(preferences);
      dispatch({ type: 'LOAD_PREFERENCES', payload: parsed });
    } catch (error) {
      throw new Error('Invalid preferences format');
    }
  }, []);

  // Set user ID
  const setUserId = useCallback((id: string) => {
    dispatch({ type: 'SET_USER_ID', payload: id });
  }, []);

  const contextValue: AccessibilityContextType = {
    config: state.preferences,
    preferences: state,
    updateConfig,
    resetToDefaults,
    exportPreferences,
    importPreferences
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// Hook to use accessibility context
export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Hook to check if a feature is enabled
export function useAccessibilityFeature(category: keyof AccessibilityConfig, feature: string): boolean {
  const { config } = useAccessibility();
  return Boolean(config[category][feature as keyof AccessibilityConfig[typeof category]]);
}

// Hook to get a specific preference value
export function useAccessibilityPreference<T extends keyof AccessibilityConfig>(
  category: T,
  preference: keyof AccessibilityConfig[T]
): AccessibilityConfig[T][keyof AccessibilityConfig[T]] {
  const { config } = useAccessibility();
  return config[category][preference];
}

// Hook to update a specific preference
export function useUpdateAccessibilityPreference() {
  const { updateConfig } = useAccessibility();
  
  return useCallback(<T extends keyof AccessibilityConfig>(
    category: T,
    preference: keyof AccessibilityConfig[T],
    value: AccessibilityConfig[T][keyof AccessibilityConfig[T]]
  ) => {
    updateConfig({
      [category]: {
        [preference]: value
      }
    } as Partial<AccessibilityConfig>);
  }, [updateConfig]);
}

// Higher-order component for accessibility
export function withAccessibility<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AccessibilityWrappedComponent(props: P) {
    return (
      <AccessibilityProvider>
        <Component {...props} />
      </AccessibilityProvider>
    );
  };
}

// Accessibility context consumer
export function AccessibilityConsumer({ children }: { children: (context: AccessibilityContextType) => React.ReactNode }) {
  const context = useAccessibility();
  return <>{children(context)}</>;
}

// Utility function to check if accessibility is enabled
export function isAccessibilityEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  const stored = localStorage.getItem('atlas-accessibility-preferences');
  if (!stored) return false;
  
  try {
    const preferences = JSON.parse(stored);
    return preferences.preferences.comprehensive.accessibilityTesting;
  } catch {
    return false;
  }
}

// Utility function to get current accessibility config
export function getCurrentAccessibilityConfig(): AccessibilityConfig | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('atlas-accessibility-preferences');
  if (!stored) return null;
  
  try {
    const preferences = JSON.parse(stored);
    return preferences.preferences;
  } catch {
    return null;
  }
}

// Utility function to set accessibility config
export function setAccessibilityConfig(config: Partial<AccessibilityConfig>): void {
  if (typeof window === 'undefined') return;
  
  const current = getCurrentAccessibilityConfig() || DEFAULT_ACCESSIBILITY_CONFIG;
  const updated = {
    ...current,
    ...config,
    visual: { ...current.visual, ...config.visual },
    motor: { ...current.motor, ...config.motor },
    cognitive: { ...current.cognitive, ...config.cognitive },
    hearing: { ...current.hearing, ...config.hearing },
    comprehensive: { ...current.comprehensive, ...config.comprehensive }
  };
  
  const preferences: AccessibilityPreferences = {
    preferences: updated,
    lastUpdated: new Date(),
    version: '1.0.0'
  };
  
  localStorage.setItem('atlas-accessibility-preferences', JSON.stringify(preferences));
}

// Utility function to reset accessibility config
export function resetAccessibilityConfig(): void {
  if (typeof window === 'undefined') return;
  
  const preferences: AccessibilityPreferences = {
    preferences: DEFAULT_ACCESSIBILITY_CONFIG,
    lastUpdated: new Date(),
    version: '1.0.0'
  };
  
  localStorage.setItem('atlas-accessibility-preferences', JSON.stringify(preferences));
}
