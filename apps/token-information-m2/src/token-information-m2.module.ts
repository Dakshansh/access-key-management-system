import { Module } from '@nestjs/common';
import { TokenInformationM2Controller } from './token-information-m2.controller';
import { TokenInformationM2Service } from './token-information-m2.service';

@Module({
  imports: [],
  controllers: [TokenInformationM2Controller],
  providers: [TokenInformationM2Service],
})
export class TokenInformationM2Module {}
