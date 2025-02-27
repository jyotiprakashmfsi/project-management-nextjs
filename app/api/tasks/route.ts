import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "../../../services/api-services/taskService";

const taskService = new TaskService();


export const GET = async (req: NextRequest, { params: { projectId }, searchParams: { page, limit } }: { params: { projectId: string }, searchParams: { page: string, limit: string } }) => {
    try {
        const result = await taskService.getAllTasks(parseInt(page) || 1, parseInt(limit) || 10);
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch tasks", error }, { status: 500 });
    }
};

export const POST = async (req: NextRequest): Promise<any> => {
    try {
        const body = await req.json()
        const task = await taskService.createTask(body);
        return NextResponse.json({ message: "Task created successfully", task }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to create task", error }, { status: 500 });
    }
};