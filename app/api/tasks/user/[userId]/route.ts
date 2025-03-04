import { NextRequest, NextResponse } from "next/server";
import { TaskService } from "../../../../../services/api-services/taskService";

const taskService = new TaskService();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
    try {
        const { userId } = await params;   
        const { searchParams } = new URL(request.url);
        const page = searchParams.get('page') || '1';
        const limit = searchParams.get('limit') || '10';
        
        const result = await taskService.getUserTasks(
            parseInt(userId), 
            parseInt(page), 
            parseInt(limit)
        );
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch project users", error }, { status: 500 });
    }
};
