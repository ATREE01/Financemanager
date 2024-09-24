import { CreateStockRecord } from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

import { CreateStockBuyRecordDto } from './create-stock-buy-record.dto';

export class CreateStockRecordDto implements CreateStockRecord {
  @ApiProperty()
  @IsString()
  brokerageFirmId: string;

  @ApiProperty()
  @IsString()
  userStockId: string;

  @ApiProperty()
  @IsNumber()
  buyPrice: number;

  @ApiProperty()
  @IsNumber()
  buyExchangeRate: number;

  @ApiProperty()
  @IsOptional()
  createStockBuyRecord?: CreateStockBuyRecordDto;
}
