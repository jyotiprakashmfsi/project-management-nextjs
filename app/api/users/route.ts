import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../services/api-services/userService";

const userService = new UserService();


export const GET = async (req: NextRequest): Promise<any> => {
    try {
      const users = await userService.getAllUsers();
      return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  };