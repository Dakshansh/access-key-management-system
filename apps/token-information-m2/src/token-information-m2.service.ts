import { Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class TokenInformationM2Service {
  private readonly logger = new Logger(TokenInformationM2Service.name);
  constructor() {}

  async getTokenInfo(key: string) {
    try {
      if (!key) {
        throw new NotFoundException('Access key not found');
      }

      return { token: 'mock-token', userId: 'mock-user-id' };
    } catch (err) {
      this.logger.error(`Error fetching token information for key: ${key}`);
      throw err;
    }
  }
}
