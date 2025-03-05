import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError, AppError, ErrorType } from './error-utils';
import { errorLogger } from './error-logger';
import Cookies from "js-cookie";
import { setupInterceptors, addRetryInterceptor } from './interceptors';


const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors with our utility
setupInterceptors(apiClient, {
  enableLogging: true,
  enableTiming: true,
  enableAuthHandling: true,
  customErrorHandler: (error: AxiosError) => {
    // Convert to AppError and reject
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
});

// Add retry mechanism for certain endpoints
addRetryInterceptor(apiClient, 3, 1000, [408, 429, 500, 502, 503, 504]);

export async function apiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const configWithRetry = {
      ...config,
      retry: true
    };
    
    const response = await apiClient(configWithRetry);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Convenience methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'GET', url }),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'POST', url, data }),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'PUT', url, data }),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'PATCH', url, data }),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiRequest<T>({ ...config, method: 'DELETE', url }),
};

export default api;
