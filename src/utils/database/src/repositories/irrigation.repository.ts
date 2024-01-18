import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Irrigation } from "../entities/irrigation";

@Injectable()
export class IrrigationRepository extends Repository<Irrigation> {
    constructor(dataSource: DataSource) {
        super(Irrigation, dataSource.createEntityManager())
    }

    async createIrrigation(irrigation: Irrigation) {
        return this.save(irrigation)
    }
}