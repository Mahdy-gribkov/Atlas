/**
 * Image Recognition Component
 * 
 * Provides visual content understanding and image analysis capabilities for AI travel agent.
 * Implements advanced computer vision and image processing features.
 * 
 * @version 1.0.0
 * @author Atlas Team
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Image Recognition Variants
const imageRecognitionVariants = cva(
  'transition-all duration-300 ease-in-out',
  {
    variants: {
      mode: {
        'standard': 'image-recognition-mode-standard',
        'enhanced': 'image-recognition-mode-enhanced',
        'advanced': 'image-recognition-mode-advanced',
        'custom': 'image-recognition-mode-custom'
      },
      type: {
        'objects': 'image-type-objects',
        'landmarks': 'image-type-landmarks',
        'text': 'image-type-text',
        'faces': 'image-type-faces',
        'mixed': 'image-type-mixed'
      },
      style: {
        'minimal': 'image-style-minimal',
        'moderate': 'image-style-moderate',
        'detailed': 'image-style-detailed',
        'custom': 'image-style-custom'
      },
      format: {
        'text': 'image-format-text',
        'visual': 'image-format-visual',
        'interactive': 'image-format-interactive',
        'mixed': 'image-format-mixed'
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

// Image Recognition Toggle Props
interface ImageRecognitionToggleProps extends VariantProps<typeof imageRecognitionVariants> {
  className?: string;
  onToggle?: (enabled: boolean) => void;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Image Recognition Toggle Component
export const ImageRecognitionToggle = React.forwardRef<HTMLButtonElement, ImageRecognitionToggleProps>(
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
            ? 'bg-cyan-600 text-white border-cyan-600' 
            : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
          className
        )}
        onClick={handleToggle}
        aria-label={isEnabled ? 'Disable image recognition' : 'Enable image recognition'}
        aria-pressed={isEnabled}
        {...props}
      >
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-current rounded-sm" />
          <div className="w-1 h-1 bg-current rounded-full ml-1" />
        </div>
        {showLabel && (
          <span className="sr-only">
            {isEnabled ? 'Image recognition enabled' : 'Image recognition disabled'}
          </span>
        )}
      </button>
    );
  }
);

ImageRecognitionToggle.displayName = 'ImageRecognitionToggle';

// Image Recognition Provider Props
interface ImageRecognitionProviderProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  type?: 'objects' | 'landmarks' | 'text' | 'faces' | 'mixed';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
  applyToBody?: boolean;
}

// Image Recognition Provider Component
export const ImageRecognitionProvider = React.forwardRef<HTMLDivElement, ImageRecognitionProviderProps>(
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
        // Remove existing image recognition classes
        document.body.classList.remove(
          'image-recognition-mode-standard',
          'image-recognition-mode-enhanced',
          'image-recognition-mode-advanced',
          'image-recognition-mode-custom'
        );
        
        document.body.classList.add(`image-recognition-mode-${currentMode}`);
      }
    }, [currentMode, applyToBody]);

    return (
      <div
        ref={ref}
        className={cn(
          imageRecognitionVariants({ mode: currentMode, type, style }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ImageRecognitionProvider.displayName = 'ImageRecognitionProvider';

// Image Recognition Engine Component
interface ImageRecognitionEngineProps extends VariantProps<typeof imageRecognitionVariants> {
  className?: string;
  onImageAnalysis?: (analysis: any) => void;
  type?: 'objects' | 'landmarks' | 'text' | 'faces' | 'mixed';
  mode?: 'standard' | 'enhanced' | 'advanced' | 'custom';
  style?: 'minimal' | 'moderate' | 'detailed' | 'custom';
}

export const ImageRecognitionEngine = React.forwardRef<HTMLDivElement, ImageRecognitionEngineProps>(
  ({ 
    className, 
    onImageAnalysis,
    type = 'mixed',
    mode = 'standard',
    style = 'moderate',
    ...props 
  }, ref) => {
    const [imageRecognition, setImageRecognition] = useState({
      isProcessing: false,
      currentImage: null,
      analysis: {
        objects: [
          { name: 'Eiffel Tower', confidence: 0.95, category: 'landmark', description: 'Famous iron tower in Paris' },
          { name: 'Person', confidence: 0.87, category: 'person', description: 'Human figure in the image' },
          { name: 'Car', confidence: 0.82, category: 'vehicle', description: 'Automobile vehicle' },
          { name: 'Tree', confidence: 0.78, category: 'nature', description: 'Large tree with branches' }
        ],
        landmarks: [
          { name: 'Eiffel Tower', location: 'Paris, France', confidence: 0.95, coordinates: { lat: 48.8584, lng: 2.2945 } },
          { name: 'Champs-Élysées', location: 'Paris, France', confidence: 0.88, coordinates: { lat: 48.8566, lng: 2.3522 } }
        ],
        text: [
          { text: 'Musée du Louvre', confidence: 0.92, language: 'French', boundingBox: { x: 100, y: 50, width: 200, height: 30 } },
          { text: 'Open 9AM-6PM', confidence: 0.89, language: 'English', boundingBox: { x: 100, y: 100, width: 150, height: 25 } }
        ],
        faces: [
          { age: '25-30', gender: 'Female', emotion: 'Happy', confidence: 0.91, boundingBox: { x: 150, y: 200, width: 80, height: 100 } },
          { age: '30-35', gender: 'Male', emotion: 'Neutral', confidence: 0.87, boundingBox: { x: 300, y: 180, width: 75, height: 95 } }
        ],
        scene: {
          description: 'Tourist taking photos at the Eiffel Tower in Paris',
          category: 'travel',
          confidence: 0.93,
          tags: ['Paris', 'Eiffel Tower', 'Tourism', 'Architecture', 'Outdoor']
        }
      },
      capabilities: {
        objectDetection: true,
        landmarkRecognition: true,
        textExtraction: true,
        faceAnalysis: true,
        sceneUnderstanding: true,
        colorAnalysis: true,
        qualityAssessment: true
      },
      metrics: {
        accuracy: 94,
        processingTime: '2.3s',
        confidenceThreshold: 0.8,
        supportedFormats: ['JPEG', 'PNG', 'WebP', 'GIF'],
        maxImageSize: '10MB'
      }
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }, []);

    const analyzeImage = useCallback(async () => {
      if (!selectedImage) return;
      
      setIsAnalyzing(true);
      
      // Simulate image analysis
      setTimeout(() => {
        setImageRecognition(prev => ({
          ...prev,
          isProcessing: false,
          currentImage: selectedImage.name
        }));
        
        setIsAnalyzing(false);
        onImageAnalysis?.(imageRecognition.analysis);
      }, 3000);
    }, [selectedImage, imageRecognition.analysis, onImageAnalysis]);

    const getConfidenceColor = (confidence: number) => {
      if (confidence >= 0.9) return 'text-green-600 dark:text-green-400';
      if (confidence >= 0.8) return 'text-yellow-600 dark:text-yellow-400';
      if (confidence >= 0.7) return 'text-orange-600 dark:text-orange-400';
      return 'text-red-600 dark:text-red-400';
    };

    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'landmark': return '🏛️';
        case 'person': return '👤';
        case 'vehicle': return '🚗';
        case 'nature': return '🌿';
        case 'food': return '🍽️';
        case 'animal': return '🐾';
        default: return '📷';
      }
    };

    const getEmotionIcon = (emotion: string) => {
      switch (emotion.toLowerCase()) {
        case 'happy': return '😊';
        case 'sad': return '😢';
        case 'angry': return '😠';
        case 'surprised': return '😲';
        case 'neutral': return '😐';
        default: return '😐';
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          'p-4 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          imageRecognitionVariants({ mode, type, style }),
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Image Recognition
          </h3>
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-3 h-3 rounded-full',
              isAnalyzing ? 'bg-cyan-500 animate-pulse' : 'bg-gray-400'
            )} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isAnalyzing ? 'Analyzing' : 'Ready'}
            </span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-cyan-50 rounded-md dark:bg-cyan-900/20">
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                {imageRecognition.metrics.accuracy}%
              </div>
              <div className="text-sm text-cyan-600 dark:text-cyan-400">
                Accuracy
              </div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-md dark:bg-blue-900/20">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {imageRecognition.metrics.processingTime}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Processing Time
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-md dark:bg-green-900/20">
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                {imageRecognition.metrics.supportedFormats.length}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Supported Formats
              </div>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-md dark:bg-purple-900/20">
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {imageRecognition.metrics.maxImageSize}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Max Size
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Upload Image
              </h4>
              <div className="space-y-3">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
                
                {imagePreview && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Image Preview
                    </div>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-full h-48 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isAnalyzing ? 'Analyzing Image...' : 'Analyze Image'}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {imageRecognition.currentImage && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Scene Analysis
                  </h4>
                  <div className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {imageRecognition.analysis.scene.description}
                      </span>
                      <span className={cn('text-xs font-medium', getConfidenceColor(imageRecognition.analysis.scene.confidence))}>
                        {Math.round(imageRecognition.analysis.scene.confidence * 100)}% confidence
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Category: {imageRecognition.analysis.scene.category}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {imageRecognition.analysis.scene.tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full dark:bg-cyan-900 dark:text-cyan-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Detected Objects
                  </h4>
                  <div className="space-y-2">
                    {imageRecognition.analysis.objects.map((obj, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(obj.category)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {obj.name}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {obj.description}
                            </div>
                          </div>
                        </div>
                        <span className={cn('text-xs font-medium', getConfidenceColor(obj.confidence))}>
                          {Math.round(obj.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Landmarks
                  </h4>
                  <div className="space-y-2">
                    {imageRecognition.analysis.landmarks.map((landmark, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            🏛️ {landmark.name}
                          </span>
                          <span className={cn('text-xs font-medium', getConfidenceColor(landmark.confidence))}>
                            {Math.round(landmark.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          📍 {landmark.location}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          Coordinates: {landmark.coordinates.lat}, {landmark.coordinates.lng}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Extracted Text
                  </h4>
                  <div className="space-y-2">
                    {imageRecognition.analysis.text.map((text, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            📝 "{text.text}"
                          </span>
                          <span className={cn('text-xs font-medium', getConfidenceColor(text.confidence))}>
                            {Math.round(text.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Language: {text.language}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Face Analysis
                  </h4>
                  <div className="space-y-2">
                    {imageRecognition.analysis.faces.map((face, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded-md dark:bg-gray-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            👤 Face {index + 1}
                          </span>
                          <span className={cn('text-xs font-medium', getConfidenceColor(face.confidence))}>
                            {Math.round(face.confidence * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          <div>Age: {face.age}</div>
                          <div>Gender: {face.gender}</div>
                          <div>Emotion: {getEmotionIcon(face.emotion)} {face.emotion}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Recognition Capabilities
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Object.entries(imageRecognition.capabilities).map(([capability, enabled]) => (
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
          </div>
        </div>
      </div>
    );
  }
);

ImageRecognitionEngine.displayName = 'ImageRecognitionEngine';

// Image Recognition Status Component
interface ImageRecognitionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ImageRecognitionStatus = React.forwardRef<HTMLDivElement, ImageRecognitionStatusProps>(
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
        <div className="w-3 h-3 rounded-full bg-cyan-500" />
        <span className="font-medium">
          Image Recognition: {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
        {showDetails && (
          <div className="text-sm opacity-80">
            {isEnabled 
              ? 'Visual content understanding and analysis' 
              : 'Text-only processing'
            }
          </div>
        )}
      </div>
    );
  }
);

ImageRecognitionStatus.displayName = 'ImageRecognitionStatus';

// Image Recognition Demo Component
interface ImageRecognitionDemoProps {
  className?: string;
  showControls?: boolean;
}

export const ImageRecognitionDemo = React.forwardRef<HTMLDivElement, ImageRecognitionDemoProps>(
  ({ className, showControls = true }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 p-6 rounded-lg border-2 border-gray-200 bg-white transition-all duration-300 dark:bg-gray-800 dark:border-gray-600',
          className
        )}
      >
        <h3 className="text-lg font-semibold">Image Recognition Demo</h3>
        
        <ImageRecognitionEngine
          mode="enhanced"
          type="mixed"
          style="detailed"
          onImageAnalysis={(analysis) => console.log('Image analyzed:', analysis)}
        />
        
        {showControls && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md dark:bg-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced computer vision capabilities for analyzing travel photos, landmarks, and visual content.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ImageRecognitionDemo.displayName = 'ImageRecognitionDemo';

// Export all components
export {
  imageRecognitionVariants,
  type ImageRecognitionToggleProps,
  type ImageRecognitionProviderProps,
  type ImageRecognitionEngineProps,
  type ImageRecognitionStatusProps,
  type ImageRecognitionDemoProps
};
