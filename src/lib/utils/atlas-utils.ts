import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with proper conflict resolution
 * Uses clsx for conditional classes and tailwind-merge for proper Tailwind merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Atlas Design System Utility Functions
 * These functions provide consistent access to design tokens and utilities
 */

// Color utilities
export const atlasColors = {
  primary: {
    darkest: 'var(--brand-primary-darkest)',
    dark: 'var(--brand-primary-dark)',
    main: 'var(--brand-primary-main)',
    light: 'var(--brand-primary-light)',
    lighter: 'var(--brand-primary-lighter)',
  },
  secondary: {
    dark: 'var(--brand-secondary-dark)',
    main: 'var(--brand-secondary-main)',
    light: 'var(--brand-secondary-light)',
    lighter: 'var(--brand-secondary-lighter)',
  },
  ai: {
    dark: 'var(--brand-accent-ai-dark)',
    main: 'var(--brand-accent-ai-main)',
    light: 'var(--brand-accent-ai-light)',
    lighter: 'var(--brand-accent-ai-lighter)',
  },
  success: {
    dark: 'var(--status-success-dark)',
    main: 'var(--status-success-main)',
    bg: 'var(--status-success-bg)',
  },
  error: {
    dark: 'var(--status-error-dark)',
    main: 'var(--status-error-main)',
    bg: 'var(--status-error-bg)',
  },
  warning: {
    dark: 'var(--status-warning-dark)',
    main: 'var(--status-warning-main)',
    bg: 'var(--status-warning-bg)',
  },
  info: {
    dark: 'var(--status-info-dark)',
    main: 'var(--status-info-main)',
    bg: 'var(--status-info-bg)',
  },
  ui: {
    bg: 'var(--ui-bg)',
    cardBg: 'var(--ui-card-bg)',
    textPrimary: 'var(--text-primary)',
    textSecondary: 'var(--text-secondary)',
    textTertiary: 'var(--text-tertiary)',
    border: 'var(--border)',
    borderSubtle: 'var(--border-subtle)',
  },
} as const;

// Typography utilities
export const atlasTypography = {
  fontFamily: {
    sans: 'var(--font-family-sans)',
    mono: 'var(--font-family-mono)',
    display: 'var(--font-family-display)',
  },
  fontSize: {
    xs: 'var(--text-xs)',
    sm: 'var(--text-sm)',
    base: 'var(--text-base)',
    lg: 'var(--text-lg)',
    xl: 'var(--text-xl)',
    '2xl': 'var(--text-2xl)',
    '3xl': 'var(--text-3xl)',
    '4xl': 'var(--text-4xl)',
    '5xl': 'var(--text-5xl)',
    '6xl': 'var(--text-6xl)',
  },
  fontWeight: {
    light: 'var(--font-weight-light)',
    normal: 'var(--font-weight-normal)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
  },
  lineHeight: {
    tight: 'var(--leading-tight)',
    snug: 'var(--leading-snug)',
    normal: 'var(--leading-normal)',
    relaxed: 'var(--leading-relaxed)',
    loose: 'var(--leading-loose)',
  },
} as const;

// Spacing utilities
export const atlasSpacing = {
  0: 'var(--space-0)',
  1: 'var(--space-1)',
  2: 'var(--space-2)',
  3: 'var(--space-3)',
  4: 'var(--space-4)',
  5: 'var(--space-5)',
  6: 'var(--space-6)',
  8: 'var(--space-8)',
  10: 'var(--space-10)',
  12: 'var(--space-12)',
  16: 'var(--space-16)',
  20: 'var(--space-20)',
  24: 'var(--space-24)',
  32: 'var(--space-32)',
  40: 'var(--space-40)',
  48: 'var(--space-48)',
  56: 'var(--space-56)',
  64: 'var(--space-64)',
} as const;

