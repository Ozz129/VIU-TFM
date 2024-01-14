import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MainModule } from './modules/main/main.module';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.setGlobalPrefix('v1')
  await app.listen(3000);
}
bootstrap();
