# Authentication Guide

This document provides detailed information about the authentication system used in the application.

## Table of Contents

- [Overview](#overview)
- [Authentication Flow](#authentication-flow)
- [User Registration](#user-registration)
- [User Login](#user-login)
- [JWT Authentication](#jwt-authentication)
- [Protected Routes](#protected-routes)
- [Authentication Context](#authentication-context)
- [Security Considerations](#security-considerations)

## Overview

The application uses a JWT (JSON Web Token) based authentication system. Users can register for an account and then log in to receive a JWT token, which is used to authenticate subsequent API requests.

## Authentication Flow

1. User registers for an account (signup)
2. User logs in with email and password
3. Server validates credentials and returns a JWT token
4. Client stores the JWT token in cookies or local storage
5. Client includes the JWT token in the Authorization header for subsequent API requests
6. Server validates the JWT token for protected routes
7. When the token expires, the user must log in again

## User Registration

### Registration Process

1. User fills out the registration form with required information
2. Client validates the form data
3. Client sends a POST request to `/api/auth/signup`
4. Server validates the data and checks for existing users with the same email
5. If validation passes, the server hashes the password using bcrypt
6. Server creates a new user record in the database
7. Server returns a success response
8. Client redirects the user to the login page

### Registration Form Fields

- **Full Name**: User's full name
- **Email**: User's email address (must be unique)
- **Password**: User's password (must meet security requirements)
- **Contact**: User's contact number (optional)
- **Date of Birth**: User's date of birth (optional)

## User Login

### Login Process

1. User fills out the login form with email and password
2. Client validates the form data
3. Client sends a POST request to `/api/auth/login`
4. Server validates the credentials
5. If validation passes, the server generates a JWT token
6. Server returns the JWT token and user information
7. Client stores the JWT token in cookies or local storage
8. Client redirects the user to the dashboard

### Login Form Fields

- **Email**: User's email address
- **Password**: User's password

## JWT Authentication

### JWT Token Structure

The JWT token consists of three parts:

1. **Header**: Contains the token type and hashing algorithm
2. **Payload**: Contains the user ID, expiration time, and other claims
3. **Signature**: Ensures the token hasn't been tampered with

### JWT Token Generation

```typescript
import jwt from 'jsonwebtoken';

const generateToken = (userId: number): string => {
  const payload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET as string);
};
```

### JWT Token Validation

```typescript
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export const validateToken = (req: NextRequest) => {
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (error) {
    return null;
  }
};
```

## Protected Routes

### API Route Protection

API routes are protected using middleware that validates the JWT token:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '../../../utils/auth';
import { ERRORS, HTTP_STATUS } from '../../../utils/error-constants';

export async function middleware(req: NextRequest) {
  const decoded = validateToken(req);
  
  if (!decoded) {
    return NextResponse.json(
      { success: false, message: ERRORS.AUTH.UNAUTHORIZED },
      { status: HTTP_STATUS.UNAUTHORIZED }
    );
  }
  
  // Add user ID to request headers for downstream handlers
  const headers = new Headers(req.headers);
  headers.set('x-user-id', decoded.userId);
  
  return NextResponse.next({
    request: {
      headers
    }
  });
}

export const config = {
  matcher: [
    '/api/projects/:path*',
    '/api/tasks/:path*',
    '/api/project-users/:path*',
    '/api/users/:path*'
  ]
};
```

### Client-Side Route Protection

Client-side routes are protected using a Higher Order Component (HOC) that checks for the presence of a valid JWT token:

```typescript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useUser();
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
        }
      }
    }, [user, loading, router]);
    
    if (loading || !isAuthenticated) {
      return <div>Loading...</div>;
    }
    
    return <Component {...props} />;
  };
}
```

## Authentication Context

The application uses a React Context to manage the authentication state:

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { userApi } from '@/services/client-services/user/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');
        
        if (token) {
          const userData = await userApi.getProfile();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        Cookies.remove('token');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  const login = (userData, token) => {
    setUser(userData);
    Cookies.set('token', token, { expires: 1 }); // 1 day
  };
  
  const logout = () => {
    setUser(null);
    Cookies.remove('token');
  };
  
  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
```

## Security Considerations

### Password Storage

Passwords are hashed using bcrypt before being stored in the database:

```typescript
import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
```

### JWT Token Security

- JWT tokens are signed with a secure secret
- Tokens have an expiration time (24 hours)
- Tokens are stored in HTTP-only cookies to prevent XSS attacks
- CSRF protection is implemented for cookie-based authentication

### Additional Security Measures

- Input validation for all user inputs
- Rate limiting for authentication endpoints
- HTTPS for all API requests
- Secure HTTP headers
- Regular security audits
