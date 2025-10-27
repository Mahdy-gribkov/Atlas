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
  GlobeIcon, 
  DatabaseIcon, 
  WebhookIcon, 
  MailIcon, 
  MessageSquareIcon, 
  CalendarIcon, 
  CreditCardIcon, 
  ShieldIcon, 
  KeyIcon, 
  LockIcon, 
  UnlockIcon, 
  ActivityIcon, 
  ClockIcon, 
  InfoIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
  ExternalLinkIcon,
  DownloadIcon,
  UploadIcon,
  TestTubeIcon,
  BugIcon,
  CheckIcon,
  XIcon
} from 'lucide-react';

const formIntegrationsVariants = cva(
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

const formIntegrationVariants = cva(
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

const formIntegrationConfigVariants = cva(
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

export interface FormIntegrationsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formIntegrationsVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  integrations: FormIntegration[];
  onIntegrationsChange?: (integrations: FormIntegration[]) => void;
  onIntegrationAdd?: (integration: FormIntegration) => void;
  onIntegrationUpdate?: (integrationId: string, updates: Partial<FormIntegration>) => void;
  onIntegrationDelete?: (integrationId: string) => void;
  onIntegrationDuplicate?: (integrationId: string) => void;
  onIntegrationTest?: (integration: FormIntegration) => void;
  onIntegrationEnable?: (integrationId: string) => void;
  onIntegrationDisable?: (integrationId: string) => void;
  showBuilder?: boolean;
  showTestMode?: boolean;
  testData?: Record<string, any>;
  children?: React.ReactNode;
}

export interface FormIntegration {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  type: 'webhook' | 'api' | 'email' | 'sms' | 'calendar' | 'payment' | 'crm' | 'analytics' | 'storage' | 'custom';
  provider: string;
  configuration: IntegrationConfiguration;
  triggers: IntegrationTrigger[];
  actions: IntegrationAction[];
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

export interface IntegrationConfiguration {
  endpoint?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  authentication?: {
    type: 'none' | 'api_key' | 'oauth' | 'basic' | 'bearer';
    apiKey?: string;
    username?: string;
    password?: string;
    token?: string;
    clientId?: string;
    clientSecret?: string;
  };
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  customFields?: Record<string, any>;
}

export interface IntegrationTrigger {
  id: string;
  event: 'form_submit' | 'form_start' | 'field_change' | 'form_abandon' | 'custom';
  conditions?: IntegrationCondition[];
  delay?: number;
}

export interface IntegrationCondition {
  id: string;
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value?: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface IntegrationAction {
  id: string;
  type: 'send_data' | 'update_field' | 'redirect' | 'show_message' | 'send_email' | 'send_sms' | 'create_calendar_event' | 'process_payment' | 'custom';
  target?: string;
  data?: Record<string, any>;
  mapping?: Record<string, string>;
  delay?: number;
}

export interface FormIntegrationProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formIntegrationVariants> {
  variant?: 'default' | 'active' | 'error' | 'warning' | 'success' | 'disabled';
  size?: 'sm' | 'default' | 'lg';
  integration: FormIntegration;
  onUpdate?: (updates: Partial<FormIntegration>) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onTest?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
  showActions?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

export interface FormIntegrationConfigProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formIntegrationConfigVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal';
  size?: 'sm' | 'default' | 'lg';
  integration: FormIntegration;
  onUpdate?: (updates: Partial<FormIntegration>) => void;
  onTest?: () => void;
  testResult?: 'pass' | 'fail' | 'error';
  testData?: any;
}

const FormIntegrationConfig = React.forwardRef<
  HTMLDivElement,
  FormIntegrationConfigProps
>(({ 
  className, 
  variant, 
  size, 
  integration, 
  onUpdate, 
  onTest, 
  testResult, 
  testData, 
  ...props 
}, ref) => {
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

  const getIntegrationIcon = () => {
    switch (integration.type) {
      case 'webhook':
        return <WebhookIcon className="h-4 w-4" />;
      case 'api':
        return <GlobeIcon className="h-4 w-4" />;
      case 'email':
        return <MailIcon className="h-4 w-4" />;
      case 'sms':
        return <MessageSquareIcon className="h-4 w-4" />;
      case 'calendar':
        return <CalendarIcon className="h-4 w-4" />;
      case 'payment':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'crm':
        return <DatabaseIcon className="h-4 w-4" />;
      case 'analytics':
        return <ActivityIcon className="h-4 w-4" />;
      case 'storage':
        return <DatabaseIcon className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formIntegrationConfigVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getIntegrationIcon()}
          <span className="text-sm font-medium text-atlas-text-primary">
            {integration.name} Configuration
          </span>
          {getTestResultIcon()}
        </div>
        
        <button
          type="button"
          onClick={onTest}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-atlas-primary-main text-white rounded hover:bg-atlas-primary-light transition-colors"
        >
          <TestTubeIcon className="h-3 w-3" />
          Test
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Provider
            </label>
            <input
              type="text"
              value={integration.provider}
              onChange={(e) => onUpdate?.({ provider: e.target.value })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              placeholder="e.g., Zapier, Webhook.site"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Endpoint URL
            </label>
            <input
              type="url"
              value={integration.configuration.endpoint || ''}
              onChange={(e) => onUpdate?.({
                configuration: {
                  ...integration.configuration,
                  endpoint: e.target.value,
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              placeholder="https://api.example.com/webhook"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-atlas-text-primary mb-1">
            HTTP Method
          </label>
          <select
            value={integration.configuration.method || 'POST'}
            onChange={(e) => onUpdate?.({
              configuration: {
                ...integration.configuration,
                method: e.target.value as any,
              },
            })}
            className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
            <option value="PATCH">PATCH</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-atlas-text-primary mb-1">
            Authentication
          </label>
          <select
            value={integration.configuration.authentication?.type || 'none'}
            onChange={(e) => onUpdate?.({
              configuration: {
                ...integration.configuration,
                authentication: {
                  ...integration.configuration.authentication,
                  type: e.target.value as any,
                },
              },
            })}
            className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
          >
            <option value="none">None</option>
            <option value="api_key">API Key</option>
            <option value="oauth">OAuth</option>
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
          </select>
        </div>
        
        {integration.configuration.authentication?.type === 'api_key' && (
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              API Key
            </label>
            <input
              type="password"
              value={integration.configuration.authentication.apiKey || ''}
              onChange={(e) => onUpdate?.({
                configuration: {
                  ...integration.configuration,
                  authentication: {
                    ...integration.configuration.authentication,
                    apiKey: e.target.value,
                  },
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              placeholder="Enter API key"
            />
          </div>
        )}
        
        {integration.configuration.authentication?.type === 'bearer' && (
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Bearer Token
            </label>
            <input
              type="password"
              value={integration.configuration.authentication.token || ''}
              onChange={(e) => onUpdate?.({
                configuration: {
                  ...integration.configuration,
                  authentication: {
                    ...integration.configuration.authentication,
                    token: e.target.value,
                  },
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              placeholder="Enter bearer token"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Timeout (seconds)
            </label>
            <input
              type="number"
              value={integration.configuration.timeout || 30}
              onChange={(e) => onUpdate?.({
                configuration: {
                  ...integration.configuration,
                  timeout: parseInt(e.target.value),
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              min="1"
              max="300"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-atlas-text-primary mb-1">
              Retries
            </label>
            <input
              type="number"
              value={integration.configuration.retries || 3}
              onChange={(e) => onUpdate?.({
                configuration: {
                  ...integration.configuration,
                  retries: parseInt(e.target.value),
                },
              })}
              className="w-full px-3 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main"
              min="0"
              max="10"
            />
          </div>
        </div>
        
        {testData && (
          <div className="mt-4 p-3 bg-atlas-border-subtle rounded-lg">
            <h4 className="text-sm font-medium text-atlas-text-primary mb-2">
              Test Response
            </h4>
            <pre className="text-xs text-atlas-text-secondary overflow-x-auto">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
});
FormIntegrationConfig.displayName = 'FormIntegrationConfig';

const FormIntegration = React.forwardRef<
  HTMLDivElement,
  FormIntegrationProps
>(({ 
  className, 
  variant, 
  size, 
  integration, 
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
  const [editName, setEditName] = React.useState(integration.name);

  const getIntegrationVariant = () => {
    if (integration.testResult === 'error') return 'error';
    if (integration.testResult === 'fail') return 'warning';
    if (integration.testResult === 'pass') return 'success';
    if (!integration.enabled) return 'disabled';
    return variant || 'default';
  };

  const handleNameSave = () => {
    if (editName !== integration.name) {
      onUpdate?.({ name: editName });
    }
    setIsEditing(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setEditName(integration.name);
      setIsEditing(false);
    }
  };

  const getTestResultIcon = () => {
    switch (integration.testResult) {
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

  const getIntegrationIcon = () => {
    switch (integration.type) {
      case 'webhook':
        return <WebhookIcon className="h-4 w-4" />;
      case 'api':
        return <GlobeIcon className="h-4 w-4" />;
      case 'email':
        return <MailIcon className="h-4 w-4" />;
      case 'sms':
        return <MessageSquareIcon className="h-4 w-4" />;
      case 'calendar':
        return <CalendarIcon className="h-4 w-4" />;
      case 'payment':
        return <CreditCardIcon className="h-4 w-4" />;
      case 'crm':
        return <DatabaseIcon className="h-4 w-4" />;
      case 'analytics':
        return <ActivityIcon className="h-4 w-4" />;
      case 'storage':
        return <DatabaseIcon className="h-4 w-4" />;
      default:
        return <LinkIcon className="h-4 w-4" />;
    }
  };

  return (
    <div
      ref={ref}
      className={cn(formIntegrationVariants({ variant: getIntegrationVariant(), size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onToggleExpanded}
            className="flex-shrink-0 p-1 hover:bg-atlas-border-subtle rounded transition-colors"
            aria-label={isExpanded ? 'Collapse integration' : 'Expand integration'}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </button>
          
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {getIntegrationIcon()}
            
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
                {integration.name}
              </button>
            )}
            
            {integration.description && (
              <span className="text-xs text-atlas-text-tertiary truncate">
                {integration.description}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getTestResultIcon()}
            
            <div className="flex items-center gap-1">
              <div className={cn(
                'w-2 h-2 rounded-full',
                integration.enabled ? 'bg-atlas-success-main' : 'bg-atlas-text-tertiary'
              )} />
              <span className="text-xs text-atlas-text-tertiary">
                {integration.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            
            <span className="text-xs text-atlas-text-tertiary">
              {integration.type}
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1 ml-4">
            <button
              type="button"
              onClick={integration.enabled ? onDisable : onEnable}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label={integration.enabled ? 'Disable integration' : 'Enable integration'}
            >
              {integration.enabled ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              type="button"
              onClick={onTest}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Test integration"
            >
              <PlayIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
              aria-label="Duplicate integration"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
            
            <button
              type="button"
              onClick={onDelete}
              className="p-1 hover:bg-atlas-error-main hover:text-white rounded transition-colors"
              aria-label="Delete integration"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <FormIntegrationConfig
            variant="outlined"
            size={size}
            integration={integration}
            onUpdate={onUpdate}
            onTest={onTest}
            testResult={integration.testResult}
          />
        </div>
      )}
    </div>
  );
});
FormIntegration.displayName = 'FormIntegration';

const FormIntegrations = React.forwardRef<
  HTMLDivElement,
  FormIntegrationsProps
>(({
  className,
  variant,
  size,
  integrations,
  onIntegrationsChange,
  onIntegrationAdd,
  onIntegrationUpdate,
  onIntegrationDelete,
  onIntegrationDuplicate,
  onIntegrationTest,
  onIntegrationEnable,
  onIntegrationDisable,
  showBuilder = true,
  showTestMode = false,
  testData = {},
  children,
  ...props
}, ref) => {
  const [expandedIntegrations, setExpandedIntegrations] = React.useState<Set<string>>(new Set());
  const [isTestMode, setIsTestMode] = React.useState(false);

  const handleIntegrationToggle = (integrationId: string) => {
    const newExpanded = new Set(expandedIntegrations);
    if (newExpanded.has(integrationId)) {
      newExpanded.delete(integrationId);
    } else {
      newExpanded.add(integrationId);
    }
    setExpandedIntegrations(newExpanded);
  };

  const handleIntegrationUpdate = (integrationId: string, updates: Partial<FormIntegration>) => {
    const updatedIntegration = {
      ...updates,
      updatedAt: new Date(),
    };
    onIntegrationUpdate?.(integrationId, updatedIntegration);
  };

  const sortedIntegrations = [...integrations].sort((a, b) => b.priority - a.priority);

  const integrationTypes = [
    { type: 'webhook', label: 'Webhook', icon: <WebhookIcon className="h-4 w-4" /> },
    { type: 'api', label: 'API', icon: <GlobeIcon className="h-4 w-4" /> },
    { type: 'email', label: 'Email', icon: <MailIcon className="h-4 w-4" /> },
    { type: 'sms', label: 'SMS', icon: <MessageSquareIcon className="h-4 w-4" /> },
    { type: 'calendar', label: 'Calendar', icon: <CalendarIcon className="h-4 w-4" /> },
    { type: 'payment', label: 'Payment', icon: <CreditCardIcon className="h-4 w-4" /> },
    { type: 'crm', label: 'CRM', icon: <DatabaseIcon className="h-4 w-4" /> },
    { type: 'analytics', label: 'Analytics', icon: <ActivityIcon className="h-4 w-4" /> },
    { type: 'storage', label: 'Storage', icon: <DatabaseIcon className="h-4 w-4" /> },
    { type: 'custom', label: 'Custom', icon: <LinkIcon className="h-4 w-4" /> },
  ];

  return (
    <div
      ref={ref}
      className={cn(formIntegrationsVariants({ variant, size, className }))}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Form Integrations
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {integrations.length} integration{integrations.length !== 1 ? 's' : ''} configured
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
          
          <div className="relative">
            <select
              onChange={(e) => {
                const integrationType = e.target.value as any;
                onIntegrationAdd?.({
                  id: `integration-${Date.now()}`,
                  name: `New ${integrationType} Integration`,
                  enabled: true,
                  type: integrationType,
                  provider: '',
                  configuration: {
                    method: 'POST',
                    authentication: { type: 'none' },
                    timeout: 30,
                    retries: 3,
                  },
                  triggers: [],
                  actions: [],
                  priority: 1,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                });
                e.target.value = '';
              }}
              className="appearance-none bg-atlas-primary-main text-white px-4 py-2 pr-8 rounded-md hover:bg-atlas-primary-light transition-colors cursor-pointer"
            >
              <option value="">Add Integration</option>
              {integrationTypes.map(type => (
                <option key={type.type} value={type.type} className="bg-white text-atlas-text-primary">
                  {type.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-atlas-text-primary">
          Integrations ({integrations.length})
        </h3>
        
        {sortedIntegrations.length === 0 ? (
          <div className="text-center py-8">
            <LinkIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-atlas-text-primary mb-2">
              No integrations configured
            </h3>
            <p className="text-sm text-atlas-text-secondary mb-4">
              Connect your form to external services and APIs
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {integrationTypes.slice(0, 4).map(type => (
                <button
                  key={type.type}
                  type="button"
                  onClick={() => onIntegrationAdd?.({
                    id: `integration-${Date.now()}`,
                    name: `New ${type.label} Integration`,
                    enabled: true,
                    type: type.type as any,
                    provider: '',
                    configuration: {
                      method: 'POST',
                      authentication: { type: 'none' },
                      timeout: 30,
                      retries: 3,
                    },
                    triggers: [],
                    actions: [],
                    priority: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  })}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-atlas-border rounded-md hover:bg-atlas-border-subtle transition-colors"
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedIntegrations.map(integration => (
              <FormIntegration
                key={integration.id}
                variant="default"
                size={size}
                integration={integration}
                onUpdate={(updates) => handleIntegrationUpdate(integration.id, updates)}
                onDelete={() => onIntegrationDelete?.(integration.id)}
                onDuplicate={() => onIntegrationDuplicate?.(integration.id)}
                onTest={() => onIntegrationTest?.(integration)}
                onEnable={() => onIntegrationEnable?.(integration.id)}
                onDisable={() => onIntegrationDisable?.(integration.id)}
                isExpanded={expandedIntegrations.has(integration.id)}
                onToggleExpanded={() => handleIntegrationToggle(integration.id)}
              />
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
});
FormIntegrations.displayName = 'FormIntegrations';

// Additional utility components
const FormIntegrationsContainer = React.forwardRef<
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
FormIntegrationsContainer.displayName = 'FormIntegrationsContainer';

const FormIntegrationsSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    integrationCount?: number;
  }
>(({ className, size = 'default', integrationCount = 3, ...props }, ref) => {
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
        {Array.from({ length: integrationCount }).map((_, index) => (
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
FormIntegrationsSkeleton.displayName = 'FormIntegrationsSkeleton';

export {
  FormIntegrations,
  FormIntegration,
  FormIntegrationConfig,
  FormIntegrationsContainer,
  FormIntegrationsSkeleton,
  formIntegrationsVariants,
  formIntegrationVariants,
  formIntegrationConfigVariants,
};
