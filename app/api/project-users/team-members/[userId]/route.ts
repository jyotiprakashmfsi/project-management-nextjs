import { NextRequest, NextResponse } from "next/server";
import { ProjectUserService } from "../../../../../services/api-services/projectUserService";

const projectUserService = new ProjectUserService();

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
    try {
        const { userId } = params;
        const id = parseInt(userId);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const teamMembers = await projectUserService.getAllTeamMembers(id);
        return NextResponse.json(teamMembers);
    } catch (error) {
        console.error("Error getting team members:", error);
        return NextResponse.json({ error: "Failed to get team members" }, { status: 500 });
    }
};