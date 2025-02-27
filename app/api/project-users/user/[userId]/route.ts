import { NextRequest, NextResponse } from "next/server";
import { ProjectUserService } from "../../../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();


export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
    try {
        const { userId } = await params;
        const userProjects = await projectUserService.getUserProjects(parseInt(userId));
        return NextResponse.json(userProjects);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch user's projects", error }, { status: 500 });
    }
};