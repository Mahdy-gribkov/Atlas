import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// User roles
export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest',
}

// Permissions
export enum Permission {
  // User management
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',
  
  // Itinerary management
  CREATE_ITINERARY = 'create_itinerary',
  READ_ITINERARY = 'read_itinerary',
  UPDATE_ITINERARY = 'update_itinerary',
  DELETE_ITINERARY = 'delete_itinerary',
  SHARE_ITINERARY = 'share_itinerary',
  
  // Chat management
  CREATE_CHAT = 'create_chat',
  READ_CHAT = 'read_chat',
  UPDATE_CHAT = 'update_chat',
  DELETE_CHAT = 'delete_chat',
  
  // Admin functions
  MANAGE_SYSTEM = 'manage_system',
  VIEW_AUDIT_LOGS = 'view_audit_logs',
  MANAGE_USERS = 'manage_users',
  MANAGE_CONTENT = 'manage_content',
  
  // API access
  ACCESS_API = 'access_api',
  ACCESS_ADMIN_API = 'access_admin_api',
  
  // External services
  ACCESS_WEATHER_API = 'access_weather_api',
  ACCESS_FLIGHT_API = 'access_flight_api',
  ACCESS_MAPS_API = 'access_maps_api',
  ACCESS_COUNTRIES_API = 'access_countries_api',
}

// Role-Permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // All permissions
    ...Object.values(Permission),
  ],
  
  [UserRole.MODERATOR]: [
    // User management (limited)
    Permission.READ_USER,
    Permission.UPDATE_USER,
    
    // Itinerary management
    Permission.CREATE_ITINERARY,
    Permission.READ_ITINERARY,
    Permission.UPDATE_ITINERARY,
    Permission.DELETE_ITINERARY,
    Permission.SHARE_ITINERARY,
    
    // Chat management
    Permission.CREATE_CHAT,
    Permission.READ_CHAT,
    Permission.UPDATE_CHAT,
    Permission.DELETE_CHAT,
    
    // API access
    Permission.ACCESS_API,
    Permission.ACCESS_WEATHER_API,
    Permission.ACCESS_FLIGHT_API,
    Permission.ACCESS_MAPS_API,
    Permission.ACCESS_COUNTRIES_API,
    
    // Limited admin functions
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_CONTENT,
  ],
  
  [UserRole.USER]: [
    // Own user management
    Permission.READ_USER,
    Permission.UPDATE_USER,
    
    // Itinerary management
    Permission.CREATE_ITINERARY,
    Permission.READ_ITINERARY,
    Permission.UPDATE_ITINERARY,
    Permission.DELETE_ITINERARY,
    Permission.SHARE_ITINERARY,
    
    // Chat management
    Permission.CREATE_CHAT,
    Permission.READ_CHAT,
    Permission.UPDATE_CHAT,
    Permission.DELETE_CHAT,
    
    // API access
    Permission.ACCESS_API,
    Permission.ACCESS_WEATHER_API,
    Permission.ACCESS_FLIGHT_API,
    Permission.ACCESS_MAPS_API,
    Permission.ACCESS_COUNTRIES_API,
  ],
  
  [UserRole.GUEST]: [
    // Limited read access
    Permission.READ_ITINERARY,
    Permission.READ_CHAT,
    Permission.ACCESS_API,
    Permission.ACCESS_WEATHER_API,
    Permission.ACCESS_COUNTRIES_API,
  ],
};

// Resource ownership check
export interface ResourceOwnership {
  userId: string;
  resourceId: string;
  resourceType: string;
}

// RBAC context
export interface RBACContext {
  userId: string;
  role: UserRole;
  permissions: Permission[];
  isOwner?: (resource: ResourceOwnership) => boolean;
}

// Permission check result
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
  requiredPermission?: Permission;
  userRole?: UserRole;
}

// RBAC service
export class RBACService {
  private userRoles: Map<string, UserRole> = new Map();
  private userPermissions: Map<string, Permission[]> = new Map();
  
  // Set user role
  setUserRole(userId: string, role: UserRole): void {
    this.userRoles.set(userId, role);
    this.userPermissions.set(userId, ROLE_PERMISSIONS[role]);
  }
  
  // Get user role
  getUserRole(userId: string): UserRole | null {
    return this.userRoles.get(userId) || null;
  }
  
  // Get user permissions
  getUserPermissions(userId: string): Permission[] {
    return this.userPermissions.get(userId) || [];
  }
  
  // Check if user has permission
  hasPermission(userId: string, permission: Permission): boolean {
    const permissions = this.getUserPermissions(userId);
    return permissions.includes(permission);
  }
  
  // Check if user has any of the permissions
  hasAnyPermission(userId: string, permissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(userId);
    return permissions.some(permission => userPermissions.includes(permission));
  }
  
  // Check if user has all permissions
  hasAllPermissions(userId: string, permissions: Permission[]): boolean {
    const userPermissions = this.getUserPermissions(userId);
    return permissions.every(permission => userPermissions.includes(permission));
  }
  
  // Check resource ownership
  isResourceOwner(userId: string, resource: ResourceOwnership): boolean {
    return userId === resource.userId;
  }
  
