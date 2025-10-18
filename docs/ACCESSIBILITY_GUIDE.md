# Accessibility Guide

This guide provides comprehensive information about accessibility features and implementation in the AI Travel Agent application, ensuring WCAG 2.1 AA compliance and inclusive user experience.

## Table of Contents

1. [Accessibility Overview](#accessibility-overview)
2. [WCAG 2.1 AA Compliance](#wcag-21-aa-compliance)
3. [Screen Reader Support](#screen-reader-support)
4. [Keyboard Navigation](#keyboard-navigation)
5. [Visual Accessibility](#visual-accessibility)
6. [Motor Accessibility](#motor-accessibility)
7. [Cognitive Accessibility](#cognitive-accessibility)
8. [Internationalization](#internationalization)
9. [Testing Accessibility](#testing-accessibility)
10. [Accessibility Best Practices](#accessibility-best-practices)

## Accessibility Overview

The AI Travel Agent application is designed with accessibility as a core principle, ensuring that all users can access and use the application regardless of their abilities or disabilities.

### Accessibility Principles

- **Perceivable**: Information and UI components must be presentable in ways users can perceive
- **Operable**: UI components and navigation must be operable by all users
- **Understandable**: Information and UI operation must be understandable
- **Robust**: Content must be robust enough to be interpreted by assistive technologies

### Accessibility Features

- **Screen Reader Support**: Full compatibility with screen readers
- **Keyboard Navigation**: Complete keyboard accessibility
- **High Contrast Mode**: Enhanced contrast for visual accessibility
- **Text Scaling**: Support for text scaling up to 200%
- **Voice Control**: Voice command support
- **RTL Support**: Right-to-left language support
- **Focus Management**: Clear focus indicators and logical tab order

## WCAG 2.1 AA Compliance

### Level A Requirements

#### 1.1.1 Non-text Content

```typescript
// Provide alt text for all images
<Image
  src="/destination-image.jpg"
  alt="Beautiful view of Paris with Eiffel Tower in the background"
  width={300}
  height={200}
/>

// Decorative images should have empty alt text
<Image
  src="/decorative-pattern.jpg"
  alt=""
  width={100}
  height={100}
/>
```

#### 1.3.1 Info and Relationships

```typescript
// Use semantic HTML elements
<main>
  <section aria-labelledby="itinerary-heading">
    <h2 id="itinerary-heading">Your Itineraries</h2>
    <ul role="list">
      <li role="listitem">
        <article>
          <h3>Paris Adventure</h3>
          <p>5-day trip to Paris, France</p>
        </article>
      </li>
    </ul>
  </section>
</main>
```

#### 1.4.1 Use of Color

```typescript
// Don't rely solely on color to convey information
<Button
  variant={error ? 'destructive' : 'default'}
  aria-label={error ? 'Error: Invalid input' : 'Submit form'}
>
  {error ? '❌' : '✅'} Submit
</Button>
```

### Level AA Requirements

#### 1.4.3 Contrast (Minimum)

```css
/* Ensure sufficient color contrast */
.text-primary {
  color: #1a1a1a; /* 4.5:1 contrast ratio with white background */
}

.text-secondary {
  color: #4a4a4a; /* 4.5:1 contrast ratio with white background */
}

.text-muted {
  color: #6b7280; /* 4.5:1 contrast ratio with white background */
}
```

#### 1.4.4 Resize Text

```css
/* Support text scaling up to 200% */
html {
  font-size: 16px;
}

@media (min-resolution: 2dppx) {
  html {
    font-size: 18px;
  }
}

/* Use relative units for text sizing */
.text-sm {
  font-size: 0.875rem; /* 14px */
}

.text-base {
  font-size: 1rem; /* 16px */
}

.text-lg {
  font-size: 1.125rem; /* 18px */
}
```

#### 2.4.3 Focus Order

```typescript
// Ensure logical tab order
function ItineraryForm() {
  return (
    <form>
      <label htmlFor="title">Trip Title</label>
      <input id="title" type="text" tabIndex={1} />
      
      <label htmlFor="destination">Destination</label>
      <input id="destination" type="text" tabIndex={2} />
      
      <label htmlFor="start-date">Start Date</label>
      <input id="start-date" type="date" tabIndex={3} />
      
      <button type="submit" tabIndex={4}>
        Create Itinerary
      </button>
    </form>
  );
}
```

## Screen Reader Support

### ARIA Labels and Descriptions

```typescript
// Provide descriptive labels
<button
  aria-label="Close dialog"
  aria-describedby="close-description"
  onClick={onClose}
>
  <XIcon aria-hidden="true" />
</button>
<div id="close-description" className="sr-only">
  This will close the current dialog and return to the previous screen
</div>

// Use aria-labelledby for complex components
<div
  role="region"
  aria-labelledby="weather-heading"
  aria-describedby="weather-description"
>
  <h3 id="weather-heading">Current Weather</h3>
  <p id="weather-description">
    Real-time weather information for your destination
  </p>
  <div role="img" aria-label="Weather icon showing sunny conditions">
    <SunIcon />
  </div>
</div>
```

### Live Regions

```typescript
// Announce dynamic content changes
function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  return (
    <div>
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map(message => (
          <div key={message.id} role="article">
            {message.content}
          </div>
        ))}
      </div>
      
      {isTyping && (
        <div
          aria-live="polite"
          aria-label="AI is typing"
          className="sr-only"
        >
          AI assistant is typing a response
        </div>
      )}
    </div>
  );
}
```

### Form Accessibility

```typescript
// Accessible form implementation
function AccessibleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  return (
    <form>
      <fieldset>
        <legend>Travel Preferences</legend>
        
        <div>
          <label htmlFor="interests">Interests</label>
          <select
            id="interests"
            aria-describedby="interests-help"
            aria-invalid={!!errors.interests}
            aria-errormessage={errors.interests ? 'interests-error' : undefined}
          >
            <option value="">Select your interests</option>
            <option value="culture">Culture & History</option>
            <option value="food">Food & Dining</option>
            <option value="nature">Nature & Outdoors</option>
          </select>
          <div id="interests-help">
            Select the activities you're most interested in
          </div>
          {errors.interests && (
            <div id="interests-error" role="alert" aria-live="polite">
              {errors.interests}
            </div>
          )}
        </div>
        
        <div>
          <fieldset>
            <legend>Accessibility Requirements</legend>
            <div>
              <input
                type="checkbox"
                id="wheelchair"
                name="accessibility"
                value="wheelchair"
              />
              <label htmlFor="wheelchair">
                Wheelchair accessible venues
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="visual"
                name="accessibility"
                value="visual"
              />
              <label htmlFor="visual">
                Visual accessibility features
              </label>
            </div>
          </fieldset>
        </div>
      </fieldset>
    </form>
  );
}
```

## Keyboard Navigation

### Focus Management

```typescript
// Focus management hook
export function useFocusManagement() {
  const focusRef = useRef<HTMLElement>(null);
  
  const setFocus = useCallback((element: HTMLElement | null) => {
    if (element) {
      element.focus();
    }
  }, []);
  
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleKeyDown = (e: KeyboardEvent) => {
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
    
    container.addEventListener('keydown', handleKeyDown);
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return { focusRef, setFocus, trapFocus };
}
```

### Keyboard Shortcuts

```typescript
// Keyboard shortcuts hook
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Global shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Open search
            break;
          case 'n':
            e.preventDefault();
            // Create new itinerary
            break;
          case 's':
            e.preventDefault();
            // Save current work
            break;
        }
      }
      
      // Navigation shortcuts
      if (e.altKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            // Go to dashboard
            break;
          case '2':
            e.preventDefault();
            // Go to itineraries
            break;
          case '3':
            e.preventDefault();
            // Go to chat
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
```

### Skip Links

```typescript
// Skip links component
export function SkipLinks() {
  return (
    <div className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#search" className="skip-link">
        Skip to search
      </a>
    </div>
  );
}

// Skip links CSS
.skip-links {
  position: absolute;
  top: -40px;
  left: 6px;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}
```

## Visual Accessibility

### High Contrast Mode

```css
/* High contrast mode support */
@media (prefers-contrast: high) {
  .button {
    border: 2px solid currentColor;
  }
  
  .card {
    border: 1px solid #000;
  }
  
  .text-muted {
    color: #000;
  }
}

/* Custom high contrast theme */
.high-contrast {
  --background: #ffffff;
  --foreground: #000000;
  --primary: #0000ff;
  --secondary: #808080;
  --accent: #ff0000;
  --muted: #000000;
  --border: #000000;
}
```

### Color and Contrast

```typescript
// Color contrast utilities
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Ensure sufficient contrast
export function ensureContrast(foreground: string, background: string): string {
  const ratio = getContrastRatio(foreground, background);
  
  if (ratio < 4.5) {
    // Adjust color to meet contrast requirements
    return adjustColorForContrast(foreground, background, 4.5);
  }
  
  return foreground;
}
```

### Text Scaling

```css
/* Support for text scaling */
html {
  font-size: 16px;
}

/* Respect user's font size preferences */
@media (min-resolution: 2dppx) {
  html {
    font-size: 18px;
  }
}

/* Use relative units for text sizing */
.text-responsive {
  font-size: clamp(1rem, 2.5vw, 1.5rem);
}

/* Ensure text remains readable at 200% zoom */
@media (min-resolution: 2dppx) {
  .text-responsive {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
  }
}
```

## Motor Accessibility

### Touch Target Size

```css
/* Ensure touch targets are at least 44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}

/* Increase touch target size for important actions */
.button-primary {
  min-height: 48px;
  min-width: 48px;
  padding: 16px 24px;
}

/* Provide adequate spacing between touch targets */
.touch-target + .touch-target {
  margin-left: 8px;
}
```

### Gesture Alternatives

```typescript
// Provide alternatives to gestures
function SwipeableCard({ children, onSwipeLeft, onSwipeRight }: {
  children: React.ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  return (
    <div className="swipeable-card">
      {children}
      <div className="gesture-alternatives">
        <button
          onClick={onSwipeLeft}
          aria-label="Swipe left action"
          className="gesture-button"
        >
          ←
        </button>
        <button
          onClick={onSwipeRight}
          aria-label="Swipe right action"
          className="gesture-button"
        >
          →
        </button>
      </div>
    </div>
  );
}
```

### Voice Control

```typescript
// Voice control support
export function useVoiceControl() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
      };
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      return () => {
        recognition.stop();
      };
    }
  }, []);
  
  return { isListening, transcript };
}
```

## Cognitive Accessibility

### Simplified Interface

```typescript
// Simplified interface option
export function useSimplifiedInterface() {
  const [isSimplified, setIsSimplified] = useState(false);
  
  const toggleSimplified = useCallback(() => {
    setIsSimplified(prev => !prev);
  }, []);
  
  return { isSimplified, toggleSimplified };
}

// Simplified component wrapper
export function SimplifiedWrapper({ children, isSimplified }: {
  children: React.ReactNode;
  isSimplified: boolean;
}) {
  if (isSimplified) {
    return (
      <div className="simplified-interface">
        <div className="simplified-content">
          {children}
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

### Clear Language

```typescript
// Plain language component
export function PlainLanguageText({ children, level = 'simple' }: {
  children: React.ReactNode;
  level?: 'simple' | 'intermediate' | 'advanced';
}) {
  const getSimplifiedText = (text: string): string => {
    // Replace complex words with simpler alternatives
    const replacements: Record<string, string> = {
      'utilize': 'use',
      'facilitate': 'help',
      'implement': 'put in place',
      'optimize': 'improve',
      'leverage': 'use',
    };
    
    let simplified = text;
    Object.entries(replacements).forEach(([complex, simple]) => {
      simplified = simplified.replace(new RegExp(complex, 'gi'), simple);
    });
    
    return simplified;
  };
  
  if (level === 'simple') {
    return <span>{getSimplifiedText(children as string)}</span>;
  }
  
  return <span>{children}</span>;
}
```

### Error Prevention

```typescript
// Error prevention component
export function ErrorPreventionForm() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateField = useCallback((name: string, value: any) => {
    const fieldErrors: Record<string, string> = {};
    
    switch (name) {
      case 'email':
        if (!value.includes('@')) {
          fieldErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value.length < 8) {
          fieldErrors.password = 'Password must be at least 8 characters long';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, ...fieldErrors }));
  }, []);
  
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation
    if (Object.keys(errors).length > 0) {
      // Show error summary
      return;
    }
    
    // Submit form
  }, [errors]);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with real-time validation */}
    </form>
  );
}
```

## Internationalization

### RTL Support

```css
/* RTL support */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .flex {
  flex-direction: row-reverse;
}

[dir="rtl"] .ml-4 {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

/* RTL-specific styles */
.rtl-support {
  direction: rtl;
  unicode-bidi: embed;
}
```

### Language Switching

```typescript
// Language switching component
export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
  ];
  
  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      aria-label="Select language"
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  );
}
```

### Date and Time Formatting

```typescript
// Internationalized date formatting
export function useDateFormatting() {
  const { language } = useLanguage();
  
  const formatDate = useCallback((date: Date) => {
    const formatter = new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    return formatter.format(date);
  }, [language]);
  
  const formatTime = useCallback((date: Date) => {
    const formatter = new Intl.DateTimeFormat(language, {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return formatter.format(date);
  }, [language]);
  
  return { formatDate, formatTime };
}
```

## Testing Accessibility

### Automated Testing

```typescript
// Accessibility testing with jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(<ItineraryForm />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard accessible', async () => {
    render(<ItineraryForm />);
    
    // Test tab navigation
    const firstInput = screen.getByLabelText('Trip Title');
    firstInput.focus();
    expect(firstInput).toHaveFocus();
    
    // Test tab to next element
    userEvent.tab();
    const secondInput = screen.getByLabelText('Destination');
    expect(secondInput).toHaveFocus();
  });
});
```

### Manual Testing

```typescript
// Manual accessibility testing checklist
export const accessibilityChecklist = [
  {
    category: 'Keyboard Navigation',
    items: [
      'All interactive elements are keyboard accessible',
      'Tab order is logical and intuitive',
      'Focus indicators are visible',
      'Skip links are available',
    ],
  },
  {
    category: 'Screen Reader',
    items: [
      'All images have alt text',
      'Form fields have labels',
      'Dynamic content is announced',
      'ARIA labels are descriptive',
    ],
  },
  {
    category: 'Visual Accessibility',
    items: [
      'Color contrast meets WCAG AA standards',
      'Text can be scaled to 200%',
      'Information is not conveyed by color alone',
      'High contrast mode is supported',
    ],
  },
  {
    category: 'Motor Accessibility',
    items: [
      'Touch targets are at least 44px',
      'Adequate spacing between interactive elements',
      'Gesture alternatives are provided',
      'Voice control is supported',
    ],
  },
];
```

### User Testing

```typescript
// User testing with assistive technologies
export function conductAccessibilityTesting() {
  const testScenarios = [
    {
      name: 'Screen Reader Navigation',
      description: 'Navigate the application using a screen reader',
      tools: ['NVDA', 'JAWS', 'VoiceOver'],
    },
    {
      name: 'Keyboard Navigation',
      description: 'Complete all tasks using only the keyboard',
      tools: ['Keyboard', 'Tab key', 'Arrow keys'],
    },
    {
      name: 'Voice Control',
      description: 'Use voice commands to interact with the application',
      tools: ['Dragon NaturallySpeaking', 'Voice Control'],
    },
    {
      name: 'High Contrast Mode',
      description: 'Use the application in high contrast mode',
      tools: ['Windows High Contrast', 'macOS High Contrast'],
    },
  ];
  
  return testScenarios;
}
```

## Accessibility Best Practices

### Development Best Practices

1. **Semantic HTML**: Use appropriate HTML elements
2. **ARIA Labels**: Provide descriptive labels and descriptions
3. **Keyboard Support**: Ensure all functionality is keyboard accessible
4. **Color Contrast**: Maintain sufficient color contrast
5. **Text Scaling**: Support text scaling up to 200%

### Design Best Practices

1. **Clear Navigation**: Provide clear and consistent navigation
2. **Error Handling**: Provide clear error messages and recovery options
3. **Loading States**: Indicate loading and processing states
4. **Feedback**: Provide immediate feedback for user actions
5. **Consistency**: Maintain consistent design patterns

### Testing Best Practices

1. **Automated Testing**: Use automated accessibility testing tools
2. **Manual Testing**: Conduct manual testing with assistive technologies
3. **User Testing**: Test with real users with disabilities
4. **Regular Audits**: Conduct regular accessibility audits
5. **Continuous Improvement**: Continuously improve accessibility

## Conclusion

This accessibility guide provides comprehensive information about implementing accessibility features in the AI Travel Agent application. Accessibility is not just a compliance requirement but a fundamental aspect of creating an inclusive user experience.

For additional accessibility resources, refer to:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
