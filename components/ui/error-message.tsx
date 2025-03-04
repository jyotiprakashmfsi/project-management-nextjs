'use client';

import React from 'react';
import { Button } from './button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  showRetry = true,
}: ErrorMessageProps) {
  return (
    <div className="rounded-md bg-red-50 p-4 my-4 border border-red-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {showRetry && onRetry && (
            <div className="mt-4">
              <Button
                onClick={onRetry}
                className="bg-red-100 text-red-800 hover:bg-red-200 focus:ring-red-500"
              >
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
