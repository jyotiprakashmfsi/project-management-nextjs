import { sequelize } from '../db/models/index';
import { ProjectUser, ProjectUserCreateData, PaginationParams } from '../types/projectuser';
import { getLocalTimeString } from '../helper/date';

export class ProjectUserRepository {
    async addUserToProject(projectUserData: ProjectUserCreateData): Promise<ProjectUser | null> {
        const currentTime = getLocalTimeString(new Date());
        
        const [result] = await sequelize.query(
            `INSERT INTO project_users (project_id, user_id, role, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?)`,
            {
                replacements: [
                    projectUserData.project_id,
                    projectUserData.user_id,
                    projectUserData.role,
                    currentTime,
                    currentTime
                ]
            }
        );
        return this.getProjectUserById((result as any));
    }

    async getProjectUserById(id: number): Promise<ProjectUser | null> {
        const [projectUsers] = await sequelize.query(
            `SELECT * FROM project_users WHERE id = ?`,
            {
                replacements: [id]
            }
        );
        return (projectUsers as ProjectUser[])[0] || null;
    }

    async getProjectUsers(projectId: number, pagination: PaginationParams): Promise<{ users: ProjectUser[], total: number }> {
        const offset = (pagination.page - 1) * pagination.limit;
        const [users] = await sequelize.query(
            `SELECT pu.*, u.fname, u.email 
             FROM project_users pu
             INNER JOIN users u ON pu.user_id = u.id
             WHERE pu.project_id = ?
             LIMIT ? OFFSET ?`,
            {
                replacements: [projectId, pagination.limit, offset]
            }
        );
        // console.log("Project users fetched: ", users)
        
        const [totalCount] = await sequelize.query(
            `SELECT COUNT(*) as count FROM project_users WHERE project_id = ?`,
            {
                replacements: [projectId]
            }
        );
        
        return {
            users: users as ProjectUser[],
            total: (totalCount as any)[0].count
        };
    }

    async getUserProjects(userId: number): Promise<ProjectUser[]> {
        const [projects] = await sequelize.query(
            `SELECT pu.*, p.name as project_name, p.description as project_description
             FROM project_users pu
             INNER JOIN projects p ON pu.project_id = p.id
             WHERE pu.user_id = ?`,
            {
                replacements: [userId]
            }
        );
        return projects as ProjectUser[];
    }

    async updateProjectUserRole(id: number, role: string): Promise<ProjectUser | null> {
        const currentTime = getLocalTimeString(new Date());
        
        await sequelize.query(
            `UPDATE project_users SET role = ?, updatedAt = ? WHERE id = ?`,
            {
                replacements: [role, currentTime, id]
            }
        );

        return this.getProjectUserById(id);
    }

    async removeUserFromProject(projectId: number, userId: number): Promise<boolean> {
        const [result] = await sequelize.query(
            `DELETE FROM project_users WHERE project_id = ? AND user_id = ?`,
            {
                replacements: [projectId, userId]
            }
        );
        return (result as any).affectedRows > 0;
    }

    async isUserInProject(projectId: number, userId: number): Promise<boolean> {
        const [result] = await sequelize.query(
            `SELECT COUNT(*) as count FROM project_users WHERE project_id = ? AND user_id = ?`,
            {
                replacements: [projectId, userId]
            }
        );
        return (result as any)[0].count > 0;
    }

    async getAllTeamMembers(userId: number): Promise<ProjectUser[]> {
        const [teamMembers] = await sequelize.query(
            `SELECT DISTINCT pu2.*, u.fname, u.email, p.name as project_name
             FROM project_users pu1
             JOIN projects p ON pu1.project_id = p.id
             JOIN project_users pu2 ON pu1.project_id = pu2.project_id
             JOIN users u ON pu2.user_id = u.id
             WHERE pu1.user_id = ?
             ORDER BY p.name, u.fname`,
            {
                replacements: [userId]
            }
        );
        
        return teamMembers as ProjectUser[];
    }
}