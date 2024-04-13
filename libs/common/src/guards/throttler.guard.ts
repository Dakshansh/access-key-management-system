import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CustomThrottlerStorageService } from '../services/custom.rate-limiting.service';
import { Logger } from '@nestjs/common';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);
  constructor(private readonly throttler: CustomThrottlerStorageService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.params.key;
    const ttl = 60;

    const isRateLimitExceeded = await this.throttler.isRateLimitExceeded(
      key,
      ttl,
    );

    if (isRateLimitExceeded) {
      this.logger.warn(
        `Requested Key: ${key}, Timestamp: ${new Date()}, Result: Rate limit exceeded for key.`,
      );
      throw new ForbiddenException('Rate limit exceeded');
    } else {
      this.logger.log(
        `Requested Key: ${key}, Timestamp: ${new Date()}, Result: Request processed successfully.`,
      );
    }
    return true;
  }
}
