export interface Project {
    id: number;
    name: string;
    status: string;
    description: string;
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

export interface PaginationParams {
    page: number;
    limit: number;
}
