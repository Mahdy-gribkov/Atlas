import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  EyeIcon, 
  EyeOffIcon, 
  RefreshIcon, 
  SmartphoneIcon, 
  TabletIcon, 
  MonitorIcon,
  MaximizeIcon,
  MinimizeIcon,
  SettingsIcon,
  CodeIcon,
  PaletteIcon,
  LayoutIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
  PlayIcon,
  PauseIcon,
  SquareIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  LoaderIcon,
  DownloadIcon,
  ShareIcon,
  CopyIcon,
  ExternalLinkIcon
} from 'lucide-react';

const formPreviewVariants = cva(
  'w-full h-full flex flex-col bg-atlas-card-bg',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border border-atlas-border rounded-lg',
        ghost: 'bg-atlas-border-subtle rounded-lg',
        minimal: '',
        card: 'border border-atlas-border rounded-lg shadow-sm',
        elevated: 'border border-atlas-border rounded-lg shadow-md',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      mode: {
        desktop: '',
        tablet: 'max-w-2xl mx-auto',
        mobile: 'max-w-sm mx-auto',
        fullscreen: 'fixed inset-0 z-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      mode: 'desktop',
    },
  }
);

const formPreviewToolbarVariants = cva(
  'flex items-center justify-between p-4 border-b border-atlas-border bg-atlas-border-subtle',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle',
        outlined: 'bg-atlas-card-bg',
        ghost: 'bg-transparent',
        minimal: 'bg-atlas-border-subtle',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formPreviewControlsVariants = cva(
  'flex items-center gap-2',
  {
    variants: {
      size: {
        sm: 'gap-1',
        default: 'gap-2',
        lg: 'gap-3',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formPreviewControlVariants = cva(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        primary: 'bg-atlas-primary-main text-white hover:bg-atlas-primary-light',
        secondary: 'bg-atlas-secondary-main text-white hover:bg-atlas-secondary-light',
        outline: 'border border-atlas-border bg-transparent hover:bg-atlas-border-subtle',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        destructive: 'hover:bg-atlas-error-main hover:text-white',
      },
      size: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
      },
      active: {
        true: 'bg-atlas-primary-main text-white',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      active: false,
    },
  }
);

const formPreviewCanvasVariants = cva(
  'flex-1 overflow-auto bg-white',
  {
    variants: {
      variant: {
        default: 'bg-white',
        outlined: 'bg-atlas-card-bg border border-atlas-border',
        ghost: 'bg-atlas-border-subtle',
        minimal: 'bg-transparent',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      mode: {
        desktop: '',
        tablet: 'max-w-2xl mx-auto',
        mobile: 'max-w-sm mx-auto',
        fullscreen: 'fixed inset-0 z-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      mode: 'desktop',
    },
  }
);

const formPreviewStatusVariants = cva(
  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-atlas-border-subtle text-atlas-text-primary',
        success: 'bg-atlas-success-bg text-atlas-success-main',
        warning: 'bg-atlas-warning-bg text-atlas-warning-main',
        error: 'bg-atlas-error-bg text-atlas-error-main',
        info: 'bg-atlas-info-bg text-atlas-info-main',
        loading: 'bg-atlas-border-subtle text-atlas-text-tertiary',
      },
      size: {
        sm: 'text-xs px-2 py-1',
        default: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormPreviewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formPreviewVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  mode?: 'desktop' | 'tablet' | 'mobile' | 'fullscreen';
  formData: FormPreviewData;
  onFormDataChange?: (data: FormPreviewData) => void;
  onValidationChange?: (validation: FormValidationState) => void;
  onSubmissionChange?: (submission: FormSubmissionState) => void;
  showToolbar?: boolean;
  showStatus?: boolean;
  showControls?: boolean;
  autoValidate?: boolean;
  realTimePreview?: boolean;
  children?: React.ReactNode;
}

export interface FormPreviewData {
  fields: FormPreviewField[];
  title?: string;
  description?: string;
  theme?: FormPreviewTheme;
  layout?: FormPreviewLayout;
  settings?: FormPreviewSettings;
}

export interface FormPreviewField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime' | 'file' | 'range' | 'color';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  value?: any;
  validation?: FormFieldValidation;
  options?: Array<{ label: string; value: string }>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: React.CSSProperties;
}

export interface FormFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: string;
  required?: boolean;
}

export interface FormPreviewTheme {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
  fontFamily?: string;
  fontSize?: string;
}

export interface FormPreviewLayout {
  columns?: number;
  spacing?: string;
  alignment?: 'left' | 'center' | 'right';
  direction?: 'vertical' | 'horizontal';
}

export interface FormPreviewSettings {
  showLabels?: boolean;
  showDescriptions?: boolean;
  showRequiredIndicators?: boolean;
  showValidationMessages?: boolean;
  autoFocus?: boolean;
  submitButtonText?: string;
  resetButtonText?: string;
}

export interface FormValidationState {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  touched: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code?: string;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isSuccess: boolean;
  isError: boolean;
  message?: string;
  data?: any;
}

export interface FormPreviewToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formPreviewToolbarVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  mode?: 'desktop' | 'tablet' | 'mobile' | 'fullscreen';
  onModeChange?: (mode: 'desktop' | 'tablet' | 'mobile' | 'fullscreen') => void;
  onRefresh?: () => void;
  onSettings?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onFullscreen?: () => void;
  onExitFullscreen?: () => void;
  isFullscreen?: boolean;
  isLoading?: boolean;
}

export interface FormPreviewControlsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formPreviewControlsVariants> {
  size?: 'sm' | 'default' | 'lg';
  mode?: 'desktop' | 'tablet' | 'mobile' | 'fullscreen';
  onModeChange?: (mode: 'desktop' | 'tablet' | 'mobile' | 'fullscreen') => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onReset?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
  zoom?: number;
}

export interface FormPreviewCanvasProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formPreviewCanvasVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  mode?: 'desktop' | 'tablet' | 'mobile' | 'fullscreen';
  formData: FormPreviewData;
  validation?: FormValidationState;
  submission?: FormSubmissionState;
  onFieldChange?: (fieldId: string, value: any) => void;
  onFieldFocus?: (fieldId: string) => void;
  onFieldBlur?: (fieldId: string) => void;
  zoom?: number;
  isLoading?: boolean;
}

