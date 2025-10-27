import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckIcon, 
  CircleIcon,
  AlertCircleIcon,
  ClockIcon,
  LockIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from 'lucide-react';

const formWizardVariants = cva(
  'w-full space-y-6',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-6 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-4',
        card: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-sm',
        elevated: 'p-6 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'space-y-4 p-4',
        default: 'space-y-6 p-6',
        lg: 'space-y-8 p-8',
      },
      orientation: {
        horizontal: 'flex flex-col',
        vertical: 'flex flex-row',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const formWizardStepsVariants = cva(
  'flex items-center justify-between',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border border-atlas-border rounded-lg p-4 bg-atlas-card-bg',
        ghost: 'bg-atlas-border-subtle rounded-lg p-4',
        minimal: '',
        card: 'border border-atlas-border rounded-lg p-4 bg-atlas-card-bg shadow-sm',
        elevated: 'border border-atlas-border rounded-lg p-4 bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col space-y-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      orientation: 'horizontal',
    },
  }
);

const formWizardStepVariants = cva(
  'flex items-center gap-3 transition-all duration-200',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-3 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-3 bg-atlas-border-subtle rounded-lg',
        minimal: 'p-2',
        card: 'p-3 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-sm',
        elevated: 'p-3 border border-atlas-border rounded-lg bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'p-2 gap-2',
        default: 'p-3 gap-3',
        lg: 'p-4 gap-4',
      },
      state: {
        default: 'text-atlas-text-tertiary',
        active: 'text-atlas-primary-main bg-atlas-primary-lighter',
        completed: 'text-atlas-success-main bg-atlas-success-bg',
        error: 'text-atlas-error-main bg-atlas-error-bg',
        disabled: 'text-atlas-text-tertiary opacity-50 cursor-not-allowed',
        upcoming: 'text-atlas-text-secondary',
      },
      clickable: {
        true: 'cursor-pointer hover:bg-atlas-border-subtle',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
      clickable: false,
    },
  }
);

