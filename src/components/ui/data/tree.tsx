"use client";

import React, { forwardRef, useState, useMemo, useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/atlas-utils";
import { 
  ChevronRightIcon, 
  ChevronDownIcon, 
  FolderIcon, 
  FolderOpenIcon,
  FileIcon,
  MoreHorizontalIcon,
  PlusIcon,
  MinusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  MoveIcon
} from "lucide-react";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Input } from "./input";

// Tree Root Component
const treeVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "bg-background",
        bordered: "border border-border",
        striped: "bg-background",
        hover: "bg-background",
        compact: "bg-background",
        spacious: "bg-background",
        minimal: "bg-transparent",
        card: "bg-card border border-border rounded-lg",
        elevated: "bg-card shadow-lg rounded-lg",
        glass: "bg-background/80 backdrop-blur-sm border border-border/50"
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      },
      spacing: {
        tight: "space-y-1",
        normal: "space-y-2",
        loose: "space-y-4"
      },
      density: {
        compact: "p-2",
        normal: "p-4",
        spacious: "p-6"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      spacing: "normal",
      density: "normal"
    }
  }
);

export interface TreeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof treeVariants> {
  data?: TreeNode[];
  selectable?: boolean;
  expandable?: boolean;
  editable?: boolean;
  draggable?: boolean;
  checkable?: boolean;
  showLines?: boolean;
  showIcons?: boolean;
  defaultExpandedKeys?: string[];
  defaultSelectedKeys?: string[];
  defaultCheckedKeys?: string[];
  expandedKeys?: string[];
  selectedKeys?: string[];
  checkedKeys?: string[];
  loading?: boolean;
  emptyMessage?: string;
  onExpand?: (expandedKeys: string[], info: { node: TreeNode; expanded: boolean }) => void;
  onSelect?: (selectedKeys: string[], info: { node: TreeNode; selected: boolean }) => void;
  onCheck?: (checkedKeys: string[], info: { node: TreeNode; checked: boolean }) => void;
  onEdit?: (node: TreeNode, newValue: string) => void;
  onAdd?: (parentNode: TreeNode | null, newNode: TreeNode) => void;
  onDelete?: (node: TreeNode) => void;
  onMove?: (node: TreeNode, targetNode: TreeNode, position: 'before' | 'after' | 'inside') => void;
  renderTitle?: (node: TreeNode) => React.ReactNode;
  renderIcon?: (node: TreeNode) => React.ReactNode;
  actions?: TreeAction[];
}

export interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  disabled?: boolean;
  selectable?: boolean;
  checkable?: boolean;
  editable?: boolean;
  draggable?: boolean;
  data?: any;
  className?: string;
  style?: React.CSSProperties;
}

export interface TreeAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (node: TreeNode) => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  disabled?: (node: TreeNode) => boolean;
}

