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

@Injectable()
export class ConstantsService {
    constructor(
        private readonly dynamoClientService: DynamoDBclientService
        ) {}


    async listConstants(filter: string) {

        try {
            const getItemParams = {
                TableName: 'constants',
                Key: {
                    constantType: filter
                }
            } as unknown as any;
    
            const response = await this.dynamoClientService.getItem(getItemParams)
    
            return response;
        } catch (error) {
            console.log('ERROR:::::::', error)
        }

    }
}