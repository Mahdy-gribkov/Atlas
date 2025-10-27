import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { Eye, EyeOff, Search, X, Check, AlertCircle, Info, Copy, ExternalLink, Calendar, Clock, Phone, Mail, User, Lock, CreditCard, MapPin, Hash, DollarSign } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded-md border bg-atlas-card-bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-atlas-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border hover:border-atlas-border-subtle focus:border-atlas-primary-main',
        error: 'border-atlas-error-main focus-visible:ring-atlas-error-main hover:border-atlas-error-light',
        success: 'border-atlas-success-main focus-visible:ring-atlas-success-main hover:border-atlas-success-light',
        warning: 'border-atlas-warning-main focus-visible:ring-atlas-warning-main hover:border-atlas-warning-light',
        info: 'border-atlas-info-main focus-visible:ring-atlas-info-main hover:border-atlas-info-light',
        ghost: 'border-transparent bg-transparent hover:bg-atlas-border-subtle focus:bg-atlas-card-bg',
        filled: 'border-transparent bg-atlas-border-subtle hover:bg-atlas-border-subtle focus:bg-atlas-card-bg',
        outlined: 'border-2 border-atlas-border hover:border-atlas-border-subtle focus:border-atlas-primary-main',
        underlined: 'border-0 border-b-2 border-atlas-border rounded-none hover:border-atlas-border-subtle focus:border-atlas-primary-main',
        floating: 'border-atlas-border hover:border-atlas-border-subtle focus:border-atlas-primary-main',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-2 text-xs',
        default: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
        xl: 'h-14 px-5 text-lg',
      },
      inputType: {
        text: '',
        password: '',
        email: '',
        tel: '',
        url: '',
        search: '',
        number: '',
        date: '',
        time: '',
        datetime: '',
        month: '',
        week: '',
        color: '',
        file: '',
        range: '',
        hidden: '',
      },
      state: {
        default: '',
        loading: 'opacity-75 cursor-wait',
        disabled: 'opacity-50 cursor-not-allowed',
        readonly: 'bg-atlas-border-subtle cursor-default',
      },
      animation: {
        none: '',
        fade: 'transition-opacity duration-200',
        slide: 'transition-transform duration-200',
        scale: 'transition-transform duration-200',
        bounce: 'transition-transform duration-300 ease-bounce',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        default: 'rounded-md',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
      shadow: {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      inputType: 'text',
      state: 'default',
      animation: 'fade',
      rounded: 'default',
      shadow: 'none',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onCopy'>,
    VariantProps<typeof inputVariants> {
  // Basic props
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  warningMessage?: string;
  infoMessage?: string;
  
  // Icon props
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  iconPosition?: 'left' | 'right' | 'both';
  
  // Input type and validation
  inputType?: 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'number' | 'date' | 'time' | 'datetime' | 'month' | 'week' | 'color' | 'file' | 'range' | 'hidden';
  mask?: string;
  maskChar?: string;
  format?: (value: string) => string;
  parse?: (value: string) => string;
  
  // Validation
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
  };
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  
  // Character counter
  showCounter?: boolean;
  maxLength?: number;
  counterPosition?: 'bottom' | 'top' | 'right';
  
  // Floating label
  floatingLabel?: boolean;
  floatingLabelActive?: boolean;
  
  // Input groups
  groupPosition?: 'left' | 'right' | 'both';
  groupText?: string;
  groupIcon?: React.ReactNode;
  
  // Password specific
  showPasswordToggle?: boolean;
  passwordStrength?: 'weak' | 'medium' | 'strong';
  passwordRequirements?: string[];
  
  // Search specific
  showSearchButton?: boolean;
  onSearch?: (value: string) => void;
  searchSuggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  
  // File specific
  accept?: string;
  multiple?: boolean;
  onFileSelect?: (files: FileList | null) => void;
  dragAndDrop?: boolean;
  maxFileSize?: number;
  allowedFileTypes?: string[];
  
  // Copy functionality
  copyable?: boolean;
  copyText?: string;
  onCopy?: (text: string) => void;
  
  // External link
  external?: boolean;
  externalUrl?: string;
  onExternalClick?: () => void;
  
  // Loading states
  loading?: boolean;
  loadingText?: string;
  loadingIcon?: React.ReactNode;
  
  // Accessibility
  ariaLabel?: string;
  ariaDescription?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  ariaDescribedBy?: string;
  
  // Form integration
  form?: string;
  formAction?: string;
  formEncType?: string;
  formMethod?: string;
  formNoValidate?: boolean;
  formTarget?: string;
  
  // Advanced features
  autoComplete?: string;
  autoFocus?: boolean;
  autoCorrect?: 'on' | 'off';
  autoCapitalize?: 'on' | 'off' | 'words' | 'sentences' | 'characters';
  spellCheck?: boolean;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  
  // Event handlers
  onValueChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
  onFocusChange?: (isFocused: boolean) => void;
  onStateChange?: (state: 'default' | 'loading' | 'disabled' | 'readonly') => void;
  
  // Styling
  fullWidth?: boolean;
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
  
  // Advanced styling
  rounded?: 'none' | 'sm' | 'default' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce';
  
  // State management
  state?: 'default' | 'loading' | 'disabled' | 'readonly';
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  
  // Ref forwarding
  ref?: React.Ref<HTMLInputElement>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      size,
      inputType,
      state,
      animation,
      rounded,
      shadow,
      label,
      helperText,
      errorMessage,
      successMessage,
      warningMessage,
      infoMessage,
      leftIcon,
      rightIcon,
      onRightIconClick,
      iconPosition,
      mask,
      maskChar,
      format,
      parse,
      validation,
      validateOnChange,
      validateOnBlur,
      validateOnSubmit,
      showCounter,
      maxLength,
      counterPosition,
      floatingLabel,
      floatingLabelActive,
      groupPosition,
      groupText,
      groupIcon,
      showPasswordToggle,
      passwordStrength,
      passwordRequirements,
      showSearchButton,
      onSearch,
      searchSuggestions,
      onSuggestionSelect,
      accept,
      multiple,
      onFileSelect,
      dragAndDrop,
      maxFileSize,
      allowedFileTypes,
      copyable,
      copyText,
      onCopy,
      external,
      externalUrl,
      onExternalClick,
      loading,
      loadingText,
      loadingIcon,
      ariaLabel,
      ariaDescription,
      ariaInvalid,
      ariaRequired,
      ariaDescribedBy,
      form,
      formAction,
      formEncType,
      formMethod,
      formNoValidate,
      formTarget,
      autoComplete,
      autoFocus,
      autoSave,
      autoCorrect,
      autoCapitalize,
      spellCheck,
      inputMode,
      enterKeyHint,
      onValueChange,
      onValidationChange,
      onFocusChange,
      onStateChange,
      fullWidth,
      width,
      height,
      style,
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      onKeyUp,
      onKeyPress,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const warningId = `${inputId}-warning`;
    const infoId = `${inputId}-info`;
    const counterId = `${inputId}-counter`;
    
    // State management
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || '');
    const [isFocused, setIsFocused] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
    const [isValid, setIsValid] = React.useState(true);
    const [isCopied, setIsCopied] = React.useState(false);
    const [dragOver, setDragOver] = React.useState(false);
    const [suggestionsVisible, setSuggestionsVisible] = React.useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = React.useState(-1);
    
    const inputRef = React.useRef<HTMLInputElement>(null);
    const suggestionsRef = React.useRef<HTMLDivElement>(null);
    
    // Determine current value
    const currentValue = value !== undefined ? value : internalValue;
    
    // Determine actual variant based on messages and state
    const actualVariant = errorMessage || validationErrors.length > 0
      ? 'error'
      : successMessage
      ? 'success'
      : warningMessage
      ? 'warning'
      : infoMessage
      ? 'info'
      : variant;
    
    // Determine actual state
    const actualState = loading ? 'loading' : state;
    
    // Get current message
    const currentMessage = errorMessage || successMessage || warningMessage || infoMessage;
    
    // Validation function
    const validateInput = React.useCallback((value: string) => {
      if (!validation) return { isValid: true, errors: [] };
      
      const errors: string[] = [];
      
      if (validation.required && !value.trim()) {
        errors.push('This field is required');
      }
      
      if (validation.minLength && value.length < validation.minLength) {
        errors.push(`Minimum length is ${validation.minLength} characters`);
      }
      
      if (validation.maxLength && value.length > validation.maxLength) {
        errors.push(`Maximum length is ${validation.maxLength} characters`);
      }
      
      if (validation.min && Number(value) < validation.min) {
        errors.push(`Minimum value is ${validation.min}`);
      }
      
      if (validation.max && Number(value) > validation.max) {
        errors.push(`Maximum value is ${validation.max}`);
      }
      
      if (validation.pattern && !validation.pattern.test(value)) {
        errors.push('Invalid format');
      }
      
      if (validation.custom) {
        const customError = validation.custom(value);
        if (customError) {
          errors.push(customError);
        }
      }
      
      return { isValid: errors.length === 0, errors };
    }, [validation]);
    
    // Handle value change
    const handleValueChange = React.useCallback((newValue: string) => {
      let processedValue = newValue;
      
      // Apply mask
      if (mask) {
        // Simple mask implementation - can be enhanced
        const maskPattern = mask.replace(/9/g, '\\d');
        const regex = new RegExp(`^${maskPattern}$`);
        if (!regex.test(newValue)) {
          return;
        }
      }
      
      // Apply format
      if (format) {
        processedValue = format(processedValue);
      }
      
      // Update internal value
      if (value === undefined) {
        setInternalValue(processedValue);
      }
      
      // Validate if needed
      if (validateOnChange) {
        const validation = validateInput(processedValue);
        setValidationErrors(validation.errors);
        setIsValid(validation.isValid);
        onValidationChange?.(validation.isValid, validation.errors);
      }
      
      // Call callbacks
      onValueChange?.(processedValue);
    }, [mask, format, value, validateOnChange, validateInput, onValidationChange, onValueChange]);
    
    // Handle input change
    const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      handleValueChange(newValue);
      onChange?.(event);
    }, [handleValueChange, onChange]);
    
    // Handle focus
    const handleFocus = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocusChange?.(true);
      onFocus?.(event);
    }, [onFocusChange, onFocus]);
    
    // Handle blur
    const handleBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setSuggestionsVisible(false);
      onFocusChange?.(false);
      
      // Validate on blur if needed
      if (validateOnBlur) {
        const validation = validateInput(currentValue);
        setValidationErrors(validation.errors);
        setIsValid(validation.isValid);
        onValidationChange?.(validation.isValid, validation.errors);
      }
      
      onBlur?.(event);
    }, [onFocusChange, validateOnBlur, validateInput, currentValue, onValidationChange, onBlur]);
    
    // Handle password toggle
    const handlePasswordToggle = React.useCallback(() => {
      setIsPasswordVisible(!isPasswordVisible);
    }, [isPasswordVisible]);
    
    // Handle copy
    const handleCopy = React.useCallback(async () => {
      const textToCopy = copyText || currentValue;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setIsCopied(true);
        onCopy?.(textToCopy);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }, [copyText, currentValue, onCopy]);
    
    // Handle search
    const handleSearch = React.useCallback(() => {
      onSearch?.(currentValue);
    }, [onSearch, currentValue]);
    
    // Handle suggestion selection
    const handleSuggestionSelect = React.useCallback((suggestion: string) => {
      handleValueChange(suggestion);
      setSuggestionsVisible(false);
      onSuggestionSelect?.(suggestion);
    }, [handleValueChange, onSuggestionSelect]);
    
    // Handle file selection
    const handleFileChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      onFileSelect?.(files);
    }, [onFileSelect]);
    
    // Handle drag and drop
    const handleDragOver = React.useCallback((event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(true);
    }, []);
    
    const handleDragLeave = React.useCallback((event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
    }, []);
    
    const handleDrop = React.useCallback((event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      const files = event.dataTransfer.files;
      onFileSelect?.(files);
    }, [onFileSelect]);
    
    // Handle keyboard navigation for suggestions
    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
      if (searchSuggestions && suggestionsVisible) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setSelectedSuggestion(prev => 
              prev < searchSuggestions.length - 1 ? prev + 1 : prev
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
            break;
          case 'Enter':
            event.preventDefault();
            if (selectedSuggestion >= 0 && searchSuggestions[selectedSuggestion]) {
              handleSuggestionSelect(searchSuggestions[selectedSuggestion]);
            }
            break;
          case 'Escape':
            setSuggestionsVisible(false);
            setSelectedSuggestion(-1);
            break;
        }
      }
      
      onKeyDown?.(event);
    }, [searchSuggestions, suggestionsVisible, selectedSuggestion, handleSuggestionSelect, onKeyDown]);
    
    // Get input type
    const getInputType = () => {
      if (inputType === 'password' && isPasswordVisible) {
        return 'text';
      }
      return inputType || 'text';
    };
    
    // Get default icon for input type
    const getDefaultIcon = () => {
      switch (inputType) {
        case 'email': return <Mail className="h-4 w-4" />;
        case 'tel': return <Phone className="h-4 w-4" />;
        case 'url': return <ExternalLink className="h-4 w-4" />;
        case 'search': return <Search className="h-4 w-4" />;
        case 'date': return <Calendar className="h-4 w-4" />;
        case 'time': return <Clock className="h-4 w-4" />;
        case 'password': return <Lock className="h-4 w-4" />;
        case 'number': return <Hash className="h-4 w-4" />;
        case 'file': return <ExternalLink className="h-4 w-4" />;
        default: return null;
      }
    };
    
    // Get password strength color
    const getPasswordStrengthColor = () => {
      switch (passwordStrength) {
        case 'weak': return 'text-red-500';
        case 'medium': return 'text-yellow-500';
        case 'strong': return 'text-green-500';
        default: return 'text-gray-500';
      }
    };
    
    // Get character count
    const characterCount = currentValue.length;
    const isOverLimit = maxLength && characterCount > maxLength;
    
    // Get message color
    const getMessageColor = () => {
      if (errorMessage || validationErrors.length > 0) return 'text-atlas-error-main';
      if (successMessage) return 'text-atlas-success-main';
      if (warningMessage) return 'text-atlas-warning-main';
      if (infoMessage) return 'text-atlas-info-main';
      return 'text-atlas-text-tertiary';
    };
    
    // Get message icon
    const getMessageIcon = () => {
      if (errorMessage || validationErrors.length > 0) return <AlertCircle className="h-4 w-4" />;
      if (successMessage) return <Check className="h-4 w-4" />;
      if (warningMessage) return <AlertCircle className="h-4 w-4" />;
      if (infoMessage) return <Info className="h-4 w-4" />;
      return null;
    };
    
    return (
      <div className={cn('space-y-2', fullWidth && 'w-full')} style={{ width, height }}>
        {/* Label */}
        {label && !floatingLabel && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-atlas-text-primary"
          >
            {label}
            {validation?.required && (
              <span className="ml-1 text-atlas-error-main" aria-label="required">
                *
              </span>
            )}
          </label>
        )}
        
        {/* Input container */}
        <div className="relative">
          {/* Input groups */}
          {groupPosition === 'left' && (
            <div className="absolute left-0 top-0 h-full flex items-center px-3 bg-atlas-border-subtle border border-r-0 border-atlas-border rounded-l-md">
              {groupIcon || groupText}
            </div>
          )}
          
          {/* Left icon */}
          {(leftIcon || (iconPosition === 'left' && getDefaultIcon())) && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary">
              {leftIcon || getDefaultIcon()}
            </div>
          )}
          
          {/* Main input */}
          <input
            id={inputId}
            ref={ref || inputRef}
            type={getInputType()}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onKeyUp={onKeyUp}
            onKeyPress={onKeyPress}
            onDragOver={dragAndDrop ? handleDragOver : undefined}
            onDragLeave={dragAndDrop ? handleDragLeave : undefined}
            onDrop={dragAndDrop ? handleDrop : undefined}
            className={cn(
              inputVariants({ 
                variant: actualVariant, 
                size: size as any, 
                inputType, 
                state: actualState, 
                animation, 
                rounded, 
                shadow, 
                className 
              }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              groupPosition === 'left' && 'pl-16',
              groupPosition === 'right' && 'pr-16',
              floatingLabel && 'pt-6',
              dragAndDrop && dragOver && 'border-atlas-primary-main bg-atlas-primary-main/5',
              isOverLimit && 'border-atlas-error-main'
            )}
            aria-describedby={cn(
              currentMessage && errorId,
              helperText && helperId,
              showCounter && counterId,
              ariaDescribedBy
            )}
            aria-invalid={!!(errorMessage || validationErrors.length > 0)}
            aria-required={validation?.required}
            aria-label={ariaLabel}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            autoCorrect={autoCorrect}
            autoCapitalize={autoCapitalize}
            spellCheck={spellCheck}
            inputMode={inputMode}
            enterKeyHint={enterKeyHint}
            form={form}
            formAction={formAction}
            formEncType={formEncType}
            formMethod={formMethod}
            formNoValidate={formNoValidate}
            formTarget={formTarget}
            accept={accept}
            multiple={multiple}
            maxLength={maxLength}
            {...props}
          />
          
          {/* Floating label */}
          {floatingLabel && (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-3 transition-all duration-200 pointer-events-none',
                isFocused || currentValue || floatingLabelActive
                  ? 'top-1 text-xs text-atlas-primary-main'
                  : 'top-1/2 -translate-y-1/2 text-sm text-atlas-text-tertiary'
              )}
            >
              {label}
              {validation?.required && (
                <span className="ml-1 text-atlas-error-main">*</span>
              )}
            </label>
          )}
          
          {/* Right icon */}
          {(rightIcon || (iconPosition === 'right' && getDefaultIcon())) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary">
              {rightIcon || getDefaultIcon()}
            </div>
          )}
          
          {/* Password toggle */}
          {showPasswordToggle && inputType === 'password' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary hover:text-atlas-text-primary transition-colors"
              onClick={handlePasswordToggle}
              tabIndex={-1}
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          
          {/* Search button */}
          {showSearchButton && inputType === 'search' && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary hover:text-atlas-text-primary transition-colors"
              onClick={handleSearch}
              tabIndex={-1}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
          
          {/* Copy button */}
          {copyable && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary hover:text-atlas-text-primary transition-colors"
              onClick={handleCopy}
              tabIndex={-1}
              aria-label="Copy to clipboard"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
          
          {/* External link button */}
          {external && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-atlas-text-tertiary hover:text-atlas-text-primary transition-colors"
              onClick={onExternalClick}
              tabIndex={-1}
              aria-label="Open external link"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {loadingIcon || <div className="h-4 w-4 animate-spin rounded-full border-2 border-atlas-primary-main border-t-transparent" />}
            </div>
          )}
          
          {/* Input groups - right */}
          {groupPosition === 'right' && (
            <div className="absolute right-0 top-0 h-full flex items-center px-3 bg-atlas-border-subtle border border-l-0 border-atlas-border rounded-r-md">
              {groupIcon || groupText}
            </div>
          )}
        </div>
        
        {/* Messages and helper text */}
        {(currentMessage || helperText || showCounter) && (
          <div className="space-y-1">
            {/* Status message */}
            {currentMessage && (
              <div className={cn('flex items-center gap-2 text-sm', getMessageColor())}>
                {getMessageIcon()}
                <span role={errorMessage || validationErrors.length > 0 ? 'alert' : undefined}>
                  {currentMessage}
                </span>
              </div>
            )}
            
            {/* Helper text */}
            {helperText && (
              <p className="text-sm text-atlas-text-tertiary">
                {helperText}
              </p>
            )}
            
            {/* Character counter */}
            {showCounter && (
              <div className={cn(
                'text-sm',
                isOverLimit ? 'text-atlas-error-main' : 'text-atlas-text-tertiary'
              )}>
                {characterCount}{maxLength && `/${maxLength}`}
              </div>
            )}
          </div>
        )}
        
        {/* Password strength indicator */}
        {passwordStrength && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-atlas-text-tertiary">Password strength:</span>
              <span className={cn('font-medium', getPasswordStrengthColor())}>
                {passwordStrength}
              </span>
            </div>
            {passwordRequirements && (
              <ul className="text-xs text-atlas-text-tertiary space-y-1">
                {passwordRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-atlas-text-tertiary rounded-full" />
                    {requirement}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
        {/* Search suggestions */}
        {searchSuggestions && suggestionsVisible && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-atlas-border rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className={cn(
                  'w-full px-3 py-2 text-left text-sm hover:bg-atlas-border-subtle transition-colors',
                  index === selectedSuggestion && 'bg-atlas-border-subtle'
                )}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Input Group Component
interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  ({ className, orientation = 'vertical', spacing = 'md', children, ...props }, ref) => {
    const spacingClasses = {
      none: '',
      sm: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
      md: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
      lg: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientation === 'vertical' && 'flex-col',
          orientation === 'horizontal' && 'flex-row items-end',
          spacingClasses[spacing],
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </div>
    );
  }
);

InputGroup.displayName = 'InputGroup';

// Input Addon Component
interface InputAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'left' | 'right';
  children: React.ReactNode;
}

const InputAddon = React.forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, position = 'left', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center px-3 py-2 bg-atlas-border-subtle border border-atlas-border text-sm text-atlas-text-secondary',
          position === 'left' && 'rounded-l-md border-r-0',
          position === 'right' && 'rounded-r-md border-l-0',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InputAddon.displayName = 'InputAddon';

// Input Label Component
interface InputLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-sm font-medium text-atlas-text-primary', className)}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-atlas-error-main" aria-label="required">
            *
          </span>
        )}
      </label>
    );
  }
);

