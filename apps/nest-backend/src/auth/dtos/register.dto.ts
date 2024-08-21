import { Register } from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto implements Register {
  @ApiProperty()
  @IsString()
  username: string;

  //TODO: if I implement email validation, This validator should be used instead.
  // @IsEmail()
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
