import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToMany(() => UserStock, (userStock) => userStock.stock)
  userStock?: UserStock[];

  @OneToMany(() => StockHistory, (stockHistory) => stockHistory.stock)
  stockHistory?: StockHistory[];
}
