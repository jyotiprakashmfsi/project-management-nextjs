import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../../services/api-services/authService";
import { initializeDatabase } from "../../../../db/models";
import { ERRORS, HTTP_STATUS } from "../../../../utils/error-constants";

const authService = new AuthService();

export const POST = async (req: NextRequest) => {
    console.log('Signup API endpoint called');
    
    try {
        const body = await req.json();
        console.log('Received signup request with data:', JSON.stringify(body, null, 2));
        
        await authService.createUser(body);
        console.log('User created successfully in API route');
        
        return NextResponse.json({ success: true, message: 'User created successfully' }, { status: HTTP_STATUS.CREATED });
    } catch (error) {
        console.error('Error in signup API route:', error);
        return NextResponse.json({ 
            success: false, 
            message: ERRORS.GENERAL.UNKNOWN 
        }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}