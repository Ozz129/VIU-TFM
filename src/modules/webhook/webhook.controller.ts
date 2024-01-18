import { Controller, Post, Body } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import telegramFunctions from 'src/utils/functions/telegram.functions';

@Controller('webhook')
export class WebhookController {
    constructor(
        private readonly webhookService: WebhookService
    ) {}

    @Post('telegram')
    async handleUpdate(@Body() body: any): Promise<void> {
        const telegramId = body.message.chat.id
        const apiKey = body.message.text
        try {
            await this.webhookService.setTelegramId(apiKey, telegramId)
            telegramFunctions.sendTelegramMessage(telegramId, 'Configurado con exito');
        } catch (error) {
            console.log('Error: ', error)
            telegramFunctions.sendTelegramMessage(telegramId, 'Ocurrio un error');
        }
    }
}