InputLabel.displayName = 'InputLabel';

// Input Helper Text Component
interface InputHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'error' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
}

const InputHelperText = React.forwardRef<HTMLParagraphElement, InputHelperTextProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'text-atlas-text-tertiary',
      error: 'text-atlas-error-main',
      success: 'text-atlas-success-main',
      warning: 'text-atlas-warning-main',
      info: 'text-atlas-info-main',
    };

    return (
      <p
        ref={ref}
        className={cn('text-sm', variantClasses[variant], className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

InputHelperText.displayName = 'InputHelperText';

// Input Error Component
interface InputErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const InputError = React.forwardRef<HTMLDivElement, InputErrorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 text-sm text-atlas-error-main', className)}
        role="alert"
        {...props}
      >
        <AlertCircle className="h-4 w-4" />
        <span>{children}</span>
      </div>
    );
  }
);

InputError.displayName = 'InputError';

// Input Success Component
interface InputSuccessProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const InputSuccess = React.forwardRef<HTMLDivElement, InputSuccessProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 text-sm text-atlas-success-main', className)}
        {...props}
      >
        <Check className="h-4 w-4" />
        <span>{children}</span>
      </div>
    );
  }
);

InputSuccess.displayName = 'InputSuccess';

// Input Warning Component
interface InputWarningProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const InputWarning = React.forwardRef<HTMLDivElement, InputWarningProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 text-sm text-atlas-warning-main', className)}
        {...props}
      >
        <AlertCircle className="h-4 w-4" />
        <span>{children}</span>
      </div>
    );
  }
);

