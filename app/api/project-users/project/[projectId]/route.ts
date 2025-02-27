import { NextRequest, NextResponse } from "next/server";
import { ProjectUserService } from "../../../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
): Promise<NextResponse> {
    try {
        const { projectId } = await params;   
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        
        const result = await projectUserService.getProjectUsers(
            parseInt(projectId), 
            { page: parseInt(page), limit: parseInt(limit) }
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch project users", error }, { status: 500 });
    }
};
