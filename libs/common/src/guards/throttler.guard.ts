// import { ThrottlerGuard } from '@nestjs/throttler';
// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AccessKeyRepository } from '@app/common';

// import { ExecutionContext } from "@nestjs/common";
// import { ThrottlerGuard } from "@nestjs/throttler";

// @Injectable()
// export class UserSpecificThrottlerGuard extends ThrottlerGuard {
//     constructor(private readonly accessKeyRepository:AccessKeyRepository) {
//         super()
//     }
//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const key = request.params.key;
//         const accessKey = await this.accessKeyRepository.findOne({ key });
//         accessKey.rateLimit

//         if (!accessKey) {
//           throw new Error('Invalid access key');
//         }

//         return super.canActivate(context);
//       }
// }

// // user-specific-throttler.guard.ts
// import { ThrottlerGuard, ThrottlerModuleOptions, ThrottlerException } from '@nestjs/throttler';
// import { ExecutionContext, Injectable } from '@nestjs/common';
// import { AccessKeyRepository } from '@app/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class UserSpecificThrottlerGuard extends ThrottlerGuard {
//   constructor(
//     private readonly accessKeyRepository: AccessKeyRepository,
//     private readonly throttlerOptions: ThrottlerModuleOptions,
//     public readonly storageService: any,
//     public readonly reflector: Reflector
//   ) {
//     super(throttlerOptions,storageService,reflector);
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const key = request.params.key;

//     const accessKey = await this.accessKeyRepository.findOne({ key });

//     if (!accessKey) {
//       throw new Error('Invalid access key');
//     }
//     return super.canActivate(context);
//   }
// }

// import {
//   ThrottlerGuard,
//   ThrottlerModuleOptions,
//   ThrottlerStorageService,
// } from '@nestjs/throttler';
// import { ExecutionContext, Injectable } from '@nestjs/common';
// import {
//   AccessKeyRepository,
//   CustomThrottlerStorageService,
// } from '@app/common';
// import { Reflector } from '@nestjs/core';

// @Injectable()
// export class UserSpecificThrottlerGuard extends ThrottlerGuard {
//   constructor(
//     readonly throttlerService: ThrottlerStorageService,
//     readonly throttlerOptions: ThrottlerModuleOptions,
//     readonly reflector: Reflector,
//     private readonly accessKeyRepository: AccessKeyRepository,
//     // private readonly customThrottlerStorageService: CustomThrottlerStorageService,
//   ) {
//     super(throttlerOptions, throttlerService, reflector);
//   }

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const key = request.params.key;

//     const accessKey = await this.accessKeyRepository.findOne({ key });

//     if (!accessKey) {
//       throw new Error('Invalid access key');
//     }

//     const rateLimit = accessKey.rateLimit;

//     if (rateLimit === undefined) {
//       throw new Error('Rate limit not defined for the access key');
//     }

//     console.log(
//       'record of request count and rate limit is ',
//       rateLimit,
//       key,
//       //   this.throttlerService,
//       //   this.throttlerService[0].storage.CustomThrottlerStorageService,
//       this.throttlerService,
//     );
//     const currentRequestCount = await this.throttlerService.increment(key, 60);

//     if (currentRequestCount.totalHits >= rateLimit) {
//       throw new Error('Rate limit exceeded');
//     }

//     return true;
//   }

//   async onModuleInit() {}
// }

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
    const ttl = 30; // Define your TTL here

    const isRateLimitExceeded = await this.throttler.isRateLimitExceeded(
      key,
      ttl,
    );

    // console.log(isRateLimitExceeded, ' << rate ');
    if (isRateLimitExceeded) {
      this.logger.warn(`Rate limit exceeded for key: ${key}`);
      throw new ForbiddenException('Rate limit exceeded');
    } else {
      this.logger.log(`Request processed successfully for key: ${key}`);
    }

    // Return true if rate limit is not exceeded, false otherwise
    return true;
  }
}