// Border radius utilities
export const atlasRadius = {
  none: 'var(--radius-none)',
  sm: 'var(--radius-sm)',
  base: 'var(--radius-base)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const;

// Shadow utilities
export const atlasShadows = {
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  base: 'var(--shadow-base)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  xl: 'var(--shadow-xl)',
  '2xl': 'var(--shadow-2xl)',
  inner: 'var(--shadow-inner)',
} as const;

// Animation utilities
export const atlasAnimations = {
  duration: {
    75: 'var(--duration-75)',
    100: 'var(--duration-100)',
    150: 'var(--duration-150)',
    200: 'var(--duration-200)',
    300: 'var(--duration-300)',
    500: 'var(--duration-500)',
    700: 'var(--duration-700)',
    1000: 'var(--duration-1000)',
  },
  easing: {
    linear: 'var(--ease-linear)',
    in: 'var(--ease-in)',
    out: 'var(--ease-out)',
    'in-out': 'var(--ease-in-out)',
  },
} as const;

// Breakpoint utilities
export const atlasBreakpoints = {
  sm: 'var(--breakpoint-sm)',
  md: 'var(--breakpoint-md)',
  lg: 'var(--breakpoint-lg)',
  xl: 'var(--breakpoint-xl)',
  '2xl': 'var(--breakpoint-2xl)',
} as const;

// Z-index utilities
export const atlasZIndex = {
  dropdown: 'var(--z-index-dropdown)',
  sticky: 'var(--z-index-sticky)',
  fixed: 'var(--z-index-fixed)',
  'modal-backdrop': 'var(--z-index-modal-backdrop)',
  modal: 'var(--z-index-modal)',
  popover: 'var(--z-index-popover)',
  tooltip: 'var(--z-index-tooltip)',
  toast: 'var(--z-index-toast)',
} as const;

/**
 * Accessibility utilities
 */
export const atlasA11y = {
  // Focus ring styles
  focusRing: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2',
  
  // Screen reader only text
  srOnly: 'sr-only',
  
  // Skip link styles
  skipLink: 'absolute -top-40 left-6 z-50 bg-atlas-primary-main text-white px-4 py-2 rounded-md focus:top-6 transition-all duration-200',
  
  // High contrast mode detection
  isHighContrast: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-contrast: high)').matches;
  },
  
  // Reduced motion detection
  prefersReducedMotion: () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
} as const;

/**
 * Component variant utilities using class-variance-authority
 */
export const atlasVariants = {
  // Button variants
  button: {
    base: 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    variants: {
      variant: {
        default: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        ai: 'bg-atlas-ai-main text-white hover:bg-atlas-ai-light',
        outline: 'border border-atlas-border bg-transparent hover:bg-atlas-border-subtle',
        ghost: 'hover:bg-atlas-border-subtle',
        link: 'text-atlas-primary-main underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 py-2 px-4',
        lg: 'h-11 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
  
  // Card variants
  card: {
    base: 'rounded-lg border border-atlas-border bg-atlas-card-bg text-atlas-text-primary shadow-sm',
    variants: {
      variant: {
        default: 'border-atlas-border',
        elevated: 'border-atlas-border-subtle shadow-md',
        outlined: 'border-2 border-atlas-primary-main',
      },
      padding: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  },
  
  // Input variants
  input: {
    base: 'flex h-10 w-full rounded-md border border-atlas-border bg-atlas-card-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-atlas-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main focus-visible:ring-atlas-error-main',
        success: 'border-atlas-success-main focus-visible:ring-atlas-success-main',
      },
      size: {
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
} as const;

/**
 * Responsive utility functions
 */
export const atlasResponsive = {
  // Mobile-first breakpoint helpers
  sm: (styles: string) => `sm:${styles}`,
  md: (styles: string) => `md:${styles}`,
  lg: (styles: string) => `lg:${styles}`,
  xl: (styles: string) => `xl:${styles}`,
  '2xl': (styles: string) => `2xl:${styles}`,
  
  // Container queries (when supported)
  container: (styles: string) => `@container ${styles}`,
  
  // Print styles
  print: (styles: string) => `print:${styles}`,
} as const;

/**
 * Animation utility functions
 */
export const atlasAnimationClasses = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  
  // Slide animations
  slideInFromTop: 'animate-slide-in-from-top',
  slideInFromBottom: 'animate-slide-in-from-bottom',
  slideInFromLeft: 'animate-slide-in-from-left',
  slideInFromRight: 'animate-slide-in-from-right',
  
  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',
  
  // Special animations
  spinSlow: 'animate-spin-slow',
  pulseAi: 'animate-pulse-ai',
  bounceGentle: 'animate-bounce-gentle',
} as const;

/**
 * Theme detection utilities
 */
export const atlasTheme = {
  // Get current theme
  getCurrentTheme: () => {
    if (typeof window === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') || 'light';
  },
  
  // Set theme
  setTheme: (theme: 'light' | 'dark' | 'system') => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  },
  
  // Check if dark mode
  isDarkMode: () => {
    if (typeof window === 'undefined') return false;
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  },
} as const;

/**
 * Export all utilities as a single object for easy importing
 */
export const atlas = {
  colors: atlasColors,
  typography: atlasTypography,
  spacing: atlasSpacing,
  radius: atlasRadius,
  shadows: atlasShadows,
  animations: atlasAnimations,
  animationClasses: atlasAnimationClasses,
  breakpoints: atlasBreakpoints,
  zIndex: atlasZIndex,
  a11y: atlasA11y,
  variants: atlasVariants,
  responsive: atlasResponsive,
  theme: atlasTheme,
} as const;
