import { hashPassword } from '../../helper/passwordHash';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRepository } from '../../repository/sql/authRepository';
import { UserData, SafeUser } from '../../types/user';
import bcrypt from 'bcryptjs';
import { AUTH_ERRORS, VALIDATION_ERRORS, USER_ERRORS } from '../../utils/error-constants';

dotenv.config();
const secretKey = process.env.JWT_SECRET_TOKEN || '';
const database = process.env.NEXT_DATABASE || 'mongodb';

// let AuthRepository: any;
// if (database === 'mongodb') {
//     AuthRepository = require('../../repository/mongodb/authRepository');
// } else {
//     AuthRepository = require('../../repository/sql/authRepository');
// }

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
        console.log('AuthService: Initialized');
    }

    async createUser(userData: UserData): Promise<void> {
        console.log('AuthService: Creating user with email:', userData.email);
        
        try {
            if (!userData.email || !userData.password || !userData.fname) {
                throw new Error(VALIDATION_ERRORS.MISSING_FIELDS);
            }
            
            let hashedPassword;
                hashedPassword = await hashPassword(userData.password);

            
            try {
                await this.authRepository.createUser(userData, hashedPassword);
            } catch (repoError) {
                throw new Error(`Repository error: ${repoError instanceof Error ? repoError.message : AUTH_ERRORS.CREATION_FAILED}`);
            }
        } catch (error) {
            throw new Error(`User creation failed: ${error instanceof Error ? error.message : USER_ERRORS.CREATION_FAILED}`);
        }
    }

    async authenticateUser(email: string, password: string): Promise<{ token: string, user: SafeUser }> {
        try {
            console.log('AuthService: Authenticating user with email:', email);
            const result = await this.authRepository.findUserByEmail(email);
            
            let user;
            if (Array.isArray(result) && result.length > 0) {
                if (Array.isArray(result[0]) && result[0].length > 0) {
                    user = result[0][0];
                } else {
                    user = result[0];
                }
            }
            console.log('User found:', user); 

            if (!user) {
                throw new Error(USER_ERRORS.NOT_FOUND);
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error(AUTH_ERRORS.INVALID_CREDENTIALS);
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
        } catch (error) {
            throw new Error(`Authentication failed: ${error instanceof Error ? error.message : AUTH_ERRORS.INVALID_CREDENTIALS}`);
        }
    }
}
