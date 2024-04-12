import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TokenInformationM2Service } from './token-information-m2.service';
import { RateLimitGuard } from '@app/common';
import { Logger } from '@nestjs/common';
@Controller('api/tokens')
// @UseGuards(UserSpecificThrottlerGuard)
export class TokenInformationM2Controller {
  private readonly logger = new Logger(TokenInformationM2Controller.name);
  constructor(
    private readonly tokenInformationM2Service: TokenInformationM2Service,
  ) {}

  @UseGuards(RateLimitGuard)
  @Get('get-token-info/:key')
  async getAccessKeyDetails(@Param('key') key: string): Promise<any> {
    return await this.tokenInformationM2Service.getTokenInfo(key);
  }
}
