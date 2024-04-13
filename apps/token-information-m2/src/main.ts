import { NestFactory } from '@nestjs/core';
import { TokenInformationM2Module } from './token-information-m2.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(TokenInformationM2Module);
  const configService = app.get(ConfigService);
  app.enableCors({ origin: '*' });
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
