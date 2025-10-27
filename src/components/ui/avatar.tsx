import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const avatarVariants = cva(
  'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
      },
      variant: {
        default: 'bg-atlas-primary-main',
        secondary: 'bg-atlas-secondary-main',
        ai: 'bg-atlas-ai-main',
        success: 'bg-atlas-success-main',
        error: 'bg-atlas-error-main',
        warning: 'bg-atlas-warning-main',
        info: 'bg-atlas-info-main',
        muted: 'bg-atlas-text-tertiary',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  showStatus?: boolean;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, variant, src, alt, fallback, status, showStatus = false, ...props }, ref) => (
  <div className="relative inline-block">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(avatarVariants({ size, variant, className }))}
      {...props}
    >
      <AvatarPrimitive.Image
        className="aspect-square h-full w-full object-cover"
        src={src}
        alt={alt}
      />
      <AvatarPrimitive.Fallback
        className="flex h-full w-full items-center justify-center rounded-full bg-atlas-primary-main text-sm font-medium text-white"
      >
        {fallback || alt?.charAt(0).toUpperCase() || '?'}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
    {showStatus && status && (
      <div
        className={cn(
          'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white',
          status === 'online' && 'bg-atlas-success-main',
          status === 'offline' && 'bg-atlas-text-tertiary',
          status === 'away' && 'bg-atlas-warning-main',
          status === 'busy' && 'bg-atlas-error-main'
        )}
      />
    )}
  </div>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-atlas-primary-main text-sm font-medium text-white',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// Avatar group component
export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  spacing?: 'sm' | 'default' | 'lg';
  className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max, size = 'default', spacing = 'default', className }, ref) => {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray;
    const remainingCount = max ? childrenArray.length - max : 0;

    const spacingClasses = {
      sm: '-space-x-1',
      default: '-space-x-2',
      lg: '-space-x-3',
    };

    return (
      <div
        ref={ref}
        className={cn('flex', spacingClasses[spacing], className)}
      >
        {visibleChildren.map((child, index) => (
          <div key={index} className="relative">
            {child}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-atlas-border-subtle text-xs font-medium text-atlas-text-primary',
            size === 'sm' && 'h-8 w-8',
            size === 'lg' && 'h-12 w-12',
            size === 'xl' && 'h-16 w-16',
            size === '2xl' && 'h-20 w-20'
          )}>
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);
AvatarGroup.displayName = 'AvatarGroup';

// User avatar with name
export interface UserAvatarProps {
  name: string;
  email?: string;
  src?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl' | '2xl';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const UserAvatar = React.forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ name, email, src, size = 'default', showStatus = false, status, className }, ref) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div ref={ref} className={cn('flex items-center space-x-3', className)}>
        <Avatar
          src={src}
          alt={name}
          fallback={initials}
          size={size}
          showStatus={showStatus}
          status={status}
        />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-atlas-text-primary">{name}</span>
          {email && (
            <span className="text-xs text-atlas-text-tertiary">{email}</span>
          )}
        </div>
      </div>
    );
  }
);
UserAvatar.displayName = 'UserAvatar';

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  UserAvatar,
  avatarVariants,
};
