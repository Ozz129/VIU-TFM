// src/polling/polling.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SQSService } from 'src/utils/aws/src/services/sqs-client.service';
import thirdPartyFunctions from 'src/utils/functions/thirdParty.functions';
import { PRECIPITATION } from './polling.constants';
import telegramFunctions from 'src/utils/functions/telegram.functions';
import { DynamoDBclientService } from 'src/utils/aws/src/services/dynammo-client.service';

@Injectable()
export class PollingService implements OnModuleInit {
    constructor(
        private readonly sqsService: SQSService,
        private readonly dynamoService: DynamoDBclientService,
    ) {}
    private readonly pollingInterval = 10000; // Intervalo de polling en milisegundos (ej. cada 10 segundos)

    onModuleInit() {
        setInterval(() => {
            this.poll();
        }, this.pollingInterval);
    }

    // Polling: consulta la sqs y se encarga de llevar a la bd todas las acciones ya confirmadas
    private async poll() {
        console.log('Polling ejecutado');

            //Leemos el clima
        //const whether = await thirdPartyFunctions.checkWeatherApi();
        const precipitation = 2.5//whether.current.precip_mm;        
        const sqsMessage = {"date":"2024-01-19T01:19:45.004Z","data":[{"id":2,"cropId":1,"executionHour":"20:00:00","status":true,"crop":{"id":1,"userId":4,"cropTypeId":"","soilTypeId":"","cicle":"","saturationPoint":1,"tempIrrigationControl":1,"createdAt":"2024-01-17T21:32:53.000Z","updatedAt":"2024-01-19T01:17:09.000Z","deletedAt":null,"user":{"id":4,"fullName":"Felix Huels","rol":"manager","username":"Kristina1","password":"cYsZtOFL1UqIJNq","telegramId":"6730496316","apiKey":"d0269258-8f75-4e0f-99e0-4bf18d11561b","createdAt":"2024-01-18T00:58:11.000Z","updatedAt":"2024-01-18T01:52:16.000Z","deletedAt":null}},"executed":"scheduled"},{"id":3,"cropId":1,"executionHour":"20:00:00","status":true,"crop":{"id":1,"userId":4,"cropTypeId":"","soilTypeId":"","cicle":"","saturationPoint":1,"tempIrrigationControl":1,"createdAt":"2024-01-17T21:32:53.000Z","updatedAt":"2024-01-19T01:17:09.000Z","deletedAt":null,"user":{"id":4,"fullName":"Felix Huels","rol":"manager","username":"Kristina1","password":"cYsZtOFL1UqIJNq","telegramId":"6730496316","apiKey":"d0269258-8f75-4e0f-99e0-4bf18d11561b","createdAt":"2024-01-18T00:58:11.000Z","updatedAt":"2024-01-18T01:52:16.000Z","deletedAt":null}},"executed":"pending"}]}
            //Leemos SQS
        //const data = await this.sqsService.readSQS();
        //if (data.Messages) {
            //for (const message of data.Messages) {
              // Procesa el mensaje aquí
              //console.log('Mensaje recibido:', message.Body);
              // Elimina el mensaje de la cola después de procesarlo
              //await this.sqsService.deleteMessage(message.ReceiptHandle);

        
                // Leemos cada accion de riego programada
              for (const irrigation of sqsMessage.data) {
                if (irrigation.executed === 'scheduled' && !irrigationToggle(precipitation)) {
                    // Si se cuenta con condiciones que permitan omitir el riego programado
                    /**
                     * Opciones posibles:
                     *  1. Valores de los sensores
                     *  2. Valores del api del clima
                     */
                    const messageOptions = {
                        reply_markup: JSON.stringify({
                            inline_keyboard: [
                                [{ text: 'Sí', callback_data: '/si' }],
                                [{ text: 'No', callback_data: '/no' }]
                            ]
                        })
                    };
                    const messageText = `Se ha detectado posible lluvia, ¿desea detener el riego programado para las 5? responda:`;

                    //const id = await telegramFunctions.sendTelegramMessage(irrigation.crop.user.telegramId, messageText, messageOptions);
                    const params = {
                        table: 'irrigationConfirmation',
                        PK: 6,
                        content: {
                            status: {S: 'waiting'},
                            response: {S: 'x'},
                            event: { M: 
                                { 
                                    cropId: { S: irrigation.cropId.toString() },
                                    executionHour: { S: irrigation.executionHour },
                                    telegramId: { S: irrigation.crop.user.telegramId}
                                }
                            }
                        }
                    }
                    try {
                        await this.dynamoService.setTemporalItem(params)
                    } catch (error) {
                        console.log('** error dynamo **', error)
                    }
                } else {
                    // Si las condiciones son adecuadas para permitir el riego
                    const params = {
                        table: 'irrigationEvents',
                        PK: 7,
                        content: {
                            event: { M: 
                                { 
                                    cropId: { S: irrigation.cropId.toString() },
                                    executionHour: { S: irrigation.executionHour },
                                }
                            }
                        }
                    }
                    try {
                        await this.dynamoService.setTemporalItem(params, irrigation.executionHour)
                    } catch (error) {
                        console.log('** error dynamo **', error)
                    }
                }
              }
            
            //}
         // }
    }
}

function checkPrecipitation(mm: number): any {
    // TODO: añadir confirmacion de sensores
    for (let range in PRECIPITATION) {
        if (mm >= PRECIPITATION[range].min && mm <= PRECIPITATION[range].max) {
            return {
                msg: PRECIPITATION[range].descripcion,
                condition: PRECIPITATION[range].condition
            }
        }
    }
    return "No disponible";
}

function checkSensorMeasure(): any {
    return true;
}

function irrigationToggle(precipitationMeasure: number) {
    const precipitationCondition = checkPrecipitation(precipitationMeasure);
    const sensorMeasure = checkSensorMeasure();

    console.log('CONDICIONES: PRECP=', precipitationCondition.condition, ' SENSOR=', sensorMeasure)
    if (precipitationCondition.condition && sensorMeasure) {
        return true;
    } else {
        return false;
    }

}