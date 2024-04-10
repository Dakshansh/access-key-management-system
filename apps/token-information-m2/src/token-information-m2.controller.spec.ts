import { Test, TestingModule } from '@nestjs/testing';
import { TokenInformationM2Controller } from './token-information-m2.controller';
import { TokenInformationM2Service } from './token-information-m2.service';

describe('TokenInformationM2Controller', () => {
  let tokenInformationM2Controller: TokenInformationM2Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TokenInformationM2Controller],
      providers: [TokenInformationM2Service],
    }).compile();

    tokenInformationM2Controller = app.get<TokenInformationM2Controller>(TokenInformationM2Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tokenInformationM2Controller.getHello()).toBe('Hello World!');
    });
  });
});
