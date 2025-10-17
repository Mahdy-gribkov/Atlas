import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary">
      <div className="error-content">
        <h2>Something went wrong</h2>
        <p>We're sorry, but something unexpected happened.</p>
        <details>
          <summary>Error details</summary>
          <pre>{error.message}</pre>
        </details>
        <button onClick={resetErrorBoundary} className="retry-button">
          Try again
        </button>
      </div>
    </div>
  );
}

export default function ErrorBoundary({ children }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // You can log to an error reporting service here
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
