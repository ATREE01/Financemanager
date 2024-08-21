import { CreateIncExpRecord } from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateIncExpRecordDto implements CreateIncExpRecord {
  @ApiProperty()
  date: string;

  @ApiProperty()
  @IsString()
  type: string;

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
  method: string;

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
