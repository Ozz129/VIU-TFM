import { Module } from "@nestjs/common";
import { IrrigationController } from "./irrigation.controller";
import { IrrigationService } from "./irrigation.service";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/utils/database/src/database.module";
import { IrrigationRepository } from "src/utils/database/src/repositories/irrigation.repository";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [IrrigationController],
    providers: [
        IrrigationService,    
        IrrigationRepository     
    ],
})

export class IrrigationModule {}