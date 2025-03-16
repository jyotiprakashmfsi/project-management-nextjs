import { Task } from '../../db/models/mongodb/models';
import { TaskCreateData, Task as TaskType, PaginationParams } from '../../types/task';
import mongoose from 'mongoose';
import { getNextSequenceValue } from '../../helper/autoIncrement';

export class TaskRepository {
    async createTask(taskData: TaskCreateData): Promise<any> {
        try {
            const id = await getNextSequenceValue('task');
            
            const newTask = new Task({
                id,
                project_id: taskData.project_id,
                title: taskData.title,
                description: taskData.description,
                status: taskData.status || 'pending',
                end_time: taskData.end_time ? new Date(taskData.end_time) : undefined,
                assigned_to: taskData.assigned_to,
                task_json: taskData.task_json,
                priority: taskData.priority || 'low',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            const savedTask = await newTask.save();
            return savedTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async getAllTasks(pagination: PaginationParams): Promise<{ tasks: any[], total: number }> {
        try {
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const tasks = await Task.find()
                .skip(skip)
                .limit(limit)
                .populate('project_id', 'name')
                .populate('assigned_to', 'fname email')
                .lean();
                
            const total = await Task.countDocuments();
            
            return {
                tasks,
                total
            };
        } catch (error) {
            console.error('Error getting all tasks:', error);
            throw error;
        }
    }

    async getTaskById(taskId: string | number): Promise<any> {
        try {
            const taskIdNum = typeof taskId === 'string' ? parseInt(taskId) : taskId;
            const task = await Task.findOne({ id: taskIdNum }).lean();
            return task;
        } catch (error) {
            console.error(`Error getting task by ID ${taskId}:`, error);
            throw error;
        }
    }

    async getTasksByProjectId(projectId: string | number, pagination: PaginationParams, status?: string): Promise<{ tasks: any[], total: number }> {
        try {
            const projectIdNum = typeof projectId === 'string' 
                ? parseInt(projectId)
                : projectId;
                
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const query: any = { project_id: projectIdNum };
            if (status) {
                query.status = status;
            }
            
            const tasks = await Task.find(query)
                .skip(skip)
                .limit(limit)
                .populate('assigned_to', 'fname email')
                .lean();
                
            const total = await Task.countDocuments(query);
            
            return {
                tasks,
                total
            };
        } catch (error) {
            console.error(`Error getting tasks for project ${projectId}:`, error);
            throw error;
        }
    }

    async getUserTasks(userId: string | number, pagination: PaginationParams): Promise<{ tasks: any[], total: number }> {
        try {
            const userIdNum = typeof userId === 'string' 
                ? parseInt(userId)
                : userId;
                
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const tasks = await Task.find({ assigned_to: userIdNum })
                .skip(skip)
                .limit(limit)
                .populate('project_id', 'name')
                .lean();
                
            const total = await Task.countDocuments({ assigned_to: userIdNum });
            
            return {
                tasks,
                total
            };
        } catch (error) {
            console.error(`Error getting tasks for user ${userId}:`, error);
            throw error;
        }
    }

    async updateTask(taskId: string | number, updateData: Partial<TaskType>): Promise<any> {
        try {
            const taskIdNum = typeof taskId === 'string' ? parseInt(taskId) : taskId;
            
            const updateFields: any = {
                ...updateData,
                updatedAt: new Date()
            };
            
            const updatedTask = await Task.findOneAndUpdate(
                { id: taskIdNum },
                updateFields,
                { new: true }
            ).lean();
            
            return updatedTask;
        } catch (error) {
            console.error(`Error updating task ${taskId}:`, error);
            throw error;
        }
    }

    async deleteTask(taskId: string | number): Promise<boolean> {
        try {
            const taskIdNum = typeof taskId === 'string' ? parseInt(taskId) : taskId;
            const result = await Task.findOneAndDelete({ id: taskIdNum });
            return !!result;
        } catch (error) {
            console.error(`Error deleting task ${taskId}:`, error);
            throw error;
        }
    }

    async getTasksByStatus(status: string, pagination: PaginationParams): Promise<{ tasks: any[], total: number }> {
        try {
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const tasks = await Task.find({ status })
                .skip(skip)
                .limit(limit)
                .populate('project_id', 'name')
                .populate('assigned_to', 'fname email')
                .lean();
                
            const total = await Task.countDocuments({ status });
            
            return {
                tasks,
                total
            };
        } catch (error) {
            console.error(`Error getting tasks with status ${status}:`, error);
            throw error;
        }
    }

    async getTasksByPriority(priority: string, pagination: PaginationParams): Promise<{ tasks: any[], total: number }> {
        try {
            const limit = pagination.limit;
            const skip = (pagination.page - 1) * limit;
            
            const tasks = await Task.find({ priority })
                .skip(skip)
                .limit(limit)
                .populate('project_id', 'name')
                .populate('assigned_to', 'fname email')
                .lean();
                
            const total = await Task.countDocuments({ priority });
            
            return {
                tasks,
                total
            };
        } catch (error) {
            console.error(`Error getting tasks with priority ${priority}:`, error);
            throw error;
        }
    }
}
