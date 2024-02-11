import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/utils/database/src/database.module";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/utils/database/src/entities/user";
import { Crop } from "src/utils/database/src/entities/crop";
import { UserRepository } from "src/utils/database/src/repositories/user.repository";
import { CropModule } from "../crop/crop.module";
import { DynamoDBclientService } from "src/utils/aws/src/services/dynammo-client.service";
import { ConstantsModule } from "../constants/constants.module";
import { IrrigationModule } from "../irrigation/irrigation.module";
import { NotificatioinModule } from "../notifications/notification.module";
import { WebhookModule } from "../webhook/webhook.module";
import { ScheduleModule } from "@nestjs/schedule";
import { Irrigation } from "src/utils/database/src/entities/irrigation";
import { CronModule } from "../cron/cron.module";
import { PollingModule } from "../polling/polling.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        UserModule,
        CropModule,
        ConstantsModule,
        IrrigationModule,
        NotificatioinModule,
        WebhookModule,
        CronModule,
        PollingModule,
        TypeOrmModule.forFeature([User, Crop, Irrigation]),
        ScheduleModule.forRoot(),
        AuthModule
    ],
    providers: [
        UserRepository,
        DynamoDBclientService,
        //RedisClientService
    ]
})

export class MainModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply().forRoutes('*')
    }
    
}
