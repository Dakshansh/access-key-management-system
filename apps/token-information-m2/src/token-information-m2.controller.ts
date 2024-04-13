import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TokenInformationM2Service } from './token-information-m2.service';
import { RateLimitGuard } from '@app/common';
@Controller('api/tokens')
@UseGuards(RateLimitGuard)
export class TokenInformationM2Controller {
  constructor(
    private readonly tokenInformationM2Service: TokenInformationM2Service,
  ) {}

  @Get('get-token-info/:key')
  async getAccessKeyDetails(@Param('key') key: string): Promise<any> {
    return await this.tokenInformationM2Service.getTokenInfo(key);
  }
}
