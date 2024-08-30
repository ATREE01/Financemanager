import {
  CreateIncExpRecord,
  IncExpMethodType,
  IncExpRecordType,
} from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateIncExpRecordDto implements CreateIncExpRecord {
  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  @IsEnum(IncExpRecordType)
  type: IncExpRecordType;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsNumber()
  currencyId: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty()
  @IsString()
  @IsEnum(IncExpMethodType)
  method: IncExpMethodType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bankId: string | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  charge: number | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string | null;
}
