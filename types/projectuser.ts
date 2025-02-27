export interface ProjectUser {
    id: number;
    project_id: number;
    user_id: number;
    role: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProjectUserCreateData {
    project_id: number;
    user_id: number;
    role: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}