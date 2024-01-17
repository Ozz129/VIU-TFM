import { Module } from "@nestjs/common";
import { CropController } from "./crop.controller";
import { CropService } from "./crop.service";
import { ConfigModule } from "@nestjs/config";
import { CropRepository } from "src/utils/database/src/repositories/crop.repository";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [CropController],
    providers: [
        CropService,         
        CropRepository,
        DynamoDBclientService
    ],
})

export class CropModule {}