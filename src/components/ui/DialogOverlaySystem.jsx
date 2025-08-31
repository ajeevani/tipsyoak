import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '../AppIcon';
import Button from './Button';

const DialogOverlaySystem = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  size = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = ''
}) => {
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Size variants
  const sizeClasses = {
    sm: 'max-w-sm',
    default: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousFocusRef.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus the dialog
      setTimeout(() => {
        if (dialogRef?.current) {
          dialogRef?.current?.focus();
        }
      }, 100);
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to the previously focused element
      if (previousFocusRef?.current) {
        previousFocusRef?.current?.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event?.key === 'Escape' && closeOnEscape && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (event) => {
    if (event?.target === event?.currentTarget && closeOnBackdrop) {
      onClose?.();
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  if (!isOpen) return null;

  const dialogContent = (
    <div
      className="fixed inset-0 z-dialog-backdrop flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'dialog-title' : undefined}
      aria-describedby={description ? 'dialog-description' : undefined}
    >
      {/* Backdrop with glass effect */}
      <div className="absolute inset-0 glass-effect" />
      
      {/* Dialog Content */}
      <div
        ref={dialogRef}
        className={`relative z-dialog-content w-full ${sizeClasses?.[size]} bg-popover border border-border rounded-glass shadow-elevated animate-slide-up ${className}`}
        tabIndex={-1}
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              {title && (
                <h2 id="dialog-title" className="text-lg font-semibold text-popover-foreground">
                  {title}
                </h2>
              )}
              {description && (
                <p id="dialog-description" className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-full"
                aria-label="Close dialog"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );

  // Render in portal to ensure proper z-index stacking
  return createPortal(dialogContent, document.body);
};

// Specialized dialog components
export const CartDialog = ({ isOpen, onClose, children }) => (
  <DialogOverlaySystem
    isOpen={isOpen}
    onClose={onClose}
    title="Shopping Cart"
    description=""
    size="lg"
    className="max-h-[90vh] flex flex-col"
  >
    <div className="flex-1 overflow-y-auto">
      {children}
    </div>
  </DialogOverlaySystem>
);

export const AuthDialog = ({ isOpen, onClose, children }) => (
  <DialogOverlaySystem
    isOpen={isOpen}
    onClose={onClose}
    title="Account Access"
    description="Sign in to your account or create a new one"
    size="default"
  >
    {children}
  </DialogOverlaySystem>
);

export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default"
}) => (
  <DialogOverlaySystem
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    showCloseButton={false}
  >
    <div className="space-y-4">
      {message && (
        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
      
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onClose}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={() => {
            onConfirm?.();
            onClose?.();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  </DialogOverlaySystem>
);

export default DialogOverlaySystem;