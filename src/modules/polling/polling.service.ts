// src/polling/polling.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SQSService } from 'src/utils/aws/src/services/sqs-client.service';
import thirdPartyFunctions from 'src/utils/functions/thirdParty.functions';
import { PRECIPITATION } from './polling.constants';
import telegramFunctions from 'src/utils/functions/telegram.functions';
import { DynamoDBclientService } from 'src/utils/aws/src/services/dynammo-client.service';
import { CropService } from '../crop/crop.service';
import * as moment from 'moment';

@Injectable()
export class PollingService implements OnModuleInit {
    constructor(
        private readonly sqsService: SQSService,
        private readonly dynamoService: DynamoDBclientService,
        private readonly cropService: CropService
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

                let count = 1;
              for (const irrigation of sqsMessage.data) {

                console.log('CONTEO:::::', count)
                console.log('----- IRRIGATION::::', irrigation.cropId)
                const conditions = await this.check(irrigation.cropId ,precipitation)
                console.log('--->', conditions)
                if (irrigation.executed === 'scheduled' && conditions.length >= 1) {
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
                    const messageText = `Se encontraron las siguientes condiciones ${conditions.map((item: any) => item.message).join(', ')}, ¿desea detener el riego programado para las ${irrigation.executionHour}? responda:`;
                    console.log('MENSAGEEEEEEE', messageText)
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
                count++;
            }
            
            //}
         // }
    }

    private async check (cropId: any, mm: number): Promise<any> {
        let restrictions = [];

        console.log('CROP IDDDDDDDDD::::::::', cropId)
        const params = {
            table: 'sensorMeasures',
            expression: 'SGI = :exp',
            attributes: {
                ':exp': { S: `CROP#${cropId}` }
            }
        } 

        //const response = await this.dynamoService.getByQuery(params)
        const response = {
            Items: [
                {
                  PK: { S: '8' },
                  SGI: { S: 'CROP#1' },
                  "data": {
                    "M": {
                      "event": {
                        "M": {
                          "humidity": {
                            "S": "443"
                          },
                          "temperature": {
                            "S": "33.09"
                          }
                        }
                      },
                      "timestamp": {
                        "S": "1707591534"
                      }
                    }
                  },
                                  lifetime: { N: '1707591564' }
                },
                {
                  PK: { S: '7' },
                  SGI: { S: 'CROP#1' },
                  "data": {
                    "M": {
                      "event": {
                        "M": {
                          "humidity": {
                            "S": "471"
                          },
                          "temperature": {
                            "S": "33.09"
                          }
                        }
                      },
                      "timestamp": {
                        "S": "1707591474"
                      }
                    }
                  },
                                  lifetime: { N: '1707591504' }
                }
            ]
        }

        response.Items.sort((a: any, b: any) => b.data.M.timestamp.S - a.data.M.timestamp.S);
        const mostRecentMeasure = response.Items[0].data.M.event.M;
        const sensorHumidity = mostRecentMeasure.humidity.S;
        const sensorTemperature = mostRecentMeasure.temperature.S;
        const crop = await this.cropService.getById(cropId)

        if (Number(sensorHumidity) > crop.saturationPoint) {
            restrictions.push(
                {
                    message: `Humedad: ${sensorHumidity}`
                }
            )
        }
        
        if (Number(sensorTemperature) > crop.tempIrrigationControl) {
            restrictions.push(
                {
                    message: `Temperatura: ${sensorTemperature}`
                }
            )
        }

        for (let range in PRECIPITATION) {
            if (mm >= PRECIPITATION[range].min && mm <= PRECIPITATION[range].max) {
                if(!PRECIPITATION[range].condition) {
                    restrictions.push(
                        {
                            message: PRECIPITATION[range].descripcion
                        }
                    )
                }
            }
        }

        return restrictions;
    }
}

       
            

     

  






