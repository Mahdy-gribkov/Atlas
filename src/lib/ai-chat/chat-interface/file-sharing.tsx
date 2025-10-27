/**
 * File Sharing Component
 * 
 * Provides file sharing and attachment capabilities for AI chat interface.
 * Implements advanced file upload, preview, and sharing features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// File Sharing Variants
const fileSharingVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'file-sharing-mode-standard',
        'enhanced': 'file-sharing-mode-enhanced',
        'advanced': 'file-sharing-mode-advanced',
        'custom': 'file-sharing-mode-custom'
      },
      type: {
        'upload': 'file-type-upload',
        'preview': 'file-type-preview',
        'download': 'file-type-download',
        'gallery': 'file-type-gallery',
        'mixed': 'file-type-mixed'
      },
      style: {
        'minimal': 'file-style-minimal',
        'moderate': 'file-style-moderate',
        'detailed': 'file-style-detailed',
        'custom': 'file-style-custom'
      },
      format: {
        'text': 'file-format-text',
        'visual': 'file-format-visual',
        'interactive': 'file-format-interactive',
        'mixed': 'file-format-mixed'
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

// File Upload Props
interface FileUploadProps extends VariantProps<typeof fileSharingVariants> {
  className?: string;
  onFileSelect?: (files: File[]) => void;
  onFileUpload?: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  showPreview?: boolean;
  showProgress?: boolean;
  dragAndDrop?: boolean;
}

// File Upload Component
export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({ 
    className, 
    onFileSelect,
    onFileUpload,
    accept = "*/*",
    multiple = true,
    maxSize = 10, // 10MB
    maxFiles = 5,
    disabled = false,
    showPreview = true,
    showProgress = true,
    dragAndDrop = true,
    type = 'upload',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<Map<string, number>>(new Map());
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File): string | null => {
      if (file.size > maxSize * 1024 * 1024) {
        return `File size must be less than ${maxSize}MB`;
      }
      return null;
    }, [maxSize]);

    const handleFileSelect = useCallback((selectedFiles: FileList | File[]) => {
      const fileArray = Array.from(selectedFiles);
      const validFiles: File[] = [];
      const errors: string[] = [];

      fileArray.forEach(file => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else if (validFiles.length < maxFiles) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: Maximum ${maxFiles} files allowed`);
        }
      });

      if (errors.length > 0) {
        console.warn('File validation errors:', errors);
      }

      if (validFiles.length > 0) {
        setFiles(prev => [...prev, ...validFiles]);
        onFileSelect?.(validFiles);
      }
    }, [maxSize, maxFiles, validateFile, onFileSelect]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileSelect(e.target.files);
      }
    }, [handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled && dragAndDrop) {
        setIsDragging(true);
      }
    }, [disabled, dragAndDrop]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      if (!disabled && dragAndDrop && e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files);
      }
    }, [disabled, dragAndDrop, handleFileSelect]);

    const handleUpload = useCallback(async () => {
      if (files.length === 0 || !onFileUpload) return;
      
      setIsUploading(true);
      setUploadProgress(new Map());
      
      try {
        // Simulate upload progress
        for (const file of files) {
          const fileId = file.name;
          setUploadProgress(prev => new Map(prev).set(fileId, 0));
          
          // Simulate progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setUploadProgress(prev => new Map(prev).set(fileId, progress));
          }
        }
        
        await onFileUpload(files);
        setFiles([]);
        setUploadProgress(new Map());
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }, [files, onFileUpload]);

    const removeFile = useCallback((index: number) => {
      setFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const getFileIcon = (file: File) => {
      const type = file.type.split('/')[0];
      switch (type) {
        case 'image': return '🖼️';
        case 'video': return '🎥';
        case 'audio': return '🎵';
        case 'application': return '📄';
        case 'text': return '📝';
        default: return '📎';
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div
        ref={ref}
        className={cn(
          'space-y-4',
          fileSharingVariants({ type, style }),
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
            isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="text-4xl mb-2">📁</div>
          <div className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
            {isDragging ? 'Drop files here' : 'Upload files'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop files or click to browse
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            Max {maxSize}MB per file, up to {maxFiles} files
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Selected Files ({files.length})
              </h4>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isUploading ? 'Uploading...' : 'Upload All'}
              </button>
            </div>
            
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="text-lg">{getFileIcon(file)}</span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                      {file.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.size)} • {file.type}
                    </div>
                    
                    {showProgress && uploadProgress.has(file.name) && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress.get(file.name)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {uploadProgress.get(file.name)}% uploaded
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

// File Preview Props
interface FilePreviewProps {
  className?: string;
  file: {
    id: string;
    name: string;
    type: string;
    size: number;
    url?: string;
    thumbnail?: string;
  };
  onDownload?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  showActions?: boolean;
  showSize?: boolean;
}

// File Preview Component
export const FilePreview = React.forwardRef<HTMLDivElement, FilePreviewProps>(
  ({ 
    className, 
    file,
    onDownload,
    onDelete,
    showActions = true,
    showSize = true,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [previewError, setPreviewError] = useState(false);

    const getFileIcon = (type: string) => {
      const mainType = type.split('/')[0];
      switch (mainType) {
        case 'image': return '🖼️';
        case 'video': return '🎥';
        case 'audio': return '🎵';
        case 'application': return '📄';
        case 'text': return '📝';
        default: return '📎';
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    return (
      <div
        ref={ref}
        className={cn(
          'border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800',
          className
        )}
        {...props}
      >
        {isImage && file.url && !previewError ? (
          <div className="aspect-video bg-gray-100 dark:bg-gray-700">
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setPreviewError(true);
                setIsLoading(false);
              }}
            />
          </div>
        ) : isVideo && file.url ? (
          <div className="aspect-video bg-gray-100 dark:bg-gray-700">
            <video
              src={file.url}
              className="w-full h-full object-cover"
              controls
              onLoadStart={() => setIsLoading(true)}
              onLoadedData={() => setIsLoading(false)}
            />
          </div>
        ) : isAudio && file.url ? (
          <div className="p-4 bg-gray-100 dark:bg-gray-700">
            <audio
              src={file.url}
              controls
              className="w-full"
              onLoadStart={() => setIsLoading(true)}
              onLoadedData={() => setIsLoading(false)}
            />
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-100 dark:bg-gray-700">
            <div className="text-4xl mb-2">{getFileIcon(file.type)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? 'Loading preview...' : 'No preview available'}
            </div>
          </div>
        )}
        
        <div className="p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {file.name}
            </div>
            {showActions && (
              <div className="flex gap-1">
                {onDownload && (
                  <button
                    onClick={() => onDownload(file.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                    title="Download"
                  >
                    ⬇️
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                    title="Delete"
                  >
                    🗑️
                  </button>
                )}
              </div>
            )}
          </div>
          
          {showSize && (
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {formatFileSize(file.size)} • {file.type}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FilePreview.displayName = 'FilePreview';

// File Gallery Props
interface FileGalleryProps {
  className?: string;
  files: Array<FilePreviewProps['file']>;
  onDownload?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  columns?: number;
  showActions?: boolean;
}

// File Gallery Component
export const FileGallery = React.forwardRef<HTMLDivElement, FileGalleryProps>(
  ({ 
    className, 
    files,
    onDownload,
    onDelete,
    columns = 3,
    showActions = true,
    ...props 
  }, ref) => {
    if (files.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'text-center py-8 text-gray-500 dark:text-gray-400',
            className
          )}
          {...props}
        >
          <div className="text-4xl mb-2">📁</div>
          <div>No files to display</div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid gap-4',
          `grid-cols-${columns}`,
          className
        )}
        {...props}
      >
        {files.map((file) => (
          <FilePreview
            key={file.id}
            file={file}
            onDownload={onDownload}
            onDelete={onDelete}
            showActions={showActions}
          />
        ))}
      </div>
    );
  }
);

FileGallery.displayName = 'FileGallery';

// File Sharing Demo Component
interface FileSharingDemoProps {
  className?: string;
  showControls?: boolean;
}

export const FileSharingDemo = React.forwardRef<HTMLDivElement, FileSharingDemoProps>(
  ({ className, showControls = true }, ref) => {
    const [uploadedFiles, setUploadedFiles] = useState<Array<FilePreviewProps['file']>>([
      {
        id: '1',
        name: 'travel-photo.jpg',
        type: 'image/jpeg',
        size: 2048576,
        url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Travel+Photo',
        thumbnail: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Photo'
      },
      {
        id: '2',
        name: 'itinerary.pdf',
        type: 'application/pdf',
        size: 1024000,
        url: undefined
      },
      {
        id: '3',
        name: 'hotel-booking.pdf',
        type: 'application/pdf',
        size: 512000,
        url: undefined
      }
    ]);

    const handleFileSelect = (files: File[]) => {
      console.log('Files selected:', files);
    };

    const handleFileUpload = async (files: File[]) => {
      console.log('Files uploaded:', files);
      // Simulate adding uploaded files to gallery
      const newFiles = files.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    };

    const handleDownload = (fileId: string) => {
      console.log('Download file:', fileId);
    };

    const handleDelete = (fileId: string) => {
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
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
          File Sharing Demo
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              File Upload
            </h4>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileUpload={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.txt"
              maxSize={5}
              maxFiles={3}
              showPreview={true}
              showProgress={true}
              dragAndDrop={true}
            />
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
              File Gallery
            </h4>
            <FileGallery
              files={uploadedFiles}
              onDownload={handleDownload}
              onDelete={handleDelete}
              columns={3}
              showActions={true}
            />
          </div>
        </div>
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced file sharing with drag-and-drop upload, previews, and gallery management.
            </p>
          </div>
        )}
      </div>
    );
  }
);

FileSharingDemo.displayName = 'FileSharingDemo';

// Export all components
export {
  fileSharingVariants,
  type FileUploadProps,
  type FilePreviewProps,
  type FileGalleryProps,
  type FileSharingDemoProps
};
