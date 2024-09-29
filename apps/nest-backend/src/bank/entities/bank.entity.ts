import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { BankRecord } from '@/src/bank/entities/bank-reocrd.entity';
import { TimeDepositRecord } from '@/src/bank/entities/time-deposit-record.entity';
import { Currency } from '@/src/currency/entities/currency.entity';
import { StockBundleSellRecord } from '@/src/stock/entities/stock-bundle-sell-record.entity';
import { StockBuyRecord } from '@/src/stock/entities/stock-buy-record.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('Banks')
@Unique(['name', 'user'])
export class Bank {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Currency, (currency) => currency.bank)
  currency: Currency;

  @ManyToOne(() => User, (user) => user.bank, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => BankRecord, (bankRecord) => bankRecord.bank)
  bankRecords?: BankRecord[];

  @OneToMany(() => StockBuyRecord, (StockBuyRecord) => StockBuyRecord.bank)
  stockBuyRecords?: StockBuyRecord[];

  @OneToMany(
    () => StockBundleSellRecord,
    (stockBundleSellRecord) => stockBundleSellRecord.bank,
  )
  stockBundleSellRecords?: StockBundleSellRecord[];

  @OneToMany(
    () => TimeDepositRecord,
    (timeDepositRecord) => timeDepositRecord.bank,
  )
  timeDepositRecords?: TimeDepositRecord[];

  @Column()
  order: number;
}
