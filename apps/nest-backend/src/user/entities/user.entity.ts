import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { BankRecord } from '@/src/bank/entities/bank-reocrd.entity';
import { TimeDepositRecord } from '@/src/bank/entities/time-deposit-record.entity';
import { BrokerageFirm } from '@/src/borkerage-firm/entities/brokerage-firm.entity';
import { Category } from '@/src/category/entities/category.entity';
import { CurrencyTransactionRecord } from '@/src/currency/entities/currency-transaction-record.entity';
import { UserCurrency } from '@/src/currency/user-currency/entities/user-currency.entity';
import { IncExpRecord } from '@/src/inc-exp/entities/inc-exp-record.entity';
import { StockBundleSellRecord } from '@/src/stock/entities/stock-bundle-sell-record.entity';
import { StockRecord } from '@/src/stock/entities/stock-record.entity';
import { Profile } from '@/src/user/profile/entities/profile.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hashedPassword: string;

  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'CASCADE',
    cascade: true,
    eager: true,
  })
  profile: Profile;

  @OneToMany(() => Category, (category) => category.user)
  category?: Category[];

  @OneToMany(() => UserCurrency, (userCurrency) => userCurrency.user)
  currency?: UserCurrency[];

  @OneToMany(() => IncExpRecord, (incExpRecord) => incExpRecord.user)
  incExpRecords?: IncExpRecord[];

  @OneToMany(() => Bank, (bank) => bank.user)
  bank?: Bank[];

  @OneToMany(() => BankRecord, (bankRecord) => bankRecord.user)
  bankRecords?: BankRecord[];

  @OneToMany(
    () => CurrencyTransactionRecord,
    (currencyTransactionRecord) => currencyTransactionRecord.user,
  )
  currencyTransactionRecords?: CurrencyTransactionRecord[];

  @OneToMany(
    () => TimeDepositRecord,
    (timeDepositRecord) => timeDepositRecord.user,
  )
  timeDepositRecords?: TimeDepositRecord[];

  @OneToMany(() => BrokerageFirm, (brokerageFirm) => brokerageFirm.user)
  brokerageFirms?: BrokerageFirm[];

  @OneToMany(() => StockRecord, (stockReocrd) => stockReocrd.user)
  stockRecords?: StockRecord[];

  @OneToMany(
    () => StockBundleSellRecord,
    (stockBundleSellRecord) => stockBundleSellRecord.user,
  )
  stockBundleSellRecords?: StockBundleSellRecord[];
}
