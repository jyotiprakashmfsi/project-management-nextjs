import { Task, TaskCreateData } from "@/types/task";
import { getHeaders } from "@/utils/header";

export const taskApi = {
    getAllTasks: async (page: number = 1, limit: number = 10): Promise<any> => {
        const response = await fetch(`/api/tasks?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch tasks');
        return response.json();
    },

    getTaskById: async (id: number): Promise<any> => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch task');
        return response.json();
    },

    getProjectTasks: async (projectId: number): Promise<Task[]> => {
        const response = await fetch(`/api/tasks/project/${projectId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch project tasks');
        return response.json();
    },

    getProjectTasksByStatus: async (projectId: number, status: 'not-started' | 'started' | 'finished'): Promise<Task[]> => {
        const response = await fetch(`/api/tasks/project/${status}/${projectId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to fetch project tasks by status');
        return response.json();
    },

    createTask: async (taskData: TaskCreateData): Promise<Task> => {
        const response = await fetch(`/api/tasks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },

    updateTask: async (id: number, taskData: Partial<TaskCreateData>): Promise<Task> => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        return response.json();
    },

    deleteTask: async (id: number): Promise<void> => {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
    }
};
