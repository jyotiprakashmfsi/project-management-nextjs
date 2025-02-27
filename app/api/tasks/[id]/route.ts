import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "../../../../services/api-services/taskService";

const taskService = new TaskService();

export const GET = async (req: NextRequest, { params }: { params: { id: string } }): Promise<any> => {
    try {
        const { id } = await params;
        const taskId = parseInt(id);
        const task = await taskService.getTaskById(taskId);
        
        if (!task) {
            return NextResponse.json({ message: "Task not found" }, { status: 404 });
        }
        
        return NextResponse.json({task}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch task", error }, { status: 500 });
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