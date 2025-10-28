"use client";

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { AtlasThemeProvider } from '@/components/theme/theme-provider';
import { ToastProvider, Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <AtlasThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <ToastProvider>
          {children}
          <Toaster />
        </ToastProvider>
      </AtlasThemeProvider>
    </SessionProvider>
  );
}
