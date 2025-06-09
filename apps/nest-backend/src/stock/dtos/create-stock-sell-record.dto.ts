import { CreateStockSellRecord } from '@financemanager/financemanager-website-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateStockSellRecordDto implements CreateStockSellRecord {
  @ApiProperty()
  @IsNumber()
  shareNumber: number;
}
