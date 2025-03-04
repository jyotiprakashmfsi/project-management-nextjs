interface User{
    id?: number,
    fname?: string,
    email?: string,
    password?: string,
}

export class authService {
  static async login(data: User) {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      console.log(`Making login request to ${baseUrl}/api/auth/login`);
      
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 401) {
        console.log('Unauthorized login attempt');
        return response;
      }

      if (!response.ok) {
        console.error(`Login failed with status: ${response.status}`);
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      console.log('Login successful');
      return result;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  static async signup(data: User) {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      console.log(`Making signup request to ${baseUrl}/api/auth/signup`);
      
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error(`Signup failed with status: ${response.status}`);
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to create account');
      }

      const result = await response.json();
      console.log('Signup successful:', result);
      return result;
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    }
  }
}
