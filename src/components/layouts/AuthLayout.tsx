"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe,
  ArrowLeft,
  Shield,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-atlas-primary-lighter to-atlas-secondary-lighter">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-atlas-primary-main" />
            <span className="text-2xl font-bold text-atlas-text-primary">Atlas</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 mb-4">
            <div className="flex items-center text-sm text-atlas-text-secondary">
              <Shield className="h-4 w-4 mr-2" />
              Secure & Private
            </div>
            <div className="flex items-center text-sm text-atlas-text-secondary">
              <CheckCircle className="h-4 w-4 mr-2" />
              Trusted by Travelers
            </div>
          </div>
          <p className="text-xs text-atlas-text-tertiary">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
