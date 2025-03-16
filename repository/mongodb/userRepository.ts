import { User, IUser } from '../../db/models/mongodb/models';
import { UserUpdateData } from '../../types/user';
import { getLocalTimeString } from '../../helper/date';

export class UserRepository {
    async getAllUsers() {
        try {
            const users = await User.find({}).lean();
            return users;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    async getUserById(userId: string) {
        try {
            const user = await User.findById(userId).lean();
            return user ? [user] : [];
        } catch (error) {
            console.error(`Error getting user by ID ${userId}:`, error);
            throw error;
        }
    }

    async updateUser(userId: string, updateData: UserUpdateData) {
        try {
            const currentTime = new Date();
            
            const updateFields: Partial<IUser> = {
                ...updateData,
                updatedAt: currentTime
            };

            if (updateData.dob) {
                updateFields.dob = getLocalTimeString(new Date(updateData.dob));
            }

            const result = await User.findByIdAndUpdate(
                userId,
                updateFields,
                { new: true }
            );

            return result;
        } catch (error) {
            console.error(`Error updating user ${userId}:`, error);
            throw error;
        }
    }
}
