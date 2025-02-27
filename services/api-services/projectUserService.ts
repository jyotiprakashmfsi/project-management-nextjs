import { ProjectUser, ProjectUserCreateData, PaginationParams } from "../../types/projectuser";
import { ProjectUserRepository } from "../../repository/projectUserRepository";

export class ProjectUserService {
    private projectUserRepository: ProjectUserRepository;

    constructor() {
        this.projectUserRepository = new ProjectUserRepository();
    }

    async addUserToProject(projectUserData: ProjectUserCreateData): Promise<ProjectUser | null> {
        return this.projectUserRepository.addUserToProject(projectUserData);
    }

    async getProjectUsers(projectId: number, pagination: PaginationParams): Promise<{ users: ProjectUser[], total: number }> {
        return this.projectUserRepository.getProjectUsers(projectId, pagination);
    }

    async getUserProjects(userId: number): Promise<ProjectUser[]> {
        return this.projectUserRepository.getUserProjects(userId);
    }

    async updateProjectUserRole(id: number, role: string): Promise<ProjectUser | null> {
        return this.projectUserRepository.updateProjectUserRole(id, role);
    }

    async removeUserFromProject(projectId: number, userId: number): Promise<boolean> {
        return this.projectUserRepository.removeUserFromProject(projectId, userId);
    }

    async isUserInProject(projectId: number, userId: number): Promise<boolean> {
        return this.projectUserRepository.isUserInProject(projectId, userId);
    }

    async getAllTeamMembers(userId: number): Promise<ProjectUser[]> {
        return this.projectUserRepository.getAllTeamMembers(userId);
    }
}
