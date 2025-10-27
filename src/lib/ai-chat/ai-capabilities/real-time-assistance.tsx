/**
 * Real-time Assistance Component
 * 
 * Provides real-time assistance and support for travel planning.
 * Implements live help capabilities and instant support features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Real-time Assistance Variants
const realTimeAssistanceVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'real-time-assistance-mode-standard',
        'enhanced': 'real-time-assistance-mode-enhanced',
        'advanced': 'real-time-assistance-mode-advanced',
        'custom': 'real-time-assistance-mode-custom'
      },
      type: {
        'chat': 'assistance-type-chat',
        'voice': 'assistance-type-voice',
        'video': 'assistance-type-video',
        'emergency': 'assistance-type-emergency',
        'mixed': 'assistance-type-mixed'
      },
      style: {
        'minimal': 'assistance-style-minimal',
        'moderate': 'assistance-style-moderate',
        'detailed': 'assistance-style-detailed',
        'custom': 'assistance-style-custom'
      },
      format: {
        'text': 'assistance-format-text',
        'visual': 'assistance-format-visual',
        'interactive': 'assistance-format-interactive',
        'mixed': 'assistance-format-mixed'
      }
    },
    defaultVariants: {
      mode: 'standard',
      type: 'mixed',
      style: 'moderate',
      format: 'mixed'
    }
  }
);

// Real-time Assistance Toggle Props
interface RealTimeAssistanceToggleProps extends VariantProps<typeof realTimeAssistanceVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Real-time Assistance Toggle Component
export const RealTimeAssistanceToggle = React.forwardRef<HTMLButtonElement, RealTimeAssistanceToggleProps>(
  ({ 
    className, 
    onToggle, 
    showLabel = true, 
    size = 'md',
    position = 'top-right',
    ...props 
  }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);

    const handleToggle = useCallback(() => {
      const newState = !isEnabled;
      setIsEnabled(newState);
      onToggle?.(newState);
    }, [isEnabled, onToggle]);

    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    const positionClasses = {
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'fixed z-50 flex items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500',
          sizeClasses[size],
          positionClasses[position],
          isEnabled 
            ? 'bg-green-600 text-white border-green-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable real-time assistance' : 'Enable real-time assistance'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Real-time assistance enabled' : 'Real-time assistance disabled'}
          </span>
        )}
      </button>
    );
  }
);

RealTimeAssistanceToggle.displayName = 'RealTimeAssistanceToggle';

// Real-time Assistance Provider Props
interface RealTimeAssistanceProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'chat' | 'voice' | 'video' | 'emergency' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Real-time Assistance Provider Component
export const RealTimeAssistanceProvider = React.forwardRef<HTMLDivElement, RealTimeAssistanceProviderProps>(
  ({ 
    children, 
    className, 
    mode = 'standard', 
    type = 'mixed',
    style = 'moderate',
    applyToBody = true,
    ...props 
  }, ref) => {
    const [currentMode, setCurrentMode] = useState(mode);

    useEffect(() => {
      if (applyToBody) {
        // Remove existing real-time assistance classes
        document.body.classList.remove(
          'real-time-assistance-mode-standard',
          'real-time-assistance-mode-enhanced',
          'real-time-assistance-mode-advanced',
          'real-time-assistance-mode-custom'
        );
        
        document.body.classList.add(`real-time-assistance-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          realTimeAssistanceVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

RealTimeAssistanceProvider.displayName = 'RealTimeAssistanceProvider';

// Real-time Assistance Manager Component
interface RealTimeAssistanceManagerProps extends VariantProps<typeof realTimeAssistanceVariants> {
  className?: string;
  onAssistanceRequested?: (request: any) => void;
  type?: 'chat' | 'voice' | 'video' | 'emergency' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const RealTimeAssistanceManager = React.forwardRef<HTMLDivElement, RealTimeAssistanceManagerProps>(
  ({ 
    className, 
    onAssistanceRequested,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [assistance, setAssistance] = useState({
      isActive: false,
      currentRequest: null,
      availableAgents: [
        { id: 1, name: 'Sarah Chen', status: 'online', specialty: 'Europe Travel', rating: 4.9, responseTime: '2 min' },
        { id: 2, name: 'Marcus Johnson', status: 'online', specialty: 'Adventure Travel', rating: 4.8, responseTime: '1 min' },
        { id: 3, name: 'Elena Rodriguez', status: 'busy', specialty: 'Luxury Travel', rating: 4.9, responseTime: '5 min' },
        { id: 4, name: 'David Kim', status: 'online', specialty: 'Asia Travel', rating: 4.7, responseTime: '3 min' }
      ],
      supportTypes: [
        { type: 'chat', name: 'Live Chat', icon: '💬', description: 'Instant text support', available: true },
        { type: 'voice', name: 'Voice Call', icon: '📞', description: 'Phone support', available: true },
        { type: 'video', name: 'Video Call', icon: '📹', description: 'Face-to-face support', available: false },
        { type: 'emergency', name: 'Emergency', icon: '🚨', description: '24/7 emergency support', available: true }
      ],
      metrics: {
        averageResponseTime: '2.5 min',
        satisfactionRating: 4.8,
        totalRequests: 1247,
        resolutionRate: 96
      }
    });

    const [requestType, setRequestType] = useState('');
    const [requestMessage, setRequestMessage] = useState('');
    const [isRequesting, setIsRequesting] = useState(false);

    const requestAssistance = useCallback(async () => {
      if (requestType && requestMessage.trim()) {
        setIsRequesting(true);
        
        const request = {
          type: requestType,
          message: requestMessage,
          timestamp: new Date().toISOString(),
          status: 'pending',
          assignedAgent: null
        };
        
        setAssistance(prev => ({
          ...prev,
          currentRequest: request,
          isActive: true
        }));
        
        // Simulate agent assignment
        setTimeout(() => {
          const availableAgent = assistance.availableAgents.find(agent => agent.status === 'online');
          if (availableAgent) {
            setAssistance(prev => ({
              ...prev,
              currentRequest: {
                ...prev.currentRequest,
                status: 'assigned',
                assignedAgent: availableAgent
              }
            }));
            setIsRequesting(false);
            onAssistanceRequested?.(request);
          }
        }, 2000);
      }
    }, [requestType, requestMessage, assistance.availableAgents, onAssistanceRequested]);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'online': return 'text-green-600 dark:text-green-400';
        case 'busy': return 'text-yellow-600 dark:text-yellow-400';
        case 'offline': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'online': return '🟢';
        case 'busy': return '🟡';
        case 'offline': return '🔴';
        default: return '⚪';
      }
    };

    const getSupportTypeIcon = (supportType: string) => {
      const type = assistance.supportTypes.find(t => t.type === supportType);
      return type?.icon || '❓';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          realTimeAssistanceVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Real-time Assistance
          </h3>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', assistance.isActive ? 'bg-green-500' : 'bg-gray-400')} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {assistance.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {assistance.metrics.averageResponseTime}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Avg Response
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {assistance.metrics.satisfactionRating}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Rating
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {assistance.metrics.totalRequests}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Requests
              </div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-md dark:bg-orange-900/20">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {assistance.metrics.resolutionRate}%
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Resolution
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Available Support Types
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {assistance.supportTypes.map((supportType) => (
                  <button
                    key={supportType.type}
                    onClick={() => setRequestType(supportType.type)}
                    disabled={!supportType.available}
                    className={cn(
                      'p-3 text-center rounded-md border-2 transition-all duration-200',
                      requestType === supportType.type
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500',
                      !supportType.available && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <div className="text-lg mb-1">{supportType.icon}</div>
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                      {supportType.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {supportType.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Request Assistance
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Support Type: {requestType ? assistance.supportTypes.find(t => t.type === requestType)?.name : 'Select a type'}
                  </label>
                  {requestType && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                      <span className="text-lg">{getSupportTypeIcon(requestType)}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {assistance.supportTypes.find(t => t.type === requestType)?.description}
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Describe your request
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    placeholder="Describe what you need help with..."
                  />
                </div>
                
                <button
                  onClick={requestAssistance}
                  disabled={!requestType || !requestMessage.trim() || isRequesting}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isRequesting ? 'Connecting...' : 'Request Assistance'}
                </button>
              </div>
            </div>
            
            {assistance.currentRequest && (
              <div>
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Current Request
                </h4>
                <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getSupportTypeIcon(assistance.currentRequest.type)}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {assistance.supportTypes.find(t => t.type === assistance.currentRequest.type)?.name}
                    </span>
                    <span className={cn('text-xs px-2 py-1 rounded-full', 
                      assistance.currentRequest.status === 'assigned' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      assistance.currentRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    )}>
                      {assistance.currentRequest.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {assistance.currentRequest.message}
                  </p>
                  {assistance.currentRequest.assignedAgent && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Assigned to:</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {assistance.currentRequest.assignedAgent.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        ({assistance.currentRequest.assignedAgent.specialty})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Available Agents
              </h4>
              <div className="space-y-2">
                {assistance.availableAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{getStatusIcon(agent.status)}</span>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {agent.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {agent.specialty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        ⭐ {agent.rating}
                      </span>
                      <span className={cn('text-xs', getStatusColor(agent.status))}>
                        {agent.responseTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

RealTimeAssistanceManager.displayName = 'RealTimeAssistanceManager';

// Real-time Assistance Status Component
interface RealTimeAssistanceStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const RealTimeAssistanceStatus = React.forwardRef<HTMLDivElement, RealTimeAssistanceStatusProps>(
  ({ className, showDetails = false }, ref) => {
    const [isEnabled, setIsEnabled] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 p-3 rounded-md border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="font-medium">
          Real-time Assistance: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Live support and instant assistance' 
              : 'Basic help system'
            }
          </div>
        )}
      </div>
    );
  }
);

RealTimeAssistanceStatus.displayName = 'RealTimeAssistanceStatus';

// Real-time Assistance Demo Component
interface RealTimeAssistanceDemoProps {
  className?: string;
  showControls?: boolean;
}

export const RealTimeAssistanceDemo = React.forwardRef<HTMLDivElement, RealTimeAssistanceDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Real-time Assistance Demo</h3>
        
        <RealTimeAssistanceManager
          mode="enhanced"
          type="mixed"
          style="detailed"
          onAssistanceRequested={(request) => console.log('Assistance requested:', request)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time assistance with live chat, voice calls, and emergency support options.
            </p>
          </div>
        )}
      </div>
    );
  }
);

RealTimeAssistanceDemo.displayName = 'RealTimeAssistanceDemo';

// Export all components
export {
  realTimeAssistanceVariants,
  type RealTimeAssistanceToggleProps,
  type RealTimeAssistanceProviderProps,
  type RealTimeAssistanceManagerProps,
  type RealTimeAssistanceStatusProps,
  type RealTimeAssistanceDemoProps
};
