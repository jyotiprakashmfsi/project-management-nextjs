import { NextResponse } from 'next/server';
import { AuthService } from '@/services/api-services/authService';

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

const authService = new AuthService();

export async function POST(request: Request) {
  try {
    const body: RegisterRequestBody = await request.json();
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    authService.createUser({fname: name, email, password})
    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: { name, email }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
