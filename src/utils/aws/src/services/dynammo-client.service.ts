import { Inject, Injectable } from "@nestjs/common";
import { DynamoDBClient, GetItemInput, UpdateItemInput } from "@aws-sdk/client-dynamodb";
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
}