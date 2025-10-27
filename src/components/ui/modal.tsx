import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/atlas-utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-modal-backdrop bg-scrim-light data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const dialogContentVariants = cva(
  'fixed left-[50%] top-[50%] z-modal grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-atlas-card-bg p-6 shadow-lg duration-200 data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out sm:rounded-lg',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[95vw] max-h-[95vh]',
      },
      variant: {
        default: 'border-atlas-border',
        elevated: 'border-atlas-border-subtle shadow-xl',
        outlined: 'border-2 border-atlas-primary-main',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    VariantProps<typeof dialogContentVariants>
>(({ className, size, variant, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContentVariants({ size, variant, className }))}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-atlas-primary-main focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight text-atlas-text-primary',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-atlas-text-secondary', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Custom Modal component with additional features
export interface ModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'elevated' | 'outlined';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
}

const Modal = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalProps
>(({
  open,
  onOpenChange,
  children,
  size = 'default',
  variant = 'default',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  ...props
}, ref) => {
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!closeOnOverlayClick && !closeOnEscape) {
      return;
    }
    onOpenChange?.(newOpen);
  }, [onOpenChange, closeOnOverlayClick, closeOnEscape]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        ref={ref}
        size={size}
        variant={variant}
        onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={closeOnEscape ? undefined : (e) => e.preventDefault()}
        {...props}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
});
Modal.displayName = 'Modal';

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  Modal,
  dialogContentVariants,
};
