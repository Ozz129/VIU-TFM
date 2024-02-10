/**
 * - create (registration)
 * - read: 1 (get All)
 * - read: 2 (get by)
 * - read: 3 (login)
 * - update (Actualizacion)
 * - delete (Soft delete - patch)
 */

import { Injectable } from "@nestjs/common";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";
import { Crop } from "src/utils/database/src/entities/crop";
import { CropRepository } from "src/utils/database/src/repositories/crop.repository";

@Injectable()
export class CropService {
    constructor(
        private readonly cropRepository: CropRepository,
        private readonly dynamoClientService: DynamoDBclientService
        ) {}

    async create(crop: Crop) {
        try {
            const createdUser = await this.cropRepository.createOrUpdateUser(crop)
            return createdUser.id;
        } catch (error) {
            throw error
        }
    }

    async list() {
        try {
            return this.cropRepository.find();
        } catch (error) {
            throw error
        }
    }

    async listCropTypes() {

        try {
            const getItemParams = {
                TableName: 'constants',
                Key: {
                    constantType: 'soil'
                }
            } as unknown as any;
    
            const response = await this.dynamoClientService.getItem(getItemParams)
    
            return response;
        } catch (error) {
            console.log('ERROR:::::::', error)
        }
    }

    async getById(id: any) {
        console.log('IDDDDD', id)
        try {
            return await this.cropRepository.getById(id)
        } catch (error) {
            throw error
        }
    }
}