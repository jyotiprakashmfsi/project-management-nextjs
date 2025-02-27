import { UserData } from "../types/user";
import { sequelize } from '../db/models/index';

export class AuthRepository {
    async createUser(userData: UserData, hashedPassword: string): Promise<void> {
        await sequelize.query(
            'INSERT INTO users (fname, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
            {
                replacements: [userData.fname, userData.email, hashedPassword, new Date(), new Date()],
            }
        );
    }

    async findUserByEmail(email: string): Promise<any> {
        const [user] = await sequelize.query('SELECT * FROM users WHERE email = ?', {
            replacements: [email],
        }) as any[];
        
        return user;
    }
}
