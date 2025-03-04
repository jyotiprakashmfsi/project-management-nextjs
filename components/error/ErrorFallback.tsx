'use client';

import React from 'react';
import { Button } from '../ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  componentName?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  componentName,
}) => {
  return (
    <div className="p-4 border border-red-300 rounded-md bg-red-50 my-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-lg font-medium text-red-800">
          {componentName ? `Error in ${componentName}` : 'Component Error'}
        </h3>
      </div>
      <p className="text-sm text-red-700 mb-2">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex justify-end">
        <Button
          onClick={resetErrorBoundary}
          className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorFallback;
