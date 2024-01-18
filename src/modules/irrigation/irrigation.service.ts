/**
 * - create (registration)
 * - read: 1 (get All)
 * - read: 2 (get by)
 * - read: 3 (login)
 * - update (Actualizacion)
 * - delete (Soft delete - patch)
 */

import { Injectable } from "@nestjs/common";
import { Irrigation } from "src/utils/database/src/entities/irrigation";
import { IrrigationRepository } from "src/utils/database/src/repositories/irrigation.repository";

@Injectable()
export class IrrigationService {
    constructor(
        private readonly irrigationRepository: IrrigationRepository
        ) {}

    async create(irrigation: Irrigation) { 
        console.log('SERVICE: ', irrigation)
        try {
            const createdIrrigation = await this.irrigationRepository.createIrrigation(irrigation)
            return createdIrrigation.id;
        } catch (error) {
            console.log
            throw error
        }
    }
}