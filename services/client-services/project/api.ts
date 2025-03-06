import { getHeaders } from "@/utils/header";
import { PROJECT_ERRORS } from "@/utils/error-constants";

export interface Project {
    id: number;
    name: string;
    description: string;
    status: string;
    created_by: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectCreateData {
    name: string;
    description: string;
    status: string;
    created_by: number;
}

export const projectApi = {
    getAllProjects: async (page: number = 1, limit: number = 10) => {
        const response = await fetch(`/api/projects?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(PROJECT_ERRORS.NOT_FOUND);
        return response.json();
    },

    getProjectById: async (id: number) => {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(PROJECT_ERRORS.NOT_FOUND);
        return response.json();
    },

    getProjectsByStatus: async (status: string) => {
        const response = await fetch(`/api/projects/status/${status}`, {
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(PROJECT_ERRORS.NOT_FOUND);
        return response.json();
    },

    createProject: async (projectData: ProjectCreateData) => {
        const response = await fetch(`/api/projects`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error(PROJECT_ERRORS.CREATION_FAILED);
        return response.json();
    },

    updateProject: async (id: number, projectData: Partial<ProjectCreateData>) => {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(projectData)
        });
        if (!response.ok) throw new Error(PROJECT_ERRORS.UPDATE_FAILED);
        return response.json();
    },

    deleteProject: async (id: number) => {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) throw new Error(PROJECT_ERRORS.DELETE_FAILED);
        return response.json();
    }
};