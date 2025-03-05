import { hashPassword } from '../../helper/passwordHash';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRepository } from '../../repository/authRepository';
import { UserData, SafeUser } from '../../types/user';
import bcrypt from 'bcryptjs';

dotenv.config();
const secretKey = process.env.JWT_SECRET_TOKEN || '';

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
        console.log('AuthService: Initialized');
    }

    async createUser(userData: UserData): Promise<void> {
        console.log('AuthService: Creating user with email:', userData.email);
        
        // Wrap everything in a try/catch to prevent crashes
        try {
            // Validate user data
            if (!userData.email || !userData.password || !userData.fname) {
                console.error('AuthService: Missing required user data fields');
                throw new Error('Missing required user data fields');
            }
            
            console.log('AuthService: Hashing password.....');
            let hashedPassword;
            // try {
                hashedPassword = await hashPassword(userData.password);
                console.log('AuthService: Password hashed successfully');
            // } catch (hashError) {
            //     console.error('AuthService: Error hashing password:', hashError);
            //     throw new Error(`Password hashing failed: ${hashError instanceof Error ? hashError.message : 'Unknown error'}`);
            // }
            
            console.log('AuthService: Calling repository to create user...');
            try {
                await this.authRepository.createUser(userData, hashedPassword);
                console.log('AuthService: User created successfully in repository');
            } catch (repoError) {
                console.error('AuthService: Error from repository when creating user:', repoError);
                throw new Error(`Repository error: ${repoError instanceof Error ? repoError.message : 'Unknown error'}`);
            }
        } catch (error) {
            console.error('AuthService: Error creating user:', error);
            // Rethrow but don't crash
            throw new Error(`User creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async authenticateUser(email: string, password: string): Promise<{ token: string, user: SafeUser }> {
        try {
            console.log('AuthService: Authenticating user with email:', email);
            const result = await this.authRepository.findUserByEmail(email);
            
            // Handle different possible return structures
            let user;
            if (Array.isArray(result) && result.length > 0) {
                if (Array.isArray(result[0]) && result[0].length > 0) {
                    // Handle [[user]] structure
                    user = result[0][0];
                } else {
                    // Handle [user] structure
                    user = result[0];
                }
            }

            if (!user) {
                console.error('AuthService: User not found');
                throw new Error("User not found");
            }

            console.log('AuthService: Comparing password...');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.error('AuthService: Invalid password');
                throw new Error("Invalid password");
            }

            const safeUser: SafeUser = {
                id: user.id,
                email: user.email,
                fname: user.fname
            };

            console.log('AuthService: Generating token...');
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                secretKey,
                { expiresIn: '24h' }
            );

            console.log('AuthService: Authentication successful');
            return { token, user: safeUser };
        } catch (error) {
            console.error('AuthService: Error authenticating user:', error);
            throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
