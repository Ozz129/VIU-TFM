import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WebhookController } from "./webhook.controller";
import { UserRepository } from "src/utils/database/src/repositories/user.repository";
import { WebhookService } from "./webhook.service";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";
import { SQSService } from "src/utils/aws/src/services/sqs-client.service";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [WebhookController],
    providers: [
        UserRepository,
        WebhookService, 
        DynamoDBclientService,
        SQSService
    ],
})

export class WebhookModule {}