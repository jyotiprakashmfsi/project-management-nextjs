import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "../../../../services/api-services/projectService";

const projectService = new ProjectService();

export const GET = async (req: NextRequest, { params }: { params: { id: string } }): Promise<any> => {
    try {
        const {id} = await params;
        const project = await projectService.getProjectById(parseInt(id));
        
        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        
        return NextResponse.json(project);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch project", error }, { status: 500 });
    }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }): Promise<any> => {
    try {
        const {id} = await params;
        const projectId = parseInt(id);
        const body = await req.json()
        const updatedProject = await projectService.updateProject(projectId, body);
        
        if (!updatedProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Project updated successfully", project: updatedProject }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update project", error }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }): Promise<any> => {
    try {
        const {id} = await params;
        const projectId = parseInt(id);
        const deleted = await projectService.deleteProject(projectId);
        
        if (!deleted) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete project", error }, { status: 500 });
    }
};