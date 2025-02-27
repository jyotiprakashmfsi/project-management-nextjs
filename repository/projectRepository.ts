import { sequelize } from '../db/models/index';
import { Project, ProjectCreateData, PaginationParams } from '../types/project';
import { getLocalTimeString } from '../helper/date';
import { ProjectUserRepository } from './projectUserRepository';

export class ProjectRepository {
    private projectUserRepository: ProjectUserRepository;

    constructor() {
        this.projectUserRepository = new ProjectUserRepository();
    }

    async createProject(projectData: ProjectCreateData): Promise<Project | null> {
        const currentTime = getLocalTimeString(new Date());
        
        const [result] = await sequelize.query(
            `INSERT INTO projects (name, description, status, created_by, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?)`,
            {
                replacements: [
                    projectData.name,
                    projectData.description,
                    projectData.status,
                    projectData.created_by,
                    currentTime,
                    currentTime
                ]
            }
        );
        this.projectUserRepository.addUserToProject({ project_id: (result as any), user_id: projectData.created_by, role: 'owner' });
        return this.getProjectById((result as any));
    }

    async getAllProjects(pagination: PaginationParams): Promise<{ projects: Project[], total: number }> {
        const offset = (pagination.page - 1) * pagination.limit;
        const [projects, metadata] = await sequelize.query(
            `SELECT * FROM projects LIMIT ? OFFSET ?`,
            {
                replacements: [pagination.limit, offset]
            }
        );
        
        const [totalCount] = await sequelize.query(
            `SELECT COUNT(*) as count FROM projects`
        );
        
        return {
            projects: projects as Project[],
            total: (totalCount as any)[0].count
        };
    }

    async getProjectById(id: number): Promise<Project | null> {
        const [projects] = await sequelize.query(
            `SELECT * FROM projects WHERE id = ?`,
            {
                replacements: [id]
            }
        );
        return (projects as Project[])[0] || null;
    }

    async updateProject(id: number, projectData: Partial<ProjectCreateData>): Promise<Project | null> {
        const currentTime = getLocalTimeString(new Date());
        const updates: string[] = [];
        const values: any[] = [];

        Object.entries(projectData).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'start_date' || key === 'end_date') {
                    value = getLocalTimeString(new Date(value));
                }
                updates.push(`${key} = ?`);
                values.push(value);
            }
        });

        updates.push('updatedAt = ?');
        values.push(currentTime);
        values.push(id);

        await sequelize.query(
            `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
            { replacements: values }
        );

        return this.getProjectById(id);
    }

    async deleteProject(id: number): Promise<boolean> {
        const [result] = await sequelize.query(
            `DELETE FROM projects WHERE id = ?`,
            {
                replacements: [id]
            }
        );
        return (result as any).affectedRows > 0;
    }

    async getProjectsByStatus(status: string): Promise<Project[]> {
        const [projects] = await sequelize.query(
            `SELECT * FROM projects WHERE status = ?`,
            {
                replacements: [status]
            }
        );
        return projects as Project[];
    }

}