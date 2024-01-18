import { Body, Controller, Post, Query, Get } from "@nestjs/common";
import { NotificationService } from "./notification.service";

@Controller()
export class NotificationController {

    constructor(
        private readonly notificationService: NotificationService
    ){}
    

    @Post('telegram')
    async createIrrigation(
        @Body() body: any
    ): Promise<any> {
        console.log(body)
        return this.notificationService.sendTelegram()
    }
}


