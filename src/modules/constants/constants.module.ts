import { Module } from "@nestjs/common";
import { ConstantsController } from "./constants.controller";
import { ConstantsService } from "./constanst.service";
import { ConfigModule } from "@nestjs/config";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ConstantsController],
    providers: [
        ConstantsService,         
        DynamoDBclientService
    ],
})

export class ConstantsModule {}