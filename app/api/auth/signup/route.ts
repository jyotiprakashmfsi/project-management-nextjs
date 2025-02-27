import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "../../../../services/api-services/authService";

const authService = new AuthService();

export const POST = async (req: NextRequest) => {
    const body = await req.json()

    try {
        const user = await authService.createUser(body);
        return NextResponse.json({ user }, { status: 200 });
      } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error }, { status: 500 });
      }
}