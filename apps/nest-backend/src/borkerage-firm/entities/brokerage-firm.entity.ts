import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Currency } from '@/src/currency/entities/currency.entity';
import { StockBundleSellRecord } from '@/src/stock/entities/stock-bundle-sell-record.entity';
import { StockRecord } from '@/src/stock/entities/stock-record.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('BrokerageFirm')
export class BrokerageFirm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.brokerageFirms, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @Column()
  name: string;

  @OneToMany(
    () => StockBundleSellRecord,
    (stockBundleSellRecord) => stockBundleSellRecord.brokerageFirm,
  )
  stockBundleSellRecords?: StockBundleSellRecord[];

  @OneToMany(() => StockRecord, (stockRecord) => stockRecord.brokerageFirm)
  stockRecords?: StockRecord[];

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  transactionCurrency: Currency;

  @ManyToOne(() => Currency, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  settlementCurrency: Currency;

  @Column()
  order: number;
}
