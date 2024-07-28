import { Register } from '@financemanager/financemanager-webiste-types';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto implements Register {
  @IsString()
  username: string;

  // @IsEmail() TODO: if I implement email validation, This validator should be used instead.
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
