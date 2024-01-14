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

@Injectable()
export class UserService {
    constructor() {

    }

    async create(user: User) {
        return {
            success: true
        }
    }
}