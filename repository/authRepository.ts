import { UserData } from "../types/user";
import { sequelize } from '../db/models/index';

export class AuthRepository {
    async createUser(userData: UserData, hashedPassword: string): Promise<void> {
        try {            
            await sequelize.query(
                'INSERT INTO users (fname, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
                {
                    replacements: [userData.fname, userData.email, hashedPassword, new Date(), new Date()],
                    logging: console.log
                }
            );
            console.log('AuthRepository: User created successfully');
        } catch (error) {
            console.error('AuthRepository: Error creating user:', error);
            throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async findUserByEmail(email: string): Promise<any> {
        try {
            console.log('AuthRepository: Attempting to find user by email:', email);
            const [user] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
                replacements: [email],
                logging: console.log
            }) as any[];
            
            return user;
        } catch (error) {
            console.error('AuthRepository: Error finding user by email:', error);
            throw new Error(`Failed to find user: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