InputWarning.displayName = 'InputWarning';

// Input Info Component
interface InputInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const InputInfo = React.forwardRef<HTMLDivElement, InputInfoProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 text-sm text-atlas-info-main', className)}
        {...props}
      >
        <Info className="h-4 w-4" />
        <span>{children}</span>
      </div>
    );
  }
);

InputInfo.displayName = 'InputInfo';

// Input Counter Component
interface InputCounterProps extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  max?: number;
  showPercentage?: boolean;
}

const InputCounter = React.forwardRef<HTMLDivElement, InputCounterProps>(
  ({ className, current, max, showPercentage = false, ...props }, ref) => {
    const isOverLimit = max && current > max;
    const percentage = max ? (current / max) * 100 : 0;

    return (
      <div
        ref={ref}
        className={cn(
          'text-sm',
          isOverLimit ? 'text-atlas-error-main' : 'text-atlas-text-tertiary',
          className
        )}
        {...props}
      >
        {showPercentage ? (
          <span>{Math.round(percentage)}%</span>
        ) : (
          <span>{current}{max && `/${max}`}</span>
        )}
      </div>
    );
  }
);

InputCounter.displayName = 'InputCounter';

// Input Mask Component
interface InputMaskProps {
  mask: string;
  value: string;
  maskChar?: string;
  placeholder?: string;
}

