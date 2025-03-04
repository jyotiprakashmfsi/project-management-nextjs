import toast from 'react-hot-toast';

// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

// Custom error class
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

// Function to handle API errors
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

// Function to display error messages to the user
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

// Function to create a specific type of error
export function createError(
  message: string,
  type: ErrorType = ErrorType.UNKNOWN,
  statusCode?: number,
  details?: any
): AppError {
  return new AppError(message, type, statusCode, details);
}
