/**
 * Document Processing Component
 * 
 * Provides travel document analysis and processing capabilities for AI travel agent.
 * Implements advanced document understanding and extraction features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Document Processing Variants
const documentProcessingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'document-processing-mode-standard',
        'enhanced': 'document-processing-mode-enhanced',
        'advanced': 'document-processing-mode-advanced',
        'custom': 'document-processing-mode-custom'
      },
      type: {
        'passport': 'document-type-passport',
        'visa': 'document-type-visa',
        'booking': 'document-type-booking',
        'insurance': 'document-type-insurance',
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

// Document Processing Toggle Props
interface DocumentProcessingToggleProps extends VariantProps<typeof documentProcessingVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Document Processing Toggle Component
export const DocumentProcessingToggle = React.forwardRef<HTMLButtonElement, DocumentProcessingToggleProps>(
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
            ? 'bg-amber-600 text-white border-amber-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable document processing' : 'Enable document processing'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Document processing enabled' : 'Document processing disabled'}
          </span>
        )}
      </button>
    );
  }
);

DocumentProcessingToggle.displayName = 'DocumentProcessingToggle';

// Document Processing Provider Props
interface DocumentProcessingProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'passport' | 'visa' | 'booking' | 'insurance' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Document Processing Provider Component
export const DocumentProcessingProvider = React.forwardRef<HTMLDivElement, DocumentProcessingProviderProps>(
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
        // Remove existing document processing classes
        document.body.classList.remove(
          'document-processing-mode-standard',
          'document-processing-mode-enhanced',
          'document-processing-mode-advanced',
          'document-processing-mode-custom'
        );
        
        document.body.classList.add(`document-processing-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          documentProcessingVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DocumentProcessingProvider.displayName = 'DocumentProcessingProvider';

// Document Processing Engine Component
interface DocumentProcessingEngineProps extends VariantProps<typeof documentProcessingVariants> {
  className?: string;
  onDocumentProcessed?: (document: any) => void;
  type?: 'passport' | 'visa' | 'booking' | 'insurance' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const DocumentProcessingEngine = React.forwardRef<HTMLDivElement, DocumentProcessingEngineProps>(
  ({ 
    className, 
    onDocumentProcessed,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [documentProcessing, setDocumentProcessing] = useState({
      isProcessing: false,
      currentDocument: null,
      processedDocuments: [
        {
          id: 1,
          type: 'passport',
          name: 'US Passport',
          status: 'valid',
          expiryDate: '2029-05-15',
          country: 'United States',
          passportNumber: 'US123456789',
          extractedData: {
            fullName: 'John Smith',
            dateOfBirth: '1985-03-20',
            placeOfBirth: 'New York, USA',
            nationality: 'American',
            gender: 'Male',
            issueDate: '2019-05-15',
            expiryDate: '2029-05-15'
          },
          confidence: 0.95,
          processingTime: '3.2s'
        },
        {
          id: 2,
          type: 'visa',
          name: 'Schengen Visa',
          status: 'valid',
          expiryDate: '2024-12-31',
          country: 'France',
          visaNumber: 'FR987654321',
          extractedData: {
            visaType: 'Tourist',
            entryType: 'Multiple Entry',
            duration: '90 days',
            validFrom: '2024-06-01',
            validUntil: '2024-12-31',
            purpose: 'Tourism'
          },
          confidence: 0.92,
          processingTime: '2.8s'
        },
        {
          id: 3,
          type: 'booking',
          name: 'Flight Booking',
          status: 'confirmed',
          expiryDate: '2024-06-15',
          airline: 'Air France',
          bookingReference: 'AF123456',
          extractedData: {
            flightNumber: 'AF123',
            departure: 'JFK',
            arrival: 'CDG',
            departureTime: '2024-06-15 14:30',
            arrivalTime: '2024-06-16 06:45',
            passengerName: 'John Smith',
            seatNumber: '12A',
            class: 'Economy'
          },
          confidence: 0.89,
          processingTime: '2.1s'
        }
      ],
      capabilities: {
        passportScanning: true,
        visaProcessing: true,
        bookingExtraction: true,
        insuranceAnalysis: true,
        textRecognition: true,
        dataValidation: true,
        expiryTracking: true,
        complianceCheck: true
      },
      metrics: {
        accuracy: 96,
        processingTime: '2.7s',
        supportedFormats: ['PDF', 'JPEG', 'PNG', 'TIFF'],
        documentsProcessed: 1247,
        successRate: 98
      }
    });

    const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
    const [documentPreview, setDocumentPreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState('passport');

    const handleDocumentUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedDocument(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setDocumentPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }, []);

    const processDocument = useCallback(async () => {
      if (!selectedDocument) return;
      
      setIsAnalyzing(true);
      
      // Simulate document processing
      setTimeout(() => {
        const newDocument = {
          id: Date.now(),
          type: selectedDocumentType,
          name: selectedDocument.name,
          status: 'processed',
          confidence: 0.94,
          processingTime: '2.5s',
          extractedData: {
            documentType: selectedDocumentType,
            processedAt: new Date().toISOString(),
            fileName: selectedDocument.name,
            fileSize: selectedDocument.size
          }
        };
        
        setDocumentProcessing(prev => ({
          ...prev,
          isProcessing: false,
          currentDocument: selectedDocument.name,
          processedDocuments: [newDocument, ...prev.processedDocuments]
        }));
        
        setIsAnalyzing(false);
        onDocumentProcessed?.(newDocument);
      }, 3000);
    }, [selectedDocument, selectedDocumentType, onDocumentProcessed]);

    const getDocumentIcon = (type: string) => {
      switch (type) {
        case 'passport': return '📘';
        case 'visa': return '📋';
        case 'booking': return '✈️';
        case 'insurance': return '🛡️';
        default: return '📄';
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'valid': return 'text-green-600 dark:text-green-400';
        case 'confirmed': return 'text-green-600 dark:text-green-400';
        case 'expired': return 'text-red-600 dark:text-red-400';
        case 'expiring': return 'text-yellow-600 dark:text-yellow-400';
        case 'invalid': return 'text-red-600 dark:text-red-400';
        default: return 'text-gray-600 dark:text-gray-400';
      }
    };

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
      if (confidence >= 0.8) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 0.7) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const isExpiringSoon = (expiryDate: string) => {
      const expiry = new Date(expiryDate);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    };

    const isExpired = (expiryDate: string) => {
      const expiry = new Date(expiryDate);
      const now = new Date();
      return expiry < now;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          documentProcessingVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Document Processing
          </h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-3 h-3 rounded-full',
              isAnalyzing ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'
            )} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isAnalyzing ? 'Processing' : 'Ready'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-amber-50 rounded-md dark:bg-amber-900/20">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {documentProcessing.metrics.accuracy}%
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400">
                Accuracy
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {documentProcessing.metrics.processingTime}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Processing Time
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {documentProcessing.metrics.documentsProcessed}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Documents Processed
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {documentProcessing.metrics.successRate}%
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Success Rate
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Upload Document
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Document Type
                  </label>
                  <select
                    value={selectedDocumentType}
                    onChange={(e) => setSelectedDocumentType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  >
                    <option value="passport">Passport</option>
                    <option value="visa">Visa</option>
                    <option value="booking">Flight/Hotel Booking</option>
                    <option value="insurance">Travel Insurance</option>
                  </select>
                </div>
                
                <div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.tiff"
                    onChange={handleDocumentUpload}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                
                {documentPreview && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Document Preview
                    </div>
                    <img
                      src={documentPreview}
                      alt="Document Preview"
                      className="max-w-full h-48 object-contain rounded-md border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      onClick={processDocument}
                      disabled={isAnalyzing}
                      className="w-full px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isAnalyzing ? 'Processing Document...' : 'Process Document'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Processed Documents
              </h4>
              <div className="space-y-3">
                {documentProcessing.processedDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 border border-gray-200 rounded-lg dark:border-gray-600">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {doc.name}
                          </h5>
                          <div className="flex items-center gap-2">
                            <span className={cn('text-xs font-medium', getStatusColor(doc.status))}>
                              {doc.status}
                            </span>
                            <span className={cn('text-xs font-medium', getConfidenceColor(doc.confidence))}>
                              {Math.round(doc.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {doc.country && `Country: ${doc.country}`}
                          {doc.airline && `Airline: ${doc.airline}`}
                          {doc.expiryDate && `Expiry: ${doc.expiryDate}`}
                        </div>
                        
                        {doc.extractedData && (
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Extracted Data:
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 dark:text-gray-500">
                              {Object.entries(doc.extractedData).slice(0, 4).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {String(value)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            Processed in {doc.processingTime}
                          </div>
                          <div className="flex gap-1">
                            {isExpired(doc.expiryDate) && (
                              <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full dark:bg-red-900 dark:text-red-200">
                                Expired
                              </span>
                            )}
                            {isExpiringSoon(doc.expiryDate) && !isExpired(doc.expiryDate) && (
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full dark:bg-yellow-900 dark:text-yellow-200">
                                Expiring Soon
                              </span>
                            )}
                            <button className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800">
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Processing Capabilities
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(documentProcessing.capabilities).map(([capability, enabled]) => (
                  <div key={capability} className="flex items-center gap-2 p-2 border border-gray-200 rounded-md dark:border-gray-600">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      enabled ? 'bg-green-500' : 'bg-gray-400'
                    )} />
                    <span className="text-xs text-gray-800 dark:text-gray-200 capitalize">
                      {capability.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Supported Formats
              </h4>
              <div className="flex flex-wrap gap-2">
                {documentProcessing.metrics.supportedFormats.map((format) => (
                  <span key={format} className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full dark:bg-gray-700 dark:text-gray-200">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DocumentProcessingEngine.displayName = 'DocumentProcessingEngine';

// Document Processing Status Component
interface DocumentProcessingStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const DocumentProcessingStatus = React.forwardRef<HTMLDivElement, DocumentProcessingStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-amber-500" />
        <span className="font-medium">
          Document Processing: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Travel document analysis and extraction' 
              : 'Manual document handling'
            }
          </div>
        )}
      </div>
    );
  }
);

DocumentProcessingStatus.displayName = 'DocumentProcessingStatus';

// Document Processing Demo Component
interface DocumentProcessingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const DocumentProcessingDemo = React.forwardRef<HTMLDivElement, DocumentProcessingDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Document Processing Demo</h3>
        
        <DocumentProcessingEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onDocumentProcessed={(document) => console.log('Document processed:', document)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced document processing for passports, visas, bookings, and travel insurance documents.
            </p>
          </div>
        )}
      </div>
    );
  }
);

DocumentProcessingDemo.displayName = 'DocumentProcessingDemo';

// Export all components
export {
  documentProcessingVariants,
  type DocumentProcessingToggleProps,
  type DocumentProcessingProviderProps,
  type DocumentProcessingEngineProps,
  type DocumentProcessingStatusProps,
  type DocumentProcessingDemoProps
};
