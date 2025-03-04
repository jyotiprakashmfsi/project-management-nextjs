import { UserRepository } from "../../repository/userRepository";
import { UserUpdateData } from "../../types/user";
import { getLocalTimeString } from "../../helper/date";
import { sequelize } from "@/db/models";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }

    async getUserById(userId: string) {
        return await this.userRepository.getUserById(userId);
    }

    async updateUser(userId: string, updateData: UserUpdateData) {
        const currentTime = getLocalTimeString(new Date());
        
        if (updateData.dob) {
            updateData.dob = getLocalTimeString(new Date(updateData.dob));
        }

        const result = await this.userRepository.updateUser(userId, updateData);
        
        return { id: userId, ...updateData };
    }

    async deleteUser(userId: string) {
        const result = await sequelize.query(
            'DELETE FROM Users WHERE id = ?',
            {
                replacements: [userId],
            }
        );
        return result;
    }
}
