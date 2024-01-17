import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { UserRepository } from "src/utils/database/src/repositories/user.repository";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [UserController],
    providers: [
        UserService,         
        UserRepository
    ],
})

export class UserModule {}