import { Module } from "@nestjs/common";
import { PollingService } from "./polling.service";
import { ConfigModule } from "@nestjs/config";
import { CropRepository } from "src/utils/database/src/repositories/crop.repository";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";
import { IrrigationRepository } from "src/utils/database/src/repositories/irrigation.repository";
import { SQSService } from "src/utils/aws/src/services/sqs-client.service";
import { CacheModule } from "@nestjs/cache-manager";


@Module({
    imports: [
        ConfigModule.forRoot(),
        CacheModule.register()
    ],
    controllers: [],
    providers: [
        PollingService,
        SQSService,
        DynamoDBclientService,
    ],
})

export class PollingModule {}