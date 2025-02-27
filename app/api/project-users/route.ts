import { NextRequest, NextResponse } from "next/server"
import { ProjectUserService } from "../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();


 export const POST = async (req: NextRequest) => {
     const body = await req.json()
     try {
        const projectUser = await projectUserService.addUserToProject(body);
        return NextResponse.json({ message: "User added to project successfully", projectUser }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to add user to project", error }, { status: 500 });
    } 
}   