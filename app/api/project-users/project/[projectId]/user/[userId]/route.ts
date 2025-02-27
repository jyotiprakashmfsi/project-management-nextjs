import { NextRequest, NextResponse } from "next/server";
import { ProjectUserService } from "../../../../../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();


export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string, userId: string } }
): Promise<NextResponse> {
    try {
        const { projectId, userId } = await params;
        const removed = await projectUserService.removeUserFromProject(parseInt(projectId), parseInt(userId));
        
        if (!removed) {
            return NextResponse.json({ message: "Project user not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "User removed from project successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to remove user from project", error }, { status: 500 });
    }
};