export interface FormPreviewStatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formPreviewStatusVariants> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'loading';
  size?: 'sm' | 'default' | 'lg';
  validation?: FormValidationState;
  submission?: FormSubmissionState;
  isLoading?: boolean;
}

const FormPreviewStatus = React.forwardRef<
  HTMLDivElement,
  FormPreviewStatusProps
>(({ 
  className, 
  variant, 
  size, 
  validation, 
  submission, 
  isLoading, 
  ...props 
}, ref) => {
  const getStatusVariant = () => {
    if (isLoading) return 'loading';
    if (submission?.isError) return 'error';
    if (submission?.isSuccess) return 'success';
    if (submission?.isSubmitting) return 'loading';
    if (validation?.errors.length > 0) return 'error';
    if (validation?.warnings.length > 0) return 'warning';
    if (validation?.isValid) return 'success';
    return variant || 'default';
  };

  const getStatusMessage = () => {
    if (isLoading) return 'Loading preview...';
    if (submission?.isSubmitting) return 'Submitting form...';
    if (submission?.isSuccess) return 'Form submitted successfully!';
    if (submission?.isError) return 'Submission failed. Please try again.';
    if (validation?.errors.length > 0) return `${validation.errors.length} validation error${validation.errors.length !== 1 ? 's' : ''}`;
    if (validation?.warnings.length > 0) return `${validation.warnings.length} warning${validation.warnings.length !== 1 ? 's' : ''}`;
    if (validation?.isValid) return 'Form is valid';
    return 'Ready';
  };

  const getStatusIcon = () => {
    const currentVariant = getStatusVariant();
    switch (currentVariant) {
      case 'success':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'error':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'warning':
        return <AlertCircleIcon className="h-4 w-4" />;
      case 'loading':
        return <LoaderIcon className="h-4 w-4 animate-spin" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formPreviewStatusVariants({ variant: getStatusVariant(), size, className }))}
      {...props}
    >
      {getStatusIcon()}
      <span>{getStatusMessage()}</span>
    </div>
  );
});
FormPreviewStatus.displayName = 'FormPreviewStatus';

const FormPreviewControls = React.forwardRef<
  HTMLDivElement,
  FormPreviewControlsProps
