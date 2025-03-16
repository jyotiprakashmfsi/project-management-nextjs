import { ProjectUser, User } from '../../db/models/mongodb/models';
import { ProjectUserCreateData } from '../../types/projectuser';
import { PaginationParams } from '../../types/project';
import mongoose from 'mongoose';
import { getNextSequenceValue } from '../../helper/autoIncrement';

export class ProjectUserRepository {
    async addUserToProject(projectUserData: ProjectUserCreateData): Promise<any> {
        try {
            const newProjectUser = new ProjectUser({
                id: await getNextSequenceValue('project_user'),
                user_id: projectUserData.user_id,
                project_id: projectUserData.project_id,
                role: projectUserData.role || 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            const savedProjectUser = await newProjectUser.save();
            return savedProjectUser;
        } catch (error) {
            console.error('Error adding user to project:', error);
            throw error;
        }
    }

    async getProjectUsers(projectId: number, pagination: PaginationParams): Promise<{ users: any[], total: number }> {
        try {
            const projectIdNum = typeof projectId === 'string' 
                ? parseInt(projectId)
                : projectId;
            
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const total = await ProjectUser.countDocuments({ project_id: projectIdNum });
            
            const projectUsers = await ProjectUser.find({ project_id: projectIdNum })
                .skip(skip)
                .limit(limit)
                .lean();
            
            if (!projectUsers || projectUsers.length === 0) {
                return { users: [], total: 0 };
            }
            
            const userIds = projectUsers.map(pu => pu.user_id);
            
            const userList = await User.find({ id: { $in: userIds } }).lean();
            
            const users = projectUsers.map(pu => {
                const user = userList.find(u => u.id === pu.user_id);
                
                return {
                    id: pu.id,
                    user_id: user?.id || 0,
                    project_id: pu.project_id,
                    role: pu.role || '',
                    fname: user?.fname || '',
                    email: user?.email || '',
                    contact: user?.contact || '',
                    dob: user?.dob || ''
                };
            });
            
            return { users, total };
        } catch (error) {
            console.error(`Error getting users for project ${projectId}:`, error);
            throw error;
        }
    }

    async getUserProjects(userId: number): Promise<any[]> {
        try {
            const userIdNum = typeof userId === 'string' 
                ? parseInt(userId)
                : userId;
                
            console.log("User id", userIdNum);
            const projectUsers = await ProjectUser.find({ user_id: userIdNum }).lean();
            
            if (!projectUsers || projectUsers.length === 0) {
                return [];
            }
            
            const projectIds = projectUsers.map(pu => pu.project_id);
            
            const projects = await mongoose.model('Project').find({ id: { $in: projectIds } }).lean();
            
            return projectUsers.map(pu => {
                const project = projects.find(p => p.id === pu.project_id) ;
                console.log("Userid, projects: ", userId, project);
                if(!project) return null;
                return {
                        id: project.id,
                        project_name: project.name,
                        description: project.description,
                        status: project.status,
                        created_by: project.created_by,
                        role: pu.role,
                        createdAt: project.createdAt,
                        updatedAt: project.updatedAt
                    };
            }).filter(Boolean);
        } catch (error) {
            console.error(`Error getting projects for user ${userId}:`, error);
            throw error;
        }
    }

    async updateProjectUserRole(id: number | string, role: string): Promise<any> {
        try {
            const objectId = typeof id === 'string' 
                ? parseInt(id)
                : id;
                
            const updatedProjectUser = await ProjectUser.findByIdAndUpdate(
                objectId,
                {
                    role: role,
                    updatedAt: new Date()
                },
                { new: true }
            ).lean();
            
            return updatedProjectUser;
        } catch (error) {
            console.error(`Error updating role for project user ${id}:`, error);
            throw error;
        }
    }

    async removeUserFromProject(projectId: string | number, userId: string | number): Promise<boolean> {
        try {
            const projectIdNum = typeof projectId === 'string' 
                ? parseInt(projectId)
                : projectId;
                
            const userIdNum = typeof userId === 'string' 
                ? parseInt(userId)
                : userId;
                
            const result = await ProjectUser.deleteOne({
                project_id: projectIdNum,
                user_id: userIdNum
            });
            
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error removing user ${userId} from project ${projectId}:`, error);
            throw error;
        }
    }

    async isUserInProject(projectId: string | number, userId: string | number): Promise<boolean> {
        try {
            const projectIdNum = typeof projectId === 'string' 
                ? parseInt(projectId)
                : projectId;
                
            const userIdNum = typeof userId === 'string' 
                ? parseInt(userId)
                : userId;
                
            const count = await ProjectUser.countDocuments({
                project_id: projectIdNum,
                user_id: userIdNum
            });
            
            return count > 0;
        } catch (error) {
            console.error(`Error checking if user ${userId} is in project ${projectId}:`, error);
            throw error;
        }
    }

    async getAllTeamMembers(userId: string | number): Promise<any[]> {
        try {
            const userIdNum = typeof userId === 'string' 
                ? parseInt(userId)
                : userId;
            
            // Get all projects the user is a member of
            const userProjects = await ProjectUser.find({ user_id: userIdNum })
                .select('project_id')
                .lean();
            
            if (!userProjects || userProjects.length === 0) {
                return [];
            }
            
            const projectIds = userProjects.map(up => up.project_id);
            
            // Get all project users except the current user
            const teamMemberRecords = await ProjectUser.find({
                project_id: { $in: projectIds },
                user_id: { $ne: userIdNum }
            }).lean();
            
            if (!teamMemberRecords || teamMemberRecords.length === 0) {
                return [];
            }
            
            // Get all unique user IDs
            const userIds = [...new Set(teamMemberRecords.map(tm => tm.user_id))];
            
            // Fetch all users in a separate query
            const users = await User.find({ id: { $in: userIds } }).lean();
            
            // Create a map of unique team members
            const uniqueMembers = new Map();
            
            teamMemberRecords.forEach(member => {
                // Find the corresponding user
                const user = users.find(u => u.id === member.user_id);
                
                // Skip if user not found
                if (!user) return;
                
                if (!uniqueMembers.has(user.id.toString())) {
                    uniqueMembers.set(user.id.toString(), {
                        id: member.id,
                        user_id: user.id,
                        fname: user.fname || '',
                        email: user.email || '',
                        contact: user.contact || '',
                        role: member.role || ''
                    });
                }
            });
            
            return Array.from(uniqueMembers.values());
        } catch (error) {
            console.error(`Error getting team members for user ${userId}:`, error);
            throw error;
        }
    }
}
