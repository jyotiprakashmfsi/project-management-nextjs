import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { errorLogger } from './error-logger';
import Cookies from 'js-cookie';

/**
 * Adds request and response interceptors to an Axios instance
 * @param axiosInstance The Axios instance to add interceptors to
 * @param options Configuration options for the interceptors
 */
export function setupInterceptors(
  axiosInstance: AxiosInstance,
  options: {
    enableLogging?: boolean;
    enableTiming?: boolean;
    enableAuthHandling?: boolean;
    customErrorHandler?: (error: AxiosError) => Promise<any>;
  } = {}
) {
  const {
    enableLogging = true,
    enableTiming = true,
    enableAuthHandling = true,
    customErrorHandler
  } = options;

  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      // Add request start time for performance tracking
      if (enableTiming) {
        config.metadata = { startTime: new Date().getTime() };
      }
      
      // Add auth token to headers
      const token = Cookies.get('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp
      config.headers['x-request-time'] = new Date().toISOString();
      
      // Log outgoing requests in development
      if (enableLogging && process.env.NODE_ENV === 'development') {
        console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          params: config.params
        });
      }
      
      return config;
    },
    (error: any) => {
      // Log request errors
      if (enableLogging) {
        errorLogger.logError({
          message: 'API Request Error',
          additionalData: { error },
        });
      }
      
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (enableTiming) {
        // Calculate request duration
        const requestDuration = calculateRequestDuration(response.config);
        
        // Add response timing header
        response.headers['x-response-time'] = `${requestDuration}ms`;
        
        // Log successful responses in development
        if (enableLogging && process.env.NODE_ENV === 'development') {
          console.log(`✅ Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            duration: `${requestDuration}ms`,
            data: response.data
          });
        }
      }
      
      return response;
    },
    (error: AxiosError) => {
      // If custom error handler is provided, use it
      if (customErrorHandler) {
        return customErrorHandler(error);
      }
      
      let requestDuration = 0;
      if (enableTiming) {
        // Calculate request duration even for errors
        requestDuration = calculateRequestDuration(error.config);
      }
      
      // Handle authentication errors
      if (enableAuthHandling && error.response?.status === 401) {
        // Redirect to login page if not already there
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          Cookies.remove('token');
          Cookies.remove('user');
          
          // Redirect to login
          window.location.href = '/login?session=expired';
        }
      }
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        console.warn('Rate limit exceeded. Please try again later.');
      }
      
      // Log the error with more context
      if (enableLogging) {
        errorLogger.logError({
          message: 'API Response Error',
          additionalData: {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            duration: enableTiming ? `${requestDuration}ms` : undefined,
            errorMessage: error.message
          },
        });
      }
      
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

/**
 * Helper function to calculate request duration
 */
function calculateRequestDuration(config: any): number {
  const startTime = config?.metadata?.startTime || 0;
  if (startTime === 0) return 0;
  
  return new Date().getTime() - startTime;
}

/**
 * Creates a custom interceptor for specific API endpoints
 * @param axiosInstance The Axios instance to add the interceptor to
 * @param urlPattern URL pattern to match for this interceptor
 * @param handler Custom handler function for matched requests
 */
export function addEndpointInterceptor(
  axiosInstance: AxiosInstance,
  urlPattern: RegExp,
  handler: (config: AxiosRequestConfig) => AxiosRequestConfig
) {
  axiosInstance.interceptors.request.use((config: any) => {
    if (config.url && urlPattern.test(config.url)) {
      return handler(config);
    }
    return config;
  });
}

/**
 * Adds a retry mechanism for failed requests
 * @param axiosInstance The Axios instance to add the retry mechanism to
 * @param maxRetries Maximum number of retries
 * @param retryDelay Delay between retries in milliseconds
 * @param statusCodesToRetry HTTP status codes that should trigger a retry
 */
export function addRetryInterceptor(
  axiosInstance: AxiosInstance,
  maxRetries: number = 3,
  retryDelay: number = 1000,
  statusCodesToRetry: number[] = [408, 429, 500, 502, 503, 504]
) {
  axiosInstance.interceptors.response.use(undefined, async (error) => {
    const config = error.config;
    
    // If config doesn't exist or the retry option is not set, reject
    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    
    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;
    
    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= maxRetries) {
      // Reject with the error
      return Promise.reject(error);
    }
    
    // Check if this status code should trigger a retry
    if (!error.response || !statusCodesToRetry.includes(error.response.status)) {
      return Promise.reject(error);
    }
    
    // Increase the retry count
    config.__retryCount += 1;
    
    // Create new promise to handle exponential backoff
    const backoff = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Retrying request (${config.__retryCount}/${maxRetries})`);
        resolve();
      }, retryDelay * config.__retryCount);
    });
    
    // Return the promise in which recalls axios to retry the request
    await backoff;
    return axiosInstance(config);
  });
}
