import { Module } from '@nestjs/common';
import { TokenInformationM2Controller } from './token-information-m2.controller';
import { TokenInformationM2Service } from './token-information-m2.service';
import {
  AccessKey,
  AccessKeyRepository,
  AccessKeySchema,
  CustomThrottlerStorageService,
  DatabaseModule,
  RateLimitGuard,
} from '@app/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: AccessKey.name, schema: AccessKeySchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        // PORT: Joi.number().required(),
      }),
      envFilePath: './apps/token-information-m2/.env',
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: 10,
          limit: 5,
        },
      ],
    }),
  ],
  controllers: [TokenInformationM2Controller],
  providers: [
    TokenInformationM2Service,
    AccessKeyRepository,
    CustomThrottlerStorageService,
    RateLimitGuard,
  ],
})
export class TokenInformationM2Module {}
