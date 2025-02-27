import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "../../../../../services/api-services/projectService";

const projectService = new ProjectService();

export const GET = async (req: NextRequest, { params: { status } }: { params: { status: string } }): Promise<any> => {
    try {
        const projects = await projectService.getProjectsByStatus(status);
        return NextResponse.json(projects);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch projects by status", error }, { status: 500 });
    }
};