import { Project, ProjectCreateData, PaginationParams } from "../../types/project";
import { ProjectRepository } from "../../repository/projectRepository";

export class ProjectService {
    private projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    async createProject(projectData: ProjectCreateData): Promise<Project | null> {
        return this.projectRepository.createProject(projectData);
    }

    async getAllProjects(page: number = 1, limit: number = 10): Promise<{ projects: Project[], total: number }> {
        const pagination: PaginationParams = { page, limit };
        return this.projectRepository.getAllProjects(pagination);
    }

    async getProjectById(id: number): Promise<any | null> {
        return this.projectRepository.getProjectById(id);
    }

    async updateProject(id: number, projectData: Partial<ProjectCreateData>): Promise<Project | null> {
        return this.projectRepository.updateProject(id, projectData);
    }

    async deleteProject(id: number): Promise<boolean> {
        return this.projectRepository.deleteProject(id);
    }

    async getProjectsByStatus(status: string): Promise<Project[]> {
        return this.projectRepository.getProjectsByStatus(status);
    }
}
