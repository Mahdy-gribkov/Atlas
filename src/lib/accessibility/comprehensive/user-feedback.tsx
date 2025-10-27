/**
 * User Feedback Component
 * 
 * Provides user feedback support for comprehensive accessibility.
 * Implements WCAG 2.1 AA user feedback requirements and comprehensive accessibility.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// User Feedback Variants
const userFeedbackVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'user-feedback-standard',
        'enhanced': 'user-feedback-enhanced',
        'comprehensive': 'user-feedback-comprehensive',
        'custom': 'user-feedback-custom'
      },
      type: {
        'rating': 'feedback-type-rating',
        'comment': 'feedback-type-comment',
        'suggestion': 'feedback-type-suggestion',
        'bug-report': 'feedback-type-bug-report',
        'mixed': 'feedback-type-mixed'
      },
      style: {
        'minimal': 'feedback-style-minimal',
        'moderate': 'feedback-style-moderate',
        'detailed': 'feedback-style-detailed',
        'custom': 'feedback-style-custom'
      },
      format: {
        'text': 'feedback-format-text',
        'visual': 'feedback-format-visual',
        'interactive': 'feedback-format-interactive',
        'mixed': 'feedback-format-mixed'
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

// User Feedback Toggle Props
interface UserFeedbackToggleProps extends VariantProps<typeof userFeedbackVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// User Feedback Toggle Component
export const UserFeedbackToggle = React.forwardRef<HTMLButtonElement, UserFeedbackToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.comprehensive.userFeedback);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        comprehensive: {
          userFeedback: newState
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
            ? 'bg-emerald-600 text-white border-emerald-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable user feedback' : 'Enable user feedback'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'User feedback enabled' : 'User feedback disabled'}
          </span>
        )}
      </button>
    );
  }
);

UserFeedbackToggle.displayName = 'UserFeedbackToggle';

// User Feedback Provider Props
interface UserFeedbackProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'rating' | 'comment' | 'suggestion' | 'bug-report' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// User Feedback Provider Component
export const UserFeedbackProvider = React.forwardRef<HTMLDivElement, UserFeedbackProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'mixed',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.comprehensive.userFeedback) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.comprehensive.userFeedback]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing user feedback classes
        document.body.classList.remove(
          'user-feedback-standard',
          'user-feedback-enhanced',
          'user-feedback-comprehensive',
          'user-feedback-custom'
        );
        
        document.body.classList.add(`user-feedback-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          userFeedbackVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

UserFeedbackProvider.displayName = 'UserFeedbackProvider';

// User Feedback Form Component
interface UserFeedbackFormProps extends VariantProps<typeof userFeedbackVariants> {
  className?: string;
  onSubmit?: (feedback: any) => void;
  type?: 'rating' | 'comment' | 'suggestion' | 'bug-report' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const UserFeedbackForm = React.forwardRef<HTMLDivElement, UserFeedbackFormProps>(
  ({ 
    className, 
    onSubmit,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isUserFeedbackEnabled = config.comprehensive.userFeedback;
    const [feedback, setFeedback] = useState({
      type: 'comment',
      rating: 5,
      title: '',
      description: '',
      category: 'accessibility',
      priority: 'medium'
    });

    const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(feedback);
      console.log('Feedback submitted:', feedback);
      
      // Reset form
      setFeedback({
        type: 'comment',
        rating: 5,
        title: '',
        description: '',
        category: 'accessibility',
        priority: 'medium'
      });
    }, [feedback, onSubmit]);

    const handleInputChange = useCallback((field: string, value: any) => {
      setFeedback(prev => ({
        ...prev,
        [field]: value
      }));
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          userFeedbackVariants({ 
            mode: isUserFeedbackEnabled ? 'enhanced' : mode,
            type,
            style
          }),
          className
        )}
        {...props}
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Accessibility Feedback
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Feedback Type
            </label>
            <select
              value={feedback.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="comment">Comment</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug-report">Bug Report</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          
          {feedback.type === 'rating' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleInputChange('rating', star)}
                    className={cn(
                      'text-2xl transition-colors duration-200',
                      star <= feedback.rating 
                        ? 'text-yellow-400' 
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={feedback.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Brief description of your feedback"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={feedback.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Detailed description of your feedback..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={feedback.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="accessibility">Accessibility</option>
                <option value="usability">Usability</option>
                <option value="performance">Performance</option>
                <option value="design">Design</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={feedback.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors duration-200"
            >
              Submit Feedback
            </button>
            <button
              type="button"
              onClick={() => setFeedback({
                type: 'comment',
                rating: 5,
                title: '',
                description: '',
                category: 'accessibility',
                priority: 'medium'
              })}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    );
  }
);

UserFeedbackForm.displayName = 'UserFeedbackForm';

// User Feedback Status Component
interface UserFeedbackStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const UserFeedbackStatus = React.forwardRef<HTMLDivElement, UserFeedbackStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isUserFeedbackEnabled = config.comprehensive.userFeedback;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-emerald-500" />
        <span className="font-medium">
          User Feedback: {isUserFeedbackEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isUserFeedbackEnabled 
              ? 'Enhanced user feedback collection and analysis' 
              : 'Standard accessibility features'
            }
          </div>
        )}
      </div>
    );
  }
);

UserFeedbackStatus.displayName = 'UserFeedbackStatus';

// User Feedback Demo Component
interface UserFeedbackDemoProps {
  className?: string;
  showControls?: boolean;
}

export const UserFeedbackDemo = React.forwardRef<HTMLDivElement, UserFeedbackDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isUserFeedbackEnabled = config.comprehensive.userFeedback;

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">User Feedback Demo</h3>
        
        <UserFeedbackForm
          mode={isUserFeedbackEnabled ? 'enhanced' : 'standard'}
          type={isUserFeedbackEnabled ? 'mixed' : 'mixed'}
          style={isUserFeedbackEnabled ? 'detailed' : 'moderate'}
          onSubmit={(feedback) => console.log('Feedback submitted:', feedback)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isUserFeedbackEnabled 
                ? 'User feedback is enabled. Comprehensive feedback collection and analysis is available.'
                : 'Standard accessibility features are used. Enable user feedback for enhanced collection.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

UserFeedbackDemo.displayName = 'UserFeedbackDemo';

// Export all components
export {
  userFeedbackVariants,
  type UserFeedbackToggleProps,
  type UserFeedbackProviderProps,
  type UserFeedbackFormProps,
  type UserFeedbackStatusProps,
  type UserFeedbackDemoProps
};