const Tree = forwardRef<HTMLDivElement, TreeProps>(
  ({
    className,
    variant,
    size,
    spacing,
    density,
    data = [],
    selectable = false,
    expandable = true,
    editable = false,
    draggable = false,
    checkable = false,
    showLines = false,
    showIcons = true,
    defaultExpandedKeys = [],
    defaultSelectedKeys = [],
    defaultCheckedKeys = [],
    expandedKeys,
    selectedKeys,
    checkedKeys,
    loading = false,
    emptyMessage = "No data available",
    onExpand,
    onSelect,
    onCheck,
    onEdit,
    onAdd,
    onDelete,
    onMove,
    renderTitle,
    renderIcon,
    actions = [],
    ...props
  }, ref) => {
    const [expandedKeysState, setExpandedKeysState] = useState<string[]>(
      expandedKeys || defaultExpandedKeys
    );
    const [selectedKeysState, setSelectedKeysState] = useState<string[]>(
      selectedKeys || defaultSelectedKeys
    );
    const [checkedKeysState, setCheckedKeysState] = useState<string[]>(
      checkedKeys || defaultCheckedKeys
    );
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');

    const isExpanded = useCallback((key: string) => {
      return expandedKeysState.includes(key);
    }, [expandedKeysState]);

    const isSelected = useCallback((key: string) => {
      return selectedKeysState.includes(key);
    }, [selectedKeysState]);

    const isChecked = useCallback((key: string) => {
      return checkedKeysState.includes(key);
    }, [checkedKeysState]);

    const handleExpand = useCallback((node: TreeNode, expanded: boolean) => {
      const newExpandedKeys = expanded
        ? [...expandedKeysState, node.key]
        : expandedKeysState.filter(key => key !== node.key);
      
      setExpandedKeysState(newExpandedKeys);
      onExpand?.(newExpandedKeys, { node, expanded });
    }, [expandedKeysState, onExpand]);

    const handleSelect = useCallback((node: TreeNode, selected: boolean) => {
      const newSelectedKeys = selected
        ? [...selectedKeysState, node.key]
        : selectedKeysState.filter(key => key !== node.key);
      
      setSelectedKeysState(newSelectedKeys);
      onSelect?.(newSelectedKeys, { node, selected });
    }, [selectedKeysState, onSelect]);

    const handleCheck = useCallback((node: TreeNode, checked: boolean) => {
      const newCheckedKeys = checked
        ? [...checkedKeysState, node.key]
        : checkedKeysState.filter(key => key !== node.key);
      
      setCheckedKeysState(newCheckedKeys);
      onCheck?.(newCheckedKeys, { node, checked });
    }, [checkedKeysState, onCheck]);

    const handleEdit = useCallback((node: TreeNode) => {
      setEditingKey(node.key);
      setEditingValue(node.title);
    }, []);

    const handleSaveEdit = useCallback((node: TreeNode) => {
      onEdit?.(node, editingValue);
      setEditingKey(null);
      setEditingValue('');
    }, [onEdit, editingValue]);

    const handleCancelEdit = useCallback(() => {
      setEditingKey(null);
      setEditingValue('');
    }, []);

    const handleAdd = useCallback((parentNode: TreeNode | null) => {
      const newNode: TreeNode = {
        key: `new-${Date.now()}`,
        title: 'New Node',
        children: []
      };
      onAdd?.(parentNode, newNode);
    }, [onAdd]);

    const handleDelete = useCallback((node: TreeNode) => {
      onDelete?.(node);
    }, [onDelete]);

    const handleAction = useCallback((actionKey: string, node: TreeNode) => {
      const action = actions.find(a => a.key === actionKey);
      action?.onClick(node);
    }, [actions]);

    const renderTreeNode = useCallback((node: TreeNode, level: number = 0) => {
      const hasChildren = node.children && node.children.length > 0;
      const expanded = isExpanded(node.key);
      const selected = isSelected(node.key);
      const checked = isChecked(node.key);
      const editing = editingKey === node.key;

      return (
        <div key={node.key} className="w-full">
          <div
            className={cn(
              "flex items-center space-x-2 p-2 rounded-lg transition-colors",
              "hover:bg-muted/50",
              selected && "bg-primary/10",
              node.disabled && "opacity-50 cursor-not-allowed",
              node.className
            )}
            style={{ paddingLeft: `${level * 20 + 8}px`, ...node.style }}
          >
            {/* Expand/Collapse Button */}
            {expandable && hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleExpand(node, !expanded)}
                className="h-6 w-6 p-0"
                disabled={node.disabled}
              >
                {expanded ? (
                  <ChevronDownIcon className="h-4 w-4" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" />
                )}
              </Button>
            )}

            {/* Checkbox */}
            {checkable && node.checkable !== false && (
              <Checkbox
                checked={checked}
                onCheckedChange={(checked) => handleCheck(node, checked as boolean)}
                disabled={node.disabled}
                aria-label={`Check ${node.title}`}
              />
            )}

            {/* Icon */}
            {showIcons && (
              <div className="flex-shrink-0">
                {renderIcon ? renderIcon(node) : (
                  hasChildren ? (
                    expanded ? (
                      <FolderOpenIcon className="h-4 w-4 text-primary" />
                    ) : (
                      <FolderIcon className="h-4 w-4 text-primary" />
                    )
                  ) : (
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                  )
                )}
              </div>
            )}

            {/* Title */}
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="h-8"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveEdit(node);
                      } else if (e.key === 'Escape') {
                        handleCancelEdit();
                      }
                    }}
                    onBlur={() => handleSaveEdit(node)}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "cursor-pointer select-none",
                    node.selectable === false && "cursor-default"
                  )}
                  onClick={() => {
                    if (selectable && node.selectable !== false) {
                      handleSelect(node, !selected);
                    }
                  }}
                >
                  {renderTitle ? renderTitle(node) : node.title}
                </div>
              )}
            </div>

            {/* Actions */}
            {actions.length > 0 && (
              <div className="flex items-center space-x-1">
                {actions.slice(0, 2).map(action => (
                  <Button
                    key={action.key}
                    variant={action.variant || "ghost"}
                    size="sm"
                    onClick={() => handleAction(action.key, node)}
                    disabled={action.disabled?.(node) || node.disabled}
                    className="h-6 w-6 p-0"
                  >
                    {action.icon}
                  </Button>
                ))}
                {actions.length > 2 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        disabled={node.disabled}
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {actions.slice(2).map(action => (
                        <DropdownMenuItem
                          key={action.key}
                          onClick={() => handleAction(action.key, node)}
                          disabled={action.disabled?.(node)}
                        >
                          {action.icon && <span className="mr-2">{action.icon}</span>}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}
          </div>

          {/* Children */}
          {hasChildren && expanded && (
            <div className="relative">
              {showLines && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-px bg-border"
                  style={{ left: `${level * 20 + 20}px` }}
                />
              )}
              {node.children!.map(child => renderTreeNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    }, [
      isExpanded,
      isSelected,
      isChecked,
      editingKey,
      editingValue,
      expandable,
      checkable,
      selectable,
      showIcons,
      showLines,
      actions,
      handleExpand,
      handleSelect,
      handleCheck,
      handleEdit,
      handleSaveEdit,
      handleCancelEdit,
      handleAction,
      renderTitle,
      renderIcon
    ]);

    return (
      <div ref={ref} className={cn(treeVariants({ variant, size, spacing, density }), className)} {...props}>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>Loading...</span>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-1">
            {data.map(node => renderTreeNode(node))}
          </div>
        )}
      </div>
    );
  }
);

Tree.displayName = "Tree";

// Tree Sub-components
const TreeNode = forwardRef<HTMLDivElement, TreeNodeProps>(
  ({ className, node, level = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{ paddingLeft: `${level * 20}px` }}
      {...props}
    >
      {node.title}
    </div>
  )
);
TreeNode.displayName = "TreeNode";

interface TreeNodeProps extends React.HTMLAttributes<HTMLDivElement> {
  node: TreeNode;
  level?: number;
}

const TreeBranch = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("ml-4 border-l border-border", className)} {...props} />
  )
);
TreeBranch.displayName = "TreeBranch";

