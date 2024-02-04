import * as TelegramBot from 'node-telegram-bot-api';

export default {
    async sendTelegramMessage(chatId: string, msg: string, options?: any) {
        const token = process.env.TELEGRAM_TOKEN;
        const bot = new TelegramBot(token, { polling: true });
        const message = await bot.sendMessage(chatId, msg, options)
        return message.message_id;
    },
    sendEmail() {

    }
}
