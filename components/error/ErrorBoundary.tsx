'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

type FallbackRender = (props: FallbackProps) => ReactNode;

interface Props {
  children: ReactNode;
  fallback?: ReactNode | FallbackRender;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        // Check if fallback is a function (render prop)
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error,
            resetErrorBoundary: this.resetError
          });
        }
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-6">
            </div>
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              We're sorry, but an error occurred while rendering this component.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-32">
                <p className="text-sm font-mono text-red-600">
                  {this.state.error.toString()}
                </p>
              </div>
            )}
            <div className="flex justify-center">
              <Button
                onClick={this.resetError}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
