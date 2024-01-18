import * as TelegramBot from 'node-telegram-bot-api';

export default {
    sendTelegramMessage(chatId: string, msg: string) {
        const token = process.env.TELEGRAM_TOKEN;
        const bot = new TelegramBot(token, { polling: true });
        bot.sendMessage(chatId, msg);
    },
    sendEmail() {

    }
}
