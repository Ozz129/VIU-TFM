import { NestFactory } from '@nestjs/core';
import { MainModule } from './modules/main/main.module';
import { BadRequestExceptionFilter } from './utils/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new BadRequestExceptionFilter())
  await app.listen(3000);
}
bootstrap();
