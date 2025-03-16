import { Project, IProject } from '../../db/models/mongodb/models';
import { Project as ProjectType, ProjectCreateData, PaginationParams } from '../../types/project';
import { getLocalTimeString } from '../../helper/date';
import mongoose from 'mongoose';
import { ProjectUserRepository } from './projectUserRepository';
import { getNextSequenceValue } from '../../helper/autoIncrement';

export class ProjectRepository {
    private projectUserRepository: ProjectUserRepository;

    constructor() {
        this.projectUserRepository = new ProjectUserRepository();
    }

    async createProject(projectData: ProjectCreateData): Promise<ProjectType | null> {
        try {
            const currentTime = new Date();
            const newProject = new Project({
                id: await getNextSequenceValue('Project'),
                name: projectData.name,
                description: projectData.description,
                status: projectData.status,
                created_by: projectData.created_by,
                createdAt: currentTime,
                updatedAt: currentTime
            });
            
            const savedProject = await newProject.save();
            const projectId = (savedProject.id as number);
            
            const userId = projectData.created_by.toString();
            
            await this.projectUserRepository.addUserToProject({
                project_id: projectId,
                user_id: parseInt(userId),
                role: 'admin'
            });
            
            return this.getProjectById(projectId);    
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    }

    async getAllProjects(pagination: PaginationParams): Promise<{ projects: ProjectType[], total: number }> {
        try {
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const projects = await Project.find({})
                .skip(skip)
                .limit(limit)
                .lean();
            
            const total = await Project.countDocuments({});
            
            const transformedProjects = projects.map(project => {
                return {
                    id: project.id,
                    project_name: project.name,
                    description: project.description || '',
                    status: project.status,
                    created_by: project.created_by,
                    createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
                    updatedAt: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined
                };
            });
            
            return {
                projects: transformedProjects,
                total
            };
        } catch (error) {
            console.error('Error getting all projects:', error);
            throw error;
        }
    }

    async getProjectById(id: number): Promise<ProjectType | null> {
        try {
            const project = await Project.findOne({ id }).lean();
            
            if (!project) return null;
            
            return {
                id: project.id,
                project_name: project.name,
                description: project.description || '',
                status: project.status,
                created_by: project.created_by,
                createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
                updatedAt: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined
            };
        } catch (error) {
            console.error(`Error getting project by ID ${id}:`, error);
            throw error;
        }
    }

    async updateProject(id: number, projectData: Partial<ProjectType>): Promise<ProjectType | null> {
        try {
            const currentTime = new Date();
            
            const updateData: any = {
                updatedAt: currentTime
            };
            
            if (projectData.project_name) {
                updateData.name = projectData.project_name;
            }
            
            if (projectData.description) {
                updateData.description = projectData.description;
            }
            
            if (projectData.status) {
                updateData.status = projectData.status;
            }
            
            const updatedProject = await Project.findOneAndUpdate(
                { id },
                updateData,
                { new: true }
            ).lean();
            
            if (!updatedProject) return null;
            
            return {
                id: updatedProject.id,
                project_name: updatedProject.name,
                description: updatedProject.description || '',
                status: updatedProject.status,
                created_by: updatedProject.created_by,
                createdAt: updatedProject.createdAt ? new Date(updatedProject.createdAt).toISOString() : undefined,
                updatedAt: updatedProject.updatedAt ? new Date(updatedProject.updatedAt).toISOString() : undefined
            };
        } catch (error) {
            console.error(`Error updating project ${id}:`, error);
            throw error;
        }
    }

    async deleteProject(id: number): Promise<boolean> {
        try {
            const result = await Project.findOneAndDelete({ id });
            return !!result;
        } catch (error) {
            console.error(`Error deleting project ${id}:`, error);
            throw error;
        }
    }

    async getProjectsByStatus(status: string): Promise<ProjectType[]> {
        try {
            const projects = await Project.find({ status }).lean();
            
            const transformedProjects = projects.map(project => {
                return {
                    id: project.id,
                    project_name: project.name,
                    description: project.description || '',
                    status: project.status,
                    created_by: project.created_by,
                    createdAt: project.createdAt ? new Date(project.createdAt).toISOString() : undefined,
                    updatedAt: project.updatedAt ? new Date(project.updatedAt).toISOString() : undefined
                };
            });
            
            return transformedProjects;
        } catch (error) {
            console.error(`Error getting projects by status ${status}:`, error);
            throw error;
        }
    }
}