  // Comprehensive permission check
  checkPermission(
    userId: string,
    permission: Permission,
    resource?: ResourceOwnership
  ): PermissionCheck {
    const role = this.getUserRole(userId);
    
    if (!role) {
      return {
        allowed: false,
        reason: 'User not found or no role assigned',
        requiredPermission: permission,
      };
    }
    
    const hasPermission = this.hasPermission(userId, permission);
    
    if (!hasPermission) {
      return {
        allowed: false,
        reason: `User role '${role}' does not have permission '${permission}'`,
        requiredPermission: permission,
        userRole: role,
      };
    }
    
    // Check resource ownership for user-level resources
    if (resource && !this.isResourceOwner(userId, resource)) {
      // Some permissions allow access to other users' resources
      const crossUserPermissions = [
        Permission.READ_ITINERARY,
        Permission.READ_CHAT,
      ];
      
      if (!crossUserPermissions.includes(permission)) {
        return {
          allowed: false,
          reason: 'User does not own this resource',
          requiredPermission: permission,
          userRole: role,
        };
      }
    }
    
    return {
      allowed: true,
      userRole: role,
    };
  }
  
  // Get RBAC context for user
  getContext(userId: string): RBACContext | null {
    const role = this.getUserRole(userId);
    if (!role) return null;
    
    return {
      userId,
      role,
      permissions: this.getUserPermissions(userId),
      isOwner: (resource: ResourceOwnership) => this.isResourceOwner(userId, resource),
    };
  }
}

// Global RBAC service instance
export const rbacService = new RBACService();

// RBAC middleware
export function withRBAC(
  permission: Permission,
  handler: (req: NextRequest, context: RBACContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Get user ID from request (from auth middleware)
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in request' },
        { status: 401 }
      );
    }
    
    // Check permission
    const check = rbacService.checkPermission(userId, permission);
    
    if (!check.allowed) {
      return NextResponse.json(
        {
          error: 'Insufficient permissions',
          message: check.reason,
          requiredPermission: check.requiredPermission,
          userRole: check.userRole,
        },
        { status: 403 }
      );
    }
    
    // Get RBAC context
    const context = rbacService.getContext(userId);
    if (!context) {
      return NextResponse.json(
        { error: 'Unable to get user context' },
        { status: 500 }
      );
    }
    
    return handler(req, context);
  };
}

// Role-based middleware
export function withRole(
  allowedRoles: UserRole[],
  handler: (req: NextRequest, context: RBACContext) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in request' },
        { status: 401 }
      );
    }
    
    const role = rbacService.getUserRole(userId);
    
    if (!role || !allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          error: 'Insufficient role',
          message: `Required roles: ${allowedRoles.join(', ')}`,
          userRole: role,
        },
        { status: 403 }
      );
    }
    
    const context = rbacService.getContext(userId);
    if (!context) {
      return NextResponse.json(
        { error: 'Unable to get user context' },
        { status: 500 }
      );
    }
    
    return handler(req, context);
  };
}

// Resource ownership middleware
export function withResourceOwnership(
  resourceExtractor: (req: NextRequest) => ResourceOwnership | null,
  handler: (req: NextRequest, context: RBACContext, resource: ResourceOwnership) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in request' },
        { status: 401 }
      );
    }
    
    const resource = resourceExtractor(req);
    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }
    
    const context = rbacService.getContext(userId);
    if (!context) {
      return NextResponse.json(
        { error: 'Unable to get user context' },
        { status: 500 }
      );
    }
    
    // Check if user owns the resource or is admin
    if (!context.isOwner!(resource) && context.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Access denied - resource ownership required' },
        { status: 403 }
      );
    }
    
    return handler(req, context, resource);
  };
}

// Admin-only middleware
export function withAdminOnly(
  handler: (req: NextRequest, context: RBACContext) => Promise<NextResponse>
) {
  return withRole([UserRole.ADMIN], handler);
}

// User or admin middleware
export function withUserOrAdmin(
  handler: (req: NextRequest, context: RBACContext) => Promise<NextResponse>
) {
  return withRole([UserRole.USER, UserRole.ADMIN], handler);
}

// Permission-based middleware factory
export function requirePermission(permission: Permission) {
  return function(
    handler: (req: NextRequest, context: RBACContext) => Promise<NextResponse>
  ) {
    return withRBAC(permission, handler);
  };
}

// Role-based middleware factory
export function requireRole(...roles: UserRole[]) {
  return function(
    handler: (req: NextRequest, context: RBACContext) => Promise<NextResponse>
  ) {
    return withRole(roles, handler);
  };
}

// Initialize default roles (call this on app startup)
export function initializeRBAC(): void {
  // In a real application, you would load user roles from a database
  // For now, we'll set up some default roles
  
  // Example: Set admin role for specific users
  // rbacService.setUserRole('admin-user-id', UserRole.ADMIN);
  
  console.log('RBAC system initialized');
}

// RBAC validation schemas
export const roleSchema = z.enum([
  UserRole.ADMIN,
  UserRole.MODERATOR,
  UserRole.USER,
  UserRole.GUEST,
]);

export const permissionSchema = z.enum([
  Permission.CREATE_USER,
  Permission.READ_USER,
  Permission.UPDATE_USER,
  Permission.DELETE_USER,
  Permission.CREATE_ITINERARY,
  Permission.READ_ITINERARY,
  Permission.UPDATE_ITINERARY,
  Permission.DELETE_ITINERARY,
  Permission.SHARE_ITINERARY,
  Permission.CREATE_CHAT,
  Permission.READ_CHAT,
  Permission.UPDATE_CHAT,
  Permission.DELETE_CHAT,
  Permission.MANAGE_SYSTEM,
  Permission.VIEW_AUDIT_LOGS,
  Permission.MANAGE_USERS,
  Permission.MANAGE_CONTENT,
  Permission.ACCESS_API,
  Permission.ACCESS_ADMIN_API,
  Permission.ACCESS_WEATHER_API,
  Permission.ACCESS_FLIGHT_API,
  Permission.ACCESS_MAPS_API,
  Permission.ACCESS_COUNTRIES_API,
]);

export const resourceOwnershipSchema = z.object({
  userId: z.string(),
  resourceId: z.string(),
  resourceType: z.string(),
});