const InputMask: React.FC<InputMaskProps> = ({ 
  mask, 
  value, 
  maskChar = '_', 
  placeholder 
}) => {
  const applyMask = React.useCallback((inputValue: string) => {
    let maskedValue = '';
    let valueIndex = 0;
    
    for (let i = 0; i < mask.length && valueIndex < inputValue.length; i++) {
      if (mask[i] === '9') {
        const char = inputValue[valueIndex];
        if (char && /\d/.test(char)) {
          maskedValue += char;
          valueIndex++;
        } else {
          maskedValue += maskChar;
        }
      } else if (mask[i] === 'A') {
        const char = inputValue[valueIndex];
        if (char && /[A-Za-z]/.test(char)) {
          maskedValue += char;
          valueIndex++;
        } else {
          maskedValue += maskChar;
        }
      } else if (mask[i] === 'a') {
        const char = inputValue[valueIndex];
        if (char && /[a-z]/.test(char)) {
          maskedValue += char;
          valueIndex++;
        } else {
          maskedValue += maskChar;
        }
      } else {
        maskedValue += mask[i];
      }
    }
    
    return maskedValue;
  }, [mask, maskChar]);

  return (
    <span className="text-atlas-text-tertiary">
      {applyMask(value)}
    </span>
  );
};

// Input Validation Hook
interface UseInputValidationProps {
  validation?: InputProps['validation'];
  value: string;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

const useInputValidation = ({
  validation,
  value,
  validateOnChange,
  validateOnBlur,
}: UseInputValidationProps) => {
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isValid, setIsValid] = React.useState(true);

