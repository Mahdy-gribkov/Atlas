"use client";

import React, { Suspense } from 'react';
import { AtlasThemeProvider } from '@/components/theme/theme-provider';
import { ToastProvider, Toaster } from '@/components/ui/feedback';
import { ErrorBoundary } from '@/components/ui/feedback';
import { AuthProvider } from './AuthProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

// Loading component for Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-atlas-primary-lighter via-atlas-bg to-atlas-secondary-lighter flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-atlas-primary-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-atlas-primary-main"></div>
        </div>
        <p className="text-atlas-text-secondary">Loading Atlas...</p>
      </div>
    </div>
  );
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AtlasThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ToastProvider>
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
            <Toaster />
          </ToastProvider>
        </AtlasThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}