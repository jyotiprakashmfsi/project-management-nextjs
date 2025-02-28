import { NextRequest, NextResponse } from "next/server";
import { ProjectUserService } from "../../../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();


export const PUT = async (req: NextRequest, { params}: { params: { id: string } }): Promise<any> => {
    try {
        const body = await req.json()
        const { id } = params;
        const updatedProjectUser = await projectUserService.updateProjectUserRole(parseInt(id), body.role);
        if (!updatedProjectUser) {
            return NextResponse.json({ message: "Project user not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Project user role updated successfully", projectUser: updatedProjectUser }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update project user role", error }, { status: 500 });
    }
};