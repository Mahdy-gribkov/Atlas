/**
 * Document Management Component
 * 
 * Provides travel document organization and tracking for Atlas travel agent.
 * Implements document storage, organization, and travel document management.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Document Management Variants
const documentManagementVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'document-management-mode-standard',
        'enhanced': 'document-management-mode-enhanced',
        'advanced': 'document-management-mode-advanced',
        'custom': 'document-management-mode-custom'
      },
      type: {
        'personal': 'document-type-personal',
        'group': 'document-type-group',
        'business': 'document-type-business',
        'mixed': 'document-type-mixed'
      },
      style: {
        'minimal': 'document-style-minimal',
        'moderate': 'document-style-moderate',
        'detailed': 'document-style-detailed',
        'custom': 'document-style-custom'
      },
      format: {
        'text': 'document-format-text',
        'visual': 'document-format-visual',
        'interactive': 'document-format-interactive',
        'mixed': 'document-format-mixed'
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

// Document Management Props
interface DocumentManagementProps extends VariantProps<typeof documentManagementVariants> {
  className?: string;
  onDocumentUpdate?: (documents: DocumentData[]) => void;
  initialDocuments?: Partial<DocumentManagementData>;
  showUpload?: boolean;
  showSharing?: boolean;
  showExpiry?: boolean;
  showBackup?: boolean;
}

// Document Management Data Interface
interface DocumentManagementData {
  id: string;
  tripId: string;
  tripName: string;
  documents: DocumentData[];
  categories: DocumentCategory[];
  folders: DocumentFolder[];
  sharedDocuments: SharedDocument[];
  expiryAlerts: ExpiryAlert[];
  settings: DocumentSettings;
  createdAt: Date;
  updatedAt: Date;
}

// Document Data Interface
interface DocumentData {
  id: string;
  name: string;
  type: 'passport' | 'visa' | 'id' | 'insurance' | 'vaccination' | 'itinerary' | 'booking' | 'receipt' | 'other';
  category: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  expiryDate?: Date;
  issuingCountry?: string;
  issuingAuthority?: string;
  documentNumber?: string;
  tags: string[];
  isShared: boolean;
  sharedWith: string[];
  isEncrypted: boolean;
  version: number;
  previousVersions: DocumentVersion[];
  metadata: DocumentMetadata;
  status: 'active' | 'expired' | 'pending' | 'rejected';
  notes: string;
}

// Document Category Interface
interface DocumentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  isDefault: boolean;
  sortOrder: number;
}

// Document Folder Interface
interface DocumentFolder {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  documents: string[];
  subfolders: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

// Shared Document Interface
interface SharedDocument {
  id: string;
  documentId: string;
  sharedWith: string[];
  permissions: 'view' | 'download' | 'edit';
  sharedBy: string;
  sharedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

// Expiry Alert Interface
interface ExpiryAlert {
  id: string;
  documentId: string;
  documentName: string;
  expiryDate: Date;
  alertType: 'expired' | 'expiring-soon' | 'expiring-today';
  daysUntilExpiry: number;
  isRead: boolean;
  createdAt: Date;
}

// Document Version Interface
interface DocumentVersion {
  id: string;
  version: number;
  fileUrl: string;
  uploadedAt: Date;
  uploadedBy: string;
  changeNotes: string;
  fileSize: number;
}

// Document Metadata Interface
interface DocumentMetadata {
  width?: number;
  height?: number;
  duration?: number; // for videos
  pages?: number; // for PDFs
  language?: string;
  ocrText?: string;
  extractedData?: Record<string, any>;
}

// Document Settings Interface
interface DocumentSettings {
  autoBackup: boolean;
  encryptionEnabled: boolean;
  expiryNotifications: boolean;
  expiryNotificationDays: number[];
  autoCategorization: boolean;
  ocrEnabled: boolean;
  maxFileSize: number; // in MB
  allowedFileTypes: string[];
  retentionPolicy: {
    enabled: boolean;
    daysAfterTrip: number;
  };
}

// Document Management Component
export const DocumentManagement = React.forwardRef<HTMLDivElement, DocumentManagementProps>(
  ({ 
    className, 
    onDocumentUpdate,
    initialDocuments,
    showUpload = true,
    showSharing = true,
    showExpiry = true,
    showBackup = true,
    type = 'mixed',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [documents, setDocuments] = useState<DocumentManagementData>(
      initialDocuments || {
        id: '',
        tripId: '',
        tripName: '',
        documents: [],
        categories: [],
        folders: [],
        sharedDocuments: [],
        expiryAlerts: [],
        settings: {
          autoBackup: true,
          encryptionEnabled: false,
          expiryNotifications: true,
          expiryNotificationDays: [30, 14, 7, 1],
          autoCategorization: true,
          ocrEnabled: true,
          maxFileSize: 50,
          allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
          retentionPolicy: {
            enabled: false,
            daysAfterTrip: 365
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );

    const [activeTab, setActiveTab] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedDocument, setSelectedDocument] = useState<DocumentData | null>(null);

    const tabs = [
      { id: 'all', name: 'All Documents', icon: '📄' },
      { id: 'passport', name: 'Passport', icon: '📘' },
      { id: 'visa', name: 'Visa', icon: '📋' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️' },
      { id: 'booking', name: 'Bookings', icon: '🎫' },
      { id: 'expired', name: 'Expired', icon: '⚠️' }
    ];

    const documentTypes = [
      { id: 'passport', name: 'Passport', icon: '📘', color: 'blue' },
      { id: 'visa', name: 'Visa', icon: '📋', color: 'green' },
      { id: 'id', name: 'ID Card', icon: '🆔', color: 'purple' },
      { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'orange' },
      { id: 'vaccination', name: 'Vaccination', icon: '💉', color: 'red' },
      { id: 'itinerary', name: 'Itinerary', icon: '🗺️', color: 'indigo' },
      { id: 'booking', name: 'Booking', icon: '🎫', color: 'pink' },
      { id: 'receipt', name: 'Receipt', icon: '🧾', color: 'yellow' },
      { id: 'other', name: 'Other', icon: '📄', color: 'gray' }
    ];

    const defaultCategories = [
      { id: 'travel-docs', name: 'Travel Documents', icon: '✈️', color: 'blue', isDefault: true, sortOrder: 1 },
      { id: 'health', name: 'Health & Medical', icon: '🏥', color: 'red', isDefault: true, sortOrder: 2 },
      { id: 'financial', name: 'Financial', icon: '💰', color: 'green', isDefault: true, sortOrder: 3 },
      { id: 'accommodation', name: 'Accommodation', icon: '🏨', color: 'purple', isDefault: true, sortOrder: 4 },
      { id: 'transportation', name: 'Transportation', icon: '🚗', color: 'orange', isDefault: true, sortOrder: 5 },
      { id: 'activities', name: 'Activities', icon: '🎯', color: 'pink', isDefault: true, sortOrder: 6 }
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
        newDocuments.updatedAt = new Date();
        onDocumentUpdate?.(newDocuments.documents);
        return newDocuments;
      });
    }, [onDocumentUpdate]);

    const addDocument = useCallback((file: File) => {
      const newDocument: DocumentData = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: 'other',
        category: 'travel-docs',
        description: '',
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: 'current-user',
        uploadedAt: new Date(),
        lastModified: new Date(),
        tags: [],
        isShared: false,
        sharedWith: [],
        isEncrypted: false,
        version: 1,
        previousVersions: [],
        metadata: {},
        status: 'active',
        notes: ''
      };
      updateDocuments('documents', [...documents.documents, newDocument]);
    }, [documents.documents, updateDocuments]);

    const deleteDocument = useCallback((documentId: string) => {
      const updatedDocuments = documents.documents.filter(doc => doc.id !== documentId);
      updateDocuments('documents', updatedDocuments);
    }, [documents.documents, updateDocuments]);

    const shareDocument = useCallback((documentId: string, sharedWith: string[], permissions: SharedDocument['permissions']) => {
      const sharedDoc: SharedDocument = {
        id: `shared-${Date.now()}`,
        documentId,
        sharedWith,
        permissions,
        sharedBy: 'current-user',
        sharedAt: new Date(),
        isActive: true
      };
      updateDocuments('sharedDocuments', [...documents.sharedDocuments, sharedDoc]);
      
      // Update document sharing status
      const updatedDocuments = documents.documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, isShared: true, sharedWith: [...doc.sharedWith, ...sharedWith] }
          : doc
      );
      updateDocuments('documents', updatedDocuments);
    }, [documents.documents, documents.sharedDocuments, updateDocuments]);

    const initializeCategories = useCallback(() => {
      if (documents.categories.length === 0) {
        updateDocuments('categories', defaultCategories);
      }
    }, [documents.categories.length, updateDocuments]);

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const getDocumentTypeIcon = (type: DocumentData['type']) => {
      const docType = documentTypes.find(t => t.id === type);
      return docType?.icon || '📄';
    };

    const getDocumentTypeName = (type: DocumentData['type']) => {
      const docType = documentTypes.find(t => t.id === type);
      return docType?.name || type;
    };

    const getDocumentTypeColor = (type: DocumentData['type']) => {
      const docType = documentTypes.find(t => t.id === type);
      return docType?.color || 'gray';
    };

    const getStatusColor = (status: DocumentData['status']) => {
      switch (status) {
        case 'active': return 'text-green-600 dark:text-green-400';
        case 'expired': return 'text-red-600 dark:text-red-400';
        case 'pending': return 'text-yellow-600 dark:text-yellow-400';
        case 'rejected': return 'text-gray-600 dark:text-gray-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const isExpiringSoon = (expiryDate?: Date) => {
      if (!expiryDate) return false;
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const isExpired = (expiryDate?: Date) => {
      if (!expiryDate) return false;
      return expiryDate.getTime() < new Date().getTime();
    };

    const getCurrentDocuments = useCallback(() => {
      switch (activeTab) {
        case 'passport':
          return documents.documents.filter(doc => doc.type === 'passport');
        case 'visa':
          return documents.documents.filter(doc => doc.type === 'visa');
        case 'insurance':
          return documents.documents.filter(doc => doc.type === 'insurance');
        case 'booking':
          return documents.documents.filter(doc => doc.type === 'booking');
        case 'expired':
          return documents.documents.filter(doc => isExpired(doc.expiryDate));
        case 'all':
          return documents.documents;
        default:
          return documents.documents;
      }
    }, [activeTab, documents.documents]);

    useEffect(() => {
      initializeCategories();
    }, [initializeCategories]);

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-6',
          documentManagementVariants({ type, style }),
          className
        )}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Document Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Organize and manage your {documents.tripName || 'trip'} documents
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-3 py-1 text-sm rounded-l-md transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ⊞ Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-3 py-1 text-sm rounded-r-md transition-colors duration-200',
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                )}
              >
                ☰ List
              </button>
            </div>
            {showUpload && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                📤 Upload
              </button>
            )}
          </div>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {documents.documents.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Documents</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {documents.documents.filter(doc => doc.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {documents.documents.filter(doc => isExpiringSoon(doc.expiryDate)).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expiring Soon</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {documents.documents.filter(doc => isExpired(doc.expiryDate)).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expired</div>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📤</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Upload Documents
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files) {
                    Array.from(e.target.files).forEach(addDocument);
                  }
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
              >
                Choose Files
              </label>
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
          {getCurrentDocuments().length > 0 ? (
            <div className={cn(
              'gap-4',
              viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
              viewMode === 'list' && 'space-y-3'
            )}>
              {getCurrentDocuments()
                .filter(doc => !selectedCategory || doc.category === selectedCategory)
                .map((document) => (
                <div
                  key={document.id}
                  className={cn(
                    'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer',
                    viewMode === 'list' && 'flex'
                  )}
                  onClick={() => setSelectedDocument(document)}
                >
                  {viewMode === 'list' ? (
                    <div className="flex w-full p-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mr-4">
                        <span className="text-xl">{getDocumentTypeIcon(document.type)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {document.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'px-2 py-1 text-xs rounded-md',
                              `bg-${getDocumentTypeColor(document.type)}-100 text-${getDocumentTypeColor(document.type)}-800 dark:bg-${getDocumentTypeColor(document.type)}-900 dark:text-${getDocumentTypeColor(document.type)}-200`
                            )}>
                              {getDocumentTypeName(document.type)}
                            </span>
                            <span className={cn('text-xs', getStatusColor(document.status))}>
                              {document.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>📅 {formatDate(document.uploadedAt)}</span>
                          <span>📏 {formatFileSize(document.fileSize)}</span>
                          {document.expiryDate && (
                            <span className={cn(
                              'font-medium',
                              isExpired(document.expiryDate) ? 'text-red-600 dark:text-red-400' :
                              isExpiringSoon(document.expiryDate) ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-gray-600 dark:text-gray-400'
                            )}>
                              ⏰ Expires {formatDate(document.expiryDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="aspect-square bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-4xl">{getDocumentTypeIcon(document.type)}</span>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                            {document.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            {document.isShared && (
                              <span className="text-blue-500" title="Shared">🔗</span>
                            )}
                            {document.isEncrypted && (
                              <span className="text-green-500" title="Encrypted">🔒</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex justify-between">
                            <span>Type:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {getDocumentTypeName(document.type)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Size:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatFileSize(document.fileSize)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Uploaded:</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(document.uploadedAt)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={cn('font-medium', getStatusColor(document.status))}>
                              {document.status}
                            </span>
                          </div>
                          
                          {document.expiryDate && (
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span className={cn(
                                'font-medium',
                                isExpired(document.expiryDate) ? 'text-red-600 dark:text-red-400' :
                                isExpiringSoon(document.expiryDate) ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-gray-600 dark:text-gray-400'
                              )}>
                                {formatDate(document.expiryDate)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex gap-1">
                            {document.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-1">
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200">
                              👁️
                            </button>
                            {showSharing && (
                              <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors duration-200">
                                🔗
                              </button>
                            )}
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteDocument(document.id);
                              }}
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No documents found
              </h3>
              <p>Upload your travel documents to get started</p>
            </div>
          )}
        </div>

        {/* Document Modal */}
        {selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex">
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedDocument.name}
                    </h3>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                          {getDocumentTypeName(selectedDocument.type)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Size:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                          {formatFileSize(selectedDocument.fileSize)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Uploaded:</span>
                        <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">
                          {formatDate(selectedDocument.uploadedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={cn('ml-2 font-medium', getStatusColor(selectedDocument.status))}>
                          {selectedDocument.status}
                        </span>
                      </div>
                    </div>
                    
                    {selectedDocument.description && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Description:</span>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">
                          {selectedDocument.description}
                        </p>
                      </div>
                    )}
                    
                    {selectedDocument.expiryDate && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Expiry Date:</span>
                        <span className={cn(
                          'ml-2 font-medium',
                          isExpired(selectedDocument.expiryDate) ? 'text-red-600 dark:text-red-400' :
                          isExpiringSoon(selectedDocument.expiryDate) ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-gray-600 dark:text-gray-400'
                        )}>
                          {formatDate(selectedDocument.expiryDate)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                        Download
                      </button>
                      {showSharing && (
                        <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                          Share
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DocumentManagement.displayName = 'DocumentManagement';

// Document Management Demo Component
interface DocumentManagementDemoProps {
  className?: string;
  showControls?: boolean;
}

export const DocumentManagementDemo = React.forwardRef<HTMLDivElement, DocumentManagementDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [documents, setDocuments] = useState<Partial<DocumentManagementData>>({});

    const handleDocumentUpdate = (updatedDocuments: DocumentData[]) => {
      setDocuments(prev => ({ ...prev, documents: updatedDocuments }));
      console.log('Documents updated:', updatedDocuments);
    };

    const mockDocuments: Partial<DocumentManagementData> = {
      id: 'docs-1',
      tripId: 'trip-1',
      tripName: 'Paris Adventure',
      documents: [],
      categories: [],
      folders: [],
      sharedDocuments: [],
      expiryAlerts: [],
      settings: {
        autoBackup: true,
        encryptionEnabled: false,
        expiryNotifications: true,
        expiryNotificationDays: [30, 14, 7, 1],
        autoCategorization: true,
        ocrEnabled: true,
        maxFileSize: 50,
        allowedFileTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
        retentionPolicy: {
          enabled: false,
          daysAfterTrip: 365
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
          Document Management Demo
        </h3>
        
        <DocumentManagement
          onDocumentUpdate={handleDocumentUpdate}
          initialDocuments={mockDocuments}
          showUpload={true}
          showSharing={true}
          showExpiry={true}
          showBackup={true}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive document management with upload, organization, sharing, expiry tracking, and security features.
            </p>
          </div>
        )}
      </div>
    );
  }
);

DocumentManagementDemo.displayName = 'DocumentManagementDemo';

// Export all components
export {
  documentManagementVariants,
  type DocumentManagementProps,
  type DocumentManagementData,
  type DocumentData,
  type DocumentCategory,
  type DocumentFolder,
  type SharedDocument,
  type ExpiryAlert,
  type DocumentVersion,
  type DocumentMetadata,
  type DocumentSettings,
  type DocumentManagementDemoProps
};
