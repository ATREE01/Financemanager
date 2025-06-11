import { CreateUser } from '@financemanager/financemanager-website-types';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto implements CreateUser {
  @IsString()
  username: string;

  // @IsEmail() TODO: if I implement email validation, This validator should be used instead.
  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  hashedPassword: string;
}
