import React from 'react';
import { render } from '@testing-library/react';
import ProtectedRoute from '../../components/protected/protected-route';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

// Mock the modules
jest.mock('js-cookie');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('ProtectedRoute Component', () => {
  // Setup mocks
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Update the mock implementation for each test
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));
  });

  it('should render children when user is authenticated', () => {
    // Mock that a token exists
    (Cookies.get as jest.Mock).mockReturnValue('valid-token');

    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Check if the children are rendered
    expect(getByText('Protected Content')).toBeInTheDocument();
    
    // Router should not redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should redirect to login page when user is not authenticated', () => {
    // Mock that no token exists
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Router should redirect to login
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should redirect to custom path when specified and user is not authenticated', () => {
    // Mock that no token exists
    (Cookies.get as jest.Mock).mockReturnValue(undefined);

    render(
      <ProtectedRoute redirectTo="/custom-login">
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Router should redirect to custom path
    expect(mockPush).toHaveBeenCalledWith('/custom-login');
  });
});
