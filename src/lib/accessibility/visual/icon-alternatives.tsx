/**
 * Icon Alternatives Component
 * 
 * Provides icon alternatives for improved accessibility and visual clarity.
 * Implements WCAG 2.1 AA icon accessibility requirements and alternative text.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Icon Alternatives Variants
const iconAlternativesVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      type: {
        'text': 'icon-text',
        'shape': 'icon-shape',
        'pattern': 'icon-pattern',
        'border': 'icon-border',
        'background': 'icon-background',
        'none': 'icon-none'
      },
      size: {
        'xs': 'w-3 h-3 text-xs',
        'sm': 'w-4 h-4 text-sm',
        'md': 'w-5 h-5 text-base',
        'lg': 'w-6 h-6 text-lg',
        'xl': 'w-8 h-8 text-xl',
        '2xl': 'w-10 h-10 text-2xl'
      },
      style: {
        'solid': 'icon-solid',
        'outline': 'icon-outline',
        'filled': 'icon-filled',
        'minimal': 'icon-minimal'
      },
      color: {
        'primary': 'text-blue-600',
        'secondary': 'text-gray-600',
        'success': 'text-green-600',
        'warning': 'text-yellow-600',
        'error': 'text-red-600',
        'info': 'text-blue-500',
        'current': 'text-current'
      }
    },
    defaultVariants: {
      type: 'text',
      size: 'md',
      style: 'solid',
      color: 'current'
    }
  }
);

// Icon Alternatives Toggle Props
interface IconAlternativesToggleProps extends VariantProps<typeof iconAlternativesVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Icon Alternatives Toggle Component
export const IconAlternativesToggle = React.forwardRef<HTMLButtonElement, IconAlternativesToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.visual.iconAlternatives);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        visual: {
          iconAlternatives: newState
        }
      });
      
      onToggle?.(newState);
    }, [isEnabled, updateConfig, onToggle]);

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
            ? 'bg-orange-600 text-white border-orange-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable icon alternatives' : 'Enable icon alternatives'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Icon alternatives enabled' : 'Icon alternatives disabled'}
          </span>
        )}
      </button>
    );
  }
);

IconAlternativesToggle.displayName = 'IconAlternativesToggle';

// Icon Alternatives Provider Props
interface IconAlternativesProviderProps {
  children: React.ReactNode;
  className?: string;
  type?: 'text' | 'shape' | 'pattern' | 'border' | 'background' | 'none';
  applyToBody?: boolean;
}

// Icon Alternatives Provider Component
export const IconAlternativesProvider = React.forwardRef<HTMLDivElement, IconAlternativesProviderProps>(
  ({ 
    children, 
    className, 
    type = 'text', 
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentType, setCurrentType] = useState(type);

    useEffect(() => {
      if (config.visual.iconAlternatives) {
        setCurrentType(type);
      } else {
        setCurrentType('none');
      }
    }, [config.visual.iconAlternatives, type]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing icon alternative classes
        document.body.classList.remove(
          'icon-text',
          'icon-shape',
          'icon-pattern',
          'icon-border',
          'icon-background',
          'icon-none'
        );
        
        if (config.visual.iconAlternatives) {
          document.body.classList.add(`icon-${currentType}`);
        }
      }
    }, [currentType, applyToBody, config.visual.iconAlternatives]);

    return (
      <div
        ref={ref}
        className={cn(
          iconAlternativesVariants({ type: currentType }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IconAlternativesProvider.displayName = 'IconAlternativesProvider';

// Icon Alternatives Icon Component
interface IconAlternativesIconProps extends VariantProps<typeof iconAlternativesVariants> {
  children?: React.ReactNode;
  className?: string;
  name: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  style?: 'solid' | 'outline' | 'filled' | 'minimal';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'current';
  type?: 'text' | 'shape' | 'pattern' | 'border' | 'background' | 'none';
}

export const IconAlternativesIcon = React.forwardRef<HTMLSpanElement, IconAlternativesIconProps>(
  ({ 
    children, 
    className, 
    name, 
    alt, 
    size = 'md', 
    style = 'solid',
    color = 'current',
    type = 'text',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isIconAlternativesEnabled = config.visual.iconAlternatives;

    const iconMap: Record<string, string> = {
      'home': '🏠',
      'user': '👤',
      'settings': '⚙️',
      'search': '🔍',
      'menu': '☰',
      'close': '✕',
      'edit': '✏️',
      'delete': '🗑️',
      'save': '💾',
      'download': '⬇️',
      'upload': '⬆️',
      'share': '📤',
      'like': '❤️',
      'star': '⭐',
      'heart': '❤️',
      'bookmark': '🔖',
      'notification': '🔔',
      'message': '💬',
      'phone': '📞',
      'email': '📧',
      'calendar': '📅',
      'clock': '🕐',
      'location': '📍',
      'map': '🗺️',
      'camera': '📷',
      'image': '🖼️',
      'video': '🎥',
      'music': '🎵',
      'play': '▶️',
      'pause': '⏸️',
      'stop': '⏹️',
      'next': '⏭️',
      'previous': '⏮️',
      'volume': '🔊',
      'mute': '🔇',
      'fullscreen': '⛶',
      'minimize': '➖',
      'maximize': '➕',
      'refresh': '🔄',
      'loading': '⏳',
      'success': '✅',
      'error': '❌',
      'warning': '⚠️',
      'info': 'ℹ️',
      'question': '❓',
      'check': '✓',
      'plus': '+',
      'minus': '-',
      'arrow-up': '↑',
      'arrow-down': '↓',
      'arrow-left': '←',
      'arrow-right': '→',
      'chevron-up': '⌃',
      'chevron-down': '⌄',
      'chevron-left': '⌃',
      'chevron-right': '⌃'
    };

    const getIconContent = () => {
      if (isIconAlternativesEnabled) {
        switch (type) {
          case 'text':
            return iconMap[name] || name;
          case 'shape':
            return '●';
          case 'pattern':
            return '■';
          case 'border':
            return '□';
          case 'background':
            return '▣';
          default:
            return iconMap[name] || name;
        }
      }
      return children || iconMap[name] || name;
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          iconAlternativesVariants({ 
            type: isIconAlternativesEnabled ? type : 'none',
            size,
            style,
            color
          }),
          className
        )}
        aria-label={alt || name}
        role="img"
        {...props}
      >
        {getIconContent()}
      </span>
    );
  }
);

IconAlternativesIcon.displayName = 'IconAlternativesIcon';

// Icon Alternatives Button Component
interface IconAlternativesButtonProps extends VariantProps<typeof iconAlternativesVariants> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  iconAlt?: string;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const IconAlternativesButton = React.forwardRef<HTMLButtonElement, IconAlternativesButtonProps>(
  ({ 
    children, 
    className, 
    onClick, 
    disabled, 
    type = 'button', 
    icon,
    iconAlt,
    iconPosition = 'left',
    iconSize = 'md',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isIconAlternativesEnabled = config.visual.iconAlternatives;

    const iconElement = icon ? (
      <IconAlternativesIcon
        name={icon}
        alt={iconAlt}
        size={iconSize}
        type={isIconAlternativesEnabled ? 'text' : 'none'}
        className={cn(
          iconPosition === 'left' ? 'mr-2' : '',
          iconPosition === 'right' ? 'ml-2' : '',
          iconPosition === 'top' ? 'mb-2' : '',
          iconPosition === 'bottom' ? 'mt-2' : ''
        )}
      />
    ) : null;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'px-4 py-2 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
          iconPosition === 'top' || iconPosition === 'bottom' ? 'flex flex-col items-center' : 'flex items-center',
          className
        )}
        {...props}
      >
        {iconPosition === 'left' && iconElement}
        {iconPosition === 'top' && iconElement}
        <span>{children}</span>
        {iconPosition === 'right' && iconElement}
        {iconPosition === 'bottom' && iconElement}
      </button>
    );
  }
);

IconAlternativesButton.displayName = 'IconAlternativesButton';

// Icon Alternatives Link Component
interface IconAlternativesLinkProps extends VariantProps<typeof iconAlternativesVariants> {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  icon?: string;
  iconAlt?: string;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const IconAlternativesLink = React.forwardRef<HTMLAnchorElement, IconAlternativesLinkProps>(
  ({ 
    children, 
    href, 
    className, 
    external, 
    target = '_self',
    icon,
    iconAlt,
    iconPosition = 'left',
    iconSize = 'md',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isIconAlternativesEnabled = config.visual.iconAlternatives;

    const iconElement = icon ? (
      <IconAlternativesIcon
        name={icon}
        alt={iconAlt}
        size={iconSize}
        type={isIconAlternativesEnabled ? 'text' : 'none'}
        className={cn(
          iconPosition === 'left' ? 'mr-2' : '',
          iconPosition === 'right' ? 'ml-2' : '',
          iconPosition === 'top' ? 'mb-2' : '',
          iconPosition === 'bottom' ? 'mt-2' : ''
        )}
      />
    ) : null;

    return (
      <a
        ref={ref}
        href={href}
        target={external ? '_blank' : target}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(
          'transition-all duration-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500',
          iconPosition === 'top' || iconPosition === 'bottom' ? 'flex flex-col items-center' : 'flex items-center',
          className
        )}
        {...props}
      >
        {iconPosition === 'left' && iconElement}
        {iconPosition === 'top' && iconElement}
        <span>{children}</span>
        {iconPosition === 'right' && iconElement}
        {iconPosition === 'bottom' && iconElement}
        {external && (
          <span className="sr-only">(opens in new tab)</span>
        )}
      </a>
    );
  }
);

IconAlternativesLink.displayName = 'IconAlternativesLink';

// Icon Alternatives Status Component
interface IconAlternativesStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const IconAlternativesStatus = React.forwardRef<HTMLDivElement, IconAlternativesStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isIconAlternativesEnabled = config.visual.iconAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-orange-500" />
        <span className="font-medium">
          Icon Alternatives: {isIconAlternativesEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isIconAlternativesEnabled 
              ? 'Alternative text and shapes for icons' 
              : 'Standard icon display'
            }
          </div>
        )}
      </div>
    );
  }
);

IconAlternativesStatus.displayName = 'IconAlternativesStatus';

// Icon Alternatives Demo Component
interface IconAlternativesDemoProps {
  className?: string;
  showControls?: boolean;
}

export const IconAlternativesDemo = React.forwardRef<HTMLDivElement, IconAlternativesDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isIconAlternativesEnabled = config.visual.iconAlternatives;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Icon Alternatives Demo</h3>
        
        <div className="flex flex-wrap gap-4">
          <IconAlternativesButton
            icon="home"
            iconAlt="Home"
            iconPosition="left"
            iconSize={isIconAlternativesEnabled ? 'md' : 'md'}
          >
            Home
          </IconAlternativesButton>
          
          <IconAlternativesButton
            icon="settings"
            iconAlt="Settings"
            iconPosition="left"
            iconSize={isIconAlternativesEnabled ? 'md' : 'md'}
          >
            Settings
          </IconAlternativesButton>
          
          <IconAlternativesButton
            icon="search"
            iconAlt="Search"
            iconPosition="left"
            iconSize={isIconAlternativesEnabled ? 'md' : 'md'}
          >
            Search
          </IconAlternativesButton>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <IconAlternativesLink
            href="#"
            icon="download"
            iconAlt="Download"
            iconPosition="left"
            iconSize={isIconAlternativesEnabled ? 'md' : 'md'}
          >
            Download
          </IconAlternativesLink>
          
          <IconAlternativesLink
            href="#"
            icon="share"
            iconAlt="Share"
            iconPosition="left"
            iconSize={isIconAlternativesEnabled ? 'md' : 'md'}
          >
            Share
          </IconAlternativesLink>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Icon alternatives provide better accessibility for users with visual impairments.
            </p>
          </div>
        )}
      </div>
    );
  }
);

IconAlternativesDemo.displayName = 'IconAlternativesDemo';

// Export all components
export {
  iconAlternativesVariants,
  type IconAlternativesToggleProps,
  type IconAlternativesProviderProps,
  type IconAlternativesIconProps,
  type IconAlternativesButtonProps,
  type IconAlternativesLinkProps,
  type IconAlternativesStatusProps,
  type IconAlternativesDemoProps
};
