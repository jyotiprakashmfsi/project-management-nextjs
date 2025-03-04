import { Task, TaskCreateData, PaginationParams } from "../../types/task";
import { TaskRepository } from "../../repository/taskRepository";

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async createTask(taskData: TaskCreateData): Promise<Task | null> {
        return this.taskRepository.createTask(taskData);
    }

    async getAllTasks(page: number = 1, limit: number = 10): Promise<{ tasks: Task[], total: number }> {
        const pagination: PaginationParams = { page, limit };
        return this.taskRepository.getAllTasks(pagination);
    }

    async getTaskById(id: number): Promise<Task | null> {
        return this.taskRepository.getTaskById(id);
    }

    async getTasksByProjectId(projectId: number): Promise<Task[]> {
        return this.taskRepository.getTasksByProjectId(projectId);
    }

    async getTasksByProjectStatus(projectId: number, status: string): Promise<Task[]> {
        return this.taskRepository.getTasksByProjectId(projectId, status);
    }

    async updateTask(id: number, taskData: Partial<TaskCreateData>): Promise<Task | null> {
        return this.taskRepository.updateTask(id, taskData);
    }

    async getUserTasks(userId: number, page: number = 1, limit: number = 10): Promise<{ tasks: Task[], total: number }> {
        const pagination: PaginationParams = { page, limit };
        return this.taskRepository.getUserTasks(userId, pagination);
    }

    async deleteTask(id: number): Promise<boolean> {
        return this.taskRepository.deleteTask(id);
    }
}
