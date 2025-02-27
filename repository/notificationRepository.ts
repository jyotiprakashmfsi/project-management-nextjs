import { sequelize } from '../db/models/index';
import { Task } from "../types/task";

export class NotificationRepository {
    async getApproachingTasks(userId: string): Promise<any> {
        const now = new Date();
        const fiveMinsFromNow = new Date(now.getTime() + 5 * 60 * 1000);

        const tasks = await sequelize.query(
            'SELECT * FROM tasks WHERE status = "pending" AND end_time BETWEEN ? AND ? AND user_id = ?',
            {
                replacements: [now, fiveMinsFromNow, userId],
            }
        );

        return tasks;
    }

    async getOverdueTasks(userId: string): Promise<any> {
        const now = new Date();

        const tasks = await sequelize.query(
            'SELECT * FROM tasks WHERE status = "pending" AND end_time < ? AND user_id = ?',
            {
                replacements: [now, userId],
            }
        ) ;

        return tasks;
    }
}
