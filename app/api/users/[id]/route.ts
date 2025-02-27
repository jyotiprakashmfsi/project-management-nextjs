import { NextRequest, NextResponse } from "next/server";
import { UserService } from "../../../../services/api-services/userService";

const userService = new UserService();


export const DELETE = async (req: NextRequest, { params: { id } }: { params: { id: string } }): Promise<any> => {
    try {
      const result = await userService.deleteUser(id);
      return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  };

  export const PUT = async (req: NextRequest, { params: { id } }: { params: { id: string } }): Promise<any> => {
    try {
      const body = await req.json()
      const result = await userService.updateUser(id, body);
      return NextResponse.json({ message: "User updated successfully" }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  };

  export const GET = async (req: NextRequest, { params: { id } }: { params: { id: string } }): Promise<any> => {
    try {
      const user = await userService.getUserById(id);
      console.log("User fetched:", user)
      return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: error }, { status: 500 });
    }
  };