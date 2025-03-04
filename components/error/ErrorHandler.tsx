'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ErrorHandlerProps {
  children: React.ReactNode;
}

export default function ErrorHandler({ children }: ErrorHandlerProps) {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Global error event listener
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setError(event.error);
      setHasError(true);
      toast.error('An error occurred. Please try again later.');
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setError(new Error(event.reason?.message || 'Promise rejected'));
      setHasError(true);
      toast.error('An error occurred with a network request. Please try again later.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  const resetError = () => {
    setHasError(false);
    setError(null);
  };

  // If there's an error, show error UI
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <div className="flex flex-col items-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6 text-center">
              {error?.message || 'An unexpected error occurred'}
            </p>
            <Button
              onClick={resetError}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No error, render children
  return <>{children}</>;
}