const formWizardStepIconVariants = cva(
  'flex-shrink-0 rounded-full flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'h-6 w-6 text-xs',
        default: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
      state: {
        default: 'bg-atlas-border-subtle text-atlas-text-tertiary',
        active: 'bg-atlas-primary-main text-white',
        completed: 'bg-atlas-success-main text-white',
        error: 'bg-atlas-error-main text-white',
        disabled: 'bg-atlas-border-subtle text-atlas-text-tertiary',
        upcoming: 'bg-atlas-border-subtle text-atlas-text-secondary',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

const formWizardStepContentVariants = cva(
  'flex-1 min-w-0',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formWizardStepTitleVariants = cva(
  'font-medium',
  {
    variants: {
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
      state: {
        default: 'text-atlas-text-tertiary',
        active: 'text-atlas-primary-main',
        completed: 'text-atlas-success-main',
        error: 'text-atlas-error-main',
        disabled: 'text-atlas-text-tertiary',
        upcoming: 'text-atlas-text-secondary',
      },
    },
    defaultVariants: {
      size: 'default',
      state: 'default',
    },
  }
);

const formWizardStepDescriptionVariants = cva(
  'text-xs opacity-75',
  {
    variants: {
      state: {
        default: 'text-atlas-text-tertiary',
        active: 'text-atlas-primary-main',
        completed: 'text-atlas-success-main',
        error: 'text-atlas-error-main',
        disabled: 'text-atlas-text-tertiary',
        upcoming: 'text-atlas-text-secondary',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

const formWizardNavigationVariants = cva(
  'flex items-center justify-between pt-6 border-t border-atlas-border',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border-atlas-border',
        ghost: 'border-atlas-border-subtle',
        minimal: 'border-transparent',
      },
      size: {
        sm: 'pt-4',
        default: 'pt-6',
        lg: 'pt-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formWizardButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        outline: 'border border-atlas-border bg-transparent hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        success: 'bg-atlas-success-main text-white hover:bg-atlas-success-dark',
        warning: 'bg-atlas-warning-main text-white hover:bg-atlas-warning-dark',
        error: 'bg-atlas-error-main text-white hover:bg-atlas-error-dark',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormWizardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formWizardVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  currentStep: number;
  totalSteps: number;
  steps: FormWizardStep[];
  onStepChange?: (step: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  allowStepNavigation?: boolean;
  showProgress?: boolean;
  showStepNumbers?: boolean;
  children: React.ReactNode;
}

export interface FormWizardStep {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  state?: 'default' | 'active' | 'completed' | 'error' | 'disabled' | 'upcoming';
  content: React.ReactNode;
  validation?: () => boolean | Promise<boolean>;
  required?: boolean;
}

export interface FormWizardStepsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formWizardStepsVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  steps: FormWizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowStepNavigation?: boolean;
  showStepNumbers?: boolean;
}

export interface FormWizardStepProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formWizardStepVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'active' | 'completed' | 'error' | 'disabled' | 'upcoming';
  clickable?: boolean;
  step: FormWizardStep;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

export interface FormWizardNavigationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formWizardNavigationVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  currentStep: number;
  totalSteps: number;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  nextLabel?: string;
  previousLabel?: string;
  completeLabel?: string;
  showPrevious?: boolean;
  showNext?: boolean;
  showComplete?: boolean;
  nextDisabled?: boolean;
  previousDisabled?: boolean;
  loading?: boolean;
}

const FormWizardStep = React.forwardRef<
  HTMLDivElement,
  FormWizardStepProps
>(({ 
  className, 
  variant, 
  size, 
  state, 
  clickable, 
  step, 
  stepNumber, 
  isActive, 
  isCompleted, 
  onClick, 
  ...props 
}, ref) => {
  const getStepState = () => {
    if (step.state) return step.state;
    if (isCompleted) return 'completed';
    if (isActive) return 'active';
    return 'default';
  };

  const getStepIcon = () => {
    if (step.icon) return step.icon;
    
    const stepState = getStepState();
    switch (stepState) {
      case 'completed':
        return <CheckIcon className="h-4 w-4" />;
      case 'error':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'active':
        return <CircleIcon className="h-4 w-4" />;
      default:
        return <span>{stepNumber}</span>;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formWizardStepVariants({ variant, size, state: getStepState(), clickable, className }))}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-current={isActive ? 'step' : undefined}
      {...props}
    >
      <div className={cn(formWizardStepIconVariants({ size, state: getStepState() }))}>
        {getStepIcon()}
      </div>
      
      <div className={cn(formWizardStepContentVariants({ size }))}>
        <div className={cn(formWizardStepTitleVariants({ size, state: getStepState() }))}>
          {step.title}
        </div>
        {step.description && (
          <div className={cn(formWizardStepDescriptionVariants({ state: getStepState() }))}>
            {step.description}
          </div>
        )}
      </div>
    </div>
  );
});
FormWizardStep.displayName = 'FormWizardStep';

const FormWizardSteps = React.forwardRef<
  HTMLDivElement,
  FormWizardStepsProps
>(({ 
  className, 
  variant, 
  size, 
  orientation, 
  steps, 
  currentStep, 
  onStepClick, 
  allowStepNavigation = false, 
  showStepNumbers = true, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(formWizardStepsVariants({ variant, size, orientation, className }))}
      {...props}
    >
      {steps.map((step, index) => (
        <FormWizardStep
          key={step.id}
          variant={variant}
          size={size}
          step={step}
          stepNumber={index + 1}
          isActive={index === currentStep}
          isCompleted={index < currentStep}
          clickable={allowStepNavigation && index <= currentStep}
          onClick={() => onStepClick?.(index)}
        />
      ))}
    </div>
  );
});
FormWizardSteps.displayName = 'FormWizardSteps';

const FormWizardNavigation = React.forwardRef<
  HTMLDivElement,
  FormWizardNavigationProps
>(({ 
  className, 
  variant, 
  size, 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrevious, 
  onComplete, 
  nextLabel = 'Next', 
  previousLabel = 'Previous', 
  completeLabel = 'Complete', 
  showPrevious = true, 
  showNext = true, 
  showComplete = false, 
  nextDisabled = false, 
  previousDisabled = false, 
  loading = false, 
  ...props 
}, ref) => {
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div
      ref={ref}
      className={cn(formWizardNavigationVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-2">
        {showPrevious && !isFirstStep && (
          <button
            type="button"
            onClick={onPrevious}
            disabled={previousDisabled || loading}
            className={cn(formWizardButtonVariants({ variant: 'outline', size }))}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {previousLabel}
          </button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {showNext && !isLastStep && (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || loading}
            className={cn(formWizardButtonVariants({ variant: 'default', size }))}
          >
            {nextLabel}
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        )}
        
        {showComplete && isLastStep && (
          <button
            type="button"
            onClick={onComplete}
            disabled={loading}
            className={cn(formWizardButtonVariants({ variant: 'success', size }))}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                {completeLabel}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
});
FormWizardNavigation.displayName = 'FormWizardNavigation';

const FormWizard = React.forwardRef<
  HTMLDivElement,
  FormWizardProps
>(({
  className,
  variant,
  size,
  orientation,
  currentStep,
  totalSteps,
  steps,
  onStepChange,
  onNext,
  onPrevious,
  onComplete,
  allowStepNavigation = false,
  showProgress = true,
  showStepNumbers = true,
  children,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNext = React.useCallback(async () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      const currentStepData = steps[currentStep];
      
      if (currentStepData?.validation) {
        setIsLoading(true);
        try {
          const isValid = await currentStepData.validation();
          if (isValid) {
            onStepChange?.(nextStep);
            onNext?.();
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        onStepChange?.(nextStep);
        onNext?.();
      }
    }
  }, [currentStep, totalSteps, steps, onStepChange, onNext]);

  const handlePrevious = React.useCallback(() => {
    if (currentStep > 0) {
      const previousStep = currentStep - 1;
      onStepChange?.(previousStep);
      onPrevious?.();
    }
  }, [currentStep, onStepChange, onPrevious]);

  const handleStepClick = React.useCallback((step: number) => {
    if (allowStepNavigation && step <= currentStep) {
      onStepChange?.(step);
    }
  }, [allowStepNavigation, currentStep, onStepChange]);

  const currentStepData = steps[currentStep];

  return (
    <div
      ref={ref}
      className={cn(formWizardVariants({ variant, size, orientation, className }))}
      {...props}
    >
      {showProgress && (
        <FormWizardSteps
          variant={variant}
          size={size}
          orientation={orientation}
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          allowStepNavigation={allowStepNavigation}
          showStepNumbers={showStepNumbers}
        />
      )}
      
      <div className="space-y-4">
        {currentStepData?.content}
        {children}
      </div>
      
      <FormWizardNavigation
        variant={variant}
        size={size}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onComplete={onComplete}
        nextDisabled={isLoading}
        previousDisabled={isLoading}
        loading={isLoading}
        showComplete={currentStep === totalSteps - 1}
      />
    </div>
  );
});
FormWizard.displayName = 'FormWizard';

// Additional utility components for advanced form wizard functionality
const FormWizardContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
    size?: 'sm' | 'default' | 'lg';
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  }
>(({ className, variant = 'default', size = 'default', maxWidth = 'full', children, ...props }, ref) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        variant === 'outlined' && 'p-4 bg-atlas-card-bg rounded-lg border border-atlas-border',
        variant === 'ghost' && 'p-4 bg-atlas-border-subtle rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
FormWizardContainer.displayName = 'FormWizardContainer';

const FormWizardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    stepCount?: number;
  }
>(({ className, size = 'default', stepCount = 3, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full space-y-6', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        {Array.from({ length: stepCount }).map((_, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-8 w-8 bg-atlas-border-subtle rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        <div className="h-4 w-full bg-atlas-border-subtle rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-atlas-border-subtle rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-atlas-border-subtle rounded animate-pulse" />
      </div>
      <div className="flex justify-between pt-6 border-t border-atlas-border">
        <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
        <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
      </div>
    </div>
  );
});
FormWizardSkeleton.displayName = 'FormWizardSkeleton';

export {
  FormWizard,
  FormWizardSteps,
  FormWizardStep,
  FormWizardNavigation,
  FormWizardContainer,
  FormWizardSkeleton,
  formWizardVariants,
  formWizardStepsVariants,
  formWizardStepVariants,
  formWizardStepIconVariants,
  formWizardStepContentVariants,
  formWizardStepTitleVariants,
  formWizardStepDescriptionVariants,
  formWizardNavigationVariants,
  formWizardButtonVariants,
};
