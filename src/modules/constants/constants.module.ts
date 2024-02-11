import { Module } from "@nestjs/common";
import { ConstantsController } from "./constants.controller";
import { ConstantsService } from "./constanst.service";
import { ConfigModule } from "@nestjs/config";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtStrategy } from "../auth/jwt.strategy";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [ConstantsController],
    providers: [
        ConstantsService,         
        DynamoDBclientService,
        JwtAuthGuard,
        JwtStrategy
    ],
})

export class ConstantsModule {}