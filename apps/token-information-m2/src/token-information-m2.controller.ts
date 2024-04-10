import { Controller, Get } from '@nestjs/common';
import { TokenInformationM2Service } from './token-information-m2.service';

@Controller()
export class TokenInformationM2Controller {
  constructor(private readonly tokenInformationM2Service: TokenInformationM2Service) {}

  @Get()
  getHello(): string {
    return this.tokenInformationM2Service.getHello();
  }
}
