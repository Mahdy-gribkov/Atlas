import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';
import { 
  FileTextIcon, 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  GridIcon, 
  ListIcon, 
  StarIcon, 
  DownloadIcon, 
  UploadIcon, 
  EditIcon, 
  CopyIcon, 
  TrashIcon, 
  EyeIcon, 
  HeartIcon, 
  ShareIcon, 
  TagIcon, 
  CalendarIcon, 
  UserIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  MoreHorizontalIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  FolderOpenIcon
} from 'lucide-react';

const formTemplatesVariants = cva(
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

const formTemplatesHeaderVariants = cva(
  'flex items-center justify-between',
  {
    variants: {
      size: {
        sm: 'mb-4',
        default: 'mb-6',
        lg: 'mb-8',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formTemplatesSearchVariants = cva(
  'flex items-center gap-2',
  {
    variants: {
      size: {
        sm: 'text-sm',
        default: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

const formTemplatesGridVariants = cva(
  'grid gap-4',
  {
    variants: {
      layout: {
        grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        list: 'grid-cols-1',
        masonry: 'columns-1 md:columns-2 lg:columns-3 xl:columns-4',
      },
      size: {
        sm: 'gap-3',
        default: 'gap-4',
        lg: 'gap-6',
      },
    },
    defaultVariants: {
      layout: 'grid',
      size: 'default',
    },
  }
);

const formTemplateCardVariants = cva(
  'group relative border border-atlas-border rounded-lg bg-atlas-card-bg transition-all duration-200 hover:shadow-md hover:border-atlas-primary-main',
  {
    variants: {
      variant: {
        default: 'bg-atlas-card-bg',
        featured: 'bg-atlas-primary-lighter border-atlas-primary-main',
        popular: 'bg-atlas-success-bg border-atlas-success-main',
        new: 'bg-atlas-info-bg border-atlas-info-main',
      },
      size: {
        sm: 'p-3',
        default: 'p-4',
        lg: 'p-6',
      },
      layout: {
        grid: 'flex flex-col',
        list: 'flex flex-row items-center',
        masonry: 'flex flex-col',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      layout: 'grid',
    },
  }
);

export interface FormTemplatesProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formTemplatesVariants> {
  variant?: 'default' | 'outlined' | 'ghost' | 'minimal' | 'card' | 'elevated';
  size?: 'sm' | 'default' | 'lg';
  templates: FormTemplate[];
  categories: FormTemplateCategory[];
  onTemplateSelect?: (template: FormTemplate) => void;
  onTemplateCreate?: () => void;
  onTemplateEdit?: (template: FormTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onTemplateDuplicate?: (template: FormTemplate) => void;
  onTemplateFavorite?: (templateId: string) => void;
  onTemplateShare?: (template: FormTemplate) => void;
  onCategorySelect?: (categoryId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  selectedCategory?: string;
  layout?: 'grid' | 'list' | 'masonry';
  showCategories?: boolean;
  showSearch?: boolean;
  showActions?: boolean;
  children?: React.ReactNode;
}

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  fields: FormTemplateField[];
  thumbnail?: string;
  preview?: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  downloads: number;
  favorites: number;
  isPublic: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  isFavorite?: boolean;
  rating?: number;
  version: string;
  metadata?: {
    estimatedTime?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    industry?: string;
    useCase?: string;
  };
}

export interface FormTemplateField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: any;
}

export interface FormTemplateCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  count: number;
  color?: string;
  isExpanded?: boolean;
  children?: FormTemplateCategory[];
}

export interface FormTemplateCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof formTemplateCardVariants> {
  variant?: 'default' | 'featured' | 'popular' | 'new';
  size?: 'sm' | 'default' | 'lg';
  layout?: 'grid' | 'list' | 'masonry';
  template: FormTemplate;
  onSelect?: (template: FormTemplate) => void;
  onEdit?: (template: FormTemplate) => void;
  onDelete?: (templateId: string) => void;
  onDuplicate?: (template: FormTemplate) => void;
  onFavorite?: (templateId: string) => void;
  onShare?: (template: FormTemplate) => void;
  showActions?: boolean;
}

const FormTemplateCard = React.forwardRef<
  HTMLDivElement,
  FormTemplateCardProps
>(({ 
  className, 
  variant, 
  size, 
  layout, 
  template, 
  onSelect, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onFavorite, 
  onShare, 
  showActions = true, 
  ...props 
}, ref) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getVariant = () => {
    if (template.isFeatured) return 'featured';
    if (template.isPopular) return 'popular';
    if (template.isNew) return 'new';
    return variant || 'default';
  };

  const handleCardClick = () => {
    onSelect?.(template);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const renderGridLayout = () => (
    <>
      <div className="relative mb-3">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-full h-32 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-32 bg-atlas-border-subtle rounded-md flex items-center justify-center">
            <FileTextIcon className="h-8 w-8 text-atlas-text-tertiary" />
          </div>
        )}
        
        {template.isFeatured && (
          <div className="absolute top-2 left-2 bg-atlas-primary-main text-white text-xs px-2 py-1 rounded">
            Featured
          </div>
        )}
        
        {template.isPopular && (
          <div className="absolute top-2 right-2 bg-atlas-success-main text-white text-xs px-2 py-1 rounded">
            Popular
          </div>
        )}
        
        {template.isNew && (
          <div className="absolute top-2 left-2 bg-atlas-info-main text-white text-xs px-2 py-1 rounded">
            New
          </div>
        )}
      </div>
      
      <div className="flex-1 space-y-2">
        <h3 className="font-medium text-atlas-text-primary line-clamp-2">
          {template.name}
        </h3>
        
        <p className="text-sm text-atlas-text-secondary line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-atlas-text-tertiary">
          <UserIcon className="h-3 w-3" />
          <span>{template.author.name}</span>
          <ClockIcon className="h-3 w-3 ml-2" />
          <span>{template.createdAt.toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-atlas-text-tertiary">
            <span className="flex items-center gap-1">
              <DownloadIcon className="h-3 w-3" />
              {template.downloads}
            </span>
            <span className="flex items-center gap-1">
              <HeartIcon className="h-3 w-3" />
              {template.favorites}
            </span>
          </div>
          
          {template.rating && (
            <div className="flex items-center gap-1">
              <StarIcon className="h-3 w-3 text-atlas-warning-main fill-current" />
              <span className="text-xs text-atlas-text-tertiary">
                {template.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderListLayout = () => (
    <>
      <div className="flex-shrink-0 mr-4">
        {template.thumbnail ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          <div className="w-16 h-16 bg-atlas-border-subtle rounded-md flex items-center justify-center">
            <FileTextIcon className="h-6 w-6 text-atlas-text-tertiary" />
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-atlas-text-primary truncate">
              {template.name}
            </h3>
            <p className="text-sm text-atlas-text-secondary line-clamp-1 mt-1">
              {template.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-atlas-text-tertiary mt-2">
              <span className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {template.author.name}
              </span>
              <span className="flex items-center gap-1">
                <DownloadIcon className="h-3 w-3" />
                {template.downloads}
              </span>
              <span className="flex items-center gap-1">
                <HeartIcon className="h-3 w-3" />
                {template.favorites}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {template.rating && (
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-atlas-warning-main fill-current" />
                <span className="text-sm text-atlas-text-tertiary">
                  {template.rating.toFixed(1)}
                </span>
              </div>
            )}
            
            {showActions && (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleMenuToggle}
                  className="p-1 hover:bg-atlas-border-subtle rounded transition-colors"
                  aria-label="Template actions"
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-8 w-48 bg-white border border-atlas-border rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => onEdit?.(template)}
                        className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                      >
                        <EditIcon className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicate?.(template)}
                        className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                      >
                        <CopyIcon className="h-4 w-4" />
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={() => onShare?.(template)}
                        className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                      >
                        <ShareIcon className="h-4 w-4" />
                        Share
                      </button>
                      <button
                        type="button"
                        onClick={() => onFavorite?.(template.id)}
                        className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                      >
                        <HeartIcon className="h-4 w-4" />
                        {template.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete?.(template.id)}
                        className="w-full px-3 py-2 text-left text-sm text-atlas-error-main hover:bg-atlas-error-bg flex items-center gap-2"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div
      ref={ref}
      className={cn(formTemplateCardVariants({ variant: getVariant(), size, layout, className }))}
      onClick={handleCardClick}
      {...props}
    >
      {layout === 'list' ? renderListLayout() : renderGridLayout()}
      
      {showActions && layout !== 'list' && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              type="button"
              onClick={handleMenuToggle}
              className="p-1 bg-white border border-atlas-border rounded shadow-sm hover:bg-atlas-border-subtle transition-colors"
              aria-label="Template actions"
            >
              <MoreHorizontalIcon className="h-4 w-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white border border-atlas-border rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => onEdit?.(template)}
                    className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDuplicate?.(template)}
                    className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                  >
                    <CopyIcon className="h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    type="button"
                    onClick={() => onShare?.(template)}
                    className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                  >
                    <ShareIcon className="h-4 w-4" />
                    Share
                  </button>
                  <button
                    type="button"
                    onClick={() => onFavorite?.(template.id)}
                    className="w-full px-3 py-2 text-left text-sm text-atlas-text-primary hover:bg-atlas-border-subtle flex items-center gap-2"
                  >
                    <HeartIcon className="h-4 w-4" />
                    {template.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(template.id)}
                    className="w-full px-3 py-2 text-left text-sm text-atlas-error-main hover:bg-atlas-error-bg flex items-center gap-2"
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
FormTemplateCard.displayName = 'FormTemplateCard';

const FormTemplates = React.forwardRef<
  HTMLDivElement,
  FormTemplatesProps
>(({
  className,
  variant,
  size,
  templates,
  categories,
  onTemplateSelect,
  onTemplateCreate,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateDuplicate,
  onTemplateFavorite,
  onTemplateShare,
  onCategorySelect,
  searchQuery = '',
  onSearchChange,
  selectedCategory,
  layout = 'grid',
  showCategories = true,
  showSearch = true,
  showActions = true,
  children,
  ...props
}, ref) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [filteredTemplates, setFilteredTemplates] = React.useState(templates);

  React.useEffect(() => {
    let filtered = templates;

    if (selectedCategory) {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredTemplates(filtered);
  }, [templates, selectedCategory, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect?.(categoryId === selectedCategory ? '' : categoryId);
  };

  return (
    <div
      ref={ref}
      className={cn(formTemplatesVariants({ variant, size, className }))}
      {...props}
    >
      <div className={cn(formTemplatesHeaderVariants({ size }))}>
        <div>
          <h2 className="text-lg font-semibold text-atlas-text-primary">
            Form Templates
          </h2>
          <p className="text-sm text-atlas-text-secondary">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className={cn(formTemplatesSearchVariants({ size }))}>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-atlas-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2 border border-atlas-border rounded-md bg-atlas-card-bg text-atlas-text-primary placeholder-atlas-text-tertiary focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-1 border border-atlas-border rounded-md">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' 
                  ? 'bg-atlas-primary-main text-white' 
                  : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
              )}
              aria-label="Grid view"
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' 
                  ? 'bg-atlas-primary-main text-white' 
                  : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
              )}
              aria-label="List view"
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={onTemplateCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-atlas-primary-main text-white rounded-md hover:bg-atlas-primary-light transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Create Template
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {showCategories && (
          <div className="w-64 flex-shrink-0">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-atlas-text-primary mb-3">
                Categories
              </h3>
              
              <button
                type="button"
                onClick={() => handleCategorySelect('')}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors',
                  !selectedCategory
                    ? 'bg-atlas-primary-main text-white'
                    : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
                )}
              >
                <FileTextIcon className="h-4 w-4" />
                <span>All Templates</span>
                <span className="ml-auto text-xs opacity-75">
                  {templates.length}
                </span>
              </button>
              
              {categories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 text-left rounded-md transition-colors',
                    selectedCategory === category.id
                      ? 'bg-atlas-primary-main text-white'
                      : 'hover:bg-atlas-border-subtle text-atlas-text-primary'
                  )}
                >
                  {category.icon || <FolderIcon className="h-4 w-4" />}
                  <span>{category.name}</span>
                  <span className="ml-auto text-xs opacity-75">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <div className={cn(formTemplatesGridVariants({ layout: viewMode, size }))}>
            {filteredTemplates.map(template => (
              <FormTemplateCard
                key={template.id}
                variant="default"
                size={size}
                layout={viewMode}
                template={template}
                onSelect={onTemplateSelect}
                onEdit={onTemplateEdit}
                onDelete={onTemplateDelete}
                onDuplicate={onTemplateDuplicate}
                onFavorite={onTemplateFavorite}
                onShare={onTemplateShare}
                showActions={showActions}
              />
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileTextIcon className="h-12 w-12 text-atlas-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-atlas-text-primary mb-2">
                No templates found
              </h3>
              <p className="text-sm text-atlas-text-secondary mb-4">
                {searchQuery || selectedCategory 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by creating your first template'
                }
              </p>
              {!searchQuery && !selectedCategory && (
                <button
                  type="button"
                  onClick={onTemplateCreate}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-atlas-primary-main text-white rounded-md hover:bg-atlas-primary-light transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Template
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
});
FormTemplates.displayName = 'FormTemplates';

// Additional utility components
const FormTemplatesContainer = React.forwardRef<
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
FormTemplatesContainer.displayName = 'FormTemplatesContainer';

const FormTemplatesSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'default' | 'lg';
    templateCount?: number;
  }
>(({ className, size = 'default', templateCount = 6, ...props }, ref) => {
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
          <div className="h-10 w-32 bg-atlas-border-subtle rounded animate-pulse" />
          <div className="h-10 w-24 bg-atlas-border-subtle rounded animate-pulse" />
        </div>
      </div>
      
      <div className="flex gap-6">
        <div className="w-64 space-y-2">
          <div className="h-4 w-20 bg-atlas-border-subtle rounded animate-pulse" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-10 w-full bg-atlas-border-subtle rounded animate-pulse" />
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: templateCount }).map((_, index) => (
            <div key={index} className="p-4 border border-atlas-border rounded-lg">
              <div className="space-y-3">
                <div className="h-32 w-full bg-atlas-border-subtle rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-atlas-border-subtle rounded animate-pulse" />
                  <div className="h-3 w-full bg-atlas-border-subtle rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-atlas-border-subtle rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
FormTemplatesSkeleton.displayName = 'FormTemplatesSkeleton';

export {
  FormTemplates,
  FormTemplateCard,
  FormTemplatesContainer,
  FormTemplatesSkeleton,
  formTemplatesVariants,
  formTemplatesHeaderVariants,
  formTemplatesSearchVariants,
  formTemplatesGridVariants,
  formTemplateCardVariants,
};
