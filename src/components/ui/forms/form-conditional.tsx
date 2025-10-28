import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  CopyIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ChevronDownIcon, 
  ChevronRightIcon, 
  SettingsIcon, 
  CodeIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckIcon, 
  XIcon, 
  AlertCircleIcon, 
  InfoIcon, 
  ZapIcon, 
  FilterIcon, 
  LayersIcon, 
  GitBranchIcon, 
  TargetIcon, 
  ClockIcon, 
  SaveIcon, 
  UndoIcon, 
  RedoIcon
} from 'lucide-react';

const formConditionalVariants = cva(
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

const formConditionalRuleVariants = cva(
  'border border-atlas-border rounded-lg bg-atlas-card-bg transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border',
        active: 'border-atlas-primary-main bg-atlas-primary-lighter',
        error: 'border-atlas-error-main bg-atlas-error-bg',
        warning: 'border-atlas-warning-main bg-atlas-warning-bg',
        success: 'border-atlas-success-main bg-atlas-success-bg',
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

const formConditionalBuilderVariants = cva(
  'space-y-4',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'p-4 border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'p-4 bg-atlas-border-subtle rounded-lg',
        minimal: 'space-y-2',
      },
      size: {
        sm: 'space-y-2 p-3',
        default: 'space-y-4 p-4',
        lg: 'space-y-6 p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormConditionalProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formConditionalVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  rules: ConditionalRule[];
  fields: ConditionalField[];
  onRulesChange?: (rules: ConditionalRule[]) => void;
  onRuleAdd?: (rule: ConditionalRule) => void;
  onRuleUpdate?: (ruleId: string, updates: Partial<ConditionalRule>) => void;
  onRuleDelete?: (ruleId: string) => void;
  onRuleDuplicate?: (ruleId: string) => void;
  onRuleTest?: (rule: ConditionalRule) => void;
  onRuleEnable?: (ruleId: string) => void;
  onRuleDisable?: (ruleId: string) => void;
  showBuilder?: boolean;
  showPreview?: boolean;
  showTestMode?: boolean;
  testData?: Record<string, any>;
  children?: React.ReactNode;
}

export interface ConditionalRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  conditions: ConditionalCondition[];
  actions: ConditionalAction[];
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

export interface ConditionalCondition {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'greater_equal' | 'less_equal' | 'is_empty' | 'is_not_empty' | 'is_checked' | 'is_not_checked';
  value?: any;
  valueType?: 'string' | 'number' | 'boolean' | 'date' | 'array';
  logicalOperator?: 'AND' | 'OR';
}

export interface ConditionalAction {
  id: string;
  type: 'show' | 'hide' | 'enable' | 'disable' | 'require' | 'optional' | 'set_value' | 'clear_value' | 'set_style' | 'add_class' | 'remove_class';
  targetFieldId: string;
  value?: any;
  style?: React.CSSProperties;
  className?: string;
  message?: string;
}

export interface ConditionalField {
  id: string;
  name: string;
  type: string;
  label: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface FormConditionalRuleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formConditionalRuleVariants> {
  variant?: 'default' | 'active' | 'error' | 'warning' | 'success';
  size?: 'sm' | 'default' | 'lg';
  rule: ConditionalRule;
  fields: ConditionalField[];
  onUpdate?: (updates: Partial<ConditionalRule>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onTest?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export interface FormConditionalBuilderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formConditionalBuilderVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  fields: ConditionalField[];
  onRuleCreate?: (rule: Omit<ConditionalRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTestDataChange?: (data: Record<string, any>) => void;
  testData?: Record<string, any>;
  showTestMode?: boolean;
}

const FormConditionalRule = React.forwardRef<
  HTMLDivElement,
  FormConditionalRuleProps
>(({ 
  className, 
  variant, 
  size, 
  rule, 
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
  const [editName, setEditName] = React.useState(rule.name);

  const getRuleVariant = () => {
    if (rule.testResult === 'error') return 'error';
    if (rule.testResult === 'fail') return 'warning';
    if (rule.testResult === 'pass') return 'success';
    if (rule.enabled) return 'active';
    return variant || 'default';
  };

  const handleNameSave = () => {
    if (editName !== rule.name) {
      onUpdate?.({ name: editName });
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(rule.name);
      setIsEditing(false);
    }
  };

  const getTestResultIcon = () => {
    switch (rule.testResult) {
      case 'pass':
        return <CheckIcon className="h-4 w-4 text-atlas-success-main" />;
      case 'fail':
        return <XIcon className="h-4 w-4 text-atlas-warning-main" />;
      case 'error':
        return <AlertCircleIcon className="h-4 w-4 text-atlas-error-main" />;
      default:
        return null;
    }
  };

  const getFieldName = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    return field?.label || fieldId;
  };

  return (
    <div
      ref={ref}
      className={cn(formConditionalRuleVariants({ variant: getRuleVariant(), size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex-shrink-0 p-1 hover:bg-atlas-border-subtle rounded transition-colors"
            aria-label={isExpanded ? 'Collapse rule' : 'Expand rule'}
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
                {rule.name}
              </button>
            )}
            
            {rule.description && (
              <span className="text-xs text-atlas-text-tertiary truncate">
                {rule.description}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getTestResultIcon()}
            
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full',
                rule.enabled ? 'bg-atlas-success-main' : 'bg-atlas-text-tertiary'
              )} />
              <span className="text-xs text-atlas-text-tertiary">
                {rule.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <span className="text-xs text-atlas-text-tertiary">
              Priority: {rule.priority}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <button
              type="button"
              onClick={rule.enabled ? onDisable : onEnable}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
            >
              {rule.enabled ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              type="button"
              onClick={onTest}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Test rule"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Duplicate rule"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDelete}
              className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
              aria-label="Delete rule"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
              Conditions
            </h4>
            <div className="space-y-2">
              {rule.conditions.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                  {index > 0 && (
                    <span className="text-xs font-medium text-atlas-text-tertiary px-2 py-1 bg-atlas-card-bg rounded">
                      {condition.logicalOperator || 'AND'}
                    </span>
                  )}
                  <span className="text-sm text-atlas-text-primary">
                    {getFieldName(condition.fieldId)}
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
              {rule.actions.map(action => (
                <div key={action.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                  <span className="text-sm font-medium text-atlas-text-secondary">
                    {action.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-atlas-text-primary">
                    {getFieldName(action.targetFieldId)}
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
          
          {rule.lastTested && (
            <div className="text-xs text-atlas-text-tertiary">
              Last tested: {rule.lastTested.toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
});
FormConditionalRule.displayName = 'FormConditionalRule';

const FormConditionalBuilder = React.forwardRef<
  HTMLDivElement,
  FormConditionalBuilderProps
>(({ 
  className, 
  variant, 
  size, 
  fields, 
  onRuleCreate, 
  onTestDataChange, 
  testData = {}, 
  showTestMode = false, 
  ...props 
}, ref) => {
  const [newRule, setNewRule] = React.useState<Partial<ConditionalRule>>({
    name: '',
    description: '',
    enabled: true,
    conditions: [],
    actions: [],
    priority: 1,
  });

  const handleAddCondition = () => {
    const condition: ConditionalCondition = {
      id: `condition-${Date.now()}`,
      fieldId: fields[0]?.id || '',
      operator: 'equals',
      value: '',
      valueType: 'string',
    };
    
    setNewRule(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), condition],
    }));
  };

  const handleAddAction = () => {
    const action: ConditionalAction = {
      id: `action-${Date.now()}`,
      type: 'show',
      targetFieldId: fields[0]?.id || '',
    };
    
    setNewRule(prev => ({
      ...prev,
      actions: [...(prev.actions || []), action],
    }));
  };

  const handleCreateRule = () => {
    if (newRule.name && newRule.conditions?.length && newRule.actions?.length) {
      onRuleCreate?.(newRule as Omit<ConditionalRule, 'id' | 'createdAt' | 'updatedAt'>);
      setNewRule({
        name: '',
        description: '',
        enabled: true,
        conditions: [],
        actions: [],
        priority: 1,
      });
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formConditionalBuilderVariants({ variant, size, className }))}
      {...props}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-atlas-text-primary">
            Create New Rule
          </h3>
          <button
            type="button"
            onClick={handleCreateRule}
            disabled={!newRule.name || !newRule.conditions?.length || !newRule.actions?.length}
            className="inline-flex items-center gap-2 px-3 py-1 bg-atlas-primary-main text-white text-sm rounded-md hover:bg-atlas-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
            Create Rule
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Rule name"
              value={newRule.name || ''}
              onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              className="px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary placeholder-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRule.description || ''}
              onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
              className="px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary placeholder-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-atlas-text-primary">
                Conditions
              </h4>
              <button
                type="button"
                onClick={handleAddCondition}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-atlas-border-subtle text-atlas-text-primary rounded hover:bg-atlas-border transition-colors"
              >
                <PlusIcon className="h-3 w-3" />
                Add Condition
              </button>
            </div>
            
            <div className="space-y-2">
              {newRule.conditions?.map((condition, index) => (
                <div key={condition.id} className="flex items-center gap-2 p-2 border border-atlas-border rounded">
                  {index > 0 && (
                    <select
                      value={condition.logicalOperator || 'AND'}
                      onChange={(e) => {
                        const updatedConditions = [...(newRule.conditions || [])];
                        updatedConditions[index] = { ...condition, logicalOperator: e.target.value as 'AND' | 'OR' };
                        setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                      }}
                      className="text-xs px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  )}
                  
                  <select
                    value={condition.fieldId}
                    onChange={(e) => {
                      const updatedConditions = [...(newRule.conditions || [])];
                      updatedConditions[index] = { ...condition, fieldId: e.target.value };
                      setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                    }}
                    className="text-sm px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg"
                  >
                    {fields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={condition.operator}
                    onChange={(e) => {
                      const updatedConditions = [...(newRule.conditions || [])];
                      updatedConditions[index] = { ...condition, operator: e.target.value as any };
                      setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                    }}
                    className="text-sm px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg"
                  >
                    <option value="equals">Equals</option>
                    <option value="not_equals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="not_contains">Not Contains</option>
                    <option value="is_empty">Is Empty</option>
                    <option value="is_not_empty">Is Not Empty</option>
                    <option value="is_checked">Is Checked</option>
                    <option value="is_not_checked">Is Not Checked</option>
                  </select>
                  
                  {!['is_empty', 'is_not_empty', 'is_checked', 'is_not_checked'].includes(condition.operator) && (
                    <input
                      type="text"
                      placeholder="Value"
                      value={condition.value || ''}
                      onChange={(e) => {
                        const updatedConditions = [...(newRule.conditions || [])];
                        updatedConditions[index] = { ...condition, value: e.target.value };
                        setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                      }}
                      className="text-sm px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg flex-1"
                    />
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const updatedConditions = (newRule.conditions || []).filter(c => c.id !== condition.id);
                      setNewRule(prev => ({ ...prev, conditions: updatedConditions }));
                    }}
                    className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-atlas-text-primary">
                Actions
              </h4>
              <button
                type="button"
                onClick={handleAddAction}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-atlas-border-subtle text-atlas-text-primary rounded hover:bg-atlas-border transition-colors"
              >
                <PlusIcon className="h-3 w-3" />
                Add Action
              </button>
            </div>
            
            <div className="space-y-2">
              {newRule.actions?.map(action => (
                <div key={action.id} className="flex items-center gap-2 p-2 border border-atlas-border rounded">
                  <select
                    value={action.type}
                    onChange={(e) => {
                      const updatedActions = [...(newRule.actions || [])];
                      const actionIndex = updatedActions.findIndex(a => a.id === action.id);
                      updatedActions[actionIndex] = { ...action, type: e.target.value as any };
                      setNewRule(prev => ({ ...prev, actions: updatedActions }));
                    }}
                    className="text-sm px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg"
                  >
                    <option value="show">Show</option>
                    <option value="hide">Hide</option>
                    <option value="enable">Enable</option>
                    <option value="disable">Disable</option>
                    <option value="require">Require</option>
                    <option value="optional">Make Optional</option>
                    <option value="set_value">Set Value</option>
                    <option value="clear_value">Clear Value</option>
                  </select>
                  
                  <select
                    value={action.targetFieldId}
                    onChange={(e) => {
                      const updatedActions = [...(newRule.actions || [])];
                      const actionIndex = updatedActions.findIndex(a => a.id === action.id);
                      updatedActions[actionIndex] = { ...action, targetFieldId: e.target.value };
                      setNewRule(prev => ({ ...prev, actions: updatedActions }));
                    }}
                    className="text-sm px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg"
                  >
                    {fields.map(field => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                  
                  {['set_value'].includes(action.type) && (
                    <input
                      type="text"
                      placeholder="Value"
                      value={action.value || ''}
                      onChange={(e) => {
                        const updatedActions = [...(newRule.actions || [])];
                        const actionIndex = updatedActions.findIndex(a => a.id === action.id);
                        updatedActions[actionIndex] = { ...action, value: e.target.value };
                        setNewRule(prev => ({ ...prev, actions: updatedActions }));
                      }}
                      className="text-sm px-2 py-1 border border-atlas-border rounded bg-atlas-card-bg flex-1"
                    />
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const updatedActions = (newRule.actions || []).filter(a => a.id !== action.id);
                      setNewRule(prev => ({ ...prev, actions: updatedActions }));
                    }}
                    className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
FormConditionalBuilder.displayName = 'FormConditionalBuilder';

const FormConditional = React.forwardRef<
  HTMLDivElement,
  FormConditionalProps
>(({
  className,
  variant,
  size,
  rules,
  fields,
  onRulesChange,
  onRuleAdd,
  onRuleUpdate,
  onRuleDelete,
  onRuleDuplicate,
  onRuleTest,
  onRuleEnable,
  onRuleDisable,
  showBuilder = true,
  showPreview = true,
  showTestMode = false,
  testData = {},
  children,
  ...props
}, ref) => {
  const [expandedRules, setExpandedRules] = React.useState<Set<string>>(new Set());
  const [isTestMode, setIsTestMode] = React.useState(false);

  const handleRuleToggle = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  const handleRuleCreate = (ruleData: Omit<ConditionalRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRule: ConditionalRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onRuleAdd?.(newRule);
  };

  const handleRuleUpdate = (ruleId: string, updates: Partial<ConditionalRule>) => {
    const updatedRule = {
      ...updates,
      updatedAt: new Date(),
    };
    onRuleUpdate?.(ruleId, updatedRule);
  };

  const sortedRules = [...rules].sort((a, b) => b.priority - a.priority);

  return (
    <div
      ref={ref}
      className={cn(formConditionalVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Conditional Logic
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {rules.length} rule{rules.length !== 1 ? 's' : ''} configured
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
        </div>
      </div>

      {showBuilder && (
        <FormConditionalBuilder
          variant="outlined"
          size={size}
          fields={fields}
          onRuleCreate={handleRuleCreate}
          testData={testData}
          showTestMode={showTestMode}
        />
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          Rules ({rules.length})
        </h3>
        
        {sortedRules.length === 0 ? (
          <div className="text-center py-8">
            <LayersIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-atlas-text-primary mb-2">
              No rules configured
            </h3>
            <p className="text-sm text-atlas-text-secondary mb-4">
              Create your first conditional rule to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedRules.map(rule => (
              <FormConditionalRule
                key={rule.id}
                variant="default"
                size={size}
                rule={rule}
                fields={fields}
                onUpdate={(updates) => handleRuleUpdate(rule.id, updates)}
                onDelete={() => onRuleDelete?.(rule.id)}
                onDuplicate={() => onRuleDuplicate?.(rule.id)}
                onTest={() => onRuleTest?.(rule)}
                onEnable={() => onRuleEnable?.(rule.id)}
                onDisable={() => onRuleDisable?.(rule.id)}
                isExpanded={expandedRules.has(rule.id)}
                onToggleExpanded={() => handleRuleToggle(rule.id)}
              />
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
});
FormConditional.displayName = 'FormConditional';

// Additional utility components
const FormConditionalContainer = React.forwardRef<
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
FormConditionalContainer.displayName = 'FormConditionalContainer';

const FormConditionalSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    ruleCount?: number;
  }
>(({ className, size = 'default', ruleCount = 3, ...props }, ref) => {
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
        <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: ruleCount }).map((_, index) => (
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
FormConditionalSkeleton.displayName = 'FormConditionalSkeleton';

export {
  FormConditional,
  FormConditionalRule,
  FormConditionalBuilder,
  FormConditionalContainer,
  FormConditionalSkeleton,
  formConditionalVariants,
  formConditionalRuleVariants,
  formConditionalBuilderVariants,
};
