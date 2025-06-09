import { CreateBank } from '@financemanager/financemanager-website-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateBankDto implements CreateBank {
  @ApiProperty()
  @IsString()
  @MaxLength(16)
  name: string;

  @ApiProperty()
  @IsNumber()
  currencyId: number;
}
