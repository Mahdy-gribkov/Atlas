/**
 * Memory Aids Component
 * 
 * Provides memory aids support for cognitive accessibility.
 * Implements WCAG 2.1 AA memory aids requirements and cognitive load reduction.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useAccessibility } from '../core/accessibility-context';

// Memory Aids Variants
const memoryAidsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'memory-aids-standard',
        'enhanced': 'memory-aids-enhanced',
        'comprehensive': 'memory-aids-comprehensive',
        'custom': 'memory-aids-custom'
      },
      type: {
        'visual': 'memory-type-visual',
        'text': 'memory-type-text',
        'audio': 'memory-type-audio',
        'mixed': 'memory-type-mixed'
      },
      persistence: {
        'session': 'memory-persistence-session',
        'local': 'memory-persistence-local',
        'cloud': 'memory-persistence-cloud',
        'custom': 'memory-persistence-custom'
      },
      format: {
        'simple': 'memory-format-simple',
        'detailed': 'memory-format-detailed',
        'interactive': 'memory-format-interactive',
        'custom': 'memory-format-custom'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'visual',
      persistence: 'local',
      format: 'simple'
    }
  }
);

// Memory Aids Toggle Props
interface MemoryAidsToggleProps extends VariantProps<typeof memoryAidsVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Memory Aids Toggle Component
export const MemoryAidsToggle = React.forwardRef<HTMLButtonElement, MemoryAidsToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const { config, updateConfig } = useAccessibility();
    const [isEnabled, setIsEnabled] = useState(config.cognitive.memoryAids);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      
      updateConfig({
        cognitive: {
          memoryAids: newState
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
            ? 'bg-yellow-600 text-white border-yellow-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable memory aids' : 'Enable memory aids'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Memory aids enabled' : 'Memory aids disabled'}
          </span>
        )}
      </button>
    );
  }
);

MemoryAidsToggle.displayName = 'MemoryAidsToggle';

// Memory Aids Provider Props
interface MemoryAidsProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
  type?: 'visual' | 'text' | 'audio' | 'mixed';
  persistence?: 'session' | 'local' | 'cloud' | 'custom';
  applyToBody?: boolean;
}

// Memory Aids Provider Component
export const MemoryAidsProvider = React.forwardRef<HTMLDivElement, MemoryAidsProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'visual',
    persistence = 'local',
    applyToBody = true,
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (config.cognitive.memoryAids) {
        setCurrentMode('enhanced');
      } else {
        setCurrentMode('standard');
      }
    }, [config.cognitive.memoryAids]);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing memory aids classes
        document.body.classList.remove(
          'memory-aids-standard',
          'memory-aids-enhanced',
          'memory-aids-comprehensive',
          'memory-aids-custom'
        );
        
        document.body.classList.add(`memory-aids-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          memoryAidsVariants({ mode: currentMode, type, persistence }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MemoryAidsProvider.displayName = 'MemoryAidsProvider';

// Memory Aids Reminder Component
interface MemoryAidsReminderProps extends VariantProps<typeof memoryAidsVariants> {
  className?: string;
  title?: string;
  content?: string;
  priority?: 'high' | 'medium' | 'low';
  type?: 'visual' | 'text' | 'audio' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
}

export const MemoryAidsReminder = React.forwardRef<HTMLDivElement, MemoryAidsReminderProps>(
  ({ 
    className, 
    title,
    content,
    priority = 'medium',
    type = 'visual',
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isMemoryAidsEnabled = config.cognitive.memoryAids;

    const priorityClasses = {
      high: 'border-red-500 bg-red-50 dark:bg-red-900/20',
      medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
      low: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
    };

    const priorityIcons = {
      high: '🔴',
      medium: '🟡',
      low: '🔵'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 transition-all duration-300',
          memoryAidsVariants({ 
            mode: isMemoryAidsEnabled ? 'enhanced' : mode,
            type
          }),
          priorityClasses[priority],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">{priorityIcons[priority]}</span>
          <div className="flex-1">
            {title && (
              <h3 className="text-md font-semibold mb-1 text-gray-800 dark:text-gray-200">
                {title}
              </h3>
            )}
            {content && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {content}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

MemoryAidsReminder.displayName = 'MemoryAidsReminder';

// Memory Aids Checklist Component
interface MemoryAidsChecklistProps extends VariantProps<typeof memoryAidsVariants> {
  className?: string;
  title?: string;
  items: string[];
  checkedItems?: number[];
  onItemToggle?: (index: number) => void;
  type?: 'visual' | 'text' | 'audio' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
}

export const MemoryAidsChecklist = React.forwardRef<HTMLDivElement, MemoryAidsChecklistProps>(
  ({ 
    className, 
    title,
    items,
    checkedItems = [],
    onItemToggle,
    type = 'visual',
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isMemoryAidsEnabled = config.cognitive.memoryAids;

    const handleItemToggle = useCallback((index: number) => {
      onItemToggle?.(index);
    }, [onItemToggle]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          memoryAidsVariants({ 
            mode: isMemoryAidsEnabled ? 'enhanced' : mode,
            type
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200"
              onClick={() => handleItemToggle(index)}
            >
              <div
                className={cn(
                  'w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200',
                  checkedItems.includes(index)
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-300 dark:border-gray-600'
                )}
              >
                {checkedItems.includes(index) && '✓'}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

MemoryAidsChecklist.displayName = 'MemoryAidsChecklist';

// Memory Aids Notes Component
interface MemoryAidsNotesProps extends VariantProps<typeof memoryAidsVariants> {
  className?: string;
  title?: string;
  notes?: string;
  onNotesChange?: (notes: string) => void;
  type?: 'visual' | 'text' | 'audio' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'comprehensive' | 'custom';
}

export const MemoryAidsNotes = React.forwardRef<HTMLDivElement, MemoryAidsNotesProps>(
  ({ 
    className, 
    title,
    notes = '',
    onNotesChange,
    type = 'text',
    mode = 'standard',
    ...props 
  }, ref) => {
    const { config } = useAccessibility();
    const isMemoryAidsEnabled = config.cognitive.memoryAids;

    const handleNotesChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onNotesChange?.(e.target.value);
    }, [onNotesChange]);

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          memoryAidsVariants({ 
            mode: isMemoryAidsEnabled ? 'enhanced' : mode,
            type
          }),
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        )}
        
        <textarea
          value={notes}
          onChange={handleNotesChange}
          placeholder="Add your notes here..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
        />
      </div>
    );
  }
);

MemoryAidsNotes.displayName = 'MemoryAidsNotes';

// Memory Aids Status Component
interface MemoryAidsStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const MemoryAidsStatus = React.forwardRef<HTMLDivElement, MemoryAidsStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const { config } = useAccessibility();
    const isMemoryAidsEnabled = config.cognitive.memoryAids;

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="font-medium">
          Memory Aids: {isMemoryAidsEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isMemoryAidsEnabled 
              ? 'Enhanced memory aids and reminders' 
              : 'Standard memory aids'
            }
          </div>
        )}
      </div>
    );
  }
);

MemoryAidsStatus.displayName = 'MemoryAidsStatus';

// Memory Aids Demo Component
interface MemoryAidsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const MemoryAidsDemo = React.forwardRef<HTMLDivElement, MemoryAidsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const { config } = useAccessibility();
    const isMemoryAidsEnabled = config.cognitive.memoryAids;
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [notes, setNotes] = useState('');

    const handleItemToggle = useCallback((index: number) => {
      setCheckedItems(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    }, []);

    const checklistItems = [
      'Check passport validity',
      'Book accommodation',
      'Purchase travel insurance',
      'Pack essential items',
      'Confirm flight details'
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Memory Aids Demo</h3>
        
        <div className="space-y-4">
          <MemoryAidsReminder
            mode={isMemoryAidsEnabled ? 'enhanced' : 'standard'}
            type={isMemoryAidsEnabled ? 'mixed' : 'visual'}
            title="Important Reminder"
            content="Your flight departs in 2 hours. Please arrive at the airport 1 hour early."
            priority="high"
          />
          
          <MemoryAidsChecklist
            mode={isMemoryAidsEnabled ? 'enhanced' : 'standard'}
            type={isMemoryAidsEnabled ? 'mixed' : 'visual'}
            title="Pre-Trip Checklist"
            items={checklistItems}
            checkedItems={checkedItems}
            onItemToggle={handleItemToggle}
          />
          
          <MemoryAidsNotes
            mode={isMemoryAidsEnabled ? 'enhanced' : 'standard'}
            type={isMemoryAidsEnabled ? 'mixed' : 'text'}
            title="Travel Notes"
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isMemoryAidsEnabled 
                ? 'Enhanced memory aids are enabled. Use reminders, checklists, and notes to stay organized.'
                : 'Standard memory aids are used. Enable enhanced memory aids for better organization.'
              }
            </p>
          </div>
        )}
      </div>
    );
  }
);

MemoryAidsDemo.displayName = 'MemoryAidsDemo';

// Export all components
export {
  memoryAidsVariants,
  type MemoryAidsToggleProps,
  type MemoryAidsProviderProps,
  type MemoryAidsReminderProps,
  type MemoryAidsChecklistProps,
  type MemoryAidsNotesProps,
  type MemoryAidsStatusProps,
  type MemoryAidsDemoProps
};
