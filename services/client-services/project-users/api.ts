import { ProjectUserCreateData } from '@/types/projectuser';
import { getHeaders } from '@/utils/header';


export const projectUserApi = {
    addUserToProject: async (data: ProjectUserCreateData) => {
        const response = await fetch(`/api/project-users`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to add user to project');
        }
        return response.json();
    },

    updateProjectUserRole: async (projectId: number, userId: number, role: string) => {
        const response = await fetch(`/api/project-users/project/${projectId}/user/${userId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ role })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update user role');
        }
        return response.json();
    },

    removeUserFromProject: async (projectId: number, userId: number) => {
        const response = await fetch(`/api/project-users/project/${projectId}/user/${userId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove user from project');
        }
        return response.json();
    },

    getProjectUsers: async (projectId: number, page: number = 1, limit: number = 10) => {
        const response = await fetch(`/api/project-users/project/${projectId}?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    },

    getUserProjects: async (userId: number ) => {
        // console.log("request sending to ", `${API_URL}/project-users/user/${userId}, with headers ${getHeaders().Authorisation}`);
        const response = await fetch(`/api/project-users/user/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    },

    updateUserRole: async (id: number, role: string) => {
        const response = await fetch(`/api/project-users/${id}/role`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({ role })
        });
        return response.json();
    },

    checkUserInProject: async (projectId: number, userId: number) => {
        const response = await fetch(`/api/project-users/project/${projectId}/user/${userId}/check`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    },

    getTeamMembers: async (userId: number) => {
        const response = await fetch(`/api/project-users/team-members/${userId}`, {
            method: 'GET',
            headers: getHeaders()
        });
        return response.json();
    }
};
