import { Module } from "@nestjs/common";
import { cronService } from "./cron.service";
import { ConfigModule } from "@nestjs/config";
import { IrrigationRepository } from "src/utils/database/src/repositories/irrigation.repository";
import { SQSService } from "src/utils/aws/src/services/sqs-client.service";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [],
    providers: [
        cronService,
        IrrigationRepository,
        SQSService,
        DynamoDBclientService
    ],
})

export class CronModule {}