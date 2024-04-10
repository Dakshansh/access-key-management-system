import { Test, TestingModule } from '@nestjs/testing';
import { AccessKeyM1Controller } from './access-key-m1.controller';
import { AccessKeyM1Service } from './access-key-m1.service';

describe('AccessKeyM1Controller', () => {
  let accessKeyM1Controller: AccessKeyM1Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AccessKeyM1Controller],
      providers: [AccessKeyM1Service],
    }).compile();

    accessKeyM1Controller = app.get<AccessKeyM1Controller>(AccessKeyM1Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(accessKeyM1Controller.getHello()).toBe('Hello World!');
    });
  });
});
