import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../../services/api-services/authService";

const authService = new AuthService();

export const POST = async (req: NextRequest) => {
    console.log('Login API endpoint called');
    
    try {        
        const body = await req.json()
        const { email, password } = body

        const { token, user } = await authService.authenticateUser(email, password);
        return NextResponse.json({ token, user }, { status: 200 });
    } catch (error) {
        console.error('Error in login API route:', error);
        return NextResponse.json({ 
            message: error instanceof Error ? error.message : 'An unknown error occurred' 
        }, { status: 500 });
    }
}