import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";
import { UserRepository } from "src/utils/database/src/repositories/user.repository";
import { JwtAuthGuard } from "../auth/jwt.guard";
import { JwtStrategy } from "../auth/jwt.strategy";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [UserController],
    providers: [
        UserService,         
        UserRepository,
        JwtAuthGuard,
        JwtStrategy
    ],
})

export class UserModule {}