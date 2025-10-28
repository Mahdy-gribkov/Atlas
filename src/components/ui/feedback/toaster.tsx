"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Toast, ToastProps } from './toast';

interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<ToastProps>) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: ToastProps['position'];
}

export function ToastProvider({ 
  children, 
  maxToasts = 5, 
  position = 'top-right' 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      position: toast.position || position,
      onClose: () => removeToast(id),
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts, position]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<ToastProps>) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, ...updates } : toast
      )
    );
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        updateToast,
        clearAllToasts,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

interface ToasterProps {
  position?: ToastProps['position'];
}

export function Toaster({ position = 'top-right' }: ToasterProps) {
  const { toasts } = useToast();

  return (
    <div className="fixed inset-0 z-[1080] pointer-events-none">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          position={toast.position || position}
        />
      ))}
    </div>
  );
}

// Toast utility functions
export const toast = {
  success: (message: string, options?: Partial<ToastProps>) => ({
    variant: 'success' as const,
    message,
    ...options,
  }),
  error: (message: string, options?: Partial<ToastProps>) => ({
    variant: 'error' as const,
    message,
    ...options,
  }),
  warning: (message: string, options?: Partial<ToastProps>) => ({
    variant: 'warning' as const,
    message,
    ...options,
  }),
  info: (message: string, options?: Partial<ToastProps>) => ({
    variant: 'info' as const,
    message,
    ...options,
  }),
  default: (message: string, options?: Partial<ToastProps>) => ({
    variant: 'default' as const,
    message,
    ...options,
  }),
};
