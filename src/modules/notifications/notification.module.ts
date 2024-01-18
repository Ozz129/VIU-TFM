import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { ConfigModule } from "@nestjs/config";
import { IrrigationRepository } from "src/utils/database/src/repositories/irrigation.repository";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [NotificationController],
    providers: [
        NotificationService,    
        IrrigationRepository     
    ],
})

export class NotificatioinModule {}