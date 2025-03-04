'use client';

import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';
import { logComponentError } from '@/utils/error-logger';

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string = Component.displayName || Component.name || 'UnknownComponent'
): React.FC<P> {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => {
          // Log the error
          logComponentError(error, componentName);
          
          // Render fallback UI
          return (
            <ErrorFallback
              error={error}
              resetErrorBoundary={resetErrorBoundary}
              componentName={componentName}
            />
          );
        }}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
  
  WrappedComponent.displayName = `withErrorBoundary(${componentName})`;
  
  return WrappedComponent;
}

export default withErrorBoundary;
