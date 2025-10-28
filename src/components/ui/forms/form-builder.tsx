import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  CopyIcon, 
  MoveIcon,
  SettingsIcon,
  EyeIcon,
  CodeIcon,
  SaveIcon,
  UndoIcon,
  RedoIcon,
  DownloadIcon,
  UploadIcon,
  GridIcon,
  ListIcon,
  LayersIcon
} from 'lucide-react';

const formBuilderVariants = cva(
  'w-full h-full flex flex-col',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border border-atlas-border rounded-lg bg-atlas-card-bg',
        ghost: 'bg-atlas-border-subtle rounded-lg',
        minimal: '',
        card: 'border border-atlas-border rounded-lg bg-atlas-card-bg shadow-sm',
        elevated: 'border border-atlas-border rounded-lg bg-atlas-card-bg shadow-md',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
      layout: {
        default: 'flex-col',
        sidebar: 'flex-row',
        split: 'flex-row',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      layout: 'default',
    },
  }
);

const formBuilderToolbarVariants = cva(
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

const formBuilderSidebarVariants = cva(
  'w-80 border-r border-atlas-border bg-atlas-card-bg overflow-y-auto',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg',
        outlined: 'bg-atlas-border-subtle',
        ghost: 'bg-transparent',
        minimal: 'bg-atlas-card-bg',
      },
      size: {
        sm: 'w-64',
        default: 'w-80',
        lg: 'w-96',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formBuilderCanvasVariants = cva(
  'flex-1 p-6 bg-atlas-card-bg overflow-y-auto',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg',
        outlined: 'bg-atlas-border-subtle',
        ghost: 'bg-transparent',
        minimal: 'bg-atlas-card-bg',
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formBuilderFieldVariants = cva(
  'border border-atlas-border rounded-lg bg-atlas-card-bg p-4 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-atlas-border bg-atlas-card-bg',
        outlined: 'border-2 border-atlas-primary-main bg-atlas-card-bg',
        ghost: 'border-transparent bg-transparent',
        minimal: 'border-atlas-border-subtle bg-atlas-border-subtle',
        selected: 'border-atlas-primary-main bg-atlas-primary-lighter',
        hover: 'border-atlas-primary-main bg-atlas-primary-lighter/50',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
      state: {
        default: '',
        selected: 'ring-2 ring-atlas-primary-main',
        hover: 'hover:border-atlas-primary-main',
        disabled: 'opacity-50 cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      state: 'default',
    },
  }
);

const formBuilderFieldToolbarVariants = cva(
  'flex items-center justify-between mb-2',
  {
    variants: {
      variant: {
        default: '',
        outlined: 'border-b border-atlas-border pb-2',
        ghost: '',
        minimal: 'bg-atlas-border-subtle rounded p-2',
      },
      size: {
        sm: 'text-xs',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const formBuilderFieldActionsVariants = cva(
  'flex items-center gap-1',
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

const formBuilderFieldActionVariants = cva(
  'inline-flex items-center justify-center rounded-md p-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atlas-primary-main focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        destructive: 'hover:bg-atlas-error-main hover:text-white',
        ghost: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
        minimal: 'hover:bg-atlas-border-subtle hover:text-atlas-text-primary',
      },
      size: {
        sm: 'h-6 w-6 text-xs',
        default: 'h-8 w-8 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface FormBuilderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formBuilderVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  layout?: 'default' | 'sidebar' | 'split';
  fields: FormBuilderField[];
  onFieldsChange?: (fields: FormBuilderField[]) => void;
  onFieldAdd?: (field: FormBuilderField) => void;
  onFieldRemove?: (fieldId: string) => void;
  onFieldUpdate?: (fieldId: string, updates: Partial<FormBuilderField>) => void;
  onFieldMove?: (fieldId: string, newIndex: number) => void;
  onFieldDuplicate?: (fieldId: string) => void;
  selectedFieldId?: string;
  onFieldSelect?: (fieldId: string) => void;
  showToolbar?: boolean;
  showSidebar?: boolean;
  showCanvas?: boolean;
  mode?: 'design' | 'preview' | 'code';
  onModeChange?: (mode: 'design' | 'preview' | 'code') => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onImport?: (data: any) => void;
  children?: React.ReactNode;
}

export interface FormBuilderField {
  id: string;
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime' | 'file' | 'range' | 'color';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: string;
  };
  options?: Array<{ label: string; value: string }>;
  defaultValue?: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: React.CSSProperties;
}

export interface FormBuilderToolbarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formBuilderToolbarVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  mode?: 'design' | 'preview' | 'code';
  onModeChange?: (mode: 'design' | 'preview' | 'code') => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onImport?: (data: any) => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaving?: boolean;
}

export interface FormBuilderSidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formBuilderSidebarVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  fields: FormBuilderField[];
  onFieldAdd?: (field: FormBuilderField) => void;
  onFieldSelect?: (fieldId: string) => void;
  selectedFieldId?: string;
}

export interface FormBuilderCanvasProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formBuilderCanvasVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  fields: FormBuilderField[];
  onFieldSelect?: (fieldId: string) => void;
  onFieldMove?: (fieldId: string, newIndex: number) => void;
  selectedFieldId?: string;
  mode?: 'design' | 'preview' | 'code';
}

export interface FormBuilderFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formBuilderFieldVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'selected' | 'hover';
  size?: 'sm' | 'default' | 'lg';
  state?: 'default' | 'selected' | 'hover' | 'disabled';
  field: FormBuilderField;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onMove?: (direction: 'up' | 'down') => void;
  mode?: 'design' | 'preview' | 'code';
}

const FormBuilderField = React.forwardRef<
  HTMLDivElement,
  FormBuilderFieldProps
>(({ 
  className, 
  variant, 
  size, 
  state, 
  field, 
  isSelected, 
  isHovered, 
  onSelect, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onMove, 
  mode = 'design', 
  ...props 
}, ref) => {
  const getFieldState = () => {
    if (isSelected) return 'selected';
    if (isHovered) return 'hover';
    return 'default';
  };

  const renderFieldPreview = () => {
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
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="w-full p-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary"
          />
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            disabled={field.disabled}
            className="w-full p-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary"
            rows={3}
          />
        );
      case 'select':
        return (
          <select
            disabled={field.disabled}
            className="w-full p-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary"
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
              disabled={field.disabled}
              className="rounded border-atlas-border"
            />
            <span className="text-sm text-atlas-text-primary">{field.label}</span>
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
                  disabled={field.disabled}
                  className="border-atlas-border"
                />
                <span className="text-sm text-atlas-text-primary">{option.label}</span>
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
            disabled={field.disabled}
            className="w-full p-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary"
          />
        );
      case 'file':
        return (
          <input
            type="file"
            disabled={field.disabled}
            className="w-full p-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary"
          />
        );
      case 'range':
        return (
          <input
            type="range"
            min={field.validation?.min}
            max={field.validation?.max}
            disabled={field.disabled}
            className="w-full"
          />
        );
      case 'color':
        return (
          <input
            type="color"
            disabled={field.disabled}
            className="w-full h-10 border border-atlas-border rounded-md"
          />
        );
      default:
        return (
          <div className="w-full p-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary">
            {field.type} field
          </div>
        );
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formBuilderFieldVariants({ variant, size, state: getFieldState(), className }))}
      onClick={onSelect}
      onMouseEnter={() => {}}
      onMouseLeave={() => {}}
      {...props}
    >
      {mode === 'design' && (
        <div className={cn(formBuilderFieldToolbarVariants({ variant: 'minimal', size }))}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-atlas-text-primary">
              {field.label}
            </span>
            <span className="text-xs text-atlas-text-tertiary">
              ({field.type})
            </span>
            {field.required && (
              <span className="text-xs text-atlas-error-main">*</span>
            )}
          </div>
          
          <div className={cn(formBuilderFieldActionsVariants({ size }))}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className={cn(formBuilderFieldActionVariants({ variant: 'default', size }))}
              aria-label="Edit field"
            >
              <EditIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate?.();
              }}
              className={cn(formBuilderFieldActionVariants({ variant: 'default', size }))}
              aria-label="Duplicate field"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove?.('up');
              }}
              className={cn(formBuilderFieldActionVariants({ variant: 'default', size }))}
              aria-label="Move field up"
            >
              <MoveIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className={cn(formBuilderFieldActionVariants({ variant: 'destructive', size }))}
              aria-label="Delete field"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {mode === 'design' && (
          <label className="block text-sm font-medium text-atlas-text-primary">
            {field.label}
            {field.required && (
              <span className="text-atlas-error-main ml-1">*</span>
            )}
          </label>
        )}
        
        {renderFieldPreview()}
        
        {field.description && (
          <p className="text-xs text-atlas-text-secondary">
            {field.description}
          </p>
        )}
      </div>
    </div>
  );
});
FormBuilderField.displayName = 'FormBuilderField';

