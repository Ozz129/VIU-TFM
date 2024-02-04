import { Inject, Injectable } from "@nestjs/common";
import { DynamoDBClient, GetItemInput, PutItemCommand, PutItemCommandInput, QueryCommand, UpdateItemInput } from "@aws-sdk/client-dynamodb";
import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class DynamoDBclientService {
    public dynamoDBClient: DynamoDBClient;

    constructor() {
        this.dynamoDBClient = new DynamoDBClient({
            credentials: {
                accessKeyId: "AKIAVRUVRCUBWN3HXRNS",
                secretAccessKey: "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"
            }, 
            region: "us-east-2"
        })
    }

    async getItem<T>(data: GetItemInput): Promise<T> {
        const params = data;

        try {
            const data = await this.dynamoDBClient.send(
                new GetCommand(params)
            )

            return data.Item as T;
        } catch (error) {
            throw error;
        }
    }

    async updateItem(data: UpdateItemInput) {
        const params = data;

        try {
            await this.dynamoDBClient.send(
                new UpdateCommand(params)
            )
        } catch (error) {
            throw error;
        }
    }

    async setTemporalItem(data: any, sgi: string = '') {
        const ttlDuration = 24 * 60 * 60; // 24 horas en segundos
        const expirationTime = Math.floor(Date.now() / 1000) + 30; // Timestamp actual + 24 horas

        let Item: any = {
            PK: { S: data.PK.toString()},
            data: {
                M: data.content
            },
            lifetime: { N: expirationTime.toString()}
        }

        if(sgi !== '') {
            Item.SGI = { S: sgi }
        }

        const params: PutItemCommandInput = {
            TableName: data.table,
            Item 
        }       

        try {   
            this.dynamoDBClient.send(
                new PutItemCommand(params)
            )
        } catch (error) {
            console.log('ERROR TEMPORAL SAVING: ', error)
        }
    }

    async getByQuery(params: any) {
        const command = new QueryCommand({
            TableName: params.table,
            IndexName: 'SGI-index',
            KeyConditionExpression: params.expression,
            ExpressionAttributeValues: params.attributes
        })
        console.log('------> COMMMAND::::', command)

        try {
            return await this.dynamoDBClient.send(command);
        } catch (error) {
            console.log('ERROR getByQuery: ', error)
        }

    }
}