/**
 * Emergency Contacts Component
 * 
 * Provides emergency contact management and safety features for Atlas travel agent.
 * Implements contact organization, emergency protocols, and safety information.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Emergency Contacts Variants
const emergencyContactsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'emergency-contacts-mode-standard',
        'enhanced': 'emergency-contacts-mode-enhanced',
        'advanced': 'emergency-contacts-mode-advanced',
        'custom': 'emergency-contacts-mode-custom'
      },
      type: {
        'personal': 'emergency-type-personal',
        'family': 'emergency-type-family',
        'medical': 'emergency-type-medical',
        'mixed': 'emergency-type-mixed'
      },
      style: {
        'minimal': 'emergency-style-minimal',
        'moderate': 'emergency-style-moderate',
        'detailed': 'emergency-style-detailed',
        'custom': 'emergency-style-custom'
      },
      format: {
        'text': 'emergency-format-text',
        'visual': 'emergency-format-visual',
        'interactive': 'emergency-format-interactive',
        'mixed': 'emergency-format-mixed'
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

// Emergency Contacts Props
interface EmergencyContactsProps extends VariantProps<typeof emergencyContactsVariants> {
  className?: string;
  onContactsUpdate?: (contacts: EmergencyContactsData) => void;
  initialContacts?: Partial<EmergencyContactsData>;
  showQuickDial?: boolean;
  showLocation?: boolean;
  showProtocols?: boolean;
  showSafety?: boolean;
}

// Emergency Contacts Data Interface
interface EmergencyContactsData {
  id: string;
  tripId: string;
  tripName: string;
  contacts: EmergencyContact[];
  protocols: EmergencyProtocol[];
  safetyInfo: SafetyInformation[];
  quickActions: QuickAction[];
  settings: EmergencySettings;
  createdAt: Date;
  updatedAt: Date;
}

// Emergency Contact Interface
interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  type: 'personal' | 'medical' | 'consulate' | 'local' | 'insurance' | 'other';
  priority: 'high' | 'medium' | 'low';
  phone: string;
  email?: string;
  address?: string;
  location?: {
    name: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    address: string;
  };
  languages: string[];
  availability: {
    hours: string;
    timezone: string;
    is24Hours: boolean;
  };
  notes: string;
  isPrimary: boolean;
  isVerified: boolean;
  lastContacted?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Emergency Protocol Interface
interface EmergencyProtocol {
  id: string;
  name: string;
  type: 'medical' | 'security' | 'natural-disaster' | 'political' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  steps: ProtocolStep[];
  contacts: string[];
  resources: string[];
  isActive: boolean;
  lastUpdated: Date;
}

// Protocol Step Interface
interface ProtocolStep {
  id: string;
  order: number;
  title: string;
  description: string;
  action: string;
  contact?: string;
  estimatedTime: number; // in minutes
  isCritical: boolean;
}

// Safety Information Interface
interface SafetyInformation {
  id: string;
  category: 'health' | 'security' | 'transportation' | 'weather' | 'cultural' | 'legal';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger';
  location?: string;
  validFrom: Date;
  validTo?: Date;
  source: string;
  isActive: boolean;
  tags: string[];
}

// Quick Action Interface
interface QuickAction {
  id: string;
  name: string;
  description: string;
  action: 'call' | 'message' | 'email' | 'location' | 'protocol';
  target: string;
  icon: string;
  color: string;
  isEnabled: boolean;
  order: number;
}

// Emergency Settings Interface
interface EmergencySettings {
  autoLocationSharing: boolean;
  emergencyNotifications: boolean;
  quickDialEnabled: boolean;
  protocolReminders: boolean;
  safetyAlerts: boolean;
  backupContacts: string[];
  emergencyMessage: string;
  locationUpdateInterval: number; // in minutes
  notificationThresholds: {
    medical: number;
    security: number;
    weather: number;
  };
}

// Emergency Contacts Component
export const EmergencyContacts = React.forwardRef<HTMLDivElement, EmergencyContactsProps>(
  ({ 
    className, 
    onContactsUpdate,
    initialContacts,
    showQuickDial = true,
    showLocation = true,
    showProtocols = true,
    showSafety = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [contacts, setContacts] = useState<EmergencyContactsData>(
      initialContacts || {
        id: '',
        tripId: '',
        tripName: '',
        contacts: [],
        protocols: [],
        safetyInfo: [],
        quickActions: [],
        settings: {
          autoLocationSharing: true,
          emergencyNotifications: true,
          quickDialEnabled: true,
          protocolReminders: true,
          safetyAlerts: true,
          backupContacts: [],
          emergencyMessage: 'Emergency: I need help. My location is being shared.',
          locationUpdateInterval: 15,
          notificationThresholds: {
            medical: 1,
            security: 1,
            weather: 3
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('contacts');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState<string>('');
    const [emergencyMode, setEmergencyMode] = useState(false);

    const tabs = [
      { id: 'contacts', name: 'Contacts', icon: '👥' },
      { id: 'protocols', name: 'Protocols', icon: '📋' },
      { id: 'safety', name: 'Safety Info', icon: '🛡️' },
      { id: 'quick-actions', name: 'Quick Actions', icon: '⚡' },
      { id: 'settings', name: 'Settings', icon: '⚙️' }
    ];

    const contactTypes = [
      { id: 'personal', name: 'Personal', icon: '👤', color: 'blue' },
      { id: 'medical', name: 'Medical', icon: '🏥', color: 'red' },
      { id: 'consulate', name: 'Consulate', icon: '🏛️', color: 'purple' },
      { id: 'local', name: 'Local Emergency', icon: '🚨', color: 'orange' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'green' },
      { id: 'other', name: 'Other', icon: '📞', color: 'gray' }
    ];

    const protocolTypes = [
      { id: 'medical', name: 'Medical Emergency', icon: '🏥', color: 'red' },
      { id: 'security', name: 'Security Issue', icon: '🔒', color: 'orange' },
      { id: 'natural-disaster', name: 'Natural Disaster', icon: '🌪️', color: 'yellow' },
      { id: 'political', name: 'Political Unrest', icon: '🏛️', color: 'purple' },
      { id: 'other', name: 'Other', icon: '⚠️', color: 'gray' }
    ];

    const safetyCategories = [
      { id: 'health', name: 'Health', icon: '🏥', color: 'red' },
      { id: 'security', name: 'Security', icon: '🔒', color: 'orange' },
      { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'blue' },
      { id: 'weather', name: 'Weather', icon: '🌤️', color: 'yellow' },
      { id: 'cultural', name: 'Cultural', icon: '🎭', color: 'purple' },
      { id: 'legal', name: 'Legal', icon: '⚖️', color: 'indigo' }
    ];

    const updateContacts = useCallback((path: string, value: any) => {
      setContacts(prev => {
        const newContacts = { ...prev };
        const keys = path.split('.');
        let current: any = newContacts;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newContacts.updatedAt = new Date();
        onContactsUpdate?.(newContacts);
        return newContacts;
      });
    }, [onContactsUpdate]);

    const addContact = useCallback(() => {
      const newContact: EmergencyContact = {
        id: `contact-${Date.now()}`,
        name: '',
        relationship: '',
        type: 'personal',
        priority: 'medium',
        phone: '',
        email: '',
        address: '',
        languages: [],
        availability: {
          hours: '24/7',
          timezone: 'UTC',
          is24Hours: true
        },
        notes: '',
        isPrimary: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updateContacts('contacts', [...contacts.contacts, newContact]);
    }, [contacts.contacts, updateContacts]);

    const addProtocol = useCallback(() => {
      const newProtocol: EmergencyProtocol = {
        id: `protocol-${Date.now()}`,
        name: '',
        type: 'medical',
        severity: 'medium',
        description: '',
        steps: [],
        contacts: [],
        resources: [],
        isActive: true,
        lastUpdated: new Date()
      };
      updateContacts('protocols', [...contacts.protocols, newProtocol]);
    }, [contacts.protocols, updateContacts]);

    const addSafetyInfo = useCallback(() => {
      const newSafetyInfo: SafetyInformation = {
        id: `safety-${Date.now()}`,
        category: 'health',
        title: '',
        description: '',
        severity: 'info',
        validFrom: new Date(),
        source: '',
        isActive: true,
        tags: []
      };
      updateContacts('safetyInfo', [...contacts.safetyInfo, newSafetyInfo]);
    }, [contacts.safetyInfo, updateContacts]);

    const callContact = useCallback((contact: EmergencyContact) => {
      // Simulate calling functionality
      console.log(`Calling ${contact.name} at ${contact.phone}`);
      updateContacts(`contacts.${contact.id}.lastContacted`, new Date());
    }, [updateContacts]);

    const sendEmergencyMessage = useCallback(() => {
      const primaryContacts = contacts.contacts.filter(c => c.isPrimary);
      console.log(`Sending emergency message to ${primaryContacts.length} contacts`);
      // Simulate emergency message sending
    }, [contacts.contacts]);

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    const getContactTypeIcon = (type: EmergencyContact['type']) => {
      const contactType = contactTypes.find(t => t.id === type);
      return contactType?.icon || '📞';
    };

    const getContactTypeName = (type: EmergencyContact['type']) => {
      const contactType = contactTypes.find(t => t.id === type);
      return contactType?.name || type;
    };

    const getContactTypeColor = (type: EmergencyContact['type']) => {
      const contactType = contactTypes.find(t => t.id === type);
      return contactType?.color || 'gray';
    };

    const getPriorityColor = (priority: EmergencyContact['priority']) => {
      switch (priority) {
        case 'high': return 'text-red-600 dark:text-red-400';
        case 'medium': return 'text-yellow-600 dark:text-yellow-400';
        case 'low': return 'text-green-600 dark:text-green-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getSeverityColor = (severity: SafetyInformation['severity']) => {
      switch (severity) {
        case 'danger': return 'text-red-600 dark:text-red-400';
        case 'warning': return 'text-yellow-600 dark:text-yellow-400';
        case 'info': return 'text-blue-600 dark:text-blue-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getProtocolIcon = (type: EmergencyProtocol['type']) => {
      const protocolType = protocolTypes.find(t => t.id === type);
      return protocolType?.icon || '⚠️';
    };

    const getSafetyIcon = (category: SafetyInformation['category']) => {
      const safetyCategory = safetyCategories.find(c => c.id === category);
      return safetyCategory?.icon || '🛡️';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          emergencyContactsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Emergency Contacts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Safety and emergency management for {contacts.tripName || 'your trip'}
            </p>
          </div>
          <div className="flex gap-2">
            {emergencyMode && (
              <button
                onClick={sendEmergencyMessage}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              >
                🚨 Send Emergency Alert
              </button>
            )}
            <button
              onClick={() => setEmergencyMode(!emergencyMode)}
              className={cn(
                'px-4 py-2 rounded-md transition-colors duration-200',
                emergencyMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              )}
            >
              {emergencyMode ? '🚨 Emergency Mode' : '🛡️ Safety Mode'}
            </button>
          </div>
        </div>

        {/* Emergency Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {contacts.contacts.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Contacts</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {contacts.contacts.filter(c => c.isPrimary).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Primary</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {contacts.protocols.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Protocols</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {contacts.safetyInfo.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Safety Alerts</div>
          </div>
        </div>

        {/* Quick Actions */}
        {showQuickDial && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contacts.contacts
                .filter(c => c.isPrimary)
                .slice(0, 4)
                .map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => callContact(contact)}
                  className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <span className="text-2xl">{getContactTypeIcon(contact.type)}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {contact.name}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {contact.relationship}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 dark:border-gray-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200',
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Emergency Contacts
                </h3>
                <button
                  onClick={addContact}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  ➕ Add Contact
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.contacts.map((contact) => (
                  <div key={contact.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getContactTypeIcon(contact.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {contact.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {contact.relationship}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {contact.isPrimary && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-md">
                            Primary
                          </span>
                        )}
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          `bg-${getContactTypeColor(contact.type)}-100 text-${getContactTypeColor(contact.type)}-800 dark:bg-${getContactTypeColor(contact.type)}-900 dark:text-${getContactTypeColor(contact.type)}-200`
                        )}>
                          {getContactTypeName(contact.type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {contact.phone}
                        </span>
                      </div>
                      
                      {contact.email && (
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {contact.email}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className={cn('font-medium', getPriorityColor(contact.priority))}>
                          {contact.priority}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Availability:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {contact.availability.hours}
                        </span>
                      </div>
                      
                      {contact.lastContacted && (
                        <div className="flex justify-between">
                          <span>Last Contact:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(contact.lastContacted)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1">
                        {contact.languages.slice(0, 2).map((language) => (
                          <span
                            key={language}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => callContact(contact)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200"
                        >
                          📞
                        </button>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                          💬
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'protocols' && showProtocols && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Emergency Protocols
                </h3>
                <button
                  onClick={addProtocol}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                >
                  📋 Add Protocol
                </button>
              </div>
              
              <div className="space-y-3">
                {contacts.protocols.map((protocol) => (
                  <div key={protocol.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getProtocolIcon(protocol.type)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {protocol.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {protocol.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          protocol.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          protocol.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                          protocol.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        )}>
                          {protocol.severity}
                        </span>
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          protocol.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        )}>
                          {protocol.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Steps:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {protocol.steps.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contacts:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {protocol.contacts.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(protocol.lastUpdated)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'safety' && showSafety && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Safety Information
                </h3>
                <button
                  onClick={addSafetyInfo}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors duration-200"
                >
                  🛡️ Add Safety Info
                </button>
              </div>
              
              <div className="space-y-3">
                {contacts.safetyInfo.map((safety) => (
                  <div key={safety.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getSafetyIcon(safety.category)}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {safety.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {safety.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          safety.severity === 'danger' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          safety.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        )}>
                          {safety.severity}
                        </span>
                        <span className={cn(
                          'px-2 py-1 text-xs rounded-md',
                          safety.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        )}>
                          {safety.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {safety.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {safety.source}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valid From:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(safety.validFrom)}
                        </span>
                      </div>
                      {safety.validTo && (
                        <div className="flex justify-between">
                          <span>Valid To:</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {formatDate(safety.validTo)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex gap-1">
                        {safety.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quick-actions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Quick Actions
              </h3>
              
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Quick actions coming soon
                </h3>
                <p>One-tap emergency actions and shortcuts</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Emergency Settings
              </h3>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={contacts.settings.autoLocationSharing}
                      onChange={(e) => updateContacts('settings.autoLocationSharing', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto location sharing</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={contacts.settings.emergencyNotifications}
                      onChange={(e) => updateContacts('settings.emergencyNotifications', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Emergency notifications</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={contacts.settings.quickDialEnabled}
                      onChange={(e) => updateContacts('settings.quickDialEnabled', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Quick dial enabled</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={contacts.settings.safetyAlerts}
                      onChange={(e) => updateContacts('settings.safetyAlerts', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Safety alerts</span>
                  </label>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emergency Message
                  </label>
                  <textarea
                    value={contacts.settings.emergencyMessage}
                    onChange={(e) => updateContacts('settings.emergencyMessage', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

EmergencyContacts.displayName = 'EmergencyContacts';

// Emergency Contacts Demo Component
interface EmergencyContactsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const EmergencyContactsDemo = React.forwardRef<HTMLDivElement, EmergencyContactsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [contacts, setContacts] = useState<Partial<EmergencyContactsData>>({});

    const handleContactsUpdate = (updatedContacts: EmergencyContactsData) => {
      setContacts(updatedContacts);
      console.log('Emergency contacts updated:', updatedContacts);
    };

    const mockContacts: Partial<EmergencyContactsData> = {
      id: 'emergency-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      contacts: [],
      protocols: [],
      safetyInfo: [],
      quickActions: [],
      settings: {
        autoLocationSharing: true,
        emergencyNotifications: true,
        quickDialEnabled: true,
        protocolReminders: true,
        safetyAlerts: true,
        backupContacts: [],
        emergencyMessage: 'Emergency: I need help. My location is being shared.',
        locationUpdateInterval: 15,
        notificationThresholds: {
          medical: 1,
          security: 1,
          weather: 3
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6 p-6 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Emergency Contacts Demo
        </h3>
        
        <EmergencyContacts
          onContactsUpdate={handleContactsUpdate}
          initialContacts={mockContacts}
          showQuickDial={true}
          showLocation={true}
          showProtocols={true}
          showSafety={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive emergency contact management with safety protocols, quick actions, and emergency features.
            </p>
          </div>
        )}
      </div>
    );
  }
);

EmergencyContactsDemo.displayName = 'EmergencyContactsDemo';

// Export all components
export {
  emergencyContactsVariants,
  type EmergencyContactsProps,
  type EmergencyContactsData,
  type EmergencyContact,
  type EmergencyProtocol,
  type ProtocolStep,
  type SafetyInformation,
  type QuickAction,
  type EmergencySettings,
  type EmergencyContactsDemoProps
};
