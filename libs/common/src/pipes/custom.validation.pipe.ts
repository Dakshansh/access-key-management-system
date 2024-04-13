import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, metaData: ArgumentMetadata) {
    const { metatype } = metaData;
    if (this.isEmpty(value)) {
      throw new HttpException(
        'Validation failed: No payload provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    const object = plainToInstance(metatype, value, {
      exposeDefaultValues: true,
    });
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      throw new HttpException(
        { errors: this.formatBadRequestErrors(errors) },
        HttpStatus.BAD_REQUEST,
      );
    }
    return object;
  }

  private isEmpty(value: any) {
    if (Object.keys(value).length < 1) {
      return true;
    }
    return false;
  }

  private formatBadRequestErrors(errors: any[]) {
    return errors.map((error) => {
      let err: any = {
        type: 'Invalid',
        field: error.property,
        message: error.constraints[Object.keys(error.constraints)[0]],
      };
      return err;
    });
  }
}
