import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BrokerageFirm } from '@/src/borkerage-firm/entities/brokerage-firm.entity';
import { StockBuyRecord } from '@/src/stock/entities/stock-buy-record.entity';
import { StockSellRecord } from '@/src/stock/entities/stock-sell-reocrd.entity';
import { UserStock } from '@/src/stock/entities/user-stock.entity';
import { User } from '@/src/user/entities/user.entity';

@Entity('StockReocrds')
export class StockRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.stockRecords)
  user: User;

  @ManyToOne(
    () => BrokerageFirm,
    (brokerageFirm) => brokerageFirm.stockRecords,
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
  buyPrice: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 4,
  })
  buyExchangeRate: number;

  @OneToMany(
    () => StockBuyRecord,
    (stockBuyRecord) => stockBuyRecord.stockRecord,
    {
      cascade: true,
    },
  )
  stockBuyRecords: StockBuyRecord[];

  @OneToMany(
    () => StockSellRecord,
    (stockSellRecord) => stockSellRecord.stockRecord,
    {
      cascade: true,
    },
  )
  stockSellRecords: StockSellRecord[];
}
