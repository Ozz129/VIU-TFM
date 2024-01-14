import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/utils/database/src/database.module";
import { UserModule } from "../user/user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/utils/database/src/entities/user";
import { Crop } from "src/utils/database/src/entities/crop";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        UserModule,
        TypeOrmModule.forFeature([User, Crop])
    ],

})

export class MainModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply().forRoutes('*')
    }
    
}
