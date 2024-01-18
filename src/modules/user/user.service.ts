/**
 * - create (registration)
 * - read: 1 (get All)
 * - read: 2 (get by)
 * - read: 3 (login)
 * - update (Actualizacion)
 * - delete (Soft delete - patch)
 */

import { Injectable } from "@nestjs/common";
import { User } from "src/utils/database/src/entities/user";
import { UserRepository } from "src/utils/database/src/repositories/user.repository";
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {

    }

    async create(user: User) {
        user.apiKey = uuidv4();
        try {
            const createdUser = await this.userRepository.createOrUpdateUser(user)
            return createdUser.id;
        } catch (error) {
            throw error
        }
    }

    async list() {
        try {
            return this.userRepository.find();
        } catch (error) {
            throw error
        }
    }

    async getApiKey(id: number) {
        try {
            return this.userRepository.findOneOrFail({
                where: { id }
            })
        } catch (error) {
            
        }
    }
}