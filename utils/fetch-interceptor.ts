import Cookies from 'js-cookie';
import { errorLogger } from './error-logger';

/**
 * Enhanced fetch function with interceptor-like capabilities
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise with fetch response
 */
export const enhancedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Start timing
  const startTime = new Date().getTime();
  
  // Add default headers
  const headers = new Headers(options.headers || {});
  
  // Add auth token if available
  const token = Cookies.get('token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Add content type if not present and method is not GET
  if (!headers.has('Content-Type') && options.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add request timestamp
  headers.set('x-request-time', new Date().toISOString());
  
  // Prepare the request
  const enhancedOptions: RequestInit = {
    ...options,
    headers
  };
  
  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🚀 Fetch Request: ${options.method || 'GET'} ${url}`, {
      body: options.body,
      headers: Object.fromEntries(headers.entries())
    });
  }
  
  try {
    // Execute the fetch
    const response = await fetch(url, enhancedOptions);
    
    // Calculate request duration
    const duration = new Date().getTime() - startTime;
    
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Fetch Response: ${response.status} ${options.method || 'GET'} ${url}`, {
        duration: `${duration}ms`,
        ok: response.ok
      });
    }
    
    // Handle authentication errors
    if (response.status === 401) {
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        Cookies.remove('token');
        Cookies.remove('user');
        
        // Redirect to login
        window.location.href = '/login?session=expired';
      }
    }
    
    // Return the response
    return response;
  } catch (error) {
    // Calculate request duration for error
    const duration = new Date().getTime() - startTime;
    
    // Log the error
    errorLogger.logError({
      message: 'Fetch Error',
      additionalData: {
        url,
        method: options.method || 'GET',
        duration: `${duration}ms`,
        error
      }
    });
    
    // Rethrow the error
    throw error;
  }
};

/**
 * Retry a fetch request with exponential backoff
 * @param url URL to fetch
 * @param options Fetch options
 * @param maxRetries Maximum number of retries
 * @param retryDelay Base delay between retries in milliseconds
 * @param statusCodesToRetry HTTP status codes that should trigger a retry
 * @returns Promise with fetch response
 */
export const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = 3,
  retryDelay: number = 1000,
  statusCodesToRetry: number[] = [408, 429, 500, 502, 503, 504]
): Promise<Response> => {
  let retries = 0;
  
  while (true) {
    try {
      const response = await enhancedFetch(url, options);
      
      // If the response is ok or we shouldn't retry this status code, return it
      if (response.ok || !statusCodesToRetry.includes(response.status)) {
        return response;
      }
      
      // If we've reached max retries, return the response even though it's an error
      if (retries >= maxRetries) {
        return response;
      }
      
      // Increment retry counter
      retries++;
      
      // Calculate delay with exponential backoff
      const delay = retryDelay * Math.pow(2, retries - 1);
      
      // Log retry attempt
      console.log(`Retrying fetch request (${retries}/${maxRetries}) after ${delay}ms: ${url}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
    } catch (error) {
      // For network errors, retry if we haven't reached max retries
      if (retries < maxRetries) {
        retries++;
        const delay = retryDelay * Math.pow(2, retries - 1);
        console.log(`Retrying fetch request after network error (${retries}/${maxRetries}) after ${delay}ms: ${url}`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // If we've reached max retries, rethrow the error
        throw error;
      }
    }
  }
};

/**
 * Helper function to create a fetch API client with interceptor functionality
 */
export const createFetchClient = (baseUrl: string = '') => {
  return {
    get: async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
      const response = await fetchWithRetry(`${baseUrl}${path}`, {
        ...options,
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    
    post: async <T = any>(path: string, data: any, options: RequestInit = {}): Promise<T> => {
      const response = await fetchWithRetry(`${baseUrl}${path}`, {
        ...options,
        method: 'POST',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    
    put: async <T = any>(path: string, data: any, options: RequestInit = {}): Promise<T> => {
      const response = await fetchWithRetry(`${baseUrl}${path}`, {
        ...options,
        method: 'PUT',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    
    patch: async <T = any>(path: string, data: any, options: RequestInit = {}): Promise<T> => {
      const response = await fetchWithRetry(`${baseUrl}${path}`, {
        ...options,
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    },
    
    delete: async <T = any>(path: string, options: RequestInit = {}): Promise<T> => {
      const response = await fetchWithRetry(`${baseUrl}${path}`, {
        ...options,
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    }
  };
};

// Create a default fetch client for API calls
export const fetchClient = createFetchClient('/api');
