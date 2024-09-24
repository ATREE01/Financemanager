import { CreateStockBundleSellRecord } from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CreateStockSellRecordDto } from './create-stock-sell-record.dto';

export class CreateStockBundleSellRecordDto
  implements CreateStockBundleSellRecord
{
  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  bankId: string;

  @ApiProperty()
  @IsString()
  brokerageFirmId: string;

  @ApiProperty()
  @IsString()
  userStockId: string;

  @ApiProperty()
  @IsNumber()
  sellPrice: number;

  @ApiProperty()
  @IsNumber()
  sellExchangeRate: number;

  @ApiProperty()
  @IsNumber()
  charge: number;

  @ApiProperty()
  @IsNumber()
  tax: number;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  note: string | null;

  @ApiProperty()
  createStockSellRecords: {
    [stockRecordId: number]: CreateStockSellRecordDto;
  };
}
