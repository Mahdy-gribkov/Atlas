import { LandingPage } from './LandingPage';
import { Suspense } from 'react';

// Loading component for the main page
function PageLoading() {
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

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <LandingPage />
    </Suspense>
  );
}
