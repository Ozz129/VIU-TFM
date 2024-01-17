import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "../entities/user";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(dataSource: DataSource) {
        super(User, dataSource.createEntityManager())
    }

    async createOrUpdateUser(user: User) {
        return this.save(user)
    }

    async getById(id: number): Promise<User> {
        return this.findOneOrFail({
            where: { id }
        })
    }

}