const FormBuilderToolbar = React.forwardRef<
  HTMLDivElement,
  FormBuilderToolbarProps
>(({ 
  className, 
  variant, 
  size, 
  mode, 
  onModeChange, 
  onSave, 
  onUndo, 
  onRedo, 
  onExport, 
  onImport, 
  canUndo = false, 
  canRedo = false, 
  isSaving = false, 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(formBuilderToolbarVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onModeChange?.('design')}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              mode === 'design' 
                ? 'bg-atlas-primary-main text-white' 
                : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
            )}
          >
            <GridIcon className="h-4 w-4 mr-1" />
            Design
          </button>
          
          <button
            type="button"
            onClick={() => onModeChange?.('preview')}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              mode === 'preview' 
                ? 'bg-atlas-primary-main text-white' 
                : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
            )}
          >
            <EyeIcon className="h-4 w-4 mr-1" />
            Preview
          </button>
          
          <button
            type="button"
            onClick={() => onModeChange?.('code')}
            className={cn(
              'px-3 py-1 text-sm rounded-md transition-colors',
              mode === 'code' 
                ? 'bg-atlas-primary-main text-white' 
                : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
            )}
          >
            <CodeIcon className="h-4 w-4 mr-1" />
            Code
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors disabled:opacity-50"
          aria-label="Undo"
        >
          <UndoIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors disabled:opacity-50"
          aria-label="Redo"
        >
          <RedoIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors disabled:opacity-50"
          aria-label="Save"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-atlas-text-primary" />
          ) : (
            <SaveIcon className="h-4 w-4" />
          )}
        </button>
        
        <button
          type="button"
          onClick={onExport}
          className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
          aria-label="Export"
        >
          <DownloadIcon className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => onImport?.(null)}
          className="p-2 hover:bg-atlas-border-subtle rounded-md transition-colors"
          aria-label="Import"
        >
          <UploadIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});
