import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "../../../../../../services/api-services/taskService";
const taskService = new TaskService();

export const GET = async (req: NextRequest, { params: { id } }: { params: { id: string } }): Promise<any> => {
    try {
        const projectId = parseInt(id);
        const status = "finished";
        const tasks = await taskService.getTasksByProjectStatus(projectId, status);
        return NextResponse.json(tasks), { status: 200 };
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch project tasks", error }, { status: 500 });
    }
};