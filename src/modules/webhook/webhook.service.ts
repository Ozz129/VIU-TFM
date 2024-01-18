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
import telegramFunctions from 'src/utils/functions/telegram.functions';

@Injectable()
export class WebhookService {
    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async setTelegramId(apiKey: string, telegramId: string) {
        try {
            const user: User = await this.userRepository.findOneByOrFail({
                apiKey
            })
            
            user.telegramId = telegramId;
            this.userRepository.save(user)
        } catch (error) {
            console.log('Error configurando telegramId', error)
            throw error
        }
    }
}