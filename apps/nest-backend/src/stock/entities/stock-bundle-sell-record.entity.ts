import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Bank } from '@/src/bank/entities/bank.entity';
import { BrokerageFirm } from '@/src/borkerage-firm/entities/brokerage-firm.entity';
import { StockSellRecord } from '@/src/stock/entities/stock-sell-reocrd.entity';
import { UserStock } from '@/src/stock/entities/user-stock.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('StockBundleSellRecords')
export class StockBundleSellRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.stockBundleSellRecords)
  user: User;

  @OneToMany(
    () => StockSellRecord,
    (stockSellRecord) => stockSellRecord.stockBundleSellRecord,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  stockSellRecords: StockSellRecord[];

  @Column({
    type: 'date',
  })
  date: string;

  @ManyToOne(() => Bank, (bank) => bank.stockBundleSellRecords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bank: Bank;

  @ManyToOne(
    () => BrokerageFirm,
    (brokerageFirm) => brokerageFirm.stockBundleSellRecords,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  brokerageFirm: BrokerageFirm;

  @ManyToOne(() => UserStock, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userStock: UserStock;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
  })
  sellPrice: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
  })
  sellExchangeRate: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  charge: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  tax: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  note: string | null;
}