>(({ 
  className, 
  size, 
  mode, 
  onModeChange, 
  onZoomIn, 
  onZoomOut, 
  onReset, 
  onPlay, 
  onPause, 
  isPlaying = false, 
  zoom = 1, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(formPreviewControlsVariants({ size, className }))}
      {...props}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onModeChange?.('desktop')}
          className={cn(formPreviewControlVariants({ variant: 'default', size, active: mode === 'desktop' }))}
          aria-label="Desktop view"
        >
          <MonitorIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => onModeChange?.('tablet')}
          className={cn(formPreviewControlVariants({ variant: 'default', size, active: mode === 'tablet' }))}
          aria-label="Tablet view"
        >
          <TabletIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => onModeChange?.('mobile')}
          className={cn(formPreviewControlVariants({ variant: 'default', size, active: mode === 'mobile' }))}
          aria-label="Mobile view"
        >
          <SmartphoneIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onZoomOut}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Zoom out"
        >
          <ZoomOutIcon className="h-4 w-4" />
        </button>
        
        <span className="text-sm text-atlas-text-primary px-2">
          {Math.round(zoom * 100)}%
        </span>
        
        <button
          type="button"
          onClick={onZoomIn}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Zoom in"
        >
          <ZoomInIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
        >
          {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
        </button>
        
        <button
          type="button"
          onClick={onReset}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Reset preview"
        >
          <RotateCcwIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
FormPreviewControls.displayName = 'FormPreviewControls';

const FormPreviewToolbar = React.forwardRef<
  HTMLDivElement,
  FormPreviewToolbarProps
>(({ 
  className, 
  variant, 
  size, 
  mode, 
  onModeChange, 
  onRefresh, 
  onSettings, 
  onExport, 
  onShare, 
  onFullscreen, 
  onExitFullscreen, 
  isFullscreen = false, 
  isLoading = false, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(formPreviewToolbarVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          Form Preview
        </h3>
        {isLoading && (
          <LoaderIcon className="h-4 w-4 animate-spin text-atlas-text-tertiary" />
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <FormPreviewControls
          size={size}
          mode={mode}
          onModeChange={onModeChange}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onReset={() => {}}
          onPlay={() => {}}
          onPause={() => {}}
        />
        
        <div className="w-px h-6 bg-atlas-border" />
        
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Refresh preview"
        >
          <RefreshIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={onSettings}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Preview settings"
        >
          <SettingsIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={onExport}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Export preview"
        >
          <DownloadIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={onShare}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label="Share preview"
        >
          <ShareIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={isFullscreen ? onExitFullscreen : onFullscreen}
          className={cn(formPreviewControlVariants({ variant: 'default', size }))}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <MinimizeIcon className="h-4 w-4" /> : <MaximizeIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
});
FormPreviewToolbar.displayName = 'FormPreviewToolbar';

const FormPreviewCanvas = React.forwardRef<
  HTMLDivElement,
  FormPreviewCanvasProps
>(({ 
  className, 
  variant, 
  size, 
  mode, 
  formData, 
  validation, 
  submission, 
  onFieldChange, 
  onFieldFocus, 
  onFieldBlur, 
  zoom = 1, 
  isLoading = false, 
  ...props 
}, ref) => {
  const renderField = (field: FormPreviewField) => {
    const fieldError = validation?.errors.find(error => error.field === field.id);
    const fieldWarning = validation?.warnings.find(warning => warning.field === field.id);
    const isTouched = validation?.touched.includes(field.id);

    const fieldClasses = cn(
      'space-y-2',
      fieldError && 'border-atlas-error-main',
      fieldWarning && 'border-atlas-warning-main',
      isTouched && 'border-atlas-primary-main'
    );

    const inputClasses = cn(
      'w-full p-3 border rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2',
      fieldError ? 'border-atlas-error-main bg-atlas-error-bg' : 'border-atlas-border bg-white',
      field.disabled && 'opacity-50 cursor-not-allowed bg-atlas-border-subtle'
    );

    const labelClasses = cn(
      'block text-sm font-medium',
      field.required && 'after:content-["*"] after:text-atlas-error-main after:ml-1',
      fieldError ? 'text-atlas-error-main' : 'text-atlas-text-primary'
    );

    const renderFieldInput = () => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
        case 'url':
          return (
            <input
              type={field.type}
              value={field.value || ''}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={inputClasses}
              onChange={(e) => onFieldChange?.(field.id, e.target.value)}
              onFocus={() => onFieldFocus?.(field.id)}
              onBlur={() => onFieldBlur?.(field.id)}
              aria-describedby={field.description ? `${field.id}-description` : undefined}
              aria-invalid={fieldError ? 'true' : 'false'}
            />
          );
        case 'textarea':
          return (
            <textarea
              value={field.value || ''}
              placeholder={field.placeholder}
              disabled={field.disabled}
              className={cn(inputClasses, 'min-h-[100px] resize-y')}
              onChange={(e) => onFieldChange?.(field.id, e.target.value)}
              onFocus={() => onFieldFocus?.(field.id)}
              onBlur={() => onFieldBlur?.(field.id)}
              aria-describedby={field.description ? `${field.id}-description` : undefined}
              aria-invalid={fieldError ? 'true' : 'false'}
            />
          );
        case 'select':
          return (
            <select
              value={field.value || ''}
              disabled={field.disabled}
              className={inputClasses}
              onChange={(e) => onFieldChange?.(field.id, e.target.value)}
              onFocus={() => onFieldFocus?.(field.id)}
              onBlur={() => onFieldBlur?.(field.id)}
              aria-describedby={field.description ? `${field.id}-description` : undefined}
              aria-invalid={fieldError ? 'true' : 'false'}
            >
              <option value="">{field.placeholder || 'Select an option...'}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case 'checkbox':
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.value || false}
                disabled={field.disabled}
                className="rounded border-atlas-border text-atlas-primary-main focus:ring-atlas-primary-main"
                onChange={(e) => onFieldChange?.(field.id, e.target.checked)}
                onFocus={() => onFieldFocus?.(field.id)}
                onBlur={() => onFieldBlur?.(field.id)}
                aria-describedby={field.description ? `${field.id}-description` : undefined}
                aria-invalid={fieldError ? 'true' : 'false'}
              />
              <label htmlFor={field.id} className={labelClasses}>
                {field.label}
              </label>
            </div>
          );
        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map(option => (
                <div key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={field.id}
                    value={option.value}
                    checked={field.value === option.value}
                    disabled={field.disabled}
                    className="border-atlas-border text-atlas-primary-main focus:ring-atlas-primary-main"
                    onChange={(e) => onFieldChange?.(field.id, e.target.value)}
                    onFocus={() => onFieldFocus?.(field.id)}
                    onBlur={() => onFieldBlur?.(field.id)}
                    aria-describedby={field.description ? `${field.id}-description` : undefined}
                    aria-invalid={fieldError ? 'true' : 'false'}
                  />
                  <label htmlFor={`${field.id}-${option.value}`} className="text-sm text-atlas-text-primary">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );
        case 'date':
        case 'time':
        case 'datetime-local':
          return (
            <input
              type={field.type}
              value={field.value || ''}
              disabled={field.disabled}
              className={inputClasses}
              onChange={(e) => onFieldChange?.(field.id, e.target.value)}
              onFocus={() => onFieldFocus?.(field.id)}
              onBlur={() => onFieldBlur?.(field.id)}
              aria-describedby={field.description ? `${field.id}-description` : undefined}
              aria-invalid={fieldError ? 'true' : 'false'}
            />
          );
        case 'file':
          return (
            <input
              type="file"
              disabled={field.disabled}
              className={inputClasses}
              onChange={(e) => onFieldChange?.(field.id, e.target.files)}
              onFocus={() => onFieldFocus?.(field.id)}
              onBlur={() => onFieldBlur?.(field.id)}
              aria-describedby={field.description ? `${field.id}-description` : undefined}
              aria-invalid={fieldError ? 'true' : 'false'}
            />
          );
        case 'range':
          return (
            <div className="space-y-2">
              <input
                type="range"
                min={field.validation?.min}
                max={field.validation?.max}
                value={field.value || field.validation?.min || 0}
                disabled={field.disabled}
                className="w-full"
                onChange={(e) => onFieldChange?.(field.id, e.target.value)}
                onFocus={() => onFieldFocus?.(field.id)}
                onBlur={() => onFieldBlur?.(field.id)}
                aria-describedby={field.description ? `${field.id}-description` : undefined}
                aria-invalid={fieldError ? 'true' : 'false'}
              />
              <div className="text-sm text-atlas-text-secondary text-center">
                {field.value || field.validation?.min || 0}
              </div>
            </div>
          );
        case 'color':
          return (
            <input
              type="color"
              value={field.value || '#000000'}
              disabled={field.disabled}
              className="w-full h-12 border border-atlas-border rounded-md"
              onChange={(e) => onFieldChange?.(field.id, e.target.value)}
              onFocus={() => onFieldFocus?.(field.id)}
              onBlur={() => onFieldBlur?.(field.id)}
              aria-describedby={field.description ? `${field.id}-description` : undefined}
              aria-invalid={fieldError ? 'true' : 'false'}
            />
          );
        default:
          return (
            <div className={inputClasses}>
              {field.type} field
            </div>
          );
      }
    };

    return (
      <div key={field.id} className={fieldClasses}>
        {field.type !== 'checkbox' && (
          <label htmlFor={field.id} className={labelClasses}>
            {field.label}
          </label>
        )}
        
        {renderFieldInput()}
        
        {field.description && (
          <p id={`${field.id}-description`} className="text-xs text-atlas-text-secondary">
            {field.description}
          </p>
        )}
        
        {fieldError && (
          <p className="text-xs text-atlas-error-main" role="alert">
            {fieldError.message}
          </p>
        )}
        
        {fieldWarning && !fieldError && (
          <p className="text-xs text-atlas-warning-main">
            {fieldWarning.message}
          </p>
        )}
      </div>
    );
  };

  const canvasStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: 'top left',
    width: `${100 / zoom}%`,
    height: `${100 / zoom}%`,
  };

  return (
    <div
      ref={ref}
      className={cn(formPreviewCanvasVariants({ variant, size, mode, className }))}
      style={mode === 'fullscreen' ? undefined : canvasStyle}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <LoaderIcon className="h-8 w-8 animate-spin text-atlas-text-tertiary mx-auto mb-4" />
            <p className="text-sm text-atlas-text-tertiary">Loading preview...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto p-6">
          {formData.title && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-atlas-text-primary mb-2">
                {formData.title}
              </h1>
              {formData.description && (
                <p className="text-atlas-text-secondary">
                  {formData.description}
                </p>
              )}
            </div>
          )}
          
          <form className="space-y-6">
            {formData.fields.map(renderField)}
            
            <div className="flex items-center gap-4 pt-6">
              <button
                type="submit"
                disabled={submission?.isSubmitting}
                className="inline-flex items-center justify-center px-6 py-3 bg-atlas-primary-main text-white rounded-md hover:bg-atlas-primary-light focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submission?.isSubmitting ? (
                  <>
                    <LoaderIcon className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  formData.settings?.submitButtonText || 'Submit'
                )}
              </button>
              
              <button
                type="button"
                className="inline-flex items-center justify-center px-6 py-3 border border-atlas-border text-atlas-text-primary rounded-md hover:bg-atlas-border-subtle focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2"
              >
                {formData.settings?.resetButtonText || 'Reset'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
});
FormPreviewCanvas.displayName = 'FormPreviewCanvas';

const FormPreview = React.forwardRef<
  HTMLDivElement,
  FormPreviewProps
>(({
  className,
  variant,
  size,
  mode = 'desktop',
  formData,
  onFormDataChange,
  onValidationChange,
  onSubmissionChange,
  showToolbar = true,
  showStatus = true,
  showControls = true,
  autoValidate = true,
  realTimePreview = true,
  children,
  ...props
}, ref) => {
  const [currentMode, setCurrentMode] = React.useState(mode);
  const [isLoading, setIsLoading] = React.useState(false);
  const [zoom, setZoom] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [validation, setValidation] = React.useState<FormValidationState>({
    isValid: true,
    errors: [],
    warnings: [],
    touched: [],
  });
  const [submission, setSubmission] = React.useState<FormSubmissionState>({
    isSubmitting: false,
    isSubmitted: false,
    isSuccess: false,
    isError: false,
  });

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleModeChange = React.useCallback((newMode: 'desktop' | 'tablet' | 'mobile' | 'fullscreen') => {
    setCurrentMode(newMode);
  }, []);

  const handleZoomIn = React.useCallback(() => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = React.useCallback(() => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  }, []);

  const handleReset = React.useCallback(() => {
    setZoom(1);
    setIsPlaying(false);
  }, []);

  const handlePlay = React.useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = React.useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleFieldChange = React.useCallback((fieldId: string, value: any) => {
    const updatedFormData = {
      ...formData,
      fields: formData.fields.map(field =>
        field.id === fieldId ? { ...field, value } : field
      ),
    };
    onFormDataChange?.(updatedFormData);
  }, [formData, onFormDataChange]);

  const handleFieldFocus = React.useCallback((fieldId: string) => {
    if (autoValidate) {
      setValidation(prev => ({
        ...prev,
        touched: [...prev.touched.filter(id => id !== fieldId), fieldId],
      }));
    }
  }, [autoValidate]);

  const handleFieldBlur = React.useCallback((fieldId: string) => {
    if (autoValidate) {
      // Perform validation logic here
      // This is a simplified example
      const field = formData.fields.find(f => f.id === fieldId);
      if (field?.required && !field.value) {
        setValidation(prev => ({
          ...prev,
          errors: [...prev.errors.filter(error => error.field !== fieldId), {
            field: fieldId,
            message: `${field.label} is required`,
          }],
        }));
      }
    }
  }, [autoValidate, formData.fields]);

  return (
    <div
      ref={ref}
      className={cn(formPreviewVariants({ variant, size, mode: currentMode, className }))}
      {...props}
    >
      {showToolbar && (
        <FormPreviewToolbar
          variant={variant}
          size={size}
          mode={currentMode}
          onModeChange={handleModeChange}
          onRefresh={() => setIsLoading(true)}
          onSettings={() => {}}
          onExport={() => {}}
          onShare={() => {}}
          onFullscreen={() => handleModeChange('fullscreen')}
          onExitFullscreen={() => handleModeChange('desktop')}
          isFullscreen={currentMode === 'fullscreen'}
          isLoading={isLoading}
        />
      )}
      
      {showStatus && (
        <div className="p-4 border-b border-atlas-border">
          <FormPreviewStatus
            size={size}
            validation={validation}
            submission={submission}
            isLoading={isLoading}
          />
        </div>
      )}
      
      <FormPreviewCanvas
        variant={variant}
        size={size}
        mode={currentMode}
        formData={formData}
        validation={validation}
        submission={submission}
        onFieldChange={handleFieldChange}
        onFieldFocus={handleFieldFocus}
        onFieldBlur={handleFieldBlur}
        zoom={zoom}
        isLoading={isLoading}
      />
      
      {children}
    </div>
  );
});
FormPreview.displayName = 'FormPreview';

// Additional utility components for advanced form preview functionality
const FormPreviewContainer = React.forwardRef<
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
        'w-full h-full',
        maxWidthClasses[maxWidth],
        variant === 'outlined' && 'border border-atlas-border rounded-lg',
        variant === 'ghost' && 'bg-atlas-border-subtle rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
FormPreviewContainer.displayName = 'FormPreviewContainer';

const FormPreviewSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    fieldCount?: number;
  }
>(({ className, size = 'default', fieldCount = 3, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full h-full flex flex-col', className)}
      {...props}
    >
      <div className="flex items-center justify-between p-4 border-b border-atlas-border">
        <div className="h-4 w-32 bg-atlas-border-subtle rounded animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-atlas-border-subtle rounded animate-pulse" />
            <div className="h-4 w-96 bg-atlas-border-subtle rounded animate-pulse" />
          </div>
          
          {Array.from({ length: fieldCount }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
              <div className="h-10 w-full bg-atlas-border-subtle rounded animate-pulse" />
            </div>
          ))}
          
          <div className="flex items-center gap-4 pt-6">
            <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
            <div className="h-10 w-20 bg-atlas-border-subtle rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
});
FormPreviewSkeleton.displayName = 'FormPreviewSkeleton';

export {
  FormPreview,
  FormPreviewToolbar,
  FormPreviewControls,
  FormPreviewCanvas,
  FormPreviewStatus,
  FormPreviewContainer,
  FormPreviewSkeleton,
  formPreviewVariants,
  formPreviewToolbarVariants,
  formPreviewControlsVariants,
  formPreviewControlVariants,
  formPreviewCanvasVariants,
  formPreviewStatusVariants,
};
