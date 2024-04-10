import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenInformationM2Service {
  getHello(): string {
    return 'Hello World!';
  }
}
