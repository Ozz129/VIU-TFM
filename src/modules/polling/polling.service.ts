// src/polling/polling.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { SQSService } from 'src/utils/aws/src/services/sqs-client.service';
import thirdPartyFunctions from 'src/utils/functions/thirdParty.functions';
import { PRECIPITATION } from './polling.constants';
import telegramFunctions from 'src/utils/functions/telegram.functions';
import { DynamoDBclientService } from 'src/utils/aws/src/services/dynammo-client.service';
import { CropService } from '../crop/crop.service';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PollingService implements OnModuleInit {
    constructor(
        private readonly sqsService: SQSService,
        private readonly dynamoService: DynamoDBclientService,
        private readonly cropService: CropService
    ) {}
    private readonly pollingInterval = 5000; // Intervalo de polling en milisegundos (ej. cada 10 segundos)

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
        //console.log('CLIMA::::', whether)
        //const precipitation = whether.current.precip_mm;   
        const precipitation = 0.2;     
            //Leemos SQS
        const data = await this.sqsService.readSQS();
        console.log('DATA:::', data)
        if (data.Messages) {
            for (const message of data.Messages) {
              // Procesa el mensaje aquí
              console.log('Mensaje recibido:', typeof message.Body);
              const sqsMessage: any = JSON.parse(message.Body);
              console.log('Mensaje recibido:', sqsMessage);

              // Elimina el mensaje de la cola después de procesarlo
              await this.sqsService.deleteMessage(message.ReceiptHandle);        
                // Leemos cada accion de riego programada

              for (const irrigation of sqsMessage.data) {
                console.log('IRRIGATION:::::', irrigation)
                const conditions = await this.check(irrigation.cropId ,precipitation)
                if (irrigation.executed === 'scheduled' && conditions.length >= 1) {
                    console.log('SE ENCOLO UNA ALERTA DE TELEGRAM:::::::')

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
                    console.log('TELEGRAM:::', irrigation.crop.user.telegramId)
                    const messageText = `Se encontraron las siguientes condiciones ${conditions.map((item: any) => item.message).join(', ')}, ¿desea detener el riego programado para las ${irrigation.executionHour}? responda:`;
                    const id = await telegramFunctions.sendTelegramMessage(irrigation.crop.user.telegramId, messageText, messageOptions);
                    const params = {
                        table: 'irrigationConfirmation',
                        PK: id,
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
                    console.log('SE ENCOLO UN RIEGO:::::::')
                    const params = {
                        table: 'irrigationEvents',
                        PK: uuidv4(),
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
            
            }
        }
    }

    private async check (cropId: any, mm: number): Promise<any> {
        console.log('--CLIMAAAAAAA-->', mm)
        let restrictions = [];

        const params = {
            table: 'sensorMeasures',
            expression: 'SGI = :exp',
            attributes: {
                ':exp': { S: `CROP#${cropId}` }
            }
        } 

        const response = await this.dynamoService.getByQuery(params)
     
        response.Items.sort((a: any, b: any) => b.data?.M?.timestamp?.S - a.data?.M?.timestamp?.S);
        const mostRecentMeasure = response.Items[0]?.data?.M?.event?.M;
        const sensorHumidity = mostRecentMeasure?.humidity?.S;
        const sensorTemperature = mostRecentMeasure?.temperature?.S;
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

       
            

     

  