const TreeLeaf = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-2 p-2", className)} {...props} />
  )
);
TreeLeaf.displayName = "TreeLeaf";

const TreeIcon = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-shrink-0", className)} {...props} />
  )
);
TreeIcon.displayName = "TreeIcon";

const TreeContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex-1 min-w-0", className)} {...props} />
  )
);
TreeContent.displayName = "TreeContent";

const TreeActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center space-x-1", className)} {...props} />
  )
);
TreeActions.displayName = "TreeActions";

// Tree Variants
const TreeSolid = forwardRef<HTMLDivElement, TreeProps>(
  ({ variant = "default", ...props }, ref) => (
    <Tree ref={ref} variant={variant} {...props} />
  )
);
TreeSolid.displayName = "TreeSolid";

const TreeTransparent = forwardRef<HTMLDivElement, TreeProps>(
  ({ variant = "minimal", ...props }, ref) => (
    <Tree ref={ref} variant={variant} {...props} />
  )
);
TreeTransparent.displayName = "TreeTransparent";

const TreeGradient = forwardRef<HTMLDivElement, TreeProps>(
  ({ className, ...props }, ref) => (
    <Tree
      ref={ref}
      className={cn("bg-gradient-to-r from-primary/10 to-secondary/10", className)}
      {...props}
    />
  )
);
TreeGradient.displayName = "TreeGradient";

const TreeCard = forwardRef<HTMLDivElement, TreeProps>(
  ({ variant = "card", ...props }, ref) => (
    <Tree ref={ref} variant={variant} {...props} />
  )
);
TreeCard.displayName = "TreeCard";

const TreeElevated = forwardRef<HTMLDivElement, TreeProps>(
  ({ variant = "elevated", ...props }, ref) => (
    <Tree ref={ref} variant={variant} {...props} />
  )
);
TreeElevated.displayName = "TreeElevated";

const TreeGlass = forwardRef<HTMLDivElement, TreeProps>(
  ({ variant = "glass", ...props }, ref) => (
    <Tree ref={ref} variant={variant} {...props} />
  )
);
TreeGlass.displayName = "TreeGlass";

// Responsive Tree
const TreeResponsive = forwardRef<HTMLDivElement, TreeProps & { breakpoint?: 'sm' | 'md' | 'lg' | 'xl' }>(
  ({ breakpoint = 'md', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-x-auto",
        breakpoint === 'sm' && "sm:overflow-x-visible",
        breakpoint === 'md' && "md:overflow-x-visible",
        breakpoint === 'lg' && "lg:overflow-x-visible",
        breakpoint === 'xl' && "xl:overflow-x-visible",
        className
      )}
    >
      <Tree {...props} />
    </div>
  )
);
TreeResponsive.displayName = "TreeResponsive";

// Spacing Utilities
const TreeSpacing = {
  tight: "space-y-1",
  normal: "space-y-2",
  loose: "space-y-4"
};

// Density Utilities
const TreeDensity = {
  compact: "p-2",
  normal: "p-4",
  spacious: "p-6"
};

// Card Variants
const TreeCardVariants = {
  default: "bg-card border border-border",
  elevated: "bg-card shadow-lg",
  glass: "bg-card/80 backdrop-blur-sm border border-border/50"
};

// Icon Variants
const TreeIconVariants = {
  folder: "text-primary",
  folderOpen: "text-primary",
  file: "text-muted-foreground",
  custom: "text-foreground"
};

export {
  Tree,
  TreeNode,
  TreeBranch,
  TreeLeaf,
  TreeIcon,
  TreeContent,
  TreeActions,
  TreeSolid,
  TreeTransparent,
  TreeGradient,
  TreeCard,
  TreeElevated,
  TreeGlass,
  TreeResponsive,
  TreeSpacing,
  TreeDensity,
  TreeCardVariants,
  TreeIconVariants,
  treeVariants
};
