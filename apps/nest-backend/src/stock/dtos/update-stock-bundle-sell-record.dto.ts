import { UpdateStockBundleSellRecord } from '@financemanager/financemanager-website-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateStockBundleSellRecordDto
  implements Omit<UpdateStockBundleSellRecord, 'id' | 'brokerageFirm'>
{
  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsString()
  bankId: string;

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
}
