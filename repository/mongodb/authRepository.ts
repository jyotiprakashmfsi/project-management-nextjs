import { User } from '../../db/models/mongodb/models';
import { UserData } from "../../types/user";
import { AUTH_ERRORS } from '../../utils/error-constants';
import { getNextSequenceValue } from '../../helper/autoIncrement';

export class AuthRepository {
    async createUser(userData: UserData, hashedPassword: string): Promise<void> {
        try {
            const newUser = new User({
                id: await getNextSequenceValue('User'),
                fname: userData.fname,
                email: userData.email,
                password: hashedPassword,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            
            await newUser.save();
            console.log('AuthRepository: User created successfully');
        } catch (error) {
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : AUTH_ERRORS.CREATION_FAILED}`);
        }
    }

    async findUserByEmail(email: string): Promise<any> {
        try {
            const user = await User.findOne({ email }).lean();
            
            return user ? [user] : [];
        } catch (error) {
            throw new Error(`Failed to find user: ${error instanceof Error ? error.message : AUTH_ERRORS.NOT_FOUND}`);
        }
    }
}