FormBuilderToolbar.displayName = 'FormBuilderToolbar';

const FormBuilderSidebar = React.forwardRef<
  HTMLDivElement,
  FormBuilderSidebarProps
>(({ 
  className, 
  variant, 
  size, 
  fields, 
  onFieldAdd, 
  onFieldSelect, 
  selectedFieldId, 
  ...props 
}, ref) => {
  const fieldTypes = [
    { type: 'text', label: 'Text Input', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'email', label: 'Email', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'password', label: 'Password', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'number', label: 'Number', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'textarea', label: 'Textarea', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'select', label: 'Select', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'checkbox', label: 'Checkbox', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'radio', label: 'Radio', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'date', label: 'Date', icon: <EditIcon className="h-4 w-4" /> },
    { type: 'file', label: 'File', icon: <EditIcon className="h-4 w-4" /> },
  ];

  const handleFieldAdd = (fieldType: string) => {
    const newField: FormBuilderField = {
      id: `field-${Date.now()}`,
      type: fieldType as any,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      placeholder: `Enter ${fieldType}...`,
      required: false,
      disabled: false,
      position: { x: 0, y: fields.length * 100 },
      size: { width: 300, height: 80 },
    };
    onFieldAdd?.(newField);
  };

  return (
    <div
      ref={ref}
      className={cn(formBuilderSidebarVariants({ variant, size, className }))}
      {...props}
    >
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-atlas-text-primary mb-2">
            Field Types
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {fieldTypes.map(fieldType => (
              <button
                key={fieldType.type}
                type="button"
                onClick={() => handleFieldAdd(fieldType.type)}
                className="flex items-center gap-2 p-2 border border-atlas-border rounded-md hover:bg-atlas-border-subtle transition-colors"
              >
                {fieldType.icon}
                <span className="text-xs text-atlas-text-primary">
                  {fieldType.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-atlas-text-primary mb-2">
            Form Fields
          </h3>
          <div className="space-y-2">
            {fields.map(field => (
              <div
                key={field.id}
                onClick={() => onFieldSelect?.(field.id)}
                className={cn(
                  'p-2 border rounded-md cursor-pointer transition-colors',
                  selectedFieldId === field.id
                    ? 'border-atlas-primary-main bg-atlas-primary-lighter'
                    : 'border-atlas-border hover:bg-atlas-border-subtle'
                )}
              >
                <div className="text-sm font-medium text-atlas-text-primary">
                  {field.label}
                </div>
                <div className="text-xs text-atlas-text-tertiary">
                  {field.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
FormBuilderSidebar.displayName = 'FormBuilderSidebar';

const FormBuilderCanvas = React.forwardRef<
  HTMLDivElement,
  FormBuilderCanvasProps
>(({ 
  className, 
  variant, 
  size, 
  fields, 
  onFieldSelect, 
  onFieldMove, 
  selectedFieldId, 
  mode = 'design', 
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(formBuilderCanvasVariants({ variant, size, className }))}
      {...props}
    >
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-atlas-border rounded-lg">
            <div className="text-center">
              <LayersIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
              <p className="text-sm text-atlas-text-tertiary">
                Drag fields from the sidebar to start building your form
              </p>
            </div>
          </div>
        ) : (
          fields.map((field, index) => (
            <FormBuilderField
              key={field.id}
              field={field}
              isSelected={selectedFieldId === field.id}
              onSelect={() => onFieldSelect?.(field.id)}
              onEdit={() => {}}
              onDelete={() => {}}
              onDuplicate={() => {}}
              onMove={(direction) => {
                const newIndex = direction === 'up' ? index - 1 : index + 1;
                onFieldMove?.(field.id, newIndex);
              }}
              mode={mode}
            />
          ))
        )}
      </div>
    </div>
  );
});
FormBuilderCanvas.displayName = 'FormBuilderCanvas';

const FormBuilder = React.forwardRef<
  HTMLDivElement,
  FormBuilderProps
>(({
  className,
  variant,
  size,
  layout,
  fields,
  onFieldsChange,
  onFieldAdd,
  onFieldRemove,
  onFieldUpdate,
  onFieldMove,
  onFieldDuplicate,
  selectedFieldId,
  onFieldSelect,
  showToolbar = true,
  showSidebar = true,
  showCanvas = true,
  mode = 'design',
  onModeChange,
  onSave,
  onUndo,
  onRedo,
  onExport,
  onImport,
  children,
  ...props
}, ref) => {
  const [currentMode, setCurrentMode] = React.useState(mode);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  const handleModeChange = React.useCallback((newMode: 'design' | 'preview' | 'code') => {
    setCurrentMode(newMode);
    onModeChange?.(newMode);
  }, [onModeChange]);

  const handleSave = React.useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave?.();
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  return (
    <div
      ref={ref}
      className={cn(formBuilderVariants({ variant, size, layout, className }))}
      {...props}
    >
      {showToolbar && (
        <FormBuilderToolbar
          variant={variant}
          size={size}
          mode={currentMode}
          onModeChange={handleModeChange}
          onSave={handleSave}
          onUndo={onUndo}
          onRedo={onRedo}
          onExport={onExport}
          onImport={onImport}
          isSaving={isSaving}
        />
      )}
      
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && layout !== 'default' && (
          <FormBuilderSidebar
            variant={variant}
            size={size}
            fields={fields}
            onFieldAdd={onFieldAdd}
            onFieldSelect={onFieldSelect}
            selectedFieldId={selectedFieldId}
          />
        )}
        
        {showCanvas && (
          <FormBuilderCanvas
            variant={variant}
            size={size}
            fields={fields}
            onFieldSelect={onFieldSelect}
            onFieldMove={onFieldMove}
            selectedFieldId={selectedFieldId}
            mode={currentMode}
          />
        )}
      </div>
      
      {children}
    </div>
  );
});
FormBuilder.displayName = 'FormBuilder';

// Additional utility components for advanced form builder functionality
const FormBuilderContainer = React.forwardRef<
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
FormBuilderContainer.displayName = 'FormBuilderContainer';

const FormBuilderSkeleton = React.forwardRef<
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
        <div className="flex items-center gap-2">
          <div className="h-8 w-16 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-16 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-16 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-8 w-8 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      
      <div className="flex flex-1">
        <div className="w-80 border-r border-atlas-border p-4">
          <div className="space-y-4">
            <div className="h-4 w-24 bg-atlas-border-subtle rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-16 bg-atlas-border-subtle rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {Array.from({ length: fieldCount }).map((_, index) => (
              <div key={index} className="h-24 bg-atlas-border-subtle rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
FormBuilderSkeleton.displayName = 'FormBuilderSkeleton';

export {
  FormBuilder,
  FormBuilderToolbar,
  FormBuilderSidebar,
  FormBuilderCanvas,
  FormBuilderField,
  FormBuilderContainer,
  FormBuilderSkeleton,
  formBuilderVariants,
  formBuilderToolbarVariants,
  formBuilderSidebarVariants,
  formBuilderCanvasVariants,
  formBuilderFieldVariants,
  formBuilderFieldToolbarVariants,
  formBuilderFieldActionsVariants,
  formBuilderFieldActionVariants,
};
