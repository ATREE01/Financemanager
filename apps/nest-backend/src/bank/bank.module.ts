import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BankController } from './bank.controller';
import { BankService } from './bank.service';
import { Bank } from './entities/bank.entity';
import { BankRecord } from './entities/bank-reocrd.entity';
import { TimeDepositRecord } from './entities/time-deposit-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bank, BankRecord, TimeDepositRecord])],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
