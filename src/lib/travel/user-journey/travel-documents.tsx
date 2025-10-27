/**
 * Travel Documents Component
 * 
 * Provides comprehensive travel document management for Atlas travel agent.
 * Implements passport, visa, and document tracking features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Travel Documents Variants
const travelDocumentsVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'travel-documents-mode-standard',
        'enhanced': 'travel-documents-mode-enhanced',
        'advanced': 'travel-documents-mode-advanced',
        'custom': 'travel-documents-mode-custom'
      },
      type: {
        'passport': 'documents-type-passport',
        'visa': 'documents-type-visa',
        'insurance': 'documents-type-insurance',
        'certificates': 'documents-type-certificates',
        'mixed': 'documents-type-mixed'
      },
      style: {
        'minimal': 'documents-style-minimal',
        'moderate': 'documents-style-moderate',
        'detailed': 'documents-style-detailed',
        'custom': 'documents-style-custom'
      },
      format: {
        'text': 'documents-format-text',
        'visual': 'documents-format-visual',
        'interactive': 'documents-format-interactive',
        'mixed': 'documents-format-mixed'
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

// Travel Documents Props
interface TravelDocumentsProps extends VariantProps<typeof travelDocumentsVariants> {
  className?: string;
  onDocumentsUpdate?: (documents: TravelDocumentsData) => void;
  initialDocuments?: Partial<TravelDocumentsData>;
  showExpiryAlerts?: boolean;
  showRequirements?: boolean;
  showUpload?: boolean;
  showValidation?: boolean;
}

// Travel Documents Data Interface
interface TravelDocumentsData {
  id: string;
  travelerId: string;
  travelerName: string;
  documents: TravelDocument[];
  requirements: DocumentRequirement[];
  alerts: DocumentAlert[];
  lastUpdated: Date;
}

// Travel Document Interface
interface TravelDocument {
  id: string;
  type: 'passport' | 'visa' | 'id-card' | 'driver-license' | 'insurance' | 'vaccination' | 'other';
  title: string;
  documentNumber: string;
  issuingCountry: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'valid' | 'expired' | 'expiring-soon' | 'invalid';
  fileUrl?: string;
  thumbnailUrl?: string;
  notes: string;
  isRequired: boolean;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Document Requirement Interface
interface DocumentRequirement {
  id: string;
  destination: string;
  documentType: string;
  isRequired: boolean;
  validityPeriod: number; // in months
  processingTime: number; // in days
  cost: number;
  currency: string;
  description: string;
  requirements: string[];
  applicationUrl?: string;
}

// Document Alert Interface
interface DocumentAlert {
  id: string;
  documentId: string;
  type: 'expiry' | 'requirement' | 'missing' | 'invalid';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  actionRequired: string;
  dueDate?: Date;
  isRead: boolean;
  createdAt: Date;
}

// Travel Documents Component
export const TravelDocuments = React.forwardRef<HTMLDivElement, TravelDocumentsProps>(
  ({ 
    className, 
    onDocumentsUpdate,
    initialDocuments,
    showExpiryAlerts = true,
    showRequirements = true,
    showUpload = true,
    showValidation = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [documents, setDocuments] = useState<TravelDocumentsData>(
      initialDocuments || {
        id: '',
        travelerId: '',
        travelerName: '',
        documents: [],
        requirements: [],
        alerts: [],
        lastUpdated: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('documents');
    const [isAddingDocument, setIsAddingDocument] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<TravelDocument | null>(null);

    const tabs = [
      { id: 'documents', name: 'Documents', icon: '📄' },
      { id: 'requirements', name: 'Requirements', icon: '📋' },
      { id: 'alerts', name: 'Alerts', icon: '⚠️' }
    ];

    const documentTypes = [
      { id: 'passport', name: 'Passport', icon: '📘', color: 'blue' },
      { id: 'visa', name: 'Visa', icon: '📗', color: 'green' },
      { id: 'id-card', name: 'ID Card', icon: '🆔', color: 'purple' },
      { id: 'driver-license', name: 'Driver License', icon: '🚗', color: 'orange' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'red' },
      { id: 'vaccination', name: 'Vaccination', icon: '💉', color: 'yellow' },
      { id: 'other', name: 'Other', icon: '📄', color: 'gray' }
    ];

    const updateDocuments = useCallback((path: string, value: any) => {
      setDocuments(prev => {
        const newDocuments = { ...prev };
        const keys = path.split('.');
        let current: any = newDocuments;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
        newDocuments.lastUpdated = new Date();
        onDocumentsUpdate?.(newDocuments);
        return newDocuments;
      });
    }, [onDocumentsUpdate]);

    const addDocument = useCallback((document: Omit<TravelDocument, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newDocument: TravelDocument = {
        ...document,
        id: `doc-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      updateDocuments('documents', [...documents.documents, newDocument]);
      setIsAddingDocument(false);
    }, [documents.documents, updateDocuments]);

    const updateDocument = useCallback((documentId: string, updates: Partial<TravelDocument>) => {
      const updatedDocuments = documents.documents.map(doc =>
        doc.id === documentId ? { ...doc, ...updates, updatedAt: new Date() } : doc
      );
      updateDocuments('documents', updatedDocuments);
    }, [documents.documents, updateDocuments]);

    const removeDocument = useCallback((documentId: string) => {
      const updatedDocuments = documents.documents.filter(doc => doc.id !== documentId);
      updateDocuments('documents', updatedDocuments);
    }, [documents.documents, updateDocuments]);

    const checkDocumentStatus = useCallback((document: TravelDocument): TravelDocument['status'] => {
      const now = new Date();
      const expiryDate = new Date(document.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return 'expired';
      if (daysUntilExpiry <= 90) return 'expiring-soon';
      return 'valid';
    }, []);

    const generateAlerts = useCallback(() => {
      const alerts: DocumentAlert[] = [];
      
      documents.documents.forEach(doc => {
        const status = checkDocumentStatus(doc);
        
        if (status === 'expired') {
          alerts.push({
            id: `alert-${doc.id}-expired`,
            documentId: doc.id,
            type: 'expiry',
            severity: 'critical',
            message: `${doc.title} has expired`,
            actionRequired: 'Renew document immediately',
            dueDate: doc.expiryDate,
            isRead: false,
            createdAt: new Date()
          });
        } else if (status === 'expiring-soon') {
          alerts.push({
            id: `alert-${doc.id}-expiring`,
            documentId: doc.id,
            type: 'expiry',
            severity: 'warning',
            message: `${doc.title} expires soon`,
            actionRequired: 'Consider renewing document',
            dueDate: doc.expiryDate,
            isRead: false,
            createdAt: new Date()
          });
        }
      });
      
      updateDocuments('alerts', alerts);
    }, [documents.documents, checkDocumentStatus, updateDocuments]);

    useEffect(() => {
      generateAlerts();
    }, [generateAlerts]);

    const getDocumentIcon = (docType: string) => {
      return documentTypes.find(type => type.id === docType)?.icon || '📄';
    };

    const getDocumentColor = (docType: string) => {
      const type = documentTypes.find(type => type.id === docType);
      return type?.color || 'gray';
    };

    const getStatusColor = (status: TravelDocument['status']) => {
      switch (status) {
        case 'valid': return 'text-green-600 dark:text-green-400';
        case 'expiring-soon': return 'text-yellow-600 dark:text-yellow-400';
        case 'expired': return 'text-red-600 dark:text-red-400';
        case 'invalid': return 'text-gray-600 dark:text-gray-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getSeverityColor = (severity: DocumentAlert['severity']) => {
      switch (severity) {
        case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
        case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          travelDocumentsVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Travel Documents
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your travel documents and requirements
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsAddingDocument(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              + Add Document
            </button>
            {showUpload && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
                Upload
              </button>
            )}
          </div>
        </div>

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
              {tab.id === 'alerts' && documents.alerts.length > 0 && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full">
                  {documents.alerts.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'documents' && (
            <div className="space-y-4">
              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.documents.map((document) => (
                  <div
                    key={document.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedDocument(document)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getDocumentIcon(document.type)}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {document.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {document.documentNumber}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocument(document);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDocument(document.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={cn('font-medium', getStatusColor(checkDocumentStatus(document)))}>
                          {checkDocumentStatus(document).replace('-', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Issued:</span>
                        <span>{document.issueDate.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                        <span>{document.expiryDate.toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Country:</span>
                        <span>{document.issuingCountry}</span>
                      </div>
                    </div>
                    
                    {document.thumbnailUrl && (
                      <div className="mt-3">
                        <img
                          src={document.thumbnailUrl}
                          alt={document.title}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    {document.notes && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                        {document.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              {documents.documents.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📄</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No documents added yet
                  </h3>
                  <p>Start by adding your travel documents</p>
                  <button
                    onClick={() => setIsAddingDocument(true)}
                    className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Add First Document
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requirements' && showRequirements && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Document Requirements Checker
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Enter your destination to check required documents
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter destination country"
                    className="flex-1 p-2 border border-blue-300 dark:border-blue-600 rounded-md dark:bg-blue-800 dark:text-blue-100"
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Check Requirements
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.requirements.map((requirement) => (
                  <div key={requirement.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {requirement.destination}
                      </h4>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-md',
                        requirement.isRequired 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      )}>
                        {requirement.isRequired ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {requirement.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Processing Time:</span>
                        <span>{requirement.processingTime} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                        <span>${requirement.cost} {requirement.currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Validity:</span>
                        <span>{requirement.validityPeriod} months</span>
                      </div>
                    </div>
                    
                    {requirement.applicationUrl && (
                      <div className="mt-3">
                        <a
                          href={requirement.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          Apply Online →
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && showExpiryAlerts && (
            <div className="space-y-4">
              {documents.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 rounded-lg border-l-4',
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                    'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="text-xl">
                        {alert.type === 'expiry' ? '⏰' :
                         alert.type === 'requirement' ? '📋' :
                         alert.type === 'missing' ? '❌' : '⚠️'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {alert.message}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {alert.actionRequired}
                        </p>
                        {alert.dueDate && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Due: {alert.dueDate.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-md',
                        getSeverityColor(alert.severity)
                      )}>
                        {alert.severity}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {documents.alerts.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    All good!
                  </h3>
                  <p>No alerts at this time</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Document Modal */}
        {isAddingDocument && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Add New Document
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Document Type
                  </label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300">
                    {documentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter document title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Document Number
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    placeholder="Enter document number"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsAddingDocument(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Add document logic here
                    setIsAddingDocument(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Document
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TravelDocuments.displayName = 'TravelDocuments';

// Travel Documents Demo Component
interface TravelDocumentsDemoProps {
  className?: string;
  showControls?: boolean;
}

export const TravelDocumentsDemo = React.forwardRef<HTMLDivElement, TravelDocumentsDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [documents, setDocuments] = useState<Partial<TravelDocumentsData>>({});

    const handleDocumentsUpdate = (updatedDocuments: TravelDocumentsData) => {
      setDocuments(updatedDocuments);
      console.log('Documents updated:', updatedDocuments);
    };

    const mockDocuments: Partial<TravelDocumentsData> = {
      id: 'traveler-1',
      travelerId: 'user-123',
      travelerName: 'John Doe',
      documents: [
        {
          id: 'passport-1',
          type: 'passport',
          title: 'US Passport',
          documentNumber: '123456789',
          issuingCountry: 'United States',
          issueDate: new Date('2020-01-15'),
          expiryDate: new Date('2030-01-15'),
          status: 'valid',
          notes: 'Valid passport',
          isRequired: true,
          priority: 'high',
          tags: ['passport', 'travel'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      requirements: [
        {
          id: 'req-1',
          destination: 'France',
          documentType: 'visa',
          isRequired: false,
          validityPeriod: 90,
          processingTime: 15,
          cost: 0,
          currency: 'USD',
          description: 'Schengen visa not required for US citizens',
          requirements: ['Valid passport', 'Return ticket'],
          applicationUrl: 'https://example.com'
        }
      ],
      alerts: [],
      lastUpdated: new Date()
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
          Travel Documents Demo
        </h3>
        
        <TravelDocuments
          onDocumentsUpdate={handleDocumentsUpdate}
          initialDocuments={mockDocuments}
          showExpiryAlerts={true}
          showRequirements={true}
          showUpload={true}
          showValidation={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive travel document management with passport tracking, visa requirements, expiry alerts, and document validation.
            </p>
          </div>
        )}
      </div>
    );
  }
);

TravelDocumentsDemo.displayName = 'TravelDocumentsDemo';

// Export all components
export {
  travelDocumentsVariants,
  type TravelDocumentsProps,
  type TravelDocumentsData,
  type TravelDocument,
  type DocumentRequirement,
  type DocumentAlert,
  type TravelDocumentsDemoProps
};
