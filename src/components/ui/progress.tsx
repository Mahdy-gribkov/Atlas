import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const progressVariants = cva(
  'relative h-4 w-full overflow-hidden rounded-full bg-atlas-border-subtle',
  {
    variants: {
      size: {
        sm: 'h-2',
        default: 'h-4',
        lg: 'h-6',
        xl: 'h-8',
      },
      variant: {
        default: 'bg-atlas-border-subtle',
        success: 'bg-atlas-success-bg',
        error: 'bg-atlas-error-bg',
        warning: 'bg-atlas-warning-bg',
        info: 'bg-atlas-info-bg',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> &
    VariantProps<typeof progressVariants>
>(({ className, size, variant, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size, variant, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 transition-all',
        variant === 'default' && 'bg-atlas-primary-main',
        variant === 'success' && 'bg-atlas-success-main',
        variant === 'error' && 'bg-atlas-error-main',
        variant === 'warning' && 'bg-atlas-warning-main',
        variant === 'info' && 'bg-atlas-info-main'
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// Enhanced Progress with label and percentage
export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
  animated?: boolean;
  striped?: boolean;
}

const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(({
  value,
  max = 100,
  label,
  showPercentage = true,
  showValue = false,
  size = 'default',
  variant = 'default',
  className,
  animated = false,
  striped = false,
}, ref) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage || showValue) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <span className="text-atlas-text-primary font-medium">
              {label}
            </span>
          )}
          <div className="flex items-center space-x-2">
            {showValue && (
              <span className="text-atlas-text-secondary">
                {value}/{max}
              </span>
            )}
            {showPercentage && (
              <span className="text-atlas-text-tertiary">
                {percentage}%
              </span>
            )}
          </div>
        </div>
      )}
      
      <Progress
        ref={ref}
        value={percentage}
        size={size}
        variant={variant}
        className={cn(
          animated && 'animate-pulse',
          striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px] animate-pulse'
        )}
        aria-label={label || `Progress: ${percentage}%`}
      />
    </div>
  );
});
ProgressBar.displayName = 'ProgressBar';

// Circular Progress
export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  ({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    label,
    showPercentage = true,
    variant = 'default',
    className,
  }, ref) => {
    const percentage = Math.round((value / max) * 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    const colorClasses = {
      default: 'text-atlas-primary-main',
      success: 'text-atlas-success-main',
      error: 'text-atlas-error-main',
      warning: 'text-atlas-warning-main',
      info: 'text-atlas-info-main',
    };

    return (
      <div ref={ref} className={cn('flex flex-col items-center space-y-2', className)}>
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
            aria-hidden="true"
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-atlas-border-subtle"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn('transition-all duration-300 ease-in-out', colorClasses[variant])}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {showPercentage && (
                <div className={cn('text-lg font-semibold', colorClasses[variant])}>
                  {percentage}%
                </div>
              )}
              {label && (
                <div className="text-xs text-atlas-text-tertiary">
                  {label}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);
CircularProgress.displayName = 'CircularProgress';

// Step Progress
export interface StepProgressProps {
  steps: string[];
  currentStep: number;
  completedSteps?: number[];
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  ({
    steps,
    currentStep,
    completedSteps = [],
    variant = 'default',
    className,
  }, ref) => {
    const getStepStatus = (index: number) => {
      if (completedSteps.includes(index)) return 'completed';
      if (index === currentStep) return 'current';
      if (index < currentStep) return 'completed';
      return 'upcoming';
    };

    const getStepColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-atlas-success-main text-white border-atlas-success-main';
        case 'current':
          return 'bg-atlas-primary-main text-white border-atlas-primary-main';
        case 'upcoming':
          return 'bg-atlas-card-bg text-atlas-text-tertiary border-atlas-border';
        default:
          return 'bg-atlas-card-bg text-atlas-text-tertiary border-atlas-border';
      }
    };

    const getLineColor = (status: string) => {
      switch (status) {
        case 'completed':
          return 'bg-atlas-success-main';
        case 'current':
          return 'bg-atlas-primary-main';
        case 'upcoming':
          return 'bg-atlas-border';
        default:
          return 'bg-atlas-border';
      }
    };

    return (
      <div ref={ref} className={cn('flex items-center', className)}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
                    getStepColor(status)
                  )}
                >
                  {status === 'completed' ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-2 text-xs text-atlas-text-secondary text-center max-w-20">
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'mx-4 h-0.5 w-16',
                    getLineColor(status)
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);
StepProgress.displayName = 'StepProgress';

export {
  Progress,
  ProgressBar,
  CircularProgress,
  StepProgress,
  progressVariants,
};
