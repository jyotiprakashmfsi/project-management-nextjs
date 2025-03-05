# Error Handling Guide

This document provides detailed information about the error handling system used in the application.

## Table of Contents

- [Overview](#overview)
- [Error Constants](#error-constants)
- [Error Types](#error-types)
- [Error Utilities](#error-utilities)
- [Client-Side Error Handling](#client-side-error-handling)
- [Server-Side Error Handling](#server-side-error-handling)
- [Error Boundaries](#error-boundaries)
- [Best Practices](#best-practices)

## Overview

The application uses a centralized error handling system to ensure consistent error messages and proper error handling throughout the application. All error messages are defined in a single location (`utils/error-constants.ts`) and can be used across the application.

## Error Constants

The error constants are defined in `utils/error-constants.ts` and organized by category:

```typescript
// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Types
export const ERROR_TYPE = {
  VALIDATION: 'VALIDATION',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  NETWORK: 'NETWORK',
  UNKNOWN: 'UNKNOWN',
  DATABASE: 'DATABASE',
  INPUT: 'INPUT',
  BUSINESS_LOGIC: 'BUSINESS_LOGIC',
};

// General Error Messages
export const GENERAL_ERRORS = {
  UNKNOWN: 'An unknown error occurred',
  SERVER_ERROR: 'Server error occurred. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
  TIMEOUT: 'Request timed out. Please try again',
  MAINTENANCE: 'System is under maintenance. Please try again later',
  RATE_LIMIT: 'Too many requests. Please try again later',
};

// Authentication Error Messages
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  ACCOUNT_LOCKED: 'Your account has been locked. Please contact support',
  ACCOUNT_DISABLED: 'Your account has been disabled',
  SESSION_EXPIRED: 'Your session has expired. Please log in again',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access forbidden',
  TOKEN_EXPIRED: 'Authentication token has expired',
  INVALID_TOKEN: 'Invalid authentication token',
  MISSING_TOKEN: 'Authentication token is missing',
  EMAIL_ALREADY_EXISTS: 'A user with this email already exists',
  USERNAME_ALREADY_EXISTS: 'A user with this username already exists',
  WEAK_PASSWORD: 'Password does not meet security requirements',
  INVALID_RESET_TOKEN: 'Invalid or expired password reset token',
  INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token',
  MFA_REQUIRED: 'Multi-factor authentication required',
  MFA_INVALID: 'Invalid multi-factor authentication code',
};

// ... other error categories ...

// Export all errors as a single object for convenience
export const ERRORS = {
  HTTP_STATUS,
  ERROR_TYPE,
  GENERAL: GENERAL_ERRORS,
  AUTH: AUTH_ERRORS,
  VALIDATION: VALIDATION_ERRORS,
  USER: USER_ERRORS,
  FORM: FORM_ERRORS,
  API: API_ERRORS,
  DB: DB_ERRORS,
  FILE: FILE_ERRORS,
  PAYMENT: PAYMENT_ERRORS,
  NOTIFICATION: NOTIFICATION_ERRORS,
  PROJECT: PROJECT_ERRORS,
  TASK: TASK_ERRORS,
};
```

## Error Types

The application defines several error types to categorize errors:

- **VALIDATION**: Errors related to input validation
- **AUTHENTICATION**: Errors related to user authentication
- **AUTHORIZATION**: Errors related to user permissions
- **NOT_FOUND**: Errors when a resource is not found
- **SERVER**: Errors on the server side
- **NETWORK**: Errors related to network connectivity
- **UNKNOWN**: Errors that don't fit into other categories
- **DATABASE**: Errors related to database operations
- **INPUT**: Errors related to user input
- **BUSINESS_LOGIC**: Errors related to business rules

## Error Utilities

The application provides utility functions for handling errors in `utils/error-utils.ts`:

### AppError Class

```typescript
export class AppError extends Error {
  type: ErrorType;
  statusCode?: number;
  details?: any;

  constructor(message: string, type: ErrorType = ErrorType.UNKNOWN, statusCode?: number, details?: any) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
    
    // This is needed for instanceof to work correctly with custom error classes
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
```

### Handle API Error

```typescript
export function handleApiError(error: any): AppError {
  console.error('API Error:', error);
  
  // Handle axios errors
  if (error.response) {
    const statusCode = error.response.status;
    const message = error.response.data?.message || 'An error occurred with the API';
    const details = error.response.data;
    
    switch (statusCode) {
      case 400:
        return new AppError(message, ErrorType.VALIDATION, statusCode, details);
      case 401:
        return new AppError(message, ErrorType.AUTHENTICATION, statusCode, details);
      case 403:
        return new AppError(message, ErrorType.AUTHORIZATION, statusCode, details);
      case 404:
        return new AppError(message, ErrorType.NOT_FOUND, statusCode, details);
      default:
        if (statusCode >= 500) {
          return new AppError(message, ErrorType.SERVER, statusCode, details);
        }
        return new AppError(message, ErrorType.UNKNOWN, statusCode, details);
    }
  } else if (error.request) {
    // The request was made but no response was received
    return new AppError(
      'Network error: No response received from server',
      ErrorType.NETWORK,
      undefined,
      { request: error.request }
    );
  } else if (error instanceof AppError) {
    // If it's already an AppError, just return it
    return error;
  } else {
    // Something happened in setting up the request that triggered an Error
    return new AppError(
      error.message || 'An unknown error occurred',
      ErrorType.UNKNOWN,
      undefined,
      error
    );
  }
}
```

### Show Error Toast

```typescript
export function showErrorToast(error: Error | AppError | string): void {
  let message = typeof error === 'string' ? error : error.message;
  
  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.AUTHENTICATION:
        message = 'Authentication error: ' + message;
        break;
      case ErrorType.AUTHORIZATION:
        message = 'Authorization error: ' + message;
        break;
      case ErrorType.VALIDATION:
        message = 'Validation error: ' + message;
        break;
      case ErrorType.NOT_FOUND:
        message = 'Not found: ' + message;
        break;
      case ErrorType.NETWORK:
        message = 'Network error: ' + message;
        break;
      case ErrorType.SERVER:
        message = 'Server error: ' + message;
        break;
      default:
        break;
    }
  }
  
  toast.error(message);
}
```

### Try-Catch Utility

```typescript
export async function tryCatch<T>(
  promise: Promise<T>,
  errorHandler?: (error: AppError) => void
): Promise<[T | null, AppError | null]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error: any) {
    const appError = handleApiError(error);
    
    if (errorHandler) {
      errorHandler(appError);
    } else {
      showErrorToast(appError);
    }
    
    return [null, appError];
  }
}
```

### Create Error

```typescript
export function createError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  statusCode?: number,
  details?: any
): AppError {
  return new AppError(message, type, statusCode, details);
}
```

## Client-Side Error Handling

### API Request Error Handling

```typescript
import { tryCatch } from '@/utils/error-utils';
import { projectApi } from '@/services/client-services/project/api';

const fetchProjects = async () => {
  const [projects, error] = await tryCatch(projectApi.getProjects());
  
  if (error) {
    // Handle error (error toast is already shown by tryCatch)
    return [];
  }
  
  return projects;
};
```

### Form Validation Error Handling

```typescript
import { ERRORS } from '@/utils/error-constants';

const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.email) {
    errors.email = ERRORS.VALIDATION.REQUIRED_FIELD('Email');
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = ERRORS.VALIDATION.INVALID_EMAIL;
  }
  
  if (!formData.password) {
    errors.password = ERRORS.VALIDATION.REQUIRED_FIELD('Password');
  } else if (formData.password.length < 8) {
    errors.password = ERRORS.VALIDATION.MIN_LENGTH('Password', 8);
  }
  
  return errors;
};
```

## Server-Side Error Handling

### API Route Error Handling

```typescript
import { NextRequest, NextResponse } from "next/server";
import { ERRORS, HTTP_STATUS } from "@/utils/error-constants";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    
    // Process request
    
    return NextResponse.json({ success: true, data: result }, { status: HTTP_STATUS.OK });
  } catch (error) {
    console.error('Error in API route:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('validation')) {
        return NextResponse.json({ 
          success: false, 
          message: ERRORS.VALIDATION.INVALID_DATA 
        }, { status: HTTP_STATUS.BAD_REQUEST });
      }
    }
    
    // Default error response
    return NextResponse.json({ 
      success: false, 
      message: ERRORS.GENERAL.UNKNOWN 
    }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
};
```

## Error Boundaries

The application uses React Error Boundaries to catch and handle errors in the component tree:

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    // You could also log the error to an error reporting service here
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## Best Practices

1. **Use Error Constants**: Always use the error constants defined in `utils/error-constants.ts` instead of hardcoding error messages.

2. **Proper Error Typing**: Use the appropriate error type for each error to ensure consistent error handling.

3. **Centralized Error Handling**: Use the utility functions in `utils/error-utils.ts` for handling errors.

4. **Descriptive Error Messages**: Provide clear and descriptive error messages that help users understand what went wrong.

5. **Error Logging**: Log errors on the server side for debugging and monitoring.

6. **User-Friendly Errors**: Display user-friendly error messages to the end user.

7. **Error Boundaries**: Use React Error Boundaries to catch and handle errors in the component tree.

8. **Validation Errors**: Validate user input and provide specific error messages for validation failures.

9. **HTTP Status Codes**: Use appropriate HTTP status codes for API responses.

10. **Error Recovery**: Provide ways for users to recover from errors when possible.
