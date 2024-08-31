import {
  CreateCurrencyTransactionRecord,
  CurrencyTransactionRecordType,
} from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCurrencyTransactionRecordDto
  implements CreateCurrencyTransactionRecord
{
  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsEnum(CurrencyTransactionRecordType)
  type: CurrencyTransactionRecordType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  fromBankId: string | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  toBankId: string | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fromCurrencyId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  toCurrencyId: number | null;

  @ApiProperty()
  @IsNumber()
  fromAmount: number;

  @ApiProperty()
  @IsNumber()
  toAmount: number;

  @ApiProperty()
  @IsNumber()
  exchangeRate: number;

  @ApiProperty()
  @IsNumber()
  charge: number;
}
