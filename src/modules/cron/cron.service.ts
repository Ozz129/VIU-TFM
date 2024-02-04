import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IrrigationRepository } from 'src/utils/database/src/repositories/irrigation.repository';
import * as moment from 'moment';
import { Irrigation } from 'src/utils/database/src/entities/irrigation';
import { SQSService } from 'src/utils/aws/src/services/sqs-client.service';
import { User } from 'src/utils/database/src/entities/user';
import { DynamoDBclientService } from 'src/utils/aws/src/services/dynammo-client.service';

@Injectable()
export class cronService {
    constructor(
        private readonly irrigationRepository: IrrigationRepository,
        private readonly sqsService: SQSService,
        private readonly dynamoClientService: DynamoDBclientService
    ) {}
    // Primer cron: Encola todas las acciones programadas se ejecuta una hora antes de que la programacion del riego se cumpla
  @Cron(CronExpression.EVERY_5_SECONDS)
    async handleCron() {
        const now = moment().format('HH');
        const scheduledIrrigations = await this.irrigationRepository.getIrrigationByHour(`${now}:00:00`) as any;
        
        const transformedIrrigations: IrrigationWithStatus[] = scheduledIrrigations.map((irrigation: IrrigationWithStatus) => {
            return {
            ...irrigation, 
            executed: 'scheduled'
            };
        });

        console.log('TRANSFORMED::::', transformedIrrigations)
        if (transformedIrrigations.length > 0) {
            /*await this.sqsService.sendToQueue({
                date: moment().utc(),
                data: transformedIrrigations,
                type: 'irrigation'
            })*/
        }

    }

    //Segundo cron: se encarga de ejecutar todas las acciones de riego ya confirmadas
    /**
     * Se ejecuta 5 minutos antes y ejecuta las acciones de riego programadas
     */
    @Cron('56 * * * *')
    async executeIrrigation(){
        console.log('CRON A LAS 54')
      
        //const executionHour = moment().format('HH');
        const executionHour = 19;
        const params = {
            table: 'irrigationEvents',
            expression: 'SGI = :executionHour',
            attributes: {
                ':executionHour': { S: `${(executionHour + 1).toString()}:00:00` }
            }
        }

        const response = await this.dynamoClientService.getByQuery(params)
        if(response.Items.length > 0) {
            console.log('Ejecutar riego')
        }
    }
}

interface IrrigationWithStatus extends Irrigation {
    executed: string;
}
  