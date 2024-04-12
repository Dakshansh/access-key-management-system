import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { AccessKeyRepository } from '@app/common';

@Injectable()
export class CustomThrottlerStorageService implements ThrottlerStorage {
  constructor(private readonly accessKeyRepository: AccessKeyRepository) {}

  private requests = new Map<string, { value: number; expiresAt: Date }>();
  async get(key: string): Promise<number | null> {
    const request = this.requests.get(key);
    if (!request || request.expiresAt < new Date()) {
      return null;
    }
    return request.value;
  }

  async set(key: string, value: number, ttl: number): Promise<void> {
    this.requests.set(key, {
      value,
      expiresAt: new Date(new Date().getTime() + ttl * 1000),
    });
  }

  async increment(key: string, ttl: number): Promise<any> {
    throw new Error('Not implemented');
  }

  async isRateLimitExceeded(key: string, ttl: number): Promise<boolean> {
    const currentTime = new Date();
    let request = this.requests.get(key);

    if (request === undefined) {
      request = {
        value: 1,
        expiresAt: new Date(new Date().getTime() + ttl * 1000),
      };
      this.requests.set(key, request);
    } else if (request !== undefined && request?.expiresAt < currentTime) {
      request = {
        value: 1,
        expiresAt: new Date(new Date().getTime() + ttl * 1000),
      };
      this.requests.set(key, request);
    } else {
      request.value++;
    }

    const accessKey = await this.accessKeyRepository.findOne({ key });
    if (!accessKey) {
      throw new Error('Invalid access key');
    }

    if (request.value > accessKey.rateLimit) {
      return true;
    }

    return false;
  }
}
