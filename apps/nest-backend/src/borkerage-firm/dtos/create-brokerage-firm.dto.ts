import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateBrokerageFirmDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  transactionCurrencyId: number;

  @ApiProperty()
  @IsNumber()
  settlementCurrencyId: number;
}
