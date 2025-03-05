/**
 * Examples of how to use the error constants in your application
 * This file is for demonstration purposes only
 */

import { NextResponse } from 'next/server';
import { ERRORS, HTTP_STATUS, ERROR_TYPE } from './error-constants';
import { AppError, createError } from './error-utils';

// Example 1: Using error constants in an API route
export const exampleApiErrorHandling = (error: any) => {
  console.error('API Error:', error);
  
  // Determine the appropriate error response
  if (error.code === 'P2002') {
    // Prisma unique constraint violation
    return NextResponse.json({ 
      success: false, 
      message: ERRORS.AUTH.EMAIL_ALREADY_EXISTS 
    }, { status: HTTP_STATUS.CONFLICT });
  } 
  
  if (error.name === 'ValidationError') {
    return NextResponse.json({ 
      success: false, 
      message: ERRORS.VALIDATION.INVALID_DATA,
      errors: error.errors
    }, { status: HTTP_STATUS.BAD_REQUEST });
  }
  
  // Default server error
  return NextResponse.json({ 
    success: false, 
    message: ERRORS.GENERAL.SERVER_ERROR 
  }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
};

// Example 2: Using error constants with form validation
export const validateUserForm = (formData: any) => {
  const errors: Record<string, string> = {};
  
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
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = ERRORS.VALIDATION.PASSWORDS_DO_NOT_MATCH;
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

// Example 3: Using error constants with the AppError class
export const exampleBusinessLogic = async (userId: string) => {
  try {
    // Simulated user fetch
    const user = await fetchUser(userId);
    
    if (!user) {
      throw createError(
        ERRORS.USER.NOT_FOUND,
        ERROR_TYPE.NOT_FOUND,
        HTTP_STATUS.NOT_FOUND
      );
    }
    
    if (user.status === 'disabled') {
      throw createError(
        ERRORS.AUTH.ACCOUNT_DISABLED,
        ERROR_TYPE.AUTHORIZATION,
        HTTP_STATUS.FORBIDDEN
      );
    }
    
    return user;
  } catch (error) {
    // Re-throw AppErrors or wrap other errors
    if (error instanceof AppError) {
      throw error;
    }
    
    throw createError(
      ERRORS.GENERAL.UNKNOWN,
      ERROR_TYPE.UNKNOWN,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      { originalError: error }
    );
  }
};

// Mock function for the example
async function fetchUser(userId: string) {
  // This would be an actual database call in a real application
  return { id: userId, name: 'John Doe', status: 'active' };
}
