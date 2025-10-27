/**
 * Chat Customization Component
 * 
 * Provides chat interface customization and theming capabilities.
 * Implements advanced customization options and user preferences.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Chat Customization Variants
const chatCustomizationVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'chat-customization-mode-standard',
        'enhanced': 'chat-customization-mode-enhanced',
        'advanced': 'chat-customization-mode-advanced',
        'custom': 'chat-customization-mode-custom'
      },
      type: {
        'theme': 'customization-type-theme',
        'layout': 'customization-type-layout',
        'colors': 'customization-type-colors',
        'fonts': 'customization-type-fonts',
        'mixed': 'customization-type-mixed'
      },
      style: {
        'minimal': 'customization-style-minimal',
        'moderate': 'customization-style-moderate',
        'detailed': 'customization-style-detailed',
        'custom': 'customization-style-custom'
      },
      format: {
        'text': 'customization-format-text',
        'visual': 'customization-format-visual',
        'interactive': 'customization-format-interactive',
        'mixed': 'customization-format-mixed'
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

// Chat Customization Props
interface ChatCustomizationProps extends VariantProps<typeof chatCustomizationVariants> {
  className?: string;
  onCustomizationChange?: (customization: ChatCustomizationSettings) => void;
  initialSettings?: ChatCustomizationSettings;
  showPreview?: boolean;
  showReset?: boolean;
}

// Chat Customization Settings Interface
interface ChatCustomizationSettings {
  theme: {
    mode: 'light' | 'dark' | 'auto';
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  layout: {
    chatWidth: 'narrow' | 'medium' | 'wide' | 'full';
    messageSpacing: 'compact' | 'normal' | 'spacious';
    avatarSize: 'small' | 'medium' | 'large';
    borderRadius: 'none' | 'small' | 'medium' | 'large';
  };
  typography: {
    fontFamily: 'system' | 'serif' | 'monospace' | 'custom';
    fontSize: 'small' | 'medium' | 'large';
    fontWeight: 'light' | 'normal' | 'medium' | 'bold';
    lineHeight: 'tight' | 'normal' | 'relaxed';
  };
  behavior: {
    autoScroll: boolean;
    showTimestamps: boolean;
    showAvatars: boolean;
    showReactions: boolean;
    soundEnabled: boolean;
    notifications: boolean;
  };
  advanced: {
    animations: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    customCSS: string;
  };
}

// Chat Customization Component
export const ChatCustomization = React.forwardRef<HTMLDivElement, ChatCustomizationProps>(
  ({ 
    className, 
    onCustomizationChange,
    initialSettings,
    showPreview = true,
    showReset = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [settings, setSettings] = useState<ChatCustomizationSettings>(
      initialSettings || {
        theme: {
          mode: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#6B7280',
          accentColor: '#10B981',
          backgroundColor: '#FFFFFF',
          textColor: '#111827'
        },
        layout: {
          chatWidth: 'medium',
          messageSpacing: 'normal',
          avatarSize: 'medium',
          borderRadius: 'medium'
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'medium',
          fontWeight: 'normal',
          lineHeight: 'normal'
        },
        behavior: {
          autoScroll: true,
          showTimestamps: true,
          showAvatars: true,
          showReactions: true,
          soundEnabled: true,
          notifications: true
        },
        advanced: {
          animations: true,
          reducedMotion: false,
          highContrast: false,
          customCSS: ''
        }
      }
    );

    const [activeTab, setActiveTab] = useState('theme');

    const updateSetting = useCallback((path: string, value: any) => {
      setSettings(prev => {
        const newSettings = { ...prev };
        const keys = path.split('.');
        let current: any = newSettings;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        onCustomizationChange?.(newSettings);
        return newSettings;
      });
    }, [onCustomizationChange]);

    const resetSettings = useCallback(() => {
      const defaultSettings: ChatCustomizationSettings = {
        theme: {
          mode: 'light',
          primaryColor: '#3B82F6',
          secondaryColor: '#6B7280',
          accentColor: '#10B981',
          backgroundColor: '#FFFFFF',
          textColor: '#111827'
        },
        layout: {
          chatWidth: 'medium',
          messageSpacing: 'normal',
          avatarSize: 'medium',
          borderRadius: 'medium'
        },
        typography: {
          fontFamily: 'system',
          fontSize: 'medium',
          fontWeight: 'normal',
          lineHeight: 'normal'
        },
        behavior: {
          autoScroll: true,
          showTimestamps: true,
          showAvatars: true,
          showReactions: true,
          soundEnabled: true,
          notifications: true
        },
        advanced: {
          animations: true,
          reducedMotion: false,
          highContrast: false,
          customCSS: ''
        }
      };
      
      setSettings(defaultSettings);
      onCustomizationChange?.(defaultSettings);
    }, [onCustomizationChange]);

    const tabs = [
      { id: 'theme', name: 'Theme', icon: '🎨' },
      { id: 'layout', name: 'Layout', icon: '📐' },
      { id: 'typography', name: 'Typography', icon: '📝' },
      { id: 'behavior', name: 'Behavior', icon: '⚙️' },
      { id: 'advanced', name: 'Advanced', icon: '🔧' }
    ];

    const colorPresets = [
      { name: 'Blue', primary: '#3B82F6', secondary: '#6B7280', accent: '#10B981' },
      { name: 'Purple', primary: '#8B5CF6', secondary: '#6B7280', accent: '#F59E0B' },
      { name: 'Green', primary: '#10B981', secondary: '#6B7280', accent: '#EF4444' },
      { name: 'Red', primary: '#EF4444', secondary: '#6B7280', accent: '#3B82F6' },
      { name: 'Orange', primary: '#F59E0B', secondary: '#6B7280', accent: '#8B5CF6' }
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          chatCustomizationVariants({ type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Chat Customization
          </h3>
          {showReset && (
            <button
              onClick={resetSettings}
              className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Reset to Default
            </button>
          )}
        </div>
        
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Theme Mode
                </label>
                <div className="flex gap-2">
                  {['light', 'dark', 'auto'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => updateSetting('theme.mode', mode)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        settings.theme.mode === mode
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Color Presets
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        updateSetting('theme.primaryColor', preset.primary);
                        updateSetting('theme.secondaryColor', preset.secondary);
                        updateSetting('theme.accentColor', preset.accent);
                      }}
                      className="p-2 border border-gray-200 dark:border-gray-600 rounded-md hover:border-gray-300 dark:hover:border-gray-500 transition-colors duration-200"
                    >
                      <div className="flex gap-1 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={settings.theme.primaryColor}
                    onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                    Accent Color
                  </label>
                  <input
                    type="color"
                    value={settings.theme.accentColor}
                    onChange={(e) => updateSetting('theme.accentColor', e.target.value)}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Chat Width
                </label>
                <div className="flex gap-2">
                  {['narrow', 'medium', 'wide', 'full'].map((width) => (
                    <button
                      key={width}
                      onClick={() => updateSetting('layout.chatWidth', width)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        settings.layout.chatWidth === width
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {width.charAt(0).toUpperCase() + width.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Message Spacing
                </label>
                <div className="flex gap-2">
                  {['compact', 'normal', 'spacious'].map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => updateSetting('layout.messageSpacing', spacing)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        settings.layout.messageSpacing === spacing
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Avatar Size
                </label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('layout.avatarSize', size)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        settings.layout.avatarSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.typography.fontFamily}
                  onChange={(e) => updateSetting('typography.fontFamily', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                >
                  <option value="system">System Font</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Font Size
                </label>
                <div className="flex gap-2">
                  {['small', 'medium', 'large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSetting('typography.fontSize', size)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        settings.typography.fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Font Weight
                </label>
                <div className="flex gap-2">
                  {['light', 'normal', 'medium', 'bold'].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => updateSetting('typography.fontWeight', weight)}
                      className={cn(
                        'px-3 py-2 text-sm rounded-md transition-colors duration-200',
                        settings.typography.fontWeight === weight
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'
                      )}
                    >
                      {weight.charAt(0).toUpperCase() + weight.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'behavior' && (
            <div className="space-y-4">
              {Object.entries(settings.behavior).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <button
                    onClick={() => updateSetting(`behavior.${key}`, !value)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                      value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                        value ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {Object.entries(settings.advanced).filter(([key]) => key !== 'customCSS').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </label>
                    <button
                      onClick={() => updateSetting(`advanced.${key}`, !value)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
                        value ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200',
                          value ? 'translate-x-6' : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Custom CSS
                </label>
                <textarea
                  value={settings.advanced.customCSS}
                  onChange={(e) => updateSetting('advanced.customCSS', e.target.value)}
                  rows={4}
                  placeholder="Enter custom CSS here..."
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300 font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        {showPreview && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
              Preview
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Preview will be updated in real-time as you make changes
            </div>
          </div>
        )}
      </div>
    );
  }
);

ChatCustomization.displayName = 'ChatCustomization';

// Chat Customization Demo Component
interface ChatCustomizationDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ChatCustomizationDemo = React.forwardRef<HTMLDivElement, ChatCustomizationDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [customization, setCustomization] = useState<ChatCustomizationSettings | null>(null);

    const handleCustomizationChange = (settings: ChatCustomizationSettings) => {
      setCustomization(settings);
      console.log('Customization updated:', settings);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Chat Customization Demo
        </h3>
        
        <ChatCustomization
          onCustomizationChange={handleCustomizationChange}
          showPreview={true}
          showReset={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive chat customization with themes, layouts, typography, and advanced options.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ChatCustomizationDemo.displayName = 'ChatCustomizationDemo';

// Export all components
export {
  chatCustomizationVariants,
  type ChatCustomizationProps,
  type ChatCustomizationSettings,
  type ChatCustomizationDemoProps
};