  const validate = React.useCallback((inputValue: string) => {
    if (!validation) return { isValid: true, errors: [] };
    
    const validationErrors: string[] = [];
    
    if (validation.required && !inputValue.trim()) {
      validationErrors.push('This field is required');
    }
    
    if (validation.minLength && inputValue.length < validation.minLength) {
      validationErrors.push(`Minimum length is ${validation.minLength} characters`);
    }
    
    if (validation.maxLength && inputValue.length > validation.maxLength) {
      validationErrors.push(`Maximum length is ${validation.maxLength} characters`);
    }
    
    if (validation.min && Number(inputValue) < validation.min) {
      validationErrors.push(`Minimum value is ${validation.min}`);
    }
    
    if (validation.max && Number(inputValue) > validation.max) {
      validationErrors.push(`Maximum value is ${validation.max}`);
    }
    
    if (validation.pattern && !validation.pattern.test(inputValue)) {
      validationErrors.push('Invalid format');
    }
    
    if (validation.custom) {
      const customError = validation.custom(inputValue);
      if (customError) {
        validationErrors.push(customError);
      }
    }
    
    return { isValid: validationErrors.length === 0, errors: validationErrors };
  }, [validation]);

  React.useEffect(() => {
    if (validateOnChange) {
      const result = validate(value);
      setErrors(result.errors);
      setIsValid(result.isValid);
    }
  }, [value, validateOnChange, validate]);

  return {
    errors,
    isValid,
    validate,
  };
};

export { 
  Input, 
  inputVariants, 
  InputGroup, 
  InputAddon, 
  InputLabel, 
  InputHelperText, 
  InputError, 
  InputSuccess, 
  InputWarning, 
  InputInfo, 
  InputCounter, 
  InputMask, 
  useInputValidation,
  type InputGroupProps,
  type InputAddonProps,
  type InputLabelProps,
  type InputHelperTextProps,
  type InputErrorProps,
  type InputSuccessProps,
  type InputWarningProps,
  type InputInfoProps,
  type InputCounterProps,
  type InputMaskProps,
  type UseInputValidationProps
};
