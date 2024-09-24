import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BankModule } from '../bank/bank.module';
import { BrokerageModule } from '../borkerage-firm/brokerage.module';
import { CategoryModule } from '../category/category.module';
import { CurrencyModule } from '../currency/currency.module';
import { IncExpModule } from '../inc-exp/inc-exp.module';
import { StockModule } from '../stock/stock.module';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BankModule,
    BrokerageModule,
    CurrencyModule,
    CategoryModule,
    IncExpModule,
    StockModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
