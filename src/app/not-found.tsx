import Link from 'next/link';
import { Button } from '@/components/ui/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/core';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-atlas-primary-lighter via-atlas-bg to-atlas-secondary-lighter flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-atlas-error-main/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗺️</span>
          </div>
          <CardTitle className="text-2xl font-bold text-atlas-text-primary">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-atlas-text-secondary">
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-atlas-text-secondary">
              Error 404 - Page not found
            </p>
            <p className="text-xs text-atlas-text-tertiary">
              Don't worry, even the best travelers sometimes take a wrong turn!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
