import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  LinkIcon, 
  UnlinkIcon, 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  CopyIcon, 
  ArrowRightIcon, 
  ArrowDownIcon, 
  GitBranchIcon, 
  NetworkIcon, 
  LayersIcon, 
  TargetIcon, 
  ZapIcon, 
  AlertCircleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  SettingsIcon, 
  EyeIcon, 
  EyeOffIcon, 
  RefreshIcon, 
  PlayIcon, 
  PauseIcon, 
  SaveIcon, 
  UndoIcon, 
  RedoIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  InfoIcon,
  AlertTriangleIcon
} from 'lucide-react';

const formDependenciesVariants = cva(
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

const formDependencyVariants = cva(
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

const formDependencyNodeVariants = cva(
  'flex items-center gap-3 p-3 border border-atlas-border rounded-lg bg-atlas-card-bg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        source: 'border-atlas-primary-main bg-atlas-primary-lighter',
        target: 'border-atlas-secondary-main bg-atlas-secondary-lighter',
        intermediate: 'border-atlas-info-main bg-atlas-info-bg',
      },
      size: {
        sm: 'p-2',
        default: 'p-3',
        lg: 'p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormDependenciesProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formDependenciesVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  dependencies: FieldDependency[];
  fields: DependencyField[];
  onDependenciesChange?: (dependencies: FieldDependency[]) => void;
  onDependencyAdd?: (dependency: FieldDependency) => void;
  onDependencyUpdate?: (dependencyId: string, updates: Partial<FieldDependency>) => void;
  onDependencyDelete?: (dependencyId: string) => void;
  onDependencyDuplicate?: (dependencyId: string) => void;
  onDependencyTest?: (dependency: FieldDependency) => void;
  onDependencyEnable?: (dependencyId: string) => void;
  onDependencyDisable?: (dependencyId: string) => void;
  showBuilder?: boolean;
  showVisualization?: boolean;
  showTestMode?: boolean;
  testData?: Record<string, any>;
  children?: React.ReactNode;
}

export interface FieldDependency {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  sourceFieldId: string;
  targetFieldId: string;
  dependencyType: 'value' | 'visibility' | 'validation' | 'options' | 'style' | 'behavior';
  trigger: 'change' | 'blur' | 'focus' | 'submit' | 'custom';
  conditions: DependencyCondition[];
  actions: DependencyAction[];
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

export interface DependencyCondition {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty' | 'is_checked' | 'is_not_checked';
  value?: any;
  valueType?: 'string' | 'number' | 'boolean' | 'date' | 'array';
  logicalOperator?: 'AND' | 'OR';
}

export interface DependencyAction {
  id: string;
  type: 'set_value' | 'clear_value' | 'set_options' | 'clear_options' | 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'optional' | 'set_style' | 'add_class' | 'remove_class' | 'trigger_event';
  targetFieldId: string;
  value?: any;
  options?: Array<{ label: string; value: string }>;
  style?: React.CSSProperties;
  className?: string;
  eventName?: string;
  delay?: number;
}

export interface DependencyField {
  id: string;
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  dependencies?: string[];
  dependents?: string[];
}

export interface FormDependencyProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formDependencyVariants> {
  variant?: 'default' | 'active' | 'error' | 'warning' | 'success' | 'disabled';
  size?: 'sm' | 'default' | 'lg';
  dependency: FieldDependency;
  fields: DependencyField[];
  onUpdate?: (updates: Partial<FieldDependency>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onTest?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export interface FormDependencyNodeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formDependencyNodeVariants> {
  variant?: 'default' | 'source' | 'target' | 'intermediate';
  size?: 'sm' | 'default' | 'lg';
  field: DependencyField;
  isSelected?: boolean;
  onClick?: () => void;
  showDependencies?: boolean;
}

const FormDependencyNode = React.forwardRef<
  HTMLDivElement,
  FormDependencyNodeProps
>(({ 
  className, 
  variant, 
  size, 
  field, 
  isSelected, 
  onClick, 
  showDependencies = true, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        formDependencyNodeVariants({ variant, size, className }),
        isSelected && 'ring-2 ring-atlas-primary-main',
        onClick && 'cursor-pointer hover:shadow-md'
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex-shrink-0">
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
          variant === 'source' && 'bg-atlas-primary-main',
          variant === 'target' && 'bg-atlas-secondary-main',
          variant === 'intermediate' && 'bg-atlas-info-main',
          variant === 'default' && 'bg-atlas-text-tertiary'
        )}>
          {field.name.charAt(0).toUpperCase()}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-atlas-text-primary truncate">
          {field.label}
        </div>
        <div className="text-xs text-atlas-text-tertiary">
          {field.type}
        </div>
        
        {showDependencies && (field.dependencies?.length || field.dependents?.length) && (
          <div className="flex items-center gap-2 mt-1">
            {field.dependencies?.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-atlas-text-tertiary">
                <ArrowRightIcon className="h-3 w-3" />
                <span>{field.dependencies.length} deps</span>
              </div>
            )}
            {field.dependents?.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-atlas-text-tertiary">
                <ArrowDownIcon className="h-3 w-3" />
                <span>{field.dependents.length} dependents</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
FormDependencyNode.displayName = 'FormDependencyNode';

const FormDependency = React.forwardRef<
  HTMLDivElement,
  FormDependencyProps
>(({ 
  className, 
  variant, 
  size, 
  dependency, 
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
  const [editName, setEditName] = React.useState(dependency.name);

  const getDependencyVariant = () => {
    if (dependency.testResult === 'error') return 'error';
    if (dependency.testResult === 'fail') return 'warning';
    if (dependency.testResult === 'pass') return 'success';
    if (!dependency.enabled) return 'disabled';
    return variant || 'default';
  };

  const getSourceField = () => fields.find(f => f.id === dependency.sourceFieldId);
  const getTargetField = () => fields.find(f => f.id === dependency.targetFieldId);

  const handleNameSave = () => {
    if (editName !== dependency.name) {
      onUpdate?.({ name: editName });
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(dependency.name);
      setIsEditing(false);
    }
  };

  const getTestResultIcon = () => {
    switch (dependency.testResult) {
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
    <div
      ref={ref}
      className={cn(formDependencyVariants({ variant: getDependencyVariant(), size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex-shrink-0 p-1 hover:bg-atlas-border-subtle rounded transition-colors"
            aria-label={isExpanded ? 'Collapse dependency' : 'Expand dependency'}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
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
                {dependency.name}
              </button>
            )}
            
            {dependency.description && (
              <span className="text-xs text-atlas-text-tertiary truncate">
                {dependency.description}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getTestResultIcon()}
            
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full',
                dependency.enabled ? 'bg-atlas-success-main' : 'bg-atlas-text-tertiary'
              )} />
              <span className="text-xs text-atlas-text-tertiary">
                {dependency.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <span className="text-xs text-atlas-text-tertiary">
              Priority: {dependency.priority}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <button
              type="button"
              onClick={dependency.enabled ? onDisable : onEnable}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label={dependency.enabled ? 'Disable dependency' : 'Enable dependency'}
            >
              {dependency.enabled ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              type="button"
              onClick={onTest}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Test dependency"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Duplicate dependency"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDelete}
              className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
              aria-label="Delete dependency"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
                Source Field
              </h4>
              <FormDependencyNode
                variant="source"
                size="sm"
                field={getSourceField() || { id: dependency.sourceFieldId, name: 'Unknown', type: 'unknown', label: 'Unknown Field', required: false }}
                showDependencies={false}
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
                Target Field
              </h4>
              <FormDependencyNode
                variant="target"
                size="sm"
                field={getTargetField() || { id: dependency.targetFieldId, name: 'Unknown', type: 'unknown', label: 'Unknown Field', required: false }}
                showDependencies={false}
              />
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
              Dependency Type
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-atlas-text-primary">
                {dependency.dependencyType.replace('_', ' ')}
              </span>
              <span className="text-xs text-atlas-text-tertiary">
                Trigger: {dependency.trigger}
              </span>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
              Conditions
            </h4>
            <div className="space-y-2">
              {dependency.conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                  {index > 0 && (
                    <span className="text-xs font-medium text-atlas-text-tertiary px-2 py-1 bg-atlas-card-bg rounded">
                      {condition.logicalOperator || 'AND'}
                    </span>
                  )}
                  <span className="text-sm text-atlas-text-primary">
                    {getSourceField()?.label || condition.fieldId}
                  </span>
                  <span className="text-sm font-medium text-atlas-text-secondary">
                    {condition.operator.replace('_', ' ')}
                  </span>
                  {condition.value !== undefined && (
                    <span className="text-sm text-atlas-text-primary">
                      {typeof condition.value === 'string' ? `"${condition.value}"` : String(condition.value)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
              Actions
            </h4>
            <div className="space-y-2">
              {dependency.actions.map(action => (
                <div key={action.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                  <span className="text-sm font-medium text-atlas-text-secondary">
                    {action.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-atlas-text-primary">
                    {getTargetField()?.label || action.targetFieldId}
                  </span>
                  {action.value !== undefined && (
                    <span className="text-sm text-atlas-text-primary">
                      {typeof action.value === 'string' ? `"${action.value}"` : String(action.value)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {dependency.lastTested && (
            <div className="text-xs text-atlas-text-tertiary">
              Last tested: {dependency.lastTested.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
FormDependency.displayName = 'FormDependency';

const FormDependencies = React.forwardRef<
  HTMLDivElement,
  FormDependenciesProps
>(({
  className,
  variant,
  size,
  dependencies,
  fields,
  onDependenciesChange,
  onDependencyAdd,
  onDependencyUpdate,
  onDependencyDelete,
  onDependencyDuplicate,
  onDependencyTest,
  onDependencyEnable,
  onDependencyDisable,
  showBuilder = true,
  showVisualization = true,
  showTestMode = false,
  testData = {},
  children,
  ...props
}, ref) => {
  const [expandedDependencies, setExpandedDependencies] = React.useState<Set<string>>(new Set());
  const [isTestMode, setIsTestMode] = React.useState(false);
  const [selectedField, setSelectedField] = React.useState<string | null>(null);

  const handleDependencyToggle = (dependencyId: string) => {
    const newExpanded = new Set(expandedDependencies);
    if (newExpanded.has(dependencyId)) {
      newExpanded.delete(dependencyId);
    } else {
      newExpanded.add(dependencyId);
    }
    setExpandedDependencies(newExpanded);
  };

  const handleDependencyUpdate = (dependencyId: string, updates: Partial<FieldDependency>) => {
    const updatedDependency = {
      ...updates,
      updatedAt: new Date(),
    };
    onDependencyUpdate?.(dependencyId, updatedDependency);
  };

  const sortedDependencies = [...dependencies].sort((a, b) => b.priority - a.priority);

  const getFieldDependencies = (fieldId: string) => {
    return dependencies.filter(dep => 
      dep.sourceFieldId === fieldId || dep.targetFieldId === fieldId
    );
  };

  return (
    <div
      ref={ref}
      className={cn(formDependenciesVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Field Dependencies
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {dependencies.length} dependenc{dependencies.length !== 1 ? 'ies' : 'y'} configured
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
            onClick={() => onDependencyAdd?.({
              id: `dep-${Date.now()}`,
              name: 'New Dependency',
              enabled: true,
              sourceFieldId: fields[0]?.id || '',
              targetFieldId: fields[1]?.id || '',
              dependencyType: 'value',
              trigger: 'change',
              conditions: [],
              actions: [],
              priority: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            })}
            className="inline-flex items-center gap-2 px-3 py-2 bg-atlas-primary-main text-white text-sm rounded-md hover:bg-atlas-primary-light transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Dependency
          </button>
        </div>
      </div>

      {showVisualization && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-atlas-text-primary">
            Field Network
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fields.map(field => (
              <FormDependencyNode
                key={field.id}
                variant={selectedField === field.id ? 'source' : 'default'}
                size="sm"
                field={field}
                isSelected={selectedField === field.id}
                onClick={() => setSelectedField(selectedField === field.id ? null : field.id)}
                showDependencies={true}
              />
            ))}
          </div>
          
          {selectedField && (
            <div className="mt-4 p-4 border border-atlas-border rounded-lg bg-atlas-card-bg">
              <h4 className="text-sm font-medium text-atlas-text-primary mb-3">
                Dependencies for {fields.find(f => f.id === selectedField)?.label}
              </h4>
              <div className="space-y-2">
                {getFieldDependencies(selectedField).map(dependency => (
                  <div key={dependency.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                    <span className="text-sm text-atlas-text-primary">
                      {dependency.name}
                    </span>
                    <span className="text-xs text-atlas-text-tertiary">
                      {dependency.dependencyType}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          Dependencies ({dependencies.length})
        </h3>
        
        {sortedDependencies.length === 0 ? (
          <div className="text-center py-8">
            <NetworkIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-atlas-text-primary mb-2">
              No dependencies configured
            </h3>
            <p className="text-sm text-atlas-text-secondary mb-4">
              Create field dependencies to enable dynamic form behavior
            </p>
            <button
              type="button"
              onClick={() => onDependencyAdd?.({
                id: `dep-${Date.now()}`,
                name: 'New Dependency',
                enabled: true,
                sourceFieldId: fields[0]?.id || '',
                targetFieldId: fields[1]?.id || '',
                dependencyType: 'value',
                trigger: 'change',
                conditions: [],
                actions: [],
                priority: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
              })}
              className="inline-flex items-center gap-2 px-4 py-2 bg-atlas-primary-main text-white rounded-md hover:bg-atlas-primary-light transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Dependency
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDependencies.map(dependency => (
              <FormDependency
                key={dependency.id}
                variant="default"
                size={size}
                dependency={dependency}
                fields={fields}
                onUpdate={(updates) => handleDependencyUpdate(dependency.id, updates)}
                onDelete={() => onDependencyDelete?.(dependency.id)}
                onDuplicate={() => onDependencyDuplicate?.(dependency.id)}
                onTest={() => onDependencyTest?.(dependency)}
                onEnable={() => onDependencyEnable?.(dependency.id)}
                onDisable={() => onDependencyDisable?.(dependency.id)}
                isExpanded={expandedDependencies.has(dependency.id)}
                onToggleExpanded={() => handleDependencyToggle(dependency.id)}
              />
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
});
FormDependencies.displayName = 'FormDependencies';

// Additional utility components
const FormDependenciesContainer = React.forwardRef<
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
FormDependenciesContainer.displayName = 'FormDependenciesContainer';

const FormDependenciesSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    dependencyCount?: number;
  }
>(({ className, size = 'default', dependencyCount = 3, ...props }, ref) => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-3 border border-atlas-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-atlas-border-subtle rounded-full animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
                <div className="h-3 w-16 bg-atlas-border-subtle rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: dependencyCount }).map((_, index) => (
          <div key={index} className="p-4 border border-atlas-border rounded-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-48 bg-atlas-border-subtle rounded animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
                  <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-atlas-border-subtle rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-atlas-border-subtle rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
FormDependenciesSkeleton.displayName = 'FormDependenciesSkeleton';

export {
  FormDependencies,
  FormDependency,
  FormDependencyNode,
  FormDependenciesContainer,
  FormDependenciesSkeleton,
  formDependenciesVariants,
  formDependencyVariants,
  formDependencyNodeVariants,
};
