import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WebhookController } from "./webhook.controller";
import { UserRepository } from "src/utils/database/src/repositories/user.repository";
import { WebhookService } from "./webhook.service";

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [WebhookController],
    providers: [
        UserRepository,
        WebhookService
    ],
})

export class WebhookModule {}