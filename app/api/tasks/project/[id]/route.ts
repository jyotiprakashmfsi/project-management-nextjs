import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "../../../../../services/api-services/taskService";

const taskService = new TaskService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<any> {
    try {
        const { id } = await params;
        const projectId = parseInt(id);
        const tasks = await taskService.getTasksByProjectId(projectId);
        // console.log("Tasks fetched:", tasks)
        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch project tasks", error }, { status: 500 });
    }
};

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const taskId = parseInt(id);
        // console.log("Request Body:", req.body)
        const body = await req.json()
        const updatedTask = await taskService.updateTask(taskId, body);
        
        if (!updatedTask) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Task updated successfully", task: updatedTask }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update task", error }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = await params;
        const taskId = parseInt(id);
        
        const deleted = await taskService.deleteTask(taskId);
        
        if (!deleted) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to delete task", error }, { status: 500 });
    }
}; 