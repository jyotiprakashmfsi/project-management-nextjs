import { sequelize } from '../db/models/index';
import { UserUpdateData } from '../types/user';
import { getLocalTimeString } from '../helper/date';

export class UserRepository {
    async getAllUsers() {
        const [users] = await sequelize.query(
            'SELECT * FROM users',
        );
        return users;   
    }

    async getUserById(userId: string) {
        const [user] = await sequelize.query(
            'SELECT * FROM users WHERE id = ?', {
                replacements: [userId],
            }
        );
        return user;
    }

    async updateUser(userId: string, updateData: UserUpdateData) {
        const currentTime = getLocalTimeString(new Date());
        
        if (updateData.dob) {
            updateData.dob = getLocalTimeString(new Date(updateData.dob));
        }

        const [result] = await sequelize.query(
            'UPDATE users SET fname = ?, email = ?, contact = ?, dob = ?, updatedAt = ? WHERE id = ?',
            {
                replacements: [
                    updateData.fname,
                    updateData.email,
                    updateData.contact || '',
                    updateData.dob || '',
                    currentTime,
                    userId
                ],
            }
        );
        return result;
    }
}
