/**
 * - create (registration)
 * - read: 1 (get All)
 * - read: 2 (get by)
 * - read: 3 (login)
 * - update (Actualizacion)
 * - delete (Soft delete - patch)
 */

import { Injectable } from "@nestjs/common";
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class NotificationService {
    constructor() {}

    async sendTelegram() {
        const token = '6428078520:AAE5irWoEtxiR5QjWNNCMX_DSgs_HRfMtaI';
        const bot = new TelegramBot(token, { polling: true });
        const chatId = '6730496316';
        bot.sendMessage(chatId, 'Hola, tienes una acción de riego programada para ejecutarse en 30 minutos, el pronostico del clima muestra un periodo lluvia proximo, quieres detener el riego?');
    }

    async sendEmail() {

    }
}