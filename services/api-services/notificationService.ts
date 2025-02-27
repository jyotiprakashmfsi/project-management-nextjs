import { NotificationRepository } from '../../repository/notificationRepository';
import { Task } from '../../types/task';

export class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async getApproachingTasks(userId: string): Promise<Task[]> {
        return await this.notificationRepository.getApproachingTasks(userId);
    }

    async getOverdueTasks(userId: string): Promise<Task[]> {
        return await this.notificationRepository.getOverdueTasks(userId);
    }
}
