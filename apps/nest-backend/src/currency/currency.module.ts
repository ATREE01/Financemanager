import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { Currency } from './entities/currency.entity';
import { UserCurrency } from './user-currency/entities/user-currency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Currency, UserCurrency])],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
