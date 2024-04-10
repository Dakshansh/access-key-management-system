import { NestFactory } from '@nestjs/core';
import { TokenInformationM2Module } from './token-information-m2.module';

async function bootstrap() {
  const app = await NestFactory.create(TokenInformationM2Module);
  await app.listen(3000);
}
bootstrap();
