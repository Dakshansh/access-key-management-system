import { Module } from '@nestjs/common';
import { AccessKeyM1Controller } from './access-key-m1.controller';
import { AccessKeyM1Service } from './access-key-m1.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import {
  AccessKeyRepository,
  DatabaseModule,
  AccessKey,
  AccessKeySchema,
} from '@app/common';

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
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/access-key-m1/.env',
    }),
  ],
  controllers: [AccessKeyM1Controller],
  providers: [AccessKeyM1Service, AccessKeyRepository],
})
export class AccessKeyM1Module {}
