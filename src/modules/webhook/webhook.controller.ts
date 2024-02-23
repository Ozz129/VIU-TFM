import { Controller, Post, Body, Get } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import telegramFunctions from 'src/utils/functions/telegram.functions';
import { DynamoDBclientService } from 'src/utils/aws/src/services/dynammo-client.service';
import { SQSService } from 'src/utils/aws/src/services/sqs-client.service';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Controller('webhook')
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService,
        private readonly dynamoClient: DynamoDBclientService,
        private readonly sqsService: SQSService,

    ) {}

    //webhook: Controla toda la comunicacion a traves de telegram con el usuario
    @Post('telegram')
    async handleUpdate(@Body() body: any): Promise<void> {
        console.log('----->', body)
        const telegramId = body.message ? body.message.chat.id : body.callback_query.from.id
        console.log('IDDDDDDD', telegramId)
        let msg = body.message ? body.message.text : body.callback_query.data;

        let apiKey = '';
        if (msg.includes('/apiKey')) {
            const text = msg.split(' ');
            msg = text[0];
            apiKey = text[1];
        }
        console.log('MSG:::', msg)
        switch (msg) {
            case '/apiKey':
                try {
                    await this.webhookService.setTelegramId(apiKey, telegramId)
                    telegramFunctions.sendTelegramMessage(telegramId, 'Configurado con exito');
                } catch (error) {
                    console.log('Error: ', error)
                    telegramFunctions.sendTelegramMessage(telegramId, 'Ocurrio un error');
                }
            break;
            case '/no':
                console.log('EL CLIENTE DECIDE CONTINUAR CON EL RIEGO', body.callback_query.message.message_id)
                try {
                    const result: any = await this.checkMessage(body.callback_query.message.message_id);
                    const params = {
                        table: 'irrigationEvents',
                        PK: uuidv4(),
                        content: {
                            event: { M: 
                                { 
                                    cropId: { S: result.data.event.cropId.toString() },
                                    executionHour: { S: result.data.event.executionHour },
                                }
                            }
                        }
                    }
                    this.dynamoClient.setTemporalItem(params, result.data.event.executionHour)
                    telegramFunctions.sendTelegramMessage(telegramId, 'Se ejecutará el riego a la hora programada');
                } catch (error) {
                    console.log('Error: ', error)
                    telegramFunctions.sendTelegramMessage(telegramId, 'Ocurrio un error');
                }
                break;
            case '/si':
                console.log('EL CLIENTE DETUVOE EL RIEGO')
                try {
                    telegramFunctions.sendTelegramMessage(telegramId, 'Se ha detenido el riego a la hora mmmmmprogramada');
                } catch (error) {
                    console.log('Error: ', error)
                    telegramFunctions.sendTelegramMessage(telegramId, 'Ocurrio un error');
                }
            break;
        
            default:
                telegramFunctions.sendTelegramMessage(telegramId, 'Lo siento, no entiendo tu mensaje');
                break;
        }
     
    }

    @Get('arduino')
    async hanldeIrrigation() {
        console.log('EL MICROCONTROLADOR ESTA CONSULTANDO LOS RIEGOS NECESARIOS')
        return this.webhookService.getIrrigationEvents()
    }

    @Post('sensor')
    async getSensorMeasure(
        @Body() body: any
    ) {
        return this.webhookService.saveSensorMeasures(body)
    }

    async checkMessage(id: number) {
        const getItemParams = {
            TableName: 'irrigationConfirmation',
            Key: {
                PK: ''+id
            }
        } as unknown as any;

        return await this.dynamoClient.getItem(getItemParams)
    }
}
