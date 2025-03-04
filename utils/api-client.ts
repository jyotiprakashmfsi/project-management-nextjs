import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { handleApiError, AppError, ErrorType } from './error-utils';
import { errorLogger } from './error-logger';
import Cookies from "js-cookie";


const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: any) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    config.headers['x-request-time'] = new Date().toISOString();
    
    return config;
  },
  (error: any) => {
    // Log request errors
    errorLogger.logError({
      message: 'API Request Error',
      additionalData: { error },
    });
    
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        Cookies.remove('token');
        Cookies.remove('user');
        
        // Redirect to login
        window.location.href = '/login?session=expired';
      }
    }
    
    // Log the error
    errorLogger.logError({
      message: 'API Response Error',
      additionalData: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      },
    });
    
    // Convert to AppError and reject
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
);

export async function apiRequest<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient(config);
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
