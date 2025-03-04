export interface Task {
    id: number;
    project_id: number;
    title: string;
    description: string;
    status: string;
    end_time: string;
    assigned_to: number;
    task_json: any;
    priority: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface TaskCreateData {
    project_id: number;
    title: string;
    description: string;
    status: string;
    end_time: string;
    assigned_to: number;
    task_json: any;
    priority: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}
