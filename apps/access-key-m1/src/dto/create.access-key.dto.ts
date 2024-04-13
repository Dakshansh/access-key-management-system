import { Transform } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinDate,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (target: any, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: target.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const currentDate = new Date();
          currentDate.setHours(currentDate.getHours() + 5);
          currentDate.setMinutes(currentDate.getMinutes() + 30);
          const inputDate = new Date(value);
          console.log(inputDate, currentDate, 'dates here');
          return inputDate > currentDate;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a future date in IST time zone.`;
        },
      },
    });
  };
}
export class CreateAccessKeyDto {
  @IsNotEmpty()
  @IsNumber()
  rateLimit: number;

  @IsNotEmpty()
  @IsString()
  @IsFutureDate()
  expirationDate: string;
}
