import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Currency } from '@/src/currency/entities/currency.entity';
import { StockHistory } from '@/src/stock/entities/stock-history.entity';
import { UserStock } from '@/src/stock/entities/user-stock.entity';

@Entity('Stock')
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 6,
  })
  close: number;

  @ManyToOne(() => Currency)
  currency: Currency;

  @OneToMany(() => UserStock, (userStock) => userStock.stock)
  userStock?: UserStock[];

  @OneToMany(() => StockHistory, (stockHistory) => stockHistory.stock)
  stockHistory?: StockHistory[];
}
