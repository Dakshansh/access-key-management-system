import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsFutureDate } from './create.access-key.dto';

export class UpdateAccessKeyDto {
  @IsNotEmpty()
  @IsNumber()
  rateLimit?: number;

  @IsNotEmpty()
  @IsString()
  @IsFutureDate()
  expirationDate?: string;
}
