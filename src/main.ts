import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/main/main.module';
import { BadRequestExceptionFilter } from './utils/filters/exception.filter';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new BadRequestExceptionFilter())
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(3000);

  const token = '6428078520:AAE5irWoEtxiR5QjWNNCMX_DSgs_HRfMtaI';
  const url = `https://api.telegram.org/bot${token}/setWebhook`;
  const ngrokUrl = 'https://d661-2800-484-e77d-89d0-8046-6f5a-ea67-682.ngrok-free.app/v1/webhook/telegram'; // Reemplaza con tu URL pública

  axios.post(url, { url: ngrokUrl })
    .then(() => {/*console.log('Webhook configurado')*/})
    .catch(err => console.error('Error configurando el webhook', err));
}
bootstrap();
