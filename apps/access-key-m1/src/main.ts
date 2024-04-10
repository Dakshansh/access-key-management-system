import { NestFactory } from '@nestjs/core';
import { AccessKeyM1Module } from './access-key-m1.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AccessKeyM1Module);
  const configService = app.get(ConfigService);
  app.enableCors({ origin: "*" });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
