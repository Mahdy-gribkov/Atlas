import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  DownloadIcon, 
  UploadIcon, 
  FileIcon, 
  FileTextIcon, 
  FileSpreadsheetIcon, 
  FileJsonIcon, 
  FileXmlIcon, 
  FileCsvIcon, 
  FilePdfIcon, 
  FileImageIcon, 
  CalendarIcon, 
  ClockIcon, 
  SettingsIcon, 
  PlayIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  AlertTriangleIcon, 
  RefreshIcon, 
  SaveIcon, 
  UndoIcon, 
  RedoIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ZapIcon, 
  TargetIcon, 
  FilterIcon, 
  SearchIcon, 
  PlusIcon, 
  TrashIcon, 
  EditIcon, 
  CopyIcon, 
  ShareIcon, 
  ExternalLinkIcon, 
  InfoIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  DatabaseIcon,
  CloudIcon,
  MailIcon,
  MessageSquareIcon,
  UserIcon,
  UsersIcon,
  GlobeIcon,
  LockIcon,
  UnlockIcon,
  KeyIcon,
  ShieldIcon
} from 'lucide-react';

const formExportVariants = cva(
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

const formExportJobVariants = cva(
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

const formExportConfigVariants = cva(
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

export interface FormExportProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formExportVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  exports: ExportJob[];
  onExportsChange?: (exports: ExportJob[]) => void;
  onExportAdd?: (exportJob: ExportJob) => void;
  onExportUpdate?: (exportId: string, updates: Partial<ExportJob>) => void;
  onExportDelete?: (exportId: string) => void;
  onExportDuplicate?: (exportId: string) => void;
  onExportRun?: (exportJob: ExportJob) => void;
  onExportSchedule?: (exportId: string, schedule: ExportSchedule) => void;
  onExportEnable?: (exportId: string) => void;
  onExportDisable?: (exportId: string) => void;
  showBuilder?: boolean;
  showScheduler?: boolean;
  showHistory?: boolean;
  children?: React.ReactNode;
}

export interface ExportJob {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  format: 'csv' | 'xlsx' | 'json' | 'xml' | 'pdf' | 'html' | 'txt';
  template?: string;
  filters: ExportFilter[];
  transformations: ExportTransformation[];
  schedule?: ExportSchedule;
  destination: ExportDestination;
  status: 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress?: number;
  lastRun?: Date;
  nextRun?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    tags?: string[];
    category?: string;
    author?: string;
    version?: string;
  };
}

export interface ExportFilter {
  id: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'between' | 'is_empty' | 'is_not_empty';
  value?: any;
  value2?: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface ExportTransformation {
  id: string;
  type: 'rename' | 'format' | 'calculate' | 'concat' | 'split' | 'replace' | 'custom';
  sourceField: string;
  targetField: string;
  parameters?: Record<string, any>;
}

export interface ExportSchedule {
  enabled: boolean;
  frequency: 'once' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';
  interval?: number;
  time?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  timezone?: string;
}

export interface ExportDestination {
  type: 'download' | 'email' | 'ftp' | 'sftp' | 'cloud' | 'api' | 'webhook';
  config: {
    email?: string;
    subject?: string;
    body?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    path?: string;
    url?: string;
    headers?: Record<string, string>;
    authentication?: {
      type: 'none' | 'basic' | 'bearer' | 'api_key';
      credentials?: Record<string, string>;
    };
  };
}

export interface FormExportJobProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formExportJobVariants> {
  variant?: 'default' | 'active' | 'error' | 'warning' | 'success' | 'disabled';
  size?: 'sm' | 'default' | 'lg';
  exportJob: ExportJob;
  onUpdate?: (updates: Partial<ExportJob>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onRun?: () => void;
  onSchedule?: (schedule: ExportSchedule) => void;
  onEnable?: () => void;
  onDisable?: () => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export interface FormExportConfigProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formExportConfigVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  exportJob: ExportJob;
  onUpdate?: (updates: Partial<ExportJob>) => void;
  onRun?: () => void;
  onSchedule?: (schedule: ExportSchedule) => void;
}

const FormExportConfig = React.forwardRef<
  HTMLDivElement,
  FormExportConfigProps
>(({ 
  className, 
  variant, 
  size, 
  exportJob, 
  onUpdate, 
  onRun, 
  onSchedule, 
  ...props 
}, ref) => {
  const getFormatIcon = () => {
    switch (exportJob.format) {
      case 'csv':
        return <FileCsvIcon className="h-4 w-4" />;
      case 'xlsx':
        return <FileSpreadsheetIcon className="h-4 w-4" />;
      case 'json':
        return <FileJsonIcon className="h-4 w-4" />;
      case 'xml':
        return <FileXmlIcon className="h-4 w-4" />;
      case 'pdf':
        return <FilePdfIcon className="h-4 w-4" />;
      case 'html':
        return <FileTextIcon className="h-4 w-4" />;
      case 'txt':
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  const getDestinationIcon = () => {
    switch (exportJob.destination.type) {
      case 'download':
        return <DownloadIcon className="h-4 w-4" />;
      case 'email':
        return <MailIcon className="h-4 w-4" />;
      case 'ftp':
      case 'sftp':
        return <CloudIcon className="h-4 w-4" />;
      case 'cloud':
        return <CloudIcon className="h-4 w-4" />;
      case 'api':
      case 'webhook':
        return <GlobeIcon className="h-4 w-4" />;
      default:
        return <DatabaseIcon className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formExportConfigVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getFormatIcon()}
          <span className="text-sm font-medium text-atlas-text-primary">
            {exportJob.name} Configuration
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRun}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-atlas-primary-main text-white rounded hover:bg-atlas-primary-light transition-colors"
          >
            <PlayIcon className="h-3 w-3" />
            Run Now
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Export Format
            </label>
            <select
              value={exportJob.format}
              onChange={(e) => onUpdate?.({ format: e.target.value as any })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
            >
              <option value="csv">CSV</option>
              <option value="xlsx">Excel (XLSX)</option>
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="pdf">PDF</option>
              <option value="html">HTML</option>
              <option value="txt">Text</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Destination
            </label>
            <select
              value={exportJob.destination.type}
              onChange={(e) => onUpdate?.({
                destination: {
                  ...exportJob.destination,
                  type: e.target.value as any,
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
            >
              <option value="download">Download</option>
              <option value="email">Email</option>
              <option value="ftp">FTP</option>
              <option value="sftp">SFTP</option>
              <option value="cloud">Cloud Storage</option>
              <option value="api">API</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>
        </div>
        
        {exportJob.destination.type === 'email' && (
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={exportJob.destination.config.email || ''}
              onChange={(e) => onUpdate?.({
                destination: {
                  ...exportJob.destination,
                  config: {
                    ...exportJob.destination.config,
                    email: e.target.value,
                  },
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              placeholder="recipient@example.com"
            />
          </div>
        )}
        
        {exportJob.destination.type === 'api' && (
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              API URL
            </label>
            <input
              type="url"
              value={exportJob.destination.config.url || ''}
              onChange={(e) => onUpdate?.({
                destination: {
                  ...exportJob.destination,
                  config: {
                    ...exportJob.destination.config,
                    url: e.target.value,
                  },
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              placeholder="https://api.example.com/endpoint"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-atlas-text-primary mb-1">
            Filters
          </label>
          <div className="space-y-2">
            {exportJob.filters.map(filter => (
              <div key={filter.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                <span className="text-sm text-atlas-text-primary">
                  {filter.field}
                </span>
                <span className="text-sm font-medium text-atlas-text-secondary">
                  {filter.operator.replace('_', ' ')}
                </span>
                {filter.value !== undefined && (
                  <span className="text-sm text-atlas-text-primary">
                    {typeof filter.value === 'string' ? `"${filter.value}"` : String(filter.value)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-atlas-text-primary mb-1">
            Transformations
          </label>
          <div className="space-y-2">
            {exportJob.transformations.map(transformation => (
              <div key={transformation.id} className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
                <span className="text-sm font-medium text-atlas-text-secondary">
                  {transformation.type}
                </span>
                <span className="text-sm text-atlas-text-primary">
                  {transformation.sourceField} → {transformation.targetField}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {exportJob.schedule && (
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Schedule
            </label>
            <div className="flex items-center gap-2 p-2 bg-atlas-border-subtle rounded">
              <CalendarIcon className="h-4 w-4 text-atlas-text-tertiary" />
              <span className="text-sm text-atlas-text-primary">
                {exportJob.schedule.frequency} at {exportJob.schedule.time || 'any time'}
              </span>
              {exportJob.nextRun && (
                <span className="text-xs text-atlas-text-tertiary">
                  Next: {exportJob.nextRun.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}
        
        {exportJob.status === 'running' && exportJob.progress !== undefined && (
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Progress
            </label>
            <div className="w-full bg-atlas-border-subtle rounded-full h-2">
              <div
                className="bg-atlas-primary-main h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportJob.progress}%` }}
              />
            </div>
            <div className="text-xs text-atlas-text-tertiary mt-1">
              {exportJob.progress}% complete
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
FormExportConfig.displayName = 'FormExportConfig';

const FormExportJob = React.forwardRef<
  HTMLDivElement,
  FormExportJobProps
>(({ 
  className, 
  variant, 
  size, 
  exportJob, 
  onUpdate, 
  onDelete, 
  onDuplicate, 
  onRun, 
  onSchedule, 
  onEnable, 
  onDisable, 
  showActions = true, 
  isExpanded = false, 
  onToggleExpanded, 
  ...props 
}, ref) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(exportJob.name);

  const getExportVariant = () => {
    if (exportJob.status === 'failed') return 'error';
    if (exportJob.status === 'running') return 'active';
    if (exportJob.status === 'completed') return 'success';
    if (!exportJob.enabled) return 'disabled';
    return variant || 'default';
  };

  const handleNameSave = () => {
    if (editName !== exportJob.name) {
      onUpdate?.({ name: editName });
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(exportJob.name);
      setIsEditing(false);
    }
  };

  const getStatusIcon = () => {
    switch (exportJob.status) {
      case 'running':
        return <RefreshIcon className="h-4 w-4 text-atlas-primary-main animate-spin" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4 text-atlas-success-main" />;
      case 'failed':
        return <AlertCircleIcon className="h-4 w-4 text-atlas-error-main" />;
      case 'cancelled':
        return <AlertTriangleIcon className="h-4 w-4 text-atlas-warning-main" />;
      default:
        return <ClockIcon className="h-4 w-4 text-atlas-text-tertiary" />;
    }
  };

  const getFormatIcon = () => {
    switch (exportJob.format) {
      case 'csv':
        return <FileCsvIcon className="h-4 w-4" />;
      case 'xlsx':
        return <FileSpreadsheetIcon className="h-4 w-4" />;
      case 'json':
        return <FileJsonIcon className="h-4 w-4" />;
      case 'xml':
        return <FileXmlIcon className="h-4 w-4" />;
      case 'pdf':
        return <FilePdfIcon className="h-4 w-4" />;
      case 'html':
        return <FileTextIcon className="h-4 w-4" />;
      case 'txt':
        return <FileTextIcon className="h-4 w-4" />;
      default:
        return <FileIcon className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formExportJobVariants({ variant: getExportVariant(), size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex-shrink-0 p-1 hover:bg-atlas-border-subtle rounded transition-colors"
            aria-label={isExpanded ? 'Collapse export job' : 'Expand export job'}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getFormatIcon()}
            
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
                {exportJob.name}
              </button>
            )}
            
            {exportJob.description && (
              <span className="text-xs text-atlas-text-tertiary truncate">
                {exportJob.description}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full',
                exportJob.enabled ? 'bg-atlas-success-main' : 'bg-atlas-text-tertiary'
              )} />
              <span className="text-xs text-atlas-text-tertiary">
                {exportJob.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <span className="text-xs text-atlas-text-tertiary">
              {exportJob.format.toUpperCase()}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <button
              type="button"
              onClick={exportJob.enabled ? onDisable : onEnable}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label={exportJob.enabled ? 'Disable export job' : 'Enable export job'}
            >
              {exportJob.enabled ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              type="button"
              onClick={onRun}
              disabled={exportJob.status === 'running'}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors disabled:opacity-50"
              aria-label="Run export job"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Duplicate export job"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDelete}
              className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
              aria-label="Delete export job"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <FormExportConfig
            variant="outlined"
            size={size}
            exportJob={exportJob}
            onUpdate={onUpdate}
            onRun={onRun}
            onSchedule={onSchedule}
          />
        </div>
      )}
    </div>
  );
});
FormExportJob.displayName = 'FormExportJob';

const FormExport = React.forwardRef<
  HTMLDivElement,
  FormExportProps
>(({
  className,
  variant,
  size,
  exports,
  onExportsChange,
  onExportAdd,
  onExportUpdate,
  onExportDelete,
  onExportDuplicate,
  onExportRun,
  onExportSchedule,
  onExportEnable,
  onExportDisable,
  showBuilder = true,
  showScheduler = true,
  showHistory = true,
  children,
  ...props
}, ref) => {
  const [expandedExports, setExpandedExports] = React.useState<Set<string>>(new Set());

  const handleExportToggle = (exportId: string) => {
    const newExpanded = new Set(expandedExports);
    if (newExpanded.has(exportId)) {
      newExpanded.delete(exportId);
    } else {
      newExpanded.add(exportId);
    }
    setExpandedExports(newExpanded);
  };

  const handleExportUpdate = (exportId: string, updates: Partial<ExportJob>) => {
    const updatedExport = {
      ...updates,
      updatedAt: new Date(),
    };
    onExportUpdate?.(exportId, updatedExport);
  };

  const sortedExports = [...exports].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const exportFormats = [
    { format: 'csv', label: 'CSV', icon: <FileCsvIcon className="h-4 w-4" /> },
    { format: 'xlsx', label: 'Excel', icon: <FileSpreadsheetIcon className="h-4 w-4" /> },
    { format: 'json', label: 'JSON', icon: <FileJsonIcon className="h-4 w-4" /> },
    { format: 'xml', label: 'XML', icon: <FileXmlIcon className="h-4 w-4" /> },
    { format: 'pdf', label: 'PDF', icon: <FilePdfIcon className="h-4 w-4" /> },
    { format: 'html', label: 'HTML', icon: <FileTextIcon className="h-4 w-4" /> },
  ];

  return (
    <div
      ref={ref}
      className={cn(formExportVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Form Export
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {exports.length} export job{exports.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              onChange={(e) => {
                const format = e.target.value as any;
                onExportAdd?.({
                  id: `export-${Date.now()}`,
                  name: `New ${format.toUpperCase()} Export`,
                  enabled: true,
                  format,
                  filters: [],
                  transformations: [],
                  destination: {
                    type: 'download',
                    config: {},
                  },
                  status: 'idle',
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
                e.target.value = '';
              }}
              className="appearance-none bg-atlas-primary-main text-white px-4 py-2 pr-8 rounded-md hover:bg-atlas-primary-light transition-colors cursor-pointer"
            >
              <option value="">Add Export</option>
              {exportFormats.map(format => (
                <option key={format.format} value={format.format} className="bg-white text-atlas-text-primary">
                  {format.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          Export Jobs ({exports.length})
        </h3>
        
        {sortedExports.length === 0 ? (
          <div className="text-center py-8">
            <DownloadIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-atlas-text-primary mb-2">
              No export jobs configured
            </h3>
            <p className="text-sm text-atlas-text-secondary mb-4">
              Create export jobs to automatically export form data
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {exportFormats.slice(0, 4).map(format => (
                <button
                  key={format.format}
                  type="button"
                  onClick={() => onExportAdd?.({
                    id: `export-${Date.now()}`,
                    name: `New ${format.label} Export`,
                    enabled: true,
                    format: format.format as any,
                    filters: [],
                    transformations: [],
                    destination: {
                      type: 'download',
                      config: {},
                    },
                    status: 'idle',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-atlas-border rounded-md hover:bg-atlas-border-subtle transition-colors"
                >
                  {format.icon}
                  {format.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedExports.map(exportJob => (
              <FormExportJob
                key={exportJob.id}
                variant="default"
                size={size}
                exportJob={exportJob}
                onUpdate={(updates) => handleExportUpdate(exportJob.id, updates)}
                onDelete={() => onExportDelete?.(exportJob.id)}
                onDuplicate={() => onExportDuplicate?.(exportJob.id)}
                onRun={() => onExportRun?.(exportJob)}
                onSchedule={(schedule) => onExportSchedule?.(exportJob.id, schedule)}
                onEnable={() => onExportEnable?.(exportJob.id)}
                onDisable={() => onExportDisable?.(exportJob.id)}
                isExpanded={expandedExports.has(exportJob.id)}
                onToggleExpanded={() => handleExportToggle(exportJob.id)}
              />
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
});
FormExport.displayName = 'FormExport';

// Additional utility components
const FormExportContainer = React.forwardRef<
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
FormExportContainer.displayName = 'FormExportContainer';

const FormExportSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    exportCount?: number;
  }
>(({ className, size = 'default', exportCount = 3, ...props }, ref) => {
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
        <div className="h-10 w-32 bg-atlas-border-subtle rounded animate-pulse" />
      </div>
      
      <div className="space-y-3">
        {Array.from({ length: exportCount }).map((_, index) => (
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
FormExportSkeleton.displayName = 'FormExportSkeleton';

export {
  FormExport,
  FormExportJob,
  FormExportConfig,
  FormExportContainer,
  FormExportSkeleton,
  formExportVariants,
  formExportJobVariants,
  formExportConfigVariants,
};
