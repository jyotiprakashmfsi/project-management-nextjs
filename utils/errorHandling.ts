import toast from 'react-hot-toast';

interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
}

/**
 * Handle API errors consistently throughout the application
 * @param error The error object from a catch block
 * @param fallbackMessage A fallback message if no error message is available
 * @returns The error message that was displayed
 */
export const handleApiError = (error: any, fallbackMessage = 'An error occurred'): string => {
  console.error('API Error:', error);
  
  let errorMessage = fallbackMessage;
  
  // Try to extract error message from different error formats
  if (error?.response?.data) {
    // Axios error format
    const responseData = error.response.data as ErrorResponse;
    errorMessage = responseData.message || responseData.error || `Error: ${error.response.status}`;
  } else if (error instanceof Error) {
    // Standard Error object
    errorMessage = error.message || fallbackMessage;
  } else if (typeof error === 'string') {
    // String error
    errorMessage = error;
  }
  
  // Show toast notification
  toast.error(errorMessage);
  
  return errorMessage;
};

/**
 * Log errors to a monitoring service (placeholder for now)
 * @param error The error object
 * @param context Additional context about where the error occurred
 */
export const logError = (error: any, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  // Here you would typically send the error to a monitoring service
  // like Sentry, LogRocket, etc.
  
  // Example: if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: { context } });
  // }
};

/**
 * Safely parse JSON with error handling
 * @param jsonString The JSON string to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed object or fallback value
 */
export const safeJsonParse = <T>(jsonString: string | null | undefined, fallback: T): T => {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    logError(error, 'JSON parsing');
    return fallback;
  }
};
