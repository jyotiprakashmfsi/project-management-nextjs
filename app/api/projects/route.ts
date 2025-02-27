import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "../../../services/api-services/projectService";

const projectService = new ProjectService();

export const GET = async (req: NextRequest, { params: { projectId }, searchParams: { page, limit } }: { params: { projectId: string }, searchParams: { page: string, limit: string } }): Promise<any> => {
    try {
        const result = await projectService.getAllProjects(parseInt(page) || 1, parseInt(limit) || 10);
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch projects", error }, { status: 500 });
    }
};

export const POST = async (req: NextRequest): Promise<any> => {
    try {
        const body = await req.json()
        const project = await projectService.createProject(body);
        return NextResponse.json({ message: "Project created successfully", project }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to create project", error }, { status: 500 });
    }
};
