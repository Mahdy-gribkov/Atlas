import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  CalculatorIcon, 
  PlusIcon, 
  MinusIcon, 
  XIcon, 
  DivideIcon, 
  EqualIcon, 
  FunctionIcon, 
  CodeIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  AlertTriangleIcon, 
  RefreshIcon, 
  SaveIcon, 
  UndoIcon, 
  RedoIcon, 
  CopyIcon, 
  TrashIcon, 
  EditIcon, 
  EyeIcon, 
  EyeOffIcon, 
  SettingsIcon, 
  ZapIcon, 
  TargetIcon, 
  ClockIcon, 
  InfoIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  HashIcon,
  PercentIcon,
  DollarSignIcon,
  CalendarIcon,
  UserIcon
} from 'lucide-react';

const formCalculationsVariants = cva(
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
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formCalculationVariants = cva(
  'border border-atlas-border rounded-lg bg-atlas-card-bg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        active: 'border-atlas-primary-main bg-atlas-primary-lighter',
        error: 'border-atlas-error-main bg-atlas-error-bg',
        warning: 'border-atlas-warning-main bg-atlas-warning-bg',
        success: 'border-atlas-success-main bg-atlas-success-bg',
        disabled: 'border-atlas-border-subtle bg-atlas-border-subtle opacity-50',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formCalculationEditorVariants = cva(
  'w-full font-mono text-sm border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary placeholder-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        error: 'border-atlas-error-main',
        success: 'border-atlas-success-main',
      },
      size: {
        sm: 'p-2 text-xs',
        default: 'p-3 text-sm',
        lg: 'p-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormCalculationsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formCalculationsVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  calculations: CalculationField[];
  fields: CalculationFieldReference[];
  onCalculationsChange?: (calculations: CalculationField[]) => void;
  onCalculationAdd?: (calculation: CalculationField) => void;
  onCalculationUpdate?: (calculationId: string, updates: Partial<CalculationField>) => void;
  onCalculationDelete?: (calculationId: string) => void;
  onCalculationDuplicate?: (calculationId: string) => void;
  onCalculationTest?: (calculation: CalculationField) => void;
  onCalculationEnable?: (calculationId: string) => void;
  onCalculationDisable?: (calculationId: string) => void;
  showBuilder?: boolean;
  showPreview?: boolean;
  showTestMode?: boolean;
  testData?: Record<string, any>;
  children?: React.ReactNode;
}

export interface CalculationField {
  id: string;
  name: string;
  label: string;
  description?: string;
  enabled: boolean;
  formula: string;
  resultType: 'number' | 'string' | 'boolean' | 'date' | 'currency' | 'percentage';
  format?: {
    decimalPlaces?: number;
    currency?: string;
    dateFormat?: string;
    prefix?: string;
    suffix?: string;
  };
  dependencies: string[];
  trigger: 'change' | 'blur' | 'focus' | 'submit' | 'custom';
  priority: number;
  createdAt: Date;
  updatedAt: Date;
  lastTested?: Date;
  testResult?: 'pass' | 'fail' | 'error';
  metadata?: {
    tags?: string[];
    category?: string;
    author?: string;
    version?: string;
  };
}

export interface CalculationFieldReference {
  id: string;
  name: string;
  type: string;
  label: string;
  value?: any;
}

export interface FormCalculationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formCalculationVariants> {
  variant?: 'default' | 'active' | 'error' | 'warning' | 'success' | 'disabled';
  size?: 'sm' | 'default' | 'lg';
  calculation: CalculationField;
  fields: CalculationFieldReference[];
  onUpdate?: (updates: Partial<CalculationField>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onTest?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export interface FormCalculationEditorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formCalculationEditorVariants> {
  variant?: 'default' | 'error' | 'success';
  size?: 'sm' | 'default' | 'lg';
  formula: string;
  onFormulaChange?: (formula: string) => void;
  fields: CalculationFieldReference[];
  showSuggestions?: boolean;
  onTest?: () => void;
  testResult?: 'pass' | 'fail' | 'error';
  testValue?: any;
}

const FormCalculationEditor = React.forwardRef<
  HTMLDivElement,
  FormCalculationEditorProps
>(({ 
  className, 
  variant, 
  size, 
  formula, 
  onFormulaChange, 
  fields, 
  showSuggestions = true, 
  onTest, 
  testResult, 
  testValue, 
  ...props 
}, ref) => {
  const [showFieldSuggestions, setShowFieldSuggestions] = React.useState(false);
  const [cursorPosition, setCursorPosition] = React.useState(0);

  const handleFormulaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFormula = e.target.value;
    setCursorPosition(e.target.selectionStart);
    onFormulaChange?.(newFormula);
  };

  const handleFieldInsert = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field) {
      const fieldReference = `{${field.name}}`;
      const newFormula = formula.slice(0, cursorPosition) + fieldReference + formula.slice(cursorPosition);
      onFormulaChange?.(newFormula);
      setShowFieldSuggestions(false);
    }
  };

  const getEditorVariant = () => {
    if (testResult === 'error') return 'error';
    if (testResult === 'pass') return 'success';
    return variant || 'default';
  };

  const getTestResultIcon = () => {
    switch (testResult) {
      case 'pass':
        return <CheckCircleIcon className="h-4 w-4 text-atlas-success-main" />;
      case 'fail':
        return <AlertTriangleIcon className="h-4 w-4 text-atlas-warning-main" />;
      case 'error':
        return <AlertCircleIcon className="h-4 w-4 text-atlas-error-main" />;
      default:
        return null;
    }
  };

  return (
    <div ref={ref} className={cn('space-y-3', className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FunctionIcon className="h-4 w-4 text-atlas-text-tertiary" />
          <span className="text-sm font-medium text-atlas-text-primary">
            Formula Editor
          </span>
          {getTestResultIcon()}
        </div>
        
        <div className="flex items-center gap-2">
          {showSuggestions && (
            <button
              type="button"
              onClick={() => setShowFieldSuggestions(!showFieldSuggestions)}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-atlas-border-subtle text-atlas-text-primary rounded hover:bg-atlas-border transition-colors"
            >
              <UserIcon className="h-3 w-3" />
              Fields
            </button>
          )}
          
          <button
            type="button"
            onClick={onTest}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-atlas-primary-main text-white rounded hover:bg-atlas-primary-light transition-colors"
          >
            <PlayIcon className="h-3 w-3" />
            Test
          </button>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={formula}
          onChange={handleFormulaChange}
          onFocus={() => setShowFieldSuggestions(true)}
          onBlur={() => setTimeout(() => setShowFieldSuggestions(false), 200)}
          placeholder="Enter formula (e.g., {field1} + {field2})"
          className={cn(formCalculationEditorVariants({ variant: getEditorVariant(), size }), 'min-h-[100px] resize-y')}
        />
        
        {showFieldSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-atlas-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-atlas-text-tertiary mb-2">
                Available Fields
              </div>
              <div className="space-y-1">
                {fields.map(field => (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => handleFieldInsert(field.id)}
                    className="w-full text-left px-2 py-1 text-sm text-atlas-text-primary hover:bg-atlas-border-subtle rounded transition-colors"
                  >
                    <span className="font-medium">{field.name}</span>
                    <span className="text-xs text-atlas-text-tertiary ml-2">
                      ({field.type})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {testValue !== undefined && (
        <div className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
          <EqualIcon className="h-4 w-4 text-atlas-text-tertiary" />
          <span className="text-sm text-atlas-text-primary">
            Result: <span className="font-mono">{String(testValue)}</span>
          </span>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-xs text-atlas-text-tertiary">
        <span>Available operators: +, -, *, /, %, ^, (, )</span>
        <span>•</span>
        <span>Functions: SUM(), AVG(), MIN(), MAX(), COUNT()</span>
      </div>
    </div>
  );
});
FormCalculationEditor.displayName = 'FormCalculationEditor';

const FormCalculation = React.forwardRef<
  HTMLDivElement,
  FormCalculationProps
>(({ 
  className, 
  variant, 
  size, 
  calculation, 
  fields, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onTest, 
  onEnable, 
  onDisable, 
  showActions = true, 
  isExpanded = false, 
  onToggleExpanded, 
  ...props 
}, ref) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(calculation.name);

  const getCalculationVariant = () => {
    if (calculation.testResult === 'error') return 'error';
    if (calculation.testResult === 'fail') return 'warning';
    if (calculation.testResult === 'pass') return 'success';
    if (!calculation.enabled) return 'disabled';
    return variant || 'default';
  };

  const handleNameSave = () => {
    if (editName !== calculation.name) {
      onUpdate?.({ name: editName });
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(calculation.name);
      setIsEditing(false);
    }
  };

  const getTestResultIcon = () => {
    switch (calculation.testResult) {
      case 'pass':
        return <CheckCircleIcon className="h-4 w-4 text-atlas-success-main" />;
      case 'fail':
        return <AlertTriangleIcon className="h-4 w-4 text-atlas-warning-main" />;
      case 'error':
        return <AlertCircleIcon className="h-4 w-4 text-atlas-error-main" />;
      default:
        return null;
    }
  };

  const formatResult = (value: any) => {
    if (value === undefined || value === null) return 'No result';
    
    switch (calculation.resultType) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: calculation.format?.currency || 'USD',
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'number':
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: calculation.format?.decimalPlaces || 0,
          maximumFractionDigits: calculation.format?.decimalPlaces || 2,
        }).format(value);
      default:
        return String(value);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formCalculationVariants({ variant: getCalculationVariant(), size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex-shrink-0 p-1 hover:bg-atlas-border-subtle rounded transition-colors"
            aria-label={isExpanded ? 'Collapse calculation' : 'Expand calculation'}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <CalculatorIcon className="h-4 w-4 text-atlas-text-tertiary flex-shrink-0" />
            
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleNameKeyDown}
                className="flex-1 px-2 py-1 text-sm font-medium bg-transparent border border-atlas-border rounded focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
                autoFocus
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-sm font-medium text-atlas-text-primary hover:text-atlas-primary-main transition-colors truncate"
              >
                {calculation.name}
              </button>
            )}
            
            {calculation.description && (
              <span className="text-xs text-atlas-text-tertiary truncate">
                {calculation.description}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getTestResultIcon()}
            
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full',
                calculation.enabled ? 'bg-atlas-success-main' : 'bg-atlas-text-tertiary'
              )} />
              <span className="text-xs text-atlas-text-tertiary">
                {calculation.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <span className="text-xs text-atlas-text-tertiary">
              {calculation.resultType}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <button
              type="button"
              onClick={calculation.enabled ? onDisable : onEnable}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label={calculation.enabled ? 'Disable calculation' : 'Enable calculation'}
            >
              {calculation.enabled ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              type="button"
              onClick={onTest}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Test calculation"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Duplicate calculation"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDelete}
              className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
              aria-label="Delete calculation"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <FormCalculationEditor
            variant="default"
            size={size}
            formula={calculation.formula}
            onFormulaChange={(formula) => onUpdate?.({ formula })}
            fields={fields}
            onTest={onTest}
            testResult={calculation.testResult}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
                Result Type
              </h4>
              <select
                value={calculation.resultType}
                onChange={(e) => onUpdate?.({ resultType: e.target.value as any })}
                className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              >
                <option value="number">Number</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
                <option value="currency">Currency</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
                Trigger
              </h4>
              <select
                value={calculation.trigger}
                onChange={(e) => onUpdate?.({ trigger: e.target.value as any })}
                className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              >
                <option value="change">On Change</option>
                <option value="blur">On Blur</option>
                <option value="focus">On Focus</option>
                <option value="submit">On Submit</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
              Dependencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {calculation.dependencies.map(depId => {
                const field = fields.find(f => f.id === depId);
                return (
                  <span
                    key={depId}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-atlas-primary-lighter text-atlas-primary-main text-xs rounded"
                  >
                    <HashIcon className="h-3 w-3" />
                    {field?.name || depId}
                  </span>
                );
              })}
            </div>
          </div>
          
          {calculation.lastTested && (
            <div className="text-xs text-atlas-text-tertiary">
              Last tested: {calculation.lastTested.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
FormCalculation.displayName = 'FormCalculation';

const FormCalculations = React.forwardRef<
  HTMLDivElement,
  FormCalculationsProps
>(({
  className,
  variant,
  size,
  calculations,
  fields,
  onCalculationsChange,
  onCalculationAdd,
  onCalculationUpdate,
  onCalculationDelete,
  onCalculationDuplicate,
  onCalculationTest,
  onCalculationEnable,
  onCalculationDisable,
  showBuilder = true,
  showPreview = true,
  showTestMode = false,
  testData = {},
  children,
  ...props
}, ref) => {
  const [expandedCalculations, setExpandedCalculations] = React.useState<Set<string>>(new Set());
  const [isTestMode, setIsTestMode] = React.useState(false);

  const handleCalculationToggle = (calculationId: string) => {
    const newExpanded = new Set(expandedCalculations);
    if (newExpanded.has(calculationId)) {
      newExpanded.delete(calculationId);
    } else {
      newExpanded.add(calculationId);
    }
    setExpandedCalculations(newExpanded);
  };

  const handleCalculationUpdate = (calculationId: string, updates: Partial<CalculationField>) => {
    const updatedCalculation = {
      ...updates,
      updatedAt: new Date(),
    };
    onCalculationUpdate?.(calculationId, updatedCalculation);
  };

  const sortedCalculations = [...calculations].sort((a, b) => b.priority - a.priority);

  return (
    <div
      ref={ref}
      className={cn(formCalculationsVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Form Calculations
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {calculations.length} calculation{calculations.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTestMode(!isTestMode)}
            className={cn(
              'inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
              isTestMode
                ? 'bg-atlas-primary-main text-white'
                : 'border border-atlas-border hover:bg-atlas-border-subtle text-atlas-text-primary'
            )}
          >
            <PlayIcon className="h-4 w-4" />
            Test Mode
          </button>
          
          <button
            type="button"
            onClick={() => onCalculationAdd?.({
              id: `calc-${Date.now()}`,
              name: 'New Calculation',
              label: 'New Calculation',
              enabled: true,
              formula: '',
              resultType: 'number',
              dependencies: [],
              trigger: 'change',
              priority: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            })}
            className="inline-flex items-center gap-2 px-3 py-2 bg-atlas-primary-main text-white text-sm rounded-md hover:bg-atlas-primary-light transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Calculation
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          Calculations ({calculations.length})
        </h3>
        
        {sortedCalculations.length === 0 ? (
          <div className="text-center py-8">
            <CalculatorIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-atlas-text-primary mb-2">
              No calculations configured
            </h3>
            <p className="text-sm text-atlas-text-secondary mb-4">
              Create calculated fields to automatically compute values based on other fields
            </p>
            <button
              type="button"
              onClick={() => onCalculationAdd?.({
                id: `calc-${Date.now()}`,
                name: 'New Calculation',
                label: 'New Calculation',
                enabled: true,
                formula: '',
                resultType: 'number',
                dependencies: [],
                trigger: 'change',
                priority: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-atlas-primary-main text-white rounded-md hover:bg-atlas-primary-light transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Calculation
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCalculations.map(calculation => (
              <FormCalculation
                key={calculation.id}
                variant="default"
                size={size}
                calculation={calculation}
                fields={fields}
                onUpdate={(updates) => handleCalculationUpdate(calculation.id, updates)}
                onDelete={() => onCalculationDelete?.(calculation.id)}
                onDuplicate={() => onCalculationDuplicate?.(calculation.id)}
                onTest={() => onCalculationTest?.(calculation)}
                onEnable={() => onCalculationEnable?.(calculation.id)}
                onDisable={() => onCalculationDisable?.(calculation.id)}
                isExpanded={expandedCalculations.has(calculation.id)}
                onToggleExpanded={() => handleCalculationToggle(calculation.id)}
              />
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
});
FormCalculations.displayName = 'FormCalculations';

// Additional utility components
const FormCalculationsContainer = React.forwardRef<
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
FormCalculationsContainer.displayName = 'FormCalculationsContainer';

const FormCalculationsSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    calculationCount?: number;
  }
>(({ className, size = 'default', calculationCount = 3, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('w-full space-y-6', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-4 w-48 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-10 w-32 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: calculationCount }).map((_, index) => (
          <div key={index} className="p-4 border border-atlas-border rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-atlas-border-subtle rounded animate-pulse" />
                  <div className="h-4 w-48 bg-atlas-border-subtle rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
                  <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 w-full bg-atlas-border-subtle rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-atlas-border-subtle rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
FormCalculationsSkeleton.displayName = 'FormCalculationsSkeleton';

export {
  FormCalculations,
  FormCalculation,
  FormCalculationEditor,
  FormCalculationsContainer,
  FormCalculationsSkeleton,
  formCalculationsVariants,
  formCalculationVariants,
  formCalculationEditorVariants,
};
