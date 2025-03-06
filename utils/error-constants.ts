/**
 * Error Constants for the application
 * 
 * This file contains all error messages, codes, and types used throughout the application.
 * Use these constants instead of hardcoding error messages to ensure consistency.
 */

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

// Error Types (extending the existing ErrorType enum in error-utils.ts)
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
  CREATION_FAILED: 'Account creation failed',
};

// Validation Error Messages
export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with at least one uppercase letter, one lowercase letter, and one number',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_FORMAT: (field: string) => `${field} format is invalid`,
  MIN_LENGTH: (field: string, length: number) => `${field} must be at least ${length} characters`,
  MAX_LENGTH: (field: string, length: number) => `${field} cannot exceed ${length} characters`,
  MIN_VALUE: (field: string, value: number) => `${field} must be at least ${value}`,
  MAX_VALUE: (field: string, value: number) => `${field} cannot exceed ${value}`,
  INVALID_OPTION: (field: string) => `Selected ${field} is not a valid option`,
  MISSING_FIELDS: `Selected is missing`,
};

// User-related Error Messages
export const USER_ERRORS = {
  NOT_FOUND: 'User not found',
  CREATION_FAILED: 'Failed to create user',
  UPDATE_FAILED: 'Failed to update user information',
  DELETE_FAILED: 'Failed to delete user',
  INVALID_ROLE: 'Invalid user role',
  INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions',
};

// Form Error Messages
export const FORM_ERRORS = {
  SUBMISSION_FAILED: 'Form submission failed. Please try again',
  INVALID_DATA: 'The submitted data is invalid',
  MISSING_FIELDS: 'Please fill in all required fields',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  UNSUPPORTED_FILE_TYPE: 'File type is not supported',
  MAX_FILES_EXCEEDED: 'Maximum number of files exceeded',
};

// API Error Messages
export const API_ERRORS = {
  REQUEST_FAILED: 'API request failed',
  RESPONSE_PARSING_ERROR: 'Failed to parse API response',
  INVALID_RESPONSE: 'Invalid API response',
  SERVICE_UNAVAILABLE: 'Service is currently unavailable',
  RATE_LIMITED: 'Rate limit exceeded. Please try again later',
};

// Database Error Messages
export const DB_ERRORS = {
  CONNECTION_FAILED: 'Database connection failed',
  QUERY_FAILED: 'Database query failed',
  RECORD_NOT_FOUND: 'Record not found',
  DUPLICATE_ENTRY: 'A record with this information already exists',
  CONSTRAINT_VIOLATION: 'Operation violates database constraints',
  TRANSACTION_FAILED: 'Database transaction failed',
};

// File Operation Error Messages
export const FILE_ERRORS = {
  UPLOAD_FAILED: 'File upload failed',
  DOWNLOAD_FAILED: 'File download failed',
  DELETE_FAILED: 'File deletion failed',
  NOT_FOUND: 'File not found',
  PERMISSION_DENIED: 'Permission denied to access file',
  INVALID_TYPE: 'Invalid file type',
  SIZE_EXCEEDED: 'File size exceeds the limit',
};

// Notification Error Messages
export const NOTIFICATION_ERRORS = {
  SENDING_FAILED: 'Failed to send notification',
  INVALID_RECIPIENT: 'Invalid notification recipient',
  TEMPLATE_NOT_FOUND: 'Notification template not found',
};

// Project-specific Error Messages
export const PROJECT_ERRORS = {
  NOT_FOUND: 'Project not found',
  CREATION_FAILED: 'Failed to create project',
  UPDATE_FAILED: 'Failed to update project',
  DELETE_FAILED: 'Failed to delete project',
  INVALID_STATUS: 'Invalid project status',
  DUPLICATE_NAME: 'A project with this name already exists',
};

// Task-specific Error Messages
export const TASK_ERRORS = {
  NOT_FOUND: 'Task not found',
  CREATION_FAILED: 'Failed to create task',
  UPDATE_FAILED: 'Failed to update task',
  DELETE_FAILED: 'Failed to delete task',
  INVALID_STATUS: 'Invalid task status',
  INVALID_PRIORITY: 'Invalid task priority',
  INVALID_ASSIGNEE: 'Invalid task assignee',
};

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
  NOTIFICATION: NOTIFICATION_ERRORS,
  PROJECT: PROJECT_ERRORS,
  TASK: TASK_ERRORS,
};

export default ERRORS;
