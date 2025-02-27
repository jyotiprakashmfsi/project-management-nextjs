import { NextRequest, NextResponse } from "next/server";
import { ProjectUserService } from "../../../../../../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string, userId: string } }
): Promise<NextResponse> {
    try {
        const { projectId, userId } = params;
        const isInProject = await projectUserService.isUserInProject(parseInt(projectId), parseInt(userId));
        return NextResponse.json({ isInProject });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to check user project membership", error }, { status: 500 });
    }
};
