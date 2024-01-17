import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Crop } from "../entities/crop";

@Injectable()
export class CropRepository extends Repository<Crop> {
    constructor(dataSource: DataSource) {
        super(Crop, dataSource.createEntityManager())
    }

    async createOrUpdateUser(crop: Crop) {
        return this.save(crop)
    }

    async getById(id: number): Promise<Crop> {
        return this.findOneOrFail({
            where: { id }
        })
    }
}