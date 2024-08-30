import { CreateUserCurrency } from '@financemanager/financemanager-webiste-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateUserCurrencyDto implements CreateUserCurrency {
  @ApiProperty()
  @IsNumber()
  currencyId: number;
}
