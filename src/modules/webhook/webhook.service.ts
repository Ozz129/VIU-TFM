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
import * as moment from 'moment';
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";

@Injectable()
export class WebhookService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly dynamoClientService: DynamoDBclientService
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

    async getIrrigationEvents() {
        const executionHour = moment().format('HH');
        const params = {
            table: 'irrigationEvents',
            expression: 'SGI = :executionHour',
            attributes: {
                ':executionHour': { S: `${(19 + 1).toString()}:00:00` }
            }
        }

        const response = await this.dynamoClientService.getByQuery(params)
        
        if (response.Count > 0) {
            return true
        } else {
            return false
        }

    }

    async saveSensorMeasures(body: any) {
        const timestampInSeconds = moment().unix();

        try {
            const params = {
                table: 'sensorMeasures',
                PK: 8,
                content: {
                    timestamp: { S: timestampInSeconds.toString()},
                    event: { M: 
                        { 
                            temperature: { S: body.temperature.toString() },
                            humidity: { S: body.humedad.toString() },
                        }
                    }
                }
            }
        //const measureStored = await this.dynamoClientService.setTemporalItem(params, `CROP#${body.cropId}`);
       } catch (error) {
        console.log('ERROR SAVING SENSORS:::', error)
       }
    }
}