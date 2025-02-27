import { hashPassword } from '../../helper/passwordHash';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRepository } from '../../repository/authRepository';
import { UserData, SafeUser } from '../../types/user';
const bcrypt = require("bcrypt");

dotenv.config();
const secretKey = process.env.JWT_SECRET_TOKEN || '';

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    async createUser(userData: UserData): Promise<void> {
        const hashedPassword = await hashPassword(userData.password);
        await this.authRepository.createUser(userData, hashedPassword);
    }

    async authenticateUser(email: string, password: string): Promise<{ token: string, user: SafeUser }> {
        const [user] = await this.authRepository.findUserByEmail(email);

        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const safeUser: SafeUser = {
            id: user.id,
            email: user.email,
            fname: user.fname
        };

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            secretKey,
            { expiresIn: '24h' }
        );

        return { token, user: safeUser };
    }
}
