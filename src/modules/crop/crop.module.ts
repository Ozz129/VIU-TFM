import { Module } from "@nestjs/common";
import { CropController } from "./crop.controller";
import { CropService } from "./crop.service";
import { ConfigModule } from "@nestjs/config";
import { CropRepository } from "src/utils/database/src/repositories/crop.repository";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import { JwtAuthGuard } from "../auth/jwt.guard";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [CropController],
    providers: [
        CropService,         
        CropRepository,
        DynamoDBclientService,
        JwtAuthGuard,
        JwtStrategy
    ],
})

export class CropModule {}