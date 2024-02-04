// alert.service.ts
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class SQSService {
    private sqs: AWS.SQS;

    constructor() {
        AWS.config.update({   
            accessKeyId: "AKIAVRUVRCUBWN3HXRNS",
            secretAccessKey: "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",
            region: 'us-east-2' 
        });
        this.sqs = new AWS.SQS({ apiVersion: 'v1' });
    }

    async sendToQueue(message: any) {
        const params = {
            MessageBody: JSON.stringify(message),
            QueueUrl: 'https://sqs.us-east-2.amazonaws.com/381491942659/iotAlertsHandler.fifo',
            MessageGroupId: 'irrigations'  
        };

        try {
            const data = await this.sqs.sendMessage(params).promise();
            console.log('Mensaje enviado, ID:', data.MessageId);
        } catch (err) {
            console.error('Error al enviar mensaje:', err);
        }
    }

    async readSQS() {
        const params = {
            QueueUrl: 'https://sqs.us-east-2.amazonaws.com/381491942659/iotAlertsHandler.fifo',
        }

        try {
            return await this.sqs.receiveMessage(params).promise();
        } catch (error) {
            console.log('ERROR READING SQS: ', error)
        }
    }

    async deleteMessage(receiptHandle: string) {
        const deleteParams = {
            QueueUrl: 'https://sqs.us-east-2.amazonaws.com/381491942659/iotAlertsHandler.fifo',
          ReceiptHandle: receiptHandle,
        };
    
        try {
          await this.sqs.deleteMessage(deleteParams).promise();
          console.log('Mensaje eliminado');
        } catch (err) {
          console.error('Error al eliminar mensaje:', err);
        }
      }
}
