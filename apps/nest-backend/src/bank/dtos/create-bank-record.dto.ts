import {
  BankRecordType,
  CreateBankRecord,
} from '@financemanager/financemanager-website-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateBankRecordDto implements CreateBankRecord {
  @ApiProperty()
  @IsEnum(BankRecordType)
  type: BankRecordType;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  bankId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(0)
  charge: number | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string | null;
